sap.ui.jsfragment("zui5_hrxx_actretire2.fragment.RetireReqListLegend", {
	
	createContent : function(oController) {
		
        var oLegendLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [ new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer({width: "5px"}),
							           new sap.ui.core.Icon({src: "sap-icon://status-completed", color: "#999999"}),
							           new sap.m.ToolbarSpacer({width: "10px"}),
							           new sap.ui.commons.Label({text : oBundleText.getText( "RETIRE_STATUS1")}).addStyleClass("L2PStatusFont")]
						}),
						new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer({width: "5px"}),
							           new sap.ui.core.Icon({src: "sap-icon://status-completed", color: "#F0AB00"}),
							           new sap.m.ToolbarSpacer({width: "10px"}),
							           new sap.ui.commons.Label({text : oBundleText.getText( "RETIRE_STATUS2")}).addStyleClass("L2PStatusFont")]
						}),
						new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer({width: "5px"}),
							           new sap.ui.core.Icon({src: "sap-icon://status-completed", color: "#00B050"}),
							           new sap.m.ToolbarSpacer({width: "10px"}),
							           new sap.ui.commons.Label({text : oBundleText.getText( "RETIRE_STATUS3")}).addStyleClass("L2PStatusFont")]
						}),
						new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer({width: "5px"}),
							           new sap.ui.core.Icon({src: "sap-icon://status-completed", color: "#CC1919"}),
							           new sap.m.ToolbarSpacer({width: "10px"}),
							           new sap.ui.commons.Label({text : oBundleText.getText( "RETIRE_STATUS4")}).addStyleClass("L2PStatusFont")]
						}),
						new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer({width: "5px"}),
							           new sap.ui.core.Icon({src: "sap-icon://status-completed", color: "#009DE0"}),
							           new sap.m.ToolbarSpacer({width: "10px"}),
							           new sap.ui.commons.Label({text : oBundleText.getText( "RETIRE_STATUS5")}).addStyleClass("L2PStatusFont")]
						}),
			           ]
		});
        
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_RRL_Dialog",{
			content :[oLegendLayout] ,
//			contentWidth : "100px",
//			contentHeight : "250px",
			showHeader : true,
			title : oBundleText.getText("TITLE_LEGEND"),
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"), icon: "sap-icon://sys-cancel-2", press : oController.onRRLClose}),
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		

		return oDialog;
	}

});
