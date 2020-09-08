sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_CommuteRecordIndv.fragment.CommuteRecordIndvPage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Txdat", label : oBundleText.getText("LABEL_0057"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 57:일자
		{id: "Daytx", label : oBundleText.getText("LABEL_0054"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "60px"},	// 54:요일
		{id: "Holyn", label : oBundleText.getText("LABEL_0504"), plabel : "", span : 0, type : "Checkbox2", sort : true, filter : true, width : "90px"},	// 504:휴일여부
		{id: "Orgtx", label : oBundleText.getText("LABEL_0028"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 28:부서
		{id: "Schty", label : oBundleText.getText("LABEL_0013"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.Begin},	// 근무형태
		{id: "Schsh", label : oBundleText.getText("LABEL_0624"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 624:근무조
		{id: "Schdy", label : oBundleText.getText("LABEL_0671"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "140px", align : sap.ui.core.TextAlign.Begin},	// 671:근무시간
		{id: "Fsubs", label : oBundleText.getText("LABEL_2886"), plabel : "", span : 0, type : "Checkbox4", sort : true, filter : true, width : "100px"},	// 2886:예외근무
		{id: "Abstx", label : oBundleText.getText("LABEL_0625"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 625:근태항목
		{id: "Tschd", label : oBundleText.getText("LABEL_0634"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Tovrt", label : oBundleText.getText("LABEL_0693"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 693:특근
		{id: "Totex", label : oBundleText.getText("LABEL_0643"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 643:특근연장
		{id: "Tnght", label : oBundleText.getText("LABEL_0691"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 691:심야
		{id: "Ottxt", label : oBundleText.getText("LABEL_0690"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "250px", align : sap.ui.core.TextAlign.Begin},	// 690:세부내역
		{id: "Cmnt0", label : oBundleText.getText("LABEL_0684"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "250px"},	// 684:개인확인커멘트
		{id: "Cmnta", label : oBundleText.getText("LABEL_0686"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "250px", align : sap.ui.core.TextAlign.Begin}	// 686:관리부서 기록사항
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
									this.getTotalMatrixRender(oController),									// 근태정보
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
									text : oBundleText.getText("LABEL_0688")	// 688:근태기록부확인(개인)
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
		.addStyleClass("FilterLayout")
		.setModel(oController._ListCondJSonModel)
		.bindElement("/Data");
	},
	
	getTotalMatrixRender : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 월일수
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0692")	// 692:월일수
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							width : "45%",
							value : "{Dmont}",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 교대근무일수
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0687")	// 687:교대근무일수
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							width : "45%",
							value : "{Dshft}",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 고정특근시간
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0685")	// 685:고정특근시간
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							width : "45%",
							value : "{Tfxot}",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 정상근무
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0634")	// 634:정상근무
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							width : "45%",
							value : "{Tschd}",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 특근시간
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0586")	// 586:특근시간
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							width : "45%",
							value : "{Tovrt}",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 특근연장시간
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0694")	// 694:특근연장시간
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							width : "45%",
							value : "{Totex}",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 심야시간
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0633")	// 633:심야시간
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							width : "45%",
							value : "{Tnght}",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 4,
						content : new sap.m.Text({
							text : ""
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			})
		];
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_0688") 	// 688:근태기록부확인(개인)
						}).addStyleClass("MiddleTitle"),
						new sap.m.ToolbarSpacer(),
						new sap.m.Button({
							text : oBundleText.getText("LABEL_0683"),	// 683:개인확인
							type : sap.m.ButtonType.Ghost,
							press : oController.onPressConfirm,
							visible : {
								path : "Conf0",
								formatter : function(fVal) {
									return (fVal == "X") ? false : true;
								}
							}
						}).addStyleClass("L2PFontFamily")
					]
				}).addStyleClass("ToolbarNoBottomLine marginBottom10px"), 
				new sap.ui.commons.layout.MatrixLayout({
					columns : 6,
					widths : ['11%', '22%', '11%', '22%', '11%', '23%'],
					rows : aRows
				})
			]
		})
		.setModel(oController._DetailJSonModel)
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
			fixedColumnCount : 4,
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0016")	// 16:내역
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button(oController.PAGEID + "_BtnSave", {
						text: oBundleText.getText("LABEL_0177"),	// 177:저장
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressSave,
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
		
		oTable.getColumns()[15].setTemplate(new sap.m.Input({
			value : "{Cmnt0}",
			editable : {
				path : "isEdit",
				formatter : function(fVal) {
					return fVal;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
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
		}).addStyleClass("marginBottom10px");
	}
});