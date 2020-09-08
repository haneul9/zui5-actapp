sap.ui.jsfragment("ZUI5_HR_Portal.fragment.Apply", {
	
	createContent : function(oController) {
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
		
		var oCell = null , oRow = null;
		
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			widths : ["" ,'20px'],
			columns : 2,
			width : "100%"
		}).setModel(oController._JSonModel).bindElement("/Data");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : new sap.m.Text({text : "HR 신청함"}).addStyleClass("Font22px FontColor6")
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		var oCategoryMatrix = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			widths : ["" ,"", ""],
			columns : 3,
			width : "100%"
		}).setModel(oController._JSonModel).bindElement("/Data");
		oCategoryMatrix.addStyleClass("BottomLine");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "신청"}).addStyleClass("Font14px FontColor9"),
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "승인"}).addStyleClass("Font14px FontColor9"),
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
		});
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "반려"}).addStyleClass("Font14px FontColor9"),
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
		});
		oRow.addCell(oCell);
		oCategoryMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Cnt01}"}).addStyleClass("Font14px FontColorApply"),
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Cnt02}"}).addStyleClass("Font14px FontColorApproval"),
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
		});
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Cnt03}"}).addStyleClass("Font14px FontColorReject"),
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
		});
		oRow.addCell(oCell);
		oCategoryMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oCategoryMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "70px" });
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2,
			content : oCategoryMatrix
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ height : "80px" });
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.TextView({text : "{CntAll}"}).addStyleClass("Font60px FontColor6 FontBold"),
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ });
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [ new sap.m.ToolbarSpacer({}),
							new sap.ui.commons.TextView({text : "건"}).addStyleClass("Font16px FontColor6 minwidth1_3"),
							new sap.ui.commons.TextView({text : "{Prdtx}"}).addStyleClass("FontSubTitle")],
			}),
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		var oMainMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 3,
			widths : ["20px", "", "20px"],
			width : "295px",
			height : "295px"
		}).attachBrowserEvent("click", function(){
			oController.moveTiletoPage(oController,"Apply");
		}).addStyleClass("TileLayout CursorPointer");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "25px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMainMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"250px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oMatrixLayout,
			hAlign : sap.ui.commons.layout.HAlign.Middle,
			vAlign : sap.ui.commons.layout.VAlign.Center,
		});
		oRow.addCell(oCell);
		oMainMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMainMatrixLayout.addRow(oRow);
		
		return oMainMatrixLayout;
	
	}
});