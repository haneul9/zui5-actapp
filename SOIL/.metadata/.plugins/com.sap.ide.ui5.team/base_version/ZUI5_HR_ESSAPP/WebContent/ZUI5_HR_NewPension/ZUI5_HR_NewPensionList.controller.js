jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");

sap.ui.controller("ZUI5_HR_NewPension.ZUI5_HR_NewPensionList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_NewPension.ZUI5_HR_NewPensionList
	 */

	PAGEID : "ZUI5_HR_NewPensionList",
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
			begDate = new Date(2015, 4, 1);
		
		if(!oController._ListCondJSonModel.getProperty("/Data")) {
			JSonData = {Data : {Begym : dateFormat.format(begDate), Endym : dateFormat.format(curDate)}};
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
	
	// 리스트 조회
	onPressSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_NewPension.ZUI5_HR_NewPensionList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oModel = sap.ui.getCore().getModel("ZHR_EXTRA_PAY_SRV"),
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
			oModel.read("/PernrNewPensionSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Begym', sap.ui.model.FilterOperator.EQ, SerchCond.Begym.replace(/[^\d]/g, '').substring(0, 6)),
					new sap.ui.model.Filter('Endym', sap.ui.model.FilterOperator.EQ, SerchCond.Endym.replace(/[^\d]/g, '').substring(0, 6))
				],
				success : function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							var OneData = data.results[i];
							OneData.Idx = i + 1;
							OneData.Zyymm = (OneData.Zyymm == "000000") 
												? "" 
												: (OneData.Zyymm == "999912") 
													? oBundleText.getText("LABEL_0142") 	// 142:합계
													: OneData.Zyymm.substring(0,4) + "." + OneData.Zyymm.substring(4,6);
							
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_NewPension.ZUI5_HR_NewPensionList"),
			oController = oView.getController();
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_NewPension.ZUI5_HR_NewPensionList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oJSONModel = oTable.getModel(),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"}),
			curDate = new Date();
		
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: oBundleText.getText("LABEL_0298") + "-" + dateFormat.format(curDate) + ".xlsx"	// 298:New Pension 내역조회
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
		oSpreadsheet.build();
	}

});
