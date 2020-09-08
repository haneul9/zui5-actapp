jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");
jQuery.sap.require("common.SearchPrdArea");
jQuery.sap.require("common.SearchCode");
jQuery.sap.require("zui5_hrxx_actapp2.common.Common");

sap.ui.controller("zui5_hrxx_actapp2.ActAppPersonInfo", {
	
	PAGEID : "ActAppPersonInfo",
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
	
	_vPernrActda : "",
	_vPernrVoltid : "",
	
	_vUpdateData : null,
	
	_vFromPageId : "",
	
	BusyDialog : new sap.m.BusyDialog(),	
	
	_vActiveControl : null, //활성화된 발령내역 입력 항목
	_vActiveGroup : null,
	_vActiveMassn : null, //선택된 발령유형/사유
	_vSelectedTrfgr : "",
	_vSelectedPersg : "",
	_vSelectedPersk : "",
	_vSelectedBtrtl : "",
	_vWerksUpdateValue : "",
	_vHost_werks : "",
	_vRet_persa : "",
	
	_vSelectedTrfar : "",
	_vSelectedTrfgb : "",
	_vSelectedZzikgb : "",
	
	_vPreSelectedMassn : [],
	_vPreSelectedMassg : [],
	
	_vTableColumns : null,
	_vPositionnocopy : "",
	_vDefaultTableColumns : ["Docno", "VoltId", "Actda", "Pernr", "Infty", "Subty", "Objps", "Sprps", "Endda", "Begda", "Seqnr", "Numbr", "Isnew"],

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actapp2.ActAppPersonInfo
*/
	onInit: function() {
		//if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
	    //};
	    
        this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				//this.onBeforeShow(evt);
			}, this),
			onAfterShow  : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
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
        
        
        var oGroupingInputLayout = sap.ui.getCore().byId(this.PAGEID + "_GroupingInputLayout");
        if(oGroupingInputLayout) {
        	oGroupingInputLayout.setHeight((this.ContentHeight - 180) + "px");
        }
        
        if(this._vActiveGroup && this._vActiveGroup.length > 0) {
        	oScroller2.setVertical(false);
        } else {
        	oScroller2.setVertical(true);
        }
	},
	
	onBeforeShow : function(oEvent) {
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
		
		this.loadActionTypeList();
		
		var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
		
		var oControl = sap.ui.getCore().byId(this.PAGEID + "_ADDPERSON_BTN");
		var oList = sap.ui.getCore().byId(this.PAGEID + "_List");
		var oSaveBtn = sap.ui.getCore().byId(this.PAGEID + "_SAVEPERSON_BTN");
		var oActda = sap.ui.getCore().byId(this.PAGEID + "_Actda");
		var oChangeDate = sap.ui.getCore().byId(this.PAGEID + "_ChangeDate");
		
		var oAllSel = sap.ui.getCore().byId(this.PAGEID + "_ALLSELECT_BTN");
		var oAllUnSel = sap.ui.getCore().byId(this.PAGEID + "_ALLUNSELECT_BTN");
		
		var oPageTitle = sap.ui.getCore().byId(this.PAGEID + "_PAGETITLE");
		
		var oIssuedTypeMatrix2 = sap.ui.getCore().byId(this.PAGEID + "_IssuedTypeMatrix2"); //
		var oReasonSwitch = sap.ui.getCore().byId(this.PAGEID + "_Reason_Switch");
		
		oIssuedTypeMatrix2.setVisible(false);
		oReasonSwitch.setState(false);
		
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
			
			oPageTitle.setText("발령대상자 수정");
			
		} else if(this._vActionType == "300") {
			this._vPernr = oEvent.data.Pernr;
			if(this._vPernr == undefined) this._vPernr = ""; 
			this.setMultiPersonData(this);
			
			this._vUpdateData = null;
			
			oControl.setVisible(false);
			oAllSel.setVisible(true);
			oAllUnSel.setVisible(true);
			oList.setMode(sap.m.ListMode.MultiSelect);
			oSaveBtn.setEnabled(true);
			oActda.setValue(this._vActda);
			//oActda.setValue(dateFormat.format(new Date(this._vActda)));
			oActda.setEnabled(true);
			oChangeDate.setVisible(false);
			
			if(this._vDocty != "50") {
				for(var i=0; i<5; i++) {
					var oMassg = sap.ui.getCore().byId(this.PAGEID + "_Massg" + (i+1));				
					oMassg.setEnabled(false);
					oMassg.setSelectedKey("");
					oMassg.removeAllItems();
				}
			}			
			
			oPageTitle.setText("발령대상자 등록");
			
			var oInputSwith = sap.ui.getCore().byId(this.PAGEID + "_Input_Switch");
			oInputSwith.setEnabled(true);
			oInputSwith.setState(false);
			
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
			
			for(var i=0; i<5; i++) {
				var oMassn = sap.ui.getCore().byId(this.PAGEID + "_Massn" + (i+1));
				var oMassg = sap.ui.getCore().byId(this.PAGEID + "_Massg" + (i+1));
				
				oMassn.setEnabled(false);
				oMassg.setEnabled(false);
				oMassg.setSelectedKey("0000");
				oMassg.removeAllItems();
			}
			
			oSaveBtn.setEnabled(false);
			
			oPageTitle.setText("발령대상자 등록");
			
			var oInputSwith = sap.ui.getCore().byId(this.PAGEID + "_Input_Switch");
			oInputSwith.setEnabled(false);
			oInputSwith.setState(false);
			
			this.addPerson();
		}
		var oController = this ;
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		try {
			oModel.read(
					"/ActionReqListSet(Docno='" + this._vDocno + "')",
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData) {
							oController._vPositionnocopy = oData.Positionnocopy;
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
		} catch(ex) {
			common.Common.log(ex);
		}
		
	},
	
	setUpdateData : function(oController, Pernr, Actda, VoltId) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var filterString = ""; 
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
						if(oData.results.length ==  2) {
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
			sap.m.MessageBox.alert("발령유형 값이 없어서 수정할 수 없습니다.", {
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
			Photo : oController._vUpdateData.Photo
		});
		mActionSubjectList_Temp.setData(vActionSubjectList_Temp);
		
		var vMassns = [];
		var vMassgs = [];
		for(var i=0; i<5; i++) {
			eval("vMassns.push(oController._vUpdateData.Massn" + (i+1) + ");");
			eval("vMassgs.push(oController._vUpdateData.Massg" + (i+1) + ");");
		}
		
		for(var i=0; i<5; i++) {
			var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
			oMassn.setEnabled(true);
			if(vMassns[i] != "") {
				oMassn.setSelectedKey(vMassns[i]);
				
				var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
				oMassg.destroyItems();
				
				var filterString1 = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
				filterString1 += "%20and%20Actda%20eq%20datetime%27" + oController._vActda + "T00%3a00%3a00%27";
				
				oModel.read("/ActionReasonListSet"  + filterString1 + "%20and%20Massn%20eq%20%27" + vMassns[i] + "%27", 
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
				
				oMassg.setEnabled(true);
				oMassg.setSelectedKey(vMassgs[i]);
			}
		}
		
		//발령유형이 채용, 겸직/겸무, 휴직, 퇴사의 경우 1개의 발령유형만 선택가능하다.
		//if(vSelectedMassn1 == "10" || vSelectedMassn1 == "22" || vSelectedMassn1 == "60" || vSelectedMassn1 == "90") {
		if(vSelectedMassn1 == "10" || vSelectedMassn1 == "60" || vSelectedMassn1 == "90") {
			for(var i=1; i<5; i++) {
				var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
				var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
				oMassn.setEnabled(false);
				oMassg.setEnabled(false);
			}
		}
		
		//활설화 입력항목을 가져온다.
		var fMassnCompany = false;
		
		for(var i=0; i<5; i++) {
			if(vMassns[i] != "" ){ // && vMassgs[i] != "") {
				oController._vActiveMassn.push({Massn : vMassns[i], Massg : vMassgs[i]});
				
				//발령유형이 법인간 발령계획 일 떄 인사연역, 인사하위영역을  한다.
				if(vMassns[i] == "81" || vMassns[i] == "ZA") {
					fMassnCompany = false;
				}
				//발령유형이 퇴사이고 발령사유가 전출인 경우 일 떄 인사연역, 인사하위영역을 ??? 한다.
				if(vMassns[i] == "92" && vMassgs[i] == "20") {
					fMassnCompany = true;
				}
				
				oController.getActionInputFieldSet(oController, vMassns[i], vMassgs[i]);
				
				oController.getActionDetailLayoutInfoSet(oController, vMassns[i], vMassgs[i]);
			}
		}
		
		if(oController._vActiveGroup && oController._vActiveGroup.length > 0) {
			oController._vActiveGroup.push({Itgrp : "", Itgrptx : "  "});
			
			oController.setGroupInputFiled("U", oController, fMassnCompany, oController._vUpdateData);
		} else {
			oController.setInputFiled("U", oController, fMassnCompany, oController._vUpdateData);
		}
		
		var oInputSwith = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
		oInputSwith.setEnabled(true);
		oInputSwith.setState(true);
		
		//발령유형이 Multi 이면 발령유형/사유 선택을 Multi 화 한다.
		var oIssuedTypeMatrix2 = sap.ui.getCore().byId(oController.PAGEID + "_IssuedTypeMatrix2"); //
		var oReasonSwitch = sap.ui.getCore().byId(oController.PAGEID + "_Reason_Switch");
		
		if(oController._vActiveMassn.length > 1) {
			oIssuedTypeMatrix2.setVisible(true);
			oReasonSwitch.setState(true);
		} else {
			oIssuedTypeMatrix2.setVisible(false);
			oReasonSwitch.setState(false);
		}
		
		for(var i = 0; i < 5 ; i++){
			var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
			var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
			if(oMassn){
				oController._vPreSelectedMassn[i] = oMassn.getSelectedKey();
			}
			if(oMassg){
				oController._vPreSelectedMassg[i] = oMassg.getSelectedKey();
			}
		}
	},
	
	setMultiPersonData : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
		var vActionSubjectList_Temp = {ActionSubjectListSet : []};
		
		var filterString = ""; 
		filterString += "/?$filter=Docno%20eq%20%27" + oController._vDocno + "%27";
		
		oModel.read("/ActionSubjectListSet"  + filterString, 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							if(oData.results[i].Batyp == "A" && oData.results[i].Massn1 == "") {
								vActionSubjectList_Temp.ActionSubjectListSet.push({
									Pernr : oData.results[i].Pernr,
									Ename : oData.results[i].Ename, 
									Fulln : oData.results[i].Orgeh_Tx,
									Photo : oData.results[i].Photo,
									Voltid : oData.results[i].VoltId
								});
							}
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		if(vActionSubjectList_Temp.ActionSubjectListSet.length < 1) {
			sap.m.MessageBox.alert("발령내역이 이미 등록되었습니다.", {
				onClose : function() {
					oController.navToBack();
					return;
				}
			});
		}		
		mActionSubjectList_Temp.setData(vActionSubjectList_Temp);
		
		for(var i=0; i<5; i++) {
			var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
			var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
			oMassn.setEnabled(false);
			if(oController._vDocty != "50") {
				oMassg.setEnabled(false);
			} else {
				if(i == 0) {
					oMassg.setEnabled(true);
				}
			}
			
		}
		
		var oInputSwith = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
		oInputSwith.setEnabled(true);
		
		var setSelectedItem = function() {
			var oList = sap.ui.getCore().byId(oController.PAGEID + "_List");
			oList.removeSelections(true);
			
			var oItems = oList.getItems();
			if(oItems && oItems.length) {
				for(var i=0; i<oItems.length; i++) {
					oList.setSelectedItem(oItems[i], true);
				}
			}
		};	
		
		setTimeout(setSelectedItem, 300);
		
		for(var i=0; i<5; i++) {
			var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
			oMassn.setEnabled(true);
			if(oController._vDocty != "50") {
				oMassn.setSelectedKey("0000");
			}
		}
		
		if(oController._vDocty == "50") {
			oController.onSetDefaultMassg(oController, "15", "1");
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
							if(oMassn) {
								oMassn.removeAllItems();
								oMassn.addItem(
										new sap.ui.core.Item({
											key : "0000", 
											text : "-- 선택 --"
										})
								);
								for(var j=0; j<oData.results.length; j++) {
									oMassn.addItem(
											new sap.ui.core.Item({
												key : oData.results[j].Massn, 
												text : oData.results[j].Mntxt
											})
									);
								}
							}
						}
						
						if(oController._vDocty == "50") {
							var oMassn1 = sap.ui.getCore().byId(oController.PAGEID + "_Massn1");
							oMassn1.setSelectedKey("15");
						}
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
* @memberOf zui5_hrxx_actapp2.ActAppPersonInfo
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actapp2.ActAppPersonInfo
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actapp2.ActAppPersonInfo
*/
//	onExit: function() {
//
//	}
	
	navToBack : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
	
		//각 발령대상자의 발령일을 검색조건으로 설정한다.
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		if(oActda) oController._vActda = oActda.getValue();
		
		common.SearchUser1.oController = oController;
		common.SearchUser1.fPersaEnabled = false;
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		
		oController._AddPersonDialog.open();

	},
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
//		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ES_Table");
//		//var vContexts = oTable.getSelectedContexts(true);
//		var mEmpSearchResult = oTable.getModel();
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
		var vActionSubjectList_Temp = {ActionSubjectListSet : []};
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"); 
		var vIDXs = oTable.getSelectedIndices();
		if(vEmpSearchResult && vEmpSearchResult.length) {
			
			var vActionSubjectListSet = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet");
			if(vActionSubjectListSet && vActionSubjectListSet.length) {
				for(var i=0; i<vActionSubjectListSet.length; i++) {
					vActionSubjectList_Temp.ActionSubjectListSet.push(vActionSubjectListSet[i]);
				};
			}
			for(var i=0; i<vIDXs.length; i++) {
				vActionSubjectList_Temp.ActionSubjectListSet.push({
					Pernr : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[i] + "/Pernr"),
					Ename : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[i] + "/Ename"), 
					Fulln : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[i] + "/Fulln"),
					Photo : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[i] + "/Photo"),
					Zzjobgrtx : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[i] + "/Zzjobgrtx"),
					Zzcaltltx : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[i] + "/Zzcaltltx"),
					Zzpsgrptx : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + vIDXs[i] + "/Zzpsgrptx"),
					Voltid : ""
				}); 
			}
			
