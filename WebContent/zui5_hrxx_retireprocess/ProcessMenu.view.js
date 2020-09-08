sap.ui.jsview("zui5_hrxx_retireprocess.ProcessMenu", {
	

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_retireprocess.ProcessMenu
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_retireprocess.ProcessMenu";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_retireprocess.ProcessMenu
	*/ 
	createContent : function(oController) {
        var oMenuList = new sap.m.List({
        	items: [
			    new sap.m.GroupHeaderListItem({title : oBundleText.getText("TITLE_MENU_RETIRE_DOCUMENTFILE")}),
				new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_1", {
					title : oBundleText.getText("TITLE_RETIRE_DOCUMENTFILE10"),  //"퇴직설문 파일"
					type : sap.m.ListType.Navigation,
					customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_retireprocess.DocumentFile"}),
						           new sap.ui.core.CustomData({key:"bizty", value:"10"}) ],
					press : oController.onListItemTap
				}),
				new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_2", {
					title : oBundleText.getText("TITLE_RETIRE_DOCUMENTFILE20"),  //"퇴직서류 파일"
					type : sap.m.ListType.Navigation,
					customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_retireprocess.DocumentFile"}),
						           new sap.ui.core.CustomData({key:"bizty", value:"20"}) ],
					press : oController.onListItemTap
				}),
				
				new sap.m.GroupHeaderListItem({title : oBundleText.getText("TITLE_MENU_RETIRE_SETTLEMENTITEM")}),
				new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_3", {
					title : oBundleText.getText("TITLE_RETIRE_SETTLEMENTITEM"),  //"체크항목 및 담당자"
					type : sap.m.ListType.Navigation,
					customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_retireprocess.SettlementItem"}),
						           new sap.ui.core.CustomData({key:"bizty", value:""}) ],
					press : oController.onListItemTap
				}),
				
				new sap.m.GroupHeaderListItem({title : oBundleText.getText("TITLE_MENU_RETIRE_REFERENCES")}),
				new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_4", {
					title : oBundleText.getText("TITLE_RETIRE_REFERENCES20"),  //"휴직 신청"
					type : sap.m.ListType.Navigation,
					customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_retireprocess.References"}),
						           new sap.ui.core.CustomData({key:"bizty", value:"20"}) ],
					press : oController.onListItemTap
				}),
				new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_5", {
					title : oBundleText.getText("TITLE_RETIRE_REFERENCES30"),  //"모성보호 신청"
					type : sap.m.ListType.Navigation,
					customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_retireprocess.References"}),
						           new sap.ui.core.CustomData({key:"bizty", value:"30"}) ],
					press : oController.onListItemTap
				}),
				new sap.m.GroupHeaderListItem({title : oBundleText.getText("TITLE_RETIRE_REFERENCE")}),
				new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_6", {
					title : oBundleText.getText("TITLE_RETIRE_REFERENCES10"),  //"퇴직 프로세스"
					type : sap.m.ListType.Navigation,
					customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_retireprocess.References"}),
						           new sap.ui.core.CustomData({key:"bizty", value:"10"}) ],
					press : oController.onListItemTap
				}),
				
//				new sap.m.GroupHeaderListItem({title : oBundleText.getText("TITLE_MENU_RETIRE_STAFF")}),
//				new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_7", {
//					title : oBundleText.getText("TITLE_RETIRE_STAFF20"),  //"휴직 담당자/수신자"
//					type : sap.m.ListType.Navigation,
//					customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_retireprocess.Staff"}),
//						           new sap.ui.core.CustomData({key:"bizty", value:"20"}) ],
//					press : oController.onListItemTap
//				}),
//				new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_8", {
//					title : oBundleText.getText("TITLE_RETIRE_STAFF30"),  //"모성보호 담당자/수신자"
//					type : sap.m.ListType.Navigation,
//					customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_retireprocess.Staff"}),
//						           new sap.ui.core.CustomData({key:"bizty", value:"30"}) ],
//					press : oController.onListItemTap
//				}),
//				new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_9", {
//					title : oBundleText.getText("TITLE_RETIRE_STAFF10"),  //"퇴직 담당자/수신자"
//					type : sap.m.ListType.Navigation,
//					customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_retireprocess.Staff"}),
//						           new sap.ui.core.CustomData({key:"bizty", value:"10"}) ],
//					press : oController.onListItemTap
//				})
			]
		});
        
