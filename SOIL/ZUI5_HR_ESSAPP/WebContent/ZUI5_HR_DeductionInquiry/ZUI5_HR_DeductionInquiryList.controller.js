jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList
	 */

	PAGEID : "ZUI5_HR_DeductionInquiryList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListClubJSonModel : new sap.ui.model.json.JSONModel(),
	_ListManagerJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_DedcdTableJSonModel : new sap.ui.model.json.JSONModel(),
	_ColumnsClub : "",
	_ColumnsManager : "",
	_vPersa : "" ,
	_vClsdt : "",
	_vZpayym : "",
	_vAppno : "",
	_selectedDedcd : "",
	_useCustomPernrSelection : "",
	_selectionRowIdx : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
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
			prevDate = curDate,
			mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo"),
			vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
			vEname = "",
			vEncid = "";
		
		oController._TargetJSonModel.setProperty("/Data/Auth", _gAuth);
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", "");
		common.TargetUser.oController = oController;
		common.TargetUser.onSetTarget(oController);
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1) {			
//			if(_gAuth == "E" && vEmpLoginInfo.length > 0) {
//				vEname = vEmpLoginInfo[0].Ename ;
//				vPernr = vEmpLoginInfo[0].Pernr ;
//			}
			
			var JSonData = { Data : { Begda : dateFormat.format(prevDate) , Endda : dateFormat.format(curDate), Dedcd : "", Encid : vEncid, Ename : vEname }};
			oController._ListCondJSonModel.setData(JSonData);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
	},

	onAfterShow : function(oEvent) {
		var oController = this,
			oManagerTable = sap.ui.getCore().byId(oController.PAGEID + "_ManagerTable");
		
		this.SmartSizing(oEvent);
		
		this.onPressSearch();
		
		oController._ListManagerJSonModel.setData({Data : []});
		oManagerTable.setVisibleRowCount(0);
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
	
	DedtxSearchInput : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
			oController = oView.getController(),
			vDedtx = oEvent.getSource().getValue();
		
		if(!oController._DedcdDialog) {
			oController._DedcdDialog = sap.ui.jsfragment("ZUI5_HR_DeductionInquiry.fragment.DedcdDialog", oController);
			oView.addDependent(oController._DedcdDialog);
		}
		
		sap.ui.getCore().byId(oController.PAGEID + "_SearchInput").setValue(vDedtx);
		
		oController.onSearchDedcd();
		
		oController._DedcdDialog.open();
	},
	
	displayDedgbDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
			oController = oView.getController();
		
		if(!oController._DedcdDialog) {
			oController._DedcdDialog = sap.ui.jsfragment("ZUI5_HR_DeductionInquiry.fragment.DedcdDialog", oController);
			oView.addDependent(oController._DedcdDialog);
		}
		
		oController.onSearchDedcd();
		
		oController._DedcdDialog.open();
	},
	
	onSelectDedcd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
			oController = oView.getController();
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DedcdTable"),
			oSearchInput = sap.ui.getCore().byId(oController.PAGEID + "_SearchInput"),
			vIDXs = oTable.getSelectedIndices(),
			dedcdTableData = null;
			
		if(vIDXs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0458"));	// 458:공제를 선택하여 주세요.
			return;
		} else if(vIDXs.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0459"));	// 459:공제를 하나만 선택하여 주세요.
			return;
		}
		
		vIDXs = vIDXs[0];
		dedcdTableData = oController._DedcdTableJSonModel.getProperty(oTable.getContextByIndex(vIDXs).sPath);
		
		oController._ListCondJSonModel.setProperty("/Data/Dedcd", dedcdTableData.Dedcd);
		oController._ListCondJSonModel.setProperty("/Data/Dedtx", dedcdTableData.Dedtx);
		
		oSearchInput.setValue("");
		oTable.clearSelection();
		
		oController._DedcdDialog.close();
	},

	onSearchDedcd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DedcdTable"),
			oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_MNG_SRV"),
			vDedtx = sap.ui.getCore().byId(oController.PAGEID + "_SearchInput").getValue(),
			aFilters = [],
			vData = {Data : []};
		
		aFilters.push(new sap.ui.model.Filter('Dedgb', sap.ui.model.FilterOperator.EQ, "0010"));
		if(vDedtx) {
			aFilters.push(new sap.ui.model.Filter('Dedtx', sap.ui.model.FilterOperator.EQ, vDedtx));
		}
		
		oModel.read("/DedcdListSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					var i = 1;
					data.results.forEach(function(elem) {
						elem.Idx = i++;
						
						vData.Data.push(elem);
					});
					
					oController._DedcdTableJSonModel.setData(vData);
					oTable.setVisibleRowCount(vData.Data.length > 15 ? 15 : vData.Data.length);
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
	
	// 리스트 조회
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_MNG_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_ClubTable"),
			oColumns = oTable.getColumns(),
			aFilters = [],
			SerchCond = oController._ListCondJSonModel.getProperty("/Data");

		// 테이블 sort, filter 제거
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		if(SerchCond.Begda != "" && SerchCond.Endda != "") {
			if(common.Common.checkDate(SerchCond.Begda, SerchCond.Endda) == false) {
				return ;
			}
		}
		
		if(SerchCond.Begda != "") {
			aFilters.push(new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Begda").getDateValue())));
		}
		if(SerchCond.Endda != "") {
			aFilters.push(new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Endda").getDateValue())));
		}
		if(SerchCond.Dedcd != "") {
			aFilters.push(new sap.ui.model.Filter('Dedcd', sap.ui.model.FilterOperator.EQ, SerchCond.Dedcd));
		}
		if(SerchCond.Encid != "") {
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, SerchCond.Encid));
		}
		
		function Search() {
			var Datas = {Data : []};
			
			oModel.read("/DedObjMemSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0;i<data.results.length;i++) {
							var OneData = data.results[i];
							
							OneData.Idx = i + 1;
							
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
			
			oController._ListClubJSonModel.setData(Datas);
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ClubTable"),
				oManagerTable = sap.ui.getCore().byId(oController.PAGEID + "_ManagerTable");
			
			oTable.setVisibleRowCount(Datas.Data.length > 15 ? 15 : Datas.Data.length);
			oController._ListManagerJSonModel.setData({Data : []});
			oManagerTable.setVisibleRowCount(0);
			
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
	},
	
	_AddPersonDialog : null,
	
	EmpSearchByTx :function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
			oController = oView.getController();
		
		oController._useCustomPernrSelection = "X";
		oController._selectionRowIdx = "";
		
		common.TargetUser.displayEmpSearchDialog();
		
	},
	
	onAfterSelectPernr : function(oController) {
		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		jQuery.sap.require("common.SearchOrg");

		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
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
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,mEmpSearchResult.getProperty(_selPath + "/Encid"));
		
		}else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
			oController = oView.getController(),
			vControlId = common.Common.getControlId(oController, oController._oControl.getId());
		
		if(vControlId.Id && vControlId.Id != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
		if(vControlId.Key && vControlId.Key != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
		oController._AddPersonDialog.close();
	},
	
	SmartSizing : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
//			oController = oView.getController();
	},
	
	retrieveTargetPerList : function(oController, paramObj) {
		var oModel = oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_MNG_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_ManagerTable"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			vLoginPernr = oController._TargetJSonModel.getProperty("/Data/Pernr"),
			oBtnCopy = sap.ui.getCore().byId(oController.PAGEID + "_BtnCopy"),
			oBtnAdd = sap.ui.getCore().byId(oController.PAGEID + "_BtnAdd"),
			oBtnSave = sap.ui.getCore().byId(oController.PAGEID + "_BtnSave"),
			isEditable = false,
			vData = {Data : []};
		
		oController._selectedDedcd = paramObj.Dedcd;
		
		oTable.clearSelection();
		oController._ListManagerJSonModel.setData(vData);
		oController._ListManagerJSonModel.refresh();
		oTable.setVisibleRowCount(0);
		
		oModel.read("/DedPerListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Dedcd', sap.ui.model.FilterOperator.EQ, paramObj.Dedcd),
				new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(paramObj.Begda)),
				new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(paramObj.Endda))
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					data.results.forEach(function(elem) {
						if(elem.Pernr === vLoginPernr) isEditable = true;
					});
					
					var i = 1;
					data.results.forEach(function(elem) {
						elem.Idx = i++;
						elem.Begda = dateFormat.format(elem.Begda);
						elem.Endda = dateFormat.format(elem.Endda);
						elem.Isedit = isEditable;
						
						vData.Data.push(elem);
					});
					
					oController._ListManagerJSonModel.setData(vData);
					oTable.setVisibleRowCount(vData.Data.length);
					
					oBtnCopy.setVisible(isEditable);
					oBtnAdd.setVisible(isEditable);
					oBtnSave.setVisible(isEditable);
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
	
	onRowDblClick : function(e) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_ClubTable"),
			oModel = oTable.getModel(),
			oTableTxt = sap.ui.getCore().byId(oController.PAGEID + "_TableTxt"),
			vIDXs = oTable.getSelectedIndices(),
			selectRowObject = {};
		
		if(vIDXs.length < 1){
//			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0547"));	// 547:Data를  선택하여 주십시오.
			return;
		}
		
		try {
			selectRowObject = oModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath);
		} catch (e) {
			console.log(e);
		}
		
		oController.BusyDialog.open();
		
		oTableTxt.setText(selectRowObject.Dedtx);
		oTableTxt.setVisible(true);
		
		oController.retrieveTargetPerList(oController, selectRowObject);
		
		oController.BusyDialog.close();
	},
	
	onClubDblclick : function(e) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_ClubTable"),
			oTableTxt = sap.ui.getCore().byId(oController.PAGEID + "_TableTxt"),
			selectRowIndex = e.getParameter('rowIndex'),
			selectRowObject = oTable.getModel().getProperty(oTable.getContextByIndex(selectRowIndex).sPath);
		
		oController.BusyDialog.open();
		
		oTableTxt.setText(selectRowObject.Dedtx);
		oTableTxt.setVisible(true);
		
		oController.retrieveTargetPerList(oController, selectRowObject);
		
		oController.BusyDialog.close();
	},
	
	onPressDeleteFromList : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_ManagerTable"),
			oModel = oTable.getModel(),
			tableNodes = oModel.getData().Data,
			index = oEvent.getSource().getParent().getIndex();
		
		tableNodes.splice(index, 1);
		oTable.setVisibleRowCount(oModel.getProperty('/Data').length);
		oModel.refresh(true);
	},
	
	onRowPernrChange : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
			oController = oView.getController(),
			vSeqno = oEvent.getSource().getCustomData()[0].getValue(),
			vIdx = vSeqno * 1 - 1 ;
		
		oController._useCustomPernrSelection = "X";
		oController._selectionRowIdx = vIdx;
		
		common.TargetUser.displayEmpSearchDialog();
	},
	
	customPernrSelection : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
			oController = oView.getController(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet"),
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
			
			var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath,
				svPernr = mEmpSearchResult.getProperty(_selPath + "/Pernr"),
				svEncid = mEmpSearchResult.getProperty(_selPath + "/Encid"),
				svPerid = mEmpSearchResult.getProperty(_selPath + "/Perid"),
				svEname = mEmpSearchResult.getProperty(_selPath + "/Ename");
			
			if(oController._selectionRowIdx == "") {
				oController._ListCondJSonModel.setProperty("/Data/Ename", svEname);
				oController._ListCondJSonModel.setProperty("/Data/Perid", svPerid);
				oController._ListCondJSonModel.setProperty("/Data/Pernr", svPernr);
				oController._ListCondJSonModel.setProperty("/Data/Encid", svEncid);
			} else {
				var vTableData = oController._ListManagerJSonModel.getData(),
					vData = vTableData.Data;
				
				// 중복체크
				if(vData.length) {
					try {
						vData.forEach(function(prop, index, array) {
							if(prop.Pernr == svPernr) {
								throw new Error(oBundleText.getText("LABEL_0056"));	// 56:이미 추가된 대상입니다.
							}
						});
					} catch(ex) {
						sap.m.MessageBox.alert(ex.message);
						return;
					}
				}
				
				var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_ManagerTable");
				
				oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Pernr", svPernr);
				oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Encid", svEncid);
				oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Perid", svPerid);
				oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Ename", svEname);
				oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/ZappStatAl", "");
			}
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	customPernrClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
			oController = oView.getController();
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	clearCustomPernrSearchOption : function(oController) {
		oController._useCustomPernrSelection = '';
		oController._selectionRowIdx = null;
		oController._vEnamefg = "";
	},
	
	onPressCopy : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_ManagerTable"),
			oModel = oTable.getModel(),
			vIndex = oTable.getSelectedIndices(),
			sPath = null,
			orgData = {},
			copyData = {};
		
		if(!oController._selectedDedcd) return;
		
		if(vIndex.length != 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0027"), {title : oBundleText.getText("LABEL_0053")});	// 27:복사할 데이터를 한 건만 선택하여 주십시오.
			return;
		}
		
		sPath = oTable.getContextByIndex(vIndex[0]).sPath;
		orgData = oModel.getProperty(sPath);
		
		Object.keys(orgData).map(function(key, index) {
			copyData[key] = orgData[key];
		});
		copyData.Idx = oModel.getProperty('/Data').length + 1;
		
		oModel.getProperty('/Data').push(copyData);
		oTable.setVisibleRowCount(oModel.getProperty('/Data').length);
		oModel.refresh(true);
	},
	
	onPressAdd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_ManagerTable"),
			oModel = oTable.getModel(),
			addData = {};
		
		if(!oController._selectedDedcd) return;
		
		addData.Idx = oModel.getProperty('/Data').length + 1;
		addData.Endda = "9999.12.31";
		addData.Isedit = true;
		
		oModel.getProperty('/Data').push(addData);
		oTable.setVisibleRowCount(oModel.getProperty('/Data').length);
		oModel.refresh(true);
	},
	
	onValidationData : function(oController){		
		var targetDatas = oController._ListManagerJSonModel.getProperty("/Data");
		
		if(targetDatas.constructor !== Array || targetDatas.length < 1) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0501"), {title : oBundleText.getText("LABEL_0053")});	// 501:담당자 정보를 입력하여 주십시오.
			return false;
		}
		
		var isDup = false, isInputValid = true, aPernr = [];
		targetDatas.some(function(elem, index) {
			if(aPernr.indexOf(elem.Pernr) > -1) {
				isDup = true;
				return true;
			} else {
				aPernr.push(elem.Pernr);
			}
			
			if(!elem.Repgb || !elem.Begda || !elem.Pernr) {
				isInputValid = false;
				return true;
			}
		});
		
		if(isDup) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0066"), {title : oBundleText.getText("LABEL_0053")});	// 66:중복입력한 대상자가 있어서 신청이 불가능합니다.
			return false;
		}
		if(!isInputValid) {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0500"), {title : oBundleText.getText("LABEL_0053")});	// 500:담당구분과 성명, 시작일을 모두 입력하세요.
			return false;
		}
		
		return true;
	},

	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_MNG_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_ManagerTable"),
			createData = {},
			errData = {};
		
		if(!oController._selectedDedcd) return;
		
		if(!oController.onValidationData(oController)) return;
		
		var onProcess = function() {
			
			var vTableData = oTable.getModel().getProperty('/Data'),
				vDetailDataList = [],
				vDetailData = {};
			
			vTableData.forEach(function(element) {
				vDetailData = {};
				vDetailData = common.Common.copyByMetadata(oModel, "DedPerList", element);
				vDetailData.Dedcd = oController._selectedDedcd;
				vDetailData.Begda = "\/Date("+ common.Common.getTime(vDetailData.Begda)+")\/";
				vDetailData.Endda = "\/Date("+ common.Common.getTime(vDetailData.Endda)+")\/";
				
				vDetailDataList.push(vDetailData);
			});
		
			createData.Dedcd = oController._selectedDedcd;
			createData.DetailNav = vDetailDataList;
			
			oModel.create("/DedObjMemSet", createData, {
				success : function(data, res) {
					if(data) {
					} 
				},
				error : function (Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == "E"){
				oController.BusyDialog.close();
				sap.m.MessageBox.alert(errData.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				return;
			}
			
			oController.BusyDialog.close();
			
			sap.m.MessageBox.show(vCompTxt, {
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				onClose : oController.onBack
			});
		};
		
		var CreateProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		var vInfoTxt = oBundleText.getText("LABEL_0061");	// 61:저장하시겠습니까?
		var vCompTxt = oBundleText.getText("LABEL_0060") ;	// 60:저장이 완료되었습니다.
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},
	
	onClubExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_ClubTable"),
			oJSONModelData = oTable.getModel().getProperty("/Data"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"}),
			curDate = new Date();
		
		if(oJSONModelData.length < 1) return;
		
		var oSettings = {
			workbook: { columns: oController._ColumnsClub },
			dataSource: oJSONModelData,
			worker: false, // We need to disable worker because we are using a MockServer as OData Service
		    fileName: oBundleText.getText("LABEL_0497") + "-" + dateFormat.format(curDate) + ".xlsx"	// 497:동호회 목록
		};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	},
	
	onManagerExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionInquiry.ZUI5_HR_DeductionInquiryList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_ManagerTable"),
			oJSONModelData = oTable.getModel().getProperty("/Data"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"}),
			curDate = new Date();
		
		if(oJSONModelData.length < 1) return;
		
		var oSettings = {
			workbook: { columns: oController._ColumnsManager },
			dataSource: oJSONModelData,
			worker: false, // We need to disable worker because we are using a MockServer as OData Service
		    fileName: oBundleText.getText("LABEL_0496") + "-" + dateFormat.format(curDate) + ".xlsx"	// 496:담당자 정보
		};
	
		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	}
});