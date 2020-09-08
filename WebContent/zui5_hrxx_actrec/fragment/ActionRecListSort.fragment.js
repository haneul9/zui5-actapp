sap.ui.jsfragment("zui5_hrxx_actrec.fragment.ActionRecListSort", {
	
	createContent : function(oController) {
		
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
		var oDialog = new sap.m.ViewSettingsDialog(oController.PAGEID + "_ARS_Dialog",{
			title : oBundleText.getText("SORT"),
			confirm : oController.onConfirmSortDialog,
			sortItems : [
			             new sap.m.ViewSettingsItem({text : oBundleText.getText("STATU"), key : "Recst"}),
			             new sap.m.ViewSettingsItem({text : oBundleText.getText("PBTXT"), key : "Pbtxt"}),
			             new sap.m.ViewSettingsItem({text : oBundleText.getText("RECYY"), key : "RecYy"}),
			             new sap.m.ViewSettingsItem({text : oBundleText.getText("RECTYPE"), key : "RecTypeCd"}),
			             new sap.m.ViewSettingsItem({text : oBundleText.getText("RECNM"), key : "RecNm"}),
			             new sap.m.ViewSettingsItem({text : oBundleText.getText("RECNT"), key : "Recnt"}),
			             new sap.m.ViewSettingsItem({text : oBundleText.getText("TDATLO"), key : "Datlo"})
			            ]
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		

		return oDialog;
	}

});
