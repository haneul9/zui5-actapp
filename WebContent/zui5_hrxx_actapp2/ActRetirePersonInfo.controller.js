jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.SearchUser3");
jQuery.sap.require("common.Common");
jQuery.sap.require("common.SearchPrdArea");
jQuery.sap.require("common.SearchCode");
jQuery.sap.require("zui5_hrxx_actapp2.common.Common");

sap.ui.controller("zui5_hrxx_actapp2.ActRetirePersonInfo", {
	
	PAGEID : "ActRetirePersonInfo",
	Wave : "2",
	
	ContentHeight : 0,
	OtherHeight : 90,

	_AddPersonDialog : null,
	_SerachOrgDialog : null,
	_PrdAreaSearchDialog : null,
	_SerachStellDialog : null,
	_SerachEmplyeeDialog : null,
	_CodeSearchDialog : null,
	_ChangeDateDialog : null,
	
	_vActionType : "",
	_vStatu : "",
	_vPersa : "",
	_vDocno : "",
	_vDocty : "",
	_vEntrs : "",
	_vReqno : "",
	_vActda : "",
	_vPernr : "",
	_vMolga : "", 
	_oContext : null,
	
	vMassn : "90",
	
	_vPernrActda : "",
	_vPernrVoltid : "",
	
	_vUpdateData : null,
	
	_vFromPageId : "",
	
	BusyDialog : null,
	
	_vActiveControl : null, //활성화된 발령내역 입력 항목
	_vActiveMassn : null, //선택된 발령유형/사유
	_vSelectedTrfgr : "",
	_vSelectedPersg : "",

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actapp2.ActRetirePersonInfo
*/
	onInit: function() {
        this.getView().addStyleClass("sapUiSizeCompact");
	    
        this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
			}, this),
			onAfterShow  : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this),
		});
        
        sap.ui.getCore().getEventBus().subscribe("app", "ResizeWindow", this.onResizeWindow, this);
        
        this.ContentHeight = window.innerHeight - this.OtherHeight;
        
        var oScroller1 = sap.ui.getCore().byId(this.PAGEID + "_LeftScrollContainer");
        oScroller1.setHeight(this.ContentHeight + "px");
        var oScroller2 = sap.ui.getCore().byId(this.PAGEID + "_RightScrollContainer");
        oScroller2.setHeight(this.ContentHeight + "px");
	},
	
	onResizeWindow : function(oEvent, oEventId, Data) {
		this.ContentHeight = window.innerHeight - this.OtherHeight;
        
        var oScroller1 = sap.ui.getCore().byId(this.PAGEID + "_LeftScrollContainer");
        oScroller1.setHeight(this.ContentHeight + "px");
        var oScroller2 = sap.ui.getCore().byId(this.PAGEID + "_RightScrollContainer");
        oScroller2.setHeight(this.ContentHeight + "px");
	},
	
	onAfterShow : function(oEvent) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		if(oEvent) {
			this._vActionType = oEvent.data.actiontype;
			this._vStatu = oEvent.data.Statu;
			this._vReqno = oEvent.data.Reqno;
			this._vDocno = oEvent.data.Docno;
			this._vDocty = oEvent.data.Docty;
			this._vEntrs = oEvent.data.Entrs;
			this._vPersa = oEvent.data.Persa;
			this._vActda = oEvent.data.Actda;
			this._vMolga = oEvent.data.Molga;
			this._oContext = oEvent.data.context;
			this._vFromPageId = oEvent.data.FromPageId;
			
			this._vPernr = oEvent.data.Pernr;
			this._vPernrActda = oEvent.data.PernrActda;
			this._vPernrVoltid = oEvent.data.PernrVoltId;
		}
		
		this.loadReasonRetireList();
		
		var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
		
		var oControl = sap.ui.getCore().byId(this.PAGEID + "_ADDPERSON_BTN");
		var oList = sap.ui.getCore().byId(this.PAGEID + "_List");
		var oSaveBtn = sap.ui.getCore().byId(this.PAGEID + "_SAVEPERSON_BTN");
		var oActda = sap.ui.getCore().byId(this.PAGEID + "_Actda");
		var oChangeDate = sap.ui.getCore().byId(this.PAGEID + "_ChangeDate");
		
		var oAllSel = sap.ui.getCore().byId(this.PAGEID + "_ALLSELECT_BTN");
		var oAllUnSel = sap.ui.getCore().byId(this.PAGEID + "_ALLUNSELECT_BTN");
		
		var oPageTitle = sap.ui.getCore().byId(this.PAGEID + "_PAGETITLE");
		
		var oMassg = sap.ui.getCore().byId(this.PAGEID + "_Massg");
		
		this.initInputControl(this);
		
		if(this._vActionType == "200") {
			this._vPernr = oEvent.data.Pernr;
			this.setUpdateData(this, oEvent.data.Pernr, oEvent.data.PernrActda, oEvent.data.PernrVoltId);
			
			oControl.setVisible(false);
			oAllSel.setVisible(false);
			oAllUnSel.setVisible(false);
			oList.setMode(sap.m.ListMode.None);
			oSaveBtn.setEnabled(true);
			oActda.setValue(dateFormat.format(new Date(oEvent.data.PernrActda)));
			oActda.setEnabled(false);
			oChangeDate.setVisible(true);
			
			oPageTitle.setText(oBundleText.getText( "TITLE_MOD_ACT_PERSONS"));
			
		} else if(this._vActionType == "100") {
			this._vUpdateData = null;
			
			this._vPernr = "";
			
			oActda.setValue(this._vActda);
			oActda.setEnabled(true);
			oChangeDate.setVisible(false);
			
			oList.setMode(sap.m.ListMode.MultiSelect);
			oControl.setVisible(true);
			oAllSel.setVisible(true);
			oAllUnSel.setVisible(true);
			
			mActionSubjectList_Temp.setData(null);
			
			oSaveBtn.setEnabled(false);
			
			oMassg.setValue("");
			oMassg.removeAllCustomData();
			
			oPageTitle.setText(oBundleText.getText( "TITLE_REG_ACT_PERSONS"));
			
			var oInputSwith = sap.ui.getCore().byId(this.PAGEID + "_Input_Switch");
			oInputSwith.setEnabled(false);
			oInputSwith.setState(false);
			
			this.addPerson();
		}
		
		var oControlPanel = sap.ui.getCore().byId(this.PAGEID + "_ControlPanel");
