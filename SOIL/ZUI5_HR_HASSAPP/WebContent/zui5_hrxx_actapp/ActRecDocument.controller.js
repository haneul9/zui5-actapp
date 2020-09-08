jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");
jQuery.sap.require("zui5_hrxx_actapp.common.Common");

sap.ui.controller("zui5_hrxx_actapp.ActRecDocument", {

	PAGEID : "ActRecDocument",
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
	_vIntca : "",
	_oContext : null,
	
	_vSelected_Reqno : "",
	_vSelected_Pernr : "",
	_vSelected_Actda : "",
	_vSelected_Docno : "",
	_vSelected_VoltId : "",
	
	vDisplayControl : [],
	
	_DetailViewPopover : null,
	
	_TableCellHeight : 34,
	_OtherHeight : 380,
	_vRecordCount : 0,
	
	_vListLength : 0,
	
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actapp.ActRecDocument
*/
	onInit: function() {
		//if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
	    //};
	      
	    this.getView().addEventDelegate({
				onBeforeShow : jQuery.proxy(function (evt) {
					//this.onBeforeShow(evt);
				}, this),
				onBeforeHide : jQuery.proxy(function (evt) {
				}, this),
				onBeforeFirstShow : jQuery.proxy(function (evt) {
				}, this),
				onAfterShow  : jQuery.proxy(function (evt) {
					this.onBeforeShow(evt);
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
* @memberOf zui5_hrxx_actapp.ActRecDocument
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actapp.ActRecDocument
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actapp.ActRecDocument
*/
//	onExit: function() {
//
//	}
	onBeforeShow: function(oEvent) {
		
		if(!this.BusyDialog) {
			this.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			this.BusyDialog.addContent(new sap.m.BusyIndicator({text : "로딩중입니다. 잠시만 기다려주십시오."}));
			this.getView().addDependent(this.BusyDialog);
		} else {
			this.BusyDialog.removeAllContent();
			this.BusyDialog.destroyContent();
			this.BusyDialog.addContent(new sap.m.BusyIndicator({text : "로딩중입니다. 잠시만 기다려주십시오."}));
		}
		if(!this.BusyDialog.isOpen()) {
			this.BusyDialog.open();
		}
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		if(oEvent) {
			this._vStatu = oEvent.data.Statu;
			this._vReqno = oEvent.data.Reqno;
			this._vDocno = oEvent.data.Docno;
			this._vDocty = oEvent.data.Docty;
			this._vEntrs = oEvent.data.Entrs;
			this._oContext = oEvent.data.context;
			
			//console.log("ActRecDocument Init Data : " + this._vDocno + ", " + this._vPersa + ", " + this._vReqno + ", " + this._vDocty);
			
			var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
			var oOrgeh = sap.ui.getCore().byId(this.PAGEID + "_Orgeh");
			var oReqno = sap.ui.getCore().byId(this.PAGEID + "_Reqno");
			var oTitle = sap.ui.getCore().byId(this.PAGEID + "_Title");
			var oActda = sap.ui.getCore().byId(this.PAGEID + "_Actda");
//			var oReqda = sap.ui.getCore().byId(this.PAGEID + "_Reqda");
			var oNotes = sap.ui.getCore().byId(this.PAGEID + "_Notes");
			
			var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");			
			
			//신규작성인 경우
			if(this._vStatu == "00") {
				oPersa.removeAllItems();
				oOrgeh.removeAllItems();
				
				var vFirstPersa = "";
				var vFirstReqno = "";
				var vFirstOrgeh = "";
				
				var oPersaModel = sap.ui.getCore().getModel("PersaModel");
				var vPersaData = oPersaModel.getProperty("/PersAreaListSet");
				
				var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
				
				for(var i=0; i<vPersaData.length; i++) {
					oPersa.addItem(
						new sap.ui.core.Item({
							key : vPersaData[i].Persa, 
							text : vPersaData[i].Pbtxt,
							customData : [{key : "Molga", value : vPersaData[i].Molga}, {key : "Intca", value : vPersaData[i].Intca}]
						})
					);
				};
				vFirstPersa = vPersaData[0].Persa;
				oPersa.setSelectedKey(vFirstPersa);
				this._vPersa = vFirstPersa;
				this._vMolga = oPersa.getSelectedItem().getCustomData()[0].getValue("Molga");
				this._vIntca = oPersa.getSelectedItem().getCustomData()[1].getValue("Intca");
					
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
//				oReqda.setValueState(sap.ui.core.ValueState.None);
				
				oActda.setValue(dateFormat.format(new Date()));
//				oReqda.setValue(dateFormat.format(new Date()));
				
				oPersa.setEnabled(true);
				oOrgeh.setEnabled(true);
				oReqno.setEnabled(true);
				
			} else if(this._vStatu == "10") { //작성중인 경우
				var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
				
				oPersa.removeAllItems();
				oOrgeh.removeAllItems();
				
				var vFirstPersa = mActionReqList.getProperty(this._oContext + "/Persa");
				var vFirstReqno = mActionReqList.getProperty(this._oContext + "/Reqno");
				var vFirstOrgeh = mActionReqList.getProperty(this._oContext + "/Orgeh");
				//-------------------------
				var vFirstReqdp = mActionReqList.getProperty(this._oContext + "/Reqdp");
				//-------------------------
				
				var oPersaModel = sap.ui.getCore().getModel("PersaModel");
				var vPersaData = oPersaModel.getProperty("/PersAreaListSet");
				
				var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
				
				for(var i=0; i<vPersaData.length; i++) {
					oPersa.addItem(
						new sap.ui.core.Item({
							key : vPersaData[i].Persa, 
							text : vPersaData[i].Pbtxt,
							customData : [{key : "Molga", value : vPersaData[i].Molga}, {key : "Intca", value : vPersaData[i].Intca}]
						})
					);
				};
				oPersa.setSelectedKey(vFirstPersa);
				this._vPersa = vFirstPersa;
				this._vMolga = oPersa.getSelectedItem().getCustomData()[0].getValue("Molga");
				this._vIntca = oPersa.getSelectedItem().getCustomData()[1].getValue("Intca");
				
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
				
				oTitle.setValue(mActionReqList.getProperty(this._oContext + "/Title"));
				oTitle.setValueState(sap.ui.core.ValueState.None);
				oReqno.setValueState(sap.ui.core.ValueState.None);
				oActda.setValueState(sap.ui.core.ValueState.None);
//				oReqda.setValueState(sap.ui.core.ValueState.None);
				
				oNotes.setValue(mActionReqList.getProperty(this._oContext + "/Notes"));
				oActda.setValue(dateFormat.format(mActionReqList.getProperty(this._oContext + "/Actda")));
//				oReqda.setValue(dateFormat.format(mActionReqList.getProperty(this._oContext + "/Reqda")));
				
				oPersa.setEnabled(false);
				oOrgeh.setEnabled(false);
				oReqno.setEnabled(true);
				
				this._vActda = dateFormat.format(mActionReqList.getProperty(this._oContext + "/Actda"));
			}
			
			this.reloadSubjectList(this);
			
			//Control제어
			var oRequset_Btn = sap.ui.getCore().byId(this.PAGEID + "_REQUEST_BTN");
			var oComplete_Btn = sap.ui.getCore().byId(this.PAGEID + "_COMPLETE_BTN");
			var oRequsetDelete_Btn = sap.ui.getCore().byId(this.PAGEID + "_REQUESTDELETE_BTN");
			var oUpload_Btn = sap.ui.getCore().byId(this.PAGEID + "_UPLOAD_BTN");
			
			var oAdd_Btn = sap.ui.getCore().byId(this.PAGEID + "_Add_Btn");
			var oMod_Btn = sap.ui.getCore().byId(this.PAGEID + "_Mod_Btn");
			var oDel_Btn = sap.ui.getCore().byId(this.PAGEID + "_Del_Btn");
			var oAddRec_Btn = sap.ui.getCore().byId(this.PAGEID + "_Add_Rec_Btn");
			var oModRec_Btn = sap.ui.getCore().byId(this.PAGEID + "_Mod_Rec_Btn");
			var oViewRec_Btn = sap.ui.getCore().byId(this.PAGEID + "_View_Rec_Btn");
			var oExcel_Btn = sap.ui.getCore().byId(this.PAGEID + "_Excel_Btn");

			//신규작성인 경우
			if(this._vStatu == "00") {				
				oAdd_Btn.setVisible(false);
				oMod_Btn.setVisible(false);
				oDel_Btn.setVisible(false);
				oAddRec_Btn.setVisible(false);
				oModRec_Btn.setVisible(false);
				oViewRec_Btn.setVisible(false);
				
				oRequset_Btn.setVisible(false);
				oComplete_Btn.setVisible(false);
				oRequsetDelete_Btn.setVisible(false);
				oUpload_Btn.setVisible(false);
				oExcel_Btn.setVisible(false);
			} else if(this._vStatu == "10") {
				oAddRec_Btn.setVisible(true);

				oRequsetDelete_Btn.setVisible(true);
			}
		}
		
		if(this.BusyDialog && this.BusyDialog.isOpen()) {
			this.BusyDialog.close();
		};
	},
	
	onAfterHide : function(oEvent) {
		if(typeof ActRecDocumentSubject == "object") {
			ActRecDocumentSubject.Reset();
		}
	},
	
	reloadSubjectList : function(oController) {
		
		oController.setRecSubjectListColumn(oController);
		
		var oAdd_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Add_Btn");
		var oMod_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Mod_Btn");
		var oDel_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Del_Btn");
		var oAddRec_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Add_Rec_Btn");
		var oModRec_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Mod_Rec_Btn");
		var oViewRec_Btn = sap.ui.getCore().byId(oController.PAGEID + "_View_Rec_Btn");
		
		var oRequset_Btn = sap.ui.getCore().byId(oController.PAGEID + "_REQUEST_BTN");
		var oComplete_Btn = sap.ui.getCore().byId(oController.PAGEID + "_COMPLETE_BTN");
		var oUpload_Btn = sap.ui.getCore().byId(oController.PAGEID + "_UPLOAD_BTN");
		var oExcel_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Excel_Btn");
		
		if(oController._vListLength > 0) {				
			oAddRec_Btn.setVisible(true);
			oModRec_Btn.setVisible(true);
			oViewRec_Btn.setVisible(true);
			oAdd_Btn.setVisible(true);
			oMod_Btn.setVisible(true);
			oDel_Btn.setVisible(true);
			oExcel_Btn.setVisible(true);
			
			oRequset_Btn.setVisible(true);
			oComplete_Btn.setVisible(true);
			oUpload_Btn.setVisible(false);
		} else {
			oAddRec_Btn.setVisible(true);
			oModRec_Btn.setVisible(false);
			oViewRec_Btn.setVisible(false);
			oAdd_Btn.setVisible(false);
			oMod_Btn.setVisible(false);
			oDel_Btn.setVisible(false);
			
			oExcel_Btn.setVisible(false);
			
			oRequset_Btn.setVisible(false);
			oComplete_Btn.setVisible(false);
			oUpload_Btn.setVisible(true);
		}
	},
	
	navToBack : function(oEvent){
		sap.ui.getCore().getEventBus().publish("nav", "back", {
		    });		
	},
	 
	addPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecDocument");
		var oController = oView.getController();
		
		// 발령등록 대상자 여부 체크 넣어랏....
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp.ActAppPersonInfo",
		      data : {
		    	 actiontype : "300",
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Entrs : oController._vEntrs,
		    	 Actda : oController._vActda,
		    	 Molga : oController._vMolga,
		    	 Intca : oController._vIntca,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp.ActRecDocument"
		      }
		});
	},
	
	modifyPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecDocument");
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
			sap.m.MessageBox.alert("수정대상을 선택해 주십시오.");
			return;
		}
		
		if(check_idxs.length != 1) {
			sap.m.MessageBox.alert("수정은 한명만 가능합니다.");
			return;
		}
		
		if(vActionSubjectListSet[check_idxs[0]].Cfmyn == "X") {
			sap.m.MessageBox.alert("확정처리된 사용자는 수정할 수 없습니다.");
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
		    	 Molga : oController._vMolga,
		    	 Intca : oController._vIntca,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp.ActRecDocument",
		    	 Pernr : vActionSubjectListSet[check_idxs[0]].Pernr,
		    	 PernrActda : vActionSubjectListSet[check_idxs[0]].Actda,
		    	 PernrVoltId : vActionSubjectListSet[check_idxs[0]].VoltId,
		      }
		});		
	},
	
	deletePerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var mSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectListSet = mSubjectList.getProperty("/ActionSubjectListSet");
		
		var check_idxs = [];
		if(vActionSubjectListSet && vActionSubjectListSet.length) {
			for(var i=0; i<vActionSubjectListSet.length; i++) {
				if(vActionSubjectListSet[i].Pchk == true) {
					check_idxs.push(i);
				}
			}
		}
		
		if(check_idxs.length < 1) {
			sap.m.MessageBox.alert("삭제대상을 선택해 주십시오.");
			return;
		}
		
		var onProcessDelete = function(fVal) {
			if(fVal && fVal == "OK") {
				var process_result = false;
				
				for(var i=0; i<check_idxs.length; i++) {
					
					if(vActionSubjectListSet[check_idxs[i]].Cfmyn == "X") {
						sap.m.MessageBox.alert("확정처리된 사용자는 수정할 수 없습니다.");
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
				
				sap.m.MessageBox.alert("삭제하였습니다.", {
					title : "안내",
					onClose : function() {
						oController.reloadSubjectList(oController);
					}
				});	
			}
		};
		
		sap.m.MessageBox.confirm("삭제하시겠습니까?", {
			title : "확인",
			onClose : onProcessDelete
		});
	},
	
	onChangePersa : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecDocument");
		var oController = oView.getController();
		
		var oPersa = oEvent.getSource();
		var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");
		var oReqno = sap.ui.getCore().byId(oController.PAGEID + "_Reqno");
		var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_Title");
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
//		var oReqda = sap.ui.getCore().byId(oController.PAGEID + "_Reqda");
		
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
//			oReqda.setValueState(sap.ui.core.ValueState.None);
			
			oController._vMolga = vItem.getCustomData()[0].getValue("Molga");
			oController._vIntca = vItem.getCustomData()[1].getValue("Intca");
		}
		
	},
	
	onChangeOrgeh : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecDocument");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");
		var oReqno = sap.ui.getCore().byId(oController.PAGEID + "_Reqno");
		var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_Title");
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
//		var oReqda = sap.ui.getCore().byId(oController.PAGEID + "_Reqda");
		var oNotes = sap.ui.getCore().byId(oController.PAGEID + "_Notes");
		
		oReqno.setValueState(sap.ui.core.ValueState.None);
		oTitle.setValueState(sap.ui.core.ValueState.None);
		oActda.setValueState(sap.ui.core.ValueState.None);
