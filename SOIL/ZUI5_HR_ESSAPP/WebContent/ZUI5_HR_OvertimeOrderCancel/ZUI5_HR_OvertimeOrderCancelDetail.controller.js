jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail
	 */

	PAGEID : "ZUI5_HR_OvertimeOrderCancelDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'TM42',
	_vEnamefg : "",
	_vPersa : "" ,
	_vAppno : "",
	_oControl : null ,
	BusyDialog : new sap.m.BusyDialog(),
	_vFromPage : "",
	_vOrgeh : "",
	_vOrgtx : "",
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
			oDetailData = {Data : {}};
		
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
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail"),
			oController = oView.getController();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : (oController._vFromPage) ? oController._vFromPage : "ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelList",
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail"),
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
	
	onPressSelectApply : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail"),
			oController = oView.getController(),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
			startDate = new Date(),
			endDate = new Date();
		
		if(!oController._DetailJSonModel.getProperty("/Data/Pernr")) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		if(!oController._OvertimeDialog) {
			oController._OvertimeDialog = sap.ui.jsfragment("ZUI5_HR_OvertimeOrderCancel.fragment.OvertimeDialog", oController);
			oView.addDependent(oController._OvertimeDialog);
		}
		
		var oOvertimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_OvertimeDialog");
		
		endDate.setDate(endDate.getDate() + 7);
		
		oOvertimeDialog.getModel().setProperty("/Data/Apbeg", dateFormat.format(startDate));
		oOvertimeDialog.getModel().setProperty("/Data/Apend", dateFormat.format(endDate));
		if(_gAuth == "E") {
			oOvertimeDialog.getModel().setProperty("/Data/Pernr", oController._TargetJSonModel.getProperty("/Data/Pernr"));
			oOvertimeDialog.getModel().setProperty("/Data/Encid", oController._TargetJSonModel.getProperty("/Data/Encid"));
			oOvertimeDialog.getModel().setProperty("/Data/Ename", oController._TargetJSonModel.getProperty("/Data/Ename"));
		}
		
		oController._OvertimeDialog.open();
	},
	
	searchOvertime : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			oOvertimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_OvertimeDialog"),
			oOvertimeTable = sap.ui.getCore().byId(oController.PAGEID + "_OvertimeTable"),
			vPernr = oOvertimeDialog.getModel().getProperty("/Data/Encid"),
			vTableDatas = {Data : []},
			vIdx = 1;
		
		if(!vPernr) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0679"), {title : oBundleText.getText("LABEL_0053")});	// 679:대상자를 입력하여 주십시오.
			return;
		}
		
		oController.BusyDialog.open();
		
		oModel.read("/SpecialWorkEmpListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'H'),
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vPernr),
				new sap.ui.model.Filter('Apbegda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Apbegda").getDateValue())),
				new sap.ui.model.Filter('Apendda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Apendda").getDateValue()))
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
		
		oOvertimeTable.getModel().setData(vTableDatas);
		
		oController.BusyDialog.close();
	},

	onConfirmOvertimeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail"),
			oController = oView.getController(),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			oOvertimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_OvertimeDialog"),
			oOvertimeTable = sap.ui.getCore().byId(oController.PAGEID + "_OvertimeTable"),
			mOvertimeTableModel = oOvertimeTable.getModel(),
			vIdxs = oOvertimeTable.getSelectedIndices();
		
		if(vIdxs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0369"));	// 369:신청내역을 선택하여 주세요.
			return;
		} else if(vIdxs.length > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0680"));	// 680:신청내역을 한개만 선택하여 주세요.
			return;
		}
		
		var _selPath = oOvertimeTable.getContextByIndex(vIdxs[0]).sPath,
			sData = mOvertimeTableModel.getProperty(_selPath);
		
		oController._DetailJSonModel.setProperty("/Data/Oappno", sData.Appno);
		oController._DetailJSonModel.setProperty("/Data/Datum", dateFormat.format(sData.Datum));
		oController._DetailJSonModel.setProperty("/Data/Tpernr", sData.Pernr);
		oController._DetailJSonModel.setProperty("/Data/Tperid", sData.Perid);
		oController._DetailJSonModel.setProperty("/Data/Tename", sData.Ename);
		oController._DetailJSonModel.setProperty("/Data/Schkz", sData.Schkz);
		oController._DetailJSonModel.setProperty("/Data/Rtext", sData.Rtext);
		oController._DetailJSonModel.setProperty("/Data/Tprogt", sData.Tprogt);
		oController._DetailJSonModel.setProperty("/Data/Awart", sData.Awart);
		oController._DetailJSonModel.setProperty("/Data/Atext", sData.Atext);
		oController._DetailJSonModel.setProperty("/Data/Beguzt", sData.Beguzt);
		oController._DetailJSonModel.setProperty("/Data/Enduzt", sData.Enduzt);
		oController._DetailJSonModel.setProperty("/Data/Tim11", sData.Tim11);
		oController._DetailJSonModel.setProperty("/Data/Tim12", sData.Tim12);
		oController._DetailJSonModel.setProperty("/Data/Tim13", sData.Tim13);
		oController._DetailJSonModel.setProperty("/Data/Tim14", sData.Tim14);
		oController._DetailJSonModel.setProperty("/Data/Spernr", sData.Spernr);
		oController._DetailJSonModel.setProperty("/Data/Sperid", sData.Sperid);
		oController._DetailJSonModel.setProperty("/Data/Sename", sData.Sename);
		oController._DetailJSonModel.setProperty("/Data/Sawart", sData.Sawart);
		oController._DetailJSonModel.setProperty("/Data/Satext", sData.Satext);
		oController._DetailJSonModel.setProperty("/Data/Tmrsn", sData.Tmrsn);
		oController._DetailJSonModel.setProperty("/Data/Oseqnr", sData.Seqnr);
		
		oController.onCloseOvertimeDialog();
	},

	onCloseOvertimeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail"),
			oController = oView.getController(),
			oOvertimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_OvertimeDialog"),
			oOvertimeTable = sap.ui.getCore().byId(oController.PAGEID + "_OvertimeTable");
		
		oOvertimeDialog.getModel().setProperty("/Data/Orgeh", undefined);
		oOvertimeDialog.getModel().setProperty("/Data/Orgtx", undefined);
		
		oOvertimeTable.getModel().setData({Data : []});
		
		oOvertimeDialog.close();
	},
	
	SmartSizing : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail");
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
	
		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			errData = {};
		
		oModel.read("/CanSpecialWorkDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					oDetailData.Data = data.results[0];
					
					oDetailData.Data.Datum = dateFormat.format(oDetailData.Data.Datum);
					oDetailData.Data.Tpernr = oDetailData.Data.Pernr;
					oDetailData.Data.Tperid = oDetailData.Data.Perid;
					oDetailData.Data.Tename = oDetailData.Data.Ename;
					
					delete oDetailData.Data.Pernr;
					delete oDetailData.Data.Perid;
					delete oDetailData.Data.Ename;
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
	},
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			errData = {};
		
		oModel.read("/CanSpecialWorkDetailSet", {
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
			oDetailTitle.setText(oBundleText.getText("LABEL_0678"));		// 678:특근명령서 취소신청서
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0678") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 678:특근명령서 취소신청서
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0678") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 678:특근명령서 취소신청서
		}
	},
	
	displayEmpSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail"),
			oController = oView.getController()
		
		if(oEvent){
			oController._oControl = oEvent.getSource();
			oController._vEnamefg = "";
		}
		
		oController._useCustomPernrSelection = "X";
		oController._vOrgeh = oController._TargetJSonModel.getProperty('/Data/Orgeh');
		oController._vOrgtx = oController._TargetJSonModel.getProperty('/Data/Orgtx');
		
		common.TargetUser.displayEmpSearchDialog();
	},
	
	customPernrSelection : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail"),
			oController = oView.getController(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"), 
			vIDXs = oTable.getSelectedIndices();
		
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(oController._selectionRowIdx != null && vIDXs.length > 1) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는 한명만 선택이 가능합니다.
				return;
			} else if(vIDXs.length < 1) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}
			
			var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath,
				svPernr = mEmpSearchResult.getProperty(_selPath + "/Pernr"),
				svPerid = mEmpSearchResult.getProperty(_selPath + "/Perid"),
				svEncid = mEmpSearchResult.getProperty(_selPath + "/Encid"),
				svEname = mEmpSearchResult.getProperty(_selPath + "/Ename");
			
			var oOvertimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_OvertimeDialog");
			
			oOvertimeDialog.getModel().setProperty("/Data/Pernr", svPernr);
			oOvertimeDialog.getModel().setProperty("/Data/Perid", svPerid);
			oOvertimeDialog.getModel().setProperty("/Data/Encid", svEncid);
			oOvertimeDialog.getModel().setProperty("/Data/Ename", svEname);
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	customPernrClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail"),
			oController = oView.getController();
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	clearCustomPernrSearchOption : function(oController) {
		oController._useCustomPernrSelection = '';
		oController._vOrgeh = '';
		oController._vOrgtx = '';
	},
	
	EmpSearchByTx : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail"),
			oController = oView.getController(),
			oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
			vEname = oEvent.getSource().getValue(),
			curDate = new Date(),
			searchData = [];
		
		try {
			
			oCommonModel.read("/EmpSearchResultSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Actda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(curDate)),
					new sap.ui.model.Filter('Ename', sap.ui.model.FilterOperator.EQ, vEname),
					new sap.ui.model.Filter('Stat1', sap.ui.model.FilterOperator.EQ, "3"),
					new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth)
				],
				success : function(data, res) {
					if(data.results && data.results.length) {
						searchData = data.results;
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
			
		} catch(ex) {
			console.log(ex);
		}
		
		if(searchData.length == 1) {
			var oOvertimeDialog = sap.ui.getCore().byId(oController.PAGEID + "_OvertimeDialog");
			
			oOvertimeDialog.getModel().setProperty("/Data/Pernr", searchData[0].Pernr);
			oOvertimeDialog.getModel().setProperty("/Data/Perid", searchData[0].Perid);
			oOvertimeDialog.getModel().setProperty("/Data/Encid", searchData[0].Encid);
			oOvertimeDialog.getModel().setProperty("/Data/Ename", searchData[0].Ename);
		} else {
			oController._useCustomPernrSelection = "X";
			
			oController._oControl = oEvent.getSource();
			oController._vEnamefg = "X";
			common.TargetUser.displayEmpSearchDialog();
		}
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail");
		var oController = oView.getController();
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail");
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
				
			oModel.create("/CanSpecialWorkDetailSet", vOData, {
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
		var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV"),
			vData = oController._DetailJSonModel.getProperty("/Data"),
			rData = {};
		
		if(!vData.Tpernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Cmrsn) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0681"));	// 681:취소사유가 입력되지 않았습니다.
			return "";
		}
		
		if(vPrcty == "C") {
			if(!vData.Oappno) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0682"));	// 682:신청내역이 선택되지 않았습니다.
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
			var orgPernr = vData.Pernr;
			
			vData.Pernr = vData.Tpernr;
			vData.Perid = vData.Tperid;
			vData.Ename = vData.Tename;
			
			rData = common.Common.copyByMetadata(oModel, "CanSpecialWorkDetail", vData);
			rData.Datum = "\/Date("+ common.Common.getTime(rData.Datum)+")\/";
			rData.Beguzt = rData.Beguzt.replace(/[^\d]/g, '');
			rData.Enduzt = rData.Enduzt.replace(/[^\d]/g, '');
			
			delete rData.Beguz;
			delete rData.Enduz;
			
			vData.Pernr = orgPernr;
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail");
		var oController = oView.getController();
		var vError = "", vErrorMessage = "";
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_SPECIAL_WORK_SRV");
				
				oModel.remove("/SpecialWorkContentSet(Appno='" + vDetailData.Appno + "')", {
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
		
		delete detailData.Cmrsn;
		delete detailData.Datum;
		delete detailData.Tpernr;
		delete detailData.Tperid;
		delete detailData.Tename;
		delete detailData.Schkz;
		delete detailData.Rtext;
		delete detailData.Awart;
		delete detailData.Atext;
		delete detailData.Beguzt;
		delete detailData.Enduzt;
		delete detailData.Tim11;
		delete detailData.Tim12;
		delete detailData.Spernr;
		delete detailData.Sperid;
		delete detailData.Sename;
		delete detailData.Sawart;
		delete detailData.Satext;
		delete detailData.Tmrsn;
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
	},
	
	onAfterSelectPernr : function(oController){
		// 신청내역 초기화
		oController.onResetDetail(oController);
	}
});