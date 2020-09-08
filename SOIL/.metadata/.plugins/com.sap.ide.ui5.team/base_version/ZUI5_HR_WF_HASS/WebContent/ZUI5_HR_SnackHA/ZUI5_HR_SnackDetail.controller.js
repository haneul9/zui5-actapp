//jQuery.sap.require("control.BusyIndicator");
//jQuery.sap.require("control.ZNKBusyAccessor");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ZNK_ApprovalLine");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_SnackHA.ZUI5_HR_SnackDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_SnackHA.ZUI5_HR_SnackDetail
	 */

	PAGEID : "ZUI5_HR_SnackDetail",
	
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(), 
	_vPersa : "" ,
	
	_vAppno : "",
	
	_vFromPage : "",
	
	_vEnamefg : "",
	
	_vUploadFiles : null,	// 첨부파일
	_vZworktyp : "",

	_vAppty : "MANAGE",

	///// 결재자 지정 /////
	_vReqForm : "HR06", // 신청서 유형
	_vReqPernr : "",	// 신청자 사번
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(), // 발신라인 테이블 JSON모델
	_RetvLineModel : new sap.ui.model.json.JSONModel(), 	// RetvApprLineSet에서 불러온 값을 저장함
	//////////////////
	
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
		bus.subscribe("app", "OpenWindow", this.SmartSizing, this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing, this);
	},

	onBeforeShow : function(oEvent) {
		var oController = this;
		
		var vAppno ="" , vZappStatAl = "", vRegno = "";
		oController._vAppno = "";
		oController._vReqPernr = "";
		oController._vUploadFiles = [];
		
		var vFromPageId = "";
		if(oEvent) {
			oController._vAppno = vAppno = oEvent.data.Appno;
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		var oPortalTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		
		// 초기화
		oController._DetailJSonModel.setData(null);

		// 소속부서
		oController.setOrgeh(oController); 
		
		oController.BusyDialog.open();
		var oModel = sap.ui.getCore().getModel("ZHR_SNACK_SRV");
		var oDetailTableDatas = {Data : []};
		var oDetailData = {Data : {}};
		var vErrorMessage = "", vError = "";
		
		var oPath = "/SnackExpensesApplSet?$filter=Appno eq '" + vAppno + "' and Prcty eq 'D'";
		oModel.read(oPath, null, null, false,
				function(data, res){
					if(data && data.results.length){

						// 상태
						vZappStatAl = data.results[0].ZappStatAl;
						
						data.results[0].Betrg = common.Common.numberWithCommas(data.results[0].Betrg);
						
						data.results[0].Partip = parseInt(data.results[0].Partip) + "";
						
						data.results[0].Begda = dateFormat.format(data.results[0].Begda);
						data.results[0].Endda = dateFormat.format(data.results[0].Endda);
						
						oController._vReqPernr = data.results[0].Appernr;
						
						oDetailData.Data = data.results[0];	
						
					}
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
		
		oController._DetailJSonModel.setData(oDetailData);
			

		// 결재 상태에 따라 Page Header Text 수정		
		if(vZappStatAl == "20"){
			oPortalTitle.setText("지화간식 신청");
			
			// 예산정보 호출
			oController.onSetBudget(oController);
			
		} else {
			oPortalTitle.setText("지화간식 신청 조회");
		}		

		// 결재선 
		oController.setApprovalLineModel(oController);
		oController.onSetAppl(null);		
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent){
//		var oContent = sap.ui.getCore().byId("ZNK_PORTAL" + "_notUnifiedSpllit");
//		oContent.toDetail("ZUI5_HR_SnackHA.ZUI5_HR_SnackList");
		var oView = sap.ui.getCore().byId("ZUI5_HR_SnackHA.ZUI5_HR_SnackDetail");
		var oController = oView.getController();
		
		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_SnackHA.ZUI5_HR_SnackList",
			      data : { }
				}
			);	
		}
		
	},
	
	onChangeDate : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_SnackHA.ZUI5_HR_SnackDetail");
		var oController = oView.getController();
		
		if(oEvent && oEvent.getParameters().valid == false){
			sap.m.MessageBox.alert("올바르지 않은 날짜형식입니다.", {title : "오류"});
			oEvent.getSource().setValue();
			return;
		}
		
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_SnackHA.ZUI5_HR_SnackDetail");
		var oController = oView.getController();
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
	
	// 예산정보
	onSetBudget : function(oController){		
		var vErrorMessage = "";
		var oModel = sap.ui.getCore().getModel("ZHR_SNACK_SRV");
		
		var vOrgeh = oController._DetailJSonModel.getProperty("/Data/Orgeh");
		
		var oPath = "/SnackBudgetCheckSet?$filter=Orgeh eq '" + vOrgeh + "'";
		
		var vBetrg = oController._DetailJSonModel.getProperty("/Data/Betrg");
		
		oModel.read(oPath, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						oController._DetailJSonModel.setProperty("/Data/Budget", data.results[0].Budget);
						oController._DetailJSonModel.setProperty("/Data/Baltr", data.results[0].Baltr);
					}
				}, function(Res){
					if(Res.response.body){
						vErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(vErrorMessage);
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						}
					}					
				}				
		);
		
		if(vErrorMessage != ""){
			sap.m.MessageBox.alert(vErrorMessage, {title : "오류"});
			return;
		}
		
		// 신청 후 잔액 재계산
		var vBetrg = oController._DetailJSonModel.getProperty("/Data/Betrg").replace(/,/g, "");	// 총 금액
		var vBaltr = oController._DetailJSonModel.getProperty("/Data/Baltr");	// 현재잔액
		var vReqtr = parseInt(vBaltr) - parseInt(vBetrg);	// 신청 후 잔액
		
		oController._DetailJSonModel.setProperty("/Data/Reqtr", (vReqtr + ""));
	},
	
	// 결재자 정보
	setApprovalLineModel : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_SnackHA.ZUI5_HR_SnackDetail");
		
		var vData = {Data : []};
		
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		var oPath = "/ApprovalLineApplSet?$filter=ZreqForm eq 'RF06' and ZreqPernr1 eq '" + oController._vReqPernr + "'";
		
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_SnackHA.ZUI5_HR_SnackDetail");
		var oController = oView.getController();
		
		var oPrvline = oController._DetailJSonModel.getProperty("/Data/Prvline");
		var vPrvline = "";
				
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
		
		// 개인결재선 적용 선택여부에 따라 다른 odata를 호출한다.
		if(vPrvline == "X") oController.onSetPrvline(oController, vPrvline);
		else if(vPrvline == "") oController.onSetPrvlineX(oController, vPrvline);
		
	},
	
	// 소속부서변경, 개인결재선 적용 체크한 경우 
	onSetPrvline : function(oController, vPrvline){

		var vPernr = oController._DetailJSonModel.getProperty("/Data/Appernr");
		if(!vPernr) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		var oPath = "/ReferenceLineSet?$filter=Pernr eq '" + vPernr + "' and Prvline eq '" + vPrvline + "' and ZreqForm eq 'RF06'";
		
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
	
	// 소속부서 변경, 개인결재선 지정 안한 경우
	onSetPrvlineX : function(oController, vPrvline){

		var vOrgeh = oController._DetailJSonModel.getProperty("/Data/Orgeh");
		if(!vOrgeh) return;

		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		var oPath = "/ReferenceLineSet?$filter=Orgeh eq '" + vOrgeh + "' and Prvline eq '" + vPrvline + "' and ZreqForm eq 'RF06'";
		
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


	// 총금액 변경 시 신청 후 잔액을 설정한다.
	onChangeBetrg : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_SnackHA.ZUI5_HR_SnackDetail");
		var oController = oView.getController();
		
		var vBetrg = oEvent.getSource().getValue().replace(/,/g, "");			// 총금액
		var vBaltr = oController._DetailJSonModel.getProperty("/Data/Baltr");	// 현재잔액
		
		var vReqtr = parseInt(vBaltr) - parseInt(vBetrg);
		
		oController._DetailJSonModel.setProperty("/Data/Reqtr", (vReqtr + ""));
	},

	// 승인
	onPressSaveP : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_SnackHA.ZUI5_HR_SnackDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "P");
	},
	
	// 반려
	onPressSaveR : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_SnackHA.ZUI5_HR_SnackDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "R");
	},
	
	// 기안
	onPressSaveS : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_SnackHA.ZUI5_HR_SnackDetail");
		var oController = oView.getController();

		oController.onSave(oController , "S");
	},
	
	// 재상신
	onPressSaveX : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_SnackHA.ZUI5_HR_SnackDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "X");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty){
		var vErrorMessage = "", vUri = "";
		
		if(oController.onValidationData(oController, vPrcty) == false) return;
		
		var onProcess = function(){
			var oModel = sap.ui.getCore().getModel("ZHR_SNACK_SRV");

			var oneData = oController._DetailJSonModel.getProperty("/Data");
			var createData = {};
			
			if(oController._vAppno) createData.Appno = oController._vAppno;
//			createData.Pernr = oneData.Pernr;
//			createData.Ename = oneData.Ename;
//			createData.Btrtl = oneData.Btrtl;
			
			if(vPrcty == "S"){
				createData.Zhtml = oController.makeHtml(oController);
				
				if(createData.Zhtml == "") return;
			}
			
			if(vPrcty == "R") createData.ZappResn = oneData.ZappResn;

			createData.Orgeh = oneData.Orgeh;		// 소속부서
			createData.Orgtx = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh").getSelectedItem().getText();
			createData.Btrtl = oneData.Btrtl;		// 사업장
			
			// 예산, 현재잔액, 신청후잔액은 승인일 경우에만 추가함
			if(vPrcty == "P" || vPrcty == "S"){
				createData.Budget = oneData.Budget;											// 예산
				createData.Baltr = oneData.Baltr;											// 현재 잔액
				createData.Reqtr = oneData.Reqtr;											// 신청 후 잔액
			}
			
			createData.Partip = oneData.Partip.replace(/,/g, "");							// 투입인원
			createData.Betrg = oneData.Betrg.replace(/,/g, "");								// 총 금액
			createData.Begda = "\/Date("+ common.Common.getTime(oneData.Begda)+")\/";		// 기간
			createData.Endda = "\/Date("+ common.Common.getTime(oneData.Endda)+")\/";	
			createData.Worsn = oneData.Worsn;												// 사유
			createData.Calrsn = oneData.Calrsn;												// 계산근거
			
			createData.Prcty = vPrcty;
			
			var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
			var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
			
			createData.Appernr = vEmpLoginInfo[0].Pernr;	// 신청자 사번
			createData.Pernr = vEmpLoginInfo[0].Pernr;
			
			createData.Waers = "KRW";
			
			oModel.create("/SnackExpensesApplSet", createData, null,
					function(data,res){
						if(data) {
							oController._vAppno = data.Appno;
							vUri = data.Zurl;
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
				sap.m.MessageBox.alert(vErrorMessage, {title : "오류"});
				return;
			}

			if(vPrcty == "S"){
				sap.m.MessageBox.show(vCompTxt, {
					title : "안내",
//					onClose : function(){
//						if(vUri != "") window.open(vUri);
//						oController.onBack() ;
//					}
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
							oController.onBack();
						}
					}
				});
			}else{
				sap.m.MessageBox.show(vCompTxt, {
					title : "안내",
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
		
		if(vPrcty == "P"){
			vInfoTxt = "승인 하시겠습니까?";
			vCompTxt = "승인이 완료되었습니다." ;
		}else if(vPrcty == "S"){
			vInfoTxt = "기안 하시겠습니까?";
			vCompTxt = "기안이 완료되었습니다.";
		}else if(vPrcty == "R"){
			vInfoTxt = "반려 하시겠습니까?";
			vCompTxt = "반려가 완료되었습니다.";
		}else if(vPrcty == "X"){
			vInfoTxt = "재상신 하시겠습니까?";
			vCompTxt = "현재 문서를 작성중 상태로 변경하였습니다. \n수정 후 재신청하시기 바랍니다.";
		}
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : "안내",
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},
	
	onValidationData : function(oController, vPrcty){		
		var vData = oController._DetailJSonModel.getProperty("/Data");

		var oneData = oController._DetailJSonModel.getProperty("/Data");	
		
		if(!oneData.Pernr){
			sap.m.MessageBox.alert("대상자를 선택하여 주십시오.", {title : "오류"});
			return false;
		} else if(!oneData.Partip){
			sap.m.MessageBox.alert("투입인원을 입력하여 주십시오.", {title : "오류"});
			return false;
		} else if(!oneData.Betrg){
			sap.m.MessageBox.alert("총 금액을 입력하여 주십시오.", {title : "오류"});
			return false;
		} else if(!oneData.Begda || !oneData.Endda){
			sap.m.MessageBox.alert("기간을 입력하여 주십시오.", {title : "오류"});
			return false;
		} else if(!oneData.Worsn || oneData.Worsn.trim() == ""){
			sap.m.MessageBox.alert("사유를 입력하여 주십시오.", {title : "오류"});
			return false;
		} else if(!oneData.Calrsn || oneData.Calrsn.trim() == ""){
			sap.m.MessageBox.alert("계산근거를 입력하여 주십시오.", {title : "오류"});
			return false;
		}	
		
		if(vPrcty == "R" && (!oneData.ZappResn || oneData.ZappResn.trim() == "")){
			sap.m.MessageBox.alert("반려시 반려사유는 필수입니다.", {title : "오류"});
			return false;
		}
		
	},

	makeHtml : function(oController){
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy/MM/dd"});
		var table_start = "[TABLE_START]";
		var table_end = "[TABLE_END]";	
		var html_url ;
		html_url = "/sap/bc/ui5_ui5/sap/ZUI5_HR_WF_HASS/ZUI5_HR_SnackHA/html/Snack.html";		
		
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
			sap.m.MessageBox.alert("결재 HTML 가져오기에 실패하였습니다.", {title : "오류"});
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
				
		tHtml = tHtml.replace("[ITEM_DATA1]", vDetailData.Budget ? common.Common.numberWithCommas(vDetailData.Budget) : "");    // 예산
		tHtml = tHtml.replace("[ITEM_DATA2]", vDetailData.Baltr ? common.Common.numberWithCommas(vDetailData.Baltr) : "");  	// 현재잔액
		tHtml = tHtml.replace("[ITEM_DATA3]", vDetailData.Reqtr ? common.Common.numberWithCommas(vDetailData.Reqtr) : "");  	// 신청 후 잔액
		tHtml = tHtml.replace("[ITEM_DATA4]", vDetailData.Partip);  	// 투입인원
		tHtml = tHtml.replace("[ITEM_DATA5]", vDetailData.Betrg ? common.Common.numberWithCommas(vDetailData.Betrg) : "");  	// 총금액
		tHtml = tHtml.replace("[ITEM_DATA6]", dateFormat.format(new Date(vDetailData.Begda)) + " ~ " + dateFormat.format(new Date(vDetailData.Endda)));  	// 기간
		tHtml = tHtml.replace("[ITEM_DATA7]", checkText(vDetailData.Worsn));  	// 사유
		tHtml = tHtml.replace("[ITEM_DATA8]", checkText(vDetailData.Calrsn));  // 계산근거
		
		return tHtml;
		
	},
	
});