jQuery.sap.declare("common.SearchUser1");
jQuery.sap.require("common.Common");
/** 
* 사원검색의 Dialog를 위한 JS 이다.
* @Create By 강연준
*/

common.SearchUser1 = {
	/** 
	* @memberOf common.SearchUser1
	*/	
	
	oController : null,
	EsBusyDialog : new sap.m.BusyDialog(),
	
	vHeight : 330,
	clicks : 0,
	_vSPath : -1,
	
	searchFilterBar: function(oEvent) {	
		
		var oController = common.SearchUser1.oController;
		var oEmpSearchTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table");
		
		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}); 
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persa");
		
		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_ES_Ename");
		var oFulln = sap.ui.getCore().byId(oController.PAGEID + "_ES_Fulln");
		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat1");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persk");
		
		oEmpSearchTable.clearSelection();
		
		var vActda = "", vFilterYn = ""; // Filter 필수 충족 여부
		if(!oController._vActda) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
		} else {
			vActda = oController._vActda;
		}
		
		var oFilters = [] ;
		if(oPersa.getSelectedKey() != ""){
			oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oPersa.getSelectedKey()));
		}
		oFilters.push(new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, vActda));
		
		if(oEname.getValue() != "") {
			if(oEname.getValue().length < 2) {
				sap.m.MessageBox.alert(oBundleText.getText("LABEL_2515"));	// 2515:성명은 2자 이상이어야 합니다.
				return;
			}
			oFilters.push(new sap.ui.model.Filter("Ename", sap.ui.model.FilterOperator.EQ, oEname.getValue()));
			vFilterYn = "X";
		}
		
		var oFulln_Tokens = oFulln.getTokens();
		if(oFulln_Tokens && oFulln_Tokens.length) {
			for(var i=0; i<oFulln_Tokens.length; i++) {
				oFilters.push(new sap.ui.model.Filter("Orgeh", sap.ui.model.FilterOperator.EQ, oFulln_Tokens[i].getKey()));
			}
			vFilterYn = "X";
		}
		if(oStat1 && oStat1.getSelectedKey() != "0000") {
			oFilters.push(new sap.ui.model.Filter("Stat1", sap.ui.model.FilterOperator.EQ, oStat1.getSelectedKey()));
		}
		if(oPersg && oPersg.getSelectedKey() != "0000" && oPersg.getSelectedKey() != "0" && oPersg.getSelectedKey() != "") {
			oFilters.push(new sap.ui.model.Filter("Persg", sap.ui.model.FilterOperator.EQ, oPersg.getSelectedKey()));
			vFilterYn = "X";
		}
		if(oPersk && oPersk.getSelectedKey() != "0000" && oPersk.getSelectedKey() != "0" && oPersk.getSelectedKey() != "") {
			oFilters.push(new sap.ui.model.Filter("Persk", sap.ui.model.FilterOperator.EQ, oPersk.getSelectedKey()));
			vFilterYn = "X";
		}
