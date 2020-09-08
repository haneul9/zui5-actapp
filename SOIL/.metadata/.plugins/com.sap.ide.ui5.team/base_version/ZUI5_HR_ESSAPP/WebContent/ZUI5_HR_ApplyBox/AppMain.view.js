jQuery.sap.require("common.Common");

sap.ui.jsview("ZUI5_HR_ApplyBox.AppMain", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	getControllerName : function() {
		return "ZUI5_HR_ApplyBox.AppMain";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	createContent : function(oController) {
		this.loadModel();
		
		// to avoid scrollbars on desktop the root view must be set to block display
		this.setDisplayBlock(true);


		this.app = new sap.m.App({initialPage: "ZUI5_HR_ApplyBox.ZUI5_HR_ApplyBoxList"});		
		this.app.addPage(sap.ui.jsview("ZUI5_HR_ApplyBox.ZUI5_HR_ApplyBoxList", "ZUI5_HR_ApplyBox.ZUI5_HR_ApplyBoxList"));
		
		return new sap.m.Shell({
			title : oBundleText.getText("LABEL_1070"),	// 1070:HR 신청함
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
		
		var oServices = ["ZHR_COMMON_SRV",
						 "ZHR_APPL_SRV", 
						 "ZHR_ACTION_SRV",      // 내신서
						 "ZHR_CERTY_SRV" ,      //제증명
						 "ZHR_ACCOUNTCHG_SRV",  // 계좌변경
						 "ZHR_WORKSCHDULE_SRV", // 근무편제
						 "ZHR_CONTY_SRV",  // 경조금
						 "ZHR_CON_GOODS_SRV", // 경조 화한
						 "ZHR_COMPANYHOUSE_SRV", // 사택
						 "ZHR_COMPANYHOUSE_HEAD_SRV",
						 "ZHR_DEDUCT_FIX_SRV", // 공제신청
						 "ZHR_MEDICAL_SRV",    // 의료비
						 "ZHR_RNRCENTER_SRV" , //휴양소
						 "ZHR_LEAVEAPPL_SRV",   
			             "ZHR_BUSITRIP_DOM_SRV", 
			             "ZHR_BUSITRIP_INT_SRV", 
			             "ZHR_BIZ_CARD_SRV",   // 법인카드
			             "ZHR_PAYSLIP_SRV", 
			             "ZHR_LIFE_LOAN_SRV",  //대출관련 신청
			             "ZHR_EXTRA_PAY_SRV",
			             "ZHR_BEF_MOVING_SRV", //부임준비금
			             "ZHR_MOVING_FEE_SRV", 
			             "ZHR_CHILD_CARE_SRV", // 영유아
			             "ZHR_VISITRANS_FEE_SRV", // 방문교통비
			             "ZHR_UGRTRANS_FEE_SRV", // 긴급업무
			             "ZHR_PREGNANT_REGI_SRV", 
			             "ZHR_PREGNANT_DIAG_SRV", 
			             "ZHR_LUNCH_FEE_SRV",
			             "ZHR_FOREIGNLANG_SRV", //외국어 신청
			             "ZHR_BSUIT_SRV", // 작업복
			             "ZHR_VOLUNTEER_SRV", // 사회봉사
			             "ZHR_MONTHLYTIME_SRV",
			             "ZHR_SPECIAL_WORK_SRV",
			             "ZHR_DEDUCT_OBJ_SRV",
			             "ZHR_DEDUCT_CHG_SRV",
			             "ZHR_APPROVAL_SRV", 
			             "ZHR_WORKTIME_SRV",
			             
			             ];
		
		var oServiceURL = this.getUrl("/sap/opu/odata/sap/ZL2P01GW9000_SRV/");
		var oModel = new sap.ui.model.odata.ODataModel(oServiceURL, true, undefined, undefined, undefined, undefined, undefined, false);
		//oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		oModel.setCountSupported(false);
		oModel.setRefreshAfterChange(false);
		sap.ui.getCore().setModel(oModel, "ZL2P01GW9000_SRV");
		
		var oServiceURL3 = this.getUrl("/sap/opu/odata/sap/ZHR_SCHOOL_EXP_SRV/");
		var oModel3 = new sap.ui.model.odata.ODataModel(oServiceURL3, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel3.setCountSupported(false);
		oModel3.setRefreshAfterChange(false);
		sap.ui.getCore().setModel(oModel3, "ZHR_SCHOOL_EXP_SRV"); 
		
		for(var i =0 ; i < oServices.length; i++){
			var oServiceURLx = this.getUrl("/sap/opu/odata/sap/" + oServices[i] + "/");
			var oModelx = new sap.ui.model.odata.ODataModel(oServiceURLx, true, undefined, undefined, undefined, undefined, undefined, true);
			oModelx.setCountSupported(false);
			oModelx.setRefreshAfterChange(false);
			sap.ui.getCore().setModel(oModelx, oServices[i]);
		}
		
		var oServices2 = ["ZHR_BUSITRIP_PAY_DOM_SRV", "ZHR_BUSITRIP_PAY_INT_SRV" ];
		
		for(var i =0 ; i < oServices2.length; i++){
			var oServiceURLx = this.getUrl("/sap/opu/odata/sap/" + oServices2[i] + "/");
			var oModelx = new sap.ui.model.odata.ODataModel(oServiceURLx, true, undefined, undefined, undefined, undefined, undefined, false);
			oModelx.setCountSupported(false);
			oModelx.setRefreshAfterChange(false);
			oModelx.setSizeLimit(1000);
			sap.ui.getCore().setModel(oModelx, oServices2[i]);
		}
		
		var mEmpLoginInfo =  new sap.ui.model.json.JSONModel();
		var vEmpLoginInfo = { EmpLoginInfoSet : []};
		var vLoginData = common.Common.getEmpLoginInfo(_gAuth);
		
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
		
		// 통화키 entry 조회
		var mSchoolWaersList =  new sap.ui.model.json.JSONModel();
		var vSchoolWaersList = { Data : []};
		oModel3.read("/SchoolWaersListSet",null,null,false,function(Data,Res){
			if(Data && Data.results.length){
				for(var i = 0; i < Data.results.length ; i++){
					vSchoolWaersList.Data.push(Data.results[i]);
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
		
		mSchoolWaersList.setData(vSchoolWaersList);
		sap.ui.getCore().setModel(mSchoolWaersList, "SchoolWaersList");

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