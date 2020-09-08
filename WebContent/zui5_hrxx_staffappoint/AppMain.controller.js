jQuery.sap.require("util.baseAppController");

util.baseAppController("zui5_hrxx_staffappoint.AppMain", {

	
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actann.AppMain
	*/ 
	
	onInit : function () {		
		var vPage = jQuery.sap.getUriParameters().get("page");
		var vInitialPage = "";
		if(vPage == "exp") vDefaultPageId = "zui5_hrxx_staffappoint.ProjectExpMain";
		else vDefaultPageId = "zui5_hrxx_staffappoint.Staff";
		
		// Any of the strings can be replaced with a function, that returns a string
		var oAppConfig = {
				
				defaultPageId : vDefaultPageId,
				
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