//		if(oFilters.length < 4) {
//			sap.m.MessageBox.alert("최소한 3개이상의 검색조건이 있어야 합니다.");
//			return;
//		}
		if(vFilterYn == ""){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2833"));	// 2833:성명 /소속/ 사원그룹/ 사원하위그룹 중 하나 이상의 조건을 입력하여 주십시오.
			return;
		}
		// 권한 추가
		if(_gAuth){
			oFilters.push(new sap.ui.model.Filter("Actty", sap.ui.model.FilterOperator.EQ, _gAuth));
		}
		
		var oMandateDialog = sap.ui.getCore().byId(oController.PAGEID + "_MandateDialog")
		// 위임지정에서 사원 검색 시 전사 조회
		if(oMandateDialog && oMandateDialog.isOpen()){
			oFilters.push(new sap.ui.model.Filter("ReqAuth", sap.ui.model.FilterOperator.EQ, "3"));
		}else{
			if(gReqAuth) {
				oFilters.push(new sap.ui.model.Filter("ReqAuth", sap.ui.model.FilterOperator.EQ, gReqAuth));
			}
			
			// 특별 필드 추가 검색 ( 기타 직무, 겸직 조직 , 겸직 직책 등 ) 
			if(oController._Zflag && oController._Zflag == "X"){
				oFilters.push(new sap.ui.model.Filter("Zflag", sap.ui.model.FilterOperator.EQ, "X"));
			}
			
			// Yflag == 'X'일 경우 하위부서만 검색
			if(oController._vYflag && oController._vYflag == "X") {
				oFilters.push(new sap.ui.model.Filter("Yflag", sap.ui.model.FilterOperator.EQ, "X"));
			}	
		}
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = {EmpSearchResultSet : []};
		oController.BusyDialog.open();
		var readProcess = function(){
			oCommonModel.read("/EmpSearchResultSet", {
				async : false,
				filters : oFilters,
				success : function(oData,res){
					if(oData && oData.results) {
						for(var i=0; i<oData.results.length; i++) {	
							oData.results[i].Chck = false ;
							vEmpSearchResult.EmpSearchResultSet.push(oData.results[i]);
						}
						mEmpSearchResult.setData(vEmpSearchResult);	
					}
				},
				error : function(Res) {
					var errData = common.Common.parseError(Res);
					oController.Error = errData.Error;
					oController.ErrorMessage = errData.ErrorMessage;
				}
			});
			
			oController.BusyDialog.close();
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.alert(oController.ErrorMessage, {title : oBundleText.getText("LABEL_0053")});	// 53:오류
			}
		}
		
		setTimeout(readProcess , 300);
	},
	
	onAfterOpenSearchDialog : function(oEvent) {
		var oController = common.SearchUser1.oController;
		common.SearchUser1.onAfterRendering();
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat1");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");		
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persa");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persk");
		
		// selection 초기화
		var oSearchTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table");
		if(oSearchTable){
			oSearchTable.clearSelection();
		}
		
		
		oStat1.removeAllItems();
		oStat1.destroyItems();
		
