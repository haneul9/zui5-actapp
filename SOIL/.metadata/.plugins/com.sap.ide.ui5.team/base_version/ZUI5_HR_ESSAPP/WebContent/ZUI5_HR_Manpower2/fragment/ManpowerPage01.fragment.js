sap.ui.jsfragment("ZUI5_HR_Manpower2.fragment.ManpowerPage01", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.ZHR_TABLES");
		jQuery.sap.require("control.L2PTab");
		
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
									this.getTitleLayoutRender(oController),
									new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
									this.getFilterLayoutRender(oController),
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
									this.getMainInfoRender(oController)
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
									text : "Manpower Report"
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
		var oFilterLayout = new sap.m.Toolbar({	
			height : "45px",
			content : [new sap.m.ToolbarSpacer({width : "20px"}),
				       new sap.m.Text({text : oBundleText.getText("LABEL_0516")}).addStyleClass("Font14px FontBold FontColor3"),	// 516:기준일자
				       new sap.m.ToolbarSpacer({width : "10px"}),
				       new sap.m.DatePicker(oController.PAGEID + "_Zdate", {
							valueFormat : "yyyy-MM-dd",
				            displayFormat : "yyyy.MM.dd",
				            width : "150px",
							change : oController.onChangeDate
				       }).addStyleClass("Font14px FontColor6"),
					   new sap.m.ToolbarSpacer(),
					   new sap.m.Button({
							text: oBundleText.getText("LABEL_0002"),
							icon : "sap-icon://search",
							type : sap.m.ButtonType.Emphasized,
							press : oController.onPressSearchBtn ,
					   }),
					   new sap.m.ToolbarSpacer({width : "20px"}),					   
					   ]
		}).setModel(oController._ListCondJSonModel)
		 .bindElement("/Data")
		 .addStyleClass("FilterLayout");
		
		return oFilterLayout;
	},

	
	getMainInfoRender  : function(oController) {
		var vItemIds = ["1","2","3","4","5",
			            "6","7","8","9","10",
			            "11","12","13"];
		var vItemLebels = [
			oBundleText.getText("LABEL_2124"),	// 2124:조직별
			oBundleText.getText("LABEL_2178"),	// 2178:직급별
			oBundleText.getText("LABEL_2191"),	//  2191:직책별
			oBundleText.getText("LABEL_1944"),	// 1944:연령별
			oBundleText.getText("LABEL_1564"), 	// 1564:근속별
			oBundleText.getText("LABEL_1886") + "(Y)",	// 1886:시점별
			oBundleText.getText("LABEL_1886") + "(Q)",	// 1886:시점별
			oBundleText.getText("LABEL_1886") + "(M)",	// 1886:시점별
			oBundleText.getText("LABEL_1712"),	// 1712:등기이사,고문,파견직
			oBundleText.getText("LABEL_2289"),	// 2289:파견,휴직,병가
			oBundleText.getText("LABEL_2276") + "(Y)",	// 2276:퇴직_시점별
			oBundleText.getText("LABEL_2276") + "(Q)",	// 2276:퇴직_시점별
			oBundleText.getText("LABEL_2276") + "(M)"	// 2276:퇴직_시점별
		];
		
		var oIcontabbar = new control.L2PTab(oController.PAGEID +"_ICONBAR",{
		cssPath : "/sap/bc/ui5_ui5/sap/zhrxx_common/css/",
		itemIds : vItemIds,
		itemLabels : vItemLebels,
		selectedKey : "1",
		select : oController.onChangeIcontabbar,
		bgColor : "#53abe6",
		height : 30
		});		
		
		var oDetailLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_DetailTableLayout",{
		width : "100%",
		content : []
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
		width : "100%",
		content : [oIcontabbar,
				   new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
				   oDetailLayout]
		});
		
		return oLayout;
	},
});