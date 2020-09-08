jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList
	 */

	PAGEID : "ZUI5_HR_ProductionEvaluationList",
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
	_vSelPath : "",
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
			prevYear = curDate.getFullYear() - 1,
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
		
		// HASS 로그인 평가자 set
		if((gReqAuth == "2" || gReqAuth == "3") && vEmpLoginInfo.length > 0) {
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
			var JSonData = { Data : { Evyer : prevYear, Apgrp : "", Evlev : "", Evtgr : "", Pstat : ""} };
			oController._ListCondJSonModel.setData(JSonData);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
		
		// 평가그룹 combo
		oController.onSetApgrp(oController);
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
		
		this.onPressSearch();
		
		sap.ui.getCore().byId('__text8').setText(oBundleText.getText("LABEL_0784"));	// 784:평가자
	},
	
	onBack : function(oEvent){
	},
	
	onChangeEvyer : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList"),
			oController = oView.getController(),
			oApgrp = sap.ui.getCore().byId(oController.PAGEID + "_Apgrp"),
			oEvlev = sap.ui.getCore().byId(oController.PAGEID + "_Evlev"),
			oEvtgr = sap.ui.getCore().byId(oController.PAGEID + "_Evtgr"),
			oPstat = sap.ui.getCore().byId(oController.PAGEID + "_Pstat");
		
		oApgrp.setValue();
		oEvlev.setValue();
		oEvtgr.setValue();
		oPstat.setValue();
		
		oController._ListCondJSonModel.setProperty("/Data/Apgrp", undefined);
		oController._ListCondJSonModel.setProperty("/Data/Evlev", undefined);
		oController._ListCondJSonModel.setProperty("/Data/Evtgr", undefined);
		oController._ListCondJSonModel.setProperty("/Data/Pstat", undefined);
		
		// 평가그룹 combo
		oController.onSetApgrp(oController);
	},
	
	onSetApgrp : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_SRV"),
			oApgrp = sap.ui.getCore().byId(oController.PAGEID + "_Apgrp"),
			vEvyer = oController._ListCondJSonModel.getProperty("/Data/Evyer"),
			vAppnr = oController._TargetJSonModel.getProperty("/Data/Encid");
		
		if(oApgrp.getItems()) oApgrp.destroyItems();
		
		if(!vAppnr) return;
		
		oModel.read("/ApprApgrpSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Evyer', sap.ui.model.FilterOperator.EQ, vEvyer),
//				new sap.ui.model.Filter('Appnr', sap.ui.model.FilterOperator.EQ, vAppnr)
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

	// 리스트 조회
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			vAppnr = oController._TargetJSonModel.getProperty("/Data/Encid"),
			vTotalCount = 0;
		
		if(!vAppnr) return;

		// 테이블 sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++) {
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var aFilters = [],
			SerchCond = oController._ListCondJSonModel.getProperty("/Data");
		
		aFilters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth));
		aFilters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'L'));
		if(SerchCond.Evyer) {
			aFilters.push(new sap.ui.model.Filter('Evyer', sap.ui.model.FilterOperator.EQ, SerchCond.Evyer));
		}
