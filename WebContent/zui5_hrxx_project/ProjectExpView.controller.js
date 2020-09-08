jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

sap.ui.controller("zui5_hrxx_project.ProjectExpView", {

	PAGEID : "ProjectExpView",
	ListSelectionType : "None",
	
	_vWerks : "",
	_vPersa : "",
	_vPjtbd : "",
	_vMode : "",
	
	_vThousandSeparator : ",",
	_vDecimalSeparator : ".",
	
	_oContext : null,
	BusyDialog : null,
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf epmproductapp.CreateView
*/
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			this.getView().addStyleClass("sapUiSizeCompact");
	    };
	    
	    this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this)
		});  
	    
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf epmproductapp.CreateView
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf epmproductapp.CreateView
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf epmproductapp.CreateView
*/
//	onExit: function() {
//
//	}
	onBeforeShow: function(oEvent) {	
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		if(oEvent) {
			this._vMode = oEvent.data.mode;
			this._oContext = oEvent.data.context;
			if(this._oContext != null) {
				this._vWerks = this._oContext.getProperty("Werks");
				this._vPjtbd = dateFormat.format(new Date(common.Common.setTime(new Date(this._oContext.getProperty("Pjtbd")))));
			}
		}

		this.setConfig(this);
		this.setProjectData(this);
		this.setExpData(this);
	},
	
	navToBack : function(oEvent){
		sap.ui.getCore().getEventBus().publish("nav", "back", {});
	},
	
	setConfig : function(oController) {
		var oPjtnm = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtnm");
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_POP_Begda");
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_POP_Endda");
		var oEndda_Check = sap.ui.getCore().byId(oController.PAGEID + "_POP_Endda_Check");
		var oPjtat = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtat");
		var oPjtr1 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr1");
		var oPjtr2 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr2");
		var oPjtr3 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr3");
		var oPjtr4 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr4");
		var oPjtrp = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtrp");
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_POP_SAVE");
		var oPernr = sap.ui.getCore().byId(oController.PAGEID + "_BTN_Pernr");
				
		var vEnabled = false;
		var vEnabled1 = false;
		
		if(oController._vMode == "V") vEnabled = false;
		else vEnabled = true;
		
		if(vEnabled && oController._vMode == "M") vEnabled1 = false;
		else vEnabled1 = vEnabled;
		
		oPjtnm.setEnabled(vEnabled1);
		oBegda.setEnabled(vEnabled);
		oEndda.setEnabled(vEnabled);
		oEndda_Check.setEnabled(vEnabled);
		oPjtat.setEnabled(vEnabled);
		oPjtr1.setEnabled(vEnabled);
		oPjtr2.setEnabled(vEnabled);
		oPjtr3.setEnabled(vEnabled);
		oPjtr4.setEnabled(vEnabled);
		oPjtrp.setEnabled(vEnabled);
		oSaveBtn.setVisible(vEnabled);
		oPernr.setVisible(vEnabled1);
	},
	
	setProjectData : function(oController) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		var oPjtnm = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtnm");
		var oPjtid = sap.ui.getCore().byId(oController.PAGEID + "_Pjtid");
		var oPjtbd = sap.ui.getCore().byId(oController.PAGEID + "_Pjtbd");
		var oPjted = sap.ui.getCore().byId(oController.PAGEID + "_Pjted");
		var oPjtcy = sap.ui.getCore().byId(oController.PAGEID + "_Pjtcy");
		var oPjtty = sap.ui.getCore().byId(oController.PAGEID + "_Pjtty");
		var oPjtcu = sap.ui.getCore().byId(oController.PAGEID + "_Pjtcu");
		var oPjtds = sap.ui.getCore().byId(oController.PAGEID + "_Pjtds");
		var oPjtsz = sap.ui.getCore().byId(oController.PAGEID + "_Pjtsz");
		var oPjtun = sap.ui.getCore().byId(oController.PAGEID + "_Pjtun");
		var oPjtam = sap.ui.getCore().byId(oController.PAGEID + "_Pjtam");
		var oPjtck = sap.ui.getCore().byId(oController.PAGEID + "_Pjtck");
		var oPjtct = sap.ui.getCore().byId(oController.PAGEID + "_Pjtct");
		var oPjtpd = sap.ui.getCore().byId(oController.PAGEID + "_Pjtpd");  

		oPjtnm.setValue("");
		oPjtnm.removeAllCustomData();
		oPjtnm.addCustomData(new sap.ui.core.CustomData({key : "Pjtid", value : ""}));
		oPjtnm.addCustomData(new sap.ui.core.CustomData({key : "Werks", value : ""}));
		oPjtid.setText("");
		oPjtbd.setText("");
		oPjted.setText("");
		oPjtcy.setText("");
		oPjtty.setText("");
		oPjtcu.setText("");
		oPjtds.setText("");
		oPjtsz.setText("");  
		oPjtun.setText("");
		oPjtam.setText(""); 
		oPjtck.setText("");
		oPjtct.setText("");
		oPjtpd.setText("");
		
		var oPjtma = sap.ui.getCore().byId(oController.PAGEID + "_Pjtma"); 
		var oPjtmc = sap.ui.getCore().byId(oController.PAGEID + "_Pjtmc"); 
		var oRow05 = sap.ui.getCore().byId(oController.PAGEID + "_ROW_05"); 
		var oRow06 = sap.ui.getCore().byId(oController.PAGEID + "_ROW_06");
		var oRow07 = sap.ui.getCore().byId(oController.PAGEID + "_ROW_07");
		var oRow08 = sap.ui.getCore().byId(oController.PAGEID + "_ROW_08");
		oPjtma.setText("");
		oPjtmc.setText("");
	
		oRow05.addStyleClass("L2PDisplayNone");
		oRow06.addStyleClass("L2PDisplayNone");
		oRow07.addStyleClass("L2PDisplayNone");
		oRow08.addStyleClass("L2PDisplayNone");
		
		if(oController._oContext == null) return;
		
		oController._vWerks = oController._oContext.getProperty("Werks");
		
		oPjtnm.setValue(oController._oContext.getProperty("Pjtnm"));
		oPjtnm.removeAllCustomData();
		oPjtnm.addCustomData(new sap.ui.core.CustomData({key : "Pjtid", value : oController._oContext.getProperty("Pjtid")}));
		oPjtnm.addCustomData(new sap.ui.core.CustomData({key : "Werks", value : oController._oContext.getProperty("Werks")}));
		oPjtid.setText(oController._oContext.getProperty("Pjtid"));
		oPjtbd.setText(oController._oContext.getProperty("Pjtbd") == null ? "" : dateFormat.format(new Date(common.Common.setTime(new Date(oController._oContext.getProperty("Pjtbd"))))));
		oPjted.setText(oController._oContext.getProperty("Pjted") == null ? "" : dateFormat.format(new Date(common.Common.setTime(new Date(oController._oContext.getProperty("Pjted"))))));
		oPjtcy.setText(oController._oContext.getProperty("Landx"));
		oPjtty.setText(oController._oContext.getProperty("Pjttytx"));
		oPjtcu.setText(oController._oContext.getProperty("Pjtcutx"));
		oPjtds.setText(oController._oContext.getProperty("Pjtds"));
		oPjtsz.setText(oController._oContext.getProperty("Pjtszu")); 
		oPjtun.setText(oController._oContext.getProperty("Pjtun"));
		oPjtam.setText(oController._oContext.getProperty("Pjtamc"));
		oPjtck.setText(oController._oContext.getProperty("Pjtck"));
		oPjtpd.setText(oController._oContext.getProperty("Pjtpdtx"));
		oPjtct.setText(oController._oContext.getProperty("Pjtcttx"));
		
		oPjtma.setText(oController._oContext.getProperty("Pjtmatx"));
		oPjtmc.setText(oController._oContext.getProperty("Pjtmc"));
		
		oController.onChangeValue();
		
		var oViewPjtr1 = sap.ui.getCore().byId(oController.PAGEID + "_VIEW_Pjtr1");
		var oViewPjtr2 = sap.ui.getCore().byId(oController.PAGEID + "_VIEW_Pjtr2"); 
		var oViewPjtr3 = sap.ui.getCore().byId(oController.PAGEID + "_VIEW_Pjtr3"); 
		
		oViewPjtr1.addStyleClass("L2PDisplayNone");
		oViewPjtr2.addStyleClass("L2PDisplayNone");
		oViewPjtr3.addStyleClass("L2PDisplayNone");
		
		switch(oController._oContext.getProperty("Pjtty")) {
			case "0001" :   // 수주
				oRow05.removeStyleClass("L2PDisplayNone");
				oRow06.removeStyleClass("L2PDisplayNone");
				oRow07.removeStyleClass("L2PDisplayNone");
				break;
			case "0002" :   // R&D
				oRow06.removeStyleClass("L2PDisplayNone");
				break;
			case "0003" :   // M&A
				oRow08.removeStyleClass("L2PDisplayNone");
				
				oViewPjtr1.removeStyleClass("L2PDisplayNone");
				oViewPjtr2.removeStyleClass("L2PDisplayNone");
				oViewPjtr3.removeStyleClass("L2PDisplayNone");
		}
		
