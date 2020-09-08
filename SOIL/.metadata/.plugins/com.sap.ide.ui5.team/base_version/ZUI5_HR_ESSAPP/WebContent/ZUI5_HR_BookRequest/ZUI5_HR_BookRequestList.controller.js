jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_BookRequest.ZUI5_HR_BookRequestList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_BookRequest.ZUI5_HR_BookRequestList
	 */

	PAGEID : "ZUI5_HR_BookRequestList",
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
		var errData = {};
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1){
			if(_gAuth == "E"){
				if(vEmpLoginInfo.length > 0){
					var OneData = {};
					vEname = vEmpLoginInfo[0].Ename ;
					vPernr = vEmpLoginInfo[0].Pernr ;
				}
			
				var JSonData = { Data : { Bname: "", Author:"", Pub: "", Pernr : vPernr, Ename : vEname , Payym :"", Apbeg : dateFormat.format(prevDate) , Apend : dateFormat.format(curDate)}};
				oController._ListCondJSonModel.setData(JSonData);

			}else{
				var JSonData = { Data : { Apbeg : dateFormat.format(prevDate) , Apend : dateFormat.format(curDate) , Pernr : "", Ename : "" , Payym :""}};
				oController._ListCondJSonModel.setData(JSonData);
			}
		}
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	

	_BkkdDialog : null,
	displayBkkdSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRequest.ZUI5_HR_BookRequestList");
		var oController = oView.getController();
		var oBkdi = sap.ui.getCore().byId(oController.PAGEID + "_Bkdi");
		var vBkdi = oBkdi.getSelectedKey();
		
		if(vBkdi =="" || vBkdi == "A"){
			sap.m.MessageBox.warning(oBundleText.getText("LABEL_2463"), {	// 2463:도서구분을 선택하시기 바랍니다.
				title : oBundleText.getText("LABEL_0053")
			});	
			return ;
		}
		
		if(!oController._BkkdDialog) {
			oController._BkkdDialog = sap.ui.jsfragment("ZUI5_HR_BookRequest.fragment.BkkdDialog", oController);
			oView.addDependent(oController._BkkdDialog);
		}
	
		var oTable = sap.ui.getCore().byId(oController.PAGEID +"_BkkdTable");
		var oModel = oTable.getModel(); 
		oModel.setData({Data : []});
		oTable.setVisibleRowCount(1);
		oTable.clearSelection();
		oController.onSearchBkkd(oController);
		oController._BkkdDialog.open();
	},
	
	// 분류코드 정의
	onSearchBkkd : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRequest.ZUI5_HR_BookRequestList");
		var oController = oView.getController();
		var bkdi = sap.ui.getCore().byId(oController.PAGEID + "_Bkdi").getSelectedKey();
		var vBkkd = sap.ui.getCore().byId(oController.PAGEID + "_DBkkd").getValue();
		var oBkkdTable = sap.ui.getCore().byId(oController.PAGEID + "_BkkdTable");
		
		var oBkkdModel = oBkkdTable.getModel(), 
		    vData = { Data : []},
		    i = 1;
		var oModel = sap.ui.getCore().getModel("ZHR_BOOK_SRV");
		var bkkd = [];
		oModel.read("/BkkdCodeListSet", {
			async : false,
			filters : [ new sap.ui.model.Filter('Zbkdi', sap.ui.model.FilterOperator.EQ, bkdi),
				        new sap.ui.model.Filter('Zbkkt', sap.ui.model.FilterOperator.EQ, vBkkd)],
			success : function(data, res) {
				data.results.forEach(function(element){
					element.Idx = i++;
					vData.Data.push(element);
				});
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		oBkkdModel.setData(vData);
		oBkkdTable.setVisibleRowCount(vData.Data.length > 15 ? 15 : vData.Data.length);
	},
	
	// 분류코드 선택
	onSelectBkkd : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRequest.ZUI5_HR_BookRequestList");
		var oController = oView.getController();
		var oBkkdTable = sap.ui.getCore().byId(oController.PAGEID + "_BkkdTable");
		var oBkkdModel = oBkkdTable.getModel();
		var oBkkd = sap.ui.getCore().byId(oController.PAGEID + "_Bkkd"); 
		var vIDXs = oBkkdTable.getSelectedIndices();
		
		oBkkd.destroyTokens();
		
		vIDXs.forEach(function(element) {
			oBkkd.addToken(new sap.m.Token({
				key : oBkkdModel.getProperty(oBkkdTable.getContextByIndex(element).sPath).Key,
				text : oBkkdModel.getProperty(oBkkdTable.getContextByIndex(element).sPath).Value,
				customData : [new sap.ui.core.CustomData({key : "Zbkdi", value : oBkkdModel.getProperty(oBkkdTable.getContextByIndex(element).sPath).Zbkdi})]
			}))
		});
		
		// 분류 코드 변경으로 상세분류 코드 변경
		oController.onChangeBkkd();
		oController._BkkdDialog.close();
	},

	
	_BkdeDialog : null,
	displayBkdeSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRequest.ZUI5_HR_BookRequestList");
		var oController = oView.getController();
		
		var oBkdi = sap.ui.getCore().byId(oController.PAGEID + "_Bkdi");
		var vBkdi = oBkdi.getSelectedKey();
		
		if(vBkdi =="" || vBkdi == "A"){
			sap.m.MessageBox.warning(oBundleText.getText("LABEL_2463"), {	// 2463:도서구분을 선택하시기 바랍니다.
				title : oBundleText.getText("LABEL_0053")
			});	
			return ;
		}
		
		if(!oController._BkdeDialog) {
			oController._BkdeDialog = sap.ui.jsfragment("ZUI5_HR_BookRequest.fragment.BkdeDialog", oController);
			oView.addDependent(oController._BkdeDialog);
		}
		var oTable = sap.ui.getCore().byId(oController.PAGEID +"_BkdeTable");
		var oModel = oTable.getModel(); 
		oModel.setData({Data : []});
		oTable.setVisibleRowCount(1);
		oTable.clearSelection();
		oController.onSearchBkde(oController);
		oController._BkdeDialog.open();
	},
	
	
	// 세부분류 정의
	onSearchBkde : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRequest.ZUI5_HR_BookRequestList");
		var oController = oView.getController();
		var oBkdi = sap.ui.getCore().byId(oController.PAGEID + "_Bkdi");
		var bkdi = oBkdi.getSelectedKey();
		var oBkkd = sap.ui.getCore().byId(oController.PAGEID + "_Bkkd");
		var vBkkd = oBkkd.getTokens();
		var oBkdeTable = sap.ui.getCore().byId(oController.PAGEID + "_BkdeTable");
		var oBkdeModel = oBkdeTable.getModel(), 
		    vData = { Data : []},
		    i = 1;
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter('Zbkdi', sap.ui.model.FilterOperator.EQ, bkdi));
		
		vBkkd.forEach(function(element){
			oFilters.push(new sap.ui.model.Filter('Zbkkd', sap.ui.model.FilterOperator.EQ, element.getKey()))
		});
		
		
		var oModel = sap.ui.getCore().getModel("ZHR_BOOK_SRV");
		oModel.read("/BkdeCodeListSet", {
			async : false,
			filters : [ oFilters ],
			success : function(data, res) {
				data.results.forEach(function(element){
					element.Idx = i++;
					vData.Data.push(element);
				});
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		oBkdeModel.setData(vData);
		oBkdeTable.setVisibleRowCount(vData.Data.length > 15 ? 15 : vData.Data.length);
	},
	
	onSelectBkde : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRequest.ZUI5_HR_BookRequestList");
		var oController = oView.getController();
		
		var oBkdeTable = sap.ui.getCore().byId(oController.PAGEID + "_BkdeTable");
		var oBkdeModel = oBkdeTable.getModel();
		var oBkde = sap.ui.getCore().byId(oController.PAGEID + "_Bkde"); 
		var vIDXs = oBkdeTable.getSelectedIndices();
		
		oBkde.destroyTokens();
		
		vIDXs.forEach(function(element) {
			oBkde.addToken(new sap.m.Token({
				key : oBkdeModel.getProperty(oBkdeTable.getContextByIndex(element).sPath).Key,
				text : oBkdeModel.getProperty(oBkdeTable.getContextByIndex(element).sPath).Value,
				customData : [new sap.ui.core.CustomData({key : "Zbkkd", value : oBkdeModel.getProperty(oBkdeTable.getContextByIndex(element).sPath).Zbkkd})]
			}))
		});
		
		oController._BkdeDialog.close();
	},
	
	onChangeBkdi : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRequest.ZUI5_HR_BookRequestList");
		var oController = oView.getController();
		var bkdi = sap.ui.getCore().byId(oController.PAGEID + "_Bkdi").getSelectedKey();
		var oBkkd = sap.ui.getCore().byId(oController.PAGEID + "_Bkkd");
		var oBkde = sap.ui.getCore().byId(oController.PAGEID + "_Bkde");
		var vBkkd = oBkkd.getTokens();
		
		if(bkdi == "A"){
			oBkkd.destroyTokens();
			oBkde.destroyTokens();
		}else{
			for(var i = vBkkd.length - 1; i >=  0 ; i--){
				var vBkdi = vBkkd[i].getCustomData()[0].getValue();
				if(vBkdi != bkdi){
					oBkkd.removeToken(i);
				}
			}
		}
		//분류 코드 변경으로 상세 분류코드 변경
		oController.onChangeBkkd();
	},
	
	onChangeBkkd :function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRequest.ZUI5_HR_BookRequestList");
		var oController = oView.getController();
		var oBkkd = sap.ui.getCore().byId(oController.PAGEID + "_Bkkd");
		var bkkd = oBkkd.getTokens();
		var oBkde = sap.ui.getCore().byId(oController.PAGEID + "_Bkde"); 
		var vBkde = oBkde.getTokens();
		
		for(var i=vBkde.length -1 ; i>=0; i--){
			var vBkkd = vBkde[i].getCustomData()[0].getValue();
			var vTemp = "";
			for(var j=0; j<bkkd.length;j++){
				if(vBkkd == bkkd[j].getKey()){
					vTemp = "X";
					break;
				}
			}
			if(vTemp == "") oBkde.removeToken(i);
		}
	},
	
	handleSelectionChange_bkkd: function(oEvent){
		var changedItem = oEvent.getParameter("changedItem");
		var isSelected = oEvent.getParameter("selected");
		var keys = oEvent.getSource().getKeys();

		if(changedItem.getProperty("key") == "A"){
			if(isSelected){
				sap.ui.getCore().byId("ZUI5_HR_BookRequestList_Bkkd").setSelectedKeys([]);
				sap.ui.getCore().byId("ZUI5_HR_BookRequestList_Bkkd").setSelectedKeys(keys);
			}else{
				sap.ui.getCore().byId("ZUI5_HR_BookRequestList_Bkkd").setSelectedKeys([]);	
			}

		}else{
			keys = sap.ui.getCore().byId("ZUI5_HR_BookRequestList_Bkkd").getSelectedKeys();
			var index = keys.indexOf("A");
			if(index != -1){
				keys.splice(index,1);
				sap.ui.getCore().byId("ZUI5_HR_BookRequestList_Bkkd").setSelectedKeys(keys);
			}			
		} 
	},
	
	openZappUrl: function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRequest.ZUI5_HR_BookRequestList");
		var oController = oView.getController();
		if(!oController._DetailInfoDialog) {
			oController._DetailInfoDialog = sap.ui.jsfragment("ZUI5_HR_BookRequest.fragment.DetailInfoDialog", oController);
			oView.addDependent(oController._DetailInfoDialog);
		}
		
		var vData = { Data : { text1 : "1" , text2 : "", text3: "", button_visible: false, sPath: ""}};
		var sPath = oEvent.getSource().getParent().getBindingContext().sPath;
		var count = oController._ListJSonModel.getProperty(sPath +"/Zbcount");
		var rental = oController._ListJSonModel.getProperty(sPath + "/Zbrental");
		
		if(rental == "Y"){
			vData.Data.text1 = oBundleText.getText("LABEL_2388");	// 2388:*  해당 도서는 대출중 입니다. (예약  #명 대기중)
			vData.Data.text1 = vData.Data.text1.replace(/#/g, count);
		}else{
			vData.Data.text1 = oBundleText.getText("LABEL_2389");	// 2389:* 해당 도서는 예약이 가능합니다.
		}
		vData.Data.text2 = "- " + oBundleText.getText("LABEL_2634");	// 2634:행랑대출: 행량을 통해 사무실에서 수령
		vData.Data.text3 = "- " + oBundleText.getText("LABEL_2462");	// 2462:도서관방문: 신청인이 도서관에 직접 방문하여 수령
		if(oController._vPersa == "7000"){
			vData.Data.button_visible = false;
		}else{
			vData.Data.button_visible = true;
		}
		vData.Data.sPath = sPath;
		oController._DialogJsonModel.setData(vData);		
		oController._DetailInfoDialog.open();
	},
	
	onSaveType10: function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRequest.ZUI5_HR_BookRequestList");
		var oController = oView.getController();		
		var sPath = oEvent.getSource().getCustomData()[0].getValue();
		oController.saveData(sPath, "10");
		
	},
	
	onSaveType20: function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRequest.ZUI5_HR_BookRequestList");
		var oController = oView.getController();		
		var sPath = oEvent.getSource().getCustomData()[0].getValue();
		oController.saveData(sPath, "20");
	},
	
	saveData: function(sPath, type){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRequest.ZUI5_HR_BookRequestList");
		var oController = oView.getController();	
		var vErrorMessage = "";
		var oModel = sap.ui.getCore().getModel("ZHR_BOOK_SRV");
		var oPath = "/BookListSet";
		var oData = oController._ListJSonModel.getProperty(sPath);
		oData.Zbook = type;
		
		var oneData = common.Common.copyByMetadata(oModel, "BookList", oData)
		
		
		var onProcess = function(){
	
			oModel.create(
					oPath,
					oneData,
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
			sap.m.MessageBox.success(oBundleText.getText("LABEL_2543"), {	// 2543:예약 되었습니다.
				title : oBundleText.getText("LABEL_0395"),	// 395:확인
				onClose : oController.onPressSearch
			});			
		};
		
		var CreateProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		}		
		
		sap.m.MessageBox.confirm(oBundleText.getText("LABEL_2460"), {	// 2460:도서 대출 예약 하시겠습니까?
			title : oBundleText.getText("LABEL_0395"),	// 395:확인
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});			
		
	},
	
	handleSelectionFinish : function(oEvent){
		
	},
	
	onSelectRow : function(oEvent){
	},

	onPressRow : function(oEvent){
		
	},
	
	onBack : function(oEvent){
	},

	
	onPressSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRequest.ZUI5_HR_BookRequestList");
		var oController = oView.getController();		
		var oModel = sap.ui.getCore().getModel("ZHR_BOOK_SRV");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var SerchCond = oController._ListCondJSonModel.getProperty("/Data");
		var vBkdi = sap.ui.getCore().byId(oController.PAGEID + "_Bkdi").getSelectedKey();
		var vBkkd = sap.ui.getCore().byId(oController.PAGEID + "_Bkkd").getTokens(); 
		var vBkde = sap.ui.getCore().byId(oController.PAGEID + "_Bkde").getTokens(); 
		var aFilters = [
			new sap.ui.model.Filter("Zbkdi","EQ",vBkdi),
			new sap.ui.model.Filter("Zbname","EQ",SerchCond.Bname == null ? "" : SerchCond.Bname),
			new sap.ui.model.Filter("Zbauthor","EQ",SerchCond.Author == null ? "" : SerchCond.Author),
			new sap.ui.model.Filter("Zbpub","EQ",SerchCond.Pub == null ? "" : SerchCond.Pub)
		];
		
		vBkkd.forEach(function(element){
			aFilters.push(new sap.ui.model.Filter('Zbkkd', sap.ui.model.FilterOperator.EQ, element.getKey()));
		});
		
		vBkde.forEach(function(element){
			aFilters.push(new sap.ui.model.Filter('Zbkde', sap.ui.model.FilterOperator.EQ, element.getKey()));
		});
		
		function Search() {
			var Datas = { Data : []};
			var errData = {};
			oModel.read("/BookListSet", {
				async : false,
				filters : aFilters,
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
			
			if(errData.Error == "E") {
				oController.BusyDialog.close();
				sap.m.MessageBox.show(errData.ErrorMessage);
			}
			oController.BusyDialog.close();			
		}
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);				
		
	},
	
	
	onESSClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRequest.ZUI5_HR_BookRequestList");
		var oController = oView.getController();
		oController._ListCondJSonModel.setProperty("/Data/Pernr", "");
		oController._ListCondJSonModel.setProperty("/Data/Ename", "");
		oController._AddPersonDialog.close();
	},

	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRequest.ZUI5_HR_BookRequestList");
		var oController = oView.getController();
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_BookRequest.ZUI5_HR_BookRequestList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oJSONModel = oTable.getModel();
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
	
		var curDate = new Date();
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: oBundleText.getText("LABEL_1699") + "-" + dateFormat.format(curDate) + ".xlsx"	// 1699:도서 조회 및 예약
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
		oSpreadsheet.build();
	}

});