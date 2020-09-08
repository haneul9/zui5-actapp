sap.ui.jsfragment("ZUI5_HR_ChartTest4.fragment.Vacation", {
	
	createContent : function(oController) {
		jQuery.sap.require("control.HorizontalStackChart");
		
		var oCell = null , oRow = null;
		var oMatrixLayout =  new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			width : "100%",
			columns : 1,
		}).setModel(oController._JSonModel3).bindElement("/results");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.TextView({text : "근태신청"
			}).addStyleClass("L2PTitle1")
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :new sap.ui.core.HTML({
				preferDOM  : false,
				content : "<div style='height:45px'> </div>"
			})
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new control.HorizontalStackChart({
				bgColor : "#f5f5f5",
				barColor : "#2ecc71",
				min : "{CntBl1}" ,
				max : "{CntCr1}" ,
				label : "연차",
				label2 : "{Text1}" ,
				height : "70px",
				
			})
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new control.HorizontalStackChart({
				bgColor : "#f5f5f5",
				barColor : "#FFD700",
				min : "{CntBl2}" ,
				max : "{CntCr2}" ,
				label : "연중휴가",
				label2 : "{Text2}" ,
				height : "70px",
				
			})
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new control.HorizontalStackChart({
				bgColor : "#f5f5f5",
				barColor : "#FAA511",
				min : "{CntBl3}" ,
				max : "{CntCr3}" ,
				label : "장기근속",
				label2 : "{Text3}" ,
				height : "70px",
				
			})
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		return oMatrixLayout;

	
	}
});