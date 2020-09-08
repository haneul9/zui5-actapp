sap.ui.define(['sap/ui/core/UIComponent'],
  function(UIComponent) {
  "use strict";
  var Component = sap.ui.core.UIComponent.extend("zui5_hrxx_rss.Component", {
  metadata: {
  rootView: "zui5_hrxx_rss.Rss",
  dependencies: {
  libs: [
  "sap.m",
  "sap.suite.ui.microchart"
  ]
  },
  config: {
  sample: {
  files: [
//  "view/App.view.xml",
  "Rss.view.js",
//  "App.controller.js"
  "Rss.controller.js"
  ]
  }
  }
  }
  });
  return Component;
});