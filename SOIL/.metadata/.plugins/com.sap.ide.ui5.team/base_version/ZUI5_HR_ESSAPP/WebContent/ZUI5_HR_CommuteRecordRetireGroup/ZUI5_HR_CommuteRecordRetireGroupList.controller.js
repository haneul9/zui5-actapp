jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_CommuteRecordRetireGroup.ZUI5_HR_CommuteRecordRetireGroupList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_CommuteRecordRetireGroup.ZUI5_HR_CommuteRecordRetireGroupList
	 */

	PAGEID : "ZUI5_HR_CommuteRecordRetireGroupList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_ListDetailJSonModel : new sap.ui.model.json.JSONModel(),
	_Columns : "",
	_Columns2 : "",
	_vPersa : "" ,
	_vPernr : "" ,
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
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo"),
			vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet"),
			vEname = "",
			vEncid = "";
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1) {			
			if(vEmpLoginInfo.length > 0) {
				vEname = vEmpLoginInfo[0].Ename ;
				vEncid = vEmpLoginInfo[0].Encid ;
				
				oController._vPernr = vEmpLoginInfo[0].Pernr;
			}
			
			var JSonData = { Data : { Tsmon : dateFormat.format(curDate), Encid : vEncid, Ename : vEname, Finyn : "ALL" }};
			oController._ListCondJSonModel.setData(JSonData);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
		
		oDetailTable.getModel().setData({Data : []});
		oDetailTable.setVisibleRowCount(1);
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
		this.onPressSearch();
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
	
	onSelectRow : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordRetireGroup.ZUI5_HR_CommuteRecordRetireGroupList"),
			oController = oView.getController(),
			oTableTxt = sap.ui.getCore().byId(oController.PAGEID + "_TableTxt"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			vEncid = oEvent.getSource().getCustomData()[0].getValue(),
			vEname = oEvent.getSource().getCustomData()[1].getValue();
		
		oTableTxt.setText(vEname);
		oTableTxt.setVisible(true);
		
		oController.onSearchDetailTable(oController, vEncid);
	},
	
	onSearchDetailTable : function(oController, vEncid) {
		var oModel = sap.ui.getCore().getModel("ZHR_MONTHLYTIME_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			oColumns = oTable.getColumns(),
			SerchCond = oController._ListCondJSonModel.getProperty("/Data"),
			aFilters = [],
			vTsmon = null;

		// 테이블 sort, filter 제거
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		if(SerchCond.Tsmon != "") {
			vTsmon = sap.ui.getCore().byId(oController.PAGEID + "_Tsmon").getValue();
			vTsmon = vTsmon.split('-');
			vTsmon = vTsmon[0] + vTsmon[1];
			aFilters.push(new sap.ui.model.Filter('Tsmon', sap.ui.model.FilterOperator.EQ, vTsmon));
		}
		if(vEncid != "") {
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid));
		}
		
		function Search() {
			var Datas = {Data : []},
				OneData = {};
			
			oModel.read("/EssMonthlyTimeDetailSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0;i<data.results.length;i++) {
							OneData = data.results[i];
							
							OneData.Idx = i + 1;
							OneData.Tschd = (!OneData.Tschd || OneData.Tschd == "0.00") ? "0" : OneData.Tschd;
							OneData.Tovrt = (!OneData.Tovrt || OneData.Tovrt == "0.00") ? "0" : OneData.Tovrt;
							OneData.Totex = (!OneData.Totex || OneData.Totex == "0.00") ? "0" : OneData.Totex;
							OneData.Tnght = (!OneData.Tnght || OneData.Tnght == "0.00") ? "0" : OneData.Tnght;
							
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
			
			oController._ListDetailJSonModel.setData(Datas);
			oTable.setVisibleRowCount(Datas.Data.length > 10 ? 10 : Datas.Data.length);
			
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
	
	// 리스트 조회
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordRetireGroup.ZUI5_HR_CommuteRecordRetireGroupList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_MONTHLYTIME_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oColumns = oTable.getColumns(),
			aFilters = [],
			begDate = null,
			SerchCond = oController._ListCondJSonModel.getProperty("/Data"),
			oConfirmSave = sap.ui.getCore().byId(oController.PAGEID + "_ConfirmBtn"),
			oTableTxt = sap.ui.getCore().byId(oController.PAGEID + "_TableTxt"),
			isVisible = false,
			aConfirmRowIndexs = [];
		
		// detail table 초기화
		oTableTxt.setText("");
		oTableTxt.setVisible(false);
		oController._ListDetailJSonModel.setData({Data : []});
		oController._ListDetailJSonModel.refresh();

		// 테이블 sort, filter 제거
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		if(SerchCond.Tsmon != "") {
			begDate = sap.ui.getCore().byId(oController.PAGEID + "_Tsmon").getValue();
			begDate = begDate.split('-');
			begDate = begDate[0] + begDate[1];
			aFilters.push(new sap.ui.model.Filter('Tsmon', sap.ui.model.FilterOperator.EQ, begDate));
		}
		if(SerchCond.Finyn != "" && SerchCond.Finyn != "ALL") {
			aFilters.push(new sap.ui.model.Filter('Finyn', sap.ui.model.FilterOperator.EQ, SerchCond.Finyn));
		}
		if(SerchCond.Encid != "") {
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, SerchCond.Encid));
		}
		aFilters.push(new sap.ui.model.Filter('Termf', sap.ui.model.FilterOperator.EQ, true));
		
		function Search() {
			var Datas = {Data : []},
				OneData = {};
			
			oModel.read("/MssMonthlyTimeDetailSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0;i<data.results.length;i++) {
							OneData = data.results[i];
							
							OneData.Idx = i + 1;
							OneData.Tschd = (!OneData.Tschd || OneData.Tschd == "0.00") ? "0" : OneData.Tschd;
							OneData.Tovrt = (!OneData.Tovrt || OneData.Tovrt == "0.00") ? "0" : OneData.Tovrt;
							OneData.Totex = (!OneData.Totex || OneData.Totex == "0.00") ? "0" : OneData.Totex;
							OneData.Tnght = (!OneData.Tnght || OneData.Tnght == "0.00") ? "0" : OneData.Tnght;
							OneData.Tofix = (!OneData.Tofix || OneData.Tofix == "0.00") ? "0" : OneData.Tofix;
							
							if(!OneData.Conyn) {
								isVisible = true;
							} else {
								aConfirmRowIndexs.push(i);
							}
							
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
			
//			oController._ListJSonModel.setData(Datas);
			oTable.getModel().setData(Datas);
			oTable.setVisibleRowCount(Datas.Data.length > 10 ? 10 : Datas.Data.length);
			
			oConfirmSave.setVisible(isVisible);
			
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
	
	_AddPersonDialog : null,
	
	EmpSearchByTx :function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordRetireGroup.ZUI5_HR_CommuteRecordRetireGroupList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordRetireGroup.ZUI5_HR_CommuteRecordRetireGroupList"),
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordRetireGroup.ZUI5_HR_CommuteRecordRetireGroupList"),
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordRetireGroup.ZUI5_HR_CommuteRecordRetireGroupList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordRetireGroup.ZUI5_HR_CommuteRecordRetireGroupList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordRetireGroup.ZUI5_HR_CommuteRecordRetireGroupList"),
			oController = oView.getController(),
			vControlId = common.Common.getControlId(oController, oController._oControl.getId());
		
		if(vControlId.Id && vControlId.Id != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
		if(vControlId.Key && vControlId.Key != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
		
		oController._AddPersonDialog.close();
	},
	
	SmartSizing : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordRetireGroup.ZUI5_HR_CommuteRecordRetireGroupList"),
//			oController = oView.getController();
	},
	
	onPressConfirm : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordRetireGroup.ZUI5_HR_CommuteRecordRetireGroupList"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty) { // 처리 구분
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oModel = sap.ui.getCore().getModel("ZHR_MONTHLYTIME_SRV"),
			vTsmon = sap.ui.getCore().byId(oController.PAGEID + "_Tsmon").getValue().split("-"),
			vTableData = oController._ListJSonModel.getProperty("/Data"),
			aSelectIndices = oTable.getSelectedIndices(),
			vPernr = oController._vPernr,
			isAlreadyConfim = true,
			errData = {},
			vOData = {},
			vDetailDataList = [],
			rowObject = {};
		
		if(aSelectIndices.length < 1) {
			oController.BusyDialog.close();
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0710"));	// 710:대상을 선택하세요.
			return ;
		}
		
		aSelectIndices.forEach(function(i) {
			var _selPath = oTable.getContextByIndex(i).sPath;
			
			rowObject = oTable.getModel().getProperty(_selPath);
			rowObject = common.Common.copyByMetadata(oModel, "MssMonthlyTimeDetail", rowObject);
			
			if(!rowObject.Conyn) isAlreadyConfim = false;
			
			rowObject.Conyn = true;
			delete rowObject.Begda;
			delete rowObject.Endda;
			
			vDetailDataList.push(rowObject);
		});
		
		if(isAlreadyConfim) {
			oController.BusyDialog.close();
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0711"));	// 711:이미 확인하셨습니다.
			return ;
		}
		
		var onProcess = function() {
			vOData.Actty = _gAuth;
			vOData.Prcty = vPrcty;
			vOData.Pernr = vPernr;
			vOData.Tsmon = vTsmon[0] + vTsmon[1];
			
			vOData.MssMonthlyTimeNav = vDetailDataList;
			
			oModel.create("/MssMonthlyTimeHeaderSet", vOData, {
				success: function(data,res) {
					if(data) {
					}
				},
				error: function (Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == 'E'){
				oController.BusyDialog.close();
				new control.ZNK_SapBusy.oErrorMessage(errData.ErrorMessage);
				return ;
			}
			
			oController.BusyDialog.close();
			
			sap.m.MessageBox.show(vCompTxt, {
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				onClose : oController.onBack
			});
			
			oController.onPressSearch();
		};
		
		var CreateProcess = function(fVal) {
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		var vInfoTxt = "" , vCompTxt = "";
		if(vPrcty == "T"){
			vInfoTxt = oBundleText.getText("LABEL_0061");	// 61:저장하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0060") ;	// 60:저장이 완료되었습니다.
		} else {
			vInfoTxt = oBundleText.getText("LABEL_0695");	// 695:확인하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0696");	// 696:확인이 완료되었습니다.
		}
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [
				sap.m.MessageBox.Action.YES, 
				sap.m.MessageBox.Action.NO
			],
			onClose : CreateProcess
		});
	},	
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordRetireGroup.ZUI5_HR_CommuteRecordRetireGroupList"),
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
				fileName: oBundleText.getText("LABEL_0916") + "-" + dateFormat.format(curDate) + ".xlsx"	// 916:퇴직자근태기록부확인(부서장)
		};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	},
	
	onExport2 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordRetireGroup.ZUI5_HR_CommuteRecordRetireGroupList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			oJSONModelData = oTable.getModel().getProperty("/Data"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"}),
			curDate = new Date();
		
		if(oJSONModelData.length < 1) return;
		
		var oSettings = {
				workbook: { columns: oController._Columns2 },
				dataSource: oJSONModelData,
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
				fileName: oBundleText.getText("LABEL_0697") + "-" + dateFormat.format(curDate) + ".xlsx"	// 697:개인별근태기록부내역
		};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	}
});