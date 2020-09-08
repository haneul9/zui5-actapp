jQuery.sap.require("common.Common");
jQuery.sap.require("sap.m.MessageBox");

sap.ui.controller("zui5_hrxx_actexam.ActExamMain", {
	PAGEID : "ActExamMain" ,
	BusyDialog : null,
	_vAppty : "50",
	_SortDialog : null ,
	_CommentDialog : null ,
	_vUploadFiles : null,
	_vPersa : "",
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_hrxx_actexam.ActExamMain
*/
	onInit: function() {
		
		this.getCodeList();
		this._vPersa = gPersa ; 
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
	    };

	    this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				this.onBeforeShow(evt);
			}, this)
		});  
	},

	onBeforeShow : function(oEvent) {
		this._locale = sap.ui.getCore().getConfiguration().getLanguage(); //언어
	    this.oBundleText = jQuery.sap.resources({
	    	url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
	    	locale : this._locale
	    });
	    this.onPressSearch(oEvent);
	} ,
	
	getCodeList : function(oEvnet){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actexam.ActExamMain");
		var oController = oView.getController();
		var oModel = sap.ui.getCore().getModel("ZHRXX_ACTIONAPP_SRV");
		var oPersaSelect = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var vPersa = "";
		
		var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
		var vEmpLoginInfo = mEmpLoginInfo.getProperty("/EmpLoginInfoSet");
		if(vEmpLoginInfo.length > 0){
			vPersa = vEmpLoginInfo[0].Persa ; 
		}
	
		//인사영역 리스트
		try {
			oModel.read("/PersAreaListSet/?$filter=Actty%20eq%20%271%27", 
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								oPersaSelect.addItem(new sap.ui.core.Item({
									key : oData.results[i].Persa, 
									text : oData.results[i].Pbtxt
								}));
							}
							oPersaSelect.setSelectedKeys(vPersa);
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
		} catch(ex) {
			common.Common.log(ex);
		}
	},
	
	handleIconTabBarSelect : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actexam.ActExamMain");
		var oController = oView.getController();
	
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE"); 
		
		var oBinding = oTable.getBinding("items"),
	        sKey = oEvent.getParameter("selectedKey"),
	        oFilters = [];
	    if (sKey === "apply") {
	      oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "20"));
	    } else if (sKey === "reject") {
	      oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "40"));
	    } else if (sKey === "complete") {
		  oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "50"));	      
	    }
	    oBinding.filter(oFilters);
	},
	
	onKeyUp : function(oEvent) {
		if(oEvent.which == 13) {
			var oView = sap.ui.getCore().byId("zui5_hrxx_actexam.ActExamMain");
			var oController = oView.getController();
			oController.onPressSearch();
		}
	},
	
	onPressSearch : function(oEvnet){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actexam.ActExamMain");
		var oController = oView.getController();
	
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oAppld_From = sap.ui.getCore().byId(oController.PAGEID + "_Appld_From");
		var oAppld_To = sap.ui.getCore().byId(oController.PAGEID + "_Appld_To");
		var oRpern = sap.ui.getCore().byId(oController.PAGEID + "_Rpern");
		
		var oFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_ALL");
		var oFilterApply = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_APPLY");
		var oFilterReject = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_REJECT");
		var oFilterCompalte = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_COMPLETE");
	
	    var oFilters = [];	
	    var filterString = "";
	    
	    filterString += "/?$filter=";  
	    
	    
		if ( oAppld_From.getValue() != null && oAppld_From.getValue() != "" ){
			if ( oAppld_To.getValue() == null || oAppld_To.getValue() == "" ){
				filterString += "(Appld%20ge%20datetime%27" + oAppld_From.getValue() + "T00%3a00%3a00%27%20and%20Appld%20le%20datetime%27" + "9999-12-31" + "T00%3a00%3a00%27)";
			}else{
				filterString += "(Appld%20ge%20datetime%27" + oAppld_From.getValue() + "T00%3a00%3a00%27%20and%20Appld%20le%20datetime%27" + oAppld_To.getValue() + "T00%3a00%3a00%27)";
			}
			
		}else if( oAppld_To.getValue() != null && oAppld_To.getValue() != ""){
			if ( oAppld_From.getValue() == null || oAppld_From.getValue() == "" ){
				filterString += "(Appld%20ge%20datetime%27" + "1900-01-01" + "T00%3a00%3a00%27%20and%20Appld%20le%20datetime%27" +  oAppld_To.getValue() + "T00%3a00%3a00%27)";
			}else{
				filterString += "(Appld%20ge%20datetime%27" + oAppld_From.getValue() + "T00%3a00%3a00%27%20and%20Appld%20le%20datetime%27" + oAppld_To.getValue() + "T00%3a00%3a00%27)";
			}
		}
	    	
		filterString += "%20and%20";
		filterString += "Actty%20eq%20%27" + "H" + "%27";
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
		//oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oPersa.getSelectedKey()));
		oFilters.push(new sap.ui.model.Filter("Actty", sap.ui.model.FilterOperator.EQ, "H"));
		
		if(!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : oBundleText.getText("MSG_SEARCH_WAIT")}));
			oController.getView().addDependent(oController.BusyDialog);
		} 
		if(!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
		
		var mLangExamRegisterList = sap.ui.getCore().getModel("LangExamRegisterList");
		var vLangExamRegisterList = {LangExamRegisterListSet : []};
		
		var vReqCntAll = 0, vReqCnt1 = 0, vReqCnt2 = 0, vReqCnt3 = 0;
		
		var readAfterProcess = function() {
			oFilterAll.setCount(vReqCntAll);
			oFilterApply.setCount(vReqCnt1);
			oFilterReject.setCount(vReqCnt2);
			oFilterCompalte.setCount(vReqCnt3);
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
			var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
			oTable.setModel(mLangExamRegisterList);
			oTable.bindItems("/LangExamRegisterListSet", oColumnList);
			
			var oIconTabbar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
			var sKey = oIconTabbar.getSelectedKey();
			
			var oBinding = oTable.getBinding("items");
			var oFilters = [];
			if (sKey === "apply") {
		      oFilters.push(new sap.ui.model.Filter("Astat", "EQ", "20"));
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
	
		var oModel = sap.ui.getCore().getModel("ZHRXX_LANGUAGE_SRV");
		oModel.read("/LangExamRegisterSet" + filterString, 
				null, 
				null, 
				true,
				function(oData, oResponse) {
					if(oData && oData.results) {
						for(var i=0; i<oData.results.length; i++) {
							vLangExamRegisterList.LangExamRegisterListSet.push(oData.results[i]);
							if(oData.results[i].Astat == "20") vReqCnt1++;
							else if(oData.results[i].Astat == "40") vReqCnt2++;
							else if(oData.results[i].Astat == "50") vReqCnt3++;
						}
						vReqCntAll = oData.results.length;
						mLangExamRegisterList.setData(vLangExamRegisterList);
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
	
	onPressComplete : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actexam.ActExamMain");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oJSONModel = oTable.getModel();
		var JSONData = oJSONModel.getProperty("/LangExamRegisterListSet");
		var vContexts = oTable.getSelectedContexts(true);
		var oModel = sap.ui.getCore().getModel("ZHRXX_LANGUAGE_SRV");
		var process_result = null ;
		if(vContexts.length < 1){
			common.Common.showErrorMessage(oBundleText.getText( "MSG_UPDATE_TARGET"));
			return ;
		}
		for(var i =0; i< vContexts.length ; i++ ){
			if(vContexts[i].getProperty("Astat") != "20"){
				common.Common.showErrorMessage(oBundleText.getText( "MSG_FAMILY_COMPLETE_INVALID_DOCUMENT"));
				return ;
			}
		}
	    var completeProcess = function(oAction) { 
	    	if(JSONData && JSONData.length) {
				if(vContexts && vContexts.length) { 
					for(var i = 0; i < vContexts.length; i++) {
						var oPath = "/LangExamRegisterSet(Appno='" +  vContexts[i].getProperty("Appno") +  "')";
						var updateData = {};
						updateData = vContexts[i].getProperty(vContexts[i].sPath);
						updateData.Endda = "\/Date(" + common.Common.getTime(vContexts[i].getProperty("Endda")) + ")\/";
						updateData.Begda = "\/Date(" + common.Common.getTime(vContexts[i].getProperty("Begda")) + ")\/";
						updateData.Appty = oController._vAppty;
						updateData.Astat = "50";
						
						oModel.update(
								oPath, 
								updateData,
								null,
							    function (oData, response) {
									process_result = true;
									common.Common.log("Sucess LanguageRegister Update !!!");
							    },
							    function (oError) {
							    	var Err = {};
									if (oError.response) {
										Err = window.JSON.parse(oError.response.body);
										common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										common.Common.showErrorMessage(oError);
									}
									process_result = false;
							    }
					    );
						
						if(!process_result){
							break;
						}
					}
					if(oController.BusyDialog.isOpen()) {
						oController.BusyDialog.close();
					}
					if(process_result){
						sap.m.MessageBox.alert(oBundleText.getText("MSG_LANEXAM_COMPLETE"), {
						 	icon: sap.m.MessageBox.Icon.INFORMATION,
							title: oBundleText.getText("INFORMATION"),
							onClose : function() {
								
								oController.onPressSearch();
							}
						});
					}
				}
			}
	    };
	    
		var onProcessing = function(oAction) {
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
			
			setTimeout(completeProcess, 300);
			
		};
			
		sap.m.MessageBox.alert(oBundleText.getText("MSG_LANEXAM_COMPLETE_CONFIRM"), {
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title: oBundleText.getText("APPLY_COMPLETE"),
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
		        onClose: function(oAction){
		        	if(oAction === sap.m.MessageBox.Action.YES ) {
		        		onProcessing() ;
		        	}
		        }
		});
		 
	},
	
	onPressReject : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actexam.ActExamMain");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oJSONModel = oTable.getModel();
		var JSONData = oJSONModel.getProperty("/LangExamRegisterListSet");
		var vContexts = oTable.getSelectedContexts(true);
		var vCcomm = sap.ui.getCore().byId(oController.PAGEID + "_Ccomm").getValue();
		var oModel = sap.ui.getCore().getModel("ZHRXX_LANGUAGE_SRV");
		var process_result = null ;
		
		var rejectProcess = function(oAction) { 
			 if(JSONData && JSONData.length) {
				if(vContexts && vContexts.length) { 
					for(var i = 0; i < vContexts.length; i++) {
						var oPath = "/LangExamRegisterSet(Appno='" +  vContexts[i].getProperty("Appno") +  "')";
						
						var updateData = {};
						updateData = vContexts[i].getProperty(vContexts[i].sPath);
						updateData.Appty = oController._vAppty ;
						updateData.Endda = "\/Date(" + common.Common.getTime(vContexts[i].getProperty("Endda")) + ")\/";
						updateData.Begda = "\/Date(" + common.Common.getTime(vContexts[i].getProperty("Begda")) + ")\/";
						updateData.Astat = "40";
						updateData.Ccomm = vCcomm ;
						oModel.update(
								oPath, 
								updateData,
								null,
							    function (oData, response) {
									process_result = true;
									common.Common.log("Sucess LanguageRegister Update !!!");
							    },
							    function (oError) {
							    	var Err = {};
									if (oError.response) {
										Err = window.JSON.parse(oError.response.body);
										common.Common.showErrorMessage(Err.error.innererror.errordetails[0].message);
									} else {
										common.Common.showErrorMessage(oError);
									}
									process_result = false;
							    }
					    );
						
						if(!process_result){
							break;
						}
					}
				}
				
				if(!process_result) return;
				
				sap.m.MessageBox.alert(oBundleText.getText("MSG_LANEXAM_REJECT"), {
				 	icon: sap.m.MessageBox.Icon.INFORMATION,
					title: oBundleText.getText("INFORMATION"),
					onClose : function() {
						if(oController.BusyDialog.isOpen()) {
							oController.BusyDialog.close();
						}
						oController.onCOClose();
						oController.onPressSearch();
					}
				});
				
			}
		 };
		 
		var onProcessing = function(oAction) {
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
			
			setTimeout(rejectProcess, 300); 
			
		};
			
		sap.m.MessageBox.alert(oBundleText.getText("MSG_LANEXAM_REJCET_CONFIRM"), {
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title: oBundleText.getText("APPLY_REJECT"),
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
		        onClose: function(oAction){
		        	if(oAction === sap.m.MessageBox.Action.YES ) {
		        		onProcessing() ;
		        	}
		        }
		});
	},
	
	onOpenUri : function(oEvnet){
		var oControl = this;
		var oCustomData = oControl.getCustomData();
		var vAturl = oCustomData[0].getValue();
		
	//	var oContext = oEvent.getSource().getBindingContext();
	//	var mLangExamRegister = sap.ui.getCore().getModel("LangExamRegister");
	//	var vAturl = mLangExamRegister.getProperty(oContext + "/Aturl");
		window.open(vAturl,"Download");
	//	document.IFRAMEDOWNLOAD.location.href = vAturl;
		
		
	},
	
	onChangeComboBox : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actexam.ActExamMain");
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
	
	onSelectRow : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actexam.ActExamMain");
		var oController = oView.getController();			
		var oContext = oEvent.getSource().getBindingContext();
		var mLangExamRegisterList = sap.ui.getCore().getModel("LangExamRegisterList");
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "zui5_hrxx_languageexam.ActLanExamRequest",
		      data : {
		    	  Rcontext :  mLangExamRegisterList.getProperty(oContext.sPath),
		    	  Astat : mLangExamRegisterList.getProperty(oContext + "/Astat"),
		    	  Appno : mLangExamRegisterList.getProperty(oContext + "/Appno"),
		    	  Persa : oController._vPersa,
		    	  Subty : mLangExamRegisterList.getProperty(oContext + "/Subty"),
			      Objps : mLangExamRegisterList.getProperty(oContext + "/Objps"),
		    	  Seqnr : mLangExamRegisterList.getProperty(oContext + "/Seqnr"),
		    	  Sprps : mLangExamRegisterList.getProperty(oContext + "/Sprps"),
		    	  Chgfg : mLangExamRegisterList.getProperty(oContext + "/Chgfg"),
		    	  Begda : mLangExamRegisterList.getProperty(oContext + "/Begda"),
		    	  Endda : mLangExamRegisterList.getProperty(oContext + "/Endda"),
		    	  Pernr : mLangExamRegisterList.getProperty(oContext + "/Pernr"),
		    	  Rpern : mLangExamRegisterList.getProperty(oContext + "/Rpern"),
		    	  Rorgt : mLangExamRegisterList.getProperty(oContext + "/Rorgt"),
		    	  Zzcaltltx : mLangExamRegisterList.getProperty(oContext + "/Zzcaltltx"),
		    	  Zzjobgrtx : mLangExamRegisterList.getProperty(oContext + "/Zzjobgrtx"),
		    	  Actty : "H",
		    	  FromPageId : "zui5_hrxx_actexam.ActExamMain"
		      }
		});	
		
	},
	
	onPressSort : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actexam.ActExamMain");
		var oController = oView.getController();	
		if(!oController._SortDialog) {
			oController._SortDialog = sap.ui.jsfragment("zui5_hrxx_actexam.fragment.ExamListSort", oController);
			oView.addDependent(oController._SortDialog);
		}
		
		oController._SortDialog.open();
	},
	
	onConfirmSortDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actexam.ActExamMain");
		var oController = oView.getController();	
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var oBinding = oTable.getBinding("items");
		
		var mParams = oEvent.getParameters();
		
		var aSorters = [];
	    var sPath = mParams.sortItem.getKey();
	    var bDescending = mParams.sortDescending;
	    aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
	    oBinding.sort(aSorters);;
	},
	
	onCOOpen : function(oEvnet){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actexam.ActExamMain");
		var oController = oView.getController();
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		
		if(vContexts.length < 1){
			common.Common.showErrorMessage(oBundleText.getText( "MSG_UPDATE_TARGET"));
			return ;
		}
		for(var i =0; i< vContexts.length ; i++ ){
			if(vContexts[i].getProperty("Astat") != "20"){
				common.Common.showErrorMessage(oBundleText.getText( "MSG_FAMILY_REJECT_INVALID_DOCUMENT"));
				return ;
			}
		}
		
		if(!oController._CommentDialog) {
			oController._CommentDialog = sap.ui.jsfragment("zui5_hrxx_actexam.fragment.InputComment", oController);
			oView.addDependent(oController._CommentDialog);
		}
		
		oController._CommentDialog.open();
			
	},
	
	onBeforeOpenComment : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actexam.ActExamMain");
		var oController = oView.getController();		
		var oCommentDialog = sap.ui.getCore().byId(oController.PAGEID + "_CO_Dialog");
		var oComment = sap.ui.getCore().byId(oController.PAGEID + "_Ccomm");
		oComment.setValue("");
		oCommentDialog.setTitle(oBundleText.getText("TITLE_INPUT_REJECT_COMMENT"));
	},
	
	onCOClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actexam.ActExamMain");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actexam.ActExamMain");
		var oController = oView.getController();
		jQuery.sap.require("common.ExcelDownload");
		
		common.ExcelDownload.exceldown(oController);
	},
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_hrxx_actexam.ActExamMain
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_hrxx_actexam.ActExamMain
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_hrxx_actexam.ActExamMain
*/
//	onExit: function() {
//
//	}

});