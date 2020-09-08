jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");
jQuery.sap.require("zui5_hrxx_actapp.common.Common");

sap.ui.controller("zui5_hrxx_actapp.ActRecPInfo", {
	
	PAGEID : "ActRecPInfo",
	
	_vActionType : "",
	_vStatu : "",
	_vPersa : "",
	_vDocno : "",
	_vDocty : "",
	_vReqno : "",
	_vActda : "",
	_vPernr : "",
	_vRecno : "",
	_vMolga : "",
	_vIntca : "",
	_vVoltId : "",
	_oContext : null,
	_vCntSub01 : 0,
	_vCntSub02 : 0,
	_vCntSub03 : 0,
	_vCntSub04 : 0,
	_vCntSub05 : 0,
	_vCntSub06 : 0,
	_vCntSub07 : 0,
	_vModifyContent : false,
	
	_vFromPageId : "",
	
	_DISABLED : false,
	_JobPage : "",
	
	BusyDialog : null,
	
	subAction : "",
	
	_vHndno : "",
	_vTelno : "",
	_vNatio : "",
	
	_ODialogPopup_Sub02 : null,
	_ODialogPopup_Sub02_P : null,
	_ODialogPopup_Sub03 : null,
	_ODialogPopup_Sub04 : null,
	_ODialogPopup_Sub05 : null,
	_ODialogPopup_Sub06 : null,
	
	oZipcodeList : null,
	
    vZipcodeColumns : [  
                         {id : "Ichek", label : oBundleText.getText("LABEL_SELECT"), control : "Radio", width : 50, align : "Center", filter : "#rspan"},
                         {id : "Pstlz", label : oBundleText.getText("PSTLZ"), control : "Text", width : 80, align : "Center", filter : "#rspan"},
		                 {id : "Statetx", label : oBundleText.getText("STATE_41"), control : "Text", width : 98, align : "Left", filter : "#combo_filter"},
		                 {id : "Ort01", label : oBundleText.getText("ORT01_ZIP"), control : "Text", width : 98, align : "Left", filter : "#combo_filter"},
		                 {id : "Ort02", label : oBundleText.getText("ORT02"), control : "Hidden", width : 10, align : "Left", filter : "#combo_filter"},
		                 {id : "State", label : oBundleText.getText("STATE"), control : "Hidden", width : 10, align : "Left", filter : "#text_filter"},
		                 {id : "Ltext1", label : oBundleText.getText("LTEXT1"), control : "Text", width : 250, align : "Left", filter : "#text_filter"},
		                 {id : "Ltext2", label : oBundleText.getText("LTEXT2"), control : "Text", width : 250, align : "Left", filter : "#text_filter"},
		                 {id : "Ltext3", label : oBundleText.getText("LTEXT3"), control : "Text", width : 250, align : "Left", filter : "#text_filter"},
		                ],
	
	vTelControls : [],
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actapp.ActRecPInfo
*/
	onInit: function() {
		//if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
	    //};
	         
        this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
			onAfterShow  : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this),
		});
	},
	
	onBeforeShow : function(oEvent) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		if(oEvent) {
			this._vActionType = oEvent.data.actiontype;
			this._vStatu = oEvent.data.Statu;
			this._vReqno = oEvent.data.Reqno;
			this._vDocno = oEvent.data.Docno;
			this._vDocty = oEvent.data.Docty;
			this._vPersa = oEvent.data.Persa;
			this._vActda = oEvent.data.Actda;
			this._vMolga = oEvent.data.Molga,
			this._vIntca = oEvent.data.Intca,
			this._oContext = oEvent.data.context;
			this._vFromPageId = oEvent.data.FromPageId;
			this._vVoltId = oEvent.data.VoltId;
			
			if(oEvent.data.Pdata) {
				this._vCntSub01 = oEvent.data.Pdata.Sub01;
				this._vCntSub02 = oEvent.data.Pdata.Sub02;
				this._vCntSub03 = oEvent.data.Pdata.Sub03;
				this._vCntSub04 = oEvent.data.Pdata.Sub04;
				this._vCntSub05 = 0;
				this._vCntSub06 = oEvent.data.Pdata.Sub06;
				this._vCntSub07 = oEvent.data.Pdata.Sub07;
			} else {
				this._vCntSub01 = 0;
				this._vCntSub02 = 0;
				this._vCntSub03 = 0;
				this._vCntSub04 = 0;
				this._vCntSub05 = 0;
				this._vCntSub06 = 0;
				this._vCntSub07 = 0;
			}
			
			this.vTelControls = [];
			this.vTelControls.push({id : this.PAGEID + "_Sub01_Form_" + this._vMolga + "_Hndno", mobile : true, telVal : "_vHndno"});
			this.vTelControls.push({id : this.PAGEID + "_Sub01_Form_" + this._vMolga + "_Telno", mobile : false, telVal : "_vTelno"});
			this._vHndno = "";
			this._vTelno = "";
			this._vNatio = "";
		}
		
		var oTitle = sap.ui.getCore().byId(this.PAGEID + "_PAGETITLE");
		if(this._vActionType == "V") oTitle.setText(oBundleText.getText("VIEW_REC_BTN"));
		else if(this._vActionType == "M")  oTitle.setText(oBundleText.getText("MODIFY_REC_BTN"));
		else oTitle.setText(oBundleText.getText("ADD_REC_BTN"));
		
		if(this._vStatu == "" || this._vStatu == "10") {
			if(this._vActionType == "V") this._DISABLED = true;
			else this._DISABLED = false;
		} else {
			this._DISABLED = true;
		}
		
		var oControlls = [
	                      {"Fieldname" : "Quali"},
	                      {"Fieldname" : "Konfe"},
	                      {"Fieldname" : "Slart"},
	                      {"Fieldname" : "Faccd"},
	                      {"Fieldname" : "Ansvx"},
	                      {"Fieldname" : "Serty"},
	                      {"Fieldname" : "Preas"},
	                      {"Fieldname" : "Jobcl"}, 
	                      {"Fieldname" : "Mrank"},
	                      {"Fieldname" : "Sprsl"},
	                      {"Fieldname" : "Famst"},
	                      {"Fieldname" : "Hukot"}
	                      ];
	    if(this._vActda == "" || this._vActda == null) this._vActda = dateFormat.format(new Date());
	    common.Common.loadCodeData(this._vPersa, this._vActda, oControlls);
		
	    var oRequestPanel = sap.ui.getCore().byId(this.PAGEID + "_Sub01_RequestPanel");
	    oRequestPanel.destroyContent();
	    oRequestPanel.addContent(sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Sub01_Form_" + this._vMolga, this));
	    
	    var oIconTabBar = sap.ui.getCore().byId(this.PAGEID + "_TABBAR");
		if(oIconTabBar.getSelectedKey() != "Sub01") oIconTabBar.setSelectedKey("Sub01");
		this._JobPage = "Sub01";
		
		this.setActionButton();
		this.setSub01();
		
		this.setCountTabBar(this, "");
		
		// 자격증유형코드 
 		var vCode = {cttypCode : []};
 		var oCttypList = sap.ui.getCore().getModel("CttypList");
 		var oCttypModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRXX_CERTI_SRV/", true, undefined, undefined, { "Cache-Control": "max-age=0"});
 		oCttypModel.read("/CertiTypeSearchSet?$filter=Field eq 'Cttyp' and Persa eq '" + this._vPersa + "'", 
					null, 
					null, 
					false, 
					function(oData, oResponse) {
						var i;
						if(oData && oData.results.length) {
							for(i=0; i<oData.results.length; i++) {
								vCode.cttypCode.push(oData.results[i]);
							}
						}
					},
					function(oResponse) {
						console.log(oResponse);
					}
		);
		oCttypList.setData(vCode);
	},
	
	onAfterShow: function(evt) {
		this.setTelField(this);
	},
	
	setTelField : function(oController) {
		var processF = function() {
			for(var i=0; i<oController.vTelControls.length; i++) {
				var oTelControl = $("#" + oController.vTelControls[i].id + "-inner");
				if(oTelControl) {
					oTelControl.intlTelInput({
				        autoFormat: true,
				        autoPlaceholder: false,
				        defaultCountry: oController._vIntca,
						utilsScript: "/sap/bc/ui5_ui5/sap/zhrxx_common/plugin/InitTel/utils.js"
					});
					
					var vNum = "";
					eval("vNum = oController." + oController.vTelControls[i].telVal);
					if(vNum == "") {
						var oControl = sap.ui.getCore().byId(oController.vTelControls[i].id);
						if(typeof oControl == "object") vNum = oControl.getValue();
					}
					
					if(vNum == "") {
						if(oController._vNatio != null && oController._vNatio != "") {
							oTelControl.intlTelInput("selectCountry", oController._vNatio.toLowerCase());
						}
					} else {
						oTelControl.intlTelInput("setNumber", vNum);
					}
				}
			}
		};
		
		setTimeout(processF, 300);
	},
	
	setCountTabBar : function(oController, vTab) {
		var oControl = null;
		var vCount = 0;
		if(vTab == "") {
			for(var i=1; i<8; i++) {
				if(i == 5) continue;
				oControl = sap.ui.getCore().byId(oController.PAGEID + "_TABFILTER_Sub0" + i);
				eval("vCount = oController._vCntSub0" + i);
				oControl.setCount(vCount);
			}
		} else {
			oControl = sap.ui.getCore().byId(oController.PAGEID + "_TABFILTER_" + vTab);
			eval("vCount = oController._vCnt" + vTab);
			oControl.setCount(vCount);
		}
		
		var vVisible = true;
		if(oController._vCntSub01 == 0) vVisible = false;
		for(var i=2; i<8; i++) {
			if(i == 5) continue;
			oControl = sap.ui.getCore().byId(oController.PAGEID + "_TABFILTER_Sub0" + i);
			if(i == 7 && this._vMolga != "41") oControl.setVisible(false);
			else oControl.setVisible(vVisible);
		}
		
		oController._vModifyContent = false;
	},
	
	changeModifyContent : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		oController._vModifyContent = true;
	},
	
	changeModifyDate : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		oController._vModifyContent = true;
		var oControl = oEvent.getSource();
		console.log(oEvent);
		console.log(oEvent.getParameter("valid"));
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_DATE"),{
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
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

	navToBack : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		var backFunction = function() {
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._vFromPageId,
			      data : {
			    	  context : oController._oContext,
			    	  Statu : oController._vStatu,
			    	  Reqno : oController._vReqno,
			    	  Docno : oController._vDocno,
			    	  Docty : oController._vDocty,
			    	  Persa : oController._vPersa
			      }
			});
		};
		
		if(oController._vModifyContent) {
			var saveFunction = function(fVal) {
				if(fVal && fVal == "OK") {
					if(oController.saveSub01("BACK")) backFunction();
				} else {
					backFunction();
				}
			};
			
			sap.m.MessageBox.confirm(oBundleText.getText("MSG_SAVE_CONFIRM2"), {
				title : oBundleText.getText("MSG_TITLE_GUIDE"),
				onClose : saveFunction
			});
		} else {
			backFunction();
		}
	},
	
	onTabSelected : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		oController._JobPage = oEvent.getParameter("selectedKey");
		oController.setActionButton();
		
		switch(oController._JobPage) {
			case "Sub01" : 
				oController.setSub01();
				oController.setTelField(oController);
				break;
			case "Sub02" : 
				oController.reloadSub02();
				break;
			case "Sub03" : 
				oController.reloadSub03();
				break;
			case "Sub04" : 
				oController.reloadSub04();
				break;
			case "Sub06" : 
				oController.reloadSub06();
				break;
			case "Sub07" : 
				oController.readSub07();
		}
		
	},
	
//  버튼 Setting
	setActionButton : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVE_BTN");
		var oAddBtn = sap.ui.getCore().byId(oController.PAGEID + "_ADD_BTN");
		var oModBtn = sap.ui.getCore().byId(oController.PAGEID + "_MODIFY_BTN");
		var oDelBtn = sap.ui.getCore().byId(oController.PAGEID + "_DELETE_BTN");
		var oDelBtnSub07 = sap.ui.getCore().byId(oController.PAGEID + "_DELETE_BTN_SUB07");
		var oRehireBtn = sap.ui.getCore().byId(oController.PAGEID + "_REHIRE_BTN");
		
		oSaveBtn.setVisible(false);
		oAddBtn.setVisible(false);
		oModBtn.setVisible(false);
		oDelBtn.setVisible(false);
		oDelBtnSub07.setVisible(false);
		oRehireBtn.setVisible(false);
		
		if(oController._DISABLED) {
		} else {	
			switch(oController._JobPage) {
				case "Sub01" : 
					oSaveBtn.setVisible(true);
					oRehireBtn.setVisible(true);
					break;
				case "Sub07" : 
					oSaveBtn.setVisible(true);
					oRehireBtn.setVisible(false);
					if(oController._vCntSub07 != 0) oDelBtnSub07.setVisible(true);
					break;
				case "Sub02" : 
				case "Sub03" : 
				case "Sub04" : 
				case "Sub05" : 
				case "Sub06" : 
					oAddBtn.setVisible(true);
					oModBtn.setVisible(true);
					oDelBtn.setVisible(true);
					oRehireBtn.setVisible(false);
			}
		}
		
		// 등록 / 수정 & 조회 에 따른 재입사 정보조회 버튼 활성화
		if(oController._vActionType != "C"){
			oRehireBtn.setVisible(false);
		}
		
		// 리스트 페이지 모드 변환
		if(oController._JobPage != "Sub01") {
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_" + oController._JobPage + "_TABLE");
			if(typeof oTable == "object") {
				if(oController._DISABLED)
					oTable.setMode(sap.m.ListMode.None);
				else
					oTable.setMode(sap.m.ListMode.SingleSelectLeft);
			}
		}
	},
	
//  저장버튼 클릭시....	
	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		eval("oController.save" + oController._JobPage + "()");
	},

	onPressAdd : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		oController.subAction = 'C';
		var oPopupName = "zui5_hrxx_actapp.fragment.ActRecPInfo_POP_" + oController._JobPage;
		
		if(!eval("oController._ODialogPopup_" + oController._JobPage)) {
			
			eval("oController._ODialogPopup_" + oController._JobPage + " = sap.ui.jsfragment(oPopupName, oController);");
			eval("oView.addDependent(oController._ODialogPopup_" + oController._JobPage + ");");
		}
		eval("oController._ODialogPopup_" + oController._JobPage + ".open();");
		
		eval("oController.set" + oController._JobPage + "(null);");
		if(oController._JobPage == "Sub02") {
			oController.setSLABS("00");

			oController.onClearFaartFields(oController);
	    	
		} else if(oController._JobPage == "Sub04") {
			oController.setEXMTY("");
		}
	},

	onPressModify : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_" + oController._JobPage + "_TABLE");
		var oContext = oTable.getSelectedContexts();
		if(oContext.length == 0) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_UPDATE_TARGET"));
			return;
		};

		oController.subAction = 'M';
		
		var oPopupName = "zui5_hrxx_actapp.fragment.ActRecPInfo_POP_" + oController._JobPage;
		
		if(!eval("oController._ODialogPopup_" + oController._JobPage)) {
			
			eval("oController._ODialogPopup_" + oController._JobPage + " = sap.ui.jsfragment(oPopupName, oController);");
			eval("oView.addDependent(oController._ODialogPopup_" + oController._JobPage + ");");
		}
		eval("oController._ODialogPopup_" + oController._JobPage + ".open();");
		
		eval("oController.set" + oController._JobPage + "(oContext);");
	},

	onPressDelete : function(oEvent) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_" + oController._JobPage + "_TABLE");
		var oContext = oTable.getSelectedContexts();
		if(oContext.length == 0) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_TARGET"));
			return;
		};
		
		var onProcessDelete = function(fVal) {
			if(fVal && fVal == "OK") {
				var process_result = false;
				oModel.remove(
						oContext[0].sPath, 
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
				if(process_result) {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
						title: oBundleText.getText("MSG_TITLE_GUIDE"),
						onClose : function() {
							eval("oController.reload" + oController._JobPage + "();");
							oController.onClose();
						}
					});
				}
			}
		};
		
		sap.m.MessageBox.confirm(oBundleText.getText("MSG_DELETE_CONFIRM"), {
			title : oBundleText.getText("MSG_TITLE_GUIDE"),
			onClose : onProcessDelete
		});
	
	},

	onClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oDialogName = oController.PAGEID + "_POP_" + oController._JobPage + "_Dialog";
		
		var oDialog = sap.ui.getCore().byId(oDialogName);
		if(oDialog) oDialog.close(); 
	},

	onChangeSlart : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		oController.setSLABS("00");
		oController.onClearFaartFields(oController);

		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Slart");
		//var oFaccd = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Faccd");
		var oAnzkl = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Anzkl");
		var oSltp1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sltp1");
		var oSltp2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sltp2");
		
		if(oSlart.getSelectedKey() == "Z4" || oSlart.getSelectedKey() == "Z5") {
			oSltp1.setEnabled(!oController._DISABLED);
			oSltp2.setEnabled(!oController._DISABLED);
		} else {
			oAnzkl.setSelectedKey("0000");
			oSltp1.setEnabled(false);
			oSltp2.setEnabled(false);
		}
	},
	
	onChangeQuali : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		oController.setEXMTY("");
		oController.setEAMGR("");
	},
	
	onChangeExmty : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		oController.setEAMGR("");
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 학위 DDLB
/////////////////////////////////////////////////////////////////////////////////////////////
	setSLABS : function(vSelectedKey) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Slart");
		var oSlabs = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Slabs");
		
		oSlabs.removeAllItems();
		oSlabs.addItem(
			new sap.ui.core.Item({
				key : "00", 
				text : oBundleText.getText("SELECTDATA")
			})
		);
		
		var oCommonModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
		var oPath = "/EmpCodeListSet/?$filter=Field%20eq%20%27Slabs%27%20and%20Excod%20eq%20%27" + oSlart.getSelectedKey() + 
		            "%27%20and%20PersaNc%20eq%20%27X%27";
		
		oCommonModel.read(
					oPath,
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								oSlabs.addItem(
									new sap.ui.core.Item({
										key : oData.results[i].Ecode, 
										text : oData.results[i].Etext
									})
								);
							}
							if(vSelectedKey != "00" && vSelectedKey != "") oSlabs.setSelectedKey(vSelectedKey);
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
	},

