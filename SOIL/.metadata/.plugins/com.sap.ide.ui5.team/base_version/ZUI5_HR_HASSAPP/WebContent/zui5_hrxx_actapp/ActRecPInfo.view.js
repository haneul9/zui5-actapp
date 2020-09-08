sap.ui.jsview("zui5_hrxx_actapp.ActRecPInfo", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actapp.ActRecPInfo
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp.ActRecPInfo";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actapp.ActRecPInfo
	*/ 
	createContent : function(oController) {
		
		var oNameLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_NameLayout",{
			width : "100%",
			layoutFixed : false,
			visible : false,
			columns : 1
		});
        var oRow = new sap.ui.commons.layout.MatrixLayoutRow();
        var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label(oController.PAGEID + "_NameLayoutText",{text: ""}).addStyleClass("L2P22Font L2P13FontBold")]
		}).addStyleClass("L2PPaddingHeader");
		oRow.addCell(oCell);
		oNameLayout.addRow(oRow);
        
		
        var oIconTabBar = new sap.m.IconTabBar(oController.PAGEID + "_TABBAR", {
			upperCase : true,
			select : oController.onTabSelected,
			showSelection : false,
			items : [
			   new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub01", {
				   key : "Sub01",
				   count: 0,
				   text : "인적사항",
				   content : sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Sub01", oController)
			   }),
			   new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub02", {
				   key : "Sub02",
				   text : "학력사항", 
				   count: 0,
				   content : sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Sub02", oController)
			   }),
			   new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub03", {
				   key : "Sub03",
				   text : "경력사항",
				   count: 0,
				   content : sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Sub03", oController)
			   }),
			   new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub04", {
				   key : "Sub04",
				   text : "어학사항",
				   count: 0,
				   content : sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Sub04", oController)
			   }),
			   new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub06", {
				   key : "Sub06",
				   text : "자격면허",
				   count: 0,
				   content : sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Sub06", oController)
			   }),
			   new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub07", {
				   key : "Sub07",
				   text : "병역사항",
				   count: 0,
				   content : sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Sub07", oController)
			   }),
			],
		}); 
        var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
        	contentLeft : [ new sap.m.Button(oController.PAGEID + "_REHIRE_BTN", {
				             	text : "재입사 정보조회",
				             	press : oController.onPressRehireSearch,
				             	visible : false
				             })],
			contentRight : [         
		 	                new sap.m.Button(oController.PAGEID + "_SAVE_BTN", {
		 	                	text : "저장",
		 	                	press : oController.onPressSave,
		 	                	visible : false
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_ADD_BTN", {
				             	text : "추가",
				             	press : oController.onPressAdd,
		 	                	visible : false
				            }),
		 	                new sap.m.Button(oController.PAGEID + "_MODIFY_BTN", {
		 	                	text : "수정",
		 	                	press : oController.onPressModify,
		 	                	visible : false
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_DELETE_BTN", {
		 	                	text : "삭제",
		 	                	press : oController.onPressDelete,
		 	                	visible : false
		 	                }),
		 	                new sap.m.Button(oController.PAGEID + "_DELETE_BTN_SUB07", {
		 	                	text : "삭제",
		 	                	press : oController.onPressDeleteSub07,
		 	                	visible : false
		 	                })
		 	                ]
		});
        
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oNameLayout, oIconTabBar],
			customHeader : new sap.m.Bar({
								contentLeft : new sap.m.Button({
												icon : "sap-icon://nav-back" ,
												press: oController.navToBack
											}),
								contentMiddle : new sap.m.Text(oController.PAGEID + "_PAGETITLE", {
									   			text : "입사자정보등록"
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