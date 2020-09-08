jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

sap.ui.controller("zui5_hrxx_actcertisupport.SelectPerson", {
	PAGEID : "SelectPerson",
	
	BusyDialog : null,
	
	oBundleText : jQuery.sap.resources({
		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
		locale : sap.ui.getCore().getConfiguration().getLanguage()
	}),
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf epmproductapp.EPMProductApp
*/
	onInit: function() {
		//if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		//};
		
		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow  : jQuery.proxy(function (evt) {
			}, this),
		});
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf epmproductapp.EPMProductApp
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf epmproductapp.EPMProductApp
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf epmproductapp.EPMProductApp
*/
//	onExit: function() {
//
//	}
	
	
	/*
	 * 페이지가 표시되기전에 수행한다.
	 * 바인딩 전에 안내메세지 출력 후 바인딩이 완료되면 메세지 창을 닫는다.
	 */
	onBeforeShow: function(oEvent) {
		var oController = this ;
		var oEmpInfoModel = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpInfoData = oEmpInfoModel.getProperty("/EmpLoginInfoSet");
		var vPersa = "";
		var oAinct = sap.ui.getCore().byId( oController.PAGEID + "_AINCT_COLUMN");
		
		if(vEmpInfoData.length > 0) {
			vPersa  =  vEmpInfoData[0].Persa;
		}else{
			return ;
		}
		
		if(vPersa == "7700"){
			oAinct.setVisible(true);
		}else{
			oAinct.setVisible(false);
		}
		this.onPressSearch();
	},

	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcertisupport.SelectPerson");
		var oController = oView.getController();
		
		if(!oController.BusyDialog) {			
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCHING")}));
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCHING")}));
		} 
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
			
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
		var aFilters = [];
		var oFilter = new sap.ui.model.Filter("Actty", "EQ", "R");
		aFilters.push(oFilter);
		oTable.setModel(sap.ui.getCore().getModel("ZHRXX_CERTI_SRV"));
		oTable.bindItems("/CertiFeeSet", oColumnList , null , aFilters);
		
		oTable.attachUpdateFinished(function() {
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
		});
	},
	
	onPressSelect : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcertisupport.SelectPerson");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		
		if(vContexts.length < 1){
			common.Common.showErrorMessage(oBundleText.getText( "MSG_SELECT_PERSON"));
			return ;
		}
		// 지원대상자 Json Model에 Data 추가
		var mCertiFee = sap.ui.getCore().getModel("CertiFee");
		var vCertiFee = mCertiFee.getProperty("/CertiFeeSet");
		var result = {};
		var vAppno = "";
		var vContinue = false ;
		
		for(var i=0; i<vContexts.length ; i++){
			result = {};
			vContinue = false ;
			vAppno = vContexts[i].getProperty("Appno");
			// 추가 지원대상자가 이미 Json 에 추가가 되어 있는지 여부 파악.
			for(var j=0; j <vCertiFee.length ; j++){
				if(vAppno == vCertiFee[j].Appno){
					vContinue = true ;
					break;
				}
			}
			if(vContinue == true){
				continue ; 
			}
			result.Appno = vContexts[i].getProperty("Appno");
			result.Cttyptx = vContexts[i].getProperty("Cttyptx");
			result.Ctnum = vContexts[i].getProperty("Ctnum");
			result.Isaut = vContexts[i].getProperty("Isaut");
			result.Ctbeg = vContexts[i].getProperty("Ctbeg");
			result.Ctend = vContexts[i].getProperty("Ctend");
			result.Ctfeetx = vContexts[i].getProperty("Ctfeetx");
			result.Ctcfetx = vContexts[i].getProperty("Ctcfetx");
			result.Aincttx = vContexts[i].getProperty("Aincttx");
			result.Ctfee = vContexts[i].getProperty("Ctfee");
			result.Ctcfe = vContexts[i].getProperty("Ctcfe");
			result.Ainct = vContexts[i].getProperty("Ainct");
			result.Rorgt = vContexts[i].getProperty("Rorgt");
			result.Rpers = vContexts[i].getProperty("Rpers");
			result.Rpern = vContexts[i].getProperty("Rpern");
			vCertiFee.push(result);
		}
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actcertisupport.RequestManagement",
		      data : {
		    	  FromPageType : "S"
		      }
		});
		
	},
	
	navToBack : function(oEvent) {
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			  id : "zui5_hrxx_actcertisupport.RequestManagement",
		      data : {
		    	  context : "",
		    	  FromPageType : "S"
		      }
		});
	},
	
	onSelectRow : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcertisupport.SelectPerson");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oContext = oEvent.getSource().getBindingContext() ;
		var vContext = {};
		    vContext =  oTable.getModel().getProperty(oContext.sPath);
		
		if(vContext == null || vContext == {}){
			return ;
		}
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_certi_support.CertiSupportRequest",
		      data : {
		    	  Contexts : vContext,
		    	  Appno : vContext.Appno,
		    	  FromPageId : "zui5_hrxx_actcertisupport.SelectPerson"
		      }
		});
	},
});