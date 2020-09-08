sap.ui.jsfragment("fragment.TargetLayout", {
	
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf TargetLayout
	*/
	
	createContent : function(oController) {
		jQuery.sap.require("common.TargetUser");
		
		var oCell = null, oRow = null;
		
		// 대상자
		var oTargetMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_TargetMatrix",{
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "31px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : {
				path : "Ename",
				formatter : function(fVal){
					if(oController._vLangu && oController._vLangu == "E") return "Name / Personal ID";
					else return oBundleText.getText("LABEL_0038") +" / " + oBundleText.getText("LABEL_1317");	
					// 38:성명  1317 사원번호
				}
			}}).addStyleClass("Font14px FontBold FontColor3"),
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
				
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					vAlign : "Middle",
					content : [
						new sap.m.Toolbar({
							visible : { 
								parts : [{path : "ZappStatAl"}],
								formatter : function(fVal) {
									return gReqAuth != "1" && (fVal == "" || fVal == "10") ? true : false;
								}
							},
							content : [
								new sap.m.Input(oController.PAGEID + "_Ename",{ 
									width : "150px",
									value : "{Ename}",
									showValueHelp: true,
									valueHelpOnly: false,
									editable : { 
										parts : [{path : "ZappStatAl"}],
										formatter : function(fVal){
											return gReqAuth != "1" && fVal == "" ? true : false;
										}
									},
									change : common.TargetUser.EmpSearchByTx,
									valueHelpRequest: common.TargetUser.displayEmpSearchDialog,
									customData : new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"}),
								}).addStyleClass("Font14px FontBold FontColor3"),
								new sap.m.Text({ 
									text : "/",
								}).addStyleClass("Font14px FontColor6 MinWidth0"),
								new sap.m.Text({ 
									text : " {Perid}",
									visible : {
										path : "Perid",
										formatter : function(fVal){
											return !common.Common.checkNull(fVal) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor6")
							]
						}),
						new sap.m.Toolbar({
							visible : { 
								parts : [{path : "ZappStatAl"}],
								formatter : function(fVal) {
									return gReqAuth == "1" || (fVal != "" && fVal != "10") ? true : false;
								}
							},
							content : [
								new sap.m.Text({ 
									text : "{Ename}",
								}).addStyleClass("Font14px FontColor6"),
								new sap.m.Text({ 
									text : "/",
								}).addStyleClass("Font14px FontColor6 MinWidth0"),
								new sap.m.Text({ 
									text : " {Perid}",
									visible : {
										path : "Perid",
										formatter : function(fVal){
											return !common.Common.checkNull(fVal) ? true : false;
										}
									}
								}).addStyleClass("Font14px FontColor6")
							]
						}),
//						new sap.m.Toolbar({
//							content : [
//								new sap.m.Text({ 
//									text : "/",
//								}).addStyleClass("Font14px FontColor6 PaddingLeft5 PaddingRight5"),
//								new sap.m.Text({ 
//									text : " {Perid}",
//									visible : {
//										path : "Perid",
//										formatter : function(fVal){
//											return !common.Common.checkNull(fVal) ? true : false;
//										}
//									}
//								}).addStyleClass("Font14px FontColor6")
//							]
//						})
					]
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : {
				path : "Ename",
				formatter : function(fVal){
					if(oController._vLangu && oController._vLangu == "E") return "Department";
					else return oBundleText.getText("LABEL_1005");	// 1005:사업장 / 소속부서
				}
			}}).addStyleClass("Font14px FontBold FontColor3"),
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [new sap.m.Text({
							text : {
								parts : [{path : "Btrtx"}, {path : "Orgtx"}],
								formatter : function(fVal1, fVal2){
									if(fVal1 || fVal2) return fVal1 + " / " + fVal2;
								}
							}
						}).addStyleClass("Font14px FontColor6")]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oTargetMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "31px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : {
						path : "Ename",
						formatter : function(fVal){
							if(oController._vLangu && oController._vLangu == "E") return "Position Assignment";
							else return oBundleText.getText("LABEL_2750");	// 2750:직군 / 직위
						}
					}}).addStyleClass("Font14px FontBold FontColor3"),
				}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				content : new sap.m.Toolbar({
						content : [new sap.m.Text({
							text : {
								parts : [{path : "Zzjikgbt"}, {path : "Zzjiklnt"}],
								formatter : function(fVal1, fVal2){
									if(fVal1 || fVal2) return fVal1 + " / " + fVal2;
								}
							}
						}).addStyleClass("Font14px FontColor6")]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Text({text : {
						path : "Ename",
						formatter : function(fVal){
							if(oController._vLangu && oController._vLangu == "E") return "Title";
							else return oBundleText.getText("LABEL_1007");	// 1007:직책
						}
					}}).addStyleClass("Font14px FontBold FontColor3"),
				}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [new sap.m.Text({
							text : "{Zzjikcht}",
						}).addStyleClass("Font14px FontColor6")]
					}).addStyleClass("ToolbarNoBottomLine")
				}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oTargetMatrix.addRow(oRow);
		
		var oTargetPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [new sap.m.Toolbar(oController.PAGEID + "_TargetToolbar", {
							height : "20px",
							design : sap.m.ToolbarDesign.Auto,
							content : [new sap.m.Image({
											src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",
									    }),
									   new sap.m.ToolbarSpacer({width: "5px"}),
									   new sap.m.Text({text : {
											path : "Enametag",
											formatter : function(fVal){
												if(oController._vLangu && oController._vLangu == "E") return "Target Person";
												else return oBundleText.getText("LABEL_2790");	// 2790:대상자
											}
										}}).addStyleClass("MiddleTitle")]
						}).addStyleClass("ToolbarNoBottomLine marginBottom10px"), oTargetMatrix ]
		}).setModel(oController._TargetJSonModel)
		.bindElement("/Data");
	  
		return oTargetPanel;
	}

});
