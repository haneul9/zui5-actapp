sap.ui.jsfragment("ZUI5_HR_ScholarshipHA.fragment.ScholarshipPage02", {
	
	createContent : function(oController) {
		var oRow, oCell;
		// EnableYn ZappStatAl == "20" 신청 또는 ZappStatAl == "30" 승인일 경우 true 그외에는 false
		var oApplyInfo = new sap.m.Panel({
			expandable : true,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.ToolbarSpacer({width: "10px"}),
					       new sap.m.Text({text : "신청안내" }).addStyleClass("L2PFontFamilyBold"),
				           
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : new sap.m.TextArea({
				rows : 5 ,
				value : "{Notice}",
				width : "100%",
				editable : false
			}),
			visible : "{EnableYn}"
		});
		
		// 기본 정보
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
			content : new sap.m.Text({ 
//				text : "{Ename}",
				text : {
					parts : [{path : "Ename"}, {path : "Perid"}],
					formatter : function(fVal1, fVal2){
						if(fVal1 || fVal2) return fVal1 + " (" + fVal2 + ")"
					}
				}
			}).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "사업장 / 소속부서"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{BOrgtx}",
				width : "95%",
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oPaymentMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "직군 / 직급"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{ZzjikgbtxT}",
				width : "95%",
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "직책"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Zzjikcht}",
				width : "95%",
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oPaymentMatrix.addRow(oRow);
		
		var oPaymentPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [  new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({
								src: "sap-icon://open-command-field", 
								size : "1.0rem"
							}),
							new sap.m.ToolbarSpacer({width: "5px"}),
					       new sap.m.Text({text : "대상자" }).addStyleClass("L2PFontFamilyBold"),
				           
				]
			}).addStyleClass("L2PToolbarNoBottomLine"), oPaymentMatrix ]
		});
		
		// 신청내역
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "신청대상"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [ new sap.m.Select(oController.PAGEID + "_Objps",{
					width : "95%" ,
					change : oController.onChangeSlart,
					enabled : false,
					selectedKey : "{Regno}"
				}).setModel(oController._DetailJSonModel)
				.bindElement("/Data") ]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "현 지원횟수 / 총 지원가능횟수"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{ZpayCntT}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "학력구분" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : 	new sap.m.Toolbar({
						content : [ new sap.m.Select(oController.PAGEID + "_Slart",{
							width : "95%" ,
							change : oController.onChangeSlart,// oController.onGetSchoolLimitCnt,
							enabled : "{EnableYn}",
							selectedKey : "{Slart}",
						}).setModel(oController._DetailJSonModel)
						.bindElement("/Data")] //.setModel(sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV"))]
					}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "학교명 / 학과" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
							content : [ new sap.m.Input(oController.PAGEID + "_Schtx",{
								value : "{Schtx}",
								editable : "{EnableYn}",
							    width : "200px"
							}).addStyleClass("L2PFontFamily"), 
							new sap.m.Input({
								value : "{Majnm}",
//								editable : "{EnableYn}",
								editable : {
									parts : [{path : "ZappStatAl"}, {path : "Slart"}],
									formatter : function(fVal1, fVal2){
										if(fVal1 != "20" && fVal1 != "30") return false;
										else if(fVal2 != "03" && fVal2 != "04") return true;
										else return false;
									}
								},
							    width : "200px"
							}).addStyleClass("L2PFontFamily") ]
						}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "학년 / 분기 / 학기" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [ new sap.m.Select(oController.PAGEID + "_Grdsp",{
								selectedKey : "{Grdsp}",
								enabled : "{EnableYn}",
								width : "210px"
							}),//.setModel(sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV")), 
//							new sap.m.ToolbarSpacer({width: "10px"}),
							new sap.m.Select(oController.PAGEID + "_Divcd",{
								selectedKey : "{Divcd}",
								enabled : "{EnableYn}",
								width : "206px"
							}),]//setModel(sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV")),]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "학자금 발생년도" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [ new sap.m.Input(oController.PAGEID + "_Zyear",{
					width : "100px",
					value : "{Zyear}",
					editable : "{EnableYn}",
					maxLength : 4,
					type : "Number",
					change : oController.onChangeZyear
				}).addStyleClass("L2PFontFamily") ]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "해외학교/외국인학교"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :  new sap.m.Toolbar({
				content : [ new sap.m.CheckBox({
					selected : "{Majdou}",
					editable : "{EnableYn}",
//					select : oController.onSelectMajdou
				}) ]
				}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "복수전공 수업료여부"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :  new sap.m.Toolbar({
				content : [new sap.m.CheckBox({
							selected : "{Forsch}",
							editable : "{EnableYn}",
				}).addStyleClass("L2PFontFamily"),  ]
				}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "입학금 (A)"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Input({
								width : "150px",
								maxLength : 17, 
								textAlign : "End",
								value : "{ZbetEntr}",
								change : oController.onChangeZbetReal,
								editable : { parts : [{path : "ZentrYn"},{path : "ZappStatAl"}], 
				        	   			formatter : function(fVal , fVal2){
				        	   			   if(fVal2 == "20" || fVal2 == "30"){
				            	   			   if(fVal && fVal == "N") return true ;
				            	   			   else return false;
				        	   			   }else{
				        	   				   return false;
				        	   			   }
				        	   		   }
								 }
				
							}).addStyleClass("L2PFontFamily Number")]
					}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData ");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "입학금 지급여부"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{ZentrYnT}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData Number");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "수업료 (B)" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :   new sap.m.Toolbar({
				content : [ new sap.m.Input(oController.PAGEID + "_ZbetTotl",{
								value : "{ZbetTotl}",
								width : "150px",
								maxLength : 17, 
								textAlign : "End",
								editable : "{EnableYn}",
								change : oController.onChangeZbetReal, 
							}).addStyleClass("L2PFontFamily Number")]
				}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "장학금 (C)"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :   new sap.m.Toolbar({
				content : [ new sap.m.Input({
								value : "{ZbetShip}",
								width : "150px",
								maxLength : 17, 
								textAlign : "End",
								editable : "{EnableYn}",
								change : oController.onChangeZbetReal
							}).addStyleClass("L2PFontFamily Number")]
				}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "실 부담금액 (A + B - C)"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{ZbetReal}",
				textAlign : "End" ,
				width : "150px" 
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "지원금액" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :   new sap.m.Toolbar({
				content : [ new sap.m.Input(oController.PAGEID + "_Zpyamt",{
								value : "{Zpyamt}",
								width : "150px",
								maxLength : 17, 
								textAlign : "End",
								editable : "{EnableYn}"
							}).addStyleClass("L2PFontFamily Number"),
							new sap.m.ToolbarSpacer(),
							new sap.m.Text({
								text : "{LtamtT}" ,
								visible :  { path : "Majdou" , formatter : function(fVal){
									if(fVal && ( fVal == "X" || fVal == true )) return true ;
									else return false ;
								}}
							}).addStyleClass("L2PFontFamilyRed"),
							new sap.m.ToolbarSpacer({width : "5px"}),
							]
				}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "학자금 선 지급 유무 (차수)"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		var oRadioBtn = new sap.m.RadioButtonGroup(oController.PAGEID + "_ZbefCash",{
			columns : 2,
			buttons : [new sap.m.RadioButton({text: "유", key : "Y"}).addStyleClass("L2PFontFamily"), 
			           new sap.m.RadioButton({text: "무", key : "N"}).addStyleClass("L2PFontFamily"),
			           ],
           selectedIndex : "{ZbefCash}",           
           editable : { parts : [{path : "Reqym"},{path : "ZappStatAl"},{path : "Slart"}], 
	   			formatter : function(fVal , fVal2, fVal3){
	   			   if(fVal3 == "05" || fVal3 == "06"){
	   	   			   if(!fVal2 || fVal2 == "" || fVal2 == "10" || fVal2 == "20" || fVal2 == "30"){
//	       	   			   if(fVal && fVal != "") return true ;
//	       	   			   else return false;
	   	   				   return true;
	   	   			   }else{
	   	   				   return false;
	   	   			   }
	   			   }else{
	   				   return false ;
	   			   }
	   		   }
           }
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [ oRadioBtn ,
							new sap.m.ToolbarSpacer({width : "5px"}) ,
							new sap.m.Text({
								text : "{Reqym}"	// ZbefSeqr 필드확인 필요 
							}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "지급일"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :   new sap.m.Toolbar({
				content : [ new sap.m.DatePicker(oController.PAGEID + "_ZpayDate",{
										valueFormat : "yyyy-MM-dd",
							            displayFormat : "yyyy.MM.dd",
										width : "150px",
										value : "{ZpayDate}",
										editable : "{EnableYn}",
										change : oController.onChangeDate
								   }).addStyleClass("L2PFontFamily")
							]
				}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "비  고"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :  new sap.m.Toolbar({
				content : [ new sap.m.Input({
								value : "{Zbigo}",
								editable : "{EnableYn}",
							}).addStyleClass("L2PFontFamily"),
							new sap.m.ToolbarSpacer({width : "10px"}),
							] }).addStyleClass("L2PToolbarNoBottomLine"),
			colSpan : 3
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		var oApplyInfoPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				height : "35px",
				content : [new sap.ui.core.Icon({
								src: "sap-icon://open-command-field", 
								size : "1.0rem"
							}),
							new sap.m.ToolbarSpacer({width: "5px"}),
					       new sap.m.Text({text : "신청내역" }).addStyleClass("L2PFontFamilyBold"),
					       
				]
			}).addStyleClass("L2PToolbarNoBottomLine"), oApplyInfoMatrix ],
			visible : "{EnableYn}"
		});
		
		
		// 신청내역(Text Only) 조회모드
		var oApplyInfoMatrix2 = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "신청대상" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{ObjpsT}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "현 지원횟수 / 총 지원가능횟수"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{ZpayCntT}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "학력구분" ,required : true }).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{Sltxt}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "학교명 / 학과" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : { parts : [{path : "Schtx"}, {path : "Majnm"}], 
					     formatter : function(fVal1, fVal2){
					    	 if(fVal1 != "" && fVal2 != "") return fVal1 + " / " + fVal2 ;
					    	 else return fVal1 + fVal2 ;
					     }
					   }
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "학년 / 분기/학기" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [ new sap.m.Text({
							text : { parts : [{path : "Grdspt"}, {path : "Divtx"}], 
							     formatter : function(fVal1, fVal2){
							    	 if(fVal1 == "" && fVal2 == "") return "" ;
							    	 else return fVal1 + " / " + fVal2 ;
							     }
							   }
			}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "학자금 발생년도" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{Zyear}",
					width : "150px",
					maxLength : 4, 
					type : "Number"
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "해외학교/외국인학교"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [ new sap.m.CheckBox({
					selected : "{Majdou}",
					editable : false }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "복수전공 수업료여부"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [ new sap.m.CheckBox({
					selected : "{Forsch}",
					editable : false }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "입학금 (A)"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{ZbetEntr}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData ");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "입학금 지급여부"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{ZentrYnT}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "학자금 총액 (B)" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{ZbetTotl}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "장학금 (C)"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{ZbetShip}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "실 부담금액 (A + B - C)"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{ZbetReal}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "지원금액" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{Zpyamt}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "학자금 선 지급 유무 (차수)"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		var oRadioBtn = new sap.m.RadioButtonGroup({
			columns : 2,
			buttons : [new sap.m.RadioButton({text: "유", key : "Y"}).addStyleClass("L2PFontFamily"), 
			           new sap.m.RadioButton({text: "무", key : "N"}).addStyleClass("L2PFontFamily"),
			           ],
           selectedIndex : "{ZbefCash}",           
           editable : false
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [ oRadioBtn ,
							new sap.m.ToolbarSpacer({width : "5px"}) ,
							new sap.m.Text({
								text : "{Reqym}"	// ZbefSeqr 필드 확인필요
							}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "지급일" , required : true}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{ZpayDate}",
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "비  고"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content :  [ new sap.m.Text({
					text : "{Zbigo}"
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			colSpan : 3
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		var oApplyInfoPanel2 = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				height : "35px",
				content : [new sap.ui.core.Icon({
								src: "sap-icon://open-command-field", 
								size : "1.0rem"
							}),
							new sap.m.ToolbarSpacer({width: "5px"}),
					       new sap.m.Text({text : "신청내역" }).addStyleClass("L2PFontFamilyBold"),
					       
				]
			}).addStyleClass("L2PToolbarNoBottomLine"), oApplyInfoMatrix2 ],
			visible : {
				path : "EnableYn" ,
				formatter : function(fVal){
					return !fVal;
				}
			}
		});
		
		
		
		
		var oApplicantMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "성명"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Apename}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "사업장 / 소속부서"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{ApbrgtxT}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplicantMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "직군 / 직급"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{ApzzjikgbtxT}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "신청일시"}).addStyleClass("L2PFontFamily"),
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
			content :  [   new sap.m.Toolbar({
						content : [ new sap.ui.core.Icon({
										src: "sap-icon://open-command-field", 
										size : "1.0rem"
									}),
									new sap.m.ToolbarSpacer({width: "5px"}),
									new sap.m.Text({text : "신청자" }).addStyleClass("L2PFontFamilyBold")]
					    	}).addStyleClass("L2PToolbarNoBottomLine") ,
						new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
						oApplicantMatrix	
						],
		});
		
		var oApprovalMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "결재문서번호"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Link({
				text : { path : "Docno" , formatter : function(fVal){
											if(parseInt(fVal) > 0) return fVal ;
											else "";
										  }
					     
				},
				press : oController.openDocno
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "결재상태"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{ZappStxtAl}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApprovalMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "담당자결재일시"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Stfdt}" 
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "주관부서팀장결재일시"}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Sgndt}"
			}).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApprovalMatrix.addRow(oRow);
		
		var oApprovalPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content :  [   new sap.m.Toolbar({
						content : [ new sap.ui.core.Icon({
										src: "sap-icon://open-command-field", 
										size : "1.0rem"
									}),
									new sap.m.ToolbarSpacer({width: "5px"}),
									new sap.m.Text({text : "결재내역" }).addStyleClass("L2PFontFamilyBold")]
					    	}).addStyleClass("L2PToolbarNoBottomLine") ,
						new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
						oApprovalMatrix	
						],
			visible : {
				path : "ZappStatAl" ,
				formatter : function(fVal){
					if( fVal == "20" ) return false;
					else return true;
				}
			}
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
							width : "100%",
							enabled :  "{EnableYn}"
						}).addStyleClass("L2PFontFamily"),
						],
			visible : { path : "ZappStatAl" ,
				        formatter : function(fVal){
				    	   if(fVal && ( fVal == "20" || fVal == "30" || fVal == "35" || fVal == "55" || fVal == "90" ) ){
				    		   return true;
				    	   }else return false;
				       }}
		});
				
		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : ["20px","","20px"],
			width : "100%"
		});
		
		var oContents = [oApplyInfo,oPaymentPanel,oApplyInfoPanel, oApplyInfoPanel2, sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController), oApplicantPanel,oApprovalPanel,oRejectPanel ];
		
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
			content : [
				oContentMatrix 
			           ]
		}).setModel(oController._DetailJSonModel)
		.bindElement("/Data");
		
//		if (!jQuery.support.touch) {
			oLayout.addStyleClass("sapUiSizeCompact");
//		};

		return oLayout;

	
	}
});