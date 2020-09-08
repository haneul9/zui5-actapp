jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.SearchUser2");
jQuery.sap.require("common.Common");
jQuery.sap.require("zui5_hrxx_actapp.common.Common");

sap.ui.controller("zui5_hrxx_actapp.ActAppDocumentView", {

	PAGEID : "ActAppDocumentView",
	ListSelectionType : "None",
	ListSelected : false,
	ListFilter : "",
	
	_vStatu : "",
	_vReqno : "",
	_vDocno : "",
	_vDocty : "",
	_vPersa : "",
	_vActda : "",
	_vMolga : "",
	_oContext : null,
	
	_vOneReq : null,
	
	_PortalUri : "",
	
	_vSelected_Reqno : "",
	_vSelected_Pernr : "",
	_vSelected_Actda : "",
	_vSelected_Docno : "",
	_vSelected_VoltId : "",
	
	vDisplayControl : [],
	
	_DetailViewPopover : null,
	_PreviewDialog : null,
	
	_TableCellHeight : 70,
	_OtherHeight : 380,
	_vRecordCount : 0,
	
	BusyDialog : null,
	
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
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var oController = this;
		
		if(oEvent) {
			this._vStatu = oEvent.data.Statu;
			this._vReqno = oEvent.data.Reqno;
			this._vDocno = oEvent.data.Docno;
			this._vDocty = oEvent.data.Docty;
			this._oContext = oEvent.data.context;
			
			try {
				oModel.read(
						"/ActionReqListSet(Docno='" + this._vDocno + "')",
						null, 
						null, 
						false,
						function(oData, oResponse) {					
							if(oData) {
								oController._vOneReq = oData;
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
				);
			} catch(ex) {
				common.Common.log(ex);
			}

			var oStatusPanel = sap.ui.getCore().byId(this.PAGEID + "_StatusPanel");
			oStatusPanel.setExpanded(false);
			
			var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
			var oOrgeh = sap.ui.getCore().byId(this.PAGEID + "_Orgeh");
			var oReqno = sap.ui.getCore().byId(this.PAGEID + "_Reqno");
			var oTitle = sap.ui.getCore().byId(this.PAGEID + "_Title");
			var oActda = sap.ui.getCore().byId(this.PAGEID + "_Actda");
			var oReqda = sap.ui.getCore().byId(this.PAGEID + "_Reqda");
			var oNotes = sap.ui.getCore().byId(this.PAGEID + "_Notes");
			
			this._vStatu = this._vOneReq.Statu;
			
			this._vPersa = oController._vOneReq.Persa;
			this._vActda = dateFormat1.format(new Date(common.Common.setTime(new Date(oController._vOneReq.Actda))));
			
			this._PortalUri = oController._vOneReq.Uri;
			
			var vPostc = oController._vOneReq.Postc;
			
			oPersa.setText(oController._vOneReq.Pbtxt);
			var oPersaModel = sap.ui.getCore().getModel("PersaModel");
			var vPersaData = oPersaModel.getProperty("/PersAreaListSet");
			for(var i=0; i<vPersaData.length; i++) {
				if(oController._vOneReq.Persa == vPersaData[i].Persa) {
					this._vMolga = vPersaData[i].Molga;
					break;
				}
			}
			 
			oOrgeh.setText(oController._vOneReq.Reqdp);
			
			oReqno.setText(oController._vOneReq.Reqno);
			oTitle.setText(oController._vOneReq.Title);
			
			oNotes.setText(oController._vOneReq.Notes);
			oActda.setText(dateFormat.format(oController._vOneReq.Actda));
			oReqda.setText(dateFormat.format(oController._vOneReq.Reqda));
			
			var oCompleteBtn = sap.ui.getCore().byId(this.PAGEID + "_COMPLETE_BTN");
			var oSendMailBtn = sap.ui.getCore().byId(this.PAGEID + "_SENDMAIL_BTN");
			var oAnnounceBtn = sap.ui.getCore().byId(this.PAGEID + "_ANNOUNCE_BTN");
			var oRequestBtn = sap.ui.getCore().byId(this.PAGEID + "_REQUEST_BTN");
			

			if(this._vStatu == "30") {
				oCompleteBtn.setVisible(true);
				oSendMailBtn.setVisible(false);
				oAnnounceBtn.setVisible(true);
				oRequestBtn.setVisible(false);
				oAnnounceBtn.addCustomData(new sap.ui.core.CustomData({key : "Postc", value : vPostc}));
				if(vPostc == "X") {
					oAnnounceBtn.setText(oBundleText.getText("ANNOUNCE_CANCEL_BTN"));
				} else {
					oAnnounceBtn.setText(oBundleText.getText("ANNOUNCE_BTN"));
				}
			} else if(this._vStatu == "20") {
				oCompleteBtn.setVisible(true);
				oSendMailBtn.setVisible(false);
				oAnnounceBtn.setVisible(true);
				oRequestBtn.setVisible(false);
				oAnnounceBtn.addCustomData(new sap.ui.core.CustomData({key : "Postc", value : vPostc}));
				if(vPostc == "X") {
					oAnnounceBtn.setText(oBundleText.getText("ANNOUNCE_CANCEL_BTN"));
				} else {
					oAnnounceBtn.setText(oBundleText.getText("ANNOUNCE_BTN"));
				}
			} else if(this._vStatu == "50") {
				oCompleteBtn.setVisible(true);
				oSendMailBtn.setVisible(true);
				oAnnounceBtn.setVisible(true);
				oRequestBtn.setVisible(false);
				oAnnounceBtn.addCustomData(new sap.ui.core.CustomData({key : "Postc", value : vPostc}));
				if(vPostc == "X") {
					oAnnounceBtn.setText(oBundleText.getText("ANNOUNCE_CANCEL_BTN"));
				} else {
					oAnnounceBtn.setText(oBundleText.getText("ANNOUNCE_BTN"));
				}
			} else {
				oCompleteBtn.setVisible(false);
				oSendMailBtn.setVisible(false);
				oAnnounceBtn.setVisible(false);
				oRequestBtn.setVisible(false);
				oAnnounceBtn.removeAllCustomData();
			} 
		}
		
		var oViewRec_Btn = sap.ui.getCore().byId(this.PAGEID + "_View_Rec_Btn");
		if(oController._vDocty == "20") {
			oViewRec_Btn.setVisible(true);
		} else {
			oViewRec_Btn.setVisible(false);
		}
	},
	
	onAfterShow : function(oEvent) {
		
		var oController = this;
		
		var dataProcess = function() {	
			
			oController.reloadSubjectList(oController);
			
			oController.setProcessFlow(oController);
			
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
		if(typeof ActAppDocumentViewSubject == "object") {
			ActAppDocumentViewSubject.Reset();
		}
	},
	
	reloadSubjectList : function(oController) {
		if(oController._vDocty == "20")
			oController.setRecSubjectListColumn(oController);
		else
			oController.setSubjectListColumn(oController);
		
	}, 
	
	setProcessFlow : function(oController) {

		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var oProcessFlow = sap.ui.getCore().byId(oController.PAGEID + "_ProcessFlow");	
		var oStatusPanelTitle = sap.ui.getCore().byId(oController.PAGEID + "_StatusPanel_Title");
		
		oProcessFlow.removeAllLanes();
		oProcessFlow.removeAllNodes();
		
		var vStatusTitle = oBundleText.getText("TITLE_PROCESS_STATUS") + " : ";
		if(oController._vStatu == "10") vStatusTitle += oBundleText.getText("STATUS_CREATE");
		else if(oController._vStatu == "20") vStatusTitle += oBundleText.getText("STATUS_REQUEST");
		else if(oController._vStatu == "25") vStatusTitle += oBundleText.getText("STATUS_APPROVED");
		else if(oController._vStatu == "40") vStatusTitle += oBundleText.getText("STATUS_REJECT");
		else if(oController._vStatu == "30") vStatusTitle += oBundleText.getText("STATUS_CONFIRM");
		else if(oController._vStatu == "50") vStatusTitle += oBundleText.getText("STATUS_COMPLETE");
 
		oStatusPanelTitle.setText(vStatusTitle);
		
		var vLanes = [{laneId : oController.PAGEID + "_LaneHeader0", iconSrc : "sap-icon://create", text : oBundleText.getText("STATUS_CREATE"), status : "10"},
		              {laneId : oController.PAGEID + "_LaneHeader1", iconSrc : "sap-icon://approvals", text : oBundleText.getText("STATUS_REQUEST"), status : "20"},
		              {laneId : oController.PAGEID + "_LaneHeader2", iconSrc : "sap-icon://sys-enter", text : oBundleText.getText("STATUS_APPROVED"), status : "30"},
		              {laneId : oController.PAGEID + "_LaneHeader3", iconSrc : "sap-icon://accept", text : oBundleText.getText("STATUS_COMPLETE"), status : "40"},
		              {laneId : oController.PAGEID + "_LaneHeader4", iconSrc : "sap-icon://notification-2", text : oBundleText.getText("STATUS_ANNOUNCE"), status : "51"},
		              //{laneId : oController.PAGEID + "_LaneHeader5", iconSrc : "sap-icon://email", text : oBundleText.getText("STATUS_SENDMAIL"), status : "60"}		
		];
		
		for(var i=0; i<vLanes.length; i++) {
			var oLaneHeader = new sap.suite.ui.commons.ProcessFlowLaneHeader({
				laneId : vLanes[i].laneId,
				iconSrc : vLanes[i].iconSrc,
				text : vLanes[i].text,
				position : i,
				state : [{state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value:100}]
			}).addStyleClass("L2PCursorDefualt");
			
			var oNode = new sap.suite.ui.commons.ProcessFlowNode({
				laneId : vLanes[i].laneId,
				nodeId : (i) + "",
				title : oBundleText.getText("TITLE_ACT_REQUEST"),
				state : sap.suite.ui.commons.ProcessFlowNodeState.Planned
			}).addStyleClass("L2PCursorDefualt");
			
			if(i < 4) {
				oNode.setChildren([i+1]);
			} else {
				oNode.setChildren(null);
			}
			
			oProcessFlow.addLane(oLaneHeader);
			
			oProcessFlow.addNode(oNode);
		}
		
		var vLanes = oProcessFlow.getLanes();
		var vNodes = oProcessFlow.getNodes();
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd HH:mm"});
		
		try {
			var filterString = "?$filter=Reqno%20eq%20%27" + encodeURI(oController._vReqno) + "%27";
			filterString += "%20and%20Docno%20eq%20%27" + oController._vDocno + "%27";
			oModel.read(
					"/ActionReqChangeHistorySet/" + filterString,
					null, 
					null, 
					true,
					function(oData, oResponse) {					
						if(oData && oData.results) {
							for(var i =0; i<oData.results.length; i++) {
								var vReqst = oData.results[i].Reqst;
								if(vReqst == "10") {
									if(i == (oData.results.length -1)) {
										vLanes[0].setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value:50},
										                      {state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value:50}]);										
										vNodes[0].setState(sap.suite.ui.commons.ProcessFlowNodeState.Positive);
									} else {
										vLanes[0].setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value:100}]);										
										vNodes[0].setState(sap.suite.ui.commons.ProcessFlowNodeState.Neutral);
									}
									vNodes[0].setHighlighted(true);
									vNodes[0].setFocused(true);
									vNodes[0].setStateText(oBundleText.getText("STATUS_CREATE"));
									vNodes[0].setTexts([dateFormat.format(new Date(oData.results[i].Datim)) + " " + oData.results[i].Ename]);
								} else if(vReqst == "20") {
									if(i == (oData.results.length -1)) {
										vLanes[1].setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value:50},
										                      {state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value:50}]);										
										vNodes[1].setState(sap.suite.ui.commons.ProcessFlowNodeState.Positive);
									} else {
										vLanes[1].setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value:100}]);										
										vNodes[1].setState(sap.suite.ui.commons.ProcessFlowNodeState.Neutral);
									}
									vNodes[1].setHighlighted(true);
									vNodes[1].setFocused(true);
									vNodes[1].setStateText(oBundleText.getText("STATUS_REQUEST"));
									vNodes[1].setTexts([dateFormat.format(new Date(oData.results[i].Datim)) + " " + oData.results[i].Ename]);
								} else if(vReqst == "25") { 
									if(i == (oData.results.length -1)) {
										vLanes[1].setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value:50},
										                      {state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value:50}]);										
										vNodes[1].setState(sap.suite.ui.commons.ProcessFlowNodeState.Positive);
									} else {
										vLanes[1].setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value:100}]);										
										vNodes[1].setState(sap.suite.ui.commons.ProcessFlowNodeState.Neutral);
									}
									vNodes[1].setHighlighted(true);
									vNodes[1].setFocused(true);
									vNodes[1].setStateText(oBundleText.getText("STATUS_APPROVED"));
									//vNodes[1].seTexts([dateFormat.format(new Date(oData.results[i].Datlo)) + " " + oData.results[i].Ename]);
								} else if(vReqst == "30") { 
									if(i == (oData.results.length -1)) {
										vLanes[2].setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value:50},
										                      {state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value:50}]);										
										vNodes[2].setState(sap.suite.ui.commons.ProcessFlowNodeState.Positive);
									} else {
										vLanes[2].setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value:100}]);										
										vNodes[2].setState(sap.suite.ui.commons.ProcessFlowNodeState.Neutral);
									}
									vLanes[2].setText(oBundleText.getText("STATUS_CONFIRM"));
									vNodes[2].setHighlighted(true);
									vNodes[2].setFocused(true);
									vNodes[2].setStateText(oBundleText.getText("STATUS_CONFIRM"));
									vNodes[2].setTexts([dateFormat.format(new Date(oData.results[i].Datim)) + " " + oData.results[i].Ename]);
								} else if(vReqst == "40") {
									if(i == (oData.results.length -1)) {
										vLanes[2].setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value:100}]);										
										vNodes[2].setState(sap.suite.ui.commons.ProcessFlowNodeState.Negative);
									} else {
										vLanes[2].setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value:100}]);										
										vNodes[2].setState(sap.suite.ui.commons.ProcessFlowNodeState.Negative);
									}
									vLanes[2].setText(oBundleText.getText("STATUS_REJECT"));
									vNodes[2].setHighlighted(true);
									vNodes[2].setFocused(true);
									vNodes[2].setStateText(oBundleText.getText("STATUS_REJECT"));
									vNodes[2].setTexts([dateFormat.format(new Date(oData.results[i].Datim)) + " " + oData.results[i].Ename]);
								} else if(vReqst == "50") {
									if(i == (oData.results.length -1)) {
										vLanes[3].setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value:50},
										                      {state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value:50}]);										
										vNodes[3].setState(sap.suite.ui.commons.ProcessFlowNodeState.Positive);
									} else {
										vLanes[3].setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value:100}]);										
										vNodes[3].setState(sap.suite.ui.commons.ProcessFlowNodeState.Neutral);
									}
									vNodes[3].setHighlighted(true);
									vNodes[3].setFocused(true);
									vNodes[3].setStateText(oBundleText.getText("STATUS_COMPLETE"));
									vNodes[3].setTexts([dateFormat.format(new Date(oData.results[i].Datim)) + " " + oData.results[i].Ename]);
								} else if(vReqst == "51") {
									if(i == (oData.results.length -1)) {
										vLanes[4].setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value:50},
										                      {state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value:50}]);										
										vNodes[4].setState(sap.suite.ui.commons.ProcessFlowNodeState.Positive);
									} else {
										vLanes[4].setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value:100}]);										
										vNodes[4].setState(sap.suite.ui.commons.ProcessFlowNodeState.Neutral);
									}
									vNodes[4].setHighlighted(true);
									vNodes[4].setFocused(true);
									vNodes[4].setStateText(oBundleText.getText("STATUS_ANNOUNCE"));
									vNodes[4].setTexts([dateFormat.format(new Date(oData.results[i].Datim)) + " " + oData.results[i].Ename]);
								} else if(vReqst == "60") {
									if(i == (oData.results.length -1)) {
										vLanes[5].setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value:50},
										                      {state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value:50}]);										
										vNodes[5].setState(sap.suite.ui.commons.ProcessFlowNodeState.Positive);
									} else {
										vLanes[5].setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value:100}]);										
										vNodes[5].setState(sap.suite.ui.commons.ProcessFlowNodeState.Neutral);
									}
									vNodes[5].setHighlighted(true);
									vNodes[5].setFocused(true);
									vNodes[5].setStateText(oBundleText.getText("STATUS_SENDMAIL"));
									vNodes[5].setTexts([dateFormat.format(new Date(oData.results[i].Datim)) + " " + oData.results[i].Ename]);
								}
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
	},
	
	displayDetailView : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
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
	

	navToBack : function(oEvent){
		sap.ui.getCore().getEventBus().publish("nav", "back", {
//		      id : "zui5_hrxx_actapp.ActAppMain",
//		      data : {
//		       
//		      }
		    });		
	},
	
	onAfterOpenPopover : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
		var oController = oView.getController();
		
		if(oController._vDocty == "20") {
			zui5_hrxx_actapp.common.Common.onAfterOpenRecDetailViewPopover(oController);
		} else {
			zui5_hrxx_actapp.common.Common.onAfterOpenDetailViewPopover(oController);
		}
		
	},
	
	onPressCell : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
		var oController = oView.getController();
		
		var oControl = oEvent.getParameter("cellControl");
		var oCustomData = oControl.getCustomData();
		
		oController._vSelected_Reqno = null;
		oController._vSelected_Reqno = null;
		oController._vSelected_Actda = null;
		
		if(oCustomData && oCustomData.length && oCustomData.length > 2) {
			for(var i=0; i<oCustomData.length; i++) {
				if(oCustomData[i].getKey() == "Reqno") {
					oController._vSelected_Reqno = oCustomData[i].getValue();
				} else if(oCustomData[i].getKey() == "Pernr") {
					oController._vSelected_Pernr = oCustomData[i].getValue();
				} else if(oCustomData[i].getKey() == "Actda") {
					oController._vSelected_Actda = oCustomData[i].getValue();
				}
			}
			
			if(oController._vSelected_Reqno != "") {
				if(!oController._DetailViewPopover) {
					oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActionDetailView", oController);
					oView.addDependent(oController._DetailViewPopover);
				}
				
				oController._DetailViewPopover.openBy(oControl);
			}
		}
	},
	
	downloadExcel : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
		var oController = oView.getController();
		
		var vCols = "Ename|Acttx|Actda1|Batyp|Sub01|Sub02|Sub03|Sub04|Sub05|Sub06|Sub07|Sub08|";
		for(var i=0; i<oController.vDisplayControl.length; i++) {
			var Fieldname = oController.vDisplayControl[i].Fieldname;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			var TextFieldname = Fieldname + "_Tx";
			vCols += TextFieldname + "_Hidden|";
		}
		
		var params = { FileName : "ActionSubject.xls",  SheetName : "Sheet", Merge : 1, HiddenColumn : 0, DownCols : vCols} ;
		if(typeof ActAppDocumentViewSubject == "object") {
			ActAppDocumentViewSubject.Down2Excel(params);
		}
	},
	
	onPressCompelte : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
		var oController = oView.getController();
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");
		var vCfmynCount = 0;
		if(vActionSubjectList && vActionSubjectList.length) {
			for(var i=0; i<vActionSubjectList.length; i++) {
				if(vActionSubjectList[i].Cfmyn != "X") {
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
/* End Update */
		
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
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp.ActAppDocumentView"
		      }
		});	
	},
	
	onPressAnnounce : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
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
			    	 FromPageId : "zui5_hrxx_actapp.ActAppDocumentView"
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
	
	onPressDocPreview : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
		var oController = oView.getController();
		
		if(oController._PortalUri != "") {
			var win1 = window.open(oController._PortalUri, "DOCPREVIEW");
			win1.focus();
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_NO_URL"));
		}
	},
	
	onPressPreview : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
		var oController = oView.getController();
		
		if(!oController._PreviewDialog) {
			oController._PreviewDialog = sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActionAppPreview", oController);
			oView.addDependent(oController._PreviewDialog);
		}
		oController._PreviewDialog.open();
	},
	
	onAAPClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
		var oController = oView.getController();
		
		if(oController._PreviewDialog && oController._PreviewDialog.isOpen()) {
			oController._PreviewDialog.close();
		}
	},
	
	onBeforeOpenHtmlDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var oPanel = sap.ui.getCore().byId(oController.PAGEID + "_APP_HtmlPanel");
		var oHtml = new sap.ui.core.HTML({preferDOM : true, sanitizeContent : false}).addStyleClass("L2PBackgroundWhite");
		
		oPanel.removeAllContent();
		oPanel.destroyContent();
		try {
			oModel.read("/ActionAppHtmlSet(Docno='" + oController._vDocno + "')",
//					+ "Reqno='" + encodeURI(oController._vReqno) + "')", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData) {
							oHtml.setContent(oData.Htmlc);
						}
					},
					function(oResponse) {
						oHtml.setContent("<div><h3 style='color:darkred'>미리보기 HTML을 가져오는데 실패하였습니다.</h3></div>");
						common.Common.log(oResponse);
					}
			);
		} catch(ex) {
			common.Common.log(ex);
		}
		oPanel.addContent(oHtml);
	},
	
