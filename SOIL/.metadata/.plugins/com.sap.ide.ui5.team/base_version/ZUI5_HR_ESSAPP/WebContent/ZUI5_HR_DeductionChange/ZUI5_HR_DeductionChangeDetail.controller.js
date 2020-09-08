jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.ZipSearch");

sap.ui.controller("ZUI5_HR_DeductionChange.ZUI5_HR_DeductionChangeDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_DeductionChange.ZUI5_HR_DeductionChangeDetail
	 */

	PAGEID : "ZUI5_HR_DeductionChangeDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailSaveJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_DedcdTableJSonModel : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'HR41',
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
			oDetailData = {Data : {}},
			oDetailTableData = {Data : []}
			vPersa = "",
			vEmail = "",
			vDedgb = "",
			vNewyn = "";
		
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
		oDetailData.Data.ZappStatAl = oDetailData.Data.ZappStatAl || '';
		oController._DetailJSonModel.setData(oDetailData);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 공제예정월
		oController.retrieveDedReqym(oController);
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChange.ZUI5_HR_DeductionChangeDetail"),
			oController = oView.getController();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : oController._vFromPage || "ZUI5_HR_DeductionChange.ZUI5_HR_DeductionChangeList",
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
	
	retrieveDedReqym : function(oController) {
		if(oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_CHG_SRV"),
			vReqym = "",
			vPersa = oController._TargetJSonModel.getProperty("/Data/Persa");
		
		oModel.read("/DedReqymSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Werks', sap.ui.model.FilterOperator.EQ, vPersa)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					vReqym = data.results[0].Reqym;
					vReqym = (!vReqym || vReqym == "000000") ? "" : vReqym.replace(/(\d{4})(\d{2})/g, '$1.$2')
					
					oController._DetailJSonModel.setProperty("/Data/Reqym", vReqym);
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == "E") {
					sap.m.MessageBox.alert(errData.ErrorMessage, {});
					return;
				}
			}
		});
	},
	
	DedtxSearchInput : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChange.ZUI5_HR_DeductionChangeDetail"),
			oController = oView.getController(),
			vDedtx = oEvent.getSource().getValue();
		
		if(!oController._DedcdDialog) {
			oController._DedcdDialog = sap.ui.jsfragment("ZUI5_HR_DeductionChange.fragment.DedcdDialog", oController);
			oView.addDependent(oController._DedcdDialog);
		}
		
		sap.ui.getCore().byId(oController.PAGEID + "_SearchInput").setValue(vDedtx);
		
		oController.onSearchDedcd();
		
		oController._DedcdDialog.open();
	},
	
	displayDedgbDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChange.ZUI5_HR_DeductionChangeDetail"),
			oController = oView.getController();
		
		if(!oController._DedcdDialog) {
			oController._DedcdDialog = sap.ui.jsfragment("ZUI5_HR_DeductionChange.fragment.DedcdDialog", oController);
			oView.addDependent(oController._DedcdDialog);
		}
		
		oController.onSearchDedcd();
		
		oController._DedcdDialog.open();
	},
	
	onSelectDedcd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChange.ZUI5_HR_DeductionChangeDetail"),
			oController = oView.getController();
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DedcdTable"),
			oSearchInput = sap.ui.getCore().byId(oController.PAGEID + "_SearchInput"),
			vIDXs = oTable.getSelectedIndices(),
			dedcdTableData = null;
			
		if(vIDXs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0458"));	// 458:공제를 선택하여 주세요.
			return;
		} else if(vIDXs.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0459"));	// 459:공제를 하나만 선택하여 주세요.
			return;
		}
		
		dedcdTableData = oController._DedcdTableJSonModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath)
		
		oController._DetailJSonModel.setProperty("/Data/Dedcd", dedcdTableData.Dedcd);
		oController._DetailJSonModel.setProperty("/Data/Dedtx", dedcdTableData.Dedtx);
//		oController._DetailJSonModel.setProperty("/Data/Dpernr", dedcdTableData.Pernr);
		oController._DetailJSonModel.setProperty("/Data/Dpernr", dedcdTableData.Perid);
		oController._DetailJSonModel.setProperty("/Data/Dename", dedcdTableData.Ename);
		oController._DetailJSonModel.setProperty("/Data/Dorgtx", dedcdTableData.Orgtx);
		
		oSearchInput.setValue("");
		oTable.clearSelection();
		
		oController._DedcdDialog.close();
	},

	onSearchDedcd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChange.ZUI5_HR_DeductionChangeDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DedcdTable"),
			oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_CHG_SRV"),
			vDedtx = sap.ui.getCore().byId(oController.PAGEID + "_SearchInput").getValue(),
			aFilters = [],
			vData = {Data : []};
		
		if(vDedtx) {
			aFilters.push(new sap.ui.model.Filter('Dedtx', sap.ui.model.FilterOperator.EQ, vDedtx));
		}
		
		oModel.read("/DedcdListSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					var i = 1;
					data.results.forEach(function(elem) {
						elem.Idx = i++;
						
						vData.Data.push(elem);
					});
					
					oController._DedcdTableJSonModel.setData(vData);
					oTable.setVisibleRowCount(vData.Data.length);
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == "E") {
					sap.m.MessageBox.alert(errData.ErrorMessage, {});
					return;
				}
			}
		});
	},
	
	SmartSizing : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChange.ZUI5_HR_DeductionChangeDetail"),
