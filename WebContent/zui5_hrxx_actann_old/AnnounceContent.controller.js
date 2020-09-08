jQuery.sap.require("common.Common");
jQuery.sap.require("sap.m.MessageBox");

sap.ui.controller("zui5_hrxx_actann.AnnounceContent", {
	
	PAGEID : "AnnounceContent",
	
	_editor : null,
	_editorContent : "",
	_editorValid : false,
	
	_vDocst : "",
	_vAnnno : "",
	_vPersa : "",
	_vContext : null, 
	
	_vUploadFiles : null, 

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actann.AnnounceContent
*/
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		};
		
//		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/zhrxx_common/plugin/htmleditor/css/editor.css");
//		jQuery.sap.includeScript("/sap/bc/ui5_ui5/sap/zhrxx_common/plugin/htmleditor/js/editor_loader.js");
		
//		var head= document.getElementsByTagName('head')[0];
//		var script= document.createElement('script');
//		script.type= 'text/javascript';
//		script.src= '/sap/bc/ui5_ui5/sap/zhrxx_common/plugin/htmleditor/js/editor_loader.js';
//		head.appendChild(script);
		
		this.getView().addEventDelegate({
	    	onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this)
		});
	},
	
	onBeforeShow: function(oEvent) {
		
		this._vDocst = oEvent.data.Docst;
		this._vAnnno = oEvent.data.Annno;
		this._vPersa = oEvent.data.Persa;
		this._vContext = oEvent.data.Context;
		
		var oController = this;
		
		var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
		
		var oPageTitle = sap.ui.getCore().byId(this.PAGEID + "_PAGE_TITLE");
		if(this._vDocst == "100") {
			oPageTitle.setText(oBundleText.getText( "TITLE_ACT_ANNOUNCE") + " " + oBundleText.getText( "CREATE_BTN"));
		} else if(this._vDocst == "200") {
			oPageTitle.setText(oBundleText.getText( "TITLE_ACT_ANNOUNCE") + " " + oBundleText.getText( "MODIFY_BTN"));
		} else if(this._vDocst == "300") {
			oPageTitle.setText(oBundleText.getText( "TITLE_ACT_ANNOUNCE"));
		}
		
		var oSaveBtn = sap.ui.getCore().byId(this.PAGEID + "_SAVE_BTN");
		var oAttachFile = sap.ui.getCore().byId(this.PAGEID + "_AttachFile");
		if(this._vDocst == "300") {
			oSaveBtn.setVisible(false);
			oAttachFile.setVisible(false);
		} else {
			oSaveBtn.setVisible(true);
			oAttachFile.setVisible(true);
		}
		oAttachFile.setValue("");
		
		var oAttachFileLinkBar = sap.ui.getCore().byId(this.PAGEID + "_AttachFileLinkBar");
		
		oAttachFileLinkBar.setVisible(false);
		
		if(this._vDocst != "100") {
			if(mActionReqList.getProperty(this._vContext + "/Uri") != "") {
				oAttachFileLinkBar.setVisible(true);
			}
		}
		
		/*2015.11.13 강연준
		 * 타이틀 에러 상태 초기화
		 */ 
		
		var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_Title");
		oTitle.setValueState(sap.ui.core.ValueState.None);
		
		var oHTMLEditor = sap.ui.getCore().byId(this.PAGEID + "_HTMLEditor");
		oHTMLEditor.destroyContent();
		
		var html_url = "/sap/bc/ui5_ui5/sap/zhrxx_common/emailhtml/HtmlEditor.html";
		
		var tHtml = "";
		var request = $.ajax({ 
			  url: html_url,
			  cache: false,
			  async: false
		});
		
		request.done(function( html ) {
			tHtml = html;
		});
			 
		request.fail(function( jqXHR, textStatus ) {
			
		});
		
		if(tHtml == "") {
			console.log("HTML Editor 파일이 없습니다.");
			return;
		}
		
		var oEditor = new sap.ui.core.HTML({content : tHtml, preferDOM : false});
		oEditor.addDelegate({
			onAfterRendering:function(){	
				var config = {
						txHost: '', /* 런타임 시 리소스들을 로딩할 때 필요한 부분으로, 경로가 변경되면 이 부분 수정이 필요. ex) http://xxx.xxx.com */
						txPath: '', /* 런타임 시 리소스들을 로딩할 때 필요한 부분으로, 경로가 변경되면 이 부분 수정이 필요. ex) /xxx/xxx/ */
						txService: 'sample', /* 수정필요없음. */
						txProject: 'sample', /* 수정필요없음. 프로젝트가 여러개일 경우만 수정한다. */
						initializedId: "", /* 대부분의 경우에 빈문자열 */
						wrapper: "tx_trex_container", /* 에디터를 둘러싸고 있는 레이어 이름(에디터 컨테이너) */
						form: 'tx_editor_form'+"", /* 등록하기 위한 Form 이름 */
						txIconPath: "/sap/bc/ui5_ui5/sap/zhrxx_common/plugin/htmleditor/images1/icon/editor/", /*에디터에 사용되는 이미지 디렉터리, 필요에 따라 수정한다. */
						txDecoPath: "/sap/bc/ui5_ui5/sap/zhrxx_common/plugin/htmleditor/images1/deco/contents/", /*본문에 사용되는 이미지 디렉터리, 서비스에서 사용할 때는 완성된 컨텐츠로 배포되기 위해 절대경로로 수정한다. */
						canvas: {
							styles: {
								color: "#000000", /* 기본 글자색 */
								fontFamily: "굴림", /* 기본 글자체 */
								fontSize: "10pt", /* 기본 글자크기 */
								backgroundColor: "#fff", /*기본 배경색 */
								lineHeight: "1.5", /*기본 줄간격 */
								padding: "8px" /* 위지윅 영역의 여백 */
							},
							showGuideArea: false
						},
						events: {
							preventUnload: false
						},
						sidebar: {
							attachbox: {
								show: false,
								confirmForDeleteAll: true
							}
						},
						size: {
							//contentWidth: 700 /* 지정된 본문영역의 넓이가 있을 경우에 설정 */
						}
					};

				EditorJSLoader.ready(function(Editor) {
					oController._editor = new Editor(config);
				});
			}
		});
		oHTMLEditor.addContent(oEditor);
	},
	
	/**
	 * 페이지가 Open후에 수행된다.
	 * 검색을 수행하는 Method를 호출한다.
	 * @param evt
	 */
	onAfterShow: function(evt) {
		
		var oTitle = sap.ui.getCore().byId(this.PAGEID + "_Title");
		var oTitle2 = sap.ui.getCore().byId(this.PAGEID + "_Title2");
		var oOrgtx = sap.ui.getCore().byId(this.PAGEID + "_Orgtx");
		var oEname = sap.ui.getCore().byId(this.PAGEID + "_Ename");
		var oAnnda = sap.ui.getCore().byId(this.PAGEID + "_Annda");
		var oDatlo = sap.ui.getCore().byId(this.PAGEID + "_Datlo");
		
		var oAttachFileLink = sap.ui.getCore().byId(this.PAGEID + "_AttachFileLink");
		var oAttachFileDelBtn = sap.ui.getCore().byId(this.PAGEID + "_AttachFileDelBtn");
		var oAttachFileLinkBar = sap.ui.getCore().byId(this.PAGEID + "_AttachFileLinkBar");
		
		var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
		
		if(this._vDocst == "200" || this._vDocst == "300") {
			oTitle.setValue(mActionReqList.getProperty(this._vContext + "/Title"));
			
			oOrgtx.setText(mActionReqList.getProperty(this._vContext + "/Orgtx"));
			oEname.setText(mActionReqList.getProperty(this._vContext + "/Ename"));
			
			oAnnda.setText(mActionReqList.getProperty(this._vContext + "/Adtim"));
			oDatlo.setText(mActionReqList.getProperty(this._vContext + "/Datim"));
			
			oAttachFileLink.setText(mActionReqList.getProperty(this._vContext + "/Fname"));
			oAttachFileLink.setHref(mActionReqList.getProperty(this._vContext + "/Uri"));
			
			if(this._vDocst == "200") {
				oAttachFileDelBtn.setVisible(true);
				if(mActionReqList.getProperty(this._vContext + "/Uri") != "") oAttachFileLinkBar.setVisible(true);
				else oAttachFileLinkBar.setVisible(false);
			} else {
				oAttachFileDelBtn.setVisible(false);
			}
			
			Editor.modify({"content" : mActionReqList.getProperty(this._vContext + "/Htmlc")});
		} else if(this._vDocst == "100") {
			oTitle.setValue("");
			
			oOrgtx.setText(gStext);
			oEname.setText(gEname);
			
			oAnnda.setText("");
			oDatlo.setText("");
		}	
		
		if(this._vDocst == "300") {
			oTitle.setVisible(false);
			oTitle2.setVisible(true);
			oTitle2.setText(mActionReqList.getProperty(this._vContext + "/Title"));
		}else{
			oTitle.setVisible(true);
			oTitle2.setVisible(false);
		}
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_actann.AnnounceContent
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actann.AnnounceContent
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actann.AnnounceContent
*/
//	onExit: function() {
//
//	}
	
	navToBack : function(oEvent){
		sap.ui.getCore().getEventBus().publish("nav", "back", {
		    });		
	},
	
	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actann.AnnounceContent");
		var oController = oView.getController();
		
//		var oAnnda = sap.ui.getCore().byId(oController.PAGEID + "_Annda");
//		var oDatlo = sap.ui.getCore().byId(oController.PAGEID + "_Datlo");
		
		var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_Title");
		if(oTitle.getValue() == "") {
			oTitle.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_DOCTL"));
			return;
		}
		
		Editor.save();
		
		if(oController._editorValid == false) {
			return;
		}
		
		var createData = {};
		createData.Title = oTitle.getValue();
		createData.Htmlc = oController._editorContent;
		createData.Persa = oController._vPersa;
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		var oPath = "/ActionRequestAnnouncementSet";
		var process_result = false;
		
//		var new_odata = null;
		
		if(oController._vDocst == "100") {
			oModel.create(
					oPath, 
					createData, 
					null,
				    function (oData, response) {
						if(oData) {
							oController._vAnnno = oData.Annno;
							new_odata = oData;
						}
						process_result = true;
						common.Common.log("Sucess ActionRequestAnnouncementSet Create !!!");
				    },
				    function (oError) {
				    	var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
								common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
							} else {
								common.Common.showErrorMessage(Err.error.message.value);
							}
						} else {
							common.Common.showErrorMessage(oError);
						}
						process_result = false;
				    }
		    );
		} else {			
			oPath = "/ActionRequestAnnouncementSet(Annno='" + oController._vAnnno + "',Persa='" + oController._vPersa + "')";
			
			createData.Annno = oController._vAnnno;
			
			oModel.update(
					oPath, 
					createData, 
					null,
				    function (oData, response) {
						process_result = true;
						common.Common.log("Sucess ActionRequestAnnouncementSet Update !!!");
				    },
				    function (oError) {
				    	var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
								common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
							} else {
								common.Common.showErrorMessage(Err.error.message.value);
							}
						} else {
							common.Common.showErrorMessage(oError);
						}
						process_result = false;
				    }
		    );
		}
		
		if(process_result) {
			process_result = oController.uploadFile(oController);
		}
		
		if(process_result) {
//			if(oController._vDocst == "100") {
//				oController._vDocst = "200";
//				
//				var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
//				var vActionReqListSet = mActionReqList.getProperty("/ActionReqListSet");
//				var vActionReqList = {ActionReqListSet : []};
//				for(var i=0; i<vActionReqListSet.length; i++) {
//					vActionReqList.ActionReqListSet.push(vActionReqListSet[i]);
//				}
//				vActionReqList.ActionReqListSet.push(new_odata);
//				oController._oContext = "/ActionReqListSet/" + vActionReqListSet.length;
//				mActionReqList.setData(vActionReqList);
//				
//				oAnnda.setText(common.Common.DateFormatter(new_odata.Annda));
//				oDatlo.setText(common.Common.DateFormatter(new_odata.Datlo));
//			} else {
//				var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
//				mActionReqList.setProperty(oController._oContext + "/Title", oTitle.getValue());
//			}
			
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
				title: oBundleText.getText("INFORMATION"),
				onClose : function() {
					oController.navToBack();
//					oTitle.setValueState(sap.ui.core.ValueState.None);		
				}
			});
		} else {
			oTitle.setValueState(sap.ui.core.ValueState.None);
		}
	},
	
	onDeleteFile : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actann.AnnounceContent");
		var oController = oView.getController();
		
		var oAttachFileLink = sap.ui.getCore().byId(oController.PAGEID + "_AttachFileLink");
		var oAttachFileDelBtn = sap.ui.getCore().byId(oController.PAGEID + "_AttachFileDelBtn");
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var oPath = "/ActionRequestAnnouncementSet(Annno='" + oController._vAnnno + "',Persa='" + oController._vPersa + "')";
		
		var updateData = {};
		updateData.Annno = oController._vAnnno;
		updateData.Persa = oController._vPersa;
		updateData.Actty = "FDELE";
		
		var process_result = false;
		
		oModel.update(
				oPath, 
				updateData, 
				null,
			    function (oData, response) {
					process_result = true;
					common.Common.log("Sucess ActionRequestAnnouncementSet Update !!!");
			    },
			    function (oError) {
			    	var Err = {};
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
							common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
						} else {
							common.Common.showErrorMessage(Err.error.message.value);
						}
					} else {
						common.Common.showErrorMessage(oError);
					}
					process_result = false;
			    }
	    );
		
		if(process_result) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_FILE_SUCESS"), {
				title: oBundleText.getText("INFORMATION"),
				onClose : function() {
					var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
					mActionReqList.setProperty(oController._oContext + "/Fname", "");
					
					oAttachFileLink.setText("");
					oAttachFileLink.setHref("");
					oAttachFileDelBtn.setVisible(false);
				}
			});
		}		
	},
	
	typeMissmatch : function (oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actann.AnnounceContent");
		var oController = oView.getController();
		
		var sName = oEvent.getParameter("fileName");
		var sType = oEvent.getParameter("fileType");
		var sMimeType = this.getMimeType();
		if (!sMimeType) {			
			var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_AttachFile");
			sMimeType = oFileUploader.getFileType();
		}
		var sMsg = oBundleText.getText("MSG_UPLOAD_MISSTYPE");
		sMsg = sMsg.replace("&sName", sName);
		sMsg = sMsg.replace("&sType", sType);
		
		sap.m.MessageBox.alert(sMsg);
	},
	
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
	
	onFileChange : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actann.AnnounceContent");
		var oController = oView.getController();
		
		oController._vUploadFiles = [];
		var files = jQuery.sap.domById(oController.PAGEID + "_AttachFile" + "-fu").files;
		if(files) {
			for(var i=0; i<files.length; i++) {
				oController._vUploadFiles.push(files[i]);
			}
		}
		
	},
	
	uploadFile : function(oController) {
		var uploafFlag = true;
		try {
			var _handleSuccess = function(data){
				console.log(oBundleText.getText("MSG_UPLOADED_FILE") + ", " + data);
				uploafFlag = true;
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
				uploafFlag = false;
			};
			
			if(oController._vUploadFiles && oController._vUploadFiles.length) {
				for(var i=0; i<oController._vUploadFiles.length; i++) {
					var file = oController._vUploadFiles[i];
					if (file) {
						
						sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV").refreshSecurityToken();
						var oRequest = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV")._createRequest();
						var oHeaders = {
							"x-csrf-token": oRequest.headers['x-csrf-token'],
							"slug": oController._vAnnno + "|" + oController._vPersa + "| |02|" + encodeURI(file.name)
						}; 
						
						jQuery.ajax({
							type: 'POST',
							async : false,
							url: "/sap/opu/odata/sap/ZHRXX_ACTIONAPP_SRV/FileSet/",
							headers: oHeaders,
							cache: false,
							contentType: file.type,
							processData: false,
							data: file,
							success: _handleSuccess,
							error: _handleError,
						});
					}
				}
			}
		} catch(oException) {
			jQuery.sap.log.error("File upload failed:\n" + oException.message);
			uploafFlag = false;
		}
		
		return uploafFlag;
	}
});

function validForm(editor) {
	var oView = sap.ui.getCore().byId("zui5_hrxx_actann.AnnounceContent");
	var oController = oView.getController();
	
	var validator = new Trex.Validator();
	var content = editor.getContent();

    oController._editorContent = content;
    oController._editorValid = true;
    
	if (!validator.exists(content)) {
		oController._editorValid = false;
		
		sap.m.MessageBox.show(
				oBundleText.getText( "MSG_ANNOUNCE1"), {
		          icon: sap.m.MessageBox.Icon.ERROR,
		          title: "Error",
		          actions: [sap.m.MessageBox.Action.OK],
		          styleClass: "sapUiSizeCompact"
		        }
		 );
		
		return false;
	}

    if(getStrByte(content)>4000){
        oController._editorValid = false;
        
        sap.m.MessageBox.show(
        		oBundleText.getText( "MSG_ANNOUNCE2"), {
		          icon: sap.m.MessageBox.Icon.ERROR,
		          title: "Error",
		          actions: [sap.m.MessageBox.Action.OK],
		          styleClass: "sapUiSizeCompact"
		        }
		 );
        
        return false;
    }
    
    
	return true;
}
