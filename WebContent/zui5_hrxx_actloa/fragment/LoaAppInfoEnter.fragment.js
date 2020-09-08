sap.ui.jsfragment("zui5_hrxx_actloa.fragment.LoaAppInfoEnter", {
	
	createContent : function(oController) {
		
//        var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
        
        var oCell = null, oRow = null;
		
		var oInfoEnterLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 2
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "50px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2,
			content : [new sap.m.Text({text: oBundleText.getText("MSG_APPCOMPLETE_INPUT")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		oInfoEnterLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Text({text: oBundleText.getText("ACT_EXIST_REQUEST")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Select(oController.PAGEID + "_LAE_Docno", {	
					  change : oController.onChangeDocno,
					  width : "95%"		
			    }).addStyleClass("L2P13Font"),
			    
			 
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oInfoEnterLayout.addRow(oRow);
		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Text({text: oBundleText.getText("ACTDATE")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.DatePicker(oController.PAGEID + "_LAE_Actda", {	
							valueFormat : "yyyy-MM-dd",
				            displayFormat : gDtfmt,
				            width : "95%",
				            change : oController.onChangeDate
			    }).addStyleClass("L2P13Font"),
			    
			 
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oInfoEnterLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Text({text: oBundleText.getText("REQDP")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
//		var filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Select(oController.PAGEID + "_LAE_Orgeh", {	
//						    items : {
//								path : "/AppReqDepListSet" + filterString,
//					    		template : new sap.ui.core.Item({key : "{Orgeh}", text : "{Orgtx}"})
//								},
//								width : "95%"
//			    }).setModel(sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV")).addStyleClass("L2P13Font"),			    
//		}).addStyleClass("L2PPaddingLeft10");
//		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Select(oController.PAGEID + "_LAE_Orgeh", {	
						   width : "95%"
			    }).addStyleClass("L2P13Font"),			    
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		oInfoEnterLayout.addRow(oRow);
		
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : new sap.m.Input(oController.PAGEID + "_LAE_Orgeh_input", {	
//						   enabled : false
//			    }).addStyleClass("L2P13Font"),			    
//		}).addStyleClass("L2PPaddingLeft10");
//		oRow.addCell(oCell);
//		oInfoEnterLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Text({text: oBundleText.getText("LOA_TITLE")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Input(oController.PAGEID + "_LAE_Title", {	
							width : "95%"
			    }).addStyleClass("L2P13Font"),
			    
			 
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		oInfoEnterLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.End,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2,
			content : [new sap.m.Toolbar({
				height : "2.5rem",
				content : [ new sap.m.CheckBox(oController.PAGEID + "_RA_Action")
							.addStyleClass("L2P13Font"),
			            	new sap.m.Text({
			            		text : oBundleText.getText("MSG_RETIRE_TO_ACTION")
			            	}).addStyleClass("L2P13Font")
			            	]
			}).addStyleClass("L2PToolbarNoBottomLine")]
		});
		
		
		
		
		oRow.addCell(oCell);
		oInfoEnterLayout.addRow(oRow);
		
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_LAE_Dialog",{
			content : oInfoEnterLayout,
			contentWidth : "800px",
			contentHeight : "400px",
			showHeader : true,
			beforeOpen : oController.onBeforeOpenInfoEnterDialog,
			title : oBundleText.getText("TITLE_LOA_INFO_ENTER"),
			beginButton : new sap.m.Button({text : oBundleText.getText("OK_BTN"), width : "50%", press : oController.onPressActRequest}),
			endButton : new sap.m.Button({text : oBundleText.getText("CLOSE_EN_BTN"),width : "50%",  press : oController.onLAEClose}),
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };

		return oDialog;
	}

});
