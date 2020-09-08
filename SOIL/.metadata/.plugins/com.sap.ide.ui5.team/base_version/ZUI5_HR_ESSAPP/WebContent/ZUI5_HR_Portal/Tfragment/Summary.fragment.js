sap.ui.jsfragment("ZUI5_HR_Portal.Tfragment.Summary", {
	
	createContent : function(oController) {
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 1,
			width : "100%"
		}).setModel(oController._DetailJSonModel).bindElement("/Data");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "220px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.core.HTML({
						content : "{summary}"
					}),
			hAlign : "Begin"
		}).addStyleClass("PaddingLeft20");
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		return new sap.m.ScrollContainer({
			height : "100%",
			width : "100%",
			content : oMatrixLayout
		}).addStyleClass("SummaryLayout")
		.attachBrowserEvent("click", oController.onClick1);
	
	}
});