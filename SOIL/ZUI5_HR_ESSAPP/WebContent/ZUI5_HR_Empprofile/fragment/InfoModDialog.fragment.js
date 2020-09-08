sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.InfoModDialog", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		// 기본 정보
		var oContactMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 6,
			widths : ['140px',"" ,'140px', "" ,'140px', "" ]
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1809") }).addStyleClass("FontFamilyBold"),	// 1809:사내전화
			
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
	           value: "{Bizpno}",
	           width : "100%"
		   }).addStyleClass("FontFamily"),
			
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2377") }).addStyleClass("FontFamilyBold"),	// 2377:휴대폰번호
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
	           value: "{Cellpno}",
	           width : "100%" 
		   }).addStyleClass("FontFamily"),
			
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2194") }).addStyleClass("FontFamilyBold"),	// 2194:집전화번호
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
	           value: "{Homepno}",
	           width : "100%"
		   }).addStyleClass("FontFamily"),
			
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oContactMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2295") }).addStyleClass("FontFamilyBold"),	// 2295:팩스번호
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
	           value: "{Faxno}",
	           width : "100%"
		   }).addStyleClass("FontFamily"),
			
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_1803") }).addStyleClass("FontFamilyBold"),	// 1803:비상연락망
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
	           value: "{Empno}",
	           width : "100%"
		   }).addStyleClass("FontFamily"),
			
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2346") }).addStyleClass("FontFamilyBold"),	// 2346:회사 e-mail 주소
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
	           value: "{Email}",
	           width : "100%",
	           editable : false,
		   }).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oContactMatrix.addRow(oRow);
		
		// 기본 정보
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 5,
			layoutFixed : false,
			widths : ['140px','30px','120px','70px','700px']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2327") }).addStyleClass("FontFamilyBold"),	// 2327:현 거주지
			rowSpan : 4,
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
	            width : "100%",
	            value : "{Pstlz1}",
				showValueHelp: true,
				valueHelpOnly: true,
				valueHelpRequest: oController.onDisplaySearchZipcodeDialog,
	            textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("FontFamily"),
		   colSpan : 2
		}).addStyleClass("MatrixData2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			 colSpan : 2,
	         content : new sap.m.Input({
	            width : "100%",
	            value : "{Zzaddr1Kr1}",
	            editable : false,
	            maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "PersonInfoAppl", "Zzaddr1Kr1"),
	            textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("FontFamily") ,
		}).addStyleClass("MatrixData2");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : new sap.m.Label({
	           text: ""
		   }).addStyleClass("FontFamilyBold"),
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			 colSpan : 2,
	         content : new sap.m.Input({
				width : "100%",
				value : "{Zzaddr2Kr1}",
	            editable : true,
	            maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "PersonInfoAppl", "Zzaddr2Kr1"),
	        	textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("FontFamily") ,
		}).addStyleClass("MatrixData3");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			rowSpan : 2,
			content : new sap.m.Label({
	            width : "100px",
	            text : oBundleText.getText("LABEL_1971"),	// 1971:영문주소
			    textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("FontFamilyBold"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			 content : new sap.m.Input({
	            width : "100%",
	            value : "{Zzaddr1En1}",
	            editable : false,
	            maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "PersonInfoAppl", "Zzaddr1En1"),
	            textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("FontFamily") ,
		}).addStyleClass("MatrixData2");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"30px"});
//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
//			colSpan : 2,
//			content : new sap.m.Label({
//	           text: ""
//		   }).addStyleClass("FontFamilyBold"),
//		});
//		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			 colSpan : 2,
	         content : new sap.m.Input({
				width : "100%",
				value : "{Zzaddr2En1}",
	            editable : true,
	            maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "PersonInfoAppl", "Zzaddr2En1"),
	        	textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("FontFamily") ,
		}).addStyleClass("MatrixData3");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			rowSpan : 4,
			
			content : new sap.m.Label({text : oBundleText.getText("LABEL_2141") }).addStyleClass("FontFamilyBold"),	// 2141:주민등록지
		}).addStyleClass("MatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : new sap.m.Input({
	            width : "100%",
	            value : "{Pstlz2}",
				showValueHelp: true,
				valueHelpOnly: true,
				valueHelpRequest: oController.onDisplaySearchZipcodeDialog2,
	            textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("FontFamily"),
		}).addStyleClass("MatrixData2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			 colSpan : 2,
	         content : new sap.m.Input({
	            width : "100%",
	            value : "{Zzaddr1Kr2}",
	            editable : false,
				textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("FontFamily") ,
		}).addStyleClass("MatrixData2");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : new sap.m.Label({
	           text: ""
		   }).addStyleClass("FontFamily"),
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			 colSpan : 2,
	         content : new sap.m.Input({
				width : "100%",
				value : "{Zzaddr2Kr2}",
	            editable : true,
	            maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "PersonInfoAppl", "Zzaddr2Kr2"),
				textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("FontFamily") ,
		}).addStyleClass("MatrixData3");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			rowSpan : 2,
			content : new sap.m.Label({
	            width : "100px",
	            text : oBundleText.getText("LABEL_1971"),	// 1971:영문주소
			    textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("FontFamilyBold"),
		}).addStyleClass("MatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			 colSpan : 2,
	         content : new sap.m.Input({
	            width : "100%",
	            value : "{Zzaddr1En2}",
	            editable : false,
	            maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "PersonInfoAppl", "Zzaddr1En2"),
	            textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("FontFamily") ,
		}).addStyleClass("MatrixData2");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"30px"});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			 colSpan : 2,
	         content : new sap.m.Input({
				width : "100%",
				value : "{Zzaddr2En2}",
	            editable : true,
	            maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "PersonInfoAppl", "Zzaddr2En2"),
	        	textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("FontFamily") ,
		}).addStyleClass("MatrixData3");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		var oCloseButton = new sap.m.Button({
			text : oBundleText.getText("LABEL_0071"),	// 71:취소
			icon :"sap-icon://decline" ,
			press : function(oEvent){
				oDialog.close();
			}
		});
		var oDialog = new sap.m.Dialog({
			content :[oContactMatrix, 
				      new sap.ui.core.HTML({content : "<div style='height : 10px;'/>"}),
				      oMatrix] ,
			contentWidth : "1070px",
			showHeader : true,
			title : oBundleText.getText("LABEL_2143"),	// 2143:주소 및 연락처 변경
			beginButton : new sap.m.Button({text : oBundleText.getText("LABEL_0177"),  icon :"sap-icon://save", press : oController.onSaveDialog}),	// 177:저장
			endButton : oCloseButton,
			afterOpen : oController.afterOpenInfoModDial
		}).setModel(oController._DialogJsonModel)
		.bindElement("/Data");
		
//		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
//	    };
		

		return oDialog;
	}

});
