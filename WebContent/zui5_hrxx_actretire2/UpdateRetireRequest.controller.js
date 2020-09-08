jQuery.sap.require("common.SearchUser2");
jQuery.sap.require("common.Survey");
jQuery.sap.require("control.BusyIndicator");
jQuery.sap.require("sap.ui.unified.FileUploader");
jQuery.sap.require("common.SearchCode");

sap.ui.controller("zui5_hrxx_actretire2.UpdateRetireRequest", {
	
	PAGEID : "UpdateRetireRequest",
	Wave : "2",
	_vPersa : "",
	_vAppno : "",
	_vRetst : "",
	_vPernr : "",
	_vActda : "",
	_vAdmin : "",
	_vViewType : "",
	_selectedAppno : "",
	_selectedAdjst : "",
	_selectedAdjrg : "",
	_selectedPersa : "",
	
	_vContext : null,
	
	_vFromPageId : "",
	
	_oCommentControl : null,
	_oUserControl : null,
	
	_vRetireDocumnetInfo : [],
	_vUploadFiles : null,
	
	_vPreviewHtml : "",
	_PreviewDialog : null,
	
	_AddPersonDialog : null,
	_SerachOrgDialog : null,
	_CommentDialog : null,
	_SurveyDialog : null,
	_StaffDialog : null,
	
	BusyDialog : null,
	
	_vUploadFileCount : 0,

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actretire2.UpdateRetireRequest
*/
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			this.getView().addStyleClass("sapUiSizeCompact");
		};
		this.getView().addEventDelegate({
			onBeforeShow  : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
		});
	},
	
	onBeforeShow: function(oEvent) {		
		this._vPersa = oEvent.data.Persa; 
		this._vRetst = oEvent.data.Retst;
		this._vAppno = oEvent.data.Appno;
		this._vPernr = oEvent.data.Pernr;
		this._vAdmin = oEvent.data.Admin;
		this._vFromPageId = oEvent.data.FromPageId;
		this._vViewType = oEvent.data.ViewType;
		this.onSetPageLayout(this);
		var oController = this;
		
		this._vUploadFiles = [];
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		var curDate = new Date();
		this._vActda = dateFormat.format(curDate);
		
		var oIconTabBar = sap.ui.getCore().byId(this.PAGEID + "_ICONBAR"); //Iconbar
		var oIconTabBar1 = sap.ui.getCore().byId(this.PAGEID + "_ICONFILTER_1"); //overview
		var oIconTabBar2 = sap.ui.getCore().byId(this.PAGEID + "_ICONFILTER_2"); //팀장면담
		var oIconTabBar3 = sap.ui.getCore().byId(this.PAGEID + "_ICONFILTER_3"); //퇴직설문
		var oIconTabBar4 = sap.ui.getCore().byId(this.PAGEID + "_ICONFILTER_4"); //인사면담
		var oIconTabBar5 = sap.ui.getCore().byId(this.PAGEID + "_ICONFILTER_5"); //퇴직체트
		var oIconTabBar6 = sap.ui.getCore().byId(this.PAGEID + "_ICONFILTER_6"); //파일업로드
		var oIconTabBarProcess = sap.ui.getCore().byId(this.PAGEID + "_PROCESS"); //Process 표기
		
		var oEname = sap.ui.getCore().byId(this.PAGEID + "_Ename");
		var oCalPsg = sap.ui.getCore().byId(this.PAGEID + "_CalPsg");
		var oPersg_Persk = sap.ui.getCore().byId(this.PAGEID + "_Persg_Persk");
		var oStext = sap.ui.getCore().byId(this.PAGEID + "_Stext");
		var oEntda = sap.ui.getCore().byId(this.PAGEID + "_Entda");
		
		var oRetda = sap.ui.getCore().byId(this.PAGEID + "_Retda");
		var oRetda_Text = sap.ui.getCore().byId(this.PAGEID + "_Retda_Text");
		var oFixRetda = sap.ui.getCore().byId(this.PAGEID + "_RC_Retda");
		var oFixRetda_Text = sap.ui.getCore().byId(this.PAGEID + "_RC_Retda_Text");		
		
		// 퇴직서류 관련 Controls
		var oRCHndno = sap.ui.getCore().byId(this.PAGEID + "_RC_Hndno");
		var oRCEmail = sap.ui.getCore().byId(this.PAGEID + "_RC_Email");
		var oRCBankn = sap.ui.getCore().byId(this.PAGEID + "_RC_Bankn");
		var oRCIrpno = sap.ui.getCore().byId(this.PAGEID + "_RC_Irpno");
		var oRCAddre = sap.ui.getCore().byId(this.PAGEID + "_RC_Addre");
		
		var oMassg = sap.ui.getCore().byId(this.PAGEID + "_Massg");
		var oReexp = sap.ui.getCore().byId(this.PAGEID + "_Reexp");
		var oStpnr = sap.ui.getCore().byId(this.PAGEID + "_Stpnr");
		var oSeexp = sap.ui.getCore().byId(this.PAGEID + "_Seexp");
		
		// 팀장면담 관련 Controls
		var oTlpnm = sap.ui.getCore().byId(this.PAGEID + "_Tlpnm");
		var oTlfulln = sap.ui.getCore().byId(this.PAGEID + "_Tlfulln");
		var oIntv1 = sap.ui.getCore().byId(this.PAGEID + "_Intv1");
		var oIntv1_1 = sap.ui.getCore().byId(this.PAGEID + "_Intv1_1");
		
		var setChiefFaceToFace = function(){
			oTlpnm = null;
			oTlfulln = null;
			oIntv1 = null;
			oIntv1_1 = null;
		};
		
		var oIntv2 = sap.ui.getCore().byId(this.PAGEID + "_Intv2");
		/*
		 *  2016-01-25 KYJ
		 *  VIEW TYPE 으로 ICONBAR 를 설정
		 */
		oIconTabBar.removeAllItems();
		oIconTabBar.destroyItems();
		if(this._vViewType == "1"){ // 미국
			setChiefFaceToFace();
			oIconTabBar.addItem(oIconTabBar1);
			oIconTabBar.addItem(new sap.m.IconTabSeparator({icon : "sap-icon://process"}));
			oIconTabBar2 = null;
			oIconTabBar.addItem(oIconTabBar3);
			oIconTabBar.addItem(oIconTabBar4);
			oIconTabBar.addItem(oIconTabBar5);
			oIconTabBar.addItem(new sap.m.IconTabSeparator({icon : "sap-icon://process"}));
			oIconTabBar.addItem(oIconTabBar6);
		}else if(this._vViewType == "2" || this._vViewType == "3"){ //체코 , 영국
			setChiefFaceToFace();
			oIconTabBar.addItem(oIconTabBar1);
			oIconTabBar.addItem(new sap.m.IconTabSeparator({icon : "sap-icon://process"}));
			oIconTabBar2 = null;
			oIconTabBar3 = null;
			oIconTabBar4 = null;
			oIconTabBar5 = null;
			oIconTabBar.addItem(oIconTabBar6);
		}else if(this._vViewType == "9"){
			oIconTabBar.addItem(oIconTabBar1);
			oIconTabBar.addItem(new sap.m.IconTabSeparator({icon : "sap-icon://process"}));
			oIconTabBar.addItem(oIconTabBar2);
			oIconTabBar.addItem(oIconTabBar3);
			oIconTabBar.addItem(oIconTabBar4);
			oIconTabBar.addItem(oIconTabBar5);
			oIconTabBar.addItem(new sap.m.IconTabSeparator({icon : "sap-icon://process"}));
			oIconTabBar.addItem(oIconTabBar6);
		}
		
		var oIconTabBar = sap.ui.getCore().byId(this.PAGEID + "_ICONBAR");
		if(oIconTabBar.getSelectedKey() != "00") {
			oIconTabBar.setSelectedKey("00");
		}
		
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVE_BTN");
		var oSurveyStartBtn = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_START_BTN");
		var oSurveyViewBtn = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_VIEW_BTN");
		var oCheckRequesttn = sap.ui.getCore().byId(oController.PAGEID + "_CHECK_REQUEST_BTN");
		var oCheckPrintBtn = sap.ui.getCore().byId(oController.PAGEID + "_CHECK_PRINT_BTN");
		var oRetireDocBtn = sap.ui.getCore().byId(oController.PAGEID + "_RETIRE_DOC_BTN");
		//추가
		var oRequestBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUEST_BTN");
		var oPreviewBtn = sap.ui.getCore().byId(oController.PAGEID + "_PREVIEW_BTN");
		// 퇴직 체크 		
		var oAdjrg = sap.ui.getCore().byId(this.PAGEID + "_Adjrg");
		var oRetireCheckLayout1 = sap.ui.getCore().byId(this.PAGEID + "_RetireCheck_LAYOUT1");
		var oRetireCheckLayout2 = sap.ui.getCore().byId(this.PAGEID + "_RetireCheck_LAYOUT2");
		
		if(oAdjrg) {
			oAdjrg.destroyItems();
			oAdjrg.addItem(new sap.ui.core.Item({key : "0000", text : oBundleText.getText("SELECTDATA")}));
			oModel.read("/RetirementSettlementAreaSet/?$filter=Persa%20eq%20%27" + this._vPersa + "%27", 
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								oAdjrg.addItem(new sap.ui.core.Item({key : oData.results[i].Adjrg, text : oData.results[i].Adjrgtx}));
							}
							
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
			oAdjrg.setSelectedKey("0000");
		}
		
		try {
			oModel.read("/RetirementApplicationAdministrationSet(Appno='" + this._vAppno + "')", 
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData) {
							//수정완료
							oController._vContext = oData;
							
							if(oEname) oEname.setText(oData.Ename + " (" + oData.Pernr + ")");							
							if(oCalPsg) oCalPsg.setText(oData.Zzcaltltx + " / " + oData.Zzpsgrptx);
							if(oPersg_Persk) oPersg_Persk.setText(oData.Pgtxt + " / " + oData.Pktxt);
							if(oStext) oStext.setText(oData.Fulln);
							if(oEntda) oEntda.setText(dateFormat1.format(new Date(common.Common.setTime(new Date(oData.Entda)))));
							if(oRetda) oRetda.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(oData.Retda)))));
							if(oFixRetda) oFixRetda.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(oData.Retda)))));
							
							//추가
							if(oRCHndno) oRCHndno.setValue(oData.Hndno);
							if(oRCEmail) oRCEmail.setValue(oData.Email);
							if(oRCBankn) oRCBankn.setValue(oData.Bankn);
							if(oRCIrpno) oRCIrpno.setValue(oData.Irpno);
							if(oRCAddre) oRCAddre.setValue(oData.Addre);
							
							if(oRetda_Text) oRetda_Text.setText(dateFormat1.format(new Date(common.Common.setTime(new Date(oData.Retda)))));
							if(oFixRetda_Text) oFixRetda_Text.setText(dateFormat1.format(new Date(common.Common.setTime(new Date(oData.Retda)))));							
							
							if(oTlpnm) oTlpnm.setText(oData.Tlpnm + " / " + oData.Tlcaltltx);
							if(oTlfulln) oTlfulln.setText(oData.Tlfulln);
							if(oIntv1) oIntv1.setText(oData.Intv1);
							
							if(oIntv1_1) oIntv1_1.setText(oData.Intv1);
							if(oIntv2) oIntv2.setValue(oData.Intv2);
							
							if(oStpnr) {
								if(oData.Stpnr != "") {
									oStpnr.setValue(oData.Stpnm);
									oStpnr.removeAllCustomData();
									oStpnr.addCustomData(new sap.ui.core.CustomData({key : "Pernr", value : oData.Stpnr}));
								} else {
									oStpnr.setValue("");
									oStpnr.removeAllCustomData();
								}
							}							
							
							if(oMassg) {
								oMassg.destroyCustomData();
								if(oData.Massg != "") {
									oMassg.setValue(oData.Mgtxt);
									oMassg.addCustomData(new sap.ui.core.CustomData({
										key : "Massg",
										value : oData.Massg
									}));
								}
							}							
							
							if(oData.Reexp == "X") {
								if(oReexp) oReexp.setSelected(true);
							} else {
								if(oReexp) oReexp.setSelected(false);
							}
							
							if(oData.Seexp == "X") {
								if(oSeexp) oSeexp.setSelected(true);
							} else {
								if(oSeexp) oSeexp.setSelected(false);
							}
							//중공업인 경우 비활성화 한다.
							if(oSeexp) {
								if(gPersa == "0900") {
									oSeexp.setEnabled(false);
								}
							}
							
							if(oData.Opnda != null) {
								if(oIconTabBar1) oIconTabBar1.setCount(dateFormat1.format(new Date(common.Common.setTime(new Date(oData.Opnda)))));
							} else {
								if(oIconTabBar1) oIconTabBar1.setCount("");
							}
							if(oData.Itda1 != null) {
								if(oIconTabBar2) oIconTabBar2.setCount(dateFormat1.format(new Date(common.Common.setTime(new Date(oData.Itda1)))));
							} else {
								if(oIconTabBar2) oIconTabBar2.setCount("");
							}
							if(oData.Rscda != null) {
								if(oIconTabBar3) oIconTabBar3.setCount(dateFormat1.format(new Date(common.Common.setTime(new Date(oData.Rscda)))));
							} else {
								if(oIconTabBar3) oIconTabBar3.setCount("");
							}
							
							if(oData.Itda2 != null) {
								if(oIconTabBar4) oIconTabBar4.setCount(dateFormat1.format(new Date(common.Common.setTime(new Date(oData.Itda2)))));
							} else {
								if(oIconTabBar4) oIconTabBar4.setCount("");
							}
							if(oData.Adcda != null) {
								if(oIconTabBar5) oIconTabBar5.setCount(dateFormat1.format(new Date(common.Common.setTime(new Date(oData.Adcda)))));
							} else {
								if(oIconTabBar5) oIconTabBar5.setCount("");
							}
							if(oData.Docda != null) {
								if(oIconTabBar6) oIconTabBar6.setCount(dateFormat1.format(new Date(common.Common.setTime(new Date(oData.Docda)))));
							} else {
								if(oIconTabBar6) oIconTabBar6.setCount("");
							}
							
							if(oData.Reexp == "X") {
								if(oIconTabBar3) oIconTabBar3.setVisible(false);
							} else {
								if(oIconTabBar3){
									console.log(oIconTabBar3);
									oIconTabBar3.setVisible(true);
								}
							}
							if(oData.Seexp == "X") {
								if(oIconTabBar5) oIconTabBar5.setVisible(false);
							} else {
								if(oIconTabBar5) oIconTabBar5.setVisible(true);
							}
							
							if(oData.Reexp == "X") {
								if(oRetireCheckLayout1) oRetireCheckLayout1.setVisible(true);
								if(oRetireCheckLayout2) oRetireCheckLayout2.setVisible(false);
							} else {
								if(oData.Suvyn == "X") {
									if(oRetireCheckLayout1) oRetireCheckLayout1.setVisible(true);
									if(oRetireCheckLayout2) oRetireCheckLayout2.setVisible(false);
								} else {
									if(oRetireCheckLayout1) oRetireCheckLayout1.setVisible(false);
									if(oRetireCheckLayout2) oRetireCheckLayout2.setVisible(true);
								}
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
			
			console.log("1");
			if(oController._vContext.Extyn == "X") {
				oSaveBtn.setVisible(false);
				oSurveyStartBtn.setVisible(false);
				oSurveyViewBtn.setVisible(false);
				oCheckRequesttn.setVisible(false);
				oCheckPrintBtn.setVisible(false);
				oRetireDocBtn.setVisible(false);
				oRequestBtn.setVisible(false);
				oPreviewBtn.setVisible(false);
			} else {
				oSaveBtn.setVisible(true);
				oSurveyStartBtn.setVisible(false);
				oSurveyViewBtn.setVisible(false);
				oCheckRequesttn.setVisible(false);
				oCheckPrintBtn.setVisible(false);
				oRetireDocBtn.setVisible(false);
				oRequestBtn.setVisible(false);
				oPreviewBtn.setVisible(false);
			}
			
			if(this._vAdmin == "X") {
				oIconTabBar2.setVisible(false);
				oIconTabBar3.setVisible(false);
				oIconTabBar4.setVisible(false);
				
				oSaveBtn.setVisible(false);
				oSurveyStartBtn.setVisible(false);
				oSurveyViewBtn.setVisible(false);
				oCheckRequesttn.setVisible(false);
				oCheckPrintBtn.setVisible(false);
				oRetireDocBtn.setVisible(false);
				oRequestBtn.setVisible(false);
				oPreviewBtn.setVisible(false);
			}
			var oHistoryTable = sap.ui.getCore().byId(this.PAGEID + "_History_TABLE");
			var oHistoryColumnList = sap.ui.getCore().byId(this.PAGEID + "_History_COLUMNLIST");
			if(oHistoryTable) {
				oHistoryTable.bindItems("/RetirementProcessHistorySet", oHistoryColumnList, 
						null, [new sap.ui.model.Filter("Appno", sap.ui.model.FilterOperator.EQ, this._vAppno)]);
			}	
			
			this.setAddInfomation(this);
			
		} catch(ex) {
			console.log(ex);
		}
	},
	
