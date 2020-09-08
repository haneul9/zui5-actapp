sap.ui.jsfragment("ZUI5_HR_ProductionEvaluationAdjust.fragment.EvaluationDialog", {

	_colModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "4%"},
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "12%"},	// 38:성명
		{id: "Zzjiktlt", label : oBundleText.getText("LABEL_0770"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "15%"},	// 770:직급
		{id: "Evtgrtx", label : oBundleText.getText("LABEL_0833"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "15%"},	// 833:평가용직급
		{id: "Orgtx", label : oBundleText.getText("LABEL_0815"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "20%", align : sap.ui.core.TextAlign.Begin},	// 815:부서명
		{id: "Finpo", label : oBundleText.getText("LABEL_0786"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "12%", align : sap.ui.core.TextAlign.End},	// 786:평가점수
		{id: "Comstatx", label : oBundleText.getText("LABEL_0821"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "12%"}	// 821:입력상태
	],
	
	createContent : function(oController) {	
		var oJSonModel = new sap.ui.model.json.JSONModel();
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "40px",
				cells : [
					// 피평가자
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0792") 	// 792:피평가자
						}).addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PMatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{Perid} {Ename}",
						}).addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PMatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "120px",
				cells : [
					// 평가 결과에 대한 의견
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0832") 	// 832:평가결과에 대한 의견
						}).addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PMatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.TextArea({
							value : "{Apcom}",
							width : "99%",
							maxLength : common.Common.getODataPropertyLength("ZHR_APPRAISAL_ADJ_SRV", "ApprAppl", "Apcom"),
							rows : 5,
							editable : {
								path : "Comsta",
								formatter : function(fVal1) {
									return (fVal1 == "" || fVal1 == "1") ? true : false;
								}
							}
						}).addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PMatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "120px",
				cells : [
					// 향후 보완 할 점
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0834") 	// 834:향후 보완 할 점
						}).addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PMatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.TextArea({
							value : "{Apadd}",
							width : "99%",
							maxLength : common.Common.getODataPropertyLength("ZHR_APPRAISAL_ADJ_SRV", "ApprAppl", "Apadd"),
							rows : 5,
							editable : {
								path : "Comsta",
								formatter : function(fVal1) {
									return (fVal1 == "" || fVal1 == "1") ? true : false;
								}
							}
						}).addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PMatrixData")
				]
			})
		];
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_EvaluationTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
		})
		.setModel(oController._EvalListJSonModel)
		.bindRows("/Data")
		.attachCellClick(oController.onSelectEvalRow);
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "40px",
					content : [
						new sap.ui.core.Icon({
							src: "sap-icon://open-command-field", 
							size : "1.0rem"
						}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_0111") 	// 111:대상자
						}).addStyleClass("L2PFontFamilyBold")
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				oTable,
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "40px",
					content : [
						new sap.ui.core.Icon({
							src: "sap-icon://open-command-field", 
							size : "1.0rem"
						}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_0817") 	// 817:의견기술
						}).addStyleClass("L2PFontFamilyBold"),
						new sap.m.ToolbarSpacer(),
						new sap.m.Button(oController.PAGEID + "_btnCommentSave", {
							text : oBundleText.getText("LABEL_0177"),	// 177:저장
							type : "Default",
							icon : "sap-icon://save",
							press : oController.onPressCommentSaveT
						}).addStyleClass("L2PFontFamily"),
						new sap.m.Button(oController.PAGEID + "_btnCommentConfirm", {
							text : oBundleText.getText("LABEL_0816"),	// 816:완료
							type : "Default",
							icon : "sap-icon://complete",
							press : oController.onPressCommentSaveC
						}).addStyleClass("L2PFontFamily")
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				new sap.ui.commons.layout.MatrixLayout({
					columns : 2,
					widths : ['20%', '80%'],
					rows : aRows
				})
				.setModel(oController._EvalDetailJSonModel)
				.bindElement("/Data")
			]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_EvaluationDialog", {
			contentWidth : "900px",
			contentHeight : "610px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0831"),	// 831:평가 하위자 의견 기술
			beforeOpen : oController.onBeforeOpenEvaluationDialog,
			afterOpen : oController.onAfterOpenEvaluationDialog,
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  oBundleText.getText("LABEL_0017"), // 17:닫기
				press : function() {
					oController.onPressSearch();
					oDialog.close();
				}
			}),
			content : [
				oLayout
			]
		})
		.setModel(oJSonModel);
		oDialog.bindElement("/Data");
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
	}

});