sap.ui.jsfragment("ZUI5_HR_YEARTAX.fragment.Detail04_05", {
	/** 특별공제 - 장기주택 저당차입금 이자상환액 **/
	createContent : function(oController) {
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 6,
			width : "100%",
			widths : ["", "", "", "", "150px", "40%"],
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
									 vAlign : "Middle",
									 colSpan : 2
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
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "장기주택 저당차입금\n이자상환액", textAlign : "Center"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle",
									 rowSpan : 9
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "2011년 이전 차입분"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle",
									 rowSpan : 3
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "15년 미만\n(600만원 한도)", textAlign : "Center"}).addStyleClass("FontFamily")],
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
														 oController.onPressOpenSubty(oEvent, "P0881E8");
													 }
												 })],
									 hAlign : "Center",
									 vAlign : "Middle",
									 rowSpan : 9
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input(oController.PAGEID + "_Fprdo", {
													 editable : false,
													 value : "{Fprdo}",
													 textAlign : "End"
												}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({
													text : "• ’03.12.31 이전 차입분으로 상환기간 10년 이상 15년 미만인 경우에 이자상환액을 입력하며 이 경우 공제한도는 연 600만원을 적용함"
												}).addStyleClass("FontFamily")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixData")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "15년-29년\n(1,000만원 한도)", textAlign : "Center"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixData"),
								  new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Input(oController.PAGEID + "_Inttl", {
													 editable : false,
													 value : "{Inttl}",
													 textAlign : "End"
												}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "• ’12.1.1 이전 차입분으로 다음에 해당하는 경우 공제한도는 연 1,000만원을 적용함"}).addStyleClass("FontFamily"),
										 		new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
										 		new sap.m.Text({text : "- 상환기간 15년 이상 30년 미만인 경우\n(’12년 이후 다른 금융기관 등으로 차입금 이전하는 경우 포함)"}).addStyleClass("FontFamily PaddingLeft5")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("MatrixData PaddingTop5 PaddingBottom5")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "30년이상\n(1,500만원한도)", textAlign : "Center"}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Input(oController.PAGEID + "_Insln", {
													editable : false,
													value : "{Insln}",
													textAlign : "End"
												}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "• 다음에 해당하는 경우 공제한도는 연 1,500만원을 적용함"}).addStyleClass("FontFamily"),
										  		 new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
										  		 new sap.m.Text({text : "- ’12.1.1 이전 차입분으로 상환기간 30년 이상인 경우\n(’12년 이후 다른 금융기관 등으로 차입금 이전하는 경우 포함)"}).addStyleClass("FontFamily PaddingLeft5")],
									  hAlign : "Begin",
									  vAlign : "Middle"
								 }).addStyleClass("MatrixData PaddingTop5 PaddingBottom5")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "2012년 이후 차입분"}).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle",
									   rowSpan : 2
								   }).addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "고정금리ㆍ비거치상환대출\n(1,500만원한도)", textAlign : "Center"}).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input(oController.PAGEID + "_Intfn", {
													   value : "{Intfn}",
													   editable : false,
													   textAlign : "End"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({
													   text : "• ’12.1.1 이후 신규 차입분(차입금 상환 기간 연장 포함)으로서 상환기간이 15년 이상이고, " +
												   			  "차입금의 70% 이상의 금액에 대한 이자를 고정금리 방식으로 지급하는 경우와 원리금의 70% 이상을 비거치식으로 분할상환하는 경우"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Begin",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData PaddingTop5 PaddingBottom5")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "기타대출\n(500만원 한도)", textAlign : "Center"}).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input(oController.PAGEID + "_Intot", {
													   value : "{Intot}",
													   editable : false,
													   textAlign : "End"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({
													   text : "• ’12.1.1 이후 신규 차입분(차입금 상환기간 연장 포함)으로서 상환기간이 15년 이상인 차입금(고정금리 및 비거치식 대출 제외)의 이자상환액을 입력하며, 이 경우 공제한도는 연 500만원을 적용함"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Begin",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData PaddingTop5 PaddingBottom5")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "2015년 이후"}).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle",
									   rowSpan : 4
								   }).addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "고정금리 & 비거치\n(1800만원 한도)", textAlign : "Center"}).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData PaddingTop5 PaddingBottom5"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input(oController.PAGEID + "_Infn1", {
													   value : "{Infn1}",
													   editable : false,
													   textAlign : "End"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({
													   text : "• '15년 이상 고정금리 또는 비거치식 분할상환** : 1,500만원 * 5년 이상 단위로 금리를 변경하는 경우** 매년 차입금의 70%를 상환기간 연수로 나눈 금액 이상 상환"
												  }).addStyleClass("FontFamily"),
												  new sap.ui.core.HTML({content : "<div style='height:3px' />"}),
												  new sap.m.Text({text : "• '15년 이상인 차입금 : 500만원"}).addStyleClass("FontFamily")],
									   hAlign : "Begin",
									   vAlign : "Top",
									   rowSpan : 4
								   }).addStyleClass("MatrixData PaddingTop5 PaddingBottom5")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "고정금리 / 비거치\n(1500만원 한도)", textAlign : "Center"}).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData PaddingTop5 PaddingBottom5"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input(oController.PAGEID + "_Infn2", {
													   value : "{Infn2}",
													   editable : false,
													   textAlign : "End"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  height : "35px",
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "기타대출"}).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input(oController.PAGEID + "_Infn4", {
													   value : "{Infn4}",
													   editable : false,
													   textAlign : "End"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Text({text : "고정금리 + 비거치\n(300만원 한도)", textAlign : "Center"}).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData PaddingTop5 PaddingBottom5"),
								   new sap.ui.commons.layout.MatrixLayoutCell({
									   content : [new sap.m.Input(oController.PAGEID + "_Infn3", {
													   value : "{Infn3}",
													   editable : false,
													   textAlign : "End"
												  }).addStyleClass("FontFamily")],
									   hAlign : "Center",
									   vAlign : "Middle"
								   }).addStyleClass("MatrixData")]
					})]
		});
		
		return oMatrix;
	}

});
