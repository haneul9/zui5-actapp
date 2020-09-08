jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.ZipSearch");

sap.ui.controller("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageExam", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageExam
	 */

	PAGEID : "ZUI5_HR_ForeignLanguageExam",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ExmtyJSonModel : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'BE02',
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
		_gZworktyp = "BE02";
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		var vLoginData = common.Common.getEmpLoginInfo(_gAuth, _gZworktyp);
		
		vEmpLoginInfo[0].ReqAuth = vLoginData.ReqAuth;
		gReqAuth = vLoginData.ReqAuth || "1";
		
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
		oDetailData.Data.Excnt = oDetailData.Data.Excnt || 0;
		oController._DetailJSonModel.setData(oDetailData);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);
		
		// 당해년도 시험횟수 조회
		var curDate = new Date();
		if(_gAuth == "E") oController.retrieveExamCount(oController, curDate.getFullYear());
		
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
				
				oDetailData.Data.Score = (oDetailData.Data.Score) ? String(oDetailData.Data.Score) : undefined;
				oDetailData.Data.Excnt = (oDetailData.Data.Excnt) ? Number(oDetailData.Data.Excnt) : 0;
				oDetailData.Data.Appamt = (oDetailData.Data.Appamt) ? common.Common.numberWithCommas(oDetailData.Data.Appamt) : undefined;
				oDetailData.Data.Exdat = (oDetailData.Data.Exdat) ? dateFormat.format(oDetailData.Data.Exdat) : undefined;
				oDetailData.Data.Effdat = (oDetailData.Data.Effdat) ? dateFormat.format(oDetailData.Data.Effdat) : undefined;
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
			oDetailTitle.setText(oBundleText.getText("LABEL_0256") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 256:외국어 시험비용 신청
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0256") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 256:외국어 시험비용 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0256") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 256:외국어 시험비용 신청
		}
	},
	
	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageExam"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageExam"),
			oController = oView.getController();
	},
	
	onChangeExmty : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageExam"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_FOREIGNLANG_SRV"),
			vExmty = oEvent.getSource().getSelectedKey(),
			vQuali = "",
			vQualitx = "";
		
		if(!oController._ExmtyJSonModel.getProperty("/Data")) {
			oModel.read("/ExmtyCodeListSet", {
				async : false,
				success : function(data, res) {
					if(data.results && data.results.length) {
						oController._ExmtyJSonModel.setProperty("/Data", data.results);
					}
				},
				error : function(Res) {}
			});
		}
		
		oController._ExmtyJSonModel.getProperty("/Data").forEach(function(elem) {
			if(elem.Key == vExmty) {
				vQuali = elem.Quali;
				vQualitx = elem.Qualitx;
			}
		});
		
		oController._DetailJSonModel.setProperty("/Data/Quali", vQuali);
		oController._DetailJSonModel.setProperty("/Data/Qualitx", vQualitx);
	},
	
	onChangeExdat : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageExam"),
			oController = oView.getController(),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			vExdat = oEvent.getSource().getDateValue(),
			vEffdat;
		
		if(!vExdat) return;
		
		if(vExdat > new Date()) {
			sap.m.MessageBox.show(oBundleText.getText("LABEL_0273"), {});	// 273:현재보다 미래일자로 입력할 수 없습니다.
			oController._DetailJSonModel.setProperty("/Data/Exdat", undefined);
			oController._DetailJSonModel.setProperty("/Data/Effdat", undefined);
			return;
		}
		
		vEffdat = new Date(vExdat.getFullYear()+2, vExdat.getMonth(), vExdat.getDate());
		
		oController._DetailJSonModel.setProperty("/Data/Effdat", dateFormat.format(vEffdat));
		
		// 당해년도 시험횟수 조회
		oController.retrieveExamCount(oController, vExdat.getFullYear());
	},
	
	retrieveExamCount : function(oController, vYear) {
		var oModel = sap.ui.getCore().getModel("ZHR_FOREIGNLANG_SRV"),
			vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"),
			vExcnt = 0;
		
		if(!vPernr || !vYear) return;
		
		oModel.read("/LangExCountSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, vPernr),
				new sap.ui.model.Filter('Year', sap.ui.model.FilterOperator.EQ, vYear)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					vExcnt = Number(data.results[0].Excnt);
					
					oController._DetailJSonModel.setProperty("/Data/Excnt", vExcnt);
				}
			},
			error : function(Res) {}
		});
		
		if(vExcnt > 1) {
			oController._DetailJSonModel.setProperty("/Data/Onlysc", true);
			oController._DetailJSonModel.setProperty("/Data/Appamt", undefined);
		}
	},
	
	onChangeGrade : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageExam"),
			oController = oView.getController(),
			vScore = oController._DetailJSonModel.getProperty("/Data/Score");
		
		if(!vScore) oController._DetailJSonModel.setProperty("/Data/Score", "0");
	},
	
	onSelectOnlysc : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageExam"),
			oController = oView.getController();
		
		if(oEvent.getSource().getSelected()) {
			oController._DetailJSonModel.setProperty("/Data/Appamt", undefined);
		}
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageExam"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageExam"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty) { // 처리 구분
		var vZappStatAl	= "", 
			errData = {},
			vOData = oController.onValidationData(oController, vPrcty);
		
		if(vOData == "") return;
		
		vOData.ZreqForm = "BE02";
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
		
		if(vPrtcy == "C") {
			if(!vData.Exmty) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0258"));	// 258:외국어 시험유형이 선택되지 않았습니다.
				return "";
			}
			if(!vData.Exdat) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0265"));	// 265:응시일이 입력되지 않았습니다.
				return "";
			}
			if(!vData.Score) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0251"));	// 251:시험점수가 입력되지 않았습니다.
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
			rData.Exdat = (rData.Exdat) ? "\/Date("+ common.Common.getTime(rData.Exdat)+")\/" : undefined;
			rData.Effdat = (rData.Effdat) ? "\/Date("+ common.Common.getTime(rData.Effdat)+")\/" : undefined;
			rData.Appamt = (rData.Appamt) ? common.Common.removeComma(rData.Appamt) : undefined;
			rData.Excnt = (rData.Excnt) ? String(rData.Excnt) : undefined;
			rData.Onlysc = rData.Onlysc || false;
			rData.Score = (rData.Score) ? Number(rData.Score.replace(/[^\d]/g, '')) : undefined;
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty) { // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageExam"),
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
		
		detailData.Excnt = 0;		// 당해년도 시험횟수
		detailData.Onlysc = false;	// 시험점수만 입력

		delete detailData.Exmty;	// 외국어 시험유형
		delete detailData.Exdat;	// 응시일
		delete detailData.Effdat;	// 성적유효일
		delete detailData.Score;	// 시험점수
		delete detailData.Appamt;	// 신청금액
		delete detailData.Grade;	// 등급
		delete detailData.Zbigo;	// 비고
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
	},
	
	onAfterSelectPernr : function(oController) {
		// 신청내역 초기화
		oController.onResetDetail(oController);
		
		// 당해년도 시험횟수 조회
		var curDate = new Date();
		oController.retrieveExamCount(oController, curDate.getFullYear());
	},
	
	openDocno : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageExam"),
			oController = oView.getController(),
			vUri = oController._DetailJSonModel.getProperty("/Data/Zurl");
		
		if(vUri && vUri != "")  window.open(vUri);
	}
});