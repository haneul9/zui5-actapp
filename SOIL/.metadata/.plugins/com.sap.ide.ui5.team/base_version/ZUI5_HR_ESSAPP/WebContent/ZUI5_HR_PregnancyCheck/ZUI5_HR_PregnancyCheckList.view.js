
sap.ui.jsview("ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckList", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckList
	 */
	getControllerName : function() {
		return "ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckList";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckList
	 */
	createContent : function(oController) {

		var vAuth = "";
		if(_gAuth == "E") vAuth = "ESS";
		else if(_gAuth == "A") vAuth = "ASS";
		else if(_gAuth == "M") vAuth = "MSS";
		else if(_gAuth == "H") vAuth = "HASS";
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			showHeader : false,
			content : sap.ui.jsfragment("ZUI5_HR_PregnancyCheck.fragment.PregnancyCheckPage01",oController)
//			customHeader : new sap.m.Bar({
//				contentMiddle : new sap.m.Text({
//					text : oBundleText.getText("LABEL_0164")	// 164:태아검진 외출 신청
//				}).addStyleClass("TitleFont"),
//			}).addStyleClass("PSNCHeader L2pHeaderPadding"),
//			showHeader : true,
//			footer : new sap.m.Bar({
//				contentRight : [
//					new sap.m.Button({
//						text : oBundleText.getText("LABEL_0043"), 	// 43:신규신청
//						type : "Default", 
//						icon :"sap-icon://write-new",
//						press : oController.onPressNew
//					})
//				] //.addStyleClass("sapUiSizeCompact L2PPaddingBottom13")]
//			})
		}).addStyleClass("WhiteBackground") ;
		
		return oPage ;
	}

});