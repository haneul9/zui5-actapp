jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("ZUI5_HR_ChartTest4.control.XNavigationListItem");


sap.ui.controller("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List
	 */

	PAGEID : "ZUI5_HR_ChartTest4List",
	_HeaderJSonModel : new sap.ui.model.json.JSONModel(),
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListCondJSonModel2 : new sap.ui.model.json.JSONModel(),
	_JSonModel : new sap.ui.model.json.JSONModel(),
	_JSonModel1 : new sap.ui.model.json.JSONModel(),
	_JSonModel2 : new sap.ui.model.json.JSONModel(),
	_JSonModel3 : new sap.ui.model.json.JSONModel(),
	_JSonModel5 : new sap.ui.model.json.JSONModel(),
	_FavoriteJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vClsdt : "",
	_vPayym : "",
	_vPernr : "" , // 로그인 사번 
	_vEnamefg : "",
	_oControl  : null,
	BusyDialog : new sap.m.BusyDialog(),
	
	_ReqPage : [],
	_HeaderPage : [
		{ Type : "A1",
		  Icon: 'sap-icon://eam-work-order',
		  Title : "근태신청" },
		{ Type : "B1",
		  Icon: 'sap-icon://suitcase',
		  Title : "출장신청" },
		{ Type : "C1",
		  Icon: 'sap-icon://account',
		  Title : "인사행정" },
		{ Type : "D1",
		  Icon: 'sap-icon://collaborate',
		  Title : "사회봉사" },
	    { Type : "E1",
		  Icon: 'sap-icon://education',
		  Title : "도서신청" },
	    { Type : "F1",
		  Icon: 'sap-icon://doctor',
		  Title : "복리후생" },
	    { Type : "G1",
		  Icon: 'sap-icon://monitor-payments',
		  Title : "급여" }
	],
	
	_DefaultPage : [
		{ ZreqForm : "DF01" , DetailPage : "ZUI5_HR_Medical.ZUI5_HR_MedicalDetail", 
			   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Medical.html?_gAuth=E" , 
			   Type : "F1", Title : "의료비 신청"},  // 의료비 신청
		],
	_DocumentPage : [
		 { ZreqForm : "HR01" , DetailPage : "ZUI5_HR_Medical.ZUI5_HR_MedicalDetail", 
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Medical.html?_gAuth=E" , 
		   Type : "F1", Title : "의료비 신청"},  // 의료비 신청
		 { ZreqForm : "HR02" , DetailPage : "ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail",
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Scholarship.html?_gAuth=E" ,
		   Type : "F1", Title : "학자금 신청" },  // 학자금 신청
		 { ZreqForm : "HR03" , DetailPage : "ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail",
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Expenditure.html?_gAuth=E" ,
		   Type : "F1", Title : "경조금 신청"  },  // 경조금 신청
		 { ZreqForm : "HR04" , DetailPage : "ZUI5_HR_DomesticBTrip.ZUI5_HR_DomesticBTripDetail" ,
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/domesticbtrip.html?_gAuth=E" ,
		   Engyn : "2", Type : "B1", Title : "국내출장명령서(국문/영문)" }, 
	 	 { ZreqForm : "HR06" , DetailPage : "ZUI5_HR_DomesticBTripChange.ZUI5_HR_DomesticBTripChangeDetail", 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/domesticbtripchange.html?_gAuth=E" ,
	 	   Engyn : "1" , Type : "B1", Title : "국내출장명령 변경/취소 신청(국문/영문)"},  // 국내출장명령서(국문)-변경/취소
	 	 { ZreqForm : "HR08" , DetailPage : "ZUI5_HR_OverseaBTrip.ZUI5_HR_OverseaBTripDetail", 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/OverseaBTrip.html?_gAuth=E" ,
	 	   Type : "B1", Title : "해외출장명령서"},  // 해외출장명령서
	 	 { ZreqForm : "HR09" , DetailPage : "ZUI5_HR_DomesticBTripCal.ZUI5_HR_DomesticBTripCalDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/domesticbtripcal.html?_gAuth=E" ,
	 	   Type : "B1", Title : "국내출장비 신청" },  // 국내출장비 신청 
	 	 { ZreqForm : "HR10" , DetailPage : "ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/overseabtripcal.html?_gAuth=E" ,
	 	   Type : "B1", Title : "해외출장비 신청"},  // 해외출장비 신청
//	 //{ ZreqForm : "HR11" , DetailPage : "ZUI5_HR_Team.ZUI5_HR_TeamDetail" },  // 해외출장명령서 변경/취소
	 	 { ZreqForm : "HR12" , DetailPage : "ZUI5_HR_Certificate.ZUI5_HR_CertificateDetail", 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Certificate.html?_gAuth=E" ,
	 	   Type : "C1", Title : "제증명 신청" },  // 제증명 신청
	 	 { ZreqForm : "HR22" , DetailPage : "ZUI5_HR_TaxAdjustment.ZUI5_HR_TaxAdjustmentDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/taxadjustment.html?_gAuth=E" ,
	 	   Type : "G1", Title : "원천징수 세액조정 신청" },  // 원천징수 세액조정 신청
	 	 
	 	 { ZreqForm : "HR23" , DetailPage : "ZUI5_HR_LifeSafety.ZUI5_HR_LifeSafetyDetail" ,
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/lifesafety.html?_gAuth=E" ,
	 	   Type : "F1", Title : "생활안정자금 대출신청"},  // 생활안정자금 신청
	 	 { ZreqForm : "HR24" , DetailPage : "ZUI5_HR_LifeStableRepayment.ZUI5_HR_LifeStableRepaymentDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/LifeStableFundRepayment.html?_gAuth=E" ,
	 	   Type : "F1", Title : "생활안정자금 중도상환 신청" },  // 생활안정자금 중도상환 신청
	 	 { ZreqForm : "HR25" , DetailPage : "ZUI5_HR_HousingLoan.ZUI5_HR_HousingLoanDetail" ,
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/HousingLoan.html?_gAuth=E" ,
	 	   Type : "F1", Title : "주택자금 융자 신청" },  // 주택자금 신청
	 	 { ZreqForm : "HR26" , DetailPage : "ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/HousingFundRepayment.html?_gAuth=E" ,
	 	   Type : "F1", Title : "주택자금 중도상환 신청" },   // 주택자금 중도상환 신청
	 	 { ZreqForm : "HR27" , DetailPage : "ZUI5_HR_LicensePay.ZUI5_HR_LicensePayDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/licensepay.html?_gAuth=E" ,
	 	   Type : "G1", Title : "자격면허 수당 신청" },    // 자격수당 신청 
	 	 { ZreqForm : "HR28" , DetailPage : "ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail",
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/congoods.html?_gAuth=E" ,
		   Type : "F1", Title : "경조화환 및 장례지원서비스(장의용품) 신청" },  // 경조화환 신청
	 	 { ZreqForm : "HR29" , DetailPage : "ZUI5_HR_PreparedAmount.ZUI5_HR_PreparedAmountDetail",
		    Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/preparedamount.html?_gAuth=E",
			Type : "C1", Title : "부임/귀임 준비금 신청"},  // 부임준비금 신청
	 	 { ZreqForm : "HR30" , DetailPage : "ZUI5_HR_MoveAmount.ZUI5_HR_MoveAmountDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/moveamount.html?_gAuth=E",
	 	   Type : "F1", Title : "이사비 신청"},	// 이사비 신청
	 	 { ZreqForm : "HR31" , DetailPage : "ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail" , 
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/infantcare.html?_gAuth=E",
	 	   Type : "F1", Title : "영유아 보육지원 신청" },  // 영유아 보육지원 신청
	 	 { ZreqForm : "HR32" , DetailPage : "ZUI5_HR_PregnancyRegistration.ZUI5_HR_PregnancyRegistrationDetail", 
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/PregnancyRegistration.html?_gAuth=E",
	 	   Type : "F1", Title : "임신직원 등록 신청" },  // 임신직원 등록신청
	 	 { ZreqForm : "HR33" , DetailPage : "ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckDetail",
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/PregnancyCheck.html?_gAuth=E",
		   Type : "F1", Title : "태아검진 외출 신청" },  // 태아검진 외출신청
	 	 { ZreqForm : "HR34" , DetailPage : "ZUI5_HR_Lunch.ZUI5_HR_LunchDetail" , 
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Lunch.html?_gAuth=E",
		   Type : "F1", Title : "중식비 예외자 신청"},  // 중식비 예외자 신청 (전표생성코드 : 290)
	 	 { ZreqForm : "HR35" , DetailPage : "ZUI5_HR_EmTransport.ZUI5_HR_EmTransportDetail", 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/emtransport.html?_gAuth=E" , 
	 	   Type : "F1", Title : "긴급업무 수행 교통비 신청(공장)" },  // 긴급업무 수행교통비
	 	 { ZreqForm : "HR36" , DetailPage : "ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/visittransport.html?_gAuth=E" , 
	 	   Type : "B1", Title : "방문교통비 신청" },  // 방문교통비	   
	 	 { ZreqForm : "HR37" , DetailPage : "ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail",
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/DeductionItem.html?_gAuth=E" , 
	 	   Type : "G1", Title : "고정/변동 공제 신청 - 항목"},  // 변동공제 신청
	 	 { ZreqForm : "HR38" , DetailPage : "ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail", 
	 		Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Deduction.html?_gAuth=E" , 
		    Type : "G1", Title : "[공장] 고정공제 신청" }, // [공장] 고정공제 신청
	 	 { ZreqForm : "HR39" , DetailPage : "ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail" , 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/CompanyHousingSupport.html?_gAuth=E" , 
	 	   Type : "F1", Title : "사택지원 신청"},  // 사택지원신청
	 	 { ZreqForm : "HR40" , DetailPage : "ZUI5_HR_EndCompanyHousingSupport.ZUI5_HR_EndCompanyHousingSupportDetail",
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/EndCompanyHousingSupport.html?_gAuth=E" , 
	 	   Type : "F1", Title : "사택지원 종료 신청" },  // 사택종료신청
	 	 { ZreqForm : "HR41" , DetailPage : "ZUI5_HR_DeductionChange.ZUI5_HR_DeductionChangeDetail",
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/DeductionChange.html?_gAuth=E" , 
	 	   Type : "G1", Title : "변동공제 신청"},  // 변동공제 신청
	 	 { ZreqForm : "PA01" , DetailPage : "ZUI5_HR_Resignation.ZUI5_HR_ResignationDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Resignation.html?_gAuth=E" ,
	 	   Type : "C1", Title : "사직원" },  // 사직원 신청
	 	 { ZreqForm : "PA02" , DetailPage : "ZUI5_HR_RecRequest.ZUI5_HR_RecRequestDetail", 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/recrequest.html?_gAuth=E" ,
	 	   Type : "C1", Title : "인원충원서" },  // 충원요청서
	 	 { ZreqForm : "PA03" , DetailPage : "ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/actionrequest.html?_gAuth=E" ,
	 	   Type : "C1", Title : "내신서" },  // 내신서
	 	 { ZreqForm : "PD01" , DetailPage : "ZUI5_HR_Transition.ZUI5_HR_TransitionDetail", 
	   	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Transition.html?_gAuth=E" ,
	 	   Type : "C1", Title : "업무인수인계서" },  // 인수인계서 작성
	 	 { ZreqForm : "TM01" , DetailPage : "ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail",
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/changeshift.html?_gAuth=E",
		   Type : "A1", Title : "근무편제변경 신청"},	// 근무편제변경 신청
//	 	 { ZreqForm : "" , DetailPage : "ZUI5_HR_WorkScheduleType.ZUI5_HR_WorkScheduleTypeList",
//		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/WorkScheduleType.html?_gAuth=E",
//		   Type : "A1", Title : "근무형태별 근무일정 조회"},	// 근무형태별 근무일정 조회
	 	 { ZreqForm : "TM02" , DetailPage : "ZUI5_HR_ExcWork.ZUI5_HR_ExcWorkDetail" ,
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/excwork.html?_gAuth=E",
		   Type : "A1", Title : "예외근무신청"},	 // 예외근무신청
	 	 { ZreqForm : "TM03" , DetailPage : "ZUI5_HR_AnnualLeave.ZUI5_HR_AnnualLeaveDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/AnnualLeave.html?_gAuth=E", 
	 	   Type : "A1", Title : "연간휴가신청"},  // 연간휴가신청
	 	 { ZreqForm : "TM04" , DetailPage : "ZUI5_HR_VacationRequest.ZUI5_HR_VacationRequestDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/VacationRequest.html?_gAuth=E",
	 	   Type : "A1", Title : "휴가신청" },  // 휴가신청
	 	 { ZreqForm : "TM05" , DetailPage : "ZUI5_HR_VacationRequestEN.ZUI5_HR_VacationRequestDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/VacationRequestEN.html?_gAuth=E", 
	 	   Type : "A1", Title : "휴가신청(영문)" },  // 휴가신청(영문)
	 	 { ZreqForm : "TM06" , DetailPage : "ZUI5_HR_VacationChange.ZUI5_HR_VacationChangeDetail", 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/VacationChange.html?_gAuth=E",
	 	   Type : "A1", Title : "휴가 변경/취소 신청"  },	// 휴가 변경/취소 신청
	 	 { ZreqForm : "TM11" , DetailPage : "ZUI5_HR_SickLeave.ZUI5_HR_SickLeaveDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/sickleave.html?_gAuth=E",
	 	   Type : "A1", Title : "병가 신청" },  // 병가신청
	 	 { ZreqForm : "TM21" , DetailPage : "ZUI5_HR_VacationDispatch.ZUI5_HR_VacationDispatchDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/VacationDispatch.html?_gAuth=E",
	 	   Type : "A1", Title : "파견직 근태 신청"},  // 파견직 근태 신청
	 	 { ZreqForm : "TM22" , DetailPage : "ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/VacationDispatchChange.html?_gAuth=E",
	 	   Type : "A1", Title : "파견직 근태 변경/취소 신청"},  // 파견직 근태 변경/취소 신청
	 	 { ZreqForm : "TM31" , DetailPage : "ZUI5_HR_ParentalLeave.ZUI5_HR_ParentalLeaveDetail", 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/parentalleave.html?_gAuth=E",
	 	   Type : "A1", Title : "출산휴가/육아휴직 신청"  },	// 병가/출산휴가/육아휴직 변경/취소
	 	 { ZreqForm : "TM32" , DetailPage : "ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail", 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/VacationSickAndBabyChange.html?_gAuth=E",
	 	   Type : "A1", Title : "병가/출산휴가/육아휴직 변경/취소 신청"  },	// 병가/출산휴가/육아휴직 변경/취소
	 	   
	 	 { ZreqForm : "TM41" , DetailPage : "ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/OvertimeOrder.html?_gAuth=E",
	 	   Type : "A1", Title : "특근명령서" },  // 특근명령서
	 	 { ZreqForm : "TM43" , DetailPage : "ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail" ,
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/OvertimeConfirm.html?_gAuth=E",
	 	   Type : "A1", Title : "특근확인서"},  // 특근확인서
	 	 { ZreqForm : "TM42" , DetailPage : "ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/OvertimeOrderCancel.html?_gAuth=E",
	 	   Type : "A1", Title : "특근취소 신청" },  // 특근명령 취소신청
	 	 { ZreqForm : "TM51" , DetailPage : "ZUI5_HR_OverseasBusinessTrip.ZUI5_HR_OverseasBusinessTripDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/HolidayDelegateTask.html?_gAuth=E",
	 	   Type : "A1", Title : "휴일대근 신청" },  // 휴일대근 신청
	 	 { ZreqForm : "TM61" , DetailPage : "ZUI5_HR_FlexWork.ZUI5_HR_FlexWorkDetail", },	// 근무시간 사후확인서
	 	 { ZreqForm : "TM71" , DetailPage : "ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail",
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/WorktimeRecordException.html?_gAuth=E",
	 	   Type : "A1", Title : "근태기록부(예외자)" },   // 근태기록부(예외자)
	 	 { ZreqForm : "BE01" , DetailPage : "ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/ForeignLanguage.html?_gAuth=E", 
	 	   Type : "F1", Title : "외국어 학습비/시험 비용 신청"  },  // 외국어 학습비 신청
	 	 
//	 	 { ZreqForm : "BE02" , DetailPage : "ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageExam", Type : "C1", },  // 외국어 시험 신청
	 	 { ZreqForm : "BE05" , DetailPage : "ZUI5_HR_Resort.ZUI5_HR_ResortDetail" ,
	       Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Resort.html?_gAuth=E",
	 	   Type : "F1", Title : "휴양소 신청"},  // 휴양소 신청
	 	 { ZreqForm : "BE06" , DetailPage : "ZUI5_HR_Resort.ZUI5_HR_ResortDetail" },	// 공장 휴양소 신청			
	 	 { ZreqForm : "BE11" , DetailPage : "ZUI5_HR_CompanyHouse.ZUI5_HR_CompanyHouseDetail",
	 		Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/companyhouse.html?_gAuth=E",
	 		Type : "F1", Title : "사택 입/퇴거 신청" },  // 사택 입주신청
//	 	 { ZreqForm : "BE12" , DetailPage : "ZUI5_HR_CompanyHouse.ZUI5_HR_CompanyHouseDetail1" },  // 사택 퇴거신청
	 	 { ZreqForm : "BE13" , DetailPage : "ZUI5_HR_Smock.ZUI5_HR_SmockDetail",
	 		Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Smock.html?_gAuth=E",
	 		Type : "F1", Title : "작업복 신청"},  // 방염 작업복 신청 
	 	 { ZreqForm : "BE14" , DetailPage : "ZUI5_HR_ChangeAccount.ZUI5_HR_ChangeAccountDetail",
	 			Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/ChangeAccount.html?_gAuth=E", 
	  		   Type : "G1", Title : "계좌변경 신청 "},  // 계좌변경 신청 
//	 	 { ZreqForm : "BE15" , DetailPage : "ZUI5_HR_OverseasBusinessTrip.ZUI5_HR_OverseasBusinessTripDetail" },  // 주택보조금
	 	 { ZreqForm : "GA01" , DetailPage : "ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail" , 
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/volunteer.html?_gAuth=E", 
		   Type : "D1", Title : "사회봉사계획서/보고서"},	// 	사회봉사계획서	
//	 	 { ZreqForm : "GA02" , DetailPage : "ZUI5_HR_Volunteer.ZUI5_HR_VolunteerDetail", Type : "D1", Title : "사회봉사보고서(공장)" },  // 사회봉사보고서
//	 	 { ZreqForm : "GA03" , DetailPage : "ZUI5_HR_Card.ZUI5_HR_CardDetail" , Type : "D1", Title : "자원봉사 활동 결과보고서(CP문서)"},  // 자원봉사 활동 결과보고서
	 	 { ZreqForm : "DO01" , DetailPage : "ZUI5_HR_Card.ZUI5_HR_CardDetail" ,
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/bookrequest.html",
	 	   Type : "E1", Title : "도서신청"},  // 도서신청
	 	 { ZreqForm : "DO02" , DetailPage : "ZUI5_HR_Card.ZUI5_HR_CardDetail" , 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/bookbuy.html",
	 	   Type : "E1", Title : "구독희망도서신청"},  // 구독희망도서신청
	 	 { ZreqForm : "K1" , DetailPage : "ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail" , 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/MealRequest.html",
	 	   Type : "F1", Title : "도시락 신청"},  // 도시락 신청
	 	
],


	onInit : function() {

//		if (!jQuery.support.touch) {
//			this.getView().addStyleClass("sapUiSizeCompact");
//		};

		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this)
		});

		this.getView().addEventDelegate({
			onAfterShow : jQuery.proxy(function(evt) {
				this.onAfterShow(evt);
//				this.onBeforeShow(evt);
			}, this),
		});

		var bus = sap.ui.getCore().getEventBus();
		bus.subscribe("app", "OpenWindow", this.SmartSizing,
				this);
 
		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing,
				this);
	},

	onBeforeShow : function(event) {
		var oController = this ;
		
		var vData = {Data : {}};
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		var vEname = "";
		var vPernr = "";
		var vPhoto = ""; 
		
		if(vEmpLoginInfo.length > 0){
			var OneData = {};
			// 대상자
			vEname = vEmpLoginInfo[0].Ename ;
			vPernr = vEmpLoginInfo[0].Pernr ;
			vPhoto = vEmpLoginInfo[0].Photo ;
			oController._vPernr = vEmpLoginInfo[0].Pernr ;
		}
			
		vData.Data.summary = ""; 
		vData.Data.Pernr = vPernr;
		vData.Data.Ename = vEname;
		vData.Data.Photo = vPhoto;
		
		if(_gAuth == "E"){
			vData.Data.introText = "총 보상 (Total Rewards)은 급여, 복리후생, 교육 및 Work-Life Balance의 네가지 구분항목으로 구성되고 있습니다.\n세부내역 확인은 각 구분항목 메뉴에서 확인하실 수 있습니다.";
		}else if(_gAth == "H"){
			
		}
		// Header 설정
		oController._DetailJSonModel.setData(vData);
		
		
		// 
		var vListData = {Data : { Pernr : vPernr  }};
		oController._ListCondJSonModel.setData(vListData);
	
		
		
		
		
		
//		var vData = {Data : {}};
//		
//		oController._ListCondJSonModel.setData()
	/*	
		var oMENU1 = sap.ui.getCore().byId("MENU1"),
		oModel = oMENU1.getModel(),
		oMENU2 = sap.ui.getCore().byId("MENU2"),
		oModel2 = oMENU2.getModel(),
		vData = { Data : []},
		vData2 = { Data : []};
		
		// 초성 추가
		oController._DocumentPage.forEach(function(element) {
			var vTemp = {};
			vTemp.text = element.Title ;
			vTemp.description = element.Title ;
			vTemp.key = element.ZreqForm ;
			vTemp.url = element.Url;
			
			// 근태
			if(element.Type == "A1"){
				var vTemp2 = {};
				vTemp2.text = element.Title ;
				vTemp2.url = element.Url ;
				vData.Data.push(vTemp2);
			}else if(element.Type == "F1"){
				var vTemp2 = {};
				vTemp2.text = element.Title ;
				vTemp2.url = element.Url ;
				vData2.Data.push(vTemp2);
			}
			oController._ReqPage.push(vTemp);
		});
		oModel.setData(vData);
		oModel2.setData(vData2);
		
		
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		vEmpLoginInfo[0].Ename ;
		
		
		var oImage = sap.ui.getCore().byId("IMAGE");
		oImage.setSrc(vEmpLoginInfo[0].Photo);
		
		
//        // object 에 초성필드 추가 {name:"홍길동", diassembled:"ㅎㄱㄷ"}
//        arr.forEach(function (item) {
//            var dis = Hangul.disassemble(item.name, true);
//            var cho = dis.reduce(function (prev, elem) {
//                elem = elem[0] ? elem[0] : elem;
//                return prev + elem;
//            }, "");
//            item.diassembled = cho;
//        });
//
//	
//		oModel.setData(vData);
		
//		oController.searchApply(oController);
//		oController.searchSign(oController);
*/
		var oSNav = sap.ui.getCore().byId("SNav"),
		oModel = oSNav.getModel();
		var navContainer = sap.ui.getCore().byId("navContainer");
		navContainer.destroyPages();
		
		var vMenuData = {navigation : []}, vTemp = {}, oPages = []; 
		var vHeight = window.innerHeight-50+"px";
		
		
		
		
		navContainer.addPage(
				new sap.m.ScrollContainer("Home",{
					vertical: true,
//					height : window.innerHeight-50+"px",
					height : "100%",
					horizontal: false,
					content: [
						sap.ui.jsfragment("ZUI5_HR_ChartTest4.fragment.ChartTestPage04",oController),
					]
				})
			);
		
		
		
		for(var i = 0 ; i < oController._HeaderPage.length ; i++){
			vTemp = {};
			vTemp.title =  oController._HeaderPage[i].Title;
			vTemp.expanded =  false;
			vTemp.icon = oController._HeaderPage[i].Icon;
			vTemp.items = [];
			for(var j=0; j< oController._DocumentPage.length; j++){
				if(oController._HeaderPage[i].Type == oController._DocumentPage[j].Type ){
					vTemp.items.push({title : oController._DocumentPage[j].Title , key : oController._DocumentPage[j].ZreqForm , favoriteyn : "" });
//					vTemp.items.push({title : oController._DocumentPage[j].Title});
					
					navContainer.addPage(
							new sap.m.ScrollContainer(oController._DocumentPage[j].ZreqForm,{
								vertical: true,
								height: "100%",
//								height : window.innerHeight-52+"px",
								horizontal: false,
								content: [
									new sap.ui.core.HTML({
										content : ["<iframe id='iWorkerPDF' name='iWorkerPDF' src='" + oController._DocumentPage[j].Url +"' width='100%' height='100%' frameborder='0' border='0' scrolling='no'></>"],
										preferDOM : false
									})
								]
							})
						);
					var vTemp2 = {};
					vTemp2.text = oController._DocumentPage[j].Title ;
//					vTemp2.description = oController._DocumentPage[j].Title ;
//					vTemp2.icon = 'sap-icon://monitor-payments';
					vTemp2.key = oController._DocumentPage[j].ZreqForm ;
					vTemp2.url = oController._DocumentPage[j].Url;
					oController._ReqPage.push(vTemp2)
				}
			}
			vMenuData.navigation.push(vTemp);
		};
		
		oModel.setData(vMenuData);
		

//		var oNList = sap.ui.getCore().byId("NList");
//		oNList.destroyItems();
//		
//		
//		
//		var oItem = new sap.tnt.NavigationListItem({
//			icon: 'sap-icon://eam-work-order',
//			text : "근태신청",
//			items : [
////				new sap.tnt.NavigationListItem({
//				new ZUI5_HR_ChartTest4.control.XNavigationListItem({
//					icon: 'sap-icon://eam-work-order',
//					text : "근태신청",
//				})
//			]
//		});
//		oNList.addItem(oItem);	
	},

	onAfterShow : function(event) {
		var oController = this ;
		this.SmartSizing(event);	
		oController.searchApply(oController);
		oController.searchSign(oController);
		oController.searchVacation(oController);
		oController.searchEmployee(oController);
//		oController.searchWork(oController);
		
		
//		sap.ui.getCore().byId(oController.PAGEID + "_PlanningCalendar");
	},
	
	searchApply : function(oController){
		
		var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_TILE_SRV/", true, undefined, undefined, { "Cache-Control": "max-age=0"}, undefined, undefined, true);
		  var oView = this.getView();
		  var oController = this.getView().getController() ;
		  var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
		
		  var vSummaryData = [];
		  var vData = {results : {
			  Cnt01 : 0,
			  Cnt02 : 0,
			  Cnt03 : 0,
			  Cnt04 : 0,
			  Prdtx : "",
		  }};

		  oModel.read("/HrApplySet",
				null, 
				null, 
				true, 
				function(oData, oResponse) {
					if(oData) {
						var oneData = oData.results[0] ;
						oneData.Cnt01 = oData.results[0].Cnt01 * 1;
						oneData.Cnt02 = oData.results[0].Cnt02 * 1;
						oneData.Cnt03 = oData.results[0].Cnt03 * 1;
						vData.results = oneData;
//						readAfterProcess();
						oController._JSonModel.setData(vData);
						oController.readAfterProcess(oController);
					    
					}else{
					  oController._JSonModel.setData(vData);
					  oController.readAfterProcess(oController);
					}
				},
				function(oResponse) {
					console.log(oResponse);
				}
		  );
		
	},
	
	searchVacation : function(oController){
		var vData = { results : {
		    CntBl1: 14,
			CntBl2: 3,
			CntBl3: 2,
			CntCr1: 20,
			CntCr2: 5,
			CntCr3: 5,
			Text1: "발생:20/잔여:14.5",
			Text2: "발생:5/잔여:3",
			Text3: "발생:2"
		
		} } ;
	
	oController._JSonModel3.setData(vData);
		
	},
	
	searchSign : function(oController){
		var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_TILE_SRV/", true, undefined, undefined, { "Cache-Control": "max-age=0"}, undefined, undefined, true);
		var oView = this.getView();
		var oController = this.getView().getController() ;
		  
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0;
		
		var vSummaryData = [];
		
		var vData = {
			results : {			
			  Cnt01 : 0,
			  Cnt02 : 0,
			  Cnt03 : 0,
			  Prdtx : ""
			}
		};

	  oModel.read("/HrApprovalSet",
			null, 
			null, 
			true, 
			function(oData, oResponse) {
				if(oData.results && oData.results.length > 0) {
					var oneData = oData.results[0] ;
					oneData.Cnt01 = oData.results[0].Cnt01 * 1;
					oneData.Cnt02 = oData.results[0].Cnt02 * 1;
					oneData.Cnt03 = oData.results[0].Cnt03 * 1;
					vData.results = oneData;
					oController._JSonModel2.setData(vData);
					oController.readAfterProcess2(oController);

				}else{
			        oController._JSonModel2.setData(vData);
					oController.readAfterProcess2(oController);
				}
			},
			function(oResponse) {
				console.log(oResponse);
			}
	  );	
		
	},
	
	
	/* 근무현황, 근무시간 조회 */
	searchWork : function(oController){
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		var oListCondData = oController._ListCondJSonModel.getProperty("/Data");
		var oPlanningCalendar = sap.ui.getCore().byId(oController.PAGEID + "_PlanningCalendar");
		var oJSONModel1 = oPlanningCalendar.getModel();
		
		var vData1 = {Data : [{
			 Atext: "기본근무"
			 ,Beguz: "0900"
			 ,Enduz: "1800"
			 ,Maxtm: "24"
			 ,Pernr: "02606475"
			 ,Prcty: ""
			 ,Statm: "0000"
//			 ,Tmdat: "/Date(1570752000000)/"
			 ,Tmmsg: "09:00~18:00 (8)"
			 ,Tmtim: "     8.00"
			 ,Tmtyp: "1"
			},
			{	Appno: "0000006993"
				,Atext: "중식"
				,Beguz: "1200"
				,Enduz: "1300"
				,Maxtm: "24"
				,Pernr: "02606475"
				,Prcty: ""
				,Statm: "0000"
//				,Tmdat: "/Date(1570752000000)/"
				,Tmmsg: "(1)"
				,Tmtim: "     1.00"
				,Tmtyp: "4"
				
			},
			{	Appno: "0000006993"
				,Atext: "반차(오후)"
				,Beguz: "1400"
				,Enduz: "1800"
				,Maxtm: "24"
				,Pernr: "02606475"
				,Prcty: ""
				,Statm: "0000"
//				,Tmdat: "/Date(1570752000000)/"
				,Tmmsg: "14:00~18:00 (4)"
				,Tmtim: "     4.00"
				,Tmtyp: "2"
				
			}
		]};
	
	
		var oRow = sap.ui.getCore().byId(oController.PAGEID + "_PlanningCalendarRow");
		oRow.destroyAppointments();
		
		for(var i=0; i<vData1.Data.length; i++){
			var vTemp , oDate;
			oDate = new Date();
			
			var oneData = vData1.Data[i];
			
			if(oneData.Beguz == "" || parseFloat(oneData.Tmtim) == 0) continue;
			
			var oColor = "";
			
			switch( oneData.Tmtyp ){
				case "1" :
					oColor = "#91C8F6";
					break;
				case "2" :
					oColor = "#ABE2AB";
					break;
				case "3" :
					oColor = "#FF8888";
					break;
				case "4" :
					oColor = "#FABD64";
					break;
				default : 
					oColor = "#91C8F6";
			}
			
			var oStartDate =  new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate(),
									   parseInt(oneData.Beguz.substring(0,2)), parseInt(oneData.Beguz.substring(2,4)));
			
			var oEndDate = "";
			if(parseInt(oneData.Beguz) > parseInt(oneData.Enduz)){
				oEndDate = new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate()+1, 
									   parseInt(oneData.Enduz.substring(0,2)), parseInt(oneData.Enduz.substring(2,4)))
			} else {
				oEndDate = new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate(), 
	 					   			   parseInt(oneData.Enduz.substring(0,2)), parseInt(oneData.Enduz.substring(2,4)))
			}
			
			oRow.addAppointment(
				new sap.ui.unified.CalendarAppointment({
					startDate : oStartDate,
				 	endDate : oEndDate,
					    title : oneData.Atext,
					    text : oneData.Tmmsg,
					    color : oColor,
					    key : oneData.Beguz.substring(0,2) + ":" + oneData.Beguz.substring(2,4) + " ~ " +
					    	  oneData.Enduz.substring(0,2) + ":" + oneData.Enduz.substring(2,4)	+ " (" + parseFloat(oneData.Tmtim.trim()) + ")" // 상세현황 조회를 위해서 시간 데이터 넣어준다.
				})
			);
		}
	},

	searchEmployee : function(oController){
		  var oCommonModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZL2P01GW9000_SRV/", true, undefined, undefined, { "Cache-Control": "max-age=0"}, undefined, undefined, true);
		  var oDatas = {results: { pic : "" , Ename : "", 
				                  Zzjikgbt : "", Zzjiktlt : "", 
				                  Pbtxt : "", Stext : "" }};
		  var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		  var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		  var vPernr = vEmpLoginInfo[0].Pernr;
	
		  if(vPernr == ""){
			  oController._JSonModel1.setData(oDatas);
			  return ;
		  }
		  
		  var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		  var curDate = new Date();
		  var filterString = "?$filter=Actda%20eq%20datetime%27" + dateFormat.format(curDate) + "T00%3a00%3a00%27" 
		                    + " and Ename eq '" + vPernr + "'"; 
			   filterString += " and Actty eq 'E'";	// 권한 추가 
		   oCommonModel.read("/EmpSearchResultSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							var vOrgeh = "";
							vOrgeh = oData.results[0].Fulln;
							
							oDatas = {results: {pic : oData.results[0].Photo, Ename : oData.results[0].Ename, 
								                   totalOrgeh : vOrgeh ,
								                   Stetx : oData.results[0].Stetx ,
								                   Zzjikgbt : oData.results[0].Zzjikgbt, Zzjiktlt : oData.results[0].Zzjiktlt, 
								                   Pbtxt : oData.results[0].Pbtxt, Stext : oData.results[0].Pbtxt }};
						}
					},
					function(oResponse) {
					}
			);
		   
			oController._JSonModel1.setData(oDatas);
		
	},
	
	
	onInitControl : function(oController, _vZappStatAl ){
		
	},
	
	onBack : function(event){
	},

	doSuggest : function(event){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List");
		var oController = oView.getController();
		
		oController.onSuggest(event);
		if (true || event.getSource() === barSearchField || event.getParameter("suggestValue")){
			event.getSource().suggest();
		}
	},
	
	onSuggest : function(event){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List");
		var oController = oView.getController();
		var value = event.getParameter("suggestValue");
		var newData;
		if (value) {
			value = value.toUpperCase();
			newData = oController._ReqPage.filter(function(item){
				return (item.text || "").toUpperCase().indexOf(value) > -1 || (item.description || "").toUpperCase().indexOf(value) > -1;
			});
		} else {
			newData = oController._ReqPage.slice();
		}
		event.getSource().getModel().setData(newData);
		
	},
	
	onSearch : function(event){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List");
		var oController = oView.getController();
		var item = event.getParameter("suggestionItem");
		if (item && item.getKey()) {
			for(var i =0; i< oController._ReqPage.length; i++){
				if(item.getKey() == oController._ReqPage[i].key){
					window.open(oController._ReqPage[i].url);
					break;
				}
			}
			//검색박스 초기화
			event.oSource.setValue("");
		}
		
	},
	
	readAfterProcess : function(oController){
		var vData = oController._JSonModel.getData();
	    var vSummaryData = [];
		  
		if(vData.results){
			if(vData.results.Cnt01 == 0 &&
			    vData.results.Cnt02 == 0 &&
			    vData.results.Cnt03 == 0 &&
			    vData.results.Cnt04 == 0  ){
			    vSummaryData.push({label : "" , value : 1, color : "#f5f5f5", highlight: "#f5f5f5"});
			   
		    }else{
				vSummaryData.push({label : "신청" , value : vData.results.Cnt01, color : "#FABD64", highlight: "#FABD64"});
				vSummaryData.push({label : "승인" , value : vData.results.Cnt02, color : "#2ecc71", highlight: "#2ecc71"});
				vSummaryData.push({label : "반려" , value : vData.results.Cnt03, color : "#FF8888", highlight: "#FF8888"});
		    }
		
		    if(document.getElementById("chart-area")){
			    var ctx = document.getElementById("chart-area").getContext("2d");
			    window.myPie = new Chart(ctx).Pie(vSummaryData);
		    }
				  

		}
	},
	
	readAfterProcess2 : function(oController){
		var vData = oController._JSonModel2.getData();
	    var vSummaryData = [];
	    
	    if(vData.results){
		  if(vData.results.Cnt01 == 0 && vData.results.Cnt02 == 0 && vData.results.Cnt03 == 0){
			  vSummaryData.push({ value : 1, color : "#f5f5f5", highlight: "#f5f5f5"});					  
		  }else{
			  vSummaryData.push({ value : vData.results.Cnt01, color : "#FABD64", highlight: "#FABD64"});
			  vSummaryData.push({ value : vData.results.Cnt02, color : "#2ecc71", highlight: "#2ecc71"});
			  vSummaryData.push({ value : vData.results.Cnt03, color : "#FF8888", highlight: "#FF8888"});
		  }
		  
		  if(document.getElementById("chart-area2")){
			  var ctx = document.getElementById("chart-area2").getContext("2d");
			  window.myPie = new Chart(ctx).Pie(vSummaryData);
		  }
	    }
	},
	
	SmartSizing : function(event){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List");
		var oController = oView.getController();
//		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TotalTable2"),
//			vCount = parseInt(( window.innerHeight-600 ) / 33) ;
//		
//		if(oTable) oTable.setVisibleRowCount(vCount);
		
//		oController.readAfterProcess(oController);
	},
	
	openFavorite : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List");
		var oController = oView.getController();
		
		if(!oController._FavoriteDialog) {
			oController._FavoriteDialog = sap.ui.jsfragment("ZUI5_HR_ChartTest4.fragment.FavoriteDialog", oController);
			oView.addDependent(oController._FavoriteDialog);
		}
		
		var oFavoriteDialog = sap.ui.getCore().byId(oController.PAGEID + "_FavoriteDialog");
		oFavoriteDialog.destroyContent();
		
		/*
		 *  List 조회 
		 */
		
		var oLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true,
			content :  [ ],
		}).addStyleClass("LeftAlign");
		
		for(var i = 0 ; i < oController._HeaderPage.length ; i++){
			oLayout.addContent(
				new sap.m.Toolbar({
					content : [
						new sap.m.ToolbarSpacer({width : "10px"}),
						new sap.m.Text({
							text : oController._HeaderPage[i].Title
						}).addStyleClass("L2PFontFamilyBold"),
					]
				}).addStyleClass("L2PToolbarNoBottomLine")
			);
			
			for(var j=0; j< oController._DocumentPage.length; j++){
				if(oController._HeaderPage[i].Type == oController._DocumentPage[j].Type ){
					oLayout.addContent(
							new sap.ui.layout.VerticalLayout({
								width : "250px",
								content : [ new sap.m.Toolbar({
									content : [
										new sap.m.ToolbarSpacer({width : "10px"}),
										new sap.m.RatingIndicator(oController.PAGEID + "_" + oController._DocumentPage[j].ZreqForm + "_Favorite",{
											maxValue : 1,
											value : oController._DocumentPage[j].favoriteyn
										}),
										new sap.m.ToolbarSpacer({width : "10px"}),
										new sap.m.Text({
											text : oController._DocumentPage[j].Title
										}).addStyleClass("L2PFontFamily"),
									]
								}).addStyleClass("L2PToolbarNoBottomLine")
								]
							}).addStyleClass("PSNCPaddingLeft10px L2PPaddingTop5 L2PPaddingBottom5")
						);
				}
			}
		};
		oFavoriteDialog.addContent(oLayout);
		oController._FavoriteDialog.open();
	},
	
	onConfirmFavoriteDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List");
		var oController = oView.getController();
		var vData = { Data : [] };
		for(var j=0; j< oController._DocumentPage.length; j++){
			var oFavorite = sap.ui.getCore().byId(oController.PAGEID + "_" + oController._DocumentPage[j].ZreqForm + "_Favorite");
			if(oFavorite){
				oController._DocumentPage.favoriteyn =  oFavorite.getValue();
				if(oFavorite.getValue() == 1){
					vData.Data.push(oController._DocumentPage[j]);
				}
			}else{
				oController._DocumentPage.favoriteyn = 0;
			}	
		}
		oController._FavoriteJSonModel.setData(vData);
		oController._FavoriteDialog.close();
		// 메인 페이지 즐겨 찾기 화면 설정
	},
	
	/////////////////////////////////////////////////////////////
	// Total Reward 
	onOpenDashboard : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List");
		var oController = oView.getController();
		if(!oController._TotalRewardDialog) {
			oController._TotalRewardDialog = sap.ui.jsfragment("ZUI5_HR_ChartTest4.Tfragment.TotalRewardDialog", oController);
			oView.addDependent(oController._TotalRewardDialog);
		}
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable1"),
		oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable2"),
		oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable3");
		
		oTable.setVisible(false);
		oTable2.setVisible(false);
		oTable3.setVisible(false);
		
		oTable.setVisibleRowCount(1);
		oTable2.setVisibleRowCount(1);
		oTable3.setVisibleRowCount(1);
		
		oTable.getModel().setData({Data : [] });
		oTable2.getModel().setData({Data : [] });
		oTable3.getModel().setData({Data : [] });
		
		oController._TotalRewardDialog.open();
	},
	
	_AddPersonDialog : null,
	
	EmpSearchByTx :function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List"),
			oController = oView.getController(),
			oControl = oEvent.getSource(),
			vEname = oControl.getValue(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = {EmpSearchResultSet : []};
		
		common.SearchUserList.oController = oController;
		oController._vEnamefg = "";
		
		if(!vEname || vEname == "") {
			if(oController._ListCondJSonModel.getProperty("/Data")) {
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
				curDate = new Date();
			
			try {
				oCommonModel.read("/EmpSearchResultSet", {
					async: false,
					filters: [
						new sap.ui.model.Filter('Persa', sap.ui.model.FilterOperator.EQ, '1000'),
						new sap.ui.model.Filter('Actda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(curDate)),
						new sap.ui.model.Filter('Ename', sap.ui.model.FilterOperator.EQ, vEname),
						new sap.ui.model.Filter('Stat1', sap.ui.model.FilterOperator.EQ, '3'),
						new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth)
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
					sap.m.MessageBox.alert(oController.ErrorMessage, {title : "오류"});
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
	
	displayEmpSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List"),
			oController = oView.getController();
		
		if(oEvent){
			oController._oControl = oEvent.getSource();
			oController._vEnamefg = "";
		}
		
		//각 발령대상자의 발령일을 검색조건으로 설정한다.
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		if(oActda) oController._vActda = oActda.getValue();
		
		common.SearchUserList.oController = oController;
		common.SearchUserList.fPersaEnabled = false;
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearchList", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		
		oController._AddPersonDialog.open();
		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		jQuery.sap.require("common.SearchOrg");

		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List"),
			oController = oView.getController();
		
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
		jQuery.sap.require("common.SearchOrg");

		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List"),
			oController = oView.getController();
		
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List"),
			oController = oView.getController(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet"),
			mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp"),
			vActionSubjectList_Temp = {ActionSubjectListSet : []},
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"), 
			vIDXs = oTable.getSelectedIndices();
		
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(vIDXs.length > 1){
				sap.m.MessageBox.alert("대상자는 한명만 선택이 가능합니다.");
				return;
			}else if(vIDXs.length < 1){
				sap.m.MessageBox.alert("대상자는 선택하여 주세요.");
				return;
			}
			
			var vControlId = common.Common.getControlId(oController, oController._oControl.getId()),
				_selPath = oTable.getContextByIndex(vIDXs[0]).sPath;
			
			if(vControlId.Id && vControlId.Id != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id, mEmpSearchResult.getProperty(_selPath + "/Ename"));
			if(vControlId.Key && vControlId.Key != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,mEmpSearchResult.getProperty(_selPath + "/Pernr"));
		
		}else {
			sap.m.MessageBox.alert("대상자를 선택하여 주십시오.", {title : "오류"});
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List"),
			oController = oView.getController(),
			vControlId = common.Common.getControlId(oController, oController._oControl.getId());
		
		if(vControlId.Id && vControlId.Id != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
		if(vControlId.Key && vControlId.Key != "")
			oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
		
		oController._AddPersonDialog.close();
	},
	
	// 리스트 조회
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List"),
			oController = oView.getController();
		var vData = oController._DetailJSonModel.getData();
		var oModel = sap.ui.getCore().getModel("ZHR_TOTALREWARD_SRV"),
			aFilters = [];
		
//		// 테이블 sort, filter 제거
//		for(var i=0; i<oColumns.length; i++){
//			oColumns[i].setSorted(false);
//			oColumns[i].setFiltered(false);
//		}
		
		
		var SeachCon = oController._ListCondJSonModel.getProperty("/Data");
		
		if(common.Common.checkNull(SeachCon.Pernr)) {
			sap.m.MessageBox.show("조회할 사번을 입력하세요.", {});
			return;
		}
	
		if(common.Common.checkNull(SeachCon.Zyear)) {
			sap.m.MessageBox.show("조회연도를 입력하세요.", {});
			return;
		}
		
		aFilters.push(new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, SeachCon.Pernr));
		aFilters.push(new sap.ui.model.Filter('Zyear', sap.ui.model.FilterOperator.EQ, SeachCon.Zyear));
		
		
		var introText = vData.Data.introText,
		errData = {};
		
		function fIcon(fId, fVal){
			var oControl = sap.ui.getCore().byId(oController.PAGEID +"_" + fId);
			
			oControl.removeStyleClass("L2PFontRed");
			oControl.removeStyleClass("L2PFontBlue");
			oControl.removeStyleClass("L2PFontBlack");
			
			if(fVal == "="){
				oControl.addStyleClass("L2PFontBlack");
				return "-";
			}else if(fVal == "+"){
				oControl.addStyleClass("L2PFontRed");
				return "▲";
			}else if(fVal == "-"){
				oControl.addStyleClass("L2PFontBlue");
				return "▼";
			}
		}
		
		function Search() {
			var Datas = {Data : {}},
				OneData = {},
				totalSum = 0,
				vIdx = 1;
			
			oModel.read("/PerRewardSummarySet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						OneData = data.results[0];
						OneData.Total = common.Common.numberWithCommas(OneData.Total);
						OneData.Benef = common.Common.numberWithCommas(OneData.Benef);
						OneData.BenefDif = common.Common.numberWithCommas(OneData.BenefDif);
						OneData.Salry = common.Common.numberWithCommas(OneData.Salry);
						OneData.SalryDif = common.Common.numberWithCommas(OneData.SalryDif);
						OneData.Edurg = common.Common.numberWithCommas(OneData.Edurg);
						OneData.EdurgDif = common.Common.numberWithCommas(OneData.EdurgDif);
						OneData.Wlbrg = common.Common.numberWithCommas(OneData.Wlbrg);
						OneData.WlbrgDif = common.Common.numberWithCommas(OneData.WlbrgDif);
						OneData.CIcon1 = fIcon("CIcon1", OneData.SalrySign);
						OneData.CIcon2 = fIcon("CIcon2", OneData.BenefSign);
						OneData.CIcon3 = fIcon("CIcon3", OneData.EdurgSign);
						OneData.CIcon4 = fIcon("CIcon4", OneData.WlbrgSign);
						
						OneData.summary = "<p> <span style=\"color:black;font-size:15px;font-family: 'Malgun Gothic' !important;font-weight : bold;\"> '"+ OneData.Ename   +"'</span>" +
				        "<span style=\"color:black;font-size:15px;font-family: 'Malgun Gothic' !important;\"> 님의 노고에 감사 드립니다.</span></p>"+
				        "<p> <span style=\"color:black;font-size:15px;font-family: 'Malgun Gothic' !important;font-weight : bold;\">'" + OneData.Ename +"'</span>" +
				        "<span style=\"color:black;font-size:15px;font-family: 'Malgun Gothic' !important;\"> 님의 " + OneData.Zyear + "년 총 보상은 </span></p>"+
				        "<p><span style=\"color:black;font-size:15px;font-family: 'Malgun Gothic' !important;\"> ₩ " + OneData.Total + "</span></p>";
						OneData.introText = introText;
						Datas.Data = OneData;
					}
				},
				
				
				error: function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			oController.BusyDialog.close();
			oController._DetailJSonModel.setData(Datas);
			
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
					}
				});
				return ;
			}
		}
//		
		oController.BusyDialog.open();
		setTimeout(Search, 100);
//		
//		
//		
//		
//		
//		
//		vData.Data.Money = "₩ 200,000,000";
//		vData.Data.CMoney = "₩ 100,000,000";
//		vData.Data.UpDown = "U";
//		vData.Data.CIcon = "▲";
//		
//		vData.Data.Money2 = "₩ 150,000,000";
//		vData.Data.CMoney2 = "₩ 50,000,000";
//		vData.Data.UpDown2 = "U";
//		vData.Data.CIcon2 = "▲";
//		
//		vData.Data.Money3 = "₩ 150,000,000";
//		vData.Data.CMoney3 = "₩ 50,000,000";
//		vData.Data.UpDown3 = "D";
//		vData.Data.CIcon3 = "▼";
//		
//		vData.Data.Money4 = "₩ 50,000,000";
//		vData.Data.CMoney4 = "₩ 50,000,000";
//		vData.Data.UpDown4 = "S";
//		vData.Data.CIcon4 = "-";
		
//		vData.Data.summary = "<p> <span style=\"color:black;font-size:15px;font-family: 'Malgun Gothic' !important;font-weight : bold;\"> '홍길동'  </span>" +
//        "<span style=\"color:black;font-size:15px;font-family: 'Malgun Gothic' !important;\"> 님의 노고에 감사 드립니다.</span></p>"+
//        "<p> <span style=\"color:black;font-size:15px;font-family: 'Malgun Gothic' !important;font-weight : bold;\"> '홍길동'  </span>" +
//        "<span style=\"color:black;font-size:15px;font-family: 'Malgun Gothic' !important;\"> 님의 2019년 총 보상은 </span></p>"+
//        "<p><span style=\"color:black;font-size:15px;font-family: 'Malgun Gothic' !important;\"> ₩ 20,000,000</span></p>";
//		
//		oController._DetailJSonModel.setData(vData);
	},
	
	setOnlyDigit : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List");
		var oController = oView.getController();
		var inputValue = oEvent.getParameter('value').trim(),
		convertValue = inputValue.replace(/[^\d]/g, '');
		
		
		oController._ListCondJSonModel.setProperty("/Data/Datum", convertValue);
	},
	
	onClick1 : function(){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List"),
		oController = oView.getController(),
		oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable1"),
		oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable2"),
		oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable3");
		oTable.setVisible(true);
		oTable2.setVisible(false);
		oTable3.setVisible(false);
		oController.setTable(oController, oTable, "1000");
	},
	
	onClick2 : function(){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List"),
		oController = oView.getController(),
		oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable1"),
		oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable2"),
		oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable3");
		oTable.setVisible(true);
		oTable2.setVisible(false);
		oTable3.setVisible(false);
		oController.setTable(oController, oTable, "2000");
	},
	
	onClick3 : function(){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List"),
		oController = oView.getController(),
		oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable1"),
		oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable2"),
		oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable3");
		oTable.setVisible(false);
		oTable2.setVisible(true);
		oTable3.setVisible(false);
		
		oController.setTable(oController, oTable, "3000");
	},
	
	onClick4 : function(){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List"),
		oController = oView.getController(),
		oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable1"),
		oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable2"),
		oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable3");
		oTable.setVisible(false);
		oTable2.setVisible(false);
		oTable3.setVisible(true);
		
		oController.setTable(oController, oTable, "4000");
	},
	
	setTable : function(oController, oTable, vKey){
		var oModel = sap.ui.getCore().getModel("ZHR_TOTALREWARD_SRV"),
		oTableModel = oTable.getModel(),
		aFilters = [];
		var oColumns = oTable.getColumns()
		// 테이블 sort, filter 제거
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var SeachCon = oController._ListCondJSonModel.getProperty("/Data");
		
		if(common.Common.checkNull(SeachCon.Pernr)) {
			return;
		}
	
		if(common.Common.checkNull(SeachCon.Zyear)) {
			return;
		}
		
		aFilters.push(new sap.ui.model.Filter('Pernr', sap.ui.model.FilterOperator.EQ, SeachCon.Pernr));
		aFilters.push(new sap.ui.model.Filter('Zyear', sap.ui.model.FilterOperator.EQ, SeachCon.Zyear));
		aFilters.push(new sap.ui.model.Filter('Pygrp', sap.ui.model.FilterOperator.EQ, vKey));
		
		function Search() {
			var Datas = {Data : []},
				OneData = {};
			
			oModel.read("/PerRewardDetailSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i=0; i <data.results.length; i++){
							OneData = data.results[i];
							Datas.Data.push(OneData);
						}
					}
				},
				
				error: function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			oController.BusyDialog.close();
			oTableModel.setData(Datas);
			oTable.setVisibleRowCount(Datas.Data.length);
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
					}
				});
				return ;
			}
		}
	//	
		oController.BusyDialog.open();
		setTimeout(Search, 100);
		
		
		oDetailLayout.addRow(oRow);
	},
	
	/////////////////////////////////////////////////////////////
	// Total Reward 끝
	
	
	///////////////////////////////////////////////////////////////
	// Total Reward 부서장 처리 시작
	
	onOpenDashboard2 : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List");
		var oController = oView.getController();
		if(!oController._TotalRewardDialog2) {
			oController._TotalRewardDialog2 = sap.ui.jsfragment("ZUI5_HR_ChartTest4.Tfragment.TotalRewardDialog2", oController);
			oView.addDependent(oController._TotalRewardDialog2);
		}
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TotalTable2");
		oTable.getModel().setData({Data : [] });
		
		oController._TotalRewardDialog2.open();
	},
	
	colorRows : function() {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TotalTable2");
        var rowCount = oTable.getVisibleRowCount(); //number of visible rows
        var rowStart = oTable.getFirstVisibleRow(); //starting Row index
        var oModel = oTable.getModel();
        var currentRowContext;
        for (var i = 0; i < rowCount; i++) {
          currentRowContext = oTable.getContextByIndex(rowStart + i); //content
            // Remove Style class else it will overwrite
            oTable.getRows()[i].$().removeClass("totalreward1");
            oTable.getRows()[i].$().removeClass("totalreward2");
            
            var cellValue = oModel.getProperty("Flag", currentRowContext); // Get Amount
            // Set Row color conditionally
            if (cellValue == "T") {
                oTable.getRows()[i].$().addClass("totalreward1");
            }else if(cellValue == "A"){
            	oTable.getRows()[i].$().addClass("totalreward2");
            }
        }
    },
    
	displayOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List");
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
	
	treeModel : function (arrayList, rootId) {
		  var rootNodes = [];
		  var traverse = function (nodes, item, index) {
		   if (nodes instanceof Array) {
		    return nodes.some(function (node) {
		     if (node.Groupid === item.Parentid) {
		      node.Val2 = node.Val2 || [];
		      return node.Val2.push(arrayList.splice(index, 1)[0]);
		     }
	
		    return traverse(node.Val2, item, index);
		    });
		   }
		  };
	
		 while (arrayList.length > 0) {
		   arrayList.some(function (item, index) {
			if (item.Parentid === rootId) {
		     return rootNodes.push(arrayList.splice(index, 1)[0]);
		    }
		   return traverse(rootNodes, item, index);
		   });
		  }

	 return rootNodes;
	 },
	
	// 리스트 조회
	onPressSearchTotalReward2 : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ChartTest4.ZUI5_HR_ChartTest4List"),
			oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TotalTable2"),
			oTableModel = oTable.getModel(),
			oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh"),
			vOrgeh = "";
			
		var vData = oController._DetailJSonModel.getData();
		var oModel = sap.ui.getCore().getModel("ZHR_TOTALREWARD_SRV"),
			aFilters = [];
		
		var oColumns = oTable.getColumns();
		
		// 테이블 sort, filter 제거
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		
		var SeachCon = oController._ListCondJSonModel.getProperty("/Data");
		
		if(common.Common.checkNull(SeachCon.Zyymm)) {
			sap.m.MessageBox.show("조회연도를 입력하세요.", {});
			return;
		}
	
		
		if(oOrgeh.getCustomData()[0]){
			vOrgeh = oOrgeh.getCustomData()[0].getValue();
		}
