sap.ui.jsfragment("ZUI5_HR_YEARTAX.fragment.Detail04_AddLine", {
	/** 세액감면 및 세액공제 - 보험료 **/
	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_AddLineTable", {
			enableColumnReordering : false,
			enableGrouping : false,
			enableColumnFreeze : false,
			enableBusyIndicator : true,
			showOverlay : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: "MultiToggle",
			visibleRowCount : 1
		}).addStyleClass("FontFamily");
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var col_info = [{id: "Stext", label : "관계", plabel : "", span : 0, type : "string", editable : true, sort : true, filter : true},
			 			{id: "Emnam", label : "성명", plabel : "", span : 0, type : "string", editable : true, sort : true, filter : true},
			 			{id: "Regnr", label : "주민등록번호", plabel : "", span : 0, type : "regnr", editable : true, sort : true, filter : true},];
		
		oController.makeTable(oController, oTable, col_info);
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "500px",
			contentHeight : "500px",
			draggable : false,
			content : [oTable],
			title : "대상자 선택",
			beginButton : [new sap.m.Button({
								icon : "sap-icon://add", 
								text : "선택",
								press : oController.onSaveAddLine
						   })],			
			endButton : [new sap.m.Button({icon: "sap-icon://decline", text : "닫기", press : function(oEvent){oDialog.close();}})]
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		oDialog.setModel(new sap.ui.model.json.JSONModel());
		oDialog.bindElement("/Data");
		
		return oDialog;
	}

});
