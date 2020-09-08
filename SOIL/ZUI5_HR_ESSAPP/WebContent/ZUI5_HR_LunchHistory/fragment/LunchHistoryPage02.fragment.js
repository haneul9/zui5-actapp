sap.ui.jsfragment("ZUI5_HR_LunchHistory.fragment.LunchHistoryPage02", {
	
	_colModel : [
			 {id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : false, width : "100px"},
			 {id: "Datum", label : oBundleText.getText("LABEL_0057"), plabel : "", span : 0, type : "string", sort : true, filter : false, width : "250px"} ,	// 57:일자
			 {id: "Cardno", label : oBundleText.getText("LABEL_2250"), plabel : "", span : 0, type : "string", sort : true, filter : false, width : "15%"},	// 2250:카드번호
			 {id: "Bet01", label : oBundleText.getText("LABEL_1582"), plabel : "", span : 0, type : "money", sort : true, filter : false, width : "10%"},	// 1582:금액(카드)
			 {id: "Bet02", label : oBundleText.getText("LABEL_1581"), plabel : "", span : 0, type : "money", sort : true, filter : false, width : "10%"},	// 1581:금액(기타)
			 {id: "Lgubn", label : oBundleText.getText("LABEL_1887"), plabel : "", span : 0, type : "string", sort : true, filter : false, width : "10%"},	// 1887:식대구분
			 {id: "Lcorn", label : oBundleText.getText("LABEL_2255"), plabel : "", span : 0, type : "string", sort : true, filter : false, width : "10%"},	// 2255:코너구분
			 {id: "Lmenu", label : oBundleText.getText("LABEL_1717"), plabel : "", span : 0, type : "string", sort : true, filter : false, align : "Begin"}	// 1717:메뉴명
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
									new sap.ui.core.HTML({ content : "<div style='height : 20px;'/>" }),    // 검색필터
									this.getTitleLayoutRender(oController),									// 타이틀
									new sap.ui.core.HTML({content : "<div style='height : 20px;'/>"}),
									this.getFilterLayoutRender(oController),	
									new sap.ui.core.HTML({ content : "<div style='height : 20px;'/>" }),
									sap.ui.jsfragment("fragment.TargetLayout", oController),				// 대상자
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
									this.getSummaryLayoutRender(oController),								// Summary Data
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
				height : "20px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_A.png"}),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_2155")	// 2155:[본사]중식비 사용내역 조회
								}).addStyleClass("Font18px FontColor0"),
								new sap.m.ToolbarSpacer()
							]
						}).addStyleClass("ToolbarNoBottomLine")
					})
				]
			}),
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
	 * @return sap.m.Toolbar
	 */
	getFilterLayoutRender : function(oController) {
		var displayYn = (_gAuth == 'E') ? false : true;
		
		return new sap.m.Toolbar({
			height : "45px",
			content : [
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0220")	// 220:기준년월
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Val", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM",
					value : "{Yyyymm}",
					width : "150px",
					change : oController.onSearchBtn
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer(),
				new sap.m.Button({
					text: oBundleText.getText("LABEL_0002"),	// 2:검색
					icon : "sap-icon://search",
					type : sap.m.ButtonType.Emphasized,
					press : oController.onSearchBtn
				}),
				new sap.m.ToolbarSpacer({width : "20px"})
			]
		})
		.setModel(oController._DetailJSonModel)
		.bindElement("/Data")
		.addStyleClass("FilterLayout");
	},
	
	/**
	 * 목록테이블 rendering
	 * 
	 * @param oController
	 * @return matrixlayout
	 */
	getSummaryLayoutRender : function(oController) {
		var oRow, oCell;
		// 신청내역
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 9,
		}).setModel(oController._DetailJSonModel)
		.bindElement("/Data");
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0879") }).addStyleClass("FontFamilyBold"),	// 879:근무일
			hAlign : "Center" ,
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0763") }).addStyleClass("FontFamilyBold"),	// 763:휴가
			hAlign : "Center" ,
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2241") }).addStyleClass("FontFamilyBold"),	// 2241:출장
			hAlign : "Center" ,
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1527") }).addStyleClass("FontFamilyBold"),	// 1527:교육
			hAlign : "Center" ,
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2356") }).addStyleClass("FontFamilyBold"),	// 2356:훈련
			hAlign : "Center" ,
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0109") }).addStyleClass("FontFamilyBold"),	// 109:기타
			hAlign : "Center" ,
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1504") }).addStyleClass("FontFamilyBold"),	// 1504:공제계
			hAlign : "Center" ,
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1912") }).addStyleClass("FontFamilyBold"),	// 1912:실근무일
			hAlign : "Center" ,
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1880") , textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 1880:시내출장
			hAlign : "Center" ,
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Wordy}" , 
									   textAlign : "End", 
									   editable : false,
									   width : "100%"}).addStyleClass("FontFamily"),
			hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Absdy}" , 
				   textAlign : "End", 
				   editable : false,
				   width : "100%"}).addStyleClass("FontFamily"),
		    hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Abrdy}" , 
				   textAlign : "End", 
				   editable : false,
				   width : "100%"}).addStyleClass("FontFamily"),
		    hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Edudy}" , 
				   textAlign : "End", 
				   editable : false,
				   width : "100%"}).addStyleClass("FontFamily"),
		    hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Trady}" , 
				   textAlign : "End", 
				   editable : false,
				   width : "100%"}).addStyleClass("FontFamily"),
		    hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Etcdy}" , 
				   textAlign : "End", 
				   editable : false,
				   width : "100%"}).addStyleClass("FontFamily"),
		    hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Totdy}" , 
				   textAlign : "End", 
				   editable : false,
				   width : "100%"}).addStyleClass("FontFamily"),
		    hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Actdy}" , 
				   textAlign : "End", 
				   editable : false,
				   width : "100%"}).addStyleClass("FontFamily"),
		    hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Btrdy}" , 
				   textAlign : "End", 
				   editable : false,
				   width : "100%"}).addStyleClass("FontFamily"),
		    hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1654") }).addStyleClass("FontFamilyBold"),	// 1654:당월기준액
			hAlign : "Center" ,
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1653") }).addStyleClass("FontFamilyBold"),	// 1653:당월공제액
			hAlign : "Center" ,
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2107") }).addStyleClass("FontFamilyBold"),	// 2107:전월이월액
			hAlign : "Center" ,
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1658") }).addStyleClass("FontFamilyBold"),	// 1658:당월한도액
			hAlign : "Center" ,
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1656") }).addStyleClass("FontFamilyBold"),	// 1656:당월사용액
			hAlign : "Center" ,
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2349") }).addStyleClass("FontFamilyBold"),	// 2349:회사지원금
			hAlign : "Center" ,
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1590") }).addStyleClass("FontFamilyBold"),	// 1590:급여공제액
			hAlign : "Center" ,
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2199") }).addStyleClass("FontFamilyBold"),	// 2199:차월이월액
			hAlign : "Center" ,
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1810"), textAlign : "Center" }).addStyleClass("FontFamilyBold"),	// 1810:사내출장비
			hAlign : "Center" ,
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Lbet01}" , 
				   textAlign : "End", 
				   editable : false,
				   width : "100%"}).addStyleClass("FontFamily "),
		    hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Lbet02}" , 
				   textAlign : "End", 
				   editable : false,
				   width : "100%"}).addStyleClass("FontFamily"),
		    hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Lbet03}" , 
				   textAlign : "End", 
				   editable : false,
				   width : "100%"}).addStyleClass("FontFamily"),
		    hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Lbet04}" , 
				   textAlign : "End", 
				   editable : false,
				   width : "100%"}).addStyleClass("FontFamily"),
		    hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Lbet05}" , 
				   textAlign : "End", 
				   editable : false,
				   width : "100%"}).addStyleClass("FontFamily"),
		    hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Lbet06}" , 
				   textAlign : "End", 
				   editable : false,
				   width : "100%"}).addStyleClass("FontFamily"),
		    hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Lbet07}" , 
				   textAlign : "End", 
				   editable : false,
				   width : "100%"}).addStyleClass("FontFamily"),
		    hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Lbet08}" , 
				   textAlign : "End", 
				   editable : false,
				   width : "100%"}).addStyleClass("FontFamily"),
		    hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Lbet09}" , 
				   textAlign : "End", 
				   editable : false,
				   width : "100%"}).addStyleClass("FontFamily"),
		    hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({value : "{Lbet10}" , 
				   textAlign : "End", 
				   editable : false,
				   width : "100%"}).addStyleClass("FontFamily"),
		    hAlign : "Center" ,
		}).addStyleClass("MatrixData"); 
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		return oApplyInfoMatrix;
	},
	
	/**
	 * 목록테이블 rendering
	 * 
	 * @param oController
	 * @return sap.ui.table.Table
	 */
	getListTableRender : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
//			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			width : "100%",
			noData : "No data found",
			visibleRowCount : 1,
			extension : new sap.m.Toolbar({
				content : [
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onExport
					})
				]
			}).addStyleClass("ToolbarNoBottomLine"),
		});
		oTable.setModel(oController._DetailTableJSonModel);
		oTable.bindRows("/Data");
		
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
});