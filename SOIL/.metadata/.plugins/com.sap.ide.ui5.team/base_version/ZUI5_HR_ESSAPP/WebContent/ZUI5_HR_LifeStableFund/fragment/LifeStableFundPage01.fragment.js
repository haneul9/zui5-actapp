sap.ui.jsfragment("ZUI5_HR_LifeStableFund.fragment.LifeStableFundPage01", {
	
	_colModel : [
		{id: "Number", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Paper", label : oBundleText.getText("LABEL_0220"), plabel : oBundleText.getText("LABEL_0220"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 220:기준년월
		{id: "LnamtTot", label : oBundleText.getText("LABEL_0222"), plabel : oBundleText.getText("LABEL_0222"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "100px", align : sap.ui.core.TextAlign.End},	// 222:대출총액
		{id: "RqamtMon", label : oBundleText.getText("LABEL_0223"), plabel : oBundleText.getText("LABEL_0223"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "100px", align : sap.ui.core.TextAlign.End},	// 223:상환액
		{id: "Lnrte", label : oBundleText.getText("LABEL_0089"), plabel : oBundleText.getText("LABEL_0089"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "100px", align : sap.ui.core.TextAlign.End},	// 89:이자율
		{id: "RqintMon", label : oBundleText.getText("LABEL_0224"), plabel : oBundleText.getText("LABEL_0224"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "100px", align : sap.ui.core.TextAlign.End},	// 224:상환이자
		{id: "Count", label : oBundleText.getText("LABEL_0226"), plabel : oBundleText.getText("LABEL_0226"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "100px", align : sap.ui.core.TextAlign.End},	// 226:상환횟수
		{id: "LmblnTot", label : oBundleText.getText("LABEL_0229"), plabel : oBundleText.getText("LABEL_0229"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "100px", align : sap.ui.core.TextAlign.End},	// 229:잔액
		{id: "Paydt", label : oBundleText.getText("LABEL_0225"), plabel : oBundleText.getText("LABEL_0225"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "120px"},	// 225:상환일
		{id: "Louset", label : oBundleText.getText("LABEL_0228"), plabel : oBundleText.getText("LABEL_0221"), resize : false, span : 6, type : "string", sort : true, filter : true,width : "120px"},	// 221:대출용도, 228:신규대출
		{id: "Lorsnt", label : "", plabel : oBundleText.getText("LABEL_0078"), resize : false, span : 0, type : "string", sort : true, filter : true,width : "120px"},	// 78:세부사유
		{id: "Slrsn", label : "", plabel : oBundleText.getText("LABEL_0032"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 32:사유
		{id: "Apdat", label : "", plabel : oBundleText.getText("LABEL_0049"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "120px"},	// 49:신청일
		{id: "Paymm", label : "", plabel : oBundleText.getText("LABEL_0230"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "120px"},	// 230:지급일
		{id: "Apamt", label : "", plabel : oBundleText.getText("LABEL_0081"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px", align : sap.ui.core.TextAlign.End},	// 81:신청금액
		{id: "LousetAdd", label : oBundleText.getText("LABEL_0231"), plabel : oBundleText.getText("LABEL_0221"), resize : false, span : 6, type : "string", sort : true, filter : true,width : "120px"},	// 221:대출용도, 231:추가대출
		{id: "LorsntAdd", label : "", plabel : oBundleText.getText("LABEL_0078"), resize : false, span : 0, type : "string", sort : true, filter : true,width : "120px"},	// 78:세부사유
		{id: "SlrsnAdd", label : "", plabel : oBundleText.getText("LABEL_0032"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 32:사유
		{id: "ApdatAdd", label : "", plabel : oBundleText.getText("LABEL_0049"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "120px"},	// 49:신청일
		{id: "PaymmAdd", label : "", plabel : oBundleText.getText("LABEL_0230"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "120px"},	// 230:지급일
		{id: "ApamtAdd", label : "", plabel : oBundleText.getText("LABEL_0081"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px", align : sap.ui.core.TextAlign.End}	// 81:신청금액
	],
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.ZHR_TABLES");
		
		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(this._colModel);
		
		return new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 3,
			widths : ["20px", "",  "20px"],
			width : "100%",
			rows : [
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell(),
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : new sap.ui.commons.layout.VerticalLayout({
								width : "100%",
								content : [ 
									new sap.ui.core.HTML({ content : "<div style='height : 20px;'/>" }),
									this.getTitleLayoutRender(oController),
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
									this.getListTableRender(oController)
								]
							})
							.addStyleClass("sapUiSizeCompact")
						})
					]
				})
			]
		});
	},
	
	/**
	 * 타이틀 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getTitleLayoutRender : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							height : "20px",
							content : [ 
								new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_A.png"}),
								new sap.m.Text({text : oBundleText.getText("LABEL_0227") }).addStyleClass("Font18px FontColor0"),	// 227:생활안정자금 조회
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
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Toolbar(oController.PAGEID + "_ManualToolbar", {}).addStyleClass("ToolbarNoBottomLine NoMarginLeft"),
								new sap.m.ToolbarSpacer()
							]
						}).addStyleClass("ToolbarNoBottomLine NoMarginLeft")
					})
				]
			})
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 1,
			width : "100%",
			rows : aRows
		});
	},
	
	/**
	 * 목록테이블 rendering
	 * 
	 * @param oController
	 * @return sap.m.IconTabBar
	 */
	getListTableRender : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
//			columnHeaderHeight  : 30,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			fixedColumnCount : 9,
			extension : new sap.m.Toolbar({ 
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0016")	// 내역
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onExport
					})
				]
			}).addStyleClass("ToolbarNoBottomLine"),
		})
		.setModel(oController._ListJSonModel)
		.bindRows("/Data");
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_LifeStableFundList_Table-header-fixed-fixrow > tbody',
					colIndexes : [0, 1, 2, 3, 4, 5, 6, 7, 8]
				});
				
				var _thisTable = this,
					oBinding = this.getBinding("rows");
				
				oBinding.attachChange(function(oEvent) {
					var oSource = oEvent.getSource();
					var oLength = oSource.getLength();
	
					if(oLength > 0) _thisTable.setVisibleRowCount(oLength > 15 ? 15 : oLength);
				});
			}
		}, oTable);
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
		return new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			rows : [
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : oTable
						})
					]
				})
			]
		});
	}
});