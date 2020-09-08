sap.ui.jsview("zui5_hrxx_actapp2.ActConPInfo", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actapp2.ActConPInfo
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp2.ActConPInfo";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actapp2.ActConPInfo
	*/ 
	createContent : function(oController) {
		
		var oNameLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_NameLayout",{
			width : "100%",
			layoutFixed : false,
			visible : false,
			columns : 1
		});
        var oRow = new sap.ui.commons.layout.MatrixLayoutRow();
        var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label(oController.PAGEID + "_NameLayoutText",{text: ""}).addStyleClass("L2P22Font L2P13FontBold")]
		}).addStyleClass("L2PPaddingHeader");
		oRow.addCell(oCell);
		oNameLayout.addRow(oRow);
		 
        var oIconTabBar = new sap.m.IconTabBar(oController.PAGEID + "_TABBAR", {
			upperCase : true,
//			select : oController.onTabSelected,
			showSelection : false,
			items : [
			   new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub01", {
				   key : "Sub01",
				   count: 0,
				   text : oBundleText.getText( "TSUB01F"),
				   content : []
			   }),
			],
		});
        var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
        	contentLeft : [ ],
			contentRight : [         
		 	                new sap.m.Button(oController.PAGEID + "_SAVE_BTN", {
		 	                	text : oBundleText.getText("SAVE_BTN"),
		 	                	press : oController.onPressSave
		 	                })
		 	                ]
		});
        
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oNameLayout, oIconTabBar],
			customHeader : new sap.m.Bar({
								contentLeft : new sap.m.Button({
												icon : "sap-icon://nav-back" ,
												press: oController.navToBack
											}),
								contentMiddle : new sap.m.Text(oController.PAGEID + "_PAGETITLE", {
									   			text : oBundleText.getText("ADD_REC_BTN")
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeaderBar") ,
			footer : oFooterBar 
		}) ;
		
		return oPage ;
	}

});