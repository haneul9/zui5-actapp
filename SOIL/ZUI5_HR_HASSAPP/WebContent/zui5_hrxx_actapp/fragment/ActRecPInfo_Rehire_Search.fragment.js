sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Rehire_Search", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.ActRecPInfo_POP_Sub04
	*/
	
	createContent : function(oController) {
	 	
       var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_Rehire_Dialog", {
			title : "신분증번호",
			showHeader : true,
			contentWidth : "400px",
			contentHeight : "80px",
			content :[new sap.m.Input(oController.PAGEID + "_Rehire_Perid")] ,
			beginButton : new sap.m.Button({text : "확인", press : oController.onConfirmRehire}) ,
			endButton :  new sap.m.Button({text : "취소", press : oController.onCancelRehire})
		});
		return oDialog;
	}

});
