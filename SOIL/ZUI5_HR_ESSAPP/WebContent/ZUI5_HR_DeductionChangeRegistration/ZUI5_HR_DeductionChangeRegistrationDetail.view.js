sap.ui.jsview("ZUI5_HR_DeductionChangeRegistration.ZUI5_HR_DeductionChangeRegistrationDetail", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_DeductionChangeRegistration.ZUI5_HR_DeductionChangeRegistrationDetail
	 */
	getControllerName : function() {
		return "ZUI5_HR_DeductionChangeRegistration.ZUI5_HR_DeductionChangeRegistrationDetail";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_DeductionChangeRegistration.ZUI5_HR_DeductionChangeRegistrationDetail
	 */
	createContent : function(oController) {
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			showHeader : false,
			content : sap.ui.jsfragment("ZUI5_HR_DeductionChangeRegistration.fragment.DeductionChangeRegistrationPage02",oController)
//			customHeader : new sap.m.Bar({
//				contentMiddle : new sap.m.Text(oController.PAGEID + "_DetailTitle",{
//				}).addStyleClass("TitleFont"),
//			}).addStyleClass("PSNCHeader L2pHeaderPadding"),
//			footer : new sap.m.Bar({
//				contentRight : [
//					new sap.m.Button({
//						text : oBundleText.getText("LABEL_0044"), 	// 44:신청
//						type : "Default", 
//						icon :"sap-icon://hr-approval",
//						press : oController.onPreSaveOpenDialog,
//						visible : {
//							path : "ZappStatAl",
//							formatter : function(fVal) {
//								if(fVal == "" || fVal == "10") return true;
//								else return false;
//							}
//						}
//					}).addStyleClass("L2PFontFamily L2PPaddingRight10")
//				]
//			}) 
		}).setModel(oController._DetailJSonModel)
		.bindElement("/Data")
		.addStyleClass("WhiteBackground");
		
		return oPage;
	}

});