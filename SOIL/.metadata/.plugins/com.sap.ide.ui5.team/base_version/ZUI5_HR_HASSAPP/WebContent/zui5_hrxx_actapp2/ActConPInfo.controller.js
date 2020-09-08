jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");
jQuery.sap.require("zui5_hrxx_actapp2.common.Common");
jQuery.sap.require("common.SearchCode");

sap.ui.controller("zui5_hrxx_actapp2.ActConPInfo", {
	
	PAGEID : "ActConPInfo",
	
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
	
	_vModifyContent : false,
	
	_vFromPageId : "",
	
	_DISABLED : false,
	_JobPage : "",
	
	BusyDialog : new sap.m.BusyDialog(),
	
	subAction : "",
	
	_vSelectedContext : null,
	_vHiringPersonalInfomationLayout : [],
	_vTitleGenderKeyList : [],
	_vDeafultContry : null,
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actapp2.ActConPInfo
*/
	onInit: function() {
//		if(!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
//	    };
	         
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
			} else {
				this._vCntSub01 = 0;
			}
		}
		
		var oController = this;
				
		var oTitle = sap.ui.getCore().byId(this.PAGEID + "_PAGETITLE");
		if(this._vActionType == "V") oTitle.setText("계약자정보조회");
		else if(this._vActionType == "M")  oTitle.setText("계약자정보수정");
		else oTitle.setText("계약자정보등록");
		
		var oSaveBtn = sap.ui.getCore().byId(this.PAGEID + "_SAVE_BTN");
		
		if(this._vStatu == "" || this._vStatu == "10") {
			if(this._vActionType == "V") {
				this._DISABLED = true;
				oSaveBtn.setVisible(false);
			} else {
				this._DISABLED = false;
				oSaveBtn.setVisible(true);
			}
		} else {
			this._DISABLED = true;
			oSaveBtn.setVisible(false);
		}

	    if(this._vActda == "" || this._vActda == null) this._vActda = dateFormat.format(new Date());
//	    common.Common.loadCodeData(this._vPersa, this._vActda, oEmpCodeControlls);
	
	    var oIconTabBar = sap.ui.getCore().byId(this.PAGEID + "_TABBAR");
		if(oIconTabBar.getSelectedKey() != "Sub01") oIconTabBar.setSelectedKey("Sub01");
		this._JobPage = "Sub01";		
		
		var oNameLayout = sap.ui.getCore().byId(this.PAGEID + "_NameLayout");
		var oNameLayoutText = sap.ui.getCore().byId(this.PAGEID + "_NameLayoutText");
		if(oNameLayoutText) oNameLayoutText.setText("");
		if(oNameLayout) oNameLayout.setVisible(false);
		
		var oSub01 = sap.ui.getCore().byId(this.PAGEID + "_TABFILTER_Sub01");
		if(oSub01) oSub01.destroyContent();
		
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
	},
	
	onAfterShow: function(evt) {
		var oController = this;
		var setting = function() {
			oController.setSub01();
			
			oController.setCountTabBar(this, "Sub01");
			
			oController.BusyDialog.close();
		}
		
		oController.BusyDialog.open();
		
		setTimeout(setting, 300);
	},
	
	setTelInit : function(oController, vTelId, vUpdateValue) {
		var vPContry = oController._vDeafultContry.Land1;
		
		var oTelControl = $("#" + oController.PAGEID + "_" + vTelId + "-inner");
		if(oTelControl) {
			oTelControl.intlTelInput({
		        autoFormat: true,
		        autoPlaceholder: false,
//		        allowExtensions : true,
		        defaultCountry: vPContry,
//		        preferredCountries : [vPContry],
//		        geoIpLookup: function(callback) {    },
				utilsScript: "/sap/bc/ui5_ui5/sap/ZUI5_HR_HCOMMON/plugin/InitTel/utils.js"
			});
			
			var vTelno = vUpdateValue;
			oTelControl.intlTelInput("setNumber", vTelno);
			if(vTelno == "") {
				oTelControl.intlTelInput("selectCountry", vPContry);
			}				
		}
	},
	
	setCountTabBar : function(oController, vTab) {
		var oControl = null;
		var vCount = 0;
		
		if(vTab == "") {
			for(var i=0; i<oController._vActiveTabNames.length; i++) {
				oControl = sap.ui.getCore().byId(oController.PAGEID + "_TABFILTER_Sub" + oController._vActiveTabNames[i]);
				eval("vCount = oController._vCntSub" + oController._vActiveTabNames[i]);
				oControl.setCount(vCount);
			}
		} else {
			oControl = sap.ui.getCore().byId(oController.PAGEID + "_TABFILTER_" + vTab);
			eval("vCount = oController._vCnt" + vTab);
			if(oControl) oControl.setCount(vCount);
		}
		
		oController._vModifyContent = false;
	},
	
	changeModifyContent : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActConPInfo");
		var oController = oView.getController();
		
		oController._vModifyContent = true;
	},
	
	changeModifyDate : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActConPInfo");
		var oController = oView.getController();
		oController._vModifyContent = true;
		var oControl = oEvent.getSource();
		
		if(oEvent.getParameter("valid") == false) {
			sap.m.MessageBox.alert("잘못된 일자형식 입니다.",{
				onClose : function() {
					oControl.setValue("");
				}
			});
		}
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

	navToBack : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActConPInfo");
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
		
		if(oController._JobPage == "Sub01") {
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
				
				sap.m.MessageBox.show("데이타 변경사항이 있습니다. \n먼저 저장하시겠습니까?", {
			          icon: sap.m.MessageBox.Icon.QUESTION,
			          title: "안내",
			          actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			          onClose: saveFunction
			    });
				
//				sap.m.MessageBox.confirm("데이타 변경사항이 있습니다. \n먼저 저장하시겠습니까?", {
//					title : "안내",
//					onClose : saveFunction
//				});
			} else {
				backFunction();
			}
		} else {
			backFunction();
		}
	},
	
