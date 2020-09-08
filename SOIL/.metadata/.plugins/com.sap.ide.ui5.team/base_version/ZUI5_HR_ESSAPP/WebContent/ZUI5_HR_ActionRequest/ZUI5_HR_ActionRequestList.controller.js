jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");
jQuery.sap.require("common.Common");

sap.ui.controller("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestList
	 */

	PAGEID : "ZUI5_HR_ActionRequestList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_IconTabBarJSonModel : new sap.ui.model.json.JSONModel(),
	_Columns : "",
	_vPersa : "" ,
	_vClsdt : "",
	_vPayym : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	
	_vAppno : "",
	_vZworktyp : "PA03",
	
	_vEnamefg : "",
	_oControl : null,
	
	onInit : function() {

		//if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		//};

		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow : jQuery.proxy(function(evt) {
				this.onAfterShow(evt);
			}, this)
		});

		var bus = sap.ui.getCore().getEventBus();
		bus.subscribe("app", "OpenWindow", this.SmartSizing, this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing, this);
	},

	onBeforeShow : function(oEvent) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth()-1 , curDate.getDate()+1);
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		var vEname = "";
		var vPernr = "";
		var vEncid = "";
		var oController = this ;
		if(!oController._ListCondJSonModel.getProperty("/Data")){
			if(vEmpLoginInfo.length > 0){
				var OneData = {};
				
				if(_gAuth == "E"){
					// 대상자
					vEname = vEmpLoginInfo[0].Ename ;
					vPernr = vEmpLoginInfo[0].Pernr ;
					vEncid = vEmpLoginInfo[0].Encid ; 
				}
			}
			var JSonData = {Data : {Apbeg : dateFormat.format(prevDate), Apend : dateFormat.format(curDate), 
				                    Pernr : vPernr, Ename : vEname, Auth : _gAuth, 
				                    Encid : vEncid, Datbd : "", Dated : "" }};
			oController._ListCondJSonModel.setData(JSonData);
			
			// 메뉴얼 버튼 활성화
			common.Common.setInformationButton(oController, "A");
		}
		
		oController._IconTabBarJSonModel.setData({
			Data : { click0 : "Y", click1 : "N", click2 : "N", click3 : "N", click4 : "N", click5 : "N" ,
				     CountAll : 0 , Count1 : 0 , Count2 : 0, Count3 : 0 , Count4 : 0,  Count5 : 0
			}
		});
		
		// 테이블 sort, filter 제거
		var oColumns = sap.ui.getCore().byId(oController.PAGEID + "_Table").getColumns();
		for(var i=0; i<oColumns.length; i++){
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
		this.onPressSearch();		
	},
	
	onInitControl : function(oController, _vZappStatAl ){
		var vData = oController._ListCondJSonModel.getProperty("/Data");
//		if(vData != undefined) oController.onGetCountDown(oController ,vData.Pernr );

	},
	
	onPressRegCheck : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestList");
		var oController = oView.getController();
		if(!oController._RegnoCheckDialog) {
			oController._RegnoCheckDialog = sap.ui.jsfragment("fragment.RegnoCheck", oController);
			oView.addDependent(oController._RegnoCheckDialog);
		}
		oController._RegnoCheckDialog.open();
	},
	
	// 신규신청 로직
	onPressNew : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestList");
		var oController = oView.getController();
		oController._RegnoCheckDialog.close();
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail",
		      data : {Appno : ""}
		});	
	},
	
	onSelectRow : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestList");
		var oController = oView.getController();		
		var oTable = sap.ui.getCore().byId(oController.PAGEID+"_Table");
		var vContext = oEvent.getParameters().rowBindingContext;
		var oModel = oTable.getModel();
		if(vContext == undefined || oModel.getProperty(vContext.sPath)==null){
			return;
		}
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail",
		      data : {Appno : oModel.getProperty(vContext.sPath + "/Appno")}}
		);	
	},

	onPressRow : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestList");
		var oController = oView.getController();		
		
		var vAppno = oEvent.getSource().getCustomData()[0].getValue();
				
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail",
		      data : {Appno : vAppno} 
		});
		
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		
		// 테이블 sort, filter 제거
		var oColumns = oTable.getColumns();
		for(var i=0; i<oColumns.length; i++) {
			oColumns[i].setSorted(false);
			oColumns[i].setFiltered(false);
		}
		
		var Datas = {Data : []};
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		var SerchCond = oController._ListCondJSonModel.getProperty("/Data");
		var aFilters = [];

		var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV");
		
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
	
		if(SerchCond.Apbeg != "" && SerchCond.Apend != "") {
			if(common.Common.checkDate(SerchCond.Apbeg, SerchCond.Apend) == false) {
				return ;
			}
		}
		
		aFilters.push(new sap.ui.model.Filter('Actty', sap.ui.model.FilterOperator.EQ, _gAuth));
		aFilters.push(new sap.ui.model.Filter('Prcty', sap.ui.model.FilterOperator.EQ, 'L'));
		if(SerchCond.Apbeg != "") {
			aFilters.push(new sap.ui.model.Filter('Apbeg', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Apbeg").getDateValue())));
		}
		if(SerchCond.Apend != "") {
			aFilters.push(new sap.ui.model.Filter('Apend', sap.ui.model.FilterOperator.EQ, common.Common.adjustGMT(sap.ui.getCore().byId(oController.PAGEID + "_Apend").getDateValue())));
		}
		if(SerchCond.Encid != "") {
			aFilters.push(new sap.ui.model.Filter('Encid', sap.ui.model.FilterOperator.EQ, SerchCond.Encid));
		}

		function Search() {
			var iconData = oController._IconTabBarJSonModel.getData();
			
			oModel.read("/MoveApplySet", {
				async : false,
				filters : aFilters,
				success : function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							var OneData = data.results[i];
							OneData.Idx = i + 1;
							switch (OneData.ZappStatAl) {
								case '10' :
									vReqCnt1++;
									OneData.ZappStatAl2 = "10"; // 작성중
									break;
								case '20' :
									vReqCnt2++;
									OneData.ZappStatAl2 = "20"; // 신청중
									break;
								case '30' : case '35' : case '40' : case '50' :
									if(common.Common.isNull(data.results[i].ZappDate)) {
										vReqCnt3++;
										OneData.ZappStatAl2 = "30"; // 진행중
									} else {
										vReqCnt4++;
										OneData.ZappStatAl2 = "40"; // 승인
									}
									break;
								case '31' : case '36' : case '45' : case '55' :
									vReqCnt5++;
									OneData.ZappStatAl2 = "50"; // 반려
									break;
							}
							
							// 담당자 의견 
							OneData.ZListComment = "";
							if(OneData.Zbigo && OneData.Zbigo != ""){
								OneData.ZListComment = OneData.Zbigo ;
							}
							if(OneData.ZappResn && OneData.ZappResn != ""){
								if(OneData.ZListComment != "") OneData.ZListComment += "\n";
								OneData.ZListComment += OneData.ZappResn;
							}
							
							Datas.Data.push(OneData);
						}
					}
				},
				error : function(Res) {
					var errData = common.Common.parseError(Res);
					oController.Error = errData.Error;
					oController.ErrorMessage = errData.ErrorMessage;
				}
			});
			
			// listdate 필드 convert => 필드id+"Txt" string 필드로
			common.Common.convertDateField(Datas);
			
			oController._ListJSonModel.setData(Datas);
			oTable.setVisibleRowCount(Datas.Data.length > 15 ? 15 : Datas.Data.length);
			
			iconData.Data.Count1 = vReqCnt1;
			iconData.Data.Count2 = vReqCnt2;
			iconData.Data.Count3 = vReqCnt3;
			iconData.Data.Count4 = vReqCnt4;
			iconData.Data.Count5 = vReqCnt5;
			iconData.Data.CountAll = Datas.Data.length;
			oController._IconTabBarJSonModel.setData(iconData);
			
			oController.handleIconTabBarSelect(oController, "0");
			
			if(oController.Error == "E") {
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
	
	handleIconTabBarSelect : function(oController, sKey) {
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"), 
			iconData = oController._IconTabBarJSonModel.getData(),
			oFilters = [];
		
		iconData.Data.click0 = "N";
		iconData.Data.click1 = "N";
		iconData.Data.click2 = "N";
		iconData.Data.click3 = "N";
		iconData.Data.click4 = "N";
		iconData.Data.click5 = "N";
		
		eval("iconData.Data.click" + sKey + "= 'Y' ;");
		oController._IconTabBarJSonModel.setData(iconData);
		
		if(sKey == "0"){ 
			oTable.bindRows({
			    path: "/Data"
			});
		} else {
			var vZappStatAl = "" + (sKey * 10 );
			oFilters.push(new sap.ui.model.Filter("ZappStatAl2",sap.ui.model.FilterOperator.EQ,vZappStatAl));
			var combinedFilter = new sap.ui.model.Filter(oFilters);
			
			oTable.bindRows({
				path: "/Data",
				filters: combinedFilter
			});
		}
	},
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestList");
		var oController = oView.getController();
	},
	
	convertDate : function(vStartDate){
		if(vStartDate) {
	        var arrDate1 = vStartDate.split(".");
	        var getDate1 = new Date(parseInt(arrDate1[0]),parseInt(arrDate1[1])-1,parseInt(arrDate1[2]));
	        return getDate1.getTime();
	    }
	},
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oJSONModel = oTable.getModel();
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
	
		var curDate = new Date();
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: oBundleText.getText("LABEL_1036") + "-" + dateFormat.format(curDate) + ".xlsx"	// 1036:내신서 신청
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
		oSpreadsheet.build();
	}

});