jQuery.sap.require("common.ApHelpers");
jQuery.sap.require("common.ZNK_TABLES");
jQuery.sap.require("common.ZNK_SideLayout");
jQuery.sap.require("control.ODataFileUploader");
$.sap.require("control.ZNK_Title");
sap.ui.jsview("ZNK_WF_DUMMY.ZNK_WF_DUMMY", {

	/**
	 * Specifies the Controller belonging to this View. In the
	 * case that it is not implemented, or that "null" is
	 * returned, this View does not have a Controller.
	 * 
	 * @memberOf ZNK_WF_DUMMY.ZNK_WF_DUMMY
	 */
	getControllerName : function() {
		return "ZNK_WF_DUMMY.ZNK_WF_DUMMY";
	},

	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZNK_WF_DUMMY.ZNK_WF_DUMMY
	 */
	createContent : function(oController) {
		
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.Formatter");
		console.log("asdf");
		var oPage = new sap.m.Page({
			showHeader : false,
			content : [],
			footer : new sap.m.Bar({
				contentLeft : [ new sap.ui.core.HTML({
					content : "<span>&nbsp;</>"
				}) ]
			}).addStyleClass("L2PPageFooter")
		});

		return oPage;
	},
	
	loadModel : function() {
	},


});