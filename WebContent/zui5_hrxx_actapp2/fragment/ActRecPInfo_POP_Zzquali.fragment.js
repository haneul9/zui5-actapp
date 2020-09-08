sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_POP_Zzquali", {
	
	createContent : function(oController) {
		
       var oStandardListItem = new sap.m.StandardListItem({ //(oController.PAGEID + "_POP_Quali_StandardList", {
			title : "{Etext}",
			info : "{Ecode}"
		});
       
		var oDialog = new sap.m.SelectDialog(oController.PAGEID + "_POP_Quali_Dialog", {
			title : oBundleText.getText("QUALIFICATION"),
			contentWidth : "350px",
			search : oController.onSearchQuali,
			confirm : oController.onConfirmQuali,
			cancel : oController.onCancelQuali,
			items : {
				path : "/ZzqualiCodeListSet",
				template : oStandardListItem,
			}
		});
		oDialog.setModel(sap.ui.getCore().getModel("ZzqualiCodeList"));
 		return oDialog;
	}

});