//		var oAppBtn = sap.ui.getCore().byId(oController.PAGEID + "_AppBtn");
//		var oRejBtn = sap.ui.getCore().byId(oController.PAGEID + "_RejBtn");
//		if(oController._oContext.getProperty("Aprst") == "2") {
//			oAppBtn.setVisible(true);
//			oRejBtn.setVisible(true);
//		} else {
//			oAppBtn.setVisible(false);
//			oRejBtn.setVisible(false);
//		}
		
		var oASTAT = sap.ui.getCore().byId(oController.PAGEID + "_ASTAT");
		var oAprsttx = sap.ui.getCore().byId(oController.PAGEID + "_Aprsttx");
		var oAprrj = sap.ui.getCore().byId(oController.PAGEID + "_Aprrj");
		if(oController._oContext.getProperty("Aprst") == "4") {
			oASTAT.setVisible(true);
			oAprsttx.setText(oController._oContext.getProperty("Aprsttx"));
			oAprrj.setText(oController._oContext.getProperty("Aprrj"));
		} else {
			oASTAT.setVisible(false);
			oAprsttx.setText("");
			oAprrj.setText("");
		}
		
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_POP_Endda");
		var oEndda_Check = sap.ui.getCore().byId(oController.PAGEID + "_POP_Endda_Check");
		
		oEndda.removeStyleClass("L2PDisplayNone");
		oEndda.setValue(null);
		oEndda_Check.setSelected(false);
	},
	
