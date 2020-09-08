jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");

sap.ui.controller("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipList
	 */

	PAGEID : "ZUI5_HR_ScholarshipListHA",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vClsdt : "",
	_vZpayym : "",
	_vPernr : "" ,
	_oControl  : null,
	_vEnamefg : "",
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	_vZworktyp : 'HR02',
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
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth()-1 , curDate.getDate()+1);
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		var vEname = "";
		var vPernr = "";
		var vBackFlag = "";
		if(oEvent) {
			vBackFlag = oEvent.data.BackFlag;
		}
		var oController = this ;
		if((!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1 )){ // 검색 조건이 없거나 Tab 을 선택하여 들어올 경우 검색 초기화
			if(vEmpLoginInfo.length > 0){
				oController._vPernr = vEmpLoginInfo[0].Pernr ;
			}
			var JSonData = { Data : { Apbeg : dateFormat.format(prevDate) , Apend : dateFormat.format(curDate) , Pernr : "", Ename : "" , Zpayym :""}};
			oController._ListCondJSonModel.setData(JSonData);
			oController.onInitControl(oController);
		}
		
	
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
		this.onPressSearch();
		
	},
	
	onInitControl : function(oController, _vZappStatAl ){
		var vData = oController._ListCondJSonModel.getProperty("/Data");
		if(vData != undefined) oController.onGetCountDown(oController ,vData.Pernr );
	},
	
	onSelectRow : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipList");
		var oController = oView.getController();		
		var oTable = sap.ui.getCore().byId(oController.PAGEID+"_Table");
		var vContext = oEvent.getParameters().rowBindingContext;
		var oModel = oTable.getModel();
		sap.ui.getCore().getEventBus().publish("nav", "to", {
    	  id : "ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipDetail",
	      data : {
	    	  Appno : oModel.getProperty(vContext.sPath + "/Appno")
	      }
		});	
	},

	onPressRow : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipList");
		var oController = oView.getController();		
		
		var vAppno = oEvent.getSource().getCustomData()[0].getValue();
				
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipDetail",
		      data : {Appno : vAppno} 
		});
		
	},
	
	onBack : function(oEvent){
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
	
	// 리스트 조회
	onPressSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");

		// 테이블 sort, filter 제거
//		var oColumns = oTable.getColumns();
//		for(var i=0; i<oColumns.length; i++){
//			oColumns[i].setSorted(false);
//			oColumns[i].setFiltered(false);
//		}
		
		var oModel = sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV");
		var oJModel = new sap.ui.model.json.JSONModel();
		var oDatas = {Data : []};
		var vError = "", vErrorMessage = "" ;
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
		var oPath = "/SchoolExpensesApplSet";
		var filterString = "";
		var SerchCond = oController._ListCondJSonModel.getProperty("/Data");
		filterString = "/?$filter=Prcty eq 'M'";
		
		if(SerchCond.Apbeg != ""){
			filterString = filterString + " and " + "Apbeg%20eq%20datetime%27" + dateFormat.format(new Date(SerchCond.Apbeg)) + "T00%3a00%3a00%27";
		}
		
		if(SerchCond.Apend != ""){
			filterString = filterString + " and " + "Apend%20eq%20datetime%27" + dateFormat.format(new Date(SerchCond.Apend)) + "T00%3a00%3a00%27";
		}
		
		if(SerchCond.Pernr != ""){
			filterString = filterString + " and " + "Pernr eq '" + SerchCond.Pernr + "'";
		}
		
		if(SerchCond.Zpayym != ""){
			filterString = filterString + " and " + "Zpayym eq '" + SerchCond.Zpayym.replace(".","") + "'";
		}

		filterString = filterString + " and Actty eq '"+ _gAuth + "'";	
		
			
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0, vReqCnt6 = 0;
		var oIconBar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR"); 
		var oIconFilter = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter");
		var oIconFilter1 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter1"); 
		var oIconFilter2 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter2"); 
		var oIconFilter3 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter3");
		var oIconFilter4 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter4"); 
		var oIconFilter5 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter5");
		var oIconFilter6 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter6");
		
		function Search() {
			var Datas = {Data : []};
			oModel.read(oPath + filterString, 
			    null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							var OneData = data.results[i];
							OneData.Zpayym =  data.results[i].Zpayym.substring(0,4) + "." + data.results[i].Zpayym.substring(4,6) ; 
							OneData.Idx = i + 1;
							Datas.Data.push(OneData);
							
							if(OneData.ZappStatAl == "20") vReqCnt1++;
							else if(OneData.ZappStatAl == "30") vReqCnt2++;
							else if(OneData.ZappStatAl == "35") vReqCnt3++;
							else if(OneData.ZappStatAl == "50") vReqCnt4++;
							else if(OneData.ZappStatAl == "55") vReqCnt5++;
							else if(OneData.ZappStatAl == "90") vReqCnt6++;
						}
					}
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
			
			oController._ListJSonModel.setData(Datas);
			oTable.setVisibleRowCount(Datas.Data.length);
			
			if(vError == "E"){
				oController.BusyDialog.close();
				sap.m.MessageBox.show(vErrorMessage, {
				});
			}

			oIconBar.setSelectedKey("All");
			oIconFilter.setCount(Datas.Data.length);
			oIconFilter1.setCount(vReqCnt1);
			oIconFilter2.setCount(vReqCnt2);
			oIconFilter3.setCount(vReqCnt3);
			oIconFilter4.setCount(vReqCnt4);
			oIconFilter5.setCount(vReqCnt5);
			oIconFilter6.setCount(vReqCnt6);
			
//			oTable.bindRows({
//			    path: "/Data"
//			});
			
			oController.BusyDialog.close();
		}	
		
