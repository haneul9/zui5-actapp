sap.ui.jsfragment("ZUI5_HR_Scholarship.fragment.AffilDialog", {

	createContent : function(oController) {	
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var oJSonModel = new sap.ui.model.json.JSONModel();
		
		var oColumnList = new sap.m.ColumnListItem({
			cells : [
				new sap.m.Text({ text : "{Affil}" }).addStyleClass("L2PFontFamily"),
				new sap.m.Text({ text : "{Affiltx}" }).addStyleClass("L2PFontFamily"),
			]
		});
		
		var oTable = new sap.m.Table(oController.PAGEID + "_AffilTable", {
			inset : false,
			mode : sap.m.ListMode.SingleSelectLeft,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "No data found",
			showNoData : true,
			columns : [
				new sap.m.Column({
		        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_0532")}).addStyleClass("L2PFontFamily"),	// 532:코드
		        	  demandPopin: true,
		        	  hAlign : sap.ui.core.TextAlign.Center,
		        	  styleClass : "cellBorderRight cellBorderLeft",
		        	  width : "30%",
		        	  minScreenWidth: "tablet"
		        }),
		        new sap.m.Column({
		        	  header: new sap.m.Label({text : oBundleText.getText("LABEL_0533") , textAlign : "Center" }).addStyleClass("L2PFontFamily"),	// 533:텍스트
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
			content : [oTable ]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_AffilSearchDialog", {
			contentWidth : "500px",
			contentHeight : "500px",
			showHeader : true,
			title : oBundleText.getText("LABEL_1136"),	// 1136:계열 검색
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("LABEL_0037"),	// 37:선택
				press : oController.onConfirmAffil}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  oBundleText.getText("LABEL_0071"),	// 71:취소
				press : function(){
					oDialog.close();
				}}),
			content : [oLayout]
		}).setModel(oJSonModel);
		oDialog.bindElement("/Data");
		
		oDialog.addStyleClass("sapUiSizeCompact");
		return oDialog;
	}

});