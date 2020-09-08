jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.ZipSearch");

sap.ui.controller("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson
	 */

	PAGEID : "ZUI5_HR_ForeignLanguageLesson",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'BE01',
	_vEnamefg : "",
	
	_DialogActionFlag : null ,
	_vPersa : "" ,
	_vAppno : "",

	_oControl : null ,
	BusyDialog : new sap.m.BusyDialog(),
	_vFromPage : "",
	
	onInit : function() {
		this.getView()
			.addEventDelegate({
				onBeforeShow : jQuery.proxy(function(evt) {
					this.onBeforeShow(evt);
				}, this),
				onAfterShow : jQuery.proxy(function(evt) {
					this.onAfterShow(evt);
				}, this)
			})
			.addStyleClass("sapUiSizeCompact");
		
		sap.ui.getCore().getEventBus()
			.subscribe("app", "OpenWindow", this.SmartSizing, this)
			.subscribe("app", "ResizeWindow", this.SmartSizing, this);
	},

	onBeforeShow : function(oEvent) {
		var oController = this,
			vFromPageId = "",
			oDetailData = {Data : {}};
		
		oController.BusyDialog.open();
		
		// ReqAuth 값 조회하기
		_gZworktyp = "BE01";
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		var vLoginData = common.Common.getEmpLoginInfo(_gAuth, _gZworktyp);
		
		vEmpLoginInfo[0].ReqAuth = vLoginData.ReqAuth;
		gReqAuth = vLoginData.ReqAuth || "1";
		
		// parameter, 리턴페이지 처리
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno;
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		// 상세 조회
		oController.retrieveDetail(oController, oDetailData);
		
		// 상세화면 Default Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = oDetailData.Data.ZappStatAl || '';
		oDetailData.Data.Waers = oDetailData.Data.Waers || "KRW";
		oController._DetailJSonModel.setData(oDetailData);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);
		
		oController.BusyDialog.close();
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_FOREIGNLANG_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/LangExpenseApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				oDetailData.Data = data.results[0];
				
				oDetailData.Data.Appamt = (oDetailData.Data.Appamt) ? common.Common.numberWithCommas(oDetailData.Data.Appamt) : undefined;
				oDetailData.Data.Edubeg = (oDetailData.Data.Edubeg) ? dateFormat.format(oDetailData.Data.Edubeg) : undefined;
				oDetailData.Data.Eduend = (oDetailData.Data.Eduend) ? dateFormat.format(oDetailData.Data.Eduend) : undefined;
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage, {
				onClose : function() {
					oController.BusyDialog.close();
					oController.onBack();
				}
			});
			return ;
		}
	},
	
	commonAction : function(oController, oDetailData) {
		// 대상자 조회
		common.TargetUser.oController = oController;
		common.TargetUser.onSetTarget(oController);
		
		// 신청자 조회
		common.ApplyUser.oController = oController;
		common.ApplyUser.onSetApplicant(oController);
		
		// 진행상태 신청자, 대상자 Model 업데이트
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", oDetailData.Data.ZappStatAl);
		oController._ApplyJSonModel.setProperty("/Data/ZappStatAl", oDetailData.Data.ZappStatAl);
		
		// 신청안내
		common.ApplyInformation.onSetApplyInformation(oController);
		
		// 결재내역 
		common.ApprovalInformation.onSetApprovalInformation(oController);
		
		// 첨부파일 
		common.AttachFileAction.oController = oController;
		common.AttachFileAction.setAttachFile(oController);
		common.AttachFileAction.refreshAttachFileList(oController);
	},
	
	setPageHeader : function(oController, vZappStatAl) {
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		
		if(vZappStatAl == "") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0259") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 259:외국어 학습비 신청
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0259") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 259:외국어 학습비 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0259") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 259:외국어 학습비 신청
		}
	},
	
	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson"),
			oController = oView.getController();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : oController._vFromPage || "ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageList",
		      data : {}
		});
	},

	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0055"), {	// 55:유효하지 않은 날짜형식입니다.
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson"),
			oController = oView.getController();
	},
	
	onCheckEduDate : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson"),
			oController = oView.getController(),
			currDate = new Date(),
			vEdubeg = sap.ui.getCore().byId(oController.PAGEID + "_Edubeg").getDateValue(),
			vEduend = sap.ui.getCore().byId(oController.PAGEID + "_Eduend").getDateValue();
		
		if(vEdubeg > currDate || vEduend > currDate) {
			oEvent.getSource().setValue(undefined);

			sap.m.MessageBox.show(oBundleText.getText("LABEL_0266"), {});	// 266:입력하신 교육기간(개월)을 확인바랍니다.\n(현재보다 미래일자로 입력할 수 없습니다.)
			return;
		}
		
		if(!vEdubeg || !vEduend) return;
		
		if(vEdubeg > vEduend) {
			oEvent.getSource().setValue(undefined);

			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0267"), {});	// 267:종료일이 시작일보다 이 전 일수는 없습니다.
			return;
		}
	},
	
	onLimitDigit : function(oEvent) {
		// 소수점 한자리까지만 입력 가능
		var _pattern = /^(\d{1,3}([.]\d{0,1})?)?$/,
			_value = oEvent.getSource().getValue();
		
		if(!_pattern.test(_value)) {
			oEvent.getSource().setValue(_value.substring(0, _value.length - 1));
		}
	},
	
	onCheckLimit : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson"),
			oController = oView.getController(),
			vAppamt = oEvent.getSource().getValue();
		
		if(!vAppamt) return;
		
		vAppamt = Number(common.Common.removeComma(vAppamt));
		
		if(vAppamt > 50000) {
			oController._DetailJSonModel.setProperty("/Data/Appamt", "50,000");
		}
	},
	
	onSelectOnlytim : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson"),
			oController = oView.getController();
		
		if(oEvent.getSource().getSelected()) {
			oController._DetailJSonModel.setProperty("/Data/Appamt", undefined);
		}
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	onPressSaveAmtCheck : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson"),
			oController = oView.getController(),
			vAppamt = oController._DetailJSonModel.getProperty("/Data/Appamt");
		
		vAppamt = Number(common.Common.removeComma(vAppamt));
		
		if(vAppamt > 50000) {
			sap.m.MessageBox.show(oBundleText.getText("LABEL_0233"), {	// 233:5만원이상 입력하셨습니다.\n진행하시겠습니까?
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				actions : [
					sap.m.MessageBox.Action.YES, 
					sap.m.MessageBox.Action.NO
				],
				onClose : oController.preProcessAdjust
			});
		} else {
			oController.onPressSaveC();
		}
	},
	
	preProcessAdjust : function(fVal) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson"),
			oController = oView.getController();
		
		if(fVal && fVal == sap.m.MessageBox.Action.NO) {
			oController._DetailJSonModel.setProperty("/Data/Appamt", "50,000");
		}
		
		oController.onPressSaveC();
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty) { // 처리 구분
		var vZappStatAl	= "", 
			errData = {},
			vOData = oController.onValidationData(oController, vPrcty);
		
		if(vOData == "") return;
		
		vOData.ZreqForm = "BE01";
		vOData.Actty = _gAuth;
		vOData.Prcty = vPrcty;
		
		var onProcess = function() {
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_FOREIGNLANG_SRV");
			
			oModel.create("/LangExpenseApplSet", vOData, {
				success: function(data,res) {
					if(data) {
						oController._vAppno = data.Appno;
						oController._DetailJSonModel.setProperty("/Data/Appno", data.Appno); 
						oController._DetailJSonModel.setProperty("/Data/ZappStatAl", data.ZappStatAl); 
						vZappStatAl = data.ZappStatAl;
					}
				},
				error: function (Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == 'E'){
				oController.BusyDialog.close();
				new control.ZNK_SapBusy.oErrorMessage(errData.ErrorMessage);
				return ;
			}
			
			common.AttachFileAction.uploadFile(oController);
			
			oController.BusyDialog.close();
			
			sap.m.MessageBox.show(vCompTxt, {
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				onClose : oController.onBack
			});

		};
		
		var CreateProcess = function(fVal) {
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		var vInfoTxt = "" , vCompTxt = "";
		if(vPrcty == "T"){
			vInfoTxt = oBundleText.getText("LABEL_0061");	// 61:저장하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0060") ;	// 60:저장이 완료되었습니다.
		} else {
			vInfoTxt = oBundleText.getText("LABEL_0051");	// 51:신청하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0048");	// 48:신청이 완료되었습니다.
		}
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [
				sap.m.MessageBox.Action.YES, 
				sap.m.MessageBox.Action.NO
			],
			onClose : CreateProcess
		});
	},	
	
	onValidationData : function(oController, vPrtcy) {
		var oModel = sap.ui.getCore().getModel("ZHR_FOREIGNLANG_SRV"),
			rData = {},
			vData = oController._DetailJSonModel.getProperty("/Data");
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Edubeg || !vData.Eduend) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0235"));	// 235:교육기간이 입력되지 않았습니다.
			return "";
		}
		
		if(vPrtcy == "C") {
			if(!vData.Eduorg) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0237"));	// 237:교육기관이 선택되지 않았습니다.
				return "";
			}
			if(!vData.Quali) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0263"));	// 263:외국어유형이 선택되지 않았습니다.
				return "";
			}
			if(!vData.Eduway) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0238"));	// 238:교육방법이 선택되지 않았습니다.
				return "";
			}
			if(!vData.Eduatt) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0270"));	// 270:출석률이 입력되지 않았습니다.
				return "";
			}