/////////////////////////////////////////////////////////////////////////////////////////////
// 시험구분 DDLB
/////////////////////////////////////////////////////////////////////////////////////////////
	setEXMTY : function(vSelectedKey) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oQuali = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Quali");
		var oExmty = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Exmty");
		
		oExmty.removeAllItems();
		oExmty.addItem(
			new sap.ui.core.Item({
				key : "", 
				text : oBundleText.getText("SELECTDATA")
			})
		);
		
		var oCommonModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
		var oPath = "/EmpCodeListSet/?$filter=Field%20eq%20%27Exmty%27%20and%20Excod%20eq%20%27" + oQuali.getSelectedKey() + 
		            "%27%20and%20PersaNc%20eq%20%27X%27";
		
		oCommonModel.read(
					oPath,
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								oExmty.addItem(
									new sap.ui.core.Item({
										key : oData.results[i].Ecode, 
										text : oData.results[i].Etext
									})
								);
							}
							if(vSelectedKey != "00" && vSelectedKey != "") oExmty.setSelectedKey(vSelectedKey);
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
	},
		
/////////////////////////////////////////////////////////////////////////////////////////////
// 시험등급 DDLB
/////////////////////////////////////////////////////////////////////////////////////////////
	setEAMGR : function(vSelectedKey) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oExmty = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Exmty");
		var oEamgr = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Eamgr");
		
		oEamgr.removeAllItems();
		oEamgr.addItem(
			new sap.ui.core.Item({
				key : "", 
				text : oBundleText.getText("SELECTDATA")
			})
		);
		
		var oCommonModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
		var oPath = "/EmpCodeListSet/?$filter=Field%20eq%20%27Eamgr%27%20and%20Excod%20eq%20%27" + oExmty.getSelectedKey() + 
		            "%27%20and%20PersaNc%20eq%20%27X%27";
		
		oCommonModel.read(
					oPath,
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								oEamgr.addItem(
									new sap.ui.core.Item({
										key : oData.results[i].Ecode, 
										text : oData.results[i].Etext
									})
								);
							}
							if(vSelectedKey != "00" && vSelectedKey != "") oEamgr.setSelectedKey(vSelectedKey);
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 학교 검색을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////	
	_ODialogSearchEvent : null,
	
	onDisplaySearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();	
		
		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Slart");
		var oSland = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sland");
		oSlart.removeStyleClass("L2PSelectInvalidBorder");
		oSland.setValueState(sap.ui.core.ValueState.None);
		
		if(oSlart.getSelectedKey() == "0000") {
			oSlart.addStyleClass("L2PSelectInvalidBorder");
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_SLART"));
			return;
		}
		
		oController._SelectedContext = null;
		
		if(!oController._ODialogSearchEvent) {
			oController._ODialogSearchEvent = sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_POP_Schcd", oController);
			oView.addDependent(oController._ODialogSearchEvent);
		}
		oController._ODialogSearchEvent.open();
	},
	
	onSearchSchcd : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Slart");
		
		var oFilters = [];
	    oFilters.push(new sap.ui.model.Filter("Slart", sap.ui.model.FilterOperator.EQ, oSlart.getSelectedKey()));
	    oFilters.push(new sap.ui.model.Filter("Insti", sap.ui.model.FilterOperator.EQ, sValue));
	    
	    var oBinding = oEvent.getSource().getBinding("items");
	    oBinding.filter(oFilters);
	},
	
	onConfirmSchcd : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		var oSchcd = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Schcd");
		var oSland = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sland");
		
		var aContexts = oEvent.getParameter("selectedContexts");
	    
		if (aContexts.length) {
			var vSchcd = aContexts[0].getProperty("Schcd");
	    	var vInsti = aContexts[0].getProperty("Insti");
	    	var vSland = aContexts[0].getProperty("Sland");
	    	var vSlandtx = aContexts[0].getProperty("Slandtx");
	    	
	    	oSchcd.removeAllCustomData();
	    	oSchcd.setValue(vInsti);
	    	oSchcd.addCustomData(new sap.ui.core.CustomData({key : "Schcd", value : vSchcd}));
	    	
	    	oSland.removeAllCustomData();
	    	oSland.setValue(vSlandtx);
	    	oSland.addCustomData(new sap.ui.core.CustomData({key : "Schcd", value : vSland}));
	    }
		
		oController.onCancelSchcd(oEvent);
	},
		
	onCancelSchcd : function(oEvent) {
		var oBinding = oEvent.getSource().getBinding("items");
	    oBinding.filter([]);
	},
/////////////////////////////////////////////////////////////////////////////////////////////
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 직무 검색을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////	
	_SerachStellDialog : null,
	
	displayStellSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
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
/////////////////////////////////////////////////////////////////////////////////////////////	
	

	
/////////////////////////////////////////////////////////////////////////////////////////////
// 국가 검색을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////	
	_ODialogSearchNatioEvent : null,
	_ONatioControl : null,
	
	onDisplaySearchNatioDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();	
		
		oController._ONatioControl = oEvent.getSource();

		if(!oController._ODialogSearchNatioEvent) {
			oController._ODialogSearchNatioEvent = sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_POP_Natio", oController);
			oView.addDependent(oController._ODialogSearchNatioEvent);
		}
		oController._ODialogSearchNatioEvent.open();
	},
	
	onSearchNatio : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Natio"));
		oFilters.push(new sap.ui.model.Filter("Etext", sap.ui.model.FilterOperator.Contains, sValue));
	    
		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter(oFilters);
	},
	
	onConfirmNatio : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var aContexts = oEvent.getParameter("selectedContexts");
	    
		if (aContexts.length) {
			var vNatio = aContexts[0].getProperty("Ecode");
	    	var vNatiotx = aContexts[0].getProperty("Etext");
	    	oController._ONatioControl.removeAllCustomData();
	    	oController._ONatioControl.setValue(vNatiotx);
	    	oController._ONatioControl.addCustomData(new sap.ui.core.CustomData({key : "Natio", value : vNatio}));
	    	
	    	oController._vModifyContent = true;
	    	
	    	if(oController._ONatioControl.sId.indexOf("Land1") > 0) {
	    		oController._vNatio = vNatio;
	    		oController.setTelField(oController);
			}
	    	
	    	oController.setDDLBState("");
	    	
	    	var oPstlz = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_41_Pstlz");
	    	if(typeof oPstlz == "object") {
	    		if(vNatio == "KR") {
	    			oPstlz.setShowValueHelp(true);
	    		} else {
	    			oPstlz.setShowValueHelp(false);
	    		}
	    	}
	    }
		
		oController.onCancelNatio(oEvent);
	},
		
	onCancelNatio : function(oEvent) {
		var oBinding = oEvent.getSource().getBinding("items");
	    oBinding.filter([]);
	},
/////////////////////////////////////////////////////////////////////////////////////////////
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 자격증 검색을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////	
	_ODialogSearchCttypEvent : null,
	_OCttypControl : null,
	
	onDisplaySearchCttypDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();	
		
		oController._OCttypControl = oEvent.getSource();

		if(!oController._ODialogSearchCttypEvent) {
			oController._ODialogSearchCttypEvent = sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_POP_Cttyp", oController);
			oView.addDependent(oController._ODialogSearchCttypEvent);
		}
		oController._ODialogSearchCttypEvent.open();
	},
	
	onSearchCttyp : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Cttyp"));
		oFilters.push(new sap.ui.model.Filter("Cttyptx", sap.ui.model.FilterOperator.Contains, sValue));
	    
		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter(oFilters);
	},
	
	onConfirmCttyp : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oIsaut = sap.ui.getCore().byId(oController.PAGEID + "_Sub06_Isaut");

		var aContexts = oEvent.getParameter("selectedContexts");
	    
		if (aContexts.length) {
			var vCttyp = aContexts[0].getProperty("Cttyp");
	    	var vCttyptx = aContexts[0].getProperty("Cttyptx");
	    	var vIsaut = aContexts[0].getProperty("Isaut");
	    	
	    	oController._OCttypControl.removeAllCustomData();
	    	oController._OCttypControl.setValue(vCttyptx);
	    	oController._OCttypControl.addCustomData(new sap.ui.core.CustomData({key : "Cttyp", value : vCttyp}));
	    	
	    	oIsaut.setValue(vIsaut);
	    	
	    	oController._vModifyContent = true;
	    	oController.setDDLBState("");
	    }
		
		oController.onCancelCttyp(oEvent);
	},
		
	onCancelCttyp : function(oEvent) {
		var oBinding = oEvent.getSource().getBinding("items");
	    oBinding.filter([]);
	},
/////////////////////////////////////////////////////////////////////////////////////////////
		
/////////////////////////////////////////////////////////////////////////////////////////////
// 주소 검색을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////	
	_ODialogSearchZipcodeEvent : null,
	
	onDisplaySearchZipcodeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();	
		
		if(!oController._ODialogSearchZipcodeEvent) {
			oController._ODialogSearchZipcodeEvent = sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ZipcodeSearch", oController);
			oView.addDependent(oController._ODialogSearchZipcodeEvent);
		}
		oController._ODialogSearchZipcodeEvent.open();
	},
		
	onSearchZipcode : function(oEvent) {
		var sValue = oEvent.getSource().getValue();

		var vGridData = {data : []};
		
		if(sValue != "") {
			var oModel = sap.ui.getCore().getModel("ZHRXX_PSTLZ_SRV");
			oModel.read("/ZipcodeListSet?$filter=Ltext eq '" + encodeURIComponent(sValue) + "'", 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {		
							for(var i=0; i<oData.results.length; i++) {
								var oneData = oData.results[i];
								oneData.Ichek = false;
								vGridData.data.push(oneData);
							}	
						}
					},
					function(oError) {
				    	var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							console.log(Err);
							if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
								var vTemp = Err.error.innererror.errordetails[0].message.split("|");
								if(vTemp[0].trim() == "E") 
									sap.m.MessageBox.alert(vTemp[1].trim());
								else
									console.log(vTemp[0].trim());
							} else {
								console.log(Err.error.message.value);
							}
						} else {
							console.log(oError);
						}
					}
			);
			ZipCodeList.LoadSearchData(vGridData);
		}

	},
	
	onConfirmZipcode : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		if(typeof ZipCodeList != "object") return;
		
		var oPstlz = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_41_Pstlz");
		var oState = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_41_State");
		var oOrt01 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_41_Ort01");
		var oOrt02 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_41_Ort02");
		
		var vCheck_Idx = -1;
		for(var i=0; i<ZipCodeList.RowCount(); i++) {
			 if(ZipCodeList.GetCellValue(i, "Ichek") == 1) {
				 vCheck_Idx = i;
				 break;
			 }
		}
		
		oPstlz.setValue(ZipCodeList.GetCellValue(vCheck_Idx, "Pstlz"));
		oState.setSelectedKey(ZipCodeList.GetCellValue(vCheck_Idx, "State"));
		oOrt01.setValue(ZipCodeList.GetCellValue(vCheck_Idx, "Ort01"));
		oOrt02.setValue(ZipCodeList.GetCellValue(vCheck_Idx, "Ort02"));
		oController.onCloseZipcode();
	},
		
	onCloseZipcode : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		if(oController._ODialogSearchZipcodeEvent && oController._ODialogSearchZipcodeEvent.isOpen()) {
			oController._ODialogSearchZipcodeEvent.close();
		};
	},
	
	onAfterRenderingTableLayout : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		$("#" + oController.PAGEID + "_ZipcodeList").css("height", 560);
		
		if(typeof ZipCodeList == "undefined") {
			var vLang = "";
			if(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase().indexOf("ko") == -1) vLang = "en";
			
			createIBSheet2(document.getElementById(oController.PAGEID + "_ZipcodeList"), "ZipCodeList", "100%", "560px", vLang);
		}
		
		ZipCodeList.Reset();
		
		ZipCodeList.SetTheme("DS", "GhrisMain");
		
		var initdata = {};
		
		//InitHeaders의 두번째 인자
		initdata.HeaderMode = {Sort:1,ColMove:0,ColResize:1,HeaderCheck:0};
		
		initdata.Cols = [];
		
		for(var i=0; i<oController.vZipcodeColumns.length; i++) {
			var oneCol = {};
			oneCol.Header = oController.vZipcodeColumns[i].label;
			oneCol.Type = oController.vZipcodeColumns[i].control;
			oneCol.Edit = 0;
			if(i==0) oneCol.Edit = 1;
			oneCol.SaveName = oController.vZipcodeColumns[i].id;
			oneCol.Align = oController.vZipcodeColumns[i].align;
			oneCol.Width = oController.vZipcodeColumns[i].width;
			if(oController.vZipcodeColumns[i].control ==  "Hidden") {
				oneCol.Hidden = true;
			}
			initdata.Cols.push(oneCol);
		}
		
		IBS_InitSheet(ZipCodeList, initdata);
		ZipCodeList.FitColWidth();
		ZipCodeList.SetSelectionMode(0);
		
		ZipCodeList.SetCellFont("FontSize", 0, "Ichek", ZipCodeList.HeaderRows(),  "Ltext3", 13);
		ZipCodeList.SetCellFont("FontName", 0, "Ichek", ZipCodeList.HeaderRows(),  "Ltext3", "Malgun Gothic");
		ZipCodeList.SetHeaderRowHeight(25);
		ZipCodeList.SetDataRowHeight(25);
	},
	
	beforeOpenZSDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oZipcodeSearchField = sap.ui.getCore().byId(oController.PAGEID + "_ZipcodeSearchField");
		if(oZipcodeSearchField) oZipcodeSearchField.setValue("");
		
	},
/////////////////////////////////////////////////////////////////////////////////////////////
		
