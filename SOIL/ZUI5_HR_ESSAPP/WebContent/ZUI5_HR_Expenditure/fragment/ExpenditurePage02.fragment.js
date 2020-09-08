sap.ui.jsfragment("ZUI5_HR_Expenditure.fragment.ExpenditurePage02", {
	
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
	
		var oRow, oCell;
		// 신청내역
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1183"), required : true}).addStyleClass("FontFamilyBold")	// 1183:경조유형
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
						content : [new sap.m.ComboBox({
									width : "150px",
									selectedKey : "{Concode}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
											else return false;
										}
									},
									items : {
										path: "ZHR_CONTY_SRV>/ConcodeListSet",
										template: new sap.ui.core.ListItem({
											key: "{ZHR_CONTY_SRV>Concode}",
											text: "{ZHR_CONTY_SRV>Context}"
										}),
										templateShareable : true
									},
									change : oController.onChangeConcode,
							   }).addStyleClass("FontFamily")]
					})]
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1085"), required : true}).addStyleClass("FontFamilyBold")	// 1085:관계
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
						content : [new sap.m.ComboBox(oController.PAGEID +"_Conresn",{
									width : "200px",
									selectedKey : "{Conresn}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
											else return false;
										}
									},
									change : oController.onChangeConresn,
							   }).addStyleClass("FontFamily")]
					})]
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0125"), required : true}).addStyleClass("FontFamilyBold")	// 125:신청대상
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [new sap.m.Toolbar({
				content : [new sap.m.Input({
							width : "150px",
							value : "{Fname}",
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
									else return false;
								}
							},
					   }).addStyleClass("FontFamily")]
			})]
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0581")}).addStyleClass("FontFamilyBold")	// 581:장소
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ new sap.m.Input({
							value : "{Conplace}",
							width : "100%",
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
									else return false;
								}
							},
							maxLength : common.Common.getODataPropertyLength("ZHR_CONTY_SRV", "ExpensesObjList", "Conplace"),
						})
					]})
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_MultipleBirthLine",{height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1189"), required : true}).addStyleClass("FontFamilyBold")	// 1189:다태아
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
						content : [new sap.m.RadioButtonGroup({
									columns : 2,
									buttons : [new sap.m.RadioButton({text: oBundleText.getText("LABEL_1190")}).addStyleClass("FontFamily"), 	// 1190:단태아
									           new sap.m.RadioButton({text: oBundleText.getText("LABEL_1189")}).addStyleClass("FontFamily")],	// 1189:다태아
						            selectedIndex : "{Babytp}",
						            editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											if(fVal1 == "" || fVal1 == "10" && fVal2) return true;
											else return false;
										}
									},
									select : function(oEvent){
										oController._DetailJSonModel.setProperty("/Data/BabyCnt", "");
										oController._DetailJSonModel.setProperty("/Data/BabyCnt", "1");
										oController.onCalculationPay();
									}
							   }),
							   new sap.m.Text({width : "25px"}),
							   new sap.m.ComboBox(oController.PAGEID + "_MultipleBirth", {
									width : "150px",
									selectedKey : "{BabyCnt}",  
									items : [new sap.ui.core.Item({ key : "2", text : oBundleText.getText("LABEL_1177")}),	// 1177:2태
									      	 new sap.ui.core.Item({ key : "3", text : oBundleText.getText("LABEL_1178")}),	// 1178:3태
									      	 new sap.ui.core.Item({ key : "4", text : oBundleText.getText("LABEL_1179")}) ],	// 1179:4태
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											if(fVal1 == "" || fVal1 == "10" && fVal2) return true;
											else return false;
										}
									},
									visible : {
										path : "Babytp",
										formatter : function(fVal){
											if(fVal && fVal == 1) return true;
											else return false;
										}
									},
									change : oController.onCalculationPay
							   }).addStyleClass("FontFamily")]
					})]
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : ""}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : []
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1193"), required : true}).addStyleClass("FontFamilyBold")	// 1193:사유발생일
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
						content : [new sap.m.DatePicker({
									valueFormat : "yyyy-MM-dd",
						            displayFormat : "yyyy.MM.dd",
						            value : "{Conrdate}",
									width : "150px",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
											else return false;
										}
									},
									change : oController.onChangeConrdate
								}).addStyleClass("FontFamily")]
					})]
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1186")}).addStyleClass("FontFamilyBold")	// 1186:경조휴가일
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [ new sap.m.DatePicker(oController.PAGEID + "_Absbg",{
										valueFormat : "yyyy-MM-dd",
							            displayFormat : "yyyy.MM.dd",
							            value : "{Absbg}",
										width : "150px",
										editable : {
											parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Concode"}, {path : "Persa"}],
											formatter : function(fVal1, fVal2, fVal3, fVal4){
												// 출산일 경우 edit false
												if((fVal1 == "" || fVal1 == "10") && fVal2 && fVal3 != "160" && fVal4 != "7000") return true;
												else return false;
											}
										},
										change : oController.onChangeBegda 
								   }).addStyleClass("FontFamily"),
								   new sap.m.Text({text : "~" ,									}).addStyleClass("FontFamily PaddingLeft10 PaddingRight10"),
								   new sap.m.DatePicker(oController.PAGEID + "_Absed",{
										valueFormat : "yyyy-MM-dd",
							            displayFormat : "yyyy.MM.dd",
							            value : "{Absed}",
										width : "150px",
										editable : {
											parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Concode"}, {path : "Persa"}],
											formatter : function(fVal1, fVal2, fVal3, fVal4){
												// 출산일 경우 edit false
												if((fVal1 == "" || fVal1 == "10") && fVal2 && fVal3 != "160" && fVal4 != "7000") return true;
												else return false;
											}
										},
										change : oController.onChangeEndda
								   }).addStyleClass("FontFamily"),
								   new sap.m.Text({text : "{Hdays}",
									   	visible : {
											path : "Persa",
											formatter : function(fVal){
												return fVal != "7000";
											}
										},   
								   }).addStyleClass("FontFamilyRed"),
						   ]
					  })
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1182")}).addStyleClass("FontFamilyBold")	// 1182:경조금액
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
								 content : [new sap.m.Text({
									 			text : {                       // ESS 기준 (대상자와 신청자가 동일해야만 기본급을 보여준다.) HASS (기본급을 보여주지 않는다.)
						 							path : "ZpayBet",
						 							formatter : function(fVal){
						 								if(_gAuth == "E") return fVal;
						 								else return "";
						 							}
									 			},
									 			visible : {                  
						 							parts : [{path : "Pernr"}, {path : "Appernr"}],
						 							formatter : function(fVal1, fVal2){
						 								if(_gAuth !="E") return false;
						 								return !common.Common.checkNull(fVal1) && !common.Common.checkNull(fVal2) &&
						 								        fVal1 == fVal2 ? true : false ;
						 							}
						 						},	
									 			width : "150px", 
									 			textAlign : "Begin"
									 		}).addStyleClass("FontFamily")]
							 }).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1188")}).addStyleClass("FontFamilyBold")	// 1188:기본급
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
		 						content : [new sap.m.Text({
					 							text : {                       // ESS 기준 (대상자와 신청자가 동일해야만 기본급을 보여준다.) HASS (기본급을 보여주지 않는다.)
						 							path : "ZbacBet",
						 							formatter : function(fVal){
						 								if(_gAuth == "E") return fVal;
						 								else return "";
						 							}
									 			},
					 							visible : {
						 							parts : [{path : "Pernr"}, {path : "Appernr"}],
						 							formatter : function(fVal1, fVal2){
						 								if(_gAuth !="E") return false;
						 								return !common.Common.checkNull(fVal1) && !common.Common.checkNull(fVal2) &&
						 								        fVal1 == fVal2 ? true : false ;
						 							}
						 						},	
												width : "150px", 
												textAlign : "Begin"
											}).addStyleClass("FontFamily")]
					 }).addStyleClass("ToolbarNoBottomLine")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		return  new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [new sap.m.Toolbar({
							design : sap.m.ToolbarDesign.Auto,
//							height : "20px",
							content : [
								new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
							    new sap.m.ToolbarSpacer({width: "5px"}),
						        new sap.m.Text({text : oBundleText.getText("LABEL_0047")}).addStyleClass("MiddleTitle"),	// 47:신청내역
						        new sap.m.ToolbarSpacer(),
						        new sap.m.Button({
									text: oBundleText.getText("LABEL_0137"),	// 137:지급내역보기
									type : sap.m.ButtonType.Ghost,
									press : oController.onPressHistory ,
									visible : { path : "Pernr",
											    formatter : function(fVal){
											    	if(fVal && fVal != "") return true;
											    	else return false;
											    }
									}
							   }).addStyleClass("FontFamily"),
						]}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),
						oApplyInfoMatrix]
		});
	},
	
	
	
		
		
		
	
	
	
	
