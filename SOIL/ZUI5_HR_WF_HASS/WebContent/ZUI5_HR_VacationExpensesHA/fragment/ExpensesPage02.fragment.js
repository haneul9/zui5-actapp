sap.ui.jsfragment("ZUI5_HR_VacationExpensesHA.fragment.ExpensesPage02", {

	createContent : function(oController) {
		var oRow, oCell;

		var oApplyInfo = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				height : "40px",
				design : sap.m.ToolbarDesign.Auto,
				content : [ new sap.m.ToolbarSpacer({
					width : "10px"
				}), new sap.m.Text({
					text : "신청안내"
				}).addStyleClass("L2PFontFamilyBold"),

				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : new sap.m.Image({
				src : "{Image}",
			// width : "100%",
			}).setModel(oController._vInfoImage).bindElement("/Data"),
			visible : "{EnableYn}"
		});

		// 기본 정보
		var oPaymentMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : [ '20%', '30%', '20%', '30%' ]
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "40px"
		});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({
				text : "성명"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);

		var oName = new sap.m.Toolbar({
			content : [new sap.m.Text({ 
//							text : "{Ename}",
							text : {
								parts : [{path : "Ename"}, {path : "Perid"}],
								formatter : function(fVal1, fVal2){
									if(fVal1 || fVal2) return fVal1 + " (" + fVal2 + ")"
								}
							}
						}).addStyleClass("L2PFontFamily"),	
			           
			]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oName
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({
				text : "사업장 / 소속부서"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [ new sap.m.Text({
					text : "{BOrgtx}",
				}).addStyleClass("L2PFontFamily") ]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oPaymentMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "40px"
		});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({
				text : "직군 / 직급"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [ new sap.m.Text({
					text : "{ZzjikgbtxT}",
				}).addStyleClass("L2PFontFamily") ]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({
				text : "직책"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [ new sap.m.Text({
					text : "{Zzjikchtx}",
				}).addStyleClass("L2PFontFamily") ]
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
									   new sap.m.CheckBox({
								        	selected : "{Prvline}",
								        	text : "개인 참조선 적용",
								        	editable : false
								        }),
								        new sap.m.ToolbarSpacer({width : "20px"})]
						 }).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oPaymentMatrix.addRow(oRow);
		
		var oPaymentPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ new sap.m.Toolbar({
				height : "40px",
				design : sap.m.ToolbarDesign.Auto,
				content : [ new sap.ui.core.Icon({
					src : "sap-icon://open-command-field",
					size : "1.0rem"
				}), new sap.m.ToolbarSpacer({
					width : "5px"
				}), new sap.m.Text({
					text : "대상자"
				}).addStyleClass("L2PFontFamilyBold"),
				]
			}).addStyleClass("L2PToolbarNoBottomLine"), oPaymentMatrix ]
		});

		// 신청내역
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : [ '20%', '30%', '20%', '30%' ]
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "40px"
		});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({
				text : "휴가구분",
				required : true
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Holtx}",
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({
				text : "휴가비"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Holamt}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "40px"
		});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({
				text : "휴가일수"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Holday}",
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({
				text : "분할사용가능횟수"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Splitnb}",
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "40px"
		});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({
				text : "휴가일자",
				required : true
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);

		var oHoldayLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping : true
		});
		oHoldayLayout.addContent(new sap.ui.layout.VerticalLayout({
			content : new sap.m.DatePicker(oController.PAGEID + "_Holbeg",{
				value : "{Holbeg}",
				width : "150px",
				valueFormat : "yyyy-MM-dd",
	            displayFormat : "yyyy.MM.dd",
				change : oController.onChangeHoliday
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PPaddingRight1Rem"));
		oHoldayLayout.addContent(new sap.ui.layout.VerticalLayout({
			content : new sap.m.Text({
				text : "~"
			}).addStyleClass("L2PPaddingTop5")
		}).addStyleClass("L2PPaddingRight1Rem"));
		oHoldayLayout.addContent(new sap.ui.layout.VerticalLayout({
			content : new sap.m.DatePicker(oController.PAGEID + "_Holend",{
				value : "{Holend}",
				width : "150px",
				valueFormat : "yyyy-MM-dd",
	            displayFormat : "yyyy.MM.dd",
				change : oController.onChangeHoliday
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PPaddingRight1Rem"));
		oHoldayLayout.addContent(new sap.ui.layout.VerticalLayout({
			content : new sap.m.Text({
//				text : "{Rholday}",
				text : { path : "Rholday",
					     formatter : function(fVal){
					    	 if(fVal && fVal != "0"){
					    		 return "( " + fVal + " )" ;
					    	 }else{
					    		 return ""
					    	 }
					     }     
				}
			}).addStyleClass("L2PFontFamily L2PPaddingTop5"),
		}).addStyleClass("L2PPaddingRight1Rem"));
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oHoldayLayout
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({
				text : "분할사용여부"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.CheckBox({
				selected : "{Splityn}",
				editable : false
//				selected : { path : "Splityn" ,
//					         formatter : function(fVal){
//					        	 if(fVal =="X") return true;
//					        	 else return false;
//					         }
//				},
//				editable : { path : "Splitnb",
//							 formatter : function(fVal){
//					        	 if(fVal > 0) return true;
//					        	 else return false;
//					         }
//				}
			})
		});
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "40px"
		});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({
				text : "휴가장소",
				required : true
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				value : "{Holpl}",
				width : "95%",
				maxLength : common.Common.getODataPropertyLength(
						"ZHR_HOL_EXP_SRV", "ExpensesAppl", "Holpl"),
			}),
			colSpan : 3,
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		var oApplyInfoPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ new sap.m.Toolbar({
				height : "40px",
				design : sap.m.ToolbarDesign.Auto,
				content : [ new sap.ui.core.Icon({
					src : "sap-icon://open-command-field",
					size : "1.0rem"
				}), new sap.m.ToolbarSpacer({
					width : "5px"
				}), new sap.m.Text({
					text : "신청내역"
				}).addStyleClass("L2PFontFamilyBold"),
				new sap.m.ToolbarSpacer({
				}),
//				new sap.m.Text({
//						text : "※ 본 장기근속휴가비 신청 결재 완료 시 장기근속휴가는 자동으로 신청됩니다.(단 분할사용 시 잔여 휴가신청은 근태신청에서 신청가능합니다.)"
//					}).addStyleClass("L2P15FontRedBold"),

				]
			}).addStyleClass("L2PToolbarNoBottomLine"), oApplyInfoMatrix ]
		});

		var oApplicantMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : [ '20%', '30%', '20%', '30%' ]
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "40px"
		});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({
				text : "성명"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Apename}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({
				text : "사업장 / 소속부서"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{ApbrgtxT}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplicantMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "40px"
		});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({
				text : "직군 / 직급"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{ApzzjikgbtxT}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({
				text : "신청일시"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Appdt}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplicantMatrix.addRow(oRow);

		var oApplicantPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ new sap.m.Toolbar({
				height : "40px",
				content : [ new sap.ui.core.Icon({
					src : "sap-icon://open-command-field",
					size : "1.0rem"
				}), new sap.m.ToolbarSpacer({
					width : "5px"
				}), new sap.m.Text({
					text : "신청자"
				}).addStyleClass("L2PFontFamilyBold") ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			oApplicantMatrix ],
		});
		
		var oRejectPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content :  [   new sap.m.Toolbar({
						content : [ new sap.ui.core.Icon({
										src: "sap-icon://open-command-field", 
										size : "1.0rem"
									}),
									new sap.m.ToolbarSpacer({width: "5px"}),
									new sap.m.Text({text : "반려사유" }).addStyleClass("L2PFontFamilyBold")]
					    	}).addStyleClass("L2PToolbarNoBottomLine") ,
						new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
						new sap.m.TextArea({
							value : "{ZappResn}",
							rows : 4,
							editable : true ,
							width : "100%",
						}).addStyleClass("L2PFontFamily"),
						],
			visible : { path : "ZappStatAl" ,
		        formatter : function(fVal){
		           if(fVal == "20" || fVal == "30" )  return true;
		    	   else return false;
		       }}				
		});
		
//		var oApprovalMatrix = new sap.ui.commons.layout.MatrixLayout({
//			columns : 4,
//			widths : ['20%','30%','20%','30%']
//		});
//				
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.m.Text({text : "결재문서번호"}).addStyleClass("L2PFontFamily"),
//		}).addStyleClass("L2PMatrixLabel"); 
//		oRow.addCell(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.m.Link({
//				text : { path : "Docno" , formatter : function(fVal){
//											if(parseInt(fVal) > 0) return fVal ;
//											else "";
//										  }
//					     
//				},
//				press : oController.openDocno
//			}).addStyleClass("L2PFontFamily"),
//		}).addStyleClass("L2PMatrixData");
//		oRow.addCell(oCell);
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.m.Text({text : "결재상태"}).addStyleClass("L2PFontFamily"),
//		}).addStyleClass("L2PMatrixLabel"); 
//		oRow.addCell(oCell);
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.m.Text({
//				text : "{ZappStxtAl}"
//			}).addStyleClass("L2PFontFamily"),
//		}).addStyleClass("L2PMatrixData");
//		oRow.addCell(oCell);
//		oApprovalMatrix.addRow(oRow);
//		
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.m.Text({text : "담당자결재일시"}).addStyleClass("L2PFontFamily"),
//		}).addStyleClass("L2PMatrixLabel"); 
//		oRow.addCell(oCell);
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.m.Text({
//				text : "{Stfdt}"
//			}).addStyleClass("L2PFontFamily"),
//		}).addStyleClass("L2PMatrixData");
//		oRow.addCell(oCell);
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.m.Text({text : "주관부서팀장결재일시"}).addStyleClass("L2PFontFamily"),
//		}).addStyleClass("L2PMatrixLabel"); 
//		oRow.addCell(oCell);
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			content : new sap.m.Text({
//				text : "{Sgndt}"
//			}).addStyleClass("L2PFontFamily"),
//		}).addStyleClass("L2PMatrixData");
//		oRow.addCell(oCell);
//		oApprovalMatrix.addRow(oRow);
//		
//		var oDocPanel = new sap.m.Panel({
//			expandable : false,
//			expanded : false,
//			content : [new sap.m.Toolbar({
//							design : sap.m.ToolbarDesign.Auto,
//							height : "40px",
//							content : [new sap.ui.core.Icon({
//											src: "sap-icon://open-command-field", 
//											size : "1.0rem"
//										}),
//									   new sap.m.ToolbarSpacer({width: "5px"}),
//								       new sap.m.Text({text : "결재내역"}).addStyleClass("L2PFontFamilyBold"),
//								       new sap.m.ToolbarSpacer()
//						]}).addStyleClass("L2PToolbarNoBottomLine"),
//						oApprovalMatrix],
//			visible : {
//				path : "ZappStatAl",
//				formatter : function(fVal){
//					if(fVal != "" && fVal != "10") return true;
//					else return false;
//				}
//			}
//		});

		var oContents = [ oApplyInfo, oPaymentPanel, oApplyInfoPanel, oApplicantPanel , oRejectPanel  ];
		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : [ "20px", "", "20px" ],
			width : "100%"
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.core.HTML({
				content : "<div style='height : 15px;'/>"
			})
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oContentMatrix.addRow(oRow);

		for (var i = 0; i < oContents.length; i++) {
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
			content : [ oContentMatrix ]
		}).setModel(oController._DetailJSonModel).bindElement("/Data");

		oLayout.addStyleClass("sapUiSizeCompact");
		oLayout.addEventDelegate({
			onAfterRendering:function(){	
				var vZappStatAl = oController._DetailJSonModel.getProperty("/Data/ZappStatAl");
				if(vZappStatAl && vZappStatAl != "") return ;
				oController.getHolidayInfo(oController);
				var vHolty = oController._DetailJSonModel.getProperty("/Data/Holty");
				// 신규등록일 경우 
				if(vHolty){
					oSelect1.setSelectedKey(vHolty);
				}
			}
		});
		
		return oLayout;
	}
});