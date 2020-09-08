jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");
jQuery.sap.require("zui5_hrxx_actapp2.common.Common");

sap.ui.controller("zui5_hrxx_actapp2.ActRecDocument", {

	PAGEID : "ActRecDocument",
	ListSelectionType : "Multiple",
	ListSelected : false,
	ListFilter : "",
	
	_vStatu : "",
	_vReqno : "",
	_vDocno : "",
	_vDocty : "",
	_vEntrs : "",
	_vPersa : "",
	_vActda : "",
	_vMolga : "",
	_vIntca : "",
	_oContext : null,
	_vSelectedPersa : "",
	
	_vSelected_Reqno : "",
	_vSelected_Pernr : "",
	_vSelected_Actda : "",
	_vSelected_Docno : "",
	_vSelected_VoltId : "",
	 
	vDisplayControl : [],
	
	_DetailViewPopover : null,
	
	_TableCellHeight : 34,
	_OtherHeight : 380,
	_vRecordCount : 0,
	
	_vListLength : 0,
	_vActionCount : 0,
	
	_vActiveTabNames : null,	
	
	_vRehireCount : 0,
	_ODialogPopup_RehireDataSelect : null,
	oBusyIndicator : new sap.m.BusyIndicator({
		text : oBundleText.getText("MSG_PLEASE_WAIT") ,
		customIcon : "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/progress.gif",
		customIconWidth : "40px",
		customIconHeight : "40px"
	}),
	
	BusyDialog : null,
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actapp2.ActRecDocument
*/
	onInit: function() {
		//if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
	    //};
	      
	    this.getView().addEventDelegate({
				onBeforeShow : jQuery.proxy(function (evt) {
					//this.onBeforeShow(evt);
				}, this),
				onBeforeHide : jQuery.proxy(function (evt) {
				}, this),
				onBeforeFirstShow : jQuery.proxy(function (evt) {
				}, this),
				onAfterShow  : jQuery.proxy(function (evt) {
					this.onBeforeShow(evt);
				}, this),
				onAfterHide : jQuery.proxy(function (evt) {
					this.onAfterHide(evt);
				}, this)
		}); 
	      
	    sap.ui.getCore().getEventBus().subscribe("app", "ResizeWindow", this.onResizeWindow, this);
	    
	    var vTableHeight = window.innerHeight - this._OtherHeight;
		this._vRecordCount = parseInt(vTableHeight / this._TableCellHeight);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_actapp2.ActRecDocument
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actapp2.ActRecDocument
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actapp2.ActRecDocument
*/
//	onExit: function() {
//
//	}
	onBeforeShow: function(oEvent) {		
		var oController = this;
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		if(oEvent) {
			this._vStatu = oEvent.data.Statu;
			this._vReqno = oEvent.data.Reqno;
			this._vDocno = oEvent.data.Docno;
			this._vDocty = oEvent.data.Docty;
			this._vEntrs = oEvent.data.Entrs;
			this._oContext = oEvent.data.context;
			this._vSelectedPersa = oEvent.data.SelectedPersa;
			var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
			var oOrgeh = sap.ui.getCore().byId(this.PAGEID + "_Orgeh");
			var oReqno = sap.ui.getCore().byId(this.PAGEID + "_Reqno");
			var oTitle = sap.ui.getCore().byId(this.PAGEID + "_Title");
			var oActda = sap.ui.getCore().byId(this.PAGEID + "_Actda");
			var oReqda = sap.ui.getCore().byId(this.PAGEID + "_Reqda");
			var oNotes = sap.ui.getCore().byId(this.PAGEID + "_Notes");
			var oPvdoc = sap.ui.getCore().byId(this.PAGEID + "_Pvdoc");
			
			var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");	
			
			var oPersaModel = sap.ui.getCore().getModel("PersaModel");
			var vPersaData = oPersaModel.getProperty("/PersAreaListSet");
			
			//신규작성인 경우
			if(this._vStatu == "00") {
				oPersa.removeAllItems();
				oOrgeh.removeAllItems();
				
				var vFirstReqno = "";
				var vFirstOrgeh = "";
				var s_idx = 0;
				for(var i=0; i<vPersaData.length; i++) {
					oPersa.addItem( 
						new sap.ui.core.Item({
							key : vPersaData[i].Persa, 
							text : vPersaData[i].Compatx,
							customData : [{key : "Molga", value : vPersaData[i].Molga}, {key : "Intca", value : vPersaData[i].Intca}]
						})
					);
					
					if(vPersaData[i].Persa == oController._vSelectedPersa) {
						s_idx = i;
					}	
				};
				
				this._vPersa = vPersaData[s_idx].Persa;
				this._vMolga = vPersaData[s_idx].Molga;
				this._vIntca = vPersaData[s_idx].Intca;					
				oPersa.setSelectedKey(this._vPersa);
					
				oModel.read("/AppReqDepListSet/?$filter=Persa%20eq%20%27" + this._vPersa + "%27", 
						null, 
						null, 
						false, 
						function(oData, oResponse) {					
							if(oData.results && oData.results.length) {
								for(var i=0; i<oData.results.length; i++) {
									if(i == 0) {
										vFirstReqno = oData.results[i].Reqno;
										vFirstOrgeh = oData.results[i].Orgeh;
									}
									oOrgeh.addItem(
											new sap.ui.core.Item({
												key : oData.results[i].Orgeh, 
												text : oData.results[i].Orgtx,
										        customData : [{key : "Reqno", value : oData.results[i].Reqno}]}
											)
									);
								}
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
				);
				oOrgeh.setSelectedKey(vFirstOrgeh);
				oReqno.setValue(vFirstReqno);
				
				oTitle.setValue("");
				oNotes.setValue("");
				oTitle.setValueState(sap.ui.core.ValueState.None);
				oReqno.setValueState(sap.ui.core.ValueState.None);
				oActda.setValueState(sap.ui.core.ValueState.None);
				oReqda.setValueState(sap.ui.core.ValueState.None);
				
				oActda.setValue(dateFormat.format(new Date()));
				oReqda.setValue(dateFormat.format(new Date()));
				
				oPersa.setEnabled(true);
				oOrgeh.setEnabled(true);
				oReqno.setEnabled(true);
				
				oPvdoc.setSelected(true);
				
			} else if(this._vStatu == "10") { //작성중인 경우
				var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
				
				oPersa.removeAllItems();
				oOrgeh.removeAllItems();
				
				var vFirstPersa = mActionReqList.getProperty(this._oContext + "/Persa");
				var vFirstReqno = mActionReqList.getProperty(this._oContext + "/Reqno");
				var vFirstOrgeh = mActionReqList.getProperty(this._oContext + "/Orgeh");
				var vFirstReqdp = mActionReqList.getProperty(this._oContext + "/Reqdp");
				
				var isExists = false;
				for(var i=0; i<vPersaData.length; i++) {
					oPersa.addItem(
						new sap.ui.core.Item({
							key : vPersaData[i].Persa, 
							text : vPersaData[i].Compatx,
							customData : [{key : "Molga", value : vPersaData[i].Molga}, {key : "Intca", value : vPersaData[i].Intca}]
						})
					);
					
					if(vFirstPersa == vPersaData[i].Persa) {
						oController._vMolga = vPersaData[i].Molga;
						oController._vIntca = vPersaData[i].Intca;
						isExists = true;
					}
				};
				if(isExists == false) {
					sap.m.MessageBox.alert("The action approval without permission.");
					oController.navToBack();
					return;
				}
				oPersa.setSelectedKey(vFirstPersa);
				this._vPersa = vFirstPersa;
				
				var isExistsOrgeh = false;
				oModel.read("/AppReqDepListSet/?$filter=Persa%20eq%20%27" + vFirstPersa + "%27", 
						null, 
						null, 
						false, 
						function(oData, oResponse) {					
							if(oData.results && oData.results.length) {
								for(var i=0; i<oData.results.length; i++) {
									//--------------------------------------
									if(vFirstOrgeh == oData.results[i].Orgeh) {
										isExistsOrgeh = true;
									}
									//--------------------------------------
									oOrgeh.addItem(
											new sap.ui.core.Item({
												key : oData.results[i].Orgeh, 
												text : oData.results[i].Orgtx,
										        customData : [{key : "Reqno", value : oData.results[i].Reqno}]}
											)
									);
								}
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
				);
				
				if(!isExistsOrgeh) {
					oOrgeh.addItem(
							new sap.ui.core.Item({
								key : vFirstOrgeh, 
								text : vFirstReqdp,
						        customData : [{key : "Reqno", value : vFirstReqno}]}
							)
					);
				}
				oOrgeh.setSelectedKey(vFirstOrgeh);
				oReqno.setValue(vFirstReqno);
				
				oTitle.setValue(mActionReqList.getProperty(this._oContext + "/Title"));
				oTitle.setValueState(sap.ui.core.ValueState.None);
				oReqno.setValueState(sap.ui.core.ValueState.None);
				oActda.setValueState(sap.ui.core.ValueState.None);
				oReqda.setValueState(sap.ui.core.ValueState.None);
				
				oNotes.setValue(mActionReqList.getProperty(this._oContext + "/Notes"));
				oActda.setValue(dateFormat.format(mActionReqList.getProperty(this._oContext + "/Actda")));
				oReqda.setValue(dateFormat.format(mActionReqList.getProperty(this._oContext + "/Reqda")));
				
				oPvdoc.setSelected(mActionReqList.getProperty(this._oContext + "/Pvdoc") == "X" ? true : false);
				
				oPersa.setEnabled(false);
				oOrgeh.setEnabled(false);
				oReqno.setEnabled(true);
				
				this._vActda = dateFormat.format(mActionReqList.getProperty(this._oContext + "/Actda"));
			}
			
			this._vActiveTabNames = [];			
			oModel.read("/HiringFormTabInfoSet?$filter=Molga eq '" + this._vMolga + "'",
				null,
				null,
				false, 	
				function(oData, oResponse) {	
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							oController._vActiveTabNames.push(oData.results[i]);
						}
					};
				},
				function(oResponse) {
					console.log(oResponse);
				}		
			);
			
			this.reloadSubjectList(this);
			
			//Control제어
			var oComplete_Btn = sap.ui.getCore().byId(this.PAGEID + "_COMPLETE_BTN");
			var oRequsetDelete_Btn = sap.ui.getCore().byId(this.PAGEID + "_REQUESTDELETE_BTN");
			var oUpload_Btn = sap.ui.getCore().byId(this.PAGEID + "_UPLOAD_BTN");
			var oRequset_Btn = sap.ui.getCore().byId(this.PAGEID + "_REQUEST_BTN");
			var oAdd_Btn = sap.ui.getCore().byId(this.PAGEID + "_Add_Btn");
			var oMod_Btn = sap.ui.getCore().byId(this.PAGEID + "_Mod_Btn");
			var oDel_Btn = sap.ui.getCore().byId(this.PAGEID + "_Del_Btn");
			var oAddRec_Btn = sap.ui.getCore().byId(this.PAGEID + "_Add_Rec_Btn");
			var oModRec_Btn = sap.ui.getCore().byId(this.PAGEID + "_Mod_Rec_Btn");
			var oViewRec_Btn = sap.ui.getCore().byId(this.PAGEID + "_View_Rec_Btn");
			var oSyncRec_Btn = sap.ui.getCore().byId(this.PAGEID + "_Sync_Rec_Btn");
			var oSyncToolbar = sap.ui.getCore().byId(this.PAGEID + "_SyncToolbar");
			var oExcel_Btn = sap.ui.getCore().byId(this.PAGEID + "_Excel_Btn");
	
			//신규작성인 경우
			if(this._vStatu == "00") {				
				oAdd_Btn.setVisible(false);
				oMod_Btn.setVisible(false);
				oDel_Btn.setVisible(false);
				oAddRec_Btn.setVisible(false);
				oModRec_Btn.setVisible(false);
				oViewRec_Btn.setVisible(false);
				oSyncRec_Btn.setVisible(false);
				oSyncToolbar.setVisible(false);
				oRequset_Btn.setVisible(false);
				oComplete_Btn.setVisible(false);
				oRequsetDelete_Btn.setVisible(false);
				oUpload_Btn.setVisible(false);
				oExcel_Btn.setVisible(false);
			} else if(this._vStatu == "10") {
				oAddRec_Btn.setVisible(true);
				oRequsetDelete_Btn.setVisible(true);
				/*
				 * 20170109 SF 추가
				 */
//				oController.setRecActVisible(oController);
			}
		}
	},
	/*
	 * 20170109 SF 추가
	 */
//	setRecActVisible : function(oController){
//		var oRecAct_Btn = sap.ui.getCore().byId(oController.PAGEID + "_RECACT_BTN");
//		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
//		var oSFModel = sap.ui.getCore().getModel("ZSFXX_ONBAPP_SRV");
//		var oPath = "/TransVisibilitySet";
//		    oPath+= "(Persa='" + oController._vPersa + "',";
//		    oPath+= "Sdate=datetime%27" + oActda.getValue() + "T00%3a00%3a00%27)";
//  		
//	    oSFModel.read(oPath,
//				null, 
//				null, 
//				false, 
//				function(oData, oResponse) {					
//					if(oData && oData.TransVisible == "X"){
//						oRecAct_Btn.setVisible(true);
//					}else{
//						oRecAct_Btn.setVisible(false);
//					}
//				},
//				function(oResponse) {
//					common.Common.log(oResponse);
//				}
//		);
//	},
	
	/*
	 * 20170109 SF Dialog Open
	 */
//	_ODialogPopup_RecActionDialog : null,
//	
//	onOpenRecActionDialog : function(oEvent){
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
//		var oController = oView.getController();
//		
//		if(!oController._ODialogPopup_RecActionDialog) {
//			oController._ODialogPopup_RecActionDialog = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.SelectRecruiting", oController);
//			oView.addDependent(oController._ODialogPopup_RecActionDialog);
//		}
//		oController._ODialogPopup_RecActionDialog.open();
//	},
//	
//	onBeforeOpenRecActionDialog : function(oEvent){
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
//		var oController = oView.getController();
//		
//		oController.setSubPersa(oController);
//		oController.setRecYy(oController);
//	},
//	
//	setSubPersa : function(oController){
//		var oSubPersa = sap.ui.getCore().byId(oController.PAGEID + "_RecSelect_SubPersa");
//		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
//		oSubPersa.removeAllItems();
//		oSubPersa.addItem(new sap.ui.core.Item({key : "", text : oBundleText.getText("ALL_ENTRY")}));	
//		var oPath = "/PersSubareaListSet/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
//		oCommonModel.read(oPath,
//				null, 
//				null, 
//				false, 
//				function(oData, oResponse) {					
//					if(oData.results && oData.results.length) {
//						for(var i=0; i<oData.results.length; i++) {
//							oSubPersa.addItem(new sap.ui.core.Item({key : oData.results[i].Btrtl, text : oData.results[i].Btext}));	
//						}
//					}
//				},
//				function(oResponse) {
//					common.Common.log(oResponse);
//				}
//		);
//	},
//	
//	setRecYy : function(oController){
//		var oRecYy = sap.ui.getCore().byId(oController.PAGEID + "_RecSelect_RecYy"); 
//		var oSFModel = sap.ui.getCore().getModel("ZSFXX_ONBAPP_SRV");
//		var filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
//		
//		oSFModel.read("/SFRecruitingYearSet" + filterString,
//				null, 
//				null, 
//				false, 
//				function(oData, oResponse) {					
//					if(oData.results && oData.results.length) {
//						oRecYy.removeAllItems();
//						for(var i=0; i<oData.results.length; i++) {
//							oRecYy.addItem(new sap.ui.core.Item({key : oData.results[i].RecYy, text : oData.results[i].RecYy}));	
//						}
//						var curDate = new Date();
//						var curYy = curDate.getFullYear();
//						oRecYy.setSelectedKey(curYy);
//					}
//				},
//				function(oResponse) {
//					common.Common.log(oResponse);
//				}
//		);
////		oRecYy.removeAllItems();
////		var curDate = new Date();
////		var curYy = curDate.getFullYear();
////		for(var i = curYy; i > 1999; i--) {
////			oRecYy.addItem(
////				new sap.ui.core.Item({
////					key : i, 
////					text : i
////				})
////			);
////			oRecYy.setSelectedKey(curYy);
////		}
//	},
//	
//	getSFRecList : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
//		var oController = oView.getController();
//		
//		var searchFunction = function() {
//		
//			var mSFRecruitingInterface = sap.ui.getCore().getModel("SFRecruitingInterface");
//			var vSFRecruitingInterface = { SFRecruitingInterfaceSet : []};
//			
//			var readAfterProcess = function() {
//				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_RecSelect_TABLE");
//				var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_RecSelect_COLUMNLIST");
//				oTable.setModel(mSFRecruitingInterface);
//				oTable.bindItems("/SFRecruitingInterfaceSet", oColumnList);
//	
//				var oBinding = oTable.getBinding("items");
//				oBinding.filter([]);
//	
//			    if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
//					oController.BusyDialog.close();
//				};
//			};
//			
//			var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
//			var oSubPersa = sap.ui.getCore().byId(oController.PAGEID + "_RecSelect_SubPersa");
//			var oRecYy = sap.ui.getCore().byId(oController.PAGEID + "_RecSelect_RecYy");
//			var oRecNm = sap.ui.getCore().byId(oController.PAGEID + "_RecSelect_RecNm");
//			var oRecTypeCd = sap.ui.getCore().byId(oController.PAGEID + "_RecSelect_RecTypeCd"); 
//			
//			var oPath = "/SFRecruitingInterfaceSet/?$filter=" ;
//			    oPath += "Persa eq '" + oPersa.getSelectedKey() + "' and " ;
//			    oPath += "Btrtl eq '" + oSubPersa.getSelectedKey() + "' and " ;
//			    oPath += "RecYy eq '" + oRecYy.getSelectedKey() + "' and " ;
//			    oPath += "RecNm eq '" + oRecNm.getValue() + "' and " ;
//				oPath += "RecTypeCd eq '" + oRecTypeCd.getValue() + "'";
////			    
////		    oPath += "Persa eq '" + "" + "' and " ;
////		    oPath += "Btrtl eq '" + "" + "' and " ;
////		    oPath += "RecYy eq '" + "" + "' and " ;
////		    oPath += "RecNm eq '" + "" + "'" ;
//		    
//		    
//			var oSFModel = sap.ui.getCore().getModel("ZSFXX_ONBAPP_SRV");
//			oSFModel.read(oPath,
//						null, 
//						null, 
//						true,
//						function(oData, oResponse) {
//							if(oData && oData.results) {
//								for(var i=0; i<oData.results.length; i++) {
//									vSFRecruitingInterface.SFRecruitingInterfaceSet.push(oData.results[i]);
//								}
//								mSFRecruitingInterface.setData(vSFRecruitingInterface);
//								readAfterProcess();
//							}
//						},
//						function(oResponse) {
//							common.Common.log(oResponse);
//							if(oController.BusyDialog  && oController.BusyDialog.isOpen()) {
//								oController.BusyDialog.close();
//							};
//						}
//			);
//		};
//		
//		if(oController.BusyDialog) {
//			oController.BusyDialog.removeAllContent();
//			oController.BusyDialog.destroyContent();
//			oController.BusyDialog.addContent(oController.oBusyIndicator);
//		} else {
//			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
//			oController.BusyDialog.addContent(oController.oBusyIndicator);
//			oController.getView().addDependent(oController.BusyDialog);
//		}
//		if(!oController.BusyDialog.isOpen()) {
//			oController.BusyDialog.open();
//		}
//		
//		setTimeout(searchFunction, 300);
//	},
//	
//	onSelectSFRecAction : function(oEvent){
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
//		var oController = oView.getController();
//	
//		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_RecSelect_TABLE");
//		var oContext = oTable.getSelectedContexts();
//		
//		var interfaceFunction = function(fVal) {
//			var oneData = {};
//			oneData.Docno     = oController._vDocno;
//			oneData.RecTypeCd = oContext[0].getProperty("RecTypeCd");
//			
//			var process_result = false;
//			var oModel = sap.ui.getCore().getModel("ZSFXX_ONBAPP_SRV");
//	
//			console.log(oneData);
//			oModel.create(
//					"/SFRecruitingInterfaceSet", 
//					oneData, 
//					null,
//				    function (oData, response) {
//						if(oData) {
//							
//						}
//						process_result = true;
//				    },
//				    function (oError) {
//				    	var Err = {};
//						if (oError.response) {
//							Err = window.JSON.parse(oError.response.body);
//							if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
//								common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
//							} else {
//								common.Common.showErrorMessage(Err.error.message.value);
//							}
//							
//						} else {
//							common.Common.showErrorMessage(oError);
//						}
//						process_result = false;
//				    }
//		    );
//			
//			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
//				oController.BusyDialog.close();
//			};
//			
//			if(process_result) {
//				sap.m.MessageBox.alert(oBundleText.getText("MSG_RECINTERFACE"), {
//					title: oBundleText.getText("MSG_TITLE_GUIDE"),
//					onClose : function() {
//						oController.closeSFRecAction();
////						oController.setRecSubjectListColumn(oController);
//						oController.reloadSubjectList(oController);
//					}
//				});
//			}
//		};
//		
//		var preAction = function(fVal) {
//			if(fVal && fVal == "OK") {
//				if(oContext.length == 0) {
//					sap.m.MessageBox.alert(oBundleText.getText("MSG_RECINTERFACE_TARGET"));
//					return;
//				};
//				if(oController.BusyDialog) {
//					oController.BusyDialog.removeAllContent();
//					oController.BusyDialog.destroyContent();
//					oController.BusyDialog.addContent(oController.oBusyIndicator);
//				} else {
//					oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
//					oController.BusyDialog.addContent(oController.oBusyIndicator);
//					oController.getView().addDependent(oController.BusyDialog);
//				}
//				if(!oController.BusyDialog.isOpen()) {
//					oController.BusyDialog.open();
//				}
//				
//				setTimeout(interfaceFunction, 300);
//			}
//		};
//		
//		sap.m.MessageBox.confirm(oBundleText.getText("MSG_RECINTERFACE_CONFIRM"), {
//			title : oBundleText.getText("CONFIRM_BTN"),
//			onClose : preAction
//		});
//		
//	},
//	
//	closeSFRecAction : function(oEvent){
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
//		var oController = oView.getController();
//		var mSFRecruitingInterface = sap.ui.getCore().getModel("SFRecruitingInterface");
//		var vSFRecruitingInterface = { SFRecruitingInterfaceSet : []};
//		mSFRecruitingInterface.setData(vSFRecruitingInterface);
//		
//		if(oController._ODialogPopup_RecActionDialog && oController._ODialogPopup_RecActionDialog.isOpen()) {
//			oController._ODialogPopup_RecActionDialog.close();
//		};
//		
//	},
	
	onAfterHide : function(oEvent) {
		if(typeof ActRecDocumentSubject == "object") {
			ActRecDocumentSubject.Reset();
		}
	},
	
	reloadSubjectList : function(oController) {
		
		oController.setRecSubjectListColumn(oController);
		
		var oAdd_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Add_Btn");
		var oMod_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Mod_Btn");
		var oDel_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Del_Btn");
		var oAddRec_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Add_Rec_Btn");
		var oModRec_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Mod_Rec_Btn");
		var oViewRec_Btn = sap.ui.getCore().byId(oController.PAGEID + "_View_Rec_Btn");
		var oSyncRec_Btn = sap.ui.getCore().byId(this.PAGEID + "_Sync_Rec_Btn");
		
		var oSyncToolbar = sap.ui.getCore().byId(this.PAGEID + "_SyncToolbar");
		var oRequset_Btn = sap.ui.getCore().byId(oController.PAGEID + "_REQUEST_BTN");
		var oComplete_Btn = sap.ui.getCore().byId(oController.PAGEID + "_COMPLETE_BTN");
		var oUpload_Btn = sap.ui.getCore().byId(oController.PAGEID + "_UPLOAD_BTN");
		var oExcel_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Excel_Btn");
		
		if(oController._vListLength > 0) {				
			oAddRec_Btn.setVisible(true);
			oModRec_Btn.setVisible(true);
			oViewRec_Btn.setVisible(true);
			
			if(oController._vRehireCount > 0) {
				oSyncToolbar.setVisible(true);
				oSyncRec_Btn.setVisible(true);
			} else {
				oSyncRec_Btn.setVisible(false);
				oSyncToolbar.setVisible(false);
			}
			oRequset_Btn.setVisible(true);
			oAdd_Btn.setVisible(true);
			oMod_Btn.setVisible(true);		
			oDel_Btn.setVisible(true);
			oExcel_Btn.setVisible(true);
			if(oController._vActionCount > 0 ) {
				oComplete_Btn.setVisible(true);
			} else {
				oComplete_Btn.setVisible(false);
			}
			oUpload_Btn.setVisible(false);
		} else {
			oAddRec_Btn.setVisible(true);
			oModRec_Btn.setVisible(false);
			oViewRec_Btn.setVisible(false);
			oSyncRec_Btn.setVisible(false);
			
			oAdd_Btn.setVisible(false);
			oMod_Btn.setVisible(false);
			oDel_Btn.setVisible(false);
			oRequset_Btn.setVisible(false);
			oExcel_Btn.setVisible(false);
			
			oComplete_Btn.setVisible(false);
			oUpload_Btn.setVisible(true);
		}
		
		var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
		var vEApprovalYN = mActionReqList.getProperty(oController._oContext + "/Eapprovalyn");
		
		// EApprovalYN 가 X 인 경우에만 결재상신 버튼 활성화
		if(vEApprovalYN != "X") oRequset_Btn.setVisible(false); 
	},
	
	navToBack : function(oEvent){
		sap.ui.getCore().getEventBus().publish("nav", "back", {
		    });		
	},
	 
	addPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var filterString = ""; //"/?$filter=Reqno%20eq%20%27" + encodeURI(oController._vReqno) + "%27";
		filterString += "/?$filter=Docno%20eq%20%27" + oController._vDocno + "%27";
		
		var vActionCount = 0;
		
		oModel.read("/ActionSubjectListSet"  + filterString, 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							if(oData.results[i].Batyp == "A" && oData.results[i].Massn1 == "") {
								vActionCount++;
							}
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		if(vActionCount < 1) {
			sap.m.MessageBox.alert(oBundleText.getText( "MSG_REC_NOT"), {
//				onClose : function() {
//					oController.navToBack();
//					return;
//				}
			});
			return;
		}
		
		// 발령등록 대상자 여부 체크 넣어랏....
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp2.ActAppPersonInfo",
		      data : {
		    	 actiontype : "300",
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Entrs : oController._vEntrs,
		    	 Actda : oController._vActda,
		    	 Molga : oController._vMolga,
		    	 Intca : oController._vIntca,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp2.ActRecDocument",
		      }
		});
	},
	
	modifyPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectListSet = oModel.getProperty("/ActionSubjectListSet");
		
		var check_idxs = [];
		if(vActionSubjectListSet && vActionSubjectListSet.length) {
			for(var i=0; i<vActionSubjectListSet.length; i++) {
				if(vActionSubjectListSet[i].Pchk == true) {
					check_idxs.push(i);
				}
			}
		}
		
		if(check_idxs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_UPDATE_TARGET"));
			return;
		}
		
		if(check_idxs.length != 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_WARN_UPDATE"));
			return;
		}
		
		if(vActionSubjectListSet[check_idxs[0]].Cfmyn == "X") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_ACTION2"));
			return;
		}
		
		var vSelectedMassn1 = vActionSubjectListSet[check_idxs[0]].Massn1;
		if(vSelectedMassn1 == "") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_ACTION1"));
			return;
		}
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp2.ActAppPersonInfo",
		      data : {
		    	 actiontype : "200",
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 Molga : oController._vMolga,
		    	 Intca : oController._vIntca,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp2.ActRecDocument",
		    	 Pernr : vActionSubjectListSet[check_idxs[0]].Pernr,
		    	 PernrActda : vActionSubjectListSet[check_idxs[0]].Actda,
		    	 PernrVoltId : vActionSubjectListSet[check_idxs[0]].VoltId,
		      }
		});		
	},
	
	deletePerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var mSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectListSet = mSubjectList.getProperty("/ActionSubjectListSet");
		
		var check_idxs = [];
		if(vActionSubjectListSet && vActionSubjectListSet.length) {
			for(var i=0; i<vActionSubjectListSet.length; i++) {
				if(vActionSubjectListSet[i].Pchk == true) {
					check_idxs.push(i);
				}
			}
		}
		
		if(check_idxs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_TARGET"));
			return;
		}
		
		var onProcessDelete = function(fVal) {
			if(fVal && fVal == "OK") {
				var process_result = false;
				
				for(var i=0; i<check_idxs.length; i++) {
					
					if(vActionSubjectListSet[check_idxs[i]].Cfmyn == "X") {
						sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_ACTION2"));
						return;
					}
					
					process_result = false;
					
					var oPath = "/ActionSubjectListSet(Docno='" + oController._vDocno + "',"
			                  + "Pernr='" +  vActionSubjectListSet[check_idxs[i]].Pernr + "',"
			                  + "VoltId='" +  vActionSubjectListSet[check_idxs[i]].VoltId + "',"
			                  + "Actda=" +  "datetime%27" + dateFormat.format(new Date(vActionSubjectListSet[check_idxs[i]].Actda)) + "T00%3a00%3a00%27" + ")";

					oModel.remove(
						oPath, 
						null,
					    function (oData, response) {
							process_result = true;
							common.Common.log("Sucess ActionSubjectListSet Delete !!!");
					    },
					    function (oError) {
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
				
				sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
					title : oBundleText.getText("INFORMATION"),
					onClose : function() {
						oController.reloadSubjectList(oController);
					}
				});	
			}
		};
		
		sap.m.MessageBox.confirm(oBundleText.getText("MSG_DELETE_CONFIRM"), {
			title : oBundleText.getText("CONFIRM_BTN"),
			onClose : onProcessDelete
		});
	},
	
	onChangePersa : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		var oPersa = oEvent.getSource();
		var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");
		var oReqno = sap.ui.getCore().byId(oController.PAGEID + "_Reqno");
		var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_Title");
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		var oReqda = sap.ui.getCore().byId(oController.PAGEID + "_Reqda");
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var vItem = oPersa.getSelectedItem();
		if(vItem) {
			var vPersa = vItem.getKey();
			
			oController._vPersa = vPersa;
			
			oOrgeh.removeAllItems();
			
			var vFirstReqno = "";
			var vFirstOrgeh = "";
			
			oModel.read("/AppReqDepListSet/?$filter=Persa%20eq%20%27" + vPersa + "%27", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData.results && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								if(i == 0) {
									vFirstReqno = oData.results[i].Reqno;
									vFirstOrgeh = oData.results[i].Orgeh;
								}
								oOrgeh.addItem(
										new sap.ui.core.Item({
											key : oData.results[i].Orgeh, 
											text : oData.results[i].Orgtx,
									        customData : [{key : "Reqno", value : oData.results[i].Reqno}]}
										)
								);
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
			oOrgeh.setSelectedKey(vFirstOrgeh);
			oReqno.setValue(vFirstReqno);
			
			oReqno.setValueState(sap.ui.core.ValueState.None);
			oTitle.setValueState(sap.ui.core.ValueState.None);
			oActda.setValueState(sap.ui.core.ValueState.None);
			oReqda.setValueState(sap.ui.core.ValueState.None);
			
			oController._vMolga = vItem.getCustomData()[0].getValue("Molga");
			oController._vIntca = vItem.getCustomData()[1].getValue("Intca");
		}
		
	},
	
	onChangeOrgeh : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		var oOrgeh = oEvent.getSource();
		var oReqno = sap.ui.getCore().byId(oController.PAGEID + "_Reqno");
		oReqno.setValue("");
		
		var vOrgehItem = oOrgeh.getSelectedItem();
		if(vOrgehItem) {
			var oCustomDataList = vOrgehItem.getCustomData();
			if(oCustomDataList) { 
				for(var i=0; i<oCustomDataList.length; i++) {
					if(oCustomDataList[i].getKey() == "Reqno") {
						oReqno.setValue(oCustomDataList[i].getValue());
					}
				}
			}
		}
	},
	
	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");
		var oReqno = sap.ui.getCore().byId(oController.PAGEID + "_Reqno");
		var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_Title");
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		var oReqda = sap.ui.getCore().byId(oController.PAGEID + "_Reqda");
		var oNotes = sap.ui.getCore().byId(oController.PAGEID + "_Notes");
		var oPvdoc = sap.ui.getCore().byId(oController.PAGEID + "_Pvdoc");
		
		oReqno.setValueState(sap.ui.core.ValueState.None);
		oTitle.setValueState(sap.ui.core.ValueState.None);
		oActda.setValueState(sap.ui.core.ValueState.None);
		oReqda.setValueState(sap.ui.core.ValueState.None);
		
		var oAddRec_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Add_Rec_Btn");
		var oUpload_Btn = sap.ui.getCore().byId(oController.PAGEID + "_UPLOAD_BTN");
