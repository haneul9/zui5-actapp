//jQuery.sap.require("control.BusyIndicator");
//jQuery.sap.require("control.ZNKBusyAccessor");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("common.ZNK_TABLES");

sap.ui.controller("ZUI5_HR_LoanList.ZUI5_HR_LoanList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_LoanList.ZUI5_HR_LoanList
	 */

	PAGEID : "ZUI5_HR_LoanList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_OrgehJSONModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vClsdt : "",
	_vPayym : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	
	_vAppno : "",
	
	_vEnamefg : "",
	_oControl : null,
	
	_vIdx : null,	// 선택된 대출내역 No.
	
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
		
		var oController = this ;
		
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		
		if(vEmpLoginInfo.length == 0){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2470"), {title : oBundleText.getText("LABEL_0053")});	// 2470:로그인 정보가 없습니다.
			return; 
		}
				
		var JSonData = {
				Data : {
					Auth : _gAuth,
					Ename : vEmpLoginInfo[0].Ename,
					Pernr : vEmpLoginInfo[0].Pernr,
					Perid : vEmpLoginInfo[0].Perid,
					Orgtx : vEmpLoginInfo[0].Stext,
					Orgeh : vEmpLoginInfo[0].Orgeh,
					Zzjikgbt : vEmpLoginInfo[0].Zzjikgbt,
					Zzjiktlt : vEmpLoginInfo[0].Zzjiktlt,
				}
		};
		oController._ListCondJSonModel.setData(JSonData);
		
		oController.onPressSearch();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	// 대출내역 조회
	onPressSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LoanList.ZUI5_HR_LoanList");
		var oController = oView.getController();
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		var oneData = oController._ListCondJSonModel.getProperty("/Data");
		
		if(!oneData.Pernr){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}

		var oModel = sap.ui.getCore().getModel("ZHR_LOAN_SRV");
		
		function Search(){
			oController._vIdx = 0;
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
//				oTable.setVisibleRowCount(1);
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			oJSONModel.setData(vData);
			
			var oPath = "/LoanListSet?$filter=Pernr eq '" + oneData.Pernr + "'";
			
			oModel.read(oPath, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							var oneData = data.results[i];
							oneData.Idx = i+1;
							
							oneData.Lnamt = parseFloat(oneData.Lnamt) == 0 ? "" : parseFloat(oneData.Lnamt);			// 대출금액
							oneData.RpamtPay = parseFloat(oneData.RpamtPay) == 0 ? "" : parseFloat(oneData.RpamtPay);	// 급여상환액
							oneData.RpamtMpr = parseFloat(oneData.RpamtMpr) == 0 ? "" : parseFloat(oneData.RpamtMpr);	// 중도상환액
							oneData.Blamt = parseFloat(oneData.Blamt) == 0 ? "0" : parseFloat(oneData.Blamt);			// 잔액
							oneData.RpamtMon = parseFloat(oneData.RpamtMon) == 0 ? "" : parseFloat(oneData.RpamtMon);	// 월상환액
							oneData.RpamtLst = parseFloat(oneData.RpamtLst) == 0 ? "" : parseFloat(oneData.RpamtLst);	// 최종월상환액
							
							vData.Data.push(data.results[i]);
						}
						
						if(data.results.length > 10) oTable.setVisibleRowCount(10);
						else oTable.setVisibleRowCount(data.results.length);
						
					}
				}, function(Res){
					if(Res.response.body){
						var ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						oController.Error = "E"; 
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						}else{
							oController.ErrorMessage = ErrorMessage ;
						}
					}
				}
			);
			
			if(oController.Error == "E"){
				oController.BusyDialog.close();
				oController.Error = "";
				sap.m.MessageBox.show(oController.ErrorMessage);
			}
						
			if(vData.Data.length != 0){
				oJSONModel.setProperty("/Data/0/Check", true);
				oController._vIdx = 1;
			}
			oTable.setVisibleRowCount(vData.Data.length);
			
			// 상환내역 리스트
			oController.onPressList1();

			oController.BusyDialog.close();			
		}
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);				
	},

	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LoanList.ZUI5_HR_LoanList");
		var oController = oView.getController();

	},
	
	onSelectRadioButton : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LoanList.ZUI5_HR_LoanList");
		var oController = oView.getController();

		if(oEvent.getParameters().selected == true){			
			oController._vIdx = oEvent.getSource().getCustomData()[0].getValue();
			
			var oList1 = sap.ui.getCore().byId(oController.PAGEID + "_List1");
			if(oList1)
				oController.onPressList1();
			else
				oController.onPressList2();
		}
		
	},
	
	// 상환내역
	onPressList1 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LoanList.ZUI5_HR_LoanList");
		var oController = oView.getController();
		
		var oPanel = sap.ui.getCore().byId(oController.PAGEID + "_DetailPanel");
		oPanel.destroyContent();
		
		oPanel.addContent(sap.ui.jsfragment("ZUI5_HR_LoanList.fragment.List1",oController));
		
		var oList1 = sap.ui.getCore().byId(oController.PAGEID + "_List1");
		var oListJSONModel = oList1.getModel();
		var vData = {Data : []};
		
		// sort, filter 제거
		var oColumns = oList1.getColumns();
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		if(oController._vIdx != 0){
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
			var oJSONModel = oTable.getModel();
			var oneData = oJSONModel.getProperty("/Data/" + (oController._vIdx - 1));
			console.log(oneData);
			
			var oModel = sap.ui.getCore().getModel("ZHR_LOAN_SRV");
			var oPath = "/LoanDedListSet?$filter=Pernr eq '" + oneData.Pernr + "' and Lonid eq '" + oneData.Lonid + "'";
			
			oModel.read(oPath, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							data.results[i].Idx = i+1;
							
							var oneData = data.results[i];
							oneData.Rpprn = parseInt(oneData.Rpprn) == 0 ? "" : oneData.Rpprn;	// 상환원금
							oneData.Rpint = parseInt(oneData.Rpint) == 0 ? "" : oneData.Rpint;	// 상환이자
							
							vData.Data.push(data.results[i]);
						}
					}
				}, function(Res){
					if(Res.response.body){
						var ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						oController.Error = "E"; 
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						}else{
							oController.ErrorMessage = ErrorMessage ;
						}
					}
				}
			);
			
			if(oController.Error == "E"){
				oController.BusyDialog.close();
				oController.Error = "";
				sap.m.MessageBox.alert(oController.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
			}
		}
		
		oListJSONModel.setData(vData);
		oList1.bindRows("/Data");
		
		if(vData.Data.length > 10) 
			oList1.setVisibleRowCount(10);
		else 
			oList1.setVisibleRowCount(vData.Data.length);
	},
	
	// 상세내역
	onPressList2 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LoanList.ZUI5_HR_LoanList");
		var oController = oView.getController();
		
