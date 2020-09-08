sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_RookieEvaluation.fragment.RookieEvaluationPage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "4%"},
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "12%"},	// 38:성명
		{id: "Zzjiktlt", label : oBundleText.getText("LABEL_0770"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "15%"},	// 770:직급
		{id: "Evtgrtx", label : oBundleText.getText("LABEL_0833"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "15%"},	// 833:평가용직급
		{id: "Orgtx", label : oBundleText.getText("LABEL_0815"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "20%", align : sap.ui.core.TextAlign.Begin},	// 815:부서명
		{id: "HiredateTxt", label : oBundleText.getText("LABEL_0379"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "12%"},	// 279:입사일자
		{id: "Comstatx", label : oBundleText.getText("LABEL_0821"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "12%"}	// 821:입력상태
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
//									new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
//									sap.ui.jsfragment("fragment.TargetLayout", oController),				// 대상자
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
									this.getFilterLayoutRender(oController),								// 검색필터
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
									this.getListTableRender(oController),									// 목록
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
									this.getEvalInputRender(oController)									// 평가항목
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
									text : oBundleText.getText("LABEL_2945")	// 2945:신입사원 역량평가
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
						path: "ZHR_APPRAISAL_FRESH_SRV>/ApprEvyerSet",
						template: new sap.ui.core.ListItem({
							key: "{ZHR_APPRAISAL_FRESH_SRV>Evyer}",
							text: "{ZHR_APPRAISAL_FRESH_SRV>Evyertx}"
						})
					}
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_2946")	// 2946:평가자 사번
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.Input(oController.PAGEID + "_Anam01", {
					width : "150px",
					showValueHelp: true,
					valueHelpOnly: false,
					value : "{Anam01}",
					customData : new sap.ui.core.CustomData({key : "Aper01", value : "{Aper01}"}),
					change : oController.EmpSearchByTx,
					valueHelpRequest: oController.displayEmpSearchDialog,
					visible : displayYn
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
						text : oBundleText.getText("LABEL_0111")	// 111:대상자
					}).addStyleClass("MiddleTitle")
				]
			}).addStyleClass("ToolbarNoBottomLine")
		})
		.setModel(oController._ListJSonModel)
		.bindRows("/Data")
		.attachCellClick(oController.onSelectEvalRow);
		
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
	},
	
	/**
	 * 평가 항목 입력 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getEvalInputRender : function(oController) {
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "40px",
				cells : [
					// 피평가자
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0792") 	// 792:피평가자
						}).addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PMatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{Perid} {Ename}",
						}).addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PMatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "130px",
				cells : [
					// 평가 항목
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0789") 	// 789:평가항목
						}).addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PMatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.TextArea({
							value : "{Evtim}",
							width : "99%",
							rows : 6,
							editable : false
						}).addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PMatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "130px",
				cells : [
					// 뛰어난 점
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2947") 	// 2947:뛰어난 점
						}).addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PMatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.TextArea({
							value : "{Apcom}",
							width : "99%",
							maxLength : common.Common.getODataPropertyLength("ZHR_APPRAISAL_ADJ_SRV", "ApprAppl", "Apcom"),
							rows : 6,
							editable : {
								path : "Comsta",
								formatter : function(fVal1) {
									return (fVal1 == "" || fVal1 == "1") ? true : false;
								}
							}
						}).addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PMatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "130px",
				cells : [
					// 보완이 필요한 점
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2948") 	// 2948:보완이 필요한 점
						}).addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PMatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.TextArea({
							value : "{Apadd}",
							width : "99%",
							maxLength : common.Common.getODataPropertyLength("ZHR_APPRAISAL_ADJ_SRV", "ApprAppl", "Apadd"),
							rows : 6,
							editable : {
								path : "Comsta",
								formatter : function(fVal1) {
									return (fVal1 == "" || fVal1 == "1") ? true : false;
								}
							}
						}).addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PMatrixData")
				]
			})
		];
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "35px",
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_0817") 	// 817:의견기술
						}).addStyleClass("MiddleTitle"),
						new sap.m.ToolbarSpacer(),
						new sap.m.Button(oController.PAGEID + "_btnCommentSave", {
							text : oBundleText.getText("LABEL_0177"),	// 177:저장
							type : "Default",
							icon : "sap-icon://save",
							press : oController.onPressCommentSaveT,
							visible : false
						}).addStyleClass("L2PFontFamily"),
						new sap.m.Button(oController.PAGEID + "_btnCommentConfirm", {
							text : oBundleText.getText("LABEL_0816"),	// 816:완료
							type : "Default",
							icon : "sap-icon://complete",
							press : oController.onPressCommentSaveC,
							visible : false
						}).addStyleClass("L2PFontFamily")
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"), 
				new sap.ui.commons.layout.MatrixLayout({
					columns : 2,
					widths : ['20%', '80%'],
					rows : aRows
				})
				.setModel(oController._EvalDetailJSonModel)
				.bindElement("/Data")
			]
		});
	}
});