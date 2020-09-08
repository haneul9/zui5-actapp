sap.ui.jsfragment("zui5_hrxx_actpersonalid.fragment.PersonalidListSort", {
	
	createContent : function(oController) {
		
		var oDialog = new sap.m.ViewSettingsDialog(oController.PAGEID + "_FRLS_Dialog",{
			title : oBundleText.getText("SORT"),
			confirm : oController.onConfirmSortDialog,
			sortItems : [new sap.m.ViewSettingsItem({text : oBundleText.getText( "NUMBR"), key : "Numbr"}),
			             new sap.m.ViewSettingsItem({text : oBundleText.getText( "ASTAT"), key : "Astat"}),
			             new sap.m.ViewSettingsItem({text : oBundleText.getText( "APRTY"), key : "Chgfgtx"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "ICTYP"), key : "Ictxt"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "ICNUM2"), key : "Icnum"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "ISAUT"), key : "Auth1"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "IDCOT"), key : "Iscottx"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "FPDAT"), key : "Fpdat"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "CTEND"), key : "Expid"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "RORGT"), key : "Rorgt"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "RPERN"), key : "Rpern"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "APERN"), key : "Apern"}),
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
