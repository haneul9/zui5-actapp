sap.ui.controller("zui5_hrxx_acteducation.EducationRequest", {
	
	PAGEID : "EducationRequest",
	
	_vActionType : "", 
	
	_vPersa : "",
	_vMolga : "",
	_vAppty : "",
	_vAppno : "",
	_vAstat : "",
	
	_vChgfg : "", 
	
	_vSubty : "", 
	_vObjps : "", 
	_vPernr : "",
	_vSeqnr : "",
	
	_rContext : null,
	
	_vFromPageId : "",
	_vUploadFiles : null,
	
	BusyDialog : null,
	_CommentDialog : null,
	
	vControls : null,
	DISABLED : true,

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_acteducation.EducationRequest
*/
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			this.getView().addStyleClass("sapUiSizeCompact");
		};
		
	    this.getView().addEventDelegate({
			onBeforeShow  : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
		});
	},
	
	onBeforeShow: function(oEvent) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();	
		
		this._vUploadFiles = [];

		this._vPersa = oEvent.data.Persa;			
		this._vMolga = oEvent.data.Molga;
		this._vAppty = oEvent.data.Appty;
		this._vAstat = oEvent.data.Astat;
		this._vChgfg = oEvent.data.Chgfg;
		this._vFromPageId = oEvent.data.FromPageId;
		
		this._vSubty = oEvent.data.Subty;
		this._vObjps = oEvent.data.Objps;
		this._vSeqnr = oEvent.data.Seqnr;
		
		this._vPernr = oEvent.data.Pernr;
		var vZzjobgrtx = oEvent.data.Zzjobgrtx;
		var vZzcaltltx = oEvent.data.Zzcaltltx;
		var vRorgt = oEvent.data.Rorgt;
		var vRpern = oEvent.data.Rpern;
		
		this._rContext = oEvent.data.Rcontext;
		
		var vFields = [{Fieldname : "Slart"}];
		common.Common.loadCodeData(this._vPersa, dateFormat.format(curDate), vFields);
		
		// 대상자 Layout 구성 조회
		var oRpern = sap.ui.getCore().byId(this.PAGEID + "_Rpern");
		var oRpers = sap.ui.getCore().byId(this.PAGEID + "_Rpers");
		var oZzjobgr = sap.ui.getCore().byId(this.PAGEID + "_Zzjobgr");
		var oZzcaltl = sap.ui.getCore().byId(this.PAGEID + "_Zzcaltl");
		var oRorgt = sap.ui.getCore().byId(this.PAGEID + "_Rorgt");

		if(this._vAstat != "00") {
			this._vAppno = oEvent.data.Appno;
			oRpers.setText(this._vPernr);
			oRpern.setText(vRpern);
			oRorgt.setText(vRorgt);
			oZzjobgr.setText(vZzjobgrtx);
			oZzcaltl.setText(vZzcaltltx);
		} else {
			this._vAppno = "";
			// 신청문서를 신규로 생성 시에는 대상자의 정보를 조회하여 화면에 Binding 
			var vPersonData = this.getSearchPersonInfo(this, this._vPernr);
			
			oRpern.setText(vPersonData.Ename);
			oRpers.setText(vPersonData.Pernr);
			oRorgt.setText(vPersonData.Orgtx);
			oZzjobgr.setText(vPersonData.Zzjobgrtx);
			oZzcaltl.setText(vPersonData.Zzcaltltx);
		}
		
		this.onSetApplicantPanel(this,this._rContext);
		
		console.log("Molga : " + this._vMolga);
		var o28_Layout = sap.ui.getCore().byId(this.PAGEID + "_28_Layout");
		if(this._vMolga == "28") o28_Layout.setVisible(true);
		else o28_Layout.setVisible(false);

		common.AttachFileAction.oController = this;
		common.AttachFileAction.setAttachFile(this);
		common.AttachFileAction.refreshAttachFileList(this);		
		
		var oCompleteBtn = sap.ui.getCore().byId(this.PAGEID + "_COMPLETE_BTN");
		var oRejectBtn = sap.ui.getCore().byId(this.PAGEID + "_REJECT_BTN");
		
		var oRejectPanel = sap.ui.getCore().byId(this.PAGEID + "_RejectPanel");
