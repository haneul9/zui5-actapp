sap.ui.jsfragment("ZUI5_HR_DeductionItem.fragment.DedcdDialog", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "4%"},
		{id: "Dedtx", label : oBundleText.getText("LABEL_0439"), plabel : "", span : 0, type : "string", sort : true, filter : true, align : sap.ui.core.TextAlign.Begin},	// 439:공제명
		{id: "Dedgbtx", label : oBundleText.getText("LABEL_0446"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "9%"},	// 446:변동/고정
		{id: "Repgbtx", label : oBundleText.getText("LABEL_0452"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "10%"},	// 452:예금주구분
		{id: "Emftx", label : oBundleText.getText("LABEL_0450"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "10%"},	// 450:예금주
		{id: "Paygbtx", label : oBundleText.getText("LABEL_0444"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "11%"},	// 444:급여항목
		{id: "Dedcd", label : oBundleText.getText("LABEL_0442"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "13%"},	// 442:공제항목
		{id: "Begda", label : oBundleText.getText("LABEL_0042"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "12%"},	// 42:시작일
		{id: "Endda", label : oBundleText.getText("LABEL_0065"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "12%"}	// 65:종료일
	],
	
	createContent : function(oController) {
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_DedcdDialog", {
			content : [
				this.getSearchFilter(oController),
				new sap.ui.core.HTML({
					content : "<div style='height : 11px;'/>"
				}),
				this.getDedcdResultTableRender(oController)
			],
			contentWidth : "950px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0438"),	// 438:공제
			beginButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0037"), 	// 37:선택
				press : oController.onSelectDedcd
			}),
			endButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0071"), 	// 71:취소
				press : function(oEvent){
					sap.ui.getCore().byId(oController.PAGEID + "_SearchInput").setValue("");
					
					oController._DetailJSonModel.setProperty("/Data/Dedcd", undefined);
					oController._DetailJSonModel.setProperty("/Data/Dedtx", undefined);
					oController._DetailJSonModel.setProperty("/Data/Memyn", undefined);
					oController._DetailJSonModel.setProperty("/Data/Bankc", undefined);
					oController._DetailJSonModel.setProperty("/Data/Repgb", undefined);
					oController._DetailJSonModel.setProperty("/Data/Bankn", undefined);
					oController._DetailJSonModel.setProperty("/Data/Emftx", undefined);
					oController._DetailJSonModel.setProperty("/Data/Bnkgb", undefined);
					
					oDialog.close();
				}
			})
		}).addStyleClass("sapUiSizeCompact");
		
		return oDialog;
	},
	
	/**
	 * 검색필터 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getSearchFilter : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "10px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 5,
						content : new sap.m.Text({ text : "" })
					})
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 2,
						content : new sap.m.Text({ text : "" })
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input(oController.PAGEID + "_SearchInput", {
									change : oController.onSearchDedcd
								}),
								new sap.m.Button({
									icon : "sap-icon://search",
									type : sap.m.ButtonType.Emphasized,
									press : oController.onSearchDedcd
								}).addStyleClass("PSNCFontFamily")
							]
						})
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 2,
						content : new sap.m.Text({ text : "" })
					})
				]
			})
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			columns : 5,
			widths : [ "20px", "50px", "", "50px", "20px" ],
			rows : aRows
		});
	},
	
	/**
	 * 검색테이블 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getDedcdResultTableRender : function(oController) {
		jQuery.sap.require("common.ZHR_TABLES");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_DedcdTable", {
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
		.setModel(oController._DedcdTableJSonModel)
		.bindRows("/Data");
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTable = sap.ui.getCore().byId("ZUI5_HR_DeductionItemDetail_DedcdTable");
				
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