//		var oRecAct_Btn = sap.ui.getCore().byId(oController.PAGEID + "_RECACT_BTN");
//		oRecAct_Btn.setVisible(false);	
		var oRequsetDelete_Btn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		
		if(oReqno.getValue() == "") {
			oReqno.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_REQNO"));
			return;
		}
		
		if(oTitle.getValue() == "") {
			oTitle.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_TITLE"));
			return;
		}
		
		if(oActda.getValue() == "") {
			oActda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_ACTDA"));
			return;
		}
		
		if(oReqda.getValue() == "") {
			oReqda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_REQDA"));
			return;
		}
		
		var updateData = {};
		var vEapprovalyn = "";
		updateData.Persa = oPersa.getSelectedKey();;
		updateData.Orgeh = oOrgeh.getSelectedKey();
		updateData.Reqno = oReqno.getValue();
		updateData.Title = oTitle.getValue();
		
		updateData.Actda = "\/Date(" + common.Common.getTime(oActda.getValue()) + ")\/";
		updateData.Reqda = "\/Date(" + common.Common.getTime(oReqda.getValue()) + ")\/";
		
		updateData.Notes = oNotes.getValue();
		
		if(oPvdoc.getSelected() == true) updateData.Pvdoc = "X";
		else updateData.Pvdoc = "";
		
		updateData.Docty = oController._vDocty;
		
		var oPath = "/ActionReqListSet";
		var process_result = false;
		
		if(oController._vStatu == "00") {
			oModel.create(
					oPath, 
					updateData, 
					null,
				    function (oData, response) {
						if(oData) {
							oController._vDocno = oData.Docno;
							vEapprovalyn = oData.Eapprovalyn;
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
		} else if(oController._vStatu == "10") {
			updateData.Docno = oController._vDocno;
			
			oPath = "/ActionReqListSet(Docno='" + oController._vDocno + "')";
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
		
		if(process_result) {
			if(oController._vStatu == "00") {
				oController._vStatu = "10";
				
				var insertData = {};
				
				insertData.Persa = oPersa.getSelectedKey();;
				insertData.Orgeh = oOrgeh.getSelectedKey();
				insertData.Reqno = oReqno.getValue();
				insertData.Title = oTitle.getValue();				
				insertData.Actda = new Date(common.Common.setTime(new Date(oActda.getValue())));
				insertData.Reqda = new Date(common.Common.setTime(new Date(oReqda.getValue())));			
				insertData.Notes = oNotes.getValue();
				insertData.Pvdoc = oPvdoc.getSelected() == true ? "X" : "";
				insertData.Statu = "10";
				
				var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
				var vActionReqListSet = mActionReqList.getProperty("/ActionReqListSet");
				var vActionReqList = {ActionReqListSet : []};
				for(var i=0; i<vActionReqListSet.length; i++) {
					vActionReqList.ActionReqListSet.push(vActionReqListSet[i]);
				}
				vActionReqList.ActionReqListSet.push(insertData);
				oController._oContext = "/ActionReqListSet/" + vActionReqListSet.length;
				mActionReqList.setData(vActionReqList);
				mActionReqList.setProperty(oController._oContext + "/Eapprovalyn", vEapprovalyn);
			} else {
				var mActionReqList = sap.ui.getCore().getModel("ActionReqList");
				mActionReqList.setProperty(oController._oContext + "/Title", oTitle.getValue());
				mActionReqList.setProperty(oController._oContext + "/Actda", new Date(common.Common.setTime(new Date(oActda.getValue()))));
				mActionReqList.setProperty(oController._oContext + "/Reqda", new Date(common.Common.setTime(new Date(oReqda.getValue()))));
				mActionReqList.setProperty(oController._oContext + "/Notes", oNotes.getValue());
			}
			
			oController._vReqno = oReqno.getValue();
			
			oController._vActda = oActda.getValue();
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
				title: oBundleText.getText("INFORMATION"),
				onClose : function() {
					oPersa.setEnabled(false);
					oOrgeh.setEnabled(false);
					oReqno.setEnabled(false);
					
					oTitle.setValueState(sap.ui.core.ValueState.None);
					oReqno.setValueState(sap.ui.core.ValueState.None);
					oActda.setValueState(sap.ui.core.ValueState.None);
					oReqda.setValueState(sap.ui.core.ValueState.None);
					
					oAddRec_Btn.setVisible(true);
					oRequsetDelete_Btn.setVisible(true);
					if(oController._vListLength > 0) {
						oUpload_Btn.setVisible(false);
					} else {
						oUpload_Btn.setVisible(true);
					}
					/*
					 * 20170109 SF 추가
					 */
//					oController.setRecActVisible(oController);
					
				}
			});
		} else {
			oTitle.setValueState(sap.ui.core.ValueState.None);
			oReqno.setValueState(sap.ui.core.ValueState.None);
			oActda.setValueState(sap.ui.core.ValueState.None);
			oReqda.setValueState(sap.ui.core.ValueState.None);
		}
	},
	
	onPressDelete : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		var onProcessDelete = function(fVal) {
			if(fVal && fVal == "OK") {
				var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
				
				var oPath = "/ActionReqListSet('" + oController._vDocno + "')";
				var process_result = false;
				oModel.remove(
						oPath, 
						null,
					    function (oData, response) {
							process_result = true;
							common.Common.log("Sucess ActionReqListSet Delete !!!");
					    },
					    function (oError) {
					    	var Err = {};
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
							} else {
								common.Common.showErrorMessage(oError);
							}
							process_result = false;
					    }
			    );
				
				if(process_result) {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
						title: oBundleText.getText("INFORMATION"),
						onClose : function() {
							sap.ui.getCore().getEventBus().publish("nav", "to", {
							      id : "zui5_hrxx_actapp2.ActAppMain",
							      data : {     
							      }
							});
						}
					});
				}
			}
		};
		
		sap.m.MessageBox.confirm(oBundleText.getText("MSG_DELETE_CONFIRM"), {
			title : oBundleText.getText("CONFIRM_BTN"),
			onClose : onProcessDelete
		});
	},
	
	onPressComplete : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");
		var vCfmynCount = 0;
		// 발령확정 자를 제외 한 지원자 수.
		if(vActionSubjectList && vActionSubjectList.length){
			for(var i=0; i<vActionSubjectList.length;i++){
				if(vActionSubjectList[i].Cfmyn != "X"){
					vCfmynCount++;
				}
			}
		}
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp2.ActAppComplete",
		      data : {
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 Molga : oController._vMolga,
		    	 Intca : oController._vIntca,
		    	 context : oController._oContext,
		    	 ActRecCount : vCfmynCount,
		    	 FromPageId : "zui5_hrxx_actapp2.ActRecDocument"
		      }
		});		
	},
	
	onChangeCheckBox :function(oEvent) {
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet"); //{ActionSubjectListSet : []};
		
		var vTempData = {ActionSubjectListSet : []};
		
		if(vActionSubjectList && vActionSubjectList.length) {
			for(var i=0; i<vActionSubjectList.length; i++) {
				var Batyp = vActionSubjectList[i].Batyp;
				var oneData = vActionSubjectList[i];
				if(Batyp == "A") oneData.Pchk = oEvent.getParameter("checked");	
				vTempData.ActionSubjectListSet.push(oneData);
			}
			mActionSubjectList.setData(vTempData);
		}
	},
	
	displayDetailView : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		var oCustomData = oControl.getCustomData();
		
		oController._vSelected_Reqno = null;
		oController._vSelected_Reqno = null;
		oController._vSelected_Actda = null;
		oController._vSelected_Docno = null;
		
		if(oCustomData && oCustomData.length) {
			for(var i=0; i<oCustomData.length; i++) {
				if(oCustomData[i].getKey() == "Reqno") {
					oController._vSelected_Reqno = oCustomData[i].getValue();
				} else if(oCustomData[i].getKey() == "Pernr") {
					oController._vSelected_Pernr = oCustomData[i].getValue();
				} else if(oCustomData[i].getKey() == "Actda") {
					oController._vSelected_Actda = oCustomData[i].getValue();
				} else if(oCustomData[i].getKey() == "Docno") {
					oController._vSelected_Docno = oCustomData[i].getValue();
				}
			}
		}
		
		if(!oController._DetailViewPopover) {
			oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionRecDetailView", oController);
			oView.addDependent(oController._DetailViewPopover);
		}
		
		oController._DetailViewPopover.openBy(oControl);
	},
	
	onAfterOpenPopover : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		zui5_hrxx_actapp2.common.Common.onAfterOpenRecDetailViewPopover(oController);
	},	
	
	onPressRequest : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp2.ActAppRequest",
		      data : {
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp2.ActRecDocument"
		      }
		});		
	},
	
	onResizeWindow : function(oEvent, oEventId, data) {
		$("#" + this.PAGEID + "_SubjectList").css("height", window.innerHeight - 360);
	},
	
	addRecPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp2.ActRecPInfo",
		      data : {
		    	 actiontype : "C",
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 Molga : oController._vMolga,
		    	 Intca : oController._vIntca,
		    	 context : oController._oContext,
		    	 FromPageId : "zui5_hrxx_actapp2.ActRecDocument",
		    	 Recno : "",
		    	 VoltId : ""
		      }
		});
	},
	
	modifyRecPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectListSet = oModel.getProperty("/ActionSubjectListSet");
		
		var check_idxs = [];
		if(vActionSubjectListSet && vActionSubjectListSet.length) {
			for(var i=0; i<vActionSubjectListSet.length; i++) {
				if(vActionSubjectListSet[i].Pchk == true) {
					check_idxs.push(i);
				}
			}
		}
		
		if(check_idxs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_UPDATE_TARGET"));
			return;
		}
		
		if(check_idxs.length != 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_WARN_UPDATE"));
			return;
		}
		
		if(vActionSubjectListSet[check_idxs[0]].Cfmyn == "X") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_ACTION2"));
			return;
		}
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp2.ActRecPInfo",
		      data : {
		    	 actiontype : "M",
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 Molga : oController._vMolga,
		    	 Intca : oController._vIntca,
		    	 context : oController._oContext,
		    	 Pdata : vActionSubjectListSet[check_idxs[0]],
		    	 FromPageId : "zui5_hrxx_actapp2.ActRecDocument",
		    	 Recno : vActionSubjectListSet[check_idxs[0]].Recno,
		    	 VoltId : vActionSubjectListSet[check_idxs[0]].VoltId
		      }
		});		
	},
	
	syncRecPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectListSet = oModel.getProperty("/ActionSubjectListSet");
		
		var check_idxs = [];
		if(vActionSubjectListSet && vActionSubjectListSet.length) {
			for(var i=0; i<vActionSubjectListSet.length; i++) {
				if(vActionSubjectListSet[i].Pchk == true) {
					check_idxs.push(i);
				}
			}
		}
		
		if(check_idxs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SYNC_TARGET"));
			return;
		}
		
		if(!oController._ODialogPopup_RehireDataSelect) {
			oController._ODialogPopup_RehireDataSelect = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_Rehire_DataSelect", oController);
			oView.addDependent(oController._ODialogPopup_RehireDataSelect);
		}
		
		oController._ODialogPopup_RehireDataSelect.open();
	},
	
	onConfirmRehireDataSelect : function(oEvnet){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectListSet = mActionSubjectList.getProperty("/ActionSubjectListSet");
		
		var check_idxs = [];
		if(vActionSubjectListSet && vActionSubjectListSet.length) {
			for(var i=0; i<vActionSubjectListSet.length; i++) {
				if(vActionSubjectListSet[i].Pchk == true) {
					check_idxs.push(i);
				}
			}
		}
		
		var vSelectedTabIds = [];
		for(var t=0; t<oController._vActiveTabNames.length; t++) {
			if(oController._vActiveTabNames[t].Tabid == "01") {
				continue;
			}

			var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Rehire_Data" + oController._vActiveTabNames[t].Tabid);
			if(oControl && oControl.getSelected() == true) {
				vSelectedTabIds.push(oController._vActiveTabNames[t].Tabid)
			}
		}
		
		if(oController._ODialogPopup_RehireDataSelect.isOpen()){
			oController._ODialogPopup_RehireDataSelect.close();
		}
		
		var actionFunction = function() {
			var process_result = false;
			
			for(var i=0; i<check_idxs.length; i++) {
				
				if(vActionSubjectListSet[check_idxs[i]].Cfmyn == "X") {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_ACTION2"));
					return;
				}
				
				var vOneData = {};
				vOneData.Accty = "S";
				vOneData.Docno = vActionSubjectListSet[check_idxs[i]].Docno;
				vOneData.VoltId = vActionSubjectListSet[check_idxs[i]].VoltId;
				
				for(var t=0; t<vSelectedTabIds.length; t++) {
					eval("vOneData.Cnt" + vSelectedTabIds[t] + " = 'X';"); 
				}
				
				process_result = false;
				
				var oPath = "/RecruitingSubjectsSet";

				oModel.create(
					oPath, 
					vOneData,
					null,
				    function (oData, response) {
						process_result = true;
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
			
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {oController.BusyDialog.close();};
			
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SYNC"), {
				title : oBundleText.getText("INFORMATION"),
				onClose : function() {
					oController.reloadSubjectList(oController);
				}
			});	
		};
		
		var oBusyIndicator = new sap.m.BusyIndicator({
			text : oBundleText.getText("MSG_PLEASE_WAIT") ,
			customIcon : "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/progress.gif",
			customIconWidth : "40px",
			customIconHeight : "40px"
		});
		
		if(oController.BusyDialog) {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(oBusyIndicator);
		} else {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(oBusyIndicator);
			oController.getView().addDependent(oController.BusyDialog);
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		setTimeout(actionFunction, 300);
	},
	
	onBeforeOpenRehireDataSelect : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		var oMatrixLayout = sap.ui.getCore().byId(oController.PAGEID + "_Rehire_DataSelect_Layout");
		
		var oCell = null, oRow = null;
		
		if(oMatrixLayout) {
			for(var i=0; i<oController._vActiveTabNames.length; i++) {
				if(oController._vActiveTabNames[i].Tabid == "01") {
					continue;
				}
				
				oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		        
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [new sap.m.Label({text: oController._vActiveTabNames[i].Tabtl}).addStyleClass("L2P13Font")]
				}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
				oRow.addCell(oCell);
				
				var oControl = new sap.m.CheckBox(oController.PAGEID + "_Rehire_Data" + oController._vActiveTabNames[i].Tabid, {
					width : "95%",
					selected : false
				});
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : oControl
				}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
				oRow.addCell(oCell);

				oMatrixLayout.addRow(oRow);
			}
		}
	},
	
	onAfterCloseRehireDataSelect : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		for(var i=0; i<oController._vActiveTabNames.length; i++) {
			if(oController._vActiveTabNames[i].Tabid == "01") {
				continue;
			}
			
			var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Rehire_Data" + oController._vActiveTabNames[i].Tabid);
			if(oControl) {
				oControl.destroy();
			}
		}
		
		var oMatrixLayout = sap.ui.getCore().byId(oController.PAGEID + "_Rehire_DataSelect_Layout");
		
		if(oMatrixLayout) {
			oMatrixLayout.removeAllRows();
			oMatrixLayout.destroyRows();
			
		}
	},
	
	onCancelRehireDataSelect : function(oEvnet){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		if(oController._ODialogPopup_RehireDataSelect.isOpen()){
			oController._ODialogPopup_RehireDataSelect.close();
		}
	},	
	
	viewRecPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectListSet = oModel.getProperty("/ActionSubjectListSet");
		
		var check_idxs = [];
		if(vActionSubjectListSet && vActionSubjectListSet.length) {
			for(var i=0; i<vActionSubjectListSet.length; i++) {
				if(vActionSubjectListSet[i].Pchk == true) {
					check_idxs.push(i);
				}
			}
		}
		
		if(check_idxs.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_VIEW_TARGET"));
			return;
		}
		
		if(check_idxs.length != 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_WARN_VIEW"));
			return;
		}
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp2.ActRecPInfo",
		      data : {
		    	 actiontype : "V",
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : oController._vActda,
		    	 Molga : oController._vMolga,
		    	 Intca : oController._vIntca,
		    	 context : oController._oContext,
		    	 Pdata : vActionSubjectListSet[check_idxs[0]],
		    	 FromPageId : "zui5_hrxx_actapp2.ActRecDocument",
		    	 Recno : vActionSubjectListSet[check_idxs[0]].Recno,
		    	 VoltId : vActionSubjectListSet[check_idxs[0]].VoltId
		      }
		});		
	},
	
	onAfterRenderingTable : function(oController) {
		
		if(typeof ActRecDocumentSubject == "undefined") {
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
			createIBSheet2(document.getElementById(oController.PAGEID + "_SubjectList"), "ActRecDocumentSubject", "100%",  (window.innerHeight - 360) + "px", vLang);
		}
		
		ActRecDocumentSubject.Reset();
	},
	
	setRecSubjectListColumn : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var icon1 = "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Apply.png'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Error.png'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Lock.png'>";
		var icon4 = "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/check-icon.png";
		var icon5 = "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/Problem.png";
		oController.vDisplayControl = [];
		try {
			oModel.read("/ActionDisplayFieldSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData.results && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								oController.vDisplayControl.push(oData.results[i]);
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
		} catch(ex) {
			common.Common.log(ex);
		}
		
		var vColumns = [];
		
		vColumns.push({id : "Pchk", label : "", control : "CheckBox", width : 30, align : "Center"});
		vColumns.push({id : "Ename_Html", label : oBundleText.getText("ENAME"), control : "Html", width : "150", align: "Left"});
		vColumns.push({id : "Acttx", label : oBundleText.getText("ACTTX"), control : "Text", width : "200", align: "Left"});
		vColumns.push({id : "Actda1", label : oBundleText.getText("ACTDA"), control : "Text", width : "80", align: "Center"});
		
		for(var i=0; i<oController._vActiveTabNames.length; i++) {
			var vTabId = "Sub" + oController._vActiveTabNames[i].Tabid;
			var vTabLabel = oController._vActiveTabNames[i].Tabtl;
			vColumns.push({id : vTabId + "_Img", data : vTabId, label : vTabLabel, control : "Img", width : "50", align: "Center"});
			vColumns.push({id : vTabId, data : vTabId, label : vTabLabel, control : "Hidden", width : "50", align: "Center"});
		}

		vColumns.push({id : "Sub08_Img", data : "Sub08", label : oBundleText.getText("TSUB08"), control : "Img", width : "50", align: "Center"});
		vColumns.push({id : "Sub08", data : "Sub08", label : oBundleText.getText("TSUB08"), control : "Hidden", width : "50", align: "Center"});
		vColumns.push({id : "Actda", label : oBundleText.getText("ACTDA"), control : "Hidden1", width : "80", align: "Center"});
		vColumns.push({id : "Ename", label : oBundleText.getText("ENAME"), control : "Hidden", width : "80", align: "Center"});
		vColumns.push({id : "VoltId", label : oBundleText.getText("VOLTID"), control : "Hidden", width : 70, align : "Center"});
		
		vColumns.push({id : "Pernr", label : oBundleText.getText("PERNR"), control : "Hidden", width : 70, align : "Center"});
		vColumns.push({id : "Docno", label : oBundleText.getText("DOCNO"), control : "Hidden", width : 70, align : "Center"});
		vColumns.push({id : "Reqno", label : oBundleText.getText("REQNO"), control : "Hidden", width : 70, align : "Center"});
		
		if(typeof ActRecDocumentSubject == "undefined") {
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
			createIBSheet2(document.getElementById(oController.PAGEID + "_SubjectList"), "ActRecDocumentSubject", "100%",  (window.innerHeight - 360) + "px", vLang);
		}
		
		ActRecDocumentSubject.Reset();
		
		ActRecDocumentSubject.SetTheme("DS","ActApp");
		
		var initdata = {};
		
		//initdata.Cfg = {SearchMode:smLazyLoad, SizeMode:0, CustomScroll:1, Page:20, SmartResize:1, MergeSheet:msHeaderOnly};  //MergeSheet:msHeaderOnly,

		//InitHeaders의 두번째 인자
		initdata.HeaderMode = {Sort:0,ColMove:0,ColResize:1,HeaderCheck:1};
		
		initdata.Cols = [];
		var vTotalWidth = 0;
		
		for(var i=0; i<vColumns.length; i++) {
			var oneCol = {};
			
			oneCol.Header = vColumns[i].label;			
			oneCol.Edit = 1;
			if(i > 0) oneCol.Edit = 0;
			oneCol.Type = vColumns[i].control;
			oneCol.Width = vColumns[i].width;
			oneCol.SaveName = vColumns[i].id;
			oneCol.Align = vColumns[i].align;			
			initdata.Cols.push(oneCol);
			
			if(vColumns[i].control ==  "Hidden") {
				oneCol.Type = "Text";
				oneCol.Hidden = true;
			}
			
			if(vColumns[i].control ==  "Hidden1") {
				oneCol.Hidden = true;
			}
			
			vTotalWidth += vColumns[i].width;
		}
		
		if(oController._vStatu != "00") {
			for(var i=0; i<oController.vDisplayControl.length; i++) {
				var Fieldname = oController.vDisplayControl[i].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				
				var vHeaderText = "";
				if(oController.vDisplayControl[i].Label && oController.vDisplayControl[i].Label != "") {
					vHeaderText = oController.vDisplayControl[i].Label;
				} else {
					vHeaderText = oBundleText.getText(oController.vDisplayControl[i].Fieldname);
				}
				
				var oneCol = {};
				
				oneCol.Header = vHeaderText;			
				oneCol.Edit = 0;
				oneCol.Type = "Html";
				oneCol.Width = 150;
				oneCol.SaveName = TextFieldname;
				oneCol.Align = "Left";			
				initdata.Cols.push(oneCol);
				
				var oneCol1 = {};				
				oneCol1.Header = vHeaderText;			
				oneCol1.Edit = 0;
				oneCol1.Type = "Text";
				oneCol1.SaveName = TextFieldname + "_Hidden";
				oneCol1.Align = "Left";		
				oneCol1.Hidden = true;
				initdata.Cols.push(oneCol1);
				
				vTotalWidth += 150;
			}
		}
		
		initdata.Cols.push({
			Header : "", 
			Width : 10,
			Type : "Text", 
			Edit : 0, 
			SaveName : "vDummy",
			Align : "Center"});
		
		IBS_InitSheet(ActRecDocumentSubject, initdata);
		if(vTotalWidth < window.innerWidth) {
			//ActRecDocumentSubject.FitColWidth();
		}			
		ActRecDocumentSubject.SetSelectionMode(0);
		
		ActRecDocumentSubject.SetCellFont("FontSize", 0, "Pchk", ActRecDocumentSubject.HeaderRows(), "vDummy", 13);
		ActRecDocumentSubject.SetCellFont("FontName", 0, "Pchk", ActRecDocumentSubject.HeaderRows(), "vDummy", "Malgun Gothic");
		
		ActRecDocumentSubject.SetHeaderRowHeight(32);
		ActRecDocumentSubject.SetDataRowHeight(32);
		
		ActRecDocumentSubject.SetFocusAfterProcess(0);
		
		var SubjectListData = {data : []};
		
		if(oController._vStatu == "00") {	
			ActRecDocumentSubject.LoadSearchData(SubjectListData);
			return;
		}
	
		var fCompleteCount = false; 
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = {ActionSubjectListSet : []};
		var oPath = "/ActionSubjectListSet/?$filter=Docno%20eq%20%27" + (oController._vDocno) + "%27";
//        		  + "%20and%20Reqno%20eq%20%27" + encodeURI(oController._vReqno) + "%27";
		 
		oModel.read(oPath + oController.ListFilter, 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							
							if(oData.results[i].Cfmyn == "X") {
								fCompleteCount = true; 
							}
							
							var oneData = oData.results[i];
							oneData.Pchk = oController.ListSelected;
							oneData.ProcessStatus = "W";
							oneData.ProcessStatusText = oBundleText.getText("WAIT_STATUS");
							oneData.ProcessMsg = "";
							
							//Global 일자 관련하여 소스 수정함. 2015.10.19
							var vActda = new Date(oData.results[i].Actda);
							oneData.Actda = new Date(common.Common.setTime(vActda));
							//수정완료

							vActionSubjectList.ActionSubjectListSet.push(oneData);	
						}
					}
				},
				function(oError) {
					common.Common.log(oError);
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
				}
		);

		mActionSubjectList.setData(vActionSubjectList);	
		
		var tActionSubjectListSet = [];
		for(var i=0; i<vActionSubjectList.ActionSubjectListSet.length; i++) {
			tActionSubjectListSet.push(vActionSubjectList.ActionSubjectListSet[i]);
		}
		
		oController._vActionCount = 0;
		oController._vRehireCount = 0;
		if(tActionSubjectListSet.length > 0) {
			for(var i=0; i<tActionSubjectListSet.length; i++) {
				var oneDataSheet = tActionSubjectListSet[i];
				
				if(tActionSubjectListSet[i].Massn1 != "") {
					oController._vActionCount++;
				}
				
				if(tActionSubjectListSet[i].Sub08 != "") {
					oController._vRehireCount++;
				}
				
				if(oneDataSheet.Actda != null) {
					oneDataSheet.Actda1 = dateFormat.format(new Date(oneDataSheet.Actda));
				} else {
					oneDataSheet.Actda1 = "";
				}
				
				if(tActionSubjectListSet[i].Cfmyn == "X") oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'>" + icon1 + "</td><td style='padding-left:5px; border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup2(" + (i+1) + ")'>" + tActionSubjectListSet[i].Ename + "</div>";
				else if(tActionSubjectListSet[i].Cfmyn == "E") oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'>" + icon2 + "</td><td style='padding-left:5px; border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup2(" + (i+1) + ")'>" + tActionSubjectListSet[i].Ename + "</div>";
				else if(tActionSubjectListSet[i].Cfmyn == "L") oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'>" + icon3 + "</td><td style='padding-left:5px; border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup2(" + (i+1) + ")'>" + tActionSubjectListSet[i].Ename + "</div>";
				else oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'><div id='" + oController.PAGEID + "_row_name_" + (i+1) + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup2(" + (i+1) + ")'>" + tActionSubjectListSet[i].Ename + "&nbsp;&nbsp;&nbsp;</div>";
				oneDataSheet.Ename_Html += "<div class='L2P13Font'>(" + tActionSubjectListSet[i].Pernr + ")</div>";
				oneDataSheet.Ename_Html += "</td></tr></table>";
				
				for(var j=0; j<vColumns.length; j++) {
					if(vColumns[j].control == "Img") {
						var val = eval("tActionSubjectListSet[i]." + vColumns[j].data + ";");
						if(parseInt(val) > 0) {
							var cond =  vColumns[j].data.replace("Sub","Verif");
							var val = eval("tActionSubjectListSet[i]." + cond + ";");
							if(val == "T"){
								eval("oneDataSheet." + vColumns[j].id + " = icon5;");
							}
							else	eval("oneDataSheet." + vColumns[j].id + " = icon4;");
							
						} else {
							eval("oneDataSheet." + vColumns[j].id + " = '';");
						}
						eval("oneDataSheet." + vColumns[j].id.substring(0, vColumns[j].id.indexOf("_")) + " = val;");
					
					}	
				}
				
				for(var j=0; j<oController.vDisplayControl.length; j++) {
					var Fieldname = oController.vDisplayControl[j].Fieldname;
					Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
					var TextFieldname = Fieldname + "_Tx";
					
					var val = eval("tActionSubjectListSet[i]." + TextFieldname + ";");	
					eval("oneDataSheet." + TextFieldname + " = val;");
					eval("oneDataSheet." + TextFieldname + "_Hidden" + " = val;");
				}
				
				SubjectListData.data.push(oneDataSheet);
			}
		}
		
		ActRecDocumentSubject.LoadSearchData(SubjectListData);
		
		oController._vListLength = SubjectListData.data.length;
		
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		
		if(fCompleteCount) {
			if(oDeleteBtn) oDeleteBtn.setVisible(false);
		} else {
			if(oDeleteBtn) oDeleteBtn.setVisible(true);
		}
	},
	
	onPressUpload : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp2.ActAppUpload",
		      data : {
		    	  Persa : oController._vPersa,
			    	 Statu : oController._vStatu,
			    	 Reqno : oController._vReqno,
			    	 Docno : oController._vDocno,
			    	 Docty : oController._vDocty,
			    	 Actda : oController._vActda,
			    	 Molga : oController._vMolga,
			    	 Intca : oController._vIntca,
			    	 context : oController._oContext,
			    	 FromPageId : "zui5_hrxx_actapp2.ActRecDocument"
		      }
		});		
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
	},
	
	downloadExcel : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		var vCols = "Ename|Acttx|Actda1|Batyp|";
		
		for(var i=0; i<oController._vActiveTabNames.length; i++) {
			var vTabId = "Sub" + oController._vActiveTabNames[i].Tabid;
			vCols += vTabId + "|";
		}
		vCols += "Sub08|";
		
		for(var i=0; i<oController.vDisplayControl.length; i++) {
			var Fieldname = oController.vDisplayControl[i].Fieldname;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			var TextFieldname = Fieldname + "_Tx";
			vCols += TextFieldname + "_Hidden|";
		}
		
		var params = { FileName : "ActionSubject.xls",  SheetName : "Sheet", Merge : 1, HiddenColumn : 0, DownCols : vCols} ;
		if(typeof ActRecDocumentSubject == "object") {
			ActRecDocumentSubject.Down2Excel(params);
		}
	},
});

