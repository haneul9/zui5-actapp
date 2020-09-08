sap.ui.jsfragment("ZUI5_HR_Resignation.fragment.ResignationPage02", {
	
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
			this.getApplyInfoRender(oController),									// 사직 신청 내용
			sap.ui.jsfragment("fragment.ApplyLayout", oController),					// 신청자 
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
									text : oBundleText.getText("LABEL_0375")	// 375:사직 신청
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
												return (fVal == "10" || fVal == "11") ? true : false;
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
										press : oController.onPressCancel,
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
							width : "150px",
							editable : {
								parts : [{path : "Zrest"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									return (fVal1 == "" || fVal1 == "10") && fVal2 ? true : false;
								}
							}
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
							width : "100%",
							maxLength : common.Common.getODataPropertyLength("ZHR_ACTION_SRV", "RetireApply", "Reason"),
							rows : 5,
							growing : true,
							maxLength : 255,
							editable : {
								parts : [{path : "Zrest"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									return (fVal1 == "" || fVal1 == "10") && fVal2 ? true : false;
								}
							}
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
							width : "100%",
							value : "{Zzjob}",
							maxLength : common.Common.getODataPropertyLength("ZHR_ACTION_SRV", "RetireApply", "Zzjob"),
							editable : {
								parts : [{path : "Zrest"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									return (fVal1 == "" || fVal1 == "10") && fVal2 ? true : false;
								}
							}
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
							width : "150px",
							value : "{Mgrnm}",
							showValueHelp: true,
							valueHelpOnly: true,
							valueHelpRequest: oController.onInterviewerChange,
							editable : {
								parts : [{path : "Zrest"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									return (fVal1 == "" || fVal1 == "10") && fVal2 ? true : false;
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
							text : oBundleText.getText("LABEL_0376")	// 376:사직 신청 내용
						}).addStyleClass("MiddleTitle")
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"), 
				new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_ApplyMatrix", {
					columns : 4,
					widths : ['20%', '30%', '20%', '30%'],
					rows : aFirstMatrixRows
				})
			]
		});
	}
});