sap.ui.jsfragment("zui5_hrxx_actdoc.fragment.MailSendDialog", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	*/
	
	createContent : function(oController) {
		
		//사원검색결과 리스트 Object (DHtmlx 사용을 위해 추가)
		var oPersonList = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_MSD_MailSendList",  {
			width : "100%"
		});
		
//		oPersonList.addDelegate({
//			onAfterRendering: oController.onAfterRenderingMailSendList
//		});
		
		var oResultPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://documents", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("TITLE_HRDOC_CONFIRM"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Button(oController.PAGEID + "_ExcelDownload_Btn",{text: oBundleText.getText("EXCEL_BTN"), icon : "sap-icon://excel-attachment", press : oController.downloadExcel})]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oPersonList]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_MSD_Dialog",{
			content :[oResultPanel] ,
			contentWidth : "1200px",
			contentHeight : "600px",
			showHeader : true,
			title : oBundleText.getText("TITLE_HRDOC_MAILSEND"),
			afterOpen : oController.onAfterOpenMSDialog,
			beforeClose : oController.onBeforeOpenMSDialog,
			beginButton : new sap.m.Button({text : oBundleText.getText("SEND_BTN"), icon: "sap-icon://email", press : oController.onPressSend}), //
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"), icon: "sap-icon://sys-cancel-2", press : oController.onMSDClose}),
		});
		
		if (!jQuery.support.touch) {
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		

		return oDialog;
	}

});
