sap.ui.jsfragment("ZUI5_HR_HousingExpenses.fragment.HousingExpensesPage01", {
	_colModel : [],
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.SearchUserList");
		jQuery.sap.require("common.ZHR_TABLES");
		jQuery.sap.require("control.ODataFileUploader");
		jQuery.sap.require("common.AttachFileAction");  
		
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
									sap.ui.jsfragment("fragment.ApplyInformationLayout", oController),
									new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
									this.getFilterLayoutRender(oController),
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
									text: oBundleText.getText("LABEL_2162"),	// 2162:지방사택 변동성 경비 관리
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
		return new sap.m.Toolbar({
			height : "45px",
			content : [
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.RadioButtonGroup({
					columns : 2,
					buttons : [new sap.m.RadioButton({text: oBundleText.getText("LABEL_1928"), value : 0}).addStyleClass("FontFamily"), 	// 1928:업로드
					           new sap.m.RadioButton({text: oBundleText.getText("LABEL_0064"), value : 1 }).addStyleClass("FontFamily")], 	// 64:조회
		            selectedIndex : "{State}",
					select : oController.onChangeState
				}).setModel(oController._ListCondJSonModel),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({
					text : oBundleText.getText("LABEL_1737")	// 1737:발생월
				}).addStyleClass("Font14px FontBold"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker(oController.PAGEID + "_Apbeg", {
					value : "{Apbeg}",
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM",
					placeholder : "YYYY.MM",
					width : "150px",
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.Toolbar({
					content : [
						new sap.m.DatePicker(oController.PAGEID + "_Apend", {
							width : "150px",
							value : "{Apend}",
							valueFormat : "yyyy-MM-dd",
							displayFormat : "yyyy.MM",
							placeholder : "YYYY.MM",
						}).addStyleClass("Font14px FontColor6"),
						new sap.m.ToolbarSpacer({width : "20px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_0815")}).addStyleClass("Font14px FontBold"),
						new sap.m.ToolbarSpacer({width : "10px"}),
						new sap.m.Input(oController.PAGEID + "_Orgeh",{
							width : "150px",
							showValueHelp: true,
							valueHelpOnly: true,
							value : "{Orgtx}",
							customData : new sap.ui.core.CustomData({key : "Orgeh", value : "{Orgeh}"}),
							valueHelpRequest: oController.displayOrgSearchDialog,
						}).addStyleClass("Font14px FontColor6"),
						new sap.m.ToolbarSpacer({width : "20px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_0111")
						}).addStyleClass("Font14px FontBold"),
						new sap.m.ToolbarSpacer({width : "10px"}),
						new sap.m.Input({
							width : "150px",
							showValueHelp: true,
							valueHelpOnly: false,
							value : "{Ename}",
							customData : new sap.ui.core.CustomData({key : "Encid", value : "{Encid}"}),
							change : oController.EmpSearchByTx,
							valueHelpRequest: oController.displayEmpSearchDialog
						}).addStyleClass("Font14px FontBold"),
						new sap.m.ToolbarSpacer(),
					],
					visible : { path : "State" ,
						formatter : function(fVal){
							return fVal == 1 ? true : false;
						}
					}
				}),
				new sap.m.ToolbarSpacer(),
				new sap.m.Toolbar({
					content : [
						new sap.m.Button({
							text: oBundleText.getText("LABEL_0064"),	// 64:조회
							icon : "sap-icon://search",
							type : sap.m.ButtonType.Emphasized,
							press : oController.onPressSearch ,
						}),
					],
					visible : { path : "State" ,
						formatter : function(fVal){
							return fVal == 1 ? true : false;
						}
					}
				}),
				
				new sap.m.Toolbar({
					content : [
						new sap.m.Button({text : oBundleText.getText("LABEL_1926"), type : "Default" , icon :"sap-icon://download" ,	// 1926:양식다운로드
							press : oController.onDownloadFormat,
							type : sap.m.ButtonType.Emphasized,
						}),
						new control.ODataFileUploader(oController.PAGEID + "_ATTACHFILE_BTN", {
							name : oController.PAGEID + "_ATTACHFILE_BTN",
							modelName : "ZHR_COMMON_SRV",
							slug : "",
							maximumFileSize: 1,
							multiple : true,
							uploadOnChange: false,
							mimeType: [], //["image","text","application"],
							fileType: ["xlsx","xls"], 
							buttonText : oBundleText.getText("LABEL_1928"),	// 1928:업로드
							buttonOnly : true,
							uploadAborted : common.AttachFileAction.uploadAborted,
							fileSizeExceed: common.AttachFileAction.fileSizeExceed,
							typeMissmatch: common.AttachFileAction.typeMissmatch,
							change : oController.onUploadExcel,
							style : "Emphasized",
						}),
						new sap.m.Button({
							text : oBundleText.getText("LABEL_2106"), type : "Default", icon :"sap-icon://paper-plane" ,	// 2106:전송
						    press : oController.onPressTransport ,
						    type : sap.m.ButtonType.Emphasized,
						})			
					],
					visible : { path : "State" ,
						formatter : function(fVal){
							return fVal == 0 ? true : false;
						}
					}
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
			enableBusyIndicator : true,
			noData : "No data found",
			visibleRowCount : 1,
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
						{path : "Appst"}
					],
					//Information : 파란색 , Warning : 주황색,  Success : 초록색
					formatter : function(fVal1) {
						switch(fVal1) {
							case "10":
								return sap.ui.core.ValueState.Warning;
							case "20":
								return sap.ui.core.ValueState.Information;
							case "25":
								return sap.ui.core.ValueState.Error;
							case "30":
								return sap.ui.core.ValueState.Success ;
							case "35":
								return sap.ui.core.ValueState.Error;
							default:
								return sap.ui.core.ValueState.None;
						}
					}
				}
			})
		}).setModel(oController._ListJSonModel)
		.bindRows("/Data");
		
		var colModel = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "50px"},
			{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "5%"},	// 31:사번
			{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "5%"},	// 38:성명
			{id: "Orgtx", label : oBundleText.getText("LABEL_0039"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "15%", align : "Begin"},	// 39:소속부서
			{id: "Reqym", label : oBundleText.getText("LABEL_1737"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 1737:발생월
			{id: "Betrg", label : oBundleText.getText("LABEL_0550"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "10%"},	// 550:금액
			{id: "Zbigo", label : oBundleText.getText("LABEL_0096"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "20%", align : "Begin"},	// 96:비고
			{id: "Paydt", label : oBundleText.getText("LABEL_1594"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "120px"},	// 1594:급여반영 예정일
			{id: "Message", label : oBundleText.getText("LABEL_0477"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "20%", align : "Begin"},	// 477:메세지
		];
		common.ZHR_TABLES.makeColumn(oController, oTable, colModel);
		oController._colModel = colModel;
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	
        	
        	resizable : false,
			showFilterMenuEntry : false,
			width : "50px",
			multiLabels : [new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0033"), textAlign : "Center"}).addStyleClass("L2PFontFamily")],	// 33:삭제
			template : [new sap.ui.core.Icon({
						size : "1.1rem",
						src : "sap-icon://delete",
						tooltip : oBundleText.getText("LABEL_0033"),	// 33:삭제
						visible: {
							parts : [{ path : "Appst" }, { path : "Message"}], 
							formatter : function(fVal1, fVal2) {
								if(fVal1 == ""||fVal1 == "25") return true;
								else return false;
							}
						},
						press : oController.onDeleteRecord,
					})]
		}));
		
		
		var colModel = [
			{id: "Appsttx", label : oBundleText.getText("LABEL_0036"), plabel : "", span : 0, type : "stringT", sort : true, filter : true, width : "8%", tooltip : "ZappResn", tooltipTitle : oBundleText.getText("LABEL_1075")},	// 36:상태, 1075:반려사유
		];
		common.ZHR_TABLES.makeColumn(oController, oTable, colModel);
		oController._colModel.push(colModel[0]);
		
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
		
		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(oController._colModel);
		
		return oTable;
	}
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	createContent : function(oController) {
//		jQuery.sap.require("common.Common");
//		jQuery.sap.require("common.SearchUserList");
//		jQuery.sap.require("common.ZHR_TABLES");
//		jQuery.sap.require("control.ODataFileUploader");
//		jQuery.sap.require("common.AttachFileAction");   
//		common.SearchUserList.oController = oController ;
//		
//		var oFilterbar = new sap.ui.layout.HorizontalLayout({
//			allowWrapping : true,
//			content : [
//				new sap.ui.layout.VerticalLayout({
//					content : [
//						new sap.m.Text({
//							text : oBundleText.getText("LABEL_1737")	// 1737:발생월
//						}),
//						new sap.m.Input(oController.PAGEID + "_Apbeg", {
//					    	value : "{Apbeg}",
//					    	width : "150px",
//					  }).addStyleClass("L2PFontFamily")
//					]
//				}).addStyleClass("L2PFilterItem"),
//				new sap.ui.layout.VerticalLayout({
//					content : [
//						new sap.m.Text(),
//						new sap.m.Input(oController.PAGEID + "_Apend", {
//							width : "150px",
//							value : "{Apend}",
//						}).addStyleClass("L2PFontFamily")
//					],
//					visible : { path : "State" ,
//				   		   formatter : function(fVal){
//						   return fVal == 1 ? true : false;
//					      }
//				       }
//				}).addStyleClass("L2PFilterItem"),
//				new sap.ui.layout.VerticalLayout({
//					content : [
//						new sap.m.Text({
//							text : oBundleText.getText("LABEL_0815") 	// 815:부서명
//						}),
//						new sap.m.Input(oController.PAGEID + "_Orgeh",{
//							width : "150px",
//							showValueHelp: true,
//							valueHelpOnly: true,
//							value : "{Orgtx}",
//							customData : new sap.ui.core.CustomData({key : "Orgeh", value : "{Orgeh}"}),
////							change : oController.EmpSearchByTx,
//							valueHelpRequest: oController.displayOrgSearchDialog
//						}).addStyleClass("L2PFontFamily")
//					],
//					visible : { path : "State" ,
//				   		   formatter : function(fVal){
//						   return fVal == 1 ? true : false;
//					      }
//				       }
//				}).addStyleClass("L2PFilterItem"),
//				new sap.ui.layout.VerticalLayout({
//					content : [
//						new sap.m.Text({
//							text : oBundleText.getText("LABEL_0111") 	// 111:대상자
//						}),
//						new sap.m.Input({
//							width : "150px",
//							showValueHelp: true,
//							valueHelpOnly: false,
//							value : "{Ename}",
//							customData : new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"}),
//							change : oController.EmpSearchByTx,
//							valueHelpRequest: oController.displayEmpSearchDialog
//						}).addStyleClass("L2PFontFamily")
//					],
//					visible : { path : "State" ,
//				   		   formatter : function(fVal){
//						   return fVal == 1 ? true : false;
//					      }
//				       }
//				}).addStyleClass("L2PFilterItem"),
//				
//				new sap.ui.layout.VerticalLayout({
//					content : [
//						new sap.m.Label(),
//						new sap.m.Toolbar({
//							content : [
//							new sap.m.Button({
//								text: oBundleText.getText("LABEL_0064"),	// 64:조회
//								icon : "sap-icon://search",
//								type : sap.m.ButtonType.Emphasized,
//								press : oController.onPressSearch ,
//								visible : { path : "State" ,
//											formatter : function(fVal){
//												return fVal == 1 ? true : false;
//											}
//								}
//							}).addStyleClass("L2PFontFamily L2PPaddingRight5"),
//							new sap.m.Button({text : oBundleText.getText("LABEL_1926"), type : "Default" , icon :"sap-icon://download" ,	// 1926:양식다운로드
//								press : oController.onDownloadFormat,
////									function(){
////									window.open("/sap/bc/ui5_ui5/sap/zui5_hr_essapp/ZUI5_HR_HousingExpenses/files/upload_template.xls");
////								},
//								type : sap.m.ButtonType.Emphasized,
//								visible : { path : "State" ,
//									formatter : function(fVal){
//										return fVal == 0 ? true : false;
//									}
//								}
//							}).addStyleClass("L2PFontFamily L2PPaddingRight5"),
//							new control.ODataFileUploader(oController.PAGEID + "_ATTACHFILE_BTN", {
//								name : oController.PAGEID + "_ATTACHFILE_BTN",
//								modelName : "ZHR_COMMON_SRV",
//								slug : "",
//								maximumFileSize: 1,
//								multiple : true,
//								uploadOnChange: false,
//								mimeType: [], //["image","text","application"],
//								fileType: ["xlsx","xls"], 
//								buttonText : oBundleText.getText("LABEL_1928"),	// 1928:업로드
//								icon : "sap-icon://upload",
//								buttonOnly : true,
////								uploadComplete: common.AttachFileAction.uploadComplete,
//								uploadAborted : common.AttachFileAction.uploadAborted,
//								fileSizeExceed: common.AttachFileAction.fileSizeExceed,
//								typeMissmatch: common.AttachFileAction.typeMissmatch,
//								change : oController.onUploadExcel,
//								style : "Emphasized",
//								visible : { path : "State" ,
//									formatter : function(fVal){
//										return fVal == 0 ? true : false;
//									}
//								}
//							}).addStyleClass("L2PPaddingRight5"),
//							new sap.m.Button({text : oBundleText.getText("LABEL_2106"), type : "Default", icon :"sap-icon://paper-plane" ,	// 2106:전송
//											  press : oController.onPressTransport ,
//											  type : sap.m.ButtonType.Emphasized,
//												visible : { path : "State" ,
//													formatter : function(fVal){
//														return fVal == 0 ? true : false;
//													}
//												}
//							}).addStyleClass("L2PFontFamily L2PPaddingRight5")
//							]
//						}),
//					]
//				}).addStyleClass("L2PFilterItem")
//			]
//		}).addStyleClass("L2PFilterLayout")
//		.setModel(oController._ListCondJSonModel)
//		.bindElement("/Data");
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
//			visibleRowCount : 1,
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
//						{path : "Appst"}
//					],
//					//Information : 파란색 , Warning : 주황색,  Success : 초록색
//					formatter : function(fVal1) {
//						switch(fVal1) {
//							case "10":
//								return sap.ui.core.ValueState.Warning;
//							case "20":
//								return sap.ui.core.ValueState.Information;
//							case "25":
//								return sap.ui.core.ValueState.Error;
//							case "30":
//								return sap.ui.core.ValueState.Success ;
//							case "35":
//								return sap.ui.core.ValueState.Error;
//							default:
//								return sap.ui.core.ValueState.None;
//						}
//					}
//				}
//			})
//		}).setModel(oController._ListJSonModel)
//		.bindRows("/Data");
//		
//		var colModel = [
//			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "50px"},
//			{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "5%"},	// 31:사번
//			{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "5%"},	// 38:성명
//			{id: "Orgtx", label : oBundleText.getText("LABEL_0039"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "15%", align : "Begin"},	// 39:소속부서
//			{id: "Reqym", label : oBundleText.getText("LABEL_1737"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 1737:발생월
//			{id: "Betrg", label : oBundleText.getText("LABEL_0550"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "10%"},	// 550:금액
//			{id: "Zbigo", label : oBundleText.getText("LABEL_0096"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "20%", align : "Begin"},	// 96:비고
//			{id: "Paydt", label : oBundleText.getText("LABEL_1594"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "120px"},	// 1594:급여반영 예정일
//			{id: "Message", label : oBundleText.getText("LABEL_0477"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "20%", align : "Begin"},	// 477:메세지
//		];
//		common.ZHR_TABLES.makeColumn(oController, oTable, colModel);
//		oController._colModel = colModel;
//		
//		oTable.addColumn(new sap.ui.table.Column({
//			hAlign : "Center",
//			flexible : false,
//        	autoResizable : true,
//        	filterProperty : "",
//        	sortProperty : "",
//        	
//        	
//        	resizable : false,
//			showFilterMenuEntry : false,
//			width : "50px",
//			multiLabels : [new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0033"), textAlign : "Center"}).addStyleClass("L2PFontFamily")],	// 33:삭제
//			template : [new sap.ui.core.Icon({
//						size : "1.1rem",
//						src : "sap-icon://delete",
//						tooltip : oBundleText.getText("LABEL_0033"),	// 33:삭제
//						visible: {
//							parts : [{ path : "Appst" }, { path : "Message"}], 
//							formatter : function(fVal1, fVal2) {
//								if(fVal1 == ""||fVal1 == "25") return true;
//								else return false;
//							}
//						},
//						press : oController.onDeleteRecord,
//					})]
//		}));
//		
//		
//		var colModel = [
//			{id: "Appsttx", label : oBundleText.getText("LABEL_0036"), plabel : "", span : 0, type : "stringT", sort : true, filter : true, width : "8%", tooltip : "ZappResn", tooltipTitle : oBundleText.getText("LABEL_1075")},	// 36:상태, 1075:반려사유
//		];
//		common.ZHR_TABLES.makeColumn(oController, oTable, colModel);
//		oController._colModel.push(colModel[0]);
//		
//		var oLayout = new sap.ui.commons.layout.VerticalLayout({
//			width : "100%",
//			content : [ 
//			    sap.ui.jsfragment("fragment.ApplyInformationLayout", oController),
//				new sap.m.RadioButtonGroup({
//					columns : 2,
//					buttons : [new sap.m.RadioButton({text: oBundleText.getText("LABEL_1928"), value : 0}).addStyleClass("L2PFontFamily"), 	// 1928:업로드
//					           new sap.m.RadioButton({text: oBundleText.getText("LABEL_0064"), value : 1 }).addStyleClass("L2PFontFamily")], 	// 64:조회
//		            selectedIndex : "{State}",
//					select : function(oEvent){
//						oTable.getModel().setData([]);
//						oTable.setVisibleRowCount(1);
//						oTable.getModel().refresh();
//					}
//				}).addStyleClass("L2PPaddingTop3 L2PPaddingLeft10").setModel(oController._ListCondJSonModel)
//				.bindElement("/Data"),
//				oFilterbar, 
//				oTable 
//			]
//		}).addStyleClass("sapUiSizeCompact");
//		
//		oLayout.addEventDelegate({
//			onAfterRendering : function() {
//				oController._Columns = [];
//				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy.MM.dd"});
//				for(var i=0; i<oController._colModel.length; i++){
//					var column = {};
//						column.label = oController._colModel[i].label;
//						column.property = oController._colModel[i].id;
//					
//					if(oController._colModel[i].type == "listdate" || oController._colModel[i].type == "date") {
//						column.type = "date";
//						column.template = {
//							content : {
//								parts : [
//									oController._colModel[i].id
//								],
//								formatter : function(fVal) {
//									if(!fVal || fVal == null) return "";
//									return dateFormat.format(new Date(common.Common.setTime(fVal)));
//								}
//							} 
//						};
//					} else if( oController._colModel[i].type == "listText") {
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