(function(){
	"use strict";
	sap.ui.jsview("zui5_hrxx_graph.Graph",{
//(function(){"use strict";sap.ui.jsview("sap.ushell.components.tiles.zhr_empprofile.zhrEmpprofile",{
	
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_graph.Graph
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_graph.Graph";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_graph.Graph
	*/ 
	
	createContent:function(c){
		this.setHeight('100%');
		this.setWidth('100%');
	},
	
	getTileControl : function() {
		jQuery.sap.require('sap.m.CustomTile');
		jQuery.sap.require('sap.ui.commons.TextView');
		jQuery.sap.require("sap.ui.commons.layout.MatrixLayout", "sap.ui.commons.layout.VerticalLayout", "sap.ui.core.HTML");
		
		jQuery.sap.registerModulePath("control", "/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/control");
		jQuery.sap.require("control.HorizontalStackChart");
		
		
		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/css/actapp.css");

		var surfix = "?" + new Date().getTime();
		
//		var oBundleText = jQuery.sap.resources({
//			url : "/sap/bc/ui5_ui5/sap/ZHRXX_TMAPP/translation/i18n.properties" + surfix, //번역파일 주소
//			locale : sap.ui.getCore().getConfiguration().getLanguage()
//		});
		
		
		var oController = this.getController();
				
	    var oCell = null , oRow = null;
		var oMatrixLayout =  new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : true,
			width : "100%",
			columns : 1,
		}).setModel(oController._JSonModel).bindElement("/results");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.ui.commons.TextView({text : oBundleText.getText("TILE_ANNUAL_TITLE")}).addStyleClass("L2PTitle1")	// 근태실적조회
			content : new sap.ui.commons.TextView({text : "근태실적조회"}).addStyleClass("L2PTitle1")	// 근태실적조회
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :new sap.ui.core.HTML({preferDOM : false, content : "<div style='height:12px'> </div>"})
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new control.HorizontalStackChart({
				bgColor : "#f5f5f5",
				barColor : "#00baf3",
				min : "{Cntu1}",
				max : "{Cntc1}",
				label : oBundleText.getText("TILE_ANNUAL_SUB1"),
				label2 : "{Text1}",
				height : "35px"				
			})
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		var oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new control.HorizontalStackChart({
				bgColor : "#f5f5f5",
				barColor : "#2ecc71",
				min : "{Cntu2}",
				max : "{Cntc2}",
				label : oBundleText.getText("TILE_ANNUAL_SUB2"),
				label2 : "{Text2}",
				height : "35px"				
			})
		});
		oRow1.addCell(oCell);
		oMatrixLayout.addRow(oRow1);
		
		var oRow2 = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new control.HorizontalStackChart({
				bgColor : "#f5f5f5",
				barColor : "#ffcc00",
				min : "{Cntu3}",
				max : "{Cntc3}",
				label : oBundleText.getText("TILE_ANNUAL_SUB3"),
				label2 : "{Text3}" ,
				height : "35px"
			})
		});
		oRow2.addCell(oCell);
		oMatrixLayout.addRow(oRow2);
		
		var oRow3 = new sap.ui.commons.layout.MatrixLayoutRow({height : "36px"});
		oMatrixLayout.addRow(oRow3);
		
		var oRow4 = new sap.ui.commons.layout.MatrixLayoutRow({height : "36px"});
		oMatrixLayout.addRow(oRow4);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.TextView({
			        	   text : oBundleText.getText("USE_OCCUR"),
			        	   width : "100%",
			        	   textAlign : "End"
					  }).addStyleClass("L2PFontSubTitle")
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
				
		oCustomTile.setModel(oController._JSonModel).bindElement("/results");
		
		oCustomTile.addEventDelegate({
			onAfterRendering : function(){				
				var oCntc2 = parseFloat(oController._JSonModel.getProperty("/results/Row1"));
				var oCntc3 = parseFloat(oController._JSonModel.getProperty("/results/Row2"));
				
				if(oCntc2 == 0)
					$("#" + oRow1.sId).css("display", "none");
				else
					$("#" + oRow1.sId).css("display", "table-row");
				
				if(oCntc3 == 0)
					$("#" + oRow2.sId).css("display", "none");
				else
					$("#" + oRow2.sId).css("display", "table-row");
				
				if(oCntc2 == 0 || oCntc3 == 0)
					$("#" + oRow3.sId).css("display", "table-row");
				else
					$("#" + oRow3.sId).css("display", "none");
				
				if(oCntc2 == 0 && oCntc3 == 0)
					$("#" + oRow4.sId).css("display", "table-row");
				else
					$("#" + oRow4.sId).css("display", "none");
			}
		});
		
		return oCustomTile;
	},
	
	getLinkControl:function(){
		jQuery.sap.require('sap.m.Link');
		return new sap.m.Link({text:"{/config/display_title_text}",href:"{/nav/navigation_target_url}"});
	}
	
});
}());