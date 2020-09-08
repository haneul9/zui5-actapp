//jQuery.sap.require("control.BusyIndicator");
//jQuery.sap.require("control.ZNKBusyAccessor");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ZNK_ApprovalLine");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail
	 */

	PAGEID : "ZUI5_HR_ExpenditureDetail",
	
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(), 
	_DialogJsonModel : new sap.ui.model.json.JSONModel(), 
	_MedicalFamilyList : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	
	_vAppno : "",
	
	_vFromPage : "",
	
	_vEnamefg : "",
	
	_vUploadFiles : null,	// 첨부파일
	_vZworktyp : "HR03",
	
	_ObjList : [],
	_vAppty : "MANAGE",

	///// 결재자 지정 /////
	_vReqForm : "HR03", // 신청서 유형
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
		bus.subscribe("app", "OpenWindow", this.SmartSizing,
				this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing,
				this);
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
		
		// 경조사유
		oController.setObjList(oController);

		oController.BusyDialog.open();
		var oModel = sap.ui.getCore().getModel("ZHR_CONTY_SRV");
		var oDetailTableDatas = {Data : []};
		var oDetailData = {Data : {}};
		var vErrorMessage = "", vError = "";
		
		var oPath = "/ExpensesApplSet?$filter=Appno eq '" + vAppno + "' and Prcty eq 'D'";
		oModel.read(oPath, null, null, false,
				function(data, res){
					
					// 대상자
					data.results[0].Btrtx = data.results[0].Btext;
					data.results[0].Zzorgtx = data.results[0].Orgtx;
					data.results[0].Zzjikgbt = data.results[0].Jikgbt;
					data.results[0].Zzjiktlt = data.results[0].Jiktlt;
					data.results[0].Zzjikcht = data.results[0].Jikcht;
					
					if(data.results[0].ZholChk == "X") data.results[0].ZholChktx = "신청";
					else data.results[0].ZholChktx = "미 신청";
					
					data.results[0].Conddate = dateFormat.format(data.results[0].Conddate);
					data.results[0].Conrdate = dateFormat.format(data.results[0].Conrdate);
					
					// 신청내역 
					data.results[0].ZbacBet = common.Common.numberWithCommas(data.results[0].ZbacBet);					
					data.results[0].ZetcBet = common.Common.numberWithCommas(data.results[0].ZetcBet);					
					data.results[0].Basbt = common.Common.numberWithCommas(data.results[0].Basbt);					
					data.results[0].ZpayBet = common.Common.numberWithCommas(data.results[0].ZpayBet);
					
					// 지급률 : 소수점 뒤가 00인 경우 표시하지 않는다.
					if(data.results[0].Payrt.substring(data.results[0].Payrt.length-2) == "00"){
						data.results[0].Payrt = data.results[0].Payrt.substring(0, data.results[0].Payrt.length-3);
					}
					
					oController._vReqPernr = data.results[0].Appernr;
					
					// 상태
					vZappStatAl = data.results[0].ZappStatAl;					
					
					oDetailData.Data = data.results[0];	

					// 신청대상 리스트
					oController.setAbilityList(oController, data.results[0].Pernr, data.results[0].Regno);
					
					
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
			
		
		// 첨부파일 
		common.AttachFileAction.oController = oController;
		common.AttachFileAction.setAttachFile(oController);
		common.AttachFileAction.refreshAttachFileList(oController);	
		
		// 결재 상태에 따라 Page Header Text 수정		
		if(vZappStatAl == "20"){
			oPortalTitle.setText("경조금 신청관리 수정");	
			
			var oFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
			if(oFileList.getItems().length >= 1){ // 첨부파일 여부 확인
				oController._DetailJSonModel.setProperty("/Data/Docyn", "Y")
			}
			
		} else {
			oPortalTitle.setText("경조금 신청관리 조회");
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
//		oContent.toDetail("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureList");
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		
		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureList",
			      data : { }
				}
			);	
		}
		
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
	},

	// 결재자 정보
	setApprovalLineModel : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
		
		var vData = {Data : []};
		
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		var oPath = "/ApprovalLineApplSet?$filter=ZreqForm eq 'RF03' and ZreqPernr1 eq '" + oController._vReqPernr + "'";
		
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
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
		var oPath = "/ReferenceLineSet?$filter=Pernr eq '" + vPernr + "' and Prvline eq '" + vPrvline + "' and ZreqForm eq 'RF03'";
		
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

	// 경조사유
	setObjList : function(oController){
		var oConresn = sap.ui.getCore().byId(oController.PAGEID + "_Conresn");
		
		if(oConresn.getItems().length == 0){
			oController._ObjList = [];
			
			var oModel = sap.ui.getCore().getModel("ZHR_CONTY_SRV");
			
			oModel.read("/ExpensesObjListSet", null, null, false,
					function(data,res){
						if(data && data.results.length){
							for(var i=0; i<data.results.length; i++){
								oController._ObjList.push(data.results[i]);
								oConresn.addItem(new sap.ui.core.Item({text : data.results[i].Condetx, key : data.results[i].Conresn}));
							}
						}
					},
					function(res){
						console.log(res);
					}
			);				
		}	
	},
	
	// 경조사유 변경시
	onChangeConresn : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
				
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		
		for(var i=0; i<oController._ObjList.length; i++){
			if(oneData.Conresn == oController._ObjList[i].Conresn){
				
				oController._DetailJSonModel.setProperty("/Data/Concode", oController._ObjList[i].Concode); // 경조구분
				oController._DetailJSonModel.setProperty("/Data/ZholDay", oController._ObjList[i].ZholDay); // 휴가일수
				oController._DetailJSonModel.setProperty("/Data/ZholChktx", "미 신청"); // 휴가일수
				
				// 지급률이 0인 경우 정해진 지급액 설정 아니면 계산해서 지급액을 설정한다.
				if(oController._ObjList[i].Payrt == "0.00"){
					oController._DetailJSonModel.setProperty("/Data/Payrt", "0");
					oController._DetailJSonModel.setProperty("/Data/ZpayBet", oController._ObjList[i].ZpayBet);
				} else {
					
					if(oController._ObjList[i].Payrt.substring(oController._ObjList[i].Payrt.length-2) == "00"){
						oController._DetailJSonModel.setProperty("/Data/Payrt", oController._ObjList[i].Payrt.substring(0,oController._ObjList[i].Payrt.length-3));
					} else {
						oController._DetailJSonModel.setProperty("/Data/Payrt", oController._ObjList[i].Payrt);
					}
										
					var vBasbt = Number(oneData.Basbt.replace(/,/g, ""));	// 약정금액
					var vPayrt = Number(oneData.Payrt.replace(/,/g, ""));	// 지급률
						vPayrt = vPayrt / 100;
					var vWokrt = Number(oneData.Wokrt.replace(/,/g, ""));	// 근속률
						vWokrt = vWokrt / 100;
					
//					var vZpayBet = vBasbt * vPayrt * vWokrt;
//						vZpayBet = vZpayBet + "";
//						vZpayBet = common.Common.numberWithCommas(vZpayBet);
						var vZpayBet = vBasbt * vPayrt * vWokrt;
						// 백단위 올림
							vZpayBet = Math.round(Math.ceil(vZpayBet/ 1000)) * 1000;
						
							vZpayBet = vZpayBet + "";
							vZpayBet = common.Common.numberWithCommas(vZpayBet);
							
							
					oController._DetailJSonModel.setProperty("/Data/ZpayBet", vZpayBet);
				}
	
			}
		}
		
	},
	
	// 신청대상 리스트
	setAbilityList : function(oController, vPernr, vRegno){
		if(!vPernr) return;
		
		var oRegno = sap.ui.getCore().byId(oController.PAGEID + "_Regno");
		if(oRegno.getItems()) oRegno.destroyItems();
		
		var oModel = sap.ui.getCore().getModel("ZHR_CONTY_SRV");
		
		var oPath = "/AbilityListSet?$filter=Pernr eq '" + vPernr + "'";
		
		oModel.read(oPath, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0; i<data.results.length; i++){
							oRegno.addItem(new sap.ui.core.Item({key : data.results[i].Regno, text : data.results[i].Famtx})
												.addCustomData(new sap.ui.core.CustomData({key : "Objps", value : data.results[i].Objps})));
						}	
						
						if(!vRegno) oRegno.setSelectedKey(data.results[0].Regno);
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
	
	// 신청대상 변경 시 
	onChangeRegno : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		
		var oRegno = sap.ui.getCore().byId(oController.PAGEID + "_Regno");
		var oObjps = oRegno.getSelectedItem().getCustomData()[0].getValue();
		
		oController._DetailJSonModel.setProperty("/Data/Objps", oObjps);
	},
	
	// 기본급
