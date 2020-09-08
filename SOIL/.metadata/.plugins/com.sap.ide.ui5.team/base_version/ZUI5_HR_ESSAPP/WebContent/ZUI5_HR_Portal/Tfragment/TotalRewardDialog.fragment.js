sap.ui.jsfragment("ZUI5_HR_Portal.Tfragment.TotalRewardDialog", {
	
	createContent : function(oController) {
		jQuery.sap.require("ZUI5_HR_Portal.common.TotalRewardController");
		jQuery.sap.require("common.SearchUser1");
		jQuery.sap.require("common.ZHR_TABLES");
		
		// Excel column info
//		oController._Columns = common.Common.convertColumnArrayForExcel(this._colModel);
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [ 
				this.getFilterLayoutRender(oController),
				this.getIntroRender(oController),
				this.getListTableRender(oController)
			]
		});
		
		var oDialog = new sap.m.Dialog({
			content : oLayout,
			contentWidth : "1200px",
			horizontalScrolling : true,
			verticalScrolling : true, 
			showHeader : true,
			title : "Total Reward Dashboard",
			buttons :[new sap.m.Button({
							text : "닫기", 
							press : function(oEvent){
								oDialog.close();
							}
						}),
			]
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
	},
	
	
	/**
	 * 페이지 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getIntroRender : function(oController) {
		var notificationText = "<p> <span style=\"font-size:14px;font-family: 'Noto Sans CJK KR Regular', sans-serif !important;font-weight : bold;color : #666666\"> ※  </span> " +
							   "<span style=\"color:red;font-size:15px;\"> ▲ </span><span style=\"font-size:14px;font-family: 'Noto Sans CJK KR Regular', sans-serif !important;font-weight : bold;color : #666666\">  (전년도 대비 증가), </span>" +
							   "<span style=\"color:blue;font-size:15px;\"> ▼ </span><span style=\"font-size:14px;font-family: 'Noto Sans CJK KR Regular', sans-serif !important;font-weight : bold;color : #666666\">  (전년도 대비 감소), </span>" +
							   "<span style=\"font-size:14px;font-family: 'Noto Sans CJK KR Regular', sans-serif !important;font-weight : bold;color : #666666\"> - 변동없음 </span>" ;
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.MessageStrip({
					  	      text : "총 보상(Total Rewards}는 급여, 복리후생, 교육 및 Work-Life Balance의 네가지 구분항목으로 구성되고 있습니다.\n 세부내역 확인은 각 구분항목 메뉴에서 확인하실 수 있습니다.",
						      showIcon : true,
						      customIcon : "sap-icon://message-information", 
						      showCloseButton : false,
						}),
						colSpan :5
					}),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({ height : "20px"}),
			new sap.ui.commons.layout.MatrixLayoutRow({ 
				height : "100px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : sap.ui.jsfragment("ZUI5_HR_Portal.Tfragment.Payment",oController)
					}).attachEvent("onClick", ZUI5_HR_Portal.common.TotalRewardController.onClick1),
					new sap.ui.commons.layout.MatrixLayoutCell({}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : sap.ui.jsfragment("ZUI5_HR_Portal.Tfragment.Benefit",oController),
					}).attachEvent("onClick", ZUI5_HR_Portal.common.TotalRewardController.onClick2),
					new sap.ui.commons.layout.MatrixLayoutCell({}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : sap.ui.jsfragment("ZUI5_HR_Portal.Tfragment.Summary",oController),
						rowSpan : 3
					}),
					]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({ height : "20px"}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "100px",
				cells : [ new sap.ui.commons.layout.MatrixLayoutCell({
					content : sap.ui.jsfragment("ZUI5_HR_Portal.Tfragment.Education",oController),
				}).attachEvent("onClick", ZUI5_HR_Portal.common.TotalRewardController.onClick3),
				new sap.ui.commons.layout.MatrixLayoutCell({}),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : sap.ui.jsfragment("ZUI5_HR_Portal.Tfragment.Balance",oController)
				}).attachEvent("onClick", ZUI5_HR_Portal.common.TotalRewardController.onClick4),
				new sap.ui.commons.layout.MatrixLayoutCell({}),
			]
		 }).addStyleClass("TileLayoutNoBottom"),
				
		  new sap.ui.commons.layout.MatrixLayoutRow({
			  cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.FormattedText({
					  	      htmlText : notificationText
						 }),
						 vAlign : "Top",
						 colSpan : 3
					}).addStyleClass("PaddingLeft10"),
				],
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
				        new sap.m.Text({text : "개요" }).addStyleClass("MiddleTitle")]	
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 
				new sap.ui.commons.layout.MatrixLayout({
					columns : 5,
					widths : ['35%',"15px",'35%',"15px",'30%'],
					width : '100%',
					rows : aRows
				}).setModel(oController._DetailJSonModel)
				.bindElement("/Data"),
			]
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
			content : [
						new sap.m.Toolbar(oController.PAGEID +"_TotalRewardFilter",{
							content : [
								new sap.m.ToolbarSpacer({width : "20px"}),
							    new sap.m.Text({text : oBundleText.getText("LABEL_2182")}).addStyleClass("Font14px FontBold FontColor3"),	// 2182:직원
						        new sap.m.ToolbarSpacer({width : "10px"}),
							    new sap.m.Input(oController.PAGEID + "_Ename", {
								  	width : "150px",
					        	    showValueHelp: true,
					        	    valueHelpOnly: false,
					        	    value : "{Ename}",
					        	    customData : new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"}),
									change : oController.EmpSearchByTx,
								    valueHelpRequest: oController.displayEmpSearchDialog,
							    }).addStyleClass("Font14px FontColor6"),
							]
						}),		       
					   new sap.m.ToolbarSpacer({width : "20px"}),
				       new sap.m.Text({text : oBundleText.getText("LABEL_2130") }).addStyleClass("Font14px FontBold FontColor3"),	// 2130:조회연도
				       new sap.m.ToolbarSpacer({width : "10px"}),
					   new sap.m.Input({
							width : "150px",
							value : "{Zyear}",
							type : "Number",
//							liveChange : common.Common.setOnlyDigit,
							change : function(oEvent){
								var inputValue = oEvent.getSource().getValue();
								if(!common.Common.checkNull(inputValue) && inputValue.length == 4){
									ZUI5_HR_Portal.common.TotalRewardController.onPressSearch();
								}
							}
						}).addStyleClass("FontFamily"),
					   new sap.m.ToolbarSpacer(),
					   new sap.m.Button({
							text: oBundleText.getText("LABEL_0002"),
							icon : "sap-icon://search",
							type : sap.m.ButtonType.Emphasized,
							press : ZUI5_HR_Portal.common.TotalRewardController.onPressSearch ,
					   }),
					   new sap.m.ToolbarSpacer({width : "20px"}),					   
					   ]
		}).setModel(oController._ListCondJSonModel)
		 .bindElement("/Data")
		 .addStyleClass("FilterLayout");
		
		return oFilterLayout;
	},
	
	/**
	 * 목록테이블 rendering
	 * 
	 * @param oController
	 * @return sap.m.IconTabBar
	 */
	getListTableRender : function(oController) {
		
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
							text : "상세내역" 
						}).addStyleClass("MiddleTitle"),
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 
				sap.ui.jsfragment("ZUI5_HR_Portal.Tfragment.Table1",oController),
				sap.ui.jsfragment("ZUI5_HR_Portal.Tfragment.Table2",oController),
				sap.ui.jsfragment("ZUI5_HR_Portal.Tfragment.Table3",oController),
				new sap.m.Text(oController.PAGEID + "_BottomText",{
					text : "※ 연차수당 = 연차잔여개수  * 통상임금",
					visible : false
				}).addStyleClass("Font14px FontColor6 paddingTop5"),
			]
		});
	}
});