jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_OvertimeLeaderDisp.ZUI5_HR_OvertimeLeaderDispList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_OvertimeLeaderDisp.ZUI5_HR_OvertimeLeaderDispList
	 */

	PAGEID : "ZUI5_HR_OvertimeLeaderDispList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_Columns : "",
	_vPersa : "" ,
	_vClsdt : "",
	_vZpayym : "",
	_vOrgeh : "",
	_vOrgtx : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	_vZworktyp : 'HR41',
	_oControl  : null,
	_vEnamefg : "",
	_InitControl : "",
	_openOrgehSearchInView : "",
	_vYflag : "",
	
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
			mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo"),
			vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oBegda = sap.ui.getCore().byId(oController.PAGEID + "_Begda"),
			oEndda = sap.ui.getCore().byId(oController.PAGEID + "_Endda"),
			curDate = new Date(),
			prevDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate() + 1),
			vEname = "",
			vEncid = "",
			vOrgeh = "",
			vOrgtx = "";
		
		if(vEmpLoginInfo.length > 0) {
			vOrgeh = vEmpLoginInfo[0].Orgeh ;
			vOrgtx = vEmpLoginInfo[0].Stext ;
			
			if(_gAuth == "E") {
				oController._vOrgeh = vOrgeh;
				oController._vOrgtx = vOrgtx;
			}
		}
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1) {			
			if(_gAuth == "E" && vEmpLoginInfo.length > 0) {
				vEname = vEmpLoginInfo[0].Ename ;
				vEncid = vEmpLoginInfo[0].Encid ;
			}
			
			var JSonData = { Data : { Begda : dateFormat.format(prevDate) , Endda : dateFormat.format(curDate), Orgeh : vOrgeh, Orgtx : vOrgtx, Auth : _gAuth, Encid : vEncid, Ename : vEname }};
			oController._ListCondJSonModel.setData(JSonData);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
		
		oBegda.setMaxDate(curDate);
		oEndda.setMaxDate(curDate);
		
		oController._ListJSonModel.setData({Data : []});
		oTable.setVisibleRowCount(1);
		oTable.bindRows({ path: "/Data" });
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
	
	// 리스트 조회
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeLeaderDisp.ZUI5_HR_OvertimeLeaderDispList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oColumns = oTable.getColumns(),
			aFilters = [],
			begDate = null,
			SerchCond = oController._ListCondJSonModel.getProperty("/Data");

		// 테이블 sort, filter 제거
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		if(SerchCond.Begda != "" && SerchCond.Endda != "") {
			if(common.Common.checkDate(SerchCond.Begda, SerchCond.Endda) == false) {
				return ;
			}
		}
		
		if(common.Common.calDate(SerchCond.Endda, SerchCond.Begda) > 30) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0870"), {title : ""});	// 870:조회 기간은 한달 이내로 합니다.
			return;
		}

		if(SerchCond.Begda != "") {
			aFilters.push(new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Begda").getDateValue())));
		}
		if(SerchCond.Endda != "") {
			aFilters.push(new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Endda").getDateValue())));
		}
		if(SerchCond.Orgeh != "") {
			aFilters.push(new sap.ui.model.Filter('Orgeh', sap.ui.model.FilterOperator.EQ, SerchCond.Orgeh));
		}
		if(SerchCond.Encid) {
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, SerchCond.Encid));
		}
		
		function Search() {
			var Datas = {Data : []};
			
			oModel.read("/SpecialWorkOrgListSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0;i<data.results.length;i++) {
							var OneData = data.results[i];
							
							if(OneData.Orgtx == oBundleText.getText("LABEL_0142")) {	// 0142:합계
								OneData.Beguz = undefined;
								OneData.Enduz = undefined;
							}
							
							OneData.Idx = i + 1;
							OneData.Beguz = common.Common.timeToString(OneData.Beguz, "KK:mm");
							OneData.Enduz = common.Common.timeToString(OneData.Enduz, "KK:mm");
							OneData.Tim11 = (!OneData.Tim11 || OneData.Tim11 == "0.00") ? "0" : OneData.Tim11;
							OneData.Tim12 = (!OneData.Tim12 || OneData.Tim12 == "0.00") ? "0" : OneData.Tim12;
							OneData.Tim13 = (!OneData.Tim13 || OneData.Tim13 == "0.00") ? "0" : OneData.Tim13;
							OneData.Tim14 = (!OneData.Tim14 || OneData.Tim14 == "0.00") ? "0" : OneData.Tim14;
							
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
			oController._ListJSonModel.refresh();
			oTable.setVisibleRowCount(Datas.Data.length > 15 ? 15 : Datas.Data.length);
			
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
	
	SmartSizing : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeLeaderDisp.ZUI5_HR_OvertimeLeaderDispList"),
//			oController = oView.getController();
	},
	
	_AddPersonDialog : null,
	
	EmpSearchByTx :function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeLeaderDisp.ZUI5_HR_OvertimeLeaderDispList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeLeaderDisp.ZUI5_HR_OvertimeLeaderDispList"),
			oController = oView.getController();
		
		if(oEvent){
			oController._oControl = oEvent.getSource();
			oController._vEnamefg = "";
		}
		
		//각 발령대상자의 발령일을 검색조건으로 설정한다.
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		if(oActda) oController._vActda = oActda.getValue();
		
		common.SearchUserList.oController = oController;
		common.SearchUserList.fPersaEnabled = true;
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearchList", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		
		oController._AddPersonDialog.open();
		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		jQuery.sap.require("common.SearchOrg");

		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeLeaderDisp.ZUI5_HR_OvertimeLeaderDispList"),
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
	
	displayOrgSearchDialogInView : function(oEvent) {
		jQuery.sap.require("common.SearchOrg");

		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeLeaderDisp.ZUI5_HR_OvertimeLeaderDispList"),
			oController = oView.getController();
		
		oController._openOrgehSearchInView = "X";
		
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
	
	displayOrgSearchDialog : function(oEvent) {
		jQuery.sap.require("common.SearchOrg");
		
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeLeaderDisp.ZUI5_HR_OvertimeLeaderDispList"),
		oController = oView.getController();
		
		oController._openOrgehSearchInView = "";
		
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
	
	onAfterOrgeh : function(oController, vZorgeh) {
		if(oController._openOrgehSearchInView == "X") {
			oController._ListCondJSonModel.setProperty("/Data/Orgeh", vZorgeh);
		}
	},
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeLeaderDisp.ZUI5_HR_OvertimeLeaderDispList"),
			oController = oView.getController();
	
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp"),
			vActionSubjectList_Temp = {ActionSubjectListSet : []};
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
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
			
			var vControlId = common.Common.getControlId(oController, oController._oControl.getId());
			if(vControlId.Id && vControlId.Id != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id, mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[0] + "/Ename"));
			if(vControlId.Key && vControlId.Key != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[0] + "/Encid"));
		
		}else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeLeaderDisp.ZUI5_HR_OvertimeLeaderDispList"),
			oController = oView.getController(),
			vControlId = common.Common.getControlId(oController, oController._oControl.getId());
		
		if(vControlId.Id && vControlId.Id != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
		if(vControlId.Key && vControlId.Key != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
		oController._AddPersonDialog.close();
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeLeaderDisp.ZUI5_HR_OvertimeLeaderDispList"),
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
				fileName: oBundleText.getText("LABEL_0871") + "-" + dateFormat.format(curDate) + ".xlsx"	// 871:특근내역조회
		};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	}
});