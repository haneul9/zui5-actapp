sap.ui.jsview("ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	getControllerName : function() {
		return "ZUI5_HR_ApprovalBox.ZUI5_HR_ApprovalBoxList";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf epmproductapp.EPMProductApp
	*/ 
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.SearchUser1");
		jQuery.sap.require("common.ZHR_TABLES");
		
		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(this._colModel);
		
		var oMatrix =  new sap.ui.commons.layout.MatrixLayout({
			layoutFixed : true,
			columns : 3,
			widths : ["20px", "",  "20px"],
			width : "100%",
			rows : [
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell(),
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : new sap.ui.commons.layout.VerticalLayout({
								width : "100%",
								content : [ 
									new sap.ui.core.HTML({ content : "<div style='height : 20px;'/>" }),
									this.getTitleLayoutRender(oController),
									this.getFilterLayoutRender(oController),
									new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
								]
							})
							.addStyleClass("sapUiSizeCompact")
						})
					]
				})
			]
		});
		
		oMatrix.addStyleClass("sapUiSizeCompact")
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oMatrix, this.getDeatilRender(oController)],
//			content : this.getDeatilRender(oController),
			showHeader : false,
		}).addStyleClass("WhiteBackground");
		
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");
		
				
		return oPage ;
	},
	
	/**
	 * 검색필터 rendering
	 * 
	 * @param oController
	 * @return sap.ui.layout.HorizontalLayout
	 */
	getFilterLayoutRender : function(oController) {
		
		var displayYn = (_gAuth == 'E') ? false : true;
		
		return new sap.m.Toolbar({
			height : "45px",
			content : [
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({text : oBundleText.getText("LABEL_0674") }).addStyleClass("Font14px FontBold"),	// 674:시작일자
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker({
					valueFormat : "yyyy-MM-dd",
		            displayFormat : "yyyy.MM.dd",
		            value : "{Apbeg}",
					textAlign : "Begin",
					change : oController.onChangeDate,
					width : "150px"
			   }).addStyleClass("FontFamily"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({text : oBundleText.getText("LABEL_2882")}).addStyleClass("Font14px FontBold"),	// 2882:종료일자
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.DatePicker({
						valueFormat : "yyyy-MM-dd",
						displayFormat : "yyyy.MM.dd",
			            value : "{Apend}",
						textAlign : "Begin",
						change : oController.onChangeDate,
						width : "150px"
				}).addStyleClass("FontFamily"),
				new sap.m.ToolbarSpacer({width : "20px"}),
				new sap.m.Text({text : oBundleText.getText("LABEL_1072"), visible : displayYn}).addStyleClass("Font14px FontBold"), 	// 1072:결재자
				new sap.m.ToolbarSpacer({width : "10px"}),
				new sap.m.Input(oController.PAGEID + "_Ename", {
					width : "150px",
					showValueHelp: true,
					valueHelpOnly: false,
					value : "{Ename}",
					customData : new sap.ui.core.CustomData({key : "Encid", value : "{Encid}"}),
					change : oController.EmpSearchByTx,
					valueHelpRequest: oController.displayEmpSearchDialog,
					visible : displayYn
				}).addStyleClass("Font14px FontColor6"),
				new sap.m.ToolbarSpacer(),
				new sap.m.Button({
					text: oBundleText.getText("LABEL_0002"),	// 2:검색
					icon : "sap-icon://search",
					type : sap.m.ButtonType.Emphasized,
					press : function(oEvent){
						  oController.setWorkplace(oEvent);
						   var oFilter = oController._ListCondJSonModel.getProperty("/Data");
						   if(oFilter.ZreqForm && oFilter.Gubun){			
							   var oNavigationList = sap.ui.getCore().byId(oController.PAGEID + "_NavigationList");
							   var oNavigationItem = sap.ui.getCore().byId(oController.PAGEID + "_" + oFilter.ZreqForm + "_" + oFilter.Gubun);
								
							   oNavigationList.setSelectedItem(oNavigationItem);
							   oController.onSelectNavigationList(oEvent, "X");
						   }
					}
				}),
				new sap.m.ToolbarSpacer({width : "20px"})
			]
		}).addStyleClass("FilterLayout");
	},
	
	
	/**
	 * 타이틀 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getTitleLayoutRender : function(oController) {
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.m.Toolbar({
							height : "20px",
							content : [ 
								new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_A.png"}),
								new sap.m.Text({
									text : oBundleText.getText("LABEL_1071")	// 1071:HR 결재함
								}).addStyleClass("Font18px FontColor0"),
								new sap.m.ToolbarSpacer()
							]
						}).addStyleClass("ToolbarNoBottomLine")
					})
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "45px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						vAlign : "Bottom",
						content : new sap.m.Toolbar({
							content : [ 
								new sap.m.Toolbar(oController.PAGEID + "_ManualToolbar", {}).addStyleClass("ToolbarNoBottomLine NoMarginLeft"),
								new sap.m.ToolbarSpacer(),
								new sap.m.Button({
									text : oBundleText.getText("LABEL_0041"), 	// 41:승인
									press : oController.onPressApprove,
									visible : {
										path : "Gubun",
										formatter : function(fVal){
											return fVal == "T";
										}
									}
								}),
								new sap.m.Button({
									text : oBundleText.getText("LABEL_0024"), 	// 24:반려
									press : oController.onPressReject,
									visible : {
										path : "Gubun",
										formatter : function(fVal){
											return fVal == "T";
										}
									}
								})
							]
						}).setModel(oController._ListCondJSonModel)
						  .bindElement("/Data")
						  .addStyleClass("ToolbarNoBottomLine NoMarginLeft")
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
	
	/**
	 * 상세 rendering
	 * 
	 * @param oController
	 * @return sap.m.Panel
	 */
	getDeatilRender : function(oController) {
		
		var oRow, oCell;
		var oLeftMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			widths : ["20px", ""],
			width : "100%",
			rows :[
				new sap.ui.commons.layout.MatrixLayoutRow({
					height : "30px",
				    cells : [ 
				    	new sap.ui.commons.layout.MatrixLayoutCell({ }),
					    new sap.ui.commons.layout.MatrixLayoutCell({
							content : new sap.m.Text({text : "Workplace"}).addStyleClass("L2P15FontBold L2PPaddingTop2 colorBlue"),
							hAlign : "Center",
							vAlign : "Middle"
						}).addStyleClass("Border-Bottom Border-Top background-white")
					]
				}),
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({ }),
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : sap.ui.jsfragment("ZUI5_HR_ApprovalBox.fragment.Detail01", oController),
							hAlign : "Center",
							vAlign : "Top"
						}).addStyleClass("Padding0 background-white")
					]
				})
			]
		});
		
		var oCenterMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			widths : ["", "20px"],
			width : "100%",
			rows : [ 
				new sap.ui.commons.layout.MatrixLayoutRow({
					height : "30px",
					cells : [
						new sap.ui.commons.layout.MatrixLayoutCell({
							content : [
								new sap.m.Toolbar({
						    		content : [
						    			new sap.m.ToolbarSpacer({width : "10px"}),
						    			new sap.m.Button({
						    				icon: 'sap-icon://menu2',
						    				type: sap.m.ButtonType.Ghost,
											press: function() {
						    					var oSplitContainer = sap.ui.getCore().byId(oController.PAGEID + "_SplitContainer");
						    					oSplitContainer.setShowSecondaryContent(!oSplitContainer.getShowSecondaryContent());
						    					if(oSplitContainer.getShowSecondaryContent() == false){
						    						$("#ZUI5_HR_ApprovalBoxList_SplitContainer-canvas").addClass("Left20");
						    					}else{
						    						$("#ZUI5_HR_ApprovalBoxList_SplitContainer-canvas").removeClass("Left20");
						    					}
						    					
						    				}
						    			}),
						    			new sap.m.ToolbarSpacer(),
						    			new sap.m.Text({
											text : {
												path : "Gubun",
												formatter : function(fVal){
													if(fVal == "T") return "Work to do";
													else if(fVal == "C") return "Work completed";
													else return "";
												}
											}
										}).setModel(oController._ListCondJSonModel)
										.bindElement("/Data")
										.addStyleClass("L2P15FontBold L2PPaddingTop2 colorBlue"),
						    			new sap.m.ToolbarSpacer(),
						    		]
						    	})
							],
							hAlign : "Center",
							vAlign : "Middle"
						}).addStyleClass("Border-Bottom Border-Top background-white")
					]
			  }),
			  new sap.ui.commons.layout.MatrixLayoutRow({
				cells : new sap.ui.commons.layout.MatrixLayoutCell({
					content : [sap.ui.jsfragment("ZUI5_HR_ApprovalBox.fragment.Detail02", oController)],
					hAlign : "Center",
					vAlign : "Top"
				}).addStyleClass("Padding0 L2PPaddingRight5")
		      })
			]
		});
		
		var oSplitContainer = new sap.ui.unified.SplitContainer(oController.PAGEID + "_SplitContainer", {
			secondaryContentWidth : "350px",
			showSecondaryContent : true,
			content : [oCenterMatrix],
			secondaryContent : [oLeftMatrix]	
		});
		
		return oSplitContainer;
	},
});
