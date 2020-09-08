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
	_vTableUploadField : [] ,
	_vTableUploadRecruitField : [] ,
	_vHiringPersonalInfomationLayout : [],
	
	_BasicControl : [{label : "No.", id : "Recno", Align : "Center", Width : 80, control : "Text", required : false},
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
		var oListTable = sap.ui.getCore().byId(this.PAGEID + "_TABLE"); 
		oListTable.removeAllColumns();
		oListTable.destroyColumns();
		var oJModel = new sap.ui.model.json.JSONModel();
		var Datas = {Data:[]};
		oJModel.setData(Datas);
		oListTable.setModel(oJModel);
		
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
									if(oData.results[j].Massn.substring(0,1) == "8") {									
										continue;
									} else if (oData.results[j].Massn == "10" && oController._vDocty != "20"){
										continue;
									}else if(oController._vDocty == "10" && oData.results[j].Massn == "11") { //문서유형이 일반이고 발령유형이 재입사이면 Skip
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
//			oMassn1.setSelectedKey("11");
//			oMassn1.setEnabled(false);
			oMassn1.setEnabled(true);
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
		
		oDownloadBtn.setVisible(false);
		oUploadBtn.setVisible(true);
	},

	setInputFiled : function(oController, fReent) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
		oController._vTableUploadField = [];
		var oListTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE"); 
		oListTable.removeAllColumns();
		oListTable.destroyColumns();
		if(oController._vDocty == "20"){
			oController.setHireTable(oController,oListTable);
		}else{
			var multiHeaderLine = 5 ;
			if(fReent == true) {
				 multiHeaderLine = 6 ;
			}
			var oColumn =  new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
				resizable : false,
	        	vAlign : "Middle",
	        	multiLabels : [new sap.m.Label({text : "", textAlign : "Center"}),
	        	               new sap.m.Label({text : "No.", textAlign : "Center"})],
	            headerSpan : [2,1],
	            width : "40px",
	        	template: new sap.ui.commons.TextView({
					width:"100%",
					text : "{Recno}",  
					textAlign : "Center"
				}).addStyleClass("L2P13Font"),
			});
			oListTable.addColumn(oColumn);
			
			oColumn =  new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
				resizable : false,
	        	vAlign : "Middle",
	        	multiLabels :  [new sap.m.Label({text : "", textAlign : "Center"}),
	        	                new sap.m.Label({text : oBundleText.getText("ASTAT"), textAlign : "Center"})],
	            headerSpan : [2,1],
	            width : "60px",
	        	template: new sap.m.Image({
					width: "16px",
					height : "16px",
					src : { path : "Cfmyn" , formatter : function(fVal) {
						if (fVal == undefined || fVal == "") {
							return "";
						}else{
							return fVal;
						}
					}},   
				}),
			});
			oListTable.addColumn(oColumn);
			
			oColumn =  new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
				resizable : false,
	        	vAlign : "Middle",
	        	multiLabels : [new sap.m.Label({text : "발령대상자", textAlign : "Center"}),
	        	               new sap.m.Label({text : "* " + oBundleText.getText("PERNR"), textAlign : "Center"})],
	            headerSpan : [multiHeaderLine,1],
	            width : "100px",
	        	template: new sap.ui.commons.TextView({
					width:"100%",
					text : "{Pernr}",  
					textAlign : "Center"
				}).addStyleClass("L2P13Font"),
			});
			oListTable.addColumn(oColumn);
			oController._vTableUploadField.push("Pernr");
			
			oColumn =  new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
				resizable : false,
	        	vAlign : "Middle",
	        	multiLabels : [new sap.m.Label({text : "발령대상자", textAlign : "Center"}),
	        	               new sap.m.Label({text : oBundleText.getText("ENAME"), textAlign : "Center"})],
	            headerSpan : [multiHeaderLine,1],
	            width : "100px",
	        	template: new sap.ui.commons.TextView({
					width:"100%",
					text : "{Ename}",  
					textAlign : "Center"
				}).addStyleClass("L2P13Font"),
			});
			oListTable.addColumn(oColumn);
			
			oColumn =  new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
				resizable : false,
	        	vAlign : "Middle",
	        	multiLabels : [new sap.m.Label({text : "발령대상자", textAlign : "Center"}),
	        	               new sap.m.Label({text : oBundleText.getText("ORGEH2"), textAlign : "Center"})],
	            headerSpan : [multiHeaderLine,1],
	            width : "150px",
	        	template: new sap.ui.commons.TextView({
					width:"100%",
					text : "{Per_orgeh_Tx}",  
					textAlign : "Center"
				}).addStyleClass("L2P13Font"),
			});
			oListTable.addColumn(oColumn);
			
			oColumn =  new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
				resizable : false,
	        	vAlign : "Middle",
	        	multiLabels : [new sap.m.Label({text : "발령대상자", textAlign : "Center"}),
	        	               new sap.m.Label({text : oBundleText.getText("ZZCALTL"), textAlign : "Center"})],
	            headerSpan : [multiHeaderLine,1],
	            width : "100px",
	        	template: new sap.ui.commons.TextView({
					width:"100%",
					text : "{Per_zzcaltl_Tx}",  
					textAlign : "Center"
				}).addStyleClass("L2P13Font"),
			});
			oListTable.addColumn(oColumn);
			
			oColumn =  new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
				resizable : false,
	        	vAlign : "Middle",
	        	multiLabels : [new sap.m.Label({text : "발령대상자", textAlign : "Center"}),
	        	               new sap.m.Label({text : "* " +oBundleText.getText("ACTDA"), textAlign : "Center"})],
	            headerSpan : [multiHeaderLine,1],
	            width : "120px",
	        	template: new sap.ui.commons.TextView({
					width:"100%",
					text : { path : "Actda" , formatter : function(fVal) {
						if (fVal == undefined || fVal == "") {
							return "";
						}else{
							return dateFormat.format(fVal);
//							return fVal;
						}
					}},   
					textAlign : "Center"
				}).addStyleClass("L2P13Font"),
			});
			oListTable.addColumn(oColumn);
			oController._vTableUploadField.push("Actda");
			
			if(fReent == true) {
				oColumn =  new sap.ui.table.Column({
					hAlign : "Center",
					flexible : false,
					resizable : false,
		        	vAlign : "Middle",
		        	multiLabels : [new sap.m.Label({text : oBundleText.getText("ACT_PERSONS"), textAlign : "Center"}),
		        	               new sap.m.Label({text : "* " + oBundleText.getText("ICNUM"), textAlign : "Center"})],
		            headerSpan : [multiHeaderLine,1],
		            width : "150px",
		        	template: new sap.ui.commons.TextView({
						width:"100%",
						text : "{Icnum}",  
						textAlign : "Center"
					}).addStyleClass("L2P13Font"),
				});
				oListTable.addColumn(oColumn);
			}
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
				var vHeader = ""; // oBundleText.getText("ACTION_APP_DATA") + "|";
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
				
				if(Fieldname.toUpperCase().indexOf("ORGEH") != -1 || Fieldname.toUpperCase().indexOf("STELL") != -1 
						|| Fieldname.toUpperCase().indexOf("ZZEMPWP") != -1 || Fieldname.toUpperCase().indexOf("ZZLOJOB") != -1 
						|| Fieldname.toUpperCase().indexOf("KOSTL") != -1 || Fieldname.toUpperCase().indexOf("RET_PERSA") != -1) {
					oneCol.SaveName = Fieldname;
					oneCol.LabelCode = "X";
					oController._vTableUploadField.push(Fieldname);
//						vCodeFields.push(Fieldname);
				} else {
					oneCol.SaveName = TextFieldname;
					if(oController._vDocty == "20"){
						if(Fieldtype.substring(0, 1) == "M") {
							oController._vTableUploadField.push(Fieldname);
							oneCol.SaveName = Fieldname;
						}
					}
				}
				
				
				if(oneCol.LabelCode == "X"){
					oColumn =  new sap.ui.table.Column({
						hAlign : "Center",
						flexible : false,
						resizable : false,
			        	vAlign : "Middle",
			        	multiLabels : [new sap.m.Label({text : oBundleText.getText("ACTION_APP_DATA"), textAlign : "Center"}),
			        	               new sap.m.Label({text : vHeader, width : "100%" , textAlign : "Center"}).addStyleClass("L2PBackgroundYellow")],
			            headerSpan : [oController._vActiveControl.length,1],
			            width : "100px",
			        	template: new sap.ui.commons.TextView({
							width:"100%",
							text :  "{" + oneCol.SaveName + "}",  
							textAlign : "Center"
						}).addStyleClass("L2P13Font"),
					});
					oListTable.addColumn(oColumn);
				}else if(oneCol.Type == "Date"){
					oColumn =  new sap.ui.table.Column({
						hAlign : "Center",
						flexible : false,
						resizable : false,
			        	vAlign : "Middle",
			        	multiLabels : [new sap.m.Label({text : oBundleText.getText("ACTION_APP_DATA"), textAlign : "Center"}),
			        	               new sap.m.Label({text : vHeader, textAlign : "Center"})],
			            headerSpan : [oController._vActiveControl.length,1],
			            width : "100px",
			        	template: new sap.ui.commons.TextView({
							width:"100%",
							text : { path : "'" + oneCol.SaveName + "'" , formatter : function(fVal) {
								if (fVal == undefined || fVal == "") {
									return "";
								}else{
									return dateFormat.format(fVal);
								}
							}},   
							textAlign : "Center"
						}).addStyleClass("L2P13Font"),
					});
					oListTable.addColumn(oColumn);
				}else{
					oColumn =  new sap.ui.table.Column({
						hAlign : "Center",
						flexible : false,
						resizable : false,
			        	vAlign : "Middle",
			        	multiLabels : [new sap.m.Label({text : oBundleText.getText("ACTION_APP_DATA"), textAlign : "Center"}),
			        	               new sap.m.Label({text : vHeader, textAlign : "Center"})],
			            headerSpan : [oController._vActiveControl.length,1],
			            width : "100px",
			        	template: new sap.ui.commons.TextView({
							width:"100%",
							text :  "{" + oneCol.SaveName + "}",  
							textAlign : "Center"
						}).addStyleClass("L2P13Font"),
					});
					oListTable.addColumn(oColumn);
				}
			}	
		}
		oColumn =  new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
			resizable : false,
        	vAlign : "Middle",
        	multiLabels : [new sap.m.Label({text :"",  textAlign : "Center"}),
        	               new sap.m.Label({text :oBundleText.getText("MSG"),  textAlign : "Center"})],
            headerSpan : [1,1],
            template: new sap.ui.commons.TextView({
				width:"100%",
				text : "{Upbigo}",  
				textAlign : "Center"
			}).addStyleClass("L2P13Font"),
		});
		oListTable.addColumn(oColumn);
		
	},
	
	setHireTable : function(oController, Table ){
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		oController._vHiringPersonalInfomationLayout = [];
		oModel.read("/HiringPersonalInfomationLayoutSet?$filter=Docno eq'" + oController._vDocno + "' and "
				  + "Molga eq '" +  '41' + "' and "
				  + "Actda eq datetime'" + oController._vActda + "T00%3a00%3a00'",
			null,
			null,
			false, 	
			function(oData, oResponse) {	
				if(oData && oData.results) {
					var MultiHeaderLength = 0;
					for(var i=0; i<oData.results.length; i++) {
						if(oData.results[i].Incat == "M1" || oData.results[i].Incat == "M3" || oData.results[i].Incat == "M5"
							|| oData.results[i].Incat == "M8" || oData.results[i].Incat == "O4"){
							MultiHeaderLength++;
						}
					}
					for(var i=0; i<oData.results.length; i++) {
						if(oData.results[i].Incat == "M1" || oData.results[i].Incat == "M3" || oData.results[i].Incat == "M5"){
							oColumn =  new sap.ui.table.Column({
								hAlign : "Center",
								flexible : false,
								resizable : false,
					        	vAlign : "Middle",
					        	multiLabels : [new sap.m.Label({text :"입사자정보",  textAlign : "Center"}),
//					        	               new sap.m.Label({text : "* " +  oBundleText.getText(oData.results[i].Fieldname),  textAlign : "Center"})],
					        	               new sap.m.Label({text : oBundleText.getText(oData.results[i].Label) ,  textAlign : "Center"})],
					            headerSpan : [MultiHeaderLength,1],
					            template: new sap.ui.commons.TextView({
									width:"100%",
									text : "{" +  oController.changeChar(oData.results[i].Fieldname)  + "}",  
									textAlign : "Center"
								}).addStyleClass("L2P13Font"),
							});
							Table.addColumn(oColumn);
							var vHireData = {};
							vHireData.Incat = oData.results[i].Incat;
							vHireData.Fieldname = oController.changeChar(oData.results[i].Fieldname);
							oController._vHiringPersonalInfomationLayout.push(vHireData);
						}else if(oData.results[i].Incat == "M8"){ // 라디오버튼 - 성별
							oColumn =  new sap.ui.table.Column({
								hAlign : "Center",
								flexible : false,
								resizable : false,
					        	vAlign : "Middle",
					        	multiLabels : [new sap.m.Label({text :"입사자정보",  textAlign : "Center"}),
//					        	               new sap.m.Label({text : oBundleText.getText(oData.results[i].Fieldname) ,  textAlign : "Center"})],
					        	               new sap.m.Label({text : oBundleText.getText(oData.results[i].Label) ,  textAlign : "Center"})],
					            headerSpan : [MultiHeaderLength,1],
					            template: new sap.ui.commons.TextView({
									width:"100%",
									text : "{" +  oController.changeChar(oData.results[i].Fieldname)  + "}",    
									textAlign : "Center"
								}).addStyleClass("L2P13Font"),
							});
							Table.addColumn(oColumn);
							var vHireData = {};
							vHireData.Incat = oData.results[i].Incat;
							vHireData.Fieldname = oController.changeChar(oData.results[i].Fieldname);
							oController._vHiringPersonalInfomationLayout.push(vHireData);
						}else if(oData.results[i].Incat == "O4"){ //
							oColumn =  new sap.ui.table.Column({
								hAlign : "Center",
								flexible : false,
								resizable : false,
					        	vAlign : "Middle",
					        	multiLabels : [new sap.m.Label({text :"입사자정보",  textAlign : "Center"}),
					        	               new sap.m.Label({text : oData.results[i].Label ,  textAlign : "Center"})],
					            headerSpan : [MultiHeaderLength,1],
					            template : new sap.ui.commons.TextView({
									text : {
										path :  oController.changeChar(oData.results[i].Fieldname), 
										type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
									},
								textAlign : "Center"}).addStyleClass("L2P13Font"),
							});
							Table.addColumn(oColumn);
							var vHireData = {};
							vHireData.Incat = oData.results[i].Incat;
							vHireData.Fieldname = oController.changeChar(oData.results[i].Fieldname);
							oController._vHiringPersonalInfomationLayout.push(vHireData);
						}
					}
				}
			},
			function(oResponse) {
				common.Common.log(oResponse);
			}		
		);
		
	},
	
	changeChar : function(vItext){
		var FirstWord = vItext.substring(0,1);
		var words = vItext.substring(1,vItext.length).toLowerCase();
		return FirstWord + words;
	},
	
	initInputControl : function(oController) {
		oController._vActiveControl = [];
		
		var oDownloadBtn = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_DOWNLOAD_BTN");
		var oUploadBtn = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_UPLOAD_BTN");
		
		var oUploadNoticeBar1 = sap.ui.getCore().byId(oController.PAGEID + "_UploadNoticeBar1");
		
		oUploadNoticeBar1.setVisible(false);
		
		oDownloadBtn.setVisible(false);
		oUploadBtn.setVisible(false);
		
		oController._vTableUploadField = [];
		var oListTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE"); 
		oListTable.removeAllColumns();
		oListTable.destroyColumns();
		var oJModel = new sap.ui.model.json.JSONModel();
		var Datas = {Data:[]};
		oJModel.setData(Datas);
		oListTable.setModel(oJModel);
	},

	onPressDownload : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppUpload");
		var oController = oView.getController();
		jQuery.sap.require("common.ExcelDownload");
		
		common.ExcelDownload.exceldown(oController);
	},
	
	changeFile : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppUpload");
		var oController = oView.getController();
		
		var reader = new FileReader();
		var f = jQuery.sap.domById(oController.PAGEID + "_EXCEL_UPLOAD_BTN" + "-fu").files[0];
		reader.onload = function(e) {
				oController.X = XLSX;
			var data = e.target.result;
			var arr = oController.fixdata(data);
			var wb = oController.X.read(btoa(arr), {type: 'base64'});
				oController.to_json(wb);
			
		};
		reader.readAsArrayBuffer(f);
	},
	
	fixdata : function(data) {
		var o = "", l = 0, w = 10240;
		for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
		o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
		return o;
	},
	
	to_json : function(workbook) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppUpload");
		var oController = oView.getController();
		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_UPLOAD_BTN") ; 
		var oListTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE") ; 
		var oJModel = new sap.ui.model.json.JSONModel();
		var Datas = {Data:[]};
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVE_BTN");
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		var icon1 = "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/OK.png";
		var icon2 = "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/No-entry.png";
		
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = oController.X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
			var controlData = {};
			var oPath = "/ActionSubjectListSet";
			var s_cnt = 0;
			var f_cnt = 0;
			
