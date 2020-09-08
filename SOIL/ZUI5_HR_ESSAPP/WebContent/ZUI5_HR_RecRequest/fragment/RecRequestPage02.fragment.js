sap.ui.jsfragment("ZUI5_HR_RecRequest.fragment.RecRequestPage02", {
	
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
			this.getTargetInfoRender(oController),
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
	
	getTargetInfoRender : function(oController){
		var oRow, oCell;
		// 대상자
		var oTargetMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_TargetMatrix",{
			columns : 6,
			widths : ['10%','23.3%','10%','23.3%','10%','23.3%']
		});
		
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_0003")}).addStyleClass("FontFamilyBold")	// 결재선
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 5,
					content : new sap.m.Toolbar({
						content : [new sap.m.Text({text : "{ApprEnames}"}).addStyleClass("FontFamily")]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData")
				.setModel(oController._DetailJSonModel).bindElement("/Data")
			]
		});
		
		oTargetMatrix.addRow(oRow);
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [new sap.m.Toolbar({
							height : "30px",
							design : sap.m.ToolbarDesign.Auto,
							content : [
								new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
							    new sap.m.ToolbarSpacer({width: "5px"}),
						        new sap.m.Text({text : oBundleText.getText("LABEL_1018") }).addStyleClass("MiddleTitle")]	// 1018:결재정보
						}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 
						oTargetMatrix ]
		}).setModel(oController._TargetJSonModel)
		.bindElement("/Data");
	},
	
	/**
	 * 신청내역 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getApplyInfoRender : function(oController) {
		var oRow, oCell;
	
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 6,
			widths : ['10%','23.3%','10%','23.3%','10%','23.3%']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1551"),	// 1551:근무부서
						required : true,
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input(oController.PAGEID + "_Zorgeh",{
							    value : "{Zorgtx}",
							    editable : {
									parts : [{path : "ZappStatAl"}],
									formatter : function(fVal1){
										if((fVal1 == "" || fVal1 == "10")) return true;
										else return false;
									}
								},
								valueHelpOnly : true,
								showValueHelp : true,
								valueHelpRequest : oController.displayOrgSearchDialog,
								width : "100%"
							}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_2249"), 	// 2249:충원인원
						required : true
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
							    value : "{Recno}",
							    editable : {
									parts : [{path : "ZappStatAl"}],
									formatter : function(fVal1, fVal2){
										if((fVal1 == "" || fVal1 == "10")) return true;
										else return false;
									}
								},
								type : "Number",
								width : "100%"
							}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1497"), 	// 1497:고용형태
						required : true
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content :  new sap.m.ComboBox({
						editable : {
							parts : [{path : "ZappStatAl"}],
							formatter : function(fVal1){
								if((fVal1 == "" || fVal1 == "10")) return true;
								else return false;
							}
						},
						items : {
			            	path: "ZHR_ACTION_SRV>/ZpersgCodeSet",
			            	template: new sap.ui.core.ListItem({
			            		key: "{ZHR_ACTION_SRV>Code}",
			            		text: "{ZHR_ACTION_SRV>Text}"
			            	})
			            },
			            selectedKey: "{Zpersg}",
						width : "100%",
					}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixData"),
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0557"),	// 557:근무지역
						required : true,
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
							    value : "{Zzwork}",
							    editable : {
									parts : [{path : "ZappStatAl"}],
									formatter : function(fVal1){
										if((fVal1 == "" || fVal1 == "10")) return true;
										else return false;
									}
								},
								width : "100%"
							}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1991"), 	// 1991:요청 근무기간
						required : true
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
							    value : "{Wkped}",
							    editable : {
									parts : [{path : "ZappStatAl"}],
									formatter : function(fVal1){
										if((fVal1 == "" || fVal1 == "10")) return true;
										else return false;
									}
								},
								width : "100%"
							}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_2187")	// 2187:직위/직급
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
					    value : "{Title}",
					    editable : {
							parts : [{path : "ZappStatAl"}],
							formatter : function(fVal1){
								if((fVal1 == "" || fVal1 == "10")) return true;
								else return false;
							}
						},
//						placeholder : "직위 /직급 입력",
						width : "100%"
					}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixData"),
			]
		});
		oApplyInfoMatrix.addRow(oRow);
			
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1927"),	// 1927:어학수준
						required : true,
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
							    value : "{Zlang}",
							    editable : {
									parts : [{path : "ZappStatAl"}],
									formatter : function(fVal1){
										if((fVal1 == "" || fVal1 == "10")) return true;
										else return false;
									}
								},
								width : "100%"
							}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_2304"), 	// 2304:학력수준
						required : true
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
							    value : "{Edulv}",
							    editable : {
									parts : [{path : "ZappStatAl"}],
									formatter : function(fVal1){
										if((fVal1 == "" || fVal1 == "10")) return true;
										else return false;
									}
								},
								width : "100%"
							}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_2102")	// 2102:전공분야
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
					    value : "{Major}",
					    editable : {
							parts : [{path : "ZappStatAl"}],
							formatter : function(fVal1){
								if((fVal1 == "" || fVal1 == "10")) return true;
								else return false;
							}
						},
						width : "100%"
					}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixData"),
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
//			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_2247"),	// 2247:충원요청 근거
						required : true,
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.TextArea({
						width : "100%",
						value : "{Recrn}",
						rows : 3,
						editable : {
								parts : [{path : "ZappStatAl"}],
								formatter : function(fVal1){
									if((fVal1 == "" || fVal1 == "10")) return true;
									else return false;
								}
							},
					    growing : true
					}).addStyleClass("FontFamily"),
					colSpan : 5
				}).addStyleClass("MatrixData")
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
//			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_2179"),	// 2179:직무 내용
						required : true,
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.TextArea({
						width : "100%",
						value : "{Jobde}",
						rows : 3,
						editable : {
								parts : [{path : "ZappStatAl"}],
								formatter : function(fVal1){
									if((fVal1 == "" || fVal1 == "10")) return true;
									else return false;
								}
							},
						growing : true
					}).addStyleClass("FontFamily"),
					colSpan : 5
				}).addStyleClass("MatrixData"),
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
//			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_2300"),	// 2300:필요 경력\n(내용/경력년수/자격 등)
						required : true,
						wrapping : true,
						wrappingType : sap.m.WrappingType.Hyphenated
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.TextArea({
						width : "100%",
						value : "{Reqex}",
						rows : 3,
						editable : {
								parts : [{path : "ZappStatAl"}],
								formatter : function(fVal1){
									if((fVal1 == "" || fVal1 == "10")) return true;
									else return false;
								}
							},
					    growing : true
					}).addStyleClass("FontFamily"),
					colSpan : 5
				}).addStyleClass("MatrixData"),
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1556"),	// 1556:근무시작일
						required : true,
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.DatePicker({
						valueFormat : "yyyy-MM-dd",
			            displayFormat : "yyyy.MM.dd",
			            value : "{Wkbeg}",
						width : "150px",
						editable : {
							parts : [{path : "ZappStatAl"}],
							formatter : function(fVal1){
								if((fVal1 == "" || fVal1 == "10")) return true;
								else return false;
							}
						},
					}).addStyleClass("FontFamily"),
					colSpan : 5
				}).addStyleClass("MatrixData"),
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.ToolbarSpacer({width: "5px"}),
					new sap.m.Text({text : oBundleText.getText("LABEL_2036")}).addStyleClass("MiddleTitle"),	// 2036:인원 충원 신청 내용
				]}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),
				oApplyInfoMatrix
			]
		});
	},
});