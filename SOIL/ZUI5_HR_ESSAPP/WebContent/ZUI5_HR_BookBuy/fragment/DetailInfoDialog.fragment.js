sap.ui.jsfragment("ZUI5_HR_BookBuy.fragment.DetailInfoDialog", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		
		var oRow, oCell;
		
		var oCloseButton = new sap.m.Button({
			text : oBundleText.getText("LABEL_0017"), // 17:닫기
			type : "Ghost",
			press : function(oEvent){
				oDialog.close();
			}
		});
		
		var oContent = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			widths : ['20%','80%']
		});
		//도서명		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1703") , required : true }).addStyleClass("FontFamilyBold"),	// 1703:도서명
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);		
		
		var oZbname = new sap.m.Toolbar({
			content:[
				new sap.m.Input(oController.PAGEID + "_Zbname",{
					value : "{Zbname}"
				}).addStyleClass("FontFamily")
			]
		}).addStyleClass("ToolbarNoBottomLine");;
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oZbname
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);		
		
		oContent.addRow(oRow);
		
		//출판사
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2244") , required : true }).addStyleClass("FontFamilyBold"),	// 2244:출판사
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);		
		
		var oZbpub = new sap.m.Toolbar({
			content:[
				new sap.m.Input(oController.PAGEID + "_Zbpub",{
					value : "{Zbpub}"
				}).addStyleClass("FontFamily")
			]
		}).addStyleClass("ToolbarNoBottomLine");;
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oZbpub
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);		
		
		oContent.addRow(oRow);		
		
		//희망사유
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "100%"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2384") , required : true }).addStyleClass("FontFamilyBold"),	// 2384:희망사유
		}).addStyleClass("MatrixLabel"); 
		oRow.addCell(oCell);		
		
		var oZreas = new sap.m.TextArea(oController.PAGEID + "_Zreas",{
			value : "{Zreas}",
			rows: 5,
			width: "100%"
		}).addStyleClass("FontFamilyBold");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : oZreas
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);		
		
		oContent.addRow(oRow);	
		
		oContent.setModel(oController._DetailJSonModel).bindElement("/Data");
		var oDialog = new sap.m.Dialog({
			content :[oContent] ,
			//contentWidth : "700px",
			showHeader : true,
			title : oBundleText.getText("LABEL_1534"),	// 1534:구독희망도서 정보등록
			buttons: [
				new sap.m.Button({
					text : oBundleText.getText("LABEL_0044"), 	// 44:신청
					press : oController.onSave, 
					type : "Ghost"
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
