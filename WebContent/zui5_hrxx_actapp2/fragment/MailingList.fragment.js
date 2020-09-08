sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.MailingList", {
	 
	createContent : function(oController) {
		
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
        
		var oColumnList = new sap.m.ColumnListItem("MailligList_ColumnList", {
			counter : 10,
			cells : [ 
				new sap.m.Text({
				     text : "{Numbr}" 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Ename}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Zzcaltltx}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Fulln}" 
				}).addStyleClass("L2P13Font"),
				new sap.m.CheckBox({
					selected : "{Rnoyn}",
				}).addStyleClass("L2P13Font"),
				new sap.m.CheckBox({
					selected : "{Pnryn}",
				}).addStyleClass("L2P13Font"),
				new sap.m.CheckBox({
					selected : "{Payyn}",
				}).addStyleClass("L2P13Font")
			]
		});  
		
		var oTable = new sap.m.Table("MailingList_Table", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText( "MSG_NODATA"),
			showNoData : false,
			mode : "MultiSelect",
			columns : [
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : "No."}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width: "30px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("ENAME")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width: "150px",
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
			        	  width: "200px",
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
			        	  demandPopin: true})     
		        	  ] ,       
		});		
		oTable.setModel(sap.ui.getCore().getModel("ActionMailingList"));
		oTable.bindItems("/ActionMailingList", oColumnList, null, []);
		
//		oTable.attachUpdateStarted(function() {
//			if(!oController.BusyDialog) {
//				oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
//				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCHING")}));
//				oController.getView().addDependent(oController.BusyDialog);
//			} 
//			if(!oController.BusyDialog.isOpen()) {
//				oController.BusyDialog.open();
//			}
//		});
//		oTable.attachUpdateFinished(function() {
//			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
//				oController.BusyDialog.close();
//			}
//		});
		
		var oResultPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://table-chart", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ACT_MAILING_LIST"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Button({text: oBundleText.getText("ADD_BTN"), icon : "sap-icon://add", press : oController.addPerson}),
				           new sap.m.Button({text: oBundleText.getText("DELETE_BTN"), icon : "sap-icon://delete", press : oController.delPerson})
						]
			}),
			content : [oTable]
		});
		
		var oDialog = new sap.m.Dialog("MailingList_Dialog",{
			content : oResultPanel,
			contentWidth : "1000px",
			contentHeight : "600px",
			showHeader : true,
			title : oBundleText.getText("SENDMAIL_BTN"),
			beforeClose : oController.onBeforeCloseMailingListDialog,
			beginButton : new sap.m.Button({text : oBundleText.getText("SEND_BTN"), icon: "sap-icon://email", press : oController.onSendMail}), //
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"), icon: "sap-icon://sys-cancel-2", press : oController.onSendEmailClose}),
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		

		return oDialog;
	}

});
