jQuery.sap.require("common.SearchActivity");

sap.ui.jsfragment("ZUI5_HR_OverseaBTrip.fragment.OverseaBTripPage02", {
	
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
									}),
								
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
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							//기간
							text : "Period",
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
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
								}).addStyleClass("FontFamily"),
								new sap.m.Text({text : "~" , textAlign : "Center"}).addStyleClass("FontFamily"),
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
								}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({width:"10px"}),
								new sap.m.Text({
									text : {
										parts : [ {path : "Begtr"},{path : "Endtr"}],
										formatter : function(fVal1, fVal2){
											if(!common.Common.checkNull(fVal1) && !common.Common.checkNull(fVal2)){
												vPeriod =parseInt(common.Common.calDate(fVal2, fVal1));
												if(vPeriod < 0) vPeriod = vPeriod - 1 ;
												else vPeriod = vPeriod + 1 ;
												return "(" + vPeriod + "일)"
											}else return "";
										}
									}
								})
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : "Fixed Schedule",
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.RadioButtonGroup({
									columns : 2,
									buttons : [new sap.m.RadioButton({text: "Yes",
												}).addStyleClass("FontFamily"), 
									           new sap.m.RadioButton({text: "No",
									           }).addStyleClass("FontFamily")],
						            selectedIndex : "{Fixsc}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									select : function(event){
										oController._DetailJSonModel.setProperty("/Data/Fixsc", event.getParameters().selectedIndex);
									}
							   }).addStyleClass("PaddingTop3")
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
							text : "Budget",
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								 new sap.m.ComboBox({
							            items : {
							            	path: "ZHR_BUSITRIP_INT_SRV>/BudgeListSet",
											filters : [
												{sPath : 'Langu', sOperator : 'EQ', oValue1 : oController._vLangu}
											],
							            	template: new sap.ui.core.ListItem({
							            		key: "{ZHR_BUSITRIP_INT_SRV>Budge}",
							            		text: "{ZHR_BUSITRIP_INT_SRV>Budgetx}"
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
								   }).addStyleClass("FontFamily"),
						]}).addStyleClass("ToolbarNoBottomLine"),
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : "Cost Center/WBS", 
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
								    value : "{Kospostx}",
									editable : false ,
									width : "250px"
								}).addStyleClass("FontFamily PaddingRight5"),
								new sap.m.Input({
								    value : "{KospostxT}",
									editable : false ,
									width : "100%"
								}).addStyleClass("FontFamily"),
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
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [ new sap.m.Input({
							    value : "{Aufnr}",
							    width : "150px",
							    editable : {
									parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
									formatter : function(fVal1, fVal2) {
										return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
									}
								},
								valueHelpOnly : true,
								showValueHelp : true,
								valueHelpRequest: function(){
									common.SearchActivity.onPressActivity(oController);
								}
							}).addStyleClass("FontFamily"),
							new sap.m.ToolbarSpacer({
								width : "10px"
							}),
							new sap.m.Input({
							    value : "{Aufnrtx}",
							    width : "95%",
							    editable : false
							}).addStyleClass("FontFamily")
						]}).addStyleClass("ToolbarNoBottomLine"),
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : "Meals to be Provided",
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.RadioButtonGroup(oController.PAGEID + "_Mlind",{
									columns : 2,
									buttons : [new sap.m.RadioButton({text: "Yes",
												}).addStyleClass("FontFamily"), 
									           new sap.m.RadioButton({text: "No",
									           }).addStyleClass("FontFamily")],
						            selectedIndex : "{Mlind}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									select : function(event){
										oController._DetailJSonModel.setProperty("/Data/Mlind", event.getParameters().selectedIndex);
									}
							   }).addStyleClass("PaddingTop3")
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
							text : "Days",
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.CheckBox({
									text : "Business",
									selected : "{Wkflg}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									select : function(evt){
										if(evt.mParameters.selected == false) oController._DetailJSonModel.setProperty("/Data/Wkday", "");
									}
								}).addStyleClass("FontFamily"),
								new sap.m.Input({
								    value : "{Wkday}",
								    editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Wkflg"}],
										formatter : function(fVal1, fVal2, fVal3) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && fVal3 == true) ? true : false;
										}
									},
									textAlign : "End",
									width : "50px"
								}).addStyleClass("FontFamily PaddingLeft10"),
								new sap.m.CheckBox({
									text : "Training",
									selected : "{Edflg}",
									editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
										formatter : function(fVal1, fVal2) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2)) ? true : false;
										}
									},
									select : function(evt){
										if(evt.mParameters.selected == false) oController._DetailJSonModel.setProperty("/Data/Edday", "");
									}
								}).addStyleClass("FontFamily"),
								new sap.m.Input({
								    value : "{Edday}",
								    editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"}, {path : "Edflg"}],
										formatter : function(fVal1, fVal2, fVal3) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && fVal3 == true) ? true : false;
										}
									},
									textAlign : "End",
									width : "50px"
								}).addStyleClass("FontFamily PaddingLeft10"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							//용무
							text : "Purpose",
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
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
									maxLength : common.Common.getODataPropertyLength("ZHR_BUSITRIP_INT_SRV", "BusitripDomAppl", "Busin"),
								}).addStyleClass("FontFamily"),
						]}).addStyleClass("ToolbarNoBottomLine"),
					}).addStyleClass("MatrixData")
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							//비고
							text : "Remark" 
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
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
									maxLength : common.Common.getODataPropertyLength("ZHR_BUSITRIP_INT_SRV", "BusitripDomAppl", "Zbigo"),
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine"),
						colSpan : 3
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
//					height : "30px",
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : "Employee for Business Trip" 
						}).addStyleClass("MiddleTitle"),
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),
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
			noData : "There is no existing data.",
			selectionMode : sap.ui.table.SelectionMode.None,
			columnHeaderHeight : 35,
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
		}).addStyleClass("FontFamily");
		
		var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_INT_SRV");
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
			multiLabels : [ new sap.ui.commons.TextView({text : "Route",
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
			//출발지
			multiLabels : [ new sap.ui.commons.TextView({text : "Departure", textAlign : "Center"}).addStyleClass("FontFamilyBold")],
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
			//도착지
			multiLabels : [ new sap.ui.commons.TextView({text : "Destination", textAlign : "Center"}).addStyleClass("FontFamilyBold")],
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
			multiLabels : [ new sap.ui.commons.TextView({text : "Transportation", textAlign : "Center"}).addStyleClass("FontFamilyBold")],
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
			width : "100%"
		}).addStyleClass("FontFamily");
		
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
			multiLabels : [ new sap.ui.commons.TextView({text : "Accommodation", textAlign : "Center"}).addStyleClass("FontFamilyBold")	],
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
			multiLabels : [ new sap.ui.commons.TextView({text : "Staying Days", textAlign : "Center"}).addStyleClass("FontFamilyBold")],
			template : [new sap.m.Input({
				value : "{Day}",
		    	editable : {
		    		parts : [ {path : "ZappStatAl"}],
					formatter : function(fVal1, fVal2){
						if(fVal1 == "" || fVal1 == "10") return true;
						else return false;
					}
				},
				liveChange : common.Common.setOnlyDigit,
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
			multiLabels : [ new sap.m.CheckBox({text : "Deletion",
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
			}).addStyleClass("FontFamily")]
		}));
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : "Schedule" 
						}).addStyleClass("MiddleTitle"),
						new sap.m.ToolbarSpacer({}),
						new sap.m.Button({
							// 추가
							text : "Add", 
							type : sap.m.ButtonType.Ghost,
							press : oController.onPressAdd,
							visible : {
								parts : [{path : "ZappStatAl"}, {path : "Pernr"}],
								formatter : function(fVal1, fVal2) {
									return ((fVal1 == "" || fVal1 == "10") && fVal2) ? true : false;
								}
							}
						}).addStyleClass("FontFamily"),
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),
				oTable,
			],
		}).setModel(oController._DetailJSonModel)
		.bindElement("/Data");
	},
});