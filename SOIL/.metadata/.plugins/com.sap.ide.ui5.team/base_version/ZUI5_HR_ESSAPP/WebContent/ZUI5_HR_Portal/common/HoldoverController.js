jQuery.sap.declare("ZUI5_HR_Portal.common.HoldoverController");

ZUI5_HR_Portal.common.HoldoverController = {
	/** 
	* @memberOf common.HoldoverController
	*/	
	checkHoldOver : function(oController){
		var oModel = sap.ui.getCore().getModel("ZHR_HRSCHEDULE_SRV");	
		var oView = oController.getView();
	//	 연차유급휴가 이월 사용동의서 체크 시작
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
		
		if(vDaysData.Data.Astat && vDaysData.Data.Astat == "5"){
			if(!oController._AgreementDialog) {
				if(vDaysData.Data.Docty == "A")
					oController._AgreementDialog = sap.ui.jsfragment("ZUI5_HR_Portal.fragment.Holdover", oController);
				else if(vDaysData.Data.Docty == "B")
					oController._AgreementDialog = sap.ui.jsfragment("ZUI5_HR_Portal.fragment.HoldoverReader", oController);
				
				oView.addDependent(oController._AgreementDialog);
			}
			
			vDaysData.Data.checkAll = false;
			
			var oDialog = sap.ui.getCore().byId(oController.PAGEID + "_HoldoverMatrix");
			oDialog.getModel().setData(vDaysData);
			
			oController._AgreementDialog.open();
		}
		
		// 개인정보 활용 동의서
		if(vDaysData.Data.Bstat && vDaysData.Data.Bstat == "5"){
			if(!oController._AgreementDialog2) {
				oController._AgreementDialog2 = sap.ui.jsfragment("ZUI5_HR_Portal.fragment.Privacy", oController);
				oView.addDependent(oController._AgreementDialog2);
			}
			
			delete vDaysData.Data.Zflag
			var oDialog = sap.ui.getCore().byId(oController.PAGEID + "_PrivacyMatrix");
			oDialog.getModel().setData(vDaysData);
			
			oController._AgreementDialog2.open();
		}
	},

	 onCheckBox : function(oEvent){
	   var vCheck = oEvent.getParameters().selected;
	   var oModel = oEvent.oSource.mBindingInfos.selected.binding.oModel;
	   var vData = oModel.getProperty("/Data");
	   
	   if(vCheck == true){
		   vData.Val1 = 0;
		   vData.Val2 = 0;
		   vData.Val3 = 0;
	   }else{
		   delete vData.Val1;
		   delete vData.Val2;
		   delete vData.Val3;
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
	   
	   if(vData.Docty == "B"){
		   if( vData.Val3 == null || vData.Val3 == undefined ){
			   sap.m.MessageBox.alert("동의여부를 선택하여 주시기 바랍니다.");
				return;
		   }
		   vCreateData.Chk03 = vData.Val3 == 0 ? "X" : "";
	   }else{
		   delete vData.Val3;
	   }
	   
	   
	   vCreateData.Chk01 = vData.Val1 == 0 ? "X" : "";
	   vCreateData.Chk02 = vData.Val2 == 0 ? "X" : "";
	   vCreateData.Astat = "9";
	   
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
   },
   
   onSavePrivacy : function(oEvent){
	   var oController = oEvent.oView.getController(),
		   oMatrix = sap.ui.getCore().byId(oController.PAGEID + "_PrivacyMatrix"),
		   vData = oMatrix.getModel().getProperty("/Data"),
		   vCreateData = {}, errData = {};
			
	   if(vData.PrivacyVal == null || vData.PrivacyVal == undefined ){
			sap.m.MessageBox.alert("동의여부를 선택하여 주시기 바랍니다.");
			return;
	   }
	   
	   if(vData.PrivacyVal == 0){
		   
	   }else{
		   jQuery.ajax({ 
				url: '/sap/public/bc/icf/logoff', 
				 async: false
				}).success(function(){ 
				}).complete(function(){ 
					window.open("/sap/public/bc/ui2/Custom/Logoff.html", "_self" );
				});
	   }
	   
	   vCreateData.Zflag = "X";
	   vCreateData.Bstat = "9";
	   
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
			sap.m.MessageBox.show("정상적으로 개인정보 활용  동의서를 제출하였습니다.", {
				onClose : function() {
					oController._AgreementDialog2.close();
				}
			})
		}
   },
	   
	   
	   
	   
	   
};
