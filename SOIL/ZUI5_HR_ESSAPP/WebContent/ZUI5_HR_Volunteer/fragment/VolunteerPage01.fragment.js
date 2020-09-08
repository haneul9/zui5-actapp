sap.ui.jsfragment("ZUI5_HR_Volunteer.fragment.VolunteerPage01", {
	
	_colModel1 : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "50px"},
	],
	
	_colModel2 : [
 	   	{id: "ZappStxtAl", label : oBundleText.getText("LABEL_0036"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "80px"},	// 36:상태
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "80px"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "100px"},	// 38:성명
		{id: "Zzjiklnt", label : oBundleText.getText("LABEL_0067"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "150px"},	// 67:직위
		{id: "Orgtx", label : oBundleText.getText("LABEL_0039"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "200px", align : "Begin"},	// 39:소속부서
		{id: "ZreqForx", label : oBundleText.getText("LABEL_0080"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "160px"},	// 80:신청구분
		{id: "Reqdt", label : oBundleText.getText("LABEL_0049"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "120px"},	// 49:신청일
		{id: "Zdate", label : oBundleText.getText("LABEL_2317"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "120px"},	// 2317:행사일
		{id: "Evecdt", label : oBundleText.getText("LABEL_2314"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "180px", align : "Begin"},	// 2314:행사명
		{id: "Welcdt", label : oBundleText.getText("LABEL_1602"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "180px", align : "Begin"},	// 1602:기관명
		{id: "Evepe", label : oBundleText.getText("LABEL_2320"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "180px", align : "Begin"},	// 2320:행사장
		{id: "ZappDate", label : oBundleText.getText("LABEL_0070"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "120px"},	// 70:최종결재일
		{id: "Docyn", label : oBundleText.getText("LABEL_0069"), plabel : "", span : 0, type : "ptifile", sort : false, filter : false, width : "50px"},	// 69:첨부
		{id: "ZListComment", label : oBundleText.getText("LABEL_0072"), plabel : "", span : 0, type : "commentpopover", sort : true, filter : true, width : "300px"}	// 72:담당자의견
	],
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.SearchUser1");
		jQuery.sap.require("common.ZHR_TABLES");
		
		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(this._colModel1);
		oController._ColumnB = common.Common.convertColumnArrayForExcel(this._colModel2);
		oController._ColumnB.forEach(function(element){
			oController._Columns.push(element);
		});
		
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
									this.getFilterLayoutRender(oController),								// 검색필터
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
									sap.ui.jsfragment("fragment.IconTab", oController),						// 분류
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
				height : "20px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_A.png"}),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_1836")	// 1836:사회봉사 계획/보고서 작성
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
									text : oBundleText.getText("LABEL_1837"), 	// 1837:사회봉사 계획서
									type : "Default", 
									press : oController.onPressNew1
								}),
								new sap.m.Button({
									text : oBundleText.getText("LABEL_1838"), 	// 1838:사회봉사 보고서
									type : "Default", 
									press : oController.onPressNew2
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
	 * @return sap.m.Toolbar
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
				new sap.m.Text({text : oBundleText.getText("LABEL_0080")}).addStyleClass("FontFamilyBold"),	// 80:신청구분
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.Select({
					width : "200px",
					selectedKey : "{Key}",
					items : {
		            	path: "ZHR_VOLUNTEER_SRV>/FormCodeListSet",
		            	template: new sap.ui.core.ListItem({
		            		key: "{ZHR_VOLUNTEER_SRV>Key}",
		            		text: "{ZHR_VOLUNTEER_SRV>Value}"
		            	})
		            }
				}),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_0084"),	// 84:신청자 성명 
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
	 * @return sap.ui.table.Table
	 */
	getListTableRender : function(oController) {
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			fixedColumnCount : 6,
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
		})
		.setModel(oController._ListJSonModel)
		.bindRows("/Data")
		.attachCellClick(oController.onSelectRow);
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel1);
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "55px",
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_0037"), 	// 37:선택
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
			template : [new sap.m.CheckBox({
							selected : "{Check}",
							visible : {
								parts : [{path : "ZappStatAl"}, {path : "Plandyn"}, {path : "ZreqForm"}],
								formatter : function(fVal1, fVal2, fVal3){
									if(fVal1 == "50" && fVal2 == false && fVal3 == "GA01") return true;
									else return false;
								}
							},
					   }).addStyleClass("FontFamily")]
		}));
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel2);
		
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
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
//	
//	
//	/**
//	 * 검색필터 rendering
//	 * 
//	 * @param oController
//	 * @return sap.ui.layout.HorizontalLayout
//	 */
//	getFilterLayoutRender : function(oController) {
//		
//		return new sap.ui.layout.HorizontalLayout({
//			allowWrapping : true,
//			content : [
//				new sap.ui.layout.VerticalLayout({
//					content : [
//						new sap.m.Text({
//							text : oBundleText.getText("LABEL_1043")	// 1043:신청기간
//						}).addStyleClass("FontFamily"),
//					    new sap.m.DatePicker(oController.PAGEID + "_Apbeg", {
//					    	valueFormat : "yyyy-MM-dd",
//					    	displayFormat : "yyyy.MM.dd",
//					    	value : "{Apbeg}",
//					    	width : "150px",
//					    	change : oController.onChangeDate
//						}).addStyleClass("FontFamily")
//					]
//				}).addStyleClass("FilterItem"),
//				new sap.ui.layout.VerticalLayout({
//					content : [
//						new sap.m.Text({text : ""}),
//						new sap.m.DatePicker(oController.PAGEID + "_Apend", {
//							valueFormat : "yyyy-MM-dd",
//							displayFormat : "yyyy.MM.dd",
//							width : "150px",
//							value : "{Apend}",
//							change : oController.onChangeDate
//						}).addStyleClass("FontFamily")
//					]
//				}).addStyleClass("FilterItem"),
//				new sap.ui.layout.VerticalLayout({
//					content : [
//						new sap.m.Text({text : oBundleText.getText("LABEL_0080")}).addStyleClass("FontFamily"),	// 80:신청구분
//						new sap.m.Select({
//							width : "200px",
//							selectedKey : "{Key}",
//							items : {
//				            	path: "ZHR_VOLUNTEER_SRV>/FormCodeListSet",
//				            	template: new sap.ui.core.ListItem({
//				            		key: "{ZHR_VOLUNTEER_SRV>Key}",
//				            		text: "{ZHR_VOLUNTEER_SRV>Value}"
//				            	})
//				            },
//						})
//					]
//				}).addStyleClass("FilterItem"),
//				new sap.ui.layout.VerticalLayout({
//					content : [
//						new sap.m.Text({
//							text : oBundleText.getText("LABEL_0084") 	// 84:신청자 성명
//						}).addStyleClass("FontFamily"),
//						new sap.m.Input(oController.PAGEID + "_Ename", {
//							width : "150px",
//							showValueHelp: true,
//							valueHelpOnly: false,
//							value : "{Ename}",
//							customData : new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"}),
//							change : oController.EmpSearchByTx,
//							valueHelpRequest: oController.displayEmpSearchDialog
//						}).addStyleClass("FontFamily")
//					],
//					visible : (_gAuth == 'E') ? false : true
//				}).addStyleClass("FilterItem"),
//				new sap.ui.layout.VerticalLayout({
//					content : [
//						new sap.m.Label(),
//						new sap.m.Button({
//							text: oBundleText.getText("LABEL_0002"),
//							icon : "sap-icon://search",
//							press : oController.onPressSearch ,
//						}).addStyleClass("FontFamily")
//					]
//				}).addStyleClass("FilterItem")
//			]
//		}).addStyleClass("FilterLayout")
//		.setModel(oController._ListCondJSonModel)
//		.bindElement("/Data");
//	},
//	
//	/**
//	 * 목록테이블 rendering
//	 * 
//	 * @param oController
//	 * @return sap.m.IconTabBar
//	 */
//	getListTableRender : function(oController) {
//		
//		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
//			enableColumnReordering : false,
//			enableColumnFreeze : false,
//			columnHeaderHeight : 35,
//			showNoData : true,
//			selectionMode: sap.ui.table.SelectionMode.None,
//			showOverlay : false,
//			enableBusyIndicator : true,
//			noData : "No data found",
//			fixedColumnCount : 6,
//			rowActionCount : 1,
//			rowActionTemplate : new sap.ui.table.RowAction({
//				items : [
//					new sap.ui.table.RowActionItem({
//						icon : "sap-icon://navigation-right-arrow",
//						customData : [
//							new sap.ui.core.CustomData({
//								key : "Appno", 
//								value : "{Appno}"
//							})
//						],
//						press : oController.onPressRow
//					})
//				]
//			}),
//			extension : new sap.m.Toolbar({	
//				content : [
//					new sap.m.Text({text : oBundleText.getText("LABEL_0047")}).addStyleClass("FontFamilyBold"),	// 47:신청내역
//					new sap.m.ToolbarSpacer(),
//					new sap.ui.core.Icon({
//						src : "sap-icon://excel-attachment",
//						size : "1.0rem", 
//						color : "#002060",
//						press : oController.onExport
//					}).addStyleClass("Pointer")
//				]
//			}).addStyleClass("ToolbarNoBottomLine"),
//			rowSettingsTemplate : new sap.ui.table.RowSettings({
//				highlight : {
//					parts : [
//						{path : "ZappStatAl"},
//						{path : "ZappDate"}
//					],
//					//Information : 파란색 , Warning : 주황색,  Success : 초록색											
//					formatter : function(fVal1, fVal2) {
//						switch(fVal1) {
//							case "20":
//								return sap.ui.core.ValueState.Warning;
//							case "30": case "35": case "40": case "50":
//								return (fVal2 == null || fVal2 == "") ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.Information;
//							case "31": case "36": case "45": case "55":
//								return sap.ui.core.ValueState.Error;
//							default:
//								return sap.ui.core.ValueState.None;
//						}
//					}
//				}
//			})
//		})
//		.setModel(oController._ListJSonModel)
//		.bindRows("/Data")
//		.attachCellClick(oController.onSelectRow);
//		
//		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel1);
//		
//		oTable.addColumn(new sap.ui.table.Column({
//			hAlign : "Center",
//			flexible : false,
//        	autoResizable : true,
//        	filterProperty : "",
//        	sortProperty : "",
//        	resizable : true,
//			showFilterMenuEntry : true,
//			width : "55px",
//			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_0037"), 	// 37:선택
//										   textAlign : "Center"}).addStyleClass("FontFamily"),
//			template : [new sap.m.CheckBox({
//							selected : "{Check}",
//							visible : {
//								parts : [{path : "ZappStatAl"}, {path : "Plandyn"}, {path : "ZreqForm"}],
//								formatter : function(fVal1, fVal2, fVal3){
//									if(fVal1 == "50" && fVal2 == false && fVal3 == "GA01") return true;
//									else return false;
//								}
//							},
//					   }).addStyleClass("FontFamily")]
//		}));
//		
//		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel2);
//		
//		return new sap.m.IconTabBar(oController.PAGEID + "_ICONBAR", {
//			content : new sap.ui.commons.layout.MatrixLayout({
//				columns : 1,
//				width : "100%",
//				rows : [
//					new sap.ui.commons.layout.MatrixLayoutRow({
//						cells : [
//							new sap.ui.commons.layout.MatrixLayoutCell({
//								content : oTable
//							})
//						]
//					})
//				]
//			}),
//			items : [ 
//				new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter", {
//					showAll : true,
//					key : "All",
//					icon : "",
//					text : oBundleText.getText("LABEL_0001"),	// 건
//					design : sap.m.IconTabFilterDesign.Horizontal
//				}), 
//				new sap.m.IconTabSeparator(), 
//				new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter1", {
//					key : "10",
//					icon : "sap-icon://create",
//					iconColor : sap.ui.core.IconColor.Neutral,
//					text : oBundleText.getText("LABEL_0059"),	// 59:작성중
//					design : sap.m.IconTabFilterDesign.Horizontal
//				}), 
//			    new sap.m.IconTabSeparator({icon : "sap-icon://process"}), 
//				new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter2", {
//					key : "20",
//					icon : "sap-icon://approvals",
//					iconColor : sap.ui.core.IconColor.Critical,
//					text : oBundleText.getText("LABEL_0044"),	// 44:신청
//					design : sap.m.IconTabFilterDesign.Horizontal
//				}), 
//			    new sap.m.IconTabSeparator({icon : "sap-icon://process"}), 
//				new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter3", {
//					key : "30",
//					icon : "sap-icon://sys-enter",
//					iconColor : sap.ui.core.IconColor.Positive,
//					text : oBundleText.getText("LABEL_0068"),	// 68:진행중
//					design : sap.m.IconTabFilterDesign.Horizontal
//				}),
//			    new sap.m.IconTabSeparator({icon : "sap-icon://process"}), 
//				new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter4", {
//					key : "40",
//					icon : "sap-icon://accept",
//					iconColor : sap.ui.core.IconColor.Default,
//					text : oBundleText.getText("LABEL_0041"),	// 41:승인
//					design : sap.m.IconTabFilterDesign.Horizontal
//				}), 
//				new sap.m.IconTabSeparator({icon : "sap-icon://vertical-grip"}),
//				new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter5", {
//					key : "50",
//					icon : "sap-icon://decline",
//					iconColor : sap.ui.core.IconColor.Negative,
//					text : oBundleText.getText("LABEL_0024"),	// 24:반려
//					design : sap.m.IconTabFilterDesign.Horizontal
//				})
//			],
//		    selectedKey : "All",
//			select : oController.handleIconTabBarSelect
//		});
//	}
});