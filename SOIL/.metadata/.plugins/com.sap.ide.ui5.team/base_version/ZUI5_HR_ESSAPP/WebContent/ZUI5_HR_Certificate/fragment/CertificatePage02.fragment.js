sap.ui.jsfragment("ZUI5_HR_Certificate.fragment.CertificatePage02", {
	
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
			this.getAddApplyInfoRender(oController),									// 추가 신청내역
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
									new sap.m.Button({text : oBundleText.getText("LABEL_0044"),	// 44:신청
										press : oController.onPressSaveC,
										visible : {
											path : "ZappStatAl",
											formatter : function(fVal) {
												return (fVal == "" || fVal == "10") ? true : false;
											}
										}
									}),
									new sap.m.Button(oController.PAGEID + "_PrintBtn",{
										text : oBundleText.getText("LABEL_1291"), type : "Default" , icon :"sap-icon://hr-approval" ,	// 1291:인쇄
									  	press : oController.onPressPrint ,
									  	visible : {
											  parts : [{path : "ZappStatAl"}, {path : "Pntck"}],
											  formatter : function(fVal1, fVal2){
												   if(fVal1 == "50" && fVal2 == "") return true;
												   else return false;
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
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1297"), required : true}).addStyleClass("FontFamilyBold"),	// 1297:증명서종류
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		var oModel = sap.ui.getCore().getModel("ZHR_CERTY_SRV");

		var oCerty = new sap.m.Select({
			width : "100%" ,
			selectedKey : "{Certy}",
			change : oController.onChangeCerty,
			enabled : {
				parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
				formatter : function(fVal1, fVal2){
					if(fVal1 == "" || fVal1 == "10" && fVal2) return true;
					else return false;
				}
			},
		});
		oController._vCerty = []; 
		oCerty.addItem(new sap.ui.core.Item({key : "", text : ""}));
		oModel.read("CertipicateObjlistSet?$filter=Actty eq '" + _gAuth + "'", 
			    null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							oCerty.addItem(new sap.ui.core.Item({key : data.results[i].Certy, text : data.results[i].Certyt}));
							oController._vCerty.push(data.results[i]);
						}
					}
				},
				function(Res){
				}
			);
		
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oCerty
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1286") , required : true}).addStyleClass("FontFamilyBold"),	// 1286:신청부수
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "100px",
				value : "{Reqnt}",
				type : "Number",
				liveChange : function(evt){
					var fVal = evt.getSource().getValue() ;
					if(fVal && fVal.length > 2) this.setValue(fVal.substring(0,2));
				},
				editable : {
					parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
					formatter : function(fVal1, fVal2){
						if(fVal1 == "" || fVal1 == "10" && fVal2) return true;
						else return false;
					}
				},
			}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1289"), required : true}).addStyleClass("FontFamilyBold"),	// 1289:용도구분
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		var oUsety = new sap.m.Select({
			width : "100%" ,
			selectedKey : "{Usety}",
			enabled : {
				parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
				formatter : function(fVal1, fVal2){
					if(fVal1 == "" || fVal1 == "10" && fVal2) return true;
					else return false;
				}
			},
		})
		oUsety.addItem(new sap.ui.core.Item({key : "", text : ""}));
		oModel.read("CertipicateUselistSet", 
			    null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							oUsety.addItem(new sap.ui.core.Item({key : data.results[i].Usety, text : data.results[i].Usetyt}));
						}
					}
				},
				function(Res){
				}
			);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oUsety
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1293"), required : true}).addStyleClass("FontFamilyBold"),	// 1293:제출처
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
							value : "{Sendp}",
							width : "100%",
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									if(fVal1 == "" || fVal1 == "10" && fVal2) return true;
									else return false;
								}
							},
							maxLength : common.Common.getODataPropertyLength("ZHR_CERTY_SRV", "CertipicateAppl", "Sendp")
						}).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0323")}).addStyleClass("FontFamilyBold"),	// 323:신청사유
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "100%",
				value : "{Aprsn}",
				maxLength : common.Common.getODataPropertyLength("ZHR_CERTY_SRV", "CertipicateAppl", "Aprsn"),
				editable : {
					parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
					formatter : function(fVal1, fVal2){
						if(fVal1 == "" || fVal1 == "10" && fVal2) return true;
						else return false;
					}
				},
			   }).addStyleClass("FontFamily") ,
			colSpan : 3,
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0096")}).addStyleClass("FontFamilyBold"),	// 96:비고
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "100%",
				value : "{Bigo}",
				maxLength : common.Common.getODataPropertyLength("ZHR_CERTY_SRV", "CertipicateAppl", "Zbigo"),
				editable : {
					parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
					formatter : function(fVal1, fVal2){
						if(fVal1 == "" || fVal1 == "10" && fVal2) return true;
						else return false;
					}
				},
			   }).addStyleClass("FontFamily") ,
			colSpan : 3,
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_CertyRow1",{height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1288"), required : true}).addStyleClass("FontFamilyBold"),	// 1288:영문성명
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				value : "{Engnm}",
				editable : false ,
				width :"100%"
			   }).addStyleClass("FontFamily") ,
			colSpan : 3
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		var oAddress1 = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			widths : ['170px',]
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "150px",
				value : "{Pstlz}" ,
				editable : false
			}).addStyleClass("FontFamily")
		}); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
						width : "100%",
						editable : false ,
						value : "{Addk1}"
				   }).addStyleClass("FontFamily"),
		});
		oRow.addCell(oCell);
		oAddress1.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_CertyRow2",{height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0336") , required : true}).addStyleClass("FontFamilyBold"),	// 336:주소
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oAddress1,
			colSpan : 3,
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		var oAddress2 = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			widths : ['170px',]
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "150px",
				value : "{Pstlz}" ,
				editable : false
			}).addStyleClass("FontFamily")
		}); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
						width : "100%",
						editable : false ,
						value : "{Adde1}"
				   }).addStyleClass("FontFamily"),
		});
		oRow.addCell(oCell);
		oAddress2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_CertyRow3",{height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1287") , required : true}).addStyleClass("FontFamilyBold"),	// 1287:영문 주소
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oAddress2,
			colSpan : 3,
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		var oCertyRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_CertyRow4", {
			height : "30px", 
		});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1284") , required : true}).addStyleClass("FontFamilyBold"),	// 1284:발행년도
		}).addStyleClass("MatrixLabel"); 
		oCertyRow.addCell(oCell);
		
		var oIyearLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		});
		oIyearLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : new sap.m.Input(oController.PAGEID + "_Iyear",{
						value : "{Iyear}",
						width : "100%",
						type : "Number",
						editable : {
							parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
							formatter : function(fVal1, fVal2){
								if(fVal1 == "" || fVal1 == "10" && fVal2) return true;
								else return false;
							}
						},
						maxLength : common.Common.getODataPropertyLength("ZHR_CERTY_SRV", "CertipicateAppl", "Iyear")
					}).addStyleClass("FontFamily"),
				})
		);
		oIyearLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : new sap.m.Text({text : "~" , 
						visible : {
							parts : [{path : "ZappStatAl"}, {path : "Certy"}, ], 
							formatter : function(fVal1, fVal2){
								if(fVal1 == "" && fVal2 && fVal2 == "C1") return true;
								else return false;
							}
						},
						textAlign : "Center"}).addStyleClass("FontFamily PaddingLeft10 PaddingRight10 PaddingTop5"),
				})
		);
		oIyearLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : new sap.m.Input(oController.PAGEID + "_IyearTo",{
						value : "{IyearTo}",
						width : "100%",
						type : "Number",
						editable : {
							parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path:"Iyear"}],
							formatter : function(fVal1, fVal2, fVal3){
								if(fVal1 == "" || fVal1 == "10" && fVal2 && fVal3 && fVal3 != "0000") return true;
								else return false;
							}
						},
						visible : {
							parts : [{path : "ZappStatAl"}, {path : "Certy"}, ], 
							formatter : function(fVal1, fVal2){
								if(fVal1 == "" && fVal2 && fVal2 == "C1") return true;
								else {
									oController._DetailJSonModel.setProperty("/Data/IyearTo", "");
									return false;
								}
							}
						},
						maxLength : common.Common.getODataPropertyLength("ZHR_CERTY_SRV", "CertipicateAppl", "IyearTo")
					}).addStyleClass("FontFamily"),
				
				})
		);
		oIyearLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Text({
									text : "( "+oBundleText.getText("LABEL_1290")+" )"	// 1290:원천징수
							   }).addStyleClass("FontFamilyBold PaddingTop5 PaddingLeft10")]
				})
		);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oIyearLayout ,
			colSpan : 3
		}).addStyleClass("MatrixData");
		oCertyRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oCertyRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : oBundleText.getText("LABEL_1299")}).addStyleClass("FontFamily"),	// 1299:※  재직증명서 신청시 본인의 인사정보(사원프로파일 > 주소)의 주소/영문  성명/영문주소지를 모두 확인바랍니다.
			colSpan : 4 ,
			vAlign : "Bottom"
		}); 
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.FormattedTextView({htmlText : "&nbsp;&nbsp;&nbsp;&nbsp;" + oBundleText.getText("LABEL_1300")}).addStyleClass("FontFamily"),	// 1300:신청사유란에는 제출처를 포함한 구체적인 신청사유를 기입바랍니다.
			colSpan : 4
		}); 
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.commons.FormattedTextView({htmlText : "&nbsp;&nbsp;&nbsp;&nbsp;" + oBundleText.getText("LABEL_1301")}).addStyleClass("FontFamily "),	// 1301:(예 : 본인의 OO은행 1,000만원 대출용 등)
			colSpan : 4
		}); 
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		var oApplyInfoPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [  new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [
					   new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					   new sap.m.ToolbarSpacer({width: "5px"}),
				       new sap.m.Text({text : oBundleText.getText("LABEL_1294") }).addStyleClass("MiddleTitle"),	// 1294:증명서 신청현황
				       new sap.m.ToolbarSpacer({}),
				       new sap.m.Button({
							text: oBundleText.getText("LABEL_0482"),	// 추가
							type : "Ghost",
							press : oController.onAddApply,
							visible : {
								parts : [{path : "ZappStatAl"}], 
								formatter : function(fVal1){
									if(fVal1 == "") return true;
									else return false;
								}
							},
					   }),
				]
			}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),
			oApplyInfoMatrix ],
		});
		
		return oApplyInfoPanel;
	},
	
	/**
	 * 신청내역 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getAddApplyInfoRender : function(oController) {
		return new sap.m.Panel(oController.PAGEID + "_AddInfoPanel",{
			expandable : false,
			expanded : false,
			content : [  
			new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				height : "20px",
				content : [
					   new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					   new sap.m.ToolbarSpacer({width: "5px"}),
				       new sap.m.Text({text : oBundleText.getText("LABEL_2667") }).addStyleClass("MiddleTitle"),	// 2667:추가신청
				]
			}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
			], 
		});
	},
});