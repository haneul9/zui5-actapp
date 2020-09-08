jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");
jQuery.sap.require("zui5_hrxx_actapp2.common.Common");
jQuery.sap.require("common.SearchCode");
//jQuery.sap.require("sap.m.MaskInput");

sap.ui.controller("zui5_hrxx_actapp2.ActRecPInfo", {
	
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
	
	_vCntSub21 : 0,
	_vCntSub22 : 0,
	_vCntSub23 : 0,
	_vCntSub24 : 0,
	
	_vActiveTabNames : null,
	
	_vTabIds : ["01","02","03","04","06","07","21","22","23","24"],
	
	_vModifyContent : false,
	
	_vFromPageId : "",
	
	_DISABLED : false,
	_JobPage : "",
	
	BusyDialog : null,
	
	subAction : "",
	_vJapanIdnum : "",
	
	_vHndno : "",
	_vTelno : "",
	_vNatio : "",
	
	_ODialogPopup_Sub02 : null,
	_ODialogPopup_Sub02_P : null,
	_ODialogPopup_Sub03 : null,
	_ODialogPopup_Sub04 : null,
	_ODialogPopup_Sub05 : null,
	_ODialogPopup_Sub06 : null,
	
	_ODialogPopup_Sub21 : null,
	_ODialogPopup_Sub22 : null,
	_ODialogPopup_Sub23 : null,
	_ODialogPopup_Sub24 : null,
	
	_vSelectedContext : null,
	
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
	
	_vBankDefaultValue : null,
	
	_oIconTabbarItems : null,
	
	_vAnssaList : [],
	_vAddressLayout : [],
	_vSavedAddressList : [],
	_vEmecAddressList : [],
	_vAddressList : [],
	_vEmecAddressListCount : 0,
	
	_vDeafultContry : null,
	_vCheckContryIdNum : null,
	_pDataSub08 : "", // 재입사 여부 ( 이전 Document 에서 data 조회 ) 
	_fRehireStatus : false,
	_vCreateRehireData : null,
	
	_vHiringPersonalInfomationLayout : [],
	_vTitleGenderKeyList : [],
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actapp2.ActRecPInfo
*/
	onInit: function() {
		//if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
	    //};
	    var oTabbar = sap.ui.getCore().byId(this.PAGEID + "_TABBAR");
	    this._oIconTabbarItems = oTabbar.getItems();
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
				this._pDataSub08 = oEvent.data.Pdata.Sub08;
				this._vCntSub21 = oEvent.data.Pdata.Sub21;
				this._vCntSub22 = oEvent.data.Pdata.Sub22;
				this._vCntSub23 = oEvent.data.Pdata.Sub23;
				this._vCntSub24 = oEvent.data.Pdata.Sub24;
				
			} else {
				this._vCntSub01 = 0;
				this._vCntSub02 = 0;
				this._vCntSub03 = 0;
				this._vCntSub04 = 0;
				this._vCntSub05 = 0;
				this._vCntSub06 = 0;
				this._vCntSub07 = 0;
				
				this._vCntSub21 = 0;
				this._vCntSub22 = 0;
				this._vCntSub23 = 0;
				this._vCntSub24 = 0;
			}
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
		
		this.setTabbar(this._vMolga);
		
	    var oController = this;
	    
	    oController._fRehireStatus = false;

	    if(this._vActiveTabNames == null || this._vActiveTabNames.length < 1) {
	    	sap.m.MessageBox.alert("Nothing Tab Information this Molga (" + this._vMolga + ")", {
	    		onClose : function() {
	    			oController.navToBack();
				}
	    	});
	    	
	    	return;
	    }
	    
	    oController._vHiringPersonalInfomationLayout = oController.getHiringPersonalInfomationLayout(oController);
	    if(this._vHiringPersonalInfomationLayout == null || this._vHiringPersonalInfomationLayout.length < 1) {
	    	sap.m.MessageBox.alert("Nothing Personal Information Layout this Molga (" + this._vMolga + ")", {
	    		onClose : function() {
	    			oController.navToBack();
				}
	    	});	    	
	    	return;
	    }
	    
	    common.Common.loadCodeData(oController._vPersa, oController._vActda, oController.getEmpCodeField(oController));
		
	    this._vCheckContryIdNum = null;
	    switch(this._vMolga) {
		    case "08" : oController._vCheckContryIdNum = ["Gbdat", "Gesch", "Actda"]; break;
		    case "32" : oController._vCheckContryIdNum = ["Gbdat", "Gesch", "Gblnd"]; break;
		    case "18" : oController._vCheckContryIdNum = ["Gbdat", "Gesch", "Nachn"]; break;
		    case "06" : oController._vCheckContryIdNum = ["Gbdat", "Gesch", "Gbdep", "Gblnd"]; break;
		    case "46" : oController._vCheckContryIdNum = ["Gbdat"]; break;
			default : oController._vCheckContryIdNum = []; break;
		}
	
	    var oRequestPanel = sap.ui.getCore().byId(this.PAGEID + "_Sub01_RequestPanel");
	    if(oRequestPanel) {
	    	oRequestPanel.destroyContent();
	    }
	    
	    var oRequestPanel23 = sap.ui.getCore().byId(this.PAGEID + "_Sub23_RequestPanel");
	    if(oRequestPanel23) {
	    	oRequestPanel23.destroyContent();
	    	var vMolga23 = "";
	    	if(this._vMolga == "10") vMolga23 = "10";
	    	else vMolga23 = "08";
	    	 
	    	oRequestPanel23.addContent(sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_Sub23_" + vMolga23, this));
	    }
	    
	    var oRequestPanel24 = sap.ui.getCore().byId(this.PAGEID + "_Sub24_RequestPanel");
	    var oTable24 = sap.ui.getCore().byId(this.PAGEID + "_Sub24_TABLE");
	    var oColumnList24 = sap.ui.getCore().byId(this.PAGEID + "_Sub24_COLUMNLIST");
	    if(oColumnList24) {
	    	oColumnList24.destroy();
	    }
	    if(oTable24) {
	    	oTable24.destroy();
	    }
	    if(oRequestPanel24) {
	    	oRequestPanel24.destroyContent();
	    	var vMolga24 = "";
	    	if(this._vMolga == "08" || this._vMolga == "AE" ) vMolga24 = "08";
	    	else vMolga24 = "10";
	    	 
	    	oRequestPanel24.addContent(sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_Sub24_" + vMolga24, this));
	    }
	
	    var oIconTabBar = sap.ui.getCore().byId(this.PAGEID + "_TABBAR");
		if(oIconTabBar.getSelectedKey() != "Sub01") oIconTabBar.setSelectedKey("Sub01");
		this._JobPage = "Sub01";
		
		this.setActionButton();
		this.setSub01();
		
		this.setCountTabBar(this, "");
		
		oController._vModifyContent = false;
		
//		// 자격증유형코드
// 		var vCode = {cttypCode : []};
// 		var oCttypList = sap.ui.getCore().getModel("CttypList");
// 		var oCttypModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRXX_CERTI_SRV/", true, undefined, undefined, { "Cache-Control": "max-age=0"});
// 		oCttypModel.read("/CertiTypeSearchSet?$filter=Field eq 'Cttyp' and Persa eq '" + this._vPersa + "'",
//					null,
//					null,
//					true,
//					function(oData, oResponse) {
//						var i;
//						if(oData && oData.results.length) {
//							for(i=0; i<oData.results.length; i++) {
//								vCode.cttypCode.push(oData.results[i]);
//							}
//						}
//					},
//					function(oResponse) {
//						console.log(oResponse);
//					}
//		);
//		oCttypList.setData(vCode);
//		
//		// Molga별 Banking 기본정보
//		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
//		oModel.read("/BankDefaultValueSet?$filter=Molga eq '" + this._vMolga + "'",
//					null,
//					null,
//					true,
//					function(oData, oResponse) {
//						if(oData && oData.results.length) {
//							oController._vBankDefaultValue = oData.results[0];
//						}
//					},
//					function(oResponse) {
//						console.log(oResponse);
//					}
//		);
//		oCttypList.setData(vCode);
		
		//인사영역별 주소의 Subtype정보를 가져온다.
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		oController._vAnssaList = [];
		oCommonModel.read(
			"/EmpCodeListSet/?$filter=Field eq 'Anssa' and Persa eq '" + this._vPersa + "'",
			null,
			null,
			true,
			function(oData, oResponse) {
				if(oData && oData.results) {
					for(var i=0; i<oData.results.length; i++) {
						if(oData.results[i].Ecode != "1") {
							oController._vAnssaList.push(oData.results[i]);
						}
					}
				}
			},
			function(oResponse) {
				common.Common.log(oResponse);
			}
		);
		
		var oEmpModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		oController._vAddressLayout = [];
		oEmpModel.read(
			"/AddressLayoutSet/?$filter=Molga eq '" + this._vMolga + "'",
			null,
			null,
			true,
			function(oData, oResponse) {
				if(oData && oData.results) {
					for(var i=0; i<oData.results.length; i++) {
						if(oData.results[i].Ecode != "1") {
							oController._vAddressLayout.push(oData.results[i]);
						}
					}
				}
			},
			function(oResponse) {
				common.Common.log(oResponse);
			}
		);
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		oCommonModel.read("/TitleGenderKeySet/?$filter=Molga eq '" + this._vMolga + "'", 
					null, 
					null, 
					true, 
					function(oData, oResponse) {
						if(oData && oData.results.length) {
							for(var i = 0 ; i < oData.results.length ; i++){
								oController._vTitleGenderKeyList.push(oData.results[i]);
							}
						}
					},
					function(oResponse) {
						console.log(oResponse);
					}
		);
		
		oController._vJapanIdnum = "";
	},
	
	onAfterShow: function(evt) {
		this.setTelField(this);
		
		this.setIconTabCountColor(this);
	},
	
	setIconTabCountColor : function(oController) {		
		var oTabbar = sap.ui.getCore().byId(oController.PAGEID + "_TABBAR");
		var oCurIconTabbarItems = oTabbar.getItems();
		
		var setColor = function() {
			for(var i=0; i<oCurIconTabbarItems.length; i++) {
				if(oCurIconTabbarItems[i].getCount() != "") {
					if(parseInt(oCurIconTabbarItems[i].getCount()) == 0) {
						$("#" + oCurIconTabbarItems[i].getId() + "-count").css("color", "red");
						$("#" + oCurIconTabbarItems[i].getId() + "-count").css("font-weight", "bold");
					} else {
						$("#" + oCurIconTabbarItems[i].getId() + "-count").css("color", "#333333");
						$("#" + oCurIconTabbarItems[i].getId() + "-count").css("font-weight", "normal");
					}
				}			 
			}
		};
		setTimeout(setColor, 150);
	},
	
	setTelField : function(oController) {
//		var processF = function() {
//			for(var i=0; i<oController.vTelControls.length; i++) {
//				var oTelControl = $("#" + oController.vTelControls[i].id + "-inner");
//				if(oTelControl) {
//					oTelControl.intlTelInput({
//				        autoFormat: true,
//				        autoPlaceholder: false,
//				        defaultCountry: oController._vIntca,
//						utilsScript: "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/plugin/InitTel/utils.js"
//					});
//					
//					var vNum = "";
//					eval("vNum = oController." + oController.vTelControls[i].telVal);
//					if(vNum == "") {
//						var oControl = sap.ui.getCore().byId(oController.vTelControls[i].id);
//						if(typeof oControl == "object") vNum = oControl.getValue();
//					}
//					
//					if(vNum == "") {
//						if(oController._vNatio != null && oController._vNatio != "") {
//							oTelControl.intlTelInput("selectCountry", oController._vNatio.toLowerCase());
//						}
//					} else {
//						oTelControl.intlTelInput("setNumber", vNum);
//						if(oController._vNatio != null && oController._vNatio == "CA") {
//							oTelControl.intlTelInput("selectCountry", oController._vNatio.toLowerCase());
//						}
//					}
//				}
//			}
//		};
//		
//		setTimeout(processF, 300);
	},
	
	setCountTabBar : function(oController, vTab) {
		var oControl = null;
		var vCount = 0;
		
		if(vTab == "") {
			for(var i=0; i<oController._vActiveTabNames.length; i++) {
				oControl = sap.ui.getCore().byId(oController.PAGEID + "_TABFILTER_Sub" + oController._vActiveTabNames[i].Tabid);
				if(oControl) {
					eval("vCount = oController._vCntSub" + oController._vActiveTabNames[i].Tabid);
					oControl.setCount(vCount);
				}
			}
		} else {
			oControl = sap.ui.getCore().byId(oController.PAGEID + "_TABFILTER_" + vTab);
			eval("vCount = oController._vCnt" + vTab);
			oControl.setCount(vCount);
		}
		
		oController.setIconTabCountColor(oController);
		
		var vVisible = true;
		if(oController._vCntSub01 == 0) vVisible = false;
		
		for(var i=0; i<oController._vActiveTabNames.length; i++) {
			if(oController._vActiveTabNames[i].Tabid != "01") {
				oControl = sap.ui.getCore().byId(oController.PAGEID + "_TABFILTER_Sub" + oController._vActiveTabNames[i].Tabid);
				if(oControl) {
					oControl.setVisible(vVisible);
				}
			}
		}
		
		oController._vModifyContent = false;
	},
	
	changeModifyContent : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		oController._vModifyContent = true;
	},
	
	changeModifyDate : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		oController._vModifyContent = true;
		var oControl = oEvent.getSource();
		
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
		
		if(oController._JobPage == "Sub01" || oController._JobPage == "Sub21" || oController._JobPage == "Sub23") {
			if(oController._vModifyContent) {
				var saveFunction = function(fVal) {
					if(fVal && fVal == "YES") {
						var fSaveResult = eval("oController.save" + oController._JobPage + "('BACK');");
						if(fSaveResult) backFunction();
					} else {
						backFunction();
					}
					oController._vModifyContent = false;
				};
				
				sap.m.MessageBox.show(oBundleText.getText("MSG_SAVE_CONFIRM2"), {
			          icon: sap.m.MessageBox.Icon.QUESTION,
			          title: oBundleText.getText("MSG_TITLE_GUIDE"),
			          actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			          onClose: saveFunction
			    });
				
//				sap.m.MessageBox.confirm(oBundleText.getText("MSG_SAVE_CONFIRM2"), {
//					title : oBundleText.getText("MSG_TITLE_GUIDE"),
//					onClose : saveFunction
//				});
			} else {
				backFunction();
			}
		} else {
			backFunction();
		}
	},
	
	onTabSelected : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oControl = oEvent.getSource();
		var vSKey = oEvent.getParameter("selectedKey");
		
		var fPrevTab = false;
		
		var readFunction = function() {
			if(fPrevTab) oControl.setSelectedKey(vSKey);
			oController._JobPage = vSKey;
			oController.setActionButton();
			
			if(oController._JobPage == "Sub01") {
				oController.setSub01();
				oController.setTelField(oController);
			}else if(oController._JobPage == "Sub02"){
				oController.setSub02Layout(oController);
				eval("oController.reload" + oController._JobPage + "();");
			}else if(oController._JobPage == "Sub07" || oController._JobPage == "Sub21" || oController._JobPage == "Sub23") {
				eval("oController.read" + oController._JobPage + "();");
			} else {
				eval("oController.reload" + oController._JobPage + "();");
			}
		};
		
		var saveFunction = function(fVal) {
			if(fVal && fVal == "YES") {
				fPrevTab = true;
				oControl.setSelectedKey(oController._JobPage);
				var fSaveResult = eval("oController.save" + oController._JobPage + "('BACK');");
				if(!fSaveResult){
					return;
				}
			}
			oController._vModifyContent = false;
			readFunction();
		};
		
		if(oController._JobPage == "Sub01" || oController._JobPage == "Sub21" || oController._JobPage == "Sub23") {
			if(oController._vModifyContent) {
				sap.m.MessageBox.show(oBundleText.getText("MSG_SAVE_CONFIRM2"), {
			          icon: sap.m.MessageBox.Icon.QUESTION,
			          title: oBundleText.getText("MSG_TITLE_GUIDE"),
			          actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			          onClose: saveFunction
			    });

//				sap.m.MessageBox.confirm(oBundleText.getText("MSG_SAVE_CONFIRM2"), {
//					title : oBundleText.getText("MSG_TITLE_GUIDE"),
//					onClose : saveFunction
//				});
			} else {
				readFunction();
			}
		} else {
			readFunction();
		}
	},
	
//  Tabbar Item 설정
	setTabbar : function(vMolga) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		for(var i=0; i<oController._vTabIds.length; i++) {
			var oControl = sap.ui.getCore().byId(oController.PAGEID + "_TABFILTER_Sub" + oController._vTabIds[i]);
			if(oControl) oControl.setVisible(false);
		}
		
		oController._vActiveTabNames = [];
		
		oModel.read("/HiringFormTabInfoSet?$filter=Molga eq '" + vMolga + "'",
			null,
			null,
			false, 	
			function(oData, oResponse) {	
				if(oData && oData.results.length) {
					for(var i=0; i<oData.results.length; i++) {
						var vTabid = oData.results[i].Tabid; //Tabtl
						
						var oControl = sap.ui.getCore().byId(oController.PAGEID + "_TABFILTER_Sub" + vTabid);
						if(oControl) {
							oControl.setText(oData.results[i].Tabtl);
							oControl.setVisible(true);
						}
						
						oController._vActiveTabNames.push(oData.results[i]);
					}
				};
			},
			function(oResponse) {
				common.Common.log(oResponse);
			}		
		);
		
		var oTabbar = sap.ui.getCore().byId(oController.PAGEID + "_TABBAR");
		if(oController._oIconTabbarItems && oController._oIconTabbarItems.length && oController._vActiveTabNames.length > 0) {
			oTabbar.removeAllItems();
			
			for(var i=0; i<oController._vActiveTabNames.length; i++) {
				var vKey = "Sub" + oController._vActiveTabNames[i].Tabid;
				for(var j=0; j<oController._oIconTabbarItems.length; j++) {
					if(vKey == oController._oIconTabbarItems[j].getKey()) {
						oTabbar.addItem(oController._oIconTabbarItems[j]);
						break;
					}					
				}
			}
		}
		
		
	},
	
//  버튼 Setting
	setActionButton : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oSaveBtn = sap.ui.getCore().byId(oController.PAGEID + "_SAVE_BTN");
		var oAddBtn = sap.ui.getCore().byId(oController.PAGEID + "_ADD_BTN");
		var oModBtn = sap.ui.getCore().byId(oController.PAGEID + "_MODIFY_BTN");
		var oDelBtn = sap.ui.getCore().byId(oController.PAGEID + "_DELETE_BTN");
		var oDelSingleBtn = sap.ui.getCore().byId(oController.PAGEID + "_SINGLE_DELETE_BTN");
		var oRehireBtn = sap.ui.getCore().byId(oController.PAGEID + "_REHIRE_BTN");
		
		oSaveBtn.setVisible(false);
		oAddBtn.setVisible(false);
		oModBtn.setVisible(false);
		oDelBtn.setVisible(false);
		oDelSingleBtn.setVisible(false);
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
					if(oController._vCntSub07 != 0) oDelSingleBtn.setVisible(true);
					break;
				case "Sub21" :
					oSaveBtn.setVisible(true);		
					if(oController._vCntSub21 != 0) oDelSingleBtn.setVisible(true);
					break;
				case "Sub23" :
					oSaveBtn.setVisible(true);
					if(oController._vCntSub23 != 0) oDelSingleBtn.setVisible(true);
					break;
				case "Sub02" :
				case "Sub03" :
				case "Sub04" :
				case "Sub05" :
				case "Sub06" :
				case "Sub22" :
				case "Sub24" :
					oAddBtn.setVisible(true);
					oModBtn.setVisible(true);
					oDelBtn.setVisible(true);
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		eval("oController.save" + oController._JobPage + "()");
	},
	
	onPressSingleDelete : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		eval("oController.delete" + oController._JobPage + "()");
	},

	onPressAdd : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		oController.subAction = 'C';
		var oPopupName = "";
		var vMolga = "";
		if(oController._JobPage == "Sub24"){
			if(oController._vMolga == "08" || oController._vMolga == "AE" ) vMolga = "08";
			else vMolga = "10";
		}else{
			if(oController._vMolga == "08") vMolga = "08";
			else vMolga = "10";
		}

		
		//영국의 경우 은행은 2개만 입력 가능하다.
		if(vMolga == "08" && oController._JobPage == "Sub24") {
			if(oController._vCntSub24 == 2) {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_ADD_BANKACC"));
				return;
			}
		}
		
		if(vMolga == "10" && oController._JobPage == "Sub24") {
			if(oController._vCntSub24 == 7) {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_ADD_BANKACC2"));
				return;
			}
		}
		
		if(oController._JobPage == "Sub24") {
			oPopupName = "zui5_hrxx_actapp2.fragment.ActRecPInfo_POP_" + oController._JobPage + "_" + vMolga;
		} else {
			oPopupName = "zui5_hrxx_actapp2.fragment.ActRecPInfo_POP_" + oController._JobPage;
		}		
		
		oController._vSelectedContext = null;
		
		if(oController._JobPage == "Sub24") {
			if(!eval("oController._ODialogPopup_" + oController._JobPage + "_" + vMolga)) {
				
				eval("oController._ODialogPopup_" + oController._JobPage + "_" + vMolga + " = sap.ui.jsfragment(oPopupName, oController);");
				eval("oView.addDependent(oController._ODialogPopup_" + vMolga + "_" + oController._vMolga + ");");
			}
			eval("oController._ODialogPopup_" + oController._JobPage + "_" + vMolga + ".open();");
		} else {
			if(!eval("oController._ODialogPopup_" + oController._JobPage)) {
				
				eval("oController._ODialogPopup_" + oController._JobPage + " = sap.ui.jsfragment(oPopupName, oController);");
				eval("oView.addDependent(oController._ODialogPopup_" + oController._JobPage + ");");
			}
			eval("oController._ODialogPopup_" + oController._JobPage + ".open();");
		}
	},

	onPressModify : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_" + oController._JobPage + "_TABLE");
		var oContext = oTable.getSelectedContexts();
		if(oContext.length == 0) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_UPDATE_TARGET"));
			return;
		};
		
		oController._vSelectedContext = oContext;

		oController.subAction = 'M';
		
		var oPopupName = "";
		var vMolga = "";
		
		if(oController._JobPage == "Sub24"){
			if(oController._vMolga == "08" || oController._vMolga == "AE" ) vMolga = "08";
			else vMolga = "10";
		}else{
			if(oController._vMolga == "08") vMolga = "08";
			else vMolga = "10";
		}
		
		if(oController._JobPage == "Sub24") {
			oPopupName = "zui5_hrxx_actapp2.fragment.ActRecPInfo_POP_" + oController._JobPage + "_" + vMolga;
		} else {
			oPopupName = "zui5_hrxx_actapp2.fragment.ActRecPInfo_POP_" + oController._JobPage;
		}
		
		if(oController._JobPage == "Sub24") {
			if(!eval("oController._ODialogPopup_" + oController._JobPage + "_" + vMolga)) {
				
				eval("oController._ODialogPopup_" + oController._JobPage + "_" + vMolga + " = sap.ui.jsfragment(oPopupName, oController);");
				eval("oView.addDependent(oController._ODialogPopup_" + vMolga + "_" + oController._vMolga + ");");
			}
			eval("oController._ODialogPopup_" + oController._JobPage + "_" + vMolga + ".open();");
		} else {
			if(!eval("oController._ODialogPopup_" + oController._JobPage)) {
				
				eval("oController._ODialogPopup_" + oController._JobPage + " = sap.ui.jsfragment(oPopupName, oController);");
				eval("oView.addDependent(oController._ODialogPopup_" + oController._JobPage + ");");
			}
			eval("oController._ODialogPopup_" + oController._JobPage + ".open();");
		}
	},
	
	onBeforeOpenDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		eval("oController.set" + oController._JobPage + "(oController._vSelectedContext);");
		
		if(oController._vSelectedContext == null) {
			if(oController._JobPage == "Sub02") {
				oController.setSLABS("00");

				oController.onClearFaartFields(oController);
				
//				oController.onSetDialogLayoutSub02(oController);
		    	
			} else if(oController._JobPage == "Sub04") {
				oController.setEXMTY("");
			}
		}
	},

	onPressDelete : function(oEvent) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_" + oController._JobPage + "_TABLE");
		var oContext = oTable.getSelectedContexts();
		if(oContext.length == 0) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_TARGET"));
			return;
		};
		
		if(oController._JobPage == "Sub24") {
			if(oContext[0].getProperty("Bnksa") == "0" && oController._vCntSub24 > 1) {
				sap.m.MessageBox.alert("If you have other bank, you can not delete the main banking information.");
				return;
			}
		}
		
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oDialogName = "";
		var vMolga = "";
		
		if(oController._JobPage == "Sub24"){
			if(oController._vMolga == "08" || oController._vMolga == "AE" ) vMolga = "08";
			else vMolga = "10";
		}else{
			if(oController._vMolga == "08") vMolga = "08";
			else vMolga = "10";
		}
		
		if(oController._JobPage == "Sub24") {
			oDialogName = oController.PAGEID + "_POP_" + oController._JobPage  + "_" + vMolga + "_Dialog";
		} else {
			oDialogName = oController.PAGEID + "_POP_" + oController._JobPage + "_Dialog";
		}	
		
