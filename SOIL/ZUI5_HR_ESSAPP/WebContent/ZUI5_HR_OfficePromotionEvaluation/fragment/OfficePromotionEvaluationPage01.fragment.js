sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_OfficePromotionEvaluation.fragment.OfficePromotionEvaluationPage01", {
	
	_colModelA : [
		{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 38:성명
		{id: "PhotoUrl", label : oBundleText.getText("LABEL_0935"), plabel : oBundleText.getText("LABEL_0935"), resize : false, span : 0, type : "image", sort : false, filter : false, width : "55px"},	// 935:사진
		{id: "Age", label : oBundleText.getText("LABEL_0953"), plabel : oBundleText.getText("LABEL_0953"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 953:연령
		{id: "Gescht", label : oBundleText.getText("LABEL_1862"), plabel : oBundleText.getText("LABEL_1862"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 1862:성별
		{id: "Zzjiktlt", label : oBundleText.getText("LABEL_0770"), plabel : oBundleText.getText("LABEL_0770"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 770:직급
		{id: "Orgtx", label : oBundleText.getText("LABEL_0960"), plabel : oBundleText.getText("LABEL_0960"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 960:조직명
		{id: "HiredateTxt", label : oBundleText.getText("LABEL_0090"), plabel : oBundleText.getText("LABEL_0090"), resize : false, span : 0, type : "string", sort : true, filter : false, width : "100px"},	// 90:입사일
		{id: "Svryrmn", label : oBundleText.getText("LABEL_0926"), plabel : oBundleText.getText("LABEL_0926"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 926:근속(년/월)
		{id: "Dat04Txt", label : oBundleText.getText("LABEL_0949"), plabel : oBundleText.getText("LABEL_0949"), resize : false, span : 0, type : "string", sort : true, filter : false, width : "100px"},	// 949:승진일
		{id: "Sjnyrmn", label : oBundleText.getText("LABEL_0941"), plabel : oBundleText.getText("LABEL_0941"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 941:승진(년/월)
		{id: "Slarttx", label : oBundleText.getText("LABEL_0993"), plabel : oBundleText.getText("LABEL_0993"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "140px", align : sap.ui.core.TextAlign.Begin},	// 993:학력
		{id: "Evp01", label : oBundleText.getText("LABEL_0773"), plabel : "\'#", resize : false, span : 8, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 773:평가
		{id: "Evp02", label : "", plabel : "\'#", resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},
		{id: "Evp03", label : "", plabel : "\'#", resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},
		{id: "Evp04", label : "", plabel : "\'#", resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},
		{id: "Evp05", label : "", plabel : "\'#", resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},
		{id: "Evpot", label : "", plabel : oBundleText.getText("LABEL_0142"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 142:합계
		{id: "Trdsc", label : "", plabel : "Trend", resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},
		{id: "Evtsc", label : "", plabel : oBundleText.getText("LABEL_0983"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 983:소계(A)
		{id: "Lansc", label : oBundleText.getText("LABEL_0978"), plabel : oBundleText.getText("LABEL_0986"), resize : false, span : 10, type : "string", sort : true, filter : true, width : "60px"},	// 978:가점, 986:외국어
		{id: "Przsc", label : "", plabel : oBundleText.getText("LABEL_0967"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "60px"},	// 967:표창
		{id: "Csrsc", label : "", plabel : "CSR", resize : false, span : 0, type : "string", sort : true, filter : true, width : "60px"},
		{id: "Mensc", label : "", plabel : oBundleText.getText("LABEL_0980"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "60px"},	// 980:멘토링
		{id: "Licsc", label : "", plabel : oBundleText.getText("LABEL_0987"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "60px"},	// 987:자격증
		{id: "Jobsc", label : "", plabel : "Job Rotate", resize : false, span : 0, type : "string", sort : true, filter : true, width : "60px"},
		{id: "Lecsc", label : "", plabel : oBundleText.getText("LABEL_0981"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "60px"},	// 981:사내강사
		{id: "Skosc", label : "", plabel : oBundleText.getText("LABEL_0929"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "60px"},	// 929:병가
		{id: "Facsc", label : "", plabel : oBundleText.getText("LABEL_0979"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "60px"},	// 979:공장근무
		{id: "Addsc", label : "", plabel : oBundleText.getText("LABEL_0984"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "60px"},	// 984:소계(B)
		{id: "Sjnsc", label : oBundleText.getText("LABEL_0989"), plabel : oBundleText.getText("LABEL_0989"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 989:총점
		{id: "Sjsco", label : oBundleText.getText("LABEL_0985"), plabel : oBundleText.getText("LABEL_0985"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "90px", align : sap.ui.core.TextAlign.End},	// 985:승진자격점수
		//32
		{id: "Avr50", label : oBundleText.getText("LABEL_0994"), plabel : oBundleText.getText("LABEL_0994"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 994:할당점수
		//33
		{id: "Pri50", label : oBundleText.getText("LABEL_0992"), plabel : oBundleText.getText("LABEL_0992"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 992:추천점수(본부장)
		//34
		{id: "Pri50", label : oBundleText.getText("LABEL_0991"), plabel : oBundleText.getText("LABEL_0991"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 991:추천점수
		//35
		{id: "Pri30", label : oBundleText.getText("LABEL_0991"), plabel : oBundleText.getText("LABEL_0991"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 991:추천점수
		//36
		{id: "Pri00", label : oBundleText.getText("LABEL_0990"), plabel : oBundleText.getText("LABEL_0990"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 990:총점(최종)
		{id: "Zbigo", label : oBundleText.getText("LABEL_0096"), plabel : oBundleText.getText("LABEL_0096"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "200px", align : sap.ui.core.TextAlign.Begin},	// 96:비고
		{id: "Sjstatx", label : oBundleText.getText("LABEL_0961"), plabel : oBundleText.getText("LABEL_0961"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"}	// 961:진행상태
	],
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.SearchUser1");
		jQuery.sap.require("common.ZHR_TABLES");
		
		var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
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
									this.getListTableRender(oController)
								]
							})
							.addStyleClass("sapUiSizeCompact")
						})
					]
				})
			]
		});
		
		return oMatrixLayout;
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
									text : oBundleText.getText("LABEL_0982")	// 982:사무직 승진자 평가
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
					text : oBundleText.getText("LABEL_0942")	// 942:승진년도
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox(oController.PAGEID + "_SjyerC", {
					width : "150px",
					selectedKey : "{SjyerC}",
					change : oController.onChangeSjyerC,
					items : {
						path: "ZHR_OFIC_PROMOTION_SRV>/SjyerListSet",
						template: new sap.ui.core.ListItem({
							key: "{ZHR_OFIC_PROMOTION_SRV>Sjyer}",
							text: "{ZHR_OFIC_PROMOTION_SRV>Sjyertx}"
						})
					}
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0951")	// 951:승진직급
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox(oController.PAGEID + "_SjktlC", {
					width : "150px",
					selectedKey : "{SjktlC}"
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0960")	// 960:조직명
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox(oController.PAGEID + "_ApgrpC", {
					width : "150px",
					selectedKey : "{ApgrpC}"
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0961")	// 961:진행상태
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox(oController.PAGEID + "_SjstaC", {
					width : "150px",
					selectedKey : "{SjstaC}",
					items : {
						path: "ZHR_OFIC_PROMOTION_SRV>/SjstaListSet",
						template: new sap.ui.core.ListItem({
							key: "{ZHR_OFIC_PROMOTION_SRV>Sjsta}",
							text: "{ZHR_OFIC_PROMOTION_SRV>Sjstatx}"
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
				new sap.m.Button({
					text: oBundleText.getText("LABEL_0177"),	// 177:저장
					press : oController.onPressSaveT,
					visible : {
						parts : [{path : "Inputok"}, {path : "Sjlev"}, {path : "isReadOnly"}],
						formatter : function(fVal1, fVal3, fVal4) {
							return fVal1 === true && fVal3 && fVal4 === false ? true : false;
						}
					}
				}),
				new sap.m.Button({
					text: oBundleText.getText("LABEL_0816"),	// 816:완료
					press : oController.onPressSaveC,
					visible : {
						parts : [{path : "Inputok"}, {path : "Sjlev"}, {path : "isReadOnly"}],
						formatter : function(fVal1, fVal3, fVal4) {
							return fVal1 === true && fVal3 && fVal4 === false ? true : false;
						}
					}
				}),
				new sap.m.Button({
					text: oBundleText.getText("LABEL_0959"),	// 959:정렬(순위)
					press : oController.onCalcSort,
					visible : {
						parts : [{path : "Inputok"}, {path : "Sjlev"}, {path : "isReadOnly"}],
						formatter : function(fVal1, fVal3, fVal4) {
							return fVal1 === true && fVal3 && fVal4 === false ? true : false;
						}
					}
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
			columnHeaderHeight : 35,
			rowHeight : 61,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			fixedColumnCount : 5,
			extension : new sap.m.Toolbar({	
				content : [
					new sap.ui.core.Icon({
						src: "sap-icon://open-command-field", 
						size : "1.0rem"
					}),
					new sap.m.ToolbarSpacer({width: "5px"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0944") 	// 944:승진대상자
					}).addStyleClass("L2PFontFamilyBold")
				]
			}).addStyleClass("L2PToolbarNoBottomLine")
		})
		.setModel(oController._ListJSonModel)
		.bindRows("/Data");
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oController = sap.ui.getCore().byId("ZUI5_HR_OfficePromotionEvaluation.ZUI5_HR_OfficePromotionEvaluationList").getController(),
					vSjlev = oController._ListCondJSonModel.getProperty("/Data/Sjlev"),
					rowspanIndexes = [];
				
				if(vSjlev == "1") {
					rowspanIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 26, 27, 28, 29, 30, 31, 32];
				} else {
					rowspanIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 26, 27, 28, 29, 30, 31, 32, 33];
				}
				
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_OfficePromotionEvaluationList_Table-header-fixed-fixrow > tbody',
					colIndexes : [0, 1, 2, 3, 4]
				});
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_OfficePromotionEvaluationList_Table-header > tbody',
					colIndexes : rowspanIndexes
				});

				common.Common.generateRowspan({
					selector : '#ZUI5_HR_OfficePromotionEvaluationList_Table-table > tbody',
					colIndexes : [28]
				});
				
				$('#ZUI5_HR_OfficePromotionEvaluationList_Table-table > tbody > tr').eq(0).find('td').eq(28).show();
			}
		});
		
		var currYear = new Date().getFullYear() - 2000;
		
		this._colModelA[13].plabel = this._colModelA[13].plabel.replace(/#/g, String(currYear - 5));
		this._colModelA[14].plabel = this._colModelA[14].plabel.replace(/#/g, String(currYear - 4));
		this._colModelA[15].plabel = this._colModelA[15].plabel.replace(/#/g, String(currYear - 3));
		this._colModelA[16].plabel = this._colModelA[16].plabel.replace(/#/g, String(currYear - 2));
		this._colModelA[17].plabel = this._colModelA[17].plabel.replace(/#/g, String(currYear - 1));
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModelA);
		
		// 추천점수 - 본부장
		oTable.getColumns()[35].setTemplate(new sap.m.ComboBox({
			selectedKey : "{Pri50}",
			change : oController.onChangePri50,
			editable : {
				parts : [{path : "Readonly"}, {path : "Inputok"}],
				formatter : function(fVal1, fVal2) {
					return (fVal1 === false && fVal2 === true) ? true : false;
				}
			},
			items : {
				path : "/Priscs",
				template : new sap.ui.core.ListItem({
					key : "{key}",
					text : "{Prisc}"
				}),
				templateShareable : true
			}
		}).addStyleClass("Font14px FontColor3"));

		// 추천점수 - 총괄
		oTable.getColumns()[36].setTemplate(new sap.m.ComboBox({
			selectedKey : "{Pri30}",
			change : oController.onChangePri30,
			editable : {
				parts : [{path : "Readonly"}, {path : "Inputok"}],
				formatter : function(fVal1, fVal2) {
					return (fVal1 === false && fVal2 === true) ? true : false;
				}
			},
			items : {
				path : "/Priscs",
				template : new sap.ui.core.ListItem({
					key : "{key}",
					text : "{Prisc}"
				}),
				templateShareable : true
			}
		}).addStyleClass("Font14px FontColor3"));
		
		// 비고
		oTable.getColumns()[38].setTemplate(new sap.m.Input({
			value : "{Zbigo}",
			editable : {
				parts : [{path : "Readonly"}, {path : "Inputok"}],
				formatter : function(fVal1, fVal2) {
					return (fVal1 === false && fVal2 === true) ? true : false;
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
		}).addStyleClass("marginTop20px marginBottom10px");
	}
});