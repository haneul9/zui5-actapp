jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");
jQuery.sap.require("zui5_hrxx_actapp.common.Common");

sap.ui.controller("zui5_hrxx_actapp.ActAppDocument", {

	PAGEID : "ActAppDocument",
	ListSelectionType : "Multiple",
	ListSelected : false,
	ListFilter : "",
	
	_vStatu : "",
	_vReqno : "",
	_vDocno : "",
	_vDocty : "",
	_vEntrs : "",
	_vPersa : "",
	_vActda : "",
	_vMolga : "",
	_oContext : null,
	
	_vSelected_Reqno : "",
	_vSelected_Pernr : "",
	_vSelected_Actda : "",
	_vSelected_Docno : "",
	_vSelected_VoltId : "",
	
	vDisplayControl : [],
	
	_DetailViewPopover : null,
	
	_TableCellHeight : 70,
	_OtherHeight : 380,
	_vRecordCount : 0,
	
	_vListLength : 0,
	
	BusyDialog : null,
	UploadDialog : null,
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actapp.ActAppDocument
*/
	onInit: function() {
		//if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
	    //};
	      
	    this.getView().addEventDelegate({
				onBeforeShow : jQuery.proxy(function (evt) {
					this.onBeforeShow(evt);
				}, this),
				onBeforeHide : jQuery.proxy(function (evt) {
				}, this),
				onBeforeFirstShow : jQuery.proxy(function (evt) {
				}, this),
				onAfterShow  : jQuery.proxy(function (evt) {
					this.onAfterShow(evt);
				}, this),
				onAfterHide : jQuery.proxy(function (evt) {
					this.onAfterHide(evt);
				}, this)
		}); 
	      
	    sap.ui.getCore().getEventBus().subscribe("app", "ResizeWindow", this.onResizeWindow, this);
	    
	    var vTableHeight = window.innerHeight - this._OtherHeight;
		this._vRecordCount = parseInt(vTableHeight / this._TableCellHeight);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_actapp.ActAppDocument
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actapp.ActAppDocument
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actapp.ActAppDocument
*/
//	onExit: function() {
//
//	}
	onBeforeShow: function(oEvent) {
		
		if(oEvent) {
			this._vStatu = oEvent.data.Statu;
			this._vReqno = oEvent.data.Reqno;
			this._vDocno = oEvent.data.Docno;
			this._vDocty = oEvent.data.Docty;
			this._vEntrs = oEvent.data.Entrs;
			this._oContext = oEvent.data.context;
		}
		
		//Control제어
		var oPageTitle = sap.ui.getCore().byId(this.PAGEID + "_PAGE_TITLE");
		
		var oAdd_Btn = sap.ui.getCore().byId(this.PAGEID + "_Add_Btn");
		var oRequset_Btn = sap.ui.getCore().byId(this.PAGEID + "_REQUEST_BTN");
		var oComplete_Btn = sap.ui.getCore().byId(this.PAGEID + "_COMPLETE_BTN");
		var oAnnounce_Btn = sap.ui.getCore().byId(this.PAGEID + "_ANNOUNCE_BTN");
		var oRequsetDelete_Btn = sap.ui.getCore().byId(this.PAGEID + "_REQUESTDELETE_BTN");
		
		var modbtn = sap.ui.getCore().byId(this.PAGEID + "_Mod_Btn");
		var delbtn = sap.ui.getCore().byId(this.PAGEID + "_Del_Btn");
		var oUpload_Btn = sap.ui.getCore().byId(this.PAGEID + "_UPLOAD_BTN");
		var oExcel_Btn = sap.ui.getCore().byId(this.PAGEID + "_Excel_Btn");
		
		this._vListLength = 0;
		//신규작성인 경우
		if(this._vStatu == "00") {
			oPageTitle.setText(oBundleText.getText("TITLE_ACTREQ_REG"));
			
			oAdd_Btn.setVisible(false);
			modbtn.setVisible(false);
			oUpload_Btn.setVisible(false);
			delbtn.setVisible(false);
			oRequset_Btn.setVisible(false);
			oComplete_Btn.setVisible(false);
			oAnnounce_Btn.setVisible(false);
			oRequsetDelete_Btn.setVisible(false);
			oExcel_Btn.setVisible(false);
		} else if(this._vStatu == "10") {
			var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
			
			var vPostc = mActionReqList.getProperty(this._oContext + "/Postc");
			
			oPageTitle.setText(oBundleText.getText("TITLE_ACTREQ_UPD"));
			
			oAdd_Btn.setVisible(true);
			//oRequset_Btn.setVisible(false);
			oRequsetDelete_Btn.setVisible(true);
			
			oAnnounce_Btn.setVisible(true);
			oAnnounce_Btn.addCustomData(new sap.ui.core.CustomData({key : "Postc", value : vPostc}));
			if(vPostc == "X") {
				oAnnounce_Btn.setText(oBundleText.getText("ANNOUNCE_CANCEL_BTN"));
			} else {
				oAnnounce_Btn.setText(oBundleText.getText("ANNOUNCE_BTN"));
			}
		}
	},
	
	onAfterShow: function(oEvent) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var oController = this;
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var dataProcess = function() {	
			
			var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
			var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");
			var oReqno = sap.ui.getCore().byId(oController.PAGEID + "_Reqno");
			var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_Title");
			var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
			var oReqda = sap.ui.getCore().byId(oController.PAGEID + "_Reqda");
			var oNotes = sap.ui.getCore().byId(oController.PAGEID + "_Notes");
			
			//신규작성인 경우
			if(oController._vStatu == "00") {
				oPersa.removeAllItems();
				oOrgeh.removeAllItems();
				
				var vFirstPersa = "";
				var vFirstReqno = "";
				var vFirstOrgeh = "";
				
				var oPersaModel = sap.ui.getCore().getModel("PersaModel");
				var vPersaData = oPersaModel.getProperty("/PersAreaListSet");
				
				for(var i=0; i<vPersaData.length; i++) {
					oPersa.addItem(
						new sap.ui.core.Item({
							key : vPersaData[i].Persa, 
							text : vPersaData[i].Pbtxt
						})
					);
				};
				vFirstPersa = vPersaData[0].Persa;
				oPersa.setSelectedKey(vFirstPersa);
				oController._vPersa = vFirstPersa;
					
				oModel.read("/AppReqDepListSet/?$filter=Persa%20eq%20%27" + vFirstPersa + "%27", 
						null, 
						null, 
						false, 
						function(oData, oResponse) {					
							if(oData.results && oData.results.length) {
								for(var i=0; i<oData.results.length; i++) {
									if(i == 0) {
										vFirstReqno = oData.results[i].Reqno;
										vFirstOrgeh = oData.results[i].Orgeh;
									}
									oOrgeh.addItem(
											new sap.ui.core.Item({
												key : oData.results[i].Orgeh, 
												text : oData.results[i].Orgtx,
										        customData : [{key : "Reqno", value : oData.results[i].Reqno}]}
											)
									);
								}
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
				);
				oOrgeh.setSelectedKey(vFirstOrgeh);
				oReqno.setValue(vFirstReqno);
				
				oTitle.setValue("");
				oNotes.setValue("");
				oTitle.setValueState(sap.ui.core.ValueState.None);
				oReqno.setValueState(sap.ui.core.ValueState.None);
				oActda.setValueState(sap.ui.core.ValueState.None);
				oReqda.setValueState(sap.ui.core.ValueState.None);
				
				oActda.setValue(dateFormat.format(new Date()));
				oReqda.setValue(dateFormat.format(new Date()));
				
				oPersa.setEnabled(true);
				oOrgeh.setEnabled(true);
				oReqno.setEnabled(true);
			} else if(oController._vStatu == "10") { //작성중인 경우
				var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
				
				oPersa.removeAllItems();
				oOrgeh.removeAllItems();
				
				var vFirstPersa = mActionReqList.getProperty(oController._oContext + "/Persa");
				var vFirstReqno = mActionReqList.getProperty(oController._oContext + "/Reqno");
				var vFirstOrgeh = mActionReqList.getProperty(oController._oContext + "/Orgeh");
				//-------------------------
				var vFirstReqdp = mActionReqList.getProperty(oController._oContext + "/Reqdp");
				//-------------------------
				
				vPostc = mActionReqList.getProperty(oController._oContext + "/Postc");
				
				var oPersaModel = sap.ui.getCore().getModel("PersaModel");
				var vPersaData = oPersaModel.getProperty("/PersAreaListSet");
				
				var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
				
				for(var i=0; i<vPersaData.length; i++) {
					oPersa.addItem(
						new sap.ui.core.Item({
							key : vPersaData[i].Persa, 
							text : vPersaData[i].Pbtxt
						})
					);
				};
				oPersa.setSelectedKey(vFirstPersa);
				oController._vPersa = vFirstPersa;
					
				var isExistsOrgeh = false;
				oModel.read("/AppReqDepListSet/?$filter=Persa%20eq%20%27" + vFirstPersa + "%27", 
						null, 
						null, 
						false, 
						function(oData, oResponse) {					
							if(oData.results && oData.results.length) {
								for(var i=0; i<oData.results.length; i++) {
									//--------------------------------------
									if(vFirstOrgeh == oData.results[i].Orgeh) {
										isExistsOrgeh = true;
									}
									//--------------------------------------
									oOrgeh.addItem(
											new sap.ui.core.Item({
												key : oData.results[i].Orgeh, 
												text : oData.results[i].Orgtx,
										        customData : [{key : "Reqno", value : oData.results[i].Reqno}]}
											)
									);
								}
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
				);
				//----------------------------
				if(!isExistsOrgeh) {
					oOrgeh.addItem(
							new sap.ui.core.Item({
								key : vFirstOrgeh, 
								text : vFirstReqdp,
						        customData : [{key : "Reqno", value : vFirstReqno}]}
							)
					);
				}
				//------------------------------
				oOrgeh.setSelectedKey(vFirstOrgeh);
				
				oReqno.setValue(vFirstReqno);
				
				oTitle.setValue(mActionReqList.getProperty(oController._oContext + "/Title"));
				oTitle.setValueState(sap.ui.core.ValueState.None);
				oReqno.setValueState(sap.ui.core.ValueState.None);
				oActda.setValueState(sap.ui.core.ValueState.None);
				oReqda.setValueState(sap.ui.core.ValueState.None);
				
				oNotes.setValue(mActionReqList.getProperty(oController._oContext + "/Notes"));
				
				oActda.setValue(dateFormat.format(mActionReqList.getProperty(oController._oContext + "/Actda")));
				if(mActionReqList.getProperty(oController._oContext + "/Reqda") != null)
					oReqda.setValue(dateFormat.format(mActionReqList.getProperty(oController._oContext + "/Reqda")));
				else
					oReqda.setValue(dateFormat.format(new Date()));
				oPersa.setEnabled(false);
				oOrgeh.setEnabled(false);
				oReqno.setEnabled(true);
				
				oController._vActda = dateFormat.format(mActionReqList.getProperty(oController._oContext + "/Actda"));
			}
			
			oController.reloadSubjectList(oController);
			
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			};
		};
		
		if(!this.BusyDialog) {
			this.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			this.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_DATA_LOADING")}));
			this.getView().addDependent(this.BusyDialog);
		} else {
			this.BusyDialog.removeAllContent();
			this.BusyDialog.destroyContent();
			this.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_DATA_LOADING")}));
		}
		if(!this.BusyDialog.isOpen()) {
			this.BusyDialog.open();
		}
		
		setTimeout(dataProcess, 300);
	},
	
	onAfterHide : function(oEvent) {
		if(typeof ActAppDocumentSubject == "object") {
			ActAppDocumentSubject.Reset();
		}
	}, 
	
	reloadSubjectList : function(oController) {
		
		oController.setSubjectListColumn(oController);
		
		var modbtn = sap.ui.getCore().byId(oController.PAGEID + "_Mod_Btn");
		var delbtn = sap.ui.getCore().byId(oController.PAGEID + "_Del_Btn");
		var oRequset_Btn = sap.ui.getCore().byId(oController.PAGEID + "_REQUEST_BTN");
		var oComplete_Btn = sap.ui.getCore().byId(oController.PAGEID + "_COMPLETE_BTN");
		var oAnnounce_Btn = sap.ui.getCore().byId(oController.PAGEID + "_ANNOUNCE_BTN");
		var oUpload_Btn = sap.ui.getCore().byId(oController.PAGEID + "_UPLOAD_BTN");
		var oExcel_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Excel_Btn");
		
		if(oController._vListLength > 0) {				
			modbtn.setVisible(true);
			delbtn.setVisible(true);
			oRequset_Btn.setVisible(true);
			oComplete_Btn.setVisible(true);
			oAnnounce_Btn.setVisible(true);
			oUpload_Btn.setVisible(true);
			oExcel_Btn.setVisible(true);
		} else {
			modbtn.setVisible(false);
			delbtn.setVisible(false);
			oRequset_Btn.setVisible(false);
			oComplete_Btn.setVisible(false);
			oAnnounce_Btn.setVisible(false);
			oExcel_Btn.setVisible(false);
			if(oController._vStatu != "00") {
				oUpload_Btn.setVisible(true);
			} else {
				oUpload_Btn.setVisible(false);
			}	
		}
		
//		var oAllCheckbox = sap.ui.getCore().byId(oController.PAGEID + "_All_CheckBox");
//		oAllCheckbox.setChecked(false);
	},
	
	navToBack : function(oEvent){
		sap.ui.getCore().getEventBus().publish("nav", "back", {
		    });		
	},
	 
	addPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocument");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp.ActAppPersonInfo",
		      data : {
		    	 actiontype : "100",
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp.ActAppDocument"
		      }
		});
	},
	
	modifyPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectListSet = oModel.getProperty("/ActionSubjectListSet");
		
		var check_idxs = [];
		if(vActionSubjectListSet && vActionSubjectListSet.length) {
			for(var i=0; i<vActionSubjectListSet.length; i++) {
				if(vActionSubjectListSet[i].Pchk == true) {
					check_idxs.push(i);
				}
			}
		}
		
		if(check_idxs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_UPDATE_TARGET"));
			return;
		}
		
		if(check_idxs.length != 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_WARN_UPDATE"));
			return;
		}
		
		if(vActionSubjectListSet[check_idxs[0]].Cfmyn == "X") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_ACTION2"));
			return;
		}
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp.ActAppPersonInfo",
		      data : {
		    	 actiontype : "200",
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp.ActAppDocument",
		    	 Pernr : vActionSubjectListSet[check_idxs[0]].Pernr,
		    	 PernrActda : vActionSubjectListSet[check_idxs[0]].Actda,
		    	 PernrVoltId : vActionSubjectListSet[check_idxs[0]].VoltId,
		      }
		});		
	},
	
	deletePerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var mSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectListSet = mSubjectList.getProperty("/ActionSubjectListSet");
		
		var check_idxs = [];
		if(vActionSubjectListSet && vActionSubjectListSet.length) {
			for(var i=0; i<vActionSubjectListSet.length; i++) {
				console.log("Pchk " + (i+1) + " : " + vActionSubjectListSet[i].Pchk);
				if(vActionSubjectListSet[i].Pchk == true) {
					check_idxs.push(i);
				}
			}
		}
		
		if(check_idxs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_TARGET"));
			return;
		}
		
		var onProcessDelete = function(fVal) {
			if(fVal && fVal == "OK") {
				var process_result = false;
				
				for(var i=0; i<check_idxs.length; i++) {
					
					if(vActionSubjectListSet[check_idxs[i]].Cfmyn == "X") {
						sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_ACTION2"));
						return;
					}
					
					process_result = false;
					
					var oPath = "/ActionSubjectListSet(Docno='" + oController._vDocno + "',"
			                  + "Pernr='" +  vActionSubjectListSet[check_idxs[i]].Pernr + "',"
			                  + "VoltId='" +  vActionSubjectListSet[check_idxs[i]].VoltId + "',"
			                  + "Actda=" +  "datetime%27" + dateFormat.format(new Date(vActionSubjectListSet[check_idxs[i]].Actda)) + "T00%3a00%3a00%27" + ")";

					oModel.remove(
						oPath, 
						null,
					    function (oData, response) {
							process_result = true;
							common.Common.log("Sucess ActionSubjectListSet Delete !!!");
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

					if(!process_result) {
						return
					}
				}
				
				sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
					title : oBundleText.getText("INFORMATION"),
					onClose : function() {
						oController.reloadSubjectList(oController);
					}
				});	
			}
		};
		
		sap.m.MessageBox.confirm(oBundleText.getText("MSG_DELETE_CONFIRM"), {
			title : oBundleText.getText("CONFIRM_BTN"),
			onClose : onProcessDelete
		});
	},
	
	onChangePersa : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocument");
		var oController = oView.getController();
		
		var oPersa = oEvent.getSource();
		var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");
		var oReqno = sap.ui.getCore().byId(oController.PAGEID + "_Reqno");
		var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_Title");
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		var oReqda = sap.ui.getCore().byId(oController.PAGEID + "_Reqda");
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var vItem = oPersa.getSelectedItem();
		if(vItem) {
			var vPersa = vItem.getKey();
			
			oController._vPersa = vPersa;
			
			oOrgeh.removeAllItems();
			
			var vFirstReqno = "";
			var vFirstOrgeh = "";
			
			oModel.read("/AppReqDepListSet/?$filter=Persa%20eq%20%27" + vPersa + "%27", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData.results && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								if(i == 0) {
									vFirstReqno = oData.results[i].Reqno;
									vFirstOrgeh = oData.results[i].Orgeh;
								}
								oOrgeh.addItem(
										new sap.ui.core.Item({
											key : oData.results[i].Orgeh, 
											text : oData.results[i].Orgtx,
									        customData : [{key : "Reqno", value : oData.results[i].Reqno}]}
										)
								);
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
			oOrgeh.setSelectedKey(vFirstOrgeh);
			oReqno.setValue(vFirstReqno);
			
			oReqno.setValueState(sap.ui.core.ValueState.None);
			oTitle.setValueState(sap.ui.core.ValueState.None);
			oActda.setValueState(sap.ui.core.ValueState.None);
			oReqda.setValueState(sap.ui.core.ValueState.None);
		}
		
	},
	
	onChangeOrgeh : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocument");
		var oController = oView.getController();
		
		var oOrgeh = oEvent.getSource();
		var oReqno = sap.ui.getCore().byId(oController.PAGEID + "_Reqno");
		oReqno.setValue("");
		
		var vOrgehItem = oOrgeh.getSelectedItem();
		if(vOrgehItem) {
			var oCustomDataList = vOrgehItem.getCustomData();
			if(oCustomDataList) { 
				for(var i=0; i<oCustomDataList.length; i++) {
					if(oCustomDataList[i].getKey() == "Reqno") {
						oReqno.setValue(oCustomDataList[i].getValue());
					}
				}
			}
		}
	},
	
	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");
		var oReqno = sap.ui.getCore().byId(oController.PAGEID + "_Reqno");
		var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_Title");
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		var oReqda = sap.ui.getCore().byId(oController.PAGEID + "_Reqda");
		var oNotes = sap.ui.getCore().byId(oController.PAGEID + "_Notes");
		
		oReqno.setValueState(sap.ui.core.ValueState.None);
		oTitle.setValueState(sap.ui.core.ValueState.None);
		oActda.setValueState(sap.ui.core.ValueState.None);
		oReqda.setValueState(sap.ui.core.ValueState.None);
		
		var oAdd_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Add_Btn");
		var oRequsetDelete_Btn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		var oUpload_Btn = sap.ui.getCore().byId(oController.PAGEID + "_UPLOAD_BTN");
		
		if(oReqno.getValue() == "") {
			oReqno.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_REQNO"));
			return;
		}
		
		if(oTitle.getValue() == "") {
			oTitle.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_TITLE"));
			return;
		}
		
		if(oActda.getValue() == "") {
			oActda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_ACTDA"));
			return;
		}
		
		if(oReqda.getValue() == "") {
			oReqda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_REQDA"));
			return;
		}
		
		var updateData = {};
		
		updateData.Persa = oPersa.getSelectedKey();
		updateData.Orgeh = oOrgeh.getSelectedKey();
		updateData.Reqno = oReqno.getValue();
		updateData.Title = oTitle.getValue();
		
		//updateData.Actda = "\/Date(" + new Date(oActda.getValue()).getTime() + ")\/";
		updateData.Actda = "\/Date(" + common.Common.getTime(oActda.getValue()) + ")\/";
		updateData.Reqda = "\/Date(" + common.Common.getTime(oReqda.getValue()) + ")\/";
		
		updateData.Notes = oNotes.getValue();
		
		updateData.Docty = oController._vDocty; 
		
		var oPath = "/ActionReqListSet";
		var process_result = false;
		
		if(oController._vStatu == "00") {
			oModel.create(
					oPath, 
					updateData, 
					null,
				    function (oData, response) {
						if(oData) {
							oController._vDocno = oData.Docno;
						}
						process_result = true;
						common.Common.log("Sucess ActionReqListSet Create !!!");
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
		} else if(oController._vStatu == "10") {
			updateData.Docno = oController._vDocno;
			//oPath = "/ActionReqListSet(Docno='" + oController._vDocno + "',Reqno='" + encodeURI(oController._vReqno) + "')";
			oPath = "/ActionReqListSet(Docno='" + oController._vDocno + "')";
			oModel.update(
					oPath, 
					updateData, 
					null,
				    function (oData, response) {
						process_result = true;
						common.Common.log("Sucess ActionReqListSet Update !!!");
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
			if(oController._vStatu == "00") {
				oController._vStatu = "10";
				
				var insertData = {};
				
				insertData.Persa = oPersa.getSelectedKey();
				var oItem = oOrgeh.getSelectedItem();
				insertData.Orgeh = oItem.getKey();
				insertData.Reqdp = oItem.getText();
				insertData.Reqno = oReqno.getValue();
				insertData.Title = oTitle.getValue();
				insertData.Actda = new Date(common.Common.setTime(new Date(oActda.getValue())));
				insertData.Reqda = new Date(common.Common.setTime(new Date(oReqda.getValue())));				
				insertData.Notes = oNotes.getValue();
				insertData.Statu = "10";
				
				var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
				var vActionReqListSet = mActionReqList.getProperty("/ActionReqListSet");
				var vActionReqList = {ActionReqListSet : []};
				for(var i=0; i<vActionReqListSet.length; i++) {
					vActionReqList.ActionReqListSet.push(vActionReqListSet[i]);
				}
				vActionReqList.ActionReqListSet.push(insertData);
				oController._oContext = "/ActionReqListSet/" + vActionReqListSet.length;
				mActionReqList.setData(vActionReqList);
			} else {
				var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
				mActionReqList.setProperty(oController._oContext + "/Title", oTitle.getValue());
				mActionReqList.setProperty(oController._oContext + "/Actda", new Date(common.Common.setTime(new Date(oActda.getValue()))));
				mActionReqList.setProperty(oController._oContext + "/Reqda", new Date(common.Common.setTime(new Date(oReqda.getValue()))));
				mActionReqList.setProperty(oController._oContext + "/Notes", oNotes.getValue());
			}
			
			oController._vReqno = oReqno.getValue();
			oController._vActda = oActda.getValue();
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
				title: oBundleText.getText("INFORMATION"),
				onClose : function() {
					oPersa.setEnabled(false);
					oOrgeh.setEnabled(false);
					oReqno.setEnabled(false);
					
					oTitle.setValueState(sap.ui.core.ValueState.None);
					oReqno.setValueState(sap.ui.core.ValueState.None);
					oActda.setValueState(sap.ui.core.ValueState.None);
					oReqda.setValueState(sap.ui.core.ValueState.None);
					
					oAdd_Btn.setVisible(true);
					oRequsetDelete_Btn.setVisible(true);
					
					if(oController._vListLength > 0) {
						oUpload_Btn.setVisible(true);
					} else {
						oUpload_Btn.setVisible(true);
					}
				}
			});
		} else {
			oTitle.setValueState(sap.ui.core.ValueState.None);
			oReqno.setValueState(sap.ui.core.ValueState.None);
			oActda.setValueState(sap.ui.core.ValueState.None);
			oReqda.setValueState(sap.ui.core.ValueState.None);
		}
	},
	
	onPressDelete : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocument");
		var oController = oView.getController();
		
		var onProcessDelete = function(fVal) {
			if(fVal && fVal == "OK") {
				var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
				
				//var oPath = "/ActionReqListSet('" + encodeURI(oController._vReqno) + "')";
				var oPath = "/ActionReqListSet('" + oController._vDocno + "')";
				var process_result = false;
				oModel.remove(
						oPath, 
						null,
					    function (oData, response) {
							process_result = true;
							common.Common.log("Sucess ActionReqListSet Delete !!!");
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
				
				if(process_result) {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
						title: oBundleText.getText("INFORMATION"),
						onClose : function() {
							sap.ui.getCore().getEventBus().publish("nav", "to", {
							      id : "zui5_hrxx_actapp.ActAppMain",
							      data : {     
							      }
							});
						}
					});
				}
			}
		};
		
		sap.m.MessageBox.confirm(oBundleText.getText("MSG_DELETE_CONFIRM"), {
			title : oBundleText.getText("CONFIRM_BTN"),
			onClose : onProcessDelete
		});
	},
	
	onPressComplete : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocument");
		var oController = oView.getController();
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");
		var vCfmynCount = 0;
		if(vActionSubjectList && vActionSubjectList.length) {
			for(var i=0; i<vActionSubjectList.length; i++) {
				if(vActionSubjectList[i].Cfmyn == "N") {
					vCfmynCount++;
				}
			}
		}

		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp.ActAppComplete",
		      data : {
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp.ActAppDocument"
		      }
		});		
	},
	
	onChangeCheckBox :function(oEvent) {
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet"); //{ActionSubjectListSet : []};
		
		var vTempData = {ActionSubjectListSet : []};
		
		if(vActionSubjectList && vActionSubjectList.length) {
			for(var i=0; i<vActionSubjectList.length; i++) {
				var Batyp = vActionSubjectList[i].Batyp;
				var oneData = vActionSubjectList[i];
				if(Batyp == "A") oneData.Pchk = oEvent.getParameter("checked");	
				vTempData.ActionSubjectListSet.push(oneData);
			}
			mActionSubjectList.setData(vTempData);
		}
	},
	
	displayDetailView : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocument");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		var oCustomData = oControl.getCustomData();
		
		oController._vSelected_Reqno = null;
		oController._vSelected_Reqno = null;
		oController._vSelected_Actda = null;
		oController._vSelected_Docno = null;
		
		if(oCustomData && oCustomData.length) {
			for(var i=0; i<oCustomData.length; i++) {
				if(oCustomData[i].getKey() == "Reqno") {
					oController._vSelected_Reqno = oCustomData[i].getValue();
				} else if(oCustomData[i].getKey() == "Pernr") {
					oController._vSelected_Pernr = oCustomData[i].getValue();
				} else if(oCustomData[i].getKey() == "Actda") {
					oController._vSelected_Actda = oCustomData[i].getValue();
				} else if(oCustomData[i].getKey() == "Docno") {
					oController._vSelected_Docno = oCustomData[i].getValue();
				}
			}
		}
		
		if(!oController._DetailViewPopover) {
			if(oController._vDocty == "20") {
				oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActionRecDetailView", oController);
			} else {
				oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActionDetailView", oController);
			}
			oView.addDependent(oController._DetailViewPopover);
		}
		
		oController._DetailViewPopover.openBy(oControl);
	},
	
	onAfterOpenPopover : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocument");
		var oController = oView.getController();
		
		zui5_hrxx_actapp.common.Common.onAfterOpenDetailViewPopover(oController);
		
