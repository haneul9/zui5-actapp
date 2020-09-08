sap.ui.jsfragment("ZUI5_HR_InfantCare.fragment.HistoryDialog", {
	
	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_HistoryTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
		});
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var col_info1 = [
			{id: "Payym", label : oBundleText.getText("LABEL_0108"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 108:급여반영월
			{id: "Fname", label : oBundleText.getText("LABEL_0111"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "10%"},	// 111:대상자
			{id: "Fgbdt", label : oBundleText.getText("LABEL_0121"), plabel : "", span : 0, type : "date", sort : true, filter : false, width : "8%"},	// 121:생년월일
			{id: "Zyear", label : oBundleText.getText("LABEL_0123"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 123:수혜년도
			{id: "Divcdt", label : oBundleText.getText("LABEL_0115"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 115:분기
			{id: "Mont", label : oBundleText.getText("LABEL_0134"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 134:월
			{id: "Chsnm", label : oBundleText.getText("LABEL_0129"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "18%"},	// 129:시설명
			{id: "Apply", label : oBundleText.getText("LABEL_0138"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "10%"},	// 138:지급액
			{id: "Symptn", label : oBundleText.getText("LABEL_0072"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "14%", align: "Begin"},	// 72:담당자의견
			{id: "Appno", label : oBundleText.getText("LABEL_0127"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 127:신청번호
		];
		
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTable = sap.ui.getCore().byId("ZUI5_HR_InfantCareDetail_HistoryTable");
				
				oTable.getColumns().forEach(function(elem) {
					elem.setSorted(false);
					elem.setFiltered(false);
				});
				
				oTable.clearSelection();
				oTable.bindRows("/Data");
			}
		});
		
		var oDialog = new sap.m.Dialog({
			content :[ new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),  
					   oTable] ,
			contentWidth : "1000px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0136"),	// 136:지급내역
			endButton : new sap.m.Button({text : oBundleText.getText("LABEL_0017"), press : function(){ // 17:닫기
					oTable.getModel().setData({Data : []});
					oTable.setVisibleRowCount(0);
					oDialog.close();
				}
			}),
			beforeOpen : oController.beforeOpenHistoryDialog
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
 		return oDialog;
	}

});