/**
 * 
 */

jQuery.sap.declare("common.YeaAttachFileAction");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

common.YeaAttachFileAction = {
		
	setAttachFile : function(oController) {
		var oFileUploader = sap.ui.getCore().byId("yeaUploader");
		
		oFileUploader.setSlug(oController._Pernr + "|" + oController._Zyear);
		
		common.YeaAttachFileAction.refreshAttachFileList(oController);
	},
	
	refreshAttachFileList : function(oController) {
		//console.log("Pernr : " + oController._Pernr);
		//console.log("Zyear : " + oController._Zyear);
		var oAttachFileList = sap.ui.getCore().byId("yeaUploader_AttachFileList");
		var oAttachFileInfo = sap.ui.getCore().byId("yeaUploader_AttachFileInfo");
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, oController._Pernr));
		oFilters.push(new sap.ui.model.Filter("Tyear", sap.ui.model.FilterOperator.EQ, oController._Zyear));
		oAttachFileList.bindItems("/YeaFileList", oAttachFileInfo, null, oFilters);
	},
	
	fileSizeExceed : function (oEvent) {
		var sName = oEvent.getParameter("fileName");
		var fSize = oEvent.getParameter("fileSize");
		var fLimit = this.getMaximumFileSize();
		sap.m.MessageBox.alert("File: " + sName + " is of size " + fSize + " MB which exceeds the file size limit of " + fLimit + " MB.", "ERROR", "File size exceeded");
	},
	
	typeMissmatch : function (oEvent) {
		var oController = common.Common.getController(oEvent);
		var sName = oEvent.getParameter("fileName");
		var sType = oEvent.getParameter("fileType");
		var sMimeType = this.getMimeType();
		console.log("mimetype : " + sMimeType);
		if (!sMimeType) {			
			console.log(sap.ui.getCore().byId(oController.PAGEID + "_1001_ATTACHFILE_BTN"));
			var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_1001_ATTACHFILE_BTN");
	//		sMimeType = oFileUploader.getFileType();
		}
		sap.m.MessageBox.alert(sName + " " + oBundleText.getText("LABEL_2836"), {title : oBundleText.getText("LABEL_0052")});	// 52:안내, 2836:는 허용된 파일 확장자가 아닙니다.
		
	},
	
	uploadComplete: function (oEvent) {
		var oController = common.Common.getController(oEvent);
		
		if(oController.loadDialog && oController.loadDialog.isOpen()) {
			oController.loadDialog.close();
		}
		
		var sResponse = oEvent.getParameter("response");
//2015 변경		
		if(sResponse == "Error: null"){
			sResponse = oBundleText.getText("LABEL_2837");	// 2837:파일 업로드가 완료되었습니다.
		}
		sap.m.MessageBox.alert(sResponse, {title : oBundleText.getText("LABEL_0052")});	// 52:안내
		
		var oFileUploader = sap.ui.getCore().byId("yeaUploader");
		oFileUploader.setValue("");
		
		common.YeaAttachFileAction.refreshAttachFileList(oController);
//		oController.onTab2Refresh(oController);
	},
	
	uploadAborted : function(oEvent) {
		sap.m.MessageBox.alert(oBundleText.getText("LABEL_0166"));	// 166:파일 업로드에 실패하였습니다.
	},
	
	onFileChange : function(oEvent) {
		var oController = common.Common.getController(oEvent);
		
		if(!oController.loadDialog) {
			oController.loadDialog = new sap.m.Dialog({showHeader : false}); 
			oController.loadDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("LABEL_2838")}));	// 2838:파일 업로드 중입니다. 잠시만 기다려 주십시요.
			oController.getView().addDependent(oController.loadDialog);
		} else {
			oController.loadDialog.removeAllContent();
			oController.loadDialog.destroyContent();
			oController.loadDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("LABEL_2838")}));	// 2838:파일 업로드 중입니다. 잠시만 기다려 주십시요.
		}
		if(!oController.loadDialog.isOpen()) {
			oController.loadDialog.open();
		}
	},
	
	onDeleteAttachFile : function(oEvent) {
		var oController = common.Common.getController(oEvent);
		
		if(!oController.loadDialog) {
			oController.loadDialog = new sap.m.Dialog({showHeader : false}); 			
			oController.loadDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("LABEL_2839")}));	// 2839:파일 삭제 중입니다. 잠시만 기다려 주십시요.
			oController.getView().addDependent(oController.loadDialog);
		} else {
			oController.loadDialog.removeAllContent();
			oController.loadDialog.destroyContent();
			oController.loadDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("LABEL_2839")}));	// 2839:파일 삭제 중입니다. 잠시만 기다려 주십시요.
		}
		if(!oController.loadDialog.isOpen()) {
			oController.loadDialog.open();
		}
		
		var oModel = sap.ui.getCore().getModel("ZHR_YEARTAX_SRV");
		oModel.remove(
				"/YeaPdfDel(Pernr='" + oController._Pernr + "',Zyear='" + oController._Zyear + "')",
				null,
			    function (oData, response) {
					sap.m.MessageBox.alert("파일을 삭제하였습니다.", {title : oBundleText.getText("LABEL_0052")});	// 52:안내
					console.log("Sucess Doc Attach File Delete !!!");
//					oController.onTab2Refresh(oController);
			    },
			    function (oError) {
			    	var Err = {};
			    	if(rError2.response) {
				        Err = window.JSON.parse(rError2.response.body);
						sap.m.MessageBox.alert(Err.error.message.value);
			    	} else {
			    		sap.m.MessageBox.alert(rError2);
			    	}
			    	rError = oError;
			    }
		);
		
		if(oController.loadDialog && oController.loadDialog.isOpen()) {
			oController.loadDialog.close();
		}
		
		common.YeaAttachFileAction.refreshAttachFileList(oController);
	},
	
	onDownloadAttachFile : function(oEvent) {
		var oController = common.Common.getController(oEvent);
		var vPernr = oController._Pernr;
		var vZyear = oController._Zyear;
		
		var jsonURL = "/sap/bc/bsp/sap/ZUI5_HR_BSP/yea_json.htm";
		
		var sendData = {
				PERNR : vPernr,
				ZYEAR : vZyear,
				ZTYPE : "P"
		};
		
		$.getJSON(jsonURL, sendData, function(data){
			if(data.URL != "" && data.URL != null) {
				if($.browser.webkit) {
					var iframe = document.getElementById('iWorker');
					iframe.onload = function() {
						setTimeout(function() {
							iframe.focus();
							iframe.contentWindow.print();
						}, 100);
					};
					iframe.src = data.URL;
				} else {
					window.open("pdfPrint.html?pdf=" + data.URL.replace(/=/g, "%3D"), "pdfPring", "width=800, height=700, toolbar=no, menubar=no, scrollbars=no, resizable=no" );
				}
			}
	    });
	},
	
	onSetView : function(oEvent){
		//console.log("Count : " + oEvent.getParameters().actual);
		var oController = common.Common.getController(oEvent);
		var oFileDelButton = sap.ui.getCore().byId("yeaUploader_AttachFileDelete");
		var oAttachFileList = sap.ui.getCore().byId("yeaUploader_AttachFileList");
		
		if(oController._DISABLED && oEvent.getParameters().actual > 0) {
			//oAttachFileList.setVisible(true);
			oFileDelButton.setVisible(true);
		} else {
			//oAttachFileList.setVisible(false);
			oFileDelButton.setVisible(false);
		}		
	}
};