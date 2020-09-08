// Copyright (c) 2009-2014 SAP SE, All Rights Reserved



(function(){
	"use strict";
	sap.ui.jsview("zhr_ass_tile.DynamicTile",{
//(function(){"use strict";sap.ui.jsview("sap.ushell.components.tiles.zhr_ass_tile.DynamicTile",{
	getControllerName:function(){
		return"zhr_ass_tile.DynamicTile";
//		return "sap.ushell.components.tiles.zhr_ass_tile.DynamicTile"
	},
	createContent:function(c){
		this.setHeight('100%');
		this.setWidth('100%');
	},
	
	getTileControl:function(){
		jQuery.sap.require('sap.m.CustomTile');
		jQuery.sap.require('sap.m.Text');
		jQuery.sap.require("sap.ui.commons.TextView", "sap.ui.core.Icon" , "sap.ui.layout.VerticalLayout");
		jQuery.sap.require("sap.ui.commons.layout.MatrixLayout", "sap.ui.commons.layout.VerticalLayout", "sap.ui.core.HTML");
		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/css/actapp.css");
		
		var oController =this.getController();
		
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : true,
			width : '100%',
			columns : 1,
		});	
		
		var oCell = null , oRow = null;
		
		var oMainContent =  new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : true,
			widths : ['20%','80%'],
			columns : 2,
		});	
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2 ,
			content : new sap.ui.commons.TextView({text : '{/data/display_title_text}'
			}).addStyleClass("L2PTitle1")
		});
		oRow.addCell(oCell);
		oMainContent.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 2 ,
					content : new sap.ui.commons.layout.HorizontalLayout({
						content : [new sap.ui.commons.TextView({
										text : "신청/승인/반려",
						        	    width : "100%",
						        	    textAlign : "End"
								  }).addStyleClass("L2PFontSubTitle L2PLineHeight")
								  ]
					})
		}).addStyleClass("L2PPaddingTopBottom");
		oRow.addCell(oCell);
		oMainContent.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "60px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			hAlign : "End",
			content : new sap.ui.commons.layout.HorizontalLayout({
				content : [new sap.ui.commons.TextView({
				        	    text : '{/data/Cnt01}',
				        	    width : "100%",
				        	    textAlign : "End"
						  }).addStyleClass("L2PFontMainText L2PLineHeight"),
						  new sap.ui.commons.TextView({
				        	    text : "/",
				        	    width : "100%",
				        	    textAlign : "End"
						  }).addStyleClass("L2PFontMainText L2PLineHeight"),
						  new sap.ui.commons.TextView({
				        	    text : '{/data/Cnt02}',
				        	    width : "100%",
				        	    textAlign : "End"
						  }).addStyleClass("L2PFontMainText L2PLineHeight"),
						  new sap.ui.commons.TextView({
				        	    text : "/",
				        	    width : "100%",
				        	    textAlign : "End"
						  }).addStyleClass("L2PFontMainText L2PLineHeight"),
						  new sap.ui.commons.TextView({
				        	    text : '{/data/Cnt03}',
				        	    width : "100%",
				        	    textAlign : "End"
						  }).addStyleClass("L2PFontMainText L2PLineHeight"),]
			})
		}).addStyleClass("L2PPaddingTopBottom");
		oRow.addCell(oCell);
		
		oMainContent.addRow(oRow);
		

		var oFooterLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "145px",
			content : [new sap.ui.commons.TextView({
	        	   text : '{/data/display_info_text}',
	        	   width : "145px",
	        	   textAlign : "End"
			   }).addStyleClass("L2PFontSubTitle")]
		});
		
		var oContents = [
			oMainContent, 
			new sap.ui.core.HTML({ preferDOM  : false, 	content : "<div style='height:5px'></div>"	}),
			oFooterLayout
			];
		
		for(var i=0;i<oContents.length;i++){
			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				content : oContents[i]
			}).addStyleClass("L2PPaddingTopBottom");
			oRow.addCell(oCell);
			oMatrixLayout.addRow(oRow);
		}
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "145px",
			content : [oMatrixLayout]
		});
		oLayout.addStyleClass("L2PTilePadding");
		
		
		var oCustomTile = new sap.m.CustomTile({ 
			  content : [oLayout]
		  ,
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



