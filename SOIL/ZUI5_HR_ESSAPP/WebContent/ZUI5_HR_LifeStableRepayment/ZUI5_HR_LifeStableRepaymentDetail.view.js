
sap.ui.jsview("ZUI5_HR_LifeStableRepayment.ZUI5_HR_LifeStableRepaymentDetail", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_LifeStableRepayment.ZUI5_HR_LifeStableRepaymentDetail
	 */
	getControllerName : function() {
		return "ZUI5_HR_LifeStableRepayment.ZUI5_HR_LifeStableRepaymentDetail";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_LifeStableRepayment.ZUI5_HR_LifeStableRepaymentDetail
	 */
	createContent : function(oController) {
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			showHeader : false,
			content : sap.ui.jsfragment("ZUI5_HR_LifeStableRepayment.fragment.LifeStableRepaymentPage02",oController)
		}).setModel(oController._DetailJSonModel)
		.bindElement("/Data")
		.addStyleClass("WhiteBackground");
		
		return oPage;
	}

});