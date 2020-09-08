jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_Workplace.ZUI5_HR_WorkplaceList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Workplace.ZUI5_HR_WorkplaceList
	 */

	PAGEID : "ZUI5_HR_WorkplaceList",
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_Columns : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
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
			prevDate = curDate,
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1) {			
			
			var JSonData = { Data : { Datum : dateFormat.format(curDate) }};
			oController._ListCondJSonModel.setData(JSonData);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
	},

	onAfterShow : function(oEvent) {
		var oController = this,
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		
		this.SmartSizing(oEvent);
		
		this.onPressSearch();
		
		oController._ListJSonModel.setData({Data : []});
		oTable.setVisibleRowCount(0);
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_Workplace.ZUI5_HR_WorkplaceList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_EMPLOYEE_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			aFilters = [],
			SerchCond = oController._ListCondJSonModel.getProperty("/Data"),
			errData = {},
			oColumns = oTable.getColumns();

		// 테이블 sort, filter 제거
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		if(SerchCond.Datum != "") {
			aFilters.push(new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Datum").getDateValue())));
		}
	
		function Search() {
			var Datas = {Data : []}, vCnt01 = 0, vCnt02 = 0, vCnt03 = 0, 
			vCnt04 = 0, vCnt05 = 0, vSum01 = 0, vSum02 = 0;
			
			oModel.read("/WorkAreaEmpCntSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0;i<data.results.length;i++) {
							var OneData = data.results[i];
							OneData.Idx = i + 1;
							vCnt01 += (data.results[i].Cnt01 * 1) ;
							vCnt02 += (data.results[i].Cnt02 * 1) ;
							vCnt03 += (data.results[i].Cnt03 * 1) ;
							vCnt04 += (data.results[i].Cnt04 * 1) ;
							vCnt05 += (data.results[i].Cnt05 * 1) ;
							vSum01 += (data.results[i].Sum01 * 1) ;
							vSum02 += (data.results[i].Sum02 * 1) ;
							Datas.Data.push(OneData);
						}
						var TotalData = { Cnt01 : vCnt01, Cnt02 : vCnt02, Cnt03 : vCnt03,
										Cnt04 : vCnt04, Cnt05 : vCnt05,  Sum01 : vSum01,
										Sum02 : vSum02, Total : "X"};
						Datas.Data.push(TotalData);
					}
				},
				error: function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			// listdate 필드 convert => 필드id+"Txt" string 필드로
			common.Common.convertDateField(Datas);
			
			oController._ListJSonModel.setData(Datas);
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
			oTable.setVisibleRowCount(Datas.Data.length);
			
			if(errData.Error == "E") {
				oController.BusyDialog.close();
				sap.m.MessageBox.show(oController.ErrorMessage, {});
			}
			oTable.bindRows({ path: "/Data" });
			oController.BusyDialog.close();
		}	
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);
	},
	
	SmartSizing : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_Workplace.ZUI5_HR_WorkplaceList"),
//			oController = oView.getController();
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Workplace.ZUI5_HR_WorkplaceList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			oJSONModelData = oTable.getModel().getProperty("/Data"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"}),
			curDate = new Date();
		
		if(oJSONModelData.length < 1) return;
		
		var oSettings = {
			workbook: { columns: oController._Columns },
			dataSource: oJSONModelData,
			worker: false, // We need to disable worker because we are using a MockServer as OData Service
		    fileName: oBundleText.getText("LABEL_1913") + "-" + dateFormat.format(curDate) + ".xlsx"	// 1913:실근무지 인원조회
		};
	
		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	}
});