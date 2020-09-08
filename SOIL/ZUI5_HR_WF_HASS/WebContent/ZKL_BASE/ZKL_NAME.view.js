sap.ui.jsview("ZKL_BASE.ZKL_NAME", {

	/**
	 * Specifies the Controller belonging to this View. In the case that it is
	 * not implemented, or that "null" is returned, this View does not have a
	 * Controller.
	 * 
	 * @memberOf ZKL_BASE.ZKL_NAME
	 */
	getControllerName : function() {
		return "ZKL_BASE.ZKL_NAME";
	},

	/**
	 * Is initially called once after the Controller has been instantiated. It
	 * is the place where the UI is constructed. Since the Controller is given
	 * to this method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZKL_BASE.ZKL_NAME
	 */
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.Formatter");
		
		var oPage = new sap.m.Page({
			showHeader : false,
			content : [],
			footer : new sap.m.Bar({
				contentLeft : [ new sap.ui.core.HTML({
					content : "<span>&nbsp;</>"
				}) ]
			}).addStyleClass("L2PPageFooter")
		});

		return oPage;

	}

});;