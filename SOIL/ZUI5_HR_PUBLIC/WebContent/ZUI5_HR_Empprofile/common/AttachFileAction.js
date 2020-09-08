jQuery.sap.declare("ZUI5_HR_Empprofile.common.AttachFileAction");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

/**
 * 결재문서의 파일첨부 관련 Function의 JS
 * @Create By 강연준
 */

ZUI5_HR_Empprofile.common.AttachFileAction = {
		
	oController : null,
		
	/** 
	* @memberOf ZUI5_HR_Empprofile.common.AttachFileAction
	*/
	
	/*
	 * 파일첨부 panel 및 FileUploader Control의 표시여부 등을 설정
	 * 문서상태 및 첨부파일 여부에 따라 Control의 표시여부를 결정한다.
	 */
	setAttachFile : function(oController) {	
		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
		var oFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
		
		oFileUploader.setValue("");
		oFileList.setMode(sap.m.ListMode.MultiSelect);
	},
	
	/*
	 * 첨부파일 리스트를 Binding한다.
	 */
	refreshAttachFileList : function(oController, vExistDataFlag) {
		var f1 = document.getElementById(oController.PAGEID + "_ATTACHFILE_BTN-fu_input-inner");
		if(f1){
			f1.setAttribute("value","");
		}
		
		var oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
		var oAttachFileColumn = sap.ui.getCore().byId(oController.PAGEID + "_CAF_ColumnList");
		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
		oFileUploader.clear();
		oFileUploader.setValue("");
//		oAttachFileList.clearSelection();
		oAttachFileList.removeSelections(true);
		
		var oModel = sap.ui.getCore().getModel("ZHR_FAMILY_SRV");
		var JSonModel = oAttachFileList.getModel();
		var Datas = { Data : []};
		var vNoUpdateData = [];
		
		// DB저장 전 올린 File List 를 배열에 담는다. ( 이후에 DB에 저장 된 File List 와 결합하여 보여줌 )
		if(vExistDataFlag == "X"){
			if(oAttachFileList.getModel().getProperty("/Data")){
				for(var i = 0 ; i < oAttachFileList.getModel().getProperty("/Data").length ; i++){
					var vData = oAttachFileList.getModel().getProperty("/Data/" + i);
					if(!vData.Zfilekey || vData.Zfilekey == ""){
						vNoUpdateData.push(vData);
					}
				}
			}
		}
		
		var vFamilyData = oController._FamilyDialogJsonModel.getProperty("/Data"); 
		if(vFamilyData && vFamilyData.Zfilekey && vFamilyData.Zfilekey != ""){
			var ErrorMessage = "" , vError = "" , vLength = 0;
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyyMMdd"});
			var oPath = "/FamFileListSet/?$filter=Zfilekey eq '" + vFamilyData.Zfilekey + "' and Zworktyp eq '0021'";	
			oModel.read(oPath, 
				    null, null, false, 
					function(data,res){
						if(data && data.results.length){
							for(var i = 0; i <data.results.length; i++ ){
								var OneData = data.results[i];
								Datas.Data.push(OneData);		
								vLength++;
							}
						}
					},
					function(Res){
						vError = "E";
						if(Res.response.body){
							ErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							}
						}
					}
				);
		}
		
		
		if(vExistDataFlag == "X"){
			if(oAttachFileList.getModel().getProperty("/Data")){
				for(var i = 0 ; i < vNoUpdateData.length ; i++){
					vNoUpdateData[i].Seqnr = vLength + i + 1 ;
					Datas.Data.push(vNoUpdateData[i]);
				}
			}
		}
			
		JSonModel.setData(Datas);
	},
	
	/*
	 * 첨부파의 크기가 Max Size를 넘었을 경우의 처리내역
	 */
	fileSizeExceed : function (oEvent) {
		var sName = oEvent.getParameter("fileName");
		var fSize = oEvent.getParameter("fileSize");
		var fLimit = this.getMaximumFileSize();
		
		var sMsg = "&sName 파일(&fSize MB)은 최대 허용 쿠기 &fLimit MB를 초과하였습니다.";
		sMsg = sMsg.replace("&sName", sName);
		sMsg = sMsg.replace("&fSize", fSize);
		sMsg = sMsg.replace("&fLimit", fLimit);
		
		sap.m.MessageBox.alert(sMsg);
	},
	
	/*
	 * 첨부파일의 유형이 허용된 파일유형이 아닌 경우의 처리내역
	 */
	typeMissmatch : function (oEvent) {
		var oController = ZUI5_HR_Empprofile.common.AttachFileAction.oController;
		
		var sName = oEvent.getParameter("fileName");
		var sType = oEvent.getParameter("fileType");
		var sMimeType = this.getMimeType();
		if (!sMimeType) {			
			var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
			sMimeType = oFileUploader.getFileType();
		}
		var sMsg = "&sName 파일의  &sType 은 허용된 파일 확장자가 아닙니다.";
		sMsg = sMsg.replace("&sName", sName);
		sMsg = sMsg.replace("&sType", sType);
		
		sap.m.MessageBox.alert(sMsg);
	},
	
	/*
	 * 첨부파일의 Upload가 완료되었을때 처리 내역
	 * refreshAttachFileList Function을 호출한다.
	 */
	uploadComplete: function (oEvent) {
		var oController = ZUI5_HR_Empprofile.common.AttachFileAction.oController;
		
		if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
			oController.BusyDialog.close();
		}
		
		var sResponse = oEvent.getParameter("response");
		sap.m.MessageBox.alert(sResponse, {title : "안내"});
		
		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
		oFileUploader.setValue("");
		
		ZUI5_HR_Empprofile.common.AttachFileAction.refreshAttachFileList(oController);
	},
	
	/*
	 * 첨부파일의 Upload가 실패하였을때 처리 내역
	 */
	uploadAborted : function(oEvent) {
		sap.m.MessageBox.alert("파일 업로드에 실패하였습니다.");
	},
	
	/*
	 * Upload할 첨부파일을 선택했을 경우 처리 내역 
	 */
	onFileChange : function(oEvent) {
		var oController = ZUI5_HR_Empprofile.common.AttachFileAction.oController;
		
		var oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
		var oAttachFileColumn = sap.ui.getCore().byId(oController.PAGEID + "_CAF_ColumnList");
		var JSonModel = oAttachFileList.getModel();
		var vFileData = JSonModel.getProperty("/Data");
		var Datas = { Data : []};
		
		var files = jQuery.sap.domById(oController.PAGEID + "_ATTACHFILE_BTN" + "-fu").files;
		if(files) {
			for(var i = 0 ; i < vFileData.length ; i++){
				Datas.Data.push(vFileData[i]);
			}
			
			for(var i=0; i<files.length; i++) {
				files[i].Seqnr = vFileData.length + i + 1 ;
				files[i].Zfilename = files[i].name ;
				Datas.Data.push(files[i]);
			}
			JSonModel.setData(Datas);
		}
		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
		oFileUploader.clear();
		oFileUploader.setValue("");
		
		var f1 = document.getElementById(oController.PAGEID + "_ATTACHFILE_BTN-fu_input-inner");
		if(f1){
			f1.setAttribute("value","");
		}
		
	},
	
	/*
	 * 첨부된 파일을 삭제처리
	 */
	onDeleteAttachFile : function(oEvent) {
		var oController = ZUI5_HR_Empprofile.common.AttachFileAction.oController;
		
		var oModel = sap.ui.getCore().getModel("ZHR_FAMILY_SRV");
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
		var oJSonModel =oTable.getModel();
		var vContexts = oTable.getSelectedContexts(true);
		
		var fProcessFlag = true;
		
		if(vContexts && vContexts.length) {
			deleteProcess = function(fVal){
				if(fVal && fVal == sap.m.MessageBox.Action.YES) {
					try {
						oController.BusyDialog.open();
						for(var i=0; i<vContexts.length; i++) {
							if(!oJSonModel.getProperty(vContexts[i].sPath + "/Zfilekey") || oJSonModel.getProperty(vContexts[i].sPath + "/Zfilekey") == ""){
								var vIndex = parseInt(vContexts[i].sPath.replace("/Data/",""));
								oJSonModel.getProperty("/Data").splice(vIndex, 1);
							}else{
								oModel.remove(
										"/FamFileListSet(Zfilekey='" + oJSonModel.getProperty(vContexts[i].sPath + "/Zfilekey")
										+ "',Zworktyp='" + oJSonModel.getProperty(vContexts[i].sPath + "/Zworktyp")
										+ "',Zfileseq=" +  oJSonModel.getProperty(vContexts[i].sPath + "/Zfileseq")
										+ ",Appno='0'" 
										+ ")",
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
						}

//						var vData = oJSonModel.getProperty("/Data");
//						for(var i = 0 ; i < vData.length ; i++){
//							oJSonModel.setProperty("/Data/" + i + "/Seqnr", i+1);
//						}
						ZUI5_HR_Empprofile.common.AttachFileAction.refreshAttachFileList(oController, "X");
						oController.BusyDialog.close();
						
						if(!fProcessFlag) {
							return;
						}
						sap.m.MessageBox.alert("파일 삭제가 완료되었습니다");				
					} catch(ex) {
						common.Common.log(ex);
					}
				}
			}
			
			sap.m.MessageBox.show("선택한 파일을 삭제하시겠습니까?", {
				title : "안내",
				actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose : deleteProcess
			});
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
		document.iWorker.location.href = "/sap/bc/bsp/sap/ZUI5_HR_BSP/download.htm?ty=DOC&doc_id=" + vDocid + "&seq=" + vAseqn;
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
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
			var oJSonModel =oTable.getModel();
			var vData = oJSonModel.getProperty("/Data");
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyyMMdd"});
			
			if(vData && vData.length) {
				for(var i=0; i<vData.length; i++) {
					if (!vData[i].Zfilekey || vData[i].Zfilekey  == "" ) {
						var vFamilyData = oController._FamilyDialogJsonModel.getProperty("/Data"); 
						sap.ui.getCore().getModel("ZHR_FAMILY_SRV").refreshSecurityToken();
						var oRequest = sap.ui.getCore().getModel("ZHR_FAMILY_SRV")._createRequest();
						var oHeaders = {
							"x-csrf-token": oRequest.headers['x-csrf-token'], 
							"slug": vFamilyData.Famsa + "|" +  oController._vSelectedPernr + "|" +  vFamilyData.Objps + "|" + "0021" + "|" + encodeURI(vData[i].Zfilename)
						}; 
						
						jQuery.ajax({
							type: 'POST',
							async : false,
							url: "/sap/opu/odata/sap/ZHR_FAMILY_SRV/FamFileUploadSet/",
							headers: oHeaders,
							cache: false,
							contentType: vData[i].type,
							processData: false,
							data: vData[i],
							success: _handleSuccess,
							error: _handleError,
						});
					}
				}
			}
		} catch(oException) {
			jQuery.sap.log.error("File upload failed:\n" + oException.message);
		}
	}
		
};