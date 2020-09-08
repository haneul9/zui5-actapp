sap.ui.jsfragment("zui5_hrxx_actfamily.fragment.FamilyRegistListFilter", {
	
	createContent : function(oController) {
      
      var oCell = null, oRow = null;
		
		var oInfoEnterLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 2
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "50px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 1,
			content : [new sap.m.Text({text: oBundleText.getText("ENAME_3")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Input(oController.PAGEID + "_FILTER_Ename", {	
							width : "95%"
			    }).addStyleClass("L2P13Font"),
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		oInfoEnterLayout.addRow(oRow);
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_FILTER_Dialog",{
			content : oInfoEnterLayout,
			contentWidth : "450px",
			contentHeight : "100px",
			showHeader : true,
//			beforeOpen : oController.onBeforeOpenInfoEnterDialog,
			title : oBundleText.getText("FILTER_BTN"),
			beginButton : new sap.m.Button({text : oBundleText.getText("OK_BTN"), width : "50%", press : oController.onConfirmFilterDialog}),
			endButton : new sap.m.Button({text : oBundleText.getText("CLOSE_EN_BTN"),width : "50%",  press : oController.onFilterClose}),
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };

		return oDialog;
	}
	
});
