sap.ui.jsfragment("ZUI5_HR_ActionRequest.fragment.ActionRequestPage01", {
	_colModel : [
		{id: "Idx", label : "No.", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "3%"},
		{id: "ZappStxtAl", label : oBundleText.getText("LABEL_0036"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "5%"},	// 36:상태
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "4%"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "5%"},	// 38:성명
		{id: "Zzjiklnt", label : oBundleText.getText("LABEL_0067"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "8%"},	// 67:직위
		{id: "Orgtx", label : oBundleText.getText("LABEL_0039"), plabel : "", span : 0, type : "listText6", sort : true, filter : true, width : "10%", align : "Begin"},	// 39:소속부서
		{id: "Title", label : oBundleText.getText("LABEL_0761"), plabel : "", span : 0, type : "listText6", sort : true, filter : true, width : "15%", align : "Begin"},	// 761:제목
		{id: "Reqcnt", label : oBundleText.getText("LABEL_1028"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "7%"},	// 1028:신청 인원
		{id: "ZreqDate", label : oBundleText.getText("LABEL_0049"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "100px"},	// 49:신청일
		{id: "ZappDate", label : oBundleText.getText("LABEL_0070"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "100px"},	// 70:최종결재일
		{id: "ZListComment", label : oBundleText.getText("LABEL_0072"), plabel : "", span : 0, type : "commentpopover", sort : true, filter : true, width : "5%"}	// 72:담당자의견
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
									text : oBundleText.getText("LABEL_1036")	// 1036:내신서 신청
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
									text: oBundleText.getText("LABEL_0043"),	// 43:신규신청
									type : sap.m.ButtonType.Default,
									press : oController.onPressRegCheck
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
			columnHeaderHeight  : 35,
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
		
		return oTable;
	},
	
	
//	
//	createContent : function(oController) {
//		jQuery.sap.require("common.Common");
//		jQuery.sap.require("common.SearchUserList");
//		jQuery.sap.require("common.ZHR_TABLES");
//		
//		common.SearchUserList.oController = oController ;
//		
//		var displayYn = (_gAuth == 'E') ? false : true;
//		
//		var oFilterLayout = new sap.ui.layout.HorizontalLayout({ 
//			allowWrapping :true,
//			content : [
//				new sap.ui.layout.VerticalLayout({
//					content : [
//						new sap.m.Text({
//							text : oBundleText.getText("LABEL_1043")	// 1043:신청기간
//						}).addStyleClass("L2PFontFamily"),
//						new sap.m.DatePicker(oController.PAGEID + "_Apbeg", {
//							valueFormat : "yyyy-MM-dd",
//				            displayFormat : "yyyy.MM.dd",
//				            value : "{Apbeg}",
//							width : "150px",
//							change : oController.onChangeDate
//						}).addStyleClass("L2PFontFamily")
//					]
//				}).addStyleClass("L2PFilterItem"),
//				new sap.ui.layout.VerticalLayout({
//					content : [
//						new sap.m.Text({
//							text : ""
//						}).addStyleClass("L2PFontFamily"),
//						new sap.m.DatePicker(oController.PAGEID + "_Apend", {
//							valueFormat : "yyyy-MM-dd",
//				            displayFormat : "yyyy.MM.dd",
//							width : "150px",
//							value : "{Apend}",
//							change : oController.onChangeDate
//						}).addStyleClass("L2PFontFamily")
//					]
//				}).addStyleClass("L2PFilterItem"),
//				
//				new sap.ui.layout.VerticalLayout({
//					content : [
//						new sap.m.Label(),
//						new sap.m.Button({
//							text: oBundleText.getText("LABEL_0002"),	// 검색
//							icon : "sap-icon://search",
//							type : sap.m.ButtonType.Emphasized,
//							press : oController.onPressSearch ,
//						}).addStyleClass("L2PFontFamily")
//					]
//				}).addStyleClass("L2PFilterItem")
//			]
//		}).addStyleClass("L2PFilterLayout")
//		.setModel(oController._ListCondJSonModel)
//		.bindElement("/Data");;
//		
//		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
//			enableColumnReordering : false,
//			enableColumnFreeze : false,
//			columnHeaderHeight  : 35,
//			showNoData : true,
//			selectionMode: sap.ui.table.SelectionMode.None,
//			showOverlay : false,
//			enableBusyIndicator : true,
//			noData : "No data found",
//			rowActionCount : 1,
//			rowActionTemplate : new sap.ui.table.RowAction({
//				items : [
//					new sap.ui.table.RowActionItem({
//						icon : "sap-icon://navigation-right-arrow",
//						customData : [
//							new sap.ui.core.CustomData({
//								key : "Appno", value : "{Appno}"
//							})
//						],
//						press : oController.onPressRow
//					})
//				]
//			}),
//			extension : new sap.m.Toolbar({ 
//				content : [
//					new sap.m.Text({
//						text : oBundleText.getText("LABEL_0047")	// 47:신청내역
//					}).addStyleClass("L2PFontFamilyBold"),
//					new sap.m.ToolbarSpacer(),
//					new sap.ui.core.Icon({
//						src : "sap-icon://excel-attachment",
//						size : "1.0rem", 
//						color : "#002060",
//						press : oController.onExport
//					}).addStyleClass("L2PPointer")
//				]
//			}).addStyleClass("L2PToolbarNoBottomLine"),
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
//		}).setModel(oController._ListJSonModel)
//		.bindRows("/Data")	
//		.attachCellClick(oController.onSelectRow);
//		
//		var colModel = [
//			{id: "Idx", label : "No.", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "3%"},
//			{id: "ZappStxtAl", label : oBundleText.getText("LABEL_0036"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "5%"},	// 36:상태
//			{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "4%"},	// 31:사번
//			{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "5%"},	// 38:성명
//			{id: "Zzjiklnt", label : oBundleText.getText("LABEL_0067"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "8%"},	// 67:직위
//			{id: "Orgtx", label : oBundleText.getText("LABEL_0039"), plabel : "", span : 0, type : "listText6", sort : true, filter : true, width : "10%", align : "Begin"},	// 39:소속부서
//			{id: "Title", label : oBundleText.getText("LABEL_0761"), plabel : "", span : 0, type : "listText6", sort : true, filter : true, width : "15%", align : "Begin"},	// 761:제목
//			{id: "Reqcnt", label : oBundleText.getText("LABEL_1028"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "7%"},	// 1028:신청 인원
//			{id: "ZreqDate", label : oBundleText.getText("LABEL_0049"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "100px"},	// 49:신청일
//			{id: "ZappDate", label : oBundleText.getText("LABEL_0070"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "100px"},	// 70:최종결재일
//			{id: "ZListComment", label : oBundleText.getText("LABEL_0072"), plabel : "", span : 0, type : "commentpopover", sort : true, filter : true, width : "5%"}	// 72:담당자의견
//		];
//		common.ZHR_TABLES.makeColumn(oController, oTable, colModel);
//		
//		var oCell, oRow;						
//		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
//			columns : 1,
//			width : "100%"
//		});		 
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.ui.core.HTML({content : "<div style='height : 7px;'/>"})
//		});
//		oRow.addCell(oCell);
//		oContentMatrix.addRow(oRow);
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : oTable
//		});
//		oRow.addCell(oCell);
//		oContentMatrix.addRow(oRow);
//		
//		var oIconFilter = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter", {
//			showAll : true,
//			key : "All",
//			icon : "",
//			text : oBundleText.getText("LABEL_0001"),	// 건
//			design : sap.m.IconTabFilterDesign.Horizontal,
//		});
//		
//		var iConSeperator = new sap.m.IconTabSeparator();
//		
//		var oIconFilter1 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter1", {
//			key : "10",
//			icon : "sap-icon://create",
//			iconColor : "Neutral",
//			text : oBundleText.getText("LABEL_0059"),	// 59:작성중
//			design : sap.m.IconTabFilterDesign.Horizontal,
//		});
//		
//		var oIconFilter2 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter2", {
//			key : "20",
//			icon : "sap-icon://approvals",
//			iconColor : "Critical",
//			text : oBundleText.getText("LABEL_0044"),	// 44:신청
//			design : sap.m.IconTabFilterDesign.Horizontal,
//		});
//		
//		var oIconFilter3 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter3", {
//			key : "30",
//			icon : "sap-icon://sys-enter",
//			iconColor : "Positive",
//			text : oBundleText.getText("LABEL_0068"),	// 68:진행중
//			design : sap.m.IconTabFilterDesign.Horizontal,
//		});
//		
//		var oIconFilter4 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter4", {
//			key : "40",
//			icon : "sap-icon://accept",
//			iconColor : "Default",
//			text : oBundleText.getText("LABEL_0041"),	// 41:승인
//			design : sap.m.IconTabFilterDesign.Horizontal,
//		});
//		
//		var oIconFilter5 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter5", {
//			key : "50",
//			icon : "sap-icon://decline",
//			iconColor : "Negative",
//			text : oBundleText.getText("LABEL_0024"),	// 24:반려
//			design : sap.m.IconTabFilterDesign.Horizontal,
//		});
//		
//		var oIconBar = new sap.m.IconTabBar(oController.PAGEID + "_ICONBAR",{
//			content : oContentMatrix ,
//			items : [ 
//				oIconFilter, iConSeperator, 
//				oIconFilter1, new sap.m.IconTabSeparator({icon : "sap-icon://process"}), 
//				oIconFilter2, new sap.m.IconTabSeparator({icon : "sap-icon://process"}), 
//				oIconFilter3, new sap.m.IconTabSeparator({icon : "sap-icon://process"}),
//				oIconFilter4, new sap.m.IconTabSeparator({icon : "sap-icon://vertical-grip"}),
//				oIconFilter5 
//			],
//		    selectedKey : "All",
//			select : oController.handleIconTabBarSelect
//		});
//										
//		var oLayout = new sap.ui.commons.layout.VerticalLayout({
//			width : "100%",
//			content : [ 
//				new sap.ui.core.HTML({content : "<div style='height : 11px;'/>"}),
//				oFilterLayout,
//				oIconBar 
//			]
//		}).addStyleClass("sapUiSizeCompact");
//		
//		oLayout.addEventDelegate({
//			onAfterRendering : function() {
//				oController._Columns = [];
//				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy.MM.dd"});
//				for(var i=0; i<colModel.length; i++){
//					var column = {};
//						column.label = colModel[i].label;
//						column.property = colModel[i].id;
//					
//					if(colModel[i].type == "listdate") {
//						column.type = "date";
//						column.template = {
//							content : {
//								parts : [
//									colModel[i].id
//								],
//								formatter : function(fVal) {
//									if(!fVal || fVal == null) return "";
//									return dateFormat.format(new Date(common.Common.setTime(fVal)));
//								}
//							} 
//						};
//					} else if( colModel[i].type == "listText") {
//						column.type = "string";
//					}
//						
//					oController._Columns.push(column);
//				}
//				
//			}
//		});
//
//		return oLayout;
//	}
});