//			for(var i=0; i<vEmpSearchResult.length; i++) {
//				if(vEmpSearchResult[i].Chck == true) {
//					vActionSubjectList_Temp.ActionSubjectListSet.push({
//						Pernr : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pernr"),
//						Ename : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Ename"), 
//						Fulln : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Fulln"),
//						Photo : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Photo"),
//						Zzjobgrtx : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Zzjobgrtx"),
//						Zzcaltltx : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Zzcaltltx"),
//						Zzpsgrptx : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Zzpsgrptx"),
//						Voltid : ""
//					}); 
//				}				
//			}
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
			
			for(var i=0; i<5; i++) {
				var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
				oMassn.setEnabled(true);
				oMassn.setSelectedKey("0000");
			}
		} else {
			sap.m.MessageBox.alert("대상자를 선택해 주시기 바랍니다.");
			return;
		}
		
		common.SearchUser1.onClose();
	},
	
	onSelectPersonList : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oList = oEvent.getSource();
		var oItems = oList.getSelectedItems();
		
		var fEnabled = false;
		
		if(oItems.length > 0) fEnabled = true;
		else fEnabled = false;
		
		for(var i=0; i<5; i++) {
			var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
			oMassn.setEnabled(fEnabled);
			if(!fEnabled) oMassn.setSelectedKey("0000");
			
			var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
			if(!fEnabled) {
				oMassg.setEnabled(fEnabled);
				oMassg.removeAllItems();
			}
		}
		
		var oInputSwith = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
		if(!fEnabled) {
			oController.initInputControl(oController);
			oInputSwith.setState(false);
		}
		
		oController._vPernr = "";
		
		if(oController._vActionType == "300") {
			for(var i=1; i<5; i++) {
				var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
				var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
				oMassn.setEnabled(false);
				oMassg.setEnabled(false);
			}
		}
	},
	
	onChangeMassn : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		var vControl =  oEvent.getSource();
		var vControlId = oEvent.getSource().getId();
		var oInputSwitch = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch"); 
		var str = vControlId.substring(vControlId.length-1);
		var vprekey = oController._vPreSelectedMassn[parseInt(str) -1];
		// 발령내역을 기입 후 발령유형 변경 시 확인 message 출력
		if(oInputSwitch.getState() == true && vprekey != vControl.getSelectedKey()){
			sap.m.MessageBox.show("Data will be lost by switching off the action input details. Do you wish to continue?", {
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title: "Confirm",
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
		        onClose: function(oAction) { 
		        	if ( oAction === sap.m.MessageBox.Action.YES ) {
		        		oInputSwitch.setState(false);
		        		oController.onChangeMassnR(vControlId);
//		        		oController._vPreSelectedMassn[parseInt(str) -1] = vControl.getSelectedKey();
		        	}else{
		        		// 이전에 입력된 key 로 select 한다.
		        		vControl.setSelectedKey(vprekey);			        		
		        	} 
		        }
			});
		}else if(oInputSwitch.getState() == true && vprekey == vControl.getSelectedKey()){
			
		}else{
			oController.onChangeMassnR(vControlId);
		}
	},
	
	onChangeMassnR : function(vControlId) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		var vSelectedItem = null;
		var vSelectedKey = "";
		var vControl_Idx = "";
		if(vControlId) {
			vSelectedItem = sap.ui.getCore().byId(vControlId).getSelectedItem();
			vSelectedKey = vSelectedItem.getKey();
			vControl_Idx = vControlId.substring(vControlId.length-1);
		}
		
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
		
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVEPERSON_BTN");
		oSaveBtn.setEnabled(false);
		
		oController.initInputControl(oController);
	},
	
	onSetDefaultMassg : function(oController, vSelectedKey, vControl_Idx) {
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + vControl_Idx);
		
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
		
		oMassg.setSelectedKey("10");
		
		var oInputSwith = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
		oInputSwith.setState(false);
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVEPERSON_BTN");
		oSaveBtn.setEnabled(false);
	},
	
	onChangeMassg : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
	
		var vControl =  oEvent.getSource();
		var vControlId = oEvent.getSource().getId();
		var oInputSwith = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
		var str = vControlId.substring(vControlId.length-1);
		var vprekey = oController._vPreSelectedMassg[parseInt(str) -1];
		// 발령내역을 기입 후 발령유형 변경 시 확인 message 출력
		if(oInputSwith.getState() == true && vprekey != vControl.getSelectedKey()){
			sap.m.MessageBox.show("Data will be lost by switching off the action input details. Do you wish to continue?", {
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title: "Confirm",
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
		        onClose: function(oAction) { 
		        	if ( oAction === sap.m.MessageBox.Action.YES ) {
		        		oInputSwith.setState(false);
		        		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVEPERSON_BTN");
		        		oSaveBtn.setEnabled(false);
//		        		oController._vPreSelectedMassg[parseInt(str) -1] = vControl.getSelectedKey();
		        		oController.initInputControl(oController);
		        	}else{
		        		// 이전에 입력된 key 로 select 한다.
		        		vControl.setSelectedKey(vprekey);			 
		        	}
		        }
			});
			return ;
		}
//		oInputSwith.setState(false);
//		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVEPERSON_BTN");
//		oSaveBtn.setEnabled(false);
//		
//		oController.initInputControl(oController);
	},
	
	onChangeReasonSwitch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oIssuedTypeMatrix2 = sap.ui.getCore().byId(oController.PAGEID + "_IssuedTypeMatrix2");
		
		if(oEvent.getParameter("state") == false) {
			oIssuedTypeMatrix2.setVisible(false);
		} else {
			oIssuedTypeMatrix2.setVisible(true);
		}
	},
	
	onChangeSwitch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		
		for(var i = 0; i < 5 ; i++){
			var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
			var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
			if(oMassn){
				oController._vPreSelectedMassn[i] = oMassn.getSelectedKey();
			}
			if(oMassg){
				oController._vPreSelectedMassg[i] = oMassg.getSelectedKey();
			}
		}
		
		if(oEvent.getParameter("state") == false) {
			sap.m.MessageBox.show("Data will be lost by switching off the action input details. Do you wish to continue?", {
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title: "Confirm",
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
		        onClose: function(oAction) { 
		        	if ( oAction === sap.m.MessageBox.Action.YES ) {
		        		oController.initInputControl(oController);
		        	} else {
		        		oControl.setState(true);
		        	}
		        }
			});
//			oController.initInputControl(oController);
			return;
		}
		 
		var isValid = true;
		var vSelectMassnCnt = 0;
		var fMassnCompany = false;
		
		if(oController._vPernr == "") {
			var oList1 = sap.ui.getCore().byId(oController.PAGEID + "_List");
			var mTmpModel = oList1.getModel();
			
			if(oList1.getMode() == sap.m.ListMode.MultiSelect) {
				var vSelectedItems = oList1.getSelectedContexts(true);
				if(vSelectedItems && vSelectedItems.length) {
					oController._vPernr = mTmpModel.getProperty(vSelectedItems[0] + "/Pernr");
					oController._vPernrVoltid = mTmpModel.getProperty(vSelectedItems[0] + "/Voltid");
				}
			} else {
				oController._vPernr = mTmpModel.getProperty("/ActionSubjectListSet/0/Pernr");	
				oController._vPernrVoltid = mTmpModel.getProperty("/ActionSubjectListSet/0/Voltid");
			}
		}
		
		oController.initInputControl(oController); 
		
		for(var i=0; i<5; i++) {
			var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
			var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
			
			if(oMassn && oMassg) {
				if(oMassn.getSelectedKey() != "0000" && oMassn.getSelectedKey() != "") {
					vSelectMassnCnt++;
//					if(oMassg.getSelectedKey() == "0000" || oMassg.getSelectedKey() == "") {
//						isValid = false;
//						break;
//					} else {
						oController._vActiveMassn.push({Massn : oMassn.getSelectedKey(), Massg : oMassg.getSelectedKey()});
						
						if(oMassn.getSelectedKey() == "81" ||  oMassn.getSelectedKey() == "ZA") {
							fMassnCompany = false;
						}
						
						//발령유형이 퇴사이고 발령사유가 전출인 경우 일 떄 인사연역, 인사하위영역을 ??? 한다.
						if(oMassn.getSelectedKey() == "92" && oMassg.getSelectedKey() == "20") {
							fMassnCompany = true;
						}
						
						oController.getActionInputFieldSet(oController, oMassn.getSelectedKey(), oMassg.getSelectedKey());
						
						oController.getActionDetailLayoutInfoSet(oController, oMassn.getSelectedKey(), oMassg.getSelectedKey());
						
						var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVEPERSON_BTN");
						oSaveBtn.setEnabled(true);
//					}
				}
			}
		}
		
//		if(vSelectMassnCnt < 1 ) {
//			oEvent.getSource().setState(false);
//			sap.m.MessageBox.alert("발령유형을 최소한 1개이상 선택 바랍니다.");
//			return;
//		}
		
		if(!isValid) {
			oEvent.getSource().setState(false);
			sap.m.MessageBox.alert("발령사유를 선택바랍니다.");
			return;
		}
		
		if(oController._vActiveGroup && oController._vActiveGroup.length > 0) {
			oController._vActiveGroup.push({Itgrp : "", Itgrptx : "  "});
			
			if(oController._vUpdateData != null && oController._vUpdateData.Pernr != "") {
				oController.setGroupInputFiled("U", oController, fMassnCompany, oController._vUpdateData);
			} else {
				oController.setGroupInputFiled("N", oController, fMassnCompany);
			}
		} else {
			if(oController._vUpdateData != null && oController._vUpdateData.Pernr != "") {
				oController.setInputFiled("U", oController, fMassnCompany, oController._vUpdateData);
			} else {
				oController.setInputFiled("N", oController, fMassnCompany);
			}
		}
		
	},
	
	getActionInputFieldSet : function(oController, Massn, Massg) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + oController._vActda + "T00%3a00%3a00%27";
		filterString += "%20and%20Massn%20eq%20%27" + Massn + "%27";
		if(Massg == "" || Massg == "0000"){}
		else	filterString += "%20and%20Massg%20eq%20%27" + Massg + "%27";
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
	},
	
	getActionDetailLayoutInfoSet : function(oController, Massn, Massg) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var filterString1 = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		filterString1 += "%20and%20Actda%20eq%20datetime%27" + oController._vActda + "T00%3a00%3a00%27";
		filterString1 += "%20and%20Massn%20eq%20%27" + Massn + "%27";
		if(Massg == "" || Massg == "0000"){}
		else	filterString1 += "%20and%20Massg%20eq%20%27" + Massg + "%27";
		
