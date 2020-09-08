sap.ui.define(['sap/ui/core/UIComponent'],
  function(UIComponent) {
  "use strict";
  var Component = sap.ui.core.UIComponent.extend("ZUI5_HR_ApprovalOverview.Component", {
	  metadata: {
		  rootView: {
		      viewName:   "ZUI5_HR_ApprovalOverview.ZUI5_HR_ApprovalOverviewList",
		      type:"JS"
		   },
		  dependencies: {
			  libs: [
				  "sap.m",
				  "sap.ui.commons", 
				  "sap.ui.layout",
			  ]
		  },
//		  routing : {
//			   config : {
////			    targetsClass : "sap.m.routing.Targets",
//			    viewPath : "ZUI5_HR_ApprovalOverview.AppMain",
//			    controlId : "rootControl",
//			    controlAggregation : "pages",
//			    viewType : "JS"
//			   },
////			   targets : {
////			    page1 : {
////			     viewName : "loginpage",
////			     viewLevel : 0
////			    },
////
////			    page2 : {
////			     viewName : "homepage",
////			     viewLevel : 1
////			    }
////			   }
//			  },
		  config: {
			  sample: {
				  files: [
				//  "view/App.view.xml",
				  "AppMain.view.js",
				//  "App.controller.js"
				  "AppMain.controller.js"
				  ]
			  },
			  viewType : "JS"
		  }
	  }
  });
  return Component;
});