//	onApproval : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
//		var oController = oView.getController();		
//		
//		var oContext = oController._oContext;
//				
//		var onProcessApp = function(fVal) {
//			if(fVal && fVal == "OK") {
//				var mProjectList = sap.ui.getCore().getModel("ProjectList");
//				var oneData = {};
//				
//				var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV");
//				var process_result = false;
//				
//				oneData = mProjectList.getProperty(oContext.sPath);
//				oneData.Aprst = "3";
//				
//				oModel.update(
//			    	"/ProjectExpRegisterSet(Regno='" + oneData.Regno + "')", 
//					oneData, 
//					null,
//				    function (oData, response) {
//						process_result = true;
//				    },
//				    function (oError) {
//				    	var Err = {};					    	 
//						if (oError.response) {
//							Err = window.JSON.parse(oError.response.body);
//							if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
//								common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
//							} else {
//								common.Common.showErrorMessage(Err.error.message.value);
//							}
//							
//						} else {
//							common.Common.showErrorMessage(oError);
//						}
//						process_result = false;
//				    }
//				);
//				
//				
//				if(process_result) {
//					sap.m.MessageBox.alert(oBundleText.getText("MSG_APPROVAL_FINISHED"), {
//						title: oBundleText.getText("MSG_TITLE_GUIDE"),
//						onClose : function() {
//							oController.navToBack();
//						}
//					});
//				}
//			}
//		};
//		
//		sap.m.MessageBox.confirm(oBundleText.getText("MSG_APPROVAL_QUESTION"), {
//			title : oBundleText.getText("CONFIRM_BTN"),
//			onClose : onProcessApp
//		});
//	},
//	
//	onReject : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
//		var oController = oView.getController();		
//		
//		oController.displayAprrjDialog(oEvent);
//	},
//	
//	_AprrjDialog : null,
//	displayAprrjDialog : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
//		var oController = oView.getController();
//		
//		if(!oController._AprrjDialog) {
//			oController._AprrjDialog = sap.ui.jsfragment("zui5_hrxx_project.fragment.RejectAprrj", oController);
//			oView.addDependent(oController._AprrjDialog);
//		}
//		oController._AprrjDialog.open();
//	},
//	
//	onBeforeOpenSearchDialog : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
//		var oController = oView.getController();
//		
//		var oAprrj = sap.ui.getCore().byId(oController.PAGEID + "_Aprrj");
//		oAprrj.setValue("");
//	},
//	
//	onPressRejectConfirm : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
//		var oController = oView.getController();
//		
//		var oContext = oController._oContext;
//		
//		var oAprrj = sap.ui.getCore().byId(oController.PAGEID + "_Aprrj");
//		var vAprrj = oAprrj.getValue();
//		
//		if(vAprrj == "") {
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_REJECT_COMMENT"));
//			return;
//		}
//		
//		var mProjectList = sap.ui.getCore().getModel("ProjectList");
//		var oneData = mProjectList.getProperty(oContext.sPath);
//		oneData.Aprst = "4";
//		oneData.Aprrj = vAprrj;
//		
//		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV");
//		var process_result = false;
//		
//		oModel.update(
//	    	"/ProjectExpRegisterSet(Regno='" + oneData.Regno + "')", 
//			oneData, 
//			null,
//		    function (oData, response) {
//				process_result = true;
//		    },
//		    function (oError) {
//		    	var Err = {};					    	 
//				if (oError.response) {
//					Err = window.JSON.parse(oError.response.body);
//					if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
//						common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
//					} else {
//						common.Common.showErrorMessage(Err.error.message.value);
//					}
//					
//				} else {
//					common.Common.showErrorMessage(oError);
//				}
//				process_result = false;
//		    }
//		);
//		
//		if(process_result) {
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_REJECT_FINISHED"), {
//				title: oBundleText.getText("MSG_TITLE_GUIDE"),
//				onClose : function() {
//					oController.navToBack();
//				}
//			});
//		}
//		
//		oController.onClose();
//	},
//	
//	onClose : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
//		var oController = oView.getController();
//		
//		if(oController._AprrjDialog.isOpen()) {
//			oController._AprrjDialog.close();
//		}
//	},
	
	setExpData : function(oController) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		//var oPjtnm = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtnm");
		var oPernrtx3 = sap.ui.getCore().byId(oController.PAGEID + "_Pernrtx3");
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_POP_Begda");
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_POP_Endda");
		var oEndda_Check = sap.ui.getCore().byId(oController.PAGEID + "_POP_Endda_Check");
		var oPjtat = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtat");
		var oPjtr1 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr1");
		var oPjtr2 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr2");
		var oPjtr3 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr3");
		var oPjtr4 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr4");
		var oPjtrp = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtrp");
