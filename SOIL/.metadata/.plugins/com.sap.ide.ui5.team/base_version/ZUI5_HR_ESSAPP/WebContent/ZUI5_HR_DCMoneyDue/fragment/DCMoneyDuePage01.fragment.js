sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_DCMoneyDue.fragment.DCMoneyDuePage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "listText8", sort : true, filter : true, width : "6%"},
		{id: "Calda", label : oBundleText.getText("LABEL_0847"), plabel : "", span : 0, type : "listText8", sort : true, filter : true, width : "12%"},	// 847:정산일자
		{id: "Dcdgbtx", label : oBundleText.getText("LABEL_0300"), plabel : "", span : 0, type : "listText8", sort : true, filter : true, width : "21%"},	// 300:구분
		{id: "Avamt", label : oBundleText.getText("LABEL_0748"), plabel : "", span : 0, type : "listText8", sort : true, filter : true, width : "23%", align : sap.ui.core.TextAlign.End},	// 748:평균임금
		{id: "Ndcrat", label : oBundleText.getText("LABEL_0848"), plabel : "", span : 0, type : "listText8", sort : true, filter : true, width : "19%"},	// 848:누진율
		{id: "ChamtDc", label : oBundleText.getText("LABEL_0849"), plabel : "", span : 0, type : "listText8", sort : true, filter : true, width : "19%", align : sap.ui.core.TextAlign.End},	// 849:1% DC이전액
		{id: "ReamtLas", label : oBundleText.getText("LABEL_0850"), plabel : "", span : 0, type : "listText8", sort : true, filter : true, width : "19%", align : sap.ui.core.TextAlign.End}	// 850:DC불입액
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
									this.getTitleLayoutRender(oController),									// 타이틀
									new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
									this.getMessageTripRender(oController),
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
									this.getFilterLayoutRender(oController),								// 검색필터
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
									this.getListTableRender(oController)									// 목록
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
									text : oBundleText.getText("LABEL_0851")	// 851:DC 퇴직연금 불입내역 조회
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
	
	getMessageTripRender : function(oController) {
		
		return new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			rows : [
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : new sap.m.MessageStrip({
								text : oBundleText.getText("LABEL_2894"),	// 2894:※ 불입액상세내역은 2020.01월 불입분부터 조회 가능합니다. 
								type : sap.ui.core.MessageType.Success,
								showIcon : false ,
								customIcon : "sap-icon://message-information", 
								showCloseButton : false,
							}).addStyleClass("FontFamily")
						})
					]
				})
			]
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
					text : oBundleText.getText("LABEL_0301")	// 301:조회 시작연월
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Begym", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM",
					value : "{Begym}",
					width : "150px",
					change : oController.onChangeDate
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0302")	// 302:조회 종료연월
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Endym", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM",
					width : "150px",
					value : "{Endym}",
					change : oController.onChangeDate
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
	 * @return sap.m.IconTabBar
	 */
	getListTableRender : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
//			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			rowActionCount : 1,
			rowActionTemplate : new sap.ui.table.RowAction({
				items : [
					new sap.ui.table.RowActionItem({
						icon : "sap-icon://navigation-right-arrow",
						customData : [
							new sap.ui.core.CustomData({
								key : "Idx", value : "{Idx}"
							})
						],
						press : oController.onPressRow
					})
				]
			}),
			extension : new sap.m.Toolbar({ 
				content : [
//					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
//					new sap.m.Text({
//						text : oBundleText.getText("LABEL_0851")	// 851:DC 퇴직연금 불입내역 조회
//					}).addStyleClass("MiddleTitle"),
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
		.bindRows("/Data")
		.attachCellClick(oController.onSelectRow);
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var _thisTable = this,
					oBinding = this.getBinding("rows");
				
				oBinding.attachChange(function(oEvent) {
					var oSource = oEvent.getSource();
					var oLength = oSource.getLength();

					if(oLength > 0) _thisTable.setVisibleRowCount(oLength > 15 ? 15 : oLength);
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
		});
	}
});