//  저장버튼 클릭시....	
	onPressSave : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActConPInfo");
		var oController = oView.getController();
		
		eval("oController.save" + oController._JobPage + "()");
	},
	
/////////////////////////////////////////////////////////////////////////////////////////////
// Sub01 인적사항을 위한 Functions
/////////////////////////////////////////////////////////////////////////////////////////////
//  인적사항 화면 Setting.
	setSub01 : function() {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActConPInfo");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
		var oNameLayout = sap.ui.getCore().byId(oController.PAGEID + "_NameLayout");
		var oNameLayoutText = sap.ui.getCore().byId(oController.PAGEID + "_NameLayoutText");
		oNameLayoutText.setText("");
		oNameLayout.setVisible(false);
		
		var oSub01 = sap.ui.getCore().byId(oController.PAGEID + "_TABFILTER_Sub01");
		oSub01.destroyContent();
		
		oController._vHiringPersonalInfomationLayout = oController.getHiringPersonalInfomationLayout(oController);
		
		common.Common.loadCodeData(oController._vPersa, oController._vActda, oController.getEmpCodeField(oController));
		
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
		
		var vChangeData = null;
		
		if(oController._vVoltId != "") {
			oModel.read("/RecruitingSubjectsSet(Docno='" + oController._vDocno + "',"
					  + "VoltId='" +  oController._vVoltId + "')",
				null,
				null,
				false, 	
				function(oData, oResponse) {	
					if(oData) {
						vChangeData = oData;
						
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
		
		var oTempLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_Sub01_LAYOUT",  {
			width : "100%",
			content : []
		}).addStyleClass("L2PPadding05remLR");
		
		var oCell = null, oRow = null; 
		
		for(var g=0; g<vGroupInfo.length; g++) {
//			var oPanel = new sap.m.Panel({
//				expandable : false,
//				expanded : false,
//				headerToolbar : new sap.m.Toolbar({
//					design : sap.m.ToolbarDesign.Auto,
//					content : [new sap.m.Label({text : vGroupInfo[g].Itgrptx, design : "Bold"}).addStyleClass("L2P13Font")]
//				}).addStyleClass("L2PToolbarNoBottomLine")
//			});
			
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
			
//			oPanel.addContent(oControlMatrix);
		
			oTempLayout.addContent(oToolbar);		
			oTempLayout.addContent(oControlMatrix);			
		}
		oSub01.addContent(oTempLayout);	
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
		    	sap.m.MessageBox.alert("잘못된 전화번호 입니다.", {});
		    	vVal = "WrongNum";
		    }
		} else {
			vVal = "";
		}
		
		return vVal;
	},
	
