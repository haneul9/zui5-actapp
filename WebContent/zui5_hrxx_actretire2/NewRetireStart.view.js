sap.ui.jsview("zui5_hrxx_actretire2.NewRetireStart", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actretire2.NewRetireStart
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actretire2.NewRetireStart";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actretire2.NewRetireStart
	*/ 
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		
		var oCell = null, oRow = null;
		
		var oRetireManLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ENAME"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Input(oController.PAGEID + "_Pernr", {
						width: "100%",
						showValueHelp: true,
						valueHelpOnly : true,
						valueHelpRequest: oController.displaySearchUserDialog
					   }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ZZCALPSG")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Text(oController.PAGEID + "_CalPsg", {text: ""}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRetireManLayout.addRow(oRow);
		
		//두번째 라인
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("PERSG_PERSK")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Text(oController.PAGEID + "_Persg_Persk", {text: ""}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("STEXT")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Text(oController.PAGEID + "_Stext", {text: ""}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRetireManLayout.addRow(oRow);
		
		//세번째 라인
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SCHE_RETDA"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.DatePicker(oController.PAGEID + "_Retda", {
				width : "100%",
				value: dateFormat.format(curDate), 
				valueFormat : "yyyy-MM-dd",
	        	displayFormat : gDtfmt,
	        	change : oController.onChangeDate
			}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ENTDA")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Text(oController.PAGEID + "_Entda", {text: ""}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRetireManLayout.addRow(oRow);
		
		var oRetireManPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://family-care", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("PANEL_RETIRE_TARGET"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oRetireManLayout]
		});
		
		var oRetireOptionLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_RetireOptionLayout",{
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Label_Massg",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("RETRS"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Input_Massg",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Input(oController.PAGEID + "_Massg", {
							width : "100%",
							showValueHelp: true,
							liveChange : oController.onLiveChange,
							valueHelpRequest: oController.displayCodeSearchDialog
					   }).addCustomData(new sap.ui.core.CustomData({
							key : "RETRS",
							value : ""
						}))]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Label_Reexp",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("REEXP")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Input_Reexp",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.CheckBox(oController.PAGEID + "_Reexp", {text: "", selected : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRetireOptionLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Label_Stpnr",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("RETIRE_AD_AGENT")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Input_Stpnr",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Input(oController.PAGEID + "_Stpnr", {
				width: "100%",
				showValueHelp: true,
				valueHelpRequest: oController.displaySearchUserDialog
			   }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Label_Seexp",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SEEXP")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_Input_Seexp",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.CheckBox(oController.PAGEID + "_Seexp", {text: "", selected : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRetireOptionLayout.addRow(oRow);	
		
		var ooRetireOptionPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://process", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("PANEL_RETIRE_PROCESS"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oRetireOptionLayout]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oRetireManPanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            ooRetireOptionPanel
			           ]
		});
		
		var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
			contentRight : [         
		 	                new sap.m.Button(oController.PAGEID + "_RETIRE_START_BTN", {
				             	text : oBundleText.getText("TITLE_RETIRE_START"),
				             	press : oController.onPressRetireStart
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
								contentMiddle : new sap.m.Text(oController.PAGEID + "_TITLE", {
									   			text : oBundleText.getText( "TITLE_RERIRE_NEW_PROCESS")
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible : false ,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeaderBar") ,
			footer : oFooterBar 
		}) ;
		
		return oPage ;
	}

});