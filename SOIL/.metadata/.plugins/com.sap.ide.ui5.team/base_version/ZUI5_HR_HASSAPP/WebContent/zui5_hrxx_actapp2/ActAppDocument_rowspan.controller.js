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
	
	_DetailViewPopover : null,
	
	_TableCellHeight : 70,
	_OtherHeight : 380,
	_vRecordCount : 0,
	
	_vListLength : 0,
	BusyDialog : null,
	UploadDialog : null,
	
	_SubjectJson : new sap.ui.model.json.JSONModel(),
	
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
			delbtn.setVisible(false);
			oComplete_Btn.setVisible(false);
			oExcel_Btn.setVisible(false);
		} else if(this._vStatu == "10") {
			var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
			
			var vPostc = mActionReqList.getProperty(this._oContext + "/Postc");
			
			oPageTitle.setText("발령품의서 수정");
			
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
			var oReqda = sap.ui.getCore().byId(oController.PAGEID + "_Reqda");
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
			
//			$("#ActAppDocument_ListTable-vsb").scroll(function(){
//				console.log("AAAA");
//			})
		};
		
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
		var vData = mActionSubjectList.getProperty("/data");
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
		    	 PernrVoltId : vData[check_idxs[0]].VoltId,
		      }
		});		
	},
	
	deletePerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vData = mActionSubjectList.getProperty("/data");
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
					
					var oPath = "/ActionSubjectListSet(Docno='" + oController._vDocno + "',"
			                  + "Pernr='" +  vData[check_idxs[i]].Pernr + "',"
			                  + "VoltId='" +  vData[check_idxs[i]].VoltId + "',"
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
		var oReqda = sap.ui.getCore().byId(oController.PAGEID + "_Reqda");
		
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
			oReqda.setValueState(sap.ui.core.ValueState.None);
			
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
		
		if(oReqda.getValue() == "") {
			oReqda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert("기안일을 입력바랍니다.");
			return;
		}
		var vEapprovalyn = "";
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
				mActionReqList.setProperty(oController._oContext + "/Eapprovalyn", vEapprovalyn);
			} else {
				var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
				mActionReqList.setProperty(oController._oContext + "/Title", oTitle.getValue());
				mActionReqList.setProperty(oController._oContext + "/Actda", new Date(common.Common.setTime(new Date(oActda.getValue()))));
				mActionReqList.setProperty(oController._oContext + "/Reqda", new Date(common.Common.setTime(new Date(oReqda.getValue()))));
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
		$("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 360);
	},
	
//	onPressAnnounce : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
//		var oController = oView.getController();
//		
//		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
//		
//		var oSrc = oEvent.getSource();
//		var vPostc = "";
//		var oCustomData = oSrc.getCustomData();
//		if(oCustomData && oCustomData.length) {
//			for(var i=0; i<oCustomData.length; i++) {
//				if(oCustomData[i].getKey() == "Postc") {
//					vPostc = oCustomData[i].getValue();
//				}
//			}
//		}
//		
//		var vTitle = "발령게시 확인";
//		var vMsg = "발령품의서를 게시하시겠습니까?";
//		if(vPostc == "X") {
//			vTitle = "발령게시취소 확인";
//			vMsg = "발령품의서 게시를 취소하시겠습니까?";
//		} else {
//			sap.ui.getCore().getEventBus().publish("nav", "to", {
//			      id : "zui5_hrxx_actapp2.ActAppAnnounce",
//			      data : {
//			    	 Persa : oController._vPersa,
//			    	 Statu : oController._vStatu,
//			    	 Reqno : oController._vReqno,
//			    	 Docno : oController._vDocno,
//			    	 Docty : oController._vDocty,
//			    	 Actda : oController._vActda,
//			    	 context : oController._oContext,
//			    	 FromPageId : "zui5_hrxx_actapp2.ActAppDocument"
//			      }
//			});
//			return;
//		}
//		
//		var DataProcess = function() {
//			var createData = {
//					"Docno"  : oController._vDocno,
//					"Persa"  : oController._vPersa, 
//					"Reqno"  : oController._vReqno
//			};
//			
//			var msg = "";
//			if(vPostc == "X") {
//				createData.Reqst = "52";
//				msg = "발령품의서 게시를 취소하였습니다.";
//			}
//							
//			oModel.create(
//					"/ActionReqChangeHistorySet", 
//					createData, 
//					null,
//				    function (oData, response) {
//						sap.m.MessageBox.alert(msg, {
//							title: "안내",
//							onClose : function() {
//								oController.navToBack();
//							}
//						});
//				    },
//				    function (oError) {
//				    	var Err = {};					    	 
//						if (oError.response) {
//							Err = window.JSON.parse(oError.response.body);
//							if(Err.error.innererror.errordetails) {
//								common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
//							} else {
//								common.Common.showErrorMessage(Err.error.message.value);
//							}
//							
//						} else {
//							common.Common.showErrorMessage(oError);
//						}
//				    }
//		    );
//		};
//		
//		sap.m.MessageBox.show(vMsg, {
//			icon: sap.m.MessageBox.Icon.INFORMATION,
//			title: vTitle,
//			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
//	        onClose: function(oAction) { 
//	        	if ( oAction === sap.m.MessageBox.Action.YES ) {
//	        		DataProcess();
//	        	}
//	        }
//		});
//	},
	
//	onAfterRenderingTable : function(oController) {
//		if(typeof ActAppDocumentSubject == "undefined") {
//			var vLang = "";
////			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") != -1) vLang = "";
////			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() != null && 
////					sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() != ""){
////				vLang = sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().substring(0,2);
////			}
////			else vLang = "en";
//			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "ko") vLang = "";
//			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "cs") vLang = "cs";
//			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "de") vLang = "de";
//			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "fr") vLang = "fr";
//			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "pl") vLang = "pl";
//			else vLang = "en";
//			createIBSheet2(document.getElementById(oController.PAGEID + "_SubjectList"), "ActAppDocumentSubject", "100%",  (window.innerHeight - 360) + "px", vLang);
//		}
//		
//		ActAppDocumentSubject.Reset();
//	},
	
	setSubjectListColumn : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var icon1 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Apply.jpg' style='width :15px; height : 15px'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Error.jpg' style='width :15px; height : 15px''>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Lock.jpg' style='width :15px; height : 15px'>";
		
		var icon_retro = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Radiation.jpg' style='width :15px; height : 15px'>";
		
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
		
		var vColumns = [ 
		                 {id : "Pchk", label : "", control : "CheckBox", width : 50, align : "Center"},
		                 {id : "Ename_Html", label : "성명", control : "Html", width : 150, align : "Left"},
		                 {id : "Acttx", label : "발령유형", control : "Text", width : 200, align : "Left"},
		                 {id : "Actda1", label : "발령일", control : "Text", width : 100, align : "Center"},
		                 {id : "Batyp_Html", label : "구분", control : "Html", width : 70, align : "Center"},
//		                 {id : "Pernr", label : "사번", control : "Hidden", width : 70, align : "Center"},
//		                 {id : "Docno", label : "No.", control : "Hidden", width : 70, align : "Center"},
//		                 {id : "Reqno", label : "품의번호", control : "Hidden", width : 70, align : "Center"},
//		                 {id : "Actda", label : "발령일", control : "Hidden1", width : 70, align : "Center"},
//		                 {id : "Ename", label : "성명", control : "Hidden", width : 70, align : "Center"},
//		                 {id : "Batyp", label : "구분", control : "Hidden", width : 70, align : "Center"},
//		                 {id : "VoltId", label : "VoltId", control : "Hidden", width : 70, align : "Center"},
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
		
		var oListTable = sap.ui.getCore().byId(oController.PAGEID + "_ListTable");
		oListTable.removeAllColumns();
		oListTable.destroyColumns();
		
		for(var i=0; i<vColumns.length; i++) {
			
			if(vColumns[i].control == "CheckBox"){
				var oColumn = new sap.ui.table.Column({
					hAlign : "Center",
					flexible : false,
					resizable : false,
		        	vAlign : "Middle",
		        	label : new sap.m.CheckBox({
		        		select : oController.onSelectHeader
		        	}),
		            width :  vColumns[i].width + "px",
		        	template: new sap.m.CheckBox({
						width: vColumns[i].width + "px",
						selected : "{" + vColumns[i].id + "}", 
						textAlign : "Center"
					}).addStyleClass("L2P13Font"),
				});
				oListTable.addColumn(oColumn);
			}else if(vColumns[i].control == "Text"){
				var oColumn =  new sap.ui.table.Column({
					hAlign : "Center",
					flexible : false,
					resizable : false,
		        	vAlign : "Middle",
		        	label : new sap.m.Label({text : vColumns[i].label, textAlign : "Center"}),
		            width : vColumns[i].width + "px",
		        	template: new sap.ui.commons.TextView({
						width:"100%",
						text : "{" + vColumns[i].id + "}",  
						textAlign : "Center"
					}).addStyleClass("L2P13Font"),
				});
				oListTable.addColumn(oColumn);
			}else if(vColumns[i].control == "Html"){
				var oColumn =  new sap.ui.table.Column({
					hAlign : "Center",
					flexible : false,
					resizable : false,
		        	vAlign : "Middle",
		        	label : new sap.m.Label({text : vColumns[i].label, textAlign : "Center"}),
		            width : vColumns[i].width + "px",
		        	template: new sap.ui.core.HTML({content :"{" + vColumns[i].id + "}",	preferDOM : false}),
				});
				oListTable.addColumn(oColumn);
			}
		}
		
		if(oController._vStatu != "00") {
			for(var i=0; i<oController.vDisplayControl.length; i++) {
				var Fieldname = oController.vDisplayControl[i].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				
				var vHeaderText = "";
				if(oController.vDisplayControl[i].Label && oController.vDisplayControl[i].Label != "") {
					vHeaderText = oController.vDisplayControl[i].Label;
				} else {
					vHeaderText = oController.vDisplayControl[i].Label;
				}
				
				var oColumn =  new sap.ui.table.Column({
					hAlign : "Center",
					flexible : false,
					resizable : false,
		        	vAlign : "Left",
		        	label : new sap.m.Label({text : vHeaderText, textAlign : "Center"}),
		            width : "150px",
//		        	template: new sap.ui.core.HTML({content : "{" + TextFieldname + "}",	preferDOM : false}),
		            template: new sap.ui.commons.TextView({
						width:"100%",
						text : "{" + TextFieldname + "}",  
						textAlign : "Center"
					}).addStyleClass("L2P13Font"),
				});
				oListTable.addColumn(oColumn);
//				vTotalWidth += 150;
			}
		}
		
		var SubjectListData = {data : []};
		
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
								oneDataSheet.Ename_Html += "<div class='L2P13Font'>" + dateFormat.format(new Date(oData.results[i].Movda)) + " " + "부서이동" + "</div>";
							}							
							oneDataSheet.Ename_Html += "</td></tr></table>";
							oneDataSheet.Ename = oData.results[i].Ename + " (" + oData.results[i].Pernr + ")";
							
							if(vBatyp == "A") {
								oneDataSheet.Batyp_Html = "<span class='L2P13Font' style='font-weight:bold; color:#1F4E79'>" + "AFTER" + "</span>";
								oneDataSheet.Batyp = "AFTER";
							} else {
								oneDataSheet.Batyp_Html = "<span class='L2P13Font' style='font-weight:bold; color:black'>" + "BEFORE" + "</span>";
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
//									val = "<span style='color:#1F4E79; font-weight:bold' class='L2P13Font'>" + val + "</span>";
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

//		mActionSubjectList.setData(vActionSubjectList);	
		mActionSubjectList.setData(SubjectListData);	
		oListTable.setModel(mActionSubjectList);
		oListTable.bindRows("/data");
		setTimeout(function() {
			oController.autoRowSpan(oController.PAGEID + "_ListTable", [2]);
		}, 300);
		
		oController._vListLength = SubjectListData.data.length;
		
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		
		if(fCompleteCount) {
			if(oDeleteBtn) oDeleteBtn.setVisible(false);
		} else {
			if(oDeleteBtn) oDeleteBtn.setVisible(true);
		}
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
	
	onSelectHeader : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
		var oController = oView.getController();
		var sKey = oEvent.getParameters().selected;
		var oListTable = sap.ui.getCore().byId(oController.PAGEID + "_ListTable");
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var oJsonData = mActionSubjectList.getProperty("/data");
		var SubjectListData = {data : []};
		for(var i = 0 ; i < oJsonData.length ; i++){
			oJsonData[i].Pchk = sKey;
			SubjectListData.data.push(oJsonData[i]);
		}
		mActionSubjectList.setData(SubjectListData);
		oListTable.setModel(mActionSubjectList);
		oListTable.bindRows("/data");
		
		
	},
	
//	autoRowSpan : function(tableid, rows) {
//		console.log("autoRowSpan");
//		$('#' + tableid + '-table').each(function() {
//			var table = this;
//			$.each(rows, function(c, v) {
//				var tds = $('>tbody>tr>td:nth-child(' + v + ')', table).toArray();
//	            if(tds.length == 0) return;
//				var values = $('>tbody>tr>td:nth-child(' + v + ')>div>span', table).toArray();
//	            if(values.length == 0) values = tds; 
//	            var i = 0, j = 0;
//	            
//	            var tmpValues = $('>tbody>tr>td:nth-child(' + 1 + ')>div>span', table).toArray();
//	            if(tmpValues){
//	            	if(tmpValues[0].innerText == tmpValues[1].innerText){
//	            		j = 0;
//	            	}else{
//	            		j = 1;
//	            	}
//	            } 
//	            
//	            
//	            for(; j <  tds.length; ){
//	            	console.log(j);
//	            	$(tds[j+1]).hide();
//            		$(tds[j]).attr('rowspan', 2);
//            		j = j+2;
//			    }
//			});
//		});
//	}
	
//	autoRowSpan : function(tableid, rows) {
//		$('#' + tableid + '-table').each(function() {
//			var table = this;
//			$.each(rows, function(c, v) {
//				var tds = $('>tbody>tr>td:nth-child(' + v + ')', table).toArray();
//				var tds2 = $('>tbody>tr>td:nth-child(' + (v+1) + ')', table).toArray();
//				var tds3 = $('>tbody>tr>td:nth-child(' + (v+2) + ')', table).toArray();
//	            if(tds.length == 0) return;
//				var values = $('>tbody>tr>td:nth-child(' + v + ')>div>span', table).toArray();
//	            if(values.length == 0) values = tds; 
//	            var i = 0, j = 0;
//	            for(j = 1; j < tds.length; j ++) {
//					$(tds[j]).attr('rowspan', 1);
//					$(tds[j]).show();
//					$(tds2[j]).attr('rowspan', 1);
//					$(tds2[j]).show();
//					$(tds3[j]).attr('rowspan', 1);
//					$(tds3[j]).show();
//					
//				}
//				
//				for(j = 1; j < tds.length; j ++) {
//					if(values[i].innerText != values[j].innerText) {
//						$(tds[i]).attr('rowspan', j - i);
//						$(tds2[i]).attr('rowspan', j - i);
//						$(tds3[i]).attr('rowspan', j - i);
//						i = j;
//						continue;
//					}
//					$(tds[j]).hide();
//					$(tds2[j]).hide();
//					$(tds3[j]).hide();
//				}
//				j--;
//				if(values[i].innerText == values[j].innerText) {
//					$(tds[i]).attr('rowspan', j - i + 1);
//					$(tds2[i]).attr('rowspan', j - i + 1);
//					$(tds3[i]).attr('rowspan', j - i + 1);
//				}
//			});
//		});
//	},
	
	autoRowSpan : function(tableid, rows) {
		$('#' + tableid + '-table').each(function() {
			var table = this;
			$.each(rows, function(c, v) {
				var tds = $('>tbody>tr>td:nth-child(' + v + ')', table).toArray();
				var tds2 = $('>tbody>tr>td:nth-child(' + (v+1) + ')', table).toArray();
				var tds3 = $('>tbody>tr>td:nth-child(' + (v+2) + ')', table).toArray();
				var tds4 = $('>tbody>tr>td:nth-child(' + (v-1) + ')', table).toArray();
	            if(tds.length == 0) return;
				var values = $('>tbody>tr>td:nth-child(' + v + ')>div>span', table).toArray();
	            if(values.length == 0) values = tds; 
	            var i = 0, j = 0;
	            for(j = 0; j < tds.length; j ++) {
					$(tds[j]).show();
					$(tds[j]).attr('rowspan', 1);
					$(tds2[j]).show();
					$(tds2[j]).attr('rowspan', 1);
					$(tds3[j]).show();
					$(tds3[j]).attr('rowspan', 1);
					$(tds4[j]).show();
					$(tds4[j]).attr('rowspan', 1);
				}
				
				for(j = 0; j < tds.length; ) {
					if(values[j+1] == undefined || values[j].innerText != values[j+1].innerText) {
						$(tds[j]).attr('rowspan', 1);
						$(tds2[j]).attr('rowspan', 1);
						$(tds3[j]).attr('rowspan', 1);
						$(tds4[j]).attr('rowspan', 1);
						j = j +1 ;
					}else{
						$(tds[j+1]).hide();
						$(tds2[j+1]).hide();
						$(tds3[j+1]).hide();
						$(tds4[j+1]).hide();
						$(tds[j]).attr('rowspan', 2);
						$(tds2[j]).attr('rowspan', 2);
						$(tds3[j]).attr('rowspan', 2);
						$(tds4[j]).attr('rowspan', 2);
						j = j +2 ;
					}
					
				}
			});
		});
	},
	
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
	}
	
});

function onInfoViewPopup(rowId) {
	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocument");
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
			oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionRecDetailView", oController);
		} else {
			oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionDetailView", oController);
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