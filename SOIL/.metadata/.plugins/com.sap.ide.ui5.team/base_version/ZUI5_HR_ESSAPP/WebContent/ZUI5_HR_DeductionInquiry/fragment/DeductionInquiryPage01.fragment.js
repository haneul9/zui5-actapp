sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_DeductionInquiry.fragment.DeductionInquiryPage01", {
	
	_colModelClub : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : false, width : "10%"},
		{id: "Dedtx", label : oBundleText.getText("LABEL_0439"), plabel : "", span : 0, type : "string", sort : true, filter : false, width : "30%", align : sap.ui.core.TextAlign.Begin},	// 439:공제명
		{id: "Begda", label : oBundleText.getText("LABEL_0042"), plabel : "", span : 0, type : "date", sort : true, filter : false, width : "20%"},	// 42:시작일
		{id: "Endda", label : oBundleText.getText("LABEL_0065"), plabel : "", span : 0, type : "date", sort : true, filter : false, width : "20%"},	// 65:종료일
		{id: "Memyn", label : oBundleText.getText("LABEL_0445"), plabel : "", span : 0, type : "Checkbox2", sort : true, filter : false, width : "20%"}	// 445:동호회 여부
	],

	_colModelManager : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "4%"},
		{id: "Repgbtx", label : oBundleText.getText("LABEL_0495"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "9%"},	// 495:담당구분
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "9%"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "12%"},	// 38:성명
		{id: "Begda", label : oBundleText.getText("LABEL_0042"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "12%"},	// 42:시작일
		{id: "Endda", label : oBundleText.getText("LABEL_0065"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "12%"},	// 65:종료일
		{id: "Button", label : oBundleText.getText("LABEL_0033"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "5%"},	// 33:삭제
		{id: "Bankctx", label : oBundleText.getText("LABEL_0499"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 499:은행명
		{id: "Bankn", label : oBundleText.getText("LABEL_0498"), plabel : "", span : 0, type : "string", sort : true, filter : true, align : sap.ui.core.TextAlign.Begin},	// 498:은행계좌
		{id: "Emftx", label : oBundleText.getText("LABEL_0450"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 450:예금주
		{id: "Bnkgbtx", label : oBundleText.getText("LABEL_0455"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"}	// 455:입금구분
	],
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.SearchUser1");
		jQuery.sap.require("common.ZHR_TABLES");
		
		// Excel column info
		oController._ColumnsClub = common.Common.convertColumnArrayForExcel(this._colModelClub);
		oController._ColumnsManager = common.Common.convertColumnArrayForExcel(this._colModelManager);
		
		return [
			new sap.ui.commons.layout.VerticalLayout({
				width : "100%",
				content : [ 
					this.getPageAllContentRender(oController)
				]
			})
			.addStyleClass("sapUiSizeCompact")
		];
	},
	
	/**
	 * 페이지 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getPageAllContentRender : function(oController) {
		
		var oContents = [
			new sap.ui.core.HTML({ content : "<div style='height : 20px;'/>" }),
			this.getTitleLayoutRender(oController),									// 타이틀
			new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
			sap.ui.jsfragment("fragment.TargetLayout", oController),				// 대상자
			this.getFilterLayoutRender(oController),								// 검색필터
			new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
			this.getClubTableRender(oController)									// 동호회 목록, 담당자 정보
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : ["20px", "", "20px"],
			width : "100%",
			rows : $.map(oContents, function(rowData, k) {
				return new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell(),
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : rowData
						}),
						new sap.ui.commons.layout.MatrixLayoutCell()
					]
				})
			})
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
									text : oBundleText.getText("LABEL_0492")	// 492:고정 공제항목 조회
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
					text : oBundleText.getText("LABEL_0493")	// 493:기준 시작일
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
					text : oBundleText.getText("LABEL_0494")	// 494:기준 종료일
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
					text : oBundleText.getText("LABEL_0472")	// 472:고정공제
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.Input(oController.PAGEID + "_Dedcd", {
					width : "150px",
					showValueHelp: true,
					valueHelpOnly: false,
					change : oController.DedtxSearchInput,
					valueHelpRequest: oController.displayDedgbDialog,
					value : "{Dedtx}"
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0111")	// 111:대상자
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.Input(oController.PAGEID + "_Ename2", {
					width : "150px",
					showValueHelp: true,
					valueHelpOnly: false,
					value : "{Ename}",
					customData : new sap.ui.core.CustomData({key : "Encid", value : "{Encid}"}),
					change : oController.EmpSearchByTx,
					valueHelpRequest: oController.displayEmpSearchDialog
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
		.addStyleClass("FilterLayout marginTop20px");
	},
	
	/**
	 * 동호회, 담당자 목록 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getClubTableRender : function(oController) {
		
		/*sap.ui.table.Table.extend('dbclkTable', {
			metadata: {
				events: {
					dblClick: {}
				}
			},
			renderer: {},
			onAfterRendering: function() {
				if (sap.ui.table.Table.prototype.onAfterRendering) {
					sap.ui.table.Table.prototype.onAfterRendering.apply(this, arguments);
				}
				var tbl = this;
				
				this.getRows().forEach(function(r, i) {
					var cxt = tbl.getContextByIndex(i);
					if (cxt) {        
						r.$().dblclick(function() {
							tbl.fireDblClick({rowIndex: i, rowContext: cxt});
						});
					}
				});
				
				this.$().find('.sapUiTableRowHdr').each(function(i) {
					var cxt = tbl.getContextByIndex(i);
					if (cxt) {        
						$(this).dblclick(function() {
							tbl.fireDblClick({rowIndex: i, rowContext: cxt});
						});
					}
				});
			}
		});*/
		
		var oClubTable = new sap.ui.table.Table(oController.PAGEID + "_ClubTable", {
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
						text : oBundleText.getText("LABEL_0497")	// 497:동호회 목록
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onClubExport
					})
				]
			}).addStyleClass("ToolbarNoBottomLine")
//			dblClick: function(e) {
//				oController.onClubDblclick(e);
//			}
		})
		.setModel(oController._ListClubJSonModel)
		.bindRows("/Data");
		
		oClubTable.attachBrowserEvent("dblclick", oController.onRowDblClick);
		
		common.ZHR_TABLES.makeColumn(oController, oClubTable, this._colModelClub);
		
		var oManagerTable = new sap.ui.table.Table(oController.PAGEID + "_ManagerTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
//			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0496")	// 496:담당자 정보
					}).addStyleClass("MiddleTitle"),
					new sap.tnt.InfoLabel(oController.PAGEID + "_TableTxt", {
						colorScheme : 8,
						visible : false
					}),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button(oController.PAGEID + "_BtnCopy", {
						text: oBundleText.getText("LABEL_0026"),	// 26:복사
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressCopy,
						visible : false
					}),
					new sap.m.Button(oController.PAGEID + "_BtnAdd", {
						text: oBundleText.getText("LABEL_0482"),	// 482:추가
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressAdd,
						visible : false
					}),
					new sap.m.Button(oController.PAGEID + "_BtnSave", {
						text: oBundleText.getText("LABEL_0177"),	// 177:저장
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressSave,
						visible : false
					}),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onManagerExport
					})
				]
			}).addStyleClass("ToolbarNoBottomLine")
		})
		.setModel(oController._ListManagerJSonModel)
		.bindRows("/Data");
		
		common.ZHR_TABLES.makeColumn(oController, oManagerTable, this._colModelManager);
		
		oManagerTable.getColumns()[1].setTemplate(sap.m.ComboBox({
			width : "99%",
			selectedKey : "{Repgb}",
//			editable : true,
			editable : {
				path : "Isedit",
				formatter : function(fVal) {
					return (fVal) ? true : false;
				}
			},
			items : {
				templateShareable : true,
				path: "ZHR_DEDUCT_MNG_SRV>/RepGbnListSet/?$filter=Dedgb%20eq%20'0010'",
				template: new sap.ui.core.ListItem({
					key: "{ZHR_DEDUCT_MNG_SRV>Repgb}",
					text: "{ZHR_DEDUCT_MNG_SRV>Repgbtx}"
				})
			}
		}).addStyleClass("Font14px FontColor3"));
		
		oManagerTable.getColumns()[3].setTemplate(new sap.m.Input({
			value : "{Ename}",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.onRowPernrChange,
			customData : [
				new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"})
			],
			editable : {
				path : "Isedit",
				formatter : function(fVal) {
					return (fVal) ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		oManagerTable.getColumns()[4].setTemplate(new sap.m.DatePicker({
			valueFormat : "yyyy-MM-dd",
			displayFormat : "yyyy.MM.dd",
			value : "{Begda}",
			editable : {
				path : "Isedit",
				formatter : function(fVal) {
					return (fVal) ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));

		oManagerTable.getColumns()[5].setTemplate(new sap.m.DatePicker({
			valueFormat : "yyyy-MM-dd",
			displayFormat : "yyyy.MM.dd",
			value : "{Endda}",
			editable : {
				path : "Isedit",
				formatter : function(fVal) {
					return (fVal) ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		oManagerTable.getColumns()[6].setTemplate(new sap.ui.commons.Button({
			icon : "sap-icon://delete",
			press : oController.onPressDeleteFromList,
			visible : {
				path : "Isedit",
				formatter : function(fVal) {
					return (fVal) ? true : false;
				}
			}
		}));
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.ui.commons.layout.MatrixLayout({
					columns : 3,
					widths : ["32%", "1%", "67%"],
					width : "100%",
					rows : [
						new sap.ui.commons.layout.MatrixLayoutRow({
							cells : [
								new sap.ui.commons.layout.MatrixLayoutCell({
									vAlign : sap.ui.commons.layout.VAlign.Top,
									content : oClubTable
								}),
								new sap.ui.commons.layout.MatrixLayoutCell({
									content : ""
								}),
								new sap.ui.commons.layout.MatrixLayoutCell({
									vAlign : sap.ui.commons.layout.VAlign.Top,
									content : oManagerTable
								})
							]
						})
					]
				})
			]
		});
	}
});