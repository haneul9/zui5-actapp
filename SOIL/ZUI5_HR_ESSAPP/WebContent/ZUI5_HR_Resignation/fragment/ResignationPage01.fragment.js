sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_Resignation.fragment.ResignationPage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "4%"},
		{id: "Zrestt", label : oBundleText.getText("LABEL_0036"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "8%"},	// 36:상태
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "8%"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "8%"},	// 38:성명
		{id: "Zzjiklnt", label : oBundleText.getText("LABEL_0067"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "8%"},	// 67:직위
		{id: "Orgtx", label : oBundleText.getText("LABEL_0381"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "8%", align : sap.ui.core.TextAlign.Begin},	// 381:조직
		{id: "Reason", label : oBundleText.getText("LABEL_0378"), plabel : "", span : 0, type : "listText", sort : true, filter : true, align : sap.ui.core.TextAlign.Begin},	// 378:사직사유
		{id: "Reret", label : oBundleText.getText("LABEL_0377"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "8%"},	// 377:사직 신청일
		{id: "Reqdt", label : oBundleText.getText("LABEL_0049"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "8%"},	// 49:신청일
		{id: "Mgrnm", label : oBundleText.getText("LABEL_0373"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "8%"},	// 373:면접자
		{id: "Mgrdt", label : oBundleText.getText("LABEL_0380"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "8%"}	// 380:작성일
	],
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.SearchUser1");
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
									new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
									this.getFilterLayoutRender(oController),
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
									sap.ui.jsfragment("fragment.IconTab", oController),						// 분류
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
									text : oBundleText.getText("LABEL_0375")	// 375:사직 신청
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
								new sap.m.ToolbarSpacer(),
								new sap.m.Button({
									text: oBundleText.getText("LABEL_0043"),	// 43:신규신청
									type : sap.m.ButtonType.Default,
									press : oController.onPressNew
								})
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
					text : oBundleText.getText("LABEL_0045")	// 45:신청 시작일
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Apbeg", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					value : "{Apbeg}",
					width : "150px",
					change : oController.onChangeDate
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0046")	// 46:신청 종료일
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Apend", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					width : "150px",
					value : "{Apend}",
					change : oController.onChangeDate
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0084"),	// 84:신청자 성명 
					visible : displayYn
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.Input(oController.PAGEID + "_Ename", {
					width : "150px",
					showValueHelp: true,
					valueHelpOnly: false,
					value : "{Ename}",
					customData : new sap.ui.core.CustomData({key : "Encid", value : "{Encid}"}),
					change : oController.EmpSearchByTx,
					valueHelpRequest: oController.displayEmpSearchDialog,
					visible : displayYn
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
		})
		.setModel(oController._ListCondJSonModel)
		.bindElement("/Data")
		.addStyleClass("FilterLayout");
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
//			columnHeaderHeight : 35,
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
								key : "Appno", 
								value : "{Appno}"
							})
						],
						press : oController.onPressRow
					})
				]
			}),
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0047")	// 47:신청내역
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onExport
					})
				]
			}).addStyleClass("ToolbarNoBottomLine"),
			rowSettingsTemplate : new sap.ui.table.RowSettings({
				highlight : {
					parts : [
						{path : "Zrest"}
					],
					//Information : 파란색 , Warning : 주황색,  Success : 초록색											
					formatter : function(fVal1) {
						switch(fVal1) {
							case "20":
								return sap.ui.core.ValueState.Warning;
							case "30": case "50":
								return sap.ui.core.ValueState.Success;
							case "11": case "55":
								return sap.ui.core.ValueState.Error;
							default:
								return sap.ui.core.ValueState.None;
						}
					}
				}
			})
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