jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("sap.ui.export.Spreadsheet");

sap.ui.controller("ZUI5_HR_LunchHistory.ZUI5_HR_LunchHistoryDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_LunchHistory.ZUI5_HR_LunchHistoryDetail
	 */

	PAGEID : "ZUI5_HR_LunchHistoryDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(), 
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vAppno : "",
	_vEnamefg : "",
	_oControl  : null,
	_Columns : [],
	BusyDialog : new sap.m.BusyDialog(),
	
	onInit : function() {


		this.getView().addStyleClass("sapUiSizeCompact");

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
		var oController = this;
		var oDetailTitle = "" ;
		oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		var oModel = sap.ui.getCore().getModel("ZHR_LUNCH_CARD_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oDetailTableData = {Data : []};
		var oDetailData = {Data : {}};
		var errData = {};

		// 공통적용사항 Start
		// 상세화면 Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.ZappStatAl = "";
		oController._DetailJSonModel.setData(oDetailData);
		oController._DetailTableJSonModel.setData(oDetailTableData);
		
		// 대상자 조회
		common.TargetUser.oController = oController;
		common.TargetUser.onSetTarget(oController);
		
		// 진행상태 대상자 Model 업데이트
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", "");
		
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
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
	
	onAfterSelectPernr : function(oController){
		oController.onResetDetail(oController);
	},
	
	onResetDetail : function(oController){
		var vData = {};
		vData.Pernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
		vData.Encid = oController._DetailJSonModel.getProperty("/Data/Encid");
		vData.ZappStatAl = oController._DetailJSonModel.getProperty("/Data/ZappStatAl");
		vData.Yyyymm = oController._DetailJSonModel.getProperty("/Data/Yyyymm");
		vData.Auth = oController._DetailJSonModel.getProperty("/Data/Auth");
		
		oController._DetailJSonModel.setProperty("/Data", vData);
		oController._DetailTableJSonModel.setData({"Data" :[]}); 
		
		if(!common.Common.checkNull(vData.Yyyymm)){
			oController.onSearchBtn();
		}
	},	
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LunchHistory.ZUI5_HR_LunchHistoryDetail");
		var oController = oView.getController();
	},
	
	onSearchBtn : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LunchHistory.ZUI5_HR_LunchHistoryDetail");
		var oController = oView.getController();
		oController.onSearchHeader();
		oController.onSearch();
	},
	
	onSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LunchHistory.ZUI5_HR_LunchHistoryDetail");
		var oController = oView.getController();
		var DetailData = oController._DetailJSonModel.getProperty("/Data"),
		    vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"),
		    vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"),
		    vYyyymm = oController._DetailJSonModel.getProperty("/Data/Yyyymm"),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
			console.log(vYyyymm);
		var onProcess = function(){
			var oDatas = { Data : []};
			var errData = {};
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy.MM.dd"});
			var oModel = sap.ui.getCore().getModel("ZHR_LUNCH_CARD_SRV");
			oModel.read("/LunchFeeCardSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
					new sap.ui.model.Filter('Yyyymm', sap.ui.model.FilterOperator.EQ, vYyyymm.replace(/[^\d]/g, '').substring(0, 6)),
				],
				success : function(data, res) {
					data.results.forEach(function(element, idx) {
						element.Idx = idx + 1;
						if(common.Common.checkNull(element.Datum)){
							element.Datum = "";
						}else{
							element.Datum = dateFormat.format(new Date(common.Common.setTime(element.Datum)));
							if(!common.Common.checkNull(element.Timetx)){
								element.Datum = element.Datum + " " + element.Timetx.substring(0,2) + ":" + element.Timetx.substring(2,4);
							}
						}
						oDatas.Data.push(element);
					});
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			oController.BusyDialog.close();
			
			oController._DetailTableJSonModel.setData(oDatas);
			oDetailTable.setVisibleRowCount(oDatas.Data.length > 10 ? 10 : oDatas.Data.length);
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage);
				return ;
			}
		}
		
		oController.BusyDialog.open();
		setTimeout(onProcess, 100);
	}, 
	
	onSearchHeader : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LunchHistory.ZUI5_HR_LunchHistoryDetail");
		var oController = oView.getController();
		var DetailData = oController._DetailJSonModel.getProperty("/Data"),
		    vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"),
		    vYyyymm = oController._DetailJSonModel.getProperty("/Data/Yyyymm");
		
		var onProcess = function(){
			var oDatas = { Data : { Pernr : oController._DetailJSonModel.getProperty("/Data/Pernr"),
									Encid : oController._DetailJSonModel.getProperty("/Data/Encid"),
									Yyyymm : oController._DetailJSonModel.getProperty("/Data/Yyyymm"),
									Auth : oController._DetailJSonModel.getProperty("/Data/Auth"),
									ZappStatAl : oController._DetailJSonModel.getProperty("/Data/ZappStatAl"), 
			}};
			
			var errData = {};
		
			var oModel = sap.ui.getCore().getModel("ZHR_LUNCH_CARD_SRV");
			oModel.read("/LunchFeeMonthSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
					new sap.ui.model.Filter('Yyyymm', sap.ui.model.FilterOperator.EQ, vYyyymm.replace(/[^\d]/g, '').substring(0, 6)),
				],
				success : function(data, res) {
					if(data.results && data.results.length > 0){
						oDatas.Data.Wordy = data.results[0].Wordy;
						oDatas.Data.Absdy = data.results[0].Absdy;
						oDatas.Data.Abrdy = data.results[0].Abrdy;
						oDatas.Data.Edudy = data.results[0].Edudy;
						oDatas.Data.Trady = data.results[0].Trady;
						oDatas.Data.Etcdy = data.results[0].Etcdy;
						oDatas.Data.Totdy = data.results[0].Totdy;
						oDatas.Data.Actdy = data.results[0].Actdy;
						oDatas.Data.Btrdy = data.results[0].Btrdy;
						
						oDatas.Data.Lbet01 = common.Common.numberWithCommas(data.results[0].Lbet01);
						oDatas.Data.Lbet02 = common.Common.numberWithCommas(data.results[0].Lbet02);
						oDatas.Data.Lbet03 = common.Common.numberWithCommas(data.results[0].Lbet03);
						oDatas.Data.Lbet04 = common.Common.numberWithCommas(data.results[0].Lbet04);
						oDatas.Data.Lbet05 = common.Common.numberWithCommas(data.results[0].Lbet05);
						oDatas.Data.Lbet06 = common.Common.numberWithCommas(data.results[0].Lbet06);
						oDatas.Data.Lbet07 = common.Common.numberWithCommas(data.results[0].Lbet07);
						oDatas.Data.Lbet08 = common.Common.numberWithCommas(data.results[0].Lbet08);
						oDatas.Data.Lbet09 = common.Common.numberWithCommas(data.results[0].Lbet09);
						oDatas.Data.Lbet10 = common.Common.numberWithCommas(data.results[0].Lbet10);
					}
					
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			oController.BusyDialog.close();
		
			oController._DetailJSonModel.setData(oDatas);
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage);
				return ;
			}
		}
		
		oController.BusyDialog.open();
		setTimeout(onProcess, 100);
	}, 
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_LunchHistory.ZUI5_HR_LunchHistoryDetail");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var oJSONModel = oTable.getModel();
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
	
		var curDate = new Date();
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: oBundleText.getText("LABEL_2153") + "-" + dateFormat.format(curDate) + ".xlsx"	// 2153:중식비 사용내역 조회
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
		
	},

});