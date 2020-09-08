jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.SearchUser2");
jQuery.sap.require("common.Common");
jQuery.sap.require("zui5_hrxx_actapp2.common.Common");

sap.ui.controller("zui5_hrxx_actapp2.ActAppDocumentView", {

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
	
	_vActiveTabNames : null,
	
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
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
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
			
			oPersa.setText(oController._vOneReq.Butxt + " / " + oController._vOneReq.Pbtxt);
			var oPersaModel = sap.ui.getCore().getModel("PersaModel");
			var vPersaData = oPersaModel.getProperty("/PersAreaListSet");
			for(var i=0; i<vPersaData.length; i++) {
				if(oController._vOneReq.Persa == vPersaData[i].Persa) {
					oController._vMolga = vPersaData[i].Molga;
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

			if(this._vStatu == "30") {
				oCompleteBtn.setVisible(true);
			} else if(this._vStatu == "20") {
				oCompleteBtn.setVisible(true);
			} else if(this._vStatu == "50") {
				oCompleteBtn.setVisible(true);
			} else {
				oCompleteBtn.setVisible(false);
			} 
		}
		
		var oViewRec_Btn = sap.ui.getCore().byId(this.PAGEID + "_View_Rec_Btn");
		if(oController._vDocty == "20" || oController._vDocty == "50") {
			oViewRec_Btn.setVisible(true);
		} else {
			oViewRec_Btn.setVisible(false);
		}
		
		if(oController._vDocty == "20") {
			oViewRec_Btn.setText(oBundleText.getText("VIEW_REC_BTN"));
		} else if(oController._vDocty == "50"){
			oViewRec_Btn.setText(oBundleText.getText("VIEW_CONT_BTN"));
		}
	},
	
	onAfterShow : function(oEvent) {
		
		var oController = this;
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var dataProcess = function() {	
			
			oController._vActiveTabNames = [];			
			oModel.read("/HiringFormTabInfoSet?$filter=Molga eq '" + oController._vMolga + "'",
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
		if(oController._vDocty == "20" || oController._vDocty == "50")
			oController.setRecSubjectListColumn(oController);
		else
			oController.setSubjectListColumn(oController);
		
	}, 
	
	setProcessFlow : function(oController) {

		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
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
			var filterString = ""; //"?$filter=Reqno%20eq%20%27" + encodeURI(oController._vReqno) + "%27";
			filterString += "?$filter=Docno%20eq%20%27" + oController._vDocno + "%27";
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
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
	

	navToBack : function(oEvent){
		sap.ui.getCore().getEventBus().publish("nav", "back", {
//		      id : "zui5_hrxx_actapp2.ActAppMain",
//		      data : {
//		       
//		      }
		    });		
	},
	
	onAfterOpenPopover : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
		var oController = oView.getController();
		
		if(oController._vDocty == "20" || oController._vDocty == "50") {
			zui5_hrxx_actapp2.common.Common.onAfterOpenRecDetailViewPopover(oController);
		} else {
			zui5_hrxx_actapp2.common.Common.onAfterOpenDetailViewPopover(oController);
		}
		
	},
	
	downloadExcel : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
		var oController = oView.getController();
		
		var vCols = "Ename|Acttx|Actda1|Batyp|";
		
		for(var i=0; i<oController._vActiveTabNames.length; i++) {
			var vTabId = "Sub" + oController._vActiveTabNames[i].Tabid;
			vCols += vTabId + "|";
		}
		vCols += "Sub08|";
		
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
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
		      id : "zui5_hrxx_actapp2.ActAppComplete",
		      data : {
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 Molga : oController._vMolga,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp2.ActAppDocumentView"
		      }
		});	
	},
	
/**********************************************************************************************************
 *** 추가메일전송 끝                                                                                    ***
 ***                                                                                                    ***
 **********************************************************************************************************/
	
	onResizeWindow : function(oEvent, oEventId, data) {
		$("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 350);
	},
	
	setSubjectListColumn : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var icon1 = "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Apply.png'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Error.png'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Lock.png'>";
		
		var icon_retro = "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Radiation.png'>";
		
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
		
		var vColumns = [ {id : "Ename_Html", label : oBundleText.getText("ENAME"), control : "Html", width : 150, align : "Left"},
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
		oListTable.setSelectionMode(sap.ui.table.SelectionMode.None);
		
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
					vHeaderText = oBundleText.getText(oController.vDisplayControl[i].Fieldname);
				}
				
				if(i == oController.vDisplayControl.length - 1){
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
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = {ActionSubjectListSet : []};
		var oPath = "/ActionSubjectListSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27";
//        		  + "%20and%20Reqno%20eq%20%27" + encodeURI(oController._vReqno) + "%27";
		
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

		mActionSubjectList.setData(SubjectListData);	
		oListTable.setModel(mActionSubjectList);
		oListTable.bindRows("/data");
		
		oController._vListLength = SubjectListData.data.length;
		
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		
		if(fCompleteCount) {
			if(oDeleteBtn) oDeleteBtn.setVisible(false);
		} else {
			if(oDeleteBtn) oDeleteBtn.setVisible(true);
		}
	},
	
	viewRecPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
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
		
		var vToId = "";
		if(oController._vDocty == "20") {
			vToId = "zui5_hrxx_actapp2.ActRecPInfo";
		} else {
			vToId = "zui5_hrxx_actapp2.ActConPInfo";
		}
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : vToId,
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
		    	 FromPageId : "zui5_hrxx_actapp2.ActAppDocumentView",
		    	 Recno : vActionSubjectListSet[check_idxs[0]].Recno,
		    	 VoltId : vActionSubjectListSet[check_idxs[0]].VoltId
		      }
		});		
	},
	
	setRecSubjectListColumn : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var icon1 = "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Apply.png'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Error.png'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Lock.png'>";
		var icon4 = "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/check-icon.png";
		var icon5 = "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Problem.png";
		
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
		
		var oListTable = sap.ui.getCore().byId(oController.PAGEID + "_ListTable");
		oListTable.removeAllColumns();
		oListTable.destroyColumns();
		oListTable.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
		
		var vColumns = [];
		
		vColumns.push({id : "Ename_Html", label : oBundleText.getText("ENAME"), control : "Html", width : "150", align: "Left"});
		vColumns.push({id : "Acttx", label : oBundleText.getText("ACTTX"), control : "Text", width : "200", align: "Left"});
		vColumns.push({id : "Actda1", label : oBundleText.getText("ACTDA"), control : "Text", width : "80", align: "Center"});
		
		if(oController._vDocty == "20") {
			for(var i=0; i<oController._vActiveTabNames.length; i++) {
				var vTabId = "Sub" + oController._vActiveTabNames[i].Tabid;
				var vTabLabel = oController._vActiveTabNames[i].Tabtl;
				vColumns.push({id : vTabId + "_Img", data : vTabId, label : vTabLabel, control : "Img", width : "50", align: "Center"});
			}
			vColumns.push({id : "Sub08_Img", data : "Sub08", label : oBundleText.getText("TSUB08"), control : "Img", width : "50", align: "Center"});
		} else {
			for(var i=0; i<1; i++) {
				var vTabId = "Sub" + oController._vActiveTabNames[i].Tabid;
				var vTabLabel = oController._vActiveTabNames[i].Tabtl;
				vColumns.push({id : vTabId + "_Img", data : vTabId, label : vTabLabel, control : "Img", width : "50", align: "Center"});
			}
		}	
			
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
			for(var i=0; i<oController.vDisplayControl.length; i++) {
				var Fieldname = oController.vDisplayControl[i].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				
				var vHeaderText = "";
				if(oController.vDisplayControl[i].Label && oController.vDisplayControl[i].Label != "") {
					vHeaderText = oController.vDisplayControl[i].Label;
				} else {
					vHeaderText = oBundleText.getText(oController.vDisplayControl[i].Fieldname);
				}
				
				if(i == oController.vDisplayControl.length - 1){
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
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = {ActionSubjectListSet : []};
		var oPath = "/ActionSubjectListSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27";
//        		  + "%20and%20Reqno%20eq%20%27" + encodeURI(oController._vReqno) + "%27";
		
		var SubjectListData = {data : []};
		
		oModel.read(oPath + oController.ListFilter, 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						if(oData.results.length < 2) {
							oController.ListSelected = true;
						} else {
							oController.ListSelected = false;
						}
						
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

//							vActionSubjectList.ActionSubjectListSet.push(oneData);							
							
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
										var cond =  vColumns[j].data.replace("Sub","Verif");
										var val = eval("oData.results[i]." + cond + ";");
										if(val == "T"){
											eval("oneDataSheet." + vColumns[j].id + " = icon5;");
										}
										else eval("oneDataSheet." + vColumns[j].id + " = icon4;");
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
							
//							SubjectListData.data.push(oneDataSheet);
							vActionSubjectList.ActionSubjectListSet.push(oneDataSheet);	
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
		oListTable.setModel(mActionSubjectList);
		oListTable.bindRows("/ActionSubjectListSet");
		
		oController._vListLength = SubjectListData.data.length;
		
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		
		if(fCompleteCount) {
			if(oDeleteBtn) oDeleteBtn.setVisible(false);
		} else {
			if(oDeleteBtn) oDeleteBtn.setVisible(true);
		}
	},
	
	onChangeStatus : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
		var oController = oView.getController();
		
		var onProcessChange = function(fVal) {
			if(fVal && fVal == "OK") {
				var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
				
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
							      id : "zui5_hrxx_actapp2.ActAppMain",
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
	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
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

//function ActAppDocumentViewSubject_OnSearchEnd(result) {
//	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
//	var oController = oView.getController();
//	
//	if(ActAppDocumentViewSubject.RowCount() > 0) {
//		ActAppDocumentViewSubject.FitSize(1, 1);
//	}
//	ActAppDocumentViewSubject.SetExtendLastCol(true);
//	
//	ActAppDocumentViewSubject.SetCellFont("FontSize", 0, "Pchk", ActAppDocumentViewSubject.RowCount() + ActAppDocumentViewSubject.HeaderRows(), "vDummy", 13);
//	ActAppDocumentViewSubject.SetCellFont("FontName", 0, "Pchk", ActAppDocumentViewSubject.RowCount() + ActAppDocumentViewSubject.HeaderRows(), "vDummy", "Malgun Gothic");
//	
//	if(oController._vDocty != "20" && oController._vDocty != "50") {
//		var vHeaderRows = ActAppDocumentViewSubject.HeaderRows();
//		for(var r=0; r<ActAppDocumentViewSubject.RowCount(); r++) {
//			if((r % 2) == 0) {
//				ActAppDocumentViewSubject.SetMergeCell((r+vHeaderRows),0,2,1);
//				ActAppDocumentViewSubject.SetMergeCell((r+vHeaderRows),1,2,1);
//				ActAppDocumentViewSubject.SetMergeCell((r+vHeaderRows),2,2,1);
//				ActAppDocumentViewSubject.SetMergeCell((r+vHeaderRows),3,2,1);
//			}
//		}
//	}
//}
//
//function ActAppDocumentViewSubject_OnBeforeCheck(Row, Col) {
//	var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
//	var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");
//	
//	var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
//	
//	var vPernr = ActAppDocumentViewSubject.GetCellValue(Row, "Pernr");
//	var vActda = ActAppDocumentViewSubject.GetCellValue(Row, "Actda");
//	var vVoltId = ActAppDocumentViewSubject.GetCellValue(Row, "VoltId");
//	if(vPernr == "") return;
//	
//	var r_idx = -1;
//	for(var i=0; i<vActionSubjectList.length; i++) {
//		if(vPernr == vActionSubjectList[i].Pernr 
//				&& dateFormat.format(new Date(vActda)) == dateFormat.format(vActionSubjectList[i].Actda)
//				&& vVoltId == vActionSubjectList[i].VoltId) {
//			r_idx = i;
//			break;
//		}
//	}
//	
//	if(r_idx != -1) {
//		if(ActAppDocumentViewSubject.GetCellValue(Row, "Pchk") == 0) {
//			mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", true);
//		} else {
//			mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", false);
//		}
//	}
//}
