sap.ui.jsfragment("ZUI5_HR_LicensePay.fragment.LicensePayPage02", {
	
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
			this.getApplyInfoRender(oController),									// 신청항목
			sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController),			// 첨부파일
			sap.ui.jsfragment("fragment.ApplyLayout", oController),					// 신청자 
			sap.ui.jsfragment("fragment.ApprovalInformationLayout", oController),	// 결재내역
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
									text : ""
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
					content : new sap.m.Label({text : oBundleText.getText("LABEL_0080"), required : true}).addStyleClass("FontFamilyBold")	// 80:신청구분
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		
		var oModel = sap.ui.getCore().getModel("ZHR_EXTRA_PAY_SRV");
		var oPregb = new sap.m.ComboBox({
			width : "300px" ,
			selectedKey : "{Pregb}",
			editable : {
				parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
				formatter : function(fVal1, fVal2){
					if(fVal1 == "" || fVal1 == "10" && fVal2) return true;
					else return false;
				}
			},
			change : oController.onChangePregb
		}).addStyleClass("FontFamily");

		oModel.read("/PregbCodeListSet", 
			    null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							oPregb.addItem(new sap.ui.core.Item({key : data.results[i].Pregb, text : data.results[i].Pregbt}));
						}
					}
				},
				function(Res){
				}
		);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [oPregb]
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : {
						path : "Pregb",
						formatter : function(fVal){
							if(fVal == "B") return oBundleText.getText("LABEL_1343");	// 1343:해임일
							else return oBundleText.getText("LABEL_1334");	// 1334:선임일
						}
					}, required : true}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.DatePicker(oController.PAGEID + "_Prdat",{
								valueFormat : "yyyy-MM-dd",
					            displayFormat : "yyyy.MM.dd",
					            value : "{Prdat}",
								width : "150px",
								editable : {
									parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Pregb"}],
									formatter : function(fVal1, fVal2, fVal3){
										if((fVal1 == "" || fVal1 == "10") && fVal2 && fVal3 && fVal3!= "") return true;
										else return false;
									}
								},
//								change : oController.onSearchCttyp
								change : function(){
									var vPregb = oController._DetailJSonModel.getProperty("/Data/Pregb");
									if(vPregb == "A"){
										// 선임일 변경 시 자격면허증 초기화
										oController._DetailJSonModel.setProperty("/Data/Cttyp","");
										
										oController.onSearchCttyp();
									}
								}
							}).addStyleClass("FontFamily")]
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1339"), required : true}).addStyleClass("FontFamilyBold")	// 1339:자격선임 유형
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.ComboBox(oController.PAGEID + "_Ctqua",{
									width : "300px",
									selectedKey : "{Ctqua}",  
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2, fVal3){
											if(fVal1 == "" || fVal1 == "10" && fVal2 != "") return true;
											else return false;
										}
									},
									change : oController.onchangeCtqua
							   }).addStyleClass("FontFamily")]
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1336")}).addStyleClass("FontFamilyBold")	// 1336:자격면허 등급
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		
		var oCtgrd = new sap.m.ComboBox(oController.PAGEID + "_Ctgrd",{
			width : "300px" ,
			selectedKey : "{Ctgrd}",
			editable : {
				parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Pregb"}],
				formatter : function(fVal1, fVal2, fVal3){
					if((fVal1 == "" || fVal1 == "10" ) && fVal2 != "" && fVal3 == "A") return true;
					else return false;
				}
			},
			change : oController.onChangeCtgrd
		}).addStyleClass("FontFamily");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [oCtgrd]
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1341")}).addStyleClass("FontFamilyBold")	// 1341:자격수당 금액
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content :new sap.m.Text({text : "{Ctpay}", textAlign : "Begin"}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1342") }).addStyleClass("FontFamilyBold")	// 1342:자격수당 사유
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content :new sap.m.Text({text : "{Ctrsnt}", textAlign : "Begin"}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1338")}).addStyleClass("FontFamilyBold")	// 1338:자격면허증
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		
		var oCttyp = new sap.m.ComboBox(oController.PAGEID +"_Cttyp",{
			width : "300px" ,
			selectedKey : "{Cttyp}",
			editable : {
				parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Pregb"}, {path : "Prdat"}, {path : "Ctgrd"}],
				formatter : function(fVal1, fVal2, fVal3, fVal4, fVal5){
					if((fVal1 == "" || fVal1 == "10" ) && fVal2 != "" && fVal3 == "A" && !common.Common.checkNull(fVal4) && !common.Common.checkNull(fVal5)) return true;
					else return false;
				}
			},
			 visible : {
				 path : "Pregb",
				 formatter : function(fVal){
					 return fVal == "A";  // 선임일 경우 Display
				 }
			 },
		}).addStyleClass("FontFamily");
		
		var oCttyp2 = new sap.m.Input({
			 value : "{Cttypt}", 
			 editable : false,
			 visible : {
				 path : "Pregb",
				 formatter : function(fVal){
					 return fVal == "B"; // 해임일 경우 Display
				 }
			 },
			 width : "100%"
       }).addStyleClass("FontFamily");
       
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ 
							oCttyp,
							oCttyp2
						]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1340"),	// 1340:자격선임일
						visible : {  
							path : "Pregb",
							formatter : function(fVal){
								if(fVal == "B") return true ; // 해임 경우에만 Display
								else return false;
							}
						}
					}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content :new sap.m.Text({text : "{Preda}", 
						                     textAlign : "Begin",
						                     visible : {  
													path : "Pregb",
													formatter : function(fVal){
														if(fVal == "B") return true ; // 해임 경우에만 Display
														else return false; 
													}
											}
					}).addStyleClass("FontFamily")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1332")}).addStyleClass("FontFamilyBold")	// 1332:등록처
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
						 value : "{Zregi}", 
					     textAlign : "Begin",
					     maxLength : common.Common.getODataPropertyLength("ZHR_EXTRA_PAY_SRV", "CertificatePay", "Zregi"),
					     editable : {
							parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Pregb"}],
							formatter : function(fVal1, fVal2, fVal3){
								if((fVal1 == "" || fVal1 == "10" ) && fVal2 && fVal3 && fVal3 == "A" ) return true;
								else return false;
							}
						 },
					     width : "100%"
	                }).addStyleClass("FontFamily"),
	                colSpan : 3
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_0096")}).addStyleClass("FontFamilyBold")	// 96:비고
				}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
						 value : "{Zbigo}", 
					     textAlign : "Begin",
					     maxLength : common.Common.getODataPropertyLength("ZHR_EXTRA_PAY_SRV", "CertificatePay", "Zbigo"),
					     editable : {
							parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Pregb"}],
							formatter : function(fVal1, fVal2, fVal3){
								if((fVal1 == "" || fVal1 == "10" ) && fVal2 && fVal3 && fVal3 == "A" ) return true;
								else return false;
							}
						 },
						 width : "100%"
	                }).addStyleClass("FontFamily"),
	                colSpan : 3
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [new sap.m.Toolbar({
						design : sap.m.ToolbarDesign.Auto,
						content : [
							new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
							new sap.m.ToolbarSpacer({width: "5px"}),
							new sap.m.Text({
								text : oBundleText.getText("LABEL_0047") 	// 47:신청내역
							}).addStyleClass("MiddleTitle")
						]
					}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 
					oApplyInfoMatrix]
		});
	},
});