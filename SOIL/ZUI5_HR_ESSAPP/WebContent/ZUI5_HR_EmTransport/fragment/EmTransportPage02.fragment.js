sap.ui.jsfragment("ZUI5_HR_EmTransport.fragment.EmTransportPage02", {
	
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
			this.getEmpInfoRender(oController),									// 신청내역
			sap.ui.jsfragment("fragment.CCSInformationLayout", oController), 		// 법인카드
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
		var oModel = sap.ui.getCore().getModel("ZHR_UGRTRANS_FEE_SRV");
		var oRow, oCell;
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0013")	// 근무형태
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [
							new sap.m.Input({
							    value : "{Schkztx}",
							    editable : false ,
								width : "300px"
							}).addStyleClass("FontFamily"),
					]}).addStyleClass("ToolbarNoBottomLine"),
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1390"), 	// 1390:근무상태
						required : true
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ new sap.m.Input({
							    value : "{Tprogtx}",
							    editable : false ,
								width : "300px"
							}).addStyleClass("FontFamily"),
					]}).addStyleClass("ToolbarNoBottomLine"),
				}).addStyleClass("MatrixData"),
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1250"), 	// 1250:예산구분
						required : true
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [
							 new sap.m.Input({
									value : "{Budgetx}",
									width : "150px",
									editable : false,
								}).addStyleClass("FontFamily")
					]}).addStyleClass("ToolbarNoBottomLine"),
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : "Cost Center", 
						required : true
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [
							new sap.m.Input({
							    value : "{Ltext}",
							    editable : false ,
								width : "300px"
							}).addStyleClass("FontFamily"),
					]}).addStyleClass("ToolbarNoBottomLine"),
				}).addStyleClass("MatrixData"),
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : "Activity"
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ new sap.m.Input({
						    value : "{Aufnr}",
						    width : "150px",
						    editable : false ,
						}).addStyleClass("FontFamily"),
						new sap.m.ToolbarSpacer({
							width : "5px"
						}),
						new sap.m.Input({
						    value : "{Aufnrtx}",
						    width : "100%",
						    editable : false
						}).addStyleClass("FontFamily")
					]}).addStyleClass("ToolbarNoBottomLine"),
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : ""
					}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixLabel"),
				
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
					}).addStyleClass("ToolbarNoBottomLine"),
				}).addStyleClass("MatrixData"),
				
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1396")	// 1396:사용기간
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ new sap.m.DatePicker({
							valueFormat : "yyyy-MM-dd",
				            displayFormat : "yyyy.MM.dd",
				            value : "{Datbd}",
				            editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
									else return false;
								}
							},
							width : "150px",
							change : oController.onChangeDatbd
						}).addStyleClass("FontFamily"),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.TimePicker({
								valueFormat : "HHmm",
								displayFormat : "HH:mm",
					            textAlign : sap.ui.core.TextAlign.Begin,
								value : "{TimbdC}",
								editable : {
									parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
									formatter : function(fVal1, fVal2){
										if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
										else return false;
									}
								},
						    width : "150px"
						}).addStyleClass("FontFamily"),
						new sap.m.Text({text : "~"}).addStyleClass("FontFamily PaddingLeft10 PaddingRight10"),
						new sap.m.DatePicker({
							valueFormat : "yyyy-MM-dd",
				            displayFormat : "yyyy.MM.dd",
				            value : "{Dated}",
				            editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
									else return false;
								}
							},
							width : "150px",
						}).addStyleClass("FontFamily"),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.TimePicker({
								valueFormat : "HHmm",
								displayFormat : "HH:mm",
					            textAlign : sap.ui.core.TextAlign.Begin,
								value : "{TimedC}",
							    editable : {
									parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
									formatter : function(fVal1, fVal2){
										if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
										else return false;
									}
							},
						    width : "150px"
						}).addStyleClass("FontFamily"),
					]}).addStyleClass("ToolbarNoBottomLine"),
					colSpan : 3	
				}).addStyleClass("MatrixData"),
				
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1399")	// 1399:이동경로
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ new sap.m.Input({
						    value : "{Movbd}",
						    width : "400px",
						    editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
									else return false;
								}
							},
							maxLength : common.Common.getODataPropertyLength("ZHR_UGRTRANS_FEE_SRV", "UgrtransFeeAppl", "Movbd"),
						}).addStyleClass("FontFamily"),
						new sap.m.Text({text : "~"}).addStyleClass("FontFamily PaddingLeft10 PaddingRight10"),
						new sap.m.Input({
						    value : "{Moved}",
						    width : "400px",
							editable : false
						}).addStyleClass("FontFamily"),
					]}).addStyleClass("ToolbarNoBottomLine"),
					colSpan : 3	
				}).addStyleClass("MatrixData"),
				
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1392")	// 1392:목적
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ new sap.m.Input({
						    value : "{Objtx}",
						    editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
									else return false;
								}
							},
							maxLength : common.Common.getODataPropertyLength("ZHR_UGRTRANS_FEE_SRV", "UgrtransFeeAppl", "Objtx"),
							width : "100%"
						}).addStyleClass("FontFamily"),
					]}).addStyleClass("ToolbarNoBottomLine"),
					colSpan : 3	
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
					height : "20px",
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({text : oBundleText.getText("LABEL_1391")}).addStyleClass("MiddleTitle"),	// 1391:긴급업무 수행교통비 신청
				]}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
				oApplyInfoMatrix
			]
		});
	},
	
	getEmpInfoRender : function(oController){
		var oModel = sap.ui.getCore().getModel("ZHR_UGRTRANS_FEE_SRV");
		var oRow, oCell ;
		var oEmInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 5,
			widths : ['15%','15%','15%','15%','40%']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1393"), 	// 1393:비용내역
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center",
					rowSpan : 2
				}).addStyleClass("MatrixLabel3"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1258"), 	// 1258:항목
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center",
				}).addStyleClass("MatrixLabel3"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1400"), 	// 1400:출발지역
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center",
				}).addStyleClass("MatrixLabel3"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0550"), 	// 550:금액
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center",
				}).addStyleClass("MatrixLabel3"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0096"), 	// 96:비고
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center",
				}).addStyleClass("MatrixLabel3"),
			]
		});
		oEmInfoMatrix.addRow(oRow);
		
		// 출발 지역
		var oLocst = new sap.m.ComboBox(oController.PAGEID + "_Locst",{
			selectedKey : "{Locst}",
			editable : {
				parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
				formatter : function(fVal1, fVal2){
					if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
					else return false;
				}
			},
			width : "100%",
			change : oController.onChangeLocst
		}).addStyleClass("FontFamily");
		
		oModel.read("/UgrTransLocstSet", {
			async: false,
			filters : [],
			success: function(data,res){
				if(data && data.results.length) {
					for(var i=0; i<data.results.length; i++) {
						oLocst.addItem(
							new sap.ui.core.Item({ 
								key: data.results[i].Locst, 
								text: data.results[i].Locsttx,
								customData : new sap.ui.core.CustomData({key : "Betrg", value : data.results[i].Betrg}),
							})
						);
					}
				}
			},
			error: function(res){console.log(res);}
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1401"), 	// 1401:택시이용
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center",
				}).addStyleClass("MatrixLabel3"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : oLocst
				}).addStyleClass("MatrixLabel2"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
						value : { path : "Betrg",
								  formatter : function(fVal){
									  return common.Common.numberWithCommas(fVal);
								  }	
						},
						editable : false,
						width : "100%"
					}).addStyleClass("FontFamily"),
				}).addStyleClass("MatrixLabel2"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
						value : "{Zbigo}", 
						editable : {
							parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2){
								if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
								else return false;
							}
						},
						width : "100%"
					}).addStyleClass("FontFamily"),
				}).addStyleClass("MatrixLabel2"),
			]
		});
		oEmInfoMatrix.addRow(oRow);
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content :  [
				new sap.m.Toolbar({
					content : [
				    	new sap.m.ToolbarSpacer(),
				    	new sap.m.Button({
				    		text : "CCS",
				    		type : "Ghost",
				    		press : common.CCSInformation.openCCS,
				    		enabled : {
				    			parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
									else return false;
								}
				    		},
		    		   }),
		    	   ]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),
				oEmInfoMatrix
			]
		});
		
	},
});