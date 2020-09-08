sap.ui.jsfragment("ZUI5_HR_OverseaBTrip.fragment.DepatureDialog", {
	
	createContent : function(oController) {
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : ['30%','30%','40%']
		});
		
		var _colModel1 = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "20%"},
		 	{id: "Blotx", label : oBundleText.getText("LABEL_1211"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80%"}	// 1211:출발지
		];
		
		var oTable1 = new sap.ui.table.Table(oController.PAGEID + "_DialogTable1", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			visibleRowCount : 15,
			showNoData : true,
			selectionBehavior : sap.ui.table.SelectionBehavior.RowOnly,
			selectionMode: sap.ui.table.SelectionMode.Single,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
		})
		.setModel(new sap.ui.model.json.JSONModel())
		.bindRows("/Data");
		
		common.ZHR_TABLES.makeColumn(oController, oTable1, _colModel1);
		
		var _colModel2 = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "20%"},
		 	{id: "Blotx", label : oBundleText.getText("LABEL_1206"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80%"}	// 1206:도착지
		];
		
		var oTable2 = new sap.ui.table.Table(oController.PAGEID + "_DialogTable2", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			visibleRowCount : 15,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.Single,
			selectionBehavior : sap.ui.table.SelectionBehavior.RowOnly,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
		})
		.setModel(new sap.ui.model.json.JSONModel())
		.bindRows("/Data");
		
		common.ZHR_TABLES.makeColumn(oController, oTable2, _colModel2);

		var _colModel3 = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "20%"},
		 	{id: "Trftx", label : oBundleText.getText("LABEL_1202"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80%"}	// 1202:교통수단
		];
		
		var oTable3 = new sap.ui.table.Table(oController.PAGEID + "_DialogTable3", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			visibleRowCount : 15,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.Single,
			selectionBehavior : sap.ui.table.SelectionBehavior.RowOnly,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
		})
		.setModel(new sap.ui.model.json.JSONModel())
		.bindRows("/Data");
		
		common.ZHR_TABLES.makeColumn(oController, oTable3, _colModel3);
		
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : oTable1,
					vAlign : "Top"
				}).addStyleClass("L2PMatrixData4 L2PPaddingLeft5 L2PPaddingTop5 L2PPaddingRight5 L2PPaddingBottom5"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : oTable2,
					vAlign : "Top"
				}).addStyleClass("L2PMatrixData4 L2PPaddingLeft5 L2PPaddingTop5 L2PPaddingRight5 L2PPaddingBottom5"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : oTable3,
					vAlign : "Top"
				}).addStyleClass("L2PMatrixData4 L2PPaddingLeft5 L2PPaddingTop5 L2PPaddingRight5 L2PPaddingBottom5"),
			]
		});
		
		oMatrix.addRow(oRow);
		
		var oDialog = new sap.m.Dialog({
			content : [
				new sap.ui.core.HTML({
					content : "<div style='height : 11px;'/>"
				}),
				oMatrix
			],
			contentWidth : "1000px",
			horizontalScrolling : false,
			verticalScrolling : false, 
			showHeader : true,
			title : oBundleText.getText("LABEL_1212"),	// 1212:출발지, 도착지, 교통수단 선택
			buttons :[ new sap.m.Button({
							text : oBundleText.getText("LABEL_0037"), 	// 37:선택
							press : oController.onSelectDeparture
						}),
						new sap.m.Button({
							text : oBundleText.getText("LABEL_0017"), // 17:닫기
							press : function(oEvent){
								oDialog.close();
							}
						}),
			
			]
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
		
	}
	
});