jQuery.sap.require("util.baseAppController");

util.baseAppController("zui5_hrxx_actann.AppMain", {
	
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actann.AppMain
	*/ 
	 
	onInit : function () {		
		// Any of the strings can be replaced with a function, that returns a string
		var oAppConfig = {
				
				defaultPageId : "zui5_hrxx_actann.AnnounceList",
				
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