jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_ProdEvalOpinionDisp.ZUI5_HR_ProdEvalOpinionDispList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ProdEvalOpinionDisp.ZUI5_HR_ProdEvalOpinionDispList
	 */

	PAGEID : "ZUI5_HR_ProdEvalOpinionDispList",
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
			
			var JSonData = { Data : { Evyer : curYear - 1, Evtgr : "Q210", Apgrp : "", Adjgp : ""} };
			oController._ListCondJSonModel.setData(JSonData);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
		
		// Combo build
		oController.buildCombo(oController);
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
		this.onPressSearch();
	},
	
	onBack : function(oEvent){
	},
	
	buildCombo : function(oController) {
		// 1/2차평가그룹
		oController.onSetApgrp(oController);

		// 조정권자 평가그룹
		oController.onSetAdjgp(oController);
	},
	
	onSetApgrp : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_DISP_SRV"),
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
	
	onSetAdjgp : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_DISP_SRV"),
			oAdjgp = sap.ui.getCore().byId(oController.PAGEID + "_Adjgp"),
			vEvyer = oController._ListCondJSonModel.getProperty("/Data/Evyer"),
			vAppnr = oController._TargetJSonModel.getProperty("/Data/Encid");
		
		if(oAdjgp.getItems()) oAdjgp.destroyItems();
		
		if(!vEvyer || !vAppnr) return;
		
		oModel.read("/ApprAdjgpSet", {
			async: false,
			filters: [
				new sap.ui.model.Filter('Evyer', sap.ui.model.FilterOperator.EQ, vEvyer),
				new sap.ui.model.Filter('Appencid', sap.ui.model.FilterOperator.EQ, vAppnr)
			],
			success: function(data,res){
				if(data && data.results.length) {
					data.results.forEach(function(elem) {
						oAdjgp.addItem(new sap.ui.core.Item({
							key : elem.Apgrp,
							text : elem.Apgrptx
						}));
					});
				}
			},
			error: function(res){console.log(res);}
		});
	},
	
	onChangeEvyer : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProdEvalOpinionDisp.ZUI5_HR_ProdEvalOpinionDispList"),
			oController = oView.getController();
		
		oController.buildCombo(oController);
	},
	
	onOpenApcom : function(oEvent) {
		if(oEvent.getSource().getCustomData() && oEvent.getSource().getCustomData().length > 0){
			var vApcom = oEvent.getSource().getCustomData()[0].getValue(); 
			var vHeight = "110px";
			
			var oRow, oCell;
			
			var oMatrix = new sap.ui.commons.layout.MatrixLayout({
				columns : 3,
				widths : ['10px','','10px']
			});
			
			if(vApcom && vApcom != ""){
				oRow = new sap.ui.commons.layout.MatrixLayoutRow();
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({})
				}); 
				oRow.addCell(oCell);
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.TextArea({
				 		editable : false ,
				 		value : vApcom,
				 		growing : true,
				 		width : "100%",
				 		rows : 3,
				 	}).addStyleClass("Font14px FontColor3"),
					hAlign : "Center",
				}); 
				oRow.addCell(oCell);
				oMatrix.addRow(oRow);
			}
					
			var oPopover = new sap.m.Popover({
				contentWidth : "500px",
				contentHeight : vHeight,
				placement : sap.m.PlacementType.Top,
				content : oMatrix ,
				title : oBundleText.getText("LABEL_0832")	// 832:평가결과에 대한 의견
			});
			
			oPopover.openBy(oEvent.getSource());
			
		}
	},
	
	onOpenApadd : function(oEvent) {
		if(oEvent.getSource().getCustomData() && oEvent.getSource().getCustomData().length > 0){
			var vApadd = oEvent.getSource().getCustomData()[0].getValue(); 
			var vHeight = "110px";
			
			var oRow, oCell;
			
			var oMatrix = new sap.ui.commons.layout.MatrixLayout({
				columns : 3,
				widths : ['10px','','10px']
			});
			
			if(vApadd && vApadd != ""){
				oRow = new sap.ui.commons.layout.MatrixLayoutRow();
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({})
				}); 
				oRow.addCell(oCell);
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.TextArea({
				 		editable : false ,
				 		value : vApadd,
				 		growing : true,
				 		width : "100%",
				 		rows : 3,
				 	}).addStyleClass("Font14px FontColor3"),
					hAlign : "Center",
				}); 
				oRow.addCell(oCell);
				oMatrix.addRow(oRow);
			}
					
			var oPopover = new sap.m.Popover({
				contentWidth : "500px",
				contentHeight : vHeight,
				placement : sap.m.PlacementType.Top,
				content : oMatrix ,
				title : oBundleText.getText("LABEL_0834")	// 834:향후 보완 할 점
			});
			
			oPopover.openBy(oEvent.getSource());
			
		}
	},

	// 리스트 조회
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProdEvalOpinionDisp.ZUI5_HR_ProdEvalOpinionDispList"),
			oController = oView.getController(),
			oModel = sap.ui.getCore().getModel("ZHR_APPRAISAL_DISP_SRV"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
			vAppnr = oController._TargetJSonModel.getProperty("/Data/Encid");

		// 테이블 sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++) {
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var aFilters = [],
			SerchCond = oController._ListCondJSonModel.getProperty("/Data");
		
		if(SerchCond.Evyer != "") {
			aFilters.push(new sap.ui.model.Filter('Evyer', sap.ui.model.FilterOperator.EQ, SerchCond.Evyer));
		}
		if(SerchCond.Evtgr != "") {
			aFilters.push(new sap.ui.model.Filter('Evtgr', sap.ui.model.FilterOperator.EQ, SerchCond.Evtgr));
		}
		if(vAppnr != "") {
			aFilters.push(new sap.ui.model.Filter('Adjencid', sap.ui.model.FilterOperator.EQ, vAppnr));
		}
		if(SerchCond.Apgrp != "") {
			aFilters.push(new sap.ui.model.Filter('Apgrp', sap.ui.model.FilterOperator.EQ, SerchCond.Apgrp));
		}
		if(SerchCond.Adjgp != "") {
			aFilters.push(new sap.ui.model.Filter('Adjgp', sap.ui.model.FilterOperator.EQ, SerchCond.Adjgp));
		}
		
		function Search() {
			var Datas = oController._ListJSonModel.getData();
			
			Datas.Data = [];
			
			oModel.read("/ApprOpinListSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0; i<data.results.length; i++) {
							var OneData = data.results[i];
							OneData.Idx = i + 1;
							OneData.Finpo = (!OneData.Finpo || OneData.Finpo == "0.00") ? "0" : OneData.Finpo;
							
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
				vTotalCount = Datas.Data.length;
			
			oTable.setVisibleRowCount(vTotalCount > 15 ? 15 : vTotalCount);
			
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
	
	SmartSizing : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProdEvalOpinionDisp.ZUI5_HR_ProdEvalOpinionDispList");
		var oController = oView.getController();
	},
	
	onAfterSelectPernr : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProdEvalOpinionDisp.ZUI5_HR_ProdEvalOpinionDispList"),
			oController = oView.getController();
		
		// 검색 초기화
		oController._ListJSonModel.setData({Data : []});
		
		oController.buildCombo(oController);
	},
	
	onExport : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ProdEvalOpinionDisp.ZUI5_HR_ProdEvalOpinionDispList");
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
				fileName: oBundleText.getText("LABEL_0894") + "-" + dateFormat.format(curDate) + ".xlsx"	// 894:생산직 평가조정 의견기술 조회
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
	}
});