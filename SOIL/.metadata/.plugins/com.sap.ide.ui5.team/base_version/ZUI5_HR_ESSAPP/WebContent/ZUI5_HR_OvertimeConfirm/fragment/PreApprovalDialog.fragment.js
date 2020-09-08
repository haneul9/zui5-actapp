sap.ui.jsfragment("ZUI5_HR_OvertimeConfirm.fragment.PreApprovalDialog", {
	
	_colModel : [
		{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : false, filter : false, width : "4%"},
		{id: "Perid", label : oBundleText.getText("LABEL_0031"), plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "6%"},	// 31:사번
		{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "8%"},	// 38:성명
		{id: "Rtext", label : oBundleText.getText("LABEL_0624"), plabel : oBundleText.getText("LABEL_0624"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "14%", align : sap.ui.core.TextAlign.Begin},	// 624:근무조
		{id: "Twrkjobt", label : oBundleText.getText("LABEL_0010"), plabel : oBundleText.getText("LABEL_0010"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "12%", align : sap.ui.core.TextAlign.Begin},	// 근무직
		{id: "Wtm01", label : "ThisWeek", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 5, type : "string", sort : false, filter : false, width : "5%"},	// 634:정상근무
		{id: "Wtm02", label : "", plabel : oBundleText.getText("LABEL_2892"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 2892:시간외근무
		{id: "Wtme1", label : "", plabel : oBundleText.getText("LABEL_0902"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 902:교육예정
		{id: "Wtm03", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 637:총근로
		{id: "Stat1", label : "", plabel : oBundleText.getText("LABEL_0036"), resize : false, span : 0, type : "StatusIcon", sort : false, filter : false, width : "5%"},	// 36:상태
		{id: "Wtm04", label : "NextWeek", plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 5, type : "string", sort : false, filter : false, width : "5%"},	// 634:정상근무
		{id: "Wtm05", label : "", plabel : oBundleText.getText("LABEL_2892"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 2892:시간외근무
		{id: "Wtme2", label : "", plabel : oBundleText.getText("LABEL_0902"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 902:교육예정
		{id: "Wtm06", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 637:총근로
		{id: "Stat2", label : "", plabel : oBundleText.getText("LABEL_0036"), resize : false, span : 0, type : "StatusIcon", sort : false, filter : false, width : "5%"},	// 36:상태
		{id: "Wtm07", label : oBundleText.getText("LABEL_0618"), plabel : oBundleText.getText("LABEL_0618"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "6%"}	// 618:3개월특근가능 잔여시간
	],

	createContent : function(oController) {	
		var oJSonModel = new sap.ui.model.json.JSONModel();
		oJSonModel.setData({Data : {}});
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_PreApproval_Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
//			fixedColumnCount : 3
		})
		.setModel(new sap.ui.model.json.JSONModel())
		.bindRows("/Data");
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_OvertimeConfirmDetail_PreApproval_Table-header > tbody',
					colIndexes : [0, 1, 2, 3, 4, 15]
				});
			}
		});
		
		var vDatum = oController._DetailTableJSonModel.getProperty("/Data/0/Datum"),
			curr = moment(vDatum.replace(/[^\d]/g, ''));
		
		if(curr) {
			this._colModel[5].label = curr.startOf('week').format('MM/DD') + " ~ " + curr.endOf('week').format('MM/DD');
			
			curr.add(7, 'days');
			this._colModel[10].label = curr.startOf('week').format('MM/DD') + " ~ " + curr.endOf('week').format('MM/DD');
		}
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [oTable ]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_PreApprovalDialog", {
			contentWidth : "1200px",
//			contentHeight : "520px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0623"),	// 623:근로시간 요약
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("LABEL_0621"),	// 621:결재요청
				press : oController.onConfirmApprovalDialog
			}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  oBundleText.getText("LABEL_0622"),	// 622:결재요청취소
				press : oController.onCloseApprovalDialog
			}),
			content : [oLayout]
		}).setModel(oJSonModel);
		oDialog.bindElement("/Data");
		
		oDialog.addStyleClass("sapUiSizeCompact");
		return oDialog;
	}

});