sap.ui.jsview("ZUI5_HR_DeductionChangeResnDisplay.ZUI5_HR_DeductionChangeResnDisplayList", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_DeductionChangeResnDisplay.ZUI5_HR_DeductionChangeResnDisplayList
	 */
	getControllerName : function() {
		return "ZUI5_HR_DeductionChangeResnDisplay.ZUI5_HR_DeductionChangeResnDisplayList";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_DeductionChangeResnDisplay.ZUI5_HR_DeductionChangeResnDisplayList
	 */
	createContent : function(oController) {

		var vAuth = "";
		if(_gAuth == "E") vAuth = "ESS";
		else if(_gAuth == "A") vAuth = "ASS";
		else if(_gAuth == "M") vAuth = "MSS";
		else if(_gAuth == "H") vAuth = "HASS";
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			showHeader : false,
			content : sap.ui.jsfragment("ZUI5_HR_DeductionChangeResnDisplay.fragment.DeductionChangeResnDisplayPage01",oController)
//			customHeader : new sap.m.Bar({
//				contentMiddle : new sap.m.Text({
//					text : oBundleText.getText("LABEL_0560")	// 560:변동공제 조회(사유발생자)
//				}).addStyleClass("TitleFont"),
//			}).addStyleClass("PSNCHeader L2pHeaderPadding")
		}).addStyleClass("WhiteBackground");
		
		return oPage;
	}

});