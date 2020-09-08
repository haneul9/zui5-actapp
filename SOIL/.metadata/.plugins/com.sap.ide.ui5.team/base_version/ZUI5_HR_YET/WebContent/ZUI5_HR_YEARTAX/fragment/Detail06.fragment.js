sap.ui.jsfragment("ZUI5_HR_YEARTAX.fragment.Detail06", {
	/** 모의실행 **/
	createContent : function(oController) {
		
		var oLayout = new sap.ui.layout.VerticalLayout({
			width : "100%",
			content : [new sap.ui.core.HTML({content : "<div style='height:10px'></div>"}),
					   new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Detail6_PDF")]
		});
		
		var oContent = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["2rem", "", "2rem"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [oLayout]
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					})]
		});
		
		oContent.setModel(oController._DetailJSonModel);
		oContent.bindElement("/Data");
		
		return oContent;
	}

});
