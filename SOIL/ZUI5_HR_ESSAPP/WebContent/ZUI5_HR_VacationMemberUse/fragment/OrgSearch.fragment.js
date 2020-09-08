sap.ui.jsfragment("ZUI5_HR_VacationMemberUse.fragment.OrgSearch", {

	createContent : function(oController) {	
		
		jQuery.sap.require("ZUI5_HR_VacationMemberUse.control.OrgSearch");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		
		var oFilterBar = new sap.m.Toolbar({
			content : [ 
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Label({
					text : oBundleText.getText("LABEL_0516")	// 516:기준일자
				}).addStyleClass("L2PFontFamily"),
				new sap.m.DatePicker(oController.PAGEID + "_OrgSearch_Datum", {
					value: dateFormat.format(curDate), 
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					width : "120px",
					enabled : false
				}),
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Label({text : oBundleText.getText("LABEL_0514")}).addStyleClass("L2PFontFamily"),	// 514:검색어
				new sap.m.Input(oController.PAGEID + "_OrgSearch_Stext", {
					width: "150px"
				}).attachBrowserEvent("keyup", ZUI5_HR_VacationMemberUse.control.OrgSearch.onKeyUp),
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Button(oController.PAGEID + "_OrgSearch_SearchButton", {
					icon : "sap-icon://search",
					text : oBundleText.getText("LABEL_0002"),
					type : sap.m.ButtonType.Emphasized,
					customData : [{key : "Persa", value : oController._vPersa}],
					press : ZUI5_HR_VacationMemberUse.control.OrgSearch.OrgSearch
				}),
				new sap.m.ToolbarSpacer({width: "10px"})
			]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		var JSonModel =  new sap.ui.model.json.JSONModel();
		
		var oColumnList = new sap.m.ColumnListItem({
			cells : [
				new sap.m.Text({ text : "{Fulln}" }).addStyleClass("L2PFontFamily"),
				new sap.m.Text({ text : "{EnameM}" }).addStyleClass("L2PFontFamily"),
			]
		});
		
		var oTable = new sap.m.Table(oController.PAGEID + "_OrgSearch_TABLE", {
			inset : false,
			mode : sap.m.ListMode.SingleSelectLeft,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "No data found",
			showNoData : true,
			columns : [
				new sap.m.Column({
					header: new sap.m.Label({text : oBundleText.getText("LABEL_0039"), textAlign : sap.ui.core.TextAlign.Center}).addStyleClass("L2PFontFamily"),	// 39:소속부서
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Begin,
					styleClass : "cellBorderRight cellBorderLeft",
					width : "70%",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({text : oBundleText.getText("LABEL_0531") , textAlign : sap.ui.core.TextAlign.Center}).addStyleClass("L2PFontFamily"),	// 531:조직장
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Center,
					styleClass : "cellBorderRight",
					width : "30%",
					minScreenWidth: "tablet"
				}),
			]
		})
		.setModel(new sap.ui.model.json.JSONModel())
		.bindItems("/OrgListSet", oColumnList)
		.setKeyboardMode("Edit");
			
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [oFilterBar, oTable ]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_OrgSearch_Dialog", {
			contentWidth : "900px",
			contentHeight : "500px",
			showHeader : true,
			title : "{Title}",
			beforeOpen : ZUI5_HR_VacationMemberUse.control.OrgSearch.onBeforeOpenOrgSearchDialog,
			afterOpen : ZUI5_HR_VacationMemberUse.control.OrgSearch.onAfterOpenOrgSearchDialog,
			afterClose : ZUI5_HR_VacationMemberUse.control.OrgSearch.onAfterCloseOrgSearchDialog,
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("LABEL_0037"),	// 37:선택
				press : ZUI5_HR_VacationMemberUse.control.OrgSearch.onConfirm}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  oBundleText.getText("LABEL_0071"),	// 71:취소
				press : ZUI5_HR_VacationMemberUse.control.OrgSearch.onClose}),
			content : [oLayout]
		}).setModel(new sap.ui.model.json.JSONModel())	
		.bindElement("/Data");
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
	}

});