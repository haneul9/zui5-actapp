//jQuery.sap.require("control.BusyIndicator");
//jQuery.sap.require("control.ZNKBusyAccessor");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");

sap.ui.controller("ZUI5_HR_Overview.ZUI5_HR_OverviewList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_Overview.ZUI5_HR_OverviewList
	 */

	PAGEID : "ZUI5_HR_OverviewList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vClsdt : "",
	_vPayym : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	
	_vAppno : "",
	
	_vEnamefg : "",
	_oControl : null,
	
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
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth()-1 , curDate.getDate()+1);
		
		if(_gAuth == "H") prevDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()-6);
		
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		var vEname = "";
		var vPernr = "";
		var oController = this ;
		if(!oController._ListCondJSonModel.getProperty("/Data")){
			if(vEmpLoginInfo.length > 0){
				var OneData = {};
				
				if(_gAuth == "E"){
					// 대상자
					vEname = vEmpLoginInfo[0].Ename ;
					vPernr = vEmpLoginInfo[0].Pernr ;
				}
				
			}
		
			var JSonData = {Data : {Apbeg : dateFormat.format(prevDate), Apend : dateFormat.format(curDate), Pernr : vPernr, Ename : vEname, Auth : _gAuth}};
			oController._ListCondJSonModel.setData(JSonData);
		}
		
		// 테이블 sort, filter 제거
		var oColumns = sap.ui.getCore().byId(oController.PAGEID + "_Table").getColumns();
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		oController.onGetCountDown(oController);
		
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
//		this.onPressSearch();
		
	},
	
	onInitControl : function(oController, _vZappStatAl ){
		var vData = oController._ListCondJSonModel.getProperty("/Data");
//		if(vData != undefined) oController.onGetCountDown(oController ,vData.Pernr );

	},
	
	// 신규신청 로직
	onPressNew : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overview.ZUI5_HR_OverviewList");
		var oController = oView.getController();
		
//		var myPages = sap.ui.getCore().byId("ZNK_PORTAL" + "_notUnifiedSpllit");
//		var nextPage = "ZUI5_HR_Overview.ZUI5_HR_OverviewDetail";
//		var vExist = "";
//		for(var i = 0; i < myPages.getDetailPages().length ; i++){
//			if(nextPage == myPages.getDetailPages()[i].sId ){
//				vExist = "X";
//				break;
//			}
//		}
//		
//		if(vExist == ""){
//			myPages.addDetailPage(sap.ui.jsview("ZUI5_HR_Overview.ZUI5_HR_OverviewDetail", "ZUI5_HR_Overview.ZUI5_HR_OverviewDetail"));
//		}
//		
//		myPages.toDetail("ZUI5_HR_Overview.ZUI5_HR_OverviewDetail",{Appno : ""});
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_Overview.ZUI5_HR_OverviewDetail",
		      data : {Appno : ""}
			});	
		
	},
	
	onSelectRow : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overview.ZUI5_HR_OverviewList");
		var oController = oView.getController();		
		var oTable = sap.ui.getCore().byId(oController.PAGEID+"_Table");
		var vContext = oEvent.getParameters().rowBindingContext;
		var oModel = oTable.getModel();
		if(vContext == undefined || oModel.getProperty(vContext.sPath)==null){
			return;
		}
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_Overview.ZUI5_HR_OverviewDetail",
		      data : {Appno : oModel.getProperty(vContext.sPath + "/Appno")},
