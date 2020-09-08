sap.ui.jsfragment("ZUI5_HR_HolidayDelegateTask.fragment.HolidayDelegateTaskPage02", {
	
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
			this.getOvertimeTableRender(oController),								// 대근자 정보
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
									text : oBundleText.getText("LABEL_0855")	// 855:휴일대근 신청서
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
					// 휴일
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0854"), 	// 854:휴일
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.DatePicker(oController.PAGEID + "_Datum", {
							valueFormat : "yyyy-MM-dd",
							displayFormat : "yyyy.MM.dd",
							value : "{Datum}",
							width : "45%",
							change : oController.onChangeDatum,
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2) {
									return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
								}
							}
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 요일
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0054")	// 54:요일
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							width : "45%",
							value : "{Daytx}",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 근무조
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0624")	// 624:근무조
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							width : "45%",
							value : "{Ztext}",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 근무시간
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0671")	// 671:근무시간
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							width : "45%",
							value : "{Ttext}",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 신청사유
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0323")	// 323:신청사유
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Input({
							width : "100%",
							value : "{Hdrsn}",
							maxLength : common.Common.getODataPropertyLength("ZHR_SPECIAL_WORK_SRV", "HolDaegeunDetail", "Hdrsn"),
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
			{id: "Sperid", label : oBundleText.getText("LABEL_0853"), plabel : oBundleText.getText("LABEL_0031"), span : 9, type : "string", sort : false, filter : false, width : "8%"},	// 31:사번, 853:대근자(대근일포함)
			{id: "Sename", label : "", plabel : oBundleText.getText("LABEL_0038"), span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 38:성명
			{id: "Tim15", label : "", plabel : oBundleText.getText("LABEL_0671"), span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 671:근무시간
			{id: "Tim23", label : "", plabel : oBundleText.getText("LABEL_2865"), span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 2865:대근일총근로
			{id: "Wtm03", label : "", plabel : oBundleText.getText("LABEL_2866"), span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 2866:주당총근로
			{id: "Wtm07", label : "", plabel : oBundleText.getText("LABEL_0900"), span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 900:3개월특근가능잔여시간
			{id: "Stat1", label : "", plabel : oBundleText.getText("LABEL_0036"), span : 0, type : "StatusIcon", sort : false, filter : false, width : "10%"},	// 36:상태
			{id: "Fityn", label : "", plabel : oBundleText.getText("LABEL_2867"), span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 2867:대근지정적합여부
			{id: "Zbigo", label : "", plabel : oBundleText.getText("LABEL_0096"), span : 0, type : "string", sort : false, filter : false}	// 96:비고
		];
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
//			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			extension : new sap.m.Toolbar({
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({
						text : oBundleText.getText("LABEL_0852")	// 852:대근자 정보
					}).addStyleClass("MiddleTitle"),
					new sap.m.ToolbarSpacer()
				]
			}).addStyleClass("ToolbarNoBottomLine")
		})
		.setModel(oController._DetailTableJSonModel)
		.bindRows("/Data");
		
		common.ZHR_TABLES.makeColumn(oController, oTable, _colModel);
		
		oTable.getColumns()[1].setTemplate(new sap.m.Input({
			value : "{Sename}",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.onDelegatePernrChange,
			editable : {
				parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
				formatter : function(fVal1, fVal2) {
					return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
				}
			}
		}).addStyleClass("FontFamily"));
		
		oTable.getColumns()[8].setTemplate(new sap.m.Input({
			value : "{Zbigo}",
			editable : {
				parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
				formatter : function(fVal1, fVal2) {
					return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
				}
			}
		}).addStyleClass("FontFamily"));
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
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