//	
//	
//	
//	
//	
//	
//	
//	
//	createContent : function(oController) {
//		jQuery.sap.require("common.ZNK_TABLES");
//		
//		
//		
//		/////////////////////////////////////////////////////////////		
//		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
//			columns : 3,
//			widths : ["20px","","20px"],
//			width : "100%"
//		});
//		
//		var oContents = [new sap.ui.core.HTML({content : "<div style='height : 15px;'/>"}), 
//						 sap.ui.jsfragment("fragment.ApplyInformationLayout", oController),
//				       	 sap.ui.jsfragment("fragment.TargetLayout", oController),
//			             oApplyInfoPanel,
//						 sap.ui.jsfragment("fragment.COMMON_ATTACH_PTI", oController), 
//		            	 sap.ui.jsfragment("fragment.ApplyLayout", oController),
//				       	 sap.ui.jsfragment("fragment.Comments", oController) ];                // 승인 / 반려
//		
//		for(var i=0;i<oContents.length;i++){
//			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//			oCell = new sap.ui.commons.layout.MatrixLayoutCell();
//			oRow.addCell(oCell);
//			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//				content : oContents[i]
//			});
//			oRow.addCell(oCell);
//			oCell = new sap.ui.commons.layout.MatrixLayoutCell();
//			oRow.addCell(oCell);
//			oContentMatrix.addRow(oRow);
//		}
//		
//					
//		var oLayout = new sap.ui.commons.layout.VerticalLayout({
//			width : "100%",
//			content : [oContentMatrix]
//		}).setModel(oController._DetailJSonModel);
//		
//		oLayout.bindElement("/Data");
//		
////		if (!jQuery.support.touch) {
//			oLayout.addStyleClass("sapUiSizeCompact");
////		};
//
//		return oLayout;
//
//	
//	}
});