//			    	  Appernr : oModel.getProperty(vContext.sPath + "/Appernr"),
//			    	  Apename : oModel.getProperty(vContext.sPath + "/Apename"),
//			    	  Apzzjiktltx : oModel.getProperty(vContext.sPath + "/Apzzjiktltx"),
//			    	  Apzzjikgbtx : oModel.getProperty(vContext.sPath + "/Apzzjikgbtx"),
//			    	  Apbtext : oModel.getProperty(vContext.sPath + "/Apbtext"),
//			    	  Aporgtx : oModel.getProperty(vContext.sPath + "/Aporgtx"),
//			    	  Appdt : oModel.getProperty(vContext.sPath + "/Appdt"),
//			    	  ZappStatAl : oModel.getProperty(vContext.sPath + "/ZappStatAl"),
//			    	  ZappStxtAl : oModel.getProperty(vContext.sPath + "/ZappStxtAl"),
//			    	  Sgndt : oModel.getProperty(vContext.sPath + "/Sgndt"),
//			    	  Datum : oModel.getProperty(vContext.sPath + "/Datum"),
//			    	  Zzorgid : oModel.getProperty(vContext.sPath + "/Zzorgid"),
//			    	  Zzorgtx : oModel.getProperty(vContext.sPath + "/Zzorgtx"),
//			    	  BeguzD : oModel.getProperty(vContext.sPath + "/BeguzD"),
//			    	  EnduzD : oModel.getProperty(vContext.sPath + "/EnduzD"),
//			    	  
//			    	  Docno : oModel.getProperty(vContext.sPath + "/Docno"),
//			    	  ZappUrl : oModel.getProperty(vContext.sPath + "/ZappUrl"),
//			    	  
//			    	  Prvline : oModel.getProperty(vContext.sPath + "/Prvline"), // 개인결재선, 결재자 사번, 이름
//			    	  Aprnr : oModel.getProperty(vContext.sPath + "/Aprnr"),
//			    	  Aprnm : oModel.getProperty(vContext.sPath + "/Aprnm")},
		      }
			);	
	},

	onPressRow : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overview.ZUI5_HR_OverviewList");
		var oController = oView.getController();		
		
		var vAppno = oEvent.getSource().getCustomData()[0].getValue();
				
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_Overview.ZUI5_HR_OverviewDetail",
		      data : {Appno : vAppno} 
		});
		
	},
	
	onBack : function(oEvent){
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
	
	// 리스트 조회
	onPressSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overview.ZUI5_HR_OverviewList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		
		// 테이블 sort, filter 제거
//		var oColumns = oTable.getColumns();
//		for(var i=0; i<oColumns.length; i++){
//			oColumns[i].setSorted(false);
//			oColumns[i].setFiltered(false);
//		}
		
		var vData = {Data : []};
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		var SerchCond = oController._ListCondJSonModel.getProperty("/Data");

		var oModel = sap.ui.getCore().getModel("ZHR_Overview_SRV");
		
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
		var oIconBar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
		var oIconFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter");
		var oIconFilter1 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter1");
		var oIconFilter2 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter2");
		var oIconFilter3 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter3");
		var oIconFilter4 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter4");
		var oIconFilter5 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter5");
		
		function Search(){
			var oPath = "/OverviewApplContentSet";
			var filterString = "";
				
			if(SerchCond.Apbeg != "" && SerchCond.Apend != ""){
				if(common.Common.checkDate(SerchCond.Apbeg, SerchCond.Apend) == false){
					return ;
				}
			}			
			
			if(SerchCond.Apbeg != ""){
				if(filterString == ""){
					filterString = "/?$filter=Apbeg%20eq%20datetime%27" + dateFormat.format(new Date(SerchCond.Apbeg)) + "T00%3a00%3a00%27";	
				} else {
					filterString = filterString + " and " + "Apbeg%20eq%20datetime%27" + dateFormat.format(new Date(SerchCond.Apbeg)) + "T00%3a00%3a00%27";
				}
			}
			
			if(SerchCond.Apend != ""){
				if(filterString == ""){
					filterString = "/?$filter=Apend%20eq%20datetime%27" + dateFormat.format(new Date(SerchCond.Apend)) + "T00%3a00%3a00%27";	
				} else {
					filterString = filterString + " and " + "Apend%20eq%20datetime%27" + dateFormat.format(new Date(SerchCond.Apend)) + "T00%3a00%3a00%27";
				}
			}
			
			if(SerchCond.Pernr != ""){
				if(filterString == ""){
					filterString = "/?$filter=Pernr eq '" + SerchCond.Pernr + "'";	
				} else {
					filterString = filterString + " and " + "Pernr eq '" + SerchCond.Pernr + "'";
				}
			}
			
			if(filterString == ""){
				filterString = "/?$filter=Actty eq '" + _gAuth + "'";	
			} else {
				filterString = filterString + " and " + "Actty eq '" + _gAuth + "'";
			}
						
			oModel.read(oPath + filterString, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){							
							data.results[i].Idx = i+1;
							
							// 소수점 한자리까지만 표시
							if(data.results[i].Tim01 == "0.00") data.results[i].Tim01 = ""; 
							else data.results[i].Tim01 = data.results[i].Tim01.substring(0,data.results[i].Tim01.length-1);
							
							if(data.results[i].Tim02 == "0.00") data.results[i].Tim02 = "";
							else data.results[i].Tim02 = data.results[i].Tim02.substring(0,data.results[i].Tim02.length-1);
							
							if(data.results[i].Tim03 == "0.00") data.results[i].Tim03 = "";
							else data.results[i].Tim03 = data.results[i].Tim03.substring(0,data.results[i].Tim03.length-1);
							
							if(data.results[i].Tim04 == "0.00") data.results[i].Tim04 = "";
							else data.results[i].Tim04 = data.results[i].Tim04.substring(0,data.results[i].Tim04.length-1);
							
							if(data.results[i].Tim05 == "0.00") data.results[i].Tim05 = "";
							else data.results[i].Tim05 = data.results[i].Tim05.substring(0,data.results[i].Tim05.length-1);
							
							vData.Data.push(data.results[i]);
							
							if(data.results[i].ZappStatAl == "10") vReqCnt1++;
							else if(data.results[i].ZappStatAl == "40") vReqCnt2++;
							else if(data.results[i].ZappStatAl == "50") vReqCnt3++;
							else if(data.results[i].ZappStatAl == "55") vReqCnt4++;
							else if(data.results[i].ZappStatAl == "90") vReqCnt5++;
						}
					}
				}, function(Res){
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
			
			// listdate 필드 convert => 필드id+"Txt" string 필드로
			common.Common.convertDateField(vData);
			
			oController._ListJSonModel.setData(vData);
			oTable.setVisibleRowCount(vData.Data.length);
			
			oIconBar.setSelectedKey("All");
			oIconFilterAll.setCount(vData.Data.length);
			oIconFilter1.setCount(vReqCnt1);
			oIconFilter2.setCount(vReqCnt2);
			oIconFilter3.setCount(vReqCnt3);
			oIconFilter4.setCount(vReqCnt4);
			oIconFilter5.setCount(vReqCnt5);
			
			if(oController.Error == "E"){
				oController.BusyDialog.close();
				oController.Error = "";
				sap.m.MessageBox.show(oController.ErrorMessage);
			}
			
//			oTable.bindRows("/Data");
			
			oController.BusyDialog.close();			
		}
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);				
	},
	
	// List 화면의 CountDown 구성
	onGetCountDown : function(oController){
		var oModel = sap.ui.getCore().getModel("ZHR_LEAVEAPPL_SRV");
		var vDatum = "", // 일근태 마감대상일
		    vClsdt = ""; // 마감시한 

		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy.MM.dd"});
		
		var oPath = "/TimeCloseDateSet";
		oModel.read(
				oPath,
				null,
				null,
				false,
				function(data,res){
					if(data && data.results.length){
						vClsdt = data.results[0].Clsdt;
						vDatum = dateFormat.format(data.results[0].Datum); 
					}
				},
				function(res){console.log(res);}
		);	
		
		var oCountDown = sap.ui.getCore().byId(oController.PAGEID + "_CountDown"); 
		
		oController._vDatum = oBundleText.getText("LABEL_2053") + " : " + vDatum;	// 2053:일근태 마감대상일
		oController._vClsdt = oBundleText.getText("LABEL_1715") + " : " + vClsdt.substring(0,4)+"."+vClsdt.substring(4,6)+"."+vClsdt.substring(6,8)+" "+vClsdt.substring(8,10)+":"+vClsdt.substring(10,12)+":"+vClsdt.substring(12,14) ;	// 1715:마감시한

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
			  var vTpText = days + " " + oBundleText.getText("LABEL_2052") + " " +  hours + ":" + minutes + ":" + seconds ;	// 2052:일
			  vTpText = oBundleText.getText("LABEL_1621") + " : " + vTpText ;	// 1621:남은시간

			  // If the count down is finished, write some text 
			  if (distance < 0) {
			    clearInterval(x);
			    oCountDown.setText("");
			  }else{
				var vTotalChar = oController._vDatum + "   " + oController._vClsdt + "   " + vTpText ;
//				    var vTotalChar = "신청기한 : &1      지급년월 : &2    남은시간 : &3";
//				    vTotalChar.replace("&1", oController._vClsdt);
//				    vTotalChar.replace("&2", oController._vPayym);
//				    vTotalChar.replace("&3", vTpText);
					oCountDown.setText(vTotalChar);
			  }
			}, 1000);
	},
	
	_AddPersonDialog : null ,
	
	EmpSearchByTx :function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_VisitTransport.ZUI5_HR_VisitTransportList"),
			oController = oView.getController(),
			oControl = oEvent.getSource(),
			vEname = oControl.getValue(),
			mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult"),
			vEmpSearchResult = {EmpSearchResultSet : []};
		
		common.SearchUserList.oController = oController;
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
			var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV"),
				curDate = new Date(),
				oFilters = [];
			
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
					filters: [
						oFilters
					],
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
					sap.m.MessageBox.alert(oController.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});
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
	
