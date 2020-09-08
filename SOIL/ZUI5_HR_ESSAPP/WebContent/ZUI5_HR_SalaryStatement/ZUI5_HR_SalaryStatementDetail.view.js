
sap.ui.jsview("ZUI5_HR_SalaryStatement.ZUI5_HR_SalaryStatementDetail", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_SalaryStatement.ZUI5_HR_SalaryStatementDetail
	 */
	getControllerName : function() {
		return "ZUI5_HR_SalaryStatement.ZUI5_HR_SalaryStatementDetail";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_SalaryStatement.ZUI5_HR_SalaryStatementDetail
	 */
	createContent : function(oController) {
			
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : sap.ui.jsfragment("ZUI5_HR_SalaryStatement.fragment.SalaryStatementPage02",oController),
//			customHeader : new sap.m.Bar({
//				contentLeft : new sap.m.Button({type : "Default", icon :"sap-icon://nav-back", press : oController.onBack}).addStyleClass("L2PPaddingRight10"),
//				contentMiddle : new sap.m.Text(oController.PAGEID + "_DetailTitle",{text : oBundleText.getText("LABEL_1593")}).addStyleClass("TitleFont"),	// 1593:급여명세서 상세내역
//			}).addStyleClass("PSNCHeader L2pHeaderPadding"),
			showHeader : false,
//			footer : new sap.m.Bar({
//				contentRight : [new sap.m.Button({text : oBundleText.getText("LABEL_0022"), type : "Default" , icon :"sap-icon://close-command-field" ,	// 22:뒤로
//									  press : oController.onBack
//								}).addStyleClass("L2PFontFamily")]
//			})
		})
		.addStyleClass("WhiteBackground") ;
		
		return oPage ;
	}

});