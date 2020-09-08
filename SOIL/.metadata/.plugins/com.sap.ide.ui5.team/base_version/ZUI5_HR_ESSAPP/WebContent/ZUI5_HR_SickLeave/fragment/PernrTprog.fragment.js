sap.ui.jsfragment("ZUI5_HR_SickLeave.fragment.PernrTprog", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.ZHR_TABLES");
		
		var oPernrTprogMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
		
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0015"),	// 기준일
						required : true
					}).addStyleClass("Font14px FontBold FontColor3")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : [
						new sap.m.Text({
							text : "{Datum}"
						}).addStyleClass("Font14px FontColor3")
					]
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0013"),	// 근무형태
						required : true
					}).addStyleClass("Font14px FontBold FontColor3")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : [
						new sap.m.Text({
							text : "{Rtext}"
						}).addStyleClass("Font14px FontColor3")
					]
				}).addStyleClass("MatrixData")
			]
		});
		
		oPernrTprogMatrix.addRow(oRow);
		oPernrTprogMatrix.setModel(oController._TprogJSonModel);
		oPernrTprogMatrix.bindElement("/Data");
		
		var oTprogTable = new sap.ui.table.Table(oController.PAGEID + "_TprogTable", {
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
		.setModel(oController._TprogTableJSonModel)
		.bindRows("/Data");
		
		var tprogColModel = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "10%"},
			{id: "Datum", label : oBundleText.getText("LABEL_0057"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "30%"},	// 57:일자
			{id: "Week", label : oBundleText.getText("LABEL_0054"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "25%"},	// 54:요일
			{id: "Ttext", label : oBundleText.getText("LABEL_0006"), plabel : "", span : 0, type : "string", sort : true, filter : true}	// 근무일정
		];
		
		common.ZHR_TABLES.makeColumn(oController, oTprogTable, tprogColModel);
		
		var oTprogDialog = new sap.m.Dialog(oController.PAGEID + "_PernrTprogDialog", {
			content : [
				oPernrTprogMatrix,
				new sap.ui.core.HTML({
					content : "<div style='height : 11px;'/>"
				}),
				oTprogTable
			],
			contentWidth : "800px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0006"),	// 근무일정
			endButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0017"),  // 17:닫기
				press : function(oEvent){
					oTprogDialog.close();
				}
			})
		});
		
		oTprogDialog.bindElement("/Data");
		oTprogDialog.addStyleClass("sapUiSizeCompact");
		
		return oTprogDialog;
		
	}
	
});