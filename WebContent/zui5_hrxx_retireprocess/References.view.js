sap.ui.jsview("zui5_hrxx_retireprocess.References", {
	

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_retireprocess.References
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_retireprocess.References";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_retireprocess.References
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
		
        var oFilterLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		}).addStyleClass("L2PFilterLayout");
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("PBTXT") + ":"}),
				           new sap.m.Select(oController.PAGEID + "_Persa", {
								width: "300px",
								change: oController.onChangePersa
							}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
//		oFilterLayout.addContent(
//			new sap.ui.layout.VerticalLayout({
//				content : [new sap.m.Button({
//								text: oBundleText.getText("SEARCH_BTN"),
//								type : sap.m.ButtonType.Emphasized,
//								press : oController.onPressSearch
//						   }).addStyleClass("L2P13Font")]
//			}).addStyleClass("L2PFilterItem")
//		);
		var oTextArea = new sap.m.TextArea(oController.PAGEID + "_TEXTAREA", {
			value : "",
			width : "100%",
			rows : 20
		}).addStyleClass("L2P13Font");
		
		var oTextAreaPanel = new sap.m.Panel({
			expandable : false,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : new sap.m.Label({text: oBundleText.getText( "REFERENCE")}).addStyleClass("L2P13Font")
			}),
			content : oTextArea
		});
		
		var oInput = new sap.m.Input(oController.PAGEID + "_INPUT", {
			value : "",
			width : "100%"
		}).addStyleClass("L2P13Font");
		
		var oInputPanel = new sap.m.Panel(oController.PAGEID + "_COMMENT_PANEL",{
			expandable : false,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : new sap.m.Label({text: oBundleText.getText( "AGREE_CONTENT")}).addStyleClass("L2P13Font")
			}),
			content : oInput
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ 
			            oFilterLayout,
			            new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
			            oTextAreaPanel,
			            oInputPanel
			           ]
		});
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
//			title : "",
			content : oLayout,
			customHeader : new sap.m.Bar({
				contentMiddle : new sap.m.Text(oController.PAGEID + "_PAGETITLE", {
				}).addStyleClass("L2PPageTitle")
			}).addStyleClass("L2PHeaderBar"),
			footer : new sap.m.Bar({
				contentRight : new sap.m.Button({
									 text : oBundleText.getText( "SAVE_BTN"),
									 width : "100px",
									 press : oController.onSave
			 	})
			}) 
		}) ;
		
		return oPage ;
	}

});