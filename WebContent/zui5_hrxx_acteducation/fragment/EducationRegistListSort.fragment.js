sap.ui.jsfragment("zui5_hrxx_acteducation.fragment.EducationRegistListSort", {
	
	createContent : function(oController) {
		
		var oDialog = new sap.m.ViewSettingsDialog(oController.PAGEID + "_FRLS_Dialog",{
			title : oBundleText.getText("SORT"),
			confirm : oController.onConfirmSortDialog,
			sortItems : [	new sap.m.ViewSettingsItem({text : oBundleText.getText( "STATU"), key : "Astat"}),
			                new sap.m.ViewSettingsItem({text : oBundleText.getText( "APRTY"), key : "Chgfgtx"}),
			                new sap.m.ViewSettingsItem({text : oBundleText.getText( "EBEGDA"), key : "Begda"}),
			                new sap.m.ViewSettingsItem({text : oBundleText.getText( "EENDDA"), key : "Endda"}),
			                new sap.m.ViewSettingsItem({text : oBundleText.getText( "SCHCD"), key : "Insti"}),
			                new sap.m.ViewSettingsItem({text : oBundleText.getText( "SLABS"), key : "Stext"}),
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
