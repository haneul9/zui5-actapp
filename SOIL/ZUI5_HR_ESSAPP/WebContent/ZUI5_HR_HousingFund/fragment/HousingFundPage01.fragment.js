sap.ui.jsfragment("ZUI5_HR_HousingFund.fragment.HousingFundPage01", {
	
	_colModel : [
		{id: "Number", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Lonid", label : oBundleText.getText("LABEL_0408"), plabel : oBundleText.getText("LABEL_0408"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "150px"},	// 408:대출번호
		{id: "Paper", label : oBundleText.getText("LABEL_0220"), plabel : oBundleText.getText("LABEL_0220"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 220:기준년월
		{id: "Repseq", label : oBundleText.getText("LABEL_1850"), plabel : oBundleText.getText("LABEL_1850"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 1850:상환번호
		{id: "Pygbnt", label : oBundleText.getText("LABEL_0300"), plabel : oBundleText.getText("LABEL_0300"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 300:구분
		{id: "Apamt", label : oBundleText.getText("LABEL_0081"), plabel : oBundleText.getText("LABEL_0081"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 81:신청금액
		{id: "LnamtCpn", label : oBundleText.getText("LABEL_0407"), plabel : oBundleText.getText("LABEL_2347"), resize : false, span : 3, type : "string", sort : true, filter : true,width : "120px"},	// 407:대출금액, 2347:회사대출금
		{id: "LnamtFun", label : "", plabel : oBundleText.getText("LABEL_1807"), resize : false, span : 0, type : "string", sort : true, filter : true,width : "120px"},	// 1807:사내복지기금
		{id: "LnamtBnk", label : "", plabel : oBundleText.getText("LABEL_0415"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 415:은행
		{id: "Paymm", label : oBundleText.getText("LABEL_1914"), plabel : oBundleText.getText("LABEL_1914"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "120px"},	// 1914:실대출일자
		{id: "Duemm", label : oBundleText.getText("LABEL_1689"), plabel : oBundleText.getText("LABEL_1689"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "120px"},	// 1689:대출만료일
		{id: "RpamtCpn", label : oBundleText.getText("LABEL_1996"), plabel : oBundleText.getText("LABEL_2347"), resize : false, span : 3, type : "string", sort : false, filter : false, width : "120px"},	// 1996:원금 상환액, 2347:회사대출금
		{id: "RpamtFun", label : "", plabel : oBundleText.getText("LABEL_1807"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 1807:사내복지기금
		{id: "RpamtBnk2", label : "", plabel : oBundleText.getText("LABEL_0415"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 415:은행
		{id: "InamtCpn", label : oBundleText.getText("LABEL_0416"), plabel : oBundleText.getText("LABEL_0423"), resize : false, span : 4, type : "string", sort : true, filter : true, width : "120px"},	// 416:이자, 423:회사
		{id: "InamtFun", label : "", plabel : oBundleText.getText("LABEL_1604"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 1604:기금
		{id: "InamtBnk3", label : "", plabel : oBundleText.getText("LABEL_2009"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 2009:은행(개인부담)
		{id: "InamtBnk5", label : "", plabel : oBundleText.getText("LABEL_2010"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 2010:은행(회사부담)
		{id: "LnrteAcp", label : oBundleText.getText("LABEL_2045"), plabel : oBundleText.getText("LABEL_2045"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "120px"},	// 2045:인정이자율
		{id: "InamtAcp", label : oBundleText.getText("LABEL_2044"), plabel : oBundleText.getText("LABEL_2044"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 2044:인정이자
		{id: "AfamtCpn", label : oBundleText.getText("LABEL_1847"), plabel : oBundleText.getText("LABEL_0423"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "120px"},	// 423:회사, 1847:상환 후 잔액
		{id: "AfamtFun", label : "", plabel : oBundleText.getText("LABEL_1604"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 1604:기금
		{id: "AfamtBnk", label : "", plabel : oBundleText.getText("LABEL_0415"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 415:은행
		{id: "Inend", label : oBundleText.getText("LABEL_0225"), plabel : oBundleText.getText("LABEL_0225"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "120px"},	// 225:상환일
		{id: "AfamtSum", label : oBundleText.getText("LABEL_2081"), plabel : oBundleText.getText("LABEL_2081"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "120px"},	// 2081:잔액합계
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
								new sap.m.Text({
									text : oBundleText.getText("LABEL_1463")	// 1463:개인별 주택자금 조회
								}).addStyleClass("Font18px FontColor0"),
								new sap.m.ToolbarSpacer()
							]
						}).addStyleClass("ToolbarNoBottomLine")
					})
				]
			}),
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
			fixedColumnCount : 6,
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
			}).addStyleClass("ToolbarNoBottomLine")
		}).setModel(oController._ListJSonModel)
		.bindRows("/Data");
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_HousingFundList_Table-header-fixed-fixrow > tbody',
					colIndexes : [0, 1, 2, 3, 4, 5]
				});

				common.Common.generateRowspan({
					selector : '#ZUI5_HR_HousingFundList_Table-header > tbody',
					colIndexes : [3, 4, 12, 13, 17, 18]
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
	},
	
	
//	createContent : function(oController) {
//		jQuery.sap.require("common.Common");
//		jQuery.sap.require("common.ZHR_TABLES");
//		
//		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
//			enableColumnReordering : false,
//			enableColumnFreeze : false,
//			columnHeaderHeight  : 30,
//			showNoData : true,
//			selectionMode: sap.ui.table.SelectionMode.None,
//			showOverlay : false,
//			enableBusyIndicator : true,
//			noData : "No data found",
//			fixedColumnCount : 6,
//			extension : new sap.m.Toolbar({ 
//				content : [
//					new sap.m.Text({
//						text : oBundleText.getText("LABEL_0016")	// 내역
//					}).addStyleClass("L2PFontFamilyBold"),
//					new sap.m.ToolbarSpacer(),
//					new sap.ui.core.Icon({
//						src : "sap-icon://excel-attachment",
//						size : "1.0rem", 
//						color : "#002060",
//						press : oController.onExport
//					}).addStyleClass("L2PPointer")
//				]
//			}).addStyleClass("L2PToolbarNoBottomLine"),
//		}).setModel(oController._ListJSonModel)
//		.bindRows("/Data");
//		
//		oTable.addEventDelegate({
//			onAfterRendering: function() {
//				var oTds = $("td[colspan]");
//				for(i=0; i<oTds.length; i++) {
//					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
//				}
//				
//				common.Common.generateRowspan({
//					selector : '#ZUI5_HR_HousingFundList_Table-header-fixed-fixrow > tbody',
//					colIndexes : [0, 1, 2, 3, 4, 5]
//				});
//
//				common.Common.generateRowspan({
//					selector : '#ZUI5_HR_HousingFundList_Table-header > tbody',
//					colIndexes : [3, 4, 12, 13, 17, 18]
//				});
//			}
//		});
//		
//		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
//		
//		return oTable;	
//	}
});