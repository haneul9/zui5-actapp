sap.ui.jsview("ZNK_WF_PORTAL.ZNK_MAIN", {

	/**
	 * Specifies the Controller belonging to this View. In the case that it is
	 * not implemented, or that "null" is returned, this View does not have a
	 * Controller.
	 * 
	 * @memberOf ZNK_WF_PORTAL.ZNK_MAIN
	 */
	getControllerName : function() {
		return "ZNK_WF_PORTAL.ZNK_MAIN";
	},

	/**
	 * Is initially called once after the Controller has been instantiated. It
	 * is the place where the UI is constructed. Since the Controller is given
	 * to this method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZNK_WF_PORTAL.ZNK_MAIN
	 */
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.Formatter");
		var c = sap.ui.commons;
		var oRow, oCell;
		var oMatrix = new c.layout.MatrixLayout();
		oRow = new c.layout.MatrixLayoutRow(oController.PAGEID + "_Row");
		oCell = new c.layout.MatrixLayoutCell({
//			content : new sap.m.Image({src : "/sap/bc/ui5_ui5/sap/ZNK_COMMON_UI5/images/main.png"}), 
			hAlign : "Center",
			vAlign : "Middle"
		});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		return oMatrix;

	}

});