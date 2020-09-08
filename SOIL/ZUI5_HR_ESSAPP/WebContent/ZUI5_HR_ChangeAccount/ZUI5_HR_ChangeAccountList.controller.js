jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountList
	 */

	PAGEID : "ZUI5_HR_ChangeAccountList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_IconTabBarJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_AccountTableJSonModel : new sap.ui.model.json.JSONModel(),
	_Columns : "",
	_vPersa : "" ,
	_vClsdt : "",
	_vZpayym : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	_vZworktyp : 'BE14',
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
			prevDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate() + 1),
			mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo"),
			vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
//			oEname = sap.ui.getCore().byId(oController.PAGEID + "_Ename"),
			vEname = "",
			vPernr = "",
			vEndid = "";
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1) {			
			if(_gAuth == "E" && vEmpLoginInfo.length > 0) {
				vEname = vEmpLoginInfo[0].Ename ;
				vPernr = vEmpLoginInfo[0].Pernr ;
				vEndid = vEmpLoginInfo[0].Encid ;
				
//				oEname.setTokens([new sap.m.Token({key : vPernr, text : vEname})]);
			}
			
			var JSonData = { 
				Data : { 
					Apbeg : dateFormat.format(prevDate), 
					Apend : dateFormat.format(curDate),
					Bnksa : "A",
					Encid : vEndid,
					Pernr : vPernr,
					Ename : vEname
				}
			};
			oController._ListCondJSonModel.setData(JSonData);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
		
		oController._IconTabBarJSonModel.setData({
			Data : { click0 : "Y", click1 : "N", click2 : "N", click3 : "N", click4 : "N", click5 : "N" ,
				     CountAll : 0 , Count1 : 0 , Count2 : 0, Count3 : 0 , Count4 : 0,  Count5 : 0
			}
		});
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
		this.onPressSearch();
	},
	
	onDetailPage : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountList"),
			oController = oView.getController();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : "ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountDetail",
			data : { Appno : _Appno }
		});
	},
	
	// 신규신청 로직
	onPressNew : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountList"),
			oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : "ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountDetail",
			data : {Appno : ""}
		});
	},
	
	onSelectRow : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountList"),
			oController = oView.getController(),		
			oTable = sap.ui.getCore().byId(oController.PAGEID+"_Table"),
			vContext = oEvent.getParameters().rowBindingContext,
			oModel = oTable.getModel();
		
		if(common.Common.isNull(vContext) || oModel.getProperty(vContext.sPath) == null) {
			return;
		}
	
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : "ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountDetail",
			data : { Appno : oModel.getProperty(vContext.sPath + "/Appno") }
		});
	},
	
	onPressRow : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountList"),
			oController = oView.getController(),
			vAppno = oEvent.getSource().getCustomData()[0].getValue();
				
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : "ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountDetail",
			data : {Appno : vAppno} 
		});
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_ACCOUNTCHG_SRV"),
//			oEname = sap.ui.getCore().byId(oController.PAGEID + "_Ename"),
//			oEname_Tokens = oEname.getTokens(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oColumns = oTable.getColumns(),
			vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0,
			aFilters = [],
			SerchCond = oController._ListCondJSonModel.getProperty("/Data"),
			vReqymbeg = null,
			vReqymend = null;

		// 테이블 sort, filter 제거
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		if(SerchCond.Apbeg != "" && SerchCond.Apend != "") {
			if(common.Common.checkDate(SerchCond.Apbeg, SerchCond.Apend) == false) {
				return ;
			}
		}
		
		aFilters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth));
		aFilters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'L'));
		if(SerchCond.Apbeg != "") {
			aFilters.push(new sap.ui.model.Filter('Apbeg', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Apbeg").getDateValue())));
		}
		if(SerchCond.Apend != "") {
			aFilters.push(new sap.ui.model.Filter('Apend', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Apend").getDateValue())));
		}
		if(SerchCond.Bnksa != "" && SerchCond.Bnksa != "A") {
			aFilters.push(new sap.ui.model.Filter('Bnksa', sap.ui.model.FilterOperator.EQ, SerchCond.Bnksa));
		}
		if(SerchCond.Encid != "") {
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, SerchCond.Encid));
		}
//		if(SerchCond.Pernr != "") {
//			aFilters.push(new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, SerchCond.Pernr));
//		}
//		if(oEname_Tokens && oEname_Tokens.length) {
//			aFilters.push(new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, oEname_Tokens[0].getKey()));
//		}
		
		function Search() {
			var Datas = {Data : []},
				iconData = oController._IconTabBarJSonModel.getData();
			
			oModel.read("/AccountChangeApplSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0;i<data.results.length;i++) {
							var OneData = data.results[i];
							
							OneData.Idx = i + 1;
							
							switch (OneData.ZappStatAl) {
								case '10' :
									vReqCnt1++;
									OneData.ZappStatAl2 = "10"; // 작성중
									break;
								case '20' :
									vReqCnt2++;
									OneData.ZappStatAl2 = "20"; // 신청중
									break;
								case '30' : case '35' : case '40' : case '50' :
									if(common.Common.isNull(data.results[i].ZappDate)) {
										vReqCnt3++;
										OneData.ZappStatAl2 = "30"; // 진행중
									} else {
										vReqCnt4++;
										OneData.ZappStatAl2 = "40"; // 승인
									}
									break;
								case '31' : case '36' : case '45' : case '55' :
									vReqCnt5++;
									OneData.ZappStatAl2 = "50"; // 반려
									break;
							}
							
							// 담당자 의견 
							OneData.ZListComment = "";
//							if(OneData.Symptn && OneData.Symptn != ""){
//								OneData.ZListComment = OneData.Symptn ;
//							}
							if(OneData.ZappResn && OneData.ZappResn != ""){
//								if(OneData.ZListComment != "") OneData.ZListComment += "\n";
								OneData.ZListComment += OneData.ZappResn;
							}
							
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
			
			iconData.Data.Count1 = vReqCnt1;
			iconData.Data.Count2 = vReqCnt2;
			iconData.Data.Count3 = vReqCnt3;
			iconData.Data.Count4 = vReqCnt4;
			iconData.Data.Count5 = vReqCnt5;
			iconData.Data.CountAll = Datas.Data.length;
			oController._IconTabBarJSonModel.setData(iconData);
			
			oController.handleIconTabBarSelect(oController, "0");
			
			oController.BusyDialog.close();
		}	
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);
	},
	
	onPressRetrieveAccount : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountList"),
			oController = oView.getController(),
			vEncid = oController._ListCondJSonModel.getProperty("/Data/Encid");
		
		if(!vEncid) return;
		
		if(!oController._AccountDialog) {
			oController._AccountDialog = sap.ui.jsfragment("ZUI5_HR_ChangeAccount.fragment.AccountDialog", oController);
			oView.addDependent(oController._AccountDialog);
		}
		
		oController.onRetrieveAccount(vEncid);
		
		oController._AccountDialog.open();
	},
	
	onRetrieveAccount : function(vEncid) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_AccountTable"),
			oModel = sap.ui.getCore().getModel("ZHR_ACCOUNTCHG_SRV"),
			vData = {Data : []},
			tableSize = 1;
		
		oModel.read("/AccountStatusSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					var i = 1;
					data.results.forEach(function(elem) {
						elem.Idx = i++;
						
						vData.Data.push(elem);
					});
					
					oController._AccountTableJSonModel.setData(vData);
					tableSize = vData.Data.length > 15 ? 15 : vData.Data.length;
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == "E") {
					sap.m.MessageBox.alert(errData.ErrorMessage, {});
					return;
				}
			}
		});
		
		oTable.setVisibleRowCount(tableSize);
	},
	
	_AddPersonDialog : null,
	
	EmpSearchByTx :function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountList"),
			oController = oView.getController(),
			oControl = oEvent.getSource(),