//		var oDialogName = oController.PAGEID + "_POP_" + oController._JobPage + "_Dialog";
		
		var oDialog = sap.ui.getCore().byId(oDialogName);
		if(oDialog) oDialog.close();
	},

	onChangeSlart : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		oController.setSLABS("00");
		oController.onClearFaartFields(oController);

		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Slart");
		var oSltp1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sltp1");
		var oSltp2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sltp2");
		
		var oSltp1Label = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sltp1_Label");
		
		if(oSlart.getSelectedKey() == "Z4" || oSlart.getSelectedKey() == "Z5" || oSlart.getSelectedKey() == "Z6") {
			oSltp1.setEnabled(!oController._DISABLED);
			oSltp2.setEnabled(!oController._DISABLED);
		} else {
			oSltp1.setEnabled(false);
			oSltp2.setEnabled(false);
		}
		
		if(oSlart.getSelectedKey() == "Z4" || oSlart.getSelectedKey() == "Z5") {
			oSltp1Label.setRequired(true);
		} else {
			oSltp1Label.setRequired(false);
		}
	},
	
	onChangeQuali : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		oController.setEXMTY("");
		oController.setEAMGR("");
	},
	
	onChangeExmty : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		oController.setEAMGR("");
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 학위 DDLB
/////////////////////////////////////////////////////////////////////////////////////////////
	setSLABS : function(vSelectedKey) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oQuali = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Quali");
		var oExmty = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Exmty");
		
		if(typeof oExmty != "object") return;
		
		oExmty.removeAllItems();
		oExmty.addItem(
			new sap.ui.core.Item({
				key : "",
				text : oBundleText.getText("SELECTDATA")
			})
		);
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
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
// 지급방법
/////////////////////////////////////////////////////////////////////////////////////////////
	setBkont : function(vSelectedKey, oBkont) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
//		var oBkont = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_Bkont");
		
		if(typeof oBkont != "object") return;
		
		oBkont.removeAllItems();
		oBkont.addItem(new sap.ui.core.Item({key : "0000", text : oBundleText.getText("SELECTDATA")}));
		oBkont.addItem(new sap.ui.core.Item({key : "01", text : "Checking Account"}));
		oBkont.addItem(new sap.ui.core.Item({key : "02", text : "Savings Account"}));
		
		if(vSelectedKey != "0000" && vSelectedKey != "") oBkont.setSelectedKey(vSelectedKey);
	},
		
/////////////////////////////////////////////////////////////////////////////////////////////
// 지급방법
/////////////////////////////////////////////////////////////////////////////////////////////
	setZlsch : function(vLand, vSelectedKey) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var vMolga = "";		
		if(oController._vMolga == "08" || oController._vMolga == "AE") vMolga = "08";
		else vMolga = "10";
		
		var oZlsch = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Zlsch");
		
		if(typeof oZlsch != "object") return;
		
		oZlsch.removeAllItems();
		oZlsch.addItem(
			new sap.ui.core.Item({
				key : "",
				text : oBundleText.getText("SELECTDATA")
			})
		);
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		var oPath = "/EmpCodeListSet/?$filter=Field eq 'Zlsch' and Persa eq '" + oController._vPersa + "'"
		          + " and Actda eq datetime'" + oController._vActda + "T00:00:00'"
		          + " and Excod eq '" + vLand + "'";
		
		oCommonModel.read(
					oPath,
					null,
					null,
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								oZlsch.addItem(
									new sap.ui.core.Item({
										key : oData.results[i].Ecode,
										text : oData.results[i].Etext
									})
								);
							}
							if(vSelectedKey != "0000" && vSelectedKey != "") oZlsch.setSelectedKey(vSelectedKey);
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oExmty = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Exmty");
		var oEamgr = sap.ui.getCore().byId(oController.PAGEID + "_Sub04_Eamgr");
		
		if(typeof oEamgr != "object") return;
		
		oEamgr.removeAllItems();
		oEamgr.addItem(
			new sap.ui.core.Item({
				key : "",
				text : oBundleText.getText("SELECTDATA")
			})
		);
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
			oController._ODialogSearchEvent = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_POP_Schcd", oController);
			oView.addDependent(oController._ODialogSearchEvent);
		}
		
		var oSchcd = sap.ui.getCore().byId(oController.PAGEID + "_POP_Schcd");
		oSchcd.setValue("");
		
		oController._ODialogSearchEvent.open();
	},
	
	onSearchSchcd : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
	    var oSchcd_Pop = sap.ui.getCore().byId(oController.PAGEID + "_POP_Schcd");
	    var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Slart");
		
		var sValue = oSchcd_Pop.getValue();
		if(sValue.length < 2){
			common.Common.showErrorMessage(oBundleText.getText("MSG_SEARCH_CONDTION"));
			return ;
		}
		
		var oFilters = [];
	    oFilters.push(new sap.ui.model.Filter("Slart", sap.ui.model.FilterOperator.EQ, oSlart.getSelectedKey()));
	    oFilters.push(new sap.ui.model.Filter("Insti", sap.ui.model.FilterOperator.EQ, oSchcd_Pop.getValue()));
	
	    var oSchcdList = sap.ui.getCore().byId(oController.PAGEID + "_POP_Schcd_StandardList");
	    var oSchcdListItem = sap.ui.getCore().byId(oController.PAGEID + "_POP_Schcd_StandardListItem");
	    oSchcdList.bindItems("/SchoolCodeSet", oSchcdListItem, null, oFilters);
	},
	
	onConfirmSchcd : function(oEvent) {  
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oSchcd = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Schcd");
		var oSland = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sland");
		var oList = sap.ui.getCore().byId(oController.PAGEID + "_POP_Schcd_StandardList");
		
		var aContexts = oList.getSelectedContexts(true);
		
		if (aContexts.length == 1){
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oSchcdList = sap.ui.getCore().byId(oController.PAGEID + "_POP_Schcd_StandardList");
		oSchcdList.unbindItems();
	    if(oController._ODialogSearchEvent.isOpen()){
	    	oController._ODialogSearchEvent.close();
	    }
	},
/////////////////////////////////////////////////////////////////////////////////////////////
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 회사 검색을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////	
	_ODialogSearchCompanyEvent : null,
	
	onDisplaySearchCompanyDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();	
		
		oController._SelectedContext = null;
		
		if(!oController._ODialogSearchCompanyEvent) {
			oController._ODialogSearchCompanyEvent = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_POP_Arbgb", oController);
			oView.addDependent(oController._ODialogSearchCompanyEvent);
		}
		
		var oArbgb = sap.ui.getCore().byId(oController.PAGEID + "_POP_Arbgb");
		oArbgb.setValue("");
		
		oController._ODialogSearchCompanyEvent.open();
	},
	
	beforeOpenArbgb : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oList = sap.ui.getCore().byId(oController.PAGEID + "_POP_Arbgb_StandardList");
		oList.unbindItems();
	},
	
	onSearchArbgb : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oArbgb = sap.ui.getCore().byId(oController.PAGEID + "_POP_Arbgb");
		var sValue = oArbgb.getValue()
		if(sValue.length < 2){
			common.Common.showErrorMessage(oBundleText.getText("MSG_SEARCH_CONDTION"));
			return ;
		}
		
		var oFilters = [];
	    oFilters.push(new sap.ui.model.Filter("Arbgb", sap.ui.model.FilterOperator.EQ, sValue));
	    
	    var oArbgbList = sap.ui.getCore().byId(oController.PAGEID + "_POP_Arbgb_StandardList");
	    var oArbgbListItem = sap.ui.getCore().byId(oController.PAGEID + "_POP_Arbgb_StandardListItem");
	    oArbgbList.bindItems("/PrevEmployersCodeListSet", oArbgbListItem, null, oFilters);
	},
	
	onConfirmArbgb : function(oEvent) {  
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oArbgb = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Arbgb");
		var oList = sap.ui.getCore().byId(oController.PAGEID + "_POP_Arbgb_StandardList");
		
		var aContexts = oList.getSelectedContexts(true);
		
		if (aContexts.length == 1){
			var vArbgb = aContexts[0].getProperty("Arbgb");
	    	var vZzarbgb = aContexts[0].getProperty("Zzarbgb");
	
	    	oArbgb.removeAllCustomData();
	    	oArbgb.setValue(vArbgb);
	    	oArbgb.addCustomData(new sap.ui.core.CustomData({key : "Arbgb", value : vZzarbgb}));
	    }
		
		oController.onCancelArbgb(oEvent);
	},
		
	onCancelArbgb : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();

	    if(oController._ODialogSearchCompanyEvent.isOpen()){
	    	oController._ODialogSearchCompanyEvent.close();
	    }
	},
/////////////////////////////////////////////////////////////////////////////////////////////	
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 직무 검색을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////	
	_SerachStellDialog : null,
	
	displayStellSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();	
		
		oController._ONatioControl = oEvent.getSource();

		if(!oController._ODialogSearchNatioEvent) {
			oController._ODialogSearchNatioEvent = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_POP_Natio", oController);
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var aContexts = oEvent.getParameter("selectedContexts");
		
	    var vIds = oController._ONatioControl.sId.split("_");
	    var vKey = vIds[vIds.length - 1];
	
		if (aContexts.length) {
			var vNatio = aContexts[0].getProperty("Ecode");
	    	var vNatiotx = aContexts[0].getProperty("Etext");
	    	if(vNatio == "") vNatiotx = "";
	    	oController._ONatioControl.removeAllCustomData();
	    	oController._ONatioControl.setValue(vNatiotx);
	    	oController._ONatioControl.addCustomData(new sap.ui.core.CustomData({key : vKey, value : vNatio}));
	    	
	    	oController._vModifyContent = true;
	    	
	    	if(oController._ONatioControl.sId.indexOf("Sub01") > 0 && oController._ONatioControl.sId.indexOf("Land1") > 0) {
	    		oController._vNatio = vNatio;
	    		oController.setDDLBState("", oController._vMolga, "Land1", "State");
			} else if(oController._ONatioControl.sId.indexOf("_Sub24_Banks") > 0) {
	    		oController.setZlsch(vNatio, "");
			} else if(oController._ONatioControl.sId.indexOf("Sub01") > 0 && oController._ONatioControl.sId.indexOf("Emecland1") > 0) {
				oController.setDDLBState("", oController._vMolga, "Emecland1", "Emecstate");
			} else if(oController._ONatioControl.sId.indexOf("_Sub21_") > 0) {
				var vTmp1 = oController._ONatioControl.sId.substring(oController._ONatioControl.sId.indexOf("_Form_") + 6);
				var vTmp2 = vTmp1.split("_");
				var vPrefix1 = "";
				for(var i=0; i<vTmp2.length - 1; i++) {
					vPrefix1 += vTmp2[i] + "_";
				}
				
				oController.setDDLBState2("", vNatio, oController.PAGEID + "_Sub21_Form_" + vPrefix1 + "State");
			} else if(oController._ONatioControl.sId.indexOf("Sub01") > 0 && oController._ONatioControl.sId.indexOf("Gblnd") > 0) {
	    		oController.setDDLBState("", oController._vMolga, "Gblnd", "Gbdep");
			} 
	    	
	    	var oPstlz = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Pstlz");
	    	if(typeof oPstlz == "object") {
	    		if(vNatio == "KR") {
	    			oPstlz.setShowValueHelp(true);
	    		} else {
	    			oPstlz.setShowValueHelp(false);
	    		}
	    		if(oController._ONatioControl.sId.indexOf("Gblnd") > 0){}
	    		else oPstlz.setValue("");
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
// 은행 검색을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////	
	_ODialogSearchBanklEvent : null,
	_OBanklControl : null,
	
	onDisplaySearchBanklDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();	
		
		var vMolga = "";		
		if(oController._vMolga == "08" || oController._vMolga == "AE") vMolga = "08";
		else vMolga = "10";
		
		var oBanks = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Banks");
		var vBanks = oController.getCustomdata(oBanks.getCustomData(), "Banks");
		
		if(vBanks == "") {
			sap.m.MessageBox.alert("Please select a country.");
			return;
		}
		
		oController._OBanklControl = oEvent.getSource();

		if(!oController._ODialogSearchBanklEvent) {
			oController._ODialogSearchBanklEvent = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_POP_Bankl", oController);
			oView.addDependent(oController._ODialogSearchBanklEvent);
		}
		oController._ODialogSearchBanklEvent.open();
		
		oController.onSetBankFragment();
	},
	
	onSetBankFragment : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var vMolga = "";		
		if(oController._vMolga == "08" || oController._vMolga == "AE") vMolga = "08";
		else vMolga = "10";
		
		var oDialog = sap.ui.getCore().byId(oController.PAGEID + "_POP_Bankl_Dialog");
		
//		var oStandardListItem = sap.ui.getCore().byId(oController.PAGEID + "_POP_Bankl_StandardList");
//		
//		var oBanks = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Banks");
//		var vBanks = oController.getCustomdata(oBanks.getCustomData(), "Banks");
//		
//		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		var mBankCodeList = sap.ui.getCore().getModel("BankCodeList");
		var vBankCodeList = {BankCodeSet : []};
		mBankCodeList.setData(vBankCodeList);
//		
//		oModel.read("/BankCodeSet?$filter=Banks eq '" + vBanks + "'",
//				null,
//				null,
//				false,
//				function(oData, oResponse) {
//					if(oData && oData.results) {		
//						for(var i=0; i<oData.results.length; i++) {
//							var oneData = oData.results[i];
//							oneData.SearchText = oData.results[i].Banka + " " + oData.results[i].Bankl;
//							vBankCodeList.BankCodeSet.push(oneData);
//						}	
//						mBankCodeList.setData(vBankCodeList);
//					}
//				},
//				function(oError) {
//			    	console.log(oError);
//				}
//		);

//		var oFilters = [];
//		oFilters.push(new sap.ui.model.Filter("Banks", sap.ui.model.FilterOperator.EQ, vBanks));
//	
//		oDialog.bindAggregation("items", {
//			path : "/BankCodeSet?$filter=Banks eq '" + vBanks + "'",
//			template : oStandardListItem,
////			filters : oFilters
//		});
	},
	
	onSearchBankl : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var vMolga = "";		
		if(oController._vMolga == "08" || oController._vMolga == "AE") vMolga = "08";
		else vMolga = "10";
		
		var sValue = oEvent.getParameter("value");
		if(sValue == "") {
			var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");				
			vMsg = vMsg.replace("&Cntl", oBundleText.getText("KEYWORD"));
			sap.m.MessageBox.alert(vMsg);
			return false;
		} 
//		
//		var oBanks = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Banks");
//		var vBanks = oController.getCustomdata(oBanks.getCustomData(), "Banks");
//		
//		var oFilters = [];
//		oFilters.push(new sap.ui.model.Filter("SearchText", sap.ui.model.FilterOperator.Contains, sValue));
//	
//		var oBinding = oEvent.getSource().getBinding("items");
//		oBinding.filter(oFilters);
		
		var oStandardListItem = sap.ui.getCore().byId(oController.PAGEID + "_POP_Bankl_StandardList");
		
		var oBanks = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Banks");
		var vBanks = oController.getCustomdata(oBanks.getCustomData(), "Banks");
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		var mBankCodeList = sap.ui.getCore().getModel("BankCodeList");
		var vBankCodeList = {BankCodeSet : []};
		
		oModel.read("/BankCodeSet?$filter=Banks eq '" + vBanks + "' and Banka eq '" + sValue + "'",
				null,
				null,
				false,
				function(oData, oResponse) {
					if(oData && oData.results) {		
						for(var i=0; i<oData.results.length; i++) {
							var oneData = oData.results[i];
							oneData.SearchText = oData.results[i].Banka + " " + oData.results[i].Bankl;
							vBankCodeList.BankCodeSet.push(oneData);
						}	
						mBankCodeList.setData(vBankCodeList);
					}
				},
				function(oError) {
			    	console.log(oError);
				}
		);
	},
	
	onConfirmBankl : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var aContexts = oEvent.getParameter("selectedContexts");
	
		if (aContexts.length) {
			var vBankl = aContexts[0].getProperty("Bankl");
	    	var vBanka = aContexts[0].getProperty("Banka");
	    	oController._OBanklControl.removeAllCustomData();
	    	oController._OBanklControl.setValue(vBanka);
	    	oController._OBanklControl.addCustomData(new sap.ui.core.CustomData({key : "Bankl", value : vBankl}));
	    	
	    	oController._vModifyContent = true;
	    }
		
		oController.onCancelBankl(oEvent);
	},
		
	onCancelBankl : function(oEvent) {
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();	
		
		oController._OCttypControl = oEvent.getSource();

		if(!oController._ODialogSearchCttypEvent) {
			oController._ODialogSearchCttypEvent = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_POP_Cttyp", oController);
			oView.addDependent(oController._ODialogSearchCttypEvent);
		}
		
		var oCttyp = sap.ui.getCore().byId(oController.PAGEID + "_POP_Cttyp");
		var CttypText_Btn = sap.ui.getCore().byId(oController.PAGEID + "_CttypText_Btn");
		oCttyp.setValue("");
		CttypText_Btn.setVisible(true);
		
		oController._ODialogSearchCttypEvent.open();
	},
	
	onSearchCttyp : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		var sValue = sap.ui.getCore().byId(oController.PAGEID + "_POP_Cttyp").getValue();
		if(sValue.length < 2){
			common.Common.showErrorMessage(oBundleText.getText("MSG_SEARCH_CONDTION"));
			return ;
		}
		var dataProcess = function(){
			var mCertiTypeSearchList = sap.ui.getCore().getModel("CttypList");
			var vCertiTypeSearchList = {CertiTypeSearchSet : []};
			
			var oCttypModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRXX_CERTI_SRV/", true, undefined, undefined, { "Cache-Control": "max-age=0"});
			
			var filterString = "/CertiTypeSearchSet/?$filter=";
				filterString += "Persa%20eq%20%27" + oController._vPersa + "%20%27";
				filterString += "%20and%20";
				filterString += "Field%20eq%20%27" + "Cttyp" + "%20%27";
				filterString += "%20and%20";
				filterString += "Cttyptx%20eq%20%27" +  encodeURI(sValue)  + "%20%27";
				
				oCttypModel.read(filterString,
						null,
						null,
						false,
						function(oData, oResponse) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									vCertiTypeSearchList.CertiTypeSearchSet.push(oData.results[i]);
								}
							}
							mCertiTypeSearchList.setData(vCertiTypeSearchList);
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
			);	
				
			
			var oCttypList = sap.ui.getCore().byId(oController.PAGEID + "_POP_Cttyp_StandardList");
		    var oCttypListItem = sap.ui.getCore().byId(oController.PAGEID + "_POP_Cttyp_StandardListItem");
			
		    oCttypList.bindItems("/CertiTypeSearchSet", oCttypListItem, null, []);	
			
		};
		
		if(!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false});
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCHING")}));
			oController.getView().addDependent(oController.BusyDialog);
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		setTimeout(dataProcess, 300);
	},
	
	onConfirmCttyp : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oCttyp = sap.ui.getCore().byId(oController.PAGEID + "_Sub06_Cttyp");
		var oIsaut = sap.ui.getCore().byId(oController.PAGEID + "_Sub06_Isaut");
		
		var oCttypList = sap.ui.getCore().byId(oController.PAGEID + "_POP_Cttyp_StandardList");
		
		var aContexts = oCttypList.getSelectedContexts(true);
	
		if (aContexts.length == 1){
			var vCttyp = aContexts[0].getProperty("Cttyp");
	    	var vCttyptx = aContexts[0].getProperty("Cttyptx");
	    	var vIsaut = aContexts[0].getProperty("Isaut");
	    	oCttyp.removeAllCustomData();
	    	oCttyp.setValue(vCttyptx);
	    	oCttyp.addCustomData(new sap.ui.core.CustomData({key : "Cttyp", value : vCttyp}));
	    	oIsaut.setValue(vIsaut);
	    }
		
		oController.onCancelCttyp(oEvent);
	},
		
	onCancelCttyp : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oCertiTypeSearchModel = sap.ui.getCore().getModel("CttypList");
	    var vCode = {CertiTypeSearchSet : []};
	    oCertiTypeSearchModel.setData(vCode);
	
	    var oCttypList = sap.ui.getCore().byId(oController.PAGEID + "_POP_Cttyp_StandardList");
	    var oCttypListItem = sap.ui.getCore().byId(oController.PAGEID + "_POP_Cttyp_StandardListItem");
	    oCttypList.bindItems("/CertiTypeSearchSet", oCttypListItem, null, []);
	
	    if(oController._ODialogSearchCttypEvent.isOpen()){
	    	oController._ODialogSearchCttypEvent.close();
	    }
	},
/////////////////////////////////////////////////////////////////////////////////////////////
		
