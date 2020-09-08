jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.SearchOrg");
jQuery.sap.require("sap.m.MessageBox");

sap.ui.controller("zui5_hrxx_actdoc.HRDocDetail", {
	
	PAGEID : "HRDocDetail",
	
	BusyDialog: null,
	
	_vContext : null,
	
	_vPersa : "",
	_vHrdno : "",
	_vDocst : "",
	_vMolga : "",
	
	_MailSendDialog : null,
	
	_AddPersonDialog : null,
	_SerachOrgDialog : null,
	
	_vGridData : {data : []},
	_vRowId : 0,
	
	_vMailSendData : [],
	
	_vMailHtml : "", 
	
	oPersonList : null,
	oMailSendList : null,
	
	vColumns : [ {id : "Numbr", label : oBundleText.getText("NUMBER"), control : "Seq", width : "40", show : "E", align : "left", filter : "#rspan"},
                 {id : "Ename", label : oBundleText.getText("ENAME"), control : "Text", width : "150", show : "E", align : "left", filter : "#text_filter"},
                 {id : "Zzcaltltx", label : oBundleText.getText("ZZCALTL"), control : "Text", width : "*", show : "E", align : "left", filter : "#combo_filter"},
                 {id : "Zzpsgrptx", label : oBundleText.getText("ZZPSGRP"), control : "Text", width : "*", show : "E", align : "left", filter : "#combo_filter"},
                 {id : "Zzjobgrtx", label : oBundleText.getText("ZZJOBGR"), control : "Text", width : "*", show : "E", align : "left", filter : "#combo_filter"},
                 {id : "Fulln", label : oBundleText.getText("STEXT"), control : "Text", width : "200", show : "E", align : "left", filter : "#combo_filter"},
                 {id : "Pgtxt", label : oBundleText.getText("PERSG"), control : "Text", width : "*", show : "E", align : "left", filter : "#combo_filter"},
                 {id : "Pktxt", label : oBundleText.getText("PERSK"), control : "Text", width : "*", show : "E", align : "left", filter : "#combo_filter"}, //
                 {id : "Entda", label : oBundleText.getText("ENTDA"), control : "Text", width : "*", show : "E", align : "left", filter : "#rspan"},
                 {id : "Ansal", label : oBundleText.getText("ANSAL"), control : "Text", width : "*", show : "", align : "left", filter : "#rspan"},
                 {id : "Ancur", label : oBundleText.getText("WAERS"), control : "Text", width : "*", show : "", align : "left", filter : "#rspan"},
                 {id : "Asbeg", label : oBundleText.getText("ASBEG"), control : "Text", width : "*", show : "", align : "left", filter : "#rspan"},
                 {id : "Asend", label : oBundleText.getText("ASEND"), control : "Text", width : "*", show : "", align : "left", filter : "#rspan"},
                 {id : "Condt", label : oBundleText.getText("CONDT"), control : "Text", width : "*", show : "", align : "left", filter : "#rspan"},
                 {id : "Pernr", label : oBundleText.getText("PERNR"), control : "Hidden", width : "*", show : "E", align : "left", filter : "#rspan"},
                ],
                
    vMailColumns : [ {id : "Numbr", label : oBundleText.getText("NUMBER"), control : "Text", width : "40", align : "center", filter : "#rspan"},
                 {id : "Ename", label : oBundleText.getText("ENAME"), control : "Text", width : "150", align : "left", filter : "#text_filter"},
                 {id : "Pernr", label : oBundleText.getText("PERNR"), control : "Text", width : "100", align : "left", filter : "#text_filter"},
                 {id : "Zzcaltltx", label : oBundleText.getText("ZZCALTL"), control : "Text", width : "100", align : "left", filter : "#combo_filter"},
                 {id : "Zzpsgrptx", label : oBundleText.getText("ZZPSGRP"), control : "Text", width : "100", align : "left", filter : "#combo_filter"},
                 {id : "Zzjobgrtx", label : oBundleText.getText("ZZJOBGR"), control : "Text", width : "100", align : "left", filter : "#combo_filter"},
                 {id : "Email", label : oBundleText.getText("EMAIL"), control : "Text", width : "100", align : "left", filter : "#combo_filter"},
                 {id : "Hrdno", label : oBundleText.getText("HRDNO"), control : "Hidden", width : "100", align : "left", filter : "#combo_filter"},
                 {id : "Pernr", label : oBundleText.getText("Pernr"), control : "Hidden", width : "100", align : "left", filter : "#combo_filter"},
                 {id : "Persa", label : oBundleText.getText("PBTXT"), control : "Hidden", width : "100", align : "left", filter : "#combo_filter"},
                 {id : "Frmcd", label : oBundleText.getText("FRMCD"), control : "Hidden", width : "100", align : "left", filter : "#combo_filter"},
                ],            
                
    /**
     * 페이지를 초기화 한다.
     * 페이지 Open 전후에 수행할 Method를 정의한다.
     * 인사영역, 문서종류 리스트를 해당 Control에 할당 한다.
     * 
     * @memberOf zui5_hrxx_actdoc.HRDocDetail
     */
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			this.getView().addStyleClass("sapUiSizeCompact");
		};
		
		var oController = this;
	
	    this.getView().addEventDelegate({
			onBeforeShow  : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow  : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this),
		});
	    
	    var mPersAreaListSet = sap.ui.getCore().getModel("PersAreaListSet");
		var vPersAreaListSet = mPersAreaListSet.getProperty("/PersAreaListSet");
		
		var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
		try {
			for(var i=0; i<vPersAreaListSet.length; i++) {
				oPersa.addItem(
					new sap.ui.core.Item({
						key : vPersAreaListSet[i].Persa, 
						text : vPersAreaListSet[i].Pbtxt
					})
				);
			};
		} catch(ex) {
			common.Common.log(ex);
		}
		
		var oHrdoc = sap.ui.getCore().byId(this.PAGEID + "_Hrdoc");
		var mHrDocumentTYpeSet = sap.ui.getCore().getModel("HrDocumentTYpeSet");
		var vHrDocumentTYpeSet = mHrDocumentTYpeSet.getProperty("/HrDocumentTYpeSet");
		try {
			for(var i=0; i<vHrDocumentTYpeSet.length; i++) {
				oHrdoc.addItem(
					new sap.ui.core.Item({
						key : vHrDocumentTYpeSet[i].Hrdoc, 
						text : vHrDocumentTYpeSet[i].Hrdoctx
					})
				);
			};
		} catch(ex) {
			common.Common.log(ex);
		}
		
		sap.ui.getCore().getEventBus().subscribe("app", "ResizeWindow", this.onResizeWindow, this);
		
		var html_url = "/sap/bc/ui5_ui5/sap/zhrxx_common/emailhtml/hrdoc_notice_email.html";
		
		var request = $.ajax({ 
			  url: html_url,
			  cache: false,
			  async: false
		});
		
		request.done(function( html ) {
			oController._vMailHtml = html;
		});
			 
		request.fail(function( jqXHR, textStatus ) {
			
		});
	},
	
	/**
	 * 페이지가 Open 전에 수행한다.
	 * 문서 상태에 따라 각종 Control를 제어한다.
	 * @param oEvent
	 */
	onBeforeShow : function(oEvent) {
		if(this.oPersonList) {
			this.oPersonList.clearAll(false);
		}
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		this._vDocst = oEvent.data.Docst;
		this._vPersa = oEvent.data.Persa;
		this._vHrdno = oEvent.data.Hrdno;
		
		this._vGridData.data = [];
		this._vRowId = 1;
		
		if(typeof HRDocTargetDataSheet == "object") {
			HRDocTargetDataSheet.Reset();
		}	
		
		this._vContext = oEvent.data.Context;
		
		var oDELETE_BTN = sap.ui.getCore().byId(this.PAGEID + "_DELETE_BTN");
		var oDel_Btn = sap.ui.getCore().byId(this.PAGEID + "_Del_Btn");
		var oAdd_Btn = sap.ui.getCore().byId(this.PAGEID + "_Add_Btn");
		var oUpload_Btn = sap.ui.getCore().byId(this.PAGEID + "_EXCEL_UPLOAD_BTN");
		var oDownload_Btn = sap.ui.getCore().byId(this.PAGEID + "_EXCEL_DOWNLOAD_BTN");
		
		var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
		var oHrdoc = sap.ui.getCore().byId(this.PAGEID + "_Hrdoc");
		var oDoctl = sap.ui.getCore().byId(this.PAGEID + "_Doctl");
		var oSmbda = sap.ui.getCore().byId(this.PAGEID + "_Smbda");
		var oSmeda = sap.ui.getCore().byId(this.PAGEID + "_Smeda");
		var oRmprd = sap.ui.getCore().byId(this.PAGEID + "_Rmprd");
		var oRqcnt = sap.ui.getCore().byId(this.PAGEID + "_Rqcnt");
		
		common.Common.log("_vDocst : " + this._vDocst);
		
		if(this._vDocst == "00") {
			oAdd_Btn.setVisible(false);
			oDELETE_BTN.setVisible(false);
			oDel_Btn.setVisible(false);
			oUpload_Btn.setVisible(false);
			oDownload_Btn.setVisible(false);
			
			oPersa.setEnabled(true);
			oHrdoc.setEnabled(true);
			
			oDoctl.setValue("");
			
			oSmbda.setValue(dateFormat.format(new Date()));
			oSmeda.setValue(dateFormat.format(new Date()));
			
			oRmprd.setSelectedIndex(0);
			
			oRqcnt.setText("0");
		} else {
			var mHrDocumentsSet = sap.ui.getCore().getModel("HrDocumentsSet");
			
			oAdd_Btn.setVisible(true);
			oDel_Btn.setVisible(true);
			oDELETE_BTN.setVisible(true);
			oUpload_Btn.setVisible(true);
			oDownload_Btn.setVisible(true);
			
			oPersa.setSelectedKey(this._vPersa);
			oHrdoc.setSelectedKey(mHrDocumentsSet.getProperty(this._vContext + "/Hrdoc"));
			
			oPersa.setEnabled(false);
			oHrdoc.setEnabled(false);
			
			var vRmrpd = mHrDocumentsSet.getProperty(this._vContext + "/Rmprd");
			if(vRmrpd == "10") oRmprd.setSelectedIndex(0);
			else if(vRmrpd == "20") oRmprd.setSelectedIndex(1);
			else if(vRmrpd == "30") oRmprd.setSelectedIndex(2);
			
			oDoctl.setValue(mHrDocumentsSet.getProperty(this._vContext + "/Doctl"));
			
			oSmbda.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(mHrDocumentsSet.getProperty(this._vContext + "/Smbda"))))));
			oSmeda.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(mHrDocumentsSet.getProperty(this._vContext + "/Smeda"))))));

			oRqcnt.setText(mHrDocumentsSet.getProperty(this._vContext + "/Rqcnt"));
		}
	},
	
	/**
	 * 페이지가 Open 한 후에 수행한다.
	 * 문서가 작성중인 경우 해당 HR 문서정보를 가져와서 해당 Control에 값을 할당 한다.(HrDocumentsDetailsSet)
	 * @param oEvent
	 */
	onAfterShow : function(oEvent) {
		var oController = this;
		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_HRDOC_SRV");
		
		var filterString = "";
		filterString += "/?$filter=Persa%20eq%20%27" + this._vPersa + "%27";
		filterString += "%20and%20Hrdno%20eq%20%27" + this._vHrdno + "%27";
		
		this.onAfterRenderingTableLayout();
		
		var oDel_Btn = sap.ui.getCore().byId(this.PAGEID + "_Del_Btn");
		
		if(this._vDocst == "10") {
			oModel.read("/HrDocumentsDetailsSet" + filterString, 
					null, 
					null, 
					true,
					function(oData, oResponse) {
						if(oData && oData.results) {							
							for(var i=0; i<oData.results.length; i++) {
								var oneData = oData.results[i];
								oneData.Ichek = 0;
								oneData.Numbr = (i+1);
								if(oneData.Entda != null) {
									oneData.Entda = dateFormat1.format(new Date(common.Common.setTime(new Date(oneData.Entda))));
								} else {
									oneData.Entda = "";
								}
								if(oneData.Asbeg != null) {
									oneData.Asbeg = dateFormat1.format(new Date(common.Common.setTime(new Date(oneData.Asbeg))));
								} else {
									oneData.Asbeg = "";
								}
								if(oneData.Asend != null) {
									oneData.Asend = dateFormat1.format(new Date(common.Common.setTime(new Date(oneData.Asend))));
								} else {
									oneData.Asend = "";
								}
								if(oneData.Condt != null) {
									oneData.Condt = dateFormat1.format(new Date(common.Common.setTime(new Date(oneData.Condt))));
								} else {
									oneData.Condt = "";
								}
								oController._vGridData.data.push(oneData);
							}
							
							HRDocTargetDataSheet.LoadSearchData(oController._vGridData);
							oDel_Btn.setVisible(true);							
						}
					},
					function(oResponse) {
						
					}
			);
			
			HRDocTargetDataSheet.SetCellFont("FontSize", 0, "Ichek", HRDocTargetDataSheet.RowCount() + HRDocTargetDataSheet.HeaderRows(),  "Entda", 13);
			HRDocTargetDataSheet.SetCellFont("FontName", 0, "Ichek", HRDocTargetDataSheet.RowCount() + HRDocTargetDataSheet.HeaderRows(),  "Entda", "Malgun Gothic");
		}
	},
	
	/**
	 * 페이지가 Resize 이벤트가 발생하면 수행한다.
	 * 대상자 리스트의 테이블 높이를 조정한다.
	 * @param oEvent
	 * @param oEventId
	 * @param data
	 */
	onResizeWindow : function(oEvent, oEventId, data) {
		$("#" + this.PAGEID + "_PersonList").css("height", window.innerHeight - 360);
	},
	
	refreshData : function(oController) {
		if(oController.oPersonList) {
			oController.oPersonList.clearAll(false);
		}
		
		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});		
		var oModel = sap.ui.getCore().getModel("ZHRXX_HRDOC_SRV");
		
		var filterString = "";
		filterString += "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		filterString += "%20and%20Hrdno%20eq%20%27" + oController._vHrdno + "%27";
		
		oModel.read("/HrDocumentsDetailsSet" + filterString, 
				null, 
				null, 
				true,
				function(oData, oResponse) {
					if(oData && oData.results) {			
						oController._vGridData.data = [];
						for(var i=0; i<oData.results.length; i++) {
							var oneData = oData.results[i];
							oneData.Ichek = 0;
							oneData.Numbr = (i+1);
							if(oneData.Entda != null) {
								oneData.Entda = dateFormat1.format(new Date(common.Common.setTime(new Date(oneData.Entda))));
							} else {
								oneData.Entda = "";
							}
							if(oneData.Rmdda != null) {
								oneData.Rmdda = dateFormat1.format(new Date(common.Common.setTime(new Date(oneData.Rmdda))));
							} else {
								oneData.Rmdda = "";
							}
							if(oneData.Smtda != null) {
								oneData.Smtda = dateFormat1.format(new Date(common.Common.setTime(new Date(oneData.Smtda))));
							} else {
								oneData.Smtda = "";
							}
							if(oneData.Asbeg != null) {
								oneData.Asbeg = dateFormat1.format(new Date(common.Common.setTime(new Date(oneData.Asbeg))));
							} else {
								oneData.Asbeg = "";
							}
							if(oneData.Asend != null) {
								oneData.Asend = dateFormat1.format(new Date(common.Common.setTime(new Date(oneData.Asend))));
							} else {
								oneData.Asend = "";
							}
							if(oneData.Condt != null) {
								oneData.Condt = dateFormat1.format(new Date(common.Common.setTime(new Date(oneData.Condt))));
							} else {
								oneData.Condt = "";
							}
							oneData.Hdimg = "/sap/bc/ui5_ui5/sap/zhrxx_common/images/leaf.gif";
							oController._vGridData.data.push(oneData);
						}		
					}
					else
					{
						oController._vGridData = [];
					}
					HRDocTargetDataSheet.LoadSearchData(oController._vGridData);
				},
				function(oResponse) {
					 
				}
		);
	},
	
	/**
	 * 선택된 HR서류Type 을 Select 한다.
	 * 선택된 Type 에 따라 IBSheet Layout 이 달라진다 .
	 * @param oEvent
	 */
	onChangeHrdoc : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		oController.onAfterRenderingTableLayout();
	},
	
	/**
	 * 선택된 HR서류 대상자를 삭제한다.
	 * @param oEvent
	 */
	deletePerson : function(oEvent) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_HRDOC_SRV");
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		
		if(typeof HRDocTargetDataSheet == "undefined") {
			return;
		}
		
		var vRowCount = HRDocTargetDataSheet.RowCount();
		var vHeaderCount = HRDocTargetDataSheet.HeaderRows();
		var vDelCnt = 0;
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oDel_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Del_Btn");
		
		for(var i=0; i<vRowCount; i++) {
			var vCheckBox = HRDocTargetDataSheet.GetCellValue(i+vHeaderCount, "Ichek");
			if(vCheckBox == 1) {
				vDelCnt++;
			}
		}
		
		if(vDelCnt < 1) {
			oPersa.setEnabled(true);
			oDel_Btn.setVisible(false);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
			return;
		}
		
		var deleteProcess = function() {
			
			var process_result = true;
			
			for(var i=0; i<vRowCount; i++) {
				var vCheckBox = HRDocTargetDataSheet.GetCellValue(i+vHeaderCount, "Ichek");
				if(vCheckBox == 1) {
					var vPernr = oController._vGridData.data[i].Pernr;
					
					var oPath = "/HrDocumentsDetailsSet(Hrdno='" + oController._vHrdno + "',Pernr='" + vPernr + "')";
					
					oModel.remove(
							oPath, 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess HrDocumentsDetailsSet Remove !!!");
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
					
					if(!process_result) {
						if(oController.BusyDialog.isOpen()) {
							oController.BusyDialog.close();
						}
						return;
					}
				}
			}
			
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
				onClose : function() {
					oController.refreshData(oController);
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
		setTimeout(deleteProcess, 300);
	},
		
		/*
		var NewGridData = [];
		
		for(var i=0; i<vRowCount; i++) {
			var vCheckBox = HRDocTargetDataSheet.GetCellValue(i+vHeaderCount, "Ichek");
			if(vCheckBox == 1) {
				
			} else {
				NewGridData.push(oController._vGridData.data[i]);
			}
		}
		*/
		/*
		oController._vGridData.data = [];
		for(var i=0; i<NewGridData.length; i++) {
			NewGridData[i].Numbr = (i+1);
			oController._vGridData.data.push(NewGridData[i]);
		}
		
		HRDocTargetDataSheet.LoadSearchData(oController._vGridData);
		
		oRqcnt.setText(oController._vGridData.data.length);
		
		if(oController._vGridData.data.length < 1) {
			oPersa.setEnabled(true);
			oDel_Btn.setVisible(false);
		}
			
	},*/
	
	downloadExcelFormat : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		var oHrdoc = sap.ui.getCore().byId(oController.PAGEID + "_Hrdoc");
		if(oHrdoc.getSelectedKey() == "20" || oHrdoc.getSelectedKey() == "60"){
			if(oController._vMolga == "41")
				document.IFRAMEDOWNLOAD.location.href = "/sap/bc/ui5_ui5/sap/zhrxx_hassapp/zui5_hrxx_actdoc/excelfile/Excel_Style_Other_Ko.xls";
			else if(oController._vMolga == "28")
				document.IFRAMEDOWNLOAD.location.href = "/sap/bc/ui5_ui5/sap/zhrxx_hassapp/zui5_hrxx_actdoc/excelfile/Excel_Style_Other_Ko.xls";
			else 
				document.IFRAMEDOWNLOAD.location.href = "/sap/bc/ui5_ui5/sap/zhrxx_hassapp/zui5_hrxx_actdoc/excelfile/Excel_Style_Other_Ko.xls";
		}else{
			if(oController._vMolga == "41")
				document.IFRAMEDOWNLOAD.location.href = "/sap/bc/ui5_ui5/sap/zhrxx_hassapp/zui5_hrxx_actdoc/excelfile/Excel_Style_Ko.xls";
			else if(oController._vMolga == "28")
				document.IFRAMEDOWNLOAD.location.href = "/sap/bc/ui5_ui5/sap/zhrxx_hassapp/zui5_hrxx_actdoc/excelfile/Excel_Style_Ko.xls";
			else 
				document.IFRAMEDOWNLOAD.location.href = "/sap/bc/ui5_ui5/sap/zhrxx_hassapp/zui5_hrxx_actdoc/excelfile/Excel_Style_Ko.xls";
		}
	},
	
	onPressUpload : function(oEvent) {
//		var params = { Mode : "HeaderMatch" } ;
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		var oHrdoc = sap.ui.getCore().byId(oController.PAGEID + "_Hrdoc");
		var params ;
		if(oHrdoc.getSelectedKey() == "20" || oHrdoc.getSelectedKey() == "60"){
			params = { ColumnMapping : ' | | | | | | | | | |2|3|4|5|6|1'	} ;
		}else{
			params = { ColumnMapping : ' | | | | | | | | | |1'	} ;
		}
		if(typeof HRDocTargetDataSheet == "object") {
			HRDocTargetDataSheet.LoadExcel(params);
		}
	},
	
	checkData : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		var oHrdoc = sap.ui.getCore().byId(oController.PAGEID + "_Hrdoc");
		if(typeof HRDocTargetDataSheet != "object") {
			return;
		}
		oController._vGridData.data = [];
		var vRowCount = HRDocTargetDataSheet.RowCount();
		var vHeaderCount = HRDocTargetDataSheet.HeaderRows();
		var process_result = true;
		
		if(oHrdoc.getSelectedKey() == "20" || oHrdoc.getSelectedKey() == "70"){}
		else return true;
		
		var vMessage = oBundleText.getText("ERROR_HRDOC_UPLOAD"); 
		for(var i=0; i<vRowCount; i++){
			var createData = HRDocTargetDataSheet.GetRowJson(i + vHeaderCount); 
			if(createData.Pernr == null || createData.Pernr == ""){
				process_result = false;
				vMessage = vMessage.replace("%idx",i+1);
				vMessage = vMessage.replace("%Pernr","");
				vMessage = vMessage.replace("%FieldName", oBundleText.getText("PERNR") );
				break;
			}
			if(createData.Ansal == null || createData.Ansal == ""){
				process_result = false;
				vMessage = vMessage.replace("%idx",i+1);
				vMessage = vMessage.replace("%Pernr",createData.Pernr);
				vMessage = vMessage.replace("%FieldName", oBundleText.getText("ANSAL") );
				break;
			}
			if(createData.Ancur == null || createData.Ancur == ""){
				process_result = false;
				vMessage = vMessage.replace("%idx",i+1);
				vMessage = vMessage.replace("%Pernr",createData.Pernr);
				vMessage = vMessage.replace("%FieldName", oBundleText.getText("ANCUR") );
				break;
			}
		    if(createData.Asbeg == null || createData.Asbeg == ""){
				process_result = false;
				vMessage = vMessage.replace("%idx",i+1);
				vMessage = vMessage.replace("%Pernr",createData.Pernr);
				vMessage = vMessage.replace("%FieldName", oBundleText.getText("ASBEG") );
				break;
			}
			if(createData.Asend == null || createData.Asend == ""){
				process_result = false;
				vMessage = vMessage.replace("%idx",i+1);
				vMessage = vMessage.replace("%Pernr",createData.Pernr);
				vMessage = vMessage.replace("%FieldName", oBundleText.getText("ASEND") );
				break;
			}
			if(createData.Condt == null || createData.Condt == ""){
				process_result = false;
				vMessage = vMessage.replace("%idx",i+1);
				vMessage = vMessage.replace("%Pernr",createData.Pernr);
				vMessage = vMessage.replace("%FieldName", oBundleText.getText("CONDT") );
				break;
			}
		}
		
		if(process_result == false){
			sap.m.MessageBox.alert(vMessage);
		}
		
		return process_result;
	},
	
	validData : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_HRDOC_SRV");
		if(typeof HRDocTargetDataSheet != "object") {
			return;
		}
		
		oController._vGridData.data = [];
		var vRowCount = HRDocTargetDataSheet.RowCount();
		var vHeaderCount = HRDocTargetDataSheet.HeaderRows();
	
		var idx = 0;
		var success_cnt = 0;
		var fail_cnt = 0;
		
		var readAfterProcess = function() {
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			oController.refreshData(oController);
		};
		
		var validProcess = function() {	

			if(idx >= vRowCount) {
				vReqCntAll = fail_cnt + success_cnt ;
				readAfterProcess();
				return;
			}	
			var createData = HRDocTargetDataSheet.GetRowJson(idx + vHeaderCount); 
			if(createData.Pernr == ""){
				readAfterProcess();
				return;
			}
			
			var controlData = {}; 
			
			controlData.Pernr = createData.Pernr;
			controlData.Persa = oController._vPersa;
			idx++;
			
			controlData.Hrdno = oController._vHrdno;
			controlData.First = "";
			controlData.Ansal = createData.Ansal;
			controlData.Ancur = createData.Ancur;
//			var vDate1 = new Date();
//			vDate1.setUTCFullYear(parseInt(createData.Asbeg.substring(0,4)));
//			vDate1.setUTCMonth(parseInt(createData.Asbeg.substring(4,6)) - 1);
//			vDate1.setUTCDate(parseInt(createData.Asbeg.substring(6,8)));
//			controlData.Asbeg = "\/Date(" + vDate1.getTime() + ")\/";
//			var vDate2 = new Date();
//			vDate2.setUTCFullYear(parseInt(createData.Asend.substring(0,4)));
//			vDate2.setUTCMonth(parseInt(createData.Asend.substring(4,6)) - 1);
//			vDate2.setUTCDate(parseInt(createData.Asend.substring(6,8)));
//			controlData.Asend = "\/Date(" + vDate2.getTime() + ")\/";
//			var vDate3 = new Date();
//			vDate3.setUTCFullYear(parseInt(createData.Condt.substring(0,4)));
//			vDate3.setUTCMonth(parseInt(createData.Condt.substring(4,6)) - 1);
//			vDate3.setUTCDate(parseInt(createData.Condt.substring(6,8)));
//			controlData.Condt = "\/Date(" + vDate3.getTime() + ")\/";
			
			var vDate = createData.Asbeg.substring(0,4) + "-" + createData.Asbeg.substring(4,6) + "-" + createData.Asbeg.substring(6,8);
			controlData.Asbeg = "\/Date(" + common.Common.getTime(vDate) + ")\/";
			vDate = createData.Asend.substring(0,4) + "-" + createData.Asend.substring(4,6) + "-" + createData.Asend.substring(6,8);
			controlData.Asend = "\/Date(" + common.Common.getTime(vDate) + ")\/";
			vDate = createData.Condt.substring(0,4) + "-" + createData.Condt.substring(4,6) + "-" + createData.Condt.substring(6,8);
			controlData.Condt = "\/Date(" + common.Common.getTime(vDate) + ")\/";
			
//			controlData.Asbeg = "\/Date(" + common.Common.getTime(createData.Asbeg) + ")\/";
//			controlData.Asend = "\/Date(" + common.Common.getTime(createData.Asend) + ")\/";
//			controlData.Condt = "\/Date(" + common.Common.getTime(createData.Condt) + ")\/";
			
			
			//if(i == 0) createData.First = "X";
			var oPath = "/HrDocumentsDetailsSet";
			oModel.create(
					oPath, 
					controlData, 
					null,
				    function (oData, response) {
						process_result = true;
						success_cnt ++ ;
						common.Common.log("Sucess HrDocumentsDetailsSet Create !!!");
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
						fail_cnt++;
				    }
		    );
			
			if(!process_result) {
				readAfterProcess();
				return;
			}
			
			setTimeout(validProcess, 300);
		};
		
		if(!oController.BusyDialog) {			
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_VALID_PROCESSING_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_VALID_PROCESSING_WAIT")}));
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		setTimeout(validProcess, 300);
	},
	
	/**
	 * 작성된 문서 정보 및 HR서류 대상자 정보를 저장한다.
	 * 필수 입력항목에 대해 검증한다.
	 * @param oEvent
	 */
	onPressSave: function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		
		if(oController.oPersonList) {
			if(oController.oPersonList.getRowsNum() < 1) {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_HRDOC_NOPERSON"));
				return;
			}
		}
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_HRDOC_SRV");
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oHrdoc = sap.ui.getCore().byId(oController.PAGEID + "_Hrdoc");
		var oDoctl = sap.ui.getCore().byId(oController.PAGEID + "_Doctl");
		var oSmbda = sap.ui.getCore().byId(oController.PAGEID + "_Smbda");
		var oSmeda = sap.ui.getCore().byId(oController.PAGEID + "_Smeda");
		var oRmprd = sap.ui.getCore().byId(oController.PAGEID + "_Rmprd");
		var oAdd_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Add_Btn");
		var oDel_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Del_Btn");
		var oUpload_Btn = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_UPLOAD_BTN");
		var oDownload_Btn = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_DOWNLOAD_BTN");
		var oDELETE_BTN = sap.ui.getCore().byId(oController.PAGEID + "_DELETE_BTN");

		
		oDoctl.setValueState(sap.ui.core.ValueState.None);
		oSmbda.setValueState(sap.ui.core.ValueState.None);
		oSmeda.setValueState(sap.ui.core.ValueState.None);
		
		if(oDoctl.getValue() == "") {
			oDoctl.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_HRDOC_TITLE"));
			return;
		}
		
		if(oSmbda.getValue() == "") {
			oSmbda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_SMBDA"));
			return;
		}
		
		if(oSmeda.getValue() == "") {
			oSmeda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_SMEDA"));
			return;
		}
		
		if(oSmeda.getValue() < oSmbda.getValue()) {
			oSmeda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_SMEDA"));
			return;
		}
		
		if(oHrdoc.getSelectedKey() == "20" || oHrdoc.getSelectedKey() == "70"){}
		else {oAdd_Btn.setVisible(true);}
		
		oDel_Btn.setVisible(true);
		oDELETE_BTN.setVisible(true);
		oUpload_Btn.setVisible(true);
		oDownload_Btn.setVisible(true);
		
		var saveProcess = function() {
			var updateData = {};
			
			updateData.Persa = oPersa.getSelectedKey();
			updateData.Hrdoc = oHrdoc.getSelectedKey();
			updateData.Doctl = oDoctl.getValue();
			
//			updateData.Smbda = "\/Date(" + new Date(oSmbda.getValue()).getTime() + ")\/";
//			updateData.Smeda = "\/Date(" + new Date(oSmeda.getValue()).getTime() + ")\/";
			
			updateData.Smbda = "\/Date(" + common.Common.getTime(oSmbda.getValue()) + ")\/";
			updateData.Smeda = "\/Date(" + common.Common.getTime(oSmeda.getValue()) + ")\/";
			
			updateData.Reqdq = "\/Date(" + new Date().getTime() + ")\/";
			
			if(oRmprd.getSelectedIndex() == 0) {
				updateData.Rmprd = "10";
			} else if(oRmprd.getSelectedIndex() == 1) {
				updateData.Rmprd = "20";
			} else if(oRmprd.getSelectedIndex() == 2) {
				updateData.Rmprd = "30";
			}
			
			var oPath = "/HrDocumentsSet";
			var process_result = false;
			
			if(oController._vDocst == "00") {
				oModel.create(
						oPath, 
						updateData, 
						null,
					    function (oData, response) {
							if(oData) {
								oController._vHrdno = oData.Hrdno;
							}
							process_result = true;
							common.Common.log("Sucess ActionReqListSet Create !!!");
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
			} else if(oController._vDocst == "10") {
				updateData.Hrdno = oController._vHrdno;
				oPath = "/HrDocumentsSet(Persa='" + oPersa.getSelectedKey() + "',Hrdno='" + oController._vHrdno + "')";
				oModel.update(
						oPath, 
						updateData, 
						null,
					    function (oData, response) {
							process_result = true;
							common.Common.log("Sucess ActionReqListSet Update !!!");
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
			
			process_result = oController.savePersonList(oController);
			
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			if(process_result) {
				if(oController._vDocst == "00") {
					oController._vDocst = "10";
				}
				
				oDoctl.setValueState(sap.ui.core.ValueState.None);
				oSmbda.setValueState(sap.ui.core.ValueState.None);
				oSmeda.setValueState(sap.ui.core.ValueState.None);
				
				sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
					title: oBundleText.getText("INFORMATION"),
					onClose : function() {
						oPersa.setEnabled(false);
						oHrdoc.setEnabled(false);
					}
				});
			} else {
				oDoctl.setValueState(sap.ui.core.ValueState.None);
				oSmbda.setValueState(sap.ui.core.ValueState.None);
				oSmeda.setValueState(sap.ui.core.ValueState.None);
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
		
		setTimeout(saveProcess, 300);	
	},
	
	/**
	 * 작성된 문서 정보 및 HR서류 대상자 정보를 저장하고,
	 * 작성된 HR서류 대상자에게 메일발송을 할 수 있는 Dialog를 Open한다. 
	 * @param oEvent
	 */
	onPressRequest : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		
		if(oController.oPersonList) {
			if(oController.oPersonList.getRowsNum() < 1) {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_HRDOC_NOPERSON"));
				return;
			}
		}
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_HRDOC_SRV");
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oHrdoc = sap.ui.getCore().byId(oController.PAGEID + "_Hrdoc");
		var oDoctl = sap.ui.getCore().byId(oController.PAGEID + "_Doctl");
		var oSmbda = sap.ui.getCore().byId(oController.PAGEID + "_Smbda");
		var oSmeda = sap.ui.getCore().byId(oController.PAGEID + "_Smeda");
		var oRmprd = sap.ui.getCore().byId(oController.PAGEID + "_Rmprd");
		
		var oDELETE_BTN = sap.ui.getCore().byId(oController.PAGEID + "_DELETE_BTN");

		
		oDoctl.setValueState(sap.ui.core.ValueState.None);
		oSmbda.setValueState(sap.ui.core.ValueState.None);
		oSmeda.setValueState(sap.ui.core.ValueState.None);
		
		if(oDoctl.getValue() == "") {
			oDoctl.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_HRDOC_TITLE"));
			return;
		}
		
		if(oSmbda.getValue() == "") {
			oSmbda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_SMBDA"));
			return;
		}
		
		if(oSmeda.getValue() == "") {
			oSmeda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_SMEDA"));
			return;
		}
		
		if(oSmeda.getValue() < oSmbda.getValue()) {
			oSmeda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_SMEDA"));
			return;
		}
		
		var saveProcess = function() {
			var updateData = {};
			
			updateData.Persa = oPersa.getSelectedKey();
			updateData.Hrdoc = oHrdoc.getSelectedKey();
			updateData.Doctl = oDoctl.getValue();
			
//			updateData.Smbda = "\/Date(" + new Date(oSmbda.getValue()).getTime() + ")\/";
//			updateData.Smeda = "\/Date(" + new Date(oSmeda.getValue()).getTime() + ")\/";			
//			updateData.Reqdq = "\/Date(" + new Date().getTime() + ")\/";
			
			updateData.Smbda = "\/Date(" + common.Common.getTime(oSmbda.getValue()) + ")\/";
			updateData.Smeda = "\/Date(" + common.Common.getTime(oSmeda.getValue()) + ")\/";			
			updateData.Reqdq = "\/Date(" + new Date().getTime() + ")\/";
			
			if(oRmprd.getSelectedIndex() == 0) {
				updateData.Rmprd = "10";
			} else if(oRmprd.getSelectedIndex() == 1) {
				updateData.Rmprd = "20";
			} else if(oRmprd.getSelectedIndex() == 2) {
				updateData.Rmprd = "30";
			}
			
			var oPath = "/HrDocumentsSet";
			var process_result = false;
			
			if(oController._vDocst == "00") {
				oModel.create(
						oPath, 
						updateData, 
						null,
					    function (oData, response) {
							if(oData) {
								oController._vHrdno = oData.Hrdno;
							}
							process_result = true;
							common.Common.log("Sucess ActionReqListSet Create !!!");
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
			} else if(oController._vDocst == "10") {
				updateData.Hrdno = oController._vHrdno;
				oPath = "/HrDocumentsSet(Persa='" + oPersa.getSelectedKey() + "',Hrdno='" + oController._vHrdno + "')";
				oModel.update(
						oPath, 
						updateData, 
						null,
					    function (oData, response) {
							process_result = true;
							common.Common.log("Sucess ActionReqListSet Update !!!");
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
			
//			process_result = oController.savePersonList(oController);
			
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			if(process_result) {
				if(oController._vDocst == "00") {
					oController._vDocst = "10";

					oDELETE_BTN.setVisible(true);
				}
				
				oDoctl.setValueState(sap.ui.core.ValueState.None);
				oSmbda.setValueState(sap.ui.core.ValueState.None);
				oSmeda.setValueState(sap.ui.core.ValueState.None);
				
				oPersa.setEnabled(false);
				oHrdoc.setEnabled(false);
				
				if(!oController._MailSendDialog) {
					oController._MailSendDialog = sap.ui.jsfragment("zui5_hrxx_actdoc.fragment.MailSendDialog", oController);
					oView.addDependent(oController._MailSendDialog);
				}
				oController._MailSendDialog.open();
			} else {
				oDoctl.setValueState(sap.ui.core.ValueState.None);
				oSmbda.setValueState(sap.ui.core.ValueState.None);
				oSmeda.setValueState(sap.ui.core.ValueState.None);
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
		
		setTimeout(saveProcess, 300);		
	},
	
	/**
	 * 작성된 HR서류 문서를 삭제한다.
	 * @param oEvent
	 */
	onPressDelete : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_HRDOC_SRV");
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		
		var deleteProcess = function() {
			var oPath = "/HrDocumentsSet(Persa='" +oPersa.getSelectedKey() + "',Hrdno='" + oController._vHrdno + "')";
			var process_result = false;
			
			oModel.remove(
					oPath, 
					null,
				    function (oData, response) {
						process_result = true;
						common.Common.log("Sucess HrDocumentsSet Remove !!!");
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
				
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
				onClose : function() {
					oController.navToBack();
				}
			});
			
		};
		
		var onProcessing = function(oAction){
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
				setTimeout(deleteProcess, 300);
        	}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("MSG_DELETE_CONFIRM"), {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("TITLE_HRDOC_DELETE"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: onProcessing
		});
	},
	
	/**
	 * HR서류 대상자 정보를 저장한다.(HrDocumentsDetailsSet Create)
	 * @param oController
	 * @returns {Boolean}
	 */
	savePersonList: function(oController) {
		if(typeof HRDocTargetDataSheet == "undefined") {
			return;
		}	

		var oModel = sap.ui.getCore().getModel("ZHRXX_HRDOC_SRV");
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		
		var oPath = "/HrDocumentsDetailsSet";
		var process_result = true;
		
		if(oController._vGridData && oController._vGridData.data.length) {
			for(var i=0; i<oController._vGridData.data.length; i++) {
				var createData = {};
				
				createData.Persa = oPersa.getSelectedKey();
				createData.Hrdno = oController._vHrdno;
				createData.Pernr = oController._vGridData.data[i].Pernr;
				createData.First = "";
				if(i == 0) createData.First = "X";
				
				oModel.create(
						oPath, 
						createData, 
						null,
					    function (oData, response) {
							process_result = true;
							common.Common.log("Sucess HrDocumentsDetailsSet Create !!!");
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
				
				if(!process_result) {
					return process_result;
				}
			}
		}
		
		return true;		
	},
	
	/**
	 * 리스트 페이지로 이동한다.
	 * @param oEvent
	 */
	navToBack : function(oEvent) {
		sap.ui.getCore().getEventBus().publish("nav", "back", {
	    });	
	},
	
	/**
	 * HR서류 대상자를 추가하기 위해 사원검색 Dialog를 Open 한다.
	 * @param oEvent
	 */
	addPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		oController._vPersa = oPersa.getSelectedKey();
		
		common.SearchUser1.oController = oController;
		
		oController._oUserControl = oEvent.getSource();
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		oController._AddPersonDialog.open();
	},
	
	/**
	 * 사원검색 Dialog에서 선택된 사원들을 HR서류 대상자 리스트에 추가한다.
	 * @param oEvent
	 */
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		
		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		var vSelectedPersonCount = 0;
		
		var oRqcnt = sap.ui.getCore().byId(oController.PAGEID + "_Rqcnt");
		
		if(typeof HRDocTargetDataSheet != "object") {
			return;
		}

		if(vEmpSearchResult && vEmpSearchResult.length) {
			for(var i=0; i<vEmpSearchResult.length; i++) {
				if(vEmpSearchResult[i].Chck == true) {
					vSelectedPersonCount++;
				}				
			}
			if(vSelectedPersonCount < 1) {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
				return;
			}
			
			if(oController._vGridData.data.length > 0) {
				for(var i=0; i<vEmpSearchResult.length; i++) {
					if(vEmpSearchResult[i].Chck == true) {
						for(var h=0; h<oController._vGridData.data.length; h++) {
							var tPernr = oController._vGridData.data[h].Pernr;
							var tEname = oController._vGridData.data[h].Ename;
							if(vEmpSearchResult[i].Pernr == tPernr) {
								var msg = oBundleText.getText("MSG_DUPLICATE_PERSON");
								msg = msg.replace("%CNTL1%", tEname + "(" + tPernr + ")");
								sap.m.MessageBox.alert(msg);
								return;
							}
						}
					}
				}
			}
			
			var vNumbr = oController._vGridData.data.length + 1;
			for(var i=0; i<vEmpSearchResult.length; i++) {
				if(vEmpSearchResult[i].Chck == true) {
					var oneData = {};
					oneData.Ichek = 0;
					oneData.Numbr = vNumbr;
					oneData.Pernr = vEmpSearchResult[i].Pernr;
					
					for(var j=0; j<oController.vColumns.length; j++) {
						var val = eval("vEmpSearchResult[i]." + oController.vColumns[j].id + ";");
						if(oController.vColumns[j].id == "Entda") {
							if(val != null) oneData.Entda = dateFormat1.format(new Date(common.Common.setTime(new Date(val))));
							else oneData.Entda = "";
						} else {
							eval("oneData." + oController.vColumns[j].id + " = val");
						}
					}
					oController._vGridData.data.push(oneData);
					vNumbr++;
				}
			}
			
			HRDocTargetDataSheet.LoadSearchData(oController._vGridData);
			
			oRqcnt.setText(oController._vGridData.data.length);
			
			var oDelPerson = sap.ui.getCore().byId(oController.PAGEID + "_Del_Btn");
			if(oDelPerson && oDelPerson.getVisible() == false) {
				oDelPerson.setVisible(true);
			}
			
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
			return;
		}
		oController.onPressSave(oController);
		common.SearchUser1.onClose();
	},
	
	/**
	 * 사원검색에서 사용되는 조직검색 Dialog를 Open한다.
	 * @param oEvent
	 */
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Multi";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "MultiInput";
		
		if(!oController._SerachOrgDialog) {
			oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SerachOrgDialog);
		}
		oController._SerachOrgDialog.open();
	},
	
	/**
	 * HR서류 대상자를 표현할 IBSheet의 Control를 초기화하고
	 * Column 내용을 설정한다.
	 */
	onAfterRenderingTableLayout : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		var oHrdoc = sap.ui.getCore().byId(oController.PAGEID + "_Hrdoc");
		
		$("#" + oController.PAGEID + "_PersonList").css("height", window.innerHeight - 345);
		
		if(typeof HRDocTargetDataSheet == "undefined") {
			var vLang = "";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") == -1) vLang = "en";
			
			createIBSheet2(document.getElementById(oController.PAGEID + "_PersonList"), "HRDocTargetDataSheet", "100%",  (window.innerHeight - 345) + "px", vLang);
		}	
		
		HRDocTargetDataSheet.Reset();
		
		HRDocTargetDataSheet.SetTheme("DS","GhrisMain");
		
		var initdata = {};
		
		initdata.HeaderMode = {Sort:1,ColMove:0,ColResize:1,HeaderCheck:1};
		
		initdata.Cols = [];
		
		initdata.Cols.push({
			Header : "", 
			Width : 30,
			Type : "CheckBox", 
			Edit : 1, 
			SaveName : "Ichek", 
			Align : "Center"});
		
		for(var i=0; i<oController.vColumns.length; i++) {
			var oneCol = {};
			if(oController.vColumns[i].control ==  "Hidden") {
				oneCol.Hidden = true;
			}else if(oHrdoc.getSelectedKey() == "20" || oHrdoc.getSelectedKey() == "70"){
				
			}else{
				if(oController.vColumns[i].show == "") 
					oneCol.Hidden = true;
			}
			oneCol.Header = oController.vColumns[i].label;
			oneCol.Type = oController.vColumns[i].control;
			oneCol.Edit = 0;
			oneCol.SaveName = oController.vColumns[i].id;
			oneCol.Align = "Center";			
			initdata.Cols.push(oneCol);
		}
		
		IBS_InitSheet(HRDocTargetDataSheet, initdata);
		HRDocTargetDataSheet.FitColWidth();
		HRDocTargetDataSheet.SetSelectionMode(0);
		
		HRDocTargetDataSheet.SetCellFont("FontSize", 0, "Ichek", HRDocTargetDataSheet.HeaderRows(),  "Entda", 13);
		HRDocTargetDataSheet.SetCellFont("FontName", 0, "Ichek", HRDocTargetDataSheet.HeaderRows(),  "Entda", "Malgun Gothic");
		HRDocTargetDataSheet.SetHeaderRowHeight(32);
		HRDocTargetDataSheet.SetDataRowHeight(32);
		
		HRDocTargetDataSheet.SetFocusAfterProcess(0);
		
		var oAdd_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Add_Btn");
		if(oHrdoc.getSelectedKey() == "20" || oHrdoc.getSelectedKey() == "70"){
			oAdd_Btn.setVisible(false);
		}else{
			if(oController._vDocst != "00")
				oAdd_Btn.setVisible(true);
		}
		
		
	},
	
	
	onBeforeOpenMSDialog2 : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		var oDialog = sap.ui.getCore().byId(oController.PAGEID + "_MSD_Dialog");
		var oHrdoc = sap.ui.getCore().byId(oController.PAGEID + "_Hrdoc");
		var oHrdocItem = oHrdoc.getSelectedItem();
		var vHrdoctx = oHrdocItem.getText();
		
		//common.Common.log(oHrdoc.getSelectedKey());	
		//common.Common.log(oHrdocItem);
		//common.Common.log(vHrdoctx);
		
		if(oHrdoc.getSelectedKey() == '10' || oHrdoc.getSelectedKey() == '20' || oHrdoc.getSelectedKey() == '70'){
			oDialog.setContentWidth("1200px");
		}
		else{
			oDialog.setContentWidth("600px");
		}
	},
	
	/**
	 * HR서류 대상자의 메일발송 Dialog에서 사용되는 IBSheet의 Control를 초기화하고
	 * Column 내용을 설정한다.
	 * 또한, 대상자들의 상세정보 리스트를 IBSheet에 데이터를 할당한다.
	 * @param oEvent
	 */
	onAfterOpenMSDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_HRDOC_SRV");
		
		var oHrdoc = sap.ui.getCore().byId(oController.PAGEID + "_Hrdoc");
		
		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		$("#" + oController.PAGEID + "_MSD_MailSendList").css("height", "width");
		
		if(typeof HRDocMailSendSheet == "undefined") {
			var vLang = "";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") == -1) vLang = "en";
			createIBSheet2(document.getElementById(oController.PAGEID + "_MSD_MailSendList"), "HRDocMailSendSheet", "100%",  "480px", vLang);
		}else{	
			$("#" + oController.PAGEID + "_MSD_MailSendList").css("height", "500px");
		}	
		
		HRDocMailSendSheet.Reset();
		HRDocMailSendSheet.SetTheme("DS","GhrisMain");
		
		var initdata = {};
		
		initdata.HeaderMode = {Sort:1,ColMove:0,ColResize:1,HeaderCheck:0};
		
		initdata.Cols = [];
		
		for(var i=0; i<oController.vMailColumns.length; i++) {
			var oneCol = {};
			oneCol.Header = oController.vMailColumns[i].label;
			oneCol.Type = "Text";
			oneCol.Edit = 0;
			oneCol.SaveName = oController.vMailColumns[i].id;
			oneCol.Align = "Left";		
			if(oController.vMailColumns[i].id ==  "Ename") {
				oneCol.Cursor = "Pointer";
				oneCol.HoverUnderline = true;
				oneCol.FontColor = "blue";
			}
			if(oController.vMailColumns[i].control ==  "Hidden") {
				oneCol.Hidden = true;
			}
			initdata.Cols.push(oneCol);
		}
		
		var filterString = "";
		filterString += "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		filterString += "%20and%20Hrdoc%20eq%20%27" + oHrdoc.getSelectedKey() + "%27";
		
		var addColumns = [];
		
		oModel.read("/HrDocumentsFieldsSet" + filterString, 
				null, 
				null, 
				false,
				function(oData, oResponse) {
					if(oData && oData.results) {							
						for(var i=0; i<oData.results.length; i++) {
							addColumns.push(oData.results[i]);
						}	
					}
				},
				function(oResponse) {
					
				}
		);
		
		if(addColumns && addColumns.length) {
			for(var i=0; i<addColumns.length; i++) {
				var Fieldname = addColumns[i].Field;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				
				var oneCol = {};
				oneCol.Header = addColumns[i].Fieldtx;
				oneCol.Type = "Text";
				oneCol.Edit = 0;
				Width : 100,
				oneCol.SaveName = Fieldname;
				
				if(addColumns[i].Datatype == "CURR" || addColumns[i].Datatype == "DEC") {
					oneCol.Align = "Right";
				} else if(addColumns[i].Datatype == "DATS") {
					oneCol.Align = "Center";
				} else {
					oneCol.Align = "Left";
				}  
							
				initdata.Cols.push(oneCol);
			}
		}
		
		IBS_InitSheet(HRDocMailSendSheet, initdata);
		HRDocMailSendSheet.SetSelectionMode(0);
		
		HRDocMailSendSheet.SetCellFont("FontSize", 0, 0, HRDocMailSendSheet.HeaderRows(), HRDocMailSendSheet.LastCol(), 13);
		HRDocMailSendSheet.SetCellFont("FontName", 0, 0, HRDocMailSendSheet.HeaderRows(), HRDocMailSendSheet.LastCol(), "Malgun Gothic");
		
		HRDocMailSendSheet.SetHeaderRowHeight(32);
		HRDocMailSendSheet.SetDataRowHeight(32);
		
		HRDocMailSendSheet.SetFocusAfterProcess(0);
		
		filterString = "";
		filterString += "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		filterString += "%20and%20Hrdno%20eq%20%27" + oController._vHrdno + "%27";
		filterString += "%20and%20Actty%20eq%20%27" + "C" + "%27";
		
		var vGridData = {data : []};
		
		oModel.read("/HrDocumentsDetailsSet" + filterString, 
			null, 
			null, 
			true,
			function(oData, oResponse) {
				if(oData && oData.results) {							
					for(var i=0; i<oData.results.length; i++) {
						var oneData = oData.results[i];
						
						for(var j=0; j<addColumns.length; j++) {
							var Fieldname = addColumns[j].Field;
							Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
							var val = eval("oneData." + Fieldname + ";");
							if(addColumns[j].Datatype == "DATS") {
								if(val != null) {
									eval("oneData." + Fieldname + " = dateFormat1.format(new Date(common.Common.setTime(new Date(val))));");
								}
							}
						}
						
						oneData.Numbr = (i+1);
						
						oController._vMailSendData.push(oneData);
						
						vGridData.data.push(oneData);
					}
					
					HRDocMailSendSheet.LoadSearchData(vGridData);
//					HRDocMailSendSheet.FitSize(1,1);
				}
			},
			function(oResponse) {
				
			}
		);
	},
	
	/**
	 * HR서류 메일발송 Dialog가 Open 하기전에 수행한다.
	 * 데이터 및 IBSheet 최기화 한다.
	 * @param oEvent
	 */
	onBeforeOpenMSDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		
		oController._vMailSendData = [];
		
		if(typeof HRDocMailSendSheet == "object") {
			HRDocMailSendSheet.Reset();
		}
		
	},
	
	/**
	 * HR서류 대상자에게 메일을 발송한다.
	 * 메일주소의 정합성을 검증한다.
	 * @param oEvent
	 */
	onPressSend : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_HRDOC_SRV");
		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var oHrdoc = sap.ui.getCore().byId(oController.PAGEID + "_Hrdoc");
		var oSmbda = sap.ui.getCore().byId(oController.PAGEID + "_Smbda");
		var oSmeda = sap.ui.getCore().byId(oController.PAGEID + "_Smeda");
		
		var oHrdocItem = oHrdoc.getSelectedItem();
		var vHrdoctx = oHrdocItem.getText();
		
		var vPeriod = dateFormat1.format(new Date(common.Common.setTime(new Date(oSmbda.getValue())))) + " ~ " + dateFormat1.format(new Date(common.Common.setTime(new Date(oSmeda.getValue()))));
		
		//이메일 주소여부 검증
		if(oController._vMailSendData && oController._vMailSendData.length) {
			for(var i=0; i<oController._vMailSendData.length; i++) {
				if(oController._vMailSendData[i].Email == "") {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_EMAIL"));
					return;
				}
			}
		}
		
		var sendProcess = function() {
			
			var process_result = true;
			
			if(oController._vMailSendData && oController._vMailSendData.length) {
				for(var i=0; i<oController._vMailSendData.length; i++) {
					var updateData = {};
					
					updateData.Persa = oController._vPersa;
					updateData.Hrdno = oController._vHrdno;
					updateData.Pernr = oController._vMailSendData[i].Pernr;
					updateData.First = "";
					if(i == 0) updateData.First = "X";
					updateData.Actty = "M";
					updateData.Mailc = oController.makeEmailHtml(oController, oController._vMailSendData[i].Ename,
							oController._vMailSendData[i].Fulln, vHrdoctx, vPeriod);
					
					var oPath = "/HrDocumentsDetailsSet(Hrdno='" + oController._vHrdno + "',Pernr='" + oController._vMailSendData[i].Pernr + "')";
					
					oModel.update(
							oPath, 
							updateData, 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess HrDocumentsDetailsSet Update !!!");
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
					
					if(!process_result) {
						if(oController.BusyDialog.isOpen()) {
							oController.BusyDialog.close();
						}
						return;
					}
				}
			}
			
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			sap.m.MessageBox.alert(oBundleText.getText("MSG_HRDOC_SEND_COMPLETE"), {
				title : oBundleText.getText("MSG_TITLE_GUIDE"),
				onClose : function() {
					oController.onMSDClose();
					oController.navToBack();
				}
			});
		};
		
		var onProcessing = function(oAction){
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
				setTimeout(sendProcess, 300);
        	}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("MSG_MAILSEND_QUESTION"), {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("TITLE_HRDOC_MAILSEND"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: onProcessing
		});
	},
	
	/**
	 * HR서류 메일발송 Dialog를 Close한다.
	 * @param oEvent
	 */
	onMSDClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		
		if(oController._MailSendDialog.isOpen()) {
			oController._MailSendDialog.close();
		}
	},
	
	/**
	 * HR서류 메일발송 대상자 데이터를 Excel로 다운로드 한다.
	 * @param oEvent
	 */
	downloadExcel : function(oEvent) {
		var params = { FileName : "HRDocMailSend.xls",  SheetName : "Sheet", Merge : 1} ;
		if(typeof HRDocMailSendSheet == "object") {
			HRDocMailSendSheet.Down2Excel(params);
		}
	},
	
	/**
	 * HR서류 메일 내용을 만든다.
	 * @param oController
	 * @param Ename
	 * @param Fulln
	 * @param Hrdoc
	 * @param Period
	 * @returns
	 */
	makeEmailHtml : function(oController, Ename, Fulln, Hrdoc, Period) {
		
		var tHtml = oController._vMailHtml;
		
		if(tHtml == "") {
			return "";
		}
		
		
		//http://hr.doosan.com/irj/portal?NavigationTarget=ROLES%3A%2F%2Fportal_content%2Fcom.sap.pct%2Fevery_user%2Fcom.sap.pct.erp.common.bp_folder%2Fcom.sap.pct.erp.common.roles%2Fcom.sap.pct.erp.common.erp_common%2Fcom.sap.pct.erp.common.lpd_start_url&RequestMethod=GET&System=SAP_ECC_HUMANRESOURCES&URLTemplate=%3CSystem.wap.WAS.protocol%3E%3A%2F%2F%3CSystem.wap.WAS.hostname%3E%3CSystem.wap.WAS.path%3E%2Fsap%2Fbc%2Fui5_ui5%2Fsap%2Fzhrxx_essapp%2FHrDoc.html%3Fsap-client%3D%3CSystem.client%3E%26sap-language%3DKO&PrevNavTarget=navurl%3A%2F%2F44953a14e5731dff0a3dab218413ea1e&NavMode=3&CurrentWindowId=WID1453176484538
		
		tHtml = tHtml.replace("[HRDOC_NOTE1]", oBundleText.getText("MSG_HRDOC_NOTE1"));
		tHtml = tHtml.replace("[HRDOC_NOTE2]", oBundleText.getText("MSG_HRDOC_NOTE2"));
		
		//성명
		tHtml = tHtml.replace("[ITEM_LABEL1]", oBundleText.getText("ENAME_3"));
		tHtml = tHtml.replace("[ITEM_DATA1]", Ename);
		
		//성명
		tHtml = tHtml.replace("[ITEM_LABEL2]", oBundleText.getText("STEXT"));
		tHtml = tHtml.replace("[ITEM_DATA2]", Fulln);
		
		//성명
		tHtml = tHtml.replace("[ITEM_LABEL3]", oBundleText.getText("HRDOC"));
		tHtml = tHtml.replace("[ITEM_DATA3]", Hrdoc);
		
		//성명
		tHtml = tHtml.replace("[ITEM_LABEL4]", oBundleText.getText("SMBPERIOD"));
		tHtml = tHtml.replace("[ITEM_DATA4]", Period);
		
		//성명
//		tHtml = tHtml.replace("[GOTO_BUTTON]", oBundleText.getText("GOTO_BTN"));
		
		var vHostName = top.location.host;
		var vLocale = sap.ui.getCore().getConfiguration().getLanguage().toUpperCase();
		if(vLocale.indexOf("ZH") != -1 || vLocale.indexOf("CN") != -1) {
			var vGotoUrl = "http://" + vHostName + "/irj/portal?NavigationTarget=ROLES%3A%2F%2Fportal_content%2Fcom.sap.pct%2Fevery_user%2Fcom.sap.pct.erp.common.bp_folder%2Fcom.sap.pct.erp.common.roles%2Fcom.sap.pct.erp.common.erp_common%2Fcom.sap.pct.erp.common.lpd_start_url&RequestMethod=GET&System=SAP_ECC_HUMANRESOURCES&URLTemplate=%3CSystem.wap.WAS.protocol%3E%3A%2F%2F%3CSystem.wap.WAS.hostname%3E%3CSystem.wap.WAS.path%3E%2Fsap%2Fbc%2Fui5_ui5%2Fsap%2Fzhrxx_essapp%2FHrDoc.html%3Fsap-client%3D%3CSystem.client%3E%26sap-language%3DZH&PrevNavTarget=navurl%3A%2F%2F44953a14e5731dff0a3dab218413ea1e&NavMode=3&CurrentWindowId=WID1453176484538";
		}else{
			var vGotoUrl = "http://" + vHostName + "/irj/portal?NavigationTarget=ROLES%3A%2F%2Fportal_content%2Fcom.sap.pct%2Fevery_user%2Fcom.sap.pct.erp.common.bp_folder%2Fcom.sap.pct.erp.common.roles%2Fcom.sap.pct.erp.common.erp_common%2Fcom.sap.pct.erp.common.lpd_start_url&RequestMethod=GET&System=SAP_ECC_HUMANRESOURCES&URLTemplate=%3CSystem.wap.WAS.protocol%3E%3A%2F%2F%3CSystem.wap.WAS.hostname%3E%3CSystem.wap.WAS.path%3E%2Fsap%2Fbc%2Fui5_ui5%2Fsap%2Fzhrxx_essapp%2FHrDoc.html%3Fsap-client%3D%3CSystem.client%3E%26sap-language%3DKO&PrevNavTarget=navurl%3A%2F%2F44953a14e5731dff0a3dab218413ea1e&NavMode=3&CurrentWindowId=WID1453176484538";
		}
		var vLink = "<a href='" + vGotoUrl + "' target='_new'>" + oBundleText.getText("GOTO_BTN") + "</a>";
		tHtml = tHtml.replace("[GOTO_BUTTON]", vLink);
	
		return tHtml;
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

/**
 * HR서류 메일발송자 리스트(IBSheet)에 데이터 바인딩이 완료후에 수행한다.
 * IBSheet의 컬럼 Width를 자동 조정한다.
 * @param result
 */
function HRDocMailSendSheet_OnSearchEnd(result) {
	HRDocMailSendSheet.FitColWidth();	
}

/**
 * HR서류 대상자 리스트(IBSheet)에 데이터 바인딩이 완료후에 수행한다.
 * IBSheet의 컬럼 Width를 자동 조정한다.
 * @param result
 */
function HRDocTargetDataSheet_OnSearchEnd(result) {
	HRDocTargetDataSheet.FitColWidth();	
}

/**
 * HR서류 메일발송 대상자 리스트(IBSheet)에 데이터 바인딩이 완료후에 수행한다.
 * IBSheet의 컬럼 Width를 자동 조정한다.
 * @param result
 */
function HRDocMailSendSheet_OnSearchEnd(result) {
	HRDocMailSendSheet.FitSize(0, 1);
}

/**
 * HR서류 메일발송 대상자 리스트(IBSheet)에서 대상자 이름을 클릭하면 해당 HR서류의 RD URL를 Open하는 "RDJump.html"를 호출한다.
 * @param Row
 * @param Col
 * @param Value
 * @param CellX
 * @param CellY
 * @param CellW
 * @param CellH
 */
function HRDocMailSendSheet_OnClick(Row, Col, Value, CellX, CellY, CellW, CellH) {
	
	if(Row > 0 && Col == 1) {
		var Hrdno = HRDocMailSendSheet.GetCellValue(Row, "Hrdno");
		var Persa = HRDocMailSendSheet.GetCellValue(Row, "Persa");
		var Pernr = HRDocMailSendSheet.GetCellValue(Row, "Pernr");
		var Frmcd = HRDocMailSendSheet.GetCellValue(Row, "Frmcd");
		var vLocale = sap.ui.getCore().getConfiguration().getLanguage().toUpperCase();
		
		if(Hrdno != "" && Frmcd != "") {			
			if(vLocale.indexOf("ZH") != -1 || vLocale.indexOf("CN") != -1) {
				vLocale = "zh";
			}else{
				vLocale = 'kr';
			}
			
			var keySize = 256;
			var iterationCount = 1000;
			var iv = 'F27D5C9927726BCEFE7510B1BDD3D137';
			var salt = '3FF342';
			var passPhrase = 'passPhrase';
			var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
			var oController = oView.getController();
			
			var aesUtil = new AesUtil(keySize, iterationCount);
			var encrypt = aesUtil.encrypt(salt, iv, passPhrase, Pernr);
									
			var html_url ="http://" + location.host + "/sap/bc/ui5_ui5/sap/zhrxx_common/RDJump.html?";
			var html_url2 ="http://" + location.host + "/sap/bc/ui5_ui5/sap/zhrxx_common/RDJump2.html";
			html_url += "i_rdurl=" + Frmcd + "&i_hrdno=" + Hrdno + "&i_persa=" + Persa + "&i_pernr=" + Pernr + "&i_lang=" + vLocale + "&i_mode=0";
			html_url += "&i_type=DOCUMENT";
			
			var vReturnUrl = "http://" + location.host + "/sap/bc/ui5_ui5/sap/zhrxx_hassapp/ReturnDoc.html";
			html_url += "&i_callbackurl=" + vReturnUrl;
			window.open('','targettemp');
			$( document ).ready( function() { 
			document.write("<form name='RDFORM' id='RDFORM' method='POST' action='" + Frmcd + "' target='targettemp' reload='false'>");
			document.write("<input type=hidden name='i_rdurl' value='" + Frmcd + "'>");
			document.write("<input type=hidden name='i_hrdno' value='" + Hrdno + "'>");
			document.write("<input type=hidden name='i_pernr' value='" + encrypt + "'>");
			document.write("<input type=hidden name='i_callbackurl' value='" + vReturnUrl + "'>");
			document.write("</form>");
			$("#RDFORM").submit();
			self.location.reload(false);
//				parent.location.reload(false);
			});
		
		
//			window.open(encodeURI(html_url));
//			
//
//			
//			
//			window.open('','targettemp');
//			$( document ).ready( function() { 
//			$(document.body).append("<form name='RDFORM' id='RDFORM' method='POST' action='" + Frmcd + "'  target='_self'>");
//			$(document.body).append("<input type=hidden name='i_hrdno' value='" + Hrdno + "'>");
//			$(document.body).append("<input type=hidden name='i_pernr' value='" + encrypt + "'>");
//			$(document.body).append("<input type=hidden name='i_callbackurl' value='" + vReturnUrl + "'>");
//			$(document.body).append("</form>");
//			$("#RDFORM").submit();
//			});
			
//			var myWindow = window.open("", "MsgWindow", "width=200, height=100");
//			myWindow.document.write("<p>This is 'MsgWindow'. I am 200px wide and 100px tall!</p>");
			
//			window.open('','targettemp');
//			var form = $("<form name='RDFORM' id='RDFORM' method='POST' action='" + Frmcd + "'  target='_self'>", 
//	                 { action: Frmcd,
//	                   target: 'targettemp',
//	                   method: 'POST'}
//	            );
//	
//			form.append( 
//			     $("<input/>", 
//			          { type:'hidden', 
//			    	    name: 'i_rdurl',
//			            value:Frmcd, }
//			       )
//			);
//		
//			form.append( 
//				     $("<input/>", 
//				          { type: 'hidden', 
//				    	    name: 'i_hrdno',
//				    	  //  id: 'i_hrdno2',
//				            value: Hrdno, }
//				       )
//				);
//			
//			form.append( 
//				     $("<input/>", 
//				          { type: 'hidden', 
//				    	    name: 'i_pernr',
//				    	 //   id: 'i_pernr2',
//				            value: encrypt, }
//				       )
//				);
//			
//			form.append( 
//				     $("<input/>", 
//				          { type: 'hidden', 
//				    	    name: 'i_callbackurl',
//				    	 //   id: 'i_callbackurl2',
//				            value: vReturnUrl, }
//				       )
//				);
//			
//		
//			$("#RDFORM").append(form);
//			
//			$("#RDFORM").submit();
//			
//			window.open('','targettemp');
//			var data = new FormData();
//			data.append('action', Frmcd);
//			data.append('i_rdurl', Frmcd);
//			data.append('i_hrdno', Hrdno);
//			data.append('i_pernr', encrypt);
//			data.append('i_callbackurl', vReturnUrl);

//			var xhr = new XMLHttpRequest();
////			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//			xhr.setRequestHeader('target','_self');
//			xhr.open('POST', Frmcd, true);
//			xhr.onload = function () {
//			    // do something to response
//			    console.log(this.responseText);
//			};
//			xhr.send(data);
			
			
//		  $.post( "http://" + location.host + "/sap/bc/ui5_ui5/sap/zhrxx_common/RDJump2.html?",
//				    {
//			  action: Frmcd,
//			  i_rdurl: Frmcd,
//			  i_hrdno : Hrdno,
//			  i_pernr : encrypt,
//			  i_callbackurl : vReturnUrl,
//				    },
//				    function(data, status){
////				        alert("Data: " + data + "\nStatus: " + status);
//				    });
//		  
//		  
//		  
//		  var form = document.createElement("form");
////		  form.setAttribute("action", "http://" + location.host + "/sap/bc/ui5_ui5/sap/zhrxx_common/RDJump2.html?");
//		  form.setAttribute("action", Frmcd);
//		  form.setAttribute("method", "post");
//
//		  var hiddenField = document.createElement("input");
//		  hiddenField.setAttribute("type", "hidden");
//		  hiddenField.setAttribute("name", "vUrl");
//		  hiddenField.setAttribute("value", Frmcd);
//		  form.appendChild(hiddenField);
//		  form.setAttribute("target", "_blank");
//		  document.body.appendChild(form);    // Not entirely sure if this is necessary           
//		  form.submit();
		  
			
//			window.open('','targettemp');
//			$.ajax({
//	            type:"POST",
//	            beforeSend: function (request)
//	            {
//	                request.setRequestHeader("target", "targettemp");
//	            },
//	            url: "http://" + location.host + "/sap/bc/ui5_ui5/sap/zhrxx_common/RDJump.html?",
//	            data:  {
//	  			  action: Frmcd,
//	  			  i_rdurl: Frmcd,
//	  			  i_hrdno : Hrdno,
//	  			  i_pernr : encrypt,
//	  			  i_callbackurl : vReturnUrl
//	            },
//	            processData: false,
////	            success: function(msg) {
////	                $("#results").append("The result =" + StringifyPretty(msg));
////	            }
//			});
		}
	}
}

function HRDocTargetDataSheet_OnLoadExcel(result) {
	if(result) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actdoc.HRDocDetail");
		var oController = oView.getController();
		var vReulst = oController.checkData();
		if(vReulst == true) oController.validData();
		else oController.refreshData(oController);
	}
}