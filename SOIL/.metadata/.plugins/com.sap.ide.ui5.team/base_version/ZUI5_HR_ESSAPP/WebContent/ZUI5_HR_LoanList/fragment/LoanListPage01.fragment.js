sap.ui.jsfragment("ZUI5_HR_LoanList.fragment.LoanListPage01", {
	
	createContent : function(oController) {
		var oRow, oCell;
		
		// 대상자
		var oMatrix1 = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			widths : [ '20%', '30%', '20%', '30%' ]
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0019")}).addStyleClass("L2PFontFamily"),	// 19:대상자 성명
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [
				new sap.m.Input(oController.PAGEID + "_Ename",{ 
					width : "150px",
					value : "{Ename}",
					showValueHelp: true,
	        	    valueHelpOnly: false,
					editable : { 
						  path : "Auth",
						  formatter : function(fVal){
							  if(fVal == "E") return false ;
							  else return true;
						  }
					},
					change : oController.EmpSearchByTx,
					valueHelpRequest: oController.displayEmpSearchDialog,
					customData : new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"}),
				}).addStyleClass("L2PFontFamilyBold")
			]
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1681")}).addStyleClass("L2PFontFamily"),	// 1681:대상자 사번
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [new sap.m.Text({text : "{Perid}"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix1.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_0039")}).addStyleClass("L2PFontFamily"),	// 39:소속부서
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [new sap.m.Text({text : "{Orgtx}"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1006")}).addStyleClass("L2PFontFamily"),	// 1006:직군 / 직급
		}).addStyleClass("L2PMatrixLabel"); 
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [new sap.m.Text({
							text : {
								parts : [{path : "Zzjikgbt"}, {path : "Zzjiktlt"}],
								formatter : function(fVal1, fVal2){
									if(fVal1 || fVal2) return fVal1 + " / " + fVal2;
									else return "";
								}
							}					
					   }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix1.addRow(oRow);
				
		var oPanel1 = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [
					new sap.ui.core.Icon({
						src: "sap-icon://open-command-field", 
						size : "1.0rem"
					}),
					new sap.m.ToolbarSpacer({width: "5px"}),
					new sap.m.Text({text : oBundleText.getText("LABEL_0111")}).addStyleClass("L2PFontFamilyBold")	// 111:대상자
			]}).addStyleClass("L2PToolbarNoBottomLine"),
			content : oMatrix1
		});
		
		// 대출내역
		var oTable2 = new sap.ui.table.Table(oController.PAGEID + "_Table2", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			visibleRowCount : 1,
			noData : "No data found"
		});
		oTable2.setModel(new sap.ui.model.json.JSONModel());
		oTable2.bindRows("/Data");	

        var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	vAlign : "Middle",
        	autoResizable : true,
        	resizable : true,
			showFilterMenuEntry : true,
			filterProperty : "",
			sortProperty : "",
			sorted : false,
			filtered : false,
			width : "3.3%",
			multiLabels : [new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0037"), textAlign : "Center", width : "100%"}).addStyleClass("L2PFontFamily")],	// 37:선택
			template : [
				new sap.m.RadioButton({
					groupName : "Radio1",
					selected : "{Check}",
					select : oController.onSelectRadioButton,
					customData : new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"})
				}).addStyleClass("L2PFontFamily")
			]
		});        
        oTable2.addColumn(oColumn);
			
		var col_info1 = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "3%"},
			 {id: "Lntyptx", label : oBundleText.getText("LABEL_1687"), plabel : "", span : 0, type : "string", sort : true, filter : true},	// 1687:대출구분
			 {id: "Lncontx", label : oBundleText.getText("LABEL_2120"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "8%"},	// 2120:조건
			 {id: "Begda", label : oBundleText.getText("LABEL_0230"), plabel : "", span : 0, type : "date", sort : true, filter : true},	// 230:지급일
			 {id: "Endda", label : oBundleText.getText("LABEL_1716"), plabel : "", span : 0, type : "date", sort : true, filter : true},	// 1716:만기일
			 {id: "Lstda", label : oBundleText.getText("LABEL_2228"), plabel : "", span : 0, type : "date", sort : true, filter : true},	// 2228:최종상환일
			 {id: "RpdatMid", label : oBundleText.getText("LABEL_0434"), plabel : "", span : 0, type : "date", sort : true, filter : true},	// 434:중도상환일
			 {id: "Lnamt", label : oBundleText.getText("LABEL_0407"), plabel : "", span : 0, type : "money", sort : true, filter : true, align : "End"},	// 407:대출금액
			 {id: "Lncnt,Lnprd", label : oBundleText.getText("LABEL_0226"), plabel : "", span : 0, type : "bp", sort : true, filter : true, width : "6%"},	// 226:상환횟수
			 {id: "RpamtPay", label : oBundleText.getText("LABEL_1595"), plabel : "", span : 0, type : "money", sort : true, filter : true, align : "End"},	// 1595:급여상환액
			 {id: "RpamtMpr", label : oBundleText.getText("LABEL_2150"), plabel : "", span : 0, type : "money", sort : true, filter : true, align : "End"},	// 2150:중도상환액
			 {id: "Blamt", label : oBundleText.getText("LABEL_0229"), plabel : "", span : 0, type : "money", sort : true, filter : true, align : "End"},	// 229:잔액
			 {id: "Lnstatx", label : oBundleText.getText("LABEL_0961"), plabel : "", span : 0, type : "string", sort : true, filter : true}];	// 961:진행상태
		common.ZNK_TABLES.makeColumn(oController, oTable2, col_info1);
		
		oTable2.addEventDelegate({                        //Table onAfterRendering event
		      onAfterRendering: function() {                 
		    	  var vCols = [
		  			{col:"col8",   color:"rgba(186, 238, 154, 0.4)"},
		  			{col:"col12",  color:"rgba(255, 250, 193, 0.4)"}
		  		];
		  		
		  		for(var i=0; i<vCols.length; i++) {
		  			$("tr[id^='" + oController.PAGEID + "_Table2-rows'] > td[id$='" + vCols[i].col + "']").css("background-color", vCols[i].color);
		  		}
		      }
		    }, oTable2);
		
		var oPanel2 = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [
					new sap.ui.core.Icon({
						src: "sap-icon://open-command-field", 
						size : "1.0rem"
					}),
					new sap.m.ToolbarSpacer({width: "5px"}),
					new sap.m.Text({text : oBundleText.getText("LABEL_1688")}).addStyleClass("L2PFontFamilyBold")	// 1688:대출내역
			]}).addStyleClass("L2PToolbarNoBottomLine"),
			content : oTable2
		});
		
		// 상환, 상세내역
		var oPanel3 = new sap.m.Panel(oController.PAGEID + "_DetailPanel", {
			expandable : false,
			expanded : false,
			content : []
		});
								
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height : 11px;'/>"}), 
						oPanel1,
						new sap.ui.core.HTML({content : "<div style='height : 11px;'/>"}), 
						oPanel2,
						new sap.ui.core.HTML({content : "<div style='height : 11px;'/>"}), 
						oPanel3
					  ]
		});
		
//		if (!jQuery.support.touch) {
			oLayout.addStyleClass("sapUiSizeCompact");
//		};

		oLayout.setModel(oController._ListCondJSonModel);
		oLayout.bindElement("/Data");
			
		return oLayout;

	
	}
});