//		if(this._vMolga == "08" || this._vMolga == "18") {		
//			oControlPanel.setVisible(false);
//		} else {
//			oControlPanel.setVisible(true);
//		}
	},
	
	setUpdateData : function(oController, Pernr, Actda, VoltId) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var filterString = ""; //"/?$filter=Reqno%20eq%20%27" + encodeURI(oController._vReqno) + "%27";
		filterString += "/?$filter=Docno%20eq%20%27" + oController._vDocno + "%27";
		filterString += "%20and%20Pernr%20eq%20%27" + Pernr + "%27";
		filterString += "%20and%20VoltId%20eq%20%27" + VoltId + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + dateFormat.format(new Date(Actda)) + "T00%3a00%3a00%27";
		
		oController._vUpdateData = {};
		var vBeforeData = {Orgeh_Tx : ""};
		oModel.read("/ActionSubjectListSet"  + filterString, 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						oController._vUpdateData = oData.results[0];
						if(oData.results.length == 2) {
							vBeforeData = oData.results[1];
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		var vSelectedMassn1 = oController._vUpdateData.Massn1;
		if(vSelectedMassn1 == "") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_ACTION1"), {
				onClose : function() {
					oController.navToBack();
					return;
				}
			});
		}
		
		oController._vActiveControl = [];
		oController._vActiveMassn = [];
		
		var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
		var vActionSubjectList_Temp = {ActionSubjectListSet : []};
		vActionSubjectList_Temp.ActionSubjectListSet.push({
			Pernr : oController._vUpdateData.Pernr,
			Ename : oController._vUpdateData.Ename, 
			Fulln : vBeforeData.Orgeh_Tx,
			Zzjobgrtx : vBeforeData.Zzjobgr_Tx,
			Zzcaltltx : vBeforeData.Zzcaltl_Tx,
			Zzpsgrptx : vBeforeData.Zzpsgrp_Tx,
			Photo : oController._vUpdateData.Photo,
			Persg : vBeforeData.Persg,
		});
		mActionSubjectList_Temp.setData(vActionSubjectList_Temp);
		
		var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg");
		oMassg.removeAllCustomData();
		oMassg.setValue(oController._vUpdateData.Retrs_Tx);
		oMassg.addCustomData(new sap.ui.core.CustomData({key : "Massg", value : oController._vUpdateData.Massg1}));
		oMassg.addCustomData(new sap.ui.core.CustomData({key : "Retrs", value : oController._vUpdateData.Retrs}));
		
		if(vBeforeData.Persg == "9") {
			oController.vMassn = "94";
		} else {
			oController.vMassn = "90";
		}
		
		//활설화 입력항목을 가져온다.
		var fMassnCompany = false;
		
		var filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + oController._vActda + "T00%3a00%3a00%27";
		filterString += "%20and%20Massn%20eq%20%27" + oController.vMassn + "%27";
		filterString += "%20and%20Massg%20eq%20%27" + oController._vUpdateData.Massg1 + "%27";
		filterString += "%20and%20Pernr%20eq%20%27" + oController._vPernr + "%27";
		filterString += "%20and%20Docno%20eq%20%27" + oController._vDocno + "%27";
		
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
		
		oController.setInputFiled("U", oController, fMassnCompany, oController._vUpdateData);
		
		oMassg.setEnabled(true);
		
		var oInputSwith = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
		oInputSwith.setEnabled(true);
		oInputSwith.setState(true);
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
* @memberOf zui5_hrxx_actapp2.ActRetirePersonInfo
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actapp2.ActRetirePersonInfo
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actapp2.ActRetirePersonInfo
*/
//	onExit: function() {
//
//	}
	
	navToBack : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : oController._vFromPageId,
		      data : {
		    	  context : oController._oContext,
		    	  Statu : oController._vStatu,
		    	  Reqno : oController._vReqno,
		    	  Docno : oController._vDocno,
		    	  Docty : oController._vDocty,
		    	  Entrs : oController._vEntrs,
		      }
		});
		
	},
	
	addPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		//각 발령대상자의 발령일을 검색조건으로 설정한다.
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		if(oActda) oController._vActda = oActda.getValue();
		
		common.SearchUser3.oController = oController;
		common.SearchUser3.fPersaEnabled = false;
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch3", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		oController._AddPersonDialog.open();
	},
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
		var vActionSubjectList_Temp = {ActionSubjectListSet : []};
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		
		if(vEmpSearchResult && vEmpSearchResult.length) {
			var vPrev_Persg = "";
			
			var vActionSubjectListSet = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet");
			if(vActionSubjectListSet && vActionSubjectListSet.length) {
				for(var i=0; i<vActionSubjectListSet.length; i++) {
					vActionSubjectList_Temp.ActionSubjectListSet.push(vActionSubjectListSet[i]);
					vPrev_Persg = vActionSubjectListSet[i].Persg;
				};
			}
			
			for(var i=0; i<vEmpSearchResult.length; i++) {
				if(vEmpSearchResult[i].Chck == true) {
					var vPersa = mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Persa");
					if(oController._vPersa != vPersa) {
						sap.m.MessageBox.alert(oBundleText.getText("MSG_NOT_SAME_PERSA"));
						return;
					}
					
					var vPersg = mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Persg");
					if(vPersg != "9") vPersg = "1";
					if(vPrev_Persg != "" && vPrev_Persg != vPersg) {
						sap.m.MessageBox.alert(oBundleText.getText("MSG_NOT_SAME_PERSG"));
						return;
					}
					vPrev_Persg = vPersg;
					
					vActionSubjectList_Temp.ActionSubjectListSet.push({
						Pernr : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pernr"),
						Ename : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Ename"), 
						Fulln : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Fulln"),
						Photo : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Photo"),
						Zzjobgrtx : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Zzjobgrtx"),
						Zzcaltltx : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Zzcaltltx"),
						Zzpsgrptx : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Zzpsgrptx"),
						Persg : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Persg"),
					}); 
				}				
			}
			mActionSubjectList_Temp.setData(vActionSubjectList_Temp);

			var oInputSwith = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
			oInputSwith.setEnabled(true);
			
			//선택된 사용자를 리스트에서 선택한 것으로 설정하고 발령유형을 활성화한다.
			var oList = sap.ui.getCore().byId(oController.PAGEID + "_List");
			var oItems = oList.getItems();
			if(oItems && oItems.length) {
				for(var i=0; i<oItems.length; i++) {
					oList.setSelectedItem(oItems[i], true);
				}
			}
			
			var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg");
			oMassg.setEnabled(true);
			oMassg.setValue("");
			oMassg.removeAllCustomData();
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
			return;
		}
		
		common.SearchUser3.onClose();
	},
	
	onSelectPersonList : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		var oList = oEvent.getSource();
		var oItems = oList.getSelectedItems();
		
		var fEnabled = false;
		
		if(oItems.length > 0) fEnabled = true;
		else fEnabled = false;
		
		var vContexts = oList.getSelectedContexts(true);
		
		var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
		
		var vPrev_Persg = "";
		if(vContexts && vContexts.length) {
			for(var i=0; i<vContexts.length; i++) {
				var vPersg = mActionSubjectList_Temp.getProperty(vContexts[i] + "/Persg");
				if(vPersg != "9") vPersg = "1";
				
				if(vPrev_Persg != "" && vPrev_Persg != vPersg) {
					oList.setSelectedItem(oItems[i], false);
					sap.m.MessageBox.alert(oBundleText.getText("MSG_NOT_SAME_PERSG"));
					return;
				}
				vPrev_Persg = vPersg;
			}
		}
		
		var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg");
		oMassg.setEnabled(fEnabled);
		if(!fEnabled) {
			oMassg.setValue("");
			oMassg.removeAllCustomData();
		}
		
		var oInputSwith = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
		oInputSwith.setEnabled(fEnabled);
		if(!fEnabled) {
			oController.initInputControl(oController);
			oInputSwith.setState(false);
		}
		
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVEPERSON_BTN");
		oSaveBtn.setEnabled(fEnabled);
		
		oController._vPernr = "";
	},
	
	onChangeMassg : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		var oInputSwith = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
		if(oInputSwith) {
			oInputSwith.setState(false);
			oInputSwith.setEnabled(true);
		}
		
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVEPERSON_BTN");
		oSaveBtn.setEnabled(true);
		
		oController.initInputControl(oController);
	},
	
	onChangeSwitch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVEPERSON_BTN");
		
		var oControl = oEvent.getSource();
		
		if(oEvent.getParameter("state") == false) {
			sap.m.MessageBox.show(oBundleText.getText("CONFIRM_SWITCH_CHANGE1"), {
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title: "Confirm",
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
		        onClose: function(oAction) { 
		        	if ( oAction === sap.m.MessageBox.Action.YES ) {
		        		oController.initInputControl(oController);
		    			oSaveBtn.setEnabled(false);
		        	} else {
		        		oControl.setState(true);
		        	}
		        }
			});
//			oController.initInputControl(oController);
//			oSaveBtn.setEnabled(false);
			return;
		} else {
			oSaveBtn.setEnabled(true);
		}
		 
		var isValid = true;
		var fMassnCompany = false;
		
		oController.initInputControl(oController);
		
		var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg");
		var vMassg = oMassg.getCustomData()[0].getValue();
		
		var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
		if(oController._vActionType == "100") {
			var oPersonList = sap.ui.getCore().byId(oController.PAGEID + "_List");
			var vContexts = oPersonList.getSelectedContexts(true);
			
			if(vContexts && vContexts.length) {		
				vPersg = mActionSubjectList_Temp.getProperty(vContexts[0] + "/Persg");
			}
			oController.vMassn = "";
			if(vPersg == "9") {
				oController.vMassn = "94";
			} else {
				oController.vMassn = "90";
			}
		} else {
			vPersg = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet/0/Persg");
		}
		if(vPersg == "9") {
			vMassg = "10";
		}
		
		if(vMassg == "") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_ACTTYPE"));
			return;
		}
		
		if(oController._vPernr == "") {
			var oList1 = sap.ui.getCore().byId(oController.PAGEID + "_List");
			var mTmpModel = oList1.getModel();
			
			if(oList1.getMode() == sap.m.ListMode.MultiSelect) {
				var vSelectedItems = oList1.getSelectedContexts(true);
				if(vSelectedItems && vSelectedItems.length) {
					oController._vPernr = mTmpModel.getProperty(vSelectedItems[0] + "/Pernr");
				}
			} else {
				oController._vPernr = mTmpModel.getProperty("/ActionSubjectListSet/0/Pernr");	
			}
		} 
		
		if(oMassg) {
			if(vMassg != "") {
				var filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
				filterString += "%20and%20Actda%20eq%20datetime%27" + oController._vActda + "T00%3a00%3a00%27";
				filterString += "%20and%20Massn%20eq%20%27" + oController.vMassn + "%27";
				filterString += "%20and%20Massg%20eq%20%27" + vMassg + "%27";
				filterString += "%20and%20Pernr%20eq%20%27" + oController._vPernr + "%27";
				filterString += "%20and%20Docno%20eq%20%27" + oController._vDocno + "%27";
				
				oController._vActiveMassn.push({Massn : oController.vMassn, Massg : vMassg});
					
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
						function(oResponse) {
							common.Common.log(oResponse);
						}
				);
				
				var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVEPERSON_BTN");
				oSaveBtn.setEnabled(true);
			} else {
				oEvent.getSource().setState(false);
				sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_ACTTYPE"));
				return;
			}
		}
		
		if(oController._vUpdateData != null && oController._vUpdateData.Pernr != "") {
			oController.setInputFiled("U", oController, fMassnCompany, oController._vUpdateData);
		} else {
			oController.setInputFiled("N", oController, fMassnCompany);
		}
	},

	setInputFiled : function(pTy, pController, pFMassnCompany, pUpdateData) {
		var ty            = pTy;
		var oController   = pController;
		var fMassnCompany = pFMassnCompany;
		var updateData    = pUpdateData;
		
		var fDefaulValue = false;
		
		var vRetireMassg = "";		
		
		var actionFunction = function() {
			var oMatrixLayout = sap.ui.getCore().byId(oController.PAGEID + "_MatrixLayout");
			var oRow = null, oCell = null, oControl = null;
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			
			var vWerksUpdateValue = "";
			var vHost_werks = "";
			
			if(oController._vActiveControl && oController._vActiveControl.length) {
				common.Common.loadCodeData(oController._vPersa, oController._vActda, oController._vActiveControl);
				
				var idx = 0;
				for(var i=0; i<oController._vActiveControl.length; i++) {
					
					var Fieldname = oController._vActiveControl[i].Fieldname;
					var Fieldtype = oController._vActiveControl[i].Incat;
					Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
					var TextFieldname = Fieldname + "_Tx";
					
					if(Fieldname == "Retrs") {
						continue;
					}
					
					if((idx % 2) == 0) {
						if(idx != 0) {
							oMatrixLayout.addRow(oRow);
						}
						oRow = new sap.ui.commons.layout.MatrixLayoutRow();
					}
					
					var vUpdateValue = "";
					var vUpdateTextValue = "";
					
					if(ty == "U") {
						vUpdateValue = eval("updateData." + Fieldname);
						vUpdateTextValue = eval("updateData." + TextFieldname);
					} else {
						vUpdateValue = oController._vActiveControl[i].Dcode;
						vUpdateTextValue = oController._vActiveControl[i].Dvalu;
					}
					
					var vLabel = oController._vActiveControl[i].Label;
					var vMaxLength = parseInt(oController._vActiveControl[i].Maxlen);
					
					var vLabelText = "";
					if(vLabel != "") vLabelText = vLabel;
					else vLabelText = oBundleText.getText(oBundleText.getText(oController._vActiveControl[i].Fieldname));
					
					//입력항목 라벨를 만든다.
					var oLabel = new sap.m.Label({text : vLabelText});
					if(Fieldtype.substring(0, 1) == "M") {
						oLabel.setRequired(true);
					} else {
						oLabel.setRequired(false);
					}
					oLabel.addStyleClass("L2P13Font");
					oLabel.setTooltip(vLabelText);
					
					if(Fieldtype == "D2") {
						oLabel.setText("");
					}
					
					oCell = new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Begin,
						vAlign : sap.ui.commons.layout.VAlign.Middle,
						content : [oLabel]
					}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
					oRow.addCell(oCell);				
					
					//입력항목의 유형에 따라 달리 처리한다.
					// M1 : select
					// M2 : Input & Tree Popup
					// M3 : Input only
					// M4 : DatePicker
					// M5 : Input & Select Dialog
					// M6 : Single Checkbox
					
					if(Fieldtype == "M1" || Fieldtype == "O1") {
						oControl = new sap.m.Select(oController.PAGEID + "_" + Fieldname, {
				        	   width : "95%",
				        }).addStyleClass("L2P13Font");
						
						if(Fieldname == "Werks") { //인사영역은 EmpCodeList가 아닌 별도의 Entity
							vWerksUpdateValue = vUpdateValue;
							if(fMassnCompany) {
								oController.setPersaData("Werks", oControl, fMassnCompany, vUpdateValue, "");
							} else {
								oController.setPersaData("Werks", oControl, fMassnCompany, vUpdateValue, "");
							}
							oControl.attachChange(oController.onPressWerks);
						} else if(Fieldname == "Btrtl") { //인사하위영역은 EmpCodeList가 아닌 별도의 Entity
							if(fMassnCompany) {
								oController.setPersaData("Btrtl", oControl, fMassnCompany, vUpdateValue, vWerksUpdateValue);
							} else {
								oController.setPersaData("Btrtl", oControl, fMassnCompany, vUpdateValue, oController._vPersa);
							}
						} else if(Fieldname == "Rls_orgeh") { //해제부서는 조건이 발령유형/사유가 추가됨
							
							var vAddFilter = [{key : "Actda", value : oController._vActda},
							                  {key : "Pernr", value : oController._vPernr}];
							var mDataModel = oController.setRlsOrgehCodeData(Fieldname, vAddFilter);	
							
							oControl.setModel(mDataModel);
							oControl.bindItems("/ReleaseOrgListSet", new sap.ui.core.Item({key : "{Rls_orgeh}", text : "{Rls_orgeh_Tx}"}));
							oControl.setSelectedKey(vUpdateValue);
						} else if(Fieldname == "Trfgr") { //호봉그룹
							var vAddFilter = [{key : "Persa", value : oController._vPersa},
							                  {key : "Actda", value : oController._vActda},
							                  {key : "Pernr", value : oController._vPernr}];
							var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter);	
							
							oController._vSelectedTrfgr = vUpdateValue; 
							
							oControl.setModel(mDataModel);
							oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
							oControl.setSelectedKey(vUpdateValue);
							oControl.attachChange(oController.onPressTrfgr);
						} else if(Fieldname == "Trfst") { //호봉단계 Excod
							var vAddFilter = [{key : "Persa", value : oController._vPersa},
							                  {key : "Actda", value : oController._vActda},
							                  {key : "Excod", value : oController._vSelectedTrfgr},
							                  {key : "Pernr", value : oController._vPernr}];
							
							var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter);							
							
							oControl.setModel(mDataModel);
							oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
							oControl.setSelectedKey(vUpdateValue);
						} else if(Fieldname == "Persg") { //사원그룹
							var vAddFilter = [{key : "Persa", value : oController._vPersa},
							                  {key : "Actda", value : oController._vActda}];
							var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter);	
							
							oController._vSelectedPersg = vUpdateValue; 
							
							oControl.setModel(mDataModel);
							oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
							oControl.setSelectedKey(vUpdateValue);
							oControl.attachChange(oController.onPressPersg);
						} else if(Fieldname == "Persk") { //사원하위그룹 Excod
							var vAddFilter = [{key : "Persa", value : oController._vPersa},
							                  {key : "Actda", value : oController._vActda},
							                  {key : "Excod", value : oController._vSelectedPersg}];
							
							var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter);							
							
							oControl.setModel(mDataModel);
							oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
							oControl.setSelectedKey(vUpdateValue);
						} else if(Fieldname == "Rls_werks") { //해제 인사 영역 리스트
							var vAddFilter = [{key : "Pernr", value : oController._vPernr},
							                  {key : "Actda", value : oController._vActda}];
							var mDataModel = oController.setRlsWerksCodeData(Fieldname, vAddFilter);	
							
							oControl.setModel(mDataModel);
							oControl.bindItems("/ReleasePersAreaListSet", new sap.ui.core.Item({key : "{Rls_werks}", text : "{Rls_werks_Tx}"}));
							oControl.setSelectedKey(vUpdateValue);
							oControl.attachChange(oController.onPressHost_werks);
							
							if(vUpdateValue != "" && vUpdateValue != "0000") {
								vHost_werks = vUpdateValue;
							}
						} else if(Fieldname == "Retrs") { //퇴직사유							
							var vAddFilter = [{key : "Persa", value : oController._vPersa},
							                  {key : "Actda", value : oController._vActda},
							                  {key : "Massg", value : vRetireMassg}];
							
							var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter);							
							
							oControl.setModel(mDataModel);
							oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
							oControl.setSelectedKey(vUpdateValue);
						} else if(Fieldname == "Home_staff") {
							var vAddFilter = [{key : "Pernr", value : oController._vPernr}];
							var mDataModel = oController.setHomeStaffCodeData(Fieldname, vAddFilter);	
							
							oControl.setModel(mDataModel);
							oControl.bindItems("/HomeStaffListSet", new sap.ui.core.Item({key : "{Home_staff}", text : "{Home_staff_Tx}"}));
							oControl.setSelectedKey(vUpdateValue);
						} else if(Fieldname == "Host_werks") {
							oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
							oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
							oControl.setSelectedKey(vUpdateValue);
							oControl.attachChange(oController.onPressHost_werks);
							if(vUpdateValue != "" && vUpdateValue != "0000") {
								vHost_werks = vUpdateValue;
							}
						}  else if(Fieldname == "Host_staff") {
							if(vHost_werks != "") {
								var vAddFilter = [{key : "Host_werks", value : vHost_werks},
								                  {key : "Actda", value : oController._vActda}];
								var mDataModel = oController.setHostStaffCodeData(Fieldname, vAddFilter);	
								
								oControl.setModel(mDataModel);
								oControl.bindItems("/HostStaffListSet", new sap.ui.core.Item({key : "{Host_staff}", text : "{Host_staff_Tx}"}));
								oControl.setSelectedKey(vUpdateValue);
							}
						} else if(Fieldname == "Rls_zzpsgrp") { //호봉단계 Excod
							var vAddFilter = [{key : "Persa", value : oController._vPersa},
							                  {key : "Actda", value : oController._vActda},
							                  {key : "Pernr", value : oController._vPernr}];
							
							var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter);							
							
							oControl.setModel(mDataModel);
							oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
							oControl.setSelectedKey(vUpdateValue);
						} else if(Fieldname == "Entrs") { //입사구분
							oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
							oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
							if(vUpdateValue == "") {
								oControl.setSelectedKey(oController._vEntrs);
							} else {
								oControl.setSelectedKey(vUpdateValue);
							}
						} else if(Fieldname == "Aus01" || Fieldname == "Aus02" || Fieldname == "Aus03" || Fieldname == "Aus04" || Fieldname == "Aus05") { //
							var vAddFilter = [{key : "Persa", value : oController._vPersa},
							                  {key : "Actda", value : oController._vActda},
							                  {key : "Excod", value : "A002"}];
							
							var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter);							
							
							oControl.setModel(mDataModel);
							oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
							oControl.setSelectedKey(vUpdateValue);
						} else {
							oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
							oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
							oControl.setSelectedKey(vUpdateValue);
						}
						//
					} else if(Fieldtype == "M2" || Fieldtype == "O2") {
						if(Fieldname == "Orgeh") {
							oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
					        	   width : "95%",
					        	   showValueHelp: true,
					        	   liveChange : oController.onLiveChange,
								   valueHelpRequest: oController.displayOrgSearchDialog
					        }).addStyleClass("L2P13Font");
							oControl.setValue(vUpdateTextValue);
							oControl.addCustomData(new sap.ui.core.CustomData({
								key : Fieldname,
								value : vUpdateValue
							}));
						} else if(Fieldname == "Stell" || Fieldname == "Zzstell" || Fieldname == "Add_stell" || Fieldname == "Add_zzstell" || Fieldname == "Dis_stell" || Fieldname == "Ext_stell") {
							oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
					        	   width : "95%",
					        	   showValueHelp: true,
					        	   liveChange : oController.onLiveChange,
								   valueHelpRequest: oController.displayStellSearchDialog
					        }).addStyleClass("L2P13Font");
							oControl.setValue(vUpdateTextValue);
							oControl.addCustomData(new sap.ui.core.CustomData({
								key : Fieldname,
								value : vUpdateValue
							}));
						} else if(Fieldname == "Dis_orgeh" || Fieldname == "Add_orgeh" || Fieldname == "Rls_orgeh") {
							oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
					        	   width : "95%",
					        	   showValueHelp: true,
					        	   liveChange : oController.onLiveChange,
								   valueHelpRequest: oController.displayOrgSearchDialog
					        }).addStyleClass("L2P13Font");
							oControl.setValue(vUpdateTextValue);
							oControl.addCustomData(new sap.ui.core.CustomData({
								key : "Orgeh",
								value : vUpdateValue
							}));
						} else if(Fieldname == "Host_staff" || Fieldname == "Home_staff") {
							oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
					        	   width : "95%",
					        	   showValueHelp: true,
					        	   liveChange : oController.onLiveChange,
								   valueHelpRequest: oController.displayEmplyeeSearchDialog
					        }).addStyleClass("L2P13Font");
							oControl.setValue(vUpdateTextValue);
							oControl.addCustomData(new sap.ui.core.CustomData({
								key : Fieldname,
								value : vUpdateValue
							}));
						} else if(Fieldname == "Host_orgeh") {
							oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
					        	   width : "95%",
					        	   showValueHelp: true,
					        	   liveChange : oController.onLiveChange,
								   valueHelpRequest: oController.displayOrgSearchDialog
					        }).addStyleClass("L2P13Font");
							oControl.setValue(vUpdateTextValue);
							oControl.addCustomData(new sap.ui.core.CustomData({
								key : "Orgeh",
								value : vUpdateValue
							}));
						} else if(Fieldname == "Zzprdar" || Fieldname == "Zzprdar2") {
							oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
					        	   width : "95%",
					        	   showValueHelp: true,
					        	   liveChange : oController.onLiveChange,
								   valueHelpRequest: oController.displayPrdAreaSearchDialog
					        }).addStyleClass("L2P13Font");
							oControl.setValue(vUpdateTextValue);
							oControl.addCustomData(new sap.ui.core.CustomData({
								key : Fieldname,
								value : vUpdateValue
							}));
						} else {
							oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
					        	   width : "95%",
					        }).addStyleClass("L2P13Font");
							oControl.setValue(vUpdateTextValue);
							oControl.addCustomData(new sap.ui.core.CustomData({
								key : Fieldname,
								value : vUpdateValue
							}));
						}
					} else if(Fieldtype == "M3" || Fieldtype == "O3") {
						oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
				        	   width : "95%",
				        	   maxLength : vMaxLength
				        }).addStyleClass("L2P13Font");
						oControl.setValue(vUpdateValue);
					} else if(Fieldtype == "M4" || Fieldtype == "O4") {
						oControl = new sap.m.DatePicker(oController.PAGEID + "_" + Fieldname, {
				        	   width : "95%",
				        	   valueFormat : "yyyy-MM-dd",
					           displayFormat : gDtfmt,
					           change : oController.changeDate, 
				        }).addStyleClass("L2P13Font");
						if(vUpdateValue != null && vUpdateValue != "") {
							var tDate = common.Common.setTime(new Date(vUpdateValue));
							oControl.setValue(dateFormat.format(new Date(tDate)));
						}
					}  else if(Fieldtype == "M5" || Fieldtype == "O5") {
						oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
				        	   width : "95%",
				        	   showValueHelp: true,
				        	   liveChange : oController.onLiveChange,
							   valueHelpRequest: oController.displayCodeSearchDialog
				        }).addStyleClass("L2P13Font");
						oControl.setValue(vUpdateTextValue);
						oControl.addCustomData(new sap.ui.core.CustomData({
							key : Fieldname,
							value : vUpdateValue
						}));
						
						if(Fieldname == "Host_werks") {
							if(vUpdateValue != "" && vUpdateValue != "0000") {
								vHost_werks = vUpdateValue;
							}
						}
					} else if(Fieldtype == "M6" || Fieldtype == "O6") {
						oControl = new sap.m.CheckBox(oController.PAGEID + "_" + Fieldname, {
				        	   select : oController.onLiveChange
				        }).addStyleClass("L2P13Font");
						if(vUpdateTextValue == "X") oControl.setSelected(true);
						else  oControl.setSelected(false);
					}
					
					oControl.setTooltip(vLabelText);
					oLabel.setLabelFor(oControl);
					
					oCell = new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Begin,
						vAlign : sap.ui.commons.layout.VAlign.Middle,
						content : oControl
					}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
					oRow.addCell(oCell);
					
					idx++;
				}
				oMatrixLayout.addRow(oRow);
			}
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {oController.BusyDialog.close();};
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
	
	setPersaData : function(oControlId, oControl, fMassnCompany, value, filter) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var oPath = "";
		
		if(oControlId == "Werks") {
			if(fMassnCompany) oPath = "/PersAreaListSet/?$filter=Actty%20eq%20%272%27";
			else oPath = "/PersAreaListSet/?$filter=Actty%20eq%20%271%27";
		} else if(oControlId == "Btrtl") {
//			if(fMassnCompany) oPath = "";
//			else oPath = "/PersSubareaListSet/?$filter=Persa%20eq%20%27" + filter + "%27";
			oPath = "/PersSubareaListSet/?$filter=Persa%20eq%20%27" + filter + "%27";
		} 
		
		try {
			oControl.addItem(new sap.ui.core.Item({key : "0000", text : oBundleText.getText("SELECTDATA")}));
			
//			if(oControlId == "Btrtl" && fMassnCompany) {
//				
//			} else {
				oModel.read(oPath, 
						null, 
						null, 
						false,
						function(oData, oResponse) {					
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									if(oControlId == "Werks") {
										oControl.addItem(new sap.ui.core.Item({key : oData.results[i].Persa, text : oData.results[i].Pbtxt}));
									} else if(oControlId == "Btrtl") {
										oControl.addItem(new sap.ui.core.Item({key : oData.results[i].Btrtl, text : oData.results[i].Btext}));
									}
								}
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
				);
//			}
			
			if(value != "") {
				oControl.setSelectedKey(value);
			}
			
			
		} catch(ex) {
			common.Common.log(ex);
		}
		
	},
	
	initInputControl : function(oController) {
		if(oController._vActiveControl && oController._vActiveControl.length) {
			for(var i=0; i<oController._vActiveControl.length; i++) {
				var Fieldname = oController._vActiveControl[i].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				
				var oControl = sap.ui.getCore().byId(oController.PAGEID + "_" + Fieldname);
				if(oControl) {				
					oControl.destroy(true);
				}
			}
		}
		
		var oMatrixLayout = sap.ui.getCore().byId(oController.PAGEID + "_MatrixLayout");
		if(oMatrixLayout) {
			oMatrixLayout.removeAllRows();
			oMatrixLayout.destroyRows();
		}
		oController._vActiveControl = [];
		oController._vActiveMassn = [];
	},

	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		if(oController._vActionType == "100") {
			var oPersonList = sap.ui.getCore().byId(oController.PAGEID + "_List");
			var vContexts = oPersonList.getSelectedContexts(true);
			if(vContexts && vContexts.length) {
				
			} else {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
				return;
			}
		}
		
		var vCreateData = {};
		
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		
		vCreateData.Docno = oController._vDocno;
		vCreateData.Docty = oController._vDocty;
		vCreateData.Reqno = oController._vReqno;
		vCreateData.Actda = "\/Date(" + common.Common.getTime(oActda.getValue()) + ")\/";
		vCreateData.Batyp = "A";
		vCreateData.Persa = oController._vPersa;
		
		vCreateData.Massn1 = oController.vMassn;
		
		var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg");
		
		vCreateData.Massg1 = oMassg.getCustomData()[0].getValue(); //getSelectedKey();
		vCreateData.Retrs = oMassg.getCustomData()[1].getValue();  //oMassg.getSelectedKey();
		
		if(vCreateData.Massn1 == "" || vCreateData.Massg1 == "") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_MASSNG"));
			return;
		}
		
		try {
			if(oController._vActiveControl && oController._vActiveControl.length) {
				for(var i=0; i<oController._vActiveControl.length; i++) {
					var Fieldname = oController._vActiveControl[i].Fieldname;
					var Fieldtype = oController._vActiveControl[i].Incat;
					Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
					
					if(Fieldname == "Retrs") {
						continue;
					}
					
					var oControl = sap.ui.getCore().byId(oController.PAGEID + "_" + Fieldname);
					
					//입력항목의 유형에 따라 달리 처리한다.
					// M1 : select
					// M2 : Input & Tree Popup
					// M3 : Input only
					// M4 : DatePicker
					// M5 : Input & Select Dialog
					// M6 : Single Checkbox
					
					if(oControl) {
						if(Fieldtype == "M1") {
							if(oControl.getSelectedKey() == "0000" || oControl.getSelectedKey() == "") {
								oControl.addStyleClass("L2PSelectInvalidBorder");
								
								var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_SEL");
								vMsg = vMsg.replace("&Cntl", oBundleText.getText(oController._vActiveControl[i].Fieldname));
								sap.m.MessageBox.alert(vMsg);
								return;
							} else {
								oControl.removeStyleClass("L2PSelectInvalidBorder");
								
								if(oController._vActiveControl[i].id != "Persa") {
									eval("vCreateData." + Fieldname + " = '" + oControl.getSelectedKey() + "';");
								}
							}
						} else if(Fieldtype == "M2") {
							if(oControl.getValue() == "") {
								oControl.setValueState(sap.ui.core.ValueState.Error);
								var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");
								vMsg = vMsg.replace("&Cntl", oBundleText.getText(oController._vActiveControl[i].Fieldname));
								sap.m.MessageBox.alert(vMsg);
								return;
							} else {
								oControl.setValueState(sap.ui.core.ValueState.None);
								var oCustomData = oControl.getCustomData();
								var vVal = ""; 
								if(oCustomData && oCustomData.length) {
									for(var c=0; c<oCustomData.length; c++) {
										var tmpFieldname = "";
										if(Fieldname == "Dis_orgeh" || Fieldname == "Add_orgeh" || Fieldname == "Rls_orgeh" || Fieldname == "Host_orgeh") tmpFieldname = "Orgeh";
										else tmpFieldname = Fieldname;
										
										if(oCustomData[c].getKey() == tmpFieldname) {
											vVal = oCustomData[c].getValue();
										}
									}
								}
								eval("vCreateData." + Fieldname + " = '" + vVal + "';");
								eval("vCreateData." + Fieldname + "_Tx = '" + Encode(oControl.getValue()) + "';"); 
							}
						} else if(Fieldtype == "M3") {
							if(oControl.getValue() == "") {
								oControl.setValueState(sap.ui.core.ValueState.Error);
								var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");
								vMsg = vMsg.replace("&Cntl", oBundleText.getText(oController._vActiveControl[i].Fieldname));
								sap.m.MessageBox.alert(vMsg);
								return;
							} else {
								oControl.setValueState(sap.ui.core.ValueState.None);
								eval("vCreateData." + Fieldname + " = '" + oControl.getValue() + "';");
							}
						} else if(Fieldtype == "M4") {
							if(oControl.getValue() == "") {
								oControl.setValueState(sap.ui.core.ValueState.Error);
								var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");
								vMsg = vMsg.replace("&Cntl", oBundleText.getText(oController._vActiveControl[i].Fieldname));
								sap.m.MessageBox.alert(vMsg);
								return;
							} else {
								oControl.setValueState(sap.ui.core.ValueState.None);
								var vVal = "\/Date(" + common.Common.getTime(oControl.getValue()) + ")\/";
								eval("vCreateData." + Fieldname + " = '" + vVal + "';");
							}
						} else if(Fieldtype == "M5") {
							if(oControl.getValue() == "") {
								oControl.setValueState(sap.ui.core.ValueState.Error);
								var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");
								vMsg = vMsg.replace("&Cntl", oBundleText.getText(oController._vActiveControl[i].Fieldname));
								sap.m.MessageBox.alert(vMsg);
								return;
							} else {
								oControl.setValueState(sap.ui.core.ValueState.None);
								var oCustomData = oControl.getCustomData();
								var vVal = ""; 
								if(oCustomData && oCustomData.length) {
									for(var c=0; c<oCustomData.length; c++) {
										if(oCustomData[c].getKey() == Fieldname) {
											vVal = oCustomData[c].getValue();
										}
									}
								}
								eval("vCreateData." + Fieldname + " = '" + vVal + "';");
								eval("vCreateData." + Fieldname + "_Tx = '" + oControl.getValue() + "';");
							}
						} else if(Fieldtype == "M6") {
							if(oControl.getSelected() == false) {
								var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_SEL");
								vMsg = vMsg.replace("&Cntl", oBundleText.getText(oController._vActiveControl[i].Fieldname));
								sap.m.MessageBox.alert(vMsg);
								return;
							} else {
								var vVal = "X"; 
								eval("vCreateData." + Fieldname + " = '" + vVal + "';");
							}
						} else if(Fieldtype == "O1") {
							if(oControl.getSelectedKey() == "0000" || oControl.getSelectedKey() == "") {
								
							} else {
								oControl.removeStyleClass("L2PSelectInvalidBorder");
								
								if(oController._vActiveControl[i].id != "Persa") {
									eval("vCreateData." + Fieldname + " = '" + oControl.getSelectedKey() + "';");
								}
							}
						} else if(Fieldtype == "O2") {
							if(oControl.getValue() == "") {
								
							} else {
								oControl.setValueState(sap.ui.core.ValueState.None);
								var oCustomData = oControl.getCustomData();
								var vVal = ""; 
								if(oCustomData && oCustomData.length) {
									for(var c=0; c<oCustomData.length; c++) {
										var tmpFieldname = "";
										if(Fieldname == "Dis_orgeh" || Fieldname == "Add_orgeh" || Fieldname == "Rls_orgeh" || Fieldname == "Host_orgeh") tmpFieldname = "Orgeh";
										else tmpFieldname = Fieldname;
										
										if(oCustomData[c].getKey() == tmpFieldname) {
											vVal = oCustomData[c].getValue();
										}
									}
								}
								eval("vCreateData." + Fieldname + " = '" + vVal + "';");
								eval("vCreateData." + Fieldname + "_Tx = '" + Encode(oControl.getValue()) + "';");
							}
						} else if(Fieldtype == "O3") {
							if(oControl.getValue() == "") {
								
							} else {
								oControl.setValueState(sap.ui.core.ValueState.None);
								eval("vCreateData." + Fieldname + " = '" + oControl.getValue() + "';");
							}
						} else if(Fieldtype == "O4") {
							if(oControl.getValue() == "") {
								
							} else {
								oControl.setValueState(sap.ui.core.ValueState.None);
								
								var vVal = "\/Date(" + common.Common.getTime(oControl.getValue()) + ")\/";
								eval("vCreateData." + Fieldname + " = '" + vVal + "';");
							}
						} else if(Fieldtype == "O5") {
							if(oControl.getValue() == "") {
								
							} else {
								oControl.setValueState(sap.ui.core.ValueState.None);
								var oCustomData = oControl.getCustomData();
								var vVal = ""; 
								if(oCustomData && oCustomData.length) {
									for(var c=0; c<oCustomData.length; c++) {
										if(oCustomData[c].getKey() == Fieldname) {
											vVal = oCustomData[c].getValue();
										}
									}
								}
								eval("vCreateData." + Fieldname + " = '" + vVal + "';");
								eval("vCreateData." + Fieldname + "_Tx = '" + oControl.getValue() + "';");
							}
						} else if(Fieldtype == "O6") {
							var vVal = ""; 
							if(oControl.getSelected() == true) {
								vVal = "X";
							}
							eval("vCreateData." + Fieldname + " = '" + vVal + "';");
						} 
					}
				}
			}
			
			var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
			
			if(oController._vActionType == "100") {
				var oPersonList = sap.ui.getCore().byId(oController.PAGEID + "_List");
				var vContexts = oPersonList.getSelectedContexts(true);
				var oPath = "/ActionSubjectListSet";
				var process_result = false;
				
				if(vContexts && vContexts.length) {		
					var vSelectedPernr = [];
					
					for(var i=0; i<vContexts.length; i++) {
						vCreateData.Pernr = mActionSubjectList_Temp.getProperty(vContexts[i] + "/Pernr");
						vCreateData.Ename = mActionSubjectList_Temp.getProperty(vContexts[i] + "/Ename");
						
						var vPersg =  mActionSubjectList_Temp.getProperty(vContexts[i] + "/Persg");
						if(vPersg == "9") vCreateData.Massg1 = "10";
						
						vSelectedPernr.push(vCreateData.Pernr);
						
						process_result = false;
						
						oModel.create(
								oPath, 
								vCreateData, 
								null,
							    function (oData, response) {
									process_result = true;
									common.Common.log("Sucess ActionSubjectListSet Create !!!");
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
							return
						} else {
							
						}
					}
					
					var vActionSubjectList_Temp = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet");
					var vNewActionSubjectList = {ActionSubjectListSet : []};
					for(var i=0; i<vActionSubjectList_Temp.length; i++) {
						var fExits = false;
						for(var j=0; j<vSelectedPernr.length; j++) {
							if(vActionSubjectList_Temp[i].Pernr == vSelectedPernr[j]) {
								fExits = true;
								break;
							}
						}	
						if(!fExits) {
							vNewActionSubjectList.ActionSubjectListSet.push(vActionSubjectList_Temp[i]);
						}
					}
					mActionSubjectList_Temp.setData(vNewActionSubjectList);
				} else {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
					return;
				}
			} else {
				
				var process_result = false;
				
				vCreateData.Pernr = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet/0/Pernr");
				vCreateData.Ename = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet/0/Ename");
				vCreateData.VoltId = oController._vUpdateData.VoltId;
				
				var oPath = "/ActionSubjectListSet(Docno='" + encodeURI(oController._vDocno) + "',"
		                  + "Pernr='" +  vCreateData.Pernr + "',"
		                  + "VoltId='" +  oController._vUpdateData.VoltId + "',"
		                  + "Actda=" +  "datetime%27" + oActda.getValue() + "T00%3a00%3a00%27" + ")";
				
				oModel.update(
						oPath, 
						vCreateData, 
						null,
					    function (oData, response) {
							process_result = true;
							common.Common.log("Sucess ActionSubjectListSet Update !!!");
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
					return
				} else {
					
				}			
			}
			
			oMassg.setEnabled(false);
			//oMassg.setSelectedKey("0000");
			oMassg.setValue("");
			oMassg.removeAllCustomData();
			
			var oInputSwith = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
			oInputSwith.setState(false);
			
			oController.initInputControl(oController);
			
			var vActionSubjectList_Temp = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet");
			
			if(oController._vActionType == "100") {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
					title : oBundleText.getText("INFORMATION"),
					onClose : function(oEvent) {
						if(vActionSubjectList_Temp == null || vActionSubjectList_Temp.length < 1) {
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
					}
				});
			} else {
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
			}
		} catch(ex) {
			common.Common.log(ex);
		}
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
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
	
	displayOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Single";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "Input";
		
		if(!oController._SerachOrgDialog) {
			oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SerachOrgDialog);
		}
		oController._SerachOrgDialog.open();
		
	},
	
	displayPrdAreaSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		var mProductAreaModel = new sap.ui.model.json.JSONModel();
		var vProductAreaModel = {PrdAreaCodeListSet : []};
		var mEmpCodeList = sap.ui.getCore().getModel("EmpCodeList");
		var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
		if(vEmpCodeList && vEmpCodeList.length) {
			for(var i=0; i<vEmpCodeList.length; i++) {
				if(vEmpCodeList[i].Field == "Zzprdar" && vEmpCodeList[i].Ecode != "0000") {
					vProductAreaModel.PrdAreaCodeListSet.push(vEmpCodeList[i]);
				}
			}
		}
		mProductAreaModel.setData(vProductAreaModel);
		sap.ui.getCore().setModel(mProductAreaModel, "ProductAreaModel");
		
		common.SearchPrdArea.oController = oController;
		common.SearchPrdArea.vCallControlId = oEvent.getSource().getId();
		
		if(!oController._PrdAreaSearchDialog) {
			oController._PrdAreaSearchDialog = sap.ui.jsfragment("fragment.ProductAreaSearch", oController);
			oView.addDependent(oController._PrdAreaSearchDialog);
		}
		oController._PrdAreaSearchDialog.open();
		
	},
	
	displayCodeSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		var mOneCodeModel =sap.ui.getCore().getModel("CodeListModel");
		mOneCodeModel.setData(null);
		var vOneCodeList = {EmpCodeListSet : []};
		
		var oCustomData = oEvent.getSource().getCustomData();
		var Fieldname = oCustomData[0].getKey();
		
		var mEmpCodeList = sap.ui.getCore().getModel("EmpCodeList");
		var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
		if(vEmpCodeList && vEmpCodeList.length) {
			for(var i=0; i<vEmpCodeList.length; i++) {
				if(vEmpCodeList[i].Field == Fieldname && vEmpCodeList[i].Ecode != "0000") {
					vOneCodeList.EmpCodeListSet.push(vEmpCodeList[i]);
				}
			}
		}
		mOneCodeModel.setData(vOneCodeList);
		
		common.SearchCode.oController = oController;
		common.SearchCode.vCallControlId = oEvent.getSource().getId();
		
		if(!oController._CodeSearchDialog) {
			oController._CodeSearchDialog = sap.ui.jsfragment("fragment.CodeSearch", oController);
			oView.addDependent(oController._CodeSearchDialog);
		}
		oController._CodeSearchDialog.open();
		
		var oDialog = sap.ui.getCore().byId(oController.PAGEID + "_FCS_Dialog");
		oDialog.setTitle(oBundleText.getText(Fieldname.toUpperCase()));
	},
	
	displayMultiStellSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchStell");
		
		common.SearchStell.oController = oController;
		common.SearchStell.vActionType = "Multi";
		common.SearchStell.vCallControlId = oEvent.getSource().getId();
		common.SearchStell.vCallControlType = "MultiInput";
		
		if(!oController._SerachStellDialog) {
			oController._SerachStellDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_STELL", oController);
			oView.addDependent(oController._SerachStellDialog);
		}
		oController._SerachStellDialog.open();
		
	},
	
	displayStellSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchStell");
		
		common.SearchStell.oController = oController;
		common.SearchStell.vActionType = "Single";
		common.SearchStell.vCallControlId = oEvent.getSource().getId();
		common.SearchStell.vCallControlType = "Input";
		
		if(!oController._SerachStellDialog) {
			oController._SerachStellDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_STELL", oController);
			oView.addDependent(oController._SerachStellDialog);
		}
		oController._SerachStellDialog.open();		
	},
	
	displayEmplyeeSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		jQuery.sap.require("common.ActionSearchUser");
		
		common.ActionSearchUser.oController = oController;
		common.ActionSearchUser.vCallControlId = oEvent.getSource().getId();
		
		if(!oController._SerachEmplyeeDialog) {
			oController._SerachEmplyeeDialog = sap.ui.jsfragment("fragment.ActionEmployeeSearch", oController);
			oView.addDependent(oController._SerachEmplyeeDialog);
		}
		oController._SerachEmplyeeDialog.open();		
	},
	
	/* Werks를 변경했을때 인사하위영역 값을 변경 한다. */
	onPressWerks : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		var vWerks = oEvent.getSource().getSelectedKey();

		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var oBtrtl = sap.ui.getCore().byId(oController.PAGEID + "_Btrtl");
		if(oBtrtl) {
			var oPath = "/PersSubareaListSet/?$filter=Persa%20eq%20%27" + vWerks + "%27";
			try {
				oBtrtl.removeAllItems();
				oBtrtl.destroyItems();
				oBtrtl.addItem(new sap.ui.core.Item({key : "0000", text : oBundleText.getText("SELECTDATA")}));
				oModel.read(oPath, 
						null, 
						null, 
						false,
						function(oData, oResponse) {					
							if(oData && oData.results.length) {
								for(var i=0; i<oData.results.length; i++) {
									oBtrtl.addItem(new sap.ui.core.Item({key : oData.results[i].Btrtl, text : oData.results[i].Btext}));
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
		}
	},
	
	onPressHost_werks : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		var oHost_werks = oEvent.getSource(); //sap.ui.getCore().byId(oController.PAGEID + "_Host_werks");
		
		var vWerks = oHost_werks.getSelectedKey();
		
		oController.onSelectHost_werks(vWerks);
//		console.log("vWerks : " + vWerks);
//		
//		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
//		
//		var oHost_staff = sap.ui.getCore().byId(oController.PAGEID + "_Host_staff");
//		if(oHost_staff) {
//			var oPath = "/HostStaffListSet/?$filter=Host_werks%20eq%20%27" + vWerks + "%27"
//			          + "%20and%20Actda%20eq%20datetime%27" + oController._vActda + "T00%3a00%3a00%27";
//			try {
//				oHost_staff.removeAllItems();
//				oHost_staff.destroyItems();
//				oHost_staff.addItem(new sap.ui.core.Item({key : "0000", text : oBundleText.getText("SELECTDATA")}));
//				oModel.read(oPath, 
//						null, 
//						null, 
//						false,
//						function(oData, oResponse) {					
//							if(oData && oData.results.length) {
//								for(var i=0; i<oData.results.length; i++) {
//									oHost_staff.addItem(new sap.ui.core.Item({key : oData.results[i].Host_staff, text : oData.results[i].Host_staff_Tx}));
//								}
//							}
//						},
//						function(oResponse) {
//							common.Common.log(oResponse);
//						}
//				);		
//				
//			} catch(ex) {
//				common.Common.log(ex);
//			}
//		}
	},
	
	onSelectHost_werks : function(vWerks) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
//		var oHost_werks = oEvent.getSource(); //sap.ui.getCore().byId(oController.PAGEID + "_Host_werks");
//		
//		var vWerks = oHost_werks.getSelectedKey();
		console.log("vWerks : " + vWerks);
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var oHost_staff = sap.ui.getCore().byId(oController.PAGEID + "_Host_staff");
		if(oHost_staff) {
			var oPath = "/HostStaffListSet/?$filter=Host_werks%20eq%20%27" + vWerks + "%27"
			          + "%20and%20Actda%20eq%20datetime%27" + oController._vActda + "T00%3a00%3a00%27";
			try {
				oHost_staff.removeAllItems();
				oHost_staff.destroyItems();
				oHost_staff.addItem(new sap.ui.core.Item({key : "0000", text : oBundleText.getText("SELECTDATA")}));
				oModel.read(oPath, 
						null, 
						null, 
						false,
						function(oData, oResponse) {					
							if(oData && oData.results.length) {
								for(var i=0; i<oData.results.length; i++) {
									oHost_staff.addItem(new sap.ui.core.Item({key : oData.results[i].Host_staff, text : oData.results[i].Host_staff_Tx}));
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
		}
	},
	
	onPressAllUnSelect : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		var oList = sap.ui.getCore().byId(oController.PAGEID + "_List");
		var oItems = oList.getItems();
		if(oItems && oItems.length) {
			for(var i=0; i<oItems.length; i++) {
				oList.setSelectedItem(oItems[i], false);
			}
		}
		
		var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg");
		oMassg.setValue("");
		oMassg.removeAllCustomData();
		
		oController.initInputControl(oController);
		
		var oInputSwith = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
		oInputSwith.setState(false);
	},
	
	onPressAllSelect : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		var oList = sap.ui.getCore().byId(oController.PAGEID + "_List");
		var oItems = oList.getItems();
		if(oItems && oItems.length) {
			for(var i=0; i<oItems.length; i++) {
				oList.setSelectedItem(oItems[i], true);
			}
		}
		
		var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg");
		oMassg.setValue("");
		oMassg.removeAllCustomData();
	},
	
	setSpecialCodeData : function(Fieldname, vAddFilter) {
		
		var mCodeModel = new sap.ui.model.json.JSONModel();
		var vCodeModel = {EmpCodeListSet : []};
		
		var filterString = "/?$filter=Field%20eq%20%27" + Fieldname + "%27";
		filterString += "%20and%20(";
		for(var i=0; i<vAddFilter.length; i++) {
			if(vAddFilter[i].key != "Actda") {
				filterString += vAddFilter[i].key + "%20eq%20%27" + vAddFilter[i].value + "%27";
			} else {
				filterString += "Actda%20eq%20datetime%27" + vAddFilter[i].value + "T00%3a00%3a00%27";
			}
			
			if(i != (vAddFilter.length - 1)) {
				filterString += "%20and%20";
			}
		}
		filterString += ")";
		
		vCodeModel.EmpCodeListSet.push({Field : Fieldname, Ecode : "0000", Etext : oBundleText.getText("SELECTDATA")});
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		oCommonModel.read("/EmpCodeListSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vCodeModel.EmpCodeListSet.push(oData.results[i]);
							}
							mCodeModel.setData(vCodeModel);	
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
		
		return mCodeModel;
	},
	
	setRlsOrgehCodeData : function(Fieldname, vAddFilter) {
	//	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
	//	var oController = oView.getController();
		
		var mReleaseOrgListSet = new sap.ui.model.json.JSONModel();
		var vReleaseOrgListSet = {ReleaseOrgListSet : []};
		
		var filterString = "/?$filter=";
		for(var i=0; i<vAddFilter.length; i++) {
			if(vAddFilter[i].key != "Actda") {
				filterString += vAddFilter[i].key + "%20eq%20%27" + vAddFilter[i].value + "%27";
			} else {
				filterString += "Actda%20eq%20datetime%27" + vAddFilter[i].value + "T00%3a00%3a00%27";
			}
			
			if(i != (vAddFilter.length - 1)) {
				filterString += "%20and%20";
			}
		}
		
		vReleaseOrgListSet.ReleaseOrgListSet.push({Field : Fieldname, Rls_orgeh : "0000", Rls_orgeh_Tx : oBundleText.getText("SELECTDATA")});
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		oModel.read("/ReleaseOrgListSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vReleaseOrgListSet.ReleaseOrgListSet.push(oData.results[i]);
							}
							mReleaseOrgListSet.setData(vReleaseOrgListSet);	
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
		
		return mReleaseOrgListSet;
	},
	
	setRlsWerksCodeData : function(Fieldname, vAddFilter) {
			
			var mReleasePersAreaListSet = new sap.ui.model.json.JSONModel();
			var vReleasePersAreaListSet = {ReleasePersAreaListSet : []};
			
			var filterString = "/?$filter=";
			for(var i=0; i<vAddFilter.length; i++) {
				if(vAddFilter[i].key != "Actda") {
					filterString += vAddFilter[i].key + "%20eq%20%27" + vAddFilter[i].value + "%27";
				} else {
					filterString += "Actda%20eq%20datetime%27" + vAddFilter[i].value + "T00%3a00%3a00%27";
				}
				
				if(i != (vAddFilter.length - 1)) {
					filterString += "%20and%20";
				}
			}
			
			vReleasePersAreaListSet.ReleasePersAreaListSet.push({Field : Fieldname, Rls_werks : "0000", Rls_werks_Tx : oBundleText.getText("SELECTDATA")});
			
			var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
			
			oModel.read("/ReleasePersAreaListSet" + filterString, 
						null, 
						null, 
						false,
						function(oData, oResponse) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									vReleasePersAreaListSet.ReleasePersAreaListSet.push(oData.results[i]);
								}
								mReleasePersAreaListSet.setData(vReleasePersAreaListSet);	
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
			);
			
			return mReleasePersAreaListSet;
	},
		
	setHomeStaffCodeData : function(Fieldname, vAddFilter) {
			
		var mHomeStaffListSet = new sap.ui.model.json.JSONModel();
		var vHomeStaffListSet = {HomeStaffListSet : []};
		
		var filterString = "/?$filter=";
		for(var i=0; i<vAddFilter.length; i++) {
			if(vAddFilter[i].key != "Actda") {
				filterString += vAddFilter[i].key + "%20eq%20%27" + vAddFilter[i].value + "%27";
			} else {
				filterString += "Actda%20eq%20datetime%27" + vAddFilter[i].value + "T00%3a00%3a00%27";
			}
			
			if(i != (vAddFilter.length - 1)) {
				filterString += "%20and%20";
			}
		}
		
		vHomeStaffListSet.HomeStaffListSet.push({Field : Fieldname, Home_staff : "0000", Home_staff_Tx : oBundleText.getText("SELECTDATA")});
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		oModel.read("/HomeStaffListSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vHomeStaffListSet.HomeStaffListSet.push(oData.results[i]);
							}
							mHomeStaffListSet.setData(vHomeStaffListSet);	
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
		
		return mHomeStaffListSet;
	},
	
	setHostStaffCodeData : function(Fieldname, vAddFilter) {
		
		var mHostStaffListSet = new sap.ui.model.json.JSONModel();
		var vHostStaffListSet = {HostStaffListSet : []};
		
		var filterString = "/?$filter=";
		for(var i=0; i<vAddFilter.length; i++) {
			console.log("Filter : " + vAddFilter[i].key + ", " + vAddFilter[i].value);
			if(vAddFilter[i].key != "Actda") {
				filterString += vAddFilter[i].key + "%20eq%20%27" + vAddFilter[i].value + "%27";
			} else {
				filterString += "Actda%20eq%20datetime%27" + vAddFilter[i].value + "T00%3a00%3a00%27";
			}
			
			if(i != (vAddFilter.length - 1)) {
				filterString += "%20and%20";
			}
		}
		
		vHostStaffListSet.HostStaffListSet.push({Field : Fieldname, Host_staff : "0000", Host_staff_Tx : oBundleText.getText("SELECTDATA")});
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		oModel.read("/HostStaffListSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vHostStaffListSet.HostStaffListSet.push(oData.results[i]);
							}
							mHostStaffListSet.setData(vHostStaffListSet);	
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
		
		return mHostStaffListSet;
	},
	
	onPressTrfgr : function(oEvent) {		
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		
		var oTrfst = sap.ui.getCore().byId(oController.PAGEID + "_Trfst");
		if(oTrfst) {
			if(oControl.getSelectedKey() != "0000") {
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda},
				                  {key : "Excod", value : oControl.getSelectedKey()},
				                  {key : "Pernr", value : oController._vPernr}];
				
				var mDataModel = oController.setSpecialCodeData("Trfst", vAddFilter);							
				
				oTrfst.setModel(mDataModel);
				oTrfst.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
			} else {
				oTrfst.removeAllItems();
				oTrfst.destroyItems();
				oTrfst.addItem(new sap.ui.core.Item({key : "0000", text : oBundleText.getText("SELECTDATA")}));
			}
		}
	},
	
	onPressPersg : function(oEvent) {		
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_Persk");
		if(oPersk) {
			if(oControl.getSelectedKey() != "0000") {
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda},
				                  {key : "Excod", value : oControl.getSelectedKey()}];
				
				var mDataModel = oController.setSpecialCodeData("Persk", vAddFilter);							
				
				oPersk.setModel(mDataModel);
				oPersk.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				oPersk.setSelectedKey("0000");
			} else {
				oPersk.removeAllItems();
				oPersk.destroyItems();
				oPersk.addItem(new sap.ui.core.Item({key : "0000", text : oBundleText.getText("SELECTDATA")}));
			}
		}
		try {
			var oPrbda = sap.ui.getCore().byId(oController.PAGEID + "_Prbda"); //PRBDA
			if(oPrbda) {
				if(oControl.getSelectedKey() != "0000") {
					var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
					
					var filterString = "/?$filter=Persg%20eq%20%27" + oControl.getSelectedKey() + "%27";
					filterString += "%20and%20Actda%20eq%20datetime%27" + oController._vActda + "T00%3a00%3a00%27";
					filterString += "%20and%20Persa%20eq%20%27" + oController._vPersa + "%27";
					
					var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
					var vPrbda = null;
					oModel.read("/ProbationEndDateSet" + filterString, 
								null, 
								null, 
								false,
								function(oData, oResponse) {
									if(oData && oData.results.length) {
										vPrbda = oData.results[0].Prbda;
									}
								},
								function(oResponse) {
									common.Common.log(oResponse);
								} 
					);
					if(vPrbda != null) oPrbda.setValue(dateFormat.format(vPrbda));
					else oPrbda.setValue("");
				}
			}
		} catch(ex) {
			console.log(ex);
		}	
		
	},
	
	onLiveChange : function(oEvent) {
		var s = oEvent.getParameter("value");
		if(s == "") {
			oEvent.getSource().removeAllCustomData();
		}
	},
	
	onChangeActda : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_DATE"),{
				onClose : function() {
					oControl.setValue("");
				}
			});
		} else {
			var vDate = oEvent.getParameter("value");
			oController._vActda = vDate;
		}
	},
	
	onPressChangeDate : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		if(!oController._ChangeDateDialog) {
			oController._ChangeDateDialog = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ChangeDateDialog", oController);
			oView.addDependent(oController._ChangeDateDialog);
		}
		oController._ChangeDateDialog.open();
	},
	
	onCDClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		if(oController._ChangeDateDialog.isOpen()) {
			oController._ChangeDateDialog.close();
		}
	},
	
	onChangeActionDate : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		var vUpdateData = {};
		
		var oCDActda = sap.ui.getCore().byId(oController.PAGEID + "_CD_Actda");
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		
		vUpdateData.Docno = oController._vDocno;
		vUpdateData.Pernr = oController._vPernr;
		vUpdateData.VoltId = oController._vPernrVoltid;
		vUpdateData.Actda = "\/Date(" + common.Common.getTime(oActda.getValue()) + ")\/";
		vUpdateData.ActdaAft = "\/Date(" + common.Common.getTime(oCDActda.getValue()) + ")\/";
		
		var process_result = false;
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var oPath = "/ActionDateSet(Docno='" + oController._vDocno + "',"
                  + "Pernr='" +  oController._vPernr + "',"
                  + "VoltId='" +  oController._vPernrVoltid + "',"
                  + "Actda=" +  "datetime%27" + oActda.getValue() + "T00%3a00%3a00%27" + ")";
