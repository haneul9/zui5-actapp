jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_DeviceCertTime.ZUI5_HR_DeviceCertTimeList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_DeviceCertTime.ZUI5_HR_DeviceCertTimeList
	 */

	PAGEID : "ZUI5_HR_DeviceCertTimeList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_Columns : "",
	_vPersa : "" ,
	_vClsdt : "",
	_vZpayym : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	_vZworktyp : 'HR41',
	_oControl  : null,
	_vEnamefg : "",
	_InitControl : "",
	
	onInit : function() {

		this.getView()
			.addEventDelegate({
				onBeforeShow : jQuery.proxy(function(evt) {
					this.onBeforeShow(evt);
				}, this),
				onAfterShow : jQuery.proxy(function(evt) {
					this.onAfterShow(evt);
				}, this)
			})
			.addStyleClass("sapUiSizeCompact");
		
		sap.ui.getCore().getEventBus()
			.subscribe("app", "OpenWindow", this.SmartSizing, this)
			.subscribe("app", "ResizeWindow", this.SmartSizing, this);
	},

	onBeforeShow : function(oEvent) {
		var oController = this,
			curDate = new Date(),
			prevDate = new Date(curDate.getFullYear(), curDate.getMonth() , 1),
			mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo"),
			vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
			vEname = "",
			vEncid = "",
			vPersa = "";
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1) {			
			if(_gAuth == "E" && vEmpLoginInfo.length > 0) {
				vEname = vEmpLoginInfo[0].Ename ;
				vEncid = vEmpLoginInfo[0].Encid ;
			}
			vPersa = vEmpLoginInfo[0].Persa;
			
			var JSonData = { Data : { Cbegda : dateFormat.format(prevDate) , Cendda : dateFormat.format(curDate), Encid : vEncid, Ename : vEname, Corgeh : "", Corgtx : "", Cwerks : vPersa }};
			oController._ListCondJSonModel.setData(JSonData);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
		
//		this.onPressSearch();
		this._ListJSonModel.setData({Data : []});
		sap.ui.getCore().byId(this.PAGEID + "_Table")
			.setVisibleRowCount(1)
			.bindRows({ path: "/Data" });
	},
	
	onBack : function(oEvent){
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
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeviceCertTime.ZUI5_HR_DeviceCertTimeList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_TIME_RECORDER_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oExcSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_ExcSave"),
			oColumns = oTable.getColumns(),
			aFilters = [],
			begDate = null,
			endDate = null,
			SerchCond = oController._ListCondJSonModel.getProperty("/Data");

		// 테이블 sort, filter 제거
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		if(SerchCond.Cbegda != "" && SerchCond.Cendda != "") {
			if(common.Common.checkDate(SerchCond.Cbegda, SerchCond.Cendda) == false) {
				return ;
			}
		}
		
		if(_gAuth != "E") {
			if(!SerchCond.Cwerks || SerchCond.Cwerks == "") {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2497"), {});	// 2497:사업장을 선택하여 주십시오.
				return;
			}
			
			if((!SerchCond.Corgeh || SerchCond.Corgeh == "") && (!SerchCond.Pernr || SerchCond.Pernr == "")) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2936"), {});	// 2936:부서나 대상자를 입력하세요.
				return;
			}
		}
		
		if(SerchCond.Cbegda != "") {
			aFilters.push(new sap.ui.model.Filter('Cbegda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Cbegda").getDateValue())));
		}
		if(SerchCond.Cendda != "") {
			aFilters.push(new sap.ui.model.Filter('Cendda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Cendda").getDateValue())));
		}
		if(SerchCond.Cwerks != "") {
			aFilters.push(new sap.ui.model.Filter('Cwerks', sap.ui.model.FilterOperator.EQ, SerchCond.Cwerks));
		}
		if(SerchCond.Corgeh != "") {
			aFilters.push(new sap.ui.model.Filter('Corgeh', sap.ui.model.FilterOperator.EQ, SerchCond.Corgeh));
		}
		if(SerchCond.Encid != "") {
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, SerchCond.Encid));
		}
		
		function Search() {
			var Datas = {Data : []},
				OneData = {},
				vIdx = 1;
			
			oExcSaveBtn.setVisible(false);
			
			oModel.read("/TimeRecorderDataSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0;i<data.results.length;i++) {
							OneData = data.results[i];
							
							OneData.Idx = vIdx++;
							OneData.Intim01 = common.Common.timeToString(OneData.Intim01, "HH:mm");
							OneData.Outim01 = common.Common.timeToString(OneData.Outim01, "HH:mm");
							OneData.Intim02 = common.Common.timeToString(OneData.Intim02, "HH:mm");
							OneData.Outim02 = common.Common.timeToString(OneData.Outim02, "HH:mm");
							OneData.Intim03 = common.Common.timeToString(OneData.Intim03, "HH:mm");
							OneData.Outim03 = common.Common.timeToString(OneData.Outim03, "HH:mm");
							OneData.Intim04 = common.Common.timeToString(OneData.Intim04, "HH:mm");
							OneData.Outim04 = common.Common.timeToString(OneData.Outim04, "HH:mm");
							OneData.Intim05 = common.Common.timeToString(OneData.Intim05, "HH:mm");
							OneData.Outim05 = common.Common.timeToString(OneData.Outim05, "HH:mm");
							
							Datas.Data.push(OneData);
						}
					}
				},
				error: function(Res) {
					var errData = common.Common.parseError(Res);
					oController.Error = errData.Error;
					oController.ErrorMessage = errData.ErrorMessage;
				}
			});
			
			// listdate 필드 convert => 필드id+"Txt" string 필드로
			common.Common.convertDateField(Datas);
			
			oController._ListJSonModel.setData(Datas);
			
			tableSize = (Datas.Data.length > 15) ? 15 : Datas.Data.length;
			oTable.setVisibleRowCount(tableSize);
			
			if(_gAuth != "E" && tableSize > 0) oExcSaveBtn.setVisible(true);
			
			if(oController.Error == "E") {
				oController.BusyDialog.close();
				oController.Error = "";
				sap.m.MessageBox.show(oController.ErrorMessage, {});
			}

			oTable.bindRows({ path: "/Data" });
			
			oController.BusyDialog.close();
		}	
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);
	},
	
	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeviceCertTime.ZUI5_HR_DeviceCertTimeList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_TIME_RECORDER_SRV"),
			vTableDatas = oController._ListJSonModel.getData().Data,
			createData = {DetailNav : []},
			sData = {},
			errData = {};
		
		if(vTableDatas && vTableDatas.length) {
			vTableDatas.forEach(function(elem) {
				sData = {};
				sData.Perid = elem.Perid;
				sData.Pernr = elem.Pernr;
				sData.Datum = "\/Date(" + common.Common.getTime(elem.Datum) +")\/";
				sData.Excep = elem.Excep;
				
				createData.DetailNav.push(sData);
			});
			
			oModel.create("/TimeRecorderDataSet", createData, {
				async : false,
				success : function(data, res) {
					sap.m.MessageBox.show(oBundleText.getText("LABEL_0572"), { title : oBundleText.getText("LABEL_0052") });	// 52:안내, 572:저장하였습니다.
				},
				error : function (Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == "E") {
				sap.m.MessageBox.alert(errData.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				return;
			}
			
			// refresh
			oController.onPressSearch();
		}
	},
	
	displayOrgehSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeviceCertTime.ZUI5_HR_DeviceCertTimeList"),
			oController = oView.getController();
		
		oController.vCallControlId = oEvent.getSource().getId();
		oController.vCallControlType = oEvent.getSource().getCustomData()[0].getValue();
		
		if(!oController._SerachOrgDialogInView) {
			oController._SerachOrgDialogInView = sap.ui.jsfragment("ZUI5_HR_DeviceCertTime.fragment.OrgSearch", oController);
			oView.addDependent(oController._SerachOrgDialogInView);
		}
		oController._SerachOrgDialogInView.open();
	},
	
	_AddPersonDialog : null,
	
	EmpSearchByTx :function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeviceCertTime.ZUI5_HR_DeviceCertTimeList"),
			oController = oView.getController(),
			oControl = oEvent.getSource(),
			vEname = oControl.getValue(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = {EmpSearchResultSet : []},
			oFilters = [];
		
		common.SearchUserList.oController = oController;
		oController._vEnamefg = "";
		
		if(!vEname || vEname == "") {
			if(oController._ListCondJSonModel.getProperty("/Data")) {
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
				curDate = new Date();
			
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
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,vEmpSearchResult.EmpSearchResultSet[0].Encid);
				oController.onPressSearch();
			}else{
				oController._vEnamefg = "X";
				oController.displayEmpSearchDialog();
			}
		}
		
		
	},
	
	displayEmpSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeviceCertTime.ZUI5_HR_DeviceCertTimeList"),
			oController = oView.getController();
		
		if(oEvent){
			oController._oControl = oEvent.getSource();
			oController._vEnamefg = "";
		}
		
		//각 발령대상자의 발령일을 검색조건으로 설정한다.
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		if(oActda) oController._vActda = oActda.getValue();
		
		common.SearchUserList.oController = oController;
		common.SearchUserList.fPersaEnabled = false;
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearchList", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		
		oController._AddPersonDialog.open();
		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		jQuery.sap.require("common.SearchOrg");

		var oView = sap.ui.getCore().byId("ZUI5_HR_DeviceCertTime.ZUI5_HR_DeviceCertTimeList"),
			oController = oView.getController();
		
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
		jQuery.sap.require("common.SearchOrg");

		var oView = sap.ui.getCore().byId("ZUI5_HR_DeviceCertTime.ZUI5_HR_DeviceCertTimeList"),
			oController = oView.getController();
		
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeviceCertTime.ZUI5_HR_DeviceCertTimeList"),
			oController = oView.getController(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet"),
			mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp"),
			vActionSubjectList_Temp = {ActionSubjectListSet : []},
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"), 
			vIDXs = oTable.getSelectedIndices();
		
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(vIDXs.length > 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는 한명만 선택이 가능합니다.
				return;
			}else if(vIDXs.length < 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}
			
			var vControlId = common.Common.getControlId(oController, oController._oControl.getId()),
				_selPath = oTable.getContextByIndex(vIDXs[0]).sPath;
			
			if(vControlId.Id && vControlId.Id != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id, mEmpSearchResult.getProperty(_selPath + "/Ename"));
			if(vControlId.Key && vControlId.Key != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,mEmpSearchResult.getProperty(_selPath + "/Encid"));
		
		}else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeviceCertTime.ZUI5_HR_DeviceCertTimeList"),
			oController = oView.getController(),
			vControlId = common.Common.getControlId(oController, oController._oControl.getId());
		
		if(vControlId.Id && vControlId.Id != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
		if(vControlId.Key && vControlId.Key != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
		
		oController._AddPersonDialog.close();
	},
	
	SmartSizing : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_DeviceCertTime.ZUI5_HR_DeviceCertTimeList"),
//			oController = oView.getController();
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeviceCertTime.ZUI5_HR_DeviceCertTimeList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oJSONModelData = oTable.getModel().getProperty("/Data"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"}),
			curDate = new Date();
		
		if(oJSONModelData.length < 1) return;
		
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModelData,
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
				fileName: oBundleText.getText("LABEL_0571") + "-" + dateFormat.format(curDate) + ".xlsx"	// 571:단말기 인증시간 조회
		};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	}
});