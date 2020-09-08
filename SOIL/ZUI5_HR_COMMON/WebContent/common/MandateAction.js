jQuery.sap.declare("common.MandateAction");
jQuery.sap.require("common.Common");



/** 
 * 결재자 지정
 * (신청서유형, 신청자사번, Appno)
*/

common.MandateAction = {
	/** 
	* @memberOf common.MandateAction
	*/	
	
	oController : null,
	
	onAfterOpen : function(oEvent){
		var oController = common.MandateAction.oController;
		var oMandateDialog = sap.ui.getCore().byId(oController.PAGEID + "_MandateDialog")
		var oJSonModel = oMandateDialog.getModel();
		var vDatas = { Data : {}} ;
		var vData = oController._MandateJSonModel.getProperty("/Data");
		if(vData && vData.Perid && vData.Perid != ""){
			Object.assign(vDatas.Data, vData);
		}
		vDatas.Data.ZappStatAl = oController._DetailJSonModel.getProperty("/Data/ZappStatAl");
		vDatas.Data.Appno = oController._DetailJSonModel.getProperty("/Data/Appno");
		
		oJSonModel.setData(vDatas);
	},
	
	onBeforeClose : function(oEvent){
		var oController = common.MandateAction.oController;
		var oMandateDialog = sap.ui.getCore().byId(oController.PAGEID + "_MandateDialog")
		var oJSonModel = oMandateDialog.getModel();
		var Datas = { Data : {}} ;
		oJSonModel.setData(Datas);	
	},
	
	// 적용 버튼 선택 시
	onSave : function(oEvent){
		var oController = common.MandateAction.oController;
		var oMandateDialog = sap.ui.getCore().byId(oController.PAGEID + "_MandateDialog")
		var oJSonModel = oMandateDialog.getModel();
		var vData = oJSonModel.getProperty("/Data");
		// validation check
		if(!vData.Pernr || vData.Pernr ==""){
			sap.m.MessageBox.error("위임자를 지정하시기 바랍니다.", {title : oBundleText.getText("LABEL_0053")});	// 53:오류
			return ;
		}
		
		if(common.Common.checkNull(vData.RepBegda) || common.Common.checkNull(vData.RepEndda)){
			sap.m.MessageBox.error("위임일자를 입력하시기 바랍니다.", {title : oBundleText.getText("LABEL_0053")});	// 53:오류
			return ;
		}
		
		if(common.Common.checkDate(vData.RepBegda, vData.RepEndda) == false){
			sap.m.MessageBox.error(oBundleText.getText("LABEL_1128"), {title : oBundleText.getText("LABEL_0053")}); 	// 1128:시작일자가 종료일자보다 큽니다.\n날짜를 확인하세요.
			return ;
		}
	
		var vDatas = { Data : {}};	
		
		vDatas.Data.Perid = vData.Perid;
		vDatas.Data.Ename = vData.Ename;
		vDatas.Data.Pernr = vData.Pernr;
		vDatas.Data.RepBegda = vData.RepBegda;
		vDatas.Data.RepEndda = vData.RepEndda;
		vDatas.Data.RepNote  = vData.RepNote;
		vDatas.Data.RepYn  = "Y";
		vDatas.Data.Appno  = vData.Appno;
		oController._MandateJSonModel.setData(vDatas);
		
		sap.ui.getCore().byId(oController.PAGEID + "_MandateDialog").close();
	},
	
	// 닫기 버튼 선택 시
	onClose : function(oEvent){
		var oController = common.MandateAction.oController;
		sap.ui.getCore().byId(oController.PAGEID + "_MandateDialog").close();
	},

	//취소
	onDelete : function(oEvent){
		var oController = common.MandateAction.oController;
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		
		var onProcess = function(fVal){
			if(fVal && fVal == sap.m.MessageBox.Action.YES) {
				if(oController._DetailJSonModel.getProperty("/Data/ZappStatAl") == ""){
					oController._MandateJSonModel.setData({Data : {}});
					sap.m.MessageBox.alert(oBundleText.getText("LABEL_0034") , {title : oBundleText.getText("LABEL_2910")});	// LABEL_2910:성공
					sap.ui.getCore().byId(oController.PAGEID + "_MandateDialog").close();
				}else{
					var vDatas = oController._MandateJSonModel.getProperty("/Data");		
					oModel.remove(
							"/SubstitutorListSet(Appno='" + vDatas.Appno 
							+ "',Pernr='" + vDatas.Pernr
							+ "')",
							null,
						    function (oData, response) {
								oController._MandateJSonModel.setData({Data : {}});
								sap.m.MessageBox.alert(oBundleText.getText("LABEL_0034") , {title : oBundleText.getText("LABEL_2910")});	// LABEL_2910:성공
								sap.ui.getCore().byId(oController.PAGEID + "_MandateDialog").close();
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
								sap.m.MessageBox.alert(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});	// 53:오류
							}
					);
				}
				
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("LABEL_0035"), {	// LABEL_0035:삭제 하시겠습니까?
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : onProcess
		});
	},
	
	onSaveMandate : function(oEvent){
		var oController = common.MandateAction.oController;
		var vErrorMessage, vSuccessyn = "";
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		var vData = oController._MandateJSonModel.getProperty("/Data");
		if(vData && vData.Perid && vData.Perid != ""){
			var createData = {};
			createData.Perid = vData.Perid;
			createData.Pernr = vData.Pernr;
			createData.Ename = vData.Ename;
			createData.RepBegda = "\/Date("+ common.Common.getTime(vData.RepBegda)+")\/";	// 위임 일자
			createData.RepEndda = "\/Date("+ common.Common.getTime(vData.RepEndda)+")\/"; 
			createData.RepYn    = vData.RepYn == "X" || vData.RepYn == true ? "X" : "";
			createData.RepNote  = vData.RepNote;
			createData.Appno = oController._vAppno ;

			oModel.create("/SubstitutorListSet", createData, null,
					function(data,res){
						if(data) {
							oController._vAppno = data.Appno;
						} 
					},
					function (oError) {
						vSuccessyn = "X";
				    	var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) vErrorMessage = Err.error.innererror.errordetails[0].message;
							else vErrorMessage = Err.error.message.value;
						} else {
							vErrorMessage = oError.toString();
						}
						sap.m.MessageBox.alert(vErrorMessage, {title : oBundleText.getText("LABEL_0053")});	// 53:오류
					}
			);
		}
		return vSuccessyn;
	},
	
	// 위임지정 Dialog open
	onMandate : function(oEvent){
		var oController = common.MandateAction.oController;
		var oView = oController.getView();
		
		if(!oController._MandateDialog) {
			oController._MandateDialog = sap.ui.jsfragment("fragment.Mandate", oController);
			oView.addDependent(oController._MandateDialog);
		}
		oController._MandateDialog.open();	
	},
	
	// 위임여부 조회
	onSearchMandate : function(oController){
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
		var oMandateData = {Data : {}};
		var vErrorMessage = "", vError = "";
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		if(oController._vAppno && oController._vAppno != ""){
			var oPath = "/SubstitutorListSet?$filter=Appno eq '" + oController._vAppno + "'";
			oModel.read(oPath, null, null, false,
					function(data, res){
						if(data.results && data.results.length > 0){
							// 대상자
							data.results[0].RepYn = data.results[0].RepYn =="X" ? true : false ;
							data.results[0].RepBegda = dateFormat.format(data.results[0].RepBegda);
							data.results[0].RepEndda = dateFormat.format(data.results[0].RepEndda);
							oMandateData.Data = data.results[0];
							oController._DetailJSonModel.setProperty("/Data/RepYn", true);
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
		}
		
		oController._MandateJSonModel.setData(oMandateData);
		
		if(vError == "E"){
			sap.m.MessageBox.alert(vErrorMessage, {
				onClose : function() {
					oController.BusyDialog.close();
				}
			});
			return ;
		}
	},
	
	displayEmpSearchDialog : function(oEvent){
		var oController = common.MandateAction.oController;
		
		if(oEvent){
			oController._oControl = oEvent.getSource();
			oController._vEnamefg = "";
		}
		//각 발령대상자의 발령일을 검색조건으로 설정한다.
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		if(oActda) oController._vActda = oActda.getValue();
		
		common.SearchUser1.oController = oController;

		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		
		oController._AddPersonDialog.open();		
	},
	
	clearEmployee : function(oEvent){
		var oController = common.MandateAction.oController;
		// 위임자 선택
		var oMandateDialog = sap.ui.getCore().byId(oController.PAGEID + "_MandateDialog"); 
		var oJSonModel = oMandateDialog.getModel();
		
		oJSonModel.setProperty("/Data/Ename", "");
		oJSonModel.setProperty("/Data/Pernr", "");
		oJSonModel.setProperty("/Data/Perid", "");
		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		var oController = common.MandateAction.oController;
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Multi";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "MultiInput";
		
		if(!oController._SearchOrgDialog) {
			oController._SearchOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
		}
		oController._SearchOrgDialog.open();
	},
	
	displayOrgSearchDialog : function(oEvent) {
		var oController = common.MandateAction.oController;
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Single";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "Input";
		common.SearchOrg.vNoPersa = true;
		
		if(!oController._SearchOrgDialog) {
			oController._SearchOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
		}
		oController._SearchOrgDialog.open();
	},
	
	EmpSearchByTx :function(oEvent){
		var oController = common.MandateAction.oController;
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		var oControl = oEvent.getSource();
		var vEname = oControl.getValue();
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = {EmpSearchResultSet : []};
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		
		// 위임자 선택
		var oMandateDialog = sap.ui.getCore().byId(oController.PAGEID + "_MandateDialog"); 
		var oJSonModel = oMandateDialog.getModel();
		
		common.SearchUser1.oController = oController;
		oController._vEnamefg = "";
		 
		if(vEname != ""){
			oController._oControl = oControl;
			var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
			
			var filterString = "/?$filter=Actda eq datetime'" + vActda + "T00:00:00' and Ename eq '" + encodeURI(vEname) + "' and Stat1 eq '3'";
				filterString += " and Actty eq '" + _gAuth + "' and ReqAuth eq '3'";
		
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
					sap.m.MessageBox.error(oController.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});	// 53:오류
					oEvent.getSource().setValue();
					return;
				}
			}catch(Ex){
				
			}
			
			if(vEmpSearchResult.EmpSearchResultSet.length == 1){
				var vContext = vEmpSearchResult.EmpSearchResultSet[0];			
				// 위임자 선택
				oJSonModel.setProperty("/Data/Ename", vContext.Ename);
				oJSonModel.setProperty("/Data/Pernr", vContext.Pernr);
				oJSonModel.setProperty("/Data/Perid", vContext.Perid);
			} else {
				oController._vEnamefg = "X";
				oController._oControl = oEvent.getSource();
				common.MandateAction.displayEmpSearchDialog();
			}
		}else{
			oJSonModel.setProperty("/Data/Ename", "");
			oJSonModel.setProperty("/Data/Pernr", "");
			oJSonModel.setProperty("/Data/Perid", "");
		}
	},
	
	onESSelectPerson : function(oEvent) {
		var oController = common.MandateAction.oController;
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"); 
		var vIDXs = oTable.getSelectedIndices();
		
		// 호출한 화면에서 callback 함수를 실행
		if(oController._useCustomPernrSelection == 'X') {
			oController.customPernrSelection(oEvent);
			return;
		}
		
		if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
			if(vIDXs.length > 1) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_0021"));	// 21:대상자는 한명만 선택이 가능합니다.
				return;
			} else if(vIDXs.length < 1) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2452"));	// 2452:대상자를 선택하여 주세요.
				return;
			}

			var vContext = oTable.getContextByIndex(vIDXs[0]).sPath;	 		
			
			if(oController._MandateDialog && oController._MandateDialog.isOpen()){
				// 위임자 선택
				var oMandateDialog = sap.ui.getCore().byId(oController.PAGEID + "_MandateDialog"); 
				var oJSonModel = oMandateDialog.getModel();
				
				oJSonModel.setProperty("/Data/Ename", mEmpSearchResult.getProperty(vContext + "/Ename"));
				oJSonModel.setProperty("/Data/Pernr", mEmpSearchResult.getProperty(vContext + "/Pernr"));
				oJSonModel.setProperty("/Data/Perid", mEmpSearchResult.getProperty(vContext + "/Perid"));
			}
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2452"));	// 2452:대상자를 선택하여 주세요.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
};