//		control.ZNKBusyAccessor.onBusy(oEvent, oController);
		oController.BusyDialog.open();
		setTimeout(Search, 100);
	},
	
	_AddPersonDialog : null ,
	
	EmpSearchByTx :function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipList");
		var oController = oView.getController();
		var oControl = oEvent.getSource();
		var vEname = oControl.getValue();
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = {EmpSearchResultSet : []};
		common.SearchUser1.oController = oController;
		oController._vEnamefg = "";
		
		if(!vEname || vEname == ""){
			if(oController._ListCondJSonModel.getProperty("/Data")){
				var vControlId = common.Common.getControlId(oController, oControl.getId());
				if(vControlId.Id && vControlId.Id != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
				if(vControlId.Key && vControlId.Key != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
			}
			oController.onPressSearch();
		}else{
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
				var vControlId = common.Common.getControlId(oController, oControl.getId());
				if(vControlId.Id && vControlId.Id != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,vEmpSearchResult.EmpSearchResultSet[0].Ename);
				if(vControlId.Key && vControlId.Key != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,vEmpSearchResult.EmpSearchResultSet[0].Pernr);
				oController.onPressSearch();
			}else{
				oController._vEnamefg = "X";
				oController.displayEmpSearchDialog();
			}
		}
		
		
	},
	
	displayEmpSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipList");
		var oController = oView.getController();
	
		//각 발령대상자의 발령일을 검색조건으로 설정한다.
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		if(oActda) oController._vActda = oActda.getValue();
		if(oEvent){
			oController._oControl = oEvent.getSource();
			oController._vEnamefg = "";
		}
		common.SearchUser1.oController = oController;
		common.SearchUser1.fPersaEnabled = false;
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		
		oController._AddPersonDialog.open();
		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipList");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipList");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipList");
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
				sap.m.MessageBox.alert("대상자는 선택하여 주세요.");
				return;
			}
			var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath;
			var vControlId = common.Common.getControlId(oController, oController._oControl.getId());
			if(vControlId.Id && vControlId.Id != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id, mEmpSearchResult.getProperty(_selPath + "/Ename"));
			if(vControlId.Key && vControlId.Key != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,mEmpSearchResult.getProperty(_selPath + "/Pernr"));
		
		}else {
			sap.m.MessageBox.alert("대상자를 선택하여 주십시오.", {title : "오류"});
			return;
		}		
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipList");
		var oController = oView.getController();
		oController._ListCondJSonModel.setProperty("/Data/Pernr", "");
		oController._ListCondJSonModel.setProperty("/Data/Ename", "");
		oController._AddPersonDialog.close();
	},
	
	handleIconTabBarSelect : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipList");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"); 
		
		var sKey = oEvent.getParameter("selectedKey");
		
		var oFilters = [];	
		if(sKey == "All"){ 
			oTable.bindRows({
			    path: "/Data"
			});
		}else{
			oFilters.push(new sap.ui.model.Filter("ZappStatAl",sap.ui.model.FilterOperator.EQ,sKey));
			var combinedFilter = new sap.ui.model.Filter(oFilters);
			
			oTable.bindRows({

			    path: "/Data",

			    filters: combinedFilter

			});
		}
		
		
		

	},
	
	// List 화면의 CountDown 구성
	onGetCountDown : function(oController , vPernr){
		var oModel = sap.ui.getCore().getModel("ZHR_SCHOOL_EXP_SRV");
		var mSchoolLimit = sap.ui.getCore().getModel("SchoolLimit");
		var vSchoolLimit = { Data : {}};
		var vZpayym = ""; //지급년월
		var vClsdt = ""; //신청기한 
		var vReqym = ""; //선지급 차수
		var vReqst = ""; //선지급기간
		// Prcty : List 화면
//		var oPath = "/SchoolLimitSet?$filter=Prcty eq 'L' and Pernr eq '" + vPernr + "'";
//		var oPath = "/SchoolLimitSet?$filter=Pernr eq '" + vPernr + "'";
		var oPath = "/SchoolLimitSet";
		oModel.read(
				oPath,
				null,
				null,
				false,
				function(data,res){
					if(data && data.results.length){
						vClsdt = data.results[0].Clsdt ;
						vZpayym = data.results[0].Payym.substring(0,4) + "." + data.results[0].Payym.substring(4,6) ;
						vReqst = data.results[0].Reqst;
						vReqym = data.results[0].Reqym;
						vSchoolLimit.Data = data.results[0];
					}
				},
				function(res){console.log(res);}
		);	
		
		mSchoolLimit.setData(vSchoolLimit);
		
		var oCountDown = sap.ui.getCore().byId(oController.PAGEID + "_CountDown"); 
		var oNotice = sap.ui.getCore().byId(oController.PAGEID + "_Notice"); 
		var oClsdt = sap.ui.getCore().byId(oController.PAGEID + "_Clsdt"); 
		var oZpayym = sap.ui.getCore().byId(oController.PAGEID + "_Zpayym"); 
		
//		oClsdt.setText("신청기한 : " + vClsdt);
//		oZpayym.setText("지급년월 : " + vZpayym);
		
		oController._vClsdt = "신청기한 : " + vClsdt ;
		oController._vZpayym = "지급년월 : " + vZpayym ;
//		oController._vClsdt = vClsdt ;
//		oController._vZpayym = vZpayym ;
		
		var vReqstT = "대학학자금 선 지급 신청기간 : " + vReqst + " " + vReqym ;
		oController._ListCondJSonModel.setProperty("/Data/ReqstT", vReqstT);
		oController._ListCondJSonModel.setProperty("/Data/Reqst", vReqst);
		// 지급년월 조건 검색 추가
		if(vZpayym && vZpayym != ""){
			oController._ListCondJSonModel.setProperty("/Data/Zpayym",vZpayym);
		}else{
			oCountDown.setText("신청기한:   지급년월:  남은시간:");
			oNotice.setText("대학학자금 선 지급 신청기간 : 0000.00.00 ~ 0000.00.00 0차");
			return ;
		}
		
		var countDownDate = oController.convertDate2(vClsdt);
		
		var x = setInterval(function() {
			  
			  // Get todays date and time
			  var now = new Date().getTime();

			  // Find the distance between now an the count down date
			  var distance = countDownDate - now;

			  // Time calculations for days, hours, minutes and seconds
			  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
			  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

			  // Display the result in the element with id="demo"
			  var vTpText = days + " 일 " +  hours + ":" + minutes + ":" + seconds ;
			  vTpText = "남은시간 : " + vTpText ;

			  // If the count down is finished, write some text 
			  if (distance < 0) {
			    clearInterval(x);
			    oCountDown.setText("");
			  }else{
				var vTotalChar = oController._vClsdt + "   " + oController._vZpayym + "   " + vTpText ;
//				    var vTotalChar = "신청기한 : &1      지급년월 : &2    남은시간 : &3";
//				    vTotalChar.replace("&1", oController._vClsdt);
//				    vTotalChar.replace("&2", oController._vZpayym);
//				    vTotalChar.replace("&3", vTpText);
					oCountDown.setText(vTotalChar);
			  }
			}, 1000);
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ScholarshipHA.ZUI5_HR_ScholarshipList");
		var oController = oView.getController();
//		var oScroll1 = sap.ui.getCore().byId(oController.PAGEID + "Page1");
//		var oScroll2 = sap.ui.getCore().byId(oController.PAGEID + "Page2");
//		oScroll1.setHeight(window.innerHeight-98+"px");
//		oScroll2.setHeight(window.innerHeight-98+"px");
//		var oPage = sap.ui.getCore().byId(oController.PAGEID + "Pages");
//		oPage.setHeight(window.innerHeight-98+"px");
//		$("#" + oController.PAGEID + "_ICONBAR-content").height(window.innerHeight - 132);
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
	

});