//	setBasicPay : function(oController, vPernr){
//		if(!vPernr) return;
//		
//		var oModel = sap.ui.getCore().getModel("ZHR_CONTY_SRV");
//		var oPath = "/BasicPaySet?$filter=Pernr eq '" + vPernr + "'";
//		
//		oModel.read(oPath, null, null, false, 
//				function(data,res){
//					if(data && data.results.length){
//						oController._DetailJSonModel.setProperty("/Data/Wokrt", data.results[0].Wokrt);	  // 근속률
//						oController._DetailJSonModel.setProperty("/Data/ZbacBet", data.results[0].Bastr); // 기본급
//						oController._DetailJSonModel.setProperty("/Data/ZetcBet", data.results[0].Alltr); // 제수당
//						oController._DetailJSonModel.setProperty("/Data/Basbt", data.results[0].Sumtr);   // 약정금액
//					}
//				}, function(Res){
//					if(Res.response.body){
//						ErrorMessage = Res.response.body;
//						var ErrorJSON = JSON.parse(ErrorMessage);
//						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
//							ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
//						}
//					}
//					
//					oController._DetailJSonModel.setProperty("/Data/Wokrt", "");   // 근속률
//					oController._DetailJSonModel.setProperty("/Data/ZbacBet", ""); // 기본급
//					oController._DetailJSonModel.setProperty("/Data/ZetcBet", ""); // 제수당
//					oController._DetailJSonModel.setProperty("/Data/Basbt", "");   // 약정금액
//					
//					sap.m.MessageBox.alert(ErrorMessage, {title : "오류"});
//					return;
//				}
//		);
//		
//	},
	
	onChangeDate : function(oEvent){
		if(oEvent && oEvent.getParameters().valid == false){
			sap.m.MessageBox.alert("유효하지 않은 날짜형식입니다.", {title : "오류"});
			oEvent.getSource().setValue();
			return;
		}
	},
	
	setBasicPay : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		
		if(oEvent && oEvent.getParameters().valid == false){
			sap.m.MessageBox.alert("유효하지 않은 날짜형식입니다.", {title : "오류"});
			oEvent.getSource().setValue();
			return;
		}
		
		var oneData = oController._DetailJSonModel.getProperty("/Data");
		
		if(!oneData.Conddate) return;
		
		var oModel = sap.ui.getCore().getModel("ZHR_CONTY_SRV");
		var oPath = "/BasicPaySet?$filter=Pernr eq '" + oneData.Pernr + "'";
			oPath += " and Conddate eq datetime'" + oneData.Conddate + "T00:00:00'";
		
		oModel.read(oPath, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						oController._DetailJSonModel.setProperty("/Data/Wokrt", data.results[0].Wokrt);	  // 근속률
						oController._DetailJSonModel.setProperty("/Data/ZbacBet", common.Common.numberWithCommas(data.results[0].Bastr)); // 기본급
						oController._DetailJSonModel.setProperty("/Data/ZetcBet", common.Common.numberWithCommas(data.results[0].Alltr)); // 제수당
						oController._DetailJSonModel.setProperty("/Data/Basbt", common.Common.numberWithCommas(data.results[0].Sumtr));   // 약정금액
					}
				}, function(Res){
					if(Res.response.body){
						ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						}
					}
					
					oController._DetailJSonModel.setProperty("/Data/Wokrt", "");   // 근속률
					oController._DetailJSonModel.setProperty("/Data/ZbacBet", ""); // 기본급
					oController._DetailJSonModel.setProperty("/Data/ZetcBet", ""); // 제수당
					oController._DetailJSonModel.setProperty("/Data/Basbt", "");   // 약정금액
					
					sap.m.MessageBox.alert(ErrorMessage, {title : "오류"});
					return;
				}
		);
		
		// 지급액 계산
		oController.onChangeConresn();
		
	},
	
	// 신청내역 초기화
	onResetDetail : function(oController){
		oController._DetailJSonModel.setProperty("/Data/Conresn", "");   // 경조사유
		oController._DetailJSonModel.setProperty("/Data/Objps", "");   	 // 신청대상
		oController._DetailJSonModel.setProperty("/Data/Conddate", "");  // 증빙상 경조일
		oController._DetailJSonModel.setProperty("/Data/Conrdate", "");  // 실제 경조일
		oController._DetailJSonModel.setProperty("/Data/ZholDay", "");   // 휴가일수
		oController._DetailJSonModel.setProperty("/Data/ZholChktx", "");   // 휴가 신청여부
		oController._DetailJSonModel.setProperty("/Data/ZbacBet", ""); 	 // 기본급
		oController._DetailJSonModel.setProperty("/Data/ZetcBet", "");	 // 제수당
		oController._DetailJSonModel.setProperty("/Data/Basbt", "");  	 // 약정금액
		oController._DetailJSonModel.setProperty("/Data/Payrt", ""); 	 // 지급률		
		oController._DetailJSonModel.setProperty("/Data/Wokrt", "");  	 // 근속률	
		oController._DetailJSonModel.setProperty("/Data/ZpayBet", "");   // 지급액
	},	
	
	// 기본급,제수당 변경 시 약정금액 계산
	onSetBasbt : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		
		var vZbacBet = oController._DetailJSonModel.getProperty("/Data/ZbacBet");	// 기본급
		var vZetcBet = oController._DetailJSonModel.getProperty("/Data/ZetcBet");	// 제수당
		
		var vBasbt = Number(vZbacBet.replace(/,/g, "")) + Number(vZetcBet.replace(/,/g, ""));
			vBasbt = Math.ceil(vBasbt / 1000) * 1000;	// 100 단위에서 올림해서 약정금액으로 설정한다.
		
		var tmp = vBasbt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		
		oController._DetailJSonModel.setProperty("/Data/Basbt", tmp);
		
		oController.onSetZpayBet();
	},
	
	// 지급률, 근속률 변경 시 지급액 계산
	onSetZpayBet : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		
		var vBasbt = oController._DetailJSonModel.getProperty("/Data/Basbt");	// 약정금액
		var vPayrt = oController._DetailJSonModel.getProperty("/Data/Payrt");	// 지급률
			vPayrt = Number(vPayrt.replace(/,/g, "")) / 100;
		
		var vWokrt = oController._DetailJSonModel.getProperty("/Data/Wokrt");	// 근속률
			vWokrt = Number(vWokrt.replace(/,/g, "")) / 100;
		
		var vZpayBet = Number(vBasbt.replace(/,/g, "")) * vPayrt * vWokrt;
			vZpayBet = Math.ceil(vZpayBet / 1000) * 1000;
		
		var tmp = vZpayBet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		
		oController._DetailJSonModel.setProperty("/Data/ZpayBet", tmp);
	},
	
	// 대상자 선택
	_AddPersonDialog : null ,
	EmpSearchByTx :function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		var vEname = oControl.getValue();
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = {EmpSearchResultSet : []};
		common.SearchUser1.oController = oController;
		oController._vEnamefg = "";
		
		if(!vEname || vEname == ""){
			if(oController._DetailJSonModel.getProperty("/Data")){
				
				oController._DetailJSonModel.setProperty("/Data/Ename", "");
				oController._DetailJSonModel.setProperty("/Data/Pernr", "");
				oController._DetailJSonModel.setProperty("/Data/Btrtx", "");
				oController._DetailJSonModel.setProperty("/Data/Zzorgtx", "");
				oController._DetailJSonModel.setProperty("/Data/Zzjikgbt", "");
				oController._DetailJSonModel.setProperty("/Data/Zzjiktlt", "");
				oController._DetailJSonModel.setProperty("/Data/Zzjikcht", "");
					
			}
		} else {
			oController._oControl = oControl;
			var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
			
			var filterString = "/?$filter=Persa eq '1000' and Actda eq datetime'" + vActda + "T00:00:00' and Ename eq '" + encodeURI(vEname) + "' and Stat1 eq '3'";
				filterString += " and Actty eq '" + _gAuth + "'";
			try{
				oCommonModel.read("/EmpSearchResultSet" + filterString, 
						null, 
						null, 
						false,
						function(oData, oResponse) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {	
									oData.results[i].Chck = false ;
									vEmpSearchResult.EmpSearchResultSet.push(oData.results[i]);
									
								}
							}
						},
						function(Res){
							if(Res.response.body){
								var ErrorMessage = Res.response.body;
								var ErrorJSON = JSON.parse(ErrorMessage);
								oController.Error = "E"; 
								if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
									oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
								}else{
									oController.ErrorMessage =ErrorMessage ;
								}
							}
						}
				);
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.alert(oController.ErrorMessage, {title : "오류"});
					oEvent.getSource().setValue();
					return;
				}
			}catch(Ex){
				
			}
			
			if(vEmpSearchResult.EmpSearchResultSet.length == 1){
				var vContext = vEmpSearchResult.EmpSearchResultSet[0];			
				
				oController._DetailJSonModel.setProperty("/Data/Ename", vContext.Ename);
				oController._DetailJSonModel.setProperty("/Data/Pernr", vContext.Pernr);
				oController._DetailJSonModel.setProperty("/Data/Btrtx", vContext.Btrtx);
				oController._DetailJSonModel.setProperty("/Data/Zzorgtx", vContext.Zzorgtx);
				oController._DetailJSonModel.setProperty("/Data/Zzjikgbt", vContext.Zzjikgbt);
				oController._DetailJSonModel.setProperty("/Data/Zzjiktlt", vContext.Zzjiktlt);
				oController._DetailJSonModel.setProperty("/Data/Zzjikcht", vContext.Zzjikcht);

				// 신청내역 초기화
				oController.onResetDetail(oController);
				
				// 신청대상
				oController.setAbilityList(oController, vContext.Pernr);
				
				// 기본급
//				oController.setBasicPay(oController, vContext.Pernr);
				
			} else {
				oController._vEnamefg = "X";
				oController.displayEmpSearchDialog();
			}
		}
	},
	
	displayEmpSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
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
				sap.m.MessageBox.alert("대상자는 한명만 선택이 가능합니다.");
				return;
			}else if(vIDXs.length < 1){
				sap.m.MessageBox.alert("대상자를 선택하여 주세요.");
				return;
			}

			var vContext = oTable.getContextByIndex(vIDXs[0]).sPath;			
			
			oController._DetailJSonModel.setProperty("/Data/Ename", mEmpSearchResult.getProperty(vContext + "/Ename"));
			oController._DetailJSonModel.setProperty("/Data/Pernr", mEmpSearchResult.getProperty(vContext + "/Pernr"));
			oController._DetailJSonModel.setProperty("/Data/Btrtx", mEmpSearchResult.getProperty(vContext + "/Btrtx"));
			oController._DetailJSonModel.setProperty("/Data/Zzorgtx", mEmpSearchResult.getProperty(vContext + "/Zzorgtx"));
			oController._DetailJSonModel.setProperty("/Data/Zzjikgbt", mEmpSearchResult.getProperty(vContext + "/Zzjikgbt"));
			oController._DetailJSonModel.setProperty("/Data/Zzjiktlt", mEmpSearchResult.getProperty(vContext + "/Zzjiktlt"));
			oController._DetailJSonModel.setProperty("/Data/Zzjikcht", mEmpSearchResult.getProperty(vContext + "/Zzjikcht"));

			// 신청내역 초기화
			oController.onResetDetail(oController);
			
			// 신청대상
			oController.setAbilityList(oController, mEmpSearchResult.getProperty(vContext + "/Pernr"));
			
			// 기본급
