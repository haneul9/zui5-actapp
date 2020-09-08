sap.ui.jsview("zui5_hrxx_projectprocess.ApproverStandard", {
	

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_projectprocess.ApproverStandard
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_projectprocess.ApproverStandard";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_projectprocess.ApproverStandard
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
					content : [new sap.m.Label({text : oBundleText.getText("PBTXT")}),
					           new sap.m.Select(oController.PAGEID + "_Persa", {
									width: "300px",
								}).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PFilterItem")
			);
			
			var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_COLUMNLIST", {
				counter : 10,
				cells : [
					new sap.m.Text({
					    text :  "{Stext}" 
					}).addStyleClass("L2P13Font"), 
					new sap.m.Text({
					     text : "{Ename}" 
					}).addStyleClass("L2P13Font"), 
					new sap.m.Text({
					    text : "{Zzcaltltx}" 
					}).addStyleClass("L2P13Font"),
					new sap.m.Text({
					    text : "{Orgtx}" 
					}).addStyleClass("L2P13Font")
				]
			});  
			
			var oTable = new sap.m.Table(oController.PAGEID + "_TABLE", {
				inset : false,
				backgroundDesign: sap.m.BackgroundDesign.Translucent,
				showSeparators: sap.m.ListSeparators.All,
				noDataText : oBundleText.getText("MSG_NODATA"),
				mode : sap.m.ListMode.MultiSelect,
				columns : [
			        	  new sap.m.Column({
			        		  header: new sap.m.Label({text : "BG" }).addStyleClass("L2P13Font"), 			        	  
				        	  demandPopin: true,
				        	  hAlign : sap.ui.core.TextAlign.Begin,
					          minScreenWidth: "tablet"}),
			        	  new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "APRNR")}).addStyleClass("L2P13Font"), 			        	  
				        	  demandPopin: true,
				        	  hAlign : sap.ui.core.TextAlign.Begin,
				        	  minScreenWidth: "tablet"}),  	  
				          new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "ZZCALTL")}).addStyleClass("L2P13Font"),
				        	  demandPopin: true,
				        	  hAlign : sap.ui.core.TextAlign.Begin,
				        	  minScreenWidth: "tablet"}),	
				          new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "ORGEH")}).addStyleClass("L2P13Font"),
				        	  demandPopin: true,
				        	  hAlign : sap.ui.core.TextAlign.Begin,
				        	  minScreenWidth: "tablet"})
				          ]
			});
			oTable.setModel(sap.ui.getCore().getModel("ZHRXX_PROJECT_MANAGEMENT_SRV"));
			
			var oStatementPanel = new sap.m.Panel({
				expandable : false,
				expanded : false,
				headerToolbar : new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					content : [new sap.m.Label({text : oBundleText.getText("TITLE_PROJECT_PROCESS10"), design : "Bold"}).addStyleClass("L2P13Font"),
					          ]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content : [oTable]
			});
			
			var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
				width : "100%",
				content : [ 
				            oFilterLayout,
				            new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
				            oStatementPanel
				           ]
			});
			
			var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
				content : oLayout,
				customHeader : new sap.m.Bar({
					contentMiddle : new sap.m.Text({
						text : oBundleText.getText("TITLE_PROJECT_PROCESS")
					}).addStyleClass("L2PPageTitle")
				}).addStyleClass("L2PHeaderBar"),
				footer : new sap.m.Bar({
					contentRight : [
									new sap.m.Button({text : oBundleText.getText("CREATE_BTN"), width : "100px", press : oController.onPressCreate}),
									new sap.m.Button({text : oBundleText.getText("DELETE_BTN"), width : "100px", press : oController.onPressDelete})
					                ]
				}) 
			}) ;
			
			return oPage ;
	}

});