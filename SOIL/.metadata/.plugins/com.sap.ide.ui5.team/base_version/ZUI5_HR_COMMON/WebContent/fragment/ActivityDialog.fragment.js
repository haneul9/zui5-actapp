jQuery.sap.require("common.SearchActivity");

sap.ui.jsfragment("fragment.ActivityDialog", {
	
	createContent : function(oController) {
		
		var oFilterBar = new sap.m.Toolbar({
			content : [ new sap.m.ToolbarSpacer({width: "10px"}),
			            new sap.m.Label({text : oBundleText.getText("LABEL_0514")}).addStyleClass("FontFamilyBold"),	// 514:검색어
			            new sap.m.ToolbarSpacer({width: "10px"}),
			            new sap.m.Input(oController.PAGEID + "_ActivityDialog_Ktext", {
							width: "150px"
						}).attachBrowserEvent("keyup", common.SearchActivity.onSearchKeyUp),
						new sap.m.ToolbarSpacer({width: "10px"}),
						new sap.m.Button({
							icon : "sap-icon://search",
							text : oBundleText.getText("LABEL_0002"),	// 2:검색
							type : sap.m.ButtonType.Emphasized,
							press : common.SearchActivity.onSearchActivity
						}),
						new sap.m.ToolbarSpacer({width: "10px"})
			        ]
		}).addStyleClass("ToolbarNoBottomLine");
		
		var oColumnList = new sap.m.ColumnListItem({
			cells : [
				new sap.m.Text({ text : "{Aufnr}" }).addStyleClass("FontFamily"),
				new sap.m.Text({ text : "{Ktext}" }).addStyleClass("FontFamily"),
			]
		});
		
		var oJSonModel = new sap.ui.model.json.JSONModel();
		oJSonModel.setSizeLimit(1000);
		var oTable = new sap.m.Table(oController.PAGEID + "_ActivityTable", {
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
		        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_0533")}).addStyleClass("FontFamilyBold"),	// 533:텍스트
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
		
		var oDialog = new sap.m.Dialog({
			content : [
				new sap.ui.core.HTML({
					content : "<div style='height : 10px;'/>"
				}),
				oFilterBar,
				new sap.ui.core.HTML({
					content : "<div style='height : 10px;'/>"
				}),
				oTable
			],
			contentWidth : "800px",
			showHeader : true,
			title : oBundleText.getText("LABEL_2749"),	// 2749:Activity 조회
			buttons :[ new sap.m.Button({
							text : oBundleText.getText("LABEL_0037"), 	// 37:선택
							press : common.SearchActivity.onSelectActivity
						}),
						new sap.m.Button({
							text : oBundleText.getText("LABEL_0017"), 	// 17:닫기
							press : function(oEvent){
								oDialog.close();
							}
						}),
			
			]
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
		
	}
	
});