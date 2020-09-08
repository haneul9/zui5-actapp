sap.ui.jsfragment("ZUI5_HR_OvertimeConfirm.fragment.OuttimeDialog", {

	createContent : function(oController) {	
		var oJSonModel = new sap.ui.model.json.JSONModel();
		oJSonModel.setData({Data : {}});
		
		var colModel = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "6%"},
			{id: "Datum", label : oBundleText.getText("LABEL_0057"), plabel : "", span : 0, type : "date", sort : true, filter : false, width : "21%"},	// 57:일자
			{id: "Outimt", label : oBundleText.getText("LABEL_0568"), plabel : "", span : 0, type : "time", sort : true, filter : true, width : "22%"},	// 568:퇴근시간
			{id: "Ouplc", label : oBundleText.getText("LABEL_0570"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "30%"},	// 570:퇴근장소
			{id: "Oudat", label : oBundleText.getText("LABEL_0569"), plabel : "", span : 0, type : "date", sort : true, filter : false, width : "21%"}	// 569:퇴근일
		];
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_OuttimeTable", {
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
				var oTable = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirmDetail_OuttimeTable");
				
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
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_OuttimeDialog", {
			contentWidth : "700px",
			contentHeight : "450px",
			showHeader : true,
			title : oBundleText.getText("LABEL_2952"),	// 2952:퇴근시간선택
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("LABEL_0037"),	// 37:선택
				press : oController.onConfirmOuttimeDialog
			}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  oBundleText.getText("LABEL_0071"),	// 71:취소
				press : oController.onCloseOuttimeDialog
			}),
			content : [oLayout]
		}).setModel(oJSonModel);
		oDialog.bindElement("/Data");
		
		oDialog.addStyleClass("sapUiSizeCompact");
		return oDialog;
	}

});