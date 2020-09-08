jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.ZipSearch");
jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
jQuery.sap.require("sap.ui.core.util.ExportType");

sap.ui.controller("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail
	 */

	PAGEID : "ZUI5_HR_DeductionDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailSaveJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_DedcdTableJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'HR38',
	_vEnamefg : "",
	_Columns : "",
	
	_DialogActionFlag : null ,
	_vPersa : "" ,
	_vAppno : "",
	_vZappStatAl : "",
	_useCustomPernrSelection : "",
	_selectionRowIdx : null,
	
	_oControl : null ,
	BusyDialog : new sap.m.BusyDialog(),
	_vFromPage : "",
	_vgReqAuth : "",
	
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
			oDetailData = {Data : {}},
			oDetailTableData = {Data : []},
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			vPersa = "",
			vEmail = "",
			vDedgb = "",
			vNewyn = "";
		
		oController.BusyDialog.open();
		
		oController._ApprovalLineModel.setData(null);
		common.ApprovalLineAction.oController = oController;
		
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
		
		// 공제 input icon 초기화
		oController.initDedtxInputHelper(oController);
		
		// 상세 조회
		oController.retrieveDetail(oController, oDetailData);
		
		// 상세화면 Default Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = oDetailData.Data.ZappStatAl || '';
		oController._vZappStatAl = oDetailData.Data.ZappStatAl;
		oController._DetailJSonModel.setData(oDetailData);
		
		// 상세테이블 조회
		oController.retrieveDetailTable(oController, oDetailTableData);
		
		oController._DetailTableJSonModel.setData(oDetailTableData);
		oController._DetailTableJSonModel.refresh();
		if(oDetailTableData.Data.length) oController.makeTotalRow();
		var vTableLength = oDetailTableData.Data.length == 0 ? 2 : oDetailTableData.Data.length;
		oDetailTable.setVisibleRowCount(vTableLength > 14 ? 15 : vTableLength);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// 공제예정월
		oController.retrieveDedReqym(oController);
		
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
		
		if(!this._vAppno && _gAuth == "E") {
			var vPersa = this._TargetJSonModel.getProperty("/Data/Persa");
			if(vPersa != "7000") {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_1329"), {title : oBundleText.getText("LABEL_0053")});	// 1329:본사 인원은 신청할 수 없습니다.
				this._TargetJSonModel.setProperty("/Data", {Auth : _gAuth, ZappStatAl : this._vZappStatAl});
				this._DetailJSonModel.setProperty("/Data/Pernr", undefined);
				
				this.onBack();
			}
		}
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : oController._vFromPage || "ZUI5_HR_Deduction.ZUI5_HR_DeductionList",
			data : {}
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix"),
			oRow;
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ApprLineRow", {
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
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_FIX_SRV"),
			errData = {};
		
		oModel.read("/DeductFixApplSet", {
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
	
	initDedtxInputHelper : function(oController) {
		var oDedtx = sap.ui.getCore().byId(oController.PAGEID + "_Dedtx");
		
		oDedtx._getValueHelpIcon().setSrc("sap-icon://value-help");
		oDedtx.fireValueHelpRequest = function() {
			oController.displayDedgbDialog();
		};
	},
	
	retrieveDedReqym : function(oController) {
		if(!oController._vZappStatAl == "") return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_FIX_SRV"),
			vReqym = "",
			vPersa = oController._TargetJSonModel.getProperty("/Data/Persa");
		
		if(!vPersa) return;
		
		oModel.read("/DedReqymSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Werks', sap.ui.model.FilterOperator.EQ, vPersa)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					vReqym = data.results[0].Reqym;
					vReqym = (!vReqym || vReqym == "000000") ? "" : vReqym.replace(/(\d{4})(\d{2})/g, '$1.$2');
					
					oController._DetailJSonModel.setProperty("/Data/Reqym", vReqym);
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
	
	onRowPernrEnterChange : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV"),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
			vSeqno = oEvent.getSource().getCustomData()[0].getValue(),
			vEname = oEvent.getSource().getValue(),
			vIdx = vSeqno * 1 - 1,
			curDate = new Date(),
			searchResultSet = [],
			searchData = null;
		
		if(!vEname || vEname == "") {
			oDetailTable.getModel().setProperty("/Data/" + vIdx + "/Pernr", undefined);
			oDetailTable.getModel().setProperty("/Data/" + vIdx + "/Perid", undefined);
			oDetailTable.getModel().setProperty("/Data/" + vIdx + "/Ename", undefined);
			oDetailTable.getModel().setProperty("/Data/" + vIdx + "/Orgeh", undefined);
			oDetailTable.getModel().setProperty("/Data/" + vIdx + "/Orgtx", undefined);
			
			return;
		}
		
		try {
			
			oCommonModel.read("/EmpSearchResultSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Actda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(curDate)),
					new sap.ui.model.Filter('Ename', sap.ui.model.FilterOperator.EQ, vEname),
					new sap.ui.model.Filter('Stat1', sap.ui.model.FilterOperator.EQ, "3"),
					new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth),
					new sap.ui.model.Filter("ReqAuth", sap.ui.model.FilterOperator.EQ, "3")
				],
				success : function(data, res) {
					if(data.results && data.results.length) {
						searchResultSet = data.results;
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
		
		if(searchResultSet.length == 1) {
			var searchData = searchResultSet[0];
			
			oDetailTable.getModel().setProperty("/Data/" + vIdx + "/Pernr", searchData.Pernr);
			oDetailTable.getModel().setProperty("/Data/" + vIdx + "/Perid", searchData.Perid);
			oDetailTable.getModel().setProperty("/Data/" + vIdx + "/Ename", searchData.Ename);
			oDetailTable.getModel().setProperty("/Data/" + vIdx + "/Orgeh", searchData.Orgeh);
			oDetailTable.getModel().setProperty("/Data/" + vIdx + "/Orgtx", searchData.Fulln);
		} else {
			oController._useCustomPernrSelection = "X";
			oController._selectionRowIdx = vIdx;
			
			oController._oControl = oEvent.getSource();
			oController._vEnamefg = "X";
			
			// 검색용 강제 지정
			oController._vgReqAuth = gReqAuth;
			gReqAuth = "3";
			
			common.TargetUser.displayEmpSearchDialog();
		}
	},
	
	onRowPernrChange : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			vSeqno = oEvent.getSource().getCustomData()[0].getValue(),
			vIdx = vSeqno * 1 - 1;
		
		if(oEvent){
			oController._oControl = oEvent.getSource();
			oController._vEnamefg = "";
		}
		
		oController._useCustomPernrSelection = "X";
		oController._selectionRowIdx = vIdx;
		
		// 검색용 강제 지정
		oController._vgReqAuth = gReqAuth;
		gReqAuth = "3";
		
		common.TargetUser.displayEmpSearchDialog();
	},
	
	customPernrSelection : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
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
			
			var vTableData = oController._DetailTableJSonModel.getData(),
				vData = vTableData.Data;
			
			var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath,
				svPernr = mEmpSearchResult.getProperty(_selPath + "/Pernr"),
				svPerid = mEmpSearchResult.getProperty(_selPath + "/Perid"),
				svEname = mEmpSearchResult.getProperty(_selPath + "/Ename"),
				svOrgeh = mEmpSearchResult.getProperty(_selPath + "/Orgeh"),
				svOrgtx = mEmpSearchResult.getProperty(_selPath + "/Fulln");
			
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
			
			var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
			
			oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Pernr", svPernr);
			oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Perid", svPerid);
			oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Ename", svEname);
			oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Orgeh", svOrgeh);
			oDetailTable.getModel().setProperty("/Data/" + oController._selectionRowIdx + "/Orgtx", svOrgtx);
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	customPernrClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController();
		
		// 공통 구분값 초기화
		oController.clearCustomPernrSearchOption(oController);
		
		oController._AddPersonDialog.close();
	},
	
	clearCustomPernrSearchOption : function(oController) {
		oController._useCustomPernrSelection = '';
		oController._selectionRowIdx = null;
		// 검색용 강제 지정 해제
		gReqAuth = oController._vgReqAuth;
		oController._vgReqAuth = "";
	},
	
	DedtxSearchInput : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			oDedtx = sap.ui.getCore().byId(oController.PAGEID + "_Dedtx"),
			vDedtx = oEvent.getSource().getValue();
		
		if(!vDedtx) {
			oDedtx._getValueHelpIcon().firePress();
		} else {
			if(!oController._DedcdDialog) {
				oController._DedcdDialog = sap.ui.jsfragment("ZUI5_HR_Deduction.fragment.DedcdDialog", oController);
				oView.addDependent(oController._DedcdDialog);
			}
			
			sap.ui.getCore().byId(oController.PAGEID + "_SearchInput").setValue(vDedtx);
			
			oController.onSearchDedcd();
			
			oController._DedcdDialog.open();
		}
		
	},
	
	displayDedgbDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController();
		
		if(!oController._DedcdDialog) {
			oController._DedcdDialog = sap.ui.jsfragment("ZUI5_HR_Deduction.fragment.DedcdDialog", oController);
			oView.addDependent(oController._DedcdDialog);
		}
		
		oController.onSearchDedcd();
		
		oController._DedcdDialog.open();
	},
	
	onSelectDedcd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController();
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DedcdTable"),
			oDedtx = sap.ui.getCore().byId(oController.PAGEID + "_Dedtx"),
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
		
		dedcdTableData = oController._DedcdTableJSonModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath);
		
		oController._DetailJSonModel.setProperty("/Data/Dedcd", dedcdTableData.Dedcd);
		oController._DetailJSonModel.setProperty("/Data/Dedtx", dedcdTableData.Dedtx);
		oController._DetailJSonModel.setProperty("/Data/Betrg", (dedcdTableData.Betrg) ? common.Common.numberWithCommas(dedcdTableData.Betrg) : "0");
		oController._DetailJSonModel.setProperty("/Data/Dmemyn", dedcdTableData.Memyn);
		oController._DetailJSonModel.setProperty("/Data/Bankc", dedcdTableData.Bankc);
		oController._DetailJSonModel.setProperty("/Data/Bankctx", dedcdTableData.Bankctx);
		oController._DetailJSonModel.setProperty("/Data/Repgb", dedcdTableData.Repgb);
		oController._DetailJSonModel.setProperty("/Data/Bankn", dedcdTableData.Bankn);
		oController._DetailJSonModel.setProperty("/Data/Emftx", dedcdTableData.Emftx);
		oController._DetailJSonModel.setProperty("/Data/Bnkgb", dedcdTableData.Bnkgb);
		
		oSearchInput.setValue("");
		oTable.clearSelection();
		
		common.Common.swapClearButton({
			oInput : oDedtx,
			clear : oController.clearInput,
			helper : oController.displayDedgbDialog
		});
		
		oController._DedcdDialog.close();
	},
	
	clearInput : function() {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController();
		
		oController._DetailJSonModel.setProperty("/Data/Dedcd", undefined);
		oController._DetailJSonModel.setProperty("/Data/Dedtx", undefined);
		oController._DetailJSonModel.setProperty("/Data/Betrg", undefined);
		oController._DetailJSonModel.setProperty("/Data/Dmemyn", undefined);
		oController._DetailJSonModel.setProperty("/Data/Bankc", undefined);
		oController._DetailJSonModel.setProperty("/Data/Bankctx", undefined);
		oController._DetailJSonModel.setProperty("/Data/Repgb", undefined);
		oController._DetailJSonModel.setProperty("/Data/Bankn", undefined);
		oController._DetailJSonModel.setProperty("/Data/Emftx", undefined);
		oController._DetailJSonModel.setProperty("/Data/Bnkgb", undefined);
	},

	onSearchDedcd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DedcdTable"),
			vTableModel = oTable.getModel().getData(),
			oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_FIX_SRV"),
			vDedtx = sap.ui.getCore().byId(oController.PAGEID + "_SearchInput").getValue(),
			aFilters = [],
			vData = {Data : []};
		
		if(vTableModel.Data && vTableModel.Data.constructor === Array && vTableModel.Data.length > 0) {
			oTable.removeSelectionInterval(vTableModel.Data.length - 1, 0);
		}
		
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
		
		oController._DedcdTableJSonModel.setData(vData);
		oController._DedcdTableJSonModel.refresh();
		oTable.setVisibleRowCount(vData.Data.length > 14 ? 15 : vData.Data.length + 1);
	},
	
	onChangeAmt : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			_selPath = oEvent.getSource().getBindingContext().sPath;
		
		oController._DetailTableJSonModel.setProperty(_selPath + "/Message", oBundleText.getText("LABEL_2885"));	// 2885:변경
		
		oController.deleteTotalRow();
		oController.makeTotalRow();
	},
	
	onChangeChrsn : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			vChrsn = oEvent.getSource().getSelectedKey(),
			_selPath = oEvent.getSource().getBindingContext().sPath;
		
		// 탈퇴시 금액 0원 조정
		if(vChrsn == "1") {
			oController._DetailTableJSonModel.setProperty(_selPath + "/Betrg", "0");
		}
		oController._DetailTableJSonModel.setProperty(_selPath + "/Message", oBundleText.getText("LABEL_2885"));	// 2885:변경
		
		oController.deleteTotalRow();
		oController.makeTotalRow();
	},
	
	onSetTotalRowColor : function(oController) {
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			tableData = oDetailTable.getModel().getData().Data,
			rowLastIndex = tableData.length - 1;
		
		if(rowLastIndex < 0 || tableData[rowLastIndex].Perid != "계") return;
		
		oDetailTable.getItems()[rowLastIndex].addStyleClass("totalBackground");
		oDetailTable.getItems()[rowLastIndex].getMultiSelectControl().setVisible(false);
	},
	
	deleteTotalRow : function() {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			Datas = oController._DetailTableJSonModel.getData();
		
		if(!Datas.Data || !Datas.Data.length) return;
		
		Datas.Data.splice(Datas.Data.length - 1, 1);
		
//		oDetailTable.getItems()[totalRowIndex].removeStyleClass("totalBackground");
//		oDetailTable.getItems()[totalRowIndex].getMultiSelectControl().setVisible(true);
		
		oController._DetailTableJSonModel.setData(Datas);
		oController._DetailTableJSonModel.refresh();
	},
	
	makeTotalRow : function() {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			Datas = oController._DetailTableJSonModel.getData(),
			vTotalPerson = "",
			vTotalAmt = 0;
		
		if(!Datas.Data || !Datas.Data.length) {
			oController._DetailJSonModel.setProperty("/Data/Percnt", "0");
			oController._DetailJSonModel.setProperty("/Data/Reqamt", "0");
			return;
		}
		
		vTotalPerson = String(Datas.Data.length) + oBundleText.getText("LABEL_1719");	// 1719:명
		Datas.Data.forEach(function(elem) {
			vTotalAmt += (elem.Betrg) ? Number(elem.Betrg.replace(/[^\d]/g, '')) : 0;
		});
		
		Datas.Data.push({
			ZappStatAl : undefined,
			Perid : oBundleText.getText("LABEL_0406"),	// 406:계
			Ename : vTotalPerson,
			Betrg : common.Common.numberWithCommas(vTotalAmt)
		});
		
		oController._DetailTableJSonModel.setData(Datas);
		oController._DetailTableJSonModel.refresh();
		
		oController._DetailJSonModel.setProperty("/Data/Percnt", vTotalPerson.replace(oBundleText.getText("LABEL_1719"), ""));	// 1719:명
		oController._DetailJSonModel.setProperty("/Data/Reqamt", common.Common.numberWithCommas(vTotalAmt));
	},
	
	onPressRetrieve : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_FIX_SRV"),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			vDedcd = oController._DetailJSonModel.getProperty("/Data/Dedcd"),
			vReqym = oController._DetailJSonModel.getProperty("/Data/Reqym"),
			vTableDatas = [],
			vIdx = 1,
			errData = {};
		
		oController.BusyDialog.open();
		
		if(!vReqym) {
			oController.BusyDialog.close();
			return;
		}
			
		if(!vDedcd) {
			oController.BusyDialog.close();
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0490"), {title : oBundleText.getText("LABEL_0053")});	// 490:공제항목을 선택하여 주십시오.
			return;
		}
		
		oDetailTable.clearSelection();
		
		oModel.read("/DeductFixDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Cgubun', sap.ui.model.FilterOperator.EQ, "B"),
				new sap.ui.model.Filter('Cdedcd', sap.ui.model.FilterOperator.EQ, vDedcd),
				new sap.ui.model.Filter('Creqym', sap.ui.model.FilterOperator.EQ, vReqym.replace(/[^\d]/g, ''))
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					oController.deleteTotalRow();
					
					data.results.forEach(function(elem) {
						elem.Idx = vIdx++;
						elem.ZappStatAl = oController._vZappStatAl;
						elem.Chrsn = undefined;
						elem.Betrg = (elem.Betrg) ? common.Common.numberWithCommas(elem.Betrg) : "0";
						
						vTableDatas.push(elem);
					});
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
				if(errData.Error && errData.Error == "E") {
					oController.BusyDialog.close();
					sap.m.MessageBox.alert(errData.ErrorMessage, {});
					return;
				}
			}
		});
		
		oController._DetailTableJSonModel.setData({Data : vTableDatas});
		oController._DetailTableJSonModel.refresh();
		
		oDetailTable.setVisibleRowCount(vTableDatas.length > 14 ? 15 : vTableDatas.length + 1);
		
		oController.makeTotalRow();
		
		oController.BusyDialog.close();
	},
	
	onPressAdd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			Datas = oController._DetailTableJSonModel.getData(),
			vBetrg = oController._DetailJSonModel.getProperty("/Data/Betrg");
		
		oController.deleteTotalRow();
		
		Datas.Data.push({
			ZappStatAl : oController._vZappStatAl,
			Idx : Datas.Data.length + 1,
			Perid : undefined,
			Pernr : undefined,
			Ename : undefined,
			Orgeh : undefined,
			Orgtx : undefined,
			Betrg : (!vBetrg || vBetrg == "0.00") ? "0" : vBetrg,
			Chrsn : undefined,
			Message : oBundleText.getText("LABEL_2885")	// 2885:변경
		});
		
		oController._DetailTableJSonModel.setData(Datas);
		oController._DetailTableJSonModel.refresh();
		oDetailTable.setVisibleRowCount(Datas.Data.length > 14 ? 15 : Datas.Data.length + 1);
		
		oController.makeTotalRow();
	},
	
	onPressCopy : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			vIndex = oDetailTable.getSelectedIndices(),
			Datas = oController._DetailTableJSonModel.getData(),
			_selPath = "",
			orgData = {},
			copyData = {};
		
		if(vIndex.length != 1) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0027"), {title : oBundleText.getText("LABEL_0053")});	// 27:복사할 데이터를 한 건만 선택하여 주십시오.
			return;
		}
		
		_selPath = oDetailTable.getContextByIndex(vIndex[0]).sPath;
		orgData = oController._DetailTableJSonModel.getProperty(_selPath);
		
		if(orgData.Perid == "계") {
			oDetailTable.clearSelection();
			return;
		}
		
		oController.deleteTotalRow();
		
		Object.keys(orgData).map(function(key, index) {
			copyData[key] = orgData[key];
		});
		copyData.Idx = Datas.Data.length + 1;
		copyData.Message = oBundleText.getText("LABEL_2885")	// 2885:변경
		
		Datas.Data.push(copyData);
		
		oController._DetailTableJSonModel.setData(Datas);
		oController._DetailTableJSonModel.refresh();
		oDetailTable.setVisibleRowCount(Datas.Data.length > 14 ? 15 : Datas.Data.length + 1);
		
		oController.makeTotalRow();
	},
	
	onPressDelRecord : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			vIndexs = oDetailTable.getSelectedIndices();
		
		if(vIndexs.length < 1) {
			new sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		var procDeleteRecord = function(fVal) {
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				var vIdx = 0;
				var check = function(seq, vInfoData){
					if(vInfoData[seq].NoDel === true) {
						return true;
					} else {
						for(var a=0; a<vIndexs.length; a++){
							if(vIndexs[a] == seq) return false;
						}
					}
					
					return true;
				}
				
				var vData = oController._DetailTableJSonModel.getData();
				var vInfoData = vData.Data;
				
				oController.deleteTotalRow();
				
				vData.Data = [];
				oController._DetailTableJSonModel.setData(vData);
				
				for(var i=0; i<vInfoData.length; i++) {
					if(check(i, vInfoData)) {
						vIdx = vIdx + 1;
						vInfoData[i].Idx = vIdx;
						vData.Data.push(vInfoData[i]);
					}
				}
				
				oController._DetailTableJSonModel.setData(vData);
				oDetailTable.setVisibleRowCount(vData.Data.length > 14 ? 15 : vData.Data.length + 1);
				oDetailTable.clearSelection();
				
				oController.makeTotalRow();
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// 35:삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : procDeleteRecord
		});
	},
	
	onPressFormExcelDown : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			oJSONModelData = oTable.getModel().getProperty("/Data"),
			aDataCopy = [];
		
		aDataCopy = oJSONModelData.filter(function(item) {
			return item.Perid != "계";
		});
		
		var oSettings = {
				workbook: { columns: [
					oController._Columns[1],
					oController._Columns[4],
					oController._Columns[5]
				] },
				dataSource: aDataCopy,
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
				fileName: oBundleText.getText("LABEL_0484") + ".xlsx"	// 484:[공장]고정공제 대상자 양식
		};
	
		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	},
	
	onPressExcelDown : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			oJSONModelData = oTable.getModel().getProperty("/Data"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"}),
			curDate = new Date();
		
		if(oJSONModelData.length < 1) return;
		
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModelData,
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
				fileName: oBundleText.getText("LABEL_0483") + "-" + dateFormat.format(curDate) + ".xlsx"	// 483:[공장]고정공제 대상자
		};
	
		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	},
	
	changeFile : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			reader = new FileReader(),
			f = jQuery.sap.domById(oController.PAGEID + "_EXCEL_UPLOAD_BTN" + "-fu").files[0];
		
		reader.onload = function(e) {
			oController.BusyDialog.open();
			
			oController.X = XLSX;
			
			var data = e.target.result,
				arr = oController.fixdata(data),
				wb = oController.X.read(btoa(arr), {type: 'base64'});
			
			oController.to_json(wb);
			
			oController.BusyDialog.close();
		};
		
		reader.readAsArrayBuffer(f);
	},
	
	fixdata : function(data) {
		var o = "", l = 0, w = 10240;
		for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
		o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
		return o;
	},
	
	to_json : function(workbook) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_UPLOAD_BTN"), 
			oListTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable"),
			oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_FIX_SRV"),
			curDate = new Date(),
			Datas = {Data : []},
			excelData = {},
			rowDatas = [],
			vIdx = 0;
		
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = oController.X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]),
				cRowData = {};
			
			if(roa && roa.length) {
				roa.forEach(function(rowElem) {
					cRowData = {};
					cRowData.Perid = rowElem.Coulmn_0;
					cRowData.BetrgC = rowElem.Coulmn_1;
					cRowData.Chrsn = rowElem.Coulmn_2;
					cRowData.Waers = "KRW";
					
					rowDatas.push(cRowData);
				});
			}
		});
		
		if(rowDatas.length) {
			excelData.Prcty = "U";
			excelData.Actty = _gAuth;
			excelData.DetailNav = rowDatas;
			
			oModel.create("/DeductFixApplSet", excelData, {
				success: function(data,res) {
					if(data.DetailNav.results && data.DetailNav.results.length) {
						data.DetailNav.results.forEach(function(elem) {
							cRowData = {};
							
							cRowData.Idx = ++vIdx;
							cRowData.ZappStatAl = oController._vZappStatAl;
							cRowData.Pernr = elem.Pernr;
							cRowData.Perid = elem.Perid;
							cRowData.Ename = elem.Ename;
							cRowData.Orgeh = elem.Orgeh;
							cRowData.Orgtx = elem.Orgtx;
							cRowData.Betrg = $.isNumeric(elem.Betrg) ? common.Common.numberWithCommas(elem.Betrg) : elem.Betrg;
							cRowData.Waers = elem.Waers || "KRW";
							cRowData.Chrsn = elem.Chrsn;
							cRowData.Chrsntx = elem.Chrsntx;
							cRowData.Message = elem.Message;
							
							Datas.Data.push(cRowData);
						});
					}
				},
				error: function (Res) {
					errData = common.Common.parseError(Res);
					if(errData.Error && errData.Error == "E") {
						sap.m.MessageBox.alert(errData.ErrorMessage, {});
						return;
					}
				}
			});
			
			oController.deleteTotalRow();
			
			oController._DetailTableJSonModel.setData(Datas);
			oController._DetailTableJSonModel.refresh();
			oListTable.setVisibleRowCount(Datas.Data.length > 14 ? 15 : Datas.Data.length + 1);
			
			oController.makeTotalRow();
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0486"), {});	// 486:Excel정보를 읽을 수 없습니다.
			return;
		}
		
		oFileUploader.setValue("");
		oFileUploader.setVisible(false);
		oFileUploader.setVisible(true);
	},
	
	SmartSizing : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
