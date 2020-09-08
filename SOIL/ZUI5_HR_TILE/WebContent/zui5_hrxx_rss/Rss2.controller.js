//sap.ui.controller("zui5_hrxx_rss.Rss", {
//
///**
//* Called when a controller is instantiated and its View controls (if available) are already created.
//* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
//* @memberOf zui5_hrxx_rss.Rss
//*/
////	onInit: function() {
////
////	},
//
///**
//* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
//* (NOT before the first rendering! onInit() is used for that one!).
//* @memberOf zui5_hrxx_rss.Rss
//*/
////	onBeforeRendering: function() {
////
////	},
//
///**
//* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
//* This hook is the same one that SAPUI5 controls get after being rendered.
//* @memberOf zui5_hrxx_rss.Rss
//*/
////	onAfterRendering: function() {
////
////	},
//
///**
//* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
//* @memberOf zui5_hrxx_rss.Rss
//*/
////	onExit: function() {
////
////	}
//	
//	onPress : function(oEvent){
//		alert("AAAA");
//	}
//
//});

sap.ui.define([
               "sap/ui/core/mvc/Controller"
             ], function(Controller) {
			   
	           "use strict";
               return Controller.extend("zui5_hrxx_rss.Rss", {
            	   PAGEID : "zui5_hrxx_rss",
            	   
            	   onPress : function(oController, oEvent){
            		   var oView = oController.getView();
            		   
            		   if(oEvent.getSource().getCustomData()){
            			   var vZyear = oEvent.getSource().getCustomData()[0].getValue();
            			   var vSchno = oEvent.getSource().getCustomData()[1].getValue();
            			   
            			   oController.openNoticeDetail(oController, vZyear, vSchno);
            		   }
            		   
            	   },
            	   
            	   openNoticeDetail : function(oController, vZyear, vSchno){
            		   if(!oController || !vZyear || !vSchno) return;
            		   
            		   var oView = oController.getView();
            		   
            		   if(!oController._NoticeDialog) {
	           				oController._NoticeDialog = sap.ui.jsfragment("zui5_hrxx_rss.fragment.NoticeDetail", oController);
	           				oView.addDependent(oController._NoticeDialog);
	           		   }
           			
            		   if(oController._NoticeDialog.isOpen() == false){
            			   var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oController._Dtfmt});
            			   var oJSONModel = oController._NoticeDialog.getModel();
           				   var vData = {data : []};

                		   var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRXX_HRNOTICE_SRV/", true, undefined, undefined,
    								{"Cache-Control": "max-age=0"}, undefined, undefined, true);

                		   oModel.read("/NoticeApplySet?$filter=Zyear eq '" + vZyear + "' and Notno eq '" + vSchno + "'", null, null, false,
    							function(data, Res) {					
    								if(data && data.results.length) {
    									for(var i=0; i<data.results.length; i++){
    										
    										data.results[i].date = dateFormat.format(data.results[i].Notbd) + " ~ " + dateFormat.format(data.results[i].Noted);
    										
    										vData.data.push(data.results[i]);
    									}
    								}
    							}, function(Res) {
    								if(Res.response.body){
    									var ErrorMessage = Res.response.body;
        								var ErrorJSON = JSON.parse(ErrorMessage);
        								oController.Error = "E"; 
        								if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
        									oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
        								}else{
        									oController.ErrorMessage = ErrorMessage ;
        								}
    								}
    							}
    						);
                		   
                		   	oJSONModel.setData(vData);

	           				if(oController.Error == "E"){
	           					oController.Error = "";
	           					sap.m.MessageBox.error(oController.ErrorMessage);
	           					return;
	           				}
           				
	           				oController._NoticeDialog.open();
            		   }            		   
            		   
            	   },
               
               });
             });