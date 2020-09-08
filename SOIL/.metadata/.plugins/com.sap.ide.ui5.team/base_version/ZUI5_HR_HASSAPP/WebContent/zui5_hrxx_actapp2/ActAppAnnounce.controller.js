jQuery.sap.require("common.Common");
jQuery.sap.require("zui5_hrxx_actapp2.common.Common");

sap.ui.controller("zui5_hrxx_actapp2.ActAppAnnounce", {
	
	PAGEID : "ActAppAnnounce",
	ListSelectionType : "Multiple",
	ListSelected : true,
	ListFilter : "",
	
	_fUpdateFlag : false,
	
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
	
	_vFromPageId : "",
	
	_DetailViewPopover : null,
	_PreviewDialog : null,

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actapp2.ActAppAnnounce
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
			onAfterHide : jQuery.proxy(function (evt) {
				this.onAfterHide(evt);
			}, this)
		}); 
	    
	    sap.ui.getCore().getEventBus().subscribe("app", "ResizeWindow", this.onResizeWindow, this);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_actapp2.ActAppAnnounce
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actapp2.ActAppAnnounce
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actapp2.ActAppAnnounce
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
			this._oContext = oEvent.data.context;
			
			console.log("ActAppAnnounce Init Data : " + this._vDocno + ", " + this._vPersa + ", " + this._vReqno + ", " + this._vDocty);
			
			this._vFromPageId = oEvent.data.FromPageId;
			
			this.setAppGrouping(this);
			
			this._fUpdateFlag = false;
			
//			if(this._vDocty == "20") {
//				zui5_hrxx_actapp2.common.Common.setRecSubjectListColumn(this);
//			} else {
//				zui5_hrxx_actapp2.common.Common.setSubjectListColumn(this);
//			}			
			
