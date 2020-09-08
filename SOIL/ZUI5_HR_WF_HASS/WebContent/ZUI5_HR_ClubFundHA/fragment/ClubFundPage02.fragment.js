sap.ui.jsfragment("ZUI5_HR_ClubFundHA.fragment.ClubFundPage02", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.ZNK_TABLES");
		
		var oRow, oCell;
		
		// 대상자 + 주무부서 기재사항
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({ 	// 대상자
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
//										text : "{Apename}",
										text : {
											parts : [{path : "Apename"}, {path : "Perid"}],
											formatter : function(fVal1, fVal2){
												if(fVal1 || fVal2) return fVal1 + " (" + fVal2 + ")"
											}
										}
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
		oMatrix.addRow(oRow);
		
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
					content : new sap.m.Text({text : "직책"}).addStyleClass("L2PFontFamily"),
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
		oMatrix.addRow(oRow);
		
		var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({		// 주무부서 기재사항
			columns : 5,
			widths : ['20%','20%','20%','20%','20%']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : "구분"}).addStyleClass("L2PFontFamily"),
					hAlign : "Center"
				}).addStyleClass("L2PMatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : "일반지원금"}).addStyleClass("L2PFontFamily"),
					hAlign : "Center"
				}).addStyleClass("L2PMatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : "행사지원금"}).addStyleClass("L2PFontFamily"),
					hAlign : "Center"
				}).addStyleClass("L2PMatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : "기타지원금"}).addStyleClass("L2PFontFamily"),
					hAlign : "Center"
				}).addStyleClass("L2PMatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : "계"}).addStyleClass("L2PFontFamily"),
					hAlign : "Center"
				}).addStyleClass("L2PMatrixLabel3"); 
		oRow.addCell(oCell);
		oMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : "지원금예산"}).addStyleClass("L2PFontFamily"),
					hAlign : "Center"
				}).addStyleClass("L2PMatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
										content : [new sap.m.ToolbarSpacer(),
												   new sap.m.Text({
														text : {
															path : "SfundA",
															formatter : function(fVal){
																if(fVal) return common.Common.numberWithCommas(fVal);
															}
														},
														textAlign : "Right"							
												  }).addStyleClass("L2PFontFamily")]
								}).addStyleClass("L2PToolbarNoBottomLine")],
					hAlign : "Right"
				}).addStyleClass("L2PMatrixData5"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
											text : {
												path : "SfundB",
												formatter : function(fVal){
													if(fVal) return common.Common.numberWithCommas(fVal);
												}
											},
											textAlign : "Right"							
									  }).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")],
					hAlign : "Right"
				}).addStyleClass("L2PMatrixData5"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
											text : {
												path : "SfundC2",
												formatter : function(fVal){
													if(fVal) return common.Common.numberWithCommas(fVal);
												}
											},
											textAlign : "Right"							
									  }).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")],
					hAlign : "Right"
				}).addStyleClass("L2PMatrixData5"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
											text : {
												path : "SfundT",
												formatter : function(fVal){
													if(fVal) return common.Common.numberWithCommas(fVal);
												}
											},
											textAlign : "Right"							
									  }).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")],
					hAlign : "Right"
				}).addStyleClass("L2PMatrixData5"); 
		oRow.addCell(oCell);
		oMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : "현재 잔액"}).addStyleClass("L2PFontFamily"),
					hAlign : "Center"
				}).addStyleClass("L2PMatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
											text : {
												path : "BaltrA",
												formatter : function(fVal){
													if(fVal) return common.Common.numberWithCommas(fVal);
												}
											},
											textAlign : "Right"							
									  }).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")],
					hAlign : "Right"
				}).addStyleClass("L2PMatrixData5"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
											text : {
												path : "BaltrB",
												formatter : function(fVal){
													if(fVal) return common.Common.numberWithCommas(fVal);
												}
											},
											textAlign : "Right"							
									  }).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")],
					hAlign : "Right"
				}).addStyleClass("L2PMatrixData5"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
											text : {
												path : "BaltrC2",
												formatter : function(fVal){
													if(fVal) return common.Common.numberWithCommas(fVal);
												}
											},
											textAlign : "Right"
									  }).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")],
					hAlign : "Right"
				}).addStyleClass("L2PMatrixData5"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
											text : {
												path : "BaltrT",
												formatter : function(fVal){
													if(fVal) return common.Common.numberWithCommas(fVal);
												}
											},
											textAlign : "Right"							
									  }).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")],
					hAlign : "Right"
				}).addStyleClass("L2PMatrixData5"); 
		oRow.addCell(oCell);
		oMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : "당행사 지원"}).addStyleClass("L2PFontFamily"),
					hAlign : "Center"
				}).addStyleClass("L2PMatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
								value : {
									path : "SuptrA",
									formatter : function(fVal){
										if(fVal) return common.Common.numberWithCommas(fVal);
									}
								},
								width : "97%",
								textAlign : "Right",
								editable : {
									path : "ZappStatAl",
									formatter : function(fVal){
										if(fVal == "20") return true;
										else return false;
									}
								},
								customData : [new sap.ui.core.CustomData({key : "Id", value : "A"})],
								maxLength : common.Common.getODataPropertyLength("ZHR_CLUB_SRV", "ClubSupportFundHead", "SuptrA"),
								change : oController.onChangeSuptr
							}).addStyleClass("L2PFontFamily Number")
				}).addStyleClass("L2PMatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
								value : {
									path : "SuptrB",
									formatter : function(fVal){
										if(fVal) return common.Common.numberWithCommas(fVal);
									}
								},
								width : "97%",
								textAlign : "Right",
								editable : {
									path : "ZappStatAl",
									formatter : function(fVal){
										if(fVal == "20") return true;
										else return false;
									}
								},
								customData : [new sap.ui.core.CustomData({key : "Id", value : "B"})],
								maxLength : common.Common.getODataPropertyLength("ZHR_CLUB_SRV", "ClubSupportFundHead", "SuptrB"),
								change : oController.onChangeSuptr
							}).addStyleClass("L2PFontFamily Number")
				}).addStyleClass("L2PMatrixData"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
								value : {
									path : "SuptrC",
									formatter : function(fVal){
										if(fVal) return common.Common.numberWithCommas(fVal);
									}
								},
								width : "97%",
								textAlign : "Right",
								editable : {
									path : "ZappStatAl",
									formatter : function(fVal){
										if(fVal == "20") return true;
										else return false;
									}
								},
								customData : [new sap.ui.core.CustomData({key : "Id", value : "C"})],
								maxLength : common.Common.getODataPropertyLength("ZHR_CLUB_SRV", "ClubSupportFundHead", "SuptrC"),
								change : oController.onChangeSuptr
							}).addStyleClass("L2PFontFamily Number")
				}).addStyleClass("L2PMatrixData");  
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Input({
								value : {
									path : "SuptrT",
									formatter : function(fVal){
										if(fVal) return common.Common.numberWithCommas(fVal);
									}
								},
								textAlign : "Right",
								width : "97%",
								editable : false
							}).addStyleClass("L2PFontFamily Number")
				}).addStyleClass("L2PMatrixData"); 
		oRow.addCell(oCell);
		oMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : "지원 후 잔액"}).addStyleClass("L2PFontFamily"),
					hAlign : "Center"
				}).addStyleClass("L2PMatrixLabel3"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
											text : {
												path : "TotalA",
												formatter : function(fVal){
													if(fVal) return common.Common.numberWithCommas(fVal);
												}
											},
											textAlign : "Right"							
									  }).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")],
					hAlign : "Right"
				}).addStyleClass("L2PMatrixData5"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
											text : {
												path : "TotalB",
												formatter : function(fVal){
													if(fVal) return common.Common.numberWithCommas(fVal);
												}
											},
											textAlign : "Right"							
									  }).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")],
					hAlign : "Right"
				}).addStyleClass("L2PMatrixData5"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
											text : {
												path : "TotalC",
												formatter : function(fVal){
													if(fVal) return common.Common.numberWithCommas(fVal);
												}
											},
											textAlign : "Right"							
									  }).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")],
					hAlign : "Right"
				}).addStyleClass("L2PMatrixData5"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
											text : {
												path : "TotalT",
												formatter : function(fVal){
													if(fVal) return common.Common.numberWithCommas(fVal);
												}
											},
											textAlign : "Right"							
									  }).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")],
					hAlign : "Right"
				}).addStyleClass("L2PMatrixData5"); 
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
								       new sap.m.Text({text : "대상자"}).addStyleClass("L2PFontFamilyBold"),
								       new sap.m.ToolbarSpacer()
						]}).addStyleClass("L2PToolbarNoBottomLine"),
						oMatrix,
						new sap.m.Toolbar({
							design : sap.m.ToolbarDesign.Auto,
							height : "40px",
							content : [new sap.m.MessageStrip(oController.PAGEID + "_Zclubtx", {
								    	   text : "",
							        	   type : "Success" ,
										   showIcon : false ,
										   customIcon : "sap-icon://message-information", 
										   showCloseButton : false,
								       }),
									   new sap.m.ToolbarSpacer(),
								       new sap.m.Text({text : "※ 주무부서 기재사항"}).addStyleClass("L2P15FontRedBold")
						]}).addStyleClass("L2PToolbarNoBottomLine"),
						oMatrix2]
		});
		
		
		// 지원금신청 계산근거
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_BasisTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
		});
		
		oTable.setModel(oController._DetailTableJSonModel);
		oTable.bindRows("/Data");		
		
		var oFooter = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			columns : 10,
			widths : ["31px", "3%", "19%", "19%", "7.5%", "10%", "7.5%", "7.5%", "7.5%", "19%"]
		});
		
		oFooter.setModel(oController._FooterJSONModel);
		oFooter.bindElement("/Data");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "35px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 4,
			hAlign : "Center",
			content : [new sap.m.Text({text : "합계"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PMatrixData6");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Right",
			content : [new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
											text : {
												path : "TotalMemfee",
												formatter : function(fVal){
													if(fVal) return common.Common.numberWithCommas(fVal);
												}
											},
											textAlign : "Right"
									   }).addStyleClass("L2PFontFamily")]
					 }).addStyleClass("L2PToolbarNoBottomLine")],
		}).addStyleClass("L2PMatrixData6");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Right",
			content : [new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
											text : {
												path : "TotalT",
												formatter : function(fVal){
													if(fVal) return common.Common.numberWithCommas(fVal);
												}
											},
											textAlign : "Right"
									   }).addStyleClass("L2PFontFamily")]
					  }).addStyleClass("L2PToolbarNoBottomLine")],
		}).addStyleClass("L2PMatrixData6");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Right",
			content : [new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
											text : {
												path : "TotalA",
												formatter : function(fVal){
													if(fVal) return common.Common.numberWithCommas(fVal);
												}
											},
											textAlign : "Right"
									   }).addStyleClass("L2PFontFamily")]
					  }).addStyleClass("L2PToolbarNoBottomLine")],
		}).addStyleClass("L2PMatrixData6");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Right",
			content : [new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
											text : {
												path : "TotalB",
												formatter : function(fVal){
													if(fVal) return common.Common.numberWithCommas(fVal);
												}
											},
											textAlign : "Right"
									   }).addStyleClass("L2PFontFamily")]
					  }).addStyleClass("L2PToolbarNoBottomLine")],
		}).addStyleClass("L2PMatrixData6");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Right",
			content : [new sap.m.Toolbar({
							content : [new sap.m.ToolbarSpacer(),
									   new sap.m.Text({
											text : {
												path : "TotalC",
												formatter : function(fVal){
													if(fVal) return common.Common.numberWithCommas(fVal);
												}
											},
											textAlign : "Right"
									   }).addStyleClass("L2PFontFamily")]
					  }).addStyleClass("L2PToolbarNoBottomLine")],
		}).addStyleClass("L2PMatrixData6");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({});
		oRow.addCell(oCell);
		oFooter.addRow(oRow);
		
		oTable.setFooter(oFooter);
		
		var col_info = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "3%"},
						{id: "Content", label : "내용", plabel : "", span : 0, type : "input", sort : true, filter : true, width : "19%"},
						{id: "Calcon", label : "계산근거", plabel : "", span : 0, type : "link", sort : true, filter : true, width : "19%"},
						{id: "Memfee", label : "회비", plabel : "", span : 0, type : "text", sort : true, filter : true, width : "7.5%"},
						{id: "Total", label : "지원금 총액(a+b+c)", plabel : "", span : 0, type : "text", sort : true, filter : true, width : "10%"},
						{id: "SfundA", label : "일반지원금(a)", plabel : "", span : 0, type : "text", sort : true, filter : true, width : "7.5%"},
						{id: "SfundB", label : "행사지원금(b)", plabel : "", span : 0, type : "text", sort : true, filter : true, width : "7.5%"},
						{id: "SfundC", label : "기타지원금(c)", plabel : "", span : 0, type : "text", sort : true, filter : true, width : "7.5%"},
						{id: "Zbigo", label : "비고", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "19%"}];
		
		for(var i=0; i<col_info.length; i++){
			var oColumn = new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
	        	vAlign : "Middle",
	        	autoResizable : true,
	        	resizable : false,
				showFilterMenuEntry : true,
				filterProperty : col_info[i].id,
				sortProperty : col_info[i].id
			});	
			
			oColumn.addMultiLabel(new sap.ui.commons.TextView({text : col_info[i].label, textAlign : "Center", width : "100%"}).addStyleClass("L2PFontFamily"));
			
			if(col_info[i].plabel != "") {
				oColumn.addMultiLabel(new sap.ui.commons.TextView({text : col_info[i].plabel, textAlign : "Center", width : "100%"}).addStyleClass("L2PFontFamily"));
			}
			
			if(col_info[i].span > 0) {
				oColumn.setHeaderSpan([col_info[i].span, 1]);
			}
			
			if(col_info[i].width && col_info[i].width != ""){
				oColumn.setWidth(col_info[i].width);
			}
			
			if(col_info[i].type == "input"){
				oColumn.setTemplate(
						new sap.m.Input({
							value : "{" + col_info[i].id + "}",
							editable : false,
							customData : new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"}),
							maxLength : common.Common.getODataPropertyLength("ZHR_CLUB_SRV", "ClubSupportFundDetail", col_info[i].id)
						}).addStyleClass("L2PFontFamily")				
				);
			} else if(col_info[i].type == "link"){
				oColumn.setTemplate(
						new sap.m.Link({
							width : "100%",
							text : "{" + col_info[i].id + "tx}",
							press : oController.onEvidence,
//							editable : "{editable}",
							customData : new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"})
						}).addStyleClass("L2PFontFamily")				
				);
			} else if(col_info[i].type == "text"){
				oColumn.setTemplate(
					new sap.ui.commons.TextView({
						text : "{" + col_info[i].id + "}", 
						textAlign : "Right"
					}).addStyleClass("L2PFontFamily")
				);
			} else {
				oColumn.setTemplate(
					new sap.ui.commons.TextView({
						text : "{" + col_info[i].id + "}", 
						textAlign : "Center"
					}).addStyleClass("L2PFontFamily")
				);
			}		
			
			oTable.addColumn(oColumn);
		}
			
		var oBasisPanel = new sap.m.Panel({
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
								       new sap.m.Text({text : "지원금신청 계산근거"}).addStyleClass("L2PFontFamilyBold")
						]}).addStyleClass("L2PToolbarNoBottomLine"),
						oTable]
		});
		
		// 행사계획
		var oScheduleMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ["20%", "40%", "20%", "20%"]
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : "Center",
					content : [new sap.m.Text({text : "행사명"}).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.Input({
									width : "95%",
									value : "{Evtnm}",
									editable : {
										path : "ZappStatAl",
										formatter : function(fVal){
											if(fVal == "20") return true;
											else return false;
										}
									},
									maxLength : common.Common.getODataPropertyLength("ZHR_CLUB_SRV", "ClubSupportFundHead", "Evtnm"),
							   }).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : "Center",
					content : [new sap.m.Text({text : "일자"}).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : [new sap.m.DatePicker({
									valueFormat : "yyyy-MM-dd",
						            displayFormat : "yyyy.MM.dd",
						            value : "{Evtdt}",
									width : "50%",
									editable : {
										path : "ZappStatAl",
										formatter : function(fVal){
											if(fVal == "20") return true;
											else return false;
										}
									},
							   }).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oScheduleMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : "Center",
					content : [new sap.m.Text({text : "장소"}).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 3,
					content : [new sap.m.Input({
									width : "95%",
									value : "{Evtpl}",
									editable : {
										path : "ZappStatAl",
										formatter : function(fVal){
											if(fVal == "20") return true;
											else return false;
										}
									},
									maxLength : common.Common.getODataPropertyLength("ZHR_CLUB_SRV", "ClubSupportFundHead", "Evtpl"),
							   }).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oScheduleMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : "Center",
					content : [new sap.m.Text({text : "행사 내용"}).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 3,
					content : [new sap.m.TextArea({
									width : "95%",
									rows : 4,
									value : "{Evtde}",
									editable : {
										path : "ZappStatAl",
										formatter : function(fVal){
											if(fVal == "20") return true;
											else return false;
										}
									},
									maxLength : common.Common.getODataPropertyLength("ZHR_CLUB_SRV", "ClubSupportFundHead", "Evtde"),
							   }).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oScheduleMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : "Center",
					content : [new sap.m.Text({text : "참가인원"}).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 3,
					content : [new sap.m.Input({
									width : "10%",
									value : "{Partip}",
									editable : {
										path : "ZappStatAl",
										formatter : function(fVal){
											if(fVal == "20") return true;
											else return false;
										}
									},
									maxLength : common.Common.getODataPropertyLength("ZHR_CLUB_SRV", "ClubSupportFundHead", "Partip"),
							   }).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oScheduleMatrix.addRow(oRow);
		
		
		var oSchedulePanel = new sap.m.Panel({
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
								       new sap.m.Text({text : "행사계획"}).addStyleClass("L2PFontFamilyBold")
						]}).addStyleClass("L2PToolbarNoBottomLine"),
						oScheduleMatrix]
		});
		
		// 신청자정보
		var oApMatrix = new sap.ui.commons.layout.MatrixLayout({
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
		oApMatrix.addRow(oRow);
		
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
		oApMatrix.addRow(oRow);
		
		var oInfoPanel = new sap.m.Panel({
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
						oApMatrix]
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
								maxLength : common.Common.getODataPropertyLength("ZHR_CLUB_SRV", "ClubSupportFundHead", "ZappResn"),
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
		
		var oContents = [new sap.ui.core.HTML({content : "<div style='height : 15px;'/>"}), oAppPanel, oBasisPanel, oSchedulePanel, 
						 sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController), oInfoPanel, oDocPanel, oRejPanel];
		
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