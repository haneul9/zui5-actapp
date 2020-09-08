jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_OfficePromotionEvaluation.ZUI5_HR_OfficePromotionEvaluationList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_OfficePromotionEvaluation.ZUI5_HR_OfficePromotionEvaluationList
	 */

	PAGEID : "ZUI5_HR_OfficePromotionEvaluationList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
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
			prevYear = String(curDate.getFullYear()),
			dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy.MM.dd"}),
			mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo"),
			vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet"),
			oController = this,
			detailData = {Data : {}};
		
		// 대상자 조회
		common.TargetUser.oController = oController;
		common.TargetUser.onSetTarget(oController);
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", "");
		
		// MSS 로그인 평가자 set
		if(_gAuth == "M" && vEmpLoginInfo.length > 0) {
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
			oController._TargetJSonModel.setProperty("/Data/Regno", vEmpLoginInfo[0].Regno);
			oController._TargetJSonModel.setProperty("/Data/Address", vEmpLoginInfo[0].Address);
			oController._TargetJSonModel.setProperty("/Data/Persa", vEmpLoginInfo[0].Persa);
			oController._TargetJSonModel.setProperty("/Data/Email", vEmpLoginInfo[0].Email);
		}
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1) {			
			var JSonData = { Data : { SjyerC : prevYear, SjktlC : "", ApgrpC : "", SjstaC : "", Sjlev : ""} };
			oController._ListCondJSonModel.setData(JSonData);
		}
		
		// 승진진행차수
		oController.retrieveSjlev(oController);

		// build combo
		oController.buildCombo(oController);
		
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
		
		// list 초기화
		var oTable = sap.ui.getCore().byId(this.PAGEID + "_Table");
		
		this._ListJSonModel.setData({Data : []});
		oTable.setVisibleRowCount(1);
		
