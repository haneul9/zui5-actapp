sap.ui.core.IconPool.addIcon('fontnameTab1', 'customfont', 'icomoon', 'e900');

sap.ui.jsfragment("ZUI5_HR_ProductionPromotionEvaluation.fragment.ProductionPromotionEvaluationPage01", {
	
	_colModelA : [
		{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 38:성명
		{id: "PhotoUrl", label : oBundleText.getText("LABEL_0935"), plabel : oBundleText.getText("LABEL_0935"), resize : false, span : 0, type : "image", sort : false, filter : false, width : "55px"},	// 935:사진
		{id: "Age", label : oBundleText.getText("LABEL_0953"), plabel : oBundleText.getText("LABEL_0953"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 953:연령
		{id: "Zzjiktlt", label : oBundleText.getText("LABEL_0770"), plabel : oBundleText.getText("LABEL_0770"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "150px"},	// 770:직급
		{id: "Orgtx", label : oBundleText.getText("LABEL_0960"), plabel : oBundleText.getText("LABEL_0960"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 960:조직명
		{id: "Hiredate", label : oBundleText.getText("LABEL_0090"), plabel : oBundleText.getText("LABEL_0090"), resize : false, span : 0, type : "date", sort : true, filter : false, width : "100px"},	// 90:입사일
		{id: "Svryrmn", label : oBundleText.getText("LABEL_0926"), plabel : oBundleText.getText("LABEL_0926"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 926:근속(년/월)
		{id: "Dat04", label : oBundleText.getText("LABEL_0949"), plabel : oBundleText.getText("LABEL_0949"), resize : false, span : 0, type : "date", sort : true, filter : false, width : "100px"},	// 949:승진일
		{id: "Sjnyrmn", label : oBundleText.getText("LABEL_0941"), plabel : oBundleText.getText("LABEL_0941"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 941:승진(년/월)
	 	{id: "Evp01", label : oBundleText.getText("LABEL_0954"), plabel : "\'#(10%)", resize : false, span : 5, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 954:인사평가
	 	{id: "Evp02", label : "", plabel : "\'#(20%)", resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},
	 	{id: "Evp03", label : "", plabel : "\'#(30%)", resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},
	 	{id: "Evp04", label : "", plabel : "\'#(40%)", resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},
	 	{id: "Evpot", label : "", plabel : oBundleText.getText("LABEL_0969"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 969:환산소계
	 	{id: "Crrsc", label : oBundleText.getText("LABEL_0952"), plabel : oBundleText.getText("LABEL_0952"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 952:연공점수
	 	{id: "Skosc", label : oBundleText.getText("LABEL_0923"), plabel : oBundleText.getText("LABEL_0929"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "60px"},	// 923:가감점, 929:병가
	 	{id: "Przsc", label : "", plabel : oBundleText.getText("LABEL_0967"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "60px"},	// 967:표창
	 	{id: "Brdsc", label : "", plabel : oBundleText.getText("LABEL_0930"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "60px"},	// 930:보드
	 	{id: "Sjnsc", label : oBundleText.getText("LABEL_0958"), plabel : oBundleText.getText("LABEL_0958"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 958:점수(계)
	 	{id: "Sjgrd", label : oBundleText.getText("LABEL_0945"), plabel : oBundleText.getText("LABEL_0945"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 945:승진등급
	 	{id: "Adjsc", label : oBundleText.getText("LABEL_0950"), plabel : oBundleText.getText("LABEL_0950"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 950:승진점수
	 	{id: "Sjabl", label : oBundleText.getText("LABEL_0946"), plabel : oBundleText.getText("LABEL_0946"), resize : false, span : 0, type : "Checkbox2", sort : true, filter : true, width : "80px"},	// 946:승진예정
	 	{id: "Pri50", label : oBundleText.getText("LABEL_0938"), plabel : oBundleText.getText("LABEL_0938"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 938:순위
	 	{id: "Zbigo", label : oBundleText.getText("LABEL_0096"), plabel : oBundleText.getText("LABEL_0096"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "200px", align : sap.ui.core.TextAlign.Begin},	// 96:비고
	 	{id: "Sjstatx", label : oBundleText.getText("LABEL_0961"), plabel : oBundleText.getText("LABEL_0961"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"}	// 961:진행상태
	],
	
	_colModelB : [
		{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 38:성명
		{id: "PhotoUrl", label : oBundleText.getText("LABEL_0935"), plabel : oBundleText.getText("LABEL_0935"), resize : false, span : 0, type : "image", sort : false, filter : false, width : "55px"},	// 935:사진
		{id: "Age", label : oBundleText.getText("LABEL_0953"), plabel : oBundleText.getText("LABEL_0953"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 953:연령
		{id: "Zzjiktlt", label : oBundleText.getText("LABEL_0770"), plabel : oBundleText.getText("LABEL_0770"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "150px"},	// 770:직급
		{id: "Orgtx", label : oBundleText.getText("LABEL_0960"), plabel : oBundleText.getText("LABEL_0960"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 960:조직명
		{id: "Hiredate", label : oBundleText.getText("LABEL_0090"), plabel : oBundleText.getText("LABEL_0090"), resize : false, span : 0, type : "date", sort : true, filter : false, width : "100px"},	// 90:입사일
		{id: "Svryrmn", label : oBundleText.getText("LABEL_0926"), plabel : oBundleText.getText("LABEL_0926"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 926:근속(년/월)
		{id: "Dat04", label : oBundleText.getText("LABEL_0949"), plabel : oBundleText.getText("LABEL_0949"), resize : false, span : 0, type : "date", sort : true, filter : false, width : "100px"},	// 949:승진일
		{id: "Sjnyrmn", label : oBundleText.getText("LABEL_0941"), plabel : oBundleText.getText("LABEL_0941"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 941:승진(년/월)
	 	{id: "Evp01", label : oBundleText.getText("LABEL_0954"), plabel : "\'#(10%)", resize : false, span : 5, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 954:인사평가
	 	{id: "Evp02", label : "", plabel : "\'#(20%)", resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},
	 	{id: "Evp03", label : "", plabel : "\'#(30%)", resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},
	 	{id: "Evp04", label : "", plabel : "\'#(40%)", resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},
	 	{id: "Evpot", label : "", plabel : oBundleText.getText("LABEL_0969"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 969:환산소계
	 	{id: "Crrsc", label : oBundleText.getText("LABEL_0952"), plabel : oBundleText.getText("LABEL_0952"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 952:연공점수
	 	{id: "Skosc", label : oBundleText.getText("LABEL_0923"), plabel : oBundleText.getText("LABEL_0929"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "60px"},	// 923:가감점, 929:병가
	 	{id: "Przsc", label : "", plabel : oBundleText.getText("LABEL_0967"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "60px"},	// 967:표창
	 	{id: "Brdsc", label : "", plabel : oBundleText.getText("LABEL_0930"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "60px"},	// 930:보드
	 	{id: "Adjsc", label : oBundleText.getText("LABEL_0950"), plabel : oBundleText.getText("LABEL_0950"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 950:승진점수
	 	{id: "Rcind", label : oBundleText.getText("LABEL_0955"), plabel : oBundleText.getText("LABEL_0955"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 955:임원추천
	 	{id: "Pri50", label : oBundleText.getText("LABEL_0938"), plabel : oBundleText.getText("LABEL_0938"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 938:순위
	 	{id: "Zbigo", label : oBundleText.getText("LABEL_0096"), plabel : oBundleText.getText("LABEL_0096"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "200px", align : sap.ui.core.TextAlign.Begin},	// 96:비고
	 	{id: "Sjstatx", label : oBundleText.getText("LABEL_0961"), plabel : oBundleText.getText("LABEL_0961"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"}	// 961:진행상태
	],
	
	_colModelC : [
		{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "50px"},
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 38:성명
		{id: "PhotoUrl", label : oBundleText.getText("LABEL_0935"), plabel : oBundleText.getText("LABEL_0935"), resize : false, span : 0, type : "image", sort : false, filter : false, width : "55px"},	// 935:사진
		{id: "Age", label : oBundleText.getText("LABEL_0953"), plabel : oBundleText.getText("LABEL_0953"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 953:연령
		{id: "Zzjiktlt", label : oBundleText.getText("LABEL_0770"), plabel : oBundleText.getText("LABEL_0770"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "150px"},	// 770:직급
		{id: "Orgtx", label : oBundleText.getText("LABEL_0960"), plabel : oBundleText.getText("LABEL_0960"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 960:조직명
		{id: "Hiredate", label : oBundleText.getText("LABEL_0090"), plabel : oBundleText.getText("LABEL_0090"), resize : false, span : 0, type : "date", sort : true, filter : false, width : "100px"},	// 90:입사일
		{id: "Svryrmn", label : oBundleText.getText("LABEL_0926"), plabel : oBundleText.getText("LABEL_0926"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 926:근속(년/월)
		{id: "Dat04", label : oBundleText.getText("LABEL_0949"), plabel : oBundleText.getText("LABEL_0949"), resize : false, span : 0, type : "date", sort : true, filter : false, width : "100px"},	// 949:승진일
		{id: "Sjnyrmn", label : oBundleText.getText("LABEL_0941"), plabel : oBundleText.getText("LABEL_0941"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 941:승진(년/월)
	 	{id: "Evp01", label : oBundleText.getText("LABEL_0954"), plabel : "\'#(10%)", resize : false, span : 5, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 954:인사평가
	 	{id: "Evp02", label : "", plabel : "\'#(20%)", resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},
	 	{id: "Evp03", label : "", plabel : "\'#(30%)", resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},
	 	{id: "Evp04", label : "", plabel : "\'#(40%)", resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},
	 	{id: "Evpot", label : "", plabel : oBundleText.getText("LABEL_0969"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 969:환산소계
	 	{id: "Crrsc", label : oBundleText.getText("LABEL_0952"), plabel : oBundleText.getText("LABEL_0952"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 952:연공점수
	 	{id: "Skosc", label : oBundleText.getText("LABEL_0923"), plabel : oBundleText.getText("LABEL_0929"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "60px"},	// 923:가감점, 929:병가
	 	{id: "Przsc", label : "", plabel : oBundleText.getText("LABEL_0967"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "60px"},	// 967:표창
	 	{id: "Brdsc", label : "", plabel : oBundleText.getText("LABEL_0930"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "60px"},	// 930:보드
	 	{id: "Adjsc", label : oBundleText.getText("LABEL_0950"), plabel : oBundleText.getText("LABEL_0950"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px", align : sap.ui.core.TextAlign.End},	// 950:승진점수
	 	{id: "Pri50", label : oBundleText.getText("LABEL_0939"), plabel : oBundleText.getText("LABEL_0939"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 939:순위(본부)
	 	{id: "Pri30", label : oBundleText.getText("LABEL_0940"), plabel : oBundleText.getText("LABEL_0940"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 940:순위(총괄)
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
									this.getStatusInfoRenderA(oController),
									this.getListTableRenderA(oController),
									this.getStatusInfoRenderB(oController),
									this.getListTableRenderB(oController),
									this.getListTableRenderC(oController)
								]
							})
							.addStyleClass("sapUiSizeCompact")
						})
					]
				})
			]
		});
		
		oMatrixLayout.addEventDelegate({
			onAfterRendering: function() {
				var oController = sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluation.ZUI5_HR_ProductionPromotionEvaluationList").getController(),
					vSjkgb = oController._ListCondJSonModel.getProperty("/Data/Sjkgb"),
					vSjlev = oController._ListCondJSonModel.getProperty("/Data/Sjlev");
				
				if(vSjkgb == "A") {
					if(vSjlev == "2") {
						sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_IAreaA").setVisible(false);
						sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_TAreaA").setVisible(false);
						sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_IAreaB").setVisible(true);
						sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_TAreaB").setVisible(false);
						sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_TAreaC").setVisible(true);
					} else {
						sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_IAreaA").setVisible(false);
						sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_TAreaA").setVisible(false);
						sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_IAreaB").setVisible(true);
						sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_TAreaB").setVisible(true);
						sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_TAreaC").setVisible(false);
					}
				} else {
					sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_IAreaA").setVisible(true);
					sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_TAreaA").setVisible(true);
					sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_IAreaB").setVisible(false);
					sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_TAreaB").setVisible(false);
					sap.ui.getCore().byId("ZUI5_HR_ProductionPromotionEvaluationList_TAreaC").setVisible(false);
				}
			}
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
									text : oBundleText.getText("LABEL_0937")	// 937:생산직 승진자 평가
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
						path: "ZHR_TECH_PROMOTION_SRV>/SjyerListSet",
						template: new sap.ui.core.ListItem({
							key: "{ZHR_TECH_PROMOTION_SRV>Sjyer}",
							text: "{ZHR_TECH_PROMOTION_SRV>Sjyertx}"
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
					selectedKey : "{SjktlC}",
					change : oController.onChangeSjktlC,
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
						path: "ZHR_TECH_PROMOTION_SRV>/SjstaListSet",
						template: new sap.ui.core.ListItem({
							key: "{ZHR_TECH_PROMOTION_SRV>Sjsta}",
							text: "{ZHR_TECH_PROMOTION_SRV>Sjstatx}"
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
						parts : [{path : "Inputok"}, {path : "Sjkgb"}, {path : "Sjlev"}, {path : "isReadOnly"}],
						formatter : function(fVal1, fVal2, fVal3, fVal4) {
							return fVal1 === true && fVal2 && fVal3 && fVal4 === false ? true : false;
						}
					}
				}),
				new sap.m.Button({
					text: oBundleText.getText("LABEL_0816"),	// 816:완료
					press : oController.onPressSaveC,
					visible : {
						parts : [{path : "Inputok"}, {path : "Sjkgb"}, {path : "Sjlev"}, {path : "isReadOnly"}],
						formatter : function(fVal1, fVal2, fVal3, fVal4) {
							return fVal1 === true && fVal2 && fVal3 && fVal4 === false ? true : false;
						}
					}
				}),
				new sap.m.Button({
					text: oBundleText.getText("LABEL_0959"),	// 959:정렬(순위)
					press : oController.onCalcSort,
					visible : {
						parts : [{path : "Inputok"}, {path : "Sjkgb"}, {path : "Sjlev"}, {path : "isReadOnly"}],
						formatter : function(fVal1, fVal2, fVal3, fVal4) {
							return fVal1 === true && fVal2 && fVal3 && fVal4 === false ? true : false;
						}
					}
				}),
				new sap.m.Button({
					text: oBundleText.getText("LABEL_0934"),	// 934:부서별 통계
					press : oController.onPressSaveS,
					visible : {
						parts : [{path : "Sjkgb"}, {path : "Sjlev"}, {path : "totalListCount"}],
						formatter : function(fVal1, fVal2, fVal3) {
							return fVal1 && fVal2 && fVal3 > 0 ? true : false;
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
	 * 입력현황 (과장 미만) rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getStatusInfoRenderA : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0300"),	// 300:구분
							textAlign : sap.ui.core.TextAlign.Center,
							width : '100%'
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label(oController.PAGEID + "_ArateTxt", {
							text : "A(#)",
							textAlign : sap.ui.core.TextAlign.Center,
							width : '100%'
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : "B",
							textAlign : sap.ui.core.TextAlign.Center,
							width : '100%'
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : "C",
							textAlign : sap.ui.core.TextAlign.Center,
							width : '100%'
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0927"),	// 927:미입력
							textAlign : sap.ui.core.TextAlign.Center,
							width : '100%'
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0772"),	// 772:총인원
							textAlign : sap.ui.core.TextAlign.Center,
							width : '100%'
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label(oController.PAGEID + "_PrateTxt", {
							text : oBundleText.getText("LABEL_0946") + "(#)",	// 946:승진예정
							textAlign : sap.ui.core.TextAlign.Center,
							width : '100%'
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0962"),	// 962:최대허용
							textAlign : sap.ui.core.TextAlign.Center,
							width : '100%'
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{Srat1Cnt}",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "-",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "-",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "-",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{TotalCnt1}",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{Srat2Cnt}",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0956"),	// 959:입력
							textAlign : sap.ui.core.TextAlign.Center,
							width : '100%'
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{ACnt}",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{BCnt}",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{CCnt}",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{NCnt}",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{TotalCnt2}",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{PCnt}",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			})
		];
		
		return new sap.m.Panel(oController.PAGEID + "_IAreaA", {
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "20px",
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_0957") 	// 957:입력현황
						}).addStyleClass("MiddleTitle")
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
				new sap.ui.commons.layout.MatrixLayout({
					columns : 7,
					width : '50%',
					widths : [ "15%", "14%", "14%", "14%", "14%", "14%", "15%" ],
					rows : aRows
				})
				.setModel(oController._DetailJSonModel)
				.bindElement("/Data")
			]
		});
	},
	
	/**
	 * 목록테이블 (과장 미만) rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getListTableRenderA : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_TableA", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 33,
			rowHeight : 61,
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
						text : oBundleText.getText("LABEL_0944")	// 944:승진대상자
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
					selector : '#ZUI5_HR_ProductionPromotionEvaluationList_TableA-header-fixed-fixrow > tbody',
					colIndexes : [0, 1, 2, 3, 4]
				});
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_ProductionPromotionEvaluationList_TableA-header > tbody',
					colIndexes : [0, 1, 2, 3, 4, 5, 11, 15, 16, 17, 18, 19, 20, 21, 21]
				});
			}
		});
		
		var currYear = new Date().getFullYear() - 2000;
		
		this._colModelA[11].plabel = this._colModelA[11].plabel.replace(/#/g, String(currYear - 4));
		this._colModelA[12].plabel = this._colModelA[12].plabel.replace(/#/g, String(currYear - 3));
		this._colModelA[13].plabel = this._colModelA[13].plabel.replace(/#/g, String(currYear - 2));
		this._colModelA[14].plabel = this._colModelA[14].plabel.replace(/#/g, String(currYear - 1));
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModelA);
		
		// 승진등급
		oTable.getColumns()[21].setTemplate(new sap.m.ComboBox({
			selectedKey : "{Sjgrd}",
			change : oController.onChangeSjgrd,
			editable : {
				parts : [{path : "Readonly"}, {path : "Inputok"}],
				formatter : function(fVal1, fVal2) {
					return (fVal1 === false && fVal2 === true) ? true : false;
				}
			},
			items : {
				path : "/Sjgrds",
				template : new sap.ui.core.ListItem({
					key : "{Sjgrd}",
					text : "{Sjgrdtx}"
				}),
				templateShareable : true
			}
		}).addStyleClass("Font14px FontColor3"));
		
		// 비고
		oTable.getColumns()[25].setTemplate(new sap.m.Input({
			value : "{Zbigo}",
			editable : {
				parts : [{path : "Readonly"}, {path : "Inputok"}],
				formatter : function(fVal1, fVal2) {
					return (fVal1 === false && fVal2 === true) ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		return new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_TAreaA", {
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
	},
	
	/**
	 * 입력현황 (과장) rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getStatusInfoRenderB : function(oController) {
		aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0300"),	// 300:구분
							textAlign : sap.ui.core.TextAlign.Center,
							width : '100%'
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0963"),	// 963:추천
							textAlign : sap.ui.core.TextAlign.Center,
							width : '100%'
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0928"),	// 928:미추천
							textAlign : sap.ui.core.TextAlign.Center,
							width : '100%'
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0927"),	// 927:미입력
							textAlign : sap.ui.core.TextAlign.Center,
							width : '100%'
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0772"),	// 772:총인원
							textAlign : sap.ui.core.TextAlign.Center,
							width : '100%'
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0962"),	// 962:최대허용
							textAlign : sap.ui.core.TextAlign.Center,
							width : '100%'
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{Srat4Cnt}",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{Nosrat4Cnt}",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "-",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{TotalCnt1}",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_IAreaB_last", {
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0956"),	// 959:입력
							textAlign : sap.ui.core.TextAlign.Center,
							width : '100%'
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{RcmCount}",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{NotRcmCount}",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{NotInputCount}",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{TotalCnt1}",
							textAlign : sap.ui.core.TextAlign.End,
							width : '90%'
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			})
		];
		
		return new sap.m.Panel(oController.PAGEID + "_IAreaB", {
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "20px",
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_0957") 	// 957:입력현황
						}).addStyleClass("MiddleTitle")
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
				new sap.ui.commons.layout.MatrixLayout({
					columns : 5,
					width : '50%',
					widths : [ "20%", "20%", "20%", "20%", "20%" ],
					rows : aRows
				})
				.setModel(oController._DetailJSonModel)
				.bindElement("/Data")
			]
		});
	},
	
	/**
	 * 목록테이블 (과장) rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getListTableRenderB : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_TableB", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 33,
			rowHeight : 61,
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
						text : oBundleText.getText("LABEL_0944")	// 944:승진대상자
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
					selector : '#ZUI5_HR_ProductionPromotionEvaluationList_TableB-header-fixed-fixrow > tbody',
					colIndexes : [0, 1, 2, 3, 4]
				});
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_ProductionPromotionEvaluationList_TableB-header > tbody',
					colIndexes : [0, 1, 2, 3, 4, 5, 11, 15, 16, 17, 18, 19]
				});
			}
		});
		
		var currYear = new Date().getFullYear() - 2000;
		
		this._colModelB[11].plabel = this._colModelB[11].plabel.replace(/#/g, String(currYear - 4));
		this._colModelB[12].plabel = this._colModelB[12].plabel.replace(/#/g, String(currYear - 3));
		this._colModelB[13].plabel = this._colModelB[13].plabel.replace(/#/g, String(currYear - 2));
		this._colModelB[14].plabel = this._colModelB[14].plabel.replace(/#/g, String(currYear - 1));

		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModelB);
		
		// 임원추천
		oTable.getColumns()[21].setTemplate(new sap.m.ComboBox({
			selectedKey : "{Rcind}",
			change : oController.onChangeRcind,
			editable : {
				parts : [{path : "Readonly"}, {path : "Sjlev"}, {path : "Inputok"}],
				formatter : function(fVal1, fVal2, fVal3) {
					return (fVal1 === false && fVal2 == "1" && fVal3 === true) ? true : false;
				}
			},
			items : {
				path : "/Rcinds",
				template : new sap.ui.core.ListItem({
					key : "{Rcind}",
					text : "{Rcindtx}"
				}),
				templateShareable : true
			}
		}).addStyleClass("Font14px FontColor3"));
		
		// 순위
		oTable.getColumns()[22].setTemplate(new sap.m.Input({
			value : "{Pri50}",
			change : oController.onChagePri50,
			editable : {
				parts : [{path : "Readonly"}, {path : "Sjlev"}, {path : "Inputok"}, {path : "Rcind"}],
				formatter : function(fVal1, fVal2, fVal3, fVal4) {
					return (fVal1 === false && fVal2 == "1" && fVal3 === true && fVal4 == "1") ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		// 비고
		oTable.getColumns()[23].setTemplate(new sap.m.Input({
			value : "{Zbigo}",
			editable : {
				parts : [{path : "Readonly"}, {path : "Inputok"}],
				formatter : function(fVal1, fVal2) {
					return (fVal1 === false && fVal2 === true) ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		return new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_TAreaB", {
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
	},
	
	/**
	 * 목록테이블 (과장-총괄) rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getListTableRenderC : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_TableC", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 33,
			rowHeight : 61,
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
						text : oBundleText.getText("LABEL_0944")	// 944:승진대상자
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
					selector : '#ZUI5_HR_ProductionPromotionEvaluationList_TableC-header-fixed-fixrow > tbody',
					colIndexes : [0, 1, 2, 3, 4]
				});
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_ProductionPromotionEvaluationList_TableC-header > tbody',
					colIndexes : [0, 1, 2, 3, 4, 5, 11, 15, 16, 17, 18, 19]
				});
			}
		});
		
		var currYear = new Date().getFullYear() - 2000;
		
		this._colModelC[11].plabel = this._colModelC[11].plabel.replace(/#/g, String(currYear - 4));
		this._colModelC[12].plabel = this._colModelC[12].plabel.replace(/#/g, String(currYear - 3));
		this._colModelC[13].plabel = this._colModelC[13].plabel.replace(/#/g, String(currYear - 2));
		this._colModelC[14].plabel = this._colModelC[14].plabel.replace(/#/g, String(currYear - 1));

		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModelC);
		
		// 순위(총괄)
		oTable.getColumns()[22].setTemplate(new sap.m.Input({
			value : "{Pri30}",
			change : oController.onChagePri30,
			editable : {
				parts : [{path : "Readonly"}, {path : "Sjlev"}, {path : "Inputok"}],
				formatter : function(fVal1, fVal2, fVal3) {
					return (fVal1 === false && fVal2 == "2" && fVal3 === true) ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		// 비고
		oTable.getColumns()[23].setTemplate(new sap.m.Input({
			value : "{Zbigo}",
			editable : {
				parts : [{path : "Readonly"}, {path : "Inputok"}],
				formatter : function(fVal1, fVal2) {
					return (fVal1 === false && fVal2 === true) ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		return new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_TAreaC", {
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