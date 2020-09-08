sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.RetireReasonDialog", {
	 
	createContent : function(oController) {
		
       var oStandardList = new sap.m.StandardListItem(oController.PAGEID + "_RetireReasonList", {
			title : "{Mgtxt}",
			info : "{Massg}"
		});
       
		var oDialog = new sap.m.SelectDialog(oController.PAGEID + "_RetireReason_Dialog", {
			title : oBundleText.getText("RETRS"),
			contentWidth : "350px",
			search : oController.onSearchRetrs,
			confirm : oController.onConfirmRetrs,
			cancel : oController.onCancelRetrs,
			items : {
				path : "/RetirementReasonSet",
				template : oStandardList
			}
		});
		oDialog.setModel(sap.ui.getCore().getModel("RetirementReasonList"));
		
 		return oDialog;
	}

});