sap.ui.jsfragment("ZUI5_HR_AnnualLeave.fragment.AnnualLeavePage02", {
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
			this.getOffDutyInfoRender(oController),			
			this.getApplyInfoRender(oController),									// 신청내역
			this.getDetailTable(oController),										// 상세내역 Table
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
										text : oBundleText.getText("LABEL_0005"),                //5:결재자지정
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
									})
								]
						}).addStyleClass("ToolbarNoBottomLine")
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
	 * Off-Duty Day rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getOffDutyInfoRender : function(oController) {
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "20px",
					content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",}),	
					new sap.m.ToolbarSpacer({width: "5px"}),
					new sap.m.Text({text : "Off-Duty Day"}).addStyleClass("MiddleTitle"),
				]}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
				new sap.m.TextArea({
					value : "{Zdate}",
					rows : 2,
					width : "100%",
					editable : false,
					growing : true,
				}).addStyleClass("FontFamily colorRed")
			]
		});
	},
	
	
	/**
	 * 신청내역 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getApplyInfoRender : function(oController) {
		var oRow , oCell ;
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				// 적용일
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1050"), 	// 1050:사용연도
						required : true
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [new sap.m.Input({
							value : "{Useyr}",
//							editable : {
//								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
//								formatter : function(fVal1, fVal2){
//									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
//									else return false;
//								}
//							},
							editable : false,
//							type : sap.m.InputType.Number,
//							liveChange : function(evt){
//								var fVal = evt.getSource().getValue() ;
//								if(fVal && fVal.length > 4){
//									evt.getSource().setValue(fVal.substring(0,4) * 1);
//								}
//							},
							width : "150px",
							change : oController.onChangeUseyr
						}).addStyleClass("FontFamily"),
					]}).addStyleClass("ToolbarNoBottomLine"),
					colSpan : 3
				}).addStyleClass("MatrixData"),
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1054")	// 1054:연차 발생/사용/미사용일수
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({
						text : "{Holcnt1}"
					}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixData"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1056")	// 1056:하기휴가 발생/사용/미사용일수
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({
						text : "{Holcnt2}"
					}).addStyleClass("FontFamily")
				}).addStyleClass("MatrixData"),
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1055")	// 1055:집중휴가
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ new sap.m.DatePicker({
							valueFormat : "yyyy-MM-dd",
				            displayFormat : "yyyy.MM.dd",
				            value : "{Vcbeg}",
				            width : "150px",
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"},{path :"IvCheck"},{path : "Useyr"}],
								formatter : function(fVal1, fVal2, fVal3, fVal4){
									if((fVal1 == "" || fVal1 == "10") && fVal2 && (!fVal3 || fVal3 == false) && fVal4 && fVal4 != "") return true;
									else return false;
								}
							},
							minDate : {
								path : "Useyr",
								formatter : function(fVal){
									if(!common.Common.checkNull(fVal)){
										return new Date(fVal, 0, 1);
									}
								}
							},
							maxDate : {
								path : "Useyr",
								formatter : function(fVal){
									if(!common.Common.checkNull(fVal)){
										return new Date(fVal, 11, 31);
									}
								}
							}
					   }).addStyleClass("FontFamily"),
					   new sap.m.Text({text : "~"}).addStyleClass("FontFamily PaddingLeft10 PaddingRight10"),
					   new sap.m.DatePicker({
							valueFormat : "yyyy-MM-dd",
				            displayFormat : "yyyy.MM.dd",
				            value : "{Vcend}",
							width : "150px",
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"},{path :"IvCheck"},{path : "Useyr"}],
								formatter : function(fVal1, fVal2, fVal3, fVal4){
									if((fVal1 == "" || fVal1 == "10") && fVal2 && (!fVal3 || fVal3 == false) && fVal4 && fVal4 != "") return true;
									else return false;
								}
							},
							minDate : {
								path : "Useyr",
								formatter : function(fVal){
									if(!common.Common.checkNull(fVal)){
										return new Date(fVal, 0, 1);
									}
								}
							},
							maxDate : {
								path : "Useyr",
								formatter : function(fVal){
									if(!common.Common.checkNull(fVal)){
										return new Date(fVal, 11, 31);
									}
								}
							}
					   }).addStyleClass("FontFamily"),
					   new sap.m.ToolbarSpacer({ width : "4px"}),
					   new sap.m.Button({
						   text : oBundleText.getText("LABEL_1044"),	// 1044:기간 적용
						   press : oController.onSetIntensiveVacation,
						   type : "Ghost",
						   enabled : {
							   parts :[{path :"Vcbeg"},{path :"Vcend"},{path :"IvCheck"},{path : "ZappStatAl"}, {path : "Pernr"}],
							   formatter : function(fVal1, fVal2, fVal3, fVal4, fVal5){
								   if(fVal4 != "" && fVal4 != "10") return false;
								   else if(!fVal5 || fVal5 == "") return false;
								   
								   if(fVal1 && fVal1 != "" && fVal2 && fVal2 != "" && (!fVal3 || fVal3 == false)) return true ;
								   else return false;
							   }
						   }
					   }),
					   new sap.m.ToolbarSpacer({ width : "4px"}),
					   new sap.m.Button({
						   text : oBundleText.getText("LABEL_1045"),	// 1045:기간 취소
						   press : oController.onDelIntensiveVacation,
						   type : "Ghost",
						   enabled : {
							   parts :[{path :"Vcbeg"},{path :"Vcend"},{path :"IvCheck"},{path : "ZappStatAl"}, {path : "Pernr"}],
							   formatter : function(fVal1, fVal2, fVal3, fVal4, fVal5){
								   if(fVal4 != "" && fVal4 != "10") return false;
								   else if(!fVal5 || fVal5 == "") return false;
								   
								   if(fVal1 && fVal1 != "" && fVal2 && fVal2 != "" && fVal3 == true) return true ;
								   else return false;
							   }
						   }
					   }),
					   new sap.m.ToolbarSpacer({ width : "4px"}),
					]}).addStyleClass("ToolbarNoBottomLine"),
					colSpan : 3	
				}).addStyleClass("MatrixData"),
				
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_0762")	// 762:집중휴가중 직무인수인
					}).addStyleClass("FontFamilyBold")
				}).addStyleClass("MatrixLabel"),
				
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [new sap.m.Input({
						    value : "{Takper}",
						    editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
									else return false;
								}
							},
							maxLength : common.Common.getODataPropertyLength("ZHR_LEAVEAPPL_SRV", "YearLeaveList", "Takper"),
							width : "300px"
						}).addStyleClass("FontFamily"),
					]}).addStyleClass("ToolbarNoBottomLine"),
					colSpan : 3	
				}).addStyleClass("MatrixData"),
				
			]
		});
		oApplyInfoMatrix.addRow(oRow);
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "20px",
					content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",}),
					new sap.m.ToolbarSpacer({width: "5px"}),
					new sap.m.Text({text : oBundleText.getText("LABEL_1051")}).addStyleClass("MiddleTitle"),	// 1051:연간휴가 신청
				]}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
				oApplyInfoMatrix	
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
//			columnHeaderHeight : 35,
//			rowHeight : 35,
			showOverlay : false,
			selectionMode : sap.ui.table.SelectionMode.None,
			visibleRowCount : 1
		})
		.addStyleClass("tableNotHover");
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : false,
			showFilterMenuEntry : true,
			width : "70px",
			multiLabels : new sap.m.CheckBox(oController.PAGEID + "_checkAll",{select : oController.CheckAll}),
			template : [new sap.m.CheckBox({
						selected  : "{Check}",
						                              // Conchk 집중휴가, Disp 조회여부   
						editable : { parts : [{path : "Conchk"},{path : "ZappStatAl"},{path : "Pernr"},{path : "Disp"}],
									 formatter : function(fVal1, fVal2, fVal3, fVal4){
										 if(!fVal3 || fVal3 == "") return false ;
										 else if(fVal2 != "" && fVal2 != "10") return false; 
										 else if(fVal1 && fVal1 == true) return false ;
										 else if(fVal4 == "X") return false;
										 else return true;
									 }
								}
							})]
		}));
		
		var col_info1 = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "80px"}];
			common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "200px",
			multiLabels : new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0763"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 763:휴가
//			template : [oAptyp]
			template : [
				new sap.m.ComboBox({ 
					selectedKey : "{Awart}",
					items : {
						path : "/Awart",
						template : new sap.ui.core.ListItem({
							key : "{Awart}",
							text : "{Atext}"
						}),
						templateShareable : true
					},
					enabled : { 
						parts : [{path : "Conchk"},{path : "ZappStatAl"},{path : "Pernr"},{path : "Disp"}],
						formatter : function(fVal1, fVal2, fVal3, fVal4){
							 if(!fVal3 || fVal3 == "") return false ;
							 else if(fVal2 != "" && fVal2 != "10") return false; 
							 else if(fVal1 && fVal1 == true) return false ;
							 else if(fVal4 == "X") return false ;
							 else return true;
						 }
					},
					customData : [
						new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"}),
					],
					change : oController.onChangeAptyp
				}).addStyleClass("FontFamily")
			]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "150px",
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_0154"),	// 154:사용일 
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
			template : [new sap.m.Text({
							text : "{Datum}"
						}).addStyleClass("FontFamily")]
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "250px",
			multiLabels :new sap.m.Label({text : oBundleText.getText("LABEL_1047"),	// 1047:반일휴가 시각
							   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
	        template : new sap.m.Text({
							text : "{Holtim}"
						}).addStyleClass("FontFamily")
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "150px",
			multiLabels :new sap.m.Label({text : oBundleText.getText("LABEL_0918"),	// 918:사용일수
							   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
	        template : new sap.m.Text({
							text : "{Useday}"
						}).addStyleClass("FontFamily")
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "150px",
			multiLabels : new sap.m.Label({text : "Off-Duty Day",
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
			template : new sap.m.CheckBox({
							selected  : "{Offdut}",
							editable : false
							})
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "150px",
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_1055"),	// 1055:집중휴가
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
			template : new sap.m.CheckBox({
							selected  : "{Conchk}",
							editable : false
							})
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "150px",
			multiLabels : new sap.m.Label({text : "MRD",
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
			template : new sap.m.CheckBox({
							selected  : "{Mrdchk}",
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Awart"}, {path : "CredayYea"}],
								formatter : function(fVal1, fVal2, fVal3, fVal4){
									if((fVal1 == "" || fVal1 == "10") && fVal2){
										if(fVal3 == "1010" ) return true;
										else return false;
									}else return false;
								}
							},
						})
		}));
		
		oTable.setModel(oController._DetailTableJSonModel);
		oTable.bindRows("/Data");
		
		oTable.addEventDelegate({
	           onAfterRendering: function() {
	                var oTds = $("td[colspan]");
	                for(i=0; i<oTds.length; i++) {
	                   if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
	                }                
	           }
	      });
		
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content :  [
				new sap.m.Toolbar({
					content : [
				    	new sap.m.ToolbarSpacer(),
				    	new sap.m.Button({
				    		text : oBundleText.getText("LABEL_0023"),	// 23:등록
				    		press : oController.onPressAdd,
				    		enabled : {
				    			parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
									else return false;
								}
				    		},
				    		type : "Ghost"
		    		   }),
		    		   new sap.m.Button({
		    			   text : oBundleText.getText("LABEL_0033"),	// 33:삭제
		    			   press : oController.onPressDelRecord,
		    			   enabled : {
		    				   parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2) return true;
									else return false;
								}
		    			   },
		    			   type : "Ghost"
		    		   })
				   ]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),
				oTable
			]
		});
		
		
	},
});