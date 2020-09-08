sap.ui.jsfragment("zui5_hrxx_actapp.fragment.CompleteEMail", {
	
	createContent : function(oController) {
		
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
        
        var oToolbar = new sap.m.Toolbar({
			design : sap.m.ToolbarDesign.Auto,
			content : [
			           new sap.m.Label({text : oBundleText.getText("MSG_ACTION_COMPLETE")}).addStyleClass("L2P13Font"),
					  ]
		}).addStyleClass("L2PPaddingLeft10"); 
        
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_CE_ColumnList", {
			counter : 10,
			cells : [ 
				new sap.m.Text({
				     text : "{Numbr}" 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Maltytx}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Rcvidtx}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Zzcaltltx}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Stext}" 
				}).addStyleClass("L2P13Font"),
				new sap.m.CheckBox({
					selected : "{Rnoyn}",
				}).addStyleClass("L2P13Font"),
				new sap.m.CheckBox({
					selected : "{Pnryn}",
				}).addStyleClass("L2P13Font"),
				new sap.m.CheckBox({
					selected : "{Payyn}",
				}).addStyleClass("L2P13Font"),
				new sap.m.Link({
					text : "{Autho}",
					customData : [{key : "Persa", value : "{Persa}"},
					              {key : "Rcvid", value : "{Rcvid}"},
					              {key : "Malty", value : "{Malty}"}]
				}).addStyleClass("L2P13Font")
				.attachBrowserEvent("click", oController.displayReceiveAuth)
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_CE_Table", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText( "MSG_NODATA"),
			showNoData : true,
			mode : "MultiSelect",
			columns : [
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "No."}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width: "30px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("MALTY")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width: "100px",
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("RCVIDTX")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width: "100px",
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("ZZCALTLTX")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width: "100px",
			        	  hAlign : sap.ui.core.TextAlign.Begin}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("FULLN")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("SHOWRNTX")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("SHOWENTX")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),	 
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("SHOWSCTX")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("AUTHO")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  demandPopin: true}) 
		        	  ] ,       
		});		
		oTable.setModel(sap.ui.getCore().getModel("ActionMailRecipientList"));
		oTable.bindItems("/ActionMailRecipientListSet", oColumnList, null, []);
		
		oTable.attachUpdateFinished(function() {
			oTable.selectAll();
		});
		
		var oResultPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [
				           new sap.ui.core.Icon({src : "sap-icon://table-chart", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ACT_MAILING_LIST"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Button({text: oBundleText.getText("DELETE_BTN"), icon : "sap-icon://delete", press : oController.deletePerson})
						  ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oTable]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_CE_Dialog",{
			content : [oToolbar, oResultPanel],
			contentWidth : "1200px",
			contentHeight : "600px",
			showHeader : true,
			title : oBundleText.getText("TITLE_MAIL_COMPLETE"),
			beforeOpen : oController.onBeforeOpenCompleteEMailDialog,
			beginButton : new sap.m.Button({text : oBundleText.getText("SEND_BTN"), icon: "sap-icon://email", press : oController.onSendMail}), //
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"), icon: "sap-icon://sys-cancel-2", press : oController.onCEClose}),
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    }; 
	     
		return oDialog;
	}

});
