sap.ui.jsfragment("fragment.ApprovalLine2", {
	
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf ApprovalLine
	*/
	
	// oController._vReqForm 신청서 유형, oController._vReqPernr 신청자 사번
	
	createContent : function(oController) {
		
		jQuery.sap.require("common.ZNK_ApprovalLine");
		
		var oCell = null, oRow = null;
		
//		var oNotice = new sap.m.Toolbar({
//			content : [new sap.m.ToolbarSpacer(),
//					   new sap.ui.core.Icon({src : "sap-icon://notes"}),
//					   new sap.m.Text({text : "결재자 지정 시 결재자 검색화면에서 사원을 선택하고 발신라인 화면에서 이동("}).addStyleClass("L2P13Font"),
//					   new sap.ui.core.Icon({src : "sap-icon://begin", size : "0.8rem"}),
//					   new sap.m.Text({text : ") 클릭하세요."}).addStyleClass("L2P13Font")]
//		}).addStyleClass("L2PToolbarNoBottomLine");
		
		var oNotice = new sap.m.Toolbar({
			design : sap.m.ToolbarDesign.Auto,
			height : "40px",
			content : [new sap.m.MessageStrip({
					  	      text : oBundleText.getText("LABEL_2762"),	// 2762:참조자 지정 시 참조자 검색화면에서 사원을 선택하고 발신라인 화면에서 이동을 클릭하세요.
						      type : "Success",
						      showIcon : true,
						      customIcon : "sap-icon://message-information", 
						      showCloseButton : false,
					   }),
					   new sap.m.ToolbarSpacer()]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		/////////////////// 결재자 검색 //////////////////
		var oTitle1 = new sap.m.Toolbar({
			content : [new sap.m.ToolbarSpacer(),
					   new sap.m.Text({text : oBundleText.getText("LABEL_2763")}).addStyleClass("L2P15FontBold"),	// 2763:참조자 검색
					   new sap.m.ToolbarSpacer()]
		});
		
		var oDetail1 = new sap.ui.commons.layout.MatrixLayout({
			widths : ["20%", "", "20%"],
			width : "100%",
			columns : 3
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Begin",
			content : [new sap.m.Text({text : oBundleText.getText("LABEL_1871")}).addStyleClass("L2P13Font")]	// 1871:소속명
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [new sap.m.Input(oController.PAGEID + "_ApprovalOrgtx", {width : "100%", submit : common.ZNK_ApprovalLine.onSearch})]
		});
		oRow.addCell(oCell);
		oDetail1.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Begin",
			content : [new sap.m.Text({text : oBundleText.getText("LABEL_2755")}).addStyleClass("L2P13Font")]	// 2755:사원명
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [new sap.m.Input(oController.PAGEID + "_ApprovalEname", {width : "100%", submit : common.ZNK_ApprovalLine.onSearch})]
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Right",
			content : [new sap.m.Button({
							text: oBundleText.getText("LABEL_0002"),	// 2:검색
							width : "80%",
							type : sap.m.ButtonType.Emphasized,
							press : common.ZNK_ApprovalLine.onSearch
						}).addStyleClass("L2PFontFamily")]
		});
		oRow.addCell(oCell);
		oDetail1.addRow(oRow);
				
		// 결재자 검색 테이블
		var oTable1 = new sap.ui.table.Table(oController.PAGEID + "_ApprovalTable1", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.Single,
			selectionBehavior : sap.ui.table.SelectionBehavior.RowOnly,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
		});
		oTable1.setModel(new sap.ui.model.json.JSONModel());
		
		var oHeaders = [
			"No.", 
			oBundleText.getText("LABEL_0038"), 	// 38:성명
			oBundleText.getText("LABEL_0039"), 	// 39:소속부서
			oBundleText.getText("LABEL_0770"), 	// 770:직급
			oBundleText.getText("LABEL_0770"), 	// 770:직급
			oBundleText.getText("LABEL_1007")	// 1007:직책
		];
		var oTypes = ["string", "string", "string", "string", "string", "string"];
		var oFields = ["Idx", "Ename", "Orgtx", "Zzjikgbt", "Zzjiktlt", "Zzjikcht"];
		var oSizes = ["50px", "", "120px", "", "80px", ""];
		var oAligns = ["Center", "Center", "Center", "Center", "Center", "Center"];
		common.ZNK_TABLES.autoColumn(oController,oTable1,oHeaders,oTypes,oFields,1,oSizes,oAligns);

		oTable1.setVisibleRowCount(7);
		
		var oMatrix1 = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			columns : 1
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [oTitle1],
			vAlign : "Top"
		});
		oRow.addCell(oCell);
		oMatrix1.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [oDetail1],
			vAlign : "Top"
		});
		oRow.addCell(oCell);
		oMatrix1.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [oTable1],
			vAlign : "Top"
		});
		oRow.addCell(oCell);
		oMatrix1.addRow(oRow);
		
		///////////////////// 발신라인 /////////////////////
		var oTitle2 = new sap.m.Toolbar({
			content : [new sap.m.ToolbarSpacer(),
					   new sap.m.Text({text : oBundleText.getText("LABEL_2756")}).addStyleClass("L2P15FontBold"),	// 2756:발신라인
					   new sap.m.ToolbarSpacer()]
		});
		
		var oTable2 = new sap.ui.table.Table(oController.PAGEID + "_ApprovalTable2", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			showNoData : true,
			selectionMode: sap.ui.table.SelectionMode.None,
			showOverlay : false,
			enableBusyIndicator : true,
			noData : "No data found"
		});
		oTable2.setModel(oController._ApprovalLineModel);
		
		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
			resizable : false,
        	vAlign : "Middle",
        	sortProperty : "",
