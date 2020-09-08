sap.ui.jsfragment("ZUI5_HR_OvertimeConfirmMulti.fragment.IntimeDialog", {

	createContent : function(oController) {	
		var oJSonModel = new sap.ui.model.json.JSONModel();
		oJSonModel.setData({Data : {}});
		
		var colModel = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "6%"},
			{id: "Datum", label : oBundleText.getText("LABEL_0057"), plabel : "", span : 0, type : "date", sort : true, filter : false, width : "21%"},	// 57:일자
			{id: "Intimt", label : oBundleText.getText("LABEL_0566"), plabel : "", span : 0, type : "time", sort : true, filter : true, width : "22%"},	// 566:출근시간
			{id: "Ouplc", label : oBundleText.getText("LABEL_0567"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "30%"},	// 567:출근장소
			{id: "Oudat", label : oBundleText.getText("LABEL_2953"), plabel : "", span : 0, type : "date", sort : true, filter : false, width : "21%"}	// 2953:출근일
		];
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_IntimeTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
		})
		.setModel(new sap.ui.model.json.JSONModel())
		.bindRows("/Data");
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTable = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirmMultiDetail_IntimeTable");
				
				oTable.getColumns().forEach(function(elem) {
					elem.setSorted(false);
					elem.setFiltered(false);
				});
				
				oTable.clearSelection();
				oTable.bindRows("/Data");
			}
		});
		
		common.ZHR_TABLES.makeColumn(oController, oTable, colModel);
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [
				oTable 
			]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_IntimeDialog", {
			contentWidth : "700px",
			contentHeight : "450px",
			showHeader : true,
			title : oBundleText.getText("LABEL_2951"),	// 2951:출근시간선택
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("LABEL_0037"),	// 37:선택
				press : oController.onConfirmIntimeDialog
			}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  oBundleText.getText("LABEL_0071"),	// 71:취소
				press : oController.onCloseIntimeDialog
			}),
			content : [oLayout]
		}).setModel(oJSonModel);
		oDialog.bindElement("/Data");
		
		oDialog.addStyleClass("sapUiSizeCompact");
		return oDialog;
	}

});