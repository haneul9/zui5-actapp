(function(){
	"use strict";
	sap.ui.jsview("zhr_vacation.Vacation",{
//(function(){"use strict";sap.ui.jsview("sap.ushell.components.tiles.zhr_empprofile.zhrEmpprofile",{
	
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zhr_vacation.Vacation
	*/ 
	getControllerName : function() {
		return "zhr_vacation.Vacation";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zhr_vacation.Vacation
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
		
		
		var oController =this.getController();
		
//	    var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_TILE_SRV/", true, undefined, undefined, { "Cache-Control": "max-age=0"}, undefined, undefined, true);
//	    var vData = { } ;
//	  
//	    oModel.read("/TimeApplicationSet",
//			null, 
//			null, 
//			false, 
//			function(oData, oResponse) {
//				if(oData && oData.results.length) {
//					vData = oData.results[0] ;
//				}
//			},
//			function(oResponse) {
//				console.log(oResponse);
//			}
//	    );
		
	    var oCell = null , oRow = null;
		var oMatrixLayout =  new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : true,
			width : "100%",
			columns : 1,
		}).setModel(oController._JSonModel).bindElement("/results");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.TextView({text : "근태신청"
			}).addStyleClass("L2PTitle1")
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :new sap.ui.core.HTML({
				preferDOM  : false,
				content : "<div style='height:12px'> </div>"
			})
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new control.HorizontalStackChart({
				bgColor : "#f5f5f5",
				barColor : "#2ecc71",
				min : "{CntBl1}" ,
				max : "{CntCr1}" ,
				label : "연차",
				label2 : "{Text1}" ,
				height : "42px",
				
			})
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new control.HorizontalStackChart({
				bgColor : "#f5f5f5",
				barColor : "#FFD700",
				min : "{CntBl2}" ,
				max : "{CntCr2}" ,
				label : "연중휴가",
				label2 : "{Text2}" ,
				height : "42px",
				
			})
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new control.HorizontalStackChart({
				bgColor : "#f5f5f5",
				barColor : "#FAA511",
				min : "{CntBl3}" ,
				max : "{CntCr3}" ,
				label : "장기근속",
				label2 : "{Text3}" ,
				height : "42px",
				
			})
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
		}).addStyleClass("Tile TileLayout");
		return oCustomTile;
	},
	
	getLinkControl:function(){
		jQuery.sap.require('sap.m.Link');
		return new sap.m.Link({text:"{/config/display_title_text}",href:"{/nav/navigation_target_url}"});
	}
	
});
}());