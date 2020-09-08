sap.ui.jsfragment("ZUI5_HR_VacationDispatchChange.fragment.ApplyHistory", {
	
	_HistoryColModel : [
		{id: "Idx", label : "No", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "ZreqForx", label : oBundleText.getText("LABEL_0758"), plabel : "", span : 0, type : "string", sort : true, filter : true},	// 758:신청서유형
		{id: "Begda", label : oBundleText.getText("LABEL_0042"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "120px"},	// 42:시작일
		{id: "Endda", label : oBundleText.getText("LABEL_0065"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "120px"},	// 65:종료일
		{id: "Aptxt", label : oBundleText.getText("LABEL_0763"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "150px"},	// 763:휴가
		{id: "Useday", label : oBundleText.getText("LABEL_2369"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "120px"}	// 2369:휴가일수
		
	],
	
	createContent : function(oController) {
		jQuery.sap.require("common.ZHR_TABLES");
		
		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(this._HistoryColModel);
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_HistoryMatrix",{
			columns : 4,
			widths : ['120px','360px','120px','570px'],
			width : "auto"
		});
		
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "40px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0111"),	// 111:대상자
						required : true
					}).addStyleClass("Font14px FontBold FontColor3")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : [
						new sap.m.Text({
							text : "{Ename}"
						}).addStyleClass("Font14px FontColor3")
					]
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_2368"),	// 2368:휴가일
						required : true
					}).addStyleClass("Font14px FontBold FontColor3")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [
							new sap.m.DatePicker({
						    	valueFormat : "yyyy-MM-dd",
						    	displayFormat : "yyyy.MM.dd",
						    	value : "{Begda}",
						    	width : "150px",
						    }).addStyleClass("Font14px FontColor3"),
							new sap.m.Text({text : "~" , textAlign : "Center"}).addStyleClass("Font14px FontColor3"),
							new sap.m.DatePicker({
						    	valueFormat : "yyyy-MM-dd",
						    	displayFormat : "yyyy.MM.dd",
						    	value : "{Endda}",
						    	width : "150px",
						    }).addStyleClass("Font14px FontColor3"),
						    new sap.m.Button({
								text: oBundleText.getText("LABEL_0064"),	// 64:조회
								type : sap.m.ButtonType.Emphasized,
								icon : "sap-icon://search",
								press : oController.onPressSearchHistory ,
							})
						]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData"),
			]
		});
		
		oMatrix.addRow(oRow);
		oMatrix.setModel(new sap.ui.model.json.JSONModel());
		oMatrix.bindElement("/Data");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_HistoryTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
//			columnHeaderHeight : 35,
			visibleRowCount : 10,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.Multitoggle,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			extension : new sap.m.Toolbar({ 
				content : [
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onHistoryExport
					})
				]
			}).addStyleClass("ToolbarNoBottomLine"),
		})
		.setModel(new sap.ui.model.json.JSONModel())
		.bindRows("/Data");
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._HistoryColModel);
		
		var oDialog = new sap.m.Dialog({
			content : [
				oMatrix,
				new sap.ui.core.HTML({
					content : "<div style='height : 11px;'/>"
				}),
				oTable
			],
			contentWidth : "1200px",
			afterOpen : oController.onPressSearchHistory,
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
		
	}
	
});