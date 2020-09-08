sap.ui.jsfragment("ZUI5_HR_Scholarship.fragment.ScholarshipPage02", {
	
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
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0125") , required : true}).addStyleClass("FontFamilyBold"),	// 125:신청대상
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [ new sap.m.ComboBox(oController.PAGEID + "_Objps",{
					width : "300px" ,
					change : oController.onChangeObjps,
					editable : {
						path : "ZappStatAl",
						formatter : function(fVal){
							if(fVal == "" || fVal == "10") return true;
							else return false;
						}
					},
					selectedKey : "{Regno}"
				})]
			}).addStyleClass("ToolbarNoBottomLine")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1135"), required : true}).addStyleClass("FontFamilyBold"),	// 1135:계열
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
					content : [new sap.m.Input(oController.PAGEID + "_Affil",{
					width : "100%",
					value : "{Affiltx}",
					editable : {
						parts : [ {path : "ZappStatAl"}],
						formatter : function(fVal1){
							if((fVal1 == "" || fVal1 == "10" )) return true;
							else return false;
						}
					},
					showValueHelp: true,
	        	    valueHelpOnly: true,
				    valueHelpRequest: oController.displayAffilSearchDialog
				}).addStyleClass("FontFamily")]
			}).addStyleClass("ToolbarNoBottomLine")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({
				text : oBundleText.getText("LABEL_1162") ,
				required : {
					parts : [ {path : "Affil"}],
					formatter : function(fVal1){
						if((fVal1 != "900" )) return true;
						else return false;
					}
				}
			}).addStyleClass("FontFamilyBold"),	// 1162:학력구분
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : 	new sap.m.Toolbar({
						content : [ new sap.m.ComboBox(oController.PAGEID + "_Slart",{
							width : "300px" ,
							change : oController.onChangeSlart,
							editable : {
								path : "ZappStatAl",
								formatter : function(fVal){
									if(fVal == "" || fVal == "10") return true;
									else return false;
								}
							},
							selectedKey : "{Slart}",
						})] 
					}).addStyleClass("ToolbarNoBottomLine")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1156") , required : true}).addStyleClass("FontFamilyBold"),	// 1156:학교명 / 학과
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
							content : [ new sap.m.Input({
											value : "{Schcd}",
											editable : {
												parts : [ {path : "ZappStatAl"}, {path : "Slart"} ],
												formatter : function(fVal1, fVal2){
													if((fVal1 == "" || fVal1 == "10" ) && (fVal2 == "04" || fVal2 == "06" )) return true;
													else return false;
												}
											},
											visible :{ path : "Slart",
													   formatter : function(fVal){
														   if(fVal == "04" || fVal == "06") return true;
														   else return false;
													   }	
											},
							        	    showValueHelp: { // 고등학교 와 대학교 일 경우 학교코드는 popup 에서 선택
							        	    	path : "Slart",
							        	    	formatter : function(fVal){
							        	    		if(fVal == "04" || fVal == "06") return true;
							        	    		else return false;
							        	    	}
							        	    },
							        	    valueHelpOnly:true,
							        	    valueHelpRequest : oController.onOpenSchoolList,
							        	    width : "80px"
										}).addStyleClass("FontFamily"),
										new sap.m.ToolbarSpacer({
											width : "10px",
											visible :{ path : "Slart",
												   formatter : function(fVal){
													   if(fVal == "04" || fVal == "06") return true;
													   else return false;
												   }	
											},
										}),
										new sap.m.Input(oController.PAGEID + "_Schtx",{
											value : "{Schtx}",
											editable : {
												parts : [ {path : "ZappStatAl"}, {path : "Schcd"} ],
												formatter : function(fVal1, fVal2){
													if((fVal1 == "" || fVal1 == "10" ) && fVal2 == "9999" ) return true;
													else return false;
												}
											},
							        	    width : "50%"
										}).addStyleClass("FontFamily"), 
										
										new sap.m.Text({
											text : "/",
											textAlign : "Center"
										}).addStyleClass("FontFamily"), 
										new sap.m.ToolbarSpacer({width : "5px"}),
										new sap.m.Input({
											value : "{Majnm}",
											editable : {
												parts : [ {path : "ZappStatAl"},{path : "Slart"}],
												formatter : function(fVal1, fVal2){
													if((fVal1 == "" || fVal1 == "10") && fVal2 == "06") return true;
													else return false;
												}
											},
										    width : "50%"
										}).addStyleClass("FontFamily") ]
						}).addStyleClass("ToolbarNoBottomLine")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		var oHtmlText = '<span style="font-size: 14px; color: #666666; font-family: Noto Sans KR Regular, sans-serif;"'+ '학년 /' + '/span>' +
        '<span style="font-size: 14px; color: red; font-family: Noto Sans KR Regular, sans-serif;"'+ '*' + '/span>' +
        '<span style="font-size: 14px; color: #666666; font-family: Noto Sans KR Regular, sans-serif;"'+ '분기 /학기'  + '/span>';

		var notificationText = "<p> <span style=\"color:black;font-size:15px;\"> ※  </span> " +
        "<span style=\"color:red;font-size:15px;\"> ▲ </span> <span style=\"color:black;font-size:15px;\"> (전년도 대비 증가), </span>" +
        "<span style=\"color:blue;font-size:15px;\"> ▼ </span> <span style=\"color:black;font-size:15px;\"> (전년도 대비 감소), </span>" +
        "<span style=\"color:black;font-size:15px;\"> - 변동없음 </span>" ;
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [new sap.m.Label({
				text : oBundleText.getText("LABEL_1160"), // 1160:학년 / 분기 / 학기
				required : true,
				visible : {
					parts : [ {path : "Affil"}],
					formatter : function(fVal1){
						if((fVal1 != "900" )) return true;
						else return false;
					}
				}
			}).addStyleClass("FontFamilyBold"),
			
			new sap.ui.commons.FormattedTextView({
					htmlText : notificationText,
					visible : {
						parts : [ {path : "Affil"}],
						formatter : function(fVal1){
							if((fVal1 == "900" )) return true;
							else return false;
						}
					}
			})
			]	
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [ new sap.m.ComboBox(oController.PAGEID + "_Grdsp",{
								selectedKey : "{Grdsp}",
								editable : {
									path : "ZappStatAl",
									formatter : function(fVal){
										if(fVal == "" || fVal == "10") return true;
										else return false;
									}
								},
							    width : "50%",
							}),
							new sap.m.ToolbarSpacer({width : "10px"}),
							new sap.m.ComboBox(oController.PAGEID + "_Divcd",{
								selectedKey : "{Divcd}",
								editable : {
									path : "ZappStatAl",
									formatter : function(fVal){
										if(fVal == "" || fVal == "10") return true;
										else return false;
									}
								},
								change : oController.onChangeDivcd,
								width : "50%",
							}) ]
			}).addStyleClass("ToolbarNoBottomLine")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0123"), required : true}).addStyleClass("FontFamilyBold"),	// 123:수혜년도
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		var curYear = new Date().getFullYear();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		content : new sap.m.Toolbar({
			content : [ new sap.m.ComboBox(oController.PAGEID + "_Zyear",{
				width : "120px",
				selectedKey : "{Zyear}",
				editable : {
					path : "ZappStatAl",
					formatter : function(fVal){
						if(fVal == "" || fVal == "10") return true;
						else return false;
					}
				},
				items : [new sap.ui.core.Item({text : curYear, key : curYear}),
						 new sap.ui.core.Item({text : curYear-1, key : curYear-1}),
						 new sap.ui.core.Item({text : curYear-2, key : curYear-2}),
						 new sap.ui.core.Item({text : curYear-3, key : curYear-3})],
				change : oController.onChangeZyear 
				}).addStyleClass("FontFamily"),
				],
			}).addStyleClass("ToolbarNoBottomLine")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1153")}).addStyleClass("FontFamilyBold"),	// 1153:특수교육비 여부
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :  new sap.m.Toolbar({
				content : [new sap.m.CheckBox({
							selected : "{Speyn}",
							editable : {
								parts : [ {path : "ZappStatAl"},{path : "Affil"}], // 특수교육일 경우에는 특수교육비를 read only 처리
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2 != "900") return true;
									else return false;
								}
							},
				}).addStyleClass("FontFamily"),  ]
				}).addStyleClass("ToolbarNoBottomLine")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1157")}).addStyleClass("FontFamilyBold"),	// 1157:학교소재지
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Input({
								width : "100%",
								value : "{Locat}",
								editable : {
										path : "ZappStatAl",
										formatter : function(fVal){
											if(fVal == "" || fVal == "10") return true;
											else return false;
										}
									},
								maxLength : common.Common.getODataPropertyLength("ZHR_SCHOOL_EXP_SRV", "SchoolExpensesAppl", "Locat")
								}).addStyleClass("FontFamily")]
					}).addStyleClass("ToolbarNoBottomLine")
		}).addStyleClass("MatrixData ");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0096")}).addStyleClass("FontFamilyBold"),	// 96:비고
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
					content : [new sap.m.Input({
					value : "{Zbigo}",
					width : "100%",
					editable : {
						path : "ZappStatAl",
						formatter : function(fVal){
							if(fVal == "" || fVal == "10") return true;
							else return false;
						}
					},
					maxLength : common.Common.getODataPropertyLength("ZHR_SCHOOL_EXP_SRV", "SchoolExpensesAppl", "Zbigo")
				}).addStyleClass("FontFamily")]
			}).addStyleClass("ToolbarNoBottomLine"),
			colSpan : 3
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		var oApplyInfoMatrix2 = new sap.ui.commons.layout.MatrixLayout({
			columns : 7,
			widths : ['7%','13%','13%', ,'13%','13%','7%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1147") }).addStyleClass("FontFamilyBold"),	// 1147:입학금
			hAlign : "Center"
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1142")}).addStyleClass("FontFamilyBold"),	// 1142:수업료
			hAlign : "Center"
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1139")}).addStyleClass("FontFamilyBold"),	// 1139:기성회비/학교운영지원비
			hAlign : "Center"
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0109")}).addStyleClass("FontFamilyBold"),	// 109:기타
			hAlign : "Center"
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0142")}).addStyleClass("FontFamilyBold"),	// 142:합계
			hAlign : "Center"
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1152")}).addStyleClass("FontFamilyBold"),	// 1152:통화키
			hAlign : "Center"
		}).addStyleClass("MatrixLabel3"); 
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
					 text : oBundleText.getText("LABEL_0044")	// 44:신청
					}).addStyleClass("FontFamilyBold"),
			hAlign : "Center"
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
					 value : "{ZbetEntr}",
					 textAlign : "Right",
					 width : "100%",
						editable : {
							parts : [ {path : "ZappStatAl"},{path : "ZDivcdST"}],
							formatter : function(fVal1, fVal2){
								if((fVal1 == "" || fVal1 == "10") && fVal2 == "") return true;
								else return false;
							}
						},
					change : oController.onCalTotal
					}).addStyleClass("FontFamily"),
					hAlign : "Center"
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				value : "{ZbetClas}",
				textAlign : "Right",
				width : "100%",
				editable : {
					parts : [ {path : "ZappStatAl"},{path : "ZDivcdST"}],
					formatter : function(fVal1, fVal2){
						if((fVal1 == "" || fVal1 == "10") && fVal2 == "") return true;
						else return false;
					}
				},
				change : oController.onCalTotal
			}).addStyleClass("FontFamily"),
			hAlign : "Center"
		}).addStyleClass("MatrixData")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				value : "{ZbetOper}",
				width : "100%",
				textAlign : "Right",
				editable : {
					parts : [ {path : "ZappStatAl"},{path : "ZDivcdST"}],
					formatter : function(fVal1, fVal2){
						if((fVal1 == "" || fVal1 == "10") && fVal2 == "") return true;
						else return false;
					}
				},
				change : oController.onCalTotal
			}).addStyleClass("FontFamily"),
			hAlign : "Center"
		}).addStyleClass("MatrixData")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				value : "{ZbetEtc}",
				width : "100%",
				textAlign : "Right",
				editable : {
					parts : [ {path : "ZappStatAl"},{path : "ZDivcdST"}],
					formatter : function(fVal1, fVal2){
						if((fVal1 == "" || fVal1 == "10") && fVal2 == "") return true;
						else return false;
					}
				},
				change : oController.onCalTotal
			}).addStyleClass("FontFamily"),
			hAlign : "Center"
		}).addStyleClass("MatrixData")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				value : "{ZbetTotl}",
				width : "100%",
				textAlign : "Right",
				editable : false
			}).addStyleClass("FontFamily"),
			hAlign : "Center"
		}).addStyleClass("MatrixData")
		oRow.addCell(oCell);
		
		var oWaers = new sap.m.ComboBox({
			selectedKey : "{Waers}",
			width : "100%",
			editable : {
				parts : [ {path : "ZappStatAl"},{path : "ZDivcdST"}],
				formatter : function(fVal1, fVal2){
					if((fVal1 == "" || fVal1 == "10") && fVal2 == "") return true;
					else return false;
				}
			},
		}).addStyleClass("FontFamily");
		
		var oWaers2 = new sap.m.ComboBox({
			selectedKey : "{Waers2}",
			width : "100%",
			editable : false,
		}).addStyleClass("FontFamily");
		
		var mSchoolWaersList = sap.ui.getCore().getModel("SchoolWaersList");
		for(var i = 0; i < mSchoolWaersList.getProperty("/Data").length ; i++){
			var vData = mSchoolWaersList.getProperty("/Data/" +i );
			oWaers.addItem(new sap.ui.core.Item({text : vData.Waerstx, key : vData.Waers}));
			oWaers2.addItem(new sap.ui.core.Item({text : vData.Waerstx, key : vData.Waers}));
		}
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oWaers,
			hAlign : "Center"
		}).addStyleClass("MatrixData")
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
					 text : oBundleText.getText("LABEL_1151")	// 1151:지급
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center"
		}).addStyleClass("MatrixData")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
					 text : "{ZbetEntr2}"
					}).addStyleClass("FontFamily"),
					hAlign : "Right"
		}).addStyleClass("MatrixData PaddingRight15")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
					 text : "{ZbetClas2}",
					}).addStyleClass("FontFamily"),
					hAlign : "Right"
		}).addStyleClass("MatrixData PaddingRight15")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
					 text : "{ZbetOper2}",
					}).addStyleClass("FontFamily"),
					hAlign : "Right"
		}).addStyleClass("MatrixData PaddingRight15")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
					 text : "{ZbetEtc2}",
					}).addStyleClass("FontFamily"),
					hAlign : "Right"
		}).addStyleClass("MatrixData PaddingRight15")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
					 text : "{ZbetTotl2}",
					}).addStyleClass("FontFamily"),
					hAlign : "Right"
		}).addStyleClass("MatrixData PaddingRight15")
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oWaers2,
			hAlign : "Center"
		}).addStyleClass("MatrixData")
		oRow.addCell(oCell);
		oApplyInfoMatrix2.addRow(oRow);
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						   new sap.m.ToolbarSpacer({width: "5px"}),
					       new sap.m.Text({text : oBundleText.getText("LABEL_0047") }).addStyleClass("MiddleTitle"),	// 47:신청내역
					       new sap.m.ToolbarSpacer(),
					       new sap.m.MessageStrip({
					    	   text : oBundleText.getText("LABEL_1167"),	// 1167:학과명은 대학교인 경우만 입력하세요.
							   type : "Success" ,
							   showIcon : true ,
							   customIcon : "sap-icon://message-information", 
							   showCloseButton : false,
					       }),
					       new sap.m.ToolbarSpacer({width: "5px"}),
					       new sap.m.Button({
								text: oBundleText.getText("LABEL_0137"),	// 137:지급내역보기
								type : "Ghost",
								press : oController.onPressHistory ,
								visible : { path : "Pernr",
										    formatter : function(fVal){
										    	if(fVal && fVal != "") return true;
										    	else return false;
										    }
								}
						   }).addStyleClass("FontFamily"),
				]
			}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 
			oApplyInfoMatrix, 
			new sap.ui.core.HTML({content : "<div style='height : 20px;'/>"}),
			oApplyInfoMatrix2 ],
		});
	},
});