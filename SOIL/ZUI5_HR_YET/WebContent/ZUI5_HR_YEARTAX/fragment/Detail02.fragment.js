sap.ui.jsfragment("ZUI5_HR_YEARTAX.fragment.Detail02", {
	/** 인적공제 **/
	createContent : function(oController) {
		
		// 1. 대상자
		var oMatrix1 = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			width : "100%",
			widths : ["20%", "30%", "20%", "30%"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "35px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "성명"}).addStyleClass("FontFamily")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixLabel"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input({ 
													width : "160px",
													value : "{Ename}",
													showValueHelp: true,
													valueHelpOnly: false,
													valueHelpRequest: oController.displayEmpSearchDialog,
													change : oController.EmpSearchByTx,
													customData : new sap.ui.core.CustomData({key : "Encid", value : "{Encid}"})
												}).addStyleClass("FontFamily")],
									  hAlign : "Begin",
									  vAlign : "Middle"
								 }).addStyleClass("MatrixData"),
								 
								 new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "소속부서 / 직책"}).addStyleClass("FontFamily")],
									  hAlign : "Begin",
									  vAlign : "Middle"
								 }).addStyleClass("MatrixLabel"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "{Zzorgtx} / {Zzjikcht}"}).addStyleClass("FontFamily")],
									  hAlign : "Begin",
									  vAlign : "Middle"
								 }).addStyleClass("MatrixData")]
					})]
		});
		
		var oPanel1 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								 content : [new sap.m.Text({text : "대상자"}).addStyleClass("Font15 FontBold")]
							 }).addStyleClass("ToolbarNoBottomLine")],
			content : [oMatrix1],
			visible : {
				path : "Auth",
				formatter : function(fVal){
					return fVal == "H" ? true : false;
				}
			}
		});
		
		// 2. 본인정보
		var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			width : "100%",
			widths : ["", "", "", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "35px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.CheckBox({
													 selected : "{Hshld}",
													 text : "세대주",
													 editable : {
														 parts : [{path : "Pystat"}, {path : "Yestat"}],
														 formatter : function(fVal1, fVal2){
															 return fVal1 == "1" && fVal2 == "1" ? true : false;
														 }
													 }
												})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.CheckBox({
													 selected : "{Womee}",
													 text : "부녀자",
													 editable : {
														 parts : [{path : "Pystat"}, {path : "Yestat"}],
														 formatter : function(fVal1, fVal2){
															 return fVal1 == "1" && fVal2 == "1" ? true : false;
														 }
													 }
												})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.CheckBox({
													 selected : "{Sigpr}",
													 text : "한부모",
													 editable : {
														 parts : [{path : "Pystat"}, {path : "Yestat"}],
														 formatter : function(fVal1, fVal2){
															 return fVal1 == "1" && fVal2 == "1" ? true : false;
														 }
													 }
												})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.CheckBox({
													 selected : "{Ageid}",
													 text : "경로자",
													 editable : false // 경로자 조회 전용
												})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "35px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									content : [new sap.m.CheckBox({
													selected : "{Pdcid}",
													text : "인적공제 항목변경",
													editable : {
														parts : [{path : "Pystat"}, {path : "Yestat"}],
														formatter : function(fVal1, fVal2){
															return fVal1 == "1" && fVal2 == "1" ? true : false;
														}
													},
													select : oController.onSelectPdcid
											   })],
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 2
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.CheckBox({
													 selected : "{Hndee}",
													 text : "장애인",
													 editable : {
														parts : [{path : "Pystat"}, {path : "Yestat"}],
														formatter : function(fVal1, fVal2){
															return fVal1 == "1" && fVal2 == "1" ? true : false;
														}
													 },
													 select : function(oEvent){
														 if(oEvent.getParameters().selected == false)
															 oController._DetailJSonModel.setProperty("/Data2/Hndcd", "0");
													 }
												}),
												new sap.m.Text({text : ""}).addStyleClass("PaddingLeft10"),
												new sap.m.Select(oController.PAGEID + "_Hndcd", {
													 selectedKey : "{Hndcd}",
													 width : "290px",
													 items : { 
															path : "ZHR_YEARTAX_SRV>/HndcdCode",
															template: new sap.ui.core.ListItem({
												                          key: "{ZHR_YEARTAX_SRV>Zcode}",
												                          text: "{ZHR_YEARTAX_SRV>Ztext}"
												                      }),
												            templateShareable : false
										             },
													 enabled : {
														 parts : [{path : "Pystat"}, {path : "Yestat"}, {path : "Hndee"}],
														 formatter : function(fVal1, fVal2, fVal3){
															 if(!fVal3 || fVal3 == false)
																 return false;
															 else if(fVal1 == "1" && fVal2 == "1")
																 return true;
															 else 
																 return true;
														 }
													 }
												})],
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 2
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({
													  text : "※ '인적공제 항목변경' 체크 후 가족정보 변경이 가능합니다." +
													  		 "\n\n※ 최종 제출 전 반드시 확인하십시오." +
													  		 "\n(1) 부양가족이 올바르게 체크 되었는지 확인" +
													  		 "\n- 기본공제 대상자에 해당하지 않는데 부양가족으로 체크되어 있는 경우 가족등록신청 메뉴에서 수정하시기 바랍니다." +
													  		 "\n* 기본공제 대상자 나이요건" +
													  		 "\n 직계존속: 1959년 12월 31일 이전 출생자(60세이상)" +
													  		 "\n 직계비속: 1999년 1월 1일 이후 출생자(20세이하)" +
													  		 "\n 추가공제(경로우대공제): 1949.12.31 이전 출생자(70세이상)" + 
													  		 "\n\n(2) 부양가족 중복공제 여부 확인" +
													  		 "\n- 독립적인 생계능력이 없는 부모님에 대해 가족 구성원이 중복하여 공제받지 않았는지 확인하십시오." +
													  		 "\n- 맞벌이 부부인 경우 자녀에 대한 보험료, 의료비, 교육비, 기부금, 신용카드 등의 사용액을 부부가 중복으로 공제받지 않았는지 반드시 확인하십시오."
												 }).addStyleClass("FontFamily PaddingLeft10 PaddingRight10")],
									  hAlign : "Begin",
									  vAlign : "Middle",
									  colSpan : 4
								 }).addStyleClass("MatrixData PaddingTop7 PaddingBottom7")]
					})]
		});
		
		var oPanel2 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								 content : [new sap.m.Text({text : "본인정보"}).addStyleClass("Font15 FontBold")]
							 }).addStyleClass("ToolbarNoBottomLine")],
			content : [oMatrix2]
		});
		
		// 3. 가족정보		
		var oTable3 = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: "None",
			showOverlay : false,
			enableBusyIndicator : true,
			visibleRowCount : 1,
			enableGrouping : false,
			enableColumnFreeze : false
		}).addStyleClass("FontFamily");
		
		oTable3.setModel(new sap.ui.model.json.JSONModel());
		oTable3.bindRows("/Data");
		
		var col_info = [{id: "Stext", label : "관계", plabel : "", span : 0, type : "string", sort : false, filter : false, resizable : "X"},
						{id: "Emnam", label : "성명", plabel : "", span : 0, type : "string", sort : false, filter : false},
						{id: "Regnr", label : "주민번호", plabel : "", span : 0, type : "string", sort : false, filter : false},
						{id: "Dptid", label : "부양가족", plabel : "", span : 0, type : "YetCheckbox1", sort : false, filter : false},
						{id: "Ageid", label : "경로자", plabel : "", span : 0, type : "YetCheckbox2", sort : false, filter : false},
						{id: "Fstid", label : "위탁아동", plabel : "", span : 0, type : "YetCheckbox1", sort : false, filter : false},
						{id: "Hndid", label : "장애인", plabel : "", span : 0, type : "YetCheckbox1", sort : false, filter : false}];
		
		common.makeTable.makeColumn(oController, oTable3, col_info);
		
		var oPanel3 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								 content : [new sap.m.Text({text : "가족정보"}).addStyleClass("Font15 FontBold"),
									 	  	new sap.m.ToolbarSpacer(),
									 	  	new sap.m.Button({
									 	  		text : "가족정보 저장",
									 	  		icon : "sap-icon://edit",
									 	  		type : sap.m.ButtonType.Emphasized,
									 	  		press : oController.onSaveFamily,
									 	  		visible : {
									 	  			parts : [{path : "Pystat"}, {path : "Yestat"}, {path : "Pdcid"}],
									 	  			formatter : function(fVal1, fVal2, fVal3){
									 	  				if(!fVal3 || fVal3 == false)
									 	  					return false;
									 	  				else if(fVal1 == "1" && fVal2 == "1")
									 	  					return true;
									 	  				else
									 	  					return false;
									 	  			}
									 	  		}
									 	  	}),
									 	  	new sap.m.ToolbarSpacer({width : "5px"})]
							 }).addStyleClass("ToolbarNoBottomLine")],
			content : [oTable3]
		});
		
		///////////////////////////////////////////////////////////////////////
		var oLayout = new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Detail02", {
			content : [oPanel1, oPanel2, oPanel3]
		});
		
		oLayout.setModel(oController._DetailJSonModel);
		oLayout.bindElement("/Data2");
		
		var oContent = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["2rem", "", "2rem"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [oLayout]
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					})]
		});
		
		return oContent;
	}

});
