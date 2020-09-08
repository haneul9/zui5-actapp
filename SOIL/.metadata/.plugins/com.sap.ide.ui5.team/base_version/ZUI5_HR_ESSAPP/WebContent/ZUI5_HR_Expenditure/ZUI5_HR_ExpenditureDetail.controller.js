jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.MandateAction");

sap.ui.controller("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail
	 */

	PAGEID : "ZUI5_HR_ExpenditureDetail",
	
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_MandateJSonModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vAppno : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "HR03",
	_ObjList : [],
	BusyDialog : new sap.m.BusyDialog(),

	
	onInit : function() {

		//if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		//};

		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this)
		});

		this.getView().addEventDelegate({
			onAfterShow : jQuery.proxy(function(evt) {
				this.onAfterShow(evt);
			}, this),
		});

		var bus = sap.ui.getCore().getEventBus();
		bus.subscribe("app", "OpenWindow", this.SmartSizing,
				this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing,
				this);
		
		// Target Layout 추가 구성
		this.onSetTargetMatrix();
	},

	onBeforeShow : function(oEvent) {
		var oController = this;
		
		var vAppno ="" , vZappStatAl = "", vRegno = "";
		oController._vAppno = "";
		
		oController._ApprovalLineModel.setData(null);
		common.ApprovalLineAction.oController = oController;
		common.MandateAction.oController = oController;
		
		var vFromPageId = "";
		if(oEvent) {
			oController._vAppno = vAppno = oEvent.data.Appno;
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		var oPortalTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		
		// 초기화
		var Datas = { Data : {}} ;
		var oDetailData = {Data : {}};
		if(vAppno != ""){ // 수정 및 조회
			oController.BusyDialog.open();
			var oModel = sap.ui.getCore().getModel("ZHR_CONTY_SRV");
			var vErrorMessage = "", vError = "";
			
			var oPath = "/ExpensesApplSet?$filter=Appno eq '" + vAppno + "' and Prcty eq 'D'";
			oModel.read(oPath, null, null, false,
					function(data, res){
						
						if(data.results[0].ZpayBet * 1 == 0){
							data.results[0].ZpayBet = "";
						}else{
							data.results[0].ZpayBet = common.Common.numberWithCommas(data.results[0].ZpayBet);
						}
					
						if(data.results[0].ZbacBet * 1 == 0){
							data.results[0].ZbacBet = "";
						}else{
							data.results[0].ZbacBet = common.Common.numberWithCommas(data.results[0].ZbacBet);
						}
						// 상태
						vZappStatAl = data.results[0].ZappStatAl;
					
						// 경조 유형
						data.results[0].Absbg =  common.Common.checkNull(data.results[0].Absbg) ? "" : dateFormat.format(new Date(common.Common.setTime(data.results[0].Absbg)));
						data.results[0].Absed =  common.Common.checkNull(data.results[0].Absed) ? "" : dateFormat.format(new Date(common.Common.setTime(data.results[0].Absed)));
						data.results[0].Conrdate =  dateFormat.format(new Date(common.Common.setTime(data.results[0].Conrdate)));
						
						if(data.results[0].BabyCnt * 1 > 1){
							data.results[0].Babytp = 1;
						}else{
							data.results[0].Babytp = 0;
						}
						
						oDetailData.Data = data.results[0];	

					}, function(Res){
						vError = "E";
						if(Res.response.body){
							vErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(vErrorMessage);
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							}
						}
					}
			);
		}
		
		// 공통적용사항 Start
		// 상세화면 Binding
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = vZappStatAl;
		oController._DetailJSonModel.setData(oDetailData);
		// 대상자 조회
		common.TargetUser.oController = oController;
		common.TargetUser.onSetTarget(oController);
		// 신청자 조회
		common.ApplyUser.oController = oController;
		common.ApplyUser.onSetApplicant(oController);
		// 진행상태 신청자, 대상자 Model 업데이트
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", vZappStatAl);
		oController._ApplyJSonModel.setProperty("/Data/ZappStatAl", vZappStatAl);
		// 신청안내
		common.ApplyInformation.onSetApplyInformation(oController);
		
		// 위임자 조회
		common.MandateAction.onSearchMandate(oController);
		
		// 공통적용사항 End
		
		// Appno 조회
		if(oController._vAppno == ""){
			oController.BusyDialog.open();
			var oModel = sap.ui.getCore().getModel("ZHR_CONTY_SRV");
			var vErrorMessage = "", vError = "";
			
			var oPath = "/ExpensesApplSet?$filter=Prcty eq 'I'";
			oModel.read(oPath, null, null, false,
					function(data, res){
						oController._vAppno = data.results[0].Appno ;
						oController._DetailJSonModel.setProperty("/Data/Appno", oController._vAppno);
					}, function(Res){
						vError = "E";
						if(Res.response.body){
							vErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(vErrorMessage);
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							}
						}
					}
			);
						
			if(vError == "E"){
				sap.m.MessageBox.alert(vErrorMessage, {
					onClose : function() {
						oController.BusyDialog.close();
						oController.onBack();
					}
				});
				return ;
			}
			
		}else{
			//Persa 조회
			oController._DetailJSonModel.setProperty("/Data/Persa",oController._TargetJSonModel.getProperty("/Data/Persa"));
		}
		// 관계 List 조회
		oController.onSetConresnList(oController);
		// 휴가일수 계산
		oController.onChangeEndda();
