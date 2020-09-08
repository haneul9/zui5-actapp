sap.ui.jsfragment("zui5_hrxx_actapp.fragment.SearchFaartCode", {
	
	createContent : function(oController) {
		
       var oStandardList = new sap.m.StandardListItem(oController.PAGEID + "_POP_FaartCode_StandardList", {
			title : "{Etext}",
			info : "{Ecode}"
		});
       
       var oDialog = new sap.m.SelectDialog(oController.PAGEID + "_POP_FaartCode_Dialog", {
			contentWidth : "600px",
			search : oController.onSearchFaartCode,
			confirm : oController.onConfirmFaartCode,
			cancel : oController.onCancelFaartCode,
		});
		oDialog.setModel(sap.ui.getCore().getModel("FaartCodeList"));
 		return oDialog; 
	}

});

