sap.ui.jsfragment("ZUI5_HR_Manpower2.fragment.Detail1", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		
		var oTable = new sap.ui.table.TreeTable(oController.PAGEID + "_Table1", {
			selectionMode: sap.ui.table.SelectionMode.None,
			noData : "No data found",
			rows : "{path:'/Data', parameters: {arrayNames:['Val2']}}",
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),		
					new sap.m.Text({text : oBundleText.getText("LABEL_2128")}).addStyleClass("MiddleTitle"),	// 2128:조회내역
				    new sap.m.ToolbarSpacer(),
				    new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						press : oController.onExport,
						type : "Ghost"
					})]
			}).addStyleClass("ToolbarNoBottomLine"),
		});
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");	
		
		
		var col_info1 = [
			{id: "Grouptx", label : oBundleText.getText("LABEL_0381"), plabel : oBundleText.getText("LABEL_0381"), resize : false, span : 0, type : "string2", sort : false, filter : false, width : "22%"},	// 381:조직
			 {id: "Mansum", label : oBundleText.getText("LABEL_0406"), plabel : oBundleText.getText("LABEL_0406"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "8%"},	// 406:계
			 {id: "Zzjikgb1", label : oBundleText.getText("LABEL_2177"), plabel : oBundleText.getText("LABEL_2071"), resize : false, span : 5, type : "string", sort : false, filter : false, width : "6%"},	// 2071:임원, 2177:직군별
	 		 {id: "Zzjikgb2", label : "", plabel : oBundleText.getText("LABEL_1818"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "6%"},	// 1818:사무직
 			 {id: "Zzjikgb3", label : "", plabel : oBundleText.getText("LABEL_2060"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "6%"},	// 2060:일반사무직
 			 {id: "Zzjikgb4", label : "", plabel : oBundleText.getText("LABEL_1852"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "6%"},	// 1852:생산직
 			 {id: "Zzjikgb5", label : "", plabel : oBundleText.getText("LABEL_1616"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "6%"},	// 1616:기타직
 			 {id: "Persg1", label : oBundleText.getText("LABEL_1498"), plabel : oBundleText.getText("LABEL_2071"), resize : false, span : 3, type : "string", sort : false, filter : false, width : "5%"},	// 1498:고용형태별, 2071:임원
 			 {id: "Persg2", label : "", plabel : oBundleText.getText("LABEL_2112"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 2112:정규직
 		     {id: "Persg3", label : "", plabel : oBundleText.getText("LABEL_1488"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 1488:계약직
 			 {id: "Gesch1", label : oBundleText.getText("LABEL_1862"), plabel : oBundleText.getText("LABEL_1620"), resize : false, span : 2, type : "string", sort : false, filter : false, width : "5%"},	// 1620:남성, 1862:성별
 			 {id: "Gesch2", label : "", plabel : oBundleText.getText("LABEL_1933"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 1933:여성
 			 {id: "Stat1", label : oBundleText.getText("LABEL_2092"), plabel : oBundleText.getText("LABEL_2090"), resize : false, span : 3, type : "string", sort : false, filter : false, width : "5%"},	// 2090:재직, 2092:재직상태별
 			 {id: "Stat2", label : "", plabel : oBundleText.getText("LABEL_2382"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 2382:휴직
 			 {id: "Stat3", label : "", plabel : oBundleText.getText("LABEL_1035"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 1035:파견
 			 ];
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
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
				   
				   oController.colorRows();
				   
			  }
		});
		
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			dimensions : [
				{
					axis : 1,
					name : "Year",
					value : "{Year}"
				}
			],
			measures : [
				{
					name : oBundleText.getText("LABEL_2071"),	// 2071:임원
					value : "{Ret01}"  
				},
				{
					name : oBundleText.getText("LABEL_1818"),	// 1818:사무직
					value : "{Ret02}"  
				},
				{
					name : oBundleText.getText("LABEL_2060"),	// 2060:일반사무직
					value : "{Ret03}"  
				},
				{
					name :  oBundleText.getText("LABEL_1852"),	// 1852:생산직
					value : "{Ret04}"  
				},
				{
					name :  oBundleText.getText("LABEL_1616"),	// 1616:기타직
					value : "{Ret05}"  
				}
			],
			data : {
				path : "/Data"
			}
		});
		
		var formatPattern = sap.viz.ui5.format.ChartFormatter.DefaultPattern;
		
		var oVizFrame =  new sap.viz.ui5.controls.VizFrame({
			width : "100%",
			height : "300px",
			vizType : "line",
			uiConfig : {
				showErrorMessage : false
			},
			dataset : oDataset,
			feeds : [
				new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid : "valueAxis",
					type : "Measure",
                    values : [
                    	oBundleText.getText("LABEL_2071"), 	// 2071:임원
                    	oBundleText.getText("LABEL_1818"),	// 1818:사무직
                    	oBundleText.getText("LABEL_2060"),	// 2060:일반사무직
                    	oBundleText.getText("LABEL_1852"),	// 1852:생산직
                    	oBundleText.getText("LABEL_1616")	// 1616:기타직
                   ]
				}),
				new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid : "categoryAxis",
					type : "Dimension",
                    values : ["Year"]
				})
			],
			vizProperties : {
				plotArea: {
	                dataLabel: {
	                    visible: true
	                },
	                colorPalette :  ["#5CBAE6", "#ff9900", "#ffff00", "#baee9a", "#dddddd"],
	                dataShape: {
		                primaryAxis: ["line","line","line","line","line"]
		            },
				},
	            valueAxis: {
	                title: {
	                    visible: false
	                }
	            },
	            legend: {
					label: {
						style: {
							fontFamily: "'Malgun Gothic', sans-serif"
						}
					}
				},
	            categoryAxis: {
	                title: {
	                    visible: false
	                }
	            },
	            title: {
	            	visible: false
	            },
	            interaction : { 
	            	selectability : { 
	            		mode : "single" 
	            	} 
	            },
	            legendGroup : {
	            	layout : {
	            		alignment : "center",
	            		position : "bottom",
	            	}
	            },
			}
		});
		oVizFrame.setModel(oController._VizJSonModel);

		oController._Columns = common.Common.convertColumnArrayForExcel(col_info1);
		return oTable;
	}
});
