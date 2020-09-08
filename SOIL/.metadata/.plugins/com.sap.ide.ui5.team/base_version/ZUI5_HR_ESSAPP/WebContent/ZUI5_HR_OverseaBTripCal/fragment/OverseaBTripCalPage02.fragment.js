jQuery.sap.require("common.SearchActivity");

sap.ui.jsfragment("ZUI5_HR_OverseaBTripCal.fragment.OverseaBTripCalPage02", {
	
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
						}).addStyleClass("FontFamilyBold")
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
								}).addStyleClass("FontFamily"),
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : ""
						}).addStyleClass("FontFamily")
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
							//기간
							text : oBundleText.getText("LABEL_1204")	// 1204:기간
						}).addStyleClass("FontFamilyBold")
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
								}).addStyleClass("FontFamily"),
								new sap.m.Text({text : "~" , textAlign : "Center"}).addStyleClass("FontFamily"),
								new sap.m.DatePicker({
							    	valueFormat : "yyyy-MM-dd",
							    	displayFormat : "yyyy.MM.dd",
							    	value : "{Endtr2}",
							    	width : "150px",
							    	editable : false
								}).addStyleClass("FontFamily"),
								new sap.m.ToolbarSpacer({width:"10px"}),
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
									}
								})
							]
						}).addStyleClass("ToolbarNoBottomLine")
					}).addStyleClass("MatrixData"),
					
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							//기간
							text : oBundleText.getText("LABEL_1252")	// 1252:일정변경
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
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
										formatter : function(fVal1, fVal2, fVal3){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
										}
									},
									change : function(oEvent){
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
							    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
										formatter : function(fVal1, fVal2, fVal3){
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
										}
									},
