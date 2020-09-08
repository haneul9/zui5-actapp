jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.ApprovalLineAction");
jQuery.sap.require("common.SearchUserList");

sap.ui.controller("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail
	 */

	PAGEID : "ZUI5_HR_MealRequestDetail",
	_DetailJSonModel : new sap.ui.model.json.JSONModel(),
	_DetailTableJSonModel : new sap.ui.model.json.JSONModel(), 
	_TargetJSonModel : new sap.ui.model.json.JSONModel(),
	_ApplyJSonModel : new sap.ui.model.json.JSONModel(),
	_vInfoImage : new sap.ui.model.json.JSONModel(),
	_MandateJSonModel : new sap.ui.model.json.JSONModel(),
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vAppno : "",
	_vFromPage : "",
	_vEnamefg : "",
	_vZworktyp : "BE11",
	_ObjList : [],
	_SearchType:"",
	BusyDialog : new sap.m.BusyDialog(),


	///// 결재자 지정 /////
	_vAppno : "",
	_vReqForm : "BE11", // 신청서 유형
	_vReqPernr : "",	// 신청자 사번
	_ApprovalLineModel : new sap.ui.model.json.JSONModel(), // 발신라인 테이블 JSON모델
	_MedicalTypeList : [],
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
		
		var vFromPageId = "";
		if(oEvent) {
			oController._vAppno = vAppno = oEvent.data.Appno;
			oController._sPath = oEvent.data.Path;
			oController._Notice = oEvent.data.Notice;
			oController._Editable = oEvent.data.Editable;
			oController._Mode = oEvent.data.Mode;
			oController._Mealtp = oEvent.data.Mealtp;
			if(oEvent.data.FromPage && oEvent.data.FromPage != "")  vFromPageId = oEvent.data.FromPage ;
		}
		oController._vFromPage = vFromPageId;

		var oPortalTitle = sap.ui.getCore().byId(oController.PAGEID + "_DetailTitle");
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		
		// 초기화
		var Datas = { Data : {}} ;
		var oDetailData = {Data : {}};
		var oDetailTableDatas = {Data : []};
		var vRpernr = ""; // 신청자
		if(vAppno != ""){ // 수정 및 조회
			oController.BusyDialog.open();
			var oModel = sap.ui.getCore().getModel("ZHR_MEALREQUEST_SRV");
			var vErrorMessage = "", vError = "";
			
//			var oPath = oController._sPath;
			var oPath = "/MealRequestListSet(Appno='" + vAppno +"')";
			oModel.read(oPath, null, null, false,
					function(data, res){
						//oDetailData.Data = data;
						oDetailData.Data.Idx = data.Idx;
						oDetailData.Data.Pernr = data.Pernr;
						oDetailData.Data.Usrid = data.Usrid;
						oDetailData.Data.Zzjiktl = data.Zzjiktl;
						oDetailData.Data.Zzjiktlt = data.Zzjiktlt;
						oDetailData.Data.Ename = data.Ename;
						oDetailData.Data.Orgeh = data.Orgeh;
						oDetailData.Data.Orgtx = data.Orgtx;
						oDetailData.Data.Mealtp = data.Mealtp;
						oDetailData.Data.Mealtpt = data.Mealtpt;
						oDetailData.Data.Reqdt = dateFormat.format(new Date(data.Reqdt));;
						oDetailData.Data.Inemp = data.Inemp;
//						oDetailData.Data.Outemp = data.Outemp;
						oDetailData.Data.Zbigo = data.Zbigo;
						oDetailData.Data.Appno = data.Appno;
						oDetailData.Data.Rpernr = data.Rpernr;
						oDetailData.Data.Actty = data.Actty;
						vRpernr =  data.Rpernr;
						oController._vAppno = oDetailData.Data.Appno;

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
			
			oPath = "/MealPernrSet?$filter=Appno eq '" + vAppno + "'";
			oModel.read(oPath, null, null, false,
					function(data, res){
						for (var i=0;i< data.results.length ;i++){
							var oneData = {};
							oneData.Idx = data.results[i].Idx;
							oneData.Usrid = data.results[i].Usrid;
							oneData.Pernr = data.results[i].Pernr;
							oneData.Ename = data.results[i].Ename;
							oneData.Zzjikln = data.results[i].Zzjikln;
							oneData.Zzjiklnt = data.results[i].Zzjiklnt;
							oneData.Zzjiktl = data.results[i].Zzjiktl;
							oneData.Zzjiktlt = data.results[i].Zzjiktlt;
							oneData.Orgeh = data.results[i].Orgeh;
							oneData.Orgtx = data.results[i].Orgtx;
							oneData.Schkz = data.results[i].Schkz;
							oneData.Schkzt = data.results[i].Schkzt;
							oneData.Tprog = data.results[i].Tprog;
							oneData.Tprogt = data.results[i].Tprogt;
							oneData.Sobeg = data.results[i].Sobeg;
							oneData.Soend = data.results[i].Soend;
							oneData.Attinfo = data.results[i].Attinfo;
							oneData.Msg = data.results[i].Msg;
							oneData.Appno = data.results[i].Appno;
							oneData.Actty = data.results[i].Actty;
							oDetailTableDatas.Data.push(oneData);
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
			oController.BusyDialog.close();	
		}
		
		// 공통적용사항 Start
		// 상세화면 Binding
		if(oController._Mode == "N"){
			vZappStatAl = "";
		}else if(oController._Mode == "U"){
			vZappStatAl = "";
		}else if(oController._Mode == "D"){
			vZappStatAl = "20";
		}
		
		oDetailData.Data.Auth = _gAuth;
		oDetailData.Data.Appno = oController._vAppno;
		oDetailData.Data.ZappStatAl = vZappStatAl;
		oDetailData.Data.Notice = oController._Notice;
		oDetailData.Data.Editable = oController._Editable;	
		oDetailData.Data.Mealtp = oController._Mealtp;
		oDetailData.Data.Mode = oController._Mode;
		
		if(oController._Mode == "N"){	
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			oDetailData.Data.Reqdt = dateFormat.format(new Date());
		}
		oController._DetailJSonModel.setData(oDetailData);
		oController._DetailTableJSonModel.setData(oDetailTableDatas);
		
		// 대상자 조회
		common.TargetUser.oController = oController;
		common.TargetUser.onSetTarget(oController);
		common.ApplyUser.oController = oController;
		common.ApplyUser.onSetApplicant(oController);	
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");		
		if (_gAuth == "E"){
			var vTargetData = {Data : {}};
			vTargetData.Data.Ename = vEmpLoginInfo[0].Ename;
			vTargetData.Data.Pernr = vEmpLoginInfo[0].Pernr;
			vPernr = vEmpLoginInfo[0].Pernr;
			vTargetData.Data.Perid = vEmpLoginInfo[0].Perid;
			vTargetData.Data.Btrtx = vEmpLoginInfo[0].Btrtx;
			vTargetData.Data.Orgtx = vEmpLoginInfo[0].Stext;
			vTargetData.Data.Zzjikgb = vEmpLoginInfo[0].Zzjikgb;
			vTargetData.Data.Zzjikgbt = vEmpLoginInfo[0].Zzjikgbt;
			vTargetData.Data.Zzjiktlt = vEmpLoginInfo[0].Zzjiktlt;	
			vTargetData.Data.Zzjikcht = vEmpLoginInfo[0].Zzjikcht;
			vTargetData.Data.Zzjiklnt = vEmpLoginInfo[0].Zzjiklnt;
			vTargetData.Data.Entda = dateFormat.format(new Date(common.Common.setTime(vEmpLoginInfo[0].Entda)));
			vTargetData.Data.Regno = vEmpLoginInfo[0].Regno;
			vTargetData.Data.Address = vEmpLoginInfo[0].Address;	
			vTargetData.Data.Auth = _gAuth;
			oController._TargetJSonModel.setData(vTargetData);
			
			var vApplyUserData = {Data : {}};
			vApplyUserData.Data.Ename = vEmpLoginInfo[0].Ename ;
			vApplyUserData.Data.Appernr = vEmpLoginInfo[0].Pernr ;
			vApplyUserData.Data.Orgtx = vEmpLoginInfo[0].Stext ;
			vApplyUserData.Data.Zzjikgbt = vEmpLoginInfo[0].Zzjikgbt; // 직군
			vApplyUserData.Data.Zzjiktlt = vEmpLoginInfo[0].Zzjiktlt; // 직급
			if(oDetailData.Data.Reqdt){
				vApplyUserData.Data.Appdt = oDetailData.Data.Reqdt;
			}
			oController._ApplyJSonModel.setData(vApplyUserData);
			
		}else if(_gAuth == "H"){
			var oModel = sap.ui.getCore().getModel("ZHR_MEALREQUEST_SRV");
			var vErrorMessage = "", vError = "";			
			var oPath = "/TargetPernrInfoSet('" + vAppno + "')";
			if(vAppno != ""){			
				oModel.read(oPath, null, null, false,
						function(data, res){
							var vTargetData = {Data : {}};
							vTargetData.Data.Ename = data.Ename;
							vTargetData.Data.Pernr = data.Pernr;
							vPernr = data.Pernr;
							vTargetData.Data.Perid = data.Perid;
							vTargetData.Data.Btrtx = data.Btext;
							vTargetData.Data.Orgtx = data.Orgtx;
							vTargetData.Data.Zzjikgb = data.Zzjikgb;
							vTargetData.Data.Zzjikgbt = data.Zzjikgbt;
							vTargetData.Data.Zzjiktlt = data.Zzjiktlt;	
							vTargetData.Data.Zzjikcht = data.Zzjikcht;
							vTargetData.Data.Zzjiklnt = data.Zzjiklnt;
							
							//vTargetData.Data.Entda = dateFormat.format(new Date(common.Common.setTime(vEmpLoginInfo[0].Entda)));
							vTargetData.Data.Regno = data.Regno;
							vTargetData.Data.Address = data.Address;	
							vTargetData.Data.Auth = _gAuth;
							oController._TargetJSonModel.setData(vTargetData);						
						}, function(Res){
	
						}
				);
			}		
		}
		// 신청자 조회
		// 신청자 조회
		if(vAppno != ""){ // 수정 및 조회
			var vApplyUserData = {Data : {}};
			var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
			var vErrorMessage = "", vError = "";	
			var oFilters = [] ;
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			var vActda = dateFormat.format(curDate);
			
			oFilters.push(new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, vActda));
			oFilters.push(new sap.ui.model.Filter("Ename", sap.ui.model.FilterOperator.EQ, vRpernr));
			
			try {
				oModel.read("/EmpSearchResultSet", {
					async: false,
					filters: [
						oFilters
					],
					success: function(data, oResponse) {
						if(data.results && data.results.length){
							vApplyUserData.Data.Ename = data.results[0].Ename ;
							vApplyUserData.Data.Appernr = data.results[0].Pernr ;
							vApplyUserData.Data.Orgtx = data.results[0].Fulln ;
							vApplyUserData.Data.Zzjikgbt = data.results[0].Zzjikgbt; // 직군
							vApplyUserData.Data.Zzjiktlt = data.results[0].Zzjiktlt; // 직급
							vApplyUserData.Data.Zzjiklnt = data.results[0].Zzjiklnt; // 직위
							if(oDetailData.Data.Reqdt){
								vApplyUserData.Data.Appdt = oDetailData.Data.Reqdt;
							}
						}		
					},
					error: function(Res) {
					
					}
				});
				
			}catch(Ex){
				
			}
			
			oController._ApplyJSonModel.setData(vApplyUserData);	
		}
		// 진행상태 신청자, 대상자 Model 업데이트
		oController._TargetJSonModel.setProperty("/Data/ZappStatAl", vZappStatAl);
		oController._ApplyJSonModel.setProperty("/Data/ZappStatAl", vZappStatAl);

		// 결재 상태에 따라 Page Header Text 수정		
		if(oController._Mode== "N"){
			oPortalTitle.setText(oBundleText.getText("LABEL_1705"));	// 1705:도시락 신청
		} else if(oController._Mode == "U"){
			oPortalTitle.setText(oBundleText.getText("LABEL_1705") + " " + oBundleText.getText("LABEL_0040"));	// 40:수정, 1705:도시락 신청
		} else {
			oPortalTitle.setText(oBundleText.getText("LABEL_1705") + " " + oBundleText.getText("LABEL_0064"));	// 64:조회, 1705:도시락 신청
		}
		
		oController.BusyDialog.close();
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
		var oDetailTable = sap.ui.getCore().byId(this.PAGEID + "_DetailTable");
	},
	
	onBack : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
		var oController = oView.getController();

		if(oController._vFromPage != ""){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : oController._vFromPage ,
			      data : {
			    	 
			      }
				});
		} else {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList",
			      data : { }
				}
			);	
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
	
	
	_AddPersonDialog : null ,
	
	EmpSearchByTx :function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
		var oController = oView.getController();
		var oControl = oEvent.getSource();
		var vEname = oControl.getValue();
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = {EmpSearchResultSet : []};
		common.SearchUser1.oController = oController;
		oController._vEnamefg = "";
		
		if(!vEname || vEname == ""){
			if(oController._DetailJSonModel.getProperty("/Data")){
				var vControlId = common.Common.getControlId(oController, oControl.getId());
				if(vControlId.Id && vControlId.Id != "")
					oController._DetailJSonModel.setProperty("/Data/" + vControlId.Id,"");
				if(vControlId.Key && vControlId.Key != "")
					oController._DetailJSonModel.setProperty("/Data/" + vControlId.Key,"");
				
				   
				/*
				 * 추가 로직
				 * */
				oController._DetailJSonModel.setProperty("/Data/BOrgtx", "");
				oController._DetailJSonModel.setProperty("/Data/ZzjikgbtxT", "");
				oController._DetailJSonModel.setProperty("/Data/Zzjikchtx", "");
		
				// 신청대상 List 조회
				oController.onSetFamgb(oController);
				
			}
		}else{
			oController._oControl = oControl;
			var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			var oFilters = [];
			vActda = dateFormat.format(curDate);
			
//			if(_gAuth != "H"){
//				oFilters.push(new sap.ui.model.Filter('Persa', sap.ui.model.FilterOperator.EQ, oController._vPersa));
//			}
			oFilters.push(new sap.ui.model.Filter('Actda', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(curDate)));
			oFilters.push(new sap.ui.model.Filter('Ename', sap.ui.model.FilterOperator.EQ, vEname));
			oFilters.push(new sap.ui.model.Filter('Stat1', sap.ui.model.FilterOperator.EQ, '3'));
			oFilters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth));
			if(gReqAuth) oFilters.push(new sap.ui.model.Filter('ReqAuth', sap.ui.model.FilterOperator.EQ, gReqAuth));
			
			try {
				oCommonModel.read("/EmpSearchResultSet", {
					async: false,
					filters: oFilters,
					success: function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {	
								oData.results[i].Chck = false ;
								vEmpSearchResult.EmpSearchResultSet.push(oData.results[i]);
								
							}
						}
					},
					error: function(Res) {
						var errData = common.Common.parseError(Res);
						oController.Error = errData.Error;
						oController.ErrorMessage = errData.ErrorMessage;
					}
				});
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.alert(oController.ErrorMessage, {title : "오류"});
					oEvent.getSource().setValue();
					return;
				}	
			}catch(Ex){
				
			}
			
			if(vEmpSearchResult.EmpSearchResultSet.length == 1){
				var vControlId = common.Common.getControlId(oController, oControl.getId());
				if(vControlId.Id && vControlId.Id != "")
					oController._DetailJSonModel.setProperty("/Data/" + vControlId.Id,vEmpSearchResult.EmpSearchResultSet[0].Ename);
				if(vControlId.Key && vControlId.Key != "")
					oController._DetailJSonModel.setProperty("/Data/" + vControlId.Key,vEmpSearchResult.EmpSearchResultSet[0].Pernr);
				
				/*
				 * 추가 로직
				 * */
				
				var vBOrgtx = vEmpSearchResult.EmpSearchResultSet[0].Btrtx  +" / " + vEmpSearchResult.EmpSearchResultSet[0].Zzorgtx;
				var vZzjikgbtxT = vEmpSearchResult.EmpSearchResultSet[0].Zzjikgbt  +" / " + vEmpSearchResult.EmpSearchResultSet[0].Zzjiktlt;
				var vZzjikchtx =  vEmpSearchResult.EmpSearchResultSet[0].Zzjikcht;
				
				oController._DetailJSonModel.setProperty("/Data/BOrgtx", vBOrgtx);
				oController._DetailJSonModel.setProperty("/Data/ZzjikgbtxT", vZzjikgbtxT);
				oController._DetailJSonModel.setProperty("/Data/Zzjikchtx", vZzjikchtx);
				// 신청대상 List 조회
				oController.onSetFamgb(oController);

//				// 결재선
//				oController.onSetAppl(null);
			}else{
				oController._vEnamefg = "X";
				oController.displayEmpSearchDialog();
			}
		}
		
		
	},
	
	
	displayEmpSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
		var oController = oView.getController();
		if(oEvent){
			oController._oControl = oEvent.getSource();
			oController._vEnamefg = "";
		}
		//각 발령대상자의 발령일을 검색조건으로 설정한다.
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		if(oActda) oController._vActda = oActda.getValue();
		
		common.SearchUserList.oController = oController;
		common.SearchUserList.fPersaEnabled = false;
		
		if(oController._AddPersonDialog){
			oController._AddPersonDialog.destroy(true);
			oController._AddPersonDialog = null;
		}
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearchList", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		
		oController._AddPersonDialog.open();
		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
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
	
	onESSelectPerson : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
		var oController = oView.getController();		
		if(oController._SearchType == "1"){
			oController.onESSelectPerson1(oEvent);
		}else{
			oController.onESSelectPerson2(oEvent);
		}
	},
	
	
	onESSelectPerson1 : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
		var oController = oView.getController();
	
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"); 
		var vIDXs = oTable.getSelectedIndices();
		var oModel = sap.ui.getCore().getModel("ZHR_MEALREQUEST_SRV");
		var oPath = "";
		var index = 0;
		var oData = {};
		var bExist = false;
		if(oController._DetailTableJSonModel.getProperty("/Data")){
			index = oController._DetailTableJSonModel.getProperty("/Data").length ;
			oData = oController._DetailTableJSonModel.getProperty("/Data");
		}		
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(vIDXs.length < 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}
			
			for(var i=0; i<vIDXs.length; i++ ){
				bExist = false;
				var _selPath = oTable.getContextByIndex(vIDXs[i]).sPath;
				var vPernr = mEmpSearchResult.getProperty(_selPath + "/Pernr");
				var vEncid = mEmpSearchResult.getProperty(_selPath + "/Encid");
				for(var j = 0; j<oData.length;j++){
					if(vPernr == oData[j].Pernr){
						bExist = true;
						break;
					}
				}
				
				if(bExist == true){
					continue;
				}
				
//				oPath = "/PernrInfoSet('Pernr=" + vPernr + "')";
				oPath = "/PernrInfoSet(Pernr='',Encid='"+encodeURIComponent(vEncid)+"')";
				oModel.read(oPath, null, null, false,
						function(data, res){
							var vData = {};
							vData.Idx = index + 1;
							vData.Usrid = data.Usrid;
							vData.Pernr = vPernr;
							vData.Ename = data.Ename;
							vData.Zzjiktl = data.Zzjiktl;
							vData.Zzjiktlt = data.Zzjiktlt;
							vData.Zzjiktl = data.Zzjiktl;
							vData.Zzjiktlt = data.Zzjiktlt;
							vData.Zzjiklnt = data.Zzjiklnt;
							vData.Orgeh = data.Orgeh;
							vData.Orgtx = data.Orgtx;
							vData.Schkz = data.Schkz;
							vData.Schkzt = data.Schkzt;
							vData.Tprog = data.Tprog;
							vData.Tprogt = data.Tprogt;
							vData.Sobeg = data.Sobeg;
							vData.Soend = data.Soend;
							vData.Attinfo = data.Attinfo;
							vData.Msg = data.Msg;
							vData.Appno = data.Appno;
							oController._DetailTableJSonModel.setProperty("/Data/"+index +"/", vData);
							index = index + 1;
						}, function(Res){
							
						}
				);					
			}	
			
			var Inemp = 0;
			if(oController._DetailTableJSonModel.getProperty("/Data")){
				Inemp = oController._DetailTableJSonModel.getProperty("/Data").length;
			}
			oController._DetailJSonModel.setProperty("/Data/Inemp", Inemp );			

		}else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
		oController._AddPersonDialog.destroy(true);
		oController._AddPersonDialog = null;
	},
	
	onESSelectPerson2 : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
		var oController = oView.getController();
	
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"); 
		var vIDXs = oTable.getSelectedIndices();
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(vIDXs.length > 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는 한명만 선택이 가능합니다.
				return;
			}else if(vIDXs.length < 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}
			
			var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath;
			
			var vControlId = common.Common.getControlId(oController, oController._oControl.getId());
			if(vControlId.Id && vControlId.Id != "")
				oController._DetailJSonModel.setProperty("/Data/" + vControlId.Id, mEmpSearchResult.getProperty(_selPath + "/Ename"));
			if(vControlId.Key && vControlId.Key != "")
				oController._DetailJSonModel.setProperty("/Data/" + vControlId.Key,mEmpSearchResult.getProperty(_selPath + "/Encid"));
			
			/*
			 * 추가 로직
			 * */
			var vBOrgtx = mEmpSearchResult.getProperty(_selPath + "/Btrtx")  +" / " + mEmpSearchResult.getProperty(_selPath + "/Zzorgtx");
			var vZzjikgbtxT = mEmpSearchResult.getProperty(_selPath + "/Zzjikgbt")  +" / " + mEmpSearchResult.getProperty(_selPath + "/Zzjiktlt");
			var vZzjikchtx = mEmpSearchResult.getProperty(_selPath + "/Zzjikcht");
			
			oController._DetailJSonModel.setProperty("/Data/BOrgtx", vBOrgtx);
			oController._DetailJSonModel.setProperty("/Data/ZzjikgbtxT", vZzjikgbtxT);
			oController._DetailJSonModel.setProperty("/Data/Zzjikchtx", vZzjikchtx);
			// 신청대상 List 조회
			oController.onSetFamgb(oController);
		}else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},	
	
	onESSClose : function(oEvent){
		
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
		var oController = oView.getController();
		if(oController._SearchType == "2"){
			oController._DetailJSonModel.setProperty("/Data/Encid", "");
			oController._DetailJSonModel.setProperty("/Data/Pernr", "");
			oController._DetailJSonModel.setProperty("/Data/Ename", "");
		}
		oController._AddPersonDialog.close();
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
		var oController = oView.getController();
	},
	
	convertDate : function(vStartDate){
		if(vStartDate) {
	        var arrDate1 = vStartDate.split("-");
	        var getDate1 = new Date(parseInt(arrDate1[0]),parseInt(arrDate1[1])-1,parseInt(arrDate1[2]));
	        return getDate1.getTime();
	    }
	},
	
	
	onPressNewRecord : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
		var oController = oView.getController();
		oController._SearchType = "1";
		oController.displayEmpSearchDialog();
		
	},	
	
	
	onPressDelRecord : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
		var oController = oView.getController();
		var oDetailTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
		var vIDXs = oDetailTable.getSelectedContexts(true);
		var vTotalApamt = 0;
		if(vIDXs.length < 1){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1115"));	// 1115:삭제할 데이터를 선택하여 주십시오.
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
	            	}
	            	
	            	
	            }
	            oController._DetailTableJSonModel.setData(vTData);
	            
	    		oDetailTable.removeSelections(true);
	    		
	    		var Inemp = 0;
	    		if(oController._DetailTableJSonModel.getProperty("/Data")){
	    			Inemp = oController._DetailTableJSonModel.getProperty("/Data").length;
	    		}
	    		oController._DetailJSonModel.setProperty("/Data/Inemp", Inemp );	    		
	    		
			}
		};
		

		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// 35:삭제하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : deleteRecord
		});
		
	},
	
	onPressSaveT : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
		var oController = oView.getController();
		oController.onSave(oController , "T");
	},
	
	
	// 저장 Process
	onSave : function(oController , vPrcty){ // 처리 구분
		var vZappStatAl	= "";
		var vOData = oController.onValidationData(oController, vPrcty);
		if( vOData == "") return ;
		var vDetailData = oController._DetailJSonModel.getProperty("/Data");

		var vDetailDatas = [];
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		for(var i=0; i< vTableData.length; i++) {
			OneData = {};
			OneData.Appno = oController._vAppno ;
			OneData.Pernr = vTableData[i].Pernr;
			vDetailDatas.push(OneData);
		}
		
		var onProcess = function(){
				var vDetailData = oController._DetailJSonModel.getProperty("/Data");
				var vErrorMessage = "";
				var oModel = sap.ui.getCore().getModel("ZHR_MEALREQUEST_SRV");
				vOData.PernrNav = vDetailDatas;
				var oPath = "/MealRequestListSet";
				oModel.create(
						oPath,
						vOData,
						null,
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
					oController.BusyDialog.close();
					new control.ZNK_SapBusy.oErrorMessage(vErrorMessage);
					return ;
				}
				
				
				oController.BusyDialog.close();

				if(vErrorMessage != ""){
					sap.m.MessageBox.alert(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});
					return;
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
		}else if(vPrcty == "X"){
			vInfoTxt = oBundleText.getText("LABEL_2578");	// 2578:재상신하시겠습니까?
			vCompTxt = oBundleText.getText("LABEL_2641") ;	// 2641:현재 문서를 작성중 상태로 변경하였습니다. \n수정 후 재신청하시기 바랍니다.
		}else{
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
		var rData = {};
		var vData = oController._DetailJSonModel.getProperty("/Data");
		var vTableData = oController._DetailTableJSonModel.getProperty("/Data");
		
		
		if(!vData.Mealtp || vData.Mealtp == ""){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_2527"));	// 2527:식사구분이 입력되지 않았습니다.
			return "";
		}
		
		
		for(var i = 0 ; i < vTableData.length ; i++){
		
		}
		
		rData.Pernr =  vData.Pernr; // 대상자
		rData.Mealtp = vData.Mealtp;
		rData.Reqdt = "\/Date("+ new Date(vData.Reqdt).getTime()+")\/"
		if(vData.Inemp == undefined || vData.Inemp == "" || !vData.Inemp){
			vData.Inemp = 0;
		}
		rData.Inemp = parseInt(vData.Inemp);
//		if(vData.Outemp == undefined || vData.Outemp == "" || !vData.Outemp){
//			vData.Outemp = 0;
//		}		
//		rData.Outemp = parseInt(vData.Outemp);
		rData.Zbigo = vData.Zbigo;
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		rData.Rpernr =  vEmpLoginInfo[0].Pernr; // 신청자
		rData.Actty = _gAuth;
		rData.Appno = oController._vAppno;		
		return rData;
		
	},
	
	
	
	// 삭제 Process
	onDelete : function(oController , vPrcty){ // 처리 구분
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
		var oController = oView.getController();
		
		var onProcess = function(){
			var vDetailData = oController._DetailJSonModel.getProperty("/Data");
			var oModel = sap.ui.getCore().getModel("ZHR_MEALREQUEST_SRV");
			var oPath = "MealRequestListSet(Appno='" + oController._vAppno + "')" ;
	
			oModel.remove(
					oPath,
					null,
					function(data,res){
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
			oController.BusyDialog.close();
			
			
			if(oController.Error =="E"){
				sap.m.MessageBox.show(oController.ErrorMessage,{
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
	
	
	onKeyUp1 : function(oEvent){
		if(oEvent.which == 9) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
			var oController = oView.getController();
			jQuery.sap.delayedCall(0, this, function() {
				var oDetailInfoEndda = sap.ui.getCore().byId(oController.PAGEID + "_DetailInfoEndda");
				oDetailInfoEndda.focus();
				});
		}
	},
	
	onKeyUp2 : function(oEvent){
		if(oEvent.which == 9) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
			var oController = oView.getController();
			jQuery.sap.delayedCall(0, this, function() {
				var oDetailInfoDisenm = sap.ui.getCore().byId(oController.PAGEID + "_DetailInfoDisenm");
				oDetailInfoDisenm.focus();
				});
		}
	},
	
	onKeyUp3 : function(oEvent){
		if(oEvent.which == 9) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
			var oController = oView.getController();
			jQuery.sap.delayedCall(0, this, function() {
				var oDetailInfoMedorg = sap.ui.getCore().byId(oController.PAGEID + "_DetailInfoMedorg");
				oDetailInfoMedorg.focus();
				});
		}
	},
	
	onKeyUp4 : function(oEvent){
		if(oEvent.which == 9) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
			var oController = oView.getController();
			jQuery.sap.delayedCall(0, this, function() {
				var oDetail_Foryn = sap.ui.getCore().byId(oController.PAGEID + "_Detail_Foryn");
				oDetail_Foryn.focus();
				});
		}
	},
	
	onKeyUp5 : function(oEvent){
		if(oEvent.which == 9) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
			var oController = oView.getController();
			jQuery.sap.delayedCall(0, this, function() {
				var oDetail_Recpgb = sap.ui.getCore().byId(oController.PAGEID + "_Detail_Recpgb");
				oDetail_Recpgb.focus();
				});
		}
	},
	
	onKeyUp6 : function(oEvent){
		if(oEvent.which == 9) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
			var oController = oView.getController();
			jQuery.sap.delayedCall(0, this, function() {
				var oDetailInfoApamt = sap.ui.getCore().byId(oController.PAGEID + "_DetailInfoApamt");
				oDetailInfoApamt.focus();
				});
		}
	},
	
	openDocno : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail");
		var oController = oView.getController();
		var vUri = oController._DetailJSonModel.getProperty("/Data/Zurl");
		if(vUri && vUri != "")  window.open(vUri);
	},
	
	onAfterSelectPernr : function(oController){
		// 신청대상 List 조회
		//var oView = sap.ui.getCore().byId("ZUI5_HR_Medical.ZUI5_HR_MealRequestDetail");
		//var oController = oView.getController();		
		
	},	
	formatTime: function(time){
		if(time.ms != 0){
			var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern: "HH:mm"});
			var TZOffsetMs = new Date(0).getTimezoneOffset()*60*1000;                             
			var timeStr = timeFormat.format(new Date(time.ms + TZOffsetMs));
		}else{
			var timeStr = "";
		}
		return timeStr; 		
	}	
});