jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

sap.ui.controller("zui5_hrxx_retireprocess.ProcessMenu", {
	PAGEID : "ProcessMenu",

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_retireprocess.ProcessMenu
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

	onListItemTap: function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.ProcessMenu");
		var oController = oView.getController();
		var oApp = sap.ui.getCore().byId("RetireProcessApp");
		
		var vPageID = "",
		    vBizty = "";
		
		for(var i=0; i<9; i++) {
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
			oApp.toDetail("zui5_hrxx_retireprocess.Dummy", "show");
			
			if(!oApp.getDetailPage(vPageID)) oApp.addDetailPage(sap.ui.jsview(vPageID, vPageID));    
			oApp.toDetail(vPageID, {Bizty:vBizty});
		}
	},

});