sap.ui.jsfragment("ZUI5_HR_EmployeeList.fragment.EmployeeListPage02", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		
		 var oSubjectList = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_SubjectList", {
	        	width : "100%",
			});
	        
        oSubjectList.addDelegate({
			onAfterRendering: function() {
				oController.onAfterRenderingTable(oController);
			}
		});
        
		oSubjectList.addStyleClass("sapUiSizeCompact");
		return oSubjectList;	
	
	}
});