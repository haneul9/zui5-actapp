jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_Transition.ZUI5_HR_TransitionDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Transition.ZUI5_HR_TransitionDetail
	 */

	PAGEID : "ZUI5_HR_TransitionDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_ErrorTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vAppno : "",
	_vReqPernr : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "PD01",
	_ObjList : [],
	_useCustomPernrSelection : "",
	_selectionRowIdx : null,
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
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			vFromPageId = "",
			oDetailData = {Data : {}},
			oDetailTableData = {Data : []};
		
		oController.BusyDialog.open();
		
		// parameter, 리턴페이지 처리
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno || '';
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		// 상세 조회
		oController.retrieveDetail(oController, oDetailData);
		
		// 상세화면 Default Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = oDetailData.Data.ZappStatAl || '';
		oController._DetailJSonModel.setData(oDetailData);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 신청시 초기값 셋팅
		if(!oController._vAppno && _gAuth == "E") {
			oController._DetailJSonModel.setProperty("/Data/Hoorgeh", oController._TargetJSonModel.getProperty("/Data/Orgeh"));
			oController._DetailJSonModel.setProperty("/Data/Hoorgtx", oController._TargetJSonModel.getProperty("/Data/Orgtx"));
			oController._DetailJSonModel.setProperty("/Data/Hojikch", oController._TargetJSonModel.getProperty("/Data/Zzjikch"));
			oController._DetailJSonModel.setProperty("/Data/Hojikcht", oController._TargetJSonModel.getProperty("/Data/Zzjikcht"));
		}
		
		// 상세테이블 조회
		oController.retrieveDetailTable(oController, oDetailTableData, oDetailData.Data.ZappStatAl);
		
		// 상세테이블 Binding
		oController._DetailTableJSonModel.setData(oDetailTableData);
		oTable.setVisibleRowCount(oDetailTableData.Data.length);
		
		// 신규 결재번호 채번
		oController.getAppno(oController);
		
		// 결재번호 binding
		oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);

		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
		
		// buildCombo
		oController.buildCombo(oController);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Transition.ZUI5_HR_TransitionDetail");
		var oController = oView.getController();
		
		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
				id : oController._vFromPage ,
				data : {}
			});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
				id : "ZUI5_HR_Transition.ZUI5_HR_TransitionList",
				data : { }
			});	
		}
		
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Transition.ZUI5_HR_TransitionDetail");
		var oController = oView.getController();
	},
	
	commonAction : function(oController, oDetailData) {
		// 대상자 조회
		common.TargetUser.oController = oController;
		common.TargetUser.onSetTarget(oController);
		
		// 신청자 조회
		common.ApplyUser.oController = oController;
		common.ApplyUser.onSetApplicant(oController);
		
		// 진행상태 신청자, 대상자 Model 업데이트
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", oDetailData.Data.ZappStatAl);
		oController._ApplyJSonModel.setProperty("/Data/ZappStatAl", oDetailData.Data.ZappStatAl);
		
		// 신청안내
		common.ApplyInformation.onSetApplyInformation(oController);
		
		// 결재내역 
		common.ApprovalInformation.onSetApprovalInformation(oController);
	},
	
	buildCombo : function(oController) {
		oController.onSetHoreasn(oController);
	},
	
	onSetHoreasn : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV"),
			oHoreasn = sap.ui.getCore().byId(oController.PAGEID + "_Horeasn");
		
		if(oHoreasn.getItems()) oHoreasn.destroyItems();
		
		oModel.read("/TakingOverReasnSet", {
			async : false,
			success : function(data, res) {
				if(data && data.results.length) {
					data.results.sort(function(a, b) {
						return Number(a.Code) - Number(b.Code);
					});
					
					data.results.forEach(function(elem) {
						oHoreasn.addItem(new sap.ui.core.Item({
							key : elem.Code,
							text : elem.Text
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
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/TakingOverApplySet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				oDetailData.Data = data.results[0];
				oDetailData.Data.Actdt = dateFormat.format(oDetailData.Data.Actdt);
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage, {
				onClose : function() {
					oController.BusyDialog.close();
					oController.onBack();
				}
			});
			return ;
		}
	},
	
	retrieveDetailTable : function(oController, oDetailTableData, vZappStatAl) {
		var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV"),
			vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"),
			aFilters = [],
			errData = {};
		
		if(oController._vAppno) {
			aFilters.push(new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno));
		}
		
		oModel.read("/TakingOverItemSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data && data.results.length) {
					var vIdx = 1;
					data.results.forEach(function(element) {
						element.Idx = vIdx++;
						element.ZappStatAl = vZappStatAl;
						element.Pernr = vPernr;
						
						oDetailTableData.Data.push(element);
					});
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage, {});
			return ;
		}
	},
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV"),
			errData = {};
		
		oModel.read("/TakingOverApplySet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'I')
			],
			success : function(data, res) {
				oController._vAppno = data.results[0].Appno;
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
		
		if(errData.Error && errData.Error == "E"){
			sap.m.MessageBox.alert(errData.ErrorMessage, {
				onClose : function() {
					oController.BusyDialog.close();
					oController.onBack();
				}
			});
			return ;
		}
	},
	
	setPageHeader : function(oController, vZappStatAl) {
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		
		if(vZappStatAl == "") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0535") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 535:인수인계서 작성
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0535") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 535:인수인계서 작성
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0535") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 535:인수인계서 작성
		}
	},
	
	toggleAllCheck : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Transition.ZUI5_HR_TransitionDetail"),
			oController = oView.getController(),
			vTableData = oController._DetailTableJSonModel.getData(),
			vZappStatAl = vTableData.Data[0].ZappStatAl,
			vPernr = vTableData.Data[0].Pernr,
			isChecked = oEvent.getSource().getSelected();
		
		if((vZappStatAl == "" || vZappStatAl == "10") && vPernr) {
			vTableData.Data.forEach(function(elem) {
				elem.Itck = isChecked;
			});
			
			oController._DetailTableJSonModel.setData(vTableData);
		} else {
			oEvent.getSource().setSelected(false);
		}
	},
	
	displayOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Transition.ZUI5_HR_TransitionDetail"),
			oController = oView.getController();
		
		oController.vCallControlId = oEvent.getSource().getId();
		oController.vCallControlType = oEvent.getSource().getCustomData()[0].getValue();
		
		if(!oController._SerachOrgDialogInView) {
			oController._SerachOrgDialogInView = sap.ui.jsfragment("ZUI5_HR_Transition.fragment.OrgSearch", oController);
			oView.addDependent(oController._SerachOrgDialogInView);
		}
		oController._SerachOrgDialogInView.open();
	},
	
	openSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Transition.ZUI5_HR_TransitionDetail"),
			oController = oView.getController();
		
		oController.vCallControlId = oEvent.getSource().getId();
		oController.vCallControlType = oEvent.getSource().getCustomData()[0].getValue();
		
		if(!oController._SerachDialogInView) {
			oController._SerachDialogInView = sap.ui.jsfragment("ZUI5_HR_Transition.fragment.SearchDialog", oController);
			oView.addDependent(oController._SerachDialogInView);
		}
		
		ZUI5_HR_Transition.control.ObjectSearch.onKeyUp();
		
		oController._SerachDialogInView.open();
	},
	
	onChangePerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Transition.ZUI5_HR_TransitionDetail"),
			oController = oView.getController(),
			oControl = oEvent.getSource(),
			vEname = oControl.getValue(),
			vResetKey = oEvent.getSource().getCustomData()[0].getKey(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = {EmpSearchResultSet : []};
		
		if(!vEname) {
			oController._DetailJSonModel.setProperty("/Data/" + vResetKey, undefined);
			return;
		}
		
		common.SearchUserList.oController = oController;
		oController._vEnamefg = "";
		
		oController._oControl = oControl;
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV"),
			curDate = new Date();
		
		try {
			oCommonModel.read("/EmpSearchResultSet", {
				async: false,
				filters: [
//					new sap.ui.model.Filter('Persa', sap.ui.model.FilterOperator.EQ, '1000'),
					new sap.ui.model.Filter('Actda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(curDate)),
					new sap.ui.model.Filter('Ename', sap.ui.model.FilterOperator.EQ, vEname),
					new sap.ui.model.Filter('Stat1', sap.ui.model.FilterOperator.EQ, '3'),
					new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth)
				],
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
		
		var vControlId = common.Common.getControlId(oController, oControl.getId());
		
		if(vEmpSearchResult.EmpSearchResultSet.length == 1){
			if(vControlId.Id == "Accid") {
				oController._DetailJSonModel.setProperty("/Data/Accpn", vEmpSearchResult.EmpSearchResultSet[0].Pernr);
				oController._DetailJSonModel.setProperty("/Data/Accid", vEmpSearchResult.EmpSearchResultSet[0].Perid);
				oController._DetailJSonModel.setProperty("/Data/Accpnnm", vEmpSearchResult.EmpSearchResultSet[0].Ename);
			} else if(vControlId.Id == "Entp1id") {
				oController._DetailJSonModel.setProperty("/Data/Entp1id", vEmpSearchResult.EmpSearchResultSet[0].Perid);
				oController._DetailJSonModel.setProperty("/Data/Entp1", vEmpSearchResult.EmpSearchResultSet[0].Pernr);
				oController._DetailJSonModel.setProperty("/Data/Entp1nm", vEmpSearchResult.EmpSearchResultSet[0].Ename);
			} else if(vControlId.Id == "Entp2id") {
				oController._DetailJSonModel.setProperty("/Data/Entp2id", vEmpSearchResult.EmpSearchResultSet[0].Perid);
				oController._DetailJSonModel.setProperty("/Data/Entp2", vEmpSearchResult.EmpSearchResultSet[0].Pernr);
				oController._DetailJSonModel.setProperty("/Data/Entp2nm", vEmpSearchResult.EmpSearchResultSet[0].Ename);
			}
		}else{
			oController._useCustomPernrSelection = "X";
			oController._selectionRowIdx = (vControlId.Id == "Accid") ? 1 : (vControlId.Id == "Entp1id") ? 2 : 3;
			oController._vEnamefg = "X";
			
			common.TargetUser.displayEmpSearchDialog();
		}
	},
	
	displayAccpnDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Transition.ZUI5_HR_TransitionDetail"),
			oController = oView.getController();
		
		oController._useCustomPernrSelection = "X";
		oController._selectionRowIdx = 1;
		
		common.TargetUser.displayEmpSearchDialog();
	},

	displayEntp1Dialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Transition.ZUI5_HR_TransitionDetail"),
			oController = oView.getController();
		
		oController._useCustomPernrSelection = "X";
		oController._selectionRowIdx = 2;
		
		common.TargetUser.displayEmpSearchDialog();
	},

	displayEntp2Dialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Transition.ZUI5_HR_TransitionDetail"),
			oController = oView.getController();
		
		oController._useCustomPernrSelection = "X";
		oController._selectionRowIdx = 3;
		
		common.TargetUser.displayEmpSearchDialog();
	},
	
	customPernrSelection : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Transition.ZUI5_HR_TransitionDetail"),
			oController = oView.getController();
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
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
				svPerid = mEmpSearchResult.getProperty(_selPath + "/Perid"),
				svEname = mEmpSearchResult.getProperty(_selPath + "/Ename");
			
			if(oController._selectionRowIdx == 1) {
				oController._DetailJSonModel.setProperty("/Data/Accid", svPerid);
				oController._DetailJSonModel.setProperty("/Data/Accpn", svPernr);
				oController._DetailJSonModel.setProperty("/Data/Accpnnm", svEname);
			} else if(oController._selectionRowIdx == 2) {
				oController._DetailJSonModel.setProperty("/Data/Entp1id", svPerid);
				oController._DetailJSonModel.setProperty("/Data/Entp1", svPernr);
				oController._DetailJSonModel.setProperty("/Data/Entp1nm", svEname);
			} else if(oController._selectionRowIdx == 3) {
				oController._DetailJSonModel.setProperty("/Data/Entp2id", svPerid);
				oController._DetailJSonModel.setProperty("/Data/Entp2", svPernr);
				oController._DetailJSonModel.setProperty("/Data/Entp2nm", svEname);
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_Transition.ZUI5_HR_TransitionDetail"),
			oController = oView.getController();
		
		if(oController._selectionRowIdx == 1) {
			oController._DetailJSonModel.setProperty("/Data/Accid", undefined);
			oController._DetailJSonModel.setProperty("/Data/Accpn", undefined); 
			oController._DetailJSonModel.setProperty("/Data/Accpnnm", undefined); 
		} else if(oController._selectionRowIdx == 2) {
			oController._DetailJSonModel.setProperty("/Data/Entp1id", undefined);
			oController._DetailJSonModel.setProperty("/Data/Entp1", undefined); 
			oController._DetailJSonModel.setProperty("/Data/Entp1nm", undefined); 
		} else if(oController._selectionRowIdx == 3) {
			oController._DetailJSonModel.setProperty("/Data/Entp2id", undefined);
			oController._DetailJSonModel.setProperty("/Data/Entp2", undefined); 
			oController._DetailJSonModel.setProperty("/Data/Entp2nm", undefined); 
		}
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	clearCustomPernrSearchOption : function(oController) {
		oController._useCustomPernrSelection = '';
		oController._selectionRowIdx = null;
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController){
		var detailData = oController._DetailJSonModel.getProperty("/Data"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		
		delete detailData.Hoorgeh;	// 인계조직
		delete detailData.Hoorgtx;	// 인계조직명
		delete detailData.Hojikch;	// 인계직책
		delete detailData.Hojikcht;	// 인계직책명
		delete detailData.Horeasn;	// 인계사유
		delete detailData.Actdt;	// 발령일
		delete detailData.Accid;	// 인수자
		delete detailData.Accpn;	// 인수자
		delete detailData.Accpnnm;	// 인수자
		delete detailData.Entp1id;	// 입회자
		delete detailData.Entp1;	// 입회자
		delete detailData.Entp1nm;	// 입회자
		delete detailData.Entp2id;	// 입회자2
		delete detailData.Entp2;	// 입회자2
		delete detailData.Entp2nm;	// 입회자2
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
	},	
	
	onAfterSelectPernr : function(oController) {
		// 신청내역 초기화
		oController.onResetDetail(oController);
		
		// 초기값 셋팅
		oController._DetailJSonModel.setProperty("/Data/Hoorgeh", oController._TargetJSonModel.getProperty("/Data/Orgeh"));
		oController._DetailJSonModel.setProperty("/Data/Hoorgtx", oController._TargetJSonModel.getProperty("/Data/Orgtx"));
		oController._DetailJSonModel.setProperty("/Data/Hojikch", oController._TargetJSonModel.getProperty("/Data/Zzjikch"));
		oController._DetailJSonModel.setProperty("/Data/Hojikcht", oController._TargetJSonModel.getProperty("/Data/Zzjikcht"));
		
		// 인수인계 항목 사번 update
		var detailTableData = oController._DetailTableJSonModel.getProperty("/Data"),
			vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
		
		detailTableData.forEach(function(elem) {
			elem.Pernr = vPernr;
		});
		
		// 상세테이블 Binding
		oController._DetailTableJSonModel.setData({Data : detailTableData});
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Transition.ZUI5_HR_TransitionDetail");
		var oController = oView.getController();

		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Transition.ZUI5_HR_TransitionDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty) {
		var vErrorMessage = "";
		
		if(oController.onValidationData(oController, vPrcty) == false) return;
		
		var onProcess = function(){
			// 근무편제변경 저장
			var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV"),
				oneData = oController._DetailJSonModel.getProperty("/Data"),
				createData = {};
			
			createData = common.Common.copyByMetadata(oModel, "TakingOverApply", oneData);
			createData.Actdt = "\/Date("+ common.Common.getTime(createData.Actdt)+")\/";
			createData.Prcty = vPrcty;
			createData.Actty = _gAuth;
			
			var vDetailDataList = [], vDetailData = {},
				vTableData = oController._DetailTableJSonModel.getProperty("/Data");
			
			vTableData.forEach(function(element) {
				if(element.Itck) {
					vDetailData = {};
					vDetailData = common.Common.copyByMetadata(oModel, "TakingOverItem", element);
					vDetailData.Appno = createData.Appno;
					
					vDetailDataList.push(vDetailData);
				}
			});
			
			createData.TakingOverItemSet = vDetailDataList;
			
			var saveError = "",
				errorList = [];
			oModel.create("/TakingOverApplySet", createData, {
				success : function(data, res) {
					if(data) {
					} 
				},
				error : function (Res) {
					var errData = common.Common.parseError(Res);
					vErrorMessage = errData.ErrorMessage;
				}
			});
			
			if(vErrorMessage != ""){
				oController.BusyDialog.close();
				sap.m.MessageBox.alert(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
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
		
		var vInfoTxt = "" , vCompTxt = "";
		
		if(vPrcty == "T"){
			vInfoTxt = oBundleText.getText("LABEL_0061");	// 61:저장하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0060") ;	// 60:저장이 완료되었습니다.
		}else {
			vInfoTxt = oBundleText.getText("LABEL_0051");	// 51:신청하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0048");	// 48:신청이 완료되었습니다.
		}
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},
	
	onValidationData : function(oController, vPrcty){		
		var oneData = oController._DetailJSonModel.getProperty("/Data"),
			tableData = oController._DetailTableJSonModel.getProperty("/Data");
		
		if(!oneData.Pernr){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return false;
		}
		
		if(vPrcty == "C") {
			if(!oneData.Hoorgeh){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0540"), {title : oBundleText.getText("LABEL_0053")});	// 540:인계조직을 입력하여 주십시오.
				return false;
			}
			if(!oneData.Hojikch){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0541"), {title : oBundleText.getText("LABEL_0053")});	// 541:인계직책을 입력하여 주십시오.
				return false;
			}
			if(!oneData.Horeasn){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0539"), {title : oBundleText.getText("LABEL_0053")});	// 539:인계사유를 선택하여 주십시오.
				return false;
			}
			if(!oneData.Actdt){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0537"), {title : oBundleText.getText("LABEL_0053")});	// 537:발령일을 입력하여 주십시오.
				return false;
			}
			if(!oneData.Accpn){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0543"), {title : oBundleText.getText("LABEL_0053")});	// 543:인수자를 입력하여 주십시오.
				return false;
			}
			if(!oneData.Entp1){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0545"), {title : oBundleText.getText("LABEL_0053")});	// 545:입회자를 입력하여 주십시오.
				return false;
			}
			if(oneData.Entp1 && oneData.Entp2) {
				if(oneData.Entp1 == oneData.Entp2) {
					sap.m.MessageBox.error(oBundleText.getText("LABEL_0544"), {title : oBundleText.getText("LABEL_0053")});	// 544:입회자 1,2는 동일한 직원으로 신청할 수 없습니다.
					return false;
				}
			}
			
			var isChkPass = false;
			tableData.forEach(function(elem) {
				if(elem.Item == "3" || elem.Item == "4" || elem.Item == "5" || elem.Item == "6") {
					if(elem.Itck) isChkPass = true;
				}
			});
			
			if(!isChkPass) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0542"), {title : oBundleText.getText("LABEL_0053")});	// 542:인수인계 (3~6)항목 중 한개는 선택하여 주십시오.
				return false;
			}
			
			if(common.Common.checkNull(oneData.Docyn)){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0091"), {title : oBundleText.getText("LABEL_0053")});	// 91:증빙서류를 업로드 하시기 바랍니다.
				return false;
			}
		}
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_Transition.ZUI5_HR_TransitionDetail");
		var oController = oView.getController();
			
		var onProcess = function() {
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV");
				
				oModel.remove("/TakingOverApplySet(Appno='" + oController._vAppno + "')", {
					success : function(data,res){
					},
					error : function(Res) {
						var errData = common.Common.parseError(Res);
						vErrorMessage = errData.ErrorMessage;
					}
				});
				
				oController.BusyDialog.close();
								
				if(vErrorMessage != ""){
					sap.m.MessageBox.error(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
					return;
				} 				
				
				sap.m.MessageBox.show(oBundleText.getText("LABEL_0034"), {	// 34:삭제가 완료되었습니다.
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title : oBundleText.getText("LABEL_0052"),	// 52:안내
					actions: [sap.m.MessageBox.Action.CLOSE],
					onClose: oController.onBack
				});
		};
		
		var DeleteProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		}; 
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// 35:삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : DeleteProcess
		});
	}
});