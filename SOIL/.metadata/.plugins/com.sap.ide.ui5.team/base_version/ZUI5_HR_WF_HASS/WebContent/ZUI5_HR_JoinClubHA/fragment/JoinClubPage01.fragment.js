sap.ui.jsfragment("ZUI5_HR_JoinClubHA.fragment.JoinClubPage01", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.ZNK_TABLES");
		
		var c = sap.ui.commons;
		
		var displayYn = false, displayYn2 = false ;
		if(_gAuth == "E") {
			displayYn = false;
			displayYn2 = true;
		} else {
			displayYn = true;
			displayYn2 = false;
		}
		
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
					content : [new sap.m.Text({text : "사업장"}),
					           new sap.m.ComboBox(oController.PAGEID + "_Btrtl", {
									width : "150px",
									selectedKey : "{Btrtl}"
							   }).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Text({text : "인포멀그룹" }),
					           new sap.m.ComboBox(oController.PAGEID + "_Zclub", {
									width : "150px",
									selectedKey : "{Zclub}"
							   }).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Text({text : "신청종류" }),
					           new sap.m.ComboBox(oController.PAGEID + "_Reqtyp", {
									width : "150px",
					        	    selectedKey : "{Reqtyp}"
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
								type : sap.m.ButtonType.Emphasized,
								press : oController.onPressSearch ,
						   }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PFilterItem")
		).setModel(oController._ListCondJSonModel)
		 .bindElement("/Data");
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label(),
				           new sap.m.Button({
								text: "인포멀그룹 가입현황",
								icon : "sap-icon://search",
								type : sap.m.ButtonType.Emphasized,
								press : oController.onOpenState
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
			 			 {id: "ZappStxtAl", label : "상태", plabel : "", span : 0, type : "formatter", sort : true, filter : true},
			 			 {id: "Ename", label : "성명", plabel : "", span : 0, type : "listText", sort : true, filter : true},
			 			 {id: "Jikgbt,Jiktlt", label : "직군/직급", plabel : "", span : 0, type : "bp2", sort : true, filter : true},
			 			 {id: "Orgtx", label : "소속부서", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "10%"},
			 			 {id: "Zclubtx", label : "인포멀그룹", plabel : "", span : 0, type : "listText", sort : true, filter : true},
			 			 {id: "Member", label : "회원수", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "5%"},
			 			 {id: "Orgdt", label : "결성일자", plabel : "", span : 0, type : "listdate", sort : true, filter : true},
			 			 {id: "Joinynt", label : "가입현황", plabel : "", span : 0, type : "listText", sort : true, filter : true},
			 			 {id: "Reqtypt", label : "신청종류", plabel : "", span : 0, type : "listText", sort : true, filter : true},
			 			 {id: "Appda", label : "신청일", plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "7%"},
			 			 {id: "Gdate", label : "총무결재일", plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "7%"},
			 			 {id: "Cdate", label : "회장결재일", plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "7%"},
			 			 {id: "Stfda", label : "최종결재일", plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "7%"},
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
			iconColor : "Critical",
			text : "신청",
			design : sap.m.IconTabFilterDesign.Horizontal,
		});
		
		var oIconFilter2 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter2",{
			key : "50",
			icon : "sap-icon://accept",
			iconColor : "Default",
			text : "승인",
			design : sap.m.IconTabFilterDesign.Horizontal,
		});
		
		var oIconFilter3 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter3",{
			key : "55",
			icon : "sap-icon://decline",
			iconColor : "Negative",
			text : "반려",
			design : sap.m.IconTabFilterDesign.Horizontal,
		});
		
		var oIconBar = new sap.m.IconTabBar(oController.PAGEID + "_ICONBAR",{
			content : oContentMatrix ,
			items : [oIconFilter, iConSeperator, oIconFilter1, oIconFilter2, oIconFilter3],
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