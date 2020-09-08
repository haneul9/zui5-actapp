jQuery.sap.declare("common.SearchOrg");
jQuery.sap.require("common.Common");

var OrgTree = null;

/** 
* 사원검색의 Dialog를 위한 JS 이다.
* @Create By 정명구
*/

common.SearchOrg = {
	/** 
	* @memberOf common.SearchOrg
	*/	
	
	oController : null,
	vActionType : "Multi",
	vCallControlId : "",
	vCallControlType : "MultiInput",
	vNoPersa : false,
	clicks : 0,
	_vSPath : -1,
	/*
	 * 검색어를 이용하여 사원을 검섹 처리
	 * 검색 대상은 조직 및 사원명이다.
	 */
	searchOrg : function(oEvent) {
		
		var oFilters = [];
		
		var oDatum = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Datum");
		var oStext = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Stext");
		
//		if(oStext.getValue() == "") {
//			var vMsg = oBundleText.getText("LABEL_0536");	// 536:검색어를 입력하여 주시기 바랍니다.
//			sap.m.MessageBox.alert(vMsg);
//			return;
//		}
		
		var vPersa = common.SearchOrg.oController._vPersa;
//		oController.BusyDialog.open();
		var filterString = "?$filter=Stype eq '1'" ;
		oFilters.push(new sap.ui.model.Filter("Stype", sap.ui.model.FilterOperator.EQ, '1'));
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
		
		if(oDatum.getValue() != "") {
			filterString += " and Datum%20eq%20datetime%27" + dateFormat.format(new Date(oDatum.getValue()))  + "T00%3a00%3a00%27";
			oFilters.push(new sap.ui.model.Filter("Datum", sap.ui.model.FilterOperator.EQ, oDatum.getValue()));
		}
		
		if(oStext.getValue() != "") {
			filterString += " and Stext eq '" + encodeURIComponent(oStext.getValue()) + "'";
			oFilters.push(new sap.ui.model.Filter("Stext", sap.ui.model.FilterOperator.EQ, (oStext.getValue())));
		}
		
		// Yflag == 'X'일 경우 하위부서만 검색
		if(common.SearchOrg.oController._vYflag && common.SearchOrg.oController._vYflag == "X") {
			oFilters.push(new sap.ui.model.Filter("Yflag", sap.ui.model.FilterOperator.EQ, "X"));
		}
		
		// 권한 추가
		if(_gAuth){
			oFilters.push(new sap.ui.model.Filter("Actty", sap.ui.model.FilterOperator.EQ, _gAuth));
		}
		if(gReqAuth) {
			oFilters.push(new sap.ui.model.Filter("ReqAuth", sap.ui.model.FilterOperator.EQ, gReqAuth));
		}
		
		var oTable = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_TABLE");
//		oTable.bindRows("/OrgListSet", null, oFilters);
		
		var _JSonModel =  oTable.getModel();
		var vDatas = { OrgListSet : []}
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
//		var oPath = "/OrgListSet" +filterString;
//		oModel.read(
//				oPath,
//				null,
//				null,
//				false,
//				function(data,res){
//					if(data && data.results.length){
//						for(var i=0;i<data.results.length;i++){
//							vDatas.OrgListSet.push(data.results[i]);
//						}
//					}
//				},
//				function(res){console.log(res);}
//		);	
//		
//		_JSonModel.setData(vDatas);
//		oTable.setModel(_JSonModel);
//		oTable.bindRows("/OrgListSet");
		

		function Search() {
			var errData = {};
			oModel.read("/OrgListSet", {
				async : false,
				filters : oFilters,
				success : function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							vDatas.OrgListSet.push(data.results[i]);
						}
					}
				},
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			_JSonModel.setData(vDatas);
			oTable.setModel(_JSonModel);
			oTable.bindRows("/OrgListSet");
			
			if(errData.Error == "E") {
				oController.BusyDialog.close();
				sap.m.MessageBox.show(errData.ErrorMessage);
			}
			common.SearchOrg.oController.BusyDialog.close();			
		}
		
		common.SearchOrg.oController.BusyDialog.open();
		setTimeout(Search, 100);
	},
	
	searchOrgNext : function(oEvent) {
		var oStext = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Stext");
		if(oStext.getValue() != "") {
			OrgTree.findItem(oStext.getValue(), 0);
		}
	},
	
	searchOrgPrev : function(oEvent) {
		var oStext = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Stext");
		if(oStext.getValue() != "") {
			OrgTree.findItem(oStext.getValue(), 1);
		}
	},
	
	/*
	 * 사원검색 Dialog를 Close한다.
	 */
	onClose : function(oEvent) {
		var oDialog = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Dialog");
		var oControl = sap.ui.getCore().byId(common.SearchOrg.vCallControlId);
		if(oControl){
			oControl.setValue("");
			oControl.removeAllCustomData();
		}
		if(oDialog) oDialog.close();
		if(common.SearchOrg.oController.onAfterOrgehClose) common.SearchOrg.oController.onAfterOrgehClose(common.SearchOrg.oController);
	},
	
	/*
	 * 검색어를 입력하고 Enter 키를 클릭했을때 처리하는 내용
	 */
	onKeyUp : function(oEvent) {
		if(oEvent.which == 13) {
			common.SearchOrg.searchOrg();
		}
	},
	
	/*
	 * 검색화면애서 선택된 사원에 대해 처리하는 내용이다.
	 * 선택된 사원정보를 가지고 "SelectPerson" Event를 발생한다.
	 */
	onConfirm : function(oEvent) {
		var vSelectedOrg = [];
		var oTable = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_TABLE");
		var oModel = oTable.getModel();
		var vContexts = oTable.getSelectedIndices();
		
		if(vContexts && vContexts.length) {
			for(var i=0; i<vContexts.length; i++) {
				var _selPath = oTable.getContextByIndex(vContexts[i]).sPath;
				var vOrgInfo = {};
				vOrgInfo.Orgeh = oModel.getProperty(_selPath +"/Orgeh");
				vOrgInfo.Stext = oModel.getProperty(_selPath +"/Stext");
				vOrgInfo.Zzempwp = oModel.getProperty(_selPath +"/Zzempwp");
				vOrgInfo.Zzempwptx = oModel.getProperty(_selPath +"/Zzempwptx");
				
				vSelectedOrg.push(vOrgInfo);
			}				
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0538"));	// 538:부서를 선택해 주시기 바랍니다.
			return;
		}

		
		if(common.SearchOrg.vCallControlType == "MultiInput") {
			var oMultiInput = sap.ui.getCore().byId(common.SearchOrg.vCallControlId);
			if(oMultiInput) {
				for(var i=0; i<vSelectedOrg.length; i++) {
					oMultiInput.addToken(new sap.m.Token({
						key : vSelectedOrg[i].Orgeh,
						text : vSelectedOrg[i].Stext
					}));
				}
			}
		} else if(common.SearchOrg.vCallControlType == "Input") {
			var oInput = sap.ui.getCore().byId(common.SearchOrg.vCallControlId);
			if(oInput) {
				if(vSelectedOrg && vSelectedOrg.length) {
					if(vSelectedOrg.length > 1){
						sap.m.MessageBox.alert(oBundleText.getText("LABEL_0546"));	// 546:하나의 부서를 선택해 주시기 바랍니다.
						return;
					}
					oInput.setValue(vSelectedOrg[0].Stext);
					oInput.removeAllCustomData();
					oInput.addCustomData(new sap.ui.core.CustomData({key : "Orgeh", value : vSelectedOrg[0].Orgeh}));
					if(common.SearchOrg.oController.onAfterOrgeh) common.SearchOrg.oController.onAfterOrgeh(common.SearchOrg.oController, vSelectedOrg[0].Orgeh); 
				}
			}
			
			var vTempIds = common.SearchOrg.vCallControlId.split("_");
			var vPrefix = "";
			for(var i=0; i<(vTempIds.length - 1); i++) {
				vPrefix += vTempIds[i] + "_";
			}
			
			vPrefix = vPrefix.replace("Dis_", "");
			
			var oControl = sap.ui.getCore().byId(vPrefix + "Zzempwp");
			if(oControl) {				
				var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
				var vDatum = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Datum").getValue();
				var vZzempwp = "";
				var vZzempwptx = "";
				oModel.read (
						"/OrgWorkplaceSet/?$filter=Orgeh%20eq%20%27" + vSelectedOrg[0].Orgeh + "%27" 
						+ "%20and%20Datum%20eq%20datetime%27" + vDatum + "T00%3a00%3a00%27",
						null, 
						null, 
						false, 
						function(oData, oResponse) {
							if(oData && oData.results.length) {
								vZzempwp = oData.results[0].Objid;
								vZzempwptx = oData.results[0].Stext;
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
				);
				if(vZzempwp != null && vZzempwp != ""){
					if(typeof oControl.setSelectedKey == "function") {
						oControl.setSelectedKey(vZzempwp);
					} else if(typeof oControl.setValue == "function") {
						oControl.setValue(vZzempwptx);
						var oCustomData = oControl.getCustomData();
						if(oCustomData) {
							oControl.removeAllCustomData();
				    		oControl.destroyCustomData();
							oControl.addCustomData(new sap.ui.core.CustomData({
								key : "Zzempwp",
								value : vZzempwp
							}));
							for(var i=1; i<oCustomData.length; i++) {
					    		oControl.addCustomData(oCustomData[i]);
					    	}
						}
					} 
				}
			}
		}
		
		//조직검색 Dialog를 Close한다.
		var oDialog = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Dialog");
		if(oDialog) oDialog.close();
	},
	
	onBeforeOpenSearchOrgDialog : function(oEvent) {
		var oTable = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_TABLE");
		var oStext = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Stext");
	
		var oDatum = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Datum");
		if(common.SearchOrg.oController._vActda != null) {
			oDatum.setValue(common.SearchOrg.oController._vActda);
		}

		oTable.unbindRows();
		oStext.setValue("");
	},
	
	onAfterOpenSearchOrgDialog : function(oEvent) {
		
	},
	
	onAfterCloseSearchOrgDialog : function(oEvent) {
		common.SearchOrg.vNoPersa = false;
	},
	
	onClick : function(oEvent) {
		var oController = common.SearchOrg.oController;
		var oTable = sap.ui.getCore().byId(oController.PAGEID+"_COMMON_SEARCH_ORG_TABLE");
		var vContext = oEvent.getParameters().rowBindingContext;
		var oTableModel = oTable.getModel();
		if(vContext == undefined || oTableModel.getProperty(vContext.sPath)==null){
			return;
		}
        
		common.SearchOrg.clicks = common.SearchOrg.clicks + 1;
	        
	     if(common.SearchOrg.clicks == 1) {
	          setTimeout( common.SearchOrg.clearClicks, 500);
	     } else if(common.SearchOrg.clicks == 2) {
	    	 common.SearchOrg._vSPath = vContext.sPath;
	     }
	},
	
	clearClicks : function () {
		var oController = common.SearchOrg.oController;
		common.SearchOrg.clicks = 0;
		common.SearchOrg._vSPath = -1;
        
	},
	
	onDblClick : function(oEvent){
		var oController = common.SearchOrg.oController;
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_COMMON_SEARCH_ORG_TABLE");
		if(common.SearchOrg._vSPath == null || common.SearchOrg._vSPath == -1) return ;
		var vIndex = common.SearchOrg._vSPath.replace("/OrgListSet/","");
		oTable.clearSelection();
		oTable.setSelectedIndex(parseInt(vIndex));
		common.SearchOrg.onConfirm();
	},
	
};