//		var oAprnrtx = sap.ui.getCore().byId(oController.PAGEID + "_POP_Aprnrtx");
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_POP_SAVE");
//		var vAprnrtx = "";
		
		if(oController._oContext == null) {
			oPernrtx3.setText("");
			oBegda.setValue(null);
			oEndda.setValue(null);
			oEndda_Check.setSelected(false);
			oPjtat.setSelectedKey("");
			oPjtr1.setSelectedKey("");
			oPjtr2.setSelectedKey("");
			oPjtr3.setSelectedKey("");
			oPjtr4.setSelectedKey("");
			oPjtrp.setValue("");
			
			oSaveBtn.removeAllCustomData();
			oSaveBtn.addCustomData(new sap.ui.core.CustomData({key : "Mode", value : "C"}));
			oSaveBtn.addCustomData(new sap.ui.core.CustomData({key : "Regno", value : ""}));
			
//			var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV");
//			oModel.read("/ProjectApproverSet",
//						null, 
//						null, 
//						true,
//						function(oData, oResponse) {
//							if(oData && oData.results) {
//								for(var i=0; i<oData.results.length; i++) {
//									oAprnrtx.setText(oData.results[i].Aprnrtx + " / " + oData.results[i].Aprnrotx);
//									oAprnrtx.removeAllCustomData();
//									oAprnrtx.addCustomData(new sap.ui.core.CustomData({key : "Aprnr", value : oData.results[i].Aprnr}));
//									oController._vPersa = oData.results[i].Werks;
//									break;
//								}
//							}
//						},
//						function(oResponse) {
//							common.Common.log(oResponse);
//							if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
//								oController.BusyDialog.close();
//							};
//						}
//			);
			
			
			
		} else {
			oPernrtx3.setText(oController._oContext.getProperty("Pernrtx"));
			oPernrtx3.removeAllCustomData();
			oPernrtx3.addCustomData(new sap.ui.core.CustomData({key : "Pernr", value : oController._oContext.getProperty("Pernr")}));
			oBegda.setValue(oController._oContext.getProperty("Begda") == null ? null : dateFormat.format(new Date(common.Common.setTime(new Date(oController._oContext.getProperty("Begda"))))));
			oEndda.setValue(oController._oContext.getProperty("Endda") == null ? null : dateFormat.format(new Date(common.Common.setTime(new Date(oController._oContext.getProperty("Endda"))))));
			if(oEndda.getValue() == "9999-12-31") {
				oEndda_Check.setSelected(true);
				oEndda.addStyleClass("L2PDisplayNone");
			} else {
				oEndda_Check.setSelected(false);
				oEndda.removeStyleClass("L2PDisplayNone");
			}
//			oPjtat.setSelectedKey(oController._oContext.getProperty("Pjtat"));
//			oPjtr1.setSelectedKey(oController._oContext.getProperty("Pjtr1"));
//			oPjtr2.setSelectedKey(oController._oContext.getProperty("Pjtr2"));
//			oPjtr3.setSelectedKey(oController._oContext.getProperty("Pjtr3"));
//			oPjtr4.setSelectedKey(oController._oContext.getProperty("Pjtr4"));
			oPjtrp.setValue(oController._oContext.getProperty("Pjtrp"));
			
			oSaveBtn.removeAllCustomData();
			oSaveBtn.addCustomData(new sap.ui.core.CustomData({key : "Mode", value : "M"}));
			oSaveBtn.addCustomData(new sap.ui.core.CustomData({key : "Regno", value : oController._oContext.getProperty("Regno")}));
			
			oController.setDDLBPjtat(oController._oContext.getProperty("Pjtat"));
			oController.setDDLBPjtrl(oController._oContext.getProperty("Pjtr1"),
									 oController._oContext.getProperty("Pjtr2"),
									 oController._oContext.getProperty("Pjtr3"),
									 oController._oContext.getProperty("Pjtr4"));
			
			oController._vPersa = oController._oContext.getProperty("Werks");
		}
	},

