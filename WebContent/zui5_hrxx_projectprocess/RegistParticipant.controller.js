jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");
jQuery.sap.require("common.SearchUser1");

sap.ui.controller("zui5_hrxx_projectprocess.RegistParticipant", {
	PAGEID : "RegistParticipant",
	_Bizty : "",
	_vPersa : "",
	vContext : null,
	_vActda : "",
	_vUploadFiles : null,
	_vdateFormat : sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}),
	 X : null,
//	//Language 및 Properties를 가져온다.
//	oBundleText : jQuery.sap.resources({
//		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//		locale : sap.ui.getCore().getConfiguration().getLanguage()
//	}),
	
	_RegistDialog : null,
	_vUploadFiles : null,
	_SerachOrgDialog : null,
	_SerachStellDialog : null,

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_projectprocess.RegistParticipant
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
		var oCommonModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
		var filterString = "/?$filter=Persa%20eq%20%27" + this._vPersa + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + this._vActda + "T00%3a00%3a00%27";
		
		var mEmpCodeList = sap.ui.getCore().getModel("EmpSearchCodeList");
		var vEmpCodeList = {EmpCodeListSet : []};
		
		var vControls = ["Persg","Zzjobgr"];
		
		filterString += "%20and%20(";
		for(var i=0; i<vControls.length; i++) {			
			filterString += "Field%20eq%20%27" + vControls[i] + "%27";
			if(i != (vControls.length - 1)) {
				filterString += "%20or%20";
			}
			vEmpCodeList.EmpCodeListSet.push({Field : vControls[i], Ecode : "0000", Etext : oBundleText.getText("SELECTDATA")});
		}
		filterString += ")";
		
		oCommonModel.read("/EmpCodeListSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vEmpCodeList.EmpCodeListSet.push(oData.results[i]);
							}
							mEmpCodeList.setData(vEmpCodeList);	
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
	
		this.onSetTable(this,"N");
		this.onPressSearch();
		
	}, 
	
	onSetTable : function(oController, vType){
		var oExcelTable = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_TABLE");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oCreateBtn = sap.ui.getCore().byId(oController.PAGEID + "_CREATE_BTN");
		var oModfyBtn = sap.ui.getCore().byId(oController.PAGEID + "_MODIFY_BTN");
		var oCopyBtn = sap.ui.getCore().byId(oController.PAGEID + "_COPY_BTN");
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_DELETE_BTN");
		var oExcelSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_SAVE_BTN");
		
		if(vType == "N"){
			oTable.removeStyleClass("L2PDisplayNone");
			oCreateBtn.removeStyleClass("L2PDisplayNone");
			oModfyBtn.removeStyleClass("L2PDisplayNone");
			oCopyBtn.removeStyleClass("L2PDisplayNone");
			oDeleteBtn.removeStyleClass("L2PDisplayNone");
			oExcelSaveBtn.addStyleClass("L2PDisplayNone");
			oExcelTable.addStyleClass("L2PDisplayNone");
		}else if(vType == "E"){
			oTable.addStyleClass("L2PDisplayNone");
			oCreateBtn.addStyleClass("L2PDisplayNone");
			oModfyBtn.addStyleClass("L2PDisplayNone");
			oCopyBtn.addStyleClass("L2PDisplayNone");
			oDeleteBtn.addStyleClass("L2PDisplayNone");
			oExcelSaveBtn.removeStyleClass("L2PDisplayNone");
			oExcelTable.removeStyleClass("L2PDisplayNone");
		}	
	}, 
	
	makeContext : function(fval1 , fval2, fval3){
		var rContext = "" ;
		var fval1Split = fval1.split(",");
		var fval2Split = fval2.split(",");
		var fval3Split = fval3.split(",");
		if(fval2Split.length == 1 && fval2Split[0] == "")	return rContext;
		
		for (var j=0; j< fval2Split.length ; j++){
			if(j==0) rContext = fval2Split[j];
			else{
				rContext +=", " + fval2Split[j];
			}
			rContext += "(" ;
			if(fval1Split[j] && fval1Split[j] != "" ){
				rContext +=  fval1Split[j]  + "/" ;
			}
			if(fval3Split[j] && fval3Split[j] != "" ){
				rContext +=   fval3Split[j] ; 
			}
			
			rContext += ")";
		}
		return rContext;
	},
	
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.RegistParticipant");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		
		var filterString = "";
		    
	    filterString += "/?$filter=Werks%20eq%20%27" + oPersa.getSelectedKey() + "%27";  
	    
	    
	    var searchProcess = function() {
	    	var mExpCareerRegist = sap.ui.getCore().getModel("ExpCareerRegist");
			var vExpCareerRegist = {ExpCareerRegistSet : []};
			var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_MANAGEMENT_SRV");
			oModel.read("/ExpCareerRegistSet" + filterString, 
						null, 
						null, 
						false,
						function(oData, oResponse) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									vExpCareerRegist.ExpCareerRegistSet.push(oData.results[i]);
								}
							}
							mExpCareerRegist.setData(vExpCareerRegist);
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
			oTable.setModel(mExpCareerRegist);
			oTable.bindItems("/ExpCareerRegistSet", oColumnList);
			oController.onSetTable(oController,"N");
	    };		
		
		
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
		
		setTimeout(searchProcess, 300);
		
	},
	

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_projectprocess.RegistParticipant
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_projectprocess.RegistParticipant
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_projectprocess.RegistParticipant
*/
//	onExit: function() {
//
//	}
	
	onPressCreate : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.RegistParticipant");
		var oController = oView.getController();
		
		if(!oController._RegistDialog) {
			oController._RegistDialog = sap.ui.jsfragment("zui5_hrxx_projectprocess.fragment.Regist40Dialog", oController);
			oView.addDependent(oController._RegistDialog);
			
			var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_40_Field02"); 
			oPersg.removeAllItems();
			var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_40_Field03"); 
			oZzjobgr.removeAllItems();
			var mEmpCodeList = sap.ui.getCore().getModel("EmpSearchCodeList");
			var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
			for(var i = 0; i< vEmpCodeList.length ; i++){
				if(vEmpCodeList[i].Field == "Persg"){
					oPersg.addItem(
							new sap.ui.core.Item({
								key : vEmpCodeList[i].Ecode, 
								text : vEmpCodeList[i].Etext
							})
						);
				}else if(vEmpCodeList[i].Field == "Zzjobgr"){
					oZzjobgr.addItem(
							new sap.ui.core.Item({
								key : vEmpCodeList[i].Ecode, 
								text : vEmpCodeList[i].Etext
							})
						);
				}
			}
		}
		
		