//		oController.onChangeDate();
		
		// 결재 상태에 따라 Page Header Text 수정		
		if(vZappStatAl == "" || !vZappStatAl){
			oPortalTitle.setText(oBundleText.getText("LABEL_1180") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1180:경조금 신청
		} else if(vZappStatAl == "10"){
			oPortalTitle.setText(oBundleText.getText("LABEL_1180") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1180:경조금 신청
		} else {
			oPortalTitle.setText(oBundleText.getText("LABEL_1180") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1180:경조금 신청
		}

			// 결재선 
		common.ApprovalLineAction.setApprovalLineModel(oController);
		// 경조구분에 따른 Row Display 설정
		oController.setMultipleBirthLine(oController);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		
		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureList",
			      data : { }
				}
			);	
		}
		
	},
		
	onSetTargetMatrix : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		var oTargetMatrix = sap.ui.getCore().byId(oController.PAGEID + "_TargetMatrix");
		
		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
			height : "30px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_0003")}).addStyleClass("FontFamilyBold")	// 결재선
				}).addStyleClass("MatrixLabel"),
				new sap.ui.commons.layout.MatrixLayoutCell({
					colSpan : 3,
					content : new sap.m.Toolbar({
						content : [new sap.m.Text({text : "{ApprEnames}"}).addStyleClass("FontFamily")]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData")
				.setModel(oController._DetailJSonModel).bindElement("/Data")
			]
		});
		
		oTargetMatrix.addRow(oRow);
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
	},
	
	// 경조유형 변경시 지급액 계산
	onChangeConcode : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail");
			oController = oView.getController(),
			vConcode = oController._DetailJSonModel.getProperty("/Data/Concode");
			
		// Data Clear
		oController._DetailJSonModel.setProperty("/Data/Conresn", "");
		oController._DetailJSonModel.setProperty("/Data/ZpayBet", "");
		oController._DetailJSonModel.setProperty("/Data/ZbacBet", "");
		oController._DetailJSonModel.setProperty("/Data/Absbg", "");
		oController._DetailJSonModel.setProperty("/Data/Absed", ""); 
		oController._DetailJSonModel.setProperty("/Data/Hdays", ""); 
		oController._DetailJSonModel.setProperty("/Data/ZholDay", "");
		oController._DetailJSonModel.setProperty("/Data/SZholDay", "");
		
		
		oController.onSetConresnList(oController);
		
		oController.setMultipleBirthLine(oController);
		
		if(vConcode == "160"){
			oController._DetailJSonModel.setProperty("/Data/BabyCnt", "1");
			oController._DetailJSonModel.setProperty("/Data/Babytp", 0); // 단태아 초기
			oController.onCalculationPay();
		}
	},
	// 관계 ( 경조사유 ) Item Setting
	onSetConresnList : function(oController){
		var oConresn = sap.ui.getCore().byId(oController.PAGEID + "_Conresn"),
		vConcode = oController._DetailJSonModel.getProperty("/Data/Concode"),
		vConresn  = oController._DetailJSonModel.getProperty("/Data/Conresn"),
		errData = {},
		oModel = sap.ui.getCore().getModel("ZHR_CONTY_SRV");
		
		oConresn.destroyItems();
		
		if(!common.Common.checkNull(vConcode)){
			oModel.read("/ConresnListSet", {
				async : false,
				filters : [
					new sap.ui.model.Filter('Concode', sap.ui.model.FilterOperator.EQ, vConcode)
				],
				success : function(data, res) {
					if(data && data.results.length){
						for(var i=0; i<data.results.length; i++){
							oConresn.addItem(new sap.ui.core.Item({
												key : data.results[i].Conresn, 
												text : data.results[i].Conretx,
												customData : [ new sap.ui.core.CustomData({key : "ZholDay", value : data.results[i].ZholDay})] 
										
											}));
							// 기존 선택된 관계의 허용 휴가일수를 저장
							if(!common.Common.checkNull(vConresn) && vConresn == data.results[i].Conresn){
								oController._DetailJSonModel.setProperty("/Data/SZholDay", data.results[i].ZholDay);
							}
						}
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
						oController.BusyDialog.close();
						oController.onBack();
					}
				});
				return ;
			}
		}
	},
	
	// 관계 ( 경조사유 ) 변경 Event
	onChangeConresn : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail"),
		    oController = oView.getController(),
		    oConresn = sap.ui.getCore().byId(oController.PAGEID + "_Conresn");
		
		if(oController._DetailJSonModel.getProperty("/Data/Persa") != "7000"){
			if(oConresn.getSelectedItem()){
				oController._DetailJSonModel.setProperty("/Data/SZholDay", oConresn.getSelectedItem().getCustomData()[0].getValue());
			}else{
				oController._DetailJSonModel.setProperty("/Data/SZholDay",0);
				oController._DetailJSonModel.setProperty("/Data/Absbg","");
				oController._DetailJSonModel.setProperty("/Data/Absed","");
			}
		}
		oController.onChangeConrdate();
		oController.onCalculationPay();
		oController.onChangeBegda();
		
	},
	
	setMultipleBirthLine : function(oController){	
		var vConcode = oController._DetailJSonModel.getProperty("/Data/Concode");
		var oMultipleBirthLine = sap.ui.getCore().byId(oController.PAGEID + "_MultipleBirthLine");
		// 출산-본인/배우자
		if(vConcode == "160")	oMultipleBirthLine.removeStyleClass("DisplayNone"); 
		else oMultipleBirthLine.addStyleClass("DisplayNone");
	},
	
	
	onChangeBegda : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		var vAbsbg = oController._DetailJSonModel.getProperty("/Data/Absbg"),
		    vStandardHoldays = oController._DetailJSonModel.getProperty("/Data/SZholDay"),
		    vPersa = oController._DetailJSonModel.getProperty("/Data/Persa");
		if(vPersa == "7000"){
			oController._DetailJSonModel.setProperty("/Data/Absbg", "");
			oController._DetailJSonModel.setProperty("/Data/Absed", "");
			oController._DetailJSonModel.setProperty("/Data/Hdays", "");
			oController._DetailJSonModel.setProperty("/Data/ZholDay", 0);
			return ;
		}
		
		if(!vAbsbg || vAbsbg == ""){
			oController._DetailJSonModel.setProperty("/Data/Hdays", "");
			oController._DetailJSonModel.setProperty("/Data/ZholDay", 0);
			return ;
		}
		
		var vHolday = 0;
		if(!common.Common.checkNull(vStandardHoldays)){
			vHolday = vStandardHoldays * 1 ;
			var strDate1 = vAbsbg;
			var arr1 = strDate1.split('-');
			var dat1 = new Date(arr1[0], arr1[1]-1, arr1[2]);
			dat1.setDate(dat1.getDate() +  vHolday -1);
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var vAbsed = dateFormat.format(dat1);
			
			
			oController._DetailJSonModel.setProperty("/Data/Absed", vAbsed); 
			oController._DetailJSonModel.setProperty("/Data/Hdays", "(" + vHolday + "일)");
			oController._DetailJSonModel.setProperty("/Data/ZholDay", vHolday);
		}else{
			oController._DetailJSonModel.setProperty("/Data/Hdays", "");
			oController._DetailJSonModel.setProperty("/Data/ZholDay", 0);
		} 
	},
	
	onChangeEndda : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		var vAbsbg = oController._DetailJSonModel.getProperty("/Data/Absbg");
		var vAbsed = oController._DetailJSonModel.getProperty("/Data/Absed");
		var vPersa = oController._DetailJSonModel.getProperty("/Data/Persa");
		
		if(vPersa == "7000"){
			oController._DetailJSonModel.setProperty("/Data/Absbg", "");
			oController._DetailJSonModel.setProperty("/Data/Absed", "");
			oController._DetailJSonModel.setProperty("/Data/Hdays", "");
			oController._DetailJSonModel.setProperty("/Data/ZholDay", 0);
			return ;
		}
		
		if(!vAbsbg || vAbsbg == ""){
			oController._DetailJSonModel.setProperty("/Data/Hdays", "");
			oController._DetailJSonModel.setProperty("/Data/ZholDay", 0);
			return ;
		}

		var vHolday = 0;
		var strDate1 = vAbsbg;
		var arr1 = strDate1.split('-');
		var dat1 = new Date(arr1[0], arr1[1]-1, arr1[2]);
		
		var endDate1 = vAbsed;
		var arr2 = endDate1.split('-');
		var dat2 = new Date(arr2[0], arr2[1]-1, arr2[2]);
		
		var betweenDay = (dat2.getTime()-dat1.getTime())/1000/60/60/24 + 1;  
		oController._DetailJSonModel.setProperty("/Data/Hdays", "(" + betweenDay + "일)");
		oController._DetailJSonModel.setProperty("/Data/ZholDay", betweenDay);
	},
	
	onChangeConrdate : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		// 경조 휴가일이 7일 인 건은 사유발생일을 경조휴가일 시작일자로 변경
		var vDays = oController._DetailJSonModel.getProperty("/Data/SZholDay");
		var vConrdate = oController._DetailJSonModel.getProperty("/Data/Conrdate");
		if(!common.Common.checkNull(vConrdate) && !common.Common.checkNull(vDays) && vDays == "7"){
			oController._DetailJSonModel.setProperty("/Data/Absbg", vConrdate);
			oController.onChangeBegda();
		}
		oController.onCalculationPay();
	},
	
	
	// 경조 금액 조회
	onCalculationPay : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		
		var vConresn = oController._DetailJSonModel.getProperty("/Data/Conresn"); // 경조유형
		var vConcode = oController._DetailJSonModel.getProperty("/Data/Concode"); // 경조사유
		var vBabyCnt = oController._DetailJSonModel.getProperty("/Data/BabyCnt"); // 다태아
		var vConrdate = oController._DetailJSonModel.getProperty("/Data/Conrdate"); // 사유발생일
		var vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr"); // 대상자
		var vEncid = oController._DetailJSonModel.getProperty("/Data/Encid"); // 대상자
		
		
		
		var vCheck = "", vZpayBet = "", vZbacBet = "";
		if(!vConresn || vConresn == "") vCheck = "X";
		else if(!vConcode || vConcode == "") vCheck = "X";
		else if(!vConrdate || vConrdate == "") vCheck = "X";
		
		if(!vBabyCnt) vBabyCnt = "";
		
		if(vCheck == "X"){
			oController._DetailJSonModel.setProperty("/Data/ZpayBet",""); // 경조금액
			oController._DetailJSonModel.setProperty("/Data/ZbacBet",""); // 기본급
			
		}else{
			var oModel = sap.ui.getCore().getModel("ZHR_CONTY_SRV");
			var oPath = "/ExpensesCalcSet?$filter=Encid eq '" + encodeURIComponent(vEncid) + "'";
			oPath += " and Conresn eq '" + vConresn + "'";
			oPath += " and BabyCnt eq '" + vBabyCnt + "'";
			oPath += " and Concode eq '" + vConcode + "'";
			oPath += " and Conrdate eq datetime'" + vConrdate + "T00:00:00'";
			
			oModel.read(oPath, null, null, false, 
					function(data,res){
						if(data && data.results.length){
							if(data.results[0].ZpayBet * 1 == 0){
								oController._DetailJSonModel.setProperty("/Data/ZpayBet",""); // 경조금액
							}else{
								oController._DetailJSonModel.setProperty("/Data/ZpayBet",common.Common.numberWithCommas(data.results[0].ZpayBet)); // 경조금액
							}
							
							if(data.results[0].ZbacBet * 1 == 0){
								oController._DetailJSonModel.setProperty("/Data/ZbacBet",""); // 기본급
							}else{
								oController._DetailJSonModel.setProperty("/Data/ZbacBet",common.Common.numberWithCommas(data.results[0].ZbacBet)); // 기본급
							}
							oController._DetailJSonModel.setProperty("/Data/Payrt", data.results[0].Payrt); 
						}
					}, function(Res){
						if(Res.response.body){
							ErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							}
						}
						oController._DetailJSonModel.setProperty("/Data/ZpayBet",""); // 경조금액
						oController._DetailJSonModel.setProperty("/Data/ZbacBet",""); // 기본급
						oController._DetailJSonModel.setProperty("/Data/Payrt", ""); 
						sap.m.MessageBox.error(ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
						return;
					}
			);
		}
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController){
		oController._DetailJSonModel.setProperty("/Data/Conresn", "");   // 경조사유
		oController._DetailJSonModel.setProperty("/Data/Conrdate", "");  // 실제 경조일
		oController._DetailJSonModel.setProperty("/Data/ZholDay", "");   // 휴가일수
		oController._DetailJSonModel.setProperty("/Data/ZbacBet", ""); 	 // 기본급
		oController._DetailJSonModel.setProperty("/Data/ZpayBet", "");   // 지급액
		oController._DetailJSonModel.setProperty("/Data/Absbg", "");     // 휴가 신청일
		oController._DetailJSonModel.setProperty("/Data/Absed", "");     // 휴가 종료일
		oController._DetailJSonModel.setProperty("/Data/BabyCnt", "");   //다태아
		oController._DetailJSonModel.setProperty("/Data/Conresn", "");   //관계
		oController._DetailJSonModel.setProperty("/Data/Conplace", "");   //장소
		oController._DetailJSonModel.setProperty("/Data/Fname", "");   //신청대상
		oController._DetailJSonModel.setProperty("/Data/Concode", "");   //경조유형
		oController._DetailJSonModel.setProperty("/Data/Hdays", "");   //경조휴가일수
		
	},	
	
	onAfterSelectPernr : function(oController){
		// 신청내역 초기화
		oController.onResetDetail(oController);
		// Persa 조회
		oController._DetailJSonModel.setProperty("/Data/Persa",oController._TargetJSonModel.getProperty("/Data/Persa"));
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();

		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty){
		var vErrorMessage = "";
		
		if(oController.onValidationData(oController, vPrcty) == false) return;
		
		var onProcess = function(){
			// 위임여부 저장
			var vErrorMessage = "", vError = "";
			var vSuccessyn = common.MandateAction.onSaveMandate(oController);
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			// 결재라인 저장
			var vSuccessyn = common.ApprovalLineAction.onSaveApprovalLine(oController);
			if(vSuccessyn == "X"){
				oController.BusyDialog.close();
				return false;
			}
			
			// 경조금 문서 저장
			var oModel = sap.ui.getCore().getModel("ZHR_CONTY_SRV");

			var oneData = oController._DetailJSonModel.getProperty("/Data");
			var createData = {} , errData = {};
			
			createData = common.Common.copyByMetadata(oModel, "ExpensesAppl", oneData);
			
			createData.Appno = oController._vAppno;
			createData.Conrdate = "\/Date("+ common.Common.getTime(oneData.Conrdate)+")\/";	// 실제경조일
			createData.ZholDay = oneData.ZholDay.toString();	// 휴가일수
			if(oneData.ZbacBet) createData.ZbacBet = oneData.ZbacBet.replace(/,/g, "");	// 기본급
			if(oneData.ZpayBet)  createData.ZpayBet = oneData.ZpayBet.replace(/,/g, "");	// 지급액
			if(createData.ZpayBet == "") delete createData.ZpayBet;
			if(createData.ZbacBet == "") delete createData.ZbacBet;
			if(oneData.BabyCnt && oneData.Concode == "160" ) createData.BabyCnt = oneData.BabyCnt; // 다태아
			if(common.Common.checkNull(createData.ZholDay)) delete createData.ZholDay;
			
			if(!common.Common.checkNull(oneData.Absbg)) createData.Absbg = "\/Date("+ common.Common.getTime(oneData.Absbg)+")\/";	// 경조휴가일
			else delete createData.Absbg;
			if(!common.Common.checkNull(oneData.Absed)) createData.Absed = "\/Date("+ common.Common.getTime(oneData.Absed)+")\/";	// 경조휴가일
			else delete createData.Absed;
			createData.Hdays = createData.Hdays.replace(/[^0-9]/g,"");
			if(common.Common.checkNull(createData.Hdays)){
				delete createData.Hdays;
			}
			
			
			createData.Prcty = vPrcty;
			createData.Actty = _gAuth;
			
			var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
			var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
			
			createData.Appernr = vEmpLoginInfo[0].Pernr;	// 신청자 사번
			createData.Waers = "KRW";
			
			oModel.create("/ExpensesApplSet", createData, null,
					function(data,res){
						if(data) {
						
						} 
					},
					function (Res) {
						errData = common.Common.parseError(Res);
					}
			);
			
			oController.BusyDialog.close();
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage);
				return ;
			}
			
			sap.m.MessageBox.show(vCompTxt, {
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				onClose : oController.onBack
			});
		};
		
		var CreateProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		var vInfoTxt = "" , vCompTxt = "";
		
		if(vPrcty == "T"){
			vInfoTxt = oBundleText.getText("LABEL_0061");	// 61:저장하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0060") ;	// 60:저장이 완료되었습니다.
		}else {
			vInfoTxt = oBundleText.getText("LABEL_0051");	// 51:신청하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0048");	// 48:신청이 완료되었습니다.
		}
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},
	
	onValidationData : function(oController, vPrcty){		
		var vData = oController._DetailJSonModel.getProperty("/Data");

		var oneData = oController._DetailJSonModel.getProperty("/Data");		
		if(!oneData.Pernr){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return false;
		} else if(!oneData.Concode){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1196"), {title : oBundleText.getText("LABEL_0053")});	// 1196:경조유형을 선택하여 주십시오.
			return false;
		} else if(!oneData.Conresn){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1197"), {title : oBundleText.getText("LABEL_0053")});	// 1197:관계를 선택하여 주십시오.
			return false;
		} else if(!oneData.Conrdate){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1198"), {title : oBundleText.getText("LABEL_0053")});	// 1198:사유발생일을 입력하여 주십시오.
			return false;
		} else if(vPrcty == "C" && (!oneData.Docyn || oneData.Docyn != "Y")){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1199"), {title : oBundleText.getText("LABEL_0053")});	// 1199:전자증빙에 증빙서류를 업로드 바랍니다.
			return false;
		} else if(!vData.Appno || vData.Appno == ""){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1200"), {title : oBundleText.getText("LABEL_0053")});	// 1200:신청문서번호가 생성되지 않았습니다.
			return false;
		}
		
		
		if(vData.ZholDay * 1 > vData.SZholDay * 1){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1201"), {title : oBundleText.getText("LABEL_0053")});	// 1201:경조휴가 기준 휴가일보다 더 많은 일자의 휴가일을 선택하였습니다.
			return false;
		}
		
		if(vPrcty == "C"){
			// 결재자 지정여부 확인
			var oData = oController._ApprovalLineModel.getProperty("/Data");
			var vApprovalCheck = "";
			if(oData && oData.length > 0){
				for(var i=0; i <oData.length ; i++ ){
					if(oData[i].Aprtype == "A03001"){
						vApprovalCheck = "X";
						break;
					}
				}	
			}
			if(vApprovalCheck == ""){
				sap.m.MessageBox.error(oBundleText.getText("LABEL_0004"), {title : oBundleText.getText("LABEL_0053")});	// 결재자를 반드시 지정하시기 바랍니다.
				return false;
			}	
		}
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
			
		var onProcess = function(){
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_CONTY_SRV");
				var oPath = "/ExpensesApplSet(Appno='" + oController._vAppno + "')";
				oModel.remove(oPath, null,
						function(data,res){
						},
						function(Res){
							if(Res.response.body){
								var ErrorMessage = Res.response.body;
								var ErrorJSON = JSON.parse(ErrorMessage);
								
								if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
									vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
								}else{
									vErrorMessage = ErrorMessage ;
								}
							}
						}
				);
				oController.BusyDialog.close();
								
				if(vErrorMessage != ""){
					sap.m.MessageBox.error(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
					return;
				} 				
				
				sap.m.MessageBox.show(oBundleText.getText("LABEL_0034"), {	// 34:삭제가 완료되었습니다.
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title : oBundleText.getText("LABEL_0052"),	// 52:안내
					actions: [sap.m.MessageBox.Action.CLOSE],
			        onClose: oController.onBack
				});
		};
		
		var DeleteProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		}; 
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// 35:삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : DeleteProcess
		});
	},
	
	onPressHistory : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		
		if(!oController._SearchHistoryDialog) {
			oController._SearchHistoryDialog = sap.ui.jsfragment("ZUI5_HR_Expenditure.fragment.HistoryDialog", oController);
			oView.addDependent(oController._SearchHistoryDialog);
		}
		
		var oHistoryTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable");
		var oJSonModel = oHistoryTable.getModel();
		oJSonModel.setData({Data : []});
		oHistoryTable.setVisibleRowCount(1);
		oController._SearchHistoryDialog.open();
	},
	
	beforeOpenHistoryDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		var oHistoryTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable");
		var oJSonModel = oHistoryTable.getModel();
		var oDatas = { Data : []};
		var vError = "" , vErrorMessage = ""; 
		var onProcess = function(){
			var oModel = sap.ui.getCore().getModel("ZHR_CONTY_SRV");
			
			oModel.read("/ExpensesHistorySet", {
				async: false,
				filters: [
					new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Encid")),
				],
				success: function(data,res){
					if(data && data.results.length) {
						for(var i=0; i<data.results.length; i++) {
							data.results[i].ZListComment = "";
							if(data.results[i].Zbigo && data.results[i].Zbigo != ""){
								data.results[i].ZListComment = data.results[i].Zbigo ;
							}
							if(data.results[i].ZappResn && data.results[i].ZappResn != ""){
								if(data.results[i].ZListComment != "") data.results[i].ZListComment += "\n";
								data.results[i].ZListComment += data.results[i].ZappResn;
							}
							
							oDatas.Data.push(data.results[i]);
						}
					}
				},
				error: function(Res){
					vError = "E";
					if(Res.response.body){
						ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						} else {
							vErrorMessage = ErrorMessage;
						}
					}}
			});
			oHistoryTable.setVisibleRowCount(oDatas.Data.length);
			oJSonModel.setData(oDatas);
			
			if(vErrorMessage != ""){
				oController.BusyDialog.close();
				new control.ZNK_SapBusy.oErrorMessage(vErrorMessage);
				return ;
			}
			
			oController.BusyDialog.close();
		};
		
		oController.BusyDialog.open();
		setTimeout(onProcess, 100);
	}
	
});