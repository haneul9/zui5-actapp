sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_POP_Arbgb", {
	
	createContent : function(oController) {
		
		var textInputBtn = new sap.m.Button(oController.PAGEID + "_ArbgbText_Btn",{
			 text : oBundleText.getText("TEXT_INPUT"),
			 press : oController.onDisplaySearchInputDialog,
			 customData : new sap.ui.core.CustomData({key : "SearchInputType", value : "Arbgb"})
        });
		var cancelBtn = new sap.m.Button({
			 text : oBundleText.getText("CLOSE_BTN"),
			 press : oController.onCancelArbgb
		}); 
 
		var oStandardListItem = new sap.m.StandardListItem(oController.PAGEID + "_POP_Arbgb_StandardListItem", {
			title : "{Arbgb}",
			info : "{Zzarbgb}"
		});

		var oList = new sap.m.List(oController.PAGEID + "_POP_Arbgb_StandardList",{
			item :  {
						path : "/PrevEmployersCodeListSet",
						template : oStandardListItem
					},
			mode : "SingleSelectMaster",
			selectionChange :  oController.onConfirmArbgb ,
		} );
		oList.setModel(sap.ui.getCore().getModel("ZHRXX_JOBCHANGE_SRV"));
		
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
		
		var oNotice =  new sap.m.Toolbar({
			design : sap.m.ToolbarDesign.Auto,
			content : [new sap.ui.core.Icon({src: "sap-icon://notification", size: "0.4rem", color: "blue"}),
			           new sap.m.Label({text : oBundleText.getText("NOTICE_INPUT_ARBGB")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		 var oSearchField =  new sap.m.SearchField(oController.PAGEID + "_POP_Arbgb",{
				width : "100%",
				search : oController.onSearchArbgb,
				placeholder : oBundleText.getText("MSG_INPUT_ARBGB2")
			}).addStyleClass("L2P13Font L2PPaddingRight8");
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%", 
			content : [ oSearchField,
			            oNotice,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			           ]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_Arbgb_Dialog", {
			title : oBundleText.getText("ARBGB"),
			subHeader :  new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "100px",
					content : [oLayout]
			}),		
			content : [ oList ],
			buttons : [ textInputBtn, cancelBtn  ],		
			beforeOpen : oController.beforeOpenArbgb,
			contentHeight : "600px",
			contentWidth : "800px"
		});
		
		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		
		return oDialog;
	}

});