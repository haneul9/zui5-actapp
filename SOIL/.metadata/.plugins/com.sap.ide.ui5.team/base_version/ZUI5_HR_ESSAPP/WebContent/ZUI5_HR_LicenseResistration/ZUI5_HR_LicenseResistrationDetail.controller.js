jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail
	 */

	PAGEID : "ZUI5_HR_LicenseResistrationDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_CttypTableJSonModel : new sap.ui.model.json.JSONModel(),
	_CtgrdTableJSonModel : new sap.ui.model.json.JSONModel(),
	_IsautTableJSonModel : new sap.ui.model.json.JSONModel(),
	_RegisTableJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'HR42',
	_vEnamefg : "",
	_Columns : "",
	
	_DialogActionFlag : null ,
	_vPersa : "" ,
	_vAppno : "",
	_vZappStatAl : "",
	
	_oControl : null ,
	BusyDialog : new sap.m.BusyDialog(),
	_vFromPage : "",
	_vgReqAuth : "",
	
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
		oController._vZappStatAl = oDetailData.Data.ZappStatAl;
		oController._DetailJSonModel.setData(oDetailData);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail"),
			oController = oView.getController();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : oController._vFromPage || "ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationList",
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
	
	/**
	 * 자격/면허 Dialog 
	 */
	displayCttypSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail"),
			oController = oView.getController();
		
		if(!oController._CttypDialog) {
			oController._CttypDialog = sap.ui.jsfragment("ZUI5_HR_LicenseResistration.fragment.CttypDialog", oController);
			oView.addDependent(oController._CttypDialog);
		}
		
		oController.onSearchCttyp();
		
		oController._CttypDialog.open();
	},
	
	onSearchCttyp : function() {
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_CttypTable"),
			oModel = sap.ui.getCore().getModel("ZHR_LISENCE_SRV"),
			vSearchString = sap.ui.getCore().byId(oController.PAGEID + "_SearchCttypInput").getValue(),
			aFilters = [],
			vData = {Data : []};
		
		if(vSearchString) {
			aFilters.push(new sap.ui.model.Filter('Value', sap.ui.model.FilterOperator.EQ, vSearchString));
		}
		
		oModel.read("/CttypCodeSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					var i = 1;
					data.results.forEach(function(elem) {
						elem.Idx = i++;
						
						vData.Data.push(elem);
					});
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
		
		oController._CttypTableJSonModel.setData(vData);
		oController._CttypTableJSonModel.refresh();
		oTable.setVisibleRowCount(vData.Data.length > 14 ? 15 : vData.Data.length + 1);
	},
	
	onSelectCttyp : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_CttypTable"),
			oSearchInput = sap.ui.getCore().byId(oController.PAGEID + "_SearchCttypInput"),
			vIDXs = oTable.getSelectedIndices(),
			rowData = null;
			
		if(vIDXs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_3019"));	// 3019:자격/면허를 선택하여 주세요.
			return;
		} else if(vIDXs.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_3020"));	// 3020:자격/면허를 하나만 선택하여 주세요.
			return;
		}
		
		rowData = oController._CttypTableJSonModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath);
		
		oController._DetailJSonModel.setProperty("/Data/Cttyp", rowData.Key);
		oController._DetailJSonModel.setProperty("/Data/Cttypt", rowData.Value);
		
		oSearchInput.setValue("");
		oTable.clearSelection();
		
		oController._CttypDialog.close();
	},

	/**
	 * 등급 Dialog 
	 */
	displayCtgrdSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail"),
			oController = oView.getController();
		
		if(!oController._CtgrdDialog) {
			oController._CtgrdDialog = sap.ui.jsfragment("ZUI5_HR_LicenseResistration.fragment.CtgrdDialog", oController);
			oView.addDependent(oController._CtgrdDialog);
		}
		
		oController.onSearchCtgrd();
		
		oController._CtgrdDialog.open();
	},
	
	onSearchCtgrd : function() {
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_CtgrdTable"),
			oModel = sap.ui.getCore().getModel("ZHR_LISENCE_SRV"),
			vSearchString = sap.ui.getCore().byId(oController.PAGEID + "_SearchCtgrdInput").getValue(),
			aFilters = [],
			vData = {Data : []};
		
		if(vSearchString) {
			aFilters.push(new sap.ui.model.Filter('Value', sap.ui.model.FilterOperator.EQ, vSearchString));
		}
		
		oModel.read("/CtgrdCodeSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					var i = 1;
					data.results.forEach(function(elem) {
						elem.Idx = i++;
						
						vData.Data.push(elem);
					});
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
		
		oController._CtgrdTableJSonModel.setData(vData);
		oController._CtgrdTableJSonModel.refresh();
		oTable.setVisibleRowCount(vData.Data.length > 14 ? 15 : vData.Data.length + 1);
	},
	
	onSelectCtgrd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_CtgrdTable"),
			oSearchInput = sap.ui.getCore().byId(oController.PAGEID + "_SearchCtgrdInput"),
			vIDXs = oTable.getSelectedIndices(),
			rowData = null;
		
		if(vIDXs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_3021"));	// 3021:등급을 선택하여 주세요.
			return;
		} else if(vIDXs.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_3022"));	// 3022:등급을 하나만 선택하여 주세요.
			return;
		}
		
		rowData = oController._CtgrdTableJSonModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath);
		
		oController._DetailJSonModel.setProperty("/Data/Ctgrd", rowData.Key);
		oController._DetailJSonModel.setProperty("/Data/Ctgrdt", rowData.Value);
		
		oSearchInput.setValue("");
		oTable.clearSelection();
		
		oController._CtgrdDialog.close();
	},
	
	/**
	 * 발급기관 Dialog 
	 */
	displayIsautSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail"),
			oController = oView.getController();
		
		if(!oController._IsautDialog) {
			oController._IsautDialog = sap.ui.jsfragment("ZUI5_HR_LicenseResistration.fragment.IsautDialog", oController);
			oView.addDependent(oController._IsautDialog);
		}
		
		oController.onSearchIsaut();
		
		oController._IsautDialog.open();
	},
	
	onSearchIsaut : function() {
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_IsautTable"),
			oModel = sap.ui.getCore().getModel("ZHR_LISENCE_SRV"),
			vSearchString = sap.ui.getCore().byId(oController.PAGEID + "_SearchIsautInput").getValue(),
			aFilters = [],
			vData = {Data : []};
		
		if(vSearchString) {
			aFilters.push(new sap.ui.model.Filter('Value', sap.ui.model.FilterOperator.EQ, vSearchString));
		}
		
		oModel.read("/IsautCodeSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					var i = 1;
					data.results.forEach(function(elem) {
						elem.Idx = i++;
						
						vData.Data.push(elem);
					});
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
		
		oController._IsautTableJSonModel.setData(vData);
		oController._IsautTableJSonModel.refresh();
		oTable.setVisibleRowCount(vData.Data.length > 14 ? 15 : vData.Data.length + 1);
	},
	
	onSelectIsaut : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_IsautTable"),
			oSearchInput = sap.ui.getCore().byId(oController.PAGEID + "_SearchIsautInput"),
			vIDXs = oTable.getSelectedIndices(),
			rowData = null;
		
		if(vIDXs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_3023"));	// 3023:발급기관을 선택하여 주세요.
			return;
		} else if(vIDXs.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_3024"));	// 3024:발급기관을 하나만 선택하여 주세요.
			return;
		}
		
		rowData = oController._IsautTableJSonModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath);
		
		oController._DetailJSonModel.setProperty("/Data/Isaut", rowData.Key);
		oController._DetailJSonModel.setProperty("/Data/Isautt", rowData.Value);
		
		oSearchInput.setValue("");
		oTable.clearSelection();
		
		oController._IsautDialog.close();
	},
	
	/**
	 * 등록처 Dialog 
	 */
	displayRegisSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail"),
			oController = oView.getController();
		
		if(!oController._RegisDialog) {
			oController._RegisDialog = sap.ui.jsfragment("ZUI5_HR_LicenseResistration.fragment.RegisDialog", oController);
			oView.addDependent(oController._RegisDialog);
		}
		
		oController.onSearchRegis();
		
		oController._RegisDialog.open();
	},
	
	onSearchRegis : function() {
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_RegisTable"),
			oModel = sap.ui.getCore().getModel("ZHR_LISENCE_SRV"),
			vSearchString = sap.ui.getCore().byId(oController.PAGEID + "_SearchRegisInput").getValue(),
			aFilters = [],
			vData = {Data : []};
		
		if(vSearchString) {
			aFilters.push(new sap.ui.model.Filter('Value', sap.ui.model.FilterOperator.EQ, vSearchString));
		}
		
		oModel.read("/RegisCodeSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					var i = 1;
					data.results.forEach(function(elem) {
						elem.Idx = i++;
						
						vData.Data.push(elem);
					});
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
		
		oController._RegisTableJSonModel.setData(vData);
		oController._RegisTableJSonModel.refresh();
		oTable.setVisibleRowCount(vData.Data.length > 14 ? 15 : vData.Data.length + 1);
	},
	
	onSelectRegis : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_RegisTable"),
			oSearchInput = sap.ui.getCore().byId(oController.PAGEID + "_SearchRegisInput"),
			vIDXs = oTable.getSelectedIndices(),
			rowData = null;
		
		if(vIDXs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_3025"));	// 3025:등록처를 선택하여 주세요.
			return;
		} else if(vIDXs.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_3026"));	// 3026:등록처를 하나만 선택하여 주세요.
			return;
		}
		
		rowData = oController._RegisTableJSonModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath);
		
		oController._DetailJSonModel.setProperty("/Data/Regis", rowData.Key);
		oController._DetailJSonModel.setProperty("/Data/Regist", rowData.Value);
		
		oSearchInput.setValue("");
		oTable.clearSelection();
		
		oController._RegisDialog.close();
	},
	
	SmartSizing : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail"),
