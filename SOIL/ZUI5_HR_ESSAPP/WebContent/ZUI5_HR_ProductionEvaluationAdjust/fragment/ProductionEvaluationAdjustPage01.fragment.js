sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_ProductionEvaluationAdjust.fragment.ProductionEvaluationAdjustPage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "50px"},
	 	{id: "Evtgrtx", label : oBundleText.getText("LABEL_0792"), plabel : oBundleText.getText("LABEL_0787"), resize : false, span : 4, type : "string", sort : true, filter : true, width : "140px", align : sap.ui.core.TextAlign.Begin},	// 787:평가직급, 792:피평가자
	 	{id: "Orgtx", label : "", plabel : oBundleText.getText("LABEL_0028"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 28:부서
	 	{id: "Perid", label : "", plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번
	 	{id: "Ename", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 38:성명
	 	{id: "Aotx01", label : oBundleText.getText("LABEL_0813"), plabel : oBundleText.getText("LABEL_0775"), resize : false, span : 4, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 775:평가그룹, 813:1차평가자
	 	{id: "Apid01", label : "", plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번
	 	{id: "Anam01", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 38:성명
	 	{id: "Adpo01", label : "", plabel : oBundleText.getText("LABEL_0828"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 828:조정점수
	 	{id: "Aotx02", label : oBundleText.getText("LABEL_0814"), plabel : oBundleText.getText("LABEL_0775"), resize : false, span : 4, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 775:평가그룹, 814:2차평가자
	 	{id: "Apid02", label : "", plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번
	 	{id: "Anam02", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 38:성명
	 	{id: "Adpo02", label : "", plabel : oBundleText.getText("LABEL_0828"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 828:조정점수
	 	{id: "Totpo", label : oBundleText.getText("LABEL_0824"), plabel : oBundleText.getText("LABEL_0824"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 824:조정(합산)점수
	 	{id: "Stdsd", label : oBundleText.getText("LABEL_0822"), plabel : oBundleText.getText("LABEL_0822"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 822:전사표준편차
	 	{id: "Fpadj", label : oBundleText.getText("LABEL_0823"), plabel : oBundleText.getText("LABEL_0823"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 823:점수조정
	 	{id: "Finpo", label : oBundleText.getText("LABEL_0830"), plabel : oBundleText.getText("LABEL_0830"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px", align : sap.ui.core.TextAlign.End},	// 830:종합평가점수
	 	{id: "Adjyn", label : oBundleText.getText("LABEL_0827"), plabel : oBundleText.getText("LABEL_0827"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 827:조정여부
	 	{id: "Adjcn", label : oBundleText.getText("LABEL_0829"), plabel : oBundleText.getText("LABEL_0829"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 829:조정취소
	 	{id: "Adjsttx", label : oBundleText.getText("LABEL_0779"), plabel : oBundleText.getText("LABEL_0779"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 779:평가상태
	 	{id: "Comyn", label : oBundleText.getText("LABEL_0819"), plabel : oBundleText.getText("LABEL_0819"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 819:의견여부
	 	{id: "Comstatx", label : oBundleText.getText("LABEL_0818"), plabel : oBundleText.getText("LABEL_0818"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"}	// 818:의견상태
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
									text : oBundleText.getText("LABEL_0835")	// 835:생산직 평가조정
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
						path: "ZHR_APPRAISAL_ADJ_SRV>/ApprEvyerSet",
						template: new sap.ui.core.ListItem({
							key: "{ZHR_APPRAISAL_ADJ_SRV>Evyer}",
							text: "{ZHR_APPRAISAL_ADJ_SRV>Evyertx}"
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
					change : oController.onChangeEvtgr,
					items : {
						path: "ZHR_APPRAISAL_ADJ_SRV>/ApprEvtgrSet",
						template: new sap.ui.core.ListItem({
							key: "{ZHR_APPRAISAL_ADJ_SRV>Evtgr}",
							text: "{ZHR_APPRAISAL_ADJ_SRV>Evtgrtx}"
						})
					}
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
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0826")	// 826:조정권자 평가상태
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox({
					width : "150px",
					selectedKey : "{Adjst}",
					editable : true,
					items : {
						path: "ZHR_APPRAISAL_ADJ_SRV>/ApprPstatSet",
						template: new sap.ui.core.ListItem({
							key: "{ZHR_APPRAISAL_ADJ_SRV>Pstat}",
							text: "{ZHR_APPRAISAL_ADJ_SRV>Pstattx}"
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
			fixedColumnCount : 5,
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
					new sap.m.Button(oController.PAGEID + "_btnSave", {
						text: oBundleText.getText("LABEL_0177"),	// 177:저장
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressSaveT,
						visible : false
					}),
					new sap.m.Button(oController.PAGEID + "_btnConfirm", {
						text: oBundleText.getText("LABEL_0816"),	// 816:완료
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressSaveC,
						visible : false
					}),
					new sap.m.Button(oController.PAGEID + "_btnComment", {
						text: oBundleText.getText("LABEL_0820"),	// 820:의견입력
						type : sap.m.ButtonType.Ghost,
						press : oController.openEvaluationDialog,
						visible : false
					})
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
					selector : '#ZUI5_HR_ProductionEvaluationAdjustList_Table-header-fixed-fixrow > tbody',
					colIndexes : [0]
				});
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_ProductionEvaluationAdjustList_Table-header > tbody',
					colIndexes : [8, 9, 10, 11, 12, 13, 14, 15, 16]
				});
			}
		});
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
		// 점수조정
		oTable.getColumns()[15].setTemplate(new sap.m.ComboBox({
			items : {
				path : "/Fpadjs",
				template : new sap.ui.core.ListItem({
					key : "{Fpadj}",
					text : "{Fpadjtx}"
				}),
				templateShareable : true
			},
			selectedKey : "{Fpadj}",
			change : oController.onChangeFpadj,
			editable : {
				parts : [{path : "Readonly"}],
				formatter : function(fVal1) {
					return !fVal1;
				}
			}
		}).addStyleClass("FontFamily"));
		
		// 조정여부
		oTable.getColumns()[17].setTemplate(new sap.m.CheckBox({
			selected : "{Adjyn}",
			editable : false
		}));

		// 조정취소
		oTable.getColumns()[18].setTemplate(new sap.m.CheckBox({
			selected : "{Adjcn}",
			select : oController.onChageAdjcn,
			editable : {
				parts : [{path : "Readonly"}, {path : "Fpadj"}],
				formatter : function(fVal1, fVal2){
					return (!fVal1 && (fVal2 && fVal2 != "0.00")) ? true : false;
				}
			}
		}));
		
		// 의견여부
		oTable.getColumns()[20].setTemplate(new sap.m.CheckBox({
			selected : "{Comyn}",
			editable : false
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