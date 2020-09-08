sap.ui.controller("ZUI5_HR_EmployeeList.ZUI5_HR_EmployeeList", {
	/**
	 * Is initially called once after the Controller has been
	 * instantiated. It is the place where the UI is
	 * constructed. Since the Controller is given to this
	 * method, its event handlers can be attached right away.
	 * 
	 * @memberOf ZUI5_HR_EmployeeList.ZUI5_HR_EmployeeList
	 */

	PAGEID : "ZUI5_HR_EmployeeList",
	ResultModel : new sap.ui.model.json.JSONModel(),
	BusyDialog : new sap.m.BusyDialog(),
	
	ErrorMessage : "",
	Error : "",
	onInit : function() {

		//if (!jQuery.support.touch) {
        this.getView().addStyleClass("sapUiSizeCompact");
		//};

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
	},

	onBeforeShow : function(oEvent) {
//		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
//		var curDate = new Date();
		var oController = this ;
		var oModel = sap.ui.getCore().getModel("ZHR_SINGLE_SRV");
		var Datas = { Data : [] };
		
		function Search() {
			var Datas = {Data : []};
			var vErrorMessage = ""; 
			oModel.read("PernrListSet?$filter=Zfkey eq '" + _pObjKey + "'", 
			    null, null, false, 
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							var OneData = data.results[i];
							Datas.Data.push(OneData);
						}
					}
				},
				function (oError) {
			    	var Err = {};
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						var msg1 = Err.error.innererror.errordetails;
						if(msg1 && msg1.length) vErrorMessage = Err.error.innererror.errordetails[0].message;
						else vErrorMessage = Err.error.message.value;
					} else {
						vErrorMessage = oError.toString();
					}
				}
			);
			oController.ResultModel.setData(Datas);
			if(vErrorMessage != ""){
				oController.BusyDialog.close();
//				new control.ZNK_SapBusy.oErrorMessage(vErrorMessage);
				return ;
			}
		}	
		
		oController.BusyDialog.open(); 
		setTimeout(Search, 100);
	},

	onAfterShow : function(oEvent) {

	},
	
	ExcelDownload : function(oEvent){
		
		
	},
});