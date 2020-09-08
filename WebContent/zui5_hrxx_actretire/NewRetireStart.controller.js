jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.SearchCode");

sap.ui.controller("zui5_hrxx_actretire.NewRetireStart", {
	
	PAGEID : "NewRetireStart",
	
	_vPersa : "",
	_vAppno : "",
	_vRetst : "",
	_vActda : "",
	
	_vFromPageId : "",
	
	_oCommentControl : null,
	_oUserControl : null,
	
	_AddPersonDialog : null,
	_SerachOrgDialog : null,
	_CommentDialog : null,
	
	BusyDialog : null,
	
	//사원검색결과 리스트 Object (DHtmlx 사용을 위해 추가)
	oPersonGrid : null,

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actretire.NewRetireStart
*/
	/*
	 * View에 Compact Style를 적용한다.
	 * View Open전에 수행할 Method를 선언한다. 
	 */
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			this.getView().addStyleClass("sapUiSizeCompact");
		};
	
	    this.getView().addEventDelegate({
			onBeforeShow  : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this),
		});
	},
	
	/*
	 * 신규 퇴직프로세스를 생성하기 위한 Control에 대한 초기화 작업을 한다.
	 * 또한, 퇴직사유 리스트를 가져온다.
	 */
	onBeforeShow: function(oEvent) {		
		this._vPersa = oEvent.data.Persa;
		this._vRetst = oEvent.data.Retst;
		this._vFromPageId = oEvent.data.FromPageId;
		
		this._vAppno = "";
		
//		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		this._vActda = dateFormat.format(curDate);
		
		var oPernr = sap.ui.getCore().byId(this.PAGEID + "_Pernr");
		var oCalPsg = sap.ui.getCore().byId(this.PAGEID + "_CalPsg");
		var oPersg_Persk = sap.ui.getCore().byId(this.PAGEID + "_Persg_Persk");
		var oStext = sap.ui.getCore().byId(this.PAGEID + "_Stext");
		var oEntda = sap.ui.getCore().byId(this.PAGEID + "_Entda");
		var oRetda = sap.ui.getCore().byId(this.PAGEID + "_Retda");
		
		var oMassg = sap.ui.getCore().byId(this.PAGEID + "_Massg");
		var oReexp = sap.ui.getCore().byId(this.PAGEID + "_Reexp");
		var oStpnr = sap.ui.getCore().byId(this.PAGEID + "_Stpnr");
		var oSeexp = sap.ui.getCore().byId(this.PAGEID + "_Seexp");
		
//		if(oMassg) {
//			oMassg.destroyItems();
//			oMassg.addItem(new sap.ui.core.Item({key : "0000", text : oBundleText.getText("SELECTDATA")}));
//			oModel.read("/RetirementReasonSet/?$filter=Persa%20eq%20%27" + this._vPersa + "%27", 
//					null, 
//					null, 
//					false,
//					function(oData, oResponse) {					
//						if(oData && oData.results.length) {
//							for(var i=0; i<oData.results.length; i++) {
//								oMassg.addItem(new sap.ui.core.Item({key : oData.results[i].Massg, text : oData.results[i].Mgtxt}));
//							}
//							
//						}
//					},
//					function(oResponse) {
//						common.Common.log(oResponse);
//					}
//			);
//		}
		oMassg.setValue("");
		oMassg.destroyCustomData();
		oMassg.addCustomData(new sap.ui.core.CustomData({
			key : "RETRS",
			value : ""
		}));
		oPernr.setValue("");
		oPernr.removeAllCustomData();
		oCalPsg.setText("");
		oPersg_Persk.setText("");
		oStext.setText("");
		oEntda.setText("");
		oRetda.setValue(dateFormat.format(curDate));
		
		oReexp.setSelected(false);
		oSeexp.setSelected(false);
		//중공업인 경우 비활성화 한다.
		if(gPersa == "0900") {
			oSeexp.setEnabled(false);
		}
		oStpnr.setValue("");
		oStpnr.removeAllCustomData();
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_actretire.NewRetireStart
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actretire.NewRetireStart
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actretire.NewRetireStart
*/
//	onExit: function() {
//
//	}
	
	/*
	 * 리스트 페이지로 이동한다.
	 */
	navToBack : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.NewRetireStart");
		var oController = oView.getController();
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : oController._vFromPageId,
		      data : {
		    	  
		      }
		});
	},
	
	/*
	 * 신규 퇴직프로세스를 생성한다.
	 * RetirementApplicationAdministrationSet를 Create한다.
	 */
	onPressRetireStart : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.NewRetireStart");
		var oController = oView.getController();
		
		var createData = oController.makeOData(oController);
		if(createData == null) return;
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		var oPath = "/RetirementApplicationAdministrationSet";
		
		var updateProcess = function() {
			var process_result = false;
			try {
				createData.Mailc = oController.makeEmailHtml(oController);
				oModel.create(
						oPath, 
						createData, 
						null,
					    function (oData, response) {
							process_result = true;
							common.Common.log("Sucess RetirementApplicationAdministrationSet Update !!!");
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
			} catch(ex) {
				process_result = false;
				common.Common.log(ex);
			}
			
			if(oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
			
			if(!process_result) return;
			
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SAVE"), {
				title: oBundleText.getText("INFORMATION"),
				onClose : function() {
					oController.navToBack();
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
				
				setTimeout(updateProcess, 300);	
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("MSG_RETIRE_START"), {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("TITLE_RETIRE_START"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: onProcessing
		});
	},
	
	/*
	 * 신규 퇴직프로세스를 생성시 필요한 OData를 생성한다.
	 */
	makeOData : function(oController) {
		var oData = {};
		
		var oPernr = sap.ui.getCore().byId(oController.PAGEID + "_Pernr");
		var oRetda = sap.ui.getCore().byId(oController.PAGEID + "_Retda");
		
		var oMassg = sap.ui.getCore().byId(oController.PAGEID + "_Massg");
		var oReexp = sap.ui.getCore().byId(oController.PAGEID + "_Reexp");
		var oStpnr = sap.ui.getCore().byId(oController.PAGEID + "_Stpnr");
		var oSeexp = sap.ui.getCore().byId(oController.PAGEID + "_Seexp");
		
		var vPernr = "";
		var vStpnr = "";
		
		if(oPernr.getValue() == "") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
			return null;
		}
		var vPernrCustomData = oPernr.getCustomData();
		if(vPernrCustomData && vPernrCustomData.length) {
			for(var i=0; i<vPernrCustomData.length; i++) {
				if(vPernrCustomData[i].getKey() == "Pernr") {
					vPernr = vPernrCustomData[i].getValue();
				}
			}
		}
		if(vPernr == "") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
			return null;
		}
		
		if(oRetda.getValue() == "") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_RETIRE_DATE"));
			return null;
		}
		
		var oCustomData = oMassg.getCustomData();
		var vMassg = ""; 
		if(oCustomData && oCustomData.length) {
			for(var c=0; c<oCustomData.length; c++) {
				if(oCustomData[c].getKey() == "Massg") {
					vMassg = oCustomData[c].getValue();
				}
			}
		}
		
		if(vMassg == "") {
			common.Common.showErrorMessage(oBundleText.getText("MSG_SELECT_RETIRE_REASON"));
			return null;
		}
		
		var vStpnrCustomData = oStpnr.getCustomData();
		if(vStpnrCustomData && vStpnrCustomData.length) {
			for(var i=0; i<vStpnrCustomData.length; i++) {
				if(vStpnrCustomData[i].getKey() == "Pernr") {
					vStpnr = vStpnrCustomData[i].getValue();
				}
			}
		}

		oData.Persa = oController._vPersa;
		oData.Pernr = vPernr;
		oData.Retda = "\/Date(" + common.Common.getTime(oRetda.getValue()) + ")\/";
		
		
		
		oData.Massg = vMassg; //oMassg.getSelectedKey();
		oData.Stpnr = vStpnr;
		if(oReexp.getSelected()) oData.Reexp = "X";
		else oData.Reexp = "";
		if(oSeexp.getSelected()) oData.Seexp = "X";
		else oData.Seexp = "";		
		
		return oData;
	},
	
	/*
	 * 퇴직 대상자를 선택하는 Dialog를 Open한다.
	 */
	displaySearchUserDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.NewRetireStart");
		var oController = oView.getController();
		
		common.SearchUser1.oController = oController;
		
		oController._oUserControl = oEvent.getSource();
		
		if(!oController._AddPersonDialog) {
			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
			oView.addDependent(oController._AddPersonDialog);
		}
		oController._AddPersonDialog.open();
	},
	
	/*
	 * 선택된 퇴직 대상자의 기본정보를 설정한다.
	 */
	onESSelectPerson : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.NewRetireStart");
		var oController = oView.getController();
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		//Dhtmlx의 Grid 컨트롤 변경에 따른 변경 내용 -ENd -
		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
		var vSelectedPersonCount = 0;
		
		var oCalPsg = sap.ui.getCore().byId(oController.PAGEID + "_CalPsg");
		var oPersg_Persk = sap.ui.getCore().byId(oController.PAGEID + "_Persg_Persk");
		var oStext = sap.ui.getCore().byId(oController.PAGEID + "_Stext");
		var oEntda = sap.ui.getCore().byId(oController.PAGEID + "_Entda");
		
		if(vEmpSearchResult && vEmpSearchResult.length) {
			for(var i=0; i<vEmpSearchResult.length; i++) {
				if(vEmpSearchResult[i].Chck == true) {
					vSelectedPersonCount++;
				}				
			}
			if(vSelectedPersonCount != 1) {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
				return;
			}
			
			for(var i=0; i<vEmpSearchResult.length; i++) {
				if(vEmpSearchResult[i].Chck == true) {
					if(oController._oUserControl) {
						oController._oUserControl.setValue(mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Ename"));
						oController._oUserControl.addCustomData(new sap.ui.core.CustomData({key : "Pernr", value : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pernr")}));
						oController._oUserControl.addCustomData(new sap.ui.core.CustomData({key : "Adid", value : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Adid")}));
						
						if(oController._oUserControl.getId() == (oController.PAGEID + "_Pernr")) {
							oCalPsg.setText(mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Zzcaltltx") + " / "
									+ mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Zzpsgrptx"));
							
							oPersg_Persk.setText(mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pgtxt") + " / "
									+ mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pktxt"));
							
							oStext.setText(mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Fulln"));
							
							oEntda.setText(dateFormat.format(new Date(common.Common.setTime(new Date(mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Entda"))))));
						}
					}
				}				
			}
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
			return;
		}
		
		common.SearchUser1.onClose();
	},
	
	/*
	 * 직원 검색시에 필요한 조직검색 Dialog를 Open한다.
	 */
	displayMultiOrgSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.NewRetireStart");
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
	
	/*
	 * 퇴직프로세스를 시작을 알리는 이메일을 생성한다.
	 */
	makeEmailHtml : function(oController) {
		
		var oPernr = sap.ui.getCore().byId(oController.PAGEID + "_Pernr");
		var oCalPsg = sap.ui.getCore().byId(oController.PAGEID + "_CalPsg");
		var oStext = sap.ui.getCore().byId(oController.PAGEID + "_Stext");
		var oRetda = sap.ui.getCore().byId(oController.PAGEID + "_Retda");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var info_tr_start = "[INFO_START]";
		var info_tr_end = "[INFO_END]";
		
		var html_url = "/sap/bc/ui5_ui5/sap/zhrxx_common/emailhtml/retire_strart_email.html";
		
		var tHtml = "";
		var request = $.ajax({ 
			  url: html_url,
			  cache: false,
			  async: false
		});
		
		request.done(function( html ) {
			tHtml = html;
		});
			 
		request.fail(function( jqXHR, textStatus ) {
			
		});
		
		if(tHtml == "") {
			console.log("Email HTML 파일이 없습니다.");
			return "";
		}
		
		var info_html = tHtml.substring(tHtml.indexOf(info_tr_start) + info_tr_start.length, tHtml.indexOf(info_tr_end));
		
		tHtml = tHtml.replace("[RETIRE_COMMENT]", oBundleText.getText("MSG_RETIRE_START_EMAIL_COMMENT"));
		tHtml = tHtml.replace("[RETIRE_PERSON_TITLE]", oBundleText.getText("PANEL_RETIRE_TARGET"));
		
		var vGotoUrl = "[LINKURL]"; //"http://hr.doosan.com/irj/servlet/prt/portal/prtroot/pcd!3aportal_content!2fDoosanGHRIS!2fiViews!2fESS!2fResignation_process?sap-config-mode=true";
		var vLink = "<a href='" + vGotoUrl + "' target='_new'>" + oBundleText.getText("GOTO_BTN") + "</a>";
		tHtml = tHtml.replace("[LINK]", vLink);
		
		var info_data = "";
		var tmp_info_html ="";
		
		var vAdid = "";
		var vPernrCustomData = oPernr.getCustomData();
		if(vPernrCustomData && vPernrCustomData.length) {
			for(var i=0; i<vPernrCustomData.length; i++) {
				if(vPernrCustomData[i].getKey() == "Adid") {
					vAdid = vPernrCustomData[i].getValue();
				}
			}
		}
		
		var add_info = "";
		if(vAdid != "") {
			add_info = " (" + vAdid + ")"; 
		}
		
		//성명
		tmp_info_html = info_html;
		tmp_info_html = tmp_info_html.replace("[INFO_LABEL]", oBundleText.getText("ENAME"));
		tmp_info_html = tmp_info_html.replace("[INFO_DATA]", oPernr.getValue() + add_info);
		info_data += tmp_info_html;
		
		//직위/직책
		tmp_info_html = info_html;
		tmp_info_html = tmp_info_html.replace("[INFO_LABEL]", oBundleText.getText("ZZCALPSG"));
		tmp_info_html = tmp_info_html.replace("[INFO_DATA]", oCalPsg.getText());
		info_data += tmp_info_html;
		
		//소속부서
		tmp_info_html = info_html;
		tmp_info_html = tmp_info_html.replace("[INFO_LABEL]", oBundleText.getText("STEXT"));
		tmp_info_html = tmp_info_html.replace("[INFO_DATA]", oStext.getText());
		info_data += tmp_info_html;
		
		//퇴직일
		tmp_info_html = info_html;
		tmp_info_html = tmp_info_html.replace("[INFO_LABEL]", oBundleText.getText("SCHE_RETDA"));
		tmp_info_html = tmp_info_html.replace("[INFO_DATA]", dateFormat.format(new Date(common.Common.setTime(new Date(oRetda.getValue())))));
		info_data += tmp_info_html;
		
		var info_replace = tHtml.substring(tHtml.indexOf(info_tr_start), tHtml.indexOf(info_tr_end) + info_tr_end.length);
		tHtml = tHtml.replace(info_replace, info_data);
	
		return tHtml;
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
	
	displayCodeSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.NewRetireStart");
		var oController = oView.getController();
		
		var mOneCodeModel =sap.ui.getCore().getModel("CodeListModel");
		mOneCodeModel.setData(null);
		var vOneCodeList = {EmpCodeListSet : []};
		
		var oCustomData = oEvent.getSource().getCustomData();
		var Fieldname = oCustomData[0].getKey();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		
		oModel.read("/RetirementReasonSet/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27", 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							var vOneData = {};
							vOneData.Ecode = oData.results[i].Massg;
							vOneData.Etext = oData.results[i].Mgtxt;
							vOneCodeList.EmpCodeListSet.push(vOneData);
						}
						
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
//		var mEmpCodeList = sap.ui.getCore().getModel("EmpCodeList");
//		var vEmpCodeList = mEmpCodeList.getProperty("/EmpCodeListSet");
//		if(vEmpCodeList && vEmpCodeList.length) {
//			for(var i=0; i<vEmpCodeList.length; i++) {
//				if(vEmpCodeList[i].Field == Fieldname && vEmpCodeList[i].Ecode != "0000") {
//					vOneCodeList.EmpCodeListSet.push(vEmpCodeList[i]);
//				}
//			}
//		}
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
	
	onLiveChange : function(oEvent) {
		var s = oEvent.getParameter("value");
		if(s == "") {
			oEvent.getSource().removeAllCustomData();
		}
	},

});