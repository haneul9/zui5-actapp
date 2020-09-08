sap.ui.controller("ZUI5_HR_ApprovalOverview.ZUI5_HR_ApprovalOverviewList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ApprovalOverview.ZUI5_HR_ApprovalOverviewList
	 */

	PAGEID : "ZUI5_HR_ApprovalOverviewList",
	_ResultModel1 : new sap.ui.model.json.JSONModel(),
	_ResultModel2 : new sap.ui.model.json.JSONModel(),
	_ResultModel3 : new sap.ui.model.json.JSONModel(),
	_ResultModel4 : new sap.ui.model.json.JSONModel(),
	_ResultModel5 : new sap.ui.model.json.JSONModel(),
	_ResultModel6 : new sap.ui.model.json.JSONModel(),
	_ResultModel7 : new sap.ui.model.json.JSONModel(),
	
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",

	
	_DocumentPage : [
		 { ZreqForm : "HR01" , DetailPage : "ZUI5_HR_Medical.ZUI5_HR_MedicalDetail", 
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Medical.html?_gAuth=E" , 
		   Type : "F1", Title : oBundleText.getText("LABEL_1098")},  // 의료비 신청
		 { ZreqForm : "HR02" , DetailPage : "ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail",
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Scholarship.html?_gAuth=E" ,
		   Type : "F1", Title : oBundleText.getText("LABEL_1163") },  // 학자금 신청
		 { ZreqForm : "HR03" , DetailPage : "ZUI5_HR_Expenditure.ZUI5_HR_ExpenditureDetail",
		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Expenditure.html?_gAuth=E" ,
		   Type : "F1", Title : oBundleText.getText("LABEL_1180")  },  // 경조금 신청
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
	 	   Type : "B1", Title : oBundleText.getText("LABEL_1242") },  // 국내출장비 신청 
	 	 { ZreqForm : "HR10" , DetailPage : "ZUI5_HR_OverseaBTripCal.ZUI5_HR_OverseaBTripCalDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/overseabtripcal.html?_gAuth=E" ,
	 	   Type : "B1", Title : oBundleText.getText("LABEL_1279")},  // 해외출장비 신청
//	 //{ ZreqForm : "HR11" , DetailPage : "ZUI5_HR_Team.ZUI5_HR_TeamDetail" },  // 해외출장명령서 변경/취소
	 	 { Sort : 1, ZreqForm : "HR12" , DetailPage : "ZUI5_HR_Certificate.ZUI5_HR_CertificateDetail", 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Certificate.html?_gAuth=E" ,
	 	   Type : "C1", Title : oBundleText.getText("LABEL_1292") },  // 제증명 신청
	 	 { ZreqForm : "HR22" , DetailPage : "ZUI5_HR_TaxAdjustment.ZUI5_HR_TaxAdjustmentDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/taxadjustment.html?_gAuth=E" ,
	 	   Type : "G1", Title : oBundleText.getText("LABEL_1319") },  // 원천징수 세액조정 신청
	 	 
	 	 { ZreqForm : "HR23" , DetailPage : "ZUI5_HR_LifeSafety.ZUI5_HR_LifeSafetyDetail" ,
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/lifesafety.html?_gAuth=E" ,
	 	   Type : "F1", Title : "생활안정자금 대출신청"},  // 생활안정자금 신청
	 	 { ZreqForm : "HR24" , DetailPage : "ZUI5_HR_LifeStableRepayment.ZUI5_HR_LifeStableRepaymentDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/LifeStableFundRepayment.html?_gAuth=E" ,
	 	   Type : "F1", Title : oBundleText.getText("LABEL_0431") },  // 생활안정자금 중도상환 신청
	 	 { ZreqForm : "HR25" , DetailPage : "ZUI5_HR_HousingLoan.ZUI5_HR_HousingLoanDetail" ,
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/HousingLoan.html?_gAuth=E" ,
	 	   Type : "F1", Title : "주택자금 융자 신청" },  // 주택자금 신청
	 	 { ZreqForm : "HR26" , DetailPage : "ZUI5_HR_HousingFundRepayment.ZUI5_HR_HousingFundRepaymentDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/HousingFundRepayment.html?_gAuth=E" ,
	 	   Type : "F1", Title : oBundleText.getText("LABEL_0420") },   // 주택자금 중도상환 신청
	 	 { ZreqForm : "HR27" , DetailPage : "ZUI5_HR_LicensePay.ZUI5_HR_LicensePayDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/licensepay.html?_gAuth=E" ,
	 	   Type : "G1", Title : "자격면허 수당 신청" },    // 자격수당 신청 
	 	 { ZreqForm : "HR28" , DetailPage : "ZUI5_HR_ConGoods.ZUI5_HR_ConGoodsDetail",
 		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/congoods.html?_gAuth=E" ,
 		   Type : "F1", Title : "경조화환 및 장례지원서비스(장의용품) 신청" },  // 경조화환 신청
	 	 { Sort : 7, ZreqForm : "HR29" , DetailPage : "ZUI5_HR_PreparedAmount.ZUI5_HR_PreparedAmountDetail",
 		    Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/preparedamount.html?_gAuth=E",
 			Type : "C1", Title : oBundleText.getText("LABEL_1372")},  // 부임준비금 신청
	 	 { ZreqForm : "HR30" , DetailPage : "ZUI5_HR_MoveAmount.ZUI5_HR_MoveAmountDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/moveamount.html?_gAuth=E",
	 	   Type : "F1", Title : oBundleText.getText("LABEL_0278")},	// 이사비 신청
	 	 { ZreqForm : "HR31" , DetailPage : "ZUI5_HR_InfantCare.ZUI5_HR_InfantCareDetail" , 
 		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/infantcare.html?_gAuth=E",
	 	   Type : "F1", Title : oBundleText.getText("LABEL_0133") },  // 영유아 보육지원 신청
	 	 { ZreqForm : "HR32" , DetailPage : "ZUI5_HR_PregnancyRegistration.ZUI5_HR_PregnancyRegistrationDetail", 
 		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/PregnancyRegistration.html?_gAuth=E",
	 	   Type : "F1", Title : oBundleText.getText("LABEL_0146") },  // 임신직원 등록신청
	 	 { ZreqForm : "HR33" , DetailPage : "ZUI5_HR_PregnancyCheck.ZUI5_HR_PregnancyCheckDetail",
 		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/PregnancyCheck.html?_gAuth=E",
 		   Type : "F1", Title : oBundleText.getText("LABEL_0164") },  // 태아검진 외출신청
	 	 { ZreqForm : "HR34" , DetailPage : "ZUI5_HR_Lunch.ZUI5_HR_LunchDetail" , 
 		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Lunch.html?_gAuth=E",
 		   Type : "F1", Title : oBundleText.getText("LABEL_1383")},  // 중식비 예외자 신청 (전표생성코드 : 290)
	 	 { ZreqForm : "HR35" , DetailPage : "ZUI5_HR_EmTransport.ZUI5_HR_EmTransportDetail", 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/emtransport.html?_gAuth=E" , 
	 	   Type : "F1", Title : "긴급업무 수행 교통비 신청(공장)" },  // 긴급업무 수행교통비
	 	 { ZreqForm : "HR36" , DetailPage : "ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/visittransport.html?_gAuth=E" , 
	 	   Type : "B1", Title : oBundleText.getText("LABEL_1738") },  // 방문교통비	   
	 	 { ZreqForm : "HR37" , DetailPage : "ZUI5_HR_DeductionItem.ZUI5_HR_DeductionItemDetail",
 		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/DeductionItem.html?_gAuth=E" , 
	 	   Type : "G1", Title : oBundleText.getText("LABEL_0457")},  // 457:고정/변동 공제신청 (항목)
	 	 { ZreqForm : "HR38" , DetailPage : "ZUI5_HR_Deduction.ZUI5_HR_DeductionDetail", 
	 		Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Deduction.html?_gAuth=E" , 
		    Type : "G1", Title : "[공장] 고정공제 신청" }, // [공장] 고정공제 신청
	 	 { ZreqForm : "HR39" , DetailPage : "ZUI5_HR_CompanyHousingSupport.ZUI5_HR_CompanyHousingSupportDetail" , 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/CompanyHousingSupport.html?_gAuth=E" , 
	 	   Type : "F1", Title : oBundleText.getText("LABEL_0320")},  // 사택지원신청
	 	 { ZreqForm : "HR40" , DetailPage : "ZUI5_HR_EndCompanyHousingSupport.ZUI5_HR_EndCompanyHousingSupportDetail",
 		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/EndCompanyHousingSupport.html?_gAuth=E" , 
	 	   Type : "F1", Title : oBundleText.getText("LABEL_0361") },  // 사택종료신청
	 	 { ZreqForm : "HR41" , DetailPage : "ZUI5_HR_DeductionChangeRegistration.ZUI5_HR_DeductionChangeRegistrationDetail",
 		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/DeductionChangeRegistration.html?_gAuth=E" , 
	 	   Type : "G1", Title : oBundleText.getText("LABEL_0512")},  // 변동공제 신청
	 	 { Sort : 2, ZreqForm : "PA01" , DetailPage : "ZUI5_HR_Resignation.ZUI5_HR_ResignationDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Resignation.html?_gAuth=E" ,
	 	   Type : "C1", Title : "사직원" },  // 사직원 신청
	 	 { Sort : 4, ZreqForm : "PA02" , DetailPage : "ZUI5_HR_RecRequest.ZUI5_HR_RecRequestDetail", 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/recrequest.html?_gAuth=E" ,
	 	   Type : "C1", Title : "충원요청서" },  // 충원요청서
	 	 { Sort : 5, ZreqForm : "PA03" , DetailPage : "ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/actionrequest.html?_gAuth=E" ,
	 	   Type : "C1", Title : "내신서" },  // 내신서
	 	 { Sort : 6, ZreqForm : "PD01" , DetailPage : "ZUI5_HR_Transition.ZUI5_HR_TransitionDetail", 
	   	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Transition.html?_gAuth=E" ,
	 	   Type : "C1", Title : "업무인수인계서 작성" },  // 인수인계서 작성
	 	 { Sort : 3, ZreqForm : "PD02" , DetailPage : "ZUI5_HR_ResignationInterview.ZUI5_HR_ResignationInterviewDetail", 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/ResignationInterview.html?_gAuth=E" ,
	 	   Type : "C1", Title : oBundleText.getText("LABEL_0393") },  // 퇴직자 면접표 작성
	 	 { ZreqForm : "TM01" , DetailPage : "ZUI5_HR_ChangeShift.ZUI5_HR_ChangeShiftDetail",
 		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/changeshift.html?_gAuth=E",
 		   Type : "A1", Title : oBundleText.getText("LABEL_0011")},	// 근무편제변경 신청
//	 	 { ZreqForm : "" , DetailPage : "ZUI5_HR_WorkScheduleType.ZUI5_HR_WorkScheduleTypeList",
// 		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/WorkScheduleType.html?_gAuth=E",
// 		   Type : "A1", Title : oBundleText.getText("LABEL_0505")},	// 근무형태별근무일정조회
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
	 	   Type : "A1", Title : oBundleText.getText("LABEL_2358")  },	// 휴가 변경/취소 신청
	 	 { ZreqForm : "TM11" , DetailPage : "ZUI5_HR_SickLeave.ZUI5_HR_SickLeaveDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/sickleave.html?_gAuth=E",
	 	   Type : "A1", Title : oBundleText.getText("LABEL_1751") },  // 병가신청
	 	 { ZreqForm : "TM21" , DetailPage : "ZUI5_HR_VacationDispatch.ZUI5_HR_VacationDispatchDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/VacationDispatch.html?_gAuth=E",
	 	   Type : "A1", Title : oBundleText.getText("LABEL_2293")},  // 파견직 근태 신청
	 	 { ZreqForm : "TM22" , DetailPage : "ZUI5_HR_VacationDispatchChange.ZUI5_HR_VacationDispatchChangeDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/VacationDispatchChange.html?_gAuth=E",
	 	   Type : "A1", Title : oBundleText.getText("LABEL_2291")},  // 파견직 근태 변경/취소 신청
	 	 { ZreqForm : "TM31" , DetailPage : "ZUI5_HR_ParentalLeave.ZUI5_HR_ParentalLeaveDetail", 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/parentalleave.html?_gAuth=E",
	 	   Type : "A1", Title : oBundleText.getText("LABEL_2240")  },	// 병가/출산휴가/육아휴직 변경/취소
	 	 { ZreqForm : "TM32" , DetailPage : "ZUI5_HR_VacationSickAndBabyChange.ZUI5_HR_VacationSickAndBabyChangeDetail", 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/VacationSickAndBabyChange.html?_gAuth=E",
	 	   Type : "A1", Title : oBundleText.getText("LABEL_0764")  },	// 764:병가/출산휴가/육아휴직 변경/취소 신청서
	 	   
	 	 { ZreqForm : "TM41" , DetailPage : "ZUI5_HR_OvertimeOrder.ZUI5_HR_OvertimeOrderDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/OvertimeOrder.html?_gAuth=E",
	 	   Type : "A1", Title : "특근명령서" },  // 특근명령서
	 	 { ZreqForm : "TM43" , DetailPage : "ZUI5_HR_OvertimeConfirm.ZUI5_HR_OvertimeConfirmDetail" ,
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/OvertimeConfirm.html?_gAuth=E",
	 	   Type : "A1", Title : oBundleText.getText("LABEL_0719")},  // 특근확인서
	 	 { ZreqForm : "TM42" , DetailPage : "ZUI5_HR_OvertimeOrderCancel.ZUI5_HR_OvertimeOrderCancelDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/OvertimeOrderCancel.html?_gAuth=E",
	 	   Type : "A1", Title : "특근취소 신청" },  // 특근명령 취소신청
	 	 { ZreqForm : "TM51" , DetailPage : "ZUI5_HR_OverseasBusinessTrip.ZUI5_HR_OverseasBusinessTripDetail",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/HolidayDelegateTask.html?_gAuth=E",
	 	   Type : "A1", Title : oBundleText.getText("LABEL_0855") },  // 855:휴일대근 신청서
	 	 { ZreqForm : "TM61" , DetailPage : "ZUI5_HR_FlexWork.ZUI5_HR_FlexWorkDetail", },	// 근무시간 사후확인서
	 	 { ZreqForm : "TM71" , DetailPage : "ZUI5_HR_WorktimeRecordException.ZUI5_HR_WorktimeRecordExceptionDetail",
 		   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/WorktimeRecordException.html?_gAuth=E",
	 	   Type : "A1", Title : oBundleText.getText("LABEL_0802") },   // 근태기록부(예외자)
	 	 { ZreqForm : "BE01" , DetailPage : "ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageLesson",
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/ForeignLanguage.html?_gAuth=E", 
	 	   Type : "F1", Title : oBundleText.getText("LABEL_0260")  },  // 외국어 학습비 신청
	 	 
