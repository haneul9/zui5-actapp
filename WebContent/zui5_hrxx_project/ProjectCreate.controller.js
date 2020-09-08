jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.Common");

sap.ui.controller("zui5_hrxx_project.ProjectCreate", {

	PAGEID : "ProjectCreate",
	ListSelectionType : "None",
	
	_vWerks : "",
	_vPersa : "",
	_vPjtbd : "",
	_vPjtty : "",
	_vMode : "",
	
	_vThousandSeparator : ",",
	_vDecimalSeparator : ".",
	
	_oContext : null,
	BusyDialog : null,
	
//	oBundleText : jQuery.sap.resources({
//		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//		locale : sap.ui.getCore().getConfiguration().getLanguage()
//	}),
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf epmproductapp.CreateView
*/
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			this.getView().addStyleClass("sapUiSizeCompact");
	    };
	    
	    var oPersaModel = sap.ui.getCore().getModel("PersaModel");
		var vPersaData = oPersaModel.getProperty("/PersAreaListSet");

		var oWerks = sap.ui.getCore().byId(this.PAGEID + "_Werks");
		
		try {
			oWerks.addItem(
				new sap.ui.core.Item({
					key : "", 
					text : oBundleText.getText("SELECTDATA")
				})
			);
			for(var i=0; i<vPersaData.length; i++) {
				oWerks.addItem(
					new sap.ui.core.Item({
						key : vPersaData[i].Persa, 
						text : vPersaData[i].Pbtxt
					})
				);
			};
			oWerks.setSelectedKey(vPersaData[0].Persa);
			this._vWerks = vPersaData[0].Persa;
		} catch(ex) {
			common.Common.log(ex);
		}
	    
	    this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this)
		});  
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf epmproductapp.CreateView
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf epmproductapp.CreateView
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf epmproductapp.CreateView
*/
//	onExit: function() {
//
//	}
	onBeforeShow: function(oEvent) {	
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		if(oEvent) {
			this._vMode = oEvent.data.mode;
			this._oContext = oEvent.data.context;
			if(this._oContext == null) {
				this._vPjtty = "";
			} else {
				this._vWerks = this._oContext.getProperty("Werks");
				this._vPjtbd = dateFormat.format(new Date(this._oContext.getProperty("Pjtbd")));
				this._vPjtty = this._oContext.getProperty("Pjtty");
			}
		}

		this.setEmpCodeField(this);
		this.setData(this);
	},
	
	onAfterShow: function(oEvent) {	
		this.setInputField(this);
	},
	
	setInputField : function(oController) {
		var oRow4 = sap.ui.getCore().byId(oController.PAGEID + "_ROW_4");
		var oRow5 = sap.ui.getCore().byId(oController.PAGEID + "_ROW_5");
		var oRow6 = sap.ui.getCore().byId(oController.PAGEID + "_ROW_6");
		var oRow7 = sap.ui.getCore().byId(oController.PAGEID + "_ROW_7");
		
		oRow4.addStyleClass("L2PDisplayNone");
		oRow5.addStyleClass("L2PDisplayNone");
		oRow6.addStyleClass("L2PDisplayNone");
		oRow7.addStyleClass("L2PDisplayNone");
		
		switch(oController._vPjtty) {
			case "0001" :   // 수주
				oRow4.removeStyleClass("L2PDisplayNone");
				oRow5.removeStyleClass("L2PDisplayNone");
				oRow6.removeStyleClass("L2PDisplayNone");
				break;
			case "0002" :   // R&D
				oRow5.removeStyleClass("L2PDisplayNone");
				break;
			case "0003" :   // M&A
				oRow7.removeStyleClass("L2PDisplayNone");
		}
	},
	
	onChangePjtty : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();
		
		var oPjtct = sap.ui.getCore().byId(oController.PAGEID + "_Pjtct");  //사업유형
		var oPjtcy = sap.ui.getCore().byId(oController.PAGEID + "_Pjtcy");  //프로젝트국가
		var oPjtam = sap.ui.getCore().byId(oController.PAGEID + "_Pjtam");  //규모(금액)
		var oPjtck = sap.ui.getCore().byId(oController.PAGEID + "_Pjtck");  //통화
		var oPjtcu = sap.ui.getCore().byId(oController.PAGEID + "_Pjtcu");  //고객
		var oPjtsz = sap.ui.getCore().byId(oController.PAGEID + "_Pjtsz");  //규모(Size)
		var oPjtun = sap.ui.getCore().byId(oController.PAGEID + "_Pjtun");  //단위
		var oPjtma = sap.ui.getCore().byId(oController.PAGEID + "_Pjtma");  //M&A 유형
		var oPjtmc = sap.ui.getCore().byId(oController.PAGEID + "_Pjtmc");  //M&A 대상
		
		oPjtct.setSelectedKey("");
		oPjtcy.setValue("");
		oPjtcy.removeAllCustomData();
		oPjtcy.addCustomData(new sap.ui.core.CustomData({key : "Pjtcy", value : ""}));
		oPjtam.setValue("");
		oPjtck.setValue("");
		oPjtcu.setValue("");
		oPjtcu.removeAllCustomData();
		oPjtcu.addCustomData(new sap.ui.core.CustomData({key : "Pjtcu", value : ""}));
		oPjtsz.setValue("");
		oPjtun.setValue("");
		oPjtma.setSelectedKey("");
		oPjtmc.setValue("");
		
		oController._vPjtty = oEvent.getSource().getSelectedKey();
		oController.setInputField(oController);
	},
	
	setEmpCodeField : function(oController) {
		
		var oControlls = [{"Fieldname" : "Pjtty"},  //유형
	                      {"Fieldname" : "Pjtct"},  //계약유형
	                      //{"Fieldname" : "Pjtun"},  //단위
	                      //{"Fieldname" : "Pjtck"},  //통화
	                      {"Fieldname" : "Pjtpd"},  //제품
	                      {"Fieldname" : "Pjtma"}]; //M&A
		
		var mEmpCodeList = sap.ui.getCore().getModel("EmpCodeList");
		var vEmpCodeList = {EmpCodeListSet : []};
		mEmpCodeList.setData(vEmpCodeList);
		
		var oPjtty = sap.ui.getCore().byId(oController.PAGEID + "_Pjtty");    //유형
		var oPjtct = sap.ui.getCore().byId(oController.PAGEID + "_Pjtct");    //계약유형
		//var oPjtun = sap.ui.getCore().byId(oController.PAGEID + "_Pjtun");    //단위
		//var oPjtck = sap.ui.getCore().byId(oController.PAGEID + "_Pjtck");    //통화
		var oPjtpd = sap.ui.getCore().byId(oController.PAGEID + "_Pjtpd");    //제품
		var oPjtma = sap.ui.getCore().byId(oController.PAGEID + "_Pjtma");    //M&A
		
		
		if(oController._vWerks == "" || oController._vPjtbd == "") {
		} else {
			common.Common.loadCodeData(oController._vWerks, oController._vPjtbd, oControlls);
		}
		
		oPjtty.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Pjtty")]);
		oPjtct.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Pjtct")]);
		//oPjtun.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Pjtun")]);
		//oPjtck.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Pjtck")]);
		oPjtpd.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Pjtpd")]);
		oPjtma.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", "Pjtma")]);
		
		// 인사영역 변경 시 고객필드값 초기화
		var oPjtcu = sap.ui.getCore().byId(oController.PAGEID + "_Pjtcu");    //고객
		if(oPjtcu){
			oPjtcu.setValue("");
			oPjtcu.removeAllCustomData();
		}
	},
	
	onChangeWerks : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();
		
		oController._vWerks = oEvent.getSource().getSelectedKey();
		oController.setEmpCodeField(oController);
	},
	
	onChangePjtbd : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();
		
		if(typeof oEvent == "object") {
			if(!oController.onChangeDate(oEvent)) return;
		}
		
		oController._vPjtbd = oEvent.getSource().getValue();
		oController.setEmpCodeField(oController);
	},
	
	navToBack : function(oEvent){
//		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
//		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "back", {});
	},
	
	setData : function(oController) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var dateFormatList = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		var oWerks = sap.ui.getCore().byId(oController.PAGEID + "_Werks");
		var oPjtnm = sap.ui.getCore().byId(oController.PAGEID + "_Pjtnm");
		var oPjtid = sap.ui.getCore().byId(oController.PAGEID + "_Pjtid");
		var oPjtbd = sap.ui.getCore().byId(oController.PAGEID + "_Pjtbd");
		var oPjted = sap.ui.getCore().byId(oController.PAGEID + "_Pjted");
		var oPjtcy = sap.ui.getCore().byId(oController.PAGEID + "_Pjtcy");
		var oPjtty = sap.ui.getCore().byId(oController.PAGEID + "_Pjtty");
		var oPjtcu = sap.ui.getCore().byId(oController.PAGEID + "_Pjtcu");
		var oPjtds = sap.ui.getCore().byId(oController.PAGEID + "_Pjtds");
		var oPjtsz = sap.ui.getCore().byId(oController.PAGEID + "_Pjtsz");
		var oPjtun = sap.ui.getCore().byId(oController.PAGEID + "_Pjtun");
		var oPjtam = sap.ui.getCore().byId(oController.PAGEID + "_Pjtam");
		var oPjtck = sap.ui.getCore().byId(oController.PAGEID + "_Pjtck");
		var oPjtct = sap.ui.getCore().byId(oController.PAGEID + "_Pjtct");
		var oPjtpd = sap.ui.getCore().byId(oController.PAGEID + "_Pjtpd"); 
		var oPjtma = sap.ui.getCore().byId(oController.PAGEID + "_Pjtma");  //M&A 유형
		var oPjtmc = sap.ui.getCore().byId(oController.PAGEID + "_Pjtmc");  //M&A 대상
		var oUnametx = sap.ui.getCore().byId(oController.PAGEID + "_Unametx");
		var oConBtn = sap.ui.getCore().byId(oController.PAGEID + "_CONFIRM_BTN");
		var oReqBtn = sap.ui.getCore().byId(oController.PAGEID + "_REQUEST_BTN");
		
		var oPjtcyx = sap.ui.getCore().byId(oController.PAGEID + "_Pjtcyx");
		var oPjttyx = sap.ui.getCore().byId(oController.PAGEID + "_Pjttyx");
		var oPjtcux = sap.ui.getCore().byId(oController.PAGEID + "_Pjtcux");
		var oPjtunx = sap.ui.getCore().byId(oController.PAGEID + "_Pjtunx");
		var oPjtpdx = sap.ui.getCore().byId(oController.PAGEID + "_Pjtpdx");
		var oPjtctx = sap.ui.getCore().byId(oController.PAGEID + "_Pjtctx");
		
		oPjtcyx.setText("");
		oPjttyx.setText("");
		oPjtcux.setText("");
		oPjtunx.setText("");
		oPjtpdx.setText("");
		oPjtctx.setText("");
		oPjtcyx.setVisible(false);
		oPjttyx.setVisible(false);
		oPjtcux.setVisible(false);
		oPjtunx.setVisible(false);
		oPjtpdx.setVisible(false);
		oPjtctx.setVisible(false);
		
		for(var i=0; i<8; i++) {
			var oRow = sap.ui.getCore().byId(oController.PAGEID + "_ROW_" + i);
			oRow.setHeight("42px");
		}
		
