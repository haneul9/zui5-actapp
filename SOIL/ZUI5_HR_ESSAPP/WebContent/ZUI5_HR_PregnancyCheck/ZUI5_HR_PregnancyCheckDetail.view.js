sap.ui.jsview("ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckDetail", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckDetail
	 */
	getControllerName : function() {
		return "ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckDetail";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckDetail
	 */
	createContent : function(oController) {
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			showHeader : false,
			content : sap.ui.jsfragment("ZUI5_HR_PregnancyCheck.fragment.PregnancyCheckPage02",oController)
		})
		.setModel(oController._DetailJSonModel)
		.bindElement("/Data")
		.addStyleClass("WhiteBackground") ;
		
		return oPage;
	}

});