sap.ui.jsfragment("ZUI5_HR_DomesticBTripChange.fragment.ApplyHistory", {
	
	_HistoryColModel : [
		{id: "Idx", label : "No", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Docno", label : oBundleText.getText("LABEL_1230"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "150px"},	// 1230:출장명령번호
		{id: "Period", label : oBundleText.getText("LABEL_1204"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "200px"},	// 1204:기간
		{id: "Busin", label : oBundleText.getText("LABEL_1210"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "200px"},	// 1210:용무
		{id: "Slotx", label : oBundleText.getText("LABEL_1211"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "150px"},	// 1211:출발지
		{id: "Elotx", label : oBundleText.getText("LABEL_1206"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "150px"},	// 1206:도착지
	],
	
	createContent : function(oController) {
		jQuery.sap.require("common.ZHR_TABLES");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_HistoryTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			visibleRowCount : 10,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.Multitoggle,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
		})
		.setModel(new sap.ui.model.json.JSONModel())
		.bindRows("/Data");
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._HistoryColModel);
		
		var oDialog = new sap.m.Dialog({
			content : [
				new sap.ui.core.HTML({
					content : "<div style='height : 11px;'/>"
				}),
				this.getFilterLayoutRender(oController),
				new sap.ui.core.HTML({
					content : "<div style='height : 20px;'/>"
				}),
				oTable
			],
			showHeader : true,
			title : oBundleText.getText("LABEL_0881"),	// 881:신청서 내역 조회
			buttons : [
					new sap.m.Button({
						text : oBundleText.getText("LABEL_0037"), 	// 37:선택
						press : oController.onSelectHistory,
				    }),
					new sap.m.Button({
					text : oBundleText.getText("LABEL_0017"),  // 17:닫기
					press : function(oEvent){
						oDialog.close();
					}
				})]
		});
		
		oDialog.bindElement("/Data");
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
		
	},
	
	/**
	 * 검색필터 rendering
	 * 
	 * @param oController
	 * @return sap.ui.layout.HorizontalLayout
	 */
	getFilterLayoutRender : function(oController) {
		var oFilterLayout = new sap.m.Toolbar({	
			height : "45px",
			content : [new sap.m.ToolbarSpacer({width : "20px"}),
					   new sap.m.Text({text : "출장 시작일"}).addStyleClass("Font14px FontBold FontColor3"),	// 674:시작일자
					   new sap.m.ToolbarSpacer({width : "10px"}),
					   new sap.m.DatePicker(oController.PAGEID + "_HistoryBegtr", {
							valueFormat : "yyyy-MM-dd",
				            displayFormat : "yyyy.MM.dd",
							width : "150px",
					   }).addStyleClass("Font14px FontColor6"),
					   new sap.m.ToolbarSpacer({width : "20px"}),
					   new sap.m.Text({text : "출장 종료일"}).addStyleClass("Font14px FontBold FontColor3"),	// 19:대상자 성명
					   new sap.m.ToolbarSpacer({width : "10px"}),
					   new sap.m.DatePicker(oController.PAGEID + "_HistoryEndtr", {
							valueFormat : "yyyy-MM-dd",
				            displayFormat : "yyyy.MM.dd",
							width : "150px",
						}).addStyleClass("Font14px FontColor6"),
					   new sap.m.ToolbarSpacer(),
					   new sap.m.Button({
							text: oBundleText.getText("LABEL_0002"),
							icon : "sap-icon://search",
							type : sap.m.ButtonType.Emphasized,
							press : oController.onPressSearchHistory ,
					   }),
					   new sap.m.ToolbarSpacer({width : "20px"}),					   
					   ]
		}).setModel(oController._ListCondJSonModel)
		 .bindElement("/Data")
		 .addStyleClass("FilterLayout");
		
		return oFilterLayout;
	},
	
});