//			oEname = sap.ui.getCore().byId(oController.PAGEID + "_Ename"),
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
//				oEname.setValue("");
//				oEname.setTokens([new sap.m.Token({key : vEmpSearchResult.EmpSearchResultSet[0].Pernr, text : vEmpSearchResult.EmpSearchResultSet[0].Ename})]);
				
				var vControlId = common.Common.getControlId(oController, oControl.getId());
				if(vControlId.Id && vControlId.Id != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,vEmpSearchResult.EmpSearchResultSet[0].Ename);
				if(vControlId.Key && vControlId.Key != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,vEmpSearchResult.EmpSearchResultSet[0].Pernr);
				
				oController.onPressSearch();
			}else{
				oController._vEnamefg = "X";
				oController.displayEmpSearchDialog();
			}
		}
		
		
	},
	
	displayEmpSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountList"),
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountList"),
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountList"),
			oController = oView.getController(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet"),
			mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp"),
			vActionSubjectList_Temp = {ActionSubjectListSet : []},
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"), 
//			oEname = sap.ui.getCore().byId(oController.PAGEID + "_Ename"),
			vIDXs = oTable.getSelectedIndices();
		
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(vIDXs.length > 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는 한명만 선택이 가능합니다.
				return;
			}else if(vIDXs.length < 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}
			
//			oEname.setValue("");
//			oEname.destroyTokens();
//			oEname.setTokens([new sap.m.Token({key : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[0] + "/Pernr"), text : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[0] + "/Ename")})]);
			
			var vControlId = common.Common.getControlId(oController, oController._oControl.getId());
			if(vControlId.Id && vControlId.Id != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id, mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[0] + "/Ename"));
			if(vControlId.Key && vControlId.Key != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[0] + "/Pernr"));
		
		}else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountList"),
			oController = oView.getController(),
			vControlId = common.Common.getControlId(oController, oController._oControl.getId());
		
		if(vControlId.Id && vControlId.Id != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
		if(vControlId.Key && vControlId.Key != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
		
		oController._AddPersonDialog.close();
	},
	
	handleIconTabBarSelect : function(oController, sKey) {
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"), 
			iconData = oController._IconTabBarJSonModel.getData(),
			oFilters = [];
		
		iconData.Data.click0 = "N";
		iconData.Data.click1 = "N";
		iconData.Data.click2 = "N";
		iconData.Data.click3 = "N";
		iconData.Data.click4 = "N";
		iconData.Data.click5 = "N";
		
		eval("iconData.Data.click" + sKey + "= 'Y' ;");
		oController._IconTabBarJSonModel.setData(iconData);
		
		if(sKey == "0"){ 
			oTable.bindRows({
			    path: "/Data"
			});
		} else {
			var vZappStatAl = "" + (sKey * 10 );
			oFilters.push(new sap.ui.model.Filter("ZappStatAl2",sap.ui.model.FilterOperator.EQ,vZappStatAl));
			var combinedFilter = new sap.ui.model.Filter(oFilters);
			
			oTable.bindRows({
				path: "/Data",
				filters: combinedFilter
			});
		}
	},
	
	SmartSizing : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountList"),
//			oController = oView.getController();
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountList"),
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
				fileName: oBundleText.getText("LABEL_0595") + "-" + dateFormat.format(curDate) + ".xlsx"	// 595:계좌변경 신청
		};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	}
});