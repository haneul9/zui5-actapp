
sap.ui.jsview("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail
	 */
	getControllerName : function() {
		return "ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail
	 */
	createContent : function(oController) {
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : sap.ui.jsfragment("ZUI5_HR_Expenditure.fragment.ExpenditurePage02",oController),
			showHeader : false,
		})
		.addStyleClass("WhiteBackground") ;
		
		return oPage ;
	}

});