//		if(common.Common.checkNull(vOrgeh)) {
//			sap.m.MessageBox.show("부서를 입력하세요.", {});
//			return;
//		}
		
		aFilters.push(new sap.ui.model.Filter('Orgeh', sap.ui.model.FilterOperator.EQ, vOrgeh));
		aFilters.push(new sap.ui.model.Filter('Zyymm', sap.ui.model.FilterOperator.EQ, SeachCon.Zyymm));
		aFilters.push(new sap.ui.model.Filter('Prgrp', sap.ui.model.FilterOperator.EQ, "A"));
		
		function Search() {
			var Datas = {Data : []},
				OneData = {},
				vRootid = "",
				errData = {};
				
			oModel.read("/OrgRewardListSet", {
				async: false,
				filters: aFilters,
				success: function(data,res) {
					if(data && data.results.length) {
						for(var i =0; i < data.results.length; i++){
							var oneData = data.results[i];
							delete oneData.__metadata;
							delete oneData.__proto__; 
							oneData.Val2 = "";
							Datas.Data.push(oneData);
							if(i==0) vRootid = oneData.Parentid;
						}
					}
				},
				
				
				error: function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			oController.BusyDialog.close();
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage, {
					onClose : function() {
					}
				});
				return ;
			}
			
			oTableModel.setData(Datas);
			var vTreeData = Datas.Data.slice();
			var vTemp = { Data : oController.treeModel(vTreeData , vRootid )};
			console.log(vTemp);
			oTable.getModel().setData(vTemp);
			oController.colorRows();
			//oTable.getModel().refresh();
			oController.SmartSizing();
		}
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);
	},
	
});