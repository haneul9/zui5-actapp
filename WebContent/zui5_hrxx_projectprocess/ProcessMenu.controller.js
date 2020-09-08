jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

sap.ui.controller("zui5_hrxx_projectprocess.ProcessMenu", {
	PAGEID : "ProcessMenu",

//	//Language 및 Properties를 가져온다.
//	oBundleText : jQuery.sap.resources({
//		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//		locale : sap.ui.getCore().getConfiguration().getLanguage()
//	}),

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_projectprocess.ProcessMenu
*/
	onInit: function() {
		//this.router = sap.ui.core.UIComponent.getRouterFor(this);
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		};
		
	    this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
		});  
	},
	
	onBeforeShow : function(oEvent) {

	}, 

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_projectprocess.ProcessMenu
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_projectprocess.ProcessMenu
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_projectprocess.ProcessMenu
*/
//	onExit: function() {
//
//	}

	onListItemTap: function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ProcessMenu");
		var oController = oView.getController();
		var oApp = sap.ui.getCore().byId("ProjectProcessApp");
		
		var vPageID = "",
		    vBizty = "";
		
		for(var i=0; i<5; i++) {
			var oItem = sap.ui.getCore().byId(oController.PAGEID + "_LISTITEM_" + (i+1));
			if(typeof oItem == "object") {
				oItem.setType("Navigation");
				oItem.removeStyleClass("L2PSelectedListItemBG");
			}
		}
		var oSelectedItem = sap.ui.getCore().byId(oEvent.getSource().sId);
		oSelectedItem.setType("Inactive");
		oSelectedItem.addStyleClass("L2PSelectedListItemBG");
		
		var oCustomData = oEvent.getSource().getCustomData();
		if(oCustomData && oCustomData.length) {
			vPageID = oCustomData[0].getValue();
			vBizty = oCustomData[1].getValue();
		}
		
		if(vPageID != "") {
			oApp.toDetail("zui5_hrxx_projectprocess.Dummy", "show");
			
			if(!oApp.getDetailPage(vPageID)) oApp.addDetailPage(sap.ui.jsview(vPageID, vPageID));    
			oApp.toDetail(vPageID, {Bizty:vBizty});
		}
	},

});