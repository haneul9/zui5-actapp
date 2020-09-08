jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");

sap.ui.controller("ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList
	 */

	PAGEID : "ZUI5_HR_WorkGroupInquiryList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_List2JSonModel : new sap.ui.model.json.JSONModel(),
	_List2_1JSonModel : new sap.ui.model.json.JSONModel(),
	_List3JSonModel : new sap.ui.model.json.JSONModel(),
	_List4JSonModel : new sap.ui.model.json.JSONModel(),
	_List5JSonModel : new sap.ui.model.json.JSONModel(),
	_Columns1 : "",
	_Columns2 : "",
	_Columns2_1 : "",
	_Columns3 : "",
	_Columns4 : "",
	_Columns5 : "",
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
			mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo"),
			vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet"),
			JSonData = {},
			vOrgeh = "",
			vOrgtx = "";
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1) {
			if(_gAuth == "E" && vEmpLoginInfo.length > 0) {
				vOrgeh = vEmpLoginInfo[0].Orgeh ;
				vOrgtx = vEmpLoginInfo[0].Stext ;
			}
			
			JSonData = {Data : {Datum : "", Orgeh : vOrgeh, Orgtx : vOrgtx, Auth : _gAuth}};
			oController._ListCondJSonModel.setData(JSonData);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
			
			if(vOrgeh) oController.onChangeOrgeh();
		}
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
//		this.onPressSearch();
		
		var oTable = sap.ui.getCore().byId(this.PAGEID + "_Table"),
			oTable2 = sap.ui.getCore().byId(this.PAGEID + "_Table2"),
			oTable2_1 = sap.ui.getCore().byId(this.PAGEID + "_Table2_1"),
			oTable3 = sap.ui.getCore().byId(this.PAGEID + "_Table3"),
			oTable4 = sap.ui.getCore().byId(this.PAGEID + "_Table4"),
			oTable5 = sap.ui.getCore().byId(this.PAGEID + "_Table5");
		
		oTable.setVisibleRowCount(1);
		oTable2.setVisibleRowCount(1);
		oTable2_1.setVisibleRowCount(1);
		oTable3.setVisibleRowCount(1);
		oTable4.setVisibleRowCount(1);
		oTable5.setVisibleRowCount(1);
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
	
	onChangeOrgeh : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList"),
			oController = oView.getController(),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV"),
			oDatum = sap.ui.getCore().byId(oController.PAGEID + "_Datum"),
			vOrgeh = oController._ListCondJSonModel.getProperty("/Data/Orgeh");
		
		if(oDatum.getItems()) oDatum.destroyItems();
		
		oModel.read("/OrgSchkzDateSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Orgeh', sap.ui.model.FilterOperator.EQ, vOrgeh)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					data.results.forEach(function(elem) {
						oDatum.addItem(new sap.ui.core.Item({
							key : dateFormat.format(elem.Datum), 
							text : dateFormat.format(elem.Datum)
						}));
					});
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
	},
	
	displayOrgSearchDialog : function(oEvent) {
		jQuery.sap.require("common.SearchOrg");

		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList"),
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
	
	onAfterOrgeh : function(oController, vZorgeh){
		oController._ListCondJSonModel.setProperty("/Data/Orgeh", vZorgeh);
		oController._ListCondJSonModel.setProperty("/Data/Datum", undefined);
		
		oController.onChangeOrgeh();
	},
	
	// 리스트 조회
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_Table2"),
			oTable2_1 = sap.ui.getCore().byId(oController.PAGEID + "_Table2_1"),
			oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_Table3"),
			oTable4 = sap.ui.getCore().byId(oController.PAGEID + "_Table4"),
			oTable5 = sap.ui.getCore().byId(oController.PAGEID + "_Table5"),
			oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV"),
			SerchCond = oController._ListCondJSonModel.getProperty("/Data"),
			aFilters = [],
			Datas1 = {Data : []},
			Datas2 = {Data : []},
			Datas2_1 = {Data : []},
			Datas3 = {Data : []},
			Datas4 = {Data : []},
			Datas5 = {Data : []},
			oTableTxt2 = sap.ui.getCore().byId(oController.PAGEID + "_TableTxt2"),
			oTableTxt2_1 = sap.ui.getCore().byId(oController.PAGEID + "_TableTxt2_1"),
			oTableTxt3 = sap.ui.getCore().byId(oController.PAGEID + "_TableTxt3"),
			oTableTxt4 = sap.ui.getCore().byId(oController.PAGEID + "_TableTxt4"),
			vZtext2 = "",
			vZtext2_1 = "",
			vZtext3 = "",
			vZtext4 = "",
			vTheaderTxt = "";
		
		// 테이블 sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++) {
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		if(!SerchCond.Orgeh) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0670"), {title : oBundleText.getText("LABEL_0053")});	// 670:부서를 입력하여 주십시오.
			return;
		}
		if(!SerchCond.Datum) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0669"), {title : oBundleText.getText("LABEL_0053")});	// 669:기준일을 선택하여 주십시오.
			return;
		}
		
		function Search() {
			oModel.read("/OrgSchkzPernrListSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Orgeh', sap.ui.model.FilterOperator.EQ, SerchCond.Orgeh),
					new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.getTime(SerchCond.Datum))
				],
				success : function(data,res){
					if(data && data.results.length){
						data.results.forEach(function(elem) {
							elem.Datum = SerchCond.Datum;
							
							if(elem.Zscct == "10") {			// 주간근무 10
								Datas1.Data.push(elem);
							} else {							// 교대근무 20
								if(elem.Zscty == "200") {	// 4조3교대
									vZtext2 = elem.Ztext;
									
									Datas2.Data.push(elem);
								} else if(elem.Zscty == "210") {	// 4조2교대
									vZtext2_1 = elem.Ztext;
									
									Datas2_1.Data.push(elem);
								} else if(elem.Zscty == "300" || elem.Zscty == "310") {	// 3조2교대, 3조3교대
									vZtext3 = elem.Ztext;
									vTheaderTxt = elem.Zsctytx;
									
									Datas3.Data.push(elem);
								} else if(elem.Zscty == "400") {	// 2조2교대
									vZtext4 = elem.Ztext;
									
									Datas4.Data.push(elem);
								}
							}
						});
					}
				},
				error : function(Res) {
					var errData = common.Common.parseError(Res);
					oController.Error = errData.Error;
					oController.ErrorMessage = errData.ErrorMessage;
				}
			});
			
			// listdate 필드 convert => 필드id+"Txt" string 필드로
			common.Common.convertDateField(Datas1);
			common.Common.convertDateField(Datas2);
			common.Common.convertDateField(Datas2_1);
			common.Common.convertDateField(Datas3);
			common.Common.convertDateField(Datas4);
			
			oController._ListJSonModel.setData(Datas1);
			oController._List2JSonModel.setData(Datas2);
			oController._List2_1JSonModel.setData(Datas2_1);
			oController._List3JSonModel.setData(Datas3);
			oController._List4JSonModel.setData(Datas4);
			
			oTable.setVisibleRowCount(Datas1.Data.length > 10 ? 10 : Datas1.Data.length);
			oTable2.setVisibleRowCount(Datas2.Data.length > 10 ? 10 : Datas2.Data.length);
			oTable2_1.setVisibleRowCount(Datas2_1.Data.length > 10 ? 10 : Datas2_1.Data.length);
			oTable3.setVisibleRowCount(Datas3.Data.length > 10 ? 10 : Datas3.Data.length);
			oTable4.setVisibleRowCount(Datas4.Data.length > 10 ? 10 : Datas4.Data.length);
			
			oTableTxt2.setText(vZtext2 || "").setVisible(vZtext2 ? true : false);
			oTableTxt2_1.setText(vZtext2_1 || "").setVisible(vZtext2_1 ? true : false);
			oTableTxt3.setText(vZtext3 || "").setVisible(vZtext3 ? true : false);
			oTableTxt4.setText(vZtext4 || "").setVisible(vZtext4 ? true : false);
			$('#ZUI5_HR_WorkGroupInquiryList_Table3 > div.sapUiTableExt > div > span').text(oBundleText.getText("LABEL_0662") + "(" + vTheaderTxt + ")");	// 662:교대근무자
			
			if(Datas1.Data.length) {
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(0).show();
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(1).show();
			} else {
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(0).hide();
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(1).hide();
			}

			if(Datas2.Data.length) {
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(2).show();
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(3).show();
			} else {
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(2).hide();
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(3).hide();
			}

			if(Datas2_1.Data.length) {
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(4).show();
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(5).show();
			} else {
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(4).hide();
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(5).hide();
			}

			if(Datas3.Data.length) {
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(6).show();
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(7).show();
			} else {
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(6).hide();
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(7).hide();
			}

			if(Datas4.Data.length) {
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(8).show();
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(9).show();
			} else {
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(8).hide();
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(9).hide();
			}
			
			if(oController.Error == "E") {
				oController.BusyDialog.close();
				oController.Error = "";
				sap.m.MessageBox.show(oController.ErrorMessage);
			}
			
			oTable.bindRows("/Data");
			oTable2.bindRows("/Data");
			oTable2_1.bindRows("/Data");
			oTable3.bindRows("/Data");
			oTable4.bindRows("/Data");
			
			oModel.read("/OrgSchkzPinfoSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Orgeh', sap.ui.model.FilterOperator.EQ, SerchCond.Orgeh),
					new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.getTime(SerchCond.Datum))
				],
				success : function(data,res){
					if(data && data.results.length) {
						Datas5.Data = data.results;
					}
				},
				error : function(Res) {
					var errData = common.Common.parseError(Res);
					oController.Error = errData.Error;
					oController.ErrorMessage = errData.ErrorMessage;
				}
			});
			
			// listdate 필드 convert => 필드id+"Txt" string 필드로
			common.Common.convertDateField(Datas5);
			
			oController._List5JSonModel.setData(Datas5);
			oTable5.setVisibleRowCount(Datas5.Data.length > 10 ? 10 : Datas5.Data.length);
			oTable5.bindRows("/Data");
			
			if(Datas5.Data.length) {
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(10).show();
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(11).show();
				sap.ui.getCore().byId(oController.PAGEID + "_Table5Subject").setText(SerchCond.Datum.replace(/-/g, '.') + " " + oBundleText.getText("LABEL_0666"));	// 666:변경내역
			} else {
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(10).hide();
				$('#ZUI5_HR_WorkGroupInquiryList_ListLayout > tbody > tr').eq(11).hide();
			}
			
			oController.BusyDialog.close();
		}
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);				
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList"),
			oController = oView.getController();
	},
	
	_AddPersonDialog : null,
	
	EmpSearchByTx :function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList"),
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
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,vEmpSearchResult.EmpSearchResultSet[0].Pernr);
				oController.onPressSearch();
			}else{
				oController._vEnamefg = "X";
				oController.displayEmpSearchDialog();
			}
		}
		
		
	},
	
	displayEmpSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList"),
			oController = oView.getController();
		
		if(oEvent){
			oController._oControl = oEvent.getSource();
			oController._vEnamefg = "";
		}
		
		//각 발령대상자의 발령일을 검색조건으로 설정한다.
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		if(oActda) oController._vActda = oActda.getValue();
		
		common.SearchUserList.oController = oController;
		common.SearchUserList.fPersaEnabled = true;
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearchList", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		
		oController._AddPersonDialog.open();
		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		jQuery.sap.require("common.SearchOrg");

		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList"),
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList"),
			oController = oView.getController();
	
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp"),
			vActionSubjectList_Temp = {ActionSubjectListSet : []};
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
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
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,mEmpSearchResult.getProperty(_selPath + "/Pernr"));
		
		}else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList"),
			oController = oView.getController(),
			vControlId = common.Common.getControlId(oController, oController._oControl.getId());
		
		if(vControlId.Id && vControlId.Id != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
		if(vControlId.Key && vControlId.Key != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
		oController._AddPersonDialog.close();
	},
	
	onExport : function(oTable, oColumns, subtitle) {
			var oJSONModel = oTable.getModel(),
				dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"}),
				curDate = new Date();
		
		var oSettings = {
				workbook: { columns: oColumns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
				fileName: oBundleText.getText("LABEL_0667") + "(" + subtitle + ")" + "-" + dateFormat.format(curDate) + ".xlsx"	// 667:부서별근무편제표조회
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
		oSpreadsheet.build();
	},
	
	onExport1 : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		
		oController.onExport(oTable, oController._Columns1, oBundleText.getText("LABEL_0668"));	// 668:주간근무자
	},

	onExport2 : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
		
		oController.onExport(oTable, oController._Columns2, oBundleText.getText("LABEL_0665"));	// 665:교대근무자(4조3교대)
	},

	onExport2_1 : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table2_1");
		
		oController.onExport(oTable, oController._Columns2_1, oBundleText.getText("LABEL_2901"));	// 2901:교대근무자(4조2교대)
	},

	onExport3 : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table3");
		
		oController.onExport(oTable, oController._Columns3, oBundleText.getText("LABEL_0664"));	// 664:교대근무자(3조2교대)
	},

	onExport4 : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table4");
		
		oController.onExport(oTable, oController._Columns4, oBundleText.getText("LABEL_0663"));	// 663:교대근무자(2조2교대)
	},
	
	onExport5 : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_WorkGroupInquiry.ZUI5_HR_WorkGroupInquiryList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table5");
		
		oController.onExport(oTable, oController._Columns5, oBundleText.getText("LABEL_0666"));	// 666:변경내역
	}

});
