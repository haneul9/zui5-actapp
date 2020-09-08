jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_TaxDataInquiry.ZUI5_HR_TaxDataInquiryList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_TaxDataInquiry.ZUI5_HR_TaxDataInquiryList
	 */

	PAGEID : "ZUI5_HR_TaxDataInquiryList",
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
			
			var JSonData = { Data : { Datum : "", Zyear : String(curDate.getFullYear()), Gubun : "", Abkrs : "",  Pycno : "", Datum : "", Zzwork : "" }};
			oController._ListCondJSonModel.setData(JSonData);
		}
	},

	onAfterShow : function(oEvent) {
		var oController = this,
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		
		this.SmartSizing(oEvent);
		
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
	
	onChangeCondition : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_TaxDataInquiry.ZUI5_HR_TaxDataInquiryList"),
		oController = oView.getController();
		oController.onSearchPayType(oController); // 급상여 List Setting
		oController.onSearchRetirePay(oController); // 퇴직급여 List Setting
		
	},
	
	onChangeCondition2 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_TaxDataInquiry.ZUI5_HR_TaxDataInquiryList"),
		oController = oView.getController();
		oController.onSearchRetirePay(oController); // 퇴직급여 List Setting
		
	},
	
	onSearchPayType : function(oController) {
		var oPayType = sap.ui.getCore().byId(oController.PAGEID + "_PayType");
		oPayType.destroyItems();
		oController._ListCondJSonModel.setProperty("/Data/Pycno","");
		
		var vFilter = oController._ListCondJSonModel.getProperty("/Data");
		
		if(common.Common.checkNull(vFilter.Abkrs) || common.Common.checkNull(vFilter.Zyear)) {
			return ;
		}
		oModel = sap.ui.getCore().getModel("ZHR_PAYSLIP_SRV");
		
		var aFilters = [];
		aFilters.push(new sap.ui.model.Filter('Abkrs', sap.ui.model.FilterOperator.EQ, vFilter.Abkrs));
		aFilters.push(new sap.ui.model.Filter('Zyear', sap.ui.model.FilterOperator.EQ, vFilter.Zyear));
		
		oModel.read("/PycnoCodeListSet", {
			async: false,
			filters: aFilters,
			success: function(data,res) {
				if(data && data.results.length) {
					for(var i=0;i<data.results.length;i++) {
						oPayType.addItem(new sap.ui.core.Item({key : data.results[i].Pycno, text : data.results[i].Pyctx }));
					}
				}
			},
			error: function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
	},
	
	onSearchRetirePay : function(oController) {
		var oRetirePay = sap.ui.getCore().byId(oController.PAGEID + "_RetirePay");
		oRetirePay.destroyItems();
		oController._ListCondJSonModel.setProperty("/Data/Datum","");
		
		var vFilter = oController._ListCondJSonModel.getProperty("/Data");
		
		if(common.Common.checkNull(vFilter.Gubun) || common.Common.checkNull(vFilter.Zyear) || common.Common.checkNull(vFilter.Abkrs)) {
			return ;
		}
		var aFilters = [];
		aFilters.push(new sap.ui.model.Filter('Gubun', sap.ui.model.FilterOperator.EQ, vFilter.Gubun));
		aFilters.push(new sap.ui.model.Filter('Zyear', sap.ui.model.FilterOperator.EQ, vFilter.Zyear));
		aFilters.push(new sap.ui.model.Filter('Abkrs', sap.ui.model.FilterOperator.EQ, vFilter.Abkrs));
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy.MM.dd"}),
		    dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"}),
		    oModel = sap.ui.getCore().getModel("ZHR_PAYSLIP_SRV");
		
		oModel.read("/RetirePaydtListSet", {
			async: false,
			filters: aFilters,
			success: function(data,res) {
				if(data && data.results.length) {
					for(var i=0;i<data.results.length;i++) {
						vTemp = {};
						Object.assign(vTemp, data.results[i]);
//						oRetirePay.addItem(new sap.ui.core.Item({key : dateFormat.format(new Date(common.Common.setTime(data.results[i].Datum))),  
//																 text : dateFormat.format(new Date(common.Common.setTime(vTemp.Datum)))}));
						oRetirePay.addItem(new sap.ui.core.Item({key : data.results[i].Datum,  
							 text : dateFormat.format(new Date(common.Common.setTime(vTemp.Datum)))}));
					}
				}
			},
			error: function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
	},
	
	
	// 리스트 조회
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_TaxDataInquiry.ZUI5_HR_TaxDataInquiryList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_PAYSLIP_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			aFilters = [], 	aHeaderFilters = [],
			SerchCond = oController._ListCondJSonModel.getProperty("/Data"),
			errData = {},
			oColumns = oTable.getColumns();
		
		if(SerchCond.Zyear != "") {
			aFilters.push(new sap.ui.model.Filter('Zyear', sap.ui.model.FilterOperator.EQ, SerchCond.Zyear));
		}
		if(SerchCond.Gubun != "") {
			aFilters.push(new sap.ui.model.Filter('Gubun', sap.ui.model.FilterOperator.EQ, SerchCond.Gubun));
		}
		if(SerchCond.Abkrs != "") {
			aFilters.push(new sap.ui.model.Filter('Abkrs', sap.ui.model.FilterOperator.EQ, SerchCond.Abkrs));
		}
		if(SerchCond.Pycno != "" && SerchCond.Pycno != "0000000000") {
			aHeaderFilters.push(new sap.ui.model.Filter('Pycno', sap.ui.model.FilterOperator.EQ, SerchCond.Pycno));
			aFilters.push(new sap.ui.model.Filter('Pycno', sap.ui.model.FilterOperator.EQ, SerchCond.Pycno));
		}
		if(SerchCond.Datum != "") {
			aHeaderFilters.push(new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, SerchCond.Datum));
			aFilters.push(new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, SerchCond.Datum));
		}
		if(SerchCond.Zzwork != "" && SerchCond.Zzwork != "A") {
			aFilters.push(new sap.ui.model.Filter('Zzwork', sap.ui.model.FilterOperator.EQ, SerchCond.Zzwork));
		}
		
		if(SerchCond.Datum != "" && (SerchCond.Pycno != "" && SerchCond.Pycno != "0000000000") ){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2440"), {});	// 2440:급여계산번호와 퇴직급여일 중 하나만 조회조건으로 선택하여 주십시오.
			return ;
		}
		
		if(SerchCond.Datum == "" && (SerchCond.Pycno == "" || SerchCond.Pycno == "0000000000") ){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2439"), {});	// 2439:급여계산번호와 퇴직급여일 중 하나는 필수로 선택하여 주십시오.
			return ;
		}
		oTable.destroyColumns();

		function Search() {
			
			
			oController._Columns = [],
			vTemp = [];
			
			oModel.read("/TaxDataHeaderSet", {
				async: false,
				filters: aHeaderFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0;i<data.results.length;i++) {
							var oColumn = new sap.ui.table.Column(oController.PAGEID + "_Column_" + i,{
								hAlign : "Center",
								flexible : false,
					        	autoResizable : true,
					        	resizable : true,
								showFilterMenuEntry : false,
								width : i == 0 || i == 2 ? "60px" : "120px"	// No, 인원 필드는 60px
							});	
							oColumn.addMultiLabel(new sap.ui.commons.TextView({text : data.results[i].Fldtx, textAlign : "Center", width : "100%"}).addStyleClass("FontFamilyBold"));
							
							if(i >= 0 && i <= 2){
								oColumn.setTemplate(new sap.ui.commons.TextView({
									text : "{" + data.results[i].Field + "}", 
									textAlign : "Center"
								}).addStyleClass("FontFamily"));
							}else{
								oColumn.setTemplate(new sap.ui.commons.TextView({
									text : {path : data.results[i].Field,
										formatter : function(x){
											 if(x == null || x == "") return "";
											 return (x*1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
										}
									},
									textAlign : "End"
								}).addStyleClass("FontFamily"));
							}
							if(i >= 0 && i <= 1){
								vTemp.push({id: data.results[i].Field, label : data.results[i].Fldtx, type : "string", Total : 0});
							}else{
								vTemp.push({id: data.results[i].Field, label : data.results[i].Fldtx, type : "number", Total : 0});
							}
							oTable.addColumn(oColumn);
							
						}
					}
				},
				error: function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error == "E") {
				oController.BusyDialog.close();
				sap.m.MessageBox.show(errData.ErrorMessage, {});
				return;
			}
			
			oController._Columns = vTemp;
			
			var vData = { Data : []};
			oModel.read("/TaxDataListSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0;i<data.results.length;i++) {
							vData.Data.push(data.results[i]);
							for(var j=2; j<oController._Columns.length; j++){
								eval("var vTemp = data.results[" + i + "]." + oController._Columns[j].id);
								vTemp = common.Common.removeComma(vTemp) * 1;
								eval("oController._Columns[" + j + "].Total += vTemp");								
							}
						}
					}
				},
				error: function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			// Summary Data 결과 값에 추가
			var summaryData = { Total : "X", Number : "" , Zzworkt : "" , Pcount : "" };
			for(var j=oController._Columns.length - 1; j> 1; j--){
				if(oController._Columns[j].Total == 0 ){
					var oColumn = sap.ui.getCore().byId(oController.PAGEID + "_Column_"+j);
					if(oColumn) oColumn.setVisible(false);
					oController._Columns.splice(j, 1);
				}else{
					eval("summaryData."+ oController._Columns[j].id + "=" + oController._Columns[j].Total + ";" );
				}

			}
			if(vData.Data.length > 0)
				vData.Data.push(summaryData);
			
			// listdate 필드 convert => 필드id+"Txt" string 필드로
			common.Common.convertDateField(vData);
			
			oTable.getModel().setData(vData)
			oTable.setVisibleRowCount(vData.Data.length > 15 ? 15 : vData.Data.length);
			
			if(errData.Error == "E") {
				oController.BusyDialog.close();
				sap.m.MessageBox.alert(errData.ErrorMessage, {});
			}
			oTable.bindRows({ path: "/Data" });
			oController.BusyDialog.close();
		}	
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);
	},
	
	SmartSizing : function(oEvent){

	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_TaxDataInquiry.ZUI5_HR_TaxDataInquiryList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			oJSONModelData = oTable.getModel().getProperty("/Data"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"}),
			curDate = new Date();
		
		if(oJSONModelData.length < 1) return;
		
		oController._Columns = common.Common.convertColumnArrayForExcel(oController._Columns);
		
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