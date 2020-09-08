jQuery.sap.require("common.Common");
jQuery.sap.require("sap.m.MessageToast");

jQuery.sap.require("zui5_hrxx_actapp2.common.Common");

sap.ui.controller("zui5_hrxx_actapp2.ActAppComplete", {
	
	PAGEID : "ActAppComplete",
	ListSelectionType : "Multiple",
	ListSelected : true,
	ListFilter : "%20and%20(Cfmyn%20eq%20%27" + "N" + "%27%20or%20Cfmyn%20eq%20%27" + "E" + "%27%20or%20Cfmyn%20eq%20%27" + "L" + "%27)",
	
	_vStatu : "",
	_vPersa : "",
	_vReqno : "",
	_vDocno : "",
	_vDocty : "",
	_vActda : "", 
	_vMolga : "",
	_oContext : null,
	
	_vSelected_Reqno : "",
	_vSelected_Pernr : "",
	_vSelected_Actda : "",
	_vSelected_Docno : "",
	_vSelected_VoltId : "",
	
	_vSucessCnt : 0,
	_vFailCnt : 0,
	_vTotalCnt : 0,
	
	_vSelectedReceiveAuthPersa : "",
	_vSelectedReceiveAuthRcvid : "",
	_vSelectedReceiveAuthMalty : "",
	
	_TableCellHeight : 34,
	_OtherHeight : 160,
	_vRecordCount : 0,
	_vListLength : 0,
	
	_vFromPageId : "",
	_oCompleteProcessDialog : null,
	_oCompleteEMailDialog : null,
	_ReceiveAuthPopover : null,
	
	BusyDialog : null,
	
	_vActiveTabNames : null,
	_vActRecCount : "",

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actapp2.ActAppComplete
*/
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
	    };
	    
	    this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this),
			onAfterHide : jQuery.proxy(function (evt) {
				this.onAfterHide(evt);
			}, this)
		});
	    
	    sap.ui.getCore().getEventBus().subscribe("app", "ResizeWindow", this.onResizeWindow, this);
	    
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_actapp2.ActAppComplete
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actapp2.ActAppComplete
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actapp2.ActAppComplete
*/
//	onExit: function() {
//
//	}
	
	onBeforeShow : function(oEvent) {
		if(oEvent) {
			this._vStatu = oEvent.data.Statu;
			this._vReqno = oEvent.data.Reqno;
			this._vDocno = oEvent.data.Docno;
			this._vDocty = oEvent.data.Docty;
			this._vPersa = oEvent.data.Persa;
			this._vActda = oEvent.data.Actda;
			this._vMolga = oEvent.data.Molga;
			this._oContext = oEvent.data.context;
			this._vActRecCount = oEvent.data.ActRecCount;
			this._vFromPageId = oEvent.data.FromPageId;
		}
		
		this._vListLength = 0;
	},
	
	onAfterShow : function(oEvent) {
		var oController = this;
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		this._vActiveTabNames = [];			
		oModel.read("/HiringFormTabInfoSet?$filter=Molga eq '" + this._vMolga + "'",
			null,
			null,
			false, 	
			function(oData, oResponse) {	
				if(oData && oData.results.length) {
					for(var i=0; i<oData.results.length; i++) {
						oController._vActiveTabNames.push(oData.results[i]);
					}
				};
			},
			function(oResponse) {
				console.log(oResponse);
			}		
		);
		
		this.reloadSubjectList(this);
	},
	
	onAfterHide : function(oEvent) {
		if(typeof ActAppCompleteSubject == "object") {
			ActAppCompleteSubject.Reset();
		}
	},
	
	reloadSubjectList : function(oController, vClose) {
		
		if(oController._vDocty == "20" || oController._vDocty == "50") {
			oController.setRecSubjectListColumn(oController , vClose);
		} else {
			oController.setSubjectListColumn(oController);
		}		
		
		var oCompleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_COMPLETE_BTN");
		if(oController._vListLength > 0) {
			oCompleteBtn.setVisible(true);
		} else {
			oCompleteBtn.setVisible(false);
		}
		
	},
	
	navToBack : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppComplete");
		var oController = oView.getController();
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : oController._vFromPageId,
		      data : {
		    	  context : oController._oContext,
		    	  Statu : oController._vStatu,
		    	  Reqno : oController._vReqno,
		    	  Docno : oController._vDocno,
		    	  Docty : oController._vDocty,
		      }
		});
	},
	
	onPressComplete : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppComplete");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");

		var mSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectListSet = mSubjectList.getProperty("/ActionSubjectListSet");
		

		var oListTable = sap.ui.getCore().byId(oController.PAGEID+"_ListTable");
		var vContext = oListTable.getSelectedIndices();
		
			
		if(vContext.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText("MSG_COMPLETE_TARGET"));
			return;
		}
		
		for(var i=0; i<vActionSubjectListSet.length; i++) {
			mSubjectList.setProperty("/ActionSubjectListSet/" + i + "/ProcessStatus", "");
			mSubjectList.setProperty("/ActionSubjectListSet/" + i + "/ProcessStatusText", "");
			mSubjectList.setProperty("/ActionSubjectListSet/" + i + "/ProcessMsg", "");
		}
		
		for(var i=0; i < vContext.length ; i++){
			var idx = oListTable.getContextByIndex(vContext[i]);
			mSubjectList.setProperty(idx.sPath + "/ProcessStatus", "W");
		}
		
