sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_POP_Sub24_10", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* 
	* 은행
	*  
	* @memberOf fragment.ActRecPInfo_POP_Sub24_10
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
        
/////// 예금주
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "예금주", required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oEmftx = new sap.m.Input(oController.PAGEID + "_Sub24_10_Emftx", {
     	   width : "95%",
     	   enabled : !oController._DISABLED,
     	   customData : {key:"Seqnr", value:""}
        }).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 3,
			content : oEmftx
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
/////// 우편번호
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "우편번호"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oBkplz = new sap.m.Input(oController.PAGEID + "_Sub24_10_Bkplz", {
	     	   width : "95%",
	     	   maxLength : 10,
	     	   enabled : !oController._DISABLED,
	    }).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oBkplz
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
///// City		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "도시"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oBkort = new sap.m.Input(oController.PAGEID + "_Sub24_10_Bkort", {
	     	   width : "95%",
	     	   maxLength : 25,
	     	   enabled : !oController._DISABLED,
	    }).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oBkort
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);	
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
////// Bank Country	
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "은행국가"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oBanks = new sap.m.Input(oController.PAGEID + "_Sub24_10_Banks", {
	     	   width : "95%",
	     	   showValueHelp: true,
			   valueHelpOnly: true,
			   valueHelpRequest: oController.onDisplaySearchNatioDialog,
			   enabled: !oController._DISABLED,
			   customData: new sap.ui.core.CustomData({key : "Banks", value : ""})
	    }).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oBanks
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);		
		
////// Bank Key
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label(oController.PAGEID + "_Label_Sub24_10_Bankl", {text: "은행키", required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oBankl = new sap.m.Input(oController.PAGEID + "_Sub24_10_Bankl", {
	     	   width : "95%",
	     	   showValueHelp: true,
			   valueHelpOnly: true,
			   valueHelpRequest: oController.onDisplaySearchBanklDialog,
			   enabled: !oController._DISABLED,
			   customData: new sap.ui.core.CustomData({key : "Bankl", value : ""})
	    }).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oBankl
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);	
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
////// Bank Account
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label(oController.PAGEID + "_Label_Sub24_10_Bankn", {text: "은행계좌번호", required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oBankn = new sap.m.Input(oController.PAGEID + "_Sub24_10_Bankn", {
	     	   width : "95%",
	     	   maxLength : 18,
			   enabled: !oController._DISABLED
	    }).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oBankn
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
////// Bank Control Key
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "은행관리키", required : true}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oBkont = new sap.m.Select(oController.PAGEID + "_Sub24_10_Bkont", {
	     	   width : "95%",
			   enabled: !oController._DISABLED
	    }).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oBkont
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);	
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
////// Payment Method	
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "지급방법"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oZlsch = new sap.m.Select(oController.PAGEID + "_Sub24_10_Zlsch", {
	     	   width : "95%",
	     	   change : oController.onChangeZlsch
	    }).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oZlsch
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);		
		
////// Payment Currency
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "지급통화"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oWaers = new sap.m.Input(oController.PAGEID + "_Sub24_10_Waers", {
	     	   width : "95%",
	     	   enabled : false,
//	     	   showValueHelp: true,
//			   valueHelpOnly: true,
//			   valueHelpRequest: oController.onDisplaySearchWaersDialog,
//			   enabled: !oController._DISABLED,
			   customData: new sap.ui.core.CustomData({key : "Waers", value : ""})
	    }).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oWaers
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);	
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_Sub24_10_AddInfo");
		
////// 표준값
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "표준값"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oBetrg = new sap.m.Input(oController.PAGEID + "_Sub24_10_Betrg", {
	     	   width : "95%",
			   enabled: !oController._DISABLED
	    }).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oBetrg
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
////// 표준백분율
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "표준비율"}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oAnzhl = new sap.m.Input(oController.PAGEID + "_Sub24_10_Anzhl", {
	     	   width : "95%",
			   enabled: !oController._DISABLED
	    }).addStyleClass("L2P13Font");

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oAnzhl
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);		
		
		oRequestLayout.addRow(oRow);
		
        var oRequestPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label(oController.PAGEID + "_POP_Sub24_10_PanelLabel",{text : "은행정보", design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer()]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oRequestLayout]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_Sub24_10_Dialog",{
			content :[oRequestPanel] ,
			contentWidth : "1024px",
			contentHeight : "368px",
			showHeader : true,
			title : "은행정보",
			beforeOpen : oController.onBeforeOpenDialog,
			beginButton : new sap.m.Button({text : "저장", icon: "sap-icon://save", press : oController.onPressSave}), //
			endButton : new sap.m.Button({text : "취소", icon: "sap-icon://sys-cancel-2", press : oController.onClose}),
		});
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		
		return oDialog;
	}

});
