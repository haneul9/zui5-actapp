sap.ui.jsfragment("fragment.COMMON_SEARCH_KOSTL", {

	createContent : function(oController) {	
		
		jQuery.sap.require("common.SearchKostl"); 
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		
		var oFilterBar = new sap.m.Toolbar({
			content : [ new sap.m.ToolbarSpacer({width: "10px"}),
			            new sap.m.Label({
			            	text : oBundleText.getText("DATUM")
			            }).addStyleClass("L2P13Font"),

			            new sap.m.DatePicker(oController.PAGEID + "_COMMON_SEARCH_KOSTL_Datum", {
							value: dateFormat.format(curDate), 
							valueFormat : "yyyy-MM-dd",
			            	displayFormat : gDtfmt,
							width : "150px"
						}),
						new sap.m.ToolbarSpacer({width: "10px"}), 
						new sap.m.Label({text : oBundleText.getText("KOSTL")}).addStyleClass("L2P13Font"),
						new sap.m.Input(oController.PAGEID + "_COMMON_SEARCH_KOSTL_Stext", {
							width: "170px"
						}).attachBrowserEvent("keyup", common.SearchKostl.onKeyUp),						
						new sap.m.ToolbarSpacer(),
						new sap.m.Button(oController.PAGEID + "_COMMON_SEARCH_KOSTL_SearchButton", {
							icon : "sap-icon://search",
							text : oBundleText.getText("SEARCH_BTN"),
							customData : [{key : "Persa", value : oController._vPersa}],
							press : common.SearchKostl.SearchKostl
						}),
						new sap.m.ToolbarSpacer({width: "10px"})
			        ]
		}).addStyleClass("L2PToolbarNoBottomLine");	
		
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_COMMON_SEARCH_KOSTL_COLUMNLIST", {
			counter : 10,
			cells : [ 
			    new sap.m.Text({text : "{Kostl}", textAlign : sap.ui.core.TextAlign.Begin}).addStyleClass("L2P13Font"), 
				new sap.m.Text({text : "{Ktext}", textAlign : sap.ui.core.TextAlign.Begin}).addStyleClass("L2P13Font"),
				new sap.m.Text({text : "{Ltext}", textAlign : sap.ui.core.TextAlign.Begin}).addStyleClass("L2P13Font"),
			]
		}); 
		
		var oTable = new sap.m.Table(oController.PAGEID + "_COMMON_SEARCH_KOSTL_TABLE", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText( "MSG_NODATA"),
			showNoData : true,
			fixedLayout  : false,
			columns : [
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("KOSTL_CODE")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText("KOSTL_KTEXT")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("KOSTL_LTEXT")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
			          ]
		});
		
		oTable.setModel(sap.ui.getCore().getModel("ZL2P01GW9000_SRV"));
		
		oTable.attachUpdateStarted(function() {
			if(!oController.BusyDialog) {
				oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
				oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCHING")}));
				oController.getView().addDependent(oController.BusyDialog);
			} 
			if(!oController.BusyDialog.isOpen()) {
				oController.BusyDialog.open();
			}
		});
		oTable.attachUpdateFinished(function() {
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
		});
		
		var oTablePanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			height : "500px",
			content : [oTable]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [oFilterBar, oTablePanel]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_COMMON_SEARCH_KOSTL_Dialog", {
			contentWidth : "800px",
			contentHeight : "570px",
			showHeader : true,
			title : oBundleText.getText("KOSTL"),
			beforeOpen : common.SearchKostl.onBeforeOpenSearchKostlDialog,
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("SELECT_BTN"),
				press : common.SearchKostl.onConfirm}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text : oBundleText.getText("CANCEL_BTN"),
				press : common.SearchKostl.onClose}),
			content : [oLayout]
		});	
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		
		return oDialog;
	}

});