//			var oAllCheckbox = sap.ui.getCore().byId(this.PAGEID + "_All_CheckBox");
//			if(oAllCheckbox) oAllCheckbox.setChecked(true);
		}
		this._vListLength = 0;
	},
	
	onAfterShow : function(oEvent) {		
		if(oEvent) {
			if(this._vDocty == "20") {
				this.setRecSubjectListColumn(this);
			} else {
				this.setSubjectListColumn(this);
			}
		}
	},
	
	onAfterHide : function(oEvent) {
		if(typeof ActAppAnnounceSubject == "object") {
			ActAppAnnounceSubject.Reset();
		}
	},
	
	setAppGrouping : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
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
	
	onChangeData : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppAnnounce");
		var oController = oView.getController();
		
		oController._fUpdateFlag = true;
	},
	
	onChangeGrpn1 : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppAnnounce");
		var oController = oView.getController();
		
		oController._fUpdateFlag = true;
		
		var vKey = oEvent.getSource().getSelectedKey();
		
		var mActionAppGrouping = sap.ui.getCore().getModel("ActionAppGrouping");
		var vActionAppGrouping = mActionAppGrouping.getProperty("/ActionAppGroupingSet");
		
		if(vKey != "0000" && vKey != "") {
			
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
	},
	
	onChangeGrpn2 : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppAnnounce");
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
	
	navToBack : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppAnnounce");
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
	
	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppAnnounce");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");

		var UpdateData_Grouping = [];		
		
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
					return;
				} //Grpt1
				
				if(vActionAppGrouping[i].Grpt1E == true && vActionAppGrouping[i].Grpt1 == "") {
					sap.m.MessageBox.alert("$NO$ 번째 대분류명을 입력바랍니다.".replace("$NO$", (i+1)));
					return;
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
			sap.m.MessageBox.alert("발령게시 대상을 선택해 주십시오.");
			return false;
		}
		
		var process_result = false;
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		try {
			if(UpdateData_Grouping && UpdateData_Grouping.length) {
				for(var i=0; i<UpdateData_Grouping.length; i++) {
					var oPath = "/ActionAppGroupingSet(Docno='" + UpdateData_Grouping[i].Docno + "',Actin='" + UpdateData_Grouping[i].Actin + "')";
					oModel.update(
							oPath, 
							UpdateData_Grouping[i], 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess ActionAppGroupingSet Update !!!");
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
						return false;
					}
				}
			}
			
			if(vActionSubjectListSet && vActionSubjectListSet.length) {
				for(var i=0; i<vActionSubjectListSet.length; i++) {
					var updateData = {};
					
					updateData.Docno = vActionSubjectListSet[i].Docno;
					updateData.Docty = vActionSubjectListSet[i].Docty;
					updateData.Reqno = vActionSubjectListSet[i].Reqno;
					updateData.Persa = vActionSubjectListSet[i].Persa;
					updateData.Pernr = vActionSubjectListSet[i].Pernr;
					updateData.Actda = vActionSubjectListSet[i].Actda;
					updateData.VoltId = vActionSubjectListSet[i].VoltId;
					if(vActionSubjectListSet[i].Pchk == true) {
						updateData.Shayn = "X";
					} else {
						updateData.Shayn = "";
					}					
					updateData.Actty = "S";
					
					var oPath = "/ActionSubjectListSet(Docno='" + vActionSubjectListSet[i].Docno + "',"
	                          + "Pernr='" +  vActionSubjectListSet[i].Pernr + "',"
	                          + "VoltId='" +  vActionSubjectListSet[i].VoltId + "',"
	                          + "Actda=" +  "datetime%27" + dateFormat.format( new Date(vActionSubjectListSet[i].Actda)) + "T00%3a00%3a00%27" + ")";
					oModel.update(
							oPath, 
							updateData, 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess ActionSubjectListSet Update !!!");
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
						return false;
					}
				}
			}
			
			var oAttyn = sap.ui.getCore().byId(oController.PAGEID + "_Attyn");
			var vAttyn = "";
			if(oAttyn.getSelected()) vAttyn = "X";
			
			var updateData2 = {};
			updateData2.Docno = oController._vDocno;
			updateData2.Attyn = vAttyn;
			updateData2.Actty = "S";
			
			var oPath2 = "/ActionPostHtmlSet(Docno='" + oController._vDocno + "',Attyn='" + vAttyn + "',Actty='S')";
			oModel.update(
					oPath2, 
					updateData2, 
					null,
				    function (oData, response) {
						process_result = true;
						common.Common.log("Sucess ActionPostHtmlSet Update !!!");
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
		oController._fUpdateFlag = false;
		return true;
	},
	
	onPressPreview : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppAnnounce");
		var oController = oView.getController();
		
		if(!oController.onPressSave()) {
			return;
		} 
		
		if(!oController._PreviewDialog) {
			oController._PreviewDialog = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionAppPreview", oController);
			oView.addDependent(oController._PreviewDialog);
		}
		oController._PreviewDialog.open();
	},
	
	onBeforeOpenHtmlDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppAnnounce");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var oAttyn = sap.ui.getCore().byId(oController.PAGEID + "_Attyn");
		var vAttyn = "";
		if(oAttyn.getSelected()) vAttyn = "X";
		
//		var oHTML = sap.ui.getCore().byId(oController.PAGEID + "_AAP_HTML");
		var oPanel = sap.ui.getCore().byId(oController.PAGEID + "_APP_HtmlPanel");
		var oHtml = new sap.ui.core.HTML({preferDOM : true, sanitizeContent : false}).addStyleClass("WhiteBackground");
		
		oPanel.removeAllContent();
		oPanel.destroyContent();
		
		try {
			oModel.read("/ActionPostHtmlSet(Docno='" + oController._vDocno + "',Attyn='" + vAttyn + "',Actty='S')", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData) {
							oHtml.setContent(oData.Htmlc);
						}
					},
					function(oResponse) {
						oHtml.setContent("<div><h3 style='color:darkred'>" + "HTML을 가져오는데 실패하였습니다." + "</h3></div>");
						common.Common.log(oResponse);
					}
			);
		} catch(ex) {
			common.Common.log(ex);
		}
		oPanel.addContent(oHtml);		
	},
	
	onAAPClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppAnnounce");
		var oController = oView.getController();
		
		if(oController._PreviewDialog && oController._PreviewDialog.isOpen()) {
			oController._PreviewDialog.close();
		}
	},
	
	onPressAnnounce  : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppAnnounce");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var vTitle = "발령게시 확인";
		var vMsg = "발령품의서를 게시하시겠습니까?";	
		
		var oAttyn = sap.ui.getCore().byId(oController.PAGEID + "_Attyn");
		
		var DataProcess = function() {
			
			if(!oController.onPressSave()) {
				return;
			}
			
			var createData = {
					"Docno"  : oController._vDocno,
					"Persa"  : oController._vPersa, 
					"Reqno"  : oController._vReqno
			};			
			createData.Reqst = "51";
			createData.Attyn = "";
			if(oAttyn.getSelected()) createData.Attyn = "X";
			
			var msg = "발령품의서를 게시하였습니다.";
							
			oModel.create(
					"/ActionReqChangeHistorySet", 
					createData, 
					null,
				    function (oData, response) {
						sap.m.MessageBox.alert(msg, {
							title: "안내",
							onClose : function() {
								var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
								mActionReqList.setProperty(oController._oContext + "/Postc", "X");
								oController.navToBack();
							}
						});
				    },
				    function (oError) {
						if (oError.response) {
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppAnnounce");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		var oCustomData = oControl.getCustomData();
		
		oController._vSelected_Reqno = null;
		oController._vSelected_Pernr = null;
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppAnnounce");
		var oController = oView.getController();
		
		if(oController._vDocty == "20") {
			zui5_hrxx_actapp2.common.Common.onAfterOpenRecDetailViewPopover(oController);
		} else {
			zui5_hrxx_actapp2.common.Common.onAfterOpenDetailViewPopover(oController);
		}
	},
	
	onResizeWindow : function(oEvent, oEventId, data) {
		$("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 360);
	},
	
	onAfterRenderingTable : function(oController) {
		if(typeof ActAppAnnounceSubject == "undefined") {
			var vLang = "";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") == -1) vLang = "en";
			
			createIBSheet2(document.getElementById(oController.PAGEID + "_SubjectList"), "ActAppAnnounceSubject", "100%",  (window.innerHeight - 360) + "px", vLang);
		}
		
		ActAppAnnounceSubject.Reset();
	},
	
	setSubjectListColumn : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var icon1 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Apply.jpg' style='width :15px; height : 15px'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Error.jpg' style='width :15px; height : 15px'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Lock.jpg' style='width :15px; height : 15px'>";
		
		var icon_retro = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Radiation.jpg' style='width :15px; height : 15px'>";
		
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
		                 {id : "Batyp", label : "구분", control : "Html", width : 70, align : "Center"},
		                 {id : "Pernr", label : "사번", control : "Hidden", width : 70, align : "Center"},
		                 {id : "Docno", label : "No.", control : "Hidden", width : 70, align : "Center"},
		                 {id : "Reqno", label : "품의번호", control : "Hidden", width : 70, align : "Center"},
		                 {id : "Actda", label : "발령일", control : "Hidden", width : 70, align : "Center"},
		                 {id : "Ename", label : "성명", control : "Hidden", width : 70, align : "Center"},
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
		
		if(typeof ActAppAnnounceSubject == "undefined") {
			var vLang = "";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") == -1) vLang = "en";
			
			createIBSheet2(document.getElementById(oController.PAGEID + "_SubjectList"), "ActAppAnnounceSubject", "100%",  (window.innerHeight - 360) + "px", vLang);
		}
		
		ActAppAnnounceSubject.Reset();
		
		ActAppAnnounceSubject.SetTheme("DS","ActApp");
		
		var initdata = {};
		
		//initdata.Cfg = {FrozenCol:5, SearchMode:smLazyLoad, SizeMode:0, CustomScroll:1, Page:20, SmartResize:1, MergeSheet:msHeaderOnly};  //MergeSheet:msHeaderOnly,

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
				oneCol.Hidden = true;
			}
			
			if(i == 1) {
				oneCol.Wrap = 1;
			}
			
			vTotalWidth += vColumns[i].width;
		}
		
		if(oController._vStatu != "00") {
			for(var i=0; i<vDisplayControl.length; i++) {
				var Fieldname = vDisplayControl[i].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				
				var oneCol = {};
				
				oneCol.Header = vDisplayControl[i].Label;			
				oneCol.Edit = 0;
				oneCol.Type = "Html";
				oneCol.Width = 150;
				oneCol.SaveName = TextFieldname;
				oneCol.Align = "Left";			
				initdata.Cols.push(oneCol);
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
		
		IBS_InitSheet(ActAppAnnounceSubject, initdata);
		if(vTotalWidth < window.innerWidth) {
			//ActAppAnnounceSubject.FitColWidth();
		}			
		ActAppAnnounceSubject.SetSelectionMode(0);
		
		ActAppAnnounceSubject.SetCellFont("FontSize", 0, "Pchk", ActAppAnnounceSubject.HeaderRows(), "vDummy", 13);
		ActAppAnnounceSubject.SetCellFont("FontName", 0, "Pchk", ActAppAnnounceSubject.HeaderRows(), "vDummy", "Malgun Gothic");
		
		ActAppAnnounceSubject.SetHeaderRowHeight(32);
		ActAppAnnounceSubject.SetDataRowHeight(32);
		
		ActAppAnnounceSubject.SetFocusAfterProcess(0);
		
		if(oController._vStatu == "00") {			
			return;
		}

		var fCompleteCount = false; 
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = {ActionSubjectListSet : []};
		var oPath = "/ActionSubjectListSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27"
        		  + "%20and%20Reqno%20eq%20%27" + encodeURIComponent(oController._vReqno) + "%27";
		
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
								vActionSubjectList.ActionSubjectListSet.push(oneData);
							}

							var oneDataSheet = oData.results[i];
							var vBatyp = oData.results[i].Batyp;
							oneDataSheet.Pchk = oController.ListSelected;
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
							                        + "<div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup4(" + (i+1) + ")'>" + oData.results[i].Ename + "</div>"
							                        + "<div class='L2P13Font'>(" + oData.results[i].Pernr + ")</div>";
							if(oData.results[i].Retro == "X" && oData.results[i].Movda != null) {
								oneDataSheet.Ename_Html += "<div class='L2P13Font'>" + dateFormat.format(new Date(oData.results[i].Movda)) + " " + "부서이동" + "</div>";
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
		
		ActAppAnnounceSubject.LoadSearchData(SubjectListData);
		
		oController._vListLength = SubjectListData.data.length;
		
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		
		if(fCompleteCount) {
			if(oDeleteBtn) oDeleteBtn.setVisible(false);
		} else {
			if(oDeleteBtn) oDeleteBtn.setVisible(true);
		}
	},
	
	setRecSubjectListColumn : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var icon1 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Apply.jpg'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Error.jpg'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Lock.jpg'>";
		
		var icon4 = "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/check-icon.jpg";
		
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
		                 {id : "Actda", label : "발령일", control : "Hidden", width : 70, align : "Center"},
		                 {id : "Ename", label : "성명", control : "Hidden", width : 70, align : "Center"},
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
		                 {id : "Actda", label : "발령일", control : "Hidden", width : 70, align : "Center"},
		                 {id : "Ename", label : "성명", control : "Hidden", width : 70, align : "Center"},
		                 {id : "VoltId", label : "VoltId", control : "Hidden", width : 70, align : "Center"},
		                ];
		}
		vColumns.push({id : "Pernr", label : "사번", control : "Hidden", width : 70, align : "Center"});
		vColumns.push({id : "Docno", label : "No.", control : "Hidden", width : 70, align : "Center"});
		vColumns.push({id : "Reqno", label : "품의번호", control : "Hidden", width : 70, align : "Center"});
		vColumns.push({id : "Actda1", label : "발령일", control : "Hidden", width : 70, align : "Center"});
		
		if(typeof ActAppAnnounceSubject == "undefined") {
			var vLang = "";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") == -1) vLang = "en";
			
			createIBSheet2(document.getElementById(oController.PAGEID + "_SubjectList"), "ActAppAnnounceSubject", "100%",  (window.innerHeight - 360) + "px", vLang);
		}
		
		ActAppAnnounceSubject.Reset();
		
		ActAppAnnounceSubject.SetTheme("DS","GhrisMain");
		
		var initdata = {};
		
		//initdata.Cfg = {FrozenCol:4, SearchMode:smLazyLoad, SizeMode:0, CustomScroll:1, Page:20, SmartResize:1, MergeSheet:msHeaderOnly};  //MergeSheet:msHeaderOnly,

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
				oneCol.Hidden = true;
			}
			
			vTotalWidth += vColumns[i].width;
		}
		
		if(oController._vStatu != "00") {
			for(var i=0; i<vDisplayControl.length; i++) {
				var Fieldname = vDisplayControl[i].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				
				var oneCol = {};
				
				oneCol.Header = vDisplayControl[i].Label;			
				oneCol.Edit = 0;
				oneCol.Type = "Html";
				oneCol.Width = 150;
				oneCol.SaveName = TextFieldname;
				oneCol.Align = "Left";			
				initdata.Cols.push(oneCol);
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
		
		IBS_InitSheet(ActAppAnnounceSubject, initdata);
		if(vTotalWidth < window.innerWidth) {
			//ActAppAnnounceSubject.FitColWidth();
		}			
		ActAppAnnounceSubject.SetSelectionMode(0);
		
		ActAppAnnounceSubject.SetCellFont("FontSize", 0, "Pchk", ActAppAnnounceSubject.HeaderRows(), "vDummy", 13);
		ActAppAnnounceSubject.SetCellFont("FontName", 0, "Pchk", ActAppAnnounceSubject.HeaderRows(), "vDummy", "Malgun Gothic");
		
		ActAppAnnounceSubject.SetHeaderRowHeight(32);
		ActAppAnnounceSubject.SetDataRowHeight(32);
		
		ActAppAnnounceSubject.SetFocusAfterProcess(0);
		
		if(oController._vStatu == "00") {			
			return;
		}
	
		var fCompleteCount = false; 
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = {ActionSubjectListSet : []};
		var oPath = "/ActionSubjectListSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27"
        		  + "%20and%20Reqno%20eq%20%27" + encodeURIComponent(oController._vReqno) + "%27";
		
		var SubjectListData = {data : []};
		
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
							
							var oneDataSheet = oData.results[i];
							
							//Global 일자 관련하여 소스 수정함. 2015.10.19
							//oneDataSheet.Actda = new Date(common.Common.setTime(vActda));
							if(oneDataSheet.Actda != null) {
								oneDataSheet.Actda1 = dateFormat.format(new Date(oneDataSheet.Actda));
							} else {
								oneDataSheet.Actda1 = "";
							}
							//수정완료
							
							if(oData.results[i].Cfmyn == "X") oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'>" + icon1 + "</td><td style='padding-left:5px; border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup4(" + (i+1) + ")'>" + oData.results[i].Ename + "</div>";
							else if(oData.results[i].Cfmyn == "E") oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'>" + icon2 + "</td><td style='padding-left:5px; border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup4(" + (i+1) + ")'>" + oData.results[i].Ename + "</div>";
							else if(oData.results[i].Cfmyn == "L") oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'>" + icon3 + "</td><td style='padding-left:5px; border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup4(" + (i+1) + ")'>" + oData.results[i].Ename + "</div>";
							else oneDataSheet.Ename = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup4(" + (i+1) + ")'>" + oData.results[i].Ename + "&nbsp;&nbsp;&nbsp;</div>";
							
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
		
		ActAppAnnounceSubject.LoadSearchData(SubjectListData);
		
		oController._vListLength = SubjectListData.data.length;
		
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		
		if(fCompleteCount) {
			if(oDeleteBtn) oDeleteBtn.setVisible(false);
		} else {
			if(oDeleteBtn) oDeleteBtn.setVisible(true);
		}
	},

});