var onInfoViewPopup2 = function(rowId) {
	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
	var oController = oView.getController();
	
	oController._vSelected_Pernr = null;
	oController._vSelected_Reqno = null;
	oController._vSelected_Actda = null;
	oController._vSelected_Docno = null;
	
	if(typeof ActRecDocumentSubject == "object") {
		oController._vSelected_Pernr = ActRecDocumentSubject.GetCellValue(rowId, "Pernr");
		oController._vSelected_Reqno = ActRecDocumentSubject.GetCellValue(rowId, "Reqno");
		oController._vSelected_Actda = ActRecDocumentSubject.GetCellValue(rowId, "Actda");
		oController._vSelected_Docno = ActRecDocumentSubject.GetCellValue(rowId, "Docno");
		oController._vSelected_VoltId = ActRecDocumentSubject.GetCellValue(rowId, "VoltId");
	}
	
	if(!oController._DetailViewPopover) {
		if(oController._vDocty == "20") {
			oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionRecDetailView", oController);
		} else {
			oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionDetailView", oController);
		}
		oView.addDependent(oController._DetailViewPopover);
	}
	
	var oControl = $("#" + oController.PAGEID + "_row_name_" + rowId);
	oController._DetailViewPopover.openBy(oControl);
	
};

function ActRecDocumentSubject_OnSearchEnd(result) {
	if(ActRecDocumentSubject.RowCount() > 0) {
		ActRecDocumentSubject.FitSize(1, 1);	
		ActRecDocumentSubject.SetColWidth(1, 150);
	}
	ActRecDocumentSubject.SetExtendLastCol(true);
	
	ActRecDocumentSubject.SetCellFont("FontSize", 0, "Pchk", ActRecDocumentSubject.RowCount() + ActRecDocumentSubject.HeaderRows(), "vDummy", 13);
	ActRecDocumentSubject.SetCellFont("FontName", 0, "Pchk", ActRecDocumentSubject.RowCount() + ActRecDocumentSubject.HeaderRows(), "vDummy", "Malgun Gothic");
	
//	for(var i=0; i<ActRecDocumentSubject.RowCount(); i++) {
//		for(var j=0; j<=ActRecDocumentSubject.LastCol(); j++) {
//			ActRecDocumentSubject.SetCellBackColor(i + ActRecDocumentSubject.HeaderRows(), j, "rgb(255,255,255)");
//		}
//	}
}

