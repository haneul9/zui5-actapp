sap.ui.jsfragment("ZUI5_HR_ApplyBox.fragment.ApplyBoxPage01", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "50px"},
	 	{id: "ZappStxtAl", label : oBundleText.getText("LABEL_0036"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "80px"},	// 36:상태
	 	{id: "Zstep", label : oBundleText.getText("LABEL_1074"), plabel : "", span : 0, type : "listText8", sort : true, filter : true, width : "100px"},	// 1074:단계
	 	{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "80px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "120px"},	// 38:성명
		{id: "Zzjiklnt", label : oBundleText.getText("LABEL_0067"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "150px"},	// 67:직위
		{id: "Orgtx", label : oBundleText.getText("LABEL_0039"), plabel : "", span : 0, type : "listText", sort : true, filter : true, align : "Begin", width : "200px"},	// 39:소속부서
		{id: "ZreqForx", label : oBundleText.getText("LABEL_0157"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "280px"},	// 157:신청유형
		{id: "ZappTitl", label : oBundleText.getText("LABEL_0511"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "300px"},	// 511:신청내용
		{id: "Apename", label : oBundleText.getText("LABEL_0050"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "120px"},	// 50:신청자
		{id: "ZreqDate", label : oBundleText.getText("LABEL_0049"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "100px"},	// 49:신청일
		{id: "ZappDate", label : oBundleText.getText("LABEL_0107"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "100px"},	// 107:결재일
		{id: "Appno", label : oBundleText.getText("LABEL_0607"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "150px"},	// 607:문서번호
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
									this.getIconRender(oController),
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
									text : oBundleText.getText("LABEL_1070"),	// 1070:HR 신청함
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
//								new sap.m.Button({
//									text: oBundleText.getText("LABEL_1070"),	// 1070:HR 신청함
//									type : sap.m.ButtonType.Default,
//									press : oController.onPressNew
//								})
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
		var oApprovalCombo = new sap.m.ComboBox({
			selectedKey : "{ZreqForm}"
     	 });
		 	
		oApprovalCombo.destroyItems();
		
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
					text : oBundleText.getText("LABEL_0157") 	// 157:신청유형
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox({
		            items : {
		            	path: "ZHR_APPL_SRV>/FormCodeListSet",
		            	template: new sap.ui.core.ListItem({
		            		key: "{ZHR_APPL_SRV>Key}",
		            		text: "{ZHR_APPL_SRV>Value}"
		            	})
		            },
		            selectedKey: "{ZreqForm}",
					width : "200px",
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_1069")	// 1069:결재상태
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.ComboBox({
		            items : {
		            	path: "ZHR_APPL_SRV>/StatCodeListSet",
		            	template: new sap.ui.core.ListItem({
		            		key: "{ZHR_APPL_SRV>Key}",
		            		text: "{ZHR_APPL_SRV>Value}"
		            	})
		            },
		            selectedKey: "{ZappStatAl}",
					width : "200px",
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
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			fixedColumnCount : 5,
			enableBusyIndicator : true,
			noData : "No data found",
			rowActionCount : 1,
			rowActionTemplate : new sap.ui.table.RowAction({
				items : [
					new sap.ui.table.RowActionItem({
						icon : "sap-icon://navigation-right-arrow",
						customData : [
							new sap.ui.core.CustomData({
								key : "Appno", value : "{Appno}"
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
						{path : "ZappStatAl"},
						{path : "ZappDate"}
					],
					//Information : 파란색 , Warning : 주황색,  Success : 초록색
					formatter : function(fVal1, fVal2) {
						switch(fVal1) {
							case "20":
								return sap.ui.core.ValueState.Warning;
							case "30": case "35": case "40": case "50":
								return (fVal2 == null || fVal2 == "") ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.Information;
							case "31": case "36": case "45": case "55":
								return sap.ui.core.ValueState.Error;
							default:
								return sap.ui.core.ValueState.None;
						}
					}
				}
			})
		}).setModel(oController._ListJSonModel)
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
	
	getIconRender : function(oController) {
		
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
												text : oBundleText.getText("LABEL_0044")	// 44:신청
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
														if(fVal && fVal == "Y") return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Tab_icon_03_Over.png";
														else return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/tab_icon_03.png";
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
											}).addStyleClass("Font30px FontColorIconTab3"),
											hAlign : "Left" ,
											vAlign : "Middle" 
										})
									]
								}),
								new sap.ui.commons.layout.MatrixLayoutRow({
									cells: [
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Text({
												text : oBundleText.getText("LABEL_0068")	// 68:진행중
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
														if(fVal && fVal == "Y") return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Tab_icon_04_Over.png";
														else return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/tab_icon_04.png";
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
												text : oBundleText.getText("LABEL_0041"),	// 41:승인
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
							src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/ic_or.png"
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
													path : "click5",
													formatter : function(fVal) {
														if(fVal && fVal == "Y") return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Tab_icon_05_Over.png";
														else return "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/tab_icon_05.png";
													}
												},
												press : function() {
													oController.handleIconTabBarSelect(oController, "5");
												}
											}).addStyleClass("noOutline"),
											hAlign : "Right",
											rowSpan : 2,
											vAlign : "Bottom"
										}),
										new sap.ui.commons.layout.MatrixLayoutCell({
											content : new sap.m.Text({
												text : "{Count5}"
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
												text : oBundleText.getText("LABEL_0024")	// 0024: 반려
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
		
	}
});