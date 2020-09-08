//sap.ui.define(['sap/ui/core/UIComponent'],
//  function(UIComponent) {
//  "use strict";
//  var Component = sap.ui.core.UIComponent.extend("zui5_hrxx_graph.Component", {
//  metadata: {
//  rootView: "zui5_hrxx_graph.Graph",
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
//  "Graph.view.js",
////  "App.controller.js"
//  "Graph.controller.js"
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

jQuery.sap.declare("zui5_hrxx_graph.Graph.Component");

sap.ui.define([
               "sap/ui/core/UIComponent"
    ], function(UIComponent) {
        "use strict";
        return UIComponent.extend("zui5_hrxx_graph.Graph.Component", {
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
                    viewName : "zui5_hrxx_graph.Graph.Graph",
                    type : sap.ui.core.mvc.ViewType.JS
                });

                this._controller = oTile.getController();

                return oTile;
            }
        });
});
