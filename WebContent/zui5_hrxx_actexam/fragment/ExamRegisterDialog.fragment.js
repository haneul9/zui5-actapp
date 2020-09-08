sap.ui.jsfragment("zui5_hrxx_actexam.fragment.ExamRegisterDialog", {
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
		
        var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
        var oCell, oRow =null;
        
	    var oRequestLayout = new sap.ui.commons.layout.MatrixLayout({
				width : "100%",
				layoutFixed : false,
				columns : 2,
				widths: ["200px",],
		});
			
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("EMPLOYEE")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Input(oController.PAGEID + "_RG_RPERN",{
				enabled : false,
				width : "95%"
			}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10 L2PInputTableData");
		oRow.addCell(oCell);
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("RORGT")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
        oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Input(oController.PAGEID + "_RG_RORGT",{
				enabled : false,
				width : "95%"
			}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10 L2PInputTableData");
		oRow.addCell(oCell);
		oRequestLayout.addRow(oRow);
		
		var oRequestPanel = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : new sap.m.Label({text : oBundleText.getText("RPERN"), design : "Bold"}).addStyleClass("L2P13Font")
			}),
			content : [oRequestLayout]
		});
		
        var oCell1 = null, oCell2 = null, oRow =null;
        
		var oSelectLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_RG_LAYOUT",{
			width : "100%",
			layoutFixed : true,
			columns : 2 ,
			widths : ["200px",]
		});
		
		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({ text : oBundleText.getText("QUALI"),
										required : true })
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		oRow.addCell(oCell1);
		
		oCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Input(oController.PAGEID + "_RG_QUALI",{
				enabled : false,
				width : "95%"
			}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell2);
		oSelectLayout.addRow(oRow);
		
		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({ text : oBundleText.getText("EXMTY"),
										required : true })
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		oRow.addCell(oCell1);
		
		oCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Input(oController.PAGEID + "_RG_EXMTY", {
				enabled : false,
				width : "95%"
			}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell2);
		oSelectLayout.addRow(oRow);
		
		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({ text : oBundleText.getText("EXMSC")})
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		oRow.addCell(oCell1);
		
		oCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Input(oController.PAGEID + "_RG_EXMSC",{
				enabled : false,
				width : "95%"
			})
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell2);
		oSelectLayout.addRow(oRow);
		
		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({ text : oBundleText.getText("EAMGR")})
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		oRow.addCell(oCell1);
		
		oCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Input(oController.PAGEID + "_RG_EAMGR",{
				enabled : false,
				width : "95%"
			})
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell2);
		oSelectLayout.addRow(oRow);
		
		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({ text : oBundleText.getText("EAMDT")})
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		oRow.addCell(oCell1);
		
		oCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.DatePicker(oController.PAGEID + "_RG_EAMDT", {
				value: dateFormat.format(curDate), 
				valueFormat : "yyyy-MM-dd",
	        	displayFormat : gDtfmt,
	        	enabled : false,
				width : "95%",
				change : oController.onChangeDate
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell2);
		oSelectLayout.addRow(oRow);
		
		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({ text : oBundleText.getText("EXMTO")})
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		oRow.addCell(oCell1);
		
		oCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.DatePicker(oController.PAGEID + "_RG_EXMTO", {
				value: dateFormat.format(curDate), 
				valueFormat : "yyyy-MM-dd",
	        	displayFormat : gDtfmt,
	        	enabled : false,
				width : "95%",
				change : oController.onChangeDate
			}).addStyleClass("L2P13Font")
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell2);
		oSelectLayout.addRow(oRow);
		
		var oApplicationPanel = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : oBundleText.getText("APPL_HISTORY"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oSelectLayout]
		});
		
		var oReasonPanel = new sap.m.Panel(oController.PAGEID + "_ReasonPanel", {
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://comment", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("PANEL_REQUEST_COMMENT"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [new sap.m.TextArea(oController.PAGEID + "_RG_ACOMM", {width : "100%", rows : 3 , enabled : false })]
		});
		
		var oRejectPanel = new sap.m.Panel(oController.PAGEID + "_RejectPanel", {
			expandable : true,
			expanded : true,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://comment", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("TITLE_REJECT_COMMENT"), design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [new sap.m.TextArea(oController.PAGEID + "_RG_REJECTCOMM", {width : "100%", rows : 3 , enabled : false})]
		});
		
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [ new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oRequestPanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oApplicationPanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oReasonPanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oRejectPanel,
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController),
			            new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            ]
		});	
		
		var CompleteBtn = new sap.m.Button(oController.PAGEID + "_RG_COMPLETE_BTN",{text : oBundleText.getText("COMPLETE_BTN"), 
			press : oController.onPressRgComplete
		});
		
		var RejectBtn = new sap.m.Button(oController.PAGEID + "_RG_REJECT_BTN",{text : oBundleText.getText("REJECT_BTN"), 
			press : oController.onCOOpen,
			customData : [{key : "type", value : "D"}]
			
		});
		
		var CloseBtn = new sap.m.Button(oController.PAGEID + "_RG_CLOSE_BTN",{text : oBundleText.getText("CANCEL_BTN"), 
			press : oController.onPressCancel
		});
		
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_RG_EXAM_Dialog",{
			content : [oLayout],
			beforeOpen : oController.initialLanExamRegDialog,
			contentWidth : "600px",
			contentHeight : "600px",
			showHeader : true,
			buttons : [ CompleteBtn, RejectBtn, CloseBtn]
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		

		return oDialog;
	}

});