//			oController = oView.getController();
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_LISENCE_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/LisenceApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					oDetailData.Data = data.results[0];
					
					oDetailData.Data.Begda = (oDetailData.Data.Begda) ? dateFormat.format(oDetailData.Data.Begda) : undefined;
				}
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
		
		// 첨부파일 
		common.AttachFileAction.oController = oController;
		common.AttachFileAction.setAttachFile(oController);
		common.AttachFileAction.refreshAttachFileList(oController);	
	},
	
	setPageHeader : function(oController, vZappStatAl) {
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		
		if(vZappStatAl == "") {
			oDetailTitle.setText(oBundleText.getText("LABEL_3013") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 3013:자격/면허등록 신청
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_3013") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 3013:자격/면허등록 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_3013") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 3013:자격/면허등록 신청
		}
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty) { // 처리 구분
		var vZappStatAl	= "", 
			errData = {};
		
		if(!oController.onValidationData(oController, vPrcty)) return;
		
		var onProcess = function() {
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_LISENCE_SRV"),
				oneData = oController._DetailJSonModel.getProperty("/Data"),
				createData = {};
			
			createData = common.Common.copyByMetadata(oModel, "LisenceAppl", oneData);
			createData.Prcty = vPrcty;
			createData.Actty = _gAuth;
			createData.Begda = (createData.Begda) ? "\/Date("+ common.Common.getTime(createData.Begda)+")\/" : undefined;
			
			oModel.create("/LisenceApplSet", createData, {
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
		var oModel = sap.ui.getCore().getModel("ZHR_LISENCE_SRV"),
			vData = oController._DetailJSonModel.getProperty("/Data");
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Cttyp) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_3027"));	// 3027:자격면허가 입력되지 않았습니다.
			return "";
		}
		
		if(vPrcty == "C") {
			var oFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
			if(oFileList.getItems().length < 1){ // 첨부파일 필수
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1174"));	// 1174:첨부파일은 필수 입니다.
				return "";
			}
		}
		
		return true;
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty) { // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_LicenseResistration.ZUI5_HR_LicenseResistrationDetail"),
			oController = oView.getController(),
			errData = {};
		
		var onProcess = function() {
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_LISENCE_SRV");
			
			oModel.remove("/LisenceApplSet(Appno='" + vDetailData.Appno + "')", {
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
		
		delete detailData.Cttyp;
		delete detailData.Cttypt;
		delete detailData.Ctgrd;
		delete detailData.Ctgrdt;
		delete detailData.Isaut;
		delete detailData.Isautt;
		delete detailData.Ctnum;
		delete detailData.Regis;
		delete detailData.Regist;
		delete detailData.Begda;
		delete detailData.Bigo;
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
	},
	
	onAfterSelectPernr : function(oController) {
		// 신청내역 초기화
		oController.onResetDetail(oController);
	}
});
