sap.ui.jsfragment("ZUI5_HR_ChangeShift.fragment.SaveCheck2", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.ZHR_TABLES");
		
		var oErrorTable = new sap.ui.table.Table(oController.PAGEID + "_Check2Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
//			columnHeaderHeight : 35,
			visibleRowCount : 10,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
		})
		.setModel(oController._Check2TableJSonModel)
		.bindRows("/Data");
		
		var errorColModel = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "6%"},
			{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "12%"},	// 31:사번
			{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "12%"},	// 38:성명
			{id: "Message", label : oBundleText.getText("LABEL_0016"), plabel : "", span : 0, type : "string", sort : false, filter : false}	// 내역
		];
		
		common.ZHR_TABLES.makeColumn(oController, oErrorTable, errorColModel);
		
		var oCheck2Dialog = new sap.m.Dialog(oController.PAGEID + "_Check2Dialog", {
			content : [
				new sap.ui.core.HTML({
					content : "<div style='height : 11px;'/>"
				}),
				oErrorTable
			],
			contentWidth : "800px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("LABEL_0395"),	// 395:확인
				press : function() {
					oCheck2Dialog.close();
					oController.onSave(oController, "C");
				}
			}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  oBundleText.getText("LABEL_0017"),	// 17:닫기
				press : function() {
					oCheck2Dialog.close();
					oController.BusyDialog.close();
				}
			})
		});
		
		oCheck2Dialog.bindElement("/Data");
		oCheck2Dialog.addStyleClass("sapUiSizeCompact");
		
		return oCheck2Dialog;
		
	}
	
});