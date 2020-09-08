jQuery.sap.require("sap.m.MessageBox");

sap.ui.controller("zui5_hrxx_actdoc.HrDocView", {

	PAGEID : "HrDocView",
	
	oPersonList : null,
	
	BusyDialog: null,
	
	_vContext : null,
	
	_vPersa : "",
	_vHrdno : "",
	_vDocst : "",
	_vHrdoc : "",
	 
	_vGridData : {data : []},
	
	vColumns : [ {id : "Numbr", label : oBundleText.getText("NUMBER"), control : "Text", width : 40, show : "E",align : "center", filter : "#rspan"},
                 {id : "Ename", label : oBundleText.getText("ENAME"), control : "Text", width : 150, show : "E",align : "left", filter : "#text_filter"},
                 {id : "Zzcaltltx", label : oBundleText.getText("ZZCALTL"), control : "Text", width : 100, show : "E",align : "left", filter : "#combo_filter"},
                 {id : "Zzpsgrptx", label : oBundleText.getText("ZZPSGRP"), control : "Text", width : 100, show : "E",align : "left", filter : "#combo_filter"},
                 {id : "Zzjobgrtx", label : oBundleText.getText("ZZJOBGR"), control : "Text", width : 100, show : "E",align : "left", filter : "#combo_filter"},
                 {id : "Fulln", label : oBundleText.getText("STEXT"), control : "Text", width : 200, show : "E",align : "left", filter : "#combo_filter"},
                 {id : "Pgtxt", label : oBundleText.getText("PERSG"), control : "Text", width : 150, show : "E",align : "left", filter : "#combo_filter"},
                 {id : "Pktxt", label : oBundleText.getText("PERSK"), control : "Text", width : 100, show : "E",align : "left", filter : "#combo_filter"}, //
                 {id : "Entda", label : oBundleText.getText("ENTDA"), control : "Text", width : 80, show : "E",align : "left", filter : "#rspan"},
                 {id : "Rmdda", label : oBundleText.getText("RMDDA"), control : "Text", width : 100, show : "E",align : "left", filter : "#rspan"},
                 {id : "Smtda", label : oBundleText.getText("SMTDA"), control : "Text", width : 80, show : "E", align : "left", filter : "#rspan"},
                 {id : "Ansal", label : oBundleText.getText("ANSAL"), control : "Text", width : 80, show : "", align : "left", filter : "#rspan"},
                 {id : "Ancur", label : oBundleText.getText("WAERS"), control : "Text", width : 80, show : "", align : "left", filter : "#rspan"},
                 {id : "Asbeg", label : oBundleText.getText("ASBEG"), control : "Text", width : 100, show : "", align : "left", filter : "#rspan"},
                 {id : "Asend", label : oBundleText.getText("ASEND"), control : "Text", width : 100, show : "", align : "left", filter : "#rspan"},
                 {id : "Condt", label : oBundleText.getText("CONDT"), control : "Text", width : 100, show : "", align : "left", filter : "#rspan"},
                 {id : "Hdimg", label : oBundleText.getText("HDURI"), control : "Img", width : 70, align : "left", filter : "#rspan"},
                 {id : "Hduri", label : oBundleText.getText("HDURI"), control : "Hidden", width : 70, align : "left", filter : "#rspan"},
                 {id : "Pernr", label : oBundleText.getText("PERNR"), control : "Hidden", width : 70, align : "left", filter : "#rspan"},
                ],
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actdoc.HrDocView
*/
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			this.getView().addStyleClass("sapUiSizeCompact");
		};
	
	    this.getView().addEventDelegate({
			onBeforeShow  : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow  : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this),
		});
	    	
		sap.ui.getCore().getEventBus().subscribe("app", "ResizeWindow", this.onResizeWindow, this);
	},
	
	onBeforeShow : function(oEvent) {
		if(this.oPersonList) {
			this.oPersonList.clearAll(false);
		}
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		this._vDocst = oEvent.data.Docst;
		this._vPersa = oEvent.data.Persa;
		this._vHrdno = oEvent.data.Hrdno;
		this._vHrdoc = oEvent.data.Hrdoc;
		
		this._vContext = oEvent.data.Context;
		
		this._vGridData.data = [];
		if(typeof HRDocViewDataSheet == "object") {
			HRDocViewDataSheet.Reset();
		}
		
		var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
		var oHrdoc = sap.ui.getCore().byId(this.PAGEID + "_Hrdoc");
		var oDoctl = sap.ui.getCore().byId(this.PAGEID + "_Doctl");
		var oPeriod = sap.ui.getCore().byId(this.PAGEID + "_Period");
		var oRmprd = sap.ui.getCore().byId(this.PAGEID + "_Rmprd");
		var oRqcnt = sap.ui.getCore().byId(this.PAGEID + "_Rqcnt");
		var oReqdq = sap.ui.getCore().byId(this.PAGEID + "_Reqdq");
		var oCplda = sap.ui.getCore().byId(this.PAGEID + "_Cplda");
		
		var mHrDocumentsSet = sap.ui.getCore().getModel("HrDocumentsSet");
		
		oPersa.setText(mHrDocumentsSet.getProperty(this._vContext + "/Name1"));
		oHrdoc.setText(mHrDocumentsSet.getProperty(this._vContext + "/Hrdoctx"));
		oHrdoc.removeAllCustomData();
		oHrdoc.addCustomData(new sap.ui.core.CustomData({key : "Hrdoc", value : mHrDocumentsSet.getProperty(this._vContext + "/Hrdoc")}));
		
		oDoctl.setText(mHrDocumentsSet.getProperty(this._vContext + "/Doctl"));
		
		oPeriod.setText(dateFormat.format(mHrDocumentsSet.getProperty(this._vContext + "/Smbda")) + " ~ " + dateFormat.format(mHrDocumentsSet.getProperty(this._vContext + "/Smeda")));
		
		oRmprd.setText(mHrDocumentsSet.getProperty(this._vContext + "/Rmprdtx"));
		oRqcnt.setText(mHrDocumentsSet.getProperty(this._vContext + "/Smcnt") + " / " + mHrDocumentsSet.getProperty(this._vContext + "/Rqcnt") + " ("
				+ mHrDocumentsSet.getProperty(this._vContext + "/Prrte") + " %)"); //
		if(mHrDocumentsSet.getProperty(this._vContext + "/Reqdq") != null)
			oReqdq.setText(dateFormat.format(mHrDocumentsSet.getProperty(this._vContext + "/Reqdq")));
		else 
			oReqdq.setText("");
		
		if(mHrDocumentsSet.getProperty(this._vContext + "/Cplda") != null)
			oCplda.setText(dateFormat.format(mHrDocumentsSet.getProperty(this._vContext + "/Cplda")));
		else 
			oCplda.setText("");
	},
	
	onAfterShow : function(oEvent) {
		this.onAfterRenderingTableLayout();
		
		this.refreshData(this);		
	},
	
	refreshData : function(oController) {
		if(oController.oPersonList) {
			oController.oPersonList.clearAll(false);
		}
		
		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_HRDOC_SRV");
		
		var filterString = "";
		filterString += "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		filterString += "%20and%20Hrdno%20eq%20%27" + oController._vHrdno + "%27";
		
//		var vGridData = {rows : []};
		
		oModel.read("/HrDocumentsDetailsSet" + filterString, 
				null, 
				null, 
				true,
				function(oData, oResponse) {
					if(oData && oData.results) {					
						for(var i=0; i<oData.results.length; i++) {
							var oneData = oData.results[i];
							oneData.Ichek = 0;
							oneData.Numbr = (i+1);
							if(oneData.Entda != null) {
								oneData.Entda = dateFormat1.format(new Date(common.Common.setTime(new Date(oneData.Entda))));
							} else {
								oneData.Entda = "";
							}
							if(oneData.Rmdda != null) {
								oneData.Rmdda = dateFormat1.format(new Date(common.Common.setTime(new Date(oneData.Rmdda))));
							} else {
								oneData.Rmdda = "";
							}
							if(oneData.Smtda != null) {
								oneData.Smtda = dateFormat1.format(new Date(common.Common.setTime(new Date(oneData.Smtda))));
							} else {
								oneData.Smtda = "";
							}
							if(oneData.Asbeg != null) {
								oneData.Asbeg = dateFormat1.format(new Date(common.Common.setTime(new Date(oneData.Asbeg))));
							} else {
								oneData.Asbeg = "";
							}
							if(oneData.Asend != null) {
								oneData.Asend = dateFormat1.format(new Date(common.Common.setTime(new Date(oneData.Asend))));
							} else {
								oneData.Asend = "";
							}
							if(oneData.Condt != null) {
								oneData.Condt = dateFormat1.format(new Date(common.Common.setTime(new Date(oneData.Condt))));
							} else {
								oneData.Condt = "";
							}
							oneData.Hdimg = "/sap/bc/ui5_ui5/sap/zhrxx_common/images/leaf.gif";
							oController._vGridData.data.push(oneData);
						}
						
						HRDocViewDataSheet.LoadSearchData(oController._vGridData);
					}
				},
				function(oResponse) {
					
				}
		);
		
	},
	
	onResizeWindow : function(oEvent, oEventId, data) {
		$("#" + this.PAGEID + "_PersonList").css("height", window.innerHeight - 350);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_actdoc.HrDocView
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actdoc.HrDocView
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actdoc.HrDocView
*/
//	onExit: function() {
//
//	}
	
	onAfterRenderingTableLayout : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HrDocView");
		var oController = oView.getController();
		var oHrdoc = sap.ui.getCore().byId(oController.PAGEID + "_Hrdoc");
		var vHrdoc = oHrdoc.getCustomData()[0].getValue();
		$("#" + oController.PAGEID + "_PersonList").css("height", window.innerHeight - 340);
		
		if(typeof HRDocViewDataSheet == "undefined") {
			var vLang = "";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") == -1) vLang = "en";
			
			createIBSheet2(document.getElementById(oController.PAGEID + "_PersonList"), "HRDocViewDataSheet", "100%",  (window.innerHeight - 340) + "px", vLang);
		}	
		
		HRDocViewDataSheet.Reset();
		
		HRDocViewDataSheet.SetTheme("DS","GhrisMain");
		
		var initdata = {};
		
		//initdata.Cfg = {SearchMode:smLazyLoad, SizeMode:0, CustomScroll:1, Page:20, SmartResize:1, MergeSheet:msHeaderOnly};  //MergeSheet:msHeaderOnly,

		//InitHeaders의 두번째 인자
		initdata.HeaderMode = {Sort:1,ColMove:0,ColResize:1,HeaderCheck:1};
		
		initdata.Cols = [];
		
		initdata.Cols.push({
			Header : "", 
			Width : 30,
			Type : "CheckBox", 
			Edit : 1, 
			SaveName : "Ichek", 
			Align : "Center"});
		
		for(var i=0; i<oController.vColumns.length; i++) {
			var oneCol = {};
			oneCol.Header = oController.vColumns[i].label;
			oneCol.Type = oController.vColumns[i].control;
			oneCol.Edit = 0;
			oneCol.Tooltip = 1;
			oneCol.SaveName = oController.vColumns[i].id;
			oneCol.Align = "Center";
			oneCol.Width = oController.vColumns[i].width;
			if(oController.vColumns[i].id ==  "Hdimg") {
				oneCol.Cursor = "Pointer";
			}
			if(oController.vColumns[i].control ==  "Hidden") {
				oneCol.Hidden = true;
			}else if(vHrdoc == "20" || vHrdoc == "70"){
				
			}else{
				if(oController.vColumns[i].show == "") 
					oneCol.Hidden = true;
			}
			initdata.Cols.push(oneCol);
		}
		
//		initdata.Cols.push({
//			Header : "", 
//			Width : 10,
//			Type : "Text", 
//			Edit : 0, 
//			SaveName : "vDummy",
//			Align : "Center"});
		
		IBS_InitSheet(HRDocViewDataSheet, initdata);
		HRDocViewDataSheet.FitColWidth();
		HRDocViewDataSheet.SetSelectionMode(0);
		
		HRDocViewDataSheet.SetCellFont("FontSize", 0, "Ichek", HRDocViewDataSheet.HeaderRows(),  "Hdimg", 13);
		HRDocViewDataSheet.SetCellFont("FontName", 0, "Ichek", HRDocViewDataSheet.HeaderRows(),  "Hdimg", "Malgun Gothic");
		
		HRDocViewDataSheet.SetHeaderRowHeight(32);
		HRDocViewDataSheet.SetDataRowHeight(32);
		
		HRDocViewDataSheet.SetFocusAfterProcess(0);
		
		//HRDocViewDataSheet.SetHeaderBackColor("rgb(255,255,255)");
	},
	
	navToBack : function(oEvent) {
		sap.ui.getCore().getEventBus().publish("nav", "back", {
	    });	
	},
	
	downloadFile : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HrDocView");
		var oController = oView.getController();
		var vRowCount = HRDocViewDataSheet.RowCount();
		var vHeaderCount = HRDocViewDataSheet.HeaderRows();
		var vFileDownCnt = 0;
		var vPernr = "";
		
		for(var i=0; i<vRowCount; i++) {
			var vCheckBox = HRDocViewDataSheet.GetCellValue(i+vHeaderCount, "Ichek");
			if(vCheckBox == 1) {
				var SelPernr = HRDocViewDataSheet.GetCellValue(i+vHeaderCount, "Pernr");
				if(vPernr == "") vPernr = SelPernr ;
				else vPernr = vPernr + "|" + SelPernr ;
				vFileDownCnt ++;
			}
		}
		
		if(vFileDownCnt == 0){
			
		}else{
			document.IFRAMEDOWNLOAD.location.href = "/sap/opu/odata/sap/ZHRXX_HRDOC_SRV/FileSet(IPernr='" + vPernr + "',IHrdno='"+ oController._vHrdno +"')/$value";
		}
		
	},
	
	deletePerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HrDocView");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_HRDOC_SRV");
		
		if(typeof HRDocViewDataSheet == "undefined") {
			return;
		}
		
		var vRowCount = HRDocViewDataSheet.RowCount();
		var vHeaderCount = HRDocViewDataSheet.HeaderRows();
		var vDelCnt = 0;
		
		for(var i=0; i<vRowCount; i++) {
			var vCheckBox = HRDocViewDataSheet.GetCellValue(i+vHeaderCount, "Ichek");
			if(vCheckBox == 1) {
				vDelCnt++;
			}
		}
		
		if(vDelCnt < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
			return;
		}
		
		var deleteProcess = function() {
			
			var process_result = true;
			
			for(var i=0; i<vRowCount; i++) {
				var vCheckBox = HRDocViewDataSheet.GetCellValue(i+vHeaderCount, "Ichek");
				if(vCheckBox == 1) {
					var vPernr = oController._vGridData.data[i].Pernr;
					
					var oPath = "/HrDocumentsDetailsSet(Hrdno='" + oController._vHrdno + "',Pernr='" + vPernr + "')";
					
					oModel.remove(
							oPath, 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess HrDocumentsDetailsSet Remove !!!");
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
						if(oController.BusyDialog.isOpen()) {
							oController.BusyDialog.close();
						}
						return;
					}
				}
			}
			
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
				onClose : function() {
					oController.refreshData(oController);
				}
			});
		};
		
		if(!oController.BusyDialog) {			
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		setTimeout(deleteProcess, 300);
	},
	
	downloadExcel : function(oEvent) {
		/*
		 var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HrDocView");
		var oController = oView.getController();
		jQuery.sap.require("common.ExcelDownload");
		
		common.ExcelDownload.exceldown(oController);
		*/
		var params = { FileName : "HRDocViewDataSheet.xls",  SheetName : "Sheet", Merge : 1} ;
		if(typeof HRDocViewDataSheet == "object") {
			HRDocViewDataSheet.Down2Excel(params);
		}
	},
});

