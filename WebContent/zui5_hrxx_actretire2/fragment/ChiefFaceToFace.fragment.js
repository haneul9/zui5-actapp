sap.ui.jsfragment("zui5_hrxx_actretire2.fragment.ChiefFaceToFace", {
	
	createContent : function(oController) {
		
		var oCell = null, oRow = null;
		
		var oChiefNoteLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ENAME")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Text(oController.PAGEID + "_Tlpnm", {value : ""}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("STEXT")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Text(oController.PAGEID + "_Tlfulln", {value : ""}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oChiefNoteLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("RETIRE_NOTE")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 3,
			content : [new sap.m.Text(oController.PAGEID + "_Intv1", {value : ""}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oChiefNoteLayout.addRow(oRow);	
		
		var oRetireOptionPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://comment", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("PANEL_RETIRE_NOTE"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oChiefNoteLayout]
		});
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_ChiefFaceToFace_LAYOUT",  {
			width : "100%",
			content : [ oRetireOptionPanel ]
		});

		return oLayout;
	}

});