/////////////////////////////////////////////////////////////////////////////////////////////
// 주소 검색을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////	
	_ODialogSearchZipcodeEvent : null,
	
	onDisplaySearchZipcodeDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();	
		
		if(!oController._ODialogSearchZipcodeEvent) {
			oController._ODialogSearchZipcodeEvent = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ZipcodeSearch", oController);
			oView.addDependent(oController._ODialogSearchZipcodeEvent);
		}
		oController._ODialogSearchZipcodeEvent.open();
	},
		
	onSearchZipcode : function(oEvent) {
		var sValue = oEvent.getSource().getValue();

		var vGridData = {data : []};
		
		if(sValue != "") {
			var oModel = sap.ui.getCore().getModel("ZHRXX_PSTLZ_SRV");
			oModel.read("/ZipcodeListSet?$filter=Ltext eq '" + encodeURI(sValue) + "'",
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		if(typeof ZipCodeList != "object") return;
		
		var oPstlz = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Pstlz");
		var oState = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_State");
		var oOrt01 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Ort01");
		var oOrt02 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Ort02");
		var oLocat = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Locat");
		
		var vCheck_Idx = -1;
		for(var i=0; i<ZipCodeList.RowCount(); i++) {
			 if(ZipCodeList.GetCellValue(i, "Ichek") == 1) {
				 vCheck_Idx = i;
				 break;
			 }
		}
		
		oPstlz.setValue(ZipCodeList.GetCellValue(vCheck_Idx, "Pstlz"));
		if(oState) oState.setSelectedKey(ZipCodeList.GetCellValue(vCheck_Idx, "State"));
		if(oOrt01) oOrt01.setValue(ZipCodeList.GetCellValue(vCheck_Idx, "Ort01"));
		if(oOrt02) oOrt02.setValue(ZipCodeList.GetCellValue(vCheck_Idx, "Ort02"));
		if(oLocat) oLocat.setValue(ZipCodeList.GetCellValue(vCheck_Idx, "Ort02"));
		oController.onCloseZipcode();
	},
		
	onCloseZipcode : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		if(oController._ODialogSearchZipcodeEvent && oController._ODialogSearchZipcodeEvent.isOpen()) {
			oController._ODialogSearchZipcodeEvent.close();
		};
	},
	
	onAfterRenderingTableLayout : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		$("#" + oController.PAGEID + "_ZipcodeList").css("height", 560);
		
		if(typeof ZipCodeList == "undefined") {
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oZipcodeSearchField = sap.ui.getCore().byId(oController.PAGEID + "_ZipcodeSearchField");
		if(oZipcodeSearchField) oZipcodeSearchField.setValue("");
		
	},
/////////////////////////////////////////////////////////////////////////////////////////////
		
/////////////////////////////////////////////////////////////////////////////////////////////
// Sub01 인적사항을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////
//  인적사항 화면 Setting.
	setSub01 : function(RehireData) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var oNameLayout = sap.ui.getCore().byId(oController.PAGEID + "_NameLayout");
		var oNameLayoutText = sap.ui.getCore().byId(oController.PAGEID + "_NameLayoutText");
		oNameLayoutText.setText("");
		oNameLayout.setVisible(false);
		
		var oRequestPanel = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_RequestPanel");
		oRequestPanel.destroyContent();
		
		var vGroupInfo = [];
		if(oController._vHiringPersonalInfomationLayout && oController._vHiringPersonalInfomationLayout.length) {
			for(var i=0; i<oController._vHiringPersonalInfomationLayout.length; i++) {
				var isExists = false;
				for(var j=0; j<vGroupInfo.length; j++) {
					if(vGroupInfo[j].Itgrp == oController._vHiringPersonalInfomationLayout[i].Itgrp) {
						isExists = true;
						break;
					}
				}
				if(isExists == false) {
					vGroupInfo.push({Itgrp : oController._vHiringPersonalInfomationLayout[i].Itgrp, Itgrptx : oController._vHiringPersonalInfomationLayout[i].Itgrptx});
				}
			}
		}

		var vCernoI = "";
		var vChangeData = null;
		
		if(RehireData) {
			//재입사 일본의 경우
			if(oController._vMolga == "22") {
				oController._vJapanIdnum = RehireData.Idnum;
			}
			vChangeData = RehireData;
			vCernoI = RehireData.Idnum;
		}
		
		if(RehireData == null && oController._vActionType != "C") {
			oModel.read("/RecruitingSubjectsSet(Docno='" + oController._vDocno + "',"
					  + "VoltId='" +  oController._vVoltId + "')",
				null,			
				null,
				false, 	
				function(oData, oResponse) {	
					if(oData) {
						vChangeData = oData;
						if(vChangeData.Anzkd == "0") vChangeData.Anzkd = "";
						oController._vRecno = oData.Recno;
						oController._vVoltId = oData.VoltId;
						oNameLayout.setVisible(true);
						
						var vNameStr = oData.Ename;
						
						oController._vNatio = oData.Natio;
						
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
		
		var oTempLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : []
		}).addStyleClass("L2PPadding05remLR");
		
		var oCell = null, oRow = null; 
		
		for(var g=0; g<vGroupInfo.length; g++) {
			var oToolbar = new sap.m.Toolbar({
				height : "36px",
				design : sap.m.ToolbarDesign.Auto,
				content : [new sap.m.Label({text : vGroupInfo[g].Itgrptx, design : "Bold"}).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine L2PPadding05remLR");
			
			var oControlMatrix = new sap.ui.commons.layout.MatrixLayout({
				width : "99%",
				layoutFixed : false,
				columns : 4,
				widths: ["15%","35%","15%","35%"],
			});
			
			var c_idx = 0;
			var vDefaultValues = [];
			for(var i=0; i<oController._vHiringPersonalInfomationLayout.length; i++) {
				var Fieldname = oController._vHiringPersonalInfomationLayout[i].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				if(oController._vHiringPersonalInfomationLayout[i].Dcode != "") {
					var vOneDefaultValue = {};
					vOneDefaultValue.Fieldname = Fieldname;
					vOneDefaultValue.Code = oController._vHiringPersonalInfomationLayout[i].Dcode;
					vOneDefaultValue.Text = oController._vHiringPersonalInfomationLayout[i].Dvalu;
					
					vDefaultValues.push(vOneDefaultValue);
				}
			}
			
			for(var i=0; i<oController._vHiringPersonalInfomationLayout.length; i++) {
				if(oController._vHiringPersonalInfomationLayout[i].Itgrp == vGroupInfo[g].Itgrp) {
					var Fieldname = oController._vHiringPersonalInfomationLayout[i].Fieldname;
					var Fieldtype = oController._vHiringPersonalInfomationLayout[i].Incat;
					Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
					var TextFieldname = Fieldname + "tx";
					
					if(oController._vMolga == "18" && (Fieldname == "Hsnmr" || Fieldname == "Posta")) {
						continue;
					}
					if((Fieldname == "Famdt")) {
						continue;
					}
					
					if((c_idx % 2) == 0) {
						if(c_idx != 0) {
							oControlMatrix.addRow(oRow);
						}
						oRow = new sap.ui.commons.layout.MatrixLayoutRow();
					}
					
					var vUpdateValue = oController._vHiringPersonalInfomationLayout[i].Dcode;
					var vUpdateTextValue = oController._vHiringPersonalInfomationLayout[i].Dvalu;
					
					if(vChangeData != null) {
						vUpdateValue = eval("vChangeData." + Fieldname);
						vUpdateTextValue = eval("vChangeData." + TextFieldname);
					} 
					
//					if(oController._vMolga == "10" && (Fieldname == "Idnum" || Fieldname == "Perid")) {
//						if(vUpdateValue != "" && vUpdateValue.indexOf("-") == -1) vUpdateValue = vUpdateValue.substring(0,3) + "-" + vUpdateValue.substring(3,5) + "-" + vUpdateValue.substring(5);
//					}
					
					var vLabel = oController._vHiringPersonalInfomationLayout[i].Label;
					var vMaxLength = parseInt(oController._vHiringPersonalInfomationLayout[i].Maxlen);
					if(vMaxLength == 0) {
						vMaxLength = common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", Fieldname);
					}
					
					var oLabel = new sap.m.Label({text : vLabel});
					if(Fieldtype.substring(0, 1) == "M") {
						oLabel.setRequired(true);
					} else {
						oLabel.setRequired(false);
					}
					oLabel.addStyleClass("L2P13Font");
					oLabel.setTooltip(vLabel);
					
					if(Fieldtype == "D2") {
						oLabel.setText("");
					}
					
					oCell = new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Begin,
						vAlign : sap.ui.commons.layout.VAlign.Middle,
						content : [oLabel]
					}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
					oRow.addCell(oCell);				
					
					var oControl = oController.makeControl(oController, Fieldtype, Fieldname, vMaxLength, vLabel, vUpdateValue, vUpdateTextValue, vChangeData, vDefaultValues);
					
					oCell = new sap.ui.commons.layout.MatrixLayoutCell({
						hAlign : sap.ui.commons.layout.HAlign.Begin,
						vAlign : sap.ui.commons.layout.VAlign.Middle,
						content : oControl
					}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
					oRow.addCell(oCell);
					
					c_idx++;
				}
			}
			if(c_idx > 0) {
				if(oRow.getCells().length == 2) {
					oRow.addCell(new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("L2PInputTableLabel L2PPaddingLeft10"));
					oRow.addCell(new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("L2PInputTableData L2PPaddingLeft10"));
				}
				oControlMatrix.addRow(oRow);
			}
//			oControlMatrix.addRow(oRow);
		
			oTempLayout.addContent(oToolbar);		
			oTempLayout.addContent(oControlMatrix);			
		}
		oRequestPanel.addContent(oTempLayout);			
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_TABLE");
		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_COLUMNLIST");
		if(vCernoI == ""){
			// 재입사 이며 , 수정 화면일 경우
			if(oController._pDataSub08 != "0" && oController._pDataSub08 != ""  && vChangeData != null){
				vCernoI = vChangeData.Idnum;
			}
		}
		if(vCernoI != "") {
			oTable.bindItems("/RecruitingSubjectsGroupWorkingHistorySet", oColumnList, null, [new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno) ,
			                                                                                  new sap.ui.model.Filter("Cerno", sap.ui.model.FilterOperator.EQ, vCernoI)]);
		} else {
			oTable.bindItems("/RecruitingSubjectsGroupWorkingHistorySet", oColumnList, null, null);
		}
		
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
				if(oTelControl.val().indexOf("+") == -1) {
					if(oTelControl.intlTelInput("getSelectedCountryData").dialCode) {
						vVal = "+" + oTelControl.intlTelInput("getSelectedCountryData").dialCode + " " + oTelControl.val();
					} else {
						vVal = oTelControl.val();
					}
				} else {
					vVal = oTelControl.val();
				}
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var vOneData = {
				Docno : oController._vDocno,
				Recno : oController._vRecno,
				VoltId : oController._vVoltId,
				Persa : oController._vPersa,
				Reqno : oController._vReqno,
				Actda : oController._vActda == "" || oController._vActda == "0NaN-NaN-NaN" ? null : "\/Date(" + common.Common.getTime(oController._vActda) + ")\/"
		};
		
		var oIdNumControl = null;
		
		for(var i=0; i<oController._vHiringPersonalInfomationLayout.length; i++) {
			var Fieldname = oController._vHiringPersonalInfomationLayout[i].Fieldname;
			var Fieldtype = oController._vHiringPersonalInfomationLayout[i].Incat;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			var TextFieldname = Fieldname + "tx";
			var vLabel = oController._vHiringPersonalInfomationLayout[i].Label;
			
			var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_" + Fieldname);
			if(typeof oControl != "object") {
				continue;
			}
			
			var vValue = "";
			
			if(Fieldtype == "M1") {				
				vValue = oControl.getSelectedKey();					
				if(vValue == "" || vValue == "0000") {
					oControl.addStyleClass("L2PSelectInvalidBorder");
					var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_SEL");							
					vMsg = vMsg.replace("&Cntl", vLabel);
					sap.m.MessageBox.alert(vMsg);
					return false;
				} else {
					oControl.removeStyleClass("L2PSelectInvalidBorder");
					eval("vOneData." + Fieldname + " = vValue; ");
				}
			} else if(Fieldtype == "M2" || Fieldtype == "M5") {
				var oCustomData = oControl.getCustomData();
				if(oCustomData && oCustomData.length) {
					for(var c=0; c<oCustomData.length; c++) {
						if(oCustomData[c].getKey() == Fieldname) {
							vValue = oCustomData[c].getValue();
						}
					}
				}
				var vValueText = oControl.getValue();
				
				if(vValue == "" || vValue == "0000") {
					oControl.setValueState(sap.ui.core.ValueState.Error);
					var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_SEL");							
					vMsg = vMsg.replace("&Cntl", vLabel);
					sap.m.MessageBox.alert(vMsg);
					return false;
				} else {
					oControl.setValueState(sap.ui.core.ValueState.None);
					eval("vOneData." + Fieldname + " = vValue; ");
					eval("vOneData." + TextFieldname + " = vValueText; ");
				}
			} else if(Fieldtype == "M3") {
				vValue = oControl.getValue();
				if(vValue == "") {
					oControl.setValueState(sap.ui.core.ValueState.Error);
					var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");							
					vMsg = vMsg.replace("&Cntl", vLabel);
					sap.m.MessageBox.alert(vMsg);
					return false;
				} else {
//					if(oController._vMolga == "10" && (Fieldname == "Idnum" || Fieldname == "Perid")) {
//						vValue = vValue.replace(/-/g, "");
//						if(vValue.length != 9) {
//							sap.m.MessageBox.alert("must enter a 9 digit SSN.");
//							return false;
//						}
//					}
					
					if(oController._vMolga == "08" && (Fieldname == "Idnum" || Fieldname == "Perid")) {
						vValue = vValue.toUpperCase();
					}
					
					oControl.setValueState(sap.ui.core.ValueState.None);
					eval("vOneData." + Fieldname + " = vValue; ");
					
					if(Fieldname == "Idnum" || Fieldname == "Perid" || Fieldname == "Numss") {
						vOneData.Idnum = vValue;
						oIdNumControl = oControl;
					}
				}
			} else if(Fieldtype == "M4") {
				vValue = oControl.getValue();					
				if(vValue == "") {
					oControl.setValueState(sap.ui.core.ValueState.Error);
					var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");							
					vMsg = vMsg.replace("&Cntl", vLabel);
					sap.m.MessageBox.alert(vMsg);
					return false;
				} else {
					oControl.setValueState(sap.ui.core.ValueState.None);
					eval("vOneData." + Fieldname + " = vValue == '' || vValue == '0NaN-NaN-NaN' ? null : '\/Date(' + common.Common.getTime(vValue) + ')\/'; ");
				}
			} else if(Fieldtype == "M6") {
				if(oControl.getSelected() == false) {
					oControl.setValueState(sap.ui.core.ValueState.Error);
					var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_SEL");							
					vMsg = vMsg.replace("&Cntl", vLabel);
					sap.m.MessageBox.alert(vMsg);
					return false;
				} else {
					oControl.setValueState(sap.ui.core.ValueState.None);
					eval("vOneData." + Fieldname + " = 'X';");
				}
			} else if(Fieldtype == "M7") {	
				vValue = oController.getTelNum(oControl.getId());
				
				if(vValue == "WrongNum") return false;
				if( vValue == "") {
					oControl.setValueState(sap.ui.core.ValueState.Error);
					var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");
					vMsg = vMsg.replace("&Cntl", vLabel);
					sap.m.MessageBox.alert(vMsg);
					return false;
				} else {
					oControl.setValueState(sap.ui.core.ValueState.None);	
					eval("vOneData." + Fieldname + " = vValue; ");
				}
			} else if(Fieldtype == "M8") {
				if(oControl.getSelectedIndex() == -1) {
					var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_SEL");							
					vMsg = vMsg.replace("&Cntl", vLabel);
					sap.m.MessageBox.alert(vMsg);
					return false;
				} else {
					var oRadio = oControl.getSelectedButton();
					if(oRadio) {
						vValue = oRadio.getCustomData()[0].getValue();
						eval("vOneData." + Fieldname + " = vValue;");
					}
				}
			} else if(Fieldtype == "O1") {			
				vValue = oControl.getSelectedKey();		
				if(vValue == "0000") vValue = "";
				eval("vOneData." + Fieldname + " = vValue; ");
			} else if(Fieldtype == "O2" || Fieldtype == "O5") {
				var oCustomData = oControl.getCustomData();
				if(oCustomData && oCustomData.length) {
					for(var c=0; c<oCustomData.length; c++) {
						if(oCustomData[c].getKey() == Fieldname) {
							vValue = oCustomData[c].getValue();
						}
					}
				}
				var vValueText = oControl.getValue();
				
				eval("vOneData." + Fieldname + " = vValue; ");
				eval("vOneData." + TextFieldname + " = vValueText; ");
			} else if(Fieldtype == "O3") {
				vValue = oControl.getValue();	
				if(Fieldname == "Nip00"){
					if(vValue != "") {
						var vTempValue = vValue;
						while(vTempValue.indexOf("-") != -1){
							vTempValue = vTempValue.replace("-","");
						} 
						vOneData.Nip00 = vTempValue;
					}else
						vOneData.Nip00 = "";
				}else{
					if(vValue != "") {
						eval("vOneData." + Fieldname + " = vValue; ");
					}
				}
			} else if(Fieldtype == "O4") {
				vValue = oControl.getValue();					
				eval("vOneData." + Fieldname + " = vValue == '' || vValue == '0NaN-NaN-NaN' ? null : '\/Date(' + common.Common.getTime(vValue) + ')\/'; ");
			} else if(Fieldtype == "O6") {
				if(oControl.getSelected() == true) {
					eval("vOneData." + Fieldname + " = 'X';");
				} else {
					eval("vOneData." + Fieldname + " = '';");
				}
			} else if(Fieldtype == "O7") {
				vValue = oController.getTelNum(oControl.getId());
				if(vValue == "WrongNum") return false;
				oControl.setValueState(sap.ui.core.ValueState.None);	
				eval("vOneData." + Fieldname + " = vValue; ");
			} else if(Fieldtype == "O8") {
				var oRadio = oControl.getSelectedButton();
				if(oRadio) {
					vValue = oRadio.getCustomData()[0].getValue();
					eval("vOneData." + Fieldname + " = vValue;");
				}
			} else if(Fieldtype == "D0" || Fieldtype == "D1") {
				vValue = oControl.getValue();					
				eval("vOneData." + Fieldname + " = vValue; ");
			} 
		}
		
		if(oController.checkPostalCode("_Sub01_Land1", "_Sub01_State", "_Sub01_Pstlz") == false) {
			return;
		}
		
		if(oController.checkCountryIdNum(vOneData, oIdNumControl) == false) {
			return;
		}
		// 자녀 수 특수문자 체크
		if(oController.checkNum("Anzkd" , vOneData.Anzkd, oController) == false) {
			return;
		}
		
		//재입사 일본의 경우
		if(oController._vMolga == "22" && oController._vJapanIdnum != "") {
			vOneData.Idnum = oController._vJapanIdnum;
		}
		
		var process_result = false;
		var oPath = "/RecruitingSubjectsSet";
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		switch(oController._vActionType) {
			case "C" :
				
				if(oController._fRehireStatus == true) {
					oController.onOpenRehireDataSelect(vOneData);
				} else {
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
				}
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
						oController._fRehireStatus = false;
						oController.setSub01();
//						oController.setTelField(oController);
						oController.setActionButton();
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
		});
	},
	
//  학력사항 입력화면 Setting.
	setSub02 : function(oContext) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Begda");
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Endda");
		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Slart");
		var oSlabs = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Slabs");
		var oSland = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sland");
		var oSchcd = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Schcd");
		var oSltp1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sltp1");
		var oSltp2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sltp2");
		var oZzquali = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Zzquali");
		
		// 값 초기화
		if(oController._vMolga == "08") {
			oBegda.setValue("1900-01-01");
		} else {
			oBegda.setValue("");
		}
		
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
    	oZzquali.setValue("");
		oZzquali.removeAllCustomData();
		oZzquali.addCustomData(new sap.ui.core.CustomData({key : "Zzquali", value : ""}));
		oController.onClearFaartFields(oController);
		
		// 쓰기 초기화
		oBegda.setEnabled(!oController._DISABLED);
		oEndda.setEnabled(!oController._DISABLED);
		oSlart.setEnabled(!oController._DISABLED);
		oSlabs.setEnabled(!oController._DISABLED);
		oSland.setEnabled(!oController._DISABLED);
		oSchcd.setEnabled(!oController._DISABLED);
		oSltp1.setEnabled(!oController._DISABLED);
		oSltp2.setEnabled(!oController._DISABLED);
		oZzquali.setEnabled(!oController._DISABLED);
		
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
			
			var oSltp1Label = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sltp1_Label");
			if(oSlart.getSelectedKey() == "Z4" || oSlart.getSelectedKey() == "Z5") {
				oSltp1Label.setRequired(true);
			} else {
				oSltp1Label.setRequired(false);
			}
			
			var oCell1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Zzquali_cell1");
			if(oCell1.hasStyleClass("L2PDisplayNone")){}
			else{
				oZzquali.setValue(oContext[0].getProperty("Zzqualitx"));
				oZzquali.removeAllCustomData();
				oZzquali.addCustomData(new sap.ui.core.CustomData({key : "Zzquali", value : oContext[0].getProperty("Zzquali")}));
			}
		}
		
		var oCell1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Zzquali_cell1");
		var oCell2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Zzquali_cell2");
		if(oController._vMolga == "08" || oController._vMolga == "46"){
			oCell1.removeStyleClass("L2PDisplayNone");
			oCell2.removeStyleClass("L2PDisplayNone");
		}else{
			oCell1.addStyleClass("L2PDisplayNone");
			oCell2.addStyleClass("L2PDisplayNone");
		}
	},

//	학력사항 저장
	saveSub02 : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Begda");
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Endda");
		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Slart");
		var oSlabs = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Slabs");
		var oSland = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sland");
		var oSchcd = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Schcd");
		var oSltp1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sltp1");
		var oSltp2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sltp2");
		var oZzquali = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Zzquali");

		
		oBegda.setValueState(sap.ui.core.ValueState.None);
		oEndda.setValueState(sap.ui.core.ValueState.None);
		oSlart.removeStyleClass("L2PSelectInvalidBorder");
		oSlabs.removeStyleClass("L2PSelectInvalidBorder");
		oSland.setValueState(sap.ui.core.ValueState.None);
		oSchcd.setValueState(sap.ui.core.ValueState.None);
		oSltp1.setValueState(sap.ui.core.ValueState.None);
		
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
				Schcd : oSchcd.getCustomData().length ? oSchcd.getCustomData()[0].getValue("Schcd") : "",
				Insti : oSchcd.getValue(),
				Sltp1 : oSltp1.getCustomData().length ? oSltp1.getCustomData()[0].getValue() : "",
				Ftxt1 : oSltp1.getValue(),
				Sltp2 : oSltp2.getCustomData().length ? oSltp2.getCustomData()[0].getValue() : "",
				Ftxt2 : oSltp2.getValue(),
				Zzsltp1tx : oSltp1.getValue(),
				Zzsltp2tx : oSltp2.getValue(),
				Zzquali : oZzquali.getCustomData().length ? oZzquali.getCustomData()[0].getValue() : "",
				Zzqualitx : oZzquali.getValue()
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
		
		if(vOneData.Slart == "Z4" || vOneData.Slart == "Z5") {
			if(vOneData.Ftxt1 == "") {
				oSltp1.setValueState(sap.ui.core.ValueState.Error);
				var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_SEL");							
				vMsg = vMsg.replace("&Cntl", oBundleText.getText("SLTP1"));
				sap.m.MessageBox.alert(vMsg);
				return;
			}
		}
		
		var process_result = false;
		var oPath = "/RecruitingSubjectsEducationSet";
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Begda");
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Endda");
		var oLand1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Land1");
//		var oZzlndep = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Zzlndep");
		var oArbgb = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Arbgb");
		var oZzjbttx = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Zzjbttx");
		var oZzstell = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Zzstell");
		
		// 값 초기화
		oBegda.setValue("");
		oBegda.removeAllCustomData();
		oBegda.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : ""}));
		oEndda.setValue("");
		oLand1.setValue(oController._vDeafultContry.Land1tx);
		oLand1.removeAllCustomData();
		oLand1.addCustomData(new sap.ui.core.CustomData({key : "Land1", value : oController._vDeafultContry.Land1}));
//		oZzlndep.setValue("");
		oArbgb.setValue("");
		oZzjbttx.setValue("");
		oZzstell.setValue("");
		oZzstell.removeAllCustomData();
		oZzstell.addCustomData(new sap.ui.core.CustomData({key : "Zzstell", value : ""}));

		// 쓰기 초기화
		oBegda.setEnabled(!oController._DISABLED);
		oEndda.setEnabled(!oController._DISABLED);
		oLand1.setEnabled(!oController._DISABLED);
//		oZzlndep.setEnabled(!oController._DISABLED);
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
//			oZzlndep.setValue(oContext[0].getProperty("Zzlndep"));
			oArbgb.setValue(oContext[0].getProperty("Arbgb"));
			oZzjbttx.setValue(oContext[0].getProperty("Zzjbttx"));
			oZzstell.setValue(oContext[0].getProperty("Stltx"));
			oZzstell.removeAllCustomData();
			var vStell = oContext[0].getProperty("Zzstell");
			if(vStell == "00000000") vStell = "";
			oZzstell.addCustomData(new sap.ui.core.CustomData({key : "Zzstell", value : vStell}));
		}
	},

//	경력사항 저장
	saveSub03 : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oBegda = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Begda");
		var oEndda = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Endda");
		var oLand1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Land1");
//		var oZzlndep = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Zzlndep");
		var oArbgb = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Arbgb");
		var oZzjbttx = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Zzjbttx");
		var oZzstell = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Zzstell");
		
		oBegda.setValueState(sap.ui.core.ValueState.None);
		oEndda.setValueState(sap.ui.core.ValueState.None);
		oLand1.setValueState(sap.ui.core.ValueState.None);
//		oZzlndep.setValueState(sap.ui.core.ValueState.None);
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
//				Zzlndep	: oZzlndep.getValue(),	
				Arbgb : oArbgb.getValue(),
				Zzjbttx	: oZzjbttx.getValue(),
		};
		
		var oArbgbCustomData = oArbgb.getCustomData();
		if(oArbgbCustomData && oArbgbCustomData.length) {
			vOneData.Zzarbgb = oArbgbCustomData[0].getValue();
		} else {
			vOneData.Zzarbgb = "";
		}
		
		var oStellCustomData = oZzstell.getCustomData();
		if(oStellCustomData && oStellCustomData.length) {
			vOneData.Zzstell = oStellCustomData[0].getValue();
		} else {
			vOneData.Zzstell = "";
		}
		
		//  입사일자(Begda)
		if(vOneData.Begda == null) {
			oBegda.setValueState(sap.ui.core.ValueState.Error);
			var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");							
			vMsg = vMsg.replace("&Cntl", oBundleText.getText("ENTDA"));
			sap.m.MessageBox.alert(vMsg);
			return;
		}
		
		// 퇴사일자(Endda)
		if(vOneData.Endda == null) {
			oEndda.setValueState(sap.ui.core.ValueState.Error);
			var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");							
			vMsg = vMsg.replace("&Cntl", oBundleText.getText("RETDA"));
			sap.m.MessageBox.alert(vMsg);
			return;
		}
		
		if(new Date(oBegda.getValue()) > new Date(oController._vActda)) {
			oBegda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("JOIN_EARLIER_ACTDA"));
			return;
		}
		
		if(new Date(oEndda.getValue()) > new Date(oController._vActda)) {
			oEndda.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("LEAVE_EARLIER_ACTDA"));
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
		
		if(vOneData.Zzstell == "") {
			oZzstell.setValueState(sap.ui.core.ValueState.Error);
			var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_SEL");							
			vMsg = vMsg.replace("&Cntl", oBundleText.getText("STELL"));
			sap.m.MessageBox.alert(vMsg);
			return;
		}
		
		var process_result = false;
		var oPath = "/RecruitingSubjectsCareerSet";
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
				Cttyp : oCttyp.getCustomData().length ? oCttyp.getCustomData()[0].getValue("Cttyp") : "",
				Cttyptx : oCttyp.getValue(),
				Ctbeg : oCerda.getValue() == "" ? null : "\/Date(" + common.Common.getTime(oCerda.getValue()) + ")\/",
				Ctend : oCtend.getValue() == "" ? null : "\/Date(" + common.Common.getTime(oCtend.getValue()) + ")\/",
				Ctnum : oCtnum.getValue(),
				Isaut : oIsaut.getValue()
		};
		
		// 자격증유형(Cttyp)
		if(vOneData.Cttyp == "" && vOneData.Cttyptx == "") {
			oCttyp.setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_CTTYP"));
			return;
		}
		
		// 자격증번호(Ctnum)
//		if(vOneData.Ctnum == "") {
//			oCtnum.setValueState(sap.ui.core.ValueState.Error);
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_CTNUM"));
//			return;
//		}
		
		// 취득일(Cerda) oBundleText.getText("CERDA")
		if(vOneData.Ctbeg == null) {
			oCerda.setValueState(sap.ui.core.ValueState.Error);
			var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");
			vMsg = vMsg.replace("&Cntl", oBundleText.getText("CERDA"));
			sap.m.MessageBox.alert(vMsg);
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
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
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
	
	deleteSub07 : function(oEvent) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
	
/////////////////////////////////////////////////////////////////////////////////////////////
// Sub24 은행사항을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////		
	//  은행사항을 가지고 온다.
	reloadSub24 : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_TABLE");
		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_COLUMNLIST");
		
		var oFilters = [];	
	    oFilters.push(new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno));
	    oFilters.push(new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, oController._vVoltId));
	
		oTable.bindItems("/RecruitingSubjectsBankSet", oColumnList, null, oFilters);
		
		oTable.attachUpdateFinished(function() {
			oController._vCntSub24 = oTable.getItems().length;
			oController.setCountTabBar(oController, "Sub24");
		});
	},
	
