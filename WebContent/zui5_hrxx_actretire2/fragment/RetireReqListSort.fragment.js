sap.ui.jsfragment("zui5_hrxx_actretire2.fragment.RetireReqListSort", {
	
	createContent : function(oController) {
		
        var oDialog = new sap.m.ViewSettingsDialog(oController.PAGEID + "_RRS_Dialog",{
			title : oBundleText.getText("SORT"),
			confirm : oController.onConfirmSortDialog,
			sortItems : [
			            new sap.m.ViewSettingsItem({text : oBundleText.getText("ENAME"), key : "Ename"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText("FULLN"), key : "Stext"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText("ZZCALTLTX"), key : "Zzcaltltx"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText("ENTDA"), key : "Entda"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText("RETDA"), key : "Retda"})]
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		

		return oDialog;
	}

});
