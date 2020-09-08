
sap.ui.jsview("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail
	 */
	getControllerName : function() {
		return "ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail
	 */
	createContent : function(oController) {
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : sap.ui.jsfragment("ZUI5_HR_ExpenditureHA.fragment.ExpenditurePage02",oController),
			customHeader : new sap.m.Bar({
				contentLeft : new sap.m.Button({type : "Default", icon :"sap-icon://nav-back", press : oController.onBack}).addStyleClass("L2PPaddingRight10"),
				contentMiddle : new sap.m.Text(oController.PAGEID + "_DetailTitle",{
				}).addStyleClass("TitleFont"),
			}).addStyleClass("L2PHeader L2pHeaderPadding"),
			showHeader : true,
			footer : new sap.m.Bar({
				contentRight : [new sap.m.Button({text : "승인", type : "Default" , icon :"sap-icon://save" ,
									  press : oController.onPressSaveP ,
									  visible : {
										  path : "ZappStatAl",
										  formatter : function(fVal){
											  if(fVal == "20") return true;
											  else return false;
										  }
									  }
								}).addStyleClass("L2PFontFamily L2PPaddingRight10"),
								new sap.m.Button({text : "기안", type : "Default" , icon :"sap-icon://hr-approval" ,
									  press : oController.onPressSaveS ,
									  visible : {
										  path : "ZappStatAl",
										  formatter : function(fVal){
											  if(fVal == "20"||fVal == "30") return true;
											  else return false;
										  }
									  }
								}).addStyleClass("L2PFontFamily L2PPaddingRight10"),
								new sap.m.Button({text : "반려", type : "Default" , icon :"sap-icon://decline" ,
									  press : oController.onPressSaveR ,
									  visible : {
										  path : "ZappStatAl",
										  formatter : function(fVal){
											  if(fVal == "20"||fVal == "30") return true;
											  else return false;
										  }
									  }
								}).addStyleClass("L2PFontFamily L2PPaddingRight10"),
//								new sap.m.Button({text : "재상신", type : "Default" , icon :"sap-icon://manager" ,
//									  press : oController.onPressSaveX ,
//									  visible : {
//										  path : "ZappStatAl",
//										  formatter : function(fVal){
//											  if(fVal == "35"||fVal == "55"||fVal == "90") return true;
//											  else return false;
//										  }
//									  }
//								}).addStyleClass("L2PFontFamily L2PPaddingRight10"),
								new sap.m.Button({text : "뒤로", type : "Default" , icon :"sap-icon://close-command-field" ,
									  press : oController.onBack,
								}).addStyleClass("L2PFontFamily"),]
			}) //.addStyleClass("L2PHeight40")
		}).setModel(oController._DetailJSonModel)
		.bindElement("/Data")
		.addStyleClass("WhiteBackground") ;
		
		return oPage ;
	}

});