//	/* 2016-01-22 KYJ
//	 * 저장 후 Iconbar의 Icon 에 날짜를 업데이트                                                                                                              
//	 */
//	setIconDate : function(oEvent){
//		console.log("asdfasdfasdfasdfasfd");
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
//		var oController = oView.getController();
//		var oIconTabBar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR"); //Iconbar
//		var oIconTabBar1 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_1"); //overview
//		var oIconTabBar2 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_2"); //팀장면담
//		var oIconTabBar3 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_3"); //퇴직설문
//		var oIconTabBar4 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_4"); //인사면담
//		var oIconTabBar5 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_5"); //퇴직체트
//		var oIconTabBar6 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_6"); //파일업로드
//		var oHistoryTable = sap.ui.getCore().byId(oController.PAGEID + "_History_TABLE"); //History table
//		var oHistoryModel = oHistoryTable.getModel();
//		
//		var oHistoryList = oHistoryModel.getProperty("/RetirementProcessHistorySet");
//		console.log("oHistoryList");
//		var oItems = oHistoryList.getItems();
//		for(var i=0; i < oItems.length ; i++){
//			console.log(oItems[i].getCells()[1].getText());
//		}
//		
//		
////		if(oIconTabBar1) oIconTabBar1.setCount(dateFormat1.format(new Date(common.Common.setTime(new Date(oData.Opnda)))));
//	},
	/*
	 *  WAVE2 반영
	 *  2016-01-22 KYJ
	 *  VIEW TYPE 으로 각 TAB의 화면 구성을 설정한다.
	 */
	
	onSetPageLayout : function(oController){
		// Overview Layout 설정
		var oRetireOptionLayout = sap.ui.getCore().byId(oController.PAGEID + "_RetireOptionLayout");
		oRetireOptionLayout.removeAllRows();
		oRetireOptionLayout.destroyRows();
		
		var oLbMassg = sap.ui.getCore().byId(oController.PAGEID + "_Label_Massg");
		var oIpMassg = sap.ui.getCore().byId(oController.PAGEID + "_Input_Massg");
		var oLbReexp = sap.ui.getCore().byId(oController.PAGEID + "_Label_Reexp");
		var oIpReexp = sap.ui.getCore().byId(oController.PAGEID + "_Input_Reexp");
		var oLbStpnr  = sap.ui.getCore().byId(oController.PAGEID + "_Label_Stpnr");
		var oIpStpnr = sap.ui.getCore().byId(oController.PAGEID + "_Input_Stpnr");
		var oLbSeexp = sap.ui.getCore().byId(oController.PAGEID + "_Label_Seexp");
		var oIpSeexp = sap.ui.getCore().byId(oController.PAGEID + "_Input_Seexp");
		
		var oCell , oRow , vIdx = 0 , vAddYn;
		console.log(oController._vViewType);
		if(oController._vViewType == "9"){
			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			oRow.addCell(oLbMassg);
			oRow.addCell(oIpMassg);
			oRow.addCell(oLbReexp);
			oRow.addCell(oIpReexp);
			oRetireOptionLayout.addRow(oRow);
			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			oRow.addCell(oLbStpnr);
			oRow.addCell(oIpStpnr);
			oRow.addCell(oLbSeexp);
			oRow.addCell(oIpSeexp);
			oRetireOptionLayout.addRow(oRow);
		}else if(oController._vViewType == "2" || oController._vViewType == "3"){
			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			console.log(oLbMassg);
			console.log(oRetireOptionLayout);
			oRow.addCell(oLbMassg);
			oRow.addCell(oIpMassg);
			oRetireOptionLayout.addRow(oRow);
		}else if(oController._vViewType == "1"){
			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			oRow.addCell(oLbMassg);
			oRow.addCell(oIpMassg);
			oRow.addCell(oLbReexp);
			oRow.addCell(oIpReexp);
			oRetireOptionLayout.addRow(oRow);
			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			oRow.addCell(new sap.ui.commons.layout.MatrixLayoutCell({
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10"));
			oRow.addCell(new sap.ui.commons.layout.MatrixLayoutCell({
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10"));
			oRow.addCell(oLbSeexp);
			oRow.addCell(oIpSeexp);
			oRetireOptionLayout.addRow(oRow);
		}
		// HR면담 Layout 설정
		var oChiefNotePanel = sap.ui.getCore().byId(oController.PAGEID + "_ChiefNotePanel"); 
		if(oController._vViewType == "9"){ // Wave1
			oChiefNotePanel.setVisible(true);
		}else if(oController._vViewType == "1"){ // 미국
			oChiefNotePanel.setVisible(false);
		}
		
		// RetireDocument Layout 설정
		var oCell1_1 = sap.ui.getCore().byId(oController.PAGEID + "_RC_Retda_Lab");
		var oCell1_2 = sap.ui.getCore().byId(oController.PAGEID + "_RC_Retda_Cel");
		var oCell2_1 = sap.ui.getCore().byId(oController.PAGEID + "_RC_Hndno_Lab");
		var oCell2_2 = sap.ui.getCore().byId(oController.PAGEID + "_RC_Hndno_Cel");
		var oCell3_1 = sap.ui.getCore().byId(oController.PAGEID + "_RC_Email_Lab");
		var oCell3_2 = sap.ui.getCore().byId(oController.PAGEID + "_RC_Email_Cel");
		var oCell4_1 = sap.ui.getCore().byId(oController.PAGEID + "_RC_Bankn_Lab");
		var oCell4_2 = sap.ui.getCore().byId(oController.PAGEID + "_RC_Bankn_Cel");
		var oCell5_1 = sap.ui.getCore().byId(oController.PAGEID + "_RC_Addre_Lab");
		var oCell5_2 = sap.ui.getCore().byId(oController.PAGEID + "_RC_Addre_Cel");
//		var oCell6_1 = sap.ui.getCore().byId(oController.PAGEID + "_RC_Aus_Lab");
//		var oCell6_2 = sap.ui.getCore().byId(oController.PAGEID + "_RC_Aus_Cel");
		var oRetdaLayout = sap.ui.getCore().byId(oController.PAGEID + "_RetdaLayout");
		oRetdaLayout.removeAllRows();
		oRetdaLayout.destroyRows();
		
		if(oController._vViewType == "1"){ // 미국 
			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			oRow.addCell(oCell1_1);
			oRow.addCell(oCell1_2);
			oRow.addCell(oCell2_1);
			oRow.addCell(oCell2_2);
			oRetdaLayout.addRow(oRow);
			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			oCell5_2.setColSpan(1);
			oRow.addCell(oCell3_1);
			oRow.addCell(oCell3_2);
			oRow.addCell(oCell5_1);
			oRow.addCell(oCell5_2);
			oRetdaLayout.addRow(oRow);
		}else if(oController._vViewType == "2"){ // 영국
			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			oRow.addCell(oCell1_1);
			oRow.addCell(oCell1_2);
			oRow.addCell(oCell2_1);
			oRow.addCell(oCell2_2);
			oRetdaLayout.addRow(oRow);
		}else if(oController._vViewType == "3"){ // 체코
			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			oRow.addCell(oCell1_1);
			oRow.addCell(oCell1_2);
			oRetdaLayout.addRow(oRow);
		}else if(oController._vViewType == "9"){ // Wave1
			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			oRow.addCell(oCell1_1);
			oRow.addCell(oCell1_2);
			oRow.addCell(oCell2_1);
			oRow.addCell(oCell2_2);
			oRetdaLayout.addRow(oRow);
			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			oRow.addCell(oCell3_1);
			oRow.addCell(oCell3_2);
			oRow.addCell(oCell4_1);
			oRow.addCell(oCell4_2);
			oRetdaLayout.addRow(oRow);
			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			oCell5_2.setColSpan(3);
			oRow.addCell(oCell5_1);
			oRow.addCell(oCell5_2);
			oRetdaLayout.addRow(oRow);
		}
	},
	
	
	/*
	 *  퇴직자의 인사영역에 따른 화면 제어
	 */
	
	setAddInfomation : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		
		var oDocumentDownloadLayout = sap.ui.getCore().byId(oController.PAGEID + "_DocumentDownloadLayout");
		var oDocumentUploadLayout = sap.ui.getCore().byId(oController.PAGEID + "_DocumentUploadLayout");
		
		if(oDocumentDownloadLayout) {
//			var oRows = oDocumentUploadLayout.getRows();
//			if(oRows && oRows.length) {
//				for(var i=0; i<oRows.length; i++) {
//					var oDocumentFile = sap.ui.getCore().byId(oController.PAGEID  + "_DocumentFile" + (i+1));
//					var oDocumentFileLinkInfo = sap.ui.getCore().byId(oController.PAGEID  + "_DocumentFile_LinkInfo" + (i+1));
//					var oDocumentFileLink = sap.ui.getCore().byId(oController.PAGEID  + "_DocumentFile_Link" + (i+1));
//					var oDocumentFileLinkDelBtn = sap.ui.getCore().byId(oController.PAGEID  + "_DocumentFile_LinkDelBtn" + (i+1));
//					
//					var ofile = jQuery.sap.domById(oController.PAGEID + "_DocumentFile" + (i+1) + "-fu");
//					if(ofile) ofile.remove();
//					
//					oDocumentFile.destroy();
//					oDocumentFileLink.destroy();
//					oDocumentFileLinkInfo.destroy();
//					oDocumentFileLinkDelBtn.destroy();
//				}
//			}
			
//			oDocumentDownloadLayout.removeAllRows();
			oDocumentDownloadLayout.destroyRows();
//			oDocumentUploadLayout.removeAllRows();
			oDocumentUploadLayout.destroyRows();		
			
			oController._vUploadFileCount = 0;
			
			oModel.read("/RetirementDocumentFileSet/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27"
					  + "%20and%20Actty%20eq%20%27" + "D" + "%27", 
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							oController._vRetireDocumnetInfo = oData.results;
							for(var i=0; i<oData.results.length; i++) {
								//다운로드 파일중에서 URI 값이 있는 것만 표시
								if(oData.results[i].Uri != "") {
									var oRow = new sap.ui.commons.layout.MatrixLayoutRow();
									
									var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
										hAlign : sap.ui.commons.layout.HAlign.Begin,
										vAlign : sap.ui.commons.layout.VAlign.Middle,
										content : [new sap.m.Label({text: oData.results[i].Rdonm}).addStyleClass("L2P13Font")]
									}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
									oRow.addCell(oCell);
									
									oCell = new sap.ui.commons.layout.MatrixLayoutCell({
										hAlign : sap.ui.commons.layout.HAlign.Begin,
										vAlign : sap.ui.commons.layout.VAlign.Middle,
										content : [new sap.m.Link({text: oData.results[i].Fname, href : oData.results[i].Uri, target : "_new"}).addStyleClass("L2P13Font")]
									}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
									oRow.addCell(oCell);
									
									oDocumentDownloadLayout.addRow(oRow);
								}								
								
								//파일중에서 업로드여부가 "X"인 것만 표시
								if(oData.results[i].Updyn == "X") {
									oController._vUploadFileCount++;
									
									oRow = new sap.ui.commons.layout.MatrixLayoutRow();
									
									oCell = new sap.ui.commons.layout.MatrixLayoutCell({
										hAlign : sap.ui.commons.layout.HAlign.Begin,
										vAlign : sap.ui.commons.layout.VAlign.Middle,
										content : [new sap.m.Label({text: oData.results[i].Rdonm}).addStyleClass("L2P13Font")]
									}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
									oRow.addCell(oCell);
									
									oCell = new sap.ui.commons.layout.MatrixLayoutCell({
										hAlign : sap.ui.commons.layout.HAlign.Begin,
										vAlign : sap.ui.commons.layout.VAlign.Middle,
										content : [new sap.ui.unified.FileUploader(oController.PAGEID + "_DocumentFile" + (oData.results[i].Seqnr), {
														name : "RetireDocument" + (i+1),
														buttonText : oBundleText.getText("FIND_BTN"),
														icon : "sap-icon://search",
														width : "90%",
														multiple : false,
														change : oController.onChangeFile
												  }).addCustomData(new sap.ui.core.CustomData({key : "Index", value : i})),
												  new sap.m.Toolbar(oController.PAGEID + "_DocumentFile_LinkInfo" + (oData.results[i].Seqnr), {
													  visible : false,
													  content : [new sap.m.Link(oController.PAGEID + "_DocumentFile_Link" + (oData.results[i].Seqnr), {
														  			target : "_new"
														  		 }).addStyleClass("L2P13Font"),
														  		 new sap.m.ToolbarSpacer(),
														  		 new sap.m.Button(oController.PAGEID + "_DocumentFile_LinkDelBtn" + (oData.results[i].Seqnr),{
														  			 press : oController.onDeleteDocFile,
														  			 text : oBundleText.getText("DELETE_BTN")
														  		 }).addCustomData(new sap.ui.core.CustomData({key : "Attty", value : oData.results[i].Attty}))
														  		   .addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : oData.results[i].Seqnr}))
													             ]
												  }).addStyleClass("L2PToolbarNoBottomLine")]
									}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
									oRow.addCell(oCell);
									
									oDocumentUploadLayout.addRow(oRow);
								}	
							}
						}
					},
					function(oError) {
						common.Common.log(oError);
					}
			);
		}
		
		if(oController._vContext.Docyn == "X" || oController._vContext.Reqyn == "X") {			
			for(var i=0; i<oController._vRetireDocumnetInfo.length; i++) {
				if(oController._vRetireDocumnetInfo[i].Updyn == "X") {
					var oDocumentFile = sap.ui.getCore().byId(oController.PAGEID  + "_DocumentFile" + (oController._vRetireDocumnetInfo[i].Seqnr));
					oDocumentFile.setVisible(false);
				}				
			}
		}
		
		var oReadParm = [];
		oReadParm.push("$filter=Persa eq '" + oController._vPersa + "' and Appno eq '" + oController._vAppno + "'");
		
		oModel.read("/RetirementDocumentSet", 
				null, 
				oReadParm, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							var oDocumentFileLinkInfo = sap.ui.getCore().byId(oController.PAGEID  + "_DocumentFile_LinkInfo" + (oData.results[i].Seqnr));
							if(oDocumentFileLinkInfo) oDocumentFileLinkInfo.setVisible(true);
							
							var oDocumentFileLink = sap.ui.getCore().byId(oController.PAGEID  + "_DocumentFile_Link" + (oData.results[i].Seqnr));
							if(oDocumentFileLink) {
								oDocumentFileLink.setVisible(true);
								oDocumentFileLink.setText(oData.results[i].Fname);
								oDocumentFileLink.setHref(oData.results[i].Uri);
							}
							
							var oDocumentFileLinkDelBtn = sap.ui.getCore().byId(oController.PAGEID  + "_DocumentFile_LinkDelBtn" + (oData.results[i].Seqnr));
							if(oController._vContext.Docyn == "X" || oController._vContext.Reqyn == "X") {
								if(oDocumentFileLinkDelBtn) oDocumentFileLinkDelBtn.setVisible(false);
							} else {
								if(oDocumentFileLinkDelBtn) oDocumentFileLinkDelBtn.setVisible(true);
							}
						}
					}
				},
				function(oError) {
					common.Common.log(oError);
				}
		);
		
		var oSurveyDownloadLayout = sap.ui.getCore().byId(oController.PAGEID + "_SurveyDownloadLayout");
		var oSurveyDownloadPanel = sap.ui.getCore().byId(oController.PAGEID + "_SurveyDownloadPanel");
		if(oSurveyDownloadLayout) {
			oSurveyDownloadLayout.removeAllRows();
			oSurveyDownloadLayout.destroyRows();
			oModel.read("/RetirementDocumentFileSet/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27"
					  + "%20and%20Actty%20eq%20%27" + "S" + "%27", 
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								var oRow = new sap.ui.commons.layout.MatrixLayoutRow();
								
								var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
									hAlign : sap.ui.commons.layout.HAlign.Begin,
									vAlign : sap.ui.commons.layout.VAlign.Middle,
									content : [new sap.m.Label({text: oData.results[i].Rdonm}).addStyleClass("L2P13Font")]
								}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
								oRow.addCell(oCell);
								
								oCell = new sap.ui.commons.layout.MatrixLayoutCell({
									hAlign : sap.ui.commons.layout.HAlign.Begin,
									vAlign : sap.ui.commons.layout.VAlign.Middle,
									content : [new sap.m.Link({text: oData.results[i].Fname, href : oData.results[i].Uri, target : "_new"}).addStyleClass("L2P13Font")]
								}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
								oRow.addCell(oCell);
								
								oSurveyDownloadLayout.addRow(oRow);
							}
						}
					},
					function(oError) {
						common.Common.log(oError);
					}
			);
			var oRows = oSurveyDownloadLayout.getRows();
			if(oRows == null || oRows.length < 1) {
				oSurveyDownloadPanel.setVisible(false);
			} else {
				oSurveyDownloadPanel.setVisible(true);
			}
		}
		
		var oDocumentReferenceLayout = sap.ui.getCore().byId(oController.PAGEID + "_DocumentReferenceLayout");
		var oDocumentReferencePanel = sap.ui.getCore().byId(oController.PAGEID + "_DocumentReferencePanel");
		if(oDocumentReferenceLayout) {
			oDocumentReferenceLayout.removeAllRows();
			oDocumentReferenceLayout.destroyRows();
			oModel.read("/RetirementReferencesSet/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27"
					  + "%20and%20Bizty%20eq%20%27" + "10" + "%27", 
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								var oRow = new sap.ui.commons.layout.MatrixLayoutRow();
								
								var oHhml = new sap.ui.core.HTML({content : "<pre>" +  oData.results[i].Refer + "</div>", preferDOM : false});
								
								var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
									hAlign : sap.ui.commons.layout.HAlign.Begin,
									vAlign : sap.ui.commons.layout.VAlign.Middle,
									content : [oHhml.addStyleClass("L2P13Font")]
								}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
								oRow.addCell(oCell);
								
								oDocumentReferenceLayout.addRow(oRow);
							}
						}
					},
					function(oError) {
						common.Common.log(oError);
					}
			);
			var oRows = oDocumentReferenceLayout.getRows();
			if(oRows == null || oRows.length < 1) {
				oDocumentReferencePanel.setVisible(false);
			} else {
				oDocumentReferencePanel.setVisible(true);
			}
		}
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_actretire2.UpdateRetireRequest
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actretire2.UpdateRetireRequest
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actretire2.UpdateRetireRequest
*/
//	onExit: function() {
//
//	}
	
	navToBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : oController._vFromPageId,
		      data : {
		    	  
		      }
		});
	},
	
	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		var oIconTabBar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
		var sKey = oIconTabBar.getSelectedKey();
		var updateData = {};
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		var oPath = "/RetirementApplicationAdministrationSet(Appno='" + oController._vAppno + "')";
		var vMsg = "";
		
		console.log(sKey);
		if(sKey == "00") {
			updateData.Appno = oController._vAppno;
			updateData.Actty = "HO";
			
			var oRetda = sap.ui.getCore().byId(oController.PAGEID + "_Retda");
			
			var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg");
			var oReexp = sap.ui.getCore().byId(oController.PAGEID + "_Reexp");
			var oStpnr = sap.ui.getCore().byId(oController.PAGEID + "_Stpnr");
			var oSeexp = sap.ui.getCore().byId(oController.PAGEID + "_Seexp");
			var vStpnr = "";
			if(oStpnr) {
				var vStpnrCustomData = oStpnr.getCustomData();
				if(vStpnrCustomData && vStpnrCustomData.length) {
					for(var i=0; i<vStpnrCustomData.length; i++) {
						if(vStpnrCustomData[i].getKey() == "Pernr") {
							vStpnr = vStpnrCustomData[i].getValue();
						}
					}
				}
			}
			
			var oCustomData = oMassg.getCustomData();
			var vMassg = ""; 
			if(oCustomData && oCustomData.length) {
				for(var c=0; c<oCustomData.length; c++) {
					if(oCustomData[c].getKey() == "Massg") {
						vMassg = oCustomData[c].getValue();
					}
				}
			}
			
			updateData.Persa = oController._vPersa;
			updateData.Pernr = oController._vPernr;
			updateData.Retda = "\/Date(" + common.Common.getTime(oRetda.getValue()) + ")\/";
			updateData.Massg = vMassg;
			updateData.Stpnr = vStpnr;
			if(oReexp.getSelected()) updateData.Reexp = "X";
			else updateData.Reexp = "";
			if(oSeexp.getSelected()) updateData.Seexp = "X";
			else updateData.Seexp = "";	
			
			vMsg = oBundleText.getText("MSG_RETIRE_OVERVIEW_SAVE");
		} else if(sKey == "20") {
			var oRetda = sap.ui.getCore().byId(oController.PAGEID + "_Retda");
			
			updateData.Appno = oController._vAppno;
			updateData.Actty = "HU";
			updateData.Persa = oController._vPersa;
			updateData.Pernr = oController._vPernr;
			updateData.Retda = "\/Date(" + common.Common.getTime(oRetda.getValue()) + ")\/";
			
			var Intv2 = sap.ui.getCore().byId(oController.PAGEID + "_Intv2");
			updateData.Intv2 = Intv2.getValue();
			
			vMsg = oBundleText.getText("MSG_RETIRE_HR_SAVE");
		}
		
		var onAfterSave = function() {
			var oReexp = sap.ui.getCore().byId(oController.PAGEID + "_Reexp");
			var oSeexp = sap.ui.getCore().byId(oController.PAGEID + "_Seexp");
			
			var oIconTabBar3 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_3");
			var oIconTabBar4 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_4");
			var oIconTabBar5 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_5");
			
			var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
			
			if(sKey == "00") {
//				KYJ
				if(oReexp.getSelected()) {
					oController._vContext.Reexp = "X";
					oIconTabBar3.setVisible(false);
				} else {
					oController._vContext.Reexp = "";
					oIconTabBar3.setVisible(true);
				}
				if(oSeexp.getSelected()) {
					oController._vContext.Seexp = "X";
					oIconTabBar5.setVisible(false);
				} else {
					oController._vContext.Seexp = "";
					oIconTabBar5.setVisible(true);
				}
			} else if(sKey == "20") {
				oIconTabBar4.setCount(dateFormat1.format(new Date()));
			}
			
		};
		
		var UpdateProcess = function() {
			var process_result = false;
			try {
				oModel.update(
						oPath, 
						updateData, 
						null,
					    function (oData, response) {
							process_result = true;
							common.Common.log("Sucess RetirementApplicationAdministrationSet Update !!!");
					    },
					    function (oError) {
					    	var Err = {};
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
									common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
								} else {
									common.Common.showErrorMessage(Err.error.message.value);
								}
							} else {
								common.Common.showErrorMessage(oError);
							}
							process_result = false;
					    }
			    );
			} catch(ex) {
				process_result = false;
				common.Common.log(ex);
			}
			
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			if(!process_result) return;
			
			sap.m.MessageBox.alert(vMsg, {
				title: oBundleText.getText("INFORMATION"),
				onClose : onAfterSave
			});
		};
		
		if(sKey == "80") oController.onSaveDocUpload("DS");
		else {
			if(!oController.BusyDialog) {			
				oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
				oController.getView().addDependent(oController.BusyDialog);
			} else {
				oController.BusyDialog.removeAllContent();
				oController.BusyDialog.destroyContent();
				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
			}
			if(!oController.BusyDialog.isOpen()) {
				oController.BusyDialog.open();
			}
			
			setTimeout(UpdateProcess, 300);
		}
		
	},
	
	handleIconTabBarSelect : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVE_BTN");
		var oSurveyStartBtn = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_START_BTN");
		var oSurveyViewBtn = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_VIEW_BTN");
		var oCheckRequesttn = sap.ui.getCore().byId(oController.PAGEID + "_CHECK_REQUEST_BTN");
		var oCheckPrintBtn = sap.ui.getCore().byId(oController.PAGEID + "_CHECK_PRINT_BTN");
		var oRetireDocBtn = sap.ui.getCore().byId(oController.PAGEID + "_RETIRE_DOC_BTN");
		//추가
		var oRequestBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUEST_BTN");
		var oPreviewBtn = sap.ui.getCore().byId(oController.PAGEID + "_PREVIEW_BTN");
		
		var oSchRetda = sap.ui.getCore().byId(oController.PAGEID + "_SchRetda");
		var oRetda = sap.ui.getCore().byId(oController.PAGEID + "_Retda");
		var oRetda_Text = sap.ui.getCore().byId(oController.PAGEID + "_Retda_Text");
		
		var sKey = oEvent.getParameter("selectedKey");
		
		console.log(sKey);
		
		if(sKey == "30") {
			var oRetireSurveyFinished_PANEL = sap.ui.getCore().byId(oController.PAGEID + "_RetireSurveyFinished_PANEL");
			var oRetireSurveyFinished_Date = sap.ui.getCore().byId(oController.PAGEID + "_RetireSurveyFinished_Date");
			
			if(oController._vContext.Suvyn == "X") {
				oRetireSurveyFinished_PANEL.setVisible(true);
			} else {
				oRetireSurveyFinished_PANEL.setVisible(false);
			}
			
			if(oController._vContext.Rscdatim == "") {
				oRetireSurveyFinished_Date.setText("");
			} else {
				oRetireSurveyFinished_Date.setText(oController._vContext.Rscdatim);
			}
		}
		
		if(sKey == "00") {
			oSchRetda.setRequired(true);
			oRetda.setVisible(true);
			oRetda_Text.setVisible(false);
		} else {
			oSchRetda.setRequired(false);
			oRetda.setVisible(false);
			oRetda_Text.setVisible(true);
		}
		
		if(oController._vContext.Extyn != "X") {
			if(sKey == "00" || sKey == "20") {
				oSaveBtn.setVisible(true);
				oSurveyStartBtn.setVisible(false);
				oSurveyViewBtn.setVisible(false);
				oCheckRequesttn.setVisible(false);
				oCheckPrintBtn.setVisible(false);
				oRetireDocBtn.setVisible(false);
				oRequestBtn.setVisible(false);
				oPreviewBtn.setVisible(false);
			} else if(sKey == "10") {
				oSaveBtn.setVisible(false);
				oSurveyStartBtn.setVisible(false);
				oSurveyViewBtn.setVisible(false);
				oCheckRequesttn.setVisible(false);
				oCheckPrintBtn.setVisible(false);
				oRetireDocBtn.setVisible(false);
				oRequestBtn.setVisible(false);
				oPreviewBtn.setVisible(false);
			} else if(sKey == "30") {
				oSaveBtn.setVisible(false);
				if(oController._vContext.Suvyn != "X") {
					oSurveyStartBtn.setVisible(true);
					oSurveyViewBtn.setVisible(false);
				} else {
					oSurveyStartBtn.setVisible(false);
					oSurveyViewBtn.setVisible(true);
				}			
				oCheckRequesttn.setVisible(false);
				oCheckPrintBtn.setVisible(false);
				oRetireDocBtn.setVisible(false);
				oRequestBtn.setVisible(false);
				oPreviewBtn.setVisible(false);
			} else if(sKey == "60") {
				oSaveBtn.setVisible(false);
				oSurveyStartBtn.setVisible(false);
				oSurveyViewBtn.setVisible(false);
				if(oController._vContext.Setyn != "X") {
					oCheckRequesttn.setVisible(true);
					oCheckPrintBtn.setVisible(false);
				} else {
					oCheckRequesttn.setVisible(false);
					oCheckPrintBtn.setVisible(true);
				}			
				oRetireDocBtn.setVisible(false);
				oRequestBtn.setVisible(false);
				oPreviewBtn.setVisible(false);
			} else if(sKey == "80") {
				oSaveBtn.setVisible(false);
				oSurveyStartBtn.setVisible(false);
				oSurveyViewBtn.setVisible(false);
				oCheckRequesttn.setVisible(false);
				oCheckPrintBtn.setVisible(false);
				oRetireDocBtn.setVisible(false);
			}
		} else {
			oSaveBtn.setVisible(false);
			oSurveyStartBtn.setVisible(false);
			oSurveyViewBtn.setVisible(false);
			oCheckRequesttn.setVisible(false);
			oCheckPrintBtn.setVisible(false);
			oRequestBtn.setVisible(false);
			oPreviewBtn.setVisible(false);
			oRetireDocBtn.setVisible(false);
		}
		
		
		var oRetireCheckLayout1 = sap.ui.getCore().byId(oController.PAGEID + "_RetireCheck_LAYOUT1");
		var oRetireCheckLayout2 = sap.ui.getCore().byId(oController.PAGEID + "_RetireCheck_LAYOUT2");
		
		var oCheckTable = sap.ui.getCore().byId(oController.PAGEID + "_Check_TABLE");
		var oCheckColumnList = sap.ui.getCore().byId(oController.PAGEID + "_Check_COLUMNLIST");
		var oAdjrg = sap.ui.getCore().byId(oController.PAGEID + "_Adjrg");
		var oAdjrgtx = sap.ui.getCore().byId(oController.PAGEID + "_Adjrgtx");
		
		if(sKey == "60") {
			if(oController._vContext.Reexp == "X") {
				if(oRetireCheckLayout1) oRetireCheckLayout1.setVisible(true);
				if(oRetireCheckLayout2) oRetireCheckLayout2.setVisible(false);
			} else {
				if(oController._vContext.Suvyn == "X") {
					if(oRetireCheckLayout1) oRetireCheckLayout1.setVisible(true);
					if(oRetireCheckLayout2) oRetireCheckLayout2.setVisible(false);
				} else {
					if(oRetireCheckLayout1) oRetireCheckLayout1.setVisible(false);
					if(oRetireCheckLayout2) oRetireCheckLayout2.setVisible(true);
				}
			}
			oAdjrgtx.setText(oController._vContext.Adjrgtx);
			
			if(oController._vContext.Setyn == "X") {
				oAdjrg.setVisible(false);
				oAdjrgtx.setVisible(true);
				
				oCheckTable.setModel(sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV"));
				oCheckTable.bindItems("/RetirementSettlementSet", oCheckColumnList, 
						null, [new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa),
						       new sap.ui.model.Filter("Appno", sap.ui.model.FilterOperator.EQ, oController._vAppno),
						       new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, oController._vPernr)]);
			} else {
				oAdjrg.setVisible(true);
				oAdjrgtx.setVisible(false);
				
				oAdjrg.setSelectedKey("0000");
				
				var vArea = oAdjrg.getSelectedKey();
				if(vArea != "" && vArea != "0000") {
					var mRetirementSettlementSet = oController.getRetirementSettlementSet(oController._vPersa, oController._vAppno, vArea);
					oCheckTable.setModel(mRetirementSettlementSet);
					oCheckTable.bindItems("/RetirementSettlementSet", oCheckColumnList);
				} else {
					oCheckTable.unbindItems();
				}
			}
		}
		
		var oRCRetda = sap.ui.getCore().byId(oController.PAGEID + "_RC_Retda");
		var oRCRetda_Text = sap.ui.getCore().byId(oController.PAGEID + "_RC_Retda_Text");
		var oRCHndno= sap.ui.getCore().byId(oController.PAGEID + "_RC_Hndno");
		var oRCEmail = sap.ui.getCore().byId(oController.PAGEID + "_RC_Email");
		var oRCBankn = sap.ui.getCore().byId(oController.PAGEID + "_RC_Bankn");
		var oRCIrpno = sap.ui.getCore().byId(oController.PAGEID + "_RC_Irpno");
		var oRCAddre = sap.ui.getCore().byId(oController.PAGEID + "_RC_Addre");
		
		var oDocDownloadPanel = sap.ui.getCore().byId(oController.PAGEID + "_DocDownloadPanel");
