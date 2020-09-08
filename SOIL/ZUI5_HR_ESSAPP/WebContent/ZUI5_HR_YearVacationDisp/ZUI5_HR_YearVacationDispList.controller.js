jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_YearVacationDisp.ZUI5_HR_YearVacationDispList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_YearVacationDisp.ZUI5_HR_YearVacationDispList
	 */

	PAGEID : "ZUI5_HR_YearVacationDispList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_Columns : "",
	_vPersa : "" ,
	_vClsdt : "",
	_vZpayym : "",
	_vAppno : "",
	_IsManager : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	_vZworktyp : '',
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
		var curDate = new Date(),
			curYear = curDate.getFullYear(),
			oController = this,
			detailData = {Data : {}};
		
		// _DetailJSonModel 초기화
		detailData.Data.Auth = _gAuth;
		detailData.Data.ZappStatAl = "";
		oController._DetailJSonModel.setData(detailData);
		
		// 대상자 조회
		common.TargetUser.oController = oController;
		common.TargetUser.onSetTarget(oController);
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", "");
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1) {			
			
			var JSonData = { Data : { Zyear : curYear} };
			oController._ListCondJSonModel.setData(JSonData);
			
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
	
	// 리스트 조회
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_YearVacationDisp.ZUI5_HR_YearVacationDispList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			vAppnr = oController._TargetJSonModel.getProperty("/Data/Encid");

		// 테이블 sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++) {
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var aFilters = [],
			SerchCond = oController._ListCondJSonModel.getProperty("/Data");
		
		aFilters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth));
		if(SerchCond.Zyear != "") {
			aFilters.push(new sap.ui.model.Filter('Zyear', sap.ui.model.FilterOperator.EQ, SerchCond.Zyear));
		}
		if(vAppnr != "") {
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vAppnr));
		}
		
		function Search() {
			oModel.read("/MyVacationListSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						var OneData = data.results[0];
						
						oController._DetailJSonModel.setData({Data : OneData});
					}
				},
				error: function(Res) {
					var errData = common.Common.parseError(Res);
					oController.Error = errData.Error;
					oController.ErrorMessage = errData.ErrorMessage;
				}
			});
			
			var Datas = oController._ListJSonModel.getData();
			Datas.Data = [];
			
			oModel.read("/MemberVacationDetailSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						data.results.forEach(function(elem, index, array) {
							elem.Idx = index + 1;
							
							Datas.Data.push(elem);
						});
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
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
				vTotalCount = Datas.Data.length;
			
			oTable.setVisibleRowCount(vTotalCount > 10 ? 10 : vTotalCount);
			
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
	
	SmartSizing : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_YearVacationDisp.ZUI5_HR_YearVacationDispList");
		var oController = oView.getController();
	},
	
	onAfterSelectPernr : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_YearVacationDisp.ZUI5_HR_YearVacationDispList"),
			oController = oView.getController();
		
		// 검색 초기화
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", "");
		oController._DetailJSonModel.setData({Data : {Auth : _gAuth, ZappStatAl : ""}});
		oController._ListJSonModel.setData({Data : []});
	},
	
	onExport : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_YearVacationDisp.ZUI5_HR_YearVacationDispList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oJSONModelData = oTable.getModel().getProperty("/Data");
		
		if(oJSONModelData.length < 1) return;
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		
		var curDate = new Date();
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModelData,
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
				fileName: oBundleText.getText("LABEL_0920") + "-" + dateFormat.format(curDate) + ".xlsx"	// 920:휴가사용조회
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	}
});