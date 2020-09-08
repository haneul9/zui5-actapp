jQuery.sap.require("common.Common");

sap.ui.jsview("ZUI5_HR_ApprovalBox.AppMain", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	getControllerName : function() {
		return "ZUI5_HR_ApprovalBox.AppMain";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	createContent : function(oController) {
		this.loadModel();
		
		// to avoid scrollbars on desktop the root view must be set to block display
		this.setDisplayBlock(true);


		this.app = new sap.m.App({initialPage: "ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList"});		
		this.app.addPage(sap.ui.jsview("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList", "ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList"));
		
		return new sap.m.Shell({
			title : oBundleText.getText("LABEL_1071"),	// 1071:HR 결재함
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
		var oServices = ["ZHR_APPROVAL_SRV", "ZHR_MEDICAL_SRV", "ZHR_COMMON_SRV", "ZHR_LEAVEAPPL_SRV", "ZHR_CONTY_SRV",  
			             "ZHR_BUSITRIP_DOM_SRV", "ZHR_CERTY_SRV", "ZHR_BUSITRIP_INT_SRV", "ZHR_BIZ_CARD_SRV",
			             "ZHR_PAYSLIP_SRV", "ZHR_LIFE_LOAN_SRV", "ZHR_LIFE_LOAN_SRV", "ZHR_EXTRA_PAY_SRV",
			             "ZHR_CON_GOODS_SRV", "ZHR_BEF_MOVING_SRV", "ZHR_MOVING_FEE_SRV", "ZHR_CHILD_CARE_SRV",
			             "ZHR_PREGNANT_REGI_SRV", "ZHR_PREGNANT_DIAG_SRV", "ZHR_LUNCH_FEE_SRV"
			             ];
		
		var oServiceURL = this.getUrl("/sap/opu/odata/sap/ZL2P01GW9000_SRV/");
		var oModel = new sap.ui.model.odata.ODataModel(oServiceURL, true, undefined, undefined, undefined, undefined, undefined, false);
		//oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		oModel.setCountSupported(false);
		oModel.setRefreshAfterChange(false);
		sap.ui.getCore().setModel(oModel, "ZL2P01GW9000_SRV");
		
		var oServiceURL2 = this.getUrl("/sap/opu/odata/sap/ZHR_APPROVAL_SRV/");
		var oModel2 = new sap.ui.model.odata.ODataModel(oServiceURL2, true, undefined, undefined, undefined, undefined, undefined, false);
		//oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		oModel2.setCountSupported(false);
		oModel2.setRefreshAfterChange(false);
		sap.ui.getCore().setModel(oModel2, "ZHR_APPROVAL_SRV");
		
		var mEmpLoginInfo =  new sap.ui.model.json.JSONModel();
		var vEmpLoginInfo = { EmpLoginInfoSet : []};
		var vLoginData = common.Common.getEmpLoginInfo(_gAuth);
		gReqAuth = vLoginData.ReqAuth || "1";
		gPersa = vLoginData.Persa;
		vEmpLoginInfo.EmpLoginInfoSet.push(vLoginData);
		mEmpLoginInfo.setData(vEmpLoginInfo);
		sap.ui.getCore().setModel(mEmpLoginInfo, "EmpLoginInfo");
		
		
		var mEmpCodeList =  new sap.ui.model.json.JSONModel();
//		var vEmpCodeList = { EmpCodeListSet : []};
		sap.ui.getCore().setModel(mEmpCodeList, "EmpSearchCodeList");
		
		var mEmpSearchResult =  new sap.ui.model.json.JSONModel();
//		var vEmpSearchResult = { EmpSearchResultSet : []};
		sap.ui.getCore().setModel(mEmpSearchResult, "EmpSearchResult");
		
		var mSchoolLimit =  new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mSchoolLimit, "SchoolLimit");
		
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