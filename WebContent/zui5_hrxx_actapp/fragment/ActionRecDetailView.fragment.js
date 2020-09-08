sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActionRecDetailView", {
	
	createContent : function(oController) {
		
		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.GoogleMap");
		
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
        var oLayout = new sap.ui.commons.layout.VerticalLayout();
        
        var oIssuedDateMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_AD_IssuedDate", {
			width : "100%",
			layoutFixed : true,
			columns : 2,
			widths: ["26%", "74%"],
		});
        
        var oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text : oBundleText.getText( "ACTDA")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Text(oController.PAGEID + "_AD_Actda", { width : "200px", textAlign : "Left" }).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oIssuedDateMatrix.addRow(oRow);
		
		var oIssuedDatePanel = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [ //new sap.ui.core.Icon({src : "sap-icon://calendar", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText( "ACTDA"), design : "Bold", width: "95px"}).addStyleClass("L2P13Font"),
//				           new sap.m.ToolbarSpacer({width : "20px"}),
//				           new sap.m.Text(oController.PAGEID + "_AD_Actda", { width : "200px", textAlign : "Center" }).addStyleClass("L2P13Font")
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [ oIssuedDateMatrix]
		});
		
		oLayout.addContent(oIssuedDatePanel);
		
		var oIssuedTypeMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_AD_IssuedTyp", {
			width : "100%",
			layoutFixed : true,
			columns : 2,
			widths: ["15%", "85%"],
		});
		
		var oActTypeReasonPanel = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [//new sap.ui.core.Icon({src : "sap-icon://accounting-document-verification", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ACT_TYPE_REASON"), design : "Bold"}).addStyleClass("L2P13Font")				           
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oIssuedTypeMatrix]
		});
		
		oLayout.addContent(oActTypeReasonPanel);
		
		var oActDetailMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_AD_MatrixLayout", {
			width : "100%",
			layoutFixed : true,
			columns : 4,
			widths: ["15%", "35%", "15%", "35%"],
		});
		
		var oActHistoryPanel = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [//new sap.ui.core.Icon({src : "sap-icon://expense-report", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ACT_INFO"), design : "Bold"}).addStyleClass("L2P13Font")				           
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oActDetailMatrix]
		});
		
		oLayout.addContent(oActHistoryPanel);
		
		var oMapLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_MapLayout", {width: "100%"}).addStyleClass("L2PGoogleMap");
//		oMapLayout.addDelegate({
//			onAfterRendering:function(){						
//				common.GoogleMap.createMap(oController.PAGEID);
//			}
//		});
		
		var oMapPanel = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [//new sap.ui.core.Icon({src : "sap-icon://map-2", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("WORKPLACE"), design : "Bold"}).addStyleClass("L2P13Font")				           
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oMapLayout]
		});
		
		oLayout.addContent(oMapPanel);
		
		var oPopover = new sap.m.Popover({
			title : oBundleText.getText("TITLE_ACT_PERSEON_DETAIL"),
			placement : sap.m.PlacementType.Auto,
			content : oLayout,
			contentWidth : "1000px",
			contentHeight : "1000px",
			afterOpen : oController.onAfterOpenPopover ,
			endButton : new sap.m.Button({
							icon : "sap-icon://sys-cancel-2",
							press : function(oEvent) {
								oEvent.getSource().getParent().getParent().close();
							}})
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oPopover.addStyleClass("sapUiSizeCompact");
	    };

		return oPopover;
	}

});
