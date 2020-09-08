jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail
	 */

	PAGEID : "ZUI5_HR_MedicalDetailHA",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(), 
	_DialogJsonModel : new sap.ui.model.json.JSONModel(), 
	_MedicalFamilyList : new sap.ui.model.json.JSONModel(), 
	_DialogActionFlag : null ,
	_vPersa : "" ,

	///// 결재자 지정 /////
	_vReqForm : "HR01", // 신청서 유형
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
		var _vAppno ="" , vZappStatAl = "" , vRegno = "", vFamgb = "";
		oController._vAppno = "";
		oController._vReqPernr = "";
		
		if(oEvent) {
			oController._vAppno = _vAppno = oEvent.data.Appno;
			vFamgb = oEvent.data.Famgb;
		}
				
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var oDetailTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
		var vRegno = "", vZappStatAl = "";
		
		oController.BusyDialog.open();
		var oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_SRV");
		
		// 신규,추가 구분
		var oNewyn = sap.ui.getCore().byId(oController.PAGEID + "_Newyn");
		if(oNewyn.getItems().length == 0){
			oNewyn.destroyItems();
			
			var oPath = "/MedicalNewynListSet";
			oModel.read(oPath, null, null, false, 
					function(data,res){
						if(data && data.results.length){
							for(var i=0; i<data.results.length; i++){
								oNewyn.addItem(new sap.ui.core.Item({text : data.results[i].Newyntx, key : data.results[i].Newyn}));
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
		}
		
		var oDetailData = {Data : {}};
		var oDetailTableDatas = {Data : []};
		var oPath = "/MedicalExpenseApplSet/?$filter=Appno eq '" + _vAppno + "' and Famgb eq '" + vFamgb + "'";		
		oModel.read(oPath, 
			    null, null, false, 
				function(data,res){
					if(data && data.results.length){
						var OneData = data.results[0];
						OneData.Payym = OneData.Payym.substring(0,4) + "." + OneData.Payym.substring(4,6) ; 

						// 대상자
						OneData.BOrgtx = OneData.Btext +" / " + OneData.Orgtx ;
						OneData.ZzjikgbtxT = OneData.Zzjikgbtx +" / " + OneData.Zzjiktltx ;
						OneData.Zzjikchtx = OneData.Zzjikchtx;
						// 신청자
						oController._vReqPernr = OneData.Appernr = OneData.Pernr ;
						OneData.ApbrgtxT = OneData.Apbtext +" / " + OneData.Aporgtx ;
						OneData.ApzzjikgbtxT = OneData.Apzzjikgbtx +" / " + OneData.Apzzjiktltx ;
						vZappStatAl = OneData.ZappStatAl ;
						OneData.Pyamt = common.Common.numberWithCommas(OneData.Pyamt);
						OneData.PoamtT = common.Common.numberWithCommas(OneData.Poamt) + " ( " + common.Common.numberWithCommas(OneData.Inamt) + " / "  + common.Common.numberWithCommas(OneData.Blamt) + " / " +  common.Common.numberWithCommas(OneData.Ltamt) +" )" ;
						if(vZappStatAl == "20"){ // 신청 단계 일 경우 질병분류1 은 일반질환(감기등) 로 Default 처리
							OneData.Serids1 = "110" ; 
						} 
						
						oDetailData.Data = OneData;
					}
				},
				function(Res){
//							console.log(Res);
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
			sap.m.MessageBox.alert(oController.ErrorMessage,{
				onClose : function() {
					oController.BusyDialog.close();
					oController.onBack();
				}
			});
			return ;
		}else{
			var vTotalApamt = 0 ; // 납입 총 금액
			var vTotalPyamt = 0; //지원금액 총액
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			
			oModel.read("/MedicalExpenseApplDetailSet/?$filter=Appno eq '" + _vAppno + "'",	 
				    null, null, false, 
					function(data,res){
						if(data && data.results.length){
							for(var i = 0 ; i < data.results.length; i++){
								var OneData = data.results[i];
								OneData.Idx = i + 1;
								OneData.Begda = dateFormat.format(new Date(OneData.Begda)); 
								OneData.Endda = dateFormat.format(new Date(OneData.Endda)); 
								vTotalApamt = vTotalApamt + parseInt(OneData.Apamt) ;
								vTotalPyamt += parseInt(OneData.Pyamt) ;
								OneData.Apamt = common.Common.numberWithCommas(OneData.Apamt);
								OneData.Pyamt = OneData.Pyamt == "0" ? "" : common.Common.numberWithCommas(OneData.Pyamt);
								OneData.EviynT = OneData.Eviyn == "O" ? true : false;
								OneData.ZappStatAl = vZappStatAl;
								oDetailTableDatas.Data.push(OneData);
							}
						}
					},
					function(Res){
//									console.log(Res);
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
				
				oController.BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.alert(oController.ErrorMessage,{
						onClose : function() {
							oController.onBack();
						}
					});
					return ;
				}
				
				// 납부금액 합계
				oDetailData.Data.TotalPyamt =  common.Common.numberWithCommas(vTotalPyamt); 
				oDetailData.Data.TotalApamt =  common.Common.numberWithCommas(vTotalApamt); 
				
				// 신청내역의 진료건수 / 납부금합계
				if(oDetailTableDatas.Data.length > 0){
					oDetailData.Data.ApamtT =  oDetailTableDatas.Data.length  + "건 / " + common.Common.numberWithCommas(vTotalApamt); 
				}else{
					oDetailData.Data.ApamtT = "";
				}
				
				vRegno = oDetailData.Data.Regno ;
				
				oController._DetailTableJSonModel.setData(oDetailTableDatas);				
				oController._DetailJSonModel.setData(oDetailData);	
				
		}

		// 신청 대상 List 조회 및 binding
		oController.onSetFamgb(oController, vRegno);
		
		var oSerids1 = sap.ui.getCore().byId(oController.PAGEID + "_Serids1"); 
		var oSerids2 = sap.ui.getCore().byId(oController.PAGEID + "_Serids2");
		oSerids1.setSelectedKey(oController._DetailJSonModel.getProperty("/Data/Serids1"));
		oSerids2.setSelectedKey(oController._DetailJSonModel.getProperty("/Data/Serids2"));
		
//		var oPyamtRow = sap.ui.getCore().byId(oController.PAGEID + "_PyamtRow");
		
		// 결재 상태값에 따라 Control Property 설정
		if( vZappStatAl == "20" || vZappStatAl == "30" ){
			oController._DetailJSonModel.setProperty("/Data/EnableYn", true);  
			oController._DetailJSonModel.setProperty("/Data/DisplayYn", false); 
			oSerids1.setEnabled(true);
			oSerids2.setEnabled(true);
			oController._DetailJSonModel.setProperty("/Data/WedynV", true); 
			oController._DetailJSonModel.setProperty("/Data/DepynV", true); 
//			oPyamtRow.addStyleClass("L2PDisplayNone");
		}else{
			oController._DetailJSonModel.setProperty("/Data/EnableYn", false); 
			oController._DetailJSonModel.setProperty("/Data/DisplayYn", true); 
			oController._DetailJSonModel.setProperty("/Data/WedynV", false); 
			oController._DetailJSonModel.setProperty("/Data/DepynV", false); 
//			oPyamtRow.removeStyleClass("L2PDisplayNone");
		}
		
		// 결재 상태에 따라 Page Header Text 수정
		
		if( vZappStatAl == "20" ||  vZappStatAl == "30" ){
			oDetailTitle.setText("의료비  신청관리 수정");	
		}else{
			oDetailTitle.setText("의료비  신청관리 조회");
		}

		// 결재선 
		oController.setApprovalLineModel(oController);
		oController.onSetAppl(null);		
		
		var oFamgb = sap.ui.getCore().byId(oController.PAGEID + "_Famgb"); 
		var oDisenm = sap.ui.getCore().byId(oController.PAGEID + "_Disenm"); 
		var oSerids1 = sap.ui.getCore().byId(oController.PAGEID + "_Serids1");
		if(oFamgb) oFamgb.setValueState(sap.ui.core.ValueState.None);
		if(oDisenm) oDisenm.setValueState(sap.ui.core.ValueState.None);
		if(oSerids1) oSerids1.setValueState(sap.ui.core.ValueState.None);
	},

	onAfterShow : function(oEvent) {
		var oController = this ;
		oController.SmartSizing(oEvent);	
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		oDetailTable.removeSelections(true);
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_MedicalHA.ZUI5_HR_MedicalList",
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
	},
	
	convertDate : function(vStartDate){
		if(vStartDate) {
	        var arrDate1 = vStartDate.split("-");
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
	onSetFamgb : function(oController, vRegno){
		var DetailData = oController._DetailJSonModel.getProperty("/Data");
		var oFamgb = sap.ui.getCore().byId(oController.PAGEID + "_Famgb");
		oFamgb.removeAllItems();
	
		var oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_SRV");
		
		var vMedicalFamilyList = { Data : []} ;
		
		if(DetailData && DetailData.Pernr != undefined && DetailData.Pernr != ""){
			var oPath = "/MedicalFamilyListSet?$filter=Pernr eq '"+ DetailData.Pernr + "'";
			oModel.read(
					oPath,
					null,
					null,
					false,
					function(data,res){
						if(data && data.results.length){
							for(var i=0;i<data.results.length;i++){
								oFamgb.addItem(new sap.ui.core.Item({key: data.results[i].Regno, text: data.results[i].Famtx}));
								vMedicalFamilyList.Data.push(data.results[i]);
							}
							if(vRegno == "") oFamgb.setSelectedItem(oFamgb.getFirstItem());
							else oFamgb.setSelectedKey(vRegno);
						}
					},
					function(res){console.log(res);}
			);	
		}
		oController._MedicalFamilyList.setData(vMedicalFamilyList);
		
		var vFamgbT = oFamgb.getSelectedItem().getText();
		oController._DetailJSonModel.setProperty("/Data/FamgbT",vFamgbT);
		
		// 신청대상 변경 Event
		oController.onChangeFamgb();
	},
	// 신청대상 변경 Event
	onChangeFamgb : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		// 부모 건강보험 피부양자 여부 , 자녀 미혼여부 활성화 설정
		var oFamgb = sap.ui.getCore().byId(oController.PAGEID + "_Famgb");
		var vData = oController._MedicalFamilyList.getProperty("/Data"); 
		for(var i = 0; i < vData.length ; i ++){
			if(oFamgb.getSelectedKey() == vData[i].Regno ){
				if(vData[i].DepynChk == "X") {
					
					oController._DetailJSonModel.setProperty("/Data/DepynV", true);
//					oController._DetailJSonModel.setProperty("/Data/WedynV", false); 
				}else{
					oController._DetailJSonModel.setProperty("/Data/DepynV", false);
//					oController._DetailJSonModel.setProperty("/Data/WedynV", false); 
				}
				
				if(vData[i].WedynChk == "X") {
					oController._DetailJSonModel.setProperty("/Data/WedynV", true);
//					oController._DetailJSonModel.setProperty("/Data/DepynV", false);
				}else{
					oController._DetailJSonModel.setProperty("/Data/WedynV", false);
//					oController._DetailJSonModel.setProperty("/Data/DepynV", false);
				}
				
				oController._DetailJSonModel.setProperty("/Data/Famgb", vData[i].Famgb);
				oController._DetailJSonModel.setProperty("/Data/Regno", vData[i].Regno);
			}
		}
		
		
		Famgb
		
		
//		var vZappStatAl =  oController._DetailJSonModel.getProperty("/Data/ZappStatAl");
//		if(vZappStatAl == "" || vZappStatAl =="10"){
//			oController.onGetMedicalLimit(oController);
//		}
		
	},
	
	onCalEndda : function(){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		
		// 신청내역의 진료시작일 ~ 진료종료일
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		if(!vTableData || vTableData.length == 0) return "";
		
		var vBegda = vTableData[0].Begda ;
		var vEndda = vTableData[0].Endda ;
		for(var i = 1 ; i < vTableData.length ; i++){
			if(oController.convertDate(vBegda) > oController.convertDate(vTableData[i].Begda)){
				vBegda = vTableData[i].Begda ;
			}
			if(oController.convertDate(vEndda) < oController.convertDate(vTableData[i].Endda)){
				vEndda = vTableData[i].Endda ;
			}
		}
		
		return vEndda;
	},
	
	// 신청가능 액 조회
	onGetMedicalLimit : function(oController){
		var oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_SRV");
		var DetailData = {};
		var oFamgb = sap.ui.getCore().byId(oController.PAGEID + "_Famgb");
		
		DetailData.PoamtT = "";   //신청가능액
		DetailData.Payym = "" ;  // 지급년월
//		DetailData.Pyamtc = "";  // 지원금 누계
		if(oFamgb.getSelectedKey() == undefined || oFamgb.getSelectedKey().Regno ==  ""){
			return ;
		}
		var vRegno = oFamgb.getSelectedKey().replace("-", "");
		// Prcty : 상세화면
		var oPath = "/MedicalLimitSet?$filter=Prcty eq 'D' and Pernr eq '" + oController._DetailJSonModel.getProperty("/Data/Pernr") + "' and Regno eq '" + vRegno + "'";

		// 대상자 변경 시 신청 상세내역이 있는 경우 진료종료일 계산해서 필터에 종료일 추가
		var oEndda = oController.onCalEndda();
		if(oEndda != ""){
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			oPath += " and Endda eq datetime'" + dateFormat.format(new Date(oEndda)) + "T00:00:00'";
		}
		
		oModel.read(
				oPath,
				null,
				null,
				false,
				function(data,res){
					if(data && data.results.length){
						DetailData.PoamtT = common.Common.numberWithCommas( data.results[0].Poamt) + " ( " + common.Common.numberWithCommas( data.results[0].Inamt) + " / "  + common.Common.numberWithCommas( data.results[0].Blamt) + " / " +  common.Common.numberWithCommas( data.results[0].Ltamt) +" )" ;
						DetailData.Payym = data.results[0].Payym.substring(0,4) + "." + data.results[0].Payym.substring(4,6) ; 
//						DetailData.Pyamtc = data.results[0].Pyamtc ;
						DetailData.Poamt = data.results[0].Poamt ;
						DetailData.Inamt = data.results[0].Inamt ;
						DetailData.Blamt = data.results[0].Blamt ;
					}
				},
				function(res){console.log(res);}
		);	
		
		oController._DetailJSonModel.setProperty("/Data/PoamtT", DetailData.PoamtT); 
		oController._DetailJSonModel.setProperty("/Data/Payym", DetailData.Payym); 
//		oController._DetailJSonModel.setProperty("/Data/Pyamtc", DetailData.Pyamtc); 
		oController._DetailJSonModel.setProperty("/Data/Poamt", DetailData.Poamt); 
		oController._DetailJSonModel.setProperty("/Data/Inamt", DetailData.Inamt);
		oController._DetailJSonModel.setProperty("/Data/Blamt", DetailData.Blamt);
	},
	
	// 상세 내역 Dialog
	_DetailInfoDialog : null,
	onChangeTableDate : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();	
		
		// 신청내역의 진료시작일 ~ 진료종료일
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		var vBegda = vTableData[0].Begda ;
		var vEndda = vTableData[0].Endda ;
		for(var i = 1 ; i < vTableData.length ; i++){
			if(oController.convertDate(vBegda) > oController.convertDate(vTableData[i].Begda)){
				vBegda = vTableData[i].Begda ;
			}
			if(oController.convertDate(vEndda) < oController.convertDate(vTableData[i].Endda)){
				vEndda = vTableData[i].Endda ;
			}
		}
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
		oController._DetailJSonModel.setProperty("/Data/Mdprd", dateFormat.format(new Date(vBegda)) + " ~ " + dateFormat.format(new Date(vEndda)));
		
		if(vEndda){
			// 의료비 신청가능액 조회 odata를 다시 호출한다.
			var oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_SRV")
			var DetailData = {};
			var oFamgb = sap.ui.getCore().byId(oController.PAGEID + "_Famgb");
			
			DetailData.PoamtT = "";   //신청가능액
			DetailData.Payym = "" ;  // 지급년월
			DetailData.Pyamtc = "";  // 지원금 누계
			if(oFamgb.getSelectedKey() == "" || oFamgb.getSelectedKey().Regno ==  ""){
				return ;
			}
			var vRegno = oFamgb.getSelectedKey().replace("-", "");

			var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var oPath = "/MedicalLimitSet?$filter=Prcty eq 'D' and Pernr eq '" + oController._DetailJSonModel.getProperty("/Data/Pernr") + "' and Regno eq '" + vRegno + "'";
				oPath += " and Endda eq datetime'" + dateFormat2.format(new Date(vEndda)) + "T00:00:00'";
			oModel.read(oPath, null, null, false,
					function(data,res){
						if(data && data.results.length){
							DetailData.PoamtT = common.Common.numberWithCommas( data.results[0].Poamt) + " ( " + common.Common.numberWithCommas( data.results[0].Inamt) + " / "  + common.Common.numberWithCommas( data.results[0].Blamt) + " / " +  common.Common.numberWithCommas( data.results[0].Ltamt) +" )" ;
							DetailData.Payym = data.results[0].Payym.substring(0,4) + "." + data.results[0].Payym.substring(4,6) ; 
							DetailData.Pyamtc = data.results[0].Pyamtc ;
							DetailData.Poamt = data.results[0].Poamt ;
							DetailData.Inamt = data.results[0].Inamt ;
							DetailData.Blamt = data.results[0].Blamt ;
						}
					},
					function(res){console.log(res);}
			);	
			
			oController._DetailJSonModel.setProperty("/Data/PoamtT", DetailData.PoamtT); 
			oController._DetailJSonModel.setProperty("/Data/Payym", DetailData.Payym); 
			oController._DetailJSonModel.setProperty("/Data/Pyamtc", DetailData.Pyamtc); 
			oController._DetailJSonModel.setProperty("/Data/Poamt", DetailData.Poamt); 
			oController._DetailJSonModel.setProperty("/Data/Inamt", DetailData.Inamt);
			oController._DetailJSonModel.setProperty("/Data/Blamt", DetailData.Blamt);
		}
	},
	
	onChangePyamt : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();	
		
		// 신청내역의 진료시작일 ~ 진료종료일
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		var vTotalPyamt = 0 ;
		for(var i = 0 ; i < vTableData.length ; i++){
			vTotalPyamt += parseInt(common.Common.removeComma(vTableData[i].Pyamt)) ;   
		}
		vTotalPyamt =  common.Common.numberWithCommas(vTotalPyamt); 
		oController._DetailJSonModel.setProperty("/Data/Pyamt", vTotalPyamt); 
		oController._DetailJSonModel.setProperty("/Data/TotalPyamt", vTotalPyamt); 
		
		
	},
	
	onPressNewRecord : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
	
		var indx = 0 ;
		if(oController._DetailTableJSonModel.getProperty("/Data")){
			idx = oController._DetailTableJSonModel.getProperty("/Data").length ;
		}
		var vData =  { Begda : "" , Endda : "" , Foryn : "02" , Foryntx : "외래", Recpgb : "01" , Recpgbtx : "병원", Idx : idx+ 1, ZappStatAl : oController._DetailJSonModel.getProperty("/Data/ZappStatAl")};		
		oController._DetailTableJSonModel.setProperty("/Data/"+idx +"/", vData); 
		
		// 신청내역의 진료건수 / 납부금합계
		oController._DetailJSonModel.setProperty("/Data/ApamtT", idx+ 1 + " 건"); 
	},	
	
	onPressDelRecord : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var vIDXs = oDetailTable.getSelectedContexts(true);
		var vTotalApamt = 0;
		var vTotalPyamt = 0 ;
		if(vIDXs.length < 1){
			new control.ZNK_SapBusy.oErrorMessage("삭제할 데이터를 선택하여 주십시오.");
			return;
		}
		
		var deleteRecord = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
				var vTData = { Data : []};
				var vCheck = "", vIdx = 1;
	            for(var i = 0 ; i < vTableData.length ; i ++){
	            	vCheck = "";
	            	for(var j = 0; j < vIDXs.length ; j++ ){
	            		if( i == vIDXs[j].sPath.split("/")[2]){
	            			vCheck = "X";
	            			break;
	            		}
	            	}
	            	
	            	if(vCheck == ""){
	            		vTableData[i].Idx = vIdx ;
	            		vTData.Data.push(vTableData[i]);
	            		vIdx++;
	            		vTotalApamt = vTotalApamt + parseInt(common.Common.removeComma(vTableData[i].Apamt)) ;
	            		vTotalPyamt += parseInt(common.Common.removeComma(vTableData[i].Pyamt)) ;   
	            	}
	            	
	            	
	            }
	            oController._DetailTableJSonModel.setData(vTData);
	            
	            // 납부금액 합계
	    		oController._DetailJSonModel.setProperty("/Data/TotalApamt", common.Common.numberWithCommas(vTotalApamt)); 
	    		// 지원금액 합계
	    		oController._DetailJSonModel.setProperty("/Data/Pyamt", common.Common.numberWithCommas(vTotalPyamt)); 
	    		// 신청내역의 진료건수 / 납부금합계
	    		oController._DetailJSonModel.setProperty("/Data/ApamtT", vTData.Data.length + "건"); 
	    		
	    		// 신청내역의 진료시작일 ~ 진료종료일
	    		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
	    		var vBegda = vTableData[0].Begda ;
	    		var vEndda = vTableData[0].Endda ;
	    		for(var i = 1 ; i < vTableData.length ; i++){
	    			if(oController.convertDate(vBegda) > oController.convertDate(vTableData[i].Begda)){
	    				vBegda = vTableData[i].Begda ;
	    			}
	    			if(oController.convertDate(vEndda) < oController.convertDate(vTableData[i].Endda)){
	    				vEndda = vTableData[i].Endda ;
	    			}
	    		}
	    		oController._DetailJSonModel.setProperty("/Data/Mdprd", vBegda + " ~ " + vEndda); 
	    		oDetailTable.removeSelections(true);
			}
		};
		
		sap.m.MessageBox.show("삭제하시겠습니까?", {
			title : "안내",
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : deleteRecord
		});
		
	},
	onChangeApamt : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		var vData = oController._DetailTableJSonModel.getProperty("/Data");
		var vTotalApamt = 0;
		for(var i =0 ; i < vData.length ; i++){
			vTotalApamt += parseInt(common.Common.removeComma(vData[i].Apamt))  ;
		}
		oController._DetailJSonModel.setProperty("/Data/TotalApamt", common.Common.numberWithCommas(vTotalApamt));
		oController._DetailJSonModel.setProperty("/Data/Apamt", vTotalApamt.toString());
		oController._DetailJSonModel.setProperty("/Data/ApamtT", vData.length + "건 / " + common.Common.numberWithCommas(vTotalApamt));
	},
	
	
	
	
	