//			if(!vData.Edutim) {
//				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_2965"));	// 2965:순 교육시간(교육시간 인정용)이 입력되지 않았습니다.
//				return "";
//			}
			if(!vData.Onlytim && !vData.Appamt) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0255"));	// 255:신청금액이 입력되지 않았습니다.
				return "";
			}
		
			var oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
			var vFileData = oAttachFileList.getModel().getProperty("/Data");
			if(!vFileData || vFileData.length < 1){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0091"), {title : oBundleText.getText("LABEL_0053")});	// 91:증빙서류를 업로드 하시기 바랍니다.
				return false;
			}
		}
		
		try {
			rData = common.Common.copyByMetadata(oModel, "LangExpenseAppl", vData);
			rData.Edubeg = "\/Date("+ common.Common.getTime(rData.Edubeg)+")\/";
			rData.Eduend = "\/Date("+ common.Common.getTime(rData.Eduend)+")\/";
			rData.Onlytim = rData.Onlytim || false;
			rData.Appamt = common.Common.removeComma(rData.Appamt);
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty) { // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson"),
			oController = oView.getController(),
			errData = {};
		
		var onProcess = function() {
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_FOREIGNLANG_SRV");
			
			oModel.remove("/LangExpenseApplSet(Appno='" + vDetailData.Appno + "')", {
				success: function(data,res) {
				},
				error: function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			oController.BusyDialog.close();
			
			if(errData.Error && errData.Error == "E") {
				sap.m.MessageBox.show(errData.ErrorMessage, {});
				return;
			} 
			
			sap.m.MessageBox.show(oBundleText.getText("LABEL_0034"), {	// 34:삭제가 완료되었습니다.
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				actions: [
					sap.m.MessageBox.Action.CLOSE
					],
					onClose: oController.onBack
			});
			
		};
		
		var DeleteProcess = function(fVal) {
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		}; 
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// 35:삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : DeleteProcess
		});
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController) {
		var detailData = oController._DetailJSonModel.getProperty("/Data");
		
		detailData.Onlytim = false;	// 교육시간만 입력

		delete detailData.Eduorg;	// 교육기관
		delete detailData.Edubeg;	// 교육기관-개월start
		delete detailData.Eduend;	// 교육기관-개월end
		delete detailData.Quali;	// 외국어유형
		delete detailData.Eduway;	// 교육방법
		delete detailData.Eduatt;	// 출석률
		delete detailData.Appamt;	// 신청금액
		delete detailData.Edutim;	// 순 교육시간
		delete detailData.Zbigo;	// 비고
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
	},
	
	onAfterSelectPernr : function(oController) {
		// 신청내역 초기화
		oController.onResetDetail(oController);
	},
	
	openDocno : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageDetail"),
			oController = oView.getController(),
			vUri = oController._DetailJSonModel.getProperty("/Data/Zurl");
		
		if(vUri && vUri != "")  window.open(vUri);
	}
});