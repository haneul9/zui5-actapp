jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("sap.m.MessageBox");

sap.ui.controller("zui5_hrxx_acteducation.EducationRequestList", {
	
	PAGEID : "EducationRequestList",
	
//	oBundleText : jQuery.sap.resources({
//		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties",
//		locale : sap.ui.getCore().getConfiguration().getLanguage()
//	}),
	
	BusyDialog: null,
	
	_vActda : "",

	_EducationTargtSelectDialog : null,
	_SortDialog : null,
	
	_AddPersonDialog : null,
	_SerachOrgDialog : null,
	
	_vPersa : "",
	_vMolga : "",
	
	_vSelectedAppnoAttachFile : "",

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_acteducation.EducationRequestList
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
			oPersa.setSelectedKeys(vPersaData[0].Persa);
		} catch(ex) {
			common.Common.log(ex);
		}
	
	    this.getView().addEventDelegate({
			onAfterShow  : jQuery.proxy(function (evt) {
				this.onAfterShow(evt);
			}, this),
		});
	    
		this._vPersa = gPersa;
		this._vMolga = gMolga;
		//this._vMolga = "28";
	},
	
	onAfterShow: function(evt) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		this._vActda = dateFormat.format(curDate);
		
		this.onPressSearch();
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_acteducation.EducationRequestList
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_acteducation.EducationRequestList
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_acteducation.EducationRequestList
*/
//	onExit: function() {
//
//	}
	onKeyUp : function(oEvent) {
		if(oEvent.which == 13) {
			var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
			var oController = oView.getController();
			oController.onPressSearch();
		}
	},

	onChangeComboBox : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");	
		var vPersas  = oPersa.getSelectedItems();
		
		var oControl = sap.ui.getCore().byId(oController.PAGEID + "_Pbtxt");
		var vFilterInfo = "";
		
		if(oControl) {			
			if(vPersas && vPersas.length) {
				for(var i=0; i<vPersas.length; i++) {
					vFilterInfo += vPersas[i].getText() + ", ";
				}
			}
			oControl.setText(vFilterInfo);
		}
		
	},
	
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
		var oController = oView.getController();
		
		var oAppld_From = sap.ui.getCore().byId(oController.PAGEID + "_Appld_From");
		var oAppld_To = sap.ui.getCore().byId(oController.PAGEID + "_Appld_To");
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oRpern = sap.ui.getCore().byId(oController.PAGEID + "_Rpern");
		
		var oFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_ALL");
		var oFilterCreate = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_CRETAE");
		var oFilterApproval = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_APPROVAL");
		var oFilterReject = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_REJECT");
		var oFilterCompalte = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_COMPLETE");
		
		var oFilters = [];	
	    var filterString = "";
	    
	    filterString += "/?$filter=";  
	    filterString += "(Actty eq '" + "H" + "')";
		filterString += " and (Appld ge datetime'" + oAppld_From.getValue() + "T00:00:00' and Appld le datetime'" + oAppld_To.getValue() + "T00:00:00')";
		//filterString += " and (Persa eq '" + oPersa.getSelectedKey() + "')";
		filterString += "%20and%20Rpern%20eq%20%27" + encodeURI(oRpern.getValue()) +  "%27";
		
		//추가	
		var vPersaString = "";
		var vPersaData = oPersa.getSelectedKeys();
		if(vPersaData && vPersaData.length) {
			for(var i=0; i<vPersaData.length; i++) {
				oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, vPersaData[i]));
				if(vPersaString != "") {
					vPersaString += "%20or%20";
				}
				vPersaString += "Persa%20eq%20%27" + vPersaData[i] + "%27";
			}
		}
		if(vPersaString != "") {
			filterString += "%20and%20(" + vPersaString +  ")";
		}
		//추가 끝
		
		oFilters.push(new sap.ui.model.Filter("Appld", sap.ui.model.FilterOperator.BT, oAppld_From.getValue(), oAppld_To.getValue()));
		//oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oPersa.getSelectedKey(), ""));
		
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
		
		var mEducationRegistList = sap.ui.getCore().getModel("EduBackgroundRegistSet");
		var vEducationRegistList = {EduBackgroundRegistSet : []};
		
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
		oFilterAll.setCount(vReqCntAll);
		//oFilterCreate.setCount(vReqCnt1);
		oFilterApproval.setCount(vReqCnt2);
		oFilterReject.setCount(vReqCnt4);
		oFilterCompalte.setCount(vReqCnt5);
		
		var readAfterProcess = function() {
			oFilterAll.setCount(vReqCntAll);
			//oFilterCreate.setCount(vReqCnt1);
			oFilterApproval.setCount(vReqCnt2);
			oFilterReject.setCount(vReqCnt4);
			oFilterCompalte.setCount(vReqCnt5);
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
			var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
			oTable.setModel(mEducationRegistList);
			oTable.bindItems("/EduBackgroundRegistSet", oColumnList);
			
			var oIconTabbar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
			var sKey = oIconTabbar.getSelectedKey();
			
			var oBinding = oTable.getBinding("items");
			var oFilters = [];
			if (sKey === "creation") {
		      oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "10"));
		    } else if (sKey === "approval") {
		    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "20"));
		    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "25"));
		    } else if (sKey === "confirmation") {
		    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "30"));
		    } else if (sKey === "reject") {
		    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "40"));
		    } else if (sKey === "complete") {
		    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "50"));	      
		    }
		    oBinding.filter(oFilters);
			
			if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			};
		};
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_EDUCATION_SRV");
		oModel.read("/EduBackgroundRegistSet" + filterString, 
					null, 
					null, 
					true,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vEducationRegistList.EduBackgroundRegistSet.push(oData.results[i]);
								
								if(oData.results[i].Astat == "10") vReqCnt1++;
								else if(oData.results[i].Astat == "20" || oData.results[i].Astat == "25") vReqCnt2++;
								else if(oData.results[i].Astat == "40") vReqCnt4++;
								else if(oData.results[i].Astat == "50") vReqCnt5++;
							}
							vReqCntAll = oData.results.length;
							mEducationRegistList.setData(vEducationRegistList);
							readAfterProcess();
						}
					},
					function(oError) {
						//common.Common.log(oResponse);
						mEducationRegistList.setData(null);
						if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
							oController.BusyDialog.close();
						};
					}
		);
	},
	
	handleIconTabBarSelect : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
		var oController = oView.getController();

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE"); 
		
		var oBinding = oTable.getBinding("items"),
	      sKey = oEvent.getParameter("selectedKey"),
	      oFilters = [];
	    if (sKey === "creation") {
	      oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "10"));
	    } else if (sKey === "approval") {
	    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "20"));
	    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "25"));
	    } else if (sKey === "confirmation") {
	    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "30"));
	    } else if (sKey === "reject") {
	    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "40"));
	    } else if (sKey === "complete") {
	    	oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "50"));	      
	    }
	    oBinding.filter(oFilters);
	},
	
