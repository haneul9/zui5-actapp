sap.ui.jsfragment("ZUI5_HR_Portal.fragment.Favorite", {
	
	createContent : function(oController) {
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
		
		var oCell = null , oRow = null;
		
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : true,
			widths : ["" ,'20px'],
			columns : 2,
			width : "100%"
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : new sap.m.Text({text : "즐겨찾기"}).addStyleClass("Font22px FontColor6"),
			colSpan : 2
		});
		oRow.addCell(oCell);
		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.m.Link(oController.PAGEID +"_MoreBtn",{text : "더보기",
//									  press : oController.openMyFavoriteLsit
//			}).addStyleClass("CursorPointer Font12px FontColor9 Linknounderline"),
//		});
//		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		
		var oCustomListItem = new sap.m.CustomListItem({
			content :  new sap.m.Link({
				text : "{Mncodt}",
				press : ZUI5_HR_Portal.common.FavoriteController.goToMenu
			}).addStyleClass("FontFamily PaddingTop5 PaddingBottom5")
		});
		
		var oResultList = new sap.m.List({
			showNoData : false,
			rememberSelections : false,
			items : {
				path : "/Data",
				template : oCustomListItem
			},
//			width : "180px"
		}).addStyleClass("borderTop0");
		oResultList.setModel(oController._FavoriteTileJSonModel);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "180px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oResultList,
			colSpan : 2
		}).addStyleClass("overflowScroll");
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		var oMainMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 3,
			widths : ["20px", "", "20px"],
			width : "295px",
			height : "295px"
		});
		oMainMatrixLayout.addStyleClass("TileLayout");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "25px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMainMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"240px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oMatrixLayout,
			hAlign : sap.ui.commons.layout.HAlign.Middle,
			vAlign : sap.ui.commons.layout.VAlign.Center,
		});
		oRow.addCell(oCell);
		oMainMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMainMatrixLayout.addRow(oRow);
		
		return oMainMatrixLayout;
	
	}
});