//  인적사항을 저장 한다.	
	saveSub01 : function(fVal) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActConPInfo");
		var oController = oView.getController();
		
		var vOneData = {
				Docno : oController._vDocno,
				Recno : oController._vRecno,
				VoltId : oController._vVoltId,
				Persa : oController._vPersa,
				Reqno : oController._vReqno,
				Actda : oController._vActda == "" || oController._vActda == "0NaN-NaN-NaN" ? null : "\/Date(" + common.Common.getTime(oController._vActda) + ")\/"
		};
		var vErrorList = { ErrInfo : [] }, vAddressNoDel = "", vEmgAddressNoDel = "";
		
		
		for(var i=0; i<oController._vHiringPersonalInfomationLayout.length; i++) {
			var Fieldname = oController._vHiringPersonalInfomationLayout[i].Fieldname;
			var Fieldtype = oController._vHiringPersonalInfomationLayout[i].Incat;
			var FieldItgrp = oController._vHiringPersonalInfomationLayout[i].Itgrp;
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
					var vMsg = "&Cntl 를(을) 선택해 주시기 바랍니다.";							
					vMsg = vMsg.replace("&Cntl", vLabel);
					vErrorList.ErrInfo.push({ErrControl : oControl, ErrField : Fieldname, ErrMsg : vMsg , ErrItgrp : FieldItgrp , ErrType : Fieldtype});
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
					var vMsg = "&Cntl 를(을) 선택해 주시기 바랍니다.";							
					vMsg = vMsg.replace("&Cntl", vLabel);
					vErrorList.ErrInfo.push({ErrControl : oControl, ErrField : Fieldname, ErrMsg : vMsg , ErrItgrp : FieldItgrp , ErrType : Fieldtype});
				} else {
					oControl.setValueState(sap.ui.core.ValueState.None);
					eval("vOneData." + Fieldname + " = vValue; ");
					eval("vOneData." + TextFieldname + " = vValueText; ");
				}
			} else if(Fieldtype == "M3") {
				vValue = oControl.getValue();				
				if(vValue == "") {
					var vMsg = "&Cntl 를(을) 입력해 주시기 바랍니다.";							
					vMsg = vMsg.replace("&Cntl", vLabel);
					vErrorList.ErrInfo.push({ErrControl : oControl, ErrField : Fieldname, ErrMsg : vMsg , ErrItgrp : FieldItgrp , ErrType : Fieldtype});
				} else {
					if(Fieldname == "Idnum" && oController._vMolga == "08") {
						vValue = vValue.toUpperCase();
					}
					oControl.setValueState(sap.ui.core.ValueState.None);
					eval("vOneData." + Fieldname + " = vValue; ");
				}
			} else if(Fieldtype == "M4") {
				vValue = oControl.getValue();					
				if(vValue == "") {
					var vMsg = "&Cntl 를(을) 입력해 주시기 바랍니다.";							
					vMsg = vMsg.replace("&Cntl", vLabel);
					vErrorList.ErrInfo.push({ErrControl : oControl, ErrField : Fieldname, ErrMsg : vMsg , ErrItgrp : FieldItgrp , ErrType : Fieldtype});
				} else {
					oControl.setValueState(sap.ui.core.ValueState.None);
					eval("vOneData." + Fieldname + " = vValue == '' || vValue == '0NaN-NaN-NaN' ? null : '\/Date(' + common.Common.getTime(vValue) + ')\/'; ");
				}
			} else if(Fieldtype == "M6") {
				if(oControl.getSelected() == false) {
					var vMsg = "&Cntl 를(을) 선택해 주시기 바랍니다.";							
					vMsg = vMsg.replace("&Cntl", vLabel);
					vErrorList.ErrInfo.push({ErrControl : oControl, ErrField : Fieldname, ErrMsg : vMsg , ErrItgrp : FieldItgrp , ErrType : Fieldtype});
				} else {
					oControl.setValueState(sap.ui.core.ValueState.None);
					eval("vOneData." + Fieldname + " = 'X';");
				}
			} else if(Fieldtype == "M7") {	
				vValue = oController.getTelNum(oControl.getId());
				
				if(vValue == "WrongNum") return false;
				if( vValue == "") {
					var vMsg = "&Cntl 를(을) 입력해 주시기 바랍니다.";
					vMsg = vMsg.replace("&Cntl", vLabel);
					vErrorList.ErrInfo.push({ErrControl : oControl, ErrField : Fieldname, ErrMsg : vMsg , ErrItgrp : FieldItgrp , ErrType : Fieldtype});
				} else {
					oControl.setValueState(sap.ui.core.ValueState.None);	
					eval("vOneData." + Fieldname + " = vValue; ");
				}
			} else if(Fieldtype == "M8") {
				if(oControl.getSelectedIndex() == -1) {
					var vMsg = "&Cntl 를(을) 선택해 주시기 바랍니다.";							
					vMsg = vMsg.replace("&Cntl", vLabel);
					vErrorList.ErrInfo.push({ErrControl : oControl, ErrField : Fieldname, ErrMsg : vMsg , ErrItgrp : FieldItgrp , ErrType : Fieldtype});
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
				if(vValue != "") {
					if(Fieldname == "Idnum" && oController._vMolga == "08") {
						vValue = vValue.toUpperCase();
					}
					eval("vOneData." + Fieldname + " = vValue; ");
				}
//				if(Fieldname == "Anzkd" && vValue == "") {
//					vValue = "0";
//				}
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
			}
			// 긴급주소 or 주소는 Contry 필드 외에 다른 필드가 입력시에만 저장 및 Err체크
			if(FieldItgrp == "ADRP"){
				if(Fieldname.toUpperCase() != "LAND1"){
					if(vValue != "" && vValue != null){
						vAddressNoDel = "X";
					}
				}
			}else if(FieldItgrp == "ADRE"){
				if(Fieldname.toUpperCase() != "EMECLAND1"){
					if(vValue != "" && vValue != null){
						vEmgAddressNoDel = "X";
					}
				}
			}
			
		}
		// 긴급주소 or 주소 Error 체크
		var vErryn = "";
		if(vErrorList.ErrInfo.length > 0){
			for(var i=0; i < vErrorList.ErrInfo.length ; i ++){
				if(vErrorList.ErrInfo[i].ErrItgrp == "ADRP"){
					if(vAddressNoDel == "X"){
						vErryn = "X";
					}
				}else if(vErrorList.ErrInfo[i].ErrItgrp == "ADRE"){
					if(vEmgAddressNoDel == "X"){
						vErryn = "X";
					}
				}else{
					vErryn = "X";
				}
				
				if(vErryn == "X"){
					if((vErrorList.ErrInfo[i].ErrType.substring(0,1) == "M")){
						if(vErrorList.ErrInfo[i].ErrType.substring(1,2) == "1"){
							vErrorList.ErrInfo[i].ErrControl.addStyleClass("L2PSelectInvalidBorder");
						}else if(vErrorList.ErrInfo[i].ErrType.substring(1,2) == "8"){
							
						}else{
							vErrorList.ErrInfo[i].ErrControl.setValueState(sap.ui.core.ValueState.Error);
						}
					}
					sap.m.MessageBox.alert(vErrorList.ErrInfo[i].ErrMsg);
					return false;
				}
			}
		}
		
		// 자녀 수 특수문자 체크
		if(oController.checkNum("Anzkd" , vOneData.Anzkd, oController) == false) {
			return;
		}
		
		var process_result = false;
		var oPath = "/RecruitingSubjectsSet";
		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
		
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
				sap.m.MessageBox.alert("저장하였습니다.", {
					title: "안내",
					onClose : function() {
						oController.setSub01();
					}
				});
			}
			return true;
		} else {
			return false;
		}
	},
