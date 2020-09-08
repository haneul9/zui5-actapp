jQuery.sap.declare("ZUI5_HR_ActionRequest.control.ObjectSearch");

ZUI5_HR_ActionRequest.control.ObjectSearch = {
	/** 
	* @memberOf ZUI5_HR_ActionRequest.control.OrgSearch
	*/	
	
	onKeyUp : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		var oData = sap.ui.getCore().byId(oController.PAGEID + "_SearchDialog").getModel().getData(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_SearchDialog_Table"),
			oJSonModel = oTable.getModel(),
			afilters = [];
		
		if(oData.Data && !common.Common.checkNull(oData.Data.Keyword)){
			afilters.push(new sap.ui.model.Filter('Text', sap.ui.model.FilterOperator.EQ, oData.Data.Keyword));
		}
		
		
//		if(!oData || !oData.Data){
//			sap.m.MessageBox.alert(oBundleText.getText("LABEL_1037"), {title : oBundleText.getText("LABEL_0053")});	// 1037:검색어를 입력하여 주세요.
//			return;
//		}
		
		var onProcess = function(){
			var oModel = sap.ui.getCore().getModel("ZHR_ACTION_SRV");
			var vCode = "", vText = "", vPath = "",
				Datas = { Data : [] } , errData = {}
			switch (oController.vCallControlType) {
				case "Stell": //직무
					vPath = "/StellCodeSet";
					break;
				case "Zzjikgb": //직군
					vPath = "/ZzjikgbCodeSet";
					break; 
				case "Zzjikln": //직위 
					vPath = "/ZzjiklnCodeSet";
					break; 
				case "Zzjikch": //직책
				case "Zzconjik1": // 겸직 직책
					vPath = "/ZzjikchCodeSet";
					break; 
				case "Zzstell": //기타직무
					vPath = "/ZzstellCodeSet";
					break;
			}
			
			oModel.read(vPath, {
				async : false,
				filters : [
					afilters
				],
				success : function(data, res) {
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							if(oController.vCallControlType == "Stell"){
								data.results[i].Code = data.results[i].Stell;
								data.results[i].Text = data.results[i].Stltx;
							}
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
	
	onClickSearchTable : function(oEvent){
		
		
	},
	
	onBeforeOpenSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		var oJsonModel = sap.ui.getCore().byId(oController.PAGEID + "_SearchDialog").getModel(),
		    tempData = { Data : { Keyword : "", Title : "", FilterVisible : true }};
		
		switch (oController.vCallControlType) {
			case "Stell": //직무
				tempData.Data.Title = oBundleText.getText("LABEL_1032");	// 1032:직무 검색
				break;
			case "Zzjikgb": //직군
				tempData.Data.Title = oBundleText.getText("LABEL_2175");	// 2175:직군 검색
				tempData.Data.FilterVisible = false;
				break; 
			case "Zzjikln": //직위
				tempData.Data.Title = oBundleText.getText("LABEL_2186");	// 2186:직위 검색
				break; 
			case "Zzjikch": //직책
				tempData.Data.Title = oBundleText.getText("LABEL_2190");	// 2190:직책 검색
				break; 
			case "Zzconjik1": // 겸직 직책
				tempData.Data.Title = oBundleText.getText("LABEL_1483");	// 1483:겸직 직책 검색
				break; 
			case "Zzstell": //기타직무
				tempData.Data.Title = oBundleText.getText("LABEL_1617");	// 1617:기타직무 검색
				break;
		}
		oJsonModel.setData(tempData);
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_SearchDialog_Table");
		var _JSonModel =  oTable.getModel();
		var vDatas = { Data : []}
		_JSonModel.setData(vDatas);
		oTable.setMode(sap.m.ListMode.Delete); // Delete mode selection
		oTable.setMode(sap.m.ListMode.SingleSelectLeft); // Put it back.
		
		if(oController.vCallControlType == "Zzjikgb"){
			ZUI5_HR_ActionRequest.control.ObjectSearch.onKeyUp();
		}
		
	},
	
	onAfterOpenSearchDialog : function(oEvent){
		
		
		
		
	},
	
	onAfterCloseSearchDialog : function(oEvent){
		
		
	},
	
	onConfirmSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_SearchDialog_Table");
		var vContexts = oTable.getSelectedContexts(true);
		
		if(vContexts.length < 1){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0547"));	// 547:Data를  선택하여 주십시오.
			return;
		}
		var vText = "";
		
		switch (oController.vCallControlType) {
			case "Stell": //직무
				vText = "Stltx";
				break;
			case "Zzjikgb": //직군
				vText = "Zzjikgbt";
				break; 
			case "Zzjikln": //직위
				vText = "Zzjiklnt";
				break; 
			case "Zzjikch": //직책
				vText = "Zzjikcht";
				break; 
			case "Zzconjik1": // 겸직 직책
				vText = "Zzconjik1t";
				break; 
			case "Zzstell": //기타직무
				vText = "Zzstellt";
				break;
		}
		
		oController._DetailTableJSonModel.setProperty(
				sap.ui.getCore().byId(oController.vCallControlId).getBindingContext().sPath+ "/"+oController.vCallControlType, vContexts[0].getProperty("Code")); 
		oController._DetailTableJSonModel.setProperty(
				sap.ui.getCore().byId(oController.vCallControlId).getBindingContext().sPath+ "/"+vText, vContexts[0].getProperty("Text")); 
		
		oController._SearchDialog.close();
	},
	
	onCloseSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_HR_ActionRequest.ZUI5_HR_ActionRequestDetail");
		var oController = oView.getController();
		var oControl = sap.ui.getCore().byId(oController.vCallControlId);
		if(oControl){
			oControl.setValue("");
			oController._DetailTableJSonModel.setProperty(
					sap.ui.getCore().byId(oController.vCallControlId).getBindingContext().sPath+ "/"+oController.vCallControlType, ""); 
		}
		oController._SearchDialog.close();
	},
	
};