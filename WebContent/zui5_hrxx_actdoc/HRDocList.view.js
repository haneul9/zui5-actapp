sap.ui.jsview("zui5_hrxx_actdoc.HRDocList", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actdoc.HRDocList
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actdoc.HRDocList";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actdoc.HRDocList
	*/ 
	createContent : function(oController) {
		
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.Formatter");
		
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
				           new sap.m.MultiComboBox(oController.PAGEID + "_Persa", {
								width: "300px",
								selectionFinish : oController.onChnageComboBox,
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("HRDOC") + ":"}),
				           new sap.m.MultiComboBox(oController.PAGEID + "_Hrdoc", {
								width: "300px",
								selectionFinish : oController.onChnageComboBox,
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("DOCTL") + ":"}),
				           new sap.m.Input(oController.PAGEID + "_Doctl", {
								width: "200px",
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("SENDDATES") + ":"}),
				           new sap.m.DatePicker(oController.PAGEID + "_Reqdq_From", {
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
				content : [new sap.m.Label({text : oBundleText.getText("SENDDATEE") + ":"}),
				           new sap.m.DatePicker(oController.PAGEID + "_Reqdq_To", {
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
		
		var oFilterInfoBar = new sap.m.Toolbar({
			height : "2.5rem",
			content : [ new sap.m.Label({
			            	text : oBundleText.getText( "FILINFO")
			            }).addStyleClass("L2P13Font"),
		            	new sap.m.Text(oController.PAGEID + "_FilterInfo", {		            	
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
				new sap.m.Text({
				    text : "{Numbr}" 
				}).addStyleClass("L2P13Font"), //가족유형
				new sap.ui.core.Icon({
					src: "sap-icon://status-completed", 
					color: {path  : 'Docst', formatter : common.Formatter.HRDocStatusColor} 
				}),				
				new sap.m.Text({
				     text : "{Hrdoctx}" ,
			    	 textAlign : sap.ui.core.TextAlign.Begin,	 
				}).addStyleClass("L2P13Font"), //성
				new sap.m.Text({
				     text : "{Doctl}" ,	 
				}).addStyleClass("L2P13Font"), //이름
				new sap.m.Text({
				     text : {parts : [
				                  {path : "Smbda", formatter : common.Common.DateFormatter},
				                  {path : "Smeda", formatter : common.Common.DateFormatter}
				             ],
				             formatter : function(fVal1, fVal2) {
				            	 return fVal1 + " ~ " + fVal2;
				             }
				     }
				}).addStyleClass("L2P13Font"), //생년월일
				new sap.m.Text({
				     text : "{Rqcnt}" ,	 
				}).addStyleClass("L2P13Font"), //이름
				new sap.m.Text({
				     text : "{Smcnt}" ,	 
				}).addStyleClass("L2P13Font"), //이름
				new sap.m.Text({
					 width : "100%",
					 textAlign : sap.ui.core.TextAlign.Right,
				     text : {path : "Prrte",
				    	 formatter : function(fVal) {return fVal + " %"; }},	 
				}).addStyleClass("L2P13Font"), //이름
				new sap.m.Text({
				     text : {path : "Reqdq",
				    	 formatter : common.Common.DateFormatter
				     }
				}).addStyleClass("L2P13Font"), //생년월일
				new sap.m.Text({
				     text : {path : "Rmdda",
				    	 formatter : common.Common.DateFormatter
				     }
				}).addStyleClass("L2P13Font"), //생년월일
				new sap.m.Text({
				     text : {path : "Cplda",
				    	 formatter : common.Common.DateFormatter
				     }
				}).addStyleClass("L2P13Font"), //생년월일
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_TABLE", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText("MSG_NODATA"),
			fixedLayout : false,
			columns : [
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "NUMBER")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  width: "40px",
			        	  hAlign : sap.ui.core.TextAlign.Right,
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ASTAT")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "HRDOC")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Text({text : oBundleText.getText( "DOCTL")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "SMBPERIOD")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "RQCNT")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "SMCNT")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PRRTE")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "REQDQ")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "RMDDA")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "CPLDA")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true})
			          ]
		}).addStyleClass("L2PBackgroundWhite");
		
		var oIConFilter1 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_ALL",{
			showAll : true,
			key : "All",
			icon : "",
			design : sap.m.IconTabFilterDesign.Horizontal,
			text : oBundleText.getText( "DOCNUM")
		});
		
		var iConSeperator = new sap.m.IconTabSeparator();
		
		var oIConFilter2 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_HRDOC1",{
			icon : "sap-icon://create",
			iconColor : "Default",
            text :  oBundleText.getText( "HRDOC_STATUS_1"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "1" 
		});
	
		var oIConFilter3 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_HRDOC2", {
			icon : "sap-icon://sys-enter",
			iconColor : "Neutral",
            text :  oBundleText.getText( "HRDOC_STATUS_2"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "2"
		});
		
		var oIConFilter4 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_HRDOC3",{
			icon : "sap-icon://decline",
			iconColor : "Negative",
            text :  oBundleText.getText( "HRDOC_STATUS_3"),
            design : sap.m.IconTabFilterDesign.Horizontal,
            width : "100px",
			key : "3"
		});
		
		var oIConFilter5 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_HRDOC4",{
			icon : "sap-icon://accept",
			iconColor : "Critical",
            text :  oBundleText.getText( "HRDOC_STATUS_4"),
            design : sap.m.IconTabFilterDesign.Horizontal,
            width : "100px",
			key : "4"
		});
		
		var oIConBar = new sap.m.IconTabBar(oController.PAGEID + "_ICONBAR",{
			content : [ oTable ],
			items : [ oIConFilter1, iConSeperator, oIConFilter2, oIConFilter3,
			          oIConFilter4, oIConFilter5],
			select : oController.handleIconTabBarSelect ,
			selectedKey : "All"
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
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
				 		 text: oBundleText.getText("EXCEL_BTN"),
				 		 press : oController.downloadExcel
				 		 })
					 	],
			 	contentRight : [         
 	                new sap.m.Button({
						 text : oBundleText.getText( "NEW_CREATE_BTN"),
						 press : oController.onPressRequest
 	                })
	                ]
		});		
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText("TITLE_HRDOC_MANAGE")
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
