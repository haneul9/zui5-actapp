sap.ui.jsfragment("zui5_hrxx_acteducation.fragment.EducationRejComment", {
	
	createContent : function(oController) {
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_CO_Dialog",{
			content :[new sap.m.TextArea(oController.PAGEID + "_POP_Ccomm", {width : "100%", rows : 4})] ,
			contentWidth : "400px",
			contentHeight : "130px",
			showHeader : true,
			title : oBundleText.getText("TITLE_COMMENT"),
			beforeClose : oController.onBeforeOpenSearchDialog,
			beginButton : new sap.m.Button({text : oBundleText.getText("CONFIRM_BTN"), icon: "sap-icon://accept", press : oController.onPressConfirm}), //
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"), icon: "sap-icon://sys-cancel-2", press : oController.onCOClose}),
		});
		
		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
	    };		

		return oDialog;
	}

});
