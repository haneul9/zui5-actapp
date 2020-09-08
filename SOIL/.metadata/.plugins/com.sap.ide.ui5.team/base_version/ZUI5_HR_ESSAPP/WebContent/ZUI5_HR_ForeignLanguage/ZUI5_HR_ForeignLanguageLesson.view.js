
sap.ui.jsview("ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson
	 */
	getControllerName : function() {
		return "ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson";
	},
	
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson
	 */
	createContent : function(oController) {
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			showHeader : false,
			content : sap.ui.jsfragment("ZUI5_HR_ForeignLanguage.fragment.ForeignLanguageLesson",oController)
//			customHeader : new sap.m.Bar({
//				contentLeft : new sap.m.Button({
//					type : "Default", 
//					icon :"sap-icon://nav-back", 
//					press : oController.onBack
//				}).addStyleClass("L2PPaddingRight10"),
//				contentMiddle : new sap.m.Text(oController.PAGEID + "_DetailTitle",{
//				}).addStyleClass("TitleFont"),
//			}).addStyleClass("PSNCHeader L2pHeaderPadding"),
//			footer : new sap.m.Bar({
//				contentRight : [
//					new sap.m.Button({
//						text : oBundleText.getText("LABEL_0058"), 	// 58:임시저장
//						type : "Default", 
//						icon :"sap-icon://save",
//						press : oController.onPressSaveT ,
//						visible : {
//							path : "ZappStatAl",
//							formatter : function(fVal){
//								if(fVal == "" || fVal == "10") return true;
//								else return false;
//							}
//						}
//					}).addStyleClass("L2PFontFamily L2PPaddingRight10"),
//					new sap.m.Button({
//						text : oBundleText.getText("LABEL_0044"), 	// 44:신청
//						type : "Default", 
//						icon :"sap-icon://hr-approval",
//						press : oController.onPressSaveAmtCheck ,
//						visible : {
//							path : "ZappStatAl",
//							formatter : function(fVal){
//								if(fVal == "" || fVal == "10") return true;
//								else return false;
//							}
//						}
//					}).addStyleClass("L2PFontFamily L2PPaddingRight10"),
//					new sap.m.Button({
//						text : oBundleText.getText("LABEL_0033"), 	// 33:삭제
//						type : "Default", 
//						icon :"sap-icon://decline",
//						press : oController.onDelete ,
//						visible : {
//							path : "ZappStatAl",
//							formatter : function(fVal){
//								if(fVal == "10" ) return true;
//								else return false;
//							}
//						}
//					}).addStyleClass("L2PFontFamily L2PPaddingRight10"),
//					new sap.m.Button({
//						text : oBundleText.getText("LABEL_0022"), 	// 22:뒤로
//						type : "Default", 
//						icon :"sap-icon://close-command-field",
//						press : oController.onBack,
//					}).addStyleClass("L2PFontFamily")
//				]
//			}) 
		})
		.setModel(oController._DetailJSonModel)
		.bindElement("/Data")
		.addStyleClass("WhiteBackground");
		
		return oPage;
	}

});