/////////////////////////////////////////////////////////////////////////////////////////////
// 투입형태 DDLB (Pjtat)
/////////////////////////////////////////////////////////////////////////////////////////////
	setDDLBPjtat : function(vSelectedKey) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
		var oController = oView.getController();
		
		var oPjtat = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtat");
//		var oPjtnm = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtnm");
		var vWerks = oController._vWerks;
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_POP_Begda");
		var vBegda = oBegda.getValue() == "" || oBegda.getValue() == null ? "" : oBegda.getValue();
		
		oPjtat.removeAllItems();
		if(vWerks != "" && vBegda != "") {
			oPjtat.addItem(
				new sap.ui.core.Item({
					key : "", 
					text : oBundleText.getText("SELECTDATA")
				})
			);
				
			var oCommonModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
			var oPath = "/EmpCodeListSet/?$filter=Field eq 'Pjtat' and Persa eq '" + vWerks + "' and Actda eq datetime'" + vBegda + "T00:00:00'";
			
			oCommonModel.read(
						oPath,
						null, 
						null, 
						false,
						function(oData, oResponse) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									oPjtat.addItem(
										new sap.ui.core.Item({
											key : oData.results[i].Ecode, 
											text : oData.results[i].Etext
										})
									);
								}
								if(vSelectedKey != "") oPjtat.setSelectedKey(vSelectedKey);
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
			);
		}
	},	
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 역할 DDLB (Pjtr1, Pjtr2, Pjtr3, Pjtr4)
/////////////////////////////////////////////////////////////////////////////////////////////
	setDDLBPjtrl : function(vSelectedKey1, vSelectedKey2, vSelectedKey3, vSelectedKey4) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
		var oController = oView.getController();
		
		var oPjtr1 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr1");
		var oPjtr2 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr2");
		var oPjtr3 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr3");
		var oPjtr4 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr4");
