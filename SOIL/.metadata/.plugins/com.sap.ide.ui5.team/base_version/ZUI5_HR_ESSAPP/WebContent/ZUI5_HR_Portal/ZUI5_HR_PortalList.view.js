//jQuery.sap.require("contorl.XNavigationListItem");
jQuery.sap.require("ZUI5_HR_Portal.control.XNavigationListItem");

sap.ui.jsview("ZUI5_HR_Portal.ZUI5_HR_PortalList", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_Portal.ZUI5_HR_PortalList
	 */
	getControllerName : function() {
		return "ZUI5_HR_Portal.ZUI5_HR_PortalList";
	},
	
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Portal.ZUI5_HR_PortalList
	 */
	createContent : function(oController) {
		jQuery.sap.require("common.ZHR_TABLES");
		
		var model = new sap.ui.model.json.JSONModel();

		var sideNavigation = new sap.tnt.SideNavigation(oController.PAGEID +"_SideNavigation", {
			itemSelect: function (event) {
				var vAuth = oController.getCurrentAuth(oController);
				var vMenuKey = event.getParameter('item').getKey();
				var vCMenuKey = vMenuKey.split("_")[1];
				var vData = [], vPasswordCheck = "", vNewWindow = "";
				if(vAuth == "E"){
					vData = oController._EssMenuList;
				}else if(vAuth == "M"){
					vData = oController._MssMenuList;
				}else if(vAuth == "H"){
					vData = oController._HassMenuList;
				}
				for(var i =0; i<vData.length; i++){
					if(vData[i].Mncod == vMenuKey){
						if(vData[i].Pwuse == true)
							vPasswordCheck = "X";
						if(vData[i].Popup == "X")
							vNewWindow = vData[i].Zzurl;
						
						break;
					}
				
					
				}
				if(vPasswordCheck=="X"){
					common.Password.openPasswordDialog(oController, vMenuKey);
				}else{
					oController.goToPage(oController, vMenuKey, vNewWindow)
				}
			},
			item: new sap.tnt.NavigationList("NList", {
				width : "340px",
				items: {
					template: new sap.tnt.NavigationListItem({
						text: '{title}',
						icon: '{icon}',
						enabled: '{enabled}',
						expanded: '{expanded}',
						items: {
							template: new sap.tnt.NavigationListItem({
								text: '{title}',
								key: '{key}',
							}),
							path: 'items',
							templateShareable : true
						}
					}),
					path : '/Data'
				}
			}),
		}).setModel(model).addStyleClass("width340px");

		var oSuggestionListItemTemplate = new sap.m.SuggestionItem({
			text : "{text}",
			key: "{key}",
			icon: "{icon}"
		});
		
		var navContainer = new sap.m.NavContainer("navContainer",{
			pages: [],
			defaultTransitionName : "show"
		});
		
		var oSearchField = new sap.m.SearchField(oController.PAGEID + "_SFDialog", {
			placeholder: "메뉴 검색",
			width : "200px",
			enableSuggestions: true,
			layoutData : new sap.m.OverflowToolbarLayoutData({
				priority: sap.m.OverflowToolbarPriority.NeverOverflow
			}),
			search:  oController.onSearch,
			suggest: oController.doSuggest
		})
		.setModel(new sap.ui.model.json.JSONModel())
		.bindAggregation("suggestionItems", "/", oSuggestionListItemTemplate);
		
		
		oSearchField.addDelegate({
			onAfterRendering: function() {
				document.getElementById(oController.PAGEID + "_SFDialog-I").style.color = "#000000";
			}
		});
		
		var toolHeader = new sap.tnt.ToolHeader(oController.PAGEID + '_tHeader', {
//			asyncMode : true,
			content: [

				new sap.m.Button('menuToggleButton', {
					icon: 'sap-icon://menu2',
					type: sap.m.ButtonType.Transparent,
					press: function() {
						var toolPage = sap.ui.getCore().byId("toolPage");
						
						var sideExpanded = toolPage.getSideExpanded();
	
						if (sideExpanded) {
							this.setTooltip('Large Size Navigation');
						} else {
							this.setTooltip('Small Size Navigation');
						}
	
						toolPage.setSideExpanded(!sideExpanded);
					},
					layoutData: new sap.m.OverflowToolbarLayoutData({
						priority: sap.m.OverflowToolbarPriority.NeverOverflow
					}),
					tooltip: 'Small Size Navigation'
				}).addStyleClass("PaddingLeft10 PaddingRight10"),

				oSearchField,
		
				new sap.ui.core.Icon({
					size : "1.1rem",
					src : "sap-icon://home",
					press: function() {
						var toolPage = sap.ui.getCore().byId("toolPage");
						toolPage.setSideExpanded(false);
						oController.onClearLev2(oController);
						
						var vAuth = oController.getCurrentAuth(oController);
						if(vAuth =="E"){
							//신청함 refresh
							oController.searchApply(oController);
							//결재함 refresh
							oController.searchSignE(oController);
						}else if(vAuth =="H"){
							//결재함 refresh
							oController.searchSignH(oController);
						}
						navContainer.to(vAuth + "_Home");
					},
					tooltip : "Home",
					color : "#999999",
					layoutData : new sap.m.OverflowToolbarLayoutData({
						priority: sap.m.OverflowToolbarPriority.NeverOverflow
					})
				}).addStyleClass("PaddingLeft20 PaddingRight20"),

				new sap.ui.core.Icon({
					size : "1.1rem",
					src : "sap-icon://favorite",
					press: function() {
						ZUI5_HR_Portal.common.FavoriteController.openFavorite(oController);
					},
					color : "#999999",
					layoutData : new sap.m.OverflowToolbarLayoutData({
						priority: sap.m.OverflowToolbarPriority.NeverOverflow
					})
				}).addStyleClass("PaddingRight40"),
			
				new sap.m.Button(oController.PAGEID +"_Lev2menu_1",{
					type : sap.m.ButtonType.Unstyled,
					layoutData : new sap.m.OverflowToolbarLayoutData({
						priority: sap.m.OverflowToolbarPriority.Low
					}),
					press : oController.onSetSideMenu
				}).addStyleClass("TopMenuButton LinkFontFamilyBold CursorPointer PaddingRight70"),
				new sap.m.Button(oController.PAGEID +"_Lev2menu_2",{
					type : sap.m.ButtonType.Unstyled,
					layoutData : new sap.m.OverflowToolbarLayoutData({
						priority: sap.m.OverflowToolbarPriority.Low
					}),
					press : oController.onSetSideMenu
				}).addStyleClass("TopMenuButton LinkFontFamilyBold CursorPointer PaddingRight70"),
				new sap.m.Button(oController.PAGEID +"_Lev2menu_3",{
					type : sap.m.ButtonType.Unstyled,
					layoutData : new sap.m.OverflowToolbarLayoutData({
						priority: sap.m.OverflowToolbarPriority.Low
					}),
					press : oController.onSetSideMenu
				}).addStyleClass("TopMenuButton LinkFontFamilyBold CursorPointer PaddingRight70"),
				new sap.m.Button(oController.PAGEID +"_Lev2menu_4",{
					type : sap.m.ButtonType.Unstyled,
					layoutData : new sap.m.OverflowToolbarLayoutData({
						priority: sap.m.OverflowToolbarPriority.Low
					}),
					press : oController.onSetSideMenu
				}).addStyleClass("TopMenuButton LinkFontFamilyBold CursorPointer PaddingRight70"),
				new sap.m.Button(oController.PAGEID +"_Lev2menu_5",{
					type : sap.m.ButtonType.Unstyled,
					layoutData : new sap.m.OverflowToolbarLayoutData({
						priority: sap.m.OverflowToolbarPriority.Low
					}),
					press : oController.onSetSideMenu
				}).addStyleClass("TopMenuButton LinkFontFamilyBold CursorPointer PaddingRight70"),
				new sap.m.Button(oController.PAGEID +"_Lev2menu_6",{
					type : sap.m.ButtonType.Unstyled,
					layoutData : new sap.m.OverflowToolbarLayoutData({
						priority: sap.m.OverflowToolbarPriority.Low
					}),
					press : oController.onSetSideMenu
				}).addStyleClass("TopMenuButton LinkFontFamilyBold CursorPointer PaddingRight70"),
				new sap.m.Button(oController.PAGEID +"_Lev2menu_7",{
					type : sap.m.ButtonType.Unstyled,
					layoutData : new sap.m.OverflowToolbarLayoutData({
						priority: sap.m.OverflowToolbarPriority.Low
					}),
					press : oController.onSetSideMenu
				}).addStyleClass("TopMenuButton LinkFontFamilyBold CursorPointer PaddingRight70"),
				new sap.m.Button(oController.PAGEID +"_Lev2menu_8",{
					type : sap.m.ButtonType.Unstyled,
					layoutData : new sap.m.OverflowToolbarLayoutData({
						priority: sap.m.OverflowToolbarPriority.Low
					}),
					press : oController.onSetSideMenu
				}).addStyleClass("TopMenuButton LinkFontFamilyBold CursorPointer PaddingRight70"),
				new sap.m.Button(oController.PAGEID +"_Lev2menu_9",{
					type : sap.m.ButtonType.Unstyled,
					layoutData : new sap.m.OverflowToolbarLayoutData({
						priority: sap.m.OverflowToolbarPriority.Low
					}),
					press : oController.onSetSideMenu
				}).addStyleClass("TopMenuButton LinkFontFamilyBold CursorPointer PaddingRight70"),
//				new sap.tnt.ToolHeaderUtilitySeparator({
//				}),
//				new sap.m.ToolbarSpacer({
//					layoutData : new sap.m.OverflowToolbarLayoutData({
//						priority: sap.m.OverflowToolbarPriority.NeverOverflow,
//						minWidth: "20px"
//					})
//				})
			]
		}).setModel(oController._DetailJSonModel)
		.bindElement("/Data");

		if (sap.ui.Device.media.getCurrentRange('StdExt').name === 'Phone' ||
				sap.ui.Device.media.getCurrentRange('StdExt').name === 'Tablet') {
			toolHeader.getAggregation('content')[0].setTooltip('Large Size Navigation');
		}
		
		
		
		var oPage = new sap.tnt.ToolPage("toolPage",{
			header: toolHeader,

			sideContent: sideNavigation,

			mainContents: [navContainer]
			
		}).addStyleClass("LaunchpadBackground");
		
		var oPage2 = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [ 
				oPage,
			],
			customHeader : new sap.m.Toolbar({
					height : "30px",
					content : [
						new sap.m.ToolbarSpacer({width : "10px"}),
						new sap.m.Toolbar(oController.PAGEID + "_Lev1Menu",{
							
						}),
					    new sap.m.ToolbarSpacer(),
					    new sap.m.Text({
							text: "{Ename}" + " 님",
						}).addStyleClass("Font12px3"),
						new sap.m.ToolbarSpacer({ width : "10px"}),
						new sap.m.Image({
							src : "{Photo}" ,
							height : "30px" ,
							width : "30px",
							visible : { path : "Photo" , 
								        formatter : function(fVal){
								             if(fVal && fVal != "") return true ;
				                             else return false;
		                               }
							}
						}).addStyleClass("imageCircle"),
						new sap.m.ToolbarSpacer({ width : "10px"}),
						new sap.m.Image({
							src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Top_icon_Logout.png",
							press : function(){
								jQuery.ajax({ 
									url: '/sap/public/bc/icf/logoff', 
									 async: false
									 }).success(function(){ 
//									alert('로그아웃 되었습니다.'); 
									}).complete(function(){ 
//									location.reload();
										window.open("/sap/public/bc/ui2/Custom/Logoff.html", "_self" );
									 });
							}
						}),
						new sap.m.ToolbarSpacer({ width : "20px"}),
					]
				}).setModel(oController._DetailJSonModel)
				.bindElement("/Data")
				.addStyleClass("OrangeBackground"),
			showHeader : true,
		}).addStyleClass("WhiteBackground") ;
		
		return oPage2 ;
	}

});