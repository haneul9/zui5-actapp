jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("zui5_hrxx_actapp2.common.Common");
jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
jQuery.sap.require("sap.ui.core.util.ExportType");

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
	vExcelDownControl : [],
	
	_DetailViewPopover : null,
	_DetailRecViewPopover : null ,
	_PreviewDialog : null,
	
	_TableCellHeight : 70,
	_OtherHeight : 380,
	_vRecordCount : 0,
	
	_vActiveTabNames : null,
	
	BusyDialog : new sap.m.BusyDialog(),
	
	oSubjectList : null,
	oCnt : 0,
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf epmproductapp.CreateView
*/
	onInit: function() {
//		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			this.getView().addStyleClass("sapUiSizeCompact");
//	    };
	      
	    this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow  : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this),
//			onAfterHide : jQuery.proxy(function (evt) {
//				this.onAfterHide(evt);
//			}, this)
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
//			var oReqda = sap.ui.getCore().byId(this.PAGEID + "_Reqda");
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
//			oReqda.setText(dateFormat.format(oController._vOneReq.Reqda));
			
			var vPostc = oController._vOneReq.Postc;
			
			var oCompleteBtn = sap.ui.getCore().byId(this.PAGEID + "_COMPLETE_BTN");
			var oAnnounceBtn = sap.ui.getCore().byId(this.PAGEID + "_ANNOUNCE_BTN");
			var oSendMailBtn = sap.ui.getCore().byId(this.PAGEID + "_SENDMAIL_BTN");

			if(this._vStatu == "30") {
				oCompleteBtn.setVisible(true);
				oSendMailBtn.setVisible(false);
				oAnnounceBtn.addCustomData(new sap.ui.core.CustomData({key : "Postc", value : vPostc}));
				if(vPostc == "X") {
					oAnnounceBtn.setText("발령게시취소");
				} else {
					oAnnounceBtn.setText("발령게시");
				}
			} else if(this._vStatu == "20") {
				oCompleteBtn.setVisible(true);
				oSendMailBtn.setVisible(false);
				oAnnounceBtn.addCustomData(new sap.ui.core.CustomData({key : "Postc", value : vPostc}));
				if(vPostc == "X") {
					oAnnounceBtn.setText("발령게시취소");
				} else {
					oAnnounceBtn.setText("발령게시");
				}
			} else if(this._vStatu == "50") {
				oCompleteBtn.setVisible(true);
				oSendMailBtn.setVisible(true);
				oAnnounceBtn.addCustomData(new sap.ui.core.CustomData({key : "Postc", value : vPostc}));
				if(vPostc == "X") {
					oAnnounceBtn.setText("발령게시취소");
				} else {
					oAnnounceBtn.setText("발령게시");
				}
			} else {
				oCompleteBtn.setVisible(false);
				oSendMailBtn.setVisible(false);
				oAnnounceBtn.setVisible(false);
				oAnnounceBtn.removeAllCustomData();
			} 
		}
		
		var oViewRec_Btn = sap.ui.getCore().byId(this.PAGEID + "_View_Rec_Btn");
		if(oController._vDocty == "20" || oController._vDocty == "50") {
			oViewRec_Btn.setVisible(true);
		} else {
			oViewRec_Btn.setVisible(false);
		}
		
		if(oController._vDocty == "20") {
			oViewRec_Btn.setText("입사자정보조회");
		} else if(oController._vDocty == "50"){
			oViewRec_Btn.setText("계약자정보조회");
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
			zui5_hrxx_actapp2.common.Common.onAfterRenderingTable(oController);
//			zui5_hrxx_actapp2.common.Common.setSubjectListColumn(oController);
//			oController.onAfterRenderingTable(oController);
			oController.reloadSubjectList(oController);
//			
			oController.setProcessFlow(oController);
			
			oController.BusyDialog.close();
		};
		
		oController.BusyDialog.open();
		
		setTimeout(dataProcess, 300);
	},
	
	onAfterRenderingTable : function(oController){
		console.log("onAfterRenderingTable !!!");
		
		$("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 370);
		
		$("#" + oController.PAGEID + "_SubjectList").empty();
		
		oController.oSubjectList = new dhtmlXGridObject(oController.PAGEID + "_SubjectList");
		oController.oSubjectList.setImagePath("/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/css/imgs/dhxgrid_web/");
		
		var header = "#master_checkbox,";
		var InitWidths = "40,";
		var ColTypes = "ch,";
		var ColAlign = "center,";
		var ColVlign = "middle,";
		
		oController.oSubjectList.setHeader(header.substring(0, header.length - 1),null,["height:35px"]);
		oController.oSubjectList.setInitWidths(InitWidths.substring(0, InitWidths.length - 1));
		oController.oSubjectList.setColAlign(ColAlign.substring(0, ColAlign.length - 1));
		oController.oSubjectList.setColVAlign(ColVlign.substring(0, ColVlign.length - 1));
		oController.oSubjectList.setColTypes(ColTypes.substring(0, ColTypes.length - 1));
		oController.oSubjectList.setAwaitedRowHeight(35);
		oController.oSubjectList.setStyle(
				"min-height : 35px !important; font-size : 0.875rem; text-align : center;  border-left : 1px solid #e9e9e9; border-bottom : 1px solid #e9e9e9; vertical-align : middle; background-color : #d9d9d9;",
				"height : 35px !important; font-size : 0.875rem; text-align : center;  border-left : 1px solid #e9e9e9; border-bottom : 1px solid #e9e9e9; vertical-align : middle; background-color:rgb(255,255,255);",
				"", "");
		oController.oSubjectList.attachEvent("onCheckbox", oController.doOnCheck);
		oController.oSubjectList.init();
		
		oController.oSubjectList.enableSmartRendering(true);
	},
	
	doOnCheck : function(rowId, cellInd, state) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
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
	
	reloadSubjectList : function(oController) {
//		if(oController._vDocty == "20" || oController._vDocty == "50")
//			oController.setRecSubjectListColumn(oController);
//		else
//			oController.setSubjectListColumn(oController);
		
		if(oController._vDocty == "20" || oController._vDocty == "50") 
			zui5_hrxx_actapp2.common.Common.setRecSubjectListColumn(oController);
		else
			zui5_hrxx_actapp2.common.Common.setSubjectListColumn(oController);
		
	}, 
	
	setProcessFlow : function(oController) {

		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var oProcessFlow = sap.ui.getCore().byId(oController.PAGEID + "_ProcessFlow");	
		var oStatusPanelTitle = sap.ui.getCore().byId(oController.PAGEID + "_StatusPanel_Title");
		
		oProcessFlow.removeAllLanes();
		oProcessFlow.removeAllNodes();
		
		var vStatusTitle = "진행상태" + " : ";
		if(oController._vStatu == "10") vStatusTitle += "작성";
		else if(oController._vStatu == "20") vStatusTitle += "결재상신";
		else if(oController._vStatu == "25") vStatusTitle += "결재완료";
		else if(oController._vStatu == "40") vStatusTitle += "반려";
		else if(oController._vStatu == "30") vStatusTitle += "승인";
		else if(oController._vStatu == "50") vStatusTitle += "확정";
 
		oStatusPanelTitle.setText(vStatusTitle);
		
		var vLanes = [{laneId : oController.PAGEID + "_LaneHeader0", iconSrc : "sap-icon://create", text : "작성", status : "10"},
		              {laneId : oController.PAGEID + "_LaneHeader1", iconSrc : "sap-icon://approvals", text : "결재상신", status : "20"},
		              {laneId : oController.PAGEID + "_LaneHeader2", iconSrc : "sap-icon://sys-enter", text : "결재완료", status : "30"},
		              {laneId : oController.PAGEID + "_LaneHeader3", iconSrc : "sap-icon://accept", text : "확정", status : "40"},
		              {laneId : oController.PAGEID + "_LaneHeader4", iconSrc : "sap-icon://notification-2", text : "발령게시", status : "51"},
		              //{laneId : oController.PAGEID + "_LaneHeader5", iconSrc : "sap-icon://email", text : "메일발송", status : "60"}		
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
				title : "발령품의서",
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
									vNodes[0].setStateText("작성");
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
									vNodes[1].setStateText("결재상신");
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
									vNodes[1].setStateText("결재완료");
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
									vLanes[2].setText("승인");
									vNodes[2].setHighlighted(true);
									vNodes[2].setFocused(true);
									vNodes[2].setStateText("승인");
									vNodes[2].setTexts([dateFormat.format(new Date(oData.results[i].Datim)) + " " + oData.results[i].Ename]);
								} else if(vReqst == "40") {
									if(i == (oData.results.length -1)) {
										vLanes[2].setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value:100}]);										
										vNodes[2].setState(sap.suite.ui.commons.ProcessFlowNodeState.Negative);
									} else {
										vLanes[2].setState([{state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value:100}]);										
										vNodes[2].setState(sap.suite.ui.commons.ProcessFlowNodeState.Negative);
									}
									vLanes[2].setText("반려");
									vNodes[2].setHighlighted(true);
									vNodes[2].setFocused(true);
									vNodes[2].setStateText("반려");
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
									vNodes[3].setStateText("확정");
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
									vNodes[4].setStateText("발령게시");
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
									vNodes[5].setStateText("메일발송");
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
		
		
		
		if(oController._vDocty == "20" || oController._vDocty == "50") {
			if(!oController._DetailRecViewPopover){
				oController._DetailRecViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionRecDetailView", oController);
				oView.addDependent(oController._DetailRecViewPopover);
			}
			oController._DetailRecViewPopover.openBy(oControl);
		} else {
			if(!oController._DetailViewPopover){
				oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionDetailView", oController);
				oView.addDependent(oController._DetailViewPopover);
			}
			oController._DetailViewPopover.openBy(oControl);
		}
		
		
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
		
