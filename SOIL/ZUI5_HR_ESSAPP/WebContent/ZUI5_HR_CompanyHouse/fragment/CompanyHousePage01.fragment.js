sap.ui.jsfragment("ZUI5_HR_CompanyHouse.fragment.CompanyHousePage01", {

	_colModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "3%"},
		{id: "Statust", label : oBundleText.getText("LABEL_0036"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "80px"},	// 36:상태
		{id: "Usrid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "5%"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "7%"},	// 38:성명
		{id: "Zzjiklnt", label : oBundleText.getText("LABEL_0067"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "7%"},	// 67:직위
		{id: "Orgtx", label : oBundleText.getText("LABEL_0039"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "10%", align : sap.ui.core.TextAlign.Begin},	// 39:소속부서
		{id: "ZreqFormt", label : oBundleText.getText("LABEL_0157"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "8%"},	// 157:신청유형
		{id: "Reqdt", label : oBundleText.getText("LABEL_0049"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "7%"},	// 49:신청일
		{id: "Dong", label : oBundleText.getText("LABEL_1706"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "3%"},	// // 157:신청유형
		{id: "Ho", label : oBundleText.getText("LABEL_2334"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "4%"},	// 2334:호
		{id: "Indt", label : oBundleText.getText("LABEL_2078"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "7%"},	// // 2078:입주희망일
		{id: "Outdt", label : oBundleText.getText("LABEL_2275"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "7%"},	// // 2275:퇴거희망일
		{id: "Outrsn", label : oBundleText.getText("LABEL_2272"), plabel : "", span : 0, type : "listText", sort : true, filter : true},	 // 2272:퇴거사유
		{id: "Outcmpl", label : oBundleText.getText("LABEL_2274"), plabel : "", span : 0, type : "Checkbox5", sort : true, filter : true, width : "95px"},	// 2274:퇴거처리완료
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
									this.getTitleLayoutRender(oController),
									new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
									this.getFilterLayoutRender(oController),
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
									this.getIconTabLayoutRender(oController),					// 분류
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
									text : oBundleText.getText("LABEL_1832")	// 1832:사택 입/퇴거 신청
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
								new sap.m.ToolbarSpacer(),
								new sap.m.Button({
									text : oBundleText.getText("LABEL_2077"),	// 2077:입주신청
									type : "Default",
									press : oController.onPressIn
								}), new sap.m.Button({
									text : oBundleText.getText("LABEL_2273"),	// 2273:퇴거신청
									type : "Default",
									press : oController.onPressOut
								})
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
					text : oBundleText.getText("LABEL_0045")	// 45:신청 시작일
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Apbeg", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					value : "{Apbeg}",
					width : "150px",
					change : oController.onChangeDate
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0046")	// 46:신청 종료일
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Apend", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					width : "150px",
					value : "{Apend}",
					change : oController.onChangeDate
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0019"),	// 0019=대상자 성명
					visible : displayYn
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.Input(oController.PAGEID + "_Ename", {
					width : "150px",
					showValueHelp: true,
					valueHelpOnly: false,
					value : "{Ename}",
					customData : new sap.ui.core.CustomData({key : "Encid", value : "{Encid}"}),
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
		})
		.setModel(oController._ListCondJSonModel)
		.bindElement("/Data")
		.addStyleClass("FilterLayout");
	},
	
	/**
	 * 목록테이블 rendering
	 * 
	 * @param oController
	 * @return sap.m.IconTabBar
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
			rowActionCount : 1,
			rowActionTemplate : new sap.ui.table.RowAction({
				items : [
					new sap.ui.table.RowActionItem({
						icon : "sap-icon://navigation-right-arrow",
						customData : [
							new sap.ui.core.CustomData({
								key : "Appno", 
								value : "{Appno}"
							})
						],
						press : oController.onPressRow
					})
				]
			}),
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0047")	// 47:신청내역
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onExport
					})
				]
			}).addStyleClass("ToolbarNoBottomLine"),
			rowSettingsTemplate : new sap.ui.table.RowSettings({
				highlight : {
					parts : [
						{path : "Status"}
					],
					//Information : 파란색 , Warning : 주황색,  Success : 초록색											
					formatter : function(fVal1, fVal2) {
						switch(fVal1) {
							case "2":
								return sap.ui.core.ValueState.Warning;
							case "3": case "35": case "40": case "50":
								return sap.ui.core.ValueState.Information;
							default:
								return sap.ui.core.ValueState.None;
						}
					}
				}
			})
		})
		.setModel(oController._ListJSonModel)
		.bindRows("/Data")
		.attachCellClick(oController.onSelectRow);
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
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
	},
	
	getIconTabLayoutRender : function(oController){
		var oCell, oRow;	
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.ui.commons.layout.MatrixLayout({
							layoutFixed : false,
							columns : 1,
							width : "100%",
							height : "60px",
							rows : [
								new sap.ui.commons.layout.MatrixLayoutRow({
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : [ 
												new sap.m.Text({
													text : {
														parts : [ {path : "CountAll"}, {path : "click0"}],
														formatter : function(fVal1, fVal2){
															this.removeStyleClass("FontColor3");
															this.removeStyleClass("FontColor9");
															if(fVal2 == "Y") {
																this.addStyleClass("FontColor3");
															} else {
																this.addStyleClass("FontColor9");
															}
															return fVal1;
														}
													},
													textAlign : "Right"
											})
											.attachBrowserEvent("click", function() {
												oController.handleIconTabBarSelect(oController, "0");
											}).addStyleClass("Font60px FontColor3 paddingBottom5px CursorPointer PaddingRight10"),
											new sap.m.Text({
												text : oBundleText.getText("LABEL_0001"),	// 건
												textAlign : "Left"
											}).addStyleClass("Font12px FontColor6 MarginTop40px") ],
											hAlign : "Center",
											vAlign : "Middle"
										})
									]
								})
							]
						})
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.ui.core.HTML({
							content : "<div style='height : 60px; border-left : 1px solid #a6a6a6;'/>"
						})
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.ui.commons.layout.MatrixLayout({
							layoutFixed : false,
							columns : 2,
							widths : ["50%", "50%"],
							width : "100%",
							height : "60px",
							rows : [
								new sap.ui.commons.layout.MatrixLayoutRow({
									height : "40px",
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Image({
												src : { 
													path : "click1",
													formatter : function(fVal) {
														if(fVal && fVal == "Y") return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Tab_icon_01_Over.png";
														else return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/tab_icon_01.png";
													}
												},
												press : function() {
													oController.handleIconTabBarSelect(oController, "1");
												}
											}).addStyleClass("noOutline"),
											hAlign : "Right",
											rowSpan : 2,
											vAlign : "Bottom"
										}),
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Text({
												text : "{Count1}",
												textAlign : "Left"
											}).addStyleClass("Font30px FontColorIconTab1"),
											hAlign : "Left",
											vAlign : "Middle" 
										})
									]
								}),
								new sap.ui.commons.layout.MatrixLayoutRow({
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content :  new sap.m.Text({
												text : oBundleText.getText("LABEL_0059"),	// 59:�ۼ���
												textAlign : "Left"
											}).addStyleClass("Font12px FontColor6"),
											hAlign : "Left",
											vAlign : "Middle" 
										})
									]
								})
							]
						}),
						hAlign : "Left" ,
						vAlign : "Middle" 
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Image({
							src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Tab_icon_00.png"
						})
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.ui.commons.layout.MatrixLayout({
							layoutFixed : false,
							columns : 2,
							widths : ["50%", "50%"],
							width : "100%",
							height : "60px",
							rows : [
								new sap.ui.commons.layout.MatrixLayoutRow({ 
									height : "40px",
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Image({
												src : { 
													path : "click2",
													formatter : function(fVal) {
														if(fVal && fVal == "Y") return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Tab_icon_02_Over.png";
														else return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/tab_icon_02.png";
													}
												},
												press : function() {
													oController.handleIconTabBarSelect(oController, "2");
												}
											}).addStyleClass("noOutline"),
											hAlign : "Right",
											rowSpan : 2,
											vAlign : "Bottom" 
										}),
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Text({
												text : "{Count2}"
											}).addStyleClass("Font30px FontColorIconTab2"),
											hAlign : "Left" ,
											vAlign : "Middle" 
										})
									]
								}),
								new sap.ui.commons.layout.MatrixLayoutRow({
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Text({
												text : oBundleText.getText("LABEL_0044")	// 44:��û
											}).addStyleClass("Font12px FontColor6"),
											hAlign : "Left" ,
											vAlign : "Middle" 
										})
									]
								})
							]
						}),
						hAlign : "Left" ,
						vAlign : "Middle" 
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Image({
							src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Tab_icon_00.png"
						})
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.ui.commons.layout.MatrixLayout({
							layoutFixed : false,
							columns : 2,
							widths : ["50%", "50%"],
							width : "100%",
							height : "60px",
							rows : [
								new sap.ui.commons.layout.MatrixLayoutRow({
									height : "40px",
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Image({
												src : { 
													path : "click3",
													formatter : function(fVal) {
														if(fVal && fVal == "Y") return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Tab_icon_04_Over.png";
														else return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/tab_icon_04.png";
													}
												},
												press : function() {
													oController.handleIconTabBarSelect(oController, "3");
												}
											}).addStyleClass("noOutline"),
											hAlign : "Right",
											rowSpan : 2,
											vAlign : "Bottom" 
										}),
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Text({
												text : "{Count3}"
											}).addStyleClass("Font30px FontColorIconTab4"),
											hAlign : "Left" ,
											vAlign : "Middle" 
										})
									]
								}),
								new sap.ui.commons.layout.MatrixLayoutRow({
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Text({
												text : oBundleText.getText("LABEL_1649"),	// 1649:담당자확인
											}).addStyleClass("Font12px FontColor6"),
											hAlign : "Left" ,
											vAlign : "Middle"
										})
									]
								})
							]
						}),
						hAlign : "Left" ,
						vAlign : "Middle" 
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Image({
							src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Tab_icon_00.png"
						})
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.ui.commons.layout.MatrixLayout({
							layoutFixed : false,
							columns : 2,
							widths : ["50%", "50%"],
							width : "100%",
							height : "60px",
							rows : [
								new sap.ui.commons.layout.MatrixLayoutRow({
									height : "40px",
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Image({
												src : { 
													path : "click4",
													formatter : function(fVal) {
														if(fVal && fVal == "Y") return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Tab_icon_05_Over.png";
														else return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/tab_icon_05.png";
													}
												},
												press : function() {
													oController.handleIconTabBarSelect(oController, "4");
												}
											}).addStyleClass("noOutline"),
											hAlign : "Right",
											rowSpan : 2,
											vAlign : "Bottom"
										}),
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Text({
												text : "{Count4}"
											}).addStyleClass("Font30px FontColorIconTab5"),
											hAlign : "Left" ,
											vAlign : "Middle"
										})
									]
								}),
								new sap.ui.commons.layout.MatrixLayoutRow({
									cells : [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Text({
												text : oBundleText.getText("LABEL_0024")	// 0024: �ݷ�
											}).addStyleClass("Font12px FontColor6"),
											hAlign : "Left" ,
											vAlign : "Middle"
										})
									]
								})
							]
						}),
						hAlign : "Left" ,
						vAlign : "Middle" 
					})
				]
			})
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 11,
			widths : ["16.7%", "5px", "16.6%", "35px","16.6%", "35px","16.6%", "35px", "16.6%", "35px", "16.6%"],
			width : "100%",
			height : "115px",
			rows : aRows
		})
		.setModel(oController._IconTabBarJSonModel)
		.bindElement("/Data")
		.addStyleClass("icontabbar");
		
	},
	
//	createContent : function(oController) {
//		jQuery.sap.require("common.Common");
//		jQuery.sap.require("common.Formatter");
//		jQuery.sap.require("common.ZHR_TABLES");
//		var c = sap.ui.commons;
//		var displayYn = false;
//		if (_gAuth == "E") {
//			displayYn = false;
//		} else
//			displayYn = true;
//		var oFilterLayout = new sap.ui.layout.HorizontalLayout({
//			allowWrapping : true
//		}).addStyleClass("L2PFilterLayout");
//		oFilterLayout.addContent(new sap.ui.layout.VerticalLayout({
//			content : [ new sap.m.Text({
//				text : oBundleText.getText("LABEL_0045")	// 45:신청 시작일
//			}), new sap.m.DatePicker(oController.PAGEID + "_Apbeg", {
//				// value: dateFormat.format(prevDate),
//				valueFormat : "yyyy-MM-dd",
//				displayFormat : "yyyy.MM.dd",
//				value : "{Apbeg}",
//				width : "150px",
//				change : oController.onChangeDate
//			}).addStyleClass("L2PFontFamily") ]
//		}).addStyleClass("L2PFilterItem"));
//
//		oFilterLayout.addContent(new sap.ui.layout.VerticalLayout({
//			content : [ new sap.m.Text({
//				text : oBundleText.getText("LABEL_0046")	// 46:신청 종료일
//			}), new sap.m.DatePicker(oController.PAGEID + "_Apend", {
//				// value: dateFormat.format(curDate),
//				valueFormat : "yyyy-MM-dd",
//				displayFormat : "yyyy.MM.dd",
//				width : "150px",
//				value : "{Apend}",
//				change : oController.onChangeDate
//			}).addStyleClass("L2PFontFamily") ]
//		}).addStyleClass("L2PFilterItem"));
//
//		oFilterLayout.addContent(new sap.ui.layout.VerticalLayout({
//			content : [ new sap.m.Label(), new sap.m.Button({
//				text : oBundleText.getText("LABEL_0002"),	// 검색
//				icon : "sap-icon://search",
//				press : oController.onPressSearch,
//			}).addStyleClass("L2PFontFamily") ]
//		}).addStyleClass("L2PFilterItem")).setModel(
//				oController._ListCondJSonModel).bindElement("/Data");
//
//		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
//			enableColumnReordering : false,
//			enableColumnFreeze : false,
//			columnHeaderHeight : 35,
//			showNoData : true,
//			selectionMode : sap.ui.table.SelectionMode.None,
//			showOverlay : false,
//			enableBusyIndicator : true,
//			noData : "No data found",
//			rowActionCount : 1,
//			rowActionTemplate : new sap.ui.table.RowAction({
//				items : [
//					new sap.ui.table.RowActionItem({
//						icon : "sap-icon://navigation-right-arrow",
//						customData : [
//							new sap.ui.core.CustomData({key : "Appno", value : "{Appno}"})
//						],
//						press : oController.onPressRow
//					})
//				]
//			}),
//			extension : new sap.m.Toolbar({
//				content : [new sap.m.Text({text : oBundleText.getText("LABEL_0047")}).addStyleClass("L2PFontFamilyBold"),	// 47:신청내역
//						   new sap.m.ToolbarSpacer(),
//						   new sap.ui.core.Icon({
//							   src : "sap-icon://excel-attachment",
//							   size : "1.0rem", 
//							   color : "#002060",
//							   press : oController.onExport
//						   }).addStyleClass("L2PPointer")]
//			}).addStyleClass("L2PToolbarNoBottomLine"),
//			rowSettingsTemplate : new sap.ui.table.RowSettings({
//				highlight : {
//					parts : [
//						{path : "Status"}
//					],
//					//Information : 파란색 , Warning : 주황색,  Success : 초록색											
//					formatter : function(fVal1, fVal2) {
//						switch(fVal1) {
//							case "2":
//								return sap.ui.core.ValueState.Warning;
//							case "3": case "35": case "40": case "50":
//								return sap.ui.core.ValueState.Success;
//							default:
//								return sap.ui.core.ValueState.None;
//						}
//					}
//				}
//			})
//		});
//		
//		oTable.setModel(oController._ListJSonModel);
//		oTable.bindRows("ZHR_COMPANYHOUSE_SRV>/CompanyHouseListSet");
//		oTable.attachCellClick(oController.onSelectRow);
//
//		var col_info1 = [ {
//			id : "ZHR_COMPANYHOUSE_SRV>Idx",
//			label : "No.",
//			plabel : "",
//			span : 0,
//			type : "listText",
//			sort : true,
//			filter : true,
//			width : "3%"
//		}, {
//			id : "ZHR_COMPANYHOUSE_SRV>Statust",
//			label : oBundleText.getText("LABEL_0036"),	// 36:상태
//			plabel : "",
//			span : 0,
//			type : "listText",
//			sort : true,
//			filter : true,
//			width : "7%"
//		}, {
//			id : "ZHR_COMPANYHOUSE_SRV>Usrid",
//			label : oBundleText.getText("LABEL_0031"),	// 31:사번
//			plabel : "",
//			span : 0,
//			type : "listText",
//			sort : true,
//			filter : true,
//			width : "5%"
//		}, {
//			id : "ZHR_COMPANYHOUSE_SRV>Ename",
//			label : oBundleText.getText("LABEL_0038"),	// 38:성명
//			plabel : "",
//			span : 0,
//			type : "listText",
//			sort : true,
//			filter : true,
//			width : "7%"
//		}, {
//			id : "ZHR_COMPANYHOUSE_SRV>Zzjiklnt",
//			label : oBundleText.getText("LABEL_0067"),	// 67:직위
//			plabel : "",
//			span : 0,
//			type : "listText",
//			sort : true,
//			filter : true,
//			width : "7%"
//		}, {
//			id : "ZHR_COMPANYHOUSE_SRV>Orgtx",
//			label : oBundleText.getText("LABEL_0039"),	// 39:소속부서
//			plabel : "",
//			span : 0,
//			type : "listText",
//			sort : true,
//			filter : true,
//			width : "10%"
//		}, {
//			id : "ZHR_COMPANYHOUSE_SRV>ZreqFormt",
//			label : oBundleText.getText("LABEL_0157"),	// 157:신청유형
//			plabel : "",
//			span : 0,
//			type : "listText",
//			sort : true,
//			filter : true,
//			width : "8%"
//		}, {
//			id : "ZHR_COMPANYHOUSE_SRV>Reqdt",
//			label : oBundleText.getText("LABEL_0049"),	// 49:신청일
//			plabel : "",
//			span : 0,
//			type : "listdate",
//			sort : true,
//			filter : true,
//			width : "7%"
//		}, {
//			id : "ZHR_COMPANYHOUSE_SRV>Dong",
//			label : oBundleText.getText("LABEL_1706"),	// 1706:동
//			plabel : "",
//			span : 0,
//			type : "listText",
//			sort : true,
//			filter : true,
//			width : "3%"
//		}, {
//			id : "ZHR_COMPANYHOUSE_SRV>Ho",
//			label : oBundleText.getText("LABEL_2334"),	// 2334:호
//			plabel : "",
//			span : 0,
//			type : "listText",
//			sort : true,
//			filter : true,
//			width : "4%"
//		}, {
//			id : "ZHR_COMPANYHOUSE_SRV>Indt",
//			label : oBundleText.getText("LABEL_2078"),	// 2078:입주희망일
//			plabel : "",
//			span : 0,
//			type : "listdate",
//			sort : true,
//			filter : true,
//			width : "7%"
//		}, {
//			id : "ZHR_COMPANYHOUSE_SRV>Outdt",
//			label : oBundleText.getText("LABEL_2275"),	// 2275:퇴거희망일
//			plabel : "",
//			span : 0,
//			type : "listdate",
//			sort : true,
//			filter : true,
//			width : "7%"
//		}, {
//			id : "ZHR_COMPANYHOUSE_SRV>Outrsn",
//			label : oBundleText.getText("LABEL_2272"),	// 2272:퇴거사유
//			plabel : "",
//			span : 0,
//			type : "listText",
//			sort : true,
//			filter : true
//		}, {
//			id : "ZHR_COMPANYHOUSE_SRV>Outcmpl",
//			label : oBundleText.getText("LABEL_2274"),	// 2274:퇴거처리완료
//			plabel : "",
//			span : 0,
//			type : "Checkbox5",
//			sort : true,
//			filter : true,
//			width : "5%"
//		} ];
//		common.ZNK_TABLES.makeColumn(oController, oTable, col_info1);
//		oTable.setVisibleRowCount(10);
//
//		var oCell, oRow;
//		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
//			columns : 1,
//			width : "100%"
//		});
//
//		var vTableHeader = new sap.m.Toolbar({
//			height : "35px",
//			content : [ new sap.m.ToolbarSpacer({
//				width : "5px"
//			}), new sap.m.MessageStrip(oController.PAGEID + "_CountDown", {
//				text : oBundleText.getText("LABEL_1114"),	// 1114:신청기한 :       급여반영월 :     남은시간 :   
//				type : "Success",
//				showIcon : true,
//				customIcon : "sap-icon://message-information",
//				showCloseButton : false,
//			}) ]
//		}).addStyleClass("L2PToolbarNoBottomLine");
//
//		// var oContents = [vTableHeader, new sap.ui.core.HTML({content : "<div
//		// style='height : 7px;'/>"}), oTable];
//		var oContents = [ new sap.ui.core.HTML({
//			content : "<div style='height : 7px;'/>"
//		}), oTable ];
//
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.ui.core.HTML({
//				content : "<div style='height : 10px;'/>"
//			})
//		});
//		oRow.addCell(oCell);
//		oContentMatrix.addRow(oRow)
//		for (var i = 0; i < oContents.length; i++) {
//			// oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//			// oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			// content : new sap.ui.core.HTML({content : "<div style='height :
//			// 10px;'/>"})
//			// });
//			// oRow.addCell(oCell);
//			oContentMatrix.addRow(oRow);
//			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//				content : oContents[i]
//			});
//			oRow.addCell(oCell);
//			oContentMatrix.addRow(oRow);
//		}
//
//		var oIconFilter = new sap.m.IconTabFilter(oController.PAGEID
//				+ "_IconTabFilter", {
//			showAll : true,
//			key : "All",
//			icon : "",
//			text : oBundleText.getText("LABEL_0001"),	// 건
//			design : sap.m.IconTabFilterDesign.Horizontal,
//		});
//
//		var iCopnSeperator = new sap.m.IconTabSeparator();
//
//		var oIconFilter1 = new sap.m.IconTabFilter(oController.PAGEID
//				+ "_IconTabFilter1", {
//			key : "1",
//			icon : "sap-icon://create",
//			iconColor : "Neutral",
//			text : oBundleText.getText("LABEL_0059"),	// 59:작성중
//			design : sap.m.IconTabFilterDesign.Horizontal,
//		});
//
//		var oIconFilter2 = new sap.m.IconTabFilter(oController.PAGEID
//				+ "_IconTabFilter2", {
//			key : "2",
//			icon : "sap-icon://approvals",
//			iconColor : "Critical",
//			text : oBundleText.getText("LABEL_0044"),	// 44:신청
//			design : sap.m.IconTabFilterDesign.Horizontal,
//		});
//
//		var oIconFilter3 = new sap.m.IconTabFilter(oController.PAGEID
//				+ "_IconTabFilter3", {
//			key : "3",
//			icon : "sap-icon://sys-enter",
//			iconColor : "Positive",
//			text : oBundleText.getText("LABEL_1649"),	// 1649:담당자확인
//			design : sap.m.IconTabFilterDesign.Horizontal,
//		});
//
//		var oIconBar = new sap.m.IconTabBar(oController.PAGEID + "_ICONBAR", {
//			content : oContentMatrix,
//			items : [ oIconFilter, iCopnSeperator, 
//				      oIconFilter1, new sap.m.IconTabSeparator({icon : "sap-icon://process"}),
//				      oIconFilter2, new sap.m.IconTabSeparator({icon : "sap-icon://process"}),
//					  oIconFilter3 
//					],
//			selectedKey : "All",
//			select : oController.handleIconTabBarSelect
//		})
//
//		var oLayout = new sap.ui.commons.layout.VerticalLayout({
//			width : "100%",
//			content : [ new sap.ui.core.HTML({
//				content : "<div style='height : 11px;'/>"
//			}), oFilterLayout, oIconBar ]
//		});
//
//		// if (!jQuery.support.touch) {
//		oLayout.addStyleClass("sapUiSizeCompact");
//		// };
//
//		return oLayout;
//
//	}
});