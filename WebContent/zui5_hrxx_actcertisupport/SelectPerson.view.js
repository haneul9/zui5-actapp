sap.ui.jsview("zui5_hrxx_actcertisupport.SelectPerson", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actcertisupport.SelectPerson";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	createContent : function(oController) {
//		//필요한 CSS 파일을 Include 한다.
//		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/zhrxx_common/css/L2P2SAP1.css");
//		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/zhrxx_common/css/L2PBasic.css");
		
		//Language 및 Properties를 가져온다.
//		var locale = sap.ui.getCore().getConfiguration().getLanguage(); //언어
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : locale
//        }); 
        
		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.Common");
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_COLUMNLIST", {
			cells : [ 
				new sap.m.Text({
				     text : "{Rorgt}" ,
			    	 textAlign : sap.ui.core.TextAlign.Begin,	
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Rpern}" ,
			    	 textAlign : sap.ui.core.TextAlign.Begin,	
				}).addStyleClass("L2P13Font"),
				new sap.m.Link({
			     text : "{Cttyptx}",
			     press : oController.onSelectRow,
				}).addStyleClass("L2P13Font L2PFontColorBlue") ,
				new sap.m.Text({
				     text : "{Ctnum}" ,	 
				     textAlign : sap.ui.core.TextAlign.Begin,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Isaut}" ,
				     textAlign : sap.ui.core.TextAlign.Begin,	
				}).addStyleClass("L2P13Font"), 
				new sap.m.Text({
					 text : {path : "Ctbeg",
						 formatter : common.Common.DateFormatter
					 }
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
					 text : {path : "Ctend",
						 formatter : common.Common.DateFormatter
					 }
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Ctfeetx}",
			    	 textAlign : sap.ui.core.TextAlign.Begin,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Ctcfetx}" ,
			    	 textAlign : sap.ui.core.TextAlign.Begin,	
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Aincttx}" ,
			    	 textAlign : sap.ui.core.TextAlign.Begin,	
				}).addStyleClass("L2P13Font"),

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
			        	  header: new sap.m.Label({text : oBundleText.getText( "RORGT")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "RPERN")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),  
		        	  new sap.m.Column({
			        	  header: new sap.m.Text({text : oBundleText.getText( "CTTYP")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "CTNUM")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ISAUT")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "CERDA")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width : "80px",
						  demandPopin: true}),	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "CTEND")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width : "80px",
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "CTFEE")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.End,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "CTCFE")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.End,
			        	  demandPopin: true}),
			          new sap.m.Column(oController.PAGEID + "_AINCT_COLUMN",{
			        	  header: new sap.m.Label({text : oBundleText.getText( "AINCT")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.End,
			        	  demandPopin: true}),
			           ]
			          
		});
		
		
		var oListPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : oBundleText.getText("SELECT_SUPPORT_PERSON"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oTable]
		});

		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oListPanel
			           ]
		});
		
		var oFooterBar = new sap.m.Bar({
				contentRight : [
							 new sap.m.Button({
								 text : oBundleText.getText( "SELECT_BTN"),
								 press : oController.onPressSelect
							 	 }) 	 	
				                ]
		});
		
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentLeft : new sap.m.Button({
													icon : "sap-icon://nav-back" ,
													press: oController.navToBack
								}).addStyleClass("L2PPageTitle"),
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText( "TITLE_CERTI_SUPPORT_MANAGEMENT")
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeaderBar") ,
			footer : oFooterBar 
		}) ;
		
		return oPage ;
	}
	
});
