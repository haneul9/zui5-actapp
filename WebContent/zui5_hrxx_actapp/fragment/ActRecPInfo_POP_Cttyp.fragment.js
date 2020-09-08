sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_POP_Cttyp", {
	
	createContent : function(oController) {
		
       var oStandardList = new sap.m.StandardListItem(oController.PAGEID + "_POP_Cttyp_StandardList", {
			info : "{Cttyp}",
			title : "{Cttyptx}",
			description : "{Isaut}"
		});
       
       var oDialog = new sap.m.SelectDialog(oController.PAGEID + "_POP_Cttyp_Dialog", {
			title : oBundleText.getText("CTTYP"),
			contentWidth : "600px",
			search : oController.onSearchCttyp,
			confirm : oController.onConfirmCttyp,
			cancel : oController.onCancelCttyp,
			items : {
				path : "/cttypCode",
				template : oStandardList
			}
		});
		oDialog.setModel(sap.ui.getCore().getModel("CttypList"));
 		return oDialog;
	}

});