//		var oCcomm = sap.ui.getCore().byId(this.PAGEID + "_Ccomm");
		oRejectPanel.setVisible(false);
		
//		var oAccom = sap.ui.getCore().byId(this.PAGEID + "_Accom");
		
		switch(this._vAstat) {
			case "20" :
				oCompleteBtn.setVisible(true);
				oRejectBtn.setVisible(true);
				break;
			case "40" :
				oRejectPanel.setVisible(true);
			case "50" :
				oCompleteBtn.setVisible(false);
				oRejectBtn.setVisible(false);
				break;
			default :
				oCompleteBtn.setVisible(false);
			oRejectBtn.setVisible(false);
		}
		this.readEducationRegister(this._vAppno);
		
		var oAnzklLabelField = sap.ui.getCore().byId(this.PAGEID + "_Anzkl_LabelField");
		var oAnzklDataField = sap.ui.getCore().byId(this.PAGEID + "_Anzkl_DataField");
		if(this._vMolga == "41") {
			oAnzklLabelField.addStyleClass("L2PDisplayNone");
			oAnzklDataField.addStyleClass("L2PDisplayNone");
		} else {
			oAnzklLabelField.removeStyleClass("L2PDisplayNone");
			oAnzklDataField.removeStyleClass("L2PDisplayNone");
		}
		var oZzqualiCell1 = sap.ui.getCore().byId(this.PAGEID + "_Zzquali_Cell1");
		var oZzqualiCell2 = sap.ui.getCore().byId(this.PAGEID + "_Zzquali_Cell2");
		if(this._vMolga == "08") {
			oZzqualiCell1.removeStyleClass("L2PDisplayNone");
			oZzqualiCell2.removeStyleClass("L2PDisplayNone");
		} else {
			oZzqualiCell1.addStyleClass("L2PDisplayNone");
			oZzqualiCell2.addStyleClass("L2PDisplayNone");
		}
	},
	
	getSearchPersonInfo : function(oController , _iPernr ){
		var vPerson = {};
		var oModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
		var filterString = "/ApplicantInfoSet/?$filter="; 
			filterString += "Pernr%20eq%20%27" + _iPernr + "%27";
			
			oModel.read(filterString,
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							vPerson    = oData.results[0] ;
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);	
			
		return vPerson;
		
	},
	
	////////////////////////////////////////////////////////////////////////////////////////////////
	//////// 신청자 정보 Layout 구성
	///////////////////////////////////////////////////////////////////////////////////////////////
	onSetApplicantPanel : function(oController, fy){
		var oApplicantPanel = sap.ui.getCore().byId(oController.PAGEID + "_ApplicantPanel");
		console.log(fy);
		if(fy.Rpers != fy.Apers ){  // HASS 에서 접근 하고 신청자와 대상자가 다를 경우
			var oApern = sap.ui.getCore().byId(oController.PAGEID + "_Apern");
			var oEAdress = sap.ui.getCore().byId(oController.PAGEID + "_EAddress");
			var oApplicant_Zzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_Applicant_Zzjobgr");
			var oApplicant_Zzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_Applicant_Zzcaltl");
			var oApplicant_Rorgt = sap.ui.getCore().byId(oController.PAGEID + "_Applicant_Rorgt");
			
			oApplicantPanel.setVisible(true);
			// 신청자 정보를 조회하여 화면에 Binding 
			var vPersonData = oController.getSearchPersonInfo(oController, fy.Apers);
			
			oApern.setText(vPersonData.Ename);
			oEAdress.setText(vPersonData.UsridLong);
			oApplicant_Zzjobgr.setText(vPersonData.Zzjobgrtx);
			oApplicant_Zzcaltl.setText(vPersonData.Zzcaltltx);
			oApplicant_Rorgt.setText(vPersonData.Orgtx);
		}else {
			oApplicantPanel.setVisible(false);
		}
	},
	
	readEducationRegister : function(vAppno) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequest");
		var oController = oView.getController();
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_Begda");
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_Endda");
		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Slart");
		var oSlabs = sap.ui.getCore().byId(oController.PAGEID + "_Slabs");
		var oSland = sap.ui.getCore().byId(oController.PAGEID + "_Sland");
		var oSchcd = sap.ui.getCore().byId(oController.PAGEID + "_Schcd");
		var oAnzkl = sap.ui.getCore().byId(oController.PAGEID + "_Anzkl");
		var oSltp1 = sap.ui.getCore().byId(oController.PAGEID + "_Sltp1");
		var oSltp2 = sap.ui.getCore().byId(oController.PAGEID + "_Sltp2");