//		if(sKey == "80") {
//			if(oController._vContext.Extyn != "X") {
//				oRCRetda.setVisible(true);
//				oRCRetda_Text.setVisible(false);
//				oRCHndno.setEnabled(true);
//				oRCEmail.setEnabled(true);
//				if(oRCBankn) oRCBankn.setEnabled(true);
//				if(oRCIrpno) oRCIrpno.setEnabled(true);
//				oRCAddre.setEnabled(true);
//				console.log(oController._vContext.Appyn);
//				console.log(oController._vContext.Reqyn);
//				if(oController._vContext.Appyn == "X") {
//					oRetireDocBtn.setVisible(false);
//					
//					if(oController._vContext.Reqyn == "X") {
//						oRequestBtn.setVisible(false);
//						oPreviewBtn.setVisible(false);
//						oSaveBtn.setVisible(false);
//						oDocDownloadPanel.setVisible(false);
//					} else {
//						oRequestBtn.setVisible(true);
//						oPreviewBtn.setVisible(true);
//						oSaveBtn.setVisible(true);
//						oDocDownloadPanel.setVisible(true);
//					}
//				} else {
//					oRequestBtn.setVisible(false);
//					oPreviewBtn.setVisible(false);
//					oRetireDocBtn.setVisible(false);
//					oSaveBtn.setVisible(true);
//					oDocDownloadPanel.setVisible(true);							
//				}
//			}
//		}
//
//		if(sKey == "80") {
//			if(oController._vContext.Extyn != "X") {
//				if(oController._vRetireDocumnetInfo && oController._vRetireDocumnetInfo.length > 0) {
//					if(oController._vContext.Docyn == "X") {
//						oRetireDocBtn.setVisible(false);
//						oRequestBtn.setVisible(false);
//						oPreviewBtn.setVisible(false);
//						oSaveBtn.setVisible(false);
//						
//						oRCRetda.setVisible(false);
//						oRCRetda_Text.setVisible(true);
//						oRCHndno.setEnabled(false);
//						oRCEmail.setEnabled(false);
//						if(oRCBankn) oRCBankn.setEnabled(false);
//						if(oRCIrpno) oRCIrpno.setEnabled(false);
//						oRCAddre.setEnabled(false);
//						
//						oDocDownloadPanel.setVisible(false);
//					} else {
//						oRCRetda.setVisible(true);
//						oRCRetda_Text.setVisible(false);
//						oRCHndno.setEnabled(true);
//						oRCEmail.setEnabled(true);
//						if(oRCBankn) oRCBankn.setEnabled(true);
//						if(oRCIrpno) oRCIrpno.setEnabled(true);
//						oRCAddre.setEnabled(true);
//						
//						if(oController._vContext.Appyn == "X") {
//							oRetireDocBtn.setVisible(false);
//							
//							if(oController._vContext.Reqyn == "X") {
//								oRequestBtn.setVisible(false);
//								oPreviewBtn.setVisible(false);
//								oSaveBtn.setVisible(false);
//								oDocDownloadPanel.setVisible(false);
//							} else {
//								oRequestBtn.setVisible(true);
//								oPreviewBtn.setVisible(true);
//								oSaveBtn.setVisible(true);
//								oDocDownloadPanel.setVisible(true);
//							}
//						} else {
//							oRequestBtn.setVisible(false);
//							oPreviewBtn.setVisible(false);
//							oRetireDocBtn.setVisible(false);
//							oSaveBtn.setVisible(true);
//							oDocDownloadPanel.setVisible(true);							
//						}
//					}
//				} else {
//					oRetireDocBtn.setVisible(false);
//					oRequestBtn.setVisible(false);
//					oPreviewBtn.setVisible(false);
//					oSaveBtn.setVisible(false);
//					
//					oRCRetda.setVisible(false);
//					oRCRetda_Text.setVisible(true);
//					oRCHndno.setEnabled(false);
//					oRCEmail.setEnabled(false);
//					if(oRCBankn) oRCBankn.setEnabled(false);
//					if(oRCIrpno) oRCIrpno.setEnabled(false);
//					oRCAddre.setEnabled(false);
//					oDocDownloadPanel.setVisible(false);
//				}
//			} else {
//				oRetireDocBtn.setVisible(false);
//				oRequestBtn.setVisible(false);
//				oPreviewBtn.setVisible(false);
//				oSaveBtn.setVisible(false);
//				
//				oRCRetda.setVisible(false);
//				oRCRetda_Text.setVisible(true);
//				oRCHndno.setEnabled(false);
//				oRCEmail.setEnabled(false);
//				if(oRCBankn) oRCBankn.setEnabled(false);
//				if(oRCIrpno) oRCIrpno.setEnabled(false);
//				oRCAddre.setEnabled(false);
//				oDocDownloadPanel.setVisible(false);
//			}
//		}
		if(sKey == "80") {
			if(oController._vContext.Extyn != "X") {
				if(oController._vRetireDocumnetInfo && oController._vRetireDocumnetInfo.length > 0) {
					
					if(oController._vContext.Docyn == "X") {
						oRetireDocBtn.setVisible(false);
						oRequestBtn.setVisible(false);
						oPreviewBtn.setVisible(false);
						oSaveBtn.setVisible(false);
						
						oRCRetda.setVisible(false);
						oRCRetda_Text.setVisible(true);
						oRCHndno.setEnabled(false);
						oRCEmail.setEnabled(false);
						oRCBankn.setEnabled(false);
						oRCIrpno.setEnabled(false);
						oRCAddre.setEnabled(false);
						
						oDocDownloadPanel.setVisible(false);
					} else {
						oRCRetda.setVisible(true);
						oRCRetda_Text.setVisible(false);
						oRCHndno.setEnabled(true);
						oRCEmail.setEnabled(true);
						oRCBankn.setEnabled(true);
						oRCIrpno.setEnabled(true);
						oRCAddre.setEnabled(true);
						
						if(oController._vContext.Appyn == "X") {
							oRetireDocBtn.setVisible(false);
							
							if(oController._vContext.Reqyn == "X") {
								oRequestBtn.setVisible(false);
								oPreviewBtn.setVisible(false);
								oSaveBtn.setVisible(false);
								oDocDownloadPanel.setVisible(false);
							} else {
								oRequestBtn.setVisible(true);
								oPreviewBtn.setVisible(true);
								oSaveBtn.setVisible(true);
								oDocDownloadPanel.setVisible(true);
							}
						} else {
							oRequestBtn.setVisible(false);
							oPreviewBtn.setVisible(false);
							oRetireDocBtn.setVisible(false);
							oSaveBtn.setVisible(true);
							oDocDownloadPanel.setVisible(true);							
						}
					}
				} else {
					oRetireDocBtn.setVisible(false);
					oRequestBtn.setVisible(false);
					oPreviewBtn.setVisible(false);
					oSaveBtn.setVisible(false);
					
					oRCRetda.setVisible(false);
					oRCRetda_Text.setVisible(true);
					oRCHndno.setEnabled(false);
					oRCEmail.setEnabled(false);
					oRCBankn.setEnabled(false);
					oRCIrpno.setEnabled(false);
					oRCAddre.setEnabled(false);
					oDocDownloadPanel.setVisible(false);
				}
			} else {
				oRetireDocBtn.setVisible(false);
				oRequestBtn.setVisible(false);
				oPreviewBtn.setVisible(false);
				oSaveBtn.setVisible(false);
				
				oRCRetda.setVisible(false);
				oRCRetda_Text.setVisible(true);
				oRCHndno.setEnabled(false);
				oRCEmail.setEnabled(false);
				oRCBankn.setEnabled(false);
				oRCIrpno.setEnabled(false);
				oRCAddre.setEnabled(false);
				oDocDownloadPanel.setVisible(false);
			}
		}
		/*
		 * 2016-02-01 KYJ
		 * WAVE2 는 UPLOAD DOCUMENT 가 등록되어 있지 않더라도  
		 * 수정 및 저장할 수 있겠금 처리 
		 */
		if(oController._vViewType != "9"){
			// 발령품의서를 생성하지 않고 퇴직 철회를 하지 않은 경우는 활성화 
			if(oController._vContext.Appyn != "X" && 
					oController._vContext.Extyn != "X" && 
						oController._vContext.Docyn != "X") {
				oSaveBtn.setVisible(true);
				if(oRCHndno) oRCHndno.setEnabled(true);
				if(oRCEmail) oRCEmail.setEnabled(true);
				if(oRCBankn) oRCBankn.setEnabled(true);
				if(oRCIrpno) oRCIrpno.setEnabled(true);
				if(oRCAddre) oRCAddre.setEnabled(true);
			}
		}
		
		if(oController._vAdmin == "X") {
			oSaveBtn.setVisible(false);
			oSurveyStartBtn.setVisible(false);
			oSurveyViewBtn.setVisible(false);
			oCheckRequesttn.setVisible(false);
			oCheckPrintBtn.setVisible(false);
			oRetireDocBtn.setVisible(false);
			oRequestBtn.setVisible(false);
			oPreviewBtn.setVisible(false);
		}
		
		
	},
	
	displaySearchUserDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		common.SearchUser2.oController = oController;
		
		oController._oUserControl = oEvent.getSource();
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch2", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		oController._AddPersonDialog.open();
	},
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		//var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ES_Table");
		//var mEmpSearchResult = oTable.getModel();
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		var vSelectedPersonCount = 0;
		
		var oCalPsg = sap.ui.getCore().byId(oController.PAGEID + "_CalPsg");
		var oPersg_Persk = sap.ui.getCore().byId(oController.PAGEID + "_Persg_Persk");
		var oStext = sap.ui.getCore().byId(oController.PAGEID + "_Stext");
		var oEntda = sap.ui.getCore().byId(oController.PAGEID + "_Entda");
		
		if(vEmpSearchResult && vEmpSearchResult.length) {
			for(var i=0; i<vEmpSearchResult.length; i++) {
				if(vEmpSearchResult[i].Chck == true) {
					vSelectedPersonCount++;
				}				
			}
			if(vSelectedPersonCount != 1) {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
				return;
			}
			
			for(var i=0; i<vEmpSearchResult.length; i++) {
				if(vEmpSearchResult[i].Chck == true) {
					if(oController._oUserControl) {
						oController._oUserControl.setValue(mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Ename"));
						oController._oUserControl.addCustomData(new sap.ui.core.CustomData({key : "Pernr", value : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pernr")}));
					
						if(oController._oUserControl.getId() == (oController.PAGEID + "_Pernr")) {
							oCalPsg.setText(mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Zzcaltltx") + " / "
									+ mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Zzpsgrptx"));
							
							oPersg_Persk.setText(mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pgtxt") + " / "
									+ mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pktxt"));
							
							oStext.setText(mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Fulln"));
							
							oEntda.setText(dateFormat.format(new Date(mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Entda"))));
						}
					}
				}				
			}
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
			return;
		}
		
		common.SearchUser2.onClose();
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Multi";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "MultiInput";
		
		if(!oController._SerachOrgDialog) {
			oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SerachOrgDialog);
		}
		oController._SerachOrgDialog.open();
	},
	
	onPressSurveyStart : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		common.Survey.initSurvey(oController, "N");
		
		if(!oController._SurveyDialog) {
			oController._SurveyDialog = sap.ui.jsfragment("zui5_hrxx_actretire2.fragment.RetireSurveyDialog", oController);
			oView.addDependent(oController._SurveyDialog);
		}
		oController._SurveyDialog.open();		
	},
	
	onPressSurveyView : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		common.Survey.initSurvey(oController, "V");
		
		if(!oController._SurveyDialog) {
			oController._SurveyDialog = sap.ui.jsfragment("zui5_hrxx_actretire2.fragment.RetireSurveyDialog", oController);
			oView.addDependent(oController._SurveyDialog);
		}
		oController._SurveyDialog.open();
	},
	
	setFinishedSurvey : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();		
		
		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd HH:mm:ss"});
		var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		oController._vContext.Suvyn = "X";
		oController._vContext.Rscdatim = dateFormat1.format(new Date());
		
		var oRetireSurveyFinished_PANEL = sap.ui.getCore().byId(oController.PAGEID + "_RetireSurveyFinished_PANEL");
		var oRetireSurveyFinished_Date = sap.ui.getCore().byId(oController.PAGEID + "_RetireSurveyFinished_Date");
		
		oRetireSurveyFinished_PANEL.setVisible(true);
		oRetireSurveyFinished_Date.setText(dateFormat1.format(new Date()));
		
		var oIconTabBar3 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_3"); //퇴직설문
		oIconTabBar3.setCount(dateFormat2.format(new Date()));
		
		var oSurveyStartBtn = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_START_BTN");
		var oSurveyViewBtn = sap.ui.getCore().byId(oController.PAGEID + "_SURVEY_VIEW_BTN");
		oSurveyStartBtn.setVisible(false);
		oSurveyViewBtn.setVisible(true);
	},
	
	onPressCheckRequest : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		var oAdjrg = sap.ui.getCore().byId(oController.PAGEID + "_Adjrg");
		var oAdjrgtx = sap.ui.getCore().byId(oController.PAGEID + "_Adjrgtx");	
		var oCheckRequestBtn = sap.ui.getCore().byId(oController.PAGEID + "_CHECK_REQUEST_BTN");
		var oCheckPrintBtn = sap.ui.getCore().byId(oController.PAGEID + "_CHECK_PRINT_BTN");
		
		if(oAdjrg) {
			if(oAdjrg.getSelectedKey() == "" || oAdjrg.getSelectedKey() == "0000") {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_RETIRE_CHECK_AREA"));
				return;
			}
		}
		
		var oItem = oAdjrg.getSelectedItem();
		if(oItem) {
			oController._vContext.Adjrgtx = oItem.getText();
		}
		
		var oCheckTable = sap.ui.getCore().byId(oController.PAGEID + "_Check_TABLE");

		var mRetirementSettlementSet = oCheckTable.getModel();
		var vRetirementSettlementSet = mRetirementSettlementSet.getProperty("/RetirementSettlementSet"); 
		
		if(vRetirementSettlementSet == null || vRetirementSettlementSet.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_RETIRE_CHECK_ITEM"));
			return;
		} else {
//			for(var i=0; i<vRetirementSettlementSet.length; i++) {
//				if(vRetirementSettlementSet[i].Ename == "") {
//					sap.m.MessageBox.alert(oBundleText.getText("MSG_RETIRE_CHECK_STAFF"));
//					return;
//				}
//			}
		}
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		
		var saveAfterProcess = function() {			
			oController._vContext.Setyn = "X";
			oAdjrgtx.setText(oController._vContext.Adjrgtx);
			
			oCheckRequestBtn.setVisible(false);
			oCheckPrintBtn.setVisible(true);
			
			oAdjrg.setVisible(false);
			oAdjrgtx.setVisible(true);
			
			for(var i=0; i<vRetirementSettlementSet.length; i++) {
				mRetirementSettlementSet.setProperty("/RetirementSettlementSet/" + i + "/Stfyn", "");
			}
		};
		
		var CreateProcess = function() {			
			var oPath = "/RetirementSettlementSet";
			
			var process_result = false;
			
			if(vRetirementSettlementSet && vRetirementSettlementSet.length) {
				for(var i=0; i<vRetirementSettlementSet.length; i++) {
					var createData = {};
					createData.Persa = oController._vPersa;
					createData.Appno = oController._vAppno;
					createData.Pernr = vRetirementSettlementSet[i].Pernr;
					createData.Adjrg = vRetirementSettlementSet[i].Adjrg;
					createData.Adjst = vRetirementSettlementSet[i].Adjst;
					createData.Stfnr = vRetirementSettlementSet[i].Stfnr;
					createData.Ename = vRetirementSettlementSet[i].Ename;

					try {
						oModel.create(
								oPath, 
								createData, 
								null,
							    function (oData, response) {
									process_result = true;
									common.Common.log("Sucess RetirementSettlementSet Create !!!");
							    },
							    function (oError) {
							    	var Err = {};
									if (oError.response) {
										Err = window.JSON.parse(oError.response.body);
										if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
											common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
										} else {
											common.Common.showErrorMessage(Err.error.message.value);
										}
									} else {
										common.Common.showErrorMessage(oError);
									}
									process_result = false;
							    }
					    );
					} catch(ex) {
						process_result = false;
						common.Common.log(ex);
					}
					
					if(!process_result) break;
				}
				
				if(!process_result) {
					if(oController.BusyDialog.isOpen()) {
						oController.BusyDialog.close();
					}
					return;
				}
				
				var oPath1 = "/RetirementApplicationAdministrationSet(Appno='" + oController._vAppno + "')";
				var updateData = {};
				updateData.Appno = oController._vAppno;
				updateData.Persa = oController._vPersa;
				updateData.Pernr = oController._vPernr;
				updateData.Retda = "\/Date(" + common.Common.setTime(new Date(oController._vContext.Retda)) + ")\/";
				updateData.Mailc = oController.makeEmailHtml(oController);
				updateData.Actty = "SU";
				try {
					oModel.update(
							oPath1, 
							updateData, 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess RetirementApplicationAdministrationSet Update !!!");
						    },
						    function (oError) {
						    	var Err = {};
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
										common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										common.Common.showErrorMessage(Err.error.message.value);
									}
								} else {
									common.Common.showErrorMessage(oError);
								}
								process_result = false;
						    }
				    );
				} catch(ex) {
					process_result = false;
					common.Common.log(ex);
				}
				
				if(oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}
				
				if(!process_result) return;
				
				sap.m.MessageBox.alert(oBundleText.getText("MSG_RETIRE_CHECK_REQUEST"), {
					title: oBundleText.getText("INFORMATION"),
					onClose : saveAfterProcess
				});
			} else {
				if(oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}
			}
		};
		
		if(!oController.BusyDialog) {			
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		setTimeout(CreateProcess, 300);				
	},
	
	onPressCheckPrint : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		//var vCheckRdURl = "http://hr-report.doosan.com/ReportingServer/ghris/resignConfirm_d.jsp";
		var vCheckRdURl = "http://hr-report.doosan.com/ReportingServer/ghris/resignConfirm.jsp";
		var html_url ="http://" + location.host + "/sap/bc/ui5_ui5/sap/zhrxx_common/RDJump.html?";
		html_url += "i_rdurl=" + vCheckRdURl + "&i_appno=" + oController._vAppno + "&i_persa=" + oController._vPersa;
		html_url += "&i_type=CHECK";		
		
		window.open(encodeURI(html_url));
	},
	
	onPressDocUpload : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		oController.onSaveDocUpload("DC");
	},
	
	onPressRequest : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		oController.onSaveDocUpload("AP");
	},
	
	onPressPreview : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		oController._vPreviewHtml = oController.makeDocEmailHtml(oController);
		
		if(!oController._PreviewDialog) {
			oController._PreviewDialog = sap.ui.jsfragment("zui5_hrxx_actretire2.fragment.RetireRequestPreview1", oController);
			oView.addDependent(oController._PreviewDialog);
		}
		oController._PreviewDialog.open();
	},
	
	
	onBeforeOpenHtmlDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		var oHtml = sap.ui.getCore().byId(oController.PAGEID + "_RRP_Html");
		oHtml.setContent(oController._vPreviewHtml);
	},
	
	onRRPClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		oController._PreviewDialog.close();
	},
	
	onSaveDocUpload : function(vActty) {
		//인사영역|신청번호|서류구분|순번|퇴직서류명|구분(‘01’)|파일명 
		//으로 구성하시면 됩니다.
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		
		var oRCRetda = sap.ui.getCore().byId(oController.PAGEID + "_RC_Retda");
		var oRCRetda_Text = sap.ui.getCore().byId(oController.PAGEID + "_RC_Retda_Text");
		
		var oRetda = sap.ui.getCore().byId(oController.PAGEID + "_Retda");
		var oRetda_Text = sap.ui.getCore().byId(oController.PAGEID + "_Retda_Text");
		
		var oRCHndno = sap.ui.getCore().byId(oController.PAGEID + "_RC_Hndno");
		var oRCEmail = sap.ui.getCore().byId(oController.PAGEID + "_RC_Email");
		var oRCBankn = sap.ui.getCore().byId(oController.PAGEID + "_RC_Bankn");
		var oRCIrpno = sap.ui.getCore().byId(oController.PAGEID + "_RC_Irpno");
		var oRCAddre = sap.ui.getCore().byId(oController.PAGEID + "_RC_Addre");
		if(vActty == "AP") {
			if(oRCHndno.getValue() == "") {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_HNDNO"));
				return;
			}
			
			if(oRCEmail.getValue() == "") {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_EMAIL"));
				return;
			}
			
			if(oRCBankn) {
				if(oRCBankn.getValue() == "") {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_IRP_BANK_NAME"));
					return;
				}
			}
			
			if(oRCBankn) {
				if(oRCIrpno.getValue() == "") {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_IRP_BANK_NO"));
					return;
				}
			}
			
			if(oRCAddre.getValue() == "") {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_ADDRESS"));
				return;
			}
		}
		
		var vAttachFileList = oController.getAttachFileList(oController);
		/*
		 * 2016-02-01 KYJ
		 * WAVE 1만 퇴직서류 체크를 한도록 처리
		 */
		if(oController._vViewType == "9"){
			if(vAttachFileList && vAttachFileList.length) {
				if(vAttachFileList.length != oController._vUploadFileCount) {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_RETIRE_FILE_SELECT"));
					return;
				}
			} else {
//				if(vActty != "DS") {
//					sap.m.MessageBox.alert(oBundleText.getText("MSG_RETIRE_NOT_DOC_FILE"));
//					return;
//				}
				sap.m.MessageBox.alert(oBundleText.getText("MSG_RETIRE_NOT_DOC_FILE"));
				return;
			}
		}
		
		
		var UploadFinshProcess = function() {
			var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
			var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd HH:mm:ss"});
			
			oRetda.setValue(oRCRetda.getValue());
			oRetda_Text.setText(dateFormat1.format(new Date(common.Common.setTime(new Date(oRCRetda.getValue())))));
			
			var oRetireDocBtn = sap.ui.getCore().byId(oController.PAGEID + "_RETIRE_DOC_BTN");
			var oRequestBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUEST_BTN");
			var oPreviewBtn = sap.ui.getCore().byId(oController.PAGEID + "_PREVIEW_BTN");
			var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVE_BTN");
			var oDocDownloadPanel = sap.ui.getCore().byId(oController.PAGEID + "_DocDownloadPanel");
			
			if(vActty == "DC") {
				oController._vContext.Docyn = "X";
				oController._vContext.Docdatim = dateFormat2.format(new Date());
				var oIconTabBar6 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_6"); //파일업로드
				oIconTabBar6.setCount(dateFormat1.format(new Date()));
				
				oRCRetda_Text.setText(dateFormat1.format(new Date(common.Common.setTime(new Date(oRCRetda.getValue())))));
				oRCRetda.setVisible(false);
				oRCRetda_Text.setVisible(true);
				
				if(oController._vRetireDocumnetInfo && oController._vRetireDocumnetInfo.length) {
					for(var i=0; i<oController._vRetireDocumnetInfo.length; i++) {
						var oDocumentFile = sap.ui.getCore().byId(oController.PAGEID  + "_DocumentFile" + (i+1));
						var oDocumentFileLinkInfo = sap.ui.getCore().byId(oController.PAGEID  + "_DocumentFile_LinkInfo" + (i+1));
						var oDocumentFileLinkDelBtn = sap.ui.getCore().byId(oController.PAGEID  + "_DocumentFile_LinkDelBtn" + (i+1));
						oDocumentFile.setVisible(false);
						oDocumentFileLinkInfo.setVisible(true);
						oDocumentFileLinkDelBtn.setVisible(false);
					}
				}
				
				oRetireDocBtn.setVisible(false);
				oRequestBtn.setVisible(false);
				oPreviewBtn.setVisible(false);
				oDocDownloadPanel.setVisible(false);
				
				oSaveBtn.setVisible(false);
				
				oRCRetda.setVisible(false);
				oRCRetda_Text.setVisible(true);
				oRCHndno.setEnabled(false);
				oRCEmail.setEnabled(false);
				if(oRCBankn) oRCBankn.setEnabled(false);
				if(oRCIrpno) oRCIrpno.setEnabled(false);
				oRCAddre.setEnabled(false);
				
			} else if(vActty == "DS") {
				oController._vContext.Docyn = "X";
				oController._vContext.Docdatim = dateFormat2.format(new Date());
				var oIconTabBar6 = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_6"); //파일업로드
				oIconTabBar6.setCount(dateFormat1.format(new Date()));
				/*
				 * 20160222 KYJ 퇴직서류 저장시 화면구성 REFRESH
				 */
				oRetireDocBtn.setVisible(false);
				oRequestBtn.setVisible(false);
				oPreviewBtn.setVisible(false);
				oSaveBtn.setVisible(false);
				
				oRCRetda.setVisible(false);
				oRCRetda_Text.setVisible(true);
				oRCHndno.setEnabled(false);
				oRCEmail.setEnabled(false);
				if(oRCBankn) oRCBankn.setEnabled(false);
				if(oRCIrpno) oRCIrpno.setEnabled(false);
				oRCAddre.setEnabled(false);
				
				oDocDownloadPanel.setVisible(false);
				
			} else if(vActty == "AP") {
				try {
					var vDocUri = "";
					oModel.read("/RetirementApplicationAdministrationSet(Appno='" + oController._vAppno + "')", 
							null, 
							null, 
							false,
							function(oData, oResponse) {					
								if(oData) {
									vDocUri = oData.Uri;
								}
							},
							function(oResponse) {
								common.Common.log(oResponse);
							}
					);
					
					if(vDocUri != "") {
						//결재자 지정 Window를 open 한다.
						var newwindow = window.open(vDocUri, 'SettleDoc', 'height=500,width=850');
						if(window.focus) { newwindow.focus(); }
						
		 				newwindow.onbeforeunload = function () {		 				    
		 				   sap.m.MessageBox.alert(oBundleText.getText("MSG_REQUEST_COMPLETE"), {
		 						title: oBundleText.getText("INFORMATION"),
		 						onClose : function() {
		 							
		 						}
		 					});
		 				};
					}
					
					sap.ui.getCore().getEventBus().publish("nav", "to", {
					      id : "zui5_hrxx_actretire2.RetireRequestList",
					      data : {
					      }
					});
				
				} catch(ex) {
					
				}
			}
		};
		
		var SaveFileProcess = function() {
			var process_result = true;
			
			try {
				console.log("SaveFileProcess");
				var oPath = "/RetirementApplicationAdministrationSet(Appno='" + oController._vAppno + "')";
				var updateData = {};
				updateData.Appno = oController._vAppno;
				updateData.Actty = vActty;
				updateData.Persa = oController._vPersa;
				updateData.Pernr = oController._vPernr;
				updateData.Retda = "\/Date(" + common.Common.getTime(oRCRetda.getValue()) + ")\/";
				
				updateData.Hndno = oRCHndno.getValue();
				updateData.Email = oRCEmail.getValue();
				updateData.Bankn = oRCBankn ? oRCBankn.getValue() : "";
				updateData.Irpno = oRCIrpno ? oRCIrpno.getValue() : "";
				updateData.Addre = oRCAddre.getValue();
				
				updateData.Mailc = oController.makeDocEmailHtml(oController);
				
				oModel.update(
						oPath, 
						updateData, 
						null,
					    function (oData, response) {
							process_result = true;
							common.Common.log("Sucess RetirementApplicationAdministrationSet Update !!!");
					    },
					    function (oError) {
					    	var Err = {};
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
									common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
								} else {
									common.Common.showErrorMessage(Err.error.message.value);
								}
							} else {
								common.Common.showErrorMessage(oError);
							}
							process_result = false;
					    }
			    );
			} catch(oException) {
				error_msg = oException.message;
				process_result = false;
				jQuery.sap.log.error("File upload failed:\n" + oException.message);
			}
			
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			if(process_result) {
				var vMsg = oBundleText.getText("MSG_RETIRE_FILE_SUCESS");
				if(vActty == "DC") vMsg = oBundleText.getText("MSG_RETIRE_FILE_SUCESS");
				else if(vActty == "DS") vMsg = oBundleText.getText("MSG_SAVE");
				else if(vActty == "AP") vMsg = oBundleText.getText("MSG_RETIRE_REQUEST");
				
				if(vActty != "AP") {
					sap.m.MessageBox.alert(vMsg, {
						title: oBundleText.getText("INFORMATION"),
						onClose : function() {
							UploadFinshProcess();
						}
					});
				} else {
					UploadFinshProcess();
				}				
			}
		};
		
		if(!oController.BusyDialog) {			
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new control.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new control.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		setTimeout(SaveFileProcess, 300);
	},
	
	onChangeFile : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		var vControlId = oControl.getId();
		
		var oCustomData = oControl.getCustomData();
		var vIndex = -1;
		if(oCustomData && oCustomData.length) {
			for(var i=0; i<oCustomData.length; i++) {
				if(oCustomData[i].getKey() == "Index") {
					vIndex = oCustomData[i].getValue();
				}
			}
		}
		
		if(!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_UPLOADING_FILE")}));
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_UPLOADING_FILE")}));
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		try {
			var UploadFinishedProcess = function() {
				oControl.setValue("");
				
				var vAttachFileList = oController.getAttachFileList(oController);
				if(vAttachFileList && vAttachFileList.length) {
					for(var i=0; i<vAttachFileList.length; i++) {
						var oDocumentFileLinkInfo = sap.ui.getCore().byId(oController.PAGEID  + "_DocumentFile_LinkInfo" + (vAttachFileList[i].Seqnr));
						oDocumentFileLinkInfo.setVisible(true);
						
						var oDocumentFileLink = sap.ui.getCore().byId(oController.PAGEID  + "_DocumentFile_Link" + (vAttachFileList[i].Seqnr));
						if(oDocumentFileLink) {
							oDocumentFileLink.setText(vAttachFileList[i].Fname);
							oDocumentFileLink.setHref(vAttachFileList[i].Uri);
						}
					}
				}
			};
			
			var _handleSuccess = function(data){
				if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}
				sap.m.MessageBox.alert(oBundleText.getText("MSG_UPLOADED_FILE"), {
					title : oBundleText.getText("INFORMATION"),
					onClose : UploadFinishedProcess});
			}; 
			var _handleError = function(data){
				if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}
				
				var errorMsg = null;
				if (data.responseText){
					errorMsg = /<message xml:lang="ko">(.*?)<\/message>/.exec(data.responseText);
				}else{
					errorMsg = oBundleText.getText("MSG_UPLOAD_FAIL");
				}
				if(errorMsg && errorMsg.length) {
					error_msg += errorMsg[1];
				} else {
					error_msg += errorMsg;
				}
				
				sap.m.MessageBox.alert(error_msg);
			};
			
			var files = jQuery.sap.domById(vControlId + "-fu").files;
			
			if (files) {
				var file = files[0];
				sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV").refreshSecurityToken();
				var oRequest = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV")._createRequest();
				var oHeaders = {
					"x-csrf-token": oRequest.headers['x-csrf-token'],
					"slug": oController._vPersa + "|" + oController._vAppno + "|" + oController._vRetireDocumnetInfo[vIndex].Attty  + "|" + oController._vRetireDocumnetInfo[vIndex].Seqnr + "|" + encodeURI(oController._vRetireDocumnetInfo[vIndex].Rdonm) + "|02|" + encodeURI(file.name)
				}; 
				
				jQuery.ajax({
					type: 'POST',
					async : false,
					url: "/sap/opu/odata/sap/ZHRXX_RETAPPL_SRV/FileSet/",
					headers: oHeaders,
					cache: false,
					contentType: file.type,
					processData: false,
					data: file,
					success: _handleSuccess,
					error: _handleError
				});
			}
		} catch(ex) {
			
		}
	}, 
	
	onChangeAdjrg : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		var oCheckTable = sap.ui.getCore().byId(oController.PAGEID + "_Check_TABLE");
		var oCheckColumnList = sap.ui.getCore().byId(oController.PAGEID + "_Check_COLUMNLIST");
		
		var oItem = oEvent.getParameter("selectedItem");
		var vArea = oItem.getKey();
		
		var mRetirementSettlementSet = oController.getRetirementSettlementSet(oController._vPersa, oController._vAppno, vArea);
		oCheckTable.setModel(mRetirementSettlementSet);
		oCheckTable.bindItems("/RetirementSettlementSet", oCheckColumnList);
	},
	
	onSelectStaff : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		var oCustomData = oControl.getCustomData();
		var vAppno = "";
		var vPersa = "";
		var vAdjrg = "";
		var vAdjst = "";
		for(var i=0; i<oCustomData.length; i++) {
			if(oCustomData[i].getKey() == "Appno") vAppno = oCustomData[i].getValue();
			else if(oCustomData[i].getKey() == "Adjst") vAdjst = oCustomData[i].getValue();
			else if(oCustomData[i].getKey() == "Persa") vPersa = oCustomData[i].getValue();
			else if(oCustomData[i].getKey() == "Adjrg") vAdjrg = oCustomData[i].getValue();
		}	
		
		oController._selectedAppno = vAppno;
		oController._selectedAdjst = vAdjst;
		oController._selectedPersa = vPersa;
		oController._selectedAdjrg = vAdjrg;
		
		if(!oController._StaffDialog) {
			oController._StaffDialog = sap.ui.jsfragment("zui5_hrxx_actretire2.fragment.CheckStaffDialog", oController);
			oView.addDependent(oController._StaffDialog);
		}
		oController._StaffDialog.open();
	},
	
	onAfterOpenCheckStaffDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_CheckStaff_TABLE");
		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_CheckStaff_COLUMNLIST");
		
