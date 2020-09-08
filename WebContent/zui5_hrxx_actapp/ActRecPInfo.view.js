sap.ui.jsview("zui5_hrxx_actapp.ActRecPInfo", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actapp.ActRecPInfo
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp.ActRecPInfo";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actapp.ActRecPInfo
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
			select : oController.onTabSelected,
			showSelection : false,
			items : [
			   new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub01", {
				   key : "Sub01",
				   count: 0,
				   text : oBundleText.getText( "TSUB01F"),
				   content : sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Sub01", oController)
			   }),
			   new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub02", {
				   key : "Sub02",
				   text : oBundleText.getText( "TSUB02F_2"), 
				   count: 0,
				   content : sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Sub02", oController)
			   }),
			   new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub03", {
				   key : "Sub03",
				   text : oBundleText.getText( "TSUB03F"),
				   count: 0,
				   content : sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Sub03", oController)
			   }),
			   new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub04", {
				   key : "Sub04",
				   text : oBundleText.getText( "TSUB04F"),
				   count: 0,
				   content : sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Sub04", oController)
			   }),
			   new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub06", {
				   key : "Sub06",
				   text : oBundleText.getText( "TSUB06F"),
				   count: 0,
				   content : sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Sub06", oController)
			   }),
			   new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub07", {
				   key : "Sub07",
				   text : oBundleText.getText( "TSUB07F"),
				   count: 0,
				   content : sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Sub07", oController)
			   }),
			],
		}); 
        var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
        	contentLeft : [ new sap.m.Button(oController.PAGEID + "_REHIRE_BTN", {
				             	text : oBundleText.getText("REHIRE_INFO_SEARCH"),
				             	press : oController.onPressRehireSearch,
				             	visible : false
				             })],
			contentRight : [         
		 	                new sap.m.Button(oController.PAGEID + "_SAVE_BTN", {
		 	                	text : oBundleText.getText("SAVE_BTN"),
		 	                	press : oController.onPressSave,
		 	                	visible : false
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_ADD_BTN", {
				             	text : oBundleText.getText("ADD_BTN"),
				             	press : oController.onPressAdd,
		 	                	visible : false
				            }),
		 	                new sap.m.Button(oController.PAGEID + "_MODIFY_BTN", {
		 	                	text : oBundleText.getText("MODIFY_BTN"),
		 	                	press : oController.onPressModify,
		 	                	visible : false
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_DELETE_BTN", {
		 	                	text : oBundleText.getText("DELETE_BTN"),
		 	                	press : oController.onPressDelete,
		 	                	visible : false
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_DELETE_BTN_SUB07", {
		 	                	text : oBundleText.getText("DELETE_BTN"),
		 	                	press : oController.onPressDeleteSub07,
		 	                	visible : false
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