//	requestNewEducation : function(oEvent) {	
//		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
//		var oController = oView.getController();
//		
//		if(!oController._EducationTargtSelectDialog) {
//			oController._EducationTargtSelectDialog = sap.ui.jsfragment("zui5_hrxx_acteducation.fragment.EducationTargtSelectDialog", oController);
//			oView.addDependent(oController._EducationTargtSelectDialog);
//		}
//		oController._EducationTargtSelectDialog.open();
//	},
	
//	onETSClose : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
//		var oController = oView.getController();
//		
//		if(oController._EducationTargtSelectDialog.isOpen()) {
//			oController._EducationTargtSelectDialog.close();
//		}
//	},
	
//	onBeforeOpenEducationTargtSelectDialog : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
//		var oController = oView.getController();
//		
//		oController._vMolga = gMolga;
//		
//		var vPernr = gPernr;
//		var vEname = gEname;
//		var vFulln = gStext;
//		var oETSTable = sap.ui.getCore().byId(oController.PAGEID + "_ETS_Table");
//		var oETSColumnList = sap.ui.getCore().byId(oController.PAGEID + "_ETS_ColumnList");
//		
//		var oRpern = sap.ui.getCore().byId(oController.PAGEID + "_ETS_Rpern");
//		oRpern.setValue(vEname);
//		oRpern.removeAllCustomData();
//		oRpern.addCustomData(new sap.ui.core.CustomData({key : "Pernr", value : vPernr}));
//		oRpern.addCustomData(new sap.ui.core.CustomData({key : "Fulln", value : vFulln}));
//		
//		var oFilters = [];
//		oFilters.push(new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, vPernr));
//		oETSTable.bindItems("/EduBackgroundListSet", oETSColumnList, null, oFilters);
//	},
	
