sap.ui.jsfragment("zui5_hrxx_projectprocess.fragment.Regist30Dialog", {
	
	createContent : function(oController) {
		jQuery.sap.require("common.Common");
		jQuery.sap.require("common.Formatter");
		
//		var locale = sap.ui.getCore().getConfiguration().getLanguage(); //언어
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : locale
//        });
        
        var oCell = null, oRow = null;
		
        var oRequestLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 3,
			widths: ["30%","35%","35%" ],
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("BEGDA"),
										required : true }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2,
			content : 	new sap.m.DatePicker(oController.PAGEID + "_30_Begda", {	
				valueFormat : "yyyy-MM-dd",
	            displayFormat : gDtfmt,
				width : "95%",
				change : oController.onChangeDate
				}).addStyleClass("L2P13Font"),
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ENDDA"),
									    required : true }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2,
			content : 	new sap.m.DatePicker(oController.PAGEID + "_30_Endda", {	
				valueFormat : "yyyy-MM-dd",
	            displayFormat : gDtfmt,
				width : "95%",
				change : oController.onChangeDate
				}).addStyleClass("L2P13Font"),
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("CYCLE"),
										required : true }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		 oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Input(oController.PAGEID + "_30_Frquy",{
					type : sap.m.InputType.Number ,
					maxLength : 3, 
					width : "95%"
				}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PPaddingLeft10 L2PInputTableDataNoRightBorder");
			oRow.addCell(oCell);
		
        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Select(oController.PAGEID + "_30_Frqut",{
				width : "95%"
			}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10 L2PInputTableDataNoLeftBorder");
		oRow.addCell(oCell);
		oRequestLayout.addRow(oRow);
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_30_Dialog",{
			content :[oRequestLayout] ,
			contentWidth : "500px",
			contentHeight : "300px",
			showHeader : true,
			title : oBundleText.getText("CREATE_BTN"),
			beginButton : new sap.m.Button({text : oBundleText.getText("OK_BTN"), 
											press : oController.onPressSave ,
											width: "50%"
			}),
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_EN_BTN"),
										  press : oController.onPressClose,
										  width: "50%"
			}),


		});
		
		
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };

		return oDialog;
	}

});
