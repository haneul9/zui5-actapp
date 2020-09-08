jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
jQuery.sap.require("sap.ui.core.util.ExportType");
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
	
	_BasicControl : [{label : "No.", id : "Recno", Align : "Center", Width : 100, control : "Text", required : false},
	                 {label : "상태", id : "Cfmyn", Align : "Center", Width : 40, control : "Img", required : false},
	                 {label : "사원번호", id : "Pernr", Align : "Left", Width : 100, control : "Text", required : true},
	                 {label : "성명", id : "Ename", Align : "Left", Width : 100, control : "Text", required : false},
	                 {label : "소속부서", id : "Per_orgeh_Tx", Align : "Left", Width : 150, control : "Text", required : false},
	                 {label : "직위", id : "Per_zzcaltl_Tx", Align : "Left", Width : 100, control : "Text", required : false},
	                 {label : "발령일", id : "Actda", Align : "Left", Width : 80, control : "Date", required : true}],
	
     BusyDialog : new sap.m.BusyDialog(),

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actapp2.ActAppUpload
*/
	onInit: function() {
//		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
//	    };
	    
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
//		var oColumns = oListTable.getColumns();
//		for(var i = 0; i< oListTable.getColumns().length ; i++){
//			oColumns[i].setHeaderSpan(1);
//			oColumns[i].destroyMultiLabels();
//			oColumns[i].destroy(true);
//		}
		
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
											text : "-- 선택 --"
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
										text : "-- 선택 --"
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
					sap.m.MessageBox.alert("휴직 및 퇴사의 경우에는 1개의 발령유형만 선택할 수 있습니다.");
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
										text : "-- 선택 --"
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
			
			if(oMassn) {
				if(oMassn.getSelectedKey() != "0000" && oMassn.getSelectedKey() != "") {
					vSelectMassnCnt++;
//					if(oMassg.getSelectedKey() == "0000" || oMassg.getSelectedKey() == "") {
////						isValid = false;
////						break;
//					} else {
						//재입사 여부 확인
						if(oMassn.getSelectedKey() == "11" ) {
							fReent = true;
						}
						var filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
						filterString += "%20and%20Actda%20eq%20datetime%27" + oController._vActda + "T00%3a00%3a00%27";
						if(oMassn.getSelectedKey() != "" && oMassn.getSelectedKey() != "0000")
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
//					}
				}
			}
		}
		
		if(vSelectMassnCnt < 1) {
			oEvent.getSource().setState(false);
			sap.m.MessageBox.alert("발령유형을 최소한 1개이상 선택 바랍니다.");
			return;
		}
		
