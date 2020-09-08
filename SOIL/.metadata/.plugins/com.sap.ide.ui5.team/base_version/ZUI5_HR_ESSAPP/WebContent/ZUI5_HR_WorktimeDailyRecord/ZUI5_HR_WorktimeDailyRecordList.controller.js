jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_WorktimeDailyRecord.ZUI5_HR_WorktimeDailyRecordList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_WorktimeDailyRecord.ZUI5_HR_WorktimeDailyRecordList
	 */

	PAGEID : "ZUI5_HR_WorktimeDailyRecordList",
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
			prevDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1, 1),
			vOrgeh = "",
			vOrgtx = "";
		
		if(vEmpLoginInfo.length > 0) {
			vOrgeh = vEmpLoginInfo[0].Orgeh ;
			vOrgtx = vEmpLoginInfo[0].Stext ;
		}
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1) {			
			var JSonData = { Data : { Tsmon : dateFormat.format(prevDate), Orgeh : vOrgeh, Orgtx : vOrgtx }};
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
	
	// 리스트 조회
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeDailyRecord.ZUI5_HR_WorktimeDailyRecordList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_DAILYTIME_SRV"),
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
		
		if(!SerchCond.Tsmon || (!SerchCond.Orgeh && !SerchCond.Pernr)) {
			oController._ListJSonModel.setData({Data:[]});
			oTable.setVisibleRowCount(0);
			return;
		}

		if(SerchCond.Tsmon != "") {
			begDate = sap.ui.getCore().byId(oController.PAGEID + "_Tsmon").getValue();
			begDate = begDate.split("-");
			aFilters.push(new sap.ui.model.Filter('Tsmon', sap.ui.model.FilterOperator.EQ, begDate[0] + begDate[1]));
		}
		if(SerchCond.Orgeh != "") {
			aFilters.push(new sap.ui.model.Filter('Orgeh', sap.ui.model.FilterOperator.EQ, SerchCond.Orgeh));
		}
		if(SerchCond.Encid) {
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, SerchCond.Encid));
		}
		
		oController.buildTableHeader(oController, aFilters);
		
		function Search() {
			var Datas = {Data : []};
			
			oModel.read("/MssDailyTimeListSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0;i<data.results.length;i++) {
							var OneData = data.results[i];
							
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
			
			oController._ListJSonModel.setData(Datas);
			oController._ListJSonModel.refresh();
//			oTable.setVisibleRowCount(Datas.Data.length > 15 ? 15 : Datas.Data.length);
			oTable.setVisibleRowCount(Datas.Data.length);
			
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
	
	buildTableHeader : function(oController, aFilters) {
		var oModel = sap.ui.getCore().getModel("ZHR_DAILYTIME_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oColumn = null,
			colModel = [
				{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "50px"},
				{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "60px"},	// 31:사번
				{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "70px"},	// 38:성명
				{id: "Gubun", label : oBundleText.getText("LABEL_0300"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.Begin},	// 300:구분
				{id: "Total", label : oBundleText.getText("LABEL_0142"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "60px"}	// 142:합계
			];
		
		oModel.read("/MssDailyTimeHeaderSet", {
			async: false,
			filters: aFilters,
			success: function(data,res) {
				if(data && data.results.length) {
					oTable.destroyColumns();
					
					colModel.forEach(function(elem) {
						oColumn = new sap.ui.table.Column({
							hAlign : "Center",
							flexible : false,
							autoResizable : true,
							resizable : true,
							showFilterMenuEntry : true
						})
						.setFilterProperty(elem.id)
						.setSortProperty(elem.id)
						.setWidth(elem.width)
						.addMultiLabel(new sap.ui.commons.TextView({
							text : elem.label, 
							textAlign : "Center", width : "100%"
						}).addStyleClass("FontFamilyBold"))
						.setTemplate(new sap.ui.commons.TextView({
							text : (elem.type === "date") 
										? {
											path : elem.id, 
											type : new sap.ui.model.type.Date({pattern: "yyyy.MM.dd"})
										}
										: "{" + elem.id + "}", 
							textAlign : (elem.align) ? elem.align : "Center"
						}).addStyleClass("FontFamily"));
						
						oTable.addColumn(oColumn);
					});
					
					data.results.forEach(function(elem) {
						oColumn = new sap.ui.table.Column({
							hAlign : "Center",
							flexible : false,
							autoResizable : true,
							resizable : true,
							showFilterMenuEntry : true
						})
						.setFilterProperty(elem.Field)
						.setSortProperty(elem.Field)
						.setWidth("40px")
						.addMultiLabel(new sap.ui.commons.TextView({
							text : elem.Fldtx, 
							textAlign : sap.ui.core.TextAlign.Center, 
							width : "100%"
						}).addStyleClass("FontFamilyBold"));
						
						oColumn.setTemplate(new sap.m.Toolbar({
							width : "100%",
							content : [
								new sap.m.Link({
									text : "{" + elem.Field + "}", 
									width : "100%",
									textAlign : sap.ui.core.TextAlign.Begin,
									press : oController.onOpenTextField,
									customData : [
										new sap.ui.core.CustomData({key : elem.Field, value : "{" + elem.Field + "}"})
									],
									visible : {
										path : "Gubun",
										formatter : function(fVal) {
											return (fVal == "근태") ? true : false;
										}
									}
								}).addStyleClass("FontFamily"),
								new sap.ui.commons.TextView({
									width : "100%",
									text : "{" + elem.Field + "}", 
									textAlign : sap.ui.core.TextAlign.Center,
									visible : {
										path : "Gubun",
										formatter : function(fVal) {
											return (fVal == "근태") ? false : true;
										}
									}
								}).addStyleClass("FontFamily")
							]
						}));
						
						oTable.addColumn(oColumn);
						colModel.push({ id: elem.Field, label : elem.Fldtx, type : "string" });
					});
					
					oController._Columns = common.Common.convertColumnArrayForExcel(colModel);
				}
			},
			error: function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == "E"){
					sap.m.MessageBox.alert(errData.ErrorMessage, {});
				}
			}
		});
	},
	
	onOpenTextField : function(oEvent) {
		if(oEvent.getSource().getCustomData() && oEvent.getSource().getCustomData().length > 0){
			var vFieldText = oEvent.getSource().getCustomData()[0].getValue(); 
			var vHeight = "53px";
			
			var oRow, oCell;
			
			var oMatrix = new sap.ui.commons.layout.MatrixLayout({
				columns : 3,
				widths : ['10px','','10px']
			});
			
			if(vFieldText && vFieldText != ""){
				oRow = new sap.ui.commons.layout.MatrixLayoutRow();
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({})
				}); 
				oRow.addCell(oCell);
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.TextArea({
				 		editable : false ,
				 		value : vFieldText,
				 		growing : true,
				 		width : "100%",
				 		rows : 2,
				 	}).addStyleClass("FontFamily"),
					hAlign : "Center",
				}); 
				oRow.addCell(oCell);
				oMatrix.addRow(oRow);
			}
					
			var oPopover = new sap.m.Popover({
				contentWidth : "300px",
				contentHeight : vHeight,
				placement : sap.m.PlacementType.Top,
				content : oMatrix ,
				title : oBundleText.getText("LABEL_0016")	// 내역
			});
			
			oPopover.openBy(oEvent.getSource());
		}
	},
	
	SmartSizing : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeDailyRecord.ZUI5_HR_WorktimeDailyRecordList"),
