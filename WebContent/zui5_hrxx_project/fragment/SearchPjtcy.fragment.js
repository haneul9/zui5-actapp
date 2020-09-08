sap.ui.jsfragment("zui5_hrxx_project.fragment.SearchPjtcy", {
	
	createContent : function(oController) {
		
       var oStandardList = new sap.m.StandardListItem(oController.PAGEID + "_POP_Pjtcy_StandardList", {
			title : "{Etext}",
			info : "{Ecode}"
		});
       
		var oDialog = new sap.m.SelectDialog(oController.PAGEID + "_POP_Pjtcy_Dialog", {
			title : oBundleText.getText("SLAND"),
			contentWidth : "250px",
			search : oController.onSearchPjtcy,
			confirm : oController.onConfirmPjtcy,
			cancel : oController.onCancelPjtcy,
			items : {
				path : "/natioCode",
				template : oStandardList
			}
		});
		oDialog.setModel(sap.ui.getCore().getModel("NatioList"));
		
 		return oDialog;
	}

});