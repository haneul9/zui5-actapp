sap.ui.jsfragment("ZUI5_HR_MedicalHA.fragment.PyamtcDialog", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_PyamtcTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
//			rowHeight : 48,
//			visibleRowCount : 4,
//			fixedColumnCount : 4,
			showNoData : true,
//			selectionMode : sap.ui.table.SelectionMode.MultiToggle,
			selectionMode : sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
		});
		oTable.setModel(oController._DialogTableJsonModel);
		oTable.bindRows("/Data");	
		var oHeaders = ["No.", "지급년월", "진료기간", "상세건수", "납부금액", "지원금액", "신청일", "최종결재일"];
		var oTypes = ["string","string","string","string","money","money","date","date"];
		var oFields = ["Idx","Payym","Mdprd","Apcnt","Apamt","Pyamt","Appda","Sgnda"];
//		var oSizes = ["50px","50px", "120px", "100px", "100px","","100px","200px","100px","100px","120px","120px","120px"];
		var oAligns = ["Center","Center","Center","Center","End","End","Center","Center"];
		var oSizes = ["50px","", "20%", "", "","","", ""];
		common.ZNK_TABLES.autoColumn(oController,oTable,oHeaders,oTypes,oFields,1,oSizes,oAligns);
		
		
		var oCell, oRow;						
		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			widths : ["20px","","20px"],
			width : "100%"
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"})
		});
		oRow.addCell(oCell);
		oContentMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oTable
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oContentMatrix.addRow(oRow);

		var oCloseButton = new sap.m.Button({
			text : "닫기",
			press : function(oEvent){
				oDialog.close();
			}
		});
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_PyamtcDialog",{
			content :[oContentMatrix] ,
			contentWidth : "1000px",
//			contentHeight : "272px",
			showHeader : true,
			title : "지원금 누계 상세내역",
//			beginButton : new sap.m.Button({text : "저장", press : oController.onSaveDialog}), //
			endButton : oCloseButton,
			afterOpen : oController.afterOpenPyamtcDialog
		})
		
//		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };
		

		return oDialog;
	}

});
