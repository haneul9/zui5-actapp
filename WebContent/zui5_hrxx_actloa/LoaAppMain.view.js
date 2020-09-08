sap.ui.jsview("zui5_hrxx_actloa.LoaAppMain", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actloa.LoaAppMain";
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
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate());
		var nextDate = new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate());
		
		var oFilterLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		}).addStyleClass("L2PFilterLayout");
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("PBTXT")}),
				           new sap.m.MultiComboBox(oController.PAGEID + "_Persa", {
								width: "250px",
								selectionFinish : oController.onChangeComboBox,
							}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		var filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		filterString += "%20and%20Field%20eq%20%27" + "Latyp" + "%27";
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Label({text : oBundleText.getText("LARETYP")}),
					           new sap.m.MultiComboBox(oController.PAGEID + "_Latyp", {
									width: "250px",
									selectionFinish : oController.onChangeComboBox,
									items : {
										path : "/LoaCodeListSet",
										template : new sap.ui.core.Item({key : "{Code}",text : "{Text}" }) 
									}
								}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("LoaCodeList"))
							   ]
				}).addStyleClass("L2PFilterItem")
			);
				
		filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		filterString += "%20and%20Field%20eq%20%27" + "Massg" + "%27";
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Label({text : oBundleText.getText("LAREREASON")}),
					           new sap.m.MultiComboBox(oController.PAGEID + "_Massg", { 
									width: "250px",
									selectionFinish : oController.onChangeComboBox,
							   }).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("LoaTypeReason"))]
				}).addStyleClass("L2PFilterItem")
			);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("BEGDA_FROM")}),
				           new sap.m.DatePicker(oController.PAGEID + "_Begda_From", {
								value: dateFormat.format(prevDate), 
								valueFormat : "yyyy-MM-dd",
					            displayFormat : gDtfmt,
								width : "120px",
								change : oController.onChangeDate
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("BEGDA_TO")}),
				           new sap.m.DatePicker(oController.PAGEID + "_Begda_To", {
								value: dateFormat.format(nextDate), 
								valueFormat : "yyyy-MM-dd",
					            displayFormat : gDtfmt,
								width : "120px",
								change : oController.onChangeDate
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		/*
		 * 2015.12.02 대상자 검색 조건 추가
		 */
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Label({text : oBundleText.getText("ENAME_3")}),
					           new sap.m.Input(oController.PAGEID + "_Ename", {
									width : "120px"
							   }).attachBrowserEvent("keyup", oController.onKeyUp)
							   .addStyleClass("L2P13Font")]
				}).addStyleClass("L2PFilterItem")
			);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label(),
				           new sap.m.Button({
								text: oBundleText.getText("SEARCH_BTN"),
								type : sap.m.ButtonType.Emphasized,
								press : oController.onPressSearch
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		var oFilterInfoBar = new sap.m.Toolbar({
			height : "2.5rem",
			content : [ new sap.m.Label({
			            	text : oBundleText.getText( "MULFILINFO")
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
//					    new sap.m.Text({
//					    	text : "{Numbr}"
//						}).addStyleClass("L2P13Font"), 
//						new sap.ui.core.Icon({
//							src: "sap-icon://status-completed", 
//							color: {path  : 'Astat', formatter : common.Formatter.StatusColor} 
//						}),
//						new sap.m.Text({
//							text : "{Latyptx}"
//						}).addStyleClass("L2P13Font"),
//						new sap.m.Text({
//						     text : "{Ename}"  
//						}).addStyleClass("L2P13Font"),
//						new sap.m.Text({
//						     text : "{Aprnm}"  
//						}).addStyleClass("L2P13Font"),
//						new sap.m.Text({
//							 text : "{Period}" 
//						}).addStyleClass("L2P13Font"),
//						new sap.m.Text({
//							 text : "{Dacnt}"
//						}).addStyleClass("L2P13Font"),
//						new sap.m.Text({
//							 text : {path : "Bakda",
//								 formatter : common.Common.DateFormatter
//							 }
//						}).addStyleClass("L2P13Font"),
//						new sap.m.Text({
//							 text : {path : "Appda",
//								 formatter : common.Common.DateFormatter
//							 }	
//						}).addStyleClass("L2P13Font"),
//						new sap.m.Text({
//							 text : {path : "Sgnda",
//								 formatter : common.Common.DateFormatter
//							 }
//						}).addStyleClass("L2P13Font")
 						new sap.m.Text({
					    	text : "{Numbr}"
						}).addStyleClass("L2P13Font"), 
						new sap.ui.core.Icon({
							src: "sap-icon://status-completed", 
							color: {path  : 'Astat', formatter : common.Formatter.StatusColor} 
						}),
						new sap.m.Text({
							text : "{Latyptx}"
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
						     text : "{Pernr}"  
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
						     text : "{Ename}"  
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
						     text : "{Zzcaltltx}"  
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
						     text : "{Zzcaltltx}"  
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
						     text : "{Fulln}"  
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
							 text : "{Period}" 
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
							 text : "{Dacnt}"
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
							 text : {path : "Bakda",
								 formatter : common.Common.DateFormatter
							 }
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
							 text : {path : "Appda",
								 formatter : common.Common.DateFormatter
							 }	
						}).addStyleClass("L2P13Font"),
						new sap.m.Text({
							 text : {path : "Sgnda",
								 formatter : common.Common.DateFormatter
							 }
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
				        	  header: new sap.m.Label({text : oBundleText.getText( "NUMBR")}).addStyleClass("L2P13Font"), 			        	  
				        	  demandPopin: true,
				        	  width: "25px",
				        	  hAlign : sap.ui.core.TextAlign.End,
				        	  minScreenWidth: "tablet"}),  	  
		           		  new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "STATU")}).addStyleClass("L2P13Font"), 			        	  
				        	  demandPopin: true,
				        	  width: "40px",
				        	  hAlign : sap.ui.core.TextAlign.Begin,
				        	  minScreenWidth: "tablet"}),  	  
				          new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "LARETYP")}).addStyleClass("L2P13Font"),
				        	  demandPopin: true,
				        	  hAlign : sap.ui.core.TextAlign.Begin,
				        	  minScreenWidth: "tablet"}),  
			        	  new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "PERNR")}).addStyleClass("L2P13Font"),
				        	  hAlign : sap.ui.core.TextAlign.Begin,
				        	  demandPopin: true}),	   	  
				          new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "ENAME")}).addStyleClass("L2P13Font"),
				        	  hAlign : sap.ui.core.TextAlign.Begin,
				        	  demandPopin: true}),	  
				          new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "ZZJOBGR")}).addStyleClass("L2P13Font"),
				        	  hAlign : sap.ui.core.TextAlign.Begin,
				        	  demandPopin: true}),
			        	  new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "ZZCALTL")}).addStyleClass("L2P13Font"),
				        	  hAlign : sap.ui.core.TextAlign.Begin,
				        	  demandPopin: true}),
			        	  new sap.m.Column({
			        		  header: new sap.m.Label({text : oBundleText.getText( "FULLN")}).addStyleClass("L2P13Font"),
				        	  hAlign : sap.ui.core.TextAlign.Begin,
				        	  demandPopin: true}),
				          new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "LOAPERIOD")}).addStyleClass("L2P13Font"),
				        	  hAlign : sap.ui.core.TextAlign.Center,