//			oController = oView.getController();
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_FIX_SRV"),
			oDedtx = sap.ui.getCore().byId(oController.PAGEID + "_Dedtx"),
			errData = {};
		
		oModel.read("/DeductFixApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					oDetailData.Data = data.results[0];
					
					oDetailData.Data.Reqamt = (oDetailData.Data.Reqamt) ? common.Common.numberWithCommas(oDetailData.Data.Reqamt) : "0";
					oDetailData.Data.Reqym = (!oDetailData.Data.Reqym || oDetailData.Data.Reqym == "000000") ? "" : oDetailData.Data.Reqym.replace(/(\d{4})(\d{2})/g, '$1.$2');
					
					common.Common.swapClearButton({
						oInput : oDedtx,
						clear : oController.clearInput,
						helper : oController.displayDedgbDialog
					});
				}
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
	
	retrieveDetailTable : function(oController, oDetailTableData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_FIX_SRV"),
			errData = {},
			vIdx = 1;
		
		oModel.read("/DeductFixDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Cgubun', sap.ui.model.FilterOperator.EQ, "A"),
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					oController.deleteTotalRow();
					
					data.results.forEach(function(elem) {
						elem.Idx = vIdx++;
						elem.ZappStatAl = oController._vZappStatAl;
						elem.Betrg = elem.Betrg ? common.Common.numberWithCommas(elem.Betrg) : "0";
						
						oDetailTableData.Data.push(elem);
					});
				}
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
		
		// 첨부파일 
		common.AttachFileAction.oController = oController;
		common.AttachFileAction.setAttachFile(oController);
		common.AttachFileAction.refreshAttachFileList(oController);	
	},
	
	setPageHeader : function(oController, vZappStatAl) {
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		
		if(vZappStatAl == "") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0485") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 485:[공장]고정공제 신청
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0485") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 485:[공장]고정공제 신청
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0485") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 485:[공장]고정공제 신청
		}
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	onPreSaveOpenDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_FIX_SRV"),
			vDetailData = oController._DetailJSonModel.getData().Data,
			checkData = {Data : {}},
			vOData = oController.onValidationData(oController, "C");
		
		if(!vDetailData.Dedcd) return;
		if(vOData == "") return;
		
		oModel.read("/DedcdListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Dedcd', sap.ui.model.FilterOperator.EQ, vDetailData.Dedcd)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					checkData.Data = data.results[0];
					
					checkData.Data.Percnt = vDetailData.Percnt;
					checkData.Data.Reqamt = vDetailData.Reqamt;
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
		
		oController._DetailSaveJSonModel.setData(checkData);
		
		if(!oController._PreSaveDialog) {
			oController._PreSaveDialog = sap.ui.jsfragment("ZUI5_HR_Deduction.fragment.PreSaveDialog", oController);
			oView.addDependent(oController._PreSaveDialog);
		}
		
		oController._PreSaveDialog.open();
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController();
		
		oController._PreSaveDialog.close();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty) { // 처리 구분
		var vZappStatAl	= "", 
			errData = {};
		
		if(!oController.onValidationData(oController, vPrcty)) return;
		
		var onProcess = function() {
			// 결재라인 저장
			var vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
			
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_FIX_SRV"),
				oneData = oController._DetailJSonModel.getProperty("/Data"),
				createData = {};
			
			createData = common.Common.copyByMetadata(oModel, "DeductFixAppl", oneData);
			createData.Reqamt = createData.Reqamt.replace(/[^\d]/g, '');
			createData.Reqym = createData.Reqym.replace(/[^\d]/g, '');
			createData.Waers = createData.Waers || "KRW";
			createData.Prcty = vPrcty;
			createData.Actty = _gAuth;
			
			delete createData.Percnt;
			
			var vDetailDataList = [], vDetailData = {},
				vTableData = oController._DetailTableJSonModel.getProperty("/Data");
			
			vTableData.forEach(function(element) {
				if(element.Perid != "계") {
					vDetailData = {};
					vDetailData = common.Common.copyByMetadata(oModel, "DeductFixDetail", element);
					vDetailData.Betrg = (!vDetailData.Betrg || vDetailData.Betrg == "") ? "0" : vDetailData.Betrg.replace(/[^\d]/g, '');
					vDetailData.Waers = vDetailData.Waers || "KRW";
					
					vDetailDataList.push(vDetailData);
				}
			});
			
			createData.DetailNav = vDetailDataList;
			
			oModel.create("/DeductFixApplSet", createData, {
				success: function(data,res) {
					if(data) {
						oController._vAppno = data.Appno;
						oController._DetailJSonModel.setProperty("/Data/Appno", data.Appno); 
						oController._DetailJSonModel.setProperty("/Data/ZappStatAl", data.ZappStatAl); 
						vZappStatAl = data.ZappStatAl;
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
			
			common.AttachFileAction.uploadFile(oController);
			
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
			vInfoTxt = oBundleText.getText("LABEL_0051");	// 51:신청하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0048");	// 48:신청이 완료되었습니다.
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
	
	onValidationData : function(oController, vPrcty) {
		var oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_FIX_SRV"),
			vData = oController._DetailJSonModel.getProperty("/Data");
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Dedcd) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0488"));	// 488:고정공제 항목이 선택되지 않았습니다.
			return "";
		}
		
		if(vPrcty == "C") {
			if(!vData.Reqym) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_2902"));	// 2902:공제예정월이 없습니다.
				return "";
			}
			
			var targetDatas = oController._DetailTableJSonModel.getProperty("/Data");
			if(targetDatas.constructor !== Array || targetDatas.length < 1) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0025"), {title : oBundleText.getText("LABEL_0053")});	// 25:변경 대상자를 선택하여 주십시오.
				return false;
			}
			
			var isDup = false, isInputPernrValid = true, isInputValid = true, aPernr = [];
			targetDatas.some(function(elem, index) {
				if(elem.Perid != "계") {
					if(aPernr.indexOf(elem.Pernr) > -1) {
						isDup = true;
						return true;
					} else {
						aPernr.push(elem.Pernr);
					}
					
					if(!elem.Pernr || elem.Pernr == "") {
						isInputPernrValid = false;
						return true;
					}
					
					if(!elem.Betrg || elem.Betrg == "") elem.Betrg = "0";
					/* 금액 체크 제외
					// 기존 조회된 Data
					if(elem.NoDel) {
						if(elem.Message == oBundleText.getText("LABEL_2885")) {		// 변경한 경우
							if(!elem.Betrg || elem.Betrg == "" || (elem.Betrg == "0" && elem.Chrsn != "1")) {	// 탈퇴를 제외한 케이스일 때 금액이 0원이면 FAIL
								isInputValid = false;
								return true;
							}
						}
					// 새로 추가된 Data
					} else {
						// 모든 케이스 탈퇴를 제외한 0원이면 FAIL
						if(!elem.Betrg || elem.Betrg == "" || (elem.Betrg == "0" && elem.Chrsn != "1")) {	// 탈퇴를 제외한 케이스일 때 금액이 0원이면 FAIL
							isInputValid = false;
							return true;
						}
					}*/
						
					if(elem.Message == oBundleText.getText("LABEL_2885") && (!elem.Chrsn || elem.Chrsn == "")) {	// 2885:변경
						isInputValid = false;
						return true;
					}
				}
			});
			
			if(isDup) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0066"), {title : oBundleText.getText("LABEL_0053")});	// 66:중복입력한 대상자가 있어서 신청이 불가능합니다.
				return false;
			}
			if(!isInputPernrValid) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
				return false;
			}
			if(!isInputValid) {
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0489"), {title : oBundleText.getText("LABEL_0053")});	// 489:공제금액과 변경사유를 입력하세요.
				return false;
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
		
		return true;
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty) { // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			errData = {};
		
		var onProcess = function() {
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_FIX_SRV");
			
			oModel.remove("/DeductFixApplSet(Appno='" + vDetailData.Appno + "')", {
				success: function(data,res) {
				},
				error: function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			oController.BusyDialog.close();
			
			if(errData.Error && errData.Error == "E") {
				sap.m.MessageBox.show(errData.ErrorMessage, {});
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
		
		var DeleteProcess = function(fVal) {
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
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController) {
		var detailData = oController._DetailJSonModel.getProperty("/Data");
		
		delete detailData.Dedcd;
		delete detailData.Dedtx;
		delete detailData.Dmemyn;
		delete detailData.Percnt;
		delete detailData.Reqamt;
		delete detailData.Bankn;
		delete detailData.Emftx;
		delete detailData.Zbigo;
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
		
		oController.deleteTotalRow();
		oController._DetailTableJSonModel.setData({Data : []});
		oController._DetailTableJSonModel.refresh();
	},
	
	onAfterSelectPernr : function(oController) {
		// 신청내역 초기화
		oController.onResetDetail(oController);
		
		// 공제 input icon 초기화
		oController.initDedtxInputHelper(oController);
		
		var vPersa = oController._TargetJSonModel.getProperty("/Data/Persa");
		if(vPersa != "7000") {
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1329"), {title : oBundleText.getText("LABEL_0053")});	// 1329:본사 인원은 신청할 수 없습니다.
			oController._TargetJSonModel.setProperty("/Data", {Auth : _gAuth, ZappStatAl : oController._vZappStatAl});
			oController._DetailJSonModel.setProperty("/Data/Pernr", undefined);
		}
		
		// 공제예정월
		oController.retrieveDedReqym(oController);
	},
	
	openDocno : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
			oController = oView.getController(),
			vUri = oController._DetailJSonModel.getProperty("/Data/Zurl");
		
		if(vUri && vUri != "")  window.open(vUri);
	},
	
	onPressSort : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail"),
		oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var vData = oTable.getModel().getData();
		
		var custonSort = function (a, b) { 
			if(a.Perid == b.Perid){ return 0} 
			return a.Perid > b.Perid ? 1 : -1; } 
		
		if(vData.Data && vData.Data.length > 0){
			var vLastIndex = vData.Data[vData.Data.length - 1];
			vData.Data.splice(vData.Data.length - 1,1);
			vData.Data.sort(custonSort);
			common.Common.reIndexODataArray(vData.Data);
			vData.Data.push(vLastIndex);
		}
			
		
		oTable.getModel().setData(vData);
	}
});