//		if(_gAuth == "H") oPersa.setEnabled(true);
//		else oPersa.setEnabled(false);
		
		var vActda = "";
		if(!oController._vActda) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
		} else {
			vActda = oController._vActda;
		}
		
		// 공백 추가
		oPersa.addItem(
				new sap.ui.core.Item({
					key : "", 
					text : ""}));
		
		try {
			  oCommonModel.read("/PersAreaListSet/?$filter=Actty%20eq%20%271%27",
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								oPersa.addItem(
										new sap.ui.core.Item({
											key : oData.results[i].Persa, 
											text : oData.results[i].Pbtxt}));
							}
							if(_gAuth != "H"){
								if(!oController._vPersa) {
//									oPersa.setSelectedKey(oData.results[0].Persa);
									oController._vPersa = oData.results[0].Persa;
								} else {
//									oPersa.setSelectedKey(oController._vPersa);
								}
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
		} catch(ex) {
			common.Common.log(ex);
		}
		
		
		var vPersa = "";
		if(!oController._vPersa) vPersa = "1000";
		else vPersa = oController._vPersa;
		
//		var filterString = "/?$filter=Persa%20eq%20%27" + vPersa + "%27";
//		filterString += "%20and%20Actda%20eq%20datetime%27" + vActda + "T00%3a00%3a00%27";
		var filterString = "/?$filter=Actda%20eq%20datetime%27" + vActda + "T00%3a00%3a00%27";
		
		var mEmpCodeList = sap.ui.getCore().getModel("EmpSearchCodeList");
		var vEmpCodeList = {EmpCodeListSet : []};
		
		var vControls = ["Stat1", "Persg"];
		
		
		filterString += "%20and%20(";
		for(var i=0; i<vControls.length; i++) {			
			filterString += "Field%20eq%20%27" + vControls[i] + "%27";
			if(i != (vControls.length - 1)) {
				filterString += "%20or%20";
			}
			vEmpCodeList.EmpCodeListSet.push({Field : vControls[i], Ecode : "0000", Etext : oBundleText.getText("LABEL_2834")});	// 2834:-- 선택 --
		}
		filterString += ")";
		
		oCommonModel.read("/EmpCodeListSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vEmpCodeList.EmpCodeListSet.push(oData.results[i]);
							}
							mEmpCodeList.setData(vEmpCodeList);	
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
		
		var oControls = [oStat1, oPersg];
		for(var i=0; i<vEmpCodeList.EmpCodeListSet.length; i++) {
			for(var j=0; j<vControls.length; j++) {
				if(vEmpCodeList.EmpCodeListSet[i].Field == vControls[j]) {
					oControls[j].addItem(new sap.ui.core.Item({key : vEmpCodeList.EmpCodeListSet[i].Ecode, text : vEmpCodeList.EmpCodeListSet[i].Etext}));
				}
			}
		}
		oStat1.setSelectedKey("3");
		
		// 부서코드 지정시 옵션 강제지정
		var oMultiInput = sap.ui.getCore().byId(oController.PAGEID + "_ES_Fulln");
		if(oController._vOrgeh) {
			if(oMultiInput) {
				oMultiInput.addToken(new sap.m.Token({
					key : oController._vOrgeh,
					text : oController._vOrgtx
				}));
			}
			
			oMultiInput.setEnabled((oController._useCustomPernrSelection == "X") ? false : true);
		} else {
			oMultiInput.setEnabled(true);
		}
		
		if(	oController._vEnamefg && oController._vEnamefg == "X"){ // Text 입력 후 복수 또는 Data 가 나오지 않을 경우 검색 조건 자동 입력 후 검색  - List
			var oEname = sap.ui.getCore().byId(oController.PAGEID + "_ES_Ename");
			oEname.setValue(oController._oControl.getValue());
			common.SearchUser1.searchFilterBar();
		}
	},
	
	onBeforeOpenSearchDialog : function(oEvent) {
		var oController = common.SearchUser1.oController;
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persa");
		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_ES_Ename");
		var oFulln = sap.ui.getCore().byId(oController.PAGEID + "_ES_Fulln");
		
		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat1");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persk");
		
		oEname.setValue("");
		oFulln.removeAllTokens();
		oFulln.destroyTokens();
		oFulln.setValue("");
		
		oStat1.removeAllItems();
		oStat1.destroyItems();
		if(oPersg){
			oPersg.removeAllItems();
			oPersg.destroyItems();
		}
		if(oPersk) oPersk.destroyItems();
		
		oPersa.destroyItems();
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		mEmpSearchResult.setData(null);
	},
	
	/*
	 * 사원검색 Dialog를 Close한다.
	 */
	onClose : function(oEvent) {
		var oDialog = sap.ui.getCore().byId(common.SearchUser1.oController.PAGEID + "_ES_Dialog");
		if(oDialog) oDialog.close();
		
		
	},
	
	onKeyUp : function(oEvent) {
		if(oEvent.which == 13) {
			common.SearchUser1.searchFilterBar();
		}
	},
	
	onAfterRendering : function() { 
//		var oController = common.SearchUser1.oController;
//		
//		common.SearchUser1.vHeight = window.innerHeight - 300;
//		
//		$("#" + oController.PAGEID + "_ES_Table").css("height", common.SearchUser1.vHeight);
	},
	
	onChangePersa : function(oEvent) {
		var oController = common.SearchUser1.oController;
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		var oItem = oEvent.getParameter("selectedItem");
		
		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat1");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persk");
		
		oStat1.removeAllItems();
		oPersg.removeAllItems();
		
		oStat1.destroyItems();
		oPersg.destroyItems();
		
		oPersk.destroyItems();
		
		var vActda = "";
		if(!oController._vActda) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
		} else {
			vActda = oController._vActda;
		}
		
		var filterString = "/?$filter=Persa%20eq%20%27" + oItem.getKey() + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + vActda + "T00%3a00%3a00%27";
		
		var mEmpCodeList = sap.ui.getCore().getModel("EmpSearchCodeList");
		var vEmpCodeList = {EmpCodeListSet : []};
		
		var vControls = ["Stat1", "Persg"];
		filterString += "%20and%20(";
		for(var i=0; i<vControls.length; i++) {			
			filterString += "Field%20eq%20%27" + vControls[i] + "%27";
			if(i != (vControls.length - 1)) {
				filterString += "%20or%20";
			}
			vEmpCodeList.EmpCodeListSet.push({Field : vControls[i], Ecode : "0000", Etext : oBundleText.getText("LABEL_2834")});	// 2834:-- 선택 --
		}
		filterString += ")";
		
		oCommonModel.read("/EmpCodeListSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vEmpCodeList.EmpCodeListSet.push(oData.results[i]);
							}
							mEmpCodeList.setData(vEmpCodeList);	
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
		
		var oControls = [oStat1, oPersg ];
		for(var i=0; i<vEmpCodeList.EmpCodeListSet.length; i++) {
			for(var j=0; j<vControls.length; j++) {
				if(vEmpCodeList.EmpCodeListSet[i].Field == vControls[j]) {
					oControls[j].addItem(new sap.ui.core.Item({key : vEmpCodeList.EmpCodeListSet[i].Ecode, text : vEmpCodeList.EmpCodeListSet[i].Etext}));
				}
			}
		}
		oStat1.setSelectedKey("3");
	},
	
	onChangePersg : function(oEvent) {
		var oController = common.SearchUser1.oController;
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		var oItem = oEvent.getParameter("selectedItem");
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persa");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persk");
		
		oPersk.destroyItems();
		
		if(oItem.getKey() == "0000") return;
		
		var vActda = "";
		if(!oController._vActda) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
		} else {
			vActda = oController._vActda;
		}
		
		var filterString = "/?$filter=Persa%20eq%20%27" + oPersa.getSelectedKey() + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + vActda + "T00%3a00%3a00%27";
		filterString += "%20and%20Field%20eq%20%27" + "Persk" + "%27";
		filterString += "%20and%20Excod%20eq%20%27" + oItem.getKey() + "%27";
		
		oPersk.addItem(new sap.ui.core.Item({key : "0000", text : oBundleText.getText("LABEL_2834")}));	// 2834:-- 선택 --
		
		oCommonModel.read("/EmpCodeListSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								oPersk.addItem(
										new sap.ui.core.Item({
											key : oData.results[i].Ecode, 
											text : oData.results[i].Etext}));
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
	},
	
	onClickMore : function(oEvent) {
		var oController = common.SearchUser1.oController;
		
		var oControl = oEvent.getSource();
		var vText = oControl.getText();
		
		
		var oFilter6 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Filter6");
		
		if(vText == "More" ) {
			oFilter6.setVisible(true);
			oControl.setText("Hide");
		} else {
			oFilter6.setVisible(false);
			oControl.setText("More");
		}
	},
	
	onClick : function(oEvent) {
		var oController = common.SearchUser1.oController;
		var oTable = sap.ui.getCore().byId(oController.PAGEID+"_EmpSearchResult_Table");
		var vContext = oEvent.getParameters().rowBindingContext;
		var oTableModel = oTable.getModel();
		if(vContext == undefined || oTableModel.getProperty(vContext.sPath)==null){
			return;
		}
        
		common.SearchUser1.clicks = common.SearchUser1.clicks + 1;
	        
	     if(common.SearchUser1.clicks == 1) {
	          setTimeout( common.SearchUser1.clearClicks, 500);
	     } else if(common.SearchUser1.clicks == 2) {
	    	 common.SearchUser1._vSPath = vContext.sPath;
	     }
	},
	
	clearClicks : function () {
		var oController = common.SearchUser1.oController;
		common.SearchUser1.clicks = 0;
		common.SearchUser1._vSPath = -1;
        
	},
	
	onDblClick : function(oEvent){
		var oController = common.SearchUser1.oController;
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table");
		if(common.SearchUser1._vSPath == null || common.SearchUser1._vSPath == -1) return ;
		var vIndex = common.SearchUser1._vSPath.replace("/EmpSearchResultSet/","");
		oTable.clearSelection();
		oTable.setSelectedIndex(parseInt(vIndex));
		oController.onESSelectPerson();
	},
	
	
};