//		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
//		
//		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
//		var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
//		
//		var filterString = "/?$filter=Reqno%20eq%20%27" + encodeURI(oController._vSelected_Reqno) + "%27";
//		filterString += "%20and%20Docno%20eq%20%27" + oController._vSelected_Docno + "%27";
//		filterString += "%20and%20Pernr%20eq%20%27" + oController._vSelected_Pernr + "%27";
//		filterString += "%20and%20Actda%20eq%20datetime%27" + dateFormat1.format(new Date(oController._vSelected_Actda)) + "T00%3a00%3a00%27";
//		
//		var vAfterData = {};
//		var vBeforeData = {};
//		try {
//			oModel.read("/ActionSubjectListSet"  + filterString, 
//					null, 
//					null, 
//					false, 
//					function(oData, oResponse) {					
//						if(oData.results && oData.results.length) {
//							vAfterData = oData.results[0];
//							vBeforeData = oData.results[1];
//						}
//					},
//					function(oResponse) {
//						common.Common.log(oResponse);
//					}
//			);
//		} catch(ex) {
//			common.Common.log(ex);
//		}
//		
//		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_AD_Actda");
//		oActda.setText(dateFormat2.format(new Date(oController._vSelected_Actda)));
//		
//		var oIssuedTypeMatrix = sap.ui.getCore().byId(oController.PAGEID + "_AD_IssuedTyp");
//		oIssuedTypeMatrix.removeAllRows();
//		
//		var oCell, oRow;
//		
//		var vMassLabels = ["1st 발령유형 / 사유","2nd 발령유형 / 사유","3rd 발령유형 / 사유","4th 발령유형 / 사유","5th 발령유형 / 사유",];
//		
//		for(var i=0; i<vMassLabels.length; i++) {
//			var vMassn = eval("vAfterData.Mntxt" + (i+1));
//			var vMassg = eval("vAfterData.Mgtxt" + (i+1));
//			
//			if(vMassn != "" && vMassg != "") {
//				oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//				
//				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//					hAlign : sap.ui.commons.layout.HAlign.Begin,
//					vAlign : sap.ui.commons.layout.VAlign.Middle,
//					content : [new sap.m.Label({text : vMassLabels[i]}).addStyleClass("L2P13Font")]
//				}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
//				oRow.addCell(oCell);
//				
//				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//					hAlign : sap.ui.commons.layout.HAlign.Begin,
//					vAlign : sap.ui.commons.layout.VAlign.Middle,
//					content : new sap.m.Text({text : vMassn + " / " + vMassg}).addStyleClass("L2P13Font")
//				}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//				oRow.addCell(oCell);
//				
//				oIssuedTypeMatrix.addRow(oRow);
//			}
//		}
//		
//		var vControls = [{id : "Pbtxt", label : oBundleText.getText("PBTXT"), change : "PersaC"},
//		                 {id : "Btrtx", label : oBundleText.getText("BTRTX"), change : "BtrtlC"},
//		                 {id : "Fulln", label : oBundleText.getText("FULLN"), change : "OrgehC"},
//		                 {id : "Zzempwptx", label : oBundleText.getText("ZZEMPWPTX"), change : "ZzempwpC"},
//		                 {id : "Stetx", label : oBundleText.getText("STETX"), control : "StellC"},
//		                 {id : "Zzdcmcgtx", label : oBundleText.getText("ZZDCMCGTX"), change : "ZzdcmcgC"},
//		                 {id : "Pgtxt", label : oBundleText.getText("PGTXT"), control : "PersgC"},
//		                 {id : "Pktxt", label : oBundleText.getText("PKTXT"), control : "PerskC"},
//		                 {id : "Zzjobgrtx", label : oBundleText.getText("ZZJOBGRTX"), change : "ZzjobgrC"},
//		                 {id : "Zzjobsrtx", label : oBundleText.getText("ZZJOBSRTX"), change : "ZzjobsrC"},
//		                 {id : "Zzcaltltx", label : oBundleText.getText("ZZCALTLTX"), change : "ZzcaltlC"},
//		                 {id : "Zzmaltltx", label : oBundleText.getText("ZZMALTLTX"), change : "ZzmaltlC"},
//		                 {id : "Zzpsgrptx", label : oBundleText.getText("ZZPSGRPTX"), change : "ZzpsgrpC"},
//		                 {id : "Zzrollvtx", label : oBundleText.getText("ZZROLLVTX"), change : "ZzrollvC"},
//		                 {id : "Zzjobcltx", label : oBundleText.getText("ZZJOBCLTX"), change : "ZzjobclC"},
//		                 {id : "Zzemptytx", label : oBundleText.getText("ZZEMPTYTX"), change : "ZzemptyC"},
//		                 {id : "Zzprdcttx", label : oBundleText.getText("ZZPRDCTTX"), change : "ZzprdctC"},
//		                 {id : "Zzprdartx", label : oBundleText.getText("ZZPRDARTX"), change : "ZzprdarC"},
//		                 {id : "StellSubtx", label : oBundleText.getText("STELLSUBTX"), change : "StellSubtx"}, //부직무
//		                 {id : "Zzautyptx", label : oBundleText.getText("ZZAUTYPTX"), change : "ZzautypC"}, //권한그룹
//		                 {id : "Zzlotaxtx", label : oBundleText.getText("ZZLOTAXTX"), change : "ZzlotaxC"}, //지방세남부기준
//		                 {id : "Zzdirectx", label : oBundleText.getText("ZZDIRECTX"), change : "ZzdirecC"}, //직/간접 구분
//		                 {id : "Zzcalpgtx", label : oBundleText.getText("ZZCALPGTX"), change : "ZzcalpgC"}, //메일직책
//		                 ];
//		
//		for(var i=0; i<vControls.length; i++) {
//			var oAfterControl = sap.ui.getCore().byId(oController.PAGEID + "_After_" + vControls[i].id);
//			var oBeforeControl = sap.ui.getCore().byId(oController.PAGEID + "_Before_" + vControls[i].id);
//			
//			var vTmp = eval("vAfterData." + vControls[i].change);
//			
//			eval("oAfterControl.setText(vAfterData." + vControls[i].id + ");" );
//			eval("oBeforeControl.setText(vBeforeData." + vControls[i].id + ");" );
//			
//			if(vTmp == "X") {
//				oAfterControl.addStyleClass("L2PFontColorRed");
//			}
//			
//			
//		}
	},	
	
	onPressRequest : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocument");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp.ActAppRequest",
		      data : {
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp.ActAppDocument"
		      }
		});		
	},
	
	onResizeWindow : function(oEvent, oEventId, data) {
		$("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 360);
	},
	
	onPressAnnounce : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var oSrc = oEvent.getSource();
		var vPostc = "";
		var oCustomData = oSrc.getCustomData();
		if(oCustomData && oCustomData.length) {
			for(var i=0; i<oCustomData.length; i++) {
				if(oCustomData[i].getKey() == "Postc") {
					vPostc = oCustomData[i].getValue();
				}
			}
		}
		
		var vTitle = oBundleText.getText("TITLE_ANNOUNCE");
		var vMsg = oBundleText.getText("MSG_ANNOUNCE");
		if(vPostc == "X") {
			vTitle = oBundleText.getText("TITLE_ANNOUNCE_CANCEL");
			vMsg = oBundleText.getText("MSG_ANNOUNCE_CANCEL");
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : "zui5_hrxx_actapp.ActAppAnnounce",
			      data : {
			    	 Persa : oController._vPersa,
			    	 Statu : oController._vStatu,
			    	 Reqno : oController._vReqno,
			    	 Docno : oController._vDocno,
			    	 Docty : oController._vDocty,
			    	 Actda : oController._vActda,
			    	 context : oController._oContext,
			    	 FromPageId : "zui5_hrxx_actapp.ActAppDocument"
			      }
			});
			return;
		}
		
		var DataProcess = function() {
			var createData = {
					"Docno"  : oController._vDocno,
					"Persa"  : oController._vPersa, 
					"Reqno"  : oController._vReqno
			};
			
			var msg = "";
			if(vPostc == "X") {
				createData.Reqst = "52";
				msg = oBundleText.getText("MSG_ANNOUNCE_CANCELED");
			}
							
			oModel.create(
					"/ActionReqChangeHistorySet", 
					createData, 
					null,
				    function (oData, response) {
						sap.m.MessageBox.alert(msg, {
							title: oBundleText.getText("INFORMATION"),
							onClose : function() {
								oController.navToBack();
							}
						});
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
				    }
		    );
		};
		
		sap.m.MessageBox.show(vMsg, {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: vTitle,
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: function(oAction) { 
	        	if ( oAction === sap.m.MessageBox.Action.YES ) {
	        		DataProcess();
	        	}
	        }
		});
	},
	
	onAfterRenderingTable : function(oController) {
		if(typeof ActAppDocumentSubject == "undefined") {
			var vLang = "";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") == -1) vLang = "en";
			
			createIBSheet2(document.getElementById(oController.PAGEID + "_SubjectList"), "ActAppDocumentSubject", "100%",  (window.innerHeight - 360) + "px", vLang);
		}
		
		ActAppDocumentSubject.Reset();
	},
	
	setSubjectListColumn : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var icon1 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_common/images/Apply.png'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_common/images/Error.png'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_common/images/Lock.png'>";
		
		var icon_retro = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_common/images/Radiation.png'>";
		
		oController.vDisplayControl = [];
		try {
			oModel.read("/ActionDisplayFieldSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData.results && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								oController.vDisplayControl.push(oData.results[i]);
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
		} catch(ex) {
			common.Common.log(ex);
		}
		
		var vColumns = [ {id : "Pchk", label : "", control : "CheckBox", width : 30, align : "Center"},
		                 {id : "Ename_Html", label : oBundleText.getText("ENAME"), control : "Html", width : 150, align : "Left"},
		                 {id : "Acttx", label : oBundleText.getText("ACTTX"), control : "Html", width : 200, align : "Left"},
		                 {id : "Actda1", label : oBundleText.getText("ACTDA"), control : "Text", width : 100, align : "Center"},
		                 {id : "Batyp_Html", label : oBundleText.getText("BATYP"), control : "Html", width : 70, align : "Center"},
		                 {id : "Pernr", label : oBundleText.getText("PERNR"), control : "Hidden", width : 70, align : "Center"},
		                 {id : "Docno", label : oBundleText.getText("DOCNO"), control : "Hidden", width : 70, align : "Center"},
		                 {id : "Reqno", label : oBundleText.getText("REQNO"), control : "Hidden", width : 70, align : "Center"},
		                 {id : "Actda", label : oBundleText.getText("ACTDA"), control : "Hidden1", width : 70, align : "Center"},
		                 {id : "Ename", label : oBundleText.getText("ENAME"), control : "Hidden", width : 70, align : "Center"},
		                 {id : "Batyp", label : oBundleText.getText("BATYP"), control : "Hidden", width : 70, align : "Center"},
		                 {id : "VoltId", label : oBundleText.getText("VOLTID"), control : "Hidden", width : 70, align : "Center"},
		               ];
		
		var vAdd_Columns = [{id : "Docno", label : "", control : "", width : ""},
		                 {id : "Pernr", label : "", control : "", width : ""},
		                 {id : "Docty", label : "", control : "", width : ""},
		                 {id : "Docno", label : "", control : "", width : ""},
		                 {id : "Reqno", label : "", control : "", width : ""},
		                 {id : "Persa", label : "", control : "", width : ""},
		                 {id : "Pbtxt", label : "", control : "", width : ""},
		                 {id : "Cfmyn", label : "", control : "", width : ""},
		                 {id : "Shayn", label : "", control : "", width : ""},
		                 {id : "Regno", label : "", control : "", width : ""},
		                 {id : "Massn1", label : "", control : "", width : ""},
		                 {id : "Massg1", label : "", control : "", width : ""},
		                 {id : "Massn2", label : "", control : "", width : ""},
		                 {id : "Massg2", label : "", control : "", width : ""},
		                 {id : "Massn3", label : "", control : "", width : ""},
		                 {id : "Massg3", label : "", control : "", width : ""},
		                 {id : "Massn4", label : "", control : "", width : ""},
		                 {id : "Massg4", label : "", control : "", width : ""},
		                 {id : "Massn5", label : "", control : "", width : ""},
		                 {id : "Massg5", label : "", control : "", width : ""},
		                 {id : "Mntxt1", label : "", control : "", width : ""},
		                 {id : "Mgtxt1", label : "", control : "", width : ""},
		                 {id : "Mntxt2", label : "", control : "", width : ""},
		                 {id : "Mgtxt2", label : "", control : "", width : ""},
		                 {id : "Mntxt3", label : "", control : "", width : ""},
		                 {id : "Mgtxt3", label : "", control : "", width : ""},
		                 {id : "Mntxt4", label : "", control : "", width : ""},
		                 {id : "Mgtxt4", label : "", control : "", width : ""},
		                 {id : "Mntxt5", label : "", control : "", width : ""},
		                 {id : "Mgtxt5", label : "", control : "", width : ""},
		                 {id : "Actty", label : "", control : "", width : ""},
		                 {id : "CfmLast", label : "", control : "", width : ""},
		               ];
		
		if(typeof ActAppDocumentSubject == "undefined") {
			var vLang = "";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") == -1) vLang = "en";
			
			createIBSheet2(document.getElementById(oController.PAGEID + "_SubjectList"), "ActAppDocumentSubject", "100%",  (window.innerHeight - 360) + "px", vLang);
		}
		
		ActAppDocumentSubject.Reset();
		
		ActAppDocumentSubject.SetTheme("DS","ActApp");

		var initdata = {};
		
		//initdata.Cfg = {SearchMode:smLazyLoad, SizeMode:0, CustomScroll:1, Page:20, SmartResize:1, MergeSheet:msHeaderOnly};  //MergeSheet:msHeaderOnly,

		//InitHeaders의 두번째 인자
		initdata.HeaderMode = {Sort:0,ColMove:0,ColResize:1,HeaderCheck:1};
		
		initdata.Cols = [];
		var vTotalWidth = 0;
		
		for(var i=0; i<vColumns.length; i++) {
			var oneCol = {};
			
			oneCol.Header = vColumns[i].label;			
			oneCol.Edit = 1;
			if(i > 0) oneCol.Edit = 0;
			oneCol.Type = vColumns[i].control;
			oneCol.Width = vColumns[i].width;
			oneCol.SaveName = vColumns[i].id;
			oneCol.Align = vColumns[i].align;			
			initdata.Cols.push(oneCol);
			
			if(vColumns[i].control ==  "Hidden") {
				oneCol.Type = "Text";
				oneCol.Hidden = true;
			}
			
			if(vColumns[i].control ==  "Hidden1") {
				oneCol.Hidden = true;
			}
			
			if(i == 1) {
				oneCol.Wrap = 1;
			}
			
			vTotalWidth += vColumns[i].width;
		}
		
		if(oController._vStatu != "00") {
			for(var i=0; i<oController.vDisplayControl.length; i++) {
				var Fieldname = oController.vDisplayControl[i].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				
				var oneCol = {};
				
				oneCol.Header = oBundleText.getText(oController.vDisplayControl[i].Fieldname);			
				oneCol.Edit = 0;
				oneCol.Type = "Html";
				oneCol.Width = 150;
				oneCol.SaveName = TextFieldname;
				oneCol.Align = "Left";			
				initdata.Cols.push(oneCol);
				
				var oneCol1 = {};				
				oneCol1.Header = oBundleText.getText(oController.vDisplayControl[i].Fieldname);			
				oneCol1.Edit = 0;
				oneCol1.Type = "Text";
				oneCol1.SaveName = TextFieldname + "_Hidden";
				oneCol1.Align = "Left";		
				oneCol1.Hidden = true;
				initdata.Cols.push(oneCol1);
				
				vTotalWidth += 150;
			}
		}
		
		initdata.Cols.push({
			Header : "", 
			Width : 10,
			Type : "Text", 
			Edit : 0, 
			SaveName : "vDummy",
			Align : "Center"});
		
		try {
			IBS_InitSheet(ActAppDocumentSubject, initdata);
		}catch(ex) {
			console.log(ex);
		}		
		
		if(vTotalWidth < window.innerWidth) {
			//ActAppDocumentSubject.FitColWidth();
		}			
		ActAppDocumentSubject.SetSelectionMode(0);
		
		ActAppDocumentSubject.SetCellFont("FontSize", 0, "Pchk", ActAppDocumentSubject.HeaderRows(), "vDummy", 13);
		ActAppDocumentSubject.SetCellFont("FontName", 0, "Pchk", ActAppDocumentSubject.HeaderRows(), "vDummy", "Malgun Gothic");
		
		ActAppDocumentSubject.SetHeaderRowHeight(32);
		ActAppDocumentSubject.SetDataRowHeight(32);
		
		ActAppDocumentSubject.SetFocusAfterProcess(0);
		
		var SubjectListData = {data : []};
		
		if(oController._vStatu == "00") {		
			ActAppDocumentSubject.LoadSearchData(SubjectListData);
			return;
		}

		var fCompleteCount = false; 
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = {ActionSubjectListSet : []};
		var oPath = "/ActionSubjectListSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27"
        		  + "%20and%20Reqno%20eq%20%27" + encodeURIComponent(oController._vReqno) + "%27";
		
		oModel.read(oPath + oController.ListFilter, 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						var oneData = null;
						
						for(var i=0; i<oData.results.length; i++) {
							
							if(oData.results[i].Cfmyn == "X") {
								fCompleteCount = true; 
							}
							
							if(oData.results[i].Batyp == "A") {
								oneData = {};
								oneData.Pchk = oController.ListSelected;
								oneData.ProcessStatus = "W";
								oneData.ProcessStatusText = oBundleText.getText("WAIT_STATUS");
								oneData.ProcessMsg = "";
								
								for(var j=1; j<vColumns.length; j++) {
									eval("oneData." + vColumns[j].id + " = oData.results[i]." + vColumns[j].id + ";");
								}
								for(var j=0; j<vAdd_Columns.length; j++) {
									eval("oneData." + vAdd_Columns[j].id + " = oData.results[i]." + vAdd_Columns[j].id + ";");
								}
								
								//Global 일자 관련하여 소스 수정함. 2015.10.19
								var vActda = new Date(oData.results[i].Actda);
								oneData.Actda = new Date(common.Common.setTime(vActda));
								//수정완료
								
								oneData.A_Batyp = oData.results[i].Batyp;
								
								for(var j=0; j<oController.vDisplayControl.length; j++) {
									var Fieldname = oController.vDisplayControl[j].Fieldname;
									Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
									var TextFieldname = Fieldname + "_Tx";
									var ChangeFieldname = Fieldname + "C";
									
									eval("oneData.A_" + Fieldname + " = oData.results[i]." + Fieldname + ";");
									eval("oneData.A_" + TextFieldname + " = oData.results[i]." + TextFieldname + ";");
									eval("oneData.A_" + ChangeFieldname + " = oData.results[i]." + ChangeFieldname + ";");
								}
							} else {
								oneData.B_Batyp = oData.results[i].Batyp;
								for(var j=0; j<oController.vDisplayControl.length; j++) {
									var Fieldname = oController.vDisplayControl[j].Fieldname;
									Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
									var TextFieldname = Fieldname + "_Tx";
									var ChangeFieldname = Fieldname + "C";
									
									eval("oneData.B_" + Fieldname + " = oData.results[i]." + Fieldname + ";");
									eval("oneData.B_" + TextFieldname + " = oData.results[i]." + TextFieldname + ";");
									eval("oneData.B_" + ChangeFieldname + " = oData.results[i]." + ChangeFieldname + ";");
								}
								vActionSubjectList.ActionSubjectListSet.push(oneData);
							}

							var oneDataSheet = oData.results[i];
							var vBatyp = oData.results[i].Batyp;
							
							//Global 일자 관련하여 소스 수정함. 2015.10.19
							var vActda = new Date(oData.results[i].Actda);
							oneDataSheet.Actda = new Date(common.Common.setTime(vActda));							
							
							if(oneDataSheet.Actda != null) {
								oneDataSheet.Actda1 = dateFormat.format(new Date(oneDataSheet.Actda));
							} else {
								oneDataSheet.Actda1 = "";
							}
							//수정완료
							
							var icon_src = "";
							if(oData.results[i].Cfmyn == "X") icon_src = icon1;
							else if(oData.results[i].Cfmyn == "E") icon_src = icon2;
							else if(oData.results[i].Cfmyn == "L") icon_src = icon3;
							else icon_src = "";
							
							if(oData.results[i].Retro == "X" && oData.results[i].Movda != null) {
								icon_src += icon_retro;
							}
							
							oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'>"
							                        + "<tr><td style='border:0px; width:16px'>" + icon_src + "</td>"
							                        + "<td style='padding-left:5px; border:0px'>"
							                        + "<div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup(" + (i+1) + ")'>" + oData.results[i].Ename + "</div>"
							                        + "<div class='L2P13Font'>(" + oData.results[i].Pernr + ")</div>";
							if(oData.results[i].Retro == "X" && oData.results[i].Movda != null) {
								oneDataSheet.Ename_Html += "<div class='L2P13Font'>" + dateFormat.format(new Date(oData.results[i].Movda)) + " " + oBundleText.getText("MOVE_DEPT") + "</div>";
							}							
							oneDataSheet.Ename_Html += "</td></tr></table>";
							oneDataSheet.Ename = oData.results[i].Ename + " (" + oData.results[i].Pernr + ")";
							
							if(vBatyp == "A") {
								oneDataSheet.Batyp_Html = "<span class='L2P13Font' style='font-weight:bold; color:#1F4E79'>AFTER</span>";
								oneDataSheet.Batyp = "AFTER";
							} else {
								oneDataSheet.Batyp_Html = "<span class='L2P13Font' style='font-weight:bold; color:black'>BEFORE</span>";
								oneDataSheet.Batyp = "BEFORE";
							}
							
							for(var j=0; j<oController.vDisplayControl.length; j++) {
								var Fieldname = oController.vDisplayControl[j].Fieldname;
								Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
								var TextFieldname = Fieldname + "_Tx";
								var ChangeFieldname = Fieldname + "C";
								
								var fChange = eval("oData.results[i]." + ChangeFieldname + ";");
								
								var val = eval("oData.results[i]." + TextFieldname + ";");	
								eval("oneDataSheet." + TextFieldname + "_Hidden" + " = val;");
								if(vBatyp == "A" && fChange == "X") {
									val = "<span style='color:#1F4E79; font-weight:bold' class='L2P13Font'>" + val + "</span>";
									eval("oneDataSheet." + TextFieldname + " = val;");	
								} else {
									eval("oneDataSheet." + TextFieldname + " = val;");	
								}
							}
							
							SubjectListData.data.push(oneDataSheet);
						}
					}
				},
				function(oError) {
					common.Common.log(oError);
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
				}
		);

		mActionSubjectList.setData(vActionSubjectList);	
		
		ActAppDocumentSubject.LoadSearchData(SubjectListData);
		
		oController._vListLength = SubjectListData.data.length;
		
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		
		if(fCompleteCount) {
			if(oDeleteBtn) oDeleteBtn.setVisible(false);
		} else {
			if(oDeleteBtn) oDeleteBtn.setVisible(true);
		}
	},
	
	onPressUpload : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocument");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp.ActAppUpload",
		      data : {
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp.ActAppDocument"
		      }
		});		
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
	},
	
	downloadExcel : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocument");
		var oController = oView.getController();
		
		var vCols = "Ename|Acttx|Actda1|Batyp|Sub01|Sub02|Sub03|Sub04|Sub05|Sub06|Sub07|Sub08|";
		for(var i=0; i<oController.vDisplayControl.length; i++) {
			var Fieldname = oController.vDisplayControl[i].Fieldname;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			var TextFieldname = Fieldname + "_Tx";
			vCols += TextFieldname + "_Hidden|";
		}
		
		var params = { FileName : "ActionSubject.xls",  SheetName : "Sheet", Merge : 1, HiddenColumn : 0, DownCols : vCols} ;
		if(typeof ActAppDocumentSubject == "object") {
			ActAppDocumentSubject.Down2Excel(params);
		}
	},
});

