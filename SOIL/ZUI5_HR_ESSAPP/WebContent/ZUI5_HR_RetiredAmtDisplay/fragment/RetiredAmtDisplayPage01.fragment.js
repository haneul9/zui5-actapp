sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_RetiredAmtDisplay.fragment.RetiredAmtDisplayPage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Entda", label : oBundleText.getText("LABEL_0090"), plabel : oBundleText.getText("LABEL_0090"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 90:입사일
		{id: "Estda", label : oBundleText.getText("LABEL_0740"), plabel : oBundleText.getText("LABEL_0740"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 740:정산일
		{id: "Calstda", label : oBundleText.getText("LABEL_0732"), plabel : oBundleText.getText("LABEL_0732"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 732:계산시작일
		{id: "Calenda", label : oBundleText.getText("LABEL_0733"), plabel : oBundleText.getText("LABEL_0733"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 733:계산종료일
		{id: "CaldaFrs", label : oBundleText.getText("LABEL_0744"), plabel : oBundleText.getText("LABEL_0744"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 744:최초정산일
		{id: "CladaAdd", label : oBundleText.getText("LABEL_0745"), plabel : oBundleText.getText("LABEL_0745"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 745:추가정산일
		{id: "CaldaDif", label : oBundleText.getText("LABEL_0743"), plabel : oBundleText.getText("LABEL_0743"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 743:차이정산일
		{id: "CaldaMid", label : oBundleText.getText("LABEL_0741"), plabel : oBundleText.getText("LABEL_0741"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 741:중간정산일
		{id: "Dcchda", label : oBundleText.getText("LABEL_0731"), plabel : oBundleText.getText("LABEL_0731"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 731:DB 전환일
		{id: "Asvry", label : oBundleText.getText("LABEL_0734"), plabel : oBundleText.getText("LABEL_0738"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 734:근속기간, 738:연수
		{id: "Asvrm", label : "", plabel : oBundleText.getText("LABEL_0739"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 739:월수
		{id: "Asvrd", label : "", plabel : oBundleText.getText("LABEL_0159"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 159:일수
		{id: "Rolrte", label : oBundleText.getText("LABEL_0742"), plabel : oBundleText.getText("LABEL_0742"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 742:지급율
		{id: "Avpay", label : oBundleText.getText("LABEL_0735"), plabel : oBundleText.getText("LABEL_0735"), resize : false, span : 0, type : "money", sort : true, filter : true, width : "140px", align : sap.ui.core.TextAlign.End},	// 735:급여평균
		{id: "Avbns", label : oBundleText.getText("LABEL_0736"), plabel : oBundleText.getText("LABEL_0736"), resize : false, span : 0, type : "money", sort : true, filter : true, width : "140px", align : sap.ui.core.TextAlign.End},	// 736:상여평균
		{id: "Avetc", label : oBundleText.getText("LABEL_0737"), plabel : oBundleText.getText("LABEL_0737"), resize : false, span : 0, type : "money", sort : true, filter : true, width : "140px", align : sap.ui.core.TextAlign.End},	// 737:시간외근무평균
		{id: "Avamt", label : oBundleText.getText("LABEL_0748"), plabel : oBundleText.getText("LABEL_0748"), resize : false, span : 0, type : "money", sort : true, filter : true, width : "140px", align : sap.ui.core.TextAlign.End},	// 748:평균임금
		{id: "Esamt", label : oBundleText.getText("LABEL_0746"), plabel : oBundleText.getText("LABEL_0746"), resize : false, span : 0, type : "money", sort : true, filter : true, width : "140px", align : sap.ui.core.TextAlign.End}	// 746:추계액
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
									text : oBundleText.getText("LABEL_0747")	// 747:퇴직 추계액 조회
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
					text : oBundleText.getText("LABEL_0084"),	// 84:신청자 성명 
					visible : displayYn
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.Input(oController.PAGEID + "_Ename", {
					width : "150px",
					showValueHelp: true,
					valueHelpOnly: false,
					value : "{Ename}",
					customData : new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"}),
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
						text : oBundleText.getText("LABEL_0747")	// 747:퇴직 추계액 조회
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
					selector : '#ZUI5_HR_RetiredAmtDisplayList_Table-header-fixed-fixrow > tbody',
					colIndexes : [0, 1, 2, 3, 4]
				});
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_RetiredAmtDisplayList_Table-header > tbody',
					colIndexes : [0, 1, 2, 3, 4, 8, 9, 10, 11, 12, 13]
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