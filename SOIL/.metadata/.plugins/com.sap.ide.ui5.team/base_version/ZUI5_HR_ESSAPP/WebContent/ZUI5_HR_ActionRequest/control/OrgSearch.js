jQuery.sap.declare("ZUI5_HR_ActionRequest.control.OrgSearch");
jQuery.sap.require("common.Common");

var OrgTree = null;

/** 
* 사원검색의 Dialog를 위한 JS 이다.
* @Create By 정명구
*/

ZUI5_HR_ActionRequest.control.OrgSearch = {
	/** 
	* @memberOf ZUI5_HR_ActionRequest.control.OrgSearch
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
	OrgSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		var oFilters = [];
		
		var oDatum = sap.ui.getCore().byId(oController.PAGEID + "_OrgSearch_Datum");
		var oStext = sap.ui.getCore().byId(oController.PAGEID + "_OrgSearch_Stext");
		
		if(oStext.getValue() == "") {
			var vMsg = oBundleText.getText("LABEL_0536");	// 536:검색어를 입력해 주시기 바랍니다.
			sap.m.MessageBox.alert(vMsg);
			return;
		}
		
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
		
		if(gReqAuth) {
			oFilters.push(new sap.ui.model.Filter("ReqAuth", sap.ui.model.FilterOperator.EQ, gReqAuth));
		}
		
		if(_gAuth) {
			oFilters.push(new sap.ui.model.Filter("Actty", sap.ui.model.FilterOperator.EQ, _gAuth));
		}
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_OrgSearch_TABLE");
		
		var _JSonModel =  oTable.getModel();
		var vDatas = { OrgListSet : []}
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");

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
//			oTable.bindItems("/OrgListSet");
			
			if(errData.Error == "E") {
				oController.BusyDialog.close();
				sap.m.MessageBox.show(errData.ErrorMessage);
			}
			oController.BusyDialog.close();			
		}
		
		oController.BusyDialog.open();
		setTimeout(Search, 100);
	},
	
	/*
	 * 사원검색 Dialog를 Close한다.
	 */
	onClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		var oDialog = sap.ui.getCore().byId(oController.PAGEID + "_OrgSearch_Dialog");
		var oControl = sap.ui.getCore().byId(oController.vCallControlId);
		if(oControl){
			oControl.setValue("");
			oController._DetailTableJSonModel.setProperty(
					sap.ui.getCore().byId(oController.vCallControlId).getBindingContext().sPath+ "/" + oController.vCallControlType, ""); 
		}
		if(oDialog) oDialog.close();
	},
	
	/*
	 * 검색어를 입력하고 Enter 키를 클릭했을때 처리하는 내용
	 */
	onKeyUp : function(oEvent) {
		if(oEvent.which == 13) {
			ZUI5_HR_ActionRequest.control.OrgSearch.OrgSearch();
		}
	},
	
	/*
	 * 검색화면애서 선택된 사원에 대해 처리하는 내용이다.
	 * 선택된 사원정보를 가지고 "SelectPerson" Event를 발생한다.
	 */
	onConfirm : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		
		var vSelectedOrg = [];
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_OrgSearch_TABLE");
		var oModel = oTable.getModel();
		var vContexts = oTable.getSelectedContexts(true);
		
		if(vContexts && vContexts.length) {
			for(var i=0; i<vContexts.length; i++) {
				var _selPath = vContexts[i].sPath;
				var vOrgInfo = {};
				vOrgInfo.Orgeh = oModel.getProperty(_selPath +"/Orgeh");
				vOrgInfo.Stext = oModel.getProperty(_selPath +"/Stext");
				vSelectedOrg.push(vOrgInfo);
			}				
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0538"));	// 538:부서를 선택해 주시기 바랍니다.
			return;
		}

		
		var oInput = sap.ui.getCore().byId(oController.vCallControlId);
		if(oInput) {
			if(vSelectedOrg && vSelectedOrg.length) {
				if(vSelectedOrg.length > 1){
					sap.m.MessageBox.alert(oBundleText.getText("LABEL_0546"));	// 546:하나의 부서를 선택해 주시기 바랍니다.
					return;
				}
				oInput.setValue(vSelectedOrg[0].Stext);
				
				var vText = "";
				switch (oController.vCallControlType) {
				case "Orgeh": //조직
					vText = "Orgtx";
					break;
				case "Zzconorg": //겸직 조직
					vText = "Zzconorg1t";
					break; 
				case "Zzidsorg": //사내
					vText = "Zzidsorgt";
					break; 
				case "Zzodsorg": //사외
					vText = "Zzodsorgt";
					break;
			}
			
			oController._DetailTableJSonModel.setProperty(
					sap.ui.getCore().byId(oController.vCallControlId).getBindingContext().sPath+ "/"+oController.vCallControlType, vSelectedOrg[0].Orgeh); 
			oController._DetailTableJSonModel.setProperty(
					sap.ui.getCore().byId(oController.vCallControlId).getBindingContext().sPath+ "/"+vText, vSelectedOrg[0].Stext); 
			
			// 직무 Data Clear
			oController._DetailTableJSonModel.setProperty(
					sap.ui.getCore().byId(oController.vCallControlId).getBindingContext().sPath+ "/Zzjob", ""); 
			oController._DetailTableJSonModel.setProperty(
					sap.ui.getCore().byId(oController.vCallControlId).getBindingContext().sPath+ "/Zzjobrl", ""); 
			oController._DetailTableJSonModel.setProperty(
					sap.ui.getCore().byId(oController.vCallControlId).getBindingContext().sPath+ "/Zzjobrlt", ""); 
			
			}
		}
			
		//조직검색 Dialog를 Close한다.
		var oDialog = sap.ui.getCore().byId(oController.PAGEID + "_OrgSearch_Dialog");
		if(oDialog) oDialog.close();
	},
	
	onBeforeOpenOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_OrgSearch_TABLE");
		var oStext = sap.ui.getCore().byId(oController.PAGEID + "_OrgSearch_Stext");
	
		var oDatum = sap.ui.getCore().byId(oController.PAGEID + "_OrgSearch_Datum");
		if(oController._vActda != null) {
			oDatum.setValue(oController._vActda);
		}
		
		var _JSonModel =  oTable.getModel();
		var vDatas = { OrgListSet : []}
		_JSonModel.setData(vDatas);
		oStext.setValue("");
		
		oTable.setMode(sap.m.ListMode.Delete); // Delete mode selection
		oTable.setMode(sap.m.ListMode.SingleSelectLeft); // Put it back.
		
		var oJsonModel = sap.ui.getCore().byId(oController.PAGEID + "_OrgSearch_Dialog").getModel(),
	    tempData = { Data : { Title : ""}};
	
		switch (oController.vCallControlType) {
			case "Orgeh": //조직
				tempData.Data.Title = oBundleText.getText("LABEL_0530");	// 530:조직 검색
				break;
			case "Zzconorg": //겸직 조직
				tempData.Data.Title = oBundleText.getText("LABEL_0515");	// 515:겸직 조직 검색
				break; 
			case "Zzidsorg": //사내
				tempData.Data.Title = oBundleText.getText("LABEL_0517");	// 517:사내 조직 검색
				break; 
			case "Zzodsorg": //사외
				tempData.Data.Title = oBundleText.getText("LABEL_0518");	// 518:사외 조직 검색
				break;
		}
		oJsonModel.setData(tempData);
	},
	
	onAfterOpenOrgSearchDialog : function(oEvent) {
		
	},
	
	onAfterCloseOrgSearchDialog : function(oEvent) {
		
	},
	
	onClick : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID+"_OrgSearch_TABLE");
		var vContext = oEvent.getParameters().rowBindingContext;
		var oTableModel = oTable.getModel();
		if(vContext == undefined || oTableModel.getProperty(vContext.sPath)==null){
			return;
		}
        
		ZUI5_HR_ActionRequest.control.OrgSearch.clicks = ZUI5_HR_ActionRequest.control.OrgSearch.clicks + 1;
	        
	     if(ZUI5_HR_ActionRequest.control.OrgSearch.clicks == 1) {
	          setTimeout( ZUI5_HR_ActionRequest.control.OrgSearch.clearClicks, 500);
	     } else if(ZUI5_HR_ActionRequest.control.OrgSearch.clicks == 2) {
	    	 ZUI5_HR_ActionRequest.control.OrgSearch._vSPath = vContext.sPath;
	     }
	},
	
	clearClicks : function () {
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		ZUI5_HR_ActionRequest.control.OrgSearch.clicks = 0;
		ZUI5_HR_ActionRequest.control.OrgSearch._vSPath = -1;
        
	},
	
	onDblClick : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_OrgSearch_TABLE");
		if(ZUI5_HR_ActionRequest.control.OrgSearch._vSPath == null || ZUI5_HR_ActionRequest.control.OrgSearch._vSPath == -1) return ;
		var vIndex = ZUI5_HR_ActionRequest.control.OrgSearch._vSPath.replace("/OrgListSet/","");
		oTable.clearSelection();
		oTable.setSelectedIndex(parseInt(vIndex));
		ZUI5_HR_ActionRequest.control.OrgSearch.onConfirm();
	},
	
};