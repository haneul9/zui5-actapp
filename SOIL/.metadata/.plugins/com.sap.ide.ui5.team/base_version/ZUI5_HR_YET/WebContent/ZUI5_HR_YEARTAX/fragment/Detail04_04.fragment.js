sap.ui.jsfragment("ZUI5_HR_YEARTAX.fragment.Detail04_04", {
	/** 세액감면 및 세액공제 - 신용카드 등 **/
	createContent : function(oController) {
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 5,
			width : "100%",
			widths : ["", "", "", "150px", "40%"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "35px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "항목"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixLabel PaddingLeft0"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "구분"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixLabel PaddingLeft0"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "내역입력"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixLabel PaddingLeft0"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "금액"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixLabel PaddingLeft0"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "항목별 요약설명 및 공제조건"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixLabel PaddingLeft0")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "35px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "신용카드 등 사용금액"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle",
									 rowSpan : 7
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "㉮ 신용카드"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Button({
													 text : {
														 parts : [{path : "Pystat"}, {path : "Yestat"}],
														 formatter : function(fVal1, fVal2){
															 if(fVal1 == "1" && fVal2 == "1") 
																 return "입력";
															 else 
																 return "조회";
														 }
													 },
													 type : "Default",
													 press : function(oEvent){
														 oController.onPressOpenSubty(oEvent, "P088103");
													 }
												 })],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input(oController.PAGEID + "_Crdcd", {
													 editable : false,
													 value : "{Crdcd}",
													 textAlign : "End"
												}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({
													text : "• 신용카드를 사용하여 그 대가를 지급하는 금액"
												}).addStyleClass("FontFamily")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixData")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "㉯ 현금영수증\n(전통시장/대중교통 제외)", textAlign : "Center"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixData PaddingTop5 PaddingBottom5"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Button({
													text : {
														parts : [{path : "Pystat"}, {path : "Yestat"}],
														formatter : function(fVal1, fVal2){
															if(fVal1 == "1" && fVal2 == "1")
																return "입력";
															else
																return "조회";
														}
													},
													type : "Default",
													press : function(oEvent){
														 oController.onPressOpenSubty(oEvent, "P088104");
													}
												})],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input(oController.PAGEID + "_Cashe", {
													 editable : false,
													 value : "{Cashe}",
													 textAlign : "End"
												}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "• 현금영수증(현금거래사실을 확인받는 것을 포함)"}).addStyleClass("FontFamily")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixData")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "㉰ 직불카드 등\n(전통시장/대중교통 제외)", textAlign : "Center"}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Button({
													 text : {
														 parts : [{path : "Pystat"}, {path : "Yestat"}],
														 formatter : function(fVal1, fVal2){
															 if(fVal1 == "1" && fVal2 == "1")
																 return "입력";
															 else
																 return "조회";
														 }
													 },
													 type : "Default",
													 press : function(oEvent){
														 oController.onPressOpenSubty(oEvent, "P088106");
													 }
												})],
									  hAlign : "Center",
									  vAlign : "Middle"
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Input(oController.PAGEID + "_Dbtcd", {
													editable : false,
													value : "{Dbtcd}",
													textAlign : "End"
												}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({
													text : "• 직불카드, 실지명의가 확인되는 기명식선불카드, 기명식선불전자지급수단, 기명식 전자화폐를 사용하여 대가로 지급한 금액"
												}).addStyleClass("FontFamily")],
									  hAlign : "Begin",
									  vAlign : "Middle"
								 }).addStyleClass("MatrixData PaddingTop5 PaddingBottom5")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  height : "35px",
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "㉱ 전통시장 사용분"}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								   }).addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input(oController.PAGEID + "_Trdmk", {
													   value : "{Trdmk}",
													   editable : false,
													   textAlign : "End"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "• 전통시장에서 사용한 신용카드, 직불ㆍ선불카드, 현금영수증 사용금액"}).addStyleClass("FontFamily")],
									   hAlign : "Begin",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  height : "35px",
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "㉲ 대중교통 이용분"}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								   }).addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input(oController.PAGEID + "_Pubtr", {
													   value : "{Pubtr}",
													   editable : false,
													   textAlign : "End"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "• 대중교통을 신용카드, 직불ㆍ선불카드, 현금영수증으로 사용한 금액"}).addStyleClass("FontFamily")],
									   hAlign : "Begin",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  height : "35px",
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "㉳ 도서공연 사용금액"}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								   }).addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input(oController.PAGEID + "_Bkspf", {
													   value : "{Bkspf}",
													   editable : false,
													   textAlign : "End"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "• 도서,공연비 신용카드, 직불ㆍ선불카드, 현금영수증으로 사용한 금액"}).addStyleClass("FontFamily")],
									   hAlign : "Begin",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  height : "35px",
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "㉴ 제로페이"}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								   }).addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
										  content : [new sap.m.Button({
														 text : {
															 parts : [{path : "Pystat"}, {path : "Yestat"}],
															 formatter : function(fVal1, fVal2){
																 if(fVal1 == "1" && fVal2 == "1")
																	 return "입력";
																 else
																	 return "조회";
															 }
														 },
														 type : "Default",
														 press : function(oEvent){
															 oController.onPressOpenSubty(oEvent, "P088107");
														 }
													})],
										  hAlign : "Center",
										  vAlign : "Middle"
								   }).addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input({
													   value : "{Eropy}",
													   editable : false,
													   textAlign : "End"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "• 제로페이로 사용한 금액"}).addStyleClass("FontFamily")],
									   hAlign : "Begin",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData")
								   ]
					})]
		});
		
		return oMatrix;
	}

});