//		oWerks.setSelectedKey("");
		oPjtnm.setValue("");
		oPjtid.setText("");
		oPjtbd.setValue(null);
		oPjted.setValue(null);
//		oPjtcy.setSelectedKey("");
		oPjtcy.setValue("");
		oPjtcy.removeAllCustomData();
		oPjtcy.addCustomData(new sap.ui.core.CustomData({key : "Pjtcy", value : ""}));
		oPjtty.setSelectedKey("");
		oPjtcu.setValue("");
		oPjtcu.removeAllCustomData();
		oPjtcu.addCustomData(new sap.ui.core.CustomData({key : "Pjtcu", value : ""}));
		oPjtds.setValue("");
		oPjtsz.setValue("");  //Pjtszu
		oPjtun.setValue("");
		oPjtam.setValue("");   //Pjtamc
		oPjtck.setValue("");
		oPjtct.setSelectedKey("");
		oPjtpd.setSelectedKey("");
		oPjtma.setSelectedKey("");
		oPjtmc.setValue("");
		oUnametx.setText("");
		
		oWerks.setEnabled(true);
		oPjtnm.setEnabled(true);
		oPjtbd.setEnabled(true);
		oPjted.setEnabled(true);
		oPjtcy.setEnabled(true);
		oPjtty.setEnabled(true);
		oPjtcu.setEnabled(true);
		oPjtds.setEnabled(true);
		oPjtsz.setEnabled(true);
		oPjtun.setEnabled(true);
		oPjtam.setEnabled(true);
		oPjtck.setEnabled(true);
		oPjtct.setEnabled(true);
		oPjtpd.setEnabled(true);
		oPjtma.setEnabled(true);
		oPjtmc.setEnabled(true);
		oConBtn.setVisible(true);
		oReqBtn.setVisible(true);
		
		if(oController._oContext == null) return;
		
		var twoLine = false;
		if(oController._oContext.getProperty("Pjtst") == "N") {
			if(oController._oContext.getProperty("Pjtcyx") != "") {
				oPjtcyx.setText("(I/F : " + oController._oContext.getProperty("Pjtcyx") + ")");
				oPjtcyx.setVisible(true);
				twoLine = true;
			}
			
			if(oController._oContext.getProperty("Pjttyx") != "") {
				oPjttyx.setText("(I/F : " + oController._oContext.getProperty("Pjttyx") + ")");
				oPjttyx.setVisible(true);
				twoLine = true;
			}
			
			if(oController._oContext.getProperty("Pjtcux") != "") {
				oPjtcux.setText("(I/F : " + oController._oContext.getProperty("Pjtcux") + ")");
				oPjtcux.setVisible(true);
				twoLine = true;
			}
			
			if(oController._oContext.getProperty("Pjtunx") != "") {
				oPjtunx.setText("(I/F : " + oController._oContext.getProperty("Pjtunx") + ")");
				oPjtunx.setVisible(true);
				twoLine = true;
			}
			
			if(oController._oContext.getProperty("Pjtpdx") != "") {
				oPjtpdx.setText("(I/F : " + oController._oContext.getProperty("Pjtpdx") + ")");
				oPjtpdx.setVisible(true);
				twoLine = true;
			}
			
			if(oController._oContext.getProperty("Pjtctx") != "") {
				oPjtctx.setText("(I/F : " + oController._oContext.getProperty("Pjtctx") + ")");
				oPjtctx.setVisible(true);
				twoLine = true;
			}
		}
		
		if(twoLine) {
			for(var i=0; i<8; i++) {
				var oRow = sap.ui.getCore().byId(oController.PAGEID + "_ROW_" + i);
				oRow.setHeight("55px");
			}
		}
		
		oWerks.setSelectedKey(oController._oContext.getProperty("Werks"));
		oPjtnm.setValue(oController._oContext.getProperty("Pjtnm"));
		oPjtid.setText(oController._oContext.getProperty("Pjtid"));
		oPjtbd.setValue(oController._oContext.getProperty("Pjtbd") == null ? null : dateFormat.format(new Date(oController._oContext.getProperty("Pjtbd"))));
		oPjted.setValue(oController._oContext.getProperty("Pjted") == null ? null : dateFormat.format(new Date(oController._oContext.getProperty("Pjted"))));
