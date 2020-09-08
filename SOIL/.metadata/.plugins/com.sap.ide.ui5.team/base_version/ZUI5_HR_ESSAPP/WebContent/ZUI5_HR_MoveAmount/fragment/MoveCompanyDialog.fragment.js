sap.ui.jsfragment("ZUI5_HR_MoveAmount.fragment.MoveCompanyDialog", {
	
	createContent : function(oController) {
		
		var oFilterBar = new sap.m.Toolbar({
			content : [ 
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Label({text : oBundleText.getText("LABEL_0276")}).addStyleClass("FontFamilyBold"),	// 276:업체명
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Input(oController.PAGEID + "_Filter",{
					width : "400px",
					change : oController.onPressFilter,
				}).addStyleClass("Font14px FontColor3"),
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Button({
					icon : "sap-icon://search",
					text : oBundleText.getText("LABEL_0002"),	// 검색
					type : sap.m.ButtonType.Emphasized,
					press : oController.onPressFilter
				}),
				new sap.m.ToolbarSpacer({width: "10px"})
			]
		}).addStyleClass("ToolbarNoBottomLine");
		
		var oColumnList = new sap.m.ColumnListItem({
			counter : 10,
			cells : [
				new sap.m.Text({
					text : "{Name1}",
					textAlign : sap.ui.core.TextAlign.Begin,
				}).addStyleClass("Font14px FontColor3"),
				new sap.m.Text({
					text : "{Stcd2}",
					textAlign : sap.ui.core.TextAlign.Center,
				}).addStyleClass("Font14px FontColor3"),
				new sap.m.Text({
					text : "{J1kfrepre}",
					textAlign : sap.ui.core.TextAlign.Begin,
				}).addStyleClass("Font14px FontColor3"),
				new sap.m.Text({
					text : "{J1kftbus}",
					textAlign : sap.ui.core.TextAlign.Begin,
				}).addStyleClass("Font14px FontColor3"),
				new sap.m.Text({
					text : "{J1kftind}",
					textAlign : sap.ui.core.TextAlign.Begin,
				}).addStyleClass("Font14px FontColor3"),
			]
		});  
		
		var oTable = new sap.m.Table(oController.PAGEID + "_DialogTable",{
			mode : "SingleSelectLeft",
			growing : true ,
			growingThreshold : 20,
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			columns : [
				new sap.m.Column({
					header: new sap.m.Label({
						text : oBundleText.getText("LABEL_0276")
					}).addStyleClass("Font14px FontBold FontColor3"),	// 276:업체명
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Begin,
					styleClass : "cellBorderLeft cellBorderRight",
					width : "35%",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({
						text : oBundleText.getText("LABEL_0274")	// 274:사업자번호
					}).addStyleClass("Font14px FontBold FontColor3"),
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Center,
					styleClass : "cellBorderRight",
					width : "12%",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({
						text : oBundleText.getText("LABEL_0291")	// 291:대표자명
					}).addStyleClass("Font14px FontBold FontColor3"),
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Begin,
					styleClass : "cellBorderRight",
					width : "12%",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({
						text : oBundleText.getText("LABEL_0277")	// 277:업태
					}).addStyleClass("Font14px FontBold FontColor3"),
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Begin,
					styleClass : "cellBorderRight",
					width : "15%",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({
						text : oBundleText.getText("LABEL_0283")	// 283:종목
					}).addStyleClass("Font14px FontBold FontColor3"),
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Begin,
					styleClass : "cellBorderRight",
					width : "26%",
					minScreenWidth: "tablet"
				})
			]
		});
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindItems("/Data", oColumnList);
		
		var oDialog = new sap.m.Dialog({
			content :[
				oFilterBar, 
				new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}), 
				oTable
			],
			contentWidth : "900px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0279"),	// 279:이사업체
			beginButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0037"),	// 37:선택 
				press : oController.onSelectCompany
			}),
			endButton : new sap.m.Button({
				text : oBundleText.getText("LABEL_0071"),	// 71:취소 
				press : function(){
					oDialog.close();
				}
			}),
			beforeOpen : oController.beforeOpenDialog
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
 		
		return oDialog;
	}

});