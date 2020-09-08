sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActionOrgDocumentFilter", {
	
	createContent : function(oController) {
		
		var oDialog = new sap.m.ViewSettingsDialog(oController.PAGEID + "_ADVF_Dialog",{
			title : "필터",
			confirm : oController.onConfirmFilterDialog,
		});
		
		for(var i=0; i<oController._vDisplayControl.length; i++) {
			var Fieldname = oController._vDisplayControl[i].Fieldname;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			var TextFieldname = Fieldname + "_Tx";
			
			var oFilterItem = new sap.m.ViewSettingsFilterItem(oController.PAGEID + "_AODF_" + TextFieldname, {text : oController._vDisplayControl[i].Label, key : TextFieldname});
			oDialog.addFilterItem(oFilterItem);
		}
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		

		return oDialog;
	}

});
