sap.ui.jsfragment("zui5_hrxx_actrec.fragment.SelectRecruiting", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf SelectRecruiting
	*/
	
	createContent : function(oController) {
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_RecSelect_COLUMNLIST", {
			type : sap.m.ListType.None,
			counter : 10,
			cells : [ 
				new sap.m.Text({
				     text : "{RecYy}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{RecTypeCd}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{RecNm}" ,	 
				}).addStyleClass("L2P13Font")
			]
		});
		
		var oTable = new sap.m.Table(oController.PAGEID + "_RecSelect_TABLE", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText("MSG_NODATA"),
			mode : sap.m.ListMode.SingleSelectLeft,
			fixedLayout : false,
			columns : [
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "RECYY")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  width: "70px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),  	
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "RECTYPE")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  width: "100px",
			        	  demandPopin: true,
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "RECNM")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"})
			        ]
		});
		
		var oLayout = new sap.ui.layout.VerticalLayout({
			width : "100%",
			content : [new sap.m.Label({text : oBundleText.getText("MSG_REC_SELECT")}).addStyleClass("L2P13Font"),
			           oTable]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_RecSelect_Dialog",{
			content : oLayout,
			contentWidth : "700px",
			contentHeight : "500px",
			showHeader : true,
			title : oBundleText.getText("TITLE_RECACT_SELECT"),
			beginButton : new sap.m.Button({text : oBundleText.getText("SELECT_BTN"), icon: "sap-icon://complete", press : oController.onSelectAction}), //
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"), icon: "sap-icon://sys-cancel-2", press : oController.closeAction}),
			//beforeOpen : oController.getRecList,
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		

		return oDialog;
	}

});