//		oReqda.setValueState(sap.ui.core.ValueState.None);
		
		var oAddRec_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Add_Rec_Btn");
		var oUpload_Btn = sap.ui.getCore().byId(oController.PAGEID + "_UPLOAD_BTN");
		
		var oRequsetDelete_Btn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		
		if(oReqno.getValue() == "") {
			oReqno.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert("품의번호를 입력바랍니다.");
			return;
		}
		
		if(oTitle.getValue() == "") {
			oTitle.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert("품의제목을 입력바랍니다.");
			return;
		}
		
		if(oActda.getValue() == "") {
			oActda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert("발령일을 입력바랍니다.");
			return;
		}
		
//		if(oReqda.getValue() == "") {
//			oReqda.setValueState(sap.ui.core.ValueState.Error);
//			sap.m.MessageBox.alert("기안일을 입력바랍니다.");
//			return;
//		}
		
		var updateData = {};
		
		updateData.Persa = oPersa.getSelectedKey();;
		updateData.Orgeh = oOrgeh.getSelectedKey();
		updateData.Reqno = oReqno.getValue();
		updateData.Title = oTitle.getValue();
		
		//updateData.Actda = "\/Date(" + new Date(oActda.getValue()).getTime() + ")\/";
		//updateData.Reqda = "\/Date(" + new Date(oReqda.getValue()).getTime() + ")\/";
		
		updateData.Actda = "\/Date(" + common.Common.getTime(oActda.getValue()) + ")\/";
