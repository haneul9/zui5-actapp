jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");

sap.ui.controller("ZUI5_HR_DCMoneyDue.ZUI5_HR_DCMoneyDueList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_DCMoneyDue.ZUI5_HR_DCMoneyDueList
	 */

	PAGEID : "ZUI5_HR_DCMoneyDueList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_Columns : "",
	_vPersa : "" ,
	
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	
	_vAppno : "",
	_vZworktyp : "",
	
	_vEnamefg : "",
	_oControl : null,
	
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
			JSonData,
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
			curDate = new Date(),
			prevDate = new Date(curDate.getFullYear(), 0, 1);
		
		if(!oController._ListCondJSonModel.getProperty("/Data")) {
			JSonData = {Data : {Begym : dateFormat.format(prevDate), Endym : dateFormat.format(curDate)}};
			oController._ListCondJSonModel.setData(JSonData);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
		this.onPressSearch();
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
	
	callUrl : function(oController, rowObject) {
		var oModel = sap.ui.getCore().getModel("ZHR_PAYSLIP_SRV");
		
		oModel.read("/DcMoneyDueListSet", {
			filters : [
				new sap.ui.model.Filter('Dueym', sap.ui.model.FilterOperator.EQ, rowObject.Dueym),
				new sap.ui.model.Filter('Retgb', sap.ui.model.FilterOperator.EQ, rowObject.Retgb),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "P")
			],
			success : function(data,res){
				if(data && data.results.length){
					vUrl = data.results[0].Url;
					
					if(vUrl && vUrl != "") window.open(vUrl);
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				oController.Error = errData.Error;
				oController.ErrorMessage = errData.ErrorMessage;
			}
		});
		
		if(oController.Error == "E") {
			oController.Error = "";
			sap.m.MessageBox.show(oController.ErrorMessage);
		}
	},
	
	onSelectRow : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DCMoneyDue.ZUI5_HR_DCMoneyDueList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID+"_Table"),
			vContext = oEvent.getParameters().rowBindingContext,
			rowObject = null;
		
		if(common.Common.isNull(vContext) || oController._ListJSonModel.getProperty(vContext.sPath) == null) {
			return;
		}
		
		rowObject = oController._ListJSonModel.getProperty(vContext.sPath);
		
		var vCalda = moment(rowObject.Calda.split(".").join("-")),
			vStdDate = moment("2020-01-01");
	
		if(vCalda.isSameOrAfter(vStdDate)) oController.callUrl(oController, rowObject);
	},
	
	onPressRow : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DCMoneyDue.ZUI5_HR_DCMoneyDueList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			vIdx = oEvent.getSource().getCustomData()[0].getValue(),
			_selPath = oTable.getContextByIndex(Number(vIdx-1)).sPath,
			rowObject = oController._ListJSonModel.getProperty(_selPath),
			vCalda = moment(rowObject.Calda.split(".").join("-")),
			vStdDate = moment("2020-01-01"),
			vUrl = null;
		
		if(vCalda.isSameOrAfter(vStdDate)) oController.callUrl(oController, rowObject);
	},
	
	// 리스트 조회
	onPressSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DCMoneyDue.ZUI5_HR_DCMoneyDueList"),
			oController = oView.getController(),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"}),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oModel = sap.ui.getCore().getModel("ZHR_PAYSLIP_SRV"),
			SerchCond = oController._ListCondJSonModel.getProperty("/Data"),
			aFilters = [],
			Datas = {Data : []};
		
		// 테이블 sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++) {
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		if(SerchCond.Begym != "" && SerchCond.Endym != "") {
			if(common.Common.checkDate(SerchCond.Begym, SerchCond.Endym) == false) {
				return ;
			}
		}
		
		function Search() {
			oModel.read("/DcMoneyDueListSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Begym', sap.ui.model.FilterOperator.EQ, SerchCond.Begym.replace(/[^\d]/g, '').substring(0, 6)),
					new sap.ui.model.Filter('Endym', sap.ui.model.FilterOperator.EQ, SerchCond.Endym.replace(/[^\d]/g, '').substring(0, 6)),
					new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, "L")
				],
				success : function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							var OneData = data.results[i];
							OneData.Idx = i + 1;
							OneData.Calda = dateFormat.format(OneData.Calda);
							OneData.Avamt = common.Common.numberWithCommas(OneData.Avamt);
							OneData.ChamtDc = common.Common.numberWithCommas(OneData.ChamtDc);
							OneData.ReamtLas = common.Common.numberWithCommas(OneData.ReamtLas);
							
							Datas.Data.push(OneData);
						}
					}
				},
				error : function(Res) {
					var errData = common.Common.parseError(Res);
					oController.Error = errData.Error;
					oController.ErrorMessage = errData.ErrorMessage;
				}
			});
			
			// listdate 필드 convert => 필드id+"Txt" string 필드로
			common.Common.convertDateField(Datas);
			
			oController._ListJSonModel.setData(Datas);
			oTable.setVisibleRowCount(Datas.Data.length > 15 ? 15 : Datas.Data.length);
			
			if(oController.Error == "E") {
				oController.BusyDialog.close();
				oController.Error = "";
				sap.m.MessageBox.show(oController.ErrorMessage);
			}
			
			oTable.bindRows("/Data");
			oController.BusyDialog.close();			
		}
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);				
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DCMoneyDue.ZUI5_HR_DCMoneyDueList"),
			oController = oView.getController();
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DCMoneyDue.ZUI5_HR_DCMoneyDueList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oJSONModel = oTable.getModel(),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"}),
			curDate = new Date();
		
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: oBundleText.getText("LABEL_0851") + "-" + dateFormat.format(curDate) + ".xlsx"	// 851:DC 퇴직연금 불입내역 조회
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
		oSpreadsheet.build();
	}

});
