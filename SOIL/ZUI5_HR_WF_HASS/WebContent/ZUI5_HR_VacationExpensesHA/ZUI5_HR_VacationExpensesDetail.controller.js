jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_VacationExpensesHA.ZUI5_HR_VacationExpensesDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_VacationExpensesHA.ZUI5_HR_VacationExpensesDetail
	 */

	PAGEID : "ZUI5_HR_VacationExpensesDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_vEnamefg : "",
	_oControl  : null,
	
	BusyDialog : new sap.m.BusyDialog(),
	_ExpensesObjList : [] ,

	///// 결재자 지정 /////
	_vReqForm : "HR07", // 신청서 유형
	_vReqPernr : "",	// 신청자 사번
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(), // 발신라인 테이블 JSON모델
	_RetvLineModel : new sap.ui.model.json.JSONModel(), 	// RetvApprLineSet에서 불러온 값을 저장함
	//////////////////
	
	onInit : function() {
		this.getView().addStyleClass("sapUiSizeCompact");
		
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
		var oController = this;
		var vAppno ="" , vZappStatAl = "" , vRegno = "", vFamgb = "";
		if(oEvent) {
			vAppno = oEvent.data.Appno;
		}
		
		var oPAGE = sap.ui.getCore().byId(oController.PAGEID + "_PAGE");
		oPAGE.destroyContent();
		
		if(!oController._vInfoImage.getProperty("/Data") || oController._vInfoImage.getProperty("/Data").length < 1){
			var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
			var Datas = { Data : {}} ;
			try{
				var oPath = "/AppNoticeSet?$filter=ZreqForm eq '"+ oController._vZworktyp + "'";
				oModel.read(
						oPath,
						null,
						null,
						false,
						function(data,res){
							if(data && data.results.length){
								Datas.Data.Image = data.results[0].Image ;
							}
						},
						function(res){console.log(res);}
				);	
			}catch(Ex){
				
			}
			oController._vInfoImage.setData(Datas);
		
		}
		
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		
		if(vAppno == "" ){ // 신규신청
			var oDetailData = {Data : {}};
			if(_gAuth == "E"){
				if(vEmpLoginInfo.length > 0){
					var OneData = {};
					// 대상자
					OneData.Ename = vEmpLoginInfo[0].Ename ;
					OneData.Pernr = vEmpLoginInfo[0].Pernr ;
					OneData.BOrgtx = vEmpLoginInfo[0].Btrtx +" / " + vEmpLoginInfo[0].Stext ;
					OneData.ZzjikgbtxT = vEmpLoginInfo[0].Zzjikgbt +" / " + vEmpLoginInfo[0].Zzjiktlt ;
					OneData.Zzjikchtx = vEmpLoginInfo[0].Zzjikcht;
					OneData.Orgtx =  vEmpLoginInfo[0].Stext ; 	
					OneData.Zzjiktlt =  vEmpLoginInfo[0].Zzjiktlt ;
					OneData.Zzjikgbt =  vEmpLoginInfo[0].Zzjikgbt ;
					// 신청자
					OneData.Apename = vEmpLoginInfo[0].Ename ;
					OneData.Appernr = vEmpLoginInfo[0].Pernr ;
					OneData.ApbrgtxT = vEmpLoginInfo[0].Btrtx +" / " + vEmpLoginInfo[0].Stext ;
					OneData.ApzzjikgbtxT = vEmpLoginInfo[0].Zzjikgbt +" / " + vEmpLoginInfo[0].Zzjiktlt ;
					OneData.Appdt = "";
					oDetailData.Data = OneData;
				}else{
					sap.m.MessageBox.alert("로그인 정보가 존재하지 않습니다.", {
					 	icon: sap.m.MessageBox.Icon.INFORMATION,
					 	title : "오류",
						onClose : function() {
							oController.onBack
						}
					});
					return;
				}
			}else{
				var OneData = {};
				// 신청자
				OneData.Apename = vEmpLoginInfo[0].Ename ;
				OneData.Appernr = vEmpLoginInfo[0].Pernr ;
				OneData.ApbrgtxT = vEmpLoginInfo[0].Btrtx +" / " + vEmpLoginInfo[0].Stext ;
				OneData.ApzzjikgbtxT = vEmpLoginInfo[0].Zzjikgbt +" / " + vEmpLoginInfo[0].Zzjiktlt ;
				OneData.Appdt = "";
				oDetailData.Data = OneData;
			}
			oDetailData.Data.ZappStatAl = "";
			oDetailData.Data.gAuth = _gAuth;
			oController._DetailJSonModel.setData(oDetailData);
		}else{ // 수정 및 조회
			oController.BusyDialog.open();
			var oModel = sap.ui.getCore().getModel("ZHR_HOL_EXP_SRV");
			var oDetailTableDatas = {Data : []};
			var oDetailData = {Data : {}};
			var vErrorMessage = "", vError = "";
			
			var oPath = "/ExpensesApplSet/?$filter=Appno eq '" + vAppno + "' and Prcty eq 'D'";	
			oModel.read(oPath, 
				    null, null, false, 
					function(data,res){
						if(data && data.results.length){
							var OneData = data.results[0];
														// 대상자
							OneData.BOrgtx = OneData.Btext +" / " + OneData.Orgtx ;
							OneData.ZzjikgbtxT = OneData.Jikgbt +" / " + OneData.Jiktlt ;
							OneData.Zzjikchtx = OneData.Jikcht;
							// 신청자
							OneData.ApbrgtxT = OneData.Apbtext +" / " + OneData.Aporgtx ;
							OneData.ApzzjikgbtxT = OneData.Apjikgbt +" / " + OneData.Apjiktlt ;
							vZappStatAl = OneData.ZappStatAl ;
							OneData.gAuth = _gAuth ;
							OneData.Splityn = OneData.Splityn == "X" ? true : false ;
							
							oController._vReqPernr = OneData.Appernr;
							
							oDetailData.Data = OneData;
							
							var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
							OneData.Holbeg = dateFormat.format(new Date(OneData.Holbeg)); 
							OneData.Holend = dateFormat.format(new Date(OneData.Holend)); 
							OneData.Holamt = common.Common.numberWithCommas(OneData.Holamt);  
							
							
						}
					},
					function(Res){
						vError = "E";
						if(Res.response.body){
							ErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							} else {
								oController.ErrorMessage = ErrorMessage;
							}
						}
					}
				);
			
			if(vError == "E"){
				sap.m.MessageBox.alert(oController.ErrorMessage,{
					onClose : function() {
						oController.BusyDialog.close();
						oController.onBack();
					}
				});
				return ;
			}
			oController._DetailJSonModel.setData(oDetailData);	
		}

		
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		var vFragmentType = "02" ;
		// 결재 상태에 따라 Page Header Text 수정
		if( vZappStatAl == "20" || vZappStatAl == "30"){
			oDetailTitle.setText("장기근속휴가비 신청관리 수정 및 승인");
		}else{
			oDetailTitle.setText("장기근속휴가비 신청관리 조회");
			vFragmentType = "03" ;
		}
		
		if(vFragmentType == "02") oPAGE.addContent(sap.ui.jsfragment("ZUI5_HR_VacationExpensesHA.fragment.ExpensesPage02",oController));
		else oPAGE.addContent(sap.ui.jsfragment("ZUI5_HR_VacationExpensesHA.fragment.ExpensesPage03",oController));

		// 결재선 
		oController.setApprovalLineModel(oController);
		oController.onSetAppl(null);		
		
		oController.BusyDialog.close();
		 	
	},

	onAfterShow : function(oEvent) {
//		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationExpensesHA.ZUI5_HR_VacationExpensesDetail");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_VacationExpensesHA.ZUI5_HR_VacationExpensesList",
		      data : { }
		});		
	},

	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert("유효하지 않은 날짜형식입니다.",{
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	},
		
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationExpensesHA.ZUI5_HR_VacationExpensesDetail");
		var oController = oView.getController();
	},	

	// 결재자 정보
	setApprovalLineModel : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationExpensesHA.ZUI5_HR_VacationExpensesDetail");
		
		var vData = {Data : []};
		
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		var oPath = "/ApprovalLineApplSet?$filter=ZreqForm eq 'RF07' and ZreqPernr1 eq '" + oController._vReqPernr + "'";
		
		if(oController._vAppno != "") oPath += " and Appno eq '" + oController._vAppno + "'";
		
		oModel.read(oPath, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){							
							data.results[i].Idx = i+1;
							vData.Data.push(data.results[i]);
						}
					} 
				}, function(Res){
					if(Res.response.body){
						var ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						vError = "E"; 
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						}else{
							vErrorMessage = ErrorMessage ;
						}
					}
				}
		);
		
		oController._ApprovalLineModel.setData(vData);
		
	},
	
	// 신청부서 변경 시, 개인 결재선 체크박스 선택이 변경됐을 때 결재선에 이름 표시되게 한다.
	onSetAppl : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationExpensesHA.ZUI5_HR_VacationExpensesDetail");
		var oController = oView.getController();
		
		var oPrvline = oController._DetailJSonModel.getProperty("/Data/Prvline");
		var vPrvline = "";

		var vPernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
		if(!vPernr) return;
			
		if(oPrvline == true || oPrvline == "X") vPrvline = "X"; else vPrvline = "";
		
		// 개인 결재선 적용 체크여부에 따라 결재자 지정버튼 enabled 설정
		if(oEvent){
			var vControlId = common.Common.getControlId(oController, oEvent.getSource().getId());
			if(vControlId.Id == "Prvline" && vPrvline == "X"){
				sap.ui.getCore().byId(oController.PAGEID + "_ApplBtn").setEnabled(true);
			} else if(vControlId.Id == "Prvline" && vPrvline == ""){
				sap.ui.getCore().byId(oController.PAGEID + "_ApplBtn").setEnabled(false);
			}
		}
		
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		var oPath = "/ReferenceLineSet?$filter=Pernr eq '" + vPernr + "' and Prvline eq '" + vPrvline + "' and ZreqForm eq 'RF07'";
		
		var vData = [];
		oModel.read(oPath, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0; i<data.results.length; i++){
							vData.push(data.results[i]);
						}
						oController._RetvLineModel.setData(vData);
					}
				}, function(Res){
					if(Res.response.body){
						ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						}
						
						sap.m.MessageBox.alert(ErrorMessage, {title : "오류"});
						return;
					}
				}
		);	
		
		// 개인결재선 적용이 선택되어있는지에 따라 결재선에 나오는 이름 다르게 표시한다.
		var vAprnm = "";
		if(vPrvline == ""){			
			if(vData.length){
				for(var i=0; i<vData.length; i++){
					if(i==0) vAprnm += vData[i].Aprnm;
					else vAprnm += " > " + vData[i].Aprnm;
				}
			}
		} else if(vPrvline == "X"){
			// 결재자 지정한 데이터가 있는지 확인한다.
			var vApprovalData = oController._ApprovalLineModel.getProperty("/Data");
			var vAppTotalData = [];
			
			if(vApprovalData){
				for(var i=0; i<vApprovalData.length; i++){
					if(vApprovalData[i].Pernr){
						vAppTotalData.push(vApprovalData[i]);
					}
				}
			}
			
			if(vAppTotalData.length == 0){
				if(vData.length){
					for(var i=0; i<vData.length; i++){
						if(i==0) vAprnm += vData[i].Aprnm;
						else vAprnm += " > " + vData[i].Aprnm;
					}
				}
			} else {
				for(var i=0; i<vAppTotalData.length; i++){
					if(i==0) vAprnm += vAppTotalData[i].Aprnm;
					else vAprnm += " > " + vAppTotalData[i].Aprnm;
				}
			}			
		}
		oController._DetailJSonModel.setProperty("/Data/Aprnm", vAprnm);
	},