//  Banking 사항 입력화면 Setting.
	setSub24 : function(oContext) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var vMolga = "";		
		if(oController._vMolga == "08" || oController._vMolga == "AE") vMolga = "08";
		else vMolga = "10";
		
		var oEmftx = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Emftx");
		var oBkplz = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bkplz");
		var oBkort = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bkort");
		var oBanks = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Banks");
		var oBankl = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bankl");
		var oBankn = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bankn");
		var oBkont = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bkont");
		var oZlsch = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Zlsch");
		var oWaers = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Waers");
		var oPskto = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Pskto");		
		var oBetrg = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Betrg");
		var oAnzhl = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Anzhl");
		
		var vInitBanks = "";
		var vInitBankstx = "";
		var vInitWaers = "";
		var vInitZlsch = "0000";
		
		if(oController._vBankDefaultValue) {
			vInitBanks = oController._vBankDefaultValue.Banks;
			vInitBankstx = oController._vBankDefaultValue.Bankstx;
			vInitWaers = oController._vBankDefaultValue.Waers;
			vInitZlsch = oController._vBankDefaultValue.Zlsch;
		}
		
		var oNameLayoutText = sap.ui.getCore().byId(oController.PAGEID + "_NameLayoutText");
		
		// 값 초기화
		oEmftx.setValue(oNameLayoutText.getText());
		oEmftx.removeAllCustomData();
		oEmftx.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : ""}));
		
		if(oBkplz) oBkplz.setValue("");
		if(oBkort) oBkort.setValue("");
		if(oPskto) oPskto.setValue("");
		
		oBanks.setValue(vInitBankstx);
		oBanks.removeAllCustomData();
		oBanks.addCustomData(new sap.ui.core.CustomData({key : "Banks", value : vInitBanks}));
		oBankl.setValue("");
		oBankl.removeAllCustomData();
		oBankl.addCustomData(new sap.ui.core.CustomData({key : "Bankl", value : ""}));
		
		oBankn.setValue("");
		
		if(oBkont) oController.setBkont("0000", oBkont);
		
		oController.setZlsch(vInitBanks, vInitZlsch);
		
		oWaers.setValue(vInitWaers);
		oWaers.removeAllCustomData();
		oWaers.addCustomData(new sap.ui.core.CustomData({key : "Waers", value : vInitWaers}));
		
		if(oBetrg) oBetrg.setValue("");		
		if(oAnzhl) oAnzhl.setValue("");
		
		// 쓰기 초기화
		oEmftx.setEnabled(!oController._DISABLED);
		if(oBkplz) oBkplz.setEnabled(!oController._DISABLED);
		if(oBkort) oBkort.setEnabled(!oController._DISABLED);
		oBanks.setEnabled(!oController._DISABLED);
		oBankl.setEnabled(!oController._DISABLED);
		oBankn.setEnabled(!oController._DISABLED);
		if(oBkont) oBkont.setEnabled(!oController._DISABLED);
		oZlsch.setEnabled(!oController._DISABLED);
		if(oPskto) oPskto.setEnabled(!oController._DISABLED);
		if(oBetrg) oBetrg.setEnabled(!oController._DISABLED);
		if(oAnzhl) oAnzhl.setEnabled(!oController._DISABLED);
		
		var oAddInfo = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_AddInfo");
		
		var vOtherBankLabel = "Other Bank Information";
		if(oController._vMolga == "08" || oController._vMolga == "AE") {
			vOtherBankLabel = "Travel Expenses Information";
		} 
		
		var oPanelLabel = sap.ui.getCore().byId(oController.PAGEID + "_POP_Sub24_" + vMolga + "_PanelLabel");
		
		if(oContext != null) {
			oEmftx.setValue(oContext[0].getProperty("Emftx"));
			oEmftx.removeAllCustomData();
			oEmftx.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : oContext[0].getProperty("Seqnr")}));
			
			if(oBkplz) oBkplz.setValue(oContext[0].getProperty("Bkplz"));
			if(oBkort) oBkort.setValue(oContext[0].getProperty("Bkort"));
			
			if(oPskto) oPskto.setValue(oContext[0].getProperty("Pskto"));
			
			oBanks.setValue(oContext[0].getProperty("Bankstx"));
			oBanks.removeAllCustomData();
			oBanks.addCustomData(new sap.ui.core.CustomData({key : "Banks", value : oContext[0].getProperty("Banks")}));
			oBankl.setValue(oContext[0].getProperty("Bankltx"));
			oBankl.removeAllCustomData();
			oBankl.addCustomData(new sap.ui.core.CustomData({key : "Bankl", value : oContext[0].getProperty("Bankl")}));
			
			oBankn.setValue(oContext[0].getProperty("Bankn"));
			
			if(oBkont) oController.setBkont(oContext[0].getProperty("Bkont"), oBkont);
			
			oController.setZlsch(oContext[0].getProperty("Banks"), oContext[0].getProperty("Zlsch"));
			
			oWaers.setValue(oContext[0].getProperty("Waers"));
			oWaers.removeAllCustomData();
			oWaers.addCustomData(new sap.ui.core.CustomData({key : "Waers", value : oContext[0].getProperty("Waers")}));
			
			if(oBetrg) oBetrg.setValue(oContext[0].getProperty("Betrg"));
			if(oAnzhl) oAnzhl.setValue(oContext[0].getProperty("Anzhl"));
			
			if(oContext[0].getProperty("Bnksa") == "1") {
				if(oAddInfo) oAddInfo.removeStyleClass("L2PDisplayNone");
				oPanelLabel.setText(vOtherBankLabel);
			} else {
				if(oAddInfo) oAddInfo.addStyleClass("L2PDisplayNone");
				oPanelLabel.setText("Main Bank Information");
			}
		} else {
			if(oController._vCntSub24 == 0) {
				if(oAddInfo) oAddInfo.addStyleClass("L2PDisplayNone");
				oPanelLabel.setText("Main Bank Information");
			} else {
				if(oAddInfo) oAddInfo.removeStyleClass("L2PDisplayNone");
				oPanelLabel.setText(vOtherBankLabel);
			}
		}	
	},
	
//	Banking 사항 저장
	saveSub24 : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var vMolga = "";		
		if(oController._vMolga == "08" || oController._vMolga == "AE") vMolga = "08";
		else vMolga = "10";
		
		var oEmftx = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Emftx");
		var oBkplz = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bkplz");
		var oBkort = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bkort");
		var oBanks = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Banks");
		var oBankl = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bankl");
		var oBankn = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bankn");
		var oBkont = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Bkont");
		var oZlsch = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Zlsch");
		var oWaers = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Waers");
		var oPskto = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Pskto");	
		var oBetrg = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Betrg");
		var oAnzhl = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_" + vMolga + "_Anzhl");
		
		var lBankl = sap.ui.getCore().byId(oController.PAGEID + "_Label_Sub24_" + vMolga + "_Bankl");
		var lBankn = sap.ui.getCore().byId(oController.PAGEID + "_Label_Sub24_" + vMolga + "_Bankn");
		
		var oAddInfo = sap.ui.getCore().byId(oController.PAGEID + "_Sub24_AddInfo");
		
		oEmftx.setValueState(sap.ui.core.ValueState.None);
		if(oBkplz) oBkplz.setValueState(sap.ui.core.ValueState.None);
		if(oBkort) oBkort.setValueState(sap.ui.core.ValueState.None);
		oBanks.setValueState(sap.ui.core.ValueState.None);
		oBankl.setValueState(sap.ui.core.ValueState.None);
		oBankn.setValueState(sap.ui.core.ValueState.None);
		if(oBkont) oBkont.removeStyleClass("L2PSelectInvalidBorder");
		oZlsch.removeStyleClass("L2PSelectInvalidBorder");
		oWaers.setValueState(sap.ui.core.ValueState.None);
		if(oPskto) oPskto.setValueState(sap.ui.core.ValueState.None);
		if(oBetrg) oBetrg.setValueState(sap.ui.core.ValueState.None);
		if(oAnzhl) oAnzhl.setValueState(sap.ui.core.ValueState.None);
		
		var vOneData = {
				Docno : oController._vDocno,
				Recno : oController._vRecno,
				VoltId : oController._vVoltId,
				Seqnr : oController._vSelectedContext ? oController._vSelectedContext[0].getProperty("Seqnr") : "",
				Bnksa : oController._vSelectedContext ? oController._vSelectedContext[0].getProperty("Bnksa") : "",
				Emftx : oEmftx.getValue(),
				Banks : oBanks.getCustomData().length ? oBanks.getCustomData()[0].getValue() : "",
				Bankl : oBankl.getCustomData().length ? oBankl.getCustomData()[0].getValue() : "",
				Bankn : oBankn.getValue(),
				Zlsch : oZlsch.getSelectedKey() == "0000" ? "" : oZlsch.getSelectedKey(),
				Waers : oWaers.getValue(),		
		};
		
		if(oBkplz) vOneData.Bkplz = oBkplz.getValue();
		if(oBkort) vOneData.Bkort = oBkort.getValue();
		if(oPskto) vOneData.Pskto = oPskto.getValue();
		if(oBkont) vOneData.Bkont = oBkont.getSelectedKey() == "0000" ? "" : oBkont.getSelectedKey();
		
		if(oBetrg) vOneData.Betrg = oBetrg.getValue() == "" ? "0" : oBetrg.getValue();
		if(oAnzhl) vOneData.Anzhl = oAnzhl.getValue() == "" ? "0" : oAnzhl.getValue();
		
		// 예금주
		if(vOneData.Emftx == "") {
			oEmftx.setValueState(sap.ui.core.ValueState.Error);
			var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");
			vMsg = vMsg.replace("&Cntl", oBundleText.getText("Emftx".toUpperCase()));
			sap.m.MessageBox.alert(vMsg);
			return;
		}
		
		// Bnak Key
		if(lBankl.getRequired() == true && vOneData.Bankl == "") {
			oBankl.setValueState(sap.ui.core.ValueState.Error);
			var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");
			vMsg = vMsg.replace("&Cntl", oBundleText.getText("Bankl".toUpperCase()));
			sap.m.MessageBox.alert(vMsg);
			return;
		}
		
		// 계좌번호
		if(lBankn.getRequired() == true && vOneData.Bankn == "") {
			oBankn.setValueState(sap.ui.core.ValueState.Error);
			var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");
			vMsg = vMsg.replace("&Cntl", oBundleText.getText("Bankn".toUpperCase()));
			sap.m.MessageBox.alert(vMsg);
			return;
		}
		
		// Bank Control Key
		if(oController._vMolga != "08" && oController._vMolga != "AE") {
			if(vOneData.Bkont == "") {
				oBkont.addStyleClass("L2PSelectInvalidBorder");
				var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_SEL");
				vMsg = vMsg.replace("&Cntl", oBundleText.getText("Bkont".toUpperCase()));
				sap.m.MessageBox.alert(vMsg);
				return;
			}
		}
		
		// 지급 통화
		if(vOneData.Waers == "") {
			oWaers.setValueState(sap.ui.core.ValueState.Error);
			var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");
			vMsg = vMsg.replace("&Cntl", oBundleText.getText("Waers24".toUpperCase()));
			sap.m.MessageBox.alert(vMsg);
			return;
		}
		
		// 표준값
		if(oController._vCntSub24 > 0) {
			if(vOneData.Bnksa != "0") {
				if(oController._vMolga != "08" && oController._vMolga != "AE") {
					if((parseFloat(vOneData.Betrg) != 0.0 && parseFloat(vOneData.Anzhl) != 0.0) || (parseFloat(vOneData.Betrg) == 0.0 && parseFloat(vOneData.Anzhl) == 0.0)) {
						oBetrg.setValueState(sap.ui.core.ValueState.Error);
						sap.m.MessageBox.alert("Please enter either standard value or standard percentage.");
						return;
					}
				}
			}
		}
		
		var process_result = false;
		var oPath = "/RecruitingSubjectsBankSet";
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
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
					oController.reloadSub24();
					oController.onClose();
				}
			});
		}
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////
// Sub22 어학능력 사항을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////		
//  어학능력사항을 가지고 온다.
	reloadSub22 : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Sub22_TABLE");
		var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_Sub22_COLUMNLIST");
		
		var oFilters = [];	
	    oFilters.push(new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno));
	    oFilters.push(new sap.ui.model.Filter("VoltId", sap.ui.model.FilterOperator.EQ, oController._vVoltId));
	
		oTable.bindItems("/RecruitingSubjectsLangSkillSet", oColumnList, null, oFilters);
		
		oTable.attachUpdateFinished(function() {
			oController._vCntSub22 = oTable.getItems().length;
			oController.setCountTabBar(oController, "Sub22");
		});
	},	
	
//  어학능력 사항 입력화면 Setting.
	setSub22 : function(oContext) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oQuali = sap.ui.getCore().byId(oController.PAGEID + "_Sub22_Quali");
		var oAuspr = sap.ui.getCore().byId(oController.PAGEID + "_Sub22_Auspr");
		
		// 값 초기화
		oQuali.setSelectedKey("0000");
//		oQuali.removeAllCustomData();
//		oQuali.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : ""}));
		oAuspr.setSelectedKey("0000");

		// 쓰기 초기화
		oQuali.setEnabled(!oController._DISABLED);
		oAuspr.setEnabled(!oController._DISABLED);
		
		if(oContext != null) {
			oQuali.setSelectedKey(oContext[0].getProperty("Quali"));
//			oQuali.removeAllCustomData();
//			oQuali.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : oContext[0].getProperty("Seqnr")}));
			
			oAuspr.setSelectedKey(oContext[0].getProperty("Auspr"));
//			oAuspr.removeAllCustomData();
//			oAuspr.addCustomData(new sap.ui.core.CustomData({key : "Seqnr", value : oContext[0].getProperty("Seqnr")}));
		}
	},
	
