sap.ui.jsfragment("ZUI5_HR_ChartTest4.Tfragment.Table2", {
	
	_colModel : [
		{id: "Edgbn", label : "교육구분", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},
		{id: "Edcnm", label : "교육명", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "45%"},
		{id: "Begda", label : "시작일", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},
		{id: "Endda", label : "종료일", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},
		{id: "Edtim", label : "이수시간", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},
	],
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.ZNK_TABLES");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable2", {
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