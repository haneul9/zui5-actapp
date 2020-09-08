sap.ui.jsfragment("fragment.ActTimelinePopover", {
	
	createContent : function(oController) {
		
		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.Common");
		
		var tlItem = new sap.suite.ui.commons.TimelineItem(oController.PAGEID + "_AT_TimeItem", {
			dateTime : {path : "Datim", formatter : function(fVal) {
				if(fVal == null) return null;
				//return new Date(common.Common.setTime(new Date(fVal)));
				return new Date(fVal);
			} },
			userNameClickable : false,
			userName : "{Ename}",
			title : {path : "Reqst", formatter : function(fVal) {
				if(fVal == "10") return oBundleText.getText("MSG_ACTTIME_01");
				else if(fVal == "20") return oBundleText.getText("MSG_ACTTIME_02");
				else if(fVal == "30") return oBundleText.getText("MSG_ACTTIME_03");
				else if(fVal == "40") return oBundleText.getText("MSG_ACTTIME_04");
				else if(fVal == "50") return oBundleText.getText("MSG_ACTTIME_05");
				else if(fVal == "51") return oBundleText.getText("MSG_ACTTIME_06");
				else if(fVal == "52") return oBundleText.getText("MSG_ACTTIME_07");
			} },
			icon : {path : "Reqst", formatter : function(fVal) {
				if(fVal == "10") return "sap-icon://save";
				else if(fVal == "20") return "sap-icon://approvals";
				else if(fVal == "30") return "sap-icon://employee-approvals";
				else if(fVal == "40") return "sap-icon://reject";
				else if(fVal == "50") return "sap-icon://accept";
				else if(fVal == "51") return "sap-icon://notification-2";
				else if(fVal == "52") return "sap-icon://notification-2";
			} },
		}).addStyleClass("L2P13Font");
		
		var oTimeline = new sap.suite.ui.commons.Timeline(oController.PAGEID + "_AT_Timeline", {
			sortOldestFirst : true, 
			enableAllInFilterItem : false,
			showHeaderBar: false,
			growing : false,
			noDataText : ""
		});
		oTimeline.setModel(sap.ui.getCore().getModel("ZL2P01GW0001_SRV"));
		
//		var oLayout = new sap.ui.commons.layout.VerticalLayout({
//			width : "100%",
//			content : [ oTimeline ]
//		});
		
		var oLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 1
		});
		
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"400px"});
		
		var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : oTimeline
		}).addStyleClass("L2PBackgroundWhite");
		
		oRow.addCell(oCell);
		oLayout.addRow(oRow);
	
		var oPopover = new sap.m.Popover(oController.PAGEID + "_AT_Popover", {
			title : oBundleText.getText("TITLE_PROCESS_STATUS"),
			placement : sap.m.PlacementType.Auto,
			content : oLayout,
			contentWidth : "450px",
			//contentHeight : "400px",
			beforeOpen : oController.onBeforeOpenPopoverActTimeline,
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
