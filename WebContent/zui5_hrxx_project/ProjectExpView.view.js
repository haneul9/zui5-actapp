sap.ui.jsview("zui5_hrxx_project.ProjectExpView", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf epmproductapp.CreateView
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_project.ProjectExpView";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf epmproductapp.CreateView
	*/ 
	createContent : function(oController) {
        var oCell = null, oRow = null;
        
        var oMatrix1 = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : true,
			columns : 4,
			widths : ["15%", "35%", "15%", "35%"]
		});
        
//        // 첫번째 Row
//        oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"}).addStyleClass("L2PMatrixRow L2PMatrixRowTop");
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Label({text: oBundleText.getText("PBTXT")}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			colSpan : 3,
//			content : new sap.m.Label(oController.PAGEID + "_Werks",{
//			}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
//		oRow.addCell(oCell);
//		
//		oMatrix1.addRow(oRow);
		
		// 두번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"}).addStyleClass("L2PMatrixRow L2PMatrixRowTop");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTNM")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Input(oController.PAGEID + "_POP_Pjtnm", {
				width : "100%",
				customData : [{key : "Pjtid", value : ""}, {key : "Werks", value : ""}],
				showValueHelp: true,
				valueHelpOnly: true,
				valueHelpRequest: oController.onSearchProject,
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTID")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label(oController.PAGEID + "_Pjtid", {
				width : "100%"
			})
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oMatrix1.addRow(oRow);
		
		// 세번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"}).addStyleClass("L2PMatrixRow");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("FROMTO")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Toolbar({
				width : "100%",
				design : sap.m.ToolbarDesign.Auto,
				content : [
				           new sap.m.Label(oController.PAGEID + "_Pjtbd", {
						   }).addStyleClass("L2P13Font"),
						   new sap.m.Label({text:"~", width:"20px", textAlign:"Center"}),
						   new sap.m.Label(oController.PAGEID + "_Pjted", {
						   }).addStyleClass("L2P13Font"),
						   new sap.m.ToolbarSpacer()
						   ]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({  //상세제품
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTPD")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label(oController.PAGEID + "_Pjtpd", {
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oMatrix1.addRow(oRow);

		// 네번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"}).addStyleClass("L2PMatrixRow");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({  //유형
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTTY")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label(oController.PAGEID + "_Pjtty", {
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2,
			content : []
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oMatrix1.addRow(oRow);
		
		// 다섯번째 Row
        oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ROW_05", {height:"42px"}).addStyleClass("L2PMatrixRow");
		
        oCell = new sap.ui.commons.layout.MatrixLayoutCell({  //사업유형
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("CTTYP4")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label(oController.PAGEID + "_Pjtct", {
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({  //국가
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("SLAND")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label(oController.PAGEID + "_Pjtcy", {
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oMatrix1.addRow(oRow);
		
		// 여섯번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ROW_06", {height:"42px"}).addStyleClass("L2PMatrixRow");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({  //규모(금액)
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTAM")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Toolbar({
				width : "100%",
				design : sap.m.ToolbarDesign.Auto,
				content : [
				           new sap.m.Label(oController.PAGEID + "_Pjtam", {
								textAlign : "Right"
						   }).addStyleClass("L2P13Font"),
						   new sap.m.Label(oController.PAGEID + "_Pjtck", {
						   }).addStyleClass("L2P13Font"),
						   new sap.m.ToolbarSpacer(),
						   ]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({  //고객
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTCU")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label(oController.PAGEID + "_Pjtcu", {
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oMatrix1.addRow(oRow);
		
		// 일곱번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ROW_07", {height:"42px"}).addStyleClass("L2PMatrixRow");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({ //규모(Size)
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTSZ")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Toolbar({
				width : "100%",
				design : sap.m.ToolbarDesign.Auto,
				content : [
				           new sap.m.Label(oController.PAGEID + "_Pjtsz", {
								textAlign : "Right"
						   }).addStyleClass("L2P13Font"),
						   new sap.m.Label(oController.PAGEID + "_Pjtun", {
						   }).addStyleClass("L2P13Font"),
						   new sap.m.ToolbarSpacer(),
						   ]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2,
			content : []
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oMatrix1.addRow(oRow);
		
		// 여덟번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_ROW_08", {height:"42px"}).addStyleClass("L2PMatrixRow");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({  //M&A 유형
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTMA")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label(oController.PAGEID + "_Pjtma", {}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({  //M&A 대상
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTMC")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label(oController.PAGEID + "_Pjtmc", {}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oMatrix1.addRow(oRow);
		
		// 아홉번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"80px"}).addStyleClass("L2PMatrixRow");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({  // 개요
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTDS")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 3,
			content : new sap.m.Text(oController.PAGEID + "_Pjtds", {
				width : "100%",
				editable : false,
				maxLength : 100
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);

		oMatrix1.addRow(oRow);
		
//		// 열번째 Row
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"}).addStyleClass("L2PMatrixRow");
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({  //등록요청대상자/요청일
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Label({text: oBundleText.getText("PJTRG") + " / " + oBundleText.getText("PJTRD")}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			colSpan : 3,
//			content : new sap.m.Label(oController.PAGEID + "_Unametx", {
//				width : "100%"
//			})
//		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
//		oRow.addCell(oCell);
//		
//		oMatrix1.addRow(oRow);
		
		var oPanel1 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : oBundleText.getText("PROJECT"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oMatrix1]
		});
		
//		var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
//			width : "100%",
//			layoutFixed : true,
//			columns : 4,
//			widths : ["15%", "35%", "15%", "35%"]
//		});
//        
//		// 첫번째 Row
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"}).addStyleClass("L2PMatrixRow L2PMatrixRowTop");
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Label({text: oBundleText.getText("PERNRTX")}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			colSpan : 3,
//			content : new sap.m.Label(oController.PAGEID + "_Pernrtx2", {
//			}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
//		oRow.addCell(oCell);
//		
//		oMatrix2.addRow(oRow);
//		
//		// 두번째 Row
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"}).addStyleClass("L2PMatrixRow");
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Label({text: oBundleText.getText("EXPDA")}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Toolbar({
//				width : "100%",
//				design : sap.m.ToolbarDesign.Auto,
//				content : [
//				           new sap.m.Label(oController.PAGEID + "_Obegda", {
//						   }).addStyleClass("L2P13Font"),
//						   new sap.m.Label({text:"~", width:"20px", textAlign:"Center"}),
//						   new sap.m.Label(oController.PAGEID + "_Oendda", {
//						   }).addStyleClass("L2P13Font"),
//						   new sap.m.ToolbarSpacer()
//						   ]
//			}).addStyleClass("L2PToolbarNoBottomLine")
//		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
//		oRow.addCell(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Label({text: oBundleText.getText("PJTAT")}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Label(oController.PAGEID + "_Opjtattx", {
//			}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
//		oRow.addCell(oCell);
//
//		oMatrix2.addRow(oRow);
//		
//		// 세번째 Row
//        oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"}).addStyleClass("L2PMatrixRow");
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Label({text: oBundleText.getText("PJTRL")+"1"}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Label(oController.PAGEID + "_Opjtr1tx", {
//			}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
//		oRow.addCell(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Label({text: oBundleText.getText("PJTRL")+"2"}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Label(oController.PAGEID + "_Opjtr2tx", {
//			}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
//		oRow.addCell(oCell);
//		
//		oMatrix2.addRow(oRow);
//		
//		// 네번째 Row
//        oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"}).addStyleClass("L2PMatrixRow");
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Label({text: oBundleText.getText("PJTRL")+"3"}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Label(oController.PAGEID + "_Opjtr3tx", {
//			}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
//		oRow.addCell(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Label({text: oBundleText.getText("PJTRL")+"4"}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Label(oController.PAGEID + "_Opjtr4tx", {
//			}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
//		oRow.addCell(oCell);
//		
//		oMatrix2.addRow(oRow);
//		
//		// 다섯번째 Row
//        oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"80px"}).addStyleClass("L2PMatrixRow");
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Label({text: oBundleText.getText("PJTRP")}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			colSpan : 3,
//			content : new sap.m.Text(oController.PAGEID + "_Opjtrp", {
//				width : "100%",
//				editable : false,
//				maxLength : 100
//			}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
//		oRow.addCell(oCell);
//		
//		oMatrix2.addRow(oRow);
//		
//		var oPanel2 = new sap.m.Panel(oController.PAGEID + "_Before_Panel", {
//			expandable : true,
//			expanded : false,
//			headerToolbar : new sap.m.Toolbar({
//				design : sap.m.ToolbarDesign.Auto,
//				content : [new sap.m.Label({text : oBundleText.getText("PROJECT_EXP_O"), design : "Bold"}).addStyleClass("L2P13Font")]
//			}).addStyleClass("L2PToolbarNoBottomLine"),
//			content : [oMatrix2]
//		});
		
		var oMatrix3 = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : true,
			columns : 4,
			widths : ["15%", "35%", "15%", "35%"]
		});
        
		// 첫번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"}).addStyleClass("L2PMatrixRow L2PMatrixRowTop");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PERNRTX")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 3,
			content : new sap.m.Toolbar({
				width : "100%",
				design : sap.m.ToolbarDesign.Auto,
				content : [
							new sap.m.Label(oController.PAGEID + "_Pernrtx3", {
								width : "80%",
								customData : {Key : "Pernr" , value : ""}
							}).addStyleClass("L2P13Font"),
							new sap.m.ToolbarSpacer(),
							new sap.m.Button(oController.PAGEID + "_BTN_Pernr", {
	            				text : oBundleText.getText("ENAME_3"), 
	            				width : "100px" , 
	            				press : oController.onEmployeeSearch 
							}).addStyleClass("L2PPaddingRight20").addStyleClass("L2P13Font")
						   ]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oMatrix3.addRow(oRow);
		
		// 두번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"}).addStyleClass("L2PMatrixRow");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("EXPDA")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Toolbar({
				width : "100%",
				design : sap.m.ToolbarDesign.Auto,
				content : [
				           new sap.m.DatePicker(oController.PAGEID + "_POP_Begda", {
								valueFormat : "yyyy-MM-dd",
					            displayFormat : gDtfmt,
								width : "40%",
								change : oController.onChangeValue
						   }).addStyleClass("L2P13Font"),
						   new sap.m.Label({text:"~", textAlign:"Center"}),
						   new sap.m.DatePicker(oController.PAGEID + "_POP_Endda", {
								valueFormat : "yyyy-MM-dd",
					            displayFormat : gDtfmt,
								width : "40%",
								change : oController.onChangeDate
						   }).addStyleClass("L2P13Font"),
						   new sap.m.CheckBox(oController.PAGEID + "_POP_Endda_Check", {
							   	text : oBundleText.getText("NOT_CONFIRMED"),
							   	select : oController.onChangeEnddaCheck
						   }).addStyleClass("L2P13Font")
						   ]
			}).addStyleClass("L2PToolbarNoBottomLine")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTAT")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Select(oController.PAGEID + "_POP_Pjtat", {
				width : "100%"
			}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"))
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oMatrix3.addRow(oRow);
		
		// 세번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"}).addStyleClass("L2PMatrixRow");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTRL")+"1"}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Select(oController.PAGEID + "_POP_Pjtr1", {
				width : "100%"
			}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"))
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_VIEW_Pjtr1", {
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTRL")+"2"}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_VIEW_Pjtr2", {
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Select(oController.PAGEID + "_POP_Pjtr2", {
				width : "100%"
			}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"))
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oMatrix3.addRow(oRow);
		
		// 네번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_VIEW_Pjtr3", {height:"42px"}).addStyleClass("L2PMatrixRow");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTRL")+"3"}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Select(oController.PAGEID + "_POP_Pjtr3", {
				width : "100%"
			}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"))
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTRL")+"4"}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Select(oController.PAGEID + "_POP_Pjtr4", {
				width : "100%"
			}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("EmpCodeList"))
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oMatrix3.addRow(oRow);
		
		// 다섯번째 Row
        oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"80px"}).addStyleClass("L2PMatrixRow");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTRP")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 3,
			content :  new sap.m.TextArea(oController.PAGEID + "_POP_Pjtrp", {
				width : "100%",
				rows : 3,
				maxLength : 60
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oMatrix3.addRow(oRow);
		
//		// 여섯번째 Row
//		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"}).addStyleClass("L2PMatrixRow");
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Label({text: oBundleText.getText("APRNR")}).addStyleClass("L2P13Font")
//		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			colSpan : 3,
//			content : new sap.m.Toolbar({
//				width : "100%",
//				design : sap.m.ToolbarDesign.Auto,
//				content : [
//							new sap.m.Label(oController.PAGEID + "_POP_Aprnrtx", {
//								width : "80%",
//								customData : {Key : "Aprnr" , value : ""}
//							}).addStyleClass("L2P13Font"),
//							new sap.m.ToolbarSpacer(),
//							new sap.m.Button({
//	            				text : oBundleText.getText("CHANGE_BTN"), 
//	            				width : "100px" , 
//	            				press : oController.onEmployeeSearch 
//							}).addStyleClass("L2PPaddingRight20").addStyleClass("L2P13Font")
//						   ]
//			}).addStyleClass("L2PToolbarNoBottomLine")
//		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
//		oRow.addCell(oCell);
//		
////		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
////			hAlign : sap.ui.commons.layout.HAlign.Begin,
////			vAlign : sap.ui.commons.layout.VAlign.Middle,
////			content : new sap.m.Label({text: oBundleText.getText("APRDA")}).addStyleClass("L2P13Font")
////		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
////		oRow.addCell(oCell);
////		
////		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
////			hAlign : sap.ui.commons.layout.HAlign.Begin,
////			vAlign : sap.ui.commons.layout.VAlign.Middle,
////			content : new sap.m.Label(oController.PAGEID + "_Aprda", {
////			}).addStyleClass("L2P13Font")
////		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
////		oRow.addCell(oCell);
//		
//		oMatrix3.addRow(oRow);
		
		var oPanel3 = new sap.m.Panel({
			expandable : true,
			expanded :true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : oBundleText.getText("PROJECT_EXP"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oMatrix3]
		});
		
		var oMatrix4 = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : true,
			columns : 4,
			widths : ["15%", "35%", "15%", "35%"]
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"80px"}).addStyleClass("L2PMatrixRow L2PMatrixRowTop");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("ASTAT")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({ 
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label(oController.PAGEID + "_Aprsttx", {
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("REASON")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Text(oController.PAGEID + "_Aprrj", {
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oMatrix4.addRow(oRow);
		
		var oPanel4 = new sap.m.Panel(oController.PAGEID + "_ASTAT", {
			expandable : false,
			expanded :false,
			content : [oMatrix4]
		});
	
		var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
			contentRight : [
//			                new sap.m.Button(oController.PAGEID + "_AppBtn", {
//								 text : oBundleText.getText( "APPROVAL_BTN"),
//								 press : oController.onApproval,
//								 visible : false
//				            }),
//				            new sap.m.Button(oController.PAGEID + "_RejBtn", {
//								 text : oBundleText.getText( "REJECT_BTN"),
//								 press : oController.onReject,
//								 visible : false
//				            }),
				            new sap.m.Button(oController.PAGEID + "_POP_SAVE",{
								text : oBundleText.getText("SAVE_BTN"), 
								width : "100px" ,
	            				press : oController.onPressSave ,  
	            				customData : [{Key : "Mode" , value : ""}, {Key : "Regno" , value : ""}] 
							}),
//				            new sap.m.Button({
//				            				text : oBundleText.getText("CANCEL_BTN"), 
//				            				width : "100px" , 
//				            				press : oController.navToBack 
//				            }).addStyleClass("L2PPaddingRight20")
							]
		});
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : new sap.ui.commons.layout.VerticalLayout({
				width : "100%",
				content : [ oPanel1,
				            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
//				            oPanel2,
//				            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
				            oPanel3,
				            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
				            oPanel4
				           ]
			}),
			customHeader : new sap.m.Bar({
								contentLeft : new sap.m.Button({
												icon : "sap-icon://nav-back" ,
												press: oController.navToBack
											}),
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText("TITLE_PROJECT_EXP")
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeaderBar") ,
			footer : oFooterBar 
		}) ;
		
		return oPage ;
	
	}
});