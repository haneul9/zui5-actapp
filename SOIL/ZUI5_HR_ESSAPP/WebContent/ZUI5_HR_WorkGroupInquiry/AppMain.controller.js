jQuery.sap.require("common.baseAppController");

common.baseAppController("ZUI5_HR_WorkGroupInquiry.AppMain", {
	
	onInit : function () {		
		// Any of the strings can be replaced with a function, that returns a string
		var oAppConfig = {
				
				defaultPageId : "ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList",
				
				isMaster : function (sPageId) {
					return ("Detail" !== sPageId && "LineItem" !== sPageId);
				},
				
				viewName : function (sPageId) {
					return sPageId;
				},
				
				viewType : "JS",
				
				transition : "slide"
			};
		
		this.configureApplication(this.getView().app, oAppConfig);
	}	
	
});