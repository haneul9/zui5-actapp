sap.ui.jsfragment("ZUI5_HR_OvertimeConfirm.fragment.OvertimeConfirmPage02", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "40px"},
		{id: "Datum", label : oBundleText.getText("LABEL_0644"), plabel : oBundleText.getText("LABEL_0644"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 644:특근일
		{id: "Obeguzt", label : oBundleText.getText("LABEL_0717"), plabel : oBundleText.getText("LABEL_0712"), resize : false, span : 7, type : "time", sort : true, filter : true, width : "70px"},	// 712:시작, 717:특근명령
		{id: "Oenduzt", label : "", plabel : oBundleText.getText("LABEL_0713"), resize : false, span : 0, type : "time", sort : true, filter : true, width : "70px"},	// 713:종료
		{id: "Otim11", label : "", plabel : oBundleText.getText("LABEL_0638"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "70px"},	// 638:총시간
		{id: "Ofaprstx", label : "", plabel : oBundleText.getText("LABEL_0645"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "70px"},	// 645:휴게시간
		{id: "Otim12", label : "", plabel : oBundleText.getText("LABEL_0586"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "70px"},	// 586:특근시간
		{id: "Otim13", label : "", plabel : oBundleText.getText("LABEL_0643"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "70px"},	// 643:특근연장
		{id: "Otim14", label : "", plabel : oBundleText.getText("LABEL_0633"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "70px"},	// 633:심야시간
		{id: "Intimt", label : oBundleText.getText("LABEL_0566"), plabel : oBundleText.getText("LABEL_0566"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 566:출근시간
		{id: "Outimt", label : oBundleText.getText("LABEL_0568"), plabel : oBundleText.getText("LABEL_0568"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 568:퇴근시간
		{id: "Beguzt", label : oBundleText.getText("LABEL_0586"), plabel : oBundleText.getText("LABEL_0712"), resize : false, span : 7, type : "time", sort : true, filter : true, width : "100px"},	// 586:특근시간, 712:시작
		{id: "Enduzt", label : "", plabel : oBundleText.getText("LABEL_0713"), resize : false, span : 0, type : "time", sort : true, filter : true, width : "100px"},	// 713:종료
		{id: "Tim11", label : "", plabel : oBundleText.getText("LABEL_0638"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "70px"},	// 638:총시간
		{id: "Faprs", label : "", plabel : oBundleText.getText("LABEL_0645"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "130px"},	// 645:휴게시간
		{id: "Tim12", label : "", plabel : oBundleText.getText("LABEL_0586"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "70px"},	// 586:특근시간
		{id: "Tim13", label : "", plabel : oBundleText.getText("LABEL_0643"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "70px"},	// 643:특근연장
		{id: "Tim14", label : "", plabel : oBundleText.getText("LABEL_0633"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "70px"},	// 633:심야시간
		{id: "Atext", label : oBundleText.getText("LABEL_0587"), plabel : oBundleText.getText("LABEL_0587"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "160px"},	// 587:특근유형
		{id: "Tmrsn", label : oBundleText.getText("LABEL_0641"), plabel : oBundleText.getText("LABEL_0641"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "160px"},	// 641:특근내역
		{id: "Satext", label : oBundleText.getText("LABEL_0626"), plabel : oBundleText.getText("LABEL_0625"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "140px"},	// 625:근태항목, 626:대근사유
		{id: "Sperid", label : "", plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번
		{id: "Sename", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 38:성명
		{id: "Wtm01", label : oBundleText.getText("LABEL_0714"), plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "70px"},	// 634:정상근무, 714:주별 총근로 예상시간
		{id: "Wtm02", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "70px"},	// 629:시간외근무
		{id: "Wtm03", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "70px"},	// 637:총근로
		{id: "Tprogt", label : oBundleText.getText("LABEL_0013"), plabel : oBundleText.getText("LABEL_0013"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "160px", align : sap.ui.core.TextAlign.Begin},	// 근무형태
		{id: "Rtext", label : oBundleText.getText("LABEL_0624"), plabel : oBundleText.getText("LABEL_0624"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "160px", align : sap.ui.core.TextAlign.Begin}	// 624:근무조
	],
	
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
			this.getApplyInfoRender(oController),									// 특근확인서
			//sap.ui.jsfragment("fragment.COMMON_ATTACH_PTI", oController),			// 첨부파일
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
									text : oBundleText.getText("LABEL_0719")	// 719:특근확인서
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
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
//			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			fixedColumnCount : 2,
			extension : new sap.m.Toolbar({
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0719")	// 719:특근확인서
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
						text: oBundleText.getText("LABEL_2873"),	// 2873:특근명령내역조회
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressSelectByWorktime,
						visible : {
							path : "ZappStatAl",
							formatter : function(fVal) {
								return (fVal == "" || fVal == "10") ? true : false;
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
							path : "ZappStatAl",
							formatter : function(fVal) {
								return (fVal == "" || fVal == "10") ? true : false;
							}
						}
					})
					.setModel(oController._DetailJSonModel)
					.bindElement("/Data")
				]
			}).addStyleClass("ToolbarNoBottomLine")
		})
		.setModel(oController._DetailTableJSonModel)
		.bindRows("/Data");
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
		oTable.getColumns()[9].setTemplate(new sap.m.Input({
			showValueHelp: true,
			valueHelpOnly: true,
			value : "{Intimt}",
			valueHelpRequest : oController.onPressIntimeDialog,
			editable : {
				parts : [{path : "ZappStatAl"}, {path : "Persa"}],
				formatter : function(fVal1, fVal2) {
					return ((fVal1 == "" || fVal1 == "10") && fVal2 == "3000") ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		oTable.getColumns()[10].setTemplate(new sap.m.Input({
			showValueHelp: true,
			valueHelpOnly: true,
			value : "{Outimt}",
			valueHelpRequest : oController.onPressOuttimeDialog,
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1) {
					return (fVal1 == "" || fVal1 == "10") ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		oTable.getColumns()[11].setTemplate(new sap.m.TimePicker({
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
		
		oTable.getColumns()[12].setTemplate(new sap.m.TimePicker({
			value : "{Enduzt}",
			minutesStep : 5,
			support2400 : true,
			valueFormat : "HH:mm",
			displayFormat : "HH:mm",
			change : oController.setEndTimeFormat,
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1) {
					return (fVal1 == "" || fVal1 == "10") ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		oTable.getColumns()[14].setTemplate(new sap.m.ComboBox({
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
		
		oTable.getColumns()[18].setTemplate(new sap.m.ComboBox({
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
		
		oTable.getColumns()[19].setTemplate(new sap.m.Input({
			value : "{Tmrsn}",
			maxLength : common.Common.getODataPropertyLength("ZHR_SPECIAL_WORK_SRV", "RptSpecialWorkDetail", "Tmrsn"),
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1) {
					return (fVal1 == "" || fVal1 == "10") ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		// 대근 코드
		var chkCodes = [
			"5030", "5040", "5050", "5060", 
			"5070", "5080", "5090", "5130", 
			"5150", "5160", "5190", 
			"5210", "5220", "5230", "5240"
		];
		
		oTable.getColumns()[22].setTemplate(new sap.m.Input({
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
					return (fVal1 == "" || fVal1 == "10") && (chkCodes.indexOf(fVal2) > -1) ? true : false;
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
					selector : '#ZUI5_HR_OvertimeConfirmDetail_Table-header-fixed-fixrow > tbody',
					colIndexes : [0, 1]
				});
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_OvertimeConfirmDetail_Table-header > tbody',
					colIndexes : [7, 8, 16, 17, 24, 25]
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