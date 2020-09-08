sap.ui.jsfragment("ZUI5_HR_JoinClubHA.fragment.JoinClubPage02", {
	
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
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [new sap.m.Text({
//							text : "{Ename}",
							text : {
								parts : [{path : "Ename"}, {path : "Perid"}],
								formatter : function(fVal1, fVal2){
									if(fVal1 || fVal2) return fVal1 + " (" + fVal2 + ")"
								}
							}
						}).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")
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
								parts : [{path : "Btext"}, {path : "Orgtx"}],
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
								parts : [{path : "Jikgbt"}, {path : "Jiktlt"}],
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
							text : "{Jikcht}",
						}).addStyleClass("L2PFontFamily")]
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
		
		// 인포멀그룹 가입/탈퇴 신청사항(총무,회장)
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "인포멀 그룹", required : true}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [new sap.m.Text({
							text : "{Zclubtx}"
						}).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : "회원수 / 결성일자"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
								  content : [new sap.m.Text({text : {
									  parts : [{path : "Member"}, {path : "Orgdt"}],
									  formatter : function(fVal1, fVal2){
										  var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy.MM.dd"});
										  if(fVal1 || fVal2) return fVal1 + " / " + dateFormat.format(fVal2);
									  }
								  }}).addStyleClass("L2PFontFamily")]
							   }).addStyleClass("L2PToolbarNoBottomLine")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "회장"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
								  content : [new sap.m.Text({
									  			text : {
									  				parts : [{path : "Chairnm"}, {path : "Chairid"}],
									  				formatter : function(fVal1, fVal2){
									  					if(fVal1 && fVal2) return fVal1 + "(" + fVal2 + ")";
									  				}
									  			}
											 }).addStyleClass("L2PFontFamily")]
							   }).addStyleClass("L2PToolbarNoBottomLine")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : "총무"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
								  content : [new sap.m.Text({
		//									  text : "{Mangnm}"
									  		  text : {
									  			  parts : [{path : "Mangnm"}, {path : "Mangid"}],
									  			  formatter : function(fVal1, fVal2){
									  				  if(fVal1 && fVal2) return fVal1 + "(" + fVal2 + ")";
									  			  }
									  		  }
											}).addStyleClass("L2PFontFamily")]
							   }).addStyleClass("L2PToolbarNoBottomLine")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "가입현황"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
								  content : [new sap.m.Text({text : "{Joinynt}"}).addStyleClass("L2PFontFamily")]
							   }).addStyleClass("L2PToolbarNoBottomLine")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : "신청종류"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [new sap.m.Text({
								text : "{Reqtypt}"
							}).addStyleClass("L2PFontFamily")]
						}).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : "결재권한대행"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.CheckBox({
									selected : "{Actck}",
									select : oController.onActck,
									editable : {
										parts : [{path : "Magdt"}, {path : "Chadt"}, {path : "ZappStatAl"}, {path : "Mang"}, {path : "Chair"}, {path : "Stf"}],
										formatter : function(fVal1, fVal2, fVal3, fVal4, fVal5, fVal6){
											if((fVal1 == "" || fVal2 == "") && fVal3 == "20" && (fVal4 == "X" || fVal5 == "X")){
												return true;
											} else{
												return false;
											}
										}
									}
							  }),
					colSpan : 3
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		
		var oApplyInfoPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
