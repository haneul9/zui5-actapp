sap.ui.jsfragment("ZUI5_HR_YEARTAX.fragment.Detail04_10", {
	/** 세액감면 및 세액공제 - 기부금 **/
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
									  content : [new sap.m.Text({text : "기부금 세액공제"}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle",
									  rowSpan : 4
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "정치자금기부금"}).addStyleClass("FontFamily")],
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
														 oController.onPressOpenSubty(oEvent, "P0858List");
													 }
												 })],
									  hAlign : "Center",
									  vAlign : "Middle",
									  rowSpan : 4
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Input(oController.PAGEID + "_Poldn", {
													 editable : false,
													 value : "{Poldn}",
													 textAlign : "End"
												}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({
													text : "• 근로소득자가 정치자금법에 따라 정당(후원회 및 선거관리위원회 포함)에 기부한 정치자금"
												}).addStyleClass("FontFamily")],
									  hAlign : "Begin",
									  vAlign : "Middle"
								 }).addStyleClass("MatrixData PaddingTop5 PaddingBottom5")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						 cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "법정기부금"}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								  }).addStyleClass("MatrixData"),
								  new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Input(oController.PAGEID + "_Flgdo", {
													  value : "{Flgdo}",
													  editable : false,
													  textAlign : "End"
												 }).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								  }).addStyleClass("MatrixData"),
								  new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "• 해당 과세기간에 지급한 한도 내 법정기부금과 지정기부금을 합한 금액의 100분의 15" +
																  		"(해당금액이 2천만원을 초과하는 경우 그 초과분은 100분의 30, 단 2015년 이전분은 3천만원 초과분 100분의 25)" +
																  		"에 해당하는 금액을 근로소득에 대한 종합소득산출세액에서 공제"}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								  }).addStyleClass("MatrixData PaddingTop5 PaddingBottom5")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "35px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "지정기부금(종교단체 외)"}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Input(oController.PAGEID + "_Desdo", {
													  value : "{Desdo}",
													  editable : false,
													  textAlign : "End"
												 }).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({
													text : "• 해당 과세기간에 지급한 한도 내 법정기부금과 지정기부금을 합한 금액의 100분의 15" +
															"(해당금액이 2천만원을 초과하는 경우 그 초과분은 100분의 30, 단 2015년 이전분은 3천만원 초과분 100분의 25)" +
															"에 해당하는 금액을 근로소득에 대한 종합소득산출세액에서 공제"  
												 }).addStyleClass("FontFamily")],
									  hAlign : "Begin",
									  vAlign : "Middle",
									  rowSpan : 2
								 }).addStyleClass("MatrixData")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "35px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Text({text : "지정기부금(종교단체)"}).addStyleClass("FontFamily")],
									  hAlign : "Center",
									  vAlign : "Middle"
								 }).addStyleClass("MatrixData"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Input(oController.PAGEID + "_Reldo", {
													  value : "{Reldo}",
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
