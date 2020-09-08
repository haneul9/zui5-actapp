jQuery.sap.declare("common.baseAppController");

jQuery.sap.require("common.AppConfig");
jQuery.sap.require("common.NavigationHandler");

(function($) {
	var instance = null;

	common.baseAppController = function(sName, oControllerConfig) {
		if (instance) {
			if (sName || oControllerConfig) {
				jQuery.sap.log
						.error("base appController should only be configured once!");
			}
			return instance;
		}

		// ???????? Navigation Handler?? ?????Ѵ?.
		jQuery.extend(true, oControllerConfig, {
			configureApplication : function(oApp, oAppConfig) {
				// initialize global Navigation Handling

				this.navHandler = new common.NavigationHandler(oApp,
						new common.AppConfig(oAppConfig)).subscribe();
			}
		});
		instance = sap.ui.controller(sName, oControllerConfig);
	};
}(jQuery));