//		var v11 = sap.ui.getCore().byId(oController.PAGEID + "_LeftScrollContainer"); 
//		oFilter = new sap.ui.layout.VerticalLayout({width : "100%"}); //270px
//		
//		oFilter.addContent(new sap.m.Select({
//			width: "300px"
//		}).addStyleClass("L2P13Font"));
//		
//		v11.addContent(oFilter);
//		oFilter = new sap.ui.layout.VerticalLayout({width : "100%"}); //270px
//		oFilter.addContent(new sap.m.Input({
//			width: "300px"
//		}).addStyleClass("L2P13Font"));
//		v11.addContent(oFilter);
		
		oController.vContext = {};	
		oController.vContext.Seqnr = "" ;
		oController._RegistDialog.open();
		oController.onSet40Dialog(null, "NEW");
	},
	
	onPressModify : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.RegistParticipant");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		var mExpCareerRegist = sap.ui.getCore().getModel("ExpCareerRegist");
		if(vContexts.length < 1){
			common.Common.showErrorMessage(oBundleText.getText( "MSG_UPDATE_TARGET"));
			return ;
		}
		if(vContexts.length > 1){
			common.Common.showErrorMessage(oBundleText.getText( "MSG_MODIFY_LIMIT"));
			return ;	
		}
		
		if(!oController._RegistDialog) {
			oController._RegistDialog = sap.ui.jsfragment("zui5_hrxx_projectprocess.fragment.Regist40Dialog", oController);
			oView.addDependent(oController._RegistDialog);
			
			var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_40_Field02"); 
			oPersg.removeAllItems();
			var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_40_Field03"); 
			oZzjobgr.removeAllItems();
			var mEmpCodeList = sap.ui.getCore().getModel("EmpSearchCodeList");
			var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
			for(var i = 0; i< vEmpCodeList.length ; i++){
				if(vEmpCodeList[i].Field == "Persg"){
					oPersg.addItem(
							new sap.ui.core.Item({
								key : vEmpCodeList[i].Ecode, 
								text : vEmpCodeList[i].Etext
							})
						);
				}else if(vEmpCodeList[i].Field == "Zzjobgr"){
					oZzjobgr.addItem(
							new sap.ui.core.Item({
								key : vEmpCodeList[i].Ecode, 
								text : vEmpCodeList[i].Etext
							})
						);
				}
			}
		}
		var vType = "MODIFY";
		oController.vContext = mExpCareerRegist.getProperty(vContexts[0].sPath) ;
		oController._RegistDialog.open();
		oController.onSet40Dialog(mExpCareerRegist.getProperty(vContexts[0].sPath), vType);
	},
	
	onPressCopy : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.RegistParticipant");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		var mExpCareerRegist = sap.ui.getCore().getModel("ExpCareerRegist");
		if(vContexts.length < 1){
			common.Common.showErrorMessage(oBundleText.getText( "MSG_COPY_TARGET"));
			return ;
		}
		if(vContexts.length > 1){
			common.Common.showErrorMessage(oBundleText.getText( "MSG_COPY_LIMIT"));
			return ;	
		}
		
		if(!oController._RegistDialog) {
			oController._RegistDialog = sap.ui.jsfragment("zui5_hrxx_projectprocess.fragment.Regist40Dialog", oController);
			oView.addDependent(oController._RegistDialog);
			
			var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_40_Field02"); 
			oPersg.removeAllItems();
			var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_40_Field03"); 
			oZzjobgr.removeAllItems();
			var mEmpCodeList = sap.ui.getCore().getModel("EmpSearchCodeList");
			var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
			for(var i = 0; i< vEmpCodeList.length ; i++){
				if(vEmpCodeList[i].Field == "Persg"){
					oPersg.addItem(
							new sap.ui.core.Item({
								key : vEmpCodeList[i].Ecode, 
								text : vEmpCodeList[i].Etext
							})
						);
				}else if(vEmpCodeList[i].Field == "Zzjobgr"){
					oZzjobgr.addItem(
							new sap.ui.core.Item({
								key : vEmpCodeList[i].Ecode, 
								text : vEmpCodeList[i].Etext
							})
						);
				}
			}
		}
		var vType = "MODIFY";
		oController.vContext = mExpCareerRegist.getProperty(vContexts[0].sPath) ;
		// 순번은 초기화 시킴. 
		oController.vContext.Seqnr = "";
		oController._RegistDialog.open();
		oController.onSet40Dialog(mExpCareerRegist.getProperty(vContexts[0].sPath), vType);
	},
	
	onPressDelete : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.RegistParticipant");
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
					var oPath = "/ExpCareerRegistSet(Werks='" + vContexts[i].getProperty("Werks") + "',"
					          + "Seqnr='" + vContexts[i].getProperty("Seqnr") + "')";
					
					oModel.remove(
							oPath, 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess ExpCareerRegist Remove !!!");
						    },
						    function (oError) {
						    	var Err = {};
								if (oError.response) {
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
			title: oBundleText.getText("PROJECT_STATUS_D"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: onProcessing
		});
		
	},
	
	onPressClose : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.RegistParticipant");
		var oController = oView.getController();
		
		if(oController._RegistDialog.open()){
			oController._RegistDialog.close();
		}
	},
	
	onPressSave : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.RegistParticipant");
		var oController = oView.getController();
		var vBegda = sap.ui.getCore().byId(oController.PAGEID + "_40_Begda").getValue();
		var vEndda = sap.ui.getCore().byId(oController.PAGEID + "_40_Endda").getValue();
		if(vBegda == ""){
			common.Common.showErrorMessage(oBundleText.getText("MSG_BEGDA_INPUT"));
			return ; 
		}
		if(vEndda == ""){
			common.Common.showErrorMessage(oBundleText.getText("MSG_ENDDA_INPUT"));
			return ; 
		}
		var updateData = {};
		if( oController.vContext != {}){
			updateData.Seqnr = oController.vContext.Seqnr; 
		}
		
			
		// 시작일 종료일
		updateData.Pjtbd = "\/Date(" + common.Common.getTime(vBegda) + ")\/";  
		updateData.Pjted = "\/Date(" + common.Common.getTime(vEndda) + ")\/";  
		
		// 제외
		var oSign = sap.ui.getCore().byId(oController.PAGEID + "_40_Sign");
		if(oSign.getSelected()) updateData.Sign = "E" ;
		else updateData.Sign = "I" ;
		// 조직단위
		var oOrgUnit = sap.ui.getCore().byId(oController.PAGEID + "_40_Field01");
		var oTokens = oOrgUnit.getTokens();
		var vToeknText = "";
		if( oTokens.length > 0 ){
			for(var i = 0; i < oTokens.length ; i++){
				if(i==0) vToeknText = oTokens[i].getKey() ;
				else vToeknText += "," +  oTokens[i].getKey() ;
			}
			updateData.Field01 = vToeknText;
		}
		// 사원그룹
		var oEmpGuop = sap.ui.getCore().byId(oController.PAGEID + "_40_Field02");
		var vEmpGuopData = oEmpGuop.getSelectedKeys();
		    vToeknText = "";
		if(vEmpGuopData && vEmpGuopData.length) {
			for(var i=0; i<vEmpGuopData.length; i++) {
				if(i == 0) vToeknText = vEmpGuopData[i];
				else vToeknText += "," +  vEmpGuopData[i];
			}
			updateData.Field02 = vToeknText;
		}
		// 직군 
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_40_Field03");
		var vZzjobgrData = oZzjobgr.getSelectedKeys();
		    vToeknText = "";
		if(vZzjobgrData && vZzjobgrData.length) {
			for(var i=0; i<vZzjobgrData.length; i++) {
				if(i == 0) vToeknText = vZzjobgrData[i];
				else vToeknText += "," + vZzjobgrData[i];
			}
			updateData.Field03 = vToeknText;
		}
		// Job
		var oStell = sap.ui.getCore().byId(oController.PAGEID + "_40_Field04");
		    oTokens = oStell.getTokens();
		var vToeknText01 = ""; // MJ
		var vToeknText02 = ""; // SJ
		var vToeknText03 = ""; // Job
		var vOtype = "";
		if( oTokens.length > 0 ){
			for(var i = 0; i < oTokens.length ; i++){
				console.log(oTokens[i].getKey());
				vOtype = oTokens[i].getCustomData()[0].getValue("Otype");
				if(vOtype == "FN") {
					if(vToeknText01 == "") vToeknText01 = oTokens[i].getKey() ;
					else vToeknText01 += ","+oTokens[i].getKey() ;
				}else if(vOtype == "JF"){
					if(vToeknText02 == "") vToeknText02 = oTokens[i].getKey() ;
					else vToeknText02 += ","+oTokens[i].getKey() ;
				}else if(vOtype == "C"){
					if(vToeknText03 == "") vToeknText03 = oTokens[i].getKey() ;
					else vToeknText03 += ","+oTokens[i].getKey() ;
				}
			}
			if(vToeknText01 != "") updateData.Field04 = vToeknText01;
			if(vToeknText02 != "") updateData.Field05 = vToeknText02;
			if(vToeknText03 != "") updateData.Field06 = vToeknText03;
		}
		
		// 사원번호
		var oPernr = sap.ui.getCore().byId(oController.PAGEID + "_40_Field07");
		    oTokens = oPernr.getTokens();
		    vToeknText = "";
		if( oTokens.length > 0 ){
			for(var i = 0; i < oTokens.length ; i++){
				if(i==0) vToeknText = oTokens[i].getKey() ;
				else vToeknText += "," +  oTokens[i].getKey() ;
			}
			updateData.Field07 = vToeknText;
		}
		
		updateData.Werks = oController._vPersa;
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_MANAGEMENT_SRV");
		
		var saveProcess = function() {
			var process_result = false;
			
			var oPath = "/ExpCareerRegistSet";
			oPath += "(Werks='" + oController._vPersa + "',Seqnr='" + updateData.Seqnr +"')";
			oModel.update(
					oPath, 
					updateData, 
					null,
				    function (oData, response) {
						process_result = true;
						common.Common.log("Sucess ExpCareerRegistSet update !!!");
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
	
	onPressExcelSave : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.RegistParticipant");
		var oController = oView.getController();
		
		var mExpCareerRegist = sap.ui.getCore().getModel("ExpCareerRegist");
		var vExpCareerRegist = mExpCareerRegist.getProperty("/ExpCareerRegistSet");
		if (vExpCareerRegist.length < 1 ){
			return ;
		}
		
		for(var i = 0 ; i < vExpCareerRegist.length ; i++){
			if(vExpCareerRegist[i].Type == "E"){
				common.Common.showErrorMessage(oBundleText.getText("MSG_INCLUDE_ERROR"));
				return ;
			}
		}
		
		var saveData = { saveDataSet : []};
		var vExist = true ; 
		for(var i = 0 ; i < vExpCareerRegist.length ; i++){
			if(i == 0){
				saveData.saveDataSet.push(vExpCareerRegist[i]);
				continue ;
			}else{
				vExist = false ; 
				for(var j = 0; j < saveData.saveDataSet.length ; j ++ ){
					if( saveData.saveDataSet[j].PjtbdTx ==  vExpCareerRegist[i].PjtbdTx && 
						saveData.saveDataSet[j].PjtedTx ==  vExpCareerRegist[i].PjtedTx &&
						saveData.saveDataSet[j].Sign ==  vExpCareerRegist[i].Sign ){
						saveData.saveDataSet[j].Field07 += "," + vExpCareerRegist[i].Field07;
						vExist = true ;
						break;
					}	
				}
				if(vExist == false){
					saveData.saveDataSet.push(vExpCareerRegist[i]);
				}
					
			}
		}

		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_MANAGEMENT_SRV");
		var oWerks = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var vWerks  = oWerks.getSelectedKey();
		var saveProcess = function() {
			var process_result = true;
			var controlData = {} ;
			for(var i = 0 ; i < saveData.saveDataSet.length ; i++){
				controlData = saveData.saveDataSet[i];	
				controlData.Pjtbd = "\/Date(" + common.Common.getTime(saveData.saveDataSet[i].Pjtbd) + ")\/"; 
				controlData.Pjted = "\/Date(" + common.Common.getTime(saveData.saveDataSet[i].Pjted) + ")\/"; 
				controlData.Werks = vWerks;
				controlData.Actty = "";
				try {
					oModel.create(
							"/ExpCareerRegistSet", 
							controlData ,
							null,
							function(oData, oResponse) {
							},
						    function (oError) {
								process_result = false;
							}
					);	
				}catch (Ex) {
					common.Common.log(Ex);
				}
			}
			
			
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
	
	fixdata : function(data) {
		var o = "", l = 0, w = 10240;
		for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
		o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
		return o;
	},
	
	uploadFile : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.RegistParticipant");
		var oController = oView.getController();
		
		var reader = new FileReader();
		var f = jQuery.sap.domById(oController.PAGEID + "_ATTACHFILE_BTN" + "-fu").files[0];
		reader.onload = function(e) {
			//if(typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
				oController.X = XLSX;
			var data = e.target.result;
			var arr = oController.fixdata(data);
				wb = oController.X.read(btoa(arr), {type: 'base64'});
				oController.to_json(wb);
			
		};
		reader.readAsArrayBuffer(f);
		oController.onSetTable(oController,"E");
		
	},
	
	to_json : function(workbook) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.RegistParticipant");
		var oController = oView.getController();
		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN") ; 
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = oController.X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
			if(roa.length > 0){
				if(!oController.BusyDialog) {
					oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
					oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PERNR_SELECT_WAIT")}));
					oController.getView().addDependent(oController.BusyDialog);
				} else {
					oController.BusyDialog.removeAllContent();
					oController.BusyDialog.destroyContent();
					oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PERNR_SELECT_WAIT")}));
				}
				if(!oController.BusyDialog.isOpen()) {
					oController.BusyDialog.open();
				}
				var oWerks = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
				var vWerks  = oWerks.getSelectedKey();
				var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_MANAGEMENT_SRV");
				
				var UploadProcess = function() {
					var success_cnt = 0;
					var fail_cnt = 0;
			    	var mExpCareerRegist = sap.ui.getCore().getModel("ExpCareerRegist");
					var vExpCareerRegist = {ExpCareerRegistSet : []};
					for(var i=0; i<roa.length ; i++){
						controlData = {};
						controlData.PjtbdTx = roa[i].Coulmn_0;
						controlData.PjtedTx = roa[i].Coulmn_1;
						if(roa[i].Coulmn_2 == "E") controlData.Sign = "E";
						else controlData.Sign = "I";
						controlData.Field07 = roa[i].Coulmn_3;
						controlData.Werks = vWerks ; 
						controlData.Actty = "V"; // Check 용
						try {
							oModel.create(
									"/ExpCareerRegistSet", 
									controlData ,
									null,
									function(oData, oResponse) {
										if(oData.Type == "E") fail_cnt ++;
										else success_cnt ++;
										vExpCareerRegist.ExpCareerRegistSet.push(oData);
										
									},
								    function (oError) {
										fail_cnt ++;
										vExpCareerRegist.ExpCareerRegistSet.push(oData);
									}
							);	
						}catch (Ex) {
							common.Common.log(Ex);
						}
					}
					mExpCareerRegist.setData(vExpCareerRegist);
					
					if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
						oController.BusyDialog.close();
					}
					
					// 파일 업로드 초기화
					oFileUploader.setValue("");
					oController._vUploadFiles = [];
					
					if(roa.length > 0){
						var vBundleText = oBundleText.getText("EMP_EXCEL_UPLOAD_COMPLETE") ;
						vBundleText = vBundleText.replace("%Cnt", roa.length );
						vBundleText = vBundleText.replace("%Success", success_cnt );
						vBundleText = vBundleText.replace("%fail", fail_cnt );
						sap.m.MessageBox.alert(vBundleText, {
						 	icon: sap.m.MessageBox.Icon.INFORMATION,
							title: oBundleText.getText("INFORMATION"),
							onClose : function() {
								oController.onSetTable(oController,"E");
								var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_TABLE");
								var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_EXCEL_COLUMNLIST");
								oTable.setModel(mExpCareerRegist);
								oTable.bindItems("/ExpCareerRegistSet", oColumnList);
							}
						});
	
					}
				};
				
				setTimeout(UploadProcess, 300);
			}
		});
	},
	
	onPressDownload : function(oEvent){
		document.IFRAMEDOWNLOAD.location.href = "/sap/bc/ui5_ui5/sap/zhrxx_hassapp/zui5_hrxx_projectprocess/excelfile/Excel_Style.xls";
	},
	
	onFileChange : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.RegistParticipant");
		var oController = oView.getController();
		oController._vUploadFiles = [];
		var files = jQuery.sap.domById(oController.PAGEID + "_ATTACHFILE_BTN" + "-fu").files;
		if(files) {
			for(var i=0; i<files.length; i++) {
				oController._vUploadFiles.push(files[i]);
			}
			oController.uploadFile();
		}
		
	},
	
	onSet40Dialog: function(vContext, vType) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.RegistParticipant");
		var oController = oView.getController();
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_40_Begda");
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_40_Endda");
		var oSign = sap.ui.getCore().byId(oController.PAGEID + "_40_Sign");
		var oOrgGrop = sap.ui.getCore().byId(oController.PAGEID + "_40_Field01");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_40_Field02");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_40_Field03");
		var oStell = sap.ui.getCore().byId(oController.PAGEID + "_40_Field04");
		var oPernr = sap.ui.getCore().byId(oController.PAGEID + "_40_Field07");
		
		oBegda.setValue("");
		oEndda.setValue("");
		oSign.setSelected(false);
		oOrgGrop.removeAllTokens();
		oOrgGrop.destroyTokens();
		oOrgGrop.setValue("");
		oStell.removeAllTokens();
		oStell.destroyTokens();
		oStell.setValue("");
		oPernr.removeAllTokens();
		oPernr.destroyTokens();
		oPernr.setValue("");
		oPersg.clearSelection() ;
		oZzjobgr.clearSelection();
		
		if(vType == "MODIFY" ){
			if(vContext.Pjtbd != ""){
				oBegda.setValue(oController._vdateFormat.format(new Date(vContext.Pjtbd)));
			}
			if(vContext.Pjted != ""){
				oEndda.setValue(oController._vdateFormat.format(new Date(vContext.Pjted)));
			}
			if(vContext.Sign == "E"){
				oSign.setSelected(true);
			}
			// 수정
			var vSplitC ;
			var vSplitT ;
			// 조직단위
			if(vContext.Field01 != ""){
				vSplitC = vContext.Field01.split(",");
				vSplitT = vContext.Fielt01.split(",");
				for(var i = 0; i < vSplitC.length ; i++){
					oOrgGrop.addToken(new sap.m.Token({
						key : vSplitC[i],
						text : vSplitT[i]}));
				}
			}
			// 사원그룹
			if(vContext.Field02 != ""){
				vSplitC = vContext.Field02.split(",");
				vSplitT = vContext.Fielt02.split(",");
				oPersg.setSelectedKeys(vSplitC);
			}
			
			// 직군
			if(vContext.Field03 != ""){
				vSplitC = vContext.Field03.split(",");
				vSplitT = vContext.Fielt03.split(",");
				oZzjobgr.setSelectedKeys(vSplitC);
			}
			
			// MainJob
			console.log(vContext.Field04);
			if(vContext.Field04 != ""){
				vSplitC = vContext.Field04.split(",");
				vSplitT = vContext.Fielt04.split(",");
				for(var i = 0; i < vSplitC.length ; i++){
					oStell.addToken(new sap.m.Token({
						key : vSplitC[i],
						text : vSplitT[i],
						customData :  new sap.ui.core.CustomData({
				        	key : "Otype",
				        	value : "FN"
				        }) }));
				}
			}
			console.log(vContext.Field05);
			// Subjob
			if(vContext.Field05 != ""){
				vSplitC = vContext.Field05.split(",");
				vSplitT = vContext.Fielt05.split(",");
				for(var i = 0; i < vSplitC.length ; i++){
					oStell.addToken(new sap.m.Token({
						key : vSplitC[i],
						text : vSplitT[i],
						customData :  new sap.ui.core.CustomData({
				        	key : "Otype",
				        	value : "SJ"
				        }) }));
				}
			}
			console.log(vContext.Field06);
			// Job
			if(vContext.Field06 != ""){
				vSplitC = vContext.Field06.split(",");
				vSplitT = vContext.Fielt06.split(",");
				for(var i = 0; i < vSplitC.length ; i++){
					oStell.addToken(new sap.m.Token({
						key : vSplitC[i],
						text : vSplitT[i],
						customData :  new sap.ui.core.CustomData({
				        	key : "Otype",
				        	value : "C"
				        }) }));
				}
			}
			
			// 사원번호
			if(vContext.Field07 != ""){
				vSplitC = vContext.Field07.split(",");
				vSplitT = vContext.Fielt08.split(",");
				for(var i = 0; i < vSplitC.length ; i++){
					oPernr.addToken(new sap.m.Token({
						key : vSplitC[i],
						text : vSplitT[i]}));
				}
			}
		}
	},
	
	displayMultiEmpSearchDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.RegistParticipant");
		var oController = oView.getController();
		
		jQuery.sap.require("zui5_hrxx_projectprocess.javascript.SearchUser");
		
		common.SearchUser1.oController = oController;
		
		if(!oController._EmpSearchDialog) {
			oController._EmpSearchDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
			oView.addDependent(oController._EmpSearchDialog);
		}
		
		oController._EmpSearchDialog.open();
		
		
	},
	
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.RegistParticipant");
		var oController = oView.getController();
		
		jQuery.sap.require("common.SearchOrg");
		common.SearchOrg.oController = oController;
		common.vActionType = "Multi";
		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
		common.SearchOrg.vCallControlType = "MultiInput";
		
		if(!oController._SerachOrgDialog) {
			oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
			oView.addDependent(oController._SerachOrgDialog);
		}
		oController._SerachOrgDialog.open();
	},
	
	displayStellSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.RegistParticipant");
		var oController = oView.getController();
	
		jQuery.sap.require("zui5_hrxx_projectprocess.javascript.SearchStell");

		zui5_hrxx_projectprocess.javascript.SearchStell.oController = oController;
		zui5_hrxx_projectprocess.javascript.SearchStell.vActionType = "Multi";
		zui5_hrxx_projectprocess.javascript.SearchStell.vCallControlId = oEvent.getSource().getId();
		zui5_hrxx_projectprocess.javascript.SearchStell.vCallControlType = "MultiInput";
		if(!oController._SerachStellDialog) {
			oController._SerachStellDialog = sap.ui.jsfragment("zui5_hrxx_projectprocess.fragment.SEARCH_STELL", oController);
			oView.addDependent(oController._SerachStellDialog);
		}
		oController._SerachStellDialog.open();		
	},
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_projectprocess.RegistParticipant");
		var oController = oView.getController();
		var vEmpSearchCnt = 0;
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		
		var oPernr = sap.ui.getCore().byId(oController.PAGEID + "_40_Field07");
		
		for(var i=0; i<vEmpSearchResult.length; i++) {
			if(vEmpSearchResult[i].Chck == true) {
				vEmpSearchCnt++;
				oPernr.addToken(new sap.m.Token({
					key : vEmpSearchResult[i].Pernr,
					text : vEmpSearchResult[i].Ename
				}));
			}	
		}
		
		if(vEmpSearchCnt < 1){
			return ;
		}


		common.SearchUser1.onClose();
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