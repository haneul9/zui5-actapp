sap.ui.jsview("ZNK_WF_PORTAL.ZNK_PORTAL", {

	/**
	 * Specifies the Controller belonging to this View. In the case that it is
	 * not implemented, or that "null" is returned, this View does not have a
	 * Controller.
	 * 
	 * @memberOf ZNK_WF_PORTAL.ZNK_PORTAL
	 */
	getControllerName : function() {
		return "ZNK_WF_PORTAL.ZNK_PORTAL";
	},

	/**
	 * Is initially called once after the Controller has been instantiated. It
	 * is the place where the UI is constructed. Since the Controller is given
	 * to this method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZNK_WF_PORTAL.ZNK_PORTAL
	 */
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.Formatter");
		
		var oContent = new sap.m.SplitContainer(oController.PAGEID+"_notUnifiedSpllit", {
			detailPages : [],
			mode : sap.m.SplitAppMode.HideMode,
			masterPages : [new sap.m.Text({text : "마스터 페이지"})]
		});
		
		
		var oSideNavigation = new sap.tnt.SideNavigation(oController.PAGEID
				+ "_sideNavi", {
			expanded : true,
			item : new sap.tnt.NavigationList(oController.PAGEID + "_sideNaviList"),
			itemSelect : oController.onSelectSideTab
		});
		
		var oToolPage = new sap.tnt.ToolPage(oController.PAGEID + "_toolPage",
				{
					sideContent : oSideNavigation,
					mainContents : oContent
				});
		
		var oHomeButton = new sap.m.Button(oController.PAGEID + "_Home",{
			type : "Transparent",
			icon : "sap-icon://home",
			press : oController.onPressHome,
			visible : false
		}).addStyleClass("exitButton");
		
		var oLeftButton = new sap.m.Button(oController.PAGEID + "_Back",{
			type : "Transparent",
			icon : "sap-icon://close-command-field",
			press : onBack,
			visible : false
		}).addStyleClass("exitButton");
		
		function onBack(nos){
			var oView = sap.ui.getCore().byId(oPageIds[nos]);
			var oController = oView.getController();
			oController.onBack();
		};
		function closeMe()
		{
		var win = window.open("about:blank","_self"); /* url = “” or “about:blank”; target=”_self” */
		win.close();
		};
		var oWelcomeName = new sap.m.Text(oController.PAGEID + "_WelcomeName").addStyleClass("ToolbarText");
		
		var oPage = new sap.m.Page({
			customHeader : new sap.m.Bar(oController.PAGEID + "_BackButton",{
				width : "100%",
//				contentLeft : [oLeftButton],
				contentLeft : [ new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZNK_COMMON_UI5/images/logo.png",
												 width : "170px",
								})],
				contentMiddle : new sap.m.Text(oController.PAGEID + "_MyTitle").addStyleClass("TitleFont"),
				contentRight : [oWelcomeName,
				                oHomeButton,
				                new sap.m.Button(oController.PAGEID+"_FullScreenBtn",{
				    				type : "Transparent",
				    				icon : "sap-icon://resize",
				    				press : oController.onFullScreen
				    			}).addStyleClass("exitButton"),
				                new sap.m.Button({
				    				type : "Transparent",
				    				icon : "sap-icon://decline",
				    				press : function(oEvent){
				    					self.parent.parent.close();
				    				}
				    			}).addStyleClass("exitButton")]
			}).addStyleClass("L2PHeader"),
			content : [oToolPage],
//			footer : new sap.m.Toolbar({
//				height : "40px",
////				content : [ new sap.m.ToolbarSpacer({width:"50px"}), new sap.m.Text(oController.PAGEID + "_Message").addStyleClass("L2PFontFamily")]
//				content : [ new sap.m.ToolbarSpacer(),
//							new sap.m.Button(oController.PAGEID + "_FootButton1",{
//								press : oController.onPressFootButton1
//							}).addStyleClass("L2PFontFamily L2PPaddingRight10 sapUiSizeCompact"),
//							new sap.m.Button(oController.PAGEID + "_FootButton2",{
//								press : oController.onPressFootButton2
//							}).addStyleClass("L2PFontFamily L2PPaddingRight10 sapUiSizeCompact"),
//							new sap.m.Button(oController.PAGEID + "_FootButton3",{
//								press : oController.onPressFootButton3
//							}).addStyleClass("L2PFontFamily sapUiSizeCompact"),
//							new sap.m.ToolbarSpacer({width:"10px"}),
//							
//							]
//			}) //.addStyleClass("L2PPageFooter")
		});

		return oPage;

	}

});;