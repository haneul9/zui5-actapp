jQuery.sap.require("common.baseAppController");

common.baseAppController("ZKL_BASE.AppMain", {

	onInit : function () {		
		console.log("base app main");
		// Any of the strings can be replaced with a function, that returns a string
		var oAppConfig = {
				 
				defaultPageId : "ZKL_BASE.ZKL_NAME",
				 
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