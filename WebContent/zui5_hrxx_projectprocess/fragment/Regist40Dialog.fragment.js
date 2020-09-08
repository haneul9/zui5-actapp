sap.ui.jsfragment("zui5_hrxx_projectprocess.fragment.Regist40Dialog", {
	
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
			widths: ["30%","70%" ],
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
			content : 	new sap.m.DatePicker(oController.PAGEID + "_40_Begda", {	
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
			content : 	new sap.m.DatePicker(oController.PAGEID + "_40_Endda", {	
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
			content : [new sap.m.Label({text: oBundleText.getText("EXCEPT")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		 oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.CheckBox(oController.PAGEID + "_40_Sign",{
			}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10 L2PInputTableData");
		oRow.addCell(oCell);
		oRequestLayout.addRow(oRow);
     
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ORG_UNITS")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var vField01 = new sap.m.MultiInput(oController.PAGEID + "_40_Field01", {
			width: "95%",
			showValueHelp: true,
//			valueHelpOnly : true,
			enableMultiLineMode :true,
			valueHelpRequest: oController.displayMultiOrgSearchDialog
		}).attachLiveChange(function(args) {
			args.getSource().setValue("");
		}).addStyleClass("L2P13Font");
		
		vField01.addValidator(function(args){
			console.log("addValidator1");
			var text = args.text;
			return new sap.m.Token({key: "", text: text});
		});
		vField01.addValidator(function(args){
			console.log("addValidator2");
			args.asyncCallback(args.suggestedToken);
			return sap.m.MultiInput.WaitForAsyncValidation;
		});
		
		 oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [vField01]
		}).addStyleClass("L2PPaddingLeft10 L2PInputTableData");
		oRow.addCell(oCell);
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("PERSG")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		 oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.MultiComboBox(oController.PAGEID + "_40_Field02",{
				width : "95%" ,
				maxWidth : "400px"
			}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10 L2PInputTableData");
		oRow.addCell(oCell);
		oRequestLayout.addRow(oRow);		

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ZZJOBGR")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		 oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.MultiComboBox(oController.PAGEID + "_40_Field03",{
				width : "95%" ,
				maxWidth : "400px"
			}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10 L2PInputTableData");
		oRow.addCell(oCell);
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("JOB")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		 oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.MultiInput(oController.PAGEID + "_40_Field04",{
				showValueHelp: true,
				enableMultiLineMode :true,
				valueHelpRequest: oController.displayStellSearchDialog,
				width : "95%"
			}).attachLiveChange(function(args) {
				args.getSource().setValue("");
			}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10 L2PInputTableData");
		oRow.addCell(oCell);
		oRequestLayout.addRow(oRow);		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("ENAME")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		 oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.MultiInput(oController.PAGEID + "_40_Field07", {
						width: "95%",
						showValueHelp: true,
						enableMultiLineMode :true,
						valueHelpRequest: oController.displayMultiEmpSearchDialog
			}).attachLiveChange(function(args) {
				args.getSource().setValue("");
			}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10 L2PInputTableData");
		oRow.addCell(oCell);
		oRequestLayout.addRow(oRow);
		
		
		
//		var oLeftScrollContainer = new sap.m.ScrollContainer(oController.PAGEID + "_LeftScrollContainer", {
//			width: "100%",
//			height : "500px",
//			horizontal : false,
//			vertical : true,
////			content : new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LeftContainer", {
////				width: "100%",
////				content : []
////			})
//		}).addStyleClass("");
//		
//		oFilter = new sap.ui.layout.VerticalLayout({width : "100%"}); //270px
//		
//		oFilter.addContent(new sap.m.Select({
//			width: "300px"
//		}).addStyleClass("L2P13Font"));
//		
//		oLeftScrollContainer.addContent(oFilter);
//		oFilter = new sap.ui.layout.VerticalLayout({width : "100%"}); //270px
//		oFilter.addContent(new sap.m.Input({
//			width: "300px"
//		}).addStyleClass("L2P13Font"));
//		
//		oLeftScrollContainer.addContent(oFilter);
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_40_Dialog",{
			content :[oRequestLayout] ,
//			content :[oLeftScrollContainer] ,
			contentWidth : "600px",
			contentHeight : "400px",
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
