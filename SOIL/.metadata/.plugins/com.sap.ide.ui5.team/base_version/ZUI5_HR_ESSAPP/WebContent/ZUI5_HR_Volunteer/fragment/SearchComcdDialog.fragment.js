sap.ui.jsfragment("ZUI5_HR_Volunteer.fragment.SearchComcdDialog", {

	createContent : function(oController) {	
		var oFilterBar = new sap.m.Toolbar({
			content : [ new sap.m.ToolbarSpacer({width: "10px"}),
			          new sap.m.Label({text : oBundleText.getText("LABEL_0514")}).addStyleClass("FontFamilyBold"),	// 514:검색어
						new sap.m.Input(oController.PAGEID + "_SearchComcdDialog_Text", {
							width: "150px",
							value : "{Keyword}",
							change : oController.onSearchComcdDialog
						}),
						new sap.m.ToolbarSpacer({width: "10px"}),
						new sap.m.Button({
							icon : "sap-icon://search",
							text : oBundleText.getText("LABEL_0002"),
							type : sap.m.ButtonType.Emphasized,
							press : oController.onSearchComcdDialog
						}),
						new sap.m.ToolbarSpacer({width: "10px"})
			        ]
		}).addStyleClass("ToolbarNoBottomLine");
		
		var oColumnList = new sap.m.ColumnListItem({
			cells : [
				new sap.m.Text({ text : "{Key}" }).addStyleClass("FontFamily"),
				new sap.m.Text({ text : "{Value}" }).addStyleClass("FontFamily"),
			]
		});
		
		var oTable = new sap.m.Table(oController.PAGEID + "_SearchComcdDialog_Table", {
			inset : false,
			mode : sap.m.ListMode.SingleSelectLeft,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "No data found",
			showNoData : true,
			columns : [
				new sap.m.Column({
		        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1775")}).addStyleClass("FontFamilyBold"),	// 1775:봉사단 코드
		        	  demandPopin: true,
		        	  hAlign : sap.ui.core.TextAlign.Center,
		        	  styleClass : "cellBorderRight cellBorderLeft",
		        	  width : "30%",
		        	  minScreenWidth: "tablet"
		        }),
		        new sap.m.Column({
		        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1776") , textAlign : "Center" }).addStyleClass("FontFamilyBold"),	// 1776:봉사단명
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
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_SearchComcdDialog", {
			contentWidth : "600px",
			contentHeight : "500px",
			showHeader : true,
			title : oBundleText.getText("LABEL_2343"),	// 2343:활동봉사단 검색
			beforeOpen : oController.onBeforeOpenSearchComcdDialog,
			beginButton :  new sap.m.Button({
				text : oBundleText.getText("LABEL_0037"),	// 37:선택
				press : oController.onConfirmSearchComcdDialog
			}),
			endButton : new sap.m.Button({
				text :  oBundleText.getText("LABEL_0071"),	// 71:취소
				press : oController.onCloseSearchComcdDialog
			}),
			content : [oLayout]
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		return oDialog;
	}

});