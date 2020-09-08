// Copyright (c) 2009-2014 SAP SE, All Rights Reserved



(function(){
	"use strict";
	sap.ui.jsview("zui5_hrxx_dynamictile2.DynamicTile",{
//(function(){"use strict";sap.ui.jsview("sap.ushell.components.tiles.zui5_hrxx_dynamictile2.DynamicTile",{
	getControllerName:function(){
		return"zui5_hrxx_dynamictile2.DynamicTile";
//		return "sap.ushell.components.tiles.zui5_hrxx_dynamictile2.DynamicTile"
	},
	createContent:function(c){
		this.setHeight('100%');
		this.setWidth('100%');
	},
	
	getTileControl:function(){
		jQuery.sap.require('sap.m.GenericTile');
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
			visible : {
				path : "/data/Number1yn",
				formatter : function(fVal){
					if(fVal && fVal == "Y") return true;
					else return false;
				}
			}  
		});	
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			colSpan : 2 ,
////			content : new sap.ui.commons.TextView({text : '{/data/display_title_text}'
//			content : new sap.m.Text({text : '{/data/display_title_text}'
//			}).addStyleClass("L2PTitle1")
//		});
//		oRow.addCell(oCell);
//		oMainContent.addRow(oRow);
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			colSpan : 2 ,
//			content : new sap.m.Text({text : '{/data/display_subtitle_text}' ,
//			
//			}).addStyleClass("L2PFontSubTitle2"),
//		}).addStyleClass("L2PPaddingTopBottom");
//		oRow.addCell(oCell);
//		oMainContent.addRow(oRow);
//		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "60px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.TextView({
		        	   text : '{/data/Number1}',
		        	   width : "100%",
		        	   textAlign : "End"
				   }).addStyleClass("L2PFontMSSMainText L2PLineHeight"),
    	    colSpan : 2
		}).addStyleClass("L2PPaddingTopBottom");
		oRow.addCell(oCell);		
		oMainContent.addRow(oRow);
		
		
		var oMainContent2 =  new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : true,
			widths : ['20%','80%'],
			columns : 2,
			visible : {
				path : "/data/Number2yn",
				formatter : function(fVal){
					if(fVal && fVal == "Y") return true;
					else return false;
				}
			}  
		});	
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			colSpan : 2 ,
//			content : new sap.ui.commons.TextView({text : '{/data/display_title_text}'
//			}).addStyleClass("L2PTitle1")
//		});
//		oRow.addCell(oCell);
//		oMainContent2.addRow(oRow);
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			colSpan : 2 ,
//			content : new sap.ui.commons.TextView({text : '{/data/display_subtitle_text}' ,
//			
//			}).addStyleClass("L2PFontSubTitle2"),
//		}).addStyleClass("L2PPaddingTopBottom");
//		oRow.addCell(oCell);
//		oMainContent2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "60px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.layout.HorizontalLayout({
							content : [
								new sap.ui.commons.TextView({
						        	   text : '{/data/Number1}',
						        	   width : "100%",
						        	   textAlign : "End"
								   }).addStyleClass("L2PFontMSSMainText L2PLineHeight"),
							    new sap.ui.commons.TextView({
						        	   text : '/',
						        	   width : "100%",
						        	   textAlign : "End"
							    }).addStyleClass("L2PFontMSSMainText4 L2PLineHeight"),
							    new sap.ui.commons.TextView({
						        	   text : '{/data/Number2}',
						        	   width : "100%",
						        	   textAlign : "End"
							    }).addStyleClass("L2PFontMSSMainText3 L2PLineHeight"),
							]
						}),
    	    colSpan : 2,
    	    hAlign : "Right"
		}).addStyleClass("L2PPaddingTopBottom");
		oRow.addCell(oCell);		
		oMainContent2.addRow(oRow);
		
		var oMainContent3 =  new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : true,
			widths : ['20%','80%'],
			columns : 2,
			visible : {
				path : "/data/Number3yn",
				formatter : function(fVal){
					if(fVal && fVal == "Y") return true;
					else return false;
				}
			}  
		});	
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			colSpan : 2 ,
//			content : new sap.ui.commons.TextView({text : '{/data/display_title_text}'
//			}).addStyleClass("L2PTitle1")
//		});
//		oRow.addCell(oCell);
//		oMainContent3.addRow(oRow);
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			colSpan : 2 ,
//			content : new sap.ui.commons.TextView({text : '{/data/display_subtitle_text}' ,
//			
//			}).addStyleClass("L2PFontSubTitle2"),
//		}).addStyleClass("L2PPaddingTopBottom");
//		oRow.addCell(oCell);
//		oMainContent3.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "60px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.layout.HorizontalLayout({
							content : [
								new sap.ui.commons.TextView({
						        	   text : '{/data/Number1}',
						        	   width : "100%",
						        	   textAlign : "End"
								   }).addStyleClass("L2PFontMSSMainText L2PLineHeight"),
							    new sap.ui.commons.TextView({
						        	   text : '/',
						        	   width : "100%",
						        	   textAlign : "End"
							    }).addStyleClass("L2PFontMSSMainText4 L2PLineHeight"),
							    new sap.ui.commons.TextView({
						        	   text : '{/data/Number2}',
						        	   width : "100%",
						        	   textAlign : "End"
								   }).addStyleClass("L2PFontMSSMainText L2PLineHeight"),
							    new sap.ui.commons.TextView({
						        	   text : '/',
						        	   width : "100%",
						        	   textAlign : "End"
							    }).addStyleClass("L2PFontMSSMainText4 L2PLineHeight"),
							    new sap.ui.commons.TextView({
						        	   text : '{/data/Number3}',
						        	   width : "100%",
						        	   textAlign : "End"
							    }).addStyleClass("L2PFontMSSMainText3 L2PLineHeight"),
							    new sap.ui.commons.TextView({
						        	   text : '/',
						        	   width : "100%",
						        	   textAlign : "End"
							    }).addStyleClass("L2PFontMSSMainText4 L2PLineHeight"),
							    new sap.ui.commons.TextView({
						        	   text : '{/data/Number4}',
						        	   width : "100%",
						        	   textAlign : "End"
							    }).addStyleClass("L2PFontMSSMainText3 L2PLineHeight"),
							]
						}),
    	    colSpan : 2,
    	    hAlign : "Right"
		}).addStyleClass("L2PPaddingTopBottom");
		oRow.addCell(oCell);		
		oMainContent3.addRow(oRow);

		var oFooterLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "145px",
			content : [new sap.ui.commons.TextView({
	        	   text : '{/data/display_info_text}',
	        	   width : "145px",
	        	   textAlign : "End"
			   }).addStyleClass("L2PFontSubTitle")]
		});
		
		var oBinLayout = new sap.ui.core.HTML({ preferDOM  : false, 	
												content : oController.getView().getModel().getProperty('/data/height')	});
		var oContents = [
			oMainContent,
			oMainContent2,
			oMainContent3,
			new sap.ui.core.HTML({ preferDOM  : false, 	content : "<div style='height:5px'></div>"	}),
//			oBinLayout,
//			oFooterLayout
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
			content : [oContents]
		});		
		oLayout.addStyleClass("L2PTilePadding");
		
		var oCustomTile = new sap.m.GenericTile({
			 	header : "{/data/display_title_text}",
			 	mode : "ContentMode",
			 	subheader : "{/data/display_subtitle_text}",
			 	tileContent : [new sap.m.TileContent({content : oLayout, footer : "{/data/display_info_text}"})],
			 	backgroundImage : "/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/image/image1.jpg",
			 	press:[oController.onPress, oController]
		}).addStyleClass("sapUiSizeCompact Tile TileLayout");	//L2PTilePadding
		return oCustomTile;
		
	},
	
	getLinkControl:function(){
		jQuery.sap.require('sap.m.Link');
		return new sap.m.Link({text:"{/config/display_title_text}",href:"{/nav/navigation_target_url}"});
	}
	
  });
}());



