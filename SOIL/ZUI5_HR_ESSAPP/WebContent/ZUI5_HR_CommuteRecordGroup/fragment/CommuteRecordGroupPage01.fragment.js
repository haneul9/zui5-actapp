sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_CommuteRecordGroup.fragment.CommuteRecordGroupPage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "No.", span : 0, type : "listText9", sort : true, filter : true, width : "4%"},
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "listText9", sort : true, filter : true, width : "8%"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "listText9", sort : true, filter : true, width : "8%"},	// 38:성명
		{id: "Begda", label : oBundleText.getText("LABEL_0700"), plabel : oBundleText.getText("LABEL_0042"), resize : false, span : 2, type : "listdate3", sort : true, filter : true, width : "8%"},	// 42:시작일, 700:근무기간
		{id: "Endda", label : "", plabel : oBundleText.getText("LABEL_0065"), resize : false, span : 0, type : "listdate3", sort : true, filter : true, width : "8%"},	// 65:종료일
		{id: "Step1", label : oBundleText.getText("LABEL_0705"), plabel : oBundleText.getText("LABEL_0705"), resize : false, span : 0, type : "listText9", sort : true, filter : true, width : "7%"},	// 705:확인단계
		{id: "Step2", label : oBundleText.getText("LABEL_0709"), plabel : oBundleText.getText("LABEL_0709"), resize : false, span : 0, type : "listText9", sort : true, filter : true, width : "7%"},	// 709:확인차수
		{id: "Tschd", label : oBundleText.getText("LABEL_0634"), plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 0, type : "listText9", sort : true, filter : true, width : "7%", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Tovrt", label : oBundleText.getText("LABEL_0693"), plabel : oBundleText.getText("LABEL_0693"), resize : false, span : 0, type : "listText9", sort : true, filter : true, width : "7%", align : sap.ui.core.TextAlign.End},	// 693:특근
		{id: "Totex", label : oBundleText.getText("LABEL_0643"), plabel : oBundleText.getText("LABEL_0643"), resize : false, span : 0, type : "listText9", sort : true, filter : true, width : "7%", align : sap.ui.core.TextAlign.End},	// 643:특근연장
		{id: "Tnght", label : oBundleText.getText("LABEL_0691"), plabel : oBundleText.getText("LABEL_0691"), resize : false, span : 0, type : "listText9", sort : true, filter : true, width : "7%", align : sap.ui.core.TextAlign.End},	// 691:심야
		{id: "Tofix", label : oBundleText.getText("LABEL_0699"), plabel : oBundleText.getText("LABEL_0699"), resize : false, span : 0, type : "listText9", sort : true, filter : true, width : "7%", align : sap.ui.core.TextAlign.End},	// 699:고정특근
		{id: "Cmtyn", label : oBundleText.getText("LABEL_0698"), plabel : oBundleText.getText("LABEL_0698"), resize : false, span : 0, type : "Checkbox2", sort : true, filter : true, width : "7%"},	// 698:개인확인커멘트존재여부
		{id: "Conyn", label : oBundleText.getText("LABEL_0706"), plabel : oBundleText.getText("LABEL_0706"), resize : false, span : 0, type : "Checkbox2", sort : true, filter : true, width : "8%"}	// 706:확인여부
	],
	
	_colModel2 : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 38:성명
		{id: "Txdat", label : oBundleText.getText("LABEL_0057"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 57:일자
		{id: "Daytx", label : oBundleText.getText("LABEL_0054"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "90px"},	// 54:요일
		{id: "Holyn", label : oBundleText.getText("LABEL_0504"), plabel : "", span : 0, type : "Checkbox2", sort : true, filter : true, width : "90px"},	// 504:휴일여부
		{id: "Orgtx", label : oBundleText.getText("LABEL_0028"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 28:부서
		{id: "Schty", label : oBundleText.getText("LABEL_0013"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "140px", align : sap.ui.core.TextAlign.Begin},	// 근무형태
		{id: "Schsh", label : oBundleText.getText("LABEL_0624"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 624:근무조
		{id: "Schdy", label : oBundleText.getText("LABEL_0671"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "140px", align : sap.ui.core.TextAlign.Begin},	// 671:근무시간
		{id: "Abstx", label : oBundleText.getText("LABEL_0625"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 625:근태항목
		{id: "Tschd", label : oBundleText.getText("LABEL_0634"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Tovrt", label : oBundleText.getText("LABEL_0693"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 693:특근
		{id: "Totex", label : oBundleText.getText("LABEL_0643"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 643:특근연장
		{id: "Tnght", label : oBundleText.getText("LABEL_0691"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 691:심야
		{id: "Ottxt", label : oBundleText.getText("LABEL_0690"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "250px", align : sap.ui.core.TextAlign.Begin},	// 690:세부내역
		{id: "Cmnt0", label : oBundleText.getText("LABEL_0684"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "250px", align : sap.ui.core.TextAlign.Begin},	// 684:개인확인커멘트
		{id: "Cmnta", label : oBundleText.getText("LABEL_0686"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "250px", align : sap.ui.core.TextAlign.Begin}	// 686:관리부서 기록사항
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
				height : "20px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_A.png"}),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0703")	// 703:근태기록부확인(부서장)
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
					text : oBundleText.getText("LABEL_0689")	// 689:대상년월
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Tsmon", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM",
					value : "{Tsmon}",
					width : "150px"
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0708")	// 708:확인자 성명
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
							return fVal == "H" ? true : false;
						}
					}
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0707")	// 707:확인완료여부
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox({
					width : "150px",
					selectedKey : "{Finyn}",
					items : [
						new sap.ui.core.Item({key : "ALL", text : oBundleText.getText("LABEL_0212")}),	// 212:전체
						new sap.ui.core.Item({key : "Y", text : oBundleText.getText("LABEL_0395")}),	// 395:확인
						new sap.ui.core.Item({key : "N", text : oBundleText.getText("LABEL_0702")})	// 702:미확인
					]
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
//			selectionBehavior : sap.ui.table.SelectionBehavior.Row,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			rowActionCount : 1,
			rowActionTemplate : new sap.ui.table.RowAction({
				items : [
					new sap.ui.table.RowActionItem({
						icon : "sap-icon://navigation-right-arrow",
						customData : [
							new sap.ui.core.CustomData({key : "Encid", value : "{Encid}"}),
							new sap.ui.core.CustomData({key : "Ename", value : "{Ename}"})
						],
						press : oController.onSelectRow
					})
				]
			}),
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0701")	// 701:근태기록부확인(부서장)
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button(oController.PAGEID + "_ConfirmBtn", {
						text: oBundleText.getText("LABEL_0704"),	// 704:선택확인
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressConfirm,
						visible : false
					}),
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
		
//		oTable.attachBrowserEvent("dblclick", oController.onSelectRow);
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_CommuteRecordGroupList_Table-header > tbody',
					colIndexes : [0, 1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13]
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
		});
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
			fixedColumnCount : 6,
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0697")	// 697:개인별근태기록부내역
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