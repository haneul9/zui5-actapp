sap.ui.jsview("zui5_hrxx_actexam.AppMain", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actexam.AppMain
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actexam.AppMain";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actexam.AppMain
	*/ 
	createContent : function(oController) {
		// to avoid scrollbars on desktop the root view must be set to block display
		this.setDisplayBlock(true);
		this.loadModel();
		
		this.app = new sap.m.App({initialPage: "zui5_hrxx_actexam.ActExamMain"});		
		this.app.addPage(sap.ui.jsview("zui5_hrxx_actexam.ActExamMain", "zui5_hrxx_actexam.ActExamMain"));
		
		return new sap.m.Shell({
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
		

		
		var sServiceURL1 = this.getUrl("/sap/opu/odata/sap/ZHRXX_LANGUAGE_SRV/");
		var oModel = new sap.ui.model.odata.ODataModel(sServiceURL1, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel.setCountSupported(false);
		sap.ui.getCore().setModel(oModel,"ZHRXX_LANGUAGE_SRV");
		
		var sServiceURL2 = this.getUrl("/sap/opu/odata/sap/ZHRXX_COMMON_SRV/");
		var oCommonModel = new sap.ui.model.odata.ODataModel(sServiceURL2, true, undefined, undefined, undefined, undefined, undefined, false);
		oCommonModel.setCountSupported(false);
		oCommonModel.setSizeLimit(5000);
		sap.ui.getCore().setModel(oCommonModel,"ZHRXX_COMMON_SRV");
		
		var sServiceURL3 = this.getUrl("/sap/opu/odata/sap/ZHRXX_ACTIONAPP_SRV/");
		var oModel3 = new sap.ui.model.odata.ODataModel(sServiceURL3, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel3.setCountSupported(false);
		sap.ui.getCore().setModel(oModel3,"ZHRXX_ACTIONAPP_SRV");
		
		//인사영역 리스트
		var PersaJSONModel =  new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(PersaJSONModel, "PersaModel");
		
		//어학 시험 등록 리스트
		var oLangExamRegisterList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oLangExamRegisterList, "LangExamRegisterList");
		
		
		//코드 리스트
		var oEmpCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oEmpCodeList, "EmpCodeList");
		
		var EmpInfoJSONModel =  new sap.ui.model.json.JSONModel();
		var vEmpLoginInfoSet = {EmpLoginInfoSet : []};
		try {
			//각 프로그램의 메뉴ID를 Filter로 하여 화면 권한을 확인함.
	    	var vScryn = "";
	    	var vLpmid = "HLANG";
	    	oCommonModel.read("/EmpLoginInfoSet/?$filter=Lpmid%20eq%20%27" + vLpmid + "%27", 
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							vEmpLoginInfoSet.EmpLoginInfoSet.push(oData.results[0]);
							gPersa = oData.results[0].Persa;
							gMolga = oData.results[0].Molga;
							gDtfmt = oData.results[0].Dtfmt;
							gDcpfm = oData.results[0].Dcpfm;
							
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