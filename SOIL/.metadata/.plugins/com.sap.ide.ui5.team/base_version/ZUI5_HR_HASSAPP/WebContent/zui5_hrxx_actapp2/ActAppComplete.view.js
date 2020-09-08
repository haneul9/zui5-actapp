sap.ui.jsview("zui5_hrxx_actapp2.ActAppComplete", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actapp2.ActAppComplete
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp2.ActAppComplete";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actapp2.ActAppComplete
	*/ 
	createContent : function(oController) {
		
        var oSubjectList = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_SubjectList", {
        	width : "100%",
		}).addStyleClass("L2PGRID");
		
		var oListPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			backgroundDesign : "Transparent",
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto, 
				content : [new sap.ui.core.Icon({
								src: "sap-icon://open-command-field", 
								size : "1.0rem"
							}),
				           new sap.m.Label({text : "발령확정 처리할 대상자를 선택한 다음 발령확정 버튼을 클릭해 주십시오."}).addStyleClass("L2PFontFamily"),
				           new sap.m.ToolbarSpacer({width : "15px"}),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Apply.jpg" , width : "15px"}),
				           new sap.m.Label({text : "완료"}).addStyleClass("L2PFontFamily"),
				           new sap.m.ToolbarSpacer({width : "10px"}),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Error.jpg" , width : "15px"}),
				           new sap.m.Label({text : "오류"}).addStyleClass("L2PFontFamily"),
				           new sap.m.ToolbarSpacer({width : "10px"}),
				           new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Lock.jpg" , width : "15px"}),
				           new sap.m.Label({text : "잠금"}).addStyleClass("L2PFontFamily"),]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oSubjectList],
		});
        
        var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:15px'> </div>",	preferDOM : false}),
			            oListPanel
			           ]
		});
        
		var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
			contentRight : [         
		 	                new sap.m.Button(oController.PAGEID + "_COMPLETE_BTN", {
		 	                	text : "확정",
		 	                	press : oController.onPressComplete
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_CANCEL_BTN", {
		 	                	text : "취소",
		 	                	icon :"sap-icon://decline" ,
		 	                	press : oController.navToBack
		 	                }),
		 	                ]
		});
        
        var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentLeft : new sap.m.Button({
												icon : "sap-icon://nav-back" ,
												press: oController.navToBack
											}),
								contentMiddle : new sap.m.Text({
									   			text : "발령품의서 확정처리"
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeader L2pHeaderPadding") ,
			footer : oFooterBar 
		}).addStyleClass("WhiteBackground") ;
		
		return oPage ;
	}

});