//				        	  width: "200px",
				        	  demandPopin: true}),
				          new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "DACNT")}).addStyleClass("L2P13Font"),
				        	  hAlign : sap.ui.core.TextAlign.Center,
				        	  width : "80px",
				        	  demandPopin: true}),
				          new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "BAKDA")}).addStyleClass("L2P13Font"),
				        	  hAlign : sap.ui.core.TextAlign.Center,
				        	  width : "80px",
				        	  demandPopin: true}),		
			        	  new sap.m.Column({
				        	  header: new sap.m.Label({text : oBundleText.getText( "APPLD")}).addStyleClass("L2P13Font"),
				        	  hAlign : sap.ui.core.TextAlign.Center,
				        	  width : "80px",
				        	  demandPopin: true}),
			        	  new sap.m.Column({
			        		  header: new sap.m.Label({text : oBundleText.getText( "SGNDA")}).addStyleClass("L2P13Font"),
				        	  hAlign : sap.ui.core.TextAlign.Center,
				        	  width : "80px",
				        	  demandPopin: true})
				          ]
//			          
		});

		var oIConFilter1 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_ALL",{
			showAll : true,
			key : "All",
			icon : "",
			design : sap.m.IconTabFilterDesign.Horizontal,
			text : oBundleText.getText( "DOCNUM")
		});
		
		var iConSeperator = new sap.m.IconTabSeparator();
		
		var oIConFilter2 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_CRETAE",{
			icon : "sap-icon://create",
			iconColor : "Default",
            text :  oBundleText.getText( "STATUS_CREATING"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "creation" 
		});
	
		var oIConFilter3 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_APPROVAL", {
			icon : "sap-icon://approvals",
			iconColor : "Positive",
            text :  oBundleText.getText( "STATUS_APPROVAL"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "approval"
		});
		
		var oIConFilter4 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_CONFIRM",{
			icon : "sap-icon://sys-enter",
			iconColor : "Neutral",
            text :  oBundleText.getText( "STATUS_CONFIRM"),
            design : sap.m.IconTabFilterDesign.Horizontal,
            width : "100px",
			key : "confirmation"
		});
		
		var oIConFilter5 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_REJECT",{
			icon : "sap-icon://decline",
			iconColor : "Negative",
            text :  oBundleText.getText( "STATUS_REJECT"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "reject"
		});
		
		var oIConFilter6 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_COMPLETE",{
			icon : "sap-icon://accept",
			iconColor : "Critical",
            text :  oBundleText.getText( "ACT_REQUEST_BTN"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "complete"
		});
		
		var oIConBar = new sap.m.IconTabBar(oController.PAGEID + "_ICONBAR",{
			content : [ oTable ],
			items : [ oIConFilter1, iConSeperator, oIConFilter2, oIConFilter3,
			          oIConFilter4, oIConFilter5, oIConFilter6,],
			select : oController.handleIconTabBarSelect ,
			selectedKey : "All"
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oFilterLayout,
			            oFilterInfoBar,
			           	oIConBar
			           ]
		});
		
		var oFooterBar = new sap.m.Bar({
				contentLeft : [
					 new sap.m.Button({
						 text : oBundleText.getText( "SORT_BTN"),
						 press : oController.onPressSort
					 	 }),
//				 	 new sap.m.Button({
//						 text : oBundleText.getText( "FILTER_BTN"),
//						 press : oController.onPressFilter
//					 	 })  	 
					 	
	                ],
				contentRight : [
							 new sap.m.Button({
								 text : oBundleText.getText( "NEW_APPLY"),
								 press : oController.onPressNewApply
							 	 }) ,
							 new sap.m.Button(oController.PAGEID + "_COMPLETE_BTN",{
								 text : oBundleText.getText( "ACT_REQUEST_BTN"),
								 press : oController.onPressComplete
							 	 })  	 	
				                ]
		});
		
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText( "TITLE_ACT_LOA")
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
