//jQuery.sap.require("control.BusyIndicator");
//jQuery.sap.require("control.ZNKBusyAccessor");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ZNK_ApprovalLine");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail
	 */

	PAGEID : "ZUI5_HR_OvertimeDetail",
	
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(), 
	_DialogJsonModel : new sap.ui.model.json.JSONModel(), 
	_MedicalFamilyList : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	_vSutrnm : "", // 대근자 구분
	_vAppno : "",
	_vIdx : "", // 대근휴가자
	
	_vSelectedIndex : null, // 대상자 선택 시 더블클릭 이벤트를 위해서 사용
	
	///// 결재자 지정 /////
	_vReqForm : "HR05", // 신청서 유형
	_vReqPernr : "",	// 신청자 사번
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(), // 발신라인 테이블 JSON모델
	//////////////////
	
	_RetvLineModel : new sap.ui.model.json.JSONModel(), 	// RetvApprLineSet에서 불러온 값을 저장함
	
	_vFromPage : "",
	
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
	},

	onBeforeShow : function(oEvent) {
		var oController = this;

		var vAppno = "" , vZappStatAl = "", vRegno = "";
		
		oController._vAppno = "";
		oController._vReqPernr = "";
		oController._ApprovalLineModel.setData(null);
		sap.ui.getCore().byId(oController.PAGEID + "_ApplBtn").setEnabled(false);

		var vFromPageId = "";
		if(oEvent) {
			oController._vAppno = vAppno = oEvent.data.Appno;
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		// 신청안내
		if(!oController._vInfoImage.getProperty("/Data") || oController._vInfoImage.getProperty("/Data").length < 1){
			var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
			var Datas = { Data : {}} ;
			try{
				var oPath = "/AppNoticeSet?$filter=ZreqForm eq 'HR05'";
				oModel.read(
						oPath,
						null,
						null,
						false,
						function(data,res){
							if(data && data.results.length){
//								oController._vInfoImage = data.results[0].Image ;
								Datas.Data.Image = data.results[0].Image ;
							}
						},
						function(res){console.log(res);}
				);	
			}catch(Ex){
				
			}
			oController._vInfoImage.setData(Datas);		
		}
		
		// 부서 
		oController.setOrgeh(oController);
		
		var oPortalTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");

		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		
		// 초기화
		oController._DetailJSonModel.setData(null);
		oController._DetailTableJSonModel.setData(null);
		
		// 테이블 sort, filter 제거
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		oDetailTable.clearSelection();
		var oColumns = oDetailTable.getColumns();
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}

		if(vAppno == ""){ // 신규신청
			var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
			var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
			
			var oDetailData = {Data : {}};
			if(vEmpLoginInfo.length > 0){
				var OneData = {};
				// 권한
				OneData.Auth = _gAuth;
				
				// 신청자
				OneData.Apename = vEmpLoginInfo[0].Ename;
				oController._vReqPernr = OneData.Appernr = vEmpLoginInfo[0].Pernr;
				OneData.Apbtext = vEmpLoginInfo[0].Btrtx;
				OneData.Aporgtx = vEmpLoginInfo[0].Stext;
				OneData.Apzzjikgbtx = vEmpLoginInfo[0].Zzjikgbt;
				OneData.Apzzjiktltx = vEmpLoginInfo[0].Zzjiktlt;
				
				// 신청내역
				OneData.Datum = dateFormat.format(new Date());
				
				OneData.ZappStatAl = "";
				
				if(_gAuth == "E"){
					OneData.Orgeh = vEmpLoginInfo[0].Zzorgid;
				}
				
				oDetailData.Data = OneData;
			}else{
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_1011"), {	// 1011:로그인 정보가 존재하지 않습니다.
				 	icon: sap.m.MessageBox.Icon.INFORMATION,
				 	title : oBundleText.getText("LABEL_0053"),
					onClose : function() {
						oController.onBack();
					}
				});
				return;
			}
			
			sap.ui.getCore().byId(oController.PAGEID + "_DetailTable").setVisibleRowCount(1);
			
			oController._DetailJSonModel.setData(oDetailData);
			
			oController.onChangeDate(null);
			
			var oDetailTableDatas = {Data : []};
			oController._DetailTableJSonModel.setData(oDetailTableDatas);
			
			if(_gAuth == "E"){
				oController.setApprovalLineModel(oController); // 결재선
				oController.onSetAppl(null);
			}
			
		} else if(vAppno != ""){ // 수정 및 조회
			oController.BusyDialog.open();
			var oModel = sap.ui.getCore().getModel("ZHR_OVERTIME_SRV");
			var oDetailTableDatas = {Data : []};
			var oDetailData = {Data : {}};
			var vErrorMessage = "", vError = "";
			
			var oPath = "/OvertimeApplContentSet?$filter=Appno eq '" + vAppno + "' and Actty eq '" + _gAuth + "'"; 
			oModel.read(oPath, null, null, false,
					function(data,res){
						if(data && data.results.length){
							var vOneData = {};

							// 신청내역
							vOneData.Datum = dateFormat.format(data.results[0].Datum);
							vOneData.Orgeh = data.results[0].Orgeh;
							vOneData.Orgtx = data.results[0].Orgtx;
							vOneData.BeguzD = data.results[0].BeguzD;
							vOneData.EnduzD = data.results[0].EnduzD;
							vOneData.Appdt = data.results[0].Appdt;
							
							// 결재내역
							vOneData.ZappStxtAl = data.results[0].ZappStxtAl;
							vOneData.Sgndt = data.results[0].Sgndt;
							vOneData.ZappUrl = data.results[0].ZappUrl;
							vOneData.Docno = data.results[0].Docno;
							
							// 신청자 정보
							vOneData.Auth = _gAuth;
							vOneData.Appno = data.results[0].Appno;
							vOneData.ZappStatAl = vZappStatAl = data.results[0].ZappStatAl;
							vOneData.Apename = data.results[0].Apename;
							oController._vReqPernr = vOneData.Appernr = data.results[0].Appernr;
							vOneData.Apbtext = data.results[0].Apbtext;
							vOneData.Aporgtx = data.results[0].Aporgtx;
							vOneData.Apzzjikgbtx = data.results[0].Apzzjikgbtx;
							vOneData.Apzzjiktltx = data.results[0].Apzzjiktltx;
							
							// 개인결재선여부, 결재자 사번, 결재자 이름
							if(data.results[0].Prvline == "X"){
								vOneData.Prvline = true;
								sap.ui.getCore().byId(oController.PAGEID + "_ApplBtn").setEnabled(true);
							} else {
								vOneData.Prvline = false;
								sap.ui.getCore().byId(oController.PAGEID + "_ApplBtn").setEnabled(false);
							}
							
					    	vOneData.Aprnr = data.results[0].Aprnr;
					    	vOneData.Aprnm = data.results[0].Aprnm;
							
							oDetailData.Data = vOneData;
							
							var oPath2 = "/OvertimeApplEmpListSet/?$filter=Appno eq '" + vAppno + "' and Prcty eq 'R'";	
							oModel.read(oPath2, null, null, false, 
									function(data,res){
										if(data && data.results.length){
											for(var i=0; i<data.results.length; i++){
												data.results[i].ZappStatAl = vZappStatAl;
												data.results[i].Begda = dateFormat.format(data.results[i].Begda);
												data.results[i].Idx = i+1;
												
//												//종료시간이 2400 이면 화면에 공백으로 표시되어 0000 로 인식하도록 바꿈
//												if(data.results[i].Enduz = '2400') data.results[i].Enduz = '0000';
												
												// 소수점 첫째자리만 나오도록 수정함
												if(data.results[i].Abrst == "0.00") data.results[i].Abrst = "";
												else data.results[i].Abrst = data.results[i].Abrst.substring(0,data.results[i].Abrst.length-1);
												
												if(data.results[i].Tim01 == "0.00") data.results[i].Tim01 = "";
												else data.results[i].Tim01 = data.results[i].Tim01.substring(0,data.results[i].Tim01.length-1);
												
												if(data.results[i].Tim02 == "0.00") data.results[i].Tim02 = "";
												else data.results[i].Tim02 = data.results[i].Tim02.substring(0,data.results[i].Tim02.length-1);
												
												if(data.results[i].Tim03 == "0.00") data.results[i].Tim03 = "0";
												else data.results[i].Tim03 = data.results[i].Tim03.substring(0,data.results[i].Tim03.length-1);
												
												if(data.results[i].Tim04 == "0.00") data.results[i].Tim04 = "";
												else data.results[i].Tim04 = data.results[i].Tim04.substring(0,data.results[i].Tim04.length-1);
												
												if(data.results[i].Tim05 == "0.00") data.results[i].Tim05 = "";
												else data.results[i].Tim05 = data.results[i].Tim05.substring(0,data.results[i].Tim05.length-1);
													
												// 동의여부
												if(data.results[i].Agryn == "X") data.results[i].Agryn = true;
												else data.results[i].Agryn = false;
												
												// 호출여부
												if(data.results[i].Calyn == "X") data.results[i].Calyn = true;
												else data.results[i].Calyn = false;
												
												oDetailTableDatas.Data.push(data.results[i]);
											}
											
											sap.ui.getCore().byId(oController.PAGEID + "_DetailTable").setVisibleRowCount(data.results.length);
											
										}
									}, function(Res){
										vError = "E";
										if(Res.response.body){
											ErrorMessage = Res.response.body;
											var ErrorJSON = JSON.parse(ErrorMessage);
											if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
												vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
											} else {
												vErrorMessage = ErrorMessage;
											}
										}
									}
							);
							
						}
					}, function(Res){
						vError = "E";
						if(Res.response.body){
							ErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							} else {
								vErrorMessage = ErrorMessage;
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
			
			oController._DetailJSonModel.setData(oDetailData);
			oController._DetailTableJSonModel.setData(oDetailTableDatas);
			
			// 요일,휴일 설정
			oController.onChangeDate(null);
			
		}
		
		// 결재 상태에 따라 Page Header Text 수정		
		if(vZappStatAl == "" || !vZappStatAl){
			sap.ui.getCore().byId(oController.PAGEID + "_NoticePanel").setExpanded(true);
			oPortalTitle.setText(oBundleText.getText("LABEL_1953") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1953:연장근무명령 신청
		} else if(vZappStatAl == "10"){
			sap.ui.getCore().byId(oController.PAGEID + "_NoticePanel").setExpanded(false);
			oPortalTitle.setText(oBundleText.getText("LABEL_1953") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1953:연장근무명령 신청
		} else {
			sap.ui.getCore().byId(oController.PAGEID + "_NoticePanel").setExpanded(false);
			oPortalTitle.setText(oBundleText.getText("LABEL_1953") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1953:연장근무명령 신청
		}
		
		// 결재선 
		oController.setApprovalLineModel(oController);
		if(vAppno != "") oController.onSetAppl(null);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent){
//		var oContent = sap.ui.getCore().byId("ZNK_PORTAL" + "_notUnifiedSpllit");
//		oContent.toDetail("ZUI5_HR_Overtime.ZUI5_HR_OvertimeList");
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();

		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_Overtime.ZUI5_HR_OvertimeList",
			      data : { }
			});	
		}
	},
	
	// 소속부서
	setOrgeh : function(oController){
		var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");
		if(oOrgeh.getItems()) oOrgeh.destroyItems();	
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
		var oPath = "/TimeOrgehListSet?$filter=Actty eq '" + _gAuth + "'";
		
		oModel.read(oPath, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0; i<data.results.length; i++){
							oOrgeh.addItem(new sap.ui.core.Item({text : data.results[i].Orgtx, key : data.results[i].Orgeh}));
						}			
					}
				}, function(Res){
					if(Res.response.body){
						ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						}
						console.log(ErrorMessage);
					}
				}
		);
	},
	
	// 신청부서 변경 시, 개인 결재선 체크박스 선택이 변경됐을 때 결재선에 이름 표시되게 한다.
	onSetAppl : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();
		
		var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");
		var vOrgeh = oOrgeh.getSelectedKey();
		
		var oPrvline = oController._DetailJSonModel.getProperty("/Data/Prvline");
		var vPrvline = "";
		
		if(oPrvline == true) vPrvline = "X"; else vPrvline = "";
		// 개인 결재선 적용 체크여부에 따라 결재자 지정버튼 enabled 설정
		if(oEvent){
			var vControlId = common.Common.getControlId(oController, oEvent.getSource().getId());
			if(vControlId.Id == "Prvline" && vPrvline == "X"){
				sap.ui.getCore().byId(oController.PAGEID + "_ApplBtn").setEnabled(true);
			} else if(vControlId.Id == "Prvline" && vPrvline == ""){
				sap.ui.getCore().byId(oController.PAGEID + "_ApplBtn").setEnabled(false);
			}
		}
		
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
		var oPath = "/RetvApprLineSet?$filter=Orgeh eq '" + vOrgeh + "' and Prvline eq '" + vPrvline + "' and ZreqForm eq 'HR05'";
			oPath += " and Actty eq '" + _gAuth + "'";
			oPath += " and Appno eq '" + oController._vAppno + "'";
		
		var vData = [];
		oModel.read(oPath, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0; i<data.results.length; i++){
							vData.push(data.results[i]);
						}

						if(_gAuth == "E"){
							// ESS인 경우 odata 호출결과 Orgeh를 소속부서에 선택되도록 수정함
							oController._DetailJSonModel.setProperty("/Data/Orgeh", data.results[0].Orgeh); 
							// 만약 소속부서리스트에 없는경우 리스트에 해당 아이템 추가
							var onCheck = function(){
								for(var a=0; a<oOrgeh.getItems().length; a++){
									if(oOrgeh.getItems()[a].getKey() == data.results[0].Orgeh) {
										return true;
									}
								}
								return false;
							}
							
							if(onCheck() == false){
								oOrgeh.addItem(new sap.ui.core.Item({key : data.results[0].Orgeh, text : data.results[0].Orgtx}));
								oOrgeh.setSelectedKey(data.results[0].Orgeh);
							}
							
//							if(!oOrgeh.getSelectedItem()){
//								oOrgeh.addItem(new sap.ui.core.Item({key : data.results[0].Orgeh, text : data.results[0].Orgtx}));
//								oOrgeh.setSelectedKey(data.results[0].Orgeh);
//							}
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
						
						sap.m.MessageBox.alert(ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
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

	
	// 결재자 정보
	setApprovalLineModel : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		
		if(!oController._ApprovalLineDialog) {
			oController._ApprovalLineDialog = sap.ui.jsfragment("fragment.ApprovalLine", oController);
			oView.addDependent(oController._ApprovalLineDialog);
		}		

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ApprovalTable2");
		var oJSONModel = oTable.getModel();
		var vData = {Data : []};
		
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		var oPath = "/ApprovalLineApplSet?$filter=ZreqForm eq 'HR05' and ZreqPernr1 eq '" + oController._vReqPernr + "'";
		
		if(oController._vAppno != "") oPath += " and Appno eq '" + oController._vAppno + "'";
		
		oModel.read(oPath, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){							
							data.results[i].Idx = i+1;
							vData.Data.push(data.results[i]);
						}
						
						if(data.results.length < oTable.getVisibleRowCount()){
							for(var i=data.results.length; i<oTable.getVisibleRowCount(); i++){
								var blankData = {Idx : i+1};		
								vData.Data.push(blankData);
							}
						}
						
					} else {
						for(var i=0; i<oTable.getVisibleRowCount(); i++){
							var blankData = {Idx : i+1};		
							vData.Data.push(blankData);
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
		
		oJSONModel.setData(vData);
		
	},

	onChangeDate : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();
		
		if(oEvent && oEvent.getParameters().valid == false){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0055"), {title : oBundleText.getText("LABEL_0053")});	// 55:유효하지 않은 날짜형식입니다.
			oEvent.getSource().setValue();
			return;
		}
		
		var vData = oController._DetailJSonModel.getProperty("/Data");
//		var vTmp1 = new Date(vData.Datum);
//		var days = ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];
//		var day = days[vTmp1.getDay()];
//
//		oController._DetailJSonModel.setProperty("/Data/Day", day);
//		
//		if(vTmp1.getDay() == 0 || vTmp1.getDay() == 6) oController._DetailJSonModel.setProperty("/Data/Holiday", oBundleText.getText("LABEL_0854"));	// 854:휴일
//		else oController._DetailJSonModel.setProperty("/Data/Holiday", "평일");
		
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		
		var oModel = sap.ui.getCore().getModel("ZHR_OVERTIME_SRV");
		var oPath = "/HoilDayCheckSet?$filter=Pernr eq '" + vEmpLoginInfo[0].Pernr + "'";
			oPath += " and Begda eq datetime'" + vData.Datum + "T00:00:00'";
			
		oModel.read(oPath, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						oController._DetailJSonModel.setProperty("/Data/Day", data.results[0].Daytxt);
						oController._DetailJSonModel.setProperty("/Data/Holiday", data.results[0].Holidaytxt);
					}
				},
				function(Res){
					if(Res.response.body){
						oController._DetailJSonModel.setProperty("/Data/Day", "");
						oController._DetailJSonModel.setProperty("/Data/Holiday", "");
						
						var ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						oController.Error = "E"; 
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						}else{
							oController.ErrorMessage = ErrorMessage ;
						}
					}
				}
		);
		
		if(oController.Error == "E"){
			oController.Error = "";
			sap.m.MessageBox.alert(oController.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
			return;
		}
		
		if(oEvent) oController.setOttm();
	},
	
	onChangeTime : function(oEvent){},
	
	_AddPersonDialog : null ,
	displayEmpSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();
		
