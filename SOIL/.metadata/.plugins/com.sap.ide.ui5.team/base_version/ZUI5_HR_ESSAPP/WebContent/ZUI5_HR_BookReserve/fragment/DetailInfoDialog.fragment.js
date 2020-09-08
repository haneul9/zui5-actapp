sap.ui.jsfragment("ZUI5_HR_BookRental.fragment.DetailInfoDialog", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		
		var oCloseButton = new sap.m.Button({
			text : oBundleText.getText("LABEL_0017"), // 17:닫기
			press : function(oEvent){
				oDialog.close();
			}
		});
		
		var oContent = new sap.ui.layout.VerticalLayout({
			content:[
				   new sap.m.MessageStrip({
			    	   text : "{text1}",
		        	   type : "Success",
					   showIcon : false ,
					   customIcon : "sap-icon://message-information", 
					   showCloseButton : false,
		       }),
		       new sap.ui.core.HTML({content : "<div style='height : 10px;'/>", visible: "{button_visible}"}),
			   new sap.m.MessageStrip({
		    	   text : "{text2}",
	        	   type : "Information",
				   showIcon : false ,
				   customIcon : "sap-icon://circle-task", 
				   showCloseButton : false,
				   visible: "{button_visible}"
	       }),
	       new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
		   new sap.m.MessageStrip({
	    	   text : "{text3}",
        	   type : "Information",
			   showIcon : false ,
			   customIcon : "sap-icon://circle-task", 
			   showCloseButton : false,
       })		       
			]
		});
		
		var oDialog = new sap.m.Dialog({
			content :[oContent] ,
			//contentWidth : "700px",
			showHeader : true,
			title : oBundleText.getText("LABEL_1698"),	// 1698:도서 대출 예약
			buttons: [
				new sap.m.Button({
					text : oBundleText.getText("LABEL_2309"), 	// 2309:행랑대출
					visible:"{button_visible}", 
					press : oController.onSaveType10, 
					customData : new sap.ui.core.CustomData({key : "Path", value : "{sPath}"}),
				}),
				
				new sap.m.Button({
					text : oBundleText.getText("LABEL_1700"), 	// 1700:도서관 방문
					press : oController.onSaveType20, 
					customData : new sap.ui.core.CustomData({key : "Path", value : "{sPath}"}),
				}),
				
				oCloseButton
			]
		}).setModel(oController._DialogJsonModel).bindElement("/Data");
		
//		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };
		

		return oDialog;
	}

});