//	 	 { ZreqForm : "BE02" , DetailPage : "ZUI5_HR_ForeignLanguage.ZUI5_HR_ForeignLanguageExam", Type : "C1", },  // 외국어 시험 신청
	 	 { ZreqForm : "BE05" , DetailPage : "ZUI5_HR_Resort.ZUI5_HR_ResortDetail" ,
 	       Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/Resort.html?_gAuth=E",
	 	   Type : "F1", Title : oBundleText.getText("LABEL_2379")},  // 휴양소 신청
	 	 { ZreqForm : "BE06" , DetailPage : "ZUI5_HR_Resort.ZUI5_HR_ResortDetail" },	// 공장 휴양소 신청			
	 	 { ZreqForm : "BE11" , DetailPage : "ZUI5_HR_CompanyHouse.ZUI5_HR_CompanyHouseDetail",
	 		Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/companyhouse.html?_gAuth=E",
	 		Type : "F1", Title : oBundleText.getText("LABEL_1832") },  // 사택 입주신청
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
	 	 { ZreqForm : "" , DetailPage : "ZUI5_HR_Card.ZUI5_HR_CardDetail" ,
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/bookrequest.html",
	 	   Type : "E1", Title : oBundleText.getText("LABEL_1704")},  // 도서신청
	 	 { ZreqForm : "" , DetailPage : "ZUI5_HR_Card.ZUI5_HR_CardDetail" , 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/bookbuy.html",
	 	   Type : "E1", Title : "구독희망도서신청"},  // 구독희망도서신청
	 	 { ZreqForm : "" , DetailPage : "ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail" , 
	 	   Url : "/sap/bc/ui5_ui5/sap/zui5_hr_essapp/MealRequest.html",
	 	   Type : "F1", Title : oBundleText.getText("LABEL_1705")},  // 도시락 신청
	 	
],


	onInit : function() {

		//if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		//};

		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow : jQuery.proxy(function(evt) {
				this.onAfterShow(evt);
			}, this)
		});

