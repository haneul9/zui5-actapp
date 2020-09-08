sap.ui.jsfragment("ZUI5_HR_Overtime.fragment.OvertimePage02", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.ZHR_TABLES");
		
		var oRow, oCell;
		
		var oNoticePanel = new sap.m.Panel(oController.PAGEID + "_NoticePanel", {
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				height : "40px",
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.ToolbarSpacer({width: "10px"}),
					       new sap.m.Text({text : oBundleText.getText("LABEL_1335")}).addStyleClass("L2PFontFamilyBold"),	// 1335:신청안내
				           
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : new sap.m.Image({
				src :  "{Image}" ,
//				width : "100%",
			}).setModel(oController._vInfoImage).bindElement("/Data")
		});
		
		// 신청내역
		var oApplyInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1559"), required : true}).addStyleClass("L2PFontFamily")	// 1559:근무일자
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [new sap.m.DatePicker({
							valueFormat : "yyyy-MM-dd",
				            displayFormat : "yyyy.MM.dd",
				            value : "{Datum}",
							width : "150px",
							editable : {
								path : "ZappStatAl",
								formatter : function(fVal){
									if(fVal == "" || fVal == "10") return true;
									else return false;
								}
							},
							change : oController.onChangeDate
						}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : oBundleText.getText("LABEL_1990")}).addStyleClass("L2PFontFamily")	// 1990:요일 / 휴일
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
							content : [new sap.m.Text({
											text : {
												parts : [{path : "Day"}, {path : "Holiday"}],
												formatter : function(fVal1, fVal2){
													if(fVal1 && fVal2) return fVal1 + " / " + fVal2;
												}
											}
										}).addStyleClass("L2PFontFamily")]
						}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0039"), required : true}).addStyleClass("L2PFontFamily")	// 39:소속부서
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.ComboBox(oController.PAGEID + "_Orgeh", {
							width : "95%",
							selectedKey : "{Orgeh}",
						    editable : {
						    	parts : [{path : "ZappStatAl"}, {path : "Auth"}],
						    	formatter : function(fVal1, fVal2){
						    		if(fVal1 == "" && fVal2 != "E") return true;
						    		else return false;
						    	}
						    },
						    change : oController.onSetAppl
					 })
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : oBundleText.getText("LABEL_0003")}).addStyleClass("L2PFontFamily")	// 결재선
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({text : "{Aprnm}"}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oApplyInfoMatrix.addRow(oRow);
		
		
		var oApplyInfoPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [  new sap.m.Toolbar({
							design : sap.m.ToolbarDesign.Auto,
							height : "40px",
							content : [new sap.ui.core.Icon({
											src: "sap-icon://open-command-field", 
											size : "1.0rem"
										}),
									   new sap.m.ToolbarSpacer({width: "5px"}),
								       new sap.m.Text({text : oBundleText.getText("LABEL_0047")}).addStyleClass("L2PFontFamilyBold"),	// 47:신청내역
								       new sap.m.ToolbarSpacer(),
								        new sap.m.CheckBox(oController.PAGEID + "_Prvline",{
								        	selected : "{Prvline}",
								        	editable : {
												path : "ZappStatAl",
												formatter : function(fVal){
													if(fVal == "" || fVal == "10") return true;
													else return false;
												}
											},
											select : oController.onSetAppl
								        }),
								        new sap.m.Text({text : oBundleText.getText("LABEL_1454")}).addStyleClass("L2PFontFamily")	// 1454:개인 결재선 적용
						]}).addStyleClass("L2PToolbarNoBottomLine"),
			oApplyInfoMatrix]
		});
		
		
		
