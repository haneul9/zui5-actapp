sap.ui.jsfragment("ZUI5_HR_Scholarship.fragment.HistoryDialog", {
	
	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_HistoryTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			fixedColumnCount : 4
//			noData : "No data found",
		});
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var col_info1 = [{id: "Zyear", label : oBundleText.getText("LABEL_0123"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "85px"},	// 123:수혜년도
						 {id: "Payym", label : oBundleText.getText("LABEL_0108"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 108:급여반영월
						 {id: "Fname", label : oBundleText.getText("LABEL_1145"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 1145:수혜자
						 {id: "Schtx", label : oBundleText.getText("LABEL_1155"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "180px"},	// 1155:학교명
						 {id: "Majnm", label : oBundleText.getText("LABEL_1150"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "180px"},	// 1150:전공
						 {id: "Sltxt", label : oBundleText.getText("LABEL_1161"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 1161:학년구분
						 {id: "Grdspt", label : oBundleText.getText("LABEL_1159"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "60px"},	// 1159:학년
						 {id: "Divcdt", label : oBundleText.getText("LABEL_1158"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "85px"},	// 1158:학기/분기
						 {id: "Masynt", label : oBundleText.getText("LABEL_1146"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 1146:일괄신청
						 {id: "Speyn", label : oBundleText.getText("LABEL_1153"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 1153:특수교육비 여부
						 {id: "Locat", label : oBundleText.getText("LABEL_1157"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "150px"},	// 1157:학교소재지
						 {id: "ZListComment", label : oBundleText.getText("LABEL_1086"), plabel : "", span : 0, type : "commentpopover3", sort : true, filter : true, width : "300px"},	// 1086:담당자 의견
						 {id: "ZbetEntr", label : oBundleText.getText("LABEL_1148"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "100px"},	// 1148:입학금(신청)
						 {id: "ZbetClas", label : oBundleText.getText("LABEL_1143"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "100px"},	// 1143:수업료(신청)
						 {id: "ZbetOper", label : oBundleText.getText("LABEL_1137"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "120px"},	// 1137:기성회비(신청)
						 {id: "ZbetEtc", label : oBundleText.getText("LABEL_1140"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "100px"},	// 1140:기타(신청)
						 {id: "ZbetTotl", label : oBundleText.getText("LABEL_1165"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "130px"},	// 1165:학자금총액(신청)
						 {id: "ZbetEntr2", label : oBundleText.getText("LABEL_1149"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "100px"},	// 1149:입학금(지급)
						 {id: "ZbetClas2", label : oBundleText.getText("LABEL_1144"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "100px"},	// 1144:수업료(지급)
						 {id: "ZbetOper2", label : oBundleText.getText("LABEL_1138"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "120px"},	// 1138:기성회비(지급)
						 {id: "ZbetEtc2", label : oBundleText.getText("LABEL_1141"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "100px"},	// 1141:기타(지급)
						 {id: "ZbetTotl2", label : oBundleText.getText("LABEL_1166"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "130px"},	// 1166:학자금총액(지급)
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
			beforeOpen : oController.beforeOpenHistoryDialog
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
 		return oDialog;
	}

});