
sap.ui.jsview("ZUI5_HR_CompanyHouse.ZUI5_HR_CompanyHouseDetail1", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_CompanyHouse.ZUI5_HR_CompanyHouseDetail1
	 */
	getControllerName : function() {
		return "ZUI5_HR_CompanyHouse.ZUI5_HR_CompanyHouseDetail1";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_CompanyHouse.ZUI5_HR_CompanyHouseDetail1
	 */
	createContent : function(oController) {
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : sap.ui.jsfragment("ZUI5_HR_CompanyHouse.fragment.CompanyHousePage03",oController),
			showHeader : false 
		})
		.addStyleClass("WhiteBackground") ;
		
		return oPage ;
	}

});