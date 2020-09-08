jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_HolidayDelegateTask.ZUI5_HR_HolidayDelegateTaskDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_HolidayDelegateTask.ZUI5_HR_HolidayDelegateTaskDetail
	 */

	PAGEID : "ZUI5_HR_HolidayDelegateTaskDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'TM51',
	_vEnamefg : "",
	_vPersa : "" ,
	_vAppno : "",
	_oControl : null ,
	BusyDialog : new sap.m.BusyDialog(),
	_vFromPage : "",
	_useCustomPernrSelection : "",
	
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
		
		// Target Layout 추가 구성
		this.onSetTargetMatrix();
	},

	onBeforeShow : function(oEvent) {
		var oController = this,
			vFromPageId = "",
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oDetailData = {Data : {}},
			oDetailTableData = {Data : []},
			oTableData = {};
		
		oController.BusyDialog.open();
		
		oController._ApprovalLineModel.setData(null);
		common.ApprovalLineAction.oController = oController;
		
		// parameter, 리턴페이지 처리
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno;
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		// 상세조회
		oController.retrieveDetail(oController, oDetailData);
		
		// 상세화면 Default Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = oDetailData.Data.ZappStatAl || '';
		oController._DetailJSonModel.setData(oDetailData);
		
		// 상세테이블 Binding
		oTable.setVisibleRowCount(1);
		if(oController._vAppno) {
			oTableData.Pernr = oDetailData.Data.Pernr;
			oTableData.Encid = oDetailData.Data.Encid;
			oTableData.ZappStatAl = oDetailData.Data.ZappStatAl;
			oTableData.Spernr = oDetailData.Data.Spernr;
			oTableData.Sperid = oDetailData.Data.Sperid;
			oTableData.Sename = oDetailData.Data.Sename;
			oTableData.Tim11 = oDetailData.Data.Tim11;
			oTableData.Tim12 = oDetailData.Data.Tim12;
			oTableData.Tim13 = oDetailData.Data.Tim13;
			oTableData.Tim14 = oDetailData.Data.Tim14;
			oTableData.Tim15 = oDetailData.Data.Tim15;
			oTableData.Tim21 = oDetailData.Data.Tim21;
			oTableData.Tim22 = oDetailData.Data.Tim22;
			oTableData.Tim23 = oDetailData.Data.Tim23;
			oTableData.Wtm01 = oDetailData.Data.Wtm01;
			oTableData.Wtm02 = oDetailData.Data.Wtm02;
			oTableData.Wtm03 = oDetailData.Data.Wtm03;
			oTableData.Wtm04 = oDetailData.Data.Wtm04;
			oTableData.Wtm05 = oDetailData.Data.Wtm05;
			oTableData.Wtm06 = oDetailData.Data.Wtm06;
			oTableData.Wtm07 = oDetailData.Data.Wtm07;
			oTableData.Wtme1 = oDetailData.Data.Wtme1;
			oTableData.Wtme2 = oDetailData.Data.Wtme2;
			oTableData.Fityn = oDetailData.Data.Fityn;
			oTableData.Stat1 = oDetailData.Data.Stat1;
			oTableData.Stat2 = oDetailData.Data.Stat2;
			oTableData.Gigan1 = oDetailData.Data.Gigan1;
			oTableData.Gigan2 = oDetailData.Data.Gigan2;
			oTableData.Zbigo = oDetailData.Data.Zbigo;
			
			oDetailTableData.Data.push(oTableData);
		}
		oController._DetailTableJSonModel.setData(oDetailTableData);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 신규 결재번호 채번
		oController.getAppno(oController);
		
		// 결재번호 binding
		oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
		
		sap.ui.getCore().byId('__text15').setText(oBundleText.getText("LABEL_0050"));	// 50:신청자
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_HolidayDelegateTask.ZUI5_HR_HolidayDelegateTaskDetail"),
			oController = oView.getController();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : (oController._vFromPage) ? oController._vFromPage : "ZUI5_HR_HolidayDelegateTask.ZUI5_HR_HolidayDelegateTaskList",
			data : { }
		});
	},

	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0055"), {	// 55:유효하지 않은 날짜형식입니다.
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HolidayDelegateTask.ZUI5_HR_HolidayDelegateTaskDetail"),
			oController = oView.getController(),
			oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix"),
			oRow;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0003")	// 3:결재선
					}).addStyleClass("Font14px FontBold FontColor3")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 3,
					content : new sap.m.Toolbar({
						content : [
							new sap.m.Text({
								text : "{ApprEnames}"
							}).addStyleClass("Font14px FontColor3")
						]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData")
				.setModel(oController._DetailJSonModel)
				.bindElement("/Data")
			]
		});
		
		oTargetMatrix.addRow(oRow);
	},
	
	SmartSizing : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_HolidayDelegateTask.ZUI5_HR_HolidayDelegateTaskDetail");
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
	
		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/HolDaegeunDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					oDetailData.Data = data.results[0];
					
					oDetailData.Data.Datum = dateFormat.format(oDetailData.Data.Datum);
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
	},
	
	onChangeDatum : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_HolidayDelegateTask.ZUI5_HR_HolidayDelegateTaskDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			vPernr = oController._DetailJSonModel.getProperty("/Data/Encid"),
			vDatum = oController._DetailJSonModel.getProperty("/Data/Datum"),
			vZappStatAl = oController._DetailJSonModel.getProperty("/Data/ZappStatAl"),
			rData = {};
		
		if(!vPernr) return;
		
		oModel.read("/HolDaegeunDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'P'),
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vPernr),
				new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.getTime(vDatum))
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					rData = data.results[0];
					
					oController._DetailJSonModel.setProperty("/Data/Daytx", rData.Daytx);
					oController._DetailJSonModel.setProperty("/Data/Ztext", rData.Ztext);
					oController._DetailJSonModel.setProperty("/Data/Ttext", rData.Ttext);
					
					oController._DetailTableJSonModel.setData({Data : [{Pernr : vPernr, ZappStatAl : vZappStatAl}]});
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
			}
		});
	},
	
	retrieveSpernrInfo : function(oController, svPernr) {
		var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			oDetailTableModel = oDetailTable.getModel(),
			vPernr = oController._DetailJSonModel.getProperty("/Data/Encid"),
			vDatum = oController._DetailJSonModel.getProperty("/Data/Datum"),
			rData = {};
		
		if(!vPernr) return;
		
		oModel.read("/HolDaegeunDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'W'),
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vPernr),
				new sap.ui.model.Filter('Spernr', sap.ui.model.FilterOperator.EQ, svPernr),
				new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.getTime(vDatum))
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					rData = data.results[0];
					
					oController._DetailTableJSonModel.setProperty("/Data/0/Tim11", rData.Tim11);
					oController._DetailTableJSonModel.setProperty("/Data/0/Tim12", rData.Tim12);
					oController._DetailTableJSonModel.setProperty("/Data/0/Tim13", rData.Tim13);
					oController._DetailTableJSonModel.setProperty("/Data/0/Tim14", rData.Tim14);
					oController._DetailTableJSonModel.setProperty("/Data/0/Tim15", rData.Ttext);
					oController._DetailTableJSonModel.setProperty("/Data/0/Tim21", rData.Tim21);
					oController._DetailTableJSonModel.setProperty("/Data/0/Tim22", rData.Tim22);
					oController._DetailTableJSonModel.setProperty("/Data/0/Tim23", rData.Tim23);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wtm01", rData.Wtm01);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wtm02", rData.Wtm02);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wtm03", rData.Wtm03);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wtm04", rData.Wtm04);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wtm05", rData.Wtm05);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wtm06", rData.Wtm06);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wtm07", rData.Wtm07);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wtme1", rData.Wtme1);
					oController._DetailTableJSonModel.setProperty("/Data/0/Wtme2", rData.Wtme2);
					oController._DetailTableJSonModel.setProperty("/Data/0/Fityn", rData.Fityn);
					oController._DetailTableJSonModel.setProperty("/Data/0/Stat1", rData.Stat1);
					oController._DetailTableJSonModel.setProperty("/Data/0/Stat2", rData.Stat2);
					oController._DetailTableJSonModel.setProperty("/Data/0/Gigan1", rData.Gigan1);
					oController._DetailTableJSonModel.setProperty("/Data/0/Gigan2", rData.Gigan2);
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
			}
		});
	},
	
	onDelegatePernrChange : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_HolidayDelegateTask.ZUI5_HR_HolidayDelegateTaskDetail"),
			oController = oView.getController();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Datum")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0856"), {title : oBundleText.getText("LABEL_0053")});	// 856:휴일을 선택하여 주십시오.
			return;
		}
		
		if(oController._WorktimeDialog) oController._WorktimeDialog.destroy();
		
		oController._WorktimeDialog = sap.ui.jsfragment("ZUI5_HR_HolidayDelegateTask.fragment.WorktimeDialog", oController);
		oView.addDependent(oController._WorktimeDialog);
		
		var oWorktimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_WorktimeDialog");
		
		oWorktimeDialog.getModel().setProperty("/Data/Orgeh", oController._TargetJSonModel.getProperty("/Data/Orgeh"));
		oWorktimeDialog.getModel().setProperty("/Data/Orgtx", oController._TargetJSonModel.getProperty("/Data/Orgtx"));
		
		oController.searchDelegatePernr();
		
		oController._WorktimeDialog.open();
	},
	
	searchDelegatePernr : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_HolidayDelegateTask.ZUI5_HR_HolidayDelegateTaskDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			oWorktimeTable = sap.ui.getCore().byId(oController.PAGEID + "_Worktime_Table"),
			vDatum = oController._DetailJSonModel.getProperty("/Data/Datum"),
			vOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_WorktimeDialog").getModel().getProperty("/Data/Orgeh"),
			vIdx = 1;
		
		if(!vOrgeh) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0650"), {title : oBundleText.getText("LABEL_0053")});	// 650:부서를 선택하여 주십시오.
			return;
		}
		
		oController.BusyDialog.open();
		
		oModel.read("/OrgehWorkTimeSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter("Actty", sap.ui.model.FilterOperator.EQ, _gAuth),
				new sap.ui.model.Filter("Orgeh", sap.ui.model.FilterOperator.EQ, vOrgeh),
				new sap.ui.model.Filter("Datum", sap.ui.model.FilterOperator.EQ, common.Common.getTime(vDatum))
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					data.results.forEach(function(elem) {
						elem.Idx = vIdx++;
						elem.Wtm01 = (!elem.Wtm01 || elem.Wtm01 == "0.00") ? "0" : elem.Wtm01;
						elem.Wtm02 = (!elem.Wtm02 || elem.Wtm02 == "0.00") ? "0" : elem.Wtm02;
						elem.Wtm03 = (!elem.Wtm03 || elem.Wtm03 == "0.00") ? "0" : elem.Wtm03;
						elem.Wtm04 = (!elem.Wtm04 || elem.Wtm04 == "0.00") ? "0" : elem.Wtm04;
						elem.Wtm05 = (!elem.Wtm05 || elem.Wtm05 == "0.00") ? "0" : elem.Wtm05;
						elem.Wtm06 = (!elem.Wtm06 || elem.Wtm06 == "0.00") ? "0" : elem.Wtm06;
						elem.Wtm07 = (!elem.Wtm07 || elem.Wtm07 == "0.00") ? "0" : elem.Wtm07;
						elem.Wtme1 = (!elem.Wtme1 || elem.Wtme1 == "0.00") ? "0" : elem.Wtme1;
						elem.Wtme2 = (!elem.Wtme2 || elem.Wtme2 == "0.00") ? "0" : elem.Wtme2;
					});
					
					oWorktimeTable.getModel().setData({Data : data.results});
				}
			},
			error : function(Res) {
				console.log(Res);
			}
		});
		
		oController.BusyDialog.close();
	},
	
	displayOrgSearchDialog : function(oEvent) {
		var oController = common.TargetUser.oController;
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Multi";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "MultiInput";
		
		if(!oController._SearchOrgDialog) {
			oController._SearchOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
		}
		oController._SearchOrgDialog.open();
	},
	
	onConfirmPernrDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_HolidayDelegateTask.ZUI5_HR_HolidayDelegateTaskDetail"),
			oController = oView.getController(),
			oWorktimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_WorktimeDialog"),
			oWorktimeTable = sap.ui.getCore().byId(oController.PAGEID + "_Worktime_Table"),
			mWorktimeTableModel = oWorktimeTable.getModel(),
			vIDXs = oWorktimeTable.getSelectedIndices();
		
		if(!vIDXs.length) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0646"));	// 646:대근자를 선택하여 주세요.
			return;
		} else if(vIDXs.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0648"));	// 648:대근자를 한명만 선택하여 주세요.
			return;
		}
		
		var _selPath = oWorktimeTable.getContextByIndex(vIDXs[0]).sPath,
			svPernr = mWorktimeTableModel.getProperty(_selPath + "/Pernr"),
			svPerid = mWorktimeTableModel.getProperty(_selPath + "/Perid"),
			svEname = mWorktimeTableModel.getProperty(_selPath + "/Ename"),
			svAwart = mWorktimeTableModel.getProperty(_selPath + "/Awart"),
			svAtext = mWorktimeTableModel.getProperty(_selPath + "/Atext");
		
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		
		oDetailTable.getModel().setProperty("/Data/0/Spernr", svPernr);
		oDetailTable.getModel().setProperty("/Data/0/Sperid", svPerid);
		oDetailTable.getModel().setProperty("/Data/0/Sename", svEname);
		oDetailTable.getModel().setProperty("/Data/0/Sawart", svAwart);
		oDetailTable.getModel().setProperty("/Data/0/Satext", svAtext);
		
		oController.retrieveSpernrInfo(oController, svPernr);
		
		oController.onClosePernrDialog();
	},
	
	onClosePernrDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_HolidayDelegateTask.ZUI5_HR_HolidayDelegateTaskDetail"),
			oController = oView.getController(),
			oWorktimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_WorktimeDialog"),
			oWorktimeTable = sap.ui.getCore().byId(oController.PAGEID + "_Worktime_Table");
		
		oWorktimeDialog.getModel().setProperty("/Data/Orgeh", undefined);
		oWorktimeDialog.getModel().setProperty("/Data/Orgtx", undefined);
		
		oWorktimeTable.getModel().setData({Data : []});
		
		oWorktimeDialog.close();
	},
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			errData = {};
		
		oModel.read("/HolDaegeunDetailSet", {
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
			oDetailTitle.setText(oBundleText.getText("LABEL_0855") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 855:휴일대근 신청서
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0855") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 855:휴일대근 신청서
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0855") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 855:휴일대근 신청서
		}
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HolidayDelegateTask.ZUI5_HR_HolidayDelegateTaskDetail");
		var oController = oView.getController();
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_HolidayDelegateTask.ZUI5_HR_HolidayDelegateTaskDetail");
		var oController = oView.getController();
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty){ // 처리 구분
		var vOData = oController.onValidationData(oController, vPrcty);
		
		if( vOData == "") return ;
		vOData.Prcty = vPrcty;
		vOData.Actty = _gAuth;
		
		var onProcess = function() {
			// 결재라인 저장
			var vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
			
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
				errData = {};
				
			oModel.create("/HolDaegeunDetailSet", vOData, {
				success: function(data,res) {
					if(data) {
					} 
				},
				error: function (Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == 'E') {
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
		
		var CreateProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
//				control.ZNKBusyAccessor.onBusy("S",oController);
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		var vInfoTxt = "" , vCompTxt = "";
		if(vPrcty == "T"){
			vInfoTxt = oBundleText.getText("LABEL_0061");	// 61:저장하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0060") ;	// 60:저장이 완료되었습니다.
		} else {
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
		var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV");
			vData = oController._DetailJSonModel.getProperty("/Data"),
			tableData = oController._DetailTableJSonModel.getProperty("/Data/0"),
			rData = {};
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Datum) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0857"));	// 857:휴일이 입력되지 않았습니다.
			return "";
		}
//		if(!tableData.Spernr) {
//			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0858"));	// 858:대근자가 입력되지 않았습니다.
//			return "";
//		}
		
		if(vPrcty == "C"){
			// 결재자 지정여부 확인
			var oData = oController._ApprovalLineModel.getProperty("/Data");
			var vApprovalCheck = "";
			if(oData && oData.length > 0){
				for(var i=0; i <oData.length ; i++ ){
					if(oData[i].Aprtype == "A03001"){
						vApprovalCheck = "X";
						break;
					}
				}	
			}
			if(vApprovalCheck == ""){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0004"), {title : oBundleText.getText("LABEL_0053")});	// 결재자를 반드시 지정하시기 바랍니다.
				return false;
			}
		}
		
		vData.Spernr = tableData.Spernr;
		vData.Sperid = tableData.Sperid;
		vData.Sename = tableData.Sename;
		vData.Tim11 = tableData.Tim11;
		vData.Tim12 = tableData.Tim12;
		vData.Tim13 = tableData.Tim13;
		vData.Tim14 = tableData.Tim14;
		vData.Tim15 = tableData.Tim15;
		vData.Tim21 = tableData.Tim21;
		vData.Tim22 = tableData.Tim22;
		vData.Tim23 = tableData.Tim23;
		vData.Wtm01 = tableData.Wtm01;
		vData.Wtm02 = tableData.Wtm02;
		vData.Wtm03 = tableData.Wtm03;
		vData.Wtm04 = tableData.Wtm04;
		vData.Wtm05 = tableData.Wtm05;
		vData.Wtm06 = tableData.Wtm06;
		vData.Wtm07 = tableData.Wtm07;
		vData.Wtme1 = tableData.Wtme1;
		vData.Wtme2 = tableData.Wtme2;
		vData.Stat1 = tableData.Stat1;
		vData.Stat2 = tableData.Stat2;
		vData.Zbigo = tableData.Zbigo;
		vData.Fityn = tableData.Fityn;
		vData.Gigan1 = tableData.Gigan1;
		vData.Gigan2 = tableData.Gigan2;
		
		try {
			rData = common.Common.copyByMetadata(oModel, "HolDaegeunDetail", vData);
			rData.Datum = "\/Date("+ common.Common.getTime(rData.Datum)+")\/";
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_HolidayDelegateTask.ZUI5_HR_HolidayDelegateTaskDetail");
		var oController = oView.getController();
		var vError = "", vErrorMessage = "";
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV");
				
				oModel.remove("/HolDaegeunListSet(Appno='" + vDetailData.Appno + "')", {
					success: function(data,res) {
					},
					error: function(Res) {
						if(Res.response.body){
							var ErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							vError = "E"; 
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							} else {
								vErrorMessage =ErrorMessage ;
							}
						}
					}
				});
				oController.BusyDialog.close();
				
				if(vError == "E") {
					sap.m.MessageBox.show(vErrorMessage, {});
					return;
				} 
				
				sap.m.MessageBox.show(oBundleText.getText("LABEL_0034"), {	// 34:삭제가 완료되었습니다.
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title : oBundleText.getText("LABEL_0052"),	// 52:안내
					actions: [
						sap.m.MessageBox.Action.CLOSE
					],
					onClose: oController.onBack
				});
				
		};
		
		var DeleteProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
//				control.ZNKBusyAccessor.onBusy("S",oController);
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		}; 
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// 35:삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : DeleteProcess
		});
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController){
		var detailData = oController._DetailJSonModel.getProperty("/Data");
		
		delete detailData.Datum;	// 특근일자
		delete detailData.Daytx;	// 요일
		delete detailData.Ztext;	// 근무조
		delete detailData.Ttext;	// 근무시간
		delete detailData.Hdrsn;	// 신청사유
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
		oController._DetailTableJSonModel.setData({Data : []});
		oController._DetailTableJSonModel.refresh();
	},
	
	onAfterSelectPernr : function(oController){
		// 신청내역 초기화
		oController.onResetDetail(oController);
		
		sap.ui.getCore().byId('__text15').setText(oBundleText.getText("LABEL_0050"));	// 50:신청자
	}
});