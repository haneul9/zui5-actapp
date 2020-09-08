
sap.ui.jsview("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail
	 */
	getControllerName : function() {
		return "ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail
	 */
	createContent : function(oController) {
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : sap.ui.jsfragment("ZUI5_HR_JoinClubHA.fragment.JoinClubPage02",oController),
			customHeader : new sap.m.Bar({
				contentLeft : new sap.m.Button({type : "Default", icon :"sap-icon://nav-back", press : oController.onBack}).addStyleClass("L2PPaddingRight10"),
				contentMiddle : new sap.m.Text(oController.PAGEID + "_DetailTitle",{
				}).addStyleClass("TitleFont"),
			}).addStyleClass("L2PHeader L2pHeaderPadding"),
			showHeader : true,
			footer : new sap.m.Bar({
				contentRight : [new sap.m.Button(oController.PAGEID + "_SaveP", {
									  text : "승인", type : "Default" , icon :"sap-icon://save" ,
									  press : oController.onPressSaveP ,
									  visible : {
										  path : "ZappStatAl",
										  formatter : function(fVal){
											  if(fVal == "20"||fVal == "30") return true;
											  else return false;
										  }
									  },
									  enabled : "{Enabled}"
								}).addStyleClass("L2PFontFamily L2PPaddingRight10"),
								new sap.m.Button(oController.PAGEID + "_SaveR", {
									  text : "반려", type : "Default" , icon :"sap-icon://decline" ,
									  press : oController.onPressSaveR ,
									  visible : {
										  path : "ZappStatAl",
										  formatter : function(fVal){
											  if(fVal == "20"||fVal == "30") return true;
											  else return false;
										  }
									  },
									  enabled : "{Enabled}"
								}).addStyleClass("L2PFontFamily L2PPaddingRight10"),						
								new sap.m.Button({text : "뒤로", type : "Default" , icon :"sap-icon://close-command-field" ,
									  press : oController.onBack,
									  visible : true
								}).addStyleClass("L2PFontFamily")]
			}) //.addStyleClass("L2PHeight40")
		}).setModel(oController._DetailJSonModel)
		.bindElement("/Data")
		.addStyleClass("WhiteBackground") ;
		
		return oPage ;
	}

});