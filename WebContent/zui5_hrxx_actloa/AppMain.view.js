jQuery.sap.require("common.Common");

sap.ui.jsview("zui5_hrxx_actloa.AppMain", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actloa.AppMain";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	createContent : function(oController) {
		this.loadModel();
		
		// to avoid scrollbars on desktop the root view must be set to block display
		this.setDisplayBlock(true);


		this.app = new sap.m.App({initialPage: "zui5_hrxx_actloa.LoaAppMain"});		
		this.app.addPage(sap.ui.jsview("zui5_hrxx_actloa.LoaAppMain", "zui5_hrxx_actloa.LoaAppMain"));
		
		return new sap.m.Shell({
			title : "휴직신청관리",
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
		
//		var locale = sap.ui.getCore().getConfiguration().getLanguage(); //언어
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : locale
//        });
		
		
		var sServiceURL1 = this.getUrl("/sap/opu/odata/sap/ZHRXX_LOA_APPLICATION_SRV/");
		var oModel = new sap.ui.model.odata.ODataModel(sServiceURL1, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel.setCountSupported(false);
		sap.ui.getCore().setModel(oModel,"ZHRXX_LOA_APPLICATION_SRV");
		
		var sServiceURL2 = this.getUrl("/sap/opu/odata/sap/ZHRXX_COMMON_SRV/");
		var oCommonModel = new sap.ui.model.odata.ODataModel(sServiceURL2, true, undefined, undefined, undefined, undefined, undefined, false);
		oCommonModel.setCountSupported(false);
		oCommonModel.setSizeLimit(5000);
		sap.ui.getCore().setModel(oCommonModel,"ZHRXX_COMMON_SRV");
		
		var sServiceURL3 = this.getUrl("/sap/opu/odata/sap/ZHRXX_ACTIONAPP_SRV/");
		var oModel3 = new sap.ui.model.odata.ODataModel(sServiceURL3, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel3.setCountSupported(false);
		sap.ui.getCore().setModel(oModel3,"ZHRXX_ACTIONAPP_SRV");
		
		var sServiceURL4 = this.getUrl("/sap/opu/odata/sap/ZHRXX_RETAPPL_SRV/");
		var oModel4 = new sap.ui.model.odata.ODataModel(sServiceURL4, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel4.setCountSupported(false);
		sap.ui.getCore().setModel(oModel4,"ZHRXX_RETAPPL_SRV");
		
		//인사영역 리스트
		var PersaJSONModel =  new sap.ui.model.json.JSONModel();
		var vPersaDatas = {PersAreaListSet : []};
		try {
			oModel3.read("/PersAreaListSet/?$filter=Actty%20eq%20%271%27", 
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
		
		var EmpInfoJSONModel =  new sap.ui.model.json.JSONModel();
		var vEmpLoginInfoSet = {EmpLoginInfoSet : []};
		var vPersa = null ;
	    try {
	    	var vScryn = "";
	    	var vLpmid = "HLOAP";
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
		} catch(ex) {
			common.Common.log(ex);
		}
    	
		if(gDtfmt != "") {
			gDtfmt = gDtfmt.replace("YYYY", "yyyy");
			gDtfmt = gDtfmt.replace("DD", "dd");
		}	
		EmpInfoJSONModel.setData(vEmpLoginInfoSet);
		sap.ui.getCore().setModel(EmpInfoJSONModel, "EmpLoginInfo");
		
		
		//휴복직구분
		var mLoaCodeList =  new sap.ui.model.json.JSONModel();
		var vLoaCodeList = {LoaCodeListSet : []};
		
		 try {
			 	oModel.read("/LoaCodeListSet?$filter=Persa%20eq%20%27"+ vPersa + "%27%20and%20"+
			 			                            "Field%20eq%20%27"+ "Latyp" + "%27", 
						null, 
						null, 
						false,
						function(oData, oResponse) {					
							if(oData && oData.results.length) {
								for(var i=0; i<oData.results.length; i++) {
									vLoaCodeList.LoaCodeListSet.push(oData.results[i]);
								}
								mLoaCodeList.setData(vLoaCodeList);
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
				);
			} catch(ex) {
				common.Common.log(ex);
			}
			
		sap.ui.getCore().setModel(mLoaCodeList, "LoaCodeList");
		
		//휴복직사유리스트
		var mLoaTypeReason =  new sap.ui.model.json.JSONModel();
		var vLoaTypeReason = {LoaTypeReasonSet : []};
		try {
		 	oModel.read("/LoaTypeReasonSet?$filter=Persa%20eq%20%27"+vPersa+"%27", 
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								vLoaTypeReason.LoaTypeReasonSet.push(oData.results[i]);
							}
							mLoaTypeReason.setData(vLoaTypeReason);
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
		} catch(ex) {
			common.Common.log(ex);
		}
		
		sap.ui.getCore().setModel(mLoaTypeReason, "LoaTypeReason");
		
		//발령품의서 리스트
		var oEtcLoaApplicationList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oEtcLoaApplicationList, "EtcLoaApplicationList");
		oEtcLoaApplicationList.setSizeLimit(5000);
		
		//코드 리스트
		var oEmpCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oEmpCodeList, "EmpCodeList");
		oEmpCodeList.setSizeLimit(500);
	
		//파일첨부리스트
		var mLoaAttatchedFile = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mLoaAttatchedFile, "LoaAttatchedFile");
		
		//사원검색 용 코드 리스트
		var mEmpSearchCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mEmpSearchCodeList, "EmpSearchCodeList");
		
		//사원검색결과
		var mEmpSearchResult = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mEmpSearchResult, "EmpSearchResult");
		
		// 모성보호 신청 리스트
		var oMaternityProtectionApplicationList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oMaternityProtectionApplicationList, "MaternityProtectionApplicationList");
		
		var oMaternityProtectionSet = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oMaternityProtectionSet, "MaternityProtection");
		
		var oMaternityProtectionDetailsSet = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oMaternityProtectionDetailsSet, "MaternityProtectionDetails");
		
		var oChildCareLeaveChildSet = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oChildCareLeaveChildSet, "ChildCareLeaveChild");	
		
		var oFirstApplicationInformationSet = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oFirstApplicationInformationSet, "FirstApplicationInformation");	
		
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