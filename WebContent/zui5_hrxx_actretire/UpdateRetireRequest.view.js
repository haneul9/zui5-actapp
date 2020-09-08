sap.ui.jsview("zui5_hrxx_actretire.UpdateRetireRequest", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actretire.UpdateRetireRequest
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actretire.UpdateRetireRequest";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actretire.UpdateRetireRequest
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
			content : [new sap.m.Label({text: oBundleText.getText("ENAME")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Text(oController.PAGEID + "_Ename", {text : ""}).addStyleClass("L2P13Font")]
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
			content : [new sap.m.Label(oController.PAGEID + "_SchRetda", {text: oBundleText.getText("SCHE_RETDA"), required : true}).addStyleClass("L2P13Font")]
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
					   }).addStyleClass("L2P13Font"),
					   new sap.m.Text(oController.PAGEID + "_Retda_Text", {
							text : "",
							visible : false
					   }).addStyleClass("L2P13Font"),
						]
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
		
		var oIConFilter1 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_1",{
			key : "00",
			icon : "sap-icon://notification",
			iconColor : "Critical",
			design : sap.m.IconTabFilterDesign.Horizontal,
			text : oBundleText.getText("RETIRE_OVERVIEW"),
			content : sap.ui.jsfragment("zui5_hrxx_actretire.fragment.Overview", oController)
		});
		
		var oIConFilter2 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_2",{
			key : "10",
			icon : "sap-icon://manager",
			iconColor : "Critical",
			design : sap.m.IconTabFilterDesign.Horizontal,
			text : oBundleText.getText("RETIRE_HASS_STATUS1"),
			content : sap.ui.jsfragment("zui5_hrxx_actretire.fragment.ChiefFaceToFace", oController)			
		});
	
		var oIConFilter3 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_3", {
			key : "30",
			icon : "sap-icon://request",
			iconColor : "Critical",
			design : sap.m.IconTabFilterDesign.Horizontal,
			text : oBundleText.getText("RETIRE_HASS_STATUS2"),
			content : sap.ui.jsfragment("zui5_hrxx_actretire.fragment.RetireSurvey", oController)
		});
		
		var oIConFilter4 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_4",{
			key : "20",
			icon : "sap-icon://family-care",
			iconColor : "Critical",
			design : sap.m.IconTabFilterDesign.Horizontal,
			text : oBundleText.getText("RETIRE_HASS_STATUS3"),
			content : sap.ui.jsfragment("zui5_hrxx_actretire.fragment.HRFaceToFace", oController)
		});
		
		var oIConFilter5 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_5",{
			key : "60",
			icon : "sap-icon://receipt",
			iconColor : "Critical",
			design : sap.m.IconTabFilterDesign.Horizontal,
			text : oBundleText.getText("RETIRE_HASS_STATUS4"),
			content : sap.ui.jsfragment("zui5_hrxx_actretire.fragment.RetireCheck", oController)
		});
		
		var oIConFilter6 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_6",{
			key : "80",
			icon : "sap-icon://decision",
			iconColor : "Critical",
			design : sap.m.IconTabFilterDesign.Horizontal,
			text : oBundleText.getText("RETIRE_HASS_STATUS6"),
			content : sap.ui.jsfragment("zui5_hrxx_actretire.fragment.RetireDocument", oController)
		});
		
		var oIConBar = new sap.m.IconTabBar(oController.PAGEID + "_ICONBAR",{
			items : [ oIConFilter1, new sap.m.IconTabSeparator({icon : "sap-icon://process"}),
			          oIConFilter2, 
			          oIConFilter3, 
			          oIConFilter4, 
			          oIConFilter5, new sap.m.IconTabSeparator({icon : "sap-icon://process"}),
			          oIConFilter6,],
			select : oController.handleIconTabBarSelect ,
			selectedKey : "00"
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oRetireManPanel,
			            oIConBar
			           ]
		});
		
		var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", { //
			contentRight : [         
		 	                new sap.m.Button(oController.PAGEID + "_SAVE_BTN", {
				             	text : oBundleText.getText( "SAVE_BTN"),
				             	press : oController.onPressSave
				            }),
				            new sap.m.Button(oController.PAGEID + "_SURVEY_START_BTN", {
				             	text : oBundleText.getText( "SURVEY_START_BTN"),
				             	type : sap.m.ButtonType.Reject,
				             	press : oController.onPressSurveyStart
				            }),
				            new sap.m.Button(oController.PAGEID + "_SURVEY_VIEW_BTN", {
				             	text : oBundleText.getText( "SURVEY_VIEW_BTN"),
				             	press : oController.onPressSurveyView
				            }),
				            new sap.m.Button(oController.PAGEID + "_CHECK_REQUEST_BTN", {
				             	text : oBundleText.getText( "CHECK_REQUEST_BTN"),
				             	press : oController.onPressCheckRequest
				            }),
				            new sap.m.Button(oController.PAGEID + "_CHECK_PRINT_BTN", {
				             	text : oBundleText.getText( "CHECK_PRINT_BTN"),
				             	press : oController.onPressCheckPrint
				            }),
				            new sap.m.Button(oController.PAGEID + "_RETIRE_DOC_BTN", {
				             	text : oBundleText.getText( "RETIRE_DOC_BTN"),
				             	press : oController.onPressDocUpload
				            }), 
		 	                new sap.m.Button(oController.PAGEID + "_REQUEST_BTN", {
		 	                	text : oBundleText.getText( "REQUEST_BTN"),
		 	                	press : oController.onPressRequest
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_PREVIEW_BTN", {
		 	                	text : oBundleText.getText( "PREVIEW_BTN"),
		 	                	press : oController.onPressPreview
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
								contentMiddle : new sap.m.Text(oController.PAGEID + "_TITLE", {
									   			text : oBundleText.getText( "PANEL_RETIRE_PROCESS")
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark",
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeaderBar") ,
			footer : oFooterBar 
		}) ;
		
		return oPage ;
	}

});