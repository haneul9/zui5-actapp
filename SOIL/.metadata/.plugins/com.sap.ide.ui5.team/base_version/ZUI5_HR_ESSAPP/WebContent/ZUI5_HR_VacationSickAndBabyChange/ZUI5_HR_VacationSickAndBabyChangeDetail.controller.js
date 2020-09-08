jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.MandateAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail
	 */

	PAGEID : "ZUI5_HR_VacationSickAndBabyChangeDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_MandateJSonModel : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_TprogJSonModel : new sap.ui.model.json.JSONModel(),
	_TprogTableJSonModel : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'TM32',
	_vEnamefg : "",
	_vPersa : "" ,
	_vAppno : "",
	_oControl : null ,
	BusyDialog : new sap.m.BusyDialog(),
	_vFromPage : "",
	
	_TM11AptypCodes : ["1520", "1530", "1540"],
	
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
			oDetailData = {Data : {}};
		
		oController.BusyDialog.open();
		
		oController._ApprovalLineModel.setData(null);
		common.ApprovalLineAction.oController = oController;
		
		common.MandateAction.oController = oController;
		
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
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 신규 결재번호 채번
		oController.getAppno(oController);
		
		// 결재번호 binding
		oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);
		
		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
		
		// 유형별 UI
		oController.hideAllExtFields();
		if(oController._vAppno) oController.showExtFields(oDetailData.Data.Aptyp);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail"),
			oController = oView.getController();

		if(oController._vFromPage != "") {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : { }
			});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeList",
			      data : {}
			});	
		}
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail"),
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
							}).addStyleClass("Font14px FontColor3"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail");
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
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/ChangeLongLeaveDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					oDetailData.Data = data.results[0];
					
					oDetailData.Data.Ovcbeg = dateFormat.format(oDetailData.Data.Ovcbeg);
					oDetailData.Data.Ovcend = dateFormat.format(oDetailData.Data.Ovcend);
					oDetailData.Data.OusedayTxt = (oDetailData.Data.Ouseday != "0.00") ? "(" + Math.floor(oDetailData.Data.Ouseday) +"일간)" : undefined;
					oDetailData.Data.Begda = dateFormat.format(oDetailData.Data.Begda);
					oDetailData.Data.Endda = dateFormat.format(oDetailData.Data.Endda);
					oDetailData.Data.UsedayTxt = (oDetailData.Data.Useday != "0.00") ? "(" + Math.floor(oDetailData.Data.Useday) +"일간)" : undefined;
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
				if(errData.Error && errData.Error == "E"){
					sap.m.MessageBox.alert(errData.ErrorMessage, {});
					return ;
				}
			}
		});
	},
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			errData = {};
		
		oModel.read("/ChangeLongLeaveDetailSet", {
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
			oDetailTitle.setText(oBundleText.getText("LABEL_0764") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 764:병가/출산휴가/육아휴직 변경/취소 신청서
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0764") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 764:병가/출산휴가/육아휴직 변경/취소 신청서
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0764") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 764:병가/출산휴가/육아휴직 변경/취소 신청서
		}
	},
	
	showExtFields : function(vAptyp) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail"),
			oController = oView.getController();
		
		if(oController._TM11AptypCodes.indexOf(vAptyp) > -1) {	// 병가
			sap.ui.getCore().byId(oController.PAGEID + "_RowTypeTM11").removeStyleClass("DisplayNone");
		} else if(vAptyp == "2010") {	// 출산
			sap.ui.getCore().byId(oController.PAGEID + "_RowTypeTM21").removeStyleClass("DisplayNone");
		} else if(vAptyp == "2025") {	// 유사산
			sap.ui.getCore().byId(oController.PAGEID + "_RowTypeTM31B").removeStyleClass("DisplayNone");
		} else if(vAptyp == "3010") {	// 육아
			sap.ui.getCore().byId(oController.PAGEID + "_RowTypeTM31").removeStyleClass("DisplayNone");
		}
	},
	
	hideAllExtFields : function() {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail"),
			oController = oView.getController();
		
		sap.ui.getCore().byId(oController.PAGEID + "_RowTypeTM11").addStyleClass("DisplayNone");
		sap.ui.getCore().byId(oController.PAGEID + "_RowTypeTM21").addStyleClass("DisplayNone");
		sap.ui.getCore().byId(oController.PAGEID + "_RowTypeTM31").addStyleClass("DisplayNone");
		sap.ui.getCore().byId(oController.PAGEID + "_RowTypeTM31B").addStyleClass("DisplayNone");
	},
	
	onChangeChtyp : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail"),
			oController = oView.getController(),
			vChtyp = oEvent.getSource().getSelectedItem().getKey();
		
		if(vChtyp == "B") {
			oController._DetailJSonModel.setProperty("/Data/Begda", undefined);
			oController._DetailJSonModel.setProperty("/Data/Endda", undefined);
			oController._DetailJSonModel.setProperty("/Data/UsedayTxt", undefined);
		}
	},
	
	onVacationApply : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail"),
			oController = oView.getController(),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
			startDate = new Date(),
			endDate = new Date();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._VacationDialog) {
			oController._VacationDialog = sap.ui.jsfragment("ZUI5_HR_VacationSickAndBabyChange.fragment.VacationDialog", oController);
			oView.addDependent(oController._VacationDialog);
		}
		
		oController.searchVacation();
		
		oController._VacationDialog.open();
	},
	
	searchVacation : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
			oVacationDialog = sap.ui.getCore().byId(oController.PAGEID + "_VacationDialog"),
			oVacationTable = sap.ui.getCore().byId(oController.PAGEID + "_VacationTable"),
			vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"),
			vTableDatas = {Data : []},
			vIdx = 1;
		
		oController.BusyDialog.open();
		
		oModel.read("/OriginLongLeaveListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, vPernr)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					data.results.forEach(function(elem) {
						elem.Idx = vIdx++;
						
						vTableDatas.Data.push(elem);
					});
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				
				if(errData.Error && errData.Error == "E") {
					oController.BusyDialog.close();
					sap.m.MessageBox.alert(errData.ErrorMessage, {});
					return;
				}
			}
		});
		
		oVacationTable.getModel().setData(vTableDatas);
		oVacationTable.setVisibleRowCount(10);
		
		oController.BusyDialog.close();
	},
	
	onConfirmVacationDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail"),
			oController = oView.getController(),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			oVacationDialog = sap.ui.getCore().byId(oController.PAGEID + "_VacationDialog"),
			oVacationTable = sap.ui.getCore().byId(oController.PAGEID + "_VacationTable"),
			mVacationTableModel = oVacationTable.getModel(),
			vIdxs = oVacationTable.getSelectedIndices();
		
		if(vIdxs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0369"));	// 369:신청내역을 선택하여 주세요.
			return;
		} else if(vIdxs.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0680"));	// 680:신청내역을 한개만 선택하여 주세요.
			return;
		}
		
		oController._DetailJSonModel.setProperty("/Data/Aptyp", undefined);
		oController._DetailJSonModel.setProperty("/Data/Aptxt", undefined);
		oController._DetailJSonModel.setProperty("/Data/Dlvda", undefined);
		oController._DetailJSonModel.setProperty("/Data/Twins", undefined);
		oController._DetailJSonModel.setProperty("/Data/TwinType", undefined);
		oController._DetailJSonModel.setProperty("/Data/Fname", undefined);
		oController._DetailJSonModel.setProperty("/Data/Gbdatx", undefined);
		oController._DetailJSonModel.setProperty("/Data/Ouseday", undefined);
		oController._DetailJSonModel.setProperty("/Data/OusedayTxt", undefined);
		
		var _selPath = oVacationTable.getContextByIndex(vIdxs[0]).sPath,
			sData = mVacationTableModel.getProperty(_selPath);
		
		oController._DetailJSonModel.setProperty("/Data/Oappno", sData.Appno);
		oController._DetailJSonModel.setProperty("/Data/Ovcbeg", dateFormat.format(sData.Begda));
		oController._DetailJSonModel.setProperty("/Data/Ovcend", dateFormat.format(sData.Endda));
		oController._DetailJSonModel.setProperty("/Data/Awart", sData.Awart);
		oController._DetailJSonModel.setProperty("/Data/Atext", sData.Atext);
		oController._DetailJSonModel.setProperty("/Data/Takper", sData.Takper);
		oController._DetailJSonModel.setProperty("/Data/Ouseday", sData.Useday);
		oController._DetailJSonModel.setProperty("/Data/OusedayTxt", "(" + Math.floor(sData.Useday) +"일간)");

		if(oController._TM11AptypCodes.indexOf(sData.Aptyp) > -1) {	// 병가
			oController._DetailJSonModel.setProperty("/Data/Aptyp", sData.Aptyp);
			oController._DetailJSonModel.setProperty("/Data/Aptxt", sData.Aptxt);
		} else if(sData.Aptyp == "2010") {	// 출산
			oController._DetailJSonModel.setProperty("/Data/Dlvda", dateFormat.format(sData.Dlvda));
			oController._DetailJSonModel.setProperty("/Data/Twins", sData.Twins);
			oController._DetailJSonModel.setProperty("/Data/TwinType", sData.TwinType);
		} else if(sData.Aptyp == "2025") {	// 유사산
			oController._DetailJSonModel.setProperty("/Data/Pregwkx", sData.Pregwkx);
			oController._DetailJSonModel.setProperty("/Data/Pregdayx", sData.Pregdayx);
		} else if(sData.Aptyp == "3010") {	// 육아
			oController._DetailJSonModel.setProperty("/Data/Fname", sData.Fname);
			oController._DetailJSonModel.setProperty("/Data/Gbdatx", sData.Gbdatx);
		}
		
		oController.hideAllExtFields();
		oController.showExtFields(sData.Aptyp);
		
		oController.onCloseVacationDialog();
	},

	onCloseVacationDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail"),
			oController = oView.getController(),
			oVacationDialog = sap.ui.getCore().byId(oController.PAGEID + "_VacationDialog"),
			oVacationTable = sap.ui.getCore().byId(oController.PAGEID + "_VacationTable");
		
		oVacationTable.getModel().setData({Data : []});
		
		oVacationDialog.close();
	},
	
	onCheckWorkSchedule : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail"),
			oController = oView.getController(),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._PernrTprogDialog) {
			oController._PernrTprogDialog = sap.ui.jsfragment("ZUI5_HR_VacationSickAndBabyChange.fragment.PernrTprog", oController);
			oView.addDependent(oController._PernrTprogDialog);
		}
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TprogTable");
		var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHDULE_SRV");
		var vPernr = oController._DetailJSonModel.getProperty("/Data/Encid");
		var vData = {Data : []};
		
		var aFilters = [
			new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vPernr),
			new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, oController._vZworktyp),
			new sap.ui.model.Filter('Datum', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(new Date()))
		];
		
		oModel.read("/PernrTprogListSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				// 기준일, 근무형태
				var headerData = {Data : {}};
				headerData.Data.Datum = dateFormat.format(new Date());
				
				if(data.results && data.results.length > 0) {
					headerData.Data.Rtext = data.results[0].Rtext;
					
					// 리스트
					for(var i=0; i<data.results.length; i++) {
						data.results[i].Idx = i+1;
						vData.Data.push(data.results[i]);
					}
					
					oController._TprogTableJSonModel.setData(vData);
					oTable.setVisibleRowCount(vData.Data.length > 18 ? 18 : vData.Data.length);
				}
				
				oController._TprogJSonModel.setData(headerData);
			},
			error : function(Res) {
				console.log(Res);
			}
		});
		
		oController._PernrTprogDialog.open();
		
	},
	
	onChangeCalcUseday : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV")
			vBegda = oController._DetailJSonModel.getProperty("/Data/Begda"),
			vEndda = oController._DetailJSonModel.getProperty("/Data/Endda");
		
		if(!vBegda || !vEndda) {
			oController._DetailJSonModel.setProperty("/Data/Useday", undefined);
			oController._DetailJSonModel.setProperty("/Data/UsedayTxt", "");
			
			return;
		}
		
		oModel.read("/MaternityLeaveCalcSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Begda', sap.ui.model.FilterOperator.EQ, common.Common.getTime(vBegda)),
				new sap.ui.model.Filter('Endda', sap.ui.model.FilterOperator.EQ, common.Common.getTime(vEndda))
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					var vUseday = data.results[0].Useday;
					
					oController._DetailJSonModel.setProperty("/Data/Useday", vUseday);
					oController._DetailJSonModel.setProperty("/Data/UsedayTxt", "(" + Math.floor(vUseday) + "일간)");
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
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail");
		var oController = oView.getController();
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail");
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
			// 위임여부 저장
			var vSuccessyn = common.MandateAction.onSaveMandate(oController);
			
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			// 결재라인 저장
			vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
			
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"),
				errData = {};
				
			oModel.create("/ChangeLongLeaveDetailSet", vOData, {
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
		var vData = oController._DetailJSonModel.getProperty("/Data"),
			rData = {},
			vLtamt,
			vReqamt;
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Chtyp) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0765"));	// 765:변경/취소가 선택되지 않았습니다.
			return "";
		}
		if(!vData.Oappno) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0682"));	// 682:신청내역이 선택되지 않았습니다.
			return "";
		}
		
		if(vPrcty == "C") {
			if(!vData.Reasn) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0766"));	// 766:변경/취소사유가 입력되지 않았습니다.
				return "";
			}
			if(vData.Chtyp == "A") {
				if(!vData.Begda) {
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0767"));	// 767:변경 시작일이 입력되지 않았습니다.
					return "";
				}
				if(!vData.Endda) {
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0768"));	// 768:변경 종료일이 입력되지 않았습니다.
					return "";
				}
			}
			
			if(!vData.Docyn) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0284"));	// 284:증빙자료를 첨부하세요.
				return "";
			}
			
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
		
		try {
			rData = common.Common.copyByMetadata(sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV"), "ChangeLongLeaveDetail", vData);
			
			rData.Ovcbeg = "\/Date("+ common.Common.getTime(rData.Ovcbeg)+")\/";
			rData.Ovcend = "\/Date("+ common.Common.getTime(rData.Ovcend)+")\/";
			rData.Begda = (rData.Begda) ? "\/Date("+ common.Common.getTime(rData.Begda)+")\/" : undefined;
			rData.Endda = (rData.Endda) ? "\/Date("+ common.Common.getTime(rData.Endda)+")\/" : undefined;
			rData.Dlvda = (rData.Dlvda) ? "\/Date("+ common.Common.getTime(rData.Dlvda)+")\/" : undefined;
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail");
		var oController = oView.getController();
		var vError = "", vErrorMessage = "";
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
				
				oModel.remove("/ChangeLongLeaveDetailSet(Appno='" + vDetailData.Appno + "')", {
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
		
		delete detailData.Oappno;	// 원 신청번호
		delete detailData.Ovcbeg;	// 원 시작일
		delete detailData.Ovcend;	// 원 종료일
		delete detailData.Ouseday;
		delete detailData.OusedayTxt;
		delete detailData.TwinType;	// 다태아여부 텍스트
		delete detailData.Gbdatx;	// 생년월일(만나이포함)
		delete detailData.Fname;	// 신청대상
		delete detailData.Twins;	// 다태아여부
		delete detailData.Dlvda;	// 분만예정일
		delete detailData.Atext;	// A/A 유형 텍스트
		delete detailData.Awart;	// 근무/휴무 유형
		delete detailData.Aptyp;	// 신청유형
		delete detailData.Aptxt;	// 신청유형명
		delete detailData.Takper;
		delete detailData.Begda;
		delete detailData.Endda;
		delete detailData.Useday;
		delete detailData.UsedayTxt;
		delete detailData.Reasn;
		delete detailData.Chtyp;
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
		
		oController.hideAllExtFields();
	},
	
	onAfterSelectPernr : function(oController){
		// 신청내역 초기화
		oController.onResetDetail(oController);
	}
});