jQuery.sap.require("control.ODataFileUploader");

sap.ui.jsfragment("ZUI5_HR_WorktimeRecordException.fragment.WorktimeRecordExceptionPage02", {
	
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
			this.getApplyInfoRender(oController),									// 신청항목
			this.getDeatilTableRender(oController),									// 상세내역 테이블
			sap.ui.jsfragment("fragment.COMMON_ATTACH_PTI", oController),			// 첨부
			sap.ui.jsfragment("fragment.ApplyLayout", oController),					// 신청자 
			sap.ui.jsfragment("fragment.ApprovalInformationLayout", oController),	// 결재내역
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
									text : oBundleText.getText("LABEL_0802")	// 805:근태기록부(예외자)
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
					// 예외대상구분
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0801"), 	// 801:예외대상구분
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.ComboBox({
									width : "45%",
									selectedKey : "{Excty}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path: "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									},
									items : {
										path: "ZHR_MONTHLYTIME_SRV>/ExctyCodeListSet",
										filters : [
											{sPath : 'ZreqForm', sOperator : 'EQ', oValue1 : 'TM71'}
										],
										template: new sap.ui.core.ListItem({
											key: "{ZHR_MONTHLYTIME_SRV>Excty}",
											text: "{ZHR_MONTHLYTIME_SRV>Exctx}"
										})
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 귀속년월
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0797"), 	// 797:귀속년월
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.DatePicker({
									valueFormat : "yyyy-MM-dd",
									displayFormat : "yyyy.MM",
									value : "{Tsmon}",
									width : "45%",
									change : oController.onChangeTsmon,
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
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 예외근무신청사유
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0800"), 	// 800:예외근무신청사유
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Input({
									width : "100%",
									value : "{Tmrsn}",
									maxLength : common.Common.getODataPropertyLength("ZHR_MONTHLYTIME_SRV", "ExtMonthlyTimeHeader", "Tmrsn"),
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
					columns : 4,
					widths : ['20%', '30%', '20%', '30%'],
					rows : aRows
				})
			]
		});
	},
	
	/**
	 * 상세테이블 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getDeatilTableRender : function(oController) {
		
		var _colModel = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "5%"},
			{id: "Tsdat", label : oBundleText.getText("LABEL_0057"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "12%"},	// 57:일자
			{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "8%"},	// 31:사번
			{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "8%"},	// 38:성명
			{id: "Orgtx", label : oBundleText.getText("LABEL_0028"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "16%", align : sap.ui.core.TextAlign.Begin},	// 28:부서
			{id: "Tovrt", label : oBundleText.getText("LABEL_0693"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "8%"},	// 693:특근
			{id: "Totex", label : oBundleText.getText("LABEL_0643"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "8%"},	// 643:특근연장
			{id: "Tnght", label : oBundleText.getText("LABEL_0799"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "8%"},	// 799:심야근무
			{id: "Zbigo", label : oBundleText.getText("LABEL_0096"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "27%"}	// 96:비고
		];
		
		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(_colModel);
		
		var oFileUploader = new control.ODataFileUploader(oController.PAGEID+"_EXCEL_UPLOAD_BTN", {
			name : "UploadFile",
			slug : "",
			maximumFileSize: 1,
			multiple : false,
			uploadOnChange: false,
			mimeType: [],
			fileType: ["csv","xls","xlsx"],
			buttonText : oBundleText.getText("LABEL_0481") + " ▲",	// 481:엑셀
			buttonOnly : true,
			change : oController.changeFile,
			visible : {
				parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
				formatter : function(fVal1, fVal2) {
					return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
				}
			}
		})
		.addStyleClass("L2PPaddingLeft1rem")
		.setModel(oController._DetailJSonModel)
		.bindElement("/Data");
		
		oFileUploader.addDelegate({
			onAfterRendering: function() {
				$("#" + oController.PAGEID + "_EXCEL_UPLOAD_BTN").find('BUTTON > span')
					.removeClass('sapMBtnDefault sapMBtnHoverable')
					.addClass('sapMBtnGhost');
			}
		});
		
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
						text : oBundleText.getText("LABEL_0016")	// 16:내역
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_0482"),	// 482:추가
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressAdd,
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
						text : oBundleText.getText("LABEL_0480"),	// 480:업로드 양식 다운로드
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressFormExcelDown,
						visible : {
							parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2) {
								return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
							}
						}
					})
					.setModel(oController._DetailJSonModel)
					.bindElement("/Data"),
					oFileUploader,
					new sap.m.Button({
						text : oBundleText.getText("LABEL_0481") + " ▼",	// 481:엑셀
						type : sap.m.ButtonType.Ghost,
						press : oController.onPressExcelDown,
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
			}).addStyleClass("ToolbarNoBottomLine")
		})
		.setModel(oController._DetailTableJSonModel)
		.bindRows("/Data");
		
		common.ZHR_TABLES.makeColumn(oController, oTable, _colModel);
		
		oTable.getColumns()[1].setTemplate(new sap.m.DatePicker({
			valueFormat : "yyyy-MM-dd",
			displayFormat : "yyyy.MM.dd",
			width : "95%",
			value : "{Tsdat}",
			change : oController.onChangeTsdat,
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1) {
					return (fVal1 == "" || fVal1 == "10") ? true : false;
				}
			}
		}).addStyleClass("FontFamily"));
		
		oTable.getColumns()[5].setTemplate(new sap.m.Input({
			value : "{Tovrt}",
			width : "95%",
			textAlign : sap.ui.core.TextAlign.Right,
			liveChange : oController.onLimitDigit,
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1) {
					return (fVal1 == "" || fVal1 == "10") ? true : false;
				}
			}
		}).addStyleClass("FontFamily"));

		oTable.getColumns()[6].setTemplate(new sap.m.Input({
			value : "{Totex}",
			width : "95%",
			textAlign : sap.ui.core.TextAlign.Right,
			change : oController.onLimitDigit,
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1) {
					return (fVal1 == "" || fVal1 == "10") ? true : false;
				}
			}
		}).addStyleClass("FontFamily"));

		oTable.getColumns()[7].setTemplate(new sap.m.Input({
			value : "{Tnght}",
			width : "95%",
			textAlign : sap.ui.core.TextAlign.Right,
			change : oController.onLimitDigit,
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1) {
					return (fVal1 == "" || fVal1 == "10") ? true : false;
				}
			}
		}).addStyleClass("FontFamily"));

		oTable.getColumns()[8].setTemplate(new sap.m.Input({
			value : "{Zbigo}",
			width : "95%",
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1) {
					return (fVal1 == "" || fVal1 == "10") ? true : false;
				}
			}
		}).addStyleClass("FontFamily"));
		
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