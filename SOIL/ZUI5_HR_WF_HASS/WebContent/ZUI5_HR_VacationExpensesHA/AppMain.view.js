jQuery.sap.require("common.Common");

sap.ui.jsview("ZUI5_HR_VacationExpensesHA.AppMain", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	getControllerName : function() {
		return "ZUI5_HR_VacationExpensesHA.AppMain";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	createContent : function(oController) {
		this.loadModel();
		
		// to avoid scrollbars on desktop the root view must be set to block display
		this.setDisplayBlock(true);


		this.app = new sap.m.App({initialPage: "ZUI5_HR_VacationExpensesHA.ZUI5_HR_VacationExpensesList"});		
		this.app.addPage(sap.ui.jsview("ZUI5_HR_VacationExpensesHA.ZUI5_HR_VacationExpensesList", "ZUI5_HR_VacationExpensesHA.ZUI5_HR_VacationExpensesList"));
		
		return new sap.m.Shell({
//			title : "제증명 신청",
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
	
	loadModel : function() {
		var lang = jQuery.sap.getUriParameters().get("sap-ui-language");
		if(!lang || lang == "") lang = "ko";
		
		var oServiceURL = this.getUrl("/sap/opu/odata/sap/ZL2P01GW9000_SRV/");
		var oModel = new sap.ui.model.odata.ODataModel(oServiceURL, true, undefined, undefined, undefined, undefined, undefined, false);
		//oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		oModel.setCountSupported(false);
		oModel.setRefreshAfterChange(false);
		sap.ui.getCore().setModel(oModel, "ZL2P01GW9000_SRV");
		
		var oServiceURL2 = this.getUrl("/sap/opu/odata/sap/ZHR_HOL_EXP_SRV/");
		var oModel2 = new sap.ui.model.odata.ODataModel(oServiceURL2, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel2.setCountSupported(false);
		oModel2.setRefreshAfterChange(false);
		sap.ui.getCore().setModel(oModel2, "ZHR_HOL_EXP_SRV"); 
		
		var oServiceURL4 = this.getUrl("/sap/opu/odata/sap/ZHR_COMMON_SRV/");
		var oModel4 = new sap.ui.model.odata.ODataModel(oServiceURL4, true, undefined, undefined, undefined, undefined, undefined, false);
		//oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		oModel4.setCountSupported(false);
		oModel4.setRefreshAfterChange(false);
		sap.ui.getCore().setModel(oModel4, "ZHR_COMMON_SRV");
		
		var mEmpLoginInfo =  new sap.ui.model.json.JSONModel();
		var vEmpLoginInfo = { EmpLoginInfoSet : []};

		var vMenuId = "" ;
		if(_gAuth == "H"){
			vMenuId = "HSS22";
		}
		var oPath = "/EmpLoginInfoSet/?$filter=Lpmid eq '" + vMenuId + "'";
		
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
//		var vEmpCodeList = { EmpCodeListSet : []};
		sap.ui.getCore().setModel(mEmpCodeList, "EmpSearchCodeList");
		
		var mEmpSearchResult =  new sap.ui.model.json.JSONModel();
//		var vEmpSearchResult = { EmpSearchResultSet : []};
		sap.ui.getCore().setModel(mEmpSearchResult, "EmpSearchResult");

	},
	
	/*
	 * OData Service URL을 위한 Function 
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