sap.ui.jsview("zui5_hrxx_actapp2.ActRetireDocument", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actapp2.ActRetireDocument
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp2.ActRetireDocument";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actapp2.ActRetireDocument
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
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("PBTXT2"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Select(oController.PAGEID + "_Persa", {
						width : "95%",
						change : oController.onChangePersa,
					}).addStyleClass("L2P13Font") 
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("REQDP"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [ new sap.m.Select(oController.PAGEID + "_Orgeh", {
							width : "95%",
							change : oController.onChangeOrgeh,
						}).addStyleClass("L2P13Font"),
						]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		var oReqno = new sap.m.Input(oController.PAGEID + "_Reqno", {
			type : "Text",
			width : "95%",
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("REQNO"), required : true, labelFor : oReqno}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oReqno
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oTitle = new sap.m.Input(oController.PAGEID + "_Title", {
			width : "95%",
			valueStateText : "Required Field",
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("TITLE"), required : true, labelFor : oTitle}).addStyleClass("L2P13Font")]
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
		
		var oActda = new sap.m.DatePicker(oController.PAGEID + "_Actda", {
			width : "95%",
			value: dateFormat.format(curDate), 
			valueFormat : "yyyy-MM-dd",
        	displayFormat : gDtfmt,
        	change : oController.onChangeDate,
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ACTDA"), required : true, labelFor : oActda}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oActda
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oReqda = new sap.m.DatePicker(oController.PAGEID + "_Reqda", {
			width : "95%",
			value: dateFormat.format(curDate), 
			valueFormat : "yyyy-MM-dd",
        	displayFormat : gDtfmt,
        	change : oController.onChangeDate,
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("REQDA"), required : true, labelFor : oReqda}).addStyleClass("L2P13Font")]
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
		
		var oUnote = new sap.m.Input(oController.PAGEID + "_Notes", {
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
			expandable : false,
			expanded : false,
			backgroundDesign : "Transparent",
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://accounting-document-verification", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ACT_REQUEST"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Button(oController.PAGEID + "_Save_Btn",{
				        	   text: oBundleText.getText("SAVE_BTN"), 
				        	   icon : "sap-icon://save", 
				        	   press : oController.onPressSave
				           })]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oRequestLayout]
		}).addStyleClass("");
		
		var oListPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			backgroundDesign : "Transparent",
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://collaborate", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ACT_PERSONS"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer({width : "15px"}),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Apply.png"}),
				           new sap.m.Label({text : oBundleText.getText("STATUSC")}).addStyleClass("L2P13Font"),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Error.png"}),
				           new sap.m.Label({text : oBundleText.getText("STATUSE")}).addStyleClass("L2P13Font"),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Lock.png"}),
				           new sap.m.Label({text : oBundleText.getText("STATUSL")}).addStyleClass("L2P13Font"),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Radiation.png"}),
				           new sap.m.Label({text : oBundleText.getText("STATUSR")}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Button(oController.PAGEID + "_Add_Btn",{text: oBundleText.getText("ADD_BTN"), icon : "sap-icon://add", press : oController.addPerson}),
				           new sap.m.Button(oController.PAGEID + "_Mod_Btn",{text: oBundleText.getText("MODIFY_BTN"), icon : "sap-icon://edit", press : oController.modifyPerson, visible : false}),
				           new sap.m.Button(oController.PAGEID + "_Del_Btn",{text: oBundleText.getText("DELETE_BTN"), icon : "sap-icon://delete", press : oController.deletePerson, visible : false})]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActtionSubjectList", oController)]
		});
		
	
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oRequestPanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oListPanel
			           ]
		});
		
		var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
			contentLeft : [
			               new sap.m.Button(oController.PAGEID + "_Excel_Btn",{
			            	   text: oBundleText.getText("EXCEL_BTN"), 
			            	   visible : false,
			            	   press : oController.downloadExcel})
			              ],
			contentRight : [  
			                new sap.m.Button(oController.PAGEID + "_UPLOAD_BTN", {
		 	                	text : oBundleText.getText( "ACTION_UPLOAD_BTN"),
		 	                	press : oController.onPressUpload
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_REQUEST_BTN", {
		 	                	text : oBundleText.getText( "REQUEST_BTN"),
		 	                 	press : oController.onPressRequest
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_COMPLETE_BTN", {
				             	text : oBundleText.getText( "ACTION_COMPLETE_BTN"),
				             	press : oController.onPressComplete
				            }),
				            new sap.m.Button(oController.PAGEID + "_REQUESTDELETE_BTN", {
		 	                	text : oBundleText.getText( "REQUESTDELETE_BTN"),
		 	                	press : oController.onPressDelete
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
								contentMiddle : new sap.m.Text(oController.PAGEID + "_PAGE_TITLE", {
									   			text : oBundleText.getText( "TITLE_RETIRE_ACTREQ_REG")
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