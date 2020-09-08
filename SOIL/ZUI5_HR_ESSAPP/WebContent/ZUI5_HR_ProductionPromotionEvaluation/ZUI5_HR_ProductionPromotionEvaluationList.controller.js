jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList
	 */

	PAGEID : "ZUI5_HR_ProductionPromotionEvaluationList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_StastListJSonModel : new sap.ui.model.json.JSONModel(),
	_SjktlListJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_Columns : "",
	_vPersa : "" ,
	_vClsdt : "",
	_vZpayym : "",
	_vAppno : "",
	_vReadonly : false,
	
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
			prevYear = String(curDate.getFullYear() + 1),	// Todo - 테스트용 2020 셋팅
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy.MM.dd"}),
			mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo"),
			vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet"),
			oController = this,
			detailData = {Data : {}};
		
		// _DetailJSonModel 초기화
		detailData.Data.Auth = _gAuth;
		detailData.Data.ZappStatAl = "";
		oController._DetailJSonModel.setData(detailData);
		
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
			var JSonData = { Data : { SjyerC : prevYear, SjktlC : "", ApgrpC : "", SjstaC : "", Sjlev : ""} };
			oController._ListCondJSonModel.setData(JSonData);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
		
		// 승진진행차수
		oController.retrieveSjlev(oController);

		// build combo
		oController.buildCombo(oController);
		
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
		
		// list 초기화
		var oTableA = sap.ui.getCore().byId(this.PAGEID + "_TableA"),
			oTableB = sap.ui.getCore().byId(this.PAGEID + "_TableB"),
			oTableC = sap.ui.getCore().byId(this.PAGEID + "_TableC");
		
		this._ListJSonModel.setData({Data : []});
		oTableA.setVisibleRowCount(1);
		oTableB.setVisibleRowCount(1);
		oTableC.setVisibleRowCount(1);
		
		this.onPressSearch();
		
		var oTargetToolbar = sap.ui.getCore().byId(this.PAGEID + "_TargetToolbar");
		oTargetToolbar.addEventDelegate({
			onAfterRendering: function() {
				$('#ZUI5_HR_ProductionPromotionEvaluationList_TargetToolbar > span').text(oBundleText.getText("LABEL_0784"));	// 784:평가자
			}
		});
	},
	
	onBack : function(oEvent){
	},
	
	buildCombo : function(oController) {
		// 승진직급
		oController.onSetSjktlC(oController);
		
		// 조직명
		oController.onSetApgrpC(oController);
		
		// 승진등급
		oController.onSetSjgrd(oController);
		
		// 제외구분
		oController.onSetExcgb(oController);
		
		// 임원추천
		oController.onSetRcind(oController);
	},
	
	retrieveSjlev : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_TECH_PROMOTION_SRV"),
			vSjyer = oController._ListCondJSonModel.getProperty("/Data/SjyerC"),
			vPernr = oController._TargetJSonModel.getProperty("/Data/Pernr");
		
		if(!vSjyer || !vPernr) return;
		
		oModel.read("/SjlevListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Sjyer', sap.ui.model.FilterOperator.EQ, vSjyer),
				new sap.ui.model.Filter('Appnr', sap.ui.model.FilterOperator.EQ, vPernr)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					var rData = data.results[0];
					
					oController._ListCondJSonModel.setProperty("/Data/Sjlev", rData.Sjlev);
					oController._ListCondJSonModel.setProperty("/Data/Inputok", rData.Inputok);
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
	
	onSetSjktlC : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_TECH_PROMOTION_SRV"),
			vSjyer = oController._ListCondJSonModel.getProperty("/Data/SjyerC"),
			oSjktlC = sap.ui.getCore().byId(oController.PAGEID + "_SjktlC");
		
		if(oSjktlC.getItems()) oSjktlC.destroyItems();
		if(!vSjyer) return;
		
		oModel.read("/SjktlListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Sjyer', sap.ui.model.FilterOperator.EQ, vSjyer)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					data.results.forEach(function(elem) {
						oSjktlC.addItem(new sap.ui.core.Item({
							key : elem.Sjktl,
							text : elem.Sjktltx
						}));
					});
					
					oController._SjktlListJSonModel.setProperty("/Data", data.results);
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
	
	onSetApgrpC : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_TECH_PROMOTION_SRV"),
			oApgrpC = sap.ui.getCore().byId(oController.PAGEID + "_ApgrpC"),
			vSjyer = oController._ListCondJSonModel.getProperty("/Data/SjyerC"),
			vSjlev = oController._ListCondJSonModel.getProperty("/Data/Sjlev"),
			vAppnr = oController._TargetJSonModel.getProperty("/Data/Encid"),
			aFilters = [];
		
		if(oApgrpC.getItems()) oApgrpC.destroyItems();
		
		if(!vSjyer || !vAppnr) return;
		
		aFilters.push(new sap.ui.model.Filter('Sjyer', sap.ui.model.FilterOperator.EQ, vSjyer));
		aFilters.push(new sap.ui.model.Filter('Appencid', sap.ui.model.FilterOperator.EQ, vAppnr));
		if(vSjlev && vSjlev != "") aFilters.push(new sap.ui.model.Filter('Sjlev', sap.ui.model.FilterOperator.EQ, vSjlev));
		
		oModel.read("/ApgrpListSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data && data.results.length) {
					data.results.forEach(function(elem) {
						oApgrpC.addItem(new sap.ui.core.Item({
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
	
	onSetSjgrd : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_TECH_PROMOTION_SRV");
		
		oModel.read("/SjgrdListSet", {
			async : false,
			success : function(data, res) {
				if(data && data.results.length) {
					oController._ListJSonModel.setProperty("/Sjgrds", data.results);
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
	
	onSetExcgb : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_TECH_PROMOTION_SRV");
		
		oModel.read("/ExcgbListSet", {
			async : false,
			success : function(data, res) {
				if(data && data.results.length) {
					oController._ListJSonModel.setProperty("/Excgbs", data.results);
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
	
	onSetRcind : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_TECH_PROMOTION_SRV");
		
		oModel.read("/RcindListSet", {
			async : false,
			success : function(data, res) {
				if(data && data.results.length) {
					oController._ListJSonModel.setProperty("/Rcinds", data.results);
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
	
	onChangeSjyerC : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
			oController = oView.getController();
		
		oController.BusyDialog.open();
		
		oController.retrieveSjlev(oController);

		oController.buildCombo(oController);
		
		oController.BusyDialog.close();
	},
	
	onChangeSjktlC : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
			oController = oView.getController(),
			vSjktlC = oEvent.getSource().getSelectedKey();
		
		oController._SjktlListJSonModel.getProperty("/Data").forEach(function(elem) {
			if(elem.Sjktl == vSjktlC) {
				oController._ListCondJSonModel.setProperty("/Data/Sjkgb", elem.Sjkgb);
			}
		});
	},
	
	onChangeSjgrd : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
			oController = oView.getController(),
			_selPath = oEvent.getSource().getBindingContext().sPath,
			vSjnsc = oController._ListJSonModel.getProperty(_selPath + "/Sjnsc") || "0",
			vSjgrd = oEvent.getSource().getSelectedKey(),
			vSjgrdList = oController._ListJSonModel.getProperty("/Sjgrds"),
			rowObject = null;
		
		// A등급 제한
		if(vSjgrd == "A") {
			var vTableData = oController._ListJSonModel.getProperty("/Data"),
				vPossibleCount = oController._DetailJSonModel.getProperty("/Data/Srat1Cnt"),
				vGradeACount = 0;
			
			vTableData.forEach(function(elem) {
				if(elem.Sjgrd == "A") vGradeACount++;
			});
			
			if(vGradeACount > Number(vPossibleCount)) {
				var vARateTxt = oController._DetailJSonModel.getProperty("/Data/Srat1tx");
				
				sap.m.MessageBox.show(oBundleText.getText("LABEL_0936") + " " + vARateTxt + oBundleText.getText("LABEL_0970"), {});	// 936:상위, 970:인원에 대해서만 A 등급을 부여할 수 있습니다.
				oController._ListJSonModel.setProperty(_selPath + "/Sjgrd", "B");
				
				return;
			}
		}
		
		vSjgrdList.forEach(function(elem) {
			if(elem.Sjgrd == vSjgrd) rowObject = elem;
		});
		
		if(rowObject.Excgb && rowObject.Excgb != "") {
			oController._ListJSonModel.setProperty(_selPath + "/Excgb", rowObject.Excgb);
			oController._ListJSonModel.setProperty(_selPath + "/Adjsc", "0");
			oController._ListJSonModel.setProperty(_selPath + "/Sjabl", false);
		} else {
			var vAdjsc = Number(vSjnsc) + Number(rowObject.Grdsc);
			
			oController._ListJSonModel.setProperty(_selPath + "/Excgb", undefined);
			oController._ListJSonModel.setProperty(_selPath + "/Adjsc", String(vAdjsc));
		}
		
		oController.countInputStatus(oController);
	},
	
	onChagePri50 : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
			oController = oView.getController(),
			_selPath = oEvent.getSource().getBindingContext().sPath,
			rowObject = oController._ListJSonModel.getProperty(_selPath),
			vTableData = oController._ListJSonModel.getProperty("/Data"),
			vInputVal = oEvent.getSource().getValue(),
			isDup = false,
			vDupIdx = "";
		
		if(rowObject.Sjgrd == "C") {
			oEvent.getSource().setValue(undefined);
			sap.m.MessageBox.show(oBundleText.getText("LABEL_0971"), {});	// 971:C 등급은 순위를 입력할 수 없습니다.
			
			return;
		}
		
		vTableData.forEach(function(elem) {
			if(rowObject.Idx != elem.Idx && elem.Pri50 == vInputVal) {
				vDupIdx = elem.Idx;
				isDup = true;
			}
		});
		
		if(isDup) {
			oEvent.getSource().setValue(undefined);
			sap.m.MessageBox.show(oBundleText.getText("LABEL_0972") + " [Line : " + vDupIdx + "]", {});	// 972:동일한 순위가 이미 입력된 상태입니다.
			
			return;
		}
		
		if(vTableData.length < Number(vInputVal)) {
			oEvent.getSource().setValue(undefined);
			sap.m.MessageBox.show(oBundleText.getText("LABEL_0973") + " [Name : " + rowObject.Ename + "]", {});	// 973:최대 허용 순위를 초과하였습니다.
			
			return;
		}
	},
	
	onChagePri30 : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
			oController = oView.getController(),
			_selPath = oEvent.getSource().getBindingContext().sPath,
			rowObject = oController._ListJSonModel.getProperty(_selPath),
			vTableData = oController._ListJSonModel.getProperty("/Data"),
			vInputVal = oEvent.getSource().getValue(),
			isDup = false,
			vDupIdx = "";
		
		if(rowObject.Rcind == "2") {
			oEvent.getSource().setValue(undefined);
			sap.m.MessageBox.show(oBundleText.getText("LABEL_0974"), {});	// 974:비추천 인원은 순위를 입력할 수 없습니다.
			
			return;
		}
		
		vTableData.forEach(function(elem) {
			if(rowObject.Idx != elem.Idx && elem.Pri30 == vInputVal) {
				vDupIdx = elem.Idx;
				isDup = true;
			}
		});
		
		if(isDup) {
			oEvent.getSource().setValue(undefined);
			sap.m.MessageBox.show(oBundleText.getText("LABEL_0972") + " [Line : " + vDupIdx + "]", {});	// 972:동일한 순위가 이미 입력된 상태입니다.
			
			return;
		}
		
		if(vTableData.length < Number(vInputVal)) {
			oEvent.getSource().setValue(undefined);
			sap.m.MessageBox.show(oBundleText.getText("LABEL_0973") + " [Name : " + rowObject.Ename + "]", {});	// 973:최대 허용 순위를 초과하였습니다.
			
			return;
		}
	},
	
	onChangeRcind : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
			oController = oView.getController(),
			_this = oEvent.getSource(),
			_selPath = _this.getBindingContext().sPath,
			vRcind = _this.getSelectedKey();
		
		if(vRcind == "2") {	// 비추천
			oController._ListJSonModel.setProperty(_selPath + "/Pri50", undefined);
		} else {	// 추천
			// 상위 30%인원체크 or 총 3명 이하일 경우 1명 제한
			var vTableData = oController._ListJSonModel.getProperty("/Data"),
				vRecommendCount = 0,
				vPossibleCount = oController._DetailJSonModel.getProperty("/Data/Srat4Cnt");
				
			vTableData.forEach(function(elem) {
				if(elem.Rcind == "1") vRecommendCount++;
			});
			
			if(vRecommendCount > Number(vPossibleCount)) {
				var vARateTxt = oController._DetailJSonModel.getProperty("/Data/Srat4tx");
				
				sap.m.MessageBox.show(oBundleText.getText("LABEL_0936") + " " + vARateTxt + oBundleText.getText("LABEL_0975"), {});	// 936:상위, 975:인원에 대해서만 “추천”할 수 있습니다.
				oController._ListJSonModel.setProperty(_selPath + "/Rcind", "2");
			}
		}
		
		oController.countInputStatus(oController);
	},
	
	togglePanel : function(oController) {
		var vSjkgb = oController._ListCondJSonModel.getProperty("/Data/Sjkgb"),
			vSjlev = oController._ListCondJSonModel.getProperty("/Data/Sjlev");
		
		if(vSjkgb == "A") {
			if(vSjlev == "2") {
				$('#ZUI5_HR_ProductionPromotionEvaluationList_IAreaB_last').hide();
				
				sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_IAreaA").setVisible(false);
				sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_TAreaA").setVisible(false);
				sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_IAreaB").setVisible(true);
				sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_TAreaB").setVisible(false);
				sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_TAreaC").setVisible(true);
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_ProductionPromotionEvaluationList_TableC-header-fixed-fixrow > tbody',
					colIndexes : [0, 1, 2, 3, 4]
				});
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_ProductionPromotionEvaluationList_TableC-header > tbody',
					colIndexes : [0, 1, 2, 3, 4, 5, 11, 15, 16, 17, 18, 19]
				});
			} else {
				$('#ZUI5_HR_ProductionPromotionEvaluationList_IAreaB_last').show();
				
				sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_IAreaA").setVisible(false);
				sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_TAreaA").setVisible(false);
				sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_IAreaB").setVisible(true);
				sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_TAreaB").setVisible(true);
				sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_TAreaC").setVisible(false);
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_ProductionPromotionEvaluationList_TableB-header-fixed-fixrow > tbody',
					colIndexes : [0, 1, 2, 3, 4]
				});
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_ProductionPromotionEvaluationList_TableB-header > tbody',
					colIndexes : [0, 1, 2, 3, 4, 5, 11, 15, 16, 17, 18, 19]
				});
			}
		} else {
			sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_IAreaA").setVisible(true);
			sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_TAreaA").setVisible(true);
			sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_IAreaB").setVisible(false);
			sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_TAreaB").setVisible(false);
			sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_TAreaC").setVisible(false);
			
			common.Common.generateRowspan({
				selector : '#ZUI5_HR_ProductionPromotionEvaluationList_TableA-header-fixed-fixrow > tbody',
				colIndexes : [0, 1, 2, 3, 4]
			});
			
			common.Common.generateRowspan({
				selector : '#ZUI5_HR_ProductionPromotionEvaluationList_TableA-header > tbody',
				colIndexes : [0, 1, 2, 3, 4, 5, 11, 15, 16, 17, 18, 19, 20, 21, 21]
			});
		}
	},

	// 리스트 조회
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_TECH_PROMOTION_SRV"),
			oTable = null,
			vSjkgb = oController._ListCondJSonModel.getProperty("/Data/Sjkgb"),
			vSjlev = oController._ListCondJSonModel.getProperty("/Data/Sjlev"),
			vAppnr = oController._TargetJSonModel.getProperty("/Data/Encid"),
			vTotalCount = 0,
			aFilters = [],
			SerchCond = oController._ListCondJSonModel.getProperty("/Data");
		
		oController._ListCondJSonModel.setProperty("/Data/isReadOnly", true);
		oController._ListCondJSonModel.setProperty("/Data/totalListCount", 0);
		oController._DetailJSonModel.setProperty("/Data", {Auth : _gAuth, ZappStatAl : ""});
		oController._DetailJSonModel.refresh();
		oController._ListJSonModel.setProperty("/Data", []);
		oController._ListJSonModel.refresh();
		oController._StastListJSonModel.setProperty("/Data", []);
		oController._StastListJSonModel.refresh();
		
		if(!vAppnr || !vSjlev || !SerchCond.SjyerC || !SerchCond.ApgrpC || !SerchCond.SjktlC) return;
		
		oController.togglePanel(oController);
		
		oTable = (vSjkgb == "B")
					? sap.ui.getCore().byId(oController.PAGEID + "_TableA")
					: (vSjlev == "1") 
						? sap.ui.getCore().byId(oController.PAGEID + "_TableB")
						: sap.ui.getCore().byId(oController.PAGEID + "_TableC");

		// 테이블 sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++) {
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		aFilters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth));
		aFilters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'L'));
		if(SerchCond.SjyerC != "") {
			aFilters.push(new sap.ui.model.Filter('SjyerC', sap.ui.model.FilterOperator.EQ, SerchCond.SjyerC));
		}
		if(SerchCond.SjktlC != "") {
			aFilters.push(new sap.ui.model.Filter('SjktlC', sap.ui.model.FilterOperator.EQ, SerchCond.SjktlC));
		}
		if(SerchCond.ApgrpC != "") {
			aFilters.push(new sap.ui.model.Filter('ApgrpC', sap.ui.model.FilterOperator.EQ, SerchCond.ApgrpC));
		}
		if(SerchCond.SjstaC != "") {
			aFilters.push(new sap.ui.model.Filter('SjstaC', sap.ui.model.FilterOperator.EQ, SerchCond.SjstaC));
		}
		if(vAppnr && vAppnr != "") {
			aFilters.push(new sap.ui.model.Filter('Appencid', sap.ui.model.FilterOperator.EQ, vAppnr));
		}
		if(vSjlev && vSjlev != "") {
			aFilters.push(new sap.ui.model.Filter('SjlevC', sap.ui.model.FilterOperator.EQ, vSjlev));
		}
		
		function Search() {
			var Datas = {Data : []};
			
			oModel.read("/PromotionApplSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						vTotalCount = data.results.length;
						
						var isReadOnly = true;
						for(var i=0; i<data.results.length; i++) {
							var OneData = data.results[i];
							OneData.Idx = i + 1;
							OneData.Sjlev = vSjlev;
							OneData.Inputok = oController._ListCondJSonModel.getProperty("/Data/Inputok");
							
							OneData.Evp01 = (!OneData.Evp01 || OneData.Evp01 == "0.00") ? undefined : OneData.Evp01;
							OneData.Evp02 = (!OneData.Evp02 || OneData.Evp02 == "0.00") ? undefined : OneData.Evp02;
							OneData.Evp03 = (!OneData.Evp03 || OneData.Evp03 == "0.00") ? undefined : OneData.Evp03;
							OneData.Evp04 = (!OneData.Evp04 || OneData.Evp04 == "0.00") ? undefined : OneData.Evp04;
							OneData.Evpot = (!OneData.Evpot || OneData.Evpot == "0.00") ? undefined : OneData.Evpot;
							OneData.Crrsc = (!OneData.Crrsc || OneData.Crrsc == "0.00") ? undefined : OneData.Crrsc;
							OneData.Skosc = (!OneData.Skosc || OneData.Skosc == "0.00") ? undefined : OneData.Skosc;
							OneData.Przsc = (!OneData.Przsc || OneData.Przsc == "0.00") ? undefined : OneData.Przsc;
							OneData.Brdsc = (!OneData.Brdsc || OneData.Brdsc == "0.00") ? undefined : OneData.Brdsc;
							OneData.Sjnsc = (!OneData.Sjnsc || OneData.Sjnsc == "0.00") ? undefined : OneData.Sjnsc;
							OneData.Adjsc = (!OneData.Adjsc || OneData.Adjsc == "0.00") ? undefined : OneData.Adjsc;
							OneData.Pri50 = (!OneData.Pri50 || OneData.Pri50 == "0") ? undefined : OneData.Pri50;
							OneData.Pri30 = (!OneData.Pri30 || OneData.Pri30 == "0") ? undefined : OneData.Pri30;
							
							if(!OneData.Readonly) isReadOnly = false;
							
							Datas.Data.push(OneData);
						}
						
						oController._ListCondJSonModel.setProperty("/Data/isReadOnly", isReadOnly);
						oController._ListCondJSonModel.setProperty("/Data/totalListCount", vTotalCount);
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
			
			oController._ListJSonModel.setProperty("/Data", Datas.Data);
			oTable.setVisibleRowCount(vTotalCount > 5 ? 5 : vTotalCount);
			
			if(oController.Error == "E") {
				oController.BusyDialog.close();
				oController.Error = "";
				sap.m.MessageBox.show(oController.ErrorMessage, {});
			}
			
			oTable.bindRows({ path: "/Data" });
			
			// 헤더 조회
			if(Datas.Data.length > 0) {
				oController.retriveHeader(oController, vTotalCount);
				
				oController.countInputStatus(oController);
			}
			
			oController.BusyDialog.close();
		}	
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);
	},
	
	retriveHeader : function(oController, vTotalCnt) {
		var oModel = sap.ui.getCore().getModel("ZHR_TECH_PROMOTION_SRV"),
			vSjyer = oController._ListCondJSonModel.getProperty("/Data/SjyerC"),
			vSjktl = oController._ListCondJSonModel.getProperty("/Data/SjktlC"),
			vSjkgb = oController._ListCondJSonModel.getProperty("/Data/Sjkgb"),
			oArateTxt = sap.ui.getCore().byId(oController.PAGEID + "_ArateTxt"),
			oPrateTxt = sap.ui.getCore().byId(oController.PAGEID + "_PrateTxt");
		
		oModel.read("/SjktlHeaderSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Sjyer', sap.ui.model.FilterOperator.EQ, vSjyer),
				new sap.ui.model.Filter('Sjktl', sap.ui.model.FilterOperator.EQ, vSjktl),
				new sap.ui.model.Filter('TotalCnt', sap.ui.model.FilterOperator.EQ, vTotalCnt)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					var rData = data.results[0];
					rData.TotalCnt1 = String(vTotalCnt);
					rData.Auth = _gAuth;
					rData.ZappStatAl = "";
					
					oController._DetailJSonModel.setProperty("/Data", rData);
					
					if(vSjkgb == "B") {
						oArateTxt.setText(oArateTxt.getText().replace(/#/g, rData.Srat1tx));
						oPrateTxt.setText(oPrateTxt.getText().replace(/#/g, rData.Srat2tx));
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
	
	countInputStatus : function(oController) {
		var vTableData = oController._ListJSonModel.getProperty("/Data"),
			vSjkgb = oController._ListCondJSonModel.getProperty("/Data/Sjkgb"),
			vSjlev = oController._ListCondJSonModel.getProperty("/Data/Sjlev"),
			gradeACount = 0,
			gradeBCount = 0,
			gradeCCount = 0,
			notGradeCount = 0,
			recommendCount = 0,
			notRecommendCount = 0,
			totalCount = 0,
			promotionCount = 0;
		
		if(!vTableData.length) {
			oController._DetailJSonModel.setProperty("/Data/ACnt", undefined);
			oController._DetailJSonModel.setProperty("/Data/BCnt", undefined);
			oController._DetailJSonModel.setProperty("/Data/CCnt", undefined);
			oController._DetailJSonModel.setProperty("/Data/NCnt", undefined);
			oController._DetailJSonModel.setProperty("/Data/TotalCnt2", undefined);
			oController._DetailJSonModel.setProperty("/Data/PCnt", undefined);
			oController._DetailJSonModel.setProperty("/Data/RcmCount", undefined);
			oController._DetailJSonModel.setProperty("/Data/NotRcmCount", undefined);
			oController._DetailJSonModel.setProperty("/Data/NotInputCount", undefined);
			oController._DetailJSonModel.setProperty("/Data/TotalCnt1", undefined);
			
			oController._DetailJSonModel.refresh();
			
			return;
		}
		
		if(vSjkgb == "A" && vSjlev == "1") {
			vTableData.forEach(function(elem) {
				if(elem.Rcind == "1") {
					recommendCount++;
				} else if(elem.Rcind == "2") {
					notRecommendCount++;
				}
				
				totalCount++;
			});
			
			oController._DetailJSonModel.setProperty("/Data/RcmCount", recommendCount);
			oController._DetailJSonModel.setProperty("/Data/NotRcmCount", notRecommendCount);
			oController._DetailJSonModel.setProperty("/Data/NotInputCount", totalCount - recommendCount - notRecommendCount);
			oController._DetailJSonModel.setProperty("/Data/TotalCnt1", totalCount);
		} else if(vSjkgb == "B") {
			vTableData.forEach(function(elem) {
				if(elem.Sjgrd == "A") {
					gradeACount++;
				} else if(elem.Sjgrd == "B") {
					gradeBCount++;
				} else if(elem.Sjgrd == "C") {
					gradeCCount++;
				} else {
					notGradeCount++;
				}
				
				if(elem.Sjabl) {
					promotionCount++;
				}
				
				totalCount++;
			});
			
			oController._DetailJSonModel.setProperty("/Data/ACnt", gradeACount);
			oController._DetailJSonModel.setProperty("/Data/BCnt", gradeBCount);
			oController._DetailJSonModel.setProperty("/Data/CCnt", gradeCCount);
			oController._DetailJSonModel.setProperty("/Data/NCnt", notGradeCount);
			oController._DetailJSonModel.setProperty("/Data/TotalCnt2", totalCount);
			oController._DetailJSonModel.setProperty("/Data/PCnt", promotionCount);
		} else {
			return;
		}
		
		oController._DetailJSonModel.refresh();
	},
	
	onCalcSort : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
			oController = oView.getController(),
			vSjkgb = oController._ListCondJSonModel.getProperty("/Data/Sjkgb"),
			vSjlev = oController._ListCondJSonModel.getProperty("/Data/Sjlev"),
			vSjktlC = oController._ListCondJSonModel.getProperty("/Data/SjktlC"),
			vTableData = oController._ListJSonModel.getProperty("/Data");
		
		if(!vTableData.length) return;
		
		if(vSjkgb == "B") { 		// 계장이하
			if(vSjktlC == "F5") {			// 대리
				vTableData.forEach(function(elem) {
					if(Number(elem.Adjsc) >= 75 && Number(elem.Evpot) >= 70) {
						elem.Sjabl = true;
					} else {
						elem.Sjabl = false;
					}
				});
			} else if(vSjktlC == "F6") {	// 주임
				vTableData.forEach(function(elem) {
					if(Number(elem.Adjsc) >= 75) {
						elem.Sjabl = true;
					} else {
						elem.Sjabl = false;
					}
				});
			} else if(vSjktlC == "F4") {	// 계장
				var totalCnt = oController._DetailJSonModel.getProperty("/Data/TotalCnt1"),
					promotionCnt = oController._DetailJSonModel.getProperty("/Data/Srat2Cnt");
				
				vTableData.sort(function(a, b) {
					return Number(b.Adjsc) - Number(a.Adjsc);
				});
				
				vTableData.forEach(function(elem, index, array) {
					if(index < Number(promotionCnt)) {
						elem.Sjabl = true;
					} else {
						elem.Sjabl = false;
					}
				});
			}
			
			vTableData.sort(function(a, b) {
				var keyA1 = Number(a.Sjabl), keyA2 = Number(a.Adjsc);
				var keyB1 = Number(b.Sjabl), keyB2 = Number(b.Adjsc);
				
				if (keyA1 < keyB1) return 1;
				if (keyA1 > keyB1) return -1;
				if (keyA2 < keyB2) return 1;
				if (keyA2 > keyB2) return -1;
				return 0;
			});
			
			vTableData.forEach(function(elem, index, array) {
				elem.Idx = index + 1;
				if(elem.Sjabl) {
					elem.Pri50 = String(index + 1);
				} else {
					elem.Pri50 = undefined;
				}
			});
		} else if(vSjkgb == "A") {	// 과장
			if(vSjlev == "1") {			// 본부장
				vTableData.sort(function(a, b) {
					var keyA1 = Number(a.Pri50), keyA2 = Number(a.Rcind), keyA3 = Number(a.Adjsc);
					var keyB1 = Number(b.Pri50), keyB2 = Number(b.Rcind), keyB3 = Number(b.Adjsc);
					
					if (keyA1 < keyB1) return -1;
					if (keyA1 > keyB1) return 1;
					if (keyA2 < keyB2) return 1;
					if (keyA2 > keyB2) return -1;
					if (keyA3 < keyB3) return 1;
					if (keyA3 > keyB3) return -1;
					return 0;
				});
			} else if(vSjlev == "2") {	// 총괄
				vTableData.forEach(function(elem) {
					if(!elem.Pri30 || Number(elem.Pri30) < 1) {
						elem.OrgSortTemp = elem.OrgSort;
						elem.OrgSort = "999";
					}
				});
				
				vTableData.sort(function(a, b) {
					var keyA1 = Number(a.OrgSort), keyA2 = Number(a.Pri30), keyA3 = Number(a.Pri50), keyA4 = Number(a.Adjsc);
					var keyB1 = Number(b.OrgSort), keyB2 = Number(b.Pri30), keyB3 = Number(b.Pri50), keyB4 = Number(b.Adjsc);
					
					if (keyA1 < keyB1) return -1;
					if (keyA1 > keyB1) return 1;
					if (keyA2 < keyB2) return -1;
					if (keyA2 > keyB2) return 1;
					if (keyA3 < keyB3) return -1;
					if (keyA3 > keyB3) return 1;
					if (keyA4 < keyB4) return 1;
					if (keyA4 > keyB4) return -1;
					return 0;
				});
				
				vTableData.forEach(function(elem) {
					if(elem.OrgSort == "999") {
						elem.OrgSort = elem.OrgSortTemp;
						delete elem.OrgSortTemp;
					}
				});
			}
		}
		
		oController._ListJSonModel.refresh();
		
		oController.countInputStatus(oController);
	},
	
	openOrgehStatisticsDialog : function(oController) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"), 
			vOData = oController.onValidationData(oController, "S"),
			oModel = sap.ui.getCore().getModel("ZHR_TECH_PROMOTION_SRV"),
			errData = {};
		
		if( vOData == "") return ;
		vOData.Prcty = "S";
		vOData.Actty = _gAuth;
		
		oController.BusyDialog.open();
		
		oModel.create("/PromotionApplSet", vOData, {
			success: function(data,res) {
				if(data) {
					if(!oController._OrgehStatisticsDialog) {
						oController._OrgehStatisticsDialog = sap.ui.jsfragment("ZUI5_HR_ProductionPromotionEvaluation.fragment.OrgehStatisticsDialog", oController);
						oView.addDependent(oController._OrgehStatisticsDialog);
					}
					
					oController._OrgehStatisticsDialog.open();
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
	},
	
	closeEvalDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
			oController = oView.getController();
		
		oController._OrgehStatisticsDialog.close();
	},
	
	onAfterOpenStastDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_TECH_PROMOTION_SRV"),
			vCondData = oController._ListCondJSonModel.getProperty("/Data"),
			vPernr = oController._TargetJSonModel.getProperty("/Data/Encid");
		
		oModel.read("/StatisticsListSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('SjyerC', sap.ui.model.FilterOperator.EQ, vCondData.SjyerC),
				new sap.ui.model.Filter('Appencid', sap.ui.model.FilterOperator.EQ, vPernr),
				new sap.ui.model.Filter('SjkgbC', sap.ui.model.FilterOperator.EQ, vCondData.Sjkgb),
				new sap.ui.model.Filter('SjlevC', sap.ui.model.FilterOperator.EQ, vCondData.Sjlev)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					var rDataList = data.results;
					
					rDataList.forEach(function(elem, index, array) {
						elem.Idx = index + 1;
					});
					
					oController._StastListJSonModel.setProperty("/Data", rDataList);
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
	
	_AddPersonDialog : null,
	
	EmpSearchByTx :function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
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
		} else {
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
				
				if(oController.Error == "E") {
					oController.Error = "";
					sap.m.MessageBox.alert(oController.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
					oEvent.getSource().setValue();
					return;
				}	
			} catch(Ex) {
			}
			
			if(vEmpSearchResult.EmpSearchResultSet.length == 1) {
				var vControlId = common.Common.getControlId(oController, oControl.getId());
				if(vControlId.Id && vControlId.Id != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,vEmpSearchResult.EmpSearchResultSet[0].Ename);
				if(vControlId.Key && vControlId.Key != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,vEmpSearchResult.EmpSearchResultSet[0].Encid);
				oController.onPressSearch();
			} else {
				oController._vEnamefg = "X";
				oController.displayEmpSearchDialog();
			}
		}
	},
	
	onAfterSelectPernr : function(oController) {
		// 검색조건 초기화
		// Todo - 테스트용 2020 셋팅
		var JSonData = { Data : { SjyerC : String(new Date().getFullYear() + 1), SjktlC : "", ApgrpC : "", SjstaC : "", Sjlev : ""} };
		oController._ListCondJSonModel.setData(JSonData);
		oController._ListCondJSonModel.refresh();
		
		// 입력현황 초기화
		oController._DetailJSonModel.setProperty("/Data", {Auth : _gAuth, ZappStatAl : ""});
		oController._DetailJSonModel.refresh();
		
		// list 초기화
		var oTableA = sap.ui.getCore().byId(oController.PAGEID + "_TableA"),
			oTableB = sap.ui.getCore().byId(oController.PAGEID + "_TableB"),
			oTableC = sap.ui.getCore().byId(oController.PAGEID + "_TableC");
		oController._ListJSonModel.setData({Data : []});
		oController._ListJSonModel.refresh();
		oTableA.setVisibleRowCount(1);
		oTableB.setVisibleRowCount(1);
		oTableC.setVisibleRowCount(1);
		
		sap.ui.getCore().byId('__text8').setText(oBundleText.getText("LABEL_0784"));	// 784:평가자
		
		oController.retrieveSjlev(oController);

		oController.buildCombo(oController);
	},
	
	displayEmpSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
			oController = oView.getController();
		
		if(oEvent) {
			oController._oControl = oEvent.getSource();
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
		jQuery.sap.require("common.SearchOrg");

		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
			oController = oView.getController();
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Multi";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "MultiInput";
		
		if(!oController._SearchOrgDialog) {
			oController._SearchOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SearchOrgDialog);
		}
		oController._SearchOrgDialog.open();
	},
	
	displayOrgSearchDialog : function(oEvent) {
		jQuery.sap.require("common.SearchOrg");

		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
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
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
			oController = oView.getController();
	
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp"),
			vActionSubjectList_Temp = {ActionSubjectListSet : []};
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
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
			
			var vControlId = common.Common.getControlId(oController, oController._oControl.getId()),
				_selPath = oTable.getContextByIndex(vIDXs[0]).sPath;
			
			if(vControlId.Id && vControlId.Id != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id, mEmpSearchResult.getProperty(_selPath + "/Ename"));
			if(vControlId.Key && vControlId.Key != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,mEmpSearchResult.getProperty(_selPath + "/Encid"));
		
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
			oController = oView.getController(),
			vControlId = common.Common.getControlId(oController, oController._oControl.getId());
		
		if(vControlId.Id && vControlId.Id != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
		if(vControlId.Key && vControlId.Key != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
		oController._AddPersonDialog.close();
	},
	
	SmartSizing : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
			oController = oView.getController();
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	onPressSaveS : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList"),
			oController = oView.getController();
		
		oController.openOrgehStatisticsDialog(oController);
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty){ // 처리 구분
		var vOData = oController.onValidationData(oController, vPrcty);
		
		if( vOData == "") return ;
		vOData.Prcty = vPrcty;
		vOData.Actty = _gAuth;
		
		var onProcess = function() {
			var oModel = sap.ui.getCore().getModel("ZHR_TECH_PROMOTION_SRV"),
				errData = {};
				
			oModel.create("/PromotionApplSet", vOData, {
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
		} else if(vPrcty == "C") {
			vInfoTxt = oBundleText.getText("LABEL_0793");	// 793:평가완료하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0794");	// 794:평가가 완료되었습니다.
		}
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},	
	
	onValidationData : function(oController, vPrcty){
		var oModel = sap.ui.getCore().getModel("ZHR_TECH_PROMOTION_SRV");
			vCondData = {},
			vDetailData = {},
			rData = {};
			
		// 정렬 실행
		if(vPrcty == "C") oController.onCalcSort();
		
		vCondData = oController._ListCondJSonModel.getProperty("/Data");
		vDetailData = oController._ListJSonModel.getProperty("/Data");
		
		try {
			rData.AppnrC = oController._TargetJSonModel.getProperty("/Data/Pernr");
			rData.SjyerC = vCondData.SjyerC;
			rData.SjktlC = vCondData.SjktlC;
			rData.SjlevC = vCondData.Sjlev;
			rData.ApgrpC = vCondData.ApgrpC;
			
			rData.DetailNav = [];
			vDetailData.forEach(function(elem) {
				rData.DetailNav.push(common.Common.copyByMetadata(oModel, "PromotionAppl", elem));
			});
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	}
});