(function() {
	"use strict";

	/*global jQuery, sap */
	jQuery.sap.declare("cis.FLPugin.Component");
	jQuery.sap.require("sap.ui.core.Component");

  var sComponentName = "cis.FLPugin";
  var sImageURL = "";
	// new Component
	sap.ui.core.Component.extend("cis.FLPugin.Component", {

		metadata: {
			version: "@version@",
			library: "sap.ushell.demo.UIPluginSampleAddHeaderItems"
		},

		_getRenderer: function() {
			var that = this,
				oDeferred = new jQuery.Deferred(),
				oShellContainer,
				oRenderer;

			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
			if (!that._oShellContainer) {
				oDeferred.reject(
					"Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
			} else {
				oRenderer = that._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					that._onRendererCreated = function(oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
						}
					};
					that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
				}
			}
			return oDeferred.promise();
		},

		init: function() {
			var that = this;
		    var oCommonModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_COMMON_SRV/", true, undefined, undefined,
					{"Cache-Control": "max-age=0"}, undefined, undefined, true);	
		    
	  		var vPhoto;
	    	oCommonModel.read("/EmpLoginInfoSet",  
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							sImageURL = oData.results[0].Photo;
						}
					},
					function(oResponse) {
					}
			);
	    	
    	    
  		  var that = this, fgetService = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
		  this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");

			this._getRenderer().fail(function(sErrorMessage) {
				jQuery.sap.log.error(sErrorMessage, undefined, sComponentName);
			})
			.done(function(oRenderer) {

				//Below is for the small icon on top left
				var meAreaHeaderButton = sap.ui.getCore().byId("meAreaHeaderButton");
				meAreaHeaderButton.setIcon(sImageURL);
				
				//Below is for the Me area
				sap.ushell.Container.getService("UserInfo").getUser().setImage(sImageURL);
		    	
				setTimeout(function() {
					//Below is for the small icon on top left

//					sap.ui.getCore().byId("logoutBtn").setVisible(false);
//			    	$("#logoutBtn").css("display", "none");
			    	
					var oImage0 =  document.querySelector("#__image0");
					//oImage0.style.maxWidth = "100%";
					oImage0.style.borderRadius = "100%";
					oImage0.style.width = "5.5rem";
					oImage0.style.height = "5.5rem";
					oImage0.style.backgroundColor = "transparent";
					oImage0.style.border = "0.25rem solid rgba(52,97,135,0.15)";
					oImage0.style.color = "rgba(52,97,135,0.15)";
				}, 3000);
			});
		},

		exit: function() {
			if (this._oShellContainer && this._onRendererCreated) {
				this._oShellContainer.detachRendererCreatedEvent(this._onRendererCreated);
			}
		},
		
		after: function(){
//			setTimeout(function() {
//				//Below is for the small icon on top left
////				$("#meAreaHeaderButton").html( "<img style='max-width: 100%; height:auto;' src=" + sImageURL + ">" );
//				var meAreaHeaderButton = sap.ui.getCore().byId("meAreaHeaderButton");
//				meAreaHeaderButton.setIcon(sImageURL);
//
//			}, 2000);
			
//			setTimeout(function() {
//				//Below is for the small icon on top left
//				
////				var oImage0 = sap.ui.getCore().byId("__image0");
//				var oImage0 =  document.querySelector("#__image0");
//				oImage0.style.maxWidth = "100%";
//				oImage0.style.borderRadius = "100%";
//				oImage0.style.width = "5.5rem";
//				oImage0.style.height = "5.5rem";
//				
////				$(".sapUshellMeAreaUserImage").html( "<img style='max-width: 100%; border-radius : 100%; width : 5.5rem; height : 5.5rem;' src=" + sImageURL + ">" );
//				
//
//			}, 2000);
		}
		
	});
})();