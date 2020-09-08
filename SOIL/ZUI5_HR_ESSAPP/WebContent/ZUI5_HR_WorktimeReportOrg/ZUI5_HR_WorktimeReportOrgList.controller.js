jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_WorktimeReportOrg.ZUI5_HR_WorktimeReportOrgList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_WorktimeReportOrg.ZUI5_HR_WorktimeReportOrgList
	 */

	PAGEID : "ZUI5_HR_WorktimeReportOrgList",
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
	_openOrgehSearchInView : "",
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Orgtx", label : oBundleText.getText("LABEL_0028"), plabel : oBundleText.getText("LABEL_0028"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 28:부서
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "70px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "90px"},	// 38:성명
		{id: "Rtext", label : oBundleText.getText("LABEL_0624"), plabel : oBundleText.getText("LABEL_0624"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 624:근무조
		{id: "Wrkjobt", label : oBundleText.getText("LABEL_0010"), plabel : oBundleText.getText("LABEL_0010"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 근무직
		{id: "Wtm01", label : oBundleText.getText("LABEL_0910"), plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무, 910:기간평균근로시간
		{id: "Wtm02", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm03", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm05", label : oBundleText.getText("LABEL_0908"), plabel : oBundleText.getText("LABEL_0908"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "110px", align : sap.ui.core.TextAlign.End},	// 908:3개월시간외근무가능잔여시간
		{id: "Wtm011", label : "Week1", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm012", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm013", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm021", label : "Week2", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm022", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm023", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm031", label : "Week3", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm032", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm033", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm041", label : "Week4", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm042", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm043", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm051", label : "Week5", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm052", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm053", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm061", label : "Week6", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm062", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm063", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm071", label : "Week7", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm072", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm073", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm081", label : "Week8", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm082", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm083", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm091", label : "Week9", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm092", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm093", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm101", label : "Week10", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm102", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm103", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm111", label : "Week11", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm112", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm113", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm121", label : "Week12", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm122", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm123", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm131", label : "Week13", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm132", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm133", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm141", label : "Week14", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm142", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm143", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
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
			curDate = new Date(),
			vOrgeh = "",
			vOrgtx = "";
		
		if(vEmpLoginInfo.length > 0) {
			vOrgeh = vEmpLoginInfo[0].Orgeh ;
			vOrgtx = vEmpLoginInfo[0].Stext ;
		}
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1) {			
			var JSonData = { Data : { Zyear : curDate.getFullYear(), Quarter : String(moment().quarter()), Orgeh : vOrgeh, Orgtx : vOrgtx, Auth : _gAuth }};
			oController._ListCondJSonModel.setData(JSonData);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
		
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
	
	onChangeQuarter : function(oEvent) {
		var selectedValue = oEvent.getSource().getSelectedKey(),
			currentQuarter = moment().quarter();
		
		if(Number(selectedValue) < Number(currentQuarter)) {
			oEvent.getSource().setSelectedKey(currentQuarter);
			
			sap.m.MessageBox.warning(oBundleText.getText("LABEL_2921"), {title : oBundleText.getText("LABEL_0052")});	// 2921:조회할 수 없는 기간입니다.
			return;
		}
	},
	
	// 리스트 조회
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportOrg.ZUI5_HR_WorktimeReportOrgList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_WORKHOUR_SRV"),
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
		
		if(SerchCond.Zyear != "") {
			aFilters.push(new sap.ui.model.Filter('Zyear', sap.ui.model.FilterOperator.EQ, SerchCond.Zyear));
		}
		if(SerchCond.Quarter != "") {
			aFilters.push(new sap.ui.model.Filter('Quarter', sap.ui.model.FilterOperator.EQ, SerchCond.Quarter));
		}
		if(SerchCond.Orgeh) {
			aFilters.push(new sap.ui.model.Filter('Orgeh', sap.ui.model.FilterOperator.EQ, SerchCond.Orgeh));
		}
		
		function Search() {
			var Datas = {Data : []};
			
			oModel.read("/WorkingHourLeaderSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0;i<data.results.length;i++) {
							var OneData = data.results[i];
							
							OneData.Idx = i + 1;
							
							Datas.Data.push(OneData);
							
							if(i == 0) {
								oTable.destroyColumns();
								
								oController._colModel[10].label = OneData.Wtm010;
								oController._colModel[13].label = OneData.Wtm020;
								oController._colModel[16].label = OneData.Wtm030;
								oController._colModel[19].label = OneData.Wtm040;
								oController._colModel[22].label = OneData.Wtm050;
								oController._colModel[25].label = OneData.Wtm060;
								oController._colModel[28].label = OneData.Wtm070;
								oController._colModel[31].label = OneData.Wtm080;
								oController._colModel[34].label = OneData.Wtm090;
								oController._colModel[37].label = OneData.Wtm100;
								oController._colModel[40].label = OneData.Wtm110;
								oController._colModel[43].label = OneData.Wtm120;
								oController._colModel[46].label = OneData.Wtm130;
								oController._colModel[49].label = OneData.Wtm140;
								
								common.ZHR_TABLES.makeColumn(oController, oTable, oController._colModel);
								
								oController._Columns[10].label = OneData.Wtm010 + "-" + oBundleText.getText("LABEL_0634");	// 634:정상근무
								oController._Columns[11].label = OneData.Wtm010 + "-" + oBundleText.getText("LABEL_0629");	// 629:시간외근무
								oController._Columns[12].label = OneData.Wtm010 + "-" + oBundleText.getText("LABEL_0912");	// 912:총근로
								oController._Columns[13].label = OneData.Wtm020 + "-" + oBundleText.getText("LABEL_0634");	// 634:정상근무   
								oController._Columns[14].label = OneData.Wtm020 + "-" + oBundleText.getText("LABEL_0629");	// 629:시간외근무  
								oController._Columns[15].label = OneData.Wtm020 + "-" + oBundleText.getText("LABEL_0912");	// 912:총근로    
								oController._Columns[16].label = OneData.Wtm030 + "-" + oBundleText.getText("LABEL_0634");	// 634:정상근무   
								oController._Columns[17].label = OneData.Wtm030 + "-" + oBundleText.getText("LABEL_0629");	// 629:시간외근무  
								oController._Columns[18].label = OneData.Wtm030 + "-" + oBundleText.getText("LABEL_0912");	// 912:총근로    
								oController._Columns[19].label = OneData.Wtm040 + "-" + oBundleText.getText("LABEL_0634");	// 634:정상근무   
								oController._Columns[20].label = OneData.Wtm040 + "-" + oBundleText.getText("LABEL_0629");	// 629:시간외근무  
								oController._Columns[21].label = OneData.Wtm040 + "-" + oBundleText.getText("LABEL_0912");	// 912:총근로    
								oController._Columns[22].label = OneData.Wtm050 + "-" + oBundleText.getText("LABEL_0634");	// 634:정상근무   
								oController._Columns[23].label = OneData.Wtm050 + "-" + oBundleText.getText("LABEL_0629");	// 629:시간외근무  
								oController._Columns[24].label = OneData.Wtm050 + "-" + oBundleText.getText("LABEL_0912");	// 912:총근로    
								oController._Columns[25].label = OneData.Wtm060 + "-" + oBundleText.getText("LABEL_0634");	// 634:정상근무   
								oController._Columns[26].label = OneData.Wtm060 + "-" + oBundleText.getText("LABEL_0629");	// 629:시간외근무  
								oController._Columns[27].label = OneData.Wtm060 + "-" + oBundleText.getText("LABEL_0912");	// 912:총근로    
								oController._Columns[28].label = OneData.Wtm070 + "-" + oBundleText.getText("LABEL_0634");	// 634:정상근무   
								oController._Columns[29].label = OneData.Wtm070 + "-" + oBundleText.getText("LABEL_0629");	// 629:시간외근무  
								oController._Columns[30].label = OneData.Wtm070 + "-" + oBundleText.getText("LABEL_0912");	// 912:총근로    
								oController._Columns[31].label = OneData.Wtm080 + "-" + oBundleText.getText("LABEL_0634");	// 634:정상근무   
								oController._Columns[32].label = OneData.Wtm080 + "-" + oBundleText.getText("LABEL_0629");	// 629:시간외근무  
								oController._Columns[33].label = OneData.Wtm080 + "-" + oBundleText.getText("LABEL_0912");	// 912:총근로    
								oController._Columns[34].label = OneData.Wtm090 + "-" + oBundleText.getText("LABEL_0634");	// 634:정상근무   
								oController._Columns[35].label = OneData.Wtm090 + "-" + oBundleText.getText("LABEL_0629");	// 629:시간외근무  
								oController._Columns[36].label = OneData.Wtm090 + "-" + oBundleText.getText("LABEL_0912");	// 912:총근로    
								oController._Columns[37].label = OneData.Wtm100 + "-" + oBundleText.getText("LABEL_0634");	// 634:정상근무   
								oController._Columns[38].label = OneData.Wtm100 + "-" + oBundleText.getText("LABEL_0629");	// 629:시간외근무  
								oController._Columns[39].label = OneData.Wtm100 + "-" + oBundleText.getText("LABEL_0912");	// 912:총근로    
								oController._Columns[40].label = OneData.Wtm110 + "-" + oBundleText.getText("LABEL_0634");	// 634:정상근무   
								oController._Columns[41].label = OneData.Wtm110 + "-" + oBundleText.getText("LABEL_0629");	// 629:시간외근무  
								oController._Columns[42].label = OneData.Wtm110 + "-" + oBundleText.getText("LABEL_0912");	// 912:총근로    
								oController._Columns[43].label = OneData.Wtm120 + "-" + oBundleText.getText("LABEL_0634");	// 634:정상근무   
								oController._Columns[44].label = OneData.Wtm120 + "-" + oBundleText.getText("LABEL_0629");	// 629:시간외근무  
								oController._Columns[45].label = OneData.Wtm120 + "-" + oBundleText.getText("LABEL_0912");	// 912:총근로    
								oController._Columns[46].label = OneData.Wtm130 + "-" + oBundleText.getText("LABEL_0634");	// 634:정상근무   
								oController._Columns[47].label = OneData.Wtm130 + "-" + oBundleText.getText("LABEL_0629");	// 629:시간외근무  
								oController._Columns[48].label = OneData.Wtm130 + "-" + oBundleText.getText("LABEL_0912");	// 912:총근로    
								oController._Columns[49].label = OneData.Wtm140 + "-" + oBundleText.getText("LABEL_0634");	// 634:정상근무   
								oController._Columns[50].label = OneData.Wtm140 + "-" + oBundleText.getText("LABEL_0629");	// 629:시간외근무  
								oController._Columns[51].label = OneData.Wtm140 + "-" + oBundleText.getText("LABEL_0912");	// 912:총근로    
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
//		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportOrg.ZUI5_HR_WorktimeReportOrgList"),
//			oController = oView.getController();
	},
	
	_AddPersonDialog : null,
	
	EmpSearchByTx :function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportOrg.ZUI5_HR_WorktimeReportOrgList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportOrg.ZUI5_HR_WorktimeReportOrgList"),
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportOrg.ZUI5_HR_WorktimeReportOrgList"),
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportOrg.ZUI5_HR_WorktimeReportOrgList"),
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
		
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportOrg.ZUI5_HR_WorktimeReportOrgList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportOrg.ZUI5_HR_WorktimeReportOrgList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportOrg.ZUI5_HR_WorktimeReportOrgList"),
			oController = oView.getController(),
			vControlId = common.Common.getControlId(oController, oController._oControl.getId());
		
		if(vControlId.Id && vControlId.Id != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
		if(vControlId.Key && vControlId.Key != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
		oController._AddPersonDialog.close();
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeReportOrg.ZUI5_HR_WorktimeReportOrgList"),
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
				fileName: oBundleText.getText("LABEL_0909") + "-" + dateFormat.format(curDate) + ".xlsx"	// 909:근로시간 조회(부서별/기간지정)
		};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	}
});