//-------------------------------------------------------------------------------------------------------------------
		// 대상자
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 45,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
		});
		oTable.setModel(oController._DetailTableJSonModel);
		oTable.bindRows("/Data");	
		
		var col_info1 = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "2%"},
			 {id: "Orgtx", label : oBundleText.getText("LABEL_0479"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "9%"},	// 479:소속
			 {id: "Zzjiktltx", label : oBundleText.getText("LABEL_0770"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "5%"},	// 770:직급
			 {id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "4%"},	// 31:사번
			 {id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "5%"},	// 38:성명
			 {id: "Rtext", label : oBundleText.getText("LABEL_1526"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 1526:교대조
			 {id: "Ttext", label : oBundleText.getText("LABEL_1546"), plabel : oBundleText.getText("LABEL_2333"), span : 0, type : "string", sort : true, filter : true, width : "5%"},	// 1546:근무, 2333:형태
			 {id: "Atext", label : oBundleText.getText("LABEL_1557"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "7%"}];	// 1557:근무유형
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);

		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
			resizable : false,
        	vAlign : "Middle",
        	autoResizable : true,
        	filterProperty : "Tmrsn",
        	sortProperty : "Tmrsn",
        	resizable : true,
			showFilterMenuEntry : true,
			multiLabels : new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1552"), textAlign : "Center"}).addStyleClass("L2PFontFamily"),	// 1552:근무사유
			template : [new sap.m.Input({
				            value : "{Tmrsn}",
				            maxLength : common.Common.getODataPropertyLength("ZHR_OVERTIME_SRV", "OvertimeApplEmpList", "Tmrsn"),
							editable : {
								path : "ZappStatAl",
								formatter : function(fVal){
									if(fVal == "" || fVal == "10") return true;
									else return false;
								}
							}
					   }).addStyleClass("L2PFontFamily")]
		});
		oTable.addColumn(oColumn);
		
		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
			resizable : false,
        	vAlign : "Middle",
        	autoResizable : true,
        	filterProperty : "Beguz",
        	sortProperty : "Beguz",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "5%",
			multiLabels : new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0631"), textAlign : "Center"}).addStyleClass("L2PFontFamily"),	// 631:시작시간
			template : [new sap.m.TimePicker({
							valueFormat : "HHmm",
							displayFormat : "HH:mm",
				            value : "{Beguz}",
				            change : oController.setOttm,
							editable : {
								path : "ZappStatAl",
								formatter : function(fVal){
									if(fVal == "" || fVal == "10") return true;
									else return false;
								}
							},
				            textAlign : sap.ui.core.TextAlign.Begin
					   }).addStyleClass("L2PFontFamily")]
		});
		oTable.addColumn(oColumn);
		
		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
			resizable : false,
        	vAlign : "Middle",
        	autoResizable : true,
        	filterProperty : "Enduz",
        	sortProperty : "Enduz",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "5%",
			multiLabels : new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0635"), textAlign : "Center"}).addStyleClass("L2PFontFamily"),	// 635:종료시간
			template : [new sap.m.TimePicker({
							valueFormat : "HHmm",
							displayFormat : "HH:mm",
				            value : "{Enduz}",
				            change : oController.setOttm,
							editable : {
								path : "ZappStatAl",
								formatter : function(fVal){
									if(fVal == "" || fVal == "10") return true;
									else return false;
								}
							},
				            textAlign : sap.ui.core.TextAlign.Begin
					   }).addStyleClass("L2PFontFamily")]
		});
		oTable.addColumn(oColumn);