//		oPjtcy.setSelectedKey(oController._oContext.getProperty("Pjtcy"));
		oPjtcy.setValue(oController._oContext.getProperty("Landx"));
		oPjtcy.removeAllCustomData();
		oPjtcy.addCustomData(new sap.ui.core.CustomData({key : "Pjtcy", value : oController._oContext.getProperty("Pjtcy")}));
		oPjtty.setSelectedKey(oController._oContext.getProperty("Pjtty"));
		oPjtcu.setValue(oController._oContext.getProperty("Pjtcutx"));
		oPjtcu.removeAllCustomData();
		oPjtcu.addCustomData(new sap.ui.core.CustomData({key : "Pjtcu", value : oController._oContext.getProperty("Pjtcu")}));
		oPjtds.setValue(oController._oContext.getProperty("Pjtds"));
		oPjtsz.setValue(oController._oContext.getProperty("Pjtszu"));  //Pjtszu
		oPjtun.setValue(oController._oContext.getProperty("Pjtun"));
		oPjtam.setValue(oController._oContext.getProperty("Pjtamc"));   //Pjtamc
		oPjtck.setValue(oController._oContext.getProperty("Pjtck"));
		oPjtpd.setSelectedKey(oController._oContext.getProperty("Pjtpd"));
		oPjtct.setSelectedKey(oController._oContext.getProperty("Pjtct"));
		oPjtma.setSelectedKey(oController._oContext.getProperty("Pjtma"));
		oPjtmc.setValue(oController._oContext.getProperty("Pjtmc"));
		
		var tmpText = "";
		if(oController._oContext.getProperty("Pjtrgtx") != "") {
			tmpText = oController._oContext.getProperty("Pjtrgtx");
			if(oController._oContext.getProperty("Pjtrd") != null) {
				tmpText += " / " + dateFormatList.format(new Date(oController._oContext.getProperty("Pjtrd")));
			}
		}
		oUnametx.setText(tmpText);
		
		if(oController._vMode == "M")
			oReqBtn.setVisible(false);
		else
			oReqBtn.setVisible(true);
	},
	
	onConfirm : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();
		
		var onProcess = function(fVal) {
			if(fVal && fVal == "OK") {
				oController.saveData(oController, "onConfirm");
			}
		};
		
		sap.m.MessageBox.confirm(oBundleText.getText( "MSG_PROJECT_COMPLETE_CONFIRM"), {
			title : oBundleText.getText( "CONFIRM_BTN"),
			onClose : onProcess
		});
	},
	
	_ODialogSearchPernrEvent : null,
	onRequest : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();
		
		var oWerks = sap.ui.getCore().byId(oController.PAGEID + "_Werks");
		var oPjtnm = sap.ui.getCore().byId(oController.PAGEID + "_Pjtnm");
		oWerks.removeStyleClass("L2PSelectInvalidBorder");
		oPjtnm.setValueState(sap.ui.core.ValueState.None);
