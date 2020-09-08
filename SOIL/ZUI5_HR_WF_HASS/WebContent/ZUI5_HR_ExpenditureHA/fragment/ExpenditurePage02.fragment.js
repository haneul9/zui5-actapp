sap.ui.jsfragment("ZUI5_HR_ExpenditureHA.fragment.ExpenditurePage02", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.ZNK_TABLES");
		
		var oRow, oCell;
				
		// 대상자
		var oPaymentMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "성명" , required : true}).addStyleClass("L2PFontFamily"),
				}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
				
		var oName = new sap.m.Toolbar({
						content : [new sap.m.Input(oController.PAGEID + "_Ename",{ 
										width : "150px",
										value : "{Ename}",
										showValueHelp: true,
						        	    valueHelpOnly: false,
						        	    visible : { 
											  parts : [{path : "Auth"}, {path : "ZappStatAl"}],
											  formatter : function(fVal1,fVal2){
												  if(fVal1 == "E") return false ;
												  else if(fVal2 == "" || fVal2 == "10") return true ;
												  else return false;
											  }
										},
										editable : { 
											  parts : [{path : "Auth"}, {path : "ZappStatAl"}],
											  formatter : function(fVal1,fVal2){
												  if(fVal1 == "E") return false ;
												  else if(fVal2 == "") return true ;
												  else return false;
											  }
										},
										change : oController.EmpSearchByTx,
										valueHelpRequest: oController.displayEmpSearchDialog,
										customData : new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"}),
									}).addStyleClass("L2PFontFamilyBold"),
									new sap.m.Text({ 
//										text : "{Ename}",
										text : {
											parts : [{path : "Ename"}, {path : "Perid"}],
											formatter : function(fVal1, fVal2){
												if(fVal1 || fVal2) return fVal1 + " (" + fVal2 + ")"
											}
										},
										visible : { 
											  parts : [{path : "Auth"}, {path : "ZappStatAl"}],
											  formatter : function(fVal1,fVal2){
												  if(fVal1 == "E") return true ;
												  else if(fVal2 == "" || fVal2 == "10") return false ;
												  else return true;
											  }
										},
									}).addStyleClass("L2PFontFamily"),	
							        new sap.m.ToolbarSpacer({width : "10px"}),
							        new sap.ui.core.Icon({
										src: "sap-icon://search", 
										size : "1.0rem",
										visible : { 
											  parts : [{path : "Auth"}, {path : "ZappStatAl"}],
											  formatter : function(fVal1,fVal2){
												  if(fVal1 == "E") return false ;
												  else if(fVal2 == "") return true ;
												  else return false;
											  }
										},
										press : oController.displayEmpSearchDialog
									})
						]
					}).addStyleClass("L2PToolbarNoBottomLine");
		
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : oName
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "사업장 / 소속부서"}).addStyleClass("L2PFontFamily"),
				}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [new sap.m.Text({
							text : {
								parts : [{path : "Btrtx"}, {path : "Zzorgtx"}],
								formatter : function(fVal1, fVal2){
									if(fVal1 || fVal2) return fVal1 + " / " + fVal2;
								}
							}
						}).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oPaymentMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "직군 / 직급"}).addStyleClass("L2PFontFamily"),
				}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				content : new sap.m.Toolbar({
						content : [new sap.m.Text({
							text : {
								parts : [{path : "Zzjikgbt"}, {path : "Zzjiktlt"}],
								formatter : function(fVal1, fVal2){
									if(fVal1 || fVal2) return fVal1 + " / " + fVal2;
								}
							}
						}).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "직책"}).addStyleClass("L2PFontFamily"),
				}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [new sap.m.Text({
							text : "{Zzjikcht}",
						}).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oPaymentMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "참조선"}).addStyleClass("L2PFontFamily"),
				}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				colSpan : 3,
				content : new sap.m.Toolbar({
							content : [new sap.m.Text({text : "{Aprnm}"}).addStyleClass("L2PFontFamily"),
									   new sap.m.ToolbarSpacer(),
									   new sap.m.CheckBox(oController.PAGEID + "_Prvline",{
								        	selected : "{Prvline}",
								        	text : "개인 참조선 적용",
								        	editable : false,
								        }),
								        new sap.m.ToolbarSpacer({width : "20px"})]
						 }).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oPaymentMatrix.addRow(oRow);
		
		var oPaymentPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [new sap.m.Toolbar({
							height : "40px",
							design : sap.m.ToolbarDesign.Auto,
							content : [new sap.ui.core.Icon({
											src: "sap-icon://open-command-field", 
											size : "1.0rem"
										}),
									   new sap.m.ToolbarSpacer({width: "5px"}),
								       new sap.m.Text({text : "대상자" }).addStyleClass("L2PFontFamilyBold")]
						}).addStyleClass("L2PToolbarNoBottomLine"), oPaymentMatrix ]
		});
		
		// 신청내역
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "경조사유", required : true}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.ComboBox(oController.PAGEID + "_Conresn", {
									width : "95%",
									selectedKey : "{Conresn}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											if(fVal1 == "" && fVal2) return true;
											else return false;
										}
									},
									change : oController.onChangeConresn
							   }).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "신청대상", required : true}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.ComboBox(oController.PAGEID + "_Regno", {
									width : "95%",
									selectedKey : "{Regno}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											if(fVal1 == "" && fVal2) return true;
											else return false;
										}
									},
									change : oController.onChangeRegno
							   }).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "증빙상 경조일", required : true}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.DatePicker({
									valueFormat : "yyyy-MM-dd",
						            displayFormat : "yyyy.MM.dd",
						            value : "{Conddate}",
									width : "150px",
									editable : {
						 				path : "ZappStatAl",
						 				formatter : function(fVal){
						 					if(fVal == "20") return true;
						 					else return false;
						 				}
						 			},
						 			change : oController.setBasicPay
								}).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "실제 경조일", required : true}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.DatePicker({
									valueFormat : "yyyy-MM-dd",
						            displayFormat : "yyyy.MM.dd",
						            value : "{Conrdate}",
									width : "150px",
									editable : {
						 				path : "ZappStatAl",
						 				formatter : function(fVal){
						 					if(fVal == "20") return true;
						 					else return false;
						 				}
						 			},
						 			change : oController.onChangeDate
								}).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "휴가일수"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
								 content : [new sap.m.Text({text : "{ZholDay}"}).addStyleClass("L2PFontFamily")]
							 }).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "휴가신청여부"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
								 content : [new sap.m.Text({text : "{ZholChktx}"}).addStyleClass("L2PFontFamily")]
							 }).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "기본급 (A)"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
								 content : [new sap.m.Input({
									 			width : "150px",
									 			value : "{ZbacBet}",
									 			editable : {
									 				path : "ZappStatAl",
									 				formatter : function(fVal){
									 					if(fVal == "20") return true;
									 					else return false;
									 				}
									 			},
									 			textAlign : "Right",
									 			maxLength : common.Common.getODataPropertyLength("ZHR_CONTY_SRV", "ExpensesAppl", "ZbacBet"),
									 			change : oController.onSetBasbt
								 			}).addStyleClass("L2PFontFamily Number")]
							 }).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "제수당 (B)"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
								 content : [new sap.m.Input({
							 					width : "150px",
									 			value : "{ZetcBet}",
									 			editable : {
									 				path : "ZappStatAl",
									 				formatter : function(fVal){
									 					if(fVal == "20") return true;
									 					else return false;
									 				}
									 			},
									 			textAlign : "Right",
									 			maxLength : common.Common.getODataPropertyLength("ZHR_CONTY_SRV", "ExpensesAppl", "ZetcBet"),
									 			change : oController.onSetBasbt
								 			}).addStyleClass("L2PFontFamily Number")]
							 }).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "약정금액 (C = A + B)"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
								 content : [new sap.m.Text({text : "{Basbt}", width : "150px", textAlign : "Right"}).addStyleClass("L2PFontFamily")]
							 }).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "지급률(%) (D)"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
								 content : [new sap.m.Input({
							 					width : "150px",
									 			value : "{Payrt}",
									 			editable : {
									 				path : "ZappStatAl",
									 				formatter : function(fVal){
									 					if(fVal == "20") return true;
									 					else return false;
									 				}
									 			},
									 			textAlign : "Right",
									 			maxLength : common.Common.getODataPropertyLength("ZHR_CONTY_SRV", "ExpensesAppl", "Payrt"),
									 			change : oController.onSetZpayBet
								 			}).addStyleClass("L2PFontFamily")]
							 }).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "근속률(%) (E)"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
								 content : [new sap.m.Input({
							 					width : "150px",
									 			value : "{Wokrt}",
									 			editable : {
									 				path : "ZappStatAl",
									 				formatter : function(fVal){
									 					if(fVal == "20") return true;
									 					else return false;
									 				}
									 			},
									 			textAlign : "Right",
									 			maxLength : common.Common.getODataPropertyLength("ZHR_CONTY_SRV", "ExpensesAppl", "Wokrt"),
									 			change : oController.onSetZpayBet
								 			}).addStyleClass("L2PFontFamily")]
							 }).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "지급액 (C * D * E)"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
								 content : [new sap.m.Text({text : "{ZpayBet}", width : "150px", textAlign : "Right"}).addStyleClass("L2PFontFamily")]
							 }).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "증빙서류 제출여부"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					 content : [new sap.m.Toolbar({
									 content : [new sap.m.ComboBox(oController.PAGEID + "_Docyn", {
									 				width : "95%",
													selectedKey : "{Docyn}",
													items : [new sap.ui.core.Item({text : "제출", key : "Y"}),
															 new sap.ui.core.Item({text : "미 제출", key : "N"})],
													editable : {
														path : "ZappStatAl",
														formatter : function(fVal){
															if(fVal == "20") return true;
															else return false;
														}
													},
									 			}).addStyleClass("L2PFontFamily")]
								 }).addStyleClass("L2PToolbarNoBottomLine")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({colSpan : 2}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);		
		
		var oApplyInfoPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [new sap.m.Toolbar({
							design : sap.m.ToolbarDesign.Auto,
							height : "40px",
							content : [new sap.ui.core.Icon({
											src: "sap-icon://open-command-field", 
											size : "1.0rem"
										}),
									   new sap.m.ToolbarSpacer({width: "5px"}),
								       new sap.m.Text({text : "신청내역"}).addStyleClass("L2PFontFamilyBold")
						]}).addStyleClass("L2PToolbarNoBottomLine"),
						oApplyInfoMatrix]
		});
				
		// 신청자
		var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "성명"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :  new sap.m.Toolbar({
				content : [new sap.m.Text({
								text : "{Apename}",
							}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "사업장 / 소속부서"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
								text : {
									parts : [{path : "Apbtext"}, {path : "Aporgtx"}],
									formatter : function(fVal1, fVal2){
										if(fVal1 || fVal2) return fVal1 + " / " + fVal2;
									}
								}
							}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "직군 / 직급"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
								text : {
									parts : [{path : "Apjikgbt"}, {path : "Apjiktlt"}],
									formatter : function(fVal1, fVal2){
										if(fVal1 || fVal2) return fVal1 + " / " + fVal2;
									}
								}
							}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "신청일시"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
						content : [new sap.m.Text({
							text : "{Appdt}",
						}).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix2.addRow(oRow);
		
		var oAppPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [new sap.m.Toolbar({
							design : sap.m.ToolbarDesign.Auto,
							height : "40px",
							content : [new sap.ui.core.Icon({
											src: "sap-icon://open-command-field", 
											size : "1.0rem"
										}),
									   new sap.m.ToolbarSpacer({width: "5px"}),
								       new sap.m.Text({text : "신청자"}).addStyleClass("L2PFontFamilyBold"),
								       new sap.m.ToolbarSpacer()
						]}).addStyleClass("L2PToolbarNoBottomLine"),
						oMatrix2]
		});
		
		// 결재내역
		var oMatrix3 = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "결재문서번호"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
							content : [new sap.m.Link({text : "{Docno}", 
											press : function(oEvent){
												var vUrl = oController._DetailJSonModel.getProperty("/Data/Zurl");
												if(vUrl) window.open(vUrl);
										}}).addStyleClass("L2PFontFamily")]
					  }).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "결재상태"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
							content : [new sap.m.Text({text : "{ZappStxtAl}"}).addStyleClass("L2PFontFamily")]
					  }).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix3.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "담당자 결재일시"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
							content : [new sap.m.Text({text : "{Stfdt}"}).addStyleClass("L2PFontFamily")]
					  }).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "주관부서장 결재일시"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
							content : [new sap.m.Text({text : "{Sgndt}"}).addStyleClass("L2PFontFamily")]
					  }).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix3.addRow(oRow);
		
		var oDocPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [new sap.m.Toolbar({
							design : sap.m.ToolbarDesign.Auto,
							height : "40px",
							content : [new sap.ui.core.Icon({
											src: "sap-icon://open-command-field", 
											size : "1.0rem"
										}),
									   new sap.m.ToolbarSpacer({width: "5px"}),
								       new sap.m.Text({text : "결재내역"}).addStyleClass("L2PFontFamilyBold"),
								       new sap.m.ToolbarSpacer()
						]}).addStyleClass("L2PToolbarNoBottomLine"),
						oMatrix3],
			visible : {
				path : "ZappStatAl",
				formatter : function(fVal){
					if(fVal != "" && fVal != "10" && fVal != "20") return true;
					else return false;
				}
			}
		});
		
		// 반려사유
		var oRejPanel =  new sap.m.Panel({
			expandable : false,
			expanded : false,
			content :  [new sap.m.Toolbar({
							height : "40px",
							content : [ new sap.ui.core.Icon({
										src: "sap-icon://open-command-field", 
										size : "1.0rem"
									}),
									new sap.m.ToolbarSpacer({width: "5px"}),
									new sap.m.Text({text : "반려사유" }).addStyleClass("L2PFontFamilyBold")]
					    	}).addStyleClass("L2PToolbarNoBottomLine") ,
						new sap.m.TextArea({
								value : "{ZappResn}",
								rows : 4,
								width : "100%",
								editable : {
									path : "ZappStatAl",
									formatter : function(fVal){
										if(fVal == "20" || fVal == "30") return true;
										else return false;
									}
								},
								maxLength : common.Common.getODataPropertyLength("ZHR_CONTY_SRV", "ExpensesAppl", "ZappResn"),
							}).addStyleClass("L2PFontFamily"),
						],
			visible : { path : "ZappStatAl" ,
				        formatter : function(fVal){
				    	   if(fVal && (fVal == "20" || fVal == "30" || fVal == "35" || fVal == "55" || fVal == "90" ) ){
				    		   return true;
				    	   } else return false;
				       }}
		});
		
		
		/////////////////////////////////////////////////////////////		
		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : ["20px","","20px"],
			width : "100%"
		});
		
		var oContents = [new sap.ui.core.HTML({content : "<div style='height : 15px;'/>"}), oPaymentPanel, oApplyInfoPanel,
						 sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController), oAppPanel, oDocPanel, oRejPanel];
		
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
		
//		if (!jQuery.support.touch) {
			oLayout.addStyleClass("sapUiSizeCompact");
//		};

		return oLayout;

	
	}
});