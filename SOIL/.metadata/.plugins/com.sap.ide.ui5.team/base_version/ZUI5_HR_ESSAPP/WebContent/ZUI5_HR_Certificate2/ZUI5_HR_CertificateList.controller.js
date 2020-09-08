jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_Certificate2.ZUI5_HR_CertificateList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Certificate2.ZUI5_HR_CertificateList
	 */

	PAGEID : "ZUI5_HR_CertificateList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vPernr : "" , // 로그인 사번 
	_vEnamefg : "",
	_oControl  : null,
	_Columns : "",
	BusyDialog : new sap.m.BusyDialog(),
	
	onInit : function() {

		this.getView().addStyleClass("sapUiSizeCompact");


		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this)
		});

		this.getView().addEventDelegate({
			onAfterShow : jQuery.proxy(function(evt) {
				this.onAfterShow(evt);
			}, this),
		});

		var bus = sap.ui.getCore().getEventBus();
		bus.subscribe("app", "OpenWindow", this.SmartSizing,
				this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing,
				this);
	},

	onPopover : function(oEvent) {
		
	},
	
	onBeforeShow : function(oEvent) {
		var oController = this ;
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1 , curDate.getDate()+1);
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		if(vEmpLoginInfo.length > 0){
			oController._vPernr = vEmpLoginInfo[0].Pernr ;
		}
		
		var vEname = "";
		var vPernr = "";
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1){
			if(_gAuth == "E"){
				if(vEmpLoginInfo.length > 0){
					var OneData = {};
					// 대상자
					vEname = vEmpLoginInfo[0].Ename ;
					vPernr = vEmpLoginInfo[0].Pernr ;
				}
			
				var JSonData = { Data : { Apbeg : dateFormat.format(prevDate) , Apend : dateFormat.format(curDate) , Pernr : vPernr, Ename : vEname , Payym :""}};
				oController._ListCondJSonModel.setData(JSonData);
			}else{
				var JSonData = { Data : { Apbeg : dateFormat.format(prevDate) , Apend : dateFormat.format(curDate) , Pernr : "", Ename : "" , Payym :""}};
				oController._ListCondJSonModel.setData(JSonData);
			}
		}
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
		this.onPressSearch();
		
	},
	
	onPressNew : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate2.ZUI5_HR_CertificateList");
		var oController = oView.getController();
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_Certificate2.ZUI5_HR_CertificateDetail",
		      data : {
		    	  Appno : "" ,
		      }
		});	
	},
	
	onSelectRow : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate2.ZUI5_HR_CertificateList");
		var oController = oView.getController();		
		var oTable = sap.ui.getCore().byId(oController.PAGEID+"_Table");
		var vContext = oEvent.getParameters().rowBindingContext;
		var oModel = oTable.getModel();
		if(vContext == undefined || oModel.getProperty(vContext.sPath)==null){
			return;
		}
		sap.ui.getCore().getEventBus().publish("nav", "to", {
    	  id : "ZUI5_HR_Certificate2.ZUI5_HR_CertificateDetail",
	      data : {
	    	  Appno : oModel.getProperty(vContext.sPath + "/Appno"),
	      }
		});	
		
	},

	onPressRow : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate2.ZUI5_HR_CertificateList");
		var oController = oView.getController();		
		
		var vAppno = oEvent.getSource().getCustomData()[0].getValue();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_Certificate2.ZUI5_HR_CertificateDetail",
		      data : {
		    	  Appno : vAppno,
		      }
		});	
	},

	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0055"),{	// 55:유효하지 않은 날짜형식입니다.
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	},
	
	// 리스트 조회
	onPressSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate2.ZUI5_HR_CertificateList");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHR_CERTY_SRV");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");

		// 테이블 sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var oJModel = new sap.ui.model.json.JSONModel();
		var oDatas = {Data : []};
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
		var oPath = "/CertipicateApplSet";
		var filterString = "/?$filter=Prcty eq 'L'" ;
		var SearchCond = oController._ListCondJSonModel.getProperty("/Data");
		
		if(common.Common.checkDate(SearchCond.Apbeg, SearchCond.Apend) == false){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1128")); 	// 1128:시작일자가 종료일자보다 큽니다.\n날짜를 확인하세요.
			return ;
		}
		
		
		if(SearchCond.Apbeg != ""){
			filterString = filterString + "%20and%20" + "Apbeg%20eq%20datetime%27" + dateFormat.format(new Date(SearchCond.Apbeg)) + "T00%3a00%3a00%27";
		}
		
		if(SearchCond.Apend != ""){
			filterString = filterString + "%20and%20" + "Apend%20eq%20datetime%27" + dateFormat.format(new Date(SearchCond.Apend)) + "T00%3a00%3a00%27";
		}
		
		if(SearchCond.Pernr != ""){
			filterString = filterString + "%20and%20" + "Pernr eq '" + SearchCond.Pernr + "'";
		}
		
		filterString = filterString + "%20and%20" + "Actty eq '" + _gAuth + "'";
		
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
		var oIconBar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR"); 
		var oIconFilter = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter");
		var oIconFilter1 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter1"); 
		var oIconFilter2 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter2"); 
		var oIconFilter3 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter3");
		var oIconFilter4 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter4"); 
		var oIconFilter5 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter5"); 
		function Search() {
			var Datas = {Data : []};
			oModel.read(oPath + filterString, 
			    null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							var OneData = data.results[i];
							OneData.Idx = i + 1;
							if(OneData.Cerno == "" || OneData.Cerno == "00000000") OneData.Cerno2 = "";
							else OneData.Cerno2 = OneData.Cerno.substring(0,4) + "-" + OneData.Cerno.substring(4,8);
							
							// 출력여부 X를 신청완료로 표시한다.
							if(OneData.Pntck == "X") OneData.Pntck = oBundleText.getText("LABEL_1298");	// 1298:출력완료
							
							var vZappStatAl = OneData.ZappStatAl; 
							if(vZappStatAl == "10"){
								OneData.ZappStatAl2 = "10"; // 작성중
								vReqCnt1++;
							}else if(vZappStatAl == "20"){
								OneData.ZappStatAl2 = "20"; // 신청중
								vReqCnt2++;
							}else if((vZappStatAl == "30" || vZappStatAl == "35" || vZappStatAl == "40" || vZappStatAl == "50")
									&& data.results[i].ZappDate == null ){
								OneData.ZappStatAl2 = "30"; // 진행중
								vReqCnt3++;
							}
							else if((vZappStatAl == "30" || vZappStatAl == "35" || vZappStatAl == "40" || vZappStatAl == "50")
									&& data.results[i].ZappDate != null ){
								OneData.ZappStatAl2 = "40"; // 승인
								vReqCnt4++;
							}
							else if(vZappStatAl == "31" || vZappStatAl == "36" || vZappStatAl == "45" || vZappStatAl == "55"){
								vReqCnt5++;
								OneData.ZappStatAl2 = "50"; // 반려
							}
							
							Datas.Data.push(OneData);
						}
					}
				},
				function(Res){
					if(Res.response.body){
						var ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						oController.Error = "E"; 
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						}else{
							oController.ErrorMessage =ErrorMessage ;
						}
					}
				}
			);
			
			oController._ListJSonModel.setData(Datas);
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			oTable.setVisibleRowCount(Datas.Data.length);
			if(oController.Error == "E"){
				oController.BusyDialog.close();
				oController.Error = "";
				sap.m.MessageBox.show(oController.ErrorMessage, {
				});
			}

			oIconBar.setSelectedKey("All");
			oIconFilter.setCount(Datas.Data.length);
			oIconFilter1.setCount(vReqCnt1);
			oIconFilter2.setCount(vReqCnt2);
			oIconFilter3.setCount(vReqCnt3);
			oIconFilter4.setCount(vReqCnt4);
			oIconFilter5.setCount(vReqCnt5);
			oTable.bindRows({path: "/Data"});
			
			oController.BusyDialog.close();
		}	
		oController.BusyDialog.open();
		setTimeout(Search, 100);
		
	},
	
	_AddPersonDialog : null ,
	
	EmpSearchByTx :function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate2.ZUI5_HR_CertificateList");
		var oController = oView.getController();
		var oControl = oEvent.getSource();
		var vEname = oControl.getValue();
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = {EmpSearchResultSet : []};
		common.SearchUser1.oController = oController;
		oController._vEnamefg = "";
		
		if(!vEname || vEname == ""){
			if(oController._ListCondJSonModel.getProperty("/Data")){
				var vControlId = common.Common.getControlId(oController, oControl.getId());
				if(vControlId.Id && vControlId.Id != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
				if(vControlId.Key && vControlId.Key != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
			}
			oController.onPressSearch();
		}else{
			oController._oControl = oControl;
			var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
			
			var filterString = "/?$filter=Persa eq '1000' and Actda eq datetime'" + vActda + "T00:00:00' and Ename eq '" + encodeURI(vEname) + "' and Stat1 eq '3'";
				filterString += " and Actty eq '" + _gAuth + "'";
			try{
				oCommonModel.read("/EmpSearchResultSet" + filterString, 
						null, 
						null, 
						false,
						function(oData, oResponse) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {	
									oData.results[i].Chck = false ;
									vEmpSearchResult.EmpSearchResultSet.push(oData.results[i]);
									
								}
							}
						},
						function(Res){
							if(Res.response.body){
								var ErrorMessage = Res.response.body;
								var ErrorJSON = JSON.parse(ErrorMessage);
								oController.Error = "E"; 
								if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
									oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
								}else{
									oController.ErrorMessage =ErrorMessage ;
								}
							}
						}
				);
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.alert(oController.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
					oEvent.getSource().setValue();
					return;
				}
			}catch(Ex){
				
			}
			
			if(vEmpSearchResult.EmpSearchResultSet.length == 1){
				var vControlId = common.Common.getControlId(oController, oControl.getId());
				if(vControlId.Id && vControlId.Id != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,vEmpSearchResult.EmpSearchResultSet[0].Ename);
				if(vControlId.Key && vControlId.Key != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,vEmpSearchResult.EmpSearchResultSet[0].Pernr);
				oController.onPressSearch();
			}else{
				oController._vEnamefg = "X";
				oController.displayEmpSearchDialog();
			}
		}
		
		
	},
	
	displayEmpSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate2.ZUI5_HR_CertificateList");
		var oController = oView.getController();
	
		if(oEvent){
			oController._oControl = oEvent.getSource();
			oController._vEnamefg = "";
		}
		
		//각 발령대상자의 발령일을 검색조건으로 설정한다.
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		if(oActda) oController._vActda = oActda.getValue();
		
		common.SearchUser1.oController = oController;
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		
		oController._AddPersonDialog.open();
		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate2.ZUI5_HR_CertificateList");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Multi";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "MultiInput";
		
		if(!oController._SerachOrgDialog) {
			oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SerachOrgDialog);
		}
		oController._SerachOrgDialog.open();
	},
	
	displayOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate2.ZUI5_HR_CertificateList");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Single";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "Input";
		common.SearchOrg.vNoPersa = true;
		
		if(!oController._SerachOrgDialog) {
			oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SerachOrgDialog);
		}
		oController._SerachOrgDialog.open();
	},
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate2.ZUI5_HR_CertificateList");
		var oController = oView.getController();
	
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
		var vActionSubjectList_Temp = {ActionSubjectListSet : []};
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"); 
		var vIDXs = oTable.getSelectedIndices();
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(vIDXs.length > 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는 한명만 선택이 가능합니다.
				return;
			}else if(vIDXs.length < 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}
			
			var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath;
			
			var vControlId = common.Common.getControlId(oController, oController._oControl.getId());
			if(vControlId.Id && vControlId.Id != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id, mEmpSearchResult.getProperty(_selPath + "/Ename"));
			if(vControlId.Key && vControlId.Key != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,mEmpSearchResult.getProperty(_selPath + "/Pernr"));
			
		}else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate2.ZUI5_HR_CertificateList");
		var oController = oView.getController();
		oController._ListCondJSonModel.setProperty("/Data/Pernr", "");
		oController._ListCondJSonModel.setProperty("/Data/Ename", "");
		oController._AddPersonDialog.close();
	},
	
	handleIconTabBarSelect : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate2.ZUI5_HR_CertificateList");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"); 
		
		var sKey = oEvent.getParameter("selectedKey");
		
		var oFilters = [];	
		if(sKey == "All"){ 
			oTable.bindRows({
			    path: "/Data"
			});
		}else{
			oFilters.push(new sap.ui.model.Filter("ZappStatAl2",sap.ui.model.FilterOperator.EQ,sKey));
			var combinedFilter = new sap.ui.model.Filter(oFilters);
			
			oTable.bindRows({

			    path: "/Data",

			    filters: combinedFilter

			});
		}
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate2.ZUI5_HR_CertificateList");
		var oController = oView.getController();
	},
	
	onPrintCert : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate2.ZUI5_HR_CertificateList");
		var oController = oView.getController();
		var vAppno = oEvent.getSource().getCustomData()[0].getValue();
		var vCerty = oEvent.getSource().getCustomData()[1].getValue();
		var vErrorMessage = "";
		if(vCerty && (vCerty == "B3" || vCerty == "B4")){ 
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1302"),{	// 1302:해당 증명서는 담당자에게 방문하여 출력바랍니다.
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title : oBundleText.getText("LABEL_0052")	// 52:안내
			});
		}else{
			var onProcess = function(){
				var vOData = {};
				vOData.Appno = vAppno;
				vOData.Certy = vCerty;
				vOData.Prcty = "Z";
				var oModel = sap.ui.getCore().getModel("ZHR_CERTY_SRV");
				var oPath = "/CertipicateApplSet";
				oModel.create(
						oPath,
						vOData,
						null,
						function(data,res){
							if(data) {
								if(data.Zurl != "" ) window.open(data.Zurl); 
							} 
						},
						function (oError) {
					    	var Err = {};
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								var msg1 = Err.error.innererror.errordetails;
								if(msg1 && msg1.length) vErrorMessage = Err.error.innererror.errordetails[0].message;
								else vErrorMessage = Err.error.message.value;
							} else {
								vErrorMessage = oError.toString();
							}
					}
				);
				
				oController.BusyDialog.close();
				if(vErrorMessage != ""){
					new control.ZNK_SapBusy.oErrorMessage(vErrorMessage);
					return ;
				}
				
				sap.m.MessageBox.show(vCompTxt, {
					title : oBundleText.getText("LABEL_0052"),	// 52:안내
					onClose : oController.onPressSearch
				});
			};
		
		var CreateProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		var vInfoTxt = "" , vCompTxt = "";
			vInfoTxt = oBundleText.getText("LABEL_0104");	// 104:출력하시겠습니까 ? \n 현재 프린트 설정이 컬러로 되어 있는지 확인하셨습니까 ?
			vCompTxt = oBundleText.getText("LABEL_0101") ;	// 101:인쇄가 완료되었습니다.
		
			sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
			
		}
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate2.ZUI5_HR_CertificateList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oJSONModel = oTable.getModel();
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
	
		var curDate = new Date();
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: oBundleText.getText("LABEL_1292") + "-" + dateFormat.format(curDate) + ".xlsx"	// 1292:제증명 신청
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
		
	},
});