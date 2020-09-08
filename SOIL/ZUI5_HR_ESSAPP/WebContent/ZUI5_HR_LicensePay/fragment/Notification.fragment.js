sap.ui.jsfragment("ZUI5_HR_LicensePay.fragment.Notification", {
	
	createContent : function(oController) {
		var oRow, oCell;
		
		// 신청안내 
		var oNoticeMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			widths : ['60px','',]
		}).addStyleClass("L2PMatrixData"); 
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.core.Icon({
				src : "sap-icon://notification",
				size : "25px"
	       }),
	       rowSpan : 6 ,
	       vAlign : "Top"
		
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
		    	   text : oBundleText.getText("LABEL_1330"),	// 1330:1.  자격선임 신청
	       }).addStyleClass("L2PFontFamily"),
		});
		oRow.addCell(oCell);
		oNoticeMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
		    	   text : oBundleText.getText("LABEL_1344"),	// 1344:- 자격선임유형, 자격면허 등급에 따라 자격수당 금액은 자동 결정됩니다.
	       }).addStyleClass("L2PFontFamily L2PPaddingLeft10"),
		});
		oRow.addCell(oCell);
		oNoticeMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
		    	   text : oBundleText.getText("LABEL_1345"),	// 1345:- 선임일부터 일할계산하여 자격수당을 지급합니다.
	       }).addStyleClass("L2PFontFamily L2PPaddingLeft10"),
		});
		oRow.addCell(oCell);
		oNoticeMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
		    	   text : oBundleText.getText("LABEL_1331"),	// 1331:2.  자격해임 신청
	       }).addStyleClass("L2PFontFamily"),
		});
		oRow.addCell(oCell);
		oNoticeMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
		    	   text : oBundleText.getText("LABEL_1346"),	// 1346:- 기 선임된 자격증과 해임일을 입력 후 신청하세요.
	       }).addStyleClass("L2PFontFamily L2PPaddingLeft10"),
		});
		oRow.addCell(oCell);
		oNoticeMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
		    	   text : oBundleText.getText("LABEL_1347"),	// 1347:- 해임일 전일까지 일할계산하여 자격수당을 지급합니다.
	       }).addStyleClass("L2PFontFamily L2PPaddingLeft10"),
		});
		oRow.addCell(oCell);
		oNoticeMatrix.addRow(oRow);
		
		var oNoticePanel = new sap.m.Panel(oController.PAGEID + "_NoticePanel",{
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				height : "40px",
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.ToolbarSpacer({width: "10px"}),
					       new sap.m.Text({text : oBundleText.getText("LABEL_1335")}).addStyleClass("L2PFontFamilyBold"),	// 1335:신청안내
				           
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : oNoticeMatrix
		});
		
		return oNoticePanel;

	
	}
});