sap.ui.jsfragment("ZUI5_HR_ChartTest4.Tfragment.Summary", {
	
	createContent : function(oController) {
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 1,
			width : "100%"
		}).setModel(oController._DetailJSonModel).bindElement("/Data");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			width : "450px",
			content : new sap.m.FormattedText({
		  	      htmlText : "{summary}"
			 }),
//			vAlign : "Center",
			hAlign : "Begin"
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
//		oMatrixLayout.addStyleClass("TileLayout");
		return oMatrixLayout;
	
	}
});