sap.ui.jsview("zui5_hrxx_project.ProjectMain", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_project.ProjectMain";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	createContent : function(oController) {
		//Language 및 Properties를 가져온다.
//		var locale = sap.ui.getCore().getConfiguration().getLanguage(); //언어
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : locale
//        });
        
		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.Common");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var dateFormatList = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate() + 1);
		var nextDate = new Date(curDate.getFullYear() + 1, curDate.getMonth(), curDate.getDate());
		
		
		var oFilterLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		}).addStyleClass("L2PFilterLayout");
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Label({text : oBundleText.getText("PBTXT") + ":"}),
					           new sap.m.MultiComboBox(oController.PAGEID + "_Werks", {
									width: "300px",
									selectionFinish : oController.onChangeComboBox,
								}).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PFilterItem")
		);

		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("PJTBD") + ":"}),
				           new sap.m.DatePicker(oController.PAGEID + "_Pjtbd_From", {
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
				content : [new sap.m.Label({text : oBundleText.getText("PJTED") + ":"}),
				           new sap.m.DatePicker(oController.PAGEID + "_Pjtbd_To", {
								value: dateFormat.format(curDate), 
								valueFormat : "yyyy-MM-dd",
					            displayFormat : gDtfmt,
								width : "200px",
								change : oController.onChangeDate
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("PJTTY") + ":"}),
				           new sap.m.Select(oController.PAGEID + "_Pjtty", {
							   width : "180px"
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("PJTNM") + ":"}),
				           new sap.m.Input(oController.PAGEID + "_Pjtnmst", {
								width : "200px"
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
		
		var oFilterVLayout = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content : [oFilterLayout, oFilterInfoBar]
		}).addStyleClass("");
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_COLUMNLIST", {
			type : sap.m.ListType.Navigation,
			press : oController.onSelectRow ,
			counter : 10,
			cells : [ 
				new sap.ui.core.Icon({
					src: "sap-icon://status-completed", 
					color: {path  : 'Pjtst', formatter : common.Formatter.ProjectHassStatusColor} 
				}),
				new sap.m.Text({
				     text : "{Pjtnm}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Pjtid}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Pjttytx}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : {path : "Pjtbd", formatter: common.Common.DateFormatter}
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : {path : "Pjted", formatter: common.Common.DateFormatter}
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Pbtxt}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Unametx}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : {path : "Datum", formatter: common.Common.DateFormatter}
				}).addStyleClass("L2P13Font"),
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
			        	  header: new sap.m.Label({text : oBundleText.getText( "STATU")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  //width: "40px",
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PJTNM")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  //width: "200px",
			        	  demandPopin: true,
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PJTID")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  //width: "80px",
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PJTTY")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  //width: "80px",
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "BEGDA")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  //width: "130px",
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ENDDA")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  //width: "80px",
			        	  demandPopin: true}),	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PBTXT")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  //width: "80px",
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "UNAME2")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  //width: "80px",
			        	  demandPopin: true}),
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "DATUM3")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  //width: "80px",
			        	  demandPopin: true})
			        ]
		});

		var oIConFilter1 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_ALL",{
			showAll : true,
			key : "All",
			icon : "",
			design : sap.m.IconTabFilterDesign.Horizontal,
			text : oBundleText.getText( "DOCNUM")
		});
		
		var iConSeperator = new sap.m.IconTabSeparator();
		
		var oIConFilter2 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_N",{
			icon : "sap-icon://create",
			iconColor : "Default",
            text :  oBundleText.getText("PROJECT_STATUS_N"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "N" 
		});
	
		var oIConFilter3 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_R", {
			icon : "sap-icon://approvals",
			iconColor : "Positive",
            text :  oBundleText.getText("PROJECT_STATUS_R"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "R"
		});
		
		var oIConFilter4 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_C", {
			icon : "sap-icon://accept",
			iconColor : "Critical",
            text :  oBundleText.getText("PROJECT_STATUS_C"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "C"
		});
		
		var oIConFilter5 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_D", {
			icon : "sap-icon://decline",
			iconColor : "Negative",
            text :  oBundleText.getText("PROJECT_STATUS_D"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "D"
		});
		
		var oIConBar = new sap.m.IconTabBar(oController.PAGEID + "_ICONBAR",{
			content : [ oTable ],
			items : [ oIConFilter1, iConSeperator, 
			          oIConFilter2, oIConFilter3, oIConFilter4, oIConFilter5 ],
			select : oController.handleIconTabBarSelect ,
			selectedKey : "All"
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oFilterLayout,
			            oFilterVLayout,
			           	oIConBar
			           ]
		});
		
		var oFooterBar = new sap.m.Bar({
				contentLeft : [
					 new sap.m.Button({
						 text : oBundleText.getText( "SORT_BTN"),
						 press : oController.onPressSort
					 	 }),
				 	 new sap.m.Button({
						 text : oBundleText.getText( "EXCEL_BTN"),
						 press : oController.downloadExcel
					 	 }),
				 	 new sap.m.Button({
						 text : oBundleText.getText( "EXCEL_UPLOAD_BTN"),
						 press : oController.uploadExcel
					 	 }) 
					 	],
			 	contentRight : [         
 	                new sap.m.Button({
						 text : oBundleText.getText( "PROJECT_ADD_BTN"),
						 press : oController.onAddProject
 	                }),
 	                new sap.m.Button({
						 text : oBundleText.getText( "PROJECT_MOD_BTN"),
						 press : oController.onModProject
	                }),
	                new sap.m.Button({
						 text : oBundleText.getText( "PROJECT_DEL_BTN"),
						 press : oController.onDelProject
	                }),
	                new sap.m.Button(oController.PAGEID + "_RES_BTN", {
						 text : oBundleText.getText( "PROJECT_RES_BTN"),
						 press : oController.onResProject,
						 visible : false
	                })
	                ]
		});
		
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText("TITLE_PROJECT_MANGE")
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
