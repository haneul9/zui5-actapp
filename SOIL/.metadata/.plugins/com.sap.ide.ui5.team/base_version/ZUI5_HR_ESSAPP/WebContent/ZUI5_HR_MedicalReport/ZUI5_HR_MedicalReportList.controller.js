jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_MedicalReport.ZUI5_HR_MedicalReportList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_MedicalReport.ZUI5_HR_MedicalReportList
	 */

	PAGEID : "ZUI5_HR_MedicalReportList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_Columns : "",
	_vPersa : "" ,
	_vClsdt : "",
	_vZpayym : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	_vZworktyp : 'HR30',
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
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
			curDate = new Date(),
			prevDate = new Date(curDate.getFullYear(), curDate.getMonth()-1 , curDate.getDate()+1),
			mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo"),
			vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet"),
			vEname = "",
			vPernr = "",
			vEncid = "",
			oController = this;
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1) {			
			if(_gAuth == "E" && vEmpLoginInfo.length > 0) {
				vEname = vEmpLoginInfo[0].Ename ;
				vPernr = vEmpLoginInfo[0].Pernr ;
				vEncid = vEmpLoginInfo[0].Encid ;
			}
			
			var JSonData = { Data : { Begda : dateFormat.format(prevDate) , Endda : dateFormat.format(curDate) , 
				                      Pernr : vPernr, Ename : vEname , Encid : vEncid, Medty : ""}};
			oController._ListCondJSonModel.setData(JSonData);
		}
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
//		this.onPressSearch();
	},
	
	onSelectRow : function(oEvent) {
		
	},
	
	onPressRow : function(oEvent) {
		
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalReport.ZUI5_HR_MedicalReportList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_REP_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		
		// 테이블 sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++) {
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var aFilters = [],
			SerchCond = oController._ListCondJSonModel.getProperty("/Data");
		
		if(SerchCond.Begda != "" && SerchCond.Endda != "") {
			if(common.Common.checkDate(SerchCond.Begda, SerchCond.Endda) == false) {
				return ;
			}
		}
		
		aFilters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth));
		if(!common.Common.checkNull(SerchCond.Begda)) {
			aFilters.push(new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Begda").getDateValue())));
		}
		if(!common.Common.checkNull(SerchCond.Endda)) {
			aFilters.push(new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Endda").getDateValue())));
		}
		if(!common.Common.checkNull(SerchCond.Encid)) {
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, SerchCond.Encid));
		}
		if(!common.Common.checkNull(SerchCond.Famgb)){
			aFilters.push(new sap.ui.model.Filter('Famgb', sap.ui.model.FilterOperator.EQ, SerchCond.Famgb));
		}
		if(!common.Common.checkNull(SerchCond.Famgb)){
			aFilters.push(new sap.ui.model.Filter('Famgb', sap.ui.model.FilterOperator.EQ, SerchCond.Famgb));
		}
		if(!common.Common.checkNull(SerchCond.Medty)) {
			aFilters.push(new sap.ui.model.Filter('Medty', sap.ui.model.FilterOperator.EQ, SerchCond.Medty));
		}
		if(SerchCond.Persa && SerchCond.Persa.length > 0) {
			SerchCond.Persa.forEach(function(element){
				aFilters.push(new sap.ui.model.Filter('Werks', sap.ui.model.FilterOperator.EQ, element));
			});
		}

		
		function Search() {
			var Datas = {Data : []};
			
			oModel.read("/MedicalReportSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0; i<data.results.length; i++) {
							var OneData = data.results[i];
							OneData.Idx = i + 1;
							OneData.Payym = common.Common.checkNull(OneData.Payym) ? "" : OneData.Payym.substring(0,4) + "." +  OneData.Payym.substring(4,6);
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
		
//		control.ZNKBusyAccessor.onBusy(oEvent, oController);
		oController.BusyDialog.open();
		setTimeout(Search, 100);
	},
	
	_AddPersonDialog : null,
	
	EmpSearchByTx :function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalReport.ZUI5_HR_MedicalReportList"),
			oController = oView.getController(),
			oControl = oEvent.getSource(),
			vEname = oControl.getValue(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = {EmpSearchResultSet : []};
		
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
		} else {
			oController._oControl = oControl;
			
			var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV"),
				curDate = new Date(),
				oFilters = [];
			
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
				
				if(oController.Error == "E") {
					oController.Error = "";
					sap.m.MessageBox.alert(oController.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
					oEvent.getSource().setValue();
					return;
				}	
			} catch(Ex) {
			}
			
			if(vEmpSearchResult.EmpSearchResultSet.length == 1) {
				var vControlId = common.Common.getControlId(oController, oControl.getId());
				if(vControlId.Id && vControlId.Id != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,vEmpSearchResult.EmpSearchResultSet[0].Ename);
				if(vControlId.Key && vControlId.Key != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,vEmpSearchResult.EmpSearchResultSet[0].Encid);
				oController.onPressSearch();
			} else {
				oController._vEnamefg = "X";
				oController.displayEmpSearchDialog();
			}
		}
	},
	
	displayEmpSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalReport.ZUI5_HR_MedicalReportList"),
			oController = oView.getController();
		
		if(oEvent) {
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalReport.ZUI5_HR_MedicalReportList"),
			oController = oView.getController();
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Multi";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "MultiInput";
		
		if(!oController._SearchOrgDialog) {
			oController._SearchOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SearchOrgDialog);
		}
		oController._SearchOrgDialog.open();
	},
	
	displayOrgSearchDialog : function(oEvent) {
		jQuery.sap.require("common.SearchOrg");

		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalReport.ZUI5_HR_MedicalReportList"),
			oController = oView.getController();
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Single";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "Input";
		common.SearchOrg.vNoPersa = true;
		
		if(!oController._SearchOrgDialog) {
			oController._SearchOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SearchOrgDialog);
		}
		oController._SearchOrgDialog.open();
	},
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalReport.ZUI5_HR_MedicalReportList"),
			oController = oView.getController();
	
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp"),
			vActionSubjectList_Temp = {ActionSubjectListSet : []};
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"), 
			vIDXs = oTable.getSelectedIndices();
		
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(vIDXs.length > 1) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는 한명만 선택이 가능합니다.
				return;
			} else if(vIDXs.length < 1) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}
			
			var vControlId = common.Common.getControlId(oController, oController._oControl.getId());
			if(vControlId.Id && vControlId.Id != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id, mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[0] + "/Ename"));
			if(vControlId.Key && vControlId.Key != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[0] + "/Encid"));
		
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalReport.ZUI5_HR_MedicalReportList"),
			oController = oView.getController(),
			vControlId = common.Common.getControlId(oController, oController._oControl.getId());
		
		if(vControlId.Id && vControlId.Id != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
		if(vControlId.Key && vControlId.Key != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
		oController._AddPersonDialog.close();
	},
	
	handleIconTabBarSelect : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalReport.ZUI5_HR_MedicalReportList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"), 
			sKey = oEvent.getParameter("selectedKey"),
			oFilters = [];
		
		if(sKey == "All") { 
			oTable.bindRows({ path: "/Data" });
		} else {
			oFilters.push(new sap.ui.model.Filter("ZappStatAl", sap.ui.model.FilterOperator.EQ, sKey));
			var combinedFilter = new sap.ui.model.Filter(oFilters);
			
			oTable.bindRows({ path: "/Data", filters: combinedFilter });
		}
	},
	
	SmartSizing : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalReport.ZUI5_HR_MedicalReportList");
		var oController = oView.getController();
	},
	
	onExport : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalReport.ZUI5_HR_MedicalReportList");
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
			    fileName: oBundleText.getText("LABEL_2011") + "-" + dateFormat.format(curDate) + ".xlsx"	// 2011:의료비 현황 조회
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	}
});