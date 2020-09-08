//sap.ui.define(['sap/ui/core/UIComponent'],
//  function(UIComponent) {
//  "use strict";
//  var Component = sap.ui.core.UIComponent.extend("zhr_vacation.Component", {
//  metadata: {
//  rootView: "zhr_vacation.Vacation",
//  dependencies: {
//  libs: [
//  "sap.m",
//  "sap.suite.ui.microchart"
//  ]
//  },
//  config: {
//  sample: {
//  files: [
////  "view/App.view.xml",
//  "Vacation.view.js",
////  "App.controller.js"
//  "Vacation.controller.js"
//  ]
//  }
//  }
//  }
//  });
//  return Component;
//});

// @copyright@

"use strict";
/* global jQuery, sap, window, hasher */

jQuery.sap.declare("zhr_vacation.Vacation.Component");

sap.ui.define([
               "sap/ui/core/UIComponent"
    ], function(UIComponent) {
        "use strict";
        return UIComponent.extend("zhr_vacation.Vacation.Component", {
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
                    viewName : "zhr_vacation.Vacation.Vacation",
                    type : sap.ui.core.mvc.ViewType.JS
                });

                this._controller = oTile.getController();

                return oTile;
            }
        });
});
