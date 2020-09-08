sap.ui.jsview("zui5_hrxx_retireprocess.SettlementItem", {
	

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_retireprocess.SettlementItem
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_retireprocess.SettlementItem";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_retireprocess.SettlementItem
	*/ 
	createContent : function(oController) {
//        var oFilterLayout = new sap.ui.layout.HorizontalLayout({
//			allowWrapping :true
//		}).addStyleClass("L2PFilterLayout");
//		
//		oFilterLayout.addContent(
//			new sap.ui.layout.VerticalLayout({
//				content : [new sap.m.Label({text : oBundleText.getText("PBTXT") + ":"}),
//				           new sap.m.Select(oController.PAGEID + "_Persa", {
//								width: "300px",
//								change: oController.onChangePersa
//							}).addStyleClass("L2P13Font")]
//			}).addStyleClass("L2PFilterItem")
//		);
//		
//		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_COLUMNLIST", {
//			type : sap.m.ListType.None,
//			counter : 10,
//			cells : [ 
//				new sap.m.Text({
//				     text : "{Adjsttx}" ,	 
//				}).addStyleClass("L2P13Font"),
//				new sap.m.Text({
//				     text : "{Adjrgtx}" ,	 
//				}).addStyleClass("L2P13Font"),
//				new sap.m.Input({
//					value : "{Ename}",
//					customData : new sap.ui.core.CustomData({key : "Adjst", value : "{Adjst}"}),
//					width : "95%", 
//					valueHelpRequest: oController.onEmployeeSearch, 
//					showValueHelp : true,
//					valueHelpOnly : true
//				}).addStyleClass("L2P13Font"),
//				new sap.m.Text({
//				     text : "{Stext}" ,	 
//				}).addStyleClass("L2P13Font"),
//				new sap.m.Text({
//				     text : "{Telno}" 
//				}).addStyleClass("L2P13Font"),
//				new sap.m.Text({
//				     text : "{Email}" 
//				}).addStyleClass("L2P13Font")
//			]
//		
//		});  
//		
//		var oTable = new sap.m.Table(oController.PAGEID + "_TABLE", {
//			//inset : true,
//			backgroundDesign: sap.m.BackgroundDesign.Translucent,
//			showSeparators: sap.m.ListSeparators.All,
//			noDataText : oBundleText.getText("MSG_NODATA"),
//			fixedLayout : false,
//			//mode : sap.m.ListMode.SingleSelectLeft,
//			columns : [
//		        	  new sap.m.Column({
//			        	  header: new sap.m.Label({text : oBundleText.getText( "ADJST")}).addStyleClass("L2P13Font"), 			        	  
//			        	  demandPopin: true,
//			        	  //width: "40px",
//			        	  hAlign : sap.ui.core.TextAlign.Begin,
//			        	  minScreenWidth: "tablet"}),  	
//		        	  new sap.m.Column({
//			        	  header: new sap.m.Label({text : oBundleText.getText( "STATE")}).addStyleClass("L2P13Font"),
//			        	  hAlign : sap.ui.core.TextAlign.Begin,
//			        	  //width: "200px",
//			        	  demandPopin: true,
//			        	  minScreenWidth: "tablet"}),
//			          new sap.m.Column({
//			        	  header: new sap.m.Label({text : oBundleText.getText( "RETIRE_MANAGER")}).addStyleClass("L2P13Font"),
//			        	  demandPopin: true,
//			        	  hAlign : sap.ui.core.TextAlign.Begin,
//			        	  //width: "80px",
//			        	  minScreenWidth: "tablet"}),
//		        	  new sap.m.Column({
//			        	  header: new sap.m.Label({text : oBundleText.getText( "STEXT")}).addStyleClass("L2P13Font"),
//			        	  demandPopin: true,
//			        	  hAlign : sap.ui.core.TextAlign.Begin,
//			        	  //width: "80px"
//			        	  }),  	  
//			          new sap.m.Column({
//			        	  header: new sap.m.Label({text : oBundleText.getText( "TELNO")}).addStyleClass("L2P13Font"),
//			        	  hAlign : sap.ui.core.TextAlign.Begin,
//			        	  //width: "130px"
//			        	  }),
//			          new sap.m.Column({
//			        	  header: new sap.m.Label({text : oBundleText.getText( "EMAIL")}).addStyleClass("L2P13Font"),
//			        	  hAlign : sap.ui.core.TextAlign.Begin,
//			        	  //width: "80px"
//			        	  })
//			        ]
//		});
//		oTable.setModel(sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV"));
//		
//		var oContentsPanel = new sap.m.Panel({
//			expandable : false,
//			expanded : true,
//			headerToolbar : new sap.m.Toolbar({
//				design : sap.m.ToolbarDesign.Auto,
//				content : new sap.m.Label({text: oBundleText.getText( "MSG_RETIRE_SETTLEITEM")}).addStyleClass("L2P13Font")
//			}),
//			content : oTable
//		});
//		
//		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
//			width : "100%",
//			content : [ 
//			            oFilterLayout,
//			            new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
//			            oContentsPanel
//			           ]
//		});
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
//			title : "",
			enableScrolling : false,
			content : new sap.ui.core.HTML({content : "<iframe src='http://hr.doosan.com/irj/servlet/prt/portal/prtroot/pcd!3aportal_content!2fDoosanGHRIS!2fiViews!2fHASS!2fZHRVCXX0004?sap-config-mode=true' " +
							                                  "width='100%' " +
							                                  "height='100%' " +
							                                  "scrolling='no' " +
							                                  "frameborder='0' " +
							                                  "marginwidth='0' " +
							                                  "marginheight='0'></iframe>",	preferDOM : false}),
			customHeader : new sap.m.Bar({
				contentMiddle : new sap.m.Text(oController.PAGEID + "_PAGETITLE", {
				}).addStyleClass("L2PPageTitle")
			}).addStyleClass("L2PHeaderBar"),
			footer : new sap.m.Bar({}) 
		});  //.addStyleClass("L2PBackgroundWhite") ;
		
		return oPage ;
	}

});