// @copyright@

"use strict";
/* global jQuery, sap, window, hasher */

jQuery.sap.declare("zhr_dynamic_tile.DynamicTile.Component");

sap.ui.define([
               "sap/ui/core/UIComponent"
    ], function(UIComponent) {
        "use strict";
        return UIComponent.extend("zhr_dynamic_tile.DynamicTile.Component", {
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
                    viewName : "zhr_dynamic_tile.DynamicTile.DynamicTile",
                    type : sap.ui.core.mvc.ViewType.JS
                });

                this._controller = oTile.getController();

                return oTile;
            }
        });
});
