sap.ui.jsfragment("ZUI5_HR_JoinClubHA.fragment.DetailInfoDialog", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_StateTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
		});
		oTable.setModel(oController._DialogJsonModel);
				
		var col_info1 = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "3%"},
						 {id: "Btext", label : "사업장", plabel : "", span : 0, type : "string", sort : true, filter : true},
						 {id: "Zclubtx", label : "인포멀그룹", plabel : "", span : 0, type : "string", sort : true, filter : true},
						 {id: "Member", label : "회원수", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "7%"},
						 {id: "Chairnm", label : "회장", plabel : "", span : 0, type : "string", sort : true, filter : true},
						 {id: "Mangnm", label : "총무", plabel : "", span : 0, type : "string", sort : true, filter : true},
						 {id: "Orgdt", label : "결성일자", plabel : "", span : 0, type : "date", sort : true, filter : true, width : "10%"},
						 {id: "Joinynt", label : "가입현황", plabel : "", span : 0, type : "string", sort : true, filter : true},
						 {id: "Entdt", label : "가입일자", plabel : "", span : 0, type : "date", sort : true, filter : true, width : "10%"}];
		common.ZNK_TABLES.makeColumn(oController, oTable, col_info1);

		
		var oDialog = new sap.m.Dialog({
			content :[oTable] ,
			contentWidth : "1000px",
//			contentHeight : "480px",
			showHeader : true,
			title : "인포멀그룹 가입현황",
			beforeOpen : oController.beforeOpenDetailInfoDialog,
			endButton : new sap.m.Button({text : "닫기", press : function(oEvent){oDialog.close();}})
		});
		
//		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };		

		return oDialog;
	}

});
