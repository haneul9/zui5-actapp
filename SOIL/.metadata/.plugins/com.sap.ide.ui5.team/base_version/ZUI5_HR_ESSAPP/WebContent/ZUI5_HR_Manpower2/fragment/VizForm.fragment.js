sap.ui.jsfragment("ZUI5_HR_Manpower2.fragment.VizForm", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			dimensions : [
				{
					axis : 1,
					name : "Object",
					value : "{Object}"
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
			height : "500px",
			vizType : "line",
			uiConfig : {
//				applicationSet : "fiori",
				showErrorMessage : false
			},
			dataset : oDataset,
			feeds : [
				new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid : "valueAxis",
					type : "Measure",
                    values : [
                    	oBundleText.getText("LABEL_2071"),	// 2071:임원
                    	oBundleText.getText("LABEL_1818"),	// 1818:사무직
                    	oBundleText.getText("LABEL_2060"),	// 2060:일반사무직
                    	oBundleText.getText("LABEL_1852"),	// 1852:생산직
                    	oBundleText.getText("LABEL_1616")	// 1616:기타직
                    ]
				}),
				new sap.viz.ui5.controls.common.feeds.FeedItem({
					uid : "categoryAxis",
					type : "Dimension",
                    values : ["Object"]
				})
			],
			vizProperties : {
				plotArea: {
	                dataLabel: {
//	                    formatString:formatPattern.SHORTFLOAT,
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
							fontFamily: "'Noto Sans CJK KR Regular', sans-serif, sans-serif"
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

		var oRow, oCell;
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "20px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow().addStyleClass("BorderLayout");
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({content : oVizFrame});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		return oMatrix;
//		return oVizFrame;
		
	}
});
