sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_Rehire_DataSelect", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.ActRecPInfo_Rehire_DataSelect
	*/
	 

	createContent : function(oController) {

		var oPeridLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_Rehire_DataSelect_Layout", {
			width : "100%",
			layoutFixed : false,
			columns : 2,
			widths : [ "50%", "50%"],
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
 
		var oNotice1 =  new sap.m.Toolbar({
			design : sap.m.ToolbarDesign.Auto,
			content : [new sap.m.Label({text : "(Attention) If you are currently processing the Transfer Hiring Status,"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		var oNotice2 =  new sap.m.Toolbar({
			design : sap.m.ToolbarDesign.Auto,
			content : [new sap.m.Label({text : "please DO NOT tick the box as this might override the original data"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		var oNotice3 =  new sap.m.Toolbar({
			design : sap.m.ToolbarDesign.Auto,
			content : [new sap.m.Label({text : "that was transferred from recruiting and onboarding."}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		var oPeridPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [ new sap.m.Label({text : "Please tick (✓)  the box if it needs to be copied"}).addStyleClass("L2P13Font"),
			             oNotice1,
				         oNotice2, 
				         oNotice3, 
				         oPeridLayout ]
		});
		
		var oDialog = new sap.m.Dialog({
			title : "Rehire Information Copy", //"재입사 정보조회",
			showHeader : true,
			contentWidth : "500px",
			contentHeight : "380px",
			content : [ oPeridPanel],
			afterClose : oController.onAfterCloseRehireDataSelect,
			beforeOpen : oController.onBeforeOpenRehireDataSelect,
			beginButton : new sap.m.Button({
				text : "확인",
				press : oController.onConfirmRehireDataSelect
			}),
			endButton : new sap.m.Button({
				text : "취소",
				press : oController.onCancelRehireDataSelect
			})
		});
		
		if (!jQuery.support.touch) {
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
	    
		return oDialog;
	}

});
