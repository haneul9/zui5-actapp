jQuery.sap.declare("common.AttachFileAction");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

/**
 * 결재문서의 파일첨부 관련 Function의 JS
 * @Create By 정명구
 */

common.AttachFileAction = {
		
	oController : null,
		
	/** 
	* @memberOf common.AttachFileAction
	*/
	
	/*
	 * 파일첨부 panel 및 FileUploader Control의 표시여부 등을 설정
	 * 문서상태 및 첨부파일 여부에 따라 Control의 표시여부를 결정한다.
	 */
	setAttachFile : function(oController) {	
		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_DELETE_BTN");
		var oFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
		
		oFileUploader.setValue("");
		
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
		
		var f1 = $("#" + oController.PAGEID + "_ATTACHFILE_BTN-fu");
		if ($.browser.msie) {
			f1.replaceWith(f1 = f1.clone( true ));
	    } else {
              f1.val('');
        }
		         
//		         sap.ui.getCore().byId(oController.PAGEID + "_Attach1").setValue("");
//		         sap.ui.getCore().byId(oController.PAGEID + "_Attach2").setValue("");
//		         sap.ui.getCore().byId(oController.PAGEID + "_Attach3").setValue("");
		         
		var oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
		var oAttachFileColumn = sap.ui.getCore().byId(oController.PAGEID + "_CAF_ColumnList");
		var oAttachingFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_List");
		oAttachingFileList.removeAllItems();
		oAttachingFileList.destroyItems();
		oController._vUploadFiles = [];
		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
		oFileUploader.clear();
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Appno", sap.ui.model.FilterOperator.EQ, oController._vAppno));
		oFilters.push(new sap.ui.model.Filter("Appty", sap.ui.model.FilterOperator.EQ, oController._vAppty));
		
		oAttachFileList.bindItems("/FileListSet", oAttachFileColumn, null, oFilters);
		
		
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
		
		sap.m.MessageBox.alert(sMsg);
	},
	
	/*
	 * 첨부파일의 유형이 허용된 파일유형이 아닌 경우의 처리내역
	 */
	typeMissmatch : function (oEvent) {
		var oController = common.AttachFileAction.oController;
		
		var sName = oEvent.getParameter("fileName");
		var sType = oEvent.getParameter("fileType");
		var sMimeType = this.getMimeType();
		if (!sMimeType) {			
			var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
			sMimeType = oFileUploader.getFileType();
		}
		var sMsg = oBundleText.getText("MSG_UPLOAD_MISSTYPE");
		sMsg = sMsg.replace("&sName", sName);
		sMsg = sMsg.replace("&sType", sType);
		
		sap.m.MessageBox.alert(sMsg);
	},
	
	/*
	 * 첨부파일의 Upload가 완료되었을때 처리 내역
	 * refreshAttachFileList Function을 호출한다.
	 */
	uploadComplete: function (oEvent) {
		var oController = common.AttachFileAction.oController;
		
		if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
			oController.BusyDialog.close();
		}
		
		var sResponse = oEvent.getParameter("response");
		sap.m.MessageBox.alert(sResponse, {title : oBundleText.getText("MSG_TITLE_GUIDE")});
		
		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
		oFileUploader.setValue("");
		
		common.AttachFileAction.refreshAttachFileList(oController);
	},
	
	/*
	 * 첨부파일의 Upload가 실패하였을때 처리 내역
	 */
	uploadAborted : function(oEvent) {
		sap.m.MessageBox.alert(oBundleText.getText("MSG_UPLOAD_FAIL"));
	},
	
	/*
	 * Upload할 첨부파일을 선택했을 경우 처리 내역 
	 */
	onFileChange : function(oEvent) {
		var oController = common.AttachFileAction.oController;
//		
//		if(!oController.BusyDialog) {
//			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
//			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_UPLOADING_FILE")}));
//			oController.getView().addDependent(oController.BusyDialog);
//		} else {
//			oController.BusyDialog.removeAllContent();
//			oController.BusyDialog.destroyContent();
//			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_UPLOADING_FILE")}));
//		}
//		if(!oController.BusyDialog.isOpen()) {
//			oController.BusyDialog.open();
//		}
		
		//var oAttachingFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_List");
		oController._vUploadFiles = [];
		var files = jQuery.sap.domById(oController.PAGEID + "_ATTACHFILE_BTN" + "-fu").files;
		if(files) {
			for(var i=0; i<files.length; i++) {
				oController._vUploadFiles.push(files[i]);
				//oAttachingFileList.addItem(new sap.m.DisplayListItem({label : files[i].name, value : files[i].size}));
			}
		}
		
	},
	
	/*
	 * 첨부된 파일을 삭제처리
	 */
	onDeleteAttachFile : function(oEvent) {
		var oController = common.AttachFileAction.oController;
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
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
							"/FileListSet(Appno='" + vContexts[i].getProperty("Appno") 
							+ "',Appty='" + vContexts[i].getProperty("Appty")
							+ "',Fnumr='" + vContexts[i].getProperty("Fnumr") + "')",
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
						    		sap.m.MessageBox.alert(rError2);
						    	}
						    	rError = oError;
						    }
					);
					if(!fProcessFlag) {
						break;
					}
				}
				
				common.AttachFileAction.refreshAttachFileList(oController);
				
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
						
						sap.ui.getCore().getModel("ZL2P01GW9000_SRV").refreshSecurityToken();
						var oRequest = sap.ui.getCore().getModel("ZL2P01GW9000_SRV")._createRequest();
						var oHeaders = {
							"x-csrf-token": oRequest.headers['x-csrf-token'],
							"slug": oController._vAppno + "|" + oController._vAppty + "|" + encodeURI(file.name)
						}; 
						
						jQuery.ajax({
							type: 'POST',
							async : false,
							url: "/sap/opu/odata/sap/ZL2P01GW9000_SRV/FileSet/",
							headers: oHeaders,
							cache: false,
							contentType: file.type,
							processData: false,
							data: file,
							success: _handleSuccess,
							error: _handleError,
//							xhr: function() {           
//			                     	//Upload progress
//			                     	xhr.upload.addEventListener("progress", function(evt){
//			                     		if (evt.lengthComputable) {
//			                     			var percentComplete = Math.round(evt.loaded * 100 / evt.total);
//			                     			//$('.progress').val(percentComplete);
//			                     			//Do something with upload progress
//			                     			console.log(percentComplete);
//			                     		}
//			                     	}, false);
//			                             
//			                     	xhr.addEventListener("error", function(evt){
//			                     		console.log("There was an error attempting to upload the file.");
//			                     		return;
//			                     	}, false);
//			         
//			                     	return xhr;
//			                },
						});
					}
				}
			}
		} catch(oException) {
			jQuery.sap.log.error("File upload failed:\n" + oException.message);
		}
	}
		
};