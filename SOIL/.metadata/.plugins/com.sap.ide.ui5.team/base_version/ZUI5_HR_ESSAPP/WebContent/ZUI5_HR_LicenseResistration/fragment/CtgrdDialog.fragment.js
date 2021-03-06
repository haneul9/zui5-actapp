sap.ui.jsfragment("ZUI5_HR_LicenseResistration.fragment.CtgrdDialog", {
	
	_colModel : [
		{id: "Key", label : "Code", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "25%"},
		{id: "Value", label : "Name", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "75%", align : sap.ui.core.TextAlign.Begin}
	],
	
	createContent : function(oController) {
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_CtgrdDialog", {
			content : [
				this.getSearchFilter(oController),
				new sap.ui.core.HTML({
					content : "<div style='height : 11px;'/>"
				}),
				this.getResultTableRender(oController)
			],
			contentWidth : "600px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0242"),	// 242:등급
			beginButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0037"), 	// 37:선택
				press : oController.onSelectCtgrd
			}),
			endButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0071"), 	// 71:취소
				press : function(oEvent){
					sap.ui.getCore().byId(oController.PAGEID + "_SearchCtgrdInput").setValue("");
					
					oController._DetailJSonModel.setProperty("/Data/Ctgrd", undefined);
					oController._DetailJSonModel.setProperty("/Data/Ctgrdt", undefined);
					
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
								new sap.m.Input(oController.PAGEID + "_SearchCtgrdInput", {
									change : oController.onSearchCtgrd
								}),
								new sap.m.Button({
									icon : "sap-icon://search",
									type : sap.m.ButtonType.Emphasized,
									press : oController.onSearchCtgrd
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
	getResultTableRender : function(oController) {
		jQuery.sap.require("common.ZHR_TABLES");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_CtgrdTable", {
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
		.setModel(oController._CtgrdTableJSonModel)
		.bindRows("/Data");
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTable = sap.ui.getCore().byId("ZUI5_HR_LicenseResistrationDetail_CtgrdTable");
				
				oTable.clearSelection();
				oTable.bindRows("/Data");
			}
		});
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
		return oTable;
	}
	
});