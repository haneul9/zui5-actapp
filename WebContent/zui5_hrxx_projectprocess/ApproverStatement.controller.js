jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");
jQuery.sap.require("common.SearchUser2");

sap.ui.controller("zui5_hrxx_projectprocess.ApproverStatement", {
	PAGEID : "ApproverStatement",
	_Bizty : "",
	_vPersa : "",
	vContext : null,
	_vActda : "",
	_vdateFormat : sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
//	//Language 및 Properties를 가져온다.
//	oBundleText : jQuery.sap.resources({
//		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//		locale : sap.ui.getCore().getConfiguration().getLanguage()
//	}),
	
	_RegistDialog : null,
	_vUploadFiles : null,
	_SerachOrgDialog : null,

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_projectprocess.ApproverStatement
*/
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		};
		
		var oPersaModel = sap.ui.getCore().getModel("PersaModel");
		var vPersaData = oPersaModel.getProperty("/PersAreaListSet");

		var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
		
		try {
			for(var i=0; i<vPersaData.length; i++) {
				oPersa.addItem(
					new sap.ui.core.Item({
						key : vPersaData[i].Persa, 
						text : vPersaData[i].Pbtxt
					})
				);
			};
			oPersa.setSelectedKey(vPersaData[0].Persa);
			this._vPersa = vPersaData[0].Persa;
		} catch(ex) {
			common.Common.log(ex);
		}
		
	    this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),

		});  
	},
	
	onBeforeShow : function(oEvent) {
		this._vActda = this._vdateFormat.format(new Date());
		
		var vFields = [{Fieldname : "Pjtty"},
		               {Fieldname : "Pjgbn"}];
		common.Common.loadCodeData(this._vPersa, this._vActda , vFields);
		
		
		var oPjtty = sap.ui.getCore().byId(this.PAGEID + "_Pjtty"); 
		oPjtty.removeAllItems();
		var mEmpCodeList = sap.ui.getCore().getModel("EmpCodeList");
		var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
		for(var i = 0; i< vEmpCodeList.length ; i++){
			if(vEmpCodeList[i].Field == "Pjtty"){
				oPjtty.addItem(
						new sap.ui.core.Item({
							key : vEmpCodeList[i].Ecode, 
							text : vEmpCodeList[i].Etext
						})
					);
			}
		}
		
		this.onPressSearch();
		
	}, 
	
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStatement");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oPjtbd = sap.ui.getCore().byId(oController.PAGEID + "_Pjtbd"); 
		var oPjted = sap.ui.getCore().byId(oController.PAGEID + "_Pjted"); 
		var oPjtnm = sap.ui.getCore().byId(oController.PAGEID + "_Pjtnm"); 
		var oPjtid = sap.ui.getCore().byId(oController.PAGEID + "_Pjtid"); 
		var oPjtty = sap.ui.getCore().byId(oController.PAGEID + "_Pjtty"); 
		var oCpers = sap.ui.getCore().byId(oController.PAGEID + "_Cpers"); 
		
		var filterString = "";
		    
	    filterString += "/?$filter=Werks%20eq%20%27" + oPersa.getSelectedKey() + "%27";  
	    if( oPjtbd.getValue() != null && oPjtbd.getValue() != ""){
		    filterString += "%20and%20";
		    filterString += "Pjtbd%20eq%20datetime%27" + oPjtbd.getValue() + "T00%3a00%3a00%27"; 
	    }
	    if( oPjted.getValue() != null && oPjted.getValue() != ""){
	    	filterString += "%20and%20";
		    filterString += "Pjted%20eq%20datetime%27" + oPjted.getValue() + "T00%3a00%3a00%27";
	    }
	    if( oPjtnm.getValue() != null && oPjtnm.getValue() != ""){
		    filterString += "%20and%20";
		    filterString += "Pjtnm%20eq%20%27" + oPjtnm.getValue() + "%27";
	    }
	    if( oPjtid.getValue() != null && oPjtid.getValue() != ""){
		    filterString += "%20and%20";
		    filterString += "Pjtid%20eq%20%27" + oPjtid.getValue() + "%27";
	    }
	    if( oPjtty.getSelectedKey() != null && oPjtty.getSelectedKey() != "0000" && oPjtty.getSelectedKey() != ""){
		    filterString += "%20and%20";
		    filterString += "Pjtty%20eq%20%27" + oPjtty.getSelectedKey() + "%27";
	    }
	    if( oCpers.getValue() != null && oCpers.getValue() != ""){
		    filterString += "%20and%20";
		    filterString += "Cpers%20eq%20%27" + oCpers.getCustomerData()[0].getValue("Cpers") + "%27";
	    }
	    
	    if(!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}


		var mAppCriteriaList = sap.ui.getCore().getModel("AppCriteriaList");
		var vAppCriteriaList = {AppCriteriaListSet : []};
		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_MANAGEMENT_SRV");
		oModel.read("/AppCriteriaListSet" + filterString, 
					null, 
					null, 
					true,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vAppCriteriaList.AppCriteriaListSet.push(oData.results[i]);
							}
						}
						mAppCriteriaList.setData(vAppCriteriaList);
					},
					function(oError) {
						if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
							oController.BusyDialog.close();
						};
						
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

					}
		);
		if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
			oController.BusyDialog.close();
		};
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
		oTable.setModel(mAppCriteriaList);
		oTable.bindItems("/AppCriteriaListSet", oColumnList);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_projectprocess.ApproverStatement
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_projectprocess.ApproverStatement
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_projectprocess.ApproverStatement
*/
//	onExit: function() {
//
//	}
	
	onPressCreate : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStatement");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		var mAppCriteriaList = sap.ui.getCore().getModel("AppCriteriaList");
		
		if(vContexts.length < 1){
			common.Common.showErrorMessage(oBundleText.getText( "MSG_CREATE_TARGET"));
			return ;
		}
		if(vContexts.length > 1){
			common.Common.showErrorMessage(oBundleText.getText( "MSG_CREATE_LIMIT"));
			return ;	
		}
		if(mAppCriteriaList.getProperty(vContexts + "/Pjgbn") != "2" && (
				mAppCriteriaList.getProperty(vContexts + "/Pjgbntx") != "" || 
				mAppCriteriaList.getProperty(vContexts + "/Cpern") != "" )){
			common.Common.showErrorMessage(oBundleText.getText( "MSG_ALREADY_SAVE"));
			return ;	
		}
		
		if(!oController._RegistDialog) {
			oController._RegistDialog = sap.ui.jsfragment("zui5_hrxx_projectprocess.fragment.Regist20Dialog", oController);
			oView.addDependent(oController._RegistDialog);
			
			var oPjgbn = sap.ui.getCore().byId(oController.PAGEID + "_20_Pjgbn"); 
			oPjgbn.removeAllItems();
			var mEmpCodeList = sap.ui.getCore().getModel("EmpCodeList");
			var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
			for(var i = 0; i< vEmpCodeList.length ; i++){
				if(vEmpCodeList[i].Field == "Pjgbn"){
					oPjgbn.addItem(
							new sap.ui.core.Item({
								key : vEmpCodeList[i].Ecode, 
								text : vEmpCodeList[i].Etext
							})
						);
				}
			}
		}
		var vType = "NEW";
		oController.vContext = mAppCriteriaList.getProperty(vContexts[0].sPath) ;
		oController.vContext.Seqnr = "";
		oController._RegistDialog.open();
		oController.onSet20Dialog(mAppCriteriaList.getProperty(vContexts[0].sPath), vType);
	},
	
	onPressModify : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStatement");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		var mAppCriteriaList = sap.ui.getCore().getModel("AppCriteriaList");
		if(vContexts.length < 1){
			common.Common.showErrorMessage(oBundleText.getText( "MSG_UPDATE_TARGET"));
			return ;
		}
		if(vContexts.length > 1){
			common.Common.showErrorMessage(oBundleText.getText( "MSG_MODIFY_LIMIT"));
			return ;
		}
		if(mAppCriteriaList.getProperty(vContexts + "/Pjgbntx") == "" ){
			if(mAppCriteriaList.getProperty(vContexts + "/Cpern") == "" ){
				common.Common.showErrorMessage(oBundleText.getText( "MSG_BEFORE_SAVE"));
				return ;	
			}
		}
		
		if(!oController._RegistDialog) {
			oController._RegistDialog = sap.ui.jsfragment("zui5_hrxx_projectprocess.fragment.Regist20Dialog", oController);
			oView.addDependent(oController._RegistDialog);
			
			var oPjgbn = sap.ui.getCore().byId(oController.PAGEID + "_20_Pjgbn"); 
			oPjgbn.removeAllCustomData();
			var mEmpCodeList = sap.ui.getCore().getModel("EmpCodeList");
			var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
			for(var i = 0; i< vEmpCodeList.length ; i++){
				if(vEmpCodeList[i].Field == "Pjgbn"){
					oPjgbn.addItem(
							new sap.ui.core.Item({
								key : vEmpCodeList[i].Ecode, 
								text : vEmpCodeList[i].Etext
							})
						);
				}
			}
		}
		
		var vType = "MODIFY";
		oController.vContext = mAppCriteriaList.getProperty(vContexts[0].sPath) ;
		oController._RegistDialog.open();
		oController.onSet20Dialog(mAppCriteriaList.getProperty(vContexts[0].sPath), vType);
	},
	
	onPressDelete : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStatement");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		
		if(!vContexts || vContexts.length < 1) {
			common.Common.showErrorMessage(oBundleText.getText("MSG_DELETE_TARGET"));
			return;
		}
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_MANAGEMENT_SRV");
		
		var DeleteProcess = function() {
			var process_result = false;
			for(var i=0; i<vContexts.length; i++) {
				try {
					var oPath = "/AppCriteriaListSet(Werks='" + vContexts[i].getProperty("Werks") + "',"
					          + "Pjtid='" + vContexts[i].getProperty("Pjtid") + "',"
					          + "Pjgbn='" + vContexts[i].getProperty("Pjgbn") + "',"
					          + "Seqnr='" + vContexts[i].getProperty("Seqnr") + "')";
					
					oModel.remove(
							oPath, 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess AppCriteriaListSet Remove !!!");
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
					
					if(!process_result) break;
				} catch(ex) {
					process_result = false;
					common.Common.log(ex);
				}
			}
				
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			if(!process_result) return;
			
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
				title: oBundleText.getText("INFORMATION"),
				onClose : function() {
					oController.onPressSearch();
				}
			});
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
				
				setTimeout(DeleteProcess, 300);
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("MSG_DELETE_CONFIRM"), {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("DEL_BTN"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: onProcessing
		});
		
	},
	
	onPressClose : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStatement");
		var oController = oView.getController();
		
		if(oController._RegistDialog.open()){
			oController._RegistDialog.close();
		}
	},
	
	onPressSave : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStatement");
		var oController = oView.getController();
		var vPjgbn = sap.ui.getCore().byId(oController.PAGEID + "_20_Pjgbn").getSelectedKey();
		var oCpers = sap.ui.getCore().byId(oController.PAGEID + "_20_Cpers");
		if(vPjgbn == "" || vPjgbn == "0000" || vPjgbn == "2"){
			if(oCpers.getValue() == ""){
				common.Common.showErrorMessage(oBundleText.getText("MSG_CPERS_LIMIT"));
				return ; 
			}
		}
		
		var updateData = oController.vContext ;
		if(vPjgbn == "" || vPjgbn == "0000"){
			updateData.Pjgbn = "";
		}else{
			updateData.Pjgbn = vPjgbn ;
		}
		if(oCpers.getValue() != ""){
			updateData.Cpers = oCpers.getCustomData()[0].getValue("Cpers");
		}
		
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_MANAGEMENT_SRV");
		
		var saveProcess = function() {
			var process_result = false;
			
			var oPath = "/AppCriteriaListSet";
			oPath += "(Werks='" + updateData.Werks + "'," +
			         "Pjgbn='" + updateData.Pjgbn + "'," + 
			         "Pjtid='" + updateData.Pjtid + "'," +
		             "Seqnr='" + updateData.Seqnr +	"')";
			oModel.update(
					oPath, 
					updateData, 
					null,
				    function (oData, response) {
						process_result = true;
						common.Common.log("Sucess AppCriteriaListSet update !!!");
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
			
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
				title: oBundleText.getText("INFORMATION"),
				onClose : function() {
					oController.onPressClose();
					oController.onPressSearch();
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
	
	// 구분 변경
	onChangePjgbn : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStatement");
		var oController = oView.getController();
		var sKey = sap.ui.getCore().byId(oController.PAGEID + "_20_Pjgbn").getSelectedKey();
		var oCpers = sap.ui.getCore().byId(oController.PAGEID + "_20_Cpers");

		console.log(sKey);
		if(sKey == "1"){
			oCpers.removeAllCustomData();
			oCpers.setValue("");
			oCpers.setEnabled(false);
		}else{
			oCpers.setEnabled(true);
		}
	},
	
	onSet20Dialog: function(vContext, vType) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStatement");
		var oController = oView.getController();
		
		var oPjtid = sap.ui.getCore().byId(oController.PAGEID + "_20_Pjtid");
		var oPjtnm = sap.ui.getCore().byId(oController.PAGEID + "_20_Pjtnm");
		var oPjgbn = sap.ui.getCore().byId(oController.PAGEID + "_20_Pjgbn");
		var oCpers = sap.ui.getCore().byId(oController.PAGEID + "_20_Cpers");
		oCpers.removeAllCustomData();
		
		console.log(vContext);
		if(vType == "NEW" ){
			// 신규등록
			oPjtid.setText(vContext.Pjtid);
			oPjtnm.setText(vContext.Pjtnm);
			oPjgbn.setSelectedItem(oPjgbn.getFirstItem());
			oCpers.setValue("");
			oCpers.setEnabled(true);
			oPjgbn.setEnabled(true);
		}else if(vType == "MODIFY" ){
			// 수정
			oPjtid.setText(vContext.Pjtid);
			oPjtnm.setText(vContext.Pjtnm);
			oPjgbn.setSelectedKey(vContext.Pjgbn);
			oPjgbn.setEnabled(false);
			if(vContext.Pjgbn == "1"){
				// 구분이 팀장일 경우
				oCpers.setEnabled(false);
			}else oCpers.setEnabled(true);
			if(vContext.Cpers == "00000000") oCpers.setValue("");
			else {
				oCpers.setValue(vContext.Cpern);
				oCpers.addCustomData(new sap.ui.core.CustomData({key : "Cpers", value : vContext.Cpers}));
			}
			
			
			
			
		}
		
		
	},
	
	onEmployeeSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStatement");
		var oController = oView.getController();
		common.SearchUser2.oController = oController;
		
		if(!oController._EmpSearchDialog) {
			oController._EmpSearchDialog = sap.ui.jsfragment("fragment.EmployeeSearch2", oController);
			oView.addDependent(oController._EmpSearchDialog);
		}
		
		oController._EmpSearchDialog.open();
		
		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStatement");
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
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.ApproverStatement");
		var oController = oView.getController();
		var vEmpSearchCnt = 0;
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		var vTempPernr = null , vTempPersa = null  , vTempeEname = null , vTempeFulln = null; 
		
		for(var i=0; i<vEmpSearchResult.length; i++) {
			if(vEmpSearchResult[i].Chck == true) {
				vEmpSearchCnt++;
				vTempPernr =  vEmpSearchResult[i].Pernr;
				vTempPersa =  vEmpSearchResult[i].Persa;
				vTempeEname = vEmpSearchResult[i].Ename;
				vTempeFulln = vEmpSearchResult[i].Fulln;
			}				
		}
		
		if(vEmpSearchCnt > 1){
			common.Common.showErrorMessage(oBundleText.getText("MSG_UPDATE_LIMIT"));
			return ;
		}else if(vEmpSearchCnt < 1){
			return ;
		}

		oController._vPernr = vTempPernr ;
		oController._vPersa = vTempPersa ;
		
		if(!oController._RegistDialog || oController._RegistDialog.isOpen() == false){
			// 검색 화면에서 사원 검색 할 경우
			var oCpers = sap.ui.getCore().byId(oController.PAGEID + "_Cpers");
			oCpers.removeAllCustomData();
			oCpers.setValue(vTempeEname);
			oCpers.addCustomData(new sap.ui.core.CustomData({key : "Cpers", value : vTempPernr}));
		}else{
			// 등록 or 수정화면에서 사원 검색 한 경우 
			var oCpers = sap.ui.getCore().byId(oController.PAGEID + "_20_Cpers");
			oCpers.removeAllCustomData();
			oCpers.setValue(vTempeEname);
			oCpers.addCustomData(new sap.ui.core.CustomData({key : "Cpers", value : vTempPernr}));
			
		}
		
	    common.SearchUser2.onClose();
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