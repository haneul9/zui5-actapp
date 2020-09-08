jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");
jQuery.sap.require("zui5_hrxx_actapp2.common.Common");

sap.ui.controller("zui5_hrxx_actapp2.ActAppDocument", {

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
	_vIntca : "",
	_oContext : null,
	_vSelectedPersa : "",
	 
	_vSelected_Reqno : "",
	_vSelected_Pernr : "",
	_vSelected_Actda : "",
	_vSelected_Docno : "",
	_vSelected_VoltId : "",
	
	vDisplayControl : [],
	vExcelDownControl : [], 
	_DetailViewPopover : null,
		
	_vListLength : 0,
	BusyDialog : new sap.m.BusyDialog(),
	UploadDialog : null,
	
	oSubjectList : null,
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actapp2.ActAppDocument
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
//				onAfterHide : jQuery.proxy(function (evt) {
//					this.onAfterHide(evt);
//				}, this)
		}); 
	      
	    sap.ui.getCore().getEventBus().subscribe("app", "ResizeWindow", this.onResizeWindow, this);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_actapp2.ActAppDocument
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actapp2.ActAppDocument
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actapp2.ActAppDocument
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
			this._vSelectedPersa = oEvent.data.SelectedPersa;
		}
		
		//Control제어
		var oPageTitle = sap.ui.getCore().byId(this.PAGEID + "_PAGE_TITLE");
		
		var oAdd_Btn = sap.ui.getCore().byId(this.PAGEID + "_Add_Btn");
		var oRequset_Btn = sap.ui.getCore().byId(this.PAGEID + "_REQUEST_BTN");
		var oComplete_Btn = sap.ui.getCore().byId(this.PAGEID + "_COMPLETE_BTN");
		var oAnnounce_Btn = sap.ui.getCore().byId(this.PAGEID + "_ANNOUNCE_BTN");
		
		var modbtn = sap.ui.getCore().byId(this.PAGEID + "_Mod_Btn");
		var delbtn = sap.ui.getCore().byId(this.PAGEID + "_Del_Btn");
		var oUpload_Btn = sap.ui.getCore().byId(this.PAGEID + "_UPLOAD_BTN");
		var oExcel_Btn = sap.ui.getCore().byId(this.PAGEID + "_Excel_Btn");
		
		this._vListLength = 0;
		//신규작성인 경우
		if(this._vStatu == "00") {
			oPageTitle.setText("발령품의서 등록");
			oRequset_Btn.setVisible(false);
			oAdd_Btn.setVisible(false);
			modbtn.setVisible(false);
			oUpload_Btn.setVisible(false);
			oAnnounce_Btn.setVisible(false);
			delbtn.setVisible(false);
			oComplete_Btn.setVisible(false);
			oExcel_Btn.setVisible(false);
		} else if(this._vStatu == "10") {
			var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
			
			var vPostc = mActionReqList.getProperty(this._oContext + "/Postc");
			
			oPageTitle.setText("발령품의서 수정");
			
			oAnnounce_Btn.setVisible(true);
			oAnnounce_Btn.addCustomData(new sap.ui.core.CustomData({key : "Postc", value : vPostc}));
			if(vPostc == "X") {
				oAnnounce_Btn.setText("발령게시취소");
			} else {
				oAnnounce_Btn.setText("발령게시");
			}
			
			oAdd_Btn.setVisible(true);
		}
	},
	
	onAfterShow: function(oEvent) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var oController = this;
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var dataProcess = function() {	
			
			var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
			var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");
			var oReqno = sap.ui.getCore().byId(oController.PAGEID + "_Reqno");
			var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_Title");
			var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
//			var oReqda = sap.ui.getCore().byId(oController.PAGEID + "_Reqda");
			var oNotes = sap.ui.getCore().byId(oController.PAGEID + "_Notes");
			
			var oPersaModel = sap.ui.getCore().getModel("PersaModel");
			var vPersaData = oPersaModel.getProperty("/PersAreaListSet");
			
			//신규작성인 경우
			if(oController._vStatu == "00") {
				oPersa.removeAllItems();
				oOrgeh.removeAllItems();
				
				var vFirstReqno = "";
				var vFirstOrgeh = "";
				
				if(vPersaData) {
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
				}
					
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
			} else if(oController._vStatu == "10") { //작성중인 경우
				var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
				
				oPersa.removeAllItems();
				oOrgeh.removeAllItems();
				
				var vFirstPersa = mActionReqList.getProperty(oController._oContext + "/Persa");
				var vFirstReqno = mActionReqList.getProperty(oController._oContext + "/Reqno");
				var vFirstOrgeh = mActionReqList.getProperty(oController._oContext + "/Orgeh");
				var vFirstReqdp = mActionReqList.getProperty(oController._oContext + "/Reqdp");
				
				vPostc = mActionReqList.getProperty(oController._oContext + "/Postc");
				
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
//				oReqda.setValueState(sap.ui.core.ValueState.None);
				
				oNotes.setValue(mActionReqList.getProperty(oController._oContext + "/Notes"));
				
				oActda.setValue(dateFormat.format(mActionReqList.getProperty(oController._oContext + "/Actda")));
//				if(mActionReqList.getProperty(oController._oContext + "/Reqda") != null)
//					oReqda.setValue(dateFormat.format(mActionReqList.getProperty(oController._oContext + "/Reqda")));
//				else
//					oReqda.setValue(dateFormat.format(new Date()));
				oPersa.setEnabled(false);
				oOrgeh.setEnabled(false);
				oReqno.setEnabled(true);
				
				oController._vActda = dateFormat.format(mActionReqList.getProperty(oController._oContext + "/Actda"));
			}
			
			zui5_hrxx_actapp2.common.Common.onAfterRenderingTable(oController);
			oController.reloadSubjectList(oController);
			
			oController.BusyDialog.close();
		};
		
		oController.BusyDialog.open();
		
		setTimeout(dataProcess, 300);
	},
	
