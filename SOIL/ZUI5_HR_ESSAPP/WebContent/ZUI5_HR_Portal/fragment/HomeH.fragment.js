sap.ui.jsfragment("ZUI5_HR_Portal.fragment.HomeH", {
	
	createContent : function(oController) {
		var oRow , oCell ;
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
		});
		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "60px"});
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({}); 
//		oRow.addCell(oCell);
//		oMatrix.addRow(oRow);
		
		var oBlockLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true,
			content :  [ 
							new sap.ui.layout.VerticalLayout({
								content : [sap.ui.jsfragment("ZUI5_HR_Portal.fragment.EmployeeH",oController)
							              ]
							}).addStyleClass("PaddingLeft20"),
							new sap.ui.layout.VerticalLayout({
								content : [sap.ui.jsfragment("ZUI5_HR_Portal.fragment.SignH",oController)
							              ]
							}).addStyleClass("PaddingLeft20"),
							new sap.ui.layout.VerticalLayout({
								content : [sap.ui.jsfragment("ZUI5_HR_Portal.fragment.Favorite",oController)
							              ]
							}).addStyleClass("PaddingLeft20"),
		         ],
		}).addStyleClass("LeftAlign");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ });
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [ oBlockLayout],
			hAlign : "Center",
			vAlign : "Middle",
		}); 
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		return oMatrix.addStyleClass("TileCenter");
	}
});