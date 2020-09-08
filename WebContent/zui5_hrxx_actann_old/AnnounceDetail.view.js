sap.ui.jsview("zui5_hrxx_actann.AnnounceDetail", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actann.AnnounceDetail
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actann.AnnounceDetail";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actann.AnnounceDetail
	*/ 
	createContent : function(oController) {
        
        jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.Common");
		
		var oHtmlPanel = new sap.m.Panel(oController.PAGEID + "_Panel", {
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://notification-2", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ANNCOUNCE_DETAIL")}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : []
		}); //.addStyleClass("L2PBackgroundWhite");
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oHtmlPanel
			           ]
		});
		
		var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
			contentRight : [         
							new sap.m.Button({
								 text : oBundleText.getText( "PRINT_BTN"),
								 press : oController.onPressPrint
							})
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
									   			text : oBundleText.getText( "TITLE_ACT_ANNOUNCE_DETAIL")
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeaderBar"),
			footer : oFooterBar 
		}) ;
		
		return oPage ;
	}

});