//		var oPath = "/ActionDateSet";
		
		oModel.update(
				oPath, 
				vUpdateData, 
				null,
			    function (oData, response) {
					process_result = true;
					oController._vActda = oCDActda.getValue();
					oController._vPernrActda = new Date(oCDActda.getValue());
					oActda.setValue(oCDActda.getValue());
					
					common.Common.log("Sucess ActionDate Update !!!");
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
			return
		}
		
		sap.m.MessageBox.alert(oBundleText.getText("MSG_ACTDA_CHANGE"), {
			title : oBundleText.getText("INFORMATION")
		});
		
		oController.onCDClose();
	},
	
	onBeforeOpenChangeDateDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();
		
		var oCDActda = sap.ui.getCore().byId(oController.PAGEID + "_CD_Actda");
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		
		oCDActda.setValue(oActda.getValue());
	},
	
	changeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_DATE"),{
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	},
	
	_ODialogSearchRetrs: null,
	_ORetrsControl : null,
	onDisplaySearchRetrsDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
		var oController = oView.getController();	
		
		oController._ORetrsControl = oEvent.getSource();
		
		if(!oController._ODialogSearchRetrs) {
			oController._ODialogSearchRetrs = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.RetireReasonDialog", oController);
			oView.addDependent(oController._ODialogSearchRetrs);
		}
		oController._ODialogSearchRetrs.open();
		
		//oController.onSetRetrsData();
	},
	
//	onSetRetrsData : function() {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
//		var oController = oView.getController();
//		
//		var oListItem = sap.ui.getCore().byId(oController.PAGEID + "_RetireReasonList");
//		var oDialog = sap.ui.getCore().byId(oController.PAGEID + "_RetireReason_Dialog");
//		
//		oDialog.bindAggregation("items", {
//			path : "/RetirementReasonSet",
//			template : oListItem
//		});
//	},
	
	onSearchRetrs : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Mgtxt", sap.ui.model.FilterOperator.Contains, sValue));
	    
		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter(oFilters);
	},

	onConfirmRetrs : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRetirePersonInfo");
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
			
			var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVEPERSON_BTN");
			oSaveBtn.setEnabled(false);
			
			oController.initInputControl(oController);
	    }
		
		oController.onCancelRetrs(oEvent);
	},
		
	onCancelRetrs : function(oEvent) {
		var oBinding = oEvent.getSource().getBinding("items");
	    oBinding.filter([]);
	},
});

function Encode(fVal) {
	var str = encodeURIComponent(fVal);
	str = str.replace(/'/g,"%27");
	str = str.replace(/"/g,"%22");
	
	return str;
}