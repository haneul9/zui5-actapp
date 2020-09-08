sap.ui.jsfragment("zui5_hrxx_actretire.fragment.RetireAction", {
	
	createContent : function(oController) {
		
//		var oMsgBar = new sap.m.Toolbar({
//			design : sap.m.ToolbarDesign.Auto,
//			content : new sap.m.Text({text : oBundleText.getText("MSG_APPCOMPLETE_INPUT")}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PToolbarNoBottomLine");
		
		var oMsgBar = new sap.m.Text({text: oBundleText.getText("MSG_APPCOMPLETE_INPUT")}).addStyleClass("L2P13Font");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		
		var oCell = null, oRow = null;
		
		var oActionLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 2,
			widths : ["20%", "80%"]
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "40px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ACT_EXIST_REQUEST"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Select(oController.PAGEID + "_RA_Docno", {
							width : "95%",
							change : oController.onChangeDocno
					   }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oActionLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "40px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ACTDATE"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.DatePicker(oController.PAGEID + "_RA_Actda", {
							value: dateFormat.format(curDate), 
							valueFormat : "yyyy-MM-dd",
				            displayFormat : gDtfmt,
							width : "95%",
							change : oController.onChangeDate
					   }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oActionLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "40px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("REQDP"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Select(oController.PAGEID + "_RA_Reqdp", {
						width: "95%",
					   }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oActionLayout.addRow(oRow);
		
		oActionLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height: "40px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("TITLE"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Input(oController.PAGEID + "_RA_Title", {
						width: "95%",
					   }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oActionLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.End,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2,
			content : [new sap.m.CheckBox(oController.PAGEID + "_RA_Action", {text: oBundleText.getText("MSG_RETIRE_TO_ACTION"), selected : false}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingRight10");
		oRow.addCell(oCell);
		
		oActionLayout.addRow(oRow);
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_RA_Dialog",{
			content :[oMsgBar, 
			          new sap.ui.core.HTML({content : "<div style='height:15px'> </div>",	preferDOM : false}),
			          oActionLayout] ,
			contentWidth : "800px",
			contentHeight : "300px",
			showHeader : true,
			title : oBundleText.getText("TITLE_RETIRE_ACTION"),
			beforeOpen : oController.onBeforeOpenRetireActionDialog,
			beginButton : new sap.m.Button({text : oBundleText.getText("CONFIRM_BTN"), icon: "sap-icon://accept", press : oController.onPressRetireAction}), //
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"), icon: "sap-icon://sys-cancel-2", press : oController.onRAClose}),
		});
		
		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
	    };		

		return oDialog;
	}

});
