sap.ui.jsview("ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail
	 */
	getControllerName : function() {
		return "ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_WorktimeReduction.ZUI5_HR_WorktimeReductionDetail
	 */
	createContent : function(oController) {
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			showHeader : false,
			content : sap.ui.jsfragment("ZUI5_HR_WorktimeReduction.fragment.WorktimeReductionPage02",oController)
		}).setModel(oController._DetailJSonModel)
		.bindElement("/Data")
		.addStyleClass("WhiteBackground");
		
		return oPage;
	}

});