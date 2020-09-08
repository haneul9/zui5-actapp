sap.ui.jsfragment("ZUI5_HR_Medical.fragment.DisecdDialog", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.ZHR_TABLES");
		var oRow ;
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			widths : ['15%','85%']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({
//			height : "40px",
			cells : [
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Label({
						text : oBundleText.getText("LABEL_1092"),	// 1092:병명
					}).addStyleClass("FontFamilyBold"),
					hAlign : "Center"
				}),
				new sap.ui.commons.layout.MatrixLayoutCell({
					content : new sap.m.Toolbar({
						content : [ new sap.m.Input(oController.PAGEID + "_DisenmDialog",{
									value : "{Disenm}",
										change : oController.onSearchDisecd
									}).addStyleClass("FontFamily"),
									new sap.m.ToolbarSpacer({width: "10px"}),
									new sap.m.Button({
										text : oBundleText.getText("LABEL_0064"),	// 64:조회
										press : oController.onSearchDisecd,
										icon : "sap-icon://search",
										type : sap.m.ButtonType.Emphasized,
									}).addStyleClass("FontFamily"),
									new sap.m.ToolbarSpacer({width: "15px"})
					]}).addStyleClass("ToolbarNoBottomLine"),
				}),
			]
		});
		oMatrix.addRow(oRow);
	
		
		var oColumnList = new sap.m.ColumnListItem({
			counter : 10,
			cells : [
				new sap.m.Text({
				     text : "{Idx}" 
				}).addStyleClass("FontFamily"),
				new sap.m.Text({
					text : "{Disecd}" , 
				}).addStyleClass("FontFamily"),
			    new sap.m.Text({
					text : "{Disenm}" , 
				}).addStyleClass("FontFamily"),
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_DisecdTable", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "No data found",
			showNoData : true,
			mode : "SingleSelectLeft",
			columns : [
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : "No."}).addStyleClass("FontFamily"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight cellBorderLeft",
			        	  width : "30px",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_0532")}).addStyleClass("FontFamilyBold"),	// 532:코드
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Center,
			        	  styleClass : "cellBorderRight",
			        	  width : "20%",
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_1092")}).addStyleClass("FontFamilyBold"),	// 1092:병명
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  styleClass : "cellBorderRight",
//			        	  width : "80%",
			        	  minScreenWidth: "tablet"}), 
			          ]
		});
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindItems("/Data", oColumnList); 
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_DisecdDialog", {
			content : [
				oMatrix,
				new sap.ui.core.HTML({
					content : "<div style='height : 11px;'/>"
				}),
				oTable
			],
			contentWidth : "600px",
			showHeader : true,
			title : oBundleText.getText("LABEL_1093"),	// 1093:병명 조회
			beginButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0037"), 	// 37:선택
				press : oController.onSelectDisecd
			}),
			endButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0071"), 	// 71:취소
				press : function(oEvent){
					oDialog.close();
				}
			})
		});
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
		
	}
	
});