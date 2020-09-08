//jQuery.sap.require("control.BusyIndicator");
//jQuery.sap.require("control.ZNKBusyAccessor");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.MandateAction");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_TaxAdjustment.ZUI5_HR_TaxAdjustmentDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_TaxAdjustment.ZUI5_HR_TaxAdjustmentDetail
	 */

	PAGEID : "ZUI5_HR_TaxAdjustmentDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vAppno : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "HR22",
	
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
		oController._vAppno = "";
		
		var vFromPageId = "";
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno;
			
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		var vZappStatAl = "";
		var oDetailData = {Data : {}};
		
		if(oController._vAppno != ""){ // 수정 및 조회
			var oModel = sap.ui.getCore().getModel("ZHR_PAYSLIP_SRV");
			var vErrorMessage = "", vError = "";
			
			var oPath = "/ControlIptctSet/?$filter=Prcty eq 'D' and Appno eq '" + oController._vAppno + "'";
			
			oModel.read(oPath, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						var OneData = data.results[0];
						OneData.Regno = oController.onSetRegno(OneData.Regno);
						OneData.Apstm = OneData.Apstm * 1;
						vZappStatAl = OneData.ZappStatAl ;
						oDetailData.Data = OneData;
					}
				}, function(Res){
					if(Res.response.body){
						var ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						vError = "E"; 
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						}else{
							vErrorMessage =ErrorMessage ;
						}
					}
				}
			);
			
			if(vError == "E"){
				sap.m.MessageBox.alert(vErrorMessage, {
					onClose : function() {
						oController.onBack();
					}
				});
				return ;
			}
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
		// 결재내역 
		// 공통적용사항 End
	
		// 결재 상태에 따라 Page Header Text 수정	
		var oPortalTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		if(oController._vAppno == "") {
			oPortalTitle.setText(oBundleText.getText("LABEL_1319") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1319:원천징수 세액조정 신청
		} else {
			oPortalTitle.setText(oBundleText.getText("LABEL_1319") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1319:원천징수 세액조정 신청
		}
		
		if(oController._vAppno == "" && _gAuth == "E"){
			// 현재 데이터 조회
			oController.onSearchCurData(oController);
		}else if(oController._vAppno != ""){
			// 조정하고자 하는 시기 설정 - 이미 승인난 건이라 변경 못하므로 1~12월로 부여
			var oApstm = sap.ui.getCore().byId(oController.PAGEID + "_Apstm");
			oApstm.destroyItems();
			
			for(var i = 1; i <= 12 ; i++){
				oApstm.addItem(new sap.ui.core.Item({ key : i, text : i + oBundleText.getText("LABEL_0134")}));	// 134:월
			}
		}
		
		
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_TaxAdjustment.ZUI5_HR_TaxAdjustmentDetail");
		var oController = oView.getController();
		
		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_TaxAdjustment.ZUI5_HR_TaxAdjustmentList",
			      data : { }
				}
			);	
		}
		
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_TaxAdjustment.ZUI5_HR_TaxAdjustmentDetail");
		var oController = oView.getController();
	},
	
	
	onSearchCurData : function(oController){
		var oModel = sap.ui.getCore().getModel("ZHR_PAYSLIP_SRV");
		var vErrorMessage = "", vError = "";
		var vApsty = "" , vApstm = "", vItpctO = "", vItpctOtx = "", vAddress = "";
		var oPath = "/ControlIptctSet?$filter=Prcty eq 'I' and Encid eq '" + encodeURIComponent(oController._DetailJSonModel.getProperty("/Data/Encid")) + "'";
		oModel.read(oPath, null, null, false,
				function(data, res){
					// 조정하고자 하는 시기 & 신청일 현재 원천징수방식
					if(data && data.results.length > 0){
						vApsty = data.results[0].Apsty;
						vApstm = data.results[0].Apstm;
						vItpctO = data.results[0].ItpctO;
						vItpctOtx = data.results[0].ItpctOtx;
						vAddress = data.results[0].Address; 
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
					oController.onBack();
				}
			});
			return ;
		}
		oController._DetailJSonModel.setProperty("/Data/Apsty", vApsty);   // 적용시작 연도
		oController._DetailJSonModel.setProperty("/Data/Apstm", vApstm);   // 적용시작 월
		oController._DetailJSonModel.setProperty("/Data/ItpctO", vItpctO);   // 조정전 소득세율 
		oController._DetailJSonModel.setProperty("/Data/ItpctOtx", vItpctOtx);   // 조정전 세율(%포함)
		oController._DetailJSonModel.setProperty("/Data/Address", vAddress);   // Address
		
		// 조정하고자 하는 시기 설정
		var oApstm = sap.ui.getCore().byId(oController.PAGEID + "_Apstm");
		oApstm.destroyItems();
		
		var st = vApstm * 1;
		if(st == 0) st = 1; 
		for(var i = st; i <= 12 ; i++){
			oApstm.addItem(new sap.ui.core.Item({ key : i, text : i + oBundleText.getText("LABEL_0134")}));	// 134:월
		}		
	},
	
	// Regno 중간에 - 삽입 
	onSetRegno : function(fRegno){
		if(fRegno.indexOf("-") == -1){
			fRegno = fRegno.substring(0,6) + "-" + fRegno.substring(6,13);
		}
		
		return fRegno;
	},
	// 신청내역 초기화
	onResetDetail : function(oController){
		oController._DetailJSonModel.setProperty("/Data/ItpctOtx", "");   // 신청일 현재 원천징수방식
		oController._DetailJSonModel.setProperty("/Data/ItpctO", "");   // 신청일 현재 원천징수방식
		oController._DetailJSonModel.setProperty("/Data/Itpct", "");   	 // 조정하고자 하는 원천징수방식
		oController._DetailJSonModel.setProperty("/Data/Itpctx", "");   	 // 조정하고자 하는 원천징수방식
		oController._DetailJSonModel.setProperty("/Data/Apsty", "");  // 조정하고자 하는 시기
		oController._DetailJSonModel.setProperty("/Data/Apstm", "");   // 조정하고자 하는 시기
	},	
	
	// 대상자 선택 이후 처리
	onAfterSelectPernr : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_TaxAdjustment.ZUI5_HR_TaxAdjustmentDetail");
		var oController = oView.getController();
		
		
		// 신청내역 초기화
		oController.onResetDetail(oController);
		// 현재 데이터 조회
		oController.onSearchCurData(oController);
		// Regno Format
		oController._TargetJSonModel.setProperty("/Data/Regno",oController.onSetRegno(oController._TargetJSonModel.getProperty("/Data/Regno")));
		
	},
	
	// 신청
	onPressSave : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_TaxAdjustment.ZUI5_HR_TaxAdjustmentDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "C");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty){
		var vErrorMessage = "";
		
		if(oController.onValidationData(oController, vPrcty) == false) return;
		
		var onProcess = function(){

			var oModel = sap.ui.getCore().getModel("ZHR_PAYSLIP_SRV");

			var oneData = oController._DetailJSonModel.getProperty("/Data");
			var createData = {};
			
			if(oController._vAppno) createData.Appno = oController._vAppno;
			createData.Pernr = oneData.Pernr;
			createData.Itpct = oneData.Itpct;	// 소득세율
			createData.Apsty = oneData.Apsty;	// 적용시작 연도
			createData.Apstm = oneData.Apstm;	// 적용시작 월
			createData.Apsty = oneData.Apsty;	// 적용시작 연도
			createData.ItpctOtx = oneData.ItpctOtx;	// 변경전 소득세율
			createData.Prcty = vPrcty;
			createData.Actty = _gAuth;
			
			var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
			var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
			
			createData.Appernr = vEmpLoginInfo[0].Pernr;	// 신청자 사번
			
			oModel.create("/ControlIptctSet", createData, null,
					function(data,res){
						if(data) {
							oController._vAppno = data.Appno;
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
				oController.BusyDialog.close();
				sap.m.MessageBox.alert(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
				return;
			}

			oController.BusyDialog.close();

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
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return false;
		} else if(!oneData.Itpct){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1327"), {title : oBundleText.getText("LABEL_0053")});	// 1327:조정하고자 하는 원천징수방식을 선택하여 주십시오.
			return false;
		} else if(!oneData.Apsty || !oneData.Apstm || oneData.Apstm == "" || !oneData.Apsty ){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1328"), {title : oBundleText.getText("LABEL_0053")});	// 1328:조정하고자 하는 시기를 입력하여 주십시오.
			return false;
		}
	},
	
});