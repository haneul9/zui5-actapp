sap.ui.jsfragment("zui5_hrxx_staffappoint.fragment.StaffManagerView", {
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
		
		var oStaffLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : true,
			columns : 2 ,
			widths : ["200px",]
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"42px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({ text : oBundleText.getText("RETIRE_MANAGER") ,
										required : true})
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
			content : new sap.m.Label({ text : oBundleText.getText("APRTY") ,
										required : true})
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		var filterString = "/EmpCodeListSet/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		filterString += "%20and%20Field%20eq%20%27" + "Bizty" + "%27";
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Select(oController.PAGEID + "_BIZTY", {
				width : "95%", 
				items : {
					path : filterString,
					template : new sap.ui.core.Item({key : "{Ecode}",text : "{Etext}" }) 
				}
			}).addStyleClass("L2P13Font").setModel(sap.ui.getCore().getModel("ZHRXX_COMMON_SRV"))
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
		
		oBgRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_BG_ROW",{height:"42px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label({ text : oBundleText.getText("BG_STAFF_YN")})
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oBgRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.CheckBox(oController.PAGEID + "_BGYN",{
				select : oController.onChangeBgyn
			})
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oBgRow.addCell(oCell);
		oStaffLayout.addRow(oBgRow);
		
		oBgRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_BG_ROW2",{height:"42px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({ 
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : new sap.m.Label(oController.PAGEID + "_BGCODE_LABEL",{ text : oBundleText.getText("RESPONSIBLE_ORG") })
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oBgRow.addCell(oCell);
		
		var oOrgeh = new sap.m.Input(oController.PAGEID + "_BGCODE",{
			width: "90%",
			showValueHelp: true,
			valueHelpOnly : true,
			valueHelpRequest: oController.displayMultiOrgSearchDialog
		}).addStyleClass("L2P13Font");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [ oOrgeh ]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oBgRow.addCell(oCell);
		oStaffLayout.addRow(oBgRow);
		
		var oStaffComment = new sap.m.Text(oController.PAGEID + "_STAFF_COMMENT",{ text : oBundleText.getText("STAFF_COMMENT") })
									.addStyleClass("L2P13Font");
//		oBgRow = new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_BG_ROW3",{height:"42px"});
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [ oRefComment ] ,
//			colspan : 2
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oBgRow.addCell(oCell);
//		oStaffLayout.addRow(oBgRow);
//		
//		var 
		
		
		
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_Staff_Dialog",{
			content :[ oStaffLayout, 
			           new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			           oStaffComment] ,
			contentWidth : "600px",
			contentHeight : "400px",
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
