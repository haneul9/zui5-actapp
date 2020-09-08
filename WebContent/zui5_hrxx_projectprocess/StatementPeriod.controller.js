jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

sap.ui.controller("zui5_hrxx_projectprocess.StatementPeriod", {
	PAGEID : "StatementPeriod",
	_Bizty : "",
	_vPersa : "",
	_vdateFormat : sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
	_vPjtyp : "1020" , // 승인이력 등록 대상자
//	//Language 및 Properties를 가져온다.
//	oBundleText : jQuery.sap.resources({
//		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//		locale : sap.ui.getCore().getConfiguration().getLanguage()
//	}),
	
	_RegistDialog : null,

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_projectprocess.StatementPeriod
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
		var vFields = [{Fieldname : "Frqut"}];
		common.Common.loadCodeData(this._vPersa, this._vdateFormat.format(new Date()) , vFields);
		this.onPressSearch();
		
	}, 
	
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.StatementPeriod");
		var oController = oView.getController();
		var vPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa").getSelectedKey();
		var vPjtbd = sap.ui.getCore().byId(oController.PAGEID + "_Pjtbd").getValue();
		var vPjted = sap.ui.getCore().byId(oController.PAGEID + "_Pjted").getValue();
		var oFilters = [];
		
		if(vPjtbd == null || vPjtbd == ""){
			common.Common.showErrorMessage(oBundleText.getText("MSG_INPUT_PJTBD"));
			return;
		}
		
		if(vPjted == null || vPjted == ""){
			common.Common.showErrorMessage(oBundleText.getText("MSG_INPUT_PJTED"));
			return;
		}
		
		oFilters.push(new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, vPersa));
		oFilters.push(new sap.ui.model.Filter("Pjtyp", sap.ui.model.FilterOperator.EQ, oController._vPjtyp));
		oFilters.push(new sap.ui.model.Filter("Pjtbd", sap.ui.model.FilterOperator.EQ, vPjtbd));
		oFilters.push(new sap.ui.model.Filter("Pjted", sap.ui.model.FilterOperator.EQ, vPjted));
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
		
		oTable.bindItems("/AppCycleSet", oColumnList, null, oFilters);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_projectprocess.StatementPeriod
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_projectprocess.StatementPeriod
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_projectprocess.StatementPeriod
*/
//	onExit: function() {
//
//	}
	
	onPressCreate : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.StatementPeriod");
		var oController = oView.getController();
		
		if(!oController._RegistDialog) {
			oController._RegistDialog = sap.ui.jsfragment("zui5_hrxx_projectprocess.fragment.Regist30Dialog", oController);
			oView.addDependent(oController._RegistDialog);
			
			var oFrqut = sap.ui.getCore().byId(oController.PAGEID + "_30_Frqut"); 
			oFrqut.removeAllItems();
			var mEmpCodeList = sap.ui.getCore().getModel("EmpCodeList");
			var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
			for(var i = 0; i< vEmpCodeList.length ; i++){
				if(vEmpCodeList[i].Field == "Frqut"){
					oFrqut.addItem(
							new sap.ui.core.Item({
								key : vEmpCodeList[i].Ecode, 
								text : vEmpCodeList[i].Etext
							})
						);
				}
			}
		}
		oController._RegistDialog.open();
		oController.onSet30Dialog();
	},
	
	onPressDelete : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.StatementPeriod");
		var oController = oView.getController();
		
		var vPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa").getSelectedKey();
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
					var oPath = "/AppCycleSet";
					oPath += "(Werks='" +vPersa +"'," +
					 		 "Pjtyp='" +oController._vPjtyp + "'," +
							 "Pjted=datetime%27" + oController._vdateFormat.format(new Date(common.Common.setTime(new Date(vContexts[i].getProperty("Pjted"))))) + "T00%3a00%3a00%27)"; 
					
					oModel.remove(
							oPath, 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess RetirementStatementPeriodSet Remove !!!");
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
		
		sap.m.MessageBox.show(oBundleText.getText("MSG_DELETE_QUESTION"), {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("INFORMATION"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: onProcessing
		});
		
	},
	
	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.StatementPeriod");
		var oController = oView.getController();
		var vFrqut = sap.ui.getCore().byId(oController.PAGEID + "_30_Frqut").getSelectedKey();
		var vFrquy = sap.ui.getCore().byId(oController.PAGEID + "_30_Frquy").getValue();
		var vBegda = sap.ui.getCore().byId(oController.PAGEID + "_30_Begda").getValue();
		var vEndda = sap.ui.getCore().byId(oController.PAGEID + "_30_Endda").getValue();
		var vPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa").getSelectedKey();
		if(vFrqut == "" || vFrqut == "0000"){
			common.Common.showErrorMessage(oBundleText.getText("MSG_FRQUT_LIMIT"));
			return ; 
		}
		if(vFrquy == ""){
			common.Common.showErrorMessage(oBundleText.getText("MSG_FRQUY_LIMIT"));
			return ; 
		}
		if(vBegda == ""){
			common.Common.showErrorMessage(oBundleText.getText("MSG_BEGDA_INPUT"));
			return ; 
		}
		if(vEndda == ""){
			common.Common.showErrorMessage(oBundleText.getText("MSG_ENDDA_INPUT"));
			return ; 
		}
		
		var updateData = {};
		updateData.Frqut = vFrqut;
		updateData.Frquy = vFrquy;
		updateData.Pjtbd = "\/Date(" + common.Common.getTime(vBegda) + ")\/";  
		updateData.Pjted = "\/Date(" + common.Common.getTime(vEndda) + ")\/";  
		updateData.Werks = vPersa;
		updateData.Pjtyp = oController._vPjtyp;
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_MANAGEMENT_SRV");
		
		var saveProcess = function() {
			var process_result = false;
			
			var oPath = "/AppCycleSet";
			    oPath += "(Werks='" +vPersa +"'," +
	 		 "Pjtyp='" +oController._vPjtyp + "'," +
			 "Pjted=datetime%27" + oController._vdateFormat.format(new Date(common.Common.setTime(new Date(vBegda)))) + "T00%3a00%3a00%27)"; 
			oModel.update(
					oPath, 
					updateData, 
					null,
				    function (oData, response) {
						process_result = true;
						common.Common.log("Sucess AppCycleSet update !!!");
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
			
			
			if(!process_result) {
				if(oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}
				return;
			}
			
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
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
	
	onSet30Dialog : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.StatementPeriod");
		var oController = oView.getController();
		
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_30_Begda"); 
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_30_Endda"); 
		var oFrquy = sap.ui.getCore().byId(oController.PAGEID + "_30_Frquy"); 
		var oFrqut = sap.ui.getCore().byId(oController.PAGEID + "_30_Frqut"); 
		oBegda.setValue("");
		oEndda.setValue("");
		oFrquy.setValue("");
		oFrqut.setSelectedItem(oFrqut.getFirstItem());
	},
	
	onPressClose : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.StatementPeriod");
		var oController = oView.getController();
		
		if(oController._RegistDialog.open()){
			oController._RegistDialog.close();
		}
	},
	
	onChangePersa : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.StatementPeriod");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		oController._vPersa = oPersa.getSelectedKey();
		
		oController.onPressSearch(oEvent);
	},
	
	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_DATE"),{
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	}

});