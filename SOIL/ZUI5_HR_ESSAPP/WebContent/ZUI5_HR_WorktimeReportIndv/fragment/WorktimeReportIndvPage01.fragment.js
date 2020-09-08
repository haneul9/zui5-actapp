sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_WorktimeReportIndv.fragment.WorktimeReportIndvPage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Orgtx", label : oBundleText.getText("LABEL_0028"), plabel : oBundleText.getText("LABEL_0028"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 28:부서
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "70px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "90px"},	// 38:성명
		{id: "Rtext", label : oBundleText.getText("LABEL_0624"), plabel : oBundleText.getText("LABEL_0624"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 624:근무조
		{id: "Wrkjobt", label : oBundleText.getText("LABEL_0010"), plabel : oBundleText.getText("LABEL_0010"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 근무직
		{id: "Wtm01", label : "Week1", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 5, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm02", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm03", label : "", plabel : oBundleText.getText("LABEL_0902"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 902:교육예정
		{id: "Wtm04", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Stat1", label : "", plabel : oBundleText.getText("LABEL_0036"), resize : false, span : 0, type : "StatusIcon", sort : true, filter : true, width : "80px"},	// 36:상태
		{id: "Wtm11", label : "Week2", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 5, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm12", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm13", label : "", plabel : oBundleText.getText("LABEL_0902"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 902:교육예정
		{id: "Wtm14", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Stat2", label : "", plabel : oBundleText.getText("LABEL_0036"), resize : false, span : 0, type : "StatusIcon", sort : true, filter : true, width : "80px"},	// 36:상태
		{id: "Wtm05", label : oBundleText.getText("LABEL_0900"), plabel : oBundleText.getText("LABEL_0900"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End}	// 900:3개월특근가능잔여시간
	],
	
	_colModel2 : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "4%"},
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 38:성명
		{id: "DatumT", label : oBundleText.getText("LABEL_0057"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 57:일자
		{id: "Tprogt", label : oBundleText.getText("LABEL_0671"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "13%", align : sap.ui.core.TextAlign.Begin},	// 671:근무시간
		{id: "A2001t", label : oBundleText.getText("LABEL_0672"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "14%", align : sap.ui.core.TextAlign.Begin},	// 672:근태
		{id: "A2002t", label : oBundleText.getText("LABEL_0587"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "14%", align : sap.ui.core.TextAlign.Begin},	// 587:특근유형
		{id: "Wtm01", label : oBundleText.getText("LABEL_0634"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "7%", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm02", label : oBundleText.getText("LABEL_0629"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "7%", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm03", label : oBundleText.getText("LABEL_0902"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "7%", align : sap.ui.core.TextAlign.End},	// 902:교육예정
		{id: "Wtm04", label : oBundleText.getText("LABEL_0637"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "7%", align : sap.ui.core.TextAlign.End}	// 637:총근로
	],
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.SearchUser1");
		jQuery.sap.require("common.ZHR_TABLES");
		
		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(this._colModel);
		oController._Columns2 = common.Common.convertColumnArrayForExcel(this._colModel2);
		
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
									this.getTitleLayoutRender(oController),									// 타이틀
									new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
									this.getFilterLayoutRender(oController),								// 검색필터
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
									this.getListTableRender(oController),									// 목록
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
									this.getListDetailTableRender(oController)
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
									text : oBundleText.getText("LABEL_0903")	// 903:근로시간 조회(부서별)
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
	 * 검색필터 rendering
	 * 
	 * @param oController
	 * @return sap.ui.layout.HorizontalLayout
	 */
	getFilterLayoutRender : function(oController) {
		var displayYn = (_gAuth == 'E') ? false : true;
		
		return new sap.m.Toolbar({
			height : "45px",
			content : [
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0015")	// 15:기준일
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Datum", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					value : "{Datum}",
					width : "150px"
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0028")	// 28:부서
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.Input({
					width : "200px",
					showValueHelp: true,
					valueHelpOnly: true,
					value : "{Orgtx}",
					valueHelpRequest: oController.displayOrgSearchDialogInView,
					editable : {
						path : "Auth",
						formatter : function(fVal) {
							return fVal == "E" ? false : true;
						}
					}
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer(),
				new sap.m.Button({
					text: oBundleText.getText("LABEL_0002"),	// 2:검색
					icon : "sap-icon://search",
					type : sap.m.ButtonType.Emphasized,
					press : oController.onPressSearch
				}),
				new sap.m.ToolbarSpacer({width : "20px"})
			]
		}).addStyleClass("FilterLayout")
		.setModel(oController._ListCondJSonModel)
		.bindElement("/Data");
	},
	
	/**
	 * 목록테이블 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getListTableRender : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
//			columnHeaderHeight : 35,
			showNoData : true,
			selectionBehavior : sap.ui.table.SelectionBehavior.RowOnly,
			selectionMode: sap.ui.table.SelectionMode.Single,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			fixedColumnCount : 5,
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0903")	// 903:근로시간 조회(부서별)
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onExport
					})
				]
			}).addStyleClass("ToolbarNoBottomLine")
		})
		.setModel(oController._ListJSonModel)
		.bindRows("/Data");
		
		oTable.attachBrowserEvent("dblclick", oController.onSelectRow);
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_WorktimeReportIndvList_Table-header-fixed-fixrow > tbody',
					colIndexes : [0, 1, 2, 3, 4]
				});
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_WorktimeReportIndvList_Table-header > tbody',
					colIndexes : [0, 11]
				});

				var _thisTable = this,
					oBinding = this.getBinding("rows");
				
				oBinding.attachChange(function(oEvent) {
					var oSource = oEvent.getSource();
					var oLength = oSource.getLength();

					if(oLength > 0) _thisTable.setVisibleRowCount(oLength > 10 ? 10 : oLength);
				});
			}
		}, oTable);
		
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
		}).addStyleClass("marginBottom10px");
	},
	
	/**
	 * 목록테이블 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getListDetailTableRender : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
//			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0901")	// 901:개인별 상세내역
					}).addStyleClass("MiddleTitle"),
					new sap.tnt.InfoLabel(oController.PAGEID + "_TableTxt", {
						colorScheme : 8,
						visible : false
					}),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onExport2
					})
				]
			}).addStyleClass("ToolbarNoBottomLine")
		})
		.setModel(oController._ListDetailJSonModel)
		.bindRows("/Data");
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel2);
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var _thisTable = this,
					oBinding = this.getBinding("rows");
				
				oBinding.attachChange(function(oEvent) {
					var oSource = oEvent.getSource();
					var oLength = oSource.getLength();

					if(oLength > 0) _thisTable.setVisibleRowCount(oLength > 10 ? 10 : oLength);
				});
			}
		}, oTable);
		
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
		}).addStyleClass("marginTop20px marginBottom10px");
	}
});