//		oController._vSutrnm = oEvent.getSource();
	
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
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
			} else if(vIDXs.length < 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}
		
//			var vIdx = oController._vSutrnm.getCustomData()[0].getValue()*1; // Idx
//				vIdx = vIdx - 1; 
//			var vSeq = oController._vSutrnm.getCustomData()[1].getValue(); // 대근자 구분
//			
//			oController._DetailTableJSonModel.setProperty("/Data/" + vIdx + "/Sutr" + vSeq, mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[0] + "/Pernr"));
//			oController._DetailTableJSonModel.setProperty("/Data/" + vIdx + "/Sutrnm" + vSeq, mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[0] + "/Ename"));
			
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();
				
		oController._AddPersonDialog.close();
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();
	},
	
	// 시간 변경했을 때 OT구분, OT시간 등등 계산 
	setOttm : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();
		
//		if(oEvent && oEvent.getParameters().value){
//			var vTmp = oEvent.getParameters().value.substring(2,4);
//			
//			if(!(vTmp == "00" || vTmp == "10" || vTmp == "20" || vTmp == "30" || vTmp == "40" || vTmp == "50")){
//				sap.m.MessageBox.alert("시간을 10분 단위로 입력하여 주십시오.", {title : oBundleText.getText("LABEL_0053")});
//				oEvent.getSource().setValue();
//				return;
//			}
//			
//		}
		
		if(oEvent){
			
			if(common.Common.checkTime(oEvent) == false){
				oEvent.getSource().setValue();
				return;
			}
			
			if(oEvent.getParameters().valid == false){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2561"), {title : oBundleText.getText("LABEL_0053")});	// 2561:유효하지 않은 형식입니다.
				oEvent.getSource().setValue();
				return;
			}
		
		}
		
		var vData = oController._DetailTableJSonModel.getProperty("/Data");
		if(!vData || vData.length == 0) return;
		
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		
		var ErrorMessage = "";
		
		var oModel = sap.ui.getCore().getModel("ZHR_OVERTIME_SRV");
		for(var i=0; i<vData.length; i++){
			
			if(vData[i].Beguz && vData[i].Enduz){
				var oPath = "/OvertimeApplEmpListSet?$filter=Prcty eq 'C'";
					oPath += " and Beguz eq '" + vData[i].Beguz + "' and Enduz eq '" + vData[i].Enduz + "'";
					oPath += " and Pernr eq '" + vData[i].Pernr + "' and Ename eq '" + encodeURIComponent(vData[i].Ename) + "'";
					oPath += " and Seqnr eq "  + vData[i].Idx + " and Appno eq '" + oController._vAppno + "'";
					oPath += " and Datum eq datetime'" + dateFormat.format(new Date(oneData.Datum)) + "T00:00:00'";
					console.log(oPath);
				var vCalyn = vData[i].Calyn == "X" || vData[i].Calyn == true ? "X" : "";
					oPath += " and Calyn eq '" + vCalyn + "'";
					
				var vLastyn = i + 1 == vData.length? "X" : "" ; //마지막 레코드 여부 확인
					oPath += " and Lastyn eq '" + vLastyn + "'";
				
				 
				
				oModel.read(oPath, null, null, false, 
						function(data,res){
							if(data && data.results.length){		
								
								// 근무형태
								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Ttext", data.results[0].Ttext);
								
								// 실근무시작일
								if(data.results[0].Begda) oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Begda", dateformat.format(data.results[0].Begda));
								
								// 시작,종료시간
								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Beguz", data.results[0].Beguz);
								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Enduz", data.results[0].Enduz);
								
								// OT구분,시간
//								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Ottyp", data.results[0].Ottyp);
//								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Ottxt", data.results[0].Ottxt);
								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Awart", data.results[0].Awart);
								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Atext", data.results[0].Atext);
								
								if(data.results[0].Abrst == "0.00") oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Abrst", "");
								else oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Abrst", data.results[0].Abrst.substring(0,data.results[0].Abrst.length-1));
								
								if(data.results[0].Tim01 == "0.00") oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim01", "");
								else oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim01", data.results[0].Tim01.substring(0,data.results[0].Tim01.length-1));
								
								if(data.results[0].Tim02 == "0.00") oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim02", "");
								else oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim02", data.results[0].Tim02.substring(0,data.results[0].Tim02.length-1));
								
								if(data.results[0].Tim03 == "0.00") oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim03", "0.0");
								else oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim03", data.results[0].Tim03.substring(0,data.results[0].Tim03.length-1));
								
								if(data.results[0].Tim04 == "0.00") oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim04", "");
								else oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim04", data.results[0].Tim04.substring(0,data.results[0].Tim04.length-1));
								
								if(data.results[0].Tim05 == "0.00") oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim05", "");
								else oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim05", data.results[0].Tim05.substring(0,data.results[0].Tim05.length-1));
								
//								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Ottm4", data.results[0].Ottm4);
//								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Ottm5", data.results[0].Ottm5);
								
								// 초과여부
								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Ovryn", data.results[0].Ovryn);
								
								// 동의여부 활성화
								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/AgrynAct", data.results[0].AgrynAct);
								
								// 동의여부
								if(data.results[0].Agryn == "X") oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Agryn", true);
								else oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Agryn", false);
							}
						}, function(Res){
							if(Res.response.body){
								ErrorMessage = Res.response.body;
								var ErrorJSON = JSON.parse(ErrorMessage);
								if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
									ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
								}
								
								// 값 초기화
								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Beguz", "");
								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Enduz", "");
								
//								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Begda", null);
//								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Ottyp", "");
//								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Ottxt", "");

								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Awart", "");
								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Atext", "");
								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Abrst", "");
								
								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim01", "");
								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim02", "");
								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim03", "");
								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim04", "");
								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Tim05", "");
//								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Ottm4", "");
//								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Ottm5", "");
								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/AgrynAct", "");
//								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Agryn", false);
//								oController._DetailTableJSonModel.setProperty("/Data/"+i+"/Calyn", false);
								
							}
						}
				);
			}
			
		}
		
		if(ErrorMessage != "") sap.m.MessageBox.alert(ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
		
	},
	
	// 대상자 등록 Dialog
	_DetailInfoDialog : null,
	onPressNewRecord : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();
		
		// 근무일자, 소속부서가 없으면 메세지 처리한다.
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		
		if(!oneData.Datum){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2431"), {title : oBundleText.getText("LABEL_0053")});	// 2431:근무일자를 입력해주십시오.
			return;
		} else if(!oneData.Orgeh){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2520"), {title : oBundleText.getText("LABEL_0053")});	// 2520:소속부서를 선택해주십시오.
			return;
		}
		
		if(!oController._DetailInfoDialog) {
			oController._DetailInfoDialog = sap.ui.jsfragment("ZUI5_HR_Overtime.fragment.DetailInfoDialog", oController);
			oView.addDependent(oController._DetailInfoDialog);
		}
		
		var vData = {Data : []};
		oController._DetailInfoDialog.getModel().setData(vData);

		oController._DetailInfoDialog.open();
	},
	
	beforeOpenDetailInfoDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();	
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_AddTable");
		var vData = {Data : []};
		oController._DialogJsonModel.setData(vData);
		oTable.bindRows("/Data");
		
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		var vOrgeh = oneData.Orgeh;
		
		var oPath = "/TargetEmplistSet?$filter=Orgeh eq '" + vOrgeh + "'";
			oPath += " and Datum eq datetime'" + dateFormat.format(new Date(oneData.Datum)) + "T00:00:00'";
			oPath += " and Actty eq '" + _gAuth + "'";
			
		var vErrorMessage = "";	
			
		var oModel = sap.ui.getCore().getModel("ZHR_OVERTIME_SRV");
		oModel.read(oPath, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){		
							vData.Data.push(data.results[i]);
						}
					}
				}, function(Res){
					if(Res.response.body){
						var ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						oController.Error = "E"; 
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						}else{
							vErrorMessage = ErrorMessage ;
						}
					}
				}
		);	

		if(vErrorMessage != ""){
			new control.ZNK_SapBusy.oErrorMessage(vErrorMessage);
			return;
		} 
		
		oController._DialogJsonModel.setData(vData);
		
		// ESS의 경우 0번째 라인(본인)을 자동으로 선택되게 함
		if(_gAuth == "E"){
			oTable.addSelectionInterval(0, 0);
		}
		
