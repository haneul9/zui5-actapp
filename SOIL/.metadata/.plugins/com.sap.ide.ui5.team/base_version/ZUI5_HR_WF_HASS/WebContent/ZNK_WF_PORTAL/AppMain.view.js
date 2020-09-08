//jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.jsview("ZNK_WF_PORTAL.AppMain", {


	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ZNK_WF_PORTAL.AppMain
	*/ 
	getControllerName : function() {
		return "ZNK_WF_PORTAL.AppMain";
	},
 
	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf ZNK_WF_PORTAL.AppMain
	*/ 
	createContent : function(oController) {
		this.loadModel();
		var vInitPage = "ZNK_WF_PORTAL.ZNK_PORTAL";
		
		// to avoid scrollbars on desktop the root view must be set to block display
		this.setDisplayBlock(true);
		this.app = new sap.m.App({initialPage: "ZNK_WF_PORTAL.ZNK_PORTAL"});		
		this.app.addPage(sap.ui.jsview("ZNK_WF_PORTAL.ZNK_PORTAL", "ZNK_WF_PORTAL.ZNK_PORTAL"));		
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
		}).addStyleClass("PageWidth");
	},
	/**
	 * Define and Setting OData Model & Language Pack
	 */
	loadModel : function() {
		jQuery.sap.require("sap.m.MessageBox");
		
		var lang = jQuery.sap.getUriParameters().get("sap-ui-language");
		if(!lang || lang == "") lang = "ko";
		
		var oServiceURL = this.getUrl("/sap/opu/odata/sap/ZL2P01GW9000_SRV/");
		var oModel = new sap.ui.model.odata.ODataModel(oServiceURL, true, undefined, undefined, undefined, undefined, undefined, false);
		//oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		oModel.setCountSupported(false);
		oModel.setRefreshAfterChange(false);
		sap.ui.getCore().setModel(oModel, "ZL2P01GW9000_SRV");
		
		var oServiceURL2 = this.getUrl("/sap/opu/odata/sap/ZHR_MEDICAL_SRV/");
		var oModel2 = new sap.ui.model.odata.ODataModel(oServiceURL2, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel2.setCountSupported(false);
		oModel2.setRefreshAfterChange(false);
		sap.ui.getCore().setModel(oModel2, "ZHR_MEDICAL_SRV"); 
		
		var oServiceURL3 = this.getUrl("/sap/opu/odata/sap/ZHR_SCHOOL_EXP_SRV/");
		var oModel3 = new sap.ui.model.odata.ODataModel(oServiceURL3, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel3.setCountSupported(false);
		oModel3.setRefreshAfterChange(false);
		sap.ui.getCore().setModel(oModel3, "ZHR_SCHOOL_EXP_SRV"); 
		
		var oServiceURL4 = this.getUrl("/sap/opu/odata/sap/ZHR_COMMON_SRV/");
		var oModel4 = new sap.ui.model.odata.ODataModel(oServiceURL4, true, undefined, undefined, undefined, undefined, undefined, false);
		//oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		oModel4.setCountSupported(false);
		oModel4.setRefreshAfterChange(false);
		sap.ui.getCore().setModel(oModel4, "ZHR_COMMON_SRV");
		
		var mEmpLoginInfo =  new sap.ui.model.json.JSONModel();
		var vEmpLoginInfo = { EmpLoginInfoSet : []};
		
		var oPath = "/EmpLoginInfoSet";
		oModel.read(oPath,null,null,false,function(Data,Res){
			if(Data && Data.results.length){
				var oData = Data.results[0] ;
				gPersa = oData.Persa;
				vEmpLoginInfo.EmpLoginInfoSet.push(Data.results[0]);
			}
		},function(Res){
			if(Res.response && Res.response.body){
				var ErrorMessage = Res.response.body;
				var ErrorJSON = JSON.parse(ErrorMessage);
				if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
					ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
				}
				new control.ZNK_SapBusy.oErrorMessage(ErrorMessage);
			}
			
			return;
		});
		mEmpLoginInfo.setData(vEmpLoginInfo);
		sap.ui.getCore().setModel(mEmpLoginInfo, "EmpLoginInfo");
		
		
		var mEmpCodeList =  new sap.ui.model.json.JSONModel();
		var vEmpCodeList = { EmpCodeListSet : []};
		sap.ui.getCore().setModel(mEmpCodeList, "EmpSearchCodeList");
		
		var mEmpSearchResult =  new sap.ui.model.json.JSONModel();
		var vEmpSearchResult = { EmpSearchResultSet : []};
		sap.ui.getCore().setModel(mEmpSearchResult, "EmpSearchResult");
		
		var mSchoolLimit =  new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mSchoolLimit, "SchoolLimit");
		
		
		
		// 지급 미지급 entry 조회
		var mSchoolEntpayList =  new sap.ui.model.json.JSONModel();
		var vSchoolEntpayList = { Data : []};
		oModel3.read("SchoolEntpayListSet",null,null,false,function(Data,Res){
			if(Data && Data.results.length){
				for(var i = 0; i < Data.results.length ; i++){
					vSchoolEntpayList.Data.push(Data.results[i]);
				}
			}
		},function(Res){
			if(Res.response && Res.response.body){
				var ErrorMessage = Res.response.body;
				var ErrorJSON = JSON.parse(ErrorMessage);
				if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
					ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
				}
				new control.ZNK_SapBusy.oErrorMessage(ErrorMessage);
			}
			return;
		});
		
		mSchoolEntpayList.setData(vSchoolEntpayList);
		sap.ui.getCore().setModel(mSchoolEntpayList, "SchoolEntpayList");
		
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