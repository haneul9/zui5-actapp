sap.ui.jsfragment("ZUI5_HR_YEARTAX.fragment.Detail05", {
	/** 양식출력 **/
	createContent : function(oController) {
		
		var oSegmentedButton = new sap.m.SegmentedButton({
			selectedKey : "{Key}",
			selectionChange : oController.onPressSearch5,
			items : [new sap.m.SegmentedButtonItem({
						 key : "1",
						 text : "소득공제신고서",
						 width : "150px"
					 }),
					 new sap.m.SegmentedButtonItem({
						 key : "2",
						 text : "의료비지급명세서",
						 width : "150px"
					 }),
					 new sap.m.SegmentedButtonItem({
						 key : "3",
						 text : "기부금명세서",
						 width : "150px"
					 }),
					 new sap.m.SegmentedButtonItem({
						 key : "4",
						 text : "원천징수영수증",
						 width : "150px"
					 })]
		});
		
		var oLayout = new sap.ui.layout.VerticalLayout({
			width : "100%",
			content : [oSegmentedButton,
					   new sap.ui.core.HTML({content : "<div style='height:10px'></div>"}),
					   new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Detail5_PDF")]
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
