sap.ui.jsfragment("ZUI5_HR_Transition.fragment.OrgSearch", {

	createContent : function(oController) {	
		
		jQuery.sap.require("ZUI5_HR_Transition.control.OrgSearch");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		
		var oFilterBar = new sap.m.Toolbar({
			content : [ 
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Label({
					text : oBundleText.getText("LABEL_0516")	// 516:기준일자
				}).addStyleClass("Font14px FontBold FontColor3"),
				new sap.m.DatePicker(oController.PAGEID + "_OrgSearch_Datum", {
					value: dateFormat.format(curDate), 
					valueFormat : "yyyy-MM-dd",
					displayFormat : "yyyy.MM.dd",
					width : "120px",
					enabled : false
				}).addStyleClass("Font14px FontColor3"),
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Label({text : oBundleText.getText("LABEL_0514")}).addStyleClass("Font14px FontBold FontColor3"),	// 514:검색어
				new sap.m.Input(oController.PAGEID + "_OrgSearch_Stext", {
					width: "150px"
				})
				.addStyleClass("Font14px FontColor3")
				.attachBrowserEvent("keyup", ZUI5_HR_Transition.control.OrgSearch.onKeyUp),
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Button(oController.PAGEID + "_OrgSearch_SearchButton", {
					text : oBundleText.getText("LABEL_0002"),
					customData : [{key : "Persa", value : oController._vPersa}],
					press : ZUI5_HR_Transition.control.OrgSearch.OrgSearch
				}),
				new sap.m.ToolbarSpacer({width: "10px"})
			]
		}).addStyleClass("ToolbarNoBottomLine");
		
		var JSonModel =  new sap.ui.model.json.JSONModel();
		
		var oColumnList = new sap.m.ColumnListItem({
			cells : [
				new sap.m.Text({ text : "{Fulln}" }).addStyleClass("FontFamily"),
				new sap.m.Text({ text : "{EnameM}" }).addStyleClass("FontFamily"),
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
					header: new sap.m.Label({text : oBundleText.getText("LABEL_0039"), textAlign : "Center"}).addStyleClass("FontFamilyBold"),	// 39:소속부서
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Begin,
					styleClass : "cellBorderRight cellBorderLeft",
					width : "70%",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({text : oBundleText.getText("LABEL_0531") , textAlign : "Center" }).addStyleClass("FontFamilyBold"),	// 531:조직장
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
			beforeOpen : ZUI5_HR_Transition.control.OrgSearch.onBeforeOpenOrgSearchDialog,
			afterOpen : ZUI5_HR_Transition.control.OrgSearch.onAfterOpenOrgSearchDialog,
			afterClose : ZUI5_HR_Transition.control.OrgSearch.onAfterCloseOrgSearchDialog,
			beginButton :  new sap.m.Button({
				text : oBundleText.getText("LABEL_0037"),	// 37:선택
				press : ZUI5_HR_Transition.control.OrgSearch.onConfirm}),
			endButton : new sap.m.Button({
				text :  oBundleText.getText("LABEL_0071"),	// 71:취소
				press : ZUI5_HR_Transition.control.OrgSearch.onClose}),
			content : [oLayout]
		}).setModel(new sap.ui.model.json.JSONModel())	
		.bindElement("/Data");
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
	}

});