//		filterString1 += "%20and%20Massg%20eq%20%27" + Massg + "%27";
		filterString1 += "%20and%20Pernr%20eq%20%27" + oController._vPernr + "%27";
		
		oModel.read("/ActionDetailLayoutInfoSet"  + filterString1, 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							if(oData.results[i].Itgrp == "") {
								continue;
							}
							var isExists = false;
							for(var j=0; j<oController._vActiveGroup.length; j++) {
								if(oController._vActiveGroup[j].Itgrp == oData.results[i].Itgrp) {
									isExists = true;
									break;
								}
							}
							if(isExists == false) {
								oController._vActiveGroup.push(oData.results[i]);
							}
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
//		oController._vActiveGroup.sort(function(a, b){
//			var a1 = a.Grpty + " " + a.Itgrp;
//			var b1 = b.Grpty + " " + b.Itgrp;
//			return a1 < b1 ? -1 : a1 > b1 ? 1 : 0;  
//		})
	},
	
	getActionSubjectTableHeaderSet : function(oController, Infty) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var filterString1 = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		filterString1 += "%20and%20Infty%20eq%20%27" + Infty + "%27";
		filterString1 += "%20and%20Molga%20eq%20%27" + oController._vMolga + "%27";
		
		var vActionSubjectTableHeaderSet = [];
		
		oModel.read("/ActionSubjectTableHeaderSet"  + filterString1, 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							vActionSubjectTableHeaderSet.push(oData.results[i]);
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		return vActionSubjectTableHeaderSet;
	},
	
	getActionSubjectTableSet : function(oController, Infty) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		
		var filterString1 = "/?$filter=Docno%20eq%20%27" + oController._vDocno + "%27";
		filterString1 += "%20and%20Infty%20eq%20%27" + Infty + "%27";
		filterString1 += "%20and%20Pernr%20eq%20%27" + oController._vPernr + "%27";
		filterString1 += "%20and%20Actda%20eq%20" + "datetime%27" + oActda.getValue() + "T00%3a00%3a00%27";
		if(typeof oController._vPernrVoltid != "undefined" && oController._vPernrVoltid != "") filterString1 += "%20and%20VoltId%20eq%20%27" + oController._vPernrVoltid + "%27";
		else filterString1 += "%20and%20VoltId%20eq%20%27" + "" + "%27";
		
		var vActionSubjectTableSet = [];
		
		oModel.read("/ActionSubjectTableSet"  + filterString1, 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							vActionSubjectTableSet.push(oData.results[i]);
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		return vActionSubjectTableSet;
	},

	setInputFiled : function(pTy, pController, pFMassnCompany, pUpdateData) {
		var ty            = pTy;
		var oController   = pController;
		var fMassnCompany = pFMassnCompany;
		var updateData    = pUpdateData;
		
		var fDefaulValue = false;
		
		var vRetireMassg = "";
		
		var vAus01Massn = "";
		
		var oScroller2 = sap.ui.getCore().byId(oController.PAGEID + "_RightScrollContainer");
       	oScroller2.setVertical(true);
		
		for(var i=1; i<=5; i++) {
			var oMassn1 = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + i);
			var oMassg1 = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + i);
			
			if(oMassn1.getSelectedKey() == "90" || oMassn1.getSelectedKey() == "91") {
				vAus01Massn = "90";
			}
			
			if(oMassn1.getSelectedKey() == "10") {
				vAus01Massn = "10";
			}			
			
			if(oMassn1.getSelectedKey() == "92") {
				vRetireMassg = oMassg1.getSelectedKey();
			}
		}
		
		var oActionControlsLayout = sap.ui.getCore().byId(oController.PAGEID + "_ActionControlsLayout");
		
		oController._vTableColumns = {}
		
		var actionFunction = function() {
			var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_MatrixLayout", {
				width : "100%",
				layoutFixed : true,
				columns : 4,
				widths: ["15%","35%","15%","35%"],
			});
			
			var oRow = null, oCell = null, oControl = null;
			
			common.Common.loadCodeData(oController._vPersa, oController._vActda, oController.getEmpCodeField(oController));
			
			var m_idx = 0;
			if(oController._vActiveControl && oController._vActiveControl.length) {
				for(var i=0; i<oController._vActiveControl.length; i++) {
					
					var Fieldname = oController._vActiveControl[i].Fieldname;
					var Fieldtype = oController._vActiveControl[i].Incat;
					Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
					var TextFieldname = Fieldname + "_Tx";
					
					var vLabel = oController._vActiveControl[i].Label;
					var vMaxLength = parseInt(oController._vActiveControl[i].Maxlen);
					if(vMaxLength == 0) {
						vMaxLength = common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "ActionSubjectList", Fieldname);
					}
					
					var vLabelText = "";
					if(vLabel != "") vLabelText = vLabel;
					else vLabelText = oController._vActiveControl[i].Label;
					
					if(Fieldtype == "TB") {
						if(m_idx > 0) {
							oMatrixLayout.addRow(oRow);
						}
						
						if(oMatrixLayout.getRows().length > 0) {
							oActionControlsLayout.addContent(oMatrixLayout);
							oRow = new sap.ui.commons.layout.MatrixLayoutRow();
						}
						
						oController.makeTable(oController, oController._vActiveControl[i], oActionControlsLayout, false);
						
						oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
							width : "100%",
							layoutFixed : true,
							columns : 4,
							widths: ["15%","35%","15%","35%"],
						});
						m_idx = 0;
						continue;
					}
					
					if((m_idx % 2) == 0) {
						if(m_idx != 0) {
							oMatrixLayout.addRow(oRow);
						}
						oRow = new sap.ui.commons.layout.MatrixLayoutRow();
					}
					
					var vUpdateValue = "";
					var vUpdateTextValue = "";
					
					if(ty == "U") {
						vUpdateValue = eval("updateData." + Fieldname);
						vUpdateTextValue = eval("updateData." + TextFieldname);
						
						if(Fieldtype == "D1") {
							vUpdateValue = oController._vActiveControl[i].Dcode;
							vUpdateTextValue = oController._vActiveControl[i].Dvalu;
						}
					} else {
						if(fDefaulValue) {
							vUpdateValue = eval("updateData." + Fieldname);
							vUpdateTextValue = eval("updateData." + TextFieldname);
						} else {
							if(Fieldtype == "M4" || Fieldtype == "O4") {
								var vUpdateDateValue = oController._vActiveControl[i].Dcode;
								if(vUpdateDateValue != null && vUpdateDateValue != "") {
									var vDateValue = "";
									if(vUpdateDateValue.length == 8) {
										vDateValue = vUpdateDateValue.substring(0,4) + "/" + vUpdateDateValue.substring(4,6) + "/" + vUpdateDateValue.substring(6,8);
									} else if(vUpdateDateValue.length == 10) {
										vDateValue = vUpdateDateValue.replace(/./g, "/");
										vDateValue = vDateValue.replace(/-/g, "/");
									}
									vUpdateValue = vDateValue;
									vUpdateTextValue = vDateValue;
								}
							} else {
								vUpdateValue = oController._vActiveControl[i].Dcode;
								vUpdateTextValue = oController._vActiveControl[i].Dvalu;
							}
						}
					}
					
					//입력항목 라벨를 만든다.
					var oLabel = new sap.m.Label({text : vLabelText});
					if(Fieldtype.substring(0, 1) == "M") {
						oLabel.setRequired(true);
					} else {
						oLabel.setRequired(false);
					}
					oLabel.addStyleClass("L2PFontFamily");
					oLabel.setTooltip(vLabelText);
					
					if(Fieldtype == "D2") {
						oLabel.setText("");
					}
					
					oCell = new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Begin,
						vAlign : sap.ui.commons.layout.VAlign.Middle,
						content : [oLabel]
					}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");		
					oRow.addCell(oCell);				
					
					oControl = oController.makeControl(oController, Fieldtype, Fieldname, vMaxLength, vLabelText, vUpdateValue, vUpdateTextValue, fMassnCompany, vAus01Massn, vRetireMassg);
					
					oCell = new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Begin,
						vAlign : sap.ui.commons.layout.VAlign.Middle,
						content : oControl
					}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
					oRow.addCell(oCell);
					
					m_idx++;
				}
				if(oRow.getCells().length == 2) {
					oRow.addCell(new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("L2PMatrixLabel L2PPaddingLeft10"));
					oRow.addCell(new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("L2PMatrixData L2PPaddingLeft10"));
				}
				oMatrixLayout.addRow(oRow);
			}
			
			oActionControlsLayout.addContent(oMatrixLayout);
			
			oController.BusyDialog.close();
		};
		
		oController.BusyDialog.open();
		
		setTimeout(actionFunction, 300);
	},
	
	setGroupInputFiled : function(pTy, pController, pFMassnCompany, pUpdateData) {
		var ty            = pTy;
		var oController   = pController;
		var fMassnCompany = pFMassnCompany;
		var updateData    = pUpdateData;
		
		var fDefaulValue = false;
		
		var vRetireMassg = "";
		
		var vAus01Massn = "";
		
		var oScroller2 = sap.ui.getCore().byId(oController.PAGEID + "_RightScrollContainer");
       	oScroller2.setVertical(false);
		
		for(var i=1; i<=5; i++) {
			var oMassn1 = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + i);
			var oMassg1 = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + i);
			
			if(oMassn1.getSelectedKey() == "90" || oMassn1.getSelectedKey() == "91") {
				vAus01Massn = "90";
			}
			
			if(oMassn1.getSelectedKey() == "10") {
				vAus01Massn = "10";
			}			
			
			if(oMassn1.getSelectedKey() == "92") {
				vRetireMassg = oMassg1.getSelectedKey();
			}
		}
		
		var oActionControlsLayout = sap.ui.getCore().byId(oController.PAGEID + "_ActionControlsLayout");
		
		oController._vTableColumns = {}
		
		var actionFunction = function() {
			var oGroupingInputLayout = new sap.uxap.ObjectPageLayout(oController.PAGEID + "_GroupingInputLayout", {
				height : (oController.ContentHeight - 180) + "px",
				sections : []
			});
			
			var oRow = null, oCell = null, oControl = null;
			
			common.Common.loadCodeData(oController._vPersa, oController._vActda, oController.getEmpCodeField(oController));
			
			for(var g=0; g<oController._vActiveGroup.length; g++) {
				var oSection = new sap.uxap.ObjectPageSection({title : oController._vActiveGroup[g].Itgrptx});
				var oSubSection = new sap.uxap.ObjectPageSubSection({title : ""});
				
				var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
					width : "100%",
					layoutFixed : true,
					columns : 4,
					widths: ["15%","35%","15%","35%"],
				});
				
				var m_idx = 0;
				
				if(oController._vActiveControl && oController._vActiveControl.length) {
					for(var i=0; i<oController._vActiveControl.length; i++) {
						
						if(oController._vActiveGroup[g].Itgrp != oController._vActiveControl[i].Itgrp) {
							continue;
						}
						
						var Fieldname = oController._vActiveControl[i].Fieldname;
						var Fieldtype = oController._vActiveControl[i].Incat;
						Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
						var TextFieldname = Fieldname + "_Tx";
						
						var vLabel = oController._vActiveControl[i].Label;
						var vMaxLength = parseInt(oController._vActiveControl[i].Maxlen);
						if(vMaxLength == 0) {
							vMaxLength = common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "ActionSubjectList", Fieldname);
						}
						
						var vLabelText = "";
						if(vLabel != "") vLabelText = vLabel;
						else vLabelText = oController._vActiveControl[i].Label;
						
						if(Fieldtype == "TB") {
							if(m_idx > 0) {
								oMatrixLayout.addRow(oRow);
							}
							if(oMatrixLayout.getRows().length > 0) {
								oSubSection.addBlock(oMatrixLayout);
							}
							
							oController.makeTable(oController, oController._vActiveControl[i], oSubSection, true);
							
							oMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
								width : "100%",
								layoutFixed : true,
								columns : 4,
								widths: ["15%","35%","15%","35%"],
							});
							m_idx = 0;
							continue;
						}
						
						if((m_idx % 2) == 0) {
							if(m_idx != 0) {
								oMatrixLayout.addRow(oRow);
							}
							oRow = new sap.ui.commons.layout.MatrixLayoutRow();
						}
						
						var vUpdateValue = "";
						var vUpdateTextValue = "";
						
						if(ty == "U") {
							vUpdateValue = eval("updateData." + Fieldname);
							vUpdateTextValue = eval("updateData." + TextFieldname);
							
							if(Fieldtype == "D1") {
								if(Fieldname == "Waers2"){
									
								}else{
									vUpdateValue = oController._vActiveControl[i].Dcode;
									vUpdateTextValue = oController._vActiveControl[i].Dvalu;
								}
							}
						} else {
							if(fDefaulValue) {
								vUpdateValue = eval("updateData." + Fieldname);
								vUpdateTextValue = eval("updateData." + TextFieldname);
							} else {
								if(Fieldtype == "M4" || Fieldtype == "O4") {
									var vUpdateDateValue = oController._vActiveControl[i].Dcode;
									if(vUpdateDateValue != null && vUpdateDateValue != "") {
										var vDateValue = "";
										if(vUpdateDateValue.length == 8) {
											vDateValue = vUpdateDateValue.substring(0,4) + "/" + vUpdateDateValue.substring(4,6) + "/" + vUpdateDateValue.substring(6,8);
										} else if(vUpdateDateValue.length == 10) {
											vDateValue = vUpdateDateValue.replace(/./g, "/");
											vDateValue = vDateValue.replace(/-/g, "/");
										}
										vUpdateValue = vDateValue;
										vUpdateTextValue = vDateValue;
									}
								} else {
									vUpdateValue = oController._vActiveControl[i].Dcode;
									vUpdateTextValue = oController._vActiveControl[i].Dvalu;
								}
							}
						}
						
						//입력항목 라벨를 만든다.
						var oLabel = new sap.m.Label({text : vLabelText});
						if(Fieldtype.substring(0, 1) == "M") {
							oLabel.setRequired(true);
						} else {
							oLabel.setRequired(false);
						}
						oLabel.addStyleClass("L2PFontFamily");
						oLabel.setTooltip(vLabelText);
						
						if(Fieldtype == "D2") {
							oLabel.setText("");
						}
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Begin,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : [oLabel]
						}).addStyleClass("L2PMatrixLabel L2PPaddingLeft10");		
						oRow.addCell(oCell);				
						
						oControl = oController.makeControl(oController, Fieldtype, Fieldname, vMaxLength, vLabelText, vUpdateValue, vUpdateTextValue, fMassnCompany, vAus01Massn, vRetireMassg);
						
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Begin,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							content : oControl
						}).addStyleClass("L2PMatrixData L2PPaddingLeft10");
						oRow.addCell(oCell);
						
						m_idx++;
					}
					if(m_idx > 0) {
						if(oRow.getCells().length == 2) {
							oRow.addCell(new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("L2PMatrixLabel L2PPaddingLeft10"));
							oRow.addCell(new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("L2PMatrixData L2PPaddingLeft10"));
						}
						oMatrixLayout.addRow(oRow);
					}
				}		
				
				if(oMatrixLayout.getRows().length > 0) {
					if(g == (oController._vActiveGroup.length - 1)) {
						oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "30px"});
						oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							hAlign : sap.ui.commons.layout.HAlign.Begin,
							vAlign : sap.ui.commons.layout.VAlign.Middle,
							colSpan : 4,
							content : new sap.ui.core.HTML({content : "<div style='height:30px'> </div>",	preferDOM : false})
						});
						oRow.addCell(oCell);
						
						oMatrixLayout.addRow(oRow);
					}
					oSubSection.addBlock(oMatrixLayout);
				}
				
