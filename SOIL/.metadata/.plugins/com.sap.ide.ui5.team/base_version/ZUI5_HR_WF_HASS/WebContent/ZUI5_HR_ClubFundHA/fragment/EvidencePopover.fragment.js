sap.ui.jsfragment("ZUI5_HR_ClubFundHA.fragment.EvidencePopover", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		
		var oTextArea = new sap.m.TextArea({
			width : "100%",
			value : "{Calcon}",
			rows : 5,
			editable : "{editable}"
		}).addStyleClass("L2PFontFamily");	
		
		var oPanel = new sap.m.Panel({
			width : "100%",
			content : [oTextArea]
		});
		
		/////////////////////////////////////////////////////////////////////////////////////////////////		
		
		var onClose = function(oEvent){
			var oneData = oJSONModel.getProperty("/Data");
			
			if(oneData.Calcon.trim() != ""){
				oController._DetailTableJSonModel.setProperty("/Data/" + oneData.Idx + "/Calcon", oneData.Calcon);
				oController._DetailTableJSonModel.setProperty("/Data/" + oneData.Idx + "/Calcontx", oneData.Calcon);
			} else {
				sap.m.MessageBox.alert("계산근거를 입력하여 주십시오.", {title : "오류"});
				return;
			}
			
			oPopover.close();
		};
		
		var oPopover = new sap.m.Popover(oController.PAGEID + "_EvidencePopover", {
			content :[oPanel] ,
			contentWidth : "500px",
			showHeader : false,
			title : "계산근거",
			placement : "Right",
			footer : new sap.m.Bar({
						contentRight : [new sap.m.Button({icon :"sap-icon://save", visible : "{editable}", text : "저장", type : "Default", press : onClose}),
										new sap.m.Button({icon :"sap-icon://decline", text : "닫기", type : "Default", press : function(oEvent){oPopover.close();}})]		
					 })
		});
		
		var oJSONModel = new sap.ui.model.json.JSONModel();
		
		oPopover.setModel(oJSONModel);
		oPopover.bindElement("/Data");
		
		oPopover.addStyleClass("sapUiSizeCompact");
		

		return oPopover;
	}

});
