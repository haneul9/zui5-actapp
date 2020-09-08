sap.ui.jsfragment("zui5_hrxx_project.fragment.ProjectListSort", {
	
	createContent : function(oController) {
		
//		var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
		var oDialog = new sap.m.ViewSettingsDialog(oController.PAGEID + "_Sort_Dialog",{
			title : oBundleText.getText("SORT"),
			confirm : oController.onConfirmSortDialog,
			sortItems : [
						new sap.m.ViewSettingsItem({text : oBundleText.getText("PJTNM"), key : "Pjtnm"}),
						new sap.m.ViewSettingsItem({text : oBundleText.getText("PJTID"), key : "Pjtid"}),
						new sap.m.ViewSettingsItem({text : oBundleText.getText("PJTTY"), key : "Pjttytx"}),
						new sap.m.ViewSettingsItem({text : oBundleText.getText("BEGDA"), key : "Pjtbd"}),
						new sap.m.ViewSettingsItem({text : oBundleText.getText("ENDDA"), key : "Pjted"}),
						new sap.m.ViewSettingsItem({text : oBundleText.getText("PBTXT"), key : "Pbtxt"}),
						new sap.m.ViewSettingsItem({text : oBundleText.getText("UNAME2"), key : "Unametx"}),
						new sap.m.ViewSettingsItem({text : oBundleText.getText("DATUM3"), key : "Datum"})
			            ] 
		});
		
		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
	    };		

		return oDialog;
	}

});
