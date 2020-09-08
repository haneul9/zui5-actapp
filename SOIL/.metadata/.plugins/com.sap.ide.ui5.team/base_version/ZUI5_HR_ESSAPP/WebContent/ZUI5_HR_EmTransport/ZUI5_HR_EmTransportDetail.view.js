
sap.ui.jsview("ZUI5_HR_EmTransport.ZUI5_HR_EmTransportDetail", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_EmTransport.ZUI5_HR_EmTransportDetail
	 */
	getControllerName : function() {
		return "ZUI5_HR_EmTransport.ZUI5_HR_EmTransportDetail";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_EmTransport.ZUI5_HR_EmTransportDetail
	 */
	createContent : function(oController) {
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : sap.ui.jsfragment("ZUI5_HR_EmTransport.fragment.EmTransportPage02",oController),
			showHeader : false,
		})
		.addStyleClass("WhiteBackground") ;
		
		return oPage ;
	}

});