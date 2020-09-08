sap.ui.jsview("zui5_hrxx_actapp.ActAppPersonInfo", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5_hrxx_actapp.ActAppPersonInfo
	*/ 
	getControllerName : function() {
		return "zui5_hrxx_actapp.ActAppPersonInfo";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5_hrxx_actapp.ActAppPersonInfo
	*/ 
	createContent : function(oController) {
		
		var oCell, oRow;
		
		var oMainLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 2,
			//widths: ["300px"],
		});
		
		var oObjectListItem = new sap.m.ObjectListItem({
			title: "{Ename}",
			//icon : "sap-icon://person-placeholder",
			attributes  : [
			               new sap.m.ObjectAttribute({text : {
			   		    	parts : [{path : "Zzjobgrtx"}, {path : "Zzcaltltx"}, {path : "Zzpsgrptx"}],
					    	formatter : function(v1, v2, v3) {
					    		console.log("D : " + v1 + "," + v2 + ", " + v3);
					    		if(v1 == undefined || v2 == undefined || v3 == undefined) return "";
					    		return v1 + " / " + v2 + " / " + v3;
					    	}}}),
					    	new sap.m.ObjectAttribute({text : "{Fulln}"}),
					]
		});
		
		var oCustomListItem = new sap.m.CustomListItem({
			content : new sap.suite.ui.commons.BusinessCard({
				firstTitle: new sap.ui.commons.Label({text:"{Ename}"}).addStyleClass("L2P13Font L2P13FontBold"),
			    iconPath: "/sap/bc/ui5_ui5/sap/zhrxx_common/images/person.png",
			    secondTitle: {
	   		    	parts : [{path : "Zzjobgrtx"}, {path : "Zzcaltltx"}, {path : "Zzpsgrptx"}],
			    	formatter : function(v1, v2, v3) {
			    		if(v1 == undefined || v2 == undefined || v3 == undefined) return "";
			    		return v1 + " / " + v2 + " / " + v3;
			    	}},
			    content : new sap.ui.commons.Label({text:"{Fulln}"}).addStyleClass("L2P13Font")
			}).addStyleClass("L2P13Font")
		});
		
		var oList = new sap.m.List(oController.PAGEID + "_List", {
			//width : "300px",
			showNoData : true,
			noDataText : oBundleText.getText( "MSG_NOSUBJECTDATA"),
			mode : sap.m.ListMode.MultiSelect,
			selectionChange : oController.onSelectPersonList,
			rememberSelections : false,
			items : {
				path : "/ActionSubjectListSet",
				template : oCustomListItem
			}
		}).addStyleClass("L2PListMinWidth");
		oList.setModel(sap.ui.getCore().getModel("ActionSubjectList_Temp"));
		
		var oLeftScrollContainer = new sap.m.ScrollContainer(oController.PAGEID + "_LeftScrollContainer", {
			content : oList,
			width: "100%",
			height : "500px",
			horizontal : false,
			vertical : true
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [oLeftScrollContainer]
		}).addStyleClass("L2PBackgroundWhite");
		
		oRow.addCell(oCell);
		
		var oInputLayout = new sap.ui.commons.layout.VerticalLayout();
		
		var oIssuedDatePanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://calendar", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText( "ACTDA"), design : "Bold", width: "95px"}).addStyleClass("L2P13Font"),
				           new sap.m.DatePicker(oController.PAGEID + "_Actda", {
				        	   width : "200px",
				   			   valueFormat : "yyyy-MM-dd",
				           	   displayFormat : gDtfmt,
				           	   change : oController.onChangeActda
				   		   }),
				   		   new sap.m.Button(oController.PAGEID + "_ChangeDate",{
				   			   text : oBundleText.getText( "MODIFY_BTN"),
				   			   type : "Emphasized",
				   			   visible : false,
				   			   press : oController.onPressChangeDate
				   		   })
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : []
		});
		
		oInputLayout.addContent(oIssuedDatePanel);
		
		var oCell1, oRow1;
		
		var oIssuedTypeMatrix = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : true,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
		for(var i=0; i<5; i++) {
			oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text : oBundleText.getText( "MASSN" + (i+1))})]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           new sap.m.Select(oController.PAGEID + "_Massn" + (i+1), {
				        	   width : "95%",
				        	   enabled : false,
				        	   change : oController.onChangeMassn
				           })
				           ]
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text : oBundleText.getText("MASSG" + (i+1))})]
			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
			oRow1.addCell(oCell1);
			
			oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [
				           new sap.m.Select(oController.PAGEID + "_Massg" + (i+1), {
				        	   width : "95%",
				        	   enabled : false,
				        	   change : oController.onChangeMassg
				           })
				           ]
			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
			oRow1.addCell(oCell1);
			
			oIssuedTypeMatrix.addRow(oRow1);
		}
		
