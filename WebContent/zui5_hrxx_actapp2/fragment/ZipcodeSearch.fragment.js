sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ZipcodeSearch", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	*/
	 
	createContent : function(oController) {
		var oSearch = new sap.m.SearchField(oController.PAGEID + "_ZipcodeSearchField", {
			width : "100%",
			search : oController.onSearchZipcode
		});
		
//		var oTable = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_ZipcodeList",  {
//			width : "100%",
//		});
//		
//		oTable.addDelegate({
//			onAfterRendering: oController.onAfterRenderingTableLayout
//		});

		
		var vZipcodeColumns = [
	                         {id : "Pstlz", label : oBundleText.getText("PSTLZ"), control : "Text", width : 100, align : "Center", filter : "#rspan"},
			                 {id : "Statetx", label : oBundleText.getText("STATE_41"), control : "Text", width : 98, align : "Left", filter : "#combo_filter"},
			                 {id : "Ort01", label : oBundleText.getText("ORT01_ZIP"), control : "Text", width : 98, align : "Left", filter : "#combo_filter"},
			                 {id : "Ltext1", label : oBundleText.getText("LTEXT1"), control : "Text", width : 250, align : "Left", filter : "#text_filter"},
			                 {id : "Ltext2", label : oBundleText.getText("LTEXT2"), control : "Text", width : 250, align : "Left", filter : "#text_filter"},
			                 {id : "Ltext3", label : oBundleText.getText("LTEXT3"), control : "Text", width : 250, align : "Left", filter : "#text_filter"},
			                ];
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_ZipcodeList", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 40,
//			rowHeight : 48,
			visibleRowCount : 16,
//			fixedColumnCount : 4,
			selectionMode : sap.ui.table.SelectionMode.MultiToggle
		});
		
		for(var i=0; i<vZipcodeColumns.length; i++) {			
			if(i == vZipcodeColumns.length - 1){
				var oColumn =  new sap.ui.table.Column({
					hAlign : "Center",
					flexible : false,
					resizable : false,
		        	vAlign : "Middle",
		        	label : new sap.m.Label({text : vZipcodeColumns[i].label, textAlign : "Center"}),
		            template: new sap.ui.commons.TextView({
						text : "{" + vZipcodeColumns[i].id + "}",  
						textAlign : "Center"
					}).addStyleClass("L2P13Font"),
				});
				oTable.addColumn(oColumn);
			}else{
				var oColumn =  new sap.ui.table.Column({
					hAlign : "Center",
					flexible : false,
					resizable : false,
		        	vAlign : "Middle",
		        	label : new sap.m.Label({text : vZipcodeColumns[i].label, textAlign : "Center"}),
		            width : vZipcodeColumns[i].width + "px",
		        	template: new sap.ui.commons.TextView({
						text : "{" + vZipcodeColumns[i].id + "}",  
						textAlign : "Center"
					}).addStyleClass("L2P13Font"),
				});
				oTable.addColumn(oColumn);
			}
		}
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oSearch,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oTable
			           ]
		});	
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_ZS_Dialog",{
			content : oLayout,
			contentWidth : "1110px",
			contentHeight : "650px",
			showHeader : true,
			title : oBundleText.getText("TITLE_ZIPCODE_SEARCH"),
			beforeOpen : oController.beforeOpenZSDialog,
			beginButton : new sap.m.Button({text : oBundleText.getText("SELECT_BTN"), icon: "sap-icon://complete", press : oController.onConfirmZipcode}), //
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"), icon: "sap-icon://sys-cancel-2", press : oController.onCloseZipcode}), //
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		

		return oDialog;
	}

});