//		window.open("/sap/bc/ui5_ui5/sap/zui5_hr_essapp/SawooLoanList.html?_gAuth=H", "new", "width=1600,height=1000");
		
		var oPanel = sap.ui.getCore().byId(oController.PAGEID + "_DetailPanel");
		oPanel.destroyContent();
		
		oPanel.addContent(sap.ui.jsfragment("ZUI5_HR_LoanList.fragment.List2",oController));
		
		var oList2 = sap.ui.getCore().byId(oController.PAGEID + "_List2");
		var oListJSONModel = oList2.getModel();
		var vData = {Data : []};

		// sort, filter 제거
		var oColumns = oList2.getColumns();
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		if(oController._vIdx != 0){
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
			var oJSONModel = oTable.getModel();
			var oneData = oJSONModel.getProperty("/Data/" + (oController._vIdx - 1));
			console.log(oneData);
			
			vData.Data.push(oneData);
		}
		
		oListJSONModel.setData(vData);
		oList2.bindRows("/Data");
	},
	
	_AddPersonDialog : null ,
	
	EmpSearchByTx :function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LoanList.ZUI5_HR_LoanList");
		var oController = oView.getController();
		var oControl = oEvent.getSource();
		var vEname = oControl.getValue();
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = {EmpSearchResultSet : []};
		common.SearchUser1.oController = oController;
		oController._vEnamefg = "";
	
		oController._oControl = oControl;
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var oFilters = [];
		vActda = dateFormat.format(curDate);
		