//		var oAdjrg = sap.ui.getCore().byId(oController.PAGEID + "_Adjrg");
		
		oTable.setModel(sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV"));
		
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa));
		oFilters.push(new sap.ui.model.Filter("Adjrg", sap.ui.model.FilterOperator.EQ, oController._selectedAdjrg));
		oFilters.push(new sap.ui.model.Filter("Adjst", sap.ui.model.FilterOperator.EQ, oController._selectedAdjst));
		
		oTable.bindItems("/RetirementSettlementStaffSet", oColumnList, null, oFilters);
	},
	
	onCheckStaffConfirm : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_CheckStaff_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		
		var oCheckTable = sap.ui.getCore().byId(oController.PAGEID + "_Check_TABLE");
		var mRetirementSettlementSet = oCheckTable.getModel();
		var vRetirementSettlementSet = mRetirementSettlementSet.getProperty("/RetirementSettlementSet");
		
		if(vContexts && vContexts.length) {
			var vEname = vContexts[0].getProperty("Ename");
			var vStfnr = vContexts[0].getProperty("Stfnr");
			
			for(var i=0; i<vRetirementSettlementSet.length; i++) {
				if(vRetirementSettlementSet[i].Appno == oController._selectedAppno 
						&& vRetirementSettlementSet[i].Adjst == oController._selectedAdjst) {
					mRetirementSettlementSet.setProperty("/RetirementSettlementSet/" + i + "/Ename", vEname);
					mRetirementSettlementSet.setProperty("/RetirementSettlementSet/" + i + "/Stfnr", vStfnr);
					break;
				}
			}
		}
		
		if(oController._StaffDialog) oController._StaffDialog.close();
	},
	
	onCheckStaffClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		if(oController._StaffDialog) oController._StaffDialog.close();
	},
	