function HRDocViewDataSheet_OnSearchEnd(result) {
	
	HRDocViewDataSheet.FitColWidth();
	
	HRDocViewDataSheet.SetCellFont("FontSize", HRDocViewDataSheet.HeaderRows(), "Ichek", HRDocViewDataSheet.RowCount() + HRDocViewDataSheet.HeaderRows(),  "Hdimg", 13);
	HRDocViewDataSheet.SetCellFont("FontName", HRDocViewDataSheet.HeaderRows(), "Ichek", HRDocViewDataSheet.RowCount() + HRDocViewDataSheet.HeaderRows(),  "Hdimg", "Malgun Gothic");
	
	for(var i=0; i<HRDocViewDataSheet.RowCount(); i++) {
		for(var j=0; j<=(HRDocViewDataSheet.LastCol()); j++) {
			HRDocViewDataSheet.SetCellBackColor(i + HRDocViewDataSheet.HeaderRows(), j, "rgb(255,255,255)");
		}
	}
}

function HRDocViewDataSheet_OnClick(Row, Col, Value, CellX, CellY, CellW, CellH) {
	var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HrDocView");
	var oController = oView.getController();
	var oHrdoc = sap.ui.getCore().byId(oController.PAGEID + "_Hrdoc");
	var vHrdoc = oHrdoc.getCustomData()[0].getValue();
	if(Row > 0 && Col == 17) {
		var Hduri = HRDocViewDataSheet.GetCellValue(Row, "Hduri");
		
		if(Hduri != "") {
			window.open(Hduri);
		} else {
			common.Common.showWarningMessage(oBundleText.getText("NO_EXIST_FILE"));
		}
	}
}
