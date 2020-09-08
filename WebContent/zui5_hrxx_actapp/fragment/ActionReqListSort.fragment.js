sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActionReqListSort", {
	
	createContent : function(oController) {
		
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
		var oDialog = new sap.m.ViewSettingsDialog(oController.PAGEID + "_ARS_Dialog",{
			title : oBundleText.getText("SORT"),
			confirm : oController.onConfirmSortDialog,
			//cancel : oController.onCancelSortDialog,
			sortItems : [new sap.m.ViewSettingsItem({text : oBundleText.getText( "STATU"), key : "Statu"}),
			             new sap.m.ViewSettingsItem({text : oBundleText.getText( "REQNO"), key : "Reqno"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "TITLE"), key : "Title"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "PBTXT"), key : "Pbtxt"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "REQDP"), key : "Reqdp"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "REQNM"), key : "Reqnm"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "REQDA"), key : "Reqda"}),
			            new sap.m.ViewSettingsItem({text : oBundleText.getText( "ACTDA"), key : "Actda"})]
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		

		return oDialog;
	}

});
