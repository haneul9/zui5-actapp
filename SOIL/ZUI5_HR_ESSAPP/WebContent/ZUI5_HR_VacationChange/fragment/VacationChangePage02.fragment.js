sap.ui.jsfragment("ZUI5_HR_VacationChange.fragment.VacationChangePage02", {
	
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
			this.getApplyTable(oController),									// 신청내역
			this.getEmpList(oController),								// 휴가자/대근자 정보
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
								new sap.m.Text(oController.PAGEID + "_DetailTitle").addStyleClass("Font18px FontColor0"),	
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
									new sap.m.Button({text : oBundleText.getText("LABEL_0759"),	// 759:위임지정
										  press : common.MandateAction.onMandate,
										  visible : {
											  path : "ZappStatAl",
											  formatter : function(fVal){
												  if(fVal == "" || fVal == "10") return true;
												  else return false;
											  }
										  }
									}),
									new sap.m.Button({
										text : oBundleText.getText("LABEL_0005"), 
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
					// 통근지역내 무주택
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1896"),	// 1896:신청 유형
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.ComboBox({
									width : "200px",
									selectedKey : "{Chtyp}",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									items : [new sap.ui.core.Item({key: "A", text: oBundleText.getText("LABEL_0751")}),	// 751:변경
									         new sap.ui.core.Item({key: "B", text: oBundleText.getText("LABEL_0071")})],	// 71:취소
									change : oController.onChangeChtyp
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine"),
						colSpan : 3
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					// 집중휴가중 직무인수인
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_0762")	// 762:집중휴가중 직무인수인
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
									value : "{Takper}",
									width : "300px",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									maxLength : common.Common.getODataPropertyLength("ZHR_LEAVEAPPL_SRV", "LeaveAppList", "Takper"),
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
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
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_2358") 	// 2358:휴가 변경/취소 신청
						}).addStyleClass("MiddleTitle"),
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
				new sap.ui.commons.layout.MatrixLayout({
					columns : 4,
					widths : ['20%', '30%', '20%', '30%'],
					rows : aRows
				}).setModel(oController._DetailJSonModel)
				.bindElement("/Data"),
			]
		});
	},
	
	/**
	 * 신청내역 Table rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getApplyTable : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_ApplyTable",{
			enableColumnReordering : false,
			enableColumnFreeze : false,
			showNoData : true,
			selectionMode : sap.ui.table.SelectionMode.None,
//			selectionMode : sap.ui.table.SelectionMode.Multitoggle,
			visibleRowCount : 1
		});
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "50px",
			multiLabels : new sap.m.CheckBox(oController.PAGEID + "_checkAll",{select : oController.CheckAll}),
			template : [new sap.m.CheckBox({
						selected  : "{Check}",
						editable : { parts : [{path : "ZappStatAl"}],
									 formatter : function(fVal1){
										 if((fVal1 == "" || fVal1 == "10" ) ) return true;
										 else return false;
									 }
								}
							})]
		}));
		
		var col_info1 = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "50px"}];
			common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "165px",
			multiLabels :[ new sap.m.Label({text : oBundleText.getText("LABEL_0749"),	// 749:기신청
											textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						   new sap.m.Label({text : oBundleText.getText("LABEL_0763"),	// 763:휴가
								   			textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						 ],
			headerSpan : [3,1],
			template : [new sap.m.Text({
							text : "{Oaptxt}"
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
			width : "10%",
			multiLabels :[ new sap.m.Label({text : oBundleText.getText("LABEL_0749"),	// 749:기신청
				   							textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						   new sap.m.Label({text : oBundleText.getText("LABEL_0042"),	// 42:시작일
								   			textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						 ],
			headerSpan : [3,1],
			template : [
				new sap.m.DatePicker({
					valueFormat : "yyyy-MM-dd",
		            displayFormat : "yyyy.MM.dd",
		            value : "{Ovcbeg}",
					editable : false
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
			width : "10%",
			multiLabels :[ new sap.m.Label({text : oBundleText.getText("LABEL_0749"),	// 749:기신청
				   							textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						   new sap.m.Label({text : oBundleText.getText("LABEL_0065"),	// 65:종료일
								   			textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						 ],
			headerSpan : [3,1],
			template : [
				new sap.m.DatePicker({
					valueFormat : "yyyy-MM-dd",
		            displayFormat : "yyyy.MM.dd",
		            value : "{Ovcend}",
					editable : false
			   }).addStyleClass("FontFamily")
			]
		}));
		
		oTable.addColumn(new sap.ui.table.Column(oController.PAGEID +"_AptypC",{
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "18%",
			multiLabels :[ new sap.m.Label({text : oBundleText.getText("LABEL_0751"),	// 751:변경
											textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						   new sap.m.Label({text : oBundleText.getText("LABEL_0763"),	// 763:휴가
								   			textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						  ],
			headerSpan : [3,1],
		}));
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "10%",
			multiLabels :[ new sap.m.Label({text : oBundleText.getText("LABEL_0751"),	// 751:변경
				   							textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						   new sap.m.Label({text : oBundleText.getText("LABEL_0042"),	// 42:시작일
								   			textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						 ],
			headerSpan : [3,1],
			template : [
				new sap.m.DatePicker({
					valueFormat : "yyyy-MM-dd",
		            displayFormat : "yyyy.MM.dd",
		            value : "{Vcbeg}",
		            editable : {
			    		parts : [ {path : "ZappStatAl"}, {path : "Chtyp"}],
						formatter : function(fVal1, fVal2){ // 변경 일 경우에만 Data 변경가능 
							if((fVal1 == "" || fVal1 == "10" ) && fVal2 == "A" ) return true;
							else return false;
						}
					},
					change : oController.onChangeBegda
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
			width : "10%",
			multiLabels :[ new sap.m.Label({text : oBundleText.getText("LABEL_0751"),	// 751:변경
				   							textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						   new sap.m.Label({text : oBundleText.getText("LABEL_0065"),	// 65:종료일
								   			textAlign : "Center"}).addStyleClass("FontFamilyBold"),
						 ],
			headerSpan : [3,1],
			template : [
				new sap.m.DatePicker({
					valueFormat : "yyyy-MM-dd",
		            displayFormat : "yyyy.MM.dd",
		            value : "{Vcend}",
		            editable : {
			    		parts : [ {path : "ZappStatAl"}, {path : "Chtyp"}],
						formatter : function(fVal1, fVal2){ // 변경 일 경우에만 Data 변경가능 
							if((fVal1 == "" || fVal1 == "10" ) && fVal2 == "A" ) return true;
							else return false;
						}
					},
					change : oController.onChangeDate
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
			width : "6%",
			multiLabels :new sap.m.Label({text : oBundleText.getText("LABEL_2369"),	// 2369:휴가일수
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
			width : "8%",
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
			width : "6%",
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
			width : "6%",
			multiLabels : new sap.m.Label({text : "MRD",
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
			template : new sap.m.CheckBox({
							selected  : "{Mrdchk}",
				            editable : {
					    		parts : [ {path : "ZappStatAl"}, {path : "Aptyp"}, {path : "CredayYea"}, {path : "Chtyp"}],
								formatter : function(fVal1, fVal2, fVal3, fVal4){ // 변경 일 경우에만 Data 변경가능 
									if((fVal1 == "" || fVal1 == "10") && fVal4 == "A"){
										if(fVal2 == "1010" || fVal2 == "1020" || fVal2 == "1030" || 
											 ( fVal2 == "1040" && fVal3 && fVal3 * 1 >= 0 )) return true;
										else return false;
									}else{
										return false;
									}
								}
							},
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
			width : "25%",
			multiLabels : new sap.m.Label({text : oBundleText.getText("LABEL_0032"),	// 32:사유
										   textAlign : "Center"}).addStyleClass("FontFamilyBold"),
			template : new sap.m.Input({
							value  : "{Reasn}",
							editable : {
					    		parts : [ {path : "ZappStatAl"} ],
								formatter : function(fVal1){
									if((fVal1 == "" || fVal1 == "10" )) return true;
									else return false;
								}
							},
							maxLength : common.Common.getODataPropertyLength("ZHR_LEAVEAPPL_SRV", "ChangeLeaveAppDetail", "Reasn"),
						})
		}));
		
		oTable.setModel(oController._ApplyTableJSonModel);
		oTable.bindRows("/Data");
		
		oTable.addEventDelegate({
	           onAfterRendering: function() {
	        	   oController.onSetRowSpan();
	           }
	      });
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
//					height : "30px",
					content : [
						new sap.m.ToolbarSpacer({}),
						// Buttons
						new sap.m.Button({
			    			   text : oBundleText.getText("LABEL_1229"),	// 1229:신청내역 조회
			    			   press : oController.openHistoryDialog,
			    			   type : "Ghost",
			    			   visible : {
						    		parts : [ {path : "ZappStatAl"} ],
									formatter : function(fVal1){
										if((fVal1 == "" || fVal1 == "10" )) return true;
										else return false;
									}
								},
		    		   }),
		    		   new sap.m.Button({
		    			   text : oBundleText.getText("LABEL_0006"),	// 6:근무일정
		    			   press : oController.onCheckWorkSchedule,
		    			   type : "Ghost",
		    			   visible : {
					    		parts : [ {path : "ZappStatAl"} ],
								formatter : function(fVal1){
									if((fVal1 == "" || fVal1 == "10" )) return true;
									else return false;
								}
							},
		    		   }),
		    		   new sap.m.Button({
		    			   text : oBundleText.getText("LABEL_0033"),	// 33:삭제
		    			   press : oController.onDeleteHistory,
		    			   type : "Ghost",
		    			   visible : {
					    		parts : [ {path : "ZappStatAl"} ],
								formatter : function(fVal1){
									if((fVal1 == "" || fVal1 == "10" )) return true;
									else return false;
								}
							},
		    		   }),
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 
				oTable
			],
			visible : {
				path : "Chtyp",
				formatter : function(fVal){
					return !common.Common.checkNull(fVal) ;
				}
			}
		}).setModel(oController._DetailJSonModel)
		.bindElement("/Data");
	},
	
	/**
	 * 휴가자/대근자 정보 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getEmpList : function(oController){
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable",{
			enableColumnReordering : false,
			enableColumnFreeze : false,
			showNoData : true,
			selectionMode : sap.ui.table.SelectionMode.None,
			columnHeaderHeight : 35,
			visibleRowCount : 1
		}).setModel(oController._DetailTableJSonModel)
		.bindRows("/Data");
		
		var col_info1 = [
			{id: "Datum", label : oBundleText.getText("LABEL_2371"), plabel : oBundleText.getText("LABEL_0057"), span : 4, type : "date", sort : false, filter : false, width : "80px"},	// 57:일자, 2371:휴가자
			 {id: "Week", label : "", plabel : oBundleText.getText("LABEL_0054"), span : 0, type : "string", sort : false, filter : false, width : "50px"},	// 54:요일
			 {id: "Rtext", label : "", plabel : oBundleText.getText("LABEL_0006"), span : 0, type : "string", sort : false, filter : false, width : "200px"},	// 6:근무일정
			 {id: "Ttext", label : "", plabel : oBundleText.getText("LABEL_0671"), span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 671:근무시간
			 {id: "Sperid", label : oBundleText.getText("LABEL_1669"), plabel : oBundleText.getText("LABEL_0031"), span : 9, type : "string", sort : false, filter : false, width : "80px"},	// 31:사번, 1669:대근자(대근일 포함)
			];
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
		oTable.addColumn(new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "120px",
			multiLabels : [ new sap.ui.commons.TextView({text : "", textAlign : "Center"}).addStyleClass("FontFamily"),
				            new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0038"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],	// 38:성명
			template : [new sap.m.Input({
				value : "{Ename}",
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
				valueHelpRequest: oController.onPressAdd,
			}).addStyleClass("FontFamily")]
		}));
		
		col_info1 = [{id: "Sttext", label : "", plabel : oBundleText.getText("LABEL_0671"), span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 671:근무시간
			 {id: "TwrktmDat", label : "", plabel : oBundleText.getText("LABEL_1668"), span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 1668:대근일 총근로
			 {id: "TwrktmWek", label : "", plabel : oBundleText.getText("LABEL_2139"), span : 0, type : "string", sort : false, filter : false, width : "100px"},	// 2139:주당 총근로
			 {id: "RestmTre", label : "", plabel : oBundleText.getText("LABEL_1417"), span : 0, type : "string", sort : false, filter : false, width : "80px"},	// 1417:3개월 특근가능 잔여시간
			 {id: "Zstat", label : "", plabel : oBundleText.getText("LABEL_0036"), span : 0, type : "string", sort : false, filter : false, width : "50px"},	// 36:상태
			 {id: "Confchk", label : "", plabel : oBundleText.getText("LABEL_1672"), span : 0, type : "string", sort : false, filter : false, width : "50px"},	// 1672:대근지정 적합여부
			];
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
        	multiLabels : [ new sap.ui.commons.TextView({text : "", textAlign : "Center"}).addStyleClass("FontFamily"),
        					new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0096"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],	// 96:비고
			showFilterMenuEntry : true,
			width : "8%",
			template : [new sap.m.Input({
				value : "{Zbigo}",
		    	editable : {
		    		parts : [ {path : "ZappStatAl"}],
					formatter : function(fVal1, fVal2){
						if(fVal1 == "" || fVal1 == "10") return true;
						else return false;
					}
				},
				maxLength : common.Common.getODataPropertyLength("ZHR_LEAVEAPPL_SRV", "LeaveAppDetail", "Zbigo"),
				textAlign : "Begin",
			}).addStyleClass("FontFamily")]
		});
		oTable.addColumn(oColumn);
		
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
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "20px",
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_2372") 	// 2372:휴가자/대근자 정보
						}).addStyleClass("MiddleTitle")
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px"),
				oTable,
			],
			visible : {
	    		parts : [ {path : "Chtyp"},{path : "ShiftYn"}],
				formatter : function(fVal1, fVal2){
					if(!common.Common.checkNull(fVal1) && fVal1 == "A" && fVal2 == "Y") return true;
					else return false;
				}
			},
		}).setModel(oController._DetailJSonModel)
		.bindElement("/Data");
	},
});