sap.ui.jsview("zui5_hrxx_staffappoint.Staff", {
	

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_staffappoint.Staff
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_staffappoint.Staff";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_staffappoint.Staff
	*/ 
	createContent : function(oController) {
//		//필요한 CSS 파일을 Include 한다.
//		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/zhrxx_common/css/L2P2SAP1.css");
//		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/zhrxx_common/css/L2PBasic.css");
		
//		//Language 및 Properties를 가져온다.
//		var locale = sap.ui.getCore().getConfiguration().getLanguage(); //언어
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : locale
//        });  
		
        var oFilterLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		}).addStyleClass("L2PFilterLayout");
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("PBTXT") + ":"}),
				           new sap.m.Select(oController.PAGEID + "_Persa", {
								width: "300px",
								change: oController.onChangePersa
							}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_COLUMNLIST", {
			type : sap.m.ListType.None,
			counter : 10,
			cells : [ 
				new sap.m.Text({
				     text : "{Biztx}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Bgcodetx}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Ename}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Stext}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Telno}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Email}" 
				}).addStyleClass("L2P13Font"),
				new sap.ui.core.Icon({
					src: "sap-icon://accept", 
					size: "12px",
					visible: {path: 'Stfyn', formatter: function(fVal){return fVal == "X" ? true : false;}}
				}),
				new sap.ui.core.Icon({
					src: "sap-icon://accept", 
					size: "12px",
					visible: {path: 'Rcvyn', formatter: function(fVal){return fVal == "X" ? true : false;}}
				})
			]
		
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_TABLE", {
			//inset : true,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText("MSG_NODATA"),
			mode : sap.m.ListMode.MultiSelect,
			fixedLayout : false,
			columns : [
		             new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "APRTY")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  //width: "40px",
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	
		        	  new sap.m.Column(oController.PAGEID + "_BG_LABEL",{
			        	  header: new sap.m.Label({text : oBundleText.getText( "RESPONSIBLE_ORG") }).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  //width: "200px",
			        	  demandPopin: true, 
			        	  minScreenWidth: "tablet"}), 	  
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "RETIRE_MANAGER")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  //width: "40px",
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ORGTX_2")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  //width: "200px",
			        	  demandPopin: true,
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "TELNO")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  //width: "80px",
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "EMAIL")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  //width: "80px"
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "STFYN")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width: "80px"
			        	  }),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "RCVYN")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width: "80px"
			        	  })
			        ]
		});
		oTable.setModel(sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV"));
		
		var oContentsPanel = new sap.m.Panel({
			expandable : false,
			expanded : true,
			content : oTable
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ 
			            oFilterLayout,
			            new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
			            oContentsPanel
			           ]
		});
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : oLayout,
			customHeader : new sap.m.Bar({
				contentMiddle : new sap.m.Text({
					text : oBundleText.getText("TITLE_MENU_RETIRE_STAFF")
				}).addStyleClass("L2PPageTitle")
			}).addStyleClass("L2PHeaderBar"),
			footer : new sap.m.Bar({
				contentLeft : [
							 	 new sap.m.Button({
							 		 text: oBundleText.getText("EXCEL_BTN"),
							 		 press : oController.downloadExcel
							 		 })
				 	 ],
				contentRight : [
				                new sap.m.Button({
									 text : oBundleText.getText("CREATE_BTN"),
									 width : "100px",
									 press : oController.onPressAdd
				                }),
				                new sap.m.Button({
									 text : oBundleText.getText("MODIFY_BTN"),
									 width : "100px",
									 press : oController.onPressMod
				                }),
				                new sap.m.Button({
									 text : oBundleText.getText("DELETE_BTN"),
									 width : "100px",
									 press : oController.onPressDel
				                }),
				               ]
			}) 
		}) ;
		
		return oPage ;
	}

});