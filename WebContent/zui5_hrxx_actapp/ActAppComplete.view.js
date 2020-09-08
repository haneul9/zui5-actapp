sap.ui.jsview("zui5_hrxx_actapp.ActAppComplete", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actapp.ActAppComplete
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp.ActAppComplete";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actapp.ActAppComplete
	*/ 
	createContent : function(oController) {
//		var locale = sap.ui.getCore().getConfiguration().getLanguage(); //언어
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : locale
//        });
		
		var oListPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://collaborate", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("MSG_COMPLETE_NOTICE")}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer({width : "15px"}),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/Apply.png"}),
				           new sap.m.Label({text : oBundleText.getText("STATUSC")}).addStyleClass("L2P13Font"),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/Error.png"}),
				           new sap.m.Label({text : oBundleText.getText("STATUSE")}).addStyleClass("L2P13Font"),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/Lock.png"}),
				           new sap.m.Label({text : oBundleText.getText("STATUSL")}).addStyleClass("L2P13Font"),]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActtionSubjectList", oController)]
		});
        
        var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oListPanel
			           ]
		});
        
		var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
			contentRight : [         
		 	                new sap.m.Button(oController.PAGEID + "_COMPLETE_BTN", {
		 	                	text : oBundleText.getText( "COMPLETE_BTN"),
		 	                	press : oController.onPressComplete
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_CANCEL_BTN", {
		 	                	text : oBundleText.getText( "CANCEL_BTN"),
		 	                	press : oController.navToBack
		 	                }),
		 	                ]
		});
        
        var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentLeft : new sap.m.Button({
												icon : "sap-icon://nav-back" ,
												press: oController.navToBack
											}),
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText("TITLE_ACTREQ_COMPLETE")
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