//			visible : {
//				parts : [{path : "Mang"}, {path : "Chair"}, {path : "Stf"}],
//				formatter : function(fVal1, fVal2, fVal3){
//					if(fVal1 == "X" || fVal2 == "X") return true;
//					else return false;
//				}					
//			},
			content : [new sap.m.Toolbar({
							design : sap.m.ToolbarDesign.Auto,
							height : "40px",
							content : [new sap.ui.core.Icon({
											src: "sap-icon://open-command-field", 
											size : "1.0rem"
										}),
									   new sap.m.ToolbarSpacer({width: "5px"}),
								       new sap.m.Text({text : "인포멀그룹 가입/탈퇴 신청사항"}).addStyleClass("L2PFontFamilyBold")
						]}).addStyleClass("L2PToolbarNoBottomLine"),
						oApplyInfoMatrix]
		});

		// 인포멀그룹 가입/탈퇴 신청사항(담당자)
		var oApplyInfoMatrix2 = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "인포멀 그룹", required : true}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [new sap.m.Text({
							text : "{Zclubtx}"
						}).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : "회원수 / 결성일자"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
								  content : [new sap.m.Text({text : {
									  parts : [{path : "Member"}, {path : "Orgdt"}],
									  formatter : function(fVal1, fVal2){
										  var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy.MM.dd"});
										  if(fVal1 || fVal2) return fVal1 + " / " + dateFormat.format(fVal2);
									  }
								  }}).addStyleClass("L2PFontFamily")]
							   }).addStyleClass("L2PToolbarNoBottomLine")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "회장"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
								  content : [new sap.m.Text({
									  			text : {
									  				parts : [{path : "Chairnm"}, {path : "Chairid"}],
									  				formatter : function(fVal1, fVal2){
									  					if(fVal1 && fVal2) return fVal1 + "(" + fVal2 + ")";
									  				}
									  			}
											 }).addStyleClass("L2PFontFamily")]
							   }).addStyleClass("L2PToolbarNoBottomLine")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : "총무"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
								  content : [new sap.m.Text({
//											  text : "{Mangnm}"
									  		  text : {
									  			  parts : [{path : "Mangnm"}, {path : "Mangid"}],
									  			  formatter : function(fVal1, fVal2){
									  				  if(fVal1 && fVal2) return fVal1 + "(" + fVal2 + ")";
									  			  }
									  		  }
											}).addStyleClass("L2PFontFamily")]
							   }).addStyleClass("L2PToolbarNoBottomLine")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "가입현황"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
								  content : [new sap.m.Text({text : "{Joinynt}"}).addStyleClass("L2PFontFamily")]
							   }).addStyleClass("L2PToolbarNoBottomLine")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : "신청종류"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [new sap.m.Text({
								text : "{Reqtypt}"
							}).addStyleClass("L2PFontFamily")]
						}).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		
		var oApplyInfoPanel2 = new sap.m.Panel({
			expandable : false,
			expanded : false,
			visible : {
				parts : [{path : "Mang"}, {path : "Chair"}, {path : "Stf"}],
				formatter : function(fVal1, fVal2, fVal3){
					if(fVal3 == "X") return true;
					else return false;
				}					
			},
			content : [new sap.m.Toolbar({
							design : sap.m.ToolbarDesign.Auto,
							height : "40px",
							content : [new sap.ui.core.Icon({
											src: "sap-icon://open-command-field", 
											size : "1.0rem"
										}),
									   new sap.m.ToolbarSpacer({width: "5px"}),
								       new sap.m.Text({text : "인포멀그룹 가입/탈퇴 신청사항"}).addStyleClass("L2PFontFamilyBold")
						]}).addStyleClass("L2PToolbarNoBottomLine"),
						oApplyInfoMatrix2]
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
			content : new sap.m.Text({text : "결재상태"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
							content : [new sap.m.Text({text : "{ZappStxtAl}"}).addStyleClass("L2PFontFamily")]
					  }).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "총무 결재일시"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
							content : [new sap.m.Text({text : "{Magdt}"}).addStyleClass("L2PFontFamily")]
					  }).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix3.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "회장 결재일시"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
							content : [new sap.m.Text({text : "{Chadt}"}).addStyleClass("L2PFontFamily")]
					  }).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "최종 결재일시"}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
							content : [new sap.m.Text({text : "{Stfdt}"}).addStyleClass("L2PFontFamily")]
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
					if(fVal != "" && fVal != "10") return true;
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
//									path : "ZappStatAl",
//									formatter : function(fVal){
//										if(fVal == "20" || fVal == "30") return true;
//										else return false;
//									}
									parts : [{path : "ZappStatAl"}, {path : "Enabled"}],
									formatter : function(fVal1, fVal2){
										if((fVal1 == "20" || fVal1 == "30") && fVal2 != false) return true;
										else return false;
									}
								},
								maxLength : common.Common.getODataPropertyLength("ZHR_CLUB_SRV", "ClubExpensesAppl", "ZappResn"),
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
		
		var oContents = [new sap.ui.core.HTML({content : "<div style='height : 15px;'/>"}), oPaymentPanel, oApplyInfoPanel, oApplyInfoPanel2, oAppPanel, oDocPanel, oRejPanel];
		
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