//			oController = oView.getController();
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_CHG_SRV"),
			errData = {};
		
		oModel.read("/DeductChgApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				oDetailData.Data = data.results[0];
				
				oDetailData.Data.Reqym = (!oDetailData.Data.Reqym || oDetailData.Data.Reqym == "000000") ? "" : oDetailData.Data.Reqym.replace(/(\d{4})(\d{2})/g, '$1.$2');
				oDetailData.Data.Betrg = common.Common.numberWithCommas(oDetailData.Data.Betrg);
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
			oDetailTitle.setText(oBundleText.getText("LABEL_0512") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 512:변동공제 신청
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0512") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 512:변동공제 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0512") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 512:변동공제 신청
		}
	},
	
	onPressSaveT : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChange.ZUI5_HR_DeductionChangeDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	onPreSaveOpenDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChange.ZUI5_HR_DeductionChangeDetail"),
			oController = oView.getController(),
			vDetailData = oController._DetailJSonModel.getData().Data,
			checkData = {Data : {}},
			vOData = oController.onValidationData(oController, "C");
		
		if(vOData == "") return;
		
		checkData.Data.Ename = oController._TargetJSonModel.getProperty("/Data/Ename");
		checkData.Data.Dedtx = vDetailData.Dedtx;
		checkData.Data.Reqym = vDetailData.Reqym;
		checkData.Data.Dename = vDetailData.Dename;
		checkData.Data.Dpernr = vDetailData.Dpernr;
		checkData.Data.Dorgtx = vDetailData.Dorgtx;
		checkData.Data.Betrg = vDetailData.Betrg;
		checkData.Data.Inmsg = vDetailData.Inmsg;
		
		oController._DetailSaveJSonModel.setData(checkData);
		
		if(!oController._PreSaveDialog) {
			oController._PreSaveDialog = sap.ui.jsfragment("ZUI5_HR_DeductionChange.fragment.PreSaveDialog", oController);
			oView.addDependent(oController._PreSaveDialog);
		}
		
		oController._PreSaveDialog.open();
	},
	
	onPressSaveC : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChange.ZUI5_HR_DeductionChangeDetail"),
			oController = oView.getController();
		
		oController._PreSaveDialog.close();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty) { // 처리 구분
		var vZappStatAl	= "", 
			errData = {},
			vOData = oController.onValidationData(oController, vPrcty);
		
		if(vOData == "") return;
		
		vOData.Actty = _gAuth;
		vOData.Prcty = vPrcty;
		console.log(vOData);
		
		var onProcess = function() {
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_CHG_SRV");
			
			oModel.create("/DeductChgApplSet", vOData, {
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
	
	onValidationData : function(oController, vPrcty) {
		var oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_CHG_SRV"),
			rData = {},
			vData = oController._DetailJSonModel.getProperty("/Data");
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Dedcd) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0513"));	// 513:변동공제명이 입력되지 않았습니다.
			return "";
		}
		
		if(vPrcty == "C") {
			if(!vData.Betrg) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0255"));	// 255:신청금액이 입력되지 않았습니다.
				return "";
			}
		}
		
		try {
			rData = common.Common.copyByMetadata(oModel, "DeductChgAppl", vData);
			
			rData.Reqym = (rData.Reqym) ? rData.Reqym.replace(/[^\d]/g, '') : undefined;
			rData.Betrg = (rData.Betrg) ? rData.Betrg.replace(/[^\d]/g, '') : undefined;
			rData.Waers = rData.Waers || "KRW";
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty) { // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChange.ZUI5_HR_DeductionChangeDetail"),
			oController = oView.getController(),
			errData = {};
		
		var onProcess = function() {
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_CHG_SRV");
			
			oModel.remove("/DeductChgApplSet(Appno='" + vDetailData.Appno + "')", {
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
	onResetDetail : function(oController, changeComboKey) {
		var detailData = oController._DetailJSonModel.getProperty("/Data");
		
		delete detailData.Dedcd;	// 변동공제코드
		delete detailData.Dedtx;	// 변동공제명
		delete detailData.Dpernr;	// 공제발생자 사번
		delete detailData.Dename;	// 공제발생자 이름
		delete detailData.Dorgtx;	// 공제발생자 소속
		delete detailData.Betrg;	// 신청금액
		delete detailData.Inmsg;	// 경조메세지
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
	},
	
	onAfterSelectPernr : function(oController) {
		// 신청내역 초기화
		oController.onResetDetail(oController, "");
		
		// 공제예정월
		oController.retrieveDedReqym(oController);
	},
	
	openDocno : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChange.ZUI5_HR_DeductionChangeDetail"),
			oController = oView.getController(),
			vUri = oController._DetailJSonModel.getProperty("/Data/Zurl");
		
		if(vUri && vUri != "")  window.open(vUri);
	}
});
