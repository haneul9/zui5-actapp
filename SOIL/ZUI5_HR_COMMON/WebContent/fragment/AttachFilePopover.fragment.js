sap.ui.jsfragment("fragment.AttachFilePopover", {
	
	createContent : function(oController) {
		
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.ZHR_TABLES");
			
		var oCustomListItem = new sap.m.CustomListItem(oController.PAGEID + "_FilePopColumn",{
			content : new sap.m.Toolbar({
				height : "50px",
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.ToolbarSpacer({width : "10px"}),
						   new sap.m.Link({
							    text : "{Zfilename}",
							    href : "{Fileuri}",
							    target : "_new"
//							    press : common.ZHR_TABLES.onDownloadFile ,
//							    customData : new sap.ui.core.CustomData({key : "Fileuri", value : "{Fileuri}" })
							}).addStyleClass("L2P13Font"),
							new sap.m.ToolbarSpacer({width : "10px"}),
				]
			}).addStyleClass("L2PToolbarNoBottomLine")
		});
		
		var oList = new sap.m.List(oController.PAGEID + "_FilePopList",{
			width : "100%",
			showNoData : true,
			noDataText : "No data found",
			mode : sap.m.ListMode.None,
		});
		oList.setModel(sap.ui.getCore().getModel("ZHR_COMMON_SRV"));
		
		var oPopover = new sap.m.Popover({
			title : oBundleText.getText("LABEL_2765"),	// 2765:첨부파일 리스트
			placement : sap.m.PlacementType.Auto,
			content : oList,
			contentWidth : "500px",
			beforeOpen : common.ZHR_TABLES.onBeforeOpenFile,
			endButton : new sap.m.Button({
							icon : "sap-icon://sys-cancel-2",
							press : function(oEvent) {
								oEvent.getSource().getParent().getParent().close();
							}})
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oPopover.addStyleClass("sapUiSizeCompact");
	    };

		return oPopover;
	}

});
