sap.ui.jsview("zui5_hrxx_actpersonalid.PersonalidRequestList", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actpersonalid.PersonalidRequestList";
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
					content : [new sap.m.Label({text : oBundleText.getText("PBTXT") + ":"}),
					           new sap.m.MultiComboBox(oController.PAGEID + "_Persa", {
									width: "300px",
									selectionFinish : oController.onChangeComboBox,
								}).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("APER_PERIOD") + ":"}),
				           new sap.m.DatePicker(oController.PAGEID + "_Appld_From", {
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
				content : [new sap.m.DatePicker(oController.PAGEID + "_Appld_To", {
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
					content : [new sap.m.Label({text : oBundleText.getText("RPERN") + ":"}),
					           new sap.m.Input(oController.PAGEID + "_Rpern", {
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
			counter : 10,
			type : sap.m.ListType.Navigation,
			press : oController.onSelectRow ,
			cells : [ 
				new sap.m.Text({
					text : "{Numbr}",
					textAlign : sap.ui.core.TextAlign.End,
				}).addStyleClass("L2P13Font"),     
				new sap.ui.core.Icon({
					src: "sap-icon://status-completed", 
					color: {path  : 'Astat', formatter : common.Formatter.StatusColor} 
				}), //상태
				
				new sap.m.Text({
				     text : "{Chgfgtx}" 
				}).addStyleClass("L2P13Font"), //신청유형
				
				new sap.m.Text({
				     text : "{Ictxt}" ,	 
				}).addStyleClass("L2P13Font"), //신분증 유형
				
				new sap.m.Text({
				     text : "{Icnum}" 
				}).addStyleClass("L2P13Font"), //신분증 번호
				
				new sap.m.Text({
				     text : "{Auth1}"
				}).addStyleClass("L2P13Font"), //발행기관 
				
				new sap.m.Text({
				     //text : "{Idcottx}" ,	 
					 text : "{Iscottx}" , //2015.12.23 수정 By JMK
				}).addStyleClass("L2P13Font"), //발행당국
				
				new sap.m.Text({
				     text : {path : "Fpdat",
						 	 formatter : common.Common.DateFormatter
					 } 
				}).addStyleClass("L2P13Font"), //발행일
				
				new sap.m.Text({
				     text : {path : "Expid",
				    	 formatter : common.Common.DateFormatter
					 }	 
				}).addStyleClass("L2P13Font"), //만료일
				
				new sap.m.Text({
				     text : "{Pernr}"
				}).addStyleClass("L2P13Font"), //사번(대상자)
				new sap.m.Text({
				     text : "{Rpern}" ,	 
				}).addStyleClass("L2P13Font"), //성명(대상자)	
				new sap.m.Text({
				     text : "{Zzjobgrtx}" ,	 
				}).addStyleClass("L2P13Font"), //직군(대상자)	
				new sap.m.Text({
				     text : "{Zzcaltltx}" ,	 
				}).addStyleClass("L2P13Font"), //직위(대상자)	
				new sap.m.Text({
				     text : "{Rorgt}" ,	 
				}).addStyleClass("L2P13Font"), //소속(대상자)
				new sap.m.Text({
					 text : {path : "Appld",
						 formatter : common.Common.DateFormatter
					 }
				}).addStyleClass("L2P13Font"), //신청일
				new sap.m.Text({
				     text : "{Cpern}" ,	 
				}).addStyleClass("L2P13Font"), //확정자	
				new sap.m.Text({
					 text : {path : "Confd",
						 formatter : common.Common.DateFormatter
					 }
				}).addStyleClass("L2P13Font"), //확정일
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
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),  	  
		        	  new sap.m.Column({
						  header: new sap.m.Label({text : oBundleText.getText( "ASTAT")}).addStyleClass("L2P13Font"), 			        	  
						  demandPopin: true,
						  width: "40px",
						  hAlign : sap.ui.core.TextAlign.Center,
						  minScreenWidth: "tablet"}),
				      new sap.m.Column({
						  header: new sap.m.Label({text : oBundleText.getText( "APRTY")}).addStyleClass("L2P13Font"), 			        	  
						  demandPopin: true,
						  width: "60px",
						  hAlign : sap.ui.core.TextAlign.Center,
						  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ICTYP")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ICNUM2")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width: "100px",
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Text({text : oBundleText.getText( "ISAUT")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "IDCOT")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}), 
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "FPDAT")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,			        	  
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "CTEND")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,			        	  
			        	  demandPopin: true}),
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
		        		  header: new sap.m.Label({text : oBundleText.getText( "APPLD")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width : "80px",
			        	  demandPopin: true}),
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "CPERN")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "CONFD")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width : "80px",
			        	  demandPopin: true}),  
			          ]
			          
		});

		var iConSeperator = new sap.m.IconTabSeparator();
		
		var oIConFilter1 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_ALL",{
			showAll : true,
			key : "All",
			icon : "",
			design : sap.m.IconTabFilterDesign.Horizontal,
			text : oBundleText.getText( "DOCNUM")
		});
		
		var oIConFilter2 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_APPROVAL", {
			icon : "sap-icon://approvals",
			iconColor : "Positive",
            text :  oBundleText.getText( "STATUS_APPLY"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "approval"
		});
		
		
		var oIConFilter3 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_REJECT",{
			icon : "sap-icon://decline",
			iconColor : "Negative",
            text :  oBundleText.getText( "STATUS_REJECT"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "reject"
		});
		
		var oIConFilter4 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_COMPLETE",{
			icon : "sap-icon://accept",
			iconColor : "Critical",
            text :  oBundleText.getText( "STATUS_COMPLETE"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "complete"
		});
		
		var oIConBar = new sap.m.IconTabBar(oController.PAGEID + "_ICONBAR",{
			content : [ oTable ],
			items : [ oIConFilter1, iConSeperator, oIConFilter2, oIConFilter3, oIConFilter4],
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
				 		 text: oBundleText.getText("EXCEL_BTN"),
				 		 press : oController.downloadExcel
				 		 })
					] ,
				contentRight : [  
								new sap.m.Button({
									 text : oBundleText.getText( "COMPLETE_BTN"),
									 press : oController.onPressExecute,
									 customData : [{Key : "Astat" , value : "50"}]
								}),           
								new sap.m.Button({
									 text : oBundleText.getText( "REJECT_BTN"),
									 press : oController.onCOOpen,
								}),
								new sap.m.Button(oController.PAGEID + "_REJECT_BTN_R",{
									 text : oBundleText.getText( "REJECT_BTN"),
									 press : oController.onPressExecute,
									 customData : [{Key : "Astat" , value : "40"}],
									 visible : false
								}),   
				                ]
		});
		
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText( "TITLE_PERSONALID_MANG")
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