//			oController = oView.getController();
	},
	
	_AddPersonDialog : null,
	
	EmpSearchByTx :function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeDailyRecord.ZUI5_HR_WorktimeDailyRecordList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeDailyRecord.ZUI5_HR_WorktimeDailyRecordList"),
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeDailyRecord.ZUI5_HR_WorktimeDailyRecordList"),
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeDailyRecord.ZUI5_HR_WorktimeDailyRecordList"),
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
		
		// 검색 기준일자 활성화
		if(_gAuth == "H") {
			sap.ui.getCore().byId(oController.PAGEID + "_COMMON_SEARCH_ORG_Datum").setEnabled(true);
		}
		
		oController._SerachOrgDialog.open();
	},
	
	displayOrgSearchDialog : function(oEvent) {
		jQuery.sap.require("common.SearchOrg");
		
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeDailyRecord.ZUI5_HR_WorktimeDailyRecordList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeDailyRecord.ZUI5_HR_WorktimeDailyRecordList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeDailyRecord.ZUI5_HR_WorktimeDailyRecordList"),
			oController = oView.getController(),
			vControlId = common.Common.getControlId(oController, oController._oControl.getId());
		
		if(vControlId.Id && vControlId.Id != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
		if(vControlId.Key && vControlId.Key != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
		oController._AddPersonDialog.close();
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorktimeDailyRecord.ZUI5_HR_WorktimeDailyRecordList"),
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
				fileName: oBundleText.getText("LABEL_0730") + "-" + dateFormat.format(curDate) + ".xlsx"	// 730:일별근태기록부 조회(부서장)
		};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	}
});