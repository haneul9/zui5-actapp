sap.ui.jsfragment("ZUI5_HR_Portal.fragment.FavoriteDialog", {
	
	createContent : function(oController) {
		
		var _colModel = [
			{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "60px"},
		 	{id: "Mncodt", label : "메뉴명", plabel : "", span : 0, type : "string", sort : true, filter : true, align : "Begin"},	// 36:상태
		];
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_FavoriteTable", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			visibleRowCount : 15,
			enableBusyIndicator : true,
			noData : "No data found",
		}).setModel(oController._FavoriteTableJSonModel)
		.bindRows("/Data");
		
		common.ZHR_TABLES.makeColumn(oController, oTable, _colModel);
		
		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	autoResizable : false,
        	resizable : false,
			showFilterMenuEntry : false,
			width : "100px",
			multiLabels : [new sap.ui.commons.TextView({text : "변경", textAlign : "Center", width : "100%"}).addStyleClass("FontFamilyBold")],	// 1548:근무구분
			template : [
				new sap.m.Toolbar({
					content : [
						new sap.m.ToolbarSpacer({width : "15px"}),
						new sap.ui.core.Icon({
							size : "1.0rem",
							src : "sap-icon://arrow-top",
							tooltip : "위로 이동",
							press : ZUI5_HR_Portal.common.FavoriteController.onMoveTop,
							customData : [new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"})]
						}),
						new sap.m.ToolbarSpacer(),
						new sap.ui.core.Icon({
							size : "1.0rem",
							src : "sap-icon://arrow-bottom",
							tooltip : "아래로 이동",
							press : ZUI5_HR_Portal.common.FavoriteController.onMoveBottom,
							customData : [new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"})]
						}),
						new sap.m.ToolbarSpacer({width : "15px"}),
					]
				})]
			
		});	
		oTable.addColumn(oColumn);
		
		var aRows = [
			new sap.ui.commons.layout.MatrixLayoutRow({
				height : "30px",
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : 	new sap.m.Text({
							text : "즐겨찾기 최대 15개까지 가능합니다.",
						}).addStyleClass("FontFamily"),
						hAlign : "End"
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : 	new sap.m.Text({
							text : "즐겨찾기 순서",
						}).addStyleClass("FontFamilyBold"),
					})
				]
			}),
			new sap.ui.commons.layout.MatrixLayoutRow({
				cells : [
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : new sap.ui.commons.layout.MatrixLayout(oController.PAGEID +"_FavoriteMatrix",{
							columns : 3,
							widths: ["33.3%", "33.3%", "33.4%"],
							width : "100%"
						}),
						vAlign : "Top"
					}),
					new sap.ui.commons.layout.MatrixLayoutCell({}),
					new sap.ui.commons.layout.MatrixLayoutCell({
						content : oTable ,
						vAlign : "Top"
					})
				]
			})
		];	
			
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_FavoriteDialog", {
			contentWidth : "1400px",
			contentHeight : "560px",
			showHeader : true,
			title : "즐겨찾기 설정",
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : "적용",
				press : ZUI5_HR_Portal.common.FavoriteController.onConfirmFavoriteDialog
			}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  "닫기",
				press : function(){
					oDialog.close();
				}
			}),
			content : new sap.ui.commons.layout.MatrixLayout({
				columns : 3,
				widths: ["", "40px", "500px"],
				width : "100%",
				rows : aRows
			})
		}).setModel(new sap.ui.model.json.JSONModel());
		
		oDialog.bindElement("/Data");
		
		oDialog.addStyleClass("sapUiSizeCompact");
		return oDialog;
	}

});