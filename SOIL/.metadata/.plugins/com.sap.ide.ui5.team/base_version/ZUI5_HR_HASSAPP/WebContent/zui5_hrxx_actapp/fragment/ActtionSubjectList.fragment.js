sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActtionSubjectList", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.ActtionSubjectList
	*/
	
	createContent : function(oController) {		
        var oSubjectList = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_SubjectList", {
        	width : "100%",
		});
        
        oSubjectList.addDelegate({
			onAfterRendering: function() {
				oController.onAfterRenderingTable(oController);
			}
		});
		
		return oSubjectList;
	}

});
