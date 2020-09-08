jQuery.sap.require("common.Password");

sap.ui.jsfragment("ZUI5_HR_Portal.fragment.Paystub", {
	
	createContent : function(oController) {
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
		
		var oCell = null , oRow = null;
		
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			widths : ["" ,'20px'],
			columns : 2,
			width : "100%"
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : new sap.m.Text({text : "급여명세서"}).addStyleClass("Font22px FontColor6")
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "180px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Image({
						src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/payment.png",
						height : "120px"
					  }),
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2
		});
		oRow.addCell(oCell);
		oMatrixLayout.addRow(oRow);
		
		var oMainMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 3,
			widths : ["20px", "", "20px"],
			width : "295px",
			height : "295px"
		}).attachBrowserEvent("click", function(){
			var vAuth = oController.getCurrentAuth(oController);
			var vMenuList = [];
			if(vAuth == "E" || vAuth == "M") vMenuList = oController._EssMenuList;
			else if(vAuth == "H") vMenuList = oController._HassMenuList;
			
			var vMenuKey = "";
			for(var i = 0; i <vMenuList.length; i++){
				if(vMenuList[i].Zzurl.toUpperCase().indexOf("SALARYSTATEMENT") != -1){
					vMenuKey = vMenuList[i].Mncod;
					break;
				}	
			}
			common.Password.openPasswordDialog(oController, vMenuKey);
		}).addStyleClass("TileLayout CursorPointer");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "25px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMainMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"240px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oMatrixLayout,
			hAlign : sap.ui.commons.layout.HAlign.Center,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
		});
		oRow.addCell(oCell);
		oMainMatrixLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMainMatrixLayout.addRow(oRow);
		
		return oMainMatrixLayout;
	
	}
});