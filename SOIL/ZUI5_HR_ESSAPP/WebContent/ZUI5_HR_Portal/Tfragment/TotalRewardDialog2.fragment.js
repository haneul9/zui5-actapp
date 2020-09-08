sap.ui.jsfragment("ZUI5_HR_Portal.Tfragment.TotalRewardDialog2", {
	
	createContent : function(oController) {
		jQuery.sap.require("ZUI5_HR_Portal.common.TotalRewardController");
		jQuery.sap.require("common.SearchUser1");
		jQuery.sap.require("common.ZHR_TABLES");
		
		// Excel column info
//		oController._Columns = common.Common.convertColumnArrayForExcel(this._colModel);
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [ 
				this.getFilterLayoutRender(oController),
				this.getIntroRender(oController),
			]
		});
		
		
		var oDialog = new sap.m.Dialog({
			content : [
				oLayout
			],
			contentWidth : "1200px",
			horizontalScrolling : true,
			verticalScrolling : true, 
			showHeader : true,
			title : "Total Reward Dashboard",
			buttons :[new sap.m.Button({
							text : "닫기", 
							press : function(oEvent){
								oDialog.close();
							}
						}),
			
			]
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
	},
	
	
	/**
	 * 페이지 rendering
	 * 
	 * @param oController
	 * @return sap.ui.commons.layout.MatrixLayout
	 */
	getIntroRender : function(oController) {
		
		var notificationText = "<p> <span style=\"color:black;font-size:15px;\"> ※  </span> " +
		                       "<span style=\"color:red;font-size:15px;\"> ▲ </span> <span style=\"color:black;font-size:15px;\"> (전년도 대비 증가), </span>" +
		                       "<span style=\"color:blue;font-size:15px;\"> ▼ </span> <span style=\"color:black;font-size:15px;\"> (전년도 대비 감소), </span>" +
		                       "<span style=\"color:black;font-size:15px;\"> - 변동없음 </span>" ;
		
		
		var oTable = new sap.ui.table.TreeTable(oController.PAGEID + "_TotalTable2", {
//			columnHeaderHeight  : 35,
			selectionMode: sap.ui.table.SelectionMode.None,
			noData : "No data found",
			rows : "{path:'/Data', parameters: {arrayNames:['Val2']}}",
			visibleRowCount : 1
		});
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");	
		
		
		var col_info1 = [{id: "Grouptx", label : "소속", plabel : "소속", span : 0, type : "string", sort : false, filter : false, width : "25%"},
						 {id: "Inwon", label : "직원수", plabel : "직원수", span : 0, type : "string", sort : false, filter : false, width : "12%"},
						 {id: "Salry", label : "Reward", plabel : "Salary", span : 5, type : "stringtotal", sort : false, filter : false, align : "End"},
				 		 {id: "Benef", label : "Reward", plabel : "Fringe Benefits", span : 0, type : "stringtotal", sort : false, filter : false, align : "End"},
			 			 {id: "Wlbrg", label : "Reward", plabel : "Work-Life Balance", span : 0, type : "stringtotal", sort : false, filter : false, align : "End"},
			 			 {id: "Edurg", label : "Reward", plabel : "Education", span : 0, type : "stringtotal", sort : false, filter : false, align : "End"},
			 			 {id: "Total", label : "Reward", plabel : "Total", span : 0, type : "stringtotal", sort : false, filter : false, align : "End"},
			 			 ];
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
	   oTable.attachFirstVisibleRowChanged(function() {
		   ZUI5_HR_Portal.common.TotalRewardController.colorRows()
       });
	   oTable.attachToggleOpenState(function() {
		   ZUI5_HR_Portal.common.TotalRewardController.colorRows()
       });
	   
		   
		oTable.addEventDelegate({
			  onAfterRendering: function() {
				    var oTds = $("#ZUI5_HR_PortalList_TotalTable2-header > tbody ").find("td[colspan]");
				    for(i=0; i<oTds.length; i++) {
				    	if(oTds[i].colSpan > 1){
				    		$("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				    	}
				    }
				   common.Common.generateForceRowspan({
						selector : '#ZUI5_HR_PortalList_TotalTable2-header > tbody',
						colIndexes : [0, 1]
					});
					
				   ZUI5_HR_Portal.common.TotalRewardController.colorRows();
			  }
		});
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : oTable
					}),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : [ 
							new sap.m.Text({
								text: "※ 단위 : 백만원, ( ) : 인당평균",
							}).addStyleClass("FontFamily"),
						],
					}),
				]
			}),
		];
			
		return new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ 
				new sap.m.Toolbar({
					design : sap.m.ToolbarDesign.Auto,
					content : [
						new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : "보상유형별 내역개요" 
						}).addStyleClass("MiddleTitle"),
					]
				}).addStyleClass("ToolbarNoBottomLine marginTop15px marginBottom8px"),
				new sap.ui.commons.layout.MatrixLayout({
					columns : 1,
//					widths : ['20px',"",'20px'],
					width : '100%',
					rows : aRows
				}).setModel(oController._DetailJSonModel)
				.bindElement("/Data"),
			]
		});
	},
	
	/**
	 * 검색필터 rendering
	 * 
	 * @param oController
	 * @return sap.ui.layout.HorizontalLayout
	 */
	getFilterLayoutRender : function(oController) {
		var oZyymm = new sap.m.Input(oController.PAGEID + "_Zyymm",{
         	width : "150px",
         	value : "{Zyymm}",
//         	editable : {
//				path : "Autho",
//				formatter : function(fVal){
//					return "H" ? true : false
//				}
//         	}
		}).addStyleClass("FontFamily");
	   
   		oZyymm.addEventDelegate({
			onAfterRendering:function(){	
				 $("#" + oController.PAGEID + "_Zyymm-inner").mask("999999",{placeholder:"YYYYMM"});
			}
		});
   		
		var oFilterLayout = new sap.m.Toolbar({	
			height : "45px",
			content : [
			   new sap.m.ToolbarSpacer({width : "20px"}),
		       new sap.m.Text({text : "조직" }).addStyleClass("Font14px FontBold FontColor3"),	// 2130:조회연도
		       new sap.m.ToolbarSpacer({width : "10px"}),
		       new sap.m.Input(oController.PAGEID + "_Orgeh", {
					width : "150px",
					showValueHelp: true,
					valueHelpOnly: true,
					value : "{Orgtx}",
					customData : new sap.ui.core.CustomData({key : "Orgeh", value : "{Orgeh}"}),
					valueHelpRequest: oController.displayOrgSearchDialog,
					editable : {
							path : "Autho",
							formatter : function(fVal){
								return fVal == "H" ? true : false
							}
					}
				}).addStyleClass("FontFamily"),
			   new sap.m.ToolbarSpacer({width : "20px"}),
			   new sap.m.Text({text : "조회연월"}).addStyleClass("Font14px FontBold FontColor3"),
			   new sap.m.ToolbarSpacer({width : "10px"}),
			   oZyymm,
			   new sap.m.RadioButtonGroup({
					columns : 2,
					buttons : [new sap.m.RadioButton({text: "임원, 정규직"}).addStyleClass("FontFamilyBold"), 
					           new sap.m.RadioButton({text: "파견직", visible : false}).addStyleClass("FontFamilyBold")
					           ],
		            selectedIndex : "{Prgrp}",
					select : function(oEvent){
						oController._ListCondJSonModel.setProperty("/Data/Prgrp", oEvent.getParameters().selectedIndex);
					}
			   }),
			   new sap.m.ToolbarSpacer(),
			   new sap.m.Button({
					text: oBundleText.getText("LABEL_0002"),
					icon : "sap-icon://search",
					type : sap.m.ButtonType.Emphasized,
					press : ZUI5_HR_Portal.common.TotalRewardController.onPressSearch2 ,
			   }),
			   new sap.m.ToolbarSpacer({width : "20px"}),					   
			   ]
		}).setModel(oController._ListCondJSonModel)
		 .bindElement("/Data")
		 .addStyleClass("FilterLayout");
		
		return oFilterLayout;
	}
});