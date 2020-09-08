// Copyright (c) 2009-2014 SAP SE, All Rights Reserved



(function(){
	"use strict";
	sap.ui.jsview("zui5_hrxx_imagetile.Imagetile",{
//(function(){"use strict";sap.ui.jsview("sap.ushell.components.tiles.zui5_hrxx_imagetile.Imagetile",{
	getControllerName:function(){
		return"zui5_hrxx_imagetile.Imagetile";
//		return "sap.ushell.components.tiles.zui5_hrxx_imagetile.Imagetile"
	},
	createContent:function(c){
		this.setHeight('100%');
		this.setWidth('100%');
	},
	
	getTileControl:function(){
		jQuery.sap.require('sap.m.CustomTile');
		jQuery.sap.require('sap.m.Text');
		jQuery.sap.require('sap.ui.commons.layout.MatrixLayout');
		
		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/ZUI5_HR_TILE/css/actapp.css");
		
		var oController = this.getController();
		var oView = oController.getView();
		
		// 시맨틱 오브젝트에 따라 타일 제목 변경
		var V = oView.getViewData();
		var t = V.chip;
		var c = sap.ushell.components.tiles.utilsRT.getConfiguration(t,t.configurationUi.isEnabled(),false);
		var oSemanticObject = c.navigation_semantic_object;
		var oAction = c.navigation_semantic_action;
		
		var oTitle = new sap.m.Text({text : "{/data/display_title_text}"});
		
		if(oSemanticObject == "ZHR_ORGCHART") oTitle.addStyleClass("ImageTileTitle_Gray");
		else oTitle.addStyleClass("ImageTileTitle");
		
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
			content : oTitle
		});
		oRow.addCell(oCell);
				
		oMainContent.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oMainContent
		}).addStyleClass("L2PPaddingTopBottom");
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);

		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "180px",
			content : [ oMatrixLayout ]
		});
		
		var oCustomTile = new sap.m.CustomTile({ 
			  content : [oLayout],
			  press:[oController.onPress, oController]
		}).addStyleClass("sapUiSizeCompact Tile TileLayout2");
		
		
		return oCustomTile;
		
	},
	
	getLinkControl:function(){
		jQuery.sap.require('sap.m.Link');
		return new sap.m.Link({text:"{/config/display_title_text}",href:"{/nav/navigation_target_url}"});
	}
	
  });
}());



