jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_BookBuy.ZUI5_HR_BookBuyList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_BookBuy.ZUI5_HR_BookBuyList
	 */

	PAGEID : "ZUI5_HR_BookBuyList",
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
		var prevDate = new Date(curDate.getFullYear() -1, curDate.getMonth() , curDate.getDate() + 1);
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
				var oModel = sap.ui.getCore().getModel("ZHR_BOOK_SRV");				
				var JSonData = { Data : { selectedKey: "A" , Begda: dateFormat.format(prevDate), Endda: dateFormat.format(curDate),selectKeyStatus:"A", StatusText1:0 ,StatusText2:0 ,StatusText3:0 , Pernr : vPernr, Ename : vEname }};
				oController._ListCondJSonModel.setData(JSonData);
			}else{
				var JSonData = { Data : { selectedKey: "A" , Begda : dateFormat.format(prevDate) , Endda : dateFormat.format(curDate),selectKeyStatus:"A", StatusText1:0 ,StatusText2:0 ,StatusText3:0 ,}};
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookBuy.ZUI5_HR_BookBuyList");
		var oController = oView.getController();
		var sPath = oEvent.getSource().getParent().getBindingContext().getPath();
		var oData = oController._ListJSonModel.getProperty(sPath);		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		var vRegtm = common.Common.convertTimeToEdmTime(oData.Regtm.ms);
		var oPath = "/BookBuyListSet(Usrid='" +oData.Usrid + 
		                           "',Grcod='" +oData.Grcod + 
		                           "',Regdt=datetime'" + dateFormat.format(new Date(common.Common.setTime(oData.Regdt))) + "T00%3a00%3a00'" +
		                           ",Regtm=time'" + vRegtm + "')";
		var vErrorMessage = "";		
		
		var onProcess = function(){
			var oModel = sap.ui.getCore().getModel("ZHR_BOOK_SRV");
			oModel.remove(
					oPath,
					null,
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
			oModel.refresh();
			sap.m.MessageBox.success(oBundleText.getText("LABEL_2661"), {	// 2661:희망 도서가 신청 취소 되었습니다.
				title : oBundleText.getText("LABEL_0395"),	// 395:확인
				onClose :oController.onPressSearch
			});			
		};				
		
		var DeleteProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		}			
		
		sap.m.MessageBox.confirm(oBundleText.getText("LABEL_2660"), {	// 2660:희망 도서 신청 취소 하시겠습니까?
			title : oBundleText.getText("LABEL_0395"),	// 395:확인
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : DeleteProcess
		});				
	},
	
	
	onSelectRow : function(oEvent){
	},

	onPressRow : function(oEvent){
		
	},
	
	onPressNew : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookBuy.ZUI5_HR_BookBuyList");
		var oController = oView.getController();
		if(!oController._DetailInfoDialog) {
			oController._DetailInfoDialog = sap.ui.jsfragment("ZUI5_HR_BookBuy.fragment.DetailInfoDialog", oController);
			oView.addDependent(oController._DetailInfoDialog);
		}
		
		var vData = { Data : { Zbname : "" , Zbpub : "", Zreas: "", Zbkdi: ""}};
		
		oController._DialogJsonModel.setData(vData);		
		oController._DetailInfoDialog.open();		
	},
	
	onBack : function(oEvent){
	},
	
	onChangeDate : function(oEvent){
		
	},
	
	onSave : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookBuy.ZUI5_HR_BookBuyList");
		var oController = oView.getController();
		var oPath = "/BookBuyListSet";
		var oData = oController._DialogJsonModel.getProperty("/Data");
		var vErrorMessage = "";
		
		if(oData.Zbname == "" || oData.Zbpub == "" || oData.Zreas == "" ){
		   sap.m.MessageBox.error(oBundleText.getText("LABEL_2471"),{	// 2471:모든 필수 입력 필드에 값을 입력하십시오.
			 title : oBundleText.getText("LABEL_0395"),	// 395:확인
				actions : [sap.m.MessageBox.Action.CLOSE]				
			});
			return;			
		}
		
		
		var onProcess = function(){
			var oModel = sap.ui.getCore().getModel("ZHR_BOOK_SRV");
			oModel.create(
					oPath,
					oData,
					null,
					function(data,res){
						if(data) {
							oController._DetailInfoDialog.close();
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
			oModel.refresh();
			sap.m.MessageBox.success(oBundleText.getText("LABEL_2530"), {	// 2530:신청 되었습니다.
				title : oBundleText.getText("LABEL_0395"),	// 395:확인
				onClose : oController.onPressSearch
			});				
		};
		
		var CreateProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};				
		
		sap.m.MessageBox.confirm(oBundleText.getText("LABEL_2422"), {	// 2422:구독 희망도서 신청 하시겠습니까?
			title : oBundleText.getText("LABEL_0395"),	// 395:확인
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});				
	},

	
	onPressSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookBuy.ZUI5_HR_BookBuyList");
		var oController = oView.getController();		
		var oModel = sap.ui.getCore().getModel("ZHR_BOOK_SRV");
		var SerchCond = oController._ListCondJSonModel.getProperty("/Data");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		
		if(SerchCond.Begda > SerchCond.Endda ){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2590"),{	// 2590:조회 시작일이 조회 종료일보다 큽니다.
				title : oBundleText.getText("LABEL_0395"),	// 395:확인
				actions : [sap.m.MessageBox.Action.CLOSE]				
			});
			return;
		}else if(SerchCond.Begda == "" && SerchCond.Endda == ""){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_2588"),{	// 2588:조회 시작 종료일을 입력하세요.
				title : oBundleText.getText("LABEL_0395"),	// 395:확인
				actions : [sap.m.MessageBox.Action.CLOSE]				
			});
			return;			
		}
		
		var oFilter = [
			new sap.ui.model.Filter("Begda","EQ",SerchCond.Begda),
			new sap.ui.model.Filter("Endda","EQ",SerchCond.Endda),
			new sap.ui.model.Filter("Zstat","EQ",SerchCond.selectKeyStatus)		
		]
		
		function Search() {
			var Datas = { Data : []};
			var errData = {};
			oModel.read("/BookBuyListSet", {
				async : false,
				filters : oFilter,
				success : function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							var OneData = data.results[i];
							Datas.Data.push(OneData);
						}
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			// listdate 필드 convert => 필드id+"Txt" string 필드로
			common.Common.convertDateField(Datas);
			
			oController._ListJSonModel.setData(Datas);
			oTable.setVisibleRowCount(Datas.Data.length > 15 ? 15 : Datas.Data.length);
			oController._ListCondJSonModel.refresh();
			
			if(errData.Error == "E") {
				oController.BusyDialog.close();
				sap.m.MessageBox.show(errData.ErrorMessage);
			}
			oController.BusyDialog.close();			
		}
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);
		
		
//		oTable.bindRows("ZHR_BOOK_SRV>/BookBuyListSet");	
//		oTable.getBinding("rows").filter(oFilter);

	},
	
	
	onESSClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookBuy.ZUI5_HR_BookBuyList");
		var oController = oView.getController();
		oController._ListCondJSonModel.setProperty("/Data/Pernr", "");
		oController._ListCondJSonModel.setProperty("/Data/Ename", "");
		oController._AddPersonDialog.close();
	},
	

	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookBuy.ZUI5_HR_BookBuyList");
		var oController = oView.getController();
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookBuy.ZUI5_HR_BookBuyList");
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
			    fileName: oBundleText.getText("LABEL_1533") + "-" + dateFormat.format(curDate) + ".xlsx"	// 1533:구독희망도서
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
		oSpreadsheet.build();
	}

});