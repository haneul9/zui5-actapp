jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_DeductionChangeResnDisplay.ZUI5_HR_DeductionChangeResnDisplayList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_DeductionChangeResnDisplay.ZUI5_HR_DeductionChangeResnDisplayList
	 */

	PAGEID : "ZUI5_HR_DeductionChangeResnDisplayList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_ListDetailJSonModel : new sap.ui.model.json.JSONModel(),
	_Columns : "",
	_Columns2 : "",
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
			begDate = new Date(curDate.getFullYear(), curDate.getMonth(), 1),
			prevDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1 , 1),
			mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo"),
			vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
			vEname = "",
			vEncid = "";
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1) {			
			if(_gAuth == "E" && vEmpLoginInfo.length > 0) {
				vEname = vEmpLoginInfo[0].Ename ;
				vEncid = vEmpLoginInfo[0].Encid ;
			}
			
			var JSonData = { Data : { PdeymBeg : dateFormat.format(prevDate) , PdeymEnd : dateFormat.format(begDate), Encid : vEncid, Ename : vEname }};
			oController._ListCondJSonModel.setData(JSonData);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
		
		oController._ListDetailJSonModel.setData({Data : []});
		sap.ui.getCore().byId(oController.PAGEID + "_DetailTable").setVisibleRowCount(0);
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChangeResnDisplay.ZUI5_HR_DeductionChangeResnDisplayList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_CHG_DISP_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable")
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
		
		if(SerchCond.PdeymBeg != "" && SerchCond.PdeymEnd != "") {
			if(common.Common.checkDate(SerchCond.PdeymBeg, SerchCond.PdeymEnd) == false) {
				return ;
			}
		}
		
		if(SerchCond.PdeymBeg != "") {
			begDate = sap.ui.getCore().byId(oController.PAGEID + "_PdeymBeg").getValue();
			begDate = begDate.split('-');
			begDate = begDate[0] + begDate[1];
			aFilters.push(new sap.ui.model.Filter('PdeymBeg', sap.ui.model.FilterOperator.EQ, begDate));
		}
		if(SerchCond.PdeymEnd != "") {
			endDate = sap.ui.getCore().byId(oController.PAGEID + "_PdeymEnd").getValue();
			endDate = endDate.split('-');
			endDate = endDate[0] + endDate[1];
			aFilters.push(new sap.ui.model.Filter('PdeymEnd', sap.ui.model.FilterOperator.EQ, endDate));
		}
		if(SerchCond.Encid != "") {
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, SerchCond.Encid));
		}
		
		function Search() {
			var Datas = {Data : []},
				OneData = {},
				vIdx = 1;
			
			oModel.read("/DeductChgObjListSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0;i<data.results.length;i++) {
							OneData = data.results[i];
							
							OneData.Idx = vIdx++;
							OneData.Betrg = common.Common.numberWithCommas(OneData.Betrg);
							OneData.Reqym = (OneData.Reqym && OneData.Reqym != "000000") ? (OneData.Reqym).replace(/(\d{4})(\d{2})/g, '$1.$2') : undefined;
							OneData.Pdeym = (OneData.Pdeym && OneData.Pdeym != "000000") ? (OneData.Pdeym).replace(/(\d{4})(\d{2})/g, '$1.$2') : undefined;
							
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
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			oTable.setVisibleRowCount(Datas.Data.length > 10 ? 10 : Datas.Data.length);
			
			oController._ListDetailJSonModel.setData({Data : []});
			oDetailTable.setVisibleRowCount(1);
			
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
	
	onRowDblClick : function(e) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChangeResnDisplay.ZUI5_HR_DeductionChangeResnDisplayList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oModel = oTable.getModel(),
			vIDXs = oTable.getSelectedIndices(),
			selectRowObject = {};
		
		if(vIDXs.length < 1){
//			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0547"));	// 547:Data를  선택하여 주십시오.
			return;
		}
		
		selectRowObject = oModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath);
		
		oController.BusyDialog.open();
		
		oController.retrieveDetailList(oController, selectRowObject);
		
		oController.BusyDialog.close();
	},
	
	retrieveDetailList : function(oController, paramObj) {
		var oModel = oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_CHG_DISP_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			vData = {Data : []},
			aFilters = [];
		
		oController._ListDetailJSonModel.setData(vData);
		oTable.setVisibleRowCount(1);
		
		aFilters.push(new sap.ui.model.Filter('Dedcd', sap.ui.model.FilterOperator.EQ, paramObj.Dedcd));
		if(paramObj.Pdeym) aFilters.push(new sap.ui.model.Filter('Pdeym', sap.ui.model.FilterOperator.EQ, paramObj.Pdeym.replace(/[^\d]/g, '')));
		
		oModel.read("/DeductChgObjDetailSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					var i = 1;
					data.results.forEach(function(elem) {
						elem.Idx = i++;
						elem.Betrg = common.Common.numberWithCommas(elem.Betrg);
						elem.ZreqDatetime = (elem.ZreqDate) ? dateFormat.format(new Date(common.Common.setTime(elem.ZreqDate))) : "";
						elem.ZreqDatetime = (elem.ZreqDatetime && elem.ZreqTime) ? elem.ZreqDatetime + " " + common.Common.timeToString(elem.ZreqTime, "HH:mm:ss") : elem.ZreqDatetime;
						
						vData.Data.push(elem);
					});
					
					// listdate 필드 convert => 필드id+"Txt" string 필드로
					common.Common.convertDateField(vData);
					
					oController._ListDetailJSonModel.setData(vData);
					oTable.setVisibleRowCount(vData.Data.length > 10 ? 10 : vData.Data.length);
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == "E") {
					sap.m.MessageBox.alert(errData.ErrorMessage, {});
					return;
				}
			}
		});
	},
	
	_AddPersonDialog : null,
	
	EmpSearchByTx :function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChangeResnDisplay.ZUI5_HR_DeductionChangeResnDisplayList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChangeResnDisplay.ZUI5_HR_DeductionChangeResnDisplayList"),
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChangeResnDisplay.ZUI5_HR_DeductionChangeResnDisplayList"),
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChangeResnDisplay.ZUI5_HR_DeductionChangeResnDisplayList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChangeResnDisplay.ZUI5_HR_DeductionChangeResnDisplayList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChangeResnDisplay.ZUI5_HR_DeductionChangeResnDisplayList"),
			oController = oView.getController(),
			vControlId = common.Common.getControlId(oController, oController._oControl.getId());
		
		if(vControlId.Id && vControlId.Id != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
		if(vControlId.Key && vControlId.Key != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
		
		oController._AddPersonDialog.close();
	},
	
	SmartSizing : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChangeResnDisplay.ZUI5_HR_DeductionChangeResnDisplayList"),
//			oController = oView.getController();
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChangeResnDisplay.ZUI5_HR_DeductionChangeResnDisplayList"),
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
				fileName: oBundleText.getText("LABEL_0560") + "-" + dateFormat.format(curDate) + ".xlsx"	// 560:변동공제 조회(사유발생자)
		};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	},

	onExport2 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionChangeResnDisplay.ZUI5_HR_DeductionChangeResnDisplayList"),
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
				fileName: oBundleText.getText("LABEL_0561") + "-" + dateFormat.format(curDate) + ".xlsx"	// 561:변동공제 조회(신청자)
		};
		
		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
		oSpreadsheet.build();
	}
});