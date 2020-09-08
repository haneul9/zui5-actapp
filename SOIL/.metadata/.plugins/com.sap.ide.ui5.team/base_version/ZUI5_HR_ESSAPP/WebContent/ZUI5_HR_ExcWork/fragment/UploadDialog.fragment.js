sap.ui.jsfragment("ZUI5_HR_ExcWork.fragment.UploadDialog", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.ZHR_TABLES");
		
		var oUploadTable = new sap.ui.table.Table(oController.PAGEID + "_UploadTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			visibleRowCount : 10,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
		})
		.setModel(oController._UploadTableJSonModel)
		.bindRows("/Data");
		
		var uploadModel = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "5%"},
			               {id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 31:사번
			               {id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 38:성명
			               {id: "Datum", label : oBundleText.getText("LABEL_1983"), plabel : "", span : 0, type : "date", sort : false, filter : false, width : "10%"},	// 1983:예외적용일
			               {id: "Ttext", label : oBundleText.getText("LABEL_1982"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 1982:예외적용근무시간
			               {id: "Excwrkt", label : oBundleText.getText("LABEL_1985"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},	// 1985:예외특근유형
			               {id: "Offsup", label : oBundleText.getText("LABEL_1418"), plabel : "", span : 0, type : "Checkbox2", sort : false, filter : false, width : "10%"},	// 1418:OFF 대체
			               {id: "Message", label : oBundleText.getText("LABEL_0477"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : ""},	// 477:메세지
			               
		];
		
		common.ZHR_TABLES.makeColumn(oController, oUploadTable, uploadModel);
		
		var oUploadDialog = new sap.m.Dialog(oController.PAGEID + "_UploadDialog", {
			content : [
				new sap.ui.core.HTML({
					content : "<div style='height : 11px;'/>"
				}),
				oUploadTable
			],
			contentWidth : "1000px",
			showHeader : true,
			title : oBundleText.getText("LABEL_1930"),	// 1930:엑셀 업로드
			beginButton : new sap.m.Button(oController.PAGEID +"_UploadButton",{
				text : oBundleText.getText("LABEL_2097"), 	// 2097:적용
				press : function(oEvent){
					oController.ExcelApply();
				}
			}),
			endButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0017"),  // 17:닫기
				press : function(oEvent){
					oUploadDialog.close();
				}
			})
		});
		
		oUploadDialog.bindElement("/Data");
		oUploadDialog.addStyleClass("sapUiSizeCompact");
		
		return oUploadDialog;
		
	}
	
});