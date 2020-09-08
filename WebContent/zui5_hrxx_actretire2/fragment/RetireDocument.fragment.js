sap.ui.jsfragment("zui5_hrxx_actretire2.fragment.RetireDocument", {
	
	createContent : function(oController) {
		
		var oRow, oCell;
		
		var oRetdaLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_RetdaLayout",{
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
		oCell1_1 = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_RC_Retda_Lab",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("FIX_RETDA")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		
		oCell1_2 = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_RC_Retda_Cel",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.DatePicker(oController.PAGEID + "_RC_Retda", {
							width : "95%",
							valueFormat : "yyyy-MM-dd",
				        	displayFormat : gDtfmt,
				        	change : oController.onChangeDate
					   }).addStyleClass("L2P13Font"),
					   new sap.m.Text(oController.PAGEID + "_RC_Retda_Text", {
							text : "",
							visible : false
					   }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		
		oCell2_1 = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_RC_Hndno_Lab",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("HNDNO")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		
		oCell2_2 = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_RC_Hndno_Cel",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Input(oController.PAGEID + "_RC_Hndno", {
							width : "95%",
					   }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		
		oCell3_1 = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_RC_Email_Lab",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("EMAIL")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		
		oCell3_2 = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_RC_Email_Cel",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Input(oController.PAGEID + "_RC_Email", {
					   		width : "95%",
					   }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		
		oCell4_1 = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_RC_Bankn_Lab",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("RETIRE_BANK_INFO")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		
		oCell4_2 = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_RC_Bankn_Cel",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Toolbar({
						width : "100%",
						content : [new sap.m.Input(oController.PAGEID + "_RC_Bankn", {
									width : "40%",
								   }).addStyleClass("L2P13Font"),
								   new sap.m.ToolbarSpacer({width: "4%"}),
								   new sap.m.Input(oController.PAGEID + "_RC_Irpno", {
										width : "50%",
								   }).addStyleClass("L2P13Font")]
					   }).addStyleClass("L2PToolbarNoBottomLine")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		
		oCell5_1 = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_RC_Addre_Lab",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ADDRS")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		
		oCell5_2 = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_RC_Addre_Cel",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 3,
			content : [new sap.m.Input(oController.PAGEID + "_RC_Addre", {
					   		width : "95%",
					   }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		
		oCell6_1 = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_RC_Aus_Lab",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("PAY_STATUS")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		
		oCell6_2 = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_RC_Aus_Cel",{
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 3,
			content : [new sap.m.Input(oController.PAGEID + "_RC_Aus", {
						width : "95%",
						showValueHelp: true,
						valueHelpRequest: oController.displayAusSearchDialog
						}).addCustomData(new sap.ui.core.CustomData({
							key : "Ecode",
							value : ""
					  }))]	  
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		
		var oRetdaPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://calendar", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("TITLE_PANEL_RETIRE_DOC_INFO"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oRetdaLayout]
		}); 
		
		var oDocumentLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_DocumentUploadLayout", {
			width : "100%",
			layoutFixed : false,
			columns : 2,
			widths: ["15%","85%"],
		});
		
		var oDocumentPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : oBundleText.getText("PANEL_RETIRE_DOCUMENT"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oDocumentLayout]
		}); 
		
		var oDocumentDownloadLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_DocumentDownloadLayout", {
			width : "100%",
			layoutFixed : false,
			columns : 2,
			widths: ["15%","85%"],
		});
		
		var oDocumentDownloadPanel = new sap.m.Panel(oController.PAGEID + "_DocDownloadPanel",{
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : oBundleText.getText("PANEL_RETIRE_DOCUMENT_DOWNLOAD"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
			           oDocumentDownloadLayout]
		});
		
		var oDocumentReferenceLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_DocumentReferenceLayout", {
			width : "100%",
			layoutFixed : false,
			columns : 1,
			widths: ["100%"],
		});
		
		var oDocumentReferencePanel = new sap.m.Panel(oController.PAGEID + "_DocumentReferencePanel", {
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://comment", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("REFERENCE"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oDocumentReferenceLayout]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_RetireDocument_LAYOUT",  {
			width : "100%",
			content : [ oRetdaPanel,
			            new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
			            oDocumentPanel,
			            new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
			            oDocumentDownloadPanel,
			            new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
			            oDocumentReferencePanel,
			           ]
		});

		return oLayout;
	}

});