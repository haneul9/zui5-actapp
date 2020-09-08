sap.ui.jsfragment("ZUI5_HR_EndCompanyHousingSupport.fragment.History", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.ZHR_TABLES");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_HistoryTable", {
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
		.setModel(oController._HistoryJSonModel)
		.bindRows("/Data");
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTable = sap.ui.getCore().byId("ZUI5_HR_EndCompanyHousingSupportDetail_HistoryTable");
				
				oTable.getColumns().forEach(function(elem) {
					elem.setSorted(false);
					elem.setFiltered(false);
				});
				
				oTable.clearSelection();
				oTable.bindRows("/Data");
			}
		});
		
		var colModel = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "4%"},
			{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 31:사번
			{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 38:성명
			{id: "Nhsyn", label : oBundleText.getText("LABEL_0367"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "12%"},	// 367:통근지역내\n무주택여부
			{id: "Hslyn", label : oBundleText.getText("LABEL_0366"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "12%"},	// 366:주택자금\n대출여부
			{id: "Hstyptx", label : oBundleText.getText("LABEL_0300"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 300:구분
			{id: "Conbg", label : oBundleText.getText("LABEL_0364"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "12%"},	// 364:임 차\n시작일
			{id: "Coned", label : oBundleText.getText("LABEL_0365"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "12%"},	// 365:임 차\n종료일
			{id: "Aprsn", label : oBundleText.getText("LABEL_0323"), plabel : "", span : 0, type : "string", sort : true, filter : true}	// 323:신청사유
		];
		
		common.ZHR_TABLES.makeColumn(oController, oTable, colModel);
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_HistoryDialog", {
			content : [
				oTable
			],
			contentWidth : "1100px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0047"),	// 47:신청내역
			beginButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0037"), 	// 37:선택
				press : oController.onSelectHistory
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