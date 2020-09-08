sap.ui.jsfragment("zui5_hrxx_actapp.fragment.SelectDoctype", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	
	createContent : function(oController) {
		
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
        
        var mDocTypeList = sap.ui.getCore().getModel("DocTypeList");
        var vDocTypeList = mDocTypeList.getProperty("/DocTypeListSet");
		
        var oCell = null, oRadio = null;
		
		var oSelectLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 1
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({text : oBundleText.getText("MSG_SELECT_DOCTY")})
		}).addStyleClass("L2PPaddingLeft10");
		oSelectLayout.createRow(oCell);
		
		if(vDocTypeList && vDocTypeList.length) {
			for(var i=0; i<vDocTypeList.length; i++) {
				oRadio = new sap.m.RadioButton(oController.PAGEID + "_SM_RadioButton" + (i+1), {
					groupName : "DOCTYPE", 
					text : vDocTypeList[i].Doctx,
					customData : [{key : "Docty", value : vDocTypeList[i].Docty },
					              {key : "PageId", value : vDocTypeList[i].PageId }]
				});
				if(i == 0) {
					oRadio.setSelected(true);
				}
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : oRadio
				}).addStyleClass("L2PPaddingLeft10");
				oSelectLayout.createRow(oCell);
			}
		}
		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.RadioButton(oController.PAGEID + "_SM_RadioButton1", {groupName : "MASSN", text : "사내 발령"})
//		}).addStyleClass("L2PPaddingLeft10");
//		oSelectLayout.createRow(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.RadioButton(oController.PAGEID + "_SM_RadioButton2", {groupName : "MASSN", text : "조직 발령"})
//		}).addStyleClass("L2PPaddingLeft10");
//		oSelectLayout.createRow(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.RadioButton(oController.PAGEID + "_SM_RadioButton3", {groupName : "MASSN", text : "채용 발령 (계약직, 파견직 포함)"})
//		}).addStyleClass("L2PPaddingLeft10");
//		oSelectLayout.createRow(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.RadioButton(oController.PAGEID + "_SM_RadioButton4", {groupName : "MASSN", text : "사간 및 주재원 발령"})
//		}).addStyleClass("L2PPaddingLeft10");
//		oSelectLayout.createRow(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.RadioButton(oController.PAGEID + "_SM_RadioButton5", {groupName : "MASSN", text : "휴/복직 발령"})
//		}).addStyleClass("L2PPaddingLeft10");
//		oSelectLayout.createRow(oCell);
//		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.RadioButton(oController.PAGEID + "_SM_RadioButton6", {groupName : "MASSN", text : "퇴직 발령"})
//		}).addStyleClass("L2PPaddingLeft10");
//		oSelectLayout.createRow(oCell);
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_SM_Dialog",{
			content :[oSelectLayout] ,
			contentWidth : "400px",
			contentHeight : "300px",
			showHeader : true,
			title : oBundleText.getText("TITLE_ACT_TYPE"),
			beginButton : new sap.m.Button({text : oBundleText.getText("SELECT_BTN"), icon: "sap-icon://complete", press : oController.onSMSelectType}), //
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"), icon: "sap-icon://sys-cancel-2", press : oController.onSMClose}),
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		

		return oDialog;
	}

});