//		var oPjtnm = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtnm");
		oPjtr1.removeAllItems();
		oPjtr2.removeAllItems();
		oPjtr3.removeAllItems();
		oPjtr4.removeAllItems();
		var vWerks = oController._vWerks;
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_POP_Begda");
		var vBegda = oBegda.getValue() == "" || oBegda.getValue() == null ? "" : oBegda.getValue();
		
		if(vWerks != "" && vBegda != "") {
			var oCommonModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
			var oPath = "/EmpCodeListSet/?$filter=Field eq 'Pjtrl' and Persa eq '" + vWerks + "' and Actda eq datetime'" + vBegda + "T00:00:00'";
			var oDDLBData = [];
			oCommonModel.read(
						oPath,
						null, 
						null, 
						false,
						function(oData, oResponse) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									oDDLBData.push(oData.results[i]);
								}
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
			);
			
			if(oDDLBData.length > 0) {
				var oControl = null;
				var vSKey = "";
				for(var i=1; i<5; i++) {
					eval("oControl = oPjtr" + i);
					eval("vSKey = vSelectedKey" + i);
					
//					oControl.removeAllItems();
					oControl.addItem(
						new sap.ui.core.Item({
							key : "", 
							text : oBundleText.getText("SELECTDATA")
						})
					);
					
					for(var j=0; j<oDDLBData.length; j++) {
						oControl.addItem(
							new sap.ui.core.Item({
								key : oDDLBData[j].Ecode, 
								text : oDDLBData[j].Etext
							})
						);
					}
					
					if(vSKey != "") oControl.setSelectedKey(vSKey);
				}
			}
		}
	},	
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 프로젝트 검색
/////////////////////////////////////////////////////////////////////////////////////////////
	_SearchProjectDialog : null, 
	onSearchProject : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
		var oController = oView.getController();
		
		if(!oController._SearchProjectDialog) {
			oController._SearchProjectDialog = sap.ui.jsfragment("zui5_hrxx_project.fragment.SearchProjectDialog", oController);
			oView.addDependent(oController._SearchProjectDialog);
		}
		oController._SearchProjectDialog.open();
		//oController.onPressProjectSearch();
	},
	
	onCloseSearchProject : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
		var oController = oView.getController();
		
		if(oController._SearchProjectDialog.isOpen()) {
			oController._SearchProjectDialog.close();
		}
	},
	
	onPressProjectSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
		var oController = oView.getController();
		
		var oPjtbd_Fr = sap.ui.getCore().byId(oController.PAGEID + "_PS_Pjtbd_From");
		var oPjtbd_To = sap.ui.getCore().byId(oController.PAGEID + "_PS_Pjtbd_To");
		var oPjtnmst = sap.ui.getCore().byId(oController.PAGEID + "_PS_Pjtnmst");
		var oPjtid = sap.ui.getCore().byId(oController.PAGEID + "_PS_Pjtid");
		var oPjtty = sap.ui.getCore().byId(oController.PAGEID + "_PS_Pjtty");
		
		if(oPjtbd_Fr.getValue() == "") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_PJTBD"));
			return;
		}
		
		if(oPjtbd_To.getValue() == "") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_PJTED"));
			return;
		}
		
		if(new Date(oPjtbd_Fr.getValue()) > new Date(oPjtbd_To.getValue())) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_PJTDATE"));
			return;
		}
		
		if(!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		} 
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		var mProjectList = sap.ui.getCore().getModel("ProjectSearchList");
		var vProjectList = {ProjectSearchListSet : []};
		
		var readAfterProcess = function() {
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_PS_TABLE");
			var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_PS_COLUMNLIST");
			oTable.setModel(mProjectList);
			oTable.bindItems("/ProjectSearchListSet", oColumnList);

			var oBinding = oTable.getBinding("items");
			oBinding.filter([]);

		    if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			};
		};

		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV");
		var filterStr = "Pjtbd%20eq%20datetime%27" + oPjtbd_Fr.getValue() + "T00%3a00%3a00%27%20and%20Pjted%20eq%20datetime%27" + oPjtbd_To.getValue() + "T00%3a00%3a00%27";
		if(oPjtnmst.getValue().trim() != "") filterStr += " and Pjtnm eq '" + encodeURI(oPjtnmst.getValue().trim()) + "'";
		if(oPjtid.getValue().trim() != "") filterStr += " and Pjtid eq '" + encodeURI(oPjtid.getValue().trim()) + "'";
		if(oPjtty.getSelectedKey() != "") filterStr += " and Pjtty eq '" + oPjtty.getSelectedKey() + "'";
		
		oModel.read("/ProjectSearchResultSet/?$filter=" + filterStr,
					null, 
					null, 
					true,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vProjectList.ProjectSearchListSet.push(oData.results[i]);
							}
							mProjectList.setData(vProjectList);
							readAfterProcess();
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
						if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
							oController.BusyDialog.close();
						};
					}
		);
	},
	
	onProjectSelect : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_PS_TABLE");
		var oContext = oTable.getSelectedContexts();
		
		if(oContext.length == 0) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_PROJECT_TARGET"));
			return;
		};
		
		oController._oContext = oContext[0];
		oController.setProjectData(oController);
		
		oController.onCloseSearchProject();
	},
	
	onChangeValue : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
		var oController = oView.getController();

		if(typeof oEvent == "object") {
			if(!oController.onChangeDate(oEvent)) return;
		}
		
		oController.setDDLBPjtat("");
		oController.setDDLBPjtrl("","","","");
	},
