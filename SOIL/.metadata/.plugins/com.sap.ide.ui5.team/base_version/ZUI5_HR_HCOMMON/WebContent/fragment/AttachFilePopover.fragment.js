sap.ui.jsfragment("fragment.AttachFilePopover", {
	
	createContent : function(oController) {
		
//		var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_AFP_ColumnList", {
			counter : 10,
			cells : [ 
			    new sap.m.Text({
			    	text : "{Numbr}"
				}).addStyleClass("L2P13Font"), 
				new sap.m.Link({
				    text : "{Fname}",
				    href : "{Uri}",
				    target : "_new"
				}).addStyleClass("L2P13Font")
			]
		});  
		
		var oAttachFileList = new sap.m.Table(oController.PAGEID + "_AFP_Table", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			showNoData : false,
			mode : sap.m.ListMode.None,
			columns : [
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : "No."}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width : "50px",
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ATTACHFILE")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"})
			          ]
		});
		
		oAttachFileList.setModel(sap.ui.getCore().getModel("ZL2P01GW9000_SRV"));
		
		var oPopover = new sap.m.Popover(oController.PAGEID + "_AF_Popover", {
			title : oBundleText.getText("TITLE_ATTACH_FILE"),
			placement : sap.m.PlacementType.Auto,
			content : oAttachFileList,
			contentWidth : "400px",
			beforeOpen : oController.onBeforeOpenPopoverAttachFile,
			endButton : new sap.m.Button({
							icon : "sap-icon://sys-cancel-2",
							press : function(oEvent) {
								oEvent.getSource().getParent().getParent().close();
							}})
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oPopover.addStyleClass("sapUiSizeCompact");
	    };

		return oPopover;
	}

});