//        var oMenuList1 = new sap.m.List({
//        	inset: true,
//			headerText: oBundleText.getText("TITLE_MENU_RETIRE_DOCUMENTFILE"),  //"파일양식 관리"
//			items: [
//			    new sap.m.GroupHeaderListItem({title : oBundleText.getText("TITLE_MENU_RETIRE_DOCUMENTFILE")}),
//				new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_1", {
//					title : oBundleText.getText("TITLE_RETIRE_DOCUMENTFILE10"),  //"퇴직설문 파일"
//					type : sap.m.ListType.Navigation,
//					customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_retireprocess.DocumentFile"}),
//						           new sap.ui.core.CustomData({key:"bizty", value:"10"}) ],
//					press : oController.onListItemTap
//				}),
//				new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_2", {
//					title : oBundleText.getText("TITLE_RETIRE_DOCUMENTFILE20"),  //"퇴직서류 파일"
//					type : sap.m.ListType.Navigation,
//					customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_retireprocess.DocumentFile"}),
//						           new sap.ui.core.CustomData({key:"bizty", value:"20"}) ],
//					press : oController.onListItemTap
//				})
//			]
//		});
        
//        var oMenuList2 = new sap.m.List({
//			inset: true,
//			headerText: oBundleText.getText("TITLE_MENU_RETIRE_SETTLEMENTITEM"),  //"체크리스트 관리"
//			items: [
//				new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_3", {
//					title : oBundleText.getText("TITLE_RETIRE_SETTLEMENTITEM"),  //"체크항목 및 담당자"
//					type : sap.m.ListType.Navigation,
//					customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_retireprocess.SettlementItem"}),
//						           new sap.ui.core.CustomData({key:"bizty", value:""}) ],
//					press : oController.onListItemTap
//				})
//			]
//		});
        
//        var oMenuList3 = new sap.m.List({
//			//inset: true,
//			headerText: oBundleText.getText("TITLE_MENU_RETIRE_REFERENCES"),  //"휴직신청 참조사항"
//			items: [
//					new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_4", {
//						title : oBundleText.getText("TITLE_RETIRE_REFERENCES20"),  //"휴직 신청"
//						type : sap.m.ListType.Navigation,
//						customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_retireprocess.References"}),
//							           new sap.ui.core.CustomData({key:"bizty", value:"20"}) ],
//						press : oController.onListItemTap
//					}),
//					new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_5", {
//						title : oBundleText.getText("TITLE_RETIRE_REFERENCES30"),  //"모성보호 신청"
//						type : sap.m.ListType.Navigation,
//						customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_retireprocess.References"}),
//							           new sap.ui.core.CustomData({key:"bizty", value:"30"}) ],
//						press : oController.onListItemTap
//					}),
//					new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_6", {
//						title : oBundleText.getText("TITLE_RETIRE_REFERENCES10"),  //"퇴직 신청"
//						type : sap.m.ListType.Navigation,
//						customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_retireprocess.References"}),
//							           new sap.ui.core.CustomData({key:"bizty", value:"10"}) ],
//						press : oController.onListItemTap
//					}),
//			]
//		});
        
//        var oMenuList4 = new sap.m.List({
//			inset: true,
//			headerText: oBundleText.getText("TITLE_MENU_RETIRE_STAFF"),  //"담당자/수신자 관리"
//			items: [
//					new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_7", {
//						title : oBundleText.getText("TITLE_RETIRE_STAFF20"),  //"휴직 담당자/수신자"
//						type : sap.m.ListType.Navigation,
//						customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_retireprocess.Staff"}),
//							           new sap.ui.core.CustomData({key:"bizty", value:"20"}) ],
//						press : oController.onListItemTap
//					}),
//					new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_8", {
//						title : oBundleText.getText("TITLE_RETIRE_STAFF30"),  //"모성보호 담당자/수신자"
//						type : sap.m.ListType.Navigation,
//						customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_retireprocess.Staff"}),
//							           new sap.ui.core.CustomData({key:"bizty", value:"30"}) ],
//						press : oController.onListItemTap
//					}),
//					new sap.m.StandardListItem(oController.PAGEID + "_LISTITEM_9", {
//						title : oBundleText.getText("TITLE_RETIRE_STAFF10"),  //"퇴직 담당자/수신자"
//						type : sap.m.ListType.Navigation,
//						customData : [ new sap.ui.core.CustomData({key:"pageId", value:"zui5_hrxx_retireprocess.Staff"}),
//							           new sap.ui.core.CustomData({key:"bizty", value:"10"}) ],
//						press : oController.onListItemTap
//					})
//			]
//		});
 
 
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
//			title: oBundleText.getText("TITLE_RETIRE_MANAGEMENT"),  //"퇴직프로세스 기준관리"
			content : oMenuList,
//			content : [oMenuList1, oMenuList2, oMenuList3, oMenuList4],
			customHeader : new sap.m.Bar({
				contentMiddle : new sap.m.Text({
					   			text : oBundleText.getText("TITLE_RETIRE_MANAGEMENT")
				}).addStyleClass("L2PPageTitle")
			}).addStyleClass("L2PHeaderBar"),
			footer : new sap.m.Bar({}) 
		}) ;
		
		return oPage ;
	}

});