//		document.getElementById(oController.PAGEID + "_Beguz").focus();
	},
	
	// 대상자 등록 >> 대상자 선택
	onSaveDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();
				
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_AddTable");
		var vIndexs = oTable.getSelectedIndices();
		
//		if(vIndexs.length == 0){
//			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
//			return;
//		}
		
//		var oneData = oController._DetailJSonModel.getProperty("/Data");
		var oneData = oController._DetailInfoDialog.getModel().getProperty("/Data");
		
//		if(!oneData.BeguzD || !oneData.EnduzD){
//			sap.m.MessageBox.alert("연장근무시간을 먼저 입력하여 주십시오.", {title : oBundleText.getText("LABEL_0053")});
//			return;
//		}

		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var vTableData = oController._DetailTableJSonModel.getData();
		var vInfoData = vTableData.Data;
		
		var selectData = []; // 선택한 대상자 데이터		
		
		for(var i=0; i<vIndexs.length; i++){	
			var vContext = oTable.getContextByIndex(vIndexs[i]).sPath;
						
			selectData.push(oController._DialogJsonModel.getProperty(vContext));	
			
			// 연장근무시간을 입력한 경우에만 odata를 호출한다.
			if(oneData.BeguzD && oneData.EnduzD){
				var vDatum = oController._DetailJSonModel.getProperty("/Data/Datum");
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
				
				var ErrorMessage = "", vError = "";
				
				var oModel = sap.ui.getCore().getModel("ZHR_OVERTIME_SRV");
				for(var a=0; a<selectData.length; a++){
					var seq = a+1;
					selectData[a].Beguz = oneData.BeguzD;
					selectData[a].Enduz = oneData.EnduzD;
					
					if(selectData[a].Beguz && selectData[a].Enduz){
						var oPath = "/OvertimeApplEmpListSet?$filter=Prcty eq 'C'";
							oPath += " and Beguz eq '" + selectData[a].Beguz + "' and Enduz eq '" + selectData[a].Enduz + "'";
							oPath += " and Pernr eq '" + selectData[a].Pernr + "' and Ename eq '" + encodeURIComponent(selectData[a].Ename) + "'";
							oPath += " and Seqnr eq "  + seq;
							oPath += " and Datum eq datetime'" + dateFormat.format(new Date(vDatum)) + "T00:00:00'";
							oPath += " and Calyn eq ''";
						
						oModel.read(oPath, null, null, false, 
								function(data,res){
									if(data && data.results.length){		
										
										// 근무형태
										selectData[a].Ttext = data.results[0].Ttext;
										
										// 실근무시작일
										if(data.results[0].Begda) selectData[a].Begda = dateformat.format(data.results[0].Begda);
										
										// OT구분,시간
										selectData[a].Awart = data.results[0].Awart;
										selectData[a].Atext = data.results[0].Atext;
										
										if(data.results[0].Abrst == "0.00") selectData[a].Abrst = "";
										else selectData[a].Abrst = data.results[0].Abrst.substring(0,data.results[0].Abrst.length-1);
										
										if(data.results[0].Tim01 == "0.00") selectData[a].Tim01 = "";
										else selectData[a].Tim01 = data.results[0].Tim01.substring(0,data.results[0].Tim01.length-1);
										
										if(data.results[0].Tim02 == "0.00") selectData[a].Tim02 = "";
										else selectData[a].Tim02 = data.results[0].Tim02.substring(0,data.results[0].Tim02.length-1);
										
										if(data.results[0].Tim03 == "0.00") selectData[a].Tim03 = "0";
										else selectData[a].Tim03 = data.results[0].Tim03.substring(0,data.results[0].Tim03.length-1);
										
										if(data.results[0].Tim04 == "0.00") selectData[a].Tim04 = "";
										else selectData[a].Tim04 = data.results[0].Tim04.substring(0,data.results[0].Tim04.length-1);
										
										if(data.results[0].Tim05 == "0.00") selectData[a].Tim05 = "";
										else selectData[a].Tim05 = data.results[0].Tim05.substring(0,data.results[0].Tim05.length-1);
										
//											selectData[a].Ottm4 = data.results[0].Ottm4;
//											selectData[a].Ottm5 = data.results[0].Ottm5;
										
										// 초과여부
										selectData[a].Ovryn = data.results[0].Ovryn;
										
										// 동의여부 활성화
										selectData[a].AgrynAct = data.results[0].AgrynAct;
										
										// 동의여부
										if(data.results[0].Agryn == "X") selectData[a].Agryn = true;
										else selectData[a].Agryn = false;
									}
								}, function(Res){
									if(Res.response.body){
										ErrorMessage = Res.response.body;
										var ErrorJSON = JSON.parse(ErrorMessage);
										if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
											ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
										}
										vError = "E";
										sap.m.MessageBox.alert(ErrorMessage);
									}
								}
						);
					}
					if(vError == "E") return;
				}
			}
			
		}
		
		vTableData.Data = [];
		oController._DetailTableJSonModel.setData(vTableData);
		var vZappStatAl = oController._DetailJSonModel.getProperty("/Data/ZappStatAl");
		
		for(var i=0; i<selectData.length; i++){
			if(oneData.BeguzD) selectData[i].Beguz = oneData.BeguzD;
			if(oneData.EnduzD) selectData[i].Enduz = oneData.EnduzD;
			selectData[i].ZappStatAl = vZappStatAl;
			selectData[i].Idx = i+1;
			vTableData.Data.push(selectData[i]);
		}
		
		// 기존데이터
		for(var i=0; i<vInfoData.length; i++){
			vInfoData[i].ZappStatAl = vZappStatAl;
			vInfoData[i].Idx = selectData.length + i + 1;
			vTableData.Data.push(vInfoData[i]);
		}
		
		oController._DetailTableJSonModel.setData(vTableData);
		oDetailTable.setVisibleRowCount(vTableData.Data.length);
		
		oController.setOttm(null);
		
		if(oController._DetailInfoDialog.isOpen()){
			oController._DetailInfoDialog.close();
		}
	},
	
	// 대근휴가자 선택
	onPressEmplist : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();
		
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		
		if(!oneData.Datum){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2710"), {title : oBundleText.getText("LABEL_0053")});	// 2710:근무일자를 선택하여 주십시오.
			return;
		} else if(!oneData.Orgeh){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2519"), {title : oBundleText.getText("LABEL_0053")});	// 2519:소속부서를 선택하여 주십시오.
			return;
		}
		
		if(!oController._EmpInfoDialog) {
			oController._EmpInfoDialog = sap.ui.jsfragment("ZUI5_HR_Overtime.fragment.EmpListDialog", oController);
			oView.addDependent(oController._EmpInfoDialog);
		}
		
		var vData = {Data : []};
		oController._DialogJsonModel.setData(vData);
		
		oController._vIdx = parseInt(oEvent.getSource().getCustomData()[0].getValue()) - 1;

		oController._EmpInfoDialog.open();
	},
	
	beforeOpenEmpListDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();
		
		var vErrorMessage = "";
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpListTable");
		var oJSONModel = oTable.getModel();
		var vData = {Data : []};
		
		oTable.bindRows("/Data");
		oJSONModel.setData(vData);
		oTable.clearSelection();
		
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		var vOrgeh = oneData.Orgeh;
		
		var oPath = "/TargetEmplistSet?$filter=Orgeh eq '" + vOrgeh + "'";
			oPath += " and Datum eq datetime'" + dateFormat.format(new Date(oneData.Datum)) + "T00:00:00'";
			oPath += " and Actty eq '" + _gAuth + "'";
		
		var oModel = sap.ui.getCore().getModel("ZHR_OVERTIME_SRV");
		oModel.read(oPath, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){		
							vData.Data.push(data.results[i]);
						}
					}
				}, function(Res){
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

		if(vErrorMessage != ""){
			oController.BusyDialog.close();
			new control.ZNK_SapBusy.oErrorMessage(vErrorMessage);
			return;
		} 
		
		oJSONModel.setData(vData);
		
		oController.BusyDialog.close();
	},
	
	onSelectEmp : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpListTable");
		var oJSONModel = oTable.getModel();
		var vIndexs = oTable.getSelectedIndices();
		
		if(vIndexs.length == 0){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		} else if(vIndexs.length > 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2453"), {title : oBundleText.getText("LABEL_0053")});	// 2453:대상자를 한명만 선택하여 주십시오.
			return;
		}
		
		var vContext = oTable.getContextByIndex(vIndexs[0]).sPath;
		
		oController._DetailTableJSonModel.setProperty("/Data/" + oController._vIdx + "/Ofpnr", oJSONModel.getProperty(vContext + "/Pernr"));
		oController._DetailTableJSonModel.setProperty("/Data/" + oController._vIdx + "/Ofpnm", oJSONModel.getProperty(vContext + "/Ename"));
		
		oController._EmpInfoDialog.close(); 
	},
	
	onCloseEmpList : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();
		
		oController._DetailTableJSonModel.setProperty("/Data/" + oController._vIdx + "/Ofpnr", "");
		oController._DetailTableJSonModel.setProperty("/Data/" + oController._vIdx + "/Ofpnm", "");
		
		oController._EmpInfoDialog.close();
	},
	
	onPressDelRecord : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();
		
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var vIndexs = oDetailTable.getSelectedIndices();
		
		if(vIndexs.length < 1){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		var deleteRecord = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				var vIdx = 0;
				var check = function(seq){
					for(var a=0; a<vIndexs.length; a++){
						if(vIndexs[a] == seq) return false;
					}
					
					return true;
				}

				var vData = oController._DetailTableJSonModel.getData();
				var vInfoData = vData.Data;
				
				vData.Data = [];
				oController._DetailTableJSonModel.setData(vData);
				
				for(var i=0; i<vInfoData.length; i++){
					if(check(i) == false){
						
					} else {
						vIdx = vIdx + 1;
						vInfoData[i].Idx = vIdx;
						vData.Data.push(vInfoData[i]);
					}
				}
				
				oController._DetailTableJSonModel.setData(vData);
				oDetailTable.setVisibleRowCount(vData.Data.length);
				oDetailTable.clearSelection();
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// 35:삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : deleteRecord
		});
		
	},
	
	// 근무명령확인서
	onPrint : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();
				
		var oModel = sap.ui.getCore().getModel("ZHR_OVERTIME_SRV");
		var oPath = "/OvertimeConfDocSet?$filter=Appno eq '" + oController._vAppno + "'";
		
		var vUrl = "";
		
		oModel.read(oPath, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){		
							vUrl = data.results[0].Url;
						}
					}
				}, function(Res){
					if(Res.response.body){
						var ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						oController.Error = "E"; 
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						}else{
							oController.ErrorMessage = ErrorMessage ;
						}
					}
				}
		);
		
		if(oController.Error == "E"){
			oController.Error = "";
			sap.m.MessageBox.show(oController.ErrorMessage);
		}
		
		if(vUrl != ""){
//			document.iWorker.location.href = vUrl;
			window.open(vUrl);
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2424"), {title : oBundleText.getText("LABEL_0053")});	// 2424:근무명령확인서 Url이 존재하지 않습니다.
			return;
		}
		
	},
	
	// 임시저장
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "T");
	},
	
	// 신청
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 재상신
	onPressSaveX : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();

		oController.onSave(oController , "X");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty){
		var vErrorMessage = "";
		
		if(oController.onValidationData(oController, vPrcty) == false) return;
		
		var onProcess = function(){
			var oModel = sap.ui.getCore().getModel("ZHR_OVERTIME_SRV");
			
			var createData = {};
			var vUri = "";
			var vCalyn = "";	// 호출여부가 X인경우 참조선 설정하는 odata 호출
			
			// 신청내역
			var oneData = oController._DetailJSonModel.getProperty("/Data");
			if(oController._vAppno) createData.Appno = oController._vAppno;
			createData.Datum = "\/Date("+ common.Common.getTime(oneData.Datum)+")\/";
			createData.Orgeh = oneData.Orgeh;
			
			if(oneData.Prvline == true) createData.Prvline = "X"; // 개인결재선적용여부

			createData.Pernr = oneData.Appernr;
			createData.Prcty = vPrcty;
			
			if(createData.Prcty == "C"){
				createData.Zhtml = oController.makeHtml(oController);
			}
			
			var vTotalData = [];
			
			var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
			
			for(var i=0; i<vTableData.length; i++){
				var detailData = {};
				
				if(oController._vAppno) detailData.Appno = oController._vAppno;
				detailData.Pernr = vTableData[i].Pernr;
				detailData.Ename = vTableData[i].Ename;
				detailData.Orgeh = vTableData[i].Orgeh;
				
				// 시간, 실근무시작일
				detailData.Beguz = vTableData[i].Beguz;
				detailData.Enduz = vTableData[i].Enduz;				
//				if(vTableData[i].Begda) detailData.Begda = "\/Date("+ common.Common.getTime(vTableData[i].Begda)+")\/";
				
				// 근무유형
				detailData.Awart = vTableData[i].Awart;
				
				// OT구분, 시간
//				detailData.Ottyp = vTableData[i].Ottyp;
				if(vTableData[i].Abrst) detailData.Abrst = vTableData[i].Abrst; else detailData.Abrst = "0";
				if(vTableData[i].Tim01) detailData.Tim01 = vTableData[i].Tim01; else detailData.Tim01 = "0";
				if(vTableData[i].Tim02) detailData.Tim02 = vTableData[i].Tim02; else detailData.Tim02 = "0";
				if(vTableData[i].Tim03) detailData.Tim03 = vTableData[i].Tim03; else detailData.Tim03 = "0";
				if(vTableData[i].Tim04) detailData.Tim04 = vTableData[i].Tim04; else detailData.Tim04 = "0";
				if(vTableData[i].Tim05) detailData.Tim05 = vTableData[i].Tim05; else detailData.Tim05 = "0";
//				detailData.Ottm4 = vTableData[i].Ottm4;
//				detailData.Ottm5 = vTableData[i].Ottm5;
				
				// 대근휴가자
				detailData.Ofpnr = vTableData[i].Ofpnr;
				detailData.Ofpnm = vTableData[i].Ofpnm;
				
				// 동의여부
				if(vTableData[i].Agryn == true) detailData.Agryn = "X";
				
				// 호출여부
				if(vTableData[i].Calyn && vTableData[i].Calyn == true){
					vCalyn = "X";
					detailData.Calyn = "X";
				}
				
				// 근무사유
				if(vTableData[i].Tmrsn) detailData.Tmrsn = vTableData[i].Tmrsn;
				
				vTotalData.push(detailData);
			}			

			createData.OvertimeApplNav = vTotalData;
			
			// 개인 결재자 지정
			var vApprovalData = oController._ApprovalLineModel.getProperty("/Data");
			var vAppTotalData = [];
			
			if(vApprovalData){
				for(var i=0; i<vApprovalData.length; i++){
					if(vApprovalData[i].Pernr){
						var data = {};
							data.Pernr = vApprovalData[i].Pernr;
						vAppTotalData.push(data);
					}
				}
			}
			
			createData.ApprovalLineApplNav = vAppTotalData;		
			
			// 선택한 소속부서에 지정된 결재자
			var vRetvData = oController._RetvLineModel.getData();
			var vRetvTotalData = [];
			for(var i=0; i<vRetvData.length; i++){
				var detailData = {};
				detailData.Appno = vRetvData[i].Appno;
				detailData.Aprnm = vRetvData[i].Aprnm;
				detailData.Orgeh = vRetvData[i].Orgeh;
				detailData.Pernr = vRetvData[i].Pernr;
				detailData.Prvline = vRetvData[i].Prvline;
				detailData.ZappSeq = vRetvData[i].ZappSeq;
				detailData.ZappTyp = vRetvData[i].ZappTyp;
				detailData.ZreqForm = vRetvData[i].ZreqForm;
				
				vRetvTotalData.push(detailData);
			}
			createData.RetvApprLineNav = vRetvTotalData;
			
			oModel.create("/OvertimeApplContentSet", createData, null,
					function(data,res){
						if(data) {
							oController._vAppno = data.Appno;
							vUri = data.ZappUrl ;
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
				sap.m.MessageBox.alert(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				return;
			}
			
			// 호출여부가 체크된 경우 참조선 생성
			if(vCalyn == "X"){
				oController.setReferenceLine(oController);
			}			
			
			if(vPrcty == "C"){
				sap.m.MessageBox.show(vCompTxt, {
					title : oBundleText.getText("LABEL_0052"),	// 52:안내
					onClose : function(){
						if(vUri != ""){
							var openUrl = function(fVal){
									window.open(vUri);
									oController.onBack();
							}
							
							sap.m.MessageBox.alert(oBundleText.getText("LABEL_2681"), {	// 2681:WeLS 결재화면에서 기안버튼을 반드시 클릭하여 주시기 바랍니다.
								title : oBundleText.getText("LABEL_0052"),	// 52:안내
								onClose : openUrl
							});	
						} else {
							oController.onBack();
						}
					}
				});
			}else{
				sap.m.MessageBox.show(vCompTxt, {
					title : oBundleText.getText("LABEL_0052"),	// 52:안내
					onClose : oController.onBack
				});
			}			
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
		} else if(vPrcty == "X"){
			vInfoTxt = oBundleText.getText("LABEL_2577");	// 2577:재상신 하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_2641");	// 2641:현재 문서를 작성중 상태로 변경하였습니다. \n수정 후 재신청하시기 바랍니다.
		} else {
			vInfoTxt = oBundleText.getText("LABEL_0051");	// 51:신청하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0048");	// 48:신청이 완료되었습니다.
		}
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},
	
	setReferenceLine : function(oController){
		var vOrgeh = oController._DetailJSonModel.getProperty("/Data/Orgeh");
		if(!vOrgeh) return;
		
		var vErrorMessage = "";
		
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		var oPath = "/ReferenceLineSet?$filter=Orgeh eq '" + vOrgeh + "' and Prvline eq '' and ZreqForm eq 'RF05'";
		
		var vTotalData = [];
		oModel.read(oPath, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0; i<data.results.length; i++){
							if(parseInt(data.results[i].Pernr) != 0){
								var detailData = {};
									detailData.Pernr = data.results[i].Pernr;
								vTotalData.push(detailData);	
							}							
						}
					}
				}, function(Res){
					if(Res.response.body){
						ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						}
						
						sap.m.MessageBox.alert(ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
						return;
					}
				}
		);	
		
		// create
		var createData = {};
		createData.ApprovalLineApplNav = vTotalData;
		createData.ZreqForm = "RF05";
		createData.Appno = oController._vAppno;
		
		oModel.create("/ApprovalLineApplSet", createData, null,
				function(data,res){
					if(data) {
						
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
		
		if(vErrorMessage != ""){
			sap.m.MessageBox.alert(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
			return;
		}
	},

	onValidationData : function(oController, vPrcty){

		var vData = oController._DetailJSonModel.getProperty("/Data");
		if(!vData.Datum){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2431"), {title : oBundleText.getText("LABEL_0053")});	// 2431:근무일자를 입력해주십시오.
			return false;
		} else if(!vData.Orgeh){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2520"), {title : oBundleText.getText("LABEL_0053")});	// 2520:소속부서를 선택해주십시오.
			return false;
		}		

		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		if(vTableData.length == 0){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2451"), {title : oBundleText.getText("LABEL_0053")});	// 2451:대상자를 등록하여 주십시오.
			return false;
		}
			
		for(var i=0; i<vTableData.length; i++){
			if(!vTableData[i].Tmrsn || vTableData[i].Tmrsn.trim() == ""){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2711"), {title : oBundleText.getText("LABEL_0053")});	// 2711:근무사유를 입력해주십시오.
				return false;
			} else if(!vTableData[i].Beguz || !vTableData[i].Enduz){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2523"), {title : oBundleText.getText("LABEL_0053")});	// 2523:시간을 입력해주십시오.
				return false;
			} 
//		    else if(vTableData[i].Ovryn == "X"){
//				sap.m.MessageBox.alert("");
//		    	return false;
//			}
		}		

		// 결재자 지정 여부 확인(개인 결재선 적용을 체크했을 때만 확인)
		if(vData.Prvline == true || vData.Prvline == "X"){
			var vApprovalData = oController._ApprovalLineModel.getProperty("/Data");
			var vAppTotalData = [];
			
			if(vApprovalData){
				for(var i=0; i<vApprovalData.length; i++){
					if(vApprovalData[i].Pernr){
						var data = {};
							data.Pernr = vApprovalData[i].Pernr;
						vAppTotalData.push(data);
					}
				}
			}
			
			if(vAppTotalData.length == 0){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2407"), {title : oBundleText.getText("LABEL_0053")});	// 2407:개인 결재선 적용 시 결재자를 지정하여 주십시오.
				return false;
			}
		} else {	// 개인결재선 지정 안했을 때 결재자 데이터가 있는지 확인한다.
			var vRetvData = oController._RetvLineModel.getData();
			
			if(!vRetvData || vRetvData.length == undefined || vRetvData[0].Pernr == "00000000"){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2412"), {title : oBundleText.getText("LABEL_0053")});	// 2412:결재선 정보가 없습니다.
				return false;
			}
		}
			
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();
		
		var onProcess = function(){
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_OVERTIME_SRV");
				var oPath = "/OvertimeApplContentSet(Appno='" + oController._vAppno + "')";
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
					sap.m.MessageBox.alert(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
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
	
	// 결재자 지정
	onApprovalLine : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overtime.ZUI5_HR_OvertimeDetail");
		var oController = oView.getController();

		common.ZNK_ApprovalLine.oController = oController;
		
		oController._vReqPernr = oController._DetailJSonModel.getProperty("/Data/Appernr");
				
		if(!oController._ApprovalLineDialog) {
			oController._ApprovalLineDialog = sap.ui.jsfragment("fragment.ApprovalLine", oController);
			oView.addDependent(oController._ApprovalLineDialog);
		}
		
		oController._ApprovalLineDialog.open();
		
	},
	
	makeHtml : function(oController){
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy/MM/dd"});
		var table_start = "[TABLE_START]";
		var table_end = "[TABLE_END]";	
		var html_url ;
		html_url = "/sap/bc/ui5_ui5/sap/ZUI5_HR_ESSAPP/ZUI5_HR_Overtime/html/Approval.html";		
		
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
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2411"), {title : oBundleText.getText("LABEL_0053")});	// 2411:결재 HTML 가져오기에 실패하였습니다.
			return "";
		}
		
		var table_html = tHtml.substring(tHtml.indexOf(table_start) + table_start.length, tHtml.indexOf(table_end));
		var vDetailData = oController._DetailJSonModel.getProperty("/Data");
		
		tHtml = tHtml.replace("[ITEM_DATA1]", dateFormat.format(new Date(vDetailData.Datum))); //근무일자
		tHtml = tHtml.replace("[ITEM_DATA2]", vDetailData.Day + " / " + vDetailData.Holiday); // 요일,휴일
		
		var vOrgtx = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh").getSelectedItem().getText();
			vOrgtx = vOrgtx.replace(/&/g, "&amp;");
			vOrgtx = vOrgtx.replace(/</g, "&lt;");
			vOrgtx = vOrgtx.replace(/>/g, "&gt;");
			vOrgtx = vOrgtx.replace(/'/g, "&apos;");
			vOrgtx = vOrgtx.replace(/"/g, "&quot;");
		
		tHtml = tHtml.replace("[ITEM_DATA3]", vOrgtx); // 소속부서
		
		var item_data = "";
		var tmp_item_html ="";
		
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		
		item_data = "";
		tmp_item_html ="";
		item_replace = "";
		for(var i=0 ; i< vTableData.length ; i++ ) {
			
			var vTmrsn = vTableData[i].Tmrsn;
				vTmrsn = vTmrsn.replace(/&/g, "&amp;");
				vTmrsn = vTmrsn.replace(/</g, "&lt;");
				vTmrsn = vTmrsn.replace(/>/g, "&gt;");
				vTmrsn = vTmrsn.replace(/'/g, "&apos;");
				vTmrsn = vTmrsn.replace(/"/g, "&quot;");
			
			tmp_item_html = table_html;
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM1]", vTableData[i].Idx);
//			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM2]", vTableData[i].Orgtx);
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM3]", vTableData[i].Zzjiktltx);
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM4]", vTableData[i].Ename);
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM5]", vTableData[i].Rtext);	// 교대조
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM6]", vTableData[i].Ttext);	// 근무형태
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM7]", vTableData[i].Atext);	// 근무유형
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM18]", vTmrsn);	// 근무사유
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM8]", vTableData[i].Beguz.substring(0,2) + ":" + vTableData[i].Beguz.substring(2,4));
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM9]", vTableData[i].Enduz.substring(0,2) + ":" + vTableData[i].Enduz.substring(2,4));
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM10]", vTableData[i].Abrst ? vTableData[i].Abrst : "");	// 근무시간
//			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM11]", vTableData[i].Ottm1 ? vTableData[i].Ottm1 : "");	// 당일시간
//			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM12]", vTableData[i].Ottm2 ? vTableData[i].Ottm2 : "");	// 금주누계
//			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM13]", vTableData[i].Ottm3 ? vTableData[i].Ottm3 : "");	// 당월누계
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM11]", vTableData[i].Tim01 ? vTableData[i].Tim01 : "");	// 실적
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM12]", vTableData[i].Tim02 ? vTableData[i].Tim02 : "");	// 신청준
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM13]", vTableData[i].Tim03 ? vTableData[i].Tim03 : "");	// 가능시간
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM14]", vTableData[i].Tim04 ? vTableData[i].Tim04 : "");	// 비근무시간
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM16]", vTableData[i].Tim05 ? vTableData[i].Tim05 : "");	// 비근무시간 실적
//			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM14]", vTableData[i].Ottm4.substring(0,vTableData[i].Ottm4.length-1));	// 전주실적
//			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM15]", vTableData[i].Ottm5.substring(0,vTableData[i].Ottm5.length-1));	// 전월실적
//			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM16]", vTableData[i].Agryn == true ? "X" : "");	// 동의여부
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM15]", vTableData[i].Ofpnm ? vTableData[i].Ofpnm : ""); //대근휴가자
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM17]", vTableData[i].Calyn == true ? "O" : "");	// 호출여부
			item_data += tmp_item_html;
		}
	
		item_replace = tHtml.substring(tHtml.indexOf(table_start), tHtml.indexOf(table_end) + table_end.length);
		tHtml = tHtml.replace(item_replace, item_data);
		return tHtml;
		
	},
	

});