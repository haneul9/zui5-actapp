jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");
jQuery.sap.require("zui5_hrxx_actapp2.common.Common");

sap.ui.controller("zui5_hrxx_actapp2.ActOrgDocument", {

	PAGEID : "ActOrgDocument",
	ListSelectionType : "Multiple",
	ListSelected : false,
	ListFilter : "",
	
	_vStatu : "",
	_vReqno : "",
	_vDocno : "",
	_vDocty : "",
	_vPersa : "",
	_vActda : "",
	_vMolga : "",
	_vIntca : "",
	_oContext : null,
	_vSelectedPersa : "",
	
	_vSelected_Reqno : "",
	_vSelected_Pernr : "",
	_vSelected_Actda : "",
	_vSelected_Docno : "",
	_vSelected_VoltId : "",
	
	_vDisplayControl : null,
	
	_vListLength : 0, 
	
	_DetailViewPopover : null,
	_SortDialog : null,
	_FilterDialog : null,
	_vInitShow : false,
	
	BusyDialog : new sap.m.BusyDialog(),
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actapp2.ActOrgDocument
*/
	onInit: function() {
//		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
//	      };
	      
	      this.getView().addEventDelegate({
				onBeforeShow : jQuery.proxy(function (evt) {
					this.onBeforeShow(evt);
				}, this),
				onAfterShow  : jQuery.proxy(function (evt) {
					this.onAfterShow(evt);
				}, this),
//				onAfterHide : jQuery.proxy(function (evt) {
//					this.onAfterHide(evt);
//				}, this)
			});  
	      
	      sap.ui.getCore().getEventBus().subscribe("app", "ResizeWindow", this.onResizeWindow, this);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_actapp2.ActOrgDocument
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actapp2.ActOrgDocument
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actapp2.ActOrgDocument
*/
//	onExit: function() {
//
//	}
	onBeforeShow: function(oEvent) {
		
		var oController = this;
		
		this._vInitShow = true;
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		if(oEvent) {
			this._vStatu = oEvent.data.Statu;
			this._vReqno = oEvent.data.Reqno;
			this._vDocno = oEvent.data.Docno;
			this._vDocty = oEvent.data.Docty;
			this._oContext = oEvent.data.context;
			this._vSelectedPersa = oEvent.data.SelectedPersa;
			var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
			var oOrgeh = sap.ui.getCore().byId(this.PAGEID + "_Orgeh");
			var oReqno = sap.ui.getCore().byId(this.PAGEID + "_Reqno");
			var oTitle = sap.ui.getCore().byId(this.PAGEID + "_Title");
			var oActda = sap.ui.getCore().byId(this.PAGEID + "_Actda");
//			var oReqda = sap.ui.getCore().byId(this.PAGEID + "_Reqda");
			var oNotes = sap.ui.getCore().byId(this.PAGEID + "_Notes");
			
			var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
			
			var oPersaModel = sap.ui.getCore().getModel("PersaModel");
			var vPersaData = oPersaModel.getProperty("/PersAreaListSet");
			
			//신규작성인 경우
			if(this._vStatu == "00") {
				oPersa.removeAllItems();
				oOrgeh.removeAllItems();
				
				var vFirstReqno = "";
				var vFirstOrgeh = "";
				
				var s_idx = 0;
				for(var i=0; i<vPersaData.length; i++) {
					oPersa.addItem(
						new sap.ui.core.Item({
							key : vPersaData[i].Persa, 
							text : vPersaData[i].Compatx,
							customData : [{key : "Molga", value : vPersaData[i].Molga}, {key : "Intca", value : vPersaData[i].Intca}]
						})
					);
					
					if(vPersaData[i].Persa == oController._vSelectedPersa) {
						s_idx = i;
					}
				};
				
				oController._vPersa = vPersaData[s_idx].Persa;
				oController._vMolga = vPersaData[s_idx].Molga;
				oController._vIntca = vPersaData[s_idx].Intca;
				oPersa.setSelectedKey(oController._vPersa);
					
				oModel.read("/AppReqDepListSet/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27", 
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
				
				var isExists = false;
				for(var i=0; i<vPersaData.length; i++) {
					oPersa.addItem(
						new sap.ui.core.Item({
							key : vPersaData[i].Persa, 
							text : vPersaData[i].Compatx,
							customData : [{key : "Molga", value : vPersaData[i].Molga}, {key : "Intca", value : vPersaData[i].Intca}]
						})
					);
					
					if(vFirstPersa == vPersaData[i].Persa) {
						oController._vMolga = vPersaData[i].Molga;
						oController._vIntca = vPersaData[i].Intca;
						isExists = true;
					}
				};
				if(isExists == false) {
					sap.m.MessageBox.alert("The action approval without permission.");
					oController.navToBack();
					return;
				}
				oPersa.setSelectedKey(vFirstPersa);
				this._vPersa = vFirstPersa;
					
				oModel.read("/AppReqDepListSet/?$filter=Persa%20eq%20%27" + vFirstPersa + "%27", 
						null, 
						null, 
						false, 
						function(oData, oResponse) {					
							if(oData.results && oData.results.length) {
								for(var i=0; i<oData.results.length; i++) {
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
			
			//Control제어
			var oExt_Btn = sap.ui.getCore().byId(this.PAGEID + "_Ext_Btn");
			var oRequset_Btn = sap.ui.getCore().byId(this.PAGEID + "_REQUEST_BTN");
			var oComplete_Btn = sap.ui.getCore().byId(this.PAGEID + "_COMPLETE_BTN");
			var oRequsetDelete_Btn = sap.ui.getCore().byId(this.PAGEID + "_REQUESTDELETE_BTN");
			var modbtn = sap.ui.getCore().byId(this.PAGEID + "_Mod_Btn");
			var delbtn = sap.ui.getCore().byId(this.PAGEID + "_Del_Btn");
			var sortbtn = sap.ui.getCore().byId(this.PAGEID + "_SORT_BTN");
			var filterbtn = sap.ui.getCore().byId(this.PAGEID + "_FILTER_BTN");
			var oExcel_Btn = sap.ui.getCore().byId(this.PAGEID + "_Excel_Btn");
			//신규작성인 경우
			if(this._vStatu == "00") {				
				oExt_Btn.setVisible(false);
				modbtn.setVisible(false);
				delbtn.setVisible(false);
				sortbtn.setVisible(false);
				filterbtn.setVisible(false);
				oRequset_Btn.setVisible(false);
				oComplete_Btn.setVisible(false);
				oRequsetDelete_Btn.setVisible(false);
				oExcel_Btn.setVisible(false);
			} else if(this._vStatu == "10") {
				oRequsetDelete_Btn.setVisible(true);
			}
		}
	},
	
	onAfterShow: function(oEvent) {	
		zui5_hrxx_actapp2.common.Common.onAfterRenderingTable(this);
		this.reloadSubjectList(this);
	},
	
//	onAfterHide : function(oEvent) {
//		if(typeof ActOrgDocumentSubject == "object") {
//			ActOrgDocumentSubject.Reset();
//		}
//	},
	
	reloadSubjectList : function(oController) {
		
//		oController.setSubjectListColumn(oController);
		zui5_hrxx_actapp2.common.Common.setSubjectListColumn(oController);
		
		var extbtn = sap.ui.getCore().byId(oController.PAGEID + "_Ext_Btn");
		var modbtn = sap.ui.getCore().byId(oController.PAGEID + "_Mod_Btn");
		var delbtn = sap.ui.getCore().byId(oController.PAGEID + "_Del_Btn");
		var sortbtn = sap.ui.getCore().byId(oController.PAGEID + "_SORT_BTN");
		var filterbtn = sap.ui.getCore().byId(oController.PAGEID + "_FILTER_BTN");
		var oExcel_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Excel_Btn");
		var oRequset_Btn = sap.ui.getCore().byId(oController.PAGEID + "_REQUEST_BTN");
		var oComplete_Btn = sap.ui.getCore().byId(this.PAGEID + "_COMPLETE_BTN");
		
		if(oController._vListLength > 0) {				
			extbtn.setVisible(false);
			modbtn.setVisible(true);
			delbtn.setVisible(true);
			sortbtn.setVisible(true);
			filterbtn.setVisible(true);
			oExcel_Btn.setVisible(true);
			oRequset_Btn.setVisible(true);
			oComplete_Btn.setVisible(true);
		} else {
			if(this._vStatu != "00") {
				extbtn.setVisible(true);
			} else {
				extbtn.setVisible(false);
			}
			
			modbtn.setVisible(false);
			delbtn.setVisible(false);
			sortbtn.setVisible(false);
			filterbtn.setVisible(false);
			oExcel_Btn.setVisible(false);
			oRequset_Btn.setVisible(false);
			oComplete_Btn.setVisible(false);
		}
		
		var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
		var vEApprovalYN = mActionReqList.getProperty(oController._oContext + "/Eapprovalyn");
		
		// EApprovalYN 가 X 인 경우에만 결재상신 버튼 활성화
		if(vEApprovalYN != "X") oRequset_Btn.setVisible(false); 
	},
	
	navToBack : function(oEvent){
		sap.ui.getCore().getEventBus().publish("nav", "back", {
		    });		
	},
	 
	extPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
		var oController = oView.getController();
		
		var actionFunction = function() {
			var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			
			var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
			var oReqno = sap.ui.getCore().byId(oController.PAGEID + "_Reqno");
			
			var updateData = {};
			
			//updateData.Actda = "\/Date(" + new Date(oActda.getValue()).getTime() + ")\/";
			updateData.Actda = "\/Date(" + common.Common.getTime(oActda.getValue()) + ")\/";
			updateData.Docno = oController._vDocno;
			updateData.Pernr = "00000000";
			updateData.Reqno = oReqno.getValue();
			updateData.Docty = oController._vDocty;
			updateData.Actty = "E";
			
			oPath = "/ActionSubjectListSet(" + 
						"Actda=datetime'" + dateFormat.format(new Date(oActda.getValue())) + "T00:00:00'," +
						"Docno='" + updateData.Docno + "'," + 
						"VoltId='0000000000'," + 
						"Pernr='" + updateData.Pernr + "')";
			oModel.update(
					oPath, 
					updateData, 
					null,
				    function (oData, response) {
						common.Common.log("Sucess ActionSubjectListSet Update !!!");
						oController.reloadSubjectList(oController);
				    },
				    function (oError) {
				    	var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
						} else {
							common.Common.showErrorMessage(oError);
						}
				    }
		    );
			oController.BusyDialog.close();
		};
		
		var oBusyIndicator = new sap.m.BusyIndicator({
				text : "처리중입니다. 잠시만 기다려 주십시오.",
				customIcon : "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/progress.gif",
				customIconWidth : "50px",
				customIconHeight : "50px"
			});
		
		oController.BusyDialog.open();
		
		setTimeout(actionFunction, 300);
	},
	
	modifyPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
		var oController = oView.getController();
		
		var mActionSubjectListSet = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectListSet = mActionSubjectListSet.getProperty("/ActionSubjectListSet");
		
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
		
		var oModel = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectListSet = oModel.getProperty("/ActionSubjectListSet");
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp2.ActAppPersonInfo",
		      data : {
		    	 actiontype : "200",
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp2.ActOrgDocument",
		    	 Pernr : vActionSubjectListSet[check_idxs[0]].Pernr,
		    	 PernrActda : vActionSubjectListSet[check_idxs[0]].Actda,
		    	 PernrVoltId : vActionSubjectListSet[check_idxs[0]].VoltId,
		      }
		});		
	},
	
	deletePerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var mActionSubjectListSet = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectListSet = mActionSubjectListSet.getProperty("/ActionSubjectListSet");
		
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
		
		var mSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectListSet = mSubjectList.getProperty("/ActionSubjectListSet");
		
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
		var oController = oView.getController();
		
		var oPersa = oEvent.getSource();
		var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");
		var oReqno = sap.ui.getCore().byId(oController.PAGEID + "_Reqno");
		var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_Title");
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
//		var oReqda = sap.ui.getCore().byId(oController.PAGEID + "_Reqda");
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
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
		}
		
	},
	
	onChangeOrgeh : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
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
		
		var oExt_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Ext_Btn");
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
		var vEapprovalyn = "";
		updateData.Persa = oPersa.getSelectedKey();;
		updateData.Orgeh = oOrgeh.getSelectedKey();
		updateData.Reqno = oReqno.getValue();
		updateData.Title = oTitle.getValue();
		
//		updateData.Actda = "\/Date(" + new Date(oActda.getValue()).getTime() + ")\/";
//		updateData.Reqda = "\/Date(" + new Date(oReqda.getValue()).getTime() + ")\/";
		
		updateData.Actda = "\/Date(" + common.Common.getTime(oActda.getValue()) + ")\/";
//		updateData.Reqda = "\/Date(" + common.Common.getTime(oReqda.getValue()) + ")\/";
	    var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		updateData.Reqda = "\/Date(" + common.Common.getTime(dateFormat.format(curDate)) + ")\/";
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
							vEapprovalyn = oData.Eapprovalyn;
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
				mActionReqList.setProperty(oController._oContext + "/Eapprovalyn", vEapprovalyn);
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
					
					oExt_Btn.setVisible(true);
					oRequsetDelete_Btn.setVisible(true);
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
		var oController = oView.getController();
		
		var onProcessDelete = function(fVal) {
			if(fVal && fVal == "OK") {
				var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
				
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
							      id : "zui5_hrxx_actapp2.ActAppMain",
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp2.ActAppComplete",
		      data : {
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp2.ActOrgDocument"
		      }
		});		
	},
	
	onChangeCheckBox :function(oEvent) {

	},
	
	displayDetailView : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		var oCustomData = oControl.getCustomData();
		
		oController._vSelected_Reqno = null;
		oController._vSelected_Reqno = null;
		oController._vSelected_Actda = null;
		oController._vSelected_Docno = null;
		
		if(oCustomData && oCustomData.length) {
			for(var i=0; i<oCustomData.length; i++) {
				common.Common.log("Data11 : " + oCustomData[i].getKey() + ", " + oCustomData[i].getValue());
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
			oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionDetailView", oController);
			oView.addDependent(oController._DetailViewPopover);
		}
		
		oController._DetailViewPopover.openBy(oControl);
	},
	
	onAfterOpenPopover : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
		var oController = oView.getController();
		
		zui5_hrxx_actapp2.common.Common.onAfterOpenDetailViewPopover(oController);
	},	
	
	onPressRequest : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp2.ActAppRequest",
		      data : {
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp2.ActOrgDocument"
		      }
		});		
	},
	
	onAfterRenderingTable : function(oController) {
		
		if(typeof ActOrgDocumentSubject == "undefined") {
			var vLang = "";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "ko") vLang = "";
			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "cs") vLang = "cs";
			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "de") vLang = "de";
			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "fr") vLang = "fr";
			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "pl") vLang = "pl";
			else vLang = "en";
			createIBSheet2(document.getElementById(oController.PAGEID + "_SubjectList"), "ActOrgDocumentSubject", "100%",  (window.innerHeight - 360) + "px", vLang);
		}
		
		ActOrgDocumentSubject.Reset();
	},
	
	setSubjectListColumn : function(oController) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var icon1 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Apply.png'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Error.png'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Lock.png'>";
		
		var icon_retro = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Radiation.png'>";
		
		oController._vDisplayControl = [];
		try {
			oModel.read("/ActionDisplayFieldSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData.results && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								oController._vDisplayControl.push(oData.results[i]);
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
		                 {id : "Ename_Html", label : "성명", control : "Html", width : 150, align : "Left"},
		                 {id : "Acttx", label : "발령유형", control : "Html", width : 200, align : "Left"},
		                 {id : "Actda1", label : "발령일", control : "Text", width : 100, align : "Center"},
		                 {id : "Batyp_Html", label : "구분", control : "Html", width : 70, align : "Center"},
		                 {id : "Pernr", label : "사번", control : "Hidden", width : 70, align : "Center"},
		                 {id : "Docno", label : "No.", control : "Hidden", width : 70, align : "Center"},
		                 {id : "Reqno", label : "품의번호", control : "Hidden", width : 70, align : "Center"},
		                 {id : "Actda", label : "발령일", control : "Hidden1", width : 70, align : "Center"},
		                 {id : "Ename", label : "성명", control : "Hidden", width : 70, align : "Center"},
		                 {id : "Batyp", label : "구분", control : "Hidden", width : 70, align : "Center"},
		                 {id : "VoltId", label : "VoltId", control : "Hidden", width : 70, align : "Center"},
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
		
		if(typeof ActOrgDocumentSubject == "undefined") {
			var vLang = "";
//			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") != -1) vLang = "";
//			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() != null && 
//					sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() != "") vLang = sap.ui.getCore().getConfiguration().getLanguage().toLowerCase();
//			else vLang = "en";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "ko") vLang = "";
			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "cs") vLang = "cs";
			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "de") vLang = "de";
			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "fr") vLang = "fr";
			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "pl") vLang = "pl";
			else vLang = "en";
			createIBSheet2(document.getElementById(oController.PAGEID + "_SubjectList"), "ActOrgDocumentSubject", "100%",  (window.innerHeight - 360) + "px", vLang);
		}
		
		ActOrgDocumentSubject.Reset();
		
		ActOrgDocumentSubject.SetTheme("DS","ActApp");

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
			for(var i=0; i<oController._vDisplayControl.length; i++) {
				var Fieldname = oController._vDisplayControl[i].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				
				var oneCol = {};
				
				oneCol.Header = oController._vDisplayControl[i].Label;			
				oneCol.Edit = 0;
				oneCol.Type = "Html";
				oneCol.Width = 150;
				oneCol.SaveName = TextFieldname;
				oneCol.Align = "Left";			
				initdata.Cols.push(oneCol);
				
				var oneCol1 = {};				
				oneCol1.Header = oController._vDisplayControl[i].Label;			
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
			IBS_InitSheet(ActOrgDocumentSubject, initdata);
		}catch(ex) {
			console.log(ex);
		}		
		
		if(vTotalWidth < window.innerWidth) {
			//ActOrgDocumentSubject.FitColWidth();
		}			
		ActOrgDocumentSubject.SetSelectionMode(0);
		
		ActOrgDocumentSubject.SetCellFont("FontSize", 0, "Pchk", ActOrgDocumentSubject.HeaderRows(), "vDummy", 13);
		ActOrgDocumentSubject.SetCellFont("FontName", 0, "Pchk", ActOrgDocumentSubject.HeaderRows(), "vDummy", "Malgun Gothic");
		
		ActOrgDocumentSubject.SetHeaderRowHeight(32);
		ActOrgDocumentSubject.SetDataRowHeight(32);
		
		ActOrgDocumentSubject.SetFocusAfterProcess(0);
		
		var SubjectListData = {data : []};
		
		if(oController._vStatu == "00") {	
			ActOrgDocumentSubject.LoadSearchData(SubjectListData);
			return;
		}

		var fCompleteCount = false; 
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = {ActionSubjectListSet : []};
		var oPath = "/ActionSubjectListSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27";
