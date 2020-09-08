sap.ui.jsfragment("ZUI5_HR_ConGoods.fragment.ConGoodsPage02", {
	
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
			sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController),			// 첨부
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
		var oRow, oCell;
		
		// 신청내역
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1183") , required : true}).addStyleClass("FontFamilyBold"),	// 1183:경조유형
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [ new sap.m.ComboBox(oController.PAGEID + "_Concode",{
					width : "200px" ,
					change : oController.onChangeConcode,
					editable : {
						path : "ZappStatAl",
						formatter : function(fVal){
							if(fVal == "" || fVal == "10") return true;
							else return false;
						}
					},
					selectedKey : "{Concode}"
				})]
			}).addStyleClass("ToolbarNoBottomLine")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1352"), required : true}).addStyleClass("FontFamilyBold"),	// 1352:관계 / 대상자
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [ new sap.m.ComboBox(oController.PAGEID + "_Conresn",{
								selectedKey : "{Conresn}",
								editable : {
									path : "ZappStatAl",
									formatter : function(fVal){
										if(fVal == "" || fVal == "10") return true;
										else return false;
									}
								},
							    width : "200px",
							    change : oController.onChangeConresn,
							}),
							new sap.m.Text({
								text : "/",
								textAlign : "Center"
							}).addStyleClass("FontFamily"), 
							new sap.m.ToolbarSpacer({ width : "5px"}),
							new sap.m.Input(oController.PAGEID + "_Cname",{
								value : "{Cname}",
								editable : {
									parts : [ {path : "ZappStatAl"}, {path : "Conresn"} ],
									formatter : function(fVal1, fVal2){
										if((fVal1 == "" || fVal1 == "10" ) && (fVal2 != "010" )) return true;
										else return false;
									}
								},
								width : "100%",
							}) ]
			}).addStyleClass("ToolbarNoBottomLine")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1356") , required : true}).addStyleClass("FontFamilyBold"),	// 1356:상품명
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : 	new sap.m.Toolbar({
						content : [ new sap.m.ComboBox(oController.PAGEID + "_Congoods",{
							width : "100%" ,
							// change : oController.onChangeSlart,
							editable : {
								path : "ZappStatAl",
								formatter : function(fVal){
									// if(fVal == "" || fVal == "10") return true;
									// else return false;
									return false;
								}
							},
							selectedKey : "{Congoods}",
						})] 
					}).addStyleClass("ToolbarNoBottomLine")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1359"), required : true}).addStyleClass("FontFamilyBold"),	// 1359:조치일자 / 시간
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
							content : [ new sap.m.DatePicker(oController.PAGEID + "_Actdt",
											{
											valueFormat : "yyyy-MM-dd",
								            displayFormat : "yyyy.MM.dd",
								            // change : oController.onChangeTableDate,
								            value : "{Actdt}",
											editable : {
												parts : [ {path : "ZappStatAl"},{path : "Concode"}],
												formatter : function(fVal1, fVal2){
													if((fVal1 == "" || fVal1 == "10") && fVal2 == "110") return true;
													else return false;
												}
											},
										    width : "150px"
									    }).addStyleClass("FontFamily"),
										new sap.m.Text({
											text : "/",
											textAlign : "Center"
										}).addStyleClass("FontFamily"), 
										new sap.m.ToolbarSpacer({ width : "5px"}),
										new sap.m.TimePicker(oController.PAGEID + "_ActtmT",{
											valueFormat : "HHmm",
											displayFormat : "HH:mm",
								            textAlign : sap.ui.core.TextAlign.Begin,
											value : "{ActtmT}",
											editable : {
												parts : [ {path : "ZappStatAl"},{path : "Concode"}],
												formatter : function(fVal1, fVal2){
													if((fVal1 == "" || fVal1 == "10") && fVal2 == "110") return true;
													else return false;
												},
											},
										    width : "150px",
										    minutesStep : 10,
										    change : function(oEvent){
												var oInput = oEvent.getSource(),
												timeValue = oInput.getValue(),
												timeLast = "0";
												oInput.setValue(timeValue.slice(0, -1) + timeLast);
										    },
//										    rules : [
//										    	new sap.m.MaskInputRule({
//										    		maskFormatSymbol : "0",
//										    		regex : "\d{3}" +"0"
//										    	})
//										    ]
										}).addStyleClass("FontFamily") ]
						}).addStyleClass("ToolbarNoBottomLine")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});	
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1357")}).addStyleClass("FontFamilyBold"),	// 1357:장의용품(추가)
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :  new sap.m.Toolbar({
				content : [new sap.m.CheckBox(oController.PAGEID + "_Conadd",{
							selected : "{Conadd}",
							editable : {
								parts : [ {path : "ZappStatAl"},{path : "Concode"},{path : "Congoods"}],
								formatter : function(fVal1, fVal2, fVal3){
									if((fVal1 == "" || fVal1 == "10") && fVal2 == "140" && !common.Common.checkNull(fVal3)) return true;
									else return false;
								}
							},
				}).addStyleClass("FontFamily"),  ]
				}).addStyleClass("ToolbarNoBottomLine")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1355"), required : true}).addStyleClass("FontFamilyBold"),	// 1355:배송주소
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input(oController.PAGEID + "_Addre",{
				value : "{Addre}",
				width : "100%",
				editable : {
					path : "ZappStatAl",
					formatter : function(fVal){
						if(fVal == "" || fVal == "10") return true;
						else return false;
					}
				},
				showValueHelp: true,
				valueHelpOnly: false,
				valueHelpRequest: oController.onDisplaySearchZipcodeDialog,
			}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1354"), required : true}).addStyleClass("FontFamilyBold"),	// 1354:받는분연락처
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Input(oController.PAGEID + "_Telno",{
								width : "100%",
								value : "{Telno}",
								editable : {
										path : "ZappStatAl",
										formatter : function(fVal){
											if(fVal == "" || fVal == "10") return true;
											else return false;
										}
									},
								}).addStyleClass("FontFamily")]
					}).addStyleClass("ToolbarNoBottomLine")
		}).addStyleClass("MatrixData ");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0096")}).addStyleClass("FontFamilyBold"),	// 96:비고
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input(oController.PAGEID + "_Zbigo",{
				value : "{Zbigo}",
				width : "100%",
				editable : {
					path : "ZappStatAl",
					formatter : function(fVal){
						if(fVal == "" || fVal == "10") return true;
						else return false;
					}
				},
			}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);

	
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				height : "20px",
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
				    new sap.m.ToolbarSpacer({width: "5px"}),
			        new sap.m.Text({text : oBundleText.getText("LABEL_0047") }).addStyleClass("MiddleTitle"),	// 47:신청내역
			    ]
			}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"), 
			oApplyInfoMatrix ], 
		});
	},
});