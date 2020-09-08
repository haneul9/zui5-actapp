sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_POP_Schcd", {
	
	createContent : function(oController) {
		
		var textInputBtn = new sap.m.Button(oController.PAGEID + "_textInputBtn",{
			 text : oBundleText.getText("TEXT_INPUT"),
			 press : oController.onDisplaySearchInputDialog,
			 customData : new sap.ui.core.CustomData({key : "SearchInputType", value : "Schcd"})
          });
		var cancelBtn = new sap.m.Button({
			 text : oBundleText.getText("CLOSE_BTN"),
			 press : oController.onCancelSchcd
		 }) ; 
 
		var oStandardListItem = new sap.m.StandardListItem(oController.PAGEID + "_POP_Schcd_StandardListItem", {
			title : "{Insti}",
			description : "{Slandtx}",
			info : "{Slarttx}"
		});

		var oList = new sap.m.List(oController.PAGEID + "_POP_Schcd_StandardList",{
			item :  {
						path : "/SchoolCodeSet",
						template : oStandardListItem
					},
			mode : "SingleSelectMaster",
			selectionChange :  oController.onConfirmSchcd ,
		} );
		oList.setModel(sap.ui.getCore().getModel("ZL2P01GW0001_SRV"));
		
		oList.attachUpdateFinished(function() {
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
//			if(oList.getItems().length < 1 ){
//				textInputBtn.setVisible(true);
//			}else{
//				textInputBtn.setVisible(false);
//			}
		});
		
		
//		var oNotice =  new sap.m.Label({text :  "Please enter the free text only if the School name is not listed"}).addStyleClass("L2P13Font");
		var oNotice =  new sap.m.Toolbar({
			design : sap.m.ToolbarDesign.Auto,
			content : [new sap.ui.core.Icon({src: "sap-icon://notification", size: "0.4rem", color: "blue"}),
			           new sap.m.Label({text : oBundleText.getText("NOTICE_INPUT_INSTI")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		 var oSearchField =  new sap.m.SearchField(oController.PAGEID + "_POP_Schcd",{
				width : "100%",
				search : oController.onSearchSchcd,
				placeholder : oBundleText.getText("MSG_INPUT_INSTI")
			}).addStyleClass("L2P13Font L2PPaddingRight8");
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%", 
			content : [ oSearchField,
			            oNotice,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			           ]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_Schcd_Dialog", {
			title : oBundleText.getText("SCHCD"),
			subHeader :  new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "100px",
					content : [oLayout]
			}),		
			content : [ oList ],
			buttons : [ textInputBtn, cancelBtn  ],		
			contentHeight : "600px",
			contentWidth : "800px"
		});
		
		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		
		return oDialog;
	}

});