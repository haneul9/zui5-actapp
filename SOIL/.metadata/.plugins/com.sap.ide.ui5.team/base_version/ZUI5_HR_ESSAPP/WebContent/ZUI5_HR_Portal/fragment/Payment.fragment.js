sap.ui.jsfragment("ZUI5_HR_Portal.fragment.Payment", {
	
	createContent : function(oController) {
		
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			widths : ['30%','70%'],
			columns : 2,
			width : "100%"
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : new sap.ui.commons.TextView({text : "급여명세서"}).addStyleClass("L2PTitle1")
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		var oInput = new sap.m.Input("PASSWORD",{
			showValueHelp: true,
		});
		
		oInput._getValueHelpIcon().setSrc("sap-icon://primary-key");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.TextView({text : "비밀번호"}).addStyleClass("L2PStatusFont")
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oInput
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : new sap.m.MessageStrip({
		  	      text : "본 정보는 본인 이외에 접근이 제한되어 있습니다.\n 본인 확인을 위해 비밀번호를 입력하여 주십시오.",
			      type : "Success",
			      showIcon : true,
			      customIcon : "sap-icon://message-information", 
			      showCloseButton : true,
		   }),
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Button({text : "비밀번호 변경",
										type : sap.m.ButtonType.Accept
			}).addStyleClass("L2PStatusFont"),
			hAlign : sap.ui.commons.layout.HAlign.Right,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
		});
		oRow.addCell(oCell);
		
		oMatrixLayout.addRow(oRow);
		
		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			colSpan : 2,
//			content : new sap.m.MessageStrip({
//		  	      text : "본인 확인을 위해 비밀번호를 입력하여 주십시오.",
//			      type : "Success",
//			      showIcon : true,
//			      customIcon : "sap-icon://message-information", 
//			      showCloseButton : true,
//		   }),
//		});
//		oRow.addCell(oCell);
//		oMatrixLayout.addRow(oRow);
		
		return oMatrixLayout;

	
	}
});