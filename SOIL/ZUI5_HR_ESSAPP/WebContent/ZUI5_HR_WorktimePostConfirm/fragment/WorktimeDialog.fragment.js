sap.ui.jsfragment("ZUI5_HR_WorktimePostConfirm.fragment.WorktimeDialog", {
	
	_colModel : [
		{id: "Seqno", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : false, filter : false, width : "6%"},
		{id: "Datum", label : oBundleText.getText("LABEL_0882"), plabel : oBundleText.getText("LABEL_0057"), resize : false, span : 4, type : "date", sort : false, filter : false, width : "13%"},	// 57:일자, 882:연장근무시간
		{id: "Beguztx", label : "", plabel : oBundleText.getText("LABEL_0631"), resize : false, span : 0, type : "time", sort : false, filter : false, width : "13%"},	// 631:시작시간
		{id: "Enduztx", label : "", plabel : oBundleText.getText("LABEL_0635"), resize : false, span : 0, type : "time", sort : false, filter : false, width : "13%"},	// 635:종료시간
		{id: "Duran", label : "", plabel : oBundleText.getText("LABEL_0880"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "13%"},	// 880:기간(분)
		{id: "ZappTitl", label : oBundleText.getText("LABEL_0761"), plabel : oBundleText.getText("LABEL_0761"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "24%", align : sap.ui.core.TextAlign.Begin},	// 761:제목
		{id: "Appno", label : oBundleText.getText("LABEL_0757"), plabel : oBundleText.getText("LABEL_0757"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "16%"}	// 757:신청서ID
	],

	createContent : function(oController) {	
		var oJSonModel = new sap.ui.model.json.JSONModel();
		oJSonModel.setData({Data : {}});
		
		var oFilterBar = new sap.m.Toolbar({
			content : [ 
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Label({text : oBundleText.getText("LABEL_0883")}).addStyleClass("L2PFontFamily"),	// 883:연장근무일자
				new sap.m.DatePicker({
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					value : "{Begda}",
					width : "150px"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text : "~",
					textAlign : sap.ui.core.TextAlign.Center
				}),
				new sap.m.DatePicker({
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					value : "{Endda}",
					width : "150px"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Button({
					icon : "sap-icon://search",
					text : oBundleText.getText("LABEL_0002"),
					type : sap.m.ButtonType.Emphasized,
					press : oController.searchWorktime
				}),
				new sap.m.ToolbarSpacer({width: "10px"})
			]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Worktime_Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
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
					selector : '#ZUI5_HR_WorktimePostConfirmDetail_Worktime_Table-header > tbody',
					colIndexes : [0, 5, 6]
				});
			}
		});
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [oFilterBar, oTable ]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_WorktimeDialog", {
			contentWidth : "1100px",
			contentHeight : "520px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0881"),	// 881:신청서 내역 조회
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("LABEL_0037"),	// 37:선택
				press : oController.onConfirmWorktimeDialog
			}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  oBundleText.getText("LABEL_0071"),	// 71:취소
				press : oController.onCloseWorktimeDialog
			}),
			content : [oLayout]
		}).setModel(oJSonModel);
		oDialog.bindElement("/Data");
		
		oDialog.addStyleClass("sapUiSizeCompact");
		return oDialog;
	}

});