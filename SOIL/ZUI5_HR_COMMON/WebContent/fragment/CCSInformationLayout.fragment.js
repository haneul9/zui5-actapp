sap.ui.jsfragment("fragment.CCSInformationLayout", {
	
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ApplyLayout
	*/
	
	createContent : function(oController) {
		var oCell = null, oRow = null;
		jQuery.sap.require("common.ZHR_TABLES");
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_CCSPageTable",{
			enableColumnReordering : false,
			enableColumnFreeze : false,
			showNoData : true,
			columnHeaderHeight  : 35,
			selectionMode : sap.ui.table.SelectionMode.None,
			visibleRowCount : 5
		});
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var col_info1 = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "50px"},
			{id: "Cardno", label : oBundleText.getText("LABEL_2250"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "10%"},	// 2250:카드번호
			{id: "Owner", label : oBundleText.getText("LABEL_0322"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 322:소유자
			{id: "Useddate", label : oBundleText.getText("LABEL_0156"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 156:사용일자
			{id: "Acceptno", label : oBundleText.getText("LABEL_2766"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "6%"},	// 2766:승인번호
			{id: "Amount", label : oBundleText.getText("LABEL_2767"), plabel : "", span : 0, type : "money", sort : true, filter : true, width : "8%"},	// 2767:사용금액
			{id: "Vendor", label : oBundleText.getText("LABEL_2768"), plabel : "", span : 0, type : "string4", sort : true, filter : true, width : "12%"},	// 2768:가맹점
			{id: "Biztype", label : oBundleText.getText("LABEL_2769"), plabel : "", span : 0, type : "string4", sort : true, filter : true, width : "10%"},	// 2769:업종
			{id: "Address", label : oBundleText.getText("LABEL_0097"), plabel : "", span : 0, type : "string4", sort : true, filter : true},	// 97:소재지
			{id: "Mergetypetx", label : oBundleText.getText("LABEL_0300"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "7%"}	// 300:구분
		];
		
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
		var oPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content :  [   new sap.m.Toolbar({
					    height : "20px",
						content : [ new sap.m.Image({
									  src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png",
								    }),
								    new sap.m.ToolbarSpacer({width: "5px"}),
									new sap.m.Text({text : oBundleText.getText("LABEL_2770") }).addStyleClass("MiddleTitle")]	// 2770:법인카드내역
					    	}).addStyleClass("ToolbarNoBottomLine marginTop20px marginBottom10px") ,
				    	oTable	
						]
		});

		oPanel.addStyleClass("sapUiSizeCompact");
		
		return oPanel;
	}

});
