jQuery.sap.require("common.SearchActivity");

sap.ui.jsfragment("ZUI5_HR_DomesticBTrip.fragment.DomesticBTripPage02", {
	
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
			this.getDetailTable(oController),								// 상세내역
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
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "45px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({	
				content : [ new sap.m.Toolbar(oController.PAGEID + "_ManualToolbar",{	
							}).addStyleClass("ToolbarNoBottomLine NoMarginLeft"),
							new sap.m.ToolbarSpacer(),
							new sap.m.Button({
								text : oBundleText.getText("LABEL_0022"), 	// 22:뒤로
								press : oController.onBack
							}),
							new sap.m.Button({text : oBundleText.getText("LABEL_0759"),// 759:위임지정
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
							}),
						  ]
				}).addStyleClass("ToolbarNoBottomLine NoMarginLeft"),
			vAlign : "Bottom" 
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
							text : oBundleText.getText("WORKSCHEDULE"),  //근무조
						}).addStyleClass("Font14px FontBold FontColor3"),
//						hAlign : "Center" ,
						vAlign : "Middle" 
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							height : "30px",
							content : [
								new sap.m.Input({
									value : "{SchkztxLong}",
									width : "300px",
									editable : false,
								}).addStyleClass("Font14px FontBold FontColor3"),
							]
						}).addStyleClass("ToolbarNoBottomLine"),
						hAlign : "Center" ,
						vAlign : "Middle" ,
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
							text : oBundleText.getText("PERIOD"),
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							height : "30px",
							content : [
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Begtr}",
							    	width : "150px",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
							    	change : function(oEvent){
							    		oController.onChangeDate(oEvent);
							    		
							    		oController.setFactoryActivity(oController);
							    	}
								}).addStyleClass("Font14px FontBold FontColor3"),
								new sap.m.Text({text : "~" , textAlign : "Center"}).addStyleClass("Font14px FontBold FontColor3"),
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Endtr}",
							    	width : "150px",
							    	editable : {
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}],
										formatter : function(fVal1, fVal2){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
							    	change : oController.onChangeDate
								}).addStyleClass("Font14px FontBold FontColor3"),
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
					
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							//예산구분
							text : oBundleText.getText("BUDGET"),
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							height : "30px",
							content : [
								 new sap.m.ComboBox({
							            items : {
							            	path: "ZHR_BUSITRIP_DOM_SRV>/BudgeListSet",
							            	filters : [
												{sPath : 'Langu', sOperator : 'EQ', oValue1 : oController._vLangu}
											],
							            	template: new sap.ui.core.ListItem({
							            		key: "{ZHR_BUSITRIP_DOM_SRV>Budge}",
							            		text: "{ZHR_BUSITRIP_DOM_SRV>Budgetx}"
							            	})
							            },
							            editable : {
											parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
											formatter : function(fVal1, fVal2) {
												return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
											}
										},
										change : oController.onChangeBudge,
							            selectedKey: "{Budge}",
										width : "200px"
								   }).addStyleClass("Font14px FontBold FontColor3"),
						]}).addStyleClass("ToolbarNoBottomLine"),
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							//출장시간
							text : oBundleText.getText("BTRIP_TIME") 
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
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Begtr"}, {path : "Endtr"}],
										formatter : function(fVal1, fVal2, fVal3, fVa4){
											if((fVal1 == "" || fVal1 == "10") && fVal2){
												if(common.Common.checkNull(fVal3) || common.Common.checkNull(fVa4) || fVal3 != fVa4) return false;
												else return true;
											}
											else return false;
										}
									},
								    width : "150px",
								    change : oController.onChangeTime
								}).addStyleClass("Font14px FontBold FontColor3"),
								new sap.m.Text({text : "~"}).addStyleClass("Font14px FontBold FontColor3 PaddingLeft10 PaddingRight10px"),
								new sap.m.TimePicker({
									valueFormat : "HHmm",
									displayFormat : "HH:mm",
						            textAlign : sap.ui.core.TextAlign.Begin,
									value : "{Enduz}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Begtr"}, {path : "Endtr"}],
										formatter : function(fVal1, fVal2, fVal3, fVa4){
											if((fVal1 == "" || fVal1 == "10") && fVal2){
												if(common.Common.checkNull(fVal3) || common.Common.checkNull(fVa4) || fVal3 != fVa4) return false;
												else return true;
											}
											else return false;
										}
									},
								    width : "150px",
								    change : oController.onChangeTime
								}).addStyleClass("Font14px FontBold FontColor3"),
								new sap.m.ToolbarSpacer({width : "10px"}),
								new sap.m.Input({
									value : "{Hour}",
									width : "50px",
									editable : false,
								}).addStyleClass("Font14px FontBold FontColor3"),
								new sap.m.Text({
									text : oBundleText.getText("HOUR") 
								}).addStyleClass("Font14px FontBold FontColor3"),
								new sap.m.Input({
									value : "{Minute}",
									width : "50px",
									editable : false,
								}).addStyleClass("Font14px FontBold FontColor3"),
								new sap.m.Text({
									text : oBundleText.getText("MINUTE") 
								}).addStyleClass("Font14px FontBold FontColor3"),
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
							text : "Cost Center/WBS", 
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							height : "30px",
							content : [
								new sap.m.Input({
								    value : "{Kospostx}",
									editable : false ,
									width : "250px"
								}).addStyleClass("Font14px FontBold FontColor3 PaddingRight5"),
								new sap.m.Input({
								    value : "{KospostxT}",
									editable : false ,
									width : "100%"
								}).addStyleClass("Font14px FontBold FontColor3"),
						]}).addStyleClass("ToolbarNoBottomLine"),
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							//용무
							text : oBundleText.getText("PURPOSE"),
							required : true
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							height : "30px",
							content : [
								new sap.m.Input({
								    value : "{Busin}",
								    editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									width : "100%",
									maxLength : common.Common.getODataPropertyLength("ZHR_BUSITRIP_DOM_SRV", "BusitripDomAppl", "Busin"),
								}).addStyleClass("Font14px FontBold FontColor3"),
						]}).addStyleClass("ToolbarNoBottomLine"),
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
							height : "30px",
							content : [ new sap.m.Input({
							    value : "{Aufnr}",
							    width : "150px",
							    editable : {
									parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
									formatter : function(fVal1, fVal2, fVal3) {
										return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
									}
								},
								valueHelpOnly : true,
								showValueHelp : true,
								valueHelpRequest: function(){
									common.SearchActivity.onPressActivity(oController);
								}
							}).addStyleClass("Font14px FontBold FontColor3"),
							new sap.m.Input({
							    value : "{Aufnrtx}",
							    width : "100%",
							    editable : false
							}).addStyleClass("Font14px FontBold FontColor3 PaddingLeft10")
						]}).addStyleClass("ToolbarNoBottomLine"),
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : ""
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
						}).addStyleClass("ToolbarNoBottomLine"),
					}).addStyleClass("MatrixData"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							//비고
							text : oBundleText.getText("REMARK") 
						}).addStyleClass("Font14px FontBold FontColor3")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						colSpan : 3,
						content : new sap.m.Toolbar({
							height : "30px",
							content : [
								new sap.m.Input({
									value : "{Zbigo}",
									width : "100%",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									maxLength : common.Common.getODataPropertyLength("ZHR_BUSITRIP_DOM_SRV", "BusitripDomAppl", "Zbigo"),
								}).addStyleClass("Font14px FontBold FontColor3"),
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
						new sap.m.Image({
							src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",
						   }),
					    new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_1203") 	// 1203:국내출장명령 신청
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
			width : "98%"
		}).addStyleClass("FontFamily");
		
		var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_DOM_SRV");
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
			multiLabels : [ new sap.ui.commons.TextView({text : oBundleText.getText("ROUTE"),
				textAlign : "Center"}).addStyleClass("Font14px FontBold FontColor3")	],
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
			multiLabels : [ new sap.ui.commons.TextView({text : oBundleText.getText("DEPARTURE"), textAlign : "Center"}).addStyleClass("Font14px FontBold FontColor3")],
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
			}).addStyleClass("FontFamily")]
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
			multiLabels : [ new sap.ui.commons.TextView({text : oBundleText.getText("DESTINATION"), textAlign : "Center"}).addStyleClass("Font14px FontBold FontColor3")],
			template : [new sap.m.Input({
				value : "{Elotx}",
		    	editable : false,
				textAlign : "Center",
			}).addStyleClass("FontFamily")]
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
			multiLabels : [ new sap.ui.commons.TextView({text : oBundleText.getText("TRANSPORTATION"), textAlign : "Center"}).addStyleClass("Font14px FontBold FontColor3")],
			template : [new sap.m.Input({
				value : "{Trftx}",
		    	editable : false,
				textAlign : "Center",
			}).addStyleClass("FontFamily")]
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
			width : "98%"
		}).addStyleClass("Font14px FontBold FontColor3");
		
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
//			width : "120px",
			// 숙박시설
			multiLabels : [ new sap.ui.commons.TextView({text : oBundleText.getText("ACCOMDATION"), textAlign : "Center"}).addStyleClass("Font14px FontBold FontColor3")	],
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
//			width : "120px",
			//숙박일
			multiLabels : [ new sap.ui.commons.TextView({text : oBundleText.getText("STAYING_DAYS"), textAlign : "Center"}).addStyleClass("Font14px FontBold FontColor3")],
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
				maxLength : common.Common.getODataPropertyLength("ZHR_BUSITRIP_DOM_SRV", "BusitripDomDetail", "Day"),
				textAlign : "End",
			}).addStyleClass("FontFamily")]
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
			multiLabels : [ 
//							new sap.ui.commons.CheckBox({text : oBundleText.getText("DELETION"),
						    new sap.m.CheckBox({text : oBundleText.getText("DELETION"),
								editable : { parts : [{path : "ZappStatAl"}],
									formatter : function(fVal1, fVal2) {
										return (fVal1 == "" || fVal1 == "10") ? true : false;
									}	
								},
								select : oController.onPressDeleteAll,
								textAlign : "End"}).setModel(oController._DetailJSonModel).bindElement("/Data")
								.addStyleClass("Font14px FontBold FontColor3")],
//			template : [new sap.ui.commons.CheckBox({
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
			}).addStyleClass("FontFamily")]
		}));
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
//					height : "20px",
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
							text : oBundleText.getText("ADD"), 
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
});