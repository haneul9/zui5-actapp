sap.ui.jsfragment("ZUI5_HR_ApprovalBox.fragment.SgnstepPopover", {
	
	createContent : function(oController) {
		var oRow, oCell;	
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			width : "950px",
			columns : 1,
			width : "100%"
		});
		
		
		
		var oTimeLine = new sap.suite.ui.commons.Timeline(oController.PAGEID + "_TimeLine",{
			textHeight : "automatic",
			showHeaderBar : false,
			sort : false
		});
		
		oTimeLine.bindAggregation("content",{
			path: "/Data",
			template: new sap.suite.ui.commons.TimelineItem({
				dateTime: "{dateTime}",
				text: "{text}",
				userName: "{ZappEname}",
				title: "{ZappStatx}",
				userPicture : "{Photo}",
				icon: "{icon}"
			})
		});
		oTimeLine.setModel(new sap.ui.model.json.JSONModel());
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oTimeLine
		});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		var oPopover = new sap.m.Popover(oController.PAGEID + "_Popover", {
			title : "Approval Line",
			placement : sap.m.PlacementType.Auto,
			content : oMatrix,
			contentWidth : "500px",
		});
		
//		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oPopover.addStyleClass("sapUiSizeCompact");
//	    };

		return oPopover;
	}

});