//				if(g == (oController._vActiveGroup.length - 1)) {
//					oSubSection.addBlock(new sap.ui.core.HTML({content : "<div style='height:100px'> </div>",	preferDOM : false}));
//				}
				
				oSection.addSubSection(oSubSection);
				oGroupingInputLayout.addSection(oSection);
			}
			
			oActionControlsLayout.addContent(oGroupingInputLayout);
			
			oController.BusyDialog.close();
		};
	
		oController.BusyDialog.open();
		
		setTimeout(actionFunction, 300);
	},
	
	makeTable : function(oController, ActiveControl, oLayout, Grouping) {
		var vActionSubjectTableHeaderSet = oController.getActionSubjectTableHeaderSet(oController, ActiveControl.Itgrp);
		if(!vActionSubjectTableHeaderSet || vActionSubjectTableHeaderSet.length < 1) {
			return;
		}
		var vActionSubjectTableSet = oController.getActionSubjectTableSet(oController, ActiveControl.Itgrp);
		
		var mItgrpList = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(mItgrpList, "JSON_" + ActiveControl.Itgrp);
		
		var oColumnList = new sap.m.ColumnListItem();
		
		var oAddBtn = new sap.m.Button({
			icon : "sap-icon://add", 
			type : "Default",
			press : oController.addTableData,
			customData : {key : "Itgrp", value : ActiveControl.Itgrp}
		});
		var oDelBtn = new sap.m.Button({
			icon : "sap-icon://less",
			type : "Default",
			press : oController.deleteTableData,
			customData : {key : "Itgrp", value : ActiveControl.Itgrp}
		});
		
		var oTableHeader = new sap.m.Toolbar({
			height : "30px",
			content :[new sap.m.ToolbarSpacer(), oAddBtn, oDelBtn]
		});
		
		var oTable = new sap.m.Table(oController.PAGEID + "_TABLE_" + ActiveControl.Itgrp, {
			inset : false,
			fixedLayout : false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText : "해당하는 데이터가 없습니다.",
			mode : sap.m.ListMode.SingleSelectLeft,
			headerToolbar : oTableHeader
		});
		
		oTable.setModel(mItgrpList);
		
		var vColumns = [];
		
		for(var i=0; i<vActionSubjectTableHeaderSet.length; i++) {
			var Fieldname = vActionSubjectTableHeaderSet[i].Fieldname;
			var Fieldtype = vActionSubjectTableHeaderSet[i].Inpty;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			var TextFieldname = Fieldname + "_Tx";
			
			var vMaxLength = parseInt(vActionSubjectTableHeaderSet[i].Maxlen);
			
			var fRequired = false;
			
			if(Fieldname == "Begda" || Fieldname == "Endda") {
				Fieldname = Fieldname + "T";
				TextFieldname = Fieldname + "_Tx";
			}
			vColumns.push({Fieldname : Fieldname, Fieldtype: Fieldtype, DefaultValue : vActionSubjectTableHeaderSet[i].Defaultval, DefaultText: vActionSubjectTableHeaderSet[i].Defaulttxt});
			
			if(Fieldtype.substring(0,1) == "M") {
				fRequired = true;
			}
			var oColumn = new sap.m.Column({
				header: new sap.m.Label({text : vActionSubjectTableHeaderSet[i].Label, required : fRequired}).addStyleClass("L2PFontFamily"), 			        	  
				demandPopin: true,
				hAlign : sap.ui.core.TextAlign.Begin,
				minScreenWidth: "tablet"
	        });
			oTable.addColumn(oColumn);			
			
			var oControl = oController.makeTableControl(oController, Fieldtype, Fieldname, TextFieldname, vMaxLength, vActionSubjectTableHeaderSet[i].Label, ActiveControl.Itgrp);
			if(oControl) {
				if(Fieldtype.substring(1,2) == "1") {
					oControl.bindProperty("selectedKey", Fieldname);
				} else if(Fieldtype.substring(1,2) == "2" || Fieldtype.substring(1,2) == "5") {
					oControl.bindProperty("value", TextFieldname);
				} else if(Fieldtype.substring(1,2) == "3" || Fieldtype.substring(1,2) == "7") {
					oControl.bindProperty("value", Fieldname);
				} else if(Fieldtype.substring(1,2) == "4") {
					oControl.bindProperty("value", Fieldname);
				} else if(Fieldtype.substring(1,2) == "6") {
					oControl.bindProperty("selected", {path : Fieldname, formatter : function(fVal) {return fVal == "X" ? true : false}});
				}
				
				oColumnList.addCell(oControl);
			}
		}
		eval("oController._vTableColumns.C" + ActiveControl.Itgrp + " = vColumns;");
		
		var vItgrpList = {TableDataList : []};
		
		if(vActionSubjectTableSet && vActionSubjectTableSet.length) {
			for(var i=0; i<vActionSubjectTableSet.length; i++) {
				var vOneData = {};
				for(var c=0; c<oController._vDefaultTableColumns.length; c++) {
					eval("vOneData." + oController._vDefaultTableColumns[c] + " = vActionSubjectTableSet[i]." + oController._vDefaultTableColumns[c] + ";");
				}
				
				for(var c=0; c<vColumns.length; c++) {
					var vVal = "";
					var vTextVal = "";
					for(var t=1; t<=30; t++) {
						var idx = "00";
						if(t < 10) idx = "0" + t;
						else  idx = "" + t;
						var vFName = eval("vActionSubjectTableSet[i].Field" + idx);
						if(vFName && vFName != "") {
							if(vFName.toUpperCase() == "BEGDA" || vFName.toUpperCase() == "ENDDA") {
								vFName = vFName + "T";
							}
							if(vFName.toUpperCase() == vColumns[c].Fieldname.toUpperCase()) {
								vVal = eval("vActionSubjectTableSet[i].Value" + idx);
								vTextVal = eval("vActionSubjectTableSet[i].Valtx" + idx);
//								if(vVal != "" && vTextVal == "") {
//									if(vColumns[c].Fieldtype.substring(1,2) == "2" || vColumns[c].Fieldtype.substring(1,2) == "5") {
//										vTextVal = oController.getTextFiledValue(oController, vColumns[c].Fieldname, vVal, ActiveControl.Itgrp);
//									}
//								}
								break;
							}
						}
						
					}					
					eval("vOneData." + vColumns[c].Fieldname + " = vVal;");
					eval("vOneData." + vColumns[c].Fieldname + "_Tx = vTextVal;");
				}
				vItgrpList.TableDataList.push(vOneData);
			}
			
			mItgrpList.setData(vItgrpList);
		}
		
		oTable.bindItems("/TableDataList", oColumnList);
		
		if(Grouping) oLayout.addBlock(oTable);
		else oLayout.addContent(oTable);
	},
	
	getTextFiledValue : function(oController, Fieldname, vValue, Itgrp) {
		var vRetText = "";
		
		var mEmpCodeList = null;			
		var vAddFilter = [{key : "Persa", value : oController._vPersa},
		                  {key : "Actda", value : oController._vActda}];
		
		if(Fieldname.toUpperCase() == "LGART") {
			vAddFilter.push({key : "Excod", value : Itgrp});
		}
		mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter, false);
		
		var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
		if(vEmpCodeList && vEmpCodeList.length) {
			for(var i=0; i<vEmpCodeList.length; i++) {
				if(vEmpCodeList[i].Ecode == vValue) {
					vRetText = vEmpCodeList[i].Etext;
					break;
				}
			}
		}
		
		return vRetText;
	},
	
	addTableData : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		
		var vItgrp = oControl.getCustomData()[0].getValue();
		
		var mItgrpList = sap.ui.getCore().getModel("JSON_" + vItgrp);
		var vItgrpList = mItgrpList.getProperty("/TableDataList");
		
		var vTmp = {TableDataList : []};
		
		var vColumns = eval("oController._vTableColumns.C" + vItgrp + ";");
		
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		
		var vCnt = 0;
		if(vItgrpList && vItgrpList.length) {
			for(var i=0; i<vItgrpList.length; i++) {
				vTmp.TableDataList.push(vItgrpList[i]);
			}
			vCnt = vItgrpList.length;
		}
		
		var vOneData = {};
		vOneData.Docno = oController._vDocno;
		vOneData.VoltId = oController._vPernrVoltid ? oController._vPernrVoltid : "";
		vOneData.Actda = oActda.getValue();
		vOneData.Pernr = oController._vPernr;
		vOneData.Infty = vItgrp;
		vOneData.Subty = "";
		vOneData.Objps = "";
		vOneData.Sprps = "";
		vOneData.Endda = null;
		vOneData.Begda = null;
		vOneData.Seqnr = "";
		vOneData.Isnew = "X";
		
		vOneData.Numbr = vCnt + 1;
		for(var i=0; i<vColumns.length; i++) {
			eval("vOneData." + vColumns[i].Fieldname + " = '" + vColumns[i].DefaultValue + "';");
			eval("vOneData." + vColumns[i].Fieldname + "_Tx = '" + vColumns[i].DefaultText + "';");
		}
		vTmp.TableDataList.push(vOneData);
		
		mItgrpList.setData(vTmp);		
	},
	
	deleteTableData : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		
		var vItgrp = oControl.getCustomData()[0].getValue();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE_" + vItgrp);
		
		var vContexts = oTable.getSelectedContexts(true);
		var vNumbr = 0;
		
		if(vContexts && vContexts.length) {
			vNumbr = vContexts[0].getProperty("Numbr");
		} else {
			sap.m.MessageBox.alert("먼저 삭제할 행을 선택하여 주십시오.");
			return;
		}
		
		var mItgrpList = sap.ui.getCore().getModel("JSON_" + vItgrp);
		var vItgrpList = mItgrpList.getProperty("/TableDataList");
		
		var vTmp = {TableDataList : []};
		
		if(vItgrpList && vItgrpList.length) {
			for(var i=0; i<vItgrpList.length; i++) {
				if(vItgrpList[i].Numbr != vNumbr) {
					vTmp.TableDataList.push(vItgrpList[i]);
				}
			}
		}
		
		oTable.removeSelections(false);
		mItgrpList.setData(vTmp);		
	},
	
	getEmpCodeField : function(oController) {
		var vExceptionFields = ["Werks","Btrtl","Rls_orgeh","Persk","Rls_werks","Retrs","Home_staff","Host_werks",
		                        "Host_staff","Rls_zzpsgrp","Entrs","Schkz","Trfgr","Trfst","Aus01",
		                        "Aus02","Aus03","Aus04","Aus05","Ret_persa","Ret_btrtl","Ret_zzjobsr"];
		var vEmpCodeListFields = [];
		
		for(var i=0; i<oController._vActiveControl.length; i++) {			
			var Fieldname = oController._vActiveControl[i].Fieldname;
			var Fieldtype = oController._vActiveControl[i].Incat;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			
			if(Fieldtype == "M0" || Fieldtype == "M1" || Fieldtype == "O1") {
				var fExcep = false;
				for(var j=0; j<vExceptionFields.length; j++) {
					if(Fieldname == vExceptionFields[j]) {
						fExcep = true;
						break;
					}
				}
				if(fExcep == false) {
					vEmpCodeListFields.push(oController._vActiveControl[i]);
				}
			}
		}
		
		return vEmpCodeListFields;
	},
	
	/**
	 * 입력항목의 유형에 따라 달리 처리한다.
		 M1 : select
		 M2 : Input & Tree Popup
		 M3 : Input only
		 M4 : DatePicker
		 M5 : Input & Select Dialog
		 M6 : Single Checkbox
	 * @param oController
	 * @param Fieldtype
	 * @param Fieldname
	 * @param vMaxLength
	 * @param vLabelText
	 * @param vUpdateValue
	 * @param vUpdateTextValue
	 * @param fMassnCompany
	 * @param vAus01Massn
	 * @returns
	 */
	makeControl : function(oController, Fieldtype, Fieldname, vMaxLength, vLabelText, vUpdateValue, vUpdateTextValue, fMassnCompany, vAus01Massn, vRetireMassg) {
		var oControl = null;
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		if(Fieldtype == "M1" || Fieldtype == "O1") {
			oControl = new sap.m.Select(oController.PAGEID + "_" + Fieldname, {
	        	   width : "95%",
	        }).addStyleClass("L2PFontFamily");
			
			if(Fieldname == "Werks") { //인사영역은 EmpCodeList가 아닌 별도의 Entity
				oController._vWerksUpdateValue = vUpdateValue;
				if(fMassnCompany) {
					oController.setPersaData("Werks", oControl, fMassnCompany, vUpdateValue, "");
				} else {
					oController.setPersaData("Werks", oControl, fMassnCompany, vUpdateValue, "");
				}
				oControl.attachChange(oController.onPressWerks);
			} else if(Fieldname == "Btrtl") { //인사하위영역은 EmpCodeList가 아닌 별도의 Entity
				if(fMassnCompany) {
					oController.setPersaData("Btrtl", oControl, fMassnCompany, vUpdateValue, oController._vWerksUpdateValue);
				} else {
					oController.setPersaData("Btrtl", oControl, fMassnCompany, vUpdateValue, oController._vPersa);
				}
				oController._vSelectedBtrtl = vUpdateValue; 
				oControl.attachChange(oController.onPressBtrtl);
			} else if(Fieldname == "Rls_orgeh") { //해제부서는 조건이 발령유형/사유가 추가됨
				
				var vAddFilter = [{key : "Actda", value : oController._vActda},
				                  {key : "Pernr", value : oController._vPernr}];
				var mDataModel = oController.setRlsOrgehCodeData(Fieldname, vAddFilter);	
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/ReleaseOrgListSet", new sap.ui.core.Item({key : "{Rls_orgeh}", text : "{Rls_orgeh_Tx}"}));
				oControl.setSelectedKey(vUpdateValue);
			} else if(Fieldname == "Persg") { //사원그룹
				
				oController._vSelectedPersg = vUpdateValue; 
				
//				var vAddFilter = [{key : "Persa", value : oController._vPersa},
//				                  {key : "Actda", value : oController._vActda}];
//				var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);
//				oControl.setModel(mDataModel);
//				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				
				oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
				
				oControl.setSelectedKey(vUpdateValue);
				oControl.attachChange(oController.onPressPersg);
			} else if(Fieldname == "Persk") { //사원하위그룹 Excod
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda},
				                  {key : "Excod", value : oController._vSelectedPersg}];
				
				var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);
				
				oController._vSelectedPersk = vUpdateValue; 
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				oControl.setSelectedKey(vUpdateValue);
				oControl.attachChange(oController.onPressPersk);
			} else if(Fieldname == "Rls_werks") { //해제 인사 영역 리스트
				var vAddFilter = [{key : "Pernr", value : oController._vPernr},
				                  {key : "Actda", value : oController._vActda}];
				var mDataModel = oController.setRlsWerksCodeData(Fieldname, vAddFilter);	
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/ReleasePersAreaListSet", new sap.ui.core.Item({key : "{Rls_werks}", text : "{Rls_werks_Tx}"}));
				oControl.setSelectedKey(vUpdateValue);
				oControl.attachChange(oController.onPressHost_werks);
				
				if(vUpdateValue != "" && vUpdateValue != "0000") {
					oController._vHost_werks = vUpdateValue;
				}
			} else if(Fieldname == "Retrs") { //퇴직사유							
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda},
				                  {key : "Massg", value : vRetireMassg}];
				
				var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);							
				
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
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda},
				                  {key : "Excod", value : vExcod}];
				
				var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);							
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				oControl.setSelectedKey(vUpdateValue);
				oControl.attachChange(oController.onPressHost_werks);
				
				if(vUpdateValue != "" && vUpdateValue != "0000") {
					oController._vHost_werks = vUpdateValue;
				}
			}  else if(Fieldname == "Host_staff") {
				if(oController._vHost_werks != "") {
					var vAddFilter = [{key : "Host_werks", value : oController._vHost_werks},
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
				
				var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);							
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				oControl.setSelectedKey(vUpdateValue);
			} else if(Fieldname == "Entrs") { //입사구분
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda}];
				
				var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);							
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				if(vUpdateValue == "") {
					oControl.setSelectedKey(oController._vEntrs);
				} else {
					oControl.setSelectedKey(vUpdateValue);
				}
			} else if(Fieldname == "Schkz") { //사원하위그룹 Excod
				var vExcod = "" ;
				var vBtrtl = oController._vSelectedBtrtl , vPersg = oController._vSelectedPersg, vPersk = oController._vSelectedPersk;
//				var vExcod = oController._vSelectedBtrtl + "|" + oController._vSelectedPersg + "|" + oController._vSelectedPersk;
				if(!oController._vUpdateData || oController._vUpdateData == null ){
					
				}else{
					vBtrtl = vBtrtl == "" ? oController._vUpdateData.Btrtl : vBtrtl ;
					vPersg = vPersg == "" ? oController._vUpdateData.Persg : vPersg ;
					vPersk = vPersk == "" ? oController._vUpdateData.Persk : vPersk ;
				}
				vExcod = vBtrtl + "|" + vPersg + "|" + vPersk;
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda},
				                  {key : "Excod", value : vExcod}];
				
				var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);							
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				oControl.setSelectedKey(vUpdateValue);
			} else if(Fieldname == "Trfar") { //호봉유형
				oController._vSelectedTrfar = vUpdateValue;
				
				oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
				
				oControl.setSelectedKey(vUpdateValue);
				oControl.attachChange(oController.onPressTrfar);
			} else if(Fieldname == "Trfgb") { //급여영역
				oController._vSelectedTrfgb = vUpdateValue;
				
				oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
				
				oControl.setSelectedKey(vUpdateValue);
			} else if(Fieldname == "Trfgr") { //호봉그룹
				var vExcod = oController._vSelectedPersg + "|" + oController._vSelectedPersk;
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda},
				                  {key : "Excod", value : vExcod}];
				var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);	
				
				oController._vSelectedTrfgr = vUpdateValue; 
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				oControl.setSelectedKey(vUpdateValue);
				oControl.attachChange(oController.onPressTrfgr);
			} else if(Fieldname == "Trfst") { //호봉단계 Excod
				var vExcod = oController._vMolga + "|" + oController._vSelectedTrfar + "|" + oController._vSelectedTrfgb + "|" + oController._vSelectedTrfgr + "|" + oController._vSelectedPersg + "|" + oController._vSelectedPersk;
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda},
				                  {key : "Excod", value : vExcod}];
				
				var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);							
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				oControl.setSelectedKey(vUpdateValue);
			} else if(Fieldname == "Aus01") { //
				var vExcod = "";
				if(vAus01Massn == "90") vExcod = "A002";
				else {
					if(oController._vMolga == "18") vExcod = "CZ01";
					else vExcod = "A001";
				}
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda},
				                  {key : "Excod", value : vExcod}];
				
				var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);							
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				oControl.setSelectedKey(vUpdateValue);
			} else if(Fieldname == "Aus02" || Fieldname == "Aus03" || Fieldname == "Aus04" || Fieldname == "Aus05") { //
				var vExcod = "A002";
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda},
				                  {key : "Excod", value : vExcod}];
				
				var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);							
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				oControl.setSelectedKey(vUpdateValue);
			} else if(Fieldname == "Ret_persa") { //해제 인사 영역 리스트
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda}];
				var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);	
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				oControl.setSelectedKey(vUpdateValue);
				oControl.attachChange(oController.onChangeRet_persa);
				
				if(vUpdateValue != "" && vUpdateValue != "0000") {
					oController._vRet_persa = vUpdateValue;
				}
			} else if(Fieldname == "Ret_btrtl" || Fieldname == "Ret_zzjobsr") {
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda},
				                  {key : "Excod", value : oController._vRet_persa}];
				var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);	
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				oControl.setSelectedKey(vUpdateValue);
			}else if(Fieldname == "Zzjiktl") {
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
	                  {key : "Actda", value : oController._vActda},
	                  {key : "Excod", value : oController._vSelectedZzikgb}];
				var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);	
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				oControl.setSelectedKey(vUpdateValue);
			}else {
//				var mEmpCodeList = null;			
//				var vAddFilter = [{key : "Persa", value : oController._vPersa},
//				                  {key : "Actda", value : oController._vActda}];			
//				mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter, true);
//				
//				oControl.setModel(mEmpCodeList); //sap.ui.getCore().getModel("EmpCodeList"));
//				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, []);
				
				oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
				oControl.setSelectedKey(vUpdateValue);
				if(Fieldname == "Zzjikgb"){
					oController._vSelectedZzikgb = vUpdateValue ;
					oControl.attachChange(oController.onChangeZzjikgb);
				}
//				if(Fieldname == "Zzjiktl")
			}
		} else if(Fieldtype == "M2" || Fieldtype == "O2") {
			if(Fieldname == "Orgeh" || Fieldname == "Zzorgid") {
				oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
		        	   width : "95%",
		        	   showValueHelp: true,
		        	   valueHelpOnly: true,
		        	   liveChange : oController.onLiveChange,
					   valueHelpRequest: oController.displayOrgSearchDialog
		        }).addStyleClass("L2PFontFamily");
				oControl.setValue(vUpdateTextValue);
				oControl.addCustomData(new sap.ui.core.CustomData({
					key : "Orgeh",
					value : vUpdateValue
				}));
			} else if(Fieldname == "Stell" || Fieldname == "Zzstell" || Fieldname == "Add_stell" || Fieldname == "Add_zzstell" || Fieldname == "Dis_stell" || Fieldname == "Ext_stell") {
				oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
		        	   width : "95%",
		        	   showValueHelp: true,
		        	   valueHelpOnly: true,
		        	   liveChange : oController.onLiveChange,
					   valueHelpRequest: oController.displayStellSearchDialog
		        }).addStyleClass("L2PFontFamily");
				oControl.setValue(vUpdateTextValue);
				oControl.addCustomData(new sap.ui.core.CustomData({
					key : Fieldname,
					value : vUpdateValue
				}));
			} else if(Fieldname == "Dis_orgeh" || Fieldname == "Add_orgeh" || Fieldname == "Rls_orgeh") {
				oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
		        	   width : "95%",
		        	   showValueHelp: true,
		        	   valueHelpOnly: true,
		        	   liveChange : oController.onLiveChange,
					   valueHelpRequest: oController.displayOrgSearchDialog
		        }).addStyleClass("L2PFontFamily");
				oControl.setValue(vUpdateTextValue);
				oControl.addCustomData(new sap.ui.core.CustomData({
					key : "Orgeh",
					value : vUpdateValue
				}));
			} else if(Fieldname == "Host_staff" || Fieldname == "Home_staff") {
				oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
		        	   width : "95%",
		        	   showValueHelp: true,
		        	   valueHelpOnly: true,
		        	   liveChange : oController.onLiveChange,
					   valueHelpRequest: oController.displayEmplyeeSearchDialog
		        }).addStyleClass("L2PFontFamily");
				oControl.setValue(vUpdateTextValue);
				oControl.addCustomData(new sap.ui.core.CustomData({
					key : Fieldname,
					value : vUpdateValue
				}));
			} else if(Fieldname == "Host_orgeh") {
				oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
		        	   width : "95%",
		        	   showValueHelp: true,
		        	   valueHelpOnly: true,
		        	   liveChange : oController.onLiveChange,
					   valueHelpRequest: oController.displayOrgSearchDialog
		        }).addStyleClass("L2PFontFamily");
				oControl.setValue(vUpdateTextValue);
				oControl.addCustomData(new sap.ui.core.CustomData({
					key : "Orgeh",
					value : vUpdateValue
				}));
			} else if(Fieldname == "Zzprdar" || Fieldname == "Zzprdar2") {
				oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
		        	   width : "95%",
		        	   showValueHelp: true,
		        	   valueHelpOnly: true,
		        	   liveChange : oController.onLiveChange,
					   valueHelpRequest: oController.displayPrdAreaSearchDialog
		        }).addStyleClass("L2PFontFamily");
				oControl.setValue(vUpdateTextValue);
				oControl.addCustomData(new sap.ui.core.CustomData({
					key : Fieldname,
					value : vUpdateValue
				}));
			} else {
				oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
		        	   width : "95%",
		        }).addStyleClass("L2PFontFamily");
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
	        }).addStyleClass("L2PFontFamily");
			
			if(Fieldname == "Ansal" || Fieldname == "Bet01" || Fieldname == "Bet02" || Fieldname == "Bet03" || Fieldname == "Bet01_v2") {
				oControl.setType(sap.m.InputType.Number);
				oControl.attachChange(oController.changeAmount);
			} else {
				oControl.setType(sap.m.InputType.Text);
			}			
			oControl.setValue(vUpdateValue);
		} else if(Fieldtype == "M4" || Fieldtype == "O4") {
			oControl = new sap.m.DatePicker(oController.PAGEID + "_" + Fieldname, {
	        	   width : "95%",
	        	   valueFormat : "yyyy-MM-dd",
		           displayFormat : gDtfmt,
		           change : oController.changeDate, 
	        }).addStyleClass("L2PFontFamily");
			if(vUpdateValue != null && vUpdateValue != "") {
				var tDate = common.Common.setTime(new Date(vUpdateValue));
				oControl.setValue(dateFormat.format(new Date(tDate)));
			}
		}  else if(Fieldtype == "M5" || Fieldtype == "O5") {
			if(Fieldname == "Kostl") {
				oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
		        	   width : "95%",
		        	   showValueHelp: true,
		        	   valueHelpOnly: true,
		        	   liveChange : oController.onLiveChange,
					   valueHelpRequest: oController.displayKostlSearchDialog
		        }).addStyleClass("L2PFontFamily");
				oControl.setValue(vUpdateTextValue);
				oControl.addCustomData(new sap.ui.core.CustomData({
					key : Fieldname,
					value : vUpdateValue
				}));
			} else if(Fieldname == "Zzlojob") {
				oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
		        	   width : "95%",
		        	   showValueHelp: true,
		        	   valueHelpOnly: true,
		        	   liveChange : oController.onLiveChange,
					   valueHelpRequest: oController.displayZzlojobSearchDialog
		        }).addStyleClass("L2PFontFamily");
				oControl.setValue(vUpdateTextValue);
				oControl.addCustomData(new sap.ui.core.CustomData({
					key : Fieldname,
					value : vUpdateValue
				})); 
			} else {
				oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
		        	   width : "95%",
		        	   showValueHelp: true,
		        	   valueHelpOnly : true,
		        	   liveChange : oController.onLiveChange,
					   valueHelpRequest: oController.displayCodeSearchDialog
		        }).addStyleClass("L2PFontFamily");
				
				oControl.setValue(vUpdateTextValue);
				oControl.addCustomData(new sap.ui.core.CustomData({
					key : Fieldname,
					value : vUpdateValue
				}));
				oControl.addCustomData(new sap.ui.core.CustomData({
					key : "Title",
					value : vLabelText
				}));
			}
			
			//"HOST_WERKS"
			if(Fieldname == "Host_werks") {
				if(vUpdateValue != "" && vUpdateValue != "0000") {
					oController._vHost_werks = vUpdateValue;
				}
			}
		} else if(Fieldtype == "M6" || Fieldtype == "O6") {
			oControl = new sap.m.CheckBox(oController.PAGEID + "_" + Fieldname, {
	        	   select : oController.onLiveChange
	        }).addStyleClass("L2PFontFamily");
			if(vUpdateValue == "X") oControl.setSelected(true);
			else  oControl.setSelected(false);
		} else if(Fieldtype == "M0") {
			oControl = new sap.m.Select(oController.PAGEID + "_" + Fieldname, {
	        	   width : "95%",
	        	   enabled : false
	        }).addStyleClass("L2PFontFamily");
			
			if(Fieldname == "Persg") { //사원그룹
				oController._vSelectedPersg = vUpdateValue;
				
				oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
				
				oControl.setSelectedKey(vUpdateValue);
			} else if(Fieldname == "Persk") { //사원하위그룹 Excod
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda},
				                  {key : "Excod", value : oController._vSelectedPersg}];
				
				var mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);
				
				oController._vSelectedPersk = vUpdateValue; 
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				oControl.setSelectedKey(vUpdateValue);
			} else {
				oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
				oControl.setSelectedKey(vUpdateValue);
			} 
		} else if(Fieldtype == "D0" || Fieldtype == "D1") {
			oControl = new sap.m.Input(oController.PAGEID + "_" + Fieldname, {
	        	   width : "95%",
	        	   editable : false
	        }).addStyleClass("L2PFontFamily");
			
			oControl.setValue(vUpdateTextValue);
		}
		
		if(oControl) oControl.setTooltip(vLabelText);
		
		return oControl;
	},
	
	makeTableControl : function(oController, Fieldtype, Fieldname, TextFieldname, vMaxLength, vLabelText, Itgrp) {
		var oControl = null;
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		if(Fieldtype == "M1" || Fieldtype == "O1") {
			oControl = new sap.m.Select({
	        	   width : "95%",
	        	   selectedKey : {path : Fieldname}
	        }).addStyleClass("L2PFontFamily");			
			
			var mEmpCodeList = null;			
			var vAddFilter = [{key : "Persa", value : oController._vPersa},
			                  {key : "Actda", value : oController._vActda}];			
			mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter, true);
			
			var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
			if(vEmpCodeList && vEmpCodeList.length) {
				for(var i=0; i<vEmpCodeList.length; i++) {
					oControl.addItem(new sap.ui.core.Item({key : vEmpCodeList[i].Ecode, text : vEmpCodeList[i].Etext}))
				}
			}
		} else if(Fieldtype == "M2" || Fieldtype == "O2") {
			
		} else if(Fieldtype == "M3" || Fieldtype == "O3") {
			oControl = new sap.m.Input({
	        	   width : "95%",
	        	   maxLength : vMaxLength,
	        	   value : {path : Fieldname}
	        }).addStyleClass("L2PFontFamily");
		} else if(Fieldtype == "M4" || Fieldtype == "O4") {
			oControl = new sap.m.DatePicker({
	        	   width : "95%",
	        	   valueFormat : gDtfmt,
		           displayFormat : gDtfmt,
		           change : oController.changeDate,
		           value : {path : Fieldname}
	        }).addStyleClass("L2PFontFamily");
		}  else if(Fieldtype == "M5" || Fieldtype == "O5") {
			if(Fieldname == "Kostl") {
				oControl = new sap.m.Input({
		        	   width : "95%",
		        	   showValueHelp: true,
		        	   valueHelpOnly: true,
		        	   value : {path : TextFieldname},
		        	   liveChange : oController.onLiveChange,
					   valueHelpRequest: oController.displayKostlSearchDialog,
					   customData : {key : Fieldname, value : {path : Fieldname}}
		        }).addStyleClass("L2PFontFamily");
				oControl.addCustomData(new sap.ui.core.CustomData({
					key : "Itgrp",
					value : Itgrp
				}));
			} else if(Fieldname == "Zzlojob") {
				oControl = new sap.m.Input({
		        	   width : "95%",
		        	   showValueHelp: true,
		        	   valueHelpOnly: true,
		        	   value : {path : TextFieldname},
		        	   liveChange : oController.onLiveChange,
					   valueHelpRequest: oController.displayZzlojobSearchDialog,
					   customData : {key : Fieldname, value : {path : Fieldname}}
		        }).addStyleClass("L2PFontFamily");
				oControl.addCustomData(new sap.ui.core.CustomData({
					key : "Itgrp",
					value : Itgrp
				}));
			} else {
				oControl = new sap.m.Input({
		        	   width : "95%",
		        	   showValueHelp: true,
		        	   valueHelpOnly : true,
		        	   liveChange : oController.onLiveChange,
		        	   value : {path : TextFieldname},
					   valueHelpRequest: oController.displayTableCodeSearchDialog,
					   customData : {key : Fieldname, value : {path : Fieldname}}
		        }).addStyleClass("L2PFontFamily");
				oControl.addCustomData(new sap.ui.core.CustomData({
					key : "Title",
					value : vLabelText
				}));
				oControl.addCustomData(new sap.ui.core.CustomData({
					key : "Itgrp",
					value : Itgrp
				}));
			}
		} else if(Fieldtype == "M6" || Fieldtype == "O6") {
			oControl = new sap.m.CheckBox({
	        	   select : oController.onLiveChange,
	        	   Selected : {path : Fieldname, formatter : function(fVal) {return fVal == "X" ? true : false}}
	        }).addStyleClass("L2PFontFamily");
		}
		
		if(oControl) oControl.setTooltip(vLabelText);
		
		return oControl;
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
			oControl.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
			
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
		//oController._vActiveControl = [];
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
			oMatrixLayout.destroy();
		}
		
		var oGroupingInputLayout = sap.ui.getCore().byId(oController.PAGEID + "_GroupingInputLayout");
		if(oGroupingInputLayout) {
//			var oSections = oGroupingInputLayout.getSections();
//			if(oSections) {
//				for(var i=0; i<oSections.length; i++) {
//					var oSubSections = oSections[i].getSubSections();
//					if(oSubSections) {
//						for(var j=0; j<oSubSections.length; j++) {
//							oSubSections[j].destroyBlocks();
//							oSubSections[j].destroyMoreBlocks();
//							oSubSections[j].destroyActions();
//						}
//						oSections[i].destroySubSections();
//					}
//				}
//				oGroupingInputLayout.destroySections();
//			}
			oGroupingInputLayout.destroy();
		}
		
		var oActionControlsLayout = sap.ui.getCore().byId(oController.PAGEID + "_ActionControlsLayout");
		if(oActionControlsLayout) {
			oActionControlsLayout.destroyContent();
		}
		
		oController._vActiveControl = [];
		oController._vActiveGroup = [];
		oController._vActiveMassn = [];
	},

	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		if(oController._vActionType == "100" || oController._vActionType == "300") {
			var oPersonList = sap.ui.getCore().byId(oController.PAGEID + "_List");
			var vContexts = oPersonList.getSelectedContexts(true);
			if(vContexts && vContexts.length) {
				
			} else {
				sap.m.MessageBox.alert("대상자를 선택해 주시기 바랍니다.");
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
		
		for(var i=0; i<5; i++) {
			var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
			var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
			
			if(oMassn.getSelectedKey() == "0000" || oMassn.getSelectedKey() == "") {
				eval("vCreateData.Massn" + (i+1) + " = '';");
			} else {
				eval("vCreateData.Massn" + (i+1) + " = '" + oMassn.getSelectedKey() + "';");
			}
			
			if(oMassg.getSelectedKey() == "0000" || oMassg.getSelectedKey() == "") {
				eval("vCreateData.Massg" + (i+1) + " = '';");
			} else {
				eval("vCreateData.Massg" + (i+1) + " = '" + oMassg.getSelectedKey() + "';");
			}
		}
		
//		if(vCreateData.Massn1 == "" || vCreateData.Massg1 == "") {
		if(vCreateData.Massn1 == "") {
			sap.m.MessageBox.alert("발령유형을 최소한 1개이상 선택 바랍니다.");
			return;
		}
		
		var vTableVariables = [];
		
		try {
			if(oController._vActiveControl && oController._vActiveControl.length) {
				for(var i=0; i<oController._vActiveControl.length; i++) {
					var Fieldname = oController._vActiveControl[i].Fieldname;
					var Fieldtype = oController._vActiveControl[i].Incat;
					Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
					
					var oControl = sap.ui.getCore().byId(oController.PAGEID + "_" + Fieldname);
					
					var vLabel = oController._vActiveControl[i].Label;
					var vLabelText = "";
					if(vLabel != "") vLabelText = vLabel;
					else vLabelText = oController._vActiveControl[i].Label;
					
					//입력항목의 유형에 따라 달리 처리한다.
					// M1 : select
					// M2 : Input & Tree Popup
					// M3 : Input only
					// M4 : DatePicker
					// M5 : Input & Select Dialog
					// M6 : Single Checkbox
					
					if(oControl) {
						if(Fieldtype == "M0") {
							if(oControl.getSelectedKey() == "0000" || oControl.getSelectedKey() == "") {
							} else {
								eval("vCreateData." + Fieldname + " = '" + oControl.getSelectedKey() + "';");
							}
						} else if(Fieldtype == "M1") {
//							if(oControl.getSelectedKey() == "0000" || oControl.getSelectedKey() == "") {
							if(oControl.getSelectedKey() == "0000") {
								oControl.addStyleClass("L2PSelectInvalidBorder");
								
								var vMsg = "&Cntl 를(을) 선택해 주시기 바랍니다.";
								vMsg = vMsg.replace("&Cntl", vLabelText);
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
								var vMsg = "&Cntl 를(을) 입력해 주시기 바랍니다.";
								vMsg = vMsg.replace("&Cntl", vLabelText);
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
								// eval("vCreateData." + Fieldname + "_Tx = '" + Encode(oControl.getValue()) + "';"); 
								eval("vCreateData." + Fieldname + "_Tx = '" + oControl.getValue() + "';");
								//2017-12-28 임시 수정
							}
						} else if(Fieldtype == "M3") {
							if(oControl.getValue() == "") {
								oControl.setValueState(sap.ui.core.ValueState.Error);
								var vMsg = "&Cntl 를(을) 입력해 주시기 바랍니다.";
								vMsg = vMsg.replace("&Cntl", vLabelText);
								sap.m.MessageBox.alert(vMsg);
								return;
							} else {
								oControl.setValueState(sap.ui.core.ValueState.None);
								var _vValue = oControl.getValue();
								var _vIndexTemp = [];
								var _vStartPoint = 0;
								var _vIndex; 
								do{
									_vIndex = _vValue.indexOf("'",_vStartPoint);
									if( _vIndex != -1){
										_vValue = _vValue.substring(0,_vIndex) + "\\" + _vValue.substring(_vIndex,_vValue.length) ;
										_vStartPoint = _vIndex + 2 ;
									}
								}while( _vIndex != -1 );
									
								eval("vCreateData." + Fieldname + " = '" + _vValue + "';");
							}
						} else if(Fieldtype == "M4") {
							if(oControl.getValue() == "") {
								oControl.setValueState(sap.ui.core.ValueState.Error);
								var vMsg = "&Cntl 를(을) 입력해 주시기 바랍니다.";
								vMsg = vMsg.replace("&Cntl", vLabelText);
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
								var vMsg = "&Cntl 를(을) 입력해 주시기 바랍니다.";
								vMsg = vMsg.replace("&Cntl", vLabelText);
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
								var vMsg = "&Cntl 를(을) 선택해 주시기 바랍니다.";
								vMsg = vMsg.replace("&Cntl", vLabelText);
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
										if(Fieldname == "Dis_orgeh" || Fieldname == "Add_orgeh" || Fieldname == "Rls_orgeh" || Fieldname == "Host_orgeh" || Fieldname == "Zzorgid" ) tmpFieldname = "Orgeh";
										else tmpFieldname = Fieldname;
										
										if(oCustomData[c].getKey() == tmpFieldname) {
											vVal = oCustomData[c].getValue();
										}
									}
								}
								eval("vCreateData." + Fieldname + " = '" + vVal + "';");
								// eval("vCreateData." + Fieldname + "_Tx = '" + Encode(oControl.getValue()) + "';");
								eval("vCreateData." + Fieldname + "_Tx = '" + oControl.getValue() + "';");
								//2017-12-28 임시 수정
							}
						} else if(Fieldtype == "O3") {
							if(oControl.getValue() == "") {
								
							} else {
								oControl.setValueState(sap.ui.core.ValueState.None);
								var _vValue = oControl.getValue();
								var _vIndexTemp = [];
								var _vStartPoint = 0;
								var _vIndex; 
								do{
									_vIndex = _vValue.indexOf("'",_vStartPoint);
									if( _vIndex != -1){
										_vValue = _vValue.substring(0,_vIndex) + "\\" + _vValue.substring(_vIndex,_vValue.length) ;
										_vStartPoint = _vIndex + 2 ;
									}
								}while( _vIndex != -1 )
								eval("vCreateData." + Fieldname + " = '" + _vValue + "';");
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
						} else if(Fieldtype == "O6") {
							var vVal = ""; 
							if(oControl.getSelected() == true) {
								vVal = "X";
							}
							eval("vCreateData." + Fieldname + " = '" + vVal + "';");
						} else if(Fieldtype == "D1") {
							if(Fieldname == "Waers2"){
								vCreateData.Waers2 =  oControl.getValue() ;
								vCreateData.Waers2_Tx =  oControl.getValue() ;
							}
						}
					} else {
						if(Fieldtype == "TB") {
							vTableVariables.push(oController._vActiveControl[i]);
							var fResult = oController.onCheckTableData(oController, oController._vActiveControl[i]);
							if(!fResult) return;
						}
					}
				}
			}
		} catch(ex) {
			console.log(ex);
		}
			
		var dataProcess = function() {
			var mActionSubjectList_Temp = sap.ui.getCore().getModel("ActionSubjectList_Temp");
			
			if(oController._vActionType == "100" || oController._vActionType == "300") {
				var oPersonList = sap.ui.getCore().byId(oController.PAGEID + "_List");
				var vContexts = oPersonList.getSelectedContexts(true);
				var oPath = "/ActionSubjectListSet";
				var process_result = false;
				
				if(vContexts && vContexts.length) {		
					var vSelectedPernr = [];
					
					for(var i=0; i<vContexts.length; i++) {
						vCreateData.Pernr = mActionSubjectList_Temp.getProperty(vContexts[i] + "/Pernr");
						vCreateData.Ename = mActionSubjectList_Temp.getProperty(vContexts[i] + "/Ename");
						
						vSelectedPernr.push(vCreateData.Pernr);
						
						process_result = false;

						if(vTableVariables.length > 0) {
							for(var t=0; t<vTableVariables.length; t++) {
								process_result = oController.onSaveTableData(oController, vTableVariables[t]);
								if(process_result == false) {
									oController.BusyDialog.close();
									return;
								}
							}
						}
						
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
							oController.BusyDialog.close();
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
					sap.m.MessageBox.alert("대상자를 선택해 주시기 바랍니다.");
					oController.BusyDialog.close();
					return;
				}
			} else {
				
				var process_result = false;
				
				if(vTableVariables.length > 0) {
					for(var t=0; t<vTableVariables.length; t++) {
						process_result = oController.onSaveTableData(oController, vTableVariables[t]);
						if(process_result == false) {
							oController.BusyDialog.close();
							return;
						}
					}
				}
				
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
					oController.BusyDialog.close();
					return
				} else {
					
				}			
			}
			
			oController.BusyDialog.close();
			
			for(var i=0; i<5; i++) {
				var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
				oMassn.setEnabled(false);
				oMassn.setSelectedKey("0000");
				
				var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
				oMassg.removeAllItems();
				oMassg.setSelectedKey("0000");
				oMassg.setEnabled(false);
			}
			
			var oInputSwith = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
			oInputSwith.setState(false);
			
			oController.initInputControl(oController);
			
			var vActionSubjectList_Temp = mActionSubjectList_Temp.getProperty("/ActionSubjectListSet");
			
			if(oController._vActionType == "100" || oController._vActionType == "300") {
				sap.m.MessageBox.alert("저장하였습니다.", {
					title : "안내",
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
			}		
		}
		
		var oBusyIndicator = new sap.m.BusyIndicator({
			text : "잠시만 기다려주십시오." ,
			customIcon : "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/images/progress.gif",
			customIconWidth : "40px",
			customIconHeight : "40px"
		});
	
		oController.BusyDialog.open();
		
		setTimeout(dataProcess, 300);
			
	},
	
	onCheckTableData : function(oController, ActiveControl) {
		var fResult = true;
		
		var vActionSubjectTableHeaderSet = oController.getActionSubjectTableHeaderSet(oController, ActiveControl.Itgrp);
		
		var mItgrpList = sap.ui.getCore().getModel("JSON_" + ActiveControl.Itgrp);
		if(!mItgrpList) {
			return true;
		}
		var vItgrpList = mItgrpList.getProperty("/TableDataList");
		
		if(vItgrpList && vItgrpList.length) {			
		
			for(var i=0; i<vActionSubjectTableHeaderSet.length; i++) {
				var Fieldname = vActionSubjectTableHeaderSet[i].Fieldname;
				var Fieldtype = vActionSubjectTableHeaderSet[i].Inpty;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var vLabelText = vActionSubjectTableHeaderSet[i].Label;			
				
				if(Fieldtype == "M1" || Fieldtype == "M2" || Fieldtype == "M5" || Fieldtype == "M6" || Fieldtype == "M8") {
					for(var v=0; v<vItgrpList.length; v++) {
						var vValue = eval("vItgrpList[v]." + Fieldname + ";");
						
						if(vValue == "") {
							var vMsg = "&Cntl 를(을) 선택해 주시기 바랍니다.";
							vMsg = vMsg.replace("&Cntl", vLabelText);
							sap.m.MessageBox.alert(vMsg);
							return false;
						}
					}
				} else if(Fieldtype == "M3" || Fieldtype == "M4" || Fieldtype == "M7") {
					for(var v=0; v<vItgrpList.length; v++) {
						var vValue = eval("vItgrpList[v]." + Fieldname + ";");
						
						if(vValue == "") {
							var vMsg = "&Cntl 를(을) 입력해 주시기 바랍니다.";
							vMsg = vMsg.replace("&Cntl", vLabelText);
							sap.m.MessageBox.alert(vMsg);
							return false;
						}
					}
				}
			}
		}
		return fResult;
	},
	
	onSaveTableData: function(oController, ActiveControl) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var vActionSubjectTableHeaderSet = oController.getActionSubjectTableHeaderSet(oController, ActiveControl.Itgrp);
		
		var mItgrpList = sap.ui.getCore().getModel("JSON_" + ActiveControl.Itgrp);
		if(!mItgrpList) {
			return;
		}
		
		var vItgrpList = mItgrpList.getProperty("/TableDataList");
		
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		
		if(vItgrpList && vItgrpList.length) {
			for(var v=0; v<vItgrpList.length; v++) {
				var vOneData = {}
				
				vOneData.Docno = vItgrpList[v].Docno;
				if(vItgrpList[v].VoltId != "") vOneData.VoltId = vItgrpList[v].VoltId;
				vOneData.Actda = "\/Date(" + common.Common.getTime(oActda.getValue()) + ")\/";
				vOneData.Pernr = vItgrpList[v].Pernr;
				vOneData.Infty = vItgrpList[v].Infty;
				vOneData.Subty = vItgrpList[v].Subty;
				vOneData.Objps = vItgrpList[v].Objps;
				vOneData.Sprps = vItgrpList[v].Sprps;
				vOneData.Endda = vItgrpList[v].Endda;
				vOneData.Begda = vItgrpList[v].Begda;
				vOneData.Seqnr = vItgrpList[v].Seqnr;
				vOneData.Isnew = vItgrpList[v].Isnew;
				vOneData.Numbr = "" + vItgrpList[v].Numbr;
				
				if(v == 0) {
					vOneData.Actty = "X";
				} else {
					vOneData.Actty  = "";
				}
				
				var fIdx = 1;
				
				for(var i=0; i<vActionSubjectTableHeaderSet.length; i++) {
					var Fieldname = vActionSubjectTableHeaderSet[i].Fieldname;
					var Fieldtype = vActionSubjectTableHeaderSet[i].Inpty;
					var Fieldname1 = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
					var TextFieldname = Fieldname1 + "_Tx";
					
					if(Fieldname1 == "Begda" || Fieldname1 == "Endda") {
						Fieldname1 = Fieldname1 + "T";
						TextFieldname = Fieldname1 + "_Tx";
					}
					
					var idx = "00";
					if(fIdx < 10) idx = "0" + fIdx;
					else  idx = "" + fIdx;
					
					eval("vOneData.Field" + idx + " = Fieldname;");
					eval("vOneData.Value" + idx + " = vItgrpList[v]." + Fieldname1 + ";");					
					
					var vTextValue = eval("vItgrpList[v]." + TextFieldname + ";");
					if(vTextValue != "") {
						eval("vOneData.Valtx" + idx + " = vItgrpList[v]." + TextFieldname + ";");
					}
					fIdx++;
				}
				console.log(vOneData);
				
				var process_result = false;
				
				oModel.create(
						"/ActionSubjectTableSet", 
						vOneData, 
						null,
					    function (oData, response) {
							process_result = true;
							common.Common.log("Sucess ActionSubjectTableSet Create !!!");
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
					return false;
				}
			}
		} else {
			var vDelData = {}
			
			vDelData.Docno = oController._vDocno;
			vDelData.VoltId = oController._vPernrVoltid ? oController._vPernrVoltid : "";
			vDelData.Actda = "\/Date(" + common.Common.getTime(oController._vActda) + ")\/";
			vDelData.Pernr = oController._vPernr;
			vDelData.Infty = ActiveControl.Itgrp;
			vDelData.Subty = "";
			vDelData.Objps = "";
			vDelData.Sprps = "";
			vDelData.Endda = null;
			vDelData.Begda = null;
			vDelData.Seqnr = "";
			vDelData.Isnew = "";
			vDelData.Numbr = "001";
			vDelData.Actty = "DA"; 
			
			oModel.create(
					"/ActionSubjectTableSet", 
					vDelData, 
					null,
				    function (oData, response) {
						process_result = true;
						common.Common.log("Sucess ActionSubjectTableSet Create !!!");
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
				return false;
			}
		}
		return true;
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		
		common.SearchOrg.oController = oController;
		common.SearchOrg.vActionType = "Single";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "Input";
		common.SearchOrg.vNoPersa = true;
		
		if(!oController._SerachOrgDialog) {
			oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SerachOrgDialog);
		}
		oController._SerachOrgDialog.open();
	},
	
	displayPrdAreaSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var mProductAreaModel = new sap.ui.model.json.JSONModel();
		var vProductAreaModel = {PrdAreaCodeListSet : []};
		
//		var mEmpCodeList = sap.ui.getCore().getModel("EmpCodeList");
		
		var vAddFilter = [{key : "Persa", value : oController._vPersa},
		                  {key : "Actda", value : oController._vActda}];
		var mEmpCodeList = oController.setSpecialCodeData("Zzprdar", vAddFilter, false);
		var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
		
		if(vEmpCodeList && vEmpCodeList.length) {
			for(var i=0; i<vEmpCodeList.length; i++) {
//				if(vEmpCodeList[i].Field == "Zzprdar" && vEmpCodeList[i].Ecode != "0000") {
//					vProductAreaModel.PrdAreaCodeListSet.push(vEmpCodeList[i]);
//				}
				vProductAreaModel.PrdAreaCodeListSet.push(vEmpCodeList[i]);
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var mOneCodeModel =sap.ui.getCore().getModel("CodeListModel");
		mOneCodeModel.setData(null);
		var vOneCodeList = {EmpCodeListSet : []};
		
		var oCustomData = oEvent.getSource().getCustomData();
		var Fieldname = oCustomData[0].getKey();
		
		var vTitle = oCustomData[1].getValue();
		
		var mEmpCodeList = null;
		
		var vAddFilter = [{key : "Persa", value : oController._vPersa},
		                  {key : "Actda", value : oController._vActda}];
		
		if(Fieldname == "Aus01") {	
			var vExcod = "";
			if(oController._vMolga == "18") vExcod = "CZ01";
			else if(oController._vMolga == "06") vExcod = "A004";
			else vExcod = "A001";
			vAddFilter.push({key : "Excod", value : vExcod});
			
			mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter, false);
		} else {
			mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter, false);
		}
		
		var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
		if(vEmpCodeList && vEmpCodeList.length) {
			for(var i=0; i<vEmpCodeList.length; i++) {
				vOneCodeList.EmpCodeListSet.push(vEmpCodeList[i]);
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
		oDialog.setTitle(vTitle);
	},
	
	displayTableCodeSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var mOneCodeModel =sap.ui.getCore().getModel("CodeListModel");
		mOneCodeModel.setData(null);
		var vOneCodeList = {EmpCodeListSet : []};
		
		var oCustomData = oEvent.getSource().getCustomData();
		var Fieldname = oCustomData[0].getKey();
		var vTitle = oCustomData[1].getValue();
		var vItgrp = oCustomData[2].getValue();
		
		var mEmpCodeList = null;
		
		var vAddFilter = [{key : "Persa", value : oController._vPersa},
		                  {key : "Actda", value : oController._vActda}];
		
		if(Fieldname == "Lgart") {
			vAddFilter.push({key : "Excod", value : vItgrp});
			mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter, false);
		} else {
			mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter, false);
		}
		
		var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
		
		if(vEmpCodeList && vEmpCodeList.length) {
			for(var i=0; i<vEmpCodeList.length; i++) {				
				vOneCodeList.EmpCodeListSet.push(vEmpCodeList[i]);
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
		oDialog.setTitle(vTitle);
	},
	
	displayMultiStellSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
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
	
	_SerachKostlDialog : null,
	displayKostlSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var vControlId = oEvent.getSource().getId();
		
		var oCustomData = oEvent.getSource().getCustomData();
		
		var vItgrp = "";
		for(var i=0; i<oCustomData.length; i++) {
			if(oCustomData[i].getKey() == "Itgrp") {
				vItgrp = oCustomData[i].getValue();
				break;
			}
		}
		var vKey = oCustomData[0].getKey();	
		var vCompany = "";
		
		if(vItgrp != "") {
			var oModel = sap.ui.getCore().getModel("JSON_" + vItgrp);
			var pos1 = vControlId.lastIndexOf("-");
			var idx = vControlId.substring(pos1 + 1);
			vCompany = oModel.getProperty("/TableDataList/" + idx + "/Bukrs");
			
			if(!vCompany || vCompany == "") {
				var vMsg = "&Cntl 를(을) 선택해 주시기 바랍니다.";
				vMsg = vMsg.replace("&Cntl", "Company Code");
				sap.m.MessageBox.alert(vMsg);
				return;
			}
		}
		
		jQuery.sap.require("common.SearchKostl");
		
		common.SearchKostl.oController = oController;
		common.SearchKostl.vActionType = "Single";
		common.SearchKostl.vCallControlId = vControlId;
		common.SearchKostl.vCallControlType = "Input";
		common.SearchKostl.vCompany = vCompany;
		
		if(!oController._SerachKostlDialog) {
			oController._SerachKostlDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_KOSTL", oController);
			oView.addDependent(oController._SerachKostlDialog);
		}
		oController._SerachKostlDialog.open();		
	},
	
	_SerachZzlojobDialog : null,
	displayZzlojobSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchZzlojob");
		
		common.SearchZzlojob.oController = oController;
		common.SearchZzlojob.vActionType = "Single";
		common.SearchZzlojob.vCallControlId = oEvent.getSource().getId();
		common.SearchZzlojob.vCallControlType = "Input";
		
		if(!oController._SerachZzlojobDialog) {
			oController._SerachZzlojobDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ZZLOJOB", oController);
			oView.addDependent(oController._SerachZzlojobDialog);
		}
		oController._SerachZzlojobDialog.open();		
	},
	
	displayEmplyeeSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var vWerks = oEvent.getSource().getSelectedKey();

		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var oBtrtl = sap.ui.getCore().byId(oController.PAGEID + "_Btrtl");
		if(oBtrtl) {
			var oPath = "/PersSubareaListSet/?$filter=Persa%20eq%20%27" + vWerks + "%27";
			try {
				oBtrtl.removeAllItems();
				oBtrtl.destroyItems();
				oBtrtl.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
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
	// 직군 선택시 직급 Entity 를 갱신
	onChangeZzjikgb : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		var oZzjiktl = sap.ui.getCore().byId(oController.PAGEID + "_Zzjiktl");
		try {
			var oZzjikgb = oEvent.getSource(); //sap.ui.getCore().byId(oController.PAGEID + "_Host_werks");
			
			var vZzjikgb = oZzjikgb.getSelectedKey();
			
			if(oZzjiktl && vZzjikgb){
				oZzjiktl.removeAllItems();
				oZzjiktl.destroyItems();
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda},
				                  {key : "Excod", value : vZzjikgb}];
				var mDataModel = oController.setSpecialCodeData("Zzjiktl", vAddFilter, true);
				var vDataModel = mDataModel.getProperty("/EmpCodeListSet");	
				if(vDataModel && vDataModel.length) {
					for(var i=0; i<vDataModel.length; i++) {
						oZzjiktl.addItem(new sap.ui.core.Item({key : vDataModel[i].Ecode, text : vDataModel[i].Etext}));
					}
				}
			}
		} catch(ex) {
			common.Common.log(ex);
		}	
	},
	
	onChangeRet_persa : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oRet_persa = oEvent.getSource(); //sap.ui.getCore().byId(oController.PAGEID + "_Host_werks");
		
		var vPersa = oRet_persa.getSelectedKey();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var vAddFilter = [{key : "Persa", value : oController._vPersa},
		                  {key : "Actda", value : oController._vActda},
		                  {key : "Excod", value : vPersa}];
		
		try {
			var oRet_btrtl = sap.ui.getCore().byId(oController.PAGEID + "_Ret_btrtl");
			if(oRet_btrtl) {				
				oRet_btrtl.removeAllItems();
				oRet_btrtl.destroyItems();
					
				var mDataModel = oController.setSpecialCodeData("Ret_btrtl", vAddFilter, true);
				var vDataModel = mDataModel.getProperty("/EmpCodeListSet");	
				if(vDataModel && vDataModel.length) {
					for(var i=0; i<vDataModel.length; i++) {
						oRet_btrtl.addItem(new sap.ui.core.Item({key : vDataModel[i].Ecode, text : vDataModel[i].Etext}));
					}
				}
				
				var vDefaultValue = "";
				for(var i=0; i<oController._vActiveControl.length; i++) {
					var Fieldname = oController._vActiveControl[i].Fieldname;
					Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
					
					if(Fieldname == "Ret_btrtl") {
						vDefaultValue = oController._vActiveControl[i].Dcode;
						break;
					}
				} 

				if(vDefaultValue != "") {
					oRet_btrtl.setSelectedKey(vDefaultValue);
				}
			}
			
			var oRet_zzjobsr = sap.ui.getCore().byId(oController.PAGEID + "_Ret_zzjobsr");
			if(oRet_zzjobsr) {				
				oRet_zzjobsr.removeAllItems();
				oRet_zzjobsr.destroyItems();
				
				var mDataModel = oController.setSpecialCodeData("Ret_zzjobsr", vAddFilter, true);
				var vDataModel = mDataModel.getProperty("/EmpCodeListSet");	
				if(vDataModel && vDataModel.length) {
					for(var i=0; i<vDataModel.length; i++) {
						oRet_zzjobsr.addItem(new sap.ui.core.Item({key : vDataModel[i].Ecode, text : vDataModel[i].Etext}));
					}
				}
			}
		} catch(ex) {
			common.Common.log(ex);
		}	
	},
	
	onPressHost_werks : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oHost_werks = oEvent.getSource(); //sap.ui.getCore().byId(oController.PAGEID + "_Host_werks");
		
		var vWerks = oHost_werks.getSelectedKey();
		
		oController.onSelectHost_werks(vWerks);
	},
	
	onSelectHost_werks : function(vWerks) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var oHost_staff = sap.ui.getCore().byId(oController.PAGEID + "_Host_staff");
		if(oHost_staff) {
			var oPath = "/HostStaffListSet/?$filter=Host_werks%20eq%20%27" + vWerks + "%27"
			          + "%20and%20Actda%20eq%20datetime%27" + oController._vActda + "T00%3a00%3a00%27";
			try {
				oHost_staff.removeAllItems();
				oHost_staff.destroyItems();
				oHost_staff.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oList = sap.ui.getCore().byId(oController.PAGEID + "_List");
		var oItems = oList.getItems();
		if(oItems && oItems.length) {
			for(var i=0; i<oItems.length; i++) {
				oList.setSelectedItem(oItems[i], false);
			}
		}
		
		for(var i=0; i<5; i++) {
			var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
			oMassn.setEnabled(false);
			oMassn.setSelectedKey("0000");
			
			var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg" + (i+1));
			oMassg.setEnabled(false);
			oMassg.removeAllItems();
		}
		
		oController.initInputControl(oController);
		
		var oInputSwith = sap.ui.getCore().byId(oController.PAGEID + "_Input_Switch");
		oInputSwith.setState(false);
	},
	
	onPressAllSelect : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oList = sap.ui.getCore().byId(oController.PAGEID + "_List");
		var oItems = oList.getItems();
		if(oItems && oItems.length) {
			for(var i=0; i<oItems.length; i++) {
				oList.setSelectedItem(oItems[i], true);
			}
		}
		
		for(var i=0; i<5; i++) {
			var oMassn = sap.ui.getCore().byId(oController.PAGEID + "_Massn" + (i+1));
			oMassn.setEnabled(true);
			oMassn.setSelectedKey("0000");
		}
	},
	
	replaceString : function(data, c1, c2) {
		if(data == "") return "";
		var r = "";
		for(var i=0; i<data.length; i++) {
			if(data.substring(i, i+1) == c1) {
				r += c2;
			} else {
				r += data.substring(i, i+1);
			}
		}
		return r;
	},
	
	setSpecialCodeData : function(Fieldname, vAddFilter, select) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var mCodeModel = new sap.ui.model.json.JSONModel();
		var vCodeModel = {EmpCodeListSet : []};
		
		for(var i=0; i<vAddFilter.length; i++) {
			if(vAddFilter[i].key == "Excod") {
				var vExcod = vAddFilter[i].value;
				vExcod = oController.replaceString(vExcod, "|", "");
				
				if(vExcod == "") {
					if(select == true) {
						vCodeModel.EmpCodeListSet.push({Field : Fieldname, Ecode : "0000", Etext : "-- 선택 --"});
					}
					mCodeModel.setData(vCodeModel);	
					return mCodeModel;
				}
			}
		}
		
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
		
		if(select == false) {
			vCodeModel.EmpCodeListSet.push({Field : Fieldname, Ecode : "", Etext : "값 없음"});
		} else {
			vCodeModel.EmpCodeListSet.push({Field : Fieldname, Ecode : "0000", Etext : "-- 선택 --"});
		}		
		
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
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
		
		mCodeModel.setData(vCodeModel);	
		
		return mCodeModel;
	},
	
	setRlsOrgehCodeData : function(Fieldname, vAddFilter) {
	//	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
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
		
		vReleaseOrgListSet.ReleaseOrgListSet.push({Field : Fieldname, Rls_orgeh : "0000", Rls_orgeh_Tx : "-- 선택 --"});
		
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
			
			vReleasePersAreaListSet.ReleasePersAreaListSet.push({Field : Fieldname, Rls_werks : "0000", Rls_werks_Tx : "-- 선택 --"});
			
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
		
		vHomeStaffListSet.HomeStaffListSet.push({Field : Fieldname, Home_staff : "0000", Home_staff_Tx : "-- 선택 --"});
		
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
			if(vAddFilter[i].key != "Actda") {
				filterString += vAddFilter[i].key + "%20eq%20%27" + vAddFilter[i].value + "%27";
			} else {
				filterString += "Actda%20eq%20datetime%27" + vAddFilter[i].value + "T00%3a00%3a00%27";
			}
			
			if(i != (vAddFilter.length - 1)) {
				filterString += "%20and%20";
			}
		}
		
		vHostStaffListSet.HostStaffListSet.push({Field : Fieldname, Host_staff : "0000", Host_staff_Tx : "-- 선택 --"});
		
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
	
