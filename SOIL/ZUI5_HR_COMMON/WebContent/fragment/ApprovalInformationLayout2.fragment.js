sap.ui.jsfragment("fragment.ApprovalInformationLayout2", {
	
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ApplyLayout
	*/
	
	createContent : function(oController) {
		jQuery.sap.require("common.ApprovalInformation");
		var oCell = null, oRow = null;
		
		var oApprovalMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : ['20%','30%','20%','30%']
		});
				
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1069")}).addStyleClass("Font14px FontBold FontColor3"),	// 1069:결재상태
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{ZappStxtAl}"
			}).addStyleClass("Font14px FontColor6"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1646")}).addStyleClass("Font14px FontBold FontColor3"),	// 1646:담당자결재일시
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({
				text : "{Appdtm1}"
			}).addStyleClass("Font14px FontColor6"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oApprovalMatrix.addRow(oRow);
		
		var oApprovalPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content :  [   new sap.m.Toolbar({
					    height : "40px",
						content : [ new sap.m.Image({
										src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",
								    }),
									new sap.m.ToolbarSpacer({width: "5px"}),
									new sap.m.Text({text : oBundleText.getText("LABEL_1472") }).addStyleClass("MiddleTitle")]	// 1472:결재내역
					    	}).addStyleClass("ToolbarNoBottomLine") ,
						oApprovalMatrix	
						],
			visible : {
				path : "ZappStatAl" ,
				formatter : function(fVal){
					if(!fVal || fVal == "" || fVal == "10" ) return false;
					else return true;
				}
			}
		});
		
		return oApprovalPanel;
	}

});