/////////////////////////////////////////////////////////////////////////////////////////////
// Sub01 인적사항을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////
//  인적사항 화면 Setting.
	setSub01 : function() {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var oNameLayout = sap.ui.getCore().byId(oController.PAGEID + "_NameLayout");
		var oNameLayoutText = sap.ui.getCore().byId(oController.PAGEID + "_NameLayoutText");
		oNameLayoutText.setText("");
		oNameLayout.setVisible(false);
		
		var oNachnI = null,	oKonfeL = null,	oVornaI = null,	oGeschR1 = null,	oGeschR2 = null,	oHukotL = null,	
			oNatioL = null,	oLnmhgI = null,	oFnmhgI = null,	oLnmchI = null,	oFnmchI = null,	oRegnoI = null,	
			oLand1L = null, oZzgbdatD = null,	oGbdatD = null,	oZzgbdtyR1 = null,	oZzgbdtyR2 = null,	oHndnoI = null,	oTelnoI = null,	
			oFamstL = null,	oFamdtD = null,	oSprslL = null,	oPstlzI = null,	oStateL = null,	oOrt01I = null,	
			oOrt02I = null,	oInitsI = null,	oMidnmI = null,	oPannoI = null,	oCtznoI = null,	oZzfathnI = null,	
			oStrasI = null,	oZzlocnmI = null,	oKornmI = null,	oName2I = null, oPeridI = null, oUannoI = null, oHsnmrI = null;
		var vNachnI = "",	vKonfeL = "0000",	vVornaI = "",	vGeschR = "",	vHukotL = "0000",	
			vNatioL = "", vNatioLTX = "",	vLnmhgI = "",	vFnmhgI = "",	vLnmchI = "",	vFnmchI = "",	vRegnoI = "",	
			vLand1L = "", vLand1LTX = "",	vZzgbdatD = null,	vGbdatD = null,	vZzgbdtyR = "",	vHndnoI = "",	vTelnoI = "",	vFamstL = "0000",	
			vFamdtD = null,	vSprslL = "0000",	vPstlzI = "",	vStateL = "0000",	vOrt01I = "",	vOrt02I = "",	
			vInitsI = "",	vMidnmI = "",	vPannoI = "",	vCtznoI = "",	vZzfathnI = "",	vStrasI = "",	
			vZzlocnmI = "",	vKornmI = "",	vName2I = "", vPeridI = "", vUannoI = "", vHsnmrI = "", vCernoI = "";

		if(this._vActionType != "C") {
			oModel.read("/RecruitingSubjectsSet(Docno='" + oController._vDocno + "',"
					  + "VoltId='" +  oController._vVoltId + "')",
				null, 
				null, 
				false, 	
				function(oData, oResponse) {	
					if(oData) {
						//Global 일자 관련하여 소스 수정함. 2015.10.19
						vZzgbdatD = common.Common.setTime(new Date(oData.Zzgbdat));						
						vGbdatD = common.Common.setTime(new Date(oData.Gbdat));
						vFamdtD = common.Common.setTime(new Date(oData.Famdt));
						//vZzgbdatD = oData.Zzgbdat;
						//vGbdatD = oData.Gbdat;
						//vFamdtD = oData.Famdt;
						//수정완료
						vKonfeL = oData.Konfe;
						vHukotL = oData.Hukot;
						vNatioL = oData.Natio;
						vNatioLTX = oData.Natiotx;
						vLand1L = oData.Land1;
						vLand1LTX = oData.Land1tx;
						vSprslL = oData.Sprsl;
						vStateL = oData.State;
						vGeschR = oData.Gesch;
						vZzgbdtyR = oData.Zzgbdty;
						vFamstL = oData.Famst;
						vNachnI = oData.Nachn;
						vVornaI = oData.Vorna;
						vLnmhgI = oData.Lnmhg;
						vFnmhgI = oData.Fnmhg;
						vLnmchI = oData.Lnmch;
						vFnmchI = oData.Fnmch;
						vRegnoI = oData.Regno;
						vHndnoI = oData.Hndno;
						vTelnoI = oData.Telno;
						vPstlzI = oData.Pstlz;
						vOrt01I = oData.Ort01;
						vOrt02I = oData.Ort02;
						vInitsI = oData.Inits;
						vMidnmI = oData.Midnm;
						vPannoI = oData.Panno;
						vCtznoI = oData.Ctzno;
						vZzfathnI = oData.Zzfathn;
						vStrasI = oData.Stras;
						vZzlocnmI = oData.Zzlocnm;
						vKornmI = oData.Kornm;
						vName2I = oData.Name2;
						vPeridI = oData.Perid,
						vUannoI = oData.Uanno,
						vHsnmrI = oData.Hsnmr,
						oController._vRecno = oData.Recno;
						oController._vVoltId = oData.VoltId;
						oNameLayout.setVisible(true);
						var vNameStr = oData.Ename;
						oNameLayoutText.setText(vNameStr);
						
						oController._vCntSub01 = 1;
						oController.setCountTabBar(oController, "Sub01");
					};
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}		
			);
		}
		
//		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_TABLE");
//		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_COLUMNLIST");
//		oTable.bindItems("/RecruitingSubjectsGroupWorkingHistorySet", oColumnList, null, [new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno) , 
//		                                                                                  new sap.ui.model.Filter("Cerno", sap.ui.model.FilterOperator.EQ, vRegnoI)]);
		
		oZzgbdatD = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdat");	if(typeof oZzgbdatD == "object") { oZzgbdatD.setValueState(sap.ui.core.ValueState.None);	if(vZzgbdatD != null) oZzgbdatD.setValue(dateFormat.format(new Date(vZzgbdatD)));	oZzgbdatD.setEnabled(!oController._DISABLED); }
		oFamdtD = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Famdt");	if(typeof oFamdtD == "object") { oFamdtD.setValueState(sap.ui.core.ValueState.None);	if(vFamdtD != null) oFamdtD.setValue(dateFormat.format(new Date(vFamdtD)));	oFamdtD.setEnabled(!oController._DISABLED); }
		oNatioL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Natio");	if(typeof oNatioL == "object") { oNatioL.setValueState(sap.ui.core.ValueState.None);	oNatioL.setValue(vNatioLTX);	oNatioL.removeAllCustomData();	oNatioL.addCustomData(new sap.ui.core.CustomData({key:"Natio", value:vNatioL}));	oNatioL.setEnabled(!oController._DISABLED); }
		oLand1L = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Land1");	if(typeof oLand1L == "object") { oLand1L.setValueState(sap.ui.core.ValueState.None);	oLand1L.setValue(vLand1LTX);	oLand1L.removeAllCustomData();	oLand1L.addCustomData(new sap.ui.core.CustomData({key:"Land1", value:vLand1L}));	oLand1L.setEnabled(!oController._DISABLED); }
		oController._vNatio = vLand1L;
		
		oSprslL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Sprsl");	if(typeof oSprslL == "object") { oSprslL.removeStyleClass("L2PSelectInvalidBorder");	oSprslL.setSelectedKey(vSprslL);	oSprslL.setEnabled(!oController._DISABLED); }
		oStateL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_State");	
		if(typeof oStateL == "object") { 
			oStateL.removeStyleClass("L2PSelectInvalidBorder");	
			oController.setDDLBState(vStateL);
			oStateL.setEnabled(!oController._DISABLED); 
		}
		oGeschR1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Gesch1");
		oGeschR2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Gesch2");
		if(typeof oGeschR1 == "object") { 
			oGeschR1.setValueState(sap.ui.core.ValueState.None); 	oGeschR2.setValueState(sap.ui.core.ValueState.None);	
			oGeschR1.setEnabled(!oController._DISABLED); 			oGeschR2.setEnabled(!oController._DISABLED);
			switch(vGeschR) {
				case "1" : oGeschR1.setSelected(true); break;
				case "2" : oGeschR2.setSelected(true); break; 
				default : oGeschR1.setSelected(false); oGeschR2.setSelected(false);
			}		
		}
		oFamstL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Famst");	if(typeof oFamstL == "object") { oFamstL.removeStyleClass("L2PSelectInvalidBorder");	oFamstL.setSelectedKey(vFamstL);	oFamstL.setEnabled(!oController._DISABLED); }
		oNachnI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Nachn");	if(typeof oNachnI == "object") { oNachnI.setValueState(sap.ui.core.ValueState.None);	oNachnI.setValue(vNachnI);	oNachnI.setEnabled(!oController._DISABLED); }
		oVornaI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Vorna");	if(typeof oVornaI == "object") { oVornaI.setValueState(sap.ui.core.ValueState.None);	oVornaI.setValue(vVornaI);	oVornaI.setEnabled(!oController._DISABLED); }
		
		oHndnoI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Hndno");	
		if(typeof oHndnoI == "object") { 
			oHndnoI.setValueState(sap.ui.core.ValueState.None);	
			oController._vHndno = vHndnoI;
			oHndnoI.setEnabled(!oController._DISABLED); 
		}
		
		oTelnoI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Telno");	
		if(typeof oTelnoI == "object") { 
			oTelnoI.setValueState(sap.ui.core.ValueState.None);	
			oController._vTelno = vTelnoI;
			oTelnoI.setEnabled(!oController._DISABLED); 
		}
		
		oPstlzI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Pstlz");	if(typeof oPstlzI == "object") { oPstlzI.setValueState(sap.ui.core.ValueState.None);	oPstlzI.setValue(vPstlzI);	oPstlzI.setEnabled(!oController._DISABLED); }
		oOrt01I = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Ort01");	if(typeof oOrt01I == "object") { oOrt01I.setValueState(sap.ui.core.ValueState.None);	oOrt01I.setValue(vOrt01I);	oOrt01I.setEnabled(!oController._DISABLED); }
		oOrt02I = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Ort02");	if(typeof oOrt02I == "object") { oOrt02I.setValueState(sap.ui.core.ValueState.None);	oOrt02I.setValue(vOrt02I);	oOrt02I.setEnabled(!oController._DISABLED); }
		oStrasI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Stras");	if(typeof oStrasI == "object") { oStrasI.setValueState(sap.ui.core.ValueState.None);	oStrasI.setValue(vStrasI);	oStrasI.setEnabled(!oController._DISABLED); }
		
		if(vFamstL == "0"){
			oFamdtD.setValue("");
			oFamdtD.setEnabled(false);
		} else {
			oFamdtD.setEnabled(true);
		}

		switch(oController._vMolga) {
			case "41":
				oKonfeL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Konfe");	if(typeof oKonfeL == "object") { oKonfeL.removeStyleClass("L2PSelectInvalidBorder");	oKonfeL.setSelectedKey(vKonfeL);	oKonfeL.setEnabled(!oController._DISABLED); }
				oZzgbdtyR1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdty1");	
				oZzgbdtyR2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdty2");
				if(typeof oZzgbdtyR1 == "object") { 
					oZzgbdtyR1.setValueState(sap.ui.core.ValueState.None);		oZzgbdtyR2.setValueState(sap.ui.core.ValueState.None);
					oZzgbdtyR1.setEnabled(!oController._DISABLED);				oZzgbdtyR2.setEnabled(!oController._DISABLED);
					switch(vZzgbdtyR) {
						case "1" : oZzgbdtyR1.setSelected(true); break;
						case "2" : oZzgbdtyR2.setSelected(true); break;
						default : oZzgbdtyR1.setSelected(false); oZzgbdtyR2.setSelected(false);
					}
				}
				oLnmhgI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Lnmhg");	if(typeof oLnmhgI == "object") { oLnmhgI.setValueState(sap.ui.core.ValueState.None);	oLnmhgI.setValue(vLnmhgI);	oLnmhgI.setEnabled(!oController._DISABLED); }
				oFnmhgI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Fnmhg");	if(typeof oFnmhgI == "object") { oFnmhgI.setValueState(sap.ui.core.ValueState.None);	oFnmhgI.setValue(vFnmhgI);	oFnmhgI.setEnabled(!oController._DISABLED); }
				oLnmchI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Lnmch");	if(typeof oLnmchI == "object") { oLnmchI.setValueState(sap.ui.core.ValueState.None);	oLnmchI.setValue(vLnmchI);	oLnmchI.setEnabled(!oController._DISABLED); }
				oFnmchI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Fnmch");	if(typeof oFnmchI == "object") { oFnmchI.setValueState(sap.ui.core.ValueState.None);	oFnmchI.setValue(vFnmchI);	oFnmchI.setEnabled(!oController._DISABLED); }
				oRegnoI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Regno");	if(typeof oRegnoI == "object") { oRegnoI.setValueState(sap.ui.core.ValueState.None);	oRegnoI.setValue(vRegnoI);	oRegnoI.setEnabled(!oController._DISABLED); }
				
				if(vLand1L == "KR"){
	    			oPstlzI.setShowValueHelp(true);
	    		} else {
	    			oPstlzI.setShowValueHelp(false);
				}
				vCernoI = vRegnoI;
				break;
			case "28":
				oGbdatD = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Gbdat");	if(typeof oGbdatD == "object") { oGbdatD.setValueState(sap.ui.core.ValueState.None);	if(vGbdatD != null) oGbdatD.setValue(dateFormat.format(new Date(vGbdatD)));	oGbdatD.setEnabled(!oController._DISABLED); }
				oKonfeL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Konfe");	if(typeof oKonfeL == "object") { oKonfeL.removeStyleClass("L2PSelectInvalidBorder");	oKonfeL.setSelectedKey(vKonfeL);	oKonfeL.setEnabled(!oController._DISABLED); }
				oHukotL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Hukot");	if(typeof oHukotL == "object") { oHukotL.removeStyleClass("L2PSelectInvalidBorder");	oHukotL.setSelectedKey(vHukotL);	oHukotL.setEnabled(!oController._DISABLED); }
				oZzgbdtyR1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdty1");	
				oZzgbdtyR2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdty2");
				if(typeof oZzgbdtyR1 == "object") { 
					oZzgbdtyR1.setValueState(sap.ui.core.ValueState.None);		oZzgbdtyR2.setValueState(sap.ui.core.ValueState.None);
					oZzgbdtyR1.setEnabled(!oController._DISABLED);				oZzgbdtyR2.setEnabled(!oController._DISABLED);
					switch(vZzgbdtyR) {
						case "1" : oZzgbdtyR1.setSelected(true); break;
						case "2" : oZzgbdtyR2.setSelected(true); break;
						default : oZzgbdtyR1.setSelected(false); oZzgbdtyR2.setSelected(false);
					}
				}
				oZzlocnmI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzlocnm");	if(typeof oZzlocnmI == "object") { oZzlocnmI.setValueState(sap.ui.core.ValueState.None);	oZzlocnmI.setValue(vZzlocnmI);	oZzlocnmI.setEnabled(!oController._DISABLED); }
				oKornmI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Kornm");	if(typeof oKornmI == "object") { oKornmI.setValueState(sap.ui.core.ValueState.None);	oKornmI.setValue(vKornmI);	oKornmI.setEnabled(!oController._DISABLED); }
				oName2I = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Name2");	if(typeof oName2I == "object") { oName2I.setValueState(sap.ui.core.ValueState.None);	oName2I.setValue(vName2I);	oName2I.setEnabled(!oController._DISABLED); }
				oPeridI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Perid");	if(typeof oPeridI == "object") { oPeridI.setValueState(sap.ui.core.ValueState.None);	oPeridI.setValue(vPeridI);	oPeridI.setEnabled(!oController._DISABLED); }
				oHsnmrI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Hsnmr");	if(typeof oHsnmrI == "object") { oHsnmrI.setValueState(sap.ui.core.ValueState.None);	oHsnmrI.setValue(vHsnmrI);	oHsnmrI.setEnabled(!oController._DISABLED); }
				vCernoI = vPeridI;
				break;
			case "40":
				oGbdatD = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Gbdat");	if(typeof oGbdatD == "object") { oGbdatD.setValueState(sap.ui.core.ValueState.None);	if(vGbdatD != null) oGbdatD.setValue(dateFormat.format(new Date(vGbdatD)));	oGbdatD.setEnabled(!oController._DISABLED); }
				oKonfeL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Konfe");	if(typeof oKonfeL == "object") { oKonfeL.removeStyleClass("L2PSelectInvalidBorder");	oKonfeL.setSelectedKey(vKonfeL);	oKonfeL.setEnabled(!oController._DISABLED); }
				oInitsI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Inits");	if(typeof oInitsI == "object") { oInitsI.setValueState(sap.ui.core.ValueState.None);	oInitsI.setValue(vInitsI);	oInitsI.setEnabled(!oController._DISABLED); }
				oMidnmI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Midnm");	if(typeof oMidnmI == "object") { oMidnmI.setValueState(sap.ui.core.ValueState.None);	oMidnmI.setValue(vMidnmI);	oMidnmI.setEnabled(!oController._DISABLED); }
				oPannoI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Panno");	if(typeof oPannoI == "object") { oPannoI.setValueState(sap.ui.core.ValueState.None);	oPannoI.setValue(vPannoI);	oPannoI.setEnabled(!oController._DISABLED); }
				oZzfathnI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzfathn");	if(typeof oZzfathnI == "object") { oZzfathnI.setValueState(sap.ui.core.ValueState.None);	oZzfathnI.setValue(vZzfathnI);	oZzfathnI.setEnabled(!oController._DISABLED); }
				oName2I = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Name2");	if(typeof oName2I == "object") { oName2I.setValueState(sap.ui.core.ValueState.None);	oName2I.setValue(vName2I);	oName2I.setEnabled(!oController._DISABLED); }
				oUannoI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Uanno");	if(typeof oUannoI == "object") { oUannoI.setValueState(sap.ui.core.ValueState.None);	oUannoI.setValue(vUannoI);	oUannoI.setEnabled(!oController._DISABLED); }
				vCernoI = vPannoI;
				break;
			case "VN":
				oGbdatD = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Gbdat");	if(typeof oGbdatD == "object") { oGbdatD.setValueState(sap.ui.core.ValueState.None);	if(vGbdatD != null) oGbdatD.setValue(dateFormat.format(new Date(vGbdatD)));	oGbdatD.setEnabled(!oController._DISABLED); }
				oZzgbdtyR1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdty1");	
				oZzgbdtyR2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdty2");
				if(typeof oZzgbdtyR1 == "object") { 
					oZzgbdtyR1.setValueState(sap.ui.core.ValueState.None);		oZzgbdtyR2.setValueState(sap.ui.core.ValueState.None);
					oZzgbdtyR1.setEnabled(!oController._DISABLED);				oZzgbdtyR2.setEnabled(!oController._DISABLED);
					switch(vZzgbdtyR) {
						case "1" : oZzgbdtyR1.setSelected(true); break;
						case "2" : oZzgbdtyR2.setSelected(true); break;
						default : oZzgbdtyR1.setSelected(false); oZzgbdtyR2.setSelected(false);
					}
				}
				oCtznoI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Ctzno");	if(typeof oCtznoI == "object") { oCtznoI.setValueState(sap.ui.core.ValueState.None);	oCtznoI.setValue(vCtznoI);	oCtznoI.setEnabled(!oController._DISABLED); }
				oName2I = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Name2");	if(typeof oName2I == "object") { oName2I.setValueState(sap.ui.core.ValueState.None);	oName2I.setValue(vName2I);	oName2I.setEnabled(!oController._DISABLED); }
				vCernoI = vCtznoI;
				break;
		}
		
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_TABLE");
		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_COLUMNLIST");
		oTable.bindItems("/RecruitingSubjectsGroupWorkingHistorySet", oColumnList, null, [new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno) , 
		                                                                                  new sap.ui.model.Filter("Cerno", sap.ui.model.FilterOperator.EQ, vCernoI)]);
	},
	
//  전화번호 가지고오기...	
	getTelNum : function(vControlName){
		var oControl = sap.ui.getCore().byId(vControlName);
		var oTelControl = $("#" + vControlName + "-inner");
		var vVal = "";
		
		if ($.trim(oTelControl.val())) {
			if(oTelControl.intlTelInput("isValidNumber")) {
				oControl.setValueState(sap.ui.core.ValueState.None);
				oControl.setValueStateText("");
				vVal = "+" + oTelControl.intlTelInput("getSelectedCountryData").dialCode + " " + oTelControl.val();
		    } else {
		    	oControl.setValueState(sap.ui.core.ValueState.Error);
		    	oControl.setValueStateText("Wrong Telephone Number !!!");
		    	sap.m.MessageBox.alert(oBundleText.getText("MSG_INVALID_TELNO"), {});
		    	vVal = "WrongNum";
		    }
		} else {
			vVal = "";
		}
		
		return vVal;
	},
	
