sap.ui.jsfragment("ZUI5_HR_DeductionItem.fragment.DeductionItemPage02", {
	
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
			sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController),			//첨부파일
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
									text : oBundleText.getText("LABEL_0457")	// 457:고정/변동 공제신청 (항목)
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
									new sap.m.Button(oController.PAGEID + "_BtnAppLine", {text : oBundleText.getText("LABEL_0005"),	// 결재지정
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
					// 변동/고정
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0446"), 	// 446:변동/고정
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.ComboBox({
									width : "45%" ,
									selectedKey : "{Dedgb}",
									change : oController.onChangeDedgb,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Persa"}],
										formatter : function(fVal1, fVal2, fVal3){
											return ((fVal1 == "" || fVal1 == "10") && fVal2 && (fVal3 == "7000")) ? true : false;
										}
									},
									items : {
										path: "ZHR_DEDUCT_OBJ_SRV>/DedGbnListSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_DEDUCT_OBJ_SRV>Dedgb}",
											text: "{ZHR_DEDUCT_OBJ_SRV>Dedgbtx}"
										})
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 신규/수정
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0448"),	// 448:신규/수정
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "45%" ,
									selectedKey : "{Newyn}",
									change : oController.onChangeNewyn,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Dedgb"}],
										formatter : function(fVal1, fVal2, fVal3){
											return ((fVal1 == "" || fVal1 == "10") && fVal2 && (fVal3 == "0010")) ? true : false;
										}
									},
									items : {
										path: "ZHR_DEDUCT_OBJ_SRV>/DedNewynListSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_DEDUCT_OBJ_SRV>Newyn}",
											text: "{ZHR_DEDUCT_OBJ_SRV>Newyntx}"
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
					// 공제명
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0439")	// 439:공제명
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Input(oController.PAGEID + "_Dedcd", {
									width : "45%",
									showValueHelp: true,
									valueHelpOnly: false,
									value : "{Dedtx}",
//									change : oController.DedtxSearchInput,
									valueHelpRequest: oController.displayDedgbDialog,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Dedgb"}, {path : "Newyn"}],
										formatter : function(fVal1, fVal2, fVal3, fVal4) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2 && (fVal3 == "0010") && (fVal4 == "1")) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 신규공제명
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0449")	// 449:신규공제명
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "45%",
									value : "{Dedtxnew}",
									change : oController.onChangeDedtxnew,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Newyn"}, {path : "Dedgb"}],
										formatter : function(fVal1, fVal2, fVal3, fVal4){
											return ((fVal1 == "" || fVal1 == "10") && fVal2 && (fVal3 == "0" || fVal4 == "0020")) ? true : false;
										}
									},
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 입금구분
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0455")	// 455:입금구분
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.ComboBox({
									width : "45%" ,
									selectedKey : "{Bnkgb}",
									change : oController.onChangeBnkgb,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Dedgb"}],
										formatter : function(fVal1, fVal2, fVal3, fVal4){
											return ((fVal1 == "" || fVal1 == "10") && fVal2 && (fVal3 == "0010")) ? true : false;
										}
									},
									items : {
										path: "ZHR_DEDUCT_OBJ_SRV>/BankGbnListSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_DEDUCT_OBJ_SRV>Bnkgb}",
											text: "{ZHR_DEDUCT_OBJ_SRV>Bnkgbtx}"
										})
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 입금은행
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0456")	// 456:입금은행
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "45%" ,
									selectedKey : "{Bankc}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Bnkgb"}],
										formatter : function(fVal1, fVal2, fVal3){
											return ((fVal1 == "" || fVal1 == "10") && fVal2 && (fVal3 == "4")) ? true : false;
										}
									},
									items : {
										path: "ZHR_DEDUCT_OBJ_SRV>/BankListSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_DEDUCT_OBJ_SRV>Bankc}",
											text: "{ZHR_DEDUCT_OBJ_SRV>Bankctx}"
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
					// 입금계좌정보
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0454")	// 454:입금계좌정보
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Input({
									width : "45%",
									value : "{Bankn}",
									liveChange : oController.onChangeBankn,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Bnkgb"}],
										formatter : function(fVal1, fVal2, fVal3){
											return ((fVal1 == "" || fVal1 == "10") && fVal2 && (fVal3 == "4")) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 예금주
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0450")	// 450:예금주
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "45%",
									value : "{Emftx}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Bnkgb"}],
										formatter : function(fVal1, fVal2, fVal3){
											return ((fVal1 == "" || fVal1 == "10") && fVal2 && (fVal3 == "4")) ? true : false;
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
					// 공제예정월
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0441")	// 441:공제예정월
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Input({
									width : "45%",
									value : "{Reqym}",
									editable : false
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 예금주 구분
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0451")	// 451:예금주 구분
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox(oController.PAGEID + "_Repgb", {
									width : "45%" ,
									selectedKey : "{Repgb}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Dedgb"}, {path : "Newyn"}],
										formatter : function(fVal1, fVal2, fVal3, fVal4){
											return ((fVal1 == "" || fVal1 == "10") && fVal2 && (fVal3 == "0010") && (fVal4 == "0")) ? true : false;
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
					// 공제예정기간
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0440")	// 440:공제예정기간
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.DatePicker({
									valueFormat : "yyyy-MM-dd",
									displayFormat : "yyyy.MM.dd",
									value : "{Todo1}",
									width : "150px",
									editable : false
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({text : "~"}).addStyleClass("Font14px FontColor3"),
								new sap.m.DatePicker({
									valueFormat : "yyyy-MM-dd",
									displayFormat : "yyyy.MM.dd",
									value : "{Todo2}",
									width : "150px",
									editable : false
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 이메일
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0453")	// 453:이메일
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Input({
									width : "45%",
									value : "{Email}",
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
					// 동호회 여부
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0445")	// 445:동호회 여부
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.CheckBox({
							selected : "{Memyn}",
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Dedgb"}, {path : "Newyn"}],
								formatter : function(fVal1, fVal2, fVal3, fVal4){
									return ((fVal1 == "" || fVal1 == "10") && fVal2 && (fVal3 == "0010") && (fVal4 == "0")) ? true : false;
								}
							}
						})
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 비고
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0096")	// 96:비고
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Input({
									width : "100%",
									value : "{Zbigo}",
									maxLength : common.Common.getODataPropertyLength("ZHR_DEDUCT_OBJ_SRV", "DeductObjAppl", "Zbigo"),
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
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
					rows : aFirstMatrixRows
				})
			]
		});
	}
});