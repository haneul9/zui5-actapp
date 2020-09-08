sap.ui.jsfragment("ZUI5_HR_ExcWork.fragment.OrgehSchkz", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.ZHR_TABLES");
		
		var oOrgehSchkzMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
		
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "40px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0015"),	// 기준일
						required : true
					}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : [
						new sap.m.Text({
							text : "{Datum}"
						}).addStyleClass("L2PFontFamily")
					]
				}).addStyleClass("L2PMatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0028"),	// 28:부서
						required : true
					}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : [
						new sap.m.Text({
							text : "{Orgtx}"
						}).addStyleClass("L2PFontFamily")
					]
				}).addStyleClass("L2PMatrixData")
			]
		});
		
		oOrgehSchkzMatrix.addRow(oRow);
		oOrgehSchkzMatrix.setModel(oController._OrgehJSonModel);
		oOrgehSchkzMatrix.bindElement("/Data");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_OrgehTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			visibleRowCount : 10,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
		})
		.setModel(oController._OrgehTableJSonModel)
		.bindRows("/Data");
		
		var colModel = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "4%"},
			{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 31:사번
			{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 38:성명
			{id: "Orgtx", label : oBundleText.getText("LABEL_0028"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "12%"},	// 28:부서
			{id: "Zzjiklnt", label : oBundleText.getText("LABEL_0067"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "10%"},	// 67:직위
			{id: "Rtext", label : oBundleText.getText("LABEL_0008"), plabel : "", span : 0, type : "string", sort : true, filter : true},	// 근무일정규칙
			{id: "Wrkjobt", label : oBundleText.getText("LABEL_0010"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "15%"},	// 근무직
			{id: "Begda", label : oBundleText.getText("LABEL_0042"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "10%"},	// 42:시작일
			{id: "Endda", label : oBundleText.getText("LABEL_0065"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "10%"}	// 65:종료일
		];
		
		common.ZHR_TABLES.makeColumn(oController, oTable, colModel);
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_OrgehSchkzDialog", {
			content : [
				oOrgehSchkzMatrix,
				new sap.ui.core.HTML({
					content : "<div style='height : 11px;'/>"
				}),
				oTable
			],
			contentWidth : "1100px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0029"),	// 29:부서별 근무조 현황
			beginButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0037"), 	// 37:선택
				press : oController.onAddDetailTable
			}),
			endButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0071"), 	// 71:취소
				press : function(oEvent){
					oDialog.close();
				}
			})
		});
		
		oDialog.bindElement("/Data");
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
		
	}
	
});