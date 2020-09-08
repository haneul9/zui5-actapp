jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_CommuteRecordIndv.ZUI5_HR_CommuteRecordIndvList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_CommuteRecordIndv.ZUI5_HR_CommuteRecordIndvList
	 */

	PAGEID : "ZUI5_HR_CommuteRecordIndvList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_Columns : "",
	_vPersa : "" ,
	_vClsdt : "",
	_vZpayym : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	_vZworktyp : 'HR41',
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
		var oController = this,
			curDate = new Date(),
			vTsmon = new Date(curDate.getFullYear(), curDate.getMonth() - 1, 1),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
			mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo"),
			vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet"),
			vEname = "",
			vEncid = "";
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1) {			
			if(_gAuth == "E" && vEmpLoginInfo.length > 0) {
				vEname = vEmpLoginInfo[0].Ename ;
				vEncid = vEmpLoginInfo[0].Encid ;
			}
			
			var JSonData = { Data : { Tsmon : dateFormat.format(vTsmon), Encid : vEncid, Ename : vEname }};
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordIndv.ZUI5_HR_CommuteRecordIndvList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_MONTHLYTIME_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oColumns = oTable.getColumns(),
			aFilters = [],
			begDate = null,
			SerchCond = oController._ListCondJSonModel.getProperty("/Data"),
			oBtnSave = sap.ui.getCore().byId(oController.PAGEID + "_BtnSave"),
			isEdit = false;

		// 테이블 sort, filter 제거
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		if(SerchCond.Tsmon != "") {
			begDate = sap.ui.getCore().byId(oController.PAGEID + "_Tsmon").getValue();
			begDate = begDate.split('-');
			begDate = begDate[0] + begDate[1];
			aFilters.push(new sap.ui.model.Filter('Tsmon', sap.ui.model.FilterOperator.EQ, begDate));
		}
		if(SerchCond.Encid != "") {
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, SerchCond.Encid));
		}
		
		function Search() {
			var Datas = {Data : []},
				OneData = {},
				headerDate = {},
				vRetType = "",
				vRetMsg = "";
			
			oModel.read("/EssMonthlyTimeHeaderSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						headerDate = data.results[0];
						
						vRetType = headerDate.RetType;
						
						if(vRetType != "E") {
							isEdit = headerDate.Conf0 == "X" ? false : true;
							headerDate.Dmont = (!headerDate.Dmont || headerDate.Dmont == "0.00") ? "0" : headerDate.Dmont;
							headerDate.Dshft = (!headerDate.Dshft || headerDate.Dshft == "0.00") ? "0" : headerDate.Dshft;
							headerDate.Tfxot = (!headerDate.Tfxot || headerDate.Tfxot == "0.00") ? "0" : headerDate.Tfxot;
							headerDate.Tovrt = (!headerDate.Tovrt || headerDate.Tovrt == "0.00") ? "0" : headerDate.Tovrt;
							headerDate.Totex = (!headerDate.Totex || headerDate.Totex == "0.00") ? "0" : headerDate.Totex;
							headerDate.Tnght = (!headerDate.Tnght || headerDate.Tnght == "0.00") ? "0" : headerDate.Tnght;
							headerDate.Tschd = (!headerDate.Tschd || headerDate.Tschd == "0.00") ? "0" : headerDate.Tschd;
							
							oController._DetailJSonModel.setData({Data : headerDate});
						} else {
							oController._DetailJSonModel.setData({Data : {Conf0 : "X"}});
						}
						
						if(vRetType == "W" || vRetType == "E") {
							vRetMsg = headerDate.RetMsg;
						}
					}
				},
				error: function(Res) {
					var errData = common.Common.parseError(Res);
					oController.Error = errData.Error;
					oController.ErrorMessage = errData.ErrorMessage;
				}
			});
			
			if(vRetMsg != "") sap.m.MessageBox.show(vRetMsg, {});
			
			if(vRetType == "E") {
				oController._ListJSonModel.setData({Data : []});
				oTable.setVisibleRowCount(1);
				oBtnSave.setVisible(false);
			} else {
				oModel.read("/EssMonthlyTimeDetailSet", {
					async: false,
					filters: aFilters,
					success: function(data,res) {
						if(data && data.results.length) {
							for(var i=0;i<data.results.length;i++) {
								OneData = data.results[i];
								
								OneData.Idx = i + 1;
								OneData.isEdit = isEdit;
								OneData.Tovrt = (!OneData.Tovrt || OneData.Tovrt == "0.00") ? "0" : OneData.Tovrt;
								OneData.Totex = (!OneData.Totex || OneData.Totex == "0.00") ? "0" : OneData.Totex;
								OneData.Tnght = (!OneData.Tnght || OneData.Tnght == "0.00") ? "0" : OneData.Tnght;
								
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
				oTable.setVisibleRowCount(Datas.Data.length > 15 ? 15 : Datas.Data.length);
				
				oBtnSave.setVisible(isEdit);
				
				if(oController.Error == "E") {
					oController.BusyDialog.close();
					oController.Error = "";
					sap.m.MessageBox.show(oController.ErrorMessage, {});
				}
				
				oTable.bindRows({ path: "/Data" });
			}
			
			oController.BusyDialog.close();
		}	
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);
	},
	
	_AddPersonDialog : null,
	
	EmpSearchByTx :function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordIndv.ZUI5_HR_CommuteRecordIndvList"),
			oController = oView.getController(),
			oControl = oEvent.getSource(),
			vEname = oControl.getValue(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = {EmpSearchResultSet : []},
			oFilters = [];
		
		common.SearchUserList.oController = oController;
		oController._vEnamefg = "";
		
		if(!vEname || vEname == "") {
			if(oController._ListCondJSonModel.getProperty("/Data")) {
				var vControlId = common.Common.getControlId(oController, oControl.getId());
				if(vControlId.Id && vControlId.Id != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
				if(vControlId.Key && vControlId.Key != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
			}
			oController.onPressSearch();
		}else{
			oController._oControl = oControl;
			
			var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV"),
				curDate = new Date();
			
//			if(_gAuth != "H"){
//				oFilters.push(new sap.ui.model.Filter('Persa', sap.ui.model.FilterOperator.EQ, oController._vPersa));
//			}
			oFilters.push(new sap.ui.model.Filter('Actda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(curDate)));
			oFilters.push(new sap.ui.model.Filter('Ename', sap.ui.model.FilterOperator.EQ, vEname));
			oFilters.push(new sap.ui.model.Filter('Stat1', sap.ui.model.FilterOperator.EQ, '3'));
			oFilters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth));
			if(gReqAuth) oFilters.push(new sap.ui.model.Filter('ReqAuth', sap.ui.model.FilterOperator.EQ, gReqAuth));
			
			try {
				oCommonModel.read("/EmpSearchResultSet", {
					async: false,
					filters: oFilters,
					success: function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {	
								oData.results[i].Chck = false ;
								vEmpSearchResult.EmpSearchResultSet.push(oData.results[i]);
								
							}
						}
					},
					error: function(Res) {
						var errData = common.Common.parseError(Res);
						oController.Error = errData.Error;
						oController.ErrorMessage = errData.ErrorMessage;
					}
				});
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.alert(oController.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
					oEvent.getSource().setValue();
					return;
				}	
			}catch(Ex){
				
			}
			
			if(vEmpSearchResult.EmpSearchResultSet.length == 1){
				var vControlId = common.Common.getControlId(oController, oControl.getId());
				if(vControlId.Id && vControlId.Id != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,vEmpSearchResult.EmpSearchResultSet[0].Ename);
				if(vControlId.Key && vControlId.Key != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,vEmpSearchResult.EmpSearchResultSet[0].Encid);
				oController.onPressSearch();
			}else{
				oController._vEnamefg = "X";
				oController.displayEmpSearchDialog();
			}
		}
		
		
	},
	
	displayEmpSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordIndv.ZUI5_HR_CommuteRecordIndvList"),
			oController = oView.getController();
		
		if(oEvent){
			oController._oControl = oEvent.getSource();
			oController._vEnamefg = "";
		}
		
		//각 발령대상자의 발령일을 검색조건으로 설정한다.
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		if(oActda) oController._vActda = oActda.getValue();
		
		common.SearchUserList.oController = oController;
		common.SearchUserList.fPersaEnabled = false;
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearchList", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		
		oController._AddPersonDialog.open();
		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		jQuery.sap.require("common.SearchOrg");

		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordIndv.ZUI5_HR_CommuteRecordIndvList"),
			oController = oView.getController();
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Multi";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "MultiInput";
		
		if(!oController._SerachOrgDialog) {
			oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SerachOrgDialog);
		}
		
		oController._SerachOrgDialog.open();
	},
	
	displayOrgSearchDialog : function(oEvent) {
		jQuery.sap.require("common.SearchOrg");

		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordIndv.ZUI5_HR_CommuteRecordIndvList"),
			oController = oView.getController();
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Single";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "Input";
		common.SearchOrg.vNoPersa = true;
		
		if(!oController._SerachOrgDialog) {
			oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SerachOrgDialog);
		}
		
		oController._SerachOrgDialog.open();
	},
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordIndv.ZUI5_HR_CommuteRecordIndvList"),
			oController = oView.getController(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet"),
			mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp"),
			vActionSubjectList_Temp = {ActionSubjectListSet : []},
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"), 
			vIDXs = oTable.getSelectedIndices();
		
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(vIDXs.length > 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는 한명만 선택이 가능합니다.
				return;
			}else if(vIDXs.length < 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}
			
			var vControlId = common.Common.getControlId(oController, oController._oControl.getId()),
				_selPath = oTable.getContextByIndex(vIDXs[0]).sPath;
			
			if(vControlId.Id && vControlId.Id != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id, mEmpSearchResult.getProperty(_selPath + "/Ename"));
			if(vControlId.Key && vControlId.Key != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,mEmpSearchResult.getProperty(_selPath + "/Encid"));
		
		}else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordIndv.ZUI5_HR_CommuteRecordIndvList"),
			oController = oView.getController(),
			vControlId = common.Common.getControlId(oController, oController._oControl.getId());
		
		if(vControlId.Id && vControlId.Id != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
		if(vControlId.Key && vControlId.Key != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
		
		oController._AddPersonDialog.close();
	},
	
	SmartSizing : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordIndv.ZUI5_HR_CommuteRecordIndvList"),
//			oController = oView.getController();
	},
	
	onPressConfirm : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordIndv.ZUI5_HR_CommuteRecordIndvList"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},

	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordIndv.ZUI5_HR_CommuteRecordIndvList"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty) { // 처리 구분
		var vZappStatAl	= "", 
			errData = {},
			vOData = {};
		
		var onProcess = function() {
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				SerchCond = oController._ListCondJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_MONTHLYTIME_SRV"),
				vTsmon = "";
			
			if(SerchCond.Tsmon != "") {
				vTsmon = sap.ui.getCore().byId(oController.PAGEID + "_Tsmon").getValue();
				vTsmon = vTsmon.split('-');
				vTsmon = vTsmon[0] + vTsmon[1];
			}
			
			vOData = common.Common.copyByMetadata(oModel, "EssMonthlyTimeHeader", oController._DetailJSonModel.getProperty("/Data"));
			vOData.Actty = _gAuth;
			vOData.Prcty = vPrcty;
			vOData.Pernr = SerchCond.Pernr;
			vOData.Tsmon = vTsmon;
			vOData.Begda = (vOData.Begda) ? "\/Date("+ common.Common.adjustGMT(vOData.Begda)+")\/" : undefined;
			vOData.Endda = (vOData.Endda) ? "\/Date("+ common.Common.adjustGMT(vOData.Endda)+")\/" : undefined;
			
			var vDetailDataList = [], vDetailData = {},
				vTableData = oController._ListJSonModel.getProperty("/Data");
			
			vTableData.forEach(function(element) {
				vDetailData = {};
				vDetailData = common.Common.copyByMetadata(oModel, "EssMonthlyTimeDetail", element);
				vDetailData.Prcty = vPrcty;
				vDetailData.Actty = _gAuth;
				vDetailData.Tsdat = (vDetailData.Tsdat) ? "\/Date("+ common.Common.adjustGMT(vDetailData.Tsdat)+")\/" : undefined;
				
				vDetailDataList.push(vDetailData);
			});
			
			vOData.EssMonthlyTimeNav = vDetailDataList;
			
			oModel.create("/EssMonthlyTimeHeaderSet", vOData, {
				success: function(data,res) {
					if(data) {
					}
				},
				error: function (Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == 'E'){
				oController.BusyDialog.close();
				new control.ZNK_SapBusy.oErrorMessage(errData.ErrorMessage);
				return ;
			}
			
			oController.BusyDialog.close();
			
			sap.m.MessageBox.show(vCompTxt, {
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				onClose : oController.onBack
			});
			
			oController.onPressSearch();

		};
		
		var CreateProcess = function(fVal) {
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		var vInfoTxt = "" , vCompTxt = "";
		if(vPrcty == "T"){
			vInfoTxt = oBundleText.getText("LABEL_0061");	// 61:저장하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0060") ;	// 60:저장이 완료되었습니다.
		} else {
			vInfoTxt = oBundleText.getText("LABEL_0695");	// 695:확인하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0696");	// 696:확인이 완료되었습니다.
		}
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [
				sap.m.MessageBox.Action.YES, 
				sap.m.MessageBox.Action.NO
			],
			onClose : CreateProcess
		});
	},	
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_CommuteRecordIndv.ZUI5_HR_CommuteRecordIndvList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oJSONModelData = oTable.getModel().getProperty("/Data"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"}),
			curDate = new Date();
		
		if(oJSONModelData.length < 1) return;
		
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModelData,
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
				fileName: oBundleText.getText("LABEL_0688") + "-" + dateFormat.format(curDate) + ".xlsx"	// 688:근태기록부확인(개인)
		};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	}
});