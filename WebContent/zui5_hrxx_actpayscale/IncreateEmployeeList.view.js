sap.ui.jsview("zui5_hrxx_actpayscale.IncreateEmployeeList", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actpayscale.IncreateEmployeeList";
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
		
		var oFilterLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		}).addStyleClass("L2PFilterLayout");
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("PBTXT")}),
				           new sap.m.Select(oController.PAGEID + "_Werks", {
								width: "250px",
								enabled : false
							}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Label({text : oBundleText.getText("INSDT")}),
					           new sap.m.DatePicker(oController.PAGEID + "_Insdt", {
//					        	    change : oController.onChangeData,
					        	   change : oController.onChangeDate,
									value: dateFormat.format(curDate), 
									valueFormat : "yyyy-MM-dd",
						            displayFormat : gDtfmt,
									width : "120px"
							   }).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PFilterItem")
		);
				
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Zzjobgr_Layout",{
					content : [new sap.m.Label({text : oBundleText.getText("ZZJOBGR")}),
					           new sap.m.Select(oController.PAGEID + "_Zzjobgr", {
									width: "150px",
									change : oController.onChangeData,
								}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("LoaCodeList"))
							   ]
				}).addStyleClass("L2PFilterItem")
			);
		

		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Zzjobsr_Layout",{
					content : [new sap.m.Label({text : oBundleText.getText("ZZJOBSR")}),
					           new sap.m.Select(oController.PAGEID + "_Zzjobsr", {
									width: "150px",
									change : oController.onChangeData,
								}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("LoaCodeList"))
							   ]
				}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Zzcaltl_Layout",{
					content : [new sap.m.Label({text : oBundleText.getText("ZZCALTL")}),
					           new sap.m.Select(oController.PAGEID + "_Zzcaltl", {
									width: "150px",
									change : oController.onChangeData,
								}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("LoaCodeList"))
							   ]
				}).addStyleClass("L2PFilterItem")
		);
				
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Insyn_Layout",{
					content : [new sap.m.Label({text : oBundleText.getText("INSYN")}),
					           new sap.m.Select(oController.PAGEID + "_Insyn", { 
									width: "100px",
									change : oController.onChangeData,
							   }).addStyleClass("L2P13Font")
							  ]
				}).addStyleClass("L2PFilterItem")
			);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label(),
				           new sap.m.Button(oController.PAGEID + "_SEARCH_10",{
								text: oBundleText.getText("SEARCH_BTN"),
								type : sap.m.ButtonType.Emphasized,
								press : oController.onPressSearch ,
								customData : [{key : "Step", value : "10"}]
						   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Button(oController.PAGEID + "_SEARCH_20",{
									text: oBundleText.getText("SELECT_PERNR_BTN"),
									type : sap.m.ButtonType.Emphasized,
									press : oController.onPressSearch,
									customData : [{key : "Step", value : "20"}]
							   }).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Button(oController.PAGEID + "_UPLOAD_BTN",{
									text: oBundleText.getText("EMP_EXCEL_UPLOAD"),
									type : sap.m.ButtonType.Emphasized,
									press : oController.onPressUpload
							   }).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PFilterItem")
			);
		
		
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [	new sap.m.Label({text : oBundleText.getText("EXCEL_UPLOAD_MODE")}).addStyleClass("L2P13Font"),
					            new sap.m.Switch(oController.PAGEID + "_Input_Switch", {  change : oController.onChangeSwitch})]
				}).addStyleClass("L2PFilterItem")
		);
		
		var oFilterInfoBar = new sap.m.Toolbar({
			height : "2.5rem",
			content : [ new sap.m.Label({
			            	text : oBundleText.getText( "MULFILINFO")
			            }).addStyleClass("L2P13Font"),

		            	new sap.m.Text(oController.PAGEID + "_Pbtxt", {
		            	
		            	}).addStyleClass("L2P13Font"),
						
			        ]
		}).addStyleClass("L2PPaddingLeft1Rem");
		
		var oTable = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_IncreateEmpList",  {
			width : "100%",
		});

		var oIConFilter1 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_ALL",{
			showAll : true,
			key : "All",
			icon : "",
			design : sap.m.IconTabFilterDesign.Horizontal,
			text : oBundleText.getText( "DOCNUM")
		});
		
		var iConSeperator = new sap.m.IconTabSeparator();
		
		var oIConFilter2 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_SEARCH",{
			icon : "sap-icon://employee",
			iconColor : "Default",
            text :  oBundleText.getText( "SELECT_PERNR_BTN"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "search" 
		});
		
		var oIConFilter3 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_CRETAE",{
			icon : "sap-icon://create",
			iconColor : "Positive",
            text :  oBundleText.getText( "STATUS_CREATING_PERNR"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "creation" 
		});
		
		var oIConFilter6 = new sap.m.IconTabFilter(oController.PAGEID + "_ICONFILTER_COMPLETE",{
			icon : "sap-icon://accept",
			iconColor : "Critical",
            text :  oBundleText.getText( "ACTION_COMPLETE_BTN"),
            design : sap.m.IconTabFilterDesign.Horizontal,
			key : "complete"
		});
		
		var oIConBar = new sap.m.IconTabBar(oController.PAGEID + "_ICONBAR",{
			content : [ oTable ],
			items : [ oIConFilter1, iConSeperator, oIConFilter2, oIConFilter3, oIConFilter6],
			select : oController.handleIconTabBarSelect ,
			selectedKey : "All"
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oFilterLayout,
			            oFilterInfoBar,
			            oIConBar
			           ]
		});
		
		var oFooterBar = new sap.m.Bar({
				contentRight : [
							new sap.m.Button({
								 text : oBundleText.getText( "EMP_FORMAT_BTN"),
								 press : oController.downloadExcelFormat ,
								 }) ,
			                new sap.m.Button({
								 text : oBundleText.getText( "EXCEL_BTN"),
								 press : oController.onPressDownload ,
								 }) ,
			                new sap.m.Button(oController.PAGEID + "_DEL_BTN",{
								 text : oBundleText.getText( "DEL_BTN"),
								 press : oController.onPressDel ,
								 }) ,
							 new sap.m.Button(oController.PAGEID + "_SAVE_BTN",{
								 text : oBundleText.getText( "SAVE_BTN"),
								 press : oController.onPressSave ,
								 customData : [{key : "Apsta", value : "10"}],
							 	 }) ,
							 new sap.m.Button(oController.PAGEID + "_REQUEST_BTN",{
								 text : oBundleText.getText( "ACTAPP_REQUEST_BTN"),
								 press : oController.onPressSave ,
								 customData : [{key : "Apsta", value : "20"}],
							 	 })  	 	
				                ]
		});
		
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText( "TITLE_PAYS_INC_EMP")
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
