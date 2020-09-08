sap.ui.jsview("zui5_hrxx_actretire.RegularRetireRegist", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actretire.RegularRetireRegist
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actretire.RegularRetireRegist";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actretire.RegularRetireRegist
	*/ 
	createContent : function(oController) {
		
		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.Common");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate());
		var nextDate = new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate());
		
		var oFilterLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		}).addStyleClass("L2PFilterLayout");
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("PBTXT") + ":"}),
				           new sap.m.Select(oController.PAGEID + "_Persa", {
								width: "200px",
							}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("RETREQS") + ":"}),
				           new sap.m.DatePicker(oController.PAGEID + "_Retda_From", {
								value: dateFormat.format(prevDate), 
								valueFormat : "yyyy-MM-dd",
					            displayFormat : gDtfmt,
								width : "200px",
								change : oController.onChangeDate
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("RETREQE") + ":"}),
				           new sap.m.DatePicker(oController.PAGEID + "_Retda_To", {
								value: dateFormat.format(nextDate), 
								valueFormat : "yyyy-MM-dd",
					            displayFormat : gDtfmt,
								width : "200px",
								change : oController.onChangeDate
						   }).addStyleClass("L2P13Font")]
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
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_COLUMNLIST", {
			counter : 10,
			cells : [
				new sap.m.Text({
				    text : "{Numbr}" 
				}).addStyleClass("L2P13Font"), //가족유형
				new sap.m.Text({
				     text : "{Ename}" 
				}).addStyleClass("L2P13Font"), //가족유형
				new sap.m.Text({
				     text : "{Stext}" ,
			    	 textAlign : sap.ui.core.TextAlign.Begin,	 
				}).addStyleClass("L2P13Font"), //성
				new sap.m.Text({
				     text : "{Zzcaltltx}" ,	 
				}).addStyleClass("L2P13Font"), //이름
				new sap.m.Text({
				     text : {path : "Entda",
				    	 formatter : common.Common.DateFormatter
				     }
				}).addStyleClass("L2P13Font"), //생년월일
				new sap.m.Text({
				     text : {path : "Gbdat",
				    	 formatter : common.Common.DateFormatter
				     }
				}).addStyleClass("L2P13Font"), //생년월일
				new sap.m.Text({
				     text : {path : "Retda",
				    	 formatter : common.Common.DateFormatter
				     }
				}).addStyleClass("L2P13Font"), //생년월일
				new sap.m.CheckBox({
					selected : "{Reexp}", 
				}), //팀장면담
				new sap.m.CheckBox({
					selected : "{Seexp}", 
				}),	
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
		        		  header: new sap.m.Label({text : oBundleText.getText( "NUMBER")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  width: "40px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ENAME")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "FULLN")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Text({text : oBundleText.getText( "ZZCALTLTX")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ENTDA")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "GBDAT")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "SCHE_RETDA")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "REEXP")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "SEEXP")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true})		        	  
			          ]
		}).addStyleClass("L2PBackgroundWhite");
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oFilterLayout,
			            oTable
			           ]
		});
		
		var oFooterBar = new sap.m.Bar({
				contentLeft : [
//					 new sap.m.Button({
//						 text : oBundleText.getText( "SORT_BTN"),
//						 width : "100px",
//						 press : oController.onPressSort
//					 }),
//					 new sap.m.Button({
//						 text : oBundleText.getText( "LEGEND_BTN"),
//						 width : "100px",
//						 press : oController.onPressLegend
//					 }),
					 	],
			 	contentRight : [         
 	                new sap.m.Button({
						 text : oBundleText.getText( "TITLE_RETIRE_START"),
						 press : oController.onPressRetireStart
 	                })
	                ]
		});		
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentLeft : new sap.m.Button({
									icon : "sap-icon://nav-back" ,
									press: oController.navToBack
								}),
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText("TITLE_RERIRE_REGULAR")
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark",
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeaderBar") ,
			footer : oFooterBar 
		}) ;
		
		return oPage ;
	}

});