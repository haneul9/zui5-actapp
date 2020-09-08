sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_WorktimeReportOrg.fragment.WorktimeReportOrgPage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Orgtx", label : oBundleText.getText("LABEL_0028"), plabel : oBundleText.getText("LABEL_0028"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 28:부서
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "70px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "90px"},	// 38:성명
		{id: "Rtext", label : oBundleText.getText("LABEL_0624"), plabel : oBundleText.getText("LABEL_0624"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 624:근무조
		{id: "Wrkjobt", label : oBundleText.getText("LABEL_0010"), plabel : oBundleText.getText("LABEL_0010"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 근무직
		{id: "Wtm01", label : oBundleText.getText("LABEL_0910"), plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무, 910:기간평균근로시간
		{id: "Wtm02", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm03", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm05", label : oBundleText.getText("LABEL_0908"), plabel : oBundleText.getText("LABEL_0908"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "110px", align : sap.ui.core.TextAlign.End},	// 908:3개월시간외근무가능잔여시간
		{id: "Wtm011", label : "Week1", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm012", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm013", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm021", label : "Week2", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm022", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm023", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm031", label : "Week3", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm032", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm033", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm041", label : "Week4", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm042", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm043", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm051", label : "Week5", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm052", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm053", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm061", label : "Week6", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm062", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm063", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm071", label : "Week7", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm072", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm073", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm081", label : "Week8", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm082", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm083", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm091", label : "Week9", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm092", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm093", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm101", label : "Week10", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm102", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm103", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm111", label : "Week11", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm112", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm113", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm121", label : "Week12", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm122", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm123", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm131", label : "Week13", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm132", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm133", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
		{id: "Wtm141", label : "Week14", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 634:정상근무
		{id: "Wtm142", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 629:시간외근무
		{id: "Wtm143", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 637:총근로
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
									text : oBundleText.getText("LABEL_0909")	// 909:근로시간 조회(부서별/기간지정)
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
					text : oBundleText.getText("LABEL_0911")	// 911:기준년도
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.Input({
					width : "150px",
					value : "{Zyear}",
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0115")	// 115:분기
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox({
					width : "150px",
					selectedKey : "{Quarter}",
					change : oController.onChangeQuarter,
					items : [
						new sap.ui.core.Item({key : "1", text : oBundleText.getText("LABEL_0904")}),	// 904:1분기
						new sap.ui.core.Item({key : "2", text : oBundleText.getText("LABEL_0905")}),	// 905:2분기
						new sap.ui.core.Item({key : "3", text : oBundleText.getText("LABEL_0906")}),	// 906:3분기
						new sap.ui.core.Item({key : "4", text : oBundleText.getText("LABEL_0907")})		// 907:4분기
					]
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
							return fVal == "E" ? false : true;
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
						text : oBundleText.getText("LABEL_0909")	// 909:근로시간 조회(부서별/기간지정)
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
					selector : '#ZUI5_HR_WorktimeReportOrgList_Table-header-fixed-fixrow > tbody',
					colIndexes : [0, 1, 2, 3, 4]
				});
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_WorktimeReportOrgList_Table-header > tbody',
					colIndexes : [0, 4]
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