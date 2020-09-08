sap.ui.jsfragment("fragment.Comments", {
	
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf Mandate
	*/
	
	// oController._vReqForm 신청서 유형, oController._vReqPernr 신청자 사번
	
	createContent : function(oController) {
		
		// 담당자 의견
		var oCommentPanel =  new sap.m.Panel({
			expandable : false,
			expanded : false,
			content :  [new sap.m.Toolbar({
							height : "40px",
							content : [ new sap.ui.core.Icon({
										src: "sap-icon://open-command-field", 
										size : "1.0rem"
									}),
									new sap.m.ToolbarSpacer({width: "5px"}),
									   new sap.m.Text({text : {
										    path : "Ename",
									   		formatter : function(fVal){
												if(oController._vLangu && oController._vLangu == "E") return "HR Team Opinion";
												else return oBundleText.getText("LABEL_1086");	// 1086:담당자 의견
									   }}}).addStyleClass("MiddleTitle")]
					    	}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px") ,
						new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
						new sap.m.TextArea({
								value : "{Symptn}",
								rows : 4,
								width : "100%",
								editable : false
							}).addStyleClass("Font14px FontColor6"),
						],
			visible : { parts : [{path : "ZappStatAl"}, {path : "Symptn"}],
					    formatter : function(fVal1, fVal2){
				    	   if(fVal1 && ( fVal1 == "30" || fVal1 == "35" || fVal1 == "40" || fVal1 == "50" ) && fVal2 && fVal2 != "" ){
				    		   return true;
				    	   } else return false;
				       }}
		});
		
		// 반려사유
		var oRejPanel =  new sap.m.Panel({
			expandable : false,
			expanded : false,
			content :  [new sap.m.Toolbar({
							height : "40px",
							content : [ new sap.ui.core.Icon({
										src: "sap-icon://open-command-field", 
										size : "1.0rem"
									}),
									new sap.m.ToolbarSpacer({width: "5px"}),
									new sap.m.Text({text : oBundleText.getText("LABEL_1075") }).addStyleClass("MiddleTitle")]	// 1075:반려사유
					    	}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px") ,
						new sap.ui.core.HTML({content : "<div style='height : 5px;'/>"}),
						new sap.m.TextArea({
								value : "{ZappResn}",
								rows : 4,
								width : "100%",
								editable : false
							}).addStyleClass("Font14px FontColor6"),
						],
			visible : { parts : [{path : "ZappStatAl"}, {path : "ZappResn"}],
					    formatter : function(fVal1, fVal2){
				    	   if(fVal1 && ( fVal1 == "31" || fVal1 == "36" || fVal1 == "45" || fVal1 == "55" ) && fVal2 && fVal2 != "" ){
				    		   return true;
				    	   } else return false;
				       }}
		});
		
		var oCell = null, oRow = null;
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			columns : 1
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [oCommentPanel]
		});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [oRejPanel]
		});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oMatrix.setModel(oController._DetailJSonModel);
		oMatrix.bindElement("/Data");

		return oMatrix;
	}

});
