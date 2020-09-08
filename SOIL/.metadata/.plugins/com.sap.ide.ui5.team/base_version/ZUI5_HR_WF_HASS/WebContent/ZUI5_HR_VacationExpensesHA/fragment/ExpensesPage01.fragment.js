sap.ui.jsfragment("ZUI5_HR_VacationExpensesHA.fragment.ExpensesPage01", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.ZNK_TABLES");
		var c = sap.ui.commons;
		var displayYn = false ;
		if(_gAuth == "E"){
			displayYn = false;
		}else displayYn = true ;
		var oFilterLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		}).addStyleClass("L2PFilterLayout");
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Text({text : "신청 시작일"}),
					           new sap.m.DatePicker(oController.PAGEID + "_Apbeg", {
									valueFormat : "yyyy-MM-dd",
						            displayFormat : "yyyy.MM.dd",
						            value : "{Apbeg}",
									width : "150px",
									change : oController.onChangeDate
							   }).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Text({text : "신청 종료일"}),
					           new sap.m.DatePicker(oController.PAGEID + "_Apend", { 
									valueFormat : "yyyy-MM-dd",
						            displayFormat : "yyyy.MM.dd",
									width : "150px",
									 value : "{Apend}",
									change : oController.onChangeDate
							   }).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PFilterItem")
		);
			
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Text({text : "대상자 성명" }),
					           new sap.m.Input(oController.PAGEID + "_Ename", {
									width : "150px",
					        	    showValueHelp: true,
					        	    valueHelpOnly: false,
					        	    value : "{Ename}",
					        	    change : oController.EmpSearchByTx,
					        	    customData : new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"}),
								    valueHelpRequest: oController.displayEmpSearchDialog
							   })
					.addStyleClass("L2PFontFamily")],
					visible : displayYn
				}).addStyleClass("L2PFilterItem")
			);
	
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label(),
				           new sap.m.Button({
								text: "검색",
								icon : "sap-icon://search",
								press : oController.onPressSearch ,
						   }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PFilterItem")
		).setModel(oController._ListCondJSonModel)
		 .bindElement("/Data");
		
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
		});
		oTable.setModel(oController._ListJSonModel);
		oTable.bindRows("/Data");	
		oTable.attachCellClick(oController.onSelectRow);
		
		var col_info1 = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "50px"},
						 {id: "ZappStxtAl", label : "상태", plabel : "", span : 0, type : "formatter", sort : true, filter : true, width : "95px"},
						 {id: "Jiktlt", label : "직군/직급", plabel : "", span : 0, type : "listText", sort : true, filter : true},
						 {id: "Orgtx", label : "소속부서", plabel : "", span : 0, type : "listText", sort : true, filter : true},
						 {id: "Ename", label : "대상자", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "100px"},
						 {id: "Holtx", label : "휴가구분", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "200px"},
						 {id: "Holpl", label : "휴가장소", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "200px"},
						 {id: "Holday", label : "휴가일수", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "100px"},
						 {id: "Holbeg", label : "휴가시작일", plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "100px"},
						 {id: "Holend", label : "휴가종료일", plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "100px"},
						 {id: "Appda", label : "신청일", plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "100px"},
						 {id: "Sgndt", label : "결재일", plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "100px"}];
		common.ZNK_TABLES.makeColumn(oController, oTable, col_info1);

		
		var oCell, oRow;						
		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%"
		});
		 
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"})
		});
		oRow.addCell(oCell);
		oContentMatrix.addRow(oRow)
		
		var oContents = [oFilterLayout, new sap.ui.core.HTML({content : "<div style='height : 7px;'/>"}) ,oTable ];
		
		for(var i=0;i<oContents.length;i++){
			oContentMatrix.addRow(oRow);
			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				content : oContents[i]
			});
			oRow.addCell(oCell);
			oContentMatrix.addRow(oRow);
		}
		
		var oIconFilter = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter",{
			showAll : true,
			key : "All",
			icon : "",
			text : "건",
			design : sap.m.IconTabFilterDesign.Horizontal,
		});
		
		var iCopnSeperator = new sap.m.IconTabSeparator();
		
		var oIconFilter1 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter1",{
			key : "20",
			icon : "sap-icon://approvals",
			iconColor : "Neutral",
			text : "신청",
			design : sap.m.IconTabFilterDesign.Horizontal
		});
		
		var oIconFilter2 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter2",{
			key : "30",
			icon : "sap-icon://sys-enter",
			iconColor : "Positive", 
			text : "담당자승인",
			design : sap.m.IconTabFilterDesign.Horizontal,
		});
		
		var oIconFilter3 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter3",{
			key : "35",
			icon : "sap-icon://sys-cancel-2",
			iconColor : "Negative", 
			text : "담당자반려",
			design : sap.m.IconTabFilterDesign.Horizontal,
		});
		
		var oIconFilter4 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter4",{
			key : "40",
			icon : "sap-icon://sys-enter",
			iconColor : "Critical",
			text : "기안",
			design : sap.m.IconTabFilterDesign.Horizontal,
		});
		
		var oIconFilter5 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter5",{
			key : "50",
			icon : "sap-icon://accept",
			iconColor : "Default",
			text : "승인",
			design : sap.m.IconTabFilterDesign.Horizontal,
		});
		
		var oIconFilter6 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter6",{
			key : "55",
			icon : "sap-icon://decline",
			iconColor : "Negative",
			text : "반려",
			design : sap.m.IconTabFilterDesign.Horizontal,
		});
		
		var oIconFilter7 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter7",{
			key : "90",
			icon : "sap-icon://cancel",
			iconColor : "Negative",
			text : "취소",
			design : sap.m.IconTabFilterDesign.Horizontal,
		});
		
		var oIconBar = new sap.m.IconTabBar(oController.PAGEID + "_ICONBAR",{
			content : oContentMatrix ,
			items : [ oIconFilter, iCopnSeperator, oIconFilter1, oIconFilter2, oIconFilter3, oIconFilter4, oIconFilter5, oIconFilter6, oIconFilter7],
		    selectedKey : "All",
			select : oController.handleIconTabBarSelect
		})
								
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height : 11px;'/>"}),
						oFilterLayout,
						oIconBar ]
		});
		
		oLayout.addStyleClass("sapUiSizeCompact");

		return oLayout;

	
	}
});