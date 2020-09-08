sap.ui.jsfragment("ZUI5_HR_ChartTest4.fragment.Sign", {
	
	createContent : function(oController) {
		jQuery.sap.registerModulePath("plugin", "/sap/bc/ui5_ui5/sap/ZUI5_HR_ESSAPP/ZUI5_HR_ChartTest4/plugin");
		jQuery.sap.require("plugin.Chart");
		
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
		
		var oCell = null , oRow = null;
		
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			widths : ['40%','60%'],
			columns : 2,
		}).setModel(oController._JSonModel2).bindElement("/results");
		oMatrixLayout.bindElement("/results");
		oMatrixLayout.addStyleClass("L2PTilePadding");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : new sap.ui.commons.TextView({text : "HR 결재함"}).addStyleClass("L2PTitle1")
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
				content : "<div style='height:15px'> </div>"
			})]
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		var oChart = new sap.ui.commons.layout.VerticalLayout({
			content : new sap.ui.core.HTML({preferDOM : false, content : "<canvas id='chart-area2'  width='70' height='70' style='padding-right:2px' />"})
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Left,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [oChart]
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		var oCnt1 = new sap.ui.commons.Label({text : "{Cnt01}", width : "100%" ,textAlign : "End"}).addStyleClass("L2PStatusFont");
		
		var oCnt2 = new sap.ui.commons.Label({text : "{Cnt02}", width : "100%" ,textAlign : "End"}).addStyleClass("L2PStatusFont");
		
		var oCnt3 = new sap.ui.commons.Label({text : "{Cnt03}", width : "100%" ,textAlign : "End"}).addStyleClass("L2PStatusFont");
		
		var oCnt4 = new sap.ui.commons.Label({text : "{Cnt04}", width : "100%" ,textAlign : "End"}).addStyleClass("L2PStatusFont");
		
		var oLegendLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			widths : ['15px','30px',''],
			columns : 3,
			layoutFixed : false,
		}).setModel(oController._JSonModel2).bindElement("/results");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.core.Icon({src: "sap-icon://color-fill", color: "#FABD64"})]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({	// 신청
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.commons.Label({text : "신청", tooltip :  "신청", textAlign : "Begin"}).addStyleClass("L2PStatusFont")]
		
		}).addStyleClass("PSNCPaddingBottom5px");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [oCnt1]
		}).addStyleClass("PSNCPaddingBottom5px");
		oRow.addCell(oCell);
		oLegendLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.core.Icon({src: "sap-icon://color-fill", color: "#2ecc71"})]
		
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({	// 승인
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.commons.Label({text : "승인", tooltip : "승인"}).addStyleClass("L2PStatusFont")]
			
		}).addStyleClass("PSNCPaddingBottom5px");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [oCnt2]
		}).addStyleClass("PSNCPaddingBottom5px");
		oRow.addCell(oCell);
		oLegendLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.core.Icon({src: "sap-icon://color-fill", color: "#FF8888"})]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({	// 반려
			hAlign : sap.ui.commons.layout.HAlign.Left,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.commons.Label({text : "반려", tooltip : "반려"}).addStyleClass("L2PStatusFont")]
		}).addStyleClass("PSNCPaddingBottom5px");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [oCnt3]
		}).addStyleClass("PSNCPaddingBottom5px");
		oRow.addCell(oCell);
		oLegendLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
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
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2,
			content : [new sap.ui.core.HTML({
				preferDOM  : false,
				content : "<div style='height:19px'> </div>"
			})]
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.TextView({
		        	   text : "{Prdtx}",
		        	   width : "100%",
		        	   textAlign : "End",
				   }).addStyleClass("L2PFontSubTitle"),
		    colSpan : 2
		});
		oRow.addCell(oCell);
		
		oMatrixLayout.addRow(oRow);
		
		oMatrixLayout.addDelegate({
			onAfterRendering: function() {
				oController.readAfterProcess2(oController);
			}
		});
		
		var oMainMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 1,
			width : "180px"
		});
		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Middle,
//			vAlign : sap.ui.commons.layout.VAlign.Center,
//			content : oMatrixLayout,
//		});
//		oRow.addCell(oCell);
//		oMainMatrixLayout.addRow(oRow);
		
		var oCustomTile = new sap.m.CustomTile({ 
			  content : [oMatrixLayout],
			  press: function(oEvent){
				  window.open("/sap/bc/ui5_ui5/sap/zui5_hr_essapp/ApprovalBox.html?_gAuth=E");
			  }
		}).addStyleClass("TileLayout"); 
		
		return oCustomTile;

	
	}
});