sap.ui.jsfragment("ZUI5_HR_HousingFundRepayment.fragment.HousingFundRepaymentPage02", {
	
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
			this.getApplyInfoRender(oController),									// 주택자금 일시상환 신청
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
									text : oBundleText.getText("LABEL_0420")	// 420:주택자금 중도상환 신청
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
									}),
									new sap.m.Button({text : oBundleText.getText("LABEL_1907"),	// 1907:회수
										press : function() {
											common.Common.onPressApprovalCancel(oController);
										},
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal) {
												return (fVal == "20") ? true : false;
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
		
		var aFirstMatrixRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 대출번호
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0408"), 	// 408:대출번호
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.ComboBox(oController.PAGEID + "_Lonid", {
									width : "45%",
									selectedKey : "{Lonid}",
									change : oController.onChangeLonid,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 대출지급일
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0410")	// 410:대출지급일
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Text({
									text : "{Paymm}"
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 대출용도
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0221")	// 221:대출용도
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Text({
									text : "{Louset}"
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 이자율
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0089")	// 89:이자율
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Text({
									text : "{Lnrte} %"
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 중도상환 유형
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0421"),	// 421:중도상환 유형
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox(oController.PAGEID + "_Lmtyp", {
									width : "45%",
									selectedKey : "{Lmtyp}",
									change : oController.onChangeLmtyp,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 상환일자
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0413"),	// 413:상환일자
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.DatePicker(oController.PAGEID + "_Lmdat", {
									valueFormat : "yyyy-MM-dd",
									displayFormat : "yyyy.MM.dd",
									value : "{Lmdat}",
									width : "30%",
									change : oController.onChangeLmdat,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Lmtyp"}],
										formatter : function(fVal1, fVal2, fVal3) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2 && (fVal3 != "D")) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			})
		];
		
		var aSecondMatrixRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 구분
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						colSpan : 2,
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0300")	// 300:구분
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					// 회사
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0423")	// 423:회사
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					// 사내근로복지기금
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0411")	// 411:사내근로복지기금
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					// 은행
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0415")	// 415:은행
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 대출금액
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						colSpan : 2,
						content : new sap.m.Text({
							text : oBundleText.getText("LABEL_0407")	// 407:대출금액
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 대출금액 - 회사
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Text({
							text : "{LnamtCpn}"
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 대출금액 - 사내근로복지기금
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Text({
							text : "{LnamtFun}"
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 대출금액 - 은행
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Text({
							text : "{LnamtBnk}"
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 상환 누계액
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						colSpan : 2,
						content : new sap.m.Text({
							text : oBundleText.getText("LABEL_0412")	// 412:상환 누계액
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 상환 누계액 - 회사
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Text({
							text : "{RpamtSum1}"
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 상환 누계액 - 사내근로복지기금
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Text({
							text : "{RpamtSum2}"
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 상환 누계액 - 은행
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Text({
							text : "{RpamtSum3}"
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 중도상환금
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						rowSpan : 3,
						content : new sap.m.Text({
							text : oBundleText.getText("LABEL_0422")	// 422:중도상환금
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 원금
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Text({
							text : oBundleText.getText("LABEL_0414")	// 414:원금
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 원금 - 회사
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : [
							// 일시상환
							new sap.m.Text({
								text : "{MrpprCpn}",
								visible : {
									path : "Lmtyp",
									formatter : function(fVal) {
										return (fVal != "D") ? true : false;
									}
								}
							}).addStyleClass("Font14px FontColor3"),
							// 일부상환
							new sap.m.ComboBox(oController.PAGEID + "_MrpprCpn", {
								width : "40%",
								selectedKey : "{MrpprCpn}",
								change : oController.onChangeMrpprCpn,
								editable : {
									path : "ZappStatAl",
									formatter : function(fVal) {
										return (fVal == "" || fVal == "10") ? true : false;
									}
								},
								visible : {
									path : "Lmtyp",
									formatter : function(fVal) {
										return (fVal == "D") ? true : false;
									}
								}
							}).addStyleClass("Font14px FontColor3")
						]
					}).addStyleClass("MatrixData"),
					// 원금 - 사내근로복지기금
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : [
							// 일시상환
							new sap.m.Text({
								text : "{MrpprFun}",
								visible : {
									path : "Lmtyp",
									formatter : function(fVal) {
										return (fVal != "D") ? true : false;
									}
								}
							}).addStyleClass("Font14px FontColor3"),
							// 일부상환
							new sap.m.ComboBox(oController.PAGEID + "_MrpprFun", {
								width : "40%",
								selectedKey : "{MrpprFun}",
								change : oController.onChangeMrpprFun,
								editable : {
									path : "ZappStatAl",
									formatter : function(fVal) {
										return (fVal == "" || fVal == "10") ? true : false;
									}
								},
								visible : {
									path : "Lmtyp",
									formatter : function(fVal) {
										return (fVal == "D") ? true : false;
									}
								}
							}).addStyleClass("Font14px FontColor3")
						]
					}).addStyleClass("MatrixData"),
					// 원금 - 은행
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : [
							// 일시상환
							new sap.m.Text({
								text : "{MrpprBnk}",
								visible : {
									path : "Lmtyp",
									formatter : function(fVal) {
										return (fVal != "D") ? true : false;
									}
								}
							}).addStyleClass("Font14px FontColor3"),
							// 일부상환
							new sap.m.ComboBox(oController.PAGEID + "_MrpprBnk", {
								width : "40%",
								selectedKey : "{MrpprBnk}",
								change : oController.onChangeMrpprBnk,
								editable : {
									path : "ZappStatAl",
									formatter : function(fVal) {
										return (fVal == "" || fVal == "10") ? true : false;
									}
								},
								visible : {
									path : "Lmtyp",
									formatter : function(fVal) {
										return (fVal == "D") ? true : false;
									}
								}
							}).addStyleClass("Font14px FontColor3")
						]
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 이자
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Text({
							text : oBundleText.getText("LABEL_0416")	// 416:이자
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 이자 - 회사
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Text({
							text : "{MrpinCpn}"
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 이자 - 사내근로복지기금
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Text({
							text : "{MrpinFun}"
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 이자 - 은행
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Text({
							text : oBundleText.getText("LABEL_0427")	// 427:은행에 문의하세요.
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 계
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Text({
							text : oBundleText.getText("LABEL_0406")	// 406:계
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData bgColorhighlight"),
					// 계 - 회사
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Text({
							text : "{MramtTot1}"
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData bgColorhighlight"),
					// 계 - 사내근로복지기금
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Text({
							text : "{MramtTot2}"
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData bgColorhighlight"),
					// 계 - 은행
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Text({
							text : "{MramtTot3}"
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData bgColorhighlight")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_BankRow", {
				height : "65px",
				cells : [
					// 입금처
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						colSpan : 2,
						content : new sap.m.Text({
							text : oBundleText.getText("LABEL_0419")	// 419:입금처
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 입금처 - 회사
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Text({
							text : "{Entinfo1}",
							textAlign : sap.ui.core.TextAlign.Center
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 입금처 - 사내근로복지기금
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Text({
							text : "{Entinfo2}",
							textAlign : sap.ui.core.TextAlign.Center
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					// 입금처 - 은행
					new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						content : new sap.m.Text({
							text : "{Entinfo3}",
							textAlign : sap.ui.core.TextAlign.Center
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData")
				]
			})
		];
		
		var oBankMatirx = new sap.ui.commons.layout.MatrixLayout({
			columns : 5,
			widths : ['11%', '11%', '26%', '26%', '26%'],
			rows : aSecondMatrixRows
		});
		
//		oBankMatirx.addEventDelegate({
//			onAfterRendering : function() {
//				var oBankRow = sap.ui.getCore().byId("ZUI5_HR_HousingFundRepaymentDetail_BankRow"),
//					vBankRowHeight = Number(oBankRow.getHeight().replace(/[^\d]/g, '') || "30");
//				
//				var aSpanHeight = [];
//				$('#ZUI5_HR_HousingFundRepaymentDetail_BankRow').find('td').each(function() {
//					aSpanHeight.push($(this).find('span').height());
//				});
//				
//				var vMaxHeight = Math.max.apply(null, aSpanHeight);
//				vMaxHeight = vMaxHeight < 30 ? 30 : vMaxHeight;
//				vMaxHeight = vMaxHeight < vBankRowHeight ? vBankRowHeight : vMaxHeight;
//				
//				oBankRow.setHeight(vMaxHeight + "px");
//			}
//		});
		
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
					rows : aFirstMatrixRows
				}),
				new sap.ui.core.HTML({content : "<div style='height : 20px;'/>"}),
				oBankMatirx
			]
		});
	}
});