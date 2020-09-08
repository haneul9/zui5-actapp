sap.ui.jsfragment("ZUI5_HR_DeductionChangeRegistration.fragment.DedcdDialog", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "4%"},
		{id: "Dedtx", label : oBundleText.getText("LABEL_0439"), plabel : "", span : 0, type : "string", sort : true, filter : true, align : sap.ui.core.TextAlign.Begin},	// 439:공제명
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "10%"},	// 31:사번
		{id: "Emftx", label : oBundleText.getText("LABEL_1271"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "11%"},	// 1271:사유발생자
		{id: "Orgtx", label : oBundleText.getText("LABEL_0039"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "17%", align : sap.ui.core.TextAlign.Begin},	// 39:소속부서
		{id: "Dedgbtx", label : oBundleText.getText("LABEL_0446"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "10%"},	// 446:변동/고정
		{id: "Begda", label : oBundleText.getText("LABEL_0042"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "11%"},	// 42:시작일
		{id: "Endda", label : oBundleText.getText("LABEL_0065"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "11%"}	// 65:종료일
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
					oController._DetailJSonModel.setProperty("/Data/Dpernr", undefined);
					oController._DetailJSonModel.setProperty("/Data/Dename", undefined);
					oController._DetailJSonModel.setProperty("/Data/Dorgtx", undefined);
					
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
//			columnHeaderHeight : 35,
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
				var oTable = sap.ui.getCore().byId("ZUI5_HR_DeductionChangeRegistrationDetail_DedcdTable");
				
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