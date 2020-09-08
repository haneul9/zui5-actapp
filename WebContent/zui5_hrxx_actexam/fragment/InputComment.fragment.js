sap.ui.jsfragment("zui5_hrxx_actexam.fragment.InputComment", {
	
	createContent : function(oController) {
		
//		var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_CO_Dialog",{
			content :[new sap.m.TextArea(oController.PAGEID + "_Ccomm", {width : "100%", rows : 4})] ,
			contentWidth : "400px",
			contentHeight : "130px",
			showHeader : true,
			title : oBundleText.getText("TITLE_INPUT_APPLY_COMMENT"),
			beforeOpen : oController.onBeforeOpenComment,
			beginButton : new sap.m.Button({text : oBundleText.getText("CONFIRM_BTN"), icon: "sap-icon://accept", press : oController.onPressReject}), 
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"), icon: "sap-icon://sys-cancel-2", press : oController.onCOClose}),
		});
		
		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
	    };		

		return oDialog;
	}

});