//		if(oWerks.getSelectedKey() == "") {
//			sap.m.MessageBox.alert("인사영역을 먼저 선택하세요");
//			return;
//		}
		if(oController.onCheckValidation(oController, oWerks, oWerks.getSelectedKey(), "L", "MSG_INPUT_WERKS")) return; //인사영역
		if(oController.onCheckValidation(oController, oPjtnm, oPjtnm.getValue(), "I", "MSG_INPUT_PJTNM")) return; //프로젝트명

		oController._vPersa = oWerks.getSelectedKey();
		
		if(!oController._ODialogSearchPernrEvent) {
			oController._ODialogSearchPernrEvent = sap.ui.jsfragment("zui5_hrxx_project.fragment.SelectPernr", oController);
			oView.addDependent(oController._ODialogSearchPernrEvent);
		}
		oController._ODialogSearchPernrEvent.open();	
		
		
		var oPjtrg = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtrg");
		oPjtrg.setValue("");
		oPjtrg.removeAllCustomData();
		oPjtrg.addCustomData(new sap.ui.core.CustomData({key : "Pjtrg", value : ""}));
	},
	
	onClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();
		
		var oDialog = sap.ui.getCore().byId(oController.PAGEID + "_POP_Dialog");
		if(oDialog) oDialog.close();
	},
	
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();
		
		//var oTable = sap.ui.getCore().byId(oController.PAGEID + "_ES_Table");
		//var mEmpSearchResult = oTable.getModel();
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		
		var vEmpSearchCnt = 0;
		var vPernr = "";
		var vEname = "";
		for(var i=0; i<vEmpSearchResult.length; i++) {
			if(vEmpSearchResult[i].Chck == true) {
				vEmpSearchCnt++;
				vPernr =  vEmpSearchResult[i].Pernr;
				vEname =  vEmpSearchResult[i].Ename;
			}				
		}

		if(vEmpSearchCnt > 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON_ONLYONE"));
			return;
		} else if(vEmpSearchCnt < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
			return;
		}
		
		var oPjtrg = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtrg");
		oPjtrg.setValue(vEname);
		oPjtrg.removeAllCustomData();
		oPjtrg.addCustomData(new sap.ui.core.CustomData({key : "Pjtrg", value : vPernr}));
		
		common.SearchUser1.onClose();
	},
	
	onSelectPernr : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();
		
		var oPjtrg = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtrg");
		var vPernr = oPjtrg.getCustomData()[0].getValue("Pjtrg");
		if(vPernr == "") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_PROJECT_PERNR"));
			return;
		}
		var oWerks = sap.ui.getCore().byId(oController.PAGEID + "_Werks");
		oWerks.removeAllCustomData();
		oWerks.addCustomData(new sap.ui.core.CustomData({key : "Pjtrg", value : vPernr}));
		oController.onClose();
		oController.saveData(oController, "onSelectPernr");
	},
	
	saveData : function(oController, fromFunction) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();
		var vMSG_SAVE = "";
		
		var oWerks = sap.ui.getCore().byId(oController.PAGEID + "_Werks");  //인사영역
		var oPjtnm = sap.ui.getCore().byId(oController.PAGEID + "_Pjtnm");  //프로젝트명
		var oPjtid = sap.ui.getCore().byId(oController.PAGEID + "_Pjtid");  //프로젝트ID
		var oPjtbd = sap.ui.getCore().byId(oController.PAGEID + "_Pjtbd");  //시작일
		var oPjted = sap.ui.getCore().byId(oController.PAGEID + "_Pjted");  //종료일
		var oPjtpd = sap.ui.getCore().byId(oController.PAGEID + "_Pjtpd");  //상세제품
		var oPjtty = sap.ui.getCore().byId(oController.PAGEID + "_Pjtty");  //유형
		var oPjtds = sap.ui.getCore().byId(oController.PAGEID + "_Pjtds");  //개요
		
		var oPjtct = sap.ui.getCore().byId(oController.PAGEID + "_Pjtct");  //사업유형
		var oPjtcy = sap.ui.getCore().byId(oController.PAGEID + "_Pjtcy");  //프로젝트국가
		
		var oPjtam = sap.ui.getCore().byId(oController.PAGEID + "_Pjtam");  //규모(금액)
		var oPjtck = sap.ui.getCore().byId(oController.PAGEID + "_Pjtck");  //통화
		var oPjtcu = sap.ui.getCore().byId(oController.PAGEID + "_Pjtcu");  //고객

		var oPjtsz = sap.ui.getCore().byId(oController.PAGEID + "_Pjtsz");  //규모(Size)
		var oPjtun = sap.ui.getCore().byId(oController.PAGEID + "_Pjtun");  //단위

		var oPjtma = sap.ui.getCore().byId(oController.PAGEID + "_Pjtma");  //M&A 유형
		var oPjtmc = sap.ui.getCore().byId(oController.PAGEID + "_Pjtmc");  //M&A 대상

		oWerks.removeStyleClass("L2PSelectInvalidBorder");
		oPjtnm.setValueState(sap.ui.core.ValueState.None);
		oPjtty.removeStyleClass("L2PSelectInvalidBorder");
		oPjtcu.setValueState(sap.ui.core.ValueState.None);
		oPjtbd.setValueState(sap.ui.core.ValueState.None);
		oPjted.setValueState(sap.ui.core.ValueState.None);
		oPjtcy.setValueState(sap.ui.core.ValueState.None);
		oPjtds.setValueState(sap.ui.core.ValueState.None);
		oPjtsz.setValueState(sap.ui.core.ValueState.None);
		oPjtun.setValueState(sap.ui.core.ValueState.None);
		oPjtam.setValueState(sap.ui.core.ValueState.None);
		oPjtck.setValueState(sap.ui.core.ValueState.None);
		oPjtct.removeStyleClass("L2PSelectInvalidBorder");
		oPjtpd.removeStyleClass("L2PSelectInvalidBorder");
		oPjtma.removeStyleClass("L2PSelectInvalidBorder");
		oPjtmc.setValueState(sap.ui.core.ValueState.None);
		
		var oneData = {
			Werks : oWerks.getSelectedKey(),
			Pjtid : oPjtid.getText(),
			Pjtnm : oPjtnm.getValue(),
			Actty : "H",
			Pjtty : oPjtty.getSelectedKey() == "0000" ? "" : oPjtty.getSelectedKey(),
			Pjtcu : oPjtcu.getCustomData()[0].getValue("Pjtcu"),
			Pjtbd : oPjtbd.getValue() == "" || oPjtbd.getValue() == "0NaN-NaN-NaN" ? null : "\/Date(" + new Date(oPjtbd.getValue()).getTime() + ")\/",
			Pjted : oPjted.getValue() == "" || oPjted.getValue() == "0NaN-NaN-NaN" ? null : "\/Date(" + new Date(oPjted.getValue()).getTime() + ")\/",
			Pjtcy : oPjtcy.getCustomData()[0].getValue("Pjtcy"),
			Pjtds : oPjtds.getValue(),
			Pjtsz : oPjtsz.getValue() == "" ? null : oController.onDeleteSeper(oPjtsz.getValue()),
			Pjtun : oPjtun.getValue(),
			Pjtam : oPjtam.getValue() == "" ? null : oController.onDeleteSeper(oPjtam.getValue()),
			Pjtck : oPjtck.getValue(),
			Pjtct : oPjtct.getSelectedKey() == "0000" ? "" : oPjtct.getSelectedKey(),
			Pjtrg : oWerks.getCustomData()[0].getValue("Pjtrg"),
			Pjtpd : oPjtpd.getSelectedKey() == "0000" ? "" : oPjtpd.getSelectedKey(),
			Pjtma : oPjtma.getSelectedKey() == "0000" ? "" : oPjtma.getSelectedKey(),
			Pjtmc : oPjtmc.getValue(),
		};
		
		if(oController.onCheckValidation(oController, oWerks, oneData.Werks, "L", "MSG_INPUT_WERKS")) return; //인사영역
		if(oController.onCheckValidation(oController, oPjtnm, oneData.Pjtnm, "I", "MSG_INPUT_PJTNM")) return; //프로젝트명
		
		if(fromFunction == "onSelectPernr") {
			vMSG_SAVE = "MSG_SAVE_PER";
			oneData.Pjtst = "R"; 
		} else {
			vMSG_SAVE = "MSG_SAVE_REQ";
			oneData.Pjtst = "C";
			if(oController.onCheckValidation(oController, oPjtbd, oneData.Pjtbd, "D", "MSG_INPUT_PJTBD")) return; //기간(시작일)
			if(oController.onCheckValidation(oController, oPjted, oneData.Pjted, "D", "MSG_INPUT_PJTED")) return; //기간(종료일)
			if(new Date(oPjtbd.getValue()) > new Date(oPjted.getValue())) {
				oPjtbd.setValueState(sap.ui.core.ValueState.Error);
				oPjted.setValueState(sap.ui.core.ValueState.Error);
				sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_PJTDATE"));
				return;
			}
			if(oController.onCheckValidation(oController, oPjtpd, oneData.Pjtpd, "L", "MSG_INPUT_PJTPD")) return; //제품
			if(oController.onCheckValidation(oController, oPjtty, oneData.Pjtty, "L", "MSG_INPUT_PJTTY")) return; //유형
			
			switch(oController._vPjtty) {
				case "0001" :   // 수주
					//if(oController.onCheckValidation(oController, oPjtct, oneData.Pjtct, "L", "MSG_INPUT_PJTCT")) return; //사업유형
					if(oController.onCheckValidation(oController, oPjtcy, oneData.Pjtcy, "I", "MSG_INPUT_SLAND")) return; //국가
					
					//if(oController.onCheckValidation(oController, oPjtam, oneData.Pjtam, "I", "MSG_INPUT_PJTAM")) return; //규모(금액)
					//if(oController.onCheckValidation(oController, oPjtck, oneData.Pjtck, "L", "MSG_INPUT_PJTCK")) return; //통화
					if(oneData.Pjtam != "" && oneData.Pjtam != null) if(oController.onCheckValidation(oController, oPjtck, oneData.Pjtck, "I", "MSG_INPUT_PJTCK")) return;
					if(oController.onCheckValidation(oController, oPjtcu, oneData.Pjtcu, "I", "MSG_INPUT_PJTCU")) return; //고객

					//if(oController.onCheckValidation(oController, oPjtsz, oneData.Pjtsz, "I", "MSG_INPUT_PJTSZ")) return; //규모(Size)
					//if(oController.onCheckValidation(oController, oPjtun, oneData.Pjtun, "L", "MSG_INPUT_PJTUN")) return; //단위
					if(oneData.Pjtsz != "" && oneData.Pjtsz != null) if(oController.onCheckValidation(oController, oPjtun, oneData.Pjtun, "I", "MSG_INPUT_PJTUN")) return;
					break;
				case "0002" :   // R&D
					//if(oController.onCheckValidation(oController, oPjtam, oneData.Pjtam, "I", "MSG_INPUT_PJTAM")) return; //규모(금액)
					//if(oController.onCheckValidation(oController, oPjtck, oneData.Pjtck, "L", "MSG_INPUT_PJTCK")) return; //통화
					if(oneData.Pjtam != "" && oneData.Pjtam != null) if(oController.onCheckValidation(oController, oPjtck, oneData.Pjtck, "I", "MSG_INPUT_PJTCK")) return;
					if(oController.onCheckValidation(oController, oPjtcu, oneData.Pjtcu, "I", "MSG_INPUT_PJTCU")) return; //고객
					break;
				case "0003" :   // M&A
					if(oController.onCheckValidation(oController, oPjtma, oneData.Pjtma, "L", "MSG_INPUT_PJTMA")) return; //M&A 유형
					if(oController.onCheckValidation(oController, oPjtmc, oneData.Pjtmc, "I", "MSG_INPUT_PJTMC")) return; //M&A 대상
			}
		}
		
		var process_result = false;
		var oPath = "/ProjectRegisterSet";
		var oModel = sap.ui.getCore().getModel("ZHRXX_PROJECT_SRV");
		
		if(oneData.Pjtid == "") {    // 신규
			oModel.create(
					oPath, 
					oneData, 
					null,
				    function (oData, response) {
						if(oData) {
							
						}
						process_result = true;
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
		} else {              // 수정
			oPath += "(Werks='" + oneData.Werks + "',"
            		+ "Pjtid='" +  oneData.Pjtid + "')";
			
            oModel.update(
				oPath, 
				oneData, 
				null,
			    function (oData, response) {
					process_result = true;
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
			sap.m.MessageBox.alert(oBundleText.getText(vMSG_SAVE), {
				title: oBundleText.getText("MSG_TITLE_GUIDE"),
				onClose : function() {
					oWerks.removeAllCustomData();
					oWerks.addCustomData(new sap.ui.core.CustomData({key : "Pjtrg", value : ""}));

					oController.navToBack();
				}
			});
		}
	},

/////////////////////////////////////////////////////////////////////////////////////////////
// 고객 검색을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////	
	_ODialogSearchPjtcuEvent : null,
	_SelectedContext : null,
	
	onDisplaySearchPjtcuDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();	
		
		oController._SelectedContext = null;
		
		if(!oController._ODialogSearchPjtcuEvent) {
			oController._ODialogSearchPjtcuEvent = sap.ui.jsfragment("zui5_hrxx_project.fragment.SearchPjtcu", oController);
			oView.addDependent(oController._ODialogSearchPjtcuEvent);
		}
		
//		var oPjtcuDialog = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtcu_Dialog"); 
//		var oStandardList = sap.ui.getCore().byId(oController.PAGEID + "_POP_Pjtcu_StandardList");  
//		oPjtcuDialog.items({
//			path : "/CustomerSearchResultSet/?$filter=Persa%20eq%20%27" + oController._vWerks + "%27",
//			template : oStandardList
//		});
		
		oController._ODialogSearchPjtcuEvent.open();
	},
	
	onSearchPjtcu : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();
		
		var oFilters = [];
	    oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vWerks));
	    oFilters.push(new sap.ui.model.Filter("Pjtcutx", sap.ui.model.FilterOperator.EQ, sValue));
	    
	    var oBinding = oEvent.getSource().getBinding("items");
	    oBinding.filter(oFilters);
	},
	
	onConfirmPjtcu : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();
		var oPjtcu = sap.ui.getCore().byId(oController.PAGEID + "_Pjtcu");
		
		var aContexts = oEvent.getParameter("selectedContexts");
	    
		if (aContexts.length) {
			var vPjtcu = aContexts[0].getProperty("Pjtcu");
	    	var vPjtcutx = aContexts[0].getProperty("Pjtcutx");
	    	oPjtcu.removeAllCustomData();
	    	oPjtcu.setValue(vPjtcutx);
	    	oPjtcu.addCustomData(new sap.ui.core.CustomData({key : "Pjtcu", value : vPjtcu}));
	    }
		
		oController.onCancelPjtcu(oEvent);
	},
		
	onCancelPjtcu : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
