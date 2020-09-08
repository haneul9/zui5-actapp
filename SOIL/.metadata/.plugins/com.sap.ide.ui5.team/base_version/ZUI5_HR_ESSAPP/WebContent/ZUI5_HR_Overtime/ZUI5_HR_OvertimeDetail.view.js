
sap.ui.jsview("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail
	 */
	getControllerName : function() {
		return "ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail
	 */
	createContent : function(oController) {
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : sap.ui.jsfragment("ZUI5_HR_Overtime.fragment.OvertimePage02",oController),
			customHeader : new sap.m.Bar({
				contentLeft : new sap.m.Button({type : "Default", icon :"sap-icon://nav-back", press : oController.onBack}).addStyleClass("L2PPaddingRight10"),
				contentMiddle : new sap.m.Text(oController.PAGEID + "_DetailTitle",{
				}).addStyleClass("TitleFont"),
			}).addStyleClass("PSNCHeader L2pHeaderPadding"),
			showHeader : true,
			footer : new sap.m.Bar({
				contentRight : [new sap.m.Button({text : oBundleText.getText("LABEL_0058"), type : "Default", icon :"sap-icon://save" ,	// 58:임시저장
												  press : oController.onPressSaveT ,
												  visible : {
													  path : "ZappStatAl",
													  formatter : function(fVal){
														  if(fVal == "" || fVal == "10") return true;
														  else return false;
													  }
												  }
								}).addStyleClass("L2PFontFamily L2PPaddingRight10"), // sapUiSizeCompact L2PPaddingBottom13"),
								new sap.m.Button({text : oBundleText.getText("LABEL_0044"), type : "Default", icon :"sap-icon://hr-approval" ,	// 44:신청
												  press : oController.onPressSaveC ,
												  visible : {
													  path : "ZappStatAl",
													  formatter : function(fVal){
														  if(fVal == "" || fVal == "10") return true;
														  else return false;
													  }
												  }
								}).addStyleClass("L2PFontFamily L2PPaddingRight10"),
								new sap.m.Button({text : oBundleText.getText("LABEL_0033"), type : "Default", icon :"sap-icon://delete" ,	// 33:삭제
												  press : oController.onDelete ,
												  visible : {
													  path : "ZappStatAl",
													  formatter : function(fVal){
														  if(fVal == "10") return true;
														  else return false;
													  }
												  }
								}).addStyleClass("L2PFontFamily L2PPaddingRight10"),
								new sap.m.Button({text : oBundleText.getText("LABEL_0071"), type : "Default", icon :"sap-icon://decline" ,	// 71:취소
												  press : oController.onBack,
												  visible : {
													  path : "ZappStatAl",
													  formatter : function(fVal){
														  if(fVal == "" || fVal == "10") return true;
														  else return false;
													  }
												  }
								}).addStyleClass("L2PFontFamily"),
								new sap.m.Button({text : oBundleText.getText("LABEL_2088"), type : "Default" , icon :"sap-icon://manager" ,	// 2088:재상신
									  press : oController.onPressSaveX ,
									  visible : {
										  path : "ZappStatAl",
										  formatter : function(fVal){
											  if(fVal == "35"||fVal == "55"||fVal == "90") return true;
											  else return false;
										  }
									  }
								}).addStyleClass("L2PFontFamily L2PPaddingRight10"),
								new sap.m.Button({text : oBundleText.getText("LABEL_1550"), type : "Default" , icon :"sap-icon://print" ,	// 1550:근무명령확인서 출력
									  press : oController.onPrint ,
									  visible : {
										  path : "ZappStatAl",
										  formatter : function(fVal){
											  if(fVal == "50") return true;
											  else return false;
										  }
									  }
								}).addStyleClass("L2PFontFamily L2PPaddingRight10"),
								new sap.m.Button({text : oBundleText.getText("LABEL_0022"), type : "Default" , icon :"sap-icon://close-command-field" ,	// 22:뒤로
									  press : oController.onBack,
									  visible : {
										  path : "ZappStatAl",
										  formatter : function(fVal){
											  if(fVal == "" || fVal == "10") return false;
											  else return true;
										  }
									  }
								}).addStyleClass("L2PFontFamily"),
								new sap.m.Button(oController.PAGEID + "_ApplBtn", {text : oBundleText.getText("LABEL_1477"), type : "Default", icon :"sap-icon://manager" ,	// 1477:결재자지정
												  press : oController.onApprovalLine,
												  visible : {
													  path : "ZappStatAl",
													  formatter : function(fVal){
														  if(fVal == "" || fVal == "10") return true;
														  else return false;
													  }
												  }
								}).addStyleClass("L2PFontFamily")]
			}) //.addStyleClass("L2PHeight40")
		}).setModel(oController._DetailJSonModel)
		.bindElement("/Data")
		.addStyleClass("WhiteBackground") ;
		
		return oPage ;
	}

});