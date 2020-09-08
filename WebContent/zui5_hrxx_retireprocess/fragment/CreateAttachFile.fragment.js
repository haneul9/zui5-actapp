sap.ui.jsfragment("zui5_hrxx_retireprocess.fragment.CreateAttachFile", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	
	createContent : function(oController) {
		
//		var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
        var oCell = null, oRow =null;
		
		var oAttchFIleLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : true,
			columns : 2 ,
			widths : ["150px",]
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({ text : oBundleText.getText("NUMBER"), required : true})
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Select(oController.PAGEID + "_Seqnr", {
				width : "95%", 
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		oAttchFIleLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({ text : oBundleText.getText("FILENAME"), required : true})
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Input(oController.PAGEID + "_Rdonm", {width : "95%"})
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		oAttchFIleLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label(oController.PAGEID + "_AttachLabel",{ text : oBundleText.getText("TITLE_ATTACH_FILE"), required : true})
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.ui.unified.FileUploader(oController.PAGEID + "_Fname", {
					name : "RetireFile",
					buttonText : oBundleText.getText("FIND_BTN"),
					//icon : "sap-icon://search",
					width : "90%",
					multiple : false,
					change : oController.onChangeFile
			  })
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		oAttchFIleLayout.addRow(oRow);
		
		var uploadYnRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_UpdynRow",{height:"42px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({ text : oBundleText.getText("UPLOAD_CHECK")})
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		uploadYnRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.CheckBox(oController.PAGEID + "_Updyn", {
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		uploadYnRow.addCell(oCell);
		oAttchFIleLayout.addRow(uploadYnRow);
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_CAF_Dialog",{
			content :[oAttchFIleLayout] ,
			beforeOpen : oController.onBeforeOpenCAFDialog,
			contentWidth : "500px",
			contentHeight : "230px",
			showHeader : true,
			title : oBundleText.getText("TITLE_FILE_REGISTE"),
			beginButton : new sap.m.Button({text : oBundleText.getText("SAVE_BTN"), 
											press : oController.onPressFileSave ,
											width: "50%"
			}),
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"),
										  press : oController.onACFClose,
										  width: "50%"
			}),
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		
		return oDialog;
	}

});
