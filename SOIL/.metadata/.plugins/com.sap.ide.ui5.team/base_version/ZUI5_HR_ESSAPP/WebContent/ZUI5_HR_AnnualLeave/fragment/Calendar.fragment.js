sap.ui.jsfragment("ZUI5_HR_AnnualLeave.fragment.Calendar", {
	
	createContent : function(oController) {
		
		var oCalendar = new sap.ui.unified.Calendar(oController.PAGEID + "_Calendar",{
			
			select : oController.onSelectDate 
		});
		
		
		var oDialog = new sap.m.Dialog({
			content : [
				new sap.ui.core.HTML({
					content : "<div style='height : 11px;'/>"
				}),
				oCalendar
			],
			endButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0017"), // 17:닫기
				press : function(oEvent){
					oDialog.close();
				}
			}),
			contentWidth : "300px",
			showHeader : true,
			title : oBundleText.getText("LABEL_1057"),	// 1057:휴가 사용일
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
		
	}
	
});