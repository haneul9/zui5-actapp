sap.ui.jsview("zui5_hrxx_actapp2.ActAppDocumentView", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf epmproductapp.CreateView
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp2.ActAppDocumentView";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf epmproductapp.CreateView
	*/ 
	createContent : function(oController) {

        var oProcessFlow = new sap.suite.ui.commons.ProcessFlow(oController.PAGEID + "_ProcessFlow", {
        	foldedCorners : true,
        	scrollable : false,
        	wheelZoomable : false
        }); 
        
        var oPFLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_PFLAYOUT",  {
        	width : "100%",
        	content : [oProcessFlow]
        });
        
        var oStatusPanel = new sap.m.Panel(oController.PAGEID + "_StatusPanel", {
			expandable : true,
			expanded : false,
			backgroundDesign : "Transparent",
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [//new sap.ui.core.Icon({src : "sap-icon://shipping-status", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label(oController.PAGEID + "_StatusPanel_Title", {text : oBundleText.getText("TITLE_PROCESS_STATUS"), design : "Bold"}).addStyleClass("L2P13Font"),
				          ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oPFLayout]
		});
        
        var oCell = null, oRow = null;
		
		var oRequestLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("PBTXT2")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Text(oController.PAGEID + "_Persa", {
						width : "95%"
					}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("REQDP")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new  sap.m.Text(oController.PAGEID + "_Orgeh", {
						width : "95%"
					}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		var oReqno = new sap.m.Text(oController.PAGEID + "_Reqno", {
			width : "95%",
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("REQNO")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oReqno
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oTitle = new sap.m.Text(oController.PAGEID + "_Title", {
			width : "95%",
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("TITLE")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oTitle
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		var oActda = new sap.m.Text(oController.PAGEID + "_Actda", {
			width : "95%",
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ACTDA")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oActda
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oReqda = new sap.m.Text(oController.PAGEID + "_Reqda", {
			width : "95%",
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("REQDA")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oReqda
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		var oUnote = new sap.m.Text(oController.PAGEID + "_Notes", {
			width : "95%",
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("UNOTE")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 3, 
			content : oUnote
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		var oRequestPanel = new sap.m.Panel({
			expandable : true,
			expanded : true,
			backgroundDesign : "Transparent",
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [//new sap.ui.core.Icon({src : "sap-icon://accounting-document-verification", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ACT_REQUEST"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				          ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oRequestLayout]
		});
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_ListTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 40,
//			rowHeight : 48,
			visibleRowCount : 14,
			selectionMode : sap.ui.table.SelectionMode.None
		});
		
		var oListPanel = new sap.m.Panel({
			expandable : true,
			expanded : true,
			backgroundDesign : "Transparent",
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [//new sap.ui.core.Icon({src : "sap-icon://collaborate", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ACT_PERSONS"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer({width : "15px"}),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Apply.png"}),
				           new sap.m.Label({text : oBundleText.getText("STATUSC")}).addStyleClass("L2P13Font"),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Error.png"}),
				           new sap.m.Label({text : oBundleText.getText("STATUSE")}).addStyleClass("L2P13Font"),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Lock.png"}),
				           new sap.m.Label({text : oBundleText.getText("STATUSL")}).addStyleClass("L2P13Font"),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Problem.png"}),
				           new sap.m.Label({text : oBundleText.getText("VERIFY")}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Button(oController.PAGEID + "_View_Rec_Btn",{text: oBundleText.getText("VIEW_REC_BTN"), icon : "sap-icon://personnel-view", press : oController.viewRecPerson, visible : false}),
				           new sap.m.Button(oController.PAGEID + "_Add_Btn",{text: oBundleText.getText("EXCEL_BTN"), icon : "sap-icon://excel-attachment", press : oController.downloadExcel}),
				          ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oTable]
		});	
	
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oStatusPanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oRequestPanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oListPanel
			           ]
		});
		
		var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
			contentLeft : [new sap.m.Button(oController.PAGEID + "_STATUS_BTN", {
				             	text : oBundleText.getText( "BTN_ACT_STATUS"),
				              	press : oController.onChangeStatus
				           })
						   ],
			contentRight : [
//			                new sap.m.Button(oController.PAGEID + "_REQUEST_BTN", {
//				             	text : oBundleText.getText( "REQUEST_BTN"),
//				              	press : oController.onPressRequest
//				            }),
			                new sap.m.Button(oController.PAGEID + "_COMPLETE_BTN", {
				             	text : oBundleText.getText( "ACTION_COMPLETE_BTN"),
				             	press : oController.onPressCompelte
				            }),
//				            new sap.m.Button(oController.PAGEID + "_ANNOUNCE_BTN", {
//				             	text : oBundleText.getText( "ANNOUNCE_BTN"),
//				             	press : oController.onPressAnnounce
//				            }),
//				            new sap.m.Button(oController.PAGEID + "_DOCVIEW_BTN", {
//				             	text : oBundleText.getText( "DOCVIEW_BTN"),
//				             	press : oController.onPressDocPreview
//				            }),
//				            new sap.m.Button(oController.PAGEID + "_SENDMAIL_BTN", {
//				             	text : oBundleText.getText( "SENDMAIL_BTN"),
//				             	press : oController.onPressSendEmail
//				            })
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
									   			text : oBundleText.getText( "TITLE_ACTREQ_VIEW")
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeaderBar") ,
			footer : oFooterBar 
		});
		return oPage ;
	
	}
});