//	requestDeleteEducation : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
//		var oController = oView.getController();
//		
//		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
//		var oContexts = oTable.getSelectedContexts();
//		
//		var mEducationRegistList = oTable.getModel();
//		
//		if(oContexts && oContexts.length) {
//			for(var i=0; i<oContexts.length; i++) {
//				var vAstat = mEducationRegistList.getProperty(oContexts[i] + "/Astat");
//				if(vAstat != "10" && vAstat != "00" && vAstat != "40") {
//					sap.m.MessageBox.alert(oBundleText.getText("MSG_FAMILY_DELETE_INVALID_DOCUMENT"));
//					return;
//				}
//			}
//		} else {
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_DOCUMENT"));
//			return;
//		}
//		
//		var oModel = sap.ui.getCore().getModel("ZHRXX_EDUCATION_SRV");
//		
//		var DeleteProcess = function() {
//			var process_result = false;
//			for(var i=0; i<oContexts.length; i++) {
//				try {
//					var vAppno = mEducationRegistList.getProperty(oContexts[i] + "/Appno");
//					var oPath = "/EduBackgroundRegistSet(Appno='" + vAppno + "')";
//					
//					oModel.remove(
//							oPath, 
//							null,
//						    function (oData, response) {
//								process_result = true;
//								common.Common.log("Sucess EduBackgroundRegistSet Delete !!!");
//						    },
//						    function (oError) {
//						    	var Err = {};
//								if (oError.response) {
//									Err = window.JSON.parse(oError.response.body);
//									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
//										common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
//									} else {
//										common.Common.showErrorMessage(Err.error.message.value);
//									}
//								} else {
//									common.Common.showErrorMessage(oError);
//								}
//								process_result = false;
//						    }
//				    );
//					
//					if(!process_result) break;
//				} catch(ex) {
//					process_result = false;
//					common.Common.log(ex);
//				}
//			}
//				
//			if(oController.BusyDialog.isOpen()) {
//				oController.BusyDialog.close();
//			}
//			
//			if(!process_result) return;
//			
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_EDUCATION_DELETED"), {
//				title: oBundleText.getText("INFORMATION"),
//				onClose : function() {
//					oController.onPressSearch();
//				}
//			});
//		};
//		
//		var onProcessing = function(oAction) {
//			if ( oAction === sap.m.MessageBox.Action.YES ) {
//				if(!oController.BusyDialog) {			
//					oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
//					oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
//					oController.getView().addDependent(oController.BusyDialog);
//				} else {
//					oController.BusyDialog.removeAllContent();
//					oController.BusyDialog.destroyContent();
//					oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
//				}
//				if(!oController.BusyDialog.isOpen()) {
//					oController.BusyDialog.open();
//				}
//				
//				setTimeout(DeleteProcess, 300);
//			}
//		};
//		
//		sap.m.MessageBox.show(oBundleText.getText("MSG_EDUCATION_DELETE_CONFIRM"), {
//			icon: sap.m.MessageBox.Icon.INFORMATION,
//			title: oBundleText.getText("TITLE_EDUCATION_DELETE"),
//			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
//	        onClose: onProcessing
//		});
//	},
	
//	requestBatchEducation : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
//		var oController = oView.getController();
//		
//		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
//		var oContexts = oTable.getSelectedContexts();
//		
//		var mEducationRegistList = oTable.getModel();
//		
//		if(oContexts && oContexts.length) {
//			for(var i=0; i<oContexts.length; i++) {
//				var vAstat = mEducationRegistList.getProperty(oContexts[i] + "/Astat");
//				if(vAstat != "10" && vAstat != "00") {
//					sap.m.MessageBox.alert(oBundleText.getText("MSG_FAMILY_REQUEST_INVALID_DOCUMENT"));
//					return;
//				}
//			}
//		} else {
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_DOCUMENT"));
//			return;
//		}
//		
//		var oModel = sap.ui.getCore().getModel("ZHRXX_EDUCATION_SRV");
//		
//		var BatchProcess = function() {
//			var process_result = false;
//			for(var i=0; i<oContexts.length; i++) {
//				try {
//					var vAppno = mEducationRegistList.getProperty(oContexts[i] + "/Appno");
//					var oPath = "/EduBackgroundRegistSet(Appno='" + vAppno + "')";
//					updateData = {};
//					updateData.Appno = vAppno;
//					updateData.Pernr = mEducationRegistList.getProperty(oContexts[i] + "/Pernr");
//					updateData.Astat = "20";
//					updateData.Chgfg = mEducationRegistList.getProperty(oContexts[i] + "/Chgfg");
//					updateData.Actty = "H";
//					updateData.Apchk = "X";
//					oModel.update(
//							oPath, 
//							updateData, 
//							null,
//						    function (oData, response) {
//								process_result = true;
//								common.Common.log("Sucess EduBackgroundRegistSet Update !!!");
//						    },
//						    function (oError) {
//						    	var Err = {};
//								if (oError.response) {
//									Err = window.JSON.parse(oError.response.body);
//									if(Err.error.innererror.errordetails && Err.error.innererror.errordetails.length > 0) {
//										common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
//									} else {
//										common.Common.showErrorMessage(Err.error.message.value);
//									}
//								} else {
//									common.Common.showErrorMessage(oError);
//								}
//								process_result = false;
//						    }
//				    );
//					
//					if(!process_result) break;
//				} catch(ex) {
//					process_result = false;
//					common.Common.log(ex);
//				}
//			}
//				
//			if(oController.BusyDialog.isOpen()) {
//				oController.BusyDialog.close();
//			}
//			
//			if(!process_result) return;
//			
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_EDUCATION_REQUESTED"), {
//				title: oBundleText.getText("INFORMATION"),
//				onClose : function() {
//					oController.onPressSearch();
//				}
//			});
//		};
//		
//		var onProcessing = function(oAction) {
//			if ( oAction === sap.m.MessageBox.Action.YES ) {
//				if(!oController.BusyDialog) {			
//					oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
//					oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
//					oController.getView().addDependent(oController.BusyDialog);
//				} else {
//					oController.BusyDialog.removeAllContent();
//					oController.BusyDialog.destroyContent();
//					oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_PROCESSING_WAIT")}));
//				}
//				if(!oController.BusyDialog.isOpen()) {
//					oController.BusyDialog.open();
//				}
//				
//				setTimeout(BatchProcess, 300);
//			}
//		};
//		
//		sap.m.MessageBox.show(oBundleText.getText("MSG_EDUCATION_REQUEST_CONFIRM"), {
//			icon: sap.m.MessageBox.Icon.INFORMATION,
//			title: oBundleText.getText("TITLE_EDUCATION_REQUEST"),
//			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
//	        onClose: onProcessing
//		});
//	},
	
	onSelectRow : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
		var oController = oView.getController();
		
		var oContext = oEvent.getSource().getBindingContext();

		var mActionReqList = sap.ui.getCore().getModel("EduBackgroundRegistSet");		
	
    	sap.ui.getCore().getEventBus().publish("nav", "to", {
    	  id : "zui5_hrxx_acteducation.EducationRequest",
	      data : {
	    	  Rcontext : mActionReqList.getProperty(oContext.sPath),
	    	  Astat : mActionReqList.getProperty(oContext + "/Astat"),
	    	  Appno : mActionReqList.getProperty(oContext + "/Appno"),
	    	  Persa : oController._vPersa,
	    	  Molga : mActionReqList.getProperty(oContext + "/Molga"),
	    	  Subty : mActionReqList.getProperty(oContext + "/Subty"),
		      Objps : mActionReqList.getProperty(oContext + "/Objps"),
	    	  Seqnr : mActionReqList.getProperty(oContext + "/Seqnr"),
	    	  Chgfg : mActionReqList.getProperty(oContext + "/Chgfg"),
	    	  Pernr : mActionReqList.getProperty(oContext + "/Pernr"),
	    	  Rpern : mActionReqList.getProperty(oContext + "/Rpern"),
	    	  Rorgt : mActionReqList.getProperty(oContext + "/Rorgt"),
	    	  Zzcaltltx : mActionReqList.getProperty(oContext + "/Zzcaltltx"),
	    	  Zzjobgrtx : mActionReqList.getProperty(oContext + "/Zzjobgrtx"),
	    	  Appty : "90",
	    	  FromPageId : "zui5_hrxx_acteducation.EducationRequestList"
	      }
		});			
		
	},
	
	onPressSort : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
		var oController = oView.getController();		
		
		if(!oController._SortDialog) {
			oController._SortDialog = sap.ui.jsfragment("zui5_hrxx_acteducation.fragment.EducationRegistListSort", oController);
			oView.addDependent(oController._SortDialog);
		}
		
		oController._SortDialog.open();
	},
	
	onConfirmSortDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
		var oController = oView.getController();	
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oBinding = oTable.getBinding("items");
		
		var mParams = oEvent.getParameters();
		
		var aSorters = [];
	    var sPath = mParams.sortItem.getKey();
	    var bDescending = mParams.sortDescending;
	    aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
	    oBinding.sort(aSorters);
	},
	
//	displaySearchUserDialog : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
//		var oController = oView.getController();	
//		
//		common.SearchUser1.oController = oController;
//		
//		oController._oUserControl = oEvent.getSource();
//		
//		if(!oController._AddPersonDialog) {
//			oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
//			oView.addDependent(oController._AddPersonDialog);
//		}
//		oController._AddPersonDialog.open();
//	},
	
//	onESSelectPerson : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
//		var oController = oView.getController();	
//		
//		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
//		var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
//		var vSelectedPersonCount = 0;
//		
//		var vPernr = "";
//		var oETSTable = sap.ui.getCore().byId(oController.PAGEID + "_ETS_Table");
//		var oETSColumnList = sap.ui.getCore().byId(oController.PAGEID + "_ETS_ColumnList");
//		
//		if(vEmpSearchResult && vEmpSearchResult.length) {
//			for(var i=0; i<vEmpSearchResult.length; i++) {
//				if(vEmpSearchResult[i].Chck == true) {
//					vSelectedPersonCount++;
//				}				
//			}
//			if(vSelectedPersonCount != 1) {
//				sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
//				return;
//			}
//			
//			for(var i=0; i<vEmpSearchResult.length; i++) {
//				if(vEmpSearchResult[i].Chck == true) {
//					if(oController._oUserControl) {
//						vPernr = mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pernr");
//						oController._oUserControl.setValue(mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Ename"));
//						oController._oUserControl.addCustomData(new sap.ui.core.CustomData({key : "Pernr", value : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Pernr")}));
//						oController._oUserControl.addCustomData(new sap.ui.core.CustomData({key : "Fulln", value : mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Fulln")}));
//						
//						oController._vMolga = mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Molga");
//						oController._vPersa = mEmpSearchResult.getProperty("/EmpSearchResultSet/" + i + "/Persa");
//					}
//				}				
//			}
//		} else {
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
//			return;
//		}
//		var oFilters = [];
//		oFilters.push(new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, vPernr));
//		oETSTable.bindItems("/EduBackgroundListSet", oETSColumnList, null, oFilters);
//		
//		common.SearchUser1.onClose();
//	},
	
//	displayMultiOrgSearchDialog : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
//		var oController = oView.getController();	
//		
//		jQuery.sap.require("common.SearchOrg");
//		
//		common.SearchOrg.oController = oController;
//		common.SearchOrg.vActionType = "Multi";
//		common.SearchOrg.vCallControlId = oEvent.getSource().getId();
//		common.SearchOrg.vCallControlType = "MultiInput";
//		
//		if(!oController._SerachOrgDialog) {
//			oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
//			oView.addDependent(oController._SerachOrgDialog);
//		}
//		oController._SerachOrgDialog.open();
//	},
	
//	onCreateEducation : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
//		var oController = oView.getController();
//		
//		var oRpern = sap.ui.getCore().byId(oController.PAGEID + "_ETS_Rpern");
//		var oCustomData = oRpern.getCustomData();
//		var vEname = oRpern.getValue();
//		var vFulln = "";
//		var vPernr = "";
//		if(oCustomData && oCustomData.length) {
//			for(var i=0; i<oCustomData.length; i++) {
//				if(oCustomData[i].getKey() == "Pernr") {
//					vPernr = oCustomData[i].getValue();
//				} else if(oCustomData[i].getKey() == "Fulln") {
//					vFulln = oCustomData[i].getValue();
//				}
//			}
//		}
//		
//		if(vPernr == "") {
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
//			return;
//		}
//		oController.onETSClose();
//
//		sap.ui.getCore().getEventBus().publish("nav", "to", {
//		      id : "zui5_hrxx_acteducation.EducationRequest",
//		      data : {
//		    	 ActionType : "100",
//		    	 Astat : "00",
//		    	 Persa : oController._vPersa,
//		    	 Pernr : vPernr,
//		    	 Seqnr : "",
//		    	 Rpern : vEname,
//		    	 Rorgt : vFulln, 
//		    	 Molga : oController._vMolga,
//		    	 Chgfg : "N",
//		    	 Appty : "90",
//		    	 FromPageId : "zui5_hrxx_acteducation.EducationRequestList"
//		      }
//		});
//	},
	
//	onUpdateEducation : function(oEvent) { 
//		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
//		var oController = oView.getController();
//		
//		var oETS_Table = sap.ui.getCore().byId(oController.PAGEID + "_ETS_Table");
//		var oContexts = oETS_Table.getSelectedContexts();
//		
//		var oRpern = sap.ui.getCore().byId(oController.PAGEID + "_ETS_Rpern");
//		var oCustomData = oRpern.getCustomData();
//		var vEname = oRpern.getValue();
//		var vFulln = "";
//		var vPernr = "";
//		if(oCustomData && oCustomData.length) {
//			for(var i=0; i<oCustomData.length; i++) {
//				if(oCustomData[i].getKey() == "Pernr") {
//					vPernr = oCustomData[i].getValue();
//				} else if(oCustomData[i].getKey() == "Fulln") {
//					vFulln = oCustomData[i].getValue();
//				}
//			}
//		}
//		
//		if(vPernr == "") {
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
//			return;
//		}
//		oController.onETSClose();
//		
//		if(oContexts && oContexts.length) {
//			sap.ui.getCore().getEventBus().publish("nav", "to", {
//			      id : "zui5_hrxx_acteducation.EducationRequest",
//			      data : {
//			    	 ActionType : "200",
//			    	 Astat : "00",
//			    	 Persa : oController._vPersa,
//			    	 Pernr : oContexts[0].getProperty("Pernr"),
//			    	 Seqnr : oContexts[0].getProperty("Seqnr"),
//			    	 Subty : oContexts[0].getProperty("Subty"),
//			    	 Objps : oContexts[0].getProperty("Objps"), 
//			    	 Rcontext : oContexts[0],
//			    	 Rpern : vEname,
//			    	 Rorgt : vFulln, 
//			    	 Molga : oController._vMolga,
//			    	 Chgfg : "C",
//			    	 Appty : "90",
//			    	 FromPageId : "zui5_hrxx_acteducation.EducationRequestList"
//			      }
//			});
//		} else {
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
//			return;
//		}		
//	},
	
//	onDeleteEducation : function(oEvent) {
//		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
//		var oController = oView.getController();
//		
//		var oETS_Table = sap.ui.getCore().byId(oController.PAGEID + "_ETS_Table");
//		var oContexts = oETS_Table.getSelectedContexts();
//		
//		var oRpern = sap.ui.getCore().byId(oController.PAGEID + "_ETS_Rpern");
//		var oCustomData = oRpern.getCustomData();
//		var vEname = oRpern.getValue();
//		var vFulln = "";
//		var vPernr = "";
//		if(oCustomData && oCustomData.length) {
//			for(var i=0; i<oCustomData.length; i++) {
//				if(oCustomData[i].getKey() == "Pernr") {
//					vPernr = oCustomData[i].getValue();
//				} else if(oCustomData[i].getKey() == "Fulln") {
//					vFulln = oCustomData[i].getValue();
//				}
//			}
//		}
//		
//		if(vPernr == "") {
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
//			return;
//		}
//		
//		if(oContexts && oContexts.length) {
//			sap.ui.getCore().getEventBus().publish("nav", "to", {
//			      id : "zui5_hrxx_acteducation.EducationRequest",
//			      data : {
//			    	 ActionType : "300",
//			    	 Astat : "00",
//			    	 Persa : oController._vPersa,
//			    	 Pernr : oContexts[0].getProperty("Pernr"),
//			    	 Seqnr : oContexts[0].getProperty("Seqnr"),
//			    	 Subty : oContexts[0].getProperty("Subty"),
//			    	 Objps : oContexts[0].getProperty("Objps"),
//			    	 Rcontext : oContexts[0],
//			    	 Rpern : vEname,
//			    	 Rorgt : vFulln,
//			    	 Molga : oController._vMolga,
//			    	 Chgfg : "D",
//			    	 Appty : "90",
//			    	 FromPageId : "zui5_hrxx_acteducation.EducationRequestList"
//			      }
//			});
//		} else {
//			sap.m.MessageBox.alert(oBundleText.getText("MSG_SELECT_PERSON"));
//			return;
//		}		
//		oController.onETSClose();
//	},
	
	onPressComplete : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
		var oController = oView.getController();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oContexts = oTable.getSelectedContexts();
		
		var mFamilyRegistList = oTable.getModel();
		
		if(oContexts && oContexts.length) {
			for(var i=0; i<oContexts.length; i++) {
				var vAstat = mFamilyRegistList.getProperty(oContexts[i] + "/Astat");
				if(vAstat != "20") {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_FAMILY_COMPLETE_INVALID_DOCUMENT"));
					return;
				}
			}
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_FAMLIY_COMPLETE_TARGET"));
			return;
		}
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_EDUCATION_SRV");
		
		var updateProcess = function() {
			if(oContexts && oContexts.length) {
				var process_result = false;
				
				for(var i=0; i<oContexts.length; i++) {
					var updateData = {};
					
					updateData.Appno = mFamilyRegistList.getProperty(oContexts[i] + "/Appno");
					updateData.Astat = "50";
					updateData.Chgfg =  mFamilyRegistList.getProperty(oContexts[i] + "/Chgfg");
					
					var oPath = "/EduBackgroundRegistSet(Appno='" + mFamilyRegistList.getProperty(oContexts[i] + "/Appno") + "')";
					oModel.update(
							oPath, 
							updateData, 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess EduBackgroundRegistSet update !!!");
						    },
						    function (oError) {
						    	var Err = {};
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails) {
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
						break;
					}
				}
				
				if(oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}
				
				if(!process_result) {
					return;
				}
				
				sap.m.MessageBox.alert(oBundleText.getText("MSG_FAMILY_COMPLETE_FINISHED"), {
					title: oBundleText.getText("INFORMATION"),
					onClose : function() {
						oController.onPressSearch();
					}
				});
				
			}
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
		
		sap.m.MessageBox.show(oBundleText.getText("MSG_EDUCATION_COMPLETE_QUESTION"), {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("TITLE_EDUCATION_COMPLETE"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: onProcessing
		});
	},
	
	onPressReject : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
		var oController = oView.getController();		
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oContexts = oTable.getSelectedContexts();
		var mFamilyRegistList = oTable.getModel();
		
		if(oContexts && oContexts.length) {
			for(var i=0; i<oContexts.length; i++) {
				var vAstat = mFamilyRegistList.getProperty(oContexts[i] + "/Astat");
				if(vAstat != "20") {
					sap.m.MessageBox.alert(oBundleText.getText("MSG_FAMILY_REJECT_INVALID_DOCUMENT"));
					return;
				}
			}
		} else {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_FAMLIY_REJECT_TARGET"));
			return;
		}
		
		if(!oController._CommentDialog) {
			oController._CommentDialog = sap.ui.jsfragment("zui5_hrxx_acteducation.fragment.EducationRejComment", oController);
			oView.addDependent(oController._CommentDialog);
		}
		
		oController._CommentDialog.open();
	},
	
	onBeforeOpenSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
		var oController = oView.getController();
		
		var oComment = sap.ui.getCore().byId(oController.PAGEID + "_POP_Ccomm");
		oComment.setValue("");
	},
	
	onPressConfirm : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
		var oController = oView.getController();
		
		var oComment = sap.ui.getCore().byId(oController.PAGEID + "_POP_Ccomm");
		var vComment = oComment.getValue();
		if(vComment == "") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_REJECT_COMMENT"));
			return;
		}
		
		oController.onCOClose();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oContexts = oTable.getSelectedContexts();
		
		var mActionReqList = sap.ui.getCore().getModel("EduBackgroundRegistSet");
		var oModel = sap.ui.getCore().getModel("ZHRXX_EDUCATION_SRV");
		
		var updateProcess = function() {
			if(oContexts && oContexts.length) {
				var process_result = false;
				
				for(var i=0; i<oContexts.length; i++) {
					var updateData = {};
					
					updateData.Appno = mActionReqList.getProperty(oContexts[i] + "/Appno");
					updateData.Ccomm = vComment;
					updateData.Astat = "40";
					
					var oPath = "/EduBackgroundRegistSet(Appno='" + mActionReqList.getProperty(oContexts[i] + "/Appno") + "')";
					oModel.update(
							oPath, 
							updateData, 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess EduBackgroundRegistSet update !!!");
						    },
						    function (oError) {
						    	var Err = {};
								if (oError.response) {
									Err = window.JSON.parse(oError.response.body);
									if(Err.error.innererror.errordetails) {
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
						break;
					}
				}
				
				if(oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}
				
				if(!process_result) {
					return;
				}
				
				sap.m.MessageBox.alert(oBundleText.getText("MSG_FAMILY_REJECT_FINISHED"), {
					title: oBundleText.getText("INFORMATION"),
					onClose : function() {
						oController.onPressSearch();
					}
				});
				
			}
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
		
		setTimeout(updateProcess, 300);
	},
	
	onCOClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
		var oController = oView.getController();		
		
		if(oController._CommentDialog.isOpen()) {
			oController._CommentDialog.close();
		}
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
	
	downloadExcel : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_acteducation.EducationRequestList");
		var oController = oView.getController();
		jQuery.sap.require("common.ExcelDownload");
		
		common.ExcelDownload.exceldown(oController);
	},

});