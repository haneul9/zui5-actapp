jQuery.sap.declare("zui5_hrxx_actapp2.fragment.ZKL_TableMakr");
zui5_hrxx_actapp2.fragment.ZKL_TableMakr = {


	ListTable : function(oController) {		

		var oTable = new sap.ui.table.Table(oController.PAGEID + "_ListTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 40,
//			rowHeight : 48,
			visibleRowCount : 5,
//			fixedColumnCount : 3,
			selectionMode : sap.ui.table.SelectionMode.Single
		});
		
		oTable.attachCellClick(oController.SelectRow);
//		oTable.attachRowSelectionChange(oController.SelectRow)
		
		oTable.setModel(oController._tableJModel);
		oTable.bindRows("/Data");
		return oTable;

	},	
};