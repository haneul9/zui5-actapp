sap.ui.jsfragment("ZUI5_HR_SalaryStatement.fragment.SalaryStatementPage02", {
	
	createContent : function(oController) {
		
		return [
			new sap.ui.commons.layout.VerticalLayout({
				width : "100%",
				content : [
					this.getPageAllContentRender(oController)
				] 
			})
			.addStyleClass("sapUiSizeCompact")
			.setModel(oController._DetailJSonModel)
			.bindElement("/Data")
		];
	},
	
	/**
	 * 페이지 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getPageAllContentRender : function(oController) {
		
		var oContents = [
			new sap.ui.core.HTML({content : "<div style='height : 20px;'/>"}),
			this.getTitleRender(oController),										// 타이틀
			new sap.ui.core.HTML({content : "<div style='height : 20px;'/>"}),
			this.getApplyInfoRender(oController),									// 신청항목
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : ["20px", "", "20px"],
			width : "100%",
			rows : $.map(oContents, function(rowData, k) {
				return new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell(),
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : rowData
						}),
						new sap.ui.commons.layout.MatrixLayoutCell()
					]
				})
			})
		});
	},
	
	/**
	 * 제목 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getTitleRender : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							height : "20px",
							content : [
								new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_A.png",}),
								new sap.m.Text(oController.PAGEID + "_DetailTitle", {
									text : oBundleText.getText("LABEL_1592")	// 1592:급여명세서
								}).addStyleClass("Font18px FontColor0"),
								new sap.m.ToolbarSpacer()
							]
						}).addStyleClass("ToolbarNoBottomLine")
					})
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "45px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						vAlign : "Bottom",
						content : 
							new sap.m.Toolbar({
								content : [
									new sap.m.Toolbar(oController.PAGEID + "_ManualToolbar",{}).addStyleClass("ToolbarNoBottomLine NoMarginLeft"),
									new sap.m.ToolbarSpacer(),
									new sap.m.Button({
										text : oBundleText.getText("LABEL_0022"), // 22:뒤로
										press : oController.onBack,
									})
								]
						}).addStyleClass("ToolbarNoBottomLine NoMarginLeft")
					})
				]
			})
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			rows : aRows
		});
	},
	
	
	getApplyInfoRender : function(oController){
//		var oRow, oCell;
//		
//		var oPanel = new sap.m.Panel(oController.PAGEID + "_PDFLayout", {
//			width : "100%"
//		});
//		
//		/////////////////////////////////////////////////////////////		
//		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_PDFLayout",{
//			columns : 1,
//			width : "100%"
//		});
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : [new sap.ui.core.HTML({content : "<div style='height : 15px;'/>"})]
//		});
//		oRow.addCell(oCell);
//		oContentMatrix.addRow(oRow);
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : oPanel
//		});
//		oRow.addCell(oCell);
//		oContentMatrix.addRow(oRow);
					
		return new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_PDFLayout",{
			width : "100%",
		})
		
	},
});