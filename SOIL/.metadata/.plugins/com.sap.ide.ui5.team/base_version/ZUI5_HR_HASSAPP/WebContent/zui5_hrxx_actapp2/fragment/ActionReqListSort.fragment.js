sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionReqListSort", {
	 
	createContent : function(oController) {
		
		var oDialog = new sap.m.ViewSettingsDialog(oController.PAGEID + "_ARS_Dialog",{
			title : "정렬",
			confirm : oController.onConfirmSortDialog,
			//cancel : oController.onCancelSortDialog,
			sortItems : [new sap.m.ViewSettingsItem({text : "상태", key : "Statu"}),
			             new sap.m.ViewSettingsItem({text : "품의번호", key : "Reqno"}),
			            new sap.m.ViewSettingsItem({text : "품의서 제목", key : "Title"}),
			            new sap.m.ViewSettingsItem({text : "인사영역", key : "Pbtxt"}),
			            new sap.m.ViewSettingsItem({text : "기안부서", key : "Reqdp"}),
			            new sap.m.ViewSettingsItem({text : "기안자", key : "Reqnm"}),
			            new sap.m.ViewSettingsItem({text : "기안일", key : "Reqda"}),
			            new sap.m.ViewSettingsItem({text : "발령일", key : "Actda"})]
		});
		
//		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };
		

		return oDialog;
	}

});
