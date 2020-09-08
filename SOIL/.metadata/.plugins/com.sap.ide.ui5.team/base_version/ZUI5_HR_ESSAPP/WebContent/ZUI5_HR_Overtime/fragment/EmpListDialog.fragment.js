sap.ui.jsfragment("ZUI5_HR_Overtime.fragment.EmpListDialog", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		var vIndex = -1;
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_EmpListTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
		});
		oTable.setModel(new sap.ui.model.json.JSONModel());
		
		oTable.attachEvent("cellClick", function(oEvent) {
			oTable.clearSelection();
			vIndex = -1;
			vIndex = oEvent.getParameters().rowIndex;
		})
		
		oTable.attachBrowserEvent("dblclick", function(oEvent) {
			oTable.clearSelection();
			oTable.addSelectionInterval(vIndex, vIndex);
			oController.onSelectEmp();
		});
		
		var oHeaders = [
			oBundleText.getText("LABEL_0039"), 	// 39:소속부서
			oBundleText.getText("LABEL_1030"), 	// 1030:직군
			oBundleText.getText("LABEL_0770"), 	// 770:직급
			oBundleText.getText("LABEL_0031"), 	// 31:사번
			oBundleText.getText("LABEL_0038"), 	// 38:성명
			oBundleText.getText("LABEL_1526"), 	// 1526:교대조
			oBundleText.getText("LABEL_0013"),	// 13:근무형태 
			oBundleText.getText("LABEL_0631"), 	// 631:시작시간
			oBundleText.getText("LABEL_0635")	// 635:종료시간
		];
		var oTypes = ["string", "string", "string", "string", "string", "string", "string", "time", "time"];
		var oFields = ["Orgtx", "Zzjikgbtx", "Zzjiktltx", "Perid", "Ename", "Rtext", "Ttext", "Sobeg", "Soend"];
		var oSizes = ["155px", "", "", "", "", "140px", "80px", "80px", "80px"];
		var oAligns = ["Center", "Center", "Center", "Center", "Center", "Center", "Center", "Center"];
		common.ZHR_TABLES.autoColumn(oController,oTable,oHeaders,oTypes,oFields,13,oSizes,oAligns);
		
		
		var oDialog = new sap.m.Dialog({
			content :[oTable] ,
			contentWidth : "900px",
			contentHeight : "500px",
			showHeader : true,
			title : oBundleText.getText("LABEL_1675"),	// 1675:대근휴가자
			beginButton : new sap.m.Button({text : oBundleText.getText("LABEL_0037"), press : oController.onSelectEmp}),	// 37:선택
			endButton : new sap.m.Button({text : oBundleText.getText("LABEL_0071"), press : oController.onCloseEmpList}),	// 71:취소
			beforeOpen : oController.beforeOpenEmpListDialog
		});
		
//		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };
		

		return oDialog;
	}

});
