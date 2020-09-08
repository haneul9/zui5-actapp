sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.EmployeeProfileBase", {
	
	createContent : function(oController) {
		
       var oRow, oCell;
       var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 6,
			widths : ['16.7%','16.6%','16.7%','16.6%','16.7%','16.7%'],
			layoutFixed : true,
			width : "100%"
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2206"), required : false}).addStyleClass("FontFamilyBold")	// 2206:채용구분
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Zzhircdt}"}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1968"), required : false}).addStyleClass("FontFamilyBold")	// 1968:영문명
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Enname}"}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2693")}).addStyleClass("FontFamilyBold")	// 2693:이전 사원번호
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :new sap.m.Text({text : "{Pnalt}"}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2256"), required : false}).addStyleClass("FontFamilyBold")	// 2256:코스트센터
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Kostltx}"}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2013"), required : false}).addStyleClass("FontFamilyBold")	// 2013:이니셜
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Rufnm}"}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1910")}).addStyleClass("FontFamilyBold")	// 1910:실 근무사업장
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :new sap.m.Text({text : "{Btext}"}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0010")}).addStyleClass("FontFamilyBold")	// 10:근무직
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Wrkjobt}"}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0006")}).addStyleClass("FontFamilyBold")	// 6:근무일정
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Rtext}"}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : ""}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :new sap.m.Text({text : ""}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		
		var oARow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ARow",{height:"30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2279"), required : false}).addStyleClass("FontFamilyBold")	// 2279:퇴직예정일
		}).addStyleClass("MatrixLabel");
		oARow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Retdueda}"}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oARow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2280"), required : false}).addStyleClass("FontFamilyBold")	// 2280:퇴직일
		}).addStyleClass("MatrixLabel");
		oARow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "{Retda}"}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oARow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2278")}).addStyleClass("FontFamilyBold")	// 2278:퇴직사유
		}).addStyleClass("MatrixLabel");
		oARow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :new sap.m.Text({text : "{Retrsn}"}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
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