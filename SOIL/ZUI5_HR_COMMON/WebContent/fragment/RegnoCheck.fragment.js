sap.ui.jsfragment("fragment.RegnoCheck", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.EmployeeSearch
	*/
	
	createContent : function(oController) {
		var oMessage = new sap.m.Text({
			text : oBundleText.getText("LABEL_2788")	// 2788:'14.8.7 시행된 개인정보보호법에 의거, 주민등록번호 수집/처리가 금지되므로 주민등록번호가 모두 노출된 신청서는 기각 처리합니다.\n증빙문서에 기재된 모든 주민등록번호 뒷자리를 삭제하셨습니까?
		}).addStyleClass("L2PFontFamily");
		
		var oDialog = new sap.m.Dialog({
			content :[oMessage] ,
			contentWidth : "470px",
			contentHeight : "120px",
			showHeader : true,
			title : oBundleText.getText("LABEL_2789"),	// 2789:첨부파일 주민등록번호 확인
			endButton : new sap.m.Button({text : oBundleText.getText("LABEL_0395"), press : oController.onPressNew})	// 395:확인
		});
		
//		if (!jQuery.support.touch) {
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };	

		return oDialog;
	}

});
