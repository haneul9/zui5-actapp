sap.ui.jsview("ZKL_BASE.AppMain", {


	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ZKL_BASE.AppMain
	*/ 
	getControllerName : function() {
		return "ZKL_BASE.AppMain";
	},
 
	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf ZKL_BASE.AppMain
	*/ 
	createContent : function(oController) {
		this.loadModel();
		var vInitPage = "ZKL_BASE.ZKL_NAME";
		console.log("base app main");
		// to avoid scrollbars on desktop the root view must be set to block display
		this.setDisplayBlock(true);


		this.app = new sap.m.App({initialPage: "ZKL_BASE.ZKL_NAME"});		
		this.app.addPage(sap.ui.jsview("ZKL_BASE.ZKL_NAME", "ZKL_BASE.ZKL_NAME"));		
		this.app.setBackgroundColor("rgb(245,245,245)");
		return new sap.m.Shell({
			title : "",
			showLogout : false,
			app : this.app,
			appWidthLimited : false,
			homeIcon : {
				'phone' : 'img/57_iPhone_Desktop_Launch.png',
				'phone@2' : 'img/114_iPhone-Retina_Web_Clip.png',
				'tablet' : 'img/72_iPad_Desktop_Launch.png',
				'tablet@2' : 'img/144_iPad_Retina_Web_Clip.png',
				'favicon' : 'img/favicon.ico',
				'precomposed': false
			}
		});
	},
	/**
	 * Define and Setting OData Model & Language Pack
	 */
	loadModel : function() {
		var lang = jQuery.sap.getUriParameters().get("sap-ui-language");
		if(!lang || lang == "") lang = "ko";
		
		var oServiceURL = this.getUrl("/sap/opu/odata/sap/ZKL_HR_COMMON_SRV/");
		var oModel = new sap.ui.model.odata.ODataModel(oServiceURL, true);
		oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.InlineRepeat);
		sap.ui.getCore().setModel(oModel, "ZKL_COMMON");
		
		console.log("base app main");
//		var i18nModel = new sap.ui.model.resource.ResourceModel({
//			bundleUrl : "i18n/lang_" + lang.toLowerCase() + ".properties"
//		});
//		sap.ui.getCore().setModel(i18nModel, "i18n");
	},
	
	/*
	 * OData Service UR Function 
	 */
	getUrl : function(sUrl) {
		if (sUrl == "")
			return sUrl;
		if (window.location.hostname == "localhost") {
			return "proxy" + sUrl;
		} else {
			return sUrl;
		}
	}
	

});