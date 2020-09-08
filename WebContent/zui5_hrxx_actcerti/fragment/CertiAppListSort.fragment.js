sap.ui.jsfragment("zui5_hrxx_actcerti.fragment.CertiAppListSort", {
	
	createContent : function(oController) {
		
//		var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
		var oDialog = new sap.m.ViewSettingsDialog(oController.PAGEID + "_FRLS_Dialog",{
			title : oBundleText.getText("SORT"),
			confirm : oController.onConfirmSortDialog,
			sortItems : [ new sap.m.ViewSettingsItem({text : oBundleText.getText( "NUMBR"), key : "Numbr"}),
			              new sap.m.ViewSettingsItem({text : oBundleText.getText( "STATU"), key : "Astat"}),
			              new sap.m.ViewSettingsItem({text : oBundleText.getText( "CHGFG"), key : "Chgfgtx"}),
			              new sap.m.ViewSettingsItem({text : oBundleText.getText( "CTTYP"), key : "Cttyptx"}),
			              new sap.m.ViewSettingsItem({text : oBundleText.getText( "ISAUT"), key : "Isaut"}),
			              new sap.m.ViewSettingsItem({text : oBundleText.getText( "CERDA"), key : "Ctbeg"}),
			              new sap.m.ViewSettingsItem({text : oBundleText.getText( "CTEND"), key : "Ctend"}),
			              new sap.m.ViewSettingsItem({text : oBundleText.getText( "PERNR"), key : "Rpers"}),
			              new sap.m.ViewSettingsItem({text : oBundleText.getText( "ENAME"), key : "Rpern"}),
			              new sap.m.ViewSettingsItem({text : oBundleText.getText( "ZZJOBGR"), key : "Zzjobgrtx"}),
			              new sap.m.ViewSettingsItem({text : oBundleText.getText( "ZZCALTL"), key : "Zzcaltltx"}),
			              new sap.m.ViewSettingsItem({text : oBundleText.getText( "FULLN"), key : "Rorgt"}),
			              new sap.m.ViewSettingsItem({text : oBundleText.getText( "APPLD"), key : "Appld"}),
			              new sap.m.ViewSettingsItem({text : oBundleText.getText( "CPERN"), key : "Cpern"}),
			              new sap.m.ViewSettingsItem({text : oBundleText.getText( "CONFD"), key : "Confd"})
			            ] 
		});
		
		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
	    };		

		return oDialog;
	}

});
