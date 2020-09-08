sap.ui.jsview("zui5_hrxx_photodown.PhotoDownload", {
	

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_photodown.PhotoDownload
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_photodown.PhotoDownload";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_photodown.PhotoDownload
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
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_ColumnList", {
		counter : 10,
		cells : [ 
		    new sap.m.Text({
		    	text : "{Numbr}",
		    	textAlign : "Begin"
			}).addStyleClass("L2P13Font"), 
		    new sap.m.Image({
		    	src : "{Piurl}",
		    	width : "2.5rem", 
		    	height: "2.5rem" 
		 	}),
		    new sap.m.Text({
		    	text : "{Pernr}"
			}).addStyleClass("L2P13Font"), 
		    new sap.m.Text({
		    	text : "{Ename}"
			}).addStyleClass("L2P13Font"), 
		    new sap.m.Text({
		    	text : "{Pbtxt}"
			}).addStyleClass("L2P13Font"), 
		    new sap.m.Text({
		    	text : "{Fulln}"
			}).addStyleClass("L2P13Font"), 
		    new sap.m.Text({
		    	text : "{Zzjobgrtx}"
			}).addStyleClass("L2P13Font"), 
		    new sap.m.Text({
		    	text : "{Statx}"
			}).addStyleClass("L2P13Font"), 

		]
		}).addStyleClass("L2P13Font L2PFontColorBlue");
			
		var oTable = new sap.m.Table(oController.PAGEID + "_Table", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText("MSG_NODATA"),
			mode : sap.m.ListMode.MultiSelect,
			fixedLayout : false,
			columns : [
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "NUMBER_2")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.End,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PIURL")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PERNR")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ENAME")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PERSA")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ORGTX_2")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ZZJOBGRTX")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "STATX")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),			        	  
			          ]
		});	
		
		oTable.setModel(sap.ui.getCore().getModel("ActionDownloadPicList"));
		oTable.bindItems("/ActionDownloadPicList", oColumnList, null, []);
		
		var oRequestLayout = new sap.ui.layout.VerticalLayout({
			content : [new sap.m.Label(	{text : oBundleText.getText("DOWNLOAD_EMPLOYEE")})
															.addStyleClass("L2P13Font")
															.addStyleClass("L2P13FontBold")]
		}).addStyleClass("L2PFilterLayout");
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [
			           new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oRequestLayout,
			            oTable
			           ]
		});		
		
		
		var oFooterBar = new sap.m.Bar({
			 	contentRight : [ new sap.m.Button({
									 text : oBundleText.getText( "ADD_PERSON"),
									 press : oController.onAddPerson
									 }) ,
								 new sap.m.Button({
									 text : oBundleText.getText( "DEL_PERSON"),
									 press : oController.onDelPerson
									 }),
								 new sap.m.Button({
									 text : oBundleText.getText( "DOWNLOAD"),
									 press : oController.onDownloadPic
									 })
								]
		});
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText( "TITLE_PIC_DOWNLOAD")
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