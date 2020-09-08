
sap.ui.jsview("ZUI5_HR_LoanList.ZUI5_HR_LoanList", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_WorkTimeMod.ZUI5_HR_WorkTimeModList
	 */
	getControllerName : function() {
		return "ZUI5_HR_LoanList.ZUI5_HR_LoanList";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_WorkTimeMod.ZUI5_HR_WorkTimeModList
	 */
	createContent : function(oController) {

		var vAuth = "";
		if(_gAuth == "E") vAuth = "ESS";
		else if(_gAuth == "A") vAuth = "ASS";
		else if(_gAuth == "M") vAuth = "MSS";
		else if(_gAuth == "H") vAuth = "HASS";
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : sap.ui.jsfragment("ZUI5_HR_LoanList.fragment.LoanListPage01",oController),
			customHeader : new sap.m.Bar({
				contentMiddle : new sap.m.Text({
					   			text : oBundleText.getText("LABEL_1808")	// 1808:사내복지기금 대출현황
				}).addStyleClass("TitleFont"),
			}).addStyleClass("PSNCHeader L2pHeaderPadding"),
			showHeader : true,
			footer : new sap.m.Bar({})
		}).addStyleClass("WhiteBackground") ;
		
		return oPage ;
	}

});