//		if(_gAuth != "H"){
//			oFilters.push(new sap.ui.model.Filter('Persa', sap.ui.model.FilterOperator.EQ, oController._vPersa));
//		}
		oFilters.push(new sap.ui.model.Filter('Actda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(curDate)));
		oFilters.push(new sap.ui.model.Filter('Ename', sap.ui.model.FilterOperator.EQ, vEname));
		oFilters.push(new sap.ui.model.Filter('Stat1', sap.ui.model.FilterOperator.EQ, '3'));
		oFilters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth));
		if(gReqAuth) oFilters.push(new sap.ui.model.Filter('ReqAuth', sap.ui.model.FilterOperator.EQ, gReqAuth));
		
		try {
			oCommonModel.read("/EmpSearchResultSet", {
				async: false,
				filters: oFilters,
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
				sap.m.MessageBox.alert(oController.ErrorMessage, {title : "오류"});
				oEvent.getSource().setValue();
				return;
			}	
		}catch(Ex){
			
		}
		
		if(vEmpSearchResult.EmpSearchResultSet.length == 1){
			oController._ListCondJSonModel.setProperty("/Data/Ename", vEmpSearchResult.EmpSearchResultSet[0].Ename);
			oController._ListCondJSonModel.setProperty("/Data/Pernr", vEmpSearchResult.EmpSearchResultSet[0].Pernr);
			oController._ListCondJSonModel.setProperty("/Data/Perid", vEmpSearchResult.EmpSearchResultSet[0].Perid);
			oController._ListCondJSonModel.setProperty("/Data/Orgtx", vEmpSearchResult.EmpSearchResultSet[0].Zzorgtx);
			oController._ListCondJSonModel.setProperty("/Data/Orgeh", vEmpSearchResult.EmpSearchResultSet[0].Zzorgid);
			oController._ListCondJSonModel.setProperty("/Data/Zzjikgbt", vEmpSearchResult.EmpSearchResultSet[0].Zzjikgbt);
			oController._ListCondJSonModel.setProperty("/Data/Zzjiktlt", vEmpSearchResult.EmpSearchResultSet[0].Zzjiktlt);
			
			oController.onPressSearch();
		}else{
			oController._vEnamefg = "X";
			oController.displayEmpSearchDialog();
		}
	},
	
	displayEmpSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LoanList.ZUI5_HR_LoanList");
		var oController = oView.getController();
		if(oEvent){
			oController._oControl = oEvent.getSource();
			oController._vEnamefg = "";
		}
		//각 발령대상자의 발령일을 검색조건으로 설정한다.
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		if(oActda) oController._vActda = oActda.getValue();
		
		common.SearchUser1.oController = oController;
		common.SearchUser1.fPersaEnabled = false;
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		
		oController._AddPersonDialog.open();
		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_LoanList.ZUI5_HR_LoanList");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_LoanList.ZUI5_HR_LoanList");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_LoanList.ZUI5_HR_LoanList");
		var oController = oView.getController();
	
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
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

			oController._ListCondJSonModel.setProperty("/Data/Ename", mEmpSearchResult.getProperty(_selPath + "/Ename"));
			oController._ListCondJSonModel.setProperty("/Data/Pernr", mEmpSearchResult.getProperty(_selPath + "/Pernr"));
			oController._ListCondJSonModel.setProperty("/Data/Perid", mEmpSearchResult.getProperty(_selPath + "/Perid"));
			oController._ListCondJSonModel.setProperty("/Data/Orgtx", mEmpSearchResult.getProperty(_selPath + "/Zzorgtx"));
			oController._ListCondJSonModel.setProperty("/Data/Orgeh", mEmpSearchResult.getProperty(_selPath + "/Zzorgid"));
			oController._ListCondJSonModel.setProperty("/Data/Zzjikgbt", mEmpSearchResult.getProperty(_selPath + "/Zzjikgbt"));
			oController._ListCondJSonModel.setProperty("/Data/Zzjiktlt", mEmpSearchResult.getProperty(_selPath + "/Zzjiktlt"));
				
			oController.onPressSearch();
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LoanList.ZUI5_HR_LoanList");
		var oController = oView.getController();

		oController._AddPersonDialog.close();
	},
	
	
});