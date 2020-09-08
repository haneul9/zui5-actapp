sap.ui.jsfragment("ZUI5_HR_ChartTest4.fragment.Employee", {
	
	createContent : function(oController) {
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			widths : ['40%','60%'],
			columns : 2,
			width : "100%"
		}).setModel(oController._JSonModel1).bindElement("/results");
		oMatrixLayout.bindElement("/results");
		oMatrixLayout.addStyleClass("L2PTilePadding");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : new sap.ui.commons.TextView({text : "사원 프로파일"}).addStyleClass("L2PTitle1")
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2,
			content : [new sap.ui.core.HTML({
				preferDOM  : false,
				content : "<div style='height:20px'> </div>"
			})]
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		
		var oImage = new sap.m.Image({
			src : "{pic}",
			height : "80px"
//			width : "170px"
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ height : "20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			rowSpan : 3 ,
			content : oImage,
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Center,
			content : [ new sap.ui.commons.TextView({
				text : "{Ename}",
			}).addStyleClass("L2PStatusFont PSNCPaddingLeft")	],
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
//		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ height : "20px" });
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Center,
			content : [ new sap.m.Label({
				text : "{Zzjikgbt}",
				tooltip : "{Zzjikgbt}",
			}).addStyleClass("L2PStatusFont PSNCPaddingLeft")	],
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "20px" });
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Center,
			content : [ new sap.m.Label({
				text : "{Zzjiktlt}",
				tooltip : "{Zzjiktlt}",
			}).addStyleClass("L2PStatusFont PSNCPaddingLeft")	],
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			colSpan : 2,
			content :   new sap.ui.core.HTML({
				preferDOM  : false,
				content : "<div style='height:8px'> </div>"
			})
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			colSpan : 2,
			content :  new sap.m.Label({
				text : "{totalOrgeh}",
				tooltip : "{totalOrgeh}",
				width : "150px"
			}).addStyleClass("L2PStatusFont")
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			colSpan : 2,
			content : [ new sap.m.Label({
				text : "{Stetx}",
				tooltip : "{Stetx}",
				width : "100%"
			}).addStyleClass("L2PStatusFont")		],
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
//		var oMainMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
//			layoutFixed : false,
//			columns : 1,
//			width : "180px"
//		});
////		oMainMatrixLayout.addStyleClass("TileLayout");
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Middle,
//			vAlign : sap.ui.commons.layout.VAlign.Center,
//			content : oMatrixLayout,
//		});
//		oRow.addCell(oCell);
//		oMainMatrixLayout.addRow(oRow);
//		
		var oCustomTile = new sap.m.CustomTile({ 
			  content : [oMatrixLayout],
//			  press:[oController.onPress, oController]
		}).addStyleClass("TileLayout");
		
		return oCustomTile;
//		return oMainMatrixLayout;
	
	}
});