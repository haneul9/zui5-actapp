sap.ui.jsview("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList", {

	/**
	 * Specifies the Controller belonging to this View. In the case that it is
	 * not implemented, or that "null" is returned, this View does not have a
	 * Controller.
	 * 
	 * @memberOf ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList
	 */
	getControllerName : function() {
		return "ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList";
	},

	/**
	 * Is initially called once after the Controller has been instantiated. It
	 * is the place where the UI is constructed. Since the Controller is given
	 * to this method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList
	 */
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.ZHR_TABLES");
		var vAuth = "";
		if (_gAuth == "E")
			vAuth = "ESS";
		else if (_gAuth == "A")
			vAuth = "ASS";
		else if (_gAuth == "M")
			vAuth = "MSS";
		else if (_gAuth == "H")
			vAuth = "HASS";
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			showHeader : false,
			content : sap.ui.jsfragment("ZUI5_HR_MealRequest.fragment.MealRequestPage01",oController),
		}).addStyleClass("WhiteBackground");
		return oPage;
	}

});