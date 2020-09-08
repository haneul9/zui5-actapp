sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_POP_Arbgb", {
	
	createContent : function(oController) {
		
		var textInputBtn = new sap.m.Button(oController.PAGEID + "_ArbgbText_Btn",{
			 text : "직접 입력",
			 press : oController.onDisplaySearchInputDialog,
			 customData : new sap.ui.core.CustomData({key : "SearchInputType", value : "Arbgb"})
        });
		var cancelBtn = new sap.m.Button({
			 text : "닫기",
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
			           new sap.m.Label({text : "회사를 검색한 후 해당 회사가 검색 결과에 존재하지 않으면 “직접 입력”을 클릭하십시오."}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		 var oSearchField =  new sap.m.SearchField(oController.PAGEID + "_POP_Arbgb",{
				width : "100%",
				search : oController.onSearchArbgb,
				placeholder : "직접 입력은 원하는 회사가 목록에 존재하지 않는 경우에만 사용하십시오."
			}).addStyleClass("L2P13Font L2PPaddingRight8");
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%", 
			content : [ oSearchField,
			            oNotice,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			           ]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_Arbgb_Dialog", {
			title : "이전회사명",
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
		
//		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };
		
		return oDialog;
	}

});