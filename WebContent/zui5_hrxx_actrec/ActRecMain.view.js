sap.ui.jsview("zui5_hrxx_actrec.ActRecMain", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actrec.ActRecMain";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	createContent : function(oController) {
       
		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.Common");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var oFilterLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		}).addStyleClass("L2PFilterLayout");
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("PBTXT") + ":"}),
				           new sap.m.Input(oController.PAGEID + "_Persa", {
								width: "300px",
								enable: false,
							}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Label({text : oBundleText.getText("BTRTL") + ":"}),
					           new sap.m.Select(oController.PAGEID + "_SubPersa", {
									width: "300px",
							   }).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PFilterItem")
			);
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Label({text : oBundleText.getText("RECNM") + ":"}),
					           new sap.m.Input(oController.PAGEID + "_RecNm", {
									width: "300px",
							   }).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PFilterItem")
			);
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("RECYY") + ":"}),
				           new sap.m.Select(oController.PAGEID + "_RecYy", {
				         	   width : "110px"
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
			type : sap.m.ListType.Navigation,
			press : oController.onSelectRow ,
			counter : 10,
			cells : [ 
				new sap.ui.core.Icon({
					src: "sap-icon://status-completed", 
					color: {path  : 'Recst', formatter : common.Formatter.RecStatusColor} 
				}),
//				new sap.m.Text({
//				     text : "{Pbtxt}",
//				     wrapping : false
//				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{RecYy}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{RecTypeCd}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{RecNm}" ,	
				     wrapping : false
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Recnt}" 
				}).addStyleClass("L2P13Font"),
				new sap.ui.core.Icon({
					src: "sap-icon://accept", 
					size: "12px",
					visible: {path: 'Sub01', formatter: function(fVal){return fVal.trim() >= "1" ? true : false;}}
				}),
				new sap.ui.core.Icon({
					src: "sap-icon://accept", 
					size: "12px",
					visible: {path: 'Sub02', formatter: function(fVal){return fVal.trim() >= "1" ? true : false;}}
				}),
				new sap.ui.core.Icon({
					src: "sap-icon://accept", 
					size: "12px",
					visible: {path: 'Sub03', formatter: function(fVal){return fVal.trim() >= "1" ? true : false;}}
				}),
				new sap.ui.core.Icon({
					src: "sap-icon://accept", 
					size: "12px",
					visible: {path: 'Sub04', formatter: function(fVal){return fVal.trim() >= "1" ? true : false;}}
				}),
//				new sap.ui.core.Icon({
//					src: "sap-icon://accept", 
//					size: "12px",
//					visible: {path: 'Sub05', formatter: function(fVal){return fVal.trim() >= "1" ? true : false;}}
//				}),
				new sap.ui.core.Icon({
					src: "sap-icon://accept", 
					size: "12px",
					visible: {path: 'Sub06', formatter: function(fVal){return fVal.trim() >= "1" ? true : false;}}
				}),
				new sap.ui.core.Icon({
					src: "sap-icon://accept", 
					size: "12px",
					visible: {path: 'Sub07', formatter: function(fVal){return fVal.trim() >= "1" ? true : false;}}
				}),
				new sap.m.Text({
					text : {path : "Datlo", formatter: common.Common.DateFormatter}
				}).addStyleClass("L2P13Font")
			]
		
		});  
		var oTable = new sap.m.Table(oController.PAGEID + "_TABLE", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText("MSG_NODATA"),
			fixedLayout : false,
			//mode : sap.m.ListMode.SingleSelectLeft,
			columns : [
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "STATU")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  width: "40px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),  	
//		        	  new sap.m.Column({
//			        	  header: new sap.m.Label({text : oBundleText.getText( "PBTXT")}).addStyleClass("L2P13Font"),
//			        	  hAlign : sap.ui.core.TextAlign.Begin,
//			        	  demandPopin: true,
//			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "RECYY")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "RECTYPE")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "RECNM")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  //width: "300px",
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "RECNT")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "TSUB01")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "TSUB02")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "TSUB03")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "TSUB04")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
//		        	  new sap.m.Column({
//		        		  header: new sap.m.Label({text : oBundleText.getText( "TSUB05")}).addStyleClass("L2P13Font"),
//			        	  hAlign : sap.ui.core.TextAlign.Center,
//			        	  width: "80px",
//			        	  demandPopin: true}),
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "TSUB06")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "TSUB07")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "TDATLO")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
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
		
		var oIConFilter2 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_A",{
			icon : "sap-icon://create",
			iconColor : "Default",
            text :  oBundleText.getText("REC_STATUS_A"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "A" 
		});
	
		var oIConFilter3 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_B", {
			icon : "sap-icon://approvals",
			iconColor : "Positive",
            text :  oBundleText.getText("REC_STATUS_B"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "B"
		});
		
		var oIConFilter4 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_C",{
			icon : "sap-icon://accept",
			iconColor : "Critical",
            text :  oBundleText.getText("REC_STATUS_C"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "C"
		});
		
		var oIConBar = new sap.m.IconTabBar(oController.PAGEID + "_ICONBAR",{
			content : [ oTable ],
			items : [ oIConFilter1, iConSeperator, 
			          oIConFilter2, oIConFilter3, oIConFilter4 ],
			select : oController.handleIconTabBarSelect ,
			selectedKey : "All"
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oFilterLayout,
			           	oIConBar
			           ]
		});
		
		var oFooterBar = new sap.m.Bar({
				contentLeft : [
					 new sap.m.Button({
						 text : oBundleText.getText( "SORT_BTN"),
						 press : oController.onPressSort
					 	 }) 
					 	],
			 	contentRight : [         
 	                new sap.m.Button({
						 text : oBundleText.getText( "NEW_RECACT_BTN"),
						 press : oController.createAction
 	                })
	                ]
		});
		
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText("TITLE_RECACT_REQUEST")
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
