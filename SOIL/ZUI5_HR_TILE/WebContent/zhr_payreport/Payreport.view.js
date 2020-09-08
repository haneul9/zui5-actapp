//sap.ui.jsview("zhr_payreport.Payreport", {
//
//	/** Specifies the Controller belonging to this View. 
//	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
//	* @memberOf zhr_payreport.Payreport
//	*/ 
//	getControllerName : function() {
//		return "zhr_payreport.Payreport";
//	},
//
//	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
//	* Since the Controller is given to this method, its event handlers can be attached right away. 
//	* @memberOf zhr_payreport.Payreport
//	*/ 
//	createContent : function(oController) {
//		jQuery.sap.require('sap.m.CustomTile');
//		jQuery.sap.require('sap.ui.commons.TextView');
//		jQuery.sap.require("sap.ui.commons.layout.MatrixLayout", "sap.ui.commons.layout.VerticalLayout", "sap.ui.core.HTML");
//		
//		jQuery.sap.registerModulePath("control", "/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/control");
//		jQuery.sap.require("control.VerticalStackChart");
//		
//		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/css/actapp.css");
//		
//		var vData = [{ label: "0", value: 0, color: "#00baf3" , vHeight : "60%" , top : "40%" , width : "22px"},
//			{ label: "50", value: 50, color: "#00baf3" , vHeight : "70%" , top : "30%", width : "22px"},
//			{ label: "20", value: 20, color: "#00baf3" , vHeight : "80%" , top : "20%", width : "22px"},
//			{ label: "30", value: 30, color: "#dddddd" , vHeight : "90%" , top : "10%", width : "22px"},
//			{ label: "30", value: 30, color: "#dddddd" , vHeight : "100%" , top : "0%", width : "22px"},
////			{ label: "30", value: 30, color: "#f5f5f5" , vHeight : "10%" , top : "90%"},
////			{ label: "30", value: 30, color: "#f5f5f5" , vHeight : "20%" , top : "80%"},
////			{ label: "30", value: 30, color: "#f5f5f5" , vHeight : "30%" , top : "70%"},
////			{ label: "30", value: 30, color: "#f5f5f5" , vHeight : "40%" , top : "60%"},
////			{ label: "30", value: 30, color: "#f5f5f5" , vHeight : "50%" , top : "50%"},
////			{ label: "30", value: 30, color: "#f5f5f5" , vHeight : "60%" , top : "40%"},
////			{ label: "30", value: 30, color: "#f5f5f5" , vHeight : "70%" , top : "30%"}
//			
//			]  ;	
//		
//		var vWidth = parseFloat(150 / vData.length - 5) + "px" ;
//		
//		for(var i =0; i< vData.length ; i++){
//			vData[i].width = vWidth;
//		}
//		
//		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
//			layoutFixed : false,
//			width : '150px',
//			columns : 1,
//		});	
//		
//		var oCell = null , oRow = null;
//		
//		var oTitle1 = new sap.ui.core.HTML({
//			preferDOM  : false,
//			content : "<div class='L2PTitle1'>" + "급여명세서" + "</div><div style='height:10px'> </div>"
//		});
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [ oTitle1	],
//		});
//		oRow.addCell(oCell);
//		oMatrixLayout.addRow(oRow)
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new control.VerticalStackChart({
//				contexts : vData ,
//			})
//		});
//		oRow.addCell(oCell);
//		oMatrixLayout.addRow(oRow);
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content :new sap.ui.core.HTML({
//				preferDOM  : false,
//				content : "<div style='height:5px'> </div>"
//			})
//		});
//		oRow.addCell(oCell);
//		oMatrixLayout.addRow(oRow);
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Right,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [ new sap.m.Text({text : "전년 대비 60%"}).addStyleClass("L2PFontSubTitle")	],
//		});
//		oRow.addCell(oCell);
//		oMatrixLayout.addRow(oRow);
//		
//		var oLayout = new sap.ui.commons.layout.VerticalLayout({
//			width : "100%",
//			content : [oMatrixLayout]
//		});
//		
//		oLayout.addStyleClass("L2PTilePadding");
//		
//		return oLayout;
//	}
//});


// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(){
	"use strict";
	sap.ui.jsview("zhr_payreport.Payreport",{
//(function(){"use strict";sap.ui.jsview("sap.ushell.components.tiles.zhr_payreport.Payreport",{
	getControllerName:function(){
		return"zhr_payreport.Payreport";
//		return "sap.ushell.components.tiles.zhr_payreport.Payreport"
	},
	createContent:function(c){
		this.setHeight('100%');
		this.setWidth('100%');
	},
	
	getTileControl:function(){
		jQuery.sap.require('sap.m.GenericTile');
		jQuery.sap.require('sap.m.CustomTile');
		jQuery.sap.require('sap.m.Tile');
		jQuery.sap.require("sap.m.Toolbar", "sap.m.ToolbarSpacer", "sap.ui.commons.TextView", "sap.ui.commons.Image" , "sap.ui.core.Icon");
		jQuery.sap.require("sap.ui.commons.layout.MatrixLayout", "sap.ui.commons.layout.VerticalLayout", "sap.ui.core.HTML", "sap.ui.core.CustomData");
		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/css/actapp.css");
		jQuery.sap.registerModulePath("control", "/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/control");
		jQuery.sap.require("control.VerticalStackChart");
		var oController =this.getController();
		
		var oCell = null , oRow = null;
		
		var oController =this.getController();
		
		var oCell = null , oRow = null;
		var oMatrixLayout =  new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : true,
			width : "100%",
			columns : 1,
		});	
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.TextView({text : "총보상명세서"}).addStyleClass("L2PTitle1")
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :new sap.ui.core.HTML({
				preferDOM  : false,
				content : "<div style='height:14px'> </div>"
			})
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		var vResult = oController._JSonModel.getProperty("/results");
		var vData = [ //{ label: vResult.Tip01, value: vResult.Amt01, color: vResult.Color01 , vHeight : vResult.Amt01P , top : vResult.Top01 , width : "25px"},
					 { label: vResult.Tip02, value: vResult.Amt02, color: vResult.Color02 , vHeight : vResult.Amt02P , top : vResult.Top02, width : "25px"},
					 { label: vResult.Tip03, value: vResult.Amt03, color: vResult.Color03 , vHeight : vResult.Amt03P , top : vResult.Top03, width : "25px"},
					 { label: vResult.Tip04, value: vResult.Amt04, color: vResult.Color04 , vHeight : vResult.Amt04P , top : vResult.Top04, width : "25px"},
					 { label: vResult.Tip05, value: vResult.Amt05, color: vResult.Color05 , vHeight : vResult.Amt05P , top : vResult.Top05, width : "25px"},
			]  ;	
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new control.VerticalStackChart({
				contexts : vData ,
			})
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :new sap.ui.core.HTML({
				preferDOM  : false,
				content : "<div style='height:3px'> </div>"
			})
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Right,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Text({text : "(성과급 제외) " + vResult.Btmsg}).addStyleClass("L2PFontSubTitle3")],
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "145px",
			content : [oMatrixLayout]
		});
		
		oLayout.addStyleClass("L2PTilePadding");
		
		var oCustomTile = new sap.m.CustomTile({ 
			  content : [oLayout],
			  press:[oController.onPress, oController]
		}).addStyleClass("sapUiSizeCompact Tile TileLayout");
		return oCustomTile;
	},
	
	getLinkControl:function(){
		jQuery.sap.require('sap.m.Link');
		return new sap.m.Link({text:"{/config/display_title_text}",href:"{/nav/navigation_target_url}"});
	}
	
  });
}());



