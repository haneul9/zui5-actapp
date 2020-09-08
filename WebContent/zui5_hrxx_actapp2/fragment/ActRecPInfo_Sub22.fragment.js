sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_Sub22", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* 
	* 어학 능력
	*  
	* @memberOf fragment.ActRecPInfo_Sub22
	*/
	
	createContent : function(oController) {

		jQuery.sap.require("common.Common");

		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_Sub22_COLUMNLIST", {
			type : sap.m.ListType.None,
			counter : 10,
			cells : [ 
//					    new sap.m.Text({
//					    	text : "{Seqnr}"
//						}).addStyleClass("L2P13Font"), 
						new sap.m.Text({
					    	text : "{Qualitx}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Ausprtx}"
						}).addStyleClass("L2P13Font")
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_Sub22_TABLE", {
			inset : false,
			fixedLayout : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText("MSG_NODATA"),
			columns : [
//		        	  new sap.m.Column({
//			        	  header: new sap.m.Label({text : oBundleText.getText( "SEQNR")}).addStyleClass("L2P13Font"), 			        	  
//			        	  demandPopin: true,
//			        	  hAlign : sap.ui.core.TextAlign.Begin,
//			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "AUSPR")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Text({text : oBundleText.getText( "AUSPRTX")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),  	  
			          ]
			          
		});
		oTable.setModel(sap.ui.getCore().getModel("ZL2P01GW0001_SRV"));
		
		var oTablePanel = new sap.m.Panel({
			expandable : false, 
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : oBundleText.getText("TSUB22F"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer()]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oTable]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_Sub22_LAYOUT",  {
			width : "100%",
			content : [ 
			            oTablePanel
			           ]
		});
		
		return oLayout;
		
	}

});