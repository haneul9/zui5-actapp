sap.ui.jsfragment("zui5_hrxx_actretire.fragment.CheckStaffDialog", {
	
	createContent : function(oController) {
		
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_CheckStaff_COLUMNLIST", {
			cells : [
				new sap.m.Text({
				    text : "{Stext}" 
				}).addStyleClass("L2P13Font"), //가족유형
				new sap.m.Text({
				     text : "{Stfnr}" 
				}).addStyleClass("L2P13Font"), //가족유형
				new sap.m.Text({
					text : "{Ename}" ,		 
				}).addStyleClass("L2P13Font"), //성
				new sap.m.Text({
				     text : "{Zzcaltltx}" ,	 
				}).addStyleClass("L2P13Font"),
			] 
		});
		
		var oTable = new sap.m.Table(oController.PAGEID + "_CheckStaff_TABLE", {
			inset : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : oBundleText.getText("MSG_NODATA"),
			mode : sap.m.ListMode.SingleSelectLeft,
			fixedLayout : false,
			columns : [
		        	  new sap.m.Column({
		        		  header: new sap.m.Label({text : oBundleText.getText( "ORGEH")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
				          minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "PERNR")}).addStyleClass("L2P13Font"), 			        	  
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),  	  
			          new sap.m.Column({
			        	  header: new sap.m.Label({text : oBundleText.getText( "ENAME")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"}),
		        	  new sap.m.Column({
			        	  header: new sap.m.Text({text : oBundleText.getText( "ZZCALTL")}).addStyleClass("L2P13Font"),
			        	  demandPopin: true,
			        	  hAlign : sap.ui.core.TextAlign.Begin,
			        	  minScreenWidth: "tablet"})
			          ]
		});	
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_CheckStaffDialog",{
			content : [oTable],
			afterOpen : oController.onAfterOpenCheckStaffDialog,
			beginButton : new sap.m.Button({text : oBundleText.getText("SELECT_BTN"), icon: "sap-icon://accept", 
				press : oController.onCheckStaffConfirm}),
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"), icon: "sap-icon://sys-cancel-2", 
				press : oController.onCheckStaffClose}),
			contentWidth : "700px",
			contentHeight : "400px",
			title : oBundleText.getText("TITLE_CHECK_STAFF")
		});
		
		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
	    };		

		return oDialog;
	}

});