jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");

sap.ui.controller("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureList
	 */

	PAGEID : "ZUI5_HR_ExpenditureList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vClsdt : "",
	_vPayym : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	
	_vAppno : "",
	_vZworktyp : "HR03",
	_IconTabBarJSonModel : new sap.ui.model.json.JSONModel(),
	
	_vEnamefg : "",
	_oControl : null,
	
	onInit : function() {

		//if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		//};

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

	onBeforeShow : function(oEvent) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth()-1 , curDate.getDate()+1);
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		var vEname = "";
		var vPernr = "";
		var vEncid = "";
		var oController = this ;
		if(!oController._ListCondJSonModel.getProperty("/Data")){
			if(vEmpLoginInfo.length > 0){
				var OneData = {};
				
				if(_gAuth == "E"){
					// 대상자
					vEname = vEmpLoginInfo[0].Ename ;
					vPernr = vEmpLoginInfo[0].Pernr ;
					vEncid = vEmpLoginInfo[0].Encid ;
				}
			}
			var JSonData = {Data : {Apbeg : dateFormat.format(prevDate), Apend : dateFormat.format(curDate), 
				                    Pernr : vPernr, Ename : vEname, 
				                    Encid : vEncid, Auth : _gAuth}};
			oController._ListCondJSonModel.setData(JSonData);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
		
		oController._IconTabBarJSonModel.setData({
			Data : { click0 : "Y", click1 : "N", click2 : "N", click3 : "N", click4 : "N", click5 : "N" ,
				     CountAll : 0 , Count1 : 0 , Count2 : 0, Count3 : 0 , Count4 : 0,  Count5 : 0
			}
		});
		
		// 테이블 sort, filter 제거
		var oColumns = sap.ui.getCore().byId(oController.PAGEID + "_Table").getColumns();
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
		this.onPressSearch();		
	},
	
	onInitControl : function(oController, _vZappStatAl ){

	},
	
	onPressRegCheck : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureList");
		var oController = oView.getController();
		if(!oController._RegnoCheckDialog) {
			oController._RegnoCheckDialog = sap.ui.jsfragment("fragment.RegnoCheck", oController);
			oView.addDependent(oController._RegnoCheckDialog);
		}
		oController._RegnoCheckDialog.open();
	},
	
	// 신규신청 로직
	onPressNew : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureList");
		var oController = oView.getController();
		oController._RegnoCheckDialog.close();
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail",
		      data : {Appno : ""}
		});	
		
	},
	
	onSelectRow : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureList");
		var oController = oView.getController();		
		var oTable = sap.ui.getCore().byId(oController.PAGEID+"_Table");
		var vContext = oEvent.getParameters().rowBindingContext;
		var oModel = oTable.getModel();
		if(vContext == undefined || oModel.getProperty(vContext.sPath)==null){
			return;
		}
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail",
		      data : {Appno : oModel.getProperty(vContext.sPath + "/Appno")}}
		);	
	},

	onPressRow : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureList");
		var oController = oView.getController();		
		
		var vAppno = oEvent.getSource().getCustomData()[0].getValue();
				
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail",
		      data : {Appno : vAppno} 
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		
		// 테이블 sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var Datas = {Data : []};
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		var SerchCond = oController._ListCondJSonModel.getProperty("/Data");

		var oModel = sap.ui.getCore().getModel("ZHR_CONTY_SRV");
		
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
		var oIconBar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
		var oIconFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter");
		var oIconFilter1 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter1");
		var oIconFilter2 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter2");
		var oIconFilter3 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter3");
		var oIconFilter4 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter4");
		var oIconFilter5 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter5");
		
		function Search(){
			var iconData = oController._IconTabBarJSonModel.getData();
			var oPath = "/ExpensesApplSet";
			var filterString = "";
				
			if(SerchCond.Apbeg != "" && SerchCond.Apend != ""){
				if(common.Common.checkDate(SerchCond.Apbeg, SerchCond.Apend) == false){
					return ;
				}
			}			

			if(SerchCond.Apbeg != ""){
				if(filterString == ""){
					filterString = "/?$filter=Apbeg%20eq%20datetime%27" + dateFormat.format(new Date(SerchCond.Apbeg)) + "T00%3a00%3a00%27";	
				} else {
					filterString = filterString + " and " + "Apbeg%20eq%20datetime%27" + dateFormat.format(new Date(SerchCond.Apbeg)) + "T00%3a00%3a00%27";
				}
			}
			
			if(SerchCond.Apend != ""){
				if(filterString == ""){
					filterString = "/?$filter=Apend%20eq%20datetime%27" + dateFormat.format(new Date(SerchCond.Apend)) + "T00%3a00%3a00%27";	
				} else {
					filterString = filterString + " and " + "Apend%20eq%20datetime%27" + dateFormat.format(new Date(SerchCond.Apend)) + "T00%3a00%3a00%27";
				}
			}
			
			if(SerchCond.Encid != ""){
				if(filterString == ""){
					filterString = "/?$filter=Encid eq '" + encodeURIComponent(SerchCond.Encid)  + "'";	
				} else {
					filterString = filterString + " and " + "Encid eq '" + encodeURIComponent(SerchCond.Encid) + "'";
				}
			}
			
			if(filterString == ""){
				filterString = "/?$filter=Prcty eq 'L'";	
			} else {
				filterString = filterString + " and Prcty eq 'L'";
			}
					
			if(filterString == ""){
				filterString = "/?$filter=Actty eq '"+ _gAuth + "'";	
			} else {
				filterString = filterString + " and Actty eq '"+ _gAuth + "'";	
			}
					
			oModel.read(oPath + filterString, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							data.results[i].Idx = i+1;
							var OneData = data.results[i];
							
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
							// ESS 인 경우 대상자와 신청자가 동일해야만 경조금액을 보여지게 한다.
							OneData.ZpayBet = _gAuth == "E" && !common.Common.checkNull(OneData.Pernr) && 
							                 !common.Common.checkNull(OneData.Appernr) && OneData.Appernr == OneData.Pernr ?
							                 common.Common.numberWithCommas(OneData.ZpayBet) : "" ;
							
							// 담당자 의견 
							OneData.ZListComment = "";
							if(OneData.Symptn && OneData.Symptn != ""){
								OneData.ZListComment = oBundleText.getText("LABEL_1086") + " : " + OneData.Symptn ;	// 1086:담당자 의견
							}
							if(OneData.ZappResn && OneData.ZappResn != ""){
								if(OneData.ZListComment != "") OneData.ZListComment += "\n  ";
								OneData.ZListComment += oBundleText.getText("LABEL_1192") + " : " + OneData.ZappResn;	// 1192:반려 사유
							}
							Datas.Data.push(OneData);
						}
					}
				}, function(Res){
					if(Res.response){
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
			
			// listdate 필드 convert => 필드id+"Txt" string 필드로
			common.Common.convertDateField(Datas);
			
			oController._ListJSonModel.setData(Datas);
			oTable.setVisibleRowCount(Datas.Data.length > 15 ? 15 : Datas.Data.length);
			
			iconData.Data.Count1 = vReqCnt1;
			iconData.Data.Count2 = vReqCnt2;
			iconData.Data.Count3 = vReqCnt3;
			iconData.Data.Count4 = vReqCnt4;
			iconData.Data.Count5 = vReqCnt5;
			iconData.Data.CountAll = Datas.Data.length;
			oController._IconTabBarJSonModel.setData(iconData);
			
			if(oController.Error == "E"){
				oController.BusyDialog.close();
				oController.Error = "";
				sap.m.MessageBox.show(oController.ErrorMessage);
			}
			
			oTable.bindRows("/Data");
			
			oController.BusyDialog.close();			
		}
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);				
	},
	
	_AddPersonDialog : null ,
	
	EmpSearchByTx :function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportList"),
			oController = oView.getController(),
			oControl = oEvent.getSource(),
			vEname = oControl.getValue(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = {EmpSearchResultSet : []};
		
		common.SearchUserList.oController = oController;
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
			var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV"),
				curDate = new Date(),
				oFilters = [];
			
//			if(_gAuth != "H"){
//				oFilters.push(new sap.ui.model.Filter('Persa', sap.ui.model.FilterOperator.EQ, oController._vPersa));
//			}
			oFilters.push(new sap.ui.model.Filter('Actda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(curDate)));
			oFilters.push(new sap.ui.model.Filter('Ename', sap.ui.model.FilterOperator.EQ, vEname));
			oFilters.push(new sap.ui.model.Filter('Stat1', sap.ui.model.FilterOperator.EQ, '3'));
			oFilters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth));
			if(gReqAuth) oFilters.push(new sap.ui.model.Filter('ReqAuth', sap.ui.model.FilterOperator.EQ, gReqAuth));
		
			try {
				oCommonModel.read("/EmpSearchResultSet", {
					async: false,
					filters: [
						oFilters
					],
					success: function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {	
								oData.results[i].Chck = false ;
								vEmpSearchResult.EmpSearchResultSet.push(oData.results[i]);
								
							}
						}
					},
					error: function(Res) {
						var errData = common.Common.parseError(Res);
						oController.Error = errData.Error;
						oController.ErrorMessage = errData.ErrorMessage;
					}
				});
				
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureList");
		var oController = oView.getController();
		if(oEvent){
			oController._oControl = "";
			oController._vEnamefg = "";
		}
		//각 발령대상자의 발령일을 검색조건으로 설정한다.
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		if(oActda) oController._vActda = oActda.getValue();
		
		common.SearchUserList.oController = oController;
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearchList", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		
		oController._AddPersonDialog.open();
		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureList");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Multi";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "MultiInput";
		
		if(!oController._SearchOrgDialog) {
			oController._SearchOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SearchOrgDialog);
		}
		
		oController._SearchOrgDialog.open();
	},
	
	displayOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureList");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Single";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "Input";
		common.SearchOrg.vNoPersa = true;
		
		if(!oController._SearchOrgDialog) {
			oController._SearchOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SearchOrgDialog);
		}
		oController._SearchOrgDialog.open();
	},
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureList");
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
			oController._ListCondJSonModel.setProperty("/Data/Encid", mEmpSearchResult.getProperty(_selPath + "/Encid"));
			oController._ListCondJSonModel.setProperty("/Data/Pernr", mEmpSearchResult.getProperty(_selPath + "/Pernr"));
			oController._ListCondJSonModel.setProperty("/Data/Ename", mEmpSearchResult.getProperty(_selPath + "/Ename"));
			
			oController.onPressSearch();
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureList");
		var oController = oView.getController();
		oController._ListCondJSonModel.setProperty("/Data/Encid", "");
		oController._ListCondJSonModel.setProperty("/Data/Pernr", "");
		oController._ListCondJSonModel.setProperty("/Data/Ename", "");
		oController._AddPersonDialog.close();
	},
	
	handleIconTabBarSelect : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureList");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"); 
		
		var sKey = oEvent.getParameter("selectedKey");
		
		var oFilters = [];	
		if(sKey == "All"){ 
			oTable.bindRows({
			    path: "/Data"
			});
		} else {
			oFilters.push(new sap.ui.model.Filter("ZappStatAl2",sap.ui.model.FilterOperator.EQ,sKey));
			var combinedFilter = new sap.ui.model.Filter(oFilters);
			
			oTable.bindRows({

			    path: "/Data",

			    filters: combinedFilter

			});
		}
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureList");
		var oController = oView.getController();
	},
	
	convertDate : function(vStartDate){
		if(vStartDate) {
	        var arrDate1 = vStartDate.split(".");
	        var getDate1 = new Date(parseInt(arrDate1[0]),parseInt(arrDate1[1])-1,parseInt(arrDate1[2]));
	        return getDate1.getTime();
	    }
	},
	
	convertDate2 : function(vDate){
		if(vDate) {
	        var arrDate1 = vDate.split(" ");
	        var arrDate = arrDate1[0].split(".");
	        var arrTime = arrDate1[1].split(":");
	        
	        var setDate = new Date(arrDate[0],arrDate[1]-1,arrDate[2], arrTime[0],arrTime[1],arrTime[2], 0);
	        return setDate.getTime();
	    }
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oJSONModel = oTable.getModel();
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
	
		var curDate = new Date();
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: oBundleText.getText("LABEL_1180") + "-" + dateFormat.format(curDate) + ".xlsx"	// 1180:경조금 신청
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
		
	},

});