
sap.ui.jsview("ZUI5_HR_EmployeeList.ZUI5_HR_EmployeeList", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_EmployeeList.ZUI5_HR_EmployeeList
	 */
	getControllerName : function() {
		return "ZUI5_HR_EmployeeList.ZUI5_HR_EmployeeList";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_EmployeeList.ZUI5_HR_EmployeeList
	 */
	createContent : function(oController) {
		
		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%"
		});
		
//		var oContents = [ sap.ui.jsfragment("ZUI5_HR_EmployeeList.fragment.EmployeeListPage01", oController),
//					      sap.ui.jsfragment("ZUI5_HR_EmployeeList.fragment.EmployeeListPage02", oController)
//			];
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : sap.ui.jsfragment("ZUI5_HR_EmployeeList.fragment.EmployeeListPage01", oController), //oLayout,
			customHeader : new sap.m.Bar(oController.PAGEID + "_BAR",{
//				contentLeft : [ new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZNK_COMMON_UI5/images/logo.png",
//					 width : "170px",
//				})],
				contentMiddle : new sap.m.Text({
					   			text : "사원명부"
				}).addStyleClass("TitleFont"),
			}).addStyleClass("PSNCHeader"), 
			showHeader : true,
			footer : new sap.m.Bar({
				contentRight : [ new sap.m.Button({text : "Excel Download", type : "Default" , icon :"sap-icon://write-new" ,
				press : oController.ExcelDownload
				}).addStyleClass("sapUiSizeCompact L2PBottomPadding10px") ]
			}).addStyleClass("L2PHeight40") 
		}).addStyleClass("WhiteBackground") ;
		
		return oPage ;
	}

});