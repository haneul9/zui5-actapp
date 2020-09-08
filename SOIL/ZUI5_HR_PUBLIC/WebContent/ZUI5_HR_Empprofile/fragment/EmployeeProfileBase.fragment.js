sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.EmployeeProfileBase", {
	
	createContent : function(oController) {
		
       var oRow, oCell;
       var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 6,
			widths : ['','','','','','']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Center",
			content : new sap.m.Label({text : "채용구분", required : false}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Zzhircdt}"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Center",
			content : new sap.m.Label({text : "영문명", required : false}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Enname}"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Center",
			content : new sap.m.Label({text : "국적"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :new sap.m.Text({text : "{Nattx}"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Center",
			content : new sap.m.Label({text : "코스트센터", required : false}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Kostltx}"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Center",
			content : new sap.m.Label({text : "이니셜", required : false}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Rufnm}"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Center",
			content : new sap.m.Label({text : "실 근무사업장"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :new sap.m.Text({text : "{Btext}"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		var oARow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ARow",{});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Center",
			content : new sap.m.Label({text : "퇴직예정일", required : false}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oARow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Retdueda}"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oARow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Center",
			content : new sap.m.Label({text : "퇴직일", required : false}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oARow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Retda}"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oARow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Center",
			content : new sap.m.Label({text : "퇴직사유"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oARow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :new sap.m.Text({text : "{Retrsn}"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oARow.addCell(oCell);
		oMatrix.addRow(oARow);
		
		oMatrix.addStyleClass("sapUiSizeCompact");
		oMatrix.bindElement("/Data");
		
		oMatrix.addEventDelegate({
			onAfterRendering : function(){
				if(_gAuth == "H"){
					oARow.removeStyleClass("L2PDisplayNone");
				}else{
					oARow.addStyleClass("L2PDisplayNone");
				}
			}
		});
		
		return oMatrix;
	}

});