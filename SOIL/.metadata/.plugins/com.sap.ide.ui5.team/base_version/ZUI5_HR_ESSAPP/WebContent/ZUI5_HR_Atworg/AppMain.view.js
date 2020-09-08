sap.ui.jsview("ZUI5_HR_Atworg.AppMain", {


	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ZUI5_HR_Atworg.AppMain
	*/ 
	getControllerName : function() {
		return "ZUI5_HR_Atworg.AppMain";
	},
 
	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf ZUI5_HR_Atworg.AppMain
	*/ 
	createContent : function(oController) {
//		jQuery.sap.require("model.hr001");
		this.loadModel();
		var vInitPage = "ZUI5_HR_Atworg.Ac1";
		
		// to avoid scrollbars on desktop the root view must be set to block display
		this.setDisplayBlock(true);  

		//
		this.app = new sap.m.App({initialPage: "ZUI5_HR_Atworg.Ac1"});		
		this.app.addPage(sap.ui.jsview("ZUI5_HR_Atworg.Ac1", "ZUI5_HR_Atworg.Ac1"));
		
		
		
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
		
		var oServiceURL = this.getUrl("/sap/opu/odata/sap/ZL2P01GW9000_SRV/");
		var oModel = new sap.ui.model.odata.ODataModel(oServiceURL, true, undefined, undefined, undefined, undefined, undefined, false);
		//oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		oModel.setCountSupported(false);
		oModel.setRefreshAfterChange(false);
		sap.ui.getCore().setModel(oModel, "ZL2P01GW9000_SRV");
		
		var sServiceURL642 = this.getUrl("/sap/opu/odata/sap/ZHRXX_EMP_PROFILE_SRV/");
		var oModel322 = new sap.ui.model.odata.ODataModel(sServiceURL642, true);
		//oModel.setCountSupported(false);
		sap.ui.getCore().setModel(oModel322, "EIS");
		
		var mEmpLoginInfo =  new sap.ui.model.json.JSONModel();
		var vEmpLoginInfo = { EmpLoginInfoSet : []};
//		var vMenuId = "" ;
//		if(_gAuth == "E"){
//			vMenuId = "ESS25"; 
//		} else if(_gAuth == "H"){
//			vMenuId = "HSS08"; 
//		} else if(_gAuth == "M"){
//			vMenuId = "MSS06"; 
//		}
//		var oPath = "/EmpLoginInfoSet/?$filter=Lpmid eq '" + vMenuId + "'";
		
		var oPath = "/EmpLoginInfoSet?$filter=Lpmid eq 'ZHR_TWORG'";
		
		oModel.read(oPath,null,null,false,function(Data,Res){
			if(Data && Data.results.length){
				var oData = Data.results[0] ;
				gPersa = oData.Persa;
				vEmpLoginInfo.EmpLoginInfoSet.push(Data.results[0]);
				
				if(Data.results[0].Scryn == "")
					window.open("/sap/bc/ui5_ui5/sap/ZHRF0001/NoAuth.html", "_self");
			}
		},function(Res){
			if(Res.response && Res.response.body){
				var ErrorMessage = Res.response.body;
				var ErrorJSON = JSON.parse(ErrorMessage);
				if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
					ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
				}
			}
			return;
		});
		mEmpLoginInfo.setData(vEmpLoginInfo);
		sap.ui.getCore().setModel(mEmpLoginInfo, "EmpLoginInfo");
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