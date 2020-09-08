jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("zui5_hrxx_actapp2.common.Common");

sap.ui.controller("zui5_hrxx_actapp2.ActAppRetireUpload", {
	
	PAGEID : "ActAppRetireUpload",
	
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
	_vMolga : "",
	_oContext : null,
	
	vMassn : "90",
	
	_vFromPageId : "",
	 
	_vActiveControl : [],
	
	_vVilidData : [],
	_vTableUploadField : [] ,
	
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
* @memberOf zui5_hrxx_actapp2.ActAppRetireUpload
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
		$("#" + this.PAGEID + "_oIBSheetLayout").css("height", window.innerHeight - 350);
		$("#" + this.PAGEID + "_IBSHEET1").css("height", (window.innerHeight - 350));
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
			this._vMolga = oEvent.data.Molga;
			this._oContext = oEvent.data.context;
			this._vFromPageId = oEvent.data.FromPageId;
		}
		
		var oSaveBtn = sap.ui.getCore().byId(this.PAGEID + "_SAVE_BTN");
		oSaveBtn.setVisible(false);
		
		var oDownloadBtn = sap.ui.getCore().byId(this.PAGEID + "_EXCEL_DOWNLOAD_BTN");
		oDownloadBtn.setVisible(false);
		
		var oUploadBtn = sap.ui.getCore().byId(this.PAGEID + "_EXCEL_UPLOAD_BTN");
		oUploadBtn.setVisible(false);
		
		var oUploadNoticeBar1 = sap.ui.getCore().byId(this.PAGEID + "_UploadNoticeBar1");
		oUploadNoticeBar1.setVisible(false);
		
		var oInputSwith = sap.ui.getCore().byId(this.PAGEID + "_Input_Switch");
		oInputSwith.setState(false);
		oInputSwith.setEnabled(false);
		
		var oMassg = sap.ui.getCore().byId(this.PAGEID + "_Massg");
		oMassg.setValue("");
		oMassg.destroyCustomData();
		
		this.loadReasonRetireList();
	},
	
	onAfterShow : function(oEvent) {
		
	},
	
	loadReasonRetireList : function() {

		var oController = this;
			
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		
		var mRetirementReasonList = sap.ui.getCore().getModel("RetirementReasonList");
		var vRetirementReasonList = {RetirementReasonSet : []};
		
		oModel.read("/RetirementReasonSet/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27", 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							vRetirementReasonList.RetirementReasonSet.push(oData.results[i]);
						}
						mRetirementReasonList.setData(vRetirementReasonList);
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_actapp2.ActAppRetireUpload
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actapp2.ActAppRetireUpload
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actapp2.ActAppRetireUpload
*/
//	onExit: function() {
//
//	}
	
	navToBack : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppRetireUpload");
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
	
	onChangeMassg : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppRetireUpload");
		var oController = oView.getController();
		
		var oInputSwith = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
		oInputSwith.setState(false);
		oInputSwith.setEnabled(true);
		
		oController.initInputControl(oController);
	},
	
	onChangeSwitch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppRetireUpload");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		if(oEvent.getParameter("state") == false) {
			oController.initInputControl(oController);
			return;
		}
		 
		oController.initInputControl(oController);
		
		var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg");
		var vMassg = oMassg.getCustomData()[0].getValue();
		
		if(oMassg) {
			if(vMassg != "") {
				var filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
				filterString += "%20and%20Actda%20eq%20datetime%27" + oController._vActda + "T00%3a00%3a00%27";
				filterString += "%20and%20Massn%20eq%20%27" + oController.vMassn + "%27";
				filterString += "%20and%20Massg%20eq%20%27" + vMassg + "%27";
				filterString += "%20and%20Pernr%20eq%20%27" + oController._vPernr + "%27";
				filterString += "%20and%20Docno%20eq%20%27" + oController._vDocno + "%27";
				
				oModel.read("/ActionInputFieldSet"  + filterString, 
						null, 
						null, 
						false, 
						function(oData, oResponse) {					
							if(oData.results && oData.results.length) {
								for(var i=0; i<oData.results.length; i++) {
									oController._vActiveControl.push(oData.results[i]);
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
				
				oController.setInputFiled(oController);
				
				var oUploadNoticeBar1 = sap.ui.getCore().byId(oController.PAGEID + "_UploadNoticeBar1");				
				oUploadNoticeBar1.setVisible(true);
				
				var oDownloadBtn = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_DOWNLOAD_BTN");
				oDownloadBtn.setVisible(true);
				
				var oUploadBtn = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_UPLOAD_BTN");
				oUploadBtn.setVisible(true);				
			} else {
				oEvent.getSource().setState(false);
				sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_ACTTYPE"));
				return;
			}
		}
	},

	setInputFiled : function(oController) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
		oController._vTableUploadField = [];
		var oListTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE"); 
		oListTable.removeAllColumns();
		oListTable.destroyColumns();
		var multiHeaderLine = 5 ;
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
//						return fVal;
					}
				}},   
				textAlign : "Center"
			}).addStyleClass("L2P13Font"),
		});
		oListTable.addColumn(oColumn);
		oController._vTableUploadField.push("Actda");
		
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
					vHeader += "* " + vLabelText; //oBundleText.getText(oController._vActiveControl[i].Fieldname);
				} else {
					vHeader += vLabelText; //oBundleText.getText(oController._vActiveControl[i].Fieldname);
				}
				
				oneCol.Header = vHeader;
				if(Fieldtype == "M4" || Fieldtype == "O4") {
					oneCol.Type = "Date";  
				} else {
					oneCol.Type = "Text";
				}
				
				oneCol.Edit = 0;
				oneCol.Width = 100;
				
				if(Fieldname.toUpperCase().indexOf("ORGEH") != -1 || Fieldname.toUpperCase().indexOf("STELL") != -1 
						|| Fieldname.toUpperCase().indexOf("ZZEMPWP") != -1 || Fieldname.toUpperCase().indexOf("ZZLOJOB") != -1 
						|| Fieldname.toUpperCase().indexOf("KOSTL") != -1 || Fieldname.toUpperCase().indexOf("RET_PERSA") != -1) {
					oneCol.SaveName = Fieldname;
					oneCol.LabelCode = "X";
					oController._vTableUploadField.push(Fieldname);
				} else {
					oneCol.SaveName = TextFieldname;
				}
				
				if(Fieldtype == "M6" || Fieldtype == "O6") {
					oneCol.SaveName = Fieldname;
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
	
	initInputControl : function(oController) {
		oController._vActiveControl = [];
		
		var oDownloadBtn = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_DOWNLOAD_BTN");
		var oUploadBtn = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_UPLOAD_BTN");
		
		var oUploadNoticeBar1 = sap.ui.getCore().byId(oController.PAGEID + "_UploadNoticeBar1");		
		oUploadNoticeBar1.setVisible(false);
		
		oDownloadBtn.setVisible(false);
		oUploadBtn.setVisible(false);
		
		if(typeof RetireUploadDataSheet == "object") {
			RetireUploadDataSheet.Reset();
		}
	},

	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppRetireUpload");
		var oController = oView.getController();
		
		var oListTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE"); 
		var oListModel = oListTable.getModel();
		var oListData = oListModel.getProperty("/Data");
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var saveProcess = function() {	
			for(var idx = 0; idx < oListData.length; idx++) {
				var createData = oListData[idx];
				createData.Actty = "UP";
				createData.Docty = oController._vDocty;
				createData.Reqno = oController._vReqno;
				createData.Batyp = "A";
				createData.Persa = oController._vPersa;
				
				var oPath = "/ActionSubjectListSet";
				
				var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg");
				var vMassg = oMassg.getCustomData()[0].getValue();
				var vRetrs = oMassg.getCustomData()[1].getValue();
				
				createData.Retrs = vRetrs;
				
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
							sap.m.MessageBox.alert(vMsg);
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
//		var params = { FileName : "ActionApp.xls",  SheetName : "Sheet", Merge : 1} ;
//		if(typeof RetireUploadDataSheet == "object") {
//			RetireUploadDataSheet.Down2Excel(params);
//		}
//		
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppRetireUpload");
		var oController = oView.getController();
		jQuery.sap.require("common.ExcelDownload");
		
		common.ExcelDownload.exceldown(oController);
	},
	
//	onPressUpload : function(oEvent) {
//		var params = { Mode : "HeaderMatch" } ;
//		if(typeof RetireUploadDataSheet == "object") {
//			RetireUploadDataSheet.LoadExcel(params);
//		}
//	},
	
	changeFile : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppRetireUpload");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppRetireUpload");
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
			
			if(roa.length > 0){
				for(var i=0; i<roa.length ; i++){
					for(var j = 0 ; j < oController._vTableUploadField.length; j++ ){
						eval("controlData." + oController._vTableUploadField[j] + " = roa[i].Coulmn_" + j + ";");
					}
					controlData.Docno = oController._vDocno;
					controlData.Actty = "V";
					if(oController._vDocty == "20") {
						controlData.Actty = "VC";
					}
					
					if(controlData.Actda != null && controlData.Actda != "") {
						var vDate = controlData.Actda.substring(0,4) + "-" + controlData.Actda.substring(4,6) + "-" + controlData.Actda.substring(6,8);
						controlData.Actda = "\/Date(" + common.Common.getTime(vDate) + ")\/";
					} else {
						controlData.Actda = "";
					} 
					
					if(oController._vActiveControl && oController._vActiveControl.length) {
						for(var j=0; j<oController._vActiveControl.length; j++) {
							var Fieldname = oController._vActiveControl[j].Fieldname;
							var Fieldtype = oController._vActiveControl[j].Incat;
							Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
							//Date Type
							if(Fieldtype == "M4" || Fieldtype == "O4") {
								var dVal = eval("controlData." + Fieldname + "_Tx;");
								if(dVal != null && dVal != "") {
									var vDate = dVal.substring(0,4) + "-" + dVal.substring(4,6) + "-" + dVal.substring(6,8);							
									var vDate1 = "\/Date(" + common.Common.getTime(vDate) + ")\/";
									eval("controlData." + Fieldname + " = vDate1;");
								} else {
									eval("controlData." + Fieldname + " =  null;");
								} 
							}
						}
					}
					
					var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg");
					var vMassg = oMassg.getCustomData()[0].getValue();
					
					controlData.Massn1 = oController.vMassn;
					controlData.Massg1 = vMassg;
					var fProcess_flag = false;
					var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
					oModel.create(
							oPath, 
							controlData, 
							null,
						    function (oData, response) {
								if(oData) {
									if(oData.Upbigo != "") {
										oData.Cfmyn = icon2 ;
										f_cnt++;
									} else {
										oData.Upbigo = "Success" ;
										oData.Cfmyn = icon1 ;
										s_cnt++;
									}
									Datas.Data.push(oData);
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
	
	
	validData : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppRetireUpload");
		var oController = oView.getController();
		
		if(typeof RetireUploadDataSheet != "object") {
			return;
		}
		
		var icon1 = "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/OK.png";
		var icon2 = "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/No-entry.png";
		
		oController._vVilidData = [];
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var vRowCount = RetireUploadDataSheet.RowCount();
		var vHeaderCount = RetireUploadDataSheet.HeaderRows();
		
		RetireUploadDataSheet.SetCellFont("FontSize", 0, "Numbr", (vRowCount + vHeaderCount), "Upbigo", 13);
		RetireUploadDataSheet.SetCellFont("FontName", 0, "Numbr", (vRowCount + vHeaderCount), "Upbigo", "Malgun Gothic");
		
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
			
			RetireUploadDataSheet.SetCellValue(idx + vHeaderCount, "Upbigo", oBundleText.getText("MSG_VALID_PROCESSING_WAIT"), 0);
			RetireUploadDataSheet.SetCellFontColor(idx + vHeaderCount, "Upbigo", "blue");
			
			var createData = RetireUploadDataSheet.GetRowJson(idx + vHeaderCount); 
				
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
			
			var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg");
			var vMassg = oMassg.getCustomData()[0].getValue();
			
			createData.Massn1 = oController.vMassn;
			createData.Massg1 = vMassg;
			
			oModel.create(
					oPath, 
					createData, 
					null,
				    function (oData, response) {
						if(oData) {
							if(oData.Upbigo != "") {
								RetireUploadDataSheet.SetCellValue(idx + vHeaderCount, "Upbigo", oData.Upbigo, 0);
								RetireUploadDataSheet.SetCellFontColor(idx + vHeaderCount, "Upbigo", "red");
								RetireUploadDataSheet.SetCellValue(idx + vHeaderCount, "Cfmyn", icon2, 0);
								f_cnt++;
							} else {
								RetireUploadDataSheet.SetCellValue(idx + vHeaderCount, "Upbigo", "Success", 0);
								RetireUploadDataSheet.SetCellFontColor(idx + vHeaderCount, "Upbigo", "black");
								RetireUploadDataSheet.SetCellValue(idx + vHeaderCount, "Cfmyn", icon1, 0);
								s_cnt++;
							}
							RetireUploadDataSheet.SetCellValue(idx + vHeaderCount, "Ename", oData.Ename, 0);
							RetireUploadDataSheet.SetCellValue(idx + vHeaderCount, "Per_orgeh_Tx", oData.Per_orgeh_Tx, 0);
							RetireUploadDataSheet.SetCellValue(idx + vHeaderCount, "Per_zzcaltl_Tx", oData.Per_zzcaltl_Tx, 0);
							
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
						RetireUploadDataSheet.SetCellValue(idx + vHeaderCount, "Upbigo", vMsg, 0);
						RetireUploadDataSheet.SetCellFontColor(idx + vHeaderCount, "Upbigo", "red");
						RetireUploadDataSheet.SetCellValue(idx + vHeaderCount, "Cfmyn", icon2, 0);
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
	
	_ODialogSearchRetrs: null,
	_ORetrsControl : null,
	onDisplaySearchRetrsDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppRetireUpload");
		var oController = oView.getController();
		
		oController._ORetrsControl = oEvent.getSource();
		
		if(!oController._ODialogSearchRetrs) {
			oController._ODialogSearchRetrs = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.RetireReasonDialog", oController);
			oView.addDependent(oController._ODialogSearchRetrs);
		}
		oController._ODialogSearchRetrs.open();
	},
	
	onSearchRetrs : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Mgtxt", sap.ui.model.FilterOperator.Contains, sValue));
	    
		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter(oFilters);
	},

	onConfirmRetrs : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppRetireUpload");
		var oController = oView.getController();
		
		var aContexts = oEvent.getParameter("selectedContexts");
	    
		if (aContexts.length) {
			var vRetrs = aContexts[0].getProperty("Massg");
	    	var vRetrstx = aContexts[0].getProperty("Mgtxt");
	    	var vMassg = aContexts[0].getProperty("Rmassg");
	    	oController._ORetrsControl.removeAllCustomData();
	    	oController._ORetrsControl.setValue(vRetrstx);
	    	oController._ORetrsControl.addCustomData(new sap.ui.core.CustomData({key : "Massg", value : vMassg}));
	    	oController._ORetrsControl.addCustomData(new sap.ui.core.CustomData({key : "Retrs", value : vRetrs}));
	    	
	    	var oInputSwith = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
			if(oInputSwith) {
				oInputSwith.setState(false);
				oInputSwith.setEnabled(true);
			}
			
//			var oDownloadBtn = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_DOWNLOAD_BTN");
//			oDownloadBtn.setVisible(true);
//			
//			var oUploadBtn = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_UPLOAD_BTN");
//			oUploadBtn.setVisible(true);
			
			oController.initInputControl(oController);
	    }
		
		oController.onCancelRetrs(oEvent);
	},
		
	onCancelRetrs : function(oEvent) {
		var oBinding = oEvent.getSource().getBinding("items");
	    oBinding.filter([]);
	},
});

function RetireUploadDataSheet_OnLoadExcel(result) {
	if(result) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppRetireUpload");
		var oController = oView.getController();
		oController.validData();
		
		RetireUploadDataSheet.FitSize(1, 0);
	}
}

function RetireUploadDataSheet_OnChange(Row, Col, Value) {
	console.log("RetireUploadDataSheet_OnChange !!! " + Value);
	//RetireUploadDataSheet.FitSize(1, 1);
}
