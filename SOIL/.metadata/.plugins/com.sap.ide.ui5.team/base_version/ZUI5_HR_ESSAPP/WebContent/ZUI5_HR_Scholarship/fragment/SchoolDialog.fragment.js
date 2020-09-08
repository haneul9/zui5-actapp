sap.ui.jsfragment("ZUI5_HR_Scholarship.fragment.SchoolDialog", {

	createContent : function(oController) {	
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var oJSonModel = new sap.ui.model.json.JSONModel();
		
		var oColumnList = new sap.m.ColumnListItem({
			cells : [
				new sap.m.Text({ text : "{Schcd}" }).addStyleClass("FontFamily"),
				new sap.m.Text({ text : "{Schtx}" }).addStyleClass("FontFamily"),
			]
		});
		
		var oTable = new sap.m.Table(oController.PAGEID + "_SchoolTable", {
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
		
		var oFilterBar = new sap.m.Toolbar({
			content : [ 
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Label({text : oBundleText.getText("LABEL_1154")}).addStyleClass("FontFamilyBold"),	// 28:부서
				new sap.m.Input(oController.PAGEID +"_SearchSchool",{
					width: "200px",
					change : oController.onSearchSchool
				}),
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Button({
					icon : "sap-icon://search",
					text : oBundleText.getText("LABEL_0002"),	// 검색
					type : sap.m.ButtonType.Emphasized,
					press : oController.onSearchSchool
				}),
				new sap.m.ToolbarSpacer({width: "10px"})
			]
		}).addStyleClass("ToolbarNoBottomLine");
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [oFilterBar, oTable ]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_SchoolDialog", {
			contentWidth : "500px",
			contentHeight : "500px",
			showHeader : true,
			title : oBundleText.getText("LABEL_1154"),	// LABEL_1154=학교
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("LABEL_0037"),	// 37:선택
				press : oController.onConfirmSchool}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  oBundleText.getText("LABEL_0017"),	// 17:닫기
				press : oController.onCancelSchool
			}),
			content : [oLayout]
		}).setModel(oJSonModel);
		oDialog.bindElement("/Data");
		
		oDialog.addStyleClass("sapUiSizeCompact");
		return oDialog;
	}

});