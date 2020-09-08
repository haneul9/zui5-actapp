sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_ProductionEvaluation.fragment.ProductionEvaluationPage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "4%"},
	 	{id: "Orgtx", label : oBundleText.getText("LABEL_0792"), plabel : oBundleText.getText("LABEL_0028"), resize : false, span : 5, type : "string", sort : true, filter : true, width : "10%", align : sap.ui.core.TextAlign.Begin},	// 28:부서, 792:피평가자
	 	{id: "Perid", label : "", plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "6%"},	// 31:사번
	 	{id: "Ename", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "6%"},	// 38:성명
	 	{id: "Zzjiktlt", label : "", plabel : oBundleText.getText("LABEL_0770"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 770:직급
	 	{id: "Evtgrtx", label : "", plabel : oBundleText.getText("LABEL_0787"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 787:평가직급
	 	{id: "Evlevtx", label : oBundleText.getText("LABEL_0788"), plabel : oBundleText.getText("LABEL_0788"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "6%"},	// 788:평가차수
	 	{id: "Btnappr", label : oBundleText.getText("LABEL_0780"), plabel : oBundleText.getText("LABEL_0780"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 780:평가수행
	 	{id: "Apoint", label : oBundleText.getText("LABEL_0786"), plabel : oBundleText.getText("LABEL_0786"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "6%", align : sap.ui.core.TextAlign.End},	// 786:평가점수
	 	{id: "Rlt01Cnt", label : oBundleText.getText("LABEL_0774"), plabel : "100", resize : false, span : 5, type : "string", sort : true, filter : true, width : "4%"},	// 774:평가결과
	 	{id: "Rlt02Cnt", label : "", plabel : "80", resize : false, span : 0, type : "string", sort : true, filter : true, width : "4%"},
	 	{id: "Rlt03Cnt", label : "", plabel : "60", resize : false, span : 0, type : "string", sort : true, filter : true, width : "4%"},
	 	{id: "Rlt04Cnt", label : "", plabel : "40", resize : false, span : 0, type : "string", sort : true, filter : true, width : "4%"},
	 	{id: "Rlt05Cnt", label : "", plabel : "20", resize : false, span : 0, type : "string", sort : true, filter : true, width : "4%"},
	 	{id: "Itmcnt", label : oBundleText.getText("LABEL_0778"), plabel : oBundleText.getText("LABEL_0778"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "5%"},	// 778:평가대상 및 항목수
	 	{id: "Rltcnt", label : oBundleText.getText("LABEL_0781"), plabel : oBundleText.getText("LABEL_0781"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "5%"},	// 781:평가수행 및 항목수
	 	{id: "Pstattx", label : oBundleText.getText("LABEL_0779"), plabel : oBundleText.getText("LABEL_0779"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "8%"}	// 779:평가상태
	],
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.SearchUser1");
		jQuery.sap.require("common.ZHR_TABLES");
		
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
									text : oBundleText.getText("LABEL_0769")	// 769:생산직 본평가
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
						path: "ZHR_APPRAISAL_SRV>/ApprEvyerSet",
						template: new sap.ui.core.ListItem({
							key: "{ZHR_APPRAISAL_SRV>Evyer}",
							text: "{ZHR_APPRAISAL_SRV>Evyertx}"
						})
					}
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0775")	// 775:평가그룹
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox(oController.PAGEID + "_Apgrp", {
					width : "150px",
					selectedKey : "{Apgrp}"
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0788")	// 788:평가차수
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox(oController.PAGEID + "_Evlev", {
					width : "150px",
					selectedKey : "{Evlev}",
					items : {
						path: "ZHR_APPRAISAL_SRV>/ApprEvlevSet",
						template: new sap.ui.core.ListItem({
							key: "{ZHR_APPRAISAL_SRV>Evlev}",
							text: "{ZHR_APPRAISAL_SRV>Evlevtx}"
						})
					}
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0787")	// 787:평가직급
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox(oController.PAGEID + "_Evtgr", {
					width : "150px",
					selectedKey : "{Evtgr}",
					items : {
						path: "ZHR_APPRAISAL_SRV>/ApprEvtgrSet",
						template: new sap.ui.core.ListItem({
							key: "{ZHR_APPRAISAL_SRV>Evtgr}",
							text: "{ZHR_APPRAISAL_SRV>Evtgrtx}"
						})
					}
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0779")	// 779:평가상태
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox(oController.PAGEID + "_Pstat", {
					width : "150px",
					selectedKey : "{Pstat}",
					items : {
						path: "ZHR_APPRAISAL_SRV>/ApprPstatSet",
						template: new sap.ui.core.ListItem({
							key: "{ZHR_APPRAISAL_SRV>Pstat}",
							text: "{ZHR_APPRAISAL_SRV>Pstattx}"
						})
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
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0772")	// 772:총인원
					}).addStyleClass("MiddleTitle"),
					new sap.m.Text(oController.PAGEID + "_TotalCount", {
						text : ""
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						icon : "sap-icon://accept",
						text : oBundleText.getText("LABEL_2954"),	// 2954:평가완료
						press : oController.onPressAllSave,
						visible : {
							parts : [{path : "hasRow"}],
							formatter : function(fVal) {
								return (fVal == "X") ? true : false;
							}
						}
					
					})
					.setModel(oController._ListCondJSonModel)
					.bindElement("/Data")
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
					selector : '#ZUI5_HR_ProductionEvaluationList_Table-header > tbody',
					colIndexes : [0, 6, 7, 8, 14, 15, 16]
				});
			}
		});
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
		oTable.getColumns()[7].setTemplate(new sap.m.Button({
			text : oBundleText.getText("LABEL_0773"),	// 773:평가
			type : sap.m.ButtonType.Ghost,
			press : oController.openEvaluationDialog,
			customData : [
				new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"})
			]
		}));
		
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