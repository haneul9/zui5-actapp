sap.ui.jsview("zui5_hrxx_actjobchange.JobChangeRequestList", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actjobchange.JobChangeRequestList";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	createContent : function(oController) {
		//Language 및 Properties를 가져온다.
//		var locale = sap.ui.getCore().getConfiguration().getLanguage(); //언어
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : locale
//        }); 
        
		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.Common");
		
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var prevDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate() + 1);
		
		var oFilterLayout = new sap.ui.layout.HorizontalLayout(oController.PAGEID + "_FILTERBAR",{
			allowWrapping :true
		}).addStyleClass("L2PFilterLayout");
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Label({text : oBundleText.getText("PBTXT") + ":"}),
					           new sap.m.MultiComboBox(oController.PAGEID + "_Persa", {
									width: "300px",
									selectionFinish : oController.onChangeComboBox,
								}).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Label({text : oBundleText.getText("APPLD")}),
					           new sap.m.DatePicker(oController.PAGEID + "_Appld_From", {
					        	 	value: dateFormat.format(prevDate), 
									valueFormat : "yyyy-MM-dd",
						            displayFormat : gDtfmt,
									width : "120px",
									change : oController.onChangeDate
							   }).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [ //new sap.m.Label({text : oBundleText.getText("APPLD")}),
					           new sap.m.DatePicker(oController.PAGEID + "_Appld_To", {
					        	 	value: dateFormat.format(curDate), 
									valueFormat : "yyyy-MM-dd",
						            displayFormat : gDtfmt,
									width : "120px",
									change : oController.onChangeDate
							   }).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PFilterItem")
		);
		
		/*
		 * 2015.12.02 대상자 검색 조건 추가
		 */
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Label({text : oBundleText.getText("RPERN") + ":"}),
					           new sap.m.Input(oController.PAGEID + "_Rpern", {
									width : "120px"
							   }).attachBrowserEvent("keyup", oController.onKeyUp)
					.addStyleClass("L2P13Font")]
				}).addStyleClass("L2PFilterItem")
			);


		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label(),
				           new sap.m.Button(oController.PAGEID + "_SEARCH",{
								text: oBundleText.getText("SEARCH_BTN"),
								type : sap.m.ButtonType.Emphasized,
								press : oController.onPressSearch ,
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		var oFilterInfoBar = new sap.m.Toolbar({
			height : "2.5rem",
			content : [ //new sap.m.ToolbarSpacer({width: "1rem"}),
			            new sap.m.Label({
			            	text : oBundleText.getText( "FILINFO")
			            }).addStyleClass("L2P13Font"),

		            	new sap.m.Text(oController.PAGEID + "_Pbtxt", {
		            	
		            	}).addStyleClass("L2P13Font"),
						
			        ]
		}).addStyleClass("L2PPaddingLeft1Rem");
		
		var oFilterVLayout = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content : [oFilterLayout, oFilterInfoBar]
		}).addStyleClass("");
		

		var oTable = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_JobChangeRequestList",  {
			width : "100%",
			content : new sap.ui.core.HTML({content : "<div id='" + oController.PAGEID + "_Ibsheet'></div>", preferDOM : false}) 
		});
		
		var oIConFilter1 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_ALL",{
			showAll : true,
			key : "All",
			icon : "",
			design : sap.m.IconTabFilterDesign.Horizontal,
			text : oBundleText.getText( "DOCNUM")
		});
		
		var iConSeperator = new sap.m.IconTabSeparator();
		
		var oIConFilter3 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_APPROVAL", {
			icon : "sap-icon://approvals",
			iconColor : "Positive",
            text :  oBundleText.getText( "STATUS_APPROVAL"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "approval"
		});
		
		var oIConFilter4 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_CONFIRM",{
			icon : "sap-icon://sys-enter",
			iconColor : "Neutral",
            text :  oBundleText.getText( "STATUS_CONFIRM"),
            design : sap.m.IconTabFilterDesign.Horizontal,
            width : "100px",
			key : "confirmation"
		});
		
		var oIConFilter5 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_REJECT",{
			icon : "sap-icon://decline",
			iconColor : "Negative",
            text :  oBundleText.getText( "STATUS_REJECT"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "reject"
		});
		
		var oIConFilter6 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_COMPLETE",{
			icon : "sap-icon://accept",
			iconColor : "Critical",
            text :  oBundleText.getText( "STATUS_COMPLETE"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "complete"
		});
		
		var oIConBar = new sap.m.IconTabBar(oController.PAGEID + "_ICONBAR",{
			content : [ oTable ],
			items : [ oIConFilter1, iConSeperator,  
			          oIConFilter3, oIConFilter4, oIConFilter5, oIConFilter6],
			select : oController.handleIconTabBarSelect ,
			selectedKey : "All"
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oFilterLayout,
			            oFilterVLayout,
			           	oIConBar
			           ]
		});
		
		var oFooterBar = new sap.m.Bar({
				contentLeft : [
				               new sap.m.Button({
						 		 text: oBundleText.getText("EXCEL_BTN"),
						 		 press : oController.downloadExcel
						 		 })
					 	
	                ],
				contentRight : [
			                 new sap.m.Button({
								 text : oBundleText.getText( "ACTION_COMPLETE_BTN"),
								 press : oController.onPressComplete ,
							 	 }) 
						        ]
		});
		
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText( "TITLE_JOB_CHANGE_REQUEST_MANAGEMENT")
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeaderBar") ,
			footer : oFooterBar 
		}) ;
		
		return oPage ;
	}
	
});
