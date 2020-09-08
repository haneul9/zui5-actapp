jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");
jQuery.sap.require("common.SearchUser1");

sap.ui.controller("zui5_hrxx_retireprocess.Staff", {
	PAGEID : "Staff",
	_Bizty : "",
	_vPersa : "",
	_vPopupMoed : "",
	_vPopupTitle : "",
	_vPopupPath : "",

//	//Language 및 Properties를 가져온다.
//	oBundleText : jQuery.sap.resources({
//		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//		locale : sap.ui.getCore().getConfiguration().getLanguage()
//	}),

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_retireprocess.Staff
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
		this._Bizty = oEvent.data.Bizty;
		
		var oPage = sap.ui.getCore().byId(this.PAGEID + "_PAGETITLE");
		oPage.setText(oBundleText.getText("TITLE_RETIRE_STAFF" + this._Bizty));
		
		this.onPressSearch(oEvent);
	}, 
	
	onChangePersa : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.Staff");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		oController._vPersa = oPersa.getSelectedKey();
		
		oController.onPressSearch(oEvent);
	},
	
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.Staff");
		var oController = oView.getController();

		if(oController._vPersa === "") return;
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa));
		oFilters.push(new sap.ui.model.Filter("Bizty", sap.ui.model.FilterOperator.EQ, oController._Bizty));
		oTable.bindItems("/RetirementStaffSet", oColumnList, null, oFilters);
	},
	
	_StaffManagerDialog : null,
	onPressAdd : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.Staff");
		var oController = oView.getController();		
		oController._vPopupMoed = "CREATE";
		oController._vPopupPath = "";
		oController._vPopupTitle =  oBundleText.getText("TITLE_RETIRE_STAFF_CREATE") ;
		if(!oController._StaffManagerDialog) {
			oController._StaffManagerDialog = sap.ui.jsfragment("zui5_hrxx_retireprocess.fragment.StaffManagerView", oController);
			oView.addDependent(oController._StaffManagerDialog);
		}
		oController._StaffManagerDialog.open();
		oController.setPopup("");
	},
	
	onPressMod : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.Staff");
		var oController = oView.getController();		
		oController._vPopupMoed = "MODIFY";
		oController._vPopupTitle =  oBundleText.getText("TITLE_RETIRE_STAFF_MODIFY") ;
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		if(vContexts.length == 0){
			sap.m.MessageBox.alert(oBundleText.getText( "MSG_UPDATE_TARGET"));
			return ;
		}else if(vContexts.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText( "MSG_MODIFY_LIMIT"));
			return ;
		}
		
		oController._vPopupPath = vContexts[0].sPath;
		
		if(!oController._StaffManagerDialog) {
			oController._StaffManagerDialog = sap.ui.jsfragment("zui5_hrxx_retireprocess.fragment.StaffManagerView", oController);
			oView.addDependent(oController._StaffManagerDialog);
		}
		oController._StaffManagerDialog.open();
		oController.setPopup(vContexts[0]);
	} ,
	
	
	onPressDel : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.Staff");
		var oController = oView.getController();	
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		
		if(vContexts.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText( "MSG_DELETE_TARGET"));
			return ;
		}

		var process_result = false;
		
		for(var i = 0; i < vContexts.length; i++) {
			console.log(vContexts[i].sPath);
			oModel.remove(
					vContexts[i].sPath, 
					null,
				    function (oData, response) {
						process_result = true;
						common.Common.log("Sucess Delete !!!");
				    },
				    function (oError) {
				    	var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
						} else {
							common.Common.showErrorMessage(oError);
						}
						process_result = false;
				    }
		    );
			
			if(!process_result){
				break;
			}
		}
		if(process_result){
			 sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
					title: oBundleText.getText("MSG_TITLE_GUIDE"),
					onClose : function() {
						oController.onPressSearch();
					}
		 	 });
		}			
	},
	
	onSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.Staff");
		var oController = oView.getController();
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		var process_result = false;
		
		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_ENAME");
		var oStfyn = sap.ui.getCore().byId(oController.PAGEID + "_STFYN");
		var oRcvyn = sap.ui.getCore().byId(oController.PAGEID + "_RCVYN");
		
		var saveData = {};
		saveData.Persa = oController._vPersa;
		saveData.Bizty = oController._Bizty;
		saveData.Pernr = oEname.getCustomData()[0].getValue("Pernr");
		saveData.Stfyn = oStfyn.getSelected() ? "X" : "";
		saveData.Rcvyn = oRcvyn.getSelected() ? "X" : "";

