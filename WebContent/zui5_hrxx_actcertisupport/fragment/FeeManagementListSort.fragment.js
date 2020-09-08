sap.ui.jsfragment("zui5_hrxx_actcertisupport.fragment.FeeManagementListSort", {
	
	createContent : function(oController) {
		
//		var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
		var oDialog = new sap.m.ViewSettingsDialog(oController.PAGEID + "_FRLS_Dialog",{
			title : oBundleText.getText("SORT"),
			confirm : oController.onConfirmSortDialog,
			sortItems : [new sap.m.ViewSettingsItem({text : oBundleText.getText( "STATU"), key : "Reqst"}),
			             new sap.m.ViewSettingsItem({text : oBundleText.getText( "DOCTL"), key : "Title"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "RECNT"), key : "Count"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "REQDA"), key : "Appld"})] 
		});
		
		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
	    };		

		return oDialog;
	}

});
