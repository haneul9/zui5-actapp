jQuery.sap.declare("ZUI5_HR_ActionRequest.control.ZzjobrlSearch");

ZUI5_HR_ActionRequest.control.ZzjobrlSearch = {
	/** 
	* @memberOf ZUI5_HR_ActionRequest.control.OrgSearch
	*/	
	
	onKeyUp : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		var oData = sap.ui.getCore().byId(oController.PAGEID + "_ZzjobrlSearchDialog").getModel().getData(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_ZzjobrlSearchDialog_Table"),
			oJSonModel = oTable.getModel();
		
		
//		if(!oData || !oData.Data){
//			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1037"), {title : oBundleText.getText("LABEL_0053")});	// 1037:검색어를 입력하여 주세요.
//			return;
//		}
		
		var onProcess = function(){
			var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV");
			var vCode = "", vText = "", 
				Datas = { Data : [] } , errData = {}, aFilters = [],
			    vPath = "/JobrlCodeSet",
			    vOrgeh = oController._DetailTableJSonModel.getProperty(
						sap.ui.getCore().byId(oController.vCallControlId).getBindingContext().sPath+ "/Orgeh");
			
			if(!common.Common.checkNull(vOrgeh) && vOrgeh * 1 != 0 ){
				aFilters.push(new sap.ui.model.Filter('Orgeh', sap.ui.model.FilterOperator.EQ, vOrgeh)); 
			}
			
			if(!common.Common.checkNull(oData.Data.Keyword)){
				aFilters.push(new sap.ui.model.Filter('Zzjobrlt', sap.ui.model.FilterOperator.EQ, oData.Data.Keyword)); 
			}
			
			
			oModel.read(vPath, {
				async : false,
				filters : [ aFilters],
				success : function(data, res) {
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							Datas.Data.push(data.results[i]);
						}
					}
				}, 
				error : function(Res) {
					errData = common.Common.parseError(Res);
				}
			});
			
			oController.BusyDialog.close();
			oJSonModel.setData(Datas);
			if(errData.Error && errData.Error == "E"){
				sap.m.MessageBox.alert(errData.ErrorMessage);
				return ;
			}
		};
		oController.BusyDialog.open();
		setTimeout(onProcess, 100);
	},

	onBeforeOpenSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		var oJsonModel = sap.ui.getCore().byId(oController.PAGEID + "_ZzjobrlSearchDialog").getModel(),
		    tempData = { Data : { Keyword : ""}};
		
		oJsonModel.setData(tempData);
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ZzjobrlSearchDialog_Table");
		var _JSonModel =  oTable.getModel();
		var vDatas = { Data : []}
		_JSonModel.setData(vDatas);
		oTable.setMode(sap.m.ListMode.Delete); // Delete mode selection
		oTable.setMode(sap.m.ListMode.SingleSelectLeft); // Put it back.
		
	},
	
	onAfterOpenSearchDialog : function(oEvent){
		
		
		
		
	},
	
	onAfterCloseSearchDialog : function(oEvent){
		
		
	},
	
	onConfirmSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ZzjobrlSearchDialog_Table");
		var vContexts = oTable.getSelectedContexts(true);
		
		if(vContexts.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0547"));	// 547:Data를  선택하여 주십시오.
			return;
		}
		oController._DetailTableJSonModel.setProperty(
				sap.ui.getCore().byId(oController.vCallControlId).getBindingContext().sPath+ "/Zzjob", vContexts[0].getProperty("Zzjob")); 
		oController._DetailTableJSonModel.setProperty(
				sap.ui.getCore().byId(oController.vCallControlId).getBindingContext().sPath+ "/Zzjobrl", vContexts[0].getProperty("Zzjobrl")); 
		oController._DetailTableJSonModel.setProperty(
				sap.ui.getCore().byId(oController.vCallControlId).getBindingContext().sPath+ "/Zzjobrlt", vContexts[0].getProperty("Zzjobrlt")); 
		
		oController._ZzjobrlSearchDialog.close();
	},
	
	onCloseSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		var oControl = sap.ui.getCore().byId(oController.vCallControlId);
		if(oControl){
			oControl.setValue("");
			oController._DetailTableJSonModel.setProperty(
					sap.ui.getCore().byId(oController.vCallControlId).getBindingContext().sPath+ "/Zzjob", ""); 
			oController._DetailTableJSonModel.setProperty(
					sap.ui.getCore().byId(oController.vCallControlId).getBindingContext().sPath+ "/Zzjobrl", ""); 
			oController._DetailTableJSonModel.setProperty(
					sap.ui.getCore().byId(oController.vCallControlId).getBindingContext().sPath+ "/Zzjobrlt", ""); 
		}
		oController._ZzjobrlSearchDialog.close();
	},
	
};