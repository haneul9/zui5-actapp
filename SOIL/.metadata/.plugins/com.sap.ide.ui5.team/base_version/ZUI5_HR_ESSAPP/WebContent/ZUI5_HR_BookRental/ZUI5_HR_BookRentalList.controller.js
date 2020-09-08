//jQuery.sap.require("control.BusyIndicator");
//jQuery.sap.require("control.ZNKBusyAccessor");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_BookRental.ZUI5_HR_BookRentalList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_BookRental.ZUI5_HR_BookRentalList
	 */

	PAGEID : "ZUI5_HR_BookRentalList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_DialogJsonModel : new sap.ui.model.json.JSONModel(), 
	_vPersa : "" ,
	_vClsdt : "",
	_vPayym : "",
	_vPernr : "" , // �α��� ��� 
	_vEnamefg : "",
	_oControl  : null,
	_DetailInfoDialog : null,
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	onInit : function() {

//		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
//		};
			
		var oController = this;

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
		var oController = this ;

		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth()-1 , curDate.getDate()+1);
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		if(vEmpLoginInfo.length > 0){
			oController._vPernr = vEmpLoginInfo[0].Pernr ;
			oController._vPersa = vEmpLoginInfo[0].Persa;
		}
		
		var vEname = "";
		var vPernr = "";
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1){
			if(_gAuth == "E"){
				if(vEmpLoginInfo.length > 0){
					var OneData = {};
					// �����
					vEname = vEmpLoginInfo[0].Ename ;
					vPernr = vEmpLoginInfo[0].Pernr ;
				}
				var oDate = new Date();
				var oModel = sap.ui.getCore().getModel("ZHR_BOOK_SRV");				
				var JSonData = { Data : { selectedKey: "A" , YearFr: "", YearTo:"",selectKeyStatus:"A", StatusText1:0 ,StatusText2:0 ,StatusText3:0 , Pernr : vPernr, Ename : vEname }};
				JSonData.Data.YearFr = oDate.getFullYear() - 1;
				JSonData.Data.YearTo = oDate.getFullYear();
				oController._ListCondJSonModel.setData(JSonData);
			}else{
				var JSonData = { Data : { Apbeg : dateFormat.format(prevDate) , Apend : dateFormat.format(curDate) , Pernr : "", Ename : "" , Payym :""}};
				oController._ListCondJSonModel.setData(JSonData);
			}
			oController.onInitControl(oController);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
		
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
		
		this.onPressSearch();
		
	},
	
	onInitControl : function(oController, _vZappStatAl ){
		var vData = oController._ListCondJSonModel.getProperty("/Data");
	},
	
	openZappUrl: function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRental.ZUI5_HR_BookRentalList");
		var oController = oView.getController();		
		var oPath = "/BookRentalListSet";
		var sPath = oEvent.getSource().getBindingContext().sPath;
		var oData = oController._ListJSonModel.getProperty(sPath);		
		var vErrorMessage = "";
		
		var onProcess = function(){
			var oModel = sap.ui.getCore().getModel("ZHR_BOOK_SRV");
			oData = common.Common.copyByMetadata(oModel, "BookRentalList", oData);
			oModel.create(
					oPath,
					oData,
					null,
					function(data,res){
						if(data) {
							
						} 
					},
					function (oError) {
				    	var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) vErrorMessage = Err.error.innererror.errordetails[0].message;
							else vErrorMessage = Err.error.message.value;
						} else {
							vErrorMessage = oError.toString();
						}
				}
			);
			
			if(vErrorMessage != ""){
				oController.BusyDialog.close();
				new control.ZNK_SapBusy.oErrorMessage(vErrorMessage);
				return ;
			}		
			
			oController.BusyDialog.close();
			oController.onPressSearch();
			oModel.refresh();
			sap.m.MessageBox.success(oBundleText.getText("LABEL_2556"), {	// 2556:요청하신 대출연장이 완료 되었습니다.
				title : oBundleText.getText("LABEL_0395")	// 395:확인
			});			
		};		
		
		
		var CreateProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		}			
		
		sap.m.MessageBox.confirm(oBundleText.getText("LABEL_2459"), {	// 2459:도서 대출 연장 하시겠습니까?
			title : oBundleText.getText("LABEL_0395"),	// 395:확인
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});			
	},
	
	
	onSelectRow : function(oEvent){
	},

	onPressRow : function(oEvent){
		
	},
	
	onBack : function(oEvent){
	},

	
	onPressSearch1 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRental.ZUI5_HR_BookRentalList");
		var oController = oView.getController();		
		var oModel = sap.ui.getCore().getModel("ZHR_BOOK_SRV");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var SerchCond = oController._ListCondJSonModel.getProperty("/Data");
		
		var oFilter = [
			new sap.ui.model.Filter("YearFr","EQ",SerchCond.YearFr),
			new sap.ui.model.Filter("YearTo","EQ",SerchCond.YearTo),
			new sap.ui.model.Filter("Zbstatus","EQ",SerchCond.selectKeyStatus)		
		]
		
		function Search(){
			oModel.read("/BookRentalListSet",{
				filters: oFilter,
				async: false,
				success: function(data,res){
					
				},
				error: function(Res){
					
				}
			});
			oController.BusyDialog.close();
			oTable.bindRows("ZHR_BOOK_SRV>/BookRentalListSet");	
		};
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);		
	},
	
	onPressSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRental.ZUI5_HR_BookRentalList");
		var oController = oView.getController();		
		var oModel = sap.ui.getCore().getModel("ZHR_BOOK_SRV");
		var SerchCond = oController._ListCondJSonModel.getProperty("/Data");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oColumns = oTable.getColumns();
		
		// 테이블 sort, filter 제거
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		if(SerchCond.YearFr > SerchCond.YearTo ){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2589"),{	// 2589:조회 시작년도가 조회 종료년도보다 큽니다.
				title : oBundleText.getText("LABEL_0395"),	// 395:확인
				actions : [sap.m.MessageBox.Action.CLOSE]				
			});
			return;
		}
		
		var oFilter = [];
		
		if(SerchCond.YearFr) oFilter.push(new sap.ui.model.Filter("YearFr","EQ",SerchCond.YearFr));
		if(SerchCond.YearTo) oFilter.push(new sap.ui.model.Filter("YearTo","EQ",SerchCond.YearTo));
		if(SerchCond.selectKeyStatus) oFilter.push(new sap.ui.model.Filter("Zbstatus","EQ",SerchCond.selectKeyStatus));
		
		oTable.getBinding("rows").filter(oFilter).attachChange(function(){
//			console.log("AAA");
		}, this);
		
