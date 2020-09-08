sap.ui.jsfragment("ZUI5_HR_OvertimeOrder.fragment.PernrDialog", {

	createContent : function(oController) {	
		var oJSonModel = new sap.ui.model.json.JSONModel();
		oJSonModel.setData({Data : {}});
		
		var oFilterBar = new sap.m.Toolbar({
			content : [ 
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Label({text : oBundleText.getText("LABEL_0028")}).addStyleClass("L2PFontFamily"),	// 28:부서
				new sap.m.Input(oController.PAGEID + "_Sorgeh", {
					width: "150px",
					showValueHelp: true,
					valueHelpOnly: true,
					value : "{Orgtx}",
					valueHelpRequest: oController.displayOrgSearchDialog,
					customData : new sap.ui.core.CustomData({key : "Type", value : "Orgeh"})
				}),
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Button({
					icon : "sap-icon://search",
					text : oBundleText.getText("LABEL_0002"),
					type : sap.m.ButtonType.Emphasized,
					press : oController.searchPernr
				}),
				new sap.m.ToolbarSpacer({width: "10px"})
			]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		var oColumnList = new sap.m.ColumnListItem({
			cells : [
				new sap.m.Text({ text : "{Orgtx}" }).addStyleClass("L2PFontFamily"),
				new sap.m.Text({ text : "{Perid}" }).addStyleClass("L2PFontFamily"),
				new sap.m.Text({ text : "{Ename}" }).addStyleClass("L2PFontFamily"),
				new sap.m.Text({ text : "{Atext}" }).addStyleClass("L2PFontFamily"),
				new sap.m.Text({ text : "{Docno}" }).addStyleClass("L2PFontFamily"),
				new sap.m.Text({ text : "{ZappTitl}" }).addStyleClass("L2PFontFamily")
			]
		});
		
		var oTable = new sap.m.Table(oController.PAGEID + "_Pernr_Table", {
			inset : false,
			mode : sap.m.ListMode.SingleSelectLeft,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "No data found",
			showNoData : true,
			columns : [
				new sap.m.Column({
					header: new sap.m.Label({text : oBundleText.getText("LABEL_0028")}).addStyleClass("L2PFontFamily"),	// 28:부서
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Begin,
					styleClass : "cellBorderRight cellBorderLeft",
					width : "28%",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({text : oBundleText.getText("LABEL_0031") , textAlign : "Center" }).addStyleClass("L2PFontFamily"),	// 31:사번
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Center,
					styleClass : "cellBorderRight",
					width : "12%",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({text : oBundleText.getText("LABEL_0038") , textAlign : "Center" }).addStyleClass("L2PFontFamily"),	// 38:성명
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Center,
					styleClass : "cellBorderRight",
					width : "12%",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({text : oBundleText.getText("LABEL_0625")}).addStyleClass("L2PFontFamily"),	// 625:근태항목
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Begin,
					styleClass : "cellBorderRight",
					width : "16%",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({text : oBundleText.getText("LABEL_0607")}).addStyleClass("L2PFontFamily"),	// 607:문서번호
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Begin,
					styleClass : "cellBorderRight",
					width : "16%",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({text : oBundleText.getText("LABEL_0632")}).addStyleClass("L2PFontFamily"),	// 632:신청서제목
					demandPopin: true,
					hAlign : sap.ui.core.TextAlign.Begin,
					styleClass : "cellBorderRight",
					width : "16%",
					minScreenWidth: "tablet"
				})
			]
		})
		.setModel(new sap.ui.model.json.JSONModel())
		.bindItems("/Data", oColumnList)
		.setKeyboardMode("Edit");
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [oFilterBar, oTable ]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_PernrDialog", {
			contentWidth : "1100px",
//			contentHeight : "500px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0627"),	// 627:대근사유 대상자 선택
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("LABEL_0037"),	// 37:선택
				press : oController.onConfirmPernrDialog
			}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  oBundleText.getText("LABEL_0071"),	// 71:취소
				press : oController.onClosePernrDialog
			}),
			content : [oLayout]
		}).setModel(oJSonModel);
		oDialog.bindElement("/Data");
		
		oDialog.addStyleClass("sapUiSizeCompact");
		return oDialog;
	}

});