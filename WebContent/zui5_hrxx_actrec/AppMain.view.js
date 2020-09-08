jQuery.sap.require("common.Common");

sap.ui.jsview("zui5_hrxx_actrec.AppMain", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actrec.AppMain";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	createContent : function(oController) {
		this.loadModel();
		
//		//필요한 CSS 파일을 Include 한다.
//		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/zhrxx_common/css/L2P2SAP1.css");
//		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/zhrxx_common/css/L2PBasic.css");
		
		// to avoid scrollbars on desktop the root view must be set to block display
		this.setDisplayBlock(true);


		this.app = new sap.m.App({initialPage: "zui5_hrxx_actrec.ActRecMain"});		
		this.app.addPage(sap.ui.jsview("zui5_hrxx_actrec.ActRecMain", "zui5_hrxx_actrec.ActRecMain"));
		//this.app.setBackgroundColor("#FFFFFF");
//		this.app.setBackgroundImage("images/bg.jpg");
//		this.app.setBackgroundRepeat(true);
		
		return new sap.m.Shell({
			title : "발령품의서",
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
		
		//업적평가 OData 및 App 기본 Model 선언
		var sServiceURL1 = this.getUrl("/sap/opu/odata/sap/ZHRXX_ACTIONAPP_SRV/");
		var oModel = new sap.ui.model.odata.ODataModel(sServiceURL1, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel.setCountSupported(false);
		sap.ui.getCore().setModel(oModel,"ZHRXX_ACTIONAPP_SRV");
		
		var sServiceURL2 = this.getUrl("/sap/opu/odata/sap/ZHRXX_COMMON_SRV/");
		var oCommonModel = new sap.ui.model.odata.ODataModel(sServiceURL2, true, undefined, undefined, undefined, undefined, undefined, false);
		oCommonModel.setCountSupported(false);
		oCommonModel.setSizeLimit(5000);
		sap.ui.getCore().setModel(oCommonModel,"ZHRXX_COMMON_SRV");
		
		var sServiceURL3 = this.getUrl("/sap/opu/odata/sap/ZSFXX_ONBAPP_SRV/");
		var oModel3 = new sap.ui.model.odata.ODataModel(sServiceURL3, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel3.setCountSupported(false);
		sap.ui.getCore().setModel(oModel3,"ZSFXX_ONBAPP_SRV");
		/*
		try {
	    	var vLpmid = "EFAMI";
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
		var PersaJSONModel =  new sap.ui.model.json.JSONModel();
		var vPersaDatas = {PersAreaListSet : []};
		try {
			oModel.read("/PersAreaListSet/?$filter=Actty%20eq%20%271%27", 
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
		
		//정렬대상 리스트
		var mActionAppReqSort =  new sap.ui.model.json.JSONModel();
		var vActionAppReqSort = {ActionAppReqSortSet : []};
		try {
			oModel.read("/ActionAppReqSortSet", 
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							vActionAppReqSort.ActionAppReqSortSet.push({Srtfc : "0000", Srtft : oBundleText.getText("SELECTDATA")});
							for(var i=0; i<oData.results.length; i++) {
								vActionAppReqSort.ActionAppReqSortSet.push(oData.results[i]);
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
		mActionAppReqSort.setData(vActionAppReqSort);
		sap.ui.getCore().setModel(mActionAppReqSort, "ActionAppReqSort");
		
		//정렬방법 리스트
		var mActionAppReqSortType =  new sap.ui.model.json.JSONModel();
		var vActionAppReqSortType = {ActionAppReqSortTypeSet : []};
		try {
			oModel.read("/ActionAppReqSortTypeSet", 
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							vActionAppReqSortType.ActionAppReqSortTypeSet.push({Srttc : "0000", Srttt : oBundleText.getText("SELECTDATA")});
							for(var i=0; i<oData.results.length; i++) {
								vActionAppReqSortType.ActionAppReqSortTypeSet.push(oData.results[i]);
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
		mActionAppReqSortType.setData(vActionAppReqSortType);
		sap.ui.getCore().setModel(mActionAppReqSortType, "ActionAppReqSortType");
		
		//발령품의서 리스트
		var oActionReqList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oActionReqList, "ActionReqList");
		
		//발령대상자 리스트
		var oActionSubjectList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oActionSubjectList, "ActionSubjectList");
		
		var oActionSubjectList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oActionSubjectList, "ActionSubjectList_Temp");
		
		//코드 리스트
		var oEmpCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oEmpCodeList, "EmpCodeList");
		oEmpCodeList.setSizeLimit(500);
		
		//사원검색 용 코드 리스트
		var mEmpSearchCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mEmpSearchCodeList, "EmpSearchCodeList");
		
		//발령유형 및 사유 그룹핑
		var mActionAppGrouping = new sap.ui.model.json.JSONModel();		
		sap.ui.getCore().setModel(mActionAppGrouping, "ActionAppGrouping");
		
		//메일수신자 리스트
		var oActionMailingList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oActionMailingList, "ActionMailingList");
		
		//확정에 따른 기본 메일발송 리스트
		var mActionMailRecipientList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mActionMailRecipientList, "ActionMailRecipientList");
		
		//사원검색결과
		var mEmpSearchResult = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mEmpSearchResult, "EmpSearchResult");
		
		//사원검색결과
		var mActionEmpSearchResult = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mActionEmpSearchResult, "ActionEmpSearchResult");
		
		//문서유형 리스트
		var vDocTypeList = {DocTypeListSet :[{Docty : "10", Doctx : "사내/사간 발령", PageId : "zui5_hrxx_actapp.ActAppDocument"},
		                                      {Docty : "20", Doctx : "채용 발령(계약직, 파견직 포함)", PageId : "zui5_hrxx_actapp.ActRecDocument"},
		                                      {Docty : "30", Doctx : "조직 개편", PageId : "zui5_hrxx_actapp.ActOrgDocument"},
//		                                      {Docty : "40", Doctx : "휴/복직 발령", PageId : "zui5_hrxx_actapp.ActAppDocument"},
//		                                      {Docty : "50", Doctx : "퇴직 발령", PageId : "zui5_hrxx_actapp.ActAppDocument"}
		                                     ]};
		
		var mDocTypeList = new sap.ui.model.json.JSONModel();
		mDocTypeList.setData(vDocTypeList);
		sap.ui.getCore().setModel(mDocTypeList, "DocTypeList");
		
		// 채용이관 리스트
		var oActionRecList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oActionRecList, "ActionRecList");
		
		// 채용이관 대상자 리스트
		var oActionRecSubjectList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oActionRecSubjectList, "ActionRecSubjectList");
		
		// 채용이관 리스트 (인터페이스)
		var oActionRecListInterface = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oActionRecListInterface, "ActionRecListInterface");
		
		// 국가 코드 리스트
 		var oNatioList = new sap.ui.model.json.JSONModel();
 		sap.ui.getCore().setModel(oNatioList, "NatioList"); 
 		var vCode = {
 			natioCode : []
 		};
 		
 		// 국가코드 
 		oCommonModel.read("/EmpCodeListSet?$filter=Field eq 'Natio' and PersaNc eq 'X'", 
 					null, 
 					null, 
 					false, 
 					function(oData, oResponse) {
 						var i;
 						if(oData && oData.results.length) {
 							for(i=0; i<oData.results.length; i++) {
 								vCode.natioCode.push(oData.results[i]);
 							}
 						}
 					},
 					function(oResponse) {
 						console.log(oResponse);
 					}
 		);
 		oNatioList.setData(vCode);
 		
 		// 자격증유형 코드 리스트
 		var oCttypList = new sap.ui.model.json.JSONModel();
 		sap.ui.getCore().setModel(oCttypList, "CttypList"); 
 		
 		var sServiceURL3 = this.getUrl("/sap/opu/odata/sap/ZHRXX_PSTLZ_SRV/");
		var oZipcodeModel = new sap.ui.model.odata.ODataModel(sServiceURL3, true, undefined, undefined, undefined, undefined, undefined, false);
		oZipcodeModel.setCountSupported(false);
		sap.ui.getCore().setModel(oZipcodeModel,"ZHRXX_PSTLZ_SRV");
		*/
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