sap.ui.jsfragment("ZUI5_HR_ResignationInterview.fragment.ResignationInterviewPage02", {
	
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
			this.getResignationInfoRender(oController),								// 사직 신청 내용
			this.getInterviewRender(oController),									// 퇴직자 면접표 작성 내용
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
									text : oBundleText.getText("LABEL_0393")	// 393:퇴직자 면접표 작성
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
											parts : [{path : "ZappStatAl"}, {path : "Zrest"}],
											formatter : function(fVal1, fVal2) {
												return ((fVal1 == "" || fVal1 == "10") && fVal2 != "11") ? true : false;
											}
										}
									}),
									new sap.m.Button({
										text : oBundleText.getText("LABEL_0058"), // 58:임시저장
										press : oController.onPressSaveT,
										visible : {
											parts : [{path : "ZappStatAl"}, {path : "Zrest"}],
											formatter : function(fVal1, fVal2) {
												return ((fVal1 == "" || fVal1 == "10") && fVal2 != "11") ? true : false;
											}
										}
									}),
//									new sap.m.Button({
//										text : oBundleText.getText("LABEL_0033"), // 33:삭제
//										press : oController.onDelete,
//										visible : {
//											path : "ZappStatAl",
//											formatter : function(fVal) {
//												return (fVal == "10") ? true : false;
//											}
//										}
//									}),
									new sap.m.Button({text : oBundleText.getText("LABEL_0044"),	// 44:신청
										press : oController.onPressSaveC,
										visible : {
											parts : [{path : "ZappStatAl"}, {path : "Zrest"}],
											formatter : function(fVal1, fVal2) {
												return ((fVal1 == "" || fVal1 == "10") && fVal2 != "11") ? true : false;
											}
										}
									}),
									new sap.m.Button({text : oBundleText.getText("LABEL_0024"),	// 24:반려
										press : oController.onReject,
										visible : {
											parts : [{path : "ZappStatAl"}, {path : "Zrest"}],
											formatter : function(fVal1, fVal2) {
												return ((fVal1 == "" || fVal1 == "10") && fVal2 != "11") ? true : false;
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
	 * 사직 신청 내용 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getResignationInfoRender : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 사직 신청일
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0377"), 	// 377:사직 신청일
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.DatePicker(oController.PAGEID + "_Reret", {
							valueFormat : "yyyy-MM-dd",
							displayFormat : "yyyy.MM.dd",
							value : "{Reret}",
							width : "30%",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 입사일자
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0379")	// 379:입사일자
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{Entdt}"
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					// 사직사유
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0378"),	// 378:사직사유
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.TextArea({
							value : "{Reason}",
							width : "98%",
							rows : 5,
							growing : true,
							maxLength : 255,
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 담당업무
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0371"),	// 371:담당업무
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Input({
							width : "98%",
							value : "{Zzjob}",
							maxLength : 100,
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 면담 인원
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0372"),	// 372:면담 인원
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Input({
							width : "20%",
							value : "{Mgrsid}({Mgrnm})",
							editable : false
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
							text : oBundleText.getText("LABEL_0376") 	// 376:사직 신청 내용
						}).addStyleClass("MiddleTitle")
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
				new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_ApplyMatrix", {
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
	 * 퇴직자 면접표 작성 내용 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getInterviewRender : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 작성일
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0380"), 	// 380:작성일
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.DatePicker({
							valueFormat : "yyyy-MM-dd",
							displayFormat : "yyyy.MM.dd",
							value : "{Mgrdt}",
							width : "15%",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					// 퇴직사유(표면적인 사유)
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0392"), 	// 392:퇴직사유\n(표면적인 사유)
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.TextArea({
							value : "{Reas1}",
							width : "98%",
							rows : 3,
							growing : true,
							maxLength : common.Common.getODataPropertyLength("ZHR_ACTION_SRV", "RetireInterview", "Reas1"),
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Zrest"}],
								formatter : function(fVal1, fVal2) {
									return ((fVal1 == "" || fVal1 == "10") && fVal2 != "11") ? true : false;
								}
							}
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					// 퇴직사유(실질적인 사유)
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0391"), 	// 391:퇴직사유\n(실질적인 사유)
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.TextArea({
							value : "{Reas2}",
							width : "98%",
							rows : 3,
							growing : true,
							maxLength : common.Common.getODataPropertyLength("ZHR_ACTION_SRV", "RetireInterview", "Reas1"),
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Zrest"}],
								formatter : function(fVal1, fVal2) {
									return ((fVal1 == "" || fVal1 == "10") && fVal2 != "11") ? true : false;
								}
							}
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
					]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					// 설득 과정
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0389"), 	// 389:설득 과정
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.TextArea({
							value : "{Suppt}",
							width : "98%",
							rows : 3,
							growing : true,
							maxLength : common.Common.getODataPropertyLength("ZHR_ACTION_SRV", "RetireInterview", "Reas1"),
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Zrest"}],
								formatter : function(fVal1, fVal2) {
									return ((fVal1 == "" || fVal1 == "10") && fVal2 != "11") ? true : false;
								}
							}
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
					]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					// 부서가 취해야 할 대책
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0388"), 	// 388:부서가 취해야 할 대책
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.TextArea({
							value : "{Depsu}",
							width : "98%",
							rows : 3,
							growing : true,
							maxLength : common.Common.getODataPropertyLength("ZHR_ACTION_SRV", "RetireInterview", "Reas1"),
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Zrest"}],
								formatter : function(fVal1, fVal2) {
									return ((fVal1 == "" || fVal1 == "10") && fVal2 != "11") ? true : false;
								}
							}
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
					]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					// 회사가 취해야 할 대책
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0396"), 	// 396:회사가 취해야 할 대책
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.TextArea({
							value : "{Consu}",
							width : "98%",
							rows : 3,
							growing : true,
							maxLength : common.Common.getODataPropertyLength("ZHR_ACTION_SRV", "RetireInterview", "Reas1"),
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Zrest"}],
								formatter : function(fVal1, fVal2) {
									return ((fVal1 == "" || fVal1 == "10") && fVal2 != "11") ? true : false;
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
							text : oBundleText.getText("LABEL_0394") 	// 394:퇴직자 면접표 작성 내용
						}).addStyleClass("MiddleTitle")
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
				new sap.ui.commons.layout.MatrixLayout({
					columns : 2,
					widths : ['20%', '80%'],
					rows : aRows
				})
				.setModel(oController._DetailJSonModel)
				.bindElement("/Data")
			]
		});
	}
});