/////////////////////////////////////////////////////////////////////////////////////////////
	
	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
		var oController = oView.getController();
		
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_POP_SAVE");
		var vMode = oSaveBtn.getCustomData()[0].getValue("Mode");
		var vRegno = oSaveBtn.getCustomData()[1].getValue("Regno");
		
		var oneData = {};
		var oPjtnm = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtnm");
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_POP_Begda");
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_POP_Endda");
		var oPjtat = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtat");
		var oPjtr1 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr1");
		var oPjtr2 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr2");
		var oPjtr3 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr3");
		var oPjtr4 = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtr4");
		var oPjtrp = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtrp");
		var oPernrtx3 = sap.ui.getCore().byId(oController.PAGEID + "_Pernrtx3");
//		var oAprnrtx = sap.ui.getCore().byId(oController.PAGEID + "_POP_Aprnrtx");
		
		oPjtnm.setValueState(sap.ui.core.ValueState.None);
		oBegda.setValueState(sap.ui.core.ValueState.None);
		oEndda.setValueState(sap.ui.core.ValueState.None);
		oPjtat.removeStyleClass("L2PSelectInvalidBorder");
		oPjtr1.removeStyleClass("L2PSelectInvalidBorder");
		oPjtrp.setValueState(sap.ui.core.ValueState.None);
		
		oneData.Actty = "H";
		
		// Project ID / 인사영역
		oneData.Pjtid = oPjtnm.getCustomData()[0].getValue("Pjtid");
		oneData.Werks = oPjtnm.getCustomData()[1].getValue("Werks");
		if(oneData.Pjtid == "" || oneData.Werks == "") {
			oPjtnm.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_PROJECT_TARGET"));
			return;
		}
		
		// 수행시작일
		oneData.Begda = oBegda.getValue() == "" || oBegda.getValue() == "0NaN-NaN-NaN" ? null : "\/Date(" + new Date(oBegda.getValue()).getTime() + ")\/";
		if(oneData.Begda == null) {
			oBegda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_EXPBD_INPUT"));
			return;
		}
		
		// 수행 종료일
		oneData.Endda = oEndda.getValue() == "" || oEndda.getValue() == "0NaN-NaN-NaN" ? null : "\/Date(" + new Date(oEndda.getValue()).getTime() + ")\/";
		if(oneData.Endda == null) {
			oEndda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_EXPED_INPUT"));
			return;
		}
		
		if(new Date(oBegda.getValue()) > new Date(oEndda.getValue())) {
			oBegda.setValueState(sap.ui.core.ValueState.Error);
			oEndda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_PJTEDATE"));
			return;
		}
		
		oneData.Pjtat = oPjtat.getSelectedKey();
		if(oneData.Pjtat == "") {
			oPjtat.addStyleClass("L2PSelectInvalidBorder");
			sap.m.MessageBox.alert(oBundleText.getText("MSG_PJTAT_INPUT"));
			return;
		}
		
		oneData.Pjtr1 = oPjtr1.getSelectedKey();
		if(oneData.Pjtr1 == "") {
			oPjtr1.addStyleClass("L2PSelectInvalidBorder");
			sap.m.MessageBox.alert(oBundleText.getText("MSG_PJTRL_INPUT"));
			return;
		}
		oneData.Pjtr2 = oPjtr2.getSelectedKey();
		oneData.Pjtr3 = oPjtr3.getSelectedKey();
		oneData.Pjtr4 = oPjtr4.getSelectedKey();
		
		oneData.Pjtrp = oPjtrp.getValue();
		if(oneData.Pjtrp == "") {
			oPjtrp.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_PJTRP_INPUT"));
			return;
		}
		
		oneData.Pernr =  oPernrtx3.getCustomData()[0].getValue("Pernr");
		if(oneData.Pernr == "") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_NO_TARGET"));
			return;
		}
		
