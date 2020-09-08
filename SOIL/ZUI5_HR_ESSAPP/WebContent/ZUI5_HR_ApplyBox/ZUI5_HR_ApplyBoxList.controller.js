jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_ApplyBox.ZUI5_HR_ApplyBoxList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ApplyBox.ZUI5_HR_ApplyBoxList
	 */

	PAGEID : "ZUI5_HR_ApplyBoxList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_IconTabBarJSonModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vClsdt : "",
	_vPayym : "",
	_vPernr : "" , // 로그인 사번 
	_vEnamefg : "",
	_oControl  : null,
	BusyDialog : new sap.m.BusyDialog(),
	_DocumentPage : [{ ZreqForm : "HR01" , DetailPage : "ZUI5_HR_Medical.ZUI5_HR_MedicalDetail", Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Medical.html?_gAuth=E" },  // 의료비 신청
		 { ZreqForm : "HR02" , DetailPage : "ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail", Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Scholarship.html?_gAuth=E"  },  // 학자금 신청
		 { ZreqForm : "HR03" , DetailPage : "ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail" },  // 경조금 신청
		 { ZreqForm : "HR04" , DetailPage : "ZUI5_HR_DomesticBTrip.ZUI5_HR_DomesticBTripDetail" , Engyn : "1"},  // 국내출장명령서(국문)
		 { ZreqForm : "HR05" , DetailPage : "ZUI5_HR_DomesticBTrip.ZUI5_HR_DomesticBTripDetail" , Engyn : "2" },  // 국내출장명령서(영문)
	 	 { ZreqForm : "HR06" , DetailPage : "ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail", Engyn : "1" },  // 국내출장명령서(국문)-변경/취소
	 	 { ZreqForm : "HR07" , DetailPage : "ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail", Engyn : "2" },  // 국내출장명령서(영문)-변경/취소
	 	 { ZreqForm : "HR08" , DetailPage : "ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripDetail" },  // 해외출장명령서
	 	 { ZreqForm : "HR09" , DetailPage : "ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail" },  // 국내출장비 신청서 
	 	 { ZreqForm : "HR10" , DetailPage : "ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail" },  // 해외출장비 신청서
	 	 { ZreqForm : "HR12" , DetailPage : "ZUI5_HR_Certificate.ZUI5_HR_CertificateDetail" },  // 제증명 신청
	 	 { ZreqForm : "HR22" , DetailPage : "ZUI5_HR_TaxAdjustment.ZUI5_HR_TaxAdjustmentDetail" },	// 원천징수 세액조정 신청
	 	 { ZreqForm : "HR23" , DetailPage : "ZUI5_HR_LifeSafety.ZUI5_HR_LifeSafetyDetail" },  // 생활안정자금 신청
	 	 { ZreqForm : "HR24" , DetailPage : "ZUI5_HR_LifeStableRepayment.ZUI5_HR_LifeStableRepaymentDetail" },  // 생활안정자금 중도상환 신청
	 	 { ZreqForm : "HR25" , DetailPage : "ZUI5_HR_HousingLoan.ZUI5_HR_HousingLoanDetail" },  // 주택자금 신청 
	 	 { ZreqForm : "HR26" , DetailPage : "ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentDetail" },  // 주택자금 중도상환 신청
	 	 { ZreqForm : "HR27" , DetailPage : "ZUI5_HR_LicensePay.ZUI5_HR_LicensePayDetail" },  // 자격수당 신청
	 	 { ZreqForm : "HR28" , DetailPage : "ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail" },  // 경조화환 신청
	 	 { ZreqForm : "HR29" , DetailPage : "ZUI5_HR_PreparedAmount.ZUI5_HR_PreparedAmountDetail" },  // 부임준비금 신청
	 	 { ZreqForm : "HR30" , DetailPage : "ZUI5_HR_MoveAmount.ZUI5_HR_MoveAmountDetail" },	// 이사비 신청
	 	 { ZreqForm : "HR31" , DetailPage : "ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail" },  // 영유아 보육지원 신청
	 	 { ZreqForm : "HR32" , DetailPage : "ZUI5_HR_PregnancyRegistration.ZUI5_HR_PregnancyRegistrationDetail" },  // 임신직원 등록신청
	 	 { ZreqForm : "HR33" , DetailPage : "ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckDetail" },  // 태아검진 외출신청
	 	 { ZreqForm : "HR34" , DetailPage : "ZUI5_HR_Lunch.ZUI5_HR_LunchDetail" },  // 중식비 예외자 신청 (전표생성코드 : 290)
	 	 { ZreqForm : "HR35" , DetailPage : "ZUI5_HR_EmTransport.ZUI5_HR_EmTransportDetail" },  // 긴급업무 수행교통비
	 	 { ZreqForm : "HR36" , DetailPage : "ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportDetail" },  // 방문교통비
	 	 { ZreqForm : "HR37" , DetailPage : "ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail" },  // 고정/변동 공제항목 신청
	 	 { ZreqForm : "HR38" , DetailPage : "ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail" },	// [공장] 고정공제 신청
	 	 { ZreqForm : "HR39" , DetailPage : "ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail" },  // 사택지원신청
	 	 { ZreqForm : "HR40" , DetailPage : "ZUI5_HR_EndCompanyHousingSupport.ZUI5_HR_EndCompanyHousingSupportDetail" },  // 사택종료신청
	 	 { ZreqForm : "HR41" , DetailPage : "ZUI5_HR_DeductionChange.ZUI5_HR_DeductionChangeDetail" },  // 변동공제 신청
	 	 { ZreqForm : "PA01" , DetailPage : "ZUI5_HR_Resignation.ZUI5_HR_ResignationDetail" },  // 사직원 신청서
	 	 { ZreqForm : "PA02" , DetailPage : "ZUI5_HR_RecRequest.ZUI5_HR_RecRequestDetail" },  // 충원요청서
	 	 { ZreqForm : "PA03" , DetailPage : "ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail" },  // 내신서
	 	 { ZreqForm : "PD01" , DetailPage : "ZUI5_HR_Transition.ZUI5_HR_TransitionDetail" },  // 인수인계서 작성
	 	 { ZreqForm : "TM01" , DetailPage : "ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail" },	// 근무편제변경 신청
	 	 { ZreqForm : "TM02" , DetailPage : "ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail" },  // 예외근무신청
	 	 { ZreqForm : "TM03" , DetailPage : "ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail" },  // 연간휴가신청
	 	 { ZreqForm : "TM04" , DetailPage : "ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestDetail" },  // 휴가신청
	 	 { ZreqForm : "TM05" , DetailPage : "ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestDetail" },  // 휴가신청(영문)
	 	 { ZreqForm : "TM06" , DetailPage : "ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail" },	// 휴가 변경/취소 신청
	 	 { ZreqForm : "TM11" , DetailPage : "ZUI5_HR_SickLeave.ZUI5_HR_SickLeaveDetail" },  // 병가신청서
	 	 { ZreqForm : "TM21" , DetailPage : "ZUI5_HR_VacationDispatch.ZUI5_HR_VacationDispatchDetail" },  // 파견직 근태 신청
	 	 { ZreqForm : "TM22" , DetailPage : "ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail" },  // 파견직 근태 변경/취소 신청서
	 	 { ZreqForm : "TM31" , DetailPage : "ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail" },  // 출산휴가/육아휴직 신청서
	 	 { ZreqForm : "TM32" , DetailPage : "ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail" },	// 병가/출산휴가/육아휴직 변경/취소
	 	 { ZreqForm : "TM41" , DetailPage : "ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail" },  // 특근명령서
	 	 { ZreqForm : "TM42" , DetailPage : "ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail" },  // 특근명령 취소신청서
	 	 { ZreqForm : "TM43" , DetailPage : "ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail" },  // 특근확인서
	 	 { ZreqForm : "TM51" , DetailPage : "ZUI5_HR_HolidayDelegateTask.ZUI5_HR_HolidayDelegateTaskDetail" },  // 휴일대근 신청서
	 	 { ZreqForm : "TM61" , DetailPage : "ZUI5_HR_WorktimePostConfirm.ZUI5_HR_WorktimePostConfirmDetail" },	// 근무시간 사후확인서
	 	 { ZreqForm : "TM71" , DetailPage : "ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail"},   // 근태기록부(예외자)
	 	 { ZreqForm : "BE01" , DetailPage : "ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson" },  // 외국어 학습비 신청
	 	 { ZreqForm : "BE02" , DetailPage : "ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageExam" },  // 외국어 시험 신청
	 	 { ZreqForm : "BE05" , DetailPage : "ZUI5_HR_Resort.ZUI5_HR_ResortDetail" },  // 휴양소 신청
	 	 { ZreqForm : "BE06" , DetailPage : "ZUI5_HR_Resort.ZUI5_HR_ResortDetail" },	// 공장 휴양소 신청			
	 	 { ZreqForm : "BE11" , DetailPage : "ZUI5_HR_CompanyHouse.ZUI5_HR_CompanyHouseDetail" },  // 사택 입주신청서
	 	 { ZreqForm : "BE12" , DetailPage : "ZUI5_HR_CompanyHouse.ZUI5_HR_CompanyHouseDetail1" },  // 사택 퇴거신청서
	 	 { ZreqForm : "BE13" , DetailPage : "ZUI5_HR_Smock.ZUI5_HR_SmockDetail"},  // 방염 작업복 신청 
	 	 { ZreqForm : "BE14" , DetailPage : "ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountDetail" },  // 계좌변경 신청 
	 	 { ZreqForm : "GA01" , DetailPage : "ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail" },	// 	사회봉사계획서		
	 	 { ZreqForm : "GA02" , DetailPage : "ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail" },  // 사회봉사보고서
	 	 { ZreqForm : "GA03" , DetailPage : "ZUI5_HR_Card.ZUI5_HR_CardDetail" },  // 자원봉사 활동 결과보고서
	],
	ErrorMessage : "",
	Error : "",
	onInit : function() {

//		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
//		};

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
	},

	onBeforeShow : function(oEvent) {
		var oController = this ;
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth()-1 , curDate.getDate());
			
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		if(vEmpLoginInfo.length > 0){
			oController._vPernr = vEmpLoginInfo[0].Pernr ;
		}
		
		var vEname = "";
		var vPernr = "";
		var vBtrtl = "";
		
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1){
			if(_gAuth == "E"){
				if(vEmpLoginInfo.length > 0){
					var OneData = {};
					// 대상자
					vEname = vEmpLoginInfo[0].Ename ;
					vPernr = vEmpLoginInfo[0].Pernr ;
//					oController._vPersa = vEmpLoginInfo[0].Persa ; // 사원검색을 위해 필요한 인사영역 
				}
			}
			vBtrtl = vEmpLoginInfo[0].Btrtl;
			
			var JSonData = { Data : { ZreqForm : "", Apbeg : dateFormat.format(prevDate) , Apend : dateFormat.format(curDate) , 
				  Pernr : vPernr, Ename : vEname }};

			oController._ListCondJSonModel.setData(JSonData);
			oController.onInitControl(oController);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}

		oController._IconTabBarJSonModel.setData({
			Data : { click0 : "Y", click1 : "N", click2 : "N", click3 : "N", click4 : "N", click5 : "N" ,
				     CountAll : 0 , Count1 : 0 , Count2 : 0, Count3 : 0 , Count4 : 0,  Count5 : 0
			}
		});
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
		this.onPressSearch();
		
	},
	
	onInitControl : function(oController, _vZappStatAl ){
		
	},
	
	
	onSelectRow : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApplyBox.ZUI5_HR_ApplyBoxList");
		var oController = oView.getController();		
		var oTable = sap.ui.getCore().byId(oController.PAGEID+"_Table");
		var vContext = oEvent.getParameters().rowBindingContext;
		var oModel = oTable.getModel();
		if(vContext == undefined || oModel.getProperty(vContext.sPath)==null){
			return;
		}
		
		var vZreqForm =  oModel.getProperty(vContext.sPath + "/ZreqForm");
		var vAppno =  oModel.getProperty(vContext.sPath + "/Appno");
		var vZappUrl =  oModel.getProperty(vContext.sPath + "/ZappUrl");
		var vZzorgid =  oModel.getProperty(vContext.sPath + "/Zzorgid");
		var vDetailPage = "", vEngyn;
		
		
		for(var i = 0; i < oController._DocumentPage.length ; i ++){
			if(vZreqForm == oController._DocumentPage[i].ZreqForm ){
				vDetailPage = oController._DocumentPage[i].DetailPage ;
				vEngyn = oController._DocumentPage[i].Engyn ; 
				break;
			}
		}
		
		if(!common.Common.checkNull(vEngyn)){
			var vLocale = "";
			var surfix = "?" + new Date().getTime();
			if(vEngyn == "1") vLocale = "KO";
			else if(vEngyn == "2") vLocale = "EN";	
			oBundleText = jQuery.sap.resources({
				url : "/sap/bc/ui5_ui5/sap/ZUI5_HR_COMMON/translation/i18n.properties" + surfix, //번역파일 주소
				locale : vLocale	
			});
		}
		
		if(vZappUrl && vZappUrl != "" ){
			window.open(vZappUrl);
		}else if(vDetailPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : vDetailPage,
		      data : {
		    	  Appno : oModel.getProperty(vContext.sPath + "/Appno"),
		    	  FromPage : "ZUI5_HR_ApplyBox.ZUI5_HR_ApplyBoxList",
		    	  ZreqForm : vZreqForm ,
		      }
			});	
		}
	},

	onPressRow : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApplyBox.ZUI5_HR_ApplyBoxList");
		var oController = oView.getController();		
		
		var vAppno = oEvent.getSource().getCustomData()[0].getValue();

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oModel = oTable.getModel();		
		var vData = oModel.getProperty("/Data");
		
		for(var i=0; i<vData.length; i++){
			if(vAppno == vData[i].Appno){				

				var vZreqForm = vData[i].ZreqForm;
				var vZappUrl = vData[i].ZappUrl;
				var vZzorgid = vData[i].Zzorgid;
				var vDetailPage = "", vEngyn;
								
				for(var a = 0; a < oController._DocumentPage.length ; a ++){
					if(vZreqForm == oController._DocumentPage[a].ZreqForm ){
						vDetailPage = oController._DocumentPage[a].DetailPage ;
						vEngyn = oController._DocumentPage[a].Engyn ; 
						break;
					}
				}
				
				if(!common.Common.checkNull(vEngyn)){
					var vLocale = "";
					var surfix = "?" + new Date().getTime();
					if(vEngyn == "1") vLocale = "KO";
					else if(vEngyn == "2") vLocale = "EN";	
					oBundleText = jQuery.sap.resources({
						url : "/sap/bc/ui5_ui5/sap/ZUI5_HR_COMMON/translation/i18n.properties" + surfix, //번역파일 주소
						locale : vLocale	
					});
				}
				
				if(vZappUrl && vZappUrl != "" ){
					window.open(vZappUrl);
				} else if(!common.Common.checkNull(vDetailPage) && !common.Common.checkNull(vAppno)){
					sap.ui.getCore().getEventBus().publish("nav", "to", {
			    	  id : vDetailPage,
				      data : {
				    	  Appno : vAppno,
				    	  FromPage : "ZUI5_HR_ApplyBox.ZUI5_HR_ApplyBoxList",
				    	  Zzorgid : vZzorgid ,
				      }
					});	
				}
				
			}
		}
		
	},
	
	onBack : function(oEvent){
	},

	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0055"),{	// 55:유효하지 않은 날짜형식입니다.
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	},
	
	// 리스트 조회
	onPressSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApplyBox.ZUI5_HR_ApplyBoxList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		
		// 테이블 sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++) {
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		var SerchCond = oController._ListCondJSonModel.getProperty("/Data");
		var aFilters = [];

		var oModel = sap.ui.getCore().getModel("ZHR_APPL_SRV");
		
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
		
		if(SerchCond.Apbeg != "" && SerchCond.Apend != "") {
			if(common.Common.checkDate(SerchCond.Apbeg, SerchCond.Apend) == false) {
				return ;
			}
		}
		
		if(SerchCond.Apbeg != "") {
			aFilters.push(new sap.ui.model.Filter('Apbeg', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Apbeg").getDateValue())));
		}
		if(SerchCond.Apend != "") {
			aFilters.push(new sap.ui.model.Filter('Apend', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Apend").getDateValue())));
		}
		if(!common.Common.checkNull(SerchCond.ZreqForm)) {
			aFilters.push(new sap.ui.model.Filter('ZreqForm', sap.ui.model.FilterOperator.EQ, SerchCond.ZreqForm));
		}
		if(!common.Common.checkNull(SerchCond.ZappStatAl)) {
			aFilters.push(new sap.ui.model.Filter('ZappStatAl', sap.ui.model.FilterOperator.EQ, SerchCond.ZappStatAl));
		}
		
		function Search() {
			var Datas = { Data : []},
			iconData = oController._IconTabBarJSonModel.getData();
			
			oModel.read("/ApplListSet", {
				async : false,
				filters : aFilters,
				success : function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							var OneData = data.results[i];
							OneData.Idx = i + 1;
							
							switch (OneData.ZappStatAl) {
								case '10' :
									vReqCnt1++;
									OneData.ZappStatAl2 = "10"; // 작성중
									break;
								case '20' :
									vReqCnt2++;
									OneData.ZappStatAl2 = "20"; // 신청중
									break;
								case '30' : case '35' : case '40' : case '50' :
									if(common.Common.isNull(data.results[i].ZappDate)) {
										vReqCnt3++;
										OneData.ZappStatAl2 = "30"; // 진행중
									} else {
										vReqCnt4++;
										OneData.ZappStatAl2 = "40"; // 승인
									}
									break;
								case '31' : case '36' : case '45' : case '55' :
									vReqCnt5++;
									OneData.ZappStatAl2 = "50"; // 반려
									break;
							}
							Datas.Data.push(OneData);
						}
					}
				},
				error : function(Res) {
					var errData = common.Common.parseError(Res);
					oController.Error = errData.Error;
					oController.ErrorMessage = errData.ErrorMessage;
				}
			});
			
			// listdate 필드 convert => 필드id+"Txt" string 필드로
			common.Common.convertDateField(Datas);
			
			oController._ListJSonModel.setData(Datas);
			oTable.setVisibleRowCount(Datas.Data.length > 15 ? 15 : Datas.Data.length);
			
			iconData.Data.Count1 = vReqCnt1;
			iconData.Data.Count2 = vReqCnt2;
			iconData.Data.Count3 = vReqCnt3;
			iconData.Data.Count4 = vReqCnt4;
			iconData.Data.Count5 = vReqCnt5;
			iconData.Data.CountAll = Datas.Data.length;
			oController._IconTabBarJSonModel.setData(iconData);
			
			oController.handleIconTabBarSelect(oController, "0");
			
			if(oController.Error == "E") {
				oController.BusyDialog.close();
				oController.Error = "";
				sap.m.MessageBox.show(oController.ErrorMessage);
			}
			
			oTable.bindRows("/Data");
			
			oController.BusyDialog.close();			
		}
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);				
	},
	
	_AddPersonDialog : null ,
	
	EmpSearchByTx :function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportList"),
			oController = oView.getController(),
			oControl = oEvent.getSource(),
			vEname = oControl.getValue(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = {EmpSearchResultSet : []};
		
		common.SearchUserList.oController = oController;
		oController._vEnamefg = "";
		
		if(!vEname || vEname == ""){
			if(oController._ListCondJSonModel.getProperty("/Data")){
				var vControlId = common.Common.getControlId(oController, oControl.getId());
				if(vControlId.Id && vControlId.Id != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
				if(vControlId.Key && vControlId.Key != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
			}
			oController.onPressSearch();
		}else{
			oController._oControl = oControl;
			var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV"),
				curDate = new Date(),
				oFilters = [];
			
//			if(_gAuth != "H"){
//				oFilters.push(new sap.ui.model.Filter('Persa', sap.ui.model.FilterOperator.EQ, oController._vPersa));
//			}
			oFilters.push(new sap.ui.model.Filter('Actda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(curDate)));
			oFilters.push(new sap.ui.model.Filter('Ename', sap.ui.model.FilterOperator.EQ, vEname));
			oFilters.push(new sap.ui.model.Filter('Stat1', sap.ui.model.FilterOperator.EQ, '3'));
			oFilters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth));
			if(gReqAuth) oFilters.push(new sap.ui.model.Filter('ReqAuth', sap.ui.model.FilterOperator.EQ, gReqAuth));
		
			try {
				oCommonModel.read("/EmpSearchResultSet", {
					async: false,
					filters: [
						oFilters
					],
					success: function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {	
								oData.results[i].Chck = false ;
								vEmpSearchResult.EmpSearchResultSet.push(oData.results[i]);
								
							}
						}
					},
					error: function(Res) {
						var errData = common.Common.parseError(Res);
						oController.Error = errData.Error;
						oController.ErrorMessage = errData.ErrorMessage;
					}
				});
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.alert(oController.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
					oEvent.getSource().setValue();
					return;
				}	
			}catch(Ex){
				
			}
			
			if(vEmpSearchResult.EmpSearchResultSet.length == 1){
				var vControlId = common.Common.getControlId(oController, oControl.getId());
				if(vControlId.Id && vControlId.Id != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,vEmpSearchResult.EmpSearchResultSet[0].Ename);
				if(vControlId.Key && vControlId.Key != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,vEmpSearchResult.EmpSearchResultSet[0].Pernr);
				oController.onPressSearch();
			}else{
				oController._vEnamefg = "X";
				oController.displayEmpSearchDialog();
			}
		}	
	},
	
	displayEmpSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApplyBox.ZUI5_HR_ApplyBoxList");
		var oController = oView.getController();
	
		if(oEvent){
			oController._oControl = oEvent.getSource();
			oController._vEnamefg = "";
		}
		
		//각 발령대상자의 발령일을 검색조건으로 설정한다.
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		if(oActda) oController._vActda = oActda.getValue();
		
		common.SearchUser1.oController = oController;
		common.SearchUser1.fPersaEnabled = false;
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		
		oController._AddPersonDialog.open();
		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApplyBox.ZUI5_HR_ApplyBoxList");
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
	
	displayOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApplyBox.ZUI5_HR_ApplyBoxList");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Single";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "Input";
		common.SearchOrg.vNoPersa = true;
		
		if(!oController._SerachOrgDialog) {
			oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SerachOrgDialog);
		}
		oController._SerachOrgDialog.open();
	},
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApplyBox.ZUI5_HR_ApplyBoxList");
		var oController = oView.getController();
	
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
		var vActionSubjectList_Temp = {ActionSubjectListSet : []};
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"); 
		var vIDXs = oTable.getSelectedIndices();
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(vIDXs.length > 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는 한명만 선택이 가능합니다.
				return;
			}else if(vIDXs.length < 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}
			
			var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath;
			
			var vControlId = common.Common.getControlId(oController, oController._oControl.getId());
			if(vControlId.Id && vControlId.Id != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id, mEmpSearchResult.getProperty(_selPath + "/Ename"));
			if(vControlId.Key && vControlId.Key != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,mEmpSearchResult.getProperty(_selPath + "/Pernr"));
				oController._ListCondJSonModel.setProperty("/Data/Btrtl", mEmpSearchResult.getProperty(_selPath + "/Btrtl"));
			
		}else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApplyBox.ZUI5_HR_ApplyBoxList");
		var oController = oView.getController();
		oController._ListCondJSonModel.setProperty("/Data/Pernr", "");
		oController._ListCondJSonModel.setProperty("/Data/Ename", "");
		oController._ListCondJSonModel.setProperty("/Data/Btrtl", "");
		oController._AddPersonDialog.close();
	},
	
	handleIconTabBarSelect : function(oController, sKey) {
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"), 
			iconData = oController._IconTabBarJSonModel.getData(),
			oFilters = [];
		
		iconData.Data.click0 = "N";
		iconData.Data.click1 = "N";
		iconData.Data.click2 = "N";
		iconData.Data.click3 = "N";
		iconData.Data.click4 = "N";
		iconData.Data.click5 = "N";
		
		eval("iconData.Data.click" + sKey + "= 'Y' ;");
		oController._IconTabBarJSonModel.setData(iconData);
		
		if(sKey == "0"){ 
			oTable.bindRows({
			    path: "/Data"
			});
		} else {
			var vZappStatAl = "" + (sKey * 10 );
			oFilters.push(new sap.ui.model.Filter("ZappStatAl2",sap.ui.model.FilterOperator.EQ,vZappStatAl));
			var combinedFilter = new sap.ui.model.Filter(oFilters);
			
			oTable.bindRows({
				path: "/Data",
				filters: combinedFilter
			});
		}
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApplyBox.ZUI5_HR_ApplyBoxList");
		var oController = oView.getController();
//		var oScroll1 = sap.ui.getCore().byId(oController.PAGEID + "Page1");
//		var oScroll2 = sap.ui.getCore().byId(oController.PAGEID + "Page2");
//		oScroll1.setHeight(window.innerHeight-98+"px");
//		oScroll2.setHeight(window.innerHeight-98+"px");
//		var oPage = sap.ui.getCore().byId(oController.PAGEID + "Pages");
//		oPage.setHeight(window.innerHeight-98+"px");
//		$("#" + oController.PAGEID + "_ICONBAR-content").height(window.innerHeight - 132);
	},
	
	convertDate : function(vStartDate){
		if(vStartDate) {
	        var arrDate1 = vStartDate.split(".");
	        var getDate1 = new Date(parseInt(arrDate1[0]),parseInt(arrDate1[1])-1,parseInt(arrDate1[2]));
	        return getDate1.getTime();
	    }
	},
	
	convertDate2 : function(vDate){
		if(vDate) {
	        var arrDate1 = vDate.split(" ");
	        var arrDate = arrDate1[0].split(".");
	        var arrTime = arrDate1[1].split(":");
	        
	        var setDate = new Date(arrDate[0],arrDate[1]-1,arrDate[2], arrTime[0],arrTime[1],arrTime[2], 0);
	        return setDate.getTime();
	    }
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApplyBox.ZUI5_HR_ApplyBoxList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oJSONModel = oTable.getModel();
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
	
		var curDate = new Date();
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: oBundleText.getText("LABEL_1070") + "-" + dateFormat.format(curDate) + ".xlsx"	// 1070:HR 신청함
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
		oSpreadsheet.build();
	},
	
	onPressStep : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApplyBox.ZUI5_HR_ApplyBoxList");
		var oController = oView.getController();
		var oControl = this;
		if(!oController._SgnstepPopover) {
			oController._SgnstepPopover = sap.ui.jsfragment("ZUI5_HR_ApplyBox.fragment.SgnstepPopover", oController);
			oView.addDependent(oController._SgnstepPopover);
		}
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		vSelectedData = oTable.getModel().getProperty(oEvent.getSource().getBindingContext().sPath);
		
		if(common.Common.checkNull(vSelectedData)) return ;
		
		var aFilters = [
			new sap.ui.model.Filter('Appno', sap.ui.model.FilterOperator.EQ, vSelectedData.Appno)
		];
		var vData = { Data : []};
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oModel = sap.ui.getCore().getModel("ZHR_APPROVAL_SRV");
		oModel.read("/ApprLineInfoSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length > 0) {
					for(var i =0; i <data.results.length; i++){
						data.results[i].Idx = i+1;
						if(i == 0){
							data.results[i].icon = "sap-icon://employee";
							data.results[i].ZappEname = oBundleText.getText("LABEL_1076")+" : " + data.results[i].ZappEname ;	// 1076:신청자
						}else{
							data.results[i].icon = "sap-icon://approvals";
							data.results[i].ZappEname = oBundleText.getText("LABEL_1072")+" : " + data.results[i].ZappEname ;	// 1072:결재자
						}
						var h , m , t;
						if(data.results[i].dateTime = data.results[i].ZappPdate == null){
							data.results[i].dateTime = "";
						}else{
							h = dateFormat.format(new Date(common.Common.setTime(data.results[i].ZappPdate)));
							m = common.Common.timeToString(data.results[i].ZappPtime, "HH:mm:ss");
							t = h + "T" + m;
							data.results[i].dateTime = new Date(t);
						}
						vData.Data.push(data.results[i]);	
					}
				}					
			},
			error : function(Res) {
				console.log(Res);
			}
		});
		
		var oTimeLine = sap.ui.getCore().byId(oController.PAGEID + "_TimeLine");
		oTimeLine.getModel().setData(vData);
		oController._SgnstepPopover.openBy(oControl);
		
	},

});