//		var oZzfmark = sap.ui.getCore().byId(oController.PAGEID + "_Zzfmark");
		var oZzacksl = sap.ui.getCore().byId(oController.PAGEID + "_Zzacksl");
		var oZzdipno = sap.ui.getCore().byId(oController.PAGEID + "_Zzdipno");
		var oZzgrdno = sap.ui.getCore().byId(oController.PAGEID + "_Zzgrdno");
		var oCcomm = sap.ui.getCore().byId(oController.PAGEID + "_Ccomm");
		var oAccom = sap.ui.getCore().byId(oController.PAGEID + "_Accom");
		var oZzquali = sap.ui.getCore().byId(oController.PAGEID + "_Zzquali");
		
		// 값 초기화
		oBegda.setValue("");
		oEndda.setValue("");
		oSlart.setSelectedKey("0000");
		oSlabs.setSelectedKey("00");
		oSland.setValue("");
		oSland.removeAllCustomData();
		oSland.addCustomData(new sap.ui.core.CustomData({key : "Sland", value : ""}));
		oSchcd.setValue("");
		oSchcd.removeAllCustomData();
    	oSchcd.addCustomData(new sap.ui.core.CustomData({key : "Schcd", value : ""}));
		oAnzkl.setSelectedKey("0");
		oSltp1.setValue("");
		oSltp2.setValue("");
//		oZzfmark.setSelected(false);
		oZzacksl.setSelected(false);
		oZzdipno.setValue("");
		oZzgrdno.setValue("");
		oCcomm.setValue("");
		oAccom.setValue("");
		oZzquali.setValue("");
		oZzquali.removeAllCustomData();
		oZzquali.addCustomData(new sap.ui.core.CustomData({key : "Zzquali", value : ""}));
		
		// 쓰기 초기화
		oBegda.setEnabled(!oController.DISABLED);
		oEndda.setEnabled(!oController.DISABLED);
		oSlart.setEnabled(!oController.DISABLED);
		oSlabs.setEnabled(!oController.DISABLED);
		oSland.setEnabled(!oController.DISABLED);
		oSchcd.setEnabled(!oController.DISABLED);
 		oAnzkl.setEnabled(!oController.DISABLED);
		oSltp1.setEnabled(!oController.DISABLED);
		oSltp2.setEnabled(!oController.DISABLED);
		oZzdipno.setEnabled(!oController.DISABLED);
		oZzgrdno.setEnabled(!oController.DISABLED);
		oAccom.setEnabled(!oController.DISABLED);
		oZzquali.setEnabled(!oController.DISABLED);
		if(this._vAstat == "20" && oController.DISABLED) {
//			oZzfmark.setEnabled(true);
			oZzacksl.setEnabled(true);			
		} else {
//			oZzfmark.setEnabled(!oController.DISABLED);
			oZzacksl.setEnabled(!oController.DISABLED);	
		}
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_EDUCATION_SRV");
		var oParh = "/EduBackgroundRegistSet(Appno='" + vAppno + "')";
		
		oModel.read(oParh,
					null, 
					null, 
					false, 	
					function(oData, oResponse) {
						if(oData) {
							oBegda.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(oData.Begda)))));
							oEndda.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(oData.Endda)))));
							oSlart.setSelectedKey(oData.Slart);
							oSland.setValue(oData.Landx);
							oSland.removeAllCustomData();
							oSland.addCustomData(new sap.ui.core.CustomData({key : "Sland", value : oData.Sland}));
							oSchcd.setValue(oData.Insti);
							oSchcd.removeAllCustomData();
					    	oSchcd.addCustomData(new sap.ui.core.CustomData({key : "Schcd", value : oData.Schcd}));
							oAnzkl.setSelectedKey(oData.Anzkl);
