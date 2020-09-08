sap.ui.jsfragment("zui5_hrxx_projectprocess.fragment.SEARCH_STELL", {

	createContent : function(oController) {	
		
		jQuery.sap.require("zui5_hrxx_projectprocess.javascript.SearchStell"); 
		
//		var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		
		var oLayoutStellTree = new sap.ui.layout.VerticalLayout(oController.PAGEID + "_COMMON_SEARCH_STELL_StellTree", {
			width : "100%"
		}).addStyleClass("L2PStellTree");
		
		oLayoutStellTree.addDelegate({
			onAfterRendering:function(){	
				zui5_hrxx_projectprocess.javascript.SearchStell.createStellTree();
			}
		});
		
		var oTreeButtonBar = new sap.m.Toolbar({
			content : [ 						
						new sap.m.Button(oController.PAGEID + "_COMMON_SEARCH_STELL_PrevButton", {
							icon : "sap-icon://navigation-left-arrow",
							press : zui5_hrxx_projectprocess.javascript.SearchStell.searchStellPrev
						}),
						new sap.m.Button(oController.PAGEID + "_COMMON_SEARCH_STELL_NextButton", {
							icon : "sap-icon://navigation-right-arrow",
							press : zui5_hrxx_projectprocess.javascript.SearchStell.searchStellNext
						})
			        ]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		var oTreeLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [oLayoutStellTree, oTreeButtonBar ]
		});
		
		var oFilterBar = new sap.m.Toolbar({
			content : [ new sap.m.ToolbarSpacer({width: "10px"}),
			            new sap.m.Label({
			            	text : oBundleText.getText("DATUM")
			            }).addStyleClass("L2P13Font"),

			            new sap.m.DatePicker(oController.PAGEID + "_COMMON_SEARCH_STELL_Datum", {
							value: dateFormat.format(curDate), 
							valueFormat : "yyyy-MM-dd",
			            	displayFormat : gDtfmt,
							width : "150px"
						}),
						new sap.m.ToolbarSpacer({width: "10px"}),
						new sap.m.Label({text : oBundleText.getText("STELLTX")}).addStyleClass("L2P13Font"),
						new sap.m.Input(oController.PAGEID + "_COMMON_SEARCH_STELL_Stext", {
							width: "170px"
						}).attachBrowserEvent("keyup", zui5_hrxx_projectprocess.javascript.SearchStell.onKeyUp),						
						new sap.m.ToolbarSpacer(),
						new sap.m.Button(oController.PAGEID + "_COMMON_SEARCH_STELL_SearchButton", {
							icon : "sap-icon://search",
							text : oBundleText.getText("SEARCH_BTN"),
							customData : [{key : "Persa", value : oController._vPersa}],
							press : zui5_hrxx_projectprocess.javascript.SearchStell.searchStell
						}),
						new sap.m.ToolbarSpacer({width: "10px"})
			        ]
		}).addStyleClass("L2PToolbarNoBottomLine");	
		
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_COMMON_SEARCH_STELL_COLUMNLIST", {
			counter : 10,
			cells : [ 
			    new sap.m.Text({text : "{Stext}", textAlign : sap.ui.core.TextAlign.Begin}).addStyleClass("L2P13Font"), 
				new sap.m.Text({text : "{Manjftx}", textAlign : sap.ui.core.TextAlign.Begin}).addStyleClass("L2P13Font"),
				new sap.m.Text({text : "{Subjftx}", textAlign : sap.ui.core.TextAlign.Begin}).addStyleClass("L2P13Font"),
			]
		}); 
		
		var oTable = new sap.m.Table(oController.PAGEID + "_COMMON_SEARCH_STELL_TABLE", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText( "MSG_NODATA"),
			showNoData : true,
			//mode : "MultiSelect",
			columns : [
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("STETX")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  width : "25%",
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
			          new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText("MJOBFAMILY")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  width : "25%",
			        	  hAlign : sap.ui.core.TextAlign.Begin,
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText("SJOBFAMILY")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  width : "50%",
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
			          ]
		});
		
		oTable.setModel(sap.ui.getCore().getModel("ZHRXX_COMMON_SRV"));
		
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
		
		var oIconTabBar = new sap.m.IconTabBar(oController.PAGEID + "_COMMON_SEARCH_STELL_ICONTABBAR", {
			upperCase : true,
			selectedKey : "2",
			items : [
					   new sap.m.IconTabFilter({
						   key : "2",
						   text : oBundleText.getText("STELLCHART"),
						   content : [ oTreeLayout ]
					   }),
					   new sap.m.IconTabFilter({
						   key : "1",
						   text : oBundleText.getText("STELLTX"),
						   content : [ oTable ]
					   }),
					 ]
		}); //.addStyleClass("L2PESDialog");
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [oFilterBar, oIconTabBar ]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_COMMON_SEARCH_STELL_Dialog", {
			contentWidth : "800px",
			contentHeight : "500px",
			showHeader : true,
			title : oBundleText.getText("TITLE_STELL_SEARCH"),
			beforeOpen : zui5_hrxx_projectprocess.javascript.SearchStell.onBeforeOpenSearchStellDialog,
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : oBundleText.getText("SELECT_BTN"),
				press : zui5_hrxx_projectprocess.javascript.SearchStell.onConfirm}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text : oBundleText.getText("CANCEL_BTN"),
				press : zui5_hrxx_projectprocess.javascript.SearchStell.onClose}),
			content : [oLayout]
		});	
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		
		return oDialog;
	}

});