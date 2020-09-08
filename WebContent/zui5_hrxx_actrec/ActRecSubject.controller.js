jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

sap.ui.controller("zui5_hrxx_actrec.ActRecSubject", {

	PAGEID : "ActRecSubject",
	ListSelectionType : "None",
	
	_vStatu : "",
	_vReqno : "",
	
	_vDocty : "",
	_vPersa : "",
	_vActda : "",
	
	_oContext : null,
	_vRecst : "",
	_vDocno : "",
	_vRecno : "",
	_vMolga : "",
	_vRecYy : "",
	_vRecTypeCd : "", 
	
	_vSelected_Reqno : "",
	_vSelected_Pernr : "",
	_vSelected_Actda : "",
	_vSelected_Docno : "",
	
	_DetailViewPopover : null,
	_PreviewDialog : null,
	_DataTransferDialog : null,
	
	_TableCellHeight : 34,
	_OtherHeight : 380,
	_vRecordCount : 0,
	
	BusyDialog : null,
	
//	oBundleText : jQuery.sap.resources({
//		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//		locale : sap.ui.getCore().getConfiguration().getLanguage()
//	}),
	
	
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
	    
//	    sap.ui.getCore().getEventBus().subscribe("app", "ResizeWindow", this.onResizeWindow, this);
//	    
//	    var vTableHeight = window.innerHeight - this._OtherHeight;
//		this._vRecordCount = parseInt(vTableHeight / this._TableCellHeight);
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
		this._OrgehCode = [];
		
		if(oEvent) {
			this._oContext = oEvent.data.context;
			this._vRecst = this._oContext.getProperty("Recst");
			this._vRecno = this._oContext.getProperty("Recno");
			this._vDocno = this._oContext.getProperty("Docno");
			this._vPersa = this._oContext.getProperty("Persa");
			this._vRecYy = this._oContext.getProperty("RecYy");
			this._vRecTypeCd = this._oContext.getProperty("RecTypeCd");
			this._vRecNm = this._oContext.getProperty("RecNm");
			
			this._vMolga = oEvent.data.Molga;
		
			var oRecNm = sap.ui.getCore().byId(this.PAGEID + "_Header_RecNm");
			var oPbtxt = sap.ui.getCore().byId(this.PAGEID + "_Header_Pbtxt");
			var oRecYyRecTypeCd = sap.ui.getCore().byId(this.PAGEID + "_Header_RecYyRecTypeCd");
			var oRecnt = sap.ui.getCore().byId(this.PAGEID + "_Header_Recnt");
			var oMacnt = sap.ui.getCore().byId(this.PAGEID + "_Header_Macnt");
			var oFacnt = sap.ui.getCore().byId(this.PAGEID + "_Header_Facnt");
			var oReent = sap.ui.getCore().byId(this.PAGEID + "_Header_Reent");
			var oRecsttx = sap.ui.getCore().byId(this.PAGEID + "_Header_Recsttx");
			var oCreateBTN = sap.ui.getCore().byId(this.PAGEID + "_CREATE_BTN");
			
			oRecNm.setText(this._oContext.getProperty("RecNm"));
			oPbtxt.setText(this._oContext.getProperty("Pbtxt"));
			oRecYyRecTypeCd.setText(this._oContext.getProperty("RecYy") + ", " + this._oContext.getProperty("RecTypeCd"));
			oRecnt.setText(this._oContext.getProperty("Recnt"));
			oMacnt.setValue(parseInt(this._oContext.getProperty("Macnt")));
			oFacnt.setValue(parseInt(this._oContext.getProperty("Facnt")));
			oReent.setText(this._oContext.getProperty("Reent"));
			oRecsttx.setText(this._oContext.getProperty("Recsttx"));
			
			if(this._vRecst == "A") {
				oCreateBTN.setVisible(true);
			} else {
				oCreateBTN.setVisible(false);
			}
		}
		
		this.reloadList(this);
	},
	
	reloadList : function(oController) {
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
		
		var oFilters = [];	
	    oFilters.push(new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno));
	    oFilters.push(new sap.ui.model.Filter("Recno", sap.ui.model.FilterOperator.EQ, oController._vRecno));
	    
		oTable.bindItems("/RecruitingSubjectsSet", oColumnList, null, oFilters);
	},
	
	navToBack : function(oEvent){
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecSubject");
//		var oController = oView.getController();
		
//		if(oController._vRecst == "A") {
			sap.ui.getCore().getEventBus().publish("nav", "back", {});
//		} else {
//			sap.ui.getCore().getEventBus().publish("nav", "to", {
//			      id : "zui5_hrxx_actapp.ActRecDocument",
//			      data : {
//			    	  context : oController._oContext,
//			    	  Statu : oController._vStatu,
//			    	  Reqno : oController._vReqno,
//			    	  Docno : oController._vDocno,
//			    	  Docty : oController._vDocty,
//			      }
//			});
//		}
	},
	
	onSelectRow : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecSubject");
		var oController = oView.getController();
		
		var oContext = oEvent.getSource().getBindingContext();
		var vPdata = {
				Sub01 : oContext.getProperty("Cnt01"),
				Sub02 : oContext.getProperty("Cnt02"),
				Sub03 : oContext.getProperty("Cnt03"),
				Sub04 : oContext.getProperty("Cnt04"),
				Sub05 : oContext.getProperty("Cnt05"),
				Sub06 : oContext.getProperty("Cnt06"),
				Sub07 : oContext.getProperty("Cnt07")
		};
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp.ActRecPInfo",
		      data : {
		    	 actiontype : "V",
			  	 Docno : oController._vDocno,
			  	 Recno : oController._vRecno,
			   	 VoltId : oContext.getProperty("VoltId"),
			   	 Persa : oController._vPersa,
			   	 Reqno : oContext.getProperty("Reqno"),
			   	 Actda : oContext.getProperty("Actda"),
			   	 context : oController._oContext,
			   	 FromPageId : "zui5_hrxx_actrec.ActRecSubject",
		    	 Statu : "",
		    	 Docty : "",
		    	 Pdata : vPdata,
		    	 Molga : oContext.getProperty("Molga")
		      }
		});	
	},
	
	_CADialog: null,
	
	onCAOpen : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecSubject");
		var oController = oView.getController();
		
		if(!oController._CADialog) {
			oController._CADialog = sap.ui.jsfragment("zui5_hrxx_actrec.fragment.CreateRecAction", oController);
			oView.addDependent(oController._CADialog);
		}
		
		oController._CADialog.open();
	},
	
	onRecallSubject : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecSubject");
		var oController = oView.getController();		
		
		oController.onSelectAction(oEvent);
	},
	
	onSelectAction : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecSubject");
		var oController = oView.getController();
		
		var interfaceFunction = function(fVal) {
			var oneData = {};
			oneData.Recno     = oController._vRecno;
			oneData.Persa     = oController._vPersa;
			oneData.RecYy     = oController._vRecYy;
			oneData.RecTypeCd = oController._vRecTypeCd;
			oneData.RecNm     = oController._vRecNm;
			
			var process_result = false;
			var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
	
			console.log(oneData);
			oModel.create(
					"/RecruitingInterfaceSet", 
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
			
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			};
			
			if(process_result) {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_RECINTERFACE"), {
					title: oBundleText.getText("MSG_TITLE_GUIDE"),
					onClose : function() {
						oController.navToBack();
					}
				});
			}
		};
		
		var preAction = function(fVal) {
			if(fVal && fVal == "OK") {
				if(oController.BusyDialog) {
					oController.BusyDialog.removeAllContent();
					oController.BusyDialog.destroyContent();
					oController.BusyDialog.addContent(oController.oBusyIndicator);
				} else {
					oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
					oController.BusyDialog.addContent(oController.oBusyIndicator);
					oController.getView().addDependent(oController.BusyDialog);
				}
				if(!oController.BusyDialog.isOpen()) {
					oController.BusyDialog.open();
				}
				
				setTimeout(interfaceFunction, 300);
			}
		};
		
		sap.m.MessageBox.confirm(oBundleText.getText("MSG_RECINTERFACE_CONFIRM"), {
			title : oBundleText.getText("CONFIRM_BTN"),
			onClose : preAction
		});
	},
	
	onCAClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecSubject");
		var oController = oView.getController();
		
		if(oController._CADialog && oController._CADialog.isOpen()) {
			oController._CADialog.close();
		}
	},	
	
	onCreateRecAction : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecSubject");
		var oController = oView.getController();
		
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_CA_Actda");
		var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_CA_Orgeh");
		var oEntrs = sap.ui.getCore().byId(oController.PAGEID + "_CA_Entrs");
		
		oActda.setValueState(sap.ui.core.ValueState.None);
		oOrgeh.removeStyleClass("L2PSelectInvalidBorder");
		oEntrs.removeStyleClass("L2PSelectInvalidBorder");;
		
		var vOneData = {
				Docno : oController._vDocno,
				Recno : oController._vRecno,
				Actda : oActda.getValue() == "" ? null : "\/Date(" + new Date(oActda.getValue()).getTime() + ")\/",
				Orgeh : oOrgeh.getSelectedKey(),
				Entrs : oEntrs.getSelectedKey()
		};
		
		// 발령일자
		if(vOneData.Actda == null) {
			oActda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_ACTDA"));
			return;
		}
		
		// 기안부서
		if(vOneData.Orgeh == "") {
			oOrgeh.addStyleClass("L2PSelectInvalidBorder");
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_ORGEH"));
			return;
		}
		
		// 입사구분
		if(vOneData.Entrs == "") {
			oEntrs.addStyleClass("L2PSelectInvalidBorder");
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_ENTRS"));
			return;
		}
		
		var process_result = false;
		var oPath = "/RecruitingDataTransferSet";
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");

		oModel.create(
				oPath, 
				vOneData, 
				null,
			    function (oData, response) {
					process_result = true;
			    },
			    function (oError) {
			    	var Err = {};
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						if(Err.error.innererror.errordetails) {
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
		if(process_result) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_CREATE"), {
				title: oBundleText.getText("MSG_TITLE_GUIDE"),
				onClose : function() {
					oController.navToBack();
				}
			});
		}
	},
	
	onDelete : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecSubject");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oContexts = oTable.getSelectedContexts();
		
		var mSubjectList = oTable.getModel();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var onDeleteSubject = function() {
			if(oContexts && oContexts.length) {
				var process_result = false;
				for(var i=0; i<oContexts.length; i++) {
					var process_result = false;
					
					var vVoltid = mSubjectList.getProperty(oContexts[i] + "/VoltId");
					var oPath = "/RecruitingInterfaceDataSet(Recno='" + oController._vRecno + "',"
				                  + "VoltId='" +  vVoltid + "')";
			
					console.log(oPath);
					oModel.remove(
							oPath, 
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
					
					if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
						oController.BusyDialog.close();
					};
				}
				
				if(process_result) {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
						title: oBundleText.getText("INFORMATION"),
						onClose : function() {
							oController.reloadList(oController);
						}
					});
				}
			}
		};
		
		
		var onProcessing = function(oAction){
			if ( oAction === sap.m.MessageBox.Action.YES ) {
				
				if(!oController.BusyDialog) {
					oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
					oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_DELETING_WAIT")}));
					oController.getView().addDependent(oController.BusyDialog);
				} else {
					oController.BusyDialog.removeAllContent();
					oController.BusyDialog.destroyContent();
					oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_DELETING_WAIT")}));
				}
				
				oController.BusyDialog.open();
				
				setTimeout(onDeleteSubject, 300);
				
        	}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("MSG_DELETE_CONFIRM"), {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("TITLE_ACT_ANNOUNCE"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: onProcessing
		});
	},
	
	addOrgehItems : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecSubject");
		var oController = oView.getController();
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_CA_Orgeh");
		
		oOrgeh.removeAllItems();
		oOrgeh.addItem(
			new sap.ui.core.Item({
				key : "", 
				text : oBundleText.getText("SELECTDATA")
			})
		);
		
		oModel.read("/AppReqDepListSet/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27", 
				null, 
				null, 
				false, 
				function(oData, oResponse) {
					if(oData.results && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							oOrgeh.addItem(
								new sap.ui.core.Item({
									key : oData.results[i].Orgeh, 
									text : oData.results[i].Orgtx
								})
							);
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
	},
	
	addEntrsItems : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecSubject");
		var oController = oView.getController();
		var oModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
		var oEntrs = sap.ui.getCore().byId(oController.PAGEID + "_CA_Entrs");
		
		oEntrs.removeAllItems();
		oEntrs.addItem(
			new sap.ui.core.Item({
				key : "", 
				text : oBundleText.getText("SELECTDATA")
			})
		);
		
		oModel.read("/EmpCodeListSet?$filter=Field eq 'Entrs' and PersaNc eq 'X'", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {
						if(oData && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								oEntrs.addItem(
									new sap.ui.core.Item({
										key : oData.results[i].Ecode, 
										text : oData.results[i].Etext
									})
								);
							}
						}
					},
					function(oResponse) {
						console.log(oResponse);
					}
		);
	},
	
	onAfterRenderingDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecSubject");
		var oController = oView.getController();
		
		oController.addOrgehItems(oEvent);
		oController.addEntrsItems(oEvent);
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