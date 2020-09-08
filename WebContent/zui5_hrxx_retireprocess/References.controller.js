jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

sap.ui.controller("zui5_hrxx_retireprocess.References", {
	PAGEID : "References",
	_Bizty : "",
	_vPersa : "",

//	//Language 및 Properties를 가져온다.
//	oBundleText : jQuery.sap.resources({
//		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//		locale : sap.ui.getCore().getConfiguration().getLanguage()
//	}),

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_retireprocess.References
*/
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		};
		
		var oPersaModel = sap.ui.getCore().getModel("PersaModel");
		var vPersaData = oPersaModel.getProperty("/PersAreaListSet");

		var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
		
		try {
			for(var i=0; i<vPersaData.length; i++) {
				oPersa.addItem(
					new sap.ui.core.Item({
						key : vPersaData[i].Persa, 
						text : vPersaData[i].Pbtxt
					})
				);
			};
			oPersa.setSelectedKey(vPersaData[0].Persa);
			this._vPersa = vPersaData[0].Persa;
		} catch(ex) {
			common.Common.log(ex);
		}
		
	    this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),

		});  
	},
	
	onBeforeShow : function(oEvent) {
		this._Bizty = oEvent.data.Bizty;
		
//		var oPage = sap.ui.getCore().byId(this.PAGEID + "_PAGETITLE");
//		oPage.setText(oBundleText.getText("TITLE_RETIRE_REFERENCES" + this._Bizty));
		this.onSetControl(oEvent);
		this.onPressSearch(oEvent);
	}, 
	
	onSetControl : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.References");
		var oController = oView.getController();
		var oCommentPanel = sap.ui.getCore().byId(oController.PAGEID + "_COMMENT_PANEL");
		var oPage = sap.ui.getCore().byId(oController.PAGEID + "_PAGETITLE");
		if (oController._Bizty == "10"){
			oPage.setText(oBundleText.getText("TITLE_RETIRE_REFERENCE"));
			oCommentPanel.setVisible(false);
		}else{
			oPage.setText(oBundleText.getText("TITLE_RETIRE_REFERENCES" + oController._Bizty));
			oCommentPanel.setVisible(true);
		}
		
	},
	
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.References");
		var oController = oView.getController();
		
		if(oController._vPersa === "") return;
		
		var oTextArea = sap.ui.getCore().byId(oController.PAGEID + "_TEXTAREA");
		var oInput = sap.ui.getCore().byId(oController.PAGEID + "_INPUT");
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		oModel.read("/RetirementReferencesSet/?$filter=Persa eq '" + oController._vPersa + "' and Bizty eq '" + oController._Bizty + "'", 
				null, 
				null, 
				false, 
				function(oData, oResponse) {
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							//console.log(oData.results);
							oTextArea.setValue(oData.results[i].Refer);
							oInput.setValue(oData.results[i].Agrtx);
							break;
						}
					} else {
						oTextArea.setValue("");
						oInput.setValue("");
					}
				},
				function(oResponse) {
					console.log(oResponse);
				}
		);		
	},
	
	onChangePersa : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.References");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		oController._vPersa = oPersa.getSelectedKey();
		
		oController.onPressSearch(oEvent);
	},
	
	onSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.References");
		var oController = oView.getController();
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		var oTextArea = sap.ui.getCore().byId(oController.PAGEID + "_TEXTAREA");
		var oInput = sap.ui.getCore().byId(oController.PAGEID + "_INPUT");
		var process_result = false;
		var updateData = {};
		
		updateData.Persa = oController._vPersa;
		updateData.Bizty = oController._Bizty;
		updateData.Refer = oTextArea.getValue();
		updateData.Agrtx = oInput.getValue();
		
		oModel.update(
				"/RetirementReferencesSet(Persa='" + updateData.Persa + "',Bizty='" + updateData.Bizty + "')", 
				updateData,
				null,
			    function (oData, response) {
					process_result = true;
					common.Common.log("Sucess Update !!!");
			    },
			    function (oError) {
			    	var Err = {};
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
					} else {
						common.Common.showErrorMessage(oError);
					}
			    }
	    );
		
		if(process_result){
			 sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
					title: oBundleText.getText("MSG_TITLE_GUIDE"), 
					onClose : function() {
						oController.onPressSearch();
					}
		 	 });
		}
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_retireprocess.References
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_retireprocess.References
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_retireprocess.References
*/
//	onExit: function() {
//
//	}

});