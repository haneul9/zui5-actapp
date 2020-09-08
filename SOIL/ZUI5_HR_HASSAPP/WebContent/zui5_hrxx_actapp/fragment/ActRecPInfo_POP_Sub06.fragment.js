sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_POP_Sub06", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.ActRecPInfo_POP_Sub06
	*/
	
	createContent : function(oController) {
		
        var oCell = null, oRow = null;
		
        var oRequestLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
        
        oRow = new sap.ui.commons.layout.MatrixLayoutRow();
        
/////// 자격증유형
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "자격증 유형", required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oCttyp = new sap.m.Input(oController.PAGEID + "_Sub06_Cttyp", {
			width : "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.onDisplaySearchCttypDialog,
			enabled: !oController._DISABLED,
			customData: new sap.ui.core.CustomData({key : "Cttyp", value : ""})
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oCttyp
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

/////// 자격증번호
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "자격증번호", required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oCtnum = new sap.m.Input(oController.PAGEID + "_Sub06_Ctnum", {
			type : "Text",
			width : "95%",
			enabled : !oController._DISABLED
		});
			
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oCtnum
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);		
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();    
		
/////// 취득일
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "취득일", required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oCerda = new sap.m.DatePicker(oController.PAGEID + "_Sub06_Cerda", {
			width : "95%",
			valueFormat : "yyyy-MM-dd",
	    	displayFormat : gDtfmt,
	    	customData : {key : "Seqnr", value : ""},
	    	change : oController.changeDate,
	    	enabled : !oController._DISABLED
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oCerda
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 만료일
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "만료일"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oCtend = new sap.m.DatePicker(oController.PAGEID + "_Sub06_Ctend", {
			width : "95%",
			valueFormat : "yyyy-MM-dd",
	    	displayFormat : gDtfmt,
	    	change : oController.changeDate,
	    	enabled : !oController._DISABLED
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oCtend
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();    
		
/////// 발행기관
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "발행기관"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oIsaut = new sap.m.Input(oController.PAGEID + "_Sub06_Isaut", {
			type : "Text",
			width : "95%",
			enabled : !oController._DISABLED
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oIsaut
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 2,
			content : []
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);

        var oRequestPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : "자격면허", design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer()]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oRequestLayout]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_Sub06_Dialog",{
			content :[oRequestPanel] ,
			contentWidth : "1024px",
			contentHeight : "768px",
			showHeader : true,
			title : "자격면허",
			beginButton : new sap.m.Button({text : "저장", icon: "sap-icon://save", press : oController.onPressSave}), //
			endButton : new sap.m.Button({text : "취소", icon: "sap-icon://sys-cancel-2", press : oController.onClose}),
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		
		return oDialog;
	}

});