//		updateData.Reqda = "\/Date(" + common.Common.getTime(oReqda.getValue()) + ")\/";
		
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
							common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
						} else {
							common.Common.showErrorMessage(oError);
						}
						process_result = false;
				    }
		    );
		} else if(oController._vStatu == "10") {
			updateData.Docno = oController._vDocno;
			
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
							common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
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
				
				insertData.Persa = oPersa.getSelectedKey();;
				insertData.Orgeh = oOrgeh.getSelectedKey();
				insertData.Reqno = oReqno.getValue();
				insertData.Title = oTitle.getValue();				
				insertData.Actda = new Date(common.Common.setTime(new Date(oActda.getValue())));
//				insertData.Reqda = new Date(common.Common.setTime(new Date(oReqda.getValue())));			
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
//				mActionReqList.setProperty(oController._oContext + "/Reqda", new Date(common.Common.setTime(new Date(oReqda.getValue()))));
				mActionReqList.setProperty(oController._oContext + "/Notes", oNotes.getValue());
			}
			
			oController._vReqno = oReqno.getValue();
			
			oController._vActda = oActda.getValue();
			sap.m.MessageBox.alert("저장하였습니다.", {
				title: "안내",
				onClose : function() {
					oPersa.setEnabled(false);
					oOrgeh.setEnabled(false);
					oReqno.setEnabled(false);
					
					oTitle.setValueState(sap.ui.core.ValueState.None);
					oReqno.setValueState(sap.ui.core.ValueState.None);
					oActda.setValueState(sap.ui.core.ValueState.None);
//					oReqda.setValueState(sap.ui.core.ValueState.None);
					
					oAddRec_Btn.setVisible(true);
					oRequsetDelete_Btn.setVisible(true);
					
					if(oController._vListLength > 0) {
						oUpload_Btn.setVisible(false);
					} else {
						oUpload_Btn.setVisible(true);
					}
				}
			});
		} else {
			oTitle.setValueState(sap.ui.core.ValueState.None);
			oReqno.setValueState(sap.ui.core.ValueState.None);
			oActda.setValueState(sap.ui.core.ValueState.None);
//			oReqda.setValueState(sap.ui.core.ValueState.None);
		}
	},
	
	onPressDelete : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecDocument");
		var oController = oView.getController();
		
		var onProcessDelete = function(fVal) {
			if(fVal && fVal == "OK") {
				var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
				
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
								common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
							} else {
								common.Common.showErrorMessage(oError);
							}
							process_result = false;
					    }
			    );
				
				if(process_result) {
					sap.m.MessageBox.alert("삭제하였습니다.", {
						title: "안내",
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
		
		sap.m.MessageBox.confirm("삭제하시겠습니까?", {
			title : "확인",
			onClose : onProcessDelete
		});
	},
	
	onPressComplete : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecDocument");
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
		
		/* 오류가 난 사용자도 발령대상 가능하도록 수정함. 
		 * 2015.4.21 강연준 
		 */
//		if(vCfmynCount < 1) {
//			sap.m.MessageBox.alert("발령확정 대상자가 없습니다.");
//			return;
//		}
		
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp.ActAppComplete",
		      data : {
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 Molga : oController._vMolga,
		    	 Intca : oController._vIntca,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp.ActRecDocument"
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecDocument");
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
			oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActionRecDetailView", oController);
			oView.addDependent(oController._DetailViewPopover);
		}
		
		oController._DetailViewPopover.openBy(oControl);
	},
	
	onAfterOpenPopover : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecDocument");
		var oController = oView.getController();
		
		zui5_hrxx_actapp.common.Common.onAfterOpenRecDetailViewPopover(oController);
	},	
	
	onPressRequest : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecDocument");
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
		    	 FromPageId : "zui5_hrxx_actapp.ActRecDocument"
		      }
		});		
	},
	
	onResizeWindow : function(oEvent, oEventId, data) {
		$("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 360);
	},
	
	addRecPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecDocument");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp.ActRecPInfo",
		      data : {
		    	 actiontype : "C",
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 Molga : oController._vMolga,
		    	 Intca : oController._vIntca,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp.ActRecDocument",
		    	 Recno : "",
		    	 VoltId : ""
		      }
		});
	},
	
	modifyRecPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecDocument");
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
			sap.m.MessageBox.alert("수정대상을 선택해 주십시오.");
			return;
		}
		
		if(check_idxs.length != 1) {
			sap.m.MessageBox.alert("수정은 한명만 가능합니다.");
			return;
		}
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp.ActRecPInfo",
		      data : {
		    	 actiontype : "M",
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 Molga : oController._vMolga,
		    	 Intca : oController._vIntca,
		    	 context : oController._oContext,
		    	 Pdata : vActionSubjectListSet[check_idxs[0]],
		    	 FromPageId : "zui5_hrxx_actapp.ActRecDocument",
		    	 Recno : vActionSubjectListSet[check_idxs[0]].Recno,
		    	 VoltId : vActionSubjectListSet[check_idxs[0]].VoltId
		      }
		});		
	},
	
	viewRecPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecDocument");
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
			sap.m.MessageBox.alert("조회대상을 선택해 주십시오.");
			return;
		}
		
		if(check_idxs.length != 1) {
			sap.m.MessageBox.alert("조회는 한명만 가능합니다.");
			return;
		}
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp.ActRecPInfo",
		      data : {
		    	 actiontype : "V",
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 Molga : oController._vMolga,
		    	 Intca : oController._vIntca,
		    	 context : oController._oContext,
		    	 Pdata : vActionSubjectListSet[check_idxs[0]],
		    	 FromPageId : "zui5_hrxx_actapp.ActRecDocument",
		    	 Recno : vActionSubjectListSet[check_idxs[0]].Recno,
		    	 VoltId : vActionSubjectListSet[check_idxs[0]].VoltId
		      }
		});		
	},
	
	onAfterRenderingTable : function(oController) {
		
		if(typeof ActRecDocumentSubject == "undefined") {
			var vLang = "";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") == -1) vLang = "en";
		
			createIBSheet2(document.getElementById(oController.PAGEID + "_SubjectList"), "ActRecDocumentSubject", "100%",  (window.innerHeight - 360) + "px", vLang);
		}
		
		ActRecDocumentSubject.Reset();
	},
	
	setRecSubjectListColumn : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var icon1 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_common/images/Apply.png'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_common/images/Error.png'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/zhrxx_common/images/Lock.png'>";
		
		var icon4 = "/sap/bc/ui5_ui5/sap/zhrxx_common/images/check-icon.png";
		
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
		
		var vColumns = null;
		if(oController._vMolga == "41") {
			vColumns = [ {id : "Pchk", label : "", control : "CheckBox", width : 30, align : "Center"},
		                 {id : "Ename_Html", label : "성명", control : "Html", width : "150", align: "Left"},		//성명
		                 {id : "Acttx", label : "발령유형", control : "Html", width : "200", align: "Left"},		//발령유형
		                 {id : "Actda1", label : "발령일", control : "Text", width : "80", align: "Center"},		//발령일
		                 {id : "Sub01_Img", data : "Sub01", label : "인적", control : "Img", width : "50", align: "Center"},		//인적
		                 {id : "Sub02_Img", data : "Sub02", label : "학력", control : "Img", width : "50", align: "Center"},		//학력
		                 {id : "Sub03_Img", data : "Sub03", label : "경력", control : "Img", width : "50", align: "Center"},		//경력
		                 {id : "Sub04_Img", data : "Sub04", label : "어학", control : "Img", width : "50", align: "Center"},		//어학
		                 {id : "Sub06_Img", data : "Sub06", label : "자격", control : "Img", width : "50", align: "Center"},		//자격
		                 {id : "Sub07_Img", data : "Sub07", label : "병역", control : "Img", width : "50", align: "Center"},		//병역
		                 {id : "Sub08_Img", data : "Sub08", label : "재입사", control : "Img", width : "50", align: "Center"},		//재입사
		                 {id : "Sub01", data : "Sub01", label : "인적", control : "Hidden", width : "50", align: "Center"},		//인적
		                 {id : "Sub02", data : "Sub02", label : "학력", control : "Hidden", width : "50", align: "Center"},		//학력
		                 {id : "Sub03", data : "Sub03", label : "경력", control : "Hidden", width : "50", align: "Center"},		//경력
		                 {id : "Sub04", data : "Sub04", label : "어학", control : "Hidden", width : "50", align: "Center"},		//어학
		                 {id : "Sub06", data : "Sub06", label : "자격", control : "Hidden", width : "50", align: "Center"},		//자격
		                 {id : "Sub07", data : "Sub07", label : "병역", control : "Hidden", width : "50", align: "Center"},		//병역
		                 {id : "Sub08", data : "Sub08", label : "재입사", control : "Hidden", width : "50", align: "Center"},		//재입사
		                 {id : "Actda", label : "발령일", control : "Hidden1", width : "80", align: "Center"},		//발령일
		                 {id : "Ename", label : "성명", control : "Hidden", width : "80", align: "Center"},		//발령일
		                 {id : "VoltId", label : "VoltId", control : "Hidden", width : 70, align : "Center"},
		                ];
		} else {
			vColumns = [ {id : "Pchk", label : "", control : "CheckBox", width : 30, align : "Center"},
		                 {id : "Ename_Html", label : "성명", control : "Html", width : "150", align: "Left"},		//성명
		                 {id : "Acttx", label : "발령유형", control : "Text", width : "200", align: "Left"},		//발령유형
		                 {id : "Actda1", label : "발령일", control : "Text", width : "80", align: "Center"},		//발령일
		                 {id : "Sub01_Img", data : "Sub01", label : "인적", control : "Img", width : "50", align: "Center"},		//인적
		                 {id : "Sub02_Img", data : "Sub02", label : "학력", control : "Img", width : "50", align: "Center"},		//학력
		                 {id : "Sub03_Img", data : "Sub03", label : "경력", control : "Img", width : "50", align: "Center"},		//경력
		                 {id : "Sub04_Img", data : "Sub04", label : "어학", control : "Img", width : "50", align: "Center"},		//어학
		                 {id : "Sub06_Img", data : "Sub06", label : "자격", control : "Img", width : "50", align: "Center"},		//자격
		                 {id : "Sub08_Img", data : "Sub08", label : "재입사", control : "Img", width : "50", align: "Center"},		//재입사
		                 {id : "Sub01", data : "Sub01", label : "인적", control : "Hidden", width : "50", align: "Center"},		//인적
		                 {id : "Sub02", data : "Sub02", label : "학력", control : "Hidden", width : "50", align: "Center"},		//학력
		                 {id : "Sub03", data : "Sub03", label : "경력", control : "Hidden", width : "50", align: "Center"},		//경력
		                 {id : "Sub04", data : "Sub04", label : "어학", control : "Hidden", width : "50", align: "Center"},		//어학
		                 {id : "Sub06", data : "Sub06", label : "자격", control : "Hidden", width : "50", align: "Center"},		//자격
		                 {id : "Sub08", data : "Sub08", label : "재입사", control : "Hidden", width : "50", align: "Center"},		//재입사
		                 {id : "Actda", label : "발령일", control : "Hidden1", width : "80", align: "Center"},		//발령일
		                 {id : "Ename", label : "성명", control : "Hidden", width : "80", align: "Center"},		//발령일
		                 {id : "VoltId", label : "VoltId", control : "Hidden", width : 70, align : "Center"},
		                ];
		}
		vColumns.push({id : "Pernr", label : "사번", control : "Hidden", width : 70, align : "Center"});
		vColumns.push({id : "Docno", label : "No.", control : "Hidden", width : 70, align : "Center"});
		vColumns.push({id : "Reqno", label : "품의번호", control : "Hidden", width : 70, align : "Center"});
