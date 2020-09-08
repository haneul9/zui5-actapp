jQuery.sap.declare("common.TargetUser2");
jQuery.sap.require("common.Common");
/** 
* 대상자 Layout 위한 JS 이다.
* @Create By 강연준
*/

common.TargetUser2 = {
	/** 
	* @memberOf common.TargetUser
	*/	
	
	oController : null,
	// 대상자 선택
	_AddPersonDialog : null ,
	
	onSetTarget : function(oController){
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy.MM.dd"});
		var vTargetData = {Data : {}};
		if(oController._vAppno == ""){ // 신규신청
			if(vEmpLoginInfo.length > 0){
				var OneData = {};
				var vPernr = "", vEname = "", vPersa = "";
				// 권한
				OneData.Auth = _gAuth;
				if(gReqAuth == "1"){
					OneData.Ename = vEmpLoginInfo[0].Ename;
					OneData.Pernr = vEmpLoginInfo[0].Pernr;
					vPernr = vEmpLoginInfo[0].Pernr;
					vEname = vEmpLoginInfo[0].Ename;
					vPersa = vEmpLoginInfo[0].Persa;
					OneData.Perid = vEmpLoginInfo[0].Perid;
					OneData.Btrtx = vEmpLoginInfo[0].Btrtx;
					OneData.Orgeh = vEmpLoginInfo[0].Orgeh;
					OneData.Orgtx = vEmpLoginInfo[0].Stext;
					OneData.Zzjikgb = vEmpLoginInfo[0].Zzjikgb;
					OneData.Zzjikgbt = vEmpLoginInfo[0].Zzjikgbt;
					OneData.Zzjiktlt = vEmpLoginInfo[0].Zzjiktlt;	
					OneData.Zzjikch = vEmpLoginInfo[0].Zzjikch;
					OneData.Zzjikcht = vEmpLoginInfo[0].Zzjikcht;
					OneData.Zzjikln = vEmpLoginInfo[0].Zzjikln;
					OneData.Zzjiklnt = vEmpLoginInfo[0].Zzjiklnt;
					OneData.Entda = dateFormat.format(new Date(common.Common.setTime(vEmpLoginInfo[0].Entda)));
					OneData.Famdt = common.Common.checkNull(vEmpLoginInfo[0].Famdt) ? null : dateFormat.format(new Date(common.Common.setTime(vEmpLoginInfo[0].Famdt)));
					OneData.Regno = vEmpLoginInfo[0].Regno;
					OneData.Address = vEmpLoginInfo[0].Address;
					OneData.Persa = vEmpLoginInfo[0].Persa;
					OneData.Email = vEmpLoginInfo[0].Email;
				}				
				
				vTargetData.Data.ZappStatAl = "";
				vTargetData.Data = OneData;
				// 상세 내역에 대상자 정보 추가
				if(oController._DetailJSonModel){
					oController._DetailJSonModel.setProperty("/Data/Pernr",vPernr);
					oController._DetailJSonModel.setProperty("/Data/Ename",vEname);
					oController._DetailJSonModel.setProperty("/Data/Persa",vPersa);
					// e-office 계좌 존재 여부 확인
					common.TargetUser2.checkOfficeCheck(oController);
				}
			}else{
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_1011"), {	// 1011:로그인 정보가 존재하지 않습니다.
				 	icon: sap.m.MessageBox.Icon.INFORMATION,
				 	title : oBundleText.getText("LABEL_0053"),	// 53:오류
					onClose : function() {
						oController.onBack();
					}
				});
				return;
			}	
		} else if(oController._vAppno != ""){ // 수정 및 조회
			var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV");
			var vErrorMessage = "", vError = "";
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
			var oPath = "/TagerPernrInfoSet?$filter=Appno eq '" + oController._vAppno + "'";
			oModel.read(oPath, null, null, false,
					function(data, res){
						// 대상자
						vTargetData.Data.Auth = _gAuth;
						vTargetData.Data.Ename    = data.results[0].Ename;
						vTargetData.Data.Btrtx    = data.results[0].Btext; // 사업장
						vTargetData.Data.Orgeh	  = data.results[0].Orgeh;
						vTargetData.Data.Orgtx	  = data.results[0].Orgtx; // 소속부서 
						vTargetData.Data.Zzjikgb  = data.results[0].Zzjikgb;  // 직군
						vTargetData.Data.Zzjikgbt = data.results[0].Zzjikgbt; // 직군명
						vTargetData.Data.Zzjiktl  = data.results[0].Zzjiktl;  // 직급
						vTargetData.Data.Zzjiktlt = data.results[0].Zzjiktlt; // 직급명
						vTargetData.Data.Zzjikch  = data.results[0].Zzjikch;  // 직책
						vTargetData.Data.Zzjikcht = data.results[0].Zzjikcht; // 직책명
						vTargetData.Data.Zzjikln  = data.results[0].Zzjikln; // 직위
						vTargetData.Data.Zzjiklnt = data.results[0].Zzjiklnt; // 직위명 
						vTargetData.Data.Regno    = data.results[0].Regno;
						vTargetData.Data.Perid    = data.results[0].Perid;
						vTargetData.Data.Pernr    = data.results[0].Pernr;
						vTargetData.Data.Persa    = data.results[0].Persa;
						vTargetData.Data.Address  = data.results[0].Address;
						vTargetData.Data.Entda    = data.results[0].Entda == null ? null : dateFormat.format(new Date(common.Common.setTime(data.results[0].Entda))); // 입사일
						vTargetData.Data.Famdt	  = common.Common.checkNull(data.results[0].Famdt) ? null : dateFormat.format(new Date(common.Common.setTime(data.results[0].Famdt)));
						
						

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
						oController.onBack();
					}
				});
				return ;
			}
		}
		oController._TargetJSonModel.setData(vTargetData);
	},
	

	displayEmpSearchDialog : function(oEvent){
		var oController = common.TargetUser2.oController,
			mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo"),
			vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		
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
		}
		
		if(gReqAuth == "2") {
			oController._vOrgeh = vEmpLoginInfo[0].Orgeh;
			oController._vOrgtx = vEmpLoginInfo[0].Stext;
		} else {
			oController._vOrgeh = "";
			oController._vOrgtx = "";
		}
		
		oController._AddPersonDialog.open();		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		var oController = common.TargetUser2.oController;
		
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
		var oController = common.TargetUser2.oController;
		
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
		var oController = common.TargetUser2.oController;
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd"});
		var oControl = oEvent.getSource();
		var vEname = oControl.getValue();
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = {EmpSearchResultSet : []};
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		
		common.SearchUser1.oController = oController;
		oController._vEnamefg = "";
		 
		if(!vEname || vEname == ""){
			if(oController._TargetJSonModel.getProperty("/Data")){
				var vTargetData = { Data : {}};
				vTargetData.Data.Pernr    = "";
				vTargetData.Data.Ename    = "";
				vTargetData.Data.Btrtx    = "";
				vTargetData.Data.Orgeh	  = "";
				vTargetData.Data.Orgtx	  = "";
				vTargetData.Data.Zzjikgb  = "";
				vTargetData.Data.Zzjikgbt = "";
				vTargetData.Data.Zzjiktl  = "";
				vTargetData.Data.Zzjiktlt = "";
				vTargetData.Data.Zzjikch  = "";
				vTargetData.Data.Zzjikcht = "";
				vTargetData.Data.Zzjikln  = "";
				vTargetData.Data.Zzjiklnt = "";
				vTargetData.Data.Regno    = "";
				vTargetData.Data.Address  = "";
				vTargetData.Data.Entda    = null;
				vTargetData.Data.Famdt	  = null;
				vTargetData.Data.Perid    = "";
				vTargetData.Data.Persa    = "";
				vTargetData.Data.Email    = "";
				vTargetData.Data.Auth     = oController._DetailJSonModel.getProperty("/Data/Auth");
				vTargetData.Data.ZappStatAl     = oController._DetailJSonModel.getProperty("/Data/ZappStatAl");			
				
				oController._TargetJSonModel.setData(vTargetData);
				// 상세 내역에 대상자 정보 추가
				 oController._DetailJSonModel.setProperty("/Data/Pernr","");
				 oController.onAfterSelectPernr(oController);
			}
		} else {
			oController._oControl = oControl;
			var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
			
			var filterString = "/?$filter=Actda eq datetime'" + vActda + "T00:00:00' and Ename eq '" + encodeURI(vEname) + "' and Stat1 eq '3'";
			filterString += " and Actty eq '" + _gAuth + "'";
			
			// 권한 추가
			if(gReqAuth) {
				filterString += " and ReqAuth eq '" + gReqAuth + "'";
			}
			
			if(gReqAuth == "2" && oController._useCustomPernrSelection != 'X') {
				filterString += " and Orgeh eq '" + vEmpLoginInfo[0].Orgeh + "'"
			}
				
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
				var vTargetData = { Data : {}};
				// 대상자 선택
				vTargetData.Data.Pernr    = vContext.Pernr;
		        vTargetData.Data.Ename    = vContext.Ename;
				vTargetData.Data.Btrtx    = vContext.Btrtx; // 사업장
				vTargetData.Data.Orgeh	  = vContext.Orgeh; // 
				vTargetData.Data.Orgtx	  = vContext.Fulln;  // 소속부서 
				vTargetData.Data.Zzjikgb  = vContext.Zzjikgb; // 직군
				vTargetData.Data.Zzjikgbt = vContext.Zzjikgbt; // 직군명
				vTargetData.Data.Zzjiktl  = vContext.Zzjiktl;  // 직급
				vTargetData.Data.Zzjiktlt = vContext.Zzjiktlt; // 직급명
				vTargetData.Data.Zzjikch  = vContext.Zzjikch;  // 직책
				vTargetData.Data.Zzjikcht = vContext.Zzjikcht; // 직책명
				vTargetData.Data.Zzjikln  = vContext.Zzjikln; // 직위
				vTargetData.Data.Zzjiklnt = vContext.Zzjiklnt; // 직위명
				vTargetData.Data.Regno    = vContext.Regno; 
				vTargetData.Data.Address  = vContext.Address;
				vTargetData.Data.Email    = vContext.Email;
				vTargetData.Data.Perid    = vContext.Perid;
				vTargetData.Data.Persa    = vContext.Persa;
				vTargetData.Data.Entda    = vContext.Entda == null ? null : dateFormat.format(new Date(common.Common.setTime(vContext.Entda))); // 입사일
				vTargetData.Data.Famdt    = vContext.Famdt == null ? null : dateFormat.format(new Date(common.Common.setTime(vContext.Famdt))); // 결혼기념일
				vTargetData.Data.Auth     = oController._DetailJSonModel.getProperty("/Data/Auth");
				vTargetData.Data.ZappStatAl     = oController._DetailJSonModel.getProperty("/Data/ZappStatAl");
				 
				oController._vPersa = vContext.Persa;
				// 상세 내역에 대상자 정보 추가
				oController._DetailJSonModel.setProperty("/Data/Pernr",vContext.Pernr);
				oController._DetailJSonModel.setProperty("/Data/Ename",vContext.Ename);
				oController._DetailJSonModel.setProperty("/Data/Persa",vContext.Persa);
				
				 
				oController._TargetJSonModel.setData(vTargetData);
				 
					// e-office 계좌 존재 여부 확인
				common.TargetUser2.checkOfficeCheck(oController);
				 
				oController.onAfterSelectPernr(oController);
								
			} else {
				oController._vEnamefg = "X";
				common.TargetUser2.displayEmpSearchDialog();
			}
		}
	},
	
	onESSelectPerson : function(oEvent) {
		var oController = common.TargetUser2.oController;
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
			}else{
				var vTargetData = { Data : {}};
				// 대상자 선택
				vTargetData.Data.Pernr    = mEmpSearchResult.getProperty(vContext + "/Pernr");
	            vTargetData.Data.Ename    = mEmpSearchResult.getProperty(vContext + "/Ename");
				vTargetData.Data.Btrtx    = mEmpSearchResult.getProperty(vContext + "/Btrtx"); // 사업장
				vTargetData.Data.Orgeh	  = mEmpSearchResult.getProperty(vContext + "/Orgeh"); // 
				vTargetData.Data.Orgtx	  = mEmpSearchResult.getProperty(vContext + "/Fulln");  // 소속부서 
				vTargetData.Data.Zzjikgb  = mEmpSearchResult.getProperty(vContext + "/Zzjikgb"); // 직군
				vTargetData.Data.Zzjikgbt = mEmpSearchResult.getProperty(vContext + "/Zzjikgbt"); // 직군명
				vTargetData.Data.Zzjiktl  = mEmpSearchResult.getProperty(vContext + "/Zzjiktl");  // 직급
				vTargetData.Data.Zzjiktlt = mEmpSearchResult.getProperty(vContext + "/Zzjiktlt"); // 직급명
				vTargetData.Data.Zzjikch  = mEmpSearchResult.getProperty(vContext + "/Zzjikch");  // 직책
				vTargetData.Data.Zzjikcht = mEmpSearchResult.getProperty(vContext + "/Zzjikcht"); // 직책명
				vTargetData.Data.Zzjikln  = mEmpSearchResult.getProperty(vContext + "/Zzjikln");  // 직위
				vTargetData.Data.Zzjiklnt = mEmpSearchResult.getProperty(vContext + "/Zzjiklnt"); // 직위명
				vTargetData.Data.Regno    = mEmpSearchResult.getProperty(vContext + "/Regno"); 
				vTargetData.Data.Address  = mEmpSearchResult.getProperty(vContext + "/Address");
				vTargetData.Data.Perid    =  mEmpSearchResult.getProperty(vContext + "/Perid");
				vTargetData.Data.Entda    = mEmpSearchResult.getProperty(vContext + "/Entda") == null ? null : dateFormat.format(new Date(common.Common.setTime(mEmpSearchResult.getProperty(vContext + "/Entda")))); // 입사일
				vTargetData.Data.Famdt    = mEmpSearchResult.getProperty(vContext + "/Famdt") == null ? null : dateFormat.format(new Date(common.Common.setTime(mEmpSearchResult.getProperty(vContext + "/Famdt")))); // 결혼기념일
				vTargetData.Data.Persa    = mEmpSearchResult.getProperty(vContext + "/Persa");
				vTargetData.Data.Email    = mEmpSearchResult.getProperty(vContext + "/Email");
				vTargetData.Data.Auth     = oController._DetailJSonModel.getProperty("/Data/Auth");
				vTargetData.Data.ZappStatAl     = oController._DetailJSonModel.getProperty("/Data/ZappStatAl");
				// 상세 내역에 대상자 정보 추가
				 oController._DetailJSonModel.setProperty("/Data/Pernr",mEmpSearchResult.getProperty(vContext + "/Pernr"));
				 oController._DetailJSonModel.setProperty("/Data/Ename",mEmpSearchResult.getProperty(vContext + "/Ename"));
				 oController._DetailJSonModel.setProperty("/Data/Persa",mEmpSearchResult.getProperty(vContext + "/Persa"));
				 oController._TargetJSonModel.setData(vTargetData);
				 
				 // e-office 계좌 존재 여부 확인
				 common.TargetUser2.checkOfficeCheck(oController);

				 oController.onAfterSelectPernr(oController);
			}
			
			
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2452"));	// 2452:대상자를 선택하여 주세요.
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	onESSClose : function(oEvent){
		var oController = common.TargetUser2.oController;
		
		// 호출한 화면에서 callback 함수를 실행
		if(oController._useCustomPernrSelection == 'X') {
			oController.customPernrClose(oEvent);
			return;
		}
		
		oController._AddPersonDialog.close();
	},
	
	
	onDblClick : function(oEvent){
		var oController = common.TargetUser2.oController;
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table");
		if(common.TargetUser2._vSPath == null || common.TargetUser2._vSPath == -1) return ;
		var vIndex = common.TargetUser2._vSPath.replace("/EmpSearchResultSet/","");
		oTable.clearSelection();
		oTable.setSelectedIndex(parseInt(vIndex));
		common.TargetUser2.onESSelectPerson();
	},
	
	checkOfficeCheck : function(oController){
		var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		var vErrorMessage = "", vError = "";
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
		var vEofficeFlg = true;
		
		if(!common.Common.checkNull(oController._DetailJSonModel.getProperty("/Data/Pernr")) && oController._vZworktyp){
			var oPath = "/EofficeChkSet?$filter=Pernr eq '" + oController._DetailJSonModel.getProperty("/Data/Pernr") + "' and ReqForm eq '" + oController._vZworktyp + "'";
			oModel.read(oPath, null, null, false,
				function(data, res){
					if(data.results && data.results.length){
						vEofficeFlg = data.results[0].EofficeFlg;
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
						oController.onBack();
					}
				});
				return ;
			}
		}
		
		if(vEofficeFlg != true){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2835"), {	// 2835:e-office 계좌 등록이 필요합니다. 담당자에게 문의하세요.
				onClose : function() {
					if(gReqAuth == "1") {
						oController.onBack();
					} else {
						var vTargetData = oController._TargetJSonModel.getProperty("/Data");
						
						oController._TargetJSonModel.setData({Data : {Auth : vTargetData.Auth, ZappStatAl : vTargetData.ZappStatAl}});
						oController._DetailJSonModel.setProperty("/Data/Pernr", "");
					}
				}
			});
			return ;
		}
	},
	
	
};