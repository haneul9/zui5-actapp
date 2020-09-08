sap.ui.jsfragment("zui5_hrxx_project.fragment.SearchPjtcu", {
	
	createContent : function(oController) {
		
       var oStandardList = new sap.m.StandardListItem(oController.PAGEID + "_POP_Pjtcu_StandardList", {
			title : "{Pjtcutx}",
//			description : "{Pjtcutx}",
			info : "{Pjtcu}"
		});
		
		var oDialog = new sap.m.SelectDialog(oController.PAGEID + "_POP_Pjtcu_Dialog", {
			title : oBundleText.getText("PJTCU"),
			contentWidth : "250px",
			search : oController.onSearchPjtcu,
			confirm : oController.onConfirmPjtcu,
			cancel : oController.onCancelPjtcu,
			items : {
//				path : "/CustomerSearchResultSet/?$filter=Persa%20eq%20%27" + oController._vWerks + "%27",
				path : "/CustomerSearchResultSet",
				template : oStandardList
			}
		});
		oDialog.setModel(sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV"));
 		
 		return oDialog;
	}

});