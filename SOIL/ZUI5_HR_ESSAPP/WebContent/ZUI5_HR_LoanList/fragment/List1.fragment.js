sap.ui.jsfragment("ZUI5_HR_LoanList.fragment.List1", {
	
	createContent : function(oController) {
		
		var oButtons = new sap.ui.commons.layout.HorizontalLayout({
			width : "100%",
			content : [
				new sap.ui.commons.Button({
					text : oBundleText.getText("LABEL_1848"),	// 1848:상환내역
					styled : false,
					width : "90px",
				//	press : oController.onPressList1
				}).addStyleClass("L2PFontFamily SelectButton2"),
				new sap.ui.core.HTML({content : "<div>&nbsp;</div>"}),
				new sap.ui.commons.Button({
					text : oBundleText.getText("LABEL_0117"),	// 117:상세내역
					styled : false,
					width : "90px",
					press : oController.onPressList2
				}).addStyleClass("L2PFontFamily SelectButton1")
			]
		});
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_List1", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			visibleRowCount : 1,
			noData : "No data found"
		});
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");	
		
		var col_info1 = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "6%"},
						 {id: "Rpdat", label : oBundleText.getText("LABEL_0225"), plabel : "", span : 0, type : "date", sort : true, filter : true},	// 225:상환일
						 {id: "Rpprn", label : oBundleText.getText("LABEL_1851"), plabel : "", span : 0, type : "money", sort : true, filter : true, align : "End"},	// 1851:상환원금
						 {id: "Rpint", label : oBundleText.getText("LABEL_0224"), plabel : "", span : 0, type : "money", sort : true, filter : true, align : "End"},	// 224:상환이자
						 {id: "Rpmtd", label : oBundleText.getText("LABEL_1849"), plabel : "", span : 0, type : "string", sort : true, filter : true}];	// 1849:상환방법
		common.ZNK_TABLES.makeColumn(oController, oTable, col_info1);
		
		oTable.setWidth("50%");
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [ oButtons, new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}), oTable ]
		}).addStyleClass("sapUiSizeCompact");

		return oLayout;

	
	}
});