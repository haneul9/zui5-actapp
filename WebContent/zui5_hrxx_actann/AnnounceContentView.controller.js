sap.ui.controller("zui5_hrxx_actann.AnnounceContentView", {
	
	PAGEID : "AnnounceContentView",
	
	_vAnnno : "",
	_vPersa : "",
	_vContext : null, 
	
	BusyDialog : null,

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actann.AnnounceContentView
*/
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		};
		
		this.getView().addEventDelegate({
	    	onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this)
		});
	},

	onBeforeShow: function(oEvent) {
		var oController = this;
		
		this._vAnnno = oEvent.data.Annno;
		this._vPersa = oEvent.data.Persa;
		this._vContext = oEvent.data.Context;
		
		var oTitle = sap.ui.getCore().byId(this.PAGEID + "_Title");
		var oOrgtx = sap.ui.getCore().byId(this.PAGEID + "_Orgtx");
		var oEname = sap.ui.getCore().byId(this.PAGEID + "_Ename");
		var oAnnda = sap.ui.getCore().byId(this.PAGEID + "_Annda");
		var oDatlo = sap.ui.getCore().byId(this.PAGEID + "_Datlo");
		
		var oAttachFileLink = sap.ui.getCore().byId(this.PAGEID + "_AttachFileLink");
		
		var mActionReqList = sap.ui.getCore().getModel("ActionReqList");		
		
		oTitle.setText(mActionReqList.getProperty(this._vContext + "/Title"));
		
		oOrgtx.setText(mActionReqList.getProperty(this._vContext + "/Orgtx"));
		oEname.setText(mActionReqList.getProperty(this._vContext + "/Ename"));
		
		oAnnda.setText(mActionReqList.getProperty(this._vContext + "/Adtim"));
		oDatlo.setText(mActionReqList.getProperty(this._vContext + "/Datim"));
		
		oAttachFileLink.setText(mActionReqList.getProperty(this._vContext + "/Fname"));
		oAttachFileLink.setHref(mActionReqList.getProperty(this._vContext + "/Uri"));
		
		var oHTMLEditor = sap.ui.getCore().byId(this.PAGEID + "_HTMLEditor");
		oHTMLEditor.destroyContent();
		
		try {
			var oHtml = new sap.ui.core.HTML({preferDOM : true});
			oHtml.setContent(mActionReqList.getProperty(oController._vContext + "/Htmlc"));
			oHTMLEditor.addContent(oHtml);
		} catch(ex) {
			//alert("게시내용을 가져오는 중에 오류가 발생했습니다.");
			console.log(ex);
		}
		 
	},
	
	/**
	 * 페이지가 Open후에 수행된다.
	 * 검색을 수행하는 Method를 호출한다.
	 * @param evt
	 */
	onAfterShow: function(evt) {
		
	},
	
	navToBack : function(oEvent){
		sap.ui.getCore().getEventBus().publish("nav", "back", {
		    });		
	},
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_actann.AnnounceContentView
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actann.AnnounceContentView
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actann.AnnounceContentView
*/
//	onExit: function() {
//
//	}

});