sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_DeductionChangeResnDisplay.fragment.DeductionChangeResnDisplayPage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 38:성명
		{id: "Orgtx", label : oBundleText.getText("LABEL_0039"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 39:소속부서
		{id: "Workt", label : oBundleText.getText("LABEL_0557"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 557:근무지역
		{id: "Stxt2", label : oBundleText.getText("LABEL_0554"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 554:재직상태
		{id: "Dedcd", label : oBundleText.getText("LABEL_2960"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 2960:변동공제
		{id: "Dedtx", label : oBundleText.getText("LABEL_0510"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "200px", align : sap.ui.core.TextAlign.Begin},	// 510:변동공제명
		{id: "Paydt", label : oBundleText.getText("LABEL_0559"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 559:급여일
		{id: "Reqym", label : oBundleText.getText("LABEL_0441"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 441:공제예정월
		{id: "Pdeym", label : oBundleText.getText("LABEL_0443"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 443:급여공제월
		{id: "Bankctx", label : oBundleText.getText("LABEL_0456"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 456:입금은행
		{id: "Bankn", label : oBundleText.getText("LABEL_0556"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "140px", align : sap.ui.core.TextAlign.End},	// 556:계좌번호
		{id: "Emftx", label : oBundleText.getText("LABEL_0450"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 450:예금주
		{id: "Betrg", label : oBundleText.getText("LABEL_0558"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "140px", align : sap.ui.core.TextAlign.End},	// 558:급여공제총액
		{id: "Zbigo", label : oBundleText.getText("LABEL_0096"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "250px", align : sap.ui.core.TextAlign.Begin}	// 96:비고
	],

	_detailColModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 38:성명
		{id: "Orgtx", label : oBundleText.getText("LABEL_0039"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 39:소속부서
		{id: "Workt", label : oBundleText.getText("LABEL_0557"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 557:근무지역
		{id: "Stxt2", label : oBundleText.getText("LABEL_0554"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 554:재직상태
		{id: "Betrg", label : oBundleText.getText("LABEL_0550"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "140px", align : sap.ui.core.TextAlign.End},	// 550:금액
		{id: "ZreqDatetime", label : oBundleText.getText("LABEL_0553"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "160px"},	// 553:신청일시
		{id: "Inmsg", label : oBundleText.getText("LABEL_0506"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "580px", align : sap.ui.core.TextAlign.Begin}	// 506:경조메세지
	],
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.SearchUser1");
		jQuery.sap.require("common.ZHR_TABLES");
		
		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(this._colModel);
		oController._Columns2 = common.Common.convertColumnArrayForExcel(this._detailColModel);
		
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
									this.getDetailListTableRender(oController)
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
				height : "20px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_A.png"}),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0560")	// 560:변동공제 조회(사유발생자)
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
					text : oBundleText.getText("LABEL_0548")	// 548:공제예정 시작월
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_PdeymBeg", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM",
					value : "{PdeymBeg}",
					width : "150px",
					change : oController.onChangeDate
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0549")	// 549:공제예정 종료월
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_PdeymEnd", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM",
					width : "150px",
					value : "{PdeymEnd}",
					change : oController.onChangeDate
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0019"),	// 19:대상자 성명
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
		.addStyleClass("FilterLayout")
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
			fixedColumnCount : 4,
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0552")	// 552:변동공제 내역
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
		
		oTable.attachBrowserEvent("dblclick", oController.onRowDblClick);
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
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
		});
	},
	
	/**
	 * 상세테이블 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getDetailListTableRender : function(oController) {
		
		var oDetailTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
//			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			fixedColumnCount : 4,
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0050")	// 50:신청자
					}).addStyleClass("MiddleTitle"),
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
		
		common.ZHR_TABLES.makeColumn(oController, oDetailTable, this._detailColModel);
		
		oDetailTable.addEventDelegate({
			onAfterRendering: function() {
				var _thisTable = this,
					oBinding = this.getBinding("rows");
				
				oBinding.attachChange(function(oEvent) {
					var oSource = oEvent.getSource();
					var oLength = oSource.getLength();

					if(oLength > 0) _thisTable.setVisibleRowCount(oLength > 10 ? 10 : oLength);
				});
			}
		}, oDetailTable);
		
		return new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			rows : [
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : oDetailTable
						})
					]
				})
			]
		});
	}
});