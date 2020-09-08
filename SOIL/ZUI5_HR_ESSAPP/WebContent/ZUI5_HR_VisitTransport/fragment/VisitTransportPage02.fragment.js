sap.ui.jsfragment("ZUI5_HR_VisitTransport.fragment.VisitTransportPage02", {
	
	createContent : function(oController) {
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
							width : "10px"
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
					}).addStyleClass("FontFamilyBold")
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
						text : oBundleText.getText("LABEL_1250"), 	// 1250:예산구분
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
						text : oBundleText.getText("LABEL_2726"),	// 2726:1차 사용기간
						required : true
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ new sap.m.DatePicker({
							width : "130px",
							valueFormat : "yyyy-MM-dd",
				            displayFormat : "yyyy.MM.dd",
				            value : "{Datb1}",
				            editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
									else return false;
								}
							},
							change : function(oEvent){
								oController.onChange1Date(oEvent);
								oController.onSearchPerData(oController);
							}
						}).addStyleClass("FontFamily"),
						new sap.m.Text({text : "~"}).addStyleClass("FontFamily PaddingLeft10 PaddingRight10"),
						new sap.m.DatePicker({
							valueFormat : "yyyy-MM-dd",
				            displayFormat : "yyyy.MM.dd",
				            value : "{Date1}",
				            editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
									else return false;
								}
							},
							width : "130px",
							change : oController.onChange1Date
						}).addStyleClass("FontFamily"),
						
					]}).addStyleClass("ToolbarNoBottomLine"),
				}).addStyleClass("MatrixData"),
				
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_2727")	// 2727:2차 사용기간
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ new sap.m.DatePicker({
							valueFormat : "yyyy-MM-dd",
				            displayFormat : "yyyy.MM.dd",
				            value : "{Datb2}",
				            editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
									else return false;
								}
							},
							width : "130px",
							change : function(oEvent){
								oController.onChange2Date(oEvent);
								oController.onSearchPerData(oController);
							}
						}).addStyleClass("FontFamily"),
						new sap.m.Text({text : "~"}).addStyleClass("FontFamily PaddingLeft10 PaddingRight10"),
						new sap.m.DatePicker({
							valueFormat : "yyyy-MM-dd",
				            displayFormat : "yyyy.MM.dd",
				            value : "{Date2}",
				            editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
									else return false;
								}
							},
							width : "130px",
							change : oController.onChange2Date
						}).addStyleClass("FontFamily"),
					]}).addStyleClass("ToolbarNoBottomLine"),
				}).addStyleClass("MatrixData"),
				
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		
		// 1차 연고지
		var oSloc1 = new sap.m.ComboBox(oController.PAGEID + "_Sloc1",{
			selectedKey : "{Sloc1}",
			editable : {
				parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
				formatter : function(fVal1, fVal2){
					if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
					else return false;
				}
			},
			width : "100%"
		}).addStyleClass("FontFamily");
		
		// 2차 연고지
		var oSloc2 = new sap.m.ComboBox(oController.PAGEID + "_Sloc2",{
			selectedKey : "{Sloc2}",
			editable : {
				parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
				formatter : function(fVal1, fVal2){
					if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
					else return false;
				}
			},
			width : "100%"
		}).addStyleClass("FontFamily");
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_2728"),	// 2728:1차 연고지
						required : true
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ oSloc1
					]}).addStyleClass("ToolbarNoBottomLine"),
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_2729"), 	// 2729:2차 연고지
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ oSloc2
					]}).addStyleClass("ToolbarNoBottomLine"),
				}).addStyleClass("MatrixData"),
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		// 1차 교통편
		var oTran1 = new sap.m.ComboBox({
			selectedKey : "{Tran1}",
			items : { path : "ZHR_VISITRANS_FEE_SRV>/VisitransTransSet",
				 template: new sap.ui.core.ListItem({
           		key: "{ZHR_VISITRANS_FEE_SRV>Trans}",
           		text: "{ZHR_VISITRANS_FEE_SRV>Transtx}"
           	 })
			},		
			editable : {
				parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
				formatter : function(fVal1, fVal2){
					if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
					else return false;
				}
			},
			width : "100%"
		}).addStyleClass("FontFamily");
		
		// 2차 교통편
		var oTran2 = new sap.m.ComboBox({
			selectedKey : "{Tran2}",
			items : { path : "ZHR_VISITRANS_FEE_SRV>/VisitransTransSet",
				 template: new sap.ui.core.ListItem({
           		key: "{ZHR_VISITRANS_FEE_SRV>Trans}",
           		text: "{ZHR_VISITRANS_FEE_SRV>Transtx}"
           	 })
			},		
			editable : {
				parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
				formatter : function(fVal1, fVal2){
					if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
					else return false;
				}
			},
			width : "100%"
		}).addStyleClass("FontFamily");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_2730"),	// 2730:1차 교통편
						required : true
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ oTran1
					]}).addStyleClass("ToolbarNoBottomLine"),
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_2731")	// 2731:2차 교통편
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ oTran2
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
						text : oBundleText.getText("LABEL_2732"),	// 2732:1차 방문목적
						required : true
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ new sap.m.Input({
						    value : "{Objx1}",
						    width : "100%",
//						    editable : {
//								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
//								formatter : function(fVal1, fVal2){
//									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
//									else return false;
//								}
//							},
						    editable : false,
							maxLength : common.Common.getODataPropertyLength("ZHR_VISITRANS_FEE_SRV", "VisitransFeeAppl", "Objx1"),
						}).addStyleClass("FontFamily"),
					]}).addStyleClass("ToolbarNoBottomLine"),
				}).addStyleClass("MatrixData"),
				
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_2733")	// 2733:2차 방문목적
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ new sap.m.Input({
						    value : "{Objx2}",
						    width : "100%",
						    editable : false,
							maxLength : common.Common.getODataPropertyLength("ZHR_VISITRANS_FEE_SRV", "VisitransFeeAppl", "Objx2"),
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
						text : oBundleText.getText("LABEL_0096")	// 96:비고
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ new sap.m.Input({
						    value : "{Addi1}",
						    width : "100%",
						    editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
									else return false;
								}
							},
							maxLength : common.Common.getODataPropertyLength("ZHR_VISITRANS_FEE_SRV", "VisitransFeeAppl", "Addi1"),
						}).addStyleClass("FontFamily"),
					]}).addStyleClass("ToolbarNoBottomLine"),
				}).addStyleClass("MatrixData"),
				
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0096")	// 96:비고
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ new sap.m.Input({
						    value : "{Addi2}",
						    width : "100%",
						    editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
									else return false;
								}
							},
							maxLength : common.Common.getODataPropertyLength("ZHR_VISITRANS_FEE_SRV", "VisitransFeeAppl", "Addi2"),
						}).addStyleClass("FontFamily"),
					]}).addStyleClass("ToolbarNoBottomLine"),
				}).addStyleClass("MatrixData"),
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		var oApplyInfoPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "20px",
					content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.ToolbarSpacer({width: "5px"}),
					new sap.m.Text({text : oBundleText.getText("LABEL_1738")}).addStyleClass("MiddleTitle"),	// 1738:방문교통비 신청
				]}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
				oApplyInfoMatrix
			]
		});
		
		var oTransportInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 7,
			widths : ['30px','12%','12%','12%','12%','12%','40%']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({
						text : oBundleText.getText("LABEL_1931"), 	// 1931:여\n비\n내\n역
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center",
					rowSpan : 5
				}).addStyleClass("MatrixLabel3"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1258"), 	// 1258:항목
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center",
					rowSpan : 2
				}).addStyleClass("MatrixLabel2"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1278"), 	// 1278:총 신청금액
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center",
					rowSpan : 2
				}).addStyleClass("MatrixLabel2"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1274"), 	// 1274:법인카드 사용금액
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center",
					colSpan : 2
				}).addStyleClass("MatrixLabel2"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_2328"), 	// 2328:현금사용금액
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center",
					rowSpan : 2
				}).addStyleClass("MatrixLabel2"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0016"), 	// 내역
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center",
					rowSpan : 2
				}).addStyleClass("MatrixLabel2"),
			]
		});
		oTransportInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1254"), 	// 1254:지급신청
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center",
				}).addStyleClass("MatrixLabel2"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1249"), 	// 1249:실사용
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center",
				}).addStyleClass("MatrixLabel2"),
			]
		});
		oTransportInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_2734"), 	// 2734:1차 교통비
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center",
				}).addStyleClass("MatrixLabel2"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
						value : "{Tota1}",
						width : "100%",
						textAlign : "End",
						editable : false
					}).addStyleClass("FontFamily"),
					hAlign : "Center",
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
						value : "{Requ1}",
						width : "100%",
						textAlign : "End",
						editable : {parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2){
								if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
								else return false;
							}
						},
						change : oController.onChangePrice1,
					}).addStyleClass("FontFamily Number2"),
					hAlign : "Center",
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
						value : "{Actu1}",
						textAlign : "End",
						width : "100%",
						editable : false
					}).addStyleClass("FontFamily"),
					hAlign : "Center",
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
						value : "{Cash1}",
						textAlign : "End",
						width : "100%",
						editable : {
			    			parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2){
								if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
								else return false;
							}
			    		},
			    		change : oController.onChangePrice1
					}).addStyleClass("FontFamily"),
					hAlign : "Center",
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
						value : "{Opin1}",
						width : "100%",
						editable : {
			    			parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2){
								if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
								else return false;
							}
			    		},
					}).addStyleClass("FontFamily"),
					hAlign : "Center",
				}).addStyleClass("MatrixData"),
			]
		});
		oTransportInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_2735"), 	// 2735:2차 교통비
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center",
				}).addStyleClass("MatrixLabel2"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
						value : "{Tota2}",
						textAlign : "End",
						width : "100%",
						editable : false
					}).addStyleClass("FontFamily"),
					hAlign : "Center",
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
						value : "{Requ2}",
						textAlign : "End",
						width : "100%",
						editable : {parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2){
								if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
								else return false;
							}
						},
						change : oController.onChangePrice2
					}).addStyleClass("FontFamily"),
					hAlign : "Center",
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
						value : "{Actu2}",
						textAlign : "End",
						width : "100%",
						editable : false
					}).addStyleClass("FontFamily"),
					hAlign : "Center",
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
						value : "{Cash2}",
						textAlign : "End",
						width : "100%",
						editable : {
			    			parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2){
								if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
								else return false;
							}
			    		},
			    		change : oController.onChangePrice2
					}).addStyleClass("FontFamily"),
					hAlign : "Center",
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
						value : "{Opin2}",
						width : "100%",
						editable : {
			    			parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2){
								if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
								else return false;
							}
			    		},
					}).addStyleClass("FontFamily"),
					hAlign : "Center",
				}).addStyleClass("MatrixData"),
			]
		});
		oTransportInfoMatrix.addRow(oRow);
	
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0406"), 	// 406:계
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center",
				}).addStyleClass("MatrixLabel2"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
						value : "{Tota3}",
						textAlign : "End",
						width : "100%",
						editable : false
					}).addStyleClass("FontFamily"),
					hAlign : "Center",
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
						value : "{Requ3}",
						textAlign : "End",
						width : "100%",
						editable : false
					}).addStyleClass("FontFamily"),
					hAlign : "Center",
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
						value : "{Actu3}",
						textAlign : "End",
						width : "100%",
						editable : false
					}).addStyleClass("FontFamily"),
					hAlign : "Center",
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
						value : {path : "Cash3",
							formatter : function(x){
								 if(x == null || x == "") return "";
								 x = common.Common.replaceAll(x,",","");
								 return (x*1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
							}
						},
						textAlign : "End",
						width : "100%",
						editable : false
					}).addStyleClass("FontFamily"),
					hAlign : "Center",
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : "Center",
				}).addStyleClass("MatrixData"),
			]
		});
		oTransportInfoMatrix.addRow(oRow);
		
		var oTransportInfoPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content :  [
				new sap.m.Toolbar({
					height : "40px",
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
		    		   }).addStyleClass("FontFamily"),
		    	   ]
				}).addStyleClass("ToolbarNoBottomLine"),
				oTransportInfoMatrix
			]
		});
		
		/////////////////////////////////////////////////////////////		
		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : ["20px","","20px"],
			width : "100%"
		});
		
		var oContents = [
//			new sap.ui.core.HTML({content : "<div style='height : 15px;'/>"}),
//			oTest,
			this.getTitleRender(oController),	
			sap.ui.jsfragment("fragment.ApplyInformationLayout", oController),
			sap.ui.jsfragment("fragment.TargetLayout", oController),
			oApplyInfoPanel,
			oTransportInfoPanel,
			sap.ui.jsfragment("fragment.CCSInformationLayout", oController), 
       	 	sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController), 
		    sap.ui.jsfragment("fragment.ApplyLayout", oController),
			sap.ui.jsfragment("fragment.ApprovalInformationLayout", oController), // 결재내역
			sap.ui.jsfragment("fragment.Comments", oController)	// 승인 / 반려 
		];
		
		for(var i=0;i<oContents.length;i++){
			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			oCell = new sap.ui.commons.layout.MatrixLayoutCell();
			oRow.addCell(oCell);
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				content : oContents[i]
			});
			oRow.addCell(oCell);
			oCell = new sap.ui.commons.layout.MatrixLayoutCell();
			oRow.addCell(oCell);
			oContentMatrix.addRow(oRow);
		}
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [oContentMatrix]
		}).setModel(oController._DetailJSonModel);
		
		oLayout.bindElement("/Data");
		oLayout.addStyleClass("sapUiSizeCompact");

		return oLayout;
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
									}),
									new sap.m.Button({text : oBundleText.getText("LABEL_1907"),	// 1907:회수
										press : function() {
											common.Common.onPressApprovalCancel(oController);
										},
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
	
	
});