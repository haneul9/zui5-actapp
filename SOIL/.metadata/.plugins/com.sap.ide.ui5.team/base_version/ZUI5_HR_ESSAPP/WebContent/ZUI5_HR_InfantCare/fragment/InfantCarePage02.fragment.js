sap.ui.jsfragment("ZUI5_HR_InfantCare.fragment.InfantCarePage02", {
	
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
			this.getEmpTableRender(oController),									// 신청대상자테이블
			sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController),			// 첨부파일
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
								new sap.m.Text(oController.PAGEID + "_DetailTitle", {text : oBundleText.getText("LABEL_0133") }).addStyleClass("Font18px FontColor0"),	// 133:영유아 보육지원 신청
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
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0125"), 	// 125:신청대상
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.ComboBox(oController.PAGEID + "_Regno", {
									width : "45%",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									},
									selectedKey : "{Regno}",
									change : oController.onChangeRegno
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0121")	// 121:생년월일
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "45%",
									value : "{Fgbdt}",
									editable : false
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0113") + " {Chage}" + oBundleText.getText("LABEL_0122")	// 113:만, 122:세
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0123"),	// 123:수혜년도
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.ComboBox(oController.PAGEID + "_Zyear", {
									width : "45%",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									},
									selectedKey : "{Zyear}",
									change : oController.onChangeZyear
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.CheckBox({
									text : oBundleText.getText("LABEL_0128"),	// 128:싱글맘
									selected : "{Singl}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									},
									select : oController.onSelectSingl
								})
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0115"),	// 115:분기
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox(oController.PAGEID + "_Divcd", {
									width : "45%",
									selectedKey : "{Divcd}",
									change : oController.onChangeDivcd,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									},
									items : {
										path: "ZHR_CHILD_CARE_SRV>/ChildCareTermListSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_CHILD_CARE_SRV>Divcd}",
											text: "{ZHR_CHILD_CARE_SRV>Divtx}"
										})
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
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0129"),	// 129:시설명
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "100%",
									value : "{Chsnm}",
									maxLength : common.Common.getODataPropertyLength("ZHR_CHILD_CARE_SRV", "ChildCareExpensesAppl", "Chsnm"),
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0131")	// 131:시설소재지
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input(oController.PAGEID + "_Chpla", {
									width : "100%",
									value : "{Chpla}",
									maxLength : common.Common.getODataPropertyLength("ZHR_CHILD_CARE_SRV", "ChildCareExpensesAppl", "Chpla"),
//									showValueHelp: true,
//									valueHelpOnly: false,
//									valueHelpRequest: oController.onDisplaySearchZipcodeDialog,
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
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_0047") 	// 47:신청내역
						}).addStyleClass("MiddleTitle"),
						new sap.m.ToolbarSpacer(),
						new sap.m.Button({
							text: oBundleText.getText("LABEL_0137"),	// 137:지급내역보기
							type : sap.m.ButtonType.Ghost,
							press : oController.onPressHistory,
							visible : { 
								path : "Pernr",
								formatter : function(fVal) {
									return (fVal && fVal != "") ? true : false;
								}
							}
						}),
						new sap.m.ToolbarSpacer({width: "5px"})
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
	 * 신청대상자테이블 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getEmpTableRender : function(oController) {
		var oWrkjob,		// 월 combo
			oColumnList,	// 상세내역 column 정보
			oTable;			// 상세내역 테이블
			
		
		// 월 combo
		oWrkjob = new sap.m.ComboBox(oController.PAGEID + "_Mon", { 
			items : {
				path : "/Months",
				template : new sap.ui.core.ListItem({
					key : "{key}",
					text : "{text}"
				}),
				templateShareable : true
			},
			selectedKey : "{Mon}",
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1){
					if(fVal1 == "" || fVal1 == "10") return true;
					else return false;
				}
			}
		}).addStyleClass("Font14px FontColor3");
		
		// 상세내역 column 정보
		oColumnList = new sap.m.ColumnListItem({
			counter : 10,
			cells : [
				new sap.m.Text({ text : "{Idx}" }).addStyleClass("Font14px FontColor3"),
				oWrkjob,
				new sap.m.Input({ 
					value : "{Caref}",
					textAlign : sap.ui.core.TextAlign.Right,
					change : oController.onChangCalcSum,
					editable : {
						parts : [{path : "ZappStatAl"}],
						formatter : function(fVal1){
							if(fVal1 == "" || fVal1 == "10") return true;
							else return false;
						}
					}
				}).addStyleClass("Font14px FontColor3 Number"),
				new sap.m.Input({ 
					value : "{Speci}",
					textAlign : sap.ui.core.TextAlign.Right,
					change : oController.onChangCalcSum,
					editable : {
						parts : [{path : "ZappStatAl"}],
						formatter : function(fVal1){
							if(fVal1 == "" || fVal1 == "10") return true;
							else return false;
						}
					}
				}).addStyleClass("Font14px FontColor3 Number"),
				new sap.m.Input({ 
					value : "{Sitef}",
					textAlign : sap.ui.core.TextAlign.Right,
					change : oController.onChangCalcSum,
					editable : {
						parts : [{path : "ZappStatAl"}],
						formatter : function(fVal1){
							if(fVal1 == "" || fVal1 == "10") return true;
							else return false;
						}
					}
				}).addStyleClass("Font14px FontColor3 Number"),
				new sap.m.Input({ 
					value : "{Etcfe}",
					textAlign : sap.ui.core.TextAlign.Right,
					change : oController.onChangCalcSum,
					editable : {
						parts : [{path : "ZappStatAl"}],
						formatter : function(fVal1){
							if(fVal1 == "" || fVal1 == "10") return true;
							else return false;
						}
					}
				}).addStyleClass("Font14px FontColor3 Number"),
				new sap.m.Input({ 
					value : "{Total}",
					textAlign : sap.ui.core.TextAlign.Right,
					editable : false
				}).addStyleClass("Font14px FontColor3"),
				new sap.m.Input({ 
					value : "{Apply}",
					textAlign : sap.ui.core.TextAlign.Right,
					editable : false
				}).addStyleClass("Font14px FontColor3")
			]
		});
		
		// 상세내역 테이블
		oTable = new sap.m.Table(oController.PAGEID + "_DetailTable", {
			inset : false,
			mode : "MultiSelect",
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "No data found",
			showNoData : true,
			columns : [
				new sap.m.Column({
					header: new sap.m.Label({text : "No."}).addStyleClass("FontFamilyBold"),
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Center,
					styleClass : "cellBorderRight cellBorderLeft",
					width : "3%",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({text : oBundleText.getText("LABEL_0134")}).addStyleClass("FontFamilyBold"),	// 134:월
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Center,
					styleClass : "cellBorderRight",
					width : "9%",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({text : oBundleText.getText("LABEL_0114")}).addStyleClass("FontFamilyBold"),	// 114:보육료
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Center,
					styleClass : "cellBorderRight",
					width : "14%",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({text : oBundleText.getText("LABEL_0141")}).addStyleClass("FontFamilyBold"),	// 141:특별활동비
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Center,
					styleClass : "cellBorderRight",
					width : "14%",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({text : oBundleText.getText("LABEL_0143")}).addStyleClass("FontFamilyBold"),	// 143:현장학습비
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Center,
					styleClass : "cellBorderRight",
					width : "14%",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({text : oBundleText.getText("LABEL_0109")}).addStyleClass("FontFamilyBold"),	// 109:기타
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Center,
					styleClass : "cellBorderRight",
					width : "14%",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({text : oBundleText.getText("LABEL_0142")}).addStyleClass("FontFamilyBold"),	// 142:합계
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Center,
					styleClass : "cellBorderRight",
					width : "14%",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({text : oBundleText.getText("LABEL_0139")}).addStyleClass("FontFamilyBold"),	// 139:지원금액
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Center,
					styleClass : "cellBorderRight",
					width : "14%",
					minScreenWidth: "tablet"
				})
			]
		})
		.setModel(oController._DetailTableJSonModel)
		.bindItems("/Data", oColumnList)
		.setKeyboardMode("Edit");
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content :  [
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_0117") 	// 117:상세내역
						}).addStyleClass("MiddleTitle"),
						new sap.m.Text(),
						new sap.m.MessageStrip({
							text : oBundleText.getText("LABEL_0135"),	// 135:정부지원금액을 제외한 실제 부담비용 기입 요망
							type : "Warning",
							showIcon : true ,
							showCloseButton : false,
						}).addStyleClass("FontFamily"),
						new sap.m.ToolbarSpacer(),
						new sap.m.Button({
							text : oBundleText.getText("LABEL_0023"),	// 23:등록
							type : sap.m.ButtonType.Ghost,
							press : oController.onPressAdd,
							visible : {
								path : "ZappStatAl",
								formatter : function(fVal){
									if(fVal == "" || fVal == "10") return true;
									else return false;
								}
							}
						}),
						new sap.m.Button({
							text : oBundleText.getText("LABEL_0033"),	// 33:삭제
							type : sap.m.ButtonType.Ghost,
							press : oController.onPressDelRecord,
							visible : {
								path : "ZappStatAl",
								formatter : function(fVal){
									if(fVal == "" || fVal == "10") return true;
									else return false;
								}
							}
						})
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
				oTable
			]
		});
	}
});