//	어학능력 사항 저장
	saveSub22 : function() {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oQuali = sap.ui.getCore().byId(oController.PAGEID + "_Sub22_Quali");
		var oAuspr = sap.ui.getCore().byId(oController.PAGEID + "_Sub22_Auspr");
		
		oQuali.removeStyleClass("L2PSelectInvalidBorder");
		oAuspr.removeStyleClass("L2PSelectInvalidBorder");
		
		var vOneData = {
				Docno : oController._vDocno,
				Recno : oController._vRecno,
				VoltId : oController._vVoltId,
				Seqnr : oController._vSelectedContext ? oController._vSelectedContext[0].getProperty("Seqnr") : "",
				Quali : oQuali.getSelectedKey() == "0000" ? "" : oQuali.getSelectedKey(),
				Auspr : oAuspr.getSelectedKey() == "0000" ? "" : oAuspr.getSelectedKey(),
		};
		
		// 언어
		if(vOneData.Quali == "") {
			oQuali.addStyleClass("L2PSelectInvalidBorder");
			var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_SEL");
			vMsg = vMsg.replace("&Cntl", oBundleText.getText("AUSPR".toUpperCase()));
			sap.m.MessageBox.alert(vMsg);
			return;
		}
		
		// 숙련도
		if(vOneData.Auspr == "") {
			oAuspr.addStyleClass("L2PSelectInvalidBorder");
			var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_SEL");
			vMsg = vMsg.replace("&Cntl", oBundleText.getText("AUSPRTX".toUpperCase()));
			sap.m.MessageBox.alert(vMsg);
			return;
		}
		
		var process_result = false;
		var oPath = "/RecruitingSubjectsLangSkillSet";
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
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
					oController.reloadSub24();
					oController.onClose();
				}
			});
		}
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////
// Sub21 주소 정보 사항을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////
//  주소정보사항을 가지고 온다.
	readSub21 : function() {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var oAddressLayout = sap.ui.getCore().byId(oController.PAGEID + "_Sub21_LAYOUT");
		oAddressLayout.destroyContent();
		
		if(oController._vAnssaList.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_ADDRESS_1"));
			return;
		}
		
		if(oController._vAddressLayout.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_ADDRESS_2"));
			return;
		}
		
		oController._vSavedAddressList = [];
		oController._vEmecAddressList = [];
		oController._vAddressList = [];
		oModel.read("/RecruitingSubjectsAddressSet/?$filter=Docno eq '" + oController._vDocno + "' and "
				+ "VoltId eq '" +  oController._vVoltId + "'",
				null,
				null,
				false, 	
				function(oData, oResponse) {	
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							if(oData.results[i].Anssa == "4") {
								oController._vEmecAddressList.push(oData.results[i]);
							} else {
								oController._vSavedAddressList.push(oData.results[i]);
							}
							oController._vAddressList.push(oData.results[i]);
						}
					}
				},
				function(oResponse) {
					console.log(oResponse);
				}		
		);
		
		oController._vCntSub21 = oController._vAddressList.length;
		oController.setCountTabBar(oController, "Sub21");
		
		if(oController._vEmecAddressList.length < 1) {
			oController._vEmecAddressListCount = 1;
		} else {
			oController._vEmecAddressListCount = oController._vEmecAddressList.length;
		}
		
		for(var i=0; i<oController._vAnssaList.length; i++) {
			if(oController._vAnssaList[i].Ecode != "1") {
				oController.makeAddressPanel(oController, oController._vAnssaList[i], oAddressLayout);
			}
		}
	},
	
	makeAddressPanel : function(oController, AnssaInfo, oAddressLayout) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var oCell = null, oRow = null;
		
		var vSubty = AnssaInfo.Ecode;
		
		var vPrefix = vSubty;
		
		if(vSubty == "4") {
			vPrefix = vSubty + "_1";
		}
		
		var vSavedData = null;
		if(vSubty != 4) {
			for(var i=0; i<oController._vSavedAddressList.length; i++) {
				if(vSubty == oController._vSavedAddressList[i].Anssa) {
					vSavedData = oController._vSavedAddressList[i];
					break;
				}
			}
		} else {
			if(oController._vEmecAddressList.length > 0) {
				vSavedData = oController._vEmecAddressList[0];
			}
		}		
		
		var oOneAddressLayout = new sap.ui.commons.layout.MatrixLayout({
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		});
		
		var idx = 0;
		
		for(var i=0; i<oController._vAddressLayout.length; i++) {
			
			if((idx % 2) == 0) {
				if(idx != 0) {
					oOneAddressLayout.addRow(oRow);
				}
				oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			}
			
			if(vSubty == oController._vAddressLayout[i].Subty) {
				var Fieldname = oController._vAddressLayout[i].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "tx";
				
				var Fieldtype = oController._vAddressLayout[i].Inpty;
				
				if(oController._vMolga == "18" && (Fieldname == "Hsnmr" || Fieldname == "Posta")) {
					continue;
				}
				
				var vUpdateValue = "";
				var vUpdateTextValue = "";
				var vMaxLength = parseInt(oController._vAddressLayout[i].Length);
				
				if(vSavedData != null) {
					vUpdateValue = eval("vSavedData." + Fieldname);
					vUpdateTextValue = eval("vSavedData." + TextFieldname);
					
					if(vSavedData.Land1 == "") {
						vSavedData.Land1 = oController._vDeafultContry.Land1;
						vSavedData.Land1tx = oController._vDeafultContry.Land1tx;
					}
				}
				
				if(vUpdateValue == "") {
					if(Fieldname == "Land1") {
						vUpdateValue = oController._vDeafultContry.Land1;
						vUpdateTextValue = oController._vDeafultContry.Land1tx;
					}
					if(Fieldname == "Natio") {
						vUpdateValue = oController._vDeafultContry.Land1;
						vUpdateTextValue = oController._vDeafultContry.Natiotx;
					}
				}
				
				var vLabelText = oController._vAddressLayout[i].Label;
				
				var oLabel = new sap.m.Label({text : vLabelText});
				if(Fieldtype.substring(0, 1) == "M") {
					oLabel.setRequired(true);
				} else {
					oLabel.setRequired(false);
				}
				oLabel.addStyleClass("L2P13Font");
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [oLabel]
				}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
				oRow.addCell(oCell);
				
				var oControl = null;
				if((oController._vMolga == "10" || oController._vMolga == "07" ) && Fieldname == "Telnr") {
					oControl= oController.makeAddressTelnr10(oController, vPrefix, vSavedData, vMaxLength);
				} else {
					oControl = oController.makeAddressControl(oController, Fieldtype, Fieldname, vMaxLength, vLabelText, vUpdateValue, vUpdateTextValue, vSavedData, vPrefix);
				}
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : oControl
				}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
				oRow.addCell(oCell);
				
				idx++;
			}
			oOneAddressLayout.addRow(oRow);
		}
		
		if(idx > 0) {
			var oPanel = null;
			if(vSubty != "4") {
				oPanel = new sap.m.Panel(oController.PAGEID + "_Sub21_" + vSubty + "_Panel", {
					expandable : false,
					expanded : false,
					headerToolbar : new sap.m.Toolbar({
						design : sap.m.ToolbarDesign.Auto,
						content : [new sap.m.Label({text : AnssaInfo.Etext, design : "Bold"}).addStyleClass("L2P13Font"),
						           new sap.m.ToolbarSpacer({width:"20px"}),
						           new sap.m.Button({
						        	   icon : "sap-icon://delete", 
						        	   type:"Default", 
						        	   customData : {key : "Subty", value: vSubty},
						        	   press : oController.onEmptyAddressData})
						]
					}).addStyleClass("L2PToolbarNoBottomLine"),
				});
			} else {
				oPanel = new sap.m.Panel(oController.PAGEID + "_Sub21_" + vSubty + "_Panel", {
					expandable : false,
					expanded : false,
					headerToolbar : new sap.m.Toolbar({
						design : sap.m.ToolbarDesign.Auto,
						content : [new sap.m.Label({text : AnssaInfo.Etext, design : "Bold"}).addStyleClass("L2P13Font"),
						           new sap.m.ToolbarSpacer({width:"20px"}),
						           new sap.m.Button({icon : "sap-icon://add", type:"Default", press : oController.onAddEmecAddress}),
						           new sap.m.Button({icon : "sap-icon://less", type:"Default", press : oController.onDeleteEmecAddress}),
						           new sap.m.Button({
						        	   icon : "sap-icon://delete", 
						        	   type:"Default", 
						        	   customData : {key : "Subty", value: vSubty},
						        	   press : oController.onEmptyAddressData})
						]
					}).addStyleClass("L2PToolbarNoBottomLine"),
				});
			}			
			
			oPanel.addContent(oOneAddressLayout);
			
			if(vSubty == "4" && oController._vEmecAddressList.length > 1) {
				for(var e=1; e<oController._vEmecAddressList.length; e++) {
					var oOneEmecAddressLayout = oController.makeEmecAddressLayout(oController, (e+1), oController._vEmecAddressList[e]);
					if(oOneEmecAddressLayout) {
						oPanel.addContent(oOneEmecAddressLayout);
					}
				}				
			}
			
			oAddressLayout.addContent(oPanel);
		}
	},
	
	makeEmecAddressLayout : function(oController, e_idx, vEmecAddressList) {
		var oOneAddressLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_Sub21_4_" + e_idx + "_AddressLayout", {
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		}).addStyleClass("L2PMarginTop10");
		
		var idx = 0;
		
		var vSubty = "4";
		
		var oRow = null, oCell = null;
		
		for(var i=0; i<oController._vAddressLayout.length; i++) {
			
			if((idx % 2) == 0) {
				if(idx != 0) {
					oOneAddressLayout.addRow(oRow);
				}
				oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			}
			
			if(vSubty == oController._vAddressLayout[i].Subty) {
				var Fieldname = oController._vAddressLayout[i].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "tx";
				
				var Fieldtype = oController._vAddressLayout[i].Inpty;
				
				if(oController._vMolga == "18" && (Fieldname == "Hsnmr" || Fieldname == "Posta")) {
					continue;
				}
				
				var vUpdateValue = "";
				var vUpdateTextValue = "";
				var vMaxLength = parseInt(oController._vAddressLayout[i].Length);
				
				if(vEmecAddressList != null) {
					vUpdateValue = eval("vEmecAddressList." + Fieldname);
					vUpdateTextValue = eval("vEmecAddressList." + TextFieldname);
					
					if(vEmecAddressList.Land1 == "") vEmecAddressList.Land1 = oController._vDeafultContry.Land1;
				}
				
				if(vUpdateValue == "" && vUpdateTextValue == "") {
					if(Fieldname == "Natio" || Fieldname == "Land1") {
						vUpdateValue = oController._vDeafultContry.Land1;
						vUpdateTextValue = oController._vDeafultContry.Land1tx;
					}
				}
				
				var vLabelText = oController._vAddressLayout[i].Label;
				
				var oLabel = new sap.m.Label({text : oController._vAddressLayout[i].Label});
				if(Fieldtype.substring(0, 1) == "M") {
					oLabel.setRequired(true);
				} else {
					oLabel.setRequired(false);
				}
				oLabel.addStyleClass("L2P13Font");
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [oLabel]
				}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
				oRow.addCell(oCell);
				
				var oControl = null;
				if(oController._vMolga == "10" && Fieldname == "Telnr") {
					oControl = oController.makeAddressTelnr10(oController, vSubty + "_" + e_idx, vEmecAddressList, vMaxLength);
				} else {
					oControl = oController.makeAddressControl(oController, Fieldtype, Fieldname, vMaxLength, vLabelText, vUpdateValue, vUpdateTextValue, vEmecAddressList, vSubty + "_" + e_idx);
				}
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : oControl
				}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
				oRow.addCell(oCell);
				
				idx++;
			}
			oOneAddressLayout.addRow(oRow);
		}
		
		return oOneAddressLayout;
	},
	
	onAddEmecAddress : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oEmecAddressPanel = sap.ui.getCore().byId(oController.PAGEID + "_Sub21_4_Panel");
		
		oController._vEmecAddressListCount++;
		
		var oOneAddressLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_Sub21_4_" + oController._vEmecAddressListCount + "_AddressLayout", {
			width : "100%",
			layoutFixed : false,
			columns : 4,
			widths: ["15%","35%","15%","35%"],
		}).addStyleClass("L2PMarginTop10");
		
		var idx = 0;
		
		var vSubty = "4";
		
		var oRow = null, oCell = null;
		
		for(var i=0; i<oController._vAddressLayout.length; i++) {
			
			if((idx % 2) == 0) {
				if(idx != 0) {
					oOneAddressLayout.addRow(oRow);
				}
				oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			}
			
			if(vSubty == oController._vAddressLayout[i].Subty) {
				var Fieldname = oController._vAddressLayout[i].Fieldname;
				Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
				var TextFieldname = Fieldname + "_Tx";
				
				if(oController._vMolga == "18" && (Fieldname == "Hsnmr" || Fieldname == "Posta")) {
					continue;
				}
				
				var Fieldtype = oController._vAddressLayout[i].Inpty;
				
				var vUpdateValue = "";
				var vUpdateTextValue = "";
				var vMaxLength = parseInt(oController._vAddressLayout[i].Length);
				
				if(vUpdateValue == "" && vUpdateTextValue == "") {
					if(Fieldname == "Natio" || Fieldname == "Land1") {
						vUpdateValue = oController._vDeafultContry.Land1;
						vUpdateTextValue = oController._vDeafultContry.Land1tx;
					}
				}
				
				var vLabelText = oController._vAddressLayout[i].Label;
				
				var oLabel = new sap.m.Label({text : vLabelText});
				if(Fieldtype.substring(0, 1) == "M") {
					oLabel.setRequired(true);
				} else {
					oLabel.setRequired(false);
				}
				oLabel.addStyleClass("L2P13Font");
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : [oLabel]
				}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");		
				oRow.addCell(oCell);
				
				var oControl = null;
				if((oController._vMolga == "10" || oController._vMolga == "07" ) && Fieldname == "Telnr") {
					oControl = oController.makeAddressTelnr10(oController, vSubty + "_" + oController._vEmecAddressListCount, null, vMaxLength);
				} else {
					oControl = oController.makeAddressControl(oController, Fieldtype, Fieldname, vMaxLength, vLabelText, vUpdateValue, vUpdateTextValue, null, vSubty + "_" + oController._vEmecAddressListCount);
				}
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : sap.ui.commons.layout.HAlign.Begin,
					vAlign : sap.ui.commons.layout.VAlign.Middle,
					content : oControl
				}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
				oRow.addCell(oCell);
				
				idx++;
			}
			oOneAddressLayout.addRow(oRow);
		}

		oEmecAddressPanel.addContent(oOneAddressLayout);
	},
	
	onDeleteEmecAddress : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		if(oController._vEmecAddressListCount < 2) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_ADDRESS_3"));
			return;
		}
		
		var oEmecAddressLayout = sap.ui.getCore().byId(oController.PAGEID + "_Sub21_4_" + oController._vEmecAddressListCount + "_AddressLayout");
		oEmecAddressLayout.destroyRows();
		oEmecAddressLayout.destroy();
		
		oController._vEmecAddressListCount--;
	},
	
	saveSub21 : function(fVal) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var createDatas = [];
		
		for(var i=0; i<oController._vAnssaList.length; i++) {
			var vCheckCount = 0;
			for(var j=0; j<oController._vAddressLayout.length; j++) {
				if(oController._vAnssaList[i].Ecode == oController._vAddressLayout[j].Subty) {
					vCheckCount++;
				}
			}
			if(vCheckCount > 0) {
				var vOneCreateData = oController.validAddressData(oController, oController._vAnssaList[i]);
				if(vOneCreateData == null) {
					return false;
				} else {
					for(var d=0; d<vOneCreateData.length; d++) {
						createDatas.push(vOneCreateData[d]);
					}
				}
			}						
		}
		
		var dataSaveProcess = function() {
			var process_result = false;
			var oPath = "/RecruitingSubjectsAddressSet";
			
			for(var d=0; d<createDatas.length; d++) {
				var vOneData = createDatas[d];
				vOneData.Seqnr = (d+1) + "";
				
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
				
				if(process_result == false) {
					break;
				}
			}
			
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			if(process_result) {
				if(fVal != "BACK") {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
						title: oBundleText.getText("MSG_TITLE_GUIDE"),
						onClose : function() {
							oController.readSub21();
							oController._vCntSub21 = createDatas.length;
							oController.setCountTabBar(oController, "Sub21");
							oController.setActionButton();
						}
					});
				}
				return true;
			} else {
				return false;
			}
			
		};
		
		if(!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false});
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		setTimeout(dataSaveProcess, 300); 
	},
	
	validAddressData : function(oController, AnssaInfo) {
		var vSubty = AnssaInfo.Ecode;
		
		var vResultDatas = [];		
		
		if(vSubty != "4") {
			var vResultOneData = {
					Docno : oController._vDocno,
					Recno : oController._vRecno,
					VoltId : oController._vVoltId,
					Anssa : vSubty
			};
			
			var fInputData = false;
			
			for(var i=0; i<oController._vAddressLayout.length; i++) { 
				if(vSubty == oController._vAddressLayout[i].Subty) {
					var Fieldname = oController._vAddressLayout[i].Fieldname;
					Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
					var Fieldtype = oController._vAddressLayout[i].Inpty;
					
					var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Sub21_Form_" + vSubty + "_" + Fieldname);
					if(!oControl) continue;
					
					var vVal = "";
					
					if(Fieldtype == "M1" || Fieldtype == "O1") {
						oControl.removeStyleClass("L2PSelectInvalidBorder");
						vVal = oControl.getSelectedKey();
						if(vVal != "" && vVal != "0000") {
							fInputData = true;
						} else {
							vVal = "";
						}
						eval("vResultOneData." + Fieldname + " = '" + vVal + "';");
					} else if(Fieldtype == "M3"|| Fieldtype == "O3") {						
						oControl.setValueState(sap.ui.core.ValueState.None);
						vVal = oControl.getValue();
						if(vVal != "") {
							fInputData = true;
						}
//						eval("vResultOneData." + Fieldname + " = '" + vVal + "';");	
						eval("vResultOneData." + Fieldname + " = vVal ;");		
					} else if(Fieldtype == "M4" || Fieldtype == "O4") {
						oControl.setValueState(sap.ui.core.ValueState.None);
						vVal = oControl.getValue();
						if(vVal != "") {
							fInputData = true;
							var vVal1 = "\/Date(" + common.Common.getTime(vVal) + ")\/";
							eval("vResultOneData." + Fieldname + " = '" + vVal1 + "';");
						} else {
							eval("vResultOneData." + Fieldname + " = null;");
						}
					} else if(Fieldtype == "M5" || Fieldtype == "O5") {
						oControl.setValueState(sap.ui.core.ValueState.None);
						vVal = oControl.getValue();
//						if(vVal != "") {
//							fInputData = true;
//						}
						var oCustomData = oControl.getCustomData();
						var vCVal = "";
						if(oCustomData && oCustomData.length) {
							for(var c=0; c<oCustomData.length; c++) {
								if(oCustomData[c].getKey() == Fieldname) {
									vCVal = oCustomData[c].getValue();
								}
							}
						}
						eval("vResultOneData." + Fieldname + " = '" + vCVal + "';");
						eval("vResultOneData." + Fieldname + "tx = '" + vVal + "';");
					} 
				}
			}
			
			if(oController._vSavedAddressList.length > 0) {
				var isExits = false;
				for(var i=0; i<oController._vSavedAddressList.length; i++) {
					if(vSubty == oController._vSavedAddressList[i].Anssa) {
						if(fInputData) {
							vResultDatas.push(vResultOneData);
						}
						else fInputData = true;
						isExits = true;
						break;
					}
				}
				if(isExits == false) {
					if(fInputData) vResultDatas.push(vResultOneData);
				}
			} else {
				if(fInputData) vResultDatas.push(vResultOneData);
			}
			
			if(fInputData) {
				for(var i=0; i<oController._vAddressLayout.length; i++) {
					if(vSubty == oController._vAddressLayout[i].Subty) {
						var Fieldname = oController._vAddressLayout[i].Fieldname;
						Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
						var Fieldtype = oController._vAddressLayout[i].Inpty;
						
						var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Sub21_Form_" + vSubty + "_" + Fieldname);
						if(!oControl) continue;
						
						var vVal = "";
						
						if(Fieldtype == "M1") {
							vVal = oControl.getSelectedKey();
							if(vVal == "" || vVal == "0000") {
								oControl.addStyleClass("L2PSelectInvalidBorder");
								
								var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_SEL");
								vMsg = vMsg.replace("&Cntl", oBundleText.getText(oController._vAddressLayout[i].Label));
								sap.m.MessageBox.alert(vMsg);
								return null;
							}
						} else if(Fieldtype == "M3") {
							vVal = oControl.getValue();
							if(vVal == "") {
								oControl.setValueState(sap.ui.core.ValueState.Error);
								var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");
								vMsg = vMsg.replace("&Cntl", oBundleText.getText(oController._vAddressLayout[i].Label));
								sap.m.MessageBox.alert(vMsg);
								return null;
							}
						} else if(Fieldtype == "M4") {
							vVal = oControl.getValue();
							if(vVal == "") {
								oControl.setValueState(sap.ui.core.ValueState.Error);
								var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");
								vMsg = vMsg.replace("&Cntl", oBundleText.getText(oController._vAddressLayout[i].Label));
								sap.m.MessageBox.alert(vMsg);
								return null;
							}
						} else if(Fieldtype == "M5") {
							vVal = oControl.getValue();
							if(vVal == "") {
								oControl.setValueState(sap.ui.core.ValueState.Error);
								var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");
								vMsg = vMsg.replace("&Cntl", oBundleText.getText(oController._vAddressLayout[i].Label));
								sap.m.MessageBox.alert(vMsg);
								return null;
							}
						}
					}
				}
				
				if(oController.checkPostalCode("_Sub21_Form_" + vSubty + "_Land1", "_Sub21_Form_" + vSubty + "_State", "_Sub21_Form_" + vSubty + "_Pstlz") == false) {
					return null;
				}
			}
		} else {
			for(var e=1; e<=oController._vEmecAddressListCount; e++) {
				var vResultOneData = {
						Docno : oController._vDocno,
						Recno : oController._vRecno,
						VoltId : oController._vVoltId,
						Anssa : vSubty
				};
				
				var fInputData = false;
				
				for(var i=0; i<oController._vAddressLayout.length; i++) {
					if(vSubty == oController._vAddressLayout[i].Subty) {
						var Fieldname = oController._vAddressLayout[i].Fieldname;
						Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
						var Fieldtype = oController._vAddressLayout[i].Inpty;
						
						var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Sub21_Form_" + vSubty + "_" + e + "_" + Fieldname);
						if(!oControl) continue;
						
						var vVal = "";
						
						if(Fieldtype == "M1" || Fieldtype == "O1") {
							oControl.removeStyleClass("L2PSelectInvalidBorder");
							vVal = oControl.getSelectedKey();
							if(vVal != "" && vVal != "0000") {
								fInputData = true;
							} else {
								vVal = "";
							}
							eval("vResultOneData." + Fieldname + " = '" + vVal + "';");
						} else if(Fieldtype == "M3"|| Fieldtype == "O3") {
							oControl.setValueState(sap.ui.core.ValueState.None);
							vVal = oControl.getValue();
							if(vVal != "") {
								fInputData = true;
							}
//							eval("vResultOneData." + Fieldname + " = '" + vVal + "';");
							eval("vResultOneData." + Fieldname + " = vVal ;");		
						} else if(Fieldtype == "M4" || Fieldtype == "O4") {
							oControl.setValueState(sap.ui.core.ValueState.None);
							vVal = oControl.getValue();
							if(vVal != "") {
								fInputData = true;
								var vVal1 = "\/Date(" + common.Common.getTime(vVal) + ")\/";
								eval("vResultOneData." + Fieldname + " = '" + vVal1 + "';");
							} else {
								eval("vResultOneData." + Fieldname + " = null;");
							}
						} else if(Fieldtype == "M5" || Fieldtype == "O5") {
							oControl.setValueState(sap.ui.core.ValueState.None);
							vVal = oControl.getValue();
//							if(vVal != "") {
//								fInputData = true;
//							}
							var oCustomData = oControl.getCustomData();
							var vCVal = "";
							if(oCustomData && oCustomData.length) {
								for(var c=0; c<oCustomData.length; c++) {
									if(oCustomData[c].getKey() == Fieldname) {
										vCVal = oCustomData[c].getValue();
									}
								}
							}
							eval("vResultOneData." + Fieldname + " = '" + vCVal + "';");
							eval("vResultOneData." + Fieldname + "tx = '" + vVal + "';");
						} 
					}
				}
				
				if(oController._vEmecAddressList.length > 0) {
					vResultDatas.push(vResultOneData);
				} else {
					if(fInputData) vResultDatas.push(vResultOneData);
				}
				
				if(fInputData) {
					for(var i=0; i<oController._vAddressLayout.length; i++) {
						if(vSubty == oController._vAddressLayout[i].Subty) {
							var Fieldname = oController._vAddressLayout[i].Fieldname;
							Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
							var Fieldtype = oController._vAddressLayout[i].Inpty;
							
							var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Sub21_Form_" + vSubty + "_" + e + "_" + Fieldname);
							if(!oControl) continue;
							
							var vVal = "";
							
							if(Fieldtype == "M1") {
								vVal = oControl.getSelectedKey();
								if(vVal == "" || vVal == "0000") {
									oControl.addStyleClass("L2PSelectInvalidBorder");
									
									var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_SEL");
									vMsg = vMsg.replace("&Cntl", oBundleText.getText(oController._vAddressLayout[i].Label));
									sap.m.MessageBox.alert(vMsg);
									return null;
								}
							} else if(Fieldtype == "M3") {
								vVal = oControl.getValue();
								if(vVal == "") {
									oControl.setValueState(sap.ui.core.ValueState.Error);
									var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");
									vMsg = vMsg.replace("&Cntl", oBundleText.getText(oController._vAddressLayout[i].Label));
									sap.m.MessageBox.alert(vMsg);
									return null;
								}
							} else if(Fieldtype == "M4") {
								vVal = oControl.getValue();
								if(vVal == "") {
									oControl.setValueState(sap.ui.core.ValueState.Error);
									var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");
									vMsg = vMsg.replace("&Cntl", oBundleText.getText(oController._vAddressLayout[i].Label));
									sap.m.MessageBox.alert(vMsg);
									return null;
								}
							} else if(Fieldtype == "M5") {
								vVal = oControl.getValue();
								if(vVal == "") {
									oControl.setValueState(sap.ui.core.ValueState.Error);
									var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");
									vMsg = vMsg.replace("&Cntl", oBundleText.getText(oController._vAddressLayout[i].Label));
									sap.m.MessageBox.alert(vMsg);
									return null;
								}
							} 
						}
					}
					
					if(oController.checkPostalCode("_Sub21_Form_" + vSubty + "_" + e + "_Land1", "_Sub21_Form_" + vSubty + "_" + e + "_State", "_Sub21_Form_" + vSubty + "_" + e + "_Pstlz") == false) {
						return null;
					}
				}
			}
		}
		
		return vResultDatas;
	},
	
	deleteSub21 : function(oEvent) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		if(oController._vCntSub21 == 0) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_TARGET4"));
			return;
		};
		
		var onProcessDelete = function(fVal) {
			if(fVal && fVal == "OK") {
				var process_result = false;
				
				for(var i=0; i<oController._vAddressList.length; i++) {
					if(oController._vAddressList[i].Anssa != "1") {
						oModel.remove(
								"/RecruitingSubjectsAddressSet(Docno='" + oController._vDocno + "',"
								+ "VoltId='" +  oController._vVoltId + "',Seqnr='" + oController._vAddressList[i].Seqnr + "')",
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
					
					if(process_result == false) {
						break;
					}
				}				
				
				if(process_result) {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
						title: oBundleText.getText("MSG_TITLE_GUIDE"),
						onClose : function() {
							oController.readSub21();
							oController.setActionButton();
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
	
	onEmptyAddressData : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var oCustomData = oEvent.getSource().getCustomData();
		var vSubty = oCustomData[0].getValue();
		
		var onProcessDelete = function(fVal) {
			if(fVal && fVal == "OK") {
				var process_result = false;
				
				for(var i=0; i<oController._vAddressList.length; i++) {
					if(oController._vAddressList[i].Anssa != vSubty) continue;
					oModel.remove(
							"/RecruitingSubjectsAddressSet(Docno='" + oController._vDocno + "',"
							+ "VoltId='" +  oController._vVoltId + "',Seqnr='" + oController._vAddressList[i].Seqnr + "')",
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
					
					if(process_result == false) {
						break;
					}
				}
				
				if(process_result) {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE"), {
						title: oBundleText.getText("MSG_TITLE_GUIDE"),
						onClose : function() {
							oController.readSub21();
							oController.setActionButton();
						}
					});
				}
			}
		}
		
		sap.m.MessageBox.confirm(oBundleText.getText("MSG_DELETE_CONFIRM"), {
			title : oBundleText.getText("MSG_TITLE_GUIDE"),
			onClose : onProcessDelete
		});
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////
// Sub23 개인추가정보 사항을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////
//  개인추가정보사항을 가지고 온다.
	readSub23 : function() {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		for(var v=1; v<=10; v++) {
			var oVets = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Vets" + v);
			if(oVets) {
				oVets.setSelected(false);
			}
		}
		
		var oRacky = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Racky");
		var oMilsa = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Milsa");
		var oDisab = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Disab");
		var oP08disty = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_P08disty");
		var oDisle = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Disle");
		var oDisdt = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Disdt");
		
		var oDcrdtLabel = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Dcrdt_Label");
		var oDcrdt = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Dcrdt");
		
		// 화면 초기화
		oRacky.setSelectedKey("80");
		oMilsa.setSelectedKey("0000");
		if(oDisab) oDisab.setSelectedKey("0000");
		if(oP08disty) oP08disty.setSelectedKey("002");
		if(oDisle) oDisle.setValue("");
		if(oDisdt) oDisdt.setValue("");
		
		if(oDcrdtLabel) oDcrdtLabel.setVisible(false);
		if(oDcrdt) oDcrdt.setVisible(false);
		
		oRacky.setEnabled(!oController._DISABLED);
		oMilsa.setEnabled(!oController._DISABLED);
		if(oDisab) oDisab.setEnabled(!oController._DISABLED);
		if(oP08disty) oP08disty.setEnabled(!oController._DISABLED);
		if(oDisle) oDisle.setEnabled(!oController._DISABLED);
		if(oDisdt) oDisdt.setEnabled(!oController._DISABLED);
		
		var setCheckbox = function(vEnabled) {
			for(var v=2; v<=7; v++) {
				var oCheckbox = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Vets" + v);
				if(oCheckbox) {
					oCheckbox.setSelected(false);
					oCheckbox.setEnabled(vEnabled);
				}
			}
		}
		
//		var oPath = "/RecruitingSubjects0077Set(Docno='" + oController._vDocno + "'," + "VoltId='" +  oController._vVoltId + "')"
		var oPath = "/RecruitingSubjects0077Set/?$filter=Docno eq '" + oController._vDocno + "' and VoltId eq '" +  oController._vVoltId + "'"
		
		oModel.read(oPath,
					null,
					null,
					false, 	
					function(oData, oResponse) {	
						//if(oData ) {
						if(oData && oData.results.length) {
							var vOneData = oData.results[0];
							
							if(vOneData.Disle != null && oDisle) oDisle.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(vOneData.Disle)))));
							if(vOneData.Disdt != null && oDisdt) oDisdt.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(vOneData.Disdt)))));

							oRacky.setSelectedKey(vOneData.Racky);
							oMilsa.setSelectedKey(vOneData.Milsa);
	
							if(oDisab) oDisab.setSelectedKey(vOneData.Disab);
							if(oP08disty) oP08disty.setSelectedKey(vOneData.P08disty);
							
							if(vOneData.Dcrdt != null && oDcrdt) oDcrdt.setValue(dateFormat.format(new Date(common.Common.setTime(new Date(vOneData.Dcrdt)))));
							
							if(vOneData.Vetst1 == "V1") {
								var oVets = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Vets10");
								if(oVets) oVets.setSelected(true);
								setCheckbox(false);
							} else if(vOneData.Vetst1 == "V8") {
								var oVets = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Vets8");
								if(oVets) oVets.setSelected(true);
								setCheckbox(false);
							} else if(vOneData.Vetst1 == "V9") {
								var oVets = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Vets9");
								if(oVets) oVets.setSelected(true);
								setCheckbox(false);
							} else if(vOneData.Vetst1 == "VA") {
								var oVets = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Vets1");
								if(oVets) oVets.setSelected(true);
								setCheckbox(true);
							}
							
							if(vOneData.Vetst2 && vOneData.Vetst2 != "") {
								var vCheckInfos = vOneData.Vetst2.split(",");
								for(var c=0; c<vCheckInfos.length; c++) {									
									var oVets = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Vets" + vCheckInfos[c].substring(1));
									if(oVets) oVets.setSelected(true);
								}
								
								if(vOneData.Vetst2.indexOf("V5") != -1) {
									if(oDcrdtLabel) oDcrdtLabel.setVisible(true);
									if(oDcrdt) oDcrdt.setVisible(true);
								}
							}
							
							oController._vCntSub23 = 1;
							oController.setActionButton();
							oController.setCountTabBar(oController, "Sub23");
						};
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}		
		);
	},
	
//  개인추가정보사항을 저장 한다.	
	saveSub23 : function(fVal) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oRacky = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Racky");
		var oMilsa = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Milsa");
		var oDisab = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Disab");
		var oP08disty = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_P08disty");
		var oDisle = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Disle");
		var oDisdt = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Disdt");
		var oDcrdt = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Dcrdt");
		
		if(oDisle) oDisle.setValueState(sap.ui.core.ValueState.None);
		if(oDisdt) oDisdt.setValueState(sap.ui.core.ValueState.None);
		oRacky.removeStyleClass("L2PSelectInvalidBorder");
		oMilsa.removeStyleClass("L2PSelectInvalidBorder");
		if(oDisab) oDisab.removeStyleClass("L2PSelectInvalidBorder");
		if(oP08disty) oP08disty.removeStyleClass("L2PSelectInvalidBorder");
		if(oDcrdt) oDcrdt.setValueState(sap.ui.core.ValueState.None);
		
		var oRadios = [{no : "1", value : "VA"},
		               {no : "8", value : "V8"},
		               {no : "9", value : "V9"},
		               {no : "10", value : "V1"}];
		
		var vVetst1 = "";
		var vVetst2 = "";
		
		for(var v=0; v<oRadios.length; v++) {
			var oVets = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Vets" + oRadios[v].no);
			if(oVets && oVets.getSelected()) {
				vVetst1 = oRadios[v].value;
				break;
			}
		}
		
		for(var v=2; v<=7; v++) {
			var oCheckbox = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Vets" + v);
			if(oCheckbox && oCheckbox.getSelected()) {
				vVetst2 += "V" + v + ",";
			}
		}
		if(vVetst2 != "") vVetst2 = vVetst2.substring(0, vVetst2.length - 1);
		
		var oVets1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Vets1");
//		if(oVets1 && oVets1.getSelected()) {
//			if(vVetst2 == "") {
//				var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_SEL");
//				vMsg = vMsg.replace("&Cntl", "a type of Protected Veteran");
//				sap.m.MessageBox.alert(vMsg);
//				return false;
//			}
//		}
		
		var vOneData = {
				Docno : oController._vDocno,
				Recno : oController._vRecno,
				VoltId : oController._vVoltId,
				Disle : oDisle && oDisle.getValue() != "" ? "\/Date(" + common.Common.getTime(oDisle.getValue()) + ")\/" : null,
				Disdt : oDisdt && oDisdt.getValue() != "" ? "\/Date(" + common.Common.getTime(oDisdt.getValue()) + ")\/" : null,
				Racky : oRacky.getSelectedKey() == "0000" ? "" : oRacky.getSelectedKey(),
				Milsa : oMilsa.getSelectedKey() == "0000" ? "" : oMilsa.getSelectedKey(),	
				Vetst1 : vVetst1,
				Vetst2 : vVetst2,
		};
		
		if(oDisab) {
			vOneData.Disab = oDisab.getSelectedKey() == "0000" ? "" : oDisab.getSelectedKey();
		}
		
		if(oP08disty) {
			vOneData.P08disty = oP08disty.getSelectedKey() == "0000" ? "" : oP08disty.getSelectedKey();
		}
		
		if(oDcrdt) {
			if(oDcrdt.getValue() == "") vOneData.Dcrdt = null;
			else vOneData.Dcrdt = "\/Date(" + common.Common.getTime(oDcrdt.getValue()) + ")\/";
		}
		
