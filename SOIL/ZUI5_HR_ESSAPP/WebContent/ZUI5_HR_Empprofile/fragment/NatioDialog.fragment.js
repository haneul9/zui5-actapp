sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.NatioDialog", {
	
	createContent : function(oController) {
		
       var oStandardList = new sap.m.StandardListItem(oController.PAGEID + "_NatioList", {
			title : "{Etext}",
			info : "{Ecode}"
		});
        
		var oDialog = new sap.m.SelectDialog(oController.PAGEID + "_NatioDialog", {
			title : oBundleText.getText("LABEL_1535"),	// 1535:국가
			contentWidth : "600px",
			search : oController.onSearchNatio,
			confirm : oController.onConfirmNatio,
			cancel : oController.onCancelNatio,
			items : {
				path : "/natioCode",
				template : oStandardList
			}
		});
		oDialog.setModel(sap.ui.getCore().getModel("NatioList"));
		
 		return oDialog;
	}

});