//  인적사항을 저장 한다.	
	saveSub01 : function(fVal) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oNachnI = null,	oKonfeL = null,	oVornaI = null,	oGeschR1 = null,	oGeschR2 = null,	oHukotL = null,	
			oNatioL = null,	oLand1L = null,	oLnmhgI = null,	oFnmhgI = null,	oLnmchI = null,	oFnmchI = null,	oRegnoI = null,	
			oZzgbdatD = null,	oGbdatD = null,	oHndnoI = null,	
			oFamstL = null,	oFamdtD = null,	oSprslL = null,	oPstlzI = null,	oStateL = null,	oOrt01I = null,	
			oOrt02I = null,	oInitsI = null,	oMidnmI = null,	oPannoI = null,	oCtznoI = null,	oZzfathnI = null,	
			oStrasI = null,	oZzlocnmI = null,	oKornmI = null,	oName2I = null, oPeridI = null, oUannoI = null, oHsnmrI = null;
		var vNachnI = "",	vKonfeL = "0000",	vVornaI = "",	vGeschR = "",	vHukotL = "0000",	
			vNatioL = "",	vLand1L = "",	vLnmhgI = "",	vFnmhgI = "",	vLnmchI = "",	vFnmchI = "",	vRegnoI = "",	vFamdtD = "",
			vZzgbdatD = "",	vGbdatD = "",	vZzgbdtyR = "",	vHndnoI = "",	vTelnoI = "",	vFamstL = "0000",	
			vSprslL = "0000",	vPstlzI = "",	vStateL = "0000",	vOrt01I = "",	vOrt02I = "",	
			vInitsI = "",	vMidnmI = "",	vPannoI = "",	vCtznoI = "",	vZzfathnI = "",	vStrasI = "",	
			vZzlocnmI = "",	vKornmI = "",	vName2I = "", vPeridI = "", vUannoI = "", vHsnmrI = "";
		
		oZzgbdatD = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdat");	if(typeof oZzgbdatD == "object") { oZzgbdatD.setValueState(sap.ui.core.ValueState.None);	vZzgbdatD = oZzgbdatD.getValue(); }
		oFamdtD = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Famdt");	if(typeof oFamdtD == "object") { oFamdtD.setValueState(sap.ui.core.ValueState.None);	vFamdtD = oFamdtD.getValue(); }
		oNatioL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Natio");	if(typeof oNatioL == "object") { oNatioL.setValueState(sap.ui.core.ValueState.None);	vNatioL = oNatioL.getCustomData()[0].getValue(); }
		oLand1L = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Land1");	if(typeof oLand1L == "object") { oLand1L.setValueState(sap.ui.core.ValueState.None);	vLand1L = oLand1L.getCustomData()[0].getValue(); }
		oSprslL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Sprsl");	if(typeof oSprslL == "object") { oSprslL.removeStyleClass("L2PSelectInvalidBorder");	vSprslL = oSprslL.getSelectedKey(); }
		oStateL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_State");	if(typeof oStateL == "object") { oStateL.removeStyleClass("L2PSelectInvalidBorder");	vStateL = oStateL.getSelectedKey(); }
		oGeschR1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Gesch1");	
		oGeschR2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Gesch2");	
		if(typeof oGeschR1 == "object") { 
			oGeschR1.setValueState(sap.ui.core.ValueState.None);		oGeschR2.setValueState(sap.ui.core.ValueState.None);
			if(oGeschR1.getSelected()) vGeschR = "1";
			else if(oGeschR2.getSelected()) vGeschR = "2";
			else vGeschR = "";
		}
		oFamstL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Famst");	if(typeof oFamstL == "object") { oFamstL.removeStyleClass("L2PSelectInvalidBorder");	vFamstL = oFamstL.getSelectedKey(); }
		oNachnI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Nachn");	if(typeof oNachnI == "object") { oNachnI.setValueState(sap.ui.core.ValueState.None);	vNachnI = oNachnI.getValue(); }
		oVornaI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Vorna");	if(typeof oVornaI == "object") { oVornaI.setValueState(sap.ui.core.ValueState.None);	vVornaI = oVornaI.getValue(); }
		
		oHndnoI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Hndno");	
		if(typeof oHndnoI == "object") { 
			vHndnoI = oController.getTelNum(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Hndno");
			if(vHndnoI == "WrongNum") return;
		}
		oTelnoI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Telno");	
		if(typeof oTelnoI == "object") { 
			vTelnoI = oController.getTelNum(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Telno");
			if(vTelnoI == "WrongNum") return;
		}

		oPstlzI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Pstlz");	if(typeof oPstlzI == "object") { oPstlzI.setValueState(sap.ui.core.ValueState.None);	vPstlzI = oPstlzI.getValue(); }
		oOrt01I = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Ort01");	if(typeof oOrt01I == "object") { oOrt01I.setValueState(sap.ui.core.ValueState.None);	vOrt01I = oOrt01I.getValue(); }
		oOrt02I = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Ort02");	if(typeof oOrt02I == "object") { oOrt02I.setValueState(sap.ui.core.ValueState.None);	vOrt02I = oOrt02I.getValue(); }
		oStrasI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Stras");	if(typeof oStrasI == "object") { oStrasI.setValueState(sap.ui.core.ValueState.None);	vStrasI = oStrasI.getValue(); }

		switch(oController._vMolga) {
			case "41":
				oKonfeL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Konfe");	if(typeof oKonfeL == "object") { oKonfeL.removeStyleClass("L2PSelectInvalidBorder");	vKonfeL = oKonfeL.getSelectedKey(); }
				oZzgbdtyR1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdty1");	
				oZzgbdtyR2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdty2");	
				if(typeof oZzgbdtyR1 == "object") { 
					oZzgbdtyR1.setValueState(sap.ui.core.ValueState.None);		oZzgbdtyR1.setValueState(sap.ui.core.ValueState.None);
					if(oZzgbdtyR1.getSelected()) vZzgbdtyR = "1";
					else if(oZzgbdtyR2.getSelected()) vZzgbdtyR = "2";
					else vZzgbdtyR = "";
				}
				oLnmhgI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Lnmhg");	if(typeof oLnmhgI == "object") { oLnmhgI.setValueState(sap.ui.core.ValueState.None);	vLnmhgI = oLnmhgI.getValue(); }
				oFnmhgI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Fnmhg");	if(typeof oFnmhgI == "object") { oFnmhgI.setValueState(sap.ui.core.ValueState.None);	vFnmhgI = oFnmhgI.getValue(); }
				oLnmchI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Lnmch");	if(typeof oLnmchI == "object") { oLnmchI.setValueState(sap.ui.core.ValueState.None);	vLnmchI = oLnmchI.getValue(); }
				oFnmchI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Fnmch");	if(typeof oFnmchI == "object") { oFnmchI.setValueState(sap.ui.core.ValueState.None);	vFnmchI = oFnmchI.getValue(); }
				oRegnoI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Regno");	if(typeof oRegnoI == "object") { oRegnoI.setValueState(sap.ui.core.ValueState.None);	vRegnoI = oRegnoI.getValue(); }
				break;
			case "28":
				oGbdatD = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Gbdat");	if(typeof oGbdatD == "object") { oGbdatD.setValueState(sap.ui.core.ValueState.None);	vGbdatD = oGbdatD.getValue(); }
				oKonfeL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Konfe");	if(typeof oKonfeL == "object") { oKonfeL.removeStyleClass("L2PSelectInvalidBorder");	vKonfeL = oKonfeL.getSelectedKey(); }
				oHukotL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Hukot");	if(typeof oHukotL == "object") { oHukotL.removeStyleClass("L2PSelectInvalidBorder");	vHukotL = oHukotL.getSelectedKey(); }
				oZzgbdtyR1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdty1");	
				oZzgbdtyR2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdty2");	
				if(typeof oZzgbdtyR1 == "object") { 
					oZzgbdtyR1.setValueState(sap.ui.core.ValueState.None);		oZzgbdtyR1.setValueState(sap.ui.core.ValueState.None);
					if(oZzgbdtyR1.getSelected()) vZzgbdtyR = "1";
					else if(oZzgbdtyR2.getSelected()) vZzgbdtyR = "2";
					else vZzgbdtyR = "";
				}
				oZzlocnmI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzlocnm");	if(typeof oZzlocnmI == "object") { oZzlocnmI.setValueState(sap.ui.core.ValueState.None);	vZzlocnmI = oZzlocnmI.getValue(); }
				oKornmI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Kornm");	if(typeof oKornmI == "object") { oKornmI.setValueState(sap.ui.core.ValueState.None);	vKornmI = oKornmI.getValue(); }
				oName2I = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Name2");	if(typeof oName2I == "object") { oName2I.setValueState(sap.ui.core.ValueState.None);	vName2I = oName2I.getValue(); }
				oPeridI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Perid");	if(typeof oPeridI == "object") { oPeridI.setValueState(sap.ui.core.ValueState.None);	vPeridI = oPeridI.getValue(); }
				oHsnmrI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Hsnmr");	if(typeof oHsnmrI == "object") { oHsnmrI.setValueState(sap.ui.core.ValueState.None);	vHsnmrI = oHsnmrI.getValue(); }
				break;
			case "40":
				oGbdatD = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Gbdat");	if(typeof oGbdatD == "object") { oGbdatD.setValueState(sap.ui.core.ValueState.None);	vGbdatD = oGbdatD.getValue(); }
				oKonfeL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Konfe");	if(typeof oKonfeL == "object") { oKonfeL.removeStyleClass("L2PSelectInvalidBorder");	vKonfeL = oKonfeL.getSelectedKey(); }
				oInitsI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Inits");	if(typeof oInitsI == "object") { oInitsI.setValueState(sap.ui.core.ValueState.None);	vInitsI = oInitsI.getValue(); }
				oMidnmI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Midnm");	if(typeof oMidnmI == "object") { oMidnmI.setValueState(sap.ui.core.ValueState.None);	vMidnmI = oMidnmI.getValue(); }
				oPannoI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Panno");	if(typeof oPannoI == "object") { oPannoI.setValueState(sap.ui.core.ValueState.None);	vPannoI = oPannoI.getValue(); }
				oZzfathnI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzfathn");	if(typeof oZzfathnI == "object") { oZzfathnI.setValueState(sap.ui.core.ValueState.None);	vZzfathnI = oZzfathnI.getValue(); }
				oName2I = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Name2");	if(typeof oName2I == "object") { oName2I.setValueState(sap.ui.core.ValueState.None);	vName2I = oName2I.getValue(); }
				oUannoI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Uanno");	if(typeof oUannoI == "object") { oUannoI.setValueState(sap.ui.core.ValueState.None);	vUannoI = oUannoI.getValue(); }
				break;
			case "VN":
				oGbdatD = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Gbdat");	if(typeof oGbdatD == "object") { oGbdatD.setValueState(sap.ui.core.ValueState.None);	vGbdatD = oGbdatD.getValue(); }
				oZzgbdtyR1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdty1");	
				oZzgbdtyR2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdty2");	
				if(typeof oZzgbdtyR1 == "object") { 
					oZzgbdtyR1.setValueState(sap.ui.core.ValueState.None);		oZzgbdtyR1.setValueState(sap.ui.core.ValueState.None);
					if(oZzgbdtyR1.getSelected()) vZzgbdtyR = "1";
					else if(oZzgbdtyR2.getSelected()) vZzgbdtyR = "2";
					else vZzgbdtyR = "";
				}
				oCtznoI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Ctzno");	if(typeof oCtznoI == "object") { oCtznoI.setValueState(sap.ui.core.ValueState.None);	vCtznoI = oCtznoI.getValue(); }
				oName2I = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Name2");	if(typeof oName2I == "object") { oName2I.setValueState(sap.ui.core.ValueState.None);	vName2I = oName2I.getValue(); }
				break;
		}
		
		switch(oController._vMolga) {
			case "41":
				if(oController.onCheckSub01Validation(oController, oLnmhgI, null, vLnmhgI, "I", "MSG_INPUT_LNMHG")) return false;          // 성 (한글)
				if(oController.onCheckSub01Validation(oController, oFnmhgI, null, vFnmhgI, "I", "MSG_INPUT_FNMHG")) return false;          // 이름 (한글)
				if(oController.onCheckSub01Validation(oController, oNachnI, null, vNachnI, "I", "MSG_INPUT_NACHN")) return false;          // 성
				if(oController.onCheckSub01Validation(oController, oVornaI, null, vVornaI, "I", "MSG_INPUT_VORNA")) return false;          // 이름
				if(oController.onCheckSub01Validation(oController, oLnmchI, null, vLnmchI, "I", "MSG_INPUT_LNMCH")) return false;          // 성 (중국어)
				if(oController.onCheckSub01Validation(oController, oFnmchI, null, vFnmchI, "I", "MSG_INPUT_FNMCH")) return false;          // 이름 (중국어)
				if(oController.onCheckSub01Validation(oController, oRegnoI, null, vRegnoI, "I", "MSG_INPUT_REGNO")) return false;          // 주민번호
				if(oController.onCheckSub01Validation(oController, oGeschR1, oGeschR2, vGeschR, "R", "MSG_INPUT_GESCH")) return false;          // 성별
				if(oController.onCheckSub01Validation(oController, oNatioL, null, vNatioL, "I", "MSG_INPUT_NATIO")) return false;          // 국적
				if(oController.onCheckSub01Validation(oController, oFamstL, null, vFamstL, "L", "MSG_INPUT_FAMST")) return false;          // 결혼 여부
				if(oController.onCheckSub01Validation(oController, oZzgbdatD, null, vZzgbdatD, "D", "MSG_INPUT_ZZGBDAT")) return false;          // 생일
				if(oController.onCheckSub01Validation(oController, oZzgbdtyR1, oZzgbdtyR2, vZzgbdtyR, "R", "MSG_INPUT_ZZGBDTY")) return false;          // 생일구분
				if(oController.onCheckSub01Validation(oController, oHndnoI, null, vHndnoI, "I", "MSG_INPUT_HNDNO")) return false;          // 휴대폰번호
				if(oController.onCheckSub01Validation(oController, oLand1L, null, vLand1L, "I", "MSG_INPUT_LAND1")) return false;          // 주소/국가
				if(oController.onCheckSub01Validation(oController, oPstlzI, null, vPstlzI, "I", "MSG_INPUT_PSTLZ")) return false;          // 우편번호/시
				if(oController.onCheckSub01Validation(oController, oStateL, null, vStateL, "L", "MSG_INPUT_STATE_41")) return false;          // 지역
				if(oController.onCheckSub01Validation(oController, oOrt01I, null, vOrt01I, "I", "MSG_INPUT_ORT01_41")) return false;          // 주소1
				if(oController.onCheckSub01Validation(oController, oOrt02I, null, vOrt02I, "I", "MSG_INPUT_ORT02_41")) return false;          // 주소2
				if(oController.onCheckSub01Validation(oController, oStrasI, null, vStrasI, "I", "MSG_INPUT_STRAS_41")) return false;          // 상세 주소/번지
				break;
			case "28":
				if(oController.onCheckSub01Validation(oController, oZzlocnmI, null, vZzlocnmI, "I", "MSG_INPUT_ZZLOCNM")) return false;          // 중국어 성명
				if(oController.onCheckSub01Validation(oController, oKornmI, null, vKornmI, "I", "MSG_INPUT_KORNM")) return false;          // 한글성명
				if(oController.onCheckSub01Validation(oController, oNachnI, null, vNachnI, "I", "MSG_INPUT_NACHN")) return false;          // 성
				if(oController.onCheckSub01Validation(oController, oVornaI, null, vVornaI, "I", "MSG_INPUT_VORNA")) return false;          // 이름
				if(oController.onCheckSub01Validation(oController, oGeschR1, oGeschR2, vGeschR, "R", "MSG_INPUT_GESCH")) return false;          // 성별
				if(oController.onCheckSub01Validation(oController, oHukotL, null, vHukotL, "L", "MSG_INPUT_HUKOT")) return false;          // 호구
				if(oController.onCheckSub01Validation(oController, oNatioL, null, vNatioL, "L", "MSG_INPUT_NATIO")) return false;          // 국적
				if(oController.onCheckSub01Validation(oController, oGbdatD, null, vGbdatD, "D", "MSG_INPUT_GBDAT")) return false;          // 생년월일
				if(oController.onCheckSub01Validation(oController, oZzgbdtyR1, oZzgbdtyR2, null, vZzgbdtyR, "R", "MSG_INPUT_ZZGBDTY")) return false;          // 생일구분
				if(oController.onCheckSub01Validation(oController, oZzgbdatD, null, vZzgbdatD, "D", "MSG_INPUT_ZZGBDAT")) return false;          // 생일
				if(oController.onCheckSub01Validation(oController, oHndnoI, null, vHndnoI, "I", "MSG_INPUT_HNDNO")) return false;          // 휴대폰번호
				if(oController.onCheckSub01Validation(oController, oFamstL, null, vFamstL, "L", "MSG_INPUT_FAMST")) return false;          // 결혼 여부
				if(oController.onCheckSub01Validation(oController, oLand1L, null, vLand1L, "I", "MSG_INPUT_LAND1")) return false;          // 주소/국가
				if(oController.onCheckSub01Validation(oController, oPstlzI, null, vPstlzI, "I", "MSG_INPUT_PSTLZ")) return false;          // 우편번호/시
				if(oController.onCheckSub01Validation(oController, oStateL, null, vStateL, "L", "MSG_INPUT_STATE_28")) return false;          // 지역
				if(oController.onCheckSub01Validation(oController, oOrt01I, null, vOrt01I, "I", "MSG_INPUT_ORT01_28")) return false;          // 주소1
				if(oController.onCheckSub01Validation(oController, oOrt02I, null, vOrt02I, "I", "MSG_INPUT_ORT02_28")) return false;          // 주소2
				if(oController.onCheckSub01Validation(oController, oStrasI, vStrasI, "I", "MSG_INPUT_STRAS_40")) return false;          // 상세 주소/번지
				if(oController.onCheckSub01Validation(oController, oHsnmrI, vHsnmrI, "I", "MSG_INPUT_HSNMR")) return false;          // 번지
				break;
			case "40":
				if(oController.onCheckSub01Validation(oController, oVornaI, null, vVornaI, "I", "MSG_INPUT_VORNA")) return false;          // 이름
				if(oController.onCheckSub01Validation(oController, oNachnI, null, vNachnI, "I", "MSG_INPUT_NACHN")) return false;          // 성
				if(oController.onCheckSub01Validation(oController, oPannoI, null, vPannoI, "I", "MSG_INPUT_PANNO")) return false;          // PAN No.
				if(oController.onCheckSub01Validation(oController, oGbdatD, null, vGbdatD, "D", "MSG_INPUT_GBDAT")) return false;          // 생일
				if(oController.onCheckSub01Validation(oController, oGeschR1, oGeschR2, vGeschR, "R", "MSG_INPUT_GESCH")) return false;          // 성별
				if(oController.onCheckSub01Validation(oController, oZzfathnI, null, vZzfathnI, "I", "MSG_INPUT_ZZFATHN")) return false;          // 아버지 성명
				if(oController.onCheckSub01Validation(oController, oFamstL, null, vFamstL, "L", "MSG_INPUT_FAMST")) return false;          // 결혼 여부
				if(oController.onCheckSub01Validation(oController, oNatioL, null, vNatioL, "L", "MSG_INPUT_NATIO")) return false;          // 국적
				if(oController.onCheckSub01Validation(oController, oHndnoI, null, vHndnoI, "I", "MSG_INPUT_HNDNO")) return false;          // 휴대폰번호
				if(oController.onCheckSub01Validation(oController, oLand1L, null, vLand1L, "I", "MSG_INPUT_LAND1")) return false;          // 주소/국가
				if(oController.onCheckSub01Validation(oController, oPstlzI, null, vPstlzI, "I", "MSG_INPUT_PSTLZ")) return false;          // 우편번호/시
				if(oController.onCheckSub01Validation(oController, oStrasI, null, vStrasI, "I", "MSG_INPUT_STRAS_40")) return false;          // 상세 주소/번지
				if(oController.onCheckSub01Validation(oController, oOrt02I, null, vOrt02I, "I", "MSG_INPUT_ORT02_40")) return false;          // 주소2
				if(oController.onCheckSub01Validation(oController, oOrt01I, null, vOrt01I, "I", "MSG_INPUT_ORT01_40")) return false;          // 주소1
				if(oController.onCheckSub01Validation(oController, oStateL, null, vStateL, "L", "MSG_INPUT_STATE_40")) return false;          // 지역
				break;
			case "VN":
				if(oController.onCheckSub01Validation(oController, oVornaI, null, vVornaI, "I", "MSG_INPUT_VORNA")) return false;          // 이름
				if(oController.onCheckSub01Validation(oController, oNachnI, null, vNachnI, "I", "MSG_INPUT_NACHN")) return false;          // 성
				if(oController.onCheckSub01Validation(oController, oGeschR1, oGeschR2, vGeschR, "R", "MSG_INPUT_GESCH")) return false;     // 성별
				if(oController.onCheckSub01Validation(oController, oCtznoI, null, vCtznoI, "I", "MSG_INPUT_CTZNO")) return false;          // Citizen No.
				if(oController.onCheckSub01Validation(oController, oNatioL, null, vNatioL, "L", "MSG_INPUT_NATIO")) return false;          // 국적
				if(oController.onCheckSub01Validation(oController, oHndnoI, null, vHndnoI, "I", "MSG_INPUT_HNDNO")) return false;          // 휴대폰번호
				if(oController.onCheckSub01Validation(oController, oGbdatD, null, vGbdatD, "D", "MSG_INPUT_GBDAT")) return false;          // 생년월일
				if(oController.onCheckSub01Validation(oController, oFamstL, null, vFamstL, "L", "MSG_INPUT_FAMST")) return false;          // 결혼 여부
				if(oController.onCheckSub01Validation(oController, oLand1L, null, vLand1L, "I", "MSG_INPUT_LAND1")) return false;          // 주소/국가
				if(oController.onCheckSub01Validation(oController, oPstlzI, null, vPstlzI, "I", "MSG_INPUT_PSTLZ")) return false;          // 우편번호/시
				if(oController.onCheckSub01Validation(oController, oStrasI, null, vStrasI, "I", "MSG_INPUT_STRAS_40")) return false;          // 상세 주소/번지
				if(oController.onCheckSub01Validation(oController, oOrt01I, null, vOrt01I, "I", "MSG_INPUT_ORT02_VN")) return false;          // 주소2
				if(oController.onCheckSub01Validation(oController, oStateL, null, vStateL, "L", "MSG_INPUT_STATE_40")) return false;          // 지역
				break;
		}
		
		var vOneData = {
				Docno : oController._vDocno,
				Recno : oController._vRecno,
				VoltId : oController._vVoltId,
				Persa : oController._vPersa,
				Reqno : oController._vReqno,
				Actda : oController._vActda == "" || oController._vActda == "0NaN-NaN-NaN" ? null : "\/Date(" + common.Common.getTime(oController._vActda) + ")\/",
				Zzgbdat : vZzgbdatD == "" || vZzgbdatD == "0NaN-NaN-NaN" ? null : "\/Date(" + common.Common.getTime(vZzgbdatD)+ ")\/",
				Gbdat : vGbdatD == "" || vGbdatD == "0NaN-NaN-NaN" ? null : "\/Date(" + common.Common.getTime(vGbdatD) + ")\/",
				Famdt : vFamdtD == "" || vFamdtD == "0NaN-NaN-NaN" ? null : "\/Date(" + common.Common.getTime(vFamdtD) + ")\/",		
				Konfe : vKonfeL == "0000" ? "" : vKonfeL,
				Hukot : vHukotL == "0000" ? "" : vHukotL,
				Natio : vNatioL == "0000" ? "" : vNatioL,
				Sprsl : vSprslL == "0000" ? "" : vSprslL,
				State : vStateL == "0000" ? "" : vStateL,
				Gesch : vGeschR,
				Zzgbdty : vZzgbdtyR,
				Famst : vFamstL == "0000" ? "" : vFamstL,
				Nachn : vNachnI,
				Vorna : vVornaI,
				Lnmhg : vLnmhgI,
				Fnmhg : vFnmhgI,
				Lnmch : vLnmchI,
				Fnmch : vFnmchI,
				Regno : vRegnoI,
				Hndno : vHndnoI,
				Telno : vTelnoI,
				Pstlz : vPstlzI,
				Ort01 : vOrt01I,
				Ort02 : vOrt02I,
				Inits : vInitsI,
				Midnm : vMidnmI,
				Panno : vPannoI,
				Ctzno : vCtznoI,
				Zzfathn : vZzfathnI,
				Stras : vStrasI,
				Zzlocnm : vZzlocnmI,
				Kornm : vKornmI,
				Name2 : vName2I,
				Land1 : vLand1L,
				Perid : vPeridI,
				Uanno : vUannoI,
				Hsnmr : vHsnmrI
		};
		
		var process_result = false;
		var oPath = "/RecruitingSubjectsSet";
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		switch(oController._vActionType) {
			case "C" :
				oModel.create(
						oPath, 
						vOneData, 
						null,
					    function (oData, response) {
							if(oData) {
								oController._vVoltId = oData.VoltId;
							}
							process_result = true;
							oController._vActionType = "M";
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
				break;
			case "M" :
				oPath += "(Docno='" + vOneData.Docno + "',"
		                + "VoltId='" +  vOneData.VoltId + "')",
				oModel.update(
						oPath, 
						vOneData, 
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
			if(fVal != "BACK") {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
					title: oBundleText.getText("MSG_TITLE_GUIDE"),
					onClose : function() {
						oController.setSub01();
						oController.setTelField(oController);
					}
				});
			}
			return true;
		} else {
			return false;
		}
	},
	
	onCheckSub01Validation : function(oController, oControll1, oControll2, vValue, vType, vMSGId) {
		switch(vType) {
			case "I" :
				if(vValue == "") {
					oControll1.setValueState(sap.ui.core.ValueState.Error);
					sap.m.MessageBox.alert(oBundleText.getText(vMSGId));
					return true;
				}
				break;
			case "L" :
				if(vValue == "0000" || vValue == "") {
					oControll1.addStyleClass("L2PSelectInvalidBorder");
					sap.m.MessageBox.alert(oBundleText.getText(vMSGId));
					return true;
				}
				break;
			case "D" :
				if(vValue == null || vValue == "") {
					oControll1.setValueState(sap.ui.core.ValueState.Error);
					sap.m.MessageBox.alert(oBundleText.getText(vMSGId));
					return true;
				}
				break;
			case "R" :
				if(vValue == "") {
					oControll1.setValueState(sap.ui.core.ValueState.Error);
					oControll2.setValueState(sap.ui.core.ValueState.Error);
					sap.m.MessageBox.alert(oBundleText.getText(vMSGId));
					return true;
				}
		}
		return false;
	},
/////////////////////////////////////////////////////////////////////////////////////////////
	
/////////////////////////////////////////////////////////////////////////////////////////////
// Sub02 학력사항을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////		
//  학력사항을 가지고 온다.
	reloadSub02 : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_TABLE");
		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_COLUMNLIST");
		
		var oFilters = [];	
	    oFilters.push(new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno));
	    oFilters.push(new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, oController._vVoltId));
	    
		oTable.bindItems("/RecruitingSubjectsEducationSet", oColumnList, null, oFilters);
		
		oTable.attachUpdateFinished(function() {
			oController._vCntSub02 = oTable.getItems().length;
			oController.setCountTabBar(oController, "Sub02");
			
			var oAnzklList = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_List_Anzkl");
			var oAnzklColumn = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Column_Anzkl");
			if(oController._vMolga == "41") {
				oAnzklList.setVisible(false);
				oAnzklColumn.setVisible(false);
			} else {
				oAnzklList.setVisible(true);
				oAnzklColumn.setVisible(true);
			}
		});
	},
	
