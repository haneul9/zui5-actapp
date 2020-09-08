sap.ui.jsview("ZUI5_HR_BookBuy.ZUI5_HR_BookBuyList", {

	/**
	 * Specifies the Controller belonging to this View. In the case that it is
	 * not implemented, or that "null" is returned, this View does not have a
	 * Controller.
	 * 
	 * @memberOf ZUI5_HR_BookBuy.ZUI5_HR_BookBuyList
	 */
	getControllerName : function() {
		return "ZUI5_HR_BookBuy.ZUI5_HR_BookBuyList";
	},

	/**
	 * Is initially called once after the Controller has been instantiated. It
	 * is the place where the UI is constructed. Since the Controller is given
	 * to this method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_BookBuy.ZUI5_HR_BookBuyList
	 */
	createContent : function(oController) {

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
			content : sap.ui.jsfragment("ZUI5_HR_BookBuy.fragment.BookPage01",
					oController),
			showHeader : false
		}).addStyleClass("WhiteBackground");

		return oPage;
	}

});