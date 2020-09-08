sap.ui.jsfragment("zui5_hrxx_project.fragment.ProjectExpExcel", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	*/
	
	createContent : function(oController) {
		var oIBSheetLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_oIBSheetLayout",  {
			width : "100%",
			content : new sap.ui.core.HTML({content : "<div id='" + oController.PAGEID + "_IBSHEET1'></div>", preferDOM : false}) 
		});
		
		var oIBSheetPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.ToolbarSpacer(),
				           new sap.m.Button(oController.PAGEID + "_EXCEL_DOWNLOAD_BTN",{
				        	    icon : "sap-icon://download",
		 	                	text : oBundleText.getText( "EXCEL_FORMAT_BTN"),
		 	                	press : oController.onPressDownload
		 	               }),
				           new sap.m.Button(oController.PAGEID + "_EXCEL_UPLOAD_BTN",{
				        	    icon : "sap-icon://upload",
		 	                	text : oBundleText.getText( "EXCEL_UPLOAD_BTN"),
		 	                	press : oController.onPressUpload
		 	               }),
				           new sap.m.ToolbarSpacer({width: "10px"}),				           
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oIBSheetLayout]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_Excel_Dialog",{
			content : oIBSheetPanel,
			contentWidth : "1200px",
			contentHeight : "638px",
			showHeader : true,
			title : oBundleText.getText("TITLE_PROJECT_EXP_UPLOAD"),
			afterOpen : oController.onAfterOpenDialog,
			beginButton : new sap.m.Button(oController.PAGEID + "_SAVE_BTN", {
			 	text : oBundleText.getText( "SAVE_BTN"),
			 	visible : false,
			 	press : oController.onPressSave
			}),
			endButton :  new sap.m.Button({
			 	text : oBundleText.getText( "CANCEL_BTN"),
			 	press : oController.onPressCancel
			})
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		

		return oDialog;
	}

});