sap.ui.define(['sap/ui/core/UIComponent'],
  function(UIComponent) {
  "use strict";
  var Component = sap.ui.core.UIComponent.extend("zhr_payreport.Component", {
  metadata: {
  rootView: "zhr_payreport.Payreport",
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
  "Payreport.view.js",
//  "App.controller.js"
  "Payreport.controller.js"
  ]
  }
  }
  }
  });
  return Component;
});