//	saveSub01 : function(fVal) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActConPInfo");
//		var oController = oView.getController();
//		
//		var vOneData = {
//				Docno : oController._vDocno,
//				Recno : oController._vRecno,
//				VoltId : oController._vVoltId,
//				Persa : oController._vPersa,
//				Reqno : oController._vReqno,
//				Actda : oController._vActda == "" || oController._vActda == "0NaN-NaN-NaN" ? null : "\/Date(" + common.Common.getTime(oController._vActda) + ")\/"
//		};
//		
//		for(var i=0; i<oController._vHiringPersonalInfomationLayout.length; i++) {
//			var Fieldname = oController._vHiringPersonalInfomationLayout[i].Fieldname;
//			var Fieldtype = oController._vHiringPersonalInfomationLayout[i].Incat;
//			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
//			var TextFieldname = Fieldname + "tx";
//			var vLabel = oController._vHiringPersonalInfomationLayout[i].Label;
//			
//			var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_" + Fieldname);
//			if(typeof oControl != "object") {
//				continue;
//			}
//			
//			var vValue = "";
//			
//			if(Fieldtype == "M1") {				
//				vValue = oControl.getSelectedKey();					
//				if(vValue == "" || vValue == "0000") {
//					oControl.addStyleClass("L2PSelectInvalidBorder");
//					var vMsg = "&Cntl 를(을) 선택해 주시기 바랍니다.";							
//					vMsg = vMsg.replace("&Cntl", vLabel);
//					sap.m.MessageBox.alert(vMsg);
//					return false;
//				} else {
//					oControl.removeStyleClass("L2PSelectInvalidBorder");
//					eval("vOneData." + Fieldname + " = vValue; ");
//				}
//			} else if(Fieldtype == "M2" || Fieldtype == "M5") {
//				var oCustomData = oControl.getCustomData();
//				if(oCustomData && oCustomData.length) {
//					for(var c=0; c<oCustomData.length; c++) {
//						if(oCustomData[c].getKey() == Fieldname) {
//							vValue = oCustomData[c].getValue();
//						}
//					}
//				}
//				var vValueText = oControl.getValue();
//				
//				if(vValue == "" || vValue == "0000") {
//					oControl.setValueState(sap.ui.core.ValueState.Error);
//					var vMsg = "&Cntl 를(을) 선택해 주시기 바랍니다.";							
//					vMsg = vMsg.replace("&Cntl", vLabel);
//					sap.m.MessageBox.alert(vMsg);
//					return false;
//				} else {
//					oControl.setValueState(sap.ui.core.ValueState.None);
//					eval("vOneData." + Fieldname + " = vValue; ");
//					eval("vOneData." + TextFieldname + " = vValueText; ");
//				}
//			} else if(Fieldtype == "M3") {
//				vValue = oControl.getValue();				
//				if(vValue == "") {
//					oControl.setValueState(sap.ui.core.ValueState.Error);
//					var vMsg = "&Cntl 를(을) 입력해 주시기 바랍니다.";							
//					vMsg = vMsg.replace("&Cntl", vLabel);
//					sap.m.MessageBox.alert(vMsg);
//					return false;
//				} else {
//					if(Fieldname == "Idnum" && oController._vMolga == "08") {
//						vValue = vValue.toUpperCase();
//					}
//					oControl.setValueState(sap.ui.core.ValueState.None);
//					eval("vOneData." + Fieldname + " = vValue; ");
//				}
//			} else if(Fieldtype == "M4") {
//				vValue = oControl.getValue();					
//				if(vValue == "") {
//					oControl.setValueState(sap.ui.core.ValueState.Error);
//					var vMsg = "&Cntl 를(을) 입력해 주시기 바랍니다.";							
//					vMsg = vMsg.replace("&Cntl", vLabel);
//					sap.m.MessageBox.alert(vMsg);
//					return false;
//				} else {
//					oControl.setValueState(sap.ui.core.ValueState.None);
//					eval("vOneData." + Fieldname + " = vValue == '' || vValue == '0NaN-NaN-NaN' ? null : '\/Date(' + common.Common.getTime(vValue) + ')\/'; ");
//				}
//			} else if(Fieldtype == "M6") {
//				if(oControl.getSelected() == false) {
//					oControl.setValueState(sap.ui.core.ValueState.Error);
//					var vMsg = "&Cntl 를(을) 선택해 주시기 바랍니다.";							
//					vMsg = vMsg.replace("&Cntl", vLabel);
//					sap.m.MessageBox.alert(vMsg);
//					return false;
//				} else {
//					oControl.setValueState(sap.ui.core.ValueState.None);
//					eval("vOneData." + Fieldname + " = 'X';");
//				}
//			} else if(Fieldtype == "M7") {	
//				vValue = oController.getTelNum(oControl.getId());
//				
//				if(vValue == "WrongNum") return false;
//				if( vValue == "") {
//					oControl.setValueState(sap.ui.core.ValueState.Error);
//					var vMsg = "&Cntl 를(을) 입력해 주시기 바랍니다.";
//					vMsg = vMsg.replace("&Cntl", vLabel);
//					sap.m.MessageBox.alert(vMsg);
//					return false;
//				} else {
//					oControl.setValueState(sap.ui.core.ValueState.None);	
//					eval("vOneData." + Fieldname + " = vValue; ");
//				}
//			} else if(Fieldtype == "M8") {
//				if(oControl.getSelectedIndex() == -1) {
//					var vMsg = "&Cntl 를(을) 선택해 주시기 바랍니다.";							
//					vMsg = vMsg.replace("&Cntl", vLabel);
//					sap.m.MessageBox.alert(vMsg);
//					return false;
//				} else {
//					var oRadio = oControl.getSelectedButton();
//					if(oRadio) {
//						vValue = oRadio.getCustomData()[0].getValue();
//						eval("vOneData." + Fieldname + " = vValue;");
//					}
//				}
//			} else if(Fieldtype == "O1") {			
//				vValue = oControl.getSelectedKey();		
//				if(vValue == "0000") vValue = "";
//				eval("vOneData." + Fieldname + " = vValue; ");
//			} else if(Fieldtype == "O2" || Fieldtype == "O5") {
//				var oCustomData = oControl.getCustomData();
//				if(oCustomData && oCustomData.length) {
//					for(var c=0; c<oCustomData.length; c++) {
//						if(oCustomData[c].getKey() == Fieldname) {
//							vValue = oCustomData[c].getValue();
//						}
//					}
//				}
//				var vValueText = oControl.getValue();
//				
//				eval("vOneData." + Fieldname + " = vValue; ");
//				eval("vOneData." + TextFieldname + " = vValueText; ");
//			} else if(Fieldtype == "O3") {
//				vValue = oControl.getValue();	
//				if(vValue != "") {
//					if(Fieldname == "Idnum" && oController._vMolga == "08") {
//						vValue = vValue.toUpperCase();
//					}
//					eval("vOneData." + Fieldname + " = vValue; ");
//				}
////				if(Fieldname == "Anzkd" && vValue == "") {
////					vValue = "0";
////				}
//			} else if(Fieldtype == "O4") {
//				vValue = oControl.getValue();
//				eval("vOneData." + Fieldname + " = vValue == '' || vValue == '0NaN-NaN-NaN' ? null : '\/Date(' + common.Common.getTime(vValue) + ')\/'; ");
//			} else if(Fieldtype == "O6") {
//				if(oControl.getSelected() == true) {
//					eval("vOneData." + Fieldname + " = 'X';");
//				} else {
//					eval("vOneData." + Fieldname + " = '';");
//				}
//			} else if(Fieldtype == "O7") {
//				vValue = oController.getTelNum(oControl.getId());
//				if(vValue == "WrongNum") return false;
//				oControl.setValueState(sap.ui.core.ValueState.None);	
//				eval("vOneData." + Fieldname + " = vValue; ");
//			} else if(Fieldtype == "O8") {
//				var oRadio = oControl.getSelectedButton();
//				if(oRadio) {
//					vValue = oRadio.getCustomData()[0].getValue();
//					eval("vOneData." + Fieldname + " = vValue;");
//				}
//			}
//		}
//		
//		var process_result = false;
//		var oPath = "/RecruitingSubjectsSet";
//		var oModel = sap.ui.getCore().getModel("ZL2P01GW0001_SRV");
//		
//		switch(oController._vActionType) {
//			case "C" :
//				oModel.create(
//						oPath,
//						vOneData,
//						null,
//					    function (oData, response) {
//							if(oData) {
//								oController._vVoltId = oData.VoltId;
//							}
//							process_result = true;
//							oController._vActionType = "M";
//					    },
//					    function (oError) {
//					    	var Err = {};
//							if (oError.response) {
//								Err = window.JSON.parse(oError.response.body);
//								if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
//									common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
//								} else {
//									common.Common.showErrorMessage(Err.error.message.value);
//								}
//								
//							} else {
//								common.Common.showErrorMessage(oError);
//							}
//							process_result = false;
//					    }
//			    );
//				break;
//			case "M" :
//				oPath += "(Docno='" + vOneData.Docno + "',"
//		                + "VoltId='" +  vOneData.VoltId + "')",
//				oModel.update(
//						oPath,
//						vOneData,
//						null,
//					    function (oData, response) {
//							process_result = true;
//					    },
//					    function (oError) {
//					    	var Err = {};					    	
//							if (oError.response) {
//								Err = window.JSON.parse(oError.response.body);
//								if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
//									common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
//								} else {
//									common.Common.showErrorMessage(Err.error.message.value);
//								}
//								
//							} else {
//								common.Common.showErrorMessage(oError);
//							}
//							process_result = false;
//					    }
//			    );
//		}
//		if(process_result) {
//			if(fVal != "BACK") {
//				sap.m.MessageBox.alert("저장하였습니다.", {
//					title: "안내",
//					onClose : function() {
//						oController.setSub01();
//					}
//				});
//			}
//			return true;
//		} else {
//			return false;
//		}
//	},
	
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
	
	getEmpCodeField : function(oController) {
		var vExceptionFields = ["State","Emecstate","Sexorient","Titl2","Titel","Gbdep"];
		var vEmpCodeListFields = [];
		
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
		
		return vEmpCodeListFields;
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActConPInfo");
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
		
		if(select) vCodeModel.EmpCodeListSet.push({Field : Fieldname, Ecode : "0000", Etext : "-- 선택 --"});
		
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
		
		if(select) vCodeModel.DomainCodeListSet.push({Field : Fieldname, DomvalueL : "0000", Ddtext : "-- 선택 --"});
		
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
	
	displayCodeSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActConPInfo");
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
			vTitle = "검색";
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
		}else{
			var vAddFilter = [{key : "Persa", value : oController._vPersa},
			                  {key : "Actda", value : oController._vActda}];
			
			mEmpCodeList = oController.setSpecialCodeData(Fieldname, vAddFilter, false);
		}
		
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
		oDialog.setTitle(vTitle);
	},
	
	onLiveChange : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActConPInfo");
		var oController = oView.getController();
		
		oController._vModifyContent = true;
		
		var s = oEvent.getParameter("value");
		if(s == "") {
			oEvent.getSource().removeAllCustomData();
		}
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
	
	makeControl : function(oController, Fieldtype, Fieldname, vMaxLength, vLabelText, vUpdateValue, vUpdateTextValue, vChangeData, vDefaultValues) {
		var oControl = null;
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		
		if(Fieldtype == "M1" || Fieldtype == "O1") {
			oControl = new sap.m.Select(oController.PAGEID + "_" + oController._JobPage + "_" + Fieldname, {
	        	   width : "95%",
	        }).addStyleClass("L2P13Font");
			
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
				mDataModel = oController.setSpecialCodeData(Fieldname, vAddFilter, true);
				mDataModel.setSizeLimit(1000);
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
			} else if(Fieldname.toLowerCase() == "emecstate") {
				var vExcod = "";
				if(vChangeData) vExcod = vChangeData.Emecland1;
				else vExcod = oController.getDefaultValue(vDefaultValues, "Emecland1");
				vAddFilter.push({key : "Excod", value : vExcod});
				mDataModel = oController.setSpecialCodeData("State", vAddFilter, true);
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
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
			} else if(Fieldname == "Titl2") {
				vAddFilter.push({key : "Excod", value : "S"});				
				mDataModel = oController.setSpecialCodeData("Titel", vAddFilter, true);
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
			} else if(Fieldname == "Titel") {
				vAddFilter.push({key : "Excod", value : "T"});				
				mDataModel = oController.setSpecialCodeData("Titel", vAddFilter, true);
				
				oControl.setModel(mDataModel);
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}));
			} else {
				oControl.setModel(sap.ui.getCore().getModel("EmpCodeList"));
				oControl.bindItems("/EmpCodeListSet", new sap.ui.core.Item({key : "{Ecode}", text : "{Etext}"}), null, [new sap.ui.model.Filter("Field", "EQ", Fieldname)]);
				if(Fieldname.toLowerCase() == "anred"){
					oControl.attachChange(oController.onChangeAnred);
				}
			}
						
			oControl.setSelectedKey(vUpdateValue);			
		} else if(Fieldtype == "M2" || Fieldtype == "O2") {
			if(Fieldname == "Orgeh") {
				oControl = new sap.m.Input(oController.PAGEID + "_" + oController._JobPage + "_" + Fieldname, {
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
				oControl = new sap.m.Input(oController.PAGEID + "_" + oController._JobPage + "_" + Fieldname, {
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
				oControl = new sap.m.Input(oController.PAGEID + "_" + oController._JobPage + "_" + Fieldname, {
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
				oControl = new sap.m.Input(oController.PAGEID + "_" + oController._JobPage + "_" + Fieldname, {
		        	   width : "95%",
		        	   liveChange : oController.onLiveChange,
		        	   change : oController.changeFirstName,
		        	   maxLength : vMaxLength
		        }).addStyleClass("L2P13Font");
			} else if(Fieldname == "Anzkd") {
				oControl = new sap.m.Input(oController.PAGEID + "_" + oController._JobPage + "_" + Fieldname, {
					   type : "Number",
		        	   width : "95%",
		        	   liveChange : oController.onLiveChange,
		        	   maxLength : vMaxLength
		        }).addStyleClass("L2P13Font");
				oControl.setValue(vUpdateValue);
			} else {
				oControl = new sap.m.Input(oController.PAGEID + "_" + oController._JobPage + "_" + Fieldname, {
		        	   width : "95%",
		        	   liveChange : oController.onLiveChange,
		        	   maxLength : vMaxLength
		        }).addStyleClass("L2P13Font");
			}
			
			oControl.setValue(vUpdateValue);
		} else if(Fieldtype == "M4" || Fieldtype == "O4") {
			oControl = new sap.m.DatePicker(oController.PAGEID + "_" + oController._JobPage + "_" + Fieldname, {
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
				oControl = new sap.m.Input(oController.PAGEID + "_" + oController._JobPage + "_" + Fieldname, {
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
			} else {
				oControl = new sap.m.Input(oController.PAGEID + "_" + oController._JobPage + "_" + Fieldname, {
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
			oControl = new sap.m.CheckBox(oController.PAGEID + "_" + oController._JobPage + "_" + Fieldname, {
	        	   select : oController.onLiveChange
	        }).addStyleClass("L2P13Font");
			if(vUpdateValue == "X") oControl.setSelected(true);
			if(vUpdateTextValue == "X") oControl.setSelected(true);
			else  oControl.setSelected(false);
		} else if(Fieldtype == "M7" || Fieldtype == "O7") {
			oControl = new sap.m.Input(oController.PAGEID + "_" + oController._JobPage + "_" + Fieldname, {
	        	   width : "95%",
	        	   change : oController.changeModifyContent,
	        	   maxLength : vMaxLength
	        }).addStyleClass("L2P13Font");
			oControl.addEventDelegate({
				onAfterRendering:function(){	
					oController.setTelInit(oController, oController._JobPage + "_" + Fieldname, vUpdateValue);
				}
			});
		} else if(Fieldtype == "M8" || Fieldtype == "O8") {
			var mDomainModel = oController.getDomainValueData(Fieldname, [{key : "DomvalueL", value : oController._vMolga}], false);
			var vDomainValueList = mDomainModel.getProperty("/DomainCodeListSet");
			
			oControl = new sap.m.RadioButtonGroup(oController.PAGEID + "_" + oController._JobPage + "_" + Fieldname, {
				width : "95%"
			});			
			
			var vSelIdx = 0;
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
		}
		
		if(oControl) {
			oControl.setEnabled(!oController._DISABLED);
			oControl.setTooltip(vLabelText);
		}
		
		return oControl;
	},
	
	_ODialogSearchNatioEvent : null,
	_ONatioControl : null,
	
	onDisplaySearchNatioDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActConPInfo");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActConPInfo");
		var oController = oView.getController();
		
		var aContexts = oEvent.getParameter("selectedContexts");
		
	    var oCustomData = oController._ONatioControl.getCustomData();
		var Fieldname = oCustomData[0].getKey();
		
		if (aContexts.length) {
			var vNatio = aContexts[0].getProperty("Ecode");
	    	var vNatiotx = aContexts[0].getProperty("Etext");
	    	if(vNatio == "") vNatiotx = "";
	    	oController._ONatioControl.removeAllCustomData();
	    	oController._ONatioControl.setValue(vNatiotx);
	    	oController._ONatioControl.addCustomData(new sap.ui.core.CustomData({key : Fieldname, value : vNatio}));
	    	
	    	oController._vModifyContent = true;
	    	
	    	if(Fieldname == "Land1") {
	    		oController.setDDLBState("", "", "Land1", "State");
			} else if(Fieldname == "Emecland1") {
				oController.setDDLBState("", "", "Emecland1", "Emecstate");
			} else if( Fieldname == "Gblnd") {
//	    		oController.setDDLBState("", oController._vMolga, "Gblnd", "Gbdep");
				oController.setDDLBState("", "", "Gblnd", "Gbdep");
			} 
	    }
		
		oController.onCancelNatio(oEvent);
	},
		
	onCancelNatio : function(oEvent) {
		var oBinding = oEvent.getSource().getBinding("items");
	    oBinding.filter([]);
	},
	
	setDDLBState : function(vSelectedKey, Molga, Land, State) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActConPInfo");
		var oController = oView.getController();
		
		var oState = null;
		var oLand1 = null;
		if(Molga && Molga != "") {
			oState = sap.ui.getCore().byId(oController.PAGEID + "_" + oController._JobPage + "_" + Molga + "_" + State);
			oLand1 = sap.ui.getCore().byId(oController.PAGEID + "_" + oController._JobPage + "_" + Molga + "_" + Land);
		} else {
			oState = sap.ui.getCore().byId(oController.PAGEID + "_" + oController._JobPage + "_" + State);
			oLand1 = sap.ui.getCore().byId(oController.PAGEID + "_" + oController._JobPage + "_" + Land);
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
					text : "-- 선택 --"
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
	
	onChangeAnred : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActConPInfo");
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
	
	changeFirstName : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actapp2.ActConPInfo");
		var oController = oView.getController();
		
		if(oController._vMolga == "08" || oController._vMolga == "AE" ){
			var oRufnm = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_Rufnm");
			if(oRufnm && oRufnm.getValue() == "") {
				oRufnm.setValue(oEvent.getParameter("value"));
			}
		}
	},
	
	// 특수 문자 체크
	checkNum : function(vFieldname, vData, oController){
		var re = /[~!@\#$%^&*\()\-=+_']/gi;
		if(typeof vData != "undefined" && vData != null && vData != ""){
	        if(re.test(vData))
	        {
	        	sap.m.MessageBox.alert("Specify positive values only");
	        	var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Sub01_"+vFieldname);
	        	oControl.setValueState(sap.ui.core.ValueState.Error);
	        	return false;
	        }
		}
        return true;
	},
});