//		var oColumn = new sap.ui.table.Column({
//			hAlign : "Center",
//			flexible : false,
//			resizable : false,
//        	vAlign : "Middle",
//        	autoResizable : true,
//        	filterProperty : "Begda",
//        	sortProperty : "Begda",
//        	resizable : true,
//			showFilterMenuEntry : true,
//			width : "130px",
//			multiLabels : new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1911"), textAlign : "Center"}).addStyleClass("L2PFontFamily"),
//			template : [new sap.m.DatePicker({
//							valueFormat : "yyyy.MM.dd",
//				            displayFormat : "yyyy.MM.dd",
//				            value : "{Begda}",
//							editable : {
//								path : "ZappStatAl",
//								formatter : function(fVal){
//									if(fVal == "" || fVal == "10") return true;
//									else return false;
//								}
//							}
//					   }).addStyleClass("L2PFontFamily")]
//		});
//		oTable.addColumn(oColumn);
		
		var col_info1 = [{id: "Abrst", label : oBundleText.getText("LABEL_1546"), plabel : oBundleText.getText("LABEL_1879"), span : 0, type : "string", sort : true, filter : true, width : "4%"}];	// 1546:근무, 1879:시간
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
		
		
		
		
		
		
//>>20180712 기능직 주 12 시간 관련 화면 수정
//		var oColumn = new sap.ui.table.Column({
//			hAlign : "Center",
//			flexible : false,
//			resizable : false,
//        	vAlign : "Middle",
//        	autoResizable : true,
//        	filterProperty : "Ottm1",
//        	sortProperty : "Ottm1",
//        	resizable : true,
//			showFilterMenuEntry : true,
//			headerSpan : [3,1],
//			width : "4%",
//			multiLabels : [new sap.ui.commons.TextView({text : "OT시간", textAlign : "Center"}).addStyleClass("L2PFontFamily"),
//						   new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1659"), textAlign : "Center"}).addStyleClass("L2PFontFamily")],	// 1659:당일
//			template : [new sap.ui.commons.TextView({
//							text : {
//								parts : [{path : "Ottm1"}, {path : "Ovryn"}],
//								formatter : function(fVal1, fVal2){
//									this.removeStyleClass("L2PFontFamily");
//									this.removeStyleClass("L2P15FontRedBold");
//									
//									if(fVal1 && fVal2 == "X"){
//										this.addStyleClass("L2P15FontRedBold");
//										return fVal1;
//									} else {
//										this.addStyleClass("L2PFontFamily");
//										return fVal1;
//									}
//									
//								}
//							}, 
//						    textAlign : "Center"}
//						)]
//		});
//		oTable.addColumn(oColumn);
//		
//		var col_info2 = [{id: "Ottm2", label : "OT시간", plabel : oBundleText.getText("LABEL_1583"), span : 0, type : "string", sort : true, filter : true, width : "4%"},
//						 {id: "Ottm3", label : "OT시간", plabel : oBundleText.getText("LABEL_1651"), span : 0, type : "string", sort : true, filter : true, width : "4%"}];
////						 {id: "Ottm4", label : "OT시간(주휴,공휴 제외)", plabel : "전주실적", span : 0, type : "string", sort : true, filter : true, width : "5%"},
////						 {id: "Ottm5", label : "OT시간(주휴,공휴 제외)", plabel : "전월실적", span : 0, type : "string", sort : true, filter : true, width : "5%"}];
//		common.ZHR_TABLES.makeColumn(oController, oTable, col_info2);
		
		
		
		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
			resizable : false,
        	vAlign : "Top",
        	autoResizable : true,
        	filterProperty : "Tim01",
        	sortProperty : "Tim01",
        	resizable : true,
			showFilterMenuEntry : true,
			headerSpan : [3,1],
			width : "4%",
			multiLabels : [new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1952"), textAlign : "Center"}).addStyleClass("L2PFontFamily"),	// 1952:연장근무(월~일)
						   new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1916"), textAlign : "Center"}).addStyleClass("L2PFontFamily")],	// 1916:실적(A)
			template : [new sap.ui.commons.TextView({
							text : {
								parts : [{path : "Tim01"}, {path : "Ovryn"}],
								formatter : function(fVal1, fVal2){
//									this.removeStyleClass("L2PFontFamily");
//									this.removeStyleClass("L2P15FontRedBold");
//									
//									if(fVal1 && fVal2 == "X"){
//										this.addStyleClass("L2P15FontRedBold");
//										return fVal1;
//									} else {
										this.addStyleClass("L2PFontFamily");
										return fVal1;
//									}
//									
								}
							}, 
						    textAlign : "Center"}
						),
			]
		});
		oTable.addColumn(oColumn);
		
		var col_info2 = [{id: "Tim02", label : oBundleText.getText("LABEL_1905"), plabel : oBundleText.getText("LABEL_1905"), span : 0, type : "string", sort : true, filter : true, width : "5%"},	// 1905:신청중(B)
						 {id: "Tim03", label : oBundleText.getText("LABEL_1437"), plabel : oBundleText.getText("LABEL_1437") + "(12-A-B)", span : 0, type : "string", sort : true, filter : true, width : "5%",	// 1437:가능시간
							
			template : [new sap.ui.commons.TextView({
				text : {
					parts : [{path : "Tim03"}, {path : "Ovryn"}],
					formatter : function(fVal1, fVal2){
//						this.removeStyleClass("L2PFontFamily");
//						this.removeStyleClass("L2P15FontRedBold");
//						
//						if(fVal1 && fVal2 == "X"){
//							this.addStyleClass("L2P15FontRedBold");
//							return fVal1;
//						} else {
						this.addStyleClass("L2P15FontRedBold");
						return fVal1;
//						}
//						
					}
				}, 
			    textAlign : "Center"}
			),
]	 
						 }];
						 
