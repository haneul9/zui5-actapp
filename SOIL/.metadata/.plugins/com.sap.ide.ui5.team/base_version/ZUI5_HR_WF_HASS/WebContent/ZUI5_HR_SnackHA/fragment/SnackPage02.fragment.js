sap.ui.jsfragment("ZUI5_HR_SnackHA.fragment.SnackPage02", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.ZNK_TABLES");
		
		var oRow, oCell;
		
		// 대상자
		var oPaymentMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});

		// 소속부서 선택으로 변경함
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "소속부서", required : true}).addStyleClass("L2PFontFamily"),
				}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.ComboBox(oController.PAGEID + "_Orgeh", {
							width : "95%",
							selectedKey : "{Orgeh}",
						    editable : false
					 })
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "사업장"}).addStyleClass("L2PFontFamily"),
				}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
						  content : [new sap.m.Text({text : "{Btext}"}).addStyleClass("L2PFontFamily")]
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
								       new sap.m.Text({text : "대상부서"}).addStyleClass("L2PFontFamilyBold")]
						}).addStyleClass("L2PToolbarNoBottomLine"), oPaymentMatrix ]
		});
		
		// 지화간식 신청사항
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "예산"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Text({
									text : {
										path : "Budget",
										formatter : function(fVal){
											if(fVal) return common.Common.numberWithCommas(fVal);
										}
									},
									width : "50%"
							   }).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : "현재 잔액 / 신청 후 잔액"}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Text({
									text : {
										parts : [{path : "Baltr"}, {path : "Reqtr"}],
										formatter : function(fVal1, fVal2){
											if(fVal1 || fVal2) return common.Common.numberWithCommas(fVal1) + " / " + common.Common.numberWithCommas(fVal2);
										}
									}, 
									textAlign : "Right"
							   }).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "투입인원", required : true}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Input({
									value : "{Partip}",
									width : "150px",
									textAlign : "Right",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											if((fVal1 == "20") && fVal2) return true;
											else return false;
										}
									},
									maxLength : common.Common.getODataPropertyLength("ZHR_SNACK_SRV", "SnackExpensesAppl", "Partip")
							   }).addStyleClass("L2PFontFamily Number")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "총 금액", required : true}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Input({
									value : "{Betrg}",
									width : "150px",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											if((fVal1 == "20") && fVal2) return true;
											else return false;
										}
									},
									textAlign : "Right",
									maxLength : common.Common.getODataPropertyLength("ZHR_SNACK_SRV", "SnackExpensesAppl", "Betrg"),
									change : oController.onChangeBetrg
							   }).addStyleClass("L2PFontFamily Number")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "기간", required : true}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 3,
					content : [new sap.ui.commons.layout.HorizontalLayout({
									content : [new sap.m.DatePicker({
										valueFormat : "yyyy-MM-dd",
							            displayFormat : "yyyy.MM.dd",
							            value : "{Begda}",
										width : "150px",
										editable : {
											parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
											formatter : function(fVal1, fVal2){
												if((fVal1 == "20") && fVal2) return true;
												else return false;
											}
										},
										change : oController.onChangeDate,
										textAlign : "Begin"
								   }).addStyleClass("L2PFontFamily"),
								   new sap.m.Text({text : "~"}).addStyleClass("L2PFontFamily L2PPaddingLeft10 L2PPaddingRight10 L2PMarginTop5"),
								   new sap.m.DatePicker({
										valueFormat : "yyyy-MM-dd",
							            displayFormat : "yyyy.MM.dd",
							            value : "{Endda}",
										width : "150px",
										editable : {
											parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
											formatter : function(fVal1, fVal2){
												if((fVal1 == "20") && fVal2) return true;
												else return false;
											}
										},
										change : oController.onChangeDate,
										textAlign : "Begin"
								   }).addStyleClass("L2PFontFamily")]
							})]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "사유", required : true}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
									value : "{Worsn}",
									width : "99%",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											if((fVal1 == "20") && fVal2) return true;
											else return false;
										}
									},
									maxLength : common.Common.getODataPropertyLength("ZHR_SNACK_SRV", "SnackExpensesAppl", "Worsn")
							   }).addStyleClass("L2PFontFamily"),
					colSpan : 3
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : "계산근거", required : true}).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 3,
					content : new sap.m.TextArea({
									rows : 15,
									width : "99%",
									value : "{Calrsn}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											if((fVal1 == "20") && fVal2) return true;
											else return false;
										}
									}
							  }).addStyleClass("L2PFontFamily")
				}).addStyleClass("L2PMatrixData");
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
								       new sap.m.Text({text : "지화간식 신청사항"}).addStyleClass("L2PFontFamilyBold")
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
									path : "ZappStatAl",
									formatter : function(fVal){
										if(fVal == "20" || fVal == "30") return true;
										else return false;
									}
								},
								maxLength : common.Common.getODataPropertyLength("ZHR_SNACK_SRV", "SnackExpensesAppl", "ZappResn"),
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
		
		var oContents = [new sap.ui.core.HTML({content : "<div style='height : 15px;'/>"}), oPaymentPanel, oApplyInfoPanel, oAppPanel, oDocPanel, oRejPanel];
		
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