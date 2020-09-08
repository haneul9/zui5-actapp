sap.ui.jsfragment("zui5_hrxx_project.fragment.SelectPernr", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf SelectPernr
	*/
	
	createContent : function(oController) {
		
        var oCell = null, oRow = null;
		
		var oCreateLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 2,
			widths : ["30%", "70%"]
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("PJTPM"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oPjtrg = new sap.m.Input(oController.PAGEID + "_POP_Pjtrg", {
			width : "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			customData : new sap.ui.core.CustomData({key : "Pjtrg", value : ""}),
			valueHelpRequest: oController.onEmployeeSearch,
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oPjtrg
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		oCreateLayout.addRow(oRow);
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_Dialog",{
			content :[oCreateLayout] ,
			contentWidth : "450px",
			contentHeight : "200px",
			showHeader : true, 
			title : oBundleText.getText("PROJECT_STATUS_R"),
			beginButton : new sap.m.Button({text : oBundleText.getText("CREATE_BTN"), icon: "sap-icon://create", press : oController.onSelectPernr}), //
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"), icon: "sap-icon://sys-cancel-2", press : oController.onClose}),
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		
	    oDialog.addDelegate({
			onAfterRendering: oController.addOrgehItems
		});
		return oDialog;
	}

});
