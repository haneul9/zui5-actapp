sap.ui.jsfragment("zui5_hrxx_actpayscale.fragment.ErrorMessagePopover", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	
	createContent : function(oController) {
		
//		var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
     	var historyLayout = new sap.ui.layout.VerticalLayout({
			content : [
			           	new sap.m.Text(oController.PAGEID + "_ERROR_POPOVER").addStyleClass("L2PFontColorRed")
			           ]
		});
	    
	    var oPopover = new sap.m.Popover({
			placement : sap.m.PlacementType.Auto,
			content : historyLayout,
			contentWidth : "650px",
			showHeader :false 
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oPopover.addStyleClass("sapUiSizeCompact");
	    };

		return oPopover;

	}

});