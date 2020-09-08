sap.ui.jsfragment("ZUI5_HR_Overtime.fragment.OvertimePage01", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.Formatter");
		jQuery.sap.require("common.ZHR_TABLES");
		
		var c = sap.ui.commons;
		
		var displayYn = false ;
		if(_gAuth == "E") displayYn = false; else displayYn = true ;
		
		var oFilterLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		}).addStyleClass("L2PFilterLayout");
		
		oFilterLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Text({text : oBundleText.getText("LABEL_0045")}),	// 45:신청 시작일
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
					content : [new sap.m.Text({text : oBundleText.getText("LABEL_0046")}),	// 46:신청 종료일
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
					content : [new sap.m.Text({text : oBundleText.getText("LABEL_0019") }),	// 19:대상자 성명
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
								text: oBundleText.getText("LABEL_0002"),
								icon : "sap-icon://search",
								type : sap.m.ButtonType.Default,
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

		var col_info1 = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "5%"},
			 			 {id: "ZappStxtAl", label : oBundleText.getText("LABEL_0036"), plabel : "", span : 0, type : "formatter", sort : true, filter : true, width : "10%"},	// 36:상태
			 			 {id: "Orgtx", label : oBundleText.getText("LABEL_0039"), plabel : "", span : 0, type : "listText", sort : true, filter : true},	// 39:소속부서
			 			 {id: "Apename", label : oBundleText.getText("LABEL_0050"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "6.5%"},	// 50:신청자
			 			 {id: "Ename", label : oBundleText.getText("LABEL_0111"), plabel : "", span : 0, type : "popover", sort : true, filter : true},	// 111:대상자
			 			 {id: "Datum", label : oBundleText.getText("LABEL_1573"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "6%"},	// 1573:근태일자
			 			 {id: "Tim01", label : oBundleText.getText("LABEL_1434"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "6%"},	// 1434:OT합계
			 			 {id: "Tim02", label : oBundleText.getText("LABEL_1958"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "6%"},	// 1958:연장합계
			 			 {id: "Tim03", label : oBundleText.getText("LABEL_2148"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "6%"},	// 2148:주휴합계
			 			 {id: "Tim04", label : oBundleText.getText("LABEL_1520"), plabel : "", span : 0, type : "listText", sort : true, filter : true, width : "6%"},	// 1520:공휴합계
			 			 {id: "Appda", label : oBundleText.getText("LABEL_0049"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "6%"},	// 49:신청일
			 			 {id: "ZappDate", label : oBundleText.getText("LABEL_0107"), plabel : "", span : 0, type : "listdate", sort : true, filter : true, width : "6%"}];	// 107:결재일
		common.ZHR_TABLES.makeColumn(oController, oTable, col_info1);

		var vTableHeader = new sap.m.Toolbar({
			height : "35px",
			content : [ new sap.m.ToolbarSpacer({width : "5px"}),
				        new sap.m.MessageStrip(oController.PAGEID + "_CountDown",{
					    	   text : oBundleText.getText("LABEL_2054"),	// 2054:일근태 마감대상일 :       마감시한 :     남은시간 :   
				        	   type : "Success" ,
							   showIcon : true ,
							   customIcon : "sap-icon://message-information", 
							   showCloseButton : false,
				       })
			]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		var oContents = [vTableHeader, new sap.ui.core.HTML({content : "<div style='height : 7px;'/>"}), oTable];
		
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
		
		for(var i=0; i<oContents.length; i++){
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
			text : oBundleText.getText("LABEL_0001"),	// 건
			design : sap.m.IconTabFilterDesign.Horizontal,
		});
		
		var iConSeperator = new sap.m.IconTabSeparator();
		
		var oIconFilter1 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter1",{
			key : "10",
			icon : "sap-icon://create",
			iconColor : "Neutral",
			text : oBundleText.getText("LABEL_0059"),	// 59:작성중
			design : sap.m.IconTabFilterDesign.Horizontal,
		});
		
		var oIconFilter2 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter2",{
			key : "40",
			icon : "sap-icon://approvals",
			iconColor : "Critical",
			text : oBundleText.getText("LABEL_0997"),	// 997:기안
			design : sap.m.IconTabFilterDesign.Horizontal,
		});
		
		var oIconFilter3 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter3",{
			key : "50",
			icon : "sap-icon://accept",
			iconColor : "Positive",
			text : oBundleText.getText("LABEL_0041"),	// 41:승인
			design : sap.m.IconTabFilterDesign.Horizontal,
		});
		
		var oIconFilter4 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter4",{
			key : "55",
			icon : "sap-icon://decline",
			iconColor : "Negative",
			text : oBundleText.getText("LABEL_0024"),	// 24:반려
			design : sap.m.IconTabFilterDesign.Horizontal,
		});
		
		var oIconFilter5 = new sap.m.IconTabFilter(oController.PAGEID + "_IconTabFilter5",{
			key : "90",
			icon : "sap-icon://cancel",
			iconColor : "Negative",
			text : oBundleText.getText("LABEL_0071"),	// 71:취소
			design : sap.m.IconTabFilterDesign.Horizontal,
		});
		
		var oIconBar = new sap.m.IconTabBar(oController.PAGEID + "_ICONBAR",{
			expandable : false,
			expanded : true,
			content : oContentMatrix ,
			items : [oIconFilter, iConSeperator, oIconFilter1, oIconFilter2, oIconFilter3, oIconFilter4, oIconFilter5],
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