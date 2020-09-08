sap.ui.jsfragment("ZUI5_HR_Volunteer.fragment.SearchWelcdDialog", {

	createContent : function(oController) {	
		var oFilterBar = new sap.m.Toolbar({
			content : [ new sap.m.Label({text : oBundleText.getText("LABEL_0514")}).addStyleClass("FontFamilyBold"),	// 514:검색어
			            new sap.m.ToolbarSpacer({width: "10px"}),
			            new sap.m.Input(oController.PAGEID + "_SearchWelcdDialog_Text", {
							width: "150px",
							value : "{Keyword}",
							change : oController.onKeyUp
						}),
						new sap.m.ToolbarSpacer({width: "10px"}),
						new sap.m.Button({
							icon : "sap-icon://search",
							text : oBundleText.getText("LABEL_0002"),
							type : sap.m.ButtonType.Emphasized,
							press : oController.onKeyUp
						}),
						new sap.m.ToolbarSpacer({width: "10px"})
			        ]
		}).addStyleClass("ToolbarNoBottomLine");
		
		var oColumnList = new sap.m.ColumnListItem({
			cells : [
				new sap.m.Text({ text : "{Welcd}" }).addStyleClass("FontFamily"),
				new sap.m.Text({ text : "{Welcdt}" }).addStyleClass("FontFamily"),
				new sap.m.Text({ text : "{Admin}" }).addStyleClass("FontFamily"),
				new sap.m.Text({ text : "{Offno}" }).addStyleClass("FontFamily"),
			]
		});
		
		var oTable = new sap.m.Table(oController.PAGEID + "_SearchWelcdDialog_Table", {
			inset : false,
			mode : sap.m.ListMode.SingleSelectLeft,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "No data found",
			showNoData : true,
			columns : [
				new sap.m.Column({
		        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1603")}).addStyleClass("FontFamilyBold"),	// 1603:기관코드
		        	  demandPopin: true,
		        	  hAlign : sap.ui.core.TextAlign.Center,
		        	  styleClass : "cellBorderRight cellBorderLeft",
		        	  width : "15%",
		        	  minScreenWidth: "tablet"
		        }),
		        new sap.m.Column({
		        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1602") , textAlign : "Center" }).addStyleClass("FontFamilyBold"),	// 1602:기관명
		        	  demandPopin: true,
		        	  hAlign : sap.ui.core.TextAlign.Center,
		        	  styleClass : "cellBorderRight",
		        	  width : "35%",
		        	  minScreenWidth: "tablet"
		        }),
		        new sap.m.Column({
		        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1642") , textAlign : "Center" }).addStyleClass("FontFamilyBold"),	// 1642:담당자
		        	  demandPopin: true,
		        	  hAlign : sap.ui.core.TextAlign.Center,
		        	  styleClass : "cellBorderRight",
		        	  width : "15%",
		        	  minScreenWidth: "tablet"
		        }),
		        new sap.m.Column({
		        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1943") , textAlign : "Center" }).addStyleClass("FontFamilyBold"),	// 1943:연락처
		        	  demandPopin: true,
		        	  hAlign : sap.ui.core.TextAlign.Center,
		        	  styleClass : "cellBorderRight",
		        	  width : "35%",
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
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_SearchWelcdDialog", {
			contentWidth : "900px",
			contentHeight : "500px",
			showHeader : true,
			title : oBundleText.getText("LABEL_2136"),	// 2136:주관기관 검색
			beforeOpen : oController.onBeforeOpenSearchWelcdDialog,
			beginButton :  new sap.m.Button({
				text : oBundleText.getText("LABEL_0037"),	// 37:선택
				press : oController.onConfirmSearchWelcdDialog
			}),
			endButton : new sap.m.Button({
				text :  oBundleText.getText("LABEL_0071"),	// 71:취소
				press : oController.onCloseSearchWelcdDialog
			}),
			content : [oLayout]
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		return oDialog;
	}

});