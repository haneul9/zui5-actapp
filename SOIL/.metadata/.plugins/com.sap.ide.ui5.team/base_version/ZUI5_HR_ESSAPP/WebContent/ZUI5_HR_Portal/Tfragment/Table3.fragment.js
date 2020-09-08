sap.ui.jsfragment("ZUI5_HR_Portal.Tfragment.Table3", {
	
	_colModel : [
		{id: "Pyitx", label : "항목", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},
		{id: "Anzhl", label : "휴가쿼터 발생", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "18%"},
		{id: "Rezhl", label : "사용", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "10%"},
		{id: "Betrg", label : "잔여", plabel : "", span : 0, type : "money", sort : false, filter : false, width : "12%"},
		{id: "Pydes", label : "설명", plabel : "", span : 0, type : "string", sort : false, filter : false, width : "50%"}
	],
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.ZHR_TABLES");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable3", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found",
			visibleRowCount : 1
		}).setModel(new sap.ui.model.json.JSONModel())
		.bindRows("/Data");
		
		oTable.addDelegate({
			onAfterRendering: function() {
				$("#ZUI5_HR_PortalList_DetailTable3-table > tbody > tr").each(function(){
//					if(Number($(this).find("td:eq(3)").find("span").html().split(",").join("")) > 0 ){
//						var sId = $(this).find("td:eq(3)").attr("id");
//						var vArray = sId.split("-").splice(0,3).join("-");
//						$("#"+vArray +"-col1").hide();
//						$("#"+vArray +"-col2").hide();
//						$("#"+sId).attr("colspan",3);
//					}
					if($(this).find("td:eq(0)").find("span").html() == "연차수당"){
						var sId = $(this).find("td:eq(3)").attr("id");
						var vArray = sId.split("-").splice(0,3).join("-");
						$("#"+vArray +"-col1").hide();
						$("#"+vArray +"-col2").hide();
						$("#"+sId).attr("colspan",3);
					}
				})
			}
		});
		
		common.ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
		
		return oTable;
	},	
});