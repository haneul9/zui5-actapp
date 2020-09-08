jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
jQuery.sap.require("sap.ui.core.util.ExportType");

sap.ui.controller("zui5_hrxx_actretire.RetireRequestList", {
	
	PAGEID : "RetireRequestList",
	
	BusyDialog: null,

	_vDocty : "40",
	_SortDialog : null,
	_LegendDialog : null,
	_ActionDialog : null,

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actretire.RetireRequestList
*/
	/*
	 * View에 Compact Style를 적용한다.
	 * View Open후에 수행할 Method를 선언한다.
	 * 또한, 인사영역 리스트를 가져온다.
	 */
	onInit: function() {
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			this.getView().addStyleClass("sapUiSizeCompact");
		};
	
	    this.getView().addEventDelegate({
			onAfterShow  : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this),
		});
	    
	    var oPersaModel = sap.ui.getCore().getModel("PersAreaListSet");
		var vPersAreaListSet = oPersaModel.getProperty("/PersAreaListSet");
		var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
		
		try {
			for(var i=0; i<vPersAreaListSet.length; i++) {
				oPersa.addItem(
					new sap.ui.core.Item({
						key : vPersAreaListSet[i].Persa, 
						text : vPersAreaListSet[i].Pbtxt
					})
				);
			};
		} catch(ex) {
			common.Common.log(ex);
		}
	},
	
	/*
	 * 기본 검색 기능을 호출한다. (onPressSearch) 
	 */
	onAfterShow: function(evt) {
		this.onPressSearch();
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_actretire.RetireRequestList
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actretire.RetireRequestList
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actretire.RetireRequestList
*/
//	onExit: function() {
//
//	}
	
	/*
	 * 퇴직프로세스를 검색한다.
	 * 검색조건은 인사영역, 퇴직일자 이다.
	 */
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.RetireRequestList");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_Ename");
		
		var oRetda_From = sap.ui.getCore().byId(oController.PAGEID + "_Retda_From");
		var oRetda_To = sap.ui.getCore().byId(oController.PAGEID + "_Retda_To");
		
	    var filterString = "";
	    
	    filterString += "/?$filter="; 
	    filterString += "(Retda%20ge%20datetime%27" + oRetda_From.getValue() + "T00%3a00%3a00%27%20and%20Retda%20le%20datetime%27" + oRetda_To.getValue() + "T00%3a00%3a00%27)";
	    if(oPersa.getSelectedKey() != "" && oPersa.getSelectedKey() != "0000") {
	    	filterString += "%20and%20(Persa%20eq%20%27" + oPersa.getSelectedKey() + "%27)";
	    }	    
	    if(oEname.getValue() != "") {
	    	filterString += "%20and%20(Ename%20eq%20%27" + oEname.getValue() + "%27)";
	    }
				
		if(!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		}  else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
			
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		var mRetireRequestList = sap.ui.getCore().getModel("RetireRequestList");
		var vRetireRequestList = {RetirementApplicationAdministrationSet : []};
		
		var vAdmin = "";
		var oNewBtn = sap.ui.getCore().byId(oController.PAGEID + "_New_Btn");
		var oAgeBtn = sap.ui.getCore().byId(oController.PAGEID + "_Age_Btn");
		var oActBtn = sap.ui.getCore().byId(oController.PAGEID + "_Act_Btn");
		var oCancelBtn = sap.ui.getCore().byId(oController.PAGEID + "_Cancel_Btn");
		
		var readAfterProcess = function() {
		
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
			var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
			oTable.setModel(mRetireRequestList);
			oTable.bindItems("/RetirementApplicationAdministrationSet", oColumnList);
			
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			};
			
			if(vAdmin == "X") {
				oNewBtn.setVisible(false);
				oAgeBtn.setVisible(false);
				oActBtn.setVisible(false);
				oCancelBtn.setVisible(false);
			} else {
				oNewBtn.setVisible(true);
				oAgeBtn.setVisible(true);
				oActBtn.setVisible(true);
				oCancelBtn.setVisible(true);
			}
		};
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		oModel.read("/RetirementApplicationAdministrationSet" + filterString, 
					null, 
					null, 
					true,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								if(i == 0) vAdmin = oData.results[i].Admin;
								
								var oneData = oData.results[i];
								oneData.Numbr = (i+1);
								vRetireRequestList.RetirementApplicationAdministrationSet.push(oneData);
							}
							mRetireRequestList.setData(vRetireRequestList);
							
							readAfterProcess();
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
						if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
							oController.BusyDialog.close();
						};
					}
		);
	},
	
	/*
	 * 선택된 퇴직프로세스의 상세정보를 처리할 수 있는 Page(UpdateRetireRequest)로 이동한다.
	 */
	onSelectRow : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.RetireRequestList");
		var oController = oView.getController();
		
		var oContext = oEvent.getSource().getBindingContext();	
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		
		var mRetireRequestList = oTable.getModel();
		
		var vRetst = mRetireRequestList.getProperty(oContext + "/Retst");
		
    	sap.ui.getCore().getEventBus().publish("nav", "to", {
    	  id : "zui5_hrxx_actretire.UpdateRetireRequest",
	      data : {
	    	  context : oContext,
	    	  Retst : vRetst,
	    	  Appno : mRetireRequestList.getProperty(oContext + "/Appno"),
	    	  Persa : mRetireRequestList.getProperty(oContext + "/Persa"),
	    	  Pernr : mRetireRequestList.getProperty(oContext + "/Pernr"),
	    	  Admin : mRetireRequestList.getProperty(oContext + "/Admin"),
	    	  FromPageId : "zui5_hrxx_actretire.RetireRequestList"
	      }
		});			
		
	},	

	/*
	 * 리스트 내용에 대해 정렬 처리하는 Dialog를 Open한다.
	 */
	onPressSort : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.RetireRequestList");
		var oController = oView.getController();		
		
		if(!oController._SortDialog) {
			oController._SortDialog = sap.ui.jsfragment("zui5_hrxx_actretire.fragment.RetireReqListSort", oController);
			oView.addDependent(oController._SortDialog);
		}
		
		oController._SortDialog.open();
	},
	
	/*
	 *  리스트 내용에 대해 정렬 처리한다.
	 */
	onConfirmSortDialog : function(oEvent) {
	    var mRetireRequestList = sap.ui.getCore().getModel("RetireRequestList");
		var oDatas = mRetireRequestList.getProperty("/RetirementApplicationAdministrationSet");
		
		var mParams = oEvent.getParameters();
	    var sKey = mParams.sortItem.getKey();
	    var bDescending = mParams.sortDescending;
	    
	    if(bDescending) {
	    	oDatas.sort(function(a, b) {
				var a1 = eval("a." + sKey);
				var b1 = eval("b." + sKey);
				return a1 < b1 ? 1 : a1 > b1 ? -1 : 0;  
			});
	    } else {
	    	oDatas.sort(function(a, b) {
				var a1 = eval("a." + sKey);
				var b1 = eval("b." + sKey);
				return a1 < b1 ? -1 : a1 > b1 ? 1 : 0;  
			});
	    }
	    
	    var vNewDatas = {RetirementApplicationAdministrationSet : []};
	    
	    for(var i=0; i<oDatas.length; i++) {
	    	oDatas[i].Numbr = (i+1) + "";
	    	vNewDatas.RetirementApplicationAdministrationSet.push(oDatas[i]);
	    }
	    
	    mRetireRequestList.setData(vNewDatas);
	},

	/*
	 * 신규프로세스를 생성하는 페이지로 이동한다.(NewRetireStart)
	 */
	onPressNew : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.RetireRequestList");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
    	  id : "zui5_hrxx_actretire.NewRetireStart",
	      data : {
	    	  context : null,
	    	  Retst : "00",
	    	  Appno : "",
	    	  Persa : oPersa.getSelectedKey(),
	    	  FromPageId : "zui5_hrxx_actretire.RetireRequestList"
	      }
		});
	},
	
	/*
	 * 정년대상에 대한 일괄 퇴직프로세스를 생성할 수 있는 페이지로 이동한다.(RegularRetireRegist)
	 */
	onPressRegularRetire  : function(oEvent) {
		sap.ui.getCore().getEventBus().publish("nav", "to", {
    	  id : "zui5_hrxx_actretire.RegularRetireRegist",
	      data : {
	    	  context : null,
	    	  Retst : "00",
	    	  FromPageId : "zui5_hrxx_actretire.RetireRequestList"
	      }
		});
	},
	
	/*
	 * 퇴직프로세스 리스트에서 선택된 프로세스에 대해 발령품의를 할 수 있는 Dialog를 Open한다.
	 */
	onPressAction : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.RetireRequestList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		
		if(!vContexts || vContexts.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
			return;
		}
		
		var mRetirementList = oTable.getModel();
		
		for(var i=0; i<vContexts.length; i++) {
			var vExtyn = mRetirementList.getProperty(vContexts[i] + "/Actrq");
			if(vExtyn == "X") {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_RETIRE_ALREADY_ACTION"));
				return;
			}
			
			var vDocyn = mRetirementList.getProperty(vContexts[i] + "/Docyn");
			if(vDocyn != "X") {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_RETIRE_NOT_DOCYN_ACTION"));
				return;
			}
		}
		
		if(!oController._ActionDialog) {
			oController._ActionDialog = sap.ui.jsfragment("zui5_hrxx_actretire.fragment.RetireAction", oController);
			oView.addDependent(oController._ActionDialog);
		}
		
		oController._ActionDialog.open();
	},
	
	/*
	 * 발령품의를 할 수 있는 Dialog를 Open하기전에 기안부서 등의 필요정보를 설정한다.
	 */
	onBeforeOpenRetireActionDialog: function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.RetireRequestList");
		var oController = oView.getController();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oReqdp = sap.ui.getCore().byId(oController.PAGEID + "_RA_Reqdp");
		oReqdp.removeAllItems();
		oReqdp.destroyItems();
		
		var oAction = sap.ui.getCore().byId(oController.PAGEID + "_RA_Action");
		oAction.setSelected(false);
		
		oModel.read("/AppReqDepListSet/?$filter=Persa%20eq%20%27" + oPersa.getSelectedKey() + "%27", 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							oReqdp.addItem(
									new sap.ui.core.Item({
										key : oData.results[i].Orgeh, 
										text : oData.results[i].Orgtx
									})
							);
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		var oDocno = sap.ui.getCore().byId(oController.PAGEID + "_RA_Docno");
		oDocno.removeAllItems();
		oDocno.destroyItems();
		
		oDocno.addItem(
				new sap.ui.core.Item({
					key : "0000", 
					text : oBundleText.getText("SELECTDATA")
				})
		);
		
		 /* 20160216 KYJ
	     * Filter Docty 추가 
	     */ 
	   var filterString = "";
	    filterString += "/?$filter=";  
	    filterString += "Persa%20eq%20%27" + oPersa.getSelectedKey() + "%27"; 
	    filterString += "%20and%20"; 
	    filterString += "Docty%20eq%20%27" + oController._vDocty + "%27"; 
		
		oModel.read("/DraftActionApprovalRequestSet" + filterString, 
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							oDocno.addItem(
									new sap.ui.core.Item({
										key : oData.results[i].Docno, 
										text : oData.results[i].Doctx
									})
							);
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
	},
	
	/*
	 * 선책된 퇴직프로세스에 대한 발령품의를 하도록 정보를 저장하고 발령품의서 Html로 이동한다.(ActApp.html)
	 */	
	onPressRetireAction: function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.RetireRequestList");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oReqdp = sap.ui.getCore().byId(oController.PAGEID + "_RA_Reqdp");
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_RA_Actda");
		var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_RA_Title");
		var oDocno = sap.ui.getCore().byId(oController.PAGEID + "_RA_Docno");
		
		var vDocno = oDocno.getSelectedKey();
		
		if(vDocno == "" || vDocno == "0000") {
			if(oActda.getValue() == "") {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_LOA_INFO_INPUT"));
				return;
			}
			
			if(oReqdp.getSelectedKey() == "") {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_ORGEH"));
				return;
			}
			
			if(oTitle.getValue() == "") {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_INPUT_TITLE"));
				return;
			}
		}		
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		var mRetirementList = oTable.getModel();
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		
		var AfterProcess = function() {
			var oAction = sap.ui.getCore().byId(oController.PAGEID + "_RA_Action");
			if(oAction.getSelected()) {
				var lang1 = jQuery.sap.getUriParameters().get("sap-ui-language");
				var lang2 = jQuery.sap.getUriParameters().get("sap-language");
				var addParameter = "";
				if(lang1 != "") {
					addParameter = "&sap-ui-language=" + lang1;
				} else if(lang2 != "") {
					addParameter = "&sap-language=" + lang2;
				}
				
				document.location.href = "/sap/bc/ui5_ui5/sap/zhrxx_hassapp/ActionApp.html?Persa=" + oPersa.getSelectedKey() + addParameter;
				oController.onRAClose();
				return;
			}
			
			oController.onPressSearch();
			
			oController.onRAClose();
		};		
		
		var ActionProcess = function() {
			var process_result = false;
			var oPath = "/RetirementActionRequestSet";
			
			var vAppnos = ""; 
			for(var i=0; i<vContexts.length; i++) {
				vAppnos += mRetirementList.getProperty(vContexts[i] + "/Appno") + "|";
			}
			
			try {
				createData = {};
				createData.Orgeh = oReqdp.getSelectedKey();
				createData.Persa = oPersa.getSelectedKey();
				createData.Docno = vDocno;
				createData.Actda = "\/Date(" + common.Common.getTime(oActda.getValue()) + ")\/";
				createData.Title = oTitle.getValue();
				createData.AppnoS = vAppnos;
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
			
			sap.m.MessageBox.alert(oBundleText.getText("MSG_RETIRE_ACTION_COMPLETED"), {
				title: oBundleText.getText("INFORMATION"),
				onClose : AfterProcess
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
		
		setTimeout(ActionProcess, 300);
	},
	
	/*
	 * 발령품의 Dialog를 Close한다.
	 */
	onRAClose: function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.RetireRequestList");
		var oController = oView.getController();
		
		if(oController._ActionDialog.isOpen()) {
			oController._ActionDialog.close();
		}
	},
	
	/*
	 * 퇴직프로세스 리스트에서 선택된 프로세스에 대해 철회 처리를 한다.
	 */
	onPressCancelRetire : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.RetireRequestList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		
		if(!vContexts || vContexts.length < 1) {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
			return;
		}
		
		var mRetirementList = oTable.getModel();
		var oModel = sap.ui.getCore().getModel("ZHRXX_RETAPPL_SRV");
		
		for(var i=0; i<vContexts.length; i++) {
			var vExtyn = mRetirementList.getProperty(vContexts[i] + "/Extyn");
			if(vExtyn == "X") {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_RETIRE_ALREADY_CANCELED"));
				return;
			}
		}
		
		var CancelProcess = function() {
			var process_result = false;
			for(var i=0; i<vContexts.length; i++) {
				try {
					var vAppno = mRetirementList.getProperty(vContexts[i] + "/Appno");
					var oPath = "/RetirementApplicationAdministrationSet(Appno='" + vAppno + "')";
					updateData = {};
					updateData.Persa = mRetirementList.getProperty(vContexts[i] + "/Persa");
					updateData.Appno = vAppno;
					updateData.Pernr = mRetirementList.getProperty(vContexts[i] + "/Pernr");
					updateData.Retda = mRetirementList.getProperty(vContexts[i] + "/Retda");
					updateData.Mailc = oController.makeEmailHtml(oController, mRetirementList, vContexts[i]);
					console.log(updateData.Mailc);
					updateData.Actty = "EX";
					oModel.update(
							oPath, 
							updateData, 
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
			
			sap.m.MessageBox.alert(oBundleText.getText("MSG_RETIRE_CANCELED"), {
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
				
				setTimeout(CancelProcess, 300);
			}
		};
		
		sap.m.MessageBox.show(oBundleText.getText("MSG_RETIRE_CANCEL_CONFIRM"), {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("TITLE_RETIRE_CANCEL"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: onProcessing
		});
	},
	
	/*
	 * 퇴직프로세스를 시작을 알리는 이메일을 생성한다.
	 */
	makeEmailHtml : function(oController, model, context) {
	
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
		var info_tr_start = "[INFO_START]";
		var info_tr_end = "[INFO_END]";
		
		var html_url = "/sap/bc/ui5_ui5/sap/zhrxx_common/emailhtml/retire_cancel_email.html";
		
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
		
		tHtml = tHtml.replace("[RETIRE_COMMENT]", oBundleText.getText("MSG_RETIRE_CANCEL_EMAIL_COMMENT"));
		tHtml = tHtml.replace("[RETIRE_PERSON_TITLE]", oBundleText.getText("PANEL_RETIRE_TARGET"));
		
		var vGotoUrl = "http://hr.doosan.com/irj/servlet/prt/portal/prtroot/pcd!3aportal_content!2fDoosanGHRIS!2fiViews!2fESS!2fResignation_process?sap-config-mode=true";
		var vLink = "<a href='" + vGotoUrl + "' target='_new'>" + oBundleText.getText("GOTO_BTN") + "</a>";
		tHtml = tHtml.replace("[LINK]", vLink);
		
		var info_data = "";
		var tmp_info_html ="";
		
		//성명
		tmp_info_html = info_html;
		tmp_info_html = tmp_info_html.replace("[INFO_LABEL]", oBundleText.getText("ENAME"));
		tmp_info_html = tmp_info_html.replace("[INFO_DATA]", model.getProperty(context + "/Ename"));
		info_data += tmp_info_html;
		
		//직위/직책
		tmp_info_html = info_html;
		tmp_info_html = tmp_info_html.replace("[INFO_LABEL]", oBundleText.getText("ZZCALPSG"));
		tmp_info_html = tmp_info_html.replace("[INFO_DATA]", model.getProperty(context + "/Zzcaltltx") + " / " + model.getProperty(context + "/Zzpsgrptx"));
		info_data += tmp_info_html;
		
		//소속부서
		tmp_info_html = info_html;
		tmp_info_html = tmp_info_html.replace("[INFO_LABEL]", oBundleText.getText("STEXT"));
		tmp_info_html = tmp_info_html.replace("[INFO_DATA]", model.getProperty(context + "/Fulln"));
		info_data += tmp_info_html;
		
		//퇴직일	
		tmp_info_html = info_html;
		tmp_info_html = tmp_info_html.replace("[INFO_LABEL]", oBundleText.getText("SCHE_RETDA"));
		tmp_info_html = tmp_info_html.replace("[INFO_DATA]", dateFormat.format(new Date(common.Common.setTime(new Date(model.getProperty(context + "/Retda"))))));
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
	
	onChangeDocno : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.RetireRequestList");
		var oController = oView.getController();
		
		var oItem = oEvent.getParameter("selectedItem");
		var vKey = oItem.getKey();
		
		var oReqdp = sap.ui.getCore().byId(oController.PAGEID + "_RA_Reqdp");
		var oActda = sap.ui.getCore().byId(oController.PAGEID + "_RA_Actda");
		var oTitle = sap.ui.getCore().byId(oController.PAGEID + "_RA_Title");
		
		if(vKey != "" && vKey != "0000") {
			oReqdp.setEnabled(false);
			oActda.setEnabled(false);
			oTitle.setEnabled(false);
		} else {
			oReqdp.setEnabled(true);
			oActda.setEnabled(true);
			oTitle.setEnabled(true);
		}
	},
	
	downloadExcel : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_actretire.RetireRequestList");
//		var oController = oView.getController();
		
		var mRetireRequestList = sap.ui.getCore().getModel("RetireRequestList");
//		var oDatas = mRetireRequestList.getProperty("/RetirementApplicationAdministrationSet");
		
//		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: gDtfmt});
		
//		var new_datas = [];
//		for(var i=0; i<oDatas.length; i++) {
//			var onedata = {};
//			
//			onedata.Numbr = oDatas[i].Numbr;
//			onedata.Ename = oDatas[i].Ename;
//			onedata.Pernr = oDatas[i].Pernr;
//			onedata.Stext = oDatas[i].Stext;
//			onedata.Zzcaltltx = oDatas[i].Zzcaltltx;
//			onedata.Entda = dateFormat.format(oDatas[i].Entda);
//			onedata.Retda = dateFormat.format(oDatas[i].Retda);
//			
//			if(oDatas[i].Extyn == "X") {
//				onedata.Temyn = "Cancel";
//				onedata.Suvyn = "Cancel";
//				onedata.Hrtyn = "Cancel";
//				onedata.Setyn = "Cancel";
//				onedata.Stend = "Cancel";
//				onedata.Docyn = "Cancel";
//				onedata.Actrq = "Cancel";
//				onedata.Actda = "Cancel";
//			} else {
//				onedata.Temyn = oDatas[i].Temyn;
//				onedata.Suvyn = oDatas[i].Suvyn;
//				onedata.Hrtyn = oDatas[i].Hrtyn;
//				onedata.Setyn = oDatas[i].Setyn;
//				onedata.Stend = oDatas[i].Stend;
//				onedata.Docyn = oDatas[i].Docyn;
//				onedata.Actrq = oDatas[i].Actrq;
//				if(oDatas[i].Actda != null) {
//					onedata.Actda = "X";
//				} else {
//					onedata.Actda = "";
//				}
//			}
//			onedata.Adcnt = oDatas[i].Adcnt;
//			
//			new_datas.push(onedata);
//		}
		
		
		var oExport = new sap.ui.core.util.Export({
			exportType : new sap.ui.core.util.ExportTypeCSV({
				separatorChar : ","
			}),
			models : mRetireRequestList,
			rows : {
				path : "/RetirementApplicationAdministrationSet"
			},
			columns : [
			    {name : oBundleText.getText( "NUMBER"),  template : { content : "{Numbr}" } },
			    {name : oBundleText.getText( "ENAME"),  template : { content : "{Ename}" } },
			    {name : oBundleText.getText( "PERNR"),  template : { content : "{Pernr}" } },
			    {name : oBundleText.getText( "FULLN"),  template : { content : "{Stext}" } },
			    {name : oBundleText.getText( "ZZCALTLTX"),  template : { content : "{Zzcaltltx}" } },
			    {name : oBundleText.getText( "ENTDA"),  
			     template : { content : {path : "Entda", formatter : common.Common.DateFormatter } } 
			    },
			    {name : oBundleText.getText( "RETDA"),  
				     template : { content : {path : "Retda", formatter : common.Common.DateFormatter } } 
				},
				{name : oBundleText.getText( "RETIRE_HASS_STATUS1"),  
				     template : { content : {
				    	 parts : ["Temyn", "Extyn"],
						 formatter : function(fVal1, fVal2) {
							 if(fVal2 == "X") return "Cancel";
							 return fVal1 == "X" ? "X" : ""; 
						 }
				     } } 
				},
				{name : oBundleText.getText( "RETIRE_HASS_STATUS2"),  
				     template : { content : {
				    	 parts : ["Suvyn", "Extyn", "Reexp"],
						 formatter : function(fVal1, fVal2, fVal3) {
							 if(fVal2 == "X") return "Cancel";
							 if(fVal3 == "X") return "-";
							 return fVal1 == "X" ? "X" : ""; 
						 }
				     } } 
				},
				{name : oBundleText.getText( "RETIRE_HASS_STATUS3"),  
				     template : { content : {
				    	 parts : ["Hrtyn", "Extyn"],
						 formatter : function(fVal1, fVal2, fVal3) {
							 if(fVal2 == "X") return "Cancel";
							 return fVal1 == "X" ? "X" : ""; 
						 }
				     } } 
				},		
				{name : oBundleText.getText( "RETIRE_HASS_STATUS4"),  
				     template : { content : {
				    	 parts : ["Setyn", "Extyn", "Seexp"],
						 formatter : function(fVal1, fVal2, fVal3) {
							 if(fVal2 == "X") return "Cancel";
							 if(fVal3 == "X") return "-";
							 return fVal1 == "X" ? "X" : ""; 
						 }
				     } } 
				},
				{name : oBundleText.getText( "RETIRE_HASS_STATUS5"),  
				     template : { content : {
				    	 parts : ["Stend", "Extyn", "Seexp"],
						 formatter : function(fVal1, fVal2, fVal3) {
							 if(fVal2 == "X") return "Cancel";
							 if(fVal3 == "X") return "-";
							 return fVal1 == "X" ? "X" : ""; 
						 }
				     } } 
				},
				{name : oBundleText.getText( "RETIRE_HASS_STATUS6"),  
				     template : { content : {
				    	 parts : ["Docyn", "Extyn"],
						 formatter : function(fVal1, fVal2, fVal3) {
							 if(fVal2 == "X") return "Cancel";
							 return fVal1 == "X" ? "X" : ""; 
						 }
				     } } 
				},
				{name : oBundleText.getText( "RETIRE_HASS_STATUS7"),  
				     template : { content : {
				    	 parts : ["Actrq", "Extyn"],
						 formatter : function(fVal1, fVal2, fVal3) {
							 if(fVal2 == "X") return "Cancel";
							 return fVal1 == "X" ? "X" : ""; 
						 }
				     } } 
				},
				{name : oBundleText.getText( "RETIRE_HASS_STATUS8"),  
				     template : { content : {
				    	 parts : ["Actda", "Extyn"],
						 formatter : function(fVal1, fVal2, fVal3) {
							 if(fVal2 == "X") return "Cancel";
							 return fVal1 != null ? "X" : ""; 
						 }
				     } } 
				},
				{name : oBundleText.getText( "RETIRE_HASS_STATUS9"),  template : { content : "{Adcnt}" } }
			 ]			
		});
		
		oExport.saveFile().always(function() {
			this.destroy();
		});

		
	},
});