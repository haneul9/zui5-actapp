jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_RookieEvaluation.ZUI5_HR_RookieEvaluationList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_RookieEvaluation.ZUI5_HR_RookieEvaluationList
	 */

	PAGEID : "ZUI5_HR_RookieEvaluationList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_EvalDetailJSonModel : new sap.ui.model.json.JSONModel(),
//	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_Columns : "",
	_vPersa : "" ,
	_vClsdt : "",
	_vZpayym : "",
	_vAppno : "",
	_vEvtim : "",
	_IsManager : "",
	_selectedTargetPath : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	_vZworktyp : '',
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
			curYear = curDate.getFullYear(),
			mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo"),
			vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy.MM.dd"}),
			detailData = {Data : {}};
		
		// _DetailJSonModel 초기화
		detailData.Data.Auth = _gAuth;
		detailData.Data.ZappStatAl = "";
		oController._DetailJSonModel.setData(detailData);
		
		oController._EvalDetailJSonModel.setData({Data : {}});
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1) {			
			var JSonData = { Data : { Evyer : curYear - 1, Anam01 : "", Aper01 : "", Apgrp : ""} };
			oController._ListCondJSonModel.setData(JSonData);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
		
		oTable.setVisibleRowCount(1);
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
//		this.onPressSearch();
	},
	
	onBack : function(oEvent){
	},
	
	onChangeEvyer : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_RookieEvaluation.ZUI5_HR_RookieEvaluationList"),
			oController = oView.getController();
		
		// 평가항목 조회
		oController.retrieveEvtim(oController);

		// 평가그룹 Combobox
		oController.onSetApgrp();
	},
	
	onSetApgrp : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_RookieEvaluation.ZUI5_HR_RookieEvaluationList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_FRESH_SRV"),
			oApgrp = sap.ui.getCore().byId(oController.PAGEID + "_Apgrp"),
			vEvyer = oController._ListCondJSonModel.getProperty("/Data/Evyer"),
			vAper01 = oController._ListCondJSonModel.getProperty("/Data/Aper01");
		
		if(oApgrp.getItems()) oApgrp.destroyItems();
		
		if(!vEvyer || !vAper01) return;
		
		oModel.read("/ApprApgrpSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Evyer', sap.ui.model.FilterOperator.EQ, vEvyer),
				new sap.ui.model.Filter('Appnr', sap.ui.model.FilterOperator.EQ, vAper01)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					data.results.forEach(function(elem) {
						oApgrp.addItem(new sap.ui.core.Item({
							key : elem.Apgrp,
							text : elem.Apgrptx
						}));
					});
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == 'E') {
					sap.m.MessageBox.alert(errData.ErrorMessage);
					return ;
				}
			}
		});
	},
	
	// 리스트 조회
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_RookieEvaluation.ZUI5_HR_RookieEvaluationList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_FRESH_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");

		// 테이블 sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++) {
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var aFilters = [],
			SerchCond = oController._ListCondJSonModel.getProperty("/Data");
		
		if(!SerchCond.Evyer || SerchCond.Evyer == "") return;
		if(!SerchCond.Aper01 || SerchCond.Aper01 == "") {
			sap.m.MessageBox.warning(oBundleText.getText("LABEL_2959"));	// 2959:평가자 사번을 입력하여 주십시오.
			return;
		}
		
		if(SerchCond.Evyer != "") {
			aFilters.push(new sap.ui.model.Filter('Evyer', sap.ui.model.FilterOperator.EQ, SerchCond.Evyer));
		}
		if(SerchCond.Apgrp != "" && SerchCond.Apgrp != "00000000") {
			aFilters.push(new sap.ui.model.Filter('Apgrp', sap.ui.model.FilterOperator.EQ, SerchCond.Apgrp));
		}
		if(SerchCond.Aper01 != "") {
			aFilters.push(new sap.ui.model.Filter('Aper01', sap.ui.model.FilterOperator.EQ, SerchCond.Aper01));
		}
		
		function Search() {
			var Datas = oController._ListJSonModel.getData();
			
			Datas.Data = [];
			
			oModel.read("/ApprFreshSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0; i<data.results.length; i++) {
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
			
			oController.clearEvalData(oController);
			oController._ListJSonModel.setData(Datas);
			oTable.setVisibleRowCount(Datas.Data.length > 5 ? 5 : Datas.Data.length);
			
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
	
	clearEvalData : function(oController) {
		var oBtnSave = sap.ui.getCore().byId(oController.PAGEID + "_btnCommentSave"),
			oBtnConfirm = sap.ui.getCore().byId(oController.PAGEID + "_btnCommentConfirm");
		
		oController._EvalDetailJSonModel.setData({Data : {}});
		
		oBtnSave.setVisible(false);
		oBtnConfirm.setVisible(false);
	},
	
	retrieveEvtim : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_FRESH_SRV"),
			vEvyer = oController._ListCondJSonModel.getProperty("/Data/Evyer");
		
		if(!vEvyer) return;
		
		oModel.read("/ApprEvtimSet", {
			async: false,
			filters: [
				new sap.ui.model.Filter('Evyer', sap.ui.model.FilterOperator.EQ, vEvyer)
			],
			success: function(data,res){
				if(data && data.results.length) {
					var aEvtim = [];
					data.results.forEach(function(elem) {
						aEvtim.push(elem.Evitmtx);
					});
					oController._vEvtim = aEvtim.join("\n");
				}
			},
			error: function(res){console.log(res);}
		});
	},
	
	onSelectEvalRow : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_RookieEvaluation.ZUI5_HR_RookieEvaluationList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_FRESH_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			vContext = oEvent.getParameters().rowBindingContext,
			oTableModel = oTable.getModel(),
			oBtnSave = sap.ui.getCore().byId(oController.PAGEID + "_btnCommentSave"),
			oBtnConfirm = sap.ui.getCore().byId(oController.PAGEID + "_btnCommentConfirm"),
			sData = {},
			cData = {};
		
		if(common.Common.isNull(vContext) || oTableModel.getProperty(vContext.sPath) == null) {
			return;
		}
		
		oController._selectedTargetPath = vContext.sPath;
		sData = oTableModel.getProperty(vContext.sPath);
		cData = common.Common.copyByMetadata(oModel, "ApprFresh", sData);
		
		if(cData.Comsta == "2") {
			oBtnSave.setVisible(false);
			oBtnConfirm.setVisible(false);
		} else {
			oBtnSave.setVisible(true);
			oBtnConfirm.setVisible(true);
		}
		
		if(!oController._vEvtim || oController._vEvtim == "") {
			oController.retrieveEvtim(oController);
		}
		cData.Evtim = oController._vEvtim;
		
		oController._EvalDetailJSonModel.setData({Data : cData});
	},
	
	onPressCommentSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_RookieEvaluation.ZUI5_HR_RookieEvaluationList"),
			oController = oView.getController();
		
		oController.onCommentSave(oController , "T");
	},
	
	onPressCommentSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_RookieEvaluation.ZUI5_HR_RookieEvaluationList"),
			oController = oView.getController();
		
		oController.onCommentSave(oController , "C");
	},
	
	// 의견 저장 Process
	onCommentSave : function(oController , vPrcty) { // 처리 구분
		var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_FRESH_SRV"),
			vZappStatAl	= "", 
			errData = {},
			vOData = oController._EvalDetailJSonModel.getProperty("/Data"),
			rData = {};
		
		if(!vOData) return;
		
		if(!vOData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0844"));	// 844:평가 대상이 선택되지 않았습니다.
			return "";
		}
		
		if(!vOData.Apcom) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_2957"));	// 2957:뛰어난 점이 입력되지 않았습니다.
			return "";
		}
		if(!vOData.Apadd) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_2958"));	// 2958:보완이 필요한 점이 입력되지 않았습니다.
			return "";
		}
		
		rData = common.Common.copyByMetadata(oModel, "ApprFresh", vOData);
		rData.Comsta = (vPrcty == "C") ? "2" : "1";
		
		delete rData.Hiredate;
		delete rData.Firedate;
		
		var onProcess = function() {
			oModel.create("/ApprFreshSet", rData, {
				success: function(data,res) {
					if(data.Comsta && oController._selectedTargetPath) {
						var vComsta = "",
							vComstatx = "";
						if(vPrcty == "C") {
							vComsta = "2";
							vComstatx = oBundleText.getText("LABEL_0816");	// 0816:완료
							
							sap.ui.getCore().byId(oController.PAGEID + "_btnCommentSave").setVisible(false);
							sap.ui.getCore().byId(oController.PAGEID + "_btnCommentConfirm").setVisible(false);
						} else {
							vComsta = "1";
							vComstatx = oBundleText.getText("LABEL_0177");	// 0177:저장
						}
						
						oController._EvalDetailJSonModel.setProperty("/Data/Comsta", vComsta);
						oController._ListJSonModel.setProperty(oController._selectedTargetPath + "/Comsta", vComsta);
						oController._ListJSonModel.setProperty(oController._selectedTargetPath + "/Comstatx", vComstatx);
						oController._ListJSonModel.refresh();
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
			vInfoTxt = oBundleText.getText("LABEL_0837");	// 837:완료하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0838");	// 838:완료가 완료되었습니다.
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
	
	SmartSizing : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_RookieEvaluation.ZUI5_HR_RookieEvaluationList");
		var oController = oView.getController();
	},
	
	_AddPersonDialog : null ,
	
	EmpSearchByTx :function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_RookieEvaluation.ZUI5_HR_RookieEvaluationList"),
			oController = oView.getController(),
			oControl = oEvent.getSource(),
			vEname = oControl.getValue(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = {EmpSearchResultSet : []},
			oFilters = [];
		
		common.SearchUserList.oController = oController;
		oController._vEnamefg = "";
		
		if(!vEname || vEname == ""){
			if(oController._ListCondJSonModel.getProperty("/Data")){
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
				
				oController.onSetApgrp();
			}else{
				oController._vEnamefg = "X";
				oController.displayEmpSearchDialog();
			}
		}	
	},
	
	displayEmpSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_RookieEvaluation.ZUI5_HR_RookieEvaluationList");
		var oController = oView.getController();
		if(oEvent){
			oController._oControl = "";
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_RookieEvaluation.ZUI5_HR_RookieEvaluationList");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_RookieEvaluation.ZUI5_HR_RookieEvaluationList");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_RookieEvaluation.ZUI5_HR_RookieEvaluationList");
		var oController = oView.getController();
	
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
		var vActionSubjectList_Temp = {ActionSubjectListSet : []};
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"); 
		var vIDXs = oTable.getSelectedIndices();
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(vIDXs.length > 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는 한명만 선택이 가능합니다.
				return;
			}else if(vIDXs.length < 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}

			var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath;
			
			oController._ListCondJSonModel.setProperty("/Data/Aper01", mEmpSearchResult.getProperty(_selPath + "/Pernr"));
			oController._ListCondJSonModel.setProperty("/Data/Anam01", mEmpSearchResult.getProperty(_selPath + "/Ename"));
			
			oController.onPressSearch();
			
			oController.onSetApgrp();
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_RookieEvaluation.ZUI5_HR_RookieEvaluationList");
		var oController = oView.getController();
		
		oController._ListCondJSonModel.setProperty("/Data/Aper01", "");
		oController._ListCondJSonModel.setProperty("/Data/Anam01", "");
		oController._AddPersonDialog.close();
		
		oController.onSetApgrp();
	},
	
	onExport : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_RookieEvaluation.ZUI5_HR_RookieEvaluationList");
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
				fileName: oBundleText.getText("LABEL_2945") + "-" + dateFormat.format(curDate) + ".xlsx"	// 2945:신입사원 역량평가
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	}
});