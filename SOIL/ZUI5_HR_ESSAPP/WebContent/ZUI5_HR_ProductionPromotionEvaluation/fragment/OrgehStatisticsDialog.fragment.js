sap.ui.jsfragment("ZUI5_HR_ProductionPromotionEvaluation.fragment.OrgehStatisticsDialog", {

	_colModelA : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "6%"},
		{id: "Orgtx500", label : oBundleText.getText("LABEL_0932"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "18%", align : sap.ui.core.TextAlign.Begin},	// 932:부문/실/공장
		{id: "Orgtx600", label : oBundleText.getText("LABEL_0933"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "18%", align : sap.ui.core.TextAlign.Begin},	// 933:부서/팀
		{id: "Orgtx700", label : oBundleText.getText("LABEL_0925"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "18%", align : sap.ui.core.TextAlign.Begin},	// 925:과/파트
		{id: "PernrCnt", label : oBundleText.getText("LABEL_0968"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 968:현재원(명)
		{id: "SjtgtCnt", label : oBundleText.getText("LABEL_0943"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 943:승진대상(명)
		{id: "SjablCnt", label : oBundleText.getText("LABEL_0947"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 947:승진예정(명)
		{id: "Sjrate", label : oBundleText.getText("LABEL_0948"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"}	// 948:승진율(%)
	],
	
	_colModelB : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "6%"},
		{id: "Orgtx500", label : oBundleText.getText("LABEL_0932"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "18%", align : sap.ui.core.TextAlign.Begin},	// 932:부문/실/공장
		{id: "Orgtx600", label : oBundleText.getText("LABEL_0933"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "18%", align : sap.ui.core.TextAlign.Begin},	// 933:부서/팀
		{id: "Orgtx700", label : oBundleText.getText("LABEL_0925"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "18%", align : sap.ui.core.TextAlign.Begin},	// 925:과/파트
		{id: "PernrCnt", label : oBundleText.getText("LABEL_0968"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 968:현재원(명)
		{id: "SjtgtCnt", label : oBundleText.getText("LABEL_0943"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 943:승진대상(명)
		{id: "SjablCnt", label : oBundleText.getText("LABEL_0965"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 965:추천인원(명)
		{id: "Rcrate", label : oBundleText.getText("LABEL_0964"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"}	// 964:추천율(%)
	],
	
	_colModelC : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "4%"},
		{id: "Orgtx400", label : oBundleText.getText("LABEL_0931"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "16%", align : sap.ui.core.TextAlign.Begin},	// 931:본부
		{id: "Orgtx500", label : oBundleText.getText("LABEL_0932"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "16%", align : sap.ui.core.TextAlign.Begin},	// 932:부문/실/공장
		{id: "Orgtx600", label : oBundleText.getText("LABEL_0966"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "16%", align : sap.ui.core.TextAlign.Begin},	// 966:팀/부
		{id: "Orgtx700", label : oBundleText.getText("LABEL_0924"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "16%", align : sap.ui.core.TextAlign.Begin},	// 924:과
		{id: "PernrCnt", label : oBundleText.getText("LABEL_0968"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "8%"},	// 968:현재원(명)
		{id: "SjtgtCnt", label : oBundleText.getText("LABEL_0943"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "8%"},	// 943:승진대상(명)
		{id: "SjablCnt", label : oBundleText.getText("LABEL_0965"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "8%"},	// 965:추천인원(명)
		{id: "Rcrate", label : oBundleText.getText("LABEL_0964"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "8%"}	// 964:추천율(%)
	],
	
	createContent : function(oController) {	
		var oJSonModel = new sap.ui.model.json.JSONModel();
		
		var oTableA = new sap.ui.table.Table(oController.PAGEID + "_StastTableA", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
		})
		.setModel(oController._StastListJSonModel)
		.bindRows("/Data");
		
		common.ZHR_TABLES.makeColumn(oController, oTableA, this._colModelA);
		
		var oTableB = new sap.ui.table.Table(oController.PAGEID + "_StastTableB", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
		})
		.setModel(oController._StastListJSonModel)
		.bindRows("/Data");
		
		common.ZHR_TABLES.makeColumn(oController, oTableB, this._colModelB);
		
		var oTableC = new sap.ui.table.Table(oController.PAGEID + "_StastTableC", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
		})
		.setModel(oController._StastListJSonModel)
		.bindRows("/Data");
		
		common.ZHR_TABLES.makeColumn(oController, oTableC, this._colModelC);
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [
				oTableA, 
				oTableB, 
				oTableC 
			]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_StastDialog", {
			contentWidth : "900px",
			contentHeight : "420px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0934"),	// 934:부서별 통계
			afterOpen : oController.onAfterOpenStastDialog,
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  oBundleText.getText("LABEL_0017"), // 17:닫기
				press : function() {
					oDialog.close();
				}
			}),
			content : [
				oLayout
			]
		})
		.addStyleClass("sapUiSizeCompact");
		
		oDialog.addEventDelegate({
			onAfterRendering: function() {
				var oController = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList").getController(),
					vSjkgb = oController._ListCondJSonModel.getProperty("/Data/Sjkgb"),
					vSjlev = oController._ListCondJSonModel.getProperty("/Data/Sjlev");
				
				if(vSjkgb == "B") {
					$('#ZUI5_HR_ProductionPromotionEvaluationList_StastTableA').show();
					$('#ZUI5_HR_ProductionPromotionEvaluationList_StastTableB').hide();
					$('#ZUI5_HR_ProductionPromotionEvaluationList_StastTableC').hide();
				} else {
					if(vSjlev == "1") {
						$('#ZUI5_HR_ProductionPromotionEvaluationList_StastTableA').hide();
						$('#ZUI5_HR_ProductionPromotionEvaluationList_StastTableB').show();
						$('#ZUI5_HR_ProductionPromotionEvaluationList_StastTableC').hide();
					} else {
						$('#ZUI5_HR_ProductionPromotionEvaluationList_StastTableA').hide();
						$('#ZUI5_HR_ProductionPromotionEvaluationList_StastTableB').hide();
						$('#ZUI5_HR_ProductionPromotionEvaluationList_StastTableC').show();
					}
				}
			}
		});
		
		return oDialog;
	}

});