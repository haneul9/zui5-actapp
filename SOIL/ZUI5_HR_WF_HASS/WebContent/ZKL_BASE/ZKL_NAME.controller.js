jQuery.sap.require("control.BusyIndicator");
jQuery.sap.require("common.TooltipProfile");

sap.ui
		.controller(
				"ZKL_BASE.ZKL_NAME",
				{
					/**
					 * Is initially called once after the Controller has been
					 * instantiated. It is the place where the UI is
					 * constructed. Since the Controller is given to this
					 * method, its event handlers can be attached right away.
					 * 
					 * @memberOf ZKL_BASE.ZKL_NAME
					 */

					PAGEID : "ZKL_NAME",

					onInit : function() {
						console.log("asdf");
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
					},

					onBeforeShow : function(oEvent) {
						console.log("ASDFDFDFDFDFD");
					},

					onAfterRender : function(oEvent) {},

					handleNavHome : function(oEvent) {}
				});