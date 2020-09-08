sap.ui.jsview("zui5_hrxx_actdoc.AppMain", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actdoc.AppMain
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actdoc.AppMain";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actdoc.AppMain
	*/ 
	createContent : function(oController) {
		this.loadModel();
		
		this.setDisplayBlock(true); 

		this.app = new sap.m.App({initialPage: "zui5_hrxx_actdoc.HRDocList"});		
		this.app.addPage(sap.ui.jsview("zui5_hrxx_actdoc.HRDocList", "zui5_hrxx_actdoc.HRDocList"));
		
		return new sap.m.Shell({
			title : oBundleText.getText("HRDOC_MGMT"),
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
		
		//퇴직프로세스 OData 및 App 기본 Model 선언
		var sServiceURL1 = this.getUrl("/sap/opu/odata/sap/ZHRXX_HRDOC_SRV/");
		var oModel = new sap.ui.model.odata.ODataModel(sServiceURL1, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel.setCountSupported(false);
		sap.ui.getCore().setModel(oModel,"ZHRXX_HRDOC_SRV");
		
		//공통 OData
		var sServiceURL2 = this.getUrl("/sap/opu/odata/sap/ZHRXX_COMMON_SRV/");
		var oCommonModel = new sap.ui.model.odata.ODataModel(sServiceURL2, true, undefined, undefined, undefined, undefined, undefined, false);
		oCommonModel.setCountSupported(false);
		oCommonModel.setSizeLimit(5000);
		sap.ui.getCore().setModel(oCommonModel,"ZHRXX_COMMON_SRV");
		
		
		var mHrDocumentsSet = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mHrDocumentsSet, "HrDocumentsSet");
		
		var mHrDocumentsDetailsSet = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mHrDocumentsDetailsSet, "HrDocumentsDetailsSet");
		
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
		
		try {
			var vScryn = "";
	    	var vLpmid = "HHRDO";
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
							gLangu = oData.results[0].Langu;
							
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
		
		//인사영역 리스트
		var mPersAreaListSet =  new sap.ui.model.json.JSONModel();
		var vPersAreaListSet = {PersAreaListSet : []};
		try {
			oCommonModel.read("/PersAreaListSet/?$filter=Actty%20eq%20%271%27", 
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								vPersAreaListSet.PersAreaListSet.push(oData.results[i]);
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
		mPersAreaListSet.setData(vPersAreaListSet);
		sap.ui.getCore().setModel(mPersAreaListSet, "PersAreaListSet");
		
		//HR서류 리스트
		var mHrDocumentTYpeSet =  new sap.ui.model.json.JSONModel();
		var vHrDocumentTYpeSet = {HrDocumentTYpeSet : []};
		try {
			oModel.read("/HrDocumentTYpeSet/?$filter=(Actty%20eq%20%27H%27)", 
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								vHrDocumentTYpeSet.HrDocumentTYpeSet.push(oData.results[i]);
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
		mHrDocumentTYpeSet.setData(vHrDocumentTYpeSet);
		sap.ui.getCore().setModel(mHrDocumentTYpeSet, "HrDocumentTYpeSet");
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