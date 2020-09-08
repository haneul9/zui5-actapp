
sap.ui.jsview("ZUI5_HR_DCMoneyDue.ZUI5_HR_DCMoneyDueList", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_DCMoneyDue.ZUI5_HR_DCMoneyDueList
	 */
	getControllerName : function() {
		return "ZUI5_HR_DCMoneyDue.ZUI5_HR_DCMoneyDueList";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_DCMoneyDue.ZUI5_HR_DCMoneyDueList
	 */
	createContent : function(oController) {

		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			showHeader : false,
			content : sap.ui.jsfragment("ZUI5_HR_DCMoneyDue.fragment.DCMoneyDuePage01",oController)
//			customHeader : new sap.m.Bar({
//				contentMiddle : new sap.m.Text({
//					text : oBundleText.getText("LABEL_0851")	// 851:DC 퇴직연금 불입내역 조회
//				}).addStyleClass("TitleFont"),
//			}).addStyleClass("PSNCHeader L2pHeaderPadding"),
//			showHeader : true,
		}).addStyleClass("WhiteBackground");
		
		return oPage;
	}

});