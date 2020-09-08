sap.ui.jsview("ZUI5_HR_ProdEvalOpinionDisp.ZUI5_HR_ProdEvalOpinionDispList", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_ProdEvalOpinionDisp.ZUI5_HR_ProdEvalOpinionDispList
	 */
	getControllerName : function() {
		return "ZUI5_HR_ProdEvalOpinionDisp.ZUI5_HR_ProdEvalOpinionDispList";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ProdEvalOpinionDisp.ZUI5_HR_ProdEvalOpinionDispList
	 */
	createContent : function(oController) {

		var vAuth = "";
		if(_gAuth == "E") vAuth = "ESS";
		else if(_gAuth == "A") vAuth = "ASS";
		else if(_gAuth == "M") vAuth = "MSS";
		else if(_gAuth == "H") vAuth = "HASS";
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			showHeader : false,
			content : sap.ui.jsfragment("ZUI5_HR_ProdEvalOpinionDisp.fragment.ProdEvalOpinionDispPage01", oController)
//			customHeader : new sap.m.Bar({
//				contentMiddle : new sap.m.Text({
//					   			text : oBundleText.getText("LABEL_0894")	// 894:생산직 평가조정 의견기술 조회
//				}).addStyleClass("TitleFont"),
//			}).addStyleClass("PSNCHeader L2pHeaderPadding"),
//			footer : new sap.m.Bar({
//				contentRight : []
//			}) 
		}).addStyleClass("WhiteBackground");
		
		return oPage;
	}

});