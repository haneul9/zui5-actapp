sap.ui.jsfragment("ZUI5_HR_Overtime.fragment.WorkTimeDialog", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_WorkTimeTable", {
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
		
		var oHeaders = [
			oBundleText.getText("LABEL_0039"), 	// 39:소속부서
			oBundleText.getText("LABEL_1030"), 	// 1030:직군
			oBundleText.getText("LABEL_0770"), 	// 770:직급
			oBundleText.getText("LABEL_0038"),	// 38:성명 
			oBundleText.getText("LABEL_1526"), 	// 1526:교대조
			oBundleText.getText("LABEL_1585")	// 1585:금주OT누적
		];
		var oTypes = ["string", "string", "string", "string", "string", "string"];
		var oFields = ["Orgtx", "Zzjikgbtx", "Zzjiktltx", "Ename", "Rtext", "Ottm2"];
		var oSizes = ["", "", "", "", "", "180px"];
		var oAligns = ["Center", "Center", "Center", "Center", "Center", "Center"];
		common.ZHR_TABLES.autoColumn(oController,oTable,oHeaders,oTypes,oFields,1,oSizes,oAligns);
		
		
		var oDialog = new sap.m.Dialog({
			content :[oTable] ,
			contentWidth : "800px",
			contentHeight : "500px",
			showHeader : true,
			title : oBundleText.getText("LABEL_1457"),	// 1457:개인별 근무현황
			endButton : new sap.m.Button({text : oBundleText.getText("LABEL_0017"), press : function(oEvent){oDialog.close();}}) // 17:닫기
//			afterOpen : oController.afterOpenDetailInfoDialog
		});
		
//		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };
		

		return oDialog;
	}

});
