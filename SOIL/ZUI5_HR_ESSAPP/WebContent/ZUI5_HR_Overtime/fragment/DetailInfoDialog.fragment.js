sap.ui.jsfragment("ZUI5_HR_Overtime.fragment.DetailInfoDialog", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		
		//////// 연장근무시간
		var oRow, oCell;
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			columns : 2,
			widths : ["50%", "50%"]
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Text({text : oBundleText.getText("LABEL_1955")}).addStyleClass("L2PFontFamily")	// 1955:연장근무시간(등록 시 기본 세팅)
		}).addStyleClass("L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Toolbar({
						content : [new sap.m.TimePicker(oController.PAGEID + "_Beguz", {
										valueFormat : "HHmm",
										displayFormat : "HH:mm",
							            width : "150px",
							            value : "{BeguzD}",
							            textAlign : sap.ui.core.TextAlign.Begin
								   }).addStyleClass("L2PFontFamily"),
								   new sap.m.ToolbarSpacer({width : "5px"}),
								   new sap.m.TimePicker({
										valueFormat : "HHmm",
										displayFormat : "HH:mm",
							            width : "150px",
							            value : "{EnduzD}",
							            textAlign : sap.ui.core.TextAlign.Begin
								   }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		
		//////// 대상자
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_AddTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
		});
		oTable.setModel(oController._DialogJsonModel);
		
		oTable.attachEvent("cellClick", function(oEvent) {
			oController._vSelectedIndex = oEvent.getParameters().rowIndex;
		})
		
		oTable.attachBrowserEvent("dblclick", function(oEvent) {
			oTable.addSelectionInterval(oController._vSelectedIndex, oController._vSelectedIndex);
			oController.onSaveDialog();
		});
		
		var oHeaders = [
			oBundleText.getText("LABEL_0039"),	// 39:소속부서 
			oBundleText.getText("LABEL_1030"), 	// 1030:직군
			oBundleText.getText("LABEL_0770"), 	// 770:직급
			oBundleText.getText("LABEL_0031"),	// 31:사번 
			oBundleText.getText("LABEL_0038"), 	// 38:성명
			oBundleText.getText("LABEL_1526"), 	// 1526:교대조
			oBundleText.getText("LABEL_0013"), 	// 13:근무형태
			oBundleText.getText("LABEL_0631"),	// 631:시작시간 
			oBundleText.getText("LABEL_0635")	// 635:종료시간
		];
		var oTypes = ["string", "string", "string", "string", "string", "string", "string", "time", "time"];
		var oFields = ["Orgtx", "Zzjikgbtx", "Zzjiktltx", "Perid", "Ename", "Rtext", "Ttext", "Sobeg", "Soend"];
		var oSizes = ["155px", "", "", "", "", "140px", "80px", "80px", "80px"];
		var oAligns = ["Center", "Center", "Center", "Center", "Center", "Center", "Center", "Center", "Center"];
		common.ZHR_TABLES.autoColumn(oController,oTable,oHeaders,oTypes,oFields,10,oSizes,oAligns);
		
		
		//////////////////////////////////////////////////////////////////////////////////////////////////
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_TargetDialog", {
			content : [new sap.m.Text({text : oBundleText.getText("LABEL_0882")}).addStyleClass("L2PFontFamilyBold"),	// 882:연장근무시간
					   new sap.ui.core.HTML({content : "<div style='height : 3px;'/>"}),
					   oMatrix, 
					   new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
					   new sap.m.Text({text : oBundleText.getText("LABEL_0111")}).addStyleClass("L2PFontFamilyBold"),	// 111:대상자
					   new sap.ui.core.HTML({content : "<div style='height : 3px;'/>"}),
					   oTable],
			contentWidth : "900px",
			contentHeight : "500px",
			showHeader : true,
			title : oBundleText.getText("LABEL_1680"),	// 1680:대상자 등록
			beginButton : new sap.m.Button({text : oBundleText.getText("LABEL_0037"), press : oController.onSaveDialog}),	// 37:선택
			endButton : new sap.m.Button({text : oBundleText.getText("LABEL_0071"), press : function(oEvent){oDialog.close();}}),	// 71:취소
			beforeOpen : oController.beforeOpenDetailInfoDialog
		});
		
		oDialog.setModel(new sap.ui.model.json.JSONModel());
		oDialog.bindElement("/Data");
		
//		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };
		

		return oDialog;
	}

});