//		aFilters.push(new sap.ui.model.Filter('Appnr', sap.ui.model.FilterOperator.EQ, vAppnr));
		aFilters.push(new sap.ui.model.Filter('Appencid', sap.ui.model.FilterOperator.EQ, vAppnr));
		aFilters.push(new sap.ui.model.Filter('Apgrp', sap.ui.model.FilterOperator.EQ, (SerchCond.Apgrp) ? SerchCond.Apgrp : ""));
		aFilters.push(new sap.ui.model.Filter('Evlev', sap.ui.model.FilterOperator.EQ, (SerchCond.Evlev) ? SerchCond.Evlev : ""));
		if(SerchCond.Evtgr) aFilters.push(new sap.ui.model.Filter('Evtgr', sap.ui.model.FilterOperator.EQ, SerchCond.Evtgr));
		if(SerchCond.Pstat) aFilters.push(new sap.ui.model.Filter('Pstat', sap.ui.model.FilterOperator.EQ, SerchCond.Pstat));
		
		function Search() {
			var Datas = {Data : []};
			
			oModel.read("/ApprApplSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						vTotalCount = data.results.length;
						
						for(var i=0; i<data.results.length; i++) {
							var OneData = data.results[i];
							OneData.Idx = i + 1;
							OneData.Apoint = (!OneData.Apoint || OneData.Apoint == "0.00") ? "0" : OneData.Apoint;
							
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
			
			var oTotalCount = sap.ui.getCore().byId(oController.PAGEID + "_TotalCount");
			oTotalCount.setText(": " + vTotalCount);
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			oController._ListJSonModel.setData(Datas);
			oTable.setVisibleRowCount(Datas.Data.length > 15 ? 15 : Datas.Data.length);
			
			if(Datas.Data.length > 0) {
				oController._ListCondJSonModel.setProperty("/Data/hasRow", "X");
			} else {
				oController._ListCondJSonModel.setProperty("/Data/hasRow", undefined);
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
	
	openEvaluationDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList"),
			oController = oView.getController(),
			selPath = oEvent.getSource().getBindingContext().sPath;
		
		oController._IsManager = "";
		oController._vSelPath = selPath;
		
		if(!oController._EvaluationDialog) {
			oController._EvaluationDialog = sap.ui.jsfragment("ZUI5_HR_ProductionEvaluation.fragment.EvaluationDialog", oController);
			oView.addDependent(oController._EvaluationDialog);
		}
		
//		oController.retrieveEvaluationDetail(oController, selPath);
		
		oController._EvaluationDialog.open();
	},
	
	closeEvalDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList"),
			oController = oView.getController();
		
		oController.onPressSearch();
		oController._EvaluationDialog.close();
	},
	
	retrieveEvaluationDetail : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_SRV"),
			oCommonModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
			rowObject = oController._ListJSonModel.getProperty(oController._vSelPath),
			vIdx = 1,
			vReadonly = false,
			vEvyer = "",
			vEvtgr = "",
			aScores = [];
		
		oController._EvalDetailJSonModel.setData({Data : {}});
		oController._EvalListJSonModel.setData({Data : [], Scores : []})
		
		oModel.read("/ApprApplSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth),
				new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'D'),
				new sap.ui.model.Filter('Evyer', sap.ui.model.FilterOperator.EQ, rowObject.Evyer),
//				new sap.ui.model.Filter('Appnr', sap.ui.model.FilterOperator.EQ, rowObject.Appnr),
				new sap.ui.model.Filter('Appencid', sap.ui.model.FilterOperator.EQ, rowObject.Appencid),
				new sap.ui.model.Filter('Apgrp', sap.ui.model.FilterOperator.EQ, rowObject.Apgrp),
//				new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, rowObject.Pernr),
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, rowObject.Encid),
				new sap.ui.model.Filter('Evtgr', sap.ui.model.FilterOperator.EQ, rowObject.Evtgr),
				new sap.ui.model.Filter('Evlev', sap.ui.model.FilterOperator.EQ, rowObject.Evlev)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					var rData = data.results[0];
					
					oController._EvalDetailJSonModel.setData({Data : rData});
					oController._EvalDetailJSonModel.refresh();
					
					vEvyer = rData.Evyer;
					vEvtgr = rData.Evtgr;
					oController._vReadonly = rData.Readonly;
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				if(errData.Error == "E") {
					sap.m.MessageBox.show(errData.ErrorMessage, {});
				}
			}
		});
		
		// 점수 combolist
		oModel.read("/ApprEvscoSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Evyer', sap.ui.model.FilterOperator.EQ, vEvyer),
				new sap.ui.model.Filter('Evtgr', sap.ui.model.FilterOperator.EQ, vEvtgr)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					aScores = data.results;
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				if(errData.Error == "E") {
					sap.m.MessageBox.show(errData.ErrorMessage, {});
				}
			}
		});
		
		oModel.read("/ApprDetailSet", {
			async : false,
			filters : [
				new sap.ui.model.Filter('Evyer', sap.ui.model.FilterOperator.EQ, rowObject.Evyer),
//				new sap.ui.model.Filter('Appnr', sap.ui.model.FilterOperator.EQ, rowObject.Appnr),
				new sap.ui.model.Filter('Appencid', sap.ui.model.FilterOperator.EQ, rowObject.Appencid),
//				new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, rowObject.Pernr),
				new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, rowObject.Encid),
				new sap.ui.model.Filter('Evtgr', sap.ui.model.FilterOperator.EQ, rowObject.Evtgr),
				new sap.ui.model.Filter('Evlev', sap.ui.model.FilterOperator.EQ, rowObject.Evlev)
			],
			success : function(data, res) {
				if(data && data.results.length) {
					data.results.forEach(function(elem) {
						elem.Idx = vIdx++;
						elem.Readonly = oController._vReadonly;
					});
					
					oController._EvalListJSonModel.setData({Data : data.results, Scores : aScores});
					oController._EvalListJSonModel.refresh();
					
					// 총점 재계산
					oController.onChangeEvsco();
				}
			},
			error : function(Res) {
				var errData = common.Common.parseError(Res);
				if(errData.Error == "E") {
					sap.m.MessageBox.show(errData.ErrorMessage, {});
				}
			}
		});
	},
	
	onAfterOpenEvaluationDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList"),
			oController = oView.getController(),
			oDialog = sap.ui.getCore().byId(oController.PAGEID + "_EvaluationDialog"),
			oDialogModel = oDialog.getModel(),
			oEvalTable = sap.ui.getCore().byId(oController.PAGEID + "_EvaluationTable"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_EvaluationTable"),
			vEvtgr = oController._EvalDetailJSonModel.getProperty("/Data/Evtgr"),
			vApoint = oController._EvalDetailJSonModel.getProperty("/Data/Apoint");
		
		oDialogModel.setData({Data : {Readonly : oController._vReadonly, Apoint : (vApoint == "0.00") ? undefined : vApoint}});
		
		// 평가직급(보직계장,생산직사원)별 테이블헤더 조정
		var colModel = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "8%"},
			{id: "Evelmtx", label : oBundleText.getText("LABEL_0783"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "30%", align : sap.ui.core.TextAlign.Begin},	// 783:평가요소
			{id: "Evitmtx", label : oBundleText.getText("LABEL_0789"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "30%", align : sap.ui.core.TextAlign.Begin},	// 789:평가항목
			{id: "Viewpont", label : oBundleText.getText("LABEL_0771"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "20%"},	// 771:착안점
			{id: "Evsco", label : oBundleText.getText("LABEL_0790"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "12%"}	// 790:평점
		];
		
		// 생산직사원일 경우 평가항목 제거
		if(vEvtgr == "Q220") {
			colModel.splice(2, 1);
			colModel[1].width = "45%";
			colModel[2].width = "35%";
		}
		
		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(colModel);
		
		oEvalTable.destroyColumns();
		colModel.forEach(function(elem) {
			oColumn = new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
				autoResizable : true,
				resizable : true,
				showFilterMenuEntry : true
			})
//			.setFilterProperty(elem.id)
//			.setSortProperty(elem.id)
			.setWidth(elem.width)
			.addMultiLabel(new sap.ui.commons.TextView({
				text : elem.label, 
				textAlign : "Center", width : "100%"
			}).addStyleClass("FontFamilyBold"))
			.setTemplate(new sap.ui.commons.TextView({
				text : "{" + elem.id + "}", 
				textAlign : (elem.align) ? elem.align : "Center"
			}).addStyleClass("FontFamily"));
			
			oEvalTable.addColumn(oColumn);
		});
		
		var indexViewpont = (vEvtgr == "Q220") ? 2 : 3;
		var indexEvsco = (vEvtgr == "Q220") ? 3 : 4;
		
		oTable.getColumns()[indexViewpont].setTemplate(new sap.m.Button({
			text : oBundleText.getText("LABEL_0771"),	// 771:착안점
			type : sap.m.ButtonType.Ghost,
			press : oController.onOpenViewpont,
			customData : [new sap.ui.core.CustomData({key : "Viewpont", value : "{Viewpont}"})]
		}));
		
		oTable.getColumns()[indexEvsco].setTemplate(new sap.m.ComboBox({
			selectedKey : "{Evsco}",
			change : oController.onChangeEvsco,
			editable : {
				parts : [{path : "Readonly"}],
				formatter : function(fVal1) {
					return !fVal1;
				}
			},
			items : {
				path : "/Scores",
				template : new sap.ui.core.ListItem({
					key : "{Evsco}",
					text : "{Evsco}"
				}),
				templateShareable : true
			}
		}).addStyleClass("FontFamily"));
		
		oEvalTable.setVisibleRowCount(oEvalTable.getModel().getData().Data.length);
	},
	
	onChangeEvsco : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList"),
			oController = oView.getController(),
			oDialog = sap.ui.getCore().byId(oController.PAGEID + "_EvaluationDialog"),
			oDialogModel = oDialog.getModel(),
			vTableData = oController._EvalListJSonModel.getProperty("/Data"),
			aWeight = [],
			vTotalWeightSum = 0;
			
		// 가중치 총점 계산
		vTableData.forEach(function(elem) {
			var tEvsco = Number(elem.Evsco) / 100,
				tErate = Number(elem.Erate) / 100;
			
			aWeight.push(tEvsco * tErate);
		});
		
		aWeight.forEach(function(elem) {
			vTotalWeightSum += elem;
		});
		vTotalWeightSum = (vTotalWeightSum * 100).toFixed(2);
		
		oDialogModel.setProperty("/Data/Apoint", vTotalWeightSum);
		oController._EvalDetailJSonModel.setProperty("/Data/Apoint", vTotalWeightSum);
	},
	
	onEvalExport : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList"),
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_EvaluationTable"),
			oJSONModelData = oTable.getModel().getProperty("/Data"),
			dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"}),
			curDate = new Date();
		
		if(oJSONModelData.length < 1) return;
		
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModelData,
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
				fileName: oBundleText.getText("LABEL_0776") + "-" + dateFormat.format(curDate) + ".xlsx"	// 776:평가내역
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	},
	
	onOpenViewpont : function(oEvent) {
		var vViewPont = oEvent.getSource().getCustomData()[0].getValue(),
			vHeight = "170px",
			oRow, oCell;
		
		if(!vViewPont) return;
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : ['10px','','10px']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({})
		}); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.TextArea({
		 		editable : false ,
		 		value : vViewPont,
		 		growing : true,
		 		width : "100%",
		 		rows : 8,
		 	}).addStyleClass("FontFamily"),
			hAlign : "Center",
		}); 
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		var oPopover = new sap.m.Popover({
			contentWidth : "600px",
			contentHeight : vHeight,
			placement : sap.m.PlacementType.Top,
			content : oMatrix ,
			title : oBundleText.getText("LABEL_0771")	// 771:착안점
		});
		
		oPopover.openBy(oEvent.getSource());
	},
	
	_AddPersonDialog : null,
	
	EmpSearchByTx :function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList"),
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
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,vEmpSearchResult.EmpSearchResultSet[0].Pernr);
				oController.onPressSearch();
			} else {
				oController._vEnamefg = "X";
				oController.displayEmpSearchDialog();
			}
		}
	},
	
	onAfterSelectPernr : function(oController) {
		// 평가그룹 combo
		oController.onSetApgrp(oController);
		
		// list 초기화
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		oController._ListJSonModel.setData({Data : []});
		oTable.setVisibleRowCount(1);
		
		oController._ListCondJSonModel.setProperty("/Data/hasRow", undefined);
		
		sap.ui.getCore().byId('__text8').setText(oBundleText.getText("LABEL_0784"));	// 784:평가자
	},
	
	displayEmpSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList"),
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList"),
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

		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList"),
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList"),
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
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,mEmpSearchResult.getProperty(_selPath + "/Pernr"));
		
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList"),
			oController = oView.getController(),
			vControlId = common.Common.getControlId(oController, oController._oControl.getId());
		
		if(vControlId.Id && vControlId.Id != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
		if(vControlId.Key && vControlId.Key != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
		oController._AddPersonDialog.close();
	},
	
	SmartSizing : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList"),
			oController = oView.getController();
	},
	
	onPressAllSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_SRV"),
			vTableData = oController._ListJSonModel.getProperty("/Data"),
			vOData = {};
		
		if(!vTableData.length) return;
		
		vOData.Prcty = "C";
		vOData.Actty = _gAuth;
		vOData.Mdgbn = "M";
		vOData.MainNav = [];
		
		vTableData.forEach(function(elem) {
			vOData.MainNav.push(common.Common.copyByMetadata(oModel, "ApprAppl", elem));
		});
		
		var onProcess = function() {
			var errData = {};
				
			oModel.create("/ApprApplSet", vOData, {
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
		
		var vInfoTxt = oBundleText.getText("LABEL_2955");	// 2955:전체완료하시겠습니까?
		var vCompTxt = oBundleText.getText("LABEL_2956") ;	// 2956:전체 평가가 완료되었습니다.
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList"),
			oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProductionEvaluation.ZUI5_HR_ProductionEvaluationList"),
			oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty){ // 처리 구분
		var vOData = oController.onValidationData(oController, vPrcty);
		
		if( vOData == "") return ;
		vOData.Prcty = vPrcty;
		vOData.Actty = _gAuth;
		vOData.Mdgbn = "D";
		
		var onProcess = function() {
			var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_SRV"),
				errData = {};
				
			oModel.create("/ApprApplSet", vOData, {
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
				onClose : oController.closeEvalDialog
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
		var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_SRV"),
			vData = oController._EvalDetailJSonModel.getProperty("/Data"),
			vDetailData = oController._EvalListJSonModel.getProperty("/Data"),
			rData = {};
		
		var isValidEvsco = true;
		vDetailData.forEach(function(elem) {
			if(!elem.Evsco || elem.Evsco == "0" || elem.Evsco == "") isValidEvsco = false;
		});
		
		if(!isValidEvsco) {
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0796"));	// 796:모든 평가항목에 대해 점수를 입력해야 합니다.
			return "";
		}
		
		// 총점계산
		oController.onChangeEvsco();
		
		if(vPrcty == "C") {
			if(!vData.Apoint) {
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0795"));	// 795:평가점수가 입력되지 않았습니다.
				return "";
			}
		}
		
		try {
			rData = common.Common.copyByMetadata(oModel, "ApprAppl", vData);
			
			rData.DetailNav = [];
			vDetailData.forEach(function(elem) {
				rData.DetailNav.push(common.Common.copyByMetadata(oModel, "ApprDetail", elem));
			});
		} catch(ex) {
			new control.ZNK_SapBusy.oErrorMessage(ex.message);
			return "";
		}
		
		return rData;
		
	}
});