//	onDeleteFile : function(oEvent) {
//		
//	},
	
	onDeleteDocFile : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		
		var oControl = oEvent.getSource();
		var oCustomData = oControl.getCustomData();
		var vAttty = "";
		var vSeqnr = "";
		if(oCustomData && oCustomData.length) {
			for(var i=0; i<oCustomData.length; i++) {
				if(oCustomData[i].getKey() == "Attty") {
					vAttty = oCustomData[i].getValue();
				} else if(oCustomData[i].getKey() == "Seqnr") {
					vSeqnr = oCustomData[i].getValue();
				} 
			}
		}
		
		if(vAttty == "" || vSeqnr == "") {
			return;
		}		
		
		var oPath = "/RetirementDocumentSet(Appno='" + oController._vAppno + "',Attty='" + vAttty + "',Seqnr='" + vSeqnr + "')";
		var process_result = false;
		
		oModel.remove(
				oPath, 
				null,
			    function (oData, response) {
					process_result = true;
					common.Common.log("Sucess RetirementDocumentSet Delete !!!");
			    },
			    function (oError) {
			    	var Err = {};
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
							common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
						} else {
							common.Common.showErrorMessage(Err.error.message.value);
						}
					} else {
						common.Common.showErrorMessage(oError);
					}
					process_result = false;
			    }
	    );
		
		var AfterProcess = function() {
			if(oController._vRetireDocumnetInfo && oController._vRetireDocumnetInfo.length) {
				for(var i=0; i<oController._vRetireDocumnetInfo.length; i++) {
					if(oController._vRetireDocumnetInfo[i].Updyn == "X") {
						var oDocumentFileLinkInfo = sap.ui.getCore().byId(oController.PAGEID  + "_DocumentFile_LinkInfo" + (oController._vRetireDocumnetInfo[i].Seqnr));
						oDocumentFileLinkInfo.setVisible(false);
					}					
				}
			}
				
			var vAttachFileList = oController.getAttachFileList(oController);
			if(vAttachFileList && vAttachFileList.length) {
				for(var i=0; i<vAttachFileList.length; i++) {
					var oDocumentFileLinkInfo = sap.ui.getCore().byId(oController.PAGEID  + "_DocumentFile_LinkInfo" + (vAttachFileList[i].Seqnr));
					oDocumentFileLinkInfo.setVisible(true);
					
					var oDocumentFileLink = sap.ui.getCore().byId(oController.PAGEID  + "_DocumentFile_Link" + (vAttachFileList[i].Seqnr));
					if(oDocumentFileLink) {
						oDocumentFileLink.setText(vAttachFileList[i].Fname);
						oDocumentFileLink.setHref(vAttachFileList[i].Uri);
					}
				}
			}	
		};
		
		if(process_result) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_FILE_SUCESS"), {
				title: oBundleText.getText("INFORMATION"),
				onClose : AfterProcess
			});
		}
		
	},
	
	getRetirementSettlementSet : function(Persa, Appno, Area) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		
		if(Area == "0000") Area = "";
		
		var mRetirementSettlementSet = new sap.ui.model.json.JSONModel();
		var vRetirementSettlementSet = {RetirementSettlementSet : []};
		oModel.read("/RetirementSettlementSet/?$filter=Persa%20eq%20%27" + Persa + "%27"
				    + "%20and%20Appno%20eq%20%27" + Appno + "%27"
				    + "%20and%20Adjrg%20eq%20%27" + Area + "%27", 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results) {
						for(var i=0; i<oData.results.length; i++) {
							vRetirementSettlementSet.RetirementSettlementSet.push(oData.results[i]);
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		mRetirementSettlementSet.setData(vRetirementSettlementSet);
		
		return mRetirementSettlementSet;
	},
	
	makeEmailHtml : function(oController) {
		
//		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_Ename");
		var oCalPsg = sap.ui.getCore().byId(oController.PAGEID + "_CalPsg");
		var oStext = sap.ui.getCore().byId(oController.PAGEID + "_Stext");
		var oRetda = sap.ui.getCore().byId(oController.PAGEID + "_Retda_Text");
		
		var oCheckTable = sap.ui.getCore().byId(oController.PAGEID + "_Check_TABLE");
		var mRetirementSettlementSet = oCheckTable.getModel();
		var vRetirementSettlementSet = mRetirementSettlementSet.getProperty("/RetirementSettlementSet");
		var vCheckItems = "";
		for(var i=0; i<vRetirementSettlementSet.length; i++) {
			vCheckItems += vRetirementSettlementSet[i].Adjsttx + ", ";
		}
		if(vCheckItems.length > 2) {
			vCheckItems = vCheckItems.substring(0, vCheckItems.length - 2);
		}
		
		var info_tr_start = "[INFO_START]";
		var info_tr_end = "[INFO_END]";
		
		var html_url = "/sap/bc/ui5_ui5/sap/zhrxx_common/emailhtml/retire_check_notice_email.html";
		
		var tHtml = "";
		var request = $.ajax({ 
			  url: html_url,
			  cache: false,
			  async: false
		});
		
		request.done(function( html ) {
			tHtml = html;
		});
			 
		request.fail(function( jqXHR, textStatus ) {
			
		});
		
		if(tHtml == "") {
			console.log("Email HTML 파일이 없습니다.");
			return "";
		}
		
		var info_html = tHtml.substring(tHtml.indexOf(info_tr_start) + info_tr_start.length, tHtml.indexOf(info_tr_end));
		
		tHtml = tHtml.replace("[RETIRE_COMMENT]", oBundleText.getText("MSG_RETIRE_CHECK_EMAIL_COMMENT"));
		tHtml = tHtml.replace("[RETIRE_PERSON_TITLE]", oBundleText.getText("PANEL_RETIRE_TARGET"));
		
		var vHostName = top.location.host;
		var vGotoUrl = "http://" + vHostName + "/irj/portal?NavigationTarget=ROLES%3A%2F%2Fportal_content%2Fcom.sap.pct%2Fevery_user%2Fcom.sap.pct.erp.common.bp_folder%2Fcom.sap.pct.erp.common.roles%2Fcom.sap.pct.erp.common.erp_common%2Fcom.sap.pct.erp.common.lpd_start_url&RequestMethod=GET&System=SAP_ECC_HUMANRESOURCES&URLTemplate=%3CSystem.wap.WAS.protocol%3E%3A%2F%2F%3CSystem.wap.WAS.hostname%3E%3CSystem.wap.WAS.path%3E%2Fsap%2Fbc%2Fui5_ui5%2Fsap%2Fzhrxx_essapp%2FCheckList.html%3Fsap-client%3D%3CSystem.client%3E%26sap-language%3DKO&PrevNavTarget=navurl%3A%2F%2F6f464ca6e6d94cb8cf136287ca14c3e1&NavMode=3&CurrentWindowId=WID1436340482987";
		var vLink = "<a href='" + vGotoUrl + "' target='_new'>" + oBundleText.getText("GOTO_BTN") + "</a>";
		tHtml = tHtml.replace("[LINK]", vLink);
		
		var info_data = "";
		var tmp_info_html ="";
		
		//성명
		tmp_info_html = info_html;
		tmp_info_html = tmp_info_html.replace("[INFO_LABEL]", oBundleText.getText("ENAME"));
		tmp_info_html = tmp_info_html.replace("[INFO_DATA]", oController._vContext.Ename + "(" + oController._vContext.Adact + ")");
		info_data += tmp_info_html;
		
		//직위/직책
		tmp_info_html = info_html;
		tmp_info_html = tmp_info_html.replace("[INFO_LABEL]", oBundleText.getText("ZZCALPSG"));
		tmp_info_html = tmp_info_html.replace("[INFO_DATA]", oCalPsg.getText());
		info_data += tmp_info_html;
		
		//소속부서
		tmp_info_html = info_html;
		tmp_info_html = tmp_info_html.replace("[INFO_LABEL]", oBundleText.getText("STEXT"));
		tmp_info_html = tmp_info_html.replace("[INFO_DATA]", oStext.getText());
		info_data += tmp_info_html;
		
		//퇴직일
		tmp_info_html = info_html;
		tmp_info_html = tmp_info_html.replace("[INFO_LABEL]", oBundleText.getText("SCHE_RETDA"));
		tmp_info_html = tmp_info_html.replace("[INFO_DATA]", oRetda.getText());
		info_data += tmp_info_html;
		
		//체크항목
		tmp_info_html = info_html;
		tmp_info_html = tmp_info_html.replace("[INFO_LABEL]", oBundleText.getText("ADJST"));
		//tmp_info_html = tmp_info_html.replace("[INFO_DATA]", vCheckItems);
		tmp_info_html = tmp_info_html.replace("[INFO_DATA]", "##");
		info_data += tmp_info_html;
		
		var info_replace = tHtml.substring(tHtml.indexOf(info_tr_start), tHtml.indexOf(info_tr_end) + info_tr_end.length);
		tHtml = tHtml.replace(info_replace, info_data);
	
		return tHtml;
	},
	
	makeDocEmailHtml : function(oController) {
		
//		var html_url = "/sap/bc/ui5_ui5/sap/zhrxx_common/emailhtml/retire_doc_email_" + gMolga + ".html";
		/*
		 *  WAVE2 반영
		 *  2016-01-22 KYJ
		 *  VIEW TYPE에 맞는 HTML소스를  불러온다.
		 */
		var tViewType ;
		tViewType = oController._vViewType ;
		if(oController._vViewType == "3") tViewType = 2;
		var html_url = "/sap/bc/ui5_ui5/sap/zhrxx_common/emailhtml/retire_doc_email_" + tViewType + ".html";
		console.log(html_url);
		var tHtml = "";
		var request = $.ajax({ 
			  url: html_url,
			  cache: false,
			  async: false
		});
		
		request.done(function( html ) {
			tHtml = html;
		});
			 
		request.fail(function( jqXHR, textStatus ) {
			
		});
		
		if(tHtml == "") {
			console.log("Email HTML 파일이 없습니다.");
			return "";
		}
		
		var oRCRetda = sap.ui.getCore().byId(oController.PAGEID + "_RC_Retda");
		var oRCHndno = sap.ui.getCore().byId(oController.PAGEID + "_RC_Hndno");
		var oRCEmail = sap.ui.getCore().byId(oController.PAGEID + "_RC_Email");
		var oRCBankn = sap.ui.getCore().byId(oController.PAGEID + "_RC_Bankn");
		var oRCIrpno = sap.ui.getCore().byId(oController.PAGEID + "_RC_Irpno");
		var oRCAddre = sap.ui.getCore().byId(oController.PAGEID + "_RC_Addre");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		tHtml = tHtml.replace("[RETIRE_TITLE1]", oBundleText.getText("APERN"));
		
		tHtml = tHtml.replace("[ITEM_LABEL11]", oBundleText.getText("ENAME"));
		tHtml = tHtml.replace("[ITEM_DATA11]", oController._vContext.Ename);
		
		tHtml = tHtml.replace("[ITEM_LABEL12]", oBundleText.getText("ZZCALTL"));
		tHtml = tHtml.replace("[ITEM_DATA12]", oController._vContext.Zzcaltltx);
		
		tHtml = tHtml.replace("[ITEM_LABEL13]", oBundleText.getText("COMPANY"));
		tHtml = tHtml.replace("[ITEM_DATA13]", oController._vContext.Pbtxt);
		
		tHtml = tHtml.replace("[ITEM_LABEL14]", oBundleText.getText("FGBDT"));
		var vGbdat = "";
		if(oController._vContext.Gbdat != null) {
			vGbdat = dateFormat.format(new Date(common.Common.setTime(new Date(oController._vContext.Gbdat))));
		}
		tHtml = tHtml.replace("[ITEM_DATA14]", vGbdat);
		
		tHtml = tHtml.replace("[ITEM_LABEL15]", oBundleText.getText("FULLN"));
		tHtml = tHtml.replace("[ITEM_DATA15]", oController._vContext.Fulln);
		
		tHtml = tHtml.replace("[RETIRE_TITLE2]", oBundleText.getText("APPL_HISTORY"));
		
		tHtml = tHtml.replace("[ITEM_LABEL21]", oBundleText.getText("SCHE_RETDA"));
		tHtml = tHtml.replace("[ITEM_DATA21]", dateFormat.format(new Date(common.Common.setTime(new Date(oRCRetda.getValue())))));
		
		tHtml = tHtml.replace("[ITEM_LABEL22]", oBundleText.getText("RETRS"));
		tHtml = tHtml.replace("[ITEM_DATA22]", oController._vContext.Mgtxt);
		
		tHtml = tHtml.replace("[ITEM_LABEL23]", oBundleText.getText("IRP_BANK_NAME"));
		tHtml = tHtml.replace("[ITEM_DATA23]", oRCBankn.getValue());
			
		tHtml = tHtml.replace("[ITEM_LABEL24]", oBundleText.getText("IRP_BANK_NO"));
		tHtml = tHtml.replace("[ITEM_DATA24]", oRCIrpno.getValue());
		
		tHtml = tHtml.replace("[ITEM_LABEL25]", oBundleText.getText("HNDNO"));
		tHtml = tHtml.replace("[ITEM_DATA25]", oRCHndno.getValue());
		
		tHtml = tHtml.replace("[ITEM_LABEL26]", oBundleText.getText("EMAIL"));
		tHtml = tHtml.replace("[ITEM_DATA26]", oRCEmail.getValue());
		
		tHtml = tHtml.replace("[ITEM_LABEL27]", oBundleText.getText("ADDRS"));
		tHtml = tHtml.replace("[ITEM_DATA27]", oRCAddre.getValue());
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		
		var oReadParm = [];
		oReadParm.push("$filter=Persa eq '" + oController._vPersa + "' and Appno eq '" + oController._vAppno + "'");
		var fileList = [];
		oModel.read("/RetirementDocumentSet", 
				null, 
				oReadParm, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							fileList.push(oData.results[i]);
						}
					}
				},
				function(oError) {
					common.Common.log(oError);
				}
		);
		
		tHtml = tHtml.replace("[RETIRE_TITLE3]", oBundleText.getText("ATTACHFILE"));
		
		var file_tr_start = "[FILE_START]";
		var file_tr_end = "[FILE_END]";
		
		var file_html = tHtml.substring(tHtml.indexOf(file_tr_start) + file_tr_start.length, tHtml.indexOf(file_tr_end));
		
		var file_data = "";
		var tmp_file_html ="";
		
		if(fileList.length > 0) {
			for(var i=0; i<fileList.length; i++) {
				tmp_file_html = file_html;
				tmp_file_html = tmp_file_html.replace("[FILE_LABEL]", fileList[i].Rdonm);
				tmp_file_html = tmp_file_html.replace("[FILE_REF]", fileList[i].Uri);
				tmp_file_html = tmp_file_html.replace("[FILE_DATA]", fileList[i].Fname);
				file_data += tmp_file_html;
			}
		}
		
		var info_replace = tHtml.substring(tHtml.indexOf(file_tr_start), tHtml.indexOf(file_tr_end) + file_tr_end.length);
		tHtml = tHtml.replace(info_replace, file_data);
	
		return tHtml;
	},
	
	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_DATE"),{
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	},
	
	onChangeStaff : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		if(oEvent.getParameter("value") == "") {
			var oControl = oEvent.getSource();
			var oCustomData = oControl.getCustomData();
			var vAdjrg = "";
			var vAdjst = "";
			for(var i=0; i<oCustomData.length; i++) {
				if(oCustomData[i].getKey() == "Adjst") vAdjst = oCustomData[i].getValue();
				else if(oCustomData[i].getKey() == "Adjrg") vAdjrg = oCustomData[i].getValue();
			}
			 
			
			var oCheckTable = sap.ui.getCore().byId(oController.PAGEID + "_Check_TABLE");
			var mRetirementSettlementSet = oCheckTable.getModel();
			var vRetirementSettlementSet = mRetirementSettlementSet.getProperty("/RetirementSettlementSet"); 
			
			for(var i=0; i<vRetirementSettlementSet.length; i++) {
				if(vRetirementSettlementSet[i].Adjrg == vAdjrg && 
					vRetirementSettlementSet[i].Adjst == vAdjst) {
					mRetirementSettlementSet.setProperty("/RetirementSettlementSet/" + i + "/Stfnr", "");
					mRetirementSettlementSet.setProperty("/RetirementSettlementSet/" + i + "/Ename", "");
				}
			}
		}
		
	},
	
	displayAusSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		var mOneCodeModel =sap.ui.getCore().getModel("CodeListModel");
		mOneCodeModel.setData(null);
		var vOneCodeList = {EmpCodeListSet : []};
		