//	onSaveDialog : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
//		var oController = oView.getController();
//		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
//		var vData = oController._DialogJsonModel.getProperty("/Data");
//		
//		var oForyn = sap.ui.getCore().byId(oController.PAGEID + "_Detail_Foryn");
//		var vForyntx = oForyn.getSelectedItem().getText();
//		var vForyn = oForyn.getSelectedItem().getKey();
//		var oRecpgb = sap.ui.getCore().byId(oController.PAGEID + "_Detail_Recpgb");
//		var vRecpgbtx = oRecpgb.getSelectedItem().getText();
//		var vRecpgb = oRecpgb.getSelectedItem().getKey();
//		
//		if(vData.Begda == ""){
//			new control.ZNK_SapBusy.oErrorMessage("진료시작일자를 입력바랍니다.");
//			return ; 
//		}
//		if(vData.Endda == ""){
//			new control.ZNK_SapBusy.oErrorMessage("진료종료일자를 입력바랍니다.");
//			return;
//		}
//		if(vData.Disenm == ""){
//			new control.ZNK_SapBusy.oErrorMessage("병명을 입력바랍니다.");
//			return;
//		}
//		if(vData.Medorg == ""){
//			new control.ZNK_SapBusy.oErrorMessage("의료기관을 입력바랍니다.");
//			return;
//		}
//		if(vForyn == ""){
//			new control.ZNK_SapBusy.oErrorMessage("의료/외래를 선택하여 주십시오.");
//			return;
//		}
//		if(vRecpgb == ""){
//			new control.ZNK_SapBusy.oErrorMessage("영수증 구분을 선택하여 주십시오.");
//			return;
//		}
//		if(vData.Apamt == ""){
//			new control.ZNK_SapBusy.oErrorMessage("납부금액을 입력바랍니다.");
//			return;
//		}
//		if(vData.Apamt != vData.Pyamt && vData.Notes == ""){
////			new control.ZNK_SapBusy.oErrorMessage("납부금액과 지원금액이 다를 경우 비고를 입력하여 주십시오.");
//			sap.m.MessageBox.alert("납부금액과 지원금액이 다를 경우 비고를 입력하여 주십시오.",{
//				style : "sapUiSizeCompact"
//			});
//			return;
//		}
//		if(common.Common.checkDate(vData.Begda, vData.Endda) == false){
//			new control.ZNK_SapBusy.oErrorMessage("시작일자가 종료일자보다 큽니다.\n날짜를 확인하세요."); 
//			return ;
//		}
//		
//		
//		
//		
//		// 상세내역 Table 에 Data 를 input 한다. 
//
//		// 상세내역 Table 에 Data 를 input 한다. 
//
//		var oDatas = { Data : []} ;
//
//		
//		var oForyn = sap.ui.getCore().byId(oController.PAGEID + "_Detail_Foryn");
//		var vForyntx = oForyn.getSelectedItem().getText();
//		var vForyn = oForyn.getSelectedItem().getKey();
//		var oRecpgb = sap.ui.getCore().byId(oController.PAGEID + "_Detail_Recpgb");
//		var vRecpgbtx = oRecpgb.getSelectedItem().getText();
//		var vRecpgb = oRecpgb.getSelectedItem().getKey();
//		var vTotalApamt = 0, vTotalPyamt = 0 ;
//		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
//		oController._DetailTableJSonModel.setProperty(vData.sPath  + "/Begda", vData.Begda );
//		oController._DetailTableJSonModel.setProperty(vData.sPath + "/Endda", vData.Endda ); 
//        oController._DetailTableJSonModel.setProperty(vData.sPath + "/Disenm", vData.Disenm); 
//        oController._DetailTableJSonModel.setProperty(vData.sPath + "/Medorg", vData.Medorg); 
//        oController._DetailTableJSonModel.setProperty(vData.sPath + "/Foryn", vForyn); 
//        oController._DetailTableJSonModel.setProperty(vData.sPath + "/Recpgb", vRecpgb); 
//        oController._DetailTableJSonModel.setProperty(vData.sPath + "/Foryntx", vForyntx); 
//        oController._DetailTableJSonModel.setProperty(vData.sPath + "/Recpgbtx", vRecpgbtx); 
//        oController._DetailTableJSonModel.setProperty(vData.sPath + "/Apamt", vData.Apamt); 
//        oController._DetailTableJSonModel.setProperty(vData.sPath + "/Pyamt", vData.Pyamt); 
//        oController._DetailTableJSonModel.setProperty(vData.sPath + "/Notes", vData.Notes); 
//        oController._DetailTableJSonModel.setProperty(vData.sPath + "/Eviyn", vData.EviynT == true ? "X" : ""); 
//        oController._DetailTableJSonModel.setProperty(vData.sPath + "/EviynT", vData.EviynT == true ? "O" : ""); 
//        
//		for(var i = 0 ; i < vTableData.length ; i++){
//			vTotalApamt = vTotalApamt + parseInt(common.Common.removeComma(vTableData[i].Apamt)) ;
//			vTotalPyamt = vTotalPyamt + parseInt(common.Common.removeComma(vTableData[i].Pyamt)) ;
//		}
//
//		// 납부금액 합계
//		oController._DetailJSonModel.setProperty("/Data/TotalApamt", common.Common.numberWithCommas(vTotalApamt)); 
//		// 지원금액 합계
//		oController._DetailJSonModel.setProperty("/Data/TotalPyamt", common.Common.numberWithCommas(vTotalPyamt)); 
//		// 신청내역의 진료건수 / 납부금합계
//		oController._DetailJSonModel.setProperty("/Data/ApamtT", oDatas.Data.length + "건  / " + common.Common.numberWithCommas(vTotalApamt)); 
//		
//		// 신청내역의 진료시작일 ~ 진료종료일
//		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
//		var vBegda = vTableData[0].Begda ;
//		var vEndda = vTableData[0].Endda ;
//		for(var i = 1 ; i < vTableData.length ; i++){
//			if(oController.convertDate(vBegda) > oController.convertDate(vTableData[i].Begda)){
//				vBegda = vTableData[i].Begda ;
//			}
//			if(oController.convertDate(vEndda) < oController.convertDate(vTableData[i].Endda)){
//				vEndda = vTableData[i].Endda ;
//			}
//		}
//		oController._DetailJSonModel.setProperty("/Data/Mdprd", vBegda + " ~ " + vEndda); 
//		
//		if(oController._DetailInfoDialog.isOpen()){
//			oController._DetailInfoDialog.close();
//		}
//	},
	
	onPressSaveP : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		oController.onSave(oController , "P");
	},
	
	onPressSaveS : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		oController.onSave(oController , "S");
	},
	
	onPressSaveR : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		oController.onSave(oController , "R");
	},
	onPressSaveX: function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		oController.onSave(oController , "X");
	},
	
	
	// 저장 Process
	onSave : function(oController , vPrcty){ // 처리 구분
		var vZappStatAl	= "";
		var vOData = oController.onValidationData(oController, vPrcty);
		if( vOData == "") return ;
		vOData.Prcty = vPrcty ; 
		
		var vDetailDatas = [];
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		for(var i=0; i< vTableData.length; i++) {
			OneData = {};
			OneData.Appno = vOData.Appno ;
//			OneData.Begda = "\/Date("+ new Date(vTableData[i].Begda).getTime()+")\/"; // 진료시작일자
			OneData.Begda = "\/Date("+ common.Common.getTime(vTableData[i].Begda)+")\/"; // 진료시작일자
			OneData.Endda = "\/Date("+ common.Common.getTime(vTableData[i].Endda)+")\/"; // 진료종료일자	
			OneData.Disenm = vTableData[i].Disenm; //병명
			OneData.Medorg = vTableData[i].Medorg; //의료기관
			OneData.Foryn = vTableData[i].Foryn; // 입원/외래
			OneData.Recpgb = vTableData[i].Recpgb; // 영수증 구분
			OneData.Apamt = common.Common.removeComma(vTableData[i].Apamt); // 납부 금액
			OneData.Waers = "KRW";
			OneData.Pyamt = common.Common.removeComma(vTableData[i].Pyamt); // 지원금액
			OneData.Eviyn = vTableData[i].EviynT == true ? "O" : "" ; // 추가증빙
			OneData.Seqnr =  (i + 1).toString();
			OneData.Notes = vTableData[i].Notes; // 비고
			vDetailDatas.push(OneData);
		}
		
		
		var onProcess = function(){
				var vErrorMessage = "";
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var oModel = sap.ui.getCore().getModel("ZHR_MEDICAL_SRV");
				vOData.MedicalDetailNav = vDetailDatas;
				var vUri = "";
				var oPath = "/MedicalExpenseApplSet";
				oModel.create(
						oPath,
						vOData,
						null,
						function(data,res){
							if(data) {
								oController._DetailJSonModel.setProperty("/Data/Appno", data.Appno); 
								oController._DetailJSonModel.setProperty("/Data/ZappStatAl", data.ZappStatAl); 
								vZappStatAl = data.ZappStatAl;
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
					new control.ZNK_SapBusy.oErrorMessage(vErrorMessage);
					return ;
				}
				
				if(vPrcty == "S"){
					sap.m.MessageBox.show(vCompTxt, {
						title : "안내",
//						onClose : function(){
//							if(vUri != "") window.open(vUri);
//							oController.onBack() ;
//						}
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
//				control.ZNKBusyAccessor.onBusy("S",oController);
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
		var rData = {};
		var vData = oController._DetailJSonModel.getProperty("/Data");
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		var oSerids1 = sap.ui.getCore().byId(oController.PAGEID + "_Serids1");
		var oSerids2 = sap.ui.getCore().byId(oController.PAGEID + "_Serids2"); 
		var oFamgb = sap.ui.getCore().byId(oController.PAGEID + "_Famgb"); 
		var oDisenm = sap.ui.getCore().byId(oController.PAGEID + "_Disenm"); 
		
		if(!vData.Pernr || vData.Pernr == ""){
			new control.ZNK_SapBusy.oErrorMessage("신청자 사원번호가 입력되지 않았습니다.");
			return "";
		}
		if(!vData.Regno || vData.Regno == ""){
			new control.ZNK_SapBusy.oErrorMessage("신청 대상이 선택되지 않았습니다.");
			oFamgb.setValueState(sap.ui.core.ValueState.Error);
			return "";
		}
		if(!vData.Disenm || vData.Disenm == ""){
			new control.ZNK_SapBusy.oErrorMessage("병명이 입력 되지 않았습니다.");
			oDisenm.setValueState(sap.ui.core.ValueState.Error);
			return "";
		}
		if(!vTableData || vTableData.length < 1){
			new control.ZNK_SapBusy.oErrorMessage("상세내역을 입력하시기 바랍니다.");
			return "";
		}
		
		if( vPrcty == "R" && ( !vData.ZappResn || vData.ZappResn == "")){ // 반려일 경우 반려사유 필수
			new control.ZNK_SapBusy.oErrorMessage("반려시 반려사유는 필수 입니다.");
			return "";
		}
		
		// 상세내역 Data Check
		if( vPrcty != "R" ){
			for(var i = 0 ; i < vTableData.length ; i++){
				if(vTableData[i].Pyamt == ""){
					new control.ZNK_SapBusy.oErrorMessage("지원금액을 입력하시기 바랍니다.");
					return "" ; 
				}
				
				if(vTableData[i].Apamt != vTableData[i].Pyamt && vTableData[i].Notes == ""){
					new control.ZNK_SapBusy.oErrorMessage("납부금액과 지원금액이 다를 경우 비고를 입력하여 주십시오.");
					return "";
				}
				
				if(vTableData[i].Disenm == ""){
					new control.ZNK_SapBusy.oErrorMessage("병명을 입력바랍니다.");
					return "";
				}
				if(vTableData[i].Medorg == ""){
					new control.ZNK_SapBusy.oErrorMessage("의료기관을 입력바랍니다.");
					return "";
				}
				if(vTableData[i].Foryn == ""){
					new control.ZNK_SapBusy.oErrorMessage("의료/외래를 선택하여 주십시오.");
					return "";
				}
				if(vTableData[i].Recpgb == ""){
					new control.ZNK_SapBusy.oErrorMessage("영수증 구분을 선택하여 주십시오.");
					return "";
				}
				if(vTableData[i].Apamt == ""){
					new control.ZNK_SapBusy.oErrorMessage("납부금액을 입력바랍니다.");
					return "";
				}
				
				if(common.Common.checkDate(vTableData[i].Begda, vTableData[i].Endda) == false){
					new control.ZNK_SapBusy.oErrorMessage("시작일자가 종료일자보다 큽니다.\n날짜를 확인하세요."); 
					return "";
				}
			}
			if(oSerids1.getSelectedKey() == ""){
				new control.ZNK_SapBusy.oErrorMessage("질병구분1을 입력하시기 바랍니다.");
				oSerids1.setValueState(sap.ui.core.ValueState.Error);
				return "";
			}
			
		}
		
		//전자결재 html 생성 - 기안 / 반려
		if(vPrcty == "S" || vPrcty == "R"){
			rData.Zhtml = oController.makeHtml(oController);
			if(rData.Zhtml == "") return "";		
		}
		
		// 진료 최초 시작일 , 최후 종료일 조회
		var vBegda = vTableData[0].Begda ;
		var vEndda = vTableData[0].Endda ;
		for(var i = 0 ; i < vTableData.length ; i++){
			if(i == 0){
				vBegda = vTableData[0].Begda ;
				vEndda = vTableData[0].Endda ;
			}else{
				if(oController.convertDate(vBegda) > oController.convertDate(vTableData[i].Begda)){
					vBegda = vTableData[i].Begda ;
				}
				if(oController.convertDate(vEndda) < oController.convertDate(vTableData[i].Endda)){
					vEndda = vTableData[i].Endda ;
				}
			}
			if(vTableData[i].Begda == ""){
				new control.ZNK_SapBusy.oErrorMessage("진료시작일자를 입력바랍니다.");
				return ""; 
			}
			if(vTableData[i].Endda == ""){
				new control.ZNK_SapBusy.oErrorMessage("진료종료일자를 입력바랍니다.");
				return "";
			}
		}
		
		rData.Begda =    "\/Date("+ common.Common.getTime(vBegda)+")\/"; // 진료시작일자
		rData.Endda =	"\/Date("+ common.Common.getTime(vEndda)+")\/"; // 진료 종료일자
		rData.Ename =  vData.Ename; // 대상자 성명
		rData.Pernr =  vData.Pernr; // 대상자
		rData.Regno =  vData.Regno; // 신청대상
		rData.Appno =  vData.Appno; // 신청번호
		rData.Disenm =  vData.Disenm; // 병명
		rData.Symptn =  vData.Symptn; // 구체적 증상
		rData.Famgb =  vData.Famgb ; // 가족구분
		rData.Payym =  vData.Payym.replace(".", ""); // 지급년월
		rData.Apamt = common.Common.removeComma(vData.Apamt);// 신청금 합계
		rData.Poamt =  common.Common.removeComma(vData.Poamt);// 신청가능금액
		rData.Inamt =  common.Common.removeComma(vData.Inamt); // 신청중금액
		rData.Blamt =  common.Common.removeComma(vData.Blamt); // 잔여한도
		rData.Depyn =  vData.Depyn == true || vData.Depyn == "X" ? "X" : ""; // 부모 건강보험 피부양자 여부
		rData.Wedyn =  vData.Wedyn == true || vData.Wedyn == "X" ? "X" : ""; // 자녀 미혼여부
		rData.Newyn =  vData.Newyn;// 신규구분
		rData.Serids1 =  oSerids1.getSelectedKey(); // 질병구분1
		rData.Serids2 =  oSerids2.getSelectedKey(); // 질병구분2
		rData.ZappResn =  vData.ZappResn; // 반려사유
		rData.Waers = "KRW";
		
		if(vPrcty == "S"){ // 기안일 경우 신청자를 로그인 사번 전송
			var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");  
			var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
			rData.Appernr =  vEmpLoginInfo[0].Pernr; // 신청자
		}
		
		// 대상자와의 관계
		var vMedicalFamilyList = oController._MedicalFamilyList.getProperty("/Data");
		for(var i = 0 ; i < vMedicalFamilyList.length ; i ++){
			if(vData.Regno == vMedicalFamilyList[i].Regno){
				rData.Famgb = vMedicalFamilyList[i].Famgb ;
				break;
			}	
		}
		
		if(oFamgb) oFamgb.setValueState(sap.ui.core.ValueState.None);
		if(oDisenm) oDisenm.setValueState(sap.ui.core.ValueState.None);
		if(oSerids1) oSerids1.setValueState(sap.ui.core.ValueState.None);

		return rData;
	},
	
	makeHtml : function(oController){
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy/MM/dd"});
		var table_start = "[TABLE_START]";
		var table_end = "[TABLE_END]";	
		
		var html_url ;
		html_url = "/sap/bc/ui5_ui5/sap/ZUI5_HR_WF_HASS/ZUI5_HR_MedicalHA/html/medical.html";		
		
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
		var oSerids1 = sap.ui.getCore().byId(oController.PAGEID + "_Serids1");
		var oSerids2 = sap.ui.getCore().byId(oController.PAGEID + "_Serids2"); 
		var removeStart = "[REMOVE_ROW_START]";
		var removeEnd = "[REMOVE_ROW_END]";	
		/* removeDataRow 처리 */
		if(vDetailData.Famgb == "10"){
			item_replace = tHtml.substring(tHtml.indexOf(removeStart), tHtml.indexOf(removeEnd) + removeEnd.length);
			tHtml = tHtml.replace(item_replace, "");
		}else{
			tHtml = tHtml.replace(removeStart, "");
			tHtml = tHtml.replace(removeEnd, "");
		}
		
		// 대상자
		tHtml = tHtml.replace("[DATA1]",   vDetailData.Ename); 
		tHtml = tHtml.replace("[DATA2]",   checkText(vDetailData.BOrgtx)); 
		tHtml = tHtml.replace("[DATA3]",   checkText(vDetailData.ZzjikgbtxT)); 
		tHtml = tHtml.replace("[DATA4]",   checkText(vDetailData.Zzjikchtx)); 
		
		tHtml = tHtml.replace("[ITEM_DATA1]",   vDetailData.FamgbT);        //신청대상
//		tHtml = tHtml.replace("[ITEM_DATA2]",   vDetailData.Mdprd);         // 진료기간
		// 진료기간 dateformat 바꾸기
		var oMdprd = vDetailData.Mdprd.trim().split("~");
		tHtml = tHtml.replace("[ITEM_DATA2]", dateFormat.format(new Date(oMdprd[0])) + " ~ " + dateFormat.format(new Date(oMdprd[1])));
		
		tHtml = tHtml.replace("[ITEM_DATA3]",   vDetailData.ApamtT);        //진료건수 / 납부금합계
//		tHtml = tHtml.replace("[ITEM_DATA4]",   vDetailData.Payym);         // 지급년월
		var oPayym = vDetailData.Payym.split(".");
		tHtml = tHtml.replace("[ITEM_DATA4]",  	oPayym[0] + "/" + oPayym[1]);
		
		tHtml = tHtml.replace("[ITEM_DATA5]",   vDetailData.Newyntx);        // 신규/추가 구분
		tHtml = tHtml.replace("[ITEM_DATA6]",   vDetailData.Pyamt);		//지원금액 합계 
		
		
		tHtml = tHtml.replace("[ITEM_DATA7]",   vDetailData.Depyn == true || vDetailData.Depyn == "X" ? "예" : "아니오" );        //부모 건강보험 피부양자 여부
		tHtml = tHtml.replace("[ITEM_DATA8]",   vDetailData.Wedyn == true || vDetailData.Wedyn == "X" ? "예" : "아니오");		  // 자녀 미혼여부
		tHtml = tHtml.replace("[ITEM_DATA9]",   common.Common.numberWithCommas(vDetailData.Poamt));		  // 신청가능액
		tHtml = tHtml.replace("[ITEM_DATA9_1]",   common.Common.numberWithCommas(vDetailData.Inamt) + " / " + common.Common.numberWithCommas(vDetailData.Blamt) + " / " +  common.Common.numberWithCommas(vDetailData.Ltamt) );         // 신청중 / 잔여 / 한도 
		tHtml = tHtml.replace("[ITEM_DATA10]",  checkText(vDetailData.Disenm));		 // 병명
		tHtml = tHtml.replace("[ITEM_DATA11]",  checkText(vDetailData.Symptn));         // 구체적 증상
		tHtml = tHtml.replace("[ITEM_DATA12]",  oSerids1.getSelectedItem().getText());	     // 질병분류1	
		tHtml = tHtml.replace("[ITEM_DATA13]",  oSerids2.getSelectedItem() == null || oSerids2.getSelectedKey() == "" ? "" : oSerids2.getSelectedItem().getText());	     // 질병분류2	
		tHtml = tHtml.replace("[ITEM_DATA14]",  vDetailData.TotalApamt);	     // 납부금합계	
		tHtml = tHtml.replace("[ITEM_DATA15]",  vDetailData.TotalPyamt);	     // 지원금합계
		
		var item_data = "";
		var tmp_item_html ="";
		
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		
		item_data = "";
		tmp_item_html ="";
		item_replace = "";
		for(var i=0 ; i< vTableData.length ; i++ ) {
			tmp_item_html = table_html;
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM1]", vTableData[i].Idx );
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM2]", dateFormat.format(new Date(vTableData[i].Begda)) );
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM3]", dateFormat.format(new Date(vTableData[i].Endda)) );
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM4]", checkText(vTableData[i].Disenm));	// 병명
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM5]", checkText(vTableData[i].Medorg));	// 의료기관
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM6]", vTableData[i].Foryntx );
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM7]", vTableData[i].Recpgbtx );
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM8]", vTableData[i].Apamt );
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM9]", vTableData[i].Pyamt ? vTableData[i].Pyamt : ""); 
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM10]", checkText(vTableData[i].Notes));	// 비고
			item_data += tmp_item_html;
		}
	
		item_replace = tHtml.substring(tHtml.indexOf(table_start), tHtml.indexOf(table_end) + table_end.length);
		tHtml = tHtml.replace(item_replace, item_data);
		return tHtml;
		
	},
	
	openDocno : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
		var oController = oView.getController();
		var vUri = oController._DetailJSonModel.getProperty("/Data/Zurl");
		if(vUri && vUri != "")  window.open(vUri);
	},
	
	onKeyUp1 : function(oEvent){
		if(oEvent.which == 9) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
			var oController = oView.getController();
			jQuery.sap.delayedCall(0, this, function() {
				var oDetailInfoEndda = sap.ui.getCore().byId(oController.PAGEID + "_DetailInfoEndda");
				oDetailInfoEndda.focus();
				});
		}
	},
	
	onKeyUp2 : function(oEvent){
		if(oEvent.which == 9) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
			var oController = oView.getController();
			jQuery.sap.delayedCall(0, this, function() {
				var oDetailInfoDisenm = sap.ui.getCore().byId(oController.PAGEID + "_DetailInfoDisenm");
				oDetailInfoDisenm.focus();
				});
		}
	},
	
	onKeyUp3 : function(oEvent){
		if(oEvent.which == 9) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
			var oController = oView.getController();
			jQuery.sap.delayedCall(0, this, function() {
				var oDetailInfoMedorg = sap.ui.getCore().byId(oController.PAGEID + "_DetailInfoMedorg");
				oDetailInfoMedorg.focus();
				});
		}
	},
	
	onKeyUp4 : function(oEvent){
		if(oEvent.which == 9) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
			var oController = oView.getController();
			jQuery.sap.delayedCall(0, this, function() {
				var oDetail_Foryn = sap.ui.getCore().byId(oController.PAGEID + "_Detail_Foryn");
				oDetail_Foryn.focus();
				});
		}
	},
	
	onKeyUp5 : function(oEvent){
		if(oEvent.which == 9) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
			var oController = oView.getController();
			jQuery.sap.delayedCall(0, this, function() {
				var oDetail_Recpgb = sap.ui.getCore().byId(oController.PAGEID + "_Detail_Recpgb");
				oDetail_Recpgb.focus();
				});
		}
	},
	
	onKeyUp6 : function(oEvent){
		if(oEvent.which == 9) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
			var oController = oView.getController();
			jQuery.sap.delayedCall(0, this, function() {
				var oDetailInfoApamt = sap.ui.getCore().byId(oController.PAGEID + "_DetailInfoApamt");
				oDetailInfoApamt.focus();
				});
		}
	},
	
	onKeyUp7 : function(oEvent){
		if(oEvent.which == 9) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
			var oController = oView.getController();
			jQuery.sap.delayedCall(0, this, function() {
				var oDetailInfoPyamt = sap.ui.getCore().byId(oController.PAGEID + "_DetailInfoPyamt");
				oDetailInfoPyamt.focus();
				});
		}
	},
	
	onKeyUp8 : function(oEvent){
		if(oEvent.which == 9) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
			var oController = oView.getController();
			jQuery.sap.delayedCall(0, this, function() {
				var oDetailInfoEviyn = sap.ui.getCore().byId(oController.PAGEID + "_DetailInfoEviyn");
				oDetailInfoEviyn.focus();
				});
		}
	},
	
	onKeyUp9 : function(oEvent){
		if(oEvent.which == 9) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
			var oController = oView.getController();
			jQuery.sap.delayedCall(0, this, function() {
				oDetailInfoNotes.focus();
				});
		}
	},

	// 결재자 정보
	setApprovalLineModel : function(oController){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
		
		var vData = {Data : []};
		
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		var oPath = "/ApprovalLineApplSet?$filter=ZreqForm eq 'RF01' and ZreqPernr1 eq '" + oController._vReqPernr + "'";
		
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_MedicalHA.ZUI5_HR_MedicalDetail");
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
		var oPath = "/ReferenceLineSet?$filter=Pernr eq '" + vPernr + "' and Prvline eq '" + vPrvline + "' and ZreqForm eq 'RF01'";
		
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

});