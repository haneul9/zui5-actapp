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
							placeholder : oBundleText.getText("LABEL_2123"),	// 2123:조직 검색
							search : oController.onSearchOrg
						}),
						new sap.m.Button({
							icon : "sap-icon://expand-group",
							press : oController.searchOrgNext,
							tooltip : oBundleText.getText("LABEL_1634")	// 1634:다음 검색
						}),
						new sap.m.Button({
							icon : "sap-icon://collapse-group",
							press : oController.searchOrgPrev,
							tooltip : oBundleText.getText("LABEL_2023")	// 2023:이전 검색
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
							 return oBundleText.getText("LABEL_0090") + " : " + fVal1 ;	// 90:입사일
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
		.addCustomData(new sap.ui.core.CustomData({key : "Encid", value : "{Encid}"}))
		
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
							        	   placeholder : oBundleText.getText("LABEL_2562"),	// 2562:이름 또는 사번을 입력하세요
							           }).addStyleClass("FontFamily"),
							           new sap.m.ToolbarSpacer({width : "5px"})],
					   }).addStyleClass("L2PToolbarNoBottomLine"),
					   new sap.m.Toolbar({
							width : "100%",
							content : [new sap.m.ToolbarSpacer({width : "1px"}), 
							           new sap.m.Label({text : oBundleText.getText("LABEL_2091") + ":"}),	// 2091:재직구분
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
								       }).addStyleClass("FontFamily"),
							           new sap.m.ToolbarSpacer({width : "5px"})],
					   }).addStyleClass("L2PToolbarNoBottomLine"),
					   new sap.m.Toolbar(oController.PAGEID + "_ToogleToolbar",{
							width : "100%",
							content : [
							           new sap.m.Button(oController.PAGEID + "_OrgChart_Btn", {
							        	   text : oBundleText.getText("LABEL_2122"), 	// 2122:조직도
							        	   width : "50%", 
							        	   type : "Emphasized",
							        	   press : oController.onSelectTab}).addStyleClass("L2PMarginLeft0"),
							           new sap.m.Button(oController.PAGEID + "_Result_Btn", {
							        	   text : oBundleText.getText("LABEL_1467"), 	// 1467:검색결과
							        	   type : "Ghost",
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
			content : [
				new sap.ui.core.HTML({content : "<div style='width : 20px;'/>"}),
				sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.EmployeeProfile", oController)],
			secondaryContent : [oLeftLayout]				
		}).addStyleClass("L2PBackgroundWhite");	
		
		oSplitContainer.addDelegate({
			onAfterRendering: function() {
				if(_gAuth == "M" || _gAuth == "H")
				$("#" + oController.PAGEID + "_SplitContainer-canvascntnt").addClass('L2PPaddingLeft20 EmployeeProfileCanvas');
			}
		});
		
		var oContents = [
			new sap.ui.core.HTML({content : "<div style='height : 20px;'/>"}),
			this.getTitleLayoutRender(oController),										// 타이틀
//			oHeaderBar,
			oSplitContainer
		];
		
		var oLayout = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : ["20px", "", "20px"],
			width : "100%",
			rows : $.map(oContents, function(rowData, k) {
				return new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell(),
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : rowData
						}),
						new sap.ui.commons.layout.MatrixLayoutCell()
					]
				})
			})
		});
		
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			showHeader : false,
		}).addStyleClass("L2PBackgroundWhite");
		
		return oPage;
	},
	
	getTitleLayoutRender : function(oController){
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							height : "20px",
							content : [ 
								new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_A.png"}),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_1831")	// 1831:사원 프로파일
								}).addStyleClass("MiddleTitle"),
								new sap.m.ToolbarSpacer()
							]
						}).addStyleClass("ToolbarNoBottomLine")
					})
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "20px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						vAlign : "Bottom",
						content : new sap.m.Toolbar({
							content : [ 
								new sap.ui.core.Icon({
									size : "1.1rem",
									color : "#005f28",
									src : "sap-icon://resize-horizontal",
									visible : _gAuth == "H" || _gAuth == "M" ? true : false,
									press : function(){
										var oSplitContainer = sap.ui.getCore().byId(oController.PAGEID + "_SplitContainer");
										if(oSplitContainer.getShowSecondaryContent()) {
											oSplitContainer.setShowSecondaryContent(false);
										} else {
											oSplitContainer.setShowSecondaryContent(true);
										}
									}
								}),
								new sap.m.ToolbarSpacer(),
								new sap.m.Button({
									text: oBundleText.getText("LABEL_2028"),	// 2028:인사기록카드 출력
									type : sap.m.ButtonType.Emphasized,
									visible : _gAuth == "H" || _gAuth == "M" ? true : false,
									press : oController.onPressSPdfButton
								})
							]
						}).addStyleClass("ToolbarNoBottomLine NoMarginLeft")
					})
				]
			})
		];
		
		return new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : false,
			columns : 1,
			width : "100%",
			rows : aRows
		});
	},

});