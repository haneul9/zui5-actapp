sap.ui.jsfragment("ZUI5_HR_ApprovalBox.fragment.InputRjrsn", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	
	// 반려사유
	createContent : function(oController) {
		
		var oRjrsn = new sap.m.TextArea({
						width : "100%",
						value : "{Resn}",
						rows : 4,
						growing : true,
						maxLength : common.Common.getODataPropertyLength("ZHR_APPROVAL_SRV", "SaveApprLine", "Resn")
					 });
		
		////////////////////////////////////////////////////
		
//		var oJSONModel = new sap.ui.model.json.JSONModel();		
//		var beforeOpen = function(oEvent){
//			oJSONModel.setData({Data : {Resn : ""}});
//			oDialog.bindElement("/Data");
//		};
		
		////////////////////////////////////////////////////
		var oDialog = new sap.m.Dialog({
			contentWidth : "700px",
			draggable : false,
			content : [oRjrsn],
			title : oBundleText.getText("LABEL_1075"),	// 1075:반려사유
			beginButton : new sap.m.Button({text : oBundleText.getText("LABEL_0395"), type : "Default", icon : "sap-icon://save", press : function(oEvnet){	// 395:확인
				oController.onSave(oController, "R");}
			}),
			endButton : new sap.m.Button({
							text : oBundleText.getText("LABEL_0017"),  // 17:닫기
							type : "Default",
							icon: "sap-icon://decline", 
							press : function(oEvent){oDialog.close();}
						})			
		}).setModel(oController._ListCondJSonModel).bindElement("/Data");		
		
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		
		return oDialog;
	}
});
