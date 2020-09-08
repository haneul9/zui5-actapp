sap.ui.jsfragment("ZUI5_HR_LoanList.fragment.List2", {
	
	createContent : function(oController) {
		
		var oButtons = new sap.ui.commons.layout.HorizontalLayout({
			width : "100%",
			content : [
				new sap.ui.commons.Button({
					text : oBundleText.getText("LABEL_1848"),	// 1848:상환내역
					styled : false,
					width : "90px",
					press : oController.onPressList1
				}).addStyleClass("L2PFontFamily SelectButton1"),
				new sap.ui.core.HTML({content : "<div>&nbsp;</div>"}),
				new sap.ui.commons.Button({
					text : oBundleText.getText("LABEL_0117"),	// 117:상세내역
					styled : false,
					width : "90px",
				//	press : oController.onPressList2
				}).addStyleClass("L2PFontFamily SelectButton2")
			]
		});
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_List2", {
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
		
		var col_info1 = [
			{id: "RpamtMon", label : oBundleText.getText("LABEL_1997"), plabel : "", span : 0, type : "money", sort : true, filter : true, align : "End"},	// 1997:월상환액
			 {id: "RpamtLst", label : oBundleText.getText("LABEL_2230"), plabel : "", span : 0, type : "money", sort : true, filter : true, align : "End"},	// 2230:최종월상환액
			 {id: "Lnrte", label : oBundleText.getText("LABEL_2021"), plabel : "", span : 0, type : "string", sort : true, filter : true},	// 2021:이자율(%)
			 {id: "Hostytx", label : oBundleText.getText("LABEL_1833"), plabel : "", span : 0, type : "string", sort : true, filter : true},	// 1833:사택거주여부
			 {id: "Asmtdtx", label : oBundleText.getText("LABEL_1762"), plabel : "", span : 0, type : "string", sort : true, filter : true},	// 1762:보증방법
			 {id: "Asiid", label : oBundleText.getText("LABEL_1763"), plabel : "", span : 0, type : "string", sort : true, filter : true},	// 1763:보증보험번호
			 {id: "Aspnrnm", label : oBundleText.getText("LABEL_1764"), plabel : "", span : 0, type : "string", sort : true, filter : true},	// 1764:보증인
			 {id: "Astel", label : oBundleText.getText("LABEL_1765"), plabel : "", span : 0, type : "string", sort : true, filter : true},	// 1765:보증인연락처
			 {id: "Asrsn", label : oBundleText.getText("LABEL_1766"), plabel : "", span : 0, type : "string", sort : true, filter : true}];	// 1766:보증인주민번호
		common.ZNK_TABLES.makeColumn(oController, oTable, col_info1);
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [ oButtons, new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}), oTable ]
		}).addStyleClass("sapUiSizeCompact");

		return oLayout;

	
	}
});