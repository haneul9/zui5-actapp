sap.ui.jsfragment("zui5_hrxx_project.fragment.SearchEmpCode", {
	
	createContent : function(oController) {
		
       var oStandardList = new sap.m.StandardListItem(oController.PAGEID + "_POP_EmpCode_StandardList", {
			title : "{Etext}",
			info : "{Ecode}"
		});
       
       var oDialog = new sap.m.SelectDialog(oController.PAGEID + "_POP_EmpCode_Dialog", {
			title : "",
			contentWidth : "100px",
			customData : [{key:"id", value:""},{key:"label", value:""}],
			search : oController.onSearchEmpCode,
			confirm : oController.onConfirmEmpCode,
			cancel : oController.onCancelEmpCode,
		});
		oDialog.setModel(sap.ui.getCore().getModel("EmpCodeList2"));
 		return oDialog;
	}
});

