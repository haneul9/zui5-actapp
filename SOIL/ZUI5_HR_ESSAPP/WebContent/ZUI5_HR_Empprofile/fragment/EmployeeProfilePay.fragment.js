sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.EmployeeProfilePay", {
	
	createContent : function(oController) {
		
       var oRow, oCell;
       var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0598"), required : false}).addStyleClass("FontFamilyBold")	// 598:급여계좌
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :new sap.m.Text({text : "{Acctno1}"}).addStyleClass("FontFamily"),
			colSpan : 3
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		
		oMatrix.addStyleClass("sapUiSizeCompact");
		oMatrix.bindElement("/Data/0");
		
		return oMatrix;
	}

});