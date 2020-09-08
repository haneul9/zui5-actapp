sap.ui.controller("zui5_hrxx_actann.AnnounceDetail", {
	
	PAGEID : "AnnounceDetail",
	
	_vReqno : "",
	_vDocno : "",	

	/**
	 * 페이지를 초기화한다.
	 * 페이지가 Open 하기전에 수행할 Method를 정의한다.
	 * @memberOf zui5_hrxx_actann.AnnounceDetail
	 */
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		};		
		
	    this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this)
		});
	},
	
	/**
	 * 페이지가 Open 하기전에 수행한다.
	 * 발령게시 HTML를 가져와서 화면에 설정한다.(ActionPostHtmlSet)
	 * @param oEvent
	 */
	onBeforeShow: function(oEvent) {
		
		if(oEvent) {
			this._vReqno = oEvent.data.Reqno;
			this._vDocno = oEvent.data.Docno;
		}
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var oPanel = sap.ui.getCore().byId(this.PAGEID + "_Panel");
		var oHtml = new sap.ui.core.HTML({preferDOM : true, sanitizeContent : false}).addStyleClass("L2PBackgroundWhite");
		
		oPanel.removeAllContent();
		oPanel.destroyContent();
		
		var vAttyn = "";
		
		try {
			oModel.read("/ActionPostHtmlSet(Docno='" + this._vDocno + "',Attyn='" + vAttyn + "',Actty='S2')", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData) {
							oHtml.setContent(oData.Htmlc);
							oHtml.addStyleClass("L2PBackgroundWhite");
						}
					},
					function(oResponse) {
						oHtml.setContent("<div><h3 style='color:darkred'>" + oBundleText.getText("MSG_FAIL_HTMLFILE") + "</h3></div>");
						common.Common.log(oResponse);
					}
			);
		} catch(ex) {
			common.Common.log(ex);
		}
		oPanel.addContent(oHtml);
	},
	
	/**
	 * 리스트 페이지로 이동한다.
	 * @param oEvent
	 */
	navToBack : function(oEvent) {
		sap.ui.getCore().getEventBus().publish("nav", "back", {
	    });
	},
	
	/**
	 * 게시 HTML를 출력한다.
	 * @param oEvent
	 */
	onPressPrint : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actann.AnnounceDetail");
		var oController = oView.getController();
		
		var newwindow = window.open("Print.html?Docno=" + oController._vDocno, 'PrintDoc', 'height=500,width=750');
		if(window.focus) { newwindow.focus(); }
	}

});