//	onPressTrfar : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
//		var oController = oView.getController();
//		
//		var oControl = oEvent.getSource();
//		
////		var oTrfgb = sap.ui.getCore().byId(oController.PAGEID + "_Trfgb");
//		var oTrfgr = sap.ui.getCore().byId(oController.PAGEID + "_Trfgr");
////		var oTrfst = sap.ui.getCore().byId(oController.PAGEID + "_Trfst");
//		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_Persg");
//		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_Persk");
////		if(oTrfgb && oTrfgr && oTrfst) {
//		if(oTrfgr) {
////			oTrfgr.removeAllItems();
//			oTrfgr.destroyItems();
//			
//			var vPersg = "";
//			var vPersk = "";
//			if(oPersg) vPersg = oPersg.getSelectedKey();
//			if(oPersk) vPersk = oPersk.getSelectedKey();
//			
//			if(oControl.getSelectedKey() != "0000") {
//				var vExcod = oController._vMolga + "|" + oControl.getSelectedKey() + "|" + oTrfgb.getSelectedKey() + "|" + vPersg  + "|" + vPersk;
//				var vAddFilter = [{key : "Persa", value : oController._vPersa},
//				                  {key : "Actda", value : oController._vActda},
//				                  {key : "Pernr", value : oController._vPernr},
//				                  {key : "Excod", value : vExcod}];
//				
//				var mDataModel = oController.setSpecialCodeData("Trfgr", vAddFilter, true);							
//				
//				oTrfgr.setModel(mDataModel);
//				oTrfgr.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
//				oTrfgr.setSelectedKey("0000");
//			} else {				
//				oTrfgr.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
//			}
//			
////			oTrfst.removeAllItems();
//			oTrfst.destroyItems();
//			oTrfst.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
//		}
//		
//		oController.onChangeCurrency2(oController);
//	},
//	
//	onPressTrfgb : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
//		var oController = oView.getController();
//		
//		var oControl = oEvent.getSource();
//		
////		var oTrfar = sap.ui.getCore().byId(oController.PAGEID + "_Trfar");
//		var oTrfgr = sap.ui.getCore().byId(oController.PAGEID + "_Trfgr");
////		var oTrfst = sap.ui.getCore().byId(oController.PAGEID + "_Trfst");
//		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_Persg");
//		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_Persk");
//		if( oTrfgr) {
////			oTrfgr.removeAllItems();
//			oTrfgr.destroyItems();
//			
//			var vPersg = "";
//			var vPersk = "";
//			if(oPersg) vPersg = oPersg.getSelectedKey();
//			if(oPersk) vPersk = oPersk.getSelectedKey();
//			
//			if(oControl.getSelectedKey() != "0000") {
//				var vExcod = oController._vMolga + "|" + oControl.getSelectedKey() + "|" + vPersg  + "|" + vPersk;
//				var vAddFilter = [{key : "Persa", value : oController._vPersa},
//				                  {key : "Actda", value : oController._vActda},
//				                  {key : "Pernr", value : oController._vPernr},
//				                  {key : "Excod", value : vExcod}];
//				
//				var mDataModel = oController.setSpecialCodeData("Trfgr", vAddFilter, true);							
//				
//				oTrfgr.setModel(mDataModel);
//				oTrfgr.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
//				oTrfgr.setSelectedKey("0000");
//			} else {				
//				oTrfgr.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
//			}
//			
////			oTrfst.removeAllItems();
//			oTrfst.destroyItems();
//			oTrfst.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
//		}
//		
//		oController.onChangeCurrency2(oController);
//	},
	
	onPressTrfgr : function(oEvent) {		
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		
		var oTrfar = sap.ui.getCore().byId(oController.PAGEID + "_Trfar");
		var oTrfgb = sap.ui.getCore().byId(oController.PAGEID + "_Trfgb");
		var oTrfst = sap.ui.getCore().byId(oController.PAGEID + "_Trfst");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_Persg");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_Persk");
		if(oTrfar && oTrfgb && oTrfst) {
//			oTrfst.removeAllItems();
			oTrfst.destroyItems();
			
			var vPersg = "";
			var vPersk = "";
			if(oPersg) vPersg = oPersg.getSelectedKey();
			if(oPersk) vPersk = oPersk.getSelectedKey();
			
			if(oControl.getSelectedKey() != "0000") {
				var vExcod = oController._vMolga + "|" + oTrfar.getSelectedKey() + "|" + oTrfgb.getSelectedKey() + "|" + oControl.getSelectedKey() + "|" + vPersg  + "|" + vPersk;
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda},
				                  {key : "Pernr", value : oController._vPernr},
				                  {key : "Excod", value : vExcod}];
				
				var mDataModel = oController.setSpecialCodeData("Trfst", vAddFilter, true);							
				
				oTrfst.setModel(mDataModel);
				oTrfst.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
			} else {				
				oTrfst.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
			}
		}
	},
	
	onPressPersg : function(oEvent) {		
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_Persk");
		if(oPersk) {
			oPersk.destroyItems();
			
			if(oControl.getSelectedKey() != "0000") {
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda},
				                  {key : "Excod", value : oControl.getSelectedKey()}];
				var mDataModel = oController.setSpecialCodeData("Persk", vAddFilter, true);							
				
				oPersk.setModel(mDataModel);
				oPersk.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				oPersk.setSelectedKey("0000");
			} else {
				oPersk.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
			}
		}
		try {			
			var oSchkz = sap.ui.getCore().byId(oController.PAGEID + "_Schkz");			
			if(oSchkz) {				
				oSchkz.destroyItems();
				oSchkz.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
			}
			
			var oTrfgr = sap.ui.getCore().byId(oController.PAGEID + "_Trfgr");			
			if(oTrfgr) {				
				oTrfgr.destroyItems();
				oTrfgr.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
			}
			
			var oTrfst = sap.ui.getCore().byId(oController.PAGEID + "_Trfst");			
			if(oTrfst) {				
				oTrfst.destroyItems();
				oTrfst.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
			}
			
			var oBtrtl = sap.ui.getCore().byId(oController.PAGEID + "_Btrtl");
			var oAbkrs = sap.ui.getCore().byId(oController.PAGEID + "_Abkrs");
			if(oPersk && oAbkrs && oBtrtl) {
				var vDeafultValue = oController.getDefaultValue(oController, "Abkrs", oControl.getSelectedKey(), oPersk.getSelectedKey(), oBtrtl.getSelectedKey());
				oController.setDefaultValue(oController, vDeafultValue, oAbkrs, "Abkrs")
//				oController.setDefaultValue(oController, vDeafultValue.valueSet[0], oAbkrs, "Abkrs");
//				var oSchkz = sap.ui.getCore().byId(oController.PAGEID + "_Schkz");
//				if(oSchkz && oSchkz != undefined && vDeafultValue.valueSet[1] != undefined && vDeafultValue.valueSet[1] != null)
//				oController.setDefaultValue(oController, vDeafultValue.valueSet[1], oSchkz, "Schkz");
			}
		} catch(ex) {
			console.log(ex);
		}	
		
	},
	
	setDefaultValue : function(oController, vDeafultValue, oControl, Field) {
		var Fieldtype = "";
		for(var i=0; i<oController._vActiveControl.length; i++) {
			if(Field.toUpperCase() == oController._vActiveControl[i].Fieldname.toUpperCase()) {
				Fieldtype = oController._vActiveControl[i].Incat;
				break;
			}
		}
		
		var vEcode = "";
		var vEtext = "";
		if(vDeafultValue != null) {
			vEcode = vDeafultValue.Ecode;
			vEtext = vDeafultValue.Etext;
		}		
		
		if(Fieldtype == "M0" || Fieldtype == "M1" || Fieldtype == "O1") {
			if(vEcode == "") vEcode = "0000";
			oControl.setSelectedKey(vEcode);
		} else if(Fieldtype == "M2" || Fieldtype == "O2" || Fieldtype == "M5" || Fieldtype == "O5") {
			oControl.setValue(vEtext);
			
			var oCustomData = oControl.getCustomData();
			if(oCustomData) {
				var vKey = oCustomData[0].getKey();
				oControl.removeAllCustomData();
				oControl.destroyCustomData();				    		
	    		oControl.addCustomData(new sap.ui.core.CustomData({key : vKey, value : vEcode}));
		    	for(var i=1; i<oCustomData.length; i++) {
		    		oControl.addCustomData(oCustomData[i]);
		    	}
			}
		}
	},
	
	onPressPersk : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_Persg");
		var oBtrtl = sap.ui.getCore().byId(oController.PAGEID + "_Btrtl");
		var oSchkz = sap.ui.getCore().byId(oController.PAGEID + "_Schkz");
		if(oSchkz && oPersg && oBtrtl) {
			oSchkz.destroyItems();
			
			if(oControl.getSelectedKey() != "0000") {
				var vExcod = oBtrtl.getSelectedKey() + "|" + oPersg.getSelectedKey() + "|" + oControl.getSelectedKey();
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda},
				                  {key : "Excod", value : vExcod}];
				
				var mDataModel = oController.setSpecialCodeData("Schkz", vAddFilter, true);
				
				oSchkz.setModel(mDataModel);
				oSchkz.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
