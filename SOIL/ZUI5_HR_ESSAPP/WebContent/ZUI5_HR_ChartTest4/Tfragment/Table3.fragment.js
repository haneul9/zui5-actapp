sap.ui.jsfragment("ZUI5_HR_ChartTest4.Tfragment.Table3", {
	
	_colModel : [
		{id: "Pyitx", label : "항목", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},
		{id: "Anzhl", label : "휴가쿼터 발생", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "18%"},
		{id: "Rezhl", label : "사용", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},
		{id: "Betrg", label : "금액", plabel : "", span : 0, type : "money", sort : false, filter : false, width : "12%"},
		{id: "Pydes", label : "설명", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "50%"}
	],
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.ZNK_TABLES");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable3", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			visibleRowCount : 1
		}).setModel(new sap.ui.model.json.JSONModel())
		.bindRows("/Data");
		
		common.ZNK_TABLES.makeColumn(oController, oTable, this._colModel);
		
		return oTable;
	},	
});