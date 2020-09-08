jQuery.sap.require("common.Common");
jQuery.sap.require("common.makeTable");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.YeaAttachFileAction");

sap.ui.jsview("ZUI5_HR_YEARTAX.AppMain", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	getControllerName : function() {
		return "ZUI5_HR_YEARTAX.AppMain";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	createContent : function(oController) {		
		this.loadModel();
		
		// to avoid scrollbars on desktop the root view must be set to block display
		this.setDisplayBlock(true);

		this.app = new sap.m.App({initialPage: "ZUI5_HR_YEARTAX.YearTaxList"});		
		this.app.addPage(sap.ui.jsview("ZUI5_HR_YEARTAX.YearTaxList", "ZUI5_HR_YEARTAX.YearTaxList"));
		
		return new sap.m.Shell({
			title : "연말정산",
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
		}).addStyleClass("PageWidth");
	},
	
	loadModel : function() {
		var lang = jQuery.sap.getUriParameters().get("sap-ui-language");
		if(!lang || lang == "") lang = "ko";
		
		
		// 기본 Model 선언
		var oServiceURL = this.getUrl("/sap/opu/odata/sap/ZL2P01GW9000_SRV/");
		var oModel = new sap.ui.model.odata.ODataModel(oServiceURL, true, undefined, undefined, undefined, undefined, undefined, false);
		//oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		oModel.setCountSupported(false);
		oModel.setRefreshAfterChange(false);
		sap.ui.getCore().setModel(oModel, "ZL2P01GW9000_SRV");
		
		
		
		var sServiceURL1 = this.getUrl("/sap/opu/odata/sap/ZHR_YEARTAX_SRV/");
		var oModel1 = new sap.ui.model.odata.ODataModel(sServiceURL1, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel1.setCountSupported(false);
		sap.ui.getCore().setModel(oModel1,"ZHR_YEARTAX_SRV");
		
		// 본인 사번 및 인사영역
		var EmpInfoJSONModel =  new sap.ui.model.json.JSONModel();
		var vEmpLoginInfoSet = {EmpLoginInfoSet : []};
		var vPersa = "";
		try {
			//각 프로그램의 메뉴ID를 Filter로 하여 화면 권한을 확인함.
	    	var vScryn = "";
	    	var vLpmid = "ELOAP";
	    	oModel.read("/EmpLoginInfoSet?$filter=Actty eq '" + _gAuth + "'",  
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							vEmpLoginInfoSet.EmpLoginInfoSet.push(oData.results[0]);
							vPersa = oData.results[0].Persa;
							gPersa = oData.results[0].Persa;
							gMolga = oData.results[0].Molga;
							gDtfmt = oData.results[0].Dtfmt;
							gDcpfm = oData.results[0].Dcpfm;
							gGenyn = oData.results[0].Genyn;  
							
							vScryn = oData.results[0].Scryn;
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
	    	
	    	//화면 권한이 없으면 권한 없음 화면으로 이동
	    	if(vScryn == "X") {
	    		document.location.href = "/sap/bc/ui5_ui5/sap/ZNK_COMMON_UI5/NoAuth.html";
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
		
		//코드 리스트
		var oEmpCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oEmpCodeList, "EmpCodeList");
		
		//사원검색 용 코드 리스트
		var mEmpSearchCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mEmpSearchCodeList, "EmpSearchCodeList");
		
		//사원검색결과
		var mEmpSearchResult = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mEmpSearchResult, "EmpSearchResult");
				
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