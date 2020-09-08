sap.ui.jsfragment("ZUI5_HR_VacationDispatch.fragment.VacationDispatchPage02", {
	
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
			sap.ui.jsfragment("fragment.COMMON_ATTACH_PTI", oController),			// 첨부
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
									text : oBundleText.getText("LABEL_2293")	// 2293:파견직 근태 신청
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
					// 기간
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1204"),	// 1204:기간
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Begda}",
							    	width : "150px",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
							    	change : oController.onChangeDate
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({text : "~" , textAlign : "Center"}).addStyleClass("Font14px FontColor3"),
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Endda}",
							    	width : "150px",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
							    	change : oController.onChangeDate
								}).addStyleClass("Font14px FontColor3"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0578"),	// 578:근태유형
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "100%",
									selectedKey : "{Aptyp}",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									items : {
										path: "ZHR_LEAVEAPPL_SRV>/AptypCodeListSet",
										filters : [
											{sPath : 'ZreqForm', sOperator : 'EQ', oValue1 : oController._vZworktyp}
										],
										template: new sap.ui.core.ListItem({
											key: "{ZHR_LEAVEAPPL_SRV>Aptyp}",
											text: "{ZHR_LEAVEAPPL_SRV>Aptxt}",
											customData : [new sap.ui.core.CustomData({ key : "Awart", value : "{ZHR_LEAVEAPPL_SRV>Awart}"})], // 근무/휴무 유형      
										})
									},
									change : oController.onChangeAptyp
								}).addStyleClass("Font14px FontColor3"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ChildBirthRow",{
				height : "30px",
				cells : [
					// 배우자 출산휴가 횟수
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1741"),	// 1741:배우자 출산휴가 횟수
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.RadioButtonGroup({
									columns : 2,
									buttons : [new sap.m.RadioButton({text: oBundleText.getText("LABEL_2232")}).addStyleClass("L2PFontFamily"), 	// 2232:최초
									           new sap.m.RadioButton({text: oBundleText.getText("LABEL_1416")}).addStyleClass("L2PFontFamily")],	// 1416:2회차 분할사용
						            selectedIndex : "{MatleavCnt}",
						            editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											if(fVal1 == "" || fVal1 == "10" && fVal2) return true;
											else return false;
										}
									},
									select : oController.onCheckBabduda
//									select : function(oEvent){
//										oController._DetailJSonModel.setProperty("/Data/MatleavCnt", "" + oEvent.getParameters().selectedIndex );
//									}
							   }).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2235"),	// 2235:출산일
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Babduda}",
							    	width : "150px",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "MatleavCnt"}],
										formatter : function(fVal1, fVal2, fVal3){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && fVal3 == 0 ) ? true : false;
										}
									},
							    	change : oController.onCheckBabduda
								}).addStyleClass("Font14px FontColor3"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 구분
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0006"), 
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Text({ 
									text : "{Ttext}",
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 사용가능일수
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1824"), 	// 1824:사용가능일수
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Text({
									text : "{Posday}",
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 적용일수
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2099"), 	// 2099:적용일수
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Text({
									text : "{Useday}",
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 사용 후 잔여일수
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1823"), 	// 1823:사용 후 잔여일수
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Text({
									text : "{Balday}",
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// MRD
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : "", 
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
//								new sap.m.CheckBox({
//									selected : "{Mrdchk}",
//									editable : {
//										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Awart"}, {path : "CredayYea"}],
//										formatter : function(fVal1, fVal2, fVal3, fVal4) {
//											if((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)){
//												if(fVal3 == "1010" || fVal3 == "1020" || fVal3 == "1030" || fVal4 * 1 > 0 ) return true;
//											}
//											return false;
//										}
//									}
//								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 신청사유
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0323"), 	// 323:신청사유
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Reasn}",
									width : "100%",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									maxLength : common.Common.getODataPropertyLength("ZHR_LEAVEAPPL_SRV", "DispatchLeaveDetail", "Reasn"),
								}).addStyleClass("Font14px FontColor3"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 집중휴가중 직무인수인
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0762")	// 762:집중휴가중 직무인수인
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Takper}",
									width : "300px",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									maxLength : common.Common.getODataPropertyLength("ZHR_LEAVEAPPL_SRV", "DispatchLeaveDetail", "Takper"),
								}).addStyleClass("Font14px FontColor3"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
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
							text : oBundleText.getText("LABEL_1572") 	// 1572:근태신청
						}).addStyleClass("MiddleTitle"),
						new sap.m.ToolbarSpacer({}),
						new sap.m.Button({
							text : oBundleText.getText("LABEL_0006"),	// 6:근무일정
							type : "Ghost",
							press : oController.onCheckWorkSchedule
						})
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"), 
				new sap.ui.commons.layout.MatrixLayout({
					columns : 4,
					widths : ['20%', '30%', '20%', '30%'],
					rows : aRows
				}).setModel(oController._DetailJSonModel)
				.bindElement("/Data")
			]
		});
	},
});