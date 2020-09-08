sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.SelectRecruiting", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf SelectRecruiting
	*/
	
	createContent : function(oController) {
		
		var oFilterLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		}).addStyleClass("L2PFilterLayout");
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Label({text : oBundleText.getText("BTRTL") + ":"}),
					           new sap.m.Select(oController.PAGEID + "_RecSelect_SubPersa", {
									width: "150px",
							   }).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PFilterItem")
			);
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Label({text : oBundleText.getText("RECNM") + ":"}),
					           new sap.m.Input(oController.PAGEID + "_RecSelect_RecNm", {
									width: "300px",
							   }).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PFilterItem")
			);
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Label({text : oBundleText.getText("REQUISITION_ID") + ":"}),
					           new sap.m.Input(oController.PAGEID + "_RecSelect_RecTypeCd", {
									width: "110px",
							   }).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PFilterItem")
			);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("RECYY") + ":"}),
				           new sap.m.Select(oController.PAGEID + "_RecSelect_RecYy", {
				         	   width : "110px"
				            }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Button({
								text: oBundleText.getText("SEARCH_BTN"),
								type : sap.m.ButtonType.Emphasized,
								press : oController.getSFRecList
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_RecSelect_COLUMNLIST", {
			type : sap.m.ListType.None,
			counter : 10,
			cells : [ 
				new sap.m.Text({
				     text : "{RecTypeCd}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{RecNm}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Btext}" ,	 
				}).addStyleClass("L2P13Font"),
				new sap.m.Text({
				     text : "{Count}" ,	 
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
			        	  header: new sap.m.Label({text : oBundleText.getText( "REQUISITION_ID")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  width: "100px",
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),  	
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "RECNM")}).addStyleClass("L2P13Font"),
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  width: "300px",
			        	  demandPopin: true,
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "BTRTL")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  width: "200px",
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "EECNT")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  minScreenWidth: "tablet"}),
			        ]
		});
		
		var oLayout = new sap.ui.layout.VerticalLayout({
			width : "100%",
			content : [oFilterLayout,
			           new sap.m.Label({text : oBundleText.getText("MSG_REC_SELECT")}).addStyleClass("L2P13Font"),
			           oTable]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_RecSelect_Dialog",{
			content : oLayout,
			contentWidth : "900px",
			contentHeight : "700px",
			showHeader : true,
			title : oBundleText.getText("TITLE_RECACT_SELECT"),
			beforeOpen : oController.onBeforeOpenRecActionDialog,
			beginButton : new sap.m.Button({text : oBundleText.getText("SELECT_BTN"), icon: "sap-icon://complete", press : oController.onSelectSFRecAction}), //
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"), icon: "sap-icon://sys-cancel-2", press : oController.closeSFRecAction}),
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		

		return oDialog;
	}

});
