sap.ui.jsfragment("fragment.ApplyLayout", {
	
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ApplyLayout
	*/
	
	createContent : function(oController) {
		jQuery.sap.require("common.ApplyUser");
		
		var oCell = null, oRow = null;
		
		// 신청자
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "성명"}).addStyleClass("Font14px FontBold FontColor3"),
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content :  new sap.m.Text({
								text : "{Ename}",
							}).addStyleClass("Font14px FontColor6")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "소속부서"}).addStyleClass("Font14px FontBold FontColor3"),
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
								text : "{Orgtx}"
							}).addStyleClass("Font14px FontColor6")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "직군 / 직위"}).addStyleClass("Font14px FontBold FontColor3"),
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
								text : {
									parts : [{path : "Zzjikgbt"}, {path : "Zzjiklnt"}],
									formatter : function(fVal1, fVal2){
										if(fVal1 || fVal2) return fVal1 + " / " + fVal2;
									}
								}
							}).addStyleClass("Font14px FontColor6")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : "신청일시"}).addStyleClass("Font14px FontBold FontColor3"),
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
							text : "{Appdt}",
						}).addStyleClass("Font14px FontColor6")
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		var oApplyPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content :  [   new sap.m.Toolbar({
					    height : "20px",
						content : [ new sap.m.Image({
									  src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",
								    }),
									new sap.m.ToolbarSpacer({width: "5px"}),
									new sap.m.Text({text : "신청자" }).addStyleClass("MiddleTitle")]
					    	}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px") ,
					    	oMatrix	
						],
			visible : {
				path : "ZappStatAl" ,
				formatter : function(fVal){
					if(!fVal || fVal == "" || fVal == "10" ) return false;
					else return true;
				}
			}
		}).setModel(oController._ApplyJSonModel)
		.bindElement("/Data");
		
		return oApplyPanel;
	}

});
