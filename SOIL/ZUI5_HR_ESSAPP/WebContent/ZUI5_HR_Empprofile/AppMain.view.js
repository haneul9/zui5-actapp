jQuery.sap.require("common.Common");

sap.ui.jsview("ZUI5_HR_Empprofile.AppMain", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ZUI5_HR_Empprofile.AppMain
	*/ 
	getControllerName : function() {
		return "ZUI5_HR_Empprofile.AppMain";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf ZUI5_HR_Empprofile.AppMain
	*/ 
	createContent : function(oController) {
		this.loadModel();
		
		this.setDisplayBlock(true);
 
		this.app = new sap.m.App({initialPage: "ZUI5_HR_Empprofile.EmployeeProfile"});		
		this.app.addPage(sap.ui.jsview("ZUI5_HR_Empprofile.EmployeeProfile", "ZUI5_HR_Empprofile.EmployeeProfile"));
		
		var oApp = new sap.m.Shell({
			title : "Empolyee Profile",
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
		
//		if(_gAuth == "E"){
//			oApp.addStyleClass("PageWidth");
//		}
		
		return oApp ;
	},
	
	loadModel : function() {
		var lang = jQuery.sap.getUriParameters().get("sap-ui-language");
		if(!lang || lang == "") lang = "ko";		
		
		//퇴직프로세스 OData 및 App 기본 Model 선언
		var sServiceURL1 = this.getUrl("/sap/opu/odata/sap/ZHRXX_EMP_PROFILE_SRV/");
		var oModel = new sap.ui.model.odata.ODataModel(sServiceURL1, true, undefined, undefined, undefined, undefined, undefined, true);
		oModel.setCountSupported(false);
		sap.ui.getCore().setModel(oModel,"ZHRXX_EMP_PROFILE_SRV");
		
		//공통 OData
		var sServiceURL2 = this.getUrl("/sap/opu/odata/sap/ZL2P01GW9000_SRV/");
		var oCommonModel = new sap.ui.model.odata.ODataModel(sServiceURL2, true, undefined, undefined, undefined, undefined, undefined, true);
		oCommonModel.setCountSupported(false);
		oCommonModel.setSizeLimit(5000);
		sap.ui.getCore().setModel(oCommonModel,"ZL2P01GW9000_SRV");
		
		var sServiceURL3 = this.getUrl("/sap/opu/odata/sap/ZHR_PINFO_SRV/");
		var oModel3 = new sap.ui.model.odata.ODataModel(sServiceURL3, true, undefined, undefined, undefined, undefined, undefined, true);
		oModel3.setCountSupported(false);
		oModel3.setSizeLimit(5000);
		sap.ui.getCore().setModel(oModel3,"ZHR_PINFO_SRV");
		
		var sServiceURL4 = this.getUrl("/sap/opu/odata/sap/ZHR_EMP_HRCARD_SRV/");
		var oModel4 = new sap.ui.model.odata.ODataModel(sServiceURL4, true, undefined, undefined, undefined, undefined, undefined, true);
		oModel4.setCountSupported(false);
		sap.ui.getCore().setModel(oModel4,"ZHR_EMP_HRCARD_SRV");
		
		var sServiceURL5 = this.getUrl("/sap/opu/odata/sap/ZHR_FAMILY_SRV/");
		var oModel5 = new sap.ui.model.odata.ODataModel(sServiceURL5, true, undefined, undefined, undefined, undefined, undefined, true);
		oModel5.setCountSupported(false);
		sap.ui.getCore().setModel(oModel5,"ZHR_FAMILY_SRV");
		
		
		
		//코드 리스트
		var oEmpCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oEmpCodeList, "EmpCodeList");
		oEmpCodeList.setSizeLimit(500);
		
		//사원검색 용 코드 리스트
		var mEmpSearchCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mEmpSearchCodeList, "EmpSearchCodeList");
		
		//사원검색결과
		var mEmpSearchResult = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mEmpSearchResult, "EmpSearchResult");

		var mEmpLoginInfo =  new sap.ui.model.json.JSONModel();
		var vEmpLoginInfo = {EmpLoginInfoSet : []};
		
		try {
	    	var vScryn = "";
			var vMenuId = "YES03" ;
			var oPath = "/EmpLoginInfoSet/?$filter=Lpmid eq '" + vMenuId + "' and Actty eq '" + _gAuth + "'";
	    	
	    	oCommonModel.read(oPath,  
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							gPernr = oData.results[0].Pernr;
							gPersa = oData.results[0].Persa;
							gMolga = oData.results[0].Molga;
							gEname = oData.results[0].Ename;
							gPerid = oData.results[0].Perid;
							
							vScryn = (oData.results[0].Scryn) ? "X" : "";
							
							vEmpLoginInfo.EmpLoginInfoSet.push(oData.results[0]);
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
	    	
	    	mEmpLoginInfo.setData(vEmpLoginInfo);
			sap.ui.getCore().setModel(mEmpLoginInfo, "EmpLoginInfo");
			
	    	//화면 권한이 없으면 권한 없음 화면으로 이동
	    	if(vScryn != "X") {
	    		document.location.href = "/sap/bc/ui5_ui5/sap/zui5_hr_common/NoAuth.html";
	    		return;
	    	}
		} catch(ex) {
			common.Common.log(ex);
		}
		
		// 국가 코드 리스트
 		var oNatioList = new sap.ui.model.json.JSONModel();
 		sap.ui.getCore().setModel(oNatioList, "NatioList"); 
 		var vCode = {
 			natioCode : []         // 국가
 		};
 		
 		// 국가코드 
 		oCommonModel.read("/EmpCodeListSet?$filter=Field eq 'Natio' and PersaNc eq 'X'", 
 					null, 
 					null, 
 					true, 
 					function(oData, oResponse) {
 						var i;
 						if(oData && oData.results.length) {
 							for(i=0; i<oData.results.length; i++) {
 								vCode.natioCode.push(oData.results[i]);
 							}
 							oNatioList.setData(vCode);
 						}
 					},
 					function(oResponse) {
 						console.log(oResponse);
 					}
 		);
		
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