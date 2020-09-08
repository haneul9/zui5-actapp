jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");
jQuery.sap.require("common.SearchUser1");

sap.ui.controller("zui5_hrxx_retireprocess.SettlementItem", {
	PAGEID : "SettlementItem",
	_Bizty : "",
	_vPersa : "",

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_retireprocess.SettlementItem
*/
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		};
		
//		var oPersaModel = sap.ui.getCore().getModel("PersaModel");
//		var vPersaData = oPersaModel.getProperty("/PersAreaListSet");
//
//		var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
//		
//		try {
//			for(var i=0; i<vPersaData.length; i++) {
//				oPersa.addItem(
//					new sap.ui.core.Item({
//						key : vPersaData[i].Persa, 
//						text : vPersaData[i].Pbtxt
//					})
//				);
//			};
//			oPersa.setSelectedKey(vPersaData[0].Persa);
//			this._vPersa = vPersaData[0].Persa;
//		} catch(ex) {
//			common.Common.log(ex);
//		}
		
	    this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),

		});  
	},
	
	onBeforeShow : function(oEvent) {
		this._Bizty = oEvent.data.Bizty;
		
		var oPage = sap.ui.getCore().byId(this.PAGEID + "_PAGETITLE");
		oPage.setText(oBundleText.getText("TITLE_RETIRE_SETTLEMENTITEM" + this._Bizty));
		
//		this.onPressSearch(oEvent);
	}, 
	
//	onChangePersa : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.SettlementItem");
//		var oController = oView.getController();
//		
//		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
//		oController._vPersa = oPersa.getSelectedKey();
//		
//		oController.onPressSearch(oEvent);
//	},
	
//	onPressSearch : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.SettlementItem");
//		var oController = oView.getController();
//		
//		if(oController._vPersa === "") return;
//		
//		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
//		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
//		var oFilters = [];
//		oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa));
//		oTable.bindItems("/RetirementSettlementItemSet", oColumnList, null, oFilters);
//	},
	
//	_AddPersonDialog : null,
//	_oUserControl : null,
//	onEmployeeSearch : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.SettlementItem");
//		var oController = oView.getController();
//		
//		oController._oUserControl = oEvent.getSource();
//		
//		common.SearchUser1.oController = oController;
//		
//		if(!oController._AddPersonDialog) {
//			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
//			oView.addDependent(oController._AddPersonDialog);
//		}
//		oController._AddPersonDialog.open();
//	},
	
//	onESSelectPerson : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.SettlementItem");
//		var oController = oView.getController();
//		
//		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
//		
//		//var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ES_Table");
//		//var mEmpSearchResult = oTable.getModel();
//		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
//		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
//		var vSelectedPersonCount = 0;
//		
//		var vPernr = "";
//		var vAdjst = oController._oUserControl.getCustomData()[0].getValue("Adjst");
//		
//		if(vEmpSearchResult && vEmpSearchResult.length) {
//			for(var i=0; i<vEmpSearchResult.length; i++) {
//				if(vEmpSearchResult[i].Chck == true) {
//					vSelectedPersonCount++;
//				}				
//			}
//			if(vSelectedPersonCount != 1) {
//				sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON_ONLYONE"));
//				return;
//			}
//			
//			for(var i=0; i<vEmpSearchResult.length; i++) {
//				if(vEmpSearchResult[i].Chck == true) {
//					if(oController._oUserControl) {
//						oController._oUserControl.setValue(mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Ename"));
//						vPernr = mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pernr");
//					}
//					break;
//				}				
//			}
//		} else {
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
//			return;
//		}
//		
//		if(vPernr != "" && vAdjst != "") {
//			var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
//			var updateData = {};
//			
//			updateData.Persa = oController._vPersa;
//			updateData.Adjst = vAdjst;
//			updateData.Pernr = vPernr;
//			
//			oModel.update(
//					"/RetirementSettlementItemSet(Persa='" + updateData.Persa + "',Adjst='" + vAdjst + "')", 
//					updateData,
//					null,
//				    function (oData, response) {
//						process_result = true;
//						common.Common.log("Sucess Update !!!");
//				    },
//				    function (oError) {
//				    	var Err = {};
//						if (oError.response) {
//							Err = window.JSON.parse(oError.response.body);
//							common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
//						} else {
//							common.Common.showErrorMessage(oError);
//						}
//				    }
//		    );
//		}
//		
//		common.SearchUser1.onClose();
//	},

//	_SerachOrgDialog : null,
//	displayMultiOrgSearchDialog : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.SettlementItem");
//		var oController = oView.getController();
//		
//		jQuery.sap.require("common.SearchOrg");
//		
//		common.SearchOrg.oController = oController;
//		common.SearchOrg.vActionType = "Multi";
//		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
//		common.SearchOrg.vCallControlType = "MultiInput";
//		
//		if(!oController._SerachOrgDialog) {
//			oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
//			oView.addDependent(oController._SerachOrgDialog);
//		}
//		oController._SerachOrgDialog.open();
//		
//	},

});