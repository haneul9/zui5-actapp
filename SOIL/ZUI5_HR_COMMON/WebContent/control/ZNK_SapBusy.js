jQuery.sap.declare("control.ZNK_SapBusy");
//CREATED BY TWKIM (L2P)
control.ZNK_SapBusy = {
	oBusy : function(oTitle, oText, oText2){
		var oBusyDialog = new sap.m.Dialog({
			title : oTitle
		});
		var c = sap.ui.commons;
		var oRow, oCell;
		var oMatrix = new c.layout.MatrixLayout();
		oRow = new c.layout.MatrixLayoutRow();
		oCell = new c.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			content : new sap.m.Text({text : oText}).addStyleClass("L2Pfont16")
		});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		oRow = new c.layout.MatrixLayoutRow();
		oCell = new c.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			content : new sap.m.Text({text : oText2}).addStyleClass("L2Pfont16")
		});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		oRow = new c.layout.MatrixLayoutRow({height : "10px"});
		oCell = new c.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		oRow = new c.layout.MatrixLayoutRow();
		oCell = new c.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			content : new sap.m.BusyIndicator()
		});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);		
		oBusyDialog.addContent(oMatrix);
		oBusyDialog.setContentWidth("300px");
		return oBusyDialog;		
	},		
	
	oBusyClose : function(oDialog, oFlag, ErrorMessage, oPAGEID){
		oDialog.close();
//		console.log("ERROR : " + oFlag);
		if(oFlag == "S"){
//			sap.m.MessageToast.show("저장 되었습니다.");
//			sap.m.MessageBox.alert("저장 되었습니다.",{title : oBundleText.getText("LABEL_0052")});	// 52:안내
//			common.Common.setMessage(oPAGEID,"저장 되었습니다.");
		}else if(oFlag == "A"){
//			sap.m.MessageToast.show("승인처리가 완료 되었습니다.");
//			common.Common.setMessage(oPAGEID,"승인처리가 완료 되었습니다.");
		}else if(oFlag == "R"){
//			sap.m.MessageToast.show("반려처리가 완료 되었습니다.");
//			common.Common.setMessage(oPAGEID,"반려처리가 완료 되었습니다.");
		}else if(oFlag == "D"){
		}else if(oFlag == "X"){
		}else if(oFlag == "P"){
		}else if(oFlag == "V"){
		}else if(oFlag == "WF"){
		}else if(oFlag == "WF2"){
		}else if(oFlag == "WF3"){
		}else if(oFlag == "E"){	
			if(ErrorMessage != "") {
				control.ZNK_SapBusy.oErrorMessage(ErrorMessage);
//				common.Common.setMessage(oPAGEID,ErrorMessage);
			}			
		}else{
			sap.m.MessageToast.show(oBundleText.getText("LABEL_2854"));	// 2854:조회가 완료 되었습니다.
//			common.Common.setMessage(oPAGEID,oBundleText.getText("LABEL_2854"));	// 2854:조회가 완료 되었습니다.
		}		
	},
	
	oErrorMessage : function(ErrorMessage){
		return sap.m.MessageBox.error(ErrorMessage,{title : oBundleText.getText("LABEL_0053")});	// 53:오류
	},
	
	oBusy2 : function(oController, oTitle, oText, oText2, oText3){
		var oBusyDialog = new sap.m.Dialog({
			title : oTitle
		});
		var c = sap.ui.commons;
		var oRow, oCell;
		var oMatrix = new c.layout.MatrixLayout();
		oRow = new c.layout.MatrixLayoutRow();
		oCell = new c.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			content : new sap.m.Text({text : oText}).addStyleClass("L2Pfont16")
		});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		oRow = new c.layout.MatrixLayoutRow();
		oCell = new c.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			content : new sap.m.Text({text : oText2}).addStyleClass("L2Pfont16")
		});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oRow = new c.layout.MatrixLayoutRow();
		oCell = new c.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			content : new sap.m.Text(oController.PAGEID + "_ProgressInfo", {text : oText3}).addStyleClass("L2Pfont16")
		});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		
		oRow = new c.layout.MatrixLayoutRow({height : "10px"});
		oCell = new c.layout.MatrixLayoutCell();
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);
		oRow = new c.layout.MatrixLayoutRow();
		oCell = new c.layout.MatrixLayoutCell({
			hAlign : sap.ui.commons.layout.HAlign.Center,
			content : new sap.m.BusyIndicator()
		});
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);		
		oBusyDialog.addContent(oMatrix);
		oBusyDialog.setContentWidth("300px");
		return oBusyDialog;		
	},		

};