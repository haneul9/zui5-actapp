sap.ui.jsfragment("ZUI5_HR_BookRequest.fragment.BkdeDialog", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		
		var oCloseButton = new sap.m.Button({
			text : oBundleText.getText("LABEL_0017"), // 17:닫기
			press : function(oEvent){
				oDialog.close();
			}
		});
		
		var oFilterBar = new sap.m.Toolbar({
			content : [ 
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Label({text : oBundleText.getText("LABEL_1866")}).addStyleClass("FontFamilyBold"),	// 1866:세부분류명
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Input(oController.PAGEID + "_DBkde",{
				       width : "60%",
				       change : oController.onSearchBkkd 
				}).addStyleClass("FontFamily"),
				new sap.m.ToolbarSpacer({width: "10px"}),
				new sap.m.Button({
					icon : "sap-icon://search",
					text : oBundleText.getText("LABEL_0002"),	// 검색
					type : sap.m.ButtonType.Emphasized,
					press : oController.onSearchBkde
				}),
				new sap.m.ToolbarSpacer({width: "10px"})
			]
		}).addStyleClass("ToolbarNoBottomLine");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_BkdeTable",{
			enableColumnReordering : false,
			enableColumnFreeze : false,
			showNoData : true,
			selectionMode : sap.ui.table.SelectionMode.MultiToggle,
			visibleRowCount : 1
		});
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var col_info1 = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "50px"},
						 
			 			 {id: "Key", label : oBundleText.getText("LABEL_1867"), plabel : "", span : 0, type : "string4", sort : true, filter : true, width : "20%"},	// 1867:세부분류코드
			 			 {id: "Value", label : oBundleText.getText("LABEL_1866"), plabel : "", span : 0, type : "string4", sort : true, filter : true, width : "80%"}	// 1866:세부분류명
		];
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
		var oDialog = new sap.m.Dialog({
			content :[oFilterBar ,
				      oTable ] ,
			showHeader : true,
			width : "900px",
			title : oBundleText.getText("LABEL_1865"),	// 1865:세부분류 조회
			buttons: [
				new sap.m.Button({
					text : oBundleText.getText("LABEL_0037"), 	// 37:선택
					press : oController.onSelectBkde, 
					type : "Ghost",
				}),
				oCloseButton
			]
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");

		return oDialog;
	}

});