//		this.onPressSearch();
		this.initTable(this);
		
		var oTargetToolbar = sap.ui.getCore().byId(this.PAGEID + "_TargetToolbar");
		oTargetToolbar.addEventDelegate({
			onAfterRendering: function() {
				$('#ZUI5_HR_OfficePromotionEvaluationList_TargetToolbar > span').text(oBundleText.getText("LABEL_0784"));	// 784:평가자
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
	},
	
	retrieveSjlev : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_OFIC_PROMOTION_SRV"),
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
		var oModel = sap.ui.getCore().getModel("ZHR_OFIC_PROMOTION_SRV"),
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
		var oModel = sap.ui.getCore().getModel("ZHR_OFIC_PROMOTION_SRV"),
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
	
	onSetAvrsc : function(vAvrsc) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OfficePromotionEvaluation.ZUI5_HR_OfficePromotionEvaluationList"),
			oController = oView.getController(),
			points = [];
		
		vAvrsc = Number(vAvrsc);
		
		for(var i = 0; i <= vAvrsc; i++) {
			if(i % 10 == 0) points.push({key : String(i) + ".00", Prisc : String(i)});
		}
		
		oController._ListJSonModel.setProperty("/Priscs", points);
	},
	
	onChangeSjyerC : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OfficePromotionEvaluation.ZUI5_HR_OfficePromotionEvaluationList"),
			oController = oView.getController();
		
		oController.BusyDialog.open();
		
		oController.retrieveSjlev(oController);

		oController.buildCombo(oController);
		
		oController.BusyDialog.close();
	},
	
	onChangePri50 : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OfficePromotionEvaluation.ZUI5_HR_OfficePromotionEvaluationList"),
			oController = oView.getController(),
			_selPath = oEvent.getSource().getBindingContext().sPath,
			rowObject = oController._ListJSonModel.getProperty(_selPath),
			vTableData = oController._ListJSonModel.getProperty("/Data"),
			vInputVal = oEvent.getSource().getSelectedKey(),
			vAvr50 = Number(rowObject.Avr50),
			vTotalPri50 = 0,
			vPri00 = 0;
		
		if(!vInputVal || vInputVal == "") return;
		
		// 추천점수 합 구하기
		vTableData.forEach(function(elem) {
			if(elem.Pri50) vTotalPri50 += Number(elem.Pri50);
		});
		
		// 할당점수 이상일 경우
		if(vTotalPri50 > vAvr50) {
			oEvent.getSource().setValue(undefined);
			oController._ListJSonModel.setProperty(_selPath + "/Pri50", undefined);
			oController._ListJSonModel.setProperty(_selPath + "/Pri00", rowObject.Sjnsc);
			
			sap.m.MessageBox.show(oBundleText.getText("LABEL_2967"), {});	// 2967:추천점수의 합이 할당점수를 초과하였습니다.
			
			return;
		}
		
		vPri00 = Number(rowObject.Sjnsc) + Number(vInputVal);
		oController._ListJSonModel.setProperty(_selPath + "/Pri00", String(vPri00));
	},
	
	onChangePri30 : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OfficePromotionEvaluation.ZUI5_HR_OfficePromotionEvaluationList"),
			oController = oView.getController(),
			_selPath = oEvent.getSource().getBindingContext().sPath,
			rowObject = oController._ListJSonModel.getProperty(_selPath),
			vTableData = oController._ListJSonModel.getProperty("/Data"),
			vInputVal = oEvent.getSource().getSelectedKey(),
			vAvr30 = Number(rowObject.Avr30),
			vTotalPri30 = 0,
			vPri00 = 0;
		
		if(!vInputVal || vInputVal == "") return;
		
		// 추천점수 합 구하기
		vTableData.forEach(function(elem) {
			if(elem.Pri30) vTotalPri30 += Number(elem.Pri30);
		});
		
		// 할당점수 이상일 경우
		if(vTotalPri30 > vAvr30) {
			oEvent.getSource().setValue(undefined);
			oController._ListJSonModel.setProperty(_selPath + "/Pri30", undefined);
			oController._ListJSonModel.setProperty(_selPath + "/Pri00", rowObject.Sjnsc);
			
			sap.m.MessageBox.show(oBundleText.getText("LABEL_2967"), {});	// 2967:추천점수의 합이 할당점수를 초과하였습니다.
			
			return;
		}
		
		vPri00 = Number(rowObject.Sjnsc) + ((Number(vInputVal) + Number(rowObject.Pri50 || "0")) / 2);
		oController._ListJSonModel.setProperty(_selPath + "/Pri00", String(vPri00));
	},
	
	initTable : function(oController) {
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			vSjlev = oController._ListCondJSonModel.getProperty("/Data/Sjlev");
		
		oController._ListCondJSonModel.setProperty("/Data/isReadOnly", true);
		oController._ListCondJSonModel.setProperty("/Data/totalListCount", 0);
		oController._ListJSonModel.setProperty("/Data", []);
		oController._ListJSonModel.refresh();
		
		if(vSjlev == "1") {	// 본부장
			oTable.getColumns()[33].setTemplate(new sap.ui.commons.TextView({
				text : "{Avr50}", 
				textAlign : "Center"
			}).addStyleClass("FontFamily"));
			
			oTable.getColumns()[34].setVisible(false);
			oTable.getColumns()[36].setVisible(false);
		} else {	// 총괄
			oTable.getColumns()[33].setTemplate(new sap.ui.commons.TextView({
				text : "{Avr30}", 
				textAlign : "Center"
			}).addStyleClass("FontFamily"));
			
			oTable.getColumns()[35].setVisible(false);
		}
	},
	
	// 리스트 조회
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OfficePromotionEvaluation.ZUI5_HR_OfficePromotionEvaluationList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_OFIC_PROMOTION_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			vSjlev = oController._ListCondJSonModel.getProperty("/Data/Sjlev"),
			vAppnr = oController._TargetJSonModel.getProperty("/Data/Encid"),
			vTotalCount = 0,
			aFilters = [],
			SerchCond = oController._ListCondJSonModel.getProperty("/Data"),
			vAvrsc = 0;
		
		oController.initTable(oController);
		
		if(!vAppnr || !vSjlev || !SerchCond.SjyerC || !SerchCond.ApgrpC || !SerchCond.SjktlC) {
			if(!SerchCond.SjyerC) sap.m.MessageBox.show(oBundleText.getText("LABEL_2986"), {});	// 2986:승진년도를 선택해주세요.
			if(!SerchCond.SjktlC) sap.m.MessageBox.show(oBundleText.getText("LABEL_2987"), {});	// 2987:승진직급을 선택해주세요.
			if(!SerchCond.ApgrpC) sap.m.MessageBox.show(oBundleText.getText("LABEL_2988"), {});	// 2988:조직명을 선택해주세요.
				
			return;
		}
		
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
							OneData.Evp05 = (!OneData.Evp05 || OneData.Evp05 == "0.00") ? undefined : OneData.Evp05;
							OneData.Evpot = (!OneData.Evpot || OneData.Evpot == "0.00") ? undefined : OneData.Evpot;
							OneData.Trdsc = (!OneData.Trdsc || OneData.Trdsc == "0.00") ? undefined : OneData.Trdsc;
							OneData.Evtsc = (!OneData.Evtsc || OneData.Evtsc == "0.00") ? undefined : OneData.Evtsc;
							OneData.Lansc = (!OneData.Lansc || OneData.Lansc == "0.00") ? undefined : OneData.Lansc;
							OneData.Przsc = (!OneData.Przsc || OneData.Przsc == "0.00") ? undefined : OneData.Przsc;
							OneData.Csrsc = (!OneData.Csrsc || OneData.Csrsc == "0.00") ? undefined : OneData.Csrsc;
							OneData.Mensc = (!OneData.Mensc || OneData.Mensc == "0.00") ? undefined : OneData.Mensc;
							OneData.Licsc = (!OneData.Licsc || OneData.Licsc == "0.00") ? undefined : OneData.Licsc;
							OneData.Jobsc = (!OneData.Jobsc || OneData.Jobsc == "0.00") ? undefined : OneData.Jobsc;
							OneData.Lecsc = (!OneData.Lecsc || OneData.Lecsc == "0.00") ? undefined : OneData.Lecsc;
							OneData.Facsc = (!OneData.Facsc || OneData.Facsc == "0.00") ? undefined : OneData.Facsc;
							OneData.Skosc = (!OneData.Skosc || OneData.Skosc == "0.00") ? undefined : OneData.Skosc;
							OneData.Addsc = (!OneData.Addsc || OneData.Addsc == "0.00") ? undefined : OneData.Addsc;
							OneData.Sjnsc = (!OneData.Sjnsc || OneData.Sjnsc == "0.00") ? undefined : OneData.Sjnsc;
							OneData.Sjsco = (!OneData.Sjsco || OneData.Sjsco == "0.00") ? undefined : OneData.Sjsco;
							OneData.Avr50 = (!OneData.Avr50 || OneData.Avr50 == "0.00") ? undefined : OneData.Avr50;
							OneData.Pri50 = (!OneData.Pri50 || OneData.Pri50 == "0.00") ? undefined : OneData.Pri50;
							OneData.Avr30 = (!OneData.Avr30 || OneData.Avr30 == "0.00") ? undefined : OneData.Avr30;
							OneData.Pri30 = (!OneData.Pri30 || OneData.Pri30 == "0.00") ? undefined : OneData.Pri30;
							OneData.Pri00 = (!OneData.Pri00 || OneData.Pri00 == "0.00") ? undefined : OneData.Pri00;
							
							if(!OneData.Readonly) isReadOnly = false;
							
							if(i == 0) {
								// 할당점수
								vAvrsc = vSjlev == "1" ? OneData.Avr50 : OneData.Avr30;
							}
							
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
			
			if(vAvrsc && vAvrsc > 0) {
				oController.onSetAvrsc(vAvrsc);
			}
			
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
	
	onCalcSort : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OfficePromotionEvaluation.ZUI5_HR_OfficePromotionEvaluationList"),
			oController = oView.getController(),
			vSjlev = oController._ListCondJSonModel.getProperty("/Data/Sjlev"),
			vTableData = oController._ListJSonModel.getProperty("/Data");
		
		if(!vTableData.length) return;
		
		var onProcess = function() {
			if(vSjlev == "1") {			// 본부장
				vTableData.sort(function(a, b) {
					var keyA1 = Number(a.Pri00), keyA2 = Number(a.Sjnsc);
					var keyB1 = Number(b.Pri00), keyB2 = Number(b.Sjnsc);
					
					if (keyA1 < keyB1) return 1;
					if (keyA1 > keyB1) return -1;
					if (keyA2 < keyB2) return 1;
					if (keyA2 > keyB2) return -1;
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
					var keyA1 = Number(a.OrgSort), keyA2 = Number(a.Pri00), keyA3 = Number(a.Sjnsc);
					var keyB1 = Number(b.OrgSort), keyB2 = Number(b.Pri00), keyB3 = Number(b.Sjnsc);
					
					if (keyA1 < keyB1) return -1;
					if (keyA1 > keyB1) return 1;
					if (keyA2 < keyB2) return 1;
					if (keyA2 > keyB2) return -1;
					if (keyA3 < keyB3) return 1;
					if (keyA3 > keyB3) return -1;
					return 0;
				});
				
				vTableData.forEach(function(elem) {
					if(elem.OrgSort == "999") {
						elem.OrgSort = elem.OrgSortTemp;
						delete elem.OrgSortTemp;
					}
				});
			}
			
			oController._ListJSonModel.setProperty("/Data", vTableData)
			
			oController.BusyDialog.close();
		}
		
		var sortProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		sap.m.MessageBox.show("최종 점수순으로 정렬됩니다.\n계속하시겠습니까?", {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : sortProcess
		});
		
		oController._ListJSonModel.refresh();
	},
	
	_AddPersonDialog : null,
	
	EmpSearchByTx :function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OfficePromotionEvaluation.ZUI5_HR_OfficePromotionEvaluationList"),
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
		
		// list 초기화
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");

		oController._ListJSonModel.setData({Data : []});
		oController._ListJSonModel.refresh();
		oTable.setVisibleRowCount(1);
		
		$('#ZUI5_HR_OfficePromotionEvaluationList_TargetToolbar > span').text(oBundleText.getText("LABEL_0784"))	// 784:평가자
		
		oController.retrieveSjlev(oController);

		oController.buildCombo(oController);
	},
	
	displayEmpSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OfficePromotionEvaluation.ZUI5_HR_OfficePromotionEvaluationList"),
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_OfficePromotionEvaluation.ZUI5_HR_OfficePromotionEvaluationList"),
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_OfficePromotionEvaluation.ZUI5_HR_OfficePromotionEvaluationList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_OfficePromotionEvaluation.ZUI5_HR_OfficePromotionEvaluationList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_OfficePromotionEvaluation.ZUI5_HR_OfficePromotionEvaluationList"),
			oController = oView.getController(),
			vControlId = common.Common.getControlId(oController, oController._oControl.getId());
		
		if(vControlId.Id && vControlId.Id != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
		if(vControlId.Key && vControlId.Key != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
		oController._AddPersonDialog.close();
	},
	
	SmartSizing : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_OfficePromotionEvaluation.ZUI5_HR_OfficePromotionEvaluationList"),
			oController = oView.getController();
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OfficePromotionEvaluation.ZUI5_HR_OfficePromotionEvaluationList"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_OfficePromotionEvaluation.ZUI5_HR_OfficePromotionEvaluationList"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty){ // 처리 구분
		var vOData = oController.onValidationData(oController, vPrcty);
		
		if( vOData == "") return ;
		vOData.Prcty = vPrcty;
		vOData.Actty = _gAuth;
		
		var onProcess = function() {
			var oModel = sap.ui.getCore().getModel("ZHR_OFIC_PROMOTION_SRV"),
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
				onClose : oController.onPressSearch
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
		var oModel = sap.ui.getCore().getModel("ZHR_OFIC_PROMOTION_SRV");
			vCondData = {},
			vDetailData = {},
			rData = {};
			
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