function onInfoViewPopup(rowId) {
	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocument");
	var oController = oView.getController();
	
	oController._vSelected_Pernr = null;
	oController._vSelected_Reqno = null;
	oController._vSelected_Actda = null;
	oController._vSelected_Docno = null;
	
	if(typeof ActAppDocumentSubject == "object") {
		oController._vSelected_Pernr = ActAppDocumentSubject.GetCellValue(rowId, "Pernr");
		oController._vSelected_Reqno = ActAppDocumentSubject.GetCellValue(rowId, "Reqno");
		oController._vSelected_Actda = ActAppDocumentSubject.GetCellValue(rowId, "Actda");
		oController._vSelected_Docno = ActAppDocumentSubject.GetCellValue(rowId, "Docno");
		oController._vSelected_VoltId = ActAppDocumentSubject.GetCellValue(rowId, "VoltId");
	}
	
	if(!oController._DetailViewPopover) {
		if(oController._vDocty == "20") {
			oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActionRecDetailView", oController);
		} else {
			oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActionDetailView", oController);
		}
		oView.addDependent(oController._DetailViewPopover);
	}
	
	var oControl = $("#" + oController.PAGEID + "_row_name_" + rowId);
	oController._DetailViewPopover.openBy(oControl);
	
};

function ActAppDocumentSubject_OnSearchEnd(result) {
	if(ActAppDocumentSubject.RowCount() > 0) {
		ActAppDocumentSubject.FitSize(1, 1);
//		ActAppDocumentSubject.SetColWidth(1, 180);
	}
	ActAppDocumentSubject.SetExtendLastCol(true);
	
	ActAppDocumentSubject.SetCellFont("FontSize", 0, "Pchk", ActAppDocumentSubject.RowCount() + ActAppDocumentSubject.HeaderRows(), "vDummy", 13);
	ActAppDocumentSubject.SetCellFont("FontName", 0, "Pchk", ActAppDocumentSubject.RowCount() + ActAppDocumentSubject.HeaderRows(), "vDummy", "Malgun Gothic");
	
	var vHeaderRows = ActAppDocumentSubject.HeaderRows();
	for(var r=0; r<ActAppDocumentSubject.RowCount(); r++) {
		if((r % 2) == 0) {
			ActAppDocumentSubject.SetMergeCell((r+vHeaderRows),0,2,1);
			ActAppDocumentSubject.SetMergeCell((r+vHeaderRows),1,2,1);
			ActAppDocumentSubject.SetMergeCell((r+vHeaderRows),2,2,1);
			ActAppDocumentSubject.SetMergeCell((r+vHeaderRows),3,2,1);
		}
	}
	
//	for(var i=0; i<ActAppDocumentSubject.RowCount(); i++) {
//		for(var j=0; j<=ActAppDocumentSubject.LastCol(); j++) {
//			ActAppDocumentSubject.SetCellBackColor(i + ActAppDocumentSubject.HeaderRows(), j, "rgb(255,255,255)");
//		}
//	}
}

function ActAppDocumentSubject_OnBeforeCheck(Row, Col) {
	var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
	var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");
	
	var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
	
	var vPernr = ActAppDocumentSubject.GetCellValue(Row, "Pernr");
	var vActda = ActAppDocumentSubject.GetCellValue(Row, "Actda");
	var vVoltId = ActAppDocumentSubject.GetCellValue(Row, "VoltId");
	
	if(vPernr == "") return;
		
	var r_idx = -1;
	for(var i=0; i<vActionSubjectList.length; i++) {
		if(vPernr == vActionSubjectList[i].Pernr
		   && dateFormat.format(vActda) == dateFormat.format(vActionSubjectList[i].Actda)
		   && vVoltId == vActionSubjectList[i].VoltId) {
			r_idx = i;
			break;
		}
	}
	
	if(r_idx != -1) {
		if(ActAppDocumentSubject.GetCellValue(Row, "Pchk") == 0) {
			mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", true);
		} else {
			mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", false);
		}
	}
}