//			if(roa.length > 0){
//				if(oController._vDocty == "20"){
//					oController.VaildationUpload20(oController, roa);
//				}else{
//					oController.VaildationUpload(oController, roa);
//				}
//			}
			
			for(var i=0; i<5; i++) {
				var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
				var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
				
				if(oMassn.getSelectedKey() == "0000" || oMassn.getSelectedKey() == "") {
					eval("controlData.Massn" + (i+1) + " = '';");
				} else {
					eval("controlData.Massn" + (i+1) + " = '" + oMassn.getSelectedKey() + "';");
				}
				
				if(oMassg.getSelectedKey() == "0000" || oMassg.getSelectedKey() == "") {
					eval("controlData.Massg" + (i+1) + " = '';");
				} else {
					eval("controlData.Massg" + (i+1) + " = '" + oMassg.getSelectedKey() + "';");
				}
			}
			
			if(roa.length > 0){
				var vExLength = oController._vHiringPersonalInfomationLayout.length ;
				for(var i=0; i<roa.length ; i++){
					var vReturn = {} ;
					var vOneData = {};
					vOneData.Accty = "V";
					vOneData.Docno = oController._vDocno;
					vOneData.Actda = "\/Date(" + common.Common.getTime(oController._vActda) + ")\/";
					for(var j = 0 ; j < vExLength ; j++ ){
						var vCheckData = "";
						eval("vCheckData = roa[i].Coulmn_" + j);
						if(vCheckData == "" || vCheckData == undefined) continue;
						if(oController._vHiringPersonalInfomationLayout[j].Incat == "M4" || oController._vHiringPersonalInfomationLayout[j].Incat == "O4"){
							var vTempDate ;
							eval("vTempDate = roa[i].Coulmn_" + j + ";");
							var vNewDate = new Date();
							vNewDate.setUTCFullYear(parseInt(vTempDate.substring(0,4)));
							vNewDate.setUTCMonth(parseInt(vTempDate.substring(4,6)) - 1);
							vNewDate.setUTCDate(parseInt(vTempDate.substring(6,8)));
							vTempDate = "\/Date(" + vNewDate.getTime() + ")\/";
							eval("vOneData." + oController._vHiringPersonalInfomationLayout[j].Fieldname + " = vTempDate;");
						}else{
							eval("vOneData." + oController._vHiringPersonalInfomationLayout[j].Fieldname + " = roa[i].Coulmn_" + j + ";");
						}
					}
					process_result = false;
					
					var oPath1 = "/RecruitingSubjectsSet";

					oModel.create(
						oPath1, 
						vOneData,
						null,
					    function (oData, response) {
							process_result = true;
							vReturn = oData ;
							common.Common.log("Sucess RecruitingSubjectsSet Create !!!");
					    },
					    function (oError) {
					    	if(oController.BusyDialog && oController.BusyDialog.isOpen()) {oController.BusyDialog.close();};

					    	var Err = {};					    	 
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								if(Err.error.innererror.errordetails) {
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
						return
					}
					var vTempIdx = 0;
					for(var j = 0 + vExLength  ; j < oController._vTableUploadField.length + vExLength; j++ ){
						var vCheckData = "";
						eval("vCheckData = roa[i].Coulmn_" + j);
						if(vCheckData == "" || vCheckData == undefined) continue;
						eval("controlData." + oController._vTableUploadField[vTempIdx] + " = roa[i].Coulmn_" + j + ";");
						vTempIdx++;
					}
					controlData.Docno = oController._vDocno;
					controlData.Actty = "V";
					if(oController._vDocty == "20") {
						controlData.Actty = "VC";
					}
					controlData.Actda = "\/Date(" + common.Common.getTime(oController._vActda) + ")\/";
//					if(controlData.Actda != null && controlData.Actda != "") {
//						var vDate = controlData.Actda.substring(0,4) + "-" + controlData.Actda.substring(4,6) + "-" + controlData.Actda.substring(6,8);
//						controlData.Actda = "\/Date(" + common.Common.getTime(vDate) + ")\/";
//					} else {
//						controlData.Actda = "";
//					} 
					
					oModel.create(
							oPath, 
							controlData, 
							null,
						    function (oData, response) {
								if(oData) {
									if(oController._vDocty == "20" ){
										if(oController._vActiveControl && oController._vActiveControl.length) {
											for(var j=0; j<oController._vActiveControl.length; j++) {
												var Fieldtype = oController._vActiveControl[i].Incat;
												var Fieldname = oController._vActiveControl[j].Fieldname;
													Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
												if(Fieldtype.substring(0, 1) == "M") {
													eval("vReturn." + Fieldname + " = oData." + Fieldname +";");
												}
											}
										}
									}else{
										vReturn = oData ;
									}
									
									if(oData.Upbigo != "") {
										oData.Cfmyn = icon2 ;
										f_cnt++;
									} else {
										oData.Upbigo = "Success" ;
										oData.Cfmyn = icon1 ;
										s_cnt++;
									}
									vReturn.Cfmyn = oData.Cfmyn;
									vReturn.Upbigo = oData.Upbigo;
									
									Datas.Data.push(vReturn);
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
						    }
				    );
				}
		    	
				console.log(Datas);
				oJModel.setData(Datas);
				oListTable.setModel(oJModel);
				oListTable.bindRows("/Data");
				
				oSaveBtn.setVisible(true);
				
			}else{
				oSaveBtn.setVisible(false);
				sap.m.MessageBox.alert("엑셀에 데이터가 존재하지 않습니다");
				return;
			}
		})
		oFileUploader.setValue("");
		oFileUploader.setVisible(false);
		oFileUploader.setVisible(true);
	},
	
	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppUpload");
		var oController = oView.getController();
		var oListTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE"); 
		var oListModel = oListTable.getModel();
		var oListData = oListModel.getProperty("/Data");
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var saveProcess = function() {	
			var vExLength = oController._vHiringPersonalInfomationLayout.length ;
			for(var idx = 0; idx < oListData.length; idx++) {
				if(vExLength > 0 && oController._vDocty == "20"){
					var tableIdxData = oListData[idx]; 
					var vOneData = {};
//					vOneData.Accty = "V";
					vOneData.Docno = oController._vDocno;
					vOneData.Actda = "\/Date(" + common.Common.getTime(oController._vActda) + ")\/";
					for(var j = 0 ; j < vExLength ; j++ ){
						var vCheckData = "";
						eval("vCheckData = tableIdxData." + oController._vHiringPersonalInfomationLayout[j].Fieldname);
						if(vCheckData == "" || vCheckData == undefined) continue;
						if(oController._vHiringPersonalInfomationLayout[j].Incat == "M4" || oController._vHiringPersonalInfomationLayout[j].Incat == "O4"){
							var tempDate ;
							eval("tempDate = tableIdxData." + oController._vHiringPersonalInfomationLayout[j].Fieldname + ";");
							tempDate = "\/Date(" + common.Common.getTime( tempDate ) + ")\/" ;
							eval("vOneData." + oController._vHiringPersonalInfomationLayout[j].Fieldname + " = tempDate ;");
						}else{
							eval("vOneData." + oController._vHiringPersonalInfomationLayout[j].Fieldname + " = tableIdxData." + oController._vHiringPersonalInfomationLayout[j].Fieldname + ";");
						}
						
					}
					process_result = false;
					
					var oPath1 = "/RecruitingSubjectsSet";

					oModel.create(
						oPath1, 
						vOneData,
						null,
					    function (oData, response) {
							process_result = true;
							vReturn = oData ;
							common.Common.log("Sucess RecruitingSubjectsSet Create !!!");
					    },
					    function (oError) {
					    	if(oController.BusyDialog && oController.BusyDialog.isOpen()) {oController.BusyDialog.close();};

					    	var Err = {};					    	 
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								if(Err.error.innererror.errordetails) {
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
						return
					}
				}
				
				var createData = {};
				var tableIdxData = oListData[idx]; 
				for(var j = 0 ; j < oController._vTableUploadField.length; j++ ){
					var vCheckData = "";
					eval("vCheckData = tableIdxData." + oController._vTableUploadField[j]);
					if(vCheckData == "" || vCheckData == undefined) continue;
					eval("createData." + oController._vTableUploadField[j] + " = tableIdxData." + oController._vTableUploadField[j] + ";");
				}
				createData.Cfmyn = "";
				createData.Actty = "UP";
				createData.Docty = oController._vDocty;
				createData.Reqno = oController._vReqno;
				createData.Docno = oController._vDocno;
				createData.Batyp = "A";
				createData.Persa = oController._vPersa;
				createData.Actda = "\/Date(" + common.Common.getTime(oController._vActda) + ")\/";
				if(vReturn != "" && oController._vDocty == "20"){
					createData.VoltId = vReturn.VoltId;
					createData.Pernr = vReturn.VoltId.substring(2,10);
				}
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
	
//	onPressSave : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppUpload");
//		var oController = oView.getController();
//		var oListTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE"); 
//		var oListModel = oListTable.getModel();
//		var oListData = oListModel.getProperty("/Data");
//		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
//		
//		var saveProcess = function() {	
//			for(var idx = 0; idx < oListData.length; idx++) {
//				var createData = oListData[idx]; //UploadDataSheet.GetRowJson(idx + vHeaderCount); 
//				createData.Cfmyn = "";
//				createData.Actty = "UP";
//				createData.Docty = oController._vDocty;
//				createData.Reqno = oController._vReqno;
//				createData.Batyp = "A";
//				createData.Persa = oController._vPersa;
//				
//				var oPath = "/ActionSubjectListSet";
//				
//				var fReEntry = false;
//				
//				for(var i=0; i<5; i++) {
//					var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
//					var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
//					
//					if(oMassn.getSelectedKey() == "0000" || oMassn.getSelectedKey() == "") {
//						eval("createData.Massn" + (i+1) + " = '';");
//					} else {
//						if(oMassn.getSelectedKey() == "11") fReEntry = true;
//						eval("createData.Massn" + (i+1) + " = '" + oMassn.getSelectedKey() + "';");
//					}
//					
//					if(oMassg.getSelectedKey() == "0000" || oMassg.getSelectedKey() == "") {
//						eval("createData.Massg" + (i+1) + " = '';");
//					} else {
//						eval("createData.Massg" + (i+1) + " = '" + oMassg.getSelectedKey() + "';");
//					}
//				}
//				
//				if(fReEntry) {
//					createData.Actty = "UC";
//				}
//
//				var fProcess_flag = false;
//				oModel.create(
//						oPath, 
//						createData, 
//						null,
//					    function (oData, response) {
//							if(oData) {
//								fProcess_flag = true;
//							}
//					    },
//					    function (oError) {
//					    	var Err = {};
//							if (oError.response) {
//								Err = window.JSON.parse(oError.response.body);
//								if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
//									common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
//								} else {
//									common.Common.showErrorMessage(Err.error.message.value);
//								}
//							} else {
//								common.Common.showErrorMessage(oError);
//							}
//							fProcess_flag = false;
//					    }
//			    );
//				
//				if(fProcess_flag == false) {
//					if(oController.BusyDialog.isOpen()) {
//						oController.BusyDialog.close();
//					}
//					return;
//				}
//			}
//			
//			if(oController.BusyDialog.isOpen()) {
//				oController.BusyDialog.close();
//			}
//			
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
//				title : oBundleText.getText("INFORMATION"),
//				onClose : function(oEvent) {
//					sap.ui.getCore().getEventBus().publish("nav", "to", {
//					      id : oController._vFromPageId,
//					      data : {
//					    	  context : oController._oContext,
//					    	  Statu : oController._vStatu,
//					    	  Reqno : oController._vReqno,
//					    	  Docno : oController._vDocno,
//					    	  Docty : oController._vDocty,
//					      }
//					});
//				}
//			});
//		};
//		
//		if(!oController.BusyDialog) {			
//			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
//			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
//			oController.getView().addDependent(oController.BusyDialog);
//		} else {
//			oController.BusyDialog.removeAllContent();
//			oController.BusyDialog.destroyContent();
//			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
//		}
//		if(!oController.BusyDialog.isOpen()) {
//			oController.BusyDialog.open();
//		}
//		
//		setTimeout(saveProcess, 300);
//
//	},
	
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
		
	},
});

