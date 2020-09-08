sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_ProdEvalYearDisp.fragment.ProdEvalYearDispPage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 38:성명
		{id: "Zzjiktlt", label : oBundleText.getText("LABEL_0770"), plabel : oBundleText.getText("LABEL_0770"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "140px"},	// 770:직급
		{id: "Evtgrtx", label : oBundleText.getText("LABEL_0787"), plabel : oBundleText.getText("LABEL_0787"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "140px"},	// 787:평가직급
		{id: "Orgtx", label : oBundleText.getText("LABEL_0028"), plabel : oBundleText.getText("LABEL_0028"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 28:부서
		{id: "Apgrp", label : oBundleText.getText("LABEL_0775"), plabel : oBundleText.getText("LABEL_0775"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "140px"},	// 775:평가그룹
		{id: "Apgrptx", label : oBundleText.getText("LABEL_0899"), plabel : oBundleText.getText("LABEL_0899"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 899:평가그룹명
		{id: "Adjid", label : oBundleText.getText("LABEL_0895"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 2, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번, 895:조정자
		{id: "Adjnm", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 38:성명
	 	{id: "Finpo", label : oBundleText.getText("LABEL_0896"), plabel : oBundleText.getText("LABEL_0896"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 896:최종점수
	 	{id: "Adjyn", label : oBundleText.getText("LABEL_0827"), plabel : oBundleText.getText("LABEL_0827"), resize : false, span : 0, type : "Checkbox2", sort : true, filter : true, width : "100px"},	// 827:조정여부
	 	{id: "Stdsd", label : oBundleText.getText("LABEL_0898"), plabel : oBundleText.getText("LABEL_0898"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"}	// 898:전사 표준편차
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
									sap.ui.jsfragment("fragment.TargetLayout", oController),				// 대상자
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
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
									text : oBundleText.getText("LABEL_0897")	// 897:연도별 평가결과 조회
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
					text : oBundleText.getText("LABEL_0777")	// 777:평가년도
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox({
					width : "150px",
					selectedKey : "{Evyer}",
					change : oController.onChangeEvyer,
					items : {
						path: "ZHR_APPRAISAL_DISP_SRV>/ApprEvyerSet",
						template: new sap.ui.core.ListItem({
							key: "{ZHR_APPRAISAL_DISP_SRV>Evyer}",
							text: "{ZHR_APPRAISAL_DISP_SRV>Evyertx}"
						})
					}
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0787")	// 787:평가직급
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox({
					width : "150px",
					selectedKey : "{Evtgr}",
					items : {
						path: "ZHR_APPRAISAL_DISP_SRV>/ApprEvtgrSet",
						template: new sap.ui.core.ListItem({
							key: "{ZHR_APPRAISAL_DISP_SRV>Evtgr}",
							text: "{ZHR_APPRAISAL_DISP_SRV>Evtgrtx}"
						})
					}
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0893")	// 893:1/2차평가그룹
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox(oController.PAGEID + "_Apgrp", {
					width : "150px",
					selectedKey : "{Apgrp}"
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0825")	// 825:조정권자 평가그룹
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox(oController.PAGEID + "_Adjgp", {
					width : "150px",
					selectedKey : "{Adjgp}"
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
						text : oBundleText.getText("LABEL_0016")	// 16:내역
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer()
				]
			}).addStyleClass("ToolbarNoBottomLine")
		})
		.setModel(oController._ListJSonModel)
		.bindRows("/Data");
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_ProdEvalYearDispList_Table-header-fixed-fixrow > tbody',
					colIndexes : [0, 1, 2, 3, 4]
				});
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_ProdEvalYearDispList_Table-header > tbody',
					colIndexes : [0, 1, 2, 5, 6, 7]
				});
			}
		});
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
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