//							oZzfmark.setSelected(oData.Zzfmark == "X" ? true : false);
							oZzacksl.setSelected(oData.Zzacksl == "X" ? true : false);
							oZzdipno.setValue(oData.Zzdipno);
							oZzgrdno.setValue(oData.Zzgrdno);
							oZzquali.setValue(oData.Zzqualitx);
							oZzquali.addCustomData(new sap.ui.core.CustomData({key : "Zzquali", value : oData.Zzquali}));
							oController.setSLABS(oData.Slabs);
							//oController.setFAART(oData.Sltp1, oData.Sltp2);
							oSltp1.setValue(oData.Zzsltp1tx);
							oSltp2.setValue(oData.Zzsltp2tx);

							oCcomm.setValue(oData.Ccomm);
							oAccom.setValue(oData.Accom);
						};
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}		
		);
	},
	
	navToBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequest");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : oController._vFromPageId,
		      data : {
		    	  
		      }
		});
	},

	onPressComplete : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequest");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_EDUCATION_SRV");
		
		var updateData = {};
		
		updateData.Appno = oController._vAppno;
		updateData.Astat = "50";
		updateData.Chgfg =  oController._vChgfg;
		
//		var oZzfmark = sap.ui.getCore().byId(oController.PAGEID + "_Zzfmark");
//		if(oZzfmark) {
//			if(oZzfmark.getSelected()) {
//				updateData.Zzfmark = "X";
//			} else {
//				updateData.Zzfmark = "";
//			}
//		}
		
		var oZzacksl = sap.ui.getCore().byId(oController.PAGEID + "_Zzacksl");
		if(oZzacksl) {
			if(oZzacksl.getSelected()) {
				updateData.Zzacksl = "X";
			} else {
				updateData.Zzacksl = "";
			}
		}
		
		var checkProcess = function() {
			var checkData = {};
			checkData.Pernr = oController._vPernr;
			checkData.chk = false;
			checkData.message = "";
//			checkData.Zzfmark = "";
			checkData.Zzacksl = "";
			
//			if(checkData.Pernr != "" && (updateData.Zzfmark == "X" || updateData.Zzacksl == "X" )) {
			if(checkData.Pernr != "" && updateData.Zzacksl == "X") {
				oModel.read(
						"EduRegistCheckSet/?$filter=Pernr eq '" + checkData.Pernr + "'",
						null, 
						null, 
						false,
						function(oData, oResponse) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
//									checkData.Zzfmark = oData.results[i].Zzfmark;
									checkData.Zzacksl = oData.results[i].Zzacksl;
									break;
								}
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
				);
				
//				if(updateData.Zzfmark == "X" && checkData.Zzfmark == "X" &&
//				   updateData.Zzacksl == "X" && checkData.Zzacksl == "X") {
//					checkData.chk = true;
//					checkData.message = oBundleText.getText("MSG_CHK_ZZFMARK_ZZACKSL");
//				} else if(updateData.Zzfmark == "X" && checkData.Zzfmark == "X") {
//					checkData.chk = true;
//					checkData.message = oBundleText.getText("MSG_CHK_ZZFMARK");
//				} else if(updateData.Zzacksl == "X" && checkData.Zzacksl == "X") {
//					checkData.chk = true;
//					checkData.message = oBundleText.getText("MSG_CHK_ZZACKSL");
//				}
				if(updateData.Zzacksl == "X" && checkData.Zzacksl == "X") {
					checkData.chk = true;
					checkData.message = oBundleText.getText("MSG_CHK_ZZACKSL");
				}
			}
			
			if(checkData.chk) {
				sap.m.MessageBox.show(checkData.message, {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: oBundleText.getText("TITLE_EDUCATION_COMPLETE"),
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			        onClose: updateProcess
				});
			} else {
				updateProcess(sap.m.MessageBox.Action.YES);
			}
			
		};
		
		var updateProcess = function(oAction) {
			if ( oAction === sap.m.MessageBox.Action.YES ) {
				var process_result = false;
					
				var oPath = "/EduBackgroundRegistSet(Appno='" + oController._vAppno + "')";
				oModel.update(
						oPath, 
						updateData, 
						null,
					    function (oData, response) {
							process_result = true;
							common.Common.log("Sucess EduBackgroundRegistSet update !!!");
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
					
				if(oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}
				
				if(!process_result) {
					return;
				}
					
				sap.m.MessageBox.alert(oBundleText.getText("MSG_FAMILY_COMPLETE_FINISHED"), {
					title: oBundleText.getText("INFORMATION"),
					onClose : function() {
						oController.navToBack();
					}
				});
			} else {
				if(oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}
			}
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
				
				setTimeout(checkProcess, 300);
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("MSG_EDUCATION_COMPLETE_QUESTION"), {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("TITLE_EDUCATION_COMPLETE"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: onProcessing
		});
	},
	
	onPressReject : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequest");
		var oController = oView.getController();		
		
		if(!oController._CommentDialog) {
			oController._CommentDialog = sap.ui.jsfragment("zui5_hrxx_acteducation.fragment.EducationRejComment", oController);
			oView.addDependent(oController._CommentDialog);
		}
		
		oController._CommentDialog.open();
	},
	
	onBeforeOpenSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequest");
		var oController = oView.getController();
		
		var oComment = sap.ui.getCore().byId(oController.PAGEID + "_POP_Ccomm");
		oComment.setValue("");
	},
	
	onPressConfirm : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequest");
		var oController = oView.getController();
		
		var oComment = sap.ui.getCore().byId(oController.PAGEID + "_POP_Ccomm");
		var vComment = oComment.getValue();
		if(vComment == "") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_REJECT_COMMENT"));
			return;
		}
		
		oController.onCOClose();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_EDUCATION_SRV");
		
		var updateProcess = function() {
			var process_result = false;			

			var updateData = {};
			
			updateData.Appno = oController._vAppno;
			updateData.Ccomm = vComment;
			updateData.Astat = "40";
			
			var oPath = "/EduBackgroundRegistSet(Appno='" + oController._vAppno + "')";
			oModel.update(
					oPath, 
					updateData, 
					null,
				    function (oData, response) {
						process_result = true;
						common.Common.log("Sucess EduBackgroundRegistSet update !!!");
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
				
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
				
			if(!process_result) {
				return;
			}
				
			sap.m.MessageBox.alert(oBundleText.getText("MSG_REJECT_FINISHED"), {
				title: oBundleText.getText("INFORMATION"),
				onClose : function() {
					oController.navToBack();
				}
			});
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
		
		setTimeout(updateProcess, 300);
	},
	
	onCOClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequest");
		var oController = oView.getController();		
		
		if(oController._CommentDialog.isOpen()) {
			oController._CommentDialog.close();
		}
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 학위 DDLB
/////////////////////////////////////////////////////////////////////////////////////////////
	setSLABS : function(vSelectedKey) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequest");
		var oController = oView.getController();
		
		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Slart");
		var oSlabs = sap.ui.getCore().byId(oController.PAGEID + "_Slabs");
		
		oSlabs.removeAllItems();
		oSlabs.addItem(
			new sap.ui.core.Item({
				key : "00", 
				text : oBundleText.getText("SELECTDATA")
			})
		);
		
		var oCommonModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
		var oPath = "/EmpCodeListSet/?$filter=Field%20eq%20%27Slabs%27%20and%20Excod%20eq%20%27" + oSlart.getSelectedKey() + 
		            "%27%20and%20PersaNc%20eq%20%27X%27";
		
		oCommonModel.read(
					oPath,
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								oSlabs.addItem(
									new sap.ui.core.Item({
										key : oData.results[i].Ecode, 
										text : oData.results[i].Etext
									})
								);
							}
							if(vSelectedKey != "00" && vSelectedKey != "") oSlabs.setSelectedKey(vSelectedKey);
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
	},
	
	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_DATE"),{
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	}
});