//		var oController = oView.getController();
		
		var oBinding = oEvent.getSource().getBinding("items");
	    oBinding.filter([]);
	},
/////////////////////////////////////////////////////////////////////////////////////////////
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 국가 검색을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////	
	_ODialogSearchPjtcyEvent : null,
//	_SelectedContext : null,
	
	onDisplaySearchPjtcyDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();	
		
//		oController._SelectedContext = null;
		
	    var oPjtcy = sap.ui.getCore().byId(oController.PAGEID + "_Pjtcy");
	    oPjtcy.removeAllCustomData();
    	oPjtcy.setValue("");
    	oPjtcy.addCustomData(new sap.ui.core.CustomData({key : "Pjtcy", value : ""}));

		if(!oController._ODialogSearchPjtcyEvent) {
			oController._ODialogSearchPjtcyEvent = sap.ui.jsfragment("zui5_hrxx_project.fragment.SearchPjtcy", oController);
			oView.addDependent(oController._ODialogSearchPjtcyEvent);
		}
		oController._ODialogSearchPjtcyEvent.open();
	},
	
	onSearchPjtcy : function(oEvent) {
		var sValue = oEvent.getParameter("value");
//		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
//		var oController = oView.getController();
		
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Natio"));
	    oFilters.push(new sap.ui.model.Filter("Etext", sap.ui.model.FilterOperator.Contains, sValue));
	    
	    var oBinding = oEvent.getSource().getBinding("items");
	    oBinding.filter(oFilters);
	    
	},
	
	onConfirmPjtcy : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();
		var oPjtcy = sap.ui.getCore().byId(oController.PAGEID + "_Pjtcy");
		
		var aContexts = oEvent.getParameter("selectedContexts");
	    
		if (aContexts.length) {
			var vPjtcy = aContexts[0].getProperty("Ecode");
	    	var vPjtcytx = aContexts[0].getProperty("Etext");
	    	oPjtcy.removeAllCustomData();
	    	oPjtcy.setValue(vPjtcytx);
	    	oPjtcy.addCustomData(new sap.ui.core.CustomData({key : "Pjtcy", value : vPjtcy}));
	    }
		
		oController.onCancelPjtcy(oEvent);
	},
		
	onCancelPjtcy : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