//	휴가일자 변경 시 휴가일수와 분할 사용여부 Check 
	onChangeHoliday : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationExpensesHA.ZUI5_HR_VacationExpensesDetail");
		var oController = oView.getController();	
		var oDetailData = oController._DetailJSonModel.getProperty("/Data"); 
		var vHolbeg = oDetailData.Holbeg , vHolend = oDetailData.Holend , vHolday = oDetailData.Holday , vRholday = 0, vSplitnb = oDetailData.Splitnb ,
		    vSplityn = oDetailData.Splityn ;
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		if(common.Common.checkDate(vHolbeg, vHolend) == false){
			new control.ZNK_SapBusy.oErrorMessage("휴가시작일자가 종료일자보다 큽니다.\n날짜를 확인하세요."); 
			return ;
		}
		
		if(!vHolbeg || !vHolend || !vHolday) return false;
		
		// 휴가 일수 조회
		var oModel = sap.ui.getCore().getModel("ZHR_HOL_EXP_SRV");
		var Datas = { Data : {}} ;
		
		var oDetailData = oController._DetailJSonModel.getProperty("/Data"); 
		
		if(!oDetailData.Pernr || oDetailData.Pernr == ""){return false;}
		else{
			try{
				var oPath = "/HoldaysSet?$filter=Pernr eq '"+ oDetailData.Pernr + "'";
				    oPath += " and Holbeg eq datetime'" + dateFormat.format(new Date(oDetailData.Holbeg)) + "T00%3a00%3a00%27";
					oPath += " and Holend eq datetime'" + dateFormat.format(new Date(oDetailData.Holend)) + "T00%3a00%3a00%27" ;
				
				oModel.read(
						oPath,
						null,
						null,
						false,
						function(data,res){
							if(data && data.results.length){
								vRholday = data.results[0].Holday ;
							}
						},
						function(res){console.log(res);}
				);	
			}catch(Ex){
				
			}
		}
		
		oController._DetailJSonModel.setProperty("/Data/Rholday", vRholday); 
		
		
		if(vRholday > vHolday){
			new control.ZNK_SapBusy.oErrorMessage("입력한 휴가일자의 휴가일수가 기준일자보다 더 많습니다. \n 확인바랍니다.");
			return false;
		}
		
	
		if(vRholday < vHolday){
			// 분할 횟수가 존재하지 않으면서 휴가 일수와 기준일수가 같지 않을 경우 
			if(vSplitnb < 1){
				new control.ZNK_SapBusy.oErrorMessage("분할 횟수가 존재하지 않아 휴가분할 사용이 불가능합니다.  \n 확인바랍니다.");
				return false;
			
			}
			//휴가 일수와 기준일수가 같지 않으며 분할사용여부를 선택하지 않은 경우 
			if(vSplityn != true ){
//				new control.ZNK_SapBusy.oErrorMessage("휴가를 분할 사용할 경우 분할사용여부를 체크합니다.");
				
				sap.m.MessageBox.show("휴가를 분할 사용할 경우 분할사용여부를 체크합니다.", {
					title : "안내",
					onClose : function(){
						oController._DetailJSonModel.setProperty("/Data/Splityn", true); 
					}
				});
			}
		}else if(vRholday == vHolday){
			oController._DetailJSonModel.setProperty("/Data/Splityn", false); 
		}
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationExpensesHA.ZUI5_HR_VacationExpensesDetail");
		var oController = oView.getController();
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationExpensesHA.ZUI5_HR_VacationExpensesDetail");
		var oController = oView.getController();
		oController.onSave(oController , "C");
	},
	onPressSaveX : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationExpensesHA.ZUI5_HR_VacationExpensesDetail");
		var oController = oView.getController();
		oController.onSave(oController , "X");
	},
	
	onPressSaveP : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationExpensesHA.ZUI5_HR_VacationExpensesDetail");
		var oController = oView.getController();
		oController.onSave(oController , "P");
	},
	
	onPressSaveR : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationExpensesHA.ZUI5_HR_VacationExpensesDetail");
		var oController = oView.getController();
		oController.onSave(oController , "R");
	},
	
	onPressSaveS : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VacationExpensesHA.ZUI5_HR_VacationExpensesDetail");
		var oController = oView.getController();
		oController.onSave(oController , "S");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty){ // 처리 구분
		var vZappStatAl	= "";
		var vOData = oController.onValidationData(oController, vPrcty);
		if( vOData == "") return ;
		
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_HOL_EXP_SRV");
				var oPath = "/ExpensesApplSet";
				var vUri = "";
				oModel.create(
						oPath,
						vOData,
						null,
						function(data,res){
							if(data) {
								oController._DetailJSonModel.setProperty("/Data/Appno", data.Appno); 
								oController._DetailJSonModel.setProperty("/Data/ZappStatAl", data.ZappStatAl); 
								vZappStatAl = data.ZappStatAl;
								if(vPrcty == "S" && data.Zurl != "") vUri = data.Zurl; 	//window.open(data.Zurl); 
								vErrorMessage = data.Message ;
							} 
						},
						function (oError) {
					    	var Err = {};
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								var msg1 = Err.error.innererror.errordetails;
								if(msg1 && msg1.length) vErrorMessage = Err.error.innererror.errordetails[0].message;
								else vErrorMessage = Err.error.message.value;
							} else {
								vErrorMessage = oError.toString();
							}
					}
				);
				
				oController.BusyDialog.close();
				if(vErrorMessage != ""){
					new control.ZNK_SapBusy.oErrorMessage(vErrorMessage);
					return ;
				}
				
				sap.m.MessageBox.show(vCompTxt, {
					title : "안내",
//					onClose : oController.onBack
					onClose : function(){
						if(vUri != ""){
							var openUrl = function(fVal){
									window.open(vUri);
									oController.onBack();
							}
							
							sap.m.MessageBox.alert("WeLS 결재화면에서 기안버튼을 반드시 클릭하여 주시기 바랍니다.", {
								title : "안내",
								onClose : openUrl
							});	
						} else {
							sap.m.MessageBox.alert(vCompTxt, {
								title : "안내",
								onClose : oController.onBack()
							});
						}
					}
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
			vInfoTxt = "저장하시겠습니까?";
			vCompTxt = "저장이 완료되었습니다." ;
		}else if(vPrcty == "X"){
			vInfoTxt = "재상신하시겠습니까?";
			vCompTxt = "현재 문서를 작성중 상태로 변경하였습니다. \n수정 후 재신청하시기 바랍니다." ;
		}else if(vPrcty == "P"){
			vInfoTxt = "승인하시겠습니까?";
			vCompTxt = "승인이 완료되었습니다." ;
		}else if(vPrcty == "R"){
			vInfoTxt = "반려하시겠습니까?";
			vCompTxt = "반려가 완료되었습니다." ;
		}else if(vPrcty == "Z"){
			vInfoTxt = "인쇄하시겠습니까? \n본인출력은 한번만 출력이 가능합니다.";
			vCompTxt = "인쇄가 완료되었습니다." ;
		}else if(vPrcty == "S"){
			vInfoTxt = "기안하시겠습니까?";
			vCompTxt = "기안이 완료되었습니다." ;
		}else{
			vInfoTxt = "신청하시겠습니까?";
			vCompTxt = "신청이 완료되었습니다.";
		}
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : "안내",
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},
	
	onValidationData : function(oController, vPrcty){
		var rData = {};
		var vData = oController._DetailJSonModel.getProperty("/Data");
		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_Ename"); // 신청자성명
		var oHolty = sap.ui.getCore().byId(oController.PAGEID + "_Select1"); // 휴가구분
		var oHolbeg = sap.ui.getCore().byId(oController.PAGEID + "_Holbeg"); // 휴가일자 begin
		var oHolend = sap.ui.getCore().byId(oController.PAGEID + "_Holend"); // 휴가일자 end
		
		if(oEname) oEname.setValueState(sap.ui.core.ValueState.None);
		if(oHolty) oHolty.setValueState(sap.ui.core.ValueState.None);
		if(oHolbeg) oHolbeg.setValueState(sap.ui.core.ValueState.None);
		if(oHolend) oHolend.setValueState(sap.ui.core.ValueState.None);
		
		if(!vData.Pernr || vData.Pernr == ""){
			new control.ZNK_SapBusy.oErrorMessage("신청자 사원번호가 입력되지 않았습니다.");
			if(oEname) oEname.setValueState(sap.ui.core.ValueState.Error);
			return "";
		}
		if(!vData.Holty || vData.Holty == ""){
			new control.ZNK_SapBusy.oErrorMessage("휴가구분이 선택되지 않았습니다.");
			if(oHolty) oHolty.setValueState(sap.ui.core.ValueState.Error);
			return "";
		}
		if(!vData.Holbeg || vData.Holbeg == ""){
			new control.ZNK_SapBusy.oErrorMessage("휴가시작일자가 입력되지 않았습니다.");
			if(oHolbeg) oHolbeg.setValueState(sap.ui.core.ValueState.Error);
			return "";
		}
		if(!vData.Holend || vData.Holend == ""){
			new control.ZNK_SapBusy.oErrorMessage("휴가종료일자가 입력되지 않았습니다.");
			if(oHolend) oHolend.setValueState(sap.ui.core.ValueState.Error);
			return "";
		}
		
		if( vPrcty == "R" && vData.ZappResn == ""){
			new control.ZNK_SapBusy.oErrorMessage("반려하실 경우 반려사유는 필수 입니다.");
			return "";
		}
		
		
		
		if(vData.Rholday > vData.Holday){
			new control.ZNK_SapBusy.oErrorMessage("입력한 휴가일자의 휴가일수가 기준일자보다 더 많습니다. \n 확인바랍니다.");
			return "";
		}
		
	
		if(vData.Rholday < vData.Holday){
			// 분할 횟수가 존재하지 않으면서 휴가 일수와 기준일수가 같지 않을 경우 
			if(rData.Splitnb < 1){
				new control.ZNK_SapBusy.oErrorMessage("입력한 휴가일자의 휴가일수가 기준일자보다 더 많습니다. \n 확인바랍니다.");
				return "";
			
			}
			//휴가 일수와 기준일수가 같지 않으며 분할사용여부를 선택하지 않은 경우 
			if(!vData.Splityn || vData.Splityn != true ){
				new control.ZNK_SapBusy.oErrorMessage("휴가를 분할 사용할 경우 분할사용여부를 체크하여 주십시오.");
				return "";
			}
		}
		
		if(common.Common.checkDate(rData.Holbeg, rData.Holend) == false){
			new control.ZNK_SapBusy.oErrorMessage("휴가시작일자가 종료일자보다 큽니다.\n날짜를 확인하세요."); 
			return "";
		}
		
		if(!vData.Holpl || vData.Holpl.trim() == ""){
			new control.ZNK_SapBusy.oErrorMessage("휴가장소를 입력하여 주십시오.");
			return "";
		}
		
		//전자결재 html 생성 - 기안 / 반려
		if(vPrcty == "S" ){
			rData.Zhtml = oController.makeHtml(oController);
			if(rData.Zhtml == "") return "";		
		}
		
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		
		rData.Pernr =  vData.Pernr; // 대상자
		rData.Ename =  vData.Ename; // 대상자이름
		rData.Holty =  vData.Holty; // 휴가구분
		rData.Appno =  vData.Appno; // 신청번호
		rData.Holamt =  common.Common.removeComma(vData.Holamt);// 휴가비
		rData.Holday =  vData.Holday; // 휴가일수
		rData.Rholday =  vData.Rholday; // 휴가일수
		rData.Splitnb =  vData.Splitnb; // 휴가사용가능횟수
		rData.Holbeg =  "\/Date("+ common.Common.getTime(vData.Holbeg) +")\/"; // 휴가일자
		rData.Holend =  "\/Date("+ common.Common.getTime(vData.Holend) +")\/"; // 휴가일자
		rData.Reqnt =  vData.Reqnt;// 휴가입력일수
		rData.Pstlzf =  vData.Pstlzf;// 분할사용여부
		rData.Holpl =  vData.Holpl;// 휴가장소
		rData.Waers = "KRW";
		rData.Splityn = vData.Splityn == true ? "X" : "";
		rData.Prcty = vPrcty
		rData.Appernr = vEmpLoginInfo[0].Pernr ; 
		if(vPrcty == "R") rData.ZappResn = vData.ZappResn; //반려사유
		
		return rData;
		
	},
	
	makeHtml : function(oController){
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var table_start = "[TABLE_START]";
		var table_end = "[TABLE_END]";	
		
		var html_url ;
		html_url = "/sap/bc/ui5_ui5/sap/ZUI5_HR_WF_HASS/ZUI5_HR_VacationExpensesHA/html/vacationexpenses.html";		
		
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
			new control.ZNK_SapBusy.oErrorMessage("결재 HTML 가져오기에 실패하였습니다.");
			return "";
		}

		var checkText = function(text){
			text = text.replace(/&/g, "&amp;");
			text = text.replace(/</g, "&lt;");
			text = text.replace(/>/g, "&gt;");
			text = text.replace(/'/g, "&apos;");
			text = text.replace(/"/g, "&quot;");
			text = text.replace(/\n/g, "<br/>");
			
			return text;
		}
		
		var table_html = tHtml.substring(tHtml.indexOf(table_start) + table_start.length, tHtml.indexOf(table_end));
		var vDetailData = oController._DetailJSonModel.getProperty("/Data");
		
		// 대상자
		tHtml = tHtml.replace("[DATA1]",   vDetailData.Ename);
		tHtml = tHtml.replace("[DATA2]",   checkText(vDetailData.BOrgtx));
		tHtml = tHtml.replace("[DATA3]",   checkText(vDetailData.ZzjikgbtxT));
		tHtml = tHtml.replace("[DATA4]",   checkText(vDetailData.Zzjikchtx));
	
		tHtml = tHtml.replace("[ITEM_DATA1]",   vDetailData.Holtx);        // 휴가구분
		tHtml = tHtml.replace("[ITEM_DATA2]",   vDetailData.Holamt);       // 휴가비
		tHtml = tHtml.replace("[ITEM_DATA3]",   vDetailData.Holday);       // 휴가일수
		tHtml = tHtml.replace("[ITEM_DATA4]",   vDetailData.Splitnb);      // 분할사용가능횟수
		tHtml = tHtml.replace("[ITEM_DATA5]",   vDetailData.Holbeg + " ~ " + vDetailData.Holend + "( " + vDetailData.Rholday + " )" );        // 휴가일자
		tHtml = tHtml.replace("[ITEM_DATA6]",   vDetailData.Splityn == true ? "예" : "아니오" );		    // 분할사용여부 
		tHtml = tHtml.replace("[ITEM_DATA7]",   checkText(vDetailData.Holpl));        //휴가장소
		
		return tHtml;
		
	},
	
});
	