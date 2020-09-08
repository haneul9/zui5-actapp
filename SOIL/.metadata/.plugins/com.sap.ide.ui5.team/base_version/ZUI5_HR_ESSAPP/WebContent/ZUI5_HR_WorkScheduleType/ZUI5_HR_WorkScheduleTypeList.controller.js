jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_WorkScheduleType.ZUI5_HR_WorkScheduleTypeList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_WorkScheduleType.ZUI5_HR_WorkScheduleTypeList
	 */

	PAGEID : "ZUI5_HR_WorkScheduleTypeList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_vInfoTextFlag : "X",  // 신청안내 Frame 의 Text 를 안내로 표기하기 위한 Flag
	_Columns : "",
	_vPersa : "" ,
	_vClsdt : "",
	_vZpayym : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	_vZworktyp : 'TMX1',
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
			begDate = new Date(curDate.getFullYear(), curDate.getMonth()+1, 0),
			prevDate = new Date(curDate.getFullYear(), curDate.getMonth()-2 , 1),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1) {			
			var JSonData = { Data : { Begda : dateFormat.format(prevDate) , Endda : dateFormat.format(begDate) }};
			oController._ListCondJSonModel.setData(JSonData);
			
			// 신청안내
			common.ApplyInformation.onSetApplyInformation(oController);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkScheduleType.ZUI5_HR_WorkScheduleTypeList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
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
		
		if(!SerchCond.Schkz) {
			oController._ListJSonModel.setData({Data:[]});
			oTable.setVisibleRowCount(0);
			return;
		}
		
		if(SerchCond.Begda != "" && SerchCond.Endda != "") {
			if(common.Common.checkDate(SerchCond.Begda, SerchCond.Endda) == false) {
				return ;
			}
		}
		
		if(SerchCond.Begda != "") {
			begDate = sap.ui.getCore().byId(oController.PAGEID + "_Begda").getDateValue();
			begDate = new Date(begDate.getFullYear(), begDate.getMonth(), 1);
			aFilters.push(new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(begDate)));
		}
		if(SerchCond.Endda != "") {
			endDate = sap.ui.getCore().byId(oController.PAGEID + "_Endda").getDateValue();
			endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
			aFilters.push(new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(endDate)));
		}
		if(SerchCond.Schkz) {
			aFilters.push(new sap.ui.model.Filter('Schkz', sap.ui.model.FilterOperator.EQ, SerchCond.Schkz));
		}
		
		oController.buildTableHeader(oController, aFilters);
		
		function Search() {
			var Datas = {Data : []};
			
			oModel.read("/SchkzScheduleListSet", {
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
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
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
	
	buildTableHeader : function(oController, aFilters) {
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oColumn = null,
			colModel = [
				{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "10%"},
				{id: "Datum", label : oBundleText.getText("LABEL_0057"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "12%"},	// 57:일자
				{id: "Week", label : oBundleText.getText("LABEL_0054"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "12%"},	// 54:요일
				{id: "Holtx", label : oBundleText.getText("LABEL_0504"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "12%"}	// 504:휴일여부
			];
		
		oModel.read("/SchkzScheduleHeaderSet", {
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
						}).addStyleClass("Font14px FontBold FontColor3"))
						.setTemplate(new sap.ui.commons.TextView({
							text : (elem.type === "date") 
										? {
											path : elem.id, 
											type : new sap.ui.model.type.Date({pattern: "yyyy.MM.dd"})
										}
										: "{" + elem.id + "}", 
							textAlign : "Center"
						}).addStyleClass("Font14px FontColor3"));
						
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
						.addMultiLabel(new sap.ui.commons.TextView({
							text : elem.Fldtx, 
							textAlign : "Center", width : "100%"
						}).addStyleClass("Font14px FontBold FontColor3"))
						.setTemplate(new sap.ui.commons.TextView({
							text : "{" + elem.Field + "}", 
							textAlign : sap.ui.core.TextAlign.Begin
						}).addStyleClass("Font14px FontColor3"));
						
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
	
	SmartSizing : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkScheduleType.ZUI5_HR_WorkScheduleTypeList"),
//			oController = oView.getController();
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkScheduleType.ZUI5_HR_WorkScheduleTypeList"),
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
				fileName: oBundleText.getText("LABEL_0505") + "-" + dateFormat.format(curDate) + ".xlsx"	// 505:근무형태별근무일정조회
		};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	}
});