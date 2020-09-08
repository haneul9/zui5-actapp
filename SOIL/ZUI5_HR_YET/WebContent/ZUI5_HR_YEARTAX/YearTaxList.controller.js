sap.ui.controller("ZUI5_HR_YEARTAX.YearTaxList", {
	PAGEID : "YearTaxList",

	_vPersa : "",
	_vPernr : "",
	_SortDialog : null,
	_Actty : "E" ,  //ESS 에서 호출
	
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	_ListJSonModel : new sap.ui.model.json.JSONModel(),
	
	_BusyDialog : new sap.m.BusyDialog(),
	BusyDialog : new sap.m.BusyDialog(),
	
	_Columns : [],
	_vFromPageId : "",
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf epmproductapp.EPMProductApp
*/
	onInit: function() {
		//if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		//};
		
//		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
//		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
					    
		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this)
		});

		this.getView().addEventDelegate({
			onAfterShow : jQuery.proxy(function(evt) {
				this.onAfterShow(evt);
			}, this),
		});

//		var bus = sap.ui.getCore().getEventBus();
//		bus.subscribe("app", "OpenWindow", this.SmartSizing,
//				this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing, this);
		
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
	
	SmartSizing : function(){
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxList");
		var oController = oView.getController();

	},	
	
	onBeforeShow: function(oEvent) {
		var oController = this;
		
		oController.onPressSearch(oEvent);
	},
	
	onAfterShow : function(evt){
		var oController = this;
	},	
	
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("ZUI5_HR_YEARTAX.YearTaxList");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHR_YEARTAX_SRV");
		var oPath = "/DataProgress?$filter=Zyear eq '2019'";
		var vData = {Data : {Msg : ""}};
		
		oModel.read(oPath, null, null, false,
				function(data, oResponse) {
					if(data && data.results.length) {
						if(data.results[0].Msg == ""){
							
							sap.ui.getCore().getEventBus().publish("nav", "to", {
								id : "ZUI5_HR_YEARTAX.YearTaxDetail",
							    data : {
							    	Encid : data.results[0].Encid,
							    	Pernr : data.results[0].Pernr,
							    	Zyear : data.results[0].Zyear,
							    	Pystat : data.results[0].Pystat,
							    	Yestat : data.results[0].Yestat
							    }
							});
							
						} else {
							vData.Data.Msg = data.results[0].Msg;
						}			
					}
				},
				function(Res) {
					oController.Error = "E";
					if(Res.response.body){
						ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						} else {
							oController.ErrorMessage = ErrorMessage;
						}
					}
				}
		);
		
		oController._ListCondJSonModel.setData(vData);
				
		if(oController.Error == "E"){
			oController.Error = "";
			sap.m.MessageBox.error(oController.ErrorMessage);
		}
		
	},
	
});