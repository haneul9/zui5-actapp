sap.ui.jsfragment("ZUI5_HR_Expenditure.fragment.HistoryDialog", {
	
	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_HistoryTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
//			noData : "No data found",
		});
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var col_info1 = [{id: "Context", label : oBundleText.getText("LABEL_1183"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "150px"},	// 1183:경조유형
						 {id: "Conretx", label : oBundleText.getText("LABEL_1085"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "150px"},	// 1085:관계
						 {id: "Fname", label : oBundleText.getText("LABEL_1191"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "150px"},	// 1191:대상자명
						 {id: "Conrdate", label : oBundleText.getText("LABEL_1193"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "120px"},	// 1193:사유발생일
						 {id: "BabyCnt", label : oBundleText.getText("LABEL_1195"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 1195:태아수(명)
						 {id: "Conplace", label : oBundleText.getText("LABEL_0581"), plabel : "", span : 0, type : "string", sort : true, filter : true },	// 581:장소
						 {id: "Absbg", label : oBundleText.getText("LABEL_1185"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "120px"},	// 1185:경조휴가시작일
						 {id: "Absed", label : oBundleText.getText("LABEL_1187"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "120px"},	// 1187:경조휴가종료일
						 {id: "ZpayBet", label : oBundleText.getText("LABEL_1182"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "150px"},	// 1182:경조금액
						 {id: "Appno", label : oBundleText.getText("LABEL_0127"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 127:신청번호
						 ];
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
		
		var oDialog = new sap.m.Dialog({
			content :[ new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),  
					   oTable] ,
			contentWidth : "100%",
			showHeader : true,
			title : oBundleText.getText("LABEL_0136"),	// 136:지급내역
			endButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0017"), // 17:닫기 
				press : function(){
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