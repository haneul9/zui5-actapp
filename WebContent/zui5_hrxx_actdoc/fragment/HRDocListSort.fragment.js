sap.ui.jsfragment("zui5_hrxx_actdoc.fragment.HRDocListSort", {
	
	createContent : function(oController) {
		
		var oDialog = new sap.m.ViewSettingsDialog(oController.PAGEID + "_HDLS_Dialog",{
			title : oBundleText.getText("SORT"),
			confirm : oController.onConfirmSortDialog,
			sortItems : [new sap.m.ViewSettingsItem({text : oBundleText.getText( "ASTAT"), key : "Docst"}),
			             new sap.m.ViewSettingsItem({text : oBundleText.getText( "HRDOC"), key : "Hrdoctx"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "DOCTL"), key : "Doctl"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "RQCNT"), key : "Rqcnt"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "SMCNT"), key : "Smcnt"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "PRRTE"), key : "Prrte"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "REQDQ"), key : "Reqdq"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "RMDDA"), key : "Rmdda"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "CPLDA"), key : "Cplda"})] //
		});
		
		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
	    };		

		return oDialog;
	}

});
