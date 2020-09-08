sap.ui.jsfragment("ZUI5_HR_OvertimeConfirm.fragment.OvertimeDialog", {

	createContent : function(oController) {	
		var oJSonModel = new sap.ui.model.json.JSONModel();
		oJSonModel.setData({Data : {}});
		
		var oFilterBar = new sap.m.Toolbar({
			content : [ 
				new sap.m.Label({text : oBundleText.getText("LABEL_0639")}).addStyleClass("L2PFontFamily"),	// 639:특근 시작일
				new sap.m.DatePicker(oController.PAGEID + "_Apbegda", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					value : "{Apbeg}",
					width : "150px",
					change : oController.onChangeDate
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Label({text : oBundleText.getText("LABEL_0640")}).addStyleClass("L2PFontFamily"),	// 640:특근 종료일
				new sap.m.DatePicker(oController.PAGEID + "_Apendda", {
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					width : "150px",
					value : "{Apend}",
					change : oController.onChangeDate
				}).addStyleClass("L2PFontFamily"),
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Label({text : oBundleText.getText("LABEL_0028")}).addStyleClass("L2PFontFamily"),	// 28:부서
				new sap.m.Input(oController.PAGEID + "_Orgtx2", {
					width : "150px",
					value : "{Orgtx}",
					editable : false
				}).addStyleClass("L2PFontFamily"),
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Label({text : oBundleText.getText("LABEL_0111")}).addStyleClass("L2PFontFamily"),	// 111:대상자
				new sap.m.Input(oController.PAGEID + "_Ename2", {
					width : "150px",
//					showValueHelp: true,
//					valueHelpOnly: false,
					value : "{Ename}",
					editable : false
//					customData : new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"}),
//					change : oController.EmpSearchByTx,
//					valueHelpRequest: oController.displayEmpSearchDialog
				}).addStyleClass("L2PFontFamily"),
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Button({
					icon : "sap-icon://search",
					text : oBundleText.getText("LABEL_0002"),
					type : sap.m.ButtonType.Emphasized,
					press : oController.searchOvertime
				}),
				new sap.m.ToolbarSpacer({width: "10px"})
			]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		var colModel = [
			{id: "Idx", label : "No.", plabel : "No.", resize : false, span : 0, type : "string", sort : true, filter : true, width : "50px"},
			{id: "Datum", label : oBundleText.getText("LABEL_0644"), plabel : oBundleText.getText("LABEL_0644"), resize : false, span : 0, type : "date", sort : true, filter : true, width : "140px"},	// 644:특근일
			{id: "Atext", label : oBundleText.getText("LABEL_0587"), plabel : oBundleText.getText("LABEL_0587"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "140px"},	// 587:특근유형
			{id: "Beguzt", label : oBundleText.getText("LABEL_0717"), plabel : oBundleText.getText("LABEL_0712"), resize : false, span : 7, type : "time", sort : true, filter : true, width : "100px"},	// 712:시작, 717:특근명령
			{id: "Enduzt", label : "", plabel : oBundleText.getText("LABEL_0713"), resize : false, span : 0, type : "time", sort : true, filter : true, width : "100px"},	// 713:종료
			{id: "Tim11", label : "", plabel : oBundleText.getText("LABEL_0671"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 671:근무시간
			{id: "Faprstx", label : "", plabel : oBundleText.getText("LABEL_0645"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 645:휴게시간
			{id: "Tim12", label : "", plabel : oBundleText.getText("LABEL_0586"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 586:특근시간
			{id: "Tim13", label : "", plabel : oBundleText.getText("LABEL_0643"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 643:특근연장
			{id: "Tim14", label : "", plabel : oBundleText.getText("LABEL_0633"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 633:심야시간
			{id: "Wtm01", label : oBundleText.getText("LABEL_0636"), plabel : oBundleText.getText("LABEL_0634"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "100px"},	// 634:정상근무, 636:주당 총근로 예상시간
			{id: "Wtm02", label : "", plabel : oBundleText.getText("LABEL_0629"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 629:시간외근무
			{id: "Wtm03", label : "", plabel : oBundleText.getText("LABEL_0637"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"},	// 637:총근로
			{id: "Tmrsn", label : oBundleText.getText("LABEL_0641"), plabel : oBundleText.getText("LABEL_0641"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "140px"},	// 641:특근내역
			{id: "Tprogt", label : oBundleText.getText("LABEL_0013"), plabel : oBundleText.getText("LABEL_0013"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 근무형태
			{id: "Rtext", label : oBundleText.getText("LABEL_0010"), plabel : oBundleText.getText("LABEL_0010"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "180px", align : sap.ui.core.TextAlign.Begin},	// 근무직
			{id: "Satext", label : oBundleText.getText("LABEL_0626"), plabel : oBundleText.getText("LABEL_0625"), resize : false, span : 3, type : "string", sort : true, filter : true, width : "140px"},	// 625:근태항목, 626:대근사유
			{id: "Sperid", label : "", plabel : oBundleText.getText("LABEL_0031"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "80px"},	// 31:사번
			{id: "Sename", label : "", plabel : oBundleText.getText("LABEL_0038"), resize : false, span : 0, type : "string", sort : true, filter : true, width : "100px"}	// 38:성명
		];
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_OvertimeTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			fixedColumnCount : 3,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
		})
		.setModel(new sap.ui.model.json.JSONModel())
		.bindRows("/Data");
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTable = sap.ui.getCore().byId("ZUI5_HR_OvertimeConfirmDetail_OvertimeTable");
				
				oTable.getColumns().forEach(function(elem) {
					elem.setSorted(false);
					elem.setFiltered(false);
				});
				
				oTable.clearSelection();
				oTable.bindRows("/Data");
			}
		});
		
		oTable.addEventDelegate({
			onAfterRendering: function() {
				var oTds = $("td[colspan]");
				for(i=0; i<oTds.length; i++) {
					if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				}
				
				common.Common.generateRowspan({
					selector : '#ZUI5_HR_OvertimeConfirmDetail_OvertimeTable-header-fixed-fixrow > tbody',
					colIndexes : [0, 1, 2]
				});

				common.Common.generateRowspan({
					selector : '#ZUI5_HR_OvertimeConfirmDetail_OvertimeTable-header > tbody',
					colIndexes : [10, 11, 12]
				});
			}
		});
		
		common.ZHR_TABLES.makeColumn(oController, oTable, colModel);
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [
				oFilterBar, 
				oTable 
			]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_OvertimeDialog", {
			contentWidth : "1100px",
//			contentHeight : "500px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0718"),	// 718:특근명령내역
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("LABEL_0037"),	// 37:선택
				press : oController.onConfirmOvertimeDialog
			}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  oBundleText.getText("LABEL_0071"),	// 71:취소
				press : oController.onCloseOvertimeDialog
			}),
			content : [oLayout]
		}).setModel(oJSonModel);
		oDialog.bindElement("/Data");
		
		oDialog.addStyleClass("sapUiSizeCompact");
		return oDialog;
	}

});