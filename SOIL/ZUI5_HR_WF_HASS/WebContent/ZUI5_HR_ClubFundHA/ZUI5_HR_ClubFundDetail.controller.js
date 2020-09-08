//jQuery.sap.require("control.BusyIndicator");
//jQuery.sap.require("control.ZNKBusyAccessor");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.ZNK_ApprovalLine");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");

sap.ui.controller("ZUI5_HR_ClubFundHA.ZUI5_HR_ClubFundDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ClubFundHA.ZUI5_HR_ClubFundDetail
	 */

	PAGEID : "ZUI5_HR_ClubFundDetail",
	
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(), 
	_DialogJsonModel : new sap.ui.model.json.JSONModel(), 
	_FooterJSONModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	
	_vAppno : "",
	
	_vFromPage : "",
	
	_vEnamefg : "",
	
	_ObjList : [],
	
	_vUploadFiles : null,	// 첨부파일
	_vZworktyp : "HR08",
	
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
		oController._FooterJSONModel.setData(null);

		oController.BusyDialog.open();
		
		var oModel = sap.ui.getCore().getModel("ZHR_CLUB_SRV");
		var oDetailTableDatas = {Data : []}, oFooterData = {Data : []};
		var oDetailData = {Data : {}};
		 
		var vErrorMessage = "", vError = "";

		var vTotalMemfee = 0;	// 회비 합계
		
		var oPath = "/ClubSupportFundHeadSet?$filter=Appno eq '" + vAppno + "' and Prcty eq 'D'";
		var createData = {};
			createData.Appno = vAppno;
			createData.ClubSupportFundDetailSet = [];
			createData.Prcty = "D";
			
		oModel.create("/ClubSupportFundHeadSet", createData, null,
				function(data,res){
					if(data) {
						
						vZappStatAl = data.ZappStatAl;
						
						// MessageStrip 설정
						var oMessageStrip = sap.ui.getCore().byId(oController.PAGEID + "_Zclubtx");
						oMessageStrip.setText(data.Zclubtx + " 행사에 따른 지원금 인출을 아래와 같이 요청합니다.");

						data.Evtdt = dateFormat.format(data.Evtdt);
						data.Partip = parseInt(data.Partip) + "";
						
						data.SfundC2 = data.SfundC;
						data.BaltrC2 = data.BaltrC;
						
						oDetailData.Data = data;	
						
						if(data.ClubSupportFundDetailSet && data.ClubSupportFundDetailSet.results){
							for(var a=0; a<data.ClubSupportFundDetailSet.results.length; a++){
								var vTotal = 0;
								
								data.ClubSupportFundDetailSet.results[a].Idx = (a+1) + "";
								data.ClubSupportFundDetailSet.results[a].Calcontx = data.ClubSupportFundDetailSet.results[a].Calcon;
								
								if(data.ClubSupportFundDetailSet.results[a].SfundA) vTotal += Number(data.ClubSupportFundDetailSet.results[a].SfundA);
								if(data.ClubSupportFundDetailSet.results[a].SfundB) vTotal += Number(data.ClubSupportFundDetailSet.results[a].SfundB);
								if(data.ClubSupportFundDetailSet.results[a].SfundC) vTotal += Number(data.ClubSupportFundDetailSet.results[a].SfundC);
								
								if(data.ClubSupportFundDetailSet.results[a].Memfee) vTotalMemfee += Number(data.ClubSupportFundDetailSet.results[a].Memfee);
								
								data.ClubSupportFundDetailSet.results[a].Memfee = common.Common.numberWithCommas(data.ClubSupportFundDetailSet.results[a].Memfee);
								
								data.ClubSupportFundDetailSet.results[a].SfundA = common.Common.numberWithCommas(data.ClubSupportFundDetailSet.results[a].SfundA);
								data.ClubSupportFundDetailSet.results[a].SfundB = common.Common.numberWithCommas(data.ClubSupportFundDetailSet.results[a].SfundB);
								data.ClubSupportFundDetailSet.results[a].SfundC = common.Common.numberWithCommas(data.ClubSupportFundDetailSet.results[a].SfundC);
								
								data.ClubSupportFundDetailSet.results[a].Total = common.Common.numberWithCommas(vTotal + "");
								
								data.ClubSupportFundDetailSet.results[a].editable = false;
							}
							
							oDetailTableDatas.Data = data.ClubSupportFundDetailSet.results;
						}
						
					} 
				},
				function (oError) {
			    	var Err = {};
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
		oController._DetailTableJSonModel.setData(oDetailTableDatas);
		oController._FooterJSONModel.setData(oFooterData);
		
		// 회비 합계
		oController._FooterJSONModel.setProperty("/Data/TotalMemfee", (vTotalMemfee + ""));
		
		sap.ui.getCore().byId(oController.PAGEID + "_BasisTable").setVisibleRowCount(oDetailTableDatas.Data.length);
		
		// 계산
		oController.onCalculate(oController, vZappStatAl);
		
		// 첨부파일 
		common.AttachFileAction.oController = oController;
		common.AttachFileAction.setAttachFile(oController);
		common.AttachFileAction.refreshAttachFileList(oController);	
		
		// 결재 상태에 따라 Page Header Text 수정		
		if(vZappStatAl == "" || !vZappStatAl){
			oPortalTitle.setText("인포멀그룹 지원금 인출 신청");	
		} else if(vZappStatAl == "10"){
			oPortalTitle.setText("인포멀그룹 지원금 인출 신청 수정");
		} else {
			oPortalTitle.setText("인포멀그룹 지원금 인출 신청 조회");
		}		
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ClubFundHA.ZUI5_HR_ClubFundDetail");
		var oController = oView.getController();
		
		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_ClubFundHA.ZUI5_HR_ClubFundList",
			      data : { }
				}
			);	
		}
		
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ClubFundHA.ZUI5_HR_ClubFundDetail");
		var oController = oView.getController();
	},
	
	// 주무부서 기재사항 - 당행사 지원 수정 시 지원 후 잔액을 다시 계산한다.
	onChangeSuptr : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ClubFundHA.ZUI5_HR_ClubFundDetail");
		var oController = oView.getController();
		
		var vField = ["A", "B", "C"];
		var vId = oEvent.getSource().getCustomData()[0].getValue();
		
		var vSuptrTotal = 0, vTotal = 0;
		
		for(var i=0; i<vField.length; i++){			
			if(vId == vField[i]){	// 지원 후 잔액까지 계산해서 값을 설정한다.
				var tmp = oEvent.getSource().getValue().replace(/,/g, "");	//당행사지원
				oController._DetailJSonModel.setProperty("/Data/Suptr"+vId, tmp);
				tmp = Number(tmp);
				
				vSuptrTotal = vSuptrTotal + tmp;
				
				// 지원 후 잔액 계산
				var tmp2 = ""; // 현재잔액
				if(vId == "C"){
				   // 기타지원금인 경우 지원금예산과 현재잔액을 기존 지원금예산(SfundC)랑 당행사지원(SuptrC)을 더해서 설정해준다.
//					var vSfundC2 = Number(oController._DetailJSonModel.getProperty("/Data/SfundC")) + tmp;
//					oController._DetailJSonModel.setProperty("/Data/SfundC2", vSfundC2);
//					oController._DetailJSonModel.setProperty("/Data/BaltrC2", vSfundC2);	

					// ㄱㅣ타지원금 현재잔액을 당행사지원이랑 같게한다.
					oController._DetailJSonModel.setProperty("/Data/BaltrC", oController._DetailJSonModel.getProperty("/Data/SuptrC"));	
					oController._DetailJSonModel.setProperty("/Data/BaltrC2", oController._DetailJSonModel.getProperty("/Data/SuptrC"));	
					
					// 기타지원금 기존에 있던 지원금예산에 입력된 당행사지원값을 더해서 보여준다.
					var vSfundC = oController._DetailJSonModel.getProperty("/Data/SfundC");
					var oSfundC = Number(vSfundC) + tmp;
					oController._DetailJSonModel.setProperty("/Data/SfundC2", oSfundC);	
										
					tmp2 = oController._DetailJSonModel.getProperty("/Data/SuptrC");			   
					   
				} else tmp2 = oController._DetailJSonModel.getProperty("/Data/Baltr" + vId);
					   tmp2 = Number(tmp2);
					
				var tmp3 = tmp2 - tmp;
				oController._DetailJSonModel.setProperty("/Data/Total" + vId, (tmp3 + ""));
			} else {
				if(oController._DetailJSonModel.getProperty("/Data/Suptr" + vField[i])){
					var tmp = oController._DetailJSonModel.getProperty("/Data/Suptr" + vField[i]);
						tmp = Number(tmp.replace(/,/g, ""));
					
					vSuptrTotal = vSuptrTotal + tmp;
				}
			}			
		}
		
		oController._DetailJSonModel.setProperty("/Data/SuptrT", (vSuptrTotal + ""));
		
		
		// 전체 합계
		var vTotalA = oController._DetailJSonModel.getProperty("/Data/TotalA");
		var vTotalB = oController._DetailJSonModel.getProperty("/Data/TotalB");
		var vTotalC = oController._DetailJSonModel.getProperty("/Data/TotalC");
		
		var vTotalT = Number(vTotalA) + Number(vTotalB) + Number(vTotalC);
		oController._DetailJSonModel.setProperty("/Data/TotalT", (vTotalT + ""));
		
		oController.onRecalculate(oController, oController._DetailJSonModel.getProperty("/Data/ZappStatAl"));
	},
	
	// 계산근거 Popover
	onEvidence : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ClubFundHA.ZUI5_HR_ClubFundDetail");
		var oController = oView.getController();
		
		var vIdx = oEvent.getSource().getCustomData()[0].getValue() * 1;
			vIdx = vIdx - 1;
		
		var vDetailData = oController._DetailTableJSonModel.getProperty("/Data/" + vIdx);

		var oneData = {};
		$.each(vDetailData, function(key, value){ 
			eval("oneData." + key + " = value;");
		});
		
		if(!oController._EvidencePopover) {
			oController._EvidencePopover = sap.ui.jsfragment("ZUI5_HR_ClubFundHA.fragment.EvidencePopover", oController);
			oView.addDependent(oController._EvidencePopover);
		}
		
		var oPopover = sap.ui.getCore().byId(oController.PAGEID + "_EvidencePopover");
		var oJSONModel = oPopover.getModel();
		var vData = {Data : []};
			vData.Data.Idx = vIdx;
			vData.Data.editable = oneData.editable;
			if(vDetailData.Calcon) vData.Data.Calcon = oneData.Calcon;
		
			oJSONModel.setData(vData);
		
		oController._EvidencePopover.openBy(oEvent.getSource());
	},
	
	// 테이블 데이터 합계들을 계산한다.
	onCalculate : function(oController, vZappStatAl){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ClubFundHA.ZUI5_HR_ClubFundDetail");
		var oController = oView.getController();
		
		var vTotal = 0, vABCTotal = 0;
		var vField = ["A", "B", "C"];
		
		var vDetailData = oController._DetailTableJSonModel.getProperty("/Data");
		
		// 각 지원금 별 합계
		for(var i=0; i<vField.length; i++){
			vTotal = 0;
			
			for(var j=0; j<vDetailData.length; j++){
				if(oController._DetailTableJSonModel.getProperty("/Data/" + j + "/Sfund" + vField[i])){
					var vTmp = Number(oController._DetailTableJSonModel.getProperty("/Data/"+j+"/Sfund"+vField[i]).replace(/,/g, ""));
					
					vTotal = vTotal + vTmp;
				}
			}
			oController._FooterJSONModel.setProperty("/Data/Total" + vField[i], (vTotal + ""));
//			oController._DetailJSonModel.setProperty("/Data/Suptr" + vField[i], (vTotal + ""));
			
		}
		
		// 지원금 총액의 합계
		for(var i=0; i<vDetailData.length; i++){
			if(oController._DetailTableJSonModel.getProperty("/Data/" + i + "/Total")){
				var vTmp = Number(oController._DetailTableJSonModel.getProperty("/Data/" + i + "/Total").replace(/,/g, ""));
				
				vABCTotal = vABCTotal + vTmp;
			}
		}
		oController._FooterJSONModel.setProperty("/Data/TotalT", (vABCTotal + ""));
		
		oController.onRecalculate(oController, vZappStatAl);
	},
	
	// 주무부서 기재사항의 합계를 다시 계산한다.
	onRecalculate : function(oController, vZappStatAl){

		// 당행사 지원
		var vSuptrA = oController._DetailJSonModel.getProperty("/Data/SuptrA");
		var vSuptrB = oController._DetailJSonModel.getProperty("/Data/SuptrB");
		var vSuptrC = oController._DetailJSonModel.getProperty("/Data/SuptrC");
//		var vSuptrA = "0";
//		var vSuptrB = "0";
//		var vSuptrC = "0";

		// 당행사 지원의 합계
		var vSuptrT = 0;
		if(vSuptrA) vSuptrT += Number(vSuptrA);
		if(vSuptrB) vSuptrT += Number(vSuptrB);
		if(vSuptrC) vSuptrT += Number(vSuptrC);
		
		oController._DetailJSonModel.setProperty("/Data/SuptrT", (vSuptrT + ""));
		
		// 현재 잔액
		var vBaltrA = oController._DetailJSonModel.getProperty("/Data/BaltrA");
		var vBaltrB = oController._DetailJSonModel.getProperty("/Data/BaltrB");
//		var vBaltrC = oController._DetailJSonModel.getProperty("/Data/BaltrC");
		
		var vSfundC = "", vBaltrC = "", vSuptrC = "";
		if(vZappStatAl == "50"){
			// 결재상태가 승인인 경우 odata에서 넘어온 그대로 화면에 표시함.
			vSfundC = oController._DetailJSonModel.getProperty("/Data/SfundC");
			// ㄱㅣ타지원금 현재잔액을 당행사지원이랑 같게한다.
			oController._DetailJSonModel.setProperty("/Data/BaltrC", oController._DetailJSonModel.getProperty("/Data/SuptrC"));	
			oController._DetailJSonModel.setProperty("/Data/BaltrC2", oController._DetailJSonModel.getProperty("/Data/SuptrC"));
			vBaltrC = oController._DetailJSonModel.getProperty("/Data/BaltrC");	
			
		} else {
//			// 결재상태가 승인이 아닌경우 기타지원금(C) : 지원금예산, 현재잔액 = 지원금예산 + 당행사지원 값으로 수정함.
//			var tmp = Number(oController._DetailJSonModel.getProperty("/Data/SfundC")) + Number(vSuptrC);
//			
//			oController._DetailJSonModel.setProperty("/Data/SfundC2", (tmp + ""));
////			oController._DetailJSonModel.setProperty("/Data/BaltrC2", (tmp + ""));		
//
//			vSfundC = oController._DetailJSonModel.getProperty("/Data/SfundC2");
//			vBaltrC = oController._DetailJSonModel.getProperty("/Data/BaltrC2");
			
			// ㄱㅣ타지원금 현재잔액을 당행사지원이랑 같게한다.
			oController._DetailJSonModel.setProperty("/Data/BaltrC", oController._DetailJSonModel.getProperty("/Data/SuptrC"));	
			oController._DetailJSonModel.setProperty("/Data/BaltrC2", oController._DetailJSonModel.getProperty("/Data/SuptrC"));	
			
			// 기타지원금 기존에 있던 지원금예산에 입력된 당행사지원값을 더해서 보여준다.
			var vSfundC = oController._DetailJSonModel.getProperty("/Data/SfundC");	// 지원금예산 기타지원금
				vSuptrC = oController._DetailJSonModel.getProperty("/Data/SuptrC");	// 당행사지원 기타지원금
			var tmp = Number(vSfundC) + Number(vSuptrC);
			oController._DetailJSonModel.setProperty("/Data/SfundC2", tmp + "");	
			
			
			vBaltrC = oController._DetailJSonModel.getProperty("/Data/BaltrC2");
			
			// 현재잔액의 합계
			var vBaltrT = Number(vBaltrA) + Number(vBaltrB) + Number(vBaltrC);
			oController._DetailJSonModel.setProperty("/Data/BaltrT", (vBaltrT + ""));	
		}		
		
		// 지원금예산 합계
		var vSfundA = oController._DetailJSonModel.getProperty("/Data/SfundA");
		var vSfundB = oController._DetailJSonModel.getProperty("/Data/SfundB");
		var vSfundC = oController._DetailJSonModel.getProperty("/Data/SfundC2");
		
		var vSfundTotal = Number(vSfundA) + Number(vSfundB) + Number(vSfundC);
		oController._DetailJSonModel.setProperty("/Data/SfundT", (vSfundTotal + ""));
		
		// 합계
		var vTotalA = parseInt(vBaltrA);
		if(vSuptrA) vTotalA -= parseInt(vSuptrA);
		
		oController._DetailJSonModel.setProperty("/Data/TotalA", (vTotalA + ""));
		
		var vTotalB = parseInt(vBaltrB);
		if(vSuptrB) vTotalB -= parseInt(vSuptrB);
		
		oController._DetailJSonModel.setProperty("/Data/TotalB", (vTotalB + ""));
		
		var vTotalC = parseInt(vBaltrC);
		if(vSuptrC) vTotalC -= parseInt(vSuptrC);
		
		oController._DetailJSonModel.setProperty("/Data/TotalC", (vTotalC + ""));
//		var vTotalC = 0;
//		oController._DetailJSonModel.setProperty("/Data/TotalC", "0");
		
		var vTotalT = vTotalA + vTotalB + vTotalC;
		oController._DetailJSonModel.setProperty("/Data/TotalT", (vTotalT + ""));
	},
	
	// 승인
	onPressSaveP : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ClubFundHA.ZUI5_HR_ClubFundDetail");
		var oController = oView.getController();

		oController.onSave(oController , "P");
	},
	
	// 반려
	onPressSaveR : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ClubFundHA.ZUI5_HR_ClubFundDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "R");
	},
	
	// 기안
	onPressSaveS : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ClubFundHA.ZUI5_HR_ClubFundDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "S");
	},
	
	// 재상신
	onPressSaveX : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ClubFundHA.ZUI5_HR_ClubFundDetail");
		var oController = oView.getController();
		
		oController.onSave(oController , "X");
	},
	
	// 저장 Process(oController, 처리구분)
	onSave : function(oController, vPrcty){
		var vErrorMessage = "", vUri = "";
		
		if(oController.onValidationData(oController, vPrcty) == false) return;
		
		var onProcess = function(){
			var oModel = sap.ui.getCore().getModel("ZHR_CLUB_SRV");

			var oneData = oController._DetailJSonModel.getProperty("/Data");
			var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
			
			var createData = {};
			var vTotalData = [];
			
			if(oController._vAppno) createData.Appno = oController._vAppno;

			var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
			var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
			
			createData.Appernr = vEmpLoginInfo[0].Pernr;
			createData.Apename = oneData.Apename;
			createData.Pernr = oneData.Appernr;
			createData.Ename = oneData.Apename;
			
			if(vPrcty == "S"){
				createData.Zhtml = oController.makeHtml(oController);
				
				if(createData.Zhtml == "") return;
			}
			
			if(vPrcty == "R") createData.ZappResn = oneData.ZappResn;
			
			/* 주무부서 기재사항 */
			// 지원금예산
			createData.SfundA = oneData.SfundA;
			createData.SfundB = oneData.SfundB;
//			createData.SfundC = oneData.SfundC;
			createData.SfundT = oneData.SfundT;
			// 현재잔액
			createData.BaltrA = oneData.BaltrA;
			createData.BaltrB = oneData.BaltrB;
//			createData.BaltrC = oneData.BaltrC;
			createData.BaltrT = oneData.BaltrT;
			// 당행사지원
			createData.SuptrA = oneData.SuptrA;
			createData.SuptrB = oneData.SuptrB;
			createData.SuptrC = oneData.SuptrC;
			createData.SuptrT = oneData.SuptrT;
			// 지원 후 잔액
			createData.TotalA = oneData.TotalA;
			createData.TotalB = oneData.TotalB;
			createData.TotalC = oneData.TotalC;
			createData.TotalT = oneData.TotalT;
			
			/* 지원금신청 계산근거 */
			for(var i=0; i<vTableData.length; i++){
				var vDetailData = {};
				
				if(oController._vAppno) vDetailData.Appno = oController._vAppno;
				vDetailData.Seqnr = vTableData[i].Idx + "";
				vDetailData.Content = vTableData[i].Content;	// 내용
				vDetailData.Calcon = vTableData[i].Calcon;		// 계산근거
				if(vTableData[i].Memfee) vDetailData.Memfee = vTableData[i].Memfee.replace(/,/g, "");	// 회비
				if(vTableData[i].SfundA) vDetailData.SfundA = vTableData[i].SfundA.replace(/,/g, "");	// 일반지원금
				if(vTableData[i].SfundB) vDetailData.SfundB = vTableData[i].SfundB.replace(/,/g, "");   // 행사지원금
				if(vTableData[i].SfundC) vDetailData.SfundC = vTableData[i].SfundC.replace(/,/g, "");	// 기타지원금
				if(vTableData[i].Zbigo)	 vDetailData.Zbigo = vTableData[i].Zbigo;	// 비고
				vDetailData.Waers = "KRW";
				
				vTotalData.push(vDetailData);
			}
			
			createData.ClubSupportFundDetailSet = vTotalData;
			
			/* 행사계획 */
			createData.Evtnm = oneData.Evtnm;	// 행사명
			createData.Evtdt = "\/Date("+ common.Common.getTime(oneData.Evtdt)+")\/";	// 일자
			createData.Evtpl = oneData.Evtpl;	// 장소
			createData.Evtde = oneData.Evtde;	// 행사내용
			createData.Partip = oneData.Partip.replace(/,/g, "");	// 참가인원
			
			createData.Btrtl = oneData.Btrtl;	// 사업장
			createData.Zclub = oneData.Zclub;	// 동호회 코드
			
			createData.Prcty = vPrcty;
			createData.Waers = "KRW";
			
			oModel.create("/ClubSupportFundHeadSet", createData, null,
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
		var vDetailData = oController._DetailTableJSonModel.getProperty("/Data");
				
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
		html_url = "/sap/bc/ui5_ui5/sap/ZUI5_HR_WF_HASS/ZUI5_HR_ClubFundHA/html/Fund.html";		
		
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
		
		tHtml = tHtml.replace("[DATA]", vDetailData.Zclubtx);   // 인포멀그룹명
				
		tHtml = tHtml.replace("[ITEM_DATA1]", vDetailData.SfundA ? common.Common.numberWithCommas(vDetailData.SfundA) : "");   // 지원금예산
		tHtml = tHtml.replace("[ITEM_DATA2]", vDetailData.SfundB ? common.Common.numberWithCommas(vDetailData.SfundB) : "");
		tHtml = tHtml.replace("[ITEM_DATA3]", vDetailData.SfundC ? common.Common.numberWithCommas(vDetailData.SfundC2) : ""); 	
		tHtml = tHtml.replace("[ITEM_DATA4]", vDetailData.SfundT ? common.Common.numberWithCommas(vDetailData.SfundT) : "");  	
		tHtml = tHtml.replace("[ITEM_DATA5]", vDetailData.BaltrA ? common.Common.numberWithCommas(vDetailData.BaltrA) : "");   // 현재잔액
		tHtml = tHtml.replace("[ITEM_DATA6]", vDetailData.BaltrB ? common.Common.numberWithCommas(vDetailData.BaltrB) : "");
		tHtml = tHtml.replace("[ITEM_DATA7]", vDetailData.BaltrC ? common.Common.numberWithCommas(vDetailData.BaltrC2) : "");
		tHtml = tHtml.replace("[ITEM_DATA8]", vDetailData.BaltrT ? common.Common.numberWithCommas(vDetailData.BaltrT) : "");  	
		tHtml = tHtml.replace("[ITEM_DATA9]", vDetailData.SuptrA ? common.Common.numberWithCommas(vDetailData.SuptrA) : "");   // 당행사지원
		tHtml = tHtml.replace("[ITEM_DATA10]", vDetailData.SuptrB ? common.Common.numberWithCommas(vDetailData.SuptrB) : "");
		tHtml = tHtml.replace("[ITEM_DATA11]", vDetailData.SuptrC ? common.Common.numberWithCommas(vDetailData.SuptrC) : "");
		tHtml = tHtml.replace("[ITEM_DATA12]", vDetailData.SuptrT ? common.Common.numberWithCommas(vDetailData.SuptrT) : "");	
		tHtml = tHtml.replace("[ITEM_DATA13]", vDetailData.TotalA ? common.Common.numberWithCommas(vDetailData.TotalA) : "");  // 지원후잔액
		tHtml = tHtml.replace("[ITEM_DATA14]", vDetailData.TotalB ? common.Common.numberWithCommas(vDetailData.TotalB) : "");
		tHtml = tHtml.replace("[ITEM_DATA15]", vDetailData.TotalC ? common.Common.numberWithCommas(vDetailData.TotalC) : "");
		tHtml = tHtml.replace("[ITEM_DATA16]", vDetailData.TotalT ? common.Common.numberWithCommas(vDetailData.TotalT) : "");
		
		tHtml = tHtml.replace("[ITEM_DATA17]", checkText(vDetailData.Evtnm));	// 행사명
		tHtml = tHtml.replace("[ITEM_DATA18]", dateFormat.format(new Date(vDetailData.Evtdt)));	// 일자
		tHtml = tHtml.replace("[ITEM_DATA19]", checkText(vDetailData.Evtpl));	// 장소
		tHtml = tHtml.replace("[ITEM_DATA20]", checkText(vDetailData.Evtde));	// 행사내용
		tHtml = tHtml.replace("[ITEM_DATA21]", vDetailData.Partip);	// 참가인원
		
		var vTotalData = oController._FooterJSONModel.getProperty("/Data");
		// 합계
		tHtml = tHtml.replace("[TOTAL_DATA1]", vTotalData.TotalMemfee ? common.Common.numberWithCommas(vTotalData.TotalMemfee) : "");
		tHtml = tHtml.replace("[TOTAL_DATA2]", vTotalData.TotalT ? common.Common.numberWithCommas(vTotalData.TotalT) : "");
		tHtml = tHtml.replace("[TOTAL_DATA3]", vTotalData.TotalA ? common.Common.numberWithCommas(vTotalData.TotalA) : "");
		tHtml = tHtml.replace("[TOTAL_DATA4]", vTotalData.TotalB ? common.Common.numberWithCommas(vTotalData.TotalB) : "");
		tHtml = tHtml.replace("[TOTAL_DATA5]", vTotalData.TotalC ? common.Common.numberWithCommas(vTotalData.TotalC) : "")
		

		item_data = "";
		tmp_item_html ="";
		item_replace = "";
		
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		
		for(var i=0 ; i< vTableData.length ; i++ ) {
			tmp_item_html = table_html;
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM1]", vTableData[i].Idx);
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM2]", checkText(vTableData[i].Content));		// 내용
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM3]", checkText(vTableData[i].Calcon));		// 계산근거
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM4]", vTableData[i].Memfee);		// 회비
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM5]", vTableData[i].Total);		// 지원금총액
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM6]", vTableData[i].SfundA);		// 일반지원금
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM7]", vTableData[i].SfundB);		// 행사지원금
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM8]", vTableData[i].SfundC);		// 기타지원금
			tmp_item_html = tmp_item_html.replace("[TABLE_ITEM9]", checkText(vTableData[i].Zbigo));		// 비고
			item_data += tmp_item_html;
		}
	
		item_replace = tHtml.substring(tHtml.indexOf(table_start), tHtml.indexOf(table_end) + table_end.length);
		tHtml = tHtml.replace(item_replace, item_data);
		
		return tHtml;
		
	},
});