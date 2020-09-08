sap.ui.jsfragment("ZUI5_HR_Manpower2.fragment.Detail10", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table10", {
			columnHeaderHeight  : 35,
			selectionMode: sap.ui.table.SelectionMode.None,
			noData : "No data found",
			visibleRowCount : 1,
			extension : new sap.m.Toolbar({	
				content : [
					new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/zui5_hr_common/images/Title_icon_B.png"}),
					new sap.m.Text({text : oBundleText.getText("LABEL_2128")}).addStyleClass("MiddleTitle"),	// 2128:조회내역
				    new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: oBundleText.getText("LABEL_2871"),	// 2871:엑셀다운로드
						press : oController.onExport
					})]
			}).addStyleClass("ToolbarNoBottomLine"),
		});
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");	
		
		var col_info1 = [
			{id: "Grouptx", label : oBundleText.getText("LABEL_0300"), plabel : oBundleText.getText("LABEL_0300"), resize : false, span : 0, type : "string2", sort : false, filter : false, width : "16%"},	// 300:구분
			 {id: "Subgrtx", label : oBundleText.getText("LABEL_1622"), plabel : oBundleText.getText("LABEL_1622"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "7%"},	// 1622:내용
			 {id: "Mansum", label : oBundleText.getText("LABEL_0406"), plabel : oBundleText.getText("LABEL_0406"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "7%"},	// 406:계
			 {id: "Werks1", label : oBundleText.getText("LABEL_1821"), plabel : oBundleText.getText("LABEL_1770"), resize : false, span : 4, type : "string", sort : false, filter : false, width : "7%"},	// 1770:본사, 1821:사업장별
	 		 {id: "Werks2", label : "", plabel : oBundleText.getText("LABEL_2164"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "7%"},	// 2164:지역본부
			 {id: "Werks3", label : "", plabel : oBundleText.getText("LABEL_1502"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "7%"},	// 1502:공장
			 {id: "Werks4", label : "", plabel : oBundleText.getText("LABEL_2093"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "7%"},	// 2093:저유소
			 {id: "Persg1", label : oBundleText.getText("LABEL_1498"), plabel : oBundleText.getText("LABEL_2071"), resize : false, span : 4, type : "string", sort : false, filter : false, width : "7%"},	// 1498:고용형태별, 2071:임원
			 {id: "Persg2", label : "", plabel : oBundleText.getText("LABEL_2112"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "7%"},	// 2112:정규직
			 {id: "Persg3", label : "", plabel : oBundleText.getText("LABEL_1488"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "7%"},	// 1488:계약직
			 {id: "Persg4", label : "", plabel : oBundleText.getText("LABEL_2290"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "7%"},	// 2290:파견직
			 {id: "Gesch1", label : oBundleText.getText("LABEL_1862"), plabel : oBundleText.getText("LABEL_1620"), resize : false, span : 2, type : "string", sort : false, filter : false, width : "7%"},	// 1620:남성, 1862:성별
			 {id: "Gesch2", label : "", plabel : oBundleText.getText("LABEL_1933"), resize : false, span : 0, type : "string", sort : false, filter : false, width : "7%"},	// 1933:여성
						 ];
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);
		
		oTable.addEventDelegate({
			  onAfterRendering: function() {
				    var oTds = $("td[colspan]");
				    for(i=0; i<oTds.length; i++) {
				    	if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				    }
				    
				   common.Common.generateRowspan({
						selector : '#ZUI5_HR_ManpowerList_Table10-header > tbody',
						colIndexes : [0, 1, 2]
					});
				   
				// 상단 Header 의 우측 border 없에기
				   var vColumnId = "";
				   $target = $('#ZUI5_HR_ManpowerList_Table10-header > tbody');
				   $target.each(function() {
						$('tr:eq(0)', this).each(function(row) {
							$('td', this).filter(':visible').each(function(col) {
								vColumnId = this;
							});
						});
					});
				   
				   if(vColumnId != "") $(vColumnId).css("border-right","none"); 
				   
				   common.Common.generateRowspan({
						selector : '#ZUI5_HR_ManpowerList_Table10-table > tbody',
						colIndexes : [0]
					});
				   
				   $target = $('#ZUI5_HR_ManpowerList_Table10-table > tbody');
				   
				   $target.each(function() {
						$('tr', this).each(function(row) {
							var Tltype = oTable.getModel().getProperty("/Data/"+ row+"/Tltype");
							if(Tltype == "X") $(this).css("background-color","#66CCFF"); // 하늘색
							else if(Tltype == "A") $(this).css("background-color","#78f081"); // 초록색
							else $(this).css("background-color","#ffffff"); //흰색
						});
					});
			  }
		});
		
		
		oController._Columns = common.Common.convertColumnArrayForExcel(col_info1);
		return oTable;
		
	}
});
