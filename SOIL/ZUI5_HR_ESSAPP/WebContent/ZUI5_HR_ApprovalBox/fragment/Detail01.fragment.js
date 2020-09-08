sap.ui.jsfragment("ZUI5_HR_ApprovalBox.fragment.Detail01", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		
		var oRow, oCell;
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["10px", "", "5px"]
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"});
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "35px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();	
		oRow.addCell(oCell);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({colSpan : 3}).addStyleClass("borderTop");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();	
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [new sap.tnt.NavigationList(oController.PAGEID + "_NavigationList", {
							width : "100%",
							items : [new sap.tnt.NavigationListItem(oController.PAGEID + "_ZreqForm1", {
										text : "Work to do",
										icon : "sap-icon://write-new",
										key : "1",
								     }),
								     new sap.tnt.NavigationListItem(oController.PAGEID + "_ZreqForm2", {
										text : "Work completed",
										icon : "sap-icon://complete",
										key : "2",
									 }),
								   ]
					   })],
			hAlign : "Center",
			vAlign : "Top"
		});	
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);		
		
		
		var oScrollContainer = new sap.m.ScrollContainer(oController.PAGEID + "_Detail1", {
			width : "100%",
			horizontal : false,
			vertical : true,
			height : (window.innerHeight - 117) + "px",
			content : [oMatrix]
		});
		
		return oScrollContainer;
		
	}
});
