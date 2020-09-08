sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_POP_Schcd", {
	
	createContent : function(oController) {
		
//		var oStandardListItem = new sap.m.StandardListItem(oController.PAGEID + "_POP_Schcd_StandardListItem", {
//			title : "{Insti}",
//			description : "{Slandtx}",
//			info : "{Slarttx}"
//		});
//		
//		var oDialog = new sap.m.SelectDialog(oController.PAGEID + "_POP_Schcd_Dialog", {
//			title : "학교",
//			search : oController.onSearchSchcd,
//			confirm : oController.onConfirmSchcd,
//			cancel : oController.onCancelSchcd,
//			contentHeight : "600px",
//			contentWidth : "800px" ,
//			items : {
//				path : "/SchoolCodeSet",
//				template : oStandardListItem
//			}	
//		}).setModel(sap.ui.getCore().getModel("ZL2P01GW0001_SRV"));
//		
//		if (!jQuery.support.touch) { 
//			oDialog.addStyleClass("sapUiSizeCompact");
//	    };
//		
//		return oDialog;
		
		
		var cancelBtn = new sap.m.Button({
			 text : "닫기",
			 press : oController.onCancelSchcd
		 }) ; 
		
		var clearBtn = new sap.m.Button({
			 text : "Clear",
			 press : oController.onClearSelectedSchcd
		}) ; 
 
		var oStandardListItem = new sap.m.StandardListItem(oController.PAGEID + "_POP_Schcd_StandardListItem", {
			title : "{Insti}",
//			description : "{Slandtx}",
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
			oController.BusyDialog.close();
		});

		var oSearchField =  new sap.m.SearchField(oController.PAGEID + "_POP_Schcd",{
				width : "100%",
				search : oController.onSearchSchcd,
			}).addStyleClass("L2P13Font L2PPaddingRight8");
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%", 
			content : [ oSearchField ]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_Schcd_Dialog", {
			title : "학교",
			subHeader :  new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					height : "40px",
					content : [new sap.m.ToolbarSpacer({width : "5px"}),
						       oLayout,
						       new sap.m.ToolbarSpacer({width : "5px"})]
			}),		
			search : oController.onSearchSchcd,
			content : [ oList ],
			buttons : [ cancelBtn  ],		
			contentHeight : "600px",
			contentWidth : "800px"
		});
		
//		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };
		
		return oDialog;
	}

});