/**********************************************************************************************************
 *** 추가메일전송 시작                                                                                  ***
 ***                                                                                                    ***
 **********************************************************************************************************/	
	_ODialogPopupMailingList : null,
	_AddPersonDialog : null,
	_SerachOrgDialog : null,
	_oMsgObj : {Msg:"", Cnt:0, AllSuccess:true},
	_oNum : 0,
	
	ProgInd : new sap.ui.commons.ProgressIndicator({
        width: "100%",
        percentValue : 0,
        displayValue : "Sending eMail, please wait... ",
        barColor: sap.ui.core.BarColor.POSITIVE
     }),
	
	// 메일대상자 리스트 팝업창이 닫히기전에 Json초기화
	onBeforeCloseMailingListDialog : function(oEvent) {
		var oTableMail = sap.ui.getCore().byId("MailingList_Table");
		var oJSONModel = oTableMail.getModel();
		oJSONModel.setData(null);
	},
	
	// 메일대상자 리스트 팝업창을 연다.
	onPressSendEmail : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
		var oController = oView.getController();
		
		if(!oController._ODialogPopupMailingList) {
			oController._ODialogPopupMailingList = sap.ui.jsfragment("zui5_hrxx_actapp.fragment.MailingList", oController);
			oView.addDependent(oController._ODialogPopupMailingList);
		}
		oController._ODialogPopupMailingList.open();
	},
	
	// 메일대상자 리스트 팝업창을 닫는다.
	onSendEmailClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
		var oController = oView.getController();
		
		if(oController._ODialogPopupMailingList && oController._ODialogPopupMailingList.isOpen()) {
			oController._ODialogPopupMailingList.close();
		}
	},
	
	// 메일전송 Progress Bar 생성 및 메일전송 Function 호출
	onSendMail : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
		var oController = oView.getController();
		
		
		if(oController.BusyDialog) {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(oController.ProgInd);
			oController.ProgInd.setPercentValue(0);
		} else {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(oController.ProgInd);
			oController.ProgInd.setPercentValue(0);
			oController.getView().addDependent(oController.BusyDialog);
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		setTimeout(oController.onSendMailAction,300);
	},
	
	// 메일전송
	onSendMailAction : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
		var oController = oView.getController();

		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		var oTableMail = sap.ui.getCore().byId("MailingList_Table");
		var oJSONModel = oTableMail.getModel();
		var JSONData = oJSONModel.getProperty("/ActionMailingList");
		
		
		var sendMail = function() {    //num, theObject) {
			var createData = {
					"Docno"  : JSONData[oController._oNum].Docno,
					"Persa"  : JSONData[oController._oNum].Persa, 
					"Reqno"  : JSONData[oController._oNum].Reqno, 
					"Pernr"  : JSONData[oController._oNum].Pernr, 
					"Rnoyn"  : JSONData[oController._oNum].Rnoyn ? "X" : "", 
					"Pnryn"  : JSONData[oController._oNum].Pnryn ? "X" : "", 
					"Payyn"  : JSONData[oController._oNum].Payyn ? "X" : "",
					"Type" : "",
					"Message" : ""
			};
							
			oModel.create(
					"/ActionMailRecipientSet", 
					createData, 
					null,
				    function (oData, response) {
  						if(oController._oMsgObj.Msg != "") oController._oMsgObj.Msg += "\n";
  						if(oData.Type == "S"){
  							oController._oMsgObj.Msg += "[" + oBundleText.getText("MSG_WARN_SUCCESS") + "] " 
  							            + oData.Message;
  						} else {
  							oController._oMsgObj.Msg += "[" + oBundleText.getText("MSG_WARN_FAIL") + "] " 
  							            + oData.Message;
  							oController._oMsgObj.AllSuccess = false;
  						}
				    },
				    function (oError) {}
		    );
			oController._oNum++;
			if(oController._oMsgObj.Cnt > oController._oNum) {
				setTimeout(sendMail, 500);    //, num, theObject);
				var vPercentValue = parseInt((oController._oNum+1)/oController._oMsgObj.Cnt*100);
				if(vPercentValue > 80) vPercentValue = 100;
				else vPercentValue += 20;
				oController.ProgInd.setPercentValue(vPercentValue);
			} else {
				oController.ProgInd.setPercentValue(100);
				if(oController._oMsgObj.Msg != "") {
					if(oController._oMsgObj.AllSuccess) {
						sap.m.MessageBox.alert(oController._oMsgObj.Msg, {
							title : oBundleText.getText("MSG_TITLE_INFORMATION"),
							onClose : oController.onSendEmailClose,
							styleClass : "L2PMessageDialog"
						});
					} else {
						sap.m.MessageBox.alert(oController._oMsgObj.Msg, {
							title : oBundleText.getText("MSG_TITLE_INFORMATION"),
							styleClass : "L2PMessageDialog"
						});
					}
				}
				if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
					oController.BusyDialog.removeAllContent();
					oController.BusyDialog.destroyContent();
					oController.BusyDialog.close();
					oController.BusyDialog = null;
				}
			}
		};
		
		if(JSONData && JSONData.length) {
			oController._oMsgObj.Cnt = JSONData.length;
			oController._oMsgObj.Msg = "";
			oController._oMsgObj.AllSuccess = true;
			
			oController._oNum = 0;
			
			sendMail();
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_WARN_MAILINGLIST")); 
			return;
		}
	},
	
	// 메일수신자 삭제
	delPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
		var oController = oView.getController();
		
		var oTableMail = sap.ui.getCore().byId("MailingList_Table");
		var vContexts = oTableMail.getSelectedContexts(true);
		var oJSONModel = oTableMail.getModel();
		var JSONData = oJSONModel.getProperty("/ActionMailingList");
		var vTmp = {ActionMailingList:[]};
		
		var vNumbr = 1;
		
		if(JSONData && JSONData.length) {
			if(vContexts && vContexts.length) {
				for(var i = 0; i < JSONData.length; i++) {
					var checkDel = false;
					for(var j = 0; j < vContexts.length; j++) {
						if(JSONData[i].Pernr == vContexts[j].getProperty("Pernr")) {
							checkDel = true;
							break;
						}
					}
					if(checkDel) continue;
					JSONData[i].Numbr = vNumbr++;
					vTmp.ActionMailingList.push(JSONData[i]);
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
	
	// 직원검색 POPUP창을 연다 (메일수신자 추가)
	addPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
		var oController = oView.getController();
		
		common.SearchUser2.oController = oController;
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch2", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		oController._AddPersonDialog.open();
	},

	// 검색된 사원 메일수신자 리스트에 추가
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
		var oController = oView.getController();
		
//		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ES_Table");
//		var mEmpSearchResult = oTable.getModel();
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		
		var oTableMail = sap.ui.getCore().byId("MailingList_Table");
		var oJSONModel = oTableMail.getModel();
		
		var JSONData = oJSONModel.getProperty("/ActionMailingList");
		var vTmp = {ActionMailingList:[]};
		
		var vNumbr = 1;
		var vNoData = true;
		
		if(vEmpSearchResult && vEmpSearchResult.length) {
			// 기존데이타
			if(JSONData && JSONData.length) {
				for(var i = 0; i < JSONData.length; i++) {
					JSONData[i].Numbr = vNumbr++;
					vTmp.ActionMailingList.push(JSONData[i]);
				}
			}
			
			// 신규추가 데이타
			for(var i=0; i<vEmpSearchResult.length; i++) {
				if(vEmpSearchResult[i].Chck == true) {
					var checkDup = false;
					vNoData = false;

					for(var j = 0; j < vTmp.ActionMailingList.length; j++){
						if(mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pernr") == vTmp.ActionMailingList[j].Pernr) {
							checkDup = true;
							break;
						}
					}
					if(checkDup) continue;
					
					vTmp.ActionMailingList.push({
						Numbr : vNumbr++,
						Docno : oController._vDocno,
						Persa : oController._vPersa,
						Reqno : oController._vReqno,
						Pernr : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pernr"),
						Ename : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Ename"), 
						Fulln : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Fulln"),
						Rnoyn : false,
						Pnryn : false,
						Payyn : false
					});
				} 
			}
			
			if(vNoData) {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
				return;
			} else {
				oJSONModel.setData(vTmp);
			}
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
			return;
		}
		
		common.SearchUser2.onClose();
	},
	
	// 조직검색 POPUP 창을 연다
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Multi";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "MultiInput";
		
		if(!oController._SerachOrgDialog) {
			oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SerachOrgDialog);
		}
		oController._SerachOrgDialog.open();
	},
