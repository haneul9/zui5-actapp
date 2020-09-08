sap.ui.jsfragment("ZUI5_HR_VacationRequestEN.fragment.VacationRequestPage02", {
	
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
			this.getTitleRender(oController),	
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
								new sap.m.Text(oController.PAGEID + "_DetailTitle").addStyleClass("Font18px FontColor0"),	
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
									new sap.m.Button({
										text : oBundleText.getText("LABEL_0005"), 
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
						}).addStyleClass("ToolbarNoBottomLine")
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
							text : "Period",
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Vcbeg}",
							    	width : "150px",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
							    	change : function(event){
							    		oController._DetailJSonModel.setProperty("/Data/Vcend", event.getSource().getValue());
							    		oController.onChangeDate()
							    	}
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.Text({text : "~" , textAlign : "Center"}).addStyleClass("Font14px FontColor6"),
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Vcend}",
							    	width : "150px",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
							    	change : oController.onChangeDate
								}).addStyleClass("Font14px FontColor6"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : "Leave type",
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
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
									change : oController.onChangeAptyp,
									visible : {
										path : "ZappStatAl",
										formatter : function(fVal){
											if(fVal == "" || fVal == "10") return true;
											else return false;
										}
									}
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.Text({
									editable : false,
									text : "{Aptxt}",
									visible : {
										path : "ZappStatAl",
										formatter : function(fVal){
											if(fVal != "" && fVal != "10") return true;
											else return false;
										}
									}
								}).addStyleClass("Font14px FontColor6"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 적용일수
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : "No. of used days", 
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Text({
									text : "{Useday}",
								}).addStyleClass("Font14px FontColor6")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 비고
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : "Remark", 
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Zbigo}",
									width : "100%",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									maxLength : common.Common.getODataPropertyLength("ZHR_LEAVEAPPL_SRV", "LeaveAppList", "Zbigo"),
								}).addStyleClass("Font14px FontColor6"),
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
//					height : "30px",
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
//							text : oBundleText.getText("LABEL_2359") 	// 47:신청내역
							text : "Leave Request"
						}).addStyleClass("MiddleTitle"),
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),
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