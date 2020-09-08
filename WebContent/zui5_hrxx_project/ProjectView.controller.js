jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

sap.ui.controller("zui5_hrxx_project.ProjectView", {

	PAGEID : "ProjectView",
	ListSelectionType : "None",
	
	_vWerks : "",
	_vPersa : "",
	_vPjtbd : "",
	_vMode : "",
	
	_vThousandSeparator : ",",
	_vDecimalSeparator : ".",
	
	_oContext : null,
	BusyDialog : null,
	
//	oBundleText : jQuery.sap.resources({
//		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//		locale : sap.ui.getCore().getConfiguration().getLanguage()
//	}),
	
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
			}, this)
		});  
	    
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
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		if(oEvent) {
			this._vMode = oEvent.data.mode;
			this._oContext = oEvent.data.context;
			if(this._oContext != null) {
				this._vWerks = this._oContext.getProperty("Werks");
				this._vPjtbd = dateFormat.format(new Date(common.Common.setTime(new Date(this._oContext.getProperty("Pjtbd")))));
			}
		}

		this.setData(this);
	},
	
	navToBack : function(oEvent){
		sap.ui.getCore().getEventBus().publish("nav", "back", {});
	},
	
	setData : function(oController) {
		
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		var oWerks = sap.ui.getCore().byId(oController.PAGEID + "_Werks");
		var oPjtnm = sap.ui.getCore().byId(oController.PAGEID + "_Pjtnm");
		var oPjtid = sap.ui.getCore().byId(oController.PAGEID + "_Pjtid");
		var oPjtbd = sap.ui.getCore().byId(oController.PAGEID + "_Pjtbd");
		var oPjted = sap.ui.getCore().byId(oController.PAGEID + "_Pjted");
		var oPjtcy = sap.ui.getCore().byId(oController.PAGEID + "_Pjtcy");
		var oPjtty = sap.ui.getCore().byId(oController.PAGEID + "_Pjtty");
		var oPjtcu = sap.ui.getCore().byId(oController.PAGEID + "_Pjtcu");
		var oPjtds = sap.ui.getCore().byId(oController.PAGEID + "_Pjtds");
		var oPjtsz = sap.ui.getCore().byId(oController.PAGEID + "_Pjtsz");
		var oPjtun = sap.ui.getCore().byId(oController.PAGEID + "_Pjtun");
		var oPjtam = sap.ui.getCore().byId(oController.PAGEID + "_Pjtam");
		var oPjtck = sap.ui.getCore().byId(oController.PAGEID + "_Pjtck");
		var oPjtct = sap.ui.getCore().byId(oController.PAGEID + "_Pjtct");
		var oPjtpd = sap.ui.getCore().byId(oController.PAGEID + "_Pjtpd");  
		var oUnametx = sap.ui.getCore().byId(oController.PAGEID + "_Unametx");
		
		oWerks.setText("");
		oPjtnm.setText("");
		oPjtid.setText("");
		oPjtbd.setText("");
		oPjted.setText("");
		oPjtcy.setText("");
		oPjtty.setText("");
		oPjtcu.setText("");
		oPjtds.setText("");
		oPjtsz.setText("");  
		oPjtun.setText("");
		oPjtam.setText(""); 
		oPjtck.setText("");
		oPjtct.setText("");
		oPjtpd.setText("");
		oUnametx.setText("");
		
		if(oController._oContext == null) return;
		
		oWerks.setText(oController._oContext.getProperty("Pbtxt"));
		oPjtnm.setText(oController._oContext.getProperty("Pjtnm"));
		oPjtid.setText(oController._oContext.getProperty("Pjtid"));
		oPjtbd.setText(oController._oContext.getProperty("Pjtbd") == null ? "" : dateFormat.format(new Date(common.Common.setTime(new Date(oController._oContext.getProperty("Pjtbd"))))));
		oPjted.setText(oController._oContext.getProperty("Pjted") == null ? "" : dateFormat.format(new Date(common.Common.setTime(new Date(oController._oContext.getProperty("Pjted"))))));
		oPjtcy.setText(oController._oContext.getProperty("Landx"));
		oPjtty.setText(oController._oContext.getProperty("Pjttytx"));
		oPjtcu.setText(oController._oContext.getProperty("Pjtcutx"));
		oPjtds.setText(oController._oContext.getProperty("Pjtds"));
		oPjtsz.setText(oController._oContext.getProperty("Pjtszu")); 
		oPjtun.setText(oController._oContext.getProperty("Pjtun"));
		oPjtam.setText(oController._oContext.getProperty("Pjtamc"));
		oPjtck.setText(oController._oContext.getProperty("Pjtck"));
		oPjtpd.setText(oController._oContext.getProperty("Pjtpdtx"));
		oPjtct.setText(oController._oContext.getProperty("Pjtcttx"));
		
		var tmpText = "";
		if(oController._oContext.getProperty("Pjtrgtx") != "") {
			tmpText = oController._oContext.getProperty("Pjtrgtx");
			if(oController._oContext.getProperty("Pjtrd") != null) {
				tmpText += " / " + dateFormat.format(new Date(common.Common.setTime(new Date(oController._oContext.getProperty("Pjtrd")))));
			}
		}
		oUnametx.setText(tmpText);
		
		var oPjtma = sap.ui.getCore().byId(oController.PAGEID + "_Pjtma"); 
		var oPjtmc = sap.ui.getCore().byId(oController.PAGEID + "_Pjtmc"); 
		var oRow05 = sap.ui.getCore().byId(oController.PAGEID + "_ROW_05"); 
		var oRow06 = sap.ui.getCore().byId(oController.PAGEID + "_ROW_06");
		var oRow07 = sap.ui.getCore().byId(oController.PAGEID + "_ROW_07");
		var oRow08 = sap.ui.getCore().byId(oController.PAGEID + "_ROW_08");
		oPjtma.setText("");
		oPjtmc.setText("");
		oPjtma.setText(oController._oContext.getProperty("Pjtmatx"));
		oPjtmc.setText(oController._oContext.getProperty("Pjtmc"));
	
		oRow05.addStyleClass("L2PDisplayNone");
		oRow06.addStyleClass("L2PDisplayNone");
		oRow07.addStyleClass("L2PDisplayNone");
		oRow08.addStyleClass("L2PDisplayNone");
		
		switch(oController._oContext.getProperty("Pjtty")) {
			case "0001" :   // 수주
				oRow05.removeStyleClass("L2PDisplayNone");
				oRow06.removeStyleClass("L2PDisplayNone");
				oRow07.removeStyleClass("L2PDisplayNone");
				break;
			case "0002" :   // R&D
				oRow06.removeStyleClass("L2PDisplayNone");
				break;
			case "0003" :   // M&A
				oRow08.removeStyleClass("L2PDisplayNone");
		}
	}
});