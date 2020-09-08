sap.ui.jsfragment("ZUI5_HR_WorktimeReduction.fragment.WorktimeReductionPage02", {
	
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
			sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController),			// 첨부파일
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
									text : oBundleText.getText("LABEL_2989")	// 2989:근로시간 단축 신청
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
					// 근무유형
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1557"), 	// 1557:근무유형
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "250px",
									selectedKey : "{Todo1}",
									editable : false,
									items : [
										new sap.ui.core.Item({key : "1", text : oBundleText.getText("LABEL_2992")}),	// 2992:근로단축
									]
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 근로단축유형
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2990"),	// 2990:근로단축유형
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "250px",
									selectedKey : "{Wktrd}",
									change : oController.onChangeWktrd,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									},
									items : {
										path: "ZHR_WORKTIME_REDUCE_SRV>/WktrdListSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_WORKTIME_REDUCE_SRV>Wktrd}",
											text: "{ZHR_WORKTIME_REDUCE_SRV>Wktrdtx}"
										})
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_Type1", {
				height : "30px",
				cells : [
					// 임신주기
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2993"), 	// 2993:임신주기
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "250px",
									selectedKey : "{Grcyl}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									},
									items : {
										path: "ZHR_WORKTIME_REDUCE_SRV>/GrcylListSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_WORKTIME_REDUCE_SRV>Grcyl}",
											text: "{ZHR_WORKTIME_REDUCE_SRV>Grcyltx}"
										})
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_Type2", {
				height : "30px",
				cells : [
					// 자녀명
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0760"), 	// 760:자녀명
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "250px",
									value : "{Fname}",
									change : oController.onChangeChildrenName,
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
					// 생년월일
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0121"),	// 121:생년월일
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.DatePicker({
									valueFormat : "yyyy-MM-dd",
									displayFormat : "yyyy.MM.dd",
									value : "{Fgbdt}",
									change : oController.onCalcAge,
									width : "150px",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ToolbarSpacer({width: "5px"}),
								new sap.m.Input({
									width : "80px",
									value : "{Aget}",
									editable : false
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_Type21", {
				height : "60px",
				cells : [
					// 육아휴직 사용내역
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2994") 	// 2994:육아휴직 사용내역
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							height : "60px",
							content : [
								new sap.m.Text({
									text : "{UseVact}"
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_Type3", {
				height : "30px",
				cells : [
					// 신청유형
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0157"), 	// 157:신청유형
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "250px",
									selectedKey : "{Lfcyl}",
									change : oController.onChangeLfcyl,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									},
									items : {
										path: "ZHR_WORKTIME_REDUCE_SRV>/LfcylListSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_WORKTIME_REDUCE_SRV>Lfcyl}",
											text: "{ZHR_WORKTIME_REDUCE_SRV>Lfcyltx}"
										})
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Label({
									text : oBundleText.getText("LABEL_2995"),	// 2995:돌봄대상자 기준 가족구성원
									visible : {
										path : "Lfcyl",
										formatter : function(fVal) {
											return (fVal == "1") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontBold FontColor3 NoMarginLeft"),
								new sap.m.Label({
									text : oBundleText.getText("LABEL_2997"),	// 2997:진단명(질병분류코드)
									required : true,
									visible : {
										path : "Lfcyl",
										formatter : function(fVal) {
											return (fVal == "2") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontBold FontColor3 NoMarginLeft"),
								new sap.m.Label({
									text : oBundleText.getText("LABEL_0121"),	// 121:생년월일
									required : true,
									visible : {
										path : "Lfcyl",
										formatter : function(fVal) {
											return (fVal == "3") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontBold FontColor3 NoMarginLeft"),
								new sap.m.Label({
									text : oBundleText.getText("LABEL_1155"),	// 1155:학교명
									required : true,
									visible : {
										path : "Lfcyl",
										formatter : function(fVal) {
											return (fVal == "4") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontBold FontColor3 NoMarginLeft")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar(oController.PAGEID + "_Type3Toolbar", {
							content : [
								new sap.ui.commons.layout.VerticalLayout({
									content : [
										new sap.m.Toolbar({
											content : [
												new sap.m.Text({ text : "부,모" }).addStyleClass("Font14px FontColor3"),
												new sap.m.Input({ value : "{F01cnt}", width : "40px" }).addStyleClass("Font14px FontColor3 Number"),
												new sap.m.Text({ text : "명" }).addStyleClass("Font14px FontColor3"),
												new sap.m.Text({ text : "배우자" }).addStyleClass("Font14px FontColor3"),
												new sap.m.Input({ value : "{F02cnt}", width : "40px" }).addStyleClass("Font14px FontColor3 Number"),
												new sap.m.Text({ text : "명" }).addStyleClass("Font14px FontColor3"),
												new sap.m.Text({ text : "자녀" }).addStyleClass("Font14px FontColor3"),
												new sap.m.Input({ value : "{F03cnt}", width : "40px" }).addStyleClass("Font14px FontColor3 Number"),
												new sap.m.Text({ text : "명" }).addStyleClass("Font14px FontColor3")
											]
										}).addStyleClass("ToolbarNoBottomLine"),
										new sap.m.Toolbar({
											content : [
												new sap.m.Text({ text : "형제,자매" }).addStyleClass("Font14px FontColor3"),
												new sap.m.Input({ value : "{F04cnt}", width : "40px" }).addStyleClass("Font14px FontColor3 Number"),
												new sap.m.Text({ text : "명" }).addStyleClass("Font14px FontColor3"),
												new sap.m.Text({ text : "배우자의 부모" }).addStyleClass("Font14px FontColor3"),
												new sap.m.Input({ value : "{F05cnt}", width : "40px" }).addStyleClass("Font14px FontColor3 Number"),
												new sap.m.Text({ text : "명" }).addStyleClass("Font14px FontColor3")
											]
										}).addStyleClass("ToolbarNoBottomLine")
									],
									visible : {
										path : "Lfcyl",
										formatter : function(fVal) {
											return (fVal == "1") ? true : false;
										}
									}
								}),
								new sap.m.Input({
									width : "250px",
									value : "{Disenm}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									},
									visible : {
										path : "Lfcyl",
										formatter : function(fVal) {
											return (fVal == "2") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.DatePicker({
									valueFormat : "yyyy-MM-dd",
									displayFormat : "yyyy.MM.dd",
									value : "{Fgbdt}",
									width : "150px",
									change : oController.onCalcAge,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									},
									visible : {
										path : "Lfcyl",
										formatter : function(fVal) {
											return (fVal == "3") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),,
								new sap.m.ToolbarSpacer({
									width: "5px",
									visible : {
										path : "Lfcyl",
										formatter : function(fVal) {
											return (fVal == "3") ? true : false;
										}
									}
								}),
								new sap.m.Input({
									width : "80px",
									value : "{Aget}",
									editable : false,
									visible : {
										path : "Lfcyl",
										formatter : function(fVal) {
											return (fVal == "3") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									width : "250px",
									value : "{Schtx}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									},
									visible : {
										path : "Lfcyl",
										formatter : function(fVal) {
											return (fVal == "4") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_Type31", {
				height : "30px",
				cells : [
					// 돌봄대상자 성명
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2996"), 	// 2996:돌봄대상자 성명
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "250px",
									value : "{Fname}",
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
					// 가족관계
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1445"),	// 1445:가족관계
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "250px",
									selectedKey : "{Famgb}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									},
									items : {
										path: "ZHR_WORKTIME_REDUCE_SRV>/FamgbListSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_WORKTIME_REDUCE_SRV>Famgb}",
											text: "{ZHR_WORKTIME_REDUCE_SRV>Famgbtx}"
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
					// 단축기간
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2991"), 	// 2991:단축기간
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.DatePicker({
									valueFormat : "yyyy-MM-dd",
									displayFormat : "yyyy.MM.dd",
									value : "{Begda}",
									width : "150px",
									change : oController.onChangeReduceDay,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.ui.core.HTML({content : "<div style='width:10px;text-align:center;'>~</div>"}),
								new sap.m.DatePicker({
									valueFormat : "yyyy-MM-dd",
									displayFormat : "yyyy.MM.dd",
									value : "{Endda}",
									width : "150px",
									change : oController.onChangeReduceDay,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ToolbarSpacer({width: "5px"}),
								new sap.m.Input({
									width : "210px",
									value : "{Daystx}",
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
					// 근무시간
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0671"), 	// 671:근무시간
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.TimePicker({
									valueFormat : "HHmm",
									displayFormat : "HH:mm",
									minutesStep : 30,
									initialFocusedDateValue : new Date(2020, 0, 1, 9, 0, 0),
									width : "150px",
									value : "{Beguz}",
									change : oController.onChangeWorktime,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Begda"}, {path : "Endda"}],
										formatter : function(fVal1, fVal2, fVal3, fVal4) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2 && fVal3 && fVal4) ? true : false;
										}
									},
									textAlign : sap.ui.core.TextAlign.Begin
								}).addStyleClass("L2PFontFamily"),
								new sap.ui.core.HTML({content : "<div style='width:10px;text-align:center;'>~</div>"}),
								new sap.m.TimePicker({
									valueFormat : "HHmm",
									displayFormat : "HH:mm",
									minutesStep : 30,
									initialFocusedDateValue : new Date(2020, 0, 1, 18, 0, 0),
									value : "{Enduz}",
									width : "150px",
									change : oController.onChangeWorktime,
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Begda"}, {path : "Endda"}],
										formatter : function(fVal1, fVal2, fVal3, fVal4) {
											return ((fVal1 == "" || fVal1 == "10") && fVal2 && fVal3 && fVal4) ? true : false;
										}
									},
									textAlign : sap.ui.core.TextAlign.Begin
								}).addStyleClass("L2PFontFamily"),
								new sap.m.ToolbarSpacer({width: "5px"}),
								new sap.m.Input({
									width : "210px",
									value : "{Hourstx}",
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
					// 비고
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0096") 	// 96:비고
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "100%",
									value : "{Zbigo}",
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
	}
});