//  학력사항 입력화면 Setting.
	setSub02 : function(oContext) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Begda");
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Endda");
		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Slart");
		var oSlabs = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Slabs");
		var oSland = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sland");
		var oSchcd = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Schcd");
		var oAnzkl = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Anzkl");
		var oSltp1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sltp1");
		var oSltp2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sltp2");
		var oZzfmark = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Zzfmark");
		var oZzacksl = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Zzacksl");
		
		// 값 초기화
		oBegda.setValue("");
		oBegda.removeAllCustomData();
		oBegda.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : ""}));
		oEndda.setValue("");
		oSlart.setSelectedKey("0000");
		oSlabs.setSelectedKey("0000");
		oSland.setValue("");
		oSland.removeAllCustomData();
		oSland.addCustomData(new sap.ui.core.CustomData({key : "Sland", value : ""}));
		oSchcd.setValue("");
		oSchcd.removeAllCustomData();
    	oSchcd.addCustomData(new sap.ui.core.CustomData({key : "Schcd", value : ""}));
		oAnzkl.setSelectedKey("0000");
		oController.onClearFaartFields(oController);
		oZzfmark.setSelected(false);
		oZzacksl.setSelected(false);
		
		// 쓰기 초기화
		oBegda.setEnabled(!oController._DISABLED);
		oEndda.setEnabled(!oController._DISABLED);
		oSlart.setEnabled(!oController._DISABLED);
		oSlabs.setEnabled(!oController._DISABLED);
		oSland.setEnabled(!oController._DISABLED);
		oSchcd.setEnabled(!oController._DISABLED);
		oAnzkl.setEnabled(!oController._DISABLED);
		oSltp1.setEnabled(!oController._DISABLED);
		oSltp2.setEnabled(!oController._DISABLED);
		oZzfmark.setEnabled(!oController._DISABLED);
		oZzacksl.setEnabled(!oController._DISABLED);
		
		if(oContext != null) {
			//Global 일자 관련하여 소스 수정함. 2015.10.19
			oBegda.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(oContext[0].getProperty("Begda"))))));
			//수정완료
			oBegda.removeAllCustomData();
			oBegda.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : oContext[0].getProperty("Seqnr")}));
			
			//Global 일자 관련하여 소스 수정함. 2015.10.19
			oEndda.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(oContext[0].getProperty("Endda"))))));
			//수정완료
			oSlart.setSelectedKey(oContext[0].getProperty("Slart"));
			oController.setSLABS(oContext[0].getProperty("Slabs"));
			oSland.setValue(oContext[0].getProperty("Landx"));
			oSland.removeAllCustomData();
			oSland.addCustomData(new sap.ui.core.CustomData({key : "Sland", value : oContext[0].getProperty("Sland")}));
			oSchcd.setValue(oContext[0].getProperty("Insti"));
			oSchcd.removeAllCustomData();
	    	oSchcd.addCustomData(new sap.ui.core.CustomData({key : "Schcd", value : oContext[0].getProperty("Schcd")}));
			oAnzkl.setSelectedKey(oContext[0].getProperty("Anzkl"));
			oZzfmark.setSelected(oContext[0].getProperty("Zzfmark") == "X" ? true : false);
			oZzacksl.setSelected(oContext[0].getProperty("Zzacksl") == "X" ? true : false);
			
			if(oSlart.getSelectedKey() == "Z4" || oSlart.getSelectedKey() == "Z5") {
				oSltp1.setEnabled(!oController._DISABLED);
				oSltp2.setEnabled(!oController._DISABLED);
				
				oSltp1.setValue(oContext[0].getProperty("Ftxt1"));
				oSltp1.removeAllCustomData();
				oSltp1.addCustomData(new sap.ui.core.CustomData({key : "Key", value : oContext[0].getProperty("Sltp1")}));
				oSltp2.setValue(oContext[0].getProperty("Ftxt2"));
				oSltp2.removeAllCustomData();
				oSltp2.addCustomData(new sap.ui.core.CustomData({key : "Key", value : oContext[0].getProperty("Sltp2")}));
			} else {
				oSltp1.setEnabled(false);
				oSltp2.setEnabled(false);
			}
		}
		
		var oAnzklLabelField = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Anzkl_LabelField");
		var oAnzklDataField = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Anzkl_DataField");
		if(oController._vMolga == "41") {
			oAnzklLabelField.addStyleClass("L2PDisplayNone");
			oAnzklDataField.addStyleClass("L2PDisplayNone");
			oAnzkl.setSelectedKey("0000");
		} else {
			oAnzklLabelField.removeStyleClass("L2PDisplayNone");
			oAnzklDataField.removeStyleClass("L2PDisplayNone");
		}
	},

//	학력사항 저장  
	saveSub02 : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Begda");
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Endda");
		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Slart");
		var oSlabs = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Slabs");
		var oSland = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sland");
		var oSchcd = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Schcd");
		var oAnzkl = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Anzkl");
		var oSltp1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sltp1");
		var oSltp2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sltp2");
		var oZzfmark = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Zzfmark");
		var oZzacksl = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Zzacksl");
		
		oBegda.setValueState(sap.ui.core.ValueState.None);
		oEndda.setValueState(sap.ui.core.ValueState.None);
		oSlart.removeStyleClass("L2PSelectInvalidBorder");
		oSlabs.removeStyleClass("L2PSelectInvalidBorder");
		oSland.setValueState(sap.ui.core.ValueState.None);
		oSchcd.setValueState(sap.ui.core.ValueState.None);
		oAnzkl.removeStyleClass("L2PSelectInvalidBorder");
		oSltp1.removeStyleClass("L2PSelectInvalidBorder");
		
		var vOneData = {
				Docno : oController._vDocno,
				Recno : oController._vRecno,
				VoltId : oController._vVoltId,
				Seqnr : oBegda.getCustomData()[0].getValue("Seqnr"),
				Begda : oBegda.getValue() == "" ? null : "\/Date(" + common.Common.getTime(oBegda.getValue()) + ")\/",
				Endda : oEndda.getValue() == "" ? null : "\/Date(" + common.Common.getTime(oEndda.getValue()) + ")\/",
				Slart : oSlart.getSelectedKey() == "0000" ? "" : oSlart.getSelectedKey(),
				Slabs : oSlabs.getSelectedKey() == "00" ? "" : oSlabs.getSelectedKey(),
				Sland : oSland.getCustomData()[0].getValue(),
				Schcd : oSchcd.getCustomData()[0].getValue("Schcd"),
				Insti : oSchcd.getValue(),
				Sltp1 : oSltp1.getCustomData()[0].getValue(),
				Sltp2 : oSltp2.getCustomData()[0].getValue(),
				Zzfmark : oZzfmark.getSelected() ? "X" : "",
				Zzacksl : oZzacksl.getSelected() ? "X" : ""
		};
		
		// 입학일자(Begda)
		if(vOneData.Begda == null) {
			oBegda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_EBEGDA"));
			return;
		}
		
		// 졸업일자(Endda)
		if(vOneData.Endda == null) {
			oEndda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_EENDDA"));
			return;
		}
		
		if(new Date(oBegda.getValue()) > new Date(oEndda.getValue())) {
			oBegda.setValueState(sap.ui.core.ValueState.Error);
			oEndda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_EBEGEND"));
			return;
		}
		
		// 교육기관(Slart)
		if(vOneData.Slart == "") {
			oSlart.addStyleClass("L2PSelectInvalidBorder");
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_SLART"));
			return;
		}
		
		// 학위(Slabs)
		if(vOneData.Slabs == "") {
			oSlabs.addStyleClass("L2PSelectInvalidBorder");
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_SLABS"));
			return;
		}
		
		// 학교(Schcd)
		if(vOneData.Insti == "") {
			oSchcd.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_SCHCDNM"));
			return;
		}

		// 국가(Sland)
		if(vOneData.Sland == "") {
			oSland.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_SLAND"));
			return;
		}
		
		// 기간(년)(Anzkl)
		if(oController._vMolga != "41") {
			vOneData.Anzkl = oAnzkl.getSelectedKey() == "0000" ? "" : oAnzkl.getSelectedKey();
	
			if(vOneData.Anzkl == "") {
				oAnzkl.addStyleClass("L2PSelectInvalidBorder");
				sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_ANZKL"));
				return;
			}
		}
		
		var process_result = false;
		var oPath = "/RecruitingSubjectsEducationSet";
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		switch(oController.subAction) {
			case "C" :
				oModel.create(
						oPath, 
						vOneData, 
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
				break;
			case "M" :
				oPath += "(Docno='" + vOneData.Docno + "',"
		                + "VoltId='" +  vOneData.VoltId + "',"
		                + "Seqnr='" +  vOneData.Seqnr + "'"
		                + ")";

				oModel.update(
						oPath, 
						vOneData, 
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
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
				title: oBundleText.getText("MSG_TITLE_GUIDE"),
				onClose : function() {
					oController.reloadSub02();
					oController.onClose();
				}
			});
		}
	},
/////////////////////////////////////////////////////////////////////////////////////////////
	
/////////////////////////////////////////////////////////////////////////////////////////////
// Sub03 경력사항을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////		
//  경력사항을 가지고 온다.
	reloadSub03 : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_TABLE");
		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_COLUMNLIST");
		
		var oFilters = [];	
	    oFilters.push(new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno));
	    oFilters.push(new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, oController._vVoltId));
	    
		oTable.bindItems("/RecruitingSubjectsCareerSet", oColumnList, null, oFilters);
		
		oTable.attachUpdateFinished(function() {
			oController._vCntSub03 = oTable.getItems().length;
			oController.setCountTabBar(oController, "Sub03");
		});
	},
	
//  경력사항 입력화면 Setting.
	setSub03 : function(oContext) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Begda");
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Endda");
		var oLand1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Land1");
		var oZzlndep = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Zzlndep");
		var oArbgb = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Arbgb");
		var oZzjbttx = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Zzjbttx");
		var oZzstell = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Zzstell");
		
		// 값 초기화
		oBegda.setValue("");
		oBegda.removeAllCustomData();
		oBegda.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : ""}));
		oEndda.setValue("");
		oLand1.setValue("");
		oLand1.removeAllCustomData();
		oLand1.addCustomData(new sap.ui.core.CustomData({key : "Land1", value : ""}));
		oZzlndep.setValue("");
		oArbgb.setValue("");
		oZzjbttx.setValue("");
		oZzstell.setValue("");
		oZzstell.removeAllCustomData();
		oZzstell.addCustomData(new sap.ui.core.CustomData({key : "Zzstell", value : ""}));

		// 쓰기 초기화
		oBegda.setEnabled(!oController._DISABLED);
		oEndda.setEnabled(!oController._DISABLED);
		oLand1.setEnabled(!oController._DISABLED);
		oZzlndep.setEnabled(!oController._DISABLED);
		oArbgb.setEnabled(!oController._DISABLED);
		oZzjbttx.setEnabled(!oController._DISABLED);
		oZzstell.setEnabled(!oController._DISABLED);
		
		if(oContext != null) {
			//Global 일자 관련하여 소스 수정함. 2015.10.19
			oBegda.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(oContext[0].getProperty("Begda"))))));
			oEndda.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(oContext[0].getProperty("Endda"))))));
			//수정완료
			//oBegda.setValue(dateFormat.format(new Date(oContext[0].getProperty("Begda"))));
			oBegda.removeAllCustomData();
			oBegda.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : oContext[0].getProperty("Seqnr")}));
			//oEndda.setValue(dateFormat.format(new Date(oContext[0].getProperty("Endda"))));
			oLand1.setValue(oContext[0].getProperty("Landx"));
			oLand1.removeAllCustomData();
			oLand1.addCustomData(new sap.ui.core.CustomData({key : "Land1", value : oContext[0].getProperty("Land1")}));
			oZzlndep.setValue(oContext[0].getProperty("Zzlndep"));
			oArbgb.setValue(oContext[0].getProperty("Arbgb"));
			oZzjbttx.setValue(oContext[0].getProperty("Zzjbttx"));
			oZzstell.setValue(oContext[0].getProperty("Stltx"));
			oZzstell.removeAllCustomData();
			oZzstell.addCustomData(new sap.ui.core.CustomData({key : "Zzstell", value : oContext[0].getProperty("Zzstell")}));
		}
	},

