sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_POP_Cttyp", {
	
	createContent : function(oController) {
		
		var textInputBtn = new sap.m.Button(oController.PAGEID + "_CttypText_Btn", {
			 text : "직접 입력",
			 press : oController.onDisplaySearchInputDialog,
			 customData : new sap.ui.core.CustomData({key : "SearchInputType", value : "Cttyp"})
		});
		 
		var cancelBtn = new sap.m.Button({
			 text : "닫기",
			 press : oController.onCancelCttyp
		}) ; 
		
		var oStandardListItem = new sap.m.StandardListItem(oController.PAGEID + "_POP_Cttyp_StandardListItem", {
			info : "{Cttyp}",
			title : "{Cttyptx}",
			description : "{Isaut}"
		});
		
		var oList = new sap.m.List(oController.PAGEID + "_POP_Cttyp_StandardList",{
			mode : "SingleSelectMaster",
			selectionChange :  oController.onConfirmCttyp ,
		} );
		oList.setModel(sap.ui.getCore().getModel("CttypList"));
		
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
		
		var oSearchField = new sap.m.SearchField(oController.PAGEID + "_POP_Cttyp",{
			width : "100%",
			search : oController.onSearchCttyp,
			placeholder : "직접 입력은 원하는 자격증 유형이 목록에 존재하지 않는 경우에만 사용하십시오."
		}).addStyleClass("L2P13Font L2PPaddingRight8");
		
		var oNotice =  new sap.m.Toolbar({
			design : sap.m.ToolbarDesign.Auto,
			content : [new sap.ui.core.Icon({src: "sap-icon://notification", size: "0.4rem", color: "blue"}),
			           new sap.m.Label({text : "자격증 유형를 검색한 후 해당 자격증 유형이 검색 결과에 존재하지 않으면 “직접 입력”을 클릭하십시오."}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%", 
			content : [ oSearchField,
			            oNotice,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			           ]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_Cttyp_Dialog", {
			title : "자격증 유형",
			subHeader :  new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				height : "100px",
				content : [oLayout]
			}),	
			content : [ oList],
			buttons : [ textInputBtn ,
						cancelBtn  ],
			
			contentHeight : "600px",
			contentWidth : "800px"
		});
		
//		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };
		
		return oDialog;
	}

});

