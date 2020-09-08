jQuery.sap.require("common.Common");

sap.ui.jsview("zui5_hrxx_actprevjob.AppMain", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actprevjob.AppMain";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	createContent : function(oController) {
		
		this.loadModel();
		
		// to avoid scrollbars on desktop the root view must be set to block display
		this.setDisplayBlock(true);


		this.app = new sap.m.App({initialPage: "zui5_hrxx_actprevjob.PrevJobRequestList"});		
		this.app.addPage(sap.ui.jsview("zui5_hrxx_actprevjob.PrevJobRequestList", "zui5_hrxx_actprevjob.PrevJobRequestList"));
		
		return new sap.m.Shell({
			title : "입사 전 경력 직무 변경 신청 관리",
			showLogout : false,
			app : this.app,
			appWidthLimited : false,
//			backgroundImage : "images/progress.gif",
//			backgroundRepeat : true,
//			backgroundOpacity : 0.5,
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
		
//		var locale = sap.ui.getCore().getConfiguration().getLanguage(); //언어
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : locale
//        });
		
		//업적평가 OData 및 App 기본 Model 선언
		var sServiceURL1 = this.getUrl("/sap/opu/odata/sap/ZHRXX_JOBCHANGE_SRV/");
		var oModel = new sap.ui.model.odata.ODataModel(sServiceURL1, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel.setCountSupported(false);
		sap.ui.getCore().setModel(oModel,"ZHRXX_JOBCHANGE_SRV");
		
		var sServiceURL2 = this.getUrl("/sap/opu/odata/sap/ZHRXX_COMMON_SRV/");
		var oCommonModel = new sap.ui.model.odata.ODataModel(sServiceURL2, true, undefined, undefined, undefined, undefined, undefined, false);
		oCommonModel.setCountSupported(false);
		oCommonModel.setSizeLimit(5000);
		sap.ui.getCore().setModel(oCommonModel,"ZHRXX_COMMON_SRV");
		
		var sServiceURL3 = this.getUrl("/sap/opu/odata/sap/ZHRXX_ACTIONAPP_SRV/");
		var oModel3 = new sap.ui.model.odata.ODataModel(sServiceURL3, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel3.setCountSupported(false);
		sap.ui.getCore().setModel(oModel3,"ZHRXX_ACTIONAPP_SRV");
		
		//입사전 경력 신청 리스트
		var oPrevJobChangeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oPrevJobChangeList, "PrevJobChangeList");
		oPrevJobChangeList.setSizeLimit(5000);
		
		//입사전 경력 상세 리스트
		var oPrevEmployersList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oPrevEmployersList, "PrevEmployersList");
		
		//입사전 경력 회사 리스트 
		var oPrevCompanyList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oPrevCompanyList, "PrevCompanyList");
		
		//코드 리스트
		var oEmpCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oEmpCodeList, "EmpCodeList");
		oEmpCodeList.setSizeLimit(500);
		
		// 본인 사번 및 인사영역
		var EmpInfoJSONModel =  new sap.ui.model.json.JSONModel();
		var vEmpLoginInfoSet = {EmpLoginInfoSet : []};
		var vPersa = "";
		try {
	    	var vLpmid = "HPJOB";
	    	oCommonModel.read("/EmpLoginInfoSet/?$filter=Lpmid%20eq%20%27" + vLpmid + "%27", 
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							vEmpLoginInfoSet.EmpLoginInfoSet.push(oData.results[0]);
							vPersa = oData.results[0].Persa ;
							gPersa = oData.results[0].Persa;
							gMolga = oData.results[0].Molga;
							gDtfmt = oData.results[0].Dtfmt;
							gDcpfm = oData.results[0].Dcpfm;
							gGenyn = "X";  
							
							vScryn = oData.results[0].Scryn;
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
	    	//화면 권한이 없으면 권한 없음 화면으로 이동
	    	if(vScryn != "X") {
	    		document.location.href = "/sap/bc/ui5_ui5/sap/zhrxx_common/NoAuth.html?menuid=" + vLpmid;
	    		return;
	    	}
		} catch(ex) {
			common.Common.log(ex);
		}
    	if(gDtfmt != "") {
			gDtfmt = gDtfmt.replace("YYYY", "yyyy");
			gDtfmt = gDtfmt.replace("DD", "dd");
		}	
		EmpInfoJSONModel.setData(vEmpLoginInfoSet);
		sap.ui.getCore().setModel(EmpInfoJSONModel, "EmpLoginInfo");
		
		//사원검색 용 코드 리스트
		var mEmpSearchCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mEmpSearchCodeList, "EmpSearchCodeList");
		
		//사원검색결과
		var mEmpSearchResult = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mEmpSearchResult, "EmpSearchResult");
		
		//파일첨부리스트
		var mFileList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mFileList, "FileList");
		
		
		
	},
	
	/*
	 * OData Service URL�� ��ȯ�ϴ� Function 
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