//		var vCols = "Ename|Acttx|Actda1|Batyp|";
//		
//		for(var i=0; i<oController._vActiveTabNames.length; i++) {
//			var vTabId = "Sub" + oController._vActiveTabNames[i].Tabid;
//			vCols += vTabId + "|";
//		}
//		vCols += "Sub08|";
//		
//		for(var i=0; i<oController.vDisplayControl.length; i++) {
//			var Fieldname = oController.vDisplayControl[i].Fieldname;
//			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
//			var TextFieldname = Fieldname + "_Tx";
//			vCols += TextFieldname + "_Hidden|";
//		}
//		
//		var params = { FileName : "ActionSubject.xls",  SheetName : "Sheet", Merge : 1, HiddenColumn : 0, DownCols : vCols} ;
//		if(typeof ActAppDocumentViewSubject == "object") {
//			ActAppDocumentViewSubject.Down2Excel(params);
//		}
//		oController.oSubjectList.toExcel('codebase/grid-excel-php/generate.php');
//		oController.oSubjectList.setCSVDelimiter(":")
//		var  str="1:2:3\n4:5:6\n7:8:9";
//		oController.oSubjectList.loadCSVString(str);
		if(oController.vExcelDownControl.length < 1) return ;
		
		var vColumnLists = [];
		var oneData = {};

		for(var i = 0 ; i < oController.vExcelDownControl.length ; i++){
			if(oController.vExcelDownControl[i].control == "img"){
				oneData = { name : oController.vExcelDownControl[i].label , template : { content :  "{" + oController.vExcelDownControl[i].id + "}"}};
					
			}else{
				oneData = { name : oController.vExcelDownControl[i].label , template : { content :  "{" + oController.vExcelDownControl[i].id + "}"}};
				
			}
			vColumnLists.push(oneData);
		}
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		
		var oExport = new sap.ui.core.util.Export({
			exportType : new sap.ui.core.util.ExportTypeCSV({
				separatorChar : ","
			}),
			models : mActionSubjectList,
			rows : {
				path : "/ActionSubjectListSet"
			},
			columns : [
					vColumnLists
			 ]			
		});
		
		oExport.saveFile().always(function() {
			this.destroy();
		});
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
	
	onPressAnnounce : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
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
			      id : "zui5_hrxx_actapp2.ActAppAnnounce",
			      data : {
			    	 Persa : oController._vPersa,
			    	 Statu : oController._vStatu,
			    	 Reqno : oController._vReqno,
			    	 Docno : oController._vDocno,
			    	 Docty : oController._vDocty,
			    	 Actda : oController._vActda,
			    	 context : oController._oContext,
			    	 FromPageId : "zui5_hrxx_actapp2.ActAppDocumentView"
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
			var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
			var oController = oView.getController();
			
			if(!oController._ODialogPopupMailingList) {
				oController._ODialogPopupMailingList = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.MailingList", oController);
				oView.addDependent(oController._ODialogPopupMailingList);
			}
			oController._ODialogPopupMailingList.open();
		},
		
		onBeforeOpenMailingListDialog : function(oEvent) {
			var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
			var oController = oView.getController();
			
			var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
			
			var mActionMailingList = sap.ui.getCore().getModel("ActionMailingList");
			var vActionMailingList = { ActionMailingList:[] };
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
								vActionMailingList.ActionMailingList.push(oneData);
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
			mActionMailingList.setData(vActionMailingList);
		},
		
		// 메일대상자 리스트 팝업창을 닫는다.
		onSendEmailClose : function(oEvent) {
			var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
			var oController = oView.getController();
			
			if(oController._ODialogPopupMailingList && oController._ODialogPopupMailingList.isOpen()) {
				oController._ODialogPopupMailingList.close();
			}
		},
		
		// 메일전송 Progress Bar 생성 및 메일전송 Function 호출
		onSendMail : function(oEvent) {
			var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
			var oController = oView.getController();
			oController.BusyDialog.open();
			
			setTimeout(oController.onSendMailAction,300);
		},
		
		// 메일전송
		onSendMailAction : function(oEvent) {
			var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
			var oController = oView.getController();

			var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
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
	  							oController._oMsgObj.Msg += "[" + "전송성공" + "] " 
	  							            + oData.Message;
	  						} else {
	  							oController._oMsgObj.Msg += "[" + "전송실패" + "] " 
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
								title : "정보",
								onClose : oController.onSendEmailClose,
								styleClass : "L2PMessageDialog"
							});
						} else {
							sap.m.MessageBox.alert(oController._oMsgObj.Msg, {
								title : "정보",
								styleClass : "L2PMessageDialog"
							});
						}
					}
					
					oController.BusyDialog.close();
					
				}
			};
			
			if(JSONData && JSONData.length) {
				oController._oMsgObj.Cnt = JSONData.length;
				oController._oMsgObj.Msg = "";
				oController._oMsgObj.AllSuccess = true;
				
				oController._oNum = 0;
				
				sendMail();
			} else {
				sap.m.MessageBox.alert("메일수신자를 추가하여 주십시오."); 
				oController.BusyDialog.close();
				return;
			}
		},
		
		// 메일수신자 삭제
		delPerson : function(oEvent) {
			var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
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
					sap.m.MessageBox.alert("먼저 삭제할 행을 선택하여 주십시오.");
					return;
				}
			} else {
				sap.m.MessageBox.alert("삭제 할 데이터가 없습니다.");
				return;
			}
		},
		
		// 직원검색 POPUP창을 연다 (메일수신자 추가)
		addPerson : function(oEvent) {
			var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
			var oController = oView.getController();
			
			common.SearchUser1.oController = oController;
			
			if(!oController._AddPersonDialog) {
				oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
				oView.addDependent(oController._AddPersonDialog);
			}
			oController._AddPersonDialog.open();
		},

		// 검색된 사원 메일수신자 리스트에 추가
		onESSelectPerson : function(oEvent) {
			var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
			var oController = oView.getController();
			
//			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ES_Table");
//			var mEmpSearchResult = oTable.getModel();
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
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"); 
				var vIDXs = oTable.getSelectedIndices();
				
				for(var i=0; i<vIDXs.length; i++) {
					var checkDup = false;
					vNoData = false;

					for(var j = 0; j < vTmp.ActionMailingList.length; j++){
						if(mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[i] + "/Pernr") == vTmp.ActionMailingList[j].Pernr) {
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
						Pernr : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[i] + "/Pernr"),
						Ename : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[i] + "/Ename"), 
						Fulln : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[i] + "/Fulln"),
						Zzjiktlt : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[i] + "/Zzjiktlt"),
						Rnoyn : false,
						Pnryn : false,
						Payyn : false
					});
				}
				
				if(vNoData) {
					sap.m.MessageBox.alert("대상자를 선택해 주시기 바랍니다.");
					return;
				} else {
					oJSONModel.setData(vTmp);
				}
			} else {
				sap.m.MessageBox.alert("대상자를 선택해 주시기 바랍니다.");
				return;
			}
			
			common.SearchUser1.onClose();
		},
		
		// 조직검색 POPUP 창을 연다
		displayMultiOrgSearchDialog : function(oEvent) {
			var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppDocumentView");
		var oController = oView.getController();
		$("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 350);
//		$("#" + oController.PAGEID + "_SubjectList").css("height", window.innerHeight - 370);
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
			sap.m.MessageBox.alert("조회대상을 선택해 주십시오.");
			return;
		}
		
		if(check_idxs.length != 1) {
			sap.m.MessageBox.alert("조회는 한명만 가능합니다.");
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
					sap.m.MessageBox.alert("작성중 상태로 변경되었습니다.", {
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
		
		sap.m.MessageBox.confirm("작성중 상태로 변경하시겠습니까?", {
			title : "확인",
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
	
	if(oController.oSubjectList) {
		oController._vSelected_Pernr = oController.oSubjectList.getUserData(rowId,"Pernr");
		oController._vSelected_Reqno = oController.oSubjectList.getUserData(rowId, "Reqno");
		oController._vSelected_Actda = oController.oSubjectList.getUserData(rowId, "Actda");
		oController._vSelected_Docno = oController.oSubjectList.getUserData(rowId, "Docno");
		oController._vSelected_VoltId = oController.oSubjectList.getUserData(rowId, "VoltId");
	}
	
//	if(!oController._DetailViewPopover) {
//		if(oController._vDocty == "20" || oController._vDocty == "50") {
//			oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionRecDetailView", oController);
//		} else {
//			oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionDetailView", oController);
//		}
//		oView.addDependent(oController._DetailViewPopover);
//	}
//	
	var oControl = $("#" + oController.PAGEID + "_row_name_" + rowId);
//	oController._DetailViewPopover.openBy(oControl);
	
	if(oController._vDocty == "20" || oController._vDocty == "50") {
		if(!oController._DetailRecViewPopover){
			oController._DetailRecViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionRecDetailView", oController);
			oView.addDependent(oController._DetailRecViewPopover);
		}
		oController._DetailRecViewPopover.openBy(oControl);
	} else {
		if(!oController._DetailViewPopover){
			oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionDetailView", oController);
			oView.addDependent(oController._DetailViewPopover);
		}
		oController._DetailViewPopover.openBy(oControl);
	}
	
};

