sap.ui.jsview("zui5_hrxx_projectprocess.ProcessMenu", {
	

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_projectprocess.ProcessMenu
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_projectprocess.ProcessMenu";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_projectprocess.ProcessMenu
	*/ 
	createContent : function(oController) {
//		//필요한 CSS 파일을 Include 한다.
//		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/zhrxx_common/css/L2P2SAP1.css");
//		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/zhrxx_common/css/L2PBasic.css");
		
//		//Language 및 Properties를 가져온다.
//		var locale = sap.ui.getCore().getConfiguration().getLanguage(); //언어
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : locale
//        });  
		
        var oMenuList = new sap.m.List({
        	items: [
			   new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_1", {
					title : oBundleText.getText("TITLE_PROJECT_PROCESS10"),  //"승인자 지정 기준"
					type : sap.m.ListType.Navigation,
					customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_projectprocess.ApproverStandard"}),
						           new sap.ui.core.CustomData({key:"bizty", value:"10"}) ],
					press : oController.onListItemTap
				}),
				new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_2", {
					title : oBundleText.getText("TITLE_PROJECT_PROCESS20"),  //"승인자 지정 내역"
					type : sap.m.ListType.Navigation,
					customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_projectprocess.ApproverStatement"}),
						           new sap.ui.core.CustomData({key:"bizty", value:"20"}) ],
					press : oController.onListItemTap
				}),
				
				new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_3", {
					title : oBundleText.getText("TITLE_PROJECT_PROCESS30"),  //"승인 주기"
					type : sap.m.ListType.Navigation,
					customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_projectprocess.ApprovalPeriod"}),
						           new sap.ui.core.CustomData({key:"bizty", value:""}) ],
					press : oController.onListItemTap
				}),
				
				new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_4", {
					title : oBundleText.getText("TITLE_PROJECT_PROCESS40"),  //"수행 이력 등록 대상자"
					type : sap.m.ListType.Navigation,
					customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_projectprocess.RegistParticipant"}),
						           new sap.ui.core.CustomData({key:"bizty", value:"20"}) ],
					press : oController.onListItemTap
				}),
				new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_5", {
					title : oBundleText.getText("TITLE_PROJECT_PROCESS50"),  //"수행 이력 등록 요청 주기"
					type : sap.m.ListType.Navigation,
					customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_projectprocess.StatementPeriod"}),
						           new sap.ui.core.CustomData({key:"bizty", value:"30"}) ],
					press : oController.onListItemTap
				}),
			]
		});
        
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
//			title: oBundleText.getText("TITLE_RETIRE_MANAGEMENT"),  //"퇴직프로세스 기준관리"
			content : oMenuList,
//			content : [oMenuList1, oMenuList2, oMenuList3, oMenuList4],
			customHeader : new sap.m.Bar({
				contentMiddle : new sap.m.Text({
					   			text : oBundleText.getText("TITLE_MENU")
				}).addStyleClass("L2PPageTitle")
			}).addStyleClass("L2PHeaderBar"),
			footer : new sap.m.Bar({}) 
		}) ;
		
		return oPage ;
	}

});