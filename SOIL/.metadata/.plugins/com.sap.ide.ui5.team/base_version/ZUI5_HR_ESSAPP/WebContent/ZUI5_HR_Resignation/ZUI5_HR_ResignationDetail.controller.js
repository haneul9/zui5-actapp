jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.ZipSearch");

sap.ui.controller("ZUI5_HR_Resignation.ZUI5_HR_ResignationDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Resignation.ZUI5_HR_ResignationDetail
	 */

	PAGEID : "ZUI5_HR_ResignationDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'PA01',
	_vEnamefg : "",
	
	_DialogActionFlag : null ,
	_vPersa : "" ,
	_vAppno : "",
	_useCustomPernrSelection : "",

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
			oDetailData = {Data : {}},
			oDetailTableData = {Data : []};
		
		oController.BusyDialog.open();

		// parameter, 리턴페이지 처리
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno || '';
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
		oDetailData.Data.Zrest = oDetailData.Data.Zrest || '';
		oDetailData.Data.ZappStatAl = oDetailData.Data.Zrest;
		oController._DetailJSonModel.setData(oDetailData);
		
		// 반려사유
		oController.setRejectRow(oController);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// ESS - 입사일,면담자 정보
		if(_gAuth == 'E' && !oController._vAppno) oController.retrieveBasicInfo(oController);
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Resignation.ZUI5_HR_ResignationDetail"),
			oController = oView.getController();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : oController._vFromPage || "ZUI5_HR_Resignation.ZUI5_HR_ResignationList",
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_Resignation.ZUI5_HR_ResignationDetail");
		var oController = oView.getController();
	},
	
	setRejectRow : function(oController) {
		var oApplyMatrix = sap.ui.getCore().byId(oController.PAGEID + "_ApplyMatrix"),
			oMgrwd = sap.ui.getCore().byId(oController.PAGEID + "_Mgrwd"),
			vMgrwd = oController._DetailJSonModel.getProperty("/Data/Mgrwd"),
			oRow;
		
		if(oMgrwd) oMgrwd.destroy();
		if(!vMgrwd) return;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_Mgrwd", {
			height : "30px",
			cells : [
				// 면접자 반려사유
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0374")	// 374:면접자 반려사유
					}).addStyleClass("Font14px FontBold FontColor3")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 3,
					content : new sap.m.Text({
						text : "{Mgrwd}"
					}).addStyleClass("Font14px FontColor3")
				}).addStyleClass("MatrixData")
			]
		});
		
		oApplyMatrix.addRow(oRow);
	},
	
	retrieveBasicInfo : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV"),
			vPernr = oController._DetailJSonModel.getProperty("/Data/Encid"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"}),
			basicInfoData = {},
			errData = {};
			
		if(!vPernr) return;
		
		oModel.read("/RetireApplySet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'N'),
				new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth),
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vPernr)
			],
			success : function(data, res) {
				basicInfoData = data.results[0];
				
				oController._DetailJSonModel.setProperty("/Data/Entdt", dateFormat.format(basicInfoData.Entdt));
				oController._DetailJSonModel.setProperty("/Data/Mgrid", basicInfoData.Mgrid);
				oController._DetailJSonModel.setProperty("/Data/Mgrnm", basicInfoData.Mgrnm);
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage, {});
			return ;
		}
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			dateFormat2 = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"}),
			targetData = {Data: {}},
			applyData = {Data: {}},
			errData = {};
		
		oModel.read("/RetireApplySet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				oDetailData.Data = data.results[0];
				oDetailData.Data.Reret = dateFormat.format(oDetailData.Data.Reret);
				oDetailData.Data.Entdt = dateFormat2.format(oDetailData.Data.Entdt);
				
				targetData.Data.Auth = _gAuth;
				targetData.Data.Pernr = oDetailData.Data.Pernr;
				targetData.Data.Encid = oDetailData.Data.Encid;
				targetData.Data.Perid = oDetailData.Data.Perid;
				targetData.Data.Ename = oDetailData.Data.Ename;
				targetData.Data.Orgeh = oDetailData.Data.Orgeh;
				targetData.Data.Orgtx = oDetailData.Data.Orgtx;
				targetData.Data.Zzjiktl = oDetailData.Data.Zzjiktl;
				targetData.Data.Zzjiktlt = oDetailData.Data.Zzjiktlt;
				targetData.Data.Btrtx = oDetailData.Data.Btext;
				targetData.Data.Zzjikgb = oDetailData.Data.Zzjikgb;
				targetData.Data.Zzjikgbt = oDetailData.Data.Zzjikgbt;
				targetData.Data.Zzjikch = oDetailData.Data.Zzjikch;
				targetData.Data.Zzjikcht = oDetailData.Data.Zzjikcht;
				
				oController._TargetJSonModel.setData(targetData);

				applyData.Data.Ename = oDetailData.Data.Apename;
				applyData.Data.Orgtx = oDetailData.Data.Aporgtx;
				applyData.Data.Zzjikgbt = oDetailData.Data.Apzzjikgbt;
				applyData.Data.Zzjiktlt = oDetailData.Data.Apzzjiktlt;
				applyData.Data.Appdt = dateFormat2.format(oDetailData.Data.Reqdt);
				
				oController._ApplyJSonModel.setData(applyData);
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
		if(oController._vAppno == '') common.TargetUser.onSetTarget(oController);
		
		// 진행상태 신청자, 대상자 Model 업데이트
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", oDetailData.Data.ZappStatAl);
		oController._ApplyJSonModel.setProperty("/Data/ZappStatAl", oDetailData.Data.ZappStatAl);
		
		// 신청안내
		common.ApplyInformation.onSetApplyInformation(oController);
	},
	
	setPageHeader : function(oController, vZappStatAl) {
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		
		if(vZappStatAl == "") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0375") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 375:사직 신청
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0375") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 375:사직 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0375") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 375:사직 신청
		}
	},
	
	onInterviewerChange : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Resignation.ZUI5_HR_ResignationDetail"),
			oController = oView.getController();
		
		oController._useCustomPernrSelection = "X";
		
		common.TargetUser.displayEmpSearchDialog();
	},
	
	clearCustomPernrSearchOption : function(oController) {
		oController._useCustomPernrSelection = '';
	},
	
	customPernrSelection : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Resignation.ZUI5_HR_ResignationDetail"),
			oController = oView.getController(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"), 
			vIDXs = oTable.getSelectedIndices();
		
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(oController._selectionRowIdx != null && vIDXs.length > 1) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는 한명만 선택이 가능합니다.
				return;
			} else if(vIDXs.length < 1) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}
			
			var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath,
				svPernr = mEmpSearchResult.getProperty(_selPath + "/Pernr"),
				svEname = mEmpSearchResult.getProperty(_selPath + "/Ename");
			
			oController._DetailJSonModel.setProperty("/Data/Mgrid", svPernr);
			oController._DetailJSonModel.setProperty("/Data/Mgrnm", svEname);
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	customPernrClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Resignation.ZUI5_HR_ResignationDetail"),
			oController = oView.getController();
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Resignation.ZUI5_HR_ResignationDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Resignation.ZUI5_HR_ResignationDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	onPressCancel : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Resignation.ZUI5_HR_ResignationDetail"),
			oController = oView.getController();
		
		var onProcess = function() {
			var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV"),
				params = {},
				vErrorMessage = "";
				
			params.Appno = oController._vAppno;
			params.Prcty = "R";
				
			oModel.create("/RetireApplySet", params, {
				success : function(data,res){
				},
				error : function(Res) {
					var errData = common.Common.parseError(Res);
					vErrorMessage = errData.ErrorMessage;
				}
			});
			
			oController.BusyDialog.close();
							
			if(vErrorMessage != ""){
				sap.m.MessageBox.error(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				return;
			} 				
			
			sap.m.MessageBox.show(oBundleText.getText("LABEL_2938"), {	// 2938:신청이 취소되었습니다.
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				actions: [sap.m.MessageBox.Action.CLOSE],
				onClose: oController.onBack
			});
		};
		
		var CancelProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		}; 
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_2939"), {	// 2939:신청 취소 하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CancelProcess
		});
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty) { // 처리 구분
		var vZappStatAl	= "", 
			errData = {},
			vOData = oController.onValidationData(oController, vPrcty);
		
		if(vOData == "") return;
		
		vOData.Actty = _gAuth;
		vOData.Prcty = vPrcty;
		
		var onProcess = function() {
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV");
			
			oModel.create("/RetireApplySet", vOData, {
				success: function(data,res) {
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
			vInfoTxt = oBundleText.getText("LABEL_0386");	// 386:정말로 제출하시겠습니까?
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
		var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV"),
			vData = oController._DetailJSonModel.getProperty("/Data"),
			rData = {};
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		
		if(vPrtcy == 'C') {
			if(!vData.Reret) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0384"));	// 384:사직 신청일이 입력되지 않았습니다.
				return "";
			}
			if(!vData.Reason) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0385"));	// 385:사직사유가 입력되지 않았습니다.
				return "";
			}
			if(!vData.Zzjob) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0382"));	// 382:담당업무가 입력되지 않았습니다.
				return "";
			}
			if(!vData.Mgrid) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0383"));	// 383:면담 인원이 입력되지 않았습니다.
				return "";
			}
		}
		
		try {
			rData = common.Common.copyByMetadata(oModel, "RetireApply", vData);
			rData.Reret = "\/Date("+ common.Common.getTime(rData.Reret)+")\/";
			rData.Entdt = "\/Date("+ common.Common.getTime(rData.Entdt)+")\/";
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty) { // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_Resignation.ZUI5_HR_ResignationDetail"),
			oController = oView.getController(),
			errData = {};
		
		var onProcess = function() {
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV");
			
			oModel.remove("/RetireApplySet(Appno='" + oController._vAppno + "')", {
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
		
		delete detailData.Reret;	// 사직 신청일
		delete detailData.Entdt;	// 입사일자
		delete detailData.Reason;	// 사직사유
		delete detailData.Zzjob;	// 담당업무
		delete detailData.Mgrid;	// 면담 인원 - 사번
		delete detailData.Mgrnm;	// 면담 인원 - 이름
		delete detailData.Mgrwd;	// 면접자 반려사유
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
	},
	
	onAfterSelectPernr : function(oController) {
		// 신청내역 초기화
		oController.onResetDetail(oController);
		
		// 입사일,면담자 정보
		oController.retrieveBasicInfo(oController);
	},
	
	openDocno : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Resignation.ZUI5_HR_ResignationDetail"),
			oController = oView.getController(),
			vUri = oController._DetailJSonModel.getProperty("/Data/Zurl");
		
		if(vUri && vUri != "")  window.open(vUri);
	}
});
