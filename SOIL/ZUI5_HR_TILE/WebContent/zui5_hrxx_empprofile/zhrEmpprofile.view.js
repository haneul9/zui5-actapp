// Copyright (c) 2009-2014 SAP SE, All Rights Reserved



(function(){
	"use strict";
	sap.ui.jsview("zui5_hrxx_empprofile.zhrEmpprofile",{
//(function(){"use strict";sap.ui.jsview("sap.ushell.components.tiles.zui5_hrxx_empprofile.zhrEmpprofile",{
	getControllerName:function(){
		return"zui5_hrxx_empprofile.zhrEmpprofile";
//		return "sap.ushell.components.tiles.zui5_hrxx_empprofile.zhrEmpprofile"
	},
	createContent:function(c){
		this.setHeight('100%');
		this.setWidth('100%');
	},
	
	getTileControl:function(){
		jQuery.sap.require('sap.m.Tile');
		jQuery.sap.require('sap.ui.commons.TextView');
		jQuery.sap.require("sap.m.Toolbar", "sap.m.ToolbarSpacer", "sap.ui.commons.Label", "sap.ui.commons.Image" , "sap.ui.core.Icon");
		jQuery.sap.require("sap.ui.commons.layout.MatrixLayout", "sap.ui.commons.layout.VerticalLayout", "sap.ui.core.HTML", "sap.ui.core.CustomData");
		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/css/actapp.css");
		
		var oController =this.getController();
		
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			width : '150px',
			columns : 2,
			widths : ["75px", "75px"]
		}).setModel(oController._JSonModel).bindElement("/results");	
		
		var oCell = null , oRow = null;
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2 ,
			content : new sap.ui.commons.TextView({text : '사원 프로파일'
			}).addStyleClass("L2PTitle1")
		});
	
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2 ,
			content :new sap.ui.core.HTML({
				preferDOM  : false,
				content : "<div style='height:12px'> </div>"
			})
		});
	
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		
		var oImage = new sap.m.Image("EmpProfilePhoto",{
			src : "{pic}",
//			height : "70px"
			width : "70px"
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ });
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			rowSpan : 3 ,
			content : oImage,
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [ new sap.ui.commons.TextView({
				text : "{Ename}",
			}).addStyleClass("L2PFont17 L2PFontBold")	],
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
//		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ });
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [ new sap.m.Label({
				text : "{Zzjikgbt}",
				tooltip : "{Zzjikgbt}",
				width : "75px"
//				text : "과장"
			}).addStyleClass("L2PFont13")	],
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ });
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [ new sap.m.Label({
				text : "{Zzjiktlt}",
				tooltip : "{Zzjiktlt}",
				width : "75px"
//				text : "PM"
			}).addStyleClass("L2PFont13")	],
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
			}).addStyleClass("L2PFont13")
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"23px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			colSpan : 2,
			content : [ new sap.m.Label({
				text : "{Stetx}",
				tooltip : "{Stetx}",
				width : "150px"
			}).addStyleClass("L2PFont13")		],
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [oMatrixLayout] 
		});
		
		oLayout.addStyleClass("L2PTilePadding");
 
		var oCustomTile = new sap.m.CustomTile({ 
			  content : [oLayout] , 
		  press:[oController.onPress,oController]
		}).addStyleClass("sapUiSizeCompact Tile TileLayout");
		return oCustomTile;
	},
	
	getLinkControl:function(){
		jQuery.sap.require('sap.m.Link');
		return new sap.m.Link({text:"{/config/display_title_text}",href:"{/nav/navigation_target_url}"});
	}
	
  });
}());