//		vColumns.push({id : "Actda1", label : "발령일", control : "Hidden", width : 70, align : "Center"});
		
		if(typeof ActRecDocumentSubject == "undefined") {
			var vLang = "";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") == -1) vLang = "en";
			
			createIBSheet2(document.getElementById(oController.PAGEID + "_SubjectList"), "ActRecDocumentSubject", "100%",  (window.innerHeight - 360) + "px", vLang);
		}
		
		ActRecDocumentSubject.Reset();
		
		ActRecDocumentSubject.SetTheme("DS","ActApp");
		
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
			
			vTotalWidth += vColumns[i].width;
		}
		
		if(oController._vStatu != "00") {
			for(var i=0; i<oController.vDisplayControl.length; i++) {
				var Fieldname = oController.vDisplayControl[i].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				
				var oneCol = {};
				
				oneCol.Header = oController.vDisplayControl[i].Label;			
				oneCol.Edit = 0;
				oneCol.Type = "Html";
				oneCol.Width = 150;
				oneCol.SaveName = TextFieldname;
				oneCol.Align = "Left";			
				initdata.Cols.push(oneCol);
				
				var oneCol1 = {};				
				oneCol1.Header = oController.vDisplayControl[i].Label;			
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
		
		IBS_InitSheet(ActRecDocumentSubject, initdata);
		if(vTotalWidth < window.innerWidth) {
			//ActRecDocumentSubject.FitColWidth();
		}			
		ActRecDocumentSubject.SetSelectionMode(0);
		
		ActRecDocumentSubject.SetCellFont("FontSize", 0, "Pchk", ActRecDocumentSubject.HeaderRows(), "vDummy", 13);
		ActRecDocumentSubject.SetCellFont("FontName", 0, "Pchk", ActRecDocumentSubject.HeaderRows(), "vDummy", "Malgun Gothic");
		
		ActRecDocumentSubject.SetHeaderRowHeight(32);
		ActRecDocumentSubject.SetDataRowHeight(32);
		
		ActRecDocumentSubject.SetFocusAfterProcess(0);
		
		var SubjectListData = {data : []};
		
		if(oController._vStatu == "00") {	
			ActRecDocumentSubject.LoadSearchData(SubjectListData);
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
						for(var i=0; i<oData.results.length; i++) {
							
							if(oData.results[i].Cfmyn == "X") {
								fCompleteCount = true; 
							}
							
							var oneData = oData.results[i];
							oneData.Pchk = oController.ListSelected;
							oneData.ProcessStatus = "W";
							oneData.ProcessStatusText = "대기중";
							oneData.ProcessMsg = "";
							
							//Global 일자 관련하여 소스 수정함. 2015.10.19
							var vActda = new Date(oData.results[i].Actda);
							oneData.Actda = new Date(common.Common.setTime(vActda));
							//수정완료

							vActionSubjectList.ActionSubjectListSet.push(oneData);	
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
		
		var tActionSubjectListSet = [];
		for(var i=0; i<vActionSubjectList.ActionSubjectListSet.length; i++) {
			tActionSubjectListSet.push(vActionSubjectList.ActionSubjectListSet[i]);
		}
		
		if(tActionSubjectListSet.length > 0) {
			for(var i=0; i<tActionSubjectListSet.length; i++) {
				var oneDataSheet = tActionSubjectListSet[i];
				
				//Global 일자 관련하여 소스 수정함. 2015.10.19
//				var vActda = new Date(tActionSubjectListSet[i].Actda);
//				oneDataSheet.Actda = new Date(common.Common.setTime(vActda));							
				
				if(oneDataSheet.Actda != null) {
					oneDataSheet.Actda1 = dateFormat.format(new Date(oneDataSheet.Actda));
				} else {
					oneDataSheet.Actda1 = "";
				}
				//수정완료
				
//				if(oneDataSheet.Actda != null) {
//					oneDataSheet.Actda1 = dateFormat.format(new Date(oneDataSheet.Actda));
//				} else {
//					oneDataSheet.Actda1 = "";
//				}
				
				if(tActionSubjectListSet[i].Cfmyn == "X") oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'>" + icon1 + "</td><td style='padding-left:5px; border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup2(" + (i+1) + ")'>" + tActionSubjectListSet[i].Ename + "</div>";
				else if(tActionSubjectListSet[i].Cfmyn == "E") oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'>" + icon2 + "</td><td style='padding-left:5px; border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup2(" + (i+1) + ")'>" + tActionSubjectListSet[i].Ename + "</div>";
				else if(tActionSubjectListSet[i].Cfmyn == "L") oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'>" + icon3 + "</td><td style='padding-left:5px; border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup2(" + (i+1) + ")'>" + tActionSubjectListSet[i].Ename + "</div>";
				else oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup2(" + (i+1) + ")'>" + tActionSubjectListSet[i].Ename + "&nbsp;&nbsp;&nbsp;</div>";
				oneDataSheet.Ename_Html += "<div class='L2P13Font'>(" + tActionSubjectListSet[i].Pernr + ")</div>";
				oneDataSheet.Ename_Html += "</td></tr></table>";
				
				for(var j=0; j<vColumns.length; j++) {
					if(vColumns[j].control == "Img") {
						var val = eval("tActionSubjectListSet[i]." + vColumns[j].data + ";");
						if(parseInt(val) > 0) {
							eval("oneDataSheet." + vColumns[j].id + " = icon4;");
						} else {
							eval("oneDataSheet." + vColumns[j].id + " = '';");
						}
						eval("oneDataSheet." + vColumns[j].id.substring(0, vColumns[j].id.indexOf("_")) + " = val;");
					}	
				}
				
				for(var j=0; j<oController.vDisplayControl.length; j++) {
					var Fieldname = oController.vDisplayControl[j].Fieldname;
					Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
					var TextFieldname = Fieldname + "_Tx";
					
					var val = eval("tActionSubjectListSet[i]." + TextFieldname + ";");	
					eval("oneDataSheet." + TextFieldname + " = val;");
					eval("oneDataSheet." + TextFieldname + "_Hidden" + " = val;");
				}
				
				SubjectListData.data.push(oneDataSheet);
			}
		}
		
		ActRecDocumentSubject.LoadSearchData(SubjectListData);
		
		oController._vListLength = SubjectListData.data.length;
		
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		
		if(fCompleteCount) {
			if(oDeleteBtn) oDeleteBtn.setVisible(false);
		} else {
			if(oDeleteBtn) oDeleteBtn.setVisible(true);
		}
	},
	
	onPressUpload : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecDocument");
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
			    	 Molga : oController._vMolga,
			    	 Intca : oController._vIntca,
			    	 context : oController._oContext,
			    	 FromPageId : "zui5_hrxx_actapp.ActRecDocument"
		      }
		});		
	},
	
	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert("잘못된 일자형식 입니다.",{
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	},
	
	downloadExcel : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecDocument");
		var oController = oView.getController();
		
		var vCols = "Ename|Acttx|Actda1|Batyp|Sub01|Sub02|Sub03|Sub04|Sub05|Sub06|Sub07|Sub08|";
		for(var i=0; i<oController.vDisplayControl.length; i++) {
			var Fieldname = oController.vDisplayControl[i].Fieldname;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			var TextFieldname = Fieldname + "_Tx";
			vCols += TextFieldname + "_Hidden|";
		}
		
		var params = { FileName : "ActionSubject.xls",  SheetName : "Sheet", Merge : 1, HiddenColumn : 0, DownCols : vCols} ;
		if(typeof ActRecDocumentSubject == "object") {
			ActRecDocumentSubject.Down2Excel(params);
		}
	},
});

