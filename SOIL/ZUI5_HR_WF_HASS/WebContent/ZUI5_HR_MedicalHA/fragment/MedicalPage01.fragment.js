sap.ui.jsfragment("ZUI5_HR_MedicalHA.fragment.MedicalPage01", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.ZNK_TABLES");
		var c = sap.ui.commons;
		
		var oFilterLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		}).addStyleClass("L2PFilterLayout");
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Text({text : "지급년월"}),
					           new sap.m.Input({
						            value : "{Payym}",
									width : "150px",
							   }).addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PFilterItem")
		);
		
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
					        	    change : oController.EmpSearchByTx,
					        	    customData : new sap.ui.core.CustomData({key : "Pernr", value : "{Pernr}"}),
								    valueHelpRequest: oController.displayEmpSearchDialog
							   })//.attachBrowserEvent("keyup", oController.onKeyUp)
					.addStyleClass("L2PFontFamily")]
				}).addStyleClass("L2PFilterItem")
			);


		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label(),
				           new sap.m.Button({
								text: "검색",
								icon : "sap-icon://search",
//								type : sap.m.ButtonType.Emphasized,
//								type : sap.m.ButtonType.Default
								press : oController.onPressSearch ,
						   }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PFilterItem")
		).setModel(oController._ListCondJSonModel)
		 .bindElement("/Data");
		
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
//			rowHeight : 48,
//			visibleRowCount : 4,
//			fixedColumnCount : 4,
			showNoData : true,
//			selectionMode : sap.ui.table.SelectionMode.MultiToggle
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
		});
		oTable.setModel(oController._ListJSonModel);
		oTable.bindRows("/Data");	
		oTable.attachCellClick(oController.onSelectRow);

		var col_info1 = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "5%"},
						 {id: "ZappStxtAl", label : "상태", plabel : "", span : 0, type : "formatter", sort : true, filter : true},
						 {id: "Payym", label : "지급년월", plabel : "", span : 0, type : "listText", sort : true, filter : true},
						 {id: "Ename", label : "성명", plabel : "", span : 0, type : "listText", sort : true, filter : true},
						 {id: "Zzjiktltx", label : "직급", plabel : "", span : 0, type : "listText", sort : true, filter : true},
						 {id: "Orgtx", label : "소속부서", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "10%"},
						 {id: "Famgbtx", label : "지원대상", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "5%"},
						 {id: "Mdprd", label : "진료기간", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "15%"},
						 {id: "Apamt", label : "신청금액", plabel : "", span : 0, type : "listmoney", sort : true, filter : true},
						 {id: "Pyamt", label : "지원금액", plabel : "", span : 0, type : "listmoney", sort : true, filter : true},
						 {id: "Appda", label : "신청일", plabel : "", span : 0, type : "listdate", sort : true, filter : true},
						 {id: "Stfda", label : "담당자결재", plabel : "", span : 0, type : "listdate", sort : true, filter : true},
						 {id: "Sgnda", label : "최종결재일", plabel : "", span : 0, type : "listdate", sort : true, filter : true}];
		common.ZNK_TABLES.makeColumn(oController, oTable, col_info1);

		var oCell, oRow;						
		var oContentMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%"
		});
		 
		var vTableHeader = new sap.m.Toolbar({
			height : "35px",
			content : [ new sap.m.ToolbarSpacer({width : "5px"}),
				        new sap.m.MessageStrip(oController.PAGEID + "_CountDown",{
					    	   text : "신청기한 :       지급년월 :     남은시간 :   ",
				        	   type : "Success" ,
							   showIcon : true ,
							   customIcon : "sap-icon://message-information", 
							   showCloseButton : false,
				       })
			]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		var oContents = [vTableHeader, new sap.ui.core.HTML({content : "<div style='height : 7px;'/>"}), oTable];
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"})
		});
		oRow.addCell(oCell);
		oContentMatrix.addRow(oRow)
		for(var i=0;i<oContents.length;i++){
//			oRow = new sap.ui.commons.layout.MatrixLayoutRow();
//			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//				content : new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"})
//			});
//			oRow.addCell(oCell);
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
			items : [ oIconFilter, iCopnSeperator, oIconFilter1, oIconFilter2, oIconFilter3, 
				oIconFilter4 ,
					  oIconFilter5 , oIconFilter6, oIconFilter7],
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