/**********************************************************************************************************
 *** 추가메일전송 끝                                                                                    ***
 ***                                                                                                    ***
 **********************************************************************************************************/
	
	onResizeWindow : function(oEvent, oEventId, data) {
		$("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 350);
	},
	
	onAfterRenderingTable : function(oController) {
		
		if(typeof ActAppDocumentViewSubject == "undefined") {
			var vLang = "";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") == -1) vLang = "en";
			
			createIBSheet2(document.getElementById(oController.PAGEID + "_SubjectList"), "ActAppDocumentViewSubject", "100%",  (window.innerHeight - 350) + "px", vLang);
		}
		
		ActAppDocumentViewSubject.Reset();
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
		
		var vColumns = [ {id : "Pchk", label : "", control : "Hidden", width : 30, align : "Center"},
		                 {id : "Ename_Html", label : oBundleText.getText("ENAME"), control : "Html", width : 150, align : "Left"},
		                 {id : "Acttx", label : oBundleText.getText("ACTTX"), control : "Html", width : 200, align : "Left"},
		                 {id : "Actda1", label : oBundleText.getText("ACTDA"), control : "Text", width : 100, align : "Center"},
		                 {id : "Batyp_Html", label : oBundleText.getText("BATYP"), control : "Html", width : 70, align : "Center"},
		                 {id : "Pernr", label : oBundleText.getText("PERNR"), control : "Hidden", width : 70, align : "Center"},
		                 {id : "Docno", label : oBundleText.getText("DOCNO"), control : "Hidden", width : 70, align : "Center"},
		                 {id : "Reqno", label : oBundleText.getText("REQNO"), control : "Hidden", width : 70, align : "Center"},
		                 {id : "Actda", label : oBundleText.getText("ACTDA"), control : "Hidden", width : 70, align : "Center"},
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
		
		if(typeof ActAppDocumentViewSubject == "undefined") {
			var vLang = "";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") == -1) vLang = "en";
			
			createIBSheet2(document.getElementById(oController.PAGEID + "_SubjectList"), "ActAppDocumentViewSubject", "100%",  (window.innerHeight - 360) + "px", vLang);
		}
		
		ActAppDocumentViewSubject.Reset();
		
		ActAppDocumentViewSubject.SetTheme("DS","ActApp");
		
		var initdata = {};
		
		//initdata.Cfg = {FrozenCol:5, SearchMode:smLazyLoad, SizeMode:0, CustomScroll:1, Page:20, SmartResize:1, MergeSheet:msHeaderOnly};  //MergeSheet:msHeaderOnly,

		//InitHeaders의 두번째 인자
		initdata.HeaderMode = {Sort:0,ColMove:0,ColResize:1,HeaderCheck:0};
		
		initdata.Cols = [];
		var vTotalWidth = 0;
		
		for(var i=0; i<vColumns.length; i++) {
			var oneCol = {};
			
			oneCol.Header = vColumns[i].label;			
			oneCol.Edit = 0;
			//if(i > 0) oneCol.Edit = 0;
			oneCol.Type = vColumns[i].control;
			oneCol.Width = vColumns[i].width;
			oneCol.SaveName = vColumns[i].id;
			oneCol.Align = vColumns[i].align;
			oneCol.Sort = 0;
			initdata.Cols.push(oneCol);
			
			if(vColumns[i].control ==  "Hidden") {
				oneCol.Type = "Text";
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
				if(Fieldname == "Zzjobgr") {
					oneCol.Sort = 0;
				} else {
					oneCol.Sort = 0;
				}
				
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
		
		IBS_InitSheet(ActAppDocumentViewSubject, initdata);
		if(vTotalWidth < window.innerWidth) {
			//ActAppDocumentViewSubject.FitColWidth();
		}			
		ActAppDocumentViewSubject.SetSelectionMode(0);
		
		ActAppDocumentViewSubject.SetCellFont("FontSize", 0, "Pchk", ActAppDocumentViewSubject.HeaderRows(), "vDummy", 13);
		ActAppDocumentViewSubject.SetCellFont("FontName", 0, "Pchk", ActAppDocumentViewSubject.HeaderRows(), "vDummy", "Malgun Gothic");
		
		ActAppDocumentViewSubject.SetHeaderRowHeight(32);
		ActAppDocumentViewSubject.SetDataRowHeight(32);
		
		ActAppDocumentViewSubject.SetFocusAfterProcess(0);
		
		if(oController._vStatu == "00") {			
			return;
		}

		var fCompleteCount = false; 
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = {ActionSubjectListSet : []};
		var oPath = "/ActionSubjectListSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27"
        		  + "%20and%20Reqno%20eq%20%27" + encodeURI(oController._vReqno) + "%27";
		
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
							                        + "<div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup3(" + (i+1) + ")'>" + oData.results[i].Ename + "</div>"
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
		
		ActAppDocumentViewSubject.LoadSearchData(SubjectListData);
		
		oController._vListLength = SubjectListData.data.length;
		
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		
		if(fCompleteCount) {
			if(oDeleteBtn) oDeleteBtn.setVisible(false);
		} else {
			if(oDeleteBtn) oDeleteBtn.setVisible(true);
		}
	},
	
	viewRecPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
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
			sap.m.MessageBox.alert(oBundleText.getText("MSG_VIEW_TARGET"));
			return;
		}
		
		if(check_idxs.length != 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_WARN_VIEW"));
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
		    	 context : oController._oContext,
		    	 Pdata : vActionSubjectListSet[check_idxs[0]],
		    	 FromPageId : "zui5_hrxx_actapp.ActAppDocumentView",
		    	 Recno : vActionSubjectListSet[check_idxs[0]].Recno,
		    	 VoltId : vActionSubjectListSet[check_idxs[0]].VoltId
		      }
		});		
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
		                 {id : "Ename_Html", label : oBundleText.getText("ENAME"), control : "Html", width : "150", align: "Left"},		//성명
		                 {id : "Acttx", label : oBundleText.getText("ACTTX"), control : "Html", width : "200", align: "Left"},		//발령유형
		                 {id : "Actda1", label : oBundleText.getText("ACTDA"), control : "Text", width : "80", align: "Center"},		//발령일
		                 {id : "Sub01_Img", data : "Sub01", label : oBundleText.getText("TSUB01"), control : "Img", width : "50", align: "Center"},		//인적
		                 {id : "Sub02_Img", data : "Sub02", label : oBundleText.getText("TSUB02"), control : "Img", width : "50", align: "Center"},		//학력
		                 {id : "Sub03_Img", data : "Sub03", label : oBundleText.getText("TSUB03"), control : "Img", width : "50", align: "Center"},		//경력
		                 {id : "Sub04_Img", data : "Sub04", label : oBundleText.getText("TSUB04"), control : "Img", width : "50", align: "Center"},		//어학
		                 {id : "Sub06_Img", data : "Sub06", label : oBundleText.getText("TSUB06"), control : "Img", width : "50", align: "Center"},		//자격
		                 {id : "Sub07_Img", data : "Sub07", label : oBundleText.getText("TSUB07"), control : "Img", width : "50", align: "Center"},		//병역
		                 {id : "Sub08_Img", data : "Sub08", label : oBundleText.getText("TSUB08"), control : "Img", width : "50", align: "Center"},		//재입사
		                 {id : "Sub01", data : "Sub01", label : oBundleText.getText("TSUB01"), control : "Hidden", width : "50", align: "Center"},		//인적
		                 {id : "Sub02", data : "Sub02", label : oBundleText.getText("TSUB02"), control : "Hidden", width : "50", align: "Center"},		//학력
		                 {id : "Sub03", data : "Sub03", label : oBundleText.getText("TSUB03"), control : "Hidden", width : "50", align: "Center"},		//경력
		                 {id : "Sub04", data : "Sub04", label : oBundleText.getText("TSUB04"), control : "Hidden", width : "50", align: "Center"},		//어학
		                 {id : "Sub06", data : "Sub06", label : oBundleText.getText("TSUB06"), control : "Hidden", width : "50", align: "Center"},		//자격
		                 {id : "Sub07", data : "Sub07", label : oBundleText.getText("TSUB07"), control : "Hidden", width : "50", align: "Center"},		//병역
		                 {id : "Sub08", data : "Sub08", label : oBundleText.getText("TSUB08"), control : "Hidden", width : "50", align: "Center"},		//재입사
		                 {id : "Actda", label : oBundleText.getText("ACTDA"), control : "Hidden", width : 70, align : "Center"},
		                 {id : "Ename", label : oBundleText.getText("ENAME"), control : "Hidden", width : 70, align : "Center"},
		                 {id : "VoltId", label : oBundleText.getText("VOLTID"), control : "Hidden", width : 70, align : "Center"},
		                ];
		} else {
			vColumns = [ {id : "Pchk", label : "", control : "CheckBox", width : 30, align : "Center"},
		                 {id : "Ename_Html", label : oBundleText.getText("ENAME"), control : "Html", width : "150", align: "Left"},		//성명
		                 {id : "Acttx", label : oBundleText.getText("ACTTX"), control : "Text", width : "200", align: "Left"},		//발령유형
		                 {id : "Actda1", label : oBundleText.getText("ACTDA"), control : "Text", width : "80", align: "Center"},		//발령일
		                 {id : "Sub01_Img", data : "Sub01", label : oBundleText.getText("TSUB01"), control : "Img", width : "50", align: "Center"},		//인적
		                 {id : "Sub02_Img", data : "Sub02", label : oBundleText.getText("TSUB02"), control : "Img", width : "50", align: "Center"},		//학력
		                 {id : "Sub03_Img", data : "Sub03", label : oBundleText.getText("TSUB03"), control : "Img", width : "50", align: "Center"},		//경력
		                 {id : "Sub04_Img", data : "Sub04", label : oBundleText.getText("TSUB04"), control : "Img", width : "50", align: "Center"},		//어학
		                 {id : "Sub06_Img", data : "Sub06", label : oBundleText.getText("TSUB06"), control : "Img", width : "50", align: "Center"},		//자격
		                 {id : "Sub08_Img", data : "Sub08", label : oBundleText.getText("TSUB08"), control : "Img", width : "50", align: "Center"},		//재입사
		                 {id : "Sub01", data : "Sub01", label : oBundleText.getText("TSUB01"), control : "Hidden", width : "50", align: "Center"},		//인적
		                 {id : "Sub02", data : "Sub02", label : oBundleText.getText("TSUB02"), control : "Hidden", width : "50", align: "Center"},		//학력
		                 {id : "Sub03", data : "Sub03", label : oBundleText.getText("TSUB03"), control : "Hidden", width : "50", align: "Center"},		//경력
		                 {id : "Sub04", data : "Sub04", label : oBundleText.getText("TSUB04"), control : "Hidden", width : "50", align: "Center"},		//어학
		                 {id : "Sub06", data : "Sub06", label : oBundleText.getText("TSUB06"), control : "Hidden", width : "50", align: "Center"},		//자격
		                 {id : "Sub08", data : "Sub08", label : oBundleText.getText("TSUB08"), control : "Hidden", width : "50", align: "Center"},		//재입사
		                 {id : "Actda", label : oBundleText.getText("ACTDA"), control : "Hidden", width : 70, align : "Center"},
		                 {id : "Ename", label : oBundleText.getText("ENAME"), control : "Hidden", width : 70, align : "Center"},
		                 {id : "VoltId", label : oBundleText.getText("VOLTID"), control : "Hidden", width : 70, align : "Center"},
		                ];
		}
		vColumns.push({id : "Pernr", label : oBundleText.getText("PERNR"), control : "Hidden", width : 70, align : "Center"});
		vColumns.push({id : "Docno", label : oBundleText.getText("DOCNO"), control : "Hidden", width : 70, align : "Center"});
		vColumns.push({id : "Reqno", label : oBundleText.getText("REQNO"), control : "Hidden", width : 70, align : "Center"});
		vColumns.push({id : "Actda1", label : oBundleText.getText("ACTDA"), control : "Hidden", width : 70, align : "Center"});
		
		if(typeof ActAppDocumentViewSubject == "undefined") {
			var vLang = "";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") == -1) vLang = "en";
			
			createIBSheet2(document.getElementById(oController.PAGEID + "_SubjectList"), "ActAppDocumentViewSubject", "100%",  (window.innerHeight - 360) + "px", vLang);
		}
		
		ActAppDocumentViewSubject.Reset();
		
		ActAppDocumentViewSubject.SetTheme("DS","GhrisMain");
		
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
				oneCol.Type = "Text";
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
		
		IBS_InitSheet(ActAppDocumentViewSubject, initdata);
		if(vTotalWidth < window.innerWidth) {
			//ActAppDocumentViewSubject.FitColWidth();
		}			
		ActAppDocumentViewSubject.SetSelectionMode(0);
		
		ActAppDocumentViewSubject.SetCellFont("FontSize", 0, "Pchk", ActAppDocumentViewSubject.HeaderRows(), "vDummy", 13);
		ActAppDocumentViewSubject.SetCellFont("FontName", 0, "Pchk", ActAppDocumentViewSubject.HeaderRows(), "vDummy", "Malgun Gothic");
		
		ActAppDocumentViewSubject.SetHeaderRowHeight(32);
		ActAppDocumentViewSubject.SetDataRowHeight(32);
		
		ActAppDocumentViewSubject.SetFocusAfterProcess(0);
		
		if(oController._vStatu == "00") {			
			return;
		}
	
		var fCompleteCount = false; 
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = {ActionSubjectListSet : []};
		var oPath = "/ActionSubjectListSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27"
        		  + "%20and%20Reqno%20eq%20%27" + encodeURI(oController._vReqno) + "%27";
		
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
							oneData.ProcessStatusText = oBundleText.getText("WAIT_STATUS");
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
							
							if(oData.results[i].Cfmyn == "X") oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'>" + icon1 + "</td><td style='padding-left:5px; border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup3(" + (i+1) + ")'>" + oData.results[i].Ename + "</div>";
							else if(oData.results[i].Cfmyn == "E") oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'>" + icon2 + "</td><td style='padding-left:5px; border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup3(" + (i+1) + ")'>" + oData.results[i].Ename + "</div>";
							else if(oData.results[i].Cfmyn == "L") oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'>" + icon3 + "</td><td style='padding-left:5px; border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup3(" + (i+1) + ")'>" + oData.results[i].Ename + "</div>";
							else oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup3(" + (i+1) + ")'>" + oData.results[i].Ename + "&nbsp;&nbsp;&nbsp;</div>";
							
							oneDataSheet.Ename_Html += "<div class='L2P13Font'>(" + oData.results[i].Pernr + ")</div>";
							oneDataSheet.Ename_Html += "</td></tr></table>";
							
							oneDataSheet.Ename = oData.results[i].Ename + " (" + oData.results[i].Pernr + ")";
							
							for(var j=0; j<vColumns.length; j++) {
								if(vColumns[j].control == "Img") {
									var val = eval("oData.results[i]." + vColumns[j].data + ";");
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
								
								var val = eval("oData.results[i]." + TextFieldname + ";");	
								eval("oneDataSheet." + TextFieldname + " = val;");
								eval("oneDataSheet." + TextFieldname + "_Hidden" + " = val;");
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
		
		ActAppDocumentViewSubject.LoadSearchData(SubjectListData);
		
		oController._vListLength = SubjectListData.data.length;
		
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		
		if(fCompleteCount) {
			if(oDeleteBtn) oDeleteBtn.setVisible(false);
		} else {
			if(oDeleteBtn) oDeleteBtn.setVisible(true);
		}
	},
	
	onPressRequest : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
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
		    	 FromPageId : "zui5_hrxx_actapp.ActAppDocumentView"
		      }
		});		
	},
	
	onChangeStatus : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
		var oController = oView.getController();
		
		var onProcessChange = function(fVal) {
			if(fVal && fVal == "OK") {
				var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
				
				var updateData = {};
				updateData.Docno = oController._vDocno;
				updateData.Persa = oController._vPersa;
				updateData.Reqno = oController._vReqno;
				updateData.Actty = "S";
				
				var oPath = "/ActionReqListSet('" + oController._vDocno + "')";
				var process_result = false;
				oModel.update(
						oPath, 
						updateData, 
						null,
					    function (oData, response) {
							process_result = true;
							common.Common.log("Sucess ActionReqListSet UPdate !!!");
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
					sap.m.MessageBox.alert(oBundleText.getText("MSG_CHANGE_STATUS_COMPLETE"), {
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
		
		sap.m.MessageBox.confirm(oBundleText.getText("MSG_CHANGE_STATUS_CONFIRM"), {
			title : oBundleText.getText("CONFIRM_BTN"),
			onClose : onProcessChange
		});
	}, 
	
	
});

function onInfoViewPopup3(rowId) {
	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
	var oController = oView.getController();
	
	oController._vSelected_Pernr = null;
	oController._vSelected_Reqno = null;
	oController._vSelected_Actda = null;
	oController._vSelected_Docno = null;
	
	if(typeof ActAppDocumentViewSubject == "object") {
		oController._vSelected_Pernr = ActAppDocumentViewSubject.GetCellValue(rowId, "Pernr");
		oController._vSelected_Reqno = ActAppDocumentViewSubject.GetCellValue(rowId, "Reqno");
		oController._vSelected_Actda = ActAppDocumentViewSubject.GetCellValue(rowId, "Actda");
		oController._vSelected_Docno = ActAppDocumentViewSubject.GetCellValue(rowId, "Docno");
		oController._vSelected_VoltId = ActAppDocumentViewSubject.GetCellValue(rowId, "VoltId");
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

function ActAppDocumentViewSubject_OnSearchEnd(result) {
	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActAppDocumentView");
	var oController = oView.getController();
	
	if(ActAppDocumentViewSubject.RowCount() > 0) {
		ActAppDocumentViewSubject.FitSize(1, 1);
//		ActAppDocumentViewSubject.SetColWidth(1, 150);
	}
	ActAppDocumentViewSubject.SetExtendLastCol(true);
	
	ActAppDocumentViewSubject.SetCellFont("FontSize", 0, "Pchk", ActAppDocumentViewSubject.RowCount() + ActAppDocumentViewSubject.HeaderRows(), "vDummy", 13);
	ActAppDocumentViewSubject.SetCellFont("FontName", 0, "Pchk", ActAppDocumentViewSubject.RowCount() + ActAppDocumentViewSubject.HeaderRows(), "vDummy", "Malgun Gothic");
	
	if(oController._vDocty != "20") {
		var vHeaderRows = ActAppDocumentViewSubject.HeaderRows();
		for(var r=0; r<ActAppDocumentViewSubject.RowCount(); r++) {
			if((r % 2) == 0) {
				ActAppDocumentViewSubject.SetMergeCell((r+vHeaderRows),0,2,1);
				ActAppDocumentViewSubject.SetMergeCell((r+vHeaderRows),1,2,1);
				ActAppDocumentViewSubject.SetMergeCell((r+vHeaderRows),2,2,1);
				ActAppDocumentViewSubject.SetMergeCell((r+vHeaderRows),3,2,1);
			}
		}
	}
}

function ActAppDocumentViewSubject_OnBeforeCheck(Row, Col) {
	var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
	var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");
	
	var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
	
	var vPernr = ActAppDocumentViewSubject.GetCellValue(Row, "Pernr");
	var vActda = ActAppDocumentViewSubject.GetCellValue(Row, "Actda");
	var vVoltId = ActAppDocumentViewSubject.GetCellValue(Row, "VoltId");
	if(vPernr == "") return;
	
	var r_idx = -1;
	for(var i=0; i<vActionSubjectList.length; i++) {
		if(vPernr == vActionSubjectList[i].Pernr 
				&& dateFormat.format(new Date(vActda)) == dateFormat.format(vActionSubjectList[i].Actda)
				&& vVoltId == vActionSubjectList[i].VoltId) {
			r_idx = i;
			break;
		}
	}
	
	if(r_idx != -1) {
		if(ActAppDocumentViewSubject.GetCellValue(Row, "Pchk") == 0) {
			mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", true);
		} else {
			mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", false);
		}
	}
}
