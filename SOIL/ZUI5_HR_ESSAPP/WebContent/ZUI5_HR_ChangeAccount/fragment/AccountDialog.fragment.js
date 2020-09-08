sap.ui.jsfragment("ZUI5_HR_ChangeAccount.fragment.AccountDialog", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "4%"},
		{id: "Begda", label : oBundleText.getText("LABEL_0042"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "14%"},	// 42:시작일
		{id: "Endda", label : oBundleText.getText("LABEL_0065"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "14%"},	// 65:종료일
		{id: "Stext", label : oBundleText.getText("LABEL_0596"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "22%"},	// 596:계좌종류
		{id: "Banka", label : oBundleText.getText("LABEL_0499"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "22%"},	// 499:은행명
		{id: "Bankn", label : oBundleText.getText("LABEL_0556"), plabel : "", span : 0, type : "string", sort : true, filter : true, align : sap.ui.core.TextAlign.Begin}	// 556:계좌번호
	],
	
	createContent : function(oController) {
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_AccountDialog", {
			content : [
				new sap.ui.core.HTML({
					content : "<div style='height : 11px;'/>"
				}),
				this.getDedcdResultTableRender(oController)
			],
			contentWidth : "950px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0600"),	// 600:은행계좌 현황
			endButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0017"),  // 17:닫기
				press : function(oEvent){
					oDialog.close();
				}
			})
		}).addStyleClass("sapUiSizeCompact");
		
		return oDialog;
	},
	
	/**
	 * 검색테이블 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getDedcdResultTableRender : function(oController) {
		jQuery.sap.require("common.ZHR_TABLES");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_AccountTable", {
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
		.setModel(oController._AccountTableJSonModel)
		.bindRows("/Data");
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTable = sap.ui.getCore().byId("ZUI5_HR_ChangeAccountList_AccountTable");
				
				oTable.getColumns().forEach(function(elem) {
					elem.setSorted(false);
					elem.setFiltered(false);
				});
				
				oTable.clearSelection();
				oTable.bindRows("/Data");
			}
		});
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
		return oTable;
	}
	
});