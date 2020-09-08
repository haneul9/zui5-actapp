jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_WorktimeReportIndv.ZUI5_HR_WorktimeReportIndvList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_WorktimeReportIndv.ZUI5_HR_WorktimeReportIndvList
	 */

	PAGEID : "ZUI5_HR_WorktimeReportIndvList",
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
	_openOrgehSearchInView : "",
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Orgtx", label : oBundleText.getText("LABEL_0028"), plabel : oBundleText.getText("LABEL_0028"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 28:부서
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "70px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "90px"},	// 38:성명
		{id: "Rtext", label : oBundleText.getText("LABEL_0624"), plabel : oBundleText.getText("LABEL_0624"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 624:근무조
		{id: "Wrkjobt", label : oBundleText.getText("LABEL_0010"), plabel : oBundleText.getText("LABEL_0010"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 근무직
		{id: "Wtm01", label : "Week1", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 5, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm02", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm03", label : "", plabel : oBundleText.getText("LABEL_0902"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 902:교육예정
		{id: "Wtm04", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Stat1", label : "", plabel : oBundleText.getText("LABEL_0036"), resize : false, span : 0, type : "StatusIcon", sort : true, filter : true, width : "80px"},	// 36:상태
		{id: "Wtm11", label : "Week2", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 5, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm12", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm13", label : "", plabel : oBundleText.getText("LABEL_0902"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 902:교육예정
		{id: "Wtm14", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Stat2", label : "", plabel : oBundleText.getText("LABEL_0036"), resize : false, span : 0, type : "StatusIcon", sort : true, filter : true, width : "80px"},	// 36:상태
		{id: "Wtm05", label : oBundleText.getText("LABEL_0900"), plabel : oBundleText.getText("LABEL_0900"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End}	// 900:3개월특근가능잔여시간
	],
	
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
			oDatum = sap.ui.getCore().byId(oController.PAGEID + "_Datum"),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			curDate = new Date(),
			vOrgeh = "",
			vOrgtx = "";
		
		if(vEmpLoginInfo.length > 0) {
			vOrgeh = vEmpLoginInfo[0].Orgeh ;
			vOrgtx = vEmpLoginInfo[0].Stext ;
		}
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1) {			
			var JSonData = { Data : { Datum : dateFormat.format(curDate), Orgeh : vOrgeh, Orgtx : vOrgtx, Auth : _gAuth }};
			oController._ListCondJSonModel.setData(JSonData);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
		
		// 현재 분기 시작일 셋팅
		var curQuarterStart = moment().quarter(moment().quarter()).startOf('quarter').toDate();
		oDatum.setMinDate(curQuarterStart);
		
		oController._ListJSonModel.setData({Data : []});
		oTable.setVisibleRowCount(1);
		oTable.bindRows({ path: "/Data" });

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
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportIndv.ZUI5_HR_WorktimeReportIndvList"),
			oController = oView.getController(),
			oTableTxt = sap.ui.getCore().byId(oController.PAGEID + "_TableTxt"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oModel = oTable.getModel(),
			vIDXs = oTable.getSelectedIndices(),
			selectRowObject = {};
		
		if(vIDXs.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0547"));	// 547:Data를  선택하여 주십시오.
			return;
		}
		
		selectRowObject = oModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath);
		
		oTableTxt.setText(selectRowObject.Ename);
		oTableTxt.setVisible(true);
		
		oController.onSearchDetailTable(oController, selectRowObject.Encid);
	},
	
	onSearchDetailTable : function(oController, vEncid) {
		var oModel = sap.ui.getCore().getModel("ZHR_WORKHOUR_SRV"),
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
		
		if(SerchCond.Datum != "") {
			aFilters.push(new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.getTime(SerchCond.Datum)));
		}
		if(vEncid != "") {
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid));
		}
		
		function Search() {
			var Datas = {Data : []},
				OneData = {};
			
			oModel.read("/WorkingHourDetailSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0;i<data.results.length;i++) {
							OneData = data.results[i];
							
							OneData.Idx = i + 1;
							
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportIndv.ZUI5_HR_WorktimeReportIndvList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_WORKHOUR_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			oTableTxt = sap.ui.getCore().byId(oController.PAGEID + "_TableTxt"),
			oColumns = oTable.getColumns(),
			aFilters = [],
			begDate = null,
			SerchCond = oController._ListCondJSonModel.getProperty("/Data");
		
		oDetailTable.getModel().setData({Data : []});
		oDetailTable.setVisibleRowCount(1);
		oTableTxt.setText("");
		oTableTxt.setVisible(false);

		// 테이블 sort, filter 제거
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		if(!SerchCond.Datum || !SerchCond.Orgeh) {
			oController._ListJSonModel.setData({Data:[]});
			oTable.setVisibleRowCount(0);
			return;
		}

		if(SerchCond.Datum != "") {
			aFilters.push(new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.getTime(SerchCond.Datum)));
		}
		if(SerchCond.Orgeh != "") {
			aFilters.push(new sap.ui.model.Filter('Orgeh', sap.ui.model.FilterOperator.EQ, SerchCond.Orgeh));
		}
		
		var curr = moment(SerchCond.Datum.replace(/[^\d]/g, ''));
		if(curr) {
			oController._colModel[6].label = curr.startOf('week').format('MM/DD') + " ~ " + curr.endOf('week').format('MM/DD');
			
			curr.add(7, 'days');
			oController._colModel[11].label = curr.startOf('week').format('MM/DD') + " ~ " + curr.endOf('week').format('MM/DD');
		}
		
		oTable.destroyColumns();
		common.ZHR_TABLES.makeColumn(oController, oTable, oController._colModel);
		
		oTable.getColumns()[16].setTemplate(new sap.ui.commons.TextView({
			textAlign : "Center",
			text : {
				path : "Wtm05",
				formatter : function(x){
					 if(x == null || x == ""){
						 return "";
					 }else{
						 if(x * 1 < 0){
							 this.removeStyleClass("FontFamily");
							 this.addStyleClass("FontFamilyRed"); 
						 }else{
							 this.removeStyleClass("FontFamilyRed");
							 this.addStyleClass("FontFamily");
						 }
						 return x; 
					 }
				}
			}
		}));
		
		function Search() {
			var Datas = {Data : []};
			
			oModel.read("/WorkingHourListSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0;i<data.results.length;i++) {
							var OneData = data.results[i];
							
							OneData.Idx = i + 1;
							
							Datas.Data.push(OneData);
							
							if(i == 0) {
								oController._Columns[6].label = OneData.Gigan1 + "-정상근무";
								oController._Columns[7].label = OneData.Gigan1 + "-시간외근무";
								oController._Columns[8].label = OneData.Gigan1 + "-교육예정";
								oController._Columns[9].label = OneData.Gigan1 + "-총 근로";
								oController._Columns[10].label = OneData.Gigan1 + "-상태";
								oController._Columns[11].label = OneData.Gigan2 + "-정상근무";
								oController._Columns[12].label = OneData.Gigan2 + "-시간외근무";
								oController._Columns[13].label = OneData.Gigan2 + "-교육예정";
								oController._Columns[14].label = OneData.Gigan2 + "-총 근로";
								oController._Columns[15].label = OneData.Gigan2 + "-상태";
							}
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
	
	SmartSizing : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportIndv.ZUI5_HR_WorktimeReportIndvList"),
//			oController = oView.getController();
	},
	
	_AddPersonDialog : null,
	
	EmpSearchByTx :function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportIndv.ZUI5_HR_WorktimeReportIndvList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportIndv.ZUI5_HR_WorktimeReportIndvList"),
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportIndv.ZUI5_HR_WorktimeReportIndvList"),
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportIndv.ZUI5_HR_WorktimeReportIndvList"),
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
		
		if(_gAuth == "H") {
			var oDatum = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Datum");
			
			oDatum.setEnabled(true);
		}
		
		oController._SerachOrgDialog.open();
	},
	
	displayOrgSearchDialog : function(oEvent) {
		jQuery.sap.require("common.SearchOrg");
		
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportIndv.ZUI5_HR_WorktimeReportIndvList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportIndv.ZUI5_HR_WorktimeReportIndvList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportIndv.ZUI5_HR_WorktimeReportIndvList"),
			oController = oView.getController(),
			vControlId = common.Common.getControlId(oController, oController._oControl.getId());
		
		if(vControlId.Id && vControlId.Id != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
		if(vControlId.Key && vControlId.Key != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
		oController._AddPersonDialog.close();
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportIndv.ZUI5_HR_WorktimeReportIndvList"),
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
				fileName: oBundleText.getText("LABEL_0903") + "-" + dateFormat.format(curDate) + ".xlsx"	// 903:근로시간 조회(부서별)
		};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	},
	
	onExport2 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportIndv.ZUI5_HR_WorktimeReportIndvList"),
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
				fileName: oBundleText.getText("LABEL_0901") + "-" + dateFormat.format(curDate) + ".xlsx"	// 901:개인별 상세내역
		};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	}
});