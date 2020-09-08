sap.ui.jsfragment("fragment.BusinessTripCheck", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.EmployeeSearch
	*/
	
	createContent : function(oController) {
//		var oHtmlText = '<span style="font-size: 14px; color: #666666; font-family: Noto Sans CJK KR Regular, sans-serif;"'+ oBundleText.getText("LABEL_2772") + '/span>' +
//			        '<span style="font-size: 14px; color: red; font-family: Noto Sans CJK KR Regular, sans-serif;"'+ oBundleText.getText("LABEL_2883") + '/span>' +
//			        '<span style="font-size: 14px; color: #666666; font-family: Noto Sans CJK KR Regular, sans-serif;"'+ ", " +oBundleText.getText("LABEL_2884")+ '/span>';
//			
//		
//		var oMessage = new sap.ui.commons.FormattedTextView({
//			htmlText : oHtmlText
//		});	
//		
		
		
		
		var oDialog = new sap.m.Dialog({
			content :[new sap.m.Toolbar({
				content : [ new sap.m.Text({
					text : oBundleText.getText("LABEL_2772")
				}).addStyleClass("FontFamily"),
			    new sap.m.Text({
					text : oBundleText.getText("LABEL_2883")
				}).addStyleClass("FontFamilyRed"),
				
				]
			}),
			new sap.m.Text({
				text :oBundleText.getText("LABEL_2884")
			}).addStyleClass("FontFamily")
			
			] ,
			contentWidth : "400px",
			contentHeight : "100px",
			showHeader : true,
			title : oBundleText.getText("LABEL_0052"),	// 52:안내
			endButton : new sap.m.Button({text : oBundleText.getText("LABEL_0395"), press : oController.onPressCreate}),	// 395:확인
		});
		
//		if (!jQuery.support.touch) {
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };	

		return oDialog;
	}

});
