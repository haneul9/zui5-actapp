sap.ui.jsfragment("ZUI5_HR_JoinClubHA.fragment.DisplayZappResn", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		
		var oTextArea = new sap.m.TextArea({
			width : "100%",
			value : "{ZappResn}",
			rows : 4,
			editable : false
		}).addStyleClass("L2PFontFamily");	
		
		var oPanel = new sap.m.Panel({
			width : "100%",
			content : [oTextArea]
		});
		
		/////////////////////////////////////////////////////////////////////////////////////////////////		
		var oPopover = new sap.m.Popover(oController.PAGEID + "_Popover", {
			content :[oPanel] ,
			contentWidth : "350px",
			showHeader : true,
			title : "반려사유",
			placement : "Bottom",
			endButton : new sap.m.Button({icon :"sap-icon://decline", press : function(oEvent){oPopover.close();}})
		});
		
		oPopover.setModel(new sap.ui.model.json.JSONModel());
		oPopover.bindElement("/Data");
		
		oPopover.addStyleClass("sapUiSizeCompact");
		

		return oPopover;
	}

});
