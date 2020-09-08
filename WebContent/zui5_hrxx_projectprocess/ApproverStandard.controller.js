jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");
jQuery.sap.require("common.SearchUser1");

sap.ui.controller("zui5_hrxx_projectprocess.ApproverStandard", {
	PAGEID : "ApproverStandard",
	_vPersa : "",

//	//Language 및 Properties를 가져온다.
//	oBundleText : jQuery.sap.resources({
//		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//		locale : sap.ui.getCore().getConfiguration().getLanguage()
//	}),
	_RegistDialog : null,
	BusyDialog : null,
	_SerachOrgDialog : null,
	_EmpSearchDialog : null,
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_projectprocess.ApproverStandard
*/
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		};
		
		var oPersaModel = sap.ui.getCore().getModel("PersaModel");
		var vPersaData = oPersaModel.getProperty("/PersAreaListSet");

		var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
		
		try {
			for(var i=0; i<vPersaData.length; i++) {
				oPersa.addItem(
					new sap.ui.core.Item({
						key : vPersaData[i].Persa, 
						text : vPersaData[i].Pbtxt
					})
				);
			};
			oPersa.setSelectedKey(vPersaData[0].Persa);
			this._vPersa = vPersaData[0].Persa;
		} catch(ex) {
			common.Common.log(ex);
		}
		
	    this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),

		});  
	},
	
	onBeforeShow : function(oEvent) {

		this.onPressSearch();
		
	}, 
	
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStandard");
		var oController = oView.getController();
		
		var oFilters = [];
		
		oFilters.push(new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, oController._vPersa));
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
		
		oTable.bindItems("/AppCriteriaSet", oColumnList, null, oFilters);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_projectprocess.ApproverStandard
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_projectprocess.ApproverStandard
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_projectprocess.ApproverStandard
*/
//	onExit: function() {
//
//	}
	
	onPressCreate : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStandard");
		var oController = oView.getController();
		
		if(!oController._RegistDialog) {                  
			oController._RegistDialog = sap.ui.jsfragment("zui5_hrxx_projectprocess.fragment.Regist10Dialog", oController);
			oView.addDependent(oController._RegistDialog);
		}
		
		oController._RegistDialog.open();
		oController.onSet10Dialog(oController);
	},
	
	onSet10Dialog : function(oController){
		var oBgoid = sap.ui.getCore().byId(oController.PAGEID + "_10_Bgoid");
		var oAprnr = sap.ui.getCore().byId(oController.PAGEID + "_10_Aprnr");
		oBgoid.setValue("");
		oBgoid.removeAllCustomData();
		oAprnr.setValue("");
		oAprnr.removeAllCustomData();
	},
	
	onEmployeeSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStandard");
		var oController = oView.getController();
		                                 
		common.SearchUser1.oController = oController;
		
		if(!oController._EmpSearchDialog) {
			oController._EmpSearchDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
			oView.addDependent(oController._EmpSearchDialog);
		}
		
		oController._EmpSearchDialog.open();
	},
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStandard");
		var oController = oView.getController();
		var vEmpSearchCnt = 0;
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		var vTempPernr = null , vTempPersa = null  , vTempeEname = null ; 
		
		for(var i=0; i<vEmpSearchResult.length; i++) {
			if(vEmpSearchResult[i].Chck == true) {
				vEmpSearchCnt++;
				vTempPernr =  vEmpSearchResult[i].Pernr;
				vTempPersa =  vEmpSearchResult[i].Persa;
				vTempeEname = vEmpSearchResult[i].Ename;
			}				
		}
		
		if(vEmpSearchCnt > 1){
			common.Common.showErrorMessage(oBundleText.getText("MSG_UPDATE_LIMIT"));
			return ;
		}else if(vEmpSearchCnt < 1){
			return ;
		}

		oController._vPernr = vTempPernr ;
		oController._vPersa = vTempPersa ;
		
		var oAprnr = sap.ui.getCore().byId(oController.PAGEID + "_10_Aprnr");
		
		oAprnr.removeAllCustomData();
		oAprnr.setValue(vTempeEname);
		oAprnr.addCustomData(new sap.ui.core.CustomData({key : "Aprnr", value : vTempPernr}));
		
	    common.SearchUser1.onClose();
	},
	
	displayOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStandard");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Single";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "Input";
		
		if(!oController._SerachOrgDialog) {
			oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SerachOrgDialog);
		}
		oController._SerachOrgDialog.open();
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStandard");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Multi";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "MultiInput";
		
		if(!oController._SerachOrgDialog) {
			oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SerachOrgDialog);
		}
		oController._SerachOrgDialog.open();
		
	},
	
	onPressDelete : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStandard");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		
		if(!vContexts || vContexts.length < 1) {
			common.Common.showErrorMessage(oBundleText.getText("MSG_DELETE_TARGET"));
			return;
		}
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_MANAGEMENT_SRV");
		
		var DeleteProcess = function() {
			var process_result = false;
			for(var i=0; i<vContexts.length; i++) {
				try {
					var oPath = "/AppCriteriaSet(Werks='" + vContexts[i].getProperty("Werks") + "',"
					          + "Bgoid='" + vContexts[i].getProperty("Bgoid") + "',"
					          + "Aprnr='" + vContexts[i].getProperty("Aprnr") + "')";
					
					oModel.remove(
							oPath, 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess AppCriteriaSet Remove !!!");
						    },
						    function (oError) {
						    	var Err = {};
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										common.Common.showErrorMessage(Err.error.message.value);
									}
								} else {
									common.Common.showErrorMessage(oError);
								}
								process_result = false;
						    }
				    );
					
					if(!process_result) break;
				} catch(ex) {
					process_result = false;
					common.Common.log(ex);
					break;
				}
			}
				
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			if(!process_result) return;
			
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
				title: oBundleText.getText("INFORMATION"),
				onClose : function() {
					oController.onPressSearch();
				}
			});
		};
		
		var onProcessing = function(oAction) {
			if ( oAction === sap.m.MessageBox.Action.YES ) {
				if(!oController.BusyDialog) {			
					oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
					oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
					oController.getView().addDependent(oController.BusyDialog);
				} else {
					oController.BusyDialog.removeAllContent();
					oController.BusyDialog.destroyContent();
					oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
				}
				if(!oController.BusyDialog.isOpen()) {
					oController.BusyDialog.open();
				}
				
				setTimeout(DeleteProcess, 300);
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("MSG_DELETE_CONFIRM"), {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("DEL_BTN"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: onProcessing
		});
	},
	
	onPressSave : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStandard");
		var oController = oView.getController();
		var oBgoid = sap.ui.getCore().byId(oController.PAGEID + "_10_Bgoid");
		var oAprnr = sap.ui.getCore().byId(oController.PAGEID + "_10_Aprnr");
		var oWerks = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		
		if(oBgoid.getValue() == "" ){
			common.Common.showErrorMessage(oBundleText.getText("MSG_INPUT_BG"));
			return ;
		}
		
		if(oAprnr.getValue() == "" ){
			common.Common.showErrorMessage(oBundleText.getText("MSG_INPUT_APRNR2"));
			return ;
		}
		
		var createData = {};
		
		createData.Bgoid = oBgoid.getCustomData()[0].getValue("Bgoid");
		createData.Aprnr = oAprnr.getCustomData()[0].getValue("Aprnr");
		createData.Werks = oWerks.getSelectedKey();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_MANAGEMENT_SRV");
		
		var saveProcess = function() {
			var process_result = false;
			
			var oPath = "/AppCriteriaSet";
			try{
				oModel.create(
						oPath,  
						createData, 
						null,
					    function (oData, response) {
							process_result = true;
							common.Common.log("Sucess AppCriteriaSet Create !!!");
					    },
					    function (oError) {
					    	var Err = {};
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
									common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
								} else {
									common.Common.showErrorMessage(Err.error.message.value);
								}
							} else {
								common.Common.showErrorMessage(oError);
							}
							process_result = false;
					    }
			    );
			}catch(ex){
				
			}
			
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			if(!process_result) {
				return;
			}
			
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
				title: oBundleText.getText("INFORMATION"),
				onClose : function() {
					oController.onPressClose();
					oController.onPressSearch();
				}
			});
		};
		
		if(!oController.BusyDialog) {			
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		setTimeout(saveProcess, 300);
		
	},
	
	onPressClose : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStandard");
		var oController = oView.getController();
		
		if(oController._RegistDialog.open()){
			oController._RegistDialog.close();
		}
	},

});