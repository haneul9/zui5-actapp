sap.ui.jsfragment("ZUI5_HR_Resort.fragment.ZrestDialog", {
	
	createContent : function(oController) {
		
		var _colModel = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "20%"},
		 	{id: "Zrttt", label : oBundleText.getText("LABEL_1881"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80%"}	// 1881:시설
		];
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_ZrestTable", {
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
		oTable.attachBrowserEvent("dblclick", oController.onSelectZrest);
		common.ZHR_TABLES.makeColumn(oController, oTable, _colModel);
		
		
		var oDialog = new sap.m.Dialog({
			content : [
				new sap.ui.core.HTML({
					content : "<div style='height : 11px;'/>"
				}),
				oTable
			],
			contentWidth : "600px",
			showHeader : true,
			title : oBundleText.getText("LABEL_1882"),	// 1882:시설 조회
			buttons :[ 
//				        new sap.m.Button({
//							text : oBundleText.getText("LABEL_0037"), 
//							press : oController.onSelectZrest
//						}),
						new sap.m.Button({
							text : oBundleText.getText("LABEL_0017"),  // 17:닫기
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