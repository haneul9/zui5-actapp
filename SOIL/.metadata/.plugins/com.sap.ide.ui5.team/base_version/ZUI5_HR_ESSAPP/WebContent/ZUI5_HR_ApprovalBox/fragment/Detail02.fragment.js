sap.ui.jsfragment("ZUI5_HR_ApprovalBox.fragment.Detail02", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.SearchUser1");
		jQuery.sap.require("common.ZHR_TABLES");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
//			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.Multitoggle,
			showOverlay : false,
			enableBusyIndicator : true,
			visibleRowCount : 1,
			enableGrouping : false,
			enableColumnFreeze : false,
			cellClick : oController.onClickTable,
			fixedColumnCount : 6,
			extension : new sap.m.Toolbar({	//
								content : [
									 new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
								     new sap.m.ToolbarSpacer({width: "5px"}),
							         new sap.m.Text({ text : {
										path : "ZreqForx",
										formatter : function(fVal){
											if(common.Common.checkNull(fVal)) return "";
											else return fVal;
										}
									  }
									}).setModel(oController._ListCondJSonModel)
									.bindElement("/Data")
								.addStyleClass("MiddleTitle")]
						}).addStyleClass("ToolbarNoBottomLine"),
			rowActionCount : 1,
			rowActionTemplate : new sap.ui.table.RowAction({
				items : [
					new sap.ui.table.RowActionItem({
						type : "Navigation",
						customData : [new sap.ui.core.CustomData({key : "", value : "{Appno}"})],
						press : oController.onPressRowAction,
						visible : {
							path : "Idx",
							formatter : function(fVal){
								if(fVal && fVal != "") return true;
								else return false;
							}
						}
					})
				]
			})
		});
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");	
		
		var col_info1 = [{id: "Idx", label : "No", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "50px"},
						 {id: "ZappStxtAl", label : oBundleText.getText("LABEL_0036"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 36:상태
						 {id: "Zstep", label : oBundleText.getText("LABEL_1074"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "100px"},	// 1074:단계
						 {id: "ZappEname", label : oBundleText.getText("LABEL_1073"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 1073:결제 예정자
						 {id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번
						 {id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "90px"},	// 38:성명
						 {id: "Zzjiklnt", label : oBundleText.getText("LABEL_0067"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "130px"},	// 67:직위
						 {id: "Orgtx", label : oBundleText.getText("LABEL_0381"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "180px"},	// 381:조직
						 {id: "ZreqForx", label : oBundleText.getText("LABEL_0157"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "180px"},	// 157:신청유형
						 {id: "ZappTitl", label : oBundleText.getText("LABEL_0047"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "200px"},	// 47:신청내역
						 {id: "Apename", label : oBundleText.getText("LABEL_0050"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "90px"},	// 50:신청자
						 {id: "ZreqDate", label : oBundleText.getText("LABEL_0049"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 49:신청일
						 {id: "ZappDate", label : oBundleText.getText("LABEL_0107"), plabel : "", span : 0, type : "date", sort : true, filter : true, width : "100px"},	// 107:결재일
						 {id: "Appno", label : oBundleText.getText("LABEL_0607"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "120px"},	// 607:문서번호
						 ];
		
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		// Excel column info
		oController._Columns = common.Common.convertColumnArrayForExcel(col_info1);
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			width : "100%",
			widths : ["10px", ""]
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
	
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({content : oTable});
		oRow.addCell(oCell);
		
		oMatrix.addRow(oRow);
			
		return oMatrix;
	}
});
