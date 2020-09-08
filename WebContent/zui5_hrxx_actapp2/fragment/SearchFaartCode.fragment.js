sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.SearchFaartCode", {
	 
	createContent : function(oController) {
		
		var textInputBtn = new sap.m.Button(oController.PAGEID + "_FaartText_Btn",{
			 text : oBundleText.getText("TEXT_INPUT"),
			 press : oController.onDisplaySearchInputDialog
       });
		
		var cancelBtn = new sap.m.Button({
					 text : oBundleText.getText("CLOSE_BTN"),
					 press : oController.onCancelFaartCode
		}) ; 
		
		var oStandardListItem = new sap.m.StandardListItem(oController.PAGEID + "_POP_FaartCode_StandardListItem", {
			title : "{Etext}",
			info : "{Ecode}"
		});
		 
		var oList = new sap.m.List(oController.PAGEID + "_POP_FaartCode_StandardList",{
			item :  {
				path : "/FaartCodeListSet",
				template : oStandardListItem
			},
		    mode : "SingleSelectMaster",
		    selectionChange :  oController.onConfirmFaartCode ,
		} );
		oList.setModel(sap.ui.getCore().getModel("FaartCodeList"));
		
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
		
		var oSearchField = new sap.m.SearchField(oController.PAGEID + "_POP_Faart",{
			width : "100%",
			search : oController.onSearchFaartCode
		}).addStyleClass("L2P13Font L2PPaddingRight8");
		
		var oNotice =  new sap.m.Toolbar({
			design : sap.m.ToolbarDesign.Auto,
			content : [new sap.ui.core.Icon({src: "sap-icon://notification", size: "0.4rem", color: "blue"}),
			           new sap.m.Label(oController.PAGEID + "_POP_Faart_Notice", {text : oBundleText.getText("NOTICE_INPUT_ZZSLTP1TX")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%", 
			content : [ oSearchField,
			            oNotice,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			           ]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_FaartCode_Dialog", {
			subHeader :  new sap.m.Toolbar({
							design : sap.m.ToolbarDesign.Auto,
							height : "100px",
							content : [oLayout]
			}),
		
			content : [ oList      ],
			buttons : [ textInputBtn ,
					cancelBtn  ],
			
			contentHeight : "600px",
			contentWidth : "800px"
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		
		return oDialog;
	}

});

