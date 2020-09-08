jQuery.sap.require("common.Common");

sap.ui.jsview("zui5_hrxx_project.AppMain", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_project.AppMain";
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

		var vPage = jQuery.sap.getUriParameters().get("page");
		var vInitialPage = "";
		if(vPage == "exp") {
			vInitialPage = "zui5_hrxx_project.ProjectExpMain";
			document.title = oBundleText.getText("TITLE_PROJECT_EXP");
		} else {
			vInitialPage = "zui5_hrxx_project.ProjectMain";
			document.title = oBundleText.getText("TITLE_PROJECT_MANGE");
		}
		try {
				var vHostName = location.hostname;
				if(vHostName.indexOf(".corp.") > 0) {
					document.domain = "corp.doosan.com";
				} else {
					document.domain = "doosan.com";
				}
				top.document.title = document.title;
			} catch(ex) {
				console.log(ex);
			}

		this.app = new sap.m.App({initialPage: vInitialPage});		
		this.app.addPage(sap.ui.jsview("zui5_hrxx_project.ProjectMain", "zui5_hrxx_project.ProjectMain"));
		this.app.addPage(sap.ui.jsview("zui5_hrxx_project.ProjectExpMain", "zui5_hrxx_project.ProjectExpMain"));
		//this.app.setBackgroundColor("#FFFFFF");
//		this.app.setBackgroundImage("images/bg.jpg");
//		this.app.setBackgroundRepeat(true);
		
		return new sap.m.Shell({
//			title : "프로젝트관리",
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
		
		var sServiceURL1 = this.getUrl("/sap/opu/odata/sap/ZHRXX_ACTIONAPP_SRV/");
		var oModel = new sap.ui.model.odata.ODataModel(sServiceURL1, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel.setCountSupported(false);
		sap.ui.getCore().setModel(oModel,"ZHRXX_ACTIONAPP_SRV");
		
		var sServiceURL2 = this.getUrl("/sap/opu/odata/sap/ZHRXX_COMMON_SRV/");
		var oCommonModel = new sap.ui.model.odata.ODataModel(sServiceURL2, true, undefined, undefined, undefined, undefined, undefined, false);
		oCommonModel.setCountSupported(false);
		oCommonModel.setSizeLimit(5000);
		sap.ui.getCore().setModel(oCommonModel,"ZHRXX_COMMON_SRV");
		
		var sServiceURL3 = this.getUrl("/sap/opu/odata/sap/ZHRXX_PROJECT_SRV/");
		var oProjectModel = new sap.ui.model.odata.ODataModel(sServiceURL3, true, undefined, undefined, undefined, undefined, undefined, false);
		oProjectModel.setCountSupported(false);
		sap.ui.getCore().setModel(oProjectModel,"ZHRXX_PROJECT_SRV");
		
		//프로젝트 리스트
		var oProjectList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oProjectList, "ProjectList");
		
		//프로젝트 Search 리스트
		var oProjectList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oProjectList, "ProjectSearchList");
		
		//코드 리스트
		var oEmpCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oEmpCodeList, "EmpCodeList");
		oEmpCodeList.setSizeLimit(1000);
		
		//사원검색 용 코드 리스트
		var mEmpSearchCodeList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mEmpSearchCodeList, "EmpSearchCodeList");
		
		//사원검색결과
		var mEmpSearchResult = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mEmpSearchResult, "EmpSearchResult");
		
		var sServiceURL4 = this.getUrl("/sap/opu/odata/sap/ZHRXX_JOBCHANGE_SRV/");
		var oJobchangeModel = new sap.ui.model.odata.ODataModel(sServiceURL4, true, undefined, undefined, undefined, undefined, undefined, true);
		oJobchangeModel.setCountSupported(false);
		sap.ui.getCore().setModel(oJobchangeModel,"ZHRXX_JOBCHANGE_SRV");
		
		// 국가 코드 리스트
		var oNatioList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oNatioList, "NatioList"); 
		var vCode = {
			natioCode : []         // 국가
		};
		
		// 국가코드 
		oJobchangeModel.read("/ProductAreaListSet", 
					null, 
					null, 
					true, 
					function(oData, oResponse) {
						var i;
						if(oData && oData.results.length) {
							for(i=0; i<oData.results.length; i++) {
								var oneData = {};
								oneData.Field = "Natio";
								oneData.Ecode = oData.results[i].Zzprdar;
								oneData.Etext = oData.results[i].Zzprdartx;
								vCode.natioCode.push(oneData);
							}
							oNatioList.setData(vCode);
						}
					},
					function(oResponse) {
						console.log(oResponse);
					}
		);
		
 		try {
			var vPage = jQuery.sap.getUriParameters().get("page");
			var vScryn = "";
	    	var vLpmid = "";
	    	
	    	if(vPage == "exp") {
	    		vLpmid= "HPRJE";
			} else {
				vLpmid= "HPROJ";
			}
	    	
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
							
							//화면 권한이 없으면 권한 없음 화면으로 이동
					    	if(vScryn != "X") {
					    		document.location.href = "/sap/bc/ui5_ui5/sap/zhrxx_common/NoAuth.html?menuid=" + vLpmid;
					    		return;
					    	}
					    	
							if(gDtfmt != "") {
								gDtfmt = gDtfmt.replace("YYYY", "yyyy");
								gDtfmt = gDtfmt.replace("DD", "dd");
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
		
		var oEmpCodeList2 = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oEmpCodeList2, "EmpCodeList2");
		oEmpCodeList2.setSizeLimit(1000);
		var vCommCode = {
				PJTCK : [],		//통화
				PJTUN : [],		//단위
				PJTTY : []
		};
 		oCommonModel.read("/EmpCodeListSet?$filter=(Field eq 'Pjtck' or Field eq 'Pjtun' or Field eq 'Pjtty') and PersaNc eq 'X'", 
 					null, 
 					null, 
 					false, 
 					function(oData, oResponse) {
 						var i;
 						if(oData && oData.results.length) {
 							for(i=0; i<oData.results.length; i++) {
 								switch(oData.results[i].Field) {
	 								case "Pjtck" :
	 									vCommCode.PJTCK.push(oData.results[i]);
	 									break;
	 								case "Pjtun" :
	 									vCommCode.PJTUN.push(oData.results[i]);
	 									break;
	 								case "Pjtty" :
	 									vCommCode.PJTTY.push(oData.results[i]);
	 									break;
	 							}
 							}
 							oEmpCodeList2.setData(vCommCode);
 						}
 					},
 					function(oResponse) {
 						console.log(oResponse);
 					}
 		);
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