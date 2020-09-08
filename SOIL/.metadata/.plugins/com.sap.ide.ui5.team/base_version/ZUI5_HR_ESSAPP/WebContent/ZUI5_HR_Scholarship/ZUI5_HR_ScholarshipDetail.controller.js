jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail
	 */

	PAGEID : "ZUI5_HR_ScholarshipDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_vZworktyp : 'HR02',
	_vEnamefg : "",
	
	
	_SchoolFamilyList : new sap.ui.model.json.JSONModel(), 
	_DialogActionFlag : null ,
	_vPersa : "" ,
	_vAppno : "",


	_oControl : null ,
	BusyDialog : new sap.m.BusyDialog(),
	_vFromPage : "",
	
	
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
		
		var vZappStatAl = "" , vRegno = "";
		var oDetailTitle = "" ;
		oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		var oModel = sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV");
		var oDetailData = {Data : {}};

		
		// 학력 구분 List Item 조회 및 binding
		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Slart"); 
		if(oSlart.getItems().length < 1){
			oModel.read("/SchoolAbilityListSet", 
				    null, null, false, 
					function(data,res){
						if(data && data.results.length){
							for(var i = 0; i < data.results.length; i++){
								oSlart.addItem(new sap.ui.core.Item ({key :  data.results[i].Slart, text : data.results[i].Sltxt}));
							}
						}
					},
					function(Res){
					}
				);
		}
		
		if(oController._vAppno != ""){  // 수정 및 조회
			oController.BusyDialog.open();
			var vErrorMessage = "", vError = "";
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"});				
			var oPath = "/SchoolExpensesApplSet/?$filter=Appno eq '" + oController._vAppno + "'";	
			oModel.read(oPath, 
				    null, null, false, 
					function(data,res){
						if(data && data.results.length){
							var OneData = data.results[0];							
							OneData.ZbetEntr = common.Common.numberWithCommas(OneData.ZbetEntr);
							OneData.ZbetClas = common.Common.numberWithCommas(OneData.ZbetClas);
							OneData.ZbetOper = common.Common.numberWithCommas(OneData.ZbetOper);
							OneData.ZbetEtc = common.Common.numberWithCommas(OneData.ZbetEtc);
							OneData.ZbetTotl = common.Common.numberWithCommas(OneData.ZbetTotl);
							OneData.ZbetEntr2 = common.Common.numberWithCommas(OneData.ZbetEntr2);
							OneData.ZbetClas2 = common.Common.numberWithCommas(OneData.ZbetClas2);
							OneData.ZbetOper2 = common.Common.numberWithCommas(OneData.ZbetOper2);
							OneData.ZbetEtc2 = common.Common.numberWithCommas(OneData.ZbetEtc2);
							OneData.ZbetTotl2 = common.Common.numberWithCommas(OneData.ZbetTotl2);
							vZappStatAl = OneData.ZappStatAl ;
							
							oDetailData.Data = OneData;
						}
					},
					function(Res){
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
		
		// 첨부파일 
		common.AttachFileAction.oController = oController;
		common.AttachFileAction.setAttachFile(oController);
		common.AttachFileAction.refreshAttachFileList(oController);	
		// 공통적용사항 End
		
		
		// 신청 대상 List 조회 및 binding
		oController.onSetObjps(oController);
		// 학년 조회
		oController.onSetGrdsp(oController);
		// 학기 조회
		oController.onSetDivcd(oController);
		// 학기 조회시 신청금 정액이 있을 경우 필드 비활성화 
		oController.onChangeDivcd();
		
		// 결재 상태에 따라 Page Header Text 수정		
		if( vZappStatAl == "" ){
			// 통화키 Default는 한화 
			oController._DetailJSonModel.setProperty("/Data/Waers", "KRW");
			oDetailTitle.setText(oBundleText.getText("LABEL_1163") + " " + oBundleText.getText("LABEL_0023"));	// 23:등록, 1163:학자금 신청
		}else if(vZappStatAl == "10"){
			oDetailTitle.setText(oBundleText.getText("LABEL_1163") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1163:학자금 신청
		}else{
			oDetailTitle.setText(oBundleText.getText("LABEL_1163") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1163:학자금 신청
		}
		
		var vSlart = oController._DetailJSonModel.getProperty("/Data/Slart");
		
		if(vSlart != "04" && vSlart != "06"){
			oController._DetailJSonModel.setProperty("/Data/Schcd", "9999"); // 학교명
		}
		
		
		
		// 입학금, 수업료, 기성회비, 기타 금액 Editable 설정
		var oDivcd = sap.ui.getCore().byId(oController.PAGEID + "_Divcd");
		var vDivcd = oController._DetailJSonModel.getProperty("/Data/Divcd");
		oDivcd.getItems();
		var vAffil = oController._DetailJSonModel.getProperty("/Data/Affil");
		var vZDivcdST = "X";
		// 특수교육 계열
		if(vAffil == "900"){
			vZDivcdST = "";
		}else{
			var vBetrg = 0; 
			for(var i =0; i < oDivcd.getItems().length; i++){
				if(oDivcd.getItems()[i].getKey() == vDivcd){
					if(oDivcd.getItems()[i].getCustomData()[0].getValue() && oDivcd.getItems()[i].getCustomData()[0].getValue() != "" && oDivcd.getItems()[i].getCustomData()[0].getValue() != 0 ){
						vBetrg = oDivcd.getItems()[i].getCustomData()[0].getValue();	
					}
					break;
				}
			}
			if(vBetrg == 0 && vDivcd != ""){
				vZDivcdST = "";
			}
		}
		
		oController._DetailJSonModel.setProperty("/Data/ZDivcdST",vZDivcdST);
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();

		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		}else{
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipList",
			      data : {
			    	 
			      }
				});	
		}
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
	// 학년 Grade 조회
	onSetGrdsp : function(oController){
		var oGrdsp = sap.ui.getCore().byId(oController.PAGEID + "_Grdsp");
		oGrdsp.destroyItems();
		var oModel = sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV");
		var vSlart = oController._DetailJSonModel.getProperty("/Data/Slart"); 
		var vGrdsp = oController._DetailJSonModel.getProperty("/Data/Grdsp");
		var veqyn = "";
		if(vSlart && vSlart != ""){
			var oPath = "/SchoolGradeListSet?$filter=Slart eq '" + vSlart+ "'" ;
			oModel.read(
					oPath,
					null,
					null,
					false,
					function(data,res){
						if(data && data.results.length){
							for(var i=0;i<data.results.length;i++){
								if(vGrdsp == data.results[i].Grdsp) veqyn = "X" ;
									
								oGrdsp.addItem(new sap.ui.core.Item({key: data.results[i].Grdsp, text: data.results[i].Grdsptx }));
							}
						}
					},
					function(res){console.log(res);}
			);
		}
		
		// 기존입력값과 동일한 값이 존재하지 않을 시 처리
		if(veqyn == "") oController._DetailJSonModel.setProperty("/Data/Grdsp","");
	},
	
	// 학기 조회
	onSetDivcd : function(oController){
		var oDivcd = sap.ui.getCore().byId(oController.PAGEID + "_Divcd");
		oDivcd.destroyItems();
		var vSlart = oController._DetailJSonModel.getProperty("/Data/Slart");
		var vDivcd = oController._DetailJSonModel.getProperty("/Data/Divcd");
		var veqyn = "";
		var oModel = sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV");
		var oPath = "/SchoolTermListSet?$filter=Slart eq '" + vSlart+ "'" ;
		oModel.read(
				oPath,
				null,
				null,
				false,
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							if(vDivcd == data.results[i].Divcd) veqyn = "X" ;
							
							oDivcd.addItem(new sap.ui.core.Item({key: data.results[i].Divcd, text: data.results[i].Divtx,
								                                 customData : new sap.ui.core.CustomData({key : "Betrg", value : data.results[i].Betrg})
							}));
							
						}
					}
				},
				function(res){console.log(res);}
		);
		
		// 기존입력값과 동일한 값이 존재하지 않을 시 처리
		if(veqyn == "") oController._DetailJSonModel.setProperty("/Data/Divcd","");
		
	},
	// 학기 변경
	onChangeDivcd : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
		var oDivcd = sap.ui.getCore().byId(oController.PAGEID + "_Divcd");
		var vDivcd = oController._DetailJSonModel.getProperty("/Data/Divcd");
		oDivcd.getItems();
		var vBetrg = 0; 
		for(var i =0; i < oDivcd.getItems().length; i++){
			if(oDivcd.getItems()[i].getKey() == vDivcd){
				if(oDivcd.getItems()[i].getCustomData()[0].getValue() && oDivcd.getItems()[i].getCustomData()[0].getValue() != "" && oDivcd.getItems()[i].getCustomData()[0].getValue() != 0 ){
					vBetrg = oDivcd.getItems()[i].getCustomData()[0].getValue();	
				}
				break;
			}
		}
		if(oEvent){
			var vAffil = oController._DetailJSonModel.getProperty("/Data/Affil");
			// 특수교육 계열일때는 자동 등록
			if(vAffil == "900"){
				oController._DetailJSonModel.setProperty("/Data/ZDivcdST", "");
			}else{
				// 정액 금액 여부에 따른 입학금 외 입력값 자동 등록 여부 설정
				if(vBetrg == 0 && vDivcd != ""){
					oController._DetailJSonModel.setProperty("/Data/ZDivcdST", "");
				}else{
					oController._DetailJSonModel.setProperty("/Data/ZDivcdST", "X");
					oController._DetailJSonModel.setProperty("/Data/ZbetClas", common.Common.numberWithCommas(vBetrg));
					oController._DetailJSonModel.setProperty("/Data/ZbetEntr", 0);
					oController._DetailJSonModel.setProperty("/Data/ZbetOper", 0);
					oController._DetailJSonModel.setProperty("/Data/ZbetEtc",  0);
					oController._DetailJSonModel.setProperty("/Data/ZbetTotl", common.Common.numberWithCommas(vBetrg));
				}
			}
		}
	},
	
	addZero : function(d) {
		if(d < 10) return "0" + d;
		else return "" + d;
	},
	
	removeZero : function(d) {
		return "" + d * 1;  
	},
	
	// 수혜년도를 변경 시 Event 처리
	onChangeZyear : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
	},
	
	// 가족 구분 조회 및 binding
	onSetObjps : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
		var DetailData = oController._DetailJSonModel.getProperty("/Data");
		var oObjps = sap.ui.getCore().byId(oController.PAGEID + "_Objps");
		oObjps.destroyItems();
	
		var oModel = sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV");
		
		var vSchoolFamilyList = { Data : []} ;
		
		if(DetailData && DetailData.Pernr != undefined && DetailData.Pernr != ""){
			var oPath = "/SchoolExpensesObjListSet?$filter=Encid eq '"+ encodeURIComponent(DetailData.Encid)  + "'";
			oModel.read(
					oPath,
					null,
					null,
					false,
					function(data,res){
						if(data && data.results.length){
							for(var i=0;i<data.results.length;i++){
								oObjps.addItem(new sap.ui.core.Item({key: data.results[i].Regno, text: data.results[i].Famtx}));
								vSchoolFamilyList.Data.push(data.results[i]);
							}
						}
					},
					function(res){console.log(res);}
			);	
		}
		
		oController._SchoolFamilyList.setData(vSchoolFamilyList);
		
	},
	
	// 신청대상 변경 Event
	onChangeObjps : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
		// 학기 조회
		oController.onSetDivcd(oController);
		
	},
	
	// 학력구분 변경 Event
	onChangeSlart : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
		
		oController._DetailJSonModel.setProperty("/Data/Schcd", ""); // 학교
		oController._DetailJSonModel.setProperty("/Data/Schtx", ""); // 학교명
		oController._DetailJSonModel.setProperty("/Data/Majnm","");  // 학과명
		var vSlart = oController._DetailJSonModel.getProperty("/Data/Slart");
		
		if(vSlart != "04" && vSlart != "06"){
			oController._DetailJSonModel.setProperty("/Data/Schcd", "9999"); // 학교명
		}
	
		// 학년 조회
		oController.onSetGrdsp(oController);
		// 학기 조회
		oController.onSetDivcd(oController);
		// 수업료 변경
		oController.onChangeDivcd(oEvent);
		
	},
	
	SchoolInfoChek : function(oController){
		var vErrorMessage = "", vImessage = "";
		var vOData = oController.onValidationData(oController, "", "");
		if( vOData == "") return ;
		// 사번 , 학년 , 학기 입력 여부 확인
		if(!vOData.Pernr || vOData.Pernr == "" || !vOData.Grdsp || vOData.Grdsp == "" ||  !vOData.Divcd || vOData.Divcd == "" ||  !vOData.Slart || vOData.Slart == "" ) return ;
			
		var oModel = sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV");
		
		var oPath = "/SchoolInfoChekSet";
		oModel.create(
				oPath,
				vOData,
				null,
				function(data,res){
					if(data) {
						vImessage = data.Imesg;
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
			new control.ZNK_SapBusy.oErrorMessage(vErrorMessage);
			return ;
		}
		
		oController.BusyDialog.close();
		

		return vImessage;
		
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
		oController.onSave(oController , "T");
	},
	
	onPressSaveC : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
		oController.onSave(oController , "C");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty){ // 처리 구분
		var vZappStatAl	= "" , vErrorMessage = "", vImessage = "", vReqInfomessage = "";
		if(vPrcty == "C"){
			vReqInfomessage = oController.SchoolInfoChek(oController);
		}
		
		var vOData = oController.onValidationData(oController, vPrcty, "X");
		if( vOData == "") return ;
		vOData.Prcty = vPrcty ; 
		
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV");
				var oPath = "/SchoolExpensesApplSet";
				oModel.create(
						oPath,
						vOData,
						null,
						function(data,res){
							if(data) {
								oController._vAppno = data.Appno;
								oController._DetailJSonModel.setProperty("/Data/Appno", data.Appno); 
								oController._DetailJSonModel.setProperty("/Data/ZappStatAl", data.ZappStatAl); 
								vZappStatAl = data.ZappStatAl;
								vImessage = data.Imesg;
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
					new control.ZNK_SapBusy.oErrorMessage(vErrorMessage);
					return ;
				}
				
				common.AttachFileAction.uploadFile(oController);
				
				oController.BusyDialog.close();
				
				if(vImessage != ""){
					vImessage = vCompTxt + "\n" +  vImessage;
					sap.m.MessageBox.alert(vImessage , {
						title : oBundleText.getText("LABEL_0052"),	// 52:안내
						onClose : oController.onBack
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
		} else {
			vInfoTxt = oBundleText.getText("LABEL_0051");	// 51:신청하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_0048");	// 48:신청이 완료되었습니다.
			if(!common.Common.checkNull(vReqInfomessage)) 
				vInfoTxt = vReqInfomessage + "\n" + vInfoTxt;
		}
		
		sap.m.MessageBox.show(vInfoTxt, {
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : CreateProcess
		});
	},	
	
	onValidationData : function(oController, vPrtcy , vCheck){
		var rData = {};
		var vData = oController._DetailJSonModel.getProperty("/Data");
		
		var oObjps = sap.ui.getCore().byId(oController.PAGEID + "_Objps"); 
		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Slart");  
		var oGrdsp = sap.ui.getCore().byId(oController.PAGEID + "_Grdsp");
		var oDivcd = sap.ui.getCore().byId(oController.PAGEID + "_Divcd");
		var oSchtx = sap.ui.getCore().byId(oController.PAGEID + "_Schtx");
		var oZbetTotl = sap.ui.getCore().byId(oController.PAGEID + "_ZbetTotl");
		var oZyear = sap.ui.getCore().byId(oController.PAGEID + "_Zyear");
		
		if(vCheck == "X"){
			if(vData.Pernr == ""){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_0083"));	// 83:신청자 사원번호가 입력되지 않았습니다.
				return "";
			}
			if(vData.Regno == ""){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1116"));	// 1116:신청 대상이 선택되지 않았습니다.
//				oObjps.setValueState(sap.ui.core.ValueState.Error);
				return "";
			}
			if(vData.Divcd == ""){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1170"));	// 1170:분기/학기가 선택되지 않았습니다.
//				oDivcd.setValueState(sap.ui.core.ValueState.Error);
				return "";
			}
			
			
			// 특구교육일 경우 학력, 학년, 분기, 학기 체크 안함
			if(vData.Affil != "900"){
				if(vData.Slart == ""){
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1168"));	// 1168:학력구분이 선택되지 않았습니다.
	//				oSlart.setValueState(sap.ui.core.ValueState.Error);
					return "";
				}
				if(vData.Grdsp == ""){
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1169"));	// 1169:학년이 선택되지 않았습니다.
	//				oGrdsp.setValueState(sap.ui.core.ValueState.Error);
					return "";
				}
			}
			if(vData.Schtx == undefined ||  vData.Schtx == ""){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1171"));	// 1171:학교명이 입력되지 않았습니다.
//				oSchtx.setValueState(sap.ui.core.ValueState.Error);
				return "";
			}
			if(!vData.Zyear){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1172"));	// 1172:수혜년도가 입력되지 않았습니다.
//				oZyear.setValueState(sap.ui.core.ValueState.Error);
				return "";
			}
			if(vData.ZbetTotl == undefined || vData.ZbetTotl == ""){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1173"));	// 1173:학자금이 입력되지 않았습니다.
//				oZbetTotl.setValueState(sap.ui.core.ValueState.Error);
				return "";
			}
			if(vData.Affil == undefined || vData.Affil == ""){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1176"));	// 1176:계열이 입력되지 않았습니다.
//				oZbetTotl.setValueState(sap.ui.core.ValueState.Error);
				return "";
			}
			
			// 유치원, 초, 중 은 첨부파일 필수 아님.
			if(vPrtcy == "C" && vData.Slart != "01" && vData.Slart != "02" && vData.Slart != "03"){
				var oFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
				if(oFileList.getItems().length < 1){ // 첨부파일 필수
					new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1174"));	// 1174:첨부파일은 필수 입니다.
					return "";
				}
			}
			rData = common.Common.copyByMetadata(sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV"), "SchoolExpensesAppl", vData);
		}else{
			rData = common.Common.copyByMetadata(sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV"), "SchoolInfoChek", vData);
		}
		
		rData.ZbetEntr = common.Common.removeComma(rData.ZbetEntr);
		rData.ZbetClas = common.Common.removeComma(rData.ZbetClas);
		rData.ZbetOper = common.Common.removeComma(rData.ZbetOper);
		rData.ZbetEtc  = common.Common.removeComma(rData.ZbetEtc);
		rData.ZbetTotl = common.Common.removeComma(rData.ZbetTotl);
		rData.ZbetEntr2 = common.Common.removeComma(rData.ZbetEntr2);
		rData.ZbetClas2 = common.Common.removeComma(rData.ZbetClas2);
		rData.ZbetOper2 = common.Common.removeComma(rData.ZbetOper2);
		rData.ZbetEtc2  = common.Common.removeComma(rData.ZbetEtc2);
		rData.ZbetTotl2 = common.Common.removeComma(rData.ZbetTotl2);
		// 대상자와의 관계
		var vSchoolFamilyList = oController._SchoolFamilyList.getProperty("/Data");
		for(var i = 0 ; i < vSchoolFamilyList.length ; i ++){
			if(vData.Regno == vSchoolFamilyList[i].Regno){
				rData.Objps = vSchoolFamilyList[i].Objps ;
				break;
			}	
		}
		
		return rData;
		
	},
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
		var vError = "", vErrorMessage = "";
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV");
				var oPath = "/SchoolExpensesApplSet(Appno='" + vDetailData.Appno + "')";
				oModel.remove(
						oPath,
						null,      
						function(data,res){
						},
						function(Res){
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
				oController.BusyDialog.close();
				
				
				if(vError =="E"){
					sap.m.MessageBox.show(vErrorMessage,{
					});
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
//				control.ZNKBusyAccessor.onBusy("S",oController);
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
	
	onCalTotal : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
		// 입력값 Comma 부여
		var vData = common.Common.numberWithCommas(oEvent.getParameters().value);
		var oControl = sap.ui.getCore().byId(oEvent.getParameters().id); 
		oControl.setValue(vData);
		// 합계 계산
		
		var vEntr = common.Common.removeComma(oController._DetailJSonModel.getProperty("/Data/ZbetEntr"));
		var vClas = common.Common.removeComma(oController._DetailJSonModel.getProperty("/Data/ZbetClas"));
		var vOper = common.Common.removeComma(oController._DetailJSonModel.getProperty("/Data/ZbetOper"));
		var vEtc = common.Common.removeComma(oController._DetailJSonModel.getProperty("/Data/ZbetEtc"));
		var vTotal = "";
		
		vTotal = vEntr * 1 + vClas * 1 + vOper * 1 + vEtc * 1;
		
		oController._DetailJSonModel.setProperty("/Data/ZbetTotl",common.Common.numberWithCommas(vTotal));
	},
	
	_SearchSchoolDialog : null ,
	onOpenSchoolList : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
		
		if(!oController._SearchSchoolDialog) {
			oController._SearchSchoolDialog = sap.ui.jsfragment("ZUI5_HR_Scholarship.fragment.SchoolDialog", oController);
			oView.addDependent(oController._SearchSchoolDialog);
		}
		
		var sValue = sap.ui.getCore().byId(oController.PAGEID + "_SearchSchool");
		sValue.setValue("");
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_SchoolTable"),
		oModel = oTable.getModel();
		oModel.setData({ Data : []});
		
		oTable.setMode(sap.m.ListMode.Delete); // Delete mode selection
		oTable.setMode(sap.m.ListMode.SingleSelectLeft); // Put it back.
		
		oController._SearchSchoolDialog.open();
	},
	
	onSearchSchool : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
		var sValue = sap.ui.getCore().byId(oController.PAGEID + "_SearchSchool").getValue();
		
		var dataProcess = function(){
		    var oFilters = [];
			var oModel = sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV")
			var oSchoolModel = sap.ui.getCore().byId(oController.PAGEID + "_SchoolTable").getModel();
			var vData = { Data : []}, vErrorMessage = "";
			oFilters.push(new sap.ui.model.Filter("Schtx", sap.ui.model.FilterOperator.EQ, sValue));
			
			oModel.read("/SchoolListSet", {
				async: false,
				filters: [
					oFilters
				],
				success: function(data,res){
					if(data && data.results.length) {
						for(var i=0; i<data.results.length; i++) {
							vData.Data.push(data.results[i]);
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
			oSchoolModel.setData(vData);
			
			if(vErrorMessage != ""){
				oController.BusyDialog.close();
				new control.ZNK_SapBusy.oErrorMessage(vErrorMessage);
				return ;
			}
			
			oController.BusyDialog.close();
		};
		
		oController.BusyDialog.open();
		setTimeout(dataProcess, 300);
	},
	
	onConfirmSchool : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController(),
		oTable = sap.ui.getCore().byId(oController.PAGEID + "_SchoolTable"),
		vContexts = oTable.getSelectedContexts(true),
		oModel = oTable.getModel();
	
		if(vContexts.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2915"));	// LABEL_2915 검색결과를 선택하기 바랍니다.
			return;
		}else if(vContexts.length > 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2914"));	// LABEL_2914=검색결과 중 하나만 선택하기 바랍니다.
			return;
		}	
		
		var _selPath = vContexts[0].sPath;
		
		oController._DetailJSonModel.setProperty("/Data/Schcd", oModel.getProperty(_selPath +"/Schcd"));
		oController._DetailJSonModel.setProperty("/Data/Schtx", oModel.getProperty(_selPath +"/Schtx"));
		
		oController._SearchSchoolDialog.close();
	},
	
	
	onCancelSchool : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
	    oController._SearchSchoolDialog.close();
	},
	
	onAfterSelectPernr : function(oController){
		// 초기화 
		var vDetailData = oController._DetailJSonModel.getProperty("/Data");
		vDetailData.Regno = "";
		vDetailData.Totalamt = "";
		vDetailData.Slart = "";
		vDetailData.Schcd = "";
		vDetailData.Schtx = "";
		vDetailData.Majnm = "";
		vDetailData.Grdsp = "";
		vDetailData.Divcd = "";
		vDetailData.Zyear = "";
		vDetailData.Masyn = "";
		vDetailData.Speyn = false;
		vDetailData.Locat = "";
		vDetailData.Zbigo = "";
		vDetailData.ZbetEntr = "";
		vDetailData.ZbetClas = "";
		vDetailData.ZbetOper = "";
		vDetailData.ZbetEtc = "";
		vDetailData.ZbetTotl = "";
		vDetailData.Waers2 = "";
		vDetailData.ZbetEntr2 = "";
		vDetailData.ZbetClas2 = "";
		vDetailData.ZbetOper2 = "";
		vDetailData.ZbetEtc2 = "";
		vDetailData.ZbetTotl2 = "";		
		oController._DetailJSonModel.setProperty("/Data", vDetailData);
		
		// 신청대상 조회
		oController.onSetObjps(oController);
		// 
	},
	
	onPressHistory : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
		
		if(!oController._SearchHistoryDialog) {
			oController._SearchHistoryDialog = sap.ui.jsfragment("ZUI5_HR_Scholarship.fragment.HistoryDialog", oController);
			oView.addDependent(oController._SearchHistoryDialog);
		}
		
		var oHistoryTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable");
		var oJSonModel = oHistoryTable.getModel();
		oJSonModel.setData({Data : []});
		oHistoryTable.setVisibleRowCount(1);
		oController._SearchHistoryDialog.open();
	},
	
	beforeOpenHistoryDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
		var oHistoryTable = sap.ui.getCore().byId(oController.PAGEID + "_HistoryTable");
		var oJSonModel = oHistoryTable.getModel();
		var oDatas = { Data : []};
		var vError = "" , vErrorMessage = ""; 
		var onProcess = function(){
			var oModel = sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV");
			
			oModel.read("/SchoolPayHistorySet", {
				async: false,
				filters: [
					new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, oController._DetailJSonModel.getProperty("/Data/Encid")),
				],
				success: function(data,res){
					if(data && data.results.length) {
						for(var i=0; i<data.results.length; i++) {
							
							if(data.results[i].Payym && data.results[i].Payym != "" && data.results[i].Payym * 1 != 0){
								data.results[i].Payym =  data.results[i].Payym.substring(0,4) + "." + data.results[i].Payym.substring(4,6) ; 
							}else data.results[i].Payym =  "";
							
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
			oHistoryTable.setVisibleRowCount(oDatas.Data.length > 15 ? 15 : oDatas.Data.length);
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
	},
	
	displayAffilSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController(),
			errData = {}, oModel = sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV");
		
		if(!oController._SearchAffilDialog) {
			oController._SearchAffilDialog = sap.ui.jsfragment("ZUI5_HR_Scholarship.fragment.AffilDialog", oController);
			oView.addDependent(oController._SearchAffilDialog);
		}
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_AffilTable");
		var oJSonModel = oTable.getModel(),
		vData = { Data : []};
		
		if(common.Common.checkNull(oJSonModel.getProperty("/Data"))){
			
			oModel.read("/SchoolAffilListSet", {
				async : false,
				filters : [
					
				],
				success : function(data, res) {
					if(data && data.results.length){
						for(var i =0; i < data.results.length; i++){
							vData.Data.push(data.results[i]);
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
					}
				});
				return ;
			}
			
			oJSonModel.setData(vData);
		}
		
		oTable.setMode(sap.m.ListMode.Delete); // Delete mode selection
		oTable.setMode(sap.m.ListMode.SingleSelectLeft); // Put it back.
		
		oController._SearchAffilDialog.open();
		
	},
	
	onConfirmAffil : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
			oController = oView.getController(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_AffilTable"),
			oAffil = sap.ui.getCore().byId(oController.PAGEID + "_Affil");
			vContexts = oTable.getSelectedContexts(true),
			oModel = oTable.getModel(),
			_selPath = vContexts[0].sPath;
			
		if(vContexts.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1175"));	// 1175:계열을 선택하여 주십시오.
			return;
		}	
		oController._DetailJSonModel.setProperty("/Data/Affil", oModel.getProperty(_selPath +"/Affil")); 
		oController._DetailJSonModel.setProperty("/Data/Affiltx", oModel.getProperty(_selPath +"/Affiltx"));
		
//		common.Common.swapClearButton({
//			oInput : oAffil,
//			clear : oController.clearInput,
//			helper : oController.displayAffilSearchDialog
//		});
		
		// 특수교육을 선택 시 지원금액은 수기입력으로 변경
		if(oModel.getProperty(_selPath +"/Affil") == "900"){
			oController._DetailJSonModel.setProperty("/Data/ZDivcdST", "");
			oController._DetailJSonModel.setProperty("/Data/ZbetEntr", "");
			oController._DetailJSonModel.setProperty("/Data/ZbetClas", "");
			oController._DetailJSonModel.setProperty("/Data/ZbetOper", "");
			oController._DetailJSonModel.setProperty("/Data/ZbetEtc", "");
			oController._DetailJSonModel.setProperty("/Data/ZbetTotl", "");
			oController._DetailJSonModel.setProperty("/Data/Speyn", true);
		}else{
			// 신청금액 활성화 여부설정
			oController._DetailJSonModel.setProperty("/Data/Speyn", false);
			oController.onChangeDivcd(oEvent);
		}
		
		oController._SearchAffilDialog.close();
	},
	
	clearInput : function() {
		var oView = sap.ui.getCore().byId("ZUI5_HR_Scholarship.ZUI5_HR_ScholarshipDetail");
		oController = oView.getController();
		
		oController._DetailJSonModel.setProperty("Data/Affil", ""); 
		oController._DetailJSonModel.setProperty("Data/Affiltx", "");
	},
});