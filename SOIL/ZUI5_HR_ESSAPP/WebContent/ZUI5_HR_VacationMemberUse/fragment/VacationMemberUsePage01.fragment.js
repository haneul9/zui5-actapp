sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_VacationMemberUse.fragment.VacationMemberUsePage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "3%"},
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "5%"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "6%"},	// 38:성명
		{id: "Zzjiklnt", label : oBundleText.getText("LABEL_0067"), plabel : oBundleText.getText("LABEL_0067"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 67:직위
		{id: "Orgtx", label : oBundleText.getText("LABEL_0039"), plabel : oBundleText.getText("LABEL_0039"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "12%", align : sap.ui.core.TextAlign.Begin},	// 39:소속부서
		{id: "Entitle1", label : oBundleText.getText("LABEL_0608"), plabel : oBundleText.getText("LABEL_0612"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "6%", align : sap.ui.core.TextAlign.End},	// 608:발생현황, 612:연차/특별
		{id: "Entitle2", label : "", plabel : oBundleText.getText("LABEL_0615"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "6%", align : sap.ui.core.TextAlign.End},	// 615:하기
		{id: "Entitle3", label : "", plabel : oBundleText.getText("LABEL_2964"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "6%", align : sap.ui.core.TextAlign.End},	// 2964:이월
		{id: "Deduct1", label : oBundleText.getText("LABEL_0611"), plabel : oBundleText.getText("LABEL_0612"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "6%", align : sap.ui.core.TextAlign.End},	// 611:사용현황, 612:연차/특별
		{id: "Deduct2", label : "", plabel : oBundleText.getText("LABEL_0615"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "6%", align : sap.ui.core.TextAlign.End},	// 615:하기
		{id: "Deduct3", label : "", plabel : oBundleText.getText("LABEL_2964"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "6%", align : sap.ui.core.TextAlign.End},	// 2964:이월
		{id: "Rest1", label : oBundleText.getText("LABEL_0613"), plabel : oBundleText.getText("LABEL_0612"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "6%", align : sap.ui.core.TextAlign.End},	// 613:잔여일수, 612:연차/특별
		{id: "Rest2", label : "", plabel : oBundleText.getText("LABEL_0615"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "6%", align : sap.ui.core.TextAlign.End},	// 615:하기
		{id: "Rest3", label : "", plabel : oBundleText.getText("LABEL_2964"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "6%", align : sap.ui.core.TextAlign.End},	// 2964:이월
		{id: "Zbigo", label : oBundleText.getText("LABEL_0096"), plabel : oBundleText.getText("LABEL_0096"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "12%", align : sap.ui.core.TextAlign.Begin}	// 96:비고
	],

	_detailColModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "4%"},
		{id: "Datum", label : oBundleText.getText("LABEL_0154"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "18%"},	// 154:사용일
		{id: "Atext", label : oBundleText.getText("LABEL_0616"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "19%"},	// 616:휴가유형
		{id: "Zbigo", label : oBundleText.getText("LABEL_0096"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "21%"},	// 96:비고
		{id: "Docno", label : oBundleText.getText("LABEL_0607"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "19%"},	// 607:문서번호
		{id: "Mrdchk", label : oBundleText.getText("LABEL_0605"), plabel : "", span : 0, type : "Checkbox2", sort : true, filter : false, width : "19%"}	// 605:MRD여부
	],
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.SearchUser1");
		jQuery.sap.require("common.ZHR_TABLES");
		
		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(this._colModel);
		oController._DetailColumns = common.Common.convertColumnArrayForExcel(this._detailColModel);
		
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
									text : oBundleText.getText("LABEL_0609")	// 609:부서원휴가사용조회
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
					text : oBundleText.getText("LABEL_0614")	// 614:조회년도
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox(oController.PAGEID + "_Zyear", {
					width : "150px",
					selectedKey : "{Zyear}",
					editable : true,
					items : {
						path: "ZHR_LEAVEAPPL_SRV>/YearCodeListSet",
						template: new sap.ui.core.ListItem({
							key: "{ZHR_LEAVEAPPL_SRV>Zyear}",
							text: "{ZHR_LEAVEAPPL_SRV>Zyear}"
						})
					}
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0028")	// 28:부서
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.Input(oController.PAGEID + "_Orgtx", {
					width : "150px",
					showValueHelp: true,
					valueHelpOnly: false,
					value : "{Orgtx}",
					customData : new sap.ui.core.CustomData({key : "Type", value : "Orgeh"}),
					valueHelpRequest: oController.displayOrgehSearchDialog,
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
					valueHelpRequest: oController.displayEmpSearchDialog
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({text : oBundleText.getText("LABEL_0015") }).addStyleClass("Font14px FontBold"),	// 15:기준일
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Endda", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					value : "{Endda}",
					width : "150px",
					change : oController.onChangeEndda
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
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0610")	// 610:부서원휴가사용조회
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

					if(oLength > 0) _thisTable.setVisibleRowCount(oLength > 15 ? 15 : oLength);
				});
				
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_VacationMemberUseList_Table-header > tbody',
					colIndexes : [0, 1, 2, 3, 4, 14]
				});
			}
		}, oTable);
		
//		oTable.addEventDelegate({
//			onAfterRendering: function() {
//				var oTds = $("td[colspan]");
//				for(i=0; i<oTds.length; i++) {
//					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
//				}
//				
//				common.Common.generateRowspan({
//					selector : '#ZUI5_HR_VacationMemberUseList_Table-header > tbody',
//					colIndexes : [0, 1, 2, 3, 4, 11]
//				});
//				
//				var _thisTable = this,
//					oBinding = _thisTable.getBinding("rows");
//				
//				oBinding.attachChange(function(oEvent) {
//					var oSource = oEvent.getSource();
//					var oLength = oSource.getLength();
//					
//					if(oLength > 0) _thisTable.setVisibleRowCount(oLength > 10 ? 10 : oLength);
//				});
//			}
//		}, oTable);
		
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
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0606")	// 606:개인별휴가사용내역
					}).addStyleClass("MiddleTitle"),
					new sap.tnt.InfoLabel(oController.PAGEID + "_TableTxt", {
						colorScheme : 8,
						visible : false
					}),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onExportDetail
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