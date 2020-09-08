sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Sub04", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.ActRecPInfo_Sub04
	*/
	
	createContent : function(oController) {
		//Global 일자 관련하여 소스 수정함. 2015.10.19
		jQuery.sap.require("common.Common");
		//수정완료
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_Sub04_COLUMNLIST", {
			type : sap.m.ListType.None,
			counter : 10,
			cells : [ 
					    new sap.m.Text({
					    	text : "{Qualitx}"
						}).addStyleClass("L2P13Font"), 
						new sap.m.Text({
					    	text : "{Exmtytx}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : {path : "Eamdt", formatter : common.Common.DateFormatter}
						}).addStyleClass("L2P13Font"), 
						new sap.m.Text({
					    	text : {path : "Exmto", formatter : common.Common.DateFormatter}
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
					    	text : "{Exmsc}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Eamgrtx}"
						}).addStyleClass("L2P13Font")
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_Sub04_TABLE", {
			inset : false,
			fixedLayout : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText("MSG_NODATA"),
			columns : [
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "QUALI2")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "EXMTY")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "EAMDT")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
				          minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "EXMTO")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "EXMSC")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Text({text : oBundleText.getText( "EAMGR")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),  	  
			          ]
			          
		});
		oTable.setModel(sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV"));
		
		var oTablePanel = new sap.m.Panel({
			expandable : false, 
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : oBundleText.getText("TSUB04F"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer()]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oTable]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_Sub04_LAYOUT",  {
			width : "100%",
			content : [ 
			            oTablePanel
			           ]
		});
		
		return oLayout;
		
	}

});