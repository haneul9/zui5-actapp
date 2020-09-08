sap.ui.jsview("ZUI5_HR_YEARTAX.YearTaxList", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	getControllerName : function() {
		return "ZUI5_HR_YEARTAX.YearTaxList";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	createContent : function(oController) {		

		/////////////////////////////////////////////////////////////
		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			widths : ["2rem", "", "2rem"],
			columns : 3,
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "10px"
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({
													text : "{Msg}" 
												}).addStyleClass("FontFamily FontBold")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					})]
		});
				
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oContentMatrix],
			customHeader : [new sap.m.Bar({
								contentMiddle : [new sap.m.Text({text : "연말정산 입력 및 조회"}).addStyleClass("TitleFont")]
						    }).addStyleClass("Header")],
			footer : [new sap.m.Bar({contentRight : []})]
		}).addStyleClass("WhiteBackground");
		
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");
		 
		return oPage;
	}
	
});