//	경력사항 저장  
	saveSub03 : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Begda");
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Endda");
		var oLand1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Land1");
		var oZzlndep = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Zzlndep");
		var oArbgb = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Arbgb");
		var oZzjbttx = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Zzjbttx");
		var oZzstell = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Zzstell");
		
		oBegda.setValueState(sap.ui.core.ValueState.None);
		oEndda.setValueState(sap.ui.core.ValueState.None);
		oLand1.setValueState(sap.ui.core.ValueState.None);
		oZzlndep.setValueState(sap.ui.core.ValueState.None);
		oArbgb.setValueState(sap.ui.core.ValueState.None);
		oZzjbttx.setValueState(sap.ui.core.ValueState.None);
		oZzstell.setValueState(sap.ui.core.ValueState.None);
		
		var vOneData = {
				Docno : oController._vDocno,
				Recno : oController._vRecno,
				VoltId : oController._vVoltId,
				Seqnr : oBegda.getCustomData()[0].getValue("Seqnr"),
				Begda : oBegda.getValue() == "" ? null : "\/Date(" + common.Common.getTime(oBegda.getValue()) + ")\/",
				Endda : oEndda.getValue() == "" ? null : "\/Date(" + common.Common.getTime(oEndda.getValue()) + ")\/",
				Land1 : oLand1.getCustomData()[0].getValue(),
				Zzlndep	: oZzlndep.getValue(),	
				Arbgb : oArbgb.getValue(),
				Zzjbttx	: oZzjbttx.getValue(),
				Zzstell : oZzstell.getCustomData()[0].getValue("Zzstell")
		};
		
		//  입사일자(Begda)
		if(vOneData.Begda == null) {
			oBegda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_CBEGDA"));
			return;
		}
		
		// 퇴사일자(Endda)
		if(vOneData.Endda == null) {
			oEndda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_CENDDA"));
			return;
		}
		
		if(new Date(oBegda.getValue()) > new Date(oEndda.getValue())) {
			oBegda.setValueState(sap.ui.core.ValueState.Error);
			oEndda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_CBEGEND"));
			return;
		}
		
		// 회사(Arbgb)
		if(vOneData.Arbgb == "") {
			oArbgb.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_ARBGB"));
			return;
		}
		
		// 국가(Land1)
		if(vOneData.Land1 == "") {
			oLand1.addStyleClass("L2PSelectInvalidBorder");
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_SLAND"));
			return;
		}
		
		var process_result = false;
		var oPath = "/RecruitingSubjectsCareerSet";
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		switch(oController.subAction) {
			case "C" :
				oModel.create(
						oPath, 
						vOneData, 
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
				break;
			case "M" :
				oPath += "(Docno='" + vOneData.Docno + "',"
		                + "VoltId='" +  vOneData.VoltId + "',"
		                + "Seqnr='" +  vOneData.Seqnr + "',"
		                + ")";

				oModel.update(
						oPath, 
						vOneData, 
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
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
				title: oBundleText.getText("MSG_TITLE_GUIDE"),
				onClose : function() {
					oController.reloadSub03();
					oController.onClose();
				}
			});
		}
	},
/////////////////////////////////////////////////////////////////////////////////////////////
	
/////////////////////////////////////////////////////////////////////////////////////////////
// Sub04 어학사항을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////		
//  어학사항을 가지고 온다.
	reloadSub04 : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_TABLE");
		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_COLUMNLIST");
		
		var oFilters = [];	
	    oFilters.push(new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno));
	    oFilters.push(new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, oController._vVoltId));
	    
		oTable.bindItems("/RecruitingSubjectsLanguageSet", oColumnList, null, oFilters);
		
		oTable.attachUpdateFinished(function() {
			oController._vCntSub04 = oTable.getItems().length;
			oController.setCountTabBar(oController, "Sub04");
		});
	},
	
//  어학사항 입력화면 Setting.
	setSub04 : function(oContext) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oQuali = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Quali");
		var oExmty = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Exmty");
		var oEamdt = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Eamdt");
		var oExmsc = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Exmsc");
		var oEamgr = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Eamgr");
		var oExmto = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Exmto");
		
		// 값 초기화
		oQuali.setSelectedKey("0000");
		oQuali.removeAllCustomData();
		oQuali.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : ""}));
		oExmty.setSelectedKey("");
		oEamdt.setValue("");
		oExmsc.setValue("");
		oEamgr.setSelectedKey("0000");
		oExmto.setValue("");
		
		// 쓰기 초기화
		oQuali.setEnabled(!oController._DISABLED);
		oExmty.setEnabled(!oController._DISABLED);
		oEamdt.setEnabled(!oController._DISABLED);
		oExmsc.setEnabled(!oController._DISABLED);
		oEamgr.setEnabled(!oController._DISABLED);
		oExmto.setEnabled(!oController._DISABLED);
		
		if(oContext != null) {
			oQuali.setSelectedKey(oContext[0].getProperty("Quali"));
			oQuali.removeAllCustomData();
			oQuali.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : oContext[0].getProperty("Seqnr")}));
			oController.setEXMTY(oContext[0].getProperty("Exmty"));
			//Global 일자 관련하여 소스 수정함. 2015.10.19
			oEamdt.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(oContext[0].getProperty("Eamdt"))))));
			//수정완료
			//oEamdt.setValue(dateFormat.format(new Date(oContext[0].getProperty("Eamdt"))));
			oExmsc.setValue(oContext[0].getProperty("Exmsc").trim() == "0" ? "" : oContext[0].getProperty("Exmsc").trim());
			oController.setEAMGR(oContext[0].getProperty("Eamgr"));

			if(oContext[0].getProperty("Exmto") != null)
				//Global 일자 관련하여 소스 수정함. 2015.10.19
				oExmto.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(oContext[0].getProperty("Exmto"))))));
				//수정완료
				//oExmto.setValue(dateFormat.format(new Date(oContext[0].getProperty("Exmto"))));
		}
	},

//	어학사항 저장  
	saveSub04 : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oQuali = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Quali");
		var oExmty = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Exmty");
		var oEamdt = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Eamdt");
		var oExmsc = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Exmsc");
		var oEamgr = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Eamgr");
		var oExmto = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Exmto");
		
		oQuali.removeStyleClass("L2PSelectInvalidBorder");
		oExmty.removeStyleClass("L2PSelectInvalidBorder");
		oEamdt.setValueState(sap.ui.core.ValueState.None);
		oExmsc.setValueState(sap.ui.core.ValueState.None);
		oEamgr.removeStyleClass("L2PSelectInvalidBorder");
		oExmto.setValueState(sap.ui.core.ValueState.None);
		
		var vOneData = {
				Docno : oController._vDocno,
				Recno : oController._vRecno,
				VoltId : oController._vVoltId,
				Seqnr : oQuali.getCustomData()[0].getValue("Seqnr"),
				Quali : oQuali.getSelectedKey(),
				Exmty : oExmty.getSelectedKey() == "0000" ? "" : oExmty.getSelectedKey(),	
				Eamdt : oEamdt.getValue() == "" ? null : "\/Date(" + common.Common.getTime(oEamdt.getValue()) + ")\/",
				Exmsc : oExmsc.getValue() == "" || oExmsc.getValue() == "0" ? null : oExmsc.getValue(),
				Eamgr : oEamgr.getSelectedKey() == "0000" ? "" : oEamgr.getSelectedKey(),		
				Exmto : oExmto.getValue() == "" ? null : "\/Date(" + common.Common.getTime(oExmto.getValue()) + ")\/",
		};
		
		// 언어구분(Quali)
		if(vOneData.Quali == "") {
			oQuali.addStyleClass("L2PSelectInvalidBorder");
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_QUALI2"));
			return;
		}
		
		// 시험구분(Exmty)
		if(vOneData.Exmty == "") {
			oExmty.addStyleClass("L2PSelectInvalidBorder");
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_EXMTY"));
			return;
		}
		
		// 시험일(Eamdt)
		if(vOneData.Eamdt == null) {
			oEamdt.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_EAMDT"));
			return;
		}
		
		// 유효일자(oExmto)
		if(vOneData.Exmto == null) {
			oExmto.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_EXMTO"));
			return;
		}
		
		if(new Date(oEamdt.getValue()) > new Date(oExmto.getValue())) {
			oEamdt.setValueState(sap.ui.core.ValueState.Error);
			oExmto.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_EAMDATE"));
			return;
		}
		
		// 점수(Exmsc)
		if(vOneData.Exmsc == null && vOneData.Eamgr == "") {
			oExmsc.setValueState(sap.ui.core.ValueState.Error);
			oEamgr.addStyleClass("L2PSelectInvalidBorder");
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_EXMSC"));
			return;
		}
		
		var process_result = false;
		var oPath = "/RecruitingSubjectsLanguageSet";
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		switch(oController.subAction) {
			case "C" :
				oModel.create(
						oPath, 
						vOneData, 
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
				break;
			case "M" :
				oPath += "(Docno='" + vOneData.Docno + "',"
		                + "VoltId='" +  vOneData.VoltId + "',"
		                + "Seqnr='" +  vOneData.Seqnr + "')";

				oModel.update(
						oPath, 
						vOneData, 
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
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
				title: oBundleText.getText("MSG_TITLE_GUIDE"),
				onClose : function() {
					oController.reloadSub04();
					oController.onClose();
				}
			});
		}
	},
/////////////////////////////////////////////////////////////////////////////////////////////
	
/////////////////////////////////////////////////////////////////////////////////////////////
// Sub06 자격면허를 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////		
//  자격면허를 가지고 온다.
	reloadSub06 : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Sub06_TABLE");
		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_Sub06_COLUMNLIST");
		
		var oFilters = [];	
	    oFilters.push(new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno));
	    oFilters.push(new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, oController._vVoltId));
	    
		oTable.bindItems("/RecruitingSubjectsCertificationSet", oColumnList, null, oFilters);
		
		oTable.attachUpdateFinished(function() {
			oController._vCntSub06 = oTable.getItems().length;
			oController.setCountTabBar(oController, "Sub06");
		});
	},
	
//  자격면허 입력화면 Setting.
	setSub06 : function(oContext) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oCttyp = sap.ui.getCore().byId(oController.PAGEID + "_Sub06_Cttyp");
		var oCerda = sap.ui.getCore().byId(oController.PAGEID + "_Sub06_Cerda");
		var oCtend = sap.ui.getCore().byId(oController.PAGEID + "_Sub06_Ctend");
		var oCtnum = sap.ui.getCore().byId(oController.PAGEID + "_Sub06_Ctnum");
		var oIsaut = sap.ui.getCore().byId(oController.PAGEID + "_Sub06_Isaut");
		
		// 값 초기화
		oCttyp.setValue("");
		oCttyp.removeAllCustomData();
		oCttyp.addCustomData(new sap.ui.core.CustomData({key : "Cttyp", value : ""}));
		oCerda.setValue("");
		oCerda.removeAllCustomData();
		oCerda.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : ""}));
		oCtend.setValue("");
		oCtnum.setValue("");
		oIsaut.setValue("");
		
		// 쓰기 초기화
		oCttyp.setEnabled(!oController._DISABLED);
		oCerda.setEnabled(!oController._DISABLED);
		oCtend.setEnabled(!oController._DISABLED);
		oCtnum.setEnabled(!oController._DISABLED);
		oIsaut.setEnabled(!oController._DISABLED);
		
		if(oContext != null) {
			oCttyp.setValue(oContext[0].getProperty("Cttyptx"));
			oCttyp.removeAllCustomData();
			oCttyp.addCustomData(new sap.ui.core.CustomData({key : "Cttyp", value : oContext[0].getProperty("Cttyp")}));
			//Global 일자 관련하여 소스 수정함. 2015.10.19
			oCerda.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(oContext[0].getProperty("Ctbeg"))))));
			//수정완료
			//oCerda.setValue(dateFormat.format(new Date(oContext[0].getProperty("Ctbeg"))));
			oCerda.removeAllCustomData();
			oCerda.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : oContext[0].getProperty("Seqnr")}));
			if(oContext[0].getProperty("Ctend") != null)
				//Global 일자 관련하여 소스 수정함. 2015.10.19
				oCtend.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(oContext[0].getProperty("Ctend"))))));
				//수정완료
				//oCtend.setValue(dateFormat.format(new Date(oContext[0].getProperty("Ctend"))));
			oCtnum.setValue(oContext[0].getProperty("Ctnum"));
			oIsaut.setValue(oContext[0].getProperty("Isaut"));
		}
	},

//	자격면허 저장  
	saveSub06 : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oCttyp = sap.ui.getCore().byId(oController.PAGEID + "_Sub06_Cttyp");
		var oCerda = sap.ui.getCore().byId(oController.PAGEID + "_Sub06_Cerda");
		var oCtend = sap.ui.getCore().byId(oController.PAGEID + "_Sub06_Ctend");
		var oCtnum = sap.ui.getCore().byId(oController.PAGEID + "_Sub06_Ctnum");
		var oIsaut = sap.ui.getCore().byId(oController.PAGEID + "_Sub06_Isaut");
		
		oCttyp.setValueState(sap.ui.core.ValueState.None);
		oCerda.setValueState(sap.ui.core.ValueState.None);
		oCtend.setValueState(sap.ui.core.ValueState.None);
		oCtnum.setValueState(sap.ui.core.ValueState.None);
		oIsaut.setValueState(sap.ui.core.ValueState.None);
		
		var vOneData = {
				Docno : oController._vDocno,
				Recno : oController._vRecno,
				VoltId : oController._vVoltId,
				Seqnr : oCerda.getCustomData()[0].getValue("Seqnr"),
				Cttyp : oCttyp.getCustomData()[0].getValue("Cttyp"),
				Ctbeg : oCerda.getValue() == "" ? null : "\/Date(" + common.Common.getTime(oCerda.getValue()) + ")\/",
				Ctend : oCtend.getValue() == "" ? null : "\/Date(" + common.Common.getTime(oCtend.getValue()) + ")\/",
				Ctnum : oCtnum.getValue(),
				Isaut : oIsaut.getValue()
		};
		
		// 자격증유형(Cttyp)
		if(vOneData.Cttyp == "") {
			oCttyp.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_CTTYP"));
			return;
		}
		
		// 자격증번호(Ctnum)
		if(vOneData.Ctnum == "") {
			oCtnum.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_CTNUM"));
			return;
		}
		
		// 취득일(Cerda)
		if(vOneData.Ctbeg == null) {
			oCerda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_CERDA"));
			return;
		}
		
		if(vOneData.Ctend != null && new Date(oCerda.getValue()) > new Date(oCtend.getValue())){
			oCerda.setValueState(sap.ui.core.ValueState.Error);
			oCtend.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_CTDATE"));
			return;
		}
		
		var process_result = false;
		var oPath = "/RecruitingSubjectsCertificationSet";
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		switch(oController.subAction) {
			case "C" :
				oModel.create(
						oPath, 
						vOneData, 
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
				break;
			case "M" :
				oPath += "(Docno='" + vOneData.Docno + "',"
		                + "VoltId='" +  vOneData.VoltId + "',"
		                + "Seqnr='" +  vOneData.Seqnr + "'," 
		                + ")";

				oModel.update(
						oPath, 
						vOneData, 
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
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
				title: oBundleText.getText("MSG_TITLE_GUIDE"),
				onClose : function() {
					oController.reloadSub06();
					oController.onClose();
				}
			});
		}
	},
/////////////////////////////////////////////////////////////////////////////////////////////
	
/////////////////////////////////////////////////////////////////////////////////////////////
// Sub07 병역사항을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////
//  병역사항을 가지고 온다.
	readSub07 : function() {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_Sub07_Begda");
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_Sub07_Endda");
		var oSerty = sap.ui.getCore().byId(oController.PAGEID + "_Sub07_Serty");
		var oPreas = sap.ui.getCore().byId(oController.PAGEID + "_Sub07_Preas");
		var oJobcl = sap.ui.getCore().byId(oController.PAGEID + "_Sub07_Jobcl");
		var oMrank = sap.ui.getCore().byId(oController.PAGEID + "_Sub07_Mrank");
		
		// 화면 초기화
		oBegda.setValue("");
		oEndda.setValue("");
		oSerty.setSelectedKey("0000");
		oPreas.setSelectedKey("0000");
		oJobcl.setSelectedKey("0000");
		oMrank.setSelectedKey("0000");
		
		oBegda.setEnabled(!oController._DISABLED);
		oEndda.setEnabled(!oController._DISABLED);
		oSerty.setEnabled(!oController._DISABLED);
		oPreas.setEnabled(!oController._DISABLED);
		oJobcl.setEnabled(!oController._DISABLED);
		oMrank.setEnabled(!oController._DISABLED);
		
		oModel.read("/RecruitingSubjectsMilitaryServiceSet(Docno='" + oController._vDocno + "',"
														+ "VoltId='" +  oController._vVoltId + "')",
					null, 
					null, 
					false, 	
					function(oData, oResponse) {	
						if(oData) {
							//Global 일자 관련하여 소스 수정함. 2015.10.19
							if(oData.Begda != null)	oBegda.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(oData.Begda)))));
							if(oData.Endda != null) oEndda.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(oData.Endda)))));
							//수정완료
							oSerty.setSelectedKey(oData.Serty);
							oPreas.setSelectedKey(oData.Preas);
							oJobcl.setSelectedKey(oData.Jobcl);
							oMrank.setSelectedKey(oData.Mrank);
							
							if(oData.Begda == null) oController._vCntSub07 = 0;
							else oController._vCntSub07 = 1;
							oController.setActionButton();
							oController.setCountTabBar(oController, "Sub07");
						};
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}		
		);
	},

