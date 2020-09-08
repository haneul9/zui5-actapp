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
	_vMolga : "41",
	_vIntca : "",
	_oContext : null,
	_vSelectedPersa : "",
	
	_vSelected_Reqno : "",
	_vSelected_Pernr : "",
	_vSelected_Actda : "",
	_vSelected_Docno : "",
	_vSelected_VoltId : "",
	 
	vDisplayControl : [],
	vExcelDownControl : [], 
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
		text : "잠시만 기다려주십시오." ,
		customIcon : "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/progress.gif",
		customIconWidth : "40px",
		customIconHeight : "40px"
	}),
	
	BusyDialog : new sap.m.BusyDialog(),
	oSubjectList : null,
	
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
//				onAfterHide : jQuery.proxy(function (evt) {
//					this.onAfterHide(evt);
//				}, this)
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
		oController._vListLength = 0;
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
		var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
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
//			var oReqda = sap.ui.getCore().byId(this.PAGEID + "_Reqda");
			var oNotes = sap.ui.getCore().byId(this.PAGEID + "_Notes");
//			var oPvdoc = sap.ui.getCore().byId(this.PAGEID + "_Pvdoc");
			
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
//				this._vMolga = vPersaData[s_idx].Molga;
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
//				oReqda.setValueState(sap.ui.core.ValueState.None);
				
				oActda.setValue(dateFormat.format(new Date()));
//				oReqda.setValue(dateFormat.format(new Date()));
				
				oPersa.setEnabled(true);
				oOrgeh.setEnabled(true);
				oReqno.setEnabled(true);
				
//				oPvdoc.setSelected(true);
				
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
//						oController._vMolga = vPersaData[i].Molga;
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
//				oReqda.setValueState(sap.ui.core.ValueState.None);
				
				oNotes.setValue(mActionReqList.getProperty(this._oContext + "/Notes"));
//				console.log(mActionReqList.getProperty(this._oContext + "/Actda"));
//				console.log(dateFormat.format(new Date(mActionReqList.getProperty(this._oContext + "/Actda"))));
				oActda.setValue(dateFormat.format(new Date(mActionReqList.getProperty(this._oContext + "/Actda"))));
//				oReqda.setValue(dateFormat.format(mActionReqList.getProperty(this._oContext + "/Reqda")));
//				console.log(mActionReqList.getProperty(this._oContext + "/Actda"));
//				console.log(dateFormat.format(mActionReqList.getProperty(this._oContext + "/Actda")));
//				oPvdoc.setSelected(mActionReqList.getProperty(this._oContext + "/Pvdoc") == "X" ? true : false);
				
				oPersa.setEnabled(false);
				oOrgeh.setEnabled(false);
				oReqno.setEnabled(true);
				
				this._vActda = dateFormat2.format(new Date(mActionReqList.getProperty(this._oContext + "/Actda")));
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
			
			zui5_hrxx_actapp2.common.Common.onAfterRenderingTable(this);
			
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
			}
		}
		