//        		  + "%20and%20Reqno%20eq%20%27" + encodeURI(oController._vReqno) + "%27";
		
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
								oneData.ProcessStatusText = "대기중";
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
								
								for(var j=0; j<oController._vDisplayControl.length; j++) {
									var Fieldname = oController._vDisplayControl[j].Fieldname;
									Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
									var TextFieldname = Fieldname + "_Tx";
									var ChangeFieldname = Fieldname + "C";
									
									eval("oneData.A_" + Fieldname + " = oData.results[i]." + Fieldname + ";");
									eval("oneData.A_" + TextFieldname + " = oData.results[i]." + TextFieldname + ";");
									eval("oneData.A_" + ChangeFieldname + " = oData.results[i]." + ChangeFieldname + ";");
								}
							} else {
								oneData.B_Batyp = oData.results[i].Batyp;
								for(var j=0; j<oController._vDisplayControl.length; j++) {
									var Fieldname = oController._vDisplayControl[j].Fieldname;
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
							
//							if(oneDataSheet.Actda != null) {
//								oneDataSheet.Actda1 = dateFormat.format(new Date(oneDataSheet.Actda));
//							} else {
//								oneDataSheet.Actda1 = "";
//							}
//							
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
							                        + "<div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup6(" + (i+1) + ")'>" + oData.results[i].Ename + "</div>"
							                        + "<div class='L2P13Font'>(" + oData.results[i].Pernr + ")</div>";
							if(oData.results[i].Retro == "X" && oData.results[i].Movda != null) {
								oneDataSheet.Ename_Html += "<div class='L2P13Font'>" + dateFormat.format(new Date(oData.results[i].Movda)) + " " + "부서이동" + "</div>";
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
							
							for(var j=0; j<oController._vDisplayControl.length; j++) {
								var Fieldname = oController._vDisplayControl[j].Fieldname;
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
		
		ActOrgDocumentSubject.LoadSearchData(SubjectListData);
		
		oController._vListLength = SubjectListData.data.length;
		
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		
		if(fCompleteCount) {
			if(oDeleteBtn) oDeleteBtn.setVisible(false);
		} else {
			if(oDeleteBtn) oDeleteBtn.setVisible(true);
		}
	},
	
	onResizeWindow : function(oEvent, oEventId, data) {		
		$("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 360);
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
	
	onPressSort : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
		var oController = oView.getController();	
		
		if(!oController._SortDialog) {
			oController._SortDialog = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionOrgDocumentSort", oController);
			oView.addDependent(oController._SortDialog);
		}
		
		oController._SortDialog.open();	
	},
	
	onPressFilter : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
		var oController = oView.getController();	
		
		if(!oController._FilterDialog) {
			oController._FilterDialog = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionOrgDocumentFilter", oController);
			oView.addDependent(oController._FilterDialog);
		}
		
		oController._FilterDialog.open();
		
		if(oController._vInitShow == true) {
			oController._vInitShow = false;
			
			var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
			var vActionSubjectListSet = mActionSubjectList.getProperty("/ActionSubjectListSet");
			
			for(var i=0; i<oController._vDisplayControl.length; i++) {
				var Fieldname = oController._vDisplayControl[i].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				
				var oFilterItem = sap.ui.getCore().byId(oController.PAGEID + "_AODF_" + TextFieldname);
				oFilterItem.destroyItems();
				var vTmpArray = [];
				for(var j=0; j<vActionSubjectListSet.length; j++) {
					var vFilterVal = eval("vActionSubjectListSet[j].A_" + TextFieldname + ";");
					if(vFilterVal != "") {
						if(vTmpArray.indexOf(vFilterVal) == -1) {
							vTmpArray.push(vFilterVal);
							oFilterItem.addItem(new sap.m.ViewSettingsItem({text : vFilterVal, key : "A_" + TextFieldname}));
						}
						
					}
				}
			}
		}		
	},
	
	onConfirmSortDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
		var oController = oView.getController();
		
		var mParams = oEvent.getParameters();
		
	    if(typeof mParams.sortItem != "undefined") {
	    	var sKey = mParams.sortItem.getKey();
		    var bDescending = mParams.sortDescending;
	    	oController.processSort(oController, sKey, bDescending);
	    }
	},
	
	onConfirmFilterDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
		var oController = oView.getController();
		
		var mParams = oEvent.getParameters();
		
	    //if(typeof mParams.filterItems != "undefined" && mParams.filterItems.length > 0) {
	    	oController.processFilter(oController, mParams.filterItems);
	    //} 
	},
	
	processFilter : function(oController, filterItems) {
		var vKeys = [];
		for(var i=0; i<filterItems.length; i++) {
			vKeys.push(filterItems[i].getKey());
		}
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectListSet = mActionSubjectList.getProperty("/ActionSubjectListSet");
		
		var SubjectListData = {data : []};
	    
	    var icon1 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Apply.png'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Error.png'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Lock.png'>";
		
		var icon_retro = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Radiation.png'>";
		
		var tActionSubjectListSet = [];
		for(var i=0; i<vActionSubjectListSet.length; i++) {
			var equalCnt = 0;
			for(var k=0; k<vKeys.length; k++) {
				var vVal = eval("vActionSubjectListSet[i]." + vKeys[k]);				
				for(var t=0; t<filterItems.length; t++) {
					if(filterItems[t].getKey() == vKeys[k]) {
						if(vVal == filterItems[t].getText()) {
							equalCnt++;
						}
					}
				}
			}
			
			if(equalCnt == filterItems.length) {
				tActionSubjectListSet.push(vActionSubjectListSet[i]);
			}
		}
		
		for(var i=0; i<tActionSubjectListSet.length; i++) {
    		var oneDataSheet = tActionSubjectListSet[i];
			
			if(oneDataSheet.Actda != null) {
				oneDataSheet.Actda1 = dateFormat.format(new Date(oneDataSheet.Actda));
			} else {
				oneDataSheet.Actda1 = "";
			}
			
			var icon_src = "";
			if(tActionSubjectListSet[i].Cfmyn == "X") icon_src = icon1;
			else if(tActionSubjectListSet[i].Cfmyn == "E") icon_src = icon2;
			else if(tActionSubjectListSet[i].Cfmyn == "L") icon_src = icon3;
			else icon_src = "";
			
			if(tActionSubjectListSet[i].Retro == "X" && tActionSubjectListSet[i].Movda != null) {
				icon_src += icon_retro;
			}
			
			oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'>"
			                        + "<tr><td style='border:0px; width:16px'>" + icon_src + "</td>"
			                        + "<td style='padding-left:5px; border:0px'>"
			                        + "<div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup6(" + (i+1) + ")'>" + tActionSubjectListSet[i].Ename + "</div>"
			                        + "<div class='L2P13Font'>(" + tActionSubjectListSet[i].Pernr + ")</div>";
			if(tActionSubjectListSet[i].Retro == "X" && tActionSubjectListSet[i].Movda != null) {
				oneDataSheet.Ename_Html += "<div class='L2P13Font'>" + dateFormat.format(new Date(vActionSubjectListSet[i].Movda)) + " " + "부서이동" + "</div>";
			}							
			oneDataSheet.Ename_Html += "</td></tr></table>";
			
			oneDataSheet.Ename = vActionSubjectListSet[i].Ename + " (" + vActionSubjectListSet[i].Pernr + ")";
			
			oneDataSheet.Batyp_Html = "<span class='L2P13Font' style='font-weight:bold; color:#1F4E79'>AFTER</span>";
			oneDataSheet.Batyp = "AFTER";
			
			for(var j=0; j<oController._vDisplayControl.length; j++) {
				var Fieldname = oController._vDisplayControl[j].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				var ChangeFieldname = Fieldname + "C";
				
				var fChange = eval("tActionSubjectListSet[i].A_" + ChangeFieldname + ";");
				
				var val = eval("tActionSubjectListSet[i].A_" + TextFieldname + ";");
				eval("oneDataSheet." + TextFieldname + "_Hidden" + " = val;");
				if(fChange == "X") {
					val = "<span style='color:#1F4E79; font-weight:bold' class='L2P13Font'>" + val + "</span>";
					eval("oneDataSheet." + TextFieldname + " = val;");	
				} else {
					eval("oneDataSheet." + TextFieldname + " = val;");	
				}
			}
			
			SubjectListData.data.push(oneDataSheet);
			
			var beforeDataSheet = {}; //vActionSubjectListSet[i];
			
			if(tActionSubjectListSet[i].Actda != null) {
				beforeDataSheet.Actda1 = dateFormat.format(new Date(tActionSubjectListSet[i].Actda));
			} else {
				beforeDataSheet.Actda1 = "";
			}
			
			beforeDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'>"
			                        + "<tr><td style='border:0px; width:16px'>" + icon_src + "</td>"
			                        + "<td style='padding-left:5px; border:0px'>"
			                        + "<div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup6(" + (i+1) + ")'>" + vActionSubjectListSet[i].Ename + "</div>"
			                        + "<div class='L2P13Font'>(" + tActionSubjectListSet[i].Pernr + ")</div>";
			if(tActionSubjectListSet[i].Retro == "X" && tActionSubjectListSet[i].Movda != null) {
				beforeDataSheet.Ename_Html += "<div class='L2P13Font'>" + dateFormat.format(new Date(vActionSubjectListSet[i].Movda)) + " " + "부서이동" + "</div>";
			}							
			beforeDataSheet.Ename_Html += "</td></tr></table>";
			
			beforeDataSheet.Ename = vActionSubjectListSet[i].Ename + " (" + vActionSubjectListSet[i].Pernr + ")";
			
			beforeDataSheet.Batyp_Html = "<span class='L2P13Font' style='font-weight:bold; color:black'>BEFORE</span>";
			beforeDataSheet.Batyp = "BEFORE";
			
			for(var j=0; j<oController._vDisplayControl.length; j++) {
				var Fieldname = oController._vDisplayControl[j].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				
				var val = eval("tActionSubjectListSet[i].B_" + TextFieldname + ";");								
				eval("beforeDataSheet." + TextFieldname + " = val;");	
				eval("beforeDataSheet." + TextFieldname + "_Hidden" + " = val;");
			}
			
			SubjectListData.data.push(beforeDataSheet);
    	}
    	ActOrgDocumentSubject.LoadSearchData(SubjectListData);
	},
	
	processSort : function(oController, sKey, bDescending) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectListSet = mActionSubjectList.getProperty("/ActionSubjectListSet");
		
	    console.log("Key : " + sKey);
	    
    	if(bDescending) {
	    	vActionSubjectListSet.sort(function(a, b) {
				var a1 = eval("a." + "A_" + sKey);
				var b1 = eval("b." + "A_" + sKey);
				return a1 < b1 ? 1 : a1 > b1 ? -1 : 0;  
			});
	    } else {
	    	vActionSubjectListSet.sort(function(a, b) {
				var a1 = eval("a." + "A_" + sKey);
				var b1 = eval("b." + "A_" + sKey);
				return a1 < b1 ? -1 : a1 > b1 ? 1 : 0;  
			});
	    }
	    
	    var SubjectListData = {data : []};
	    
	    var icon1 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Apply.png'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Error.png'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Lock.png'>";
		
		var icon_retro = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Radiation.png'>";
	    
	    
    	for(var i=0; i<vActionSubjectListSet.length; i++) {
    		var oneDataSheet = vActionSubjectListSet[i];
			
			if(oneDataSheet.Actda != null) {
				oneDataSheet.Actda1 = dateFormat.format(new Date(oneDataSheet.Actda));
			} else {
				oneDataSheet.Actda1 = "";
			}
			
			var icon_src = "";
			if(vActionSubjectListSet[i].Cfmyn == "X") icon_src = icon1;
			else if(vActionSubjectListSet[i].Cfmyn == "E") icon_src = icon2;
			else if(vActionSubjectListSet[i].Cfmyn == "L") icon_src = icon3;
			else icon_src = "";
			
			if(vActionSubjectListSet[i].Retro == "X" && vActionSubjectListSet[i].Movda != null) {
				icon_src += icon_retro;
			}
			
			oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'>"
			                        + "<tr><td style='border:0px; width:16px'>" + icon_src + "</td>"
			                        + "<td style='padding-left:5px; border:0px'>"
			                        + "<div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup6(" + (i+1) + ")'>" + vActionSubjectListSet[i].Ename + "</div>"
			                        + "<div class='L2P13Font'>(" + vActionSubjectListSet[i].Pernr + ")</div>";
			if(vActionSubjectListSet[i].Retro == "X" && vActionSubjectListSet[i].Movda != null) {
				oneDataSheet.Ename_Html += "<div class='L2P13Font'>" + dateFormat.format(new Date(vActionSubjectListSet[i].Movda)) + " " + "부서이동" + "</div>";
			}							
			oneDataSheet.Ename_Html += "</td></tr></table>";
			oneDataSheet.Ename = vActionSubjectListSet[i].Ename + " (" + vActionSubjectListSet[i].Pernr + ")";
			
			oneDataSheet.Batyp_Html = "<span class='L2P13Font' style='font-weight:bold; color:#1F4E79'>AFTER</span>";
			oneDataSheet.Batyp = "AFTER";
			
			for(var j=0; j<oController._vDisplayControl.length; j++) {
				var Fieldname = oController._vDisplayControl[j].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				var ChangeFieldname = Fieldname + "C";
				
				var fChange = eval("vActionSubjectListSet[i].A_" + ChangeFieldname + ";");
				
				var val = eval("vActionSubjectListSet[i].A_" + TextFieldname + ";");
				eval("oneDataSheet." + TextFieldname + "_Hidden" + " = val;");
				if(fChange == "X") {
					val = "<span style='color:#1F4E79; font-weight:bold' class='L2P13Font'>" + val + "</span>";
					eval("oneDataSheet." + TextFieldname + " = val;");	
				} else {
					eval("oneDataSheet." + TextFieldname + " = val;");	
				}
			}
			
			SubjectListData.data.push(oneDataSheet);
			
			var beforeDataSheet = {}; //vActionSubjectListSet[i];
			
			if(vActionSubjectListSet[i].Actda != null) {
				beforeDataSheet.Actda1 = dateFormat.format(new Date(vActionSubjectListSet[i].Actda));
			} else {
				beforeDataSheet.Actda1 = "";
			}
			
			beforeDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'>"
			                        + "<tr><td style='border:0px; width:16px'>" + icon_src + "</td>"
			                        + "<td style='padding-left:5px; border:0px'>"
			                        + "<div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup6(" + (i+1) + ")'>" + vActionSubjectListSet[i].Ename + "</div>"
			                        + "<div class='L2P13Font'>(" + vActionSubjectListSet[i].Pernr + ")</div>";
			if(vActionSubjectListSet[i].Retro == "X" && vActionSubjectListSet[i].Movda != null) {
				beforeDataSheet.Ename_Html += "<div class='L2P13Font'>" + dateFormat.format(new Date(vActionSubjectListSet[i].Movda)) + " " + "부서이동" + "</div>";
			}							
			beforeDataSheet.Ename_Html += "</td></tr></table>";
			
			beforeDataSheet.Ename = vActionSubjectListSet[i].Ename + " (" + vActionSubjectListSet[i].Pernr + ")";
			
			beforeDataSheet.Batyp_Html = "<span class='L2P13Font' style='font-weight:bold; color:black'>BEFORE</span>";
			beforeDataSheet.Batyp = "BEFORE";
			
			for(var j=0; j<oController._vDisplayControl.length; j++) {
				var Fieldname = oController._vDisplayControl[j].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				
				var val = eval("vActionSubjectListSet[i].B_" + TextFieldname + ";");								
				eval("beforeDataSheet." + TextFieldname + " = val;");	
				eval("beforeDataSheet." + TextFieldname + "_Hidden" + " = val;");
			}
			
			SubjectListData.data.push(beforeDataSheet);
    	}
    	ActOrgDocumentSubject.LoadSearchData(SubjectListData);
	},
	
	downloadExcel : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
		var oController = oView.getController();
		
		var vCols = "Ename|Acttx|Actda1|Batyp|Sub01|Sub02|Sub03|Sub04|Sub05|Sub06|Sub07|Sub08|";
		for(var i=0; i<oController._vDisplayControl.length; i++) {
			var Fieldname = oController._vDisplayControl[i].Fieldname;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			var TextFieldname = Fieldname + "_Tx";
			vCols += TextFieldname + "_Hidden|";
		}
		
		var params = { FileName : "ActionSubject.xls",  SheetName : "Sheet", Merge : 1, HiddenColumn : 0, DownCols : vCols} ;
		if(typeof ActOrgDocumentSubject == "object") {
			ActOrgDocumentSubject.Down2Excel(params);
		}
	},	

	doOnCheck : function(rowId, cellInd, state) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
		var oController = oView.getController();
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");
		var vPernr = "";
		if(oController.oSubjectList) {
			vPernr = oController.oSubjectList.getUserData(rowId, "Pernr");
		}
		if(vPernr == "") return;
		
		var r_idx = -1;
		for(var i=0; i<vActionSubjectList.length; i++) {
			if(vPernr == vActionSubjectList[i].Pernr) {
				r_idx = i;
				break;
			}
		}
		if(r_idx != -1) {
			mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", state);
		}
	},
	
});


function onInfoViewPopup3(rowId) {
var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActOrgDocument");
var oController = oView.getController();

oController._vSelected_Pernr = null;
oController._vSelected_Reqno = null;
oController._vSelected_Actda = null;
oController._vSelected_Docno = null;

if(oController.oSubjectList) {
	oController._vSelected_Pernr = oController.oSubjectList.getUserData(rowId,"Pernr");
	oController._vSelected_Reqno = oController.oSubjectList.getUserData(rowId, "Reqno");
	oController._vSelected_Actda = oController.oSubjectList.getUserData(rowId, "Actda");
	oController._vSelected_Docno = oController.oSubjectList.getUserData(rowId, "Docno");
	oController._vSelected_VoltId = oController.oSubjectList.getUserData(rowId, "VoltId");
}

if(!oController._DetailViewPopover) {
	oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionDetailView", oController);
	oView.addDependent(oController._DetailViewPopover);
}

var oControl = $("#" + oController.PAGEID + "_row_name_" + rowId);
oController._DetailViewPopover.openBy(oControl);

};