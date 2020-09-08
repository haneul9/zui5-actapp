sap.ui.jsfragment("zui5_hrxx_retireprocess.fragment.StaffManagerView", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	
	createContent : function(oController) {
		jQuery.sap.require("control.ODataFileUploader");
		jQuery.sap.require("common.AttachFileAction");
		
//		var oBundleText = jQuery.sap.resources({
//        	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//        	locale : sap.ui.getCore().getConfiguration().getLanguage()
//        });
		
        var oCell = null, oRow =null;
		
		var oStaffLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : true,
			columns : 2 ,
			widths : ["150px",]
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({ text : oBundleText.getText("RETIRE_MANAGER")})
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Input(oController.PAGEID + "_ENAME", {
				value : "",
				customData : new sap.ui.core.CustomData({key : "Pernr", value : ""}),
				width : "95%", 
				valueHelpRequest: oController.onEmployeeSearch, 
				showValueHelp : true,
				valueHelpOnly : true
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		oStaffLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({ text : oBundleText.getText("STFYN2")})
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.CheckBox(oController.PAGEID + "_STFYN")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		oStaffLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({ text : oBundleText.getText("RCVYN2")})
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.CheckBox(oController.PAGEID + "_RCVYN")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		oStaffLayout.addRow(oRow);
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_Staff_Dialog",{
			content :[oStaffLayout] ,
			//beforeOpen : oController.initialLanExamRegDialog,
			contentWidth : "500px",
			contentHeight : "200px",
			showHeader : true,
			title : oController._vPopupTitle,
			beginButton : new sap.m.Button({text : oBundleText.getText("SAVE_BTN"), 
											width: "50%" ,
											press : oController.onSave 
				
			}),
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"), 
										  width: "50%" ,
										  press : oController.onCancel
			}),
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		
		return oDialog;
	}

});