//		for(var i=0; i<vActionSubjectListSet.length; i++) {
//			mSubjectList.setProperty("/ActionSubjectListSet/" + i + "/ProcessStatus", "W");
//			mSubjectList.setProperty("/ActionSubjectListSet/" + i + "/ProcessStatusText", "");
//			mSubjectList.setProperty("/ActionSubjectListSet/" + i + "/ProcessMsg", "");
//		}
		
		oController._vTotalCnt = vContext.length;
		oController._vSucessCnt = 0;
		oController._vFailCnt = 0;
		var idx = 0;
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var vCnfpr = ""; 
		
		var onCompleteAction = function() {
			var d_idx = oListTable.getContextByIndex(vContext[idx]);
			var path = d_idx.sPath;
		    var vOneRecord = oListTable.getModel().getProperty(path);
			
		    
			var createData = {};
			var process_result = false;
			
			createData.Docno = vOneRecord.Docno;
			createData.Docty = vOneRecord.Docty;
			createData.Reqno = vOneRecord.Reqno;
			createData.Persa = vOneRecord.Persa;
			createData.Pernr = vOneRecord.Pernr;
			createData.Actda = vOneRecord.Actda;
			createData.VoltId = vOneRecord.VoltId;
			createData.Actty = "C";
			if(idx == 0) {
				createData.CfmFirst = "X";
			} else {
				createData.CfmFirst = "";
			}
			if(idx == (vContext.length - 1)) {
				createData.CfmLast = "X";
			} else {
				createData.CfmLast = "";
			}
			//var vAuthMsg = "";
			
			if(createData.CfmFirst == "X" || createData.CfmLast == "X") {
				//setTimeout(showMessageToast, 300);
				//vAuthMsg = oBundleText.getText("MSG_ACTAPP_AUTH_ADJUST");
			}
			
			try {
				// 첫레코드 전 호출
				var vAuthData = {};
				if(createData.CfmFirst == "X") {
					vAuthData.Docno = vOneRecord.Docno;
					vAuthData.Actda = vOneRecord.Actda;
					vAuthData.Actty = "B";
					oModel.create(
							"/ActionAuthorizationSet", 
							vAuthData, 
							null,
						    function (oData, response) {
								console.log("Success : Start Authorization");
						    },
						    function (oError) {
						    }
				    );
				}
				
				var oPath = "/ActionSubjectListSet(Docno='" + vOneRecord.Docno + "',"
                          + "Pernr='" +  vOneRecord.Pernr + "',"
                          + "VoltId='" +  vOneRecord.VoltId + "',"
                          + "Actda=" +  "datetime%27" + dateFormat.format( new Date(vOneRecord.Actda)) + "T00%3a00%3a00%27" + ")";
				
				oModel.update(
						oPath, 
						createData, 
						null,
					    function (oData, response) {
							process_result = true;
					    },
					    function (oError) {
					    	var Err = {};
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								var msg1 = Err.error.innererror.errordetails;
								if(msg1 && msg1.length) mSubjectList.setProperty( path + "/ProcessMsg", Err.error.innererror.errordetails[0].message);
								else mSubjectList.setProperty(path + "/ProcessMsg", Err.error.message.value);
							} else {
								mSubjectList.setProperty(path + "/ProcessMsg", oError.toString());
							}
							process_result = false;
					    }
			    );
				
				// 마지막 레코드 전 호출
				if(createData.CfmLast == "X"){
					vAuthData.Docno = vOneRecord.Docno;
					vAuthData.Actda = vOneRecord.Actda;
					vAuthData.Actty = "E";
					oModel.create(
							"/ActionAuthorizationSet", 
							vAuthData, 
							null,
						    function (oData, response) {
								console.log("Success : End Authorization");
						    },
						    function (oError) {
						    }
				    );
				}
			} catch(ex) {
				mSubjectList.setProperty(path + "/ProcessMsg", ex.toString());
				process_result = false;
			}
			
			if(process_result) {
				vCnfpr += oListTable.getContextByIndex(vContext[idx]).Pernr + "|";
				oController._vSucessCnt++;
				mSubjectList.setProperty(path + "/ProcessStatusText", oBundleText.getText("ACTION_COMPLETE_STATUS2"));
				mSubjectList.setProperty(path + "/ProcessStatus", "S");
			} else {
				mSubjectList.setProperty(path + "/ProcessStatusText", oBundleText.getText("ACTION_COMPLETE_STATUS3"));
				mSubjectList.setProperty(path + "/ProcessStatus", "F");
				oController._vFailCnt++;
			}
			
			if((idx+1) < oController._vTotalCnt) {
				var nextItem = oListTable.getContextByIndex(vContext[idx+1]);
				var nextPath = nextItem.sPath;
				mSubjectList.setProperty(nextPath + "/ProcessStatusText", oBundleText.getText("ACTION_COMPLETE_STATUS1"));
				mSubjectList.setProperty(nextPath + "/ProcessStatus", "P");
				setTimeout(onCompleteAction, 300);
				
				var oMessage = sap.ui.getCore().byId(oController.PAGEID + "_CP_MESSAGE");
				var vPer = ((idx+1) * 100) / oController._vTotalCnt;
				oMessage.setPercentValue(vPer);
				oMessage.setDisplayValue((idx+1) + " of " + oController._vTotalCnt);
				
				idx = idx + 1;
			} else {
				var oControl = sap.ui.getCore().byId(oController.PAGEID + "_CP_ConfirmBtn");
				oControl.setEnabled(true);
				
				var oMessage = sap.ui.getCore().byId(oController.PAGEID + "_CP_MESSAGE");
				oMessage.setPercentValue(100.0);
				oMessage.setDisplayValue(oController._vTotalCnt + " of " + oController._vTotalCnt);
				
				var oPath1 = "/ActionMailConfirmPernrSet";
				var vMailCreateData = {};
				vMailCreateData.Docno = oController._vDocno;
				vMailCreateData.Cnfpr = vCnfpr;
				oModel.create(
						oPath1, 
						vMailCreateData, 
						null,
					    function (oData, response) {
							console.log("Sucess ActionMailRecipientListSet Create !!!");
					    },
					    function (oError) {
					    	
					    }
			    );
				
				//모두가 성공하면 메일전송 팝업을 표시한다. 그리고, Process 팝업은 닫는다.
				if(oController._vTotalCnt == oController._vSucessCnt) {
				
					oController.onCPClose();
				}
			}
			
		};
		
		var onProcessing = function(oAction){
			if ( oAction === sap.m.MessageBox.Action.YES ) {
				
				if(!oController._oCompleteProcessDialog) {
					oController._oCompleteProcessDialog = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.CompleteProcessing", oController);
					oView.addDependent(oController._oCompleteProcessDialog);
				}
				
				oController._oCompleteProcessDialog.open();
				
				var oMessage = sap.ui.getCore().byId(oController.PAGEID + "_CP_MESSAGE");
				oMessage.setPercentValue(0.0);
				oMessage.setDisplayValue("");
				
				var oCP_Table = sap.ui.getCore().byId(oController.PAGEID + "_CP_Table");
				var oBinding = oCP_Table.getBinding("items");
				oBinding.filter([new sap.ui.model.Filter("ProcessStatus", sap.ui.model.FilterOperator.NE, "")]);

				var idx = oListTable.getContextByIndex(vContext[0]);
				
				mSubjectList.setProperty(idx.sPath + "/ProcessStatusText", oBundleText.getText("ACTION_COMPLETE_STATUS1"));
				mSubjectList.setProperty(idx.sPath + "/ProcessStatus", "P");
				//mSubjectList.setProperty("/ActionSubjectListSet/0/ProcessMsg", oBundleText.getText("MSG_ACTAPP_AUTH_ADJUST"));
				setTimeout(onCompleteAction, 300);
				
        	}
		};
		
		var vMsg1 = oBundleText.getText("MSG_COMPLETE_TARGET_COUNT");
		var vMsg = vMsg1.replace("%CNT%", vContext.length ) + " " + oBundleText.getText("MSG_COMPLETE_QUESTION");
		
		sap.m.MessageBox.show(vMsg, {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("TITLE_ACTREQ_COMPLETE"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: onProcessing
		});
	},
	
	onCPClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppComplete");
		var oController = oView.getController();
		
		if(oController._oCompleteProcessDialog && oController._oCompleteProcessDialog.isOpen()) {
			oController._oCompleteProcessDialog.close();
		}
		var tMsg1 = oBundleText.getText("MSG_ACTION_COMPLETED1");
		var tMsg2 = tMsg1.replace("%CNT1%", oController._vSucessCnt);
		var msg = tMsg2.replace("%CNT2%", oController._vFailCnt);
		msg += " " + oBundleText.getText("MSG_ACTION_COMPLETED2");
		sap.m.MessageBox.alert(msg, {
			title: oBundleText.getText("INFORMATION"),
			onClose : function() {
//				oController.readDocument(oController);
				if(oController._vTotalCnt == oController._vSucessCnt) {
					oController.navToBack();
				} else {
					oController.reloadSubjectList(oController, "X");
				}
			}
		});
	},
	
