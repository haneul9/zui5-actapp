jQuery.sap.require("common.SearchActivity");

sap.ui.jsfragment("ZUI5_HR_DomesticBTripCal.fragment.DomesticBTripCalPage02", {
	
	createContent : function(oController) {
		
		return [
			new sap.ui.commons.layout.VerticalLayout({
				width : "100%",
				content : [
					this.getPageAllContentRender(oController)
				] 
			})
			.addStyleClass("sapUiSizeCompact")
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
			this.getTitleRender(oController),
			sap.ui.jsfragment("fragment.ApplyInformationLayout", oController),		// 신청안내
			sap.ui.jsfragment("fragment.TargetLayout", oController),				// 대상자
			this.getApplyInfoRender(oController),									// 신청내역
			this.getDetailTable(oController),										// 상세내역
			this.getCalculationInfoRender(oController),								// 정산
			this.getCompanionInfoRender(oController),									// 동행
			sap.ui.jsfragment("fragment.CCSInformationLayout", oController),        // 법인카드 내역
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
	 * 타이틀 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getTitleRender : function(oController){
		var oCell, oRow;	
		var oTitleMatrix = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 1,
			width : "100%"
		});		 
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				height : "20px",
				content : [ new sap.m.Image({
								src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_A.png",
							}),
							new sap.m.Text(oController.PAGEID + "_DetailTitle").addStyleClass("Font18px FontColor0"),
						    new sap.m.ToolbarSpacer(),
						  ]
				}).addStyleClass("ToolbarNoBottomLine"),
		});
		oRow.addCell(oCell);
		oTitleMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({	
				content : [ new sap.m.Toolbar(oController.PAGEID + "_ManualToolbar",{	
							}).addStyleClass("ToolbarNoBottomLine NoMarginLeft"),
							new sap.m.ToolbarSpacer(),
							new sap.m.Button({
								text : oBundleText.getText("LABEL_0022"), 	// 22:뒤로
								press : oController.onBack
							}),
							new sap.m.Button({
								text : oBundleText.getText("LABEL_0005"), 	// 결재지정
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
								text : oBundleText.getText("LABEL_0058"), 	// 58:임시저장
								press : oController.onPressSaveT,
								visible : {
									path : "ZappStatAl",
									formatter : function(fVal){
										if(fVal == "" || fVal == "10") return true;
										else return false;
									}
								}
							}),
							new sap.m.Button({
								text : oBundleText.getText("LABEL_0033"), 	// 33:삭제
								press : oController.onDelete ,
								visible : {
									path : "ZappStatAl",
									formatter : function(fVal){
										if(fVal == "10") return true;
										else return false;
									}
								}
							}),
							new sap.m.Button({
								text : oBundleText.getText("LABEL_0044"), 	// 44:신청
								press : oController.onPressSaveC ,
								visible : {
									path : "ZappStatAl",
									formatter : function(fVal){
										if(fVal == "" || fVal == "10") return true;
										else return false;
									}
								}
							})
						]
				}).addStyleClass("ToolbarNoBottomLine NoMarginLeft"),
		});
		oRow.addCell(oCell);
		oTitleMatrix.addRow(oRow);
		
		return oTitleMatrix;
	},
	
	/**
	 * 신청내역 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getApplyInfoRender : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1214"),	// 1214:출장명령서번호
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
								    value : "{Docno2}",
								    width : "150px",
								    editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									valueHelpOnly : true,
									showValueHelp : true,
									valueHelpRequest: oController.openHistoryDialog,
								}).addStyleClass("Font14px FontColor6"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : ""
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0624")	// 624:근무조
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{SchkztxLong}",
									width : "100%",
									editable : false,
								}).addStyleClass("Font14px FontColor6"),
							]
						}).addStyleClass("ToolbarNoBottomLine"),
						colSpan : 3
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							//기간
							text : oBundleText.getText("LABEL_1204")	// 1204:기간
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Begtr2}",
							    	width : "150px",
							    	editable : false
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.Text({text : "~" , textAlign : "Center"}).addStyleClass("Font14px FontColor6 PaddingRight5"),
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Endtr2}",
							    	width : "150px",
							    	editable : false
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.ToolbarSpacer({ width : "10px" }),
								new sap.m.Text({
								    text : {
										parts : [ {path : "Begtr2"},{path : "Endtr2"}],
										formatter : function(fVal1, fVal2){
											if(!common.Common.checkNull(fVal1) && !common.Common.checkNull(fVal2)){
												vPeriod =parseInt(common.Common.calDate(fVal2, fVal1));
												if(vPeriod < 0) vPeriod = vPeriod - 1 ;
												else vPeriod = vPeriod + 1 ;
												return "(" + vPeriod + "일)"
											}else return "";
										}
									},
									textAlign : "Center"}).addStyleClass("Font14px FontBold FontColor3"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							//기간
							text : oBundleText.getText("LABEL_1252")	// 1252:일정변경
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	required : true,
							    	value : "{Begtr}",
							    	width : "150px",
						    	    editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
										formatter : function(fVal1, fVal2, fVal3){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
										}
									},
									change : function(oEvent){
							    		oController.onChangeDate(oEvent);
							    		
							    		oController.setFactoryActivity(oController);
							    	}
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.Text({text : "~" , textAlign : "Center"}).addStyleClass("Font14px FontColor6 PaddingRight5"),
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	required : true,
							    	value : "{Endtr}",
							    	width : "150px",
						    	    editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
										formatter : function(fVal1, fVal2, fVal3){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
										}
									},
							    	change : oController.onChangeDate
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.ToolbarSpacer({ width : "10px" }),
								new sap.m.Text({text : {
									parts : [ {path : "Begtr"},{path : "Endtr"}],
									formatter : function(fVal1, fVal2){
										if(!common.Common.checkNull(fVal1) && !common.Common.checkNull(fVal2)){
											vPeriod =parseInt(common.Common.calDate(fVal2, fVal1));
											if(vPeriod < 0) vPeriod = vPeriod - 1 ;
											else vPeriod = vPeriod + 1 ;
											return "(" + vPeriod + "일)"
										}else return "";
									}
								},
								textAlign : "Center"}).addStyleClass("Font14px FontBold FontColor3"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							//출장시간
							text : oBundleText.getText("LABEL_1257")	// 1257:출장시간
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							height : "30px",
							content : [
								new sap.m.TimePicker({
									valueFormat : "HHmm",
									displayFormat : "HH:mm",
						            textAlign : sap.ui.core.TextAlign.Begin,
									value : "{Beguz}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Begtr"}, {path : "Endtr"}, {path : "Begtr2"}, {path : "Endtr2"}],
										formatter : function(fVal1, fVal2, fVal3, fVal4, fVal5, fVal6){
											if((fVal1 == "" || fVal1 == "10") && fVal2){
												// 변경시간을 입력하였을 경우 
												if(!common.Common.checkNull(fVal3) || !common.Common.checkNull(fVal4)){
													if(common.Common.checkNull(fVal3) || common.Common.checkNull(fVal4) || fVal3 != fVal4) return false;
													else return true;
													// 기존 시간으로 체크
												}else if(!common.Common.checkNull(fVal5) || !common.Common.checkNull(fVal6)){
													if(common.Common.checkNull(fVal5) || common.Common.checkNull(fVal6) || fVal5 != fVal6) return false;
													else return true;
												}else return false;			 

											}
											else return false;
										}
									},
								    width : "150px",
								    change : oController.onChangeTime
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.Text({text : "~" , textAlign : "Center"}).addStyleClass("Font14px FontColor6 PaddingRight5"),
								new sap.m.TimePicker({
									valueFormat : "HHmm",
									displayFormat : "HH:mm",
						            textAlign : sap.ui.core.TextAlign.Begin,
									value : "{Enduz}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Begtr"}, {path : "Endtr"}, {path : "Begtr2"}, {path : "Endtr2"}],
										formatter : function(fVal1, fVal2, fVal3, fVal4, fVal5, fVal6){
											if((fVal1 == "" || fVal1 == "10") && fVal2){
												// 변경시간을 입력하였을 경우 
												if(!common.Common.checkNull(fVal3) || !common.Common.checkNull(fVal4)){
													if(common.Common.checkNull(fVal3) || common.Common.checkNull(fVal4) || fVal3 != fVal4) return false;
													else return true;
													// 기존 시간으로 체크
												}else if(!common.Common.checkNull(fVal5) || !common.Common.checkNull(fVal6)){
													if(common.Common.checkNull(fVal5) || common.Common.checkNull(fVal6) || fVal5 != fVal6) return false;
													else return true;
												}else return false;			 

											}
											else return false;
										}
									},
								    width : "150px",
								    change : oController.onChangeTime
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.ToolbarSpacer({width : "10px"}),
								new sap.m.Input({
									value : "{Hour}",
									width : "50px",
									editable : false,
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_1248")	// 1248:시
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.Input({
									value : "{Minute}",
									width : "50px",
									editable : false,
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_1244")	// 1244:분
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.MessageStrip({
							    	   text : oBundleText.getText("LABEL_1205"),	// 1205:당일출장에 한해서 출장시간 기재
						        	   type : "Error",
									   showIcon : true ,
									   customIcon : "sap-icon://message-information", 
									   showCloseButton : false,
						       })
								
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							//예산구분
							text : oBundleText.getText("LABEL_1250"),	// 1250:예산구분
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								 new sap.m.ComboBox({
							            items : {
							            	path: "ZHR_BUSITRIP_PAY_DOM_SRV>/BudgeListSet",
											filters : [
												{sPath : 'Langu', sOperator : 'EQ', oValue1 : '3'}
											],
							            	template: new sap.ui.core.ListItem({
							            		key: "{ZHR_BUSITRIP_PAY_DOM_SRV>Budge}",
							            		text: "{ZHR_BUSITRIP_PAY_DOM_SRV>Budgetx}"
							            	})
							            },
							            editable : {
											parts : [{path : "ZappStatAl"}, {path : "Pernr"},{path : "Docno2"}],
											formatter : function(fVal1, fVal2, fVal3) {
												return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
											}
										},
										change : oController.onChangeBudge,
							            selectedKey: "{Budge}",
										width : "200px"
								   }).addStyleClass("Font14px FontColor6"),
						]}).addStyleClass("ToolbarNoBottomLine"),
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : "Cost Center/WBS", 
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
								    value : "{Kospostx}",
									editable : false ,
									width : "250px"
								}).addStyleClass("Font14px FontColor6 PaddingRight5"),
								new sap.m.Input({
								    value : "{KospostxT}",
									editable : false ,
									width : "100%"
								}).addStyleClass("Font14px FontColor6"),
								
						]}).addStyleClass("ToolbarNoBottomLine"),
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							//용무
							text : oBundleText.getText("LABEL_1210"),	// 1210:용무
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
								    value : "{Busin}",
								    editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
										formatter : function(fVal1, fVal2, fVal3){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
										}
									},
									width : "100%",
									maxLength : common.Common.getODataPropertyLength("ZHR_BUSITRIP_PAY_DOM_SRV", "BusitripDomAppl", "Busin"),
								}).addStyleClass("Font14px FontColor6"),
						]}).addStyleClass("ToolbarNoBottomLine"),
					}).addStyleClass("MatrixData"),
					]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							//비고
							text : oBundleText.getText("LABEL_0096")	// 96:비고
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Zbigo}",
									width : "100%",
								    editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
										formatter : function(fVal1, fVal2, fVal3){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
										}
									},
									maxLength : common.Common.getODataPropertyLength("ZHR_BUSITRIP_PAY_DOM_SRV", "BusitripDomAppl", "Zbigo"),
								}).addStyleClass("Font14px FontBold FontColor3"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : "Activity",
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ new sap.m.Input({
							    value : "{Aufnr}",
							    width : "150px",
							    editable : {
						    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
									formatter : function(fVal1, fVal2, fVal3){
										return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
									}
								},
								valueHelpOnly : true,
								showValueHelp : true,
								valueHelpRequest: function(){
									common.SearchActivity.onPressActivity(oController);
								}
							}).addStyleClass("Font14px FontColor6 PaddingRight10"),
							new sap.m.Input({
							    value : "{Aufnrtx}",
							    width : "100%",
							    editable : false
							}).addStyleClass("Font14px FontColor6")
						]}).addStyleClass("ToolbarNoBottomLine"),
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : ""
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixLabel"),
					
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
						}).addStyleClass("ToolbarNoBottomLine"),
					}).addStyleClass("MatrixData"),
				]
			}),
		];
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "20px",
					content : [
						new sap.m.Image({
							src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",
					    }),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_1242") 	// 1242:국내출장비 신청
						}).addStyleClass("MiddleTitle"),
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
				new sap.ui.commons.layout.MatrixLayout({
					columns : 4,
					widths : ['20%', '30%', '20%', '30%'],
					rows : aRows
				}).setModel(oController._DetailJSonModel)
				.bindElement("/Data")
			]
		});
	},
	/**
	 * 상세내역 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getDetailTable : function(oController){
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable",{
			enableColumnReordering : false,
			enableColumnFreeze : false,
			showNoData : true,
			selectionMode : sap.ui.table.SelectionMode.None,
			columnHeaderHeight  : 33,
			rowHeight : 33 ,
			visibleRowCount : 1
		}).setModel(oController._DetailTableJSonModel)
		.bindRows("/Data");
		
		var col_info1 = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "50px"}];
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		// 경로 combo
		var oPah = new sap.m.ComboBox({ 
			 selectedKey: "{Pah}",
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1){
					return (fVal1 == "" || fVal1 == "10" ) ;
				}
			},
			width : "100%"
		}).addStyleClass("Font14px FontColor6");
		
		var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_DOM_SRV");
		oModel.read("/BusitripPahSet", {
			async: false,
			filters : [
				new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, oController._vLangu),
			],
			success: function(data,res){
				if(data && data.results.length) {
					for(var i=0; i<data.results.length; i++) {
						oPah.addItem(
							new sap.ui.core.Item({ 
								key: data.results[i].Pah, 
								text: data.results[i].Pahtx,
							})
						);
					}
				}
			},
			error: function(res){console.log(res);}
		});
		

	   
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			// 경로
			multiLabels : [ new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1239"),	// 1239:경로
				textAlign : "Center"}).addStyleClass("FontFamilyBold")	],
			template : oPah
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : false,
//			width : "120px",
			//출발지
			multiLabels : [ new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1211"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],	// 1211:출발지
			template : [new sap.m.Input({
				value : "{Slotx}",
		    	editable : {
		    		parts : [ {path : "ZappStatAl"}],
					formatter : function(fVal1, fVal2){
						if(fVal1 == "" || fVal1 == "10") return true;
						else return false;
					}
				},
				textAlign : "Center",
				valueHelpOnly : true,
				showValueHelp : true,
				valueHelpRequest: oController.onPressDeparture,
			}).addStyleClass("Font14px FontColor6")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : false,
//			width : "120px",
			//도착지
			multiLabels : [ new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1206"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],	// 1206:도착지
			template : [new sap.m.Input({
				value : "{Elotx}",
		    	editable : false,
				textAlign : "Center",
			}).addStyleClass("Font14px FontColor6")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : false,
//			width : "120px",
			//교통편
			multiLabels : [ new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1241"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],	// 1241:교통편
			template : [new sap.m.Input({
				value : "{Trftx}",
		    	editable : false,
				textAlign : "Center",
			}).addStyleClass("Font14px FontColor6")]
		}));
		// 숙박 combo
		var oAcc = new sap.m.ComboBox({ 
			 selectedKey: "{Acc}",
			editable : {
				parts : [{path : "ZappStatAl"}],
				formatter : function(fVal1){
					return (fVal1 == "" || fVal1 == "10" ) ;
				}
			},
			width : "100%"
		}).addStyleClass("Font14px FontColor6");
		
		oModel.read("/BusitripAccSet", {
			async: false,
			filters : [
				new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, oController._vLangu),
			],
			success: function(data,res){
				if(data && data.results.length) {
					for(var i=0; i<data.results.length; i++) {
						oAcc.addItem(
							new sap.ui.core.Item({ 
								key: data.results[i].Acc, 
								text: data.results[i].Acctx,
							})
						);
					}
				}
			},
			error: function(res){console.log(res);}
		});
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : false,
			// 숙박시설
			multiLabels : [ new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1246"), textAlign : "Center"}).addStyleClass("FontFamilyBold")	],	// 1246:숙박시설
			template : oAcc
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : false,
			//숙박일
			multiLabels : [ new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1247"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],	// 1247:숙박일
			template : [new sap.m.Input({
				value : "{Day}",
				liveChange : common.Common.setOnlyDigit,
		    	editable : {
		    		parts : [ {path : "ZappStatAl"}],
					formatter : function(fVal1, fVal2){
						if(fVal1 == "" || fVal1 == "10") return true;
						else return false;
					}
				},
				textAlign : "End",
			}).addStyleClass("Font14px FontColor6")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : false,
			width : "120px",
			// 삭제
			multiLabels : [ new sap.m.CheckBox({text : oBundleText.getText("LABEL_0033"),	// 33:삭제
												editable : { parts : [{path : "ZappStatAl"}],
													formatter : function(fVal1, fVal2) {
														return (fVal1 == "" || fVal1 == "10") ? true : false;
													}	
												},
												select : oController.onPressDeleteAll,
												textAlign : "End"}).setModel(oController._DetailJSonModel).bindElement("/Data")
												.addStyleClass("FontFamilyBold")],
			template : [new sap.m.CheckBox({
				selected : "{Check}",
		    	editable : {
		    		parts : [ {path : "ZappStatAl"}],
					formatter : function(fVal1, fVal2){
						if(fVal1 == "" || fVal1 == "10") return true;
						else return false;
					}
				},
				textAlign : "Center",
				select : oController.onPressDelete
			}).addStyleClass("Font14px FontColor6")]
		}));
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
//					height : "30px",
					content : [
						new sap.m.Image({
							src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",
						   }),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_1207") 	// 1207:상세 내역
						}).addStyleClass("MiddleTitle"),
						new sap.m.ToolbarSpacer({}),
						new sap.m.Button({
							// 추가
							text : oBundleText.getText("LABEL_0482"), 	// 482:추가
							type : sap.m.ButtonType.Ghost,
							press : oController.onPressAdd,
							visible : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2) {
									return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
								}
							}
						}).addStyleClass("Font14px FontColor6"),
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 
				oTable,
			],
		}).setModel(oController._DetailJSonModel)
		.bindElement("/Data");
	},
	
	/**
	 * 정산내역 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getCalculationInfoRender : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
						}).addStyleClass("Font14px FontColor6"),
						rowSpan : 2,
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0031")	// 31:사번
						}).addStyleClass("Font14px FontBold FontColor3"),
						rowSpan : 2,
						hAlign : "Center"
					}).addStyleClass("MatrixLabel3"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0038")	// 38:성명
						}).addStyleClass("Font14px FontBold FontColor3"),
						rowSpan : 2,
						hAlign : "Center"
					}).addStyleClass("MatrixLabel3"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1258")	// 1258:항목
						}).addStyleClass("Font14px FontBold FontColor3"),
						colSpan : 4,
						hAlign : "Center"
					}).addStyleClass("MatrixLabel3"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1251")	// 1251:일당
						}).addStyleClass("Font14px FontBold FontColor3"),
						hAlign : "Center"
					}).addStyleClass("MatrixLabel3"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1245")	// 1245:숙박비
						}).addStyleClass("Font14px FontBold FontColor3"),
						hAlign : "Center"
					}).addStyleClass("MatrixLabel3"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1240")	// 1240:교통비
						}).addStyleClass("Font14px FontBold FontColor3"),
						hAlign : "Center"
					}).addStyleClass("MatrixLabel3"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0406")	// 406:계
						}).addStyleClass("Font14px FontBold FontColor3"),
						hAlign : "Center"
					}).addStyleClass("MatrixLabel3"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1255")	// 1255:총신청액
						}).addStyleClass("Font14px FontBold FontColor3 PaddingRight10")
					}).addStyleClass("MatrixLabel11"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{Perid}",
						}).addStyleClass("Font14px FontBold FontColor3 PaddingRight10"),
						hAlign : "Center"
					}).addStyleClass("MatrixData10"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{Ename}",
						}).addStyleClass("Font14px FontBold FontColor3 PaddingRight10"),
						hAlign : "Center"
					}).addStyleClass("MatrixData10"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{TotalBscst}"
						}).addStyleClass("Font14px FontBold FontColor3 PaddingRight15"),
						hAlign : "End"
					}).addStyleClass("MatrixData10"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{TotalHtcst}"
						}).addStyleClass("Font14px FontBold FontColor3 PaddingRight15"),
						hAlign : "End"
					}).addStyleClass("MatrixData10"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{TotalTrcst}"
						}).addStyleClass("Font14px FontBold FontColor3 PaddingRight15"),
						hAlign : "End"
					}).addStyleClass("MatrixData10"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Text({
							text : "{TotalTlcst}"
						}).addStyleClass("Font14px FontBold FontColor3 PaddingRight15"),
						hAlign : "End"
					}).addStyleClass("MatrixData10"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1249")	// 1249:CCS 결제금액 
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{BscstC}",
							textAlign : "End",
							width : "100%",
							editable : false,
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{HtcstC}",
							textAlign : "End",
							width : "100%",
							editable : false,
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TrcstC}",
							textAlign : "End",
							width : "100%",
							editable : false,
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TlcstC}",
							textAlign : "End",
							width : "100%",
							editable : false,
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixLabel11"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_2940")	// 2940:CCS 지급신청액
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{BscstR}",
							editable : {
								parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Bscstflg0"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && fVal3 == false) ? true : false;
								}
							},
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney1
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{HtcstR}",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Htcstflg0"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && fVal3 == false) ? true : false;
								}
							},
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney1
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TrcstR}",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Trcstflg0"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && fVal3 == false) ? true : false;
								}
							},
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney1
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TlcstR}",
							editable : false,
							width : "100%",
							textAlign : "End",
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixLabel11"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1259")	// 1259:현금사용액
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{BscstH}",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
								}
							},
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney2
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{HtcstH}",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
								}
							},
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney2
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TrcstH}",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
								}
							},
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney2
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TlcstH}",
							editable : false,
							width : "100%",
							textAlign : "End",
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixLabel11"),
				]
			}),
			
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1267")	// 1267:본인 내역
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  new sap.m.Input({
						    value : "{Smtxt}",
//						    width : "100%",
						    editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
								}
							},
							maxLength : common.Common.getODataPropertyLength("ZHR_BUSITRIP_PAY_DOM_SRV", "BusitripDomAppl", "Smtxt"),
						}).addStyleClass("Font14px FontColor6"),
						colSpan : 6
					}).addStyleClass("MatrixData"),
				]
			})
			
			
		];
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
//					height : "30px",
					content : [
						new sap.m.Image({
							src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",
						   }),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_1253") 	// 1253:정산내역
						}).addStyleClass("MiddleTitle"),
						new sap.m.ToolbarSpacer({}),
						new sap.m.Button({
				    		text : "CCS",
				    		type : "Ghost",
				    		press : common.CCSInformation.openCCS,
				    		enabled : {
				    			parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Docno2"}],
								formatter : function(fVal1, fVal2, fVal3){
									if((fVal1 == "" || fVal1 == "10") && fVal2 && fVal3) return true;
									else return false;
								}
				    		},
		    		   }).addStyleClass("Font14px FontColor6"),
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 
				new sap.ui.commons.layout.MatrixLayout({
					columns : 7,
					widths : ['12%', '8%', '12%', '13%', '13%', '27%', '15%'],
					rows : aRows
				}).setModel(oController._DetailJSonModel)
				.bindElement("/Data")
			]
		});
	},
	
	/**
	 * 동행자 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getCompanionInfoRender : function(oController){
		//////////////////////
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1243") + "1"	// 1243:동행자
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  
							new sap.m.Toolbar({
								design : sap.m.ToolbarDesign.Auto,
								content : [
									new sap.m.Input({
										value : "{Perid01}",
										width : "100%",
									    editable : {
								    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
											formatter : function(fVal1, fVal2, fVal3){
												return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
											}
										},
										valueHelpOnly : true, 
										showValueHelp : true,
										valueHelpRequest: oController.onPernrChange,
										customData : new sap.ui.core.CustomData({key : "UserIdx", value : "1"})
									}).addStyleClass("Font14px FontColor6"),
									new sap.m.ToolbarSpacer({
										width: "5px",
										visible : {
											parts : [ {path : "ZappStatAl"},{path : "Perid01"}],
											formatter : function(fVal1, fVal2){
												return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
											}
										},
									}),
									new sap.ui.core.Icon({
										size : "1rem",
										src : "sap-icon://sys-cancel",
										visible : {
											parts : [ {path : "ZappStatAl"},{path : "Perid01"}],
											formatter : function(fVal1, fVal2){
												return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
											}
										},
										press : oController.onPernrClear,
										customData : new sap.ui.core.CustomData({key : "UserIdx", value : "1"})
									 }),
								]
							}).addStyleClass("ToolbarNoBottomLine"), 
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  new sap.m.Input({
						    value : "{Ename01}",
						    width : "100%",
						    editable : false,
						}).addStyleClass("Font14px FontColor6"),
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Bscst01}",
							editable : false,
							textAlign : "End",
							width : "100%",
							change : oController.onChangeMoney,
							customData : new sap.ui.core.CustomData({key : "UserIdx", value : "1"})
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Htcst01}",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Htcstflg1"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && fVal3 == false) ? true : false;
								}
							},
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney,
							customData : new sap.ui.core.CustomData({key : "UserIdx", value : "1"})
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Trcst01}",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Trcstflg1"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && fVal3 == false) ? true : false;
								}
							},
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney,
							customData : new sap.ui.core.CustomData({key : "UserIdx", value : "1"})
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Smcst01}",
							editable : false,
							textAlign : "End",
							width : "100%"
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixLabel2"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0096")	// 96:비고
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  new sap.m.Input({
						    value : "{Pmemo01}",
						    width : "100%",
						    editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
								}
							},
							maxLength : common.Common.getODataPropertyLength("ZHR_BUSITRIP_PAY_DOM_SRV", "BusitripDomAppl", "Pmemo01"),
						}).addStyleClass("Font14px FontColor6"),
						colSpan : 6
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1243") + "2"	// 1243:동행자
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							design : sap.m.ToolbarDesign.Auto,
							content : [
								new sap.m.Input({
								    value : "{Perid02}",
								    width : "100%",
								    editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
										formatter : function(fVal1, fVal2, fVal3){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
										}
									},
									valueHelpOnly : true,
									showValueHelp : true,
									valueHelpRequest: oController.onPernrChange,
									customData : new sap.ui.core.CustomData({key : "UserIdx", value : "2"})
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.ToolbarSpacer({
									width: "5px",
									visible : {
										parts : [ {path : "ZappStatAl"},{path : "Perid02"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
								}),
								new sap.ui.core.Icon({
									size : "1rem",
									src : "sap-icon://sys-cancel",
									visible : {
										parts : [ {path : "ZappStatAl"},{path : "Perid02"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									press : oController.onPernrClear,
									customData : new sap.ui.core.CustomData({key : "UserIdx", value : "2"})
								 }),
							]
						}).addStyleClass("ToolbarNoBottomLine"), 
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  new sap.m.Input({
						    value : "{Ename02}",
						    width : "100%",
						    editable : false,
						}).addStyleClass("Font14px FontColor6"),
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Bscst02}",
							editable : false,
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney,
							customData : new sap.ui.core.CustomData({key : "UserIdx", value : "2"})
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Htcst02}",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Htcstflg2"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && fVal3 == false) ? true : false;
								}
							},
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney,
							customData : new sap.ui.core.CustomData({key : "UserIdx", value : "2"})
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Trcst02}",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Trcstflg2"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && fVal3 == false) ? true : false;
								}
							},
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney,
							customData : new sap.ui.core.CustomData({key : "UserIdx", value : "2"})
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Smcst02}",
							editable : false,
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney,
							customData : new sap.ui.core.CustomData({key : "UserIdx", value : "2"})
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixLabel2"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0096")	// 96:비고
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  new sap.m.Input({
						    value : "{Pmemo02}",
						    width : "100%",
						    editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
								}
							},
							maxLength : common.Common.getODataPropertyLength("ZHR_BUSITRIP_PAY_DOM_SRV", "BusitripDomAppl", "Pmemo02"),
						}).addStyleClass("Font14px FontColor6"),
						colSpan : 6
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1243") + "3"	// 1243:동행자
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  new sap.m.Toolbar({
							design : sap.m.ToolbarDesign.Auto,
							content : [
								new sap.m.Input({
								    value : "{Perid03}",
								    width : "100%",
								    editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
										formatter : function(fVal1, fVal2, fVal3){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
										}
									},
									valueHelpOnly : true,
									showValueHelp : true,
									valueHelpRequest: oController.onPernrChange,
									customData : new sap.ui.core.CustomData({key : "UserIdx", value : "3"})
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.ToolbarSpacer({
									width: "5px",
									visible : {
										parts : [ {path : "ZappStatAl"},{path : "Perid03"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
								}),
								new sap.ui.core.Icon({
									size : "1rem",
									src : "sap-icon://sys-cancel",
									visible : {
										parts : [ {path : "ZappStatAl"},{path : "Perid03"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									press : oController.onPernrClear,
									customData : new sap.ui.core.CustomData({key : "UserIdx", value : "3"})
								 }),
							]
						}).addStyleClass("ToolbarNoBottomLine"), 
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  new sap.m.Input({
						    value : "{Ename03}",
						    width : "100%",
						    editable : false,
						}).addStyleClass("Font14px FontColor6"),
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Bscst03}",
							editable : false,
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney,
							customData : new sap.ui.core.CustomData({key : "UserIdx", value : "3"})
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Htcst03}",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Htcstflg3"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && fVal3 == false) ? true : false;
								}
							},
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney,
							customData : new sap.ui.core.CustomData({key : "UserIdx", value : "3"})
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Trcst03}",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Trcstflg3"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && fVal3 == false) ? true : false;
								}
							},
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney,
							customData : new sap.ui.core.CustomData({key : "UserIdx", value : "3"})
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Smcst03}",
							editable : false,
							width : "100%",
							textAlign : "End",
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixLabel2"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0096")	// 96:비고
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  new sap.m.Input({
						    value : "{Pmemo03}",
						    width : "100%",
						    editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
								}
							},
							maxLength : common.Common.getODataPropertyLength("ZHR_BUSITRIP_PAY_DOM_SRV", "BusitripDomAppl", "Pmemo03"),
						}).addStyleClass("Font14px FontColor6"),
						colSpan : 6
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1243") + "4"	// 1243:동행자
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  new sap.m.Toolbar({
							design : sap.m.ToolbarDesign.Auto,
							content : [
								new sap.m.Input({
								    value : "{Perid04}",
								    width : "100%",
								    editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
										formatter : function(fVal1, fVal2, fVal3){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
										}
									},
									valueHelpOnly : true,
									showValueHelp : true,
									valueHelpRequest: oController.onPernrChange,
									customData : new sap.ui.core.CustomData({key : "UserIdx", value : "4"})
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.ToolbarSpacer({
									width: "5px",
									visible : {
										parts : [ {path : "ZappStatAl"},{path : "Perid04"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
								}),
								new sap.ui.core.Icon({
									size : "1rem",
									src : "sap-icon://sys-cancel",
									visible : {
										parts : [ {path : "ZappStatAl"},{path : "Perid04"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									press : oController.onPernrClear,
									customData : new sap.ui.core.CustomData({key : "UserIdx", value : "4"})
								 }),
							]
						}).addStyleClass("ToolbarNoBottomLine"), 
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  new sap.m.Input({
						    value : "{Ename04}",
						    width : "100%",
						    editable : false,
						}).addStyleClass("Font14px FontColor6"),
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Bscst04}",
							editable : false,
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney,
							customData : new sap.ui.core.CustomData({key : "UserIdx", value : "4"})
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Htcst04}",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Htcstflg4"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && fVal3 == false) ? true : false;
								}
							},
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney,
							customData : new sap.ui.core.CustomData({key : "UserIdx", value : "4"})
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Trcst04}",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Trcstflg4"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && fVal3 == false) ? true : false;
								}
							},
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney,
							customData : new sap.ui.core.CustomData({key : "UserIdx", value : "4"})
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Smcst04}",
							editable : false,
							width : "100%",
							textAlign : "End",
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixLabel2"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0096")	// 96:비고
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  new sap.m.Input({
						    value : "{Pmemo04}",
						    width : "100%",
						    editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
								}
							},
							maxLength : common.Common.getODataPropertyLength("ZHR_BUSITRIP_PAY_DOM_SRV", "BusitripDomAppl", "Pmemo04"),
						}).addStyleClass("Font14px FontColor6"),
						colSpan : 6
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1243") + "5"	// 1243:동행자
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  new sap.m.Toolbar({
							design : sap.m.ToolbarDesign.Auto,
							content : [
								new sap.m.Input({
								    value : "{Perid05}",
								    width : "100%",
								    editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
										formatter : function(fVal1, fVal2, fVal3){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
										}
									},
									valueHelpOnly : true,
									showValueHelp : true,
									valueHelpRequest: oController.onPernrChange,
									customData : new sap.ui.core.CustomData({key : "UserIdx", value : "5"})
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.ToolbarSpacer({
									width: "5px",
									visible : {
										parts : [ {path : "ZappStatAl"},{path : "Perid05"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
								}),
								new sap.ui.core.Icon({
									size : "1rem",
									src : "sap-icon://sys-cancel",
									visible : {
										parts : [ {path : "ZappStatAl"},{path : "Perid05"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									press : oController.onPernrClear,
									customData : new sap.ui.core.CustomData({key : "UserIdx", value : "5"})
								 }),
							]
						}).addStyleClass("ToolbarNoBottomLine"), 
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  new sap.m.Input({
						    value : "{Ename05}",
						    width : "100%",
						    editable : false,
						}).addStyleClass("Font14px FontColor6"),
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Bscst05}",
							editable : false,
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney,
							customData : new sap.ui.core.CustomData({key : "UserIdx", value : "5"})
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Htcst05}",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Htcstflg5"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && fVal3 == false) ? true : false;
								}
							},
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney,
							customData : new sap.ui.core.CustomData({key : "UserIdx", value : "5"})
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Trcst05}",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Trcstflg5"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && fVal3 == false) ? true : false;
								}
							},
							width : "100%",
							textAlign : "End",
							change : oController.onChangeMoney,
							customData : new sap.ui.core.CustomData({key : "UserIdx", value : "5"})
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{Smcst05}",
							editable : false,
							width : "100%",
							textAlign : "End",
						}).addStyleClass("Font14px FontColor6")
					}).addStyleClass("MatrixLabel2"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0096")	// 96:비고
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content :  new sap.m.Input({
						    value : "{Pmemo05}",
						    width : "100%",
						    editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
								}
							},
							maxLength : common.Common.getODataPropertyLength("ZHR_BUSITRIP_PAY_DOM_SRV", "BusitripDomAppl", "Pmemo05"),
						}).addStyleClass("Font14px FontColor6"),
						colSpan : 6
					}).addStyleClass("MatrixData"),
				]
			})
		];
		
		
		return new sap.m.Panel(oController.PAGEID +"_CompanionPanel",{
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "30px",
					content : [
						new sap.m.Image({
							src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",
					    }),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_1243")	// 1243:동행자 
						}).addStyleClass("MiddleTitle"),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Button(oController.PAGEID +"_CompanionButton",{
							type : sap.m.ButtonType.Ghost,
							press : oController.onPressExpandCompanion,
						}).addStyleClass("Font14px FontColor6"),
						new sap.m.ToolbarSpacer({}),
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),  
				new sap.ui.commons.layout.MatrixLayout(oController.PAGEID +"_CompanionLayout",{
					columns : 7,
					widths : ['12%', '8%', '12%', '13%', '13%', '27%', '15%'],
					rows : aRows
				}).setModel(oController._DetailJSonModel)
				.bindElement("/Data")
			]
		});
	
	}
});