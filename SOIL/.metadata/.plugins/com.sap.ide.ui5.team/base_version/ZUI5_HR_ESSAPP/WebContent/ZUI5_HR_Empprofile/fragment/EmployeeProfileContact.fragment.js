sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.EmployeeProfileContact", {
	
	createContent : function(oController) {
		
       var oRow, oCell;
       var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 6,
			widths : ['140px','','140px','','140px','']
		});
       
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1809")}).addStyleClass("FontFamilyBold")	// 1809:사내전화
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Value01}"}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2377")}).addStyleClass("FontFamilyBold")	// 2377:휴대폰번호
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Value02}"}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2194")}).addStyleClass("FontFamilyBold")	// 2194:집전화번호
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :new sap.m.Text({text : "{Value03}"}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2295")}).addStyleClass("FontFamilyBold")	// 2295:팩스번호
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Value04}"}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1803"), required : false}).addStyleClass("FontFamilyBold")	// 1803:비상연락망
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Value05}"}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2346")}).addStyleClass("FontFamilyBold")	// 2346:회사 e-mail 주소
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :new sap.m.Text({text : "{Value06}"}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oMatrix.addStyleClass("sapUiSizeCompact");
		oMatrix.bindElement("/Data");
		
		return oMatrix;
	}

});