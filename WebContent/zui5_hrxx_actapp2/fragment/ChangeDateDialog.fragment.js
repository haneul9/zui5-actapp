
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
			title : oBundleText.getText("TITLE_ACTDA_CHANGE"),
			beforeOpen : oController.onBeforeOpenChangeDateDialog,
			beginButton : new sap.m.Button(oController.PAGEID + "_CD_ConfirmBtn", {
							text : oBundleText.getText("CONFIRM_BTN"), 
							icon: "sap-icon://accept", 
							press : oController.onChangeActionDate}),
			endButton : new sap.m.Button({
				            text : oBundleText.getText("CANCEL_BTN"), 
				            icon: "sap-icon://sys-cancel-2", 
				            press : oController.onCDClose}),				
		});
		
		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
	    };

		return oDialog; 
	}

});
