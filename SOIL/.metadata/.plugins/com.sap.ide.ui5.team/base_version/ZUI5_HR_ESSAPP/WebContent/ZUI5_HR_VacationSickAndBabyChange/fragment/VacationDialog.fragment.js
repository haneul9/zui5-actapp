sap.ui.jsfragment("ZUI5_HR_VacationSickAndBabyChange.fragment.VacationDialog", {

	createContent : function(oController) {	
		var oJSonModel = new sap.ui.model.json.JSONModel();
		oJSonModel.setData({Data : {}});
		
		var colModel = [
			{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "50px"},
			{id: "ZreqForx", label : oBundleText.getText("LABEL_0758"), plabel : oBundleText.getText("LABEL_0758"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "140px"},	// 758:신청서유형
			{id: "ZreqDate", label : oBundleText.getText("LABEL_0049"), plabel : oBundleText.getText("LABEL_0049"), resize : false, span : 0, type : "date", sort : true, filter : false, width : "100px"},	// 49:신청일
			{id: "Apperid", label : oBundleText.getText("LABEL_0050"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번, 50:신청자
			{id: "Apename", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 38:성명
			{id: "Aporgtx", label : "", plabel : oBundleText.getText("LABEL_0028"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : "Begin"},	// 28:부서
			{id: "Perid", label : oBundleText.getText("LABEL_0111"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번, 111:대상자
			{id: "Ename", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 38:성명
			{id: "Orgtx", label : "", plabel : oBundleText.getText("LABEL_0028"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : "Begin"},	// 28:부서
			{id: "ZappTitl", label : oBundleText.getText("LABEL_0761"), plabel : oBundleText.getText("LABEL_0761"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "250px", align : "Begin"},	// 761:제목
			{id: "Appno", label : oBundleText.getText("LABEL_0757"), plabel : oBundleText.getText("LABEL_0757"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "140px"}	// 757:신청서ID
		];
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_VacationTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			fixedColumnCount : 3,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
		})
		.setModel(new sap.ui.model.json.JSONModel())
		.bindRows("/Data");
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTable = sap.ui.getCore().byId("ZUI5_HR_VacationSickAndBabyChangeDetail_VacationTable");
				
				oTable.getColumns().forEach(function(elem) {
					elem.setSorted(false);
					elem.setFiltered(false);
				});
				
				oTable.clearSelection();
				oTable.bindRows("/Data");
			}
		});
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_VacationSickAndBabyChangeDetail_VacationTable-header-fixed-fixrow > tbody',
					colIndexes : [0, 1, 2]
				});

				common.Common.generateRowspan({
					selector : '#ZUI5_HR_VacationSickAndBabyChangeDetail_VacationTable-header > tbody',
					colIndexes : [6, 7]
				});
			}
		});
		
		common.ZHR_TABLES.makeColumn(oController, oTable, colModel);
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [
				oTable 
			]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_VacationDialog", {
			contentWidth : "1100px",
//			contentHeight : "500px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0756"),	// 756:신청서 내역조회
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("LABEL_0037"),	// 37:선택
				press : oController.onConfirmVacationDialog
			}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  oBundleText.getText("LABEL_0071"),	// 71:취소
				press : oController.onCloseVacationDialog
			}),
			content : [oLayout]
		}).setModel(oJSonModel);
		oDialog.bindElement("/Data");
		
		oDialog.addStyleClass("sapUiSizeCompact");
		return oDialog;
	}

});