//		var bus = sap.ui.getCore().getEventBus();
//		bus.subscribe("app", "OpenWindow", this.SmartSizing, this);
//
//		var bus2 = sap.ui.getCore().getEventBus();
//		bus2.subscribe("app", "ResizeWindow", this.SmartSizing, this);
	},

	onBeforeShow : function(oEvent) {
		var oController = this ;
		
		var vData1 = { Data : []}, vData2 = { Data : []}, vData3 = { Data : []}, 
		    vData4 = { Data : []}, vData5 = { Data : []}, vData6 = { Data : []}, vData7 = { Data : []}; 
		for(var i = 0; i < oController._DocumentPage.length; i++){
			switch(oController._DocumentPage[i].Type) {
				case "A1" : vData1.Data.push(oController._DocumentPage[i]); break;
				case "B1" : vData2.Data.push(oController._DocumentPage[i]); break;
				case "C1" : vData3.Data.push(oController._DocumentPage[i]); break;
				case "D1" : vData4.Data.push(oController._DocumentPage[i]); break;
				case "E1" : vData5.Data.push(oController._DocumentPage[i]); break;
				case "F1" : vData6.Data.push(oController._DocumentPage[i]); break;
				case "G1" : vData7.Data.push(oController._DocumentPage[i]); break;
			}
		}
		
		// 가나다순 소팅에는 필요없음
		function compStringReverse(a, b) {
		  if (a.Title < b.Title) return -1;
		  if (b.Title < a.Title) return 1;
		  return 0;
		}
		
		function sortOrder(a, b) {
			return a.Sort - b.Sort;
		}
		
		// Title 에 숫자추가
		function addNumber(pData) {
			i = 1;
			pData.Data.forEach(function(element) {
				element.Title = i +". " +element.Title;
				i++;
			});
			return pData;
		}
		
		vData1.Data.sort(compStringReverse);
		vData2.Data.sort(compStringReverse);
		vData3.Data.sort(sortOrder);
		vData4.Data.sort(compStringReverse);
		vData5.Data.sort(compStringReverse);
		vData6.Data.sort(compStringReverse);
		vData7.Data.sort(compStringReverse);
		
		oController._ResultModel1.setData(addNumber(vData1));
		oController._ResultModel2.setData(addNumber(vData2));
		oController._ResultModel3.setData(addNumber(vData3));
		oController._ResultModel4.setData(addNumber(vData4));
		oController._ResultModel5.setData(addNumber(vData5));
		oController._ResultModel6.setData(addNumber(vData6));
		oController._ResultModel7.setData(addNumber(vData7));
	},

	onAfterShow : function(oEvent) {
//		this.SmartSizing(oEvent);	
//		this.onPressSearch();		
	},
	
	onSelectRow : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ApprovalOverview.ZUI5_HR_ApprovalOverviewList");
		var oController = oView.getController();		
		var oModel = oEvent.getSource().oBindingContexts.undefined.oModel,
			sPath =	oEvent.getSource().oBindingContexts.undefined.sPath,
			vData = oModel.getProperty(sPath);
		
		if( vData.Url === undefined || vData.Url === null || vData.Url == ""  ){
			
		}else{
			window.open(vData.Url);
		}
	},
	
});