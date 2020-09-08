sap.ui.jsview("ZUI5_HR_Empprofile.EmployeeProfile", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ZUI5_HR_Empprofile.EmplyeeProfile
	*/ 
	getControllerName : function() {
		return "ZUI5_HR_Empprofile.EmployeeProfile";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf ZUI5_HR_Empprofile.EmplyeeProfile
	*/ 
	createContent : function(oController) {
		jQuery.sap.require("sap.ui.unified.SplitContainer");
		 
		var oHeaderBar = new sap.m.Bar({
			contentLeft : [new sap.m.Button(oController.PAGEID + "_ToogleBtn", {
								icon : "sap-icon://resize-horizontal", 
								press : oController.toogleSearchPanel}),
							new sap.m.Label(oController.PAGEID + "_PersonTitle").addStyleClass("L2P14Font L2P13FontBold")],
		});
		
		
		var oChart = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_OrgChart", {
			width : "100%"
		}).addStyleClass("L2POrgTree");
		
		var oChartLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_OrgChartLayout", {
			width : "100%",
			content : [
				new sap.m.Toolbar({
					width : "100%",
					content : [
						new sap.m.ToolbarSpacer({width : "1px"}), 
						new sap.m.SearchField(oController.PAGEID + "_SearchTree", {
							width : "100%",
							placeholder : "조직도 검색",
							search : oController.onSearchOrg
						}),
						new sap.m.Button({
							icon : "sap-icon://expand-group",
							press : oController.searchOrgNext,
							tooltip : "다음 검색"
						}),
						new sap.m.Button({
							icon : "sap-icon://collapse-group",
							press : oController.searchOrgPrev,
							tooltip : "이전 검색"
						}),
						new sap.m.ToolbarSpacer({width : "5px"})
					],
			   }),
			   oChart
			]				
		}).addStyleClass("");
		
		var oListItemMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			widths: ["50px"],
		});
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"});
		oListItemMatrix.addRow(oRow);
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Image({
				src : "{Photo}" ,
				height : "60px" ,
				visible : {
					path : "Photo",
					formatter : function(fVal){
						if(fVal && fVal != "") return true ;
					    else return false;
				    }
				}
			}),
			hAlign : "Center",
			rowSpan : 3,
			vAlign : "Middle"
		}); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : { 
					parts : [{path : "Ename"},{path : "Zzjiktlt"},{path : "Zzjikcht"}], 
					formatter : function(fVal1, fVal2, fVal3){
						return fVal1 + " " + fVal2 + " " + fVal3;
					}
				}
			}).addStyleClass("L2P13Font L2P13FontBold L2PPaddingLeft10")
		});
		oRow.addCell(oCell);
		oListItemMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : { parts : [{path : "Fulln"},{path : "Statx"},{path : "Pgtxt"},{path : "Zzjikgbt"}], 
						 formatter : function(fVal1, fVal2, fVal3, fVal4){
							 return fVal1 + " / " + fVal2 + " / " + fVal3 + " / " + fVal4 ;
						 }
				}
			
			}).addStyleClass("L2P13Font L2PPaddingLeft10")
		});
		oRow.addCell(oCell);
		oListItemMatrix.addRow(oRow);
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : { parts : [{path : "Entda"}], 
						 formatter : function(fVal1){
							 if(fVal1 && fVal1 != "") fVal1 = dateFormat.format(new Date(fVal1));
							 else fVal1 = "";
							 return "입사일 : " + fVal1 ;
						 }
				}
			
			}).addStyleClass("L2P13Font L2PPaddingLeft10")
		});
		oRow.addCell(oCell);
		oListItemMatrix.addRow(oRow);
		oListItemMatrix.addStyleClass("L2PPointer");
		oListItemMatrix.attachBrowserEvent("click", oController.onSelectBusinessaCard)
		.addCustomData(new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"}))
		.addCustomData(new sap.ui.core.CustomData({key : "Ename", value : "{Ename}"}))
		
		var oListItemLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content :  oListItemMatrix 
		}).addStyleClass("L2PListResult");
		
		var oCustomListItem = new sap.m.CustomListItem({
			content : oListItemLayout
		});
		
		var oResultList = new sap.m.List(oController.PAGEID + "_ResultList", {
			showNoData : true,
			noDataText : "No data found",
			rememberSelections : false,
			items : {
				path : "/EmpSearchResultSet",
				template : oCustomListItem
			}
		});
		oResultList.setModel(sap.ui.getCore().getModel("EmpSearchResult")); 
		
		
		var oLeftScrollContainer = new sap.m.ScrollContainer(oController.PAGEID + "_LeftScrollContainer", {
			width: "100%",
			height : (window.innerHeight - 230) + "px",
			visible : false,
			horizontal : false,
			vertical : true,
			content : [oResultList]
		}).addStyleClass("");
		
		var oLeftLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LeftLayout", {
			width: "100%",
			content : [new sap.m.Toolbar(oController.PAGEID + "_SearchToolbar", {
							width : "100%",
							content : [new sap.m.ToolbarSpacer({width : "1px"}), //ENAME
							           new sap.m.SearchField(oController.PAGEID + "_Keyword", {
							        	   width : "100%",
							        	   search : oController.onSearchPerson,
							        	   placeholder : "이름 또는 사번을 입력하세요",
							           }).addStyleClass("L2PFontFamily"),
							           new sap.m.ToolbarSpacer({width : "5px"})],
					   }).addStyleClass("L2PToolbarNoBottomLine"),
					   new sap.m.Toolbar({
							width : "100%",
							content : [new sap.m.ToolbarSpacer({width : "1px"}), 
							           new sap.m.Label({text : "재직구분:"}),
							           new sap.m.ToolbarSpacer(),
							           new sap.m.MultiComboBox(oController.PAGEID + "_Stat2", {
								   			width : "75%",
								   			editable : {
								   				path : "A",
								   				formatter : function(fVal){
													if(_gAuth == "H") return true ;
												    else return false;
											    }
								   			}
								       }).addStyleClass("L2PFontFamily"),
							           new sap.m.ToolbarSpacer({width : "5px"})],
					   }).addStyleClass("L2PToolbarNoBottomLine"),
					   new sap.m.Toolbar(oController.PAGEID + "_ToogleToolbar",{
							width : "100%",
							content : [
							           new sap.m.Button(oController.PAGEID + "_OrgChart_Btn", {
							        	   text : "조직도", 
							        	   width : "50%", 
							        	   type : "Emphasized",
							        	   press : oController.onSelectTab}).addStyleClass("L2PMarginLeft0"),
							           new sap.m.Button(oController.PAGEID + "_Result_Btn", {
							        	   text : "검색결과", 
							        	   width : "50%",
							        	   press : oController.onSelectTab}).addStyleClass("L2PMarginLeft0"),
							        ]
					   }).addStyleClass("L2PToolbarNoBottomLine"),
					   oChartLayout,
					   oLeftScrollContainer],
		}).addStyleClass("");
		
		var oSplitContainer = new sap.ui.unified.SplitContainer(oController.PAGEID + "_SplitContainer", {
			secondaryContentWidth : "350px",
			showSecondaryContent : true,
			content : [sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.EmployeeProfile", oController)],
			secondaryContent : [oLeftLayout]				
		}).addStyleClass("L2PBackgroundWhite");		
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ oHeaderBar, oSplitContainer ]
		});
		
		var oFooterBar = new sap.m.Bar({
		 	contentLeft : [     
				new sap.m.Button(oController.PAGEID + "_SPdfBtn", {
					text : "인사기록카드 출력",
					icon : "sap-icon://print",
					press : oController.onPressSPdfButton,
					visible : false
				})
		 	],
		});	
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			showHeader : true,
			customHeader : new sap.m.Bar({
								contentMiddle : new sap.m.Text({
									   			text : "사원 프로파일"
								}).addStyleClass("TitleFont"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("PSNCHeader L2pHeaderPadding"),
			footer : oFooterBar 
		}) ;
		
		return oPage ;
	}

});