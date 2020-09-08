sap.ui.jsfragment("ZUI5_HR_SnackHA.fragment.SnackPage01", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.ZNK_TABLES");
		
		var c = sap.ui.commons;
		
		var displayYn = false ;
		if(_gAuth == "E") displayYn = false; else displayYn = true;
		
		var oFilterLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		}).addStyleClass("L2PFilterLayout");
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Text({text : "신청 시작일"}),
					           new sap.m.DatePicker(oController.PAGEID + "_Apbeg", {
//					        	 	value: dateFormat.format(prevDate), 
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
//					        	 	value: dateFormat.format(curDate), 
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
					        	    customData : new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"}),
									change : oController.EmpSearchByTx,
								    valueHelpRequest: oController.displayEmpSearchDialog
							   })//.attachBrowserEvent("keyup", oController.onKeyUp)
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
								type : sap.m.ButtonType.Emphasized,
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
		
		var col_info1 = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "3%"},
			 			 {id: "ZappStxtAl", label : "상태", plabel : "", span : 0, type : "formatter", sort : true, filter : true, width : "6%"},
			 			 {id: "Orgtx", label : "소속부서", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "10%"},
			 			 {id: "Partip", label : "투입인원", plabel : "", span : 0, type : "listcnumber", sort : true, filter : true, width : "5%"},
			 			 {id: "Betrg", label : "총금액", plabel : "", span : 0, type : "listmoney", sort : true, filter : true, width : "7%"},
			 			 {id: "Begda", label : "시작일", plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "6%"},
			 			 {id: "Endda", label : "종료일", plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "6%"},
			 			 {id: "Worsn", label : "신청사유", plabel : "", span : 0, type : "listText", sort : true, filter : true},
			 			 {id: "Calrsn", label : "계산근거", plabel : "", span : 0, type : "Calrsn", sort : true, filter : true, width : "5%"},
			 			 {id: "Appda", label : "신청일", plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "6%"},
			 			 {id: "Stfda", label : "담당자결재일", plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "7%"},
			 			 {id: "Sgnda", label : "최종결재일", plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "6%"},
			 			 {id: "ZappResn", label : "반려사유", plabel : "", span : 0, type : "popover3", sort : true, filter : true, width : "5%"}];
		common.ZNK_TABLES.makeColumn(oController, oTable, col_info1);

		
		var oCell, oRow;						
		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%"
		});		 
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.core.HTML({content : "<div style='height : 7px;'/>"})
		});
		oRow.addCell(oCell);
		oContentMatrix.addRow(oRow);
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oTable
		});
		oRow.addCell(oCell);
		oContentMatrix.addRow(oRow);
		
		var oIconFilter = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter",{
			showAll : true,
			key : "All",
			icon : "",
			text : "건",
			design : sap.m.IconTabFilterDesign.Horizontal,
		});
		
		var iConSeperator = new sap.m.IconTabSeparator();		

		var oIconFilter1 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter1",{
			key : "20",
			icon : "sap-icon://approvals",
			iconColor : "Neutral",
			text : "신청",
			design : sap.m.IconTabFilterDesign.Horizontal,
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
			items : [oIconFilter, iConSeperator, oIconFilter1, oIconFilter2, oIconFilter3, oIconFilter4, oIconFilter5, oIconFilter6, oIconFilter7],
		    selectedKey : "All",
			select : oController.handleIconTabBarSelect
		})
										
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height : 11px;'/>"}),
						oFilterLayout,
						oIconBar ]
		});
		
//		if (!jQuery.support.touch) {
			oLayout.addStyleClass("sapUiSizeCompact");
//		};

		return oLayout;

	
	}
});