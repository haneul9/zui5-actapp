jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");
jQuery.sap.require("common.SearchUser1");
jQuery.sap.require("common.AttachFileAction");

sap.ui.controller("zui5_hrxx_actcerti.CertiAppMain", {
	PAGEID : "CertiAppMain",
	
	BusyDialog : null,
	_CommentDialog : null,
	_vAppty : "70",
	_vActty : "H",
	
//	oBundleText : jQuery.sap.resources({
//		url : "/sap/bc/ui5_ui5/sap/zhrxx_common/translation/i18n.properties" , //번역파일 주소
//		locale : sap.ui.getCore().getConfiguration().getLanguage()
//	}),
	
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf epmproductapp.EPMProductApp
*/
	onInit: function() {
		//if (!jQuery.support.touch) { // apply compact mode if touch is not supported
	         this.getView().addStyleClass("sapUiSizeCompact");
		//};
		var oPersaModel = sap.ui.getCore().getModel("PersaModel");
		var vPersaData = oPersaModel.getProperty("/PersAreaListSet");
		
		var oPersa = sap.ui.getCore().byId(this.PAGEID + "_Persa");
		var oIconTabbar = sap.ui.getCore().byId(this.PAGEID + "_ICONBAR");
		
		var skey = jQuery.sap.getUriParameters().get("skey");
		try {
			for(var i=0; i<vPersaData.length; i++) {
				oPersa.addItem(
					new sap.ui.core.Item({
						key : vPersaData[i].Persa, 
						text : vPersaData[i].Pbtxt
					})
				);
			};
			if(skey && skey != "") {
				oIconTabbar.setSelectedKeys(skey);
			} else {
				oPersa.setSelectedKeys([vPersaData[0].Persa]);
			}
			
		} catch(ex) {
			common.Common.log(ex);
		}
		
		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function (evt) {
				//this.onBeforeShow(evt);
			}, this),
			onAfterShow  : jQuery.proxy(function (evt) {
				//common.Common.log("onAfterShow " + new Date());
				this.onBeforeShow(evt);
			}, this),
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
	onBeforeShow: function(evt) {
		this.onPressSearch();
	},
	
	/* IconTabFilter의 Icon을 선택할 시 발생되는 Event 
	 * Filter를 걸어준다
	 */
	handleIconTabBarSelect : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcerti.CertiAppMain");
		var oController = oView.getController();

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE"); 
		
		var oBinding = oTable.getBinding("items"),
	      sKey = oEvent.getParameter("selectedKey"),
	      oFilters = [];
	    if (sKey === "approval") {
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
			var oView = sap.ui.getCore().byId("zui5_hrxx_actcerti.CertiAppMain");
			var oController = oView.getController();
			oController.onPressSearch();
		}
	},
	
	onChangeComboBox : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcerti.CertiAppMain");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcerti.CertiAppMain");
		var oController = oView.getController();
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_Persa");
		var oAppld_From = sap.ui.getCore().byId(oController.PAGEID + "_Appld_From");
		var oAppld_To = sap.ui.getCore().byId(oController.PAGEID + "_Appld_To");
		var oRpern = sap.ui.getCore().byId(oController.PAGEID + "_Rpern");
		
		var oFilterAll = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_ALL");
		var oFilterApproval = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_APPROVAL");
		var oFilterReject = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_REJECT");
		var oFilterCompalte = sap.ui.getCore().byId(oController.PAGEID + "_ICONFILTER_COMPLETE");
	    var filterString = "";
	    filterString += "/?$filter=";  
		filterString += "(Appld%20ge%20datetime%27" + oAppld_From.getValue() + "T00%3a00%3a00%27%20and%20Appld%20le%20datetime%27" + oAppld_To.getValue() + "T00%3a00%3a00%27)";
		filterString += "%20and%20Actty%20eq%20%27" + oController._vActty + "%27";
		//filterString += "%20and%20";
		//filterString += "%20Persa%20eq%20%27" + oPersa.getSelectedKey() +  "%27";
		filterString += "%20and%20Rpern%20eq%20%27" + encodeURI(oRpern.getValue()) +  "%27";
		
		//추가	
		var oFilters = [];	
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
		
		var mCertiRegistrationList = sap.ui.getCore().getModel("CertiRegistrationList");
		var vCertiRegistrationList = {CertiRegistrationListSet : []};
		
		var vReqCntAll = 0,  vReqCnt2 = 0,  vReqCnt4 = 0, vReqCnt5 = 0;
		
		var readAfterProcess = function() {
			oFilterAll.setCount(vReqCntAll);
			oFilterApproval.setCount(vReqCnt2);
			oFilterReject.setCount(vReqCnt4);
			oFilterCompalte.setCount(vReqCnt5);
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
			var oColumnList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
			oTable.setModel(mCertiRegistrationList);
			oTable.bindItems("/CertiRegistrationListSet", oColumnList);
			
			var oIconTabbar = sap.ui.getCore().byId(oController.PAGEID + "_ICONBAR");
			var sKey = oIconTabbar.getSelectedKey();
			
			var oBinding = oTable.getBinding("items");
			var oFilters = [];
		    if (sKey === "approval") {
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

		var oModel = sap.ui.getCore().getModel("ZHRXX_CERTI_SRV");
		oModel.read("/CertiRegistrationSet" + filterString, 
					null, 
					null, 
					true,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vCertiRegistrationList.CertiRegistrationListSet.push(oData.results[i]);
								if(oData.results[i].Astat == "20") vReqCnt2++;
								else if(oData.results[i].Astat == "40") vReqCnt4++;
								else if(oData.results[i].Astat == "50") vReqCnt5++;
							}
						}
						vReqCntAll = oData.results.length;
						mCertiRegistrationList.setData(vCertiRegistrationList);
						readAfterProcess();
					},
					function(oResponse) {
						common.Common.log(oResponse);
						if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
							oController.BusyDialog.close();
						};
					}
		);
	},
	
	onSelectRow : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcerti.CertiAppMain");
		var oController = oView.getController();		
		var oContext = oEvent.getSource().getBindingContext();
		var mCertiRegistrationList = sap.ui.getCore().getModel("CertiRegistrationList");
		
		sap.ui.getCore().getEventBus().publish("nav", "to", {
	    	  id : "zui5_hrxx_certi.CertiRequest",
		      data : {
		    	  Rcontext : mCertiRegistrationList.getProperty(oContext.sPath),
		    	  Astat : mCertiRegistrationList.getProperty(oContext + "/Astat"),
		    	  Appno : mCertiRegistrationList.getProperty(oContext + "/Appno"),
		    	  Persa : mCertiRegistrationList.getProperty(oContext + "/Persa"),
		    	  Subty : mCertiRegistrationList.getProperty(oContext + "/Subty"),
			      Objps : mCertiRegistrationList.getProperty(oContext + "/Objps"),
		    	  Seqnr : mCertiRegistrationList.getProperty(oContext + "/Seqnr"),
		    	  Sprps : mCertiRegistrationList.getProperty(oContext + "/Sprps"),
		    	  Chgfg : mCertiRegistrationList.getProperty(oContext + "/Chgfg"),
		    	  Pernr : mCertiRegistrationList.getProperty(oContext + "/Pernr"),
		    	  Rpern : mCertiRegistrationList.getProperty(oContext + "/Rpern"),
		    	  Rorgt : mCertiRegistrationList.getProperty(oContext + "/Rorgt"),
		    	  Begda : mCertiRegistrationList.getProperty(oContext + "/Begda"),
		    	  Endda : mCertiRegistrationList.getProperty(oContext + "/Endda"),
		    	  Zzcaltltx : mCertiRegistrationList.getProperty(oContext + "/Zzcaltltx"),
		    	  Zzjobgrtx : mCertiRegistrationList.getProperty(oContext + "/Zzjobgrtx"),
		    	  Appty : oController._vAppty,
		    	  Actty : oController._vActty,
		    	  FromPageId : "zui5_hrxx_actcerti.CertiAppMain"
		      }
		});	
	},
	
	onPressExecute : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcerti.CertiAppMain");
		var oController = oView.getController();
		var oModel = sap.ui.getCore().getModel("ZHRXX_CERTI_SRV");
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		var oComment = sap.ui.getCore().byId(oController.PAGEID + "_Ccomm"); 
		var vCcomm = "";
		var controlData = {};
		var vAstat = "";
		var confirmMsg = "";
		var vErrMsg = "";
		// 승인자 Comment 창이 Open 시에는 반려로 처리
		if(oController._CommentDialog && oController._CommentDialog.isOpen()) {
			vCcomm = oComment.getValue();
			vAstat = "40";
			confirmMsg = oBundleText.getText("MSG_CERTI_REJECT_QUESTION");  
		}else{
			vAstat = "50";
			confirmMsg = oBundleText.getText("MSG_CERTI_COMPLETE_QUESTION");  
			if(vContexts.length < 1){
				common.Common.showErrorMessage(oBundleText.getText("MSG_COMPETE_TARGET"));
				return ;
			}
			for(var i = 0; i< vContexts.length; i++ ){
				if(vContexts[i].getProperty("Astat") != "20"){
					console.log(vContexts[i].getProperty("Astat"));
					common.Common.showErrorMessage(oBundleText.getText("MSG_FAMILY_COMPLETE_INVALID_DOCUMENT"));
					return ;
				}
			}
		}
		
		var updateProcess = function(){
			for(var i = 0; i < vContexts.length; i++) {
				var oPath = "/CertiRegistrationSet(Appno='" +vContexts[i].getProperty("Appno") + 	"')";
				controlData = vContexts[i].getProperty(vContexts[i].sPath);
				controlData.Ccomm = vCcomm;
				controlData.Actty = oController._vActty;
				controlData.Astat = vAstat;
				oModel.update(
						oPath, 
						controlData,
						null,
					    function (oData, response) {
							process_result = true;
							common.Common.log("Sucess CertiRegistration Reject or Complete !!!");
					    },
					    function (oError) {
					    	var Err = {};
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								vErrMsg = Err.error.innererror.errordetails[0].message;
							} else {
								vErrMsg = oError;
							}
							process_result = false;
					    }
			    );
				
				if(!process_result){
					sap.m.MessageBox.alert(vErrMsg, {
					 	icon: sap.m.MessageBox.Icon.ERROR,
						title: oBundleText.getText("ACTION_COMPLETE_STATUS3"),
						onClose : function() {
							oController.onPressSearch();
						}
					});
					break;
				}
			}
			if(process_result){
				if(controlData.Astat == "50"){
					  sap.m.MessageBox.alert(oBundleText.getText("MSG_CERTI_COMPLETE"), {
						 	icon: sap.m.MessageBox.Icon.INFORMATION,
							title: oBundleText.getText("INFORMATION"),
							onClose : function() {
								oController.onPressSearch();
							}
				 	 });
				}else{
					 // 사유 입력 창 닫기
					 oController.onCOClose();
					 sap.m.MessageBox.alert(oBundleText.getText("MSG_CERTI_REJECT"), {
						 	icon: sap.m.MessageBox.Icon.INFORMATION,
							title: oBundleText.getText("INFORMATION"),
							onClose : function() {
								oController.onPressSearch();
							}
				 	 });
				}
			}else{
				oController.onPressSearch();
			}					
		};
		
		
		sap.m.MessageBox.show(confirmMsg, {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: oBundleText.getText("INFORMATION"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
	        onClose: function(oAction) { 
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
	    			oController.BusyDialog.open();
	        		setTimeout(updateProcess, 300);
	        	}
	        }
		});
		
		
	},
	
	onPressSort : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcerti.CertiAppMain");
		var oController = oView.getController();		
		
		if(!oController._SortDialog) {
			oController._SortDialog = sap.ui.jsfragment("zui5_hrxx_actcerti.fragment.CertiAppListSort", oController);
			oView.addDependent(oController._SortDialog);
		}
		
		oController._SortDialog.open();
	},
	
	onConfirmSortDialog : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcerti.CertiAppMain");
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
	
	onCOOpen : function(oEvnet){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcerti.CertiAppMain");
		var oController = oView.getController();		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
		var vContexts = oTable.getSelectedContexts(true);
		
		if(vContexts.length < 1){
			common.Common.showErrorMessage(oBundleText.getText("MSG_REJECT_TARGET"));
			return ;
		}
		for(var i = 0; i< vContexts.length; i++ ){
			if(vContexts[i].getProperty("Astat") != "20"){
				common.Common.showErrorMessage(oBundleText.getText("MSG_FAMILY_REJECT_INVALID_DOCUMENT"));
				return ;
			}
		}
		
		if(!oController._CommentDialog) {
			oController._CommentDialog = sap.ui.jsfragment("zui5_hrxx_actcerti.fragment.CertiInputComment", oController);
			oView.addDependent(oController._CommentDialog);
		}
		
		oController._CommentDialog.open();
			
	},
	
	onCOOpen_inDialog : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcerti.CertiAppMain");
		var oController = oView.getController();		
		if(!oController._CommentDialog) {
			oController._CommentDialog = sap.ui.jsfragment("zui5_hrxx_actcerti.fragment.CertiInputComment", oController);
			oView.addDependent(oController._CommentDialog);
		}
		
		oController._CommentDialog.open();
	},
	
	onBeforeOpenComment : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcerti.CertiAppMain");
		var oController = oView.getController();		
		var oCommentDialog = sap.ui.getCore().byId(oController.PAGEID + "_CO_Dialog");
		var oComment = sap.ui.getCore().byId(oController.PAGEID + "_Ccomm");
		oComment.setValue("");
		oCommentDialog.setTitle(oBundleText.getText("TITLE_INPUT_REJECT_COMMENT"));
	},
	
	onPressConfirm : function(oEvent){
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcerti.CertiAppMain");
		var oController = oView.getController();		
		var oComment = sap.ui.getCore().byId(oController.PAGEID + "_Ccomm");
		if(!oComment.getValue()){
			common.Common.showErrorMessage(oBundleText.getText("MSG_INPUT_REJECT_COMMENT"));
			return ;
		}
		
		oController.onPressExecute();
		
	},
	
	onCOClose : function(oEvent) {
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcerti.CertiAppMain");
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
		var oView = sap.ui.getCore().byId("zui5_hrxx_actcerti.CertiAppMain");
		var oController = oView.getController();
		jQuery.sap.require("common.ExcelDownload");
		
		common.ExcelDownload.exceldown(oController);
	},
});