jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");

sap.ui.controller("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipDetail
	 */

	PAGEID : "ZUI5_HR_ScholarshipDetailHA",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_SchoolFamilyList : new sap.ui.model.json.JSONModel(), 
	_DialogActionFlag : null ,
	_vPersa : "" ,
	_vUploadFiles : [],
	_vAppno : "",
	_vZworktyp : 'HR02',
	_vAppty : "MANAGE",
	
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
		oController._vUploadFiles = [];
		var vZappStatAl = "" , vRegno = "";
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		var oModel = sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV");
		var oDetailData = {Data : {}};
		
		if(oEvent) {
			oController._vAppno = oEvent.data.Appno;
		}
		
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
		
		 // 수정 및 조회
		oController.BusyDialog.open();
		var vErrorMessage = "", vError = "";
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy.MM.dd"});
		var oPath = "/SchoolExpensesApplSet/?$filter=Appno eq '" + oController._vAppno + "'";	
		oModel.read(oPath, 
			    null, null, false, 
				function(data,res){
					if(data && data.results.length){
						var OneData = data.results[0];
						OneData.Zpayym = OneData.Zpayym.substring(0,4) + "." + OneData.Zpayym.substring(4,6) ; 

						// 대상자
//						OneData.BOrgtx = OneData.Btext +" / " + OneData.Orgtx ;     // 사업장 / 소속부서
						if(OneData.Btext != "" && OneData.Orgtx != "") OneData.BOrgtx = OneData.Btext +" / " + OneData.Orgtx ;
						else OneData.BOrgtx = OneData.Btext + OneData.Orgtx ;
//						OneData.ZzjikgbtxT = OneData.Zzjikgbt +" / " + OneData.Zzjiktlt ;  // 직군 / 직급
						if(OneData.Zzjikgbt != "" && OneData.Zzjiktlt != "" )  OneData.ZzjikgbtxT = OneData.Zzjikgbt +" / " + OneData.Zzjiktlt ;  
						else  OneData.ZzjikgbtxT = OneData.Zzjikgbt + OneData.Zzjiktlt ; 
						
//						OneData.Zzjikcht = OneData.Zzjikcht;
						// 신청자						
						if(OneData.Apbtext != "" && OneData.Aporgtx != "") OneData.ApbrgtxT = OneData.Apbtext +" / " + OneData.Aporgtx ;
						else OneData.ApbrgtxT = OneData.Apbtext + OneData.Aporgtx ;
						
						if(OneData.Apzzjikgb != "" && OneData.Apzzjiktlt != "") OneData.ApzzjikgbtxT = OneData.Apzzjikgbt +" / " + OneData.Apzzjiktlt ;
						else OneData.ApzzjikgbtxT = OneData.Apzzjikgbt + OneData.Apzzjiktlt ;
						
						OneData.ZbetReal = common.Common.numberWithCommas(parseInt(OneData.ZbetEntr) + parseInt(OneData.ZbetTotl) - parseInt(OneData.ZbetShip)); //실부담금액
						OneData.ZbetEntr = common.Common.numberWithCommas(OneData.ZbetEntr); //입학금
						OneData.ZbetShip = common.Common.numberWithCommas(OneData.ZbetShip); //장학금
						OneData.ZbetTotl = common.Common.numberWithCommas(OneData.ZbetTotl); //학자금 총액
						
						OneData.ZbefCash = OneData.ZbefCash == "Y" ? 0 : 1  ; // 학자금 선 지급 유무를 index 로 표기	
						if(OneData.ZpayDate){
							OneData.ZpayDate = dateFormat.format(new Date(OneData.ZpayDate)); 
						}else if(OneData.Zpayym){
							OneData.ZpayDate = dateFormat.format(new Date(OneData.Zpayym.substring(0,4), parseInt(OneData.Zpayym.substring(5,7)) - 1 , '24'));
						}
						
						if(OneData.Zpyamt == "" || OneData.Zpyamt == 0 ){
							OneData.Zpyamt = common.Common.numberWithCommas( 
									    parseInt(common.Common.removeComma(OneData.ZbetEntr)) + parseInt(common.Common.removeComma(OneData.ZbetTotl))
									    );  //지원금액
						}else{
							OneData.Zpyamt = common.Common.numberWithCommas( OneData.Zpyamt );
						} 	
						
						
						
						vRegno = OneData.Regno ;
						vZappStatAl = OneData.ZappStatAl ;
						if(vZappStatAl == "20" || vZappStatAl == "30"){
							OneData.EnableYn = true ;
						}else{
							OneData.EnableYn = false ;
						}
						oDetailData.Data = OneData;
					}
				},
				function(Res){
					vError = "E";
					if(Res.response.body){
						ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						}
					}
				}
			);
		
		// 차수 Text 설정
		var mSchoolLimit = sap.ui.getCore().getModel("SchoolLimit");
