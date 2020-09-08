sap.ui.jsfragment("zui5_hrxx_actretire.fragment.RetireSurveyDialog", {
	
	createContent : function(oController) {
		
		jQuery.sap.require("common.Survey");
		
		var RetireReasonCodes = ["10", "12", "28", "26", "20",
		                         "16", "24", "22", "14", "18", "30"];
		
		var oCell = null, oRow = null;
		
		var oSurveyLayout1 = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 1,
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SURVEY_1"), design : sap.m.LabelDesign.Bold}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oSurveyLayout1.createRow(oCell);
		
		for(var i=1; i<11; i++) {
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.ui.commons.RadioButton(oController.PAGEID + "_SURVEY_1_" + i, {
					groupName : "SURVEY_1",
					select : common.Survey.SurveyRadio1,
					key : "" + RetireReasonCodes[i-1], 
					text : oBundleText.getText("SURVEY_1_" + i)}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PPaddingLeft20");
			oSurveyLayout1.createRow(oCell);
		}
		
		var oInput1 = new sap.m.Input(oController.PAGEID + "_SURVEY_1_11_TXT", {
			enabled : false,
			width : "300px",
			value : "",
			liveChange : common.Survey.onChangeText
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.ui.commons.RadioButton(oController.PAGEID + "_SURVEY_1_11", {
				groupName : "SURVEY_1",
				key : RetireReasonCodes[10],
				text : oBundleText.getText("SURVEY_1_11"),
				select : common.Survey.SurveyRadio1}).addStyleClass("L2P13Font"),
				new sap.ui.core.HTML({content : "<span style='padding-left:10px;width:10px'> </span>",	preferDOM : false}),
				oInput1]
		}).addStyleClass("L2PPaddingLeft20");
		oSurveyLayout1.createRow(oCell);
		
		var oSurveyLayout2 = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 6,
			widths : ["60%","8%","8%","8%","8%","8%"]
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SURVEY_2"), design : sap.m.LabelDesign.Bold}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oRow.addCell(oCell);
		
		for(var i=1; i<6; i++) {
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Center,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				content : [new sap.m.Label({text: oBundleText.getText("SURVEY_SAMPLE_" + i)}).addStyleClass("L2P13Font")]
			}).addStyleClass();
			oRow.addCell(oCell);
		}		
		oSurveyLayout2.addRow(oRow);		
		
		var survey2 = [{question: 3}, {question: 3}, {question: 3}, {question: 3}, {question: 3}, {question: 2}];
		
		for(var s=0; s<survey2.length; s++) {
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign : sap.ui.commons.layout.HAlign.Begin,
				vAlign : sap.ui.commons.layout.VAlign.Middle,
				colSpan : 6,
				content : [new sap.m.Label({text: oBundleText.getText("SURVEY_2_" + (s+1)), design : sap.m.LabelDesign.Bold}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PPaddingLeft30");
			oSurveyLayout2.createRow(oCell);
			
			for(var q=0; q<survey2[s].question; q++) {
				oRow = new sap.ui.commons.layout.MatrixLayoutRow();
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [new sap.m.Label({text: oBundleText.getText("SURVEY_2_" + (s+1) + "_" + (q+1))}).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PPaddingLeft40");
				oRow.addCell(oCell);
				
				for(var i=1; i<6; i++) {
					oCell = new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Center,
						vAlign : sap.ui.commons.layout.VAlign.Middle,
						content : [new sap.ui.commons.RadioButton(oController.PAGEID + "_SURVEY_2_" + (s+1) + "_" + (q+1) + "_" + i, {
										key : "" + i, 
										groupName : "SURVEY_2_" + (s+1) + "_" + (q+1),
										select : common.Survey.SurveyRadio2,
								   }).addStyleClass("L2P13Font")]
					}).addStyleClass();
					oRow.addCell(oCell);
				}
				oSurveyLayout2.addRow(oRow);
			}
		}	
		
		var oSurveyLayout3 = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 8,
			widths : ["16%","15%","8%","15%","8%","15%","8%","15%"]
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			cosSpan: 8,
			content : [new sap.m.Label({text: oBundleText.getText("SURVEY_3"), design : sap.m.LabelDesign.Bold}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oSurveyLayout3.createRow(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			cosSpan: 8,
			content : [new sap.ui.commons.RadioButton(oController.PAGEID + "_SURVEY_3_1", {
							key : "1", 
							groupName : "SURVEY_3",
							select : common.Survey.SurveyRadio3,
							text : oBundleText.getText("SURVEY_3_1")
					   }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft30");
		oSurveyLayout3.createRow(oCell);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.End,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SURVEY_3_1_1")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft40");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Input(oController.PAGEID + "_SURVEY_3_1_1", {width : "100%", enabled : false, liveChange : common.Survey.onChangeText}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.End,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SURVEY_3_1_2")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Input(oController.PAGEID + "_SURVEY_3_1_2", {width : "100%", enabled : false, liveChange : common.Survey.onChangeText}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.End,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SURVEY_3_1_3")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Input(oController.PAGEID + "_SURVEY_3_1_3", {width : "100%", enabled : false, liveChange : common.Survey.onChangeText}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.End,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SURVEY_3_1_4")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Input(oController.PAGEID + "_SURVEY_3_1_4", {width : "100%", enabled : false, liveChange : common.Survey.onChangeText}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oSurveyLayout3.addRow(oRow);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			cosSpan: 8,
			content : [new sap.ui.commons.RadioButton(oController.PAGEID + "_SURVEY_3_2", {
				key : "2", 
				groupName : "SURVEY_3",
				select : common.Survey.SurveyRadio3,
				text : oBundleText.getText("SURVEY_3_2")
		   }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft30");
		oSurveyLayout3.createRow(oCell);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.End,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SURVEY_3_2_1")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft40");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Input(oController.PAGEID + "_SURVEY_3_2_1", {width : "100%", enabled : false, liveChange : common.Survey.onChangeText}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.End,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SURVEY_3_2_2")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 3,
			content : [new sap.m.Input(oController.PAGEID + "_SURVEY_3_2_2", {width : "100%", enabled : false, liveChange : common.Survey.onChangeText}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.End,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SURVEY_3_2_3")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Input(oController.PAGEID + "_SURVEY_3_2_3", {width : "100%", enabled : false, liveChange : common.Survey.onChangeText}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oSurveyLayout3.addRow(oRow);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			cosSpan: 8,
			content : [new sap.ui.commons.RadioButton(oController.PAGEID + "_SURVEY_3_3", {
				key : "3", 
				groupName : "SURVEY_3",
				select : common.Survey.SurveyRadio3,
				text : oBundleText.getText("SURVEY_3_3")
		   }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft30");
		oSurveyLayout3.createRow(oCell);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.End,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SURVEY_3_3_1")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft40");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 3,
			content : [new sap.m.Input(oController.PAGEID + "_SURVEY_3_3_1", {width : "100%", enabled : false, liveChange : common.Survey.onChangeText}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.End,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SURVEY_3_3_2")}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			colSpan : 3,
			content : [new sap.m.Input(oController.PAGEID + "_SURVEY_3_3_2", {width : "100%", enabled : false, liveChange : common.Survey.onChangeText}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");		
		oRow.addCell(oCell);
		
		oSurveyLayout3.addRow(oRow);
		
		var oSurveyLayout4 = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 1
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SURVEY_4"), design : sap.m.LabelDesign.Bold}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oSurveyLayout4.createRow(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.TextArea(oController.PAGEID + "_SURVEY_4", {width : "100%", rows : 5, liveChange : common.Survey.onChangeText}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft40");
		oSurveyLayout4.createRow(oCell);
		
		var oSurveyLayout5 = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 1
		});
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.Label({text: oBundleText.getText("SURVEY_5"), design : sap.m.LabelDesign.Bold}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oSurveyLayout5.createRow(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Begin,
			vAlign : sap.ui.commons.layout.VAlign.Middle,
			content : [new sap.m.TextArea(oController.PAGEID + "_SURVEY_5", {width : "100%", rows : 5, liveChange : common.Survey.onChangeText}).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft40");
		oSurveyLayout5.createRow(oCell);
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_RetireSUrvey_Dialog",{
			content :[oSurveyLayout1,
			          new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
			          oSurveyLayout2,
			          new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
			          oSurveyLayout3,
			          new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
			          oSurveyLayout4,
			          new sap.ui.core.HTML({content : "<div style='height:10px'> </div>",	preferDOM : false}),
			          oSurveyLayout5] ,
			contentWidth : "1200px",
			contentHeight : "700px",
			showHeader : true,
			title : oBundleText.getText("TITLE_RETIRE_SURVEY"),
			afterOpen : common.Survey.onAfterOpen,
			beginButton : new sap.m.Button(oController.PAGEID + "_SUBMIT_BTN", {text : oBundleText.getText("SUBMIT_BTN"), icon: "sap-icon://accept", 
				press : common.Survey.onPressSurveyConfirm}),
			endButton : new sap.m.Button({text : oBundleText.getText("CANCEL_BTN"), icon: "sap-icon://sys-cancel-2", 
				press : common.Survey.onRSClose}),
		});
		
		if (!jQuery.support.touch) { 
			oDialog.addStyleClass("sapUiSizeCompact");
	    };		

		return oDialog;
	}

});