//			oController.setBasicPay(oController, mEmpSearchResult.getProperty(vContext + "/Pernr"));
			
		} else {
			sap.m.MessageBox.alert("대상자를 선택하여 주세요.");
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		
		oController._AddPersonDialog.close();
	},
	
		
	// 승인
	onPressSaveP : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();

		oController.onSave(oController , "P");
	},
	
	// 반려
	onPressSaveR : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "R");
	},
	
	// 기안
	onPressSaveS : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "S");
	},
	
	// 재상신
	onPressSaveX : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ExpenditureHA.ZUI5_HR_ExpenditureDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "X");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty){
		var vErrorMessage = "", vUri = "";
		
		if(oController.onValidationData(oController, vPrcty) == false) return;
		
		var onProcess = function(){
			var oModel = sap.ui.getCore().getModel("ZHR_CONTY_SRV");

			var oneData = oController._DetailJSonModel.getProperty("/Data");
			var createData = {};
			
			if(oController._vAppno) createData.Appno = oController._vAppno;
			createData.Pernr = oneData.Pernr;
			createData.Ename = oneData.Ename;
			createData.Concode = oneData.Concode;	// 경조구분
			createData.Conresn = oneData.Conresn;	// 경조사유
			createData.Objps = oneData.Objps;		// 신청대상
			createData.Regno = oneData.Regno;
			createData.Conddate = "\/Date("+ common.Common.getTime(oneData.Conddate)+")\/";	// 증빙상경조일
			createData.Conrdate = "\/Date("+ common.Common.getTime(oneData.Conrdate)+")\/";	// 실제경조일
			createData.ZholDay = oneData.ZholDay;	// 휴가일수
			createData.ZholChk = oneData.ZholChk;	// 휴가신청여부
			if(oneData.ZbacBet) createData.ZbacBet = oneData.ZbacBet.replace(/,/g, "");	// 기본급
			if(oneData.ZetcBet) createData.ZetcBet = oneData.ZetcBet.replace(/,/g, "");	// 제수당
			if(oneData.Basbt)   createData.Basbt = oneData.Basbt.replace(/,/g, "");		// 약정금액
			if(oneData.Payrt)   createData.Payrt = oneData.Payrt.replace(/,/g, "");		// 지급률
			if(oneData.Wokrt)   createData.Wokrt = oneData.Wokrt.replace(/,/g, "");		// 근속률
			if(oneData.ZpayBet) createData.ZpayBet = oneData.ZpayBet.replace(/,/g, "");	// 지급액
			createData.Docyn = oneData.Docyn;		// 증빙서류 제출여부
			createData.Prcty = vPrcty;
			createData.Waers = "KRW";

			var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
			var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
			
			createData.Appernr = vEmpLoginInfo[0].Pernr;	// 신청자 사번
			if(vPrcty == "R") createData.ZappResn = oneData.ZappResn;	// 반려사유
			
			if(vPrcty == "S") {
				var vHtml = oController.makeHtml(oController);
				if(vHtml == "") return;
				else createData.Zhtml = vHtml;
			}
			
			oModel.create("/ExpensesApplSet", createData, null,
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

			// 첨부파일 업로드
			common.AttachFileAction.uploadFile(oController);
			if(oController._vUploadFiles && oController._vUploadFiles.length) {
				oController._vUploadFiles = [];
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
		} else if(!oneData.Conresn){
			sap.m.MessageBox.alert("경조사유를 선택하여 주십시오.", {title : "오류"});
			return false;
		} else if(!oneData.Regno){
			sap.m.MessageBox.alert("신청대상을 선택하여 주십시오.", {title : "오류"});
			return false;
		} else if(!oneData.Conddate){
			sap.m.MessageBox.alert("증빙상 경조일을 입력하여 주십시오.", {title : "오류"});
			return false;
		} else if(!oneData.Conrdate){
			sap.m.MessageBox.alert("실제 경조일을 입력하여 주십시오.", {title : "오류"});
			return false;
		} else if(!oneData.ZbacBet || oneData.ZbacBet.trim() == ""){
			sap.m.MessageBox.alert("기본급을 입력하여 주십시오.", {title : "오류"});
			return false;
		} else if(!oneData.ZetcBet || oneData.ZetcBet.trim() == ""){
			sap.m.MessageBox.alert("제수당을 입력하여 주십시오.", {title : "오류"});
			return false;
		} else if(!oneData.Payrt || oneData.Payrt.trim() == ""){
			sap.m.MessageBox.alert("지급률을 입력하여 주십시오.", {title : "오류"});
			return false;
		} else if(!oneData.Wokrt || oneData.Wokrt.trim() == ""){
			sap.m.MessageBox.alert("근속률을 입력하여 주십시오.", {title : "오류"});
			return false;
		} else if(!oneData.Docyn){
			sap.m.MessageBox.alert("증빙서류 제출여부를 선택하여 주십시오.", {title : "오류"});
			return false;
		}
		
		if(vPrcty == "R" && (!oneData.ZappResn || oneData.ZappResn.trim() == "")){
			sap.m.MessageBox.alert("반려시 반려사유는 필수입니다.", {title : "오류"});
			return false;
		}
		
		var oFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
		if(oController._vUploadFiles.length < 1 && oFileList.getItems().length < 1){ // 첨부파일 필수
			new control.ZNK_SapBusy.oErrorMessage("첨부파일은 필수입니다.");
			return false;
		}
	},
	
	makeHtml : function(oController){
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy/MM/dd"});
		var table_start = "[TABLE_START]";
		var table_end = "[TABLE_END]";	
		var html_url ;
		html_url = "/sap/bc/ui5_ui5/sap/ZUI5_HR_WF_HASS/ZUI5_HR_ExpenditureHA/html/Expenditure.html";		
		
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
		
		var table_html = tHtml.substring(tHtml.indexOf(table_start) + table_start.length, tHtml.indexOf(table_end));
		
		var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				
		tHtml = tHtml.replace("[DATA1]", vDetailData.Ename);
		tHtml = tHtml.replace("[DATA2]", vDetailData.Btrtx + " / " + vDetailData.Zzorgtx);
		tHtml = tHtml.replace("[DATA3]", vDetailData.Zzjikgbt + " / " + vDetailData.Zzjiktlt);
		tHtml = tHtml.replace("[DATA4]", vDetailData.Zzjikcht);
		
		tHtml = tHtml.replace("[ITEM_DATA1]", sap.ui.getCore().byId(oController.PAGEID + "_Conresn").getSelectedItem().getText());   // 경조사유
		tHtml = tHtml.replace("[ITEM_DATA2]", sap.ui.getCore().byId(oController.PAGEID + "_Regno").getSelectedItem().getText());  	// 신청대상
		tHtml = tHtml.replace("[ITEM_DATA3]", dateFormat.format(new Date(vDetailData.Conddate)));  	// 증빙상경조일
		tHtml = tHtml.replace("[ITEM_DATA4]", dateFormat.format(new Date(vDetailData.Conrdate)));  	// 실제경조일
		tHtml = tHtml.replace("[ITEM_DATA5]", vDetailData.ZholDay);  	// 휴가일수
		tHtml = tHtml.replace("[ITEM_DATA6]", vDetailData.ZholChktx);  	// 휴가신청여부
		tHtml = tHtml.replace("[ITEM_DATA7]", vDetailData.ZbacBet);  	// 기본급
		tHtml = tHtml.replace("[ITEM_DATA8]", vDetailData.ZetcBet);  	// 제수당
		tHtml = tHtml.replace("[ITEM_DATA9]", vDetailData.Basbt);  		// 약정금액
		
		// 지급률 : 소수점 뒷자리가 00이면 빼고 보낸다.
		
		var tmp = vDetailData.Payrt.indexOf(".");
		if(tmp != -1){
			if(vDetailData.Payrt.substring((tmp+1)) == "00") tHtml = tHtml.replace("[ITEM_DATA10]", vDetailData.Payrt.substring(0,vDetailData.Payrt.length-3)); 
			else tHtml = tHtml.replace("[ITEM_DATA10]", vDetailData.Payrt); 			
		} else {
			 tHtml = tHtml.replace("[ITEM_DATA10]", vDetailData.Payrt); 		
		}
		
		tHtml = tHtml.replace("[ITEM_DATA11]", vDetailData.Wokrt);  	// 근속률
		tHtml = tHtml.replace("[ITEM_DATA12]", vDetailData.ZpayBet);  	// 지급액
		
		// 증빙자료 제출여부
		if(sap.ui.getCore().byId(oController.PAGEID + "_Docyn").getSelectedItem()){
			tHtml = tHtml.replace("[ITEM_DATA13]", sap.ui.getCore().byId(oController.PAGEID + "_Docyn").getSelectedItem().getText());
		} else {
			tHtml = tHtml.replace("[ITEM_DATA13]", "");  	
		}
		
		return tHtml;
		
	},
	
});