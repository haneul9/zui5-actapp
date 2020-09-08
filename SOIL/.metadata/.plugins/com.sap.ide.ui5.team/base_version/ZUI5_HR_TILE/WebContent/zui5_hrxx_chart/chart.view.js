// Copyright (c) 2009-2014 SAP SE, All Rights Reserved



(function(){
	"use strict";
	sap.ui.jsview("zui5_hrxx_chart.chart",{
//(function(){"use strict";sap.ui.jsview("sap.ushell.components.tiles.zui5_hrxx_chart.chart",{
	getControllerName:function(){
		return"zui5_hrxx_chart.chart";
//		return "sap.ushell.components.tiles.zui5_hrxx_chart.chart"
	},
	createContent:function(c){
		this.setHeight('100%');
		this.setWidth('100%');
	},
	
	getTileControl:function(){
		jQuery.sap.require('sap.m.GenericTile');
		jQuery.sap.require('sap.m.CustomTile');
		jQuery.sap.require('sap.m.Tile');
		jQuery.sap.require('sap.m.Text');
		jQuery.sap.require("sap.m.Toolbar", "sap.m.ToolbarSpacer", "sap.ui.commons.TextView", "sap.ui.commons.Image" , "sap.ui.core.Icon");
		jQuery.sap.require("sap.ui.commons.layout.MatrixLayout", "sap.ui.commons.layout.VerticalLayout", "sap.ui.core.HTML", "sap.ui.core.CustomData");
		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/css/actapp.css");

		jQuery.sap.registerModulePath("plugin", "/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/plugin");
		jQuery.sap.require("plugin.Chart");
		
		var oController =this.getController();
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate());
		var nextDate = new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate());
		
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
		
		var oCell = null , oRow = null;
		
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			widths : ['80px','65px'],
			columns : 2,
			width : "145px"
		}).setModel(oController._JSonModel).bindElement("/results");
		oMatrixLayout.bindElement("/results");
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : new sap.ui.commons.TextView({text : "HR 신청함"}).addStyleClass("L2PTitle1")
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
				content : "<div style='height:5px'> </div>"
			})]
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		var oChart = new sap.ui.commons.layout.VerticalLayout({
			content : new sap.ui.core.HTML({preferDOM : false, content : "<canvas id='chart-area'  width='70' height='70' style='padding-right:2px' />"})
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
			width : "55px",
			widths : ['14px','25px',''],
			columns : 3,
			layoutFixed : false,
		
		}).setModel(oController._JSonModel).bindElement("/results");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "25px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.core.Icon({src: "sap-icon://color-fill", size : "12px", color: "#FABD64"})]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({	// 신청
			hAlign : sap.ui.commons.layout.HAlign.Left,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.commons.Label({text : "신청", tooltip :  "신청", textAlign : "Begin"}).addStyleClass("L2PStatusFont")]
		
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.End,
			content : [oCnt1]
		});
		oRow.addCell(oCell);
		oLegendLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "25px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.core.Icon({src: "sap-icon://color-fill", color: "#2ecc71"})]
		
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({	// 승인
			hAlign : sap.ui.commons.layout.HAlign.Left,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.commons.Label({text : "승인", tooltip : "승인"}).addStyleClass("L2PStatusFont")]
			
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.End,
			content : [oCnt2]
		});
		oRow.addCell(oCell);
		oLegendLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "25px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.core.Icon({src: "sap-icon://color-fill", color: "#FF8888"})]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({	// 반려
			hAlign : sap.ui.commons.layout.HAlign.Left,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.commons.Label({text : "반려", tooltip : "반려"}).addStyleClass("L2PStatusFont")]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.End,
			content : [oCnt3]
		});
		oRow.addCell(oCell);
		oLegendLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2,
			content : [new sap.ui.core.HTML({
				preferDOM  : false,
				content : "<div style='height:19px'> </div>"
//				content : "<div style='height:20px'> </div>"
			})]
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
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
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [oMatrixLayout] 
		});
		
		oLayout.addStyleClass("L2PTilePadding");
		
		var oCustomTile = new sap.m.CustomTile({ 
			  content : [oLayout]
		  ,
		  press:[oController.onPress, oController]
		}).addStyleClass("Tile TileLayout");
		
		return oCustomTile;
	},
	
	getLinkControl:function(){
		jQuery.sap.require('sap.m.Link');
		return new sap.m.Link({text:"{/config/display_title_text}",href:"{/nav/navigation_target_url}"});
	}
	
  });
}());



