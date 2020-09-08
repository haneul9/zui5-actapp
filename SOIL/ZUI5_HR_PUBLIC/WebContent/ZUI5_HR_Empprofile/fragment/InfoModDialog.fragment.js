sap.ui.jsfragment("ZUI5_HR_Empprofile.fragment.InfoModDialog", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	 
	createContent : function(oController) {
		// 기본 정보
		var oContactMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 6,
			widths : ['','20%','','20%','','20%']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"40px"}).addStyleClass("L2PMatrixData");
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "사내전화" }).addStyleClass("L2PFontFamily"),
			hAlign : "Center",
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4 L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
	           value: "{Bizpno}",
	           width : "95%"
		   }).addStyleClass("L2PFontFamily"),
			hAlign : "Center",
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "휴대폰번호" }).addStyleClass("L2PFontFamily"),
			hAlign : "Center",
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4 L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
	           value: "{Cellpno}",
	           width : "95%" 
		   }).addStyleClass("L2PFontFamily"),
			hAlign : "Center",
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "집전화번호" }).addStyleClass("L2PFontFamily"),
			hAlign : "Center",
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4 L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
	           value: "{Homepno}",
	           width : "95%"
		   }).addStyleClass("L2PFontFamily"),
			hAlign : "Center",
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4");
		oRow.addCell(oCell);
		oContactMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"40px"}).addStyleClass("L2PMatrixData");
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "팩스번호" }).addStyleClass("L2PFontFamily"),
			hAlign : "Center",
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4 L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
	           value: "{Faxno}",
	           width : "95%"
		   }).addStyleClass("L2PFontFamily"),
			hAlign : "Center",
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "비상연락망" }).addStyleClass("L2PFontFamily"),
			hAlign : "Center",
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4 L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
	           value: "{Empno}",
	           width : "95%"
		   }).addStyleClass("L2PFontFamily"),
			hAlign : "Center",
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "회사 e-mail 주소" }).addStyleClass("L2PFontFamily"),
			hAlign : "Center",
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4 L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Input({
	           value: "{Email}",
	           width : "95%"
		   }).addStyleClass("L2PFontFamily"),
			hAlign : "Center",
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4");
		oRow.addCell(oCell);
		oContactMatrix.addRow(oRow);
		
		// 기본 정보
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 5,
			widths : ['150px','20px','100px','50px','700px']
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"38px"}).addStyleClass("L2PMatrixTopRight");
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({text : "현 거주지" }).addStyleClass("L2PFontFamily"),
			rowSpan : 4,
			hAlign : "Center",
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4 L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({})
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Right",
			content : new sap.m.Input({
	            width : "100px",
	            value : "{Pstlz1}",
				showValueHelp: true,
				valueHelpOnly: true,
				valueHelpRequest: oController.onDisplaySearchZipcodeDialog,
	            textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			 colSpan : 2,
	         content : new sap.m.Input({
	            width : "100%",
	            value : "{Zzaddr1Kr1}",
	            editable : false,
	            maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "PersonInfoAppl", "Zzaddr1Kr1"),
	            textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("L2PFontFamily") ,
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4 L2PPaddingLeft10");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"38px"}).addStyleClass("L2PMatrixRight");
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : new sap.m.Label({
	           text: ""
		   }).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			 colSpan : 2,
	         content : new sap.m.Input({
				width : "100%",
				value : "{Zzaddr2Kr1}",
	            editable : true,
	            maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "PersonInfoAppl", "Zzaddr2Kr1"),
	        	textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("L2PFontFamily") ,
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4 L2PPaddingLeft10");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"38px"}).addStyleClass("L2PMatrixRight");
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({})
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Right",
			content : new sap.m.Label({
	            width : "100px",
	            text : "영문주소",
			    textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			 colSpan : 2,
	         content : new sap.m.Input({
	            width : "100%",
	            value : "{Zzaddr1En1}",
	            editable : false,
	            maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "PersonInfoAppl", "Zzaddr1En1"),
	            textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("L2PFontFamily") ,
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4 L2PPaddingLeft10");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"38px"}).addStyleClass("L2PMatrixBottomRight");
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : new sap.m.Label({
	           text: ""
		   }).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			 colSpan : 2,
	         content : new sap.m.Input({
				width : "100%",
				value : "{Zzaddr2En1}",
	            editable : true,
	            maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "PersonInfoAppl", "Zzaddr2En1"),
	        	textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("L2PFontFamily") ,
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4 L2PPaddingLeft10");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"38px"}).addStyleClass("L2PMatrixTopRight");
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			rowSpan : 4,
			hAlign : "Center",
			content : new sap.m.Label({text : "주민등록지" }).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4 L2PMatrixLabel");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({})
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Right",
			content : new sap.m.Input({
	            width : "100px",
	            value : "{Pstlz2}",
				showValueHelp: true,
				valueHelpOnly: true,
				valueHelpRequest: oController.onDisplaySearchZipcodeDialog2,
	            textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("L2PFontFamily L2PPaddingBottom0 L2PPaddingTop4"),
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			 colSpan : 2,
	         content : new sap.m.Input({
	            width : "100%",
	            value : "{Zzaddr1Kr2}",
	            editable : false,
				textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("L2PFontFamily L2PPaddingBottom0 L2PPaddingTop4") ,
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4 L2PPaddingLeft10");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"38px"}).addStyleClass("L2PMatrixRight");
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : new sap.m.Label({
	           text: ""
		   }).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			 colSpan : 2,
	         content : new sap.m.Input({
				width : "100%",
				value : "{Zzaddr2Kr2}",
	            editable : true,
	            maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "PersonInfoAppl", "Zzaddr2Kr2"),
				textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("L2PFontFamily L2PPaddingBottom0 L2PPaddingTop4") ,
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4 L2PPaddingLeft10");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"38px"}).addStyleClass("L2PMatrixRight");
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content : new sap.m.Label({})
		});
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign : "Right",
			content : new sap.m.Label({
	            width : "100px",
	            text : "영문주소",
			    textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			 colSpan : 2,
	         content : new sap.m.Input({
	            width : "100%",
	            value : "{Zzaddr1En2}",
	            editable : false,
	            maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "PersonInfoAppl", "Zzaddr1En2"),
	            textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("L2PFontFamily") ,
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4 L2PPaddingLeft10");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"38px"}).addStyleClass("L2PMatrixBottomRight");
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan : 2,
			content : new sap.m.Label({
	           text: ""
		   }).addStyleClass("L2PFontFamily"),
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4");
		oRow.addCell(oCell);
		
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			 colSpan : 2,
	         content : new sap.m.Input({
				width : "100%",
				value : "{Zzaddr2En2}",
	            editable : true,
	            maxLength : common.Common.getODataPropertyLength("ZHR_PINFO_SRV", "PersonInfoAppl", "Zzaddr2En2"),
	        	textAlign : sap.ui.core.TextAlign.Begin,
		   }).addStyleClass("L2PFontFamily") ,
		}).addStyleClass("L2PPaddingBottom0 L2PPaddingTop4 L2PPaddingLeft10");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		var oCloseButton = new sap.m.Button({
			text : "취소",
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
			title : "주소 및 연락처 변경",
			beginButton : new sap.m.Button({text : "저장",  icon :"sap-icon://save", press : oController.onSaveDialog}), //
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
