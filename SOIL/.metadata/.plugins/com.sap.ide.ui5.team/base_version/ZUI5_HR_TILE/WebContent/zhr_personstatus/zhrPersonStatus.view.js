// Copyright (c) 2009-2014 SAP SE, All Rights Reserved



(function(){
	"use strict";
	sap.ui.jsview("zhr_personstatus.zhrPersonStatus",{
// (function(){"use
// strict";sap.ui.jsview("sap.ushell.components.tiles.zhr_personstatus.zhrPersonStatus",{
	getControllerName:function(){
		return"zhr_personstatus.zhrPersonStatus";
// return "sap.ushell.components.tiles.zhr_personstatus.zhrPersonStatus"
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
		
		var oController = this.getController();
		
//		var curDate = new Date();
//		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate());
//		var nextDate = new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate());
//		
//		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
//		
//		var dateFormatMD = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
//		var vPeriod = "( " + dateFormatMD.format(prevDate) +  " ~ " + dateFormatMD.format(nextDate) + " )";
//		var vPeriod = "( 5/2 ~ 6/1 )";
		
		var oCell = null , oRow = null;
		
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			widths : ['60px',''],
			columns : 2,
			width : "150px"
		}).setModel(oController._JSonModel).bindElement("/results");
		oMatrixLayout.bindElement("/results");
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : new sap.ui.commons.TextView({text : '인원현황'}).addStyleClass("L2PTitle1")
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
				content : "<div style='height:8px'> </div>"
			})]
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		var oChart = new sap.ui.commons.layout.VerticalLayout({
			content : new sap.ui.core.HTML({preferDOM : false, content : "<canvas id='chart-area3' width='60' height='60'/>"})
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [oChart]
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		var oCnt1 = new sap.ui.commons.Label({text : "{Cnt01}", width : "100%" ,textAlign : "End"}).addStyleClass("L2PStatusFont");
		
		var oCnt2 = new sap.ui.commons.Label({text : "{Cnt02}", width : "100%" ,textAlign : "End"}).addStyleClass("L2PStatusFont");
		
		var oCnt3 = new sap.ui.commons.Label({text : "{Cnt03}", width : "100%" ,textAlign : "End"}).addStyleClass("L2PStatusFont");
		
		var oCnt4 = new sap.ui.commons.Label({text : "{Cnt04}", width : "100%" ,textAlign : "End"}).addStyleClass("L2PStatusFont");

		var oCnt5 = new sap.ui.commons.Label({text : "{Cnt05}", width : "100%" ,textAlign : "End"}).addStyleClass("L2PStatusFont");

		var oCnt6 = new sap.ui.commons.Label({text : "{Cnt06}", width : "100%" ,textAlign : "End"}).addStyleClass("L2PStatusFont");
		
		var oLegendLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "80px",
			widths : ['12px', '3px', '20px',''],
			columns : 4,
			layoutFixed : false,		
		}).setModel(oController._JSonModel).bindElement("/results");
		
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "18px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.core.Icon({src: "sap-icon://color-fill", color: "#e62828"})]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.commons.Label({text : "담당", tooltip : "담당" }).addStyleClass("L2PPeopleStatusFont")]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.End,
			content : [oCnt6]
		});
		oRow.addCell(oCell);
		oLegendLayout.addRow(oRow);
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "18px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.core.Icon({src: "sap-icon://color-fill", size : "12px", color: "#2ecc71"})]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.commons.Label({text : "관리직", tooltip : "관리직" }).addStyleClass("L2PPeopleStatusFont")]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.End,
			content : [oCnt1]
		});
		oRow.addCell(oCell);
		oLegendLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "18px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.ui.core.Icon({src: "sap-icon://color-fill", color: "#52a7e0"})]
			content : [new sap.ui.core.Icon({src: "sap-icon://color-fill", color: "#ff8000"})]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.commons.Label({text : "사무기술", tooltip : "사무기술" }).addStyleClass("L2PPeopleStatusFont")]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.End,
			content : [oCnt2]
		});
		oRow.addCell(oCell);
		oLegendLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "18px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.core.Icon({src: "sap-icon://color-fill", color: "#eacd58"})]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.commons.Label({text : "사무행정", tooltip : "사무행정" }).addStyleClass("L2PPeopleStatusFont")]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.End,
			content : [oCnt3]
		});
		oRow.addCell(oCell);
		oLegendLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "18px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.core.Icon({src: "sap-icon://color-fill", color: "#1ab9dd"})]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.commons.Label({text : "기능직", tooltip : "기능직" }).addStyleClass("L2PPeopleStatusFont")]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.End,
			content : [oCnt4]
		});
		oRow.addCell(oCell);
		oLegendLayout.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "18px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.core.Icon({src: "sap-icon://color-fill", color: "#6d6c6c"})]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.ui.commons.Label({text : "촉탁직", tooltip : "촉탁직" }).addStyleClass("L2PPeopleStatusFont")]
			content : [new sap.ui.commons.Label({text : "기타직", tooltip : "기타직" }).addStyleClass("L2PPeopleStatusFont")]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.End,
			content : [oCnt5]
		});
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
				content : "<div style='height:2px'> </div>"
			})]
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.ui.commons.TextView({
//		        	   text : "현재일 기준",
//		        	   width : "100%",
//		        	   textAlign : "Begin"
//				   }).addStyleClass("L2PFontPersonSubTitle")
//		});
//		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : new sap.ui.commons.TextView({
		        	   text : "{Prdtx}",
		        	   width : "100%",
		        	   textAlign : "End"
				   }).addStyleClass("L2PFontPersonSubTitle")
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [oMatrixLayout] 
		});
		
		oLayout.addStyleClass("L2PTilePadding");
		
		var oCustomTile = new sap.m.CustomTile({ 
			  content : [oLayout],
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