//	displayEmpSearchDialog : function(oEvent){
//		var oView = sap.ui.getCore().byId("ZUI5_HR_Overview.ZUI5_HR_OverviewList");
//		var oController = oView.getController();
//	
//		//각 발령대상자의 발령일을 검색조건으로 설정한다.
//		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
//		if(oActda) oController._vActda = oActda.getValue();
//		
//		common.SearchUser1.oController = oController;
//		common.SearchUser1.fPersaEnabled = false;
//		
//		if(!oController._AddPersonDialog) {
//			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
//			oView.addDependent(oController._AddPersonDialog);
//		}
//		
//		oController._AddPersonDialog.open();
//		
//	},
	
	displayEmpSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overview.ZUI5_HR_OverviewList");
		var oController = oView.getController();
		if(oEvent){
			oController._oControl = "";
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overview.ZUI5_HR_OverviewList");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overview.ZUI5_HR_OverviewList");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overview.ZUI5_HR_OverviewList");
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
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는 한명만 선택이 가능합니다.
				return;
			}else if(vIDXs.length < 1){
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"));	// 20:대상자를 선택하여 주십시오.
				return;
			}

			var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath;
			
			oController._ListCondJSonModel.setProperty("/Data/Pernr", mEmpSearchResult.getProperty(_selPath + "/Pernr"));
			oController._ListCondJSonModel.setProperty("/Data/Ename", mEmpSearchResult.getProperty(_selPath + "/Ename"));
			
			oController.onPressSearch();			
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overview.ZUI5_HR_OverviewList");
		var oController = oView.getController();
		
		oController._ListCondJSonModel.setProperty("/Data/Pernr", "");
		oController._ListCondJSonModel.setProperty("/Data/Ename", "");
		oController._AddPersonDialog.close();
	},
	
	handleIconTabBarSelect : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overview.ZUI5_HR_OverviewList");
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
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overview.ZUI5_HR_OverviewList");
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
//	        var arrDate1 = vDate.split(" ");
//	        var arrDate = arrDate1[0].split(".");
//	        var arrTime = arrDate1[1].split(":");
	        