//		oneData.Aprnr = oAprnrtx.getCustomData()[0].getValue("Aprnr");
//		if(oneData.Aprnr == "") {
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_APRNR"));
//			return;
//		}
		
		var process_result = false;
		var oPath = "/ProjectExpRegisterSet";
		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV");

		if(vMode == "C") {
			oModel.create(
					oPath, 
					oneData, 
					null,
				    function (oData, response) {
						if(oData) {
							
						}
						process_result = true;
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
		} else {
			oneData.Regno = vRegno;
			oneData.Aprty = "U";
			
			oPath += "(Regno='" + oneData.Regno + "')";
			
		    oModel.update(
				oPath, 
				oneData, 
				null,
			    function (oData, response) {
					process_result = true;
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
		}
		if(process_result) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
				title: oBundleText.getText("MSG_TITLE_GUIDE"),
				onClose : function() {
					oController.navToBack();
				}
			});
		}
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 등록 담당자 검색을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////
	_vEmployeeSearchID : "",
	_EmpSearchDialog : null,
	
	onEmployeeSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
		var oController = oView.getController();

		common.SearchUser2.oController = oController;
		
		if(!oController._EmpSearchDialog) {
			oController._EmpSearchDialog = sap.ui.jsfragment("fragment.EmployeeSearch2", oController);
			oView.addDependent(oController._EmpSearchDialog);
		}
		oController._EmpSearchDialog.open();
	},
	
	// 조직검색 POPUP 창을 연다
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
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
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
		var oController = oView.getController();
		
		//var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ES_Table");
		//var mEmpSearchResult = oTable.getModel();
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var vEmpSearchCnt = 0;
		var vPernr = "";
		var vEname = "";
		var vZzcaltltx = "";
		var vStetx = "";
		for(var i=0; i<vEmpSearchResult.length; i++) {
			if(vEmpSearchResult[i].Chck == true) {
				vEmpSearchCnt++;
				vPernr =  vEmpSearchResult[i].Pernr;
				vEname =  vEmpSearchResult[i].Ename;
				vZzcaltltx = vEmpSearchResult[i].Zzcaltltx;
				vStetx = vEmpSearchResult[i].Stetx;
			}				
		}

		if(vEmpSearchCnt > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON_ONLYONE"));
			return;
		} else if(vEmpSearchCnt < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
			return;
		}
		
		var oPernrtx3 = sap.ui.getCore().byId(oController.PAGEID + "_Pernrtx3");
		oPernrtx3.setText(vEname + " " + vZzcaltltx + " / " + vStetx);
		oPernrtx3.removeAllCustomData();
		oPernrtx3.addCustomData(new sap.ui.core.CustomData({key : "Pernr", value : vPernr}));
		
		common.SearchUser2.onClose();
	},
/////////////////////////////////////////////////////////////////////////////////////////////
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 유형 DDLB (Pjtty)
/////////////////////////////////////////////////////////////////////////////////////////////
	setDDLBPjtty : function(vSelectedKey) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
		var oController = oView.getController();
		
		var oDDLBModel = sap.ui.getCore().getModel("EmpCodeList2");
		var oDDLBData = oDDLBModel.getProperty("/PJTTY");
		
		var oPjtty = sap.ui.getCore().byId(oController.PAGEID + "_PS_Pjtty");
		
		oPjtty.removeAllItems();
		oPjtty.addItem(
			new sap.ui.core.Item({
				key : "", 
				text : ""
			})
		);

		for(var i=0; i<oDDLBData.length; i++) {
			oPjtty.addItem(
				new sap.ui.core.Item({
					key : oDDLBData[i].Ecode, 
					text : oDDLBData[i].Etext
				})
			);
		}
		if(vSelectedKey != "") oPjtty.setSelectedKey(vSelectedKey);
		
//		var oPjtty = sap.ui.getCore().byId(oController.PAGEID + "_PS_Pjtty");
//		
//		oPjtty.removeAllItems();
//		oPjtty.addItem(
//			new sap.ui.core.Item({
//				key : "", 
//				text : ""
//			})
//		);
//
//		var oCommonModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
//		var oPath = "/EmpCodeListSet/?$filter=Field eq 'Pjtty' and PersaNc eq 'X'";
//			
//		oCommonModel.read(
//					oPath,
//					null, 
//					null, 
//					false,
//					function(oData, oResponse) {
//						if(oData && oData.results) {
//							for(var i=0; i<oData.results.length; i++) {
//								oPjtty.addItem(
//									new sap.ui.core.Item({
//										key : oData.results[i].Ecode, 
//										text : oData.results[i].Etext
//									})
//								);
//							}
//							if(vSelectedKey != "") oPjtty.setSelectedKey(vSelectedKey);
//						}
//					},
//					function(oResponse) {
//						common.Common.log(oResponse);
//					}
//			);
	},
	
	onChangeEnddaCheck : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectExpView");
		var oController = oView.getController();
		
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_POP_Endda");

		if(oEvent.getSource().getSelected()) {
			oEndda.setValue("9999-12-31");
			oEndda.addStyleClass("L2PDisplayNone");
		} else {
			oEndda.setValue("");
			oEndda.removeStyleClass("L2PDisplayNone");
		}
	},
	
	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_DATE"),{
				onClose : function() {
					oControl.setValue("");
				}
			});
			return false;
		}
		return true;
	}
});