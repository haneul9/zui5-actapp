sap.ui.jsfragment("ZUI5_HR_MedicalHA.fragment.DetailInfoDialog", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		
		  var oMenuList = new sap.m.List({
	        	items: [
				   new sap.m.InputListItem({
						label : "진료시작일", 
						content :  new sap.m.DatePicker(oController.PAGEID + "_DetailInfoBegda",{
							valueFormat : "yyyy-MM-dd",
				            displayFormat : "yyyy.MM.dd",
				            width : "150px",
				            value : "{Begda}",
				            textAlign : sap.ui.core.TextAlign.Begin ,
							change : oController.onChangeDate
					   }).attachBrowserEvent("keydown", oController.onKeyUp1)
				       .addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PHeight40") ,
				   new sap.m.InputListItem({
						label : "진료종료일", 
						content :  new sap.m.DatePicker(oController.PAGEID + "_DetailInfoEndda",{
							valueFormat : "yyyy-MM-dd",
				            displayFormat : "yyyy.MM.dd",
				            width : "150px",
				            value : "{Endda}",
				            textAlign : sap.ui.core.TextAlign.Begin,
							change : oController.onChangeDate
					   }).attachBrowserEvent("keydown", oController.onKeyUp2)
					     .addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PHeight40"),
				   new sap.m.InputListItem({
						label : "병명", 
						content :  new sap.m.Input(oController.PAGEID + "_DetailInfoDisenm",{
							width : "450px",
							value : "{Disenm}",
							textAlign : sap.ui.core.TextAlign.End 
					   }).attachBrowserEvent("keydown", oController.onKeyUp3)
					     .addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PHeight40"),
				   new sap.m.InputListItem({
						label : "의료기관", 
						content :  new sap.m.Input(oController.PAGEID + "_DetailInfoMedorg",{
							width : "450px",
							value : "{Medorg}",
							textAlign : sap.ui.core.TextAlign.End
					   }).attachBrowserEvent("keydown", oController.onKeyUp4)
					     .addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PHeight40"),
				   new sap.m.InputListItem({
						label : "입원/외래", 
						content :  new sap.m.Select(oController.PAGEID + "_Detail_Foryn", {
							width : "150px",
							selectedKey : "{Foryn}",
							items : { path : "/MedicalMothodListSet",
									 template : new sap.ui.core.Item ({key : "{Foryn}", text : "{Foryntx}" 
									 })
							},
							textAlign : sap.ui.core.TextAlign.Begin
					   }).setModel(sap.ui.getCore().getModel("ZHR_MEDICAL_SRV"))
					   .attachBrowserEvent("keydown", oController.onKeyUp5)
					   .addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PHeight40"),
				   new sap.m.InputListItem({
						label : "영수증 구분", 
						content :  new sap.m.Select(oController.PAGEID + "_Detail_Recpgb", {
							width : "150px",
							selectedKey : "{Recpgb}",
							items : { path : "/MedicalReceiptListSet",
									 template : new sap.ui.core.Item ({key : "{Recpgb}", text : "{Recpgbtx}"})
							},
							textAlign : sap.ui.core.TextAlign.Begin
					   }).setModel(sap.ui.getCore().getModel("ZHR_MEDICAL_SRV"))
					   .attachBrowserEvent("keydown", oController.onKeyUp6)
					   .addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PHeight40"),
				   new sap.m.InputListItem({
						label : "납부금액", 
						content :  new sap.m.Input(oController.PAGEID + "_DetailInfoApamt",{
							width : "150px",
							value : "{Apamt}",
							editable : "{EnableYn}",
							textAlign : sap.ui.core.TextAlign.End
					   }).addStyleClass("L2PFontFamily Number")
					   .attachBrowserEvent("keydown", oController.onKeyUp7)
					}).addStyleClass("L2PHeight40"),
				   new sap.m.InputListItem({
						label : "지원금액", 
						content :  new sap.m.Input(oController.PAGEID + "_DetailInfoPyamt",{
							width : "150px",
							value : "{Pyamt}",
							editable : "{EnableYn}",
							textAlign : sap.ui.core.TextAlign.End
					   }).addStyleClass("L2PFontFamily Number")
					   .attachBrowserEvent("keydown", oController.onKeyUp8)
					}).addStyleClass("L2PHeight40"),
				  new sap.m.InputListItem({
						label : "추가증빙", 
						content :  new sap.m.CheckBox(oController.PAGEID + "_DetailInfoEviyn",{
							selected : "{EviynT}",
							editable : "{EnableYn}",
							textAlign : sap.ui.core.TextAlign.End
					   }).addStyleClass("L2PFontFamily")
					   .attachBrowserEvent("keydown", oController.onKeyUp9)
					}).addStyleClass("L2PHeight40"),
				  new sap.m.InputListItem({
						label : "비고", 
						content :  new sap.m.Input(oController.PAGEID + "_DetailInfoNotes",{
							width : "450px",
							value : "{Notes}",
							editable : "{EnableYn}",
							textAlign : sap.ui.core.TextAlign.End
					   }).addStyleClass("L2PFontFamily")
					}).addStyleClass("L2PHeight40"),
				]
			});

		var oCloseButton = new sap.m.Button({
			text : "취소",
			press : function(oEvent){
				oDialog.close();
			}
		});
		var oDialog = new sap.m.Dialog({
			content :[oMenuList] ,
			contentWidth : "700px",
//			contentHeight : "272px",
			showHeader : true,
			title : "의료비 상세내역",
			beginButton : new sap.m.Button({text : "저장", enabled : "{EnableYn}",  press : oController.onSaveDialog}), //
			endButton : oCloseButton,
			afterOpen : oController.afterOpenDetailInfoDial
		}).setModel(oController._DialogJsonModel)
		.bindElement("/Data");
		
//		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };
		

		return oDialog;
	}

});
