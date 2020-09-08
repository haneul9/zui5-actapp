//jQuery.sap.require("control.BusyIndicator");
//jQuery.sap.require("control.ZNKBusyAccessor");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");

sap.ui.controller("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList
	 */

	PAGEID : "ZUI5_HR_JoinClubList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_DialogJsonModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vClsdt : "",
	_vPayym : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	
	_vAppno : "",
	_vZworktyp : "",
	
	_vEnamefg : "",
	_oControl : null,
	
	_ZclubData : [],
	
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
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth()-1 , curDate.getDate());
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		var vEname = "", vPernr = "", vBtrtl = "";
		var oController = this;
		
		if(!oController._ListCondJSonModel.getProperty("/Data")){
			if(vEmpLoginInfo.length > 0){
				vPernr = vEmpLoginInfo[0].Pernr ;
				vBtrtl = vEmpLoginInfo[0].Btrtl ;
			}
		
			var JSonData = {Data : {Apbeg : dateFormat.format(prevDate), Apend : dateFormat.format(curDate), Auth : _gAuth, Btrtl : vBtrtl}};
			oController._ListCondJSonModel.setData(JSonData);
		}
		
		// 테이블 sort, filter 제거
		var oColumns = sap.ui.getCore().byId(oController.PAGEID + "_Table").getColumns();
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		// 인포멀그룹
		oController.setZclub(oController, vPernr);
		// 사업장
		oController.setBtrtl(oController);
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
		this.onPressSearch();		
	},
	
	onInitControl : function(oController, _vZappStatAl ){
		var vData = oController._ListCondJSonModel.getProperty("/Data");
//		if(vData != undefined) oController.onGetCountDown(oController ,vData.Pernr );

	},
	
	// 사업장
	setBtrtl : function(oController){
		var oBtrtl = sap.ui.getCore().byId(oController.PAGEID + "_Btrtl");
		oBtrtl.destroyItems();
		var oModel = sap.ui.getCore().getModel("ZHR_ATTD_SRV");
		oModel.read("/BtrtlCodeListSet", null, null, false, 
				function(data,res){
					if(data && data.results.length){
						oBtrtl.addItem(new sap.ui.core.Item({key : " ", text : "전체"}));
						for(var i=0; i<data.results.length; i++){
							oBtrtl.addItem(new sap.ui.core.Item({key : data.results[i].Btrtl, text : data.results[i].Btext}));
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
	},
	
	// 신규신청 로직
	onPressNew : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList");
		var oController = oView.getController();
		
//		var myPages = sap.ui.getCore().byId("ZNK_PORTAL" + "_notUnifiedSpllit");
//		var nextPage = "ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail";
//		var vExist = "";
//		for(var i = 0; i < myPages.getDetailPages().length ; i++){
//			if(nextPage == myPages.getDetailPages()[i].sId ){
//				vExist = "X";
//				break;
//			}
//		}
//		
//		if(vExist == ""){
//			myPages.addDetailPage(sap.ui.jsview("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail", "ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail"));
//		}
//		
//		myPages.toDetail("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail",{Appno : ""});
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail",
		      data : {Appno : ""}
			});	
		
	},
	
	onSelectRow : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList");
		var oController = oView.getController();		
		var oTable = sap.ui.getCore().byId(oController.PAGEID+"_Table");
		var vContext = oEvent.getParameters().rowBindingContext;
		var oModel = oTable.getModel();
		
		if(vContext == undefined || oModel.getProperty(vContext.sPath)==null){
			return;
		}
		
		var vZclub = oModel.getProperty(vContext.sPath + "/Zclub");
		
		// 인포멀그룹의 총무/회장/담당자인지 체크하여 해당 값을 보낸다.
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		
		var vPernr = vEmpLoginInfo[0].Pernr;
		
		var vMang = "", vChair = "", vStf = "";
		
		for(var i=0; i<oController._ZclubData.length; i++){
			if(oModel.getProperty(vContext.sPath + "/Zclub") == oController._ZclubData[i].Zclub){
				if(oController._ZclubData[i].Mangnr == vPernr) vMang = "X";		// 총무
				if(oController._ZclubData[i].Chairnr == vPernr) vChair = "X";	// 회장
				if(oController._ZclubData[i].Stfnr == vPernr) vStf = "X";		// 담당자
			}
		}
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail",
		      data : {Appno : oModel.getProperty(vContext.sPath + "/Appno"),
		    	  	  Mang : vMang, Chair : vChair, Stf : vStf}}
		);	
	},

	onPressRow : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList");
		var oController = oView.getController();		
		
		var vAppno = oEvent.getSource().getCustomData()[0].getValue();
		var oTable = sap.ui.getCore().byId(oController.PAGEID+"_Table");
		var oModel = oTable.getModel();
		var vData = oModel.getProperty("/Data");
		
		var vZclub = "";
		
		for(var i=0; i<vData.length; i++){
			if(vAppno == vData[i].Appno){
				vZclub = vData[i].Zclub;
			}
		}
		
		if(vZclub == "") return;

		// 인포멀그룹의 총무/회장/담당자인지 체크하여 해당 값을 보낸다.
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		
		var vPernr = vEmpLoginInfo[0].Pernr;
		
		var vMang = "", vChair = "", vStf = "";

		for(var i=0; i<oController._ZclubData.length; i++){
			if(vZclub == oController._ZclubData[i].Zclub){
				if(oController._ZclubData[i].Mangnr == vPernr) vMang = "X";		// 총무
				if(oController._ZclubData[i].Chairnr == vPernr) vChair = "X";	// 회장
				if(oController._ZclubData[i].Stfnr == vPernr) vStf = "X";		// 담당자
			}
		}
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubDetail",
		      data : {Appno : vAppno, Mang : vMang, Chair : vChair, Stf : vStf} 
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
	
	// 인포멀그룹(로그인사번이 속해있는 동호회만 표시한다.)
	setZclub : function(oController, vPernr){
		var oZclub = sap.ui.getCore().byId(oController.PAGEID + "_Zclub");
		if(oZclub.getItems().length == 0){
			oController._ZclubData = [];
			
			var oModel = sap.ui.getCore().getModel("ZHR_CLUB_SRV");
			oModel.read("/ClubGroupListSet?$filter=Appty eq '1'", null, null, false,
					function(data, res){
						if(data && data.results.length){
							
							oZclub.addItem(new sap.ui.core.Item({key : " ", text : "전체"}));
							
							for(var i=0; i<data.results.length; i++){
								if(_gAuth == "H"){
									oController._ZclubData.push(data.results[i]);
									oZclub.addItem(new sap.ui.core.Item({key : data.results[i].Zclub, text : data.results[i].Zclubtx}));
								} else{
									if(data.results[i].Mangnr == vPernr || data.results[i].Chairnr == vPernr || data.results[i].Stfnr == vPernr){
										oController._ZclubData.push(data.results[i]);
										oZclub.addItem(new sap.ui.core.Item({key : data.results[i].Zclub, text : data.results[i].Zclubtx}));
									}
								}
								
							}
							
						}					
					}, function(Res){
						vError = "E";
						if(Res.response.body){
							vErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							}
						}
						
						console.log(vErrorMessage);
					}
			);
			
			oZclub.setSelectedKey(" ");
		}	
		
		// 신청종류
		var oReqtyp = sap.ui.getCore().byId(oController.PAGEID + "_Reqtyp");
		if(oReqtyp.getItems().length == 0){
			oModel.read("/ClubExpensesObjListSet", null, null, false,
					function(data, res){
						if(data && data.results.length){
							for(var i=0; i<data.results.length; i++){
								oReqtyp.addItem(new sap.ui.core.Item({key : data.results[i].Reqtyp, text : data.results[i].Reqtxt}));
							}							
						}					
					}, function(Res){
						vError = "E";
						if(Res.response.body){
							vErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								vErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							}
						}
						
						console.log(vErrorMessage);
					}
			);
		}
	},
	
	// 리스트 조회
	onPressSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		
		// 테이블 sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var vData = {Data : []};
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		var SerchCond = oController._ListCondJSonModel.getProperty("/Data");

		var oModel = sap.ui.getCore().getModel("ZHR_CLUB_SRV");
		
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0;
		var oIconBar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
		var oIconFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter");
		var oIconFilter1 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter1");
		var oIconFilter2 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter2");
		var oIconFilter3 = sap.ui.getCore().byId(oController.PAGEID + "_IconTabFilter3");
		
		function Search(){
			var oPath = "/ClubExpensesApplSet";
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
			
			if(SerchCond.Zclub){
				if(filterString == ""){
					filterString = "/?$filter=Zclub eq '" + SerchCond.Zclub + "'";	
				} else {
					filterString = filterString + " and " + "Zclub eq '" + SerchCond.Zclub + "'";
				}
			}
			
			if(SerchCond.Btrtl){
				if(filterString == ""){
					filterString = "/?$filter=Btrtl eq '" + SerchCond.Btrtl + "'";	
				} else {
					filterString = filterString + " and " + "Btrtl eq '" + SerchCond.Btrtl + "'";
				}
			}
			
			if(SerchCond.Reqtyp){
				if(filterString == ""){
					filterString = "/?$filter=Reqtyp eq '" + SerchCond.Reqtyp + "'";	
				} else {
					filterString = filterString + " and " + "Reqtyp eq '" + SerchCond.Reqtyp + "'";
				}
			}
			
			if(SerchCond.Pernr){
				if(filterString == ""){
					filterString = "/?$filter=Pernr eq '" + SerchCond.Pernr + "'";	
				} else {
					filterString = filterString + " and " + "Pernr eq '" + SerchCond.Pernr + "'";
				}
			}
			
			if(filterString == ""){
				filterString = "/?$filter=Prcty eq 'M'";	
			} else {
				filterString = filterString + " and Prcty eq 'M'";
			}

			if(filterString == ""){
				filterString = "/?$filter=Actty eq '"+ _gAuth + "'";	
			} else {
				filterString = filterString + " and Actty eq '"+ _gAuth + "'";	
			}
			
			oModel.read(oPath + filterString, null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){							
							data.results[i].Idx = i+1;
							
							vData.Data.push(data.results[i]);
							
							if(data.results[i].ZappStatAl == "20") vReqCnt1++;
							else if(data.results[i].ZappStatAl == "50") vReqCnt2++;
							else if(data.results[i].ZappStatAl == "55") vReqCnt3++;
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
			
			oController._ListJSonModel.setData(vData);
			oTable.setVisibleRowCount(vData.Data.length);
			
			oIconBar.setSelectedKey("All");
			oIconFilterAll.setCount(vData.Data.length);
			oIconFilter1.setCount(vReqCnt1);
			oIconFilter2.setCount(vReqCnt2);
			oIconFilter3.setCount(vReqCnt3);
			
			if(oController.Error == "E"){
				oController.BusyDialog.close();
				oController.Error = "";
				sap.m.MessageBox.show(oController.ErrorMessage);
			}
			
			oTable.bindRows("/Data");
			
			oController.BusyDialog.close();			
		}
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);				
	},
	
	// 인포멀그룹 가입현황
	onOpenState : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList");
		var oController = oView.getController();
		
		if(!oController._DetailInfoDialog) {
			oController._DetailInfoDialog = sap.ui.jsfragment("ZUI5_HR_JoinClubHA.fragment.DetailInfoDialog", oController);
			oView.addDependent(oController._DetailInfoDialog);
		}
		
		oController._DetailInfoDialog.open();
	},
	
	beforeOpenDetailInfoDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_StateTable");
			oTable.bindRows("/Data");
			
		// 테이블 sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var vData = {Data : []};
		
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		
		var oModel = sap.ui.getCore().getModel("ZHR_CLUB_SRV");
		var oPath = "/ClubExpensesApplSet?$filter=Pernr eq '" + vEmpLoginInfo[0].Pernr + "' and Prcty eq 'Z'";
		
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
					oController.Error = "E"; 
					if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
						oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
					}else{
						oController.ErrorMessage =ErrorMessage ;
					}
				}
			}
		);
		
		oController._DialogJsonModel.setData(vData);
		
		if(oController.Error == "E"){
			oController.Error = "";
			sap.m.MessageBox.alert(oController.ErrorMessage, {title : "오류"});
		}
		
	},
	
	// 반려사유 popover
	onPopover : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList");
		var oController = oView.getController();
		
		console.log(oEvent);
		
		if(!oController._ZappResnPopover) {
			oController._ZappResnPopover = sap.ui.jsfragment("ZUI5_HR_JoinClubHA.fragment.DisplayZappResn", oController);
			oView.addDependent(oController._ZappResnPopover);
		}
		
		var oPopover = sap.ui.getCore().byId(oController.PAGEID + "_Popover");
		var oJSONModel = oPopover.getModel();
		var vData = {Data : []};
		
		vData.Data.ZappResn = oEvent.getSource().getCustomData()[0].getValue(); 
		
		oJSONModel.setData(vData);
		
		oController._ZappResnPopover.openBy(oEvent.getSource());
	},
	
	_AddPersonDialog : null ,
	
	EmpSearchByTx :function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		var vEname = oControl.getValue();
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = {EmpSearchResultSet : []};
		
		oController._vEnamefg = "";
		common.SearchUser1.oController = oController;
		
		if(!vEname || vEname == ""){
			if(oController._ListCondJSonModel.getProperty("/Data")){
				var vControlId = common.Common.getControlId(oController, oControl.getId());
				if(vControlId.Id && vControlId.Id != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id,"");
				if(vControlId.Key && vControlId.Key != "")
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,"");
			}
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList");
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
			
			oController._ListCondJSonModel.setProperty("/Data/Pernr", mEmpSearchResult.getProperty(_selPath + "/Pernr"));
			oController._ListCondJSonModel.setProperty("/Data/Ename", mEmpSearchResult.getProperty(_selPath + "/Ename"));
			
			oController.onPressSearch();
		} else {
			sap.m.MessageBox.alert("대상자를 선택하여 주십시오.", {title : "오류"});
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList");
		var oController = oView.getController();
		
		oController._ListCondJSonModel.setProperty("/Data/Pernr", "");
		oController._ListCondJSonModel.setProperty("/Data/Ename", "");
		oController._AddPersonDialog.close();
	},
	
	handleIconTabBarSelect : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"); 
		
		var sKey = oEvent.getParameter("selectedKey");
		
		var oFilters = [];	
		if(sKey == "All"){ 
			oTable.bindRows({
			    path: "/Data"
			});
		} else {
			oFilters.push(new sap.ui.model.Filter("ZappStatAl",sap.ui.model.FilterOperator.EQ,sKey));
			var combinedFilter = new sap.ui.model.Filter(oFilters);
			
			oTable.bindRows({

			    path: "/Data",

			    filters: combinedFilter

			});
		}
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_JoinClubHA.ZUI5_HR_JoinClubList");
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