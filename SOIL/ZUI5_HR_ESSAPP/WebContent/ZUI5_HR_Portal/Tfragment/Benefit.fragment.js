sap.ui.jsfragment("ZUI5_HR_Portal.Tfragment.Benefit", {
	
	createContent : function(oController) {
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 1,
			width : "100%"
		}).setModel(oController._DetailJSonModel).bindElement("/Data");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [
					new sap.m.ToolbarSpacer({width: "20px"}),
					new sap.m.Text({
						text : "복리후생" 
					}).addStyleClass("Font14px FontColor3 PaddingTop5"),
				]
			}).addStyleClass("ToolbarNoBottomLine"), 
			vAlign : "Top",
			hAlign : "Begin"
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "50px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [
					new sap.m.ToolbarSpacer({width: "20px"}),
					new sap.m.Text(oController.PAGEID +"_CIcon2",{
						text : "{CIcon2}",
						width : "30px"
					}),
					new sap.m.Text({
						text : "{BenefDif}"
					}).addStyleClass("Font16px FontColor6"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Text({
						text : "{Benef}"
					}).addStyleClass("Font20px FontColor3"),
					new sap.m.ToolbarSpacer({width: "20px"})
				]
			}).setModel(oController._DetailJSonModel).bindElement("/Data")
			.addStyleClass("ToolbarNoBottomLine"), 
			vAlign : "Bottom",
			hAlign : "Begin"
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"});
		oMatrixLayout.addRow(oRow);
		
		return new sap.m.ScrollContainer({
			height : "100%",
			width : "100%",
			content : oMatrixLayout
		}).addStyleClass("RewardLayout CursorPointer")
		.attachBrowserEvent("click", ZUI5_HR_Portal.common.TotalRewardController.onClick2);
	
	}
});