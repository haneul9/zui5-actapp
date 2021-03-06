// @copyright@

"use strict";
/* global jQuery, sap, window, hasher */

jQuery.sap.declare("zui5_hrxx_imagetile.Imagetile.Component");

sap.ui.define([
               "sap/ui/core/UIComponent"
    ], function(UIComponent) {
        "use strict";
        return UIComponent.extend("zui5_hrxx_imagetile.Imagetile.Component", {
            metadata : {
                "manifest": "json"
            },

//            // new API
//            tileSetVisible : function(bNewVisibility) {
//                // forward to controller
//                this._controller.visibleHandler(bNewVisibility);
//            },
//
//            // new API
//            tileRefresh : function() {
//                // forward to controller
//                this._controller.refreshHandler(this._controller);
//            },
//
//            // new API
//            tileSetVisualProperties : function(oNewVisualProperties) {
//                // forward to controller
//                this._controller.setVisualPropertiesHandler(oNewVisualProperties);
//            },

            createContent : function() {
                var oTile = sap.ui.view({
                    viewName : "zui5_hrxx_imagetile.Imagetile.Imagetile",
                    type : sap.ui.core.mvc.ViewType.JS
                });

                this._controller = oTile.getController();

                return oTile;
            }
        });
});
