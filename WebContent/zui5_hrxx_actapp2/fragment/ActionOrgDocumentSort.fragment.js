sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionOrgDocumentSort", {
	 
	createContent : function(oController) {
		
		var oDialog = new sap.m.ViewSettingsDialog(oController.PAGEID + "_ADVS_Dialog",{
			title : oBundleText.getText("SORT_BTN"),
			confirm : oController.onConfirmSortDialog,
		});
		
		for(var i=0; i<oController._vDisplayControl.length; i++) {
			var Fieldname = oController._vDisplayControl[i].Fieldname;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			var TextFieldname = Fieldname + "_Tx";
			
			oDialog.addSortItem(new sap.m.ViewSettingsItem({text : oBundleText.getText(oController._vDisplayControl[i].Fieldname), key : TextFieldname}));
		}
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		

		return oDialog;
	}

});
