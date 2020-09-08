sap.ui.jsfragment("ZUI5_HR_SmockReg.fragment.SmockRegDetail", {
	
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
			this.getApplyInfoRender(oController)									// 신청내역
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : ["20px","","20px"],
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
								new sap.m.Text(oController.PAGEID + "_DetailTitle", {text : oBundleText.getText("LABEL_0172") }).addStyleClass("Font18px FontColor0"),	// 172:방염 작업복 사이즈 등록관리
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
										visible : {
											path : "FromPage",
											formatter : function(fVal) {
												return (fVal) ? true : false;
											}
										}
									}),
									new sap.m.Button({
										text : oBundleText.getText("LABEL_0177"), // 177:저장
										press : oController.onPressSave,
										visible : true
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
	 * 사이즈정보 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getApplyInfoRender : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 상의 측정지수 (인치)
					new sap.ui.commons.layout.MatrixLayoutCell({
						rowSpan : 7,
						content : new sap.m.Text({
							text : oBundleText.getText("LABEL_0174")	// 174:상의\n측정지수\n(인치)
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					// 어깨
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0176")	// 176:어깨
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Input({
									width : "60px",
									value : "{Shldr}",
									change : oController.limit3NumberLength,
									editable : {
										parts : [{path : "Pernr"}],
										formatter : function(fVal1) {
											return (fVal1) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 신장/체중
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 2,
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0175")	// 175:신장/체중
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "80px",
									value : "{Height}",
									liveChange : oController.limitForWHeight,
									editable : {
										parts : [{path : "Pernr"}],
										formatter : function(fVal1) {
											return (fVal1) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : "Cm / "
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									width : "60px",
									value : "{Weight}",
									liveChange : oController.limitForWHeight,
									editable : {
										parts : [{path : "Pernr"}],
										formatter : function(fVal1) {
											return (fVal1) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : "Kg"
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 팔길이
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0178")	// 178:팔길이
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Input({
									width : "60px",
									value : "{Arm}",
									change : oController.limit3NumberLength,
									editable : {
										parts : [{path : "Pernr"}],
										formatter : function(fVal1) {
											return (fVal1) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 하복 선호스타일
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 2,
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0179")	// 179:하복 선호스타일
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox(oController.PAGEID + "_Stylsm", {
									width : "45%",
									editable : {
										parts : [{path : "Pernr"}],
										formatter : function(fVal1) {
											return (fVal1) ? true : false;
										}
									},
									selectedKey : "{Stylsm}",
									items : {
										path: "ZHR_BSUIT_SRV>/StyleCodeSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_BSUIT_SRV>Code}",
											text: "{ZHR_BSUIT_SRV>Text}"
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
					// 등기장
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0171")	// 171:등기장
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Input({
									width : "60px",
									value : "{Backl}",
									change : oController.limit3NumberLength,
									editable : {
										parts : [{path : "Pernr"}],
										formatter : function(fVal1) {
											return (fVal1) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 고리부착(O/X)
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 2,
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0169")	// 169:고리부착(O/X)
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox(oController.PAGEID + "_Ringck", {
									width : "45%",
									editable : {
										parts : [{path : "Pernr"}],
										formatter : function(fVal1) {
											return (fVal1) ? true : false;
										}
									},
									selectedKey : "{Ringck}",
									items : {
										path: "ZHR_BSUIT_SRV>/RingCodeSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_BSUIT_SRV>Code}",
											text: "{ZHR_BSUIT_SRV>Text}"
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
					// 가슴둘레
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0168")	// 168:가슴둘레
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Input({
									width : "60px",
									value : "{Bust}",
									change : oController.limit3NumberLength,
									editable : {
										parts : [{path : "Pernr"}],
										formatter : function(fVal1) {
											return (fVal1) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 하의 측정지수 (인치)
					new sap.ui.commons.layout.MatrixLayoutCell({
						rowSpan : 3,
						content : new sap.m.Text({
							text : oBundleText.getText("LABEL_0180")	// 180:하의\n측정지수\n(인치)
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					// 허리
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0181")	// 181:허리
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "60px",
									value : "{Waist}",
									change : oController.limit3NumberLength,
									editable : {
										parts : [{path : "Pernr"}],
										formatter : function(fVal1) {
											return (fVal1) ? true : false;
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
					// 하계(호수)
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2916")	// 2916:하계(호수)
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.ComboBox(oController.PAGEID + "_Suitsm", {
									width : "45%",
									selectedKey : "{Suitsm}",
									editable : {
										parts : [{path : "Pernr"}],
										formatter : function(fVal1) {
											return (fVal1) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 힙
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0182")	// 182:힙
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "60px",
									value : "{Hip}",
									change : oController.limit3NumberLength,
									editable : {
										parts : [{path : "Pernr"}],
										formatter : function(fVal1) {
											return (fVal1) ? true : false;
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
					// 동계(호수)
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2917")	// 2917:동계(호수)
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.ComboBox(oController.PAGEID + "_Suitwr", {
									width : "45%",
									selectedKey : "{Suitwr}",
									editable : {
										parts : [{path : "Pernr"}],
										formatter : function(fVal1) {
											return (fVal1) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// 기장
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0170")	// 170:기장
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									width : "60px",
									value : "{Cline}",
									change : oController.limit3NumberLength,
									editable : {
										parts : [{path : "Pernr"}],
										formatter : function(fVal1) {
											return (fVal1) ? true : false;
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
					// 방한복
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2918")	// 2918:방한복
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.ComboBox(oController.PAGEID + "_Jmprwr", {
									width : "45%",
									selectedKey : "{Jmprwr}",
									editable : {
										parts : [{path : "Pernr"}],
										formatter : function(fVal1) {
											return (fVal1) ? true : false;
										}
									},
									items : {
										path: "ZHR_BSUIT_SRV>/JmprWrCodeSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_BSUIT_SRV>Code}",
											text: "{ZHR_BSUIT_SRV>Text}"
										})
									}
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					// Blank
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 2,
						content : new sap.m.Text({
							text : ""
						}).addStyleClass("Font14px FontColor3")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Text({
									text : ""
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// (특별체형/맞춤)기록
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 2,
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0167")	// 167:(특별체형/맞춤)기록
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 4,
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Input({
									width : "100%",
									value : "{Clfit}",
									maxLength : common.Common.getODataPropertyLength("ZHR_BSUIT_SRV", "BsuitSizeRegist", "Clfit"),
									editable : {
										parts : [{path : "Pernr"}],
										formatter : function(fVal1) {
											return (fVal1) ? true : false;
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
							text : oBundleText.getText("LABEL_0172")	// 172:방염 작업복 사이즈 등록관리
						}).addStyleClass("MiddleTitle")
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
				new sap.ui.commons.layout.MatrixLayout({
					columns : 6,
					widths : ['10%', '10%', '30%', '10%', '10%', '30%'],
					rows : aRows
				})
			]
		});
	}
});