jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_ProductionEvaluationAdjust.ZUI5_HR_ProductionEvaluationAdjustList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ProductionEvaluationAdjust.ZUI5_HR_ProductionEvaluationAdjustList
	 */

	PAGEID : "ZUI5_HR_ProductionEvaluationAdjustList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_EvalDetailJSonModel : new sap.ui.model.json.JSONModel(),
	_EvalListJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_Columns : "",
	_vPersa : "" ,
	_vClsdt : "",
	_vZpayym : "",
	_vAppno : "",
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
		var curDate = new Date(),
			curYear = curDate.getFullYear(),
			mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo"),
			vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet"),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy.MM.dd"}),
			oController = this,
			detailData = {Data : {}};
		
		// _DetailJSonModel 초기화
		detailData.Data.Auth = _gAuth;
		detailData.Data.ZappStatAl = "";
		oController._DetailJSonModel.setData(detailData);
		
		oController._EvalDetailJSonModel.setData({Data : {}});
		oController._EvalListJSonModel.setData({Data : []});
		
		// 대상자 조회
		common.TargetUser.oController = oController;
		common.TargetUser.onSetTarget(oController);
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", "");
		
		if(gReqAuth == "2" && vEmpLoginInfo.length > 0) {
			oController._TargetJSonModel.setProperty("/Data/Ename", vEmpLoginInfo[0].Ename);
			oController._TargetJSonModel.setProperty("/Data/Pernr", vEmpLoginInfo[0].Pernr);
			oController._TargetJSonModel.setProperty("/Data/Encid", vEmpLoginInfo[0].Encid);
			oController._TargetJSonModel.setProperty("/Data/Perid", vEmpLoginInfo[0].Perid);
			oController._TargetJSonModel.setProperty("/Data/Btrtx", vEmpLoginInfo[0].Btrtx);
			oController._TargetJSonModel.setProperty("/Data/Orgeh", vEmpLoginInfo[0].Orgeh);
			oController._TargetJSonModel.setProperty("/Data/Orgtx", vEmpLoginInfo[0].Stext);
			oController._TargetJSonModel.setProperty("/Data/Zzjikgb", vEmpLoginInfo[0].Zzjikgb);
			oController._TargetJSonModel.setProperty("/Data/Zzjikgbt", vEmpLoginInfo[0].Zzjikgbt);
			oController._TargetJSonModel.setProperty("/Data/Zzjiktlt", vEmpLoginInfo[0].Zzjiktlt);
			oController._TargetJSonModel.setProperty("/Data/Zzjikch", vEmpLoginInfo[0].Zzjikch);
			oController._TargetJSonModel.setProperty("/Data/Zzjikcht", vEmpLoginInfo[0].Zzjikcht);
			oController._TargetJSonModel.setProperty("/Data/Zzjikln", vEmpLoginInfo[0].Zzjikln);
			oController._TargetJSonModel.setProperty("/Data/Zzjiklnt", vEmpLoginInfo[0].Zzjiklnt);
			oController._TargetJSonModel.setProperty("/Data/Entda", dateFormat.format(new Date(common.Common.setTime(vEmpLoginInfo[0].Entda))));
			oController._TargetJSonModel.setProperty("/Data/Famdt", common.Common.checkNull(vEmpLoginInfo[0].Famdt) ? null : dateFormat.format(new Date(common.Common.setTime(vEmpLoginInfo[0].Famdt))));
			oController._TargetJSonModel.setProperty("/Data/Regno", vEmpLoginInfo[0].Regno);
			oController._TargetJSonModel.setProperty("/Data/Address", vEmpLoginInfo[0].Address);
			oController._TargetJSonModel.setProperty("/Data/Persa", vEmpLoginInfo[0].Persa);
			oController._TargetJSonModel.setProperty("/Data/Email", vEmpLoginInfo[0].Email);
		}
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1) {			
			
			var JSonData = { Data : { Evyer : curYear - 1, Evtgr : "Q210", Adjgp : "", Adjst : ""} };
			oController._ListCondJSonModel.setData(JSonData);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
		
		// Combo build
		oController.buildCombo(oController);
		
		oController.checkAdjustPernr(oController);
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
//		this.onPressSearch();
	},
	
	onBack : function(oEvent){
	},
	
	buildCombo : function(oController) {
		// 조정권자 평가그룹
		oController.onSetApgrp(oController);
		
		// 조정점수
		oController.onSetFpadj(oController);
	},
	
	checkAdjustPernr : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_ADJ_SRV"),
			vEvyer = oController._ListCondJSonModel.getProperty("/Data/Evyer"),
			vAppnr = oController._TargetJSonModel.getProperty("/Data/Pernr");
		
		if(!vEvyer || !vAppnr) return;
		
		oModel.read("/CheckAdjprSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Evyer', sap.ui.model.FilterOperator.EQ, vEvyer),
				new sap.ui.model.Filter('Appnr', sap.ui.model.FilterOperator.EQ, vAppnr)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					if(!data.results[0].Adjok) {
						sap.m.MessageBox.alert(oBundleText.getText("LABEL_0836"));	// 836:해당 평가년도의 조정권자가 아닙니다.
					}
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
	
	onSetApgrp : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_ADJ_SRV"),
			oApgrp = sap.ui.getCore().byId(oController.PAGEID + "_Adjgp"),
			vEvyer = oController._ListCondJSonModel.getProperty("/Data/Evyer"),
			vAppnr = oController._TargetJSonModel.getProperty("/Data/Encid");
		
		if(oApgrp.getItems()) oApgrp.destroyItems();
		
		if(!vEvyer || !vAppnr) return;
		
		oModel.read("/ApprApgrpSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Evyer', sap.ui.model.FilterOperator.EQ, vEvyer),
				new sap.ui.model.Filter('Appencid', sap.ui.model.FilterOperator.EQ, vAppnr)
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
	
	onSetFpadj : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_ADJ_SRV"),
			vEvyer = oController._ListCondJSonModel.getProperty("/Data/Evyer"),
			vEvtgr = oController._ListCondJSonModel.getProperty("/Data/Evtgr"),
			items = [];
		
		oController._ListJSonModel.setProperty("/Fpadjs", []);
		
		if(!vEvyer || !vEvtgr) return;
		
		oModel.read("/ApprFpadjSet", {
			async: false,
			filters: [
				new sap.ui.model.Filter('Evyer', sap.ui.model.FilterOperator.EQ, vEvyer),
				new sap.ui.model.Filter('Evtgr', sap.ui.model.FilterOperator.EQ, vEvtgr)
			],
			success: function(data,res){
				if(data && data.results.length) {
					for(var i=0; i<data.results.length; i++) {
						items.push({
							Fpadj : data.results[i].Fpadj,
							Fpadjtx : data.results[i].Fpadjtx
						});
					}
				}
			},
			error: function(res){console.log(res);}
		});
		
		oController._ListJSonModel.setProperty("/Fpadjs", items);
	},
	
	onChangeEvyer : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluationAdjust.ZUI5_HR_ProductionEvaluationAdjustList"),
			oController = oView.getController();
		
		// 조정점수 combo
		oController.buildCombo(oController);
		
		oController.checkAdjustPernr(oController);
	},

	onChangeEvtgr : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluationAdjust.ZUI5_HR_ProductionEvaluationAdjustList"),
		oController = oView.getController();
		
		// 조정점수
		oController.onSetFpadj(oController);
	},
	
	onChangeFpadj : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluationAdjust.ZUI5_HR_ProductionEvaluationAdjustList"),
			oController = oView.getController(),
			_selPath = oEvent.getSource().getBindingContext().sPath,
			vFpadj = oEvent.getSource().getSelectedKey(),
			vTotpo = oController._ListJSonModel.getProperty(_selPath + "/Totpo");
		
		oController._ListJSonModel.setProperty(_selPath + "/Adjyn", (vFpadj == "0.00") ? false : true);
		oController._ListJSonModel.setProperty(_selPath + "/Adjcn", false);
		oController._ListJSonModel.setProperty(_selPath + "/Finpo", String(Number(vTotpo) + Number(vFpadj)));
	},
	
	onChageAdjcn : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluationAdjust.ZUI5_HR_ProductionEvaluationAdjustList"),
			oController = oView.getController(),
			_selPath = oEvent.getSource().getBindingContext().sPath,
			vTotpo = oController._ListJSonModel.getProperty(_selPath + "/Totpo");
		
		oController._ListJSonModel.setProperty(_selPath + "/Fpadj", undefined);
		oController._ListJSonModel.setProperty(_selPath + "/Adjyn", false);
		oController._ListJSonModel.setProperty(_selPath + "/Finpo", vTotpo);
	},

	// 리스트 조회
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluationAdjust.ZUI5_HR_ProductionEvaluationAdjustList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_ADJ_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			vAppnr = oController._TargetJSonModel.getProperty("/Data/Encid"),
			oBtnSave = sap.ui.getCore().byId(oController.PAGEID + "_btnSave"),
			oBtnConfirm = sap.ui.getCore().byId(oController.PAGEID + "_btnConfirm"),
			oBtnComment = sap.ui.getCore().byId(oController.PAGEID + "_btnComment"),
			isButtonVisible = false;

		// 테이블 sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++) {
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var aFilters = [],
			SerchCond = oController._ListCondJSonModel.getProperty("/Data");
		
		if(!SerchCond.Adjgp || SerchCond.Adjgp == "") {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2943"));	// 2493:조정권자 평가그룹을 선택하세요.
			return;
		}
		
		aFilters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth));
		aFilters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'L'));
		if(SerchCond.Evyer != "") {
			aFilters.push(new sap.ui.model.Filter('Evyer', sap.ui.model.FilterOperator.EQ, SerchCond.Evyer));
		}
		if(vAppnr != "") {
			aFilters.push(new sap.ui.model.Filter('Adjencid', sap.ui.model.FilterOperator.EQ, vAppnr));
		}
		if(SerchCond.Adjgp != "") {
			aFilters.push(new sap.ui.model.Filter('Adjgp', sap.ui.model.FilterOperator.EQ, SerchCond.Adjgp));
		}
		if(SerchCond.Evtgr != "") {
			aFilters.push(new sap.ui.model.Filter('Evtgr', sap.ui.model.FilterOperator.EQ, SerchCond.Evtgr));
		}
		if(SerchCond.Adjst != "") {
			aFilters.push(new sap.ui.model.Filter('Adjst', sap.ui.model.FilterOperator.EQ, SerchCond.Adjst));
		}
		
		function Search() {
			var Datas = oController._ListJSonModel.getData();
			
			Datas.Data = [];
			
			oModel.read("/ApprApplSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0; i<data.results.length; i++) {
							var OneData = data.results[i];
							OneData.Idx = i + 1;
							
							OneData.Adpo01 = (!OneData.Adpo01 || OneData.Adpo01 == "0.00") ? "0" : OneData.Adpo01;
							OneData.Adpo02 = (!OneData.Adpo02 || OneData.Adpo02 == "0.00") ? "0" : OneData.Adpo02;
							OneData.Totpo = (!OneData.Totpo || OneData.Totpo == "0.00") ? "0" : OneData.Totpo;
							OneData.Stdsd = (!OneData.Stdsd || OneData.Stdsd == "0.00") ? "0" : OneData.Stdsd;
							OneData.Finpo = (!OneData.Finpo || OneData.Finpo == "0.00") ? "0" : OneData.Finpo;
							
							if(OneData.Adjst != "2") {
								isButtonVisible = true;
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
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
				oTotalCount = sap.ui.getCore().byId(oController.PAGEID + "_TotalCount"),
				vTotalCount = Datas.Data.length;
			
			oTable.setVisibleRowCount(vTotalCount > 15 ? 15 : vTotalCount);
			oTotalCount.setText(": " + vTotalCount);
			
			oBtnSave.setVisible(isButtonVisible);
			oBtnConfirm.setVisible(isButtonVisible);
			oBtnComment.setVisible(vTotalCount > 0 ? !isButtonVisible : false);
			
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
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluationAdjust.ZUI5_HR_ProductionEvaluationAdjustList"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluationAdjust.ZUI5_HR_ProductionEvaluationAdjustList"),
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
			var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_ADJ_SRV");
			
			oModel.create("/ApprApplSet", vOData, {
				success: function(data,res) {
					if(data) {
						
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
			
			if(vPrcty == "C") {
				oController.openEvaluationDialog(); 
			} else {
				sap.m.MessageBox.show(vCompTxt, {
					title : oBundleText.getText("LABEL_0052"),	// 52:안내
					onClose : oController.onBack
				});
			}

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
	
	onValidationData : function(oController, vPrcty) {
		var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_ADJ_SRV"),
			rData = {},
			vData = {},
			vListData = oController._ListJSonModel.getData(),
			vTotalTargetCount = vListData.Data.length,
			vLower5PcntCount = 0;
		
		vData.Gubun = "A";
		vData.Adjpr = oController._TargetJSonModel.getProperty("/Data/Pernr");
		vData.Adjencid = oController._TargetJSonModel.getProperty("/Data/Encid");
		vData.Evyer = String(oController._ListCondJSonModel.getProperty("/Data/Evyer"));
		vData.Evtgr = oController._ListCondJSonModel.getProperty("/Data/Evtgr");
		
		if(!vData.Adjencid) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0839"));	// 839:조정권자 사원번호가 입력되지 않았습니다.
			return "";
		}
		if(!vData.Evyer) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0840"));	// 840:평가년도가 선택되지 않았습니다.
			return "";
		}
		if(!vData.Evtgr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0841"));	// 841:평가직급이 선택되지 않았습니다.
			return "";
		}
		if(!vListData.Data || !vListData.Data.length) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0842"));	// 842:조정 대상이 없습니다.
			return "";
		}
		
		// 조정점수 상하향 점수 validation
		var isFpadjMatched = true,
			vFpadj = 0,
			aPositive = [],	// 양수 배열
			aNegative = [];	// 음수 배열
		vListData.Data.forEach(function(elem) {
			vFpadj = Number(elem.Fpadj);
			
			if(vFpadj > 0) {
				aPositive.push(vFpadj);
			} else if(vFpadj < 0) {
				aNegative.push(vFpadj * -1);
			}
		});
		
		// 각 배열 정렬
		aPositive.sort(function(a, b) { return a - b; });
		aNegative.sort(function(a, b) { return a - b; });
		
		if(aPositive.length != aNegative.length) {
			isFpadjMatched = false;
		} else {
			aPositive.forEach(function(element, index, array) {
				if(element != aNegative[index]) isFpadjMatched = false;
			});
		}
		
		if(!isFpadjMatched) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0843"));	// 843:인원 및 점수의 상/하향 수는 동일해야 합니다.
			return "";
		}
		
		try {
			rData = common.Common.copyByMetadata(oModel, "ApprAppl", vData);
			
			// 리스트 점수 정렬
			rData.DetailNav = JSON.parse(JSON.stringify(vListData.Data));
			rData.DetailNav.sort(function(a, b) {
				return Number(a.Finpo) - Number(b.Finpo);
			});
			
			// 하위 5% 인원수
			var vTotalTargetCount = vListData.Data.length,
				vLower5PcntCount = 0;
			
			vListData.Data.forEach(function(elem) {
				if(elem.Comexcpyn) vTotalTargetCount--; 
			});
			vLower5PcntCount = Math.round(vTotalTargetCount * 0.05);
			
			// 하위 5% 의견여부 체크
			rData.DetailNav.forEach(function(element, index, array) {
				delete element.Idx;
				
				if(index < vLower5PcntCount) {
					element.Comyn = true;
				} else {
					element.Comyn = false;
				}
			});
			
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	},
	
	onSelectEvalRow : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluationAdjust.ZUI5_HR_ProductionEvaluationAdjustList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_EvaluationTable"),
			vContext = oEvent.getParameters().rowBindingContext,
			oModel = oTable.getModel(),
			oBtnSave = sap.ui.getCore().byId(oController.PAGEID + "_btnCommentSave"),
			oBtnConfirm = sap.ui.getCore().byId(oController.PAGEID + "_btnCommentConfirm"),
			sData = {};
		
		if(common.Common.isNull(vContext) || oModel.getProperty(vContext.sPath) == null) {
			return;
		}
		
		oController._selectedTargetPath = vContext.sPath;
		sData = oModel.getProperty(vContext.sPath);
		
		if(sData.Comsta == "2") {
			oBtnSave.setVisible(false);
			oBtnConfirm.setVisible(false);
		} else {
			oBtnSave.setVisible(true);
			oBtnConfirm.setVisible(true);
		}
		
		oController._EvalDetailJSonModel.setData({Data : sData});
	},
	
	setEvalList : function(oController) {
		var vListData = oController._ListJSonModel.getData(),
			vTotalTargetCount = 0,
			vLower5PcntCount = 0,
			cListData = [],
			vEvalList = {Data : []},
			vIdx = 1;
		
		if(!vListData.Data || !vListData.Data.length) return;
		
		vListData.Data.forEach(function(elem) {
			if(!elem.Comexcpyn) vTotalTargetCount++; 
		});
		vLower5PcntCount = Math.round(vTotalTargetCount * 0.05);
		
		// 리스트 복사
		cListData = JSON.parse(JSON.stringify(vListData.Data));
		
		// 점수 정렬
		cListData.sort(function(a, b) {
			return Number(a.Finpo) - Number(b.Finpo);
		});
		
		// 하위 5% 목록 추출
		cListData.forEach(function(element, index, array) {
			if(index < vLower5PcntCount) {
				element.Idx = vIdx++;
				
				vEvalList.Data.push(element);
			}
		});
		
		oController._EvalListJSonModel.setData(vEvalList);
		oController._EvalDetailJSonModel.setData({Data : {}});
	},
	
	openEvaluationDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluationAdjust.ZUI5_HR_ProductionEvaluationAdjustList"),
			oController = oView.getController();
		
		oController._IsManager = "";
		
		if(!oController._EvaluationDialog) {
			oController._EvaluationDialog = sap.ui.jsfragment("ZUI5_HR_ProductionEvaluationAdjust.fragment.EvaluationDialog", oController);
			oView.addDependent(oController._EvaluationDialog);
		}
		
		oController._EvaluationDialog.open();
	},
	
	onBeforeOpenEvaluationDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluationAdjust.ZUI5_HR_ProductionEvaluationAdjustList"),
			oController = oView.getController();
		
		// 하위 5% 목록
		oController.setEvalList(oController);
	},
	
	onAfterOpenEvaluationDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluationAdjust.ZUI5_HR_ProductionEvaluationAdjustList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_EvaluationTable");
		
		oTable.setVisibleRowCount(5);
	},
	
	onPressCommentSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluationAdjust.ZUI5_HR_ProductionEvaluationAdjustList"),
			oController = oView.getController();
		
		oController.onCommentSave(oController , "T");
	},
	
	onPressCommentSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluationAdjust.ZUI5_HR_ProductionEvaluationAdjustList"),
			oController = oView.getController();
		
		oController.onCommentSave(oController , "C");
	},
	
	// 의견 저장 Process
	onCommentSave : function(oController , vPrcty) { // 처리 구분
		var vZappStatAl	= "", 
			errData = {},
			vOData = oController._EvalDetailJSonModel.getProperty("/Data");
		
		if(!vOData) return;
		
		if(!vOData.Pernr) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0844"));	// 844:평가 대상이 선택되지 않았습니다.
			return "";
		}
		
		if(vPrcty == "C") {
			if(!vOData.Apcom) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0845"));	// 845:평가 결과에 대한 의견이 입력되지 않았습니다.
				return "";
			}
			if(!vOData.Apadd) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0846"));	// 846:향후 보완 할 점이 입력되지 않았습니다.
				return "";
			}
		}
		
		delete vOData.Idx;
		
		vOData.Actty = _gAuth;
		vOData.Prcty = vPrcty;
		vOData.Gubun = "O";
		vOData.Comyn = true;
		
		var onProcess = function() {
			var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_ADJ_SRV");
			
			oModel.create("/ApprApplSet", vOData, {
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
							vComstatx = oBundleText.getText("LABEL_0177");	// 0177:완료
						}
						
						oController._EvalDetailJSonModel.setProperty("/Data/Comsta", vComsta);
						oController._EvalListJSonModel.setProperty(oController._selectedTargetPath + "/Comsta", vComsta);
						oController._EvalListJSonModel.setProperty(oController._selectedTargetPath + "/Comstatx", vComstatx);
						oController._EvalListJSonModel.refresh();
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluationAdjust.ZUI5_HR_ProductionEvaluationAdjustList");
		var oController = oView.getController();
	},
	
	onAfterSelectPernr : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluationAdjust.ZUI5_HR_ProductionEvaluationAdjustList"),
			oController = oView.getController();
		
		// 검색 초기화
		oController._ListJSonModel.setData({Data : []});
		
		// 조정권자 평가그룹
		oController.onSetApgrp(oController);
		
		oController.checkAdjustPernr(oController);
	},
	
	onExport : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluationAdjust.ZUI5_HR_ProductionEvaluationAdjustList");
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
				fileName: oBundleText.getText("LABEL_0835") + "-" + dateFormat.format(curDate) + ".xlsx"	// 835:생산직 평가조정
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	}
});