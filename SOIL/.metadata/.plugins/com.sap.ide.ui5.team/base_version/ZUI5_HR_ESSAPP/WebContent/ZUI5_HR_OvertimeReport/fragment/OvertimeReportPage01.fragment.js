sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_OvertimeReport.fragment.OvertimeReportPage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 38:성명
		{id: "Orgtx", label : oBundleText.getText("LABEL_0028"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 28:부서
		{id: "Datum", label : oBundleText.getText("LABEL_0057"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 57:일자
		{id: "Week", label : oBundleText.getText("LABEL_0054"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 54:요일
		{id: "Holchk", label : oBundleText.getText("LABEL_0504"), plabel : "", span : 0, type : "Checkbox2", sort : true, filter : true, width : "100px"},	// 504:휴일여부
		{id: "Atext", label : oBundleText.getText("LABEL_0672"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 672:근태
		{id: "Wrktyp", label : oBundleText.getText("LABEL_0013"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "140px", align : sap.ui.core.TextAlign.Begin},	// 근무형태
		{id: "Ztext", label : oBundleText.getText("LABEL_0624"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "200px"},	// 624:근무조
		{id: "Ttext", label : oBundleText.getText("LABEL_0671"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "140px"},	// 671:근무시간
		{id: "Fsubs", label : oBundleText.getText("LABEL_2886"), plabel : "", span : 0, type : "Checkbox4", sort : true, filter : true, width : "100px"},	// 2886:예외근무
		{id: "Tim12", label : oBundleText.getText("LABEL_0693"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 693:특근
		{id: "Tim13", label : oBundleText.getText("LABEL_0643"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 643:특근연장
		{id: "Tim14", label : oBundleText.getText("LABEL_0691"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 691:심야
		{id: "Spectx", label : oBundleText.getText("LABEL_0869"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "250px", align : sap.ui.core.TextAlign.Begin},	// 869:특기사항
		{id: "Docno", label : oBundleText.getText("LABEL_0607"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin}	// 607:문서번호
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
									this.getTitleLayoutRender(oController),									// 타이틀
									new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
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
									text : oBundleText.getText("LABEL_2864")	// 2864:특근조회(개인별)
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
					text : oBundleText.getText("LABEL_0502")	// 502:조회 시작일
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Begda", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					value : "{Begda}",
					width : "150px",
					change : oController.onChangeDate
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0503")	// 503:조회 종료일
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Endda", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					width : "150px",
					value : "{Endda}",
					change : oController.onChangeDate
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0976"),	// 976:근태영역
					visible : (_gAuth == 'H') ? true : false
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox(oController.PAGEID + "_Tmare", {
					width : "150px",
					selectedKey : "{Tmare}",
					visible : (_gAuth == 'H') ? true : false,
					items : {
						path: "ZHR_DAILYTIME_SRV>/TmareCodeListSet",
						filters : [
							{sPath : 'Gtype', sOperator : 'EQ', oValue1 : 'A'}
						],
						template: new sap.ui.core.ListItem({
							key: "{ZHR_DAILYTIME_SRV>Tmare}",
							text: "{ZHR_DAILYTIME_SRV>Tmaret}"
						})
					}
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px", visible : (_gAuth == 'H') ? true : false}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0019")	// 19:대상자 성명
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
					editable : {
						path : "Auth",
						formatter : function(fVal) {
							return fVal != "E" ? true : false;
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
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			fixedColumnCount : 5,
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0867")	// 867:특근조회(개인별)
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