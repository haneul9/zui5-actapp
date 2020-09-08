jQuery.sap.require("sap.m.MessageBox");

sap.ui.controller("zui5_hrxx_actfamily.FamilyRequestList", {
	
	PAGEID : "FamilyRequestList",
	
	BusyDialog: null,

	_SortDialog : null,
	_CommentDialog : null,
	
	_vPersa : "",
	_vMolga : "",
	
	_vSelectedAppnoAttachFile : "",
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actfamily.FamilyRequestList
*/
	/**
	 * 페이지를 초기화한다.
	 * 페이지가 Open 된 후에 수행할 Method를 정의한다.
	 * 인사영역 리스트를 가져와서 인사영역 Control에 할당한다.	 * 
	 * @memberOf zui5_hrxx_actfamily.FamilyRequestList
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
	    
		this._vPersa = gPersa;
		this._vMolga = gMolga;
		
		var mPersAreaListSet = sap.ui.getCore().getModel("PersAreaListSet");
		var vPersAreaListSet = mPersAreaListSet.getProperty("/PersAreaListSet");
		
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
		
		oPersa.setSelectedKeys([this._vPersa]);
	},
	
	/**
	 * 페이지가 Open 된후에 수행한다.
	 * 신청서를 검색하는 Method를 호출한다.
	 * @param evt
	 */
	onAfterShow: function(evt) {
		this.onPressSearch();
	},
	
	onKeyUp : function(oEvent) {
		if(oEvent.which == 13) {
			var oView = sap.ui.getCore().byId("zui5_hrxx_actfamily.FamilyRequestList");
			var oController = oView.getController();
			oController.onPressSearch();
		}
	},
	/**
	 * 신청서를 검색한다.
	 * 신청일을 조건으로 검색한다.
	 * @param oEvent
	 */
	onPressSearch : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actfamily.FamilyRequestList");
		var oController = oView.getController();
		
		var oAppld_From = sap.ui.getCore().byId(oController.PAGEID + "_Appld_From");
		var oAppld_To = sap.ui.getCore().byId(oController.PAGEID + "_Appld_To");
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oRpern = sap.ui.getCore().byId(oController.PAGEID + "_Rpern");
		
		var oFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_ALL");
		var oFilterApproval = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_APPROVAL");
		var oFilterReject = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_REJECT");
		var oFilterCompalte = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_COMPLETE");
		
		var oFilters = [];	
	    var filterString = "";
	    
	    filterString += "/?$filter=";  
	    filterString += "(Actty%20ge%20%27" + "H" + "%27)";
		filterString += "%20and%20(Appld%20ge%20datetime%27" + oAppld_From.getValue() + "T00%3a00%3a00%27%20and%20Appld%20le%20datetime%27" + oAppld_To.getValue() + "T00%3a00%3a00%27)";
		
		//var vPersa = oPersa.getSelectedKey();
		//filterString += "%20and%20(Persa%20eq%20%27" + vPersa + "%27)";
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
		
		if(!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		}  else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
			
		}
		// filter 삭제
	    var oEname = sap.ui.getCore().byId(oController.PAGEID + "_FILTER_Ename"); 
	    if(oEname != undefined){
	    	oEname.setValue("");
		}
	    
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		var mFamilyRegistList = sap.ui.getCore().getModel("FamilyRegistList");
		var vFamilyRegistList = {FamilyRegistListSet : []};
		
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt4 = 0, vReqCnt5 = 0;
		
		var readAfterProcess = function() {
			oFilterAll.setCount(vReqCntAll);
			oFilterApproval.setCount(vReqCnt2);
			oFilterReject.setCount(vReqCnt4);
			oFilterCompalte.setCount(vReqCnt5);
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
			var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
			oTable.setModel(mFamilyRegistList);
			oTable.bindItems("/FamilyRegistListSet", oColumnList);
			
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
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_FAMILY_SRV");
		oModel.read("/FamilyRegistListSet" + filterString, 
					null, 
					null, 
					true,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vFamilyRegistList.FamilyRegistListSet.push(oData.results[i]);
								
								if(oData.results[i].Astat == "10") vReqCnt1++;
								else if(oData.results[i].Astat == "20" || oData.results[i].Astat == "25") vReqCnt2++;
								else if(oData.results[i].Astat == "40") vReqCnt4++;
								else if(oData.results[i].Astat == "50") vReqCnt5++;
							}
							vReqCntAll = oData.results.length;
							mFamilyRegistList.setData(vFamilyRegistList);
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
	
	/**
	 * 상태별 IconTabbar의 탭을 선택시에 수행된다.
	 * 조건으로 해당 탭의 상태 값을 넘겨준다.
	 * @param oEvent
	 */
	handleIconTabBarSelect : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actfamily.FamilyRequestList");
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
	/**
	 * MultiSelect를 위한 ComboBox
	 */
	onChangeComboBox : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actfamily.FamilyRequestList");
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
	
	/**
	 * 특정 신청서를 클릭하면 상태에 따라 확정/반려 등을 할 수 있는 ESS의 페이지로 이동한다.(FamilyRequest)
	 * @param oEvent
	 */
	onSelectRow : function(oEvent) {
		
		var oContext = oEvent.getSource().getBindingContext();

		var mActionReqList = sap.ui.getCore().getModel("FamilyRegistList");		
	
    	sap.ui.getCore().getEventBus().publish("nav", "to", {
    	  id : "zui5_hrxx_family.FamilyRequest",
	      data : {
	    	  Rcontext : mActionReqList.getProperty(oContext.sPath),
	    	  Astat : mActionReqList.getProperty(oContext + "/Astat"),
	    	  Appno : mActionReqList.getProperty(oContext + "/Appno"),
	    	  Persa : mActionReqList.getProperty(oContext + "/Persa"),
	    	  Molga : mActionReqList.getProperty(oContext + "/Molga"),
	    	  Subty : mActionReqList.getProperty(oContext + "/Subty"),
		      Objps : mActionReqList.getProperty(oContext + "/Objps"),
	    	  Chgfg : mActionReqList.getProperty(oContext + "/Chgfg"),
	    	  Pernr : mActionReqList.getProperty(oContext + "/Pernr"),
	    	  Rpern : mActionReqList.getProperty(oContext + "/Rpern"),
	    	  Rorgt : mActionReqList.getProperty(oContext + "/Rorgt"),
	    	  Zzcaltltx : mActionReqList.getProperty(oContext + "/Zzcaltltx"),
	    	  Zzjobgrtx : mActionReqList.getProperty(oContext + "/Zzjobgrtx"),
	    	  Appty : "60",
	    	  FromPageId : "zui5_hrxx_actfamily.FamilyRequestList"
	      }
		});			
		
	},	
	
	/**
	 * 리스트의 정렬을 위한 Dialog를 Open 한다.
	 * @param oEvent
	 */
	onPressSort : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actfamily.FamilyRequestList");
		var oController = oView.getController();		
		
		if(!oController._SortDialog) {
			oController._SortDialog = sap.ui.jsfragment("zui5_hrxx_actfamily.fragment.FamilyRegistListSort", oController);
			oView.addDependent(oController._SortDialog);
		}
		
		oController._SortDialog.open();
	},
	
	/**
	 * 리스트의 정렬를 처리한다.
	 * @param oEvent
	 */
	onConfirmSortDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actfamily.FamilyRequestList");
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
	
	/**
	 * 리스트에서 선택된 신청서에 대해 일괄 확정 처리한다.
	 * @param oEvent
	 */
	onPressComplete : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actfamily.FamilyRequestList");
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
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_FAMILY_SRV");
		
		var updateProcess = function() {
			if(oContexts && oContexts.length) {
				var process_result = false;
				
				for(var i=0; i<oContexts.length; i++) {
					var updateData = {};
					
					updateData.Appno = mFamilyRegistList.getProperty(oContexts[i] + "/Appno");
					updateData.Pernr = mFamilyRegistList.getProperty(oContexts[i] + "/Pernr");
					updateData.Astat = "50";
					updateData.Zzhrcfm = "X";
					updateData.Apchk = "X";
					
					var oPath = "/FamilyRegisterSet(Appno='" + mFamilyRegistList.getProperty(oContexts[i] + "/Appno") + "')";
					oModel.update(
							oPath, 
							updateData, 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess FamilyRegisterSet update !!!");
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
		
		sap.m.MessageBox.show(oBundleText.getText("MSG_FAMLIY_COMPLETE_QUESTION"), {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("TITLE_FAMILY_COMPLETE"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: onProcessing
		});
	},
	
	/**
	 * 리스트에서 선택된 신청서에 대해 일괄 반려처리하기 위해 반려의견을 입력할 Dialog를 Open한다.
	 * @param oEvent
	 */
	onPressReject : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actfamily.FamilyRequestList");
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
			oController._CommentDialog = sap.ui.jsfragment("zui5_hrxx_actfamily.fragment.Comment", oController);
			oView.addDependent(oController._CommentDialog);
		}
		
		oController._CommentDialog.open();
	},
	
	/**
	 * 반려의견 Dialog를 Open 하기전에 반려의견 값을 초기화 한다.
	 * @param oEvent
	 */
	onBeforeOpenSearchDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actfamily.FamilyRequestList");
		var oController = oView.getController();
		
		var oComment = sap.ui.getCore().byId(oController.PAGEID + "_Ccomm");
		oComment.setValue("");
	},
	
	/**
	 * 반려의견을 가지고 선택된 신청서를 반려처리 한다.
	 * @param oEvent
	 */
	onPressConfirm : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actfamily.FamilyRequestList");
		var oController = oView.getController();
		
		var oComment = sap.ui.getCore().byId(oController.PAGEID + "_Ccomm");
		var vComment = oComment.getValue();
		if(vComment == "") {
			sap.m.MessageBox.alert(oBundleText.getText("MSG_REJECT_COMMENT"));
			return;
		}
		
		oController.onCOClose();
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oContexts = oTable.getSelectedContexts();
		
		var mActionReqList = sap.ui.getCore().getModel("FamilyRegistList");
		var oModel = sap.ui.getCore().getModel("ZHRXX_FAMILY_SRV");
		
		var updateProcess = function() {
			if(oContexts && oContexts.length) {
				var process_result = false;
				
				for(var i=0; i<oContexts.length; i++) {
					var updateData = {};
					
					updateData.Appno = mActionReqList.getProperty(oContexts[i] + "/Appno");
					updateData.Pernr = mActionReqList.getProperty(oContexts[i] + "/Pernr");
					updateData.Ccomm = vComment;
					updateData.Astat = "40";
					
					var oPath = "/FamilyRegisterSet(Appno='" + mActionReqList.getProperty(oContexts[i] + "/Appno") + "')";
					oModel.update(
							oPath, 
							updateData, 
							null,
						    function (oData, response) {
								process_result = true;
								common.Common.log("Sucess FamilyRegisterSet update !!!");
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
	
	/**
	 * 반려의견 Dialog를 Close한다.
	 * @param oEvent
	 */
	onCOClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actfamily.FamilyRequestList");
		var oController = oView.getController();		
		
		if(oController._CommentDialog.isOpen()) {
			oController._CommentDialog.close();
		}
	},

	/*
	 * Excel download
	 */
	
	downloadExcel : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actfamily.FamilyRequestList");
		var oController = oView.getController();
		jQuery.sap.require("common.ExcelDownload");
		
		common.ExcelDownload.exceldown(oController);
	},
});