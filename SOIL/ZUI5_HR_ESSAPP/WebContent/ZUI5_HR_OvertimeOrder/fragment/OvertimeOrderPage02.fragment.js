sap.ui.jsfragment("ZUI5_HR_OvertimeOrder.fragment.OvertimeOrderPage02", {
	
	createContent : function(oController) {
		
		return [
			new sap.ui.commons.layout.VerticalLayout({
				width : "100%",
				content : [
					this.getPageAllContentRender(oController)
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
	getPageAllContentRender : function(oController) {
		
		var oContents = [
			new sap.ui.core.HTML({content : "<div style='height : 20px;'/>"}),
			this.getTitleRender(oController),										// 타이틀
			sap.ui.jsfragment("fragment.ApplyInformationLayout", oController),		// 신청안내
			sap.ui.jsfragment("fragment.TargetLayout", oController),				// 대상자
			this.getApplyInfoRender(oController),									// 신청내역
			this.getOvertimeTableRender(oController),								// 특근내역
			sap.ui.jsfragment("fragment.COMMON_ATTACH_PTI", oController),			// 첨부파일
			sap.ui.jsfragment("fragment.ApplyLayout", oController),					// 신청자 
			sap.ui.jsfragment("fragment.ApprovalInformationLayout", oController), 	// 결재내역
			sap.ui.jsfragment("fragment.Comments", oController)						// 승인/반려
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : ["20px", "", "20px"],
			width : "100%",
			rows : $.map(oContents, function(rowData, k) {
				return new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell(),
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : rowData
						}),
						new sap.ui.commons.layout.MatrixLayoutCell()
					]
				})
			})
		});
	},
	
	/**
	 * 제목 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getTitleRender : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							height : "20px",
							content : [
								new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_A.png",}),
								new sap.m.Text(oController.PAGEID + "_DetailTitle", {
									text : oBundleText.getText("LABEL_0642")	// 642:특근명령서
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
						content : 
							new sap.m.Toolbar({
								content : [
									new sap.m.Toolbar(oController.PAGEID + "_ManualToolbar",{}).addStyleClass("ToolbarNoBottomLine NoMarginLeft"),
									new sap.m.ToolbarSpacer(),
									new sap.m.Button({
										text : oBundleText.getText("LABEL_0022"), // 22:뒤로
										press : oController.onBack,
									}),
									new sap.m.Button({text : oBundleText.getText("LABEL_0005"),	// 5:결재지정
										press : common.ApprovalLineAction.onApprovalLine,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal) {
												return (fVal == "" || fVal == "10") ? true : false;
											}
										}
									}),
									new sap.m.Button({
										text : oBundleText.getText("LABEL_0058"), // 58:임시저장
										press : oController.onPressSaveT,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal) {
												return (fVal == "" || fVal == "10") ? true : false;
											}
										}
									}),
									new sap.m.Button({
										text : oBundleText.getText("LABEL_0033"), // 33:삭제
										press : oController.onDelete,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal) {
												return (fVal == "10") ? true : false;
											}
										}
									}),
									new sap.m.Button({text : oBundleText.getText("LABEL_0044"),	// 44:신청
										press : oController.onPressSaveC,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal) {
												return (fVal == "" || fVal == "10") ? true : false;
											}
										}
									})
								]
						}).addStyleClass("ToolbarNoBottomLine NoMarginLeft")
					})
				]
			})
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			rows : aRows
		});
	},
	
	/**
	 * 신청내역 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getApplyInfoRender : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 특근일
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0644"), 	// 644:특근일
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.DatePicker(oController.PAGEID + "_Datum", {
							valueFormat : "yyyy-MM-dd",
							displayFormat : "yyyy.MM.dd",
							value : "{Datum}",
							width : "150px",
							change : oController.onChangeDatum,
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2) {
									return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
								}
							}
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			})
		];
		
		return new sap.m.Panel({
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
							text : oBundleText.getText("LABEL_0047") 	// 47:신청내역
						}).addStyleClass("MiddleTitle")
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
				new sap.ui.commons.layout.MatrixLayout({
					columns : 4,
					widths : ['20%', '30%', '20%', '30%'],
					rows : aRows
				})
				.setModel(oController._DetailJSonModel)
				.bindElement("/Data")
			]
		});
	},
	
	/**
	 * 특근내역 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getOvertimeTableRender : function(oController) {
		
		var _colModel = [
			{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : false, filter : false, width : "30px"},
			{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "60px"},	// 31:사번
			{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "70px"},	// 38:성명
			{id: "Awart", label : oBundleText.getText("LABEL_0587"), plabel : oBundleText.getText("LABEL_0587"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "130px"},	// 587:특근유형
			{id: "Beguz", label : oBundleText.getText("LABEL_0631"), plabel : oBundleText.getText("LABEL_0631"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 631:시작시간
			{id: "Enduz", label : oBundleText.getText("LABEL_0635"), plabel : oBundleText.getText("LABEL_0635"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 635:종료시간
			{id: "Tim11", label : oBundleText.getText("LABEL_0638"), plabel : oBundleText.getText("LABEL_0638"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "70px"},	// 638:총시간
			{id: "Faprs", label : oBundleText.getText("LABEL_0645"), plabel : oBundleText.getText("LABEL_0645"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "130px"},	// 645:휴게시간
			{id: "Tim12", label : oBundleText.getText("LABEL_0586"), plabel : oBundleText.getText("LABEL_0586"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "70px"},	// 586:특근시간
			{id: "Tim13", label : oBundleText.getText("LABEL_0643"), plabel : oBundleText.getText("LABEL_0643"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "70px"},	// 643:특근연장
			{id: "Tim14", label : oBundleText.getText("LABEL_0633"), plabel : oBundleText.getText("LABEL_0633"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "70px"},	// 633:심야시간
			{id: "Tmrsn", label : oBundleText.getText("LABEL_0641"), plabel : oBundleText.getText("LABEL_0641"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "150px"},	// 641:특근내역
			{id: "Satext", label : oBundleText.getText("LABEL_0626"), plabel : oBundleText.getText("LABEL_0625"), resize : false, span : 3, type : "string", sort : false, filter : false, width : "140px"},	// 625:근태항목, 626:대근사유
			{id: "Sperid", label : "", plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "80px"},	// 31:사번
			{id: "Sename", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "120px"},	// 38:성명
			{id: "Wtm01", label : oBundleText.getText("LABEL_0636"), plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : false, filter : false, width : "100px"},	// 634:정상근무, 636:주당 총근로 예상시간
			{id: "Wtm02", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 629:시간외근무
			{id: "Wtm03", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 637:총근로
			{id: "Tprogt", label : oBundleText.getText("LABEL_0013"), plabel : oBundleText.getText("LABEL_0013"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 근무형태
			{id: "Rtext", label : oBundleText.getText("LABEL_0624"), plabel : oBundleText.getText("LABEL_0624"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "180px", align : sap.ui.core.TextAlign.Begin}	// 624:근무조
		];
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
//			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			fixedColumnCount : 6,
			extension : new sap.m.Toolbar({
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0641")	// 641:특근내역
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer({width : "15px"}),
					new sap.m.MessageStrip({
						showCloseButton : false,
						showIcon : true,
						customIcon : "sap-icon://message-information",
						type : sap.ui.core.MessageType.Success,
						text : oBundleText.getText("LABEL_2937")	// 2937:시작, 종료시간은 키보드로 숫자를 직접 입력할 수 있습니다. 왼쪽메뉴 접기 버튼으로 화면을 넓힐 수 있습니다.
					}).addStyleClass("FontFamily"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_0620"),	// 620:개인별근로시간조회 후 추가
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressSelectByWorktime,
						visible : {
							parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2) {
								return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
							}
						}
					})
					.setModel(oController._DetailJSonModel)
					.bindElement("/Data"),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_0482"),	// 482:추가
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressAddRecord,
						visible : {
							parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2) {
								return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
							}
						}
					})
					.setModel(oController._DetailJSonModel)
					.bindElement("/Data"),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_0033"),	// 33:삭제
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressDelRecord,
						visible : {
							parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2) {
								return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
							}
						}
					})
					.setModel(oController._DetailJSonModel)
					.bindElement("/Data"),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_0630"),	// 630:시간확인
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressCheckWorktime,
						visible : {
							parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2) {
								return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
							}
						}
					})
					.setModel(oController._DetailJSonModel)
					.bindElement("/Data")
				]
			}).addStyleClass("ToolbarNoBottomLine"),
		})
		.setModel(oController._DetailTableJSonModel)
		.bindRows("/Data");
		
		common.ZHR_TABLES.makeColumn(oController, oTable, _colModel);
		
		// Awart
		oTable.getColumns()[3].setTemplate(new sap.m.ComboBox({
			selectedKey : "{Awart}",
			change : oController.onChangeAwart,
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1) {
					return (fVal1 == "" || fVal1 == "10") ? true : false;
				}
			},
			items : {
				path : "/Awarts",
				template: new sap.ui.core.ListItem({
					key: "{Awart}",
					text: "{Atext}",
				}),
				templateShareable : true
			}
		}).addStyleClass("Font14px FontColor3"));
		
		// Beguz
		oTable.getColumns()[4].setTemplate(new sap.m.TimePicker({
			value : "{Beguzt}",
			minutesStep : 5,
			support2400 : true,
			valueFormat : "HH:mm",
			displayFormat : "HH:mm",
			change : oController.setTimeFormat,
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1) {
					return (fVal1 == "" || fVal1 == "10") ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		// Enduz
		oTable.getColumns()[5].setTemplate(new sap.m.TimePicker({
			value : "{Enduzt}",
			minutesStep : 5,
			support2400 : true,
			valueFormat : "HH:mm",
			displayFormat : "HH:mm",
			change : oController.setTimeFormat,
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1) {
					return (fVal1 == "" || fVal1 == "10") ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		// Faprs
		oTable.getColumns()[7].setTemplate(new sap.m.ComboBox({
			selectedKey : "{Faprs}",
			change : oController.onResetTime,
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1) {
					return (fVal1 == "" || fVal1 == "10") ? true : false;
				}
			},
			items : {
				path: "ZHR_SPECIAL_WORK_SRV>/FaprsCodeListSet",
				template: new sap.ui.core.ListItem({
					key: "{ZHR_SPECIAL_WORK_SRV>Faprs}",
					text: "{ZHR_SPECIAL_WORK_SRV>Faprstx}",
				}),
				templateShareable : true
			}
		}).addStyleClass("Font14px FontColor3"));
		
		// Tmrsn
		oTable.getColumns()[11].setTemplate(new sap.m.Input({
			value : "{Tmrsn}",
			maxLength : common.Common.getODataPropertyLength("ZHR_SPECIAL_WORK_SRV", "SpecialWorkEmpList", "Tmrsn"),
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1) {
					return (fVal1 == "" || fVal1 == "10") ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		// Sename
		oTable.getColumns()[14].setTemplate(new sap.m.Input({
			value : "{Sename}",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.onRowPernrChange,
			customData : [
				new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"})
			],
			editable : {
				parts : [{path : "ZappStatAl"}, {path : "Awart"}],
				formatter : function(fVal1, fVal2) {
					return (fVal1 == "" || fVal1 == "10") && (oController.chkSubCodes.indexOf(fVal2) > -1) ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_OvertimeOrderDetail_Table-header-fixed-fixrow > tbody',
					colIndexes : [0, 1, 2, 3, 4, 5]
				});
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_OvertimeOrderDetail_Table-header > tbody',
					colIndexes : [0, 1, 2, 3, 4, 5, 12, 13]
				});
			}
		});
		
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