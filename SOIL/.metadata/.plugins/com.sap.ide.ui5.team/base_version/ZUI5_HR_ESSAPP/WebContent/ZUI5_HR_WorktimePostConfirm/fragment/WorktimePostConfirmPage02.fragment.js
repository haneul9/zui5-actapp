sap.ui.jsfragment("ZUI5_HR_WorktimePostConfirm.fragment.WorktimePostConfirmPage02", {
	
	createContent : function(oController) {
		
		return [
			new sap.ui.commons.layout.VerticalLayout({
				width : "100%",
				content : [
					this.getPageAllContentRender(oController)
				] 
			})
			.addStyleClass("sapUiSizeCompact")
			.setModel(oController._DetailJSonModel)
			.bindElement("/Data")
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
									text : oBundleText.getText("LABEL_0877")	// 877:근무시간 사후확인서
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
					// 구분
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0300"), 	// 300:구분
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "150px",
									selectedKey : "{Reqty}",
									change : oController.onChangeReqty,
									items : {
										path: "ZHR_WORKTIME_SRV>/ReqtyCodeListSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_WORKTIME_SRV>Key}",
											text: "{ZHR_WORKTIME_SRV>Value}"
										})
									},
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Button({
									text : oBundleText.getText("LABEL_0362"),	// 362:신청내역조회
									type : sap.m.ButtonType.Ghost,
									press : oController.onPressSelectByApply,
									visible : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Reqty"}],
										formatter : function(fVal1, fVal2, fVal3) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2 && (fVal3 == "2")) ? true : false;
										}
									}
								})
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 근무기간
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0700"),	// 700:근무기간
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.DatePicker({
									valueFormat : "yyyy-MM-dd",
									displayFormat : "yyyy.MM.dd",
									value : "{Datum}",
									width : "150px",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Reqty"}],
										formatter : function(fVal1, fVal2, fVal3) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2 && (fVal3 == "1")) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.TimePicker({
									value : "{Beguztx}",
									minutesStep : 10,
									support2400 : true,
									valueFormat : "HH:mm",
									displayFormat : "HH:mm",
									change : oController.setTimeFormat,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Reqty"}],
										formatter : function(fVal1, fVal2, fVal3) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2 && (fVal3 == "1")) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3 PaddingLeft3"),
								new sap.m.Text({
									text : "~",
									textAlign : sap.ui.core.TextAlign.Center
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.TimePicker({
									value : "{Enduztx}",
									minutesStep : 10,
									support2400 : true,
									valueFormat : "HH:mm",
									displayFormat : "HH:mm",
									change : oController.setTimeFormat,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Reqty"}],
										formatter : function(fVal1, fVal2, fVal3) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2 && (fVal3 == "1")) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									value : "{Duran}",
									width : "80px",
									editable : false,
									visible : {
										parts : [{path : "Beguztx"}, {path : "Enduztx"}],
										formatter : function(fVal1, fVal2) {
											return (fVal1 && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3 PaddingLeft3"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0874"),	// 874:(분)
									textAlign : sap.ui.core.TextAlign.Center,
									visible : {
										parts : [{path : "Beguztx"}, {path : "Enduztx"}],
										formatter : function(fVal1, fVal2) {
											return (fVal1 && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 사유
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2887"),	// 2887:사유
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Tmrsn}",
									width : "100%",
									maxLength : common.Common.getODataPropertyLength("ZHR_WORKTIME_SRV", "WorkTimeAppl", "Tmrsn"),
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
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
					columns : 2,
					widths : ['20%', '80%'],
					rows : aRows
				})
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
			{id: "Seqno", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : false, filter : false, width : "6%"},
			{id: "Datum", label : oBundleText.getText("LABEL_0875"), plabel : oBundleText.getText("LABEL_0057"), resize : false, span : 3, type : "date", sort : false, filter : false, width : "20%"},	// 57:일자, 875:OFF Time
			{id: "Beguztx", label : "", plabel : oBundleText.getText("LABEL_0631"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "19%"},	// 631:시작시간
			{id: "Enduztx", label : "", plabel : oBundleText.getText("LABEL_0635"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "19%"},	// 635:종료시간
			{id: "Duran", label : oBundleText.getText("LABEL_0880"), plabel : oBundleText.getText("LABEL_0880"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "18%"},	// 880:기간(분)
			{id: "Alldf", label : oBundleText.getText("LABEL_0884"), plabel : oBundleText.getText("LABEL_0884"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "18%"}	// 884:종일
		];
		
		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(_colModel);
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
//			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			extension : new sap.m.Toolbar({
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0876")	// 876:OFF Time내역
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_0482"),	// 482:추가
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressAdd,
						visible : {
							parts : [{path : "ZappStatAl"}, {path : "Reqty"}],
							formatter : function(fVal1, fVal2) {
								return (fVal1 == "" || fVal1 == "10") && (fVal2 == "1") ? true : false;
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
							parts : [{path : "ZappStatAl"}, {path : "Reqty"}],
							formatter : function(fVal1, fVal2) {
								return (fVal1 == "" || fVal1 == "10") && (fVal2 == "1") ? true : false;
							}
						}
					})
					.setModel(oController._DetailJSonModel)
					.bindElement("/Data"),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressExcelDown,
						visible : {
							parts : [{path : "ZappStatAl"}],
							formatter : function(fVal1) {
								return (fVal1 == "" || fVal1 == "10") ? true : false;
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
		
		common.ZHR_TABLES.makeColumn(oController, oTable, _colModel);
		
		oTable.getColumns()[1].setTemplate(new sap.m.DatePicker({
			valueFormat : "yyyy-MM-dd",
			displayFormat : "yyyy.MM.dd",
			value : "{Datum}",
			width : "150px",
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1) {
					return (fVal1 == "" || fVal1 == "10") ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		oTable.getColumns()[2].setTemplate(new sap.m.TimePicker({
			value : "{Beguztx}",
			minutesStep : 10,
			support2400 : true,
			valueFormat : "HH:mm",
			displayFormat : "HH:mm",
			change : oController.onChangeTime,
			editable : {
				parts : [{path : "ZappStatAl"}, {path : "Alldf"}],
				formatter : function(fVal1, fVal2) {
					return ((fVal1 == "" || fVal1 == "10") && !fVal2) ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		oTable.getColumns()[3].setTemplate(new sap.m.TimePicker({
			value : "{Enduztx}",
			minutesStep : 10,
			support2400 : true,
			valueFormat : "HH:mm",
			displayFormat : "HH:mm",
			change : oController.onChangeTime,
			editable : {
				parts : [{path : "ZappStatAl"}, {path : "Alldf"}],
				formatter : function(fVal1, fVal2) {
					return ((fVal1 == "" || fVal1 == "10") && !fVal2) ? true : false;
				}
			}
		}).addStyleClass("Font14px FontColor3"));
		
		oTable.getColumns()[5].setTemplate(new sap.m.CheckBox({
			selected : "{Alldf}",
			select : oController.onChageAlldf,
			editable : {
				parts : [{path : "ZappStatAl"}, {path : "Datum"}],
				formatter : function(fVal1, fVal2) {
					return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
				}
			}
		}));
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_WorktimePostConfirmDetail_Table-header > tbody',
					colIndexes : [0, 4, 5]
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