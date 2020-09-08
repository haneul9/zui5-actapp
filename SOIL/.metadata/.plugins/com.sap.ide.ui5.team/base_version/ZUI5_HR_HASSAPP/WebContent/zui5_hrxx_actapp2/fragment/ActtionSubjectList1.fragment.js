sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActtionSubjectList", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.ActtionSubjectList
	*/
	
	createContent : function(oController) {		
        var oSubjectList = new sap.ui.table.Table(oController.PAGEID + "_SubjectList", {
        	width : "100%",
			visibleRowCount: 1,
			firstVisibleRow: 1,
			selectionMode: sap.ui.table.SelectionMode.None,
			fixedColumnCount: 5,
			showNoData : false
		});
		
		oSubjectList.setModel(sap.ui.getCore().getModel("ActionSubjectList"));
		oSubjectList.bindRows("/ActionSubjectListSet");
		
		return oSubjectList;
	} 

});
