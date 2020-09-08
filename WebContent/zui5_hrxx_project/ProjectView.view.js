sap.ui.jsview("zui5_hrxx_project.ProjectView", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf epmproductapp.CreateView
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_project.ProjectView";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf epmproductapp.CreateView
	*/ 
	createContent : function(oController) {
		//Language 및 Properties를 가져온다.
//		var locale = sap.ui.getCore().getConfiguration().getLanguage(); //언어
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : locale
//        });
        
        var oCell = null, oRow = null;
        
        var oMatrix = new sap.ui.commons.layout.MatrixLayout({
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
			content : new sap.m.Label({text: oBundleText.getText("PBTXT")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 3,
			content : new sap.m.Label(oController.PAGEID + "_Werks",{
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oMatrix.addRow(oRow);
		
		// 두번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"}).addStyleClass("L2PMatrixRow");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTNM")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label(oController.PAGEID + "_Pjtnm", {
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
		
		oMatrix.addRow(oRow);
		
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
		
		oMatrix.addRow(oRow);

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
		
		oMatrix.addRow(oRow);
		
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
		
		oMatrix.addRow(oRow);
		
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
		
		oMatrix.addRow(oRow);
		
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
		
		oMatrix.addRow(oRow);
		
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
		
		oMatrix.addRow(oRow);
		
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

		oMatrix.addRow(oRow);
		
		// 열번째 Row
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"}).addStyleClass("L2PMatrixRow");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({  //등록요청대상자/요청일
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text: oBundleText.getText("PJTRG") + " / " + oBundleText.getText("PJTRD")}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 3,
			content : new sap.m.Label(oController.PAGEID + "_Unametx", {
				width : "100%"
			})
		}).addStyleClass("L2PMatrixData L2PPaddingLeft10 L2PPaddingRight30");
		oRow.addCell(oCell);
		
		oMatrix.addRow(oRow);
		
		var oPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : oBundleText.getText("PROJECT"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oMatrix]
		});
	
		var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
			contentRight : []
		});
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oPanel],
			customHeader : new sap.m.Bar({
								contentLeft : new sap.m.Button({
												icon : "sap-icon://nav-back" ,
												press: oController.navToBack
											}),
								contentMiddle : new sap.m.Text({
									   			text : oBundleText.getText("TITLE_PROJECT_CREATE")
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