function onInfoViewPopup4(rowId) {
	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppAnnounce");
	var oController = oView.getController();
	
	oController._vSelected_Pernr = null;
	oController._vSelected_Reqno = null;
	oController._vSelected_Actda = null;
	oController._vSelected_Docno = null;
	
	if(typeof ActAppAnnounceSubject == "object") {
		oController._vSelected_Pernr = ActAppAnnounceSubject.GetCellValue(rowId, "Pernr");
		oController._vSelected_Reqno = ActAppAnnounceSubject.GetCellValue(rowId, "Reqno");
		oController._vSelected_Actda = ActAppAnnounceSubject.GetCellValue(rowId, "Actda");
		oController._vSelected_Docno = ActAppAnnounceSubject.GetCellValue(rowId, "Docno");
		oController._vSelected_VoltId = ActAppAnnounceSubject.GetCellValue(rowId, "VoltId");
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

function ActAppAnnounceSubject_OnSearchEnd(result) {
	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppAnnounce");
	var oController = oView.getController();
	
	if(ActAppAnnounceSubject.RowCount() > 0) {
		ActAppAnnounceSubject.FitSize(1, 1);
//		ActAppAnnounceSubject.SetColWidth(1, 150);
	}
	ActAppAnnounceSubject.SetExtendLastCol(true);
	
	ActAppAnnounceSubject.SetCellFont("FontSize", 0, "Pchk", ActAppAnnounceSubject.RowCount() + ActAppAnnounceSubject.HeaderRows(), "vDummy", 13);
	ActAppAnnounceSubject.SetCellFont("FontName", 0, "Pchk", ActAppAnnounceSubject.RowCount() + ActAppAnnounceSubject.HeaderRows(), "vDummy", "Malgun Gothic");
	
	if(oController._vDocty != "20") {
		var vHeaderRows = ActAppAnnounceSubject.HeaderRows();
		for(var r=0; r<ActAppAnnounceSubject.RowCount(); r++) {
			if((r % 2) == 0) {
				ActAppAnnounceSubject.SetMergeCell((r+vHeaderRows),0,2,1);
				ActAppAnnounceSubject.SetMergeCell((r+vHeaderRows),1,2,1);
				ActAppAnnounceSubject.SetMergeCell((r+vHeaderRows),2,2,1);
				ActAppAnnounceSubject.SetMergeCell((r+vHeaderRows),3,2,1);
			}
		}
	}
	
//	for(var i=0; i<ActAppAnnounceSubject.RowCount(); i++) {
//		for(var j=0; j<=ActAppAnnounceSubject.LastCol(); j++) {
//			ActAppAnnounceSubject.SetCellBackColor(i + ActAppAnnounceSubject.HeaderRows(), j, "rgb(255,255,255)");
//		}
//	}
}

function ActAppAnnounceSubject_OnBeforeCheck(Row, Col) {
	var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
	var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");
	
	var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
	
	var vPernr = ActAppAnnounceSubject.GetCellValue(Row, "Pernr");
	var vActda = ActAppAnnounceSubject.GetCellValue(Row, "Actda");
	var vVoltId = ActAppAnnounceSubject.GetCellValue(Row, "VoltId");
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
		if(ActAppAnnounceSubject.GetCellValue(Row, "Pchk") == 0) {
			mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", true);
		} else {
			mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", false);
		}
	}
}