//		if(!isValid) {
//			oEvent.getSource().setState(false);
//			sap.m.MessageBox.alert("발령사유를 선택바랍니다.");
//			return;
//		}
		
		oController.setInputFiled(oController, fReent);
		
		oUploadNoticeBar1.setVisible(true);
		
		oDownloadBtn.setVisible(true);
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
			var multiHeaderLine = 4 ;
			if(fReent == true) {
				 multiHeaderLine = 5 ;
			}
			oListTable.setFixedColumnCount(multiHeaderLine + 2);
			var oColumn =  new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
				resizable : false,
	        	vAlign : "Middle",
	        	multiLabels : [new sap.m.Label({text : "No.", textAlign : "Center"}).addStyleClass("L2PFontFamily"),
	        		           new sap.m.Label({text : "", textAlign : "Center"}).addStyleClass("L2PFontFamily")],
	            headerSpan : [1,1],
	            width : "80px",
	        	template: new sap.ui.commons.TextView({
					width:"100%",
					text : "{Recno}",  
					textAlign : "Center"
				}).addStyleClass("L2PFontFamily"),
			});
			oListTable.addColumn(oColumn);
			
			oColumn =  new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
				resizable : false,
	        	vAlign : "Middle",
	        	multiLabels :  [new sap.m.Label({text : "상태", textAlign : "Center"}).addStyleClass("L2PFontFamily"),
	        		            new sap.m.Label({text : "", textAlign : "Center"}).addStyleClass("L2PFontFamily")],
	            headerSpan : [1,1],
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
	        	multiLabels : [new sap.m.Label({text : "발령대상자", textAlign : "Center"}).addStyleClass("L2PFontFamily"),
	        	               new sap.m.Label({text : "* 사원번호", textAlign : "Center"}).addStyleClass("L2PFontFamily")],
	            headerSpan : [multiHeaderLine,1],
	            width : "100px",
	        	template: new sap.ui.commons.TextView({
					width:"100%",
					text : "{Pernr}",  
					textAlign : "Center"
				}).addStyleClass("L2PFontFamily"),
			});
			oListTable.addColumn(oColumn);
			var vTableUploaData = {};
			vTableUploaData.Incat = "M1";
			vTableUploaData.Fieldname = "Pernr";
			oController._vTableUploadField.push(vTableUploaData);
			
			oColumn =  new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
				resizable : false,
	        	vAlign : "Middle",
	        	multiLabels : [new sap.m.Label({text : "발령대상자", textAlign : "Center"}).addStyleClass("L2PFontFamily"),
	        	               new sap.m.Label({text : "성명", textAlign : "Center"}).addStyleClass("L2PFontFamily")],
	            headerSpan : [multiHeaderLine,1],
	            width : "100px",
	        	template: new sap.ui.commons.TextView({
					width:"100%",
					text : "{Ename}",  
					textAlign : "Center"
				}).addStyleClass("L2PFontFamily"),
			});
			oListTable.addColumn(oColumn);
			
			oColumn =  new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
				resizable : false,
	        	vAlign : "Middle",
	        	multiLabels : [new sap.m.Label({text : "발령대상자", textAlign : "Center"}).addStyleClass("L2PFontFamily"),
	        	               new sap.m.Label({text : "소속부서", textAlign : "Center"}).addStyleClass("L2PFontFamily")],
	            headerSpan : [multiHeaderLine,1],
	            width : "150px",
	        	template: new sap.ui.commons.TextView({
					width:"100%",
					text : "{Per_orgeh_Tx}",  
					textAlign : "Center"
				}).addStyleClass("L2PFontFamily"),
			});
			oListTable.addColumn(oColumn);
			
			oColumn =  new sap.ui.table.Column({
				hAlign : "Center",
				flexible : false,
				resizable : false,
	        	vAlign : "Middle",	
	        	multiLabels : [new sap.m.Label({text : "발령대상자", textAlign : "Center"}).addStyleClass("L2PFontFamily"),
	        	               new sap.m.Label({text : "* " +"발령일", textAlign : "Center"}).addStyleClass("L2PFontFamily")],
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
				}).addStyleClass("L2PFontFamily"),
			});
			oListTable.addColumn(oColumn);
