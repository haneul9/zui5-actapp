jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_Certificate.ZUI5_HR_CertificateDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Certificate.ZUI5_HR_CertificateDetail
	 */

	PAGEID : "ZUI5_HR_CertificateDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_AddJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_vEnamefg : "",
	_oControl  : null,
	_vAppno : "",
	_vFromPage : "",
	BusyDialog : new sap.m.BusyDialog(),
	_vZworktyp : "HR12",
	_vCerty : [],
	
	
	
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
	
	
	onPopover : function(oEvent) {
		
	},

	onBeforeShow : function(oEvent) {
		var oController = this;
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno;
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  oController._vFromPage = oEvent.data.FromPage ;
		}
		
		var vZappStatAl = "";
		var oDetailData = {Data : {}}, vZappDate = "", vZappTime = "" ;
		oController._AddJSonModel.setData({Data : []});
		
		if(!oController._DetailJSonModel.getProperty("/Data")){
			// 메뉴얼 버튼 활성 화
			common.Common.setInformationButton(oController, "B");
		}
		
		if(oController._vAppno != ""){  // 수정 및 조회
			oController.clearAddInfo(oController, false);
			
			var oModel = sap.ui.getCore().getModel("ZHR_CERTY_SRV");
			var vErrorMessage = "", vError = "";
			
			var oPath = "/CertipicateApplSet/?$filter=Appno eq '" + oController._vAppno + "' and Prcty eq 'D' and Actty eq '" + _gAuth + "'";	
			oModel.read(oPath, 
				    null, null, false, 
					function(data,res){
						if(data && data.results.length){
							var OneData = data.results[0];
							vZappStatAl = OneData.ZappStatAl ;
							vZappDate = OneData.ZappDate ;
							vZappTime = OneData.ZappTime ;
							oDetailData.Data = OneData;
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
		}else{
			oController.clearAddInfo(oController, true);
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
		common.ApprovalInformation.onSetApprovalInformation(oController);
		// 공통적용사항 End
		if(vZappDate != ""){
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
			var date = new Date(vZappTime.ms);
			var timeinmiliseconds = date.getTime();
			var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern: "KK:mm:ss"});
			var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
			var timeStr = timeFormat.format(new Date(timeinmiliseconds + TZOffsetMs));
			
			var vDate = dateFormat.format(new Date(common.Common.setTime(vZappDate))) +"   "+timeStr ;  
			oController._DetailJSonModel.setProperty("/Data/Appdtm1", vDate);
		}
		
		if(oController._vAppno == "" && _gAuth == "E"){
			oController.getTargetEngInfo(oController);
		}
		
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		// 결재 상태에 따라 Page Header Text 수정
		if( vZappStatAl == "" ){
			oDetailTitle.setText(oBundleText.getText("LABEL_1292"));	// 1292:제증명 신청
		}else if(vZappStatAl == "10"){
			oDetailTitle.setText(oBundleText.getText("LABEL_1292") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1292:제증명 신청
		}else{
			oDetailTitle.setText(oBundleText.getText("LABEL_1292") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1292:제증명 신청
		}
		// 증명서 종류에 따른 필드 구성 
		oController.onChangeCerty();
		oController.BusyDialog.close();
		 	
	},

	onAfterShow : function(oEvent) {
//		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate.ZUI5_HR_CertificateDetail");
			oController = oView.getController();

		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : { }
			});
		}else{
			sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_Certificate.ZUI5_HR_CertificateList",
		      data : { }
			});	
		}
	},
	
	onAfterSelectPernr : function(oController){
		// 대상자 주소 조회
		oController.getTargetEngInfo(oController);
		
		oController.clearAddInfo(oController, true);
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
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate.ZUI5_HR_CertificateDetail");
		var oController = oView.getController();
	},
	
	clearAddInfo : function(oController, visibleyn){
		var oAddInfoPanel = sap.ui.getCore().byId(oController.PAGEID + "_AddInfoPanel");  
		oAddInfoPanel.destroyContent();
		oAddInfoPanel.setVisible(visibleyn);
	},
	
	getTargetEngInfo : function(oController, vPrcty){
		var oModel = sap.ui.getCore().getModel("ZHR_CERTY_SRV");
		var vErrorMessage = "", vError = "";
		
		var vEngnm = "", vPstlz = "", vAddk1 = "", vAdde1 = "";
		
		var oPath = "/CertipicateApplSet/?$filter=Encid eq '" + encodeURIComponent(oController._DetailJSonModel.getProperty("/Data/Encid")) + "' and Prcty eq 'S'";	
		oModel.read(oPath, 
			    null, null, false, 
				function(data,res){
					if(data && data.results.length){
						vEngnm = data.results[0].Engnm;
						vPstlz = data.results[0].Pstlz;
						vAddk1 = data.results[0].Addk1;
						vAdde1 = data.results[0].Adde1;
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
		oController._DetailJSonModel.setProperty("/Data/Engnm",vEngnm);
		oController._DetailJSonModel.setProperty("/Data/Pstlz",vPstlz);
		oController._DetailJSonModel.setProperty("/Data/Addk1",vAddk1);
		oController._DetailJSonModel.setProperty("/Data/Adde1",vAdde1);
		
		if(vError == "E"){
			sap.m.MessageBox.alert(oController.ErrorMessage);
			return ;
		}
	},
	
// 증명서 종류를 선택시 Control Property 변경	
	onChangeCerty : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate.ZUI5_HR_CertificateDetail");
		var oController = oView.getController();
		var oCertyRow1 = sap.ui.getCore().byId(oController.PAGEID + "_CertyRow1"); // 영문이름
		var oCertyRow2 = sap.ui.getCore().byId(oController.PAGEID + "_CertyRow2"); // 주소
		var oCertyRow3 = sap.ui.getCore().byId(oController.PAGEID + "_CertyRow3"); // 영문주소
		var oCertyRow4 = sap.ui.getCore().byId(oController.PAGEID + "_CertyRow4"); // 발행연도
		
		var vCerty = oController._DetailJSonModel.getProperty("/Data/Certy");
		// 경력 / 재직 증명서 영문 
		if(vCerty == "A2" || vCerty == "B2"){
			oCertyRow1.removeStyleClass("DisplayNone");
			oCertyRow3.removeStyleClass("DisplayNone");
		} else {
			oCertyRow1.addStyleClass("DisplayNone");
			oCertyRow3.addStyleClass("DisplayNone");
		}
		
		// 재직 증명서
		if(vCerty == "A1" || vCerty == "B1"){
			oCertyRow2.removeStyleClass("DisplayNone");
		} else {
			oCertyRow2.addStyleClass("DisplayNone");
		}
		
		// 원천징수 선택시 발행년도 Display
		if(vCerty == "C1" || vCerty == "D1" || vCerty == "D2"){
			oCertyRow4.removeStyleClass("DisplayNone");
		} else {
			oCertyRow4.addStyleClass("DisplayNone");
			// 발행년도 Data 초기화
			oController._DetailJSonModel.setProperty("/Data/Iyear", ""); 
			oController._DetailJSonModel.setProperty("/Data/IyearTo", ""); 
		}
	},
	
	onPressDelete : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate.ZUI5_HR_CertificateDetail");
		var oController = oView.getController();
		
		var onProcess = function(fVal){
			var vDetailData = oController._DetailJSonModel.getProperty("/Data");
			var vErrorMessage = "";
			var oModel = sap.ui.getCore().getModel("ZHR_CERTY_SRV");
			var oPath = "/CertipicateApplSet(Appno='" + vDetailData.Appno + "')";
			oModel.remove(
					oPath,
					null,
					function(data,res){
				
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
			
			sap.m.MessageBox.show(oBundleText.getText("LABEL_0034"), {	// 34:삭제가 완료되었습니다.
				title : oBundleText.getText("LABEL_0052"),	// 52:안내
				onClose : oController.onBack
			});
		};
		
		var deleteProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// 35:삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : deleteProcess
		});
		
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate.ZUI5_HR_CertificateDetail");
		var oController = oView.getController();
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate.ZUI5_HR_CertificateDetail");
		var oController = oView.getController();
		oController.onSave(oController , "C");
	},
	
	onPressPrint : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate.ZUI5_HR_CertificateDetail");
		var oController = oView.getController();
		var vCerty = oController._DetailJSonModel.getProperty("/Data/Certy");
		if(vCerty && vCerty == "B3" || vCerty == "B4"){ 
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1302"),{	// 1302:해당 증명서는 담당자에게 방문하여 출력바랍니다.
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title : oBundleText.getText("LABEL_0052")	// 52:안내
			});
		}else{
			oController.onSave(oController , "Z");
		}
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty){ // 처리 구분
		var vZappStatAl	= "";
		var vOData = oController.onValidationData(oController, vPrcty);
		if( vOData == "") return ;
		
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var vErrorMessage = "";
				
				var oModel = sap.ui.getCore().getModel("ZHR_CERTY_SRV");
				var oPath = "/CertipicateApplSet";
				oModel.create(
						oPath,
						vOData,
						null,
						function(data,res){
							if(data) {
								oController._DetailJSonModel.setProperty("/Data/Appno", data.Appno); 
								oController._DetailJSonModel.setProperty("/Data/ZappStatAl", data.ZappStatAl); 
								vZappStatAl = data.ZappStatAl;
								if((vPrcty == "Z" || vPrcty == "Y") && data.Zurl != "") window.open(data.Zurl); 
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
		}else if(vPrcty == "Z" || vPrcty == "Y"){
			vInfoTxt = oBundleText.getText("LABEL_0104");	// 104:출력하시겠습니까 ? \n 현재 프린트 설정이 컬러로 되어 있는지 확인하셨습니까 ?
			vCompTxt = oBundleText.getText("LABEL_0101") ;	// 101:인쇄가 완료되었습니다.
		}else{
			vInfoTxt = oBundleText.getText("LABEL_0051");	// 51:신청하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0048");	// 48:신청이 완료되었습니다.
			if(vOData.Certy == "A2" || vOData.Certy == "B2"){
				vInfoTxt = oBundleText.getText("LABEL_1303");	// 1303:제증명 신청을 진행하시겠습니까?\n 영문주소 및 설명이 올바르게 입력되어 있는지 확인하셨습니까?
			}else if(vOData.Certy == "A1" || vOData.Certy == "B1"){
				vInfoTxt = oBundleText.getText("LABEL_1304");	// 1304:제증명 신청을 진행하시겠습니까 ?\n 현주소 및 용도가 올바르게 입력되어 있습니까 ?
			}
		}
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},
	
	onValidationData : function(oController, vPrcty){
		var rData = {};
		var vData = oController._DetailJSonModel.getProperty("/Data");
		var vMessage = "";
		if(!vData.Pernr || vData.Pernr == ""){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1305"));	// 1305:신청자 사원번호는 필수입력 입니다. 
			return "";
		}
		if(!vData.Certy || vData.Certy == ""){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1306"));	// 1306:증명서종류는 필수입력 입니다.
			return "";
		}
		if(!vData.Sendp || vData.Sendp == ""){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1307"));	// 1307:제출처는 필수입력 입니다.
			return "";
		}
		if(!vData.Reqnt || vData.Reqnt == ""){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1308"));	// 1308:신청부수는 필수입력 입니다.
			return "";
		}
//		if(!vData.Aprsn || vData.Aprsn == ""){
//			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1309"));	// 1309:신청사유는 필수입력 입니다.
//			return "";
//		}
		if(!vData.Usety || vData.Usety == ""){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1310"));	// 1310:용도구분은 필수입력 입니다.
			return "";
		}
		if(vData.Certy  == "C1"){
			if( vData.Iyear == "" || vData.Iyear == "0000"){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1311"));	// 1311:발행년도 입력은 필수 입니다.
				return "";
			}
			
			var curDate = new Date();
			var curYear = curDate.getFullYear();
			
			if(curYear * 1 - vData.Iyear * 1 > 3){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1312"));	// 1312:최근 3년 안의 원천징수만 신청할 수 있습니다. \n 이전년도는 담당자에게 문의하세요.
				return "";
			}
			
			if(!common.Common.checkNull(vData.IyearTo)){
				if(vData.Iyear * 1 > vData.IyearTo * 1 ){
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1313"));	// 1313:이전 년도가 이후년도보다 클 수는 없습니다.
					return "";
				}
			}
		}else if(vData.Certy  == "D1" || vData.Certy  == "D2"){
			if(common.Common.checkNull(vData.Iyear)){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1311"));	// 1311:발행년도 입력은 필수 입니다.
				return "";
			}
		}
		
		if((vData.Certy  == "A2" || vData.Certy  == "B2" ) && (!vData.Engnm || vData.Engnm == "")){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1314"));	// 1314:영문성명는 필수입력 입니다.
			return "";
		}
		if((vData.Certy  == "A2" || vData.Certy  == "B2" ) && (!vData.Pstlz || vData.Pstlz == "" || !vData.Adde1 || vData.Adde1 == "" )){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1315"));	// 1315:영문주소는 필수입력 입니다.
			return "";
		}
		if((vData.Certy  == "A1" || vData.Certy  == "B1" ) && (!vData.Addk1 || vData.Addk1 == "" )){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1316"));	// 1316:주소는 필수입력 입니다.
			return "";
		}
		
		rData = common.Common.copyByMetadata(sap.ui.getCore().getModel("ZHR_CERTY_SRV"), "CertipicateAppl", vData);
		
		rData.Prcty = vPrcty;
		var addData = [];
		var vTemp = {};
		Object.assign(vTemp, rData);
		addData.push(vTemp);
		
		var vData = oController._AddJSonModel.getProperty("/Data");
		if(!common.Common.checkNull(vData)){
			var oneData = {};
			for(var i = 0; i< vData.length; i++ ){
				if(vData[i].Visibleyn == true){
					oneData = vData[i];
					
					if(!oneData.Certy || oneData.Certy == ""){
						new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1306"));	// 1306:증명서종류는 필수입력 입니다.
						return "";
					}
					
					if(!oneData.Reqnt || oneData.Reqnt == ""){
						new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1308"));	// 1308:신청부수는 필수입력 입니다.
						return "";
					}
					
					if(oneData.Certy  == "C1"){
						if( oneData.Iyear == "" || oneData.Iyear == "0000"){
							new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1311"));	// 1311:원천징수 증명서 일경우 발행년도 입력은 필수 입니다.
							return "";
						}
						
						var curDate = new Date();
						var curYear = curDate.getFullYear();
						
						if(curYear * 1 - oneData.Iyear * 1 > 3){
							new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1312"));	// 1312:최근 3년 안의 원천징수만 신청할 수 있습니다. \n 이전년도는 담당자에게 문의하세요.
							return "";
						}
						
						if(!common.Common.checkNull(oneData.IyearTo)){
							if(oneData.Iyear * 1 > oneData.IyearTo * 1 ){
								new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1313"));	// 1313:이전 년도가 이후년도보다 클 수는 없습니다.
								return "";
							}
						}
					}else if(oneData.Certy  == "D1" || oneData.Certy  == "D2"){
						if(common.Common.checkNull(oneData.Iyear)){
							new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1311"));	// 1311:발행년도 입력은 필수 입니다.
							return "";
						}
					}
					
					if((oneData.Certy  == "A2" || oneData.Certy  == "B2" ) && (!oneData.Engnm || oneData.Engnm == "")){
						new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1314"));	// 1314:영문성명는 필수입력 입니다.
						return "";
					}
					if((oneData.Certy  == "A2" || oneData.Certy  == "B2" ) && (!oneData.Pstlz || oneData.Pstlz == "" || !oneData.Adde1 || oneData.Adde1 == "" )){
						new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1315"));	// 1315:영문주소는 필수입력 입니다.
						return "";
					}
					if((oneData.Certy  == "A1" || oneData.Certy  == "B1" ) && (!oneData.Pstlz || oneData.Pstlz == "" || !oneData.Addk1 || oneData.Addk1 == "" )){
						new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1316"));	// 1316:주소는 필수입력 입니다.
						return "";
					}
					
					oneData.Pernr = rData.Pernr;
					oneData.Usety = rData.Usety;
					oneData.Sendp = rData.Sendp;
					oneData.Aprsn = rData.Aprsn;
					oneData.Bigo = rData.Bigo;
					
					tData = common.Common.copyByMetadata(sap.ui.getCore().getModel("ZHR_CERTY_SRV"), "CertipicateAppl", oneData);
					
					addData.push(tData);
					
				}
			}
		}
		rData.CertipicateApplDeepSet = addData;
		return rData;		
	},
	
	onChangeAddCerty : function(oController, vIdx){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate.ZUI5_HR_CertificateDetail");
		var oController = oView.getController();
		var oCertyRow1 = sap.ui.getCore().byId(oController.PAGEID + "_CertyAddRow1_" + vIdx); // 영문이름
		var oCertyRow2 = sap.ui.getCore().byId(oController.PAGEID + "_CertyAddRow2_" + vIdx); // 주소
		var oCertyRow3 = sap.ui.getCore().byId(oController.PAGEID + "_CertyAddRow3_"+ vIdx); // 영문주소
		var oCertyRow4 = sap.ui.getCore().byId(oController.PAGEID + "_CertyAddRow4_"+ vIdx); // 발행연도
		
		var vCerty = oController._AddJSonModel.getProperty("/Data/" + vIdx + "/Certy");
		
		// 경력 / 재직 증명서 영문 
		if(vCerty == "A2" || vCerty == "B2"){
			oCertyRow1.removeStyleClass("DisplayNone");
			oCertyRow3.removeStyleClass("DisplayNone");
		} else {
			oCertyRow1.addStyleClass("DisplayNone");
			oCertyRow3.addStyleClass("DisplayNone");
		}
		
		// 재직 증명서
		if(vCerty == "A1" || vCerty == "B1"){
			oCertyRow2.removeStyleClass("DisplayNone");
		} else {
			oCertyRow2.addStyleClass("DisplayNone");
		}
		
		// 원천징수 선택시 발행년도 Display
		if(vCerty == "C1" || vCerty == "D1" || vCerty == "D2"){
			oCertyRow4.removeStyleClass("DisplayNone");
		} else {
			oCertyRow4.addStyleClass("DisplayNone");
			// 발행년도 Data 초기화
			oController._AddJSonModel.setProperty("/Data/" + vIdx + "/Iyear","");
			oController._AddJSonModel.setProperty("/Data/" + vIdx + "/IyearTo","");
		}
		
	},
	
	onAddApply : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Certificate.ZUI5_HR_CertificateDetail");
		var oController = oView.getController();
		var oAddInfoPanel = sap.ui.getCore().byId(oController.PAGEID + "_AddInfoPanel");
		var vData = oController._AddJSonModel.getData();
		var vIndex = vData.Data.length;
		var oMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_AddMatrix"+ vIndex,{
			columns : 4,
			visible : "{Visibleyn}",
			widths : ['20%','30%','20%','30%']
		}).setModel(oController._AddJSonModel)
		.bindElement("/Data/"+vIndex)
		.addStyleClass("MarginBottom10px MarginTop20");
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1297"), required : true}).addStyleClass("FontFamilyBold"),	// 1297:증명서종류
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		var oCerty = new sap.m.Select({
			width : "100%" ,
			selectedKey : "{Certy}",
			change : function(evt){
				console.log(evt);
				oController.onChangeAddCerty(oController, vIndex);	
			}	
		});
		
		oCerty.addItem(new sap.ui.core.Item({key : "", text : ""}));
		for(var i =0; i< oController._vCerty.length; i++){
			oCerty.addItem(new sap.ui.core.Item({key : oController._vCerty[i].Certy, text : oController._vCerty[i].Certyt}));
		}
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oCerty
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1286") , required : true}).addStyleClass("FontFamilyBold"),	// 1286:신청부수
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		content : new sap.m.Toolbar({
			design : sap.m.ToolbarDesign.Auto,
			height : "30px",
			content : [new sap.m.Input({
							width : "100px",
							value : "{Reqnt}",
							type : "Number",
							liveChange : function(evt){
								var fVal = evt.getSource().getValue() ;
								if(fVal && fVal.length > 2) this.setValue(fVal.substring(0,2));
							},
						}).addStyleClass("FontFamily"),
				       new sap.m.ToolbarSpacer({}),
				       new sap.m.Button({
							text : oBundleText.getText("DELETION"),
							type : "Ghost",
							press : function(){
								oController._AddJSonModel.setProperty("/Data/" + vIndex +"/Visibleyn", false); 
							}
					   }).setModel(oController._AddJSonModel)
						.bindElement("/Data/"+vIndex),
					   ]
			})
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_CertyAddRow1_" + vIndex,{height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1288"), required : true}).addStyleClass("FontFamilyBold"),	// 1288:영문성명
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				value : "{Engnm}",
				editable : false ,
				width :"100%"
			   }).addStyleClass("FontFamily") ,
			colSpan : 3
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		var oAddress1 = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			widths : ['170px',]
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "150px",
				value : "{Pstlz}" ,
				editable : false
			}).addStyleClass("FontFamily")
		}); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
						width : "100%",
						editable : false ,
						value : "{Addk1}"
				   }).addStyleClass("FontFamily"),
		});
		oRow.addCell(oCell);
		oAddress1.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_CertyAddRow2_" + vIndex,{height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0336") , required : true}).addStyleClass("FontFamilyBold"),	// 336:주소
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oAddress1,
			colSpan : 3,
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		var oAddress2 = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			widths : ['170px',]
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
				width : "150px",
				value : "{Pstlz}" ,
				editable : false
			}).addStyleClass("FontFamily")
		}); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
						width : "100%",
						editable : false ,
						value : "{Adde1}"
				   }).addStyleClass("FontFamily"),
		});
		oRow.addCell(oCell);
		oAddress2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_CertyAddRow3_" + vIndex,{height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1287") , required : true}).addStyleClass("FontFamilyBold"),	// 1287:영문 주소
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oAddress2,
			colSpan : 3,
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		var oCertyRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_CertyAddRow4_" + vIndex,{
			height : "30px", 
		});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1284") , required : true}).addStyleClass("FontFamilyBold"),	// 1284:발행년도
		}).addStyleClass("MatrixLabel"); 
		oCertyRow.addCell(oCell);
		
		var oIyearLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		});
		oIyearLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : new sap.m.Input({
						value : "{Iyear}",
						width : "100%",
						type : "Number",
						maxLength : common.Common.getODataPropertyLength("ZHR_CERTY_SRV", "CertipicateAppl", "Iyear")
					}).addStyleClass("FontFamily"),
				})
		);
		oIyearLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : 
						new sap.m.Text({text : "~",
							visible : {
								parts : [{path : "Certy"}, ], 
								formatter : function(fVal1){
									if(fVal1 == "C1") return true;
									else return false;
								}
							},	
						}).addStyleClass("FontFamily PaddingLeft10 PaddingRight10 PaddingTop5"),
				}).addStyleClass("PaddingTop5")
		);
		oIyearLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : new sap.m.Input({
						value : "{IyearTo}",
						width : "100%",
						type : "Number",
						visible : {
							parts : [{path : "Certy"}, ], 
							formatter : function(fVal1){
								if(fVal1 == "C1") return true;
								else {
									oController._ApplyJSonModel.setProperty("/Data/" + vIndex + "/IyearTo", "");
									return false;
								}
							}
						},
						maxLength : common.Common.getODataPropertyLength("ZHR_CERTY_SRV", "CertipicateAppl", "IyearTo")
					}).addStyleClass("FontFamily"),
				
				})
		);
		oIyearLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Text({
									text : "( "+oBundleText.getText("LABEL_1290")+" )"	// 1290:원천징수
							   }).addStyleClass("FontFamilyBold PaddingTop5 PaddingLeft10")]
				})
		);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oIyearLayout ,
			colSpan : 3
		}).addStyleClass("MatrixData");
		oCertyRow.addCell(oCell);
		oMatrix.addRow(oCertyRow);
	
		oController.onChangeAddCerty(oController, vIndex);
		
		var addData = {};
		addData.Engnm = oController._DetailJSonModel.getProperty("/Data/Engnm");
		addData.Pstlz = oController._DetailJSonModel.getProperty("/Data/Pstlz");
		addData.Addk1 = oController._DetailJSonModel.getProperty("/Data/Addk1");
		addData.Adde1 = oController._DetailJSonModel.getProperty("/Data/Adde1");
		addData.Visibleyn = true;
		addData.Certy = "";
		vData.Data.push(addData);
		oController._AddJSonModel.setData(vData);
		oAddInfoPanel.addContent(oMatrix);
	},
});
	