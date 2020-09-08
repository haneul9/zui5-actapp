sap.ui.jsfragment("ZUI5_HR_TaxAdjustment.fragment.TaxTargetLayout", {
	
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
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_0038") , required : true}).addStyleClass("L2PFontFamily"),	// 38:성명
				}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
				
		var oName = new sap.m.Toolbar({
						content : [new sap.m.Input(oController.PAGEID + "_Ename",{ 
										width : "150px",
										value : "{Ename}",
										showValueHelp: true,
						        	    valueHelpOnly: false,
						        	    visible : { 
											  parts : [{path : "Auth"}, {path : "ZappStatAl"}],
											  formatter : function(fVal1,fVal2){
												  if(fVal1 == "E") return false ;
												  else if(fVal2 == "" || fVal2 == "10") return true ;
												  else return false;
											  }
										},
										editable : { 
											  parts : [{path : "Auth"}, {path : "ZappStatAl"}],
											  formatter : function(fVal1,fVal2){
												  if(fVal1 == "E") return false ;
												  else if(fVal2 == "") return true ;
												  else return false;
											  }
										},
										change : common.TargetUser.EmpSearchByTx,
										valueHelpRequest: common.TargetUser.displayEmpSearchDialog,
										customData : new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"}),
									}).addStyleClass("L2PFontFamilyBold"),
									new sap.m.Text({ 
										text : "{Ename}",
										visible : { 
											  parts : [{path : "Auth"}, {path : "ZappStatAl"}],
											  formatter : function(fVal1,fVal2){
												  if(fVal1 == "E") return true ;
												  else if(fVal2 == "" || fVal2 == "10") return false ;
												  else return true;
											  }
										},
									}).addStyleClass("L2PFontFamily"),	
							        new sap.m.ToolbarSpacer({width : "10px"})
						]
					}).addStyleClass("L2PToolbarNoBottomLine");
		
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : oName
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1317")}).addStyleClass("L2PFontFamily"),	// 1317:사원번호
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
				content : [new sap.m.Text({
					text : "{Perid}"
				}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oTargetMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0039")}).addStyleClass("L2PFontFamily"),	// 39:소속부서
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [new sap.m.Text({
							text : "{Orgtx}"
						}).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_1325")}).addStyleClass("L2PFontFamily"),	// 1325:주민번호
				}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				content : new sap.m.Toolbar({
						content : [new sap.m.Text({
							text : "{Regno}"
						}).addStyleClass("L2PFontFamily")]
					}).addStyleClass("L2PToolbarNoBottomLine")
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oTargetMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({text : oBundleText.getText("LABEL_0336")}).addStyleClass("L2PFontFamily"),	// 336:주소
				}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [new sap.m.Text({
							text : "{Address}",
						}).addStyleClass("L2PFontFamily")],
					}).addStyleClass("L2PToolbarNoBottomLine"),
					colSpan : 3
				}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oTargetMatrix.addRow(oRow);
		
		var oTargetPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [new sap.m.Toolbar({
							height : "40px",
							design : sap.m.ToolbarDesign.Auto,
							content : [new sap.ui.core.Icon({
											src: "sap-icon://open-command-field", 
											size : "1.0rem"
										}),
									   new sap.m.ToolbarSpacer({width: "5px"}),
								       new sap.m.Text({text : oBundleText.getText("LABEL_0111") }).addStyleClass("L2PFontFamilyBold")]	// 111:대상자
						}).addStyleClass("L2PToolbarNoBottomLine"), oTargetMatrix ]
		}).setModel(oController._TargetJSonModel)
		.bindElement("/Data");
	  
		return oTargetPanel;
	}

});
