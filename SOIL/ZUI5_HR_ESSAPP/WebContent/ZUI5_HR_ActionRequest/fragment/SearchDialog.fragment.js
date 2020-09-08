sap.ui.jsfragment("ZUI5_HR_ActionRequest.fragment.SearchDialog", {

	createContent : function(oController) {	
		jQuery.sap.require("ZUI5_HR_ActionRequest.control.ObjectSearch");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var oJSonModel = new sap.ui.model.json.JSONModel();
		
		var oFilterBar = new sap.m.Toolbar({
			content : [ new sap.m.ToolbarSpacer({width: "10px"}),
			            new sap.m.Label({text : oBundleText.getText("LABEL_0514")}).addStyleClass("FontFamilyBold"),	// 514:검색어
			            new sap.m.ToolbarSpacer({width: "10px"}),
			            new sap.m.Input(oController.PAGEID + "_SearchDialog_Text", {
							width: "150px",
							value : "{Keyword}",
							change : ZUI5_HR_ActionRequest.control.ObjectSearch.onKeyUp
						}),
						new sap.m.ToolbarSpacer({width: "10px"}),
						new sap.m.Button({
							icon : "sap-icon://search",
							text : oBundleText.getText("LABEL_0002"),	// 검색
							type : sap.m.ButtonType.Emphasized,
							press : ZUI5_HR_ActionRequest.control.ObjectSearch.onKeyUp
						}),
						new sap.m.ToolbarSpacer({width: "10px"})
			        ],
			 visible : "{FilterVisible}"
		}).addStyleClass("ToolbarNoBottomLine");
		
		var oColumnList = new sap.m.ColumnListItem({
			cells : [
				new sap.m.Text({ text : "{Code}" }).addStyleClass("FontFamily"),
				new sap.m.Text({ text : "{Text}" }).addStyleClass("FontFamily"),
			]
		});
		
		var oTable = new sap.m.Table(oController.PAGEID + "_SearchDialog_Table", {
			inset : false,
			mode : sap.m.ListMode.SingleSelectLeft,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "No data found",
			showNoData : true,
			columns : [
				new sap.m.Column({
		        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_0532")}).addStyleClass("FontFamilyBold"),	// 532:코드
		        	  demandPopin: true,
		        	  hAlign : sap.ui.core.TextAlign.Center,
		        	  styleClass : "cellBorderRight cellBorderLeft",
		        	  width : "30%",
		        	  minScreenWidth: "tablet"
		        }),
		        new sap.m.Column({
		        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_0533") , textAlign : "Center" }).addStyleClass("FontFamilyBold"),	// 533:텍스트
		        	  demandPopin: true,
		        	  hAlign : sap.ui.core.TextAlign.Begin,
		        	  styleClass : "cellBorderRight",
		        	  width : "70%",
		        	  minScreenWidth: "tablet"
		        }),
		    ]
		})
		.setModel(new sap.ui.model.json.JSONModel())
		.bindItems("/Data", oColumnList)
		.setKeyboardMode("Edit");
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [oFilterBar, oTable ]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_SearchDialog", {
			contentWidth : "900px",
			contentHeight : "500px",
			showHeader : true,
			title : "{Title}",
			beforeOpen : ZUI5_HR_ActionRequest.control.ObjectSearch.onBeforeOpenSearchDialog,
			afterOpen : ZUI5_HR_ActionRequest.control.ObjectSearch.onAfterOpenSearchDialog,
			afterClose : ZUI5_HR_ActionRequest.control.ObjectSearch.onAfterCloseSearchDialog,
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("LABEL_0037"),	// 37:선택
				press : ZUI5_HR_ActionRequest.control.ObjectSearch.onConfirmSearchDialog}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  oBundleText.getText("LABEL_0071"),	// 71:취소
				press : ZUI5_HR_ActionRequest.control.ObjectSearch.onCloseSearchDialog}),
			content : [oLayout]
		}).setModel(oJSonModel);
		oDialog.bindElement("/Data");
		
		oDialog.addStyleClass("sapUiSizeCompact");
		return oDialog;
	}

});