//				oSchkz.setSelectedKey("0000");
				var vDeafultValue = oController.getDefaultValue(oController, "Schkz", oPersg.getSelectedKey(), oControl.getSelectedKey(), oBtrtl.getSelectedKey());
				oController.setDefaultValue(oController, vDeafultValue, oSchkz, "Schkz");
			} else {
				oSchkz.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
			}
		}
		
		var oTrfgr = sap.ui.getCore().byId(oController.PAGEID + "_Trfgr");
		if(oTrfgr) {
			oTrfgr.destroyItems();
			
			if(oControl.getSelectedKey() != "0000") {
				var vExcod = oPersg.getSelectedKey()  + "|" + oControl.getSelectedKey();
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda},
				                  {key : "Pernr", value : oController._vPernr},
				                  {key : "Excod", value : vExcod}];
				
				var mDataModel = oController.setSpecialCodeData("Trfgr", vAddFilter, true);							
				
				oTrfgr.setModel(mDataModel);
				oTrfgr.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				oTrfgr.setSelectedKey("0000");
			} else {				
				oTrfgr.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
			}
		}
		
		var oTrfst = sap.ui.getCore().byId(oController.PAGEID + "_Trfst");			
		if(oTrfst) {				
			oTrfst.destroyItems();
			oTrfst.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
		}
		
		var oAbkrs = sap.ui.getCore().byId(oController.PAGEID + "_Abkrs");
		if(oPersg && oAbkrs && oBtrtl) {
			var vDeafultValue = oController.getDefaultValue(oController, "Abkrs", oPersg.getSelectedKey(), oControl.getSelectedKey(), oBtrtl.getSelectedKey());
			oController.setDefaultValue(oController, vDeafultValue, oAbkrs, "Abkrs")
//			oController.setDefaultValue(oController, vDeafultValue.valueSet[0], oAbkrs, "Abkrs");
//			if(oSchkz && oSchkz != undefined && vDeafultValue.valueSet[1] != undefined && vDeafultValue.valueSet[1] != null)
//				oController.setDefaultValue(oController, vDeafultValue.valueSet[1], oSchkz, "Schkz");
		}
	},
	
	onPressBtrtl : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_Persg");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_Persk");
		var oSchkz = sap.ui.getCore().byId(oController.PAGEID + "_Schkz");
		if(oSchkz && oPersg && oPersk) {
			oSchkz.destroyItems();
			
			if(oControl.getSelectedKey() != "0000") {
				var vExcod = oControl.getSelectedKey() + "|" + oPersg.getSelectedKey() + "|" + oPersk.getSelectedKey();
				var vAddFilter = [{key : "Persa", value : oController._vPersa},
				                  {key : "Actda", value : oController._vActda},
				                  {key : "Excod", value : vExcod}];
				
				var mDataModel = oController.setSpecialCodeData("Schkz", vAddFilter, true);
				
				oSchkz.setModel(mDataModel);
				oSchkz.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
//				oSchkz.setSelectedKey("0000");
				var vDeafultValue = oController.getDefaultValue(oController, "Schkz", oPersg.getSelectedKey(), oPersk.getSelectedKey(), oControl.getSelectedKey());
				oController.setDefaultValue(oController, vDeafultValue, oSchkz, "Schkz");
			} else {
				oSchkz.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
			}
		}
		
		var oAbkrs = sap.ui.getCore().byId(oController.PAGEID + "_Abkrs");
		if(oAbkrs && oPersg && oPersk) {
			var vDeafultValue = oController.getDefaultValue(oController, "Abkrs", oPersg.getSelectedKey(), oPersk.getSelectedKey(), oControl.getSelectedKey());
			oController.setDefaultValue(oController, vDeafultValue, oAbkrs, "Abkrs");
//			oController.setDefaultValue(oController, vDeafultValue.valueSet[0], oAbkrs, "Abkrs");
//			if(oSchkz && oSchkz != undefined && vDeafultValue.valueSet[1] != undefined  && vDeafultValue.valueSet[1] != null)
//				oController.setDefaultValue(oController, vDeafultValue.valueSet[1], oSchkz, "Schkz");
		}
	},
	
	getDefaultValue : function(oController, Field, Persg, Persk, Btrtl) {
//		var vDefaultValue = null;
		var vDefaultValue = { valueSet : [] };
		
		
		if(Persg == "" || Persg == "0000") return null;
		if(Persk == "" || Persk == "0000") return null;
		if(Btrtl == "" || Btrtl == "0000") return null;
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + oController._vActda + "T00%3a00%3a00%27";
		filterString += "%20and%20Field%20eq%20%27" + Field + "%27";
		filterString += "%20and%20Persg%20eq%20%27" + Persg + "%27";
		filterString += "%20and%20Persk%20eq%20%27" + Persk + "%27";
		filterString += "%20and%20Btrtl%20eq%20%27" + Btrtl + "%27";
		
		oModel.read("/ActionDefaultValueSet"  + filterString, 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						vDefaultValue = oData.results[0];
//						for(var i = 0; i<oData.results.length; i++){
//							vDefaultValue.valueSet.push(oData.results[i]);
//						}
					}
					
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		return vDefaultValue;
	},
	
	onLiveChange : function(oEvent) {
		var s = oEvent.getParameter("value");
		if(s == "") {
			oEvent.getSource().removeAllCustomData();
		}
	},
	
	onChangeActda : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert("잘못된 일자형식 입니다.",{
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		if(!oController._ChangeDateDialog) {
			oController._ChangeDateDialog = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ChangeDateDialog", oController);
			oView.addDependent(oController._ChangeDateDialog);
		}
		oController._ChangeDateDialog.open();
	},
	
	onCDClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		if(oController._ChangeDateDialog.isOpen()) {
			oController._ChangeDateDialog.close();
		}
	},
	
	onChangeActionDate : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
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
		
		sap.m.MessageBox.alert("발령일을 변경하였습니다.", {
			title : "안내"
		});
		
		oController.onCDClose();
	},
	
	onBeforeOpenChangeDateDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oCDActda = sap.ui.getCore().byId(oController.PAGEID + "_CD_Actda");
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
		
		oCDActda.setValue(oActda.getValue());
	},
	
	changeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert("잘못된 일자형식 입니다.",{
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
	},
	
	changeAmount : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActAppPersonInfo");
		var oController = oView.getController();
		
		var oAnsal = sap.ui.getCore().byId(oController.PAGEID + "_Ansal");
		
		var oBet01 = sap.ui.getCore().byId(oController.PAGEID + "_Bet01");
		var oBet02 = sap.ui.getCore().byId(oController.PAGEID + "_Bet02");
		var oBet03 = sap.ui.getCore().byId(oController.PAGEID + "_Bet03");
		var oBet01_v2 = sap.ui.getCore().byId(oController.PAGEID + "_Bet01_v2");
		
		var vControls = ["Ansal","Bet01","Bet02","Bet03","Lga01","Lga02","Lga03","Bet01_v2",
		                 "Persg","Persk","Trfar","Trfgb","Waers"];
		
		var vFilterDatas = [];
		
		for(var i=0; i<vControls.length; i++) {
			var oControl = sap.ui.getCore().byId(oController.PAGEID + "_" + vControls[i]);
			var vVal = "";
			if(oControl) {
				for(var c=0; c<oController._vActiveControl.length; c++) {			
					var Fieldname = oController._vActiveControl[c].Fieldname;
					var Fieldtype = oController._vActiveControl[c].Incat;
					Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
					if(vControls[i] == Fieldname) {
						if(Fieldtype == "M0" || Fieldtype == "M1" || Fieldtype == "O1") {
							vVal = oControl.getSelectedKey();
							if(vVal == "0000") vVal = "";
						} else if(Fieldtype == "M3" || Fieldtype == "O3") {
							vVal = oControl.getValue();
						} else if(Fieldtype == "M5" || Fieldtype == "O5") {
							var oCustomData = oControl.getCustomData();
							if(oCustomData && oCustomData.length) {
								vVal = oCustomData[0].getValue();
							}
						}
						break;
					}
				}
			}
			vFilterDatas.push({key : vControls[i], value : vVal});
		}
		
		var vCmode = "";
		var oControlId = oEvent.getSource().getId();
		if(oControlId.indexOf("Ansal") != -1) {
			vCmode = "B";
		} else {
			vCmode = "A";
		}
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var vOneData = {};
		vOneData.Cmode = vCmode;
		vOneData.Persa = oController._vPersa;
		vOneData.Pernr = oController._vPernr;
		vOneData.Actda = "\/Date(" + common.Common.getTime(oController._vActda) + ")\/";
		 
		for(var i=0; i<vFilterDatas.length; i++) {
			if(vFilterDatas[i].value != "") {
				if(vFilterDatas[i].key == "Bet01_v2"){
					vOneData.Bet01 = vFilterDatas[i].value;
				}else{
					eval("vOneData." + vFilterDatas[i].key + " = '" + vFilterDatas[i].value + "';");
				}
			} 
		} 
		
		oModel.create(
				"/CalculateAnsalWagetypeSet", 
				vOneData, 
				null,
			    function (oData, response) {
					if(oData) {
						if(vCmode == "A") {
							if(oAnsal) oAnsal.setValue(oData.Ansal);
						} else {
							if(oBet01) oBet01.setValue(oData.Bet01);
							if(oBet02) oBet02.setValue(oData.Bet02);
							if(oBet03) oBet03.setValue(oData.Bet03);
							if(oBet01_v2) oBet01_v2.setValue(oData.Bet01);
						}
					}
					process_result = true;
					common.Common.log("Sucess CalculateAnsalWagetypeSet Create !!!");
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
	},
	
	onChangeCurrency2 : function(oController){
		var oWaers2 = sap.ui.getCore().byId(oController.PAGEID + "_Waers2");
		if(oWaers2){
			var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
			var oTrfar = sap.ui.getCore().byId(oController.PAGEID + "_Trfar");
			var oTrfgb = sap.ui.getCore().byId(oController.PAGEID + "_Trfgb");
			var oActda = sap.ui.getCore().byId(this.PAGEID + "_Actda");
			var filterString = ""; 
			filterString += "/?$filter=Molga%20eq%20%27" + oController._vMolga + "%27";
			filterString += "%20and%20Actda%20eq%20" + "datetime%27" + oActda.getValue() + "T00%3a00%3a00%27";
			
			if(oTrfar){
				filterString += "%20and%20";
				filterString += "Trfar%20eq%20%27" + oTrfar.getSelectedKey() + "%27";
			}
			if(oTrfgb){
				filterString += "%20and%20";
				filterString += "Trfgb%20eq%20%27" + oTrfgb.getSelectedKey() + "%27";
			}
			oModel.read("/GetPayScaleCurrencySet"  + filterString, 
					null, 
					null, 
					false, 
					function(oData, oResponse) {					
						if(oData.results && oData.results.length) {
							oWaers2.setValue(oData.results[0].Waers);
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
			
			
		}
			
			
		
		
	}

});

function Encode(fVal) {
	var str = encodeURIComponent(fVal);
	str = str.replace(/'/g,"%27");
	str = str.replace(/"/g,"%22");
	
	return str;
}