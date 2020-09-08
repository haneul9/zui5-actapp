jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

sap.ui.controller("zui5_hrxx_retireprocess.DocumentFile", {
	PAGEID : "DocumentFile",
	_Bizty : "",
	_vPersa : "",

//	//Language 및 Properties를 가져온다.
//	oBundleText : jQuery.sap.resources({
//		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//		locale : sap.ui.getCore().getConfiguration().getLanguage()
//	}),
	
	_AttchFileDialog : null,
	_vUploadFiles : null,

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_retireprocess.DocumentFile
*/
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		};
		
		var oPersaModel = sap.ui.getCore().getModel("PersaModel");
		var vPersaData = oPersaModel.getProperty("/PersAreaListSet");

		var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
		
		try {
			for(var i=0; i<vPersaData.length; i++) {
				oPersa.addItem(
					new sap.ui.core.Item({
						key : vPersaData[i].Persa, 
						text : vPersaData[i].Pbtxt
					})
				);
			};
			oPersa.setSelectedKey(vPersaData[0].Persa);
			this._vPersa = vPersaData[0].Persa;
		} catch(ex) {
			common.Common.log(ex);
		}
		
	    this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),

		});  
	},
	
	onBeforeShow : function(oEvent) {
		this._Bizty = oEvent.data.Bizty;

		var oPage = sap.ui.getCore().byId(this.PAGEID + "_PAGETITLE");
		oPage.setText(oBundleText.getText("TITLE_RETIRE_DOCUMENTFILE" + this._Bizty));
		
		var oUpdynCol = sap.ui.getCore().byId(this.PAGEID + "_Updyn_Col"); 
		if(this._Bizty == "10") {
			oUpdynCol.setVisible(false);
		} else {
			oUpdynCol.setVisible(true);
		}
		


		this.onPressSearch();
		
	}, 
	
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.DocumentFile");
		var oController = oView.getController();
		
		var oFilters = [];
		//var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		
		oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa));
		oFilters.push(new sap.ui.model.Filter("Attty", sap.ui.model.FilterOperator.EQ, oController._Bizty));
		
		if(this._Bizty == "10") {
			oFilters.push(new sap.ui.model.Filter("Actty", sap.ui.model.FilterOperator.EQ, "S"));
		} else {
			oFilters.push(new sap.ui.model.Filter("Actty", sap.ui.model.FilterOperator.EQ, "D"));
		}

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
		
		oTable.bindItems("/RetirementDocumentFileSet", oColumnList, null, oFilters);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_retireprocess.DocumentFile
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_retireprocess.DocumentFile
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_retireprocess.DocumentFile
*/
//	onExit: function() {
//
//	}
	
	onPressCreateFile : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.DocumentFile");
		var oController = oView.getController();
		
		oController._vUploadFiles = [];
		
		if(!oController._AttchFileDialog) {
			oController._AttchFileDialog = sap.ui.jsfragment("zui5_hrxx_retireprocess.fragment.CreateAttachFile", oController);
			oView.addDependent(oController._AttchFileDialog);
		}
		var oUploadYnRow = sap.ui.getCore().byId(oController.PAGEID + "_UpdynRow"); 
		var oAttachLabel = sap.ui.getCore().byId(oController.PAGEID + "_AttachLabel"); 
		console.log(oAttachLabel);
		if(oController._Bizty == "10"){
			oUploadYnRow.addStyleClass("L2PDisplayNone");
			oAttachLabel.setRequired(true);
		}
		else if(oController._Bizty == "20"){
			oUploadYnRow.removeStyleClass("L2PDisplayNone");
			oAttachLabel.setRequired(false);
		}
		
		oController._AttchFileDialog.open();
	},
	
	onPressDeleteFile : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.DocumentFile");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		
		if(!vContexts || vContexts.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_FILE_SELECT"));
			return;
		}
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		
		var DeleteProcess = function() {
			var process_result = false;
			for(var i=0; i<vContexts.length; i++) {
				try {
					var oPath = "/RetirementDocumentFileSet(Persa='" + oPersa.getSelectedKey() + "',"
					          + "Attty='" + vContexts[i].getProperty("Attty") + "',Seqnr='" + vContexts[i].getProperty("Seqnr") + "')";
					
					oModel.remove(
							oPath, 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess RetirementDocumentFileSet Remove !!!");
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
					
					if(!process_result) break;
				} catch(ex) {
					process_result = false;
					common.Common.log(ex);
				}
			}
				
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			if(!process_result) return;
			
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_FILE_SUCESS"), {
				title: oBundleText.getText("INFORMATION"),
				onClose : function() {
					oController.onPressSearch();
				}
			});
		};
		
		var onProcessing = function(oAction) {
			if ( oAction === sap.m.MessageBox.Action.YES ) {
				if(!oController.BusyDialog) {			
					oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
					oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
					oController.getView().addDependent(oController.BusyDialog);
				} else {
					oController.BusyDialog.removeAllContent();
					oController.BusyDialog.destroyContent();
					oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
				}
				if(!oController.BusyDialog.isOpen()) {
					oController.BusyDialog.open();
				}
				
				setTimeout(DeleteProcess, 300);
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("MSG_DELETE_FILE_QUESTION"), {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("TITLE_FILE_DELETE"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: onProcessing
		});
		
	},
	
	onChangeFile : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.DocumentFile");
		var oController = oView.getController();
		
		oController._vUploadFiles = [];
		
		var files = jQuery.sap.domById(oController.PAGEID + "_Fname" + "-fu").files;
		if(files) {
				for(var f=0; f<files.length; f++) {
					oController._vUploadFiles.push(files[f]);
				}
		}
	},
	
	onACFClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.DocumentFile");
		var oController = oView.getController();
		
		if(oController._AttchFileDialog.isOpen()) {
			oController._AttchFileDialog.close();
		}
	},
	
	onPressFileSave : function(oEvent) {
		//인사영역|신청번호|서류구분|순번|퇴직서류명|구분(‘01’)|파일명 
		//으로 구성하시면 됩니다.
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.DocumentFile");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oSeqnr = sap.ui.getCore().byId(oController.PAGEID + "_Seqnr");
		var oRdonm = sap.ui.getCore().byId(oController.PAGEID + "_Rdonm");
		var oUpdyn = sap.ui.getCore().byId(oController.PAGEID + "_Updyn");
		var vUpdyn = "";
		if(oUpdyn.getSelected()){
			vUpdyn = "X";
		}
		
		var vAttty = "";
		
		if(oController._Bizty == "10") {
			vAttty = "10";
		} else {
			vAttty = "20";
		}
		
		if(oRdonm.getValue() == "") {
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			sap.m.MessageBox.alert(oBundleText.getText("MSG_RETIRE_FILENAME_INPUT"));
			return;
		}
		
		var SaveFileProcess = function() {
			var process_result = false;
			var error_msg = "";
			
			try {
				var _handleSuccess = function(data){
					console.log(oBundleText.getText("MSG_UPLOADED_FILE") + ", " + data);
					process_result = true;
				}; 
				var _handleError = function(data){
					var errorMsg = null;
					if (data.responseText){
						errorMsg = /<message xml:lang="ko">(.*?)<\/message>/.exec(data.responseText);
					}else{
						errorMsg = oBundleText.getText("MSG_UPLOAD_FAIL");
					}
					if(errorMsg && errorMsg.length) {
						error_msg = errorMsg[1];
						console.log("Error: " + errorMsg[1]);
					} else {
						error_msg = errorMsg;
						console.log("Error: " + errorMsg);
					}
					process_result = false;
				};
				/*
				 *  2015.11.24  첨부파일 필수 로직 삭제 .
				 */
//				if(oController._vUploadFiles && oController._vUploadFiles.length) {
//					for(var i=0; i<oController._vUploadFiles.length; i++) {					
//						var file = oController._vUploadFiles[i];
//						if (file) {						
//							sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV").refreshSecurityToken();
//							var oRequest = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV")._createRequest();
//							var oHeaders = {
//								"x-csrf-token": oRequest.headers['x-csrf-token'],
//								"slug": oPersa.getSelectedKey() + "| |" + vAttty  + "|" + oSeqnr.getSelectedKey() +
//										"|" + encodeURI(oRdonm.getValue()) + "|01|" + encodeURI(file.name) + "|" + vUpdyn ,
//							}; 
//
//							jQuery.ajax({
//								type: 'POST',
//								async : false,
//								url: "/sap/opu/odata/sap/ZHRXX_RETAPPL_SRV/FileSet/",
//								headers: oHeaders,
//								cache: false,
//								contentType: file.type,
//								processData: false,
//								data: file,
//								success: _handleSuccess,
//								error: _handleError
//							});
//						}
//					}
//				}
//				else {
//					if(oController.BusyDialog.isOpen()) {
//						oController.BusyDialog.close();
//					}
//					sap.m.MessageBox.alert(oBundleText.getText("MSG_RETIRE_NOT_DOC_FILE"));
//					return;
//				}
				
				if(oController._vUploadFiles && oController._vUploadFiles.length) {
					for(var i=0; i<oController._vUploadFiles.length; i++) {					
						var file = oController._vUploadFiles[i];
						if (file) {						
							sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV").refreshSecurityToken();
							var oRequest = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV")._createRequest();
							var oHeaders = {
								"x-csrf-token": oRequest.headers['x-csrf-token'],
								"slug": oPersa.getSelectedKey() + "| |" + vAttty  + "|" + oSeqnr.getSelectedKey() +
										"|" + encodeURI(oRdonm.getValue()) + "|01|" + encodeURI(file.name) + "|" + vUpdyn ,
							}; 

							jQuery.ajax({
								type: 'POST',
								async : false,
								url: "/sap/opu/odata/sap/ZHRXX_RETAPPL_SRV/FileSet/",
								headers: oHeaders,
								cache: false,
								contentType: file.type,
								processData: false,
								data: file,
								success: _handleSuccess,
								error: _handleError
							});
						}
					}
				}
				else{
					var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
					var saveData = {};
					saveData.Persa = oPersa.getSelectedKey();
					saveData.Attty = vAttty;
					saveData.Seqnr = oSeqnr.getSelectedKey();
					saveData.Rdonm = oRdonm.getValue();
					saveData.Updyn = vUpdyn;
					
					
					oModel.create(
							"/RetirementDocumentFileSet", 
							saveData, 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess Create !!!");
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
			} catch(oException) {
				process_result = false;
				error_msg = oException.message;
				
				jQuery.sap.log.error("File upload failed:\n" + oException.message);
			}
			
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			if(!process_result) {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_UPLOAD_FAIL") + error_msg);
			} else {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
					title: oBundleText.getText("INFORMATION"),
					onClose : function() {
						oController.onACFClose();
						oController.onPressSearch();
					}
				});
			}
			
			
		};
		
		if(!oController.BusyDialog) {			
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		setTimeout(SaveFileProcess, 300);
	},
	
	onBeforeOpenCAFDialog: function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.DocumentFile");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		
		var oSeqnr = sap.ui.getCore().byId(oController.PAGEID + "_Seqnr");
		for(var i=0; i<9; i++) {
			oSeqnr.addItem(new sap.ui.core.Item({
				key : (i+1) + "", 
				text : (i+1) + ""
			}));
		}
		oSeqnr.setSelectedKey("" + (oTable.getItems().length + 1));
		
		var oRdonm = sap.ui.getCore().byId(oController.PAGEID + "_Rdonm");
		oRdonm.setValue("");
		
		var oFname = sap.ui.getCore().byId(oController.PAGEID + "_Fname");
		oFname.setValue("");
		
		var oUpdyn = sap.ui.getCore().byId(oController.PAGEID + "_Updyn"); 
		oUpdyn.setSelected(false);
	},
	
	onChangePersa : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_retireprocess.DocumentFile");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		oController._vPersa = oPersa.getSelectedKey();
		
		oController.onPressSearch(oEvent);
	},

});