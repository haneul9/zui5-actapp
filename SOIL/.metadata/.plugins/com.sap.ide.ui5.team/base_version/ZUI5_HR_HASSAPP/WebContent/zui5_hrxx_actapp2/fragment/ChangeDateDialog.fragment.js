
sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ChangeDateDialog", {
	/** 
	* @memberOf fragment.CompleteProcessing
	*/ 
	
	createContent : function(oController) {
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_CD_Dialog",{
			content :[new sap.m.DatePicker(oController.PAGEID + "_CD_Actda", {
			        	   width : "200px",
			   			   valueFormat : "yyyy-MM-dd",
			           	   displayFormat : gDtfmt,
			           	   change : oController.changeDate
			   		   })] ,
			contentWidth : "200px",
			contentHeight : "80px",
			showHeader : true,
			title : "발령일 변경",
			beforeOpen : oController.onBeforeOpenChangeDateDialog,
			beginButton : new sap.m.Button(oController.PAGEID + "_CD_ConfirmBtn", {
							text : "확인", 
							icon: "sap-icon://accept", 
							press : oController.onChangeActionDate}),
			endButton : new sap.m.Button({
				            text : "취소", 
				            icon: "sap-icon://sys-cancel-2", 
				            press : oController.onCDClose}),				
		});
		
		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
	    };

		return oDialog; 
	}

});
