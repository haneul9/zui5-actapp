sap.ui.define([
               "sap/ui/core/mvc/Controller"
             ], function(Controller) {
			   
	           "use strict";
               return Controller.extend("zui5_hrxx_rss.Rss", {
            	   PAGEID : "zui5_hrxx_rss",
            	   
            	   onAfterRendering: function() {
            		    var oView = this.getView();
         			    var oController = this.getView().getController() ;
            			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_HRSCHEDULE_SRV/", true, undefined, undefined,
									{"Cache-Control": "max-age=0"}, undefined, undefined, true);
//						 연차유급휴가 이월 사용동의서 체크 시작
						var vDaysData = {Data : {}}, errData = {};
						oModel.read("/AgreeToCarryForwardSet", {
							async : false,
							filters : [
							],
							success : function(data, res) {
								if(data.results && data.results.length > 0){
									vDaysData.Data = data.results[0];
								}
							},
							error : function(Res) {
								errData = common.Common.parseError(Res);
							}
						});
						
						if(errData.Error && errData.Error == "E"){
								sap.m.MessageBox.alert(errData.ErrorMessage, {
								onClose : function() {
								
								}
							});
						}
						
						if(vDaysData.Data.Astat || vDaysData.Data.Astat == "5"){
//							oController.openAgreement(oController, vDaysData);
	            			if(!oController._AgreementDialog) {
		       					oController._AgreementDialog = sap.ui.jsfragment("zui5_hrxx_rss.fragment.Holdover", oController);
		       					oView.addDependent(oController._AgreementDialog);
		       				}
	            			
	            			vDaysData.Data.checkAll = false;
	            			
	            			var oDialog = sap.ui.getCore().byId(oController.PAGEID + "_HoldoverMatrix");
	            			oDialog.getModel().setData(vDaysData);
	            			
	            			oController._AgreementDialog.open();
						}
            		   
            	   },
            	   
            	   onCheckBox : function(oEvent){
            		   var vCheck = oEvent.getParameters().selected;
            		   var oModel = oEvent.oSource.mBindingInfos.selected.binding.oModel;
            		   var vData = oModel.getProperty("/Data");
            		   
            		   if(vCheck == true){
            			   vData.Val1 = 0;
            			   vData.Val2 = 0;
            		   }else{
            			   delete vData.Val1;
            			   delete vData.Val2;
            		   }
            		   
            		   oModel.setData({ Data : vData});
            	   },
            	   
            	   onSave : function(oEvent){
            		   var oController = oEvent.oView.getController(),
	            		   oMatrix = sap.ui.getCore().byId(oController.PAGEID + "_HoldoverMatrix"),
	            		   vData = oMatrix.getModel().getProperty("/Data"),
	            		   vCreateData = {}, errData = {};
	            			
            		   if(vData.Val1 == null || vData.Val1 == undefined ||
        				  vData.Val2 == null || vData.Val2 == undefined  ){
							sap.m.MessageBox.alert("동의여부를 선택하여 주시기 바랍니다.");
							return;
            		   }
            		   
            		   vCreateData.Chk01 = vData.Val1 == 0 ? "X" : "";
            		   vCreateData.Chk02 = vData.Val2 == 0 ? "X" : "";
            		   vCreateData.Astat = "5";
            		   
            		   var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_HRSCHEDULE_SRV/", true, undefined, undefined,
									{"Cache-Control": "max-age=0"}, undefined, undefined, true);
            			
            		   oModel.create("/AgreeToCarryForwardSet", vCreateData, {
	          				success: function(data,res) {
	          				
	          				},
	          				error: function (Res) {
	          					var errorJSON = null;
	          					
	          					try {
	          						errorJSON = JSON.parse(Res.response.body);
	          						
	          						if(errorJSON.error.innererror.errordetails && errorJSON.error.innererror.errordetails.length) {
	          							errData.ErrorMessage = errorJSON.error.innererror.errordetails[0].message;
	          						} else if(errorJSON.error.message) {
	          								errData.ErrorMessage = errorJSON.error.message.value;
	          						} else {
	          							errData.ErrorMessage = "Error 발생." ;
	          						}
	          					} catch(ex) {
	          						errData.ErrorMessage = Res.message;
	          					}
	          				}
	          			});
          			
	          			if(errData.Error && errData.Error == 'E'){
	          				sap.m.MessageBox.alert(errData.ErrorMessage);
	          			}else{
	          				sap.m.MessageBox.show("정상적으로 연차유급휴가 이월 사용동의서를 제출하였습니다.", {
	          					onClose : function() {
	          						oController._AgreementDialog.close();
	          					}
	          				})
	          			}
	          	   },
            	   
            	   onClose : function(oEvent){
               		   var oController = oEvent.oView.getController();
               		   oController._AgreementDialog.close();
            	   }
            	    
               });
             });