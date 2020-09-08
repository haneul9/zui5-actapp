sap.ui.jsfragment("ZUI5_HR_VacationSickAndBabyChange.fragment.VacationSickAndBabyChangePage02", {
	
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
									text : oBundleText.getText("LABEL_0764")	// 764:병가/출산휴가/육아휴직 변경/취소 신청서
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
									new sap.m.Button({text : oBundleText.getText("LABEL_0759"),	// 759:위임지정
										press : common.MandateAction.onMandate,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal){
												if(fVal == "" || fVal == "10") return true;
												else return false;
											}
										}
									}),
									new sap.m.Button({text : oBundleText.getText("LABEL_0005"),	// 5:결재지정
										press : common.ApprovalLineAction.onApprovalLine,
										visible : {
											 path : "ZappStatAl",
											 formatter : function(fVal){
												 if(fVal == "" || fVal == "10") return true;
												 else return false;
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
					// 변경/취소
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0752"), 	// 752:변경/취소
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.ComboBox(oController.PAGEID + "_Chtyp", {
							width : "250px",
							selectedKey : "{Chtyp}",
							change : oController.onChangeChtyp,
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2) {
									return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
								}
							},
							items : [
								new sap.ui.core.Item({key : "A", text : oBundleText.getText("LABEL_0751")}),	// 751:변경
								new sap.ui.core.Item({key : "B", text : oBundleText.getText("LABEL_0071")})	// 71:취소
							]
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 휴가
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0763")	// 763:휴가
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Atext}",
							width : "250px",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 변경/취소사유
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0753")	// 753:변경/취소사유
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Input({
							width : "100%" ,
							value : "{Reasn}",
							maxLength : common.Common.getODataPropertyLength("ZHR_LEAVEAPPL_SRV", "ChangeLongLeaveDetail", "Reasn"),
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2) {
									return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
								}
							}
						}).addStyleClass("Font14px FontColor3")	
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 기신청
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0749")	// 749:기신청
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : [
							new sap.m.DatePicker({
								valueFormat : "yyyy-MM-dd",
								displayFormat : "yyyy.MM.dd",
								value : "{Ovcbeg}",
								width : "150px",
								editable : false
							}).addStyleClass("Font14px FontColor3"),
							new sap.m.Text({text : "~"}),
							new sap.m.DatePicker({
								valueFormat : "yyyy-MM-dd",
								displayFormat : "yyyy.MM.dd",
								value : "{Ovcend}",
								width : "150px",
								editable : false
							}).addStyleClass("Font14px FontColor3"),
							new sap.m.Text({
								text : "{OusedayTxt}"
							}).addStyleClass("Font14px FontColor3 L2PPaddingLeft10 L2PPaddingTop6")
						]
					}).addStyleClass("MatrixData"),
					// 변경
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0751")	// 751:변경
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : [
							new sap.m.DatePicker({
								valueFormat : "yyyy-MM-dd",
								displayFormat : "yyyy.MM.dd",
								value : "{Begda}",
								width : "150px",
								change : oController.onChangeCalcUseday,
								editable : {
									parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Chtyp"}],
									formatter : function(fVal1, fVal2, fVal3) {
										return ((fVal1 == "" || fVal1 == "10") && fVal2 && (fVal3 == "A")) ? true : false;
									}
								}
							}).addStyleClass("Font14px FontColor3"),
							new sap.m.Text({text : "~"}),
							new sap.m.DatePicker({
								valueFormat : "yyyy-MM-dd",
								displayFormat : "yyyy.MM.dd",
								value : "{Endda}",
								width : "150px",
								change : oController.onChangeCalcUseday,
								editable : {
									parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Chtyp"}],
									formatter : function(fVal1, fVal2, fVal3) {
										return ((fVal1 == "" || fVal1 == "10") && fVal2 && (fVal3 == "A")) ? true : false;
									}
								}
							}).addStyleClass("Font14px FontColor3"),
							new sap.m.Text({
								text : "{UsedayTxt}"
							}).addStyleClass("Font14px FontColor3 L2PPaddingLeft10 L2PPaddingTop6")
						]
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_RowTypeTM11", {
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0754")	// 754:병가구분
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Input({
							value : "{Aptxt}",
							width : "250px",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_RowTypeTM21", {
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0755")	// 755:분만예정일
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.DatePicker({
							valueFormat : "yyyy-MM-dd",
							displayFormat : "yyyy.MM.dd",
							value : "{Dlvda}",
							width : "250px",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0750")	// 750:다태아구분
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TwinType}",
							width : "250px",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_RowTypeTM31", {
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0760")	// 760:자녀명
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Fname}",
							width : "250px",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0121")	// 121:생년월일
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Gbdatx}",
							width : "250px",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_RowTypeTM31B", {
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2889")	// 2889:주수
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Pregwkx}",
							width : "250px",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0159")	// 159:일수
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Pregdayx}",
							width : "250px",
							editable : false
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0762")	// 762:집중휴가중 직무인수인
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Input({
							value : "{Takper}",
							width : "100%",
							maxLength : common.Common.getODataPropertyLength("ZHR_LEAVEAPPL_SRV", "ChangeLongLeaveDetail", "Takper"),
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
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_0047") 	// 47:신청내역
						}).addStyleClass("MiddleTitle"),
						new sap.m.ToolbarSpacer(),
						new sap.m.Button({
							text : oBundleText.getText("LABEL_0362"),	// 362:신청내역조회
							type : sap.m.ButtonType.Ghost,
							press : oController.onVacationApply,
							visible : {
								path : "ZappStatAl",
								formatter : function(fVal) {
									return (fVal == "") ? true : false;
								}
							}
						}),
						new sap.m.Button({
							text : oBundleText.getText("LABEL_0006"),	// 근무일정
							type : sap.m.ButtonType.Ghost,
							press : oController.onCheckWorkSchedule,
						})
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
	}
});