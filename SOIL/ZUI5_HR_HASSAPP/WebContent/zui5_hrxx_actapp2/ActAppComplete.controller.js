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
	_vMolga : "41",
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
	
	BusyDialog : new sap.m.BusyDialog(),
	
	_vActiveTabNames : null,
	_vActRecCount : "",

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actapp2.ActAppComplete
*/
	onInit: function() {
//		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
//	    };
	    
	    this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this),
//			onAfterHide : jQuery.proxy(function (evt) {
//				this.onAfterHide(evt);
//			}, this)
		});
	    
	    sap.ui.getCore().getEventBus().subscribe("app", "ResizeWindow", this.onResizeWindow, this);
	    
//	    var vTableHeight = window.innerHeight - this._OtherHeight;
//		this._vRecordCount = parseInt(vTableHeight / this._TableCellHeight);
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
//			this._vMolga = oEvent.data.Molga;
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
		zui5_hrxx_actapp2.common.Common.onAfterRenderingTable(this);
		this.reloadSubjectList(this);
	},
	
//	onAfterHide : function(oEvent) {
//		if(typeof ActAppCompleteSubject == "object") {
//			ActAppCompleteSubject.Reset();
//		}
//	},
	
	reloadSubjectList : function(oController, vClose) {
		
		if(oController._vDocty == "20" || oController._vDocty == "50") {
//			oController.setRecSubjectListColumn(oController , vClose);
			zui5_hrxx_actapp2.common.Common.setRecSubjectListColumn(oController);
		} else {
//			oController.setSubjectListColumn(oController);
			zui5_hrxx_actapp2.common.Common.setSubjectListColumn(oController);
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
	
	navToBackComplete : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppComplete");
		var oController = oView.getController();
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp2.ActAppDocumentView",
		      data : {
		    	  context : oController._oContext,
		    	  Statu : oController._vStatu,
		    	  Reqno : oController._vReqno,
		    	  Docno : oController._vDocno,
		    	  Docty : oController._vDocty,
		      }
		});
	},
	
	saveEncryptId : function(oController, Docno) {
		if(!Docno) return;
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		oModel.read("/ActionDesPernrSet?$filter=Docno eq '" + Docno + "'", 
			null, 
			null, 
			true, 
			function(oData, oResponse) {					
				if(oData.results && oData.results.length) {
					var encryptByDES = function(message, key) {
					    var keyHex = CryptoJS.enc.Utf8.parse(key);
					    var ivHex = CryptoJS.enc.Utf8.parse(key);

					    var encrypted = CryptoJS.TripleDES.encrypt(message, keyHex, {
					    	iv: ivHex,
					        mode: CryptoJS.mode.CBC,
					        padding: CryptoJS.pad.Pkcs7
					    });

					    return encrypted.ciphertext.toString();
					}
					
					for(var i=0; i<oData.results.length; i++) {
						if(oData.results[i].Newps != "X") continue;
						var oneData = {};
						oneData.Pernr = oData.results[i].Pernr;
						oneData.Usrid = oData.results[i].Usrid;
						oneData.EncTdes = encryptByDES(oneData.Usrid, "LSeWPwork!              ");
						oModel.create(
								"/ActionDesPernrSet", 
								oneData, 
								null,
							    function (oData, response) {
									console.log(i, oData);
								},
							    function (oError) {}
					    );
					}
				}
			},
			function(oResponse) {
				common.Common.log(oResponse);
			}
		);		
	},
	
	onPressComplete : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppComplete");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");

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
			sap.m.MessageBox.alert("발령확정 대상을 선택해 주십시오.");
			return;
		}
		
		for(var i=0; i<vActionSubjectListSet.length; i++) {
			mSubjectList.setProperty("/ActionSubjectListSet/" + i + "/ProcessStatus", "W");
			mSubjectList.setProperty("/ActionSubjectListSet/" + i + "/ProcessStatusText", "");
			mSubjectList.setProperty("/ActionSubjectListSet/" + i + "/ProcessMsg", "");
		}
		
		oController._vTotalCnt = check_idxs.length;
		oController._vSucessCnt = 0;
		oController._vFailCnt = 0;
		var idx = 0;
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var vCnfpr = ""; 
		
		var onCompleteAction = function() {
			var d_idx = check_idxs[idx];
			var createData = {};
			var process_result = false;
			
			createData.Docno = vActionSubjectListSet[d_idx].Docno;
			createData.Docty = vActionSubjectListSet[d_idx].Docty;
			createData.Reqno = vActionSubjectListSet[d_idx].Reqno;
			createData.Persa = vActionSubjectListSet[d_idx].Persa;
			createData.Pernr = vActionSubjectListSet[d_idx].Pernr;
			createData.Actda = vActionSubjectListSet[d_idx].Actda;
			createData.VoltId = vActionSubjectListSet[d_idx].VoltId;
			createData.Actty = "C";
			if(idx == 0) {
				createData.CfmFirst = "X";
			} else {
				createData.CfmFirst = "";
			}
			if(idx == (check_idxs.length - 1)) {
				createData.CfmLast = "X";
			} else {
				createData.CfmLast = "";
			}
			//var vAuthMsg = "";
			
			if(createData.CfmFirst == "X" || createData.CfmLast == "X") {
				//setTimeout(showMessageToast, 300);
				//vAuthMsg = "권한 조정 중입니다.";
			}
			
			try {
				// 첫레코드 전 호출
				var vAuthData = {};
				if(createData.CfmFirst == "X") {
					vAuthData.Docno = vActionSubjectListSet[d_idx].Docno;
					vAuthData.Actda = vActionSubjectListSet[d_idx].Actda;
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
				
				var oPath = "/ActionSubjectListSet(Docno='" + vActionSubjectListSet[d_idx].Docno + "',"
                          + "Pernr='" +  vActionSubjectListSet[d_idx].Pernr + "',"
                          + "VoltId='" +  vActionSubjectListSet[d_idx].VoltId + "',"
                          + "Actda=" +  "datetime%27" + dateFormat.format( new Date(vActionSubjectListSet[d_idx].Actda)) + "T00%3a00%3a00%27" + ")";
				
				oModel.update(
						oPath, 
						createData, 
						null,
					    function (oData, response) {
							process_result = true;
							
							// 채용시 암호화된 ID 저장
							oController.saveEncryptId(oController, vActionSubjectListSet[d_idx].Docno);
					    },
					    function (oError) {
					    	var Err = {};
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								var msg1 = Err.error.innererror.errordetails;
								if(msg1 && msg1.length) mSubjectList.setProperty("/ActionSubjectListSet/" + d_idx + "/ProcessMsg", Err.error.innererror.errordetails[0].message);
								else mSubjectList.setProperty("/ActionSubjectListSet/" + d_idx + "/ProcessMsg", Err.error.message.value);
							} else {
								mSubjectList.setProperty("/ActionSubjectListSet/" + d_idx + "/ProcessMsg", oError.toString());
							}
							process_result = false;
					    }
			    );
				
				// 마지막 레코드 전 호출
				if(createData.CfmLast == "X"){
					vAuthData.Docno = vActionSubjectListSet[d_idx].Docno;
					vAuthData.Actda = vActionSubjectListSet[d_idx].Actda;
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
				mSubjectList.setProperty("/ActionSubjectListSet/" + d_idx + "/ProcessMsg", ex.toString());
				process_result = false;
			}
			
			if(process_result) {
				vCnfpr += vActionSubjectListSet[d_idx].Pernr + "|";
				oController._vSucessCnt++;
				mSubjectList.setProperty("/ActionSubjectListSet/" + d_idx + "/ProcessStatusText", "성공");
				mSubjectList.setProperty("/ActionSubjectListSet/" + d_idx + "/ProcessStatus", "S");
			} else {
				mSubjectList.setProperty("/ActionSubjectListSet/" + d_idx + "/ProcessStatusText", "실패");
				mSubjectList.setProperty("/ActionSubjectListSet/" + d_idx + "/ProcessStatus", "F");
				oController._vFailCnt++;
			}
			
			if((idx+1) < oController._vTotalCnt) {
				mSubjectList.setProperty("/ActionSubjectListSet/" + check_idxs[idx+1] + "/ProcessStatusText", "처리중...");
				mSubjectList.setProperty("/ActionSubjectListSet/" + check_idxs[idx+1] + "/ProcessStatus", "P");
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
//					oController.reloadSubjectList(oController);
					
//					//메일벌송 팝업을 OPEN 한다.
//					if(!oController._oCompleteEMailDialog) {
//						oController._oCompleteEMailDialog = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.CompleteEMail", oController);
//						oView.addDependent(oController._oCompleteEMailDialog);
//					}
//					
//					oController._oCompleteEMailDialog.open();
					
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
				oBinding.filter([new sap.ui.model.Filter("Pchk", sap.ui.model.FilterOperator.EQ, true)]);

				mSubjectList.setProperty("/ActionSubjectListSet/0/ProcessStatusText", "처리중...");
				mSubjectList.setProperty("/ActionSubjectListSet/0/ProcessStatus", "P");
				//mSubjectList.setProperty("/ActionSubjectListSet/0/ProcessMsg", "권한 조정 중입니다.");
				setTimeout(onCompleteAction, 300);
				
        	}
		};
		
		var vMsg1 = "확정처리 대상은 총 %CNT% 명 입니다.";
		var vMsg = vMsg1.replace("%CNT%", check_idxs.length) + " " + "발령품의서를 확정하시겠습니까?";
		
		sap.m.MessageBox.show(vMsg, {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: "발령품의서 확정처리",
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
		var tMsg1 = "발령확정 처리가 완료하였습니다. 처리결과는 성공 : %CNT1%, 실패 : %CNT2% 입니다.";
		var tMsg2 = tMsg1.replace("%CNT1%", oController._vSucessCnt);
		var msg = tMsg2.replace("%CNT2%", oController._vFailCnt);
		msg += " " + "확정처리가 성공된 대상자는 리스트에서 사라집니다.";
		sap.m.MessageBox.alert(msg, {
			title: "안내",
			onClose : function() {
//				oController.readDocument(oController);
				if(oController._vTotalCnt == oController._vSucessCnt) {
//					oController.navToBack();
					oController.navToBackComplete();
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
				sap.m.MessageBox.alert("먼저 삭제할 행을 선택하여 주십시오.");
				return;
			}
		} else {
			sap.m.MessageBox.alert("삭제 할 데이터가 없습니다.");
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
				oController.BusyDialog.close();
				
				sap.m.MessageBox.show(processMsg, {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "발령품의서 확정처리",
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
	  							processMsg += "[" + "전송성공" + "] " 
	  							            + oData.Message;
	  						} else {
	  							processMsg += "[" + "전송실패" + "] " 
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
		
		oController.BusyDialog.open();
		
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
		$("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 155);
	},
		
	doOnCheck : function(rowId, cellInd, state) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppComplete");
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