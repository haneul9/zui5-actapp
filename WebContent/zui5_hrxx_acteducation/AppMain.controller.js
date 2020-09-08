jQuery.sap.require("util.baseAppController");

util.baseAppController("zui5_hrxx_acteducation.AppMain", {
	
	onInit : function () {		
		// Any of the strings can be replaced with a function, that returns a string
		var oAppConfig = { 
				
				defaultPageId : "zui5_hrxx_acteducation.EducationRequestList",
				
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