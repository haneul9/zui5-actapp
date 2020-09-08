sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ReceiveAuthPopover", {
	
	createContent : function(oController) {
		
		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.Common");
		
		var oInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 2,
			widths: ["50%","50%"]
		});
		oInfoMatrix.createRow(
				new sap.m.Text({text : "{Pgtxt}"}).addStyleClass("L2P13Font"),
				new sap.m.Text({text : "{Zzjobgrtx}"}).addStyleClass("L2P13Font")
		);
		
		var oCustomListItem = new sap.m.CustomListItem(oController.PAGEID + "_RA_ListItem", {
			content: oInfoMatrix
		});
		
		var oList = new sap.m.List(oController.PAGEID + "_RA_List", {
			width : "100%",
			showNoData : true,
			noDataText : "대상자가 없습니다.",
			mode : sap.m.ListMode.None,
		});
		oList.setModel(sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV"));
		
		var oPopover = new sap.m.Popover(oController.PAGEID + "_RA_Popover", {
			title : "메일수신권한",
			placement : sap.m.PlacementType.Auto,
			content : oList,
			contentWidth : "300px",
			beforeOpen : oController.onBeforeOpenPopoverReveiveAuth,
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