//		var oController = oView.getController();
		
		var oBinding = oEvent.getSource().getBinding("items");
	    oBinding.filter([]);
	},
/////////////////////////////////////////////////////////////////////////////////////////////
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 등록 담당자 검색을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////
	_vEmployeeSearchID : "",
	_EmpSearchDialog : null,
	
	onEmployeeSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();
//		var oControl = this; 
//		var oCustomData = oControl.getCustomData();
//		oController._vEmployeeSearchID = oCustomData[0].getValue();
		common.SearchUser1.oController = oController;
		
		if(!oController._EmpSearchDialog) {
			oController._EmpSearchDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
			oView.addDependent(oController._EmpSearchDialog);
		}
		oController._EmpSearchDialog.open();
	},
	
	// 조직검색 POPUP 창을 연다
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
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
/////////////////////////////////////////////////////////////////////////////////////////////
	
	onNumberKeypress : function(e) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();
		var key_codes = null;
		if(oController._vDecimalSeparator == ".") key_codes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 0, 8, 46];
		else key_codes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 0, 8, 44];
		
		if (e.target.value.length == 0 && e.keyCode == 45) {
		} else if (!($.inArray(e.which, key_codes) >= 0)) {  
        	e.preventDefault();  
        }
	},
	
	onNumberKeyup : function(e) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();
		var Sign = "";
		var Number1 = "";
		if(e.target.value.charAt(0) == "-") {
			Sign = "-";
			Number1 = e.target.value.replace(/\-/g, '');
		} else {
			Sign = "";
			Number1 = e.target.value;
		}
		
	    var Number = "";
	    if(oController._vThousandSeparator == ",") Number = Number1.replace(/\,/g, '');
	    else Number = Number1.replace(/\./g, '');
	    
	    var newNum = "";  
	    var newNum2 = "";  
	    var end;  
	    var count = 0;  
	     
	    Number = Number.replace(/\,/g, '.');
	    if (Number.indexOf('.') != -1) {          
	        places = Number.length - Number.indexOf('.') - 1;  
	        if (places >= 3) {   
	            num = parseFloat(Number);  
	            Number = num.toFixed(2);
	        }  
	        var a = Number.split('.');  
	        Number = a[0];     
	        end = oController._vDecimalSeparator + a[1];  
	    }  
	    else { end = ""; }  
	     
	    var q = 0;  
	    for (var k = Number.length - 1; k >= 0; k--) {  
	        var oneChar = Number.charAt(k);  
	        if (count == 3) {  
	            newNum += oController._vThousandSeparator;  
	            newNum += oneChar;  
	            count = 1;  
	            q++;  
	            continue;  
	        }  
	        else {  
	            newNum += oneChar;  
	            count++;  
	        }  
	    }  
	     
	    for (var k = newNum.length - 1; k >= 0; k--) {  
	        var oneChar = newNum.charAt(k);  
	        newNum2 += oneChar;  
	    }  
	    e.target.value = newNum2 + end;
	    
	    if(e.target.value.length > 1 && Sign == "-");
	    e.target.value = Sign + e.target.value;
	},
	
	onDeleteSeper : function(fVal) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();
		var Number = "";
		
		if(oController._vThousandSeparator == ",") Number = fVal.replace(/\,/g, '');
	    else Number = fVal.replace(/\./g, '');
		
		return Number.replace(/\,/g, '.');
	},
	
	onCheckValidation : function(oController, oControll, vValue, vType, vMSGId) {
		switch(vType) {
			case "I" :
				if(vValue == "" || vValue == null) {
					oControll.setValueState(sap.ui.core.ValueState.Error);
					sap.m.MessageBox.alert(oBundleText.getText(vMSGId));
					return true;
				}
				break;
			case "L" :
				if(vValue == "") {
					oControll.addStyleClass("L2PSelectInvalidBorder");
					sap.m.MessageBox.alert(oBundleText.getText(vMSGId));
					return true;
				}
				break;
			case "D" :
				if(vValue == null || vValue == "") {
					oControll.setValueState(sap.ui.core.ValueState.Error);
					sap.m.MessageBox.alert(oBundleText.getText(vMSGId));
					return true;
				}
				break;
		}
		return false;
	},

	onChangeDate : function(oEvent) {
		var oControl = oEvent.getSource();
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_DATE"),{
				onClose : function() {
					oControl.setValue("");
				}
			});
			return false;
		}
		return true;
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////
// EmpCode 검색을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////	
	_ODialogSearchEmpCodeEvent : null,
	_OEmpCodeControl : null,
	
	onDisplaySearchEmpCodeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();	
		
		oController._OEmpCodeControl = oEvent.getSource();

		if(!oController._ODialogSearchEmpCodeEvent) {
			oController._ODialogSearchEmpCodeEvent = sap.ui.jsfragment("zui5_hrxx_project.fragment.SearchEmpCode", oController);
			oView.addDependent(oController._ODialogSearchEmpCodeEvent);
		}
		oController._ODialogSearchEmpCodeEvent.open();
		
		oController.onSetEmpCodeFragment();
	},
	
	onSetEmpCodeFragment : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();	
		
		var oControl = oController._OEmpCodeControl;
		var oDialog = sap.ui.getCore().byId(oController.PAGEID + "_POP_EmpCode_Dialog");
		var oStandardList = sap.ui.getCore().byId(oController.PAGEID + "_POP_EmpCode_StandardList");

		var vId = oControl.getCustomData()[0].getValue("id");
		var vLable = oControl.getCustomData()[1].getValue("label");
		
		oDialog.setTitle(vLable);
		oDialog.removeAllCustomData();
		oDialog.addCustomData(new sap.ui.core.CustomData({key : "id", value : vId}));
		oDialog.addCustomData(new sap.ui.core.CustomData({key : "lable", value : vLable}));
		
		var oDDLBModel = sap.ui.getCore().getModel("EmpCodeList2");
		var oDDLBData = oDDLBModel.getProperty("/" + vId);
		
		console.log(oDDLBModel);
		console.log(oDDLBData);
		
		oDialog.bindAggregation("items", {
			path : "/" + vId,
			template : oStandardList
		});
	},
	
	onSearchEmpCode : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Etext", sap.ui.model.FilterOperator.Contains, sValue));
	    
		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter(oFilters);
	},
	
	onConfirmEmpCode : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_project.ProjectCreate");
		var oController = oView.getController();
		
		var aContexts = oEvent.getParameter("selectedContexts");
	    
		if (aContexts.length) {
			var vEmpCode = aContexts[0].getProperty("Ecode");
//		    	var vEmpCodetx = aContexts[0].getProperty("Etext");
	    	oController._OEmpCodeControl.setValue(vEmpCode);
	    }
		
		oController.onCancelEmpCode(oEvent);
	},
		
	onCancelEmpCode : function(oEvent) {
		var oBinding = oEvent.getSource().getBinding("items");
	    oBinding.filter([]);
	},
/////////////////////////////////////////////////////////////////////////////////////////////
});