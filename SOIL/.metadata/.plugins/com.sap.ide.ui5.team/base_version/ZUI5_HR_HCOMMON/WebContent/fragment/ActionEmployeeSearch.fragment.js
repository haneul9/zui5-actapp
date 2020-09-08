sap.ui.jsfragment("fragment.ActionEmployeeSearch", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.ActionEmployeeSearch
	*/
	
	createContent : function(oController) {
		
		jQuery.sap.require("common.ActionSearchUser");
		
        var oStat1 = new sap.m.Select(oController.PAGEID + "_AES_Stat1", {
			width : "200px"
        }).addStyleClass("L2P13Font");
		
//		var oFilterLayout = new sap.ui.layout.HorizontalLayout({
//			allowWrapping :true
//		}).addStyleClass("L2PFilterLayout");
		
		var oFilterLayout = new sap.m.ScrollContainer(oController.PAGEID + "_AES_LeftScrollContainer", {
			width: "100%",
			height : "500px",
			horizontal : false,
			vertical : true
		}).addStyleClass("");
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_AES_Filter1", {
				content : [new sap.m.Label({text : oBundleText.getText("PBTXT") + ":"}),
				           new sap.m.Select(oController.PAGEID + "_AES_Persa", {
								width: "200px",
								change : common.ActionSearchUser.onChangePersa
							}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_AES_Filter2", {
				content : [new sap.m.Label({text : oBundleText.getText("ENAME") + ":"}),
				           new sap.m.Input(oController.PAGEID + "_AES_Ename", {
								width: "200px"
							}).addStyleClass("L2P13Font").attachBrowserEvent("keyup", common.ActionSearchUser.onKeyUp)]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_aES_Filter3", {
				content : [new sap.m.Label({text : oBundleText.getText("FULLN") + ":"}),
				           new sap.m.MultiInput(oController.PAGEID + "_AES_Fulln", {
								width: "200px",
								showValueHelp: true,
								enableMultiLineMode :true,
								valueHelpRequest: oController.displayMultiOrgSearchDialog
							}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content : [new sap.m.Label({text : oBundleText.getText("STATX") + ":"}),
				           oStat1]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_AES_Filter4", {
				content : [new sap.m.Label({text : oBundleText.getText("ZZJOBGRTX") + ":"}),
				           new sap.m.Select(oController.PAGEID + "_AES_Zzjobgr", {
						 		width : "200px",
					 		   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_AES_Filter5", {
				content : [new sap.m.Label({text : oBundleText.getText("PGTXT") + ":"}),
				           new sap.m.Select(oController.PAGEID + "_AES_Persg", {
						 		width : "200px",
						 		change : common.ActionSearchUser.onChangePersg
					 		   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
//		oFilterLayout.addContent(
//			new sap.ui.layout.VerticalLayout({
//				width : "100%",
//				content : [new sap.m.Link(oController.PAGEID + "_AES_More", {
//					//width : "100%",
//					textAlign : sap.ui.core.TextAlign.Right,
//					press : common.ActionSearchUser.onClickMore,
//					text : "More"}).addStyleClass("L2P13Font")]
//			}).addStyleClass("L2PTextAlignRight L2PPaddingRight10")
//		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_AES_Filter6", {
				visible : true,
				content : [new sap.m.Label({text : oBundleText.getText("PKTXT") + ":"}),
				           new sap.m.Select(oController.PAGEID + "_AES_Persk", {
						 		width : "200px",
					 		   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_AES_Filter7", {
				visible : true,
				content : [new sap.m.Label({text : oBundleText.getText("ZZROLLVTX") + ":"}),
				           new sap.m.Select(oController.PAGEID + "_AES_Zzrollv", {
						 		width : "200px",
					 		   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_AES_Filter8", {
				visible : true,
				content : [new sap.m.Label({text : oBundleText.getText("ZZCALTLTX") + ":"}),
				           new sap.m.Select(oController.PAGEID + "_AES_Zzcaltl", {
						 		width : "200px",						 		
					 		   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_AES_Filter9", {
				visible : true,
				content : [new sap.m.Label({text : oBundleText.getText("ZZPSGRPTX") + ":"}),
				           new sap.m.Select(oController.PAGEID + "_AES_Zzpsgrp", {
						 		width : "200px",
					 		   }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PFilterItem")
		);
		
//		oFilterLayout.addContent(
//			new sap.ui.layout.VerticalLayout({
//				content : [new sap.m.Button({
//								text: oBundleText.getText("SEARCH_BTN"),
//								type : sap.m.ButtonType.Emphasized,
//								press : common.ActionSearchUser.searchFilterBar
//						   }).addStyleClass("L2P13Font")]
//			}).addStyleClass("L2PFilterItem")
//		);
		
		var oFilterPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
//			expand : common.ActionSearchUser.onExpandFilter,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://filter", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("FILINFO"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Button({
								text: oBundleText.getText("SEARCH_BTN"),
								type : sap.m.ButtonType.Emphasized,
								press : common.ActionSearchUser.searchFilterBar
						   }).addStyleClass("L2P13Font"),
						   new sap.m.ToolbarSpacer({width: "10px"}),]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oFilterLayout]
		});
		
		//사원검색결과 리스트 Object (DHtmlx 사용을 위해 추가)
		var oPersonList = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_AES_Table",  {
			width : "925px"
		});
		
//		oPersonList.addDelegate({
//			onAfterRendering: common.ActionSearchUser.onAfterRendering
//		});
		
		var oResultPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://table-chart", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("SEARCH_RESULT"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer()]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oPersonList]
		});
		
		var oMainLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 2,
			widths : ["270px", "930px"]
		});
		
		var oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [oFilterPanel]
		}).addStyleClass("");
		
		var oCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [oResultPanel]
		}).addStyleClass("");
		
		oMainLayout.createRow(oCell1, oCell2);
		
		var vContentHeight = window.innerHeight - 200;
		
		oFilterLayout.setHeight((vContentHeight - 90) + "px");
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_AES_Dialog",{
			content :[oMainLayout] ,
			contentWidth : "1250px",
			contentHeight : vContentHeight + "px",
			showHeader : true,
			title : oBundleText.getText("TITLE_PERSEONS_SEARCH"),
			afterOpen : common.ActionSearchUser.onAfterOpenSearchDialog,
			beforeClose : common.ActionSearchUser.onBeforeOpenSearchDialog,
			beginButton : new sap.m.Button({text : oBundleText.getText("SELECT_BTN"), icon: "sap-icon://complete", press : common.ActionSearchUser.onAESSelectPerson}), //
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"), icon: "sap-icon://sys-cancel-2", press : common.ActionSearchUser.onClose}),
		});
		
		if (!jQuery.support.touch) {
			oDialog.addStyleClass("sapUiSizeCompact");
	    };

		return oDialog;
	}

});
