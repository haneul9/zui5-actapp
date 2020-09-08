//jQuery.sap.require("contorl.XNavigationListItem");
jQuery.sap.require("ZUI5_HR_ChartTest4.control.XNavigationListItem");

sap.ui.jsview("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List
	 */
	getControllerName : function() {
		return "ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List
	 */
	createContent : function(oController) {
		var model = new sap.ui.model.json.JSONModel();

		var sideNavigation = new sap.tnt.SideNavigation("SNav", {
//			expanded: false,
			itemSelect: function (event) {
				navContainer.to(event.getParameter('item').getKey())
			},
			item: new sap.tnt.NavigationList("NList", {
				items: {
					template: new sap.tnt.NavigationListItem({
						text: '{title}',
						icon: '{icon}',
						enabled: '{enabled}',
						expanded: '{expanded}',
						items: {
							template: new sap.tnt.NavigationListItem({
//							template: new ZUI5_HR_ChartTest4.control.XNavigationListItem({ 
								text: '{title}',
								key: '{key}',
//								enabled: '{enabled}'
//								icon: 'sap-icon://favorite',
								icon: {
									path : 'favoriteyn',
									formatter : function(fVal) {
										if (!common.Common.checkNull(fVal) && fVal == "Y"){
											return 'sap-icon://favorite';
										}else{
											return 'sap-icon://unfavorite';
										}
									}
								}
							}),
							
//							template: new sap.tnt.NavigationListItem.extend({
//								metadata : {
//									library : "sap.tnt",
//									property : { text: '{title}',
//												 key: '{key}' },
//								}
//							}),
							
							
							path: 'items',
							templateShareable : true
						}
					}),

					path: '/navigation'
				}
			}),
//			fixedItem: new sap.tnt.NavigationList({
//				items: {
//					template: new sap.tnt.NavigationListItem({
//						text: '{title}',
//						icon: '{icon}'
//					}),
//					path: '/fixedNavigation'
//				}
//			})
		}).setModel(model);

		var navContainer = new sap.m.NavContainer("navContainer",{
			pages: [],
			defaultTransitionName : "show"
		});

		var toolHeader = new sap.tnt.ToolHeader('tHeader', {
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
				}),
				new sap.m.ToolbarSpacer({
					width: '20px'
				}),
				new sap.m.Button({
					type: sap.m.ButtonType.Transparent,
					text: "Home",
					press: function() {
						navContainer.to("Home");
					},
					layoutData: new sap.m.OverflowToolbarLayoutData({
						priority: sap.m.OverflowToolbarPriority.Low
					})
				}),
				new sap.m.Button({
					type: sap.m.ButtonType.Transparent,
					text: "즐겨찾기",
					press: function() {
						oController.openFavorite()
					},
					layoutData: new sap.m.OverflowToolbarLayoutData({
						priority: sap.m.OverflowToolbarPriority.Low
					})
				}),
				
				new sap.tnt.ToolHeaderUtilitySeparator({
				}),
				new sap.m.ToolbarSpacer({
					layoutData : new sap.m.OverflowToolbarLayoutData({
						priority: sap.m.OverflowToolbarPriority.NeverOverflow,
						minWidth: "20px"
					})
				}),
				new sap.m.Button({
					type: sap.m.ButtonType.Transparent,
					text: "Total Reward Dashboard",
					press: oController.onOpenDashboard,
					layoutData: new sap.m.OverflowToolbarLayoutData({
						priority: sap.m.OverflowToolbarPriority.NeverOverflow
					})
				}),
				new sap.m.Button({
					type: sap.m.ButtonType.Transparent,
					text: "Total Reward Dashboard 부서장",
					press: oController.onOpenDashboard2,
					layoutData: new sap.m.OverflowToolbarLayoutData({
						priority: sap.m.OverflowToolbarPriority.NeverOverflow
					})
				}),
				new sap.m.Image({
					src : "{Photo}" ,
					height : "45px" ,
					width : "45px",
					visible : { path : "Photo" , 
						        formatter : function(fVal){
						             if(fVal && fVal != "") return true ;
		                             else return false;
                               }
					}
				}).addStyleClass("imageCircle"),
				new sap.m.ToolbarSpacer({ width : "10px"}),
				new sap.m.Button({
					type: sap.m.ButtonType.Transparent,
					text: "{Ename}" + " 님",
					press: function() {

					},
					layoutData: new sap.m.OverflowToolbarLayoutData({
						priority: sap.m.OverflowToolbarPriority.NeverOverflow
					})
				})
			]
		}).setModel(oController._DetailJSonModel)
		.bindElement("/Data");

		if (sap.ui.Device.media.getCurrentRange('StdExt').name === 'Phone' ||
				sap.ui.Device.media.getCurrentRange('StdExt').name === 'Tablet') {
			toolHeader.getAggregation('content')[0].setTooltip('Large Size Navigation');
		}
		
		
		
		var oBlockLayout = new sap.m.TileContainer({
			width: "100%",
			height: "100%",
			tiles:[
				new sap.m.StandardTile({
					type : "Create",
					info : "28 days left",
					infoState : "Success",
					title : "Create Leave Request",
					removable: false
				}),
				new sap.m.StandardTile({
					icon : "images/action.png",
					title : "Leave Request History",
					type: "Monitor"
				}),
				new sap.m.StandardTile({
					icon : "images/travel_expense_report.png",
					info : "Waiting for Approval",
					infoState : "Warning",
					number : "787",
					numberUnit : "euro",
					title : "Travel Reimbursement"
				}),
				new sap.m.StandardTile({
					icon : "images/action.png",
					title : "Travel Reimbursement History",
					type: "Monitor"
				}),
				new sap.m.StandardTile({
					type : "Create",
					info : "On Hold",
					infoState : "Error",
					title : "Create Purchase Order"
				}),
				new sap.m.StandardTile({
					icon : "images/analytics_64.png",
					title : "Financial report",
					type: "Monitor"
				}),
				new sap.m.StandardTile({
					icon : "images/analytics_grey_64.png",
					title : "Team Report",
					type: "Monitor",
					removable: false
				}),
				new sap.m.StandardTile({
					type : "Create",
					info : "28 days left",
					infoState : "Success",
					title : "Create Leave Request"
				}),
				new sap.m.StandardTile({
					icon : "images/action.png",
					title : "Leave Request History",
					type: "Monitor"
				}),
				new sap.m.StandardTile({
					icon : "images/travel_expense_report.png",
					info : "Waiting for Approval",
					infoState : "Warning",
					number : "787",
					numberUnit : "euro",
					title : "Travel Reimbursement"
				}),
				new sap.m.StandardTile({
					icon : "images/action.png",
					title : "Travel Reimbursement History",
					type: "Monitor"
				}),
				new sap.m.StandardTile({
					type : "Create",
					info : "On Hold",
					infoState : "Error",
					title : "Create Purchase Order"
				}),
				new sap.m.StandardTile({
					icon : "images/analytics_64.png",
					title : "Financial report",
					type: "Monitor"
				}),
				new sap.m.StandardTile({
					icon : "images/analytics_grey_64.png",
					title : "Team Report",
					type: "Monitor"
				}),
				new sap.m.StandardTile({
					type : "Create",
					info : "28 days left",
					infoState : "Success",
					title : "Create Leave Request"
				}),
				new sap.m.StandardTile({
					icon : "images/action.png",
					title : "Leave Request History",
					type: "Monitor"
				}),
				new sap.m.StandardTile({
					icon : "images/travel_expense_report.png",
					info : "Waiting for Approval",
					infoState : "Warning",
					number : "787",
					numberUnit : "euro",
					title : "Travel Reimbursement"
				}),
				new sap.m.StandardTile({
					icon : "images/action.png",
					title : "Travel Reimbursement History",
					type: "Monitor"
				}),
				new sap.m.StandardTile({
					type : "Create",
					info : "On Hold",
					infoState : "Error",
					title : "Create Purchase Order"
				}),
				new sap.m.StandardTile({
					icon : "images/analytics_64.png",
					title : "Financial report",
					type: "Monitor"
				}),
				new sap.m.StandardTile({
					icon : "images/analytics_grey_64.png",
					title : "Team Report",
					type: "Monitor"
				})
			],
			tileDelete: function(evt){
				var tile = evt.getParameter("tile");
				evt.getSource().removeTile(tile);
			}
		});
		
		
		var oPage = new sap.tnt.ToolPage("toolPage",{
			header: toolHeader,

			sideContent: sideNavigation,

			mainContents: [navContainer]
			
//			mainContents : oBlockLayout
		}).addStyleClass("LaunchpadBackground");
		
		return oPage ;
	}

});