function ActRecDocumentSubject_OnBeforeCheck(Row, Col) {
	var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
	var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");
	
	var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
	
//	var vPernr = ActRecDocumentSubject.GetCellValue(Row, "Pernr");
//	var vActda = ActRecDocumentSubject.GetCellValue(Row, "Actda");
//	if(vPernr == "") return;
//		
//	var r_idx = -1;
//	for(var i=0; i<vActionSubjectList.length; i++) {
//		if(vPernr == vActionSubjectList[i].Pernr && dateFormat.format(vActda) == dateFormat.format(vActionSubjectList[i].Actda)) {
//			r_idx = i;
//			break;
//		}
//	}
	
	var vPernr = ActRecDocumentSubject.GetCellValue(Row, "Pernr");
	var vActda = ActRecDocumentSubject.GetCellValue(Row, "Actda");
	var vVoltId = ActRecDocumentSubject.GetCellValue(Row, "VoltId");
	if(vPernr == "") return;
		
	var r_idx = -1;
	for(var i=0; i<vActionSubjectList.length; i++) {
		if(vPernr == vActionSubjectList[i].Pernr
		   && dateFormat.format(vActda) == dateFormat.format(vActionSubjectList[i].Actda)
		   && vVoltId == vActionSubjectList[i].VoltId) {
			r_idx = i;
			break;
		}
	}
	
	if(r_idx != -1) {
		if(ActRecDocumentSubject.GetCellValue(Row, "Pchk") == 0) {
			mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", true);
		} else {
			mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", false);
		}
	}
}