sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_POP_Sub02", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.ActRecPInfo_POP_Sub02
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
        
/////// 입학일자
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "입학일"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oBegda = new sap.m.DatePicker(oController.PAGEID + "_Sub02_Begda", {
			width : "95%",
			valueFormat : "yyyy-MM-dd",
	    	displayFormat : gDtfmt,
	    	enabled : !oController._DISABLED,
	    	change : oController.changeDate,
	    	customData : {key:"Seqnr", value:""}
		}).addStyleClass("L2PFontFamily");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oBegda
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 졸업일자
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text:"졸업일"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oEndda = new sap.m.DatePicker(oController.PAGEID + "_Sub02_Endda", {
			width : "95%",
			valueFormat : "yyyy-MM-dd",
	    	displayFormat : gDtfmt,
	    	change : oController.changeDate,
	    	enabled : !oController._DISABLED
		}).addStyleClass("L2PFontFamily");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oEndda
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();    

/////// 학력
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "학력"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oSlart = new sap.m.Select(oController.PAGEID + "_Sub02_Slart", {
     	   width : "95%",
     	   change : oController.onChangeSlart,
     	   enabled : !oController._DISABLED
        }).addStyleClass("L2PFontFamily").setModel(sap.ui.getCore().getModel("EmpCodeList"));
		oSlart.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Slart")]);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oSlart
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
/////// 학위
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "학위"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oSlabs = new sap.m.Select(oController.PAGEID + "_Sub02_Slabs", {
     	   width : "95%",
     	   enabled : !oController._DISABLED
        }).addStyleClass("L2PFontFamily").setModel(sap.ui.getCore().getModel("EmpCodeList"));
		//oSlabs.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Slabs")]);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oSlabs
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();    

/////// 학교 -> 학교명
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "학교명"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oSchcd = new sap.m.Input(oController.PAGEID + "_Sub02_Schcd", {
			width : "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.onDisplaySearchDialog,
			enabled: !oController._DISABLED,
			customData: new sap.ui.core.CustomData({key : "Schcd", value : ""})
		}).addStyleClass("L2PFontFamily");
	   
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oSchcd
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

/////// 국가
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "국가"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oSland = new sap.m.Input(oController.PAGEID + "_Sub02_Sland", {
			width : "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.onDisplaySearchNatioDialog,
			enabled: !oController._DISABLED,
			customData: new sap.ui.core.CustomData({key : "Sland", value : ""})
		}).addStyleClass("L2PFontFamily");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oSland
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oRequestLayout.addRow(oRow);		
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();  
/////// 단과대명		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "단과대명"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oZzcolnm = new sap.m.Input(oController.PAGEID + "_Sub02_Zzcolnm", {
			width : "95%",
			enabled: !oController._DISABLED,
		}).addStyleClass("L2PFontFamily");
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [oZzcolnm]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
	/////// 구분	
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "구분"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oHLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping :true
		});
		oHLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.CheckBox(oController.PAGEID + "_Sub02_Zzrecab",{}
						        ).addStyleClass("L2PFontFamily")]
				})
		);
		oHLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Text({text : "인정학력"}
						        ).addStyleClass("L2PFontFamily L2PPaddingTop6")]
				})
		);
		oHLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.CheckBox(oController.PAGEID + "_Sub02_Zzfinyn",{}
						        ).addStyleClass("L2PFontFamily")]
				})
		);
		oHLayout.addContent(
				new sap.ui.layout.VerticalLayout({
					content : [new sap.m.Text({text : "최종학력"}
						        ).addStyleClass("L2PFontFamily L2PPaddingTop6")]
				})
		);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [oHLayout]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();    
/////// 전공그룹
		var oZzmajg1 = new sap.m.ComboBox(oController.PAGEID + "_Sub02_Zzmajg1", {
			width : "95%",
		}).addStyleClass("L2PFontFamily");
		
		var oZzmajg2 = new sap.m.ComboBox(oController.PAGEID + "_Sub02_Zzmajg2", {
			width : "95%",
		}).addStyleClass("L2PFontFamily");
	
		var oZzmajg3 = new sap.m.ComboBox(oController.PAGEID + "_Sub02_Zzmajg3", {
			width : "95%",
		}).addStyleClass("L2PFontFamily");
		
		oZzmajg1.destroyItems();
		oZzmajg2.destroyItems();
		oZzmajg3.destroyItems();
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		var oPath = "/EmpCodeListSet/?$filter=Field eq 'Zzmajg1' and Persa eq '" + oController._vPersa + "'" +
					" and Actda eq datetime'" + oController._vActda + "T00:00:00'";
		oZzmajg1.addItem(new sap.ui.core.Item({
			key : "",
			text : "-선택-"
		}));
		oZzmajg2.addItem(new sap.ui.core.Item({
			key : "",
			text : "-선택-"
		}));
		oZzmajg3.addItem(new sap.ui.core.Item({
			key : "",
			text : "-선택-"
		}));
		oCommonModel.read(
					oPath,
					null,
					null,
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								oZzmajg1.addItem(
									new sap.ui.core.Item({
										key : oData.results[i].Ecode,
										text : oData.results[i].Etext
									})
								);
								oZzmajg2.addItem(
									new sap.ui.core.Item({
										key : oData.results[i].Ecode,
										text : oData.results[i].Etext
									})
								);
								oZzmajg3.addItem(
									new sap.ui.core.Item({
										key : oData.results[i].Ecode,
										text : oData.results[i].Etext
									})
								);
							}
							
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
		
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "전공그룹"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		
	
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oZzmajg1
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "전공"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oZzmajo1 = new sap.m.Input(oController.PAGEID + "_Sub02_Zzmajo1", {
			width : "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.onDisplaySearchFaartCodeDialog,
			customData: new sap.ui.core.CustomData({key : "Key", value : ""})
		}).addStyleClass("L2PFontFamily");
	
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oZzmajo1
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();    
/////// 복수전공그룹
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "복수전공그룹"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oZzmajg2
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "복수전공"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oZzmajo2 = new sap.m.Input(oController.PAGEID + "_Sub02_Zzmajo2", {
			width : "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.onDisplaySearchFaartCodeDialog,
			customData: new sap.ui.core.CustomData({key : "Key", value : ""})
		}).addStyleClass("L2PFontFamily");
	
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oZzmajo2
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		oRequestLayout.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();   
/////// 부전공그룹
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "부전공그룹"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oZzmajg3
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: "부전공"}).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		var oZzmajo3 = new sap.m.Input(oController.PAGEID + "_Sub02_Zzmajo3", {
			width : "95%",
			showValueHelp: true,
			valueHelpOnly: true,
			valueHelpRequest: oController.onDisplaySearchFaartCodeDialog,
			customData: new sap.ui.core.CustomData({key : "Key", value : ""})
		}).addStyleClass("L2PFontFamily");
	
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : oZzmajo3
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);
		oRequestLayout.addRow(oRow);
		
        var oRequestPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : "학력사항", design : "Bold"}).addStyleClass("L2PFontFamily L2PFontBold"),
				           new sap.m.ToolbarSpacer()]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oRequestLayout]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_Sub02_Dialog",{
			content :[oRequestPanel] ,
			contentWidth : "1024px",
			contentHeight : "368px",
			showHeader : true,
			beforeOpen : oController.onBeforeOpenDialog,
			title : "학력사항",
			beginButton : new sap.m.Button({text : "저장", icon: "sap-icon://save", press : oController.onPressSave}), //
			endButton : new sap.m.Button({text : "닫기", icon: "sap-icon://decline", press : oController.onClose}),
		});
		
//		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };
		
		return oDialog;
	}

});
