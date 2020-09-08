
sap.ui.jsview("ZUI5_HR_HealthInsuranceTax.ZUI5_HR_HealthInsuranceTaxList", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_HealthInsuranceTax.ZUI5_HR_HealthInsuranceTaxList
	 */
	getControllerName : function() {
		return "ZUI5_HR_HealthInsuranceTax.ZUI5_HR_HealthInsuranceTaxList";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_HealthInsuranceTax.ZUI5_HR_HealthInsuranceTaxList
	 */
	createContent : function(oController) {

		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			showHeader : false,
			content : sap.ui.jsfragment("ZUI5_HR_HealthInsuranceTax.fragment.HealthInsuranceTaxPage01",oController)
//			customHeader : new sap.m.Bar({
//				contentMiddle : new sap.m.Text({
//					text : oBundleText.getText("LABEL_0859")	// 859:건강보험 연말정산 금액 조회
//				}).addStyleClass("TitleFont"),
//			}).addStyleClass("PSNCHeader L2pHeaderPadding"),
//			showHeader : true,
		}).addStyleClass("WhiteBackground");
		
		return oPage;
	}

});