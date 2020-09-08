jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("control.ZNK_BusyAccessor");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("control.BusyIndicator");
jQuery.sap.require("common.Common");


sap.ui.controller("ZNK_WF_DUMMY.ZNK_WF_DUMMY", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZNK_WF_DUMMY.ZNK_WF_DUMMY
	 */

	PAGEID : "ZNK_WF_DUMMY",

	onInit : function() {
		console.log("asdf");
//		if (!jQuery.support.touch) {
//			this.getView().addStyleClass("sapUiSizeCompact");
//		};

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
		bus.subscribe("app", "OpenWindow", this.SmartSizing, this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing, this);
	},

	onBeforeShow : function(oEvent) {
		console.log("ASDFDFDFDFDFD");
	},

	onAfterRender : function(oEvent) {},

	handleNavHome : function(oEvent) {},
	SmartSizing : function(oEvent){},
});