//  병역사항을 저장 한다.	
	saveSub07 : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_Sub07_Begda");
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_Sub07_Endda");
		var oSerty = sap.ui.getCore().byId(oController.PAGEID + "_Sub07_Serty");
		var oPreas = sap.ui.getCore().byId(oController.PAGEID + "_Sub07_Preas");
		var oJobcl = sap.ui.getCore().byId(oController.PAGEID + "_Sub07_Jobcl");
		var oMrank = sap.ui.getCore().byId(oController.PAGEID + "_Sub07_Mrank");
		
		oBegda.setValueState(sap.ui.core.ValueState.None);
		oEndda.setValueState(sap.ui.core.ValueState.None);
		oSerty.removeStyleClass("L2PSelectInvalidBorder");
		oPreas.removeStyleClass("L2PSelectInvalidBorder");
		oJobcl.removeStyleClass("L2PSelectInvalidBorder");
		oMrank.removeStyleClass("L2PSelectInvalidBorder");

		var vOneData = {
				Docno : oController._vDocno,
				Recno : oController._vRecno,
				VoltId : oController._vVoltId,
				Begda : oBegda.getValue() == "" ? null : "\/Date(" + common.Common.getTime(oBegda.getValue()) + ")\/",
				Endda : oEndda.getValue() == "" ? null : "\/Date(" + common.Common.getTime(oEndda.getValue()) + ")\/",
				Serty : oSerty.getSelectedKey() == "0000" ? "" : oSerty.getSelectedKey(),
				Preas : oPreas.getSelectedKey() == "0000" ? "" : oPreas.getSelectedKey(),	
				Jobcl : oJobcl.getSelectedKey() == "0000" ? "" : oJobcl.getSelectedKey(),
				Mrank : oMrank.getSelectedKey() == "0000" ? "" : oMrank.getSelectedKey()
		};
		
		// 입대일자(Begda)
		if(vOneData.Begda == null) {
			oBegda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_MBEGDA"));
			return;
		}

		// 전역일자(Endda)
		if(vOneData.Endda == null) {
			oEndda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_MENDDA"));
			return;
		}
		
		// 병역유형(Serty)
		if(vOneData.Serty == "") {
			oSerty.addStyleClass("L2PSelectInvalidBorder");
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_SERTY"));
			return;
		}
		
		// 전역사유(Preas)
		if(vOneData.Preas == "") {
			oPreas.addStyleClass("L2PSelectInvalidBorder");
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_PREAS"));
			return;
		}
		
		// 보직분류(Jobcl)
		if(vOneData.Jobcl == "") {
			oJobcl.addStyleClass("L2PSelectInvalidBorder");
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_JOBCL"));
			return;
		}
		
		// 계급(Mrank)
		if(vOneData.Mrank == "") {
			oMrank.addStyleClass("L2PSelectInvalidBorder");
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_MRANK"));
			return;
		}
		
		var process_result = false;
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		oModel.create(
				"/RecruitingSubjectsMilitaryServiceSet", 
				vOneData, 
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

		if(process_result) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
				title: oBundleText.getText("MSG_TITLE_GUIDE"),
				onClose : function() {
					oController.readSub07();
				}
			});
		}
	},
	
	onPressDeleteSub07 : function(oEvent) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		if(oController._vCntSub07 == 0) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_TARGET4"));
			return;
		};
		
		var onProcessDelete = function(fVal) {
			if(fVal && fVal == "OK") {
				var process_result = false;
				oModel.remove(
						"/RecruitingSubjectsMilitaryServiceSet(Docno='" + oController._vDocno + "',"
						+ "VoltId='" +  oController._vVoltId + "')", 
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
				if(process_result) {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
						title: oBundleText.getText("MSG_TITLE_GUIDE"),
						onClose : function() {
							oController.readSub07();
							oController.onClose();
						}
					});
				}
			}
		};
		
		sap.m.MessageBox.confirm(oBundleText.getText("MSG_DELETE_CONFIRM"), {
			title : oBundleText.getText("MSG_TITLE_GUIDE"),
			onClose : onProcessDelete
		});
	
	},
/////////////////////////////////////////////////////////////////////////////////////////////	
	
	setFromRegno : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		oController._vModifyContent = true;
		
		var vInputValue = oEvent.getSource().getValue();
		
		if (isNaN(vInputValue) || vInputValue.indexOf('.') != -1 || vInputValue.indexOf(' ') != -1) {
			vInputValue = vInputValue.substr(0, vInputValue.length-1 );
			oEvent.getSource().setValue(vInputValue);
	    }

		if(vInputValue.length == 13) {
			var vPreID = oEvent.getSource().getId().substr(0, oEvent.getSource().getId().lastIndexOf('_') + 1);
			var oZzgbdat = sap.ui.getCore().byId(vPreID + "Zzgbdat");
			var vZzgbdat = oZzgbdat.getValue();
			var oGesch1 = sap.ui.getCore().byId(vPreID + "Gesch1");
			var oGesch2 = sap.ui.getCore().byId(vPreID + "Gesch2");
			var oZzgbdty1 = sap.ui.getCore().byId(vPreID + "Zzgbdty1");

			// 9,0 : 국내 1800년대생 남,녀
			// 1,2 : 국내 1900년대생 남,녀
			// 3,4 : 국내 2000년대생 남,녀
			// 5,6 : 외국 1900년대생 남,녀
			// 7,8 : 외국 2000년대생 남,녀

			switch(vInputValue.substr(6, 1)){
				case "9" : 
				case "0" :
					vZzgbdat = "18";
					break;
				case "1" : 
				case "2" :
				case "5" : 
				case "6" :
					vZzgbdat = "19";
					break;
				case "3" : 
				case "4" :
				case "7" : 
				case "8" :
					vZzgbdat = "20";
			}
			vZzgbdat += vInputValue.substr(0, 2)
				+ "-" + vInputValue.substr(2, 2)
				+ "-" + vInputValue.substr(4, 2);
			oZzgbdat.setValue(vZzgbdat);
			var mArgument = {};
			mArgument.valid = oController.isValidDate(vZzgbdat);
			oZzgbdat.fireChange(mArgument);
			oZzgbdty1.setSelected(true);
			var vChkVal = parseInt(vInputValue.substr(6, 1)) % 2;
			if(vChkVal == 1) oGesch1.setSelected(true);
			else oGesch2.setSelected(true);
		}
	},
	
	/*
	 * 날짜포맷에 맞는지 검사
	 */
	isDateFormat : function(d)  {
	    var df = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
	    return d.match(df);
	},

	/*
	 * 윤년여부 검사
	 */
	isLeaf : function(year)  {
	    var leaf = false;

	    if(year % 4 == 0) {
	        leaf = true;

	        if(year % 100 == 0) {
	            leaf = false;
	        }

	        if(year % 400 == 0) {
	            leaf = true;
	        }
	    }

	    return leaf;
	},

	/*
	 * 날짜가 유효한지 검사
	 */
	isValidDate : function(d)  {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
	    // 포맷에 안맞으면 false리턴
	    if(!oController.isDateFormat(d)) {
	        return false;
	    }

	    var month_day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	    var dateToken = d.split('-');
	    var year = Number(dateToken[0]);
	    var month = Number(dateToken[1]);
	    var day = Number(dateToken[2]);
	    
	    // 날짜가 0이면 false
	    if(day == 0) {
	        return false;
	    }

	    var isValid = false;

	    // 윤년일때
	    if(oController.isLeaf(year)) {
	        if(month == 2) {
	            if(day <= month_day[month-1] + 1) {
	                isValid = true;
	            }
	        } else {
	            if(day <= month_day[month-1]) {
	                isValid = true;
	            }
	        }
	    } else {
	        if(day <= month_day[month-1]) {
	            isValid = true;
	        }
	    }

	    return isValid;
	},
	
	setFromPerid : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oPerid = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_28_Perid");
		var vPerid = oPerid.getValue().trim();
		
		var oGesch1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_28_Gesch1");
		var oGesch2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_28_Gesch2");
		var oGbdat = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_28_Gbdat");
		switch(vPerid.length) {
			case 15 :
				oGbdat.setValue("19"  + vPerid.substr(6, 2)
								+ "-" + vPerid.substr(8, 2)
								+ "-" + vPerid.substr(10, 2));
				
				if(parseInt(vPerid.substr(14, 1)) % 2 == 1) oGesch1.setSelected(true);
				else oGesch2.setSelected(true);
				
				break;
			case 18 :
				oGbdat.setValue(vPerid.substr(6, 4)
						+ "-" + vPerid.substr(10, 2)
						+ "-" + vPerid.substr(12, 2));
		
				if(parseInt(vPerid.substr(16, 1)) % 2 == 1) oGesch1.setSelected(true);
				else oGesch2.setSelected(true);
		}
	},
	
	onChangeFamst : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		oController._vModifyContent = true;
		
		var vFamst = oEvent.getSource().getSelectedKey();
		
		var oFamdt = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Famdt");
		if(vFamst == "0") {
			oFamdt.setValue("");
			oFamdt.setEnabled(false);
		} else {
			oFamdt.setEnabled(true);
		}
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 지역 DDLB (State)
/////////////////////////////////////////////////////////////////////////////////////////////
	setDDLBState : function(vSelectedKey) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var oState = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_State");
		var oLand1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Land1");
		var vLand1 = oLand1.getCustomData()[0].getValue();
		
		oState.removeAllItems();

		if(oController._vPersa != "" && oController._vActda != "" && vLand1 != "") {
			oState.addItem(
				new sap.ui.core.Item({
					key : "", 
					text : oBundleText.getText("SELECTDATA")
				})
			);
				
			var oCommonModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
			var oPath = "/EmpCodeListSet/?$filter=Field eq 'State' and Persa eq '" + oController._vPersa + "'" +
						" and Actda eq datetime'" + oController._vActda + "T00:00:00'" +
						" and Excod eq '" + vLand1 + "'";
			
			oCommonModel.read(
						oPath,
						null, 
						null, 
						false,
						function(oData, oResponse) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									oState.addItem(
										new sap.ui.core.Item({
											key : oData.results[i].Ecode, 
											text : oData.results[i].Etext
										})
									);
								}
								if(vSelectedKey != "") oState.setSelectedKey(vSelectedKey);
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
			);
		}
	},	
