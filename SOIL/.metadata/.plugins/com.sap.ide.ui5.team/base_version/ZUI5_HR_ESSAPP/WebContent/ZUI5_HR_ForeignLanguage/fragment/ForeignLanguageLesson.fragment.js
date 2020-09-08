sap.ui.jsfragment("ZUI5_HR_ForeignLanguage.fragment.ForeignLanguageLesson", {
	
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
								new sap.m.Text(oController.PAGEID + "_DetailTitle", {text : oBundleText.getText("LABEL_0259") }).addStyleClass("Font18px FontColor0"),	// 259:외국어 학습비 신청
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
										press : oController.onPressSaveAmtCheck,
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
							text : oBundleText.getText("LABEL_0236"), 	// 236:교육기관
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "100%",
									value : "{Eduorg}",
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
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0234"), 	// 234:교육기간(개월)
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.DatePicker(oController.PAGEID + "_Edubeg", {
									valueFormat : "yyyy-MM-dd",
									displayFormat : "yyyy.MM.dd",
									value : "{Edubeg}",
									width : "150px",
									change : oController.onCheckEduDate,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.ui.core.HTML({
									content : "<div style='text-align:center;'>-</div>"
								}),
								new sap.m.DatePicker(oController.PAGEID + "_Eduend", {
									valueFormat : "yyyy-MM-dd",
									displayFormat : "yyyy.MM.dd",
									value : "{Eduend}",
									width : "150px",
									change : oController.onCheckEduDate,
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
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0262"),	// 262:외국어유형/교육방법
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.ComboBox(oController.PAGEID + "_Quali", {
									width : "47%",
									selectedKey : "{Quali}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									},
									items : {
										path: "ZHR_FOREIGNLANG_SRV>/QualiCodeListSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_FOREIGNLANG_SRV>Key}",
											text: "{ZHR_FOREIGNLANG_SRV>Value}"
										})
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ComboBox(oController.PAGEID + "_Eduway", {
									width : "53%",
									selectedKey : "{Eduway}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									},
									items : {
										path: "ZHR_FOREIGNLANG_SRV>/EduwayCodeListSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_FOREIGNLANG_SRV>Key}",
											text: "{ZHR_FOREIGNLANG_SRV>Value}"
										})
									}
								}).addStyleClass("Font14px FontColor3 PaddingLeft3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0269"),	// 269:출석률(%)
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "46.8%",
									value : "{Eduatt}",
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
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0239")	// 239:교육시간만 입력
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.CheckBox({
							selected : "{Onlytim}",
							select : oController.onSelectOnlytim,
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
								}
							}
						})
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0246")	// 246:순 교육시간(교육시간 인정용)
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "46.8%",
									value : "{Edutim}",
									liveChange : oController.onLimitDigit,
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
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0254")	// 254:신청금액(최대 5만원)
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "47%",
									value : "{Appamt}",
//									change : oController.onCheckLimit,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Onlytim"}],
										formatter : function(fVal1, fVal2, fVal3){
											return ((fVal1 == "" || fVal1 == "10") && fVal2 && !fVal3) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3 Number"),
								new sap.m.Input({
									width : "60px",
									value : "{Waers}",
									editable : false
								}).addStyleClass("Font14px FontColor3 PaddingLeft3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0244")	// 244:비고(회차)
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "100%",
									value : "{Zbigo}",
									maxLength : common.Common.getODataPropertyLength("ZHR_FOREIGNLANG_SRV", "LangExpenseAppl", "Zbigo"),
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
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "120px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan: 4,
						content : new sap.m.MessageStrip(oController.PAGEID + "_InfoTxt", {
							text : oBundleText.getText("LABEL_0272") + oBundleText.getText("LABEL_2966"),	// 272:학습비는 1개월 단위로 익월 신청 요망 및 <span style='color:red;'>순 교육시간 입력</span>\n<span style='color:red;'>(2020년도부터 사외 외국어 교육시간 인정됩니다. 교육시간은 10분단위로 입력가능하며 \nex) 10분 = 0.2, 20분 = 0.3, 30분 = 0.5, 40분 0.7, 50분 = 0.8,  60분 = 1.0 으로 등록필요함.)</span>, 2966:\n장기 수업 등록시 비고란에 \"당월 횟수/전체 월 입력요망\"\n첨부서류 : 카드 결재 영수증 / 출석률 80% 이상 수강증
							type : "Success",
							showIcon : true,
							customIcon : "sap-icon://message-information", 
							showCloseButton : false,
						}).addStyleClass("Font14px FontColor3")
					})
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
		})
		.addEventDelegate({
			onAfterRendering: function() {
				// 메세지에 들어간 html 태그를 DOM으로 변경(<span style='color:red;'></span>)
				var $messageSpan = $('#ZUI5_HR_ForeignLanguageLesson_InfoTxt').find('.sapMMsgStripMessage > span');
				
				$messageSpan.html($messageSpan.text());
			}
		});
	}
});