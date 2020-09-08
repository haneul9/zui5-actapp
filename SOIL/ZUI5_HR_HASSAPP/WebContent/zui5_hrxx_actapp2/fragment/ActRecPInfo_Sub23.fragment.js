sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_Sub23", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* 
	* 개인 추가 정보
	* 
	* @memberOf fragment.ActRecPInfo_Sub23
	*/
	 
	createContent : function(oController) {
        var oCell = null, oRow = null;
        
        var oRequestLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 1
		});
        
        oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Sub23_RequestPanel", {
			hAlign : sap.ui.commons.layout.HAlign.Middle,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : []
		}).addStyleClass("L2PPadding05remLR");
		oRow.addCell(oCell);
		oRequestLayout.addRow(oRow);
		
		var oRequestPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : "추가 개인 정보", design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer()]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oRequestLayout]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_Sub23_LAYOUT",  {
			width : "100%",
			content : oRequestPanel
		});
		
		return oLayout;
		
	}

});