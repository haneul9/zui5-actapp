sap.ui.jsfragment("fragment.COMMON_SEARCH_ZZLOJOB", {

	createContent : function(oController) {	
		
		jQuery.sap.require("common.SearchZzlojob"); 
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		 
		var oFilterBar = new sap.m.Toolbar({
			content : [ new sap.m.ToolbarSpacer({width: "10px"}),
			            new sap.m.Label({
			            	text : oBundleText.getText("DATUM")
			            }).addStyleClass("L2P13Font"),

			            new sap.m.DatePicker(oController.PAGEID + "_COMMON_SEARCH_ZZLOJOB_Datum", {
							value: dateFormat.format(curDate), 
							valueFormat : "yyyy-MM-dd",
			            	displayFormat : gDtfmt,
							width : "150px"
						}),
						new sap.m.ToolbarSpacer({width: "10px"}),
						new sap.m.Label({text : oBundleText.getText("ZZLOJOB_STEXT")}).addStyleClass("L2P13Font"),
						new sap.m.Input(oController.PAGEID + "_COMMON_SEARCH_ZZLOJOB_Stext", {
							width: "170px"
						}).attachBrowserEvent("keyup", common.SearchZzlojob.onKeyUp),						
						new sap.m.ToolbarSpacer(),
						new sap.m.Button(oController.PAGEID + "_COMMON_SEARCH_ZZLOJOB_SearchButton", {
							icon : "sap-icon://search",
							text : oBundleText.getText("SEARCH_BTN"),
							customData : [{key : "Persa", value : oController._vPersa}],
							press : common.SearchZzlojob.SearchZzlojob
						}),
						new sap.m.ToolbarSpacer({width: "10px"})
			        ]
		}).addStyleClass("L2PToolbarNoBottomLine");	
		
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_COMMON_SEARCH_ZZLOJOB_COLUMNLIST", {
			counter : 10,
			cells : [ 
			    new sap.m.Text({text : "{Objid}", textAlign : sap.ui.core.TextAlign.Begin}).addStyleClass("L2P13Font"), 
				new sap.m.Text({text : "{Short}", textAlign : sap.ui.core.TextAlign.Begin}).addStyleClass("L2P13Font"),
				new sap.m.Text({text : "{Stext}", textAlign : sap.ui.core.TextAlign.Begin}).addStyleClass("L2P13Font"),
//				new sap.m.Text({text : "{StextEn}", textAlign : sap.ui.core.TextAlign.Begin}).addStyleClass("L2P13Font"),
//				new sap.m.Text({text : "{Shrtn}", textAlign : sap.ui.core.TextAlign.Begin}).addStyleClass("L2P13Font"),
			]
		}); 
		
		var oTable = new sap.m.Table(oController.PAGEID + "_COMMON_SEARCH_ZZLOJOB_TABLE", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText( "MSG_NODATA"),
			showNoData : true,
			fixedLayout  : false,
			columns : [
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("ZZLOJOB_OBJID")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText("ZZLOJOB_SHORT")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("ZZLOJOB_STEXT")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
//		        	  new sap.m.Column({
//			        	  header: new sap.m.Label({text : oBundleText.getText("ZZLOJOB_STEXTEN")}).addStyleClass("L2P13Font"), 			        	  
//			        	  demandPopin: true,
//			        	  hAlign : sap.ui.core.TextAlign.Begin,
//			        	  minScreenWidth: "tablet"}),
//		        	  new sap.m.Column({
//		        		  header: new sap.m.Label({text : oBundleText.getText("ZZLOJOB_SHRTN")}).addStyleClass("L2P13Font"), 			        	  
//			        	  demandPopin: true,
//			        	  hAlign : sap.ui.core.TextAlign.Begin,
//				          minScreenWidth: "tablet"})
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
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_COMMON_SEARCH_ZZLOJOB_Dialog", {
			contentWidth : "800px",
			contentHeight : "570px",
			showHeader : true,
			title : oBundleText.getText("ZZLOJOB"),
			beforeOpen : common.SearchZzlojob.onBeforeOpenSearchZzlojobDialog,
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("SELECT_BTN"),
				press : common.SearchZzlojob.onConfirm}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text : oBundleText.getText("CANCEL_BTN"),
				press : common.SearchZzlojob.onClose}),
			content : [oLayout]
		});	
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		
		return oDialog;
	}

});