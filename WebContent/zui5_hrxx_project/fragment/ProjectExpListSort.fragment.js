sap.ui.jsfragment("zui5_hrxx_project.fragment.ProjectExpListSort", {
	
	createContent : function(oController) {
		
//		var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
		var oDialog = new sap.m.ViewSettingsDialog(oController.PAGEID + "_Sort_Dialog",{
			title : oBundleText.getText("SORT"),
			confirm : oController.onConfirmSortDialog,
			sortItems : [
						new sap.m.ViewSettingsItem({text : oBundleText.getText("APRTY"), key : "Aprtytx"}),
						new sap.m.ViewSettingsItem({text : oBundleText.getText("PJTNM"), key : "Pjtnm"}),
						new sap.m.ViewSettingsItem({text : oBundleText.getText("PJTID"), key : "Pjtid"}),
						new sap.m.ViewSettingsItem({text : oBundleText.getText("EXPBD"), key : "Begda"}),
						new sap.m.ViewSettingsItem({text : oBundleText.getText("EXPED"), key : "Endda"}),
						new sap.m.ViewSettingsItem({text : oBundleText.getText("PBTXT"), key : "Pbtxt"}),
						new sap.m.ViewSettingsItem({text : oBundleText.getText("PERNRTX"), key : "Pernrtx"}),
						new sap.m.ViewSettingsItem({text : oBundleText.getText("PERNROTX"), key : "Pernrotx"}),
						new sap.m.ViewSettingsItem({text : oBundleText.getText("REQDA2"), key : "Recda"}),
						new sap.m.ViewSettingsItem({text : oBundleText.getText("RECDA"), key : "Reqda"}),
						new sap.m.ViewSettingsItem({text : oBundleText.getText("SGNDA"), key : "Aprda"})
			            ] 
		});
		
		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
	    };		

		return oDialog;
	}

});