//		console.log(oTable.getModel().getData());
		
		oModel.read("/BookRentalStatusListSet",{
			filters: oFilter,
			async: false,
			success: function(data,res){
				if(data && data.results.length){
					for(var i=0;i<data.results.length;i++){
						SerchCond.StatusText1 = data.results[i].Count1;
						SerchCond.StatusText2 = data.results[i].Count2;
						SerchCond.StatusText3 = data.results[i].Count3;
						break;
					}
				}
			},
			error: function(Res){
				
			}			
		});
		
		oController._ListCondJSonModel.refresh();
		
		function Search() {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy.MM.dd"}),
				Datas = {Data : []},
				OneData = {},
				vIdx = 1;
			
			oModel.read("/BookRentalListSet", {
				async: false,
				filters: oFilter,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0;i<data.results.length;i++) {
							OneData = data.results[i];
							
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
		
//		var vLength = oController._ListJSonModel.getProperty("/Data").length;
//		oTable.setVisibleRowCount(vLength > 15 ? 15 : vLength);
	},
		
	
	onESSClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRental.ZUI5_HR_BookRentalList");
		var oController = oView.getController();
		oController._ListCondJSonModel.setProperty("/Data/Pernr", "");
		oController._ListCondJSonModel.setProperty("/Data/Ename", "");
		oController._AddPersonDialog.close();
	},
	

	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRental.ZUI5_HR_BookRentalList");
		var oController = oView.getController();
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRental.ZUI5_HR_BookRentalList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oJSONModel = oTable.getModel();
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
	
		var vData = { Data : [] };
		
		
		var curDate = new Date();
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: oBundleText.getText("LABEL_1618") + "-" + dateFormat.format(curDate) + ".xlsx"	// 1618:나의 대출 현황
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
		oSpreadsheet.build();
	}

});