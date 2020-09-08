jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.AttachFileAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("zui5_hrxx_actapp.fragment.AttachFileAction");
jQuery.sap.require("zui5_hrxx_actapp.common.Common");

sap.ui.controller("zui5_hrxx_actapp.ActAppRequest", {

	PAGEID : "ActAppRequest",
	  
	_vStatu : "",
	_vPersa : "",
	_vReqno : "",
	_vDocno : "",
	_vDocty : "",
	_vActda : "",
	_oContext : null,
	
	_vFromPageId : "",
	
	_PreviewDialog : null,
	_NoticeDialog : null,
	
	BusyDialog: null,
	
	_fUpdateFlag : false,
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actapp.ActAppRequest
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
* @memberOf zui5_hrxx_actapp.ActAppRequest
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actapp.ActAppRequest
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actapp.ActAppRequest
*/
//	onExit: function() {
//
//	}
	
	onBeforeShow : function(oEvent) {
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		if(oEvent) {
			this._vStatu = oEvent.data.Statu;
			this._vReqno = oEvent.data.Reqno;
			this._vDocno = oEvent.data.Docno;
			this._vDocty = oEvent.data.Docty;
			this._vPersa = oEvent.data.Persa;
			this._vActda = oEvent.data.Actda;
			this._oContext = oEvent.data.context;
			
			console.log("ActAppRequest Init Data : " + this._vDocno + ", " + this._vPersa + ", " + this._vReqno + ", " + this._vDocty);
			
			this._vFromPageId = oEvent.data.FromPageId;
			
			var oOrgeh = sap.ui.getCore().byId(this.PAGEID + "_Orgeh");
			var oReqno = sap.ui.getCore().byId(this.PAGEID + "_Reqno");
			var oTitle = sap.ui.getCore().byId(this.PAGEID + "_Title");
//			var oReqda = sap.ui.getCore().byId(this.PAGEID + "_Reqda");
			
			var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
			console.log("Data : " + this._oContext + ", " + mActionReqList.getProperty(this._oContext + "/Reqdp"));
			
			oReqno.setText(mActionReqList.getProperty(this._oContext + "/Reqno"));
			oTitle.setText(mActionReqList.getProperty(this._oContext + "/Title"));
			
			oOrgeh.setText(mActionReqList.getProperty(this._oContext + "/Reqdp"));
//			oReqda.setText(dateFormat.format(mActionReqList.getProperty(this._oContext + "/Reqda")));
			
			this.setAddInfoSort(this);
			
			this.setAppGrouping(this);
			
			zui5_hrxx_actapp.fragment.AttachFileAction.oController = this;
			
			zui5_hrxx_actapp.fragment.AttachFileAction.setAttachFile(this);
			
			zui5_hrxx_actapp.fragment.AttachFileAction.refreshAttachFileList(this);
			
			this._fUpdateFlag = false;
		}
	},
	
	setAddInfoSort : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var oNotet = sap.ui.getCore().byId(this.PAGEID + "_Notet");
		var oNoteb = sap.ui.getCore().byId(this.PAGEID + "_Noteb");
		
		oModel.read("/ActionAppContentsSet(Persa='" + oController._vPersa + "',"
//	                + "Reqno='" + encodeURI(oController._vReqno) + "',"
				    + "Docno='" + (oController._vDocno) + "')", 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData) {
						oNotet.setValue(oData.Notet);
						oNoteb.setValue(oData.Noteb);
						for(var i=1; i<5; i++) {
							var oSrtf = sap.ui.getCore().byId(oController.PAGEID + "_Srtf" + i);
							var oSrtt = sap.ui.getCore().byId(oController.PAGEID + "_Srtt" + i);
							if(oSrtf) eval("oSrtf.setSelectedKey(oData.Srtf" + i + ")");
							if(oSrtt) eval("oSrtt.setSelectedKey(oData.Srtt" + i + ")");
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
	},
	
	setAppGrouping : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var mActionAppGrouping = sap.ui.getCore().getModel("ActionAppGrouping");
		
		var vActionAppGrouping = {ActionAppGroupingSet : []};
		oModel.read("/ActionAppGroupingSet/?$filter=Reqno%20eq%20%27" + encodeURIComponent(oController._vReqno) + "%27"
				+ "%20and%20Persa%20eq%20%27" + oController._vPersa + "%27"
				+ "%20and%20Docno%20eq%20%27" + (oController._vDocno) + "%27",
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							var oneData = {};
							
							oneData.Persa = oData.results[i].Persa;
							oneData.Reqno = oData.results[i].Reqno;
							oneData.Docno = oData.results[i].Docno;
							oneData.Actin = oData.results[i].Actin;
							oneData.Acttx = oData.results[i].Acttx;
							oneData.Grpn1 = parseInt(oData.results[i].Grpn1);
							oneData.Grpn2 = parseInt(oData.results[i].Grpn2);
							oneData.Grpt1 = oData.results[i].Grpt1;
							oneData.Grpt2 = oData.results[i].Grpt2;
							
							if(oData.results[i].Farea == "X") oneData.Farea = true;
							else oneData.Farea = false;
							if(oData.results[i].Posgr == "X") oneData.Posgr = true;
							else oneData.Posgr = false;
							
							if(oneData.Grpt1 != "") oneData.Grpt1E = true;
							else oneData.Grpt1E = false;
							vActionAppGrouping.ActionAppGroupingSet.push(oneData);
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		mActionAppGrouping.setData(vActionAppGrouping);
	},
	
	navToBack : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppRequest");
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
	
	onPressSave : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppRequest");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var updateData_AddInfoSort = {};
		var UpdateData_Grouping = [];
		
		updateData_AddInfoSort.Persa = oController._vPersa;
		updateData_AddInfoSort.Reqno = oController._vReqno;
		updateData_AddInfoSort.Docno = oController._vDocno;
		
		var oNotet = sap.ui.getCore().byId(oController.PAGEID + "_Notet");
		var oNoteb = sap.ui.getCore().byId(oController.PAGEID + "_Noteb");
		oNotet.setValueState(sap.ui.core.ValueState.None);
		
		if(oNotet.getValue() == "") {
			oNotet.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert("추가내용 상단을 입력바랍니다.");
			return false;
		}
		
		var mActionAppGrouping = sap.ui.getCore().getModel("ActionAppGrouping");
		var vActionAppGrouping = mActionAppGrouping.getProperty("/ActionAppGroupingSet");
		if(vActionAppGrouping && vActionAppGrouping.length) {
			for(var i=0; i<vActionAppGrouping.length; i++) {
				var OneData_Grouping = {};
				
				OneData_Grouping.Persa = vActionAppGrouping[i].Persa;
				OneData_Grouping.Reqno = vActionAppGrouping[i].Reqno;
				OneData_Grouping.Docno = vActionAppGrouping[i].Docno;
				OneData_Grouping.Actin = vActionAppGrouping[i].Actin;
				OneData_Grouping.Acttx = vActionAppGrouping[i].Acttx;
				
				if(vActionAppGrouping[i].Grpn1 == "" || vActionAppGrouping[i].Grpn1 == "0000") {
					sap.m.MessageBox.alert((i+1) + "번째의 대그룹핑 정보를 선택바랍니다.");
					return false;
				} //Grpt1
				
				if(vActionAppGrouping[i].Grpt1E == true && vActionAppGrouping[i].Grpt1 == "") {
					sap.m.MessageBox.alert("$NO$ 번째 대분류명을 입력바랍니다.".replace("$NO$", (i+1)));
					return false;
				}
				
				OneData_Grouping.Grpn1 = "" + vActionAppGrouping[i].Grpn1;
				if(vActionAppGrouping[i].Grpn2 == "0000" || vActionAppGrouping[i].Grpn2 == "") {
					OneData_Grouping.Grpn2 = "";
				} else {
					OneData_Grouping.Grpn2 = "" + vActionAppGrouping[i].Grpn2;
				}
				
				OneData_Grouping.Grpt1 = vActionAppGrouping[i].Grpt1;
				OneData_Grouping.Grpt2 = vActionAppGrouping[i].Grpt2;
				
				if(vActionAppGrouping[i].Farea == true) {
					OneData_Grouping.Farea = "X";
				} else {
					OneData_Grouping.Farea = "";
				}
				if(vActionAppGrouping[i].Posgr == true) {
					OneData_Grouping.Posgr = "X";
				} else {
					OneData_Grouping.Posgr = "";
				}
				
				UpdateData_Grouping.push(OneData_Grouping);
			}
		}
		
		updateData_AddInfoSort.Notet = oNotet.getValue();
		updateData_AddInfoSort.Noteb = oNoteb.getValue();
	
		for(var i=1; i<5; i++) {
			var oSrtf = sap.ui.getCore().byId(oController.PAGEID + "_Srtf" + i);
			var oSrtt = sap.ui.getCore().byId(oController.PAGEID + "_Srtt" + i);
			if(oSrtf) {
				if(oSrtf.getSelectedKey() != "0000") eval("updateData_AddInfoSort.Srtf" + i + " = oSrtf.getSelectedKey();");
				else eval("updateData_AddInfoSort.Srtf" + i + " = '';");
			}
			
			if(oSrtt) {
				if(oSrtt.getSelectedKey() != "0000") eval("updateData_AddInfoSort.Srtt" + i + " = oSrtt.getSelectedKey();");
				else eval("updateData_AddInfoSort.Srtt" + i + " = '';");
			}
		};
		
		
		var process_result = false;
		
		try {
			var oPath = "/ActionAppContentsSet(Persa='" + oController._vPersa + "',"
//	          + "Reqno='" + encodeURI(oController._vReqno) + "',"
			  + "Docno='" + (oController._vDocno) + "')";
	
			oModel.update(
					oPath, 
					updateData_AddInfoSort, 
					null,
				    function (oData, response) {
						process_result = true;
						common.Common.log("Sucess ActionAppContentsSet Update !!!");
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
			
			if(!process_result) {
				return false;
			}
			
			if(UpdateData_Grouping && UpdateData_Grouping.length) {
				for(var i=0; i<UpdateData_Grouping.length; i++) {
					oPath = "/ActionAppGroupingSet(Docno='" + UpdateData_Grouping[i].Docno + "',Actin='" + UpdateData_Grouping[i].Actin + "')";
					oModel.update(
							oPath, 
							UpdateData_Grouping[i], 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess ActionAppGroupingSet Create !!!");
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
					if(!process_result) {
						return false;
					}
				}
			}
			
		} catch(ex) {
			process_result = false;
			common.Common.log(ex);
		}
		
		if(!process_result) {
			return false;
		}
		
		if(oEvent != null) {
			sap.m.MessageBox.alert("저장하였습니다.", {
				title: "안내"
			});
		}
		
		oNotet.setValueState(sap.ui.core.ValueState.None);
		oController._fUpdateFlag = false;
		
		return true;
	},
	
	onPressPreview : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppRequest");
		var oController = oView.getController();
		
		if(!oController.onPressSave()) {
			return;
		} 
		
		if(!oController._PreviewDialog) {
			oController._PreviewDialog = sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActionAppPreview", oController);
			oView.addDependent(oController._PreviewDialog);
		}
		oController._PreviewDialog.open();
	},
	
	getNoticeCheck : function(oController) {
		if(oController._vPersa != "7700") return false;
		
		var vOrgehs = ["직", "서비스", "지사", "SERVICE"];
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");
		
		var fNotice = false;
		
		for(var i=0; i<vActionSubjectList.length; i++) {
			if(vActionSubjectList[i].Batyp != "A") continue;
			
			//발령유형이 채용/이동 인 경우에만 적용
			var fMassn = false;
			for(var j=1; j<=5; j++) {
				var tmp = eval("vActionSubjectList[i].Massn" + j + ";");
				if(tmp == "10" || tmp == "50") {
					fMassn = true;
					break;
				}
			}
			
			//발령품의서 종류에 따라 소속명 항목을 가져온다.
			var vOrgeh_Tx = "";
			if(oController._vDocty == "20") {
				vOrgeh_Tx = vActionSubjectList[i].Orgeh_Tx;
			} else {
				vOrgeh_Tx = vActionSubjectList[i].A_Orgeh_Tx;
			}
			
			var fOrgeh = false;
			for(var j=0; j<vOrgehs.length; j++) {
				if(vOrgeh_Tx.toUpperCase().search(vOrgehs[j]) > 0) {
					fOrgeh = true;
					break;
				}
			}
			
			if(fMassn && fOrgeh) {
				fNotice = true;
				break;
			}
		}	
		
		return fNotice;
	},
	
	onPressRequest : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppRequest");
		var oController = oView.getController();
		
		if(!oController.onPressSave()) {
			return;
		}
		
		if(oController.getNoticeCheck(oController)) {
			if(!oController._NoticeDialog) {
				oController._NoticeDialog = sap.ui.jsfragment("zui5_hrxx_actapp.fragment.Notice1Dialog", oController);
				oView.addDependent(oController._NoticeDialog);
			}
			oController._NoticeDialog.open();
		} else {
			oController.onProcessRequest(oEvent);
		}
	},
	
	onProcessRequest : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppRequest");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var updateData = {};
		
		updateData.Persa = oController._vPersa;
		updateData.Reqno = oController._vReqno;
		updateData.Docno = oController._vDocno;
		updateData.ApprvX = "X";
		
		var oPath = "/ActionReqListSet";
		var process_result = false;
		
		if(!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : "발령품의서를 결재상신 처리중입니다. 잠시만 기다려주십시오."}));
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : "발령품의서를 결재상신 처리중입니다. 잠시만 기다려주십시오."}));
			
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		var updateProcess = function() {
			try {
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
				
				if(!process_result) {
					if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
						oController.BusyDialog.close();
					}
					return;
				}
				
				var vDocUri = "";
				
				oModel.read(oPath, 
						null, 
						null, 
						false,
						function(oData, oResponse) {					
							if(oData) {
								vDocUri = oData.Uri;
							}
						},
						function(oError) {
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
				
				if(!process_result) {
					if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
						oController.BusyDialog.close();
					}
					return;
				}
				
				//vDocUri = "SettleDoc.html";
				if(vDocUri != "") {
					//결재자 지정 Window를 open 한다.
					var newwindow = window.open(vDocUri, 'SettleDoc', 'height=500,width=850');
					if(window.focus) { newwindow.focus(); }
					
	 				newwindow.onbeforeunload = function () {
	 				    
	 				   sap.m.MessageBox.alert("발령품의서를 결재상신 하였습니다.", {
	 						title: "안내",
	 						onClose : function() {
	 							
	 						}
	 					});
	 				};
				}
				
				sap.ui.getCore().getEventBus().publish("nav", "to", {
				      id : "zui5_hrxx_actapp.ActAppMain",
				      data : {
				      }
				});
			}catch(Ex) {
				common.Common.log(Ex);
			} finally {
				if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}
			}
		};
		
		setTimeout(updateProcess, 300);
	},
	
	onChangeData : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppRequest");
		var oController = oView.getController();
		
		oController._fUpdateFlag = true;
	},
	
	onChangeGrpn1 : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppRequest");
		var oController = oView.getController();
		
		oController._fUpdateFlag = true;
		
		var vKey = oEvent.getSource().getSelectedKey();
		
		var mActionAppGrouping = sap.ui.getCore().getModel("ActionAppGrouping");
		var vActionAppGrouping = mActionAppGrouping.getProperty("/ActionAppGroupingSet");
		
		if(vKey != "0000" && vKey != "") {
			
//			var vControlId = oEvent.getSource().getId();
//			var vIdxs = vControlId.split("-");
//			var vIdx = vIdxs[vIdxs.length - 1];
			
			var vTmpGrpn1 = [];
			for(var i=0; i<vActionAppGrouping.length; i++) {
				var vrpn1 = mActionAppGrouping.getProperty("/ActionAppGroupingSet/" + i + "/Grpn1");
				var isExists = false;
				for(var j=0; j<vTmpGrpn1.length; j++) {
					if(vTmpGrpn1[j] == vrpn1) {
						isExists = true;
						break;
					}
				}
				if(!isExists) {
					vTmpGrpn1.push(vrpn1);
				}
			}
			
			for(var j=0; j<vTmpGrpn1.length; j++) {
				vKey = vTmpGrpn1[j];
				var vSameCnt = [];
				for(var i=0; i<vActionAppGrouping.length; i++) {
					var vGrpn1 = mActionAppGrouping.getProperty("/ActionAppGroupingSet/" + i + "/Grpn1");
					if(vGrpn1 == vKey) {
						vSameCnt.push(i);
					}
				}
				//console.log("vSameCnt : " + vTmpGrpn1[j] + ", " + vSameCnt.length);
				
				for(var i=0; i<vSameCnt.length; i++) {
					if(i > 0) {
						mActionAppGrouping.setProperty("/ActionAppGroupingSet/" + vSameCnt[i] + "/Grpt1", "");
						mActionAppGrouping.setProperty("/ActionAppGroupingSet/" + vSameCnt[i] + "/Grpt1E", false);				
					} else {
						mActionAppGrouping.setProperty("/ActionAppGroupingSet/" + vSameCnt[i] + "/Grpt1E", true);	
					}
				}
			}
		}
		
