jQuery.sap.require("ZUI5_HR_Portal.common.TotalRewardController");

sap.ui.jsfragment("ZUI5_HR_Portal.fragment.TotalRewardDashbordE", {
	
	createContent : function(oController) {
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
		
		var oCell = null , oRow = null;
		
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			widths : ["" ,'20px'],
			columns : 2,
			width : "100%"
		}).setModel(oController._JSonModel3).bindElement("/results");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : new sap.m.Text({text : "Total Reward Dashboard"}).addStyleClass("Font20px FontColor6"),
			colSpan : 2
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "180px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Image({
						src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Main_icon_Reward.png",
						height : "120px"
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
			common.Password.openPasswordDialog(oController, "E_ZP01");
		}).addStyleClass("TileLayout CursorPointer");
		
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