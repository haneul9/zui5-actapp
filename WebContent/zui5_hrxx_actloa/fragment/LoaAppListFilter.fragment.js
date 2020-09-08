sap.ui.jsfragment("zui5_hrxx_actloa.fragment.LoaAppListFilter", {
	
//	createContent : function(oController) {
//		
////		var oBundleText = jQuery.sap.resources({
////        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
////        	locale : sap.ui.getCore().getConfiguration().getLanguage()
////        });
//		
//		var oDialog = new sap.m.ViewSettingsDialog(oController.PAGEID + "_FILTER_Dialog",{
//			title : oBundleText.getText("FILTER"),
//			confirm : oController.onConfirmFilterDialog,
//			
//		});
//		
//		if (!jQuery.support.touch) { 
//			oDialog.addStyleClass("sapUiSizeCompact");
//	    };		
//
//		return oDialog;
//	}
//	createContent : function(oController) {
//		
////      var oBundleText = jQuery.sap.resources({
////      	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
////      	locale : sap.ui.getCore().getConfiguration().getLanguage()
////      });
//      
//		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_FILTER_Layout",{
//			width : "100%",
//			layoutFixed : false,
//		});
//		
//		var oDialog = new sap.m.Dialog(oController.PAGEID + "_FILTER_Dialog",{
//			content : oLayout,
//			contentWidth : "800px",
//			contentHeight : "400px",
//			showHeader : true,
////			beforeOpen : oController.onBeforeOpenInfoEnterDialog,
//			title : oBundleText.getText("FILTER"),
//			beginButton : new sap.m.Button({text : oBundleText.getText("OK_BTN"), width : "50%", press : oController.onPressActRequest}),
//			endButton : new sap.m.Button({text : oBundleText.getText("CLOSE_EN_BTN"),width : "50%",  press : oController.onLAEClose}),
//		});
//		
//		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
//			oDialog.addStyleClass("sapUiSizeCompact");
//	    };
//
//		return oDialog;
//	}
	
	createContent : function(oController) {
		
//      var oBundleText = jQuery.sap.resources({
//      	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//      	locale : sap.ui.getCore().getConfiguration().getLanguage()
//      });
      
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
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "50px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 1,
			content : [new sap.m.Text({text: oBundleText.getText("APERN")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Input(oController.PAGEID + "_FILTER_Apern", {	
							width : "95%"
			    }).addStyleClass("L2P13Font"),
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		oInfoEnterLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "50px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Text({text: oBundleText.getText("BAKDA")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Toolbar({ width : "95%",
										  content : [
			                                         new sap.m.DatePicker(oController.PAGEID + "_FILTER_FromBakda", {	
														 valueFormat : "yyyy-MM-dd",
											             displayFormat : gDtfmt,
											             width : "95%",
											             change : oController.onChangeDate
			                                         }).addStyleClass("L2P13Font"),
										             new sap.m.DatePicker(oController.PAGEID + "_FILTER_ToBakda", {	
														 valueFormat : "yyyy-MM-dd",
											             displayFormat : gDtfmt,
											             width : "95%",
											             change : oController.onChangeDate
										             }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oInfoEnterLayout.addRow(oRow);
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_FILTER_Dialog",{
			content : oInfoEnterLayout,
			contentWidth : "450px",
			contentHeight : "200px",
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
