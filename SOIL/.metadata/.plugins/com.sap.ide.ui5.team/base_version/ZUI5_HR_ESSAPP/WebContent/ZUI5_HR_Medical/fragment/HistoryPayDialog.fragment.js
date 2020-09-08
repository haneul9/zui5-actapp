sap.ui.jsfragment("ZUI5_HR_Medical.fragment.HistoryPayDialog", {
	
	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_HistoryPayTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			visibleRowCount : 10
//			noData : "No data found",
		});
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var col_info1 = [
			{id: "Payym", label : oBundleText.getText("LABEL_0108"), plabel : "", span : 0, type : "Zpayym", sort : true, filter : true, width : "80px"},	// 108:급여반영월
			{id: "Famgbtx", label : oBundleText.getText("LABEL_1085"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 1085:관계
			{id: "Fname", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 38:성명
			{id: "Wedyn", label : oBundleText.getText("LABEL_1090"), plabel : "", span : 0, type : "Checkbox5", sort : true, filter : true, width : "100px"},	// 1090:미혼여부(자녀)
			{id: "Depyn", label : oBundleText.getText("LABEL_1083"), plabel : "", span : 0, type : "Checkbox5", sort : true, filter : true, width : "170px"},	// 1083:건강보험 피부양자 여부
			{id: "Begda", label : oBundleText.getText("LABEL_1108"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 1108:진료시작일
			{id: "Endda", label : oBundleText.getText("LABEL_1109"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 1109:진료종료일
			{id: "Medtytx", label : oBundleText.getText("LABEL_1110"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "150px"},	// 1110:질병유형
			{id: "Samyn", label : oBundleText.getText("LABEL_1089"), plabel : "", span : 0, type : "Checkbox5", sort : true, filter : true, width : "100px"},	// 1089:동일병명 여부
			{id: "Disenm", label : oBundleText.getText("LABEL_1092"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "300px"},	// 1092:병명
			{id: "Medorg", label : oBundleText.getText("LABEL_1107"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "200px"},	// 1107:진료기관
			{id: "Foryntx", label : oBundleText.getText("LABEL_1102"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 1102:입원/외래
			{id: "Recpgbtx", label : oBundleText.getText("LABEL_1096"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 1096:영수증구분
			{id: "Apamt", label : oBundleText.getText("LABEL_0081"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "80px"},	// 81:신청금액
			{id: "Deamt", label : oBundleText.getText("LABEL_0474"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "80px"},	// 474:공제금액
			{id: "Total", label : oBundleText.getText("LABEL_1095"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "80px"},	// 1095:신청합계
			{id: "Pyamt", label : oBundleText.getText("LABEL_0139"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "80px"},	// 139:지원금액
			{id: "Appno", label : oBundleText.getText("LABEL_0127"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 127:신청번호
		];
		
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
		
		var oDialog = new sap.m.Dialog({
			content :[ new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),  
					   oTable] ,
			contentWidth : "100%",
			showHeader : true,
			title : oBundleText.getText("LABEL_0136"),	// 136:지급내역
			endButton : new sap.m.Button({text : oBundleText.getText("LABEL_0017"), press : function(){ // 17:닫기
					oTable.getModel().setData({Data : []});
					oTable.setVisibleRowCount(0);
					oDialog.close();
				}
			}),
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
 		return oDialog;
	}

});