sap.ui.jsfragment("ZUI5_HR_Portal.fragment.SignE", {
	
	createContent : function(oController) {
		jQuery.sap.registerModulePath("plugin", "/sap/bc/ui5_ui5/sap/ZUI5_HR_ESSAPP/ZUI5_HR_Portal/plugin");
		jQuery.sap.require("plugin.Chart");
		
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
		
		var oCell = null , oRow = null;
		
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			widths : ["" ,'100px'],
			columns : 2,
			width : "100%"
		}).setModel(oController._SignE).bindElement("/Data");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : new sap.m.Text({text : "HR 결재함"}).addStyleClass("Font22px FontColor6")
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		var oChart = new sap.ui.commons.layout.VerticalLayout({
			content : new sap.ui.core.HTML({preferDOM : false, content : "<canvas id='chart-areaE'  width='120' height='120' style='padding-right:2px' />"})
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Left,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [oChart]
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		var oCnt1 = new sap.ui.commons.Label({text : "{Cnt01}", width : "100%" ,textAlign : "End"}).addStyleClass("Font22px FontColorApply");
		
		var oCnt2 = new sap.ui.commons.Label({text : "{Cnt02}", width : "100%" ,textAlign : "End"}).addStyleClass("Font22px FontColorApproval");
		
		var oCnt3 = new sap.ui.commons.Label({text : "{Cnt03}", width : "100%" ,textAlign : "End"}).addStyleClass("Font22px FontColorReject");
		
		var oLegendLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			widths : ['15px','40px',''],
			columns : 3,
			layoutFixed : false,
		}).setModel(oController._SignE).bindElement("/Data");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Bottom,
			content : [new sap.ui.core.Icon({src: "sap-icon://circle-task-2", color: "#4bc0c0", size : "14px"}).addStyleClass("PaddingTop5px")]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({	// 신청
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Bottom,
			content : [new sap.ui.commons.Label({text : "신청", tooltip :  "신청"}).addStyleClass("Font14px FontColor9")]
		
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Bottom,
			content : [oCnt1]
		});
		oRow.addCell(oCell);
		oLegendLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oLegendLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.core.Icon({src: "sap-icon://circle-task-2", color: "#36a2eb", size : "14px"}).addStyleClass("PaddingTop5px")]
		
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({	// 승인
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.commons.Label({text : "승인", tooltip : "승인"}).addStyleClass("Font14px FontColor9")]
			
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [oCnt2]
		});
		oRow.addCell(oCell);
		oLegendLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.core.Icon({src: "sap-icon://circle-task-2", color: "#FF8888"}).addStyleClass("PaddingTop5px")]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({	// 반려
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.commons.Label({text : "반려", tooltip : "ff6384"}).addStyleClass("Font14px FontColor9")]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [oCnt3]
		});
		oRow.addCell(oCell);
		oLegendLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Left,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [oChart]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [oLegendLayout]
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.TextView({
		        	   text : "{Prdtx}",
		        	   width : "100%",
		        	   textAlign : "Center",
				   }).addStyleClass("FontSubTitle"),
		    colSpan : 2
		});
		oRow.addCell(oCell);
		
		oMatrixLayout.addRow(oRow);
		
		oMatrixLayout.addDelegate({
			onAfterRendering: function() {
				oController.readAfterProcessE(oController);
			}
		});
		
		var oMainMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 3,
			widths : ["20px", "", "20px"],
			width : "295px",
			height : "295px"
		}).attachBrowserEvent("click", function(){
			oController.moveTiletoPage(oController,"Approval");
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
//			hAlign : sap.ui.commons.layout.HAlign.Middle,
//			vAlign : sap.ui.commons.layout.VAlign.Center,
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