//	readDocument : function(oController) {
//		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
//		
//		oModel.read("/ActionReqListSet(Docno='" + oController._vDocno + "')", 
//				null, 
//				null, 
//				false, 
//				function(oData, oResponse) {					
//					if(oData) {
//						oController._vStatu = oData.Statu;
//					}
//				},
//				function(oResponse) {
//					common.Common.log(oResponse);
//				}
//		);
//	},
	
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppComplete");
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
			if(oController._vDocty == "20" || oController._vDocty == "50") {
				oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionRecDetailView", oController);
			} else {
				oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionDetailView", oController);
			}
			oView.addDependent(oController._DetailViewPopover);
		}
		
		oController._DetailViewPopover.openBy(oControl);
	},
	
	onAfterOpenPopover : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppComplete");
		var oController = oView.getController();
		
		if(oController._vDocty == "20" || oController._vDocty == "50") {
			zui5_hrxx_actapp2.common.Common.onAfterOpenRecDetailViewPopover(oController);
		} else {
			zui5_hrxx_actapp2.common.Common.onAfterOpenDetailViewPopover(oController);
		}		
		//zui5_hrxx_actapp2.common.Common.onAfterOpenDetailViewPopover(oController);
	},
	
	//--------------------------------------------------------------
	//fragment.CompleteEMail 에 관련된 Method
	//--------------------------------------------------------------
	deletePerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppComplete");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_CE_Table");
		var vContexts = oTable.getSelectedContexts(true);
		var oJSONModel = oTable.getModel();
		var JSONData = oJSONModel.getProperty("/ActionMailRecipientListSet");
		var vNumbr = 1;
		var vTmp = {ActionMailRecipientListSet : []};
		
		if(JSONData && JSONData.length) {
			if(vContexts && vContexts.length) {
				for(var i = 0; i < JSONData.length; i++) {
					var checkDel = false;
					for(var j = 0; j < vContexts.length; j++) {
						if(JSONData[i].Rcvid == vContexts[j].getProperty("Rcvid")) {
							checkDel = true;
							break;
						}
					}
					if(checkDel) continue;
					
					JSONData[i].Numbr = vNumbr++;
					vTmp.ActionMailRecipientListSet.push(JSONData[i]);
				}
				oJSONModel.setData(vTmp);
			} else {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_WARN_NON_DEL_TARGET"));
				return;
			}
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_WARN_NODATA"));
			return;
		}
	},
	
	onSendMail : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppComplete");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var mActionMailRecipientList = sap.ui.getCore().getModel("ActionMailRecipientList");
		var vActionMailRecipientList = mActionMailRecipientList.getProperty("/ActionMailRecipientListSet");
		var idx = 0;
		var processMsg = "";
		
		var sendmail = function() {
			
			if(idx >= vActionMailRecipientList.length) {
				if(oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}
				
				sap.m.MessageBox.show(processMsg, {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: oBundleText.getText("TITLE_ACTREQ_COMPLETE"),
					actions: [sap.m.MessageBox.Action.CLOSE],
			        onClose: oController.onCEClose
				});
				return;
			}
			
			var createData = {};
			createData.Docno = vActionMailRecipientList[idx].Docno;
			createData.Persa = vActionMailRecipientList[idx].Persa;
			createData.Malty = vActionMailRecipientList[idx].Malty;
			createData.Rcvid = vActionMailRecipientList[idx].Rcvid;
			if(vActionMailRecipientList[idx].Rnoyn == true) {
				createData.Rnoyn = "X";
			} else {
				createData.Rnoyn = "";
			}
			if(vActionMailRecipientList[idx].Pnryn == true) {
				createData.Pnryn = "X";
			} else {
				createData.Pnryn = "";
			}
			if(vActionMailRecipientList[idx].Payyn == true) {
				createData.Payyn = "X";
			} else {
				createData.Payyn = "";
			}
			
			oModel.create(
					"/ActionMailRecipientListSet", 
					createData, 
					null,
				    function (oData, response) {
						if(oData) {
							if(processMsg != "") processMsg += "\n";
	  						if(oData.Type == "S"){
	  							processMsg += "[" + oBundleText.getText("MSG_WARN_SUCCESS") + "] " 
	  							            + oData.Message;
	  						} else {
	  							processMsg += "[" + oBundleText.getText("MSG_WARN_FAIL") + "] " 
	  							            + oData.Message;
	  						}
						}
						process_result = true;
						console.log("Sucess ActionMailRecipientListSet Create !!!");
				    },
				    function (oError) {
				    	var Err = {};
						var ErrMsg = "";
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) ErrMsg = Err.error.innererror.errordetails[0].message;
							else ErrMsg = Err.error.message.value;
						} else {
							ErrMsg = oError.toString();
						}
						
						sap.m.MessageBox.alert(ErrMsg);
						return;
						
						process_result = false;
				    }
		    );
			
			idx++;
			setTimeout(sendmail, 300);
		};
		
		if(!oController.BusyDialog) {			
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SENDMAIL_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SENDMAIL_WAIT")}));
			
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		setTimeout(sendmail, 300);
	},
	
	onCEClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppComplete");
		var oController = oView.getController();
		
		if(oController._oCompleteEMailDialog && oController._oCompleteEMailDialog.isOpen()) {
			oController._oCompleteEMailDialog.close();
		}
	},
	
	onBeforeOpenCompleteEMailDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppComplete");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var mActionMailRecipientList = sap.ui.getCore().getModel("ActionMailRecipientList");
		var vActionMailRecipientList = {ActionMailRecipientListSet : []};
		var oPath = "/ActionMailRecipientListSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27"
		          + "%20and%20Persa%20eq%20%27" + oController._vPersa + "%27"
		          ;
		oModel.read(oPath, 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							var oneData = oData.results[i];
							if(oData.results[i].Rnoyn == "X") oneData.Rnoyn = true;
							else oneData.Rnoyn = false;
							if(oData.results[i].Pnryn == "X") oneData.Pnryn = true;
							else oneData.Pnryn = false;
							if(oData.results[i].Payyn == "X") oneData.Payyn = true;
							else oneData.Payyn = false;
							oneData.Numbr = (i+1);
							vActionMailRecipientList.ActionMailRecipientListSet.push(oneData);
						}
						
					}
				},
				function(oError) {
					console.log(oError);
					oCompleteBtn.setVisible(false);
					var Err = {};
					var ErrMsg = "";
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						var msg1 = Err.error.innererror.errordetails;
						if(msg1 && msg1.length) ErrMsg = Err.error.innererror.errordetails[0].message;
						else ErrMsg = Err.error.message.value;
					} else {
						ErrMsg = oError.toString();
					}
					sap.m.MessageBox.alert(ErrMsg);
					return;
				}
		);
		mActionMailRecipientList.setData(vActionMailRecipientList);
	},
	
	displayReceiveAuth : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppComplete");
		var oController = oView.getController();
		
		var oControl = this;
		
		var oCustomData = oControl.getCustomData();
		if(oCustomData && oCustomData.length) {
			for(var i=0; i<oCustomData.length; i++) {
				if(oCustomData[i].getKey() == "Persa") {
					oController._vSelectedReceiveAuthPersa = oCustomData[i].getValue();
				} else if(oCustomData[i].getKey() == "Rcvid") {
					oController._vSelectedReceiveAuthRcvid = oCustomData[i].getValue();
				} else if(oCustomData[i].getKey() == "Malty") {
					oController._vSelectedReceiveAuthMalty = oCustomData[i].getValue();
				} 
			}
		}
		
		if(!oController._ReceiveAuthPopover) {
			oController._ReceiveAuthPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ReceiveAuthPopover", oController);
			oView.addDependent(oController._ReceiveAuthPopover);
		}
		
		oController._ReceiveAuthPopover.openBy(oControl);
	},
	
	onBeforeOpenPopoverReveiveAuth : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppComplete");
		var oController = oView.getController();
		
		var oList = sap.ui.getCore().byId(oController.PAGEID + "_RA_List");
		var oListItem = sap.ui.getCore().byId(oController.PAGEID + "_RA_ListItem");
		
		var filterString = "?$filter=Persa%20eq%20%27" + (oController._vSelectedReceiveAuthPersa) + "%27";
		filterString += "%20and%20Rcvid%20eq%20%27" + oController._vSelectedReceiveAuthRcvid + "%27";
		
		oList.bindItems("/ActionMailRcvAuthSet/" + filterString, oListItem);
	},
	
	onResizeWindow : function(oEvent, oEventId, data) {
		$("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 140);
	},
	
	setSubjectListColumn : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var icon1 = "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Apply.png'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Error.png'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Lock.png'>";
		
		var icon_retro = "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Radiation.png'>";
		
		var vDisplayControl = [];
		try {
			oModel.read("/ActionDisplayFieldSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData.results && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								vDisplayControl.push(oData.results[i]);
							}
						}
					},
					function(oResponse) {
						console.log(oResponse);
					}
			);
		} catch(ex) {
			console.log(ex);
		}
		
		var vColumns = [ 
//		                 {id : "Pchk", label : "", control : "CheckBox", width : 50, align : "Center"},
		                 {id : "Ename_Html", label : oBundleText.getText("ENAME"), control : "Html", width : 150, align : "Left"},
		                 {id : "Acttx", label : oBundleText.getText("ACTTX"), control : "Text", width : 200, align : "Left"},
		                 {id : "Actda1", label : oBundleText.getText("ACTDA"), control : "Text", width : 100, align : "Center"},
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
			for(var i=0; i< vDisplayControl.length; i++) {
				var Fieldname =vDisplayControl[i].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				
				var vHeaderText = "";
				if( vDisplayControl[i].Label &&vDisplayControl[i].Label != "") {
					vHeaderText =vDisplayControl[i].Label;
				} else {
					vHeaderText = oBundleText.getText( vDisplayControl[i].Fieldname);
				}
				
				var oColumn =  new sap.ui.table.Column({
					hAlign : "Center",
					flexible : false,
					resizable : false,
		        	vAlign : "Left",
		        	label : new sap.m.Label({text : vHeaderText, textAlign : "Center"}),
		            width : "150px",
		            template: new sap.ui.commons.TextView({
						width:"100%",
						text : "{" + TextFieldname + "}",  
						textAlign : "Center"
					}).addStyleClass("L2P13Font"),
				});
				oListTable.addColumn(oColumn);
			}
		}
		
		if(oController._vStatu == "00") {			
			return;
		}

		var fCompleteCount = false; 
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = {ActionSubjectListSet : []};
		var oPath = "/ActionSubjectListSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27";
		
		var SubjectListData = {data : []};
		
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
							if(oData.results[i].Batyp != "A") continue; // After 만 표기
							
							if(oData.results[i].Batyp == "A") {
								oneData = {};
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
								
								for(var j=0; j<vDisplayControl.length; j++) {
									var Fieldname = vDisplayControl[j].Fieldname;
									Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
									var TextFieldname = Fieldname + "_Tx";
									var ChangeFieldname = Fieldname + "C";
									
									eval("oneData.A_" + Fieldname + " = oData.results[i]." + Fieldname + ";");
									eval("oneData.A_" + TextFieldname + " = oData.results[i]." + TextFieldname + ";");
									eval("oneData.A_" + ChangeFieldname + " = oData.results[i]." + ChangeFieldname + ";");
								}
							} else {
								oneData.B_Batyp = oData.results[i].Batyp;
								for(var j=0; j<vDisplayControl.length; j++) {
									var Fieldname = vDisplayControl[j].Fieldname;
									Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
									var TextFieldname = Fieldname + "_Tx";
									var ChangeFieldname = Fieldname + "C";
									
									eval("oneData.B_" + Fieldname + " = oData.results[i]." + Fieldname + ";");
									eval("oneData.B_" + TextFieldname + " = oData.results[i]." + TextFieldname + ";");
									eval("oneData.B_" + ChangeFieldname + " = oData.results[i]." + ChangeFieldname + ";");
								}
//								vActionSubjectList.ActionSubjectListSet.push(oneData);
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
							                        + "<div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup5(" + (i+1) + ")'>" + oData.results[i].Ename + "</div>"
							                        + "<div class='L2P13Font'>(" + oData.results[i].Pernr + ")</div>";
							if(oData.results[i].Retro == "X" && oData.results[i].Movda != null) {
								oneDataSheet.Ename_Html += "<div class='L2P13Font'>" + dateFormat.format(new Date(oData.results[i].Movda)) + " " + oBundleText.getText("MOVE_DEPT") + "</div>";
							}							
							oneDataSheet.Ename_Html += "</td></tr></table>";
							
							if(vBatyp == "A") oneDataSheet.Batyp = "<span class='L2P13Font' style='font-weight:bold; color:#1F4E79'>AFTER</span>";
							else oneDataSheet.Batyp = "<span class='L2P13Font' style='font-weight:bold; color:black'>BEFORE</span>";
							
							for(var j=0; j<vDisplayControl.length; j++) {
								var Fieldname = vDisplayControl[j].Fieldname;
								Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
								var TextFieldname = Fieldname + "_Tx";
								var ChangeFieldname = Fieldname + "C";
								
								var fChange = eval("oData.results[i]." + ChangeFieldname + ";");
								
								var val = eval("oData.results[i]." + TextFieldname + ";");								
								if(vBatyp == "A" && fChange == "X") {
//									val = "<span style='color:#1F4E79; font-weight:bold' class='L2P13Font'>" + val + "</span>";
									eval("oneDataSheet." + TextFieldname + " = val;");	
								} else {
									eval("oneDataSheet." + TextFieldname + " = val;");	
								}
							}
							vActionSubjectList.ActionSubjectListSet.push(oneDataSheet);
//							SubjectListData.data.push(oneDataSheet);
						}
					}
				},
				function(oError) {
					console.log(oError);
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
		oListTable.setModel(mActionSubjectList);
		oListTable.bindRows("/ActionSubjectListSet");
//		setTimeout(function() {
//			oController.autoRowSpan(oController.PAGEID + "_ListTable", [2]);
//		}, 300);
		
		oController._vListLength = vActionSubjectList.ActionSubjectListSet.length;
		
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		
		if(fCompleteCount) {
			if(oDeleteBtn) oDeleteBtn.setVisible(false);
		} else {
			if(oDeleteBtn) oDeleteBtn.setVisible(true);
		}
	},
	
	setRecSubjectListColumn : function(oController, vClose) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var icon1 = "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Apply.png'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Error.png'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Lock.png'>";
		
		var icon4 = "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/check-icon.png";
		
		var vDisplayControl = [];
		try {
			oModel.read("/ActionDisplayFieldSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData.results && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								vDisplayControl.push(oData.results[i]);
							}
						}
					},
					function(oResponse) {
						console.log(oResponse);
					}
			);
		} catch(ex) {
			console.log(ex);
		}
		
		var vColumns = [];
		vColumns.push({id : "Ename_Html", label : oBundleText.getText("ENAME"), control : "Html", width : "150", align: "Left"});
		vColumns.push({id : "Acttx", label : oBundleText.getText("ACTTX"), control : "Text", width : "200", align: "Left"});
		vColumns.push({id : "Actda1", label : oBundleText.getText("ACTDA"), control : "Text", width : "80", align: "Center"});
		
		if(oController._vDocty == "20") {
			for(var i=0; i<oController._vActiveTabNames.length; i++) {
				var vTabId = "Sub" + oController._vActiveTabNames[i].Tabid;
				var vTabLabel = oController._vActiveTabNames[i].Tabtl;
				vColumns.push({id : vTabId + "_Img", data : vTabId, label : vTabLabel, control : "Img", width : "80", align: "Center"});
			}
			vColumns.push({id : "Sub08_Img", data : "Sub08", label : oBundleText.getText("TSUB08"), control : "Img", width : "80", align: "Center"});
		} else {
			for(var i=0; i<1; i++) {
				var vTabId = "Sub" + oController._vActiveTabNames[i].Tabid;
				var vTabLabel = oController._vActiveTabNames[i].Tabtl;
				vColumns.push({id : vTabId + "_Img", data : vTabId, label : vTabLabel, control : "Img", width : "80", align: "Center"});
			}
		}	
		
		
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
			}else if(vColumns[i].control == "Img"){
				var oColumn =  new sap.ui.table.Column({
					hAlign : "Center",
					flexible : false,
					resizable : false,
		        	vAlign : "Middle",
		        	label : new sap.m.Label({text : vColumns[i].label, textAlign : "Center"}),
		            width : vColumns[i].width + "px",
		        	template: new sap.m.Image({
						width: { path : vColumns[i].id , formatter : function(fVal) {
										if (fVal == undefined || fVal == "") {
											return "";
										}else{
											return "16px";
										}
									}},
						height : { path : vColumns[i].id , formatter : function(fVal) {
										if (fVal == undefined || fVal == "") {
											return "";
										}else{
											return "16px";
										}
									}},
						src : { path : vColumns[i].id , formatter : function(fVal) {
							if (fVal == undefined || fVal == "") {
								return "";
							}else{
								return fVal;
							}
						}},   
					}),
				});
				oListTable.addColumn(oColumn);
			}
		}
		
		if(oController._vStatu != "00") {
			for(var i=0; i<vDisplayControl.length; i++) {
				var Fieldname = vDisplayControl[i].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				var vHeaderText = "";
				if(vDisplayControl[i].Label && vDisplayControl[i].Label != "") {
					vHeaderText = vDisplayControl[i].Label;
				} else {
					vHeaderText = oBundleText.getText(vDisplayControl[i].Fieldname);
				}
				
				if(i == vDisplayControl.length - 1){
					var oColumn =  new sap.ui.table.Column({
						hAlign : "Center",
						flexible : false,
						resizable : false,
			        	vAlign : "Left",
			        	label : new sap.m.Label({text : vHeaderText, textAlign : "Center"}),
			            template: new sap.ui.commons.TextView({
							width:"100%",
							text : "{" + TextFieldname + "}",  
							textAlign : "Center"
						}).addStyleClass("L2P13Font"),
					});
					oListTable.addColumn(oColumn);
				}else{
					var oColumn =  new sap.ui.table.Column({
						hAlign : "Center",
						flexible : false,
						resizable : false,
			        	vAlign : "Left",
			        	label : new sap.m.Label({text : vHeaderText, textAlign : "Center"}),
			            width : "150px",
			            template: new sap.ui.commons.TextView({
							width:"100%",
							text : "{" + TextFieldname + "}",  
							textAlign : "Center"
						}).addStyleClass("L2P13Font"),
					});
					oListTable.addColumn(oColumn);
				}
			}
		}
		
		if(oController._vStatu == "00") {			
			return;
		}
	
		var fCompleteCount = false; 
		var vHireActionFlag = ""; // 채용여부 Flag
		if(oController._vDocty == "20") vHireActionFlag = "X";
		var vHireVoltId = ""; // 채용시에는 검증 OData 호출 , 호출 시 Parameter VoltId
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = {ActionSubjectListSet : []};
		var oPath = "/ActionSubjectListSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27";
		
		var SubjectListData = {data : []};
		
		oModel.read(oPath + oController.ListFilter, 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						// 채용이관인 경우 , 채용이관 사번은 범위가 정해져 있음.
						if(oController._vDocty == "20" && 
								parseInt(oData.results[0].Pernr) > 80000000 && 
								parseInt(oData.results[0].Pernr) < 100000000){
							vHireActionFlag = "X";
						}
						
						for(var i=0; i<oData.results.length; i++) {
							if(oData.results[i].Batyp != "A") continue; // After 만 표기
									
							if(oData.results[i].Cfmyn == "X") {
								fCompleteCount = true; 
							}
							// 검증 OData 호출 parameter 설정
							if(vHireActionFlag == "X"){
								if(i == 0) vHireVoltId =  oData.results[i].VoltId;
								else vHireVoltId += "/" + oData.results[i].VoltId;
							}
							var oneData = oData.results[i];
							oneData.ProcessStatus = "W";
							oneData.ProcessStatusText = oBundleText.getText("WAIT_STATUS");
							oneData.ProcessMsg = "";
							
							//Global 일자 관련하여 소스 수정함. 2015.10.19
							var vActda = new Date(oData.results[i].Actda);
							oneData.Actda = new Date(common.Common.setTime(vActda));
							//수정완료

//							vActionSubjectList.ActionSubjectListSet.push(oneData);							
							
							var oneDataSheet = oData.results[i];
							
							//Global 일자 관련하여 소스 수정함. 2015.10.19
							if(oneDataSheet.Actda != null) {
								oneDataSheet.Actda1 = dateFormat.format(new Date(oneDataSheet.Actda));
							} else {
								oneDataSheet.Actda1 = "";
							}
							//수정완료
							
							if(oData.results[i].Cfmyn == "X") oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'>" + icon1 + "</td><td style='padding-left:5px; border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup5(" + (i+1) + ")'>" + oData.results[i].Ename + "</div>";
							else if(oData.results[i].Cfmyn == "E") oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'>" + icon2 + "</td><td style='padding-left:5px; border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup5(" + (i+1) + ")'>" + oData.results[i].Ename + "</div>";
							else if(oData.results[i].Cfmyn == "L") oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'>" + icon3 + "</td><td style='padding-left:5px; border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup5(" + (i+1) + ")'>" + oData.results[i].Ename + "</div>";
							else oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup5(" + (i+1) + ")'>" + oData.results[i].Ename + "&nbsp;&nbsp;&nbsp;</div>";
							
							oneDataSheet.Ename_Html += "<div class='L2P13Font'>(" + oData.results[i].Pernr + ")</div>";
							oneDataSheet.Ename_Html += "</td></tr></table>";
							
							for(var j=0; j<vColumns.length; j++) {
								if(vColumns[j].control == "Img") {
									var val = eval("oData.results[i]." + vColumns[j].data + ";");
									if(parseInt(val) > 0) {
										eval("oneDataSheet." + vColumns[j].id + " = icon4;");
									} else {
										eval("oneDataSheet." + vColumns[j].id + " = '';");
									}
								}	
							}
							
							for(var j=0; j<vDisplayControl.length; j++) {
								var Fieldname = vDisplayControl[j].Fieldname;
								Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
								var TextFieldname = Fieldname + "_Tx";
								
								var val = eval("oData.results[i]." + TextFieldname + ";");	
								eval("oneDataSheet." + TextFieldname + " = val;");
							}
							
//							SubjectListData.data.push(oneDataSheet);
							vActionSubjectList.ActionSubjectListSet.push(oneDataSheet);		
						}
					}
				},
				function(oError) {
					console.log(oError);
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
		oListTable.setModel(mActionSubjectList);
		oListTable.bindRows("/ActionSubjectListSet");
		
		oController._vListLength = vActionSubjectList.ActionSubjectListSet.length;
		
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		
		if(fCompleteCount) {
			if(oDeleteBtn) oDeleteBtn.setVisible(false);
		} else {
			if(oDeleteBtn) oDeleteBtn.setVisible(true);
		}
//		//발령확정 후 msg dialog의 닫기 버튼을 클릭 후에는 msg 출력 안함.
//		if(vClose != "X"){
//			if(vHireActionFlag == "X" && ( vHireVoltId != "" || vActionSubjectList.ActionSubjectListSet.length < 1)){
//				if(vActionSubjectList.ActionSubjectListSet.length < 1 ) vDiffCnt = oController._vActRecCount;
//				// 지원자의 수가 
//				if(vDiffCnt > 0){
//					var vMsg = oBundleText.getText("ACTIONTARGET_CNTMSG");    
//						vMsg = vMsg.replace("%cnt1%", oController._vActRecCount);
//						vMsg = vMsg.replace("%cnt2%", vDiffCnt);
//						vMsg = vMsg.replace("%cnt3%", oController._vActRecCount - vDiffCnt);
//					sap.m.MessageBox.show( vMsg , {
//						icon: sap.m.MessageBox.Icon.INFORMATION,
//					});
//				}
//			}
//		}
	},
	
});

