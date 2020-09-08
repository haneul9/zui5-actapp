sap.ui.jsfragment("ZUI5_HR_Smock.fragment.SmockPage02", {
	
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
			this.getSizeInfoRender(oController)										// 사이즈정보
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
								new sap.m.Text(oController.PAGEID + "_DetailTitle", {text : oBundleText.getText("LABEL_0194") }).addStyleClass("Font18px FontColor0"),	// 194:방염 작업복 신청
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
							text : oBundleText.getText("LABEL_0208"), 	// 208:신청일자
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.DatePicker(oController.PAGEID + "_Apdat", {
									valueFormat : "yyyy-MM-dd",
									displayFormat : "yyyy.MM.dd",
									value : "{Apdat}",
									width : "150px",
									editable : false
								}).addStyleClass("Font14px FontColor3")
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0080"), 	// 80:신청구분
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox(oController.PAGEID + "_Sgubn", {
									width : "45%",
									editable : false,
									selectedKey : "{Sgubn}",
									items : {
										path: "ZHR_BSUIT_SRV>/SgubnCodeSet",
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
					new sap.ui.commons.layout.MatrixLayoutCell({
						rowSpan : 2,
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0210"),	// 210:신청항목
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0189"),	// 189:동복상의
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ComboBox(oController.PAGEID + "_Suitwr", {
									width : "10%",
									selectedKey : "{Suitwr}",
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									},
									editable : {
										parts : [{path : "Sstat"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((!fVal1 || fVal1 == '1') && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ToolbarSpacer({
									width: "10px",
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									}
								}),
								new sap.m.Text({
									text : " " + oBundleText.getText("LABEL_0191"),	// 191:동복하의(허리
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									width : "5%",
									value : "{SuitwrW}",
									change : oController.limit3NumberLength,
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									},
									editable : {
										parts : [{path : "Sstat"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((!fVal1 || fVal1 == '1') && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : " " + oBundleText.getText("LABEL_0182"),	// 182:힙
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									width : "5%",
									value : "{SuitwrH}",
									change : oController.limit3NumberLength,
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									},
									editable : {
										parts : [{path : "Sstat"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((!fVal1 || fVal1 == '1') && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : " " + oBundleText.getText("LABEL_0170"),	// 170:기장
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									width : "5%",
									value : "{SuitwrL}",
									change : oController.limit3NumberLength,
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									},
									editable : {
										parts : [{path : "Sstat"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((!fVal1 || fVal1 == '1') && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : ")",
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ToolbarSpacer({
									width: "10px",
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									}
								}),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0183"),	// 183:고리부착
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ComboBox(oController.PAGEID + "_Ringck", {
									width : "10%",
									selectedKey : "{Ringck}",
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									},
									editable : {
										parts : [{path : "Sstat"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((!fVal1 || fVal1 == '1') && fVal2) ? true : false;
										}
									},
									items : {
										path: "ZHR_BSUIT_SRV>/RingCodeSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_BSUIT_SRV>Code}",
											text: "{ZHR_BSUIT_SRV>Text}"
										})
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ToolbarSpacer({
									width: "14px",
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "20") ? true : false;
										}
									}
								}),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0214"),	// 214:하복상의
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "20") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ComboBox(oController.PAGEID + "_Suitsm", {
									width : "10%",
									selectedKey : "{Suitsm}",
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "20") ? true : false;
										}
									},
									editable : {
										parts : [{path : "Sstat"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((!fVal1 || fVal1 == '1') && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ToolbarSpacer({
									width: "10px",
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "20") ? true : false;
										}
									}
								}),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0217"),	// 217:하복하의(허리
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "20") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									width : "60px",
									value : "{SuitsmW}",
									change : oController.limit3NumberLength,
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "20") ? true : false;
										}
									},
									editable : {
										parts : [{path : "Sstat"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((!fVal1 || fVal1 == '1') && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : " " + oBundleText.getText("LABEL_0182"),	// 182:힙
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "20") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									width : "60px",
									value : "{SuitsmH}",
									change : oController.limit3NumberLength,
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "20") ? true : false;
										}
									},
									editable : {
										parts : [{path : "Sstat"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((!fVal1 || fVal1 == '1') && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : " " + oBundleText.getText("LABEL_0170"),	// 170:기장
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "20") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									width : "60px",
									value : "{SuitsmL}",
									change : oController.limit3NumberLength,
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "20") ? true : false;
										}
									},
									editable : {
										parts : [{path : "Sstat"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((!fVal1 || fVal1 == '1') && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : ")",
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "20") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ToolbarSpacer({width : "20px"}),
								new sap.ui.core.Icon({
									size : "15px",
									src : "sap-icon://delete",
									press : oController.onResetUpperLine,
									visible : {
										parts : [{path : "Sstat"}, {path : "Sgubn"}],
										formatter : function(fVal1, fVal2) {
											return ((!fVal1 || fVal1 == '1') && (fVal2 == "10")) ? true : false;
										}
									}
								})
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0195"),	// 195:방한점퍼
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ComboBox(oController.PAGEID + "_Jmprwr", {
									width : "10%",
									selectedKey : "{Jmprwr}",
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									},
									editable : {
										parts : [{path : "Sstat"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((!fVal1 || fVal1 == '1') && fVal2) ? true : false;
										}
									},
									items : {
										path: "ZHR_BSUIT_SRV>/JmprWrCodeSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_BSUIT_SRV>Code}",
											text: "{ZHR_BSUIT_SRV>Text}"
										})
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ToolbarSpacer({
									width: "25px",
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									}
								}),
								new sap.m.Text({
									text : " " + oBundleText.getText("LABEL_0202"),	// 202:솜바지(허리
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									width : "5%",
									value : "{PantwrW}",
									change : oController.limit3NumberLength,
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									},
									editable : {
										parts : [{path : "Sstat"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((!fVal1 || fVal1 == '1') && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : " " + oBundleText.getText("LABEL_0182"),	// 182:힙
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									width : "5%",
									value : "{PantwrH}",
									change : oController.limit3NumberLength,
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									},
									editable : {
										parts : [{path : "Sstat"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((!fVal1 || fVal1 == '1') && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : " " + oBundleText.getText("LABEL_0170"),	// 170:기장
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									width : "5%",
									value : "{PantwrL}",
									change : oController.limit3NumberLength,
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									},
									editable : {
										parts : [{path : "Sstat"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((!fVal1 || fVal1 == '1') && fVal2) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : ")",
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "10") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0199"),	// 199:선호스타일
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "20") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ComboBox(oController.PAGEID + "_Stylsm", {
									width : "10%",
									selectedKey : "{Stylsm}",
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "20") ? true : false;
										}
									},
									editable : {
										parts : [{path : "Sstat"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((!fVal1 || fVal1 == '1') && fVal2) ? true : false;
										}
									},
									items : {
										path: "ZHR_BSUIT_SRV>/StyleCodeSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_BSUIT_SRV>Code}",
											text: "{ZHR_BSUIT_SRV>Text}"
										})
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ToolbarSpacer({
									width: "10px",
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "20") ? true : false;
										}
									}
								}),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_0183"),	// 183:고리부착
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "20") ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ComboBox(oController.PAGEID + "_Ringck2", {
									width : "10%",
									selectedKey : "{Ringck}",
									visible : {
										path : "Sgubn",
										formatter : function(fVal) {
											return (fVal == "20") ? true : false;
										}
									},
									editable : {
										parts : [{path : "Sstat"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((!fVal1 || fVal1 == '1') && fVal2) ? true : false;
										}
									},
									items : {
										path: "ZHR_BSUIT_SRV>/RingCodeSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_BSUIT_SRV>Code}",
											text: "{ZHR_BSUIT_SRV>Text}"
										})
									}
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.ToolbarSpacer({width : "238px"}),
								new sap.ui.core.Icon({
									size : "15px",
									src : "sap-icon://delete",
									press : oController.onResetDownLine,
									visible : {
										parts : [{path : "Sstat"}, {path : "Sgubn"}],
										formatter : function(fVal1, fVal2) {
											return ((!fVal1 || fVal1 == '1') && (fVal2 == "10")) ? true : false;
										}
									}
								})
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
					rows : aRows
				})
				.setModel(oController._DetailJSonModel)
				.bindElement("/Data")
			]
		});
	},
	
	/**
	 * 사이즈정보 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getSizeInfoRender : function(oController) {
		
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
									editable : false
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
									editable : false
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Text({
									text : "Cm / "
								}).addStyleClass("Font14px FontColor3"),
								new sap.m.Input({
									width : "60px",
									value : "{Weight}",
									editable : false
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
									editable : false
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
								new sap.m.ComboBox(oController.PAGEID + "_Stylsm2", {
									width : "45%",
									editable : false,
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
									editable : false
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
								new sap.m.ComboBox(oController.PAGEID + "_Ringck3", {
									width : "45%",
									editable : false,
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
									editable : false
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
					// 하계(호수)
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2916")	// 2916:하계(호수)
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "45%",
									editable : false,
									selectedKey : "{Suitsm}",
									items : {
										path: "ZHR_BSUIT_SRV>/SuitSmCodeSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_BSUIT_SRV>Code}",
											text: "{ZHR_BSUIT_SRV>Text}"
										})
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
					// 동계(호수)
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2917")	// 2917:동계(호수)
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "45%",
									editable : false,
									selectedKey : "{Suitwr}",
									items : {
										path: "ZHR_BSUIT_SRV>/SuitWrCodeSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_BSUIT_SRV>Code}",
											text: "{ZHR_BSUIT_SRV>Text}"
										})
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
					// 방한복
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2918")	// 2918:방한복
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "45%",
									editable : false,
									selectedKey : "{Jmprwr}",
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
									width : "95%",
									value : "{Clfit}",
									editable : false
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
							text : oBundleText.getText("LABEL_0197") 	// 197:사이즈 정보
						}).addStyleClass("MiddleTitle"),
						new sap.m.ToolbarSpacer(),
						new sap.m.Button({
							text : oBundleText.getText("LABEL_0198"),	// 198:사이즈변경
							type : sap.m.ButtonType.Ghost,
							press : oController.onPressSizeChange,
						})
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
				new sap.ui.commons.layout.MatrixLayout({
					columns : 6,
					widths : ['10%', '10%', '30%', '10%', '10%', '30%'],
					rows : aRows
				})
				.setModel(oController._SizeJSonModel)
				.bindElement("/Data")
			]
		});
	}
});