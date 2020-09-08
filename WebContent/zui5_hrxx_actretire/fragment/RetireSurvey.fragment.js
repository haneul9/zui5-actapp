sap.ui.jsfragment("zui5_hrxx_actretire.fragment.RetireSurvey", {
	
	createContent : function(oController) {
		
		var oCell = null, oRow = null;
		
		var oSurveyNoticeLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 1,
		});
		
		for(var i=0; i<4; i++) {
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text: oBundleText.getText("SURVEY_NOTICE_" + (i+1))}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PPaddingLeft30");
			oSurveyNoticeLayout.createRow(oCell);
		}
		
		var oSurveyNoticePanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://survey", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("PANEL_RETIRE_SURVEY_NOTICE"), design : "Bold"}).addStyleClass("L2P13Font"),
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oSurveyNoticeLayout]
		});
		
		var oSurveyDownloadLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_SurveyDownloadLayout", {
			width : "100%",
			layoutFixed : false,
			columns : 2,
			widths: ["15%","85%"],
		});
		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text: "● "}).addStyleClass("L2P13Font"),
//			           new sap.m.Link({text: "퇴직설문.docx"}).addStyleClass("L2P13Font")]
//		}).addStyleClass("L2PPaddingLeft30");
//		oSurveyDownloadLayout.createRow(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text: "● "}).addStyleClass("L2P13Font"),
//			           new sap.m.Link({text: "RetirementSurvey.docx"}).addStyleClass("L2P13Font")]
//		}).addStyleClass("L2PPaddingLeft30");
//		oSurveyDownloadLayout.createRow(oCell);		
		
		var oSurveyDownloadPanel = new sap.m.Panel(oController.PAGEID + "_SurveyDownloadPanel",{
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://download", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("PANEL_RETIRE_SURVEY_DOWNLOAD"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oSurveyDownloadLayout]
		});
		
		var oSurveyFinishedPanel = new sap.m.Panel(oController.PAGEID + "_RetireSurveyFinished_PANEL", {
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://status-completed", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("PANEL_RETIRE_SURVEY_FINISHED"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.Label(oController.PAGEID + "_RetireSurveyFinished_Date", {text : "2015.04.23 10:23:43", design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : []
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_RetireSurvey_LAYOUT",  {
			width : "100%",
			content : [ oSurveyFinishedPanel,
			            new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
			            oSurveyNoticePanel,
			            new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
			            oSurveyDownloadPanel]
		});

		return oLayout;
	}

});