sap.ui.jsfragment("zui5_hrxx_actloa.fragment.LoaAppListSort", {
	
	createContent : function(oController) {
		
//		var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
		var oDialog = new sap.m.ViewSettingsDialog(oController.PAGEID + "_FRLS_Dialog",{
			title : oBundleText.getText("SORT"),
			confirm : oController.onConfirmSortDialog,
			sortItems : [
							new sap.m.ViewSettingsItem({text : oBundleText.getText( "NUMBR"), key : "Numbr"}),
							new sap.m.ViewSettingsItem({text : oBundleText.getText( "STATU"), key : "Astat"}),
							new sap.m.ViewSettingsItem({text : oBundleText.getText( "LARETYP"), key : "Latyptx"}),
							new sap.m.ViewSettingsItem({text : oBundleText.getText( "PERNR"), key : "Pernr"}),
							new sap.m.ViewSettingsItem({text : oBundleText.getText( "ENAME"), key : "Rpern"}),
							new sap.m.ViewSettingsItem({text : oBundleText.getText( "ZZJOBGR"), key : "Zzjobgrtx"}),
							new sap.m.ViewSettingsItem({text : oBundleText.getText( "ZZCALTL"), key : "Zzcaltltx"}),
							new sap.m.ViewSettingsItem({text : oBundleText.getText( "FULLN"), key : "Rorgt"}),
							new sap.m.ViewSettingsItem({text : oBundleText.getText( "LOAPERIOD"), key : "Period"}),
				            new sap.m.ViewSettingsItem({text : oBundleText.getText( "DACNT"), key : "Dacnt"}),
				            new sap.m.ViewSettingsItem({text : oBundleText.getText( "BAKDA"), key : "Bakda"}),
				            new sap.m.ViewSettingsItem({text : oBundleText.getText( "APPLD"), key : "Appld"}),
							new sap.m.ViewSettingsItem({text : oBundleText.getText( "SGNDA"), key : "Sgnda"})
					  ] 
		});
		
		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
	    };		

		return oDialog;
	}

});
