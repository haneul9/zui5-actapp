sap.ui.jsview("zui5_hrxx_actann.AnnounceList", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actann.AnnounceList
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actann.AnnounceList"; 
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actann.AnnounceList
	*/ 
	createContent : function(oController) {

		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.Common");
		
		var oFilterLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		}).addStyleClass("L2PFilterLayout");
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("PBTXT") + ":"}),
				           new sap.m.MultiComboBox(oController.PAGEID + "_Persa", {
								width: "300px",
								selectionFinish : oController.onChnageComboBox,
							}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("DOCTL") + ":"}),
				           new sap.m.Input(oController.PAGEID + "_Title", {
								width: "200px"
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);

		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("ANNSDA") + ":"}),
						   new sap.m.Input(oController.PAGEID + "_Annda_From",{
							   width : "200px"
						   }) 
						   ]
			}).addStyleClass("L2PFilterItem")
		);
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("ANNEDA") + ":"}),
						   new sap.m.Input(oController.PAGEID + "_Annda_To",{
							   width : "200px"
						   }) 
						   ]
			}).addStyleClass("L2PFilterItem")
		);
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Button({
								text: oBundleText.getText("SEARCH_BTN"),
								type : sap.m.ButtonType.Emphasized,
								press : oController.onPressSearch
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		var oFilterInfoBar = new sap.m.Toolbar({
			height : "2.5rem",
			content : [ //new sap.m.ToolbarSpacer({width: "1rem"}),
			            new sap.m.Label({
			            	text : oBundleText.getText( "FILINFO")
			            }).addStyleClass("L2P13Font"),

		            	new sap.m.Text(oController.PAGEID + "_Pbtxt", {
		            	
		            	}).addStyleClass("L2P13Font"),
						
			        ]
		}).addStyleClass("L2PPaddingLeft1Rem");
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_COLUMNLIST", {
			type : sap.m.ListType.Navigation,
			press : oController.onSelectRow ,
			counter : 10,
			cells : [ 
			    new sap.m.Text({
			    	text : "{Numbr}"
				}).addStyleClass("L2P13Font"), 
				new sap.m.Text({
				     text : "{Pbtxt}" 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Title}" ,
			    	 textAlign : sap.ui.core.TextAlign.Begin,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Orgtx}" 
				}).addStyleClass("L2P13Font"), 
				new sap.m.Link({
				     text : "{Ename}",
				     customData : [{key : "Pernr", value : "{Pernr}"}]
				}).addStyleClass("L2P13Font L2PFontColorBlue")
				.attachBrowserEvent("click", oController.displayPopoverEmpProfile), 
				new sap.m.Text({
					 text : {path : "Annda",
						 	 formatter : common.Common.DateFormatter
					 }
				}).addStyleClass("L2P13Font"),
				new sap.ui.core.Icon({
					size : "13px",
					color : "#666666",
					src: {
						path : "Reqyn",
						formatter : function(fVal1) {
							return fVal1 == "X" ? "sap-icon://accept" : ""; 
						}}, 
				}),
			]
		});  
		var oTable = new sap.m.Table(oController.PAGEID + "_TABLE", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText("MSG_NODATA"),
			fixedLayout : false,
			mode : sap.m.ListMode.MultiSelect,
			columns : [
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "NUMBER")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  width: "50px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
				          minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "COMPANY_NAME")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  //width: "150px",
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "DOCTL")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  //width: "150px",
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "WRITE_ORGTX")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  //width: "130px",
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "WRITE_ENAME")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  //width: "100px",
			        	  demandPopin: true}),	  
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "ANNDA")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ACT_REQUEST")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width: "60px",
			        	  demandPopin: true}),
			          ]
		}).addStyleClass("L2PBackgroundWhite");
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oFilterLayout,
			            oFilterInfoBar,
			            oTable
			           ]
		});
		
		var oFooterBar = new sap.m.Bar({
				contentLeft : [
//					 new sap.m.Button({
//						 text : oBundleText.getText( "SORT_BTN"),
//						 press : oController.onPressSort
//					 	 }) 
					 	],
			 	contentRight : [         
			 	               new sap.m.Button({
									 text : oBundleText.getText( "NEW_CREATE_BTN"),
//									 width : "100px",
									 press : oController.onCreateAnnouce
							   }),
							   new sap.m.Button({
									 text : oBundleText.getText( "MODIFY_BTN"),
//									 width : "100px",
									 press : oController.onModifyAnnouce
							   }),
							   new sap.m.Button({
									 text : oBundleText.getText( "DELETE_BTN"),
//									 width : "100px",
									 press : oController.onDeleteAnnouce
							   }),
	                ]
		});
		
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText( "TITLE_ACT_ANNOUNCE")
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
