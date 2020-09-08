sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.EmployeeProfilePay", {
	
	createContent : function(oController) {
		
       var oRow, oCell;
       var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Center",
			content : new sap.m.Label({text : "급여계좌", required : false}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :new sap.m.Text({text : "{Acctno1}"}).addStyleClass("L2PFontFamily"),
			colSpan : 3
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		
		oMatrix.addStyleClass("sapUiSizeCompact");
		oMatrix.bindElement("/Data/0");
		
		return oMatrix;
	}

});