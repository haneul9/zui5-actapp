sap.ui.jsfragment("ZUI5_HR_ChangeShift.fragment.SaveError", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.ZHR_TABLES");
		
		var oMessage = new sap.m.Text({
			text : oBundleText.getText("LABEL_0012")	// 근무편제변경 적용일 이후 일자에 대해 기 신청된 근태, 확정 근태 리스트입니다.\r\n근무편제변경 승인 전 관련 데이터를 확인 및 조치하시기 바랍니다.
		}).addStyleClass("Font14px FontColor3");
		
		var oErrorTable = new sap.ui.table.Table(oController.PAGEID + "_ErrorTable", {
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
		.setModel(oController._ErrorTableJSonModel)
		.bindRows("/Data");
		
		var errorColModel = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "6%"},
			{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "12%"},	// 31:사번
			{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "12%"},	// 38:성명
			{id: "Message", label : oBundleText.getText("LABEL_0016"), plabel : "", span : 0, type : "string", sort : false, filter : false}	// 내역
		];
		
		common.ZHR_TABLES.makeColumn(oController, oErrorTable, errorColModel);
		
		var oErrorDialog = new sap.m.Dialog(oController.PAGEID + "_ErrorDialog", {
			content : [
				oMessage,
				new sap.ui.core.HTML({
					content : "<div style='height : 11px;'/>"
				}),
				oErrorTable
			],
			contentWidth : "800px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0014"),	// 기 신청/확정 근태 내역
			endButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0017"),  // 17:닫기
				press : function(oEvent){
					oErrorDialog.close();
					oController.BusyDialog.close();
				}
			})
		});
		
		oErrorDialog.bindElement("/Data");
		oErrorDialog.addStyleClass("sapUiSizeCompact");
		
		return oErrorDialog;
		
	}
	
});