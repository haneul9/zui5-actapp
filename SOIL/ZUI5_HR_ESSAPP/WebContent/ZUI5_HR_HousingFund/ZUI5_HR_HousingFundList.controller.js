jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");

sap.ui.controller("ZUI5_HR_HousingFund.ZUI5_HR_HousingFundList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_HousingFund.ZUI5_HR_HousingFundList
	 */

	PAGEID : "ZUI5_HR_HousingFundList",
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

		//if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		//};

		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow : jQuery.proxy(function(evt) {
				this.onAfterShow(evt);
			}, this)
		});

		var bus = sap.ui.getCore().getEventBus();
		bus.subscribe("app", "OpenWindow", this.SmartSizing, this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing, this);
	},
	
	onAfterRendering : function(){
	},


	onBeforeShow : function(oEvent) {
		var oController = this ;
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
		this.onPressSearch();		
	},
	
	// 리스트 조회
	onPressSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingFund.ZUI5_HR_HousingFundList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		
		// 테이블 sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++) {
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var Datas = {Data : []};
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		var oModel = sap.ui.getCore().getModel("ZHR_LIFE_LOAN_SRV");
		
		function Search() {
			oModel.read("/PernrHousingFundLoanSet", {
				async : false,
				success : function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							var OneData = data.results[i];
							OneData.Idx = i + 1;
							OneData.Paper = OneData.Paper == "000000" ? "" :  OneData.Paper.substring(0,4) + "." + OneData.Paper.substring(4,6) ; 
							OneData.Apamt = common.Common.numberWithCommas(OneData.Apamt);
							OneData.LnamtCpn = common.Common.numberWithCommas(OneData.LnamtCpn);
							OneData.LnamtFun = common.Common.numberWithCommas(OneData.LnamtFun);
							OneData.LnamtBnk = common.Common.numberWithCommas(OneData.LnamtBnk);
							OneData.RpamtCpn = common.Common.numberWithCommas(OneData.RpamtCpn);
							OneData.RpamtFun = common.Common.numberWithCommas(OneData.RpamtFun);
							OneData.RpamtBnk2 = common.Common.numberWithCommas(OneData.RpamtBnk2);
							OneData.InamtCpn = common.Common.numberWithCommas(OneData.InamtCpn);
							OneData.InamtFun = common.Common.numberWithCommas(OneData.InamtFun);
							OneData.InamtBnk3 = common.Common.numberWithCommas(OneData.InamtBnk3);
							OneData.InamtBnk5 = common.Common.numberWithCommas(OneData.InamtBnk5);			
							OneData.LnrteAcp = OneData.LnrteAcp + "%";
							OneData.InamtAcp = common.Common.numberWithCommas(OneData.InamtAcp);		
							OneData.AfamtCpn = common.Common.numberWithCommas(OneData.AfamtCpn);	
							OneData.AfamtFun = common.Common.numberWithCommas(OneData.AfamtFun);	
							OneData.AfamtBnk = common.Common.numberWithCommas(OneData.AfamtBnk);	
							OneData.AfamtSum = common.Common.numberWithCommas(OneData.AfamtSum);
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingFund.ZUI5_HR_HousingFundList");
		var oController = oView.getController();
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HousingFund.ZUI5_HR_HousingFundList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oJSONModel = oTable.getModel();
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
	
		var curDate = new Date();
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: oBundleText.getText("LABEL_1463") + "-" + dateFormat.format(curDate) + ".xlsx"	// 1463:개인별 주택자금 조회
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
		oSpreadsheet.build();
	}

});
