sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_Sub01", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.ActRecPInfo_Sub01
	*/
	 
	createContent : function(oController) {
		
		var oCell = null, oRow = null;
        
		var oRequestPanel = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 1
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Sub01_RequestPanel", {
			hAlign : sap.ui.commons.layout.HAlign.Middle,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : []
		}).addStyleClass("L2PPadding05remLR");
		oRow.addCell(oCell);
		oRequestPanel.addRow(oRow);

		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_Sub01_COLUMNLIST", {
			type : sap.m.ListType.None,
			counter : 10,
			cells : [ 
					    new sap.m.Text({
					    	text : {path : "Entda", formatter : common.Common.DateFormatter}
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : {path : "Retda", formatter : common.Common.DateFormatter}
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Pbtxt}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Orgehtx}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Zzcaltltx}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Stetx}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Zzjobgrtx}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Pgtxt}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({ 
					    	text : "{Pktxt}"
						}).addStyleClass("L2P13Font"), 
					    new sap.m.Text({
					    	text : "{Zzautyptx}"
						}).addStyleClass("L2P13Font"), 
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_Sub01_TABLE", {
			inset : false,
			fixedLayout : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			noDataText : oBundleText.getText("MSG_NODATA"),
			mode : sap.m.ListMode.None,
			columns : [
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "ENTDA")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "RETDA")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PBTXT")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Text({text : oBundleText.getText( "ENDORG")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "EZZCALTL")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ESTETX")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "EZZJOBGR")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PERSG")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PERSK")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "ZZAUTYP")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true})
			          ]
			          
		});
		oTable.setModel(sap.ui.getCore().getModel("ZL2P01GW0001_SRV"));
		
		var oTablePanel = new sap.m.Panel({
			visible : false,
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : oBundleText.getText("WHISTORY"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer()]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oTable]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_Sub01_LAYOUT",  {
			width : "100%",
			content : [ 
			           	oRequestPanel,
			           	new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oTablePanel
			           ]
		});
		
		return oLayout;
		
	}

});