sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionAppPreview", {
	 
	createContent : function(oController) {
		
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
        
        var oHtmlPanel = new sap.m.Panel(oController.PAGEID + "_APP_HtmlPanel", {
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : []
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : []
		});
        
//        var oCell = null, oRow = null;
//		
//		var oHtmlLayout = new sap.ui.commons.layout.MatrixLayout({
//			width : "100%",
//			layoutFixed : false,
//			columns : 1
//		});
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Center,
//			vAlign : sap.ui.commons.layout.VAlign.Top,
//			content : new sap.ui.core.HTML(oController.PAGEID + "_AAP_HTML", {content: null, preferDOM : false})
//		});
//		oRow.addCell(oCell);
//		
//		oHtmlLayout.addRow(oRow);
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_AAP_Dialog",{
			content : oHtmlPanel,
			contentWidth : "800px",
			contentHeight : "600px",
			showHeader : true,
			title : oBundleText.getText("TITLE_ACTREQ_PREVIEW"),
			//afterOpen : oController.onAfterOpenSearchDialog,
			beforeOpen : oController.onBeforeOpenHtmlDialog,
			endButton : new sap.m.Button({text : oBundleText.getText("CLOSE_BTN"), icon: "sap-icon://sys-cancel-2", press : oController.onAAPClose}),
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };

		return oDialog;
	}

});