//	onAfterHide : function(oEvent) {
//		if(typeof ActAppDocumentSubject == "object") {
//			ActAppDocumentSubject.Reset();
//		}
//	}, 
	
	reloadSubjectList : function(oController) {
		
//		oController.setSubjectListColumn(oController);
		zui5_hrxx_actapp2.common.Common.setSubjectListColumn(oController);
		
		var modbtn = sap.ui.getCore().byId(oController.PAGEID + "_Mod_Btn");
		var delbtn = sap.ui.getCore().byId(oController.PAGEID + "_Del_Btn");
		var oRequset_Btn = sap.ui.getCore().byId(oController.PAGEID + "_REQUEST_BTN");
		var oComplete_Btn = sap.ui.getCore().byId(oController.PAGEID + "_COMPLETE_BTN");
//		var oAnnounce_Btn = sap.ui.getCore().byId(oController.PAGEID + "_ANNOUNCE_BTN");
		var oUpload_Btn = sap.ui.getCore().byId(oController.PAGEID + "_UPLOAD_BTN");
		var oExcel_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Excel_Btn");
		
		if(oController._vListLength > 0) {				
			modbtn.setVisible(true);
			delbtn.setVisible(true);
			oRequset_Btn.setVisible(true);
			oComplete_Btn.setVisible(true);
//			oAnnounce_Btn.setVisible(true);
			oUpload_Btn.setVisible(true);
			oExcel_Btn.setVisible(true);
		} else {
			modbtn.setVisible(false);
			delbtn.setVisible(false);
			oRequset_Btn.setVisible(false);
			oComplete_Btn.setVisible(false);
//			oAnnounce_Btn.setVisible(false);
			oExcel_Btn.setVisible(false);
			if(oController._vStatu != "00") {
				oUpload_Btn.setVisible(true);
			} else {
				oUpload_Btn.setVisible(false);
			}	
		}
		
		var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
		var vEApprovalYN = mActionReqList.getProperty(oController._oContext + "/Eapprovalyn");
		
		// EApprovalYN 가 X 인 경우에만 결재상신 버튼 활성화
		if(vEApprovalYN != "X") oRequset_Btn.setVisible(false); 
		
//		var oAllCheckbox = sap.ui.getCore().byId(oController.PAGEID + "_All_CheckBox");
//		oAllCheckbox.setChecked(false);
	},
	
	navToBack : function(oEvent){
		sap.ui.getCore().getEventBus().publish("nav", "back", {
		    });		
	},
	 
	addPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp2.ActAppPersonInfo",
		      data : {
		    	 actiontype : "100",
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Molga : oController._vMolga,
		    	 Actda : oController._vActda,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp2.ActAppDocument"
		      }
		});
	},
	
	modifyPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
		var oController = oView.getController();
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vData = mActionSubjectList.getProperty("/ActionSubjectListSet");
		var check_idxs = [];
		if(vData && vData.length) {
			for(var i=0; i<vData.length; i++) {
				if(vData[i].Pchk == true) {
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
		
		if(vData[check_idxs[0]].Cfmyn == "X") {
			sap.m.MessageBox.alert("확정처리된 사용자는 수정할 수 없습니다.");
			return;
		}
		
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
		    	 Molga : oController._vMolga,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp2.ActAppDocument",
		    	 Pernr : vData[check_idxs[0]].Pernr,
		    	 PernrActda : vData[check_idxs[0]].Actda,
		    	 PernrVoltId : "",
		      }
		});		
	},
	
	deletePerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vData = mActionSubjectList.getProperty("/ActionSubjectListSet");
		var check_idxs = [];
		if(vData && vData.length) {
			for(var i=0; i<vData.length; i++) {
				if(vData[i].Pchk == true) {
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
					
					if(vData[check_idxs[i]].Cfmyn == "X") {
						sap.m.MessageBox.alert("확정처리된 사용자는 수정할 수 없습니다.");
						return;
					}
					
					process_result = false;
					var vVoltId = vData[check_idxs[i]].Voltid ;
					if(vData[check_idxs[i]].Voltid == undefined || vData[check_idxs[i]].Voltid == null )  vVoltId = "";
					var oPath = "/ActionSubjectListSet(Docno='" + oController._vDocno + "',"
			                  + "Pernr='" +  vData[check_idxs[i]].Pernr + "',"
			                  + "VoltId='" +  vVoltId + "',"
			                  + "Actda=" +  "datetime%27" + dateFormat.format(new Date(vData[check_idxs[i]].Actda)) + "T00%3a00%3a00%27" + ")";

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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
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
			
			oController._vMolga = vItem.getCustomData()[0].getValue("Molga");
		}
		
	},
	
	onChangeOrgeh : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
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
		
		var oAdd_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Add_Btn");
		var oRequsetDelete_Btn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		var oUpload_Btn = sap.ui.getCore().byId(oController.PAGEID + "_UPLOAD_BTN");
		
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
		var vEapprovalyn = "";
		var updateData = {};
		
		updateData.Persa = oPersa.getSelectedKey();
		updateData.Orgeh = oOrgeh.getSelectedKey();
		updateData.Reqno = oReqno.getValue();
		updateData.Title = oTitle.getValue();
		
		//updateData.Actda = "\/Date(" + new Date(oActda.getValue()).getTime() + ")\/";
		updateData.Actda = "\/Date(" + common.Common.getTime(oActda.getValue()) + ")\/";
		
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
//			oReqda.setValueState(sap.ui.core.ValueState.None);
		}
	},
	
	onPressDelete : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
		var oController = oView.getController();
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");
		var vCfmynCount = 0;
		// 확정이 아닌 지원자의 수를 Count
		if(vActionSubjectList && vActionSubjectList.length) {
			for(var i=0; i<vActionSubjectList.length; i++) {
				if(vActionSubjectList[i].Cfmyn != "X") {
					vCfmynCount++;
				}
			}
		}
		
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
		    	 ActRecCnt : vCfmynCount,
		    	 FromPageId : "zui5_hrxx_actapp2.ActAppDocument"
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
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
				oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionRecDetailView", oController);
			} else {
				oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionDetailView", oController);
			}
			oView.addDependent(oController._DetailViewPopover);
		}
		
		oController._DetailViewPopover.openBy(oControl);
	},
	
	onAfterOpenPopover : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
		var oController = oView.getController();
		
		zui5_hrxx_actapp2.common.Common.onAfterOpenDetailViewPopover(oController);
	},	
	
	onPressRequest : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
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
		    	 FromPageId : "zui5_hrxx_actapp2.ActAppDocument"
		      }
		});		
	},
	
	onResizeWindow : function(oEvent, oEventId, data) {
		$("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 300);
	},
	
	onPressUpload : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp2.ActAppUpload",
		      data : {
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp2.ActAppDocument"
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
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
	
	onPressAnnounce : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
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
		
		var vTitle = "발령게시 확인";
		var vMsg = "발령품의서를 게시하시겠습니까?";
		if(vPostc == "X") {
			vTitle = "발령게시취소 확인";
			vMsg = "발령품의서 게시를 취소하시겠습니까?";
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
			    	 FromPageId : "zui5_hrxx_actapp2.ActAppDocument"
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
				msg = "발령품의서 게시를 취소하였습니다.";
			}
							
			oModel.create(
					"/ActionReqChangeHistorySet", 
					createData, 
					null,
				    function (oData, response) {
						sap.m.MessageBox.alert(msg, {
							title: "안내",
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
	
//	onSelectHeader : function(oEvent){
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
//		var oController = oView.getController();
//		var sKey = oEvent.getParameters().selected;
//		var oListTable = sap.ui.getCore().byId(oController.PAGEID + "_ListTable");
//		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
//		var oJsonData = mActionSubjectList.getProperty("/data");
//		var SubjectListData = {data : []};
//		for(var i = 0 ; i < oJsonData.length ; i++){
//			oJsonData[i].Pchk = sKey;
//			SubjectListData.data.push(oJsonData[i]);
//		}
//		mActionSubjectList.setData(SubjectListData);
//		oListTable.setModel(mActionSubjectList);
//		oListTable.bindRows("/data");
//		
//		
//	},
	
	delRowSpan : function(tableid, rows) {
		$('#' + tableid + '-table').each(function() {
			var table = this;
			$.each(rows, function(c, v) {
				var tds = $('>tbody>tr>td:nth-child(' + v + ')', table).toArray();
				var tds2 = $('>tbody>tr>td:nth-child(' + (v+1) + ')', table).toArray();
				var tds3 = $('>tbody>tr>td:nth-child(' + (v+2) + ')', table).toArray();
	            if(tds.length == 0) return;
				var values = $('>tbody>tr>td:nth-child(' + v + ')>div>span', table).toArray();
	            if(values.length == 0) values = tds; 
	            var i = 0, j = 0;
				for(j = 1; j < tds.length; j ++) {
					$(tds[j]).show();
					$(tds[j]).attr('rowspan', 1);
					$(tds2[j]).show();
					$(tds2[j]).attr('rowspan', 1);
					$(tds3[j]).show();
					$(tds3[j]).attr('rowspan', 1);
				}
			});
		});
	},
	
	doOnCheck : function(rowId, cellInd, state) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
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
	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
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

