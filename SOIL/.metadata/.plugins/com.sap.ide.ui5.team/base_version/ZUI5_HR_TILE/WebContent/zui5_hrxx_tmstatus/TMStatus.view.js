(function(){
	"use strict";
	sap.ui.jsview("zui5_hrxx_tmstatus.TMStatus",{
//(function(){"use strict";sap.ui.jsview("sap.ushell.components.tiles.zhr_empprofile.zhrEmpprofile",{
	
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_tmstatus.TMStatus
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_tmstatus.TMStatus";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_tmstatus.TMStatus
	*/ 
	
	createContent:function(c){
		this.setHeight('100%');
		this.setWidth('100%');
	},
	
	getTileControl : function() {
		jQuery.sap.require('sap.m.CustomTile', 'sap.m.TileContent');
		jQuery.sap.require('sap.ui.commons.TextView', "sap.m.Text");
		jQuery.sap.require("sap.ui.commons.layout.MatrixLayout", "sap.ui.commons.layout.VerticalLayout", "sap.ui.core.HTML", "sap.m.NumericContent");
		
		jQuery.sap.registerModulePath("control", "/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/control");
		jQuery.sap.require("control.HorizontalStackChart");
				
		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/css/actapp.css");

		var surfix = "?" + new Date().getTime();
		
		var oBundleText = jQuery.sap.resources({
			url : "/sap/bc/ui5_ui5/sap/ZHRXX_TMAPP/translation/i18n.properties" + surfix, //번역파일 주소
			locale : sap.ui.getCore().getConfiguration().getLanguage()
		});
		
		var oController = this.getController();
		
	    var oRow, oCell;
	    
	    // 법적환산 ot 평균시간 
	    var oNumericContent = new sap.m.NumericContent({
	    	animateTextChange : true,
	    	formatterValue : false,
	    	indicator : "{Indicator}",
	    	nullifyValue : true,
	    	value : "{Number}",
	    	valueColor : "{Color}",
	    	scale : "{Scale}"
	    });
	    
	    // 법적환산 ot 인원 수 그래프
	    var oGraph = new sap.ui.commons.layout.MatrixLayout({
	    	width : "100%",
	    	columns : 1
	    });
	    
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new control.HorizontalStackChart({
				bgColor : "#f5f5f5",
				barColor : "#FF8888",
//				barColor : "#CC1919",
				min : "{Cntu1}" ,
				max : "{Cntc1}" ,
				label : oBundleText.getText("TILE_TMSTATUS_LEGEND1"),
				label2 : "{Label1}",
				height : "28px",
				width : "90%"
			})
		});
		oRow.addCell(oCell);
		oGraph.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "3px" });
		oGraph.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new control.HorizontalStackChart({
				bgColor : "#f5f5f5",
				barColor : "#FABD64",
//				barColor : "#F0AB00",
				min : "{Cntu2}",
				max : "{Cntc2}",
				label : oBundleText.getText("TILE_TMSTATUS_LEGEND2"),
				label2 : "{Label2}",
				height : "28px",
				width : "90%"				
			})
		});
		oRow.addCell(oCell);
		oGraph.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "3px" });
		oGraph.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new control.HorizontalStackChart({
				bgColor : "#f5f5f5",
				barColor : "#2ecc71",
//				barColor : "#00B050",
				min : "{Cntu3}" ,
				max : "{Cntc3}" ,
				label : oBundleText.getText("TILE_TMSTATUS_LEGEND3"),
				label2 : "{Label3}" ,
				height : "28px",
				width : "90%"
			})
		});
		oRow.addCell(oCell);
		oGraph.addRow(oRow);
	    
		// content
		var oMatrix =  new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : true,
			width : "100%",
			widths : ["", "5px", ""],
			columns : 3
		}).setModel(oController.getView().getModel()).bindElement("/data");
		oMatrix.addStyleClass("L2PTilePadding");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.TextView({text : oBundleText.getText("TILE_TMSTATUS_TITLE")}).addStyleClass("L2PTitle1"),
			colSpan : 3
		});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "13px"});
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.TextView({text : oBundleText.getText("TILE_TMSTATUS_SUBTITLE1")}).addStyleClass("L2PFontSubTitle2")
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.TextView({text : oBundleText.getText("TILE_TMSTATUS_SUBTITLE2")}).addStyleClass("L2PFontSubTitle2")
		});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "2px"});
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oNumericContent
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oGraph
		});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.TextView({text : "{Info}"}).addStyleClass("L2PFontSubTitle TextRight")
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.TextView({text : "{Info2}"}).addStyleClass("L2PFontSubTitle TextRight")
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);	
		
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			content : oMatrix
		});
	
		var oCustomTile = new sap.m.CustomTile({ 
			  content : [oMatrix],
			  press:[oController.onPress, oController]
		}).addStyleClass("sapUiSizeCompact TileWidth TileLayout");
		
//		var oCustomTile = new sap.m.GenericTile({
//			tileContent : [new sap.m.TileContent({content : oMatrix})],
//			press : [oController.onPress, oController]
//		}).addStyleClass("sapUiSizeCompact");		
		
		return oCustomTile;	
	},
	
	getLinkControl:function(){
		jQuery.sap.require('sap.m.Link');
		return new sap.m.Link({text:"{/config/display_title_text}",href:"{/nav/navigation_target_url}"});
	}
	
});
}());