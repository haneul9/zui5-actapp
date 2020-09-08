sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ZipcodeSearch", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	*/
	
	createContent : function(oController) {
		var oSearch = new sap.m.SearchField(oController.PAGEID + "_ZipcodeSearchField", {
			width : "100%",
			search : oController.onSearchZipcode
		});
		
		var oTable = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_ZipcodeList",  {
			width : "100%",
		});
		
		oTable.addDelegate({
			onAfterRendering: oController.onAfterRenderingTableLayout
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oSearch,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oTable
			           ]
		});	
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_ZS_Dialog",{
			content : oLayout,
			contentWidth : "1110px",
			contentHeight : "650px",
			showHeader : true,
			title : "우편번호 검색",
			beforeOpen : oController.beforeOpenZSDialog,
			beginButton : new sap.m.Button({text : "선택", icon: "sap-icon://complete", press : oController.onConfirmZipcode}), //
			endButton : new sap.m.Button({text : "취소", icon: "sap-icon://sys-cancel-2", press : oController.onCloseZipcode}), //
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		

		return oDialog;
	}

});
