sap.ui.jsview("zui5_hrxx_retireprocess.AppMain", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_retireprocess.AppMain
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_retireprocess.AppMain";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_retireprocess.AppMain
	*/ 
	createContent : function(oController) { 
		
		// to avoid scrollbars on desktop the root view must be set to block display
		this.setDisplayBlock(true);
		this.loadModel();
		
		this.app = new sap.m.SplitApp("RetireProcessApp", {});		
		this.app.addMasterPage(sap.ui.jsview("zui5_hrxx_retireprocess.ProcessMenu", "zui5_hrxx_retireprocess.ProcessMenu"));
		this.app.addDetailPage(sap.ui.jsview("zui5_hrxx_retireprocess.Dummy", "zui5_hrxx_retireprocess.Dummy"));
		
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
		
		var sServiceURL1 = this.getUrl("/sap/opu/odata/sap/ZHRXX_ACTIONAPP_SRV/");
		var oModel1 = new sap.ui.model.odata.ODataModel(sServiceURL1, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel1.setCountSupported(false);
		sap.ui.getCore().setModel(oModel1,"ZHRXX_ACTIONAPP_SRV");
		
		//인사영역 리스트
		var PersaJSONModel =  new sap.ui.model.json.JSONModel();
		var vPersaDatas = {PersAreaListSet : []};
		try {
			oModel1.read("/PersAreaListSet/?$filter=Actty%20eq%20%271%27", 
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								vPersaDatas.PersAreaListSet.push(oData.results[i]);
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
		} catch(ex) {
			common.Common.log(ex);
		}
		PersaJSONModel.setData(vPersaDatas);
		sap.ui.getCore().setModel(PersaJSONModel, "PersaModel");	
		
		var sServiceURL2 = this.getUrl("/sap/opu/odata/sap/ZHRXX_COMMON_SRV/");
		var oCommonModel = new sap.ui.model.odata.ODataModel(sServiceURL2, true, undefined, undefined, undefined, undefined, undefined, false);
		oCommonModel.setCountSupported(false);
		oCommonModel.setSizeLimit(5000);
		sap.ui.getCore().setModel(oCommonModel,"ZHRXX_COMMON_SRV");
		
		var vScryn = "";
    	var vLpmid = "HRETP";
    	oCommonModel.read("/EmpLoginInfoSet/?$filter=Lpmid%20eq%20%27" + vLpmid + "%27", 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
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
    	if(vScryn != "X") {
    		document.location.href = "/sap/bc/ui5_ui5/sap/zhrxx_common/NoAuth.html?menuid=" + vLpmid;
    		return;
    	}
    	
    	if(gDtfmt != "") {
			gDtfmt = gDtfmt.replace("YYYY", "yyyy");
			gDtfmt = gDtfmt.replace("DD", "dd");
		}
    	
		var sServiceURL3 = this.getUrl("/sap/opu/odata/sap/ZHRXX_RETAPPL_SRV/");
		var oModel3 = new sap.ui.model.odata.ODataModel(sServiceURL3, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel3.setCountSupported(false);
		sap.ui.getCore().setModel(oModel3,"ZHRXX_RETAPPL_SRV");
		
//		//코드 리스트
//		var oEmpCodeList = new sap.ui.model.json.JSONModel();
//		sap.ui.getCore().setModel(oEmpCodeList, "EmpCodeList");
		
		//사원검색 용 코드 리스트
		var mEmpSearchCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mEmpSearchCodeList, "EmpSearchCodeList");
		
		//사원검색결과
		var mEmpSearchResult = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mEmpSearchResult, "EmpSearchResult");
		
//		//사진 다운로드 사원 리스트
//		var oActionDownloadPicList = new sap.ui.model.json.JSONModel();
//		sap.ui.getCore().setModel(oActionDownloadPicList, "ActionDownloadPicList");
		

	},
	/*
	 *
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