sap.ui.jsfragment("ZUI5_HR_ActionRequest.fragment.SearchDialog", {

	createContent : function(oController) {	
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		var oJSonModel = new sap.ui.model.json.JSONModel();
		
		var oFilterBar = new sap.m.Toolbar({
			content : [ new sap.m.ToolbarSpacer({width: "10px"}),
			          new sap.m.Label({text : oBundleText.getText("LABEL_0514")}).addStyleClass("L2PFontFamily"),	// 514:검색어
						new sap.m.Input(oController.PAGEID + "_SearchDialog_Text", {
							width: "150px",
							value : "{Keyword}",
							change : oController.onKeyUp
						}),
						new sap.m.ToolbarSpacer({width: "10px"}),
						new sap.m.Button({
							icon : "sap-icon://search",
							text : oBundleText.getText("LABEL_0002"),	// 검색
							type : sap.m.ButtonType.Emphasized,
							press : oController.onKeyUp
						}),
						new sap.m.ToolbarSpacer({width: "10px"})
			        ]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
//		var oTable = new sap.ui.table.Table(oController.PAGEID + "_SearchDialog_Table", {
//			enableColumnReordering : false,
//			enableColumnFreeze : false,
//			columnHeaderHeight  : 35,
//			visibleRowCount : 12, 
//			showNoData : true,
//			selectionMode : sap.ui.table.SelectionMode.Single,
//			noData : "No data found" ,
//		});
//		oTable.attachCellClick(oController.onClickSearchTable);
////		oTable.attachBrowserEvent("dblclick", common.SearchOrg.onDblClick );
//		oTable.setModel(new sap.ui.model.json.JSONModel());
//		oTable.bindRows("/Data");
//		var oColumn = new sap.ui.table.Column({
//			hAlign : "Center",
//			flexible : false,
//        	autoResizable : true,
//        	resizable : true,
//			showFilterMenuEntry : false ,
//			label : new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0532"), textAlign : "Center", width : "100%"})	// 532:코드
////			.setModel(oJSonModel)
////			.bindElement("/Data")
//			.addStyleClass("L2PFontFamily"), 
//			template : new sap.ui.commons.TextView({
//				text : "{Code}", 
//				textAlign : "Begin"}).addStyleClass("L2PFontFamily")
//		
//		});
//		oTable.addColumn(oColumn) ;
//		
//		var oColumn = new sap.ui.table.Column({
//			hAlign : "Center",
//			flexible : false,
//        	autoResizable : true,
//        	resizable : true,
//			showFilterMenuEntry : false ,
//			label : new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0533"), 	// 533:텍스트
//												 textAlign : "Center", width : "100%"})
////			.setModel(oJSonModel)
////			.bindElement("/Data")
//			.addStyleClass("L2PFontFamily"), 
//			template : new sap.ui.commons.TextView({
//				text : "{CodeText}", 
//				textAlign : "Begin"}).addStyleClass("L2PFontFamily")
//		
//		});
//		oTable.addColumn(oColumn) ;
		
		var oColumnList = new sap.m.ColumnListItem({
//			counter : 10,
			cells : [
				new sap.m.Text({ text : "{Code}" }).addStyleClass("L2PFontFamily"),
				new sap.m.Text({ text : "{Text}" }).addStyleClass("L2PFontFamily"),
			]
		});
		
		var oTable = new sap.m.Table({
			inset : false,
			showNoData : false,
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
		});
		
		var oScrollLayout = new sap.m.ScrollContainer({
								horizontal : true,
								vertical : true,
								focusable: true,
								content : new sap.m.Table(oController.PAGEID + "_SearchDialog_Table", {
									inset : false,
									mode : sap.m.ListMode.SingleSelectLeft,
									backgroundDesign: sap.m.BackgroundDesign.Translucent,
									showSeparators: sap.m.ListSeparators.All,
									noDataText : "No data found",
									showNoData : true,
									columns : [
										new sap.m.Column({
								        	  demandPopin: true,
								        	  hAlign : sap.ui.core.TextAlign.Center,
								        	  styleClass : "cellBorderRight cellBorderLeft",
								        	  width : "30%",
								        	  minScreenWidth: "tablet"
								        }),
								        new sap.m.Column({
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
								.setKeyboardMode("Edit")
		});
	
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [oFilterBar, oTable, oScrollLayout ]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_SearchDialog", {
			contentWidth : "900px",
			contentHeight : "500px",
			showHeader : true,
			title : "{Title}",
			beforeOpen : oController.onBeforeOpenSearchDialog,
			afterOpen : oController.onAfterOpenSearchDialog,
			afterClose : oController.onAfterCloseSearchDialog,
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("LABEL_0037"),	// 37:선택
				press : oController.onConfirmSearchDialog}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  oBundleText.getText("LABEL_0071"),	// 71:취소
				press : oController.onCloseSearchDialog}),
			content : [oLayout]
		}).setModel(oJSonModel);
		oDialog.bindElement("/Data");
		
		oDialog.addStyleClass("sapUiSizeCompact");
		return oDialog;
	}

});