sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_POP_Schcd", {
	
	createContent : function(oController) {
		var oStandardList = new sap.m.StandardListItem(oController.PAGEID + "_POP_Schcd_StandardList", {
			title : "{Insti}",
			description : "{Slandtx}",
			info : "{Slarttx}"
		});
		
		var oDialog = new sap.m.SelectDialog(oController.PAGEID + "_POP_Schcd_Dialog", {
			title : "학교",
			contentWidth : "350px",
			search : oController.onSearchSchcd,
			confirm : oController.onConfirmSchcd,
			cancel : oController.onCancelSchcd,
			items : {
				path : "/SchoolCodeSet",
				template : oStandardList
			}
		});
		oDialog.setModel(sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV"));
 		
 		return oDialog;
	}

});