//		oDetailData.Data.Reqym =  mSchoolLimit.getProperty("/Data/Reqym"); 
//		oDetailData.Data.Zpayym = mSchoolLimit.getProperty("/Data/Payym");
//		oDetailData.Data.ZbefSeqr = mSchoolLimit.getProperty("/Data/ZbefSeqr");

		// 상세화면 Binding
		oController._DetailJSonModel.setData(oDetailData);
		// 신청 대상 List 조회 및 binding
		oController.onSetObjps(oController, vRegno);
		// 지원 , 제한 횟수 및 입학금 지급 여부 조회
		oController.onGetSchoolLimitCnt(oController);
		// 학년 List 조회 및 binding
		oController.onSetGrdsp(oController);
		// 학기/분기 List 조회 및 binding
		oController.onSetDivcd(oController);
		
		// 학년 과 학기/분기 Select
		var oGrdsp = sap.ui.getCore().byId(oController.PAGEID + "_Grdsp");
		var oDivcd = sap.ui.getCore().byId(oController.PAGEID + "_Divcd");
		if(oDetailData.Data.Grdsp != undefined) oGrdsp.setSelectedKey(oDetailData.Data.Grdsp);
		if(oDetailData.Data.Grdsp != undefined) oDivcd.setSelectedKey(oDetailData.Data.Divcd);
		
		// 첨부파일 
		common.AttachFileAction.oController = oController;
		common.AttachFileAction.setAttachFile(oController);
		common.AttachFileAction.refreshAttachFileList(oController);	
		
		// 결재 상태에 따라 Page Header Text 수정		
		if(vZappStatAl == "20"){
			oDetailTitle.setText("학자금 신청관리 수정");
		}else{
			oDetailTitle.setText("학자금 신청관리 조회");
		}
		
		var oObjps = sap.ui.getCore().byId(oController.PAGEID + "_Objps"); 
		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Slart");  
		var oGrdsp = sap.ui.getCore().byId(oController.PAGEID + "_Grdsp");
		var oDivcd = sap.ui.getCore().byId(oController.PAGEID + "_Divcd");
		var oSchtx = sap.ui.getCore().byId(oController.PAGEID + "_Schtx");
		var oZbetTotl = sap.ui.getCore().byId(oController.PAGEID + "_ZbetTotl");
		var oZyear = sap.ui.getCore().byId(oController.PAGEID + "_Zyear");
		var oZpyamt = sap.ui.getCore().byId(oController.PAGEID + "_Zpyamt");
		
		
		if(oObjps) oObjps.setValueState(sap.ui.core.ValueState.None);
		if(oSlart) oSlart.setValueState(sap.ui.core.ValueState.None);
		if(oGrdsp) oGrdsp.setValueState(sap.ui.core.ValueState.None);
		if(oDivcd) oDivcd.setValueState(sap.ui.core.ValueState.None);
		if(oSchtx) oSchtx.setValueState(sap.ui.core.ValueState.None);
		if(oZbetTotl) oZbetTotl.setValueState(sap.ui.core.ValueState.None);
		if(oZyear) oZyear.setValueState(sap.ui.core.ValueState.None);
		if(oZpyamt) oZpyamt.setValueState(sap.ui.core.ValueState.None);
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
	},
	
	onBack : function(oEvent){
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipList",
		      data : {
		    	 
		      }
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
	
	onSetGrdsp : function(oController){
		var oGrdsp = sap.ui.getCore().byId(oController.PAGEID + "_Grdsp");
		oGrdsp.removeAllItems();
		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Slart");
		var oModel = sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV");

		var oPath = "/SchoolGradeListSet";
		oModel.read(
				oPath,
				null,
				null,
				false,
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							oGrdsp.addItem(new sap.ui.core.Item({key: data.results[i].Grdsp, text: data.results[i].Grdsptx}));
						}
					}
				},
				function(res){console.log(res);}
		);
	},
	
	onSetDivcd : function(oController){
		var oDivcd = sap.ui.getCore().byId(oController.PAGEID + "_Divcd");
		oDivcd.removeAllItems();
		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Slart");
		var oModel = sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV");

		var oPath = "/SchoolTermListSet?$filter=Slart eq '" +oSlart.getSelectedKey() + "'" ;
		oModel.read(
				oPath,
				null,
				null,
				false,
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							oDivcd.addItem(new sap.ui.core.Item({key: data.results[i].Divcd, text: data.results[i].Divtx}));
						}
					}
				},
				function(res){console.log(res);}
		);	
	},

	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
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
	
	// 가족 구분 조회 및 binding
	onSetObjps : function(oController, vRegno){
		var DetailData = oController._DetailJSonModel.getProperty("/Data");
		var oObjps = sap.ui.getCore().byId(oController.PAGEID + "_Objps");
		oObjps.removeAllItems();
	
		var oModel = sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV");
		
		var vSchoolFamilyList = { Data : []} ;
		
		if(DetailData && DetailData.Pernr != undefined && DetailData.Pernr != ""){
			var oPath = "/SchoolExpensesObjListSet?$filter=Pernr eq '"+ DetailData.Pernr + "'";
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
							if(vRegno == "") oObjps.setSelectedItem(oObjps.getFirstItem());
							else oObjps.setSelectedKey(vRegno);
						}
					},
					function(res){console.log(res);}
			);	
		}
		
		if(oObjps.getSelectedItem()){
			var vObjpsTx = oObjps.getSelectedItem().getText();
			oController._DetailJSonModel.setProperty("/Data/ObjpsT",vObjpsTx);
		}

		oController._SchoolFamilyList.setData(vSchoolFamilyList);
		
	},
	// 학력구분을 선택함에따른 학자금 선 지급유무 활성화
	onSetZbefCash : function(oController){
		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Slart");
		if(oSlart != "06" && oSlart != "05") oController._DetailJSonModel.setProperty("/Data/ZbefCash",1); // 학자금 선 지급은 대학교만 가능
		
	},

	// 신청가능 액 조회
	onGetSchoolLimitCnt : function(oController){
		var oModel = sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV");
		var DetailData = {};
		var oObjps = sap.ui.getCore().byId(oController.PAGEID + "_Objps");
		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Slart");
		var vCheckValid = "";
		DetailData.ZpayCntT =  "" ; //현 지원횟수 / 총 지원가능횟수
		DetailData.ZpayCnt = "" ;  //현 지원횟수
		DetailData.Limcnt =  "" ; //총 지원가능횟수
		DetailData.ZentrYn = "" ; //입학금 지급여부
		DetailData.vZentrYntx = ""; //미지급 text
		DetailData.LtamtT = "(* 한도금액 : )"; //한도금액 Text
		DetailData.Ltamt = 0 ; //한도금액 Text
		
		if(oObjps.getSelectedKey() == undefined || oObjps.getSelectedKey() ==  ""){
			vCheckValid = "X" ;
		}
		if(oSlart.getSelectedKey() == undefined || oSlart.getSelectedKey() ==  ""){
			vCheckValid = "X" ;
		}
//		if(oController._DetailJSonModel.getProperty("/Data/Zyear").length != 4){
//			vCheckValid = "X" ;
//		}
		if(vCheckValid == "" ){
			var vObjps = oObjps.getSelectedKey().replace("-", "");
			var vLtamt = "";
			// Hass 에서는 한도 를 조회하기 위하여 학자금 발생년도를 조회한다.
			var oPath = "/SchoolLimitCntSet?$filter=Pernr eq '" + oController._DetailJSonModel.getProperty("/Data/Pernr") + "' and Regno eq '" + vObjps + 
						"' and Slart eq '"+ oSlart.getSelectedKey() + "' and Zyear eq '" + oController._DetailJSonModel.getProperty("/Data/Zyear") + "'";
			oModel.read(
					oPath,
					null,
					null,
					false,
					function(data,res){
						if(data && data.results.length){
							DetailData.ZpayCntT =  data.results[0].ZpayCnt + " / "  + data.results[0].Limcnt ;
							DetailData.ZpayCnt = data.results[0].ZpayCnt ; 
							DetailData.Limcnt = data.results[0].Limcnt ; 
							DetailData.ZentrYn = data.results[0].ZentrYn ; 
							vLtamt = data.results[0].Ltamt ;
							if(vLtamt  == 0 ) vLtamt = "" ;
							else vLtamt = common.Common.numberWithCommas(vLtamt)
							DetailData.Ltamt = data.results[0].Ltamt ;
							DetailData.LtamtT = "(* 한도금액 : " + vLtamt  + " )" ; 
						}
					},
					function(res){console.log(res);}
			);	
		}
		
		oController._DetailJSonModel.setProperty("/Data/ZpayCntT", DetailData.ZpayCntT); 
		oController._DetailJSonModel.setProperty("/Data/ZpayCnt", DetailData.ZpayCnt); 
		oController._DetailJSonModel.setProperty("/Data/Limcnt", DetailData.Limcnt); 
		oController._DetailJSonModel.setProperty("/Data/ZentrYn", DetailData.ZentrYn); 
		oController._DetailJSonModel.setProperty("/Data/LtamtT", DetailData.LtamtT); 
		oController._DetailJSonModel.setProperty("/Data/Ltamt", DetailData.Ltamt); 
//		if(DetailData.ZentrYn == "Y"){
//			// 입학금 지급여부가 지급인 경우 입학금은 blank 처리
//			oController._DetailJSonModel.setProperty("/Data/ZbetEntr", ""); 
//		}
		
			
		//지급 미지급 text 입력
		var mSchoolEntpayList = sap.ui.getCore().getModel("SchoolEntpayList");
		var vData = mSchoolEntpayList.getProperty("/Data");
		for(var i = 0 ; i < vData.length ; i ++){
			if(vData[i].ZentrYn == DetailData.ZentrYn ){
				DetailData.vZentrYntx = vData[i].ZentrYntx;
				break;
			}
		}
		
		oController._DetailJSonModel.setProperty("/Data/ZentrYnT", DetailData.vZentrYntx); 
	
	},
	
	onChangeZyear : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
		oController.onGetSchoolLimitCnt(oController);
	},
	
	onChangeSlart : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
		oController.onGetSchoolLimitCnt(oController);
		oController.onSetDivcd(oController);
		oController.onSetGrdsp(oController);
		oController.onSetZbefCash(oController);
		
	},
	
	onChangeZbetReal : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
		var vDetailData = oController._DetailJSonModel.getProperty("/Data");
		var vZbetTotl , vZbetShip , vZbetEntr;
		// 실부담금 계산 및 binding
		if(vDetailData){
			if(!vDetailData.ZbetTotl || vDetailData.ZbetTotl == "") {
				vZbetTotl = "0" ; //  학자금 총액
			}else{
				vZbetTotl = vDetailData.ZbetTotl;
			}
			if(!vDetailData.ZbetShip || vDetailData.ZbetShip == ""){
				vZbetShip = "0" ; // 장학금
			}else{
				vZbetShip = vDetailData.ZbetShip;
			}
			if(!vDetailData.ZbetEntr || vDetailData.ZbetEntr == ""){
				vZbetEntr = "0" ; // 입학금
			}else{
				vZbetEntr = vDetailData.ZbetEntr;
			}
			
			var vZbetReal = parseInt(common.Common.removeComma(vZbetEntr)) + parseInt(common.Common.removeComma(vZbetTotl)) - parseInt(common.Common.removeComma(vZbetShip));
			oController._DetailJSonModel.setProperty("/Data/ZbetReal" , common.Common.numberWithCommas(vZbetReal));
		}
	},
	
	onSelectMajdou : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
	
	},
	
	onPressSaveP : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
		oController.onSave(oController , "P");
	},
	
	onPressSaveR : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
		oController.onSave(oController , "R");
	},
	
	// 저장 Process
	onSave : function(oController , vPrcty){ // 처리 구분
		var vZappStatAl	= "" , vError = "", vErrorMessage = "";
		var vOData = oController.onValidationData(oController, vPrcty);
		if( vOData == "") return ;
		vOData.Prcty = vPrcty ; 
		
		var onProcess = function(){
				var vErrorMessage = "";
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
				if(oController._vUploadFiles && oController._vUploadFiles.length) {
					oController._vUploadFiles = [];
				}
				
				oController.BusyDialog.close();
				
				sap.m.MessageBox.show(vCompTxt, {
					title : "안내",
					onClose : oController.onBack
				});

		};
		
		var CreateProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
//				control.ZNKBusyAccessor.onBusy("S",oController);
				oController.BusyDialog.open();
				setTimeout(onProcess, 100);
			}
		};
		var vInfoTxt = "" , vCompTxt = "";
		if(vPrcty == "P"){
			vInfoTxt = "승인 하시겠습니까?";
			vCompTxt = "승인이 완료되었습니다." ;
		}else if(vPrcty == "R"){
			vInfoTxt = "반려 하시겠습니까?";
			vCompTxt = "반려가 완료되었습니다.";
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
		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Slart"); 
		var oGrdsp = sap.ui.getCore().byId(oController.PAGEID + "_Grdsp");
		var oDivcd = sap.ui.getCore().byId(oController.PAGEID + "_Divcd");
		var oObjps = sap.ui.getCore().byId(oController.PAGEID + "_Objps"); 
		var oSchtx = sap.ui.getCore().byId(oController.PAGEID + "_Schtx");
		var oZbetTotl = sap.ui.getCore().byId(oController.PAGEID + "_ZbetTotl");
		var oZyear = sap.ui.getCore().byId(oController.PAGEID + "_Zyear");
		var oZpyamt = sap.ui.getCore().byId(oController.PAGEID + "_Zpyamt");
		
		if(oObjps) oObjps.setValueState(sap.ui.core.ValueState.None);
		if(oSlart) oSlart.setValueState(sap.ui.core.ValueState.None);
		if(oGrdsp) oGrdsp.setValueState(sap.ui.core.ValueState.None);
		if(oDivcd) oDivcd.setValueState(sap.ui.core.ValueState.None);
		if(oSchtx) oSchtx.setValueState(sap.ui.core.ValueState.None);
		if(oZbetTotl) oZbetTotl.setValueState(sap.ui.core.ValueState.None);
		if(oZyear) oZyear.setValueState(sap.ui.core.ValueState.None);
		if(oZpyamt) oZpyamt.setValueState(sap.ui.core.ValueState.None);
		
		if(vData.Pernr == ""){
			new control.ZNK_SapBusy.oErrorMessage("신청자 사원번호가 입력되지 않았습니다.");
			return "";
		}
		if(vData.Regno == ""){
			new control.ZNK_SapBusy.oErrorMessage("신청 대상이 선택되지 않았습니다.");
			return "";
		}

		// 현지원횟수랑 지원가능횟수 비교함
		if(parseInt(vData.ZpayCnt) >= parseInt(vData.Limcnt)){
			new control.ZNK_SapBusy.oErrorMessage("총 지원가능횟수를 초과하였습니다.");
			return "";
		}
		
		if(oSlart.getSelectedKey() == ""){
			new control.ZNK_SapBusy.oErrorMessage("학력구분이 선택되지 않았습니다.");
			oSlart.setValueState(sap.ui.core.ValueState.Error);
			return "";
		}
		if(oGrdsp.getSelectedKey() == ""){
			new control.ZNK_SapBusy.oErrorMessage("학년이 선택되지 않았습니다.");
			oGrdsp.setValueState(sap.ui.core.ValueState.Error);
			return "";
		}
		if(oDivcd.getSelectedKey() == ""){
			new control.ZNK_SapBusy.oErrorMessage("분기/학기가 선택되지 않았습니다.");
			oDivcd.setValueState(sap.ui.core.ValueState.Error);
			return "";
		}
		if(vData.Schtx == undefined ||  vData.Schtx == ""){
			new control.ZNK_SapBusy.oErrorMessage("학교명이 입력되지 않았습니다.");
			oSchtx.setValueState(sap.ui.core.ValueState.Error);
			return "";
		}
		if(vData.Zyear == undefined || vData.Zyear == ""){
			new control.ZNK_SapBusy.oErrorMessage("발생년도가 입력되지 않았습니다.");
			oZyear.setValueState(sap.ui.core.ValueState.Error);
			return "";
		}
		if(vData.ZbetTotl == undefined || vData.ZbetTotl == ""){
			new control.ZNK_SapBusy.oErrorMessage("학자금이 입력되지 않았습니다.");
			oZbetTotl.setValueState(sap.ui.core.ValueState.Error);
			return "";
		}
		
		if( vPrcty == "R"){
			if(!vData.ZappResn || vData.ZappResn == ""){ // 반려일 경우 반려사유 필수
				new control.ZNK_SapBusy.oErrorMessage("반려시 반려사유는 필수 입니다.");
				return "";
			}else{
				rData.ZappResn = vData.ZappResn;
			}
		}
		if( vPrcty != "R" && ( vData.Zpyamt == "" || parseInt(vData.Zpyamt) == 0)){ // 반려를 제외하고 지원금액은 필수 
			new control.ZNK_SapBusy.oErrorMessage("지원금액을 입력하시기 바랍니다.");
			return "";
		}
		if( vPrcty != "R" && ( vData.ZpayDate == undefined || vData.ZpayDate == "")){ // 반려를 제외하고 지급일자 필수
			new control.ZNK_SapBusy.oErrorMessage("지원일자를 입력하시기 바랍니다.");
			return "";
		}
		
		var oFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
		if(vPrcty != "R" && oController._vUploadFiles.length < 1 && oFileList.getItems().length < 1){ // 반려를 제외하고 첨부파일 필수
			new control.ZNK_SapBusy.oErrorMessage("첨부파일은 필수 입니다.");
			return "";
		}
		
		rData.Majdou =  vData.Majdou == true || vData.Majdou == "X" ? "X" : "" ; // 해외학교/외국인학교
		if(rData.Majdou == "X" && (rData.Slart == "03" || rData.Slart == "04")){ // 중,고등학교일때만 해당여부 체크
			if(parseInt(common.Common.removeComma(vData.Ltamt)) < parseInt(common.Common.removeComma(vData.Zpyamt)) ){
				new control.ZNK_SapBusy.oErrorMessage("지원금액이 한도금액을 초과하였습니다.");
				return "";
			}
		}
		
//		if(parseInt(common.Common.removeComma(vData.ZbetReal)) < parseInt(common.Common.removeComma(vData.Zpyamt)) ){
//			new control.ZNK_SapBusy.oErrorMessage("지원금액이 실 부담금액을 초과하였습니다.");
//			return "";
//		}
		
		if(parseInt(common.Common.removeComma(vData.ZbetShip)) > parseInt(common.Common.removeComma(vData.ZbetEntr)) + parseInt(common.Common.removeComma(vData.ZbetTotl)) ){
			new control.ZNK_SapBusy.oErrorMessage("실 부담금액이 마이너스가 될 수는 없습니다.");
			return "";
		}
		
		rData.ZbetEntr =  common.Common.removeComma(vData.ZbetEntr);// 입학금 
		rData.ZbetShip =  common.Common.removeComma(vData.ZbetShip);// 장학금
		rData.ZbetTotl =  common.Common.removeComma(vData.ZbetTotl);// 학자금
		
		if( parseInt(rData.ZbetEntr) + parseInt(rData.ZbetTotl) - parseInt(rData.ZbetShip) < 0){
			new control.ZNK_SapBusy.oErrorMessage("신청 금액은 필수 입니다. 0 이상인지 확인바랍니다.");
			return "";
		} 
		
		
		rData.Forsch =  vData.Forsch == true || vData.Forsch ==  "X" ? "X" : ""; // 복수전공 수업료여부
		rData.Ename =  vData.Ename; // 대상자 성명
		rData.Pernr =  vData.Pernr; // 대상자
		rData.Regno =  vData.Regno; // 신청대상
		rData.Appno =  vData.Appno; // 신청번호
		rData.Slart =  oSlart.getSelectedKey(); // 학력구분
		rData.Grdsp =  oGrdsp.getSelectedKey(); // 학년
		rData.Divcd =  oDivcd.getSelectedKey(); // 학기/분기
		rData.Schtx =  vData.Schtx; // 학교명
		rData.Majnm =  vData.Majnm; // 학과
		rData.Zyear = vData.Zyear; // 학자금발생년도
		rData.Appernr =  vData.Appernr; // 신청자
		rData.ZentrYn =  vData.ZentrYn ;// 입학금 지급여부
		rData.Waers = "KRW";
		rData.Appno = oController._vAppno ; // 신청번호
		rData.Apbeg =  vData.Apbeg; // 시작일자
		rData.Apend =  vData.Apend; // 종료일자
		rData.ZpayCnt = vData.ZpayCnt; // 현지원횟수
		rData.Zpayym = vData.Zpayym.replace(".", ""); // 지급년월
		rData.ZbefCash =  vData.ZbefCash == 0 ? "Y" : "N"; //학자금 선 지급 유무 (차수)
		rData.ZbefSeqr =  vData.ZbefCash == 0 ? vData.ZbefSeqr : ""; //학자금 선 지급 유무 (차수)
		rData.Zbigo = vData.Zbigo; // 비고
		rData.Zpyamt =  common.Common.removeComma(vData.Zpyamt);// 지원금
		rData.ZbetReal = common.Common.removeComma(vData.ZbetReal);// 실부담금액
		if(vData.ZpayDate != undefined && vData.ZpayDate != ""){
			rData.ZpayDate = "\/Date("+ common.Common.getTime(vData.ZpayDate)+")\/"; // 지급일자
		}
		
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
	
	openDocno : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipDetail");
		var oController = oView.getController();
		var vUri = oController._DetailJSonModel.getProperty("/Data/Zurl");
		if(vUri && vUri != "")  window.open(vUri);
	},

});