function onInfoViewPopup5(rowId) {
	console.log("onInfoViewPopup5");
	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppComplete");
	var oController = oView.getController();
	
	oController._vSelected_Pernr = null;
	oController._vSelected_Reqno = null;
	oController._vSelected_Actda = null;
	oController._vSelected_Docno = null;
	
	if(typeof ActAppCompleteSubject == "object") {
		oController._vSelected_Pernr = ActAppCompleteSubject.GetCellValue(rowId, "Pernr");
		oController._vSelected_Reqno = ActAppCompleteSubject.GetCellValue(rowId, "Reqno");
		oController._vSelected_Actda = ActAppCompleteSubject.GetCellValue(rowId, "Actda");
		oController._vSelected_Docno = ActAppCompleteSubject.GetCellValue(rowId, "Docno");
		oController._vSelected_VoltId = ActAppCompleteSubject.GetCellValue(rowId, "VoltId");
	}
	
	if(!oController._DetailViewPopover) {
		if(oController._vDocty == "20" || oController._vDocty == "50") {
			oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionRecDetailView", oController);
		} else {
			oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionDetailView", oController);
		}
		oView.addDependent(oController._DetailViewPopover);
	}
	
	var oControl = $("#" + oController.PAGEID + "_row_name_" + rowId);
	oController._DetailViewPopover.openBy(oControl);
	
};