var onInfoViewPopup2 = function(rowId) {
	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecDocument");
	var oController = oView.getController();
	
	oController._vSelected_Pernr = null;
	oController._vSelected_Reqno = null;
	oController._vSelected_Actda = null;
	oController._vSelected_Docno = null;
	
	if(typeof ActRecDocumentSubject == "object") {
		oController._vSelected_Pernr = ActRecDocumentSubject.GetCellValue(rowId, "Pernr");
		oController._vSelected_Reqno = ActRecDocumentSubject.GetCellValue(rowId, "Reqno");
		oController._vSelected_Actda = ActRecDocumentSubject.GetCellValue(rowId, "Actda");
		oController._vSelected_Docno = ActRecDocumentSubject.GetCellValue(rowId, "Docno");
		oController._vSelected_VoltId = ActRecDocumentSubject.GetCellValue(rowId, "VoltId");
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

function ActRecDocumentSubject_OnSearchEnd(result) {
	if(ActRecDocumentSubject.RowCount() > 0) {
		ActRecDocumentSubject.FitSize(1, 1);	
		ActRecDocumentSubject.SetColWidth(1, 150);
	}
	ActRecDocumentSubject.SetExtendLastCol(true);
	
	ActRecDocumentSubject.SetCellFont("FontSize", 0, "Pchk", ActRecDocumentSubject.RowCount() + ActRecDocumentSubject.HeaderRows(), "vDummy", 13);
	ActRecDocumentSubject.SetCellFont("FontName", 0, "Pchk", ActRecDocumentSubject.RowCount() + ActRecDocumentSubject.HeaderRows(), "vDummy", "Malgun Gothic");
	
//	for(var i=0; i<ActRecDocumentSubject.RowCount(); i++) {
//		for(var j=0; j<=ActRecDocumentSubject.LastCol(); j++) {
//			ActRecDocumentSubject.SetCellBackColor(i + ActRecDocumentSubject.HeaderRows(), j, "rgb(255,255,255)");
//		}
//	}
}

function ActRecDocumentSubject_OnBeforeCheck(Row, Col) {
	var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
	var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");
	
	var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
	
//	var vPernr = ActRecDocumentSubject.GetCellValue(Row, "Pernr");
//	var vActda = ActRecDocumentSubject.GetCellValue(Row, "Actda");
//	if(vPernr == "") return;
//		
//	var r_idx = -1;
//	for(var i=0; i<vActionSubjectList.length; i++) {
//		if(vPernr == vActionSubjectList[i].Pernr && dateFormat.format(vActda) == dateFormat.format(vActionSubjectList[i].Actda)) {
//			r_idx = i;
//			break;
//		}
//	}
	
	var vPernr = ActRecDocumentSubject.GetCellValue(Row, "Pernr");
	var vActda = ActRecDocumentSubject.GetCellValue(Row, "Actda");
	var vVoltId = ActRecDocumentSubject.GetCellValue(Row, "VoltId");
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
		if(ActRecDocumentSubject.GetCellValue(Row, "Pchk") == 0) {
			mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", true);
		} else {
			mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", false);
		}
	}
}