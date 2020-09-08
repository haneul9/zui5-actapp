sap.ui.jsfragment("ZUI5_HR_Manpower.fragment.Detail11", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table11", {
			columnHeaderHeight  : 35,
			selectionMode: sap.ui.table.SelectionMode.None,
			noData : "No data found",
			visibleRowCount : 1,
			extension : new sap.m.Toolbar({	
				content : [new sap.m.Text({text : oBundleText.getText("LABEL_2128")}).addStyleClass("L2PFontFamilyBold"),	// 2128:조회내역
						   new sap.m.ToolbarSpacer(),
						   new sap.ui.core.Icon({
							   src : "sap-icon://excel-attachment",
							   size : "1.0rem", 
							   color : "#002060",
							   press : oController.onExport
						   }).addStyleClass("L2PPointer")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
		});
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");	
		
		var col_info1 = [
			{id: "Grouptx", label : "Year", plabel : "Year", span : 0, type : "string2", sort : false, filter : false, width : "20%"},
			 {id: "Subgrtx", label : oBundleText.getText("LABEL_1030"), plabel : oBundleText.getText("LABEL_1030"), span : 0, type : "string", sort : false, filter : false, width : "6%"},	// 1030:직군
			 {id: "Mansum", label : oBundleText.getText("LABEL_0406"), plabel : oBundleText.getText("LABEL_0406"), span : 0, type : "string", sort : false, filter : false, width : "6%"},	// 406:계
			 {id: "Werks1", label : oBundleText.getText("LABEL_1821"), plabel : oBundleText.getText("LABEL_1770"), span : 4, type : "string", sort : false, filter : false, width : "5%"},	// 1770:본사, 1821:사업장별
	 		 {id: "Werks2", label : "", plabel : oBundleText.getText("LABEL_2164"), span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 2164:지역본부
			 {id: "Werks3", label : "", plabel : oBundleText.getText("LABEL_1502"), span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 1502:공장
			 {id: "Werks4", label : "", plabel : oBundleText.getText("LABEL_2093"), span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 2093:저유소
			 {id: "Persg1", label : oBundleText.getText("LABEL_1498"), plabel : oBundleText.getText("LABEL_2071"), span : 3, type : "string", sort : false, filter : false, width : "5%"},	// 1498:고용형태별, 2071:임원
			 {id: "Persg2", label : "", plabel : oBundleText.getText("LABEL_2112"), span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 2112:정규직
			 {id: "Persg3", label : "", plabel : oBundleText.getText("LABEL_1488"), span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 1488:계약직
			 {id: "Gesch1", label : oBundleText.getText("LABEL_1862"), plabel : oBundleText.getText("LABEL_1620"), span : 2, type : "string", sort : false, filter : false, width : "5%"},	// 1620:남성, 1862:성별
			 {id: "Gesch2", label : "", plabel : oBundleText.getText("LABEL_1933"), span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 1933:여성
			 {id: "Massg1", label : oBundleText.getText("LABEL_2278"), plabel : oBundleText.getText("LABEL_1487"), span : 5, type : "string", sort : false, filter : false, width : "5%"},	// 1487:계약만료, 2278:퇴직사유
			 {id: "Massg2", label : "", plabel : oBundleText.getText("LABEL_2116"), span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 2116:정년
			 {id: "Massg3", label : "", plabel : oBundleText.getText("LABEL_2012"), span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 2012:의원면직
			 {id: "Massg4", label : "", plabel : oBundleText.getText("LABEL_1811"), span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 1811:사망
			 {id: "Massg5", label : "", plabel : oBundleText.getText("LABEL_2110"), span : 0, type : "string", sort : false, filter : false, width : "5%"},	// 2110:전출
						 ];
		common.ZNK_TABLES.makeColumn(oController, oTable, col_info1);
		
		oTable.addEventDelegate({
			  onAfterRendering: function() {
				    var oTds = $("td[colspan]");
				    for(i=0; i<oTds.length; i++) {
				    	if(oTds[i].colSpan > 1) $("#" + oTds[i].id).css("border-bottom", "1px solid #dddddd");
				    }
				    
				   common.Common.generateRowspan({
						selector : '#ZUI5_HR_ManpowerList_Table11-header > tbody',
						colIndexes : [0, 1, 2]
					});
				   
				// 상단 Header 의 우측 border 없에기
				   var vColumnId = "";
				   $target = $('#ZUI5_HR_ManpowerList_Table11-header > tbody');
				   $target.each(function() {
						$('tr:eq(0)', this).each(function(row) {
							$('td', this).filter(':visible').each(function(col) {
								vColumnId = this;
							});
						});
					});
				   
				   if(vColumnId != "") $(vColumnId).css("border-right","none"); 
				   
				   common.Common.generateRowspan({
						selector : '#ZUI5_HR_ManpowerList_Table11-table > tbody',
						colIndexes : [0]
					});
				   $target = $('#ZUI5_HR_ManpowerList_Table11-table > tbody');
				   $target.each(function() {
						$('tr', this).each(function(row) {
							var Tltype = oTable.getModel().getProperty("/Data/"+ row+"/Tltype");
							if(Tltype == "X") $(this).css("background-color","#66CCFF"); // 하늘색
							else if(Tltype == "A") $(this).css("background-color","#2F75B5"); // 파란색
							else $(this).css("background-color","#ffffff"); //흰색
						});
					});
			  }
		});
		
		
		var oRow, oCell;
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["2rem", "", "2rem"]
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({content : oTable});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oMatrix.addEventDelegate({
			onAfterRendering : function() {
				oController._Columns = common.Common.convertColumnArrayForExcel(col_info1);
			}
		});
		return oMatrix;
		
	}
});