//		oController.onResizeWindow();
	},
	
	onAfterHide : function(oEvent) {
	},
	
	reloadSubjectList : function(oController) {
		
//		oController.setRecSubjectListColumn(oController);
		zui5_hrxx_actapp2.common.Common.setRecSubjectListColumn(oController);
		
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
			sap.m.MessageBox.alert("발령내역이 이미 등록되었습니다.", {
//			sap.m.MessageBox.alert("이미 등록 된 발령내역이 있습니다. \n 수정모드로 접근바랍니다.", {
//				onClose : function() {
//					oController.navToBack();
//					return;
//				}
			});
			return;
		}
		
		var vActda = oController._vActda ;
		vActda.replace(".","-");
		
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
		    	 Actda : vActda,
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
		if(!oController.oSubjectList) return;
		var vCheckRows = 0;
		var vCheckIndx ;
		for(var i = 0; i < oController.oSubjectList.getRowsNum(); i++){
			if(oController.oSubjectList.cells(i+1,0).getValue() == "1"){
				vCheckRows ++;
				vCheckIndx = i ;
			} 
		}

		if(vCheckRows < 1){
			sap.m.MessageBox.alert("수정대상을 선택해 주십시오.");
			return;
		}else if(vCheckRows > 1){
			sap.m.MessageBox.alert("수정은 한명만 가능합니다.");
			return;
		}
		
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
	    var vOneRecord = mActionSubjectList.getProperty("/ActionSubjectListSet/" + vCheckIndx );
		
		if(vOneRecord.Cfmyn == "X") {
			sap.m.MessageBox.alert("확정처리된 사용자는 수정할 수 없습니다.");
			return;
		}
		
		var vSelectedMassn1 = vOneRecord.Massn1;
		if(vSelectedMassn1 == "") {
			sap.m.MessageBox.alert("발령유형 값이 없어서 수정할 수 없습니다.");
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
		    	 Pdata : vOneRecord,
		    	 FromPageId : "zui5_hrxx_actapp2.ActRecDocument",
		    	 Pernr : vOneRecord.Pernr,
		    	 PernrActda : vOneRecord.Actda,
		    	 PernrVoltId : vOneRecord.VoltId,
		      }
		});		
	},
	
	deletePerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		if(!oController.oSubjectList) return;
		var vCheckRows = 0;
		var vCheckIndx ;
		for(var i = 0; i < oController.oSubjectList.getRowsNum(); i++){
			if(oController.oSubjectList.cells(i+1,0).getValue() == "1"){
				vCheckRows ++;
			} 
		}

		if(vCheckRows < 1){
			sap.m.MessageBox.alert("삭제대상을 선택해 주십시오.");
			return;
		}
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");

		var onProcessDelete = function(fVal) {
			if(fVal && fVal == "OK") {
				var process_result = false;
				
				for(var i = 0; i < oController.oSubjectList.getRowsNum(); i++){
					if(oController.oSubjectList.cells(i+1,0).getValue() == "1"){
					    var vOneRecord = mActionSubjectList.getProperty("/ActionSubjectListSet/" + i );
					    
						if(vOneRecord.Cfmyn == "X") {
							sap.m.MessageBox.alert("확정처리된 사용자는 수정할 수 없습니다.");
							return;
						}
						
						process_result = false;
						
						var oPath = "/ActionSubjectListSet(Docno='" + oController._vDocno + "',"
				                  + "Pernr='" +  vOneRecord.Pernr + "',"
				                  + "VoltId='" + vOneRecord.VoltId + "',"
				                  + "Actda=" +  "datetime%27" + dateFormat.format(new Date(vOneRecord.Actda)) + "T00%3a00%3a00%27" + ")";
	
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
				}
				
				sap.m.MessageBox.alert("삭제하였습니다.", {
					title : "안내",
					onClose : function() {
						oController.reloadSubjectList(oController);
					}
				});	
			}
		};
		
		sap.m.MessageBox.confirm("삭제하시겠습니까?", {
			title : "확인",
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
//		var oReqda = sap.ui.getCore().byId(oController.PAGEID + "_Reqda");
		
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
//			oReqda.setValueState(sap.ui.core.ValueState.None);
			
//			oController._vMolga = vItem.getCustomData()[0].getValue("Molga");
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
//		var oReqda = sap.ui.getCore().byId(oController.PAGEID + "_Reqda");
		var oNotes = sap.ui.getCore().byId(oController.PAGEID + "_Notes");
//		var oPvdoc = sap.ui.getCore().byId(oController.PAGEID + "_Pvdoc");
		
		oReqno.setValueState(sap.ui.core.ValueState.None);
		oTitle.setValueState(sap.ui.core.ValueState.None);
		oActda.setValueState(sap.ui.core.ValueState.None);
//		oReqda.setValueState(sap.ui.core.ValueState.None);
		
		var oAddRec_Btn = sap.ui.getCore().byId(oController.PAGEID + "_Add_Rec_Btn");
		var oUpload_Btn = sap.ui.getCore().byId(oController.PAGEID + "_UPLOAD_BTN");
//		var oRecAct_Btn = sap.ui.getCore().byId(oController.PAGEID + "_RECACT_BTN");
//		oRecAct_Btn.setVisible(false);	
		var oRequsetDelete_Btn = sap.ui.getCore().byId(oController.PAGEID + "_REQUESTDELETE_BTN");
		
		if(oReqno.getValue() == "") {
			oReqno.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert("품의번호를 입력바랍니다.");
			return;
		}
		
		if(oTitle.getValue() == "") {
			oTitle.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert("품의제목을 입력바랍니다.");
			return;
		}
		
		if(oActda.getValue() == "") {
			oActda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert("발령일을 입력바랍니다.");
			return;
		}
		
//		if(oReqda.getValue() == "") {
//			oReqda.setValueState(sap.ui.core.ValueState.Error);
//			sap.m.MessageBox.alert("기안일을 입력바랍니다.");
//			return;
//		}
		
		var updateData = {};
		var vEapprovalyn = "";
		updateData.Persa = oPersa.getSelectedKey();;
		updateData.Orgeh = oOrgeh.getSelectedKey();
		updateData.Reqno = oReqno.getValue();
		updateData.Title = oTitle.getValue();
		
		updateData.Actda = "\/Date(" + common.Common.getTime(oActda.getValue()) + ")\/";
//		updateData.Reqda = "\/Date(" + common.Common.getTime(oReqda.getValue()) + ")\/";
	    var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		updateData.Reqda = "\/Date(" + common.Common.getTime(dateFormat.format(curDate)) + ")\/";
		updateData.Notes = oNotes.getValue();
		
//		if(oPvdoc.getSelected() == true) updateData.Pvdoc = "X";
//		else updateData.Pvdoc = "";
		
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
//				insertData.Reqda = new Date(common.Common.setTime(new Date(oReqda.getValue())));			
				insertData.Notes = oNotes.getValue();
//				insertData.Pvdoc = oPvdoc.getSelected() == true ? "X" : "";
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
//				mActionReqList.setProperty(oController._oContext + "/Reqda", new Date(common.Common.setTime(new Date(oReqda.getValue()))));
				mActionReqList.setProperty(oController._oContext + "/Notes", oNotes.getValue());
			}
			
			oController._vReqno = oReqno.getValue();
			
			oController._vActda = oActda.getValue();
			sap.m.MessageBox.alert("저장하였습니다.", {
				title: "안내",
				onClose : function() {
					oPersa.setEnabled(false);
					oOrgeh.setEnabled(false);
					oReqno.setEnabled(false);
					
					oTitle.setValueState(sap.ui.core.ValueState.None);
					oReqno.setValueState(sap.ui.core.ValueState.None);
					oActda.setValueState(sap.ui.core.ValueState.None);
//					oReqda.setValueState(sap.ui.core.ValueState.None);
					
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
//			oReqda.setValueState(sap.ui.core.ValueState.None);
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
					sap.m.MessageBox.alert("삭제하였습니다.", {
						title: "안내",
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
		
		sap.m.MessageBox.confirm("삭제하시겠습니까?", {
			title : "확인",
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		$("#" + oController.PAGEID + "_SubjectList").css("height", window.innerHeight - 325);
	},
	
	addRecPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		
		var vActda = oController._vActda ;
//		vActda.replace(".","-");
		
		vActda = vActda.substring(0,4) + "-" + vActda.substring(5,7) + "-" +  vActda.substring(8,10);
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actapp2.ActRecPInfo",
		      data : {
		    	 actiontype : "C",
		    	 Persa : oController._vPersa,
		    	 Statu : oController._vStatu,
		    	 Reqno : oController._vReqno,
		    	 Docno : oController._vDocno,
		    	 Docty : oController._vDocty,
		    	 Actda : vActda,
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
		
		if(!oController.oSubjectList) return;
		var vCheckRows = 0;
		var vCheckIndx ;
		for(var i = 0; i < oController.oSubjectList.getRowsNum(); i++){
			if(oController.oSubjectList.cells(i+1,0).getValue() == "1"){
				vCheckRows ++;
				vCheckIndx = i ;
			} 
		}

		if(vCheckRows < 1){
			sap.m.MessageBox.alert("수정대상을 선택해 주십시오.");
			return;
		}else if(vCheckRows > 1){
			sap.m.MessageBox.alert("수정은 한명만 가능합니다.");
			return;
		}
		
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
	    var vOneRecord = mActionSubjectList.getProperty("/ActionSubjectListSet/" + vCheckIndx );
		
		if(vOneRecord.Cfmyn == "X") {
			sap.m.MessageBox.alert("확정처리된 사용자는 수정할 수 없습니다.");
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
		    	 Pdata : vOneRecord,
		    	 FromPageId : "zui5_hrxx_actapp2.ActRecDocument",
		    	 Recno : vOneRecord.Recno,
		    	 VoltId : vOneRecord.VoltId
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
			sap.m.MessageBox.alert("재 조회 대상을 선택해 주십시오.");
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
					sap.m.MessageBox.alert("확정처리된 사용자는 수정할 수 없습니다.");
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
			
			oController.BusyDialog.close();
			
			sap.m.MessageBox.alert("재조회 하였습니다.", {
				title : "안내",
				onClose : function() {
					oController.reloadSubjectList(oController);
				}
			});	
		};
		
		var oBusyIndicator = new sap.m.BusyIndicator({
			text : "잠시만 기다려주십시오." ,
			customIcon : "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/progress.gif",
			customIconWidth : "40px",
			customIconHeight : "40px"
		});
		
		oController.BusyDialog.open();
		
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
		if(!oController.oSubjectList) return;
		var vCheckRows = 0;
		var vCheckIndx ;
		for(var i = 0; i < oController.oSubjectList.getRowsNum(); i++){
			if(oController.oSubjectList.cells(i+1,0).getValue() == "1"){
				vCheckRows ++;
				vCheckIndx = i ;
			} 
		}

		if(vCheckRows < 1){
			sap.m.MessageBox.alert("수정대상을 선택해 주십시오.");
			return;
		}else if(vCheckRows > 1){
			sap.m.MessageBox.alert("수정은 한명만 가능합니다.");
			return;
		}
		
		
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
	    var vOneRecord = mActionSubjectList.getProperty("/ActionSubjectListSet/" + vCheckIndx );
		
		if(vOneRecord.Cfmyn == "X") {
			sap.m.MessageBox.alert("확정처리된 사용자는 수정할 수 없습니다.");
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
		    	 Pdata : vOneRecord,
		    	 FromPageId : "zui5_hrxx_actapp2.ActRecDocument",
		    	 Recno : vOneRecord.Recno,
		    	 VoltId : vOneRecord.VoltId
		      }
		});		
	},
	
	setRecSubjectListColumn : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var icon1 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Apply.png'>";
		var icon2 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Error.png'>";
		var icon3 = "<img src='/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/Lock.png'>";
		var icon4 = "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/check-icon.png";
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
		
		vColumns.push({id : "Ename_Html", label : "성명", control : "Html", width : "150", align: "Left"});
		vColumns.push({id : "Acttx", label : "발령유형", control : "Text", width : "200", align: "Left"});
		vColumns.push({id : "Actda1", label : "발령일", control : "Text", width : "120", align: "Center"});
		
		for(var i=0; i<oController._vActiveTabNames.length; i++) {
			var vTabId = "Sub" + oController._vActiveTabNames[i].Tabid;
			var vTabLabel = oController._vActiveTabNames[i].Tabtl;
			vColumns.push({id : vTabId + "_Img", data : vTabId, label : vTabLabel, control : "Img", width : "120", align: "Center"});
		}

		vColumns.push({id : "Sub08_Img", data : "Sub08", label : "재입사", control : "Img", width : "120", align: "Center"});
		
		
		var oListTable = sap.ui.getCore().byId(oController.PAGEID + "_ListTable");
		oListTable.removeAllColumns();
		oListTable.destroyColumns();
		
		for(var i=0; i<vColumns.length; i++) {
			
			if(vColumns[i].control == "CheckBox"){
				var oColumn = new sap.ui.table.Column({
					hAlign : "Center",
					flexible : false,
					resizable : false,
		        	vAlign : "Middle",
		        	label : new sap.m.CheckBox({
		        		select : oController.onSelectHeader
		        	}),
		            width :  vColumns[i].width + "px",
		        	template: new sap.m.CheckBox({
		        		width: vColumns[i].width + "px",
						selected : "{" + vColumns[i].id + "}", 
						textAlign : "Center"
					}).addStyleClass("L2P13Font"),
				});
				oListTable.addColumn(oColumn);
			}else if(vColumns[i].control == "Text"){
				var oColumn =  new sap.ui.table.Column({
					hAlign : "Center",
					flexible : false,
					resizable : false,
		        	vAlign : "Middle",
		        	label : new sap.m.Label({text : vColumns[i].label, textAlign : "Center"}),
		            width : vColumns[i].width + "px",
		        	template: new sap.ui.commons.TextView({
						text : "{" + vColumns[i].id + "}",  
						textAlign : "Center"
					}).addStyleClass("L2P13Font"),
				});
				oListTable.addColumn(oColumn);
			}else if(vColumns[i].control == "Html"){
				var oColumn =  new sap.ui.table.Column({
					hAlign : "Center",
					flexible : false,
					resizable : false,
		        	vAlign : "Middle",
		        	label : new sap.m.Label({text : vColumns[i].label, textAlign : "Center"}),
		            width : vColumns[i].width + "px",
		        	template: new sap.ui.core.HTML({content :"{" + vColumns[i].id + "}",	preferDOM : false}),
				});
				oListTable.addColumn(oColumn);
			}else if(vColumns[i].control == "Img"){
				var oColumn =  new sap.ui.table.Column({
					hAlign : "Center",
					flexible : false,
					resizable : false,
		        	vAlign : "Middle",
		        	label : new sap.m.Label({text : vColumns[i].label, textAlign : "Center"}),
		            width : vColumns[i].width + "px",
		        	template: new sap.m.Image({
						width: { path : vColumns[i].id , formatter : function(fVal) {
										if (fVal == undefined || fVal == "") {
											return "";
										}else{
											return "16px";
										}
									}},
						height : { path : vColumns[i].id , formatter : function(fVal) {
										if (fVal == undefined || fVal == "") {
											return "";
										}else{
											return "16px";
										}
									}},
						src : { path : vColumns[i].id , formatter : function(fVal) {
							if (fVal == undefined || fVal == "") {
								return "";
							}else{
								return fVal;
							}
						}},   
					}),
				});
				oListTable.addColumn(oColumn);
			}
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
					vHeaderText = oController.vDisplayControl[i].Label;
				}
				
				if(i == oController.vDisplayControl.length - 1){
					var oColumn =  new sap.ui.table.Column({
						hAlign : "Center",
						flexible : false,
						resizable : false,
			        	vAlign : "Left",
			        	label : new sap.m.Label({text : vHeaderText, textAlign : "Center"}),
			            template: new sap.ui.commons.TextView({
							width:"100%",
							text : "{" + TextFieldname + "}",  
							textAlign : "Center"
						}).addStyleClass("L2P13Font"),
					});
					oListTable.addColumn(oColumn);
				}else{
					var oColumn =  new sap.ui.table.Column({
						hAlign : "Center",
						flexible : false,
						resizable : false,
			        	vAlign : "Left",
			        	label : new sap.m.Label({text : vHeaderText, textAlign : "Center"}),
			            width : "150px",
			            template: new sap.ui.commons.TextView({
							width:"100%",
							text : "{" + TextFieldname + "}",  
							textAlign : "Center"
						}).addStyleClass("L2P13Font"),
					});
					oListTable.addColumn(oColumn);
				}
			}
		}
		
	
		if(oController._vStatu == "00") {		
			return;
		}
		
		
		var SubjectListData = {data : []};
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
							oneData.ProcessStatusText = "대기중";
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

//		mActionSubjectList.setData(vActionSubjectList);	
		
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
				
				if(tActionSubjectListSet[i].Cfmyn == "X") oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'>" + icon1 + "</td><td style='padding-left:5px; border:0px'><div id='" + oController.PAGEID + "_row_name_" + i + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup2(" + i + ")'>" + tActionSubjectListSet[i].Ename + "</div>";
				else if(tActionSubjectListSet[i].Cfmyn == "E") oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'>" + icon2 + "</td><td style='padding-left:5px; border:0px'><div id='" + oController.PAGEID + "_row_name_" + i + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup2(" + i + ")'>" + tActionSubjectListSet[i].Ename + "</div>";
				else if(tActionSubjectListSet[i].Cfmyn == "L") oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'>" + icon3 + "</td><td style='padding-left:5px; border:0px'><div id='" + oController.PAGEID + "_row_name_" + i + "' class='L2P13Font' style='color:blue; cursor:pointer;' onclick='onInfoViewPopup2(" + i + ")'>" + tActionSubjectListSet[i].Ename + "</div>";
				else oneDataSheet.Ename_Html = "<table cellpadding=0 cellspacing=0 border=0 style='background-color:transparent'><tr><td style='border:0px'><div id='" + oController.PAGEID + "_row_name_" + i + "' class='L2P13Font' style='padding-left:5px; color:blue; cursor:pointer;' onclick='onInfoViewPopup2(" + i + ")'>" + tActionSubjectListSet[i].Ename + "&nbsp;&nbsp;&nbsp;</div>";
				oneDataSheet.Ename_Html += "<div class='L2P13Font'>(" + tActionSubjectListSet[i].Pernr + ")</div>";
				oneDataSheet.Ename_Html += "</td></tr></table>";
				
				for(var j=0; j<vColumns.length; j++) {
					if(vColumns[j].control == "Img") {
						var val = eval("tActionSubjectListSet[i]." + vColumns[j].data + ";");
						if(parseInt(val) > 0) {
							eval("oneDataSheet." + vColumns[j].id + " = icon4;");
							
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
		
		mActionSubjectList.setData(SubjectListData);	
		oListTable.setModel(mActionSubjectList);
		oListTable.bindRows("/data")
		
		
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
			sap.m.MessageBox.alert("잘못된 일자형식 입니다.",{
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
	
	doOnCheck : function(rowId, cellInd, state) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
		var oController = oView.getController();
		var mActionSubjectList = sap.ui.getCore().getModel("ActionSubjectList");
		var vActionSubjectList = mActionSubjectList.getProperty("/ActionSubjectListSet");
		var vPernr = "";
		if(oController.oSubjectList) {
			vPernr = oController.oSubjectList.getUserData(rowId, "Pernr");
		}
		if(vPernr == "") return;
		
		var r_idx = -1;
		for(var i=0; i<vActionSubjectList.length; i++) {
			if(vPernr == vActionSubjectList[i].Pernr) {
				r_idx = i;
				break;
			}
		}
		if(r_idx != -1) {
			mActionSubjectList.setProperty("/ActionSubjectListSet/" + r_idx + "/Pchk", state);
		}
	},
});


function onInfoViewPopup3(rowId) {
	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecDocument");
	var oController = oView.getController();
	
	oController._vSelected_Pernr = null;
	oController._vSelected_Reqno = null;
	oController._vSelected_Actda = null;
	oController._vSelected_Docno = null;
	
	if(oController.oSubjectList) {
		oController._vSelected_Pernr = oController.oSubjectList.getUserData(rowId,"Pernr");
		oController._vSelected_Reqno = oController.oSubjectList.getUserData(rowId, "Reqno");
		oController._vSelected_Actda = oController.oSubjectList.getUserData(rowId, "Actda");
		oController._vSelected_Docno = oController.oSubjectList.getUserData(rowId, "Docno");
		oController._vSelected_VoltId = oController.oSubjectList.getUserData(rowId, "VoltId");
	}
	
	if(!oController._DetailViewPopover) {
		if(oController._vDocty == "20" || oController._vDocty == "50") {
			oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionRecDetailView", oController);
		} else {
			oController._DetailViewPopover = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActionDetailView", oController);
		}
		oView.addDependent(oController._DetailViewPopover);
	}
	
	var oControl = $("#" + oController.PAGEID + "_row_name_" + rowId);
	oController._DetailViewPopover.openBy(oControl);
	
};