//	        var setDate = new Date(arrDate[0],arrDate[1]-1,arrDate[2], arrTime[0],arrTime[1],arrTime[2], 0);
			var vMonth = vDate.substring(4,6) * 1;
			var setDate = new Date(vDate.substring(0,4), (vMonth-1) , vDate.substring(6,8), vDate.substring(8,10), vDate.substring(10,12), vDate.substring(12,14));
			
	        return setDate.getTime();
	    }
	},

	// 대상자 선택 시
	onEmpListPopover : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overview.ZUI5_HR_OverviewList");
		var oController = oView.getController();
		
		if(!oController._EmpListPopover) {
			oController._EmpListPopover = sap.ui.jsfragment("ZUI5_HR_Overview.fragment.DisplayEmpList", oController);
			oView.addDependent(oController._EmpListPopover);
		}
		
		oController._vAppno = oEvent.getSource().getCustomData()[0].getValue();
		
		oController._EmpListPopover.openBy(oEvent.getSource());
	},
	
	beforeOpenPopover : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_Overview.ZUI5_HR_OverviewList");
		var oController = oView.getController();
		
		var oPopover = sap.ui.getCore().byId(oController.PAGEID + "_EmpListPopover");
		var oJSONModel = new sap.ui.model.json.JSONModel();
		var vData = {Data : []};
		
		oPopover.setModel(oJSONModel);
		
		var oModel = sap.ui.getCore().getModel("ZHR_Overview_SRV");
		var oPath = "/OverviewApplEmpListSet?$filter=Appno eq '" + oController._vAppno + "' and Prcty eq 'R'";
		
		oModel.read(oPath, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0; i<data.results.length; i++){
							vData.Data.push(data.results[i]);
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
		
		oJSONModel.setData(vData);
		
	},
	


});