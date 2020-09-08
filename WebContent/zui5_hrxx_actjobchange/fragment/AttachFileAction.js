jQuery.sap.declare("zui5_hrxx_mat_protection.fragment.AttachFileAction");

jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

/**
 * 결재문서의 파일첨부 관련 Function의 JS
 */

zui5_hrxx_mat_protection.fragment.AttachFileAction = {
		
	oController : null,
		
	/*
	 * 파일첨부 panel 및 FileUploader Control의 표시여부 등을 설정
	 * 문서상태 및 첨부파일 여부에 따라 Control의 표시여부를 결정한다.
	 */
	setAttachFile : function(oController) {	
		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_DELETE_BTN");
		var oFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
		
		if(oController._vAstat == "00" || oController._vAstat == "10") {
			oFileUploader.setVisible(true);
			oDeleteBtn.setVisible(true);
			oFileList.setMode(sap.m.ListMode.MultiSelect);
		} else {
			oFileUploader.setVisible(false);
			oDeleteBtn.setVisible(false);
			oFileList.setMode(sap.m.ListMode.None);
		}
	},
	
	/*
	 * 첨부파일 리스트를 Binding한다.
	 */
	refreshAttachFileList : function(oController) {
		var oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
		var oAttachFileColumn = sap.ui.getCore().byId(oController.PAGEID + "_CAF_ColumnList");
		var oAttachingFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_List");
		var oAttachFileListText = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_FILELIST");
			
		var mLoaAttatchedFile = sap.ui.getCore().getModel("LoaAttatchedFile");
		var vLoaAttatchedFile = {LoaAttatchedFileSet : []};
		var oModel = sap.ui.getCore().getModel("ZHRXX_LOA_APPLICATION_SRV");
		
		oAttachingFileList.removeAllItems();
		oAttachingFileList.destroyItems();
		oController._vUploadFiles = [];
		oAttachFileListText.setText("");
		if(oController._vAppno != "") {
			
			var filterString  = "/?$filter=Appno%20eq%20%27" + oController._vAppno + "%27";
//				filterString += "%20and%20Persa%20eq%20%27" + oController._vPersa + "%27";
//				filterString += "%20and%20Reqno%20eq%20%27" + "" + "%27";
				oModel.read("/LoaAttatchedFileSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vLoaAttatchedFile.LoaAttatchedFileSet.push(oData.results[i]);
							}
						}
						mLoaAttatchedFile.setData(vLoaAttatchedFile);	
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
		}else{
			mLoaAttatchedFile.setData(vLoaAttatchedFile);
		}
		oAttachFileList.setModel(sap.ui.getCore().getModel("LoaAttatchedFile"));
		oAttachFileList.bindItems("/LoaAttatchedFileSet", oAttachFileColumn);
		
	},
	
	/*
	 * 첨부파의 크기가 Max Size를 넘었을 경우의 처리내역
	 */
	fileSizeExceed : function (oEvent) {
		var sName = oEvent.getParameter("fileName");
		var fSize = oEvent.getParameter("fileSize");
		var fLimit = this.getMaximumFileSize();
		
		var sMsg = oBundleText.getText("MSG_UPLOAD_EXCEEDLEN");
		sMsg = sMsg.replace("&sName", sName);
		sMsg = sMsg.replace("&fSize", fSize);
		sMsg = sMsg.replace("&fLimit", fLimit);
		
		common.Common.showErrorMessage(sMsg);
	},
	
	/*
	 * 첨부파일의 유형이 허용된 파일유형이 아닌 경우의 처리내역
	 */
	typeMissmatch : function (oEvent) {
		var oController = zui5_hrxx_mat_protection.fragment.AttachFileAction.oController;
		
		var sName = oEvent.getParameter("fileName");
		var sType = oEvent.getParameter("fileType");
		console.log("sName"+sName+"sType"+sType);
		var sMimeType = this.getMimeType();
		if (!sMimeType) {			
			var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
			sMimeType = oFileUploader.getFileType();
		}
		var sMsg = oBundleText.getText("MSG_UPLOAD_MISSTYPE");
		sMsg = sMsg.replace("&sName", sName);
		sMsg = sMsg.replace("&sType", sType);
		
		common.Common.showErrorMessage(sMsg);
	},
	
	/*
	 * 첨부파일의 Upload가 완료되었을때 처리 내역
	 * refreshAttachFileList Function을 호출한다.
	 */
	uploadComplete: function (oEvent) {
		var oController = zui5_hrxx_mat_protection.fragment.AttachFileAction.oController;
		
		if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
			oController.BusyDialog.close();
		}
		
		var sResponse = oEvent.getParameter("response");
		sap.m.MessageBox.alert(sResponse, {title : oBundleText.getText("INFORMATION")});
		
		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
		oFileUploader.setValue("");
		
		zui5_hrxx_mat_protection.fragment.AttachFileAction.refreshAttachFileList(oController);
	},
	
	/*
	 * 첨부파일의 Upload가 실패하였을때 처리 내역
	 */
	uploadAborted : function(oEvent) {
		common.Common.showErrorMessage(oBundleText.getText("MSG_UPLOAD_FAIL"));
	},
	
	/*
	 * Upload할 첨부파일을 선택했을 경우 처리 내역 
	 */
	onFileChange : function(oEvent) {
		var oController = zui5_hrxx_mat_protection.fragment.AttachFileAction.oController;
		
		var oAttachingFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_List");
		var oAttachFileListText = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_FILELIST");
		var vAttachText = "";
		var files = jQuery.sap.domById(oController.PAGEID + "_ATTACHFILE_BTN" + "-fu").files;
		if(files) {
			for(var i=0; i<files.length; i++) {
				console.log("File : " + files[i].name + ", " + files[i].type + ", " + files[i].size);
				oController._vUploadFiles.push(files[i]);
				oAttachingFileList.addItem(new sap.m.DisplayListItem({label : files[i].name, value : files[i].size}));
			}
		}
		for(var i = 0; i < oController._vUploadFiles.length; i++){
			if(i==0){
				vAttachText = "임시 파일 리스트 : " + oController._vUploadFiles[i].name ;
			}else{
				vAttachText += ", " +oController._vUploadFiles[i].name ;
			}
		}
		oAttachFileListText.setText(vAttachText);
		
	},
	
	/*
	 * 첨부된 파일을 삭제처리
	 */
	onDeleteAttachFile : function(oEvent) {
		var oController = zui5_hrxx_mat_protection.fragment.AttachFileAction.oController;
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_LOA_APPLICATION_SRV");
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
		var vContexts = oTable.getSelectedContexts(true);
		
		var fProcessFlag = true;
		
		if(vContexts && vContexts.length) {
			try {
				if(!oController.BusyDialog) {
					oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 			
					oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_DELETEING_FILE")}));
					oController.getView().addDependent(oController.BusyDialog);
				} else {
					oController.BusyDialog.removeAllContent();
					oController.BusyDialog.destroyContent();
					oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_DELETEING_FILE")}));
				}
				if(!oController.BusyDialog.isOpen()) {
					oController.BusyDialog.open();
				}
				
				for(var i=0; i<vContexts.length; i++) {
					oModel.remove(
							"/LoaAttatchedFileSet(Appno='" + vContexts[i].getProperty("Appno") 
							+  "',Fnumr='" + vContexts[i].getProperty("Fnumr") + "')",
							null,
						    function (oData, response) {
								fProcessFlag = true;
						    },
						    function (oError) {
						    	fProcessFlag = false;
						    	var Err = {};
						    	if(oError.response) {
							        Err = window.JSON.parse(oError.response.body);
							        common.Common.showErrorMessage(Err.error.message.value);
						    	} else {
						    		common.Common.showErrorMessage(rError2);
						    	}
						    	rError = oError;
						    }
					);
					if(!fProcessFlag) {
						break;
					}
				}
				
				zui5_hrxx_mat_protection.fragment.AttachFileAction.refreshAttachFileList(oController);
				
				if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}
				
				if(!fProcessFlag) {
					return;
				}
				sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETEED_FILE"));
				
				
			} catch(ex) {
				common.Common.log(ex);
			}
		}
	},
	
	/*
	 * 첨부파일을 다운로드 한다.
	 */
	onDownloadAttachFile : function(oEvent) {
		console.log("onDownloadAttachFile");
		var oSrc = oEvent.getSource();
		var vAseqn = "", vDocid = "";
		var oCustomList = oSrc.getCustomData();
		if(oCustomList && oCustomList.length == 4) {
			vAseqn = oCustomList[0].getValue();
			vDocid = oCustomList[1].getValue();
		}
		document.iWorker.location.href = "/sap/bc/bsp/sap/z_hr_ui5_bsp/download.htm?ty=DOC&doc_id=" + vDocid + "&seq=" + vAseqn;
	},
	
	uploadFile : function(oController) {
		try {
			var _handleSuccess = function(data){
				console.log(oBundleText.getText("MSG_UPLOADED_FILE") + ", " + data);
			}; 
			var _handleError = function(data){
				var errorMsg = null;
				if (data.responseText){
					errorMsg = /<message xml:lang="ko">(.*?)<\/message>/.exec(data.responseText);
				}else{
					errorMsg = oBundleText.getText("MSG_UPLOAD_FAIL");
				}
				if(errorMsg && errorMsg.length) {
					console.log("Error: " + errorMsg[1]);
				} else {
					console.log("Error: " + errorMsg);
				}
			};
			
			if(oController._vUploadFiles && oController._vUploadFiles.length) {
				for(var i=0; i<oController._vUploadFiles.length; i++) {
					var file = oController._vUploadFiles[i];
					if (file) {
						sap.ui.getCore().getModel("ZHRXX_LOA_APPLICATION_SRV").refreshSecurityToken();
						var oRequest = sap.ui.getCore().getModel("ZHRXX_LOA_APPLICATION_SRV")._createRequest();
						var oHeaders = {
							"x-csrf-token": oRequest.headers['x-csrf-token'],
							"slug": oController._vPernr   + "|" +  oController._vAppno + "|"+ encodeURI(file.name)
						}; 
						console.log(  oController._vPernr   + "|" +  oController._vAppno + "|"+ encodeURI(file.name) + "|" + file.type);
						jQuery.ajax({
							type: 'POST',
							async : false,
							url: "/sap/opu/odata/sap/ZHRXX_LOA_APPLICATION_SRV/FileSet/",
							headers: oHeaders,
							cache: false,
							contentType: file.type,
							processData: false,
							data: file,
							success: _handleSuccess,
							error: _handleError
						});
						console.log(  oController._vPernr   + "|" +  oController._vAppno + "|"+ encodeURI(file.name) + "|" + file.type);
					}
				}
			}
		} catch(oException) {
			jQuery.sap.log.error("File upload failed:\n" + oException.message);
		}
	} ,
		
};