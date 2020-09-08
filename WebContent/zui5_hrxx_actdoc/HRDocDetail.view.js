sap.ui.jsview("zui5_hrxx_actdoc.HRDocDetail", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actdoc.HRDocDetail
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actdoc.HRDocDetail";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actdoc.HRDocDetail
	*/ 
	createContent : function(oController) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
        
        var oCell = null, oRow = null;
		
		var oRequestLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		 
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"47px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("PBTXT"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel47 L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Select(oController.PAGEID + "_Persa", {
						width : "95%"
					}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData47 L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("HRDOC"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel47 L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Select(oController.PAGEID + "_Hrdoc", {
						width : "95%",
						change : oController.onChangeHrdoc
					}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData47 L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"47px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("DOCTL"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel47 L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new  sap.m.Input(oController.PAGEID + "_Doctl", {
						width : "95%",
					}).addStyleClass("L2P13Font") //.setModel(sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV"))
		}).addStyleClass("L2PInputTableData47 L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SMBPERIOD"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel47 L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Toolbar({
						design : sap.m.ToolbarDesign.Auto,
						content : [new sap.m.DatePicker(oController.PAGEID + "_Smbda", {
										value: dateFormat.format(curDate), 
										valueFormat : "yyyy-MM-dd",
							            displayFormat : gDtfmt,
										width : "150px",
										change : oController.onChangeDate
								   }).addStyleClass("L2P13Font"),
								   new sap.m.Label({text : " ~ "}),
								   new sap.m.DatePicker(oController.PAGEID + "_Smeda", {
										value: dateFormat.format(curDate), 
										valueFormat : "yyyy-MM-dd",
							            displayFormat : gDtfmt,
										width : "150px",
										change : oController.onChangeDate
								   }).addStyleClass("L2P13Font"),
								   new sap.m.ToolbarSpacer(),
								   ]
					  }).addStyleClass("L2PToolbarNoBottomLine") 
		}).addStyleClass("L2PInputTableData47 L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"47px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("RMPRD"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel47 L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.RadioButtonGroup(oController.PAGEID + "_Rmprd", {
				width : "100%",
				columns : 4,
				buttons  : [new sap.m.RadioButton({groupName : "Rmprd", text : oBundleText.getText("RMPRD_R1")}),
				            new sap.m.RadioButton({groupName : "Rmprd", text : oBundleText.getText("RMPRD_R2")}),
				            new sap.m.RadioButton({groupName : "Rmprd", text : oBundleText.getText("RMPRD_R3")})]
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData47 L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("RQCNT_TX2")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel47 L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Text(oController.PAGEID + "_Rqcnt", {
				width : "95%",
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData47 L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		var oRequestPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://accounting-document-verification", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("OVERVIEW"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Button(oController.PAGEID + "_Save_Btn",{
				        	   text: oBundleText.getText("SAVE_BTN"), 
				        	   icon : "sap-icon://save", 
				        	   press : oController.onPressSave
				           })]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oRequestLayout]
		}).addStyleClass("");
		
		var oTable = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_PersonList",  {
			width : "100%",
		});
		
		var oListPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://collaborate", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("REQ_PERSONS"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Button(oController.PAGEID + "_EXCEL_DOWNLOAD_BTN",{
				        	    icon : "sap-icon://download",
		 	                	text : oBundleText.getText( "EXCEL_DOWNLOAD_BTN"),
		 	                	press : oController.downloadExcelFormat
		 	               }),
				           new sap.m.Button(oController.PAGEID + "_EXCEL_UPLOAD_BTN",{
				        	    icon : "sap-icon://upload",
		 	                	text : oBundleText.getText( "EXCEL_UPLOAD_BTN"),
		 	                	press : oController.onPressUpload
		 	               }),
				           new sap.m.ToolbarSpacer({width: "10px"}),
				           new sap.m.Button(oController.PAGEID + "_Add_Btn",{text: oBundleText.getText("ADD_BTN"), icon : "sap-icon://add", press : oController.addPerson}),
				           new sap.m.Button(oController.PAGEID + "_Del_Btn",{text: oBundleText.getText("DELETE_BTN"), icon : "sap-icon://delete", press : oController.deletePerson, visible : false})]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oTable]
		});
		
		var vHtml = "<div style='padding-left:20px'><ui class='L2P13Font'>" 
			  + oBundleText.getText("HRDOC_NOTICE2") + "</ui></div>";
		
		var oNoticePanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://notification", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("REFERENCE"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [new sap.ui.core.HTML({content : vHtml,	preferDOM : false}).addStyleClass("L2PPaddingLeft10")]
		});
		
	
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oRequestPanel,
			            oNoticePanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oListPanel
			           ]
		});
		
		var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
			contentRight : [         
		 	               new sap.m.Button(oController.PAGEID + "_SEND_BTN", {
		 	                    text : oBundleText.getText( "SEND_BTN"),
		 	                	press : oController.onPressRequest
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_DELETE_BTN", {
		 	                	text : oBundleText.getText("DOCNUM")+oBundleText.getText( "DELETE_BTN"),
		 	                	press : oController.onPressDelete
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
								contentMiddle : new sap.m.Text(oController.PAGEID + "_PAGE_TITLE", {
									   			text : oBundleText.getText( "TITLE_HRDOC_REQUEST")
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeaderBar"),
			footer : oFooterBar 
		}).addStyleClass("") ; 
		
		return oPage ;
	}

});