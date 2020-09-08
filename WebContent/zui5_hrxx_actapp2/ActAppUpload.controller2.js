jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("zui5_hrxx_actapp2.common.Common");

sap.ui.controller("zui5_hrxx_actapp2.ActAppUpload", {
	
	PAGEID : "ActAppUpload",
	
	ContentHeight : 0,
	OtherHeight : 90,

	_vActionType : "",
	_vStatu : "",
	_vPersa : "",
	_vDocno : "",
	_vDocty : "",
	_vReqno : "",
	_vActda : "",
	_vPernr : "",
	_oContext : null,
	
	_vFromPageId : "",
	 
	_vActiveControl : [],
	
	_vVilidData : [],
	
	_BasicControl : [{label : "No.", id : "Recno", Align : "Center", Width : 40, control : "Text", required : false},
	                 {label : oBundleText.getText("ASTAT"), id : "Cfmyn", Align : "Center", Width : 40, control : "Img", required : false},
	                 {label : oBundleText.getText("PERNR"), id : "Pernr", Align : "Left", Width : 100, control : "Text", required : true},
	                 {label : oBundleText.getText("ENAME"), id : "Ename", Align : "Left", Width : 100, control : "Text", required : false},
	                 {label : oBundleText.getText("ORGEH2"), id : "Per_orgeh_Tx", Align : "Left", Width : 150, control : "Text", required : false},
	                 {label : oBundleText.getText("ZZCALTL"), id : "Per_zzcaltl_Tx", Align : "Left", Width : 100, control : "Text", required : false},
	                 {label : oBundleText.getText("ACTDA"), id : "Actda", Align : "Left", Width : 80, control : "Date", required : true}],
	
	BusyDialog : null,

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actapp2.ActAppUpload
*/
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
	    };
	    
        this.getView().addEventDelegate({
			onBeforeShow  : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow  : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this),
			
		});
        
        sap.ui.getCore().getEventBus().subscribe("app", "ResizeWindow", this.onResizeWindow, this);
	},
	
	onResizeWindow : function(oEvent, oEventId, Data) {
		var oIssuedTypeMatrix2 = sap.ui.getCore().byId(this.PAGEID + "_IssuedTypeMatrix2");		
		var vH1 = 400;
		if(oIssuedTypeMatrix2.getVisible()) vH1 = 485;
		else vH1 = 345;
		
		$("#" + this.PAGEID + "_oIBSheetLayout").css("height", window.innerHeight - vH1);
		$("#" + this.PAGEID + "_IBSHEET1").css("height", (window.innerHeight - vH1));
	},
	
	onBeforeShow : function(oEvent) {
		if(oEvent) {
			this._vActionType = oEvent.data.actiontype;
			this._vStatu = oEvent.data.Statu;
			this._vReqno = oEvent.data.Reqno;
			this._vDocno = oEvent.data.Docno;
			this._vDocty = oEvent.data.Docty;
			this._vPersa = oEvent.data.Persa;
			this._vActda = oEvent.data.Actda;
			this._oContext = oEvent.data.context;
			this._vFromPageId = oEvent.data.FromPageId;
		}
		
		if(typeof UploadDataSheet == "object") {
			UploadDataSheet.Reset();
		}
		
		var oSaveBtn = sap.ui.getCore().byId(this.PAGEID + "_SAVE_BTN");
		oSaveBtn.setVisible(false);
		
		var oDownloadBtn = sap.ui.getCore().byId(this.PAGEID + "_EXCEL_DOWNLOAD_BTN");
		oDownloadBtn.setVisible(false);
		
		var oUploadBtn = sap.ui.getCore().byId(this.PAGEID + "_EXCEL_UPLOAD_BTN");
		oUploadBtn.setVisible(false);
		
		var oInputSwith = sap.ui.getCore().byId(this.PAGEID + "_Input_Switch");
		oInputSwith.setState(false);
		oInputSwith.setEnabled(false);
		
		var oUploadNoticeBar1 = sap.ui.getCore().byId(this.PAGEID + "_UploadNoticeBar1");
		oUploadNoticeBar1.setVisible(false);
		
		this.loadActionTypeList();
	},
	
	onAfterShow : function(oEvent) {
		var oIssuedTypeMatrix2 = sap.ui.getCore().byId(this.PAGEID + "_IssuedTypeMatrix2");		
		var vH1 = 400;
		if(oIssuedTypeMatrix2.getVisible()) vH1 = 485;
		else vH1 = 345;
		
		$("#" + this.PAGEID + "_oIBSheetLayout").css("height", window.innerHeight - vH1);
		
		if(typeof UploadDataSheet == "undefined") {
			var vLang = "";
//			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") != -1) vLang = "";
//			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() != null && 
//					sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() != ""){
//				vLang = sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().substring(0,2);
//			}
//			else vLang = "en";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "ko") vLang = "";
			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "cs") vLang = "cs";
			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "de") vLang = "de";
			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "fr") vLang = "fr";
			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "pl") vLang = "pl";
			else vLang = "en";
			createIBSheet2(document.getElementById(this.PAGEID + "_IBSHEET1"), "UploadDataSheet", "100%",  (window.innerHeight - vH1) + "px", vLang);
		}		
	},
	
	loadActionTypeList : function() {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var filterString = "/?$filter=Persa%20eq%20%27" + this._vPersa + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + this._vActda + "T00%3a00%3a00%27";
		filterString += "%20and%20Docno%20eq%20%27" + this._vDocno + "%27";
		
		var oController = this;
			
		oModel.read("/ActionTypeListSet"  + filterString, 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						for(var i=0; i<5; i++) {
							var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
							var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
							if(oMassg) {
								oMassg.destroyItems();
							}
							if(oMassn) {
								oMassn.destroyItems();
								oMassn.addItem(
										new sap.ui.core.Item({
											key : "0000", 
											text : oBundleText.getText("SELECTDATA")
										})
								);
								for(var j=0; j<oData.results.length; j++) {
									//채용과 발령유형이 8로 시작하는 법인간 발령관련은 제외 
									if(oData.results[j].Massn == "10" || oData.results[j].Massn.substring(0,1) == "8") {									
										continue;
									} else if(oController._vDocty == "10" && oData.results[j].Massn == "11") { //문서유형이 일반이고 발령유형이 재입사이면 Skip
										continue;
									} else {
										oMassn.addItem(
												new sap.ui.core.Item({
													key : oData.results[j].Massn, 
													text : oData.results[j].Mntxt
												})
										);
									}
								}
								oMassn.setSelectedKey("0000");
							}
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		if(oController._vDocty == "20") {
			var oMassn1 = sap.ui.getCore().byId(oController.PAGEID + "_Massn1");
			var oMassg1 = sap.ui.getCore().byId(oController.PAGEID + "_Massg1");
			oMassn1.setSelectedKey("11");
			oMassn1.setEnabled(false);
			oMassg1.setEnabled(true);
			
			for(var i=1; i<5; i++) {
				var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
				var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
				oMassn.setEnabled(false);
				oMassg.setEnabled(false);
			}
			
			var filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
			filterString += "%20and%20Actda%20eq%20datetime%27" + oController._vActda + "T00%3a00%3a00%27";
			
			oModel.read("/ActionReasonListSet"  + filterString + "%20and%20Massn%20eq%20%27" + "11" + "%27", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData.results && oData.results.length) {
							oMassg1.addItem(
									new sap.ui.core.Item({
										key : "0000", 
										text : oBundleText.getText("SELECTDATA")
									})
							);
							for(var i=0; i<oData.results.length; i++) {
								oMassg1.addItem(
										new sap.ui.core.Item({
											key : oData.results[i].Massg, 
											text : oData.results[i].Mgtxt
										})
								);
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
			oMassg1.setSelectedKey("0000");
		} else {
			for(var i=0; i<5; i++) {
				var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
				var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
				oMassn.setEnabled(true);
				oMassg.setEnabled(false);
			}
		}
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_actapp2.ActAppUpload
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actapp2.ActAppUpload
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actapp2.ActAppUpload
*/
//	onExit: function() {
//
//	}
	
	navToBack : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppUpload");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : oController._vFromPageId,
		      data : {
		    	  context : oController._oContext,
		    	  Statu : oController._vStatu,
		    	  Reqno : oController._vReqno,
		    	  Docno : oController._vDocno,
		    	  Docty : oController._vDocty,
		      }
		});
		
	},
	
	onChangeMassn : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppUpload");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var vControlId = oEvent.getSource().getId();
		var vSelectedItem = oEvent.getParameter("selectedItem");
		var vSelectedKey = vSelectedItem.getKey();
		var vControl_Idx = vControlId.substring(vControlId.length-1);
		
		//발령유형이 채용, 겸직/겸무, 휴직, 퇴사의 경우 1개의 발령유형만 선택가능하다.  10, 11, 15, 60, 61, 90, 91 
		if(vSelectedKey != "0000") {
			if(vControl_Idx == "1") {
				if(vSelectedKey == "10" || vSelectedKey == "11" || vSelectedKey == "60" || vSelectedKey == "61" || vSelectedKey == "90" || vSelectedKey == "91") {
					for(var i=2; i<=5; i++) {
						var oMassn1 = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + i);
						var oMassg1 = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + i);
						oMassn1.setEnabled(false);
						oMassg1.setEnabled(false);
					}
				} else {
					for(var i=2; i<=5; i++) {
						var oMassn1 = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + i);
						var oMassg1 = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + i);
						oMassn1.setEnabled(true);
						oMassg1.setEnabled(true);
					}
				}
			} else {
				if(vSelectedKey == "10" || vSelectedKey == "11" || vSelectedKey == "60" || vSelectedKey == "61" || vSelectedKey == "90" || vSelectedKey == "91") {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_NO_SELECT1"));
					for(var i=1; i<=5; i++) {
						var oMassn1 = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + i);
						var oMassg1 = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + i);
						oMassn1.setEnabled(true);
						oMassn1.setSelectedKey("0000");
						oMassg1.setEnabled(true);
						oMassg1.removeAllItems();
					}
					return;
				}
			}
		}
		
		var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + vControl_Idx);
		
		if(vSelectedKey == "0000") {
			oMassg.setEnabled(false);
			oMassg.removeAllItems();
		} else {
			oMassg.removeAllItems();
			oMassg.setEnabled(true);
			
			var filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
			filterString += "%20and%20Actda%20eq%20datetime%27" + oController._vActda + "T00%3a00%3a00%27";
			
			oModel.read("/ActionReasonListSet"  + filterString + "%20and%20Massn%20eq%20%27" + vSelectedKey + "%27", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData.results && oData.results.length) {
							oMassg.addItem(
									new sap.ui.core.Item({
										key : "0000", 
										text : oBundleText.getText("SELECTDATA")
									})
							);
							for(var i=0; i<oData.results.length; i++) {
								oMassg.addItem(
										new sap.ui.core.Item({
											key : oData.results[i].Massg, 
											text : oData.results[i].Mgtxt
										})
								);
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
		}
		
		var oInputSwith = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
		oInputSwith.setState(false);
		
		oController.initInputControl(oController);
	},
	
	onChangeMassg : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppUpload");
		var oController = oView.getController();
		
		var oInputSwith = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
		oInputSwith.setState(false);
		oInputSwith.setEnabled(true);
		
		oController.initInputControl(oController);
	},
	
	onChangeSwitch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppUpload");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var oDownloadBtn = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_DOWNLOAD_BTN");
		var oUploadBtn = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_UPLOAD_BTN");
		
		var oUploadNoticeBar1 = sap.ui.getCore().byId(oController.PAGEID + "_UploadNoticeBar1");
		
		if(oEvent.getParameter("state") == false) {
			oController.initInputControl(oController);			
			return;
		}
		 
		var isValid = true;
		var vSelectMassnCnt = 0;
		
		oController.initInputControl(oController);
		
		var fReent = false;
		
		for(var i=0; i<5; i++) {
			var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
			var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
			
			if(oMassn && oMassg) {
				if(oMassn.getSelectedKey() != "0000" && oMassn.getSelectedKey() != "") {
					vSelectMassnCnt++;
					if(oMassg.getSelectedKey() == "0000" || oMassg.getSelectedKey() == "") {
						isValid = false;
						break;
					} else {
						//재입사 여부 확인
						if(oMassn.getSelectedKey() == "11" ) {
							fReent = true;
						}
						var filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
						filterString += "%20and%20Actda%20eq%20datetime%27" + oController._vActda + "T00%3a00%3a00%27";
						filterString += "%20and%20Massn%20eq%20%27" + oMassn.getSelectedKey() + "%27";
						filterString += "%20and%20Massg%20eq%20%27" + oMassg.getSelectedKey() + "%27";
						
						oModel.read("/ActionInputFieldSet"  + filterString, 
								null, 
								null, 
								false, 
								function(oData, oResponse) {					
									if(oData.results && oData.results.length) {
										for(var i=0; i<oData.results.length; i++) {
											var isExists = false;
											for(var j=0; j<oController._vActiveControl.length; j++) {
												if(oController._vActiveControl[j].Fieldname == oData.results[i].Fieldname) {
													if(oData.results[i].Incat.substring(0,1) == "M") {
														oController._vActiveControl[j].Incat = oData.results[i].Incat;
													}
													isExists = true;
													break;
												}
											}
											if(isExists == false) {
												oController._vActiveControl.push(oData.results[i]);
											}
										}
									}
								},
								function(oError) {
									var Err = {};
									if (oError.response) {
										Err = window.JSON.parse(oError.response.body);
										vErrMsg = Err.error.innererror.errordetails[0].message;
									} else {
										vErrMsg = oError;
									}
									common.Common.showErrorMessage(vErrMsg);
								}
						);
					}
				}
			}
		}
		
		if(vSelectMassnCnt < 1) {
			oEvent.getSource().setState(false);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_ACTTYPE"));
			return;
		}
		
		if(!isValid) {
			oEvent.getSource().setState(false);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_ACTREASON"));
			return;
		}
		
		oController.setInputFiled(oController, fReent);
		
		oUploadNoticeBar1.setVisible(true);
		
		oDownloadBtn.setVisible(true);
		oUploadBtn.setVisible(true);
	},

	setInputFiled : function(oController, fReent) {
		
		if(typeof UploadDataSheet == "undefined") {
			var vLang = "";
//			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") != -1) vLang = "";
//			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() != null && 
//					sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() != "") vLang = sap.ui.getCore().getConfiguration().getLanguage().toLowerCase();
//			else vLang = "en";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "ko") vLang = "";
			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "cs") vLang = "cs";
			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "de") vLang = "de";
			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "fr") vLang = "fr";
			else if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase() == "pl") vLang = "pl";
			else vLang = "en";
			createIBSheet2(document.getElementById(this.PAGEID + "_IBSHEET1"), "UploadDataSheet", "100%",  (window.innerHeight - 400) + "px", vLang);
		}
		
		UploadDataSheet.Reset();
		
		UploadDataSheet.SetTheme("DS","ActApp");
		
		var initdata = {};
		
		//initdata.Cfg = {SearchMode:smLazyLoad, SizeMode:0, CustomScroll:1, Page:20, SmartResize:1, MergeSheet:msHeaderOnly};  //MergeSheet:msHeaderOnly,

		//InitHeaders의 두번째 인자
		initdata.HeaderMode = {Sort:0,ColMove:0,ColResize:1,HeaderCheck:1};
		
		initdata.Cols = [];
		var vTotalWidth = 0;
		
		for(var i=0; i<oController._BasicControl.length; i++) {
			var oneCol = {};
			if(i < 2) {
				oneCol.Header = oController._BasicControl[i].label + "|" + oController._BasicControl[i].label;
			} else {
				if(oController._BasicControl[i].id == "Actda") {
					oneCol.Header = oBundleText.getText("ACT_PERSONS") + "|* " + oController._BasicControl[i].label;
					oneCol.Format = gDtfmt;
				} else if(oController._BasicControl[i].id == "Pernr" && oController._vDocty != "20") {
					oneCol.Header = oBundleText.getText("ACT_PERSONS") + "|* " + oController._BasicControl[i].label;
				} else {
					oneCol.Header = oBundleText.getText("ACT_PERSONS") + "|" + oController._BasicControl[i].label;
				}
			}			
			
			oneCol.Type = oController._BasicControl[i].control;
			oneCol.Edit = 0;
			oneCol.Width = oController._BasicControl[i].Width;
			oneCol.SaveName = oController._BasicControl[i].id;
			oneCol.Align = oController._BasicControl[i].Align;	
			
			if(oController._BasicControl[i].control == "Img") {
				oneCol.ImgHeight = 16;
				oneCol.ImgWidth = 16;
			}
			initdata.Cols.push(oneCol);
			vTotalWidth += oController._BasicControl[i].Width;
		}
		
		if(fReent == true) {
			vTotalWidth += 150;
			
			initdata.Cols.push({
				Header : oBundleText.getText("ACT_PERSONS") + "|* " + oBundleText.getText("ICNUM"), 
				Type : "Text", 
				Edit : 0, 
				SaveName : "Icnum", 
				Wrap : 1,
				Width : 150, 
				Align : "Left"});
		}
			
		var vCodeFields = [];
		if(oController._vActiveControl && oController._vActiveControl.length) {
			for(var i=0; i<oController._vActiveControl.length; i++) {
				var oneCol = {};
				
				var Fieldname = oController._vActiveControl[i].Fieldname;
				var Fieldtype = oController._vActiveControl[i].Incat;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				
				if(Fieldtype == "TB" || Fieldtype == "D1" || Fieldtype == "D0" || Fieldtype == "D2") continue;
					
				var vLabelText = "";
				if(oController._vActiveControl[i].Label && oController._vActiveControl[i].Label != "") vLabelText = oController._vActiveControl[i].Label;
				else vLabelText = oBundleText.getText(oBundleText.getText(oController._vActiveControl[i].Fieldname));
				
				//입력항목 라벨를 만든다.
				var vHeader = oBundleText.getText("ACTION_APP_DATA") + "|";
				if(Fieldtype.substring(0, 1) == "M") {
					vHeader += "* " + vLabelText;
				} else {
					vHeader += vLabelText;
				}
				
				oneCol.Header = vHeader;
				if(Fieldtype == "M4" || Fieldtype == "O4") {
					oneCol.Type = "Date";  
					oneCol.Format = gDtfmt;
				} else {
					oneCol.Type = "Text";
				}
				
				oneCol.Edit = 0;
				oneCol.Width = 100;
				
				if(Fieldname.toUpperCase().indexOf("ORGEH") != -1 || Fieldname.toUpperCase().indexOf("STELL") != -1 
						|| Fieldname.toUpperCase().indexOf("ZZEMPWP") != -1 || Fieldname.toUpperCase().indexOf("ZZLOJOB") != -1 
						|| Fieldname.toUpperCase().indexOf("KOSTL") != -1 || Fieldname.toUpperCase().indexOf("RET_PERSA") != -1) {
					oneCol.SaveName = Fieldname;
					vCodeFields.push(Fieldname);
				} else {
					oneCol.SaveName = TextFieldname;
				}
				
				oneCol.Align = "Left"; 
				
				vTotalWidth += 100;
				
				initdata.Cols.push(oneCol);					
			}	
		}
		initdata.Cols.push({
			Header : oBundleText.getText("MSG") + "|" + oBundleText.getText("MSG"), 
			Type : "Html", 
			Edit : 0, 
			SaveName : "Upbigo", 
			Wrap : 1,
			Width : 200, 
			Align : "Left"});
		
		vTotalWidth += 200;
		try {
			IBS_InitSheet(UploadDataSheet, initdata);
		} catch(ex) {
			console.log(ex);
		}
		
		if(vTotalWidth < window.innerWidth) {
			UploadDataSheet.FitColWidth();
		}			
		UploadDataSheet.SetSelectionMode(0);
		
		UploadDataSheet.SetCellFont("FontSize", 0, "Numbr", UploadDataSheet.HeaderRows(),  "Upbigo", 13);
		UploadDataSheet.SetCellFont("FontName", 0, "Numbr", UploadDataSheet.HeaderRows(),  "Upbigo", "Malgun Gothic");
		
		if(vCodeFields.length) {
			for(var i=0; i<vCodeFields.length; i++) {
				UploadDataSheet.SetCellFontColor(1, vCodeFields[i], "red");
				UploadDataSheet.SetCellBackColor(1, vCodeFields[i], "yellow");
			}
		}
		
		UploadDataSheet.SetMergeSheet(msHeaderOnly);
		
		UploadDataSheet.SetHeaderRowHeight(32);
		UploadDataSheet.SetDataRowHeight(32);

	},
	
	initInputControl : function(oController) {
		oController._vActiveControl = [];
		
		var oDownloadBtn = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_DOWNLOAD_BTN");
		var oUploadBtn = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_UPLOAD_BTN");
		
		var oUploadNoticeBar1 = sap.ui.getCore().byId(oController.PAGEID + "_UploadNoticeBar1");
		
		oUploadNoticeBar1.setVisible(false);
		
		oDownloadBtn.setVisible(false);
		oUploadBtn.setVisible(false);
		
		if(typeof UploadDataSheet == "object") {
			UploadDataSheet.Reset();
		}
	},

	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppUpload");
		var oController = oView.getController();
		
		if(typeof UploadDataSheet != "object") {
			return;
		}
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var vRowCount = UploadDataSheet.RowCount();
		var vHeaderCount = UploadDataSheet.HeaderRows();
		
		var saveProcess = function() {	
			for(var idx = 0; idx<oController._vVilidData.length; idx++) {
				var createData = oController._vVilidData[idx]; //UploadDataSheet.GetRowJson(idx + vHeaderCount); 
				
				createData.Actty = "UP";
				createData.Docty = oController._vDocty;
				createData.Reqno = oController._vReqno;
				createData.Batyp = "A";
				createData.Persa = oController._vPersa;
				
				var oPath = "/ActionSubjectListSet";
				
				var fReEntry = false;
				
				for(var i=0; i<5; i++) {
					var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
					var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
					
					if(oMassn.getSelectedKey() == "0000" || oMassn.getSelectedKey() == "") {
						eval("createData.Massn" + (i+1) + " = '';");
					} else {
						if(oMassn.getSelectedKey() == "11") fReEntry = true;
						eval("createData.Massn" + (i+1) + " = '" + oMassn.getSelectedKey() + "';");
					}
					
					if(oMassg.getSelectedKey() == "0000" || oMassg.getSelectedKey() == "") {
						eval("createData.Massg" + (i+1) + " = '';");
					} else {
						eval("createData.Massg" + (i+1) + " = '" + oMassg.getSelectedKey() + "';");
					}
				}
				
				if(fReEntry) {
					createData.Actty = "UC";
				}

				var fProcess_flag = false;
				oModel.create(
						oPath, 
						createData, 
						null,
					    function (oData, response) {
							if(oData) {
								fProcess_flag = true;
							}
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
							fProcess_flag = false;
					    }
			    );
				
				if(fProcess_flag == false) {
					if(oController.BusyDialog.isOpen()) {
						oController.BusyDialog.close();
					}
					return;
				}
			}
			
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
				title : oBundleText.getText("INFORMATION"),
				onClose : function(oEvent) {
					sap.ui.getCore().getEventBus().publish("nav", "to", {
					      id : oController._vFromPageId,
					      data : {
					    	  context : oController._oContext,
					    	  Statu : oController._vStatu,
					    	  Reqno : oController._vReqno,
					    	  Docno : oController._vDocno,
					    	  Docty : oController._vDocty,
					      }
					});
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
		
		setTimeout(saveProcess, 300);

	},
	
	onPressDownload : function(oEvent) {
		var params = { FileName : "ActionApp.xls",  SheetName : "Sheet", Merge : 1, SheetDesign : 1} ;
		if(typeof UploadDataSheet == "object") {
			UploadDataSheet.Down2Excel(params);
		}
	},
	
	onPressUpload : function(oEvent) {
		var params = { Mode : "HeaderMatch" } ;
		if(typeof UploadDataSheet == "object") {
			UploadDataSheet.LoadExcel(params);
		}
	},
	
	validData : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppUpload");
		var oController = oView.getController();
		
		if(typeof UploadDataSheet != "object") {
			return;
		}
		
		var icon1 = "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/OK.png";
		var icon2 = "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/No-entry.png";
		
		oController._vVilidData = [];
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var vRowCount = UploadDataSheet.RowCount();
		var vHeaderCount = UploadDataSheet.HeaderRows();
		
		UploadDataSheet.SetCellFont("FontSize", 0, "Numbr", (vRowCount + vHeaderCount), "Upbigo", 13);
		UploadDataSheet.SetCellFont("FontName", 0, "Numbr", (vRowCount + vHeaderCount), "Upbigo", "Malgun Gothic");
		
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVE_BTN");
		
		var idx = 0;
		var s_cnt = 0;
		var f_cnt = 0;
		
		var vilidProcess = function() {	
			if(idx >= vRowCount) {
				if(oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}
				
				if(f_cnt == 0) {					
					oSaveBtn.setVisible(true);
				} else {
					oSaveBtn.setVisible(false);
				}
				return;
			}	
			
			UploadDataSheet.SetCellValue(idx + vHeaderCount, "Upbigo", "The verification of the data. Please wait.", 0);
			UploadDataSheet.SetCellFontColor(idx + vHeaderCount, "Upbigo", "blue");
			
			var createData = UploadDataSheet.GetRowJson(idx + vHeaderCount); 
				
			createData.Docno = oController._vDocno;
			createData.Actty = "V";
			if(oController._vDocty == "20") {
				createData.Actty = "VC";
			}
			
			if(createData.Actda != null && createData.Actda != "") {
				var vDate = createData.Actda.substring(0,4) + "-" + createData.Actda.substring(4,6) + "-" + createData.Actda.substring(6,8);
				
				createData.Actda = "\/Date(" + common.Common.getTime(vDate) + ")\/";
			} else {
				createData.Actda = "";
			} 
				
			if(oController._vActiveControl && oController._vActiveControl.length) {
				for(var j=0; j<oController._vActiveControl.length; j++) {
					var Fieldname = oController._vActiveControl[j].Fieldname;
					var Fieldtype = oController._vActiveControl[j].Incat;
					Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
					
					if(Fieldtype == "TB" || Fieldtype == "D1") continue;
					
					//Date Type
					if(Fieldtype == "M4" || Fieldtype == "O4") {
						var dVal = eval("createData." + Fieldname + "_Tx;");
						if(dVal != null && dVal != "") {							
							var vDate = dVal.substring(0,4) + "-" + dVal.substring(4,6) + "-" + dVal.substring(6,8);
							
							var vDate1 = "\/Date(" + common.Common.getTime(vDate) + ")\/";
							eval("createData." + Fieldname + " = vDate1;");
						} else {
							eval("createData." + Fieldname + " =  null;");
						} 
					}
				}
			}
				
			var oPath = "/ActionSubjectListSet";
			
			for(var i=0; i<5; i++) {
				var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
				var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
				
				if(oMassn.getSelectedKey() == "0000" || oMassn.getSelectedKey() == "") {
					eval("createData.Massn" + (i+1) + " = '';");
				} else {
					eval("createData.Massn" + (i+1) + " = '" + oMassn.getSelectedKey() + "';");
				}
				
				if(oMassg.getSelectedKey() == "0000" || oMassg.getSelectedKey() == "") {
					eval("createData.Massg" + (i+1) + " = '';");
				} else {
					eval("createData.Massg" + (i+1) + " = '" + oMassg.getSelectedKey() + "';");
				}
			}

			oModel.create(
					oPath, 
					createData, 
					null,
				    function (oData, response) {
						if(oData) {
							if(oData.Upbigo != "") {
								UploadDataSheet.SetCellValue(idx + vHeaderCount, "Upbigo", oData.Upbigo, 0);
								UploadDataSheet.SetCellFontColor(idx + vHeaderCount, "Upbigo", "red");
								UploadDataSheet.SetCellValue(idx + vHeaderCount, "Cfmyn", icon2, 0);
								f_cnt++;
							} else {
								UploadDataSheet.SetCellValue(idx + vHeaderCount, "Upbigo", "Success", 0);
								UploadDataSheet.SetCellFontColor(idx + vHeaderCount, "Upbigo", "black");
								UploadDataSheet.SetCellValue(idx + vHeaderCount, "Cfmyn", icon1, 0);
								s_cnt++;
							}
							UploadDataSheet.SetCellValue(idx + vHeaderCount, "Ename", oData.Ename, 0);
							UploadDataSheet.SetCellValue(idx + vHeaderCount, "Per_orgeh_Tx", oData.Per_orgeh_Tx, 0);
							UploadDataSheet.SetCellValue(idx + vHeaderCount, "Per_zzcaltl_Tx", oData.Per_zzcaltl_Tx, 0);
							
							oController._vVilidData.push(oData);
						}
				    },
				    function (oError) {
				    	var Err = {};
				    	var vMsg = "";
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
								vMsg = Err.error.innererror.errordetails[0].message;
							} else {
								vMsg = Err.error.message.value;
							}
						} else {
							vMsg = oError.toString();
						}
						UploadDataSheet.SetCellValue(idx + vHeaderCount, "Upbigo", vMsg, 0);
						UploadDataSheet.SetCellFontColor(idx + vHeaderCount, "Upbigo", "red");
						UploadDataSheet.SetCellValue(idx + vHeaderCount, "Cfmyn", icon2, 0);
						f_cnt++;
				    }
		    );
			
			idx++;
			
			setTimeout(vilidProcess, 300);
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
		
		setTimeout(vilidProcess, 300);
	},
	
	onChangeReasonSwitch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppUpload");
		var oController = oView.getController();
		
		var oIssuedTypeMatrix2 = sap.ui.getCore().byId(oController.PAGEID + "_IssuedTypeMatrix2");
		
		var vH1 = 400;
		
		if(oEvent.getParameter("state") == false) {
			oIssuedTypeMatrix2.setVisible(false);
			vH1 = 345;
		} else {
			oIssuedTypeMatrix2.setVisible(true);
			vH1 = 485;
		}
		
		$("#" + oController.PAGEID + "_oIBSheetLayout").css("height", window.innerHeight - vH1);
		$("#" + oController.PAGEID + "_IBSHEET1").css("height", (window.innerHeight - vH1));
	},
});

function UploadDataSheet_OnLoadExcel(result) {
	if(result) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppUpload");
		var oController = oView.getController();
		oController.validData();
		
		UploadDataSheet.FitSize(1, 0);
	}
}

function UploadDataSheet_OnChange(Row, Col, Value) {
	console.log("UploadDataSheet_OnChange !!! " + Value);
}