/////////////////////////////////////////////////////////////////////////////////////////////
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 전공(FaartCode) 검색을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////	
	_ODialogSearchFaartCodeEvent : null,
	_OFaartCodeControl : null,
	
	onDisplaySearchFaartCodeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();	
		
		oController._OFaartCodeControl = oEvent.getSource();

		if(!oController._ODialogSearchFaartCodeEvent) {
			oController._ODialogSearchFaartCodeEvent = sap.ui.jsfragment("zui5_hrxx_actapp.fragment.SearchFaartCode", oController);
			oView.addDependent(oController._ODialogSearchFaartCodeEvent);
		}
		oController._ODialogSearchFaartCodeEvent.open();
		
		oController.onSetFaartCodeFragment();
	},
	
	onSetFaartCodeFragment : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();	
		
		var oDialog = sap.ui.getCore().byId(oController.PAGEID + "_POP_FaartCode_Dialog");
		var oStandardList = sap.ui.getCore().byId(oController.PAGEID + "_POP_FaartCode_StandardList");

		if(oController._OFaartCodeControl.sId.indexOf("Sltp1") > 0)
			oDialog.setTitle(oBundleText.getText("SLTP1"));
		else
			oDialog.setTitle(oBundleText.getText("SLTP2"));
		
		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Slart");
		
		var oFaartCodeModel = sap.ui.getCore().getModel("FaartCodeList");
		var vCode = { FaartCodeListSet : [] };
		if(oSlart.getSelectedKey() == "Z4" || oSlart.getSelectedKey() == "Z5") {
			var oCommonModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
			
			var oPath = "/EmpCodeListSet/?$filter=Field%20eq%20%27Faart%27%20and%20Excod%20eq%20%27" + oSlart.getSelectedKey() + 
            		"%27%20and%20PersaNc%20eq%20%27X%27";
			
			oCommonModel.read(
						oPath,
						null, 
						null, 
						false,
						function(oData, oResponse) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									vCode.FaartCodeListSet.push(oData.results[i]);
								}
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
			);
		}
		oFaartCodeModel.setData(vCode);
		
		oDialog.bindAggregation("items", {
			path : "/FaartCodeListSet",
			template : oStandardList
		});
	},
	
	onSearchFaartCode : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Etext", sap.ui.model.FilterOperator.Contains, sValue));
	    
		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter(oFilters);
	},
	
	onConfirmFaartCode : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		var aContexts = oEvent.getParameter("selectedContexts");
	    
		if (aContexts.length) {
			var vFaartCode = aContexts[0].getProperty("Ecode");
	    	var vFaartCodetx = aContexts[0].getProperty("Etext");

	    	oController._OFaartCodeControl.setValue(vFaartCodetx);
	    	oController._OFaartCodeControl.removeAllCustomData();
	    	oController._OFaartCodeControl.addCustomData(new sap.ui.core.CustomData({key : "Key", value : vFaartCode}));
	    }
		
		oController.onCancelFaartCode(oEvent);
	},
		
	onCancelFaartCode : function(oEvent) {
		var oBinding = oEvent.getSource().getBinding("items");
	    oBinding.filter([]);
	    
	    var oFaartCodeModel = sap.ui.getCore().getModel("FaartCodeList");
	    var vCode = { FaartCodeListSet : [] };
	    oFaartCodeModel.setData(vCode);
	},
	
	onClearFaartFields : function(oController) {
		var oSltp1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sltp1");
		var oSltp2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sltp2");
		
		if(typeof oSltp1 == "object") {
			oSltp1.setValue("");
			oSltp1.removeAllCustomData();
			oSltp1.addCustomData(new sap.ui.core.CustomData({key : "Key", value : ""}));
		}
		
		if(typeof oSltp2 == "object") {
			oSltp2.setValue("");
	    	oSltp2.removeAllCustomData();
	    	oSltp2.addCustomData(new sap.ui.core.CustomData({key : "Key", value : ""}));
		}
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 재입사 정보조회 function
/////////////////////////////////////////////////////////////////////////////////////////////	
	_ODialogPopup_Rehire : null ,
	
	onPressRehireSearch : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		
		if(!oController._ODialogPopup_Rehire) {
			oController._ODialogPopup_Rehire = sap.ui.jsfragment("zui5_hrxx_actapp.fragment.ActRecPInfo_Rehire_Search", oController);
			oView.addDependent(oController._ODialogPopup_Rehire);
		}
		
		var oRPerid = sap.ui.getCore().byId(oController.PAGEID + "_Rehire_Perid"); 
		oRPerid.setValue("");
		oController._ODialogPopup_Rehire.open();
		
		
	},
	
	onConfirmRehire : function(oEvnet){
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		var oRPerid = sap.ui.getCore().byId(oController.PAGEID + "_Rehire_Perid");  
		var oProcessResult = false ; 
		var oNameLayout = sap.ui.getCore().byId(oController.PAGEID + "_NameLayout");
		var oNameLayoutText = sap.ui.getCore().byId(oController.PAGEID + "_NameLayoutText");
		oNameLayoutText.setText("");
		
		if(oRPerid.getValue() == ""){
			sap.m.MessageBox.alert(oBundleText.getText("WARING_CERNO"));
			return ;
		}
		
		var oNachnI = null,	oKonfeL = null,	oVornaI = null,	oGeschR1 = null,	oGeschR2 = null,	oHukotL = null,	
			oNatioL = null,	oLnmhgI = null,	oFnmhgI = null,	oLnmchI = null,	oFnmchI = null,	oRegnoI = null,	
			oLand1L = null, oZzgbdatD = null,	oGbdatD = null,	oZzgbdtyR1 = null,	oZzgbdtyR2 = null,	oHndnoI = null,	oTelnoI = null,	
			oFamstL = null,	oFamdtD = null,	oSprslL = null,	oPstlzI = null,	oStateL = null,	oOrt01I = null,	
			oOrt02I = null,	oInitsI = null,	oMidnmI = null,	oPannoI = null,	oCtznoI = null,	oZzfathnI = null,	
			oStrasI = null,	oZzlocnmI = null,	oKornmI = null,	oName2I = null, oPeridI = null, oUannoI = null, oHsnmrI = null;
		var vNachnI = "",	vKonfeL = "0000",	vVornaI = "",	vGeschR = "",	vHukotL = "0000",	
			vNatioL = "", vNatioLTX = "",	vLnmhgI = "",	vFnmhgI = "",	vLnmchI = "",	vFnmchI = "",	vRegnoI = "",	
			vLand1L = "", vLand1LTX = "",	vZzgbdatD = null,	vGbdatD = null,	vZzgbdtyR = "",	vHndnoI = "",	vTelnoI = "",	vFamstL = "0000",	
			vFamdtD = null,	vSprslL = "0000",	vPstlzI = "",	vStateL = "0000",	vOrt01I = "",	vOrt02I = "",	
			vInitsI = "",	vMidnmI = "",	vPannoI = "",	vCtznoI = "",	vZzfathnI = "",	vStrasI = "",	
			vZzlocnmI = "",	vKornmI = "",	vName2I = "", vPeridI = "", vUannoI = "", vHsnmrI = "", vCernoI = "";
		
		oModel.read("/RecruitingSubjectsSet?$filter=Accty eq 'R' and Cerno eq '" +  oRPerid.getValue() + "' and " +
				    "Docno eq '" + oController._vDocno + "'", 
			null, 
			null, 
			false, 	
			function(oData, oResponse) {	
				if(oData && oData.results.length > 0) {
					oProcessResult = true;
					vZzgbdatD =  oData.results[0].Zzgbdat;
					vGbdatD = oData.results[0].Gbdat;
					vFamdtD = oData.results[0].Famdt;
					vKonfeL = oData.results[0].Konfe;
					vHukotL = oData.results[0].Hukot;
					vNatioL = oData.results[0].Natio;
					vNatioLTX = oData.results[0].Natiotx;
					vLand1L = oData.results[0].Land1;
					vLand1LTX = oData.results[0].Land1tx;
					vSprslL = oData.results[0].Sprsl;
					vStateL = oData.results[0].State;
					vGeschR = oData.results[0].Gesch;
					vZzgbdtyR = oData.results[0].Zzgbdty;
					vFamstL = oData.results[0].Famst;
					vNachnI = oData.results[0].Nachn;
					vVornaI = oData.results[0].Vorna;
					vLnmhgI = oData.results[0].Lnmhg;
					vFnmhgI = oData.results[0].Fnmhg;
					vLnmchI = oData.results[0].Lnmch;
					vFnmchI = oData.results[0].Fnmch;
					vRegnoI = oData.results[0].Regno;
					vHndnoI = oData.results[0].Hndno;
					vTelnoI = oData.results[0].Telno;
					vPstlzI = oData.results[0].Pstlz;
					vOrt01I = oData.results[0].Ort01;
					vOrt02I = oData.results[0].Ort02;
					vInitsI = oData.results[0].Inits;
					vMidnmI = oData.results[0].Midnm;
					vPannoI = oData.results[0].Panno;
					vCtznoI = oData.results[0].Ctzno;
					vZzfathnI = oData.results[0].Zzfathn;
					vStrasI = oData.results[0].Stras;
					vZzlocnmI = oData.results[0].Zzlocnm;
					vKornmI = oData.results[0].Kornm;
					vName2I = oData.results[0].Name2;
					vPeridI = oData.results[0].Perid,
					vUannoI = oData.results[0].Uanno,
					vHsnmrI = oData.results[0].Hsnmr,
					
					oController._vRecno = oData.results[0].Recno;
					oController._vVoltId = oData.results[0].VoltId;
					
					var vNameStr = oData.results[0].Ename;
					oNameLayoutText.setText(vNameStr);
					
				}
			},
			function(oResponse) {
				common.Common.log(oResponse);
			}		
		);
		
		if(!oProcessResult){
			sap.m.MessageBox.alert(oBundleText.getText("NO_CERNO_FOUND"));
			return ;
		}
		
		oZzgbdatD = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdat");	if(typeof oZzgbdatD == "object") { oZzgbdatD.setValueState(sap.ui.core.ValueState.None);	if(vZzgbdatD != null) oZzgbdatD.setValue(dateFormat.format(new Date(vZzgbdatD)));	oZzgbdatD.setEnabled(!oController._DISABLED); }
		oFamdtD = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Famdt");	if(typeof oFamdtD == "object") { oFamdtD.setValueState(sap.ui.core.ValueState.None);	if(vFamdtD != null) oFamdtD.setValue(dateFormat.format(new Date(vFamdtD)));	oFamdtD.setEnabled(!oController._DISABLED); }
		oNatioL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Natio");	if(typeof oNatioL == "object") { oNatioL.setValueState(sap.ui.core.ValueState.None);	oNatioL.setValue(vNatioLTX);	oNatioL.removeAllCustomData();	oNatioL.addCustomData(new sap.ui.core.CustomData({key:"Natio", value:vNatioL}));	oNatioL.setEnabled(!oController._DISABLED); }
		oLand1L = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Land1");	if(typeof oLand1L == "object") { oLand1L.setValueState(sap.ui.core.ValueState.None);	oLand1L.setValue(vLand1LTX);	oLand1L.removeAllCustomData();	oLand1L.addCustomData(new sap.ui.core.CustomData({key:"Land1", value:vLand1L}));	oLand1L.setEnabled(!oController._DISABLED); }
		oController._vNatio = vLand1L;
		
		oSprslL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Sprsl");	if(typeof oSprslL == "object") { oSprslL.removeStyleClass("L2PSelectInvalidBorder");	oSprslL.setSelectedKey(vSprslL);	oSprslL.setEnabled(!oController._DISABLED); }
		oStateL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_State");	
		if(typeof oStateL == "object") { 
			oStateL.removeStyleClass("L2PSelectInvalidBorder");	
			oController.setDDLBState(vStateL);
			oStateL.setEnabled(!oController._DISABLED); 
		}
		oGeschR1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Gesch1");
		oGeschR2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Gesch2");
		if(typeof oGeschR1 == "object") { 
			oGeschR1.setValueState(sap.ui.core.ValueState.None); 	oGeschR2.setValueState(sap.ui.core.ValueState.None);	
			oGeschR1.setEnabled(!oController._DISABLED); 			oGeschR2.setEnabled(!oController._DISABLED);
			switch(vGeschR) {
				case "1" : oGeschR1.setSelected(true); break;
				case "2" : oGeschR2.setSelected(true); break; 
				default : oGeschR1.setSelected(false); oGeschR2.setSelected(false);
			}		
		}
		oFamstL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Famst");	if(typeof oFamstL == "object") { oFamstL.removeStyleClass("L2PSelectInvalidBorder");	oFamstL.setSelectedKey(vFamstL);	oFamstL.setEnabled(!oController._DISABLED); }
		oNachnI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Nachn");	if(typeof oNachnI == "object") { oNachnI.setValueState(sap.ui.core.ValueState.None);	oNachnI.setValue(vNachnI);	oNachnI.setEnabled(!oController._DISABLED); }
		oVornaI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Vorna");	if(typeof oVornaI == "object") { oVornaI.setValueState(sap.ui.core.ValueState.None);	oVornaI.setValue(vVornaI);	oVornaI.setEnabled(!oController._DISABLED); }
		
		oHndnoI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Hndno");	
		if(typeof oHndnoI == "object") { 
			oHndnoI.setValueState(sap.ui.core.ValueState.None);	
			oController._vHndno = vHndnoI;
			oHndnoI.setEnabled(!oController._DISABLED); 
		}
		
		oTelnoI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Telno");	
		if(typeof oTelnoI == "object") { 
			oTelnoI.setValueState(sap.ui.core.ValueState.None);	
			oController._vTelno = vTelnoI;
			oTelnoI.setEnabled(!oController._DISABLED); 
		}
		
		oPstlzI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Pstlz");	if(typeof oPstlzI == "object") { oPstlzI.setValueState(sap.ui.core.ValueState.None);	oPstlzI.setValue(vPstlzI);	oPstlzI.setEnabled(!oController._DISABLED); }
		oOrt01I = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Ort01");	if(typeof oOrt01I == "object") { oOrt01I.setValueState(sap.ui.core.ValueState.None);	oOrt01I.setValue(vOrt01I);	oOrt01I.setEnabled(!oController._DISABLED); }
		oOrt02I = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Ort02");	if(typeof oOrt02I == "object") { oOrt02I.setValueState(sap.ui.core.ValueState.None);	oOrt02I.setValue(vOrt02I);	oOrt02I.setEnabled(!oController._DISABLED); }
		oStrasI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Stras");	if(typeof oStrasI == "object") { oStrasI.setValueState(sap.ui.core.ValueState.None);	oStrasI.setValue(vStrasI);	oStrasI.setEnabled(!oController._DISABLED); }
		
		if(vFamstL == "0"){
			oFamdtD.setValue("");
			oFamdtD.setEnabled(false);
		} else {
			oFamdtD.setEnabled(true);
		}
	
		switch(oController._vMolga) {
			case "41":
				oKonfeL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Konfe");	if(typeof oKonfeL == "object") { oKonfeL.removeStyleClass("L2PSelectInvalidBorder");	oKonfeL.setSelectedKey(vKonfeL);	oKonfeL.setEnabled(!oController._DISABLED); }
				oZzgbdtyR1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdty1");	
				oZzgbdtyR2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdty2");
				if(typeof oZzgbdtyR1 == "object") { 
					oZzgbdtyR1.setValueState(sap.ui.core.ValueState.None);		oZzgbdtyR2.setValueState(sap.ui.core.ValueState.None);
					oZzgbdtyR1.setEnabled(!oController._DISABLED);				oZzgbdtyR2.setEnabled(!oController._DISABLED);
					switch(vZzgbdtyR) {
						case "1" : oZzgbdtyR1.setSelected(true); break;
						case "2" : oZzgbdtyR2.setSelected(true); break;
						default : oZzgbdtyR1.setSelected(false); oZzgbdtyR2.setSelected(false);
					}
				}
				oLnmhgI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Lnmhg");	if(typeof oLnmhgI == "object") { oLnmhgI.setValueState(sap.ui.core.ValueState.None);	oLnmhgI.setValue(vLnmhgI);	oLnmhgI.setEnabled(!oController._DISABLED); }
				oFnmhgI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Fnmhg");	if(typeof oFnmhgI == "object") { oFnmhgI.setValueState(sap.ui.core.ValueState.None);	oFnmhgI.setValue(vFnmhgI);	oFnmhgI.setEnabled(!oController._DISABLED); }
				oLnmchI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Lnmch");	if(typeof oLnmchI == "object") { oLnmchI.setValueState(sap.ui.core.ValueState.None);	oLnmchI.setValue(vLnmchI);	oLnmchI.setEnabled(!oController._DISABLED); }
				oFnmchI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Fnmch");	if(typeof oFnmchI == "object") { oFnmchI.setValueState(sap.ui.core.ValueState.None);	oFnmchI.setValue(vFnmchI);	oFnmchI.setEnabled(!oController._DISABLED); }
				oRegnoI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Regno");	if(typeof oRegnoI == "object") { oRegnoI.setValueState(sap.ui.core.ValueState.None);	oRegnoI.setValue(vRegnoI);	oRegnoI.setEnabled(!oController._DISABLED); }
				
				if(vLand1L == "KR"){
	    			oPstlzI.setShowValueHelp(true);
	    		} else {
	    			oPstlzI.setShowValueHelp(false);
				}
				vCernoI = vRegnoI;
				break;
			case "28":
				oGbdatD = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Gbdat");	if(typeof oGbdatD == "object") { oGbdatD.setValueState(sap.ui.core.ValueState.None);	if(vGbdatD != null) oGbdatD.setValue(dateFormat.format(new Date(vGbdatD)));	oGbdatD.setEnabled(!oController._DISABLED); }
				oKonfeL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Konfe");	if(typeof oKonfeL == "object") { oKonfeL.removeStyleClass("L2PSelectInvalidBorder");	oKonfeL.setSelectedKey(vKonfeL);	oKonfeL.setEnabled(!oController._DISABLED); }
				oHukotL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Hukot");	if(typeof oHukotL == "object") { oHukotL.removeStyleClass("L2PSelectInvalidBorder");	oHukotL.setSelectedKey(vHukotL);	oHukotL.setEnabled(!oController._DISABLED); }
				oZzgbdtyR1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdty1");	
				oZzgbdtyR2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdty2");
				if(typeof oZzgbdtyR1 == "object") { 
					oZzgbdtyR1.setValueState(sap.ui.core.ValueState.None);		oZzgbdtyR2.setValueState(sap.ui.core.ValueState.None);
					oZzgbdtyR1.setEnabled(!oController._DISABLED);				oZzgbdtyR2.setEnabled(!oController._DISABLED);
					switch(vZzgbdtyR) {
						case "1" : oZzgbdtyR1.setSelected(true); break;
						case "2" : oZzgbdtyR2.setSelected(true); break;
						default : oZzgbdtyR1.setSelected(false); oZzgbdtyR2.setSelected(false);
					}
				}
				oZzlocnmI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzlocnm");	if(typeof oZzlocnmI == "object") { oZzlocnmI.setValueState(sap.ui.core.ValueState.None);	oZzlocnmI.setValue(vZzlocnmI);	oZzlocnmI.setEnabled(!oController._DISABLED); }
				oKornmI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Kornm");	if(typeof oKornmI == "object") { oKornmI.setValueState(sap.ui.core.ValueState.None);	oKornmI.setValue(vKornmI);	oKornmI.setEnabled(!oController._DISABLED); }
				oName2I = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Name2");	if(typeof oName2I == "object") { oName2I.setValueState(sap.ui.core.ValueState.None);	oName2I.setValue(vName2I);	oName2I.setEnabled(!oController._DISABLED); }
				oPeridI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Perid");	if(typeof oPeridI == "object") { oPeridI.setValueState(sap.ui.core.ValueState.None);	oPeridI.setValue(vPeridI);	oPeridI.setEnabled(!oController._DISABLED); }
				oHsnmrI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Hsnmr");	if(typeof oHsnmrI == "object") { oHsnmrI.setValueState(sap.ui.core.ValueState.None);	oHsnmrI.setValue(vHsnmrI);	oHsnmrI.setEnabled(!oController._DISABLED); }
				vCernoI = vPeridI;
				break;
			case "40":
				oGbdatD = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Gbdat");	if(typeof oGbdatD == "object") { oGbdatD.setValueState(sap.ui.core.ValueState.None);	if(vGbdatD != null) oGbdatD.setValue(dateFormat.format(new Date(vGbdatD)));	oGbdatD.setEnabled(!oController._DISABLED); }
				oKonfeL = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Konfe");	if(typeof oKonfeL == "object") { oKonfeL.removeStyleClass("L2PSelectInvalidBorder");	oKonfeL.setSelectedKey(vKonfeL);	oKonfeL.setEnabled(!oController._DISABLED); }
				oInitsI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Inits");	if(typeof oInitsI == "object") { oInitsI.setValueState(sap.ui.core.ValueState.None);	oInitsI.setValue(vInitsI);	oInitsI.setEnabled(!oController._DISABLED); }
				oMidnmI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Midnm");	if(typeof oMidnmI == "object") { oMidnmI.setValueState(sap.ui.core.ValueState.None);	oMidnmI.setValue(vMidnmI);	oMidnmI.setEnabled(!oController._DISABLED); }
				oPannoI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Panno");	if(typeof oPannoI == "object") { oPannoI.setValueState(sap.ui.core.ValueState.None);	oPannoI.setValue(vPannoI);	oPannoI.setEnabled(!oController._DISABLED); }
				oZzfathnI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzfathn");	if(typeof oZzfathnI == "object") { oZzfathnI.setValueState(sap.ui.core.ValueState.None);	oZzfathnI.setValue(vZzfathnI);	oZzfathnI.setEnabled(!oController._DISABLED); }
				oName2I = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Name2");	if(typeof oName2I == "object") { oName2I.setValueState(sap.ui.core.ValueState.None);	oName2I.setValue(vName2I);	oName2I.setEnabled(!oController._DISABLED); }
				oUannoI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Uanno");	if(typeof oUannoI == "object") { oUannoI.setValueState(sap.ui.core.ValueState.None);	oUannoI.setValue(vUannoI);	oUannoI.setEnabled(!oController._DISABLED); }
				vCernoI = vPannoI;
				break;
			case "VN":
				oGbdatD = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Gbdat");	if(typeof oGbdatD == "object") { oGbdatD.setValueState(sap.ui.core.ValueState.None);	if(vGbdatD != null) oGbdatD.setValue(dateFormat.format(new Date(vGbdatD)));	oGbdatD.setEnabled(!oController._DISABLED); }
				oZzgbdtyR1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdty1");	
				oZzgbdtyR2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Zzgbdty2");
				if(typeof oZzgbdtyR1 == "object") { 
					oZzgbdtyR1.setValueState(sap.ui.core.ValueState.None);		oZzgbdtyR2.setValueState(sap.ui.core.ValueState.None);
					oZzgbdtyR1.setEnabled(!oController._DISABLED);				oZzgbdtyR2.setEnabled(!oController._DISABLED);
					switch(vZzgbdtyR) {
						case "1" : oZzgbdtyR1.setSelected(true); break;
						case "2" : oZzgbdtyR2.setSelected(true); break;
						default : oZzgbdtyR1.setSelected(false); oZzgbdtyR2.setSelected(false);
					}
				}
				oCtznoI = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Ctzno");	if(typeof oCtznoI == "object") { oCtznoI.setValueState(sap.ui.core.ValueState.None);	oCtznoI.setValue(vCtznoI);	oCtznoI.setEnabled(!oController._DISABLED); }
				oName2I = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_" + oController._vMolga + "_Name2");	if(typeof oName2I == "object") { oName2I.setValueState(sap.ui.core.ValueState.None);	oName2I.setValue(vName2I);	oName2I.setEnabled(!oController._DISABLED); }
				vCernoI = vCtznoI;
				break;
		}
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_TABLE");
		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_COLUMNLIST");
		oTable.bindItems("/RecruitingSubjectsGroupWorkingHistorySet", oColumnList, null, [new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno) , 
		                                                                                  new sap.ui.model.Filter("Cerno", sap.ui.model.FilterOperator.EQ, vCernoI)]);
		oController.setTelField(oController);
		if(oController._ODialogPopup_Rehire.isOpen()){
			oController._ODialogPopup_Rehire.close();
		}
	},
	
	onCancelRehire : function(oEvnet){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
		var oController = oView.getController();
		if(oController._ODialogPopup_Rehire.isOpen()){
			oController._ODialogPopup_Rehire.close();
		}
	},
	
	
	
/////////////////////////////////////////////////////////////////////////////////////////////
});


function ZipCodeList_OnSearchEnd(result) {
	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
	var oController = oView.getController();
	
	ZipCodeList.FitSize(1, 1);
	
	ZipCodeList.SetExtendLastCol(true);
		
	ZipCodeList.SetCellFont("FontSize", ZipCodeList.HeaderRows(), "Ichek", ZipCodeList.RowCount() + ZipCodeList.HeaderRows(),  "Ltext3", 13);
	ZipCodeList.SetCellFont("FontName", ZipCodeList.HeaderRows(), "Ichek", ZipCodeList.RowCount() + ZipCodeList.HeaderRows(),  "Ltext3", "Malgun Gothic");
	
	for(var i=0; i<ZipCodeList.RowCount(); i++) {
		for(var j=0; j<(oController.vZipcodeColumns.length + 1); j++) {
			if((i % 2) == 0) {
				ZipCodeList.SetCellBackColor(i + ZipCodeList.HeaderRows(), j, "rgb(255,255,255)");
			} else {
				ZipCodeList.SetCellBackColor(i + ZipCodeList.HeaderRows(), j, "rgb(249,249,249)");
			}
		}
	}
}

function ZipCodeList_OnDblClick(Row, Col, CellX, CellY, CellW, CellH) {    
	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp.ActRecPInfo");
	var oController = oView.getController();
	
	var oPstlz = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_41_Pstlz");
	var oState = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_41_State");
	var oOrt01 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_41_Ort01");
	var oOrt02 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Form_41_Ort02");
	
	oPstlz.setValue(ZipCodeList.GetCellValue(Row, "Pstlz"));
	oState.setSelectedKey(ZipCodeList.GetCellValue(Row, "State"));
	oOrt01.setValue(ZipCodeList.GetCellValue(Row, "Ort01"));
	oOrt02.setValue(ZipCodeList.GetCellValue(Row, "Ort02"));
	oController.onCloseZipcode();
}