//		oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text : oBundleText.getText( "MASSN1")})]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
//		oRow1.addCell(oCell1);
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [
//			           new sap.m.Select(oController.PAGEID + "_Massn1", {
//			        	   width : "95%",
//			        	   enabled : false,
//			        	   change : oController.onChangeMassn
//			           })
//			           ]
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow1.addCell(oCell1);
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text : oBundleText.getText("MASSG1")})]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
//		oRow1.addCell(oCell1);
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [
//			           new sap.m.Select(oController.PAGEID + "_Massg1", {
//			        	   width : "95%",
//			        	   enabled : false,
//			        	   change : oController.onChangeMassg
//			           })
//			           ]
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow1.addCell(oCell1);
//		
//		oIssuedTypeMatrix.addRow(oRow1);
//		
//		oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text : oBundleText.getText( "MASSN2")})]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
//		oRow1.addCell(oCell1);
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [
//			           new sap.m.Select(oController.PAGEID + "_Massn2", {
//			        	   width : "95%",
//			        	   enabled : false,
//			        	   change : oController.onChangeMassn
//			           })
//			           ]
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow1.addCell(oCell1);
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text : oBundleText.getText("MASSG2")})]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
//		oRow1.addCell(oCell1);
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [
//			           new sap.m.Select(oController.PAGEID + "_Massg2", {
//			        	   width : "95%",
//			        	   enabled : false,
//			        	   change : oController.onChangeMassg
//			           })
//			           ]
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow1.addCell(oCell1);
//		
//		oIssuedTypeMatrix.addRow(oRow1);
//		
//		oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text : oBundleText.getText( "MASSN3")})]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
//		oRow1.addCell(oCell1);
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [
//			           new sap.m.Select(oController.PAGEID + "_Massn3", {
//			        	   width : "95%",
//			        	   enabled : false,
//			        	   change : oController.onChangeMassn
//			           })
//			           ]
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow1.addCell(oCell1);
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text : oBundleText.getText("MASSG3")})]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
//		oRow1.addCell(oCell1);
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [
//			           new sap.m.Select(oController.PAGEID + "_Massg3", {
//			        	   width : "95%",
//			        	   enabled : false,
//			        	   change : oController.onChangeMassg
//			           })
//			           ]
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow1.addCell(oCell1);
//		
//		oIssuedTypeMatrix.addRow(oRow1);
//		
//		oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text : oBundleText.getText( "MASSN4")})]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
//		oRow1.addCell(oCell1);
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [
//			           new sap.m.Select(oController.PAGEID + "_Massn4", {
//			        	   width : "95%",
//			        	   enabled : false,
//			        	   change : oController.onChangeMassn
//			           })
//			           ]
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow1.addCell(oCell1);
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text : oBundleText.getText("MASSG4")})]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
//		oRow1.addCell(oCell1);
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [
//			           new sap.m.Select(oController.PAGEID + "_Massg4", {
//			        	   width : "95%",
//			        	   enabled : false,
//			        	   change : oController.onChangeMassg
//			           })
//			           ]
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow1.addCell(oCell1);
//		
//		oIssuedTypeMatrix.addRow(oRow1);
//		
//		oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text : oBundleText.getText( "MASSN5")})]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
//		oRow1.addCell(oCell1);
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [
//			           new sap.m.Select(oController.PAGEID + "_Massn5", {
//			        	   width : "95%",
//			        	   enabled : false,
//			        	   change : oController.onChangeMassn
//			           })
//			           ]
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow1.addCell(oCell1);
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [new sap.m.Label({text : oBundleText.getText("MASSG5")})]
//		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
//		oRow1.addCell(oCell1);
//		
//		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
//			hAlign : sap.ui.commons.layout.HAlign.Begin,
//			vAlign : sap.ui.commons.layout.VAlign.Middle,
//			content : [
//			           new sap.m.Select(oController.PAGEID + "_Massg5", {
//			        	   width : "95%",
//			        	   enabled : false,
//			        	   change : oController.onChangeMassg
//			           })
//			           ]
//		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//		oRow1.addCell(oCell1);
//		
//		oIssuedTypeMatrix.addRow(oRow1);
		
		var oActTypeReasonPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://accounting-document-verification", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ACT_TYPE_REASON"), design : "Bold"}).addStyleClass("L2P13Font"),
//				           new sap.m.ToolbarSpacer({width: "10px"}),
//				           new sap.m.Label({text : oBundleText.getText("MSG_MASSN_NOTICE")}).addStyleClass("L2P12Font L2P12Notice"),
//				           new sap.m.ToolbarSpacer(),
//				           new sap.m.Label({text : oBundleText.getText("ACT_INPUT")}).addStyleClass("L2P13Font"),
//				           new sap.m.Switch(oController.PAGEID + "_Input_Switch", {enabled : false, change : oController.onChangeSwitch}),
//				           new sap.m.ToolbarSpacer({width: "10px"})
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oIssuedTypeMatrix]
		});
		
		oInputLayout.addContent(oActTypeReasonPanel);
		
		var oCell2, oRow2 = null;
		
		var oIssuedHistoryMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_MatrixLayout", {
			width : "100%",
			layoutFixed : true,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