//							    	change : oController.onChangeDate
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
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								 new sap.m.ComboBox({
							            items : {
							            	path: "ZHR_BUSITRIP_PAY_INT_SRV>/BudgeListSet",
											filters : [
												{sPath : 'Langu', sOperator : 'EQ', oValue1 : '3'}
											],
							            	template: new sap.ui.core.ListItem({
							            		key: "{ZHR_BUSITRIP_PAY_INT_SRV>Budge}",
							            		text: "{ZHR_BUSITRIP_PAY_INT_SRV>Budgetx}"
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
							//용무
							text : oBundleText.getText("LABEL_1210"),	// 1210:용무
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
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
									maxLength : common.Common.getODataPropertyLength("ZHR_BUSITRIP_PAY_INT_SRV", "BusitripIntAppl", "Busin"),
								}).addStyleClass("FontFamily"),
						]}).addStyleClass("ToolbarNoBottomLine"),
					}).addStyleClass("MatrixData"),
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
					}).addStyleClass("MatrixData")
					]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1253"), 	// 1253:정산내역
							required : true
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							content : [
								new sap.m.Input({
								    value : "{Pyrsn}",
								    editable : {
										parts : [{path : "ZappStatAl"}, {path : "Pernr"},{path : "Docno2"}],
										formatter : function(fVal1, fVal2, fVal3) {
											return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
										}
									},
									width : "100%"
								}).addStyleClass("FontFamily"),
						]}).addStyleClass("ToolbarNoBottomLine"),
					}).addStyleClass("MatrixData"),
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
							}).addStyleClass("FontFamily"),
							new sap.m.ToolbarSpacer({
								width : "10px"
							}),
							new sap.m.Input({
							    value : "{Aufnrtx}",
							    width : "100%",
							    editable : false
							}).addStyleClass("FontFamily")
						]}).addStyleClass("ToolbarNoBottomLine"),
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : ""
						}).addStyleClass("FontFamilyBold")
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
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : oBundleText.getText("LABEL_1279") 	// 1279:해외출장비 신청
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
		
		var oModel = sap.ui.getCore().getModel("ZHR_BUSITRIP_PAY_INT_SRV");
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
			multiLabels : [ new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1206"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],	// 1206:도착지
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
			multiLabels : [ new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1241"), textAlign : "Center"}).addStyleClass("FontFamilyBold")],	// 1241:교통편
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
			}).addStyleClass("FontFamily")]
		}));
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
//					height : "30px",
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
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
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
								}
							},
						}).addStyleClass("FontFamily"),
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
						content : new sap.ui.commons.FormattedTextView({htmlText : oBundleText.getText("LABEL_1275")}).addStyleClass("FontFamilyBold"),	// 1275:여\n&nbsp;\n비\n&nbsp;\n내\n&nbsp;\n역
						rowSpan : 6,
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1258")	// 1258:항목
						}).addStyleClass("FontFamilyBold"),
						rowSpan : 2,
						hAlign : "Center"
					}).addStyleClass("MatrixLabel3"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1273")	// 1273:가불액
						}).addStyleClass("FontFamilyBold"),
						rowSpan : 2,
						hAlign : "Center"
					}).addStyleClass("MatrixLabel3"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1278")	// 1278:총 신청금액
						}).addStyleClass("FontFamilyBold"),
						rowSpan : 2,
						hAlign : "Center"
					}).addStyleClass("MatrixLabel3"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1274")	// 1274:법인카드 사용금액
						}).addStyleClass("FontFamilyBold"),
						colSpan : 2,
						hAlign : "Center"
					}).addStyleClass("MatrixLabel3"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1280")	// 1280:현금 사용금액
						}).addStyleClass("FontFamilyBold"),
						rowSpan : 2,
						hAlign : "Center"
					}).addStyleClass("MatrixLabel3"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1276")	// 1276:정산액
						}).addStyleClass("FontFamilyBold"),
						rowSpan : 2,
						hAlign : "Center"
					}).addStyleClass("MatrixLabel3"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1254")	// 1254:지급신청
						}).addStyleClass("FontFamilyBold"),
						hAlign : "Center"
					}).addStyleClass("MatrixLabel3"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1249")	// 1249:실사용
						}).addStyleClass("FontFamilyBold"),
						hAlign : "Center"
					}).addStyleClass("MatrixLabel3"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1240")	// 1240:교통비
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TrcstG}",
							textAlign : "End",
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TrcstT}",
							textAlign : "End",
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TrcstR}",
							textAlign : "End",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
								}
							},
							change : oController.onChangeMoney,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TrcstC}",
							textAlign : "End",
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TrcstH}",
							textAlign : "End",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
								}
							},
							change : oController.onChangeMoney,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TrcstA}",
							textAlign : "End",
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel2"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1251")	// 1251:일당
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{BscstG}",
							textAlign : "End",
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{BscstT}",
							textAlign : "End",
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{BscstR}",
							textAlign : "End",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
								}
							},
							change : oController.onChangeMoney,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{BscstC}",
							textAlign : "End",
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{BscstH}",
							textAlign : "End",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
								}
							},
							change : oController.onChangeMoney,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{BscstA}",
							textAlign : "End",
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel2"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1245")	// 1245:숙박비
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{HtcstG}",
							textAlign : "End",
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{HtcstT}",
							textAlign : "End",
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{HtcstR}",
							textAlign : "End",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
								}
							},
							change : oController.onChangeMoney,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{HtcstC}",
							textAlign : "End",
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{HtcstH}",
							textAlign : "End",
							editable : {
					    		parts : [ {path : "ZappStatAl"},{path : "Pernr"}, {path : "Docno2"}],
								formatter : function(fVal1, fVal2, fVal3){
									return ((fVal1 == "" || fVal1 == "10") && !common.Common.checkNull(fVal2) && !common.Common.checkNull(fVal3)) ? true : false;
								}
							},
							change : oController.onChangeMoney,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixData"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{HtcstA}",
							textAlign : "End",
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel2"),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Label({
							text : oBundleText.getText("LABEL_1277")	// 1277:정산액계
						}).addStyleClass("FontFamilyBold")
					}).addStyleClass("MatrixLabel"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TlcstG}",
							textAlign : "End",
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TlcstT}",
							textAlign : "End",
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TlcstR}",
							textAlign : "End",
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TlcstC}",
							textAlign : "End",
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TlcstH}",
							textAlign : "End",
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel2"),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Input({
							value : "{TlcstA}",
							textAlign : "End",
							editable : false,
							width : "100%"
						}).addStyleClass("FontFamily")
					}).addStyleClass("MatrixLabel2"),
				]
			}),
		];
		
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "30px",
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
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
		    		   }).addStyleClass("FontFamily"),
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"), 
				new sap.ui.commons.layout.MatrixLayout({
					columns : 8,
					widths : ['45px', ],
					rows : aRows
				}).setModel(oController._DetailJSonModel)
				.bindElement("/Data")
			]
		});
	},
});