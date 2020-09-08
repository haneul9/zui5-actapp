sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_OvertimeLeaderDisp.fragment.OvertimeLeaderDispPage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 38:성명
		{id: "Orgtx", label : oBundleText.getText("LABEL_0028"), plabel : oBundleText.getText("LABEL_0028"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 28:부서
		{id: "Wrktyp", label : oBundleText.getText("LABEL_0013"), plabel : oBundleText.getText("LABEL_0013"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "140px", align : sap.ui.core.TextAlign.Begin},	// 근무형태
		{id: "Ztext", label : oBundleText.getText("LABEL_0624"), plabel : oBundleText.getText("LABEL_0624"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "200px"},	// 624:근무조
		{id: "Ttext", label : oBundleText.getText("LABEL_0671"), plabel : oBundleText.getText("LABEL_0671"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "140px"},	// 671:근무시간
		{id: "Atext", label : oBundleText.getText("LABEL_0587"), plabel : oBundleText.getText("LABEL_0587"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 587:특근유형
		{id: "Begda", label : oBundleText.getText("LABEL_0042"), plabel : oBundleText.getText("LABEL_0042"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 42:시작일
		{id: "Beguz", label : oBundleText.getText("LABEL_0631"), plabel : oBundleText.getText("LABEL_0631"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 631:시작시간
		{id: "Endda", label : oBundleText.getText("LABEL_0065"), plabel : oBundleText.getText("LABEL_0065"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 65:종료일
		{id: "Enduz", label : oBundleText.getText("LABEL_0635"), plabel : oBundleText.getText("LABEL_0635"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 635:종료시간
		{id: "Tim11", label : oBundleText.getText("LABEL_0671"), plabel : oBundleText.getText("LABEL_0671"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 671:근무시간
		{id: "Tim12", label : oBundleText.getText("LABEL_0586"), plabel : oBundleText.getText("LABEL_0586"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 586:특근시간
		{id: "Tim13", label : oBundleText.getText("LABEL_0643"), plabel : oBundleText.getText("LABEL_0643"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 643:특근연장
		{id: "Tim14", label : oBundleText.getText("LABEL_0633"), plabel : oBundleText.getText("LABEL_0633"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 633:심야시간
		{id: "Tmrsn", label : oBundleText.getText("LABEL_0641"), plabel : oBundleText.getText("LABEL_0641"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "140px"},	// 641:특근내역
		{id: "Satext", label : oBundleText.getText("LABEL_0626"), plabel : oBundleText.getText("LABEL_0625"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "140px"},	// 625:근태항목, 626:대근사유
		{id: "Sperid", label : "", plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번
		{id: "Sename", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 38:성명
		{id: "Symptn", label : oBundleText.getText("LABEL_0872"), plabel : oBundleText.getText("LABEL_0872"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 872:인사부서 메모
		{id: "Docno", label : oBundleText.getText("LABEL_0607"), plabel : oBundleText.getText("LABEL_0607"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"}	// 607:문서번호
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
									text : oBundleText.getText("LABEL_0871")	// 871:특근내역조회
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
							return fVal != "E" ? true : false;
						}
					}
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
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
			fixedColumnCount : 3,
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0873")	// 873:특근내역관리
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
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_OvertimeLeaderDispList_Table-header-fixed-fixrow > tbody',
					colIndexes : [0, 1, 2]
				});
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_OvertimeLeaderDispList_Table-header > tbody',
					colIndexes : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 18]
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