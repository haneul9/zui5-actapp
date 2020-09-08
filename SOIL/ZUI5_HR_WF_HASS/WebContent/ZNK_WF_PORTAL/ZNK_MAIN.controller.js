//jQuery.sap.require("control.BusyIndicator");
//jQuery.sap.require("common.TooltipProfile");
//jQuery.sap.require("control.ZNK_SapBusy");
//jQuery.sap.require("control.ZNK_BusyAccessor");
//jQuery.sap.require("common.ZNK_MBOLayout");
//jQuery.sap.require("control.ZNK_MBOController");
sap.ui
		.controller(
				"ZNK_WF_PORTAL.ZNK_MAIN",
				{
					/**
					 * Is initially called once after the Controller has been
					 * instantiated. It is the place where the UI is
					 * constructed. Since the Controller is given to this
					 * method, its event handlers can be attached right away.
					 * 
					 * @memberOf ZNK_WF_PORTAL.ZNK_MAIN
					 */

					PAGEID : "ZNK_MAIN",
					_Auth : "",
					_Ename : "",
					oLoadGui : "",
					currentKey : "",    
					vStats : "",
					onInit : function() {

//						if (!jQuery.support.touch) {
//							this.getView().addStyleClass("sapUiSizeCompact");
//						};

						this.getView().addEventDelegate({
							onBeforeShow : jQuery.proxy(function(evt) {
								this.onBeforeShow(evt);
							}, this)
						});

						this.getView().addEventDelegate({
							onAfterRendering : jQuery.proxy(function(evt) {
								this.onAfterRender(evt);
							}, this),
						});
						
						var bus = sap.ui.getCore().getEventBus();
						bus.subscribe("app", "OpenWindow", this.SmartSizing,
								this);

						var bus2 = sap.ui.getCore().getEventBus();
						bus2.subscribe("app", "ResizeWindow", this.SmartSizing,
								this);
					},
					
					SmartSizing : function(oEvent){
						var oView = sap.ui.getCore().byId("ZNK_WF_PORTAL.ZNK_MAIN");
						var oController = oView.getController();
						sap.ui.getCore().byId(oController.PAGEID + "_Row").setHeight(window.innerHeight - 100 + "px");
					},

					onBeforeShow : function(oEvent) {

					},

					onAfterRender : function(oEvent) {},
					
					loadProfile : function(oEvent){},
					onFullScreen : function(oEvent){},
					onExpanding : function(oEvent) {},

					_setToggleButtonTooltip : function(bLarge) {},
					
					itemCase : function() {},
					
					loadMenu : function(oEvent){},
					
					onGotoBaseScreen : function(oEvent) {},
					
					onRefresh : function(oKey){},
					
					onGubun : function(oEvent){},
					
					onSelectSideTab : function(oEvent, oRepeatedKey) {},
				});