//		try {
//			if(oController._vPopupMoed == "CREATE") {
				oModel.create(
						"/RetirementStaffSet", 
						saveData, 
						null,
					    function (oData, response) {
							process_result = true;
							common.Common.log("Sucess Create !!!");
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
//			} else {
//				oModel.update(
//						oController._vPopupPath, 
//						saveData, 
//						null,
//					    function (oData, response) {
//							process_result = true;
//							common.Common.log("Sucess Update !!!");
//					    },
//					    function (oError) {
//					    	var Err = {};
//							if (oError.response) {
//								Err = window.JSON.parse(oError.response.body);
//								if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
//									common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
//								} else {
//									common.Common.showErrorMessage(Err.error.message.value);
//								}
//							} else {
//								common.Common.showErrorMessage(oError);
//							}
//							process_result = false;
//					    }
//			    );
//			}
//		} catch(ex) {
//			process_result = false;
//			common.Common.log(ex);
//		}
		if(process_result) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
				title: oBundleText.getText("MSG_TITLE_GUIDE"),
				onClose : function() {
					oController.onCancel();
				}
			});
		}
	},
	
	onCancel : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.Staff");
		var oController = oView.getController();	
		if(oController._StaffManagerDialog && oController._StaffManagerDialog.isOpen()) {
			oController._StaffManagerDialog.close();
		}
	},
	
	setPopup : function(oContext) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.Staff");
		var oController = oView.getController();
		
		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_ENAME");
		var oStfyn = sap.ui.getCore().byId(oController.PAGEID + "_STFYN");
		var oRcvyn = sap.ui.getCore().byId(oController.PAGEID + "_RCVYN");
		var vEname = "";
		var vPernr = "";
		var vStfyn = "";
		var vRcvyn = "";
		
		if(oContext != "") {
			vPernr = oContext.getProperty("Pernr");
			vEname = oContext.getProperty("Ename");
			vStfyn = oContext.getProperty("Stfyn");
			vRcvyn = oContext.getProperty("Rcvyn");
		}

		oEname.setValue(vEname);
		oEname.removeAllCustomData();
		oEname.addCustomData(new sap.ui.core.CustomData({key : "Pernr", value : vPernr}));
		if(oController._vPopupMoed == "MODIFY") oEname.setEditable(false);
		else oEname.setEditable(true);
		vStfyn == "X" ? oStfyn.setSelected(true) : oStfyn.setSelected(false);
		vRcvyn == "X" ? oRcvyn.setSelected(true) : oRcvyn.setSelected(false);
	},
	
	_AddPersonDialog : null,
	_oUserControl : null,
	onEmployeeSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.Staff");
		var oController = oView.getController();
		
		oController._oUserControl = oEvent.getSource();
		
		common.SearchUser1.oController = oController;
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		oController._AddPersonDialog.open();
	},
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.Staff");
		var oController = oView.getController();
		
		//var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ES_Table");
		//var mEmpSearchResult = oTable.getModel();
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		var vSelectedPersonCount = 0;
		
		var vPernr = "";
		
		if(vEmpSearchResult && vEmpSearchResult.length) {
			for(var i=0; i<vEmpSearchResult.length; i++) {
				if(vEmpSearchResult[i].Chck == true) {
					vSelectedPersonCount++;
				}				
			}
			if(vSelectedPersonCount != 1) {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON_ONLYONE"));
				return;
			}
			
			for(var i=0; i<vEmpSearchResult.length; i++) {
				if(vEmpSearchResult[i].Chck == true) {
					if(oController._oUserControl) {
						oController._oUserControl.setValue(mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Ename"));
						vPernr = mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pernr");
						oController._oUserControl.removeAllCustomData();
						oController._oUserControl.addCustomData(new sap.ui.core.CustomData({key : "Pernr", value : vPernr}));
					}
					break;
				}				
			}
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
			return;
		}
		
		common.SearchUser1.onClose();
	},

	_SerachOrgDialog : null,
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.Staff");
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
	
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_retireprocess.Staff
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_retireprocess.Staff
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_retireprocess.Staff
*/
//	onExit: function() {
//
//	}

});