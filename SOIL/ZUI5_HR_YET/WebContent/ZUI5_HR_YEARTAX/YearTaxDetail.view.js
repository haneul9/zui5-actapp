sap.ui.jsview("ZUI5_HR_YEARTAX.YearTaxDetail", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	getControllerName : function() {
		return "ZUI5_HR_YEARTAX.YearTaxDetail";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	createContent : function(oController){					
		var oIcontabbar = new sap.m.IconTabBar(oController.PAGEID + "_Icontabbar", {
			expandable : false,
			expanded : true,
			backgroundDesign : "Transparent",
			items : [new sap.m.IconTabFilter({
						 key : "1",
						 icon : "sap-icon://bbyd-dashboard",
						 text : "종합안내",
						 design : "Horizontal",
						 iconColor : "Default",
						 content : [sap.ui.jsfragment("ZUI5_HR_YEARTAX.fragment.Detail01", oController)]
					 }),
					 new sap.m.IconTabSeparator({icon : "sap-icon://process"}),
					 new sap.m.IconTabFilter({
						 key : "2",
						 icon : "sap-icon://family-care",
						 text : "인적공제",
						 design : "Horizontal",
						 iconColor : "Critical",
						 content : [sap.ui.jsfragment("ZUI5_HR_YEARTAX.fragment.Detail02", oController)]
					 }),
					 new sap.m.IconTabSeparator({icon : "sap-icon://process"}),
					 new sap.m.IconTabFilter({
						 key : "3",
						 icon : "sap-icon://attachment",
						 text : "국세청자료",
						 design : "Horizontal",
						 iconColor : "Neutral",
						 content : [sap.ui.jsfragment("ZUI5_HR_YEARTAX.fragment.Detail03", oController)]
					 }),
					 new sap.m.IconTabSeparator({icon : "sap-icon://process"}),
					 new sap.m.IconTabFilter({
						 key : "4",
						 icon : "sap-icon://money-bills",
						 text : "소득공제",
						 design : "Horizontal",
						 iconColor : "Negative",
						 content : [sap.ui.jsfragment("ZUI5_HR_YEARTAX.fragment.Detail04", oController)]
					 }),
					 new sap.m.IconTabSeparator({icon : "sap-icon://process"}),
					 new sap.m.IconTabFilter({
						 key : "5",
						 icon : "sap-icon://approvals",
						 text : "양식출력",
						 design : "Horizontal",
						 iconColor : "Positive",
						 content : [sap.ui.jsfragment("ZUI5_HR_YEARTAX.fragment.Detail05", oController)]
					 }),
					 new sap.m.IconTabSeparator({icon : "sap-icon://vertical-grip"}),
					 new sap.m.IconTabFilter({
						 key : "6",
						 icon : "sap-icon://simulate",
						 text : "모의실행",
						 design : "Horizontal",
						 iconColor : "Positive",
						 content : [sap.ui.jsfragment("ZUI5_HR_YEARTAX.fragment.Detail06", oController)]
					 })],
			select : oController.handleIconTabBarSelect,
			content : []
		});	
		
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
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					})]
		});
				
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [new sap.ui.core.HTML({content : "<div style='height:10px; background-color:#eff4f9'></div>"}), oIcontabbar],
			customHeader : [new sap.m.Bar({
								contentMiddle : [new sap.m.Text({text : "연말정산 입력 및 조회"}).addStyleClass("TitleFont")]
						    }).addStyleClass("Header")],
			footer : [new sap.m.Bar({
							contentRight : [new sap.m.Button({
												text : "저장",
												icon : "sap-icon://save",
												type : "Emphasized",
												press : oController.onPressSave,
												visible : {
													parts : [{path : "Pystat"}, {path : "Yestat"}],
													formatter : function(fVal1, fVal2){
														return fVal1 == "1" && fVal2 == "1" ? true : false;
													}
												}
											}),
											new sap.m.Button({
												text : "최종입력완료",
												icon : "sap-icon://complete",
												type : "Emphasized",
												press : oController.onPressComplete,
												visible : {
													parts : [{path : "Pystat"}, {path : "Yestat"}],
													formatter : function(fVal1, fVal2){
														return fVal1 == "1" && fVal2 == "1" ? true : false;
													}
												}
											})]
				 	  })]
		}).addStyleClass("WhiteBackground");
		
		oPage.setModel(oController._DetailJSonModel);
		oPage.bindElement("/Data");
		 
		return oPage;
	}
	
});