//		var vControls = [{id : "Werks", label : oBundleText.getText("PBTXT"), control : "select"},
//		                 {id : "Btrtl", label : oBundleText.getText("BTRTX"), control : "select"},
//		                 {id : "Orgeh", label : oBundleText.getText("FULLN"), control : "orgeh"},
//		                 {id : "Zzempwp", label : oBundleText.getText("ZZEMPWPTX"), control : "select"},
//		                 {id : "Stell", label : oBundleText.getText("STETX"), control : "stell"},
//		                 {id : "Zzdcmcg", label : oBundleText.getText("ZZDCMCGTX"), control : "select"},
//		                 {id : "Persg", label : oBundleText.getText("PGTXT"), control : "select"},
//		                 {id : "Persk", label : oBundleText.getText("PKTXT"), control : "select"},
//		                 {id : "Zzjobgr", label : oBundleText.getText("ZZJOBGRTX"), control : "select"},
//		                 {id : "Zzjobsr", label : oBundleText.getText("ZZJOBSRTX"), control : "select"},
//		                 {id : "Zzcaltl", label : oBundleText.getText("ZZCALTLTX"), control : "select"},
//		                 {id : "Zzmaltl", label : oBundleText.getText("ZZMALTLTX"), control : "select"},
//		                 {id : "Zzpsgrp", label : oBundleText.getText("ZZPSGRPTX"), control : "select"},
//		                 {id : "Zzrollv", label : oBundleText.getText("ZZROLLVTX"), control : "select"},
//		                 {id : "Zzjobcl", label : oBundleText.getText("ZZJOBCLTX"), control : "select"},
//		                 {id : "Zzempty", label : oBundleText.getText("ZZEMPTYTX"), control : "select"},
//		                 {id : "Zzprdct", label : oBundleText.getText("ZZPRDCTTX"), control : "select"},
//		                 {id : "Zzprdar", label : oBundleText.getText("ZZPRDARTX"), control : "select"},
//		                 {id : "StellSub", label : oBundleText.getText("STELLSUBTX"), control : "select"}, //부직무
//		                 {id : "Zzautyp", label : oBundleText.getText("ZZAUTYPTX"), control : "select"}, //권한그룹
//		                 {id : "Zzlotax", label : oBundleText.getText("ZZLOTAXTX"), control : "select"}, //지방세남부기준
//		                 {id : "Zzdirec", label : oBundleText.getText("ZZDIRECTX"), control : "select"}, //직/간접 구분
//		                 {id : "Zzcalpg", label : oBundleText.getText("ZZCALPGTX"), control : "select"}, //메일직책
//		                ];
//		
//		for(var i=0; i<vControls.length; i++) {
//			if((i % 2) == 0) {
//				if(i != 0) {
//					oIssuedHistoryMatrix.addRow(oRow2);
//				}
//				oRow2 = new sap.ui.commons.layout.MatrixLayoutRow();
//			}
//			
//			oCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
//				hAlign : sap.ui.commons.layout.HAlign.Begin,
//				vAlign : sap.ui.commons.layout.VAlign.Middle,
//				content : [new sap.m.Label({text : vControls[i].label})]
//			}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
//			oRow2.addCell(oCell2);
//			
//			var oControl = null;
//			if(vControls[i].control == "select") {
//				oControl = new sap.m.Select(oController.PAGEID + "_" + vControls[i].id, {
//		        	   width : "300px",
//		        	   enabled : false
//		        }).addStyleClass("L2P13Font");
//				if(vControls[i].id == "Werks") {
//					oControl.attachChange(oController.onPressWerks);
//				}
//			} else if(vControls[i].control == "orgeh") {
//				oControl = new sap.m.Input(oController.PAGEID + "_" + vControls[i].id, {
//		        	   width : "300px",
//		        	   enabled : false,
//		        	   showValueHelp: true,
//					   valueHelpRequest: oController.displayOrgSearchDialog
//		        }).addStyleClass("L2P13Font");
//			} else if(vControls[i].control == "stell") {
//				oControl = new sap.m.Input(oController.PAGEID + "_" + vControls[i].id, {
//		        	   width : "300px",
//		        	   enabled : false,
//		        	   showValueHelp: true,
//					   valueHelpRequest: oController.displayStellSearchDialog
//		        }).addStyleClass("L2P13Font");
//			} else if(vControls[i].control == "stellSub") {
//				oControl = new sap.m.Input(oController.PAGEID + "_" + vControls[i].id, {
//		        	   width : "300px",
//		        	   enabled : false,
//		        	   showValueHelp: true,
//					   valueHelpRequest: oController.displayStellSearchDialog
//		        }).addStyleClass("L2P13Font");
//			}
//			
//			oCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
//				hAlign : sap.ui.commons.layout.HAlign.Begin,
//				vAlign : sap.ui.commons.layout.VAlign.Middle,
//				content : oControl
//			}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
//			oRow2.addCell(oCell2);
//		}
//		oIssuedHistoryMatrix.addRow(oRow2);		
		
		var oActdHistoryPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			headerToolbar : new sap.m.Toolbar({
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.ui.core.Icon({src : "sap-icon://expense-report", size : "1.0rem", color : "#666666"}),
				           new sap.m.Label({text : oBundleText.getText("ACT_INFO"), design : "Bold"}).addStyleClass("L2P13Font"),
				           new sap.m.ToolbarSpacer({width: "10px"}),
				           new sap.m.Label({text : oBundleText.getText("MSG_MASSN_NOTICE"), visible : true}).addStyleClass("L2P12Font L2P12Notice"),
				           new sap.m.ToolbarSpacer(),
				           new sap.m.Label({text : oBundleText.getText("ACT_INPUT"), visible : true}).addStyleClass("L2P13Font"),
				           new sap.m.Switch(oController.PAGEID + "_Input_Switch", {visible : true, enabled : false, change : oController.onChangeSwitch}),
				           new sap.m.ToolbarSpacer({width: "10px"}),				           
				           ]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content : [oIssuedHistoryMatrix]
		});
		
		oInputLayout.addContent(oActdHistoryPanel);
		
		var oRightScrollContainer = new sap.m.ScrollContainer(oController.PAGEID + "_RightScrollContainer", {
			content : oInputLayout,
			width: "100%",
			height : "500px",
			horizontal : false,
			vertical : true
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Top,
			content : [oRightScrollContainer]
		});
		
		oRow.addCell(oCell);
		
		oMainLayout.addRow(oRow);
		
		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT",  {
			width : "100%",
			content : [ //new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
			            oMainLayout
			           ]
		});
		
		var oFooterBar = new sap.m.Bar({
			contentLeft : [
			               
			               new sap.m.Button(oController.PAGEID + "_ADDPERSON_BTN", {
			            	   text : oBundleText.getText( "ADDPERSON_BTN"),
			            	   press : oController.addPerson
			               }),
			               //new sap.m.ToolbarSpacer(), 
			               new sap.m.Button(oController.PAGEID + "_ALLSELECT_BTN", {
			            	   text : oBundleText.getText("ALL_SEL_BTN"),
			            	   press : oController.onPressAllSelect
			               }),
			               new sap.m.Button(oController.PAGEID + "_ALLUNSELECT_BTN", {
			            	   text : oBundleText.getText("ALL_UNSEL_BTN"),
			            	   press : oController.onPressAllUnSelect
			               }),
			               ],
		 	contentRight : [         
		 	                new sap.m.Button(oController.PAGEID + "_SAVEPERSON_BTN", {
		 	                	text : oBundleText.getText( "SAVE_BTN"),
		 	                	enabled : false,
		 	                	press : oController.onPressSave
		 	                }),
		 	                new sap.m.Button({
		 	                	text : oBundleText.getText( "CANCEL_BTN"),
		 	                	press : oController.navToBack
		 	                })
		 	                ]
		}); 
		
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			content : [oLayout],
			customHeader : new sap.m.Bar({
								contentLeft : new sap.m.Button({
												icon : "sap-icon://nav-back" ,
												press: oController.navToBack
											}),
								contentMiddle : new sap.m.Text(oController.PAGEID + "_PAGETITLE", {
									   			text : oBundleText.getText( "ACT_PERSONS")
								}).addStyleClass("L2PPageTitle"),
								contentRight : new sap.m.Button(oController.PAGEID + "_HELP", {
													icon : "sap-icon://question-mark", visible:false,
													press : common.Common.displayHelp
												})
							}).addStyleClass("L2PHeaderBar") ,
			footer : oFooterBar 
		}) ;
		
		return oPage ;
	}

});