//						 {id: "Ottm4", label : "OT시간(주휴,공휴 제외)", plabel : "전주실적", span : 0, type : "string", sort : true, filter : true, width : "5%"},
//						 {id: "Ottm5", label : "OT시간(주휴,공휴 제외)", plabel : "전월실적", span : 0, type : "string", sort : true, filter : true, width : "5%"}];
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info2);	
		
		
		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
			resizable : false,
        	vAlign : "Top",
        	autoResizable : true,
        	filterProperty : "Tim04",
        	sortProperty : "Tim04",
        	resizable : true,
			showFilterMenuEntry : true,
			headerSpan : [2,1],
			width : "4.2%",
			multiLabels : [new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1794"), textAlign : "Center"}).addStyleClass("L2PFontFamily"),	// 1794:비근무
						   new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1437"), textAlign : "Center"}).addStyleClass("L2PFontFamily")],	// 1437:가능시간
			template : [new sap.ui.commons.TextView({
							text : {
								parts : [{path : "Tim04"}, {path : "Ovryn"}],
								formatter : function(fVal1, fVal2){

										this.addStyleClass("L2PFontFamily");
										return fVal1;
									
								}
							}, 
						    textAlign : "Center"}
						)]
		});
		oTable.addColumn(oColumn);
		var col_info1 = [{id: "Tim05", label : oBundleText.getText("LABEL_1915"), plabel : oBundleText.getText("LABEL_1915"), span : 0, type : "string", sort : true, filter : true, width : "4%"}];	// 1915:실적
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
		
		
//<<20180712 기능직 연장근무 12시간 수정 끝		
		
		
		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
			resizable : false,
        	vAlign : "Middle",
        	filtered : false,
        	sorted : false,
        	autoResizable : true,
        	filterProperty : "",
        	sortProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "7%",
			multiLabels : new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1675"), textAlign : "Center"}).addStyleClass("L2PFontFamily"),	// 1675:대근휴가자
			template : [new sap.m.Input({
							width : "100%",
			        	    showValueHelp: true,
			        	    valueHelpOnly: true,
			        	    value : {
			        	    	parts : [{path : "Ofpnr"}, {path : "Ofpnm"}],
			        	    	formatter : function(fVal1, fVal2){
			        	    		if(fVal1 && fVal2) return fVal2;			        	    		
			        	    	}
			        	    },
						    valueHelpRequest: oController.onPressEmplist,
						    editable : {
								path : "ZappStatAl",
								formatter : function(fVal){
									if(fVal == "" || fVal == "10") return true;
									else return false;
								}
							},
							customData : [new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"})]
					   }).addStyleClass("L2PFontFamily")]
		});
		oTable.addColumn(oColumn);
		
		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
			resizable : false,
        	vAlign : "Middle",
        	filtered : false,
        	sorted : false,
        	autoResizable : true,
        	filterProperty : "Agryn",
        	sortProperty : "Agryn",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "3%",
			multiLabels : [new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1710"), textAlign : "Center"}).addStyleClass("L2PFontFamily"),	// 1710:동의
						   new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1932"), textAlign : "Center"}).addStyleClass("L2PFontFamily")],	// 1932:여부
			template : [new sap.m.CheckBox({
							selected  : "{Agryn}",
							editable : {
								parts : [{path : "ZappStatAl"}, {path : "AgrynAct"}],
								formatter : function(fVal1, fVal2){
									if((fVal1 == "" || fVal1 == "10") && fVal2 == "X") return true;
									else return false;
								}
							}
						}).addStyleClass("L2PFontFamily")]
		});
		oTable.addColumn(oColumn);
		
		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
			resizable : false,
        	vAlign : "Middle",
        	filtered : false,
        	sorted : false,
        	autoResizable : true,
        	filterProperty : "Calyn",
        	sortProperty : "Calyn",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "3%",
			multiLabels : [new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_2335"), textAlign : "Center"}).addStyleClass("L2PFontFamily"),	// 2335:호출
						   new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_1932"), textAlign : "Center"}).addStyleClass("L2PFontFamily")],	// 1932:여부
			template : [new sap.m.CheckBox({
							selected  : "{Calyn}",
							editable : {
								path : "ZappStatAl",
								formatter : function(fVal){
									if(fVal == "" || fVal == "10") return true;
									else return false;
								}
							},
							select : oController.setOttm
						}).addStyleClass("L2PFontFamily")]
		});
		oTable.addColumn(oColumn);

					
		var oDetailPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content :  [new sap.m.Toolbar({
						height : "40px",
						content : [new sap.ui.core.Icon({
										src: "sap-icon://open-command-field", 
										size : "1.0rem"
									}),
								   new sap.m.ToolbarSpacer({width: "5px"}),
								   new sap.m.Text({text : oBundleText.getText("LABEL_0111")}).addStyleClass("L2PFontFamilyBold"),	// 111:대상자
								   new sap.m.ToolbarSpacer({width : "5px"}),
								   new sap.m.MessageStrip({
								  	      text : oBundleText.getText("LABEL_2541"),	// 2541:여직원에 한하여 연장근무 본인 동의여부를 확인한 다음 동의여부 필드에 반드시 체크 입력하여 주시기 바랍니다. (남직원은 자동 동의처리됨)
									      type : "Error",
									      showIcon : true,
									      customIcon : "sap-icon://notification", 
									      showCloseButton : false,
								   }),
					    		   new sap.m.ToolbarSpacer(),
					    		   new sap.m.Button({
					    			   text : oBundleText.getText("LABEL_0023"),	// 23:등록
					    			   type : "Default",
					    			   press : oController.onPressNewRecord,
					    			   icon : "sap-icon://create",
					    			   visible : {
											  path : "ZappStatAl",
											  formatter : function(fVal){
												  if(fVal == "" || fVal == "10") return true;
												  else return false;
											  }
										  }
					    		   }).addStyleClass("L2PFontFamily"),
					    		   new sap.m.Button({
					    			   text : oBundleText.getText("LABEL_0033"),	// 33:삭제
					    			   type : "Default",
					    			   icon : "sap-icon://delete",
					    			   press : oController.onPressDelRecord,
					    			   visible : {
											  path : "ZappStatAl",
											  formatter : function(fVal){
												  if(fVal == "" || fVal == "10") return true;
												  else return false;
											  }
									  }
					    		   }).addStyleClass("L2PFontFamily"),
				    		   
			    		   		]
							}).addStyleClass("L2PToolbarNoBottomLine"),
						oTable]
		});
		
		
		// 신청자
		var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : oBundleText.getText("LABEL_0038")}).addStyleClass("L2PFontFamily"),	// 38:성명
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
			content : new sap.m.Text({text : oBundleText.getText("LABEL_1005")}).addStyleClass("L2PFontFamily"),	// 1005:사업장 / 소속부서
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
		oMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : oBundleText.getText("LABEL_1006")}).addStyleClass("L2PFontFamily"),	// 1006:직군 / 직급
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
								text : {
									parts : [{path : "Apzzjikgbtx"}, {path : "Apzzjiktltx"}],
									formatter : function(fVal1, fVal2){
										if(fVal1 || fVal2) return fVal1 + " / " + fVal2;
									}
								}
							}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : oBundleText.getText("LABEL_0553")}).addStyleClass("L2PFontFamily"),	// 553:신청일시
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
								       new sap.m.Text({text : oBundleText.getText("LABEL_0050")}).addStyleClass("L2PFontFamilyBold"),	// 50:신청자
								       new sap.m.ToolbarSpacer()
						]}).addStyleClass("L2PToolbarNoBottomLine"),
						oMatrix2]
		});
		
		// 결재내역
		var oMatrix3 = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : oBundleText.getText("LABEL_1474")}).addStyleClass("L2PFontFamily")	// 1474:결재문서번호
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
							content : [new sap.m.Link({text : "{Docno}", 
											press : function(oEvent){
												var vUrl = oController._DetailJSonModel.getProperty("/Data/ZappUrl");
												if(vUrl) window.open(vUrl);
										}}).addStyleClass("L2PFontFamily")]
					  }).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : oBundleText.getText("LABEL_1069")}).addStyleClass("L2PFontFamily")	// 1069:결재상태
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
			content : new sap.m.Text({text : oBundleText.getText("LABEL_1476")}).addStyleClass("L2PFontFamily")	// 1476:결재일시
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
							content : [new sap.m.Text({text : "{Sgndt}"}).addStyleClass("L2PFontFamily")]
					  }).addStyleClass("L2PToolbarNoBottomLine"),
			colSpan : 3
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
								       new sap.m.Text({text : oBundleText.getText("LABEL_1472")}).addStyleClass("L2PFontFamilyBold"),	// 1472:결재내역
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
									new sap.m.Text({text : oBundleText.getText("LABEL_1075") }).addStyleClass("L2PFontFamilyBold")]	// 1075:반려사유
					    	}).addStyleClass("L2PToolbarNoBottomLine") ,
						new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
						new sap.m.TextArea({
								value : "{ZappResn}",
								rows : 4,
								width : "100%",
								enabled : false
							}).addStyleClass("L2PFontFamily"),
						],
			visible : { path : "ZappStatAl" ,
				        formatter : function(fVal){
				    	   if(fVal && ( fVal == "35" || fVal == "55" || fVal == "90" ) ){
				    		   return true;
				    	   }else return false;
				       }}
		});
		
		
		/////////////////////////////////////////////////////////////		
		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : ["20px","","20px"],
			width : "100%"
		});
		
		var oContents = [new sap.ui.core.HTML({content : "<div style='height : 15px;'/>"}), oNoticePanel, oApplyInfoPanel, oDetailPanel, oAppPanel, oDocPanel, oRejPanel];
		
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