sap.ui.jsfragment("ZUI5_HR_ChartTest4.Tfragment.TotalRewardDialog2", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.SearchUser1");
		jQuery.sap.require("common.ZNK_TABLES");
		
		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(this._colModel);
		
		
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
			columnHeaderHeight  : 35,
			selectionMode: sap.ui.table.SelectionMode.None,
			noData : "No data found",
			rows : "{path:'/Data', parameters: {arrayNames:['Val2']}}",
			visibleRowCount : 12
		});
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");	
		
		
		var col_info1 = [{id: "Grouptx", label : "", plabel : "소속", span : 0, type : "string", sort : false, filter : false, width : "25%"},
						 {id: "Inwon", label : "", plabel : "직원수", span : 0, type : "string", sort : false, filter : false, width : "12%"},
						 {id: "Salry", label : "Reward", plabel : "Salary", span : 5, type : "stringtotal", sort : false, filter : false, align : "End"},
				 		 {id: "Benef", label : "", plabel : "Fringe Benefits", span : 0, type : "stringtotal", sort : false, filter : false, align : "End"},
			 			 {id: "Wlbrg", label : "", plabel : "Work-Life Balance", span : 0, type : "stringtotal", sort : false, filter : false, align : "End"},
			 			 {id: "Edurg", label : "", plabel : "Education", span : 0, type : "stringtotal", sort : false, filter : false, align : "End"},
			 			 {id: "Total", label : "", plabel : "Total", span : 0, type : "stringtotal", sort : false, filter : false, align : "End"},
			 			 ];
		common.ZNK_TABLES.makeColumn(oController, oTable, col_info1);
		
	   oTable.attachFirstVisibleRowChanged(function() {
           oController.colorRows()
       });
	   oTable.attachToggleOpenState(function() {
           oController.colorRows()
       });
	   
		   
		oTable.addEventDelegate({
			  onAfterRendering: function() {
				    var oTds = $("td[colspan]");
				    for(i=0; i<oTds.length; i++) {
				    	if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				    }
				    
				   common.Common.generateRowspan({
						selector : '#ZUI5_HR_ManpowerList_Table1-header > tbody',
						colIndexes : [0, 1]
					});
					
				// 상단 Header 의 우측 border 없에기
				   var vColumnId = "";
				   $target = $('#ZUI5_HR_ManpowerList_Table1-header > tbody');
				   $target.each(function() {
						$('tr:eq(0)', this).each(function(row) {
							$('td', this).filter(':visible').each(function(col) {
								vColumnId = this;
							});
						});
					});
				   
				   if(vColumnId != "") $(vColumnId).css("border-right","none"); 
				   
////				  oController.setTotalColorTable1();
//				   
//				   $('span[data-a="ABC"]').each(function() {
//						var pNode = $(this).closest('tr');
//						
//						pNode.css("background-color","#2F75B5");
//					});
				  
				   oController.colorRows();
				   
			  }
		});
		
		
		
		
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : [ 
							new sap.m.Button({
								text: "임원, 정규직",
								press : oController.onPressSearch ,
							}).addStyleClass("L2PFontFamily"),
							new sap.m.Button({
								text: "파견직",
								press : oController.onPressSearch ,
							}).addStyleClass("L2PFontFamily")
						],
					}),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({ height : "10px"}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : oTable
					}),
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : [ 
							new sap.m.Text({
								text: "※ 단위 : 백만원, ( ) : 인당평균",
							}).addStyleClass("L2PFontFamily"),
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
					height : "40px",
					content : [
						new sap.ui.core.Icon({
							src: "sap-icon://open-command-field", 
							size : "1.0rem"
						}),
						new sap.m.ToolbarSpacer({width: "5px"}),
						new sap.m.Text({
							text : "보상유형별 내역개요" 
						}).addStyleClass("L2PFontFamilyBold"),
					]
				}).addStyleClass("L2PToolbarNoBottomLine"), 
				new sap.ui.commons.layout.MatrixLayout({
					columns : 3,
					widths : ['15px',"",'15px'],
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
		}).addStyleClass("L2PFontFamily");
	   
   		oZyymm.addEventDelegate({
			onAfterRendering:function(){	
				 $("#" + oController.PAGEID + "_Zyymm-inner").mask("999999",{placeholder:"YYYYMM"});
			}
		});
   		
		
		return new sap.ui.layout.HorizontalLayout({
			allowWrapping : true,
			content : [
				new sap.ui.layout.VerticalLayout({
					content : [
						new sap.m.Text({
							text : "조직" 
						}),
						new sap.m.Input(oController.PAGEID + "_Orgeh", {
							width : "150px",
							showValueHelp: true,
							valueHelpOnly: true,
							value : "{Orgtx}",
							customData : new sap.ui.core.CustomData({key : "Orgeh", value : "{Orgeh}"}),
							valueHelpRequest: oController.displayOrgSearchDialog
						}).addStyleClass("L2PFontFamily")
					],
				}).addStyleClass("L2PFilterItem"),
				new sap.ui.layout.VerticalLayout({
					content : [
						new sap.m.Text({text : "조회연월"}),
						oZyymm
					]
				}).addStyleClass("L2PFilterItem"),
				new sap.ui.layout.VerticalLayout({
					content : [
						new sap.m.Label(),
						new sap.m.Button({
							text: "검색",
							icon : "sap-icon://search",
							press : oController.onPressSearchTotalReward2 ,
						}).addStyleClass("L2PFontFamily")
					]
				}).addStyleClass("L2PFilterItem")
			]
		}).addStyleClass("L2PFilterLayout")
		.setModel(oController._ListCondJSonModel)
		.bindElement("/Data");
	}
});