sap.ui.jsfragment("ZUI5_HR_Volunteer.fragment.VolunteerPage02", {
	
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
			this.getTitleRender(oController),		
			sap.ui.jsfragment("fragment.ApplyInformationLayout", oController), 		// 신청안내
			sap.ui.jsfragment("fragment.TargetLayout", oController),           		// 결재지정
			this.getApplyInfoRender(oController),                                   // 신청내역
			sap.ui.jsfragment("ZUI5_HR_Volunteer.fragment.ScheduleTable", oController),  // 행사일정
			sap.ui.jsfragment("ZUI5_HR_Volunteer.fragment.EmployeeTable", oController),  // 직원정보
			sap.ui.jsfragment("fragment.COMMON_ATTACH_PTI", oController),      		// 첨부파일
			sap.ui.jsfragment("fragment.ApplyLayout", oController),            		// 신청자 
			sap.ui.jsfragment("fragment.ApprovalInformationLayout", oController), 	// 결재내역
			sap.ui.jsfragment("fragment.Comments", oController)                		// 승인/반려
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
			}),
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
									text : oBundleText.getText("LABEL_0077")	// 77:생활안정자금 신청
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
									new sap.m.Button({text : oBundleText.getText("LABEL_0005"), // 결재자 지정
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
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2315"), 	// 2315:행사명 / 행사구분
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
							 new sap.m.ComboBox({
									width : "100%",
									selectedKey : "{Evecd}",
									change : oController.onChangeEvecd,
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "ZreqForm"}],
										formatter : function(fVal1, fVal2){
											if(fVal2 == "GA02") return false;  
											else if(fVal1 == "" || fVal1 == "10") return true;
											else return false;
										}
									},
									items : {
										path: "ZHR_VOLUNTEER_SRV>/EventListSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_VOLUNTEER_SRV>Evecd}",
											text: "{ZHR_VOLUNTEER_SRV>Evecdt}",
											customData : [new sap.ui.core.CustomData({ key : "Evept", value : "{ZHR_VOLUNTEER_SRV>Evept}"}), // 행사구분
												          new sap.ui.core.CustomData({ key : "Evepttx", value : "{ZHR_VOLUNTEER_SRV>Evepttx}"}), // 행사구분 명
												          new sap.ui.core.CustomData({ key : "Offno", value : "{ZHR_VOLUNTEER_SRV>Offno}"}), // 전화번호
												          new sap.ui.core.CustomData({ key : "Admin", value : "{ZHR_VOLUNTEER_SRV>Admin}"}), // 담당자
												          new sap.ui.core.CustomData({ key : "Eveot", value : "{ZHR_VOLUNTEER_SRV>Eveot}"}), // 행사목적
												          new sap.ui.core.CustomData({ key : "Welcd", value : "{ZHR_VOLUNTEER_SRV>Welcd}"}), // 봉사기관코드
												          new sap.ui.core.CustomData({ key : "Welcdt", value : "{ZHR_VOLUNTEER_SRV>Welcdt}"}), // 봉사기관텍스트
												          ]
										}),
										
									},
									
								}),
								new sap.m.Text({
								  text : "/",
								  textAlign : "Center"
							  }),
							  new sap.m.ToolbarSpacer({width : "5px"}),
							  new sap.m.Input({
								  width : "150px",
								  value : "{Evepttx}",
								  editable : false
							  }).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0049"),	// 49:신청일
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Reqdt}",
							    	width : "150px",
							    	editable : false,
								}).addStyleClass("FontFamily")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2316"),	// 2316:행사목적
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : [
							new sap.m.TextArea({
								width : "100%",
								value : "{Eveot}",
								rows : 2,
						    	editable : false,
								growing : true
							}).addStyleClass("FontFamily")
						],
						colSpan : 3
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2135")	// 2135:주관기관
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "30%",
									value : "{Welcd}",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "ZreqForm"}],
										formatter : function(fVal1, fVal2){
											if(fVal2 == "GA02") return false;  
											else if(fVal1 == "" || fVal1 == "10") return true;
											else return false;
										}
									},
									valueHelpOnly : true,
									showValueHelp : true,
									valueHelpRequest : oController.displayWelcdSearchDialog,
								}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({width : "10px"}),
								new sap.m.Input({
									value : "{Welcdt}",
									editable : false
								}).addStyleClass("FontFamily")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2342")	// 2342:활동봉사단
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "30%",
									value : "{Comcd}",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "ZreqForm"}],
										formatter : function(fVal1, fVal2){
											if(fVal2 == "GA02") return false;  
											else if(fVal1 == "" || fVal1 == "10") return true;
											else return false;
										}
									},
									valueHelpOnly : true,
									showValueHelp : true,
									valueHelpRequest : oController.displayComcdSearchDialog,
								}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({width : "10px"}), 
								new sap.m.Input({
									value : "{Comcdt}",
									editable : false
								}).addStyleClass("FontFamily")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1643"),	// 1643:담당자 / 연락처
							textAlign : "Center"
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "100%",
									value : "{Admin}",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "ZreqForm"}],
										formatter : function(fVal1, fVal2){
											if(fVal2 == "GA02") return false;  
											else if(fVal1 == "" || fVal1 == "10") return true;
											else return false;
										}
									},
								}).addStyleClass("FontFamily"),
								new sap.m.Text({text : "/", textAlign : "Center"}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({width : "5px"}),
								new sap.m.Input({
									value : "{Offno}",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "ZreqForm"}],
										formatter : function(fVal1, fVal2){
											if(fVal2 == "GA02") return false;  
											else if(fVal1 == "" || fVal1 == "10") return true;
											else return false;
										}
									},
								}).addStyleClass("FontFamily")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : {
								path : "ZreqForm",
								formatter : function(fVal){
									if(fVal == "GA01") return oBundleText.getText("LABEL_2322");	// 2322:행사장소 / 참여인원
									else return oBundleText.getText("LABEL_2321");	// 2321:행사장소
								}
							},
							textAlign : "Center"
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "100%",
									value : "{Evepe}",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "ZreqForm"}],
										formatter : function(fVal1, fVal2){
											if(fVal1 == "" || fVal1 == "10") return true;
											else return false;
										}
									},
									maxLength : common.Common.getODataPropertyLength("ZHR_VOLUNTEER_SRV", "VolunteerAppl", "Evepe"),
								}).addStyleClass("FontFamily"),
								new sap.m.Text({text : "/" , 
									textAlign : "Center",
									visible : {
										path : "ZreqForm",
										formatter : function(fVal){
											if(fVal == "GA01") return true;
											else return false;
										}
									},
								}).addStyleClass("FontFamily"),
								new sap.m.Input({
									value : "{Attcn}",
									width : "50px",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "ZreqForm"}],
										formatter : function(fVal1, fVal2){
											if(fVal1 == "" || fVal1 == "10") return true;
											else return false;
										}
									},
									type : sap.m.InputType.Number,
									liveChange : oController.setOnlyDigit,
									maxLength : common.Common.getODataPropertyLength("ZHR_VOLUNTEER_SRV", "VolunteerAppl", "Attcn"),
									visible : {
										path : "ZreqForm",
										formatter : function(fVal){
											if(fVal == "GA01") return true;
											else return false;
										}
									},
								}).addStyleClass("FontFamily")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2340"),	// 2340:활동계획
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : [ new sap.m.TextArea({
								width : "100%",
								value : "{Actpn}",
								rows : 2,
						    	editable : {
						    		parts : [ {path : "ZappStatAl"},{path : "ZreqForm"}],
									formatter : function(fVal1, fVal2){
										if(fVal2 == "GA02") return false;  
										else if(fVal1 == "" || fVal1 == "10") return true;
										else return false;
									}
								},
								maxLength : common.Common.getODataPropertyLength("ZHR_VOLUNTEER_SRV", "VolunteerAppl", "Actpn"),
								growing : true
							}).addStyleClass("FontFamily")
						],
						colSpan : 3
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2171")	// 2171:지원활동비
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "200px",
									value : "{Betrg}",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "ZreqForm"}],
										formatter : function(fVal1, fVal2){
											if(fVal1 == "" || fVal1 == "10") return true;
											else return false;
										}
									},
									liveChange : oController.convertMoneyFormat,
								}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({width: "5px"}),
								new sap.m.Input({
									value : "{Waers}",
									width : "100px",
									editable : false
								}).addStyleClass("FontFamily")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2169") 	// 2169:지원차량 (차종, 대수)
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "100%",
									selectedKey : "{Zcar1}",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "ZreqForm"}],
										formatter : function(fVal1, fVal2){
											if(fVal1 == "" || fVal1 == "10") return true;
											else return false;
										}
									},
									items : {
										path: "ZHR_VOLUNTEER_SRV>/CarCodeListSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_VOLUNTEER_SRV>Key}",
											text: "{ZHR_VOLUNTEER_SRV>Value}"
										})
									}
								}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({
									width : "5px"
								}),
								new sap.m.Input({
									value : "{Zcnt1}",
									width : "50px",
									type : sap.m.InputType.Number,
									liveChange : oController.setOnlyDigit,
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "ZreqForm"}],
										formatter : function(fVal1, fVal2){
											if(fVal1 == "" || fVal1 == "10") return true;
											else return false;
										}
									},
								}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({width: "15px"}),
								new sap.m.ComboBox({
									width : "100%",
									selectedKey : "{Zcar2}",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "ZreqForm"}],
										formatter : function(fVal1, fVal2){
											if(fVal1 == "" || fVal1 == "10") return true;
											else return false;
										}
									},
									items : {
										path: "ZHR_VOLUNTEER_SRV>/CarCodeListSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_VOLUNTEER_SRV>Key}",
											text: "{ZHR_VOLUNTEER_SRV>Value}"
										})
									}
								}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({
									width : "5px"
								}),
								new sap.m.Input({
									value : "{Zcnt2}",
									width : "50px",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "ZreqForm"}],
										formatter : function(fVal1, fVal2){
											if(fVal1 == "" || fVal1 == "10") return true;
											else return false;
										}
									},
								}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({width: "5px"}),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")]
				}),
				new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_TypeARow1",{
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : new sap.m.Label({
								text : oBundleText.getText("LABEL_2344"),	// 2344:활동비 사용계획
							}).addStyleClass("FontFamilyBold")
						}).addStyleClass("MatrixLabel"),
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : [
								new sap.m.TextArea({
									width : "100%",
									value : "{Atuse}",
									rows : 2,
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "ZreqForm"}],
										formatter : function(fVal1, fVal2){
											if(fVal2 == "GA02") return false;  
											else if(fVal1 == "" || fVal1 == "10") return true;
											else return false;
										}
									},
									growing : true,
									maxLength : common.Common.getODataPropertyLength("ZHR_VOLUNTEER_SRV", "VolunteerAppl", "Atuse"),
								}).addStyleClass("FontFamily")
							],
							colSpan : 3
						}).addStyleClass("MatrixData"),
					]
				}),
				new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_TypeARow2",{
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : new sap.m.Label({
								text : oBundleText.getText("LABEL_2170"),	// 2170:지원차량 사용계획
							}).addStyleClass("FontFamilyBold")
						}).addStyleClass("MatrixLabel"),
						new sap.ui.commons.layout.MatrixLayoutCell({
							content :new sap.m.TextArea({
										width : "100%",
										value : "{Scuse}",
										rows : 2,
								    	editable : {
								    		parts : [ {path : "ZappStatAl"},{path : "ZreqForm"}],
											formatter : function(fVal1, fVal2){
												if(fVal2 == "GA02") return false;  
												else if(fVal1 == "" || fVal1 == "10") return true;
												else return false;
											}
										},
										growing : true,
										maxLength : common.Common.getODataPropertyLength("ZHR_VOLUNTEER_SRV", "VolunteerAppl", "Scuse"),
									}).addStyleClass("FontFamily"),
							colSpan : 3
						}).addStyleClass("MatrixData"),
					]
				}),
				
				new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_TypeBRow1",{
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : new sap.m.Label({
								text : oBundleText.getText("LABEL_2341"),	// 2341:활동내용
							}).addStyleClass("FontFamilyBold")
						}).addStyleClass("MatrixLabel"),
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : [
								new sap.m.TextArea({
									width : "100%",
									value : "{Actin}",
									rows : 2,
							    	editable : {
							    		parts : [ {path : "ZappStatAl"}],
										formatter : function(fVal1){
											if(fVal1 == "" || fVal1 == "10") return true;
											else return false;
										}
									},
									growing : true,
									maxLength : common.Common.getODataPropertyLength("ZHR_VOLUNTEER_SRV", "VolunteerAppl", "Actin"),
								}).addStyleClass("FontFamily")
							],
							colSpan : 3
						}).addStyleClass("MatrixData"),
					]
				}),
				new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_TypeBRow2",{
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : new sap.m.Label({
								text : oBundleText.getText("LABEL_1451"),	// 1451:간사평가
							}).addStyleClass("FontFamilyBold")
						}).addStyleClass("MatrixLabel"),
						new sap.ui.commons.layout.MatrixLayoutCell({
							content :new sap.m.TextArea({
										width : "100%",
										value : "{Evart}",
										rows : 2,
								    	editable : {
								    		parts : [ {path : "ZappStatAl"}],
											formatter : function(fVal1){
												if(fVal1 == "" || fVal1 == "10") return true;
												else return false;
											}
										},
										maxLength : common.Common.getODataPropertyLength("ZHR_VOLUNTEER_SRV", "VolunteerAppl", "Evart"),
										growing : true
									}).addStyleClass("FontFamily"),
							colSpan : 3
						}).addStyleClass("MatrixData"),
					]
				}),
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
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 
				new sap.ui.commons.layout.MatrixLayout({
					columns : 4,
					widths : ['20%', '30%', '20%', '30%'],
					rows : aRows
				})
			]
		});
	}
});