function ActAppCompleteSubject_OnSearchEnd(result) {
	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppComplete");
	var oController = oView.getController();
	
	if(ActAppCompleteSubject.RowCount() > 0) {
		ActAppCompleteSubject.FitSize(1, 1);
	}
	ActAppCompleteSubject.SetExtendLastCol(true);
	
	ActAppCompleteSubject.SetCellFont("FontSize", 0, "Pchk", ActAppCompleteSubject.RowCount() + ActAppCompleteSubject.HeaderRows(), "vDummy", 13);
	ActAppCompleteSubject.SetCellFont("FontName", 0, "Pchk", ActAppCompleteSubject.RowCount() + ActAppCompleteSubject.HeaderRows(), "vDummy", "Malgun Gothic");
	
	if(oController._vDocty != "20" && oController._vDocty != "50") {
		var vHeaderRows = ActAppCompleteSubject.HeaderRows();
		for(var r=0; r<ActAppCompleteSubject.RowCount(); r++) {
			if((r % 2) == 0) {
				ActAppCompleteSubject.SetMergeCell((r+vHeaderRows),0,2,1);
				ActAppCompleteSubject.SetMergeCell((r+vHeaderRows),1,2,1);
				ActAppCompleteSubject.SetMergeCell((r+vHeaderRows),2,2,1);
				ActAppCompleteSubject.SetMergeCell((r+vHeaderRows),3,2,1);
			}
		}
	}
}

function ActAppCompleteSubject_OnBeforeCheck(Row, Col) {
	var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
	var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");
	
	var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
	
	var vPernr = ActAppCompleteSubject.GetCellValue(Row, "Pernr");
	var vActda = ActAppCompleteSubject.GetCellValue(Row, "Actda");
	var vVoltId = ActAppCompleteSubject.GetCellValue(Row, "VoltId");
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
		if(ActAppCompleteSubject.GetCellValue(Row, "Pchk") == 0) {
			mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", true);
		} else {
			mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", false);
		}
	}
}