//		if(vOneData.Disab == "X") {
//			if(vOneData.Disle == null || vOneData.Disle == "") {
//				if(oDisle) oDisle.setValueState(sap.ui.core.ValueState.Error);
//				var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");
//				vMsg = vMsg.replace("&Cntl", oBundleText.getText("Disle".toUpperCase()));
//				sap.m.MessageBox.alert(vMsg);
//				return false;
//			}
//		}
		
		if(vOneData.Vetst2.indexOf("V5") != -1) {
			if(vOneData.Dcrdt == null || vOneData.Dcrdt == "") {
				if(oDcrdt) oDcrdt.setValueState(sap.ui.core.ValueState.Error);
				var vMsg = oBundleText.getText("MSG_SELECT_CONTROL_INP");
				vMsg = vMsg.replace("&Cntl", oBundleText.getText("Dcrdt".toUpperCase()));
				sap.m.MessageBox.alert(vMsg);
				return false;
			}
		}
		
		var process_result = false;
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV"); 
		
		oModel.create(
				"/RecruitingSubjects0077Set",
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
			if(fVal != "BACK") {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
					title: oBundleText.getText("MSG_TITLE_GUIDE"),
					onClose : function() {
						oController.readSub23();
						oController._vCntSub23 = 1;
						oController.setCountTabBar(oController, "Sub23");
					}
				});
			}
			return true;
		} else {
			return false;
		}
	},
	
	deleteSub23 : function(oEvent) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		if(oController._vCntSub23 == 0) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_DELETE_TARGET4"));
			return;
		};
		
		var onProcessDelete = function(fVal) {
			if(fVal && fVal == "OK") {
				var process_result = false;
				oModel.remove(
						"/RecruitingSubjects0077Set(Docno='" + oController._vDocno + "',"
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
							oController.readSub23();
							oController._vCntSub23 = 0;
							oController.setCountTabBar(oController, "Sub23");
							oController.setActionButton();
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
	
	setFromRegno : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		oController._vModifyContent = true;
		
		var vInputValue = oEvent.getSource().getValue();
		
		if (isNaN(vInputValue) || vInputValue.indexOf('.') != -1 || vInputValue.indexOf(' ') != -1) {
			vInputValue = vInputValue.substr(0, vInputValue.length-1 );
			oEvent.getSource().setValue(vInputValue);
	    }

		if(vInputValue.length == 13) {
//			var vPreID = oEvent.getSource().getId().substr(0, oEvent.getSource().getId().lastIndexOf('_') + 1);
//			var oZzgbdat = sap.ui.getCore().byId(vPreID + "Zzgbdat");
//			var vZzgbdat = oZzgbdat.getValue();
//			var oGesch1 = sap.ui.getCore().byId(vPreID + "Gesch1");
//			var oGesch2 = sap.ui.getCore().byId(vPreID + "Gesch2");
//			var oZzgbdty1 = sap.ui.getCore().byId(vPreID + "Zzgbdty1");
//
//			// 9,0 : 국내 1800년대생 남,녀
//			// 1,2 : 국내 1900년대생 남,녀
//			// 3,4 : 국내 2000년대생 남,녀
//			// 5,6 : 외국 1900년대생 남,녀
//			// 7,8 : 외국 2000년대생 남,녀
//
//			switch(vInputValue.substr(6, 1)){
//				case "9" :
//				case "0" :
//					vZzgbdat = "18";
//					break;
//				case "1" :
//				case "2" :
//				case "5" :
//				case "6" :
//					vZzgbdat = "19";
//					break;
//				case "3" :
//				case "4" :
//				case "7" :
//				case "8" :
//					vZzgbdat = "20";
//			}
//			vZzgbdat += vInputValue.substr(0, 2)
//				+ "-" + vInputValue.substr(2, 2)
//				+ "-" + vInputValue.substr(4, 2);
//			oZzgbdat.setValue(vZzgbdat);
//			var mArgument = {};
//			mArgument.valid = oController.isValidDate(vZzgbdat);
//			oZzgbdat.fireChange(mArgument);
//			oZzgbdty1.setSelected(true);
//			var vChkVal = parseInt(vInputValue.substr(6, 1)) % 2;
//			if(vChkVal == 1) oGesch1.setSelected(true);
//			else oGesch2.setSelected(true);
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		if(oEvent) oController._vModifyContent = true;

		var vFamst = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Famst").getSelectedKey();
		
		var oFamdt = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Famdt");
		if(oFamdt){
			if(vFamst == "0" || vFamst == "0000") {
				oFamdt.setValue("");
				oFamdt.setEnabled(false);
			} else {
				oFamdt.setEnabled(true);
			}
		}
	},
	
	onChangeState : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		oController._vModifyContent = true;
		
		var oControl = oEvent.getSource();
		var vUpdateValue = "";
		
		var vSid = oControl.sId;
		
		var vTmp1 = vSid.split("_");
		var vTmp2 = "";
		for(var i=0; i<vTmp1.length - 1; i++) {
			vTmp2 += vTmp1[i] + "_";
		}
		var vTmp3 = vTmp2 + "Rctvc";
		
		var oTmp = sap.ui.getCore().byId(vTmp3);
		if(typeof oTmp != "object") return;
		
		oController.setCity(vUpdateValue, vSid, vTmp3);
	},
	
	onSelectVetsRadio : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		oController._vModifyContent = true;
		
		var fSelected = oEvent.getParameter("selected");
		
		var oControl = oEvent.getSource();
		var vIds = oControl.getId().split("_");
		var vId = vIds[vIds.length - 1];
		
		if(vId == "Vets1") {
			for(var v=2; v<=7; v++) {
				var oCheckbox = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Vets" + v);
				if(oCheckbox) {
					oCheckbox.setEnabled(true);
				}
			}
		} else {
			for(var v=2; v<=7; v++) {
				var oCheckbox = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Vets" + v);
				if(oCheckbox) {
					oCheckbox.setSelected(false);
					oCheckbox.setEnabled(false);
				}
			}
		}
	},
	
	onSelectVetsCheckbox : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		oController._vModifyContent = true;
		
		var fChecked = false;
		
		for(var v=2; v<=7; v++) {
			var oCheckbox = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Vets" + v);
			if(oCheckbox) {
				if(oCheckbox.getSelected()) {
					fChecked = true;
					break;
				}
			}
		}
		
		var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Vets1");
		if(oControl) {
			oControl.setSelected(true);
		}
		
		var oDcrdtLabel = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Dcrdt_Label");
		var oDcrdt = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Dcrdt");
		
		var oV5 = sap.ui.getCore().byId(oController.PAGEID + "_Sub23_Vets5");
		if(oV5) {
			if(oV5.getSelected()) {
				oDcrdtLabel.setVisible(true);
				oDcrdt.setVisible(true);
			} else {
				oDcrdtLabel.setVisible(false);
				oDcrdt.setVisible(false);
			}
		}
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 지역 DDLB (State)
/////////////////////////////////////////////////////////////////////////////////////////////
	setDDLBState : function(vSelectedKey, Molga, Land, State) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oState = null;
		var oLand1 = null;
		if(Molga && Molga != "") {
			oState = sap.ui.getCore().byId(oController.PAGEID + "_" + oController._JobPage + "_" + State);
			oLand1 = sap.ui.getCore().byId(oController.PAGEID + "_" + oController._JobPage + "_" + Land);
		} else {
			oState = sap.ui.getCore().byId(oController.PAGEID + "_" + oController._JobPage + "_Form_" + State);
			oLand1 = sap.ui.getCore().byId(oController.PAGEID + "_" + oController._JobPage + "_Form_" + Land);
		}
		if(typeof oState != "object") return;
		if(typeof oLand1 != "object") return;
		
		var vLand1 = oLand1.getCustomData()[0].getValue();
		
		try {
			if(oState instanceof sap.m.Select) oState.removeAllItems();
			else if(oState instanceof sap.m.Input){
				oState.setValue("");
				oState.removeAllCustomData();
				oState.addCustomData(new sap.ui.core.CustomData({key : State , value : ""}));
				return;
			}
		} catch(ex) {
			return;
		}			

		if(oController._vPersa != "" && oController._vActda != "" && vLand1 != "") {
			oState.addItem(
				new sap.ui.core.Item({
					key : "",
					text : oBundleText.getText("SELECTDATA")
				})
			);
				
			var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
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
	
	setDDLBState2 : function(vSelectedKey, vLand1, StateId) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		var oState = sap.ui.getCore().byId(StateId);
		
		if(typeof oState != "object") return;
		
		try {
			if(oState instanceof sap.m.Select) oState.removeAllItems();
			else if(oState instanceof sap.m.Input){
				oState.setValue("");
				oState.removeAllCustomData();
				oState.addCustomData(new sap.ui.core.CustomData({key : State , value : ""}));
				return;
			}
		} catch(ex) {
			return;
		}		
		
		if(oController._vPersa != "" && oController._vActda != "" && vLand1 != "") {
			oState.addItem(
				new sap.ui.core.Item({
					key : "",
					text : oBundleText.getText("SELECTDATA")
				})
			);
				
			var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
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
//									vCode.StateCodeListSet.push(oData.results[i]);
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
	
	setCity : function(vSelectedKey, State, City, vSaved_State) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oState = null;
		var oCity = null;
		
		oState = sap.ui.getCore().byId(State);
		oCity = sap.ui.getCore().byId(City);
		
		if(typeof oCity != "object") return;
		
		if(!vSaved_State || vSaved_State == "") {
			if(typeof oState != "object") return;
		}
		
		var vState = "";
		
		try {
			if(vSaved_State && vSaved_State != "") {
				vState = vSaved_State;
			} else {
				if(oState.getMetadata().getName().toUpperCase() == "SAP.M.SELECT") vState = oState.getSelectedKey();
				else  vState = oState.getCustomData()[0].getValue();
			}
			
			oCity.removeAllItems();
		} catch(ex) {
			return;
		}

		if(oController._vPersa != "" && oController._vActda != "" && vState != "") {
			oCity.addItem(
				new sap.ui.core.Item({
					key : "",
					text : oBundleText.getText("SELECTDATA")
				})
			);
				
			var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
			var oPath = "/EmpCodeListSet/?$filter=Field eq 'Rctvc' and Persa eq '" + oController._vPersa + "'" +
						" and Actda eq datetime'" + oController._vActda + "T00:00:00'" +
						" and Excod eq '" + vState + "'";
			
			oCommonModel.read(
						oPath,
						null,
						null,
						false,
						function(oData, oResponse) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									oCity.addItem(
										new sap.ui.core.Item({
											key : oData.results[i].Ecode,
											text : oData.results[i].Etext
										})
									);
								}
								if(vSelectedKey != "") oCity.setSelectedKey(vSelectedKey);
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();	
		
		oController._OFaartCodeControl = oEvent.getSource();

		oController._OFaartCodeControl = oEvent.getSource();

		if(!oController._ODialogSearchFaartCodeEvent) {
			oController._ODialogSearchFaartCodeEvent = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.SearchFaartCode", oController);
			oView.addDependent(oController._ODialogSearchFaartCodeEvent);
		}
		
		var oFaart = sap.ui.getCore().byId(oController.PAGEID + "_POP_Faart");
		oFaart.setValue("");
		oController._ODialogSearchFaartCodeEvent.open();
		
		oController.onSetFaartCodeFragment();
	},
	
	onSetFaartCodeFragment : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oDialog = sap.ui.getCore().byId(oController.PAGEID + "_POP_FaartCode_Dialog");
		var oStandardListItem = sap.ui.getCore().byId(oController.PAGEID + "_POP_FaartCode_StandardListItem");
		var oStandardList = sap.ui.getCore().byId(oController.PAGEID + "_POP_FaartCode_StandardList");
		var vSearchInputType = "" ;
		var oFaart = sap.ui.getCore().byId(oController.PAGEID + "_POP_Faart");
		var oFaartNotice = sap.ui.getCore().byId(oController.PAGEID + "_POP_Faart_Notice");
		if(oController._OFaartCodeControl.sId.indexOf("Sltp1") > 0){
			oDialog.setTitle(oBundleText.getText("SLTP1"));
			vSearchInputType = "Sltp1";
			oFaart.setPlaceholder(oBundleText.getText("MSG_INPUT_ZZSLTP1TX")); //oBundleText.getText("MSG_INPUT_ZZSLTP1TX"));
			oFaartNotice.setText(oBundleText.getText("NOTICE_INPUT_ZZSLTP1TX"));
		}else{
			oDialog.setTitle(oBundleText.getText("SLTP2"));
			vSearchInputType = "Sltp2";
			oFaart.setPlaceholder(oBundleText.getText("MSG_INPUT_ZZSLTP2TX")); //oBundleText.getText("MSG_INPUT_ZZSLTP2TX"));
			oFaartNotice.setText(oBundleText.getText("NOTICE_INPUT_ZZSLTP2TX"));
		}			

		var oSlart = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Slart");
		var oFaartText_Btn = sap.ui.getCore().byId(oController.PAGEID + "_FaartText_Btn");
		var oFaartCodeModel = sap.ui.getCore().getModel("FaartCodeList");
		var vCode = { FaartCodeListSet : [] };
		
		if(oSlart.getSelectedKey() == "Z4" || oSlart.getSelectedKey() == "Z5") {
			var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
			
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
		
		oFaartText_Btn.removeAllCustomData();
		oFaartText_Btn.addCustomData(new sap.ui.core.CustomData({key : "SearchInputType", value : vSearchInputType}));
		
//		oFaartText_Btn.setVisible(false);
		oStandardList.unbindItems();
		oFaartCodeModel.setData(vCode);
	},
	
	onSearchFaartCode : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		var sValue = sap.ui.getCore().byId(oController.PAGEID + "_POP_Faart").getValue();
		if(sValue.length < 2){
			common.Common.showErrorMessage(oBundleText.getText("MSG_SEARCH_CONDTION"));
			return ;
		}
		
		var dataProcess = function(){
			
			var oFilters = [];
			oFilters.push(new sap.ui.model.Filter("Etext", sap.ui.model.FilterOperator.Contains, sValue));
		
			var oFaartCodeList = sap.ui.getCore().byId(oController.PAGEID + "_POP_FaartCode_StandardList");
		    var oFaartCodeListItem = sap.ui.getCore().byId(oController.PAGEID + "_POP_FaartCode_StandardListItem");
			
			oFaartCodeList.bindItems("/FaartCodeListSet", oFaartCodeListItem, null, oFilters);	
			
		};
		
		if(!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false});
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCHING")}));
			oController.getView().addDependent(oController.BusyDialog);
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		setTimeout(dataProcess, 300);
	},
	
	onConfirmFaartCode : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oStandardList = sap.ui.getCore().byId(oController.PAGEID + "_POP_FaartCode_StandardList");
		
		var aContexts = oStandardList.getSelectedContexts(true);
		
		if (aContexts.length == 1){
			var vFaartCode = aContexts[0].getProperty("Ecode");
	    	var vFaartCodetx = aContexts[0].getProperty("Etext");
	    	
	    	oController._OFaartCodeControl.setValue(vFaartCodetx);
	    	oController._OFaartCodeControl.removeAllCustomData();
	    	oController._OFaartCodeControl.addCustomData(new sap.ui.core.CustomData({key : "Key", value : vFaartCode}));
	    }
		
		oController.onCancelFaartCode(oEvent);
	},
		
	onCancelFaartCode : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oFaartCodeList = sap.ui.getCore().byId(oController.PAGEID + "_POP_FaartCode_StandardList");
	    var oFaartCodeListItem = sap.ui.getCore().byId(oController.PAGEID + "_POP_FaartCode_StandardListItem");
	    oFaartCodeList.bindItems("/FaartCodeListSet", oFaartCodeListItem, null, []);
	
	    var oFaartCodeModel = sap.ui.getCore().getModel("FaartCodeList");
	    var vCode = { FaartCodeListSet : [] };
	    oFaartCodeModel.setData(vCode);
	
	    if(oController._ODialogSearchFaartCodeEvent.isOpen()){
	    	oController._ODialogSearchFaartCodeEvent.close();
	    }
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		if(!oController._ODialogPopup_Rehire) {
			oController._ODialogPopup_Rehire = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_Rehire_Search", oController);
			oView.addDependent(oController._ODialogPopup_Rehire);
		}
		
		var oRPerid = sap.ui.getCore().byId(oController.PAGEID + "_Rehire_Perid");
		oRPerid.setValue("");
		var oRPerid2 = sap.ui.getCore().byId(oController.PAGEID + "_Rehire_Perid2");
		if(typeof oRPerid2 != "undefined" && oRPerid2){
			oRPerid2.setValue("");
		}
		oController._ODialogPopup_Rehire.open();
		
		
	},
	
	onConfirmRehire : function(oEvnet){
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		var oRPerid = sap.ui.getCore().byId(oController.PAGEID + "_Rehire_Perid");
		var oRPerid2 = sap.ui.getCore().byId(oController.PAGEID + "_Rehire_Perid2");
		var oProcessResult = false ;
		var oNameLayout = sap.ui.getCore().byId(oController.PAGEID + "_NameLayout");
		var oNameLayoutText = sap.ui.getCore().byId(oController.PAGEID + "_NameLayoutText");
		oNameLayoutText.setText("");
		
		if(oRPerid.getValue() == ""){
			sap.m.MessageBox.alert(oBundleText.getText("WARING_CERNO"));
			return ;
		}
		
		var vRehireData = null;
		var vRIdNum = "";
		if(typeof oRPerid2 != "undefined" && oRPerid2 && oController._vMolga == "06"){
			var vTempPerid2 = oRPerid2.getValue();
			if(vTempPerid2 == "") vTempPerid2 = "00";
			vRIdNum =  oRPerid.getValue() + "/" + vTempPerid2;
		}else{
			vRIdNum = oRPerid.getValue();
		}
		
		var vFilerString = "/RecruitingSubjectsSet?$filter=Accty eq 'R' and Cerno eq '" + vRIdNum + "' and " +
		"Docno eq '" + oController._vDocno + "'";
	
		
		
		oModel.read( vFilerString,
			null,
			null,
			false, 	
			function(oData, oResponse) {	
				if(oData && oData.results.length > 0) {
					oProcessResult = true;
					
					vRehireData = oData.results[0];
					
					if(oData.results[0].Perid == "") {
						vRehireData.Perid = oData.results[0].Idnum;	
					}						
					
					oController._vRecno = oData.results[0].Recno;
					oController._vVoltId = oData.results[0].VoltId;
					
					oController._fRehireStatus = true;
					
					var vNameStr = "";
					if(oData.Anredtx != "") vNameStr = oData.Anredtx + " " + oData.Ename;
					else vNameStr = oData.Ename;
					
					oNameLayoutText.setText(vNameStr);
				}
			},
			function(oResponse) {
				console.log(oResponse);
			}		
		);
		
		if(!oProcessResult){
			sap.m.MessageBox.alert(oBundleText.getText("NO_CERNO_FOUND"));
			return ;
		}
		
		oController.setSub01(vRehireData);		
		oController.setTelField(oController);

		if(oController._ODialogPopup_Rehire.isOpen()){
			oController._ODialogPopup_Rehire.close();
		}
	},
	
	onCancelRehire : function(oEvnet){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		if(oController._ODialogPopup_Rehire.isOpen()){
			oController._ODialogPopup_Rehire.close();
		}
	},
	
	onBeforeOpenRehireSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oRehireIdnumLabel = sap.ui.getCore().byId(oController.PAGEID + "_Rehire_Idnum_Label");
		var vCless , vNumss ;
		for(var i=0; i<oController._vHiringPersonalInfomationLayout.length; i++) {
			var Fieldname = oController._vHiringPersonalInfomationLayout[i].Fieldname;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			if(oController._vMolga != "01" && (Fieldname == "Idnum" || Fieldname == "Perid")) {
				oRehireIdnumLabel.setText(oController._vHiringPersonalInfomationLayout[i].Label);
				break;
			//독일 재입사 기준은 사번임으로 라벨도 사번으로 수정
			}else if(oController._vMolga == "01" && Fieldname == "Idnum"){ 
				oRehireIdnumLabel.setText(oController._vHiringPersonalInfomationLayout[i].Label);
				break;
			}else if(Fieldname == "Numss"){
				vNumss = oController._vHiringPersonalInfomationLayout[i].Label ;
			}else if(Fieldname == "Cless"){
				vCless = oController._vHiringPersonalInfomationLayout[i].Label ;
			}
		}
		
		if(oController._vMolga == "06" ){ //프랑스 재입사 기준은 Numss, Cless 두 필드로 나뉨. 필드라벨은 하나로 표시함.
			oRehireIdnumLabel.setText(vNumss + "/" +vCless);
		}
		var oRehire_Perid = sap.ui.getCore().byId(oController.PAGEID + "_Rehire_Perid");
		var oRehire_Perid2 = sap.ui.getCore().byId(oController.PAGEID + "_Rehire_Perid2");
		
		if(oController._vMolga == "06"){
			oRehire_Perid.setWidth("70%");
			oRehire_Perid2.setVisible(true);
		}else{
			oRehire_Perid.setWidth("95%");
			oRehire_Perid2.setVisible(false);
		}
		
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////
// 재입사 정보 복사 선택 function
/////////////////////////////////////////////////////////////////////////////////////////////	
	_ODialogPopup_RehireDataSelect : null ,
	
	onOpenRehireDataSelect : function(vOneData){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		if(!oController._ODialogPopup_RehireDataSelect) {
			oController._ODialogPopup_RehireDataSelect = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_Rehire_DataSelect", oController);
			oView.addDependent(oController._ODialogPopup_RehireDataSelect);
		}
		
		oController._vCreateRehireData = vOneData;
		oController._ODialogPopup_RehireDataSelect.open();
	},
	
	onConfirmRehireDataSelect : function(oEvnet){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		if(oController._ODialogPopup_RehireDataSelect.isOpen()){
			oController._ODialogPopup_RehireDataSelect.close();
		}
		
		if(oController._vCreateRehireData) {
			for(var i=0; i<oController._vActiveTabNames.length; i++) {
				if(oController._vActiveTabNames[i].Tabid == "01") {
					continue;
				}
				
				var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Rehire_Data" + oController._vActiveTabNames[i].Tabid);
				if(oControl && oControl.getSelected() == true) {
					eval("oController._vCreateRehireData.Cnt" + oController._vActiveTabNames[i].Tabid + " = 'X';"); 
				}
			}
			
			var process_result = false;
			var oPath = "/RecruitingSubjectsSet";
			var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
			
			oModel.create(
					oPath,
					oController._vCreateRehireData,
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
			
			if(process_result) {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
					title: oBundleText.getText("MSG_TITLE_GUIDE"),
					onClose : function() {
						oController._fRehireStatus = false;
						oController.setSub01();
						oController.setTelField(oController);
						oController.setActionButton();
					}
				});
			}			
		}		
	},
	
	onBeforeOpenRehireDataSelect : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		if(oController._ODialogPopup_RehireDataSelect.isOpen()){
			oController._ODialogPopup_RehireDataSelect.close();
		}
	},	
	
/////////////////////////////////////////////////////////////////////////////////////////////
// Text 입력 Functions ( 학교 , 전공, 부전공 )
/////////////////////////////////////////////////////////////////////////////////////////////	
		
	_ODialogSearchInputEvent : null,
	
	onDisplaySearchInputDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();	
		
		if(!oController._ODialogSearchInputEvent) {
			oController._ODialogSearchInputEvent = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.EducationInputField", oController);
			oView.addDependent(oController._ODialogSearchInputEvent);
		};
		
		var oControl = this;
		var oCustomData = oControl.getCustomData();
		
		var vSearchInputType = oCustomData[0].getValue();
		if(oCustomData[0]){
			var oInputDialog = sap.ui.getCore().byId(oController.PAGEID + "_Input_Dialog");
			var oInput = sap.ui.getCore().byId(oController.PAGEID + "_POP_Input");
			var oInputNotice = sap.ui.getCore().byId(oController.PAGEID + "_POP_Input_Notice");
			oInput.setValue("");
			oInput.removeAllCustomData();
			oInput.addCustomData(new sap.ui.core.CustomData({key : "SearchInputType", value : vSearchInputType}));
			// 학교
			if(vSearchInputType == "Schcd"){
				oInputDialog.setTitle(oBundleText.getText("SCHCD"));
				oInputNotice.setText(oBundleText.getText("MSG_INPUT_INSTI"));
				var oSchcd_Pop = sap.ui.getCore().byId(oController.PAGEID + "_POP_Schcd");
				oInput.setValue(oSchcd_Pop.getValue());
			} else if(vSearchInputType == "Sltp1"){
				oInputDialog.setTitle(oBundleText.getText("SLTP1"));
				oInputNotice.setText(oBundleText.getText("MSG_INPUT_ZZSLTP1TX"));
				var oSltp1_Pop = sap.ui.getCore().byId(oController.PAGEID + "_POP_Faart");
				oInput.setValue(oSltp1_Pop.getValue());
			} else if(vSearchInputType == "Sltp2"){
				oInputDialog.setTitle(oBundleText.getText("SLTP2"));
				oInputNotice.setText(oBundleText.getText("MSG_INPUT_ZZSLTP2TX"));
				var oSltp2_Pop = sap.ui.getCore().byId(oController.PAGEID + "_POP_Faart");
				oInput.setValue(oSltp2_Pop.getValue());
			} else if(vSearchInputType == "Cttyp"){
				oInputDialog.setTitle(oBundleText.getText("CTTYP")); //
				oInputNotice.setText(oBundleText.getText("MSG_INPUT_CTTYP2"));
				var oCttyp_Pop = sap.ui.getCore().byId(oController.PAGEID + "_POP_Cttyp");   
				oInput.setValue(oCttyp_Pop.getValue());
			} else if(vSearchInputType == "Arbgb"){
				oInputDialog.setTitle(oBundleText.getText("ARBGB")); //
				oInputNotice.setText(oBundleText.getText("MSG_INPUT_ARBGB2"));
				var oArbgb_Pop = sap.ui.getCore().byId(oController.PAGEID + "_POP_Arbgb");   
				oInput.setValue(oArbgb_Pop.getValue());
			}
		}
		oController._ODialogSearchInputEvent.open();
	},
	
	onKeyUp : function(oEvent){
		if(oEvent.which == 13) {
			var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
			var oController = oView.getController();
			oController.onPressConfirmInput();
		}
	},
	
	onPressConfirmInput : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();	
		
		var oInput = sap.ui.getCore().byId(oController.PAGEID + "_POP_Input");
		var vInputText = oInput.getValue();
		
		var vSearchInputType = oInput.getCustomData()[0].getValue();
		
		var oSchcd = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Schcd");
		var oSltp1 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sltp1");
		var oSltp2 = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Sltp2");
		
		var oCttyp = sap.ui.getCore().byId(oController.PAGEID + "_Sub06_Cttyp");
		
		var oArbgb = sap.ui.getCore().byId(oController.PAGEID + "_Sub03_Arbgb");
		
		if(vSearchInputType == "Schcd"){
			if(oSchcd) {
				oSchcd.removeAllCustomData();
				oSchcd.setValue(vInputText);
				oController.onCancelSchcd();
			}			
		} else if(vSearchInputType == "Sltp1"){
			if(oSltp1) {
				oSltp1.removeAllCustomData();
				oSltp1.setValue(vInputText);
				oController.onCancelFaartCode();
			}			
		} else if(vSearchInputType == "Sltp2"){
			if(oSltp2) {
				oSltp2.removeAllCustomData();
				oSltp2.setValue(vInputText);
				oController.onCancelFaartCode();
			}			
		} else if(vSearchInputType == "Cttyp"){
			if(oCttyp) {
				oCttyp.removeAllCustomData();
				oCttyp.setValue(vInputText);
				oController.onCancelCttyp();
			}			
		} else if(vSearchInputType == "Arbgb"){
			if(oArbgb) {
				oArbgb.removeAllCustomData();
				oArbgb.setValue(vInputText);
				oController.onCancelArbgb();
			}			
		}
		oController.onCOCloseInput();
	},
	
	onCOCloseInput : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();	
		if(oController._ODialogSearchInputEvent && oController._ODialogSearchInputEvent.isOpen()){
			oController._ODialogSearchInputEvent.close();
		}
	},
	
	_ODialogSearchWaersEvent : null,
	_OWaersControl : null,
	
	onDisplaySearchWaersDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();	
		
		oController._OWaersControl = oEvent.getSource();

		if(!oController._ODialogSearchWaersEvent) {
			oController._ODialogSearchWaersEvent = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.SearchWaersDialog", oController);
			oView.addDependent(oController._ODialogSearchWaersEvent);
		}
		oController._ODialogSearchWaersEvent.open();
	},
	
	onSearchWaers : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Waers"));
		oFilters.push(new sap.ui.model.Filter("Etext", sap.ui.model.FilterOperator.Contains, sValue));
	
		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter(oFilters);
	},
	
	onConfirmWaers : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var aContexts = oEvent.getParameter("selectedContexts");
	
		if (aContexts.length) {
			var vEmpCode = aContexts[0].getProperty("Ecode");
	    	oController._OWaersControl.setValue(vEmpCode);
	    }
		
		oController.onCancelWaers(oEvent);
	},
		
	onCancelWaers : function(oEvent) {
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Field", sap.ui.model.FilterOperator.EQ, "Waers"));
		oFilters.push(new sap.ui.model.Filter("Ecode", sap.ui.model.FilterOperator.NE, "0000"));
		
		var oBinding = oEvent.getSource().getBinding("items");
	    oBinding.filter(oFilters);
	},
	
	getCustomdata : function(oCustomData, key) {
		var val = "";
		
		if(oCustomData && oCustomData.length) {
			for(var i=0; i<oCustomData.length; i++) {
				if(oCustomData[i].getKey() == key) {
					val = oCustomData[i].getValue();
					break;
				}
			}
		}
		
		return val;
	},
	
	setSpecialCodeData : function(Fieldname, vAddFilter) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();	
		var mCodeModel = new sap.ui.model.json.JSONModel();
		var vCodeModel = {EmpCodeListSet : []};
		var vFieldType = "";
		
		for(var i=0; i<oController._vHiringPersonalInfomationLayout.length; i++) {
			var vFieldname = oController._vHiringPersonalInfomationLayout[i].Fieldname;
			if(vFieldname.toUpperCase() == Fieldname.toUpperCase()) {
				vFieldType = oController._vHiringPersonalInfomationLayout[i].Incat;
				break;
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
		
//		if(vFieldType == "M5" || vFieldType == "O5" ) vCodeModel.EmpCodeListSet.push({Field : Fieldname, Ecode : "", Etext : oBundleText.getText("NOVALUE")});
//		else vCodeModel.EmpCodeListSet.push({Field : Fieldname, Ecode : "0000", Etext : oBundleText.getText("SELECTDATA")});
		
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
	
	displayCodeSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();	
		
		var mOneCodeModel =sap.ui.getCore().getModel("CodeListModel");
		mOneCodeModel.setData(null);
		var vOneCodeList = {EmpCodeListSet : []};
		
		var oCustomData = oEvent.getSource().getCustomData();
		var Fieldname = oCustomData[0].getKey();
		
		if(Fieldname == "Natio" || Fieldname == "Nati2") {
			Fieldname = "Natio2";
		}
		
		var vTitle = "";
		if(oCustomData.length > 1) {
			vTitle = oCustomData[1].getValue();
		} else {
			vTitle = oBundleText.getText(Fieldname.toUpperCase());
		}
		
		var mEmpCodeList = null;
		
		if(Fieldname == "State") {	
			var vExcod = "";
			var vTmp1 = oEvent.getSource().sId;
			var vTmp2 = vTmp1.replace(Fieldname, "Land1");
			var oLand1 = sap.ui.getCore().byId(vTmp2);
			if(oLand1) {
				vExcod = oLand1.getCustomData()[0].getValue();
			}
			
			var vAddFilter = [{key : "Persa", value : oController._vPersa},
			                  {key : "Actda", value : oController._vActda},
			                  {key : "Excod", value : vExcod}];
			
			mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter);
		}else if(Fieldname == "Vorsw"){
			var vAddFilter = [{key : "Persa", value : oController._vPersa},
			                  {key : "Actda", value : oController._vActda},
			                  {key : "Excod", value : "V"}];
	
			mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter);
		}else if(oController._vMolga == "46" && Fieldname == "Counc"){
			var vExcod = "";
			var vState = "";
			var vLand1 = "";
			var vTmp1 = oEvent.getSource().sId;
			var vTmp2 = vTmp1.replace(Fieldname, "Land1");
			var oLand1 = sap.ui.getCore().byId(vTmp2);
			if(oLand1) {
				vLand1 = oLand1.getCustomData()[0].getValue();
			}
			vTmp2 = vTmp1.replace(Fieldname, "State");
			var oState = sap.ui.getCore().byId(vTmp2);
			if(oState) {
				if(oState.getMetadata().getName().toUpperCase() == "SAP.M.SELECT") vState = oState.getSelectedKey();
				else  vState = oState.getCustomData()[0].getValue();
			}
			vExcod = vLand1 + "|" + vState ;
			
			var vAddFilter = [{key : "Persa", value : oController._vPersa},
			                  {key : "Actda", value : oController._vActda},
			                  {key : "Excod", value : vExcod}];
			
			mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter);
		}
		else if(oController._vMolga == "46" && Fieldname == "Tery2" || Fieldname == "Rctvc"){
			var vExcod = "";
			var vState = "";
			var vLand1 = "";
			var vCounc = "";
			var vFieldName = Fieldname ;
			if(vFieldName == "Rctvc") vFieldName = "Tery2";
			var vTmp1 = oEvent.getSource().sId;
			var vTmp2 = vTmp1.replace(Fieldname, "Land1");
			var oLand1 = sap.ui.getCore().byId(vTmp2);
			if(oLand1) {
				vLand1 = oLand1.getCustomData()[0].getValue();
			}
			vTmp2 = vTmp1.replace(Fieldname, "State");
			var oState = sap.ui.getCore().byId(vTmp2);
			if(oState) {
				if(oState.getMetadata().getName().toUpperCase() == "SAP.M.SELECT") vState = oState.getSelectedKey();
				else  vState = oState.getCustomData()[0].getValue();
			}
			vTmp2 = vTmp1.replace(Fieldname, "Counc");
			var oCounc = sap.ui.getCore().byId(vTmp2);
			if(oCounc) {
				vCounc = oCounc.getCustomData()[0].getValue();
			}
			vExcod = vLand1 + "|" + vState + "|" + vCounc ;
			
			var vAddFilter = [{key : "Persa", value : oController._vPersa},
			                  {key : "Actda", value : oController._vActda},
			                  {key : "Excod", value : vExcod}];
			
			mEmpCodeList = oController.setSpecialCodeData(vFieldName, vAddFilter);
			var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
			if(vEmpCodeList && vEmpCodeList.length) {
				for(var i=0; i<vEmpCodeList.length; i++) {
					if(vEmpCodeList[i].Field == vFieldName && vEmpCodeList[i].Ecode != "0000") {
						vEmpCodeList[i].Field = Fieldname;
					}
				}
			}
			
		}else if(Fieldname == "Gbdep"){
			var vExcod = "";
			var vTmp1 = oEvent.getSource().sId;
			var vTmp2 = vTmp1.replace(Fieldname, "Gblnd");
			var oGbdep = sap.ui.getCore().byId(vTmp2);
			if( typeof oGbdep == "object"){
				vExcod = oGbdep.getCustomData()[0].getValue();
			}
			var vAddFilter = [{key : "Persa", value : oController._vPersa},
			                  {key : "Actda", value : oController._vActda},
			                  {key : "Excod", value : vExcod}];
			Fieldname = "State";
			mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter);
		}else {
			var vAddFilter = [{key : "Persa", value : oController._vPersa},
			                  {key : "Actda", value : oController._vActda}];
			
			mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter);	
		}
		
		var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
		if(vEmpCodeList && vEmpCodeList.length) {
			vOneCodeList.EmpCodeListSet.push({Field : Fieldname, Ecode : "", Etext : oBundleText.getText("NOVALUE")});
			for(var i=0; i<vEmpCodeList.length; i++) {
				if(vEmpCodeList[i].Field == Fieldname && vEmpCodeList[i].Ecode != "0000") {
					vOneCodeList.EmpCodeListSet.push(vEmpCodeList[i]);
				}
			}
		}
		mOneCodeModel.setData(vOneCodeList);
		
		common.SearchCode.oController = oController;
		common.SearchCode.vCallControlId = oEvent.getSource().getId();
//		common.SearchCode.vMolga = oController._vMolga;
		
		if(!oController._CodeSearchDialog) {
			oController._CodeSearchDialog = sap.ui.jsfragment("fragment.CodeSearch", oController);
			oView.addDependent(oController._CodeSearchDialog);
		}
		oController._CodeSearchDialog.open();
		
		var oDialog = sap.ui.getCore().byId(oController.PAGEID + "_FCS_Dialog");
		oDialog.setTitle(vTitle);
	},
	
	onLiveChange : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		oController._vModifyContent = true;
		
		var s = oEvent.getParameter("value");
		if(s == "") {
			oEvent.getSource().removeAllCustomData();
		}
	},
	
	onLiveChangeAnzkd : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		oController._vModifyContent = true;
		
		var s = oEvent.getParameter("value");
		var oAnzkd = oEvent.getSource();
		
		if(parseInt(s) == 0) {
			oAnzkd.setValue("");
		}
		
	},
	
//	onLiveChangeRegio : function(oEvent){
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
//		var oController = oView.getController();
//		
//		oController._vModifyContent = true;
//		
//		var s = oEvent.getParameter("value");
//		if(s == "") {
//			oEvent.getSource().removeAllCustomData();
//		}
//		
//		var oView = sap.ui.getCore().byId(oController.PAGEID +"_Sub01"+"_Counc");
//	},

	_oldSSNLength : 0,
	onChangeSSN : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		oController._vModifyContent = true;
		
		var oControl = oEvent.getSource();
		
		var s = oEvent.getParameter("value");
		var t1 = s.replace(/-/g, ""); 
		
		var t2 = s;
		if(isNaN(t1)) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_NUMBER_PERMIT"));
			return;
		}
		
		if(oController._oldSSNLength < s.length) {
			if(s.length == 3) {
				t2 += "-";
			} else if(s.length == 6) {
				t2 += "-";
			}
		}
		
		oControl.setValue(t2);
		
		oController._oldSSNLength = t2.length;
		
	},
	
	onChangeZlsch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var vMolga = "";		
		if(oController._vMolga == "08" || oController._vMolga == "AE") vMolga = "08";
		else vMolga = "10";
		
		var vSelectedKey = oEvent.getSource().getSelectedKey();
		
		var lBankl = sap.ui.getCore().byId(oController.PAGEID + "_Label_Sub24_" + vMolga + "_Bankl");
		var lBankn = sap.ui.getCore().byId(oController.PAGEID + "_Label_Sub24_" + vMolga + "_Bankn");
		
		if(vMolga == "08" && vSelectedKey == "C") {
			lBankl.setRequired(false);
			lBankn.setRequired(false);
		} else {
			lBankl.setRequired(true);
			lBankn.setRequired(true);
		}
	},
	
	checkNumber : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		oController._vModifyContent = true;
		
		var oControl = oEvent.getSource();
		
		var s = oEvent.getParameter("value");
		
		if(isNaN(s)) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_NUMBER_PERMIT"));
			return;
		}
	},
	
	changeFirstName : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		if(oController._vMolga == "08" || oController._vMolga == "AE" ){
			var oRufnm = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Rufnm");
			if(oRufnm && oRufnm.getValue() == "") {
				oRufnm.setValue(oEvent.getParameter("value"));
			} 
		}
	},
	
	checkPostalCode : function(iLand1, iState, iPstlz) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		var oLand1 = sap.ui.getCore().byId(oController.PAGEID + iLand1);
		var oState = sap.ui.getCore().byId(oController.PAGEID + iState);
		var oPstlz = sap.ui.getCore().byId(oController.PAGEID + iPstlz);
		
		var fResult = true;
		
		if(oLand1 && oState && oPstlz) {
			if(oLand1.getValue() != "" && oPstlz.getValue() != "") {
				var vLand1 = oLand1.getCustomData()[0].getValue();
				var vState = "";
				if(oState.getMetadata().getName().toUpperCase() == "SAP.M.SELECT") vState = oState.getSelectedKey();
				else  vState = oState.getCustomData()[0].getValue();
				var vPstlz = oPstlz.getValue();
				
				if(vState == "0000") vState = "";
				
				oCommonModel.read(
					"/PostalCodeCheckSet/?$filter=Land1 eq '" + vLand1 + "' and State eq '" + vState + "' and Pstlz eq '" + vPstlz + "'",
					null,
					null,
					false,
					function(oData, oResponse) {
						fResult = true;
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
						
						oPstlz.setValueState(sap.ui.core.ValueState.Error);
						fResult = false;
				    }
				);
			}
		}
		
		return fResult;
	},
	
	checkCountryIdNum : function(vOneData, oIdNumControl) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		var fResult = true;
		
		var oPath = "/CountryIdnumCheckSet?$filter=";
		
		if(vOneData && oIdNumControl) {
			oPath += "Persa eq '" + oController._vPersa + "'";
			if(oIdNumControl.sId.indexOf("Numss") != -1){
				if(oController._vMolga == "46") 
					oPath += " and Idnum eq '" + vOneData.Idnum + "/" + vOneData.Nip00 + "'";
				else
					oPath += " and Idnum eq '" + vOneData.Idnum + "/" + vOneData.Cless + "'";	
			}else{
				oPath += " and Idnum eq '" + vOneData.Idnum + "'";
			}
			
			for(var i=0; i<oController._vCheckContryIdNum.length; i++) {
				var vVal = eval("vOneData." + oController._vCheckContryIdNum[i] + ";");
				if(oController._vCheckContryIdNum[i] == "Actda") {
					oPath += " and " + oController._vCheckContryIdNum[i] + " eq datetime'" + oController._vActda + "T00:00:00'"
				} else if(oController._vCheckContryIdNum[i] == "Gbdat") {
					var oGbdat = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Gbdat");
					if(oGbdat) {
						oPath += " and " + oController._vCheckContryIdNum[i] + " eq datetime'" + oGbdat.getValue() + "T00:00:00'"
					}
				} else {
					oPath += " and " + oController._vCheckContryIdNum[i] + " eq '" + vVal + "'";
				}				
			}
			
			oCommonModel.read(
					oPath,
					null,
					null,
					false,
				    function (oData, response) {
						fResult = true;
				    },
				    function (oError) {
				    	var Err = {};
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
								console.log(Err.error.innererror.errordetails[0].severity); //warning
								common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
							} else {
								common.Common.showErrorMessage(Err.error.message.value);
							}
							
						} else {
							common.Common.showErrorMessage(oError);
						}
						
						oIdNumControl.setValueState(sap.ui.core.ValueState.Error);
						fResult = false;
				    }
		    );
		}
		
		return fResult;
	},
	// 특수 문자 체크
	checkNum : function(vFieldname, vData, oController){
		var re = /[~!@\#$%^&*\()\-=+_']/gi;
		if(typeof vData != "undefined" && vData != null && vData != ""){
	        if(re.test(vData))
	        {
	        	sap.m.MessageBox.alert(oBundleText.getText("MSG_POS_VAL"));
	        	var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_"+vFieldname);
	        	oControl.setValueState(sap.ui.core.ValueState.Error);
	        	return false;
	        }
		}
        return true;
	},
	
	getHiringPersonalInfomationLayout : function(oController) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var vHiringPersonalInfomationLayout = [];
		oController._vDeafultContry = {Land1 : "", Land1tx : "", Natiotx : ""};
		
		oModel.read("/HiringPersonalInfomationLayoutSet?$filter=Docno eq'" + oController._vDocno + "' and "
				  + "Molga eq '" +  oController._vMolga + "' and "
				  + "Actda eq datetime'" + oController._vActda + "T00%3a00%3a00'",
			null,
			null,
			false, 	
			function(oData, oResponse) {	
				if(oData && oData.results) {
					for(var i=0; i<oData.results.length; i++) {
						vHiringPersonalInfomationLayout.push(oData.results[i]);
						if(oData.results[i].Fieldname.toUpperCase() == "NATIO") oController._vDeafultContry.Natiotx = oData.results[i].Dvalu;
						else if(oData.results[i].Fieldname.toUpperCase() == "LAND1"){
							oController._vDeafultContry.Land1 = oData.results[i].Dcode;
							oController._vDeafultContry.Land1tx = oData.results[i].Dvalu;
						}
					}
				}
			},
			function(oResponse) {
				common.Common.log(oResponse);
			}		
		);
		
		return vHiringPersonalInfomationLayout;
	},
	
	isExitsField : function(oController, Fieldname) {
		var vFiledInfo = null;
		for(var i=0; i<oController._vHiringPersonalInfomationLayout.length; i++) {
			var vFieldname = oController._vHiringPersonalInfomationLayout[i].Fieldname;
			if(vFieldname.toUpperCase() == Fieldname.toUpperCase()) {
				vFiledInfo = oController._vHiringPersonalInfomationLayout[i];
				break;
			}
		}
		return vFiledInfo;
	},
	
	isExitsAddressField : function(oController, Fieldname, Subty) {
		var vFiledInfo = null;
		for(var i=0; i<oController._vAddressLayout.length; i++) {
			if(Subty == oController._vAddressLayout[i].Subty) {
				var vFieldname = oController._vAddressLayout[i].Fieldname;
				if(vFieldname.toUpperCase() == Fieldname.toUpperCase()) {
					vFiledInfo = oController._vAddressLayout[i];
					break;
				}
			}
		}
		return vFiledInfo;
	},
	
	makeControl : function(oController, Fieldtype, Fieldname, vMaxLength, vLabelText, vUpdateValue, vUpdateTextValue, vChangeData, vDefaultValues) {
		var oControl = null;
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var vControlId = oController.PAGEID + "_" + oController._JobPage + "_" + Fieldname;
		
		if(Fieldtype == "M1" || Fieldtype == "O1") {
			if(Fieldname == "Famst") {
				oControl = new sap.m.Select(vControlId, {
		        	   width : "95%",
		        	   change : oController.onChangeFamst
		        }).addStyleClass("L2P13Font");
			}else{
				oControl = new sap.m.Select(vControlId, {
		        	   width : "95%",
		        	   change : oController.changeModifyContent
		        }).addStyleClass("L2P13Font");
			}
			var vAddFilter = [{key : "Persa", value : oController._vPersa},
			                  {key : "Actda", value : oController._vActda}];
			var mDataModel = null;
			
			if(Fieldname.toLowerCase() == "state") {
				var vExcod = "";
				if(vChangeData) vExcod = vChangeData.Land1;
				else {
					vExcod = oController.getDefaultValue(vDefaultValues, "Land1");
				}
				vAddFilter.push({key : "Excod", value : vExcod});
				mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter);
				mDataModel.setSizeLimit(1000);
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				
				oControl.setSelectedKey(vUpdateValue);
			} else if(Fieldname.toLowerCase() == "emecstate") {
				var vExcod = "";
				if(vChangeData) vExcod = vChangeData.Emecland1;
				else vExcod = oController.getDefaultValue(vDefaultValues, "Emecland1");
				vAddFilter.push({key : "Excod", value : vExcod});
				mDataModel = oController.setSpecialCodeData("State", vAddFilter, true);
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				
				oControl.setSelectedKey(vUpdateValue);
			} else if(Fieldname.toLowerCase() == "gbdep") {
				var vExcod = "";
				if(vChangeData) vExcod = vChangeData.Gblnd;
				else vExcod = oController.getDefaultValue(vDefaultValues, "Gblnd");
				vAddFilter.push({key : "Excod", value : vExcod});
				mDataModel = oController.setSpecialCodeData("State", vAddFilter, true);
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				
				oControl.setSelectedKey(vUpdateValue);
			} else if(Fieldname.toUpperCase() == "SEXORIENT") {
				mDataModel = oController.getDomainValueData("P08_SEXORIENT", [{key : "DomvalueL", value : oController._vMolga}], true);
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/DomainCodeListSet", new sap.ui.core.Item({key : "{DomvalueL}", text : "{Ddtext}"}));
				
				oControl.setSelectedKey(vUpdateValue);
			} else if(Fieldname == "Titl2") {
				vAddFilter.push({key : "Excod", value : "S"});				
				mDataModel = oController.setSpecialCodeData("Titel", vAddFilter, true);
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				
				oControl.setSelectedKey(vUpdateValue);
			} else if(Fieldname == "Titel") {
				vAddFilter.push({key : "Excod", value : "T"});				
				mDataModel = oController.setSpecialCodeData("Titel", vAddFilter, true);
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				
				oControl.setSelectedKey(vUpdateValue);
			} else if(Fieldname == "Anred") {
				oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
				
				oControl.attachChange(oController.onChangeAnred);
				
				oControl.setSelectedKey(vUpdateValue);
			} else if(Fieldname == "Famst") {
				if(oController.isExitsField(oController, "Famdt") == null) {
					oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
					oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
					
					oControl.setSelectedKey(vUpdateValue);
				} else {
					oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
					oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
					
					oControl.setWidth("50%");
					oControl.setSelectedKey(vUpdateValue);
					
					var oFamdt = new sap.m.DatePicker(oController.PAGEID + "_" + oController._JobPage + "_Famdt", {
			        	   width : "50%",
			        	   valueFormat : "yyyy-MM-dd",
				           displayFormat : gDtfmt,
				           change : oController.changeDate, 
				           enabled : !oController._DISABLED
			        }).addStyleClass("L2P13Font");					
					
					if(vChangeData != null) {
						if(vChangeData.Famdt != null && vChangeData.Famdt != "") {
							var tDate = common.Common.setTime(new Date(vChangeData.Famdt));
							oFamdt.setValue(dateFormat.format(new Date(tDate)));
						}
					}
					
					var oToolbar = new sap.m.Toolbar({
						width : "95%",
						content : [
								oControl,
								new sap.m.ToolbarSpacer(),
								oFamdt]
				    }).addStyleClass("L2PToolbarNoBottomLine");
					
					oController.onChangeFamst();
					return oToolbar;
				}
				
			} else if(Fieldname == "Namzu") {
				vAddFilter.push({key : "Excod", value : "Z"});				
				mDataModel = oController.setSpecialCodeData("Namzu", vAddFilter, true);
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
				
				oControl.setSelectedKey(vUpdateValue);
				
			} else {
				oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
				
				oControl.setSelectedKey(vUpdateValue);
			}	
		} else if(Fieldtype == "M2" || Fieldtype == "O2") {
			if(Fieldname == "Orgeh") {
				oControl = new sap.m.Input(vControlId, {
		        	   width : "95%", 
		        	   showValueHelp: true,
		        	   valueHelpOnly: true,
		        	   liveChange : oController.onLiveChange,
					   valueHelpRequest: oController.displayOrgSearchDialog
		        }).addStyleClass("L2P13Font");
				oControl.setValue(vUpdateTextValue);
				oControl.addCustomData(new sap.ui.core.CustomData({
					key : Fieldname,
					value : vUpdateValue
				}));
			} else if(Fieldname == "Stell") {
				oControl = new sap.m.Input(vControlId, {
		        	   width : "95%",
		        	   showValueHelp: true,
		        	   valueHelpOnly: true,
		        	   liveChange : oController.onLiveChange,
					   valueHelpRequest: oController.displayStellSearchDialog
		        }).addStyleClass("L2P13Font");
				oControl.setValue(vUpdateTextValue);
				oControl.addCustomData(new sap.ui.core.CustomData({
					key : Fieldname,
					value : vUpdateValue
				}));
			} else {
				oControl = new sap.m.Input(vControlId, {
		        	   width : "95%",
		        }).addStyleClass("L2P13Font");
				oControl.setValue(vUpdateTextValue);
				oControl.addCustomData(new sap.ui.core.CustomData({
					key : Fieldname,
					value : vUpdateValue
				}));
			}
		} else if(Fieldtype == "M3" || Fieldtype == "O3") {
			if(Fieldname == "Vorna") {
				oControl = new sap.m.Input(vControlId, {
		        	   width : "95%",
		        	   liveChange : oController.onLiveChange,
		        	   change : oController.changeFirstName,
		        	   maxLength : vMaxLength
		        }).addStyleClass("L2P13Font");
				oControl.setValue(vUpdateValue);
			} else if(Fieldname == "Pstlz") {
				var fShowValueHelp = false; 
				if(vChangeData != null && vChangeData.Land1) {
					if(vChangeData.Land1 == "KR") {
						fShowValueHelp = true;
					}
				} else {
					if(oController.getDefaultValue(vDefaultValues, "Land1") == "KR") {
						fShowValueHelp = true;
					}
				}
				oControl = new sap.m.Input(vControlId, {
		        	   width : "95%",
		        	   showValueHelp: fShowValueHelp,
		        	   valueHelpRequest: oController.onDisplaySearchZipcodeDialog,
		   			   liveChange : oController.changeModifyContent,
		        	   maxLength : vMaxLength
		        }).addStyleClass("L2P13Font");
				oControl.setValue(vUpdateValue);
			} else if(Fieldname == "Perid" || Fieldname == "Idnum") {				
				oControl = new sap.m.Input(vControlId, {
		        	   width : "95%",
		        	   maxLength : vMaxLength
		        }).addStyleClass("L2P13Font");
				oControl.attachLiveChange(oController.onLiveChange);
				oControl.setValue(vUpdateValue);
				
				if(oController._vMolga == "10") {
					oControl.addEventDelegate({
						onAfterRendering:function(){	
							 $("#" + vControlId + "-inner").mask("999-99-9999",{placeholder:"XXX-XX-XXXX"});
						}
					});
				} else if(oController._vMolga == "41") {
					oControl.addEventDelegate({
						onAfterRendering:function(){	
							 $("#" + vControlId + "-inner").mask("999999-9999999",{placeholder:"XXXXXX-XXXXXXX"});
						}
					});
				} else if(oController._vMolga == "08") {
					oControl.attachChange(oController.onToUpperCaseChange);
					oControl.addEventDelegate({
						onAfterRendering:function(){	
							 $("#" + vControlId + "-inner").mask("aa999999a",{placeholder:"XX999999X"});
						}
					});
				}
			} else if(Fieldname == "Stras") {
				if(oController._vMolga == "18") {
					var oToolbar = new sap.m.Toolbar({
						width : "95%",
						content : []
				    }).addStyleClass("L2PToolbarNoBottomLine");
					
					var oStras = new sap.m.Input(oController.PAGEID + "_" + oController._JobPage + "_Stras", {
						type : "Text",
						width : "45%",
						maxLength : vMaxLength,
						liveChange : oController.changeModifyContent,
						enabled : !oController._DISABLED
					});
					oStras.setTooltip(vLabelText);
					if(vChangeData != null) {
						oStras.setValue(vChangeData.Stras);
					}
					oToolbar.addContent(oStras);
					
					var vHsnmrInfo = oController.isExitsField(oController, "Hsnmr");
					if(vHsnmrInfo != null) {
						var oHsnmr = new sap.m.Input(oController.PAGEID + "_" + oController._JobPage + "_Hsnmr", {
							type : "Text",
							width : "25%",
							maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Hsnmr"),
							liveChange : oController.changeModifyContent,
							enabled : !oController._DISABLED
						});	
						oHsnmr.setTooltip(vHsnmrInfo.Label);
						if(vChangeData != null) {
							oHsnmr.setValue(vChangeData.Hsnmr);
						}
						oToolbar.addContent(new sap.m.Label({text : " / "}));
						oToolbar.addContent(oHsnmr);
					}		
					
					var vPostaInfo = oController.isExitsField(oController, "Posta");
					if(vPostaInfo != null) {
						var oPosta = new sap.m.Input(oController.PAGEID + "_" + oController._JobPage + "_Posta", {
							type : "Text",
							width : "25%",
							maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjects", "Posta"),
							liveChange : oController.changeModifyContent,
							enabled : !oController._DISABLED
						});
						oPosta.setTooltip(vPostaInfo.Label);
						if(vChangeData != null) {
							oPosta.setValue(vChangeData.Posta);
						}
						oToolbar.addContent(new sap.m.Label({text : " / "}));
						oToolbar.addContent(oPosta);
					}	
					
					return oToolbar;
				} else {
					oControl = new sap.m.Input(vControlId, {
			        	   width : "95%",
			        	   liveChange : oController.onLiveChange,
			        	   maxLength : vMaxLength,
			        	   enabled : !oController._DISABLED
			        }).addStyleClass("L2P13Font");
					oControl.setValue(vUpdateValue);
				}
			}else if(Fieldname == "Anzkd") {
				oControl = new sap.m.Input(vControlId, {
					   type : "Number",
		        	   width : "95%",
		        	   liveChange : oController.onLiveChangeAnzkd,
		        	   maxLength : vMaxLength
		        }).addStyleClass("L2P13Font");
				oControl.setValue(vUpdateValue);
			}else if(Fieldname == "Nip00") {
				oControl = new sap.m.Input(vControlId, {
					   width : "95%",
					   maxLength : vMaxLength
		        }).addStyleClass("L2P13Font");
				oControl.setValue(vUpdateValue);
				oControl.addEventDelegate({
					onAfterRendering:function(){	
						 $("#" + vControlId + "-inner").mask("999-999-99-99",{placeholder:"XXX-XXX-XX-XX"});
					}
				
				});
			}else {
				oControl = new sap.m.Input(vControlId, {
		        	   width : "95%",
		        	   liveChange : oController.onLiveChange,
		        	   maxLength : vMaxLength
		        }).addStyleClass("L2P13Font");
				oControl.setValue(vUpdateValue);
			}
		} else if(Fieldtype == "M4" || Fieldtype == "O4") {
			oControl = new sap.m.DatePicker(vControlId, {
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
			if(Fieldname.toUpperCase().indexOf("LAND1") != -1 || Fieldname.toUpperCase().indexOf("GBLND") != -1) {
				oControl = new sap.m.Input(vControlId, {
		        	   width : "95%",
		        	   showValueHelp: true,
		        	   valueHelpOnly : true,
		        	   liveChange : oController.onLiveChange,
					   valueHelpRequest: oController.onDisplaySearchNatioDialog
		        }).addStyleClass("L2P13Font");
				
				oControl.setValue(vUpdateTextValue);
				oControl.addCustomData(new sap.ui.core.CustomData({
					key : Fieldname,
					value : vUpdateValue
				}));
			} 
//			else if(oController._vMolga == "46" &&Fieldname.toUpperCase().indexOf("STATE") != -1) {
//				oControl = new sap.m.Input(vControlId, {
//		        	   width : "95%",
//		        	   showValueHelp: true,
//		        	   valueHelpOnly : true,
//		        	   liveChange : oController.onLiveChangeRegio,
//					   valueHelpRequest: oController.displayCodeSearchDialog
//		        }).addStyleClass("L2P13Font");
//				
//				oControl.setValue(vUpdateTextValue);
//				oControl.addCustomData(new sap.ui.core.CustomData({
//					key : Fieldname,
//					value : vUpdateValue
//				}));
//				oControl.addCustomData(new sap.ui.core.CustomData({
//					key : "Title",
//					value : vLabelText
//				}));
//				
//			}
			else {
				oControl = new sap.m.Input(vControlId, {
		        	   width : "95%",
		        	   showValueHelp: true,
		        	   valueHelpOnly : true,
		        	   liveChange : oController.onLiveChange,
					   valueHelpRequest: oController.displayCodeSearchDialog
		        }).addStyleClass("L2P13Font");
				
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
		} else if(Fieldtype == "M6" || Fieldtype == "O6") {
			oControl = new sap.m.CheckBox(vControlId, {
	        	   select : oController.onLiveChange
	        }).addStyleClass("L2P13Font");
			if(vUpdateValue == "X") oControl.setSelected(true);
			if(vUpdateTextValue == "X") oControl.setSelected(true);
			else  oControl.setSelected(false);
		} else if(Fieldtype == "M7" || Fieldtype == "O7") {
			var vLand1 = ""; 
			if(vChangeData != null && vChangeData.Land1) {
				vLand1 = vChangeData.Land1;
			} else {
				vLand1 = oController.getDefaultValue(vDefaultValues, "Land1");
			}
			oControl = new sap.m.Input(vControlId, {
	        	   width : "95%",
	        	   change : oController.changeModifyContent,
	        	   maxLength : vMaxLength
	        }).addStyleClass("L2P13Font");
			oControl.addEventDelegate({
				onAfterRendering:function(){	
					oController.setTelInit(oController, oController._JobPage + "_" + Fieldname, vUpdateValue, vLand1);
				}
			});
		} else if(Fieldtype == "M8" || Fieldtype == "O8") {
			var mDomainModel = oController.getDomainValueData(Fieldname, [{key : "DomvalueL", value : oController._vMolga}], false);
			var vDomainValueList = mDomainModel.getProperty("/DomainCodeListSet");
			
			oControl = new sap.m.RadioButtonGroup(vControlId, {
				width : "95%"
			});			
			
			var vSelIdx ;
			if(vDomainValueList && vDomainValueList.length) {
				oControl.setColumns(vDomainValueList.length + 1);
				
				for(var i=0; i<vDomainValueList.length; i++) {
					var oRadio = new sap.m.RadioButton({
						text : vDomainValueList[i].Ddtext,
						groupName : Fieldname,
						customData : {key : "value", value : vDomainValueList[i].DomvalueL}
					});
					if(vUpdateValue == vDomainValueList[i].DomvalueL) {
						vSelIdx = i;
					}
					
					oControl.addButton(oRadio);
				}				
			}
			oControl.setSelectedIndex(vSelIdx);
		} else if(Fieldtype == "D0" || Fieldtype == "D1") {
			oControl = new sap.m.Input(vControlId, {
	        	   width : "95%",
	        	   editable : false,
	        }).addStyleClass("L2P13Font");
			oControl.setValue(vUpdateValue);
		} 
		
		if(Fieldname != "Stras" && oControl) {
			oControl.setEnabled(!oController._DISABLED);
			oControl.setTooltip(vLabelText);
		}
		
		return oControl;
	},
	
	getEmpCodeField : function(oController) {
		var vExceptionFields = ["State","Emecstate","Sexorient","Titl2","Titel", "Gbdep","Namzu"];
		var vEmpCodeListFields = [];
		
		var oEmpCodeControlls = [
			                      {"Fieldname" : "Quali"}, //언어
			                      {"Fieldname" : "Slart"}, //학력
			                      {"Fieldname" : "Faccd"}, //전공
			                      {"Fieldname" : "Ansvx"}, //고용상태
			                      {"Fieldname" : "Serty"}, //병역상태구분
			                      {"Fieldname" : "Preas"}, //전역구분
			                      {"Fieldname" : "Jobcl"}, //병역종류
			                      {"Fieldname" : "Mrank"}, //병역계급
//			                      {"Fieldname" : "Hukot"}, //
			                      {"Fieldname" : "Waers"}, //통화
			                      {"Fieldname" : "Racky"}, //민족
			                      {"Fieldname" : "Milsa"}, //병역상태
			                      {"Fieldname" : "Disab"}, //장애유형
			                      {"Fieldname" : "Auspr"}, //언어 숙련도
			                      {"Fieldname" : "Rctvc"},  //Municipal city code,
			                      {"Fieldname" : "P08disty"},  //장애유형
			                      ];
		
		for(var i=0; i<oController._vHiringPersonalInfomationLayout.length; i++) {			
			var Fieldname = oController._vHiringPersonalInfomationLayout[i].Fieldname;
			var Fieldtype = oController._vHiringPersonalInfomationLayout[i].Incat;
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
					vEmpCodeListFields.push(oController._vHiringPersonalInfomationLayout[i]);
				}
			}
		}
		
		for(var i=0; i<oEmpCodeControlls.length; i++) {
			vEmpCodeListFields.push(oEmpCodeControlls[i]);
		}
		
		return vEmpCodeListFields;
	},
	
getDomainValueData : function(Fieldname, vAddFilter, select) {
		
		var mCodeModel = new sap.ui.model.json.JSONModel();
		var vCodeModel = {DomainCodeListSet : []};
		
		var filterString = "/?$filter=Domname%20eq%20%27" + Fieldname.toUpperCase() + "%27";
		if(vAddFilter && vAddFilter.length) {
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
		}
		
		if(select) vCodeModel.DomainCodeListSet.push({Field : Fieldname, DomvalueL : "0000", Ddtext : oBundleText.getText("SELECTDATA")});
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		oCommonModel.read("/DomainValueListSet" + filterString,
					null,
					null,
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vCodeModel.DomainCodeListSet.push(oData.results[i]);
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
	
	getDefaultValue : function(vDefaultValues, vFieldname) {
		var vDefaultValue = "";
		if(vDefaultValues && vDefaultValues.length) {
			for(d=0; d<vDefaultValues.length; d++) {
				if(vDefaultValues[d].Fieldname == vFieldname) {
					vDefaultValue = vDefaultValues[d].Code
					break;
				}
			}
		}
		return vDefaultValue;
	},
	
	setTelInit : function(oController, vTelId, vUpdateValue, vLand1) {
		var vPContry = vLand1.toLowerCase();
		
		var oTelControl = $("#" + oController.PAGEID + "_" + vTelId + "-inner");
		if(oTelControl) {
			oTelControl.intlTelInput({
		        autoFormat: true,
		        autoPlaceholder: false,
		        defaultCountry: vPContry,
				utilsScript: "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/plugin/InitTel/utils.js"
			});
			
			var vTelno = vUpdateValue;
			oTelControl.intlTelInput("setNumber", vTelno);
			if(vTelno == "") {
				oTelControl.intlTelInput("selectCountry", vPContry);
			}				
		}
	},
	
	makeAddressControl : function(oController, Fieldtype, Fieldname, vMaxLength, vLabelText, vUpdateValue, vUpdateTextValue, vSavedData, vSubty) {
		var oControl = null;
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		var vControlId = oController.PAGEID + "_Sub21_Form_" + vSubty + "_" + Fieldname;
		
		var oControl = null;
		
		if(Fieldtype == "M1" || Fieldtype == "O1") {
			oControl = new sap.m.Select(vControlId, {
	        	   width : "95%",
	        	   change : oController.changeModifyContent,
	        }).addStyleClass("L2P13Font");
			
			if(Fieldname == "State") {
				if(vSavedData == null) {
					oController.setDDLBState2(vUpdateValue, oController._vDeafultContry.Land1, vControlId);
				} else {
					oController.setDDLBState2(vUpdateValue, vSavedData.Land1, vControlId);
				}
				oControl.attachChange(oController.onChangeState);
			} else if(Fieldname == "Rctvc") {
				if(vSavedData == null) {
					oController.setCity(vUpdateValue, oController.PAGEID + "_Sub21_Form_" + vSubty + "_State", oController.PAGEID + "_Sub21_Form_" + vSubty + "_" + Fieldname);
				} else {
					oController.setCity(vUpdateValue, oController.PAGEID + "_Sub21_Form_" + vSubty + "_State", oController.PAGEID + "_Sub21_Form_" + vSubty + "_" + Fieldname, vSavedData.State);
				}
			} else {
				oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
				oControl.setSelectedKey(vUpdateValue);
			}
			
		} else if(Fieldtype == "M3" || Fieldtype == "O3") {
			if(Fieldname == "Stras") {
				if(oController._vMolga == "18") {
					var oToolbar = new sap.m.Toolbar({
						width : "95%",
						content : []
				    }).addStyleClass("L2PToolbarNoBottomLine");
					
					var vTmpSubty = "";
					if(vSubty.indexOf("_") != -1) {
						vTmpSubty = vSubty.substring(0, vSubty.indexOf("_"));
					} else {
						vTmpSubty = vSubty;
					}
					
					var oStras = new sap.m.Input(vControlId, {
						type : "Text",
						width : "45%",
						maxLength : vMaxLength,
						liveChange : oController.changeModifyContent,
						enabled : !oController._DISABLED
					});
					oStras.setTooltip(vLabelText);
					if(vSavedData != null) {
						oStras.setValue(vSavedData.Stras);
					}
					oToolbar.addContent(oStras);
					
					var vHsnmrInfo = oController.isExitsAddressField(oController, "Hsnmr", vTmpSubty);
					if(vHsnmrInfo != null) {
						var oHsnmr = new sap.m.Input(oController.PAGEID + "_Sub21_Form_" + vSubty + "_Hsnmr", {
							type : "Text",
							width : "25%",
							maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjectsAddress", "Hsnmr"),
							liveChange : oController.changeModifyContent,
							enabled : !oController._DISABLED
						});	
						oHsnmr.setTooltip(vHsnmrInfo.Label);
						if(vSavedData != null) {
							oHsnmr.setValue(vSavedData.Hsnmr);
						}
						oToolbar.addContent(new sap.m.Label({text : " / "}));
						oToolbar.addContent(oHsnmr);
					}		
					
					var vPostaInfo = oController.isExitsAddressField(oController, "Posta", vTmpSubty);
					if(vPostaInfo != null) {
						var oPosta = new sap.m.Input(oController.PAGEID + "_Sub21_Form_" + vSubty + "_Posta", {
							type : "Text",
							width : "25%",
							maxLength : common.Common.getODataPropertyLength("ZL2P01GW0001_SRV", "RecruitingSubjectsAddress", "Posta"),
							liveChange : oController.changeModifyContent,
							enabled : !oController._DISABLED
						});
						oPosta.setTooltip(vPostaInfo.Label);
						if(vSavedData != null) {
							oPosta.setValue(vSavedData.Posta);
						}
						oToolbar.addContent(new sap.m.Label({text : " / "}));
						oToolbar.addContent(oPosta);
					}	
					
					return oToolbar;
				} else {
					oControl = new sap.m.Input(vControlId, {
			        	   width : "95%",
			        	   liveChange : oController.changeModifyContent,
			        	   maxLength : vMaxLength,
			        	   enabled : !oController._DISABLED
			        }).addStyleClass("L2P13Font");
					oControl.setValue(vUpdateValue);
				}
			} else {
				oControl = new sap.m.Input(vControlId, {
		        	   width : "95%",
		        	   liveChange : oController.changeModifyContent,
		        	   maxLength : vMaxLength,
		        	   enabled : !oController._DISABLED
		        }).addStyleClass("L2P13Font");
				oControl.setValue(vUpdateValue);
			}
		} else if(Fieldtype == "M4" || Fieldtype == "O4") {
			oControl = new sap.m.DatePicker(vControlId, {
	        	   width : "95%",
	        	   valueFormat : "yyyy-MM-dd",
		           displayFormat : gDtfmt,
		           change : oController.changeModifyDate,
	        }).addStyleClass("L2P13Font");
			if(vUpdateValue != null && vUpdateValue != "") {
				var tDate = common.Common.setTime(new Date(vUpdateValue));
				oControl.setValue(dateFormat.format(new Date(tDate)));
			}
		} else if(Fieldtype == "M5" || Fieldtype == "O5") {
			if(Fieldname == "Land1") {
				oControl = new sap.m.Input(vControlId, {
		        	   width : "95%",
		        	   showValueHelp: true,
		        	   valueHelpOnly: true,
		        	   liveChange : oController.onLiveChange,
					   valueHelpRequest: oController.onDisplaySearchNatioDialog
		        }).addStyleClass("L2P13Font");
			} else {
				oControl = new sap.m.Input(vControlId, {
		        	   width : "95%",
		        	   showValueHelp: true,
		        	   valueHelpOnly: true,
		        	   liveChange : oController.onLiveChange,
					   valueHelpRequest: oController.displayCodeSearchDialog
		        }).addStyleClass("L2P13Font");
			}
			
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
		
		if(oControl) {
			oControl.setEnabled(!oController._DISABLED);
			oControl.setTooltip(vLabelText);
		}
		
		return oControl;
	},
	
	makeAddressTelnr10 : function(oController, Subty, vAddressContext, vMaxLength) {
		
		var oTelnr1 = new sap.m.Input(oController.PAGEID + "_Sub21_Form_" + Subty + "_Telnr1", {
			type : "Number",
			width : "50px",
			maxLength : 3,
			liveChange : oController.changeTelnr,
			enabled : !oController._DISABLED
		});
		
		var oTelnr2 = new sap.m.Input(oController.PAGEID + "_Sub21_Form_" + Subty + "_Telnr2", {
			type : "Number",
			width : "50px",
			maxLength : 3,
			liveChange : oController.changeTelnr,
			enabled : !oController._DISABLED
		});
		
		var oTelnr3 = new sap.m.Input(oController.PAGEID + "_Sub21_Form_" + Subty + "_Telnr3", {
			type : "Number",
			width : "80px",
			maxLength : 4, 
			liveChange : oController.changeTelnr,
			enabled : !oController._DISABLED
		});
		
		var oTelnr = new sap.m.Input(oController.PAGEID + "_Sub21_Form_" + Subty + "_Telnr", {
			type : "Number",
			visible : true,
			enabled : !oController._DISABLED
		}).addStyleClass("L2PDisplayNone");
		
		if(vAddressContext != null && vAddressContext.Telnr) {
			oTelnr1.setValue(vAddressContext.Telnr.substring(0,3));
			oTelnr2.setValue(vAddressContext.Telnr.substring(3,6));
			oTelnr3.setValue(vAddressContext.Telnr.substring(6));
			oTelnr.setValue(vAddressContext.Telnr);
		}
		
		var oControl = new sap.m.Toolbar({
			width : "95%",
			content : [
		           oTelnr1,
		           new sap.m.Label({text : "", width: "10px"}),
		           oTelnr2,
		           new sap.m.Label({text : "-", width: "10px"}),
		           oTelnr3, oTelnr]
	    }).addStyleClass("L2PToolbarNoBottomLine");
		
		return oControl;
	},
	
	changeTelnr : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		var vControlId = oEvent.getSource().getId();
		var vOrgin_ControlId = vControlId.substring(0, vControlId.length - 1);
		
		var oTelnr = sap.ui.getCore().byId(vOrgin_ControlId);
		var oTelnr1 = sap.ui.getCore().byId(vOrgin_ControlId + "1");
		var oTelnr2 = sap.ui.getCore().byId(vOrgin_ControlId + "2");
		var oTelnr3 = sap.ui.getCore().byId(vOrgin_ControlId + "3");
		
		oTelnr.setValue(oTelnr1.getValue() + oTelnr2.getValue() + oTelnr3.getValue());
	},
	
	onChangeAnred : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();
		
		oController._vModifyContent = true;
		
		var sKey = oEvent.getSource().getSelectedKey();
		
		//Mr=Male, Dr=TBD, Mrs, Miss, Ms, Madam=Female
		
		
		var oGesch = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Gesch");
		if(oController._vMolga == "08") {
			if(oGesch) {
				if(sKey == "1") oGesch.setSelectedIndex(2);
				else if(sKey == "2") oGesch.setSelectedIndex(0);
				else oGesch.setSelectedIndex(1);
			}
		}else{
			if(oGesch){
				for(var i=0; i< oController._vTitleGenderKeyList.length; i++){
					if(sKey == oController._vTitleGenderKeyList[i].Anred){
						if(oGesch instanceof sap.m.Select){
							if(oController._vTitleGenderKeyList[i].Gesch != 0)
							oGesch.setSelecetdKey(parseInt(oController._vTitleGenderKeyList[i].Gesch)-1);
						}else if(oGesch instanceof sap.m.RadioButtonGroup){
							if(oController._vTitleGenderKeyList[i].Gesch != 0)
							oGesch.setSelectedIndex(parseInt(oController._vTitleGenderKeyList[i].Gesch)-1);
						}
						break;
					}
				}
			}
		}
	},
	
	onToUpperCaseChange : function(oEvent) {
		var oControl = oEvent.getSource();
		var vValue = oEvent.getParameter("value");
		if(vValue != "") {
			oControl.setValue(vValue.toUpperCase());
		}
	},
		
	setSub02Layout : function(oController){
		var oCoulmn = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Zzqual_Coulmn");
		var oCoulmnList = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Zzqual_CoulmnList");
		
		if(oController._vMolga == "08" || oController._vMolga == "46"){
			oCoulmn.setVisible(true);	
			oCoulmnList.setVisible(true);
		}else{
			oCoulmn.setVisible(false);	
			oCoulmnList.setVisible(false);
		}
	},
	
	_OSearchZzqualiEvent : null,
	
	SearchQualiDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();	
		
		oController._SelectedContext = null;
		
		if(!oController._OSearchZzqualiEvent) {
			oController._OSearchZzqualiEvent = sap.ui.jsfragment("zui5_hrxx_actapp2.fragment.ActRecPInfo_POP_Zzquali", oController);
			oView.addDependent(oController._OSearchZzqualiEvent);
		}
		
		oController._OSearchZzqualiEvent.open();
		
		var oZzqualiCodeModel = sap.ui.getCore().getModel("ZzqualiCodeList");
		var vCode = { ZzqualiCodeListSet : [] };
		vCode.ZzqualiCodeListSet.push({Ecode : "", Etext : oBundleText.getText("NOVALUE")});
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		var oPath = "/EmpCodeListSet/?$filter=Field%20eq%20%27Zzquali%27%20and%20"+
        		"Persa%20eq%20%27" + oController._vPersa +"%27";
		
		oCommonModel.read(
					oPath,
					null,
					null,
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vCode.ZzqualiCodeListSet.push(oData.results[i]);
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
		oZzqualiCodeModel.setData(vCode);
	},
	
	onSearchQuali : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();	
		var sValue = oEvent.getParameter("value");
		
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Etext", sap.ui.model.FilterOperator.Contains, sValue));
	    
		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter(oFilters);
	},
	
	onConfirmQuali : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
		var oController = oView.getController();	
		var aContexts = oEvent.getParameter("selectedContexts");
		var oZzquali = sap.ui.getCore().byId(oController.PAGEID + "_Sub02_Zzquali");
		if (aContexts.length) {
			var vQuali = aContexts[0].getProperty("Ecode");
	    	var vQualitx = aContexts[0].getProperty("Etext");
	    	oZzquali.removeAllCustomData();
	    	if(vQualitx == oBundleText.getText("NOVALUE")) oZzquali.setValue("");
	    	else oZzquali.setValue(vQualitx);
	    	
	    	oZzquali.addCustomData(new sap.ui.core.CustomData({key : "Zzquali", value : vQuali}));
	    }
		
		oController.onCancelQuali(oEvent);
		
	},
	
	onCancelQuali : function(oEvent) {
		var oBinding = oEvent.getSource().getBinding("items");
	    var oFilters = [];
		oBinding.filter(oFilters);
	},
});


function ZipCodeList_OnSearchEnd(result) {
	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
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
	var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActRecPInfo");
	var oController = oView.getController();
	
	var oPstlz = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Pstlz");
	var oState = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_State");
	var oOrt01 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Ort01");
	var oOrt02 = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Ort02");
	var oLocat = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Locat");
	
	oPstlz.setValue(ZipCodeList.GetCellValue(Row, "Pstlz"));
	if(oState) oState.setSelectedKey(ZipCodeList.GetCellValue(Row, "State"));
	if(oOrt01) oOrt01.setValue(ZipCodeList.GetCellValue(Row, "Ort01"));
	if(oOrt02) oOrt02.setValue(ZipCodeList.GetCellValue(Row, "Ort02"));
	if(oLocat) oLocat.setValue(ZipCodeList.GetCellValue(Row, "Ort02"));
	
	oController.onCloseZipcode();
}