//			oController._vTableUploadField.push("Actda");
			var vTableUploaData = {};
			vTableUploaData.Incat = "M4";
			vTableUploaData.Fieldname = "Actda";
			vTableUploaData.Lebel = "* " +"발령일" ;
			oController._vTableUploadField.push(vTableUploaData);
			
			if(fReent == true) {
				oColumn =  new sap.ui.table.Column({
					hAlign : "Center",
					flexible : false,
					resizable : false,
		        	vAlign : "Middle",
		        	multiLabels : [new sap.m.Label({text : "발령대상자", textAlign : "Center"}).addStyleClass("L2PFontFamily"),
		        	               new sap.m.Label({text : "* " + "주민번호", textAlign : "Center"}).addStyleClass("L2PFontFamily")],
		            headerSpan : [multiHeaderLine,1],
		            width : "150px",
		        	template: new sap.ui.commons.TextView({
						width:"100%",
						text : "{Icnum}",  
						textAlign : "Center"
					}).addStyleClass("L2PFontFamily"),
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
				else vLabelText = oController._vActiveControl[i].Label;
				
				//입력항목 라벨를 만든다.
				var vHeader = ""; // "발령데이터" + "|";
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
				
				if(Fieldtype == "M1" || Fieldtype == "M2" || Fieldtype == "M3" || Fieldtype == "M5" ||
						Fieldtype == "O1" || Fieldtype == "O2" || Fieldtype == "O5" ) {
						// 사번 조직 직무 직급  
						var vTableUploaData = {};
						vTableUploaData.Incat = Fieldtype;
						vTableUploaData.Fieldname = TextFieldname;
						vTableUploaData.Codename = Fieldname;
						vTableUploaData.Lebel = vHeader ;
						oController._vTableUploadField.push(vTableUploaData);
						oneCol.SaveName = TextFieldname;
				}else{
					oneCol.SaveName = TextFieldname;
					if(oController._vDocty == "20" || Fieldtype.substring(0, 1) == "M" ){
							var vTableUploaData = {};
							vTableUploaData.Incat = Fieldtype;
							vTableUploaData.Fieldname = Fieldname;
							vTableUploaData.Lebel = vHeader ;
							oController._vTableUploadField.push(vTableUploaData);
							oneCol.SaveName = Fieldname;
					}
				}
				
				if(oneCol.Type == "Date"){
					oColumn =  new sap.ui.table.Column({
						hAlign : "Center",
						flexible : false,
						resizable : false,
			        	vAlign : "Middle",
			        	multiLabels : [new sap.m.Label({text : "발령데이터", textAlign : "Center"}),
			        	               new sap.m.Label({text : vHeader, textAlign : "Center"})],
			            headerSpan : [oController._vActiveControl.length,1],
			            width : "100px",
//			        	template: new sap.ui.commons.TextView({
//							width:"100%",
//							text : { path : """" + oneCol.SaveName + """" , formatter : function(fVal) {
////							text : { path : "'Prbda'" , formatter : function(fVal) {
//								if (fVal == undefined || fVal == "") {
//									return ""; 
//								}else{
//									return dateFormat.format(fVal);
//								}
//							}},  
//							textAlign : "Center"
//						}).addStyleClass("L2PFontFamily"),
			            template : new sap.ui.commons.TextView({
							text : {
								path : oneCol.SaveName, 
								type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
							},
						textAlign : "Center"}).addStyleClass("L2PFontFamily"),
					});
					oListTable.addColumn(oColumn);
				}else{
					oColumn =  new sap.ui.table.Column({
						hAlign : "Center",
						flexible : false,
						resizable : false,
			        	vAlign : "Middle",
			        	multiLabels : [new sap.m.Label({text : "발령데이터", textAlign : "Center"}),
			        	               new sap.m.Label({text : vHeader, textAlign : "Center"})],
			            headerSpan : [oController._vActiveControl.length,1],
			            width : "100px",
			        	template: new sap.ui.commons.TextView({
							width:"100%",
							text :  "{" + oneCol.SaveName + "}",  
							textAlign : "Center"
						}).addStyleClass("L2PFontFamily"),
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
        	width: "300px",
        	multiLabels : [new sap.m.Label({text :"처리결과",  textAlign : "Center"}),
        	               new sap.m.Label({text :"",  textAlign : "Center"})],
            headerSpan : [1,1],
            template: new sap.ui.commons.TextView({
				text : "{Upbigo}",  
				textAlign : "Center"
			}).addStyleClass("L2PFontFamily"),
		});
		oListTable.addColumn(oColumn);
		
	},
	
	setHireTable : function(oController, Table ){
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		var MultiHeaderLength = 0;
		oController._vHiringPersonalInfomationLayout = [];
		oModel.read("/HiringPersonalInfomationLayoutSet?$filter=Docno eq'" + oController._vDocno + "' and "
				  + "Molga eq '" +  '41' + "' and "
				  + "Actda eq datetime'" + oController._vActda + "T00%3a00%3a00'",
			null,
			null,
			false, 	
			function(oData, oResponse) {	
				if(oData && oData.results) {
					
					for(var i=0; i<oData.results.length; i++) {
						if(oData.results[i].Incat == "M1" || oData.results[i].Incat == "M2" || oData.results[i].Incat == "M5" || oData.results[i].Incat == "M8" ||
								oData.results[i].Incat == "O1" || oData.results[i].Incat == "O2" || oData.results[i].Incat == "O5" || oData.results[i].Incat == "O8" ) {
							var tempText = oController.changeChar(oData.results[i].Fieldname)  + "tx";
//							var tempText = oController.changeChar(oData.results[i].Fieldname);
							oColumn =  new sap.ui.table.Column({
								hAlign : "Center",
								flexible : false,
								resizable : false,
								width : "100px",
					        	vAlign : "Middle",
					        	multiLabels : [new sap.m.Label({text :"입사자정보",  textAlign : "Center"}),
					        	               new sap.m.Label({text : oData.results[i].Label ,  textAlign : "Center"})],
					            headerSpan : [oData.results.length,1],
					            template: new sap.ui.commons.TextView({
									width:"100%",
									text : "{" +  tempText  + "}",  
									textAlign : "Center"
								}).addStyleClass("L2PFontFamily"),
							});
							Table.addColumn(oColumn);
							var vHireData = {};
							vHireData.Incat = oData.results[i].Incat;
							vHireData.Fieldname = oController.changeChar(oData.results[i].Fieldname) + "tx";
//							vHireData.Fieldname = oController.changeChar(oData.results[i].Fieldname);
							vHireData.Codename = oController.changeChar(oData.results[i].Fieldname);
							oController._vHiringPersonalInfomationLayout.push(vHireData);
						}else if(oData.results[i].Incat == "O4" || oData.results[i].Incat == "M4"){ //
							oColumn =  new sap.ui.table.Column({
								hAlign : "Center",
								flexible : false,
								resizable : false,
								width : "100px",
					        	vAlign : "Middle",
					        	multiLabels : [new sap.m.Label({text :"입사자정보",  textAlign : "Center"}),
					        	               new sap.m.Label({text : oData.results[i].Label ,  textAlign : "Center"})],
					            headerSpan : [MultiHeaderLength,1],
					            template : new sap.ui.commons.TextView({
									text : {
										path :  oController.changeChar(oData.results[i].Fieldname), 
										type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
									},
								textAlign : "Center"}).addStyleClass("L2PFontFamily"),
							});
							Table.addColumn(oColumn);
							var vHireData = {};
							vHireData.Incat = oData.results[i].Incat;
							vHireData.Fieldname = oController.changeChar(oData.results[i].Fieldname);
							oController._vHiringPersonalInfomationLayout.push(vHireData);
						}else if(oData.results[i].Incat == "M3" || oData.results[i].Incat == "M7" ||
								oData.results[i].Incat == "O3" || oData.results[i].Incat == "O7"){ 
							oColumn =  new sap.ui.table.Column({
								hAlign : "Center",
								flexible : false,
								resizable : false,
								width : "100px",
					        	vAlign : "Middle",
					        	multiLabels : [new sap.m.Label({text :"입사자정보",  textAlign : "Center"}),
					        	               new sap.m.Label({text : oData.results[i].Label ,  textAlign : "Center"}).addStyleClass("L2PFontFamily")],
					            headerSpan : [oData.results.length,1],
					            template: new sap.ui.commons.TextView({
									width:"100%",
									text : "{" +  oController.changeChar(oData.results[i].Fieldname)  + "}",    
									textAlign : "Center"
								}).addStyleClass("L2PFontFamily"),
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
//		Table.setFixedColumnCount(oController._vHiringPersonalInfomationLayout.length);
		Table.setFixedColumnCount(MultiHeaderLength);
		
		
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
		var oJModel = new sap.ui.model.json.JSONModel();
		var Datas = {Data:[]};
		oJModel.setData(Datas);
		oListTable.setModel(oJModel);
		oListTable.unbindRows();
		
//		var oColumns = oListTable.getColumns();
//		for(var i = 0; i< oColumns.length ; i++){
////			oColumns[i].setHeaderSpan(1);
//			oColumns[i].destroyMultiLabels();
//			oColumns[i].destroy(true);
//		}
//		
////		for(var i = 0; i< oColumns.length ; i++){
////			oColumns[i].destroy(true);
////		}
//		oListTable.unbindColumns();
//		oListTable.rerender();
		oListTable.removeAllColumns();
		oListTable.destroyColumns();

	},

	onPressDownload : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppUpload");
		var oController = oView.getController();
//		jQuery.sap.require("common.ExcelDownload");
//		
//		common.ExcelDownload.exceldown2(oController);     
		
		var oListTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE"); 
		var oModel = oListTable.getModel();
//		var oListData = oModel.getProperty("/Data");
		var oExport = new sap.ui.core.util.Export({
            // Type that will be used to generate the content. Own ExportType's can be created to support other formats
            exportType: new sap.ui.core.util.ExportTypeCSV({
                separatorChar: "," 
            }),
            // Pass in the model created above
            models: oModel,
            // binding information for the rows aggregation
            rows: {
                path: "/Data/0"
            },
        });
        
		var columns = oListTable.getColumns();
		
        
     //push header column names to array
	    for(var j=0; j<columns.length - 1;j++){
            var headerCol = columns[j].getMultiLabels()[1].getText();
//            if( j < 6){
//	            if(headerCol && headerCol.substring(0,1) == "*"){
//	            	 oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
//	            			name : headerCol,
//	        			    template : { content : "{test}" }
//	              })); 
//	            }
//            }else{
//	           	 oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
//	     			name : headerCol,
//	 			    template : { content : "{test}" }
//	           	 })); 
//	
//            }
            
          	 oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
	     			name : headerCol,
	 			    template : { content : "{test}" }
	           	 }));
	    }       
        oExport.saveFile().always(function() {
            this.destroy();
        });
	},
	
	changeFile : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppUpload");
		var oController = oView.getController();
		
//		var fileType = f.split(".");
//		if(fileType[1] && fileType[1] == "csv"){
//			
//		}else{
//			var reader = new FileReader();
//			reader.onload = function(e) {
//					oController.X = XLSX;
//				var data = e.target.result;
//				var arr = oController.fixdata(data);
//				var wb = oController.X.read(btoa(arr), {type: 'base64'});
//					oController.to_json(wb);
//				
//			};
//			reader.readAsArrayBuffer(f);
//		}
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
		var icon1 = "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/OK.png";
		var icon2 = "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/No-entry.png";
		
		workbook.SheetNames.forEach(function(sheetName) {
			var vIdx = 1;
			var roa = oController.X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
			var vHeaderData = {};
			var oPath = "/ActionSubjectListSet";
			var s_cnt = 0;
			var f_cnt = 0;
			
			for(var i=0; i<5; i++) {
				var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
				var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
				
				if(oMassn.getSelectedKey() == "0000" || oMassn.getSelectedKey() == "") {
					eval("vHeaderData.Massn" + (i+1) + " = '';");
				} else {
					eval("vHeaderData.Massn" + (i+1) + " = '" + oMassn.getSelectedKey() + "';");
				}
				
				if(oMassg.getSelectedKey() == "0000" || oMassg.getSelectedKey() == "") {
					eval("vHeaderData.Massg" + (i+1) + " = '';");
				} else {
					eval("vHeaderData.Massg" + (i+1) + " = '" + oMassg.getSelectedKey() + "';");
				}
			}
			
			if(roa.length > 0){
				var vExLength = oController._vHiringPersonalInfomationLayout.length ;
				for(var i=0; i<roa.length ; i++){
					var vReturn = {} ;
					var vRecReturn = {};
					process_result = false;
					if(oController._vDocty == "20"){
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
//								eval("vOneData." + oController._vHiringPersonalInfomationLayout[j].Fieldname + " = roa[i].Coulmn_" + j + ";");
								if(typeof oController._vHiringPersonalInfomationLayout[j].Codename == "undefined")
									eval("vOneData." + oController._vHiringPersonalInfomationLayout[j].Fieldname + " = roa[i].Coulmn_" + j + ";");
								else
									eval("vOneData." + oController._vHiringPersonalInfomationLayout[j].Codename + " = roa[i].Coulmn_" + j + ";");
								
							}
						}
						
						var oPath1 = "/RecruitingSubjectsSet";
	
						oModel.create(
							oPath1, 
							vOneData,
							null,
						    function (oData, response) {
								process_result = true;
								vRecReturn = oData ;
								common.Common.log("Sucess RecruitingSubjectsSet Create !!!");
						    },
						    function (oError) {
						    	oController.BusyDialog.close();
	
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
					var vTempIdx = 0;
					var controlData = {};
					
					for(var k=0; k<5; k++) {
						eval("controlData.Massn" + (k+1) + " = vHeaderData.Massn" + (k+1) + ";");
						eval("controlData.Massg" + (k+1) + " = vHeaderData.Massg" + (k+1) + ";");
					}
					
					for(var j = 0 + vExLength  ; j < oController._vTableUploadField.length + vExLength; j++ ){
						var vCheckData = "";
						eval("vCheckData = roa[i].Coulmn_" + j);
						if(vCheckData == "" || vCheckData == undefined){
							vTempIdx++;
							continue;
						}
						
						var vTFieldname = oController._vTableUploadField[vTempIdx].Fieldname ;
						
						if(vTFieldname == "Orgeh" || vTFieldname == "Stell" || vTFieldname == "Zzjiktl"){
							eval("controlData." + oController._vTableUploadField[vTempIdx].Codename + " = roa[i].Coulmn_" + j + ";");
						}else if(vTFieldname == "Bet01"){
							eval("var tmp = roa[i].Coulmn_" + j + ";");
							tmp = tmp / 100 + "";
							eval("controlData." + oController._vTableUploadField[vTempIdx].Fieldname + " = tmp;");
						}else{
//							eval("controlData." + oController._vTableUploadField[vTempIdx].Fieldname + " = roa[i].Coulmn_" + j + ";");
							
							if(typeof oController._vTableUploadField[vTempIdx].Codename == "undefined")
								eval("controlData." + oController._vTableUploadField[vTempIdx].Fieldname + " = roa[i].Coulmn_" + j + ";");
							else
								eval("controlData." +oController._vTableUploadField[vTempIdx].Codename + " = roa[i].Coulmn_" + j + ";");
						}
						
						
						if(vTFieldname == "Bet01_v2"){
							controlData.Waers2 = "KRW";
						}
						
						if(oController._vTableUploadField[vTempIdx].Incat == "M4" ||oController._vTableUploadField[vTempIdx].Incat == "O4"){
							var vTempDate ;
							eval("vTempDate = roa[i].Coulmn_" + j + ";");
							var vNewDate = new Date();
							vNewDate.setUTCFullYear(parseInt(vTempDate.substring(0,4)));
							vNewDate.setUTCMonth(parseInt(vTempDate.substring(4,6)) - 1);
							vNewDate.setUTCDate(parseInt(vTempDate.substring(6,8)));
							vTempDate = "\/Date(" + vNewDate.getTime() + ")\/";
							eval("controlData." + oController._vTableUploadField[vTempIdx].Fieldname + " = vTempDate ;");
						}
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
//									if(oController._vDocty == "20" ){
//										if(oController._vActiveControl && oController._vActiveControl.length) {
//											for(var j=0; j<oController._vActiveControl.length; j++) {
//												var Fieldtype = oController._vActiveControl[i].Incat;
//												var Fieldname = oController._vActiveControl[j].Fieldname;
//													Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
//												if(Fieldtype.substring(0, 1) == "M") {
//													eval("vReturn." + Fieldname + " = oData." + Fieldname +";");
//												}
//											}
//										}
//									}else{
										vReturn = oData ;
//									}
									
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
									
									if(vRecReturn != null && vRecReturn != ""){
										// RecruitingSubjectsSet 결과
										for(var j = 0 ; j < vExLength ; j++ ){
											if(oController._vHiringPersonalInfomationLayout[j].Codename){
												eval("vReturn." + oController._vHiringPersonalInfomationLayout[j].Codename + " = vRecReturn."+oController._vHiringPersonalInfomationLayout[j].Codename+";");
											}
											eval("vReturn." + oController._vHiringPersonalInfomationLayout[j].Fieldname + " = vRecReturn."+oController._vHiringPersonalInfomationLayout[j].Fieldname+";");
										}
									}
									vReturn.Recno = vIdx;
									Datas.Data.push(vReturn);
									vIdx ++;
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
				
				if(f_cnt > 0) oSaveBtn.setVisible(false);
				else oSaveBtn.setVisible(true);
				
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
//							eval("vOneData." + oController._vHiringPersonalInfomationLayout[j].Fieldname + " = tableIdxData." + oController._vHiringPersonalInfomationLayout[j].Fieldname + ";");
							if(oController._vHiringPersonalInfomationLayout[j].Codename != undefined && 
									oController._vHiringPersonalInfomationLayout[j].Codename != null){
								eval("vOneData." + oController._vHiringPersonalInfomationLayout[j].Codename + " = tableIdxData." + oController._vHiringPersonalInfomationLayout[j].Codename + ";");
							}else{
								eval("vOneData." + oController._vHiringPersonalInfomationLayout[j].Fieldname + " = tableIdxData." + oController._vHiringPersonalInfomationLayout[j].Fieldname + ";");
							}
						
						}
						
					}
					process_result = false;
					
					var oPath1 = "/RecruitingSubjectsSet";
					var vReturn = "";
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
					    	oController.BusyDialog.close();

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
					eval("vCheckData = tableIdxData." + oController._vTableUploadField[j].Fieldname);
					if(vCheckData == "" || vCheckData == undefined) continue;
					eval("createData." + oController._vTableUploadField[j].Fieldname + " = tableIdxData." + oController._vTableUploadField[j].Fieldname + ";");
				
					if(oController._vTableUploadField[j].Incat == "M4" ||oController._vTableUploadField[j].Incat == "O4"){
						var tempDate ;
						eval("tempDate = createData." + oController._vTableUploadField[j].Fieldname+ ";");
						tempDate = "\/Date(" + common.Common.getTime( tempDate ) + ")\/" ;
						eval("createData." + oController._vTableUploadField[j].Fieldname + " = tempDate ;");
					}
					// Code data
					if(oController._vTableUploadField[j].Codename != undefined && oController._vTableUploadField[j].Codename != "" ){
						eval("createData." + oController._vTableUploadField[j].Codename + " = tableIdxData." +oController._vTableUploadField[j].Codename +";");
					}
					
					if(oController._vTableUploadField[j].Fieldname == "Bet01_v2"){
						createData.Waers2 = "KRW";
					}
				}
				createData.Cfmyn = "";
				createData.Actty = "UP";
				createData.Docty = oController._vDocty;
				createData.Reqno = oController._vReqno;
				createData.Docno = oController._vDocno;
				createData.Batyp = "A";
				createData.Persa = oController._vPersa;
				createData.Actda = "\/Date(" + common.Common.getTime(oController._vActda) + ")\/";
				if(  oController._vDocty == "20" && vReturn != ""){
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
					oController.BusyDialog.close();
					return;
				}
			}
			
			oController.BusyDialog.close();
			
			sap.m.MessageBox.alert("저장하였습니다.", {
				title : "안내",
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
		
		oController.BusyDialog.open();
		
		setTimeout(saveProcess, 300);

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
		
	},
});

