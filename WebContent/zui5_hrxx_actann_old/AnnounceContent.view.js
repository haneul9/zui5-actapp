sap.ui.jsview("zui5_hrxx_actann.AnnounceContent", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actann.AnnounceContent
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actann.AnnounceContent"; 
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actann.AnnounceContent
	*/ 
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("sap.ui.unified.FileUploader");
		
        var oCell = null, oRow = null;
		
		var oRequestLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "40px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("DOCTL"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 3,
			content : [ new sap.m.Input(oController.PAGEID + "_Title", {
							width : "95%",
						}).addStyleClass("L2P13Font"),
					    new sap.m.Text(oController.PAGEID + "_Title2", {
					    	width : "95%",
		            	}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "40px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("WRITE_ORGTX")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Text(oController.PAGEID + "_Orgtx", {
				width : "95%",
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("WRITE_ENAME")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Text(oController.PAGEID + "_Ename", {
				width : "95%",
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "40px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("REGDA")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Text(oController.PAGEID + "_Annda", {
				width : "95%",
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("UPDDA")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Text(oController.PAGEID + "_Datlo", {
				width : "95%",
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "40px"});
		
		var oFileUploader = new sap.ui.unified.FileUploader(oController.PAGEID + "_AttachFile", {
			name : oController.PAGEID + "AttachFile",
			maximumFileSize: 10,
			multiple : false,
			width : "90%",
			uploadOnChange: false,
			mimeType: [],
			fileType: [],
			buttonText : oBundleText.getText("FILE_BTN"),
			icon : "sap-icon://attachment",
			buttonOnly : false,
			fileSizeExceed: oController.fileSizeExceed,
			typeMissmatch: oController.typeMissmatch,
			change : oController.onFileChange
		});
		
		var oFileLink = new sap.m.Link(oController.PAGEID + "_AttachFileLink",{
			text : "",
		}).addStyleClass("L2P13Font");
		
		var oFileLinkBar = new sap.m.Toolbar(oController.PAGEID + "_AttachFileLinkBar",{
			design : sap.m.ToolbarDesign.Auto,
			content : [oFileLink,
			           new sap.m.ToolbarSpacer({width: "10px"}), 
			           new sap.m.Button(oController.PAGEID + "_AttachFileDelBtn", {
			        	   type : sap.m.ButtonType.Transparent, 
			        	   icon : "sap-icon://delete",
			        	   press : oController.onDeleteFile
			           })
			           ]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		var oAttachFileLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [oFileUploader, oFileLinkBar]
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ATTACHFILE")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 3, 
			content : oAttachFileLayout
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		var oRequestPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://accounting-document-verification", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ANNOUNCE_BTN"), design : "Bold"}).addStyleClass("L2P13Font"),
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oRequestLayout]
		}).addStyleClass("");
		
		var oHtmlEditLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_HTMLEditor",  {
			width : "100%"
		});
		
		var oHtmlEditPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [oHtmlEditLayout]
		}).addStyleClass("");
	
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oRequestPanel,
			            oHtmlEditPanel
			           ]
		});
		
		var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
			contentRight : [  
			                new sap.m.Button(oController.PAGEID + "_SAVE_BTN", {
		 	                	text : oBundleText.getText( "SAVE_BTN"),
		 	                	press : oController.onPressSave
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
									   			text : oBundleText.getText( "TITLE_ACT_ANNOUNCE")
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