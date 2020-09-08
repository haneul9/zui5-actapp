jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.ZipSearch");

sap.ui.controller("ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail
	 */

	PAGEID : "ZUI5_HR_DeductionItemDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_DedcdTableJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	
	_vZworktyp : 'HR37',
	_vEnamefg : "",
	
	_DialogActionFlag : null ,
	_vPersa : "" ,
	_vAppno : "",
	_vZappStatAl : "",

	_oControl : null ,
	BusyDialog : new sap.m.BusyDialog(),
	_vFromPage : "",
	
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
			oBtnAppLine = sap.ui.getCore().byId(oController.PAGEID + "_BtnAppLine"),
			vPersa = "",
			vEmail = "",
			vDedgb = "",
			vNewyn = "",
			vBnkgb = "",
			vRepgb = "";
		
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
		
		// 상세 조회
		oController.retrieveDetail(oController, oDetailData);
		
		// 상세화면 Default Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = oDetailData.Data.ZappStatAl || '';
		oController._vZappStatAl = oDetailData.Data.ZappStatAl;
		oController._DetailJSonModel.setData(oDetailData);
		
		// 공통적용사항
		oController.commonAction(oController, oDetailData);
		
		// Persa update
		vPersa = oController._TargetJSonModel.getProperty("/Data/Persa");
		oController._DetailJSonModel.setProperty("/Data/Persa", vPersa);
		
		// 초기값 셋팅
		if(oController._vZappStatAl == "") {
			vEmail = oController._TargetJSonModel.getProperty("/Data/Email");
			vDedgb = (_gAuth == "E" && vPersa != "7000") ? "0020" : undefined;
			vNewyn = (_gAuth == "E" && vPersa != "7000") ? "0" : undefined;
			vBnkgb = (vDedgb == "0020") ? "1" : undefined;
			vRepgb = (vDedgb == "0020") ? "C" : undefined;
			
			oController._DetailJSonModel.setProperty("/Data/Newyn", vNewyn);
			oController._DetailJSonModel.setProperty("/Data/Email", vEmail);
			oController._DetailJSonModel.setProperty("/Data/Dedgb", vDedgb);
			oController._DetailJSonModel.setProperty("/Data/Bnkgb", vBnkgb);
			oController._DetailJSonModel.setProperty("/Data/Repgb", vRepgb);
			
			// 결재지정 버튼
			if (vDedgb == "0020") oBtnAppLine.setVisible(false);
			
			// 공제예정월
			oController.retrieveDedReqym(oController);

			// 계좌정보
			if(vBnkgb) oController.onChangeBnkgb();
		} else if(oController._vZappStatAl == "10") {
			// 공제예정기간
			oController.onSetReqymTerm(oController);
		}
		
		// 신규 결재번호 채번
		oController.getAppno(oController);
		
		// 결재번호 binding
		oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
		
		// 결재 상태에 따라 Page Header Text 수정
		oController.setPageHeader(oController, oDetailData.Data.ZappStatAl);
		
		// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
		
		oController.buildCombo(oController);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail"),
			oController = oView.getController();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id : oController._vFromPage || "ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemList",
			data : {}
		});
	},
	
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail"),
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
	
	buildCombo : function(oController) {
		// 예금주 구분
		oController.onSetRepgb(oController);
	},
	
	getAppno : function(oController) {
		if(oController._vAppno != '') return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_OBJ_SRV"),
			errData = {};
		
		oModel.read("/DeductObjApplSet", {
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
	
	onSetRepgb : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_OBJ_SRV"),
			oRepgb = sap.ui.getCore().byId(oController.PAGEID + "_Repgb"),
			vDedgb = oController._DetailJSonModel.getProperty("/Data/Dedgb");
	
		if(!vDedgb) return;
		
		if(oRepgb.getItems()) oRepgb.destroyItems();
		
		oModel.read("/RepGbnListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Dedgb', sap.ui.model.FilterOperator.EQ, vDedgb)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					data.results.forEach(function(elem) {
						oRepgb.addItem(new sap.ui.core.Item({
							key : elem.Repgb,
							text : elem.Repgbtx
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
	
	onChangeDedgb : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail"),
			oController = oView.getController(),
			oBtnAppLine = sap.ui.getCore().byId(oController.PAGEID + "_BtnAppLine"),
			vDedgb = oEvent.getSource().getSelectedKey();
		
		// 입력내역 초기화
		oController.onResetDetail(oController, "Dedgb");
		
		if(vDedgb == "0020") {
			// 결재지정 버튼 숨기기(데이터 초기화)
			oController._ApprovalLineModel.setData({Data : []});
			oBtnAppLine.setVisible(false);
			
			oController._DetailJSonModel.setProperty("/Data/Newyn", "0");
			oController._DetailJSonModel.setProperty("/Data/Bnkgb", "2");
			oController._DetailJSonModel.setProperty("/Data/Repgb", "C");
			
			oController.onChangeBnkgb();
		} else {
			// 결재지정 버튼 보이기
			oBtnAppLine.setVisible(true);
		}
		
		// 예금주 구분
		oController.onSetRepgb(oController);
		
		// 공제예정기간
		oController.onSetReqymTerm(oController);
	},
	
	onChangeNewyn : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail"),
			oController = oView.getController();
		
		// 입력내역 초기화
		oController.onResetDetail(oController, "Newyn");
		
		// 공제예정기간
		oController.onSetReqymTerm(oController);
	},

	onChangeBnkgb : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_OBJ_SRV"),
			vReqym = oController._DetailJSonModel.getProperty("/Data/Reqym"),
			vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"),
			vBnkgb = oController._DetailJSonModel.getProperty("/Data/Bnkgb");
		
		if(!vReqym || !vEncid) return;
		
		// 입력내역 초기화
		oController.onResetDetail(oController, "Bnkgb");
		
		oModel.read("/PerBankinfoSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Reqym', sap.ui.model.FilterOperator.EQ, vReqym.replace(/[^\d]/g, '')),
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, vEncid),
				new sap.ui.model.Filter('Bnkgb', sap.ui.model.FilterOperator.EQ, vBnkgb)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					var vData = data.results[0];
					
					oController._DetailJSonModel.setProperty("/Data/Bankc", vData.Bankc);
					oController._DetailJSonModel.setProperty("/Data/Bankn", vData.Bankn);
					oController._DetailJSonModel.setProperty("/Data/Emftx", vData.Emftx);
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
	
	onChangeDedtxnew : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_OBJ_SRV"),
			vDedgb = oController._DetailJSonModel.getProperty("/Data/Dedgb"),
			vDedtx = oEvent.getSource().getValue();
		
		if(!vDedtx) return;
		
		oModel.read("/DedcdListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Dedtx', sap.ui.model.FilterOperator.EQ, vDedtx),
				new sap.ui.model.Filter('Dedgb', sap.ui.model.FilterOperator.EQ, vDedgb)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					data.results.forEach(function(elem) {
						if(vDedtx == elem.Dedtx) {
							sap.m.MessageBox.alert(oBundleText.getText("LABEL_0468"), {});	// 468:이미 사용중인 공제명이므로, 변경해 주세요.
							oEvent.getSource().setValue("");
						}
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
	
	onChangeBankn : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail"),
			oController = oView.getController(),
			vBankn = oEvent.getSource().getValue();
		
		if(!vBankn) return;
		
		if(vBankn.length > 18) vBankn = vBankn.substring(0, 18);
		
		oEvent.getSource().setValue(vBankn.replace(/[^\d]/g, ''));
	},
	
	DedtxSearchInput : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail"),
			oController = oView.getController(),
			vDedtx = oEvent.getSource().getValue();
		
		if(!oController._DedcdDialog) {
			oController._DedcdDialog = sap.ui.jsfragment("ZUI5_HR_DeductionItem.fragment.DedcdDialog", oController);
			oView.addDependent(oController._DedcdDialog);
		}
		
		sap.ui.getCore().byId(oController.PAGEID + "_SearchInput").setValue(vDedtx);
		
		oController.onSearchDedcd();
		
		oController._DedcdDialog.open();
	},
	
	displayDedgbDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail"),
			oController = oView.getController();
		
		if(!oController._DedcdDialog) {
			oController._DedcdDialog = sap.ui.jsfragment("ZUI5_HR_DeductionItem.fragment.DedcdDialog", oController);
			oView.addDependent(oController._DedcdDialog);
		}
		
		oController.onSearchDedcd();
		
		oController._DedcdDialog.open();
	},
	
	onSelectDedcd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail"),
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
		
		oController._DetailJSonModel.setProperty("/Data/Dedcd", dedcdTableData.Dedcd);
		oController._DetailJSonModel.setProperty("/Data/Dedtx", dedcdTableData.Dedtx);
		oController._DetailJSonModel.setProperty("/Data/Memyn", dedcdTableData.Memyn);
		oController._DetailJSonModel.setProperty("/Data/Bankc", dedcdTableData.Bankc);
		oController._DetailJSonModel.setProperty("/Data/Repgb", dedcdTableData.Repgb);
		oController._DetailJSonModel.setProperty("/Data/Bankn", dedcdTableData.Bankn);
		oController._DetailJSonModel.setProperty("/Data/Emftx", dedcdTableData.Emftx);
		oController._DetailJSonModel.setProperty("/Data/Bnkgb", dedcdTableData.Bnkgb);
		
		oSearchInput.setValue("");
		oTable.clearSelection();
		
		// 공제예정기간
		oController.onSetReqymTerm(oController);
		
		oController._DedcdDialog.close();
	},

	onSearchDedcd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_DedcdTable"),
			oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_OBJ_SRV"),
			vDedtx = sap.ui.getCore().byId(oController.PAGEID + "_SearchInput").getValue(),
			vDedgb = oController._DetailJSonModel.getProperty("/Data/Dedgb"),
			aFilters = [],
			vData = {Data : []};
		
		if(!vDedgb) {
			oController._DedcdDialog.close();
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0461"), {title : oBundleText.getText("LABEL_0053")});	// 461:변동/고정 구분을 선택하여 주십시오.
			return;
		}
		
		aFilters.push(new sap.ui.model.Filter('Dedgb', sap.ui.model.FilterOperator.EQ, vDedgb));
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
	
	SmartSizing : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail"),
//			oController = oView.getController();
	},
	
	retrieveDedReqym : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_OBJ_SRV"),
			vReqym = "",
			vPersa = oController._TargetJSonModel.getProperty("/Data/Persa");
		
		oModel.read("/DedReqymSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Werks', sap.ui.model.FilterOperator.EQ, vPersa)
			],
			success : function(data, res) {
				if(data.results && data.results.length) {
					vReqym = data.results[0].Reqym;
					vReqym = (vReqym) ? vReqym.replace(/(\d{4})(\d{2})/g, '$1.$2') : "";
					
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
		
		oController.onSetReqymTerm(oController);
	},
	
	onSetReqymTerm : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_OBJ_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy.MM.dd"}),
			vDedgb = oController._DetailJSonModel.getProperty("/Data/Dedgb"),
			vReqym = oController._DetailJSonModel.getProperty("/Data/Reqym"),
			vNewyn = oController._DetailJSonModel.getProperty("/Data/Newyn"),
			vDedcd = oController._DetailJSonModel.getProperty("/Data/Dedcd"),
			aFilters = [],
			rBegda = "",
			rEndda = "";
		
		if(!vDedgb || !vReqym || !vNewyn) {
			return;
		}
		
		aFilters.push(new sap.ui.model.Filter('Dedgb', sap.ui.model.FilterOperator.EQ, vDedgb));
		aFilters.push(new sap.ui.model.Filter('Reqym', sap.ui.model.FilterOperator.EQ, vReqym.replace(/[^\d]/g, '')));
		aFilters.push(new sap.ui.model.Filter('Newyn', sap.ui.model.FilterOperator.EQ, vNewyn));
		if(vNewyn == "1" && vDedcd) {	// 내역수정
			aFilters.push(new sap.ui.model.Filter('Dedcd', sap.ui.model.FilterOperator.EQ, vDedcd));
		}
		
		oModel.read("/DedReqymBegdaEnddaSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					rBegda = (data.results[0].Begda) ? dateFormat.format(data.results[0].Begda) : undefined;
					rEndda = (data.results[0].Endda) ? dateFormat.format(data.results[0].Endda) : undefined;
				}
			},
			error : function(Res) {
				errData = common.Common.parseError(Res);
			}
		});
			
		oController._DetailJSonModel.setProperty("/Data/Todo1", rBegda);
		oController._DetailJSonModel.setProperty("/Data/Todo2", rEndda);
	},
	
	retrieveDetail : function(oController, oDetailData) {
		if(!oController._vAppno) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_OBJ_SRV"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}),
			dateFormat2 = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"}),
			errData = {};
		
		oModel.read("/DeductObjApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, oController._vAppno),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D')
			],
			success : function(data, res) {
				oDetailData.Data = data.results[0];
				
				oDetailData.Data.Reqym = (!oDetailData.Data.Reqym || oDetailData.Data.Reqym == "000000") ? "" : oDetailData.Data.Reqym.replace(/(\d{4})(\d{2})/g, '$1.$2');
				oDetailData.Data.Todo1 = (oDetailData.Data.Begda) ? dateFormat2.format(oDetailData.Data.Begda) : undefined;
				oDetailData.Data.Todo2 = (oDetailData.Data.Endda) ? dateFormat2.format(oDetailData.Data.Endda) : undefined;
				if(oDetailData.Data.Newyn == "0" || oDetailData.Data.Dedgb == "0020") {
					oDetailData.Data.Dedtxnew = oDetailData.Data.Dedtx;
					oDetailData.Data.Dedtx = undefined;
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
			oDetailTitle.setText(oBundleText.getText("LABEL_0457") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 457:고정/변동 공제신청 (항목)
		} else if(vZappStatAl == "10") {
			oDetailTitle.setText(oBundleText.getText("LABEL_0457") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 457:고정/변동 공제신청 (항목)
		} else {
			oDetailTitle.setText(oBundleText.getText("LABEL_0457") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 457:고정/변동 공제신청 (항목)
		}
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty) { // 처리 구분
		var vZappStatAl	= "", 
			errData = {},
			vOData = oController.onValidationData(oController, vPrcty);
		
		if(vOData == "") return;
		
		vOData.Actty = _gAuth;
		vOData.Prcty = vPrcty;
		
		var onProcess = function() {
			// 결재라인 저장
			var vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
			
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_OBJ_SRV");
			
			oModel.create("/DeductObjApplSet", vOData, {
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
		var oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_OBJ_SRV"),
			rData = {},
			vData = oController._DetailJSonModel.getProperty("/Data");
		
		if(!vData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Dedgb) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0462"));	// 462:변동/고정 구분이 선택되지 않았습니다.
			return "";
		}
		
		if(vPrcty == "C") {
			if(vData.Persa == "7000" && vData.Dedgb == "0020" && !vData.Newyn) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0463"));	// 463:신규/수정 구분이 선택되지 않았습니다.
				return "";
			}
			if((vData.Newyn == "0" && !vData.Dedtxnew) || (vData.Persa != "7000" && vData.Dedgb == "0020" && !vData.Dedtxnew)) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0464"));	// 464:신규공제명이 입력되지 않았습니다.
				return "";
			}
			if(vData.Newyn == "1" && !vData.Dedcd) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0460"));	// 460:공제명이 입력되지 않았습니다.
				return "";
			}
			if(vData.Persa == "7000" && !vData.Bnkgb) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0469"));	// 469:입금 구분이 선택되지 않았습니다.
				return "";
			}
			if(vData.Persa == "7000" && vData.Dedgb == "0020" && !vData.Email) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0467"));	// 467:이메일이 입력되지 않았습니다.
				return "";
			}
			if(vData.Bnkgb == "4") {
				if(!vData.Bankc) {
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0471"));	// 471:입금은행이 입력되지 않았습니다.
					return "";
				}
				if(!vData.Bankn) {
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0470"));	// 470:입금계좌정보가 입력되지 않았습니다.
					return "";
				}
				if(!vData.Emftx) {
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0466"));	// 466:예금주가 입력되지 않았습니다.
					return "";
				}
				if(!vData.Repgb) {
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0465"));	// 465:예금주 구분이 선택되지 않았습니다.
					return "";
				}
			}
			
			if(vData.Dedgb == "0010") {
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
		}
		
		// 신규일 경우 저장시 신규공제명 값을 공제명 필드에 담는다.
		if(vData.Newyn == "0") vData.Dedtx = vData.Dedtxnew;
		
		try {
			rData = common.Common.copyByMetadata(oModel, "DeductObjAppl", vData);
			
			rData.Memyn = rData.Memyn || false;
			rData.Reqym = (rData.Reqym) ? rData.Reqym.replace(/[^\d]/g, '') : undefined;
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty) { // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail"),
			oController = oView.getController(),
			errData = {};
		
		var onProcess = function() {
			var vDetailData = oController._DetailJSonModel.getProperty("/Data"),
				oModel = sap.ui.getCore().getModel("ZHR_DEDUCT_OBJ_SRV");
			
			oModel.remove("/DeductObjApplSet(Appno='" + vDetailData.Appno + "')", {
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
	onResetDetail : function(oController, changeComboKey) {
		var detailData = oController._DetailJSonModel.getProperty("/Data");
		
		if(changeComboKey != "Dedgb" && changeComboKey != "Newyn" && changeComboKey != "Bnkgb") {
			delete detailData.Dedgb;	// 변동/고정
		}
		if(changeComboKey != "Newyn" && changeComboKey != "Bnkgb") { 
			delete detailData.Newyn;	// 신규/수정
		}
		if(changeComboKey != "Bnkgb") {
			delete detailData.Dedtx;	// 공제명
			delete detailData.Dedtxnew;	// 신규공제명
			delete detailData.Bnkgb;	// 입금구분
			delete detailData.Zbigo;	// 비고
			delete detailData.Memyn;	// 동호회 여부
			delete detailData.Repgb;	// 예금주 구분
		}
		
		delete detailData.Bankc;	// 입금은행
		delete detailData.Bankn;	// 입금계좌정보
		delete detailData.Emftx;	// 예금주
		
		oController._DetailJSonModel.setProperty("/Data", detailData);
	},
	
	onAfterSelectPernr : function(oController) {
		// 신청내역 초기화
		oController.onResetDetail(oController, "");
		
		// Persa 값 update
		var vPersa = oController._TargetJSonModel.getProperty("/Data/Persa");
		var vEmail = oController._TargetJSonModel.getProperty("/Data/Email");
		var vDedgb = (vPersa != "7000") ? "0020" : "";
		var vBnkgb = (vDedgb == "0020") ? "1" : undefined;
		var vRepgb = (vDedgb == "0020") ? "C" : undefined;
		
		oController._DetailJSonModel.setProperty("/Data/Persa", vPersa);
		oController._DetailJSonModel.setProperty("/Data/Email", vEmail);
		oController._DetailJSonModel.setProperty("/Data/Dedgb", vDedgb);
		oController._DetailJSonModel.setProperty("/Data/Newyn", (vPersa != "7000") ? "0" : "");
		oController._DetailJSonModel.setProperty("/Data/Bnkgb", vBnkgb);
		oController._DetailJSonModel.setProperty("/Data/Repgb", vRepgb);
		
		// 공제예정월
		oController.retrieveDedReqym(oController);

		// 계좌정보
		if(vBnkgb) oController.onChangeBnkgb();
		
		// 예금주 구분
		oController.onSetRepgb(oController);
	},
	
	openDocno : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail"),
			oController = oView.getController(),
			vUri = oController._DetailJSonModel.getProperty("/Data/Zurl");
		
		if(vUri && vUri != "")  window.open(vUri);
	}
});
