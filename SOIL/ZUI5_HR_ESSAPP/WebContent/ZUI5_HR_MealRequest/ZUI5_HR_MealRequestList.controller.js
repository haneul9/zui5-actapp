//jQuery.sap.require("control.BusyIndicator");
//jQuery.sap.require("control.ZNKBusyAccessor");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("control.ZNK_SapBusy");
jQuery.sap.require("sap.ui.export.Spreadsheet");
jQuery.sap.require("common.SearchUserList");

sap.ui.controller("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList
	 */

	PAGEID : "ZUI5_HR_MealRequestList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	_vPersa : "" ,
	_vClsdt : "",
	_vPayym : "",
	_vPernr : "" , // 로그인 사번 
	_vEnamefg : "",
	_oControl  : null,
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	onInit : function() {

//		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
//		};

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
		var oController = this ;

		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate()+1);
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		if(vEmpLoginInfo.length > 0){
			oController._vPernr = vEmpLoginInfo[0].Pernr ;
		}
		
		var vEname = "";
		var vPernr = "";
		var vEncid = "";
		if(!oController._ListCondJSonModel.getProperty("/Data") || oController._ListCondJSonModel.getProperty("/Data").length < 1){
			if(_gAuth == "E"){
				if(vEmpLoginInfo.length > 0){
					var OneData = {};
					// 대상자
					vEname = vEmpLoginInfo[0].Ename ;
					vPernr = vEmpLoginInfo[0].Pernr ;
					vEncid = vEmpLoginInfo[0].Encid ;
				}
			
				var JSonData = { Data : { Apbeg : dateFormat.format(prevDate) , Apend : dateFormat.format(curDate) , 
					                      Mealtp: "A", Pernr : vPernr, 
					                      Encid : vEncid, Ename : vEname , Payym :""}};
				oController._ListCondJSonModel.setData(JSonData);
			}else{
				var JSonData = { Data : { Apbeg : dateFormat.format(prevDate) , Apend : dateFormat.format(curDate),
					                      Mealtp: "A", Pernr : "", 
					                      Encid : "", Ename : "" , Payym :""}};
				oController._ListCondJSonModel.setData(JSonData);
			}
			oController.onInitControl(oController);
		}

	},

	onAfterShow : function(oEvent) {
		this.SmartSizing(oEvent);	
		this.onPressSearch();
	},
	
	onInitControl : function(oController, _vZappStatAl ){
		var vData = oController._ListCondJSonModel.getProperty("/Data");
//		if(_Appno) oController.onDetailPage();
	},
	
	onDetailPage : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList");
		var oController = oView.getController();
		var vZreqForm = oEvent.getSource().getBindingContext("ZHR_MEALREQUEST_SRV").getProperty("ZreqForm");
		
		if (vZreqForm == 'BE11'){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail",
			      data : {
			    	  Appno : _Appno ,
			    	  Famgb : "",
			      }
			});	
		}else if(vZreqForm == 'BE12'){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
		    	  id : "ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail1",
			      data : {
			    	  Appno : _Appno ,
			    	  Famgb : "",
			      }
			});				
		}
	},
	
	onPressNew : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList");
		var oController = oView.getController();
		oController._RegnoCheckDialog.close();
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail",
		      data : {
		    	  Appno : "" ,
		    	  Famgb : "",
		      }
		});	
			
	},
	
	onSelectRow : function(oEvent){
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList");
		var oController = oView.getController();		
		var vMealtp = oEvent.getParameter("rowBindingContext").getProperty("Mealtp");
		var vAppno = oEvent.getParameter("rowBindingContext").getProperty("Appno");
		var vReqdt = oEvent.getParameter("rowBindingContext").getProperty("Reqdt");
		var oCheck = oController.checkRequest(vMealtp);
		var vEditable = false;
		var vMode = "";
		
		if(dateFormat.format(vReqdt) == dateFormat.format(new Date())){
			if(oCheck.Possible == true){
				vEditable = true;
				vMode = "U";
			}else{
				vEditable = false;
				vMode = "D";
			}
		}else{
			vEditable = false;
			vMode = "D";
		}	
	
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail",
		      data : {
		    	  Appno : vAppno ,
		    	  Famgb : "",
		    	  Mealtp: vMealtp,
		    	  Notice: oCheck.Infotext,
		    	  Editable: vEditable,
		    	  Mode: vMode,
		    	  Path: oEvent.getParameter("rowBindingContext").getPath()
		      }
		});					
	},

	onPressRow : function(oEvent){
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oJSonModel = oTable.getModel();
		var vSelectedData = oJSonModel.getProperty(oEvent.getSource().getBindingContext().sPath);
		
		var vAppno = vSelectedData.Appno;
		var vMealtp = vSelectedData.Mealtp;
		var vReqdt = vSelectedData.Reqdt;
		var oCheck = oController.checkRequest(vMealtp);
		var vEditable = false;
		var vMode = "";
		
		if(dateFormat.format(vReqdt) == dateFormat.format(new Date())){
			if(oCheck.Possible == true){
				vEditable = true;
				vMode = "U";
			}else{
				vEditable = false;
				vMode = "D";
			}
		}else{
			vEditable = false;
			vMode = "D";
		}	
	
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail",
		      data : {
		    	  Appno : vAppno ,
		    	  Famgb : "",
		    	  Mealtp: vMealtp,
		    	  Notice: oCheck.Infotext,
		    	  Editable: vEditable,
		    	  Mode: vMode,
		    	  Path: oEvent.getSource().getBindingContext().sPath
		      }
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
	
	onPressSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList");
		var oController = oView.getController();	
		var oModel = sap.ui.getCore().getModel("ZHR_MEALREQUEST_SRV");
		var SerchCond = oController._ListCondJSonModel.getProperty("/Data");
		
		if(common.Common.checkDate(SerchCond.Apbeg, SerchCond.Apend) == false){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_1128")); 	// 1128:시작일자가 종료일자보다 큽니다.\n날짜를 확인하세요.
			return ;
		}
		
		if(SerchCond.Apbeg == "" || SerchCond.Apend == ""){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_2525")); 	// 2525:시작일과 종료일을 입력하세요.\n날짜를 확인하세요.
			return ;			
		}
		
		var oFilter = [
			new sap.ui.model.Filter("Actty","EQ",_gAuth),
			new sap.ui.model.Filter("Reqdt","BT",SerchCond.Apbeg,SerchCond.Apend),
			new sap.ui.model.Filter("Mealtp","EQ",SerchCond.Mealtp),
			new sap.ui.model.Filter("Encid", "EQ", SerchCond.Encid)
		];
		
		function Search() {
			var Datas = {Data : []};
			
			oModel.read("/MealRequestListSet", {
				async : false,
				filters : oFilter,
				success : function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							var OneData = data.results[i];
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
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			oTable.setVisibleRowCount(Datas.Data.length > 15 ? 15 : Datas.Data.length);
			
			if(oController.Error == "E"){
				oController.BusyDialog.close();
				oController.Error = "";
				sap.m.MessageBox.show(oController.ErrorMessage, {
				});
			}

			oTable.bindRows({
			    path: "/Data"
			});
			
			oController.BusyDialog.close();
		}	
		oController.BusyDialog.open();
		setTimeout(Search, 100);
	
	},	
	
	onExport : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		var oJSONModel = oTable.getModel();
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
	
		var curDate = new Date();
		var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: oBundleText.getText("LABEL_1098") + "-" + dateFormat.format(curDate) + ".xlsx"	// 1098:의료비 신청
			};

		var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
			oSpreadsheet.build();
		
	},
	
	onPressLunch : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList");
		var oController = oView.getController();
		var oCheck = oController.checkRequest("020");
		
		if(oCheck.Possible == false){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_2602"));	// 2602:중식 신청시간이 아닙니다.
			return;			
		}
		
		if(_gAuth == 'E'){
			if(oCheck.Possible1 == false){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_2443"));	// 2443:기 입력된 중식 데이터가 있습니다. 입력필요시 기존 신청데이타를 수정하십시요.
				return;					
			}
		}
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail",
		      data : {
		    	  Appno : "" ,
		    	  Famgb : "",
		    	  Mealtp: '020',
		    	  Notice: oCheck.Infotext,
		    	  Editable: true,
		    	  Mode: "N"
		      }
		});			
	},
	
	onPressDinner : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList");
		var oController = oView.getController();
		
		var oCheck = oController.checkRequest("030");
		
		if(oCheck.Possible == false){
			new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_2509"));	// 2509:석식 신청시간이 아닙니다.
			return;			
		}
		
		if(_gAuth == 'E'){
			if(oCheck.Possible1 == false){
				new control.ZNK_SapBusy.oErrorMessage(oBundleText.getText("LABEL_2442"));	// 2442:기 입력된 석식 데이터가 있습니다. 입력필요시 기존 신청데이타를 수정하십시요.
				return;					
			}
		}		
		

		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "ZUI5_HR_MealRequest.ZUI5_HR_MealRequestDetail",
		      data : {
		    	  Appno : "" ,
		    	  Famgb : "",
		    	  Mealtp: '030',
		    	  Notice: oCheck.Infotext,
		    	  Editable: true,
		    	  Mode: "N"
		      }
		});			
	},
	
	checkRequest: function(sMealtp){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList");
		var oController = oView.getController();	
		var oReturn = {};

		var oModel = sap.ui.getCore().getModel("ZHR_MEALREQUEST_SRV");
		var oPath = "/RequestPossibleSet('" + sMealtp + "')";
		oModel.read(oPath, null, null, false,
				function(data, res){
					oReturn.Possible = data.Possible;
					oReturn.Infotext = data.Infotext;
					oReturn.Possible1 = data.Possible1;
				}, function(Res){
					oReturn.Possible = false;
					oReturn.Infotext = "";
					oReturn.Possible1 = false;
				}
		);			
		
		return oReturn;
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
					oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,vEmpSearchResult.EmpSearchResultSet[0].Encid);
				oController.onPressSearch();
			}else{
				oController._vEnamefg = "X";
				oController.displayEmpSearchDialog();
			}
		}	
	},
	
	displayEmpSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList");
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
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearchList", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		
		oController._AddPersonDialog.open();
		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList");
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
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList");
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
			
			var vControlId = common.Common.getControlId(oController, oController._oControl.getId());
			if(vControlId.Id && vControlId.Id != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Id, mEmpSearchResult.getProperty(_selPath + "/Ename"));
			if(vControlId.Key && vControlId.Key != "")
				oController._ListCondJSonModel.setProperty("/Data/" + vControlId.Key,mEmpSearchResult.getProperty(_selPath + "/Encid"));
			
		}else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0020"), {title : oBundleText.getText("LABEL_0053")});	// 20:대상자를 선택하여 주십시오.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList");
		var oController = oView.getController();
		oController._ListCondJSonModel.setProperty("/Data/Encid", "");
		oController._ListCondJSonModel.setProperty("/Data/Pernr", "");
		oController._ListCondJSonModel.setProperty("/Data/Ename", "");
		oController._AddPersonDialog.close();
	},
	
	
	
	SmartSizing : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_MealRequest.ZUI5_HR_MealRequestList");
		var oController = oView.getController();
	},
	
	convertDate : function(vStartDate){
		if(vStartDate) {
	        var arrDate1 = vStartDate.split(".");
	        var getDate1 = new Date(parseInt(arrDate1[0]),parseInt(arrDate1[1])-1,parseInt(arrDate1[2]));
	        return getDate1.getTime();
	    }
	},
});