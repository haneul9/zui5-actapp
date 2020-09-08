jQuery.sap.declare("common.SearchActivity");

/**
 * Activity Dialog 의 Action Control
 * 
 * @memberOf SearchActivity
 */
common.SearchActivity = {
	oController : "",
	
	onPressActivity : function(oController) {
		if(common.Common.checkNull(oController)){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2831"), {	// 2831:Controller 변수를 조회하지 못하였습니다.\n IT 운영센터에 문의바랍니다.
				
			});
			return;
		}
		common.SearchActivity.oController = oController;
		
		if(!common.SearchActivity.oController._ActivityDialog) {
			common.SearchActivity.oController._ActivityDialog = sap.ui.jsfragment("fragment.ActivityDialog", common.SearchActivity.oController);
			oView.addDependent(common.SearchActivity.oController._ActivityDialog);
		}
		
		var oDialogTable = sap.ui.getCore().byId(common.SearchActivity.oController.PAGEID + "_ActivityTable"),
		oDialogTableModel = oDialogTable.getModel();
		oDialogTableModel.setData({Data : []});
	
		oDialogTableModel.setSizeLimit(1000);
	    oDialogTable.setMode(sap.m.ListMode.None);
	    oDialogTable.setMode(sap.m.ListMode.SingleSelectLeft);
	    
	    var oKtext = sap.ui.getCore().byId(common.SearchActivity.oController.PAGEID + "_ActivityDialog_Ktext");
	    oKtext.setValue("");
	    
	    common.SearchActivity.oController._ActivityDialog.open();
	},
	
	onSearchKeyUp : function(oEvent){
		if(oEvent.which == 13) {
			common.SearchActivity.onSearchActivity();
		}
	},
	
	onSearchActivity : function(oEvent) {
		var oDialogTable = sap.ui.getCore().byId(common.SearchActivity.oController.PAGEID + "_ActivityTable"),
		oDialogTableModel = oDialogTable.getModel(),
		vData = {Data : []},
		oKtext = sap.ui.getCore().byId(common.SearchActivity.oController.PAGEID + "_ActivityDialog_Ktext");
		
		if(common.Common.checkNull(oKtext.getValue())){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_0536"), {	// 536:검색어를 입력하여 주시기 바랍니다.
				
			});
			return;
		}
		
		oDialogTable.setMode(sap.m.ListMode.None);
	    oDialogTable.setMode(sap.m.ListMode.SingleSelectLeft);
		    
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"), aFilters = [], vLang = "3" ; // 한국어 Default
		if(!common.Common.checkNull(common.SearchActivity.oController._vLangu)) vLang = common.SearchActivity.oController._vLangu;
		aFilters.push(new sap.ui.model.Filter('Langu', sap.ui.model.FilterOperator.EQ, vLang ));
		aFilters.push(new sap.ui.model.Filter('Ktext', sap.ui.model.FilterOperator.EQ, oKtext.getValue()));
		
		oModel.read("/AufnrGjahrListSet", {
			async : false,
			filters : aFilters,
			success : function(data, res) {
				if(data.results && data.results.length) {
					for(var i = 0; i < data.results.length; i++){
						vData.Data.push(data.results[i]);
					}
				}
			},
			error : function(Res) {
				
			}
		});
		oDialogTableModel.setData(vData);
	},
	
	
	onSelectActivity : function(oEvent){
	    var oDialogTable = sap.ui.getCore().byId(common.SearchActivity.oController.PAGEID + "_ActivityTable"),
	    vIdx= oDialogTable.getSelectedContexts();
	    
	    if(vIdx.length == 0){
			sap.m.MessageBox.alert(oBundleText.getText("LABEL_2832"), {title : oBundleText.getText("LABEL_0053")});	// 53:오류, 2832:Activity를 선택하여 주십시오.
			return;
	    }
		
		var vSelectedData = oDialogTable.getModel().getProperty(vIdx[0].sPath);
		
		common.SearchActivity.oController._DetailJSonModel.setProperty("/Data/Aufnr", vSelectedData.Aufnr );
		common.SearchActivity.oController._DetailJSonModel.setProperty("/Data/Aufnrtx", vSelectedData.Ktext );
		
		common.SearchActivity.oController._ActivityDialog.close();
	},	
}