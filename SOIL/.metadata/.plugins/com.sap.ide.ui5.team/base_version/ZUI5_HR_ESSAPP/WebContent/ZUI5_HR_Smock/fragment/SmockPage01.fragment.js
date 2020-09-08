sap.ui.jsfragment("ZUI5_HR_Smock.fragment.SmockPage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "listText5", sort : true, filter : true},
		{id: "Sstatt", label : oBundleText.getText("LABEL_0036"), plabel : "", span : 0, type : "listText5", sort : true, filter : true, width : "6.4%"},	// 36:상태
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "listText5", sort : true, filter : true, width : "6.4%"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "listText5", sort : true, filter : true, width : "6.4%"},	// 38:성명
		{id: "Zzjiklnt", label : oBundleText.getText("LABEL_0067"), plabel : "", span : 0, type : "listText5", sort : true, filter : true, width : "6.4%"},	// 67:직위
		{id: "Orgtx", label : oBundleText.getText("LABEL_0039"), plabel : "", span : 0, type : "listText5", sort : true, filter : true, width : "6.4%", align : sap.ui.core.TextAlign.Begin},	// 39:소속부서
		{id: "Zyear", label : oBundleText.getText("LABEL_0187"), plabel : "", span : 0, type : "listText5", sort : true, filter : true, width : "6.4%"},	// 187:대상연도
		{id: "Sgubnt", label : oBundleText.getText("LABEL_0080"), plabel : "", span : 0, type : "listText5", sort : true, filter : true, width : "6.4%"},	// 80:신청구분
		{id: "Apdat", label : oBundleText.getText("LABEL_0049"), plabel : "", span : 0, type : "listdate2", sort : true, filter : true, width : "6.4%"},	// 49:신청일
		{id: "Suitwrt", label : oBundleText.getText("LABEL_0189"), plabel : "", span : 0, type : "listText5", sort : true, filter : true, width : "6.4%"},	// 189:동복상의
		{id: "PantwrW", label : oBundleText.getText("LABEL_0205"), plabel : "", span : 0, type : "listText5", sort : true, filter : true, width : "6.4%"},	// 205:솜바지\n(허리)
		{id: "Jmprwrt", label : oBundleText.getText("LABEL_0195"), plabel : "", span : 0, type : "listText5", sort : true, filter : true, width : "6.4%"},	// 195:방한점퍼
		{id: "Suitsmt", label : oBundleText.getText("LABEL_0214"), plabel : "", span : 0, type : "listText5", sort : true, filter : true, width : "6.4%"},	// 214:하복상의
		{id: "Stylsmt", label : oBundleText.getText("LABEL_0199"), plabel : "", span : 0, type : "listText5", sort : true, filter : true, width : "6.4%"},	// 199:선호스타일
		{id: "Ringckt", label : oBundleText.getText("LABEL_0185"), plabel : "", span : 0, type : "listText5", sort : true, filter : true, width : "6.4%"},	// 185:고리부착유무
		{id: "Mgckdat", label : oBundleText.getText("LABEL_0186"), plabel : "", span : 0, type : "listdate2", sort : true, filter : true, width : "6.4%"}	// 186:담당자 확인일자
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
								new sap.m.Text({text : oBundleText.getText("LABEL_0194") }).addStyleClass("Font18px FontColor0"),	// 194:방염 작업복 신청
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
									text: oBundleText.getText("LABEL_0188"),	// 188:동계신청
									type : sap.m.ButtonType.Default,
									press : oController.onPressWinterNew
								}),
								new sap.m.Button({
									text: oBundleText.getText("LABEL_0213"),	// 213:하계신청
									type : sap.m.ButtonType.Default,
									press : oController.onPressSummerNew
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
				new sap.m.Text({text : oBundleText.getText("LABEL_0045") }).addStyleClass("Font14px FontBold"),	// 45:신청 시작일
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Apbeg", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					value : "{Apbeg}",
					width : "150px",
					change : oController.onChangeDate
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({text : oBundleText.getText("LABEL_0046")}).addStyleClass("Font14px FontBold"),	// 46:신청 종료일
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Apend", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					width : "150px",
					value : "{Apend}",
					change : oController.onChangeDate
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({text : oBundleText.getText("LABEL_0080")}).addStyleClass("Font14px FontBold"),	// 80:신청구분
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox(oController.PAGEID + "_Sgubn", {
					width : "150px",
					editable : true,
					selectedKey : "{Sgubn}"
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({text : oBundleText.getText("LABEL_0084"), visible : displayYn}).addStyleClass("Font14px FontBold"), 	// 84:신청자 성명
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
	 * @return sap.ui.commons.layout.MatrixLayout
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
							new sap.ui.core.CustomData({ key : "Apdoc", value : "{Apdoc}" }),
							new sap.ui.core.CustomData({ key : "Sgubn", value : "{Sgubn}" })
						],
						press : oController.onPressRow
					})
				]
			}),
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({text : oBundleText.getText("LABEL_0047")}).addStyleClass("MiddleTitle"),	// 47:신청내역
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
						{path : "Sstat"}
					],
					//Information : 파란색 , Warning : 주황색,  Success : 초록색
					formatter : function(fVal1) {
						switch(fVal1) {
							case "1":
								return sap.ui.core.ValueState.None;
							case "2":
								return sap.ui.core.ValueState.Warning;
							case "3":
								return sap.ui.core.ValueState.Success;
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