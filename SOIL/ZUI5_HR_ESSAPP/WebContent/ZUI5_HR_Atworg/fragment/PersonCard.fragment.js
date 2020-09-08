sap.ui.jsfragment("ZUI5_HR_Atworg.fragment.PersonCard", {
	
	createContent : function(oController) {
		
		var oChiefLayout = new sap.ui.layout.HorizontalLayout(oController.PAGEID + "_ChiefLayout",{
			allowWrapping :true,
			width : "100%"
		});
		
		var oPersonLayout = new sap.ui.layout.HorizontalLayout(oController.PAGEID + "_PersonLayout",{
			allowWrapping :true,
			width : "100%"
		});
		
		var oSubPersonLayout = new sap.ui.layout.HorizontalLayout(oController.PAGEID + "_SubPersonLayout", {
			allowWrapping :true,
			width : "100%"
		});
		
		var oPictureLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_PictureLayout",{
			width: "100%",
			content : [new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
			           oChiefLayout,
			           new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
			           oPersonLayout,
			           new sap.ui.core.HTML({content : "<hr style='height:0.01rem;width:100%;background-color:rgb(218,218,218);margin-bottom:0.5rem'>",	preferDOM : false})]
//			           oSubPersonLayout]
		});
		
		var oCloseButton = new sap.m.Button({
			text : oBundleText.getText("LABEL_0017"), // 17:닫기
			press : function() {
				oDialog.close();
			}
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_PersonCard_Dialog",{
			content : [oPictureLayout],
			contentWidth : "830px",
			contentHeight : "768px",
			showHeader : true,
			title : oBundleText.getText("LABEL_1872"),	// 1872:소속인원 현황
			buttons : [oCloseButton],
			beforeOpen : oController.beforeOpenPersonCardDialog,
			afterClose : oController.afterClosePersonCardDialog
		}).addStyleClass("sapUiSizeCompact");
		
		
		return oDialog;
	}

});