//		for(var i=0; i<vActionAppGrouping.length; i++) {
//			var vSameCnt = 0;
//			var vKey = mActionAppGrouping.getProperty("/ActionAppGroupingSet/" + i + "/Grpn1");
//			
//			for(var j=0; j<vActionAppGrouping.length; j++) {
//				var vGrpn1 = mActionAppGrouping.getProperty("/ActionAppGroupingSet/" + j + "/Grpn1");
//				if(vGrpn1 == vKey) {
//					vSameCnt++;
//				}
//			}
//			
//			if(vSameCnt > 1) {
//				//mActionAppGrouping.setProperty("/ActionAppGroupingSet/" + i + "/Grpt1", "");
//				mActionAppGrouping.setProperty("/ActionAppGroupingSet/" + i + "/Grpt1E", false);				
//			} else {
//				mActionAppGrouping.setProperty("/ActionAppGroupingSet/" + i + "/Grpt1E", true);	
//			}
//		}
		
	},
	
	onChangeGrpn2 : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppRequest");
		var oController = oView.getController();
		
		oController._fUpdateFlag = true;
		
		var vKey = oEvent.getSource().getSelectedKey();
		
		if(vKey == "0000" || vKey == "") {
			var vControlId = oEvent.getSource().getId();
			var vIdxs = vControlId.split("-");
			var vIdx = vIdxs[vIdxs.length - 1];
			
			var mActionAppGrouping = sap.ui.getCore().getModel("ActionAppGrouping");
			mActionAppGrouping.setProperty("/ActionAppGroupingSet/" + vIdx + "/Grpt2", "");
		}
	},
	
	onAAPClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppRequest");
		var oController = oView.getController();
		
		if(oController._PreviewDialog && oController._PreviewDialog.isOpen()) {
			oController._PreviewDialog.close();
		}
	},
	
	onBeforeOpenHtmlDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppRequest");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var oHTMLPanel = sap.ui.getCore().byId(oController.PAGEID + "_APP_HtmlPanel");
		var oHtml = new sap.ui.core.HTML({preferDOM : true, sanitizeContent : false});

		oHTMLPanel.removeAllContent();
		oHTMLPanel.destroyContent();
		
		try {
			oModel.read("/ActionAppHtmlSet(Docno='" + oController._vDocno + "')",
//					+ "Reqno='" + encodeURI(oController._vReqno) + "')", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData) {
							oHtml.setContent(oData.Htmlc);
							console.log(oData.Htmlc);
						}
					},
					function(oResponse) {
						oHTML.setContent("<div><h3 style='color:darkred'>미리보기 HTML을 가져오는데 실패하였습니다.</h3></div>");
						common.Common.log(oResponse);
					}
			);
		} catch(ex) {
			common.Common.log(ex);
		}
		oHTMLPanel.addContent(oHtml);
	},
	
	onNDClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppRequest");
		var oController = oView.getController();
		
		if(oController._NoticeDialog && oController._NoticeDialog.isOpen()) {
			oController._NoticeDialog.close();
		}
	},
	
	onConfirmNotice : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppRequest");
		var oController = oView.getController();
		
		oController.onNDClose(oEvent);
		
		oController.onProcessRequest(oEvent);
	}
});