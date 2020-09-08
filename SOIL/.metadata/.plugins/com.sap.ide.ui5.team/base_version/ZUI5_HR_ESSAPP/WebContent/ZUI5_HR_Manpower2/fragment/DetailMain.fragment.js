sap.ui.jsfragment("ZUI5_HR_Manpower2.fragment.DetailMain", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		
		var oRow, oCell;
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["10px", "", "5px"]
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"});
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "35px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();	
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [new sap.m.Toolbar({
							content : [ new sap.m.Text({text : oBundleText.getText("LABEL_0516")}).addStyleClass("L2PFontFamily"),	// 516:기준일자
										new sap.m.DatePicker({
											valueFormat : "yyyy-MM-dd",
								            displayFormat : "yyyy.MM.dd",
								            value : "{Begda}",
											textAlign : "Begin",
											change : oController.onChangeDate,
											width : "40%"
									   }).addStyleClass("L2P14Font"),
									   new sap.m.Button({
										   icon : "sap-icon://search",
										   text : oBundleText.getText("LABEL_0002"),
										   press : function(oEvent){
										   }
									   })]
						}).addStyleClass("L2PToolbarNoBottomLine")],
			hAlign : "Left",
			vAlign : "Top"
		});	
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({colSpan : 3}).addStyleClass("borderTop");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell();	
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : [new sap.tnt.NavigationList(oController.PAGEID + "_NavigationList", {
							width : "100%",
							items : [new sap.tnt.NavigationListItem(oController.PAGEID + "_Sgnty1", {
										text : oBundleText.getText("LABEL_2124"),	// 2124:조직별
										icon : "sap-icon://write-new",
										key : "1",
								     }),
								     new sap.tnt.NavigationListItem(oController.PAGEID + "_Sgnty2", {
										text : oBundleText.getText("LABEL_2178"),	// 2178:직급별
										icon : "sap-icon://complete",
										key : "2",
									 }),
								     new sap.tnt.NavigationListItem(oController.PAGEID + "_Sgnty3", {
										text : oBundleText.getText("LABEL_2191"),	// 2191:직책별
										icon : "sap-icon://complete",
										key : "3",
									 }),
								     new sap.tnt.NavigationListItem(oController.PAGEID + "_Sgnty4", {
										text : oBundleText.getText("LABEL_1944"),	// 1944:연령별
										icon : "sap-icon://decline",
										key : "4",
									 }),
								     new sap.tnt.NavigationListItem(oController.PAGEID + "_Sgnty5", {
										text : oBundleText.getText("LABEL_1564"),	// 1564:근속별
										icon : "sap-icon://cancel",
										key : "5",
									 })
							]
					   })],
			hAlign : "Center",
			vAlign : "Top"
		});	
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);		
		
		
		var oScrollContainer = new sap.m.ScrollContainer(oController.PAGEID + "_Detail1", {
			width : "100%",
			horizontal : false,
			vertical : true,
			height : (window.innerHeight - 117) + "px",
			content : [oMatrix]
		});
		
		return oScrollContainer;
		
	}
});
