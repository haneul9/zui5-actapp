sap.ui.jsview("zui5_hrxx_actrec.ActRecSubject", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf epmproductapp.CreateView
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actrec.ActRecSubject";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf epmproductapp.CreateView
	*/ 
	createContent : function(oController) {
//		//Language 및 Properties를 가져온다.
//		var locale = sap.ui.getCore().getConfiguration().getLanguage(); //언어
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : locale
//        });
        
        var oCell = null, oRow = null;
        
        var oMatrixCell01 = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : true,
			columns : 1
		});
        
        oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"25px"});
        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : new sap.m.Label(oController.PAGEID + "_Header_RecNm", {text: "", width:"100%"}).addStyleClass("L2P13Font L2P13FontBold")
		});
		oRow.addCell(oCell);
		oMatrixCell01.addRow(oRow);
        
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"25px"});
        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label(oController.PAGEID + "_Header_Pbtxt", {text: "", width:"100%"}).addStyleClass("L2P13Font")
		});
		oRow.addCell(oCell);
		oMatrixCell01.addRow(oRow);
        
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"25px"});
        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Bottom,
			content : new sap.m.Label(oController.PAGEID + "_Header_RecYyRecTypeCd", {text: "", width:"100%"}).addStyleClass("L2P13Font")
		});
		oRow.addCell(oCell);
		oMatrixCell01.addRow(oRow);
		
        var oMatrixCell02 = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : true,
			columns : 1
		});
        
        oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"25px"});
        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : new sap.m.Label({text: oBundleText.getText( "TRECNT"), width:"100%"}).addStyleClass("L2P13Font")
		});
		oRow.addCell(oCell);
		oMatrixCell02.addRow(oRow);
        
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"50px"});
        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Right,
			vAlign : sap.ui.commons.layout.VAlign.Bottom,
			content : [new sap.m.Label(oController.PAGEID + "_Header_Recnt", {text: "0"}).addStyleClass("L2P34Font L2P13FontBold L2PFontColorBlue"),
			           new sap.ui.core.HTML({content : "<span style='padding-left:10px'></span>",	preferDOM : false}),
			           new sap.m.Label({text: oBundleText.getText( "PCNT")}).addStyleClass("L2P13Font L2PFontColorBlue")]
			           
		});
        
        
        
		oRow.addCell(oCell);
		oMatrixCell02.addRow(oRow);		
		
		 var oMatrixCell03 = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : true,
			columns : 1
		});
        
        oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"25px"});
        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : new sap.m.Label({text: oBundleText.getText( "MFCNT"), width:"100%"}).addStyleClass("L2P13Font")
		});
		oRow.addCell(oCell);
		oMatrixCell03.addRow(oRow);
        
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"50px"});
        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Bottom,
			content : [new  sap.suite.ui.commons.ComparisonChart({
				        	width: "100%",
							data : [
							        new sap.suite.ui.commons.ComparisonData(oController.PAGEID + "_Header_Macnt", {
							        	title: oBundleText.getText( "MACNT"),
							        	value: 0,
							        	color: "Good"
							        }),
							        new sap.suite.ui.commons.ComparisonData(oController.PAGEID + "_Header_Facnt", {
							        	title: oBundleText.getText( "FACNT"),
							        	value: 0,
							        	color: "Critical"
							        })
							        ]
						})]
			           
		});
		oRow.addCell(oCell);
		oMatrixCell03.addRow(oRow);
		
		var oMatrixCell04 = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : true,
			columns : 2,
			widths : ["50px",""]
		});
        
        oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"25px"});
        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			colSpan : 2,
			content : new sap.m.Label({text: oBundleText.getText( "TSUB08F"), width:"100%"}).addStyleClass("L2P13Font")
		});
		oRow.addCell(oCell);
		oMatrixCell04.addRow(oRow);
        
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"50px"});
        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Bottom,
			content : new sap.ui.core.Icon({src : "sap-icon://refresh", size : "28px", color : "#999999"})
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Right,
			vAlign : sap.ui.commons.layout.VAlign.Bottom,
			content : [new sap.m.Label(oController.PAGEID + "_Header_Reent", {text: "0"}).addStyleClass("L2P34Font L2P13FontBold L2PFontColorRed"),
			           new sap.ui.core.HTML({content : "<span style='padding-left:10px'></span>",	preferDOM : false}),
			           new sap.m.Label({text: oBundleText.getText( "PCNT")}).addStyleClass("L2P13Font L2PFontColorRed")]
			           
		});
		oRow.addCell(oCell);
		oMatrixCell04.addRow(oRow);
		
		var oMatrixCell05 = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : true,
			columns : 2,
			widths : ["50px",""]
		});
        
        oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"25px"});
        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			colSpan : 2,
			content : new sap.m.Label({text: oBundleText.getText( "RECST"), width:"100%"}).addStyleClass("L2P13Font")
		});
		oRow.addCell(oCell);
		oMatrixCell05.addRow(oRow);
        
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"50px"});
        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Bottom,
			content : new sap.ui.core.Icon({src : "sap-icon://create", size : "28px", color : "#999999"})
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Right,
			vAlign : sap.ui.commons.layout.VAlign.Bottom,
			content : new sap.m.Label(oController.PAGEID + "_Header_Recsttx", {text: ""}).addStyleClass("L2P26Font L2P13FontBold L2PFontColorGray")
		});
		oRow.addCell(oCell);
		oMatrixCell05.addRow(oRow);
		
        var oHeaderMatrix = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 5,
			widths: ["20%","20%","20%","20%","20%"],
		});
        
        oRow = new sap.ui.commons.layout.MatrixLayoutRow();
        
        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oMatrixCell01
		}).addStyleClass("L2PInputTableDataHeader2 L2PPaddingHeader");
		oRow.addCell(oCell);
        
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oMatrixCell02
		}).addStyleClass("L2PInputTableDataHeader2 L2PPaddingHeader");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oMatrixCell03
		}).addStyleClass("L2PInputTableDataHeader2 L2PPaddingHeader");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oMatrixCell04
		}).addStyleClass("L2PInputTableDataHeader2 L2PPaddingHeader");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oMatrixCell05
		}).addStyleClass("L2PInputTableDataHeader2 L2PPaddingHeader");
		oRow.addCell(oCell);
		
		oHeaderMatrix.addRow(oRow);
        
        var oHCLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_HCLAYOUT",  {
        	width : "100%",
        	content : [oHeaderMatrix]
        });
        
    	var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_COLUMNLIST", {
			type : sap.m.ListType.Navigation,
			press : oController.onSelectRow ,
			counter : 10,
			cells : [ 
				new sap.m.Text({
				     text : "{Lnmhg}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Fnmhg}" 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Nachn}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Vorna}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Lnmch}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Fnmch}" 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Hndno}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Telno}" 
				}).addStyleClass("L2P13Font"),
				new sap.ui.core.Icon({
					src: "sap-icon://accept", 
					size: "12px",
					visible: {path: 'Cnt01', formatter: function(fVal){return fVal.trim() >= "1" ? true : false;}}
				}),
				new sap.ui.core.Icon({
					src: "sap-icon://accept", 
					size: "12px",
					visible: {path: 'Cnt02', formatter: function(fVal){return fVal.trim() >= "1" ? true : false;}}
				}),
				new sap.ui.core.Icon({
					src: "sap-icon://accept", 
					size: "12px",
					visible: {path: 'Cnt03', formatter: function(fVal){return fVal.trim() >= "1" ? true : false;}}
				}),
				new sap.ui.core.Icon({
					src: "sap-icon://accept", 
					size: "12px",
					visible: {path: 'Cnt04', formatter: function(fVal){return fVal.trim() >= "1" ? true : false;}}
				}),
//				new sap.ui.core.Icon({
//					src: "sap-icon://accept", 
//					size: "12px",
//					visible: {path: 'Cnt05', formatter: function(fVal){return fVal.trim() >= "1" ? true : false;}}
//				}),
				new sap.ui.core.Icon({
					src: "sap-icon://accept", 
					size: "12px",
					visible: {path: 'Cnt06', formatter: function(fVal){return fVal.trim() >= "1" ? true : false;}}
				}),
				new sap.ui.core.Icon({
					src: "sap-icon://accept", 
					size: "12px",
					visible: {path: 'Cnt07', formatter: function(fVal){return fVal.trim() >= "1" ? true : false;}}
				}),
				new sap.ui.core.Icon({
					src: "sap-icon://accept", 
					size: "12px",
					visible: {path: 'Cnt08', formatter: function(fVal){return fVal.trim() >= "1" ? true : false;}}
				})
			]
		
		});  
		var oTable = new sap.m.Table(oController.PAGEID + "_TABLE", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText("MSG_NODATA"),
			fixedLayout : false,
			//mode : sap.m.ListMode.MultiSelect,
			//mode : sap.m.ListMode.SingleSelectLeft,
			columns : [
//		        	  new sap.m.Column({
//			        	  header: new sap.m.Label({text : oBundleText.getText( "NUMBER")}).addStyleClass("L2P13Font"), 			        	  
//			        	  demandPopin: true,
//			        	  width: "80px",
//			        	  hAlign : sap.ui.core.TextAlign.Center,
//			        	  minScreenWidth: "tablet"}),  	
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "LNMHG")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "FNMHG")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "NACHN")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true,
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "VORNA")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "LNMCH")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "FNMCH")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "HNDNO")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "TELNO2")}).addStyleClass("L2P13Font"),
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
		        		  header: new sap.m.Label({text : oBundleText.getText( "TSUB08")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
			        ]
		});
		oTable.setModel(sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV"));
		
		var oListPanel = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://collaborate", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ACT_REC_PERSONS"), design : "Bold"}).addStyleClass("L2P13Font"),
				          ]
			}),
			content : oTable
		});		
	
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ oHCLayout,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oListPanel
			           ]
		});
		
		var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
			contentRight : [
//							new sap.m.Button({
//								 text : oBundleText.getText( "DELETE_BTN"),
//								 press : oController.onDelete
//							}),
							new sap.m.Button({
								 text : oBundleText.getText( "NEW_RECACT_BTN"),
								 press : oController.onRecallSubject
								 }), 
			                new sap.m.Button(oController.PAGEID + "_CREATE_BTN", {
				             	text : oBundleText.getText( "ACT_REQUEST"),
				             	press : oController.onCAOpen
				            }),
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
									   			text : oBundleText.getText("TITLE_RECACT_REQUEST_DETAIL")
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