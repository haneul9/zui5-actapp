sap.ui.jsfragment("ZUI5_HR_ChartTest4.Tfragment.Payment", {
	
	createContent : function(oController) {
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 2,
			width : "100%"
		}).setModel(oController._DetailJSonModel).bindElement("/Data");
//		oMatrixLayout.addStyleClass("L2PTilePadding");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [
					new sap.ui.core.Icon({
						src: "sap-icon://monitor-payments", 
						size : "1.5rem"
					}),
					new sap.m.ToolbarSpacer({width: "5px"}),
					new sap.m.Text({
						text : "급여" 
					}).addStyleClass("L2P18FontBold"),
				]
			}).addStyleClass("L2PToolbarNoBottomLine"), 
			vAlign : "Top",
			hAlign : "Begin"
		}).addStyleClass("L2PPaddingLeft10 L2PPaddingTop10");
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "50px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [
					new sap.m.ToolbarSpacer({width: "5px"}),
					new sap.m.Text(oController.PAGEID +"_CIcon1",{
						text : "{CIcon1}",
						width : "30px"
					}).addStyleClass("L2P15FontBold"),
					new sap.m.ToolbarSpacer({width: "5px"}),
					new sap.m.Text({
						text : "{Salry}"
					}).addStyleClass("L2P15FontBold"),
				]
			}).setModel(oController._DetailJSonModel).bindElement("/Data").addStyleClass("L2PToolbarNoBottomLine"), 
			vAlign : "Bottom",
			hAlign : "Begin"
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [
					new sap.m.ToolbarSpacer({width: "50px"}),
					new sap.m.Text({
						text : "{SalryDif}"
					}).addStyleClass("L2P15FontBold"),
				]
			}).addStyleClass("L2PToolbarNoBottomLine"), 
			vAlign : "Top",
			hAlign : "End"
		}).addStyleClass("L2PPaddingLeft10 L2PPaddingBottom10");
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
//		oMatrixLayout.addStyleClass("TileLayout");
//		oMatrixLayout.attachBrowserEvent("click", oController.onClick1);
//		return oMatrixLayout;
		
		
		return new sap.m.ScrollContainer({
			height : "100%",
			width : "100%",
			content : oMatrixLayout
		}).attachBrowserEvent("click", oController.onClick1);
	
	}
});