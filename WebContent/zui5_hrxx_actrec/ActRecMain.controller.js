jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

sap.ui.controller("zui5_hrxx_actrec.ActRecMain", {
	PAGEID : "ActRecMain",
	
	BusyDialog : null,
	oBusyIndicator : new sap.m.BusyIndicator({
		text : oBundleText.getText("MSG_PROCESSING_WAIT"),
		customIcon : "/sap/bc/ui5_ui5/sap/zhrxx_common/images/progress.gif",
		customIconWidth : "50px",
		customIconHeight : "50px"
	}),
	
	_SortDialog : null,
	_DataTransferDialog : null,
	
	_vMolga : "",
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf epmproductapp.EPMProductApp
*/
	onInit: function() {
		//if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		//};
		
		var oRecYy = sap.ui.getCore().byId(this.PAGEID + "_RecYy");
		var curDate = new Date();
		var curYy = curDate.getFullYear();
		for(var i = curYy; i > 1999; i--) {
			oRecYy.addItem(
				new sap.ui.core.Item({
					key : i, 
					text : i
				})
			);
			oRecYy.setSelectedKey(curYy);
		}
		
	    this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this)
		});
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf epmproductapp.EPMProductApp
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf epmproductapp.EPMProductApp
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf epmproductapp.EPMProductApp
*/
//	onExit: function() {
//
//	}
	
	
	/*
	 * 페이지가 표시되기전에 수행한다.
	 * 바인딩 전에 안내메세지 출력 후 바인딩이 완료되면 메세지 창을 닫는다.
	 */
	onBeforeShow: function(oEvent) {
		var vPersatx = "";
		if(oEvent) {
			this._vReqno = oEvent.data.Reqno;
			this._vDocno = oEvent.data.Docno;
			this._vPersa = oEvent.data.Persa;
			vPersatx = oEvent.data.Persatx;
		}
		var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
		oPersa.setValue(vPersatx);
		this.setSubPersa();
		this.setRecYy();
		this.onPressSearch();
	},
	
	setSubPersa : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecMain");
		var oController = oView.getController();
		var oSubPersa = sap.ui.getCore().byId(this.PAGEID + "_SubPersa");
		var oCommonModel = sap.ui.getCore().getModel("ZHRXX_COMMON_SRV");
		oSubPersa.removeAllItems();
		var oPath = "/PersSubareaListSet/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		oCommonModel.read(oPath,
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							oSubPersa.addItem(new sap.ui.core.Item({key : oData.results[i].Btrtl, text : oData.results[i].Btext}));	
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
	},
	
	setRecYy : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecMain");
		var oController = oView.getController();

		var oRecYy = sap.ui.getCore().byId(oController.PAGEID + "_RecYy"); 
		var oSFModel = sap.ui.getCore().getModel("ZSFXX_ONBAPP_SRV");
		var filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		
		oSFModel.read("/SFRecruitingYearSet" + filterString,
				null, 
				null, 
				false, 
				function(oData, oResponse) {					
					if(oData.results && oData.results.length) {
						oRecYy.removeAllItems();
						for(var i=0; i<oData.results.length; i++) {
							oRecYy.addItem(new sap.ui.core.Item({key : oData.results[i].RecYy, text : oData.results[i].RecYy}));	
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		
		
	}, 
	/* IconTabFilter의 Icon을 선택할 시 발생되는 Event 
	 * Filter를 걸어준다
	 */
	handleIconTabBarSelect : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecMain");
		var oController = oView.getController();

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE"); 
		
		var oBinding = oTable.getBinding("items"),
	      sKey = oEvent.getParameter("selectedKey"),
	      oFilters = [];
		
		if(sKey != "All") 
			oFilters.push(new sap.ui.model.Filter("Recst", "EQ", sKey));
	    
		oBinding.filter(oFilters);
	},
	
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecMain");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oRecYy = sap.ui.getCore().byId(oController.PAGEID + "_RecYy");
		
		var oFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_ALL");
		var oFilterA = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_A");
		var oFilterB = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_B");
		var oFilterC = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_C");
	
		if(oController.BusyDialog) {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(oController.oBusyIndicator);
		} else {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(oController.oBusyIndicator);
			oController.getView().addDependent(oController.BusyDialog);
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		var mActionRecList = sap.ui.getCore().getModel("ActionRecList");
		var vActionRecList = {ActionRecListSet : []};
		
		var vReqCntAll = 0, vReqCntA = 0, vReqCntB = 0, vReqCntC = 0;
		
		var readAfterProcess = function() {
			oFilterAll.setCount(vReqCntAll);
			oFilterA.setCount(vReqCntA);
			oFilterB.setCount(vReqCntB);
			oFilterC.setCount(vReqCntC);
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
			var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
			oTable.setModel(mActionRecList);
			oTable.bindItems("/ActionRecListSet", oColumnList);

			var oIconTabbar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
			var sKey = oIconTabbar.getSelectedKey();
			
			var oBinding = oTable.getBinding("items");
			var oFilters = [];
			if(sKey != "All") oFilters.push(new sap.ui.model.Filter("Recst", "EQ", sKey));
		    oBinding.filter(oFilters);

		    if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			};
		};
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		oModel.read("/RecruitingDataTransferSet/?$filter=" +
					"Persa eq '" + oPersa.getSelectedKey() + "' and " +
					"RecYy eq '" + oRecYy.getSelectedKey() + "'",
					null, 
					null, 
					true,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vActionRecList.ActionRecListSet.push(oData.results[i]);
								
								switch(oData.results[i].Recst) {
									case "A" :
										vReqCntA++;
										break;
									case "B" :
										vReqCntB++;
										break;
									case "C" : 
										vReqCntC++;
								}
							}
							vReqCntAll = oData.results.length;
							mActionRecList.setData(vActionRecList);
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
	
	onChangePersa : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecMain");
		var oController = oView.getController();
		
		var oPersa = oEvent.getSource();
		var oItem = oPersa.getSelectedItem();
			
		oController._vMolga = oItem.getCustomData()[0].getValue("Molga");
		
//		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
//		
//		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
//		var oRecYy = sap.ui.getCore().byId(oController.PAGEID + "_RecYy");
//		
//		if(oPersa.getSelectedKey() != "" && oPersa.getSelectedKey() != "0000") {
//			oRecYy.removeAllItems();
//			oModel.read(
//					"/RecruitingYearSet?$filter=Persa%20eq%20%27" + oPersa.getSelectedKey() + "%27",
//					null, 
//					null, 
//					false,
//					function(oData, oResponse) {	
//						if(oData && oData.results) {
//							for(var i=0; i<oData.results.length; i++) {
//								oRecYy.addItem(new sap.ui.core.Item({key : oData.results[i].RecYy, text : oData.results[i].RecYy}));
//							}
//							if(oData.results.length != 0) oRecYy.setSelectedKey(oData.results[0].RecYy);
//						}
//					},
//					function(oResponse) {
//						common.Common.log(oResponse);
//					}
//			);
//		}
	},
	
	onSelectRow : function(oEvent) {
		var oContext = oEvent.getSource().getBindingContext();
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecMain");
		var oController = oView.getController();

		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "zui5_hrxx_actrec.ActRecSubject",
		      data : {
		    	  context : oContext,
		    	  Molga : oController._vMolga
		      }
		});
	},
	
	onPressSort : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecMain");
		var oController = oView.getController();		
		
		if(!oController._SortDialog) {
			oController._SortDialog = sap.ui.jsfragment("zui5_hrxx_actrec.fragment.ActionRecListSort", oController);
			oView.addDependent(oController._SortDialog);
		}
		
		oController._SortDialog.open();
	},
	
	onConfirmSortDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecMain");
		var oController = oView.getController();	
		
	    var mActionRecList = sap.ui.getCore().getModel("ActionRecList");
		var oDatas = mActionRecList.getProperty("/ActionRecListSet");
		
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
	    
	    var vNewDatas = {ActionRecListSet : []};
	    
	    for(var i=0; i<oDatas.length; i++) {
	    	oDatas[i].Numbr = (i+1) + "";
	    	vNewDatas.ActionRecListSet.push(oDatas[i]);
	    }
	    
	    mActionRecList.setData(vNewDatas);
	},
	
	createAction : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecMain");
		var oController = oView.getController();		
		
		if(!oController._DataTransferDialog) {
			oController._DataTransferDialog = sap.ui.jsfragment("zui5_hrxx_actrec.fragment.SelectRecruiting", oController);
			oView.addDependent(oController._DataTransferDialog);
		}
		
		oController._DataTransferDialog.open();
		
		oController.getRecList(oEvent);
	},
	
	closeAction : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecMain");
		var oController = oView.getController();
		
		var mRecInterface = sap.ui.getCore().getModel("ActionRecListInterface");
		var vRecInterface = {RecruitingInterfaceSet : []};
		mRecInterface.setData(vRecInterface);
		
		if(oController._DataTransferDialog && oController._DataTransferDialog.isOpen()) {
			oController._DataTransferDialog.close();
		};
	},
	
	getRecList : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecMain");
		var oController = oView.getController();
		
		var searchFunction = function() {
		
			var mRecInterface = sap.ui.getCore().getModel("ActionRecListInterface");
			var vRecInterface = {RecruitingInterfaceSet : []};
			
			var readAfterProcess = function() {
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_RecSelect_TABLE");
				var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_RecSelect_COLUMNLIST");
				console.log(mRecInterface);
				oTable.setModel(mRecInterface);
				oTable.bindItems("/RecruitingInterfaceSet", oColumnList);
	
				var oBinding = oTable.getBinding("items");
				oBinding.filter([]);
	
			    if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				};
			};
			
			var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
			var oRecYy = sap.ui.getCore().byId(oController.PAGEID + "_RecYy");
	
			var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
			oModel.read("/RecruitingInterfaceSet/?$filter=" +
						"Persa eq '" + oPersa.getSelectedKey() + "'" +
						" and RecYy eq '" + oRecYy.getSelectedKey() + "'",
						null, 
						null, 
						true,
						function(oData, oResponse) {
							if(oData && oData.results) {
								for(var i=0; i<oData.results.length; i++) {
									vRecInterface.RecruitingInterfaceSet.push(oData.results[i]);
								}
								mRecInterface.setData(vRecInterface);
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
		};
		
		if(oController.BusyDialog) {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(oController.oBusyIndicator);
		} else {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(oController.oBusyIndicator);
			oController.getView().addDependent(oController.BusyDialog);
		}
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		setTimeout(searchFunction, 300);
	},
	
	onSelectAction : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actrec.ActRecMain");
		var oController = oView.getController();
	
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_RecSelect_TABLE");
		var oContext = oTable.getSelectedContexts();
		
		var interfaceFunction = function(fVal) {
			var oneData = {};
			oneData.Recno     = oContext[0].getProperty("Recno");
			oneData.Persa     = oContext[0].getProperty("Persa");
			oneData.RecYy     = oContext[0].getProperty("RecYy");
			oneData.RecTypeCd = oContext[0].getProperty("RecTypeCd");
			oneData.RecNm     = oContext[0].getProperty("RecNm");
			
			var process_result = false;
			var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
	
			console.log(oneData);
			oModel.create(
					"/RecruitingInterfaceSet", 
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
			
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			};
			
			if(process_result) {
				sap.m.MessageBox.alert(oBundleText.getText("MSG_RECINTERFACE"), {
					title: oBundleText.getText("MSG_TITLE_GUIDE"),
					onClose : function() {
						oController.onPressSearch();
						oController.closeAction();
					}
				});
			}
		};
		
		var preAction = function(fVal) {
			if(fVal && fVal == "OK") {
				if(oContext.length == 0) {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_RECINTERFACE_TARGET"));
					return;
				};
				
				if(oController.BusyDialog) {
					oController.BusyDialog.removeAllContent();
					oController.BusyDialog.destroyContent();
					oController.BusyDialog.addContent(oController.oBusyIndicator);
				} else {
					oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
					oController.BusyDialog.addContent(oController.oBusyIndicator);
					oController.getView().addDependent(oController.BusyDialog);
				}
				if(!oController.BusyDialog.isOpen()) {
					oController.BusyDialog.open();
				}
				
				setTimeout(interfaceFunction, 300);
			}
		};
		
		sap.m.MessageBox.confirm(oBundleText.getText("MSG_RECINTERFACE_CONFIRM"), {
			title : oBundleText.getText("CONFIRM_BTN"),
			onClose : preAction
		});
	},
});