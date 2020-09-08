sap.ui.jsfragment("zui5_hrxx_project.fragment.ProjectRegistDialog", {
	
	createContent : function(oController) {
		
        var oCell = null, oRow = null;
		
        var oRequestLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 2,
			widths: ["30%","70%"],
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTNM"), required : true}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		 
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Input(oController.PAGEID + "_POP_Pjtnm", {
				width : "100%",
				customData : [{key : "Pjtid", value : ""}, {key : "Werks", value : ""}],
				showValueHelp: true,
				valueHelpOnly: true,
				valueHelpRequest: oController.onSearchProject,
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("EXPDA"), required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Toolbar({
				width : "100%",
				design : sap.m.ToolbarDesign.Auto,
				content : [
				           new sap.m.DatePicker(oController.PAGEID + "_POP_Begda", {
								valueFormat : "yyyy-MM-dd",
					            displayFormat : gDtfmt,
								width : "45%",
								change : oController.onChangeValue
						   }).addStyleClass("L2P13Font"),
						   new sap.m.Label({text:"~", width:"10%", textAlign:"Center"}),
						   new sap.m.DatePicker(oController.PAGEID + "_POP_Endda", {
								valueFormat : "yyyy-MM-dd",
					            displayFormat : gDtfmt,
								width : "45%",
								change : oController.onChangeDate
						   }).addStyleClass("L2P13Font")
						   ]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTAT"), required : true}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [
			           	new sap.m.Select(oController.PAGEID + "_POP_Pjtat", {
							width : "100%"
						}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList")),
					 ]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTRL")+"1", required : true}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [
			           	new sap.m.Select(oController.PAGEID + "_POP_Pjtr1", {
							width : "100%"
						}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList")),
					 ]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTRL")+"2"}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [
			           	new sap.m.Select(oController.PAGEID + "_POP_Pjtr2", {
							width : "100%"
						}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList")),
					 ]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTRL")+"3"}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [
			           	new sap.m.Select(oController.PAGEID + "_POP_Pjtr3", {
							width : "100%"
						}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList")),
					 ]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTRL")+"4"}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [
			           	new sap.m.Select(oController.PAGEID + "_POP_Pjtr4", {
							width : "100%"
						}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList")),
					 ]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"130px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTRP"), required : true}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 3,
			content : new sap.m.TextArea(oController.PAGEID + "_POP_Pjtrp", {
				width : "100%",
				rows : 7,
				maxLength : 60
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("APRNR")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Toolbar({
				width : "100%",
				design : sap.m.ToolbarDesign.Auto,
				content : [
							new sap.m.Label(oController.PAGEID + "_POP_Aprnrtx", {
								width : "80%",
								customData : {Key : "Aprnr" , value : ""}
							}).addStyleClass("L2P13Font"),
							new sap.m.ToolbarSpacer(),
							new sap.m.Button({
	            				text : oBundleText.getText("CHANGE_BTN"), 
	            				width : "100px" , 
	            				press : oController.onEmployeeSearch 
							}).addStyleClass("L2PPaddingRight20").addStyleClass("L2P13Font")
						   ]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell); 
		
		oRequestLayout.addRow(oRow);
		
		var oDialog = new sap.m.Dialog({
			content : [ oRequestLayout ],
			contentWidth : "800px",
			contentHeight : "700px",
			showHeader : true,
			title : oBundleText.getText("TITLE_PROJECT_EXP_CREATE"),
			//beforeOpen : oController.onBeforeOpenProjectRegistDialog,
			buttons : [ new sap.m.Button(oController.PAGEID + "_POP_SAVE",{
										text : oBundleText.getText("SAVE_BTN"), 
										width : "100px" ,
			            				press : oController.onPressSaveReg,  
			            				customData : [{Key : "Mode" , value : ""}, {Key : "Regno" , value : ""}] 
						}),
			            new sap.m.Button({
			            				text : oBundleText.getText("CANCEL_BTN"), 
			            				width : "100px" , 
			            				press : oController.onCloseProjectReg 
			            }).addStyleClass("L2PPaddingRight20"),
			            ]
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };

		return oDialog;
	}

});
