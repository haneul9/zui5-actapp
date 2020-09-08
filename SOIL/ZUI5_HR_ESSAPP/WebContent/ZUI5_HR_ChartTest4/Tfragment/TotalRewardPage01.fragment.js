sap.ui.jsfragment("ZUI5_HR_ChartTest4.Tfragment.TotalRewardPage01", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.SearchUser1");
		jQuery.sap.require("common.ZNK_TABLES");
		
		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(this._colModel);
		
		return [
			new sap.ui.commons.layout.VerticalLayout({
				width : "100%",
				content : [ 
					new sap.ui.core.HTML({ content : "<div style='height : 11px;'/>" }),
					this.getFilterLayoutRender(oController),
					this.getIntroRender(oController),
					this.getListTableRender(oController)
				]
			})
			.addStyleClass("sapUiSizeCompact")
		];
	},
	
	
	/**
	 * 페이지 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getIntroRender : function(oController) {
		
		var notificationText = "<p> <span style=\"color:black;font-family: 'Malgun Gothic' !important;font-size:14px;\"> ※  </span> " +
		                       "<span style=\"color:red;font-family: 'Malgun Gothic' !important;font-size:14px;\"> ▲ </span> <span style=\"color:#333333;font-family: 'Malgun Gothic' !important;font-size:14px;\"> (전년도 대비 증가), </span>" +
		                       "<span style=\"color:blue;font-family: 'Malgun Gothic' !important;font-size:14px;\"> ▼ </span> <span style=\"color:#333333;font-family: 'Malgun Gothic' !important;font-size:14px;\"> (전년도 대비 감소), </span>" +
		                       "<span style=\"color:black;font-family: 'Malgun Gothic' !important;font-size:14px;\"> - 변동없음 </span>" ;
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "40px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.MessageStrip({
					  	      text : "{introText}",
						      type : "Success",
						      showIcon : true,
						      customIcon : "sap-icon://message-information", 
						      showCloseButton : false,
						}),
					}),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : [ 
							
							new sap.m.Toolbar({
								design : sap.m.ToolbarDesign.Auto,
								height : "150px",
								content : [
									new sap.ui.layout.VerticalLayout({
										content : [sap.ui.jsfragment("ZUI5_HR_ChartTest4.Tfragment.Payment",oController)
									              ],
									    width : "15%"
									}),
									new sap.ui.layout.VerticalLayout({
										content : [sap.ui.jsfragment("ZUI5_HR_ChartTest4.Tfragment.Benefit",oController)
									              ],
									    width : "15%"
									}),
									new sap.ui.layout.VerticalLayout({
										content : [sap.ui.jsfragment("ZUI5_HR_ChartTest4.Tfragment.Education",oController)
									              ],
									    width : "15%"
									}),
									new sap.ui.layout.VerticalLayout({
										content : [sap.ui.jsfragment("ZUI5_HR_ChartTest4.Tfragment.Balance",oController)
									              ],
									    width : "15%"
									}),
									new sap.ui.layout.VerticalLayout({
										content : [sap.ui.jsfragment("ZUI5_HR_ChartTest4.Tfragment.Summary",oController)
									              ],
									    width : "40%"
									})
								]
							}).addStyleClass("L2PToolbarNoBottomLine"), 
							
							/*
						new sap.ui.layout.HorizontalLayout({
							allowWrapping :true,
							content :  [ 
										new sap.ui.layout.VerticalLayout({
											content : [sap.ui.jsfragment("ZUI5_HR_ChartTest4.Tfragment.Payment",oController)
										              ],
										    width : "20%"
										}).addStyleClass("PSNCPaddingLeft"),
										new sap.ui.layout.VerticalLayout({
											content : [sap.ui.jsfragment("ZUI5_HR_ChartTest4.Tfragment.Payment",oController)
										              ],
										    width : "20%"
										}).addStyleClass("PSNCPaddingLeft"),
										new sap.ui.layout.VerticalLayout({
											content : [sap.ui.jsfragment("ZUI5_HR_ChartTest4.Tfragment.Payment",oController)
										              ],
										    width : "20%"
										}).addStyleClass("PSNCPaddingLeft"),
										new sap.ui.layout.VerticalLayout({
											content : [sap.ui.jsfragment("ZUI5_HR_ChartTest4.Tfragment.Payment",oController)
										              ],
										    width : "20%"
										}).addStyleClass("PSNCPaddingLeft"),
						     ],
						}).addStyleClass("LeftAlign")
						*/
					]
				})
				]
			}),
				
			new sap.ui.commons.layout.MatrixLayoutRow({
//				height : "40px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.FormattedText({
//					  	      text : "※ ▲ (전년도 대비 증가), ▼ (전년도 대비 감소), - 변동없음",
					  	      htmlText : notificationText
						 }),
						 vAlign : "Top",
					}).addStyleClass("L2PPaddingLeft10"),
				]
			})
		];
			
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "40px",
					content : [
						new sap.ui.core.Icon({
							src: "sap-icon://open-command-field", 
							size : "1.0rem"
						}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : "개요" 
						}).addStyleClass("L2PFontFamilyBold"),
					]
				}).addStyleClass("L2PToolbarNoBottomLine"), 
				new sap.ui.commons.layout.MatrixLayout({
					columns : 1,
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
		
		var displayYn = (_gAuth == 'E') ? false : true;
		
		return new sap.ui.layout.HorizontalLayout({
			allowWrapping : true,
			content : [
				new sap.ui.layout.VerticalLayout({
					content : [
						new sap.m.Text({
							text : "직원" 
						}),
						new sap.m.Input(oController.PAGEID + "_Ename", {
							width : "150px",
							showValueHelp: true,
							valueHelpOnly: false,
							value : "{Ename}",
							customData : new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"}),
							change : oController.EmpSearchByTx,
							valueHelpRequest: oController.displayEmpSearchDialog
						}).addStyleClass("L2PFontFamily")
					],
					visible : displayYn
				}).addStyleClass("L2PFilterItem"),
				new sap.ui.layout.VerticalLayout({
					content : [
						new sap.m.Text({text : "조회연도"}),
						new sap.m.Input({
							width : "150px",
							value : "{Datum}",
							liveChange : common.Common.setOnlyDigit,
						}).addStyleClass("L2PFontFamily")
					]
				}).addStyleClass("L2PFilterItem"),
				new sap.ui.layout.VerticalLayout({
					content : [
						new sap.m.Label(),
						new sap.m.Button({
							text: "검색",
							icon : "sap-icon://search",
							press : oController.onPressSearch ,
						}).addStyleClass("L2PFontFamily")
					]
				}).addStyleClass("L2PFilterItem")
			]
		}).addStyleClass("L2PFilterLayout")
		.setModel(oController._ListCondJSonModel)
		.bindElement("/Data");
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
					height : "40px",
					content : [
						new sap.ui.core.Icon({
							src: "sap-icon://open-command-field", 
							size : "1.0rem"
						}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : "상세내역" 
						}).addStyleClass("L2PFontFamilyBold"),
					]
				}).addStyleClass("L2PToolbarNoBottomLine"), 
				new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_DetailLayout",{
					columns : 1,
				}),
			]
		});
	}
});