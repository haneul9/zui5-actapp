sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_Deduction.fragment.DeductionPage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "50px"},
		{id: "ZappStxtAl", label : oBundleText.getText("LABEL_0036"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "80px"},	// 36:상태
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "80px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "100px"},	// 38:성명
		{id: "Jiklnt", label : oBundleText.getText("LABEL_0067"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "150px"},	// 67:직위
		{id: "Orgtx", label : oBundleText.getText("LABEL_0039"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 39:소속부서
		{id: "Dedtx", label : oBundleText.getText("LABEL_0473"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "200px", align : sap.ui.core.TextAlign.Begin},	// 473:고정공제명
		{id: "Percnt", label : oBundleText.getText("LABEL_0476"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "100px"},	// 476:공제인원
		{id: "Reqamt", label : oBundleText.getText("LABEL_0474"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "140px", align : sap.ui.core.TextAlign.End},	// 474:공제금액
		{id: "Zbigo", label : oBundleText.getText("LABEL_0096"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "250px", align : sap.ui.core.TextAlign.Begin},	// 96:비고
		{id: "Reqym", label : oBundleText.getText("LABEL_0441"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "100px"},	// 441:공제예정월
		{id: "ZreqDatetime", label : oBundleText.getText("LABEL_0553"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "160px"},	// 553:신청일시
		{id: "ZappDate", label : oBundleText.getText("LABEL_0107"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "100px"},	// 107:결재일
		{id: "Attachyn", label : oBundleText.getText("LABEL_0069"), plabel : "", span : 0, type : "file", sort : true, filter : true, width : "80px"},	// 69:첨부
		{id: "ZListComment", label : oBundleText.getText("LABEL_0072"), plabel : "", span : 0, type : "commentpopover3", sort : true, filter : true, width : "300px", align : sap.ui.core.TextAlign.Begin}	// 72:담당자의견
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
									text : oBundleText.getText("LABEL_0485")	// 485:[공장]고정공제 신청
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
					width : "120px",
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
					width : "120px",
					value : "{Apend}",
					change : oController.onChangeDate
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0084"),	// 84:신청자 성명 
					visible : displayYn
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px", visible : displayYn}),
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
				new sap.m.ToolbarSpacer({width : "20px", visible : displayYn}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0548")	// 548:공제예정 시작월
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Reqymbeg", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM",
					value : "{Reqymbeg}",
					width : "100px"
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0549")	// 549:공제예정 종료월
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Reqymend", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM",
					width : "100px",
					value : "{Reqymend}"
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0472") 	// 472:고정공제
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.Input(oController.PAGEID + "_Dedtx", {
					width : "150px",
					showValueHelp: true,
					valueHelpOnly: false,
					value : "{Dedtx}",
					valueHelpRequest: oController.displayDedgbDialog
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
			fixedColumnCount : 5,
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
						{path : "ZappStatAl"},
						{path : "ZappDate"}
					],
					//Information : 파란색 , Warning : 주황색,  Success : 초록색
					formatter : function(fVal1, fVal2) {
						switch(fVal1) {
							case "20":
								return sap.ui.core.ValueState.Warning;
							case "30": case "35": case "40": case "50":
								return (fVal2 == null || fVal2 == "") ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.Information;
							case "31": case "36": case "45": case "55":
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