jQuery.sap.require("common.Common");

sap.ui.jsview("zui5_hrxx_actapp2.AppMain", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp2.AppMain";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	createContent : function(oController) {
		this.loadModel();
		
		this.setDisplayBlock(true);
		
		this.app = new sap.m.App({initialPage: "zui5_hrxx_actapp2.ActAppMain"});		
		this.app.addPage(sap.ui.jsview("zui5_hrxx_actapp2.ActAppMain", "zui5_hrxx_actapp2.ActAppMain"));
		 
		return new sap.m.Shell({
			title : "발령품의서",
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
		
		//업적평가 OData 및 App 기본 Model 선언
		var sServiceURL1 = this.getUrl("/sap/opu/odata/sap/ZL2P01GW0001_SRV/");
		var oModel = new sap.ui.model.odata.ODataModel(sServiceURL1, true, undefined, undefined, undefined, undefined, undefined, true);
		oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		oModel.setSizeLimit(50000);
		sap.ui.getCore().setModel(oModel,"ZL2P01GW0001_SRV");
		
		var sServiceURL2 = this.getUrl("/sap/opu/odata/sap/ZL2P01GW9000_SRV/");
		var oCommonModel = new sap.ui.model.odata.ODataModel(sServiceURL2, true, undefined, undefined, undefined, undefined, undefined, true);
		oCommonModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		oCommonModel.setSizeLimit(5000);
		sap.ui.getCore().setModel(oCommonModel,"ZL2P01GW9000_SRV");
		
		var sServiceURL3 = this.getUrl("/sap/opu/odata/sap/ZHRXX_RETAPPL_SRV/");
		var oModel3 = new sap.ui.model.odata.ODataModel(sServiceURL3, true, undefined, undefined, undefined, undefined, undefined, true);
		oModel3.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		oModel3.setSizeLimit(5000);
		sap.ui.getCore().setModel(oModel3,"ZHRXX_RETAPPL_SRV");	
		
		var sServiceURL4 = this.getUrl("/sap/opu/odata/sap/ZHRXX_EMP_PROFILE_SRV/");
		var oModel4 = new sap.ui.model.odata.ODataModel(sServiceURL4, true, undefined, undefined, undefined, undefined, undefined, true);
		oModel4.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		oModel4.setSizeLimit(5000);
		sap.ui.getCore().setModel(oModel4,"ZHRXX_EMP_PROFILE_SRV");
		
		var sServiceURL5 = this.getUrl("/sap/opu/odata/sap/ZHRXX_JOBCHANGE_SRV/");
		var oModel5 = new sap.ui.model.odata.ODataModel(sServiceURL5, true, undefined, undefined, undefined, undefined, undefined, true);
		oModel5.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		oModel5.setSizeLimit(5000);
		sap.ui.getCore().setModel(oModel5,"ZHRXX_JOBCHANGE_SRV");
		
		var sServiceURL6 = this.getUrl("/sap/opu/odata/sap/ZHRXX_PSTLZ_SRV/");
		var oZipcodeModel = new sap.ui.model.odata.ODataModel(sServiceURL6, true, undefined, undefined, undefined, undefined, undefined, true);
		oZipcodeModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		oModel5.setSizeLimit(5000);
		sap.ui.getCore().setModel(oZipcodeModel,"ZHRXX_PSTLZ_SRV");
		
//		var sServiceURL7 = this.getUrl("/sap/opu/odata/sap/ZHRXX_LANDINGPAGE_SRV/");
//		var oModel7 = new sap.ui.model.odata.ODataModel(sServiceURL7, true, undefined, undefined, undefined, undefined, undefined, false);
//		oModel7.setCountSupported(false);
//		sap.ui.getCore().setModel(oModel7,"ZHRXX_LANDINGPAGE_SRV");
//		
//		var sServiceURL8 = this.getUrl("/sap/opu/odata/sap/ZSFXX_ONBAPP_SRV/");
//		var oModel8 = new sap.ui.model.odata.ODataModel(sServiceURL8, true, undefined, undefined, undefined, undefined, undefined, false);
//		oModel8.setCountSupported(false);
//		sap.ui.getCore().setModel(oModel8,"ZSFXX_ONBAPP_SRV");
//		
//		
//		//개인 설정 인사영역 조회
		var SelectedPersaJSONModel =  new sap.ui.model.json.JSONModel();
		var vSelectedPersaDatas = {SelectedPersAreaListSet : []};
//		try {
//			oModel7.read("/LandingPagePersonalizationListSet/?$filter=Pobjt%20eq%20%2713%27", 
//					null, 
//					null, 
//					false,
//					function(oData, oResponse) {					
//						if(oData && oData.results.length) {
//							for(var i=0; i<oData.results.length; i++) {
//								vSelectedPersaDatas.SelectedPersAreaListSet.push(oData.results[i]);
//							}
//						}
//					},
//					function(oResponse) {
//						common.Common.log(oResponse);
//					}
//			);
//		} catch(ex) {
//			common.Common.log(ex);
//		}
		SelectedPersaJSONModel.setData(vSelectedPersaDatas);
		sap.ui.getCore().setModel(SelectedPersaJSONModel, "SelectedPersaJSONModel");
	    
	    try {
	    	//각 프로그램의 메뉴ID를 Filter로 하여 화면 권한을 확인함.
	    	var vScryn = "";
	    	var vLpmid = "HACT2";
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
							gEeapp  = oData.results[0].Eeapp;
							//추가
							vScryn = oData.results[0].Scryn;
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
	    	//화면 권한이 없으면 권한 없음 화면으로 이동
	    	if(vScryn != "X") {
	    		document.location.href = "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/NoAuth.html?menuid=" + vLpmid;
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
//		var PersaJSONModel =  new sap.ui.model.json.JSONModel();
//		var vPersaDatas = {PersAreaListSet : []};
//		try {
//			oModel.read("/PersAreaListSet/?$filter=Actty%20eq%20%271%27", 
//					null, 
//					null, 
//					false,
//					function(oData, oResponse) {					
//						if(oData && oData.results.length) {
//							for(var i=0; i<oData.results.length; i++) {
//								vPersaDatas.PersAreaListSet.push(oData.results[i]);
//							}
//						}
//					},
//					function(oResponse) {
//						common.Common.log(oResponse);
//					}
//			);
//		} catch(ex) {
//			common.Common.log(ex);
//		}
//		PersaJSONModel.setData(vPersaDatas);
//		sap.ui.getCore().setModel(PersaJSONModel, "PersaModel");
		
		//정렬대상 리스트
		var mActionAppReqSort =  new sap.ui.model.json.JSONModel();
		var vActionAppReqSort = {ActionAppReqSortSet : []};
		try {
			oModel.read("/ActionAppReqSortSet", 
					null, 
					null, 
					true,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							vActionAppReqSort.ActionAppReqSortSet.push({Srtfc : "0000", Srtft : oBundleText.getText("SELECTDATA")});
							for(var i=0; i<oData.results.length; i++) {
								vActionAppReqSort.ActionAppReqSortSet.push(oData.results[i]);
							}
							mActionAppReqSort.setData(vActionAppReqSort);
						}
					},
					function(oResponse) { 
						common.Common.log(oResponse);
					}
			);
		} catch(ex) {
			common.Common.log(ex);
		}		
		sap.ui.getCore().setModel(mActionAppReqSort, "ActionAppReqSort");
		
		//정렬방법 리스트
		var mActionAppReqSortType =  new sap.ui.model.json.JSONModel();
		var vActionAppReqSortType = {ActionAppReqSortTypeSet : []};
		try {
			oModel.read("/ActionAppReqSortTypeSet", 
					null, 
					null, 
					true,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							vActionAppReqSortType.ActionAppReqSortTypeSet.push({Srttc : "0000", Srttt : oBundleText.getText("SELECTDATA")});
							for(var i=0; i<oData.results.length; i++) {
								vActionAppReqSortType.ActionAppReqSortTypeSet.push(oData.results[i]);
							}
							mActionAppReqSortType.setData(vActionAppReqSortType);
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
		} catch(ex) {
			common.Common.log(ex);
		}
		sap.ui.getCore().setModel(mActionAppReqSortType, "ActionAppReqSortType");
		
		//발령품의서 리스트
		var oActionReqList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oActionReqList, "ActionReqList");
		oActionReqList.setSizeLimit(1000);
		
		//발령대상자 리스트
		var oActionSubjectList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oActionSubjectList, "ActionSubjectList");
		
		var oActionSubjectList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oActionSubjectList, "ActionSubjectList_Temp");
		
		//코드 리스트
		var oEmpCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oEmpCodeList, "EmpCodeList");
		oEmpCodeList.setSizeLimit(5000);
		
		//도메인 코드 리스트
		var mDomainCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mDomainCodeList, "DomainCodeList");
		mDomainCodeList.setSizeLimit(5000);
		
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
		var vDocTypeList = {DocTypeListSet :[{Docty : "10", Doctx : oBundleText.getText("DOCTY10"), PageId : "zui5_hrxx_actapp2.ActAppDocument"},
		                                      {Docty : "20", Doctx : oBundleText.getText("DOCTY21"), PageId : "zui5_hrxx_actapp2.ActRecDocument"},
//		                                      {Docty : "30", Doctx : oBundleText.getText("DOCTY30"), PageId : "zui5_hrxx_actapp2.ActOrgDocument"},
		                                      {Docty : "40", Doctx : oBundleText.getText("DOCTY40"), PageId : "zui5_hrxx_actapp2.ActRetireDocument"},
//		                                      {Docty : "50", Doctx : oBundleText.getText("DOCTY50"), PageId : "zui5_hrxx_actapp2.ActContractDocument"}
		                                     ]};
		
		var mDocTypeList = new sap.ui.model.json.JSONModel();
		mDocTypeList.setData(vDocTypeList);
		sap.ui.getCore().setModel(mDocTypeList, "DocTypeList");
		
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
 						if(oData && oData.results.length) {
 							vCode.natioCode.push({Field : "Natio", Ecode : "", Etext : oBundleText.getText("NOVALUE")});
 							
 							for(var i=0; i<oData.results.length; i++) {
 								vCode.natioCode.push(oData.results[i]);
 							}
 							oNatioList.setData(vCode);
 						}
 					},
 					function(oResponse) {
 						console.log(oResponse);
 					}
 		);
 		
		// 자격증유형 코드 리스트
 		var oCttypList = new sap.ui.model.json.JSONModel();
 		sap.ui.getCore().setModel(oCttypList, "CttypList"); 
 		
		//전공코드 리스트
		var oFaartCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oFaartCodeList, "FaartCodeList");
						
		//자격요건코드 리스트
		var oZzqualiCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oZzqualiCodeList, "ZzqualiCodeList");
		
		oEmpCodeList.setSizeLimit(3000);
		
		var mOneCodeModel = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mOneCodeModel, "CodeListModel");
		
		//
		//퇴직사유코드 리스트
		var mRetirementReasonList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mRetirementReasonList, "RetirementReasonList");
		mRetirementReasonList.setSizeLimit(3000);
		
		//은행코드 리스트
		var mBankCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mBankCodeList, "BankCodeList");
		mBankCodeList.setSizeLimit(3000);
		
		//SF 채용이관 리스트
		var mSFRecruitingInterface = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mSFRecruitingInterface, "SFRecruitingInterface");
		mSFRecruitingInterface.setSizeLimit(10000);
	},
	
	/*
	 * OData Service URL?? ?????? Function 
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