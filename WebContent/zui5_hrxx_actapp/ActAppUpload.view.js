sap.ui.jsview("zui5_hrxx_actapp.ActAppUpload", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actapp.ActAppUpload
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp.ActAppUpload";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actapp.ActAppUpload
	*/ 
	createContent : function(oController) {
		
		var icon1 = "/sap/bc/ui5_ui5/sap/zhrxx_common/images/OK.png";
		var icon2 = "/sap/bc/ui5_ui5/sap/zhrxx_common/images/No-entry.png";
		
		var oCell1, oRow1;
		
		var oIssuedTypeMatrix = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : true,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
		for(var i=0; i<5; i++) {
			oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text : oBundleText.getText( "MASSN" + (i+1))})]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           new sap.m.Select(oController.PAGEID + "_Massn" + (i+1), {
				        	   width : "95%",
				        	   change : oController.onChangeMassn
				           })
				           ]
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text : oBundleText.getText("MASSG" + (i+1))})]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           new sap.m.Select(oController.PAGEID + "_Massg" + (i+1), {
				        	   width : "95%",
				        	   enabled : false,
				        	   change : oController.onChangeMassg
				           })
				           ]
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow1.addCell(oCell1);
			
			oIssuedTypeMatrix.addRow(oRow1);
		}
		
		var oActTypeReasonPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : oBundleText.getText("ACT_TYPE_REASON"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Switch(oController.PAGEID + "_Input_Switch", {visible : true, enabled : false, change : oController.onChangeSwitch})
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oIssuedTypeMatrix]
		});
		
		var oIBSheetLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_oIBSheetLayout",  {
			width : "100%",
			content : new sap.ui.core.HTML({content : "<div id='" + oController.PAGEID + "_IBSHEET1'></div>", preferDOM : false}) 
		});
		
		var oActdHistoryPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : oBundleText.getText("TITLE_ACT_PERSONS"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer({width: "5px"}),
				           new sap.m.Label({text : "("}).addStyleClass("L2P13Font L2PLabelMinWidth"),
				           new sap.m.Image({src : icon1, height: "16px", width : "16px"}),
				           new sap.m.Label({text : "Ready,"}).addStyleClass("L2P13Font"),
				           new sap.m.Image({src : icon2, height: "16px", width : "16px"}),
				           new sap.m.Label({text : "Error, * " + oBundleText.getText("LABEL_MANDANTORY") + " )"}).addStyleClass("L2P13Font"),
				           new sap.m.Label({text : " " + oBundleText.getText("MSG_ACT_UPLOAD_NOTICE")}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Button(oController.PAGEID + "_EXCEL_DOWNLOAD_BTN",{
				        	    icon : "sap-icon://download",
		 	                	text : oBundleText.getText( "EXCEL_DOWNLOAD_BTN"),
		 	                	press : oController.onPressDownload
		 	               }),
				           new sap.m.Button(oController.PAGEID + "_EXCEL_UPLOAD_BTN",{
				        	    icon : "sap-icon://upload",
		 	                	text : oBundleText.getText( "EXCEL_UPLOAD_BTN"),
		 	                	press : oController.onPressUpload
		 	               }),
				           new sap.m.ToolbarSpacer({width: "10px"}),				           
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oIBSheetLayout]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ //new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oActTypeReasonPanel,
			            oActdHistoryPanel
			           ]
		});
		
		var oFooterBar = new sap.m.Bar({
		 	contentRight : [         
		 	                new sap.m.Button(oController.PAGEID + "_SAVE_BTN", {
		 	                	text : oBundleText.getText( "SAVE_BTN"),
		 	                	press : oController.onPressSave
		 	                }),
		 	                new sap.m.Button({
		 	                	text : oBundleText.getText( "CANCEL_BTN"),
		 	                	press : oController.navToBack
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
								contentMiddle : new sap.m.Text(oController.PAGEID + "_PAGETITLE", {
									   			text : oBundleText.getText( "ACTION_UPLOAD_BTN")
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