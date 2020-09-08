sap.ui.jsfragment("zui5_hrxx_actretire.fragment.RetireRequestPreview1", {
	
	createContent : function(oController) {
		
        var oHtmlPanel = new sap.m.Panel(oController.PAGEID + "_RRP_HtmlPanel", {
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : []
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [new sap.ui.core.HTML(oController.PAGEID + "_RRP_Html")]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_RRP_Dialog",{
			content : oHtmlPanel,
			contentWidth : "800px",
			contentHeight : "600px",
			showHeader : true,
			title : oBundleText.getText("TITLE_ACT_PREVIEW"),
			beforeOpen : oController.onBeforeOpenHtmlDialog,
			endButton : new sap.m.Button({text : oBundleText.getText("CLOSE_BTN"), icon: "sap-icon://sys-cancel-2", press : oController.onRRPClose}),
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };

		return oDialog;
	}

});
