sap.ui.jsfragment("zui5_hrxx_actfamily.fragment.FilterinSearchResult", {
	
	createContent : function(oController) {
		
//		var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
		var vColumns = {ColumnCollection : [
		    {id : "Famsatx", label : oBundleText.getText("FAMSATX") + " : ", visible : false},
		    {id : "Fanam", label : oBundleText.getText("FANAM") + " : ", visible : false},
		    {id : "Favor", label : oBundleText.getText("FAVOR") + " : ", visible : false},
		    {id : "Natio", label : oBundleText.getText("NATIO") + " : ", visible : true},
		    {id : "Astxt", label : oBundleText.getText("ASTXT") + " : ", visible : true},
		    {id : "Apern", label : oBundleText.getText("APERN") + " : ", visible : true},
		    {id : "Acomm", label : oBundleText.getText("ACOMM") + " : ", visible : true},
		]};
		
		var mColumnModel = new sap.ui.model.json.JSONModel();
		mColumnModel.setData(vColumns);
		
		var oFilterLayout = new sap.ui.layout.VerticalLayout({

		}).addStyleClass("L2PFilterLayout");
		
		
		oFilterLayout.addContent(
			new sap.m.Toolbar({
				height : "40px",
				content : [new sap.m.Select(oController.PAGEID + "_FSR_Column1", {
								items : {
									path : "/ColumnCollection",
									template : new sap.ui.core.Item ({key : "{id}", text : "{label}"})}
						   }).setModel(mColumnModel),
				           new sap.m.Input(oController.PAGEID + "_FSR_Value1", {
								width : "200px"
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		);
		
		oFilterLayout.addContent(
			new sap.m.Toolbar({
				height : "40px",
				content : [new sap.m.Select(oController.PAGEID + "_FSR_Column2", {
								items : {
									path : "/ColumnCollection",
									template : new sap.ui.core.Item ({key : "{id}", text : "{label}"})}
						   }).setModel(mColumnModel),
				           new sap.m.Input(oController.PAGEID + "_FSR_Value2", {
								width : "200px"
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		);
		
		oFilterLayout.addContent(
			new sap.m.Toolbar({
				height : "40px",
				content : [new sap.m.Select(oController.PAGEID + "_FSR_Column3", {
								items : {
									path : "/ColumnCollection",
									template : new sap.ui.core.Item ({key : "{id}", text : "{label}"})}
						   }).setModel(mColumnModel),
				           new sap.m.Input(oController.PAGEID + "_FSR_Value3", {
								width : "200px"
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		);
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_FSR_Dialog",{
			contentWidth : "500px",
			contentHeight : "200px",
			showHeader : true,
			title : oBundleText.getText("TITLE_FILTER_RESULT"),
			beginButton : new sap.m.Button({text : oBundleText.getText("CONFIRM_BTN"), icon: "sap-icon://accept", press : oController.onPressOK}), //
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"), icon: "sap-icon://sys-cancel-2", press : oController.onFSRClose}),
			content : [oFilterLayout]
		});
		
		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
	    };		

		return oDialog;
	}

});