//        	filtered : true,
        	autoResizable : true,
        	filterProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "50px",
			multiLabels : new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_2760"), textAlign : "Center"}).addStyleClass("L2PFontFamily"),	// 2760:이동
			template : [new sap.ui.core.Icon({
							size : "15px",
							src : "sap-icon://begin",
							press : common.ZNK_ApprovalLine.onAddLine,
							customData : [new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"})]
						})]
		});
		oTable2.addColumn(oColumn);
		
		var col_info1 = [
			{id: "Ename", label : oBundleText.getText("LABEL_0038"), plabel : "", span : 0, type : "string", sort : false, filter : false},	// 38:성명
			{id: "Orgtx", label : oBundleText.getText("LABEL_0039"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "120px"},	// 39:소속부서
			{id: "Zzjikgbt", label : oBundleText.getText("LABEL_0770"), plabel : "", span : 0, type : "string", sort : false, filter : false},	// 770:직급
			{id: "Zzjiktlt", label : oBundleText.getText("LABEL_0770"), plabel : "", span : 0, type : "string", sort : false, filter : false, width : "80px"},	// 770:직급
			{id: "Zzjikcht", label : oBundleText.getText("LABEL_1007"), plabel : "", span : 0, type : "string", sort : false, filter : false}	// 1007:직책
		];
		
		common.ZNK_TABLES.makeColumn(oController, oTable2, col_info1);

		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
			resizable : false,
        	vAlign : "Middle",
        	sortProperty : "",
//        	filtered : true,
        	autoResizable : true,
        	filterProperty : "",
        	resizable : true,
			showFilterMenuEntry : true,
			width : "50px",
			multiLabels : new sap.ui.commons.TextView({text : oBundleText.getText("LABEL_0033"), textAlign : "Center"}).addStyleClass("L2PFontFamily"),	// 33:삭제
			template : [new sap.ui.core.Icon({
							size : "15px",
							src : "sap-icon://delete",
							customData : [new sap.ui.core.CustomData({key : "Idx", value : "{Idx}"})],
							press : common.ZNK_ApprovalLine.onDeleteLine,
							visible : {
								path : "Pernr",
								formatter : function(fVal){
									if(fVal) return true;
									else return false;
								}
							}
						})]
		});
		oTable2.addColumn(oColumn);
		oTable2.setVisibleRowCount(9);
		
		var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			columns : 1
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [oTitle2]
		});
		oRow.addCell(oCell);
		oMatrix2.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [oTable2],
			vAlign : "Top"
		});
		oRow.addCell(oCell);
		oMatrix2.addRow(oRow);
		
		///////////////////////////////////////////////////////
		var oContent = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["50%", "5px", "50%"]
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "50px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({content : oNotice, colSpan : 3});
		oRow.addCell(oCell);
		oContent.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({content : [oMatrix1], vAlign : "Top"});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({content : [oMatrix2], vAlign : "Top"});
		oRow.addCell(oCell);
		oContent.addRow(oRow);
		
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_ApprovalDialog", {
			content :[oContent] ,
			contentWidth : "1100px",
//			contentHeight : vContentHeight + "px",
			showHeader : true,
			title : oBundleText.getText("LABEL_2764"),	// 2764:참조자 지정
			afterOpen : common.ZNK_ApprovalLine.onAfterOpen,
			beforeClose : common.ZNK_ApprovalLine.onBeforeClose,
			beginButton : new sap.m.Button({text : oBundleText.getText("LABEL_2097"),icon :"sap-icon://hr-approval", press : common.ZNK_ApprovalLine.onSaveApproval}),	// 2097:적용
			endButton : new sap.m.Button({
							text : oBundleText.getText("LABEL_0071"), icon :"sap-icon://decline", press : common.ZNK_ApprovalLine.onClose 	// 71:취소
//							press : function(oEvent){
//										oController._ApprovalLineModel.setData(null);
//										oDialog.close(); 
//									}
						}),
			draggable : true
		});
		
//		if (!jQuery.support.touch) {
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };	

		return oDialog;
	}

});