//		var oCustomData = oEvent.getSource().getCustomData();
//		var Fieldname = oCustomData[0].getKey();
//		
		var oModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
		var filterString = "/?$filter=Field%20eq%20%27" + "AUS01" + "%27";
		filterString += "%20and%20";
		filterString += "Persa%20eq%20%27" + oController._vPersa + "%27";
		
		oModel.read("/EmpCodeListSet/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27", 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							var vOneData = {};
							vOneData.Ecode = oData.results[i].Massg;
							vOneData.Etext = oData.results[i].Mgtxt;
							vOneCodeList.EmpCodeListSet.push(vOneData);
						}
						
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);

		mOneCodeModel.setData(vOneCodeList);
		
		common.SearchCode.oController = oController;
		common.SearchCode.vCallControlId = oEvent.getSource().getId();
		
		if(!oController._CodeSearchDialog) {
			oController._CodeSearchDialog = sap.ui.jsfragment("fragment.CodeSearch", oController);
			oView.addDependent(oController._CodeSearchDialog);
		}
		oController._CodeSearchDialog.open();
		
		var oDialog = sap.ui.getCore().byId(oController.PAGEID + "_FCS_Dialog");
		oDialog.setTitle(oBundleText.getText(Fieldname.toUpperCase()));
	},
	
	displayCodeSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire2.UpdateRetireRequest");
		var oController = oView.getController();
		
		var mOneCodeModel =sap.ui.getCore().getModel("CodeListModel");
		mOneCodeModel.setData(null);
		var vOneCodeList = {EmpCodeListSet : []};
		
		var oCustomData = oEvent.getSource().getCustomData();
		var Fieldname = oCustomData[0].getKey();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		
		oModel.read("/RetirementReasonSet/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27", 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							var vOneData = {};
							vOneData.Ecode = oData.results[i].Massg;
							vOneData.Etext = oData.results[i].Mgtxt;
							vOneCodeList.EmpCodeListSet.push(vOneData);
						}
						
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);

		mOneCodeModel.setData(vOneCodeList);
		
		common.SearchCode.oController = oController;
		common.SearchCode.vCallControlId = oEvent.getSource().getId();
		
		if(!oController._CodeSearchDialog) {
			oController._CodeSearchDialog = sap.ui.jsfragment("fragment.CodeSearch", oController);
			oView.addDependent(oController._CodeSearchDialog);
		}
		oController._CodeSearchDialog.open();
		
		var oDialog = sap.ui.getCore().byId(oController.PAGEID + "_FCS_Dialog");
		oDialog.setTitle(oBundleText.getText(Fieldname.toUpperCase()));
	},
	
	onLiveChange : function(oEvent) {
		var s = oEvent.getParameter("value");
		if(s == "") {
			oEvent.getSource().removeAllCustomData();
		}
	},
	
	getAttachFileList : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		
		var oReadParm = [];
		oReadParm.push("$filter=Persa eq '" + oController._vPersa + "' and Appno eq '" + oController._vAppno + "'");
		
		var AttachFileList = [];
		oModel.read("/RetirementDocumentSet", 
				null, 
				oReadParm, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							AttachFileList.push(oData.results[i]);
						}
					}
				},
				function(oError) {
					AttachFileList = null;
					common.Common.log(oError);
				}
		);
		
		return AttachFileList;
	}
	
});
