sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActionDetailView", {
	
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
			widths: ["26%", "74%"],
		});
		
		var oActTypeReasonPanel = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [ //new sap.ui.core.Icon({src : "sap-icon://accounting-document-verification", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ACT_TYPE_REASON"), design : "Bold"}).addStyleClass("L2P13Font")				           
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oIssuedTypeMatrix]
		});
		
		oLayout.addContent(oActTypeReasonPanel);
		
		var oActDetailMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_AD_MatrixLayout", {
			width : "100%",
			layoutFixed : true,
			columns : 3,
			widths: ["26%", "37%", "37%"],
		});
		
//		var oCell, oRow;
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text : oBundleText.getText("ACTITEMS")}).addStyleClass("L2P13Font")]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
//		oRow.addCell(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text : oBundleText.getText("AACTDATAS")}).addStyleClass("L2P13Font")]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
//		oRow.addCell(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text : oBundleText.getText("BACTDATAS")}).addStyleClass("L2P13Font")]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
//		oRow.addCell(oCell);
//		
//		oActDetailMatrix.addRow(oRow);
//		
//		var vControls = [{id : "Wertx", label : oBundleText.getText("PBTXT"), control : "select"},
//		                 {id : "Btrtx", label : oBundleText.getText("BTRTX"), control : "select"},
//		                 {id : "Fulln", label : oBundleText.getText("FULLN"), control : "input"},
//		                 {id : "Zzempwptx", label : oBundleText.getText("ZZEMPWPTX"), control : "select"},
//		                 {id : "Stetx", label : oBundleText.getText("STETX"), control : "input"},
//		                 {id : "Zzdcmcgtx", label : oBundleText.getText("ZZDCMCGTX"), control : "select"},
//		                 {id : "Pgtxt", label : oBundleText.getText("PGTXT"), control : "select"},
//		                 {id : "Pktxt", label : oBundleText.getText("PKTXT"), control : "select"},
//		                 {id : "Zzjobgrtx", label : oBundleText.getText("ZZJOBGRTX"), control : "select"},
//		                 {id : "Zzjobsrtx", label : oBundleText.getText("ZZJOBSRTX"), control : "select"},
//		                 {id : "Zzcaltltx", label : oBundleText.getText("ZZCALTLTX"), control : "select"},
//		                 {id : "Zzmaltltx", label : oBundleText.getText("ZZMALTLTX"), control : "select"},
//		                 {id : "Zzpsgrptx", label : oBundleText.getText("ZZPSGRPTX"), control : "select"},
//		                 {id : "Zzrollvtx", label : oBundleText.getText("ZZROLLVTX"), control : "select"},
//		                 {id : "Zzjobcltx", label : oBundleText.getText("ZZJOBCLTX"), control : "select"},
//		                 {id : "Zzemptytx", label : oBundleText.getText("ZZEMPTYTX"), control : "select"},
//		                 {id : "Zzprdcttx", label : oBundleText.getText("ZZPRDCTTX"), control : "select"},
//		                 {id : "Zzprdartx", label : oBundleText.getText("ZZPRDARTX"), control : "select"},
//		                 {id : "StellSubtx", label : oBundleText.getText("STELLSUBTX"), control : "select"}, //부직무
//		                 {id : "Zzautyptx", label : oBundleText.getText("ZZAUTYPTX"), control : "select"}, //권한그룹
//		                 {id : "Zzlotaxtx", label : oBundleText.getText("ZZLOTAXTX"), control : "select"}, //지방세남부기준
//		                 {id : "Zzdirectx", label : oBundleText.getText("ZZDIRECTX"), control : "select"}, //직/간접 구분
//		                 {id : "Zzcalpgtx", label : oBundleText.getText("ZZCALPGTX"), control : "select"},
//		                ];
//		
//		for(var i=0; i<vControls.length; i++) {
//			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//			
//			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//				hAlign : sap.ui.commons.layout.HAlign.Begin,
//				vAlign : sap.ui.commons.layout.VAlign.Middle,
//				content : [new sap.m.Label({text : vControls[i].label}).addStyleClass("L2P13Font")]
//			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
//			oRow.addCell(oCell);
//			
//			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//				hAlign : sap.ui.commons.layout.HAlign.Begin,
//				vAlign : sap.ui.commons.layout.VAlign.Middle,
//				content : new sap.m.Text(oController.PAGEID + "_After_" + vControls[i].id, {}).addStyleClass("L2P13Font")
//			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//			oRow.addCell(oCell);
//			
//			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//				hAlign : sap.ui.commons.layout.HAlign.Begin,
//				vAlign : sap.ui.commons.layout.VAlign.Middle,
//				content : new sap.m.Text(oController.PAGEID + "_Before_" + vControls[i].id, {}).addStyleClass("L2P13Font")
//			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//			oRow.addCell(oCell);
//			
//			oActDetailMatrix.addRow(oRow);
//		}
		
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
			//height : "400px",
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [//new